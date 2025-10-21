const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const { Op, QueryTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('../models/User');

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
  })).optional(),
  // ⭐ NEW: User account creation fields
  createUserAccount: Joi.boolean().optional(),
  username: Joi.string().when('createUserAccount', {
    is: true,
    then: Joi.string().alphanum().min(3).max(30).required(),
    otherwise: Joi.string().optional()
  }),
  userPassword: Joi.string().when('createUserAccount', {
    is: true,
    then: Joi.string().min(6).required(),
    otherwise: Joi.string().optional()
  }),
  userRole: Joi.string().valid('admin', 'project_manager', 'finance_manager', 'inventory_manager', 'hr_manager', 'supervisor').when('createUserAccount', {
    is: true,
    then: Joi.required(),
    otherwise: Joi.optional()
  })
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
      SELECT m.*, 
             s.name as subsidiary_name, s.code as subsidiary_code,
             u.id as user_id, u.username, u.role as user_role, u.is_active as user_is_active
      FROM manpower m
      LEFT JOIN subsidiaries s ON m.subsidiary_id = s.id
      LEFT JOIN users u ON m.user_id = u.id
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
      // ⭐ NEW: User account info
      userId: employee.user_id,
      userAccount: employee.user_id ? {
        id: employee.user_id,
        username: employee.username,
        role: employee.user_role,
        isActive: employee.user_is_active
      } : null,
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

// @route   GET /api/manpower/training
// @desc    Get all training records
// @access  Private
router.get('/training', async (req, res) => {
  try {
    const { status, category, employeeId } = req.query;
    
    // Mock training data for now - replace with actual database query
    const mockTrainings = [
      {
        id: 1,
        title: 'Keselamatan Konstruksi Tingkat Lanjut',
        category: 'safety',
        description: 'Pelatihan keselamatan kerja untuk konstruksi gedung tinggi',
        instructor: 'Ahmad Suryadi, M.Eng',
        startDate: '2024-02-15',
        endDate: '2024-02-17',
        duration: '3 hari',
        location: 'Training Center Jakarta',
        maxParticipants: 25,
        registeredParticipants: 18,
        status: 'scheduled',
        participants: [
          { employeeId: 'EMP001', name: 'Ahmad Fauzi', department: 'Construction' },
          { employeeId: 'EMP002', name: 'Siti Nurhaliza', department: 'Construction' }
        ]
      },
      {
        id: 2,
        title: 'Manajemen Proyek dengan MS Project',
        category: 'technical',
        description: 'Pelatihan penggunaan Microsoft Project untuk manajemen proyek konstruksi',
        instructor: 'Budi Santoso, PMP',
        startDate: '2024-02-20',
        endDate: '2024-02-22',
        duration: '3 hari',
        location: 'Online Training',
        maxParticipants: 30,
        registeredParticipants: 24,
        status: 'ongoing',
        participants: [
          { employeeId: 'EMP003', name: 'Dewi Sartika', department: 'Engineering' }
        ]
      },
      {
        id: 3,
        title: 'Sertifikasi K3 Konstruksi',
        category: 'certification',
        description: 'Program sertifikasi Keselamatan dan Kesehatan Kerja bidang konstruksi',
        instructor: 'Dr. Hendra Wijaya',
        startDate: '2024-01-10',
        endDate: '2024-01-15',
        duration: '5 hari',
        location: 'Training Center Bandung',
        maxParticipants: 20,
        registeredParticipants: 20,
        status: 'completed',
        participants: [
          { employeeId: 'EMP001', name: 'Ahmad Fauzi', department: 'Construction', completed: true }
        ]
      }
    ];

    let filteredTrainings = mockTrainings;

    if (status && status !== 'all') {
      filteredTrainings = filteredTrainings.filter(t => t.status === status);
    }

    if (category && category !== 'all') {
      filteredTrainings = filteredTrainings.filter(t => t.category === category);
    }

    if (employeeId) {
      filteredTrainings = filteredTrainings.filter(t => 
        t.participants.some(p => p.employeeId === employeeId)
      );
    }

    res.json({
      success: true,
      data: filteredTrainings,
      count: filteredTrainings.length
    });
  } catch (error) {
    console.error('Error fetching training records:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch training records',
      details: error.message
    });
  }
});

