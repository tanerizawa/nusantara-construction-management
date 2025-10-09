/**
 * Subsidiaries Module - Seed Data Routes
 * Handles: Seed NUSANTARA GROUP subsidiaries
 */

const express = require('express');
const Subsidiary = require('../../models/Subsidiary');

const router = express.Router();

// @route   POST /api/subsidiaries/seed-nusantara
// @desc    Clear and seed NUSANTARA GROUP subsidiaries
// @access  Private
router.post('/seed-nusantara', async (req, res) => {
  try {
    // Clear existing subsidiaries
    const deletedCount = await Subsidiary.destroy({
      where: {},
      force: true
    });
    
    // Seed NUSANTARA GROUP subsidiaries
    const subsidiaries = [
      {
        id: 'NU001',
        code: 'CUE14',
        name: 'CV. CAHAYA UTAMA EMPATBELAS',
        specialization: 'commercial',
        description: 'Spesialis pembangunan komersial dan perkantoran modern',
        contactInfo: {
          phone: '+62-21-555-1401',
          email: 'info@cahayautama14.co.id'
        },
        address: {
          street: 'Jl. Raya Utama No. 14',
          city: 'Jakarta',
          country: 'Indonesia'
        },
        establishedYear: 2010,
        employeeCount: 45,
        certification: ['ISO 9001:2015', 'SBU Grade 6'],
        status: 'active',
        parentCompany: 'NUSANTARA GROUP'
      },
      {
        id: 'NU002',
        code: 'BSR',
        name: 'CV. BINTANG SURAYA',
        specialization: 'residential',
        description: 'Ahli konstruksi perumahan dan komplek residensial',
        contactInfo: {
          phone: '+62-21-555-1402',
          email: 'info@bintangsuraya.co.id'
        },
        address: {
          street: 'Jl. Bintang Suraya No. 88',
          city: 'Jakarta',
          country: 'Indonesia'
        },
        establishedYear: 2012,
        employeeCount: 38,
        certification: ['ISO 9001:2015', 'SBU Grade 5'],
        status: 'active',
        parentCompany: 'NUSANTARA GROUP'
      },
      {
        id: 'NU003',
        code: 'LTS',
        name: 'CV. LATANSA',
        specialization: 'infrastructure',
        description: 'Kontraktor infrastruktur jalan, jembatan, dan fasilitas umum',
        contactInfo: {
          phone: '+62-21-555-1403',
          email: 'info@latansa.co.id'
        },
        address: {
          street: 'Jl. Infrastruktur Raya No. 25',
          city: 'Jakarta',
          country: 'Indonesia'
        },
        establishedYear: 2008,
        employeeCount: 52,
        certification: ['ISO 9001:2015', 'SBU Grade 7', 'CSMS Certificate'],
        status: 'active',
        parentCompany: 'NUSANTARA GROUP'
      },
      {
        id: 'NU004',
        code: 'GBN',
        name: 'CV. GRAHA BANGUN NUSANTARA',
        specialization: 'commercial',
        description: 'Spesialis pembangunan gedung bertingkat dan mall',
        contactInfo: {
          phone: '+62-21-555-1404',
          email: 'info@grahabangun.co.id'
        },
        address: {
          street: 'Jl. Graha Bangun No. 77',
          city: 'Jakarta',
          country: 'Indonesia'
        },
        establishedYear: 2015,
        employeeCount: 42,
        certification: ['ISO 9001:2015', 'SBU Grade 6', 'Green Building Council'],
        status: 'active',
        parentCompany: 'NUSANTARA GROUP'
      },
      {
        id: 'NU005',
        code: 'SSR',
        name: 'CV. SAHABAT SINAR RAYA',
        specialization: 'renovation',
        description: 'Ahli renovasi, retrofit, dan pemeliharaan bangunan',
        contactInfo: {
          phone: '+62-21-555-1405',
          email: 'info@sahabatsinar.co.id'
        },
        address: {
          street: 'Jl. Sahabat Sinar No. 99',
          city: 'Jakarta',
          country: 'Indonesia'
        },
        establishedYear: 2018,
        employeeCount: 35,
        certification: ['ISO 9001:2015', 'SBU Grade 5'],
        status: 'active',
        parentCompany: 'NUSANTARA GROUP'
      },
      {
        id: 'NU006',
        code: 'PJK',
        name: 'PT. PUTRA JAYA KONSTRUKSI',
        specialization: 'industrial',
        description: 'Kontraktor industri, pabrik, dan fasilitas khusus',
        contactInfo: {
          phone: '+62-21-555-1406',
          email: 'info@putrajaya.co.id'
        },
        address: {
          street: 'Jl. Putra Jaya Industrial No. 123',
          city: 'Jakarta',
          country: 'Indonesia'
        },
        establishedYear: 2005,
        employeeCount: 68,
        certification: ['ISO 9001:2015', 'SBU Grade 8', 'OHSAS 18001', 'ISO 14001'],
        status: 'active',
        parentCompany: 'NUSANTARA GROUP'
      }
    ];
    
    const createdSubsidiaries = [];
    for (const subsidiaryData of subsidiaries) {
      const subsidiary = await Subsidiary.create(subsidiaryData);
      createdSubsidiaries.push(subsidiary);
    }
    
    res.json({
      success: true,
      message: `Successfully seeded ${createdSubsidiaries.length} NUSANTARA GROUP subsidiaries`,
      data: createdSubsidiaries,
      cleared: deletedCount
    });
    
  } catch (error) {
    console.error('❌ Error seeding subsidiaries:', error);
    res.status(500).json({
      success: false,
      message: 'Error seeding NUSANTARA GROUP subsidiaries',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;
