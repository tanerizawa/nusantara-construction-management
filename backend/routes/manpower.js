const express = require('express');
const Joi = require('joi');
const { Op, QueryTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const router = express.Router();

// Validation schema for employee
const employeeSchema = Joi.object({
  employeeId: Joi.string().required(),
  name: Joi.string().required(),
  position: Joi.string().required(),
  department: Joi.string().required(),
  email: Joi.string().email().allow('').optional(),
  phone: Joi.string().allow('').optional(),
  joinDate: Joi.date().optional(),
  birthDate: Joi.date().optional(),
  address: Joi.string().allow('').optional(),
  status: Joi.string().valid('active', 'inactive', 'terminated').default('active'),
  employmentType: Joi.string().valid('permanent', 'contract', 'intern', 'freelance').default('permanent'),
  salary: Joi.number().min(0).optional(),
  currentProject: Joi.string().allow('').optional(),
  skills: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    level: Joi.string().valid('beginner', 'intermediate', 'advanced', 'expert').required(),
    certifiedDate: Joi.date().optional()
  })).optional()
});

// @route   GET /api/manpower
// @desc    Get all employees
// @access  Private
router.get('/', async (req, res) => {
  try {
    const {
      department,
      status,
      position,
      project,
      subsidiaryId,
      search,
      sort = 'name',
      order = 'asc',
      limit = 50,
      page = 1
    } = req.query;

    const limitNum = Math.max(1, parseInt(limit));
    const pageNum = Math.max(1, parseInt(page));
    const offset = (pageNum - 1) * limitNum;

    // Build where clause
    let whereClause = '';
    const replacements = {};
    const conditions = [];

    if (department) {
      conditions.push('department ILIKE :department');
      replacements.department = `%${department}%`;
    }
    
    if (status) {
      conditions.push('status = :status');
      replacements.status = status;
    }
    
    if (position) {
      conditions.push('position ILIKE :position');
      replacements.position = `%${position}%`;
    }
    
    if (project) {
      conditions.push('current_project = :project');
      replacements.project = project;
    }

    if (subsidiaryId) {
      conditions.push('subsidiary_id = :subsidiaryId');
      replacements.subsidiaryId = subsidiaryId;
    }

    if (search) {
      conditions.push('(name ILIKE :search OR employee_id ILIKE :search OR email ILIKE :search)');
      replacements.search = `%${search}%`;
    }

    if (conditions.length > 0) {
      whereClause = 'WHERE ' + conditions.join(' AND ');
    }

    // Build order clause
    const validSortFields = ['name', 'position', 'department', 'join_date', 'salary'];
    const sortField = validSortFields.includes(sort) ? sort : 'name';
    const sortOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    // Get employees from database
    const countQuery = `
      SELECT COUNT(*) as count 
      FROM manpower 
      ${whereClause}
    `;

    const dataQuery = `
      SELECT m.*, s.name as subsidiary_name, s.code as subsidiary_code
      FROM manpower m
      LEFT JOIN subsidiaries s ON m.subsidiary_id = s.id
      ${whereClause}
      ORDER BY ${sortField} ${sortOrder}
      LIMIT :limit OFFSET :offset
    `;

    const [countResult] = await sequelize.query(countQuery, {
      replacements,
      type: QueryTypes.SELECT
    });

    const employees = await sequelize.query(dataQuery, {
      replacements: { ...replacements, limit: limitNum, offset },
      type: QueryTypes.SELECT
    });

    // Transform data for API response
    const transformedEmployees = employees.map(employee => ({
      id: employee.id,
      employeeId: employee.employee_id,
      name: employee.name,
      position: employee.position,
      department: employee.department,
      email: employee.email,
      phone: employee.phone,
      joinDate: employee.join_date,
      birthDate: employee.birth_date,
      address: employee.address,
      status: employee.status,
      employmentType: employee.employment_type,
      salary: parseFloat(employee.salary || 0),
      currentProject: employee.current_project,
      projectName: employee.metadata?.projectName,
      skills: employee.skills || [],
      certifications: employee.metadata?.certifications || [],
      createdAt: employee.created_at,
      updatedAt: employee.updated_at
    }));

    const totalPages = Math.ceil(parseInt(countResult.count) / limitNum);

    res.json({
      success: true,
      data: transformedEmployees,
      pagination: {
        current: pageNum,
        total: totalPages,
        count: parseInt(countResult.count),
        perPage: limitNum
      }
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch employees',
      details: error.message
    });
  }
});