// @route   GET /api/manpower/safety-incidents
// @desc    Get all safety incident records
// @access  Private
router.get('/safety-incidents', async (req, res) => {
  try {
    const { status, severity, dateFrom, dateTo } = req.query;
    
    // Mock safety incident data for now - replace with actual database query
    const mockIncidents = [
      {
        id: 1,
        incidentNumber: 'SI-2024-001',
        date: '2024-01-15',
        reportedBy: 'Ahmad Fauzi',
        reporterId: 'EMP001',
        involvedEmployees: [
          { id: 'EMP002', name: 'Siti Nurhaliza', injury: 'Minor cut on hand' }
        ],
        incidentType: 'workplace_injury',
        severity: 'low',
        location: 'Proyek Mall Karawang - Lantai 3',
        description: 'Pekerja terluka akibat pecahan kaca saat pemasangan jendela',
        immediateActions: 'Pertolongan pertama dilakukan, korban dibawa ke klinik terdekat',
        preventiveActions: 'Pemasangan safety barrier tambahan, briefing keselamatan',
        status: 'closed',
        investigationReport: 'Kurangnya perhatian terhadap area kerja yang licin',
        closureDate: '2024-01-20',
        rootCause: 'Prosedur keselamatan tidak diikuti dengan baik'
      },
      {
        id: 2,
        incidentNumber: 'SI-2024-002',
        date: '2024-01-22',
        reportedBy: 'Budi Santoso',
        reporterId: 'EMP003',
        involvedEmployees: [],
        incidentType: 'near_miss',
        severity: 'medium',
        location: 'Proyek Apartemen Bekasi - Area Crane',
        description: 'Crane hampir mengenai pekerja yang sedang berjalan di area restricted',
        immediateActions: 'Crane dihentikan, area dikosongkan, briefing darurat',
        preventiveActions: 'Pemasangan alarm suara pada crane, marking area lebih jelas',
        status: 'under_investigation',
        investigationReport: '',
        closureDate: '',
        rootCause: ''
      },
      {
        id: 3,
        incidentNumber: 'SI-2024-003',
        date: '2024-02-01',
        reportedBy: 'Dewi Sartika',
        reporterId: 'EMP004',
        involvedEmployees: [
          { id: 'EMP005', name: 'Andi Prasetyo', injury: 'Sprain ankle' }
        ],
        incidentType: 'slip_fall',
        severity: 'medium',
        location: 'Proyek Office Building - Basement',
        description: 'Pekerja terpeleset di area basement yang basah',
        immediateActions: 'Korban dilarikan ke rumah sakit, area ditutup sementara',
        preventiveActions: 'Pemasangan warning signs, pembersihan rutin area basah',
        status: 'in_progress',
        investigationReport: 'Investigasi dalam progress',
        closureDate: '',
        rootCause: 'Sistem drainase basement kurang optimal'
      }
    ];

    let filteredIncidents = mockIncidents;

    if (status && status !== 'all') {
      filteredIncidents = filteredIncidents.filter(i => i.status === status);
    }

    if (severity && severity !== 'all') {
      filteredIncidents = filteredIncidents.filter(i => i.severity === severity);
    }

    if (dateFrom) {
      filteredIncidents = filteredIncidents.filter(i => i.date >= dateFrom);
    }

    if (dateTo) {
      filteredIncidents = filteredIncidents.filter(i => i.date <= dateTo);
    }

    res.json({
      success: true,
      data: filteredIncidents,
      count: filteredIncidents.length
    });
  } catch (error) {
    console.error('Error fetching safety incidents:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch safety incidents',
      details: error.message
    });
  }
});

// @route   POST /api/manpower/safety-incidents
// @desc    Create new safety incident
// @access  Private
router.post('/safety-incidents', async (req, res) => {
  try {
    const incidentData = req.body;
    
    // Mock creation response - replace with actual database insert
    const newIncident = {
      id: Date.now(),
      incidentNumber: `SI-2024-${String(Date.now()).slice(-3)}`,
      ...incidentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      data: newIncident,
      message: 'Safety incident created successfully'
    });
  } catch (error) {
    console.error('Error creating safety incident:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create safety incident',
      details: error.message
    });
  }
});

