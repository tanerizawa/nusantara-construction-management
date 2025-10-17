const express = require('express');
const { Op } = require('sequelize');
const Subsidiary = require('../models/Subsidiary');
const ChartOfAccounts = require('../models/ChartOfAccounts');

const router = express.Router();

/**
 * @route   GET /api/subsidiaries
 * @desc    Get all subsidiaries
 * @access  Private
 */
router.get('/', async (req, res) => {
  try {
    const { active_only } = req.query;
    
    let whereClause = {};
    if (active_only === 'true') {
      whereClause.status = 'active'; // Use 'status' instead of 'isActive'
    }

    const subsidiaries = await Subsidiary.findAll({
      where: whereClause,
      order: [
        ['name', 'ASC']
      ],
      attributes: [
        'id',
        'name',
        'code',
        'description',
        'specialization',
        'contactInfo',    // JSONB field
        'address',        // JSONB field
        'legalInfo',      // JSONB field
        'boardOfDirectors',
        'status',         // Use 'status' instead of 'isActive'
        'logo',
        'establishedYear',
        'employeeCount',
        'created_at',
        'updated_at'
      ]
    });

    // Get account count for each subsidiary
    const subsidiariesWithCount = await Promise.all(
      subsidiaries.map(async (sub) => {
        const accountCount = await ChartOfAccounts.count({
          where: { subsidiary_id: sub.id }
        });
        
        return {
          ...sub.toJSON(),
          accountCount,
          // Add compatibility fields for frontend
          isActive: sub.status === 'active',
          phone: sub.contactInfo?.phone || null,
          email: sub.contactInfo?.email || null,
          taxId: sub.legalInfo?.taxIdentificationNumber || null
        };
      })
    );

    res.json({
      success: true,
      data: subsidiariesWithCount,
      count: subsidiariesWithCount.length
    });
  } catch (error) {
    console.error('Error fetching subsidiaries:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch subsidiaries',
      message: error.message
    });
  }
});

/**
 * @route   GET /api/subsidiaries/:id
 * @desc    Get subsidiary by ID
 * @access  Private
 */
router.get('/:id', async (req, res) => {
  try {
    const subsidiary = await Subsidiary.findByPk(req.params.id, {
      include: [
        {
          model: ChartOfAccounts,
          as: 'Accounts',
          attributes: ['id', 'accountCode', 'accountName', 'accountType'],
          limit: 10
        }
      ]
    });

    if (!subsidiary) {
      return res.status(404).json({
        success: false,
        error: 'Subsidiary not found'
      });
    }

    res.json({
      success: true,
      data: subsidiary
    });
  } catch (error) {
    console.error('Error fetching subsidiary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch subsidiary',
      message: error.message
    });
  }
});

/**
 * @route   POST /api/subsidiaries
 * @desc    Create new subsidiary
 * @access  Private (Admin only)
 */
router.post('/', async (req, res) => {
  try {
    const { 
      name, 
      code, 
      description,
      specialization,
      contactInfo
    } = req.body;

    // Validation
    if (!name || !code) {
      return res.status(400).json({
        success: false,
        error: 'Name and code are required'
      });
    }

    // Check if code already exists
    const existingCode = await Subsidiary.findOne({ 
      where: { code: code.toUpperCase() } 
    });
    
    if (existingCode) {
      return res.status(400).json({
        success: false,
        error: 'Subsidiary code already exists'
      });
    }

    // Generate ID
    const id = `SUB-${Date.now()}`;

    // Transform flat input to JSONB structure
    const { phone, email, fax, website, address, city, province, postalCode, taxId, legalName } = req.body;
    
    // Create subsidiary with proper JSONB structure
    const subsidiary = await Subsidiary.create({
      id,
      name,
      code: code.toUpperCase(),
      description,
      specialization: specialization || 'general',
      
      // JSONB fields
      contactInfo: contactInfo || {
        phone: phone || null,
        email: email || null,
        fax: fax || null,
        website: website || null
      },
      
      address: address ? {
        street: address,
        city: city || null,
        province: province || null,
        postalCode: postalCode || null,
        country: 'Indonesia'
      } : null,
      
      legalInfo: {
        companyRegistrationNumber: legalName || null,
        taxIdentificationNumber: taxId || null
      },
      
      status: 'active', // Use 'status' enum instead of 'isActive'
      parentCompany: 'Nusantara Group'
    });

    res.status(201).json({
      success: true,
      data: subsidiary,
      message: 'Subsidiary created successfully'
    });
  } catch (error) {
    console.error('Error creating subsidiary:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create subsidiary'
    });
  }
});

/**
 * @route   PUT /api/subsidiaries/:id
 * @desc    Update subsidiary
 * @access  Private (Admin only)
 */