// @route   GET /api/manpower/:id
// @desc    Get single employee by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [employee] = await sequelize.query(
      'SELECT * FROM manpower WHERE id = :id',
      {
        replacements: { id },
        type: QueryTypes.SELECT
      }
    );
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }

    // Transform data for API response
    const transformedEmployee = {
      id: employee.id,
      employeeId: employee.employee_id,
      name: employee.name,
      position: employee.position,
      department: employee.department,
      email: employee.email,
      phone: employee.phone,
      joinDate: employee.join_date,
      birthDate: employee.birth_date,
      address: employee.address,
      status: employee.status,
      employmentType: employee.employment_type,
      salary: parseFloat(employee.salary || 0),
      currentProject: employee.current_project,
      projectName: employee.metadata?.projectName,
      skills: employee.skills || [],
      certifications: employee.metadata?.certifications || [],
      createdAt: employee.created_at,
      updatedAt: employee.updated_at
    };

    res.json({
      success: true,
      data: transformedEmployee
    });
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch employee',
      details: error.message
    });
  }
});

// @route   POST /api/manpower
// @desc    Create new employee
// @access  Private
router.post('/', async (req, res) => {
  try {
    // Validate input
    const { error, value } = employeeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details
      });
    }

    // Generate employee ID
    const [countResult] = await sequelize.query(
      'SELECT COUNT(*) as count FROM manpower',
      { type: QueryTypes.SELECT }
    );
    const employeeCount = parseInt(countResult.count);
    const newEmployeeId = `EMP-${String(employeeCount + 1).padStart(3, '0')}`;

    // Create employee
    await sequelize.query(`
      INSERT INTO manpower (
        id, employee_id, name, position, department, email, phone,
        join_date, birth_date, address, status, employment_type,
        salary, current_project, skills, metadata
      ) VALUES (
        :id, :employee_id, :name, :position, :department, :email, :phone,
        :join_date, :birth_date, :address, :status, :employment_type,
        :salary, :current_project, :skills, :metadata
      )
    `, {
      replacements: {
        id: newEmployeeId,
        employee_id: value.employeeId,
        name: value.name,
        position: value.position,
        department: value.department,
        email: value.email,
        phone: value.phone,
        join_date: value.joinDate,
        birth_date: value.birthDate,
        address: value.address,
        status: value.status,
        employment_type: value.employmentType,
        salary: value.salary,
        current_project: value.currentProject,
        skills: JSON.stringify(value.skills || []),
        metadata: JSON.stringify({
          source: 'api_created',
          createdAt: new Date().toISOString()
        })
      }
    });

    res.status(201).json({
      success: true,
      data: { id: newEmployeeId, ...value },
      message: 'Employee created successfully'
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create employee',
      details: error.message
    });
  }
});

// @route   PUT /api/manpower/:id
// @desc    Update employee
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if employee exists
    const [existing] = await sequelize.query(
      'SELECT id FROM manpower WHERE id = :id',
      {
        replacements: { id },
        type: QueryTypes.SELECT
      }
    );

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }

    // Validate input (make fields optional for update)
    const updateSchema = employeeSchema.fork(
      ['employeeId', 'name', 'position', 'department'],
      (schema) => schema.optional()
    );
    
    const { error, value } = updateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details
      });
    }

    // Build update query
    const updateFields = [];
    const replacements = { id };

    Object.keys(value).forEach(key => {
      const dbField = key === 'employeeId' ? 'employee_id' :
                     key === 'joinDate' ? 'join_date' :
                     key === 'birthDate' ? 'birth_date' :
                     key === 'employmentType' ? 'employment_type' :
                     key === 'currentProject' ? 'current_project' :
                     key;
      
      if (key === 'skills') {
        updateFields.push(`${dbField} = :${key}`);
        replacements[key] = JSON.stringify(value[key]);
      } else {
        updateFields.push(`${dbField} = :${key}`);
        replacements[key] = value[key];
      }
    });

    if (updateFields.length > 0) {
      await sequelize.query(`
        UPDATE manpower 
        SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE id = :id
      `, { replacements });
    }

    res.json({
      success: true,
      message: 'Employee updated successfully'
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update employee',
      details: error.message
    });
  }
});