// @route   GET /api/manpower/reports
// @desc    Get HR reports and analytics
// @access  Private
router.get('/reports', async (req, res) => {
  try {
    const { type = 'all' } = req.query;
    
    // Mock reports data - replace with actual calculations
    const reports = {
      demographic: {
        totalEmployees: 45,
        byDepartment: {
          construction: 18,
          engineering: 12,
          management: 8,
          administration: 7
        },
        byPosition: {
          'Site Manager': 3,
          'Project Engineer': 8,
          'Construction Worker': 15,
          'Safety Officer': 4,
          'Administrative Staff': 7,
          'Director': 2,
          'Other': 6
        },
        byEmploymentType: {
          permanent: 32,
          contract: 10,
          intern: 3
        }
      },
      performance: {
        averageRating: 4.2,
        topPerformers: [
          { name: 'Ahmad Fauzi', rating: 4.8, department: 'Construction' },
          { name: 'Dewi Sartika', rating: 4.7, department: 'Engineering' },
          { name: 'Budi Santoso', rating: 4.6, department: 'Management' }
        ],
        performanceDistribution: {
          excellent: 12,
          good: 20,
          satisfactory: 10,
          needsImprovement: 3
        }
      },
      training: {
        totalTrainings: 15,
        completedTrainings: 8,
        ongoingTrainings: 3,
        scheduledTrainings: 4,
        trainingParticipation: {
          safety: 35,
          technical: 28,
          management: 15,
          certification: 22
        },
        certificationStatus: {
          certified: 32,
          expired: 8,
          pending: 5
        }
      },
      attendance: {
        averageAttendance: 94.5,
        totalWorkdays: 22,
        presentDays: 20.79,
        absentDays: 1.21,
        attendanceTrend: [
          { month: 'Jan', rate: 95.2 },
          { month: 'Feb', rate: 93.8 }
        ]
      },
      compliance: {
        safetyIncidents: 3,
        openIncidents: 2,
        closedIncidents: 1,
        incidentsByType: {
          workplace_injury: 1,
          near_miss: 1,
          slip_fall: 1
        },
        complianceScore: 87.5
      }
    };

    let responseData = reports;
    if (type !== 'all' && reports[type]) {
      responseData = { [type]: reports[type] };
    }

    res.json({
      success: true,
      data: responseData,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reports',
      details: error.message
    });
  }
});

