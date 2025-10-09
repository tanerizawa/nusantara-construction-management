const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');

// Check if database is available
let dbAvailable = false;
let User = null;

try {
  const { models } = require('../models');
  const { sequelize } = require('../config/database');
  User = models.User;
  
  // Test database connection
  sequelize.authenticate().then(() => {
    dbAvailable = true;
  }).catch(() => {
    dbAvailable = false;
  });
} catch (error) {
  dbAvailable = false;
}

class UserService {
  constructor() {
    this.usersPath = path.join(__dirname, '../../data/users.json');
  }

  // Load users from JSON file
  async loadUsersFromFile() {
    try {
      const data = await fs.readFile(this.usersPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading users:', error);
      return { users: [] };
    }
  }

  // Save users to JSON file
  async saveUsersToFile(usersData) {
    try {
      await fs.writeFile(this.usersPath, JSON.stringify(usersData, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving users:', error);
      return false;
    }
  }

  // Find user by username or email
  async findByIdentifier(identifier) {
    if (dbAvailable && User) {
      try {
        return await User.findByIdentifier(identifier);
      } catch (error) {
        console.error('Database error, falling back to JSON:', error);
        dbAvailable = false;
      }
    }

    // Fallback to JSON file
    const usersData = await this.loadUsersFromFile();
    return usersData.users.find(u => 
      u.username === identifier || u.email === identifier
    );
  }

  // Find user by ID
  async findById(id) {
    if (dbAvailable && User) {
      try {
        const user = await User.findByPk(id);
        return user ? user.toSafeObject() : null;
      } catch (error) {
        console.error('Database error, falling back to JSON:', error);
        dbAvailable = false;
      }
    }

    // Fallback to JSON file
    const usersData = await this.loadUsersFromFile();
    const user = usersData.users.find(u => u.id === id);
    if (user) {
      // Return safe object (without password)
      const { password, ...safeUser } = user;
      return safeUser;
    }
    return null;
  }

  // Create new user
  async createUser(userData) {
    const { username, email, password, fullName, position, role } = userData;

    if (dbAvailable && User) {
      try {
        // Check if user exists
        const existingUser = await User.findOne({
          where: {
            [User.sequelize.Sequelize.Op.or]: [
              { username },
              { email }
            ]
          }
        });

        if (existingUser) {
          throw new Error('User with this username or email already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Generate user ID
        const userCount = await User.count();
        const userId = `USR${String(userCount + 1).padStart(3, '0')}`;

        // Create new user
        const newUser = await User.create({
          id: userId,
          username,
          email,
          password: hashedPassword,
          role,
          profile: {
            fullName,
            position,
            phone: '',
            avatar: '/avatars/default.jpg',
            department: role.replace('_', ' ').toUpperCase(),
            joinDate: new Date().toISOString().split('T')[0],
            isActive: true
          },
          permissions: role === 'admin' ? ['all'] : [`${role}_access`],
          isActive: true
        });

        return newUser.toSafeObject();
      } catch (error) {
        if (error.message.includes('already exists')) {
          throw error;
        }
        console.error('Database error, falling back to JSON:', error);
        dbAvailable = false;
      }
    }

    // Fallback to JSON file
    const usersData = await this.loadUsersFromFile();

    // Check if user exists
    const existingUser = usersData.users.find(u => u.username === username || u.email === email);
    if (existingUser) {
      throw new Error('User with this username or email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: `USR${String(usersData.users.length + 1).padStart(3, '0')}`,
      username,
      email,
      password: hashedPassword,
      role,
      profile: {
        fullName,
        position,
        phone: '',
        avatar: '/avatars/default.jpg',
        department: role.replace('_', ' ').toUpperCase(),
        joinDate: new Date().toISOString().split('T')[0],
        isActive: true
      },
      permissions: role === 'admin' ? ['all'] : [`${role}_access`]
    };

    usersData.users.push(newUser);
    await this.saveUsersToFile(usersData);

    // Return safe object (without password)
    const { password: _, ...safeUser } = newUser;
    return safeUser;
  }

  // Verify password
  async verifyPassword(user, password) {
    if (user && user.password) {
      return await bcrypt.compare(password, user.password);
    }
    return false;
  }

  // Update login attempts (for database mode only)
  async updateLoginAttempts(user, success = false) {
    if (dbAvailable && User && user && user.id) {
      try {
        if (success) {
          await User.update(
            { 
              loginAttempts: 0, 
              lockedUntil: null,
              lastLogin: new Date()
            },
            { where: { id: user.id } }
          );
        } else {
          const attempts = (user.loginAttempts || 0) + 1;
          const updateData = { loginAttempts: attempts };
          
          if (attempts >= 5) {
            updateData.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
          }
          
          await User.update(updateData, { where: { id: user.id } });
        }
      } catch (error) {
        console.error('Error updating login attempts:', error);
      }
    }
    // For JSON mode, we don't track login attempts
  }

  // Get database status
  isUsingDatabase() {
    return dbAvailable;
  }
}

module.exports = new UserService();
