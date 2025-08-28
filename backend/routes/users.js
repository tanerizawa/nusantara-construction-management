const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();

// Load users data
const loadUsers = async () => {
  try {
    const usersPath = path.join(__dirname, '../../data/users.json');
    const data = await fs.readFile(usersPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading users:', error);
    return { users: [] };
  }
};

// Save users data
const saveUsers = async (data) => {
  try {
    const usersPath = path.join(__dirname, '../../data/users.json');
    await fs.writeFile(usersPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving users:', error);
  }
};

// @route   GET /api/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/', async (req, res) => {
  try {
    const usersData = await loadUsers();
  const { role, status, q, sort = 'name', order = 'asc', limit = 20, page = 1 } = req.query;

    let users = usersData.users || [];
    // Text search across username/email/full name
    if (q) {
      const needle = String(q).toLowerCase();
      users = users.filter(u =>
        (u.username || '').toLowerCase().includes(needle) ||
        (u.email || '').toLowerCase().includes(needle) ||
        (u.profile?.fullName || '').toLowerCase().includes(needle)
      );
    }

    // Sort
    const safeOrder = String(order).toLowerCase() === 'desc' ? 'desc' : 'asc';
    const safeSort = ['name', 'joinDate', 'role'].includes(sort) ? sort : 'name';
    users.sort((a, b) => {
      let aVal;
      let bVal;
      if (safeSort === 'joinDate') {
        aVal = new Date(a.profile?.joinDate || 0).getTime();
        bVal = new Date(b.profile?.joinDate || 0).getTime();
      } else if (safeSort === 'role') {
        aVal = (a.role || '').toLowerCase();
        bVal = (b.role || '').toLowerCase();
      } else {
        aVal = (a.profile?.fullName || a.username || '').toLowerCase();
        bVal = (b.profile?.fullName || b.username || '').toLowerCase();
      }
      if (aVal === bVal) return 0;
      if (safeOrder === 'asc') return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });

    // Filter by role
    if (role) {
      users = users.filter(u => u.role === role);
    }

    // Filter by status
    if (status) {
      users = users.filter(u => u.profile.isActive === (status === 'active'));
    }

    // Remove sensitive data
    const safeUsers = users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      profile: user.profile,
      permissions: user.permissions
    }));

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedUsers = safeUsers.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedUsers,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(safeUsers.length / limit),
        count: safeUsers.length
      }
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const usersData = await loadUsers();
    const user = usersData.users.find(u => u.id === req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove sensitive data
    const safeUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      profile: user.profile,
      permissions: user.permissions
    };

    res.json({
      success: true,
      data: safeUser
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private (Admin or self)
router.put('/:id', async (req, res) => {
  try {
    const usersData = await loadUsers();
    const userIndex = usersData.users.findIndex(u => u.id === req.params.id);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user (exclude sensitive fields from direct update)
    const { password, ...updateData } = req.body;
    
    usersData.users[userIndex] = {
      ...usersData.users[userIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    // Handle password update separately if provided
    if (password) {
      const bcrypt = require('bcryptjs');
      usersData.users[userIndex].password = await bcrypt.hash(password, 10);
    }

    await saveUsers(usersData);

    // Return safe user data
    const safeUser = {
      id: usersData.users[userIndex].id,
      username: usersData.users[userIndex].username,
      email: usersData.users[userIndex].email,
      role: usersData.users[userIndex].role,
      profile: usersData.users[userIndex].profile,
      permissions: usersData.users[userIndex].permissions
    };

    res.json({
      success: true,
      message: 'User updated successfully',
      data: safeUser
    });

  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/users/:id/status
// @desc    Update user status (activate/deactivate)
// @access  Private (Admin only)
router.put('/:id/status', async (req, res) => {
  try {
    const { isActive } = req.body;
    const usersData = await loadUsers();
    const userIndex = usersData.users.findIndex(u => u.id === req.params.id);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user status
    usersData.users[userIndex].profile.isActive = isActive;
    usersData.users[userIndex].updatedAt = new Date().toISOString();

    await saveUsers(usersData);

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        id: usersData.users[userIndex].id,
        username: usersData.users[userIndex].username,
        isActive: usersData.users[userIndex].profile.isActive
      }
    });

  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const usersData = await loadUsers();
    const userIndex = usersData.users.findIndex(u => u.id === req.params.id);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent deleting admin users
    if (usersData.users[userIndex].role === 'admin') {
      return res.status(403).json({ error: 'Cannot delete admin user' });
    }

    // Remove user
    const deletedUser = usersData.users.splice(userIndex, 1)[0];
    await saveUsers(usersData);

    res.json({
      success: true,
      message: 'User deleted successfully',
      data: {
        id: deletedUser.id,
        username: deletedUser.username
      }
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/users/stats/overview
// @desc    Get user statistics
// @access  Private (Admin only)
router.get('/stats/overview', async (req, res) => {
  try {
    const usersData = await loadUsers();
    const users = usersData.users || [];

    const stats = {
      total: users.length,
      active: users.filter(u => u.profile.isActive).length,
      inactive: users.filter(u => !u.profile.isActive).length,
      byRole: users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {}),
      recentUsers: users
        .sort((a, b) => new Date(b.profile.joinDate) - new Date(a.profile.joinDate))
        .slice(0, 5)
        .map(user => ({
          id: user.id,
          username: user.username,
          role: user.role,
          joinDate: user.profile.joinDate,
          isActive: user.profile.isActive
        }))
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/users/roles
// @desc    Get available roles
// @access  Private
router.get('/roles/list', async (req, res) => {
  try {
    const roles = [
      { name: 'admin', description: 'System Administrator' },
      { name: 'project_manager', description: 'Project Manager' },
      { name: 'finance_manager', description: 'Finance Manager' },
      { name: 'inventory_manager', description: 'Inventory Manager' },
      { name: 'hr_manager', description: 'HR Manager' },
      { name: 'supervisor', description: 'Site Supervisor' }
    ];

    res.json({
      success: true,
      data: roles
    });

  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