// @route   GET /api/manpower/:id
// @desc    Get single employee by ID with user account info
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [employee] = await sequelize.query(
      `SELECT m.*, 
              u.id as user_id, u.username, u.email as user_email, 
              u.role as user_role, u.is_active as user_is_active
       FROM manpower m
       LEFT JOIN users u ON m.user_id = u.id
       WHERE m.id = :id`,
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
      // ⭐ NEW: User account info
      userId: employee.user_id,
      userAccount: employee.user_id ? {
        id: employee.user_id,
        username: employee.username,
        email: employee.user_email,
        role: employee.user_role,
        isActive: employee.user_is_active
      } : null,
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
// @desc    Create new employee with optional user account
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

    // ⭐ NEW: Validate user account creation if requested
    let createdUser = null;
    if (value.createUserAccount) {
      // Check if username already exists
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [
            { username: value.username },
            { email: value.email }
          ]
        }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'Username or email already has a user account',
          details: 'The specified username or email is already registered'
        });
      }
    }

    // Generate employee ID
    const [countResult] = await sequelize.query(
      'SELECT COUNT(*) as count FROM manpower',
      { type: QueryTypes.SELECT }
    );
    const employeeCount = parseInt(countResult.count);
    const newEmployeeId = `EMP-${String(employeeCount + 1).padStart(3, '0')}`;

    // Create employee
    const currentTime = new Date();
    await sequelize.query(`
      INSERT INTO manpower (
        id, employee_id, name, position, department, email, phone,
        join_date, birth_date, address, status, employment_type,
        salary, current_project, skills, metadata, created_at, updated_at
      ) VALUES (
        :id, :employee_id, :name, :position, :department, :email, :phone,
        :join_date, :birth_date, :address, :status, :employment_type,
        :salary, :current_project, :skills, :metadata, :created_at, :updated_at
      )
    `, {
      replacements: {
        id: newEmployeeId,
        employee_id: value.employeeId,
        name: value.name,
        position: value.position,
        department: value.department,
        email: value.email || null,
        phone: value.phone || null,
        join_date: value.joinDate || null,
        birth_date: value.birthDate || null,
        address: value.address || null,
        status: value.status,
        employment_type: value.employmentType,
        salary: value.salary || null,
        current_project: value.currentProject || null,
        skills: JSON.stringify(value.skills || []),
        metadata: JSON.stringify({
          source: 'api_created',
          createdAt: currentTime.toISOString()
        }),
        created_at: currentTime,
        updated_at: currentTime
      }
    });

    // ⭐ NEW: Create user account if requested
    if (value.createUserAccount) {
      try {
        const hashedPassword = await bcrypt.hash(value.userPassword, 10);
        
        // Generate user ID
        const userCount = await User.count();
        const userId = `U${String(userCount + 1).padStart(3, '0')}`;

        createdUser = await User.create({
          id: userId,
          username: value.username,
          email: value.email,
          password: hashedPassword,
          role: value.userRole,
          employeeId: newEmployeeId, // ← Link to employee
          profile: {
            fullName: value.name,
            phone: value.phone
          },
          isActive: true
        });

        // Update employee with userId
        await sequelize.query(
          'UPDATE manpower SET user_id = :userId WHERE id = :id',
          {
            replacements: { userId: createdUser.id, id: newEmployeeId }
          }
        );

        console.log(`✅ Created user account ${createdUser.username} for employee ${value.name}`);
      } catch (userError) {
        console.error('Error creating user account:', userError);
        // Employee created but user failed - still return success with warning
        return res.status(201).json({
          success: true,
          data: { id: newEmployeeId, ...value },
          message: 'Employee created successfully, but user account creation failed',
          warning: 'User account could not be created. You can create it manually later.',
          userError: userError.message
        });
      }
    }

    res.status(201).json({
      success: true,
      data: { 
        id: newEmployeeId, 
        ...value,
        userId: createdUser?.id,
        userAccount: createdUser ? {
          id: createdUser.id,
          username: createdUser.username,
          role: createdUser.role
        } : null
      },
      message: createdUser 
        ? 'Employee and user account created successfully'
        : 'Employee created successfully'
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
// @desc    Update employee with optional user linking
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if employee exists and get current user_id
    const [existing] = await sequelize.query(
      'SELECT id, user_id FROM manpower WHERE id = :id',
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

    // ⭐ NEW: Handle user linking/unlinking
    if (req.body.userId !== undefined) {
      const oldUserId = existing.user_id;
      const newUserId = req.body.userId;

      // If userId changed, update bidirectional links
      if (oldUserId !== newUserId) {
        // Unlink old user if exists
        if (oldUserId) {
          await User.update(
            { employeeId: null },
            { where: { id: oldUserId } }
          );
          console.log(`✅ Unlinked old user ${oldUserId} from employee ${id}`);
        }

        // Link new user if provided
        if (newUserId) {
          await User.update(
            { employeeId: id },
            { where: { id: newUserId } }
          );
          console.log(`✅ Linked new user ${newUserId} to employee ${id}`);
        }
      }
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
      // Skip userId as it's handled separately above
      if (key === 'userId') return;
      
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

    // Add userId to update if provided
    if (req.body.userId !== undefined) {
      updateFields.push('user_id = :user_id');
      replacements.user_id = req.body.userId;
    }

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
// @desc    Delete employee and unlink user
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get employee with user_id
    const [existing] = await sequelize.query(
      'SELECT id, user_id FROM manpower WHERE id = :id',
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

    // ⭐ NEW: Unlink user if exists
    if (existing.user_id) {
      await User.update(
        { employeeId: null },
        { where: { id: existing.user_id } }
      );
      console.log(`✅ Unlinked user ${existing.user_id} from employee ${id} before deletion`);
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

// @route   GET /api/manpower/available-users
// @desc    Get users without employee links (available for linking)
// @access  Private
router.get('/available-users', async (req, res) => {
  try {
    const availableUsers = await User.findAll({
      where: {
        employeeId: null
      },
      attributes: ['id', 'username', 'email', 'role', 'isActive'],
      order: [['username', 'ASC']]
    });

    res.json({
      success: true,
      data: availableUsers.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }))
    });
  } catch (error) {
    console.error('Error fetching available users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch available users',
      details: error.message
    });
  }
});

module.exports = router;
