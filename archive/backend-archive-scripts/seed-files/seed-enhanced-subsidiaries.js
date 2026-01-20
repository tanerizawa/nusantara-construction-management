const { models } = require('./models');
const { Subsidiary } = models;

/**
 * Enhanced Subsidiaries Data dengan Struktur Direksi Sesuai Best Practice Indonesia
 * - CV: Minimal 2 Direktur (Direktur Utama + Direktur)
 * - PT: Minimal 3 Direktur (Direktur Utama, Direktur Operasional, Direktur Keuangan)
 * Berdasarkan UU No. 40 Tahun 2007 tentang Perseroan Terbatas
 */

const enhancedSubsidiaryData = [
  {
    id: 'NU001',
    code: 'CUE14',
    name: 'CV. CAHAYA UTAMA EMPATBELAS',
    description: 'Spesialis pembangunan komersial dan infrastruktur dengan fokus pada proyek-proyek strategis di wilayah Karawang dan sekitarnya.',
    specialization: 'commercial',
    contactInfo: {
      phone: '+62-267-8451401',
      email: 'info@cahayautama14.co.id',
      fax: '+62-267-8451402'
    },
    address: {
      street: 'Jl. Industri Raya No. 14, Kawasan Industri KIIC',
      city: 'Karawang',
      state: 'Jawa Barat',
      postalCode: '41361',
      country: 'Indonesia'
    },
    establishedYear: 2008,
    employeeCount: 85,
    certification: [
      'ISO 9001:2015',
      'SBU Grade 6 Konstruksi Bangunan Gedung',
      'OHSAS 18001:2007',
      'ISO 14001:2015'
    ],
    status: 'active',
    parentCompany: 'NUSANTARA GROUP',
    boardOfDirectors: [
      {
        name: 'Ir. Budi Santoso, M.T.',
        position: 'Direktur Utama',
        email: 'budi.santoso@cahayautama14.co.id',
        phone: '+62-812-3456-7801',
        education: 'S2 Teknik Sipil ITB',
        experience: '18 tahun konstruksi komersial',
        appointmentDate: '2008-03-15',
        isActive: true
      },
      {
        name: 'Sari Wulandari, S.T., M.M.',
        position: 'Direktur Operasional',
        email: 'sari.wulandari@cahayautama14.co.id',
        phone: '+62-813-4567-8902',
        education: 'S2 Manajemen UI, S1 Teknik Industri ITB',
        experience: '15 tahun manajemen proyek konstruksi',
        appointmentDate: '2010-01-20',
        isActive: true
      },
      {
        name: 'Dra. Fitri Rahayu, M.M.',
        position: 'Direktur Keuangan',
        email: 'fitri.rahayu@cahayautama14.co.id',
        phone: '+62-814-5678-9103',
        education: 'S2 Manajemen Keuangan UI',
        experience: '12 tahun finance & accounting konstruksi',
        appointmentDate: '2012-06-10',
        isActive: true
      }
    ],
    legalInfo: {
      companyRegistrationNumber: 'AHU-001401.AH.01.01.2008',
      taxIdentificationNumber: '01.234.567.8-412.000',
      businessLicenseNumber: 'NIB-1234567890123',
      articlesOfIncorporation: 'Akta No. 14 Notaris Hendra Wijaya, SH',
      vatRegistrationNumber: 'PKP-012345678'
    }
  },

  {
    id: 'NU002',
    code: 'BSR',
    name: 'CV. BINTANG SURAYA',
    description: 'Kontraktor spesialis pembangunan perumahan dan real estate dengan pengalaman lebih dari 15 tahun di wilayah Karawang.',
    specialization: 'residential',
    contactInfo: {
      phone: '+62-267-8452001',
      email: 'info@bintangsuraya.co.id',
      fax: '+62-267-8452002'
    },
    address: {
      street: 'Jl. Permata Raya No. 88, Perumahan Bintang Mas',
      city: 'Karawang',
      state: 'Jawa Barat',
      postalCode: '41362',
      country: 'Indonesia'
    },
    establishedYear: 2009,
    employeeCount: 62,
    certification: [
      'ISO 9001:2015',
      'SBU Grade 5 Konstruksi Bangunan Gedung',
      'SMK3 Konstruksi'
    ],
    status: 'active',
    parentCompany: 'NUSANTARA GROUP',
    boardOfDirectors: [
      {
        name: 'H. Ahmad Suraya, S.T.',
        position: 'Direktur Utama',
        email: 'ahmad.suraya@bintangsuraya.co.id',
        phone: '+62-815-6789-0124',
        education: 'S1 Teknik Sipil UNTAR',
        experience: '20 tahun pengembangan perumahan',
        appointmentDate: '2009-05-01',
        isActive: true
      },
      {
        name: 'Ir. Dewi Permatasari',
        position: 'Direktur Operasional',
        email: 'dewi.permata@bintangsuraya.co.id',
        phone: '+62-816-7890-1235',
        education: 'S1 Arsitektur UNPAR',
        experience: '16 tahun desain & konstruksi residential',
        appointmentDate: '2010-08-15',
        isActive: true
      },
      {
        name: 'Bambang Sutrisno, S.E., Ak.',
        position: 'Direktur Keuangan',
        email: 'bambang.sutrisno@bintangsuraya.co.id',
        phone: '+62-817-8901-2346',
        education: 'S1 Akuntansi UNPAD',
        experience: '14 tahun akuntansi & keuangan konstruksi',
        appointmentDate: '2011-03-20',
        isActive: true
      }
    ],
    legalInfo: {
      companyRegistrationNumber: 'AHU-002001.AH.01.01.2009',
      taxIdentificationNumber: '01.234.567.9-412.000',
      businessLicenseNumber: 'NIB-2345678901234',
      articlesOfIncorporation: 'Akta No. 22 Notaris Maria Santoso, SH',
      vatRegistrationNumber: 'PKP-023456789'
    }
  },

  {
    id: 'NU003',
    code: 'KMJ',
    name: 'PT. KARYA MANDIRI JAYA',
    description: 'Perusahaan konstruksi infrastruktur yang mengkhususkan diri dalam pembangunan jalan, jembatan, dan drainase.',
    specialization: 'infrastructure',
    contactInfo: {
      phone: '+62-267-8453001',
      email: 'info@karyamandirijaya.co.id',
      fax: '+62-267-8453002'
    },
    address: {
      street: 'Jl. Kartini No. 45, Kawasan Bisnis Karawang',
      city: 'Karawang',
      state: 'Jawa Barat',
      postalCode: '41363',
      country: 'Indonesia'
    },
    establishedYear: 2005,
    employeeCount: 125,
    certification: [
      'ISO 9001:2015',
      'SBU Grade 7 Konstruksi Jalan & Jembatan',
      'OHSAS 18001:2007',
      'ISO 14001:2015',
      'SMK3 Konstruksi Bintang 4'
    ],
    status: 'active',
    parentCompany: 'NUSANTARA GROUP',
    boardOfDirectors: [
      {
        name: 'Ir. Joko Widodo, M.T.',
        position: 'Direktur Utama',
        email: 'joko.widodo@karyamandirijaya.co.id',
        phone: '+62-818-9012-3457',
        education: 'S2 Teknik Sipil UGM',
        experience: '22 tahun infrastruktur jalan & jembatan',
        appointmentDate: '2005-01-15',
        isActive: true
      },
      {
        name: 'Ir. Siti Nurhaliza, M.T.',
        position: 'Direktur Operasional',
        email: 'siti.nurhaliza@karyamandirijaya.co.id',
        phone: '+62-819-0123-4568',
        education: 'S2 Teknik Sipil ITS',
        experience: '18 tahun manajemen proyek infrastruktur',
        appointmentDate: '2007-03-20',
        isActive: true
      },
      {
        name: 'Drs. Agus Priyanto, M.M., CPA',
        position: 'Direktur Keuangan',
        email: 'agus.priyanto@karyamandirijaya.co.id',
        phone: '+62-820-1234-5679',
        education: 'S2 Manajemen Keuangan UGM, CPA',
        experience: '20 tahun finance & treasury',
        appointmentDate: '2006-09-10',
        isActive: true
      }
    ],
    legalInfo: {
      companyRegistrationNumber: 'AHU-003001.AH.01.01.2005',
      taxIdentificationNumber: '01.234.567.0-412.000',
      businessLicenseNumber: 'NIB-3456789012345',
      articlesOfIncorporation: 'Akta No. 35 Notaris Budi Hartono, SH',
      vatRegistrationNumber: 'PKP-034567890'
    }
  },

  {
    id: 'NU004',
    code: 'TBI',
    name: 'CV. TEKNIK BANGUNAN INDONESIA',
    description: 'Spesialis renovasi dan pemeliharaan bangunan dengan teknologi modern dan ramah lingkungan.',
    specialization: 'renovation',
    contactInfo: {
      phone: '+62-267-8454001',
      email: 'info@teknikbangunan.co.id',
      fax: '+62-267-8454002'
    },
    address: {
      street: 'Jl. Teknik Raya No. 12, Komplek Industri Surya',
      city: 'Karawang',
      state: 'Jawa Barat',
      postalCode: '41364',
      country: 'Indonesia'
    },
    establishedYear: 2012,
    employeeCount: 45,
    certification: [
      'ISO 9001:2015',
      'SBU Grade 4 Konstruksi Bangunan Gedung',
      'Green Building Council Indonesia',
      'SMK3 Konstruksi'
    ],
    status: 'active',
    parentCompany: 'NUSANTARA GROUP',
    boardOfDirectors: [
      {
        name: 'Ir. Andi Prasetyo, M.T.',
        position: 'Direktur Utama',
        email: 'andi.prasetyo@teknikbangunan.co.id',
        phone: '+62-821-2345-6780',
        education: 'S2 Teknik Sipil ITB',
        experience: '16 tahun renovasi & green building',
        appointmentDate: '2012-01-10',
        isActive: true
      },
      {
        name: 'Dr. Ir. Maya Sari, M.T.',
        position: 'Direktur Teknologi',
        email: 'maya.sari@teknikbangunan.co.id',
        phone: '+62-822-3456-7891',
        education: 'S3 Teknik Sipil ITB, S2 Green Technology',
        experience: '14 tahun research & development konstruksi',
        appointmentDate: '2013-06-15',
        isActive: true
      },
      {
        name: 'Rina Kartika, S.E., M.M.',
        position: 'Direktur Keuangan',
        email: 'rina.kartika@teknikbangunan.co.id',
        phone: '+62-823-4567-8902',
        education: 'S2 Manajemen Keuangan UI',
        experience: '12 tahun financial management',
        appointmentDate: '2014-02-20',
        isActive: true
      }
    ],
    legalInfo: {
      companyRegistrationNumber: 'AHU-004001.AH.01.01.2012',
      taxIdentificationNumber: '01.234.567.1-412.000',
      businessLicenseNumber: 'NIB-4567890123456',
      articlesOfIncorporation: 'Akta No. 18 Notaris Sari Dewi, SH',
      vatRegistrationNumber: 'PKP-045678901'
    }
  },

  {
    id: 'NU005',
    code: 'IKP',
    name: 'PT. INDAH KARYA PERSADA',
    description: 'Kontraktor industri yang mengkhususkan diri dalam pembangunan pabrik, gudang, dan fasilitas industri.',
    specialization: 'industrial',
    contactInfo: {
      phone: '+62-267-8455001',
      email: 'info@indahkaryapersada.co.id',
      fax: '+62-267-8455002'
    },
    address: {
      street: 'Jl. Industri Persada No. 77, Kawasan Industri MM2100',
      city: 'Karawang',
      state: 'Jawa Barat',
      postalCode: '41365',
      country: 'Indonesia'
    },
    establishedYear: 2006,
    employeeCount: 98,
    certification: [
      'ISO 9001:2015',
      'SBU Grade 6 Konstruksi Bangunan Gedung',
      'OHSAS 18001:2007',
      'ISO 14001:2015',
      'SMK3 Konstruksi Bintang 3'
    ],
    status: 'active',
    parentCompany: 'NUSANTARA GROUP',
    boardOfDirectors: [
      {
        name: 'Ir. Bambang Sutrisno, M.T.',
        position: 'Direktur Utama',
        email: 'bambang.sutrisno@indahkaryapersada.co.id',
        phone: '+62-824-5678-9013',
        education: 'S2 Teknik Industri ITB',
        experience: '20 tahun konstruksi industri',
        appointmentDate: '2006-03-01',
        isActive: true
      },
      {
        name: 'Ir. Lilis Suryani, M.T.',
        position: 'Direktur Operasional',
        email: 'lilis.suryani@indahkaryapersada.co.id',
        phone: '+62-825-6789-0124',
        education: 'S2 Teknik Sipil UGM',
        experience: '17 tahun project management industri',
        appointmentDate: '2008-07-15',
        isActive: true
      },
      {
        name: 'Hendro Wijaya, S.E., M.M., CFA',
        position: 'Direktur Keuangan',
        email: 'hendro.wijaya@indahkaryapersada.co.id',
        phone: '+62-826-7890-1235',
        education: 'S2 Finance UI, CFA Institute',
        experience: '15 tahun corporate finance',
        appointmentDate: '2009-01-20',
        isActive: true
      }
    ],
    legalInfo: {
      companyRegistrationNumber: 'AHU-005001.AH.01.01.2006',
      taxIdentificationNumber: '01.234.567.2-412.000',
      businessLicenseNumber: 'NIB-5678901234567',
      articlesOfIncorporation: 'Akta No. 28 Notaris Indra Gunawan, SH',
      vatRegistrationNumber: 'PKP-056789012'
    }
  },

  {
    id: 'NU006',
    code: 'NAI',
    name: 'CV. NUSANTARA ARSITEKTUR INTERIOR',
    description: 'Spesialis desain interior dan renovasi dengan konsep modern dan fungsional untuk berbagai jenis bangunan.',
    specialization: 'interior',
    contactInfo: {
      phone: '+62-267-8456001',
      email: 'info@nusantarainterior.co.id',
      fax: '+62-267-8456002'
    },
    address: {
      street: 'Jl. Desain Kreatif No. 25, Komplek Creative Center',
      city: 'Karawang',
      state: 'Jawa Barat',
      postalCode: '41366',
      country: 'Indonesia'
    },
    establishedYear: 2014,
    employeeCount: 35,
    certification: [
      'ISO 9001:2015',
      'SBU Grade 3 Konstruksi Bangunan Gedung',
      'Indonesian Interior Designer Association (IIDA)',
      'Green Interior Design Certificate'
    ],
    status: 'active',
    parentCompany: 'NUSANTARA GROUP',
    boardOfDirectors: [
      {
        name: 'Ir. Ratna Sari, M.Des.',
        position: 'Direktur Utama',
        email: 'ratna.sari@nusantarainterior.co.id',
        phone: '+62-827-8901-2346',
        education: 'S2 Design ITB, Certificate Interior Design Singapore',
        experience: '18 tahun arsitektur & interior design',
        appointmentDate: '2014-02-01',
        isActive: true
      },
      {
        name: 'Drs. Yoga Pratama, M.Sn.',
        position: 'Direktur Kreatif',
        email: 'yoga.pratama@nusantarainterior.co.id',
        phone: '+62-828-9012-3457',
        education: 'S2 Seni Rupa & Design ISI Yogyakarta',
        experience: '15 tahun creative design & project management',
        appointmentDate: '2015-08-10',
        isActive: true
      },
      {
        name: 'Sri Wahyuni, S.E., M.M.',
        position: 'Direktur Keuangan',
        email: 'sri.wahyuni@nusantarainterior.co.id',
        phone: '+62-829-0123-4568',
        education: 'S2 Manajemen UNPAD',
        experience: '10 tahun finance & business development',
        appointmentDate: '2016-01-15',
        isActive: true
      }
    ],
    legalInfo: {
      companyRegistrationNumber: 'AHU-006001.AH.01.01.2014',
      taxIdentificationNumber: '01.234.567.3-412.000',
      businessLicenseNumber: 'NIB-6789012345678',
      articlesOfIncorporation: 'Akta No. 42 Notaris Dewi Sartika, SH',
      vatRegistrationNumber: 'PKP-067890123'
    }
  }
];