router.put('/:id', async (req, res) => {
  try {
    const { 
      name, 
      code, 
      description,
      specialization,
      contactInfo,
      phone,
      email,
      fax,
      website,
      address,
      city,
      province,
      postalCode,
      taxId,
      legalName,
      status
    } = req.body;

    const subsidiary = await Subsidiary.findByPk(req.params.id);
    
    if (!subsidiary) {
      return res.status(404).json({
        success: false,
        error: 'Subsidiary not found'
      });
    }

    // Check code uniqueness if changed
    if (code && code.toUpperCase() !== subsidiary.code) {
      const existingCode = await Subsidiary.findOne({ 
        where: { 
          code: code.toUpperCase(),
          id: { [Op.ne]: req.params.id }
        } 
      });
      
      if (existingCode) {
        return res.status(400).json({
          success: false,
          error: 'Subsidiary code already exists'
        });
      }
    }

    // Prepare update data with JSONB transformation
    const updateData = {
      name: name || subsidiary.name,
      code: code ? code.toUpperCase() : subsidiary.code,
      description: description !== undefined ? description : subsidiary.description,
      specialization: specialization || subsidiary.specialization
    };
    
    // Update contactInfo JSONB if provided
    if (contactInfo || phone || email || fax || website) {
      updateData.contactInfo = {
        ...(subsidiary.contactInfo || {}),
        phone: phone || contactInfo?.phone || subsidiary.contactInfo?.phone,
        email: email || contactInfo?.email || subsidiary.contactInfo?.email,
        fax: fax || contactInfo?.fax || subsidiary.contactInfo?.fax,
        website: website || contactInfo?.website || subsidiary.contactInfo?.website
      };
    }
    
    // Update address JSONB if provided
    if (address || city || province || postalCode) {
      updateData.address = {
        ...(subsidiary.address || {}),
        street: address || subsidiary.address?.street,
        city: city || subsidiary.address?.city,
        province: province || subsidiary.address?.province,
        postalCode: postalCode || subsidiary.address?.postalCode,
        country: 'Indonesia'
      };
    }
    
    // Update legalInfo JSONB if provided
    if (taxId || legalName) {
      updateData.legalInfo = {
        ...(subsidiary.legalInfo || {}),
        companyRegistrationNumber: legalName || subsidiary.legalInfo?.companyRegistrationNumber,
        taxIdentificationNumber: taxId || subsidiary.legalInfo?.taxIdentificationNumber
      };
    }
    
    // Update status if provided
    if (status !== undefined) {
      updateData.status = status; // Use 'status' enum ('active'/'inactive')
    }

    // Update subsidiary
    await subsidiary.update(updateData);

    res.json({
      success: true,
      data: subsidiary,
      message: 'Subsidiary updated successfully'
    });
  } catch (error) {
    console.error('Error updating subsidiary:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update subsidiary'
    });
  }
});

/**
 * @route   DELETE /api/subsidiaries/:id
 * @desc    Soft delete subsidiary
 * @access  Private (Admin only)
 */
router.delete('/:id', async (req, res) => {
  try {
    const subsidiary = await Subsidiary.findByPk(req.params.id);
    
    if (!subsidiary) {
      return res.status(404).json({
        success: false,
        error: 'Subsidiary not found'
      });
    }

    // Check if subsidiary has accounts
    const accountCount = await ChartOfAccounts.count({
      where: { subsidiary_id: req.params.id }
    });

    if (accountCount > 0) {
      return res.status(400).json({
        success: false,
        error: `Cannot delete subsidiary with ${accountCount} linked accounts. Please reassign or delete accounts first.`
      });
    }

    // Soft delete - use 'status' enum instead of 'isActive'
    await subsidiary.update({ status: 'inactive' });

    res.json({
      success: true,
      message: 'Subsidiary deactivated successfully'
    });
  } catch (error) {
    console.error('Error deleting subsidiary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete subsidiary',
      message: error.message
    });
  }
});

/**
 * @route   GET /api/subsidiaries/stats/summary
 * @desc    Get subsidiaries statistics
 * @access  Private
 */
router.get('/stats/summary', async (req, res) => {
  try {
    const totalCount = await Subsidiary.count();
    const activeCount = await Subsidiary.count({ where: { isActive: true } });
    
    // Count by specialization
    const bySpecialization = await Subsidiary.findAll({
      where: { isActive: true },
      attributes: [
        'specialization',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['specialization']
    });

    res.json({
      success: true,
      data: {
        total: totalCount,
        active: activeCount,
        inactive: totalCount - activeCount,
        bySpecialization: bySpecialization.map(s => ({
          specialization: s.specialization,
          count: parseInt(s.get('count'))
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching subsidiary stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    });
  }
});

module.exports = router;
