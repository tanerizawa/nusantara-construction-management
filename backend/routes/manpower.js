const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();

// Load manpower data
const loadManpower = async () => {
  try {
    const manpowerPath = path.join(__dirname, '../../data/manpower.json');
    const data = await fs.readFile(manpowerPath, 'utf8');
    const parsed = JSON.parse(data);
    return parsed.employees || [];
  } catch (error) {
    console.error('Error loading manpower:', error);
    return [];
  }
};

// Save manpower data
const saveManpower = async (employees) => {
  try {
    const manpowerPath = path.join(__dirname, '../../data/manpower.json');
    const currentData = await fs.readFile(manpowerPath, 'utf8');
    const parsed = JSON.parse(currentData);
    parsed.employees = employees;
    await fs.writeFile(manpowerPath, JSON.stringify(parsed, null, 2));
  } catch (error) {
    console.error('Error saving manpower:', error);
  }
};

// @route   GET /api/manpower
// @desc    Get all employees
// @access  Private
router.get('/', async (req, res) => {
  try {
    const employees = await loadManpower();
    const { department, position, status, q, sort = 'name', order = 'asc', limit = 20, page = 1 } = req.query;

    let filteredEmployees = employees;
    
    // Text search
    if (q) {
      const needle = String(q).toLowerCase();
      filteredEmployees = filteredEmployees.filter(emp =>
        (emp.name || '').toLowerCase().includes(needle) ||
        (emp.position || '').toLowerCase().includes(needle) ||
        (emp.department || '').toLowerCase().includes(needle) ||
        (emp.email || '').toLowerCase().includes(needle) ||
        (emp.employeeId || '').toLowerCase().includes(needle)
      );
    }

    // Filter by department
    if (department) {
      filteredEmployees = filteredEmployees.filter(emp => emp.department === department);
    }

    // Filter by position
    if (position) {
      filteredEmployees = filteredEmployees.filter(emp => emp.position === position);
    }

    // Filter by status
    if (status) {
      filteredEmployees = filteredEmployees.filter(emp => emp.status === status);
    }

    // Sort
    const safeOrder = String(order).toLowerCase() === 'desc' ? 'desc' : 'asc';
    const safeSort = ['name', 'position', 'joinDate', 'salary', 'department'].includes(sort) ? sort : 'name';
    
    filteredEmployees.sort((a, b) => {
      let aVal;
      let bVal;
      if (safeSort === 'salary') {
        aVal = a.salary || 0;
        bVal = b.salary || 0;
      } else if (safeSort === 'joinDate') {
        aVal = new Date(a.joinDate || 0).getTime();
        bVal = new Date(b.joinDate || 0).getTime();
      } else if (safeSort === 'position') {
        aVal = (a.position || '').toLowerCase();
        bVal = (b.position || '').toLowerCase();
      } else if (safeSort === 'department') {
        aVal = (a.department || '').toLowerCase();
        bVal = (b.department || '').toLowerCase();
      } else {
        aVal = (a.name || '').toLowerCase();
        bVal = (b.name || '').toLowerCase();
      }
      if (aVal === bVal) return 0;
      if (safeOrder === 'asc') return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });

    // Pagination
    const safeLimit = Math.max(1, Math.min(100, parseInt(limit) || 20));
    const safePage = Math.max(1, parseInt(page) || 1);
    const startIndex = (safePage - 1) * safeLimit;
    const endIndex = startIndex + safeLimit;
    
    const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredEmployees.length / safeLimit);

    res.json({
      success: true,
      data: paginatedEmployees,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total: filteredEmployees.length,
        totalPages: totalPages,
        hasNext: safePage < totalPages,
        hasPrev: safePage > 1
      }
    });
      manpower = manpower.filter(m => m.project && m.project.toLowerCase().includes(project.toLowerCase()));
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: error.message
    });
  }
});