/**
 * Seed Enhanced Subsidiaries dengan Struktur Direksi Professional
 */
async function seedEnhancedSubsidiaries() {
  try {
    console.log('🌱 Starting Enhanced NUSANTARA GROUP subsidiaries seeding...');
    
    // Clear existing subsidiaries first
    console.log('🗑️  Clearing existing subsidiaries...');
    const deletedCount = await Subsidiary.destroy({
      where: {},
      force: true // Hard delete
    });
    console.log(`✅ Cleared ${deletedCount} existing subsidiaries`);
    
    // Insert new subsidiaries with enhanced directors structure
    console.log('📝 Creating enhanced subsidiaries with professional board structure...');
    const createdSubsidiaries = [];
    
    for (const subsidiary of enhancedSubsidiaryData) {
      try {
        const created = await Subsidiary.create(subsidiary);
        createdSubsidiaries.push(created);
        console.log(`✅ Created: ${subsidiary.name} (${subsidiary.code}) - ${subsidiary.boardOfDirectors.length} directors`);
      } catch (error) {
        console.error(`❌ Failed to create ${subsidiary.name}:`, error.message);
      }
    }
    
    console.log('\n🎉 Enhanced NUSANTARA GROUP subsidiaries seeding completed!');
    console.log(`📊 Summary:`);
    console.log(`   • Total subsidiaries created: ${createdSubsidiaries.length}`);
    console.log(`   • Total directors: ${enhancedSubsidiaryData.reduce((sum, sub) => sum + sub.boardOfDirectors.length, 0)}`);
    console.log(`   • Specializations covered: ${[...new Set(enhancedSubsidiaryData.map(s => s.specialization))].join(', ')}`);
    
    return {
      success: true,
      subsidiaries: createdSubsidiaries,
      cleared: deletedCount,
      summary: {
        totalSubsidiaries: createdSubsidiaries.length,
        totalDirectors: enhancedSubsidiaryData.reduce((sum, sub) => sum + sub.boardOfDirectors.length, 0),
        specializations: [...new Set(enhancedSubsidiaryData.map(s => s.specialization))]
      }
    };
    
  } catch (error) {
    console.error('❌ Error seeding enhanced subsidiaries:', error);
    throw error;
  }
}

// Run seeder if called directly
if (require.main === module) {
  seedEnhancedSubsidiaries()
    .then(result => {
      console.log('✅ Seeder completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Seeder failed:', error);
      process.exit(1);
    });
}

module.exports = {
  seedEnhancedSubsidiaries,
  enhancedSubsidiaryData
};
