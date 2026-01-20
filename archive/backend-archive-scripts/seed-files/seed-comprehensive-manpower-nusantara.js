const { models } = require('./models');
const { Manpower, Subsidiary } = models;

/**
 * Professional Manpower Seeder untuk NUSANTARA GROUP
 * - 3 Direksi per anak usaha (sesuai best practice Indonesia)
 * - 20+ Tenaga Ahli/Professional Staff
 * - Data sesuai dengan subsidiaries yang sudah ada di database
 */

// Data Direksi untuk setiap anak usaha (3 direksi sesuai best practice CV/PT di Indonesia)
const directorsData = [
  // NU001 - CV. CAHAYA UTAMA EMPATBELAS (Commercial)
  {
    subsidiaryId: 'NU001',
    employees: [
      {
        id: 'DIR-CUE14-001',
        employeeId: 'CUE14-DIR-001',
        name: 'Ir. Budi Santoso, M.T.',
        position: 'Direktur Utama',
        department: 'Direksi',
        email: 'budi.santoso@cahayautama14.co.id',
        phone: '+62-267-8451401',
        joinDate: '2008-01-15',
        birthDate: '1975-03-20',
        address: 'Jl. Merdeka No. 45, Karawang',
        status: 'active',
        employmentType: 'permanent',
        salary: 50000000,
        skills: ['Leadership', 'Project Management', 'Commercial Construction', 'Strategic Planning'],
        metadata: {
          education: 'S2 Teknik Sipil ITB',
          experience: '20 tahun konstruksi komersial',
          certifications: ['PMP', 'LPJK Grade A'],
          specialization: 'Commercial Building'
        }
      },
      {
        id: 'DIR-CUE14-002',
        employeeId: 'CUE14-DIR-002',
        name: 'Sari Wulandari, S.E., M.M.',
        position: 'Direktur Operasional',
        department: 'Direksi',
        email: 'sari.wulandari@cahayautama14.co.id',
        phone: '+62-267-8451402',
        joinDate: '2010-03-01',
        birthDate: '1980-07-15',
        address: 'Jl. Operasional No. 12, Karawang',
        status: 'active',
        employmentType: 'permanent',
        salary: 45000000,
        skills: ['Operations Management', 'Team Leadership', 'Business Development', 'Quality Control'],
        metadata: {
          education: 'S2 Manajemen UI',
          experience: '15 tahun manajemen operasional',
          certifications: ['ISO 9001 Lead Auditor', 'CSMS'],
          specialization: 'Operations Management'
        }
      },
      {
        id: 'DIR-CUE14-003',
        employeeId: 'CUE14-DIR-003',
        name: 'Drs. Ahmad Faisal, M.M.',
        position: 'Direktur Keuangan',
        department: 'Direksi',
        email: 'ahmad.faisal@cahayautama14.co.id',
        phone: '+62-267-8451403',
        joinDate: '2009-06-15',
        birthDate: '1978-11-10',
        address: 'Jl. Keuangan No. 8, Karawang',
        status: 'active',
        employmentType: 'permanent',
        salary: 45000000,
        skills: ['Financial Management', 'Corporate Finance', 'Risk Management', 'Budget Planning'],
        metadata: {
          education: 'S2 Manajemen Keuangan UNPAD',
          experience: '16 tahun keuangan korporat',
          certifications: ['CFA', 'CA'],
          specialization: 'Corporate Finance'
        }
      }
    ]
  },

  // NU002 - CV. BINTANG SURAYA (Residential)
  {
    subsidiaryId: 'NU002',
    employees: [
      {
        id: 'DIR-BSR-001',
        employeeId: 'BSR-DIR-001',
        name: 'Ir. Ahmad Surya, M.T.',
        position: 'Direktur Utama',
        department: 'Direksi',
        email: 'ahmad.surya@bintangsuraya.co.id',
        phone: '+62-267-8452001',
        joinDate: '2005-02-01',
        birthDate: '1970-05-25',
        address: 'Jl. Bintang No. 25, Karawang',
        status: 'active',
        employmentType: 'permanent',
        salary: 48000000,
        skills: ['Real Estate Development', 'Residential Construction', 'Strategic Planning', 'Market Analysis'],
        metadata: {
          education: 'S2 Teknik Sipil UNPAD',
          experience: '25 tahun real estate',
          certifications: ['REI', 'LPJK Grade A'],
          specialization: 'Residential Development'
        }
      },
      {
        id: 'DIR-BSR-002',
        employeeId: 'BSR-DIR-002',
        name: 'Maya Sari, S.E., Ak., M.M.',
        position: 'Direktur Keuangan',
        department: 'Direksi',
        email: 'maya.sari@bintangsuraya.co.id',
        phone: '+62-267-8452002',
        joinDate: '2007-04-15',
        birthDate: '1975-09-12',
        address: 'Jl. Keuangan Bintang No. 15, Karawang',
        status: 'active',
        employmentType: 'permanent',
        salary: 43000000,
        skills: ['Financial Planning', 'Investment Analysis', 'Corporate Accounting', 'Tax Management'],
        metadata: {
          education: 'S2 Akuntansi UNTAR',
          experience: '18 tahun keuangan konstruksi',
          certifications: ['CPA', 'CA', 'CMA'],
          specialization: 'Construction Finance'
        }
      },
      {
        id: 'DIR-BSR-003',
        employeeId: 'BSR-DIR-003',
        name: 'Ir. Bambang Wijaya',
        position: 'Direktur Teknik',
        department: 'Direksi',
        email: 'bambang.wijaya@bintangsuraya.co.id',
        phone: '+62-267-8452003',
        joinDate: '2006-08-20',
        birthDate: '1973-12-05',
        address: 'Jl. Teknik No. 20, Karawang',
        status: 'active',
        employmentType: 'permanent',
        salary: 43000000,
        skills: ['Structural Engineering', 'Construction Management', 'Quality Assurance', 'Technical Planning'],
        metadata: {
          education: 'S1 Teknik Sipil ITB',
          experience: '20 tahun engineering',
          certifications: ['PII', 'LPJK Grade A'],
          specialization: 'Structural Engineering'
        }
      }
    ]
  },

  // NU003 - CV. LATANSA (Renovation)
  {
    subsidiaryId: 'NU003',
    employees: [
      {
        id: 'DIR-LTN-001',
        employeeId: 'LTN-DIR-001',
        name: 'Lisa Tanasya, S.Sn., M.Des.',
        position: 'Direktur Utama',
        department: 'Direksi',
        email: 'lisa.tanasya@latansa.co.id',
        phone: '+62-267-8453001',
        joinDate: '2012-01-10',
        birthDate: '1982-04-18',
        address: 'Jl. Design No. 10, Karawang',
        status: 'active',
        employmentType: 'permanent',
        salary: 42000000,
        skills: ['Interior Design', 'Renovation Planning', 'Creative Direction', 'Client Relations'],
        metadata: {
          education: 'S2 Desain Interior ITB',
          experience: '13 tahun interior design',
          certifications: ['BNSP Interior Designer', 'HDII'],
          specialization: 'Interior Design'
        }
      },
      {
        id: 'DIR-LTN-002',
        employeeId: 'LTN-DIR-002',
        name: 'Ir. Rudi Hartanto',
        position: 'Direktur Teknik',
        department: 'Direksi',
        email: 'rudi.hartanto@latansa.co.id',
        phone: '+62-267-8453002',
        joinDate: '2013-03-15',
        birthDate: '1978-08-22',
        address: 'Jl. Teknik Renovasi No. 22, Karawang',
        status: 'active',
        employmentType: 'permanent',
        salary: 40000000,
        skills: ['Renovation Engineering', 'Project Execution', 'Technical Analysis', 'Quality Control'],
        metadata: {
          education: 'S1 Teknik Sipil UNPAR',
          experience: '15 tahun renovasi',
          certifications: ['PII', 'BNSP'],
          specialization: 'Renovation Engineering'
        }
      },
      {
        id: 'DIR-LTN-003',
        employeeId: 'LTN-DIR-003',
        name: 'Sinta Dewi, S.E., M.M.',
        position: 'Direktur Operasional',
        department: 'Direksi',
        email: 'sinta.dewi@latansa.co.id',
        phone: '+62-267-8453003',
        joinDate: '2014-05-20',
        birthDate: '1980-01-30',
        address: 'Jl. Operasional No. 30, Karawang',
        status: 'active',
        employmentType: 'permanent',
        salary: 38000000,
        skills: ['Operations Management', 'Business Development', 'Customer Service', 'Process Improvement'],
        metadata: {
          education: 'S2 Manajemen UNPAD',
          experience: '12 tahun manajemen bisnis',
          certifications: ['PMP', 'Lean Six Sigma'],
          specialization: 'Business Operations'
        }
      }
    ]
  },

  // NU004 - CV. GRAHA BANGUN NUSANTARA (Infrastructure)
  {
    subsidiaryId: 'NU004',
    employees: [
      {
        id: 'DIR-GBN-001',
        employeeId: 'GBN-DIR-001',
        name: 'Ir. Bambang Nusantara, M.T.',
        position: 'Direktur Utama',
        department: 'Direksi',
        email: 'bambang.nusantara@grahabangunnusantara.co.id',
        phone: '+62-267-8454001',
        joinDate: '2006-01-15',
        birthDate: '1968-06-10',
        address: 'Jl. Infrastruktur No. 10, Karawang',
        status: 'active',
        employmentType: 'permanent',
        salary: 55000000,
        skills: ['Infrastructure Development', 'Strategic Planning', 'Government Relations', 'Large Scale Projects'],
        metadata: {
          education: 'S2 Teknik Sipil UGM',
          experience: '25 tahun infrastruktur',
          certifications: ['LPJK Grade A', 'PMP'],
          specialization: 'Infrastructure Engineering'
        }
      },
      {
        id: 'DIR-GBN-002',
        employeeId: 'GBN-DIR-002',
        name: 'Ir. Dewi Sartika, M.T.',
        position: 'Direktur Operasional',
        department: 'Direksi',
        email: 'dewi.sartika@grahabangunnusantara.co.id',
        phone: '+62-267-8454002',
        joinDate: '2008-03-20',
        birthDate: '1975-11-25',
        address: 'Jl. Operasional GBN No. 25, Karawang',
        status: 'active',
        employmentType: 'permanent',
        salary: 50000000,
        skills: ['Project Management', 'Operations Excellence', 'Team Leadership', 'Quality Management'],
        metadata: {
          education: 'S2 Teknik Sipil ITS',
          experience: '20 tahun manajemen proyek',
          certifications: ['PMP', 'PRINCE2', 'ISO 9001'],
          specialization: 'Project Management'
        }
      },
      {
        id: 'DIR-GBN-003',
        employeeId: 'GBN-DIR-003',
        name: 'Drs. Agus Prasetyo, M.M.',
        position: 'Direktur Keuangan',
        department: 'Direksi',
        email: 'agus.prasetyo@grahabangunnusantara.co.id',
        phone: '+62-267-8454003',
        joinDate: '2007-07-10',
        birthDate: '1972-02-14',
        address: 'Jl. Keuangan GBN No. 14, Karawang',
        status: 'active',
        employmentType: 'permanent',
        salary: 50000000,
        skills: ['Corporate Finance', 'Investment Planning', 'Financial Analysis', 'Risk Management'],
        metadata: {
          education: 'S2 Manajemen Keuangan UI',
          experience: '22 tahun keuangan korporat',
          certifications: ['CFA', 'FRM', 'CA'],
          specialization: 'Corporate Finance'
        }
      }
    ]
  },

  // NU005 - CV. SAHABAT SINAR RAYA (Industrial)
  {
    subsidiaryId: 'NU005',
    employees: [
      {
        id: 'DIR-SSR-001',
        employeeId: 'SSR-DIR-001',
        name: 'Ir. Hendro Sinarto, M.T.',
        position: 'Direktur Utama',
        department: 'Direksi',
        email: 'hendro.sinarto@sahabatsinarraya.co.id',
        phone: '+62-267-8455001',
        joinDate: '2010-02-01',
        birthDate: '1973-08-15',
        address: 'Jl. Industrial No. 15, Karawang',
        status: 'active',
        employmentType: 'permanent',
        salary: 52000000,
        skills: ['Industrial Engineering', 'Manufacturing Facilities', 'Process Optimization', 'Strategic Planning'],
        metadata: {
          education: 'S2 Teknik Industri ITB',
          experience: '20 tahun konstruksi industrial',
          certifications: ['LPJK Grade A', 'Lean Manufacturing'],
          specialization: 'Industrial Construction'
        }
      },
      {
        id: 'DIR-SSR-002',
        employeeId: 'SSR-DIR-002',
        name: 'Ir. Ratna Sari, M.T.',
        position: 'Direktur Teknik',
        department: 'Direksi',
        email: 'ratna.sari@sahabatsinarraya.co.id',
        phone: '+62-267-8455002',
        joinDate: '2011-04-15',
        birthDate: '1978-12-20',
        address: 'Jl. Teknik SSR No. 20, Karawang',
        status: 'active',
        employmentType: 'permanent',
        salary: 47000000,
        skills: ['Warehouse Design', 'Structural Engineering', 'Technical Planning', 'Quality Assurance'],
        metadata: {
          education: 'S2 Teknik Sipil UNPAD',
          experience: '17 tahun warehouse construction',
          certifications: ['PII', 'BNSP', 'Green Building'],
          specialization: 'Industrial Building'
        }
      },
      {
        id: 'DIR-SSR-003',
        employeeId: 'SSR-DIR-003',
        name: 'Dra. Nina Kartika, M.M.',
        position: 'Direktur Operasional',
        department: 'Direksi',
        email: 'nina.kartika@sahabatsinarraya.co.id',
        phone: '+62-267-8455003',
        joinDate: '2012-06-20',
        birthDate: '1976-05-08',
        address: 'Jl. Operasional SSR No. 8, Karawang',
        status: 'active',
        employmentType: 'permanent',
        salary: 45000000,
        skills: ['Operations Management', 'Supply Chain', 'Business Development', 'Customer Relations'],
        metadata: {
          education: 'S2 Manajemen Operasi UNTAR',
          experience: '15 tahun manajemen operasi',
          certifications: ['PMP', 'CSCP', 'Lean Six Sigma'],
          specialization: 'Operations Management'
        }
      }
    ]
  },

  // NU006 - PT. PUTRA JAYA KONSTRUKASI (General - PT jadi 3 direksi juga)
  {
    subsidiaryId: 'NU006',
    employees: [
      {
        id: 'DIR-PJK-001',
        employeeId: 'PJK-DIR-001',
        name: 'Ir. Jaya Putra, M.T., Ph.D.',
        position: 'Direktur Utama',
        department: 'Direksi',
        email: 'jaya.putra@putrajayakonstruksi.co.id',
        phone: '+62-267-8456001',
        joinDate: '2000-01-01',
        birthDate: '1965-03-15',
        address: 'Jl. Putra Jaya No. 1, Karawang',
        status: 'active',
        employmentType: 'permanent',
        salary: 75000000,
        skills: ['Corporate Leadership', 'Strategic Planning', 'Large Scale Construction', 'Business Development'],
        metadata: {
          education: 'S3 Teknik Sipil ITB',
          experience: '30 tahun konstruksi',
          certifications: ['LPJK Grade A', 'PMP', 'Professional Engineer'],
          specialization: 'Construction Management'
        }
      },
      {
        id: 'DIR-PJK-002',
        employeeId: 'PJK-DIR-002',
        name: 'Dra. Siti Nurjanah, M.M., CFA',
        position: 'Direktur Keuangan',
        department: 'Direksi',
        email: 'siti.nurjanah@putrajayakonstruksi.co.id',
        phone: '+62-267-8456002',
        joinDate: '2002-03-15',
        birthDate: '1970-07-20',
        address: 'Jl. Keuangan PJK No. 20, Karawang',
        status: 'active',
        employmentType: 'permanent',
        salary: 65000000,
        skills: ['Corporate Finance', 'Investment Analysis', 'Financial Planning', 'Risk Management'],
        metadata: {
          education: 'S2 Manajemen Keuangan UI',
          experience: '25 tahun keuangan korporat',
          certifications: ['CFA', 'FRM', 'CA', 'CPA'],
          specialization: 'Corporate Finance'
        }
      },
      {
        id: 'DIR-PJK-003',
        employeeId: 'PJK-DIR-003',
        name: 'Ir. Budi Setiawan, M.T.',
        position: 'Direktur Operasional',
        department: 'Direksi',
        email: 'budi.setiawan@putrajayakonstruksi.co.id',
        phone: '+62-267-8456003',
        joinDate: '2001-06-10',
        birthDate: '1968-11-12',
        address: 'Jl. Operasional PJK No. 12, Karawang',
        status: 'active',
        employmentType: 'permanent',
        salary: 65000000,
        skills: ['Project Management', 'Operations Excellence', 'Strategic Execution', 'Team Leadership'],
        metadata: {
          education: 'S2 Teknik Sipil UGM',
          experience: '27 tahun project management',
          certifications: ['PMP', 'PRINCE2', 'LPJK Grade A'],
          specialization: 'Project Management'
        }
      }
    ]
  }
];