// @route   GET /api/manpower/stats
// @desc    Get employee statistics
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    const manpowerPath = path.join(__dirname, '../../data/manpower.json');
    const data = await fs.readFile(manpowerPath, 'utf8');
    const parsed = JSON.parse(data);
    const employees = parsed.employees || [];

    const stats = {
      totalEmployees: employees.length,
      activeEmployees: employees.filter(emp => emp.status === 'active').length,
      inactiveEmployees: employees.filter(emp => emp.status === 'inactive').length,
      contractEmployees: employees.filter(emp => emp.employmentType === 'contract').length,
      permanentEmployees: employees.filter(emp => emp.employmentType === 'permanent').length,
      departments: parsed.departments || [],
      averageAttendance: employees.reduce((sum, emp) => sum + (emp.attendance?.currentMonthRate || 0), 0) / employees.length,
      totalOvertime: employees.reduce((sum, emp) => sum + (emp.overtime?.currentMonth || 0), 0),
      certificationExpiring: employees.filter(emp => 
        emp.certifications?.some(cert => cert.status === 'expiring_soon')
      ).length
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching employee stats:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: error.message
    });
  }
});

// @route   GET /api/manpower/departments
// @desc    Get all departments
// @access  Private
router.get('/departments', async (req, res) => {
  try {
    const manpowerPath = path.join(__dirname, '../../data/manpower.json');
    const data = await fs.readFile(manpowerPath, 'utf8');
    const parsed = JSON.parse(data);

    res.json({
      success: true,
      data: parsed.departments || []
    });

  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: error.message
    });
  }
});

// @route   GET /api/manpower/:id
// @desc    Get manpower by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const manpowerData = await loadManpower();
    const worker = manpowerData.find(m => m.id === parseInt(req.params.id));

    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    res.json({
      success: true,
      data: worker
    });

  } catch (error) {
    console.error('Error fetching worker:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/manpower/training
// @desc    Get training programs
// @access  Private
router.get('/training', async (req, res) => {
  try {
    const { status, category, employeeId } = req.query;
    const manpowerPath = path.join(__dirname, '../../data/manpower.json');
    const data = await fs.readFile(manpowerPath, 'utf8');
    const parsed = JSON.parse(data);
    let training = parsed.trainingPrograms || [];

    // Filter by status
    if (status) {
      training = training.filter(t => t.status === status);
    }

    // Filter by category
    if (category) {
      training = training.filter(t => t.category === category);
    }

    // Filter by employee participation
    if (employeeId) {
      training = training.filter(t => t.participants?.includes(employeeId));
    }

    res.json({
      success: true,
      data: training
    });

  } catch (error) {
    console.error('Error fetching training programs:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: error.message
    });
  }
});

// @route   GET /api/manpower/safety-incidents
// @desc    Get safety incidents
// @access  Private
router.get('/safety-incidents', async (req, res) => {
  try {
    const { status, severity, location, startDate, endDate } = req.query;
    const manpowerPath = path.join(__dirname, '../../data/manpower.json');
    const data = await fs.readFile(manpowerPath, 'utf8');
    const parsed = JSON.parse(data);
    let incidents = parsed.safetyIncidents || [];

    // Filter by status
    if (status) {
      incidents = incidents.filter(inc => inc.status === status);
    }

    // Filter by severity
    if (severity) {
      incidents = incidents.filter(inc => inc.severity === severity);
    }

    // Filter by location
    if (location) {
      incidents = incidents.filter(inc => inc.location?.includes(location));
    }

    // Filter by date range
    if (startDate && endDate) {
      incidents = incidents.filter(inc => 
        inc.incidentDate >= startDate && inc.incidentDate <= endDate
      );
    }

    res.json({
      success: true,
      data: incidents
    });

  } catch (error) {
    console.error('Error fetching safety incidents:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: error.message
    });
  }
});

// @route   GET /api/manpower/certification-alerts
// @desc    Get certification expiry alerts
// @access  Private
router.get('/certification-alerts', async (req, res) => {
  try {
    const { priority, status, employeeId } = req.query;
    const manpowerPath = path.join(__dirname, '../../data/manpower.json');
    const data = await fs.readFile(manpowerPath, 'utf8');
    const parsed = JSON.parse(data);
    let alerts = parsed.certificationAlerts || [];

    // Filter by priority
    if (priority) {
      alerts = alerts.filter(alert => alert.priority === priority);
    }

    // Filter by status
    if (status) {
      alerts = alerts.filter(alert => alert.status === status);
    }

    // Filter by employee
    if (employeeId) {
      alerts = alerts.filter(alert => alert.employeeId === employeeId);
    }

    res.json({
      success: true,
      data: alerts
    });

  } catch (error) {
    console.error('Error fetching certification alerts:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: error.message
    });
  }
});

