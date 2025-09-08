const { models } = require('./models');
const { Subsidiary } = models;

/**
 * Seed script untuk menambahkan anak usaha NUSANTARA GROUP
 * Sesuai dengan requirement dan best practice database
 */

const subsidiaryData = [
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
      street: 'Jl. Industri Raya No. 14, Kawasan Industri',
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
        name: 'Budi Santoso',
        position: 'Direktur Utama',
        education: 'S1 Teknik Sipil ITB',
        experience: '15 tahun konstruksi'
      },
      {
        name: 'Sari Wulandari',
        position: 'Direktur Operasional',
        education: 'S1 Manajemen UI',
        experience: '12 tahun manajemen proyek'
      }
    ],
    legalInfo: {
      companyRegistrationNumber: 'AHU-001401.AH.01.01.2008',
      taxIdentificationNumber: '01.234.567.8-412.000',
      businessLicenseNumber: 'NIB-1234567890123',
      articlesOfIncorporation: 'Akta No. 14 Notaris Hendra Wijaya, SH',
      vatRegistrationNumber: 'PKP-012345678'
    },
    permits: [
      {
        type: 'SIUJK',
        number: 'SIUJK-001/LPJK/2023',
        issuedBy: 'LPJK Jawa Barat',
        validUntil: '2026-01-15',
        status: 'active'
      },
      {
        type: 'Izin Usaha Konstruksi',
        number: 'IUK-014/PUPR/2023',
        issuedBy: 'Dinas PUPR Karawang',
        validUntil: '2025-12-30',
        status: 'active'
      }
    ],
    financialInfo: {
      authorizedCapital: 5000000000,
      paidUpCapital: 2500000000,
      currency: 'IDR',
      fiscalYearEnd: 'December'
    },
    attachments: [],
    profileInfo: {
      website: 'www.cahayautama14.co.id',
      socialMedia: {
        instagram: '@cahayautama14',
        linkedin: 'cahaya-utama-empatbelas'
      },
      companySize: 'medium',
      industryClassification: 'Konstruksi Bangunan Gedung',
      businessDescription: 'Perusahaan konstruksi yang mengkhususkan diri dalam pembangunan gedung komersial, perkantoran, dan infrastruktur pendukung dengan standar kualitas tinggi.'
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
      street: 'Jl. Perumahan Indah No. 25, Kompleks Bintang Residence',
      city: 'Karawang',
      state: 'Jawa Barat', 
      postalCode: '41362',
      country: 'Indonesia'
    },
    establishedYear: 2005,
    employeeCount: 120,
    certification: [
      'ISO 9001:2015',
      'SBU Grade 7 Konstruksi Bangunan Gedung',
      'ISO 14001:2015',
      'SMK3 Konstruksi'
    ],
    status: 'active',
    parentCompany: 'NUSANTARA GROUP',
    boardOfDirectors: [
      {
        name: 'Ahmad Surya',
        position: 'Direktur Utama',
        education: 'S1 Teknik Sipil UNPAD',
        experience: '18 tahun real estate'
      },
      {
        name: 'Maya Sari',
        position: 'Direktur Keuangan',
        education: 'S1 Akuntansi UNTAR',
        experience: '14 tahun keuangan konstruksi'
      }
    ],
    legalInfo: {
      companyRegistrationNumber: 'AHU-002501.AH.01.01.2005',
      taxIdentificationNumber: '01.234.567.9-412.000',
      businessLicenseNumber: 'NIB-2345678901234',
      articlesOfIncorporation: 'Akta No. 25 Notaris Rina Kusuma, SH',
      vatRegistrationNumber: 'PKP-023456789'
    },
    permits: [
      {
        type: 'SIUJK',
        number: 'SIUJK-002/LPJK/2023', 
        issuedBy: 'LPJK Jawa Barat',
        validUntil: '2026-03-20',
        status: 'active'
      }
    ],
    financialInfo: {
      authorizedCapital: 8000000000,
      paidUpCapital: 4000000000,
      currency: 'IDR',
      fiscalYearEnd: 'December'
    },
    attachments: [],
    profileInfo: {
      website: 'www.bintangsuraya.co.id',
      socialMedia: {
        facebook: 'BintangSurayaOfficial',
        instagram: '@bintangsuraya'
      },
      companySize: 'medium',
      industryClassification: 'Konstruksi Perumahan',
      businessDescription: 'Developer dan kontraktor perumahan terpercaya dengan fokus pada pembangunan hunian berkualitas untuk keluarga Indonesia.'
    }
  },
  {
    id: 'NU003',
    code: 'LTN',
    name: 'CV. LATANSA',
    description: 'Spesialis renovasi dan interior design dengan keahlian dalam transformasi ruang komersial dan residensial.',
    specialization: 'renovation',
    contactInfo: {
      phone: '+62-267-8453001',
      email: 'info@latansa.co.id',
      fax: '+62-267-8453002'
    },
    address: {
      street: 'Jl. Design Center No. 8, Kawasan Bisnis Karawang',
      city: 'Karawang',
      state: 'Jawa Barat',
      postalCode: '41363',
      country: 'Indonesia'
    },
    establishedYear: 2012,
    employeeCount: 65,
    certification: [
      'ISO 9001:2015',
      'SBU Grade 5 Konstruksi Bangunan Gedung',
      'Sertifikat BNSP Interior Design'
    ],
    status: 'active',
    parentCompany: 'NUSANTARA GROUP',
    boardOfDirectors: [
      {
        name: 'Lisa Tanasya',
        position: 'Direktur Utama',
        education: 'S1 Desain Interior ITB',
        experience: '10 tahun interior design'
      },
      {
        name: 'Rudi Hartanto',
        position: 'Direktur Teknik',
        education: 'S1 Teknik Sipil UNPAR',
        experience: '12 tahun renovasi'
      }
    ],
    legalInfo: {
      companyRegistrationNumber: 'AHU-000812.AH.01.01.2012',
      taxIdentificationNumber: '01.234.567.0-412.000',
      businessLicenseNumber: 'NIB-3456789012345',
      articlesOfIncorporation: 'Akta No. 8 Notaris David Pranata, SH',
      vatRegistrationNumber: 'PKP-034567890'
    },
    permits: [
      {
        type: 'SIUJK',
        number: 'SIUJK-003/LPJK/2023',
        issuedBy: 'LPJK Jawa Barat', 
        validUntil: '2025-08-15',
        status: 'active'
      }
    ],
    financialInfo: {
      authorizedCapital: 3000000000,
      paidUpCapital: 1500000000,
      currency: 'IDR',
      fiscalYearEnd: 'December'
    },
    attachments: [],
    profileInfo: {
      website: 'www.latansa.co.id',
      socialMedia: {
        instagram: '@latansadesign',
        pinterest: 'LatansaInterior'
      },
      companySize: 'small',
      industryClassification: 'Jasa Renovasi dan Interior',
      businessDescription: 'Perusahaan spesialis renovasi dan desain interior yang menghadirkan solusi inovatif untuk transformasi ruang modern.'
    }
  },
  {
    id: 'NU004',
    code: 'GBN',
    name: 'CV. GRAHA BANGUN NUSANTARA',
    description: 'Kontraktor infrastruktur dengan spesialisasi pembangunan jalan, jembatan, dan fasilitas publik.',
    specialization: 'infrastructure',
    contactInfo: {
      phone: '+62-267-8454001',
      email: 'info@grahabangunnusantara.co.id',
      fax: '+62-267-8454002'
    },
    address: {
      street: 'Jl. Infrastruktur Utama No. 12, Kawasan Industri Karawang',
      city: 'Karawang',
      state: 'Jawa Barat',
      postalCode: '41364',
      country: 'Indonesia'
    },
    establishedYear: 2006,
    employeeCount: 200,
    certification: [
      'ISO 9001:2015',
      'SBU Grade 8 Konstruksi Jalan dan Jembatan',
      'ISO 14001:2015',
      'OHSAS 18001:2007',
      'SMK3 Konstruksi Bintang 3'
    ],
    status: 'active',
    parentCompany: 'NUSANTARA GROUP',
    boardOfDirectors: [
      {
        name: 'Bambang Nusantara',
        position: 'Direktur Utama',
        education: 'S1 Teknik Sipil UGM',
        experience: '20 tahun infrastruktur'
      },
      {
        name: 'Dewi Sartika',
        position: 'Direktur Operasional',
        education: 'S1 Teknik Sipil ITS',
        experience: '16 tahun manajemen proyek'
      }
    ],
    legalInfo: {
      companyRegistrationNumber: 'AHU-001206.AH.01.01.2006',
      taxIdentificationNumber: '01.234.567.1-412.000',
      businessLicenseNumber: 'NIB-4567890123456',
      articlesOfIncorporation: 'Akta No. 12 Notaris Agus Prasetyo, SH',
      vatRegistrationNumber: 'PKP-045678901'
    },
    permits: [
      {
        type: 'SIUJK',
        number: 'SIUJK-004/LPJK/2023',
        issuedBy: 'LPJK Jawa Barat',
        validUntil: '2026-06-30',
        status: 'active'
      },
      {
        type: 'Izin Lingkungan',
        number: 'IL-012/KLHK/2023',
        issuedBy: 'KLHK Jawa Barat',
        validUntil: '2025-12-15',
        status: 'active'
      }
    ],
    financialInfo: {
      authorizedCapital: 15000000000,
      paidUpCapital: 7500000000,
      currency: 'IDR',
      fiscalYearEnd: 'December'
    },
    attachments: [],
    profileInfo: {
      website: 'www.grahabangunnusantara.co.id',
      socialMedia: {
        linkedin: 'graha-bangun-nusantara',
        youtube: 'GrahaBangunNusantara'
      },
      companySize: 'large',
      industryClassification: 'Konstruksi Infrastruktur',
      businessDescription: 'Kontraktor infrastruktur terkemuka yang berkomitmen membangun fondasi kemajuan bangsa melalui pembangunan infrastruktur berkualitas.'
    }
  },
  {
    id: 'NU005',
    code: 'SSR',
    name: 'CV. SAHABAT SINAR RAYA',
    description: 'Spesialis konstruksi industrial dan warehouse dengan teknologi modern untuk mendukung pertumbuhan industri.',
    specialization: 'industrial',
    contactInfo: {
      phone: '+62-267-8455001',
      email: 'info@sahabatsinarraya.co.id',
      fax: '+62-267-8455002'
    },
    address: {
      street: 'Jl. Industrial Estate No. 30, Kawasan Industri KIIC',
      city: 'Karawang',
      state: 'Jawa Barat',
      postalCode: '41365',
      country: 'Indonesia'
    },
    establishedYear: 2010,
    employeeCount: 150,
    certification: [
      'ISO 9001:2015',
      'SBU Grade 7 Konstruksi Bangunan Gedung',
      'ISO 14001:2015',
      'SMK3 Konstruksi',
      'Sertifikat Green Building'
    ],
    status: 'active',
    parentCompany: 'NUSANTARA GROUP',
    boardOfDirectors: [
      {
        name: 'Hendro Sinarto',
        position: 'Direktur Utama',
        education: 'S1 Teknik Industri ITB',
        experience: '17 tahun konstruksi industrial'
      },
      {
        name: 'Ratna Sari',
        position: 'Direktur Teknik',
        education: 'S1 Teknik Sipil UNPAD',
        experience: '13 tahun warehouse construction'
      }
    ],
    legalInfo: {
      companyRegistrationNumber: 'AHU-003010.AH.01.01.2010',
      taxIdentificationNumber: '01.234.567.2-412.000',
      businessLicenseNumber: 'NIB-5678901234567',
      articlesOfIncorporation: 'Akta No. 30 Notaris Sari Indrawati, SH',
      vatRegistrationNumber: 'PKP-056789012'
    },
    permits: [
      {
        type: 'SIUJK',
        number: 'SIUJK-005/LPJK/2023',
        issuedBy: 'LPJK Jawa Barat',
        validUntil: '2026-09-10',
        status: 'active'
      }
    ],
    financialInfo: {
      authorizedCapital: 10000000000,
      paidUpCapital: 5000000000,
      currency: 'IDR',
      fiscalYearEnd: 'December'
    },
    attachments: [],
    profileInfo: {
      website: 'www.sahabatsinarraya.co.id',
      socialMedia: {
        instagram: '@sahabatsinarraya',
        linkedin: 'sahabat-sinar-raya'
      },
      companySize: 'medium',
      industryClassification: 'Konstruksi Bangunan Industri',
      businessDescription: 'Spesialis pembangunan fasilitas industrial modern yang mendukung perkembangan industri manufaktur dan logistik.'
    }
  },
  {
    id: 'NU006',
    code: 'PJK',
    name: 'PT. PUTRA JAYA KONSTRUKASI',
    description: 'Perusahaan konstruksi terbesar dalam grup dengan kemampuan menangani proyek skala besar dan kompleks.',
    specialization: 'general',
    contactInfo: {
      phone: '+62-267-8456001',
      email: 'info@putrajayakonstruksi.co.id',
      fax: '+62-267-8456002'
    },
    address: {
      street: 'Jl. Putra Jaya Boulevard No. 1, Kawasan Bisnis Karawang',
      city: 'Karawang',
      state: 'Jawa Barat',
      postalCode: '41366',
      country: 'Indonesia'
    },
    establishedYear: 2000,
    employeeCount: 350,
    certification: [
      'ISO 9001:2015',
      'SBU Grade 9 Konstruksi Bangunan Gedung',
      'SBU Grade 9 Konstruksi Jalan dan Jembatan',
      'ISO 14001:2015',
      'OHSAS 18001:2007',
      'SMK3 Konstruksi Bintang 5'
    ],
    status: 'active',
    parentCompany: 'NUSANTARA GROUP',
    boardOfDirectors: [
      {
        name: 'Ir. Jaya Putra, M.T.',
        position: 'Direktur Utama',
        education: 'S2 Teknik Sipil ITB',
        experience: '25 tahun konstruksi'
      },
      {
        name: 'Dra. Siti Nurjanah, M.M.',
        position: 'Direktur Keuangan',
        education: 'S2 Manajemen Keuangan UI',
        experience: '20 tahun finance'
      },
      {
        name: 'Ir. Budi Setiawan',
        position: 'Direktur Operasional',
        education: 'S1 Teknik Sipil UGM',
        experience: '22 tahun project management'
      }
    ],
    legalInfo: {
      companyRegistrationNumber: 'AHU-000100.AH.01.01.2000',
      taxIdentificationNumber: '01.234.567.3-412.000',
      businessLicenseNumber: 'NIB-6789012345678',
      articlesOfIncorporation: 'Akta No. 1 Notaris Muhammad Ali, SH',
      vatRegistrationNumber: 'PKP-067890123'
    },
    permits: [
      {
        type: 'SIUJK',
        number: 'SIUJK-006/LPJK/2023',
        issuedBy: 'LPJK Jawa Barat',
        validUntil: '2026-12-31',
        status: 'active'
      },
      {
        type: 'Izin Usaha Konstruksi Nasional',
        number: 'IUKN-001/PUPR/2023',
        issuedBy: 'Kementerian PUPR',
        validUntil: '2026-12-31',
        status: 'active'
      }
    ],
    financialInfo: {
      authorizedCapital: 50000000000,
      paidUpCapital: 25000000000,
      currency: 'IDR',
      fiscalYearEnd: 'December'
    },
    attachments: [],
    profileInfo: {
      website: 'www.putrajayakonstruksi.co.id',
      socialMedia: {
        instagram: '@putrajayakonstruksi',
        linkedin: 'putra-jaya-konstruksi',
        youtube: 'PutraJayaKonstruksi',
        facebook: 'PutraJayaKonstruksiOfficial'
      },
      companySize: 'large',
      industryClassification: 'Konstruksi Umum',
      businessDescription: 'Perusahaan konstruksi terdepan dengan pengalaman lebih dari 20 tahun dalam menangani proyek-proyek bergengsi skala nasional.'
    }
  }
];