// @route   DELETE /api/manpower/:id
// @desc    Delete employee
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await sequelize.query(
      'SELECT id FROM manpower WHERE id = :id',
      {
        replacements: { id },
        type: QueryTypes.SELECT
      }
    );

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }

    await sequelize.query('DELETE FROM manpower WHERE id = :id', {
      replacements: { id }
    });

    res.json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete employee',
      details: error.message
    });
  }
});

// @route   GET /api/manpower/stats/overview
// @desc    Get manpower statistics overview
// @access  Private
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await sequelize.query(`
      SELECT 
        COUNT(*) as total_employees,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_employees,
        COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactive_employees,
        COUNT(CASE WHEN employment_type = 'permanent' THEN 1 END) as permanent_employees,
        COUNT(CASE WHEN employment_type = 'contract' THEN 1 END) as contract_employees,
        COUNT(DISTINCT department) as total_departments,
        COUNT(DISTINCT current_project) as active_projects
      FROM manpower
    `, { type: QueryTypes.SELECT });

    const departmentStats = await sequelize.query(`
      SELECT department, COUNT(*) as count
      FROM manpower
      GROUP BY department
      ORDER BY count DESC
    `, { type: QueryTypes.SELECT });

    const overview = {
      ...stats[0],
      departments: departmentStats.reduce((acc, dept) => {
        acc[dept.department] = parseInt(dept.count);
        return acc;
      }, {})
    };

    // Convert string numbers to integers
    Object.keys(overview).forEach(key => {
      if (typeof overview[key] === 'string' && !isNaN(overview[key])) {
        overview[key] = parseInt(overview[key]);
      }
    });

    res.json({
      success: true,
      data: overview
    });
  } catch (error) {
    console.error('Error fetching manpower stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch manpower statistics',
      details: error.message
    });
  }
});

// @route   GET /api/manpower/statistics/by-subsidiary
// @desc    Get manpower statistics by subsidiary
// @access  Private
router.get('/statistics/by-subsidiary', async (req, res) => {
  try {
    const statsQuery = `
      SELECT 
        s.id,
        s.name,
        s.code,
        s.specialization,
        COUNT(m.id) as total_manpower,
        COUNT(CASE WHEN m.department = 'Direksi' THEN 1 END) as directors,
        COUNT(CASE WHEN m.department != 'Direksi' AND m.department IS NOT NULL THEN 1 END) as staff,
        COUNT(CASE WHEN m.status = 'active' THEN 1 END) as active_employees,
        AVG(m.salary) as average_salary
      FROM subsidiaries s
      LEFT JOIN manpower m ON s.id = m.subsidiary_id
      GROUP BY s.id, s.name, s.code, s.specialization
      ORDER BY s.id
    `;

    const subsidiaryStats = await sequelize.query(statsQuery, {
      type: QueryTypes.SELECT
    });

    const formatted = subsidiaryStats.map(stat => ({
      subsidiary: {
        id: stat.id,
        name: stat.name,
        code: stat.code,
        specialization: stat.specialization
      },
      manpower: {
        total: parseInt(stat.total_manpower) || 0,
        directors: parseInt(stat.directors) || 0,
        staff: parseInt(stat.staff) || 0,
        active: parseInt(stat.active_employees) || 0
      },
      averageSalary: stat.average_salary ? parseFloat(stat.average_salary) : 0
    }));

    res.json({
      success: true,
      data: formatted
    });
  } catch (error) {
    console.error('Error fetching subsidiary manpower stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch subsidiary manpower statistics',
      details: error.message
    });
  }
});

module.exports = router;