// Data Tenaga Ahli/Professional Staff (20+ orang)
const professionalStaffData = [
  // Project Managers
  {
    id: 'PM-001',
    employeeId: 'NUSANTARA-PM-001',
    name: 'Ir. Andi Prasetyo, M.T.',
    position: 'Senior Project Manager',
    department: 'Project Management',
    email: 'andi.prasetyo@nusantara.co.id',
    phone: '+62-811-2345-001',
    joinDate: '2015-01-15',
    birthDate: '1980-02-20',
    address: 'Jl. Project Manager No. 1, Karawang',
    status: 'active',
    employmentType: 'permanent',
    salary: 35000000,
    subsidiaryId: 'NU006', // PT. PUTRA JAYA KONSTRUKASI
    skills: ['Project Management', 'Construction Planning', 'Risk Management', 'Team Leadership'],
    metadata: {
      education: 'S2 Teknik Sipil ITB',
      experience: '15 tahun project management',
      certifications: ['PMP', 'PRINCE2', 'LPJK Grade B'],
      specialization: 'Construction Project Management'
    }
  },
  {
    id: 'PM-002',
    employeeId: 'NUSANTARA-PM-002',
    name: 'Sari Indrawati, S.T., M.M.',
    position: 'Project Manager',
    department: 'Project Management',
    email: 'sari.indrawati@nusantara.co.id',
    phone: '+62-811-2345-002',
    joinDate: '2017-03-20',
    birthDate: '1985-05-15',
    address: 'Jl. Project Manager No. 2, Karawang',
    status: 'active',
    employmentType: 'permanent',
    salary: 28000000,
    subsidiaryId: 'NU001', // CV. CAHAYA UTAMA EMPATBELAS
    skills: ['Project Coordination', 'Schedule Management', 'Quality Control', 'Client Relations'],
    metadata: {
      education: 'S2 Manajemen Konstruksi UNPAD',
      experience: '12 tahun project coordination',
      certifications: ['PMP', 'BNSP', 'CSMS'],
      specialization: 'Commercial Projects'
    }
  },
  {
    id: 'PM-003',
    employeeId: 'NUSANTARA-PM-003',
    name: 'Budi Hartono, S.T.',
    position: 'Project Manager',
    department: 'Project Management',
    email: 'budi.hartono@nusantara.co.id',
    phone: '+62-811-2345-003',
    joinDate: '2016-07-10',
    birthDate: '1982-08-25',
    address: 'Jl. Project Manager No. 3, Karawang',
    status: 'active',
    employmentType: 'permanent',
    salary: 30000000,
    subsidiaryId: 'NU004', // CV. GRAHA BANGUN NUSANTARA
    skills: ['Infrastructure Projects', 'Construction Management', 'Stakeholder Management', 'Cost Control'],
    metadata: {
      education: 'S1 Teknik Sipil UGM',
      experience: '13 tahun infrastruktur',
      certifications: ['PMP', 'LPJK Grade B'],
      specialization: 'Infrastructure Development'
    }
  },

  // Civil Engineers
  {
    id: 'CE-001',
    employeeId: 'NUSANTARA-CE-001',
    name: 'Ir. Rini Susanti, M.T.',
    position: 'Senior Civil Engineer',
    department: 'Engineering',
    email: 'rini.susanti@nusantara.co.id',
    phone: '+62-811-2345-004',
    joinDate: '2014-02-15',
    birthDate: '1978-12-10',
    address: 'Jl. Engineer No. 1, Karawang',
    status: 'active',
    employmentType: 'permanent',
    salary: 32000000,
    subsidiaryId: 'NU006', // PT. PUTRA JAYA KONSTRUKASI
    skills: ['Structural Design', 'Construction Analysis', 'Technical Drawing', 'Quality Assurance'],
    metadata: {
      education: 'S2 Teknik Sipil ITB',
      experience: '17 tahun structural engineering',
      certifications: ['PII', 'LPJK Grade B', 'Professional Engineer'],
      specialization: 'Structural Engineering'
    }
  },
  {
    id: 'CE-002',
    employeeId: 'NUSANTARA-CE-002',
    name: 'Agus Setiawan, S.T.',
    position: 'Civil Engineer',
    department: 'Engineering',
    email: 'agus.setiawan@nusantara.co.id',
    phone: '+62-811-2345-005',
    joinDate: '2018-04-20',
    birthDate: '1988-03-18',
    address: 'Jl. Engineer No. 2, Karawang',
    status: 'active',
    employmentType: 'permanent',
    salary: 25000000,
    subsidiaryId: 'NU002', // CV. BINTANG SURAYA
    skills: ['Residential Design', 'Foundation Engineering', 'Site Planning', 'Construction Documentation'],
    metadata: {
      education: 'S1 Teknik Sipil UNPAR',
      experience: '9 tahun residential construction',
      certifications: ['PII', 'BNSP'],
      specialization: 'Residential Engineering'
    }
  },
  {
    id: 'CE-003',
    employeeId: 'NUSANTARA-CE-003',
    name: 'Maya Kartika, S.T., M.T.',
    position: 'Civil Engineer',
    department: 'Engineering',
    email: 'maya.kartika@nusantara.co.id',
    phone: '+62-811-2345-006',
    joinDate: '2019-01-10',
    birthDate: '1990-06-22',
    address: 'Jl. Engineer No. 3, Karawang',
    status: 'active',
    employmentType: 'permanent',
    salary: 27000000,
    subsidiaryId: 'NU004', // CV. GRAHA BANGUN NUSANTARA
    skills: ['Highway Design', 'Bridge Engineering', 'Drainage Systems', 'Traffic Engineering'],
    metadata: {
      education: 'S2 Teknik Sipil ITS',
      experience: '8 tahun infrastructure engineering',
      certifications: ['PII', 'LPJK Grade C'],
      specialization: 'Infrastructure Engineering'
    }
  },

  // Architects
  {
    id: 'AR-001',
    employeeId: 'NUSANTARA-AR-001',
    name: 'Ir. Lisa Permata, M.Ars.',
    position: 'Senior Architect',
    department: 'Design',
    email: 'lisa.permata@nusantara.co.id',
    phone: '+62-811-2345-007',
    joinDate: '2013-05-15',
    birthDate: '1976-09-14',
    address: 'Jl. Architect No. 1, Karawang',
    status: 'active',
    employmentType: 'permanent',
    salary: 34000000,
    subsidiaryId: 'NU001', // CV. CAHAYA UTAMA EMPATBELAS
    skills: ['Architectural Design', 'Commercial Buildings', 'Project Visualization', 'Building Codes'],
    metadata: {
      education: 'S2 Arsitektur ITB',
      experience: '19 tahun architectural design',
      certifications: ['IAI', 'LPJK Grade B', 'Green Building'],
      specialization: 'Commercial Architecture'
    }
  },
  {
    id: 'AR-002',
    employeeId: 'NUSANTARA-AR-002',
    name: 'Deni Kurniawan, S.Ars.',
    position: 'Architect',
    department: 'Design',
    email: 'deni.kurniawan@nusantara.co.id',
    phone: '+62-811-2345-008',
    joinDate: '2020-02-20',
    birthDate: '1992-11-30',
    address: 'Jl. Architect No. 2, Karawang',
    status: 'active',
    employmentType: 'permanent',
    salary: 22000000,
    subsidiaryId: 'NU002', // CV. BINTANG SURAYA
    skills: ['Residential Design', 'Site Planning', 'Interior Layout', 'Building Permit'],
    metadata: {
      education: 'S1 Arsitektur UNPAR',
      experience: '6 tahun residential architecture',
      certifications: ['IAI', 'BNSP'],
      specialization: 'Residential Architecture'
    }
  },

  // Interior Designers
  {
    id: 'ID-001',
    employeeId: 'NUSANTARA-ID-001',
    name: 'Ratna Dewi, S.Sn., M.Des.',
    position: 'Senior Interior Designer',
    department: 'Design',
    email: 'ratna.dewi@nusantara.co.id',
    phone: '+62-811-2345-009',
    joinDate: '2016-08-15',
    birthDate: '1985-04-12',
    address: 'Jl. Interior No. 1, Karawang',
    status: 'active',
    employmentType: 'permanent',
    salary: 28000000,
    subsidiaryId: 'NU003', // CV. LATANSA
    skills: ['Interior Design', 'Space Planning', 'Color Theory', 'Furniture Selection'],
    metadata: {
      education: 'S2 Desain Interior ITB',
      experience: '11 tahun interior design',
      certifications: ['BNSP Interior Designer', 'HDII'],
      specialization: 'Commercial Interior'
    }
  },
  {
    id: 'ID-002',
    employeeId: 'NUSANTARA-ID-002',
    name: 'Sari Utami, S.Sn.',
    position: 'Interior Designer',
    department: 'Design',
    email: 'sari.utami@nusantara.co.id',
    phone: '+62-811-2345-010',
    joinDate: '2019-03-10',
    birthDate: '1991-01-25',
    address: 'Jl. Interior No. 2, Karawang',
    status: 'active',
    employmentType: 'permanent',
    salary: 20000000,
    subsidiaryId: 'NU003', // CV. LATANSA
    skills: ['Renovation Design', 'Material Selection', '3D Visualization', 'Client Consultation'],
    metadata: {
      education: 'S1 Desain Interior UNTAR',
      experience: '6 tahun renovation design',
      certifications: ['BNSP', 'AutoCAD'],
      specialization: 'Renovation & Refurbishment'
    }
  },

  // Quantity Surveyors
  {
    id: 'QS-001',
    employeeId: 'NUSANTARA-QS-001',
    name: 'Ir. Hendra Wijaya, M.T.',
    position: 'Senior Quantity Surveyor',
    department: 'Cost Engineering',
    email: 'hendra.wijaya@nusantara.co.id',
    phone: '+62-811-2345-011',
    joinDate: '2012-06-15',
    birthDate: '1977-07-20',
    address: 'Jl. Quantity Surveyor No. 1, Karawang',
    status: 'active',
    employmentType: 'permanent',
    salary: 33000000,
    subsidiaryId: 'NU006', // PT. PUTRA JAYA KONSTRUKASI
    skills: ['Cost Estimation', 'Contract Management', 'Value Engineering', 'Risk Analysis'],
    metadata: {
      education: 'S2 Teknik Sipil UNPAD',
      experience: '18 tahun quantity surveying',
      certifications: ['RICS', 'LPJK Grade B', 'PQS'],
      specialization: 'Cost Management'
    }
  },
  {
    id: 'QS-002',
    employeeId: 'NUSANTARA-QS-002',
    name: 'Nina Sari, S.T.',
    position: 'Quantity Surveyor',
    department: 'Cost Engineering',
    email: 'nina.sari@nusantara.co.id',
    phone: '+62-811-2345-012',
    joinDate: '2018-09-20',
    birthDate: '1987-12-05',
    address: 'Jl. Quantity Surveyor No. 2, Karawang',
    status: 'active',
    employmentType: 'permanent',
    salary: 24000000,
    subsidiaryId: 'NU001', // CV. CAHAYA UTAMA EMPATBELAS
    skills: ['Bill of Quantities', 'Cost Control', 'Material Take-off', 'Contract Administration'],
    metadata: {
      education: 'S1 Teknik Sipil UGM',
      experience: '9 tahun cost engineering',
      certifications: ['RICS Associate', 'BNSP'],
      specialization: 'Commercial Cost Control'
    }
  },

  // Safety Officers
  {
    id: 'SO-001',
    employeeId: 'NUSANTARA-SO-001',
    name: 'Ir. Bambang Safety, M.K3.',
    position: 'Senior Safety Officer',
    department: 'HSE',
    email: 'bambang.safety@nusantara.co.id',
    phone: '+62-811-2345-013',
    joinDate: '2011-04-10',
    birthDate: '1975-10-15',
    address: 'Jl. Safety No. 1, Karawang',
    status: 'active',
    employmentType: 'permanent',
    salary: 29000000,
    subsidiaryId: 'NU006', // PT. PUTRA JAYA KONSTRUKASI
    skills: ['Safety Management', 'Risk Assessment', 'Incident Investigation', 'Safety Training'],
    metadata: {
      education: 'S2 Keselamatan Kerja UI',
      experience: '20 tahun HSE',
      certifications: ['NEBOSH', 'IOSH', 'Ahli K3 Konstruksi'],
      specialization: 'Construction Safety'
    }
  },
  {
    id: 'SO-002',
    employeeId: 'NUSANTARA-SO-002',
    name: 'Rina Kartika, S.T., M.K3.',
    position: 'Safety Officer',
    department: 'HSE',
    email: 'rina.kartika@nusantara.co.id',
    phone: '+62-811-2345-014',
    joinDate: '2017-11-15',
    birthDate: '1986-08-28',
    address: 'Jl. Safety No. 2, Karawang',
    status: 'active',
    employmentType: 'permanent',
    salary: 22000000,
    subsidiaryId: 'NU004', // CV. GRAHA BANGUN NUSANTARA
    skills: ['Safety Inspection', 'Emergency Response', 'Safety Documentation', 'Training Coordination'],
    metadata: {
      education: 'S2 Keselamatan Kerja UNPAD',
      experience: '8 tahun safety management',
      certifications: ['IOSH', 'Ahli K3 Konstruksi', 'First Aid'],
      specialization: 'Infrastructure Safety'
    }
  },

  // Site Supervisors
  {
    id: 'SS-001',
    employeeId: 'NUSANTARA-SS-001',
    name: 'Joko Priyanto, S.T.',
    position: 'Senior Site Supervisor',
    department: 'Construction',
    email: 'joko.priyanto@nusantara.co.id',
    phone: '+62-811-2345-015',
    joinDate: '2014-08-20',
    birthDate: '1980-03-12',
    address: 'Jl. Site Supervisor No. 1, Karawang',
    status: 'active',
    employmentType: 'permanent',
    salary: 26000000,
    subsidiaryId: 'NU002', // CV. BINTANG SURAYA
    skills: ['Site Management', 'Construction Supervision', 'Quality Control', 'Worker Coordination'],
    metadata: {
      education: 'S1 Teknik Sipil UNPAR',
      experience: '15 tahun site supervision',
      certifications: ['LPJK Grade C', 'BNSP', 'Site Management'],
      specialization: 'Residential Construction'
    }
  },
  {
    id: 'SS-002',
    employeeId: 'NUSANTARA-SS-002',
    name: 'Andi Kurniawan, S.T.',
    position: 'Site Supervisor',
    department: 'Construction',
    email: 'andi.kurniawan@nusantara.co.id',
    phone: '+62-811-2345-016',
    joinDate: '2019-05-15',
    birthDate: '1989-07-18',
    address: 'Jl. Site Supervisor No. 2, Karawang',
    status: 'active',
    employmentType: 'permanent',
    salary: 21000000,
    subsidiaryId: 'NU005', // CV. SAHABAT SINAR RAYA
    skills: ['Industrial Construction', 'Equipment Coordination', 'Progress Monitoring', 'Team Leadership'],
    metadata: {
      education: 'S1 Teknik Sipil UGM',
      experience: '7 tahun industrial construction',
      certifications: ['BNSP', 'Industrial Safety'],
      specialization: 'Industrial Building'
    }
  },

  // Construction Foremen
  {
    id: 'CF-001',
    employeeId: 'NUSANTARA-CF-001',
    name: 'Susanto Wijaya',
    position: 'Senior Construction Foreman',
    department: 'Construction',
    email: 'susanto.wijaya@nusantara.co.id',
    phone: '+62-811-2345-017',
    joinDate: '2010-03-15',
    birthDate: '1972-05-20',
    address: 'Jl. Foreman No. 1, Karawang',
    status: 'active',
    employmentType: 'permanent',
    salary: 18000000,
    subsidiaryId: 'NU006', // PT. PUTRA JAYA KONSTRUKASI
    skills: ['Construction Execution', 'Worker Management', 'Quality Control', 'Schedule Coordination'],
    metadata: {
      education: 'STM Bangunan',
      experience: '25 tahun construction field',
      certifications: ['BNSP Konstruksi', 'Safety Awareness'],
      specialization: 'General Construction'
    }
  },
  {
    id: 'CF-002',
    employeeId: 'NUSANTARA-CF-002',
    name: 'Budi Santoso',
    position: 'Construction Foreman',
    department: 'Construction',
    email: 'budi.santoso.cf@nusantara.co.id',
    phone: '+62-811-2345-018',
    joinDate: '2015-07-10',
    birthDate: '1978-11-25',
    address: 'Jl. Foreman No. 2, Karawang',
    status: 'active',
    employmentType: 'permanent',
    salary: 15000000,
    subsidiaryId: 'NU001', // CV. CAHAYA UTAMA EMPATBELAS
    skills: ['Commercial Construction', 'Material Management', 'Quality Assurance', 'Team Coordination'],
    metadata: {
      education: 'SMK Bangunan',
      experience: '12 tahun commercial construction',
      certifications: ['BNSP', 'Safety Training'],
      specialization: 'Commercial Building'
    }
  },

  // Mechanical Engineers
  {
    id: 'ME-001',
    employeeId: 'NUSANTARA-ME-001',
    name: 'Ir. Dedi Hermawan, M.T.',
    position: 'Senior Mechanical Engineer',
    department: 'MEP Engineering',
    email: 'dedi.hermawan@nusantara.co.id',
    phone: '+62-811-2345-019',
    joinDate: '2013-09-15',
    birthDate: '1979-04-10',
    address: 'Jl. Mechanical No. 1, Karawang',
    status: 'active',
    employmentType: 'permanent',
    salary: 31000000,
    subsidiaryId: 'NU005', // CV. SAHABAT SINAR RAYA
    skills: ['HVAC Design', 'Mechanical Systems', 'Energy Efficiency', 'System Integration'],
    metadata: {
      education: 'S2 Teknik Mesin ITB',
      experience: '16 tahun mechanical engineering',
      certifications: ['PII Mesin', 'ASHRAE', 'Energy Auditor'],
      specialization: 'Industrial HVAC'
    }
  },

  // Electrical Engineers
  {
    id: 'EE-001',
    employeeId: 'NUSANTARA-EE-001',
    name: 'Ir. Sinta Elektriko, M.T.',
    position: 'Senior Electrical Engineer',
    department: 'MEP Engineering',
    email: 'sinta.elektriko@nusantara.co.id',
    phone: '+62-811-2345-020',
    joinDate: '2014-11-20',
    birthDate: '1981-06-15',
    address: 'Jl. Electrical No. 1, Karawang',
    status: 'active',
    employmentType: 'permanent',
    salary: 30000000,
    subsidiaryId: 'NU001', // CV. CAHAYA UTAMA EMPATBELAS
    skills: ['Electrical Design', 'Power Systems', 'Lighting Design', 'Building Automation'],
    metadata: {
      education: 'S2 Teknik Elektro ITS',
      experience: '14 tahun electrical engineering',
      certifications: ['PII Elektro', 'Green Building', 'Smart Building'],
      specialization: 'Commercial Electrical'
    }
  },

  // Administrative Staff
  {
    id: 'AD-001',
    employeeId: 'NUSANTARA-AD-001',
    name: 'Sri Wahyuni, S.E.',
    position: 'HR Manager',
    department: 'Human Resources',
    email: 'sri.wahyuni@nusantara.co.id',
    phone: '+62-811-2345-021',
    joinDate: '2016-01-15',
    birthDate: '1983-09-20',
    address: 'Jl. HR No. 1, Karawang',
    status: 'active',
    employmentType: 'permanent',
    salary: 25000000,
    subsidiaryId: 'NU006', // PT. PUTRA JAYA KONSTRUKASI
    skills: ['Human Resources', 'Recruitment', 'Training & Development', 'Employee Relations'],
    metadata: {
      education: 'S1 Ekonomi Manajemen UNPAD',
      experience: '11 tahun HR management',
      certifications: ['CHRP', 'BNSP HR', 'Leadership'],
      specialization: 'HR Management'
    }
  },

  // IT Support
  {
    id: 'IT-001',
    employeeId: 'NUSANTARA-IT-001',
    name: 'Rizki Teknologi, S.Kom.',
    position: 'IT Manager',
    department: 'Information Technology',
    email: 'rizki.teknologi@nusantara.co.id',
    phone: '+62-811-2345-022',
    joinDate: '2018-02-10',
    birthDate: '1990-12-08',
    address: 'Jl. IT No. 1, Karawang',
    status: 'active',
    employmentType: 'permanent',
    salary: 27000000,
    subsidiaryId: 'NU006', // PT. PUTRA JAYA KONSTRUKASI
    skills: ['IT Management', 'Database Administration', 'Network Security', 'Software Development'],
    metadata: {
      education: 'S1 Teknik Informatika ITB',
      experience: '8 tahun IT management',
      certifications: ['CISSP', 'PMP', 'Microsoft Certified'],
      specialization: 'IT Infrastructure'
    }
  }
];