async function seedNusantaraSubsidiaries() {
  try {
    console.log('🌱 Starting NUSANTARA GROUP subsidiaries seeding...');
    
    // Clear existing subsidiaries first
    console.log('🗑️  Clearing existing subsidiaries...');
    const deletedCount = await Subsidiary.destroy({
      where: {},
      force: true // Hard delete
    });
    console.log(`✅ Cleared ${deletedCount} existing subsidiaries`);
    
    // Insert new subsidiaries
    console.log('📝 Creating new subsidiaries...');
    const createdSubsidiaries = [];
    
    for (const subsidiary of subsidiaryData) {
      try {
        const created = await Subsidiary.create(subsidiary);
        createdSubsidiaries.push(created);
        console.log(`✅ Created: ${subsidiary.name} (${subsidiary.code})`);
      } catch (error) {
        console.error(`❌ Failed to create ${subsidiary.name}:`, error.message);
      }
    }
    
    console.log('\n🎉 SEEDING COMPLETED!');
    console.log(`📊 Total subsidiaries created: ${createdSubsidiaries.length}`);
    console.log('\n📋 SUMMARY:');
    
    createdSubsidiaries.forEach((sub, index) => {
      console.log(`${index + 1}. ${sub.name} (${sub.code}) - ${sub.specialization}`);
    });
    
    console.log('\n✅ All NUSANTARA GROUP subsidiaries have been successfully added to the database!');
    
    return {
      success: true,
      created: createdSubsidiaries.length,
      data: createdSubsidiaries
    };
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

// Export function
module.exports = { seedNusantaraSubsidiaries };

// Run if called directly
if (require.main === module) {
  seedNusantaraSubsidiaries()
    .then(() => {
      console.log('\n🚀 Script completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 Script failed:', error);
      process.exit(1);
    });
}