// @route   POST /api/manpower
// @desc    Add new worker
// @access  Private (HR Manager, Admin)
router.post('/', async (req, res) => {
  try {
    const manpowerData = await loadManpower();
    
    // Generate new worker ID
    const newId = manpowerData.length > 0 
      ? Math.max(...manpowerData.map(m => m.id)) + 1 
      : 1;

    const newWorker = {
      id: newId,
      name: req.body.name,
      role: req.body.role,
      project: req.body.project || null,
      status: req.body.status || 'active',
      phone: req.body.phone || '',
      email: req.body.email || '',
      address: req.body.address || '',
      joinDate: req.body.joinDate || new Date().toISOString().split('T')[0],
      salary: req.body.salary || 0,
      skills: req.body.skills || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    manpowerData.push(newWorker);
    await saveManpower(manpowerData);

    res.status(201).json({
      success: true,
      message: 'Worker added successfully',
      data: newWorker
    });

  } catch (error) {
    console.error('Error adding worker:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/manpower/:id
// @desc    Update worker
// @access  Private (HR Manager, Admin)
router.put('/:id', async (req, res) => {
  try {
    const manpowerData = await loadManpower();
    const workerIndex = manpowerData.findIndex(m => m.id === parseInt(req.params.id));

    if (workerIndex === -1) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    // Update worker
    manpowerData[workerIndex] = {
      ...manpowerData[workerIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    await saveManpower(manpowerData);

    res.json({
      success: true,
      message: 'Worker updated successfully',
      data: manpowerData[workerIndex]
    });

  } catch (error) {
    console.error('Error updating worker:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/manpower/:id
// @desc    Delete worker
// @access  Private (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const manpowerData = await loadManpower();
    const workerIndex = manpowerData.findIndex(m => m.id === parseInt(req.params.id));

    if (workerIndex === -1) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    // Remove worker
    const deletedWorker = manpowerData.splice(workerIndex, 1)[0];
    await saveManpower(manpowerData);

    res.json({
      success: true,
      message: 'Worker deleted successfully',
      data: deletedWorker
    });

  } catch (error) {
    console.error('Error deleting worker:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/manpower/stats/overview
// @desc    Get manpower statistics
// @access  Private
router.get('/stats/overview', async (req, res) => {
  try {
    const manpowerData = await loadManpower();

    const stats = {
      total: manpowerData.length,
      active: manpowerData.filter(m => m.status === 'active').length,
      inactive: manpowerData.filter(m => m.status === 'inactive').length,
      byRole: manpowerData.reduce((acc, worker) => {
        acc[worker.role] = (acc[worker.role] || 0) + 1;
        return acc;
      }, {}),
      totalSalary: manpowerData.reduce((sum, worker) => sum + (worker.salary || 0), 0),
      averageSalary: manpowerData.length > 0 
        ? Math.round(manpowerData.reduce((sum, worker) => sum + (worker.salary || 0), 0) / manpowerData.length)
        : 0
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching manpower stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/manpower/roles
// @desc    Get available roles
// @access  Private
router.get('/roles/list', async (req, res) => {
  try {
    const manpowerData = await loadManpower();
    const roles = [...new Set(manpowerData.map(m => m.role))].map(role => ({
      name: role,
      count: manpowerData.filter(m => m.role === role).length
    }));

    res.json({
      success: true,
      data: roles
    });

  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/manpower/:id/assign
// @desc    Assign worker to project
// @access  Private (Project Manager, Admin)
router.put('/:id/assign', async (req, res) => {
  try {
    const { projectId } = req.body;
    const manpowerData = await loadManpower();
    const workerIndex = manpowerData.findIndex(m => m.id === parseInt(req.params.id));

    if (workerIndex === -1) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    // Update project assignment
    manpowerData[workerIndex].project = projectId;
    manpowerData[workerIndex].updatedAt = new Date().toISOString();

    await saveManpower(manpowerData);

    res.json({
      success: true,
      message: 'Worker assigned to project successfully',
      data: manpowerData[workerIndex]
    });

  } catch (error) {
    console.error('Error assigning worker:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