// Function to seed directors
async function seedDirectors() {
  console.log('🏢 Seeding Directors...');
  const createdDirectors = [];
  
  for (const subsidiary of directorsData) {
    console.log(`\n📋 Processing ${subsidiary.subsidiaryId} directors...`);
    
    for (const employee of subsidiary.employees) {
      try {
        // Add subsidiaryId to employee data
        const employeeData = {
          ...employee,
          subsidiaryId: subsidiary.subsidiaryId
        };
        
        const created = await Manpower.create(employeeData);
        createdDirectors.push(created);
        console.log(`✅ Created Director: ${employee.name} - ${employee.position} (${subsidiary.subsidiaryId})`);
      } catch (error) {
        console.error(`❌ Failed to create ${employee.name}:`, error.message);
      }
    }
  }
  
  return createdDirectors;
}

// Function to seed professional staff
async function seedProfessionalStaff() {
  console.log('\n👨‍💼 Seeding Professional Staff...');
  const createdStaff = [];
  
  for (const employee of professionalStaffData) {
    try {
      const created = await Manpower.create(employee);
      createdStaff.push(created);
      console.log(`✅ Created Staff: ${employee.name} - ${employee.position} (${employee.subsidiaryId})`);
    } catch (error) {
      console.error(`❌ Failed to create ${employee.name}:`, error.message);
    }
  }
  
  return createdStaff;
}

// Main seeder function
async function seedComprehensiveManpower() {
  try {
    console.log('🌱 Starting COMPREHENSIVE MANPOWER seeding for NUSANTARA GROUP...');
    
    // Clear existing manpower data
    console.log('🗑️  Clearing existing manpower data...');
    const deletedCount = await Manpower.destroy({
      where: {},
      force: true // Hard delete
    });
    console.log(`✅ Cleared ${deletedCount} existing manpower records`);
    
    // Verify subsidiaries exist
    const subsidiaries = await Subsidiary.findAll({
      attributes: ['id', 'name', 'code']
    });
    
    if (subsidiaries.length === 0) {
      throw new Error('No subsidiaries found! Please seed subsidiaries first.');
    }
    
    console.log(`📊 Found ${subsidiaries.length} subsidiaries:`);
    subsidiaries.forEach(sub => {
      console.log(`   - ${sub.id}: ${sub.name} (${sub.code})`);
    });
    
    // Seed directors
    const createdDirectors = await seedDirectors();
    
    // Seed professional staff
    const createdStaff = await seedProfessionalStaff();
    
    const totalCreated = createdDirectors.length + createdStaff.length;
    
    console.log('\n🎉 MANPOWER SEEDING COMPLETED!');
    console.log(`📊 Total manpower created: ${totalCreated}`);
    console.log(`👔 Directors: ${createdDirectors.length} (${directorsData.length * 3} expected)`);
    console.log(`👨‍💼 Professional Staff: ${createdStaff.length}`);
    
    console.log('\n📋 DIRECTOR SUMMARY BY SUBSIDIARY:');
    for (const subsidiary of directorsData) {
      const subInfo = subsidiaries.find(s => s.id === subsidiary.subsidiaryId);
      console.log(`\n${subInfo.name} (${subInfo.code}):`);
      subsidiary.employees.forEach((emp, index) => {
        console.log(`  ${index + 1}. ${emp.name} - ${emp.position}`);
      });
    }
    
    console.log('\n📋 PROFESSIONAL STAFF SUMMARY:');
    const staffByDept = professionalStaffData.reduce((acc, emp) => {
      if (!acc[emp.department]) acc[emp.department] = [];
      acc[emp.department].push(emp);
      return acc;
    }, {});
    
    Object.keys(staffByDept).forEach(dept => {
      console.log(`\n${dept}:`);
      staffByDept[dept].forEach((emp, index) => {
        const subInfo = subsidiaries.find(s => s.id === emp.subsidiaryId);
        console.log(`  ${index + 1}. ${emp.name} - ${emp.position} (${subInfo.code})`);
      });
    });
    
    console.log('\n✅ All NUSANTARA GROUP manpower has been successfully added to the database!');
    
    return {
      success: true,
      totalCreated: totalCreated,
      directors: createdDirectors.length,
      staff: createdStaff.length,
      data: {
        directors: createdDirectors,
        staff: createdStaff
      }
    };
    
  } catch (error) {
    console.error('❌ Error during manpower seeding:', error);
    throw error;
  }
}

// Export functions
module.exports = {
  seedComprehensiveManpower,
  seedDirectors,
  seedProfessionalStaff,
  directorsData,
  professionalStaffData
};

// Run seeder if called directly
if (require.main === module) {
  seedComprehensiveManpower()
    .then(result => {
      console.log('✅ Seeding completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}
