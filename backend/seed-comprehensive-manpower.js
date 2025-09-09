const { models } = require('./models');
const { Manpower } = models;

/**
 * Comprehensive Manpower/SDM Seeder untuk NUSANTARA GROUP
 * Berisi 25+ tenaga ahli profesional dengan spesialisasi sesuai industri konstruksi
 * Setiap tenaga kerja memiliki assignment yang sesuai dengan keahlian dan subsidiary
 */

const manpowerData = [
  // ==================== MANAGEMENT LEVEL ====================
  {
    id: 'EMP001',
    employee_id: 'MGT-2024-001',
    name: 'Ir. Ahmad Rahman, M.T., PMP',
    position: 'General Manager',
    department: 'Management',
    email: 'ahmad.rahman@nusantaragroup.co.id',
    phone: '+62-812-1111-0001',
    join_date: '2020-01-15',
    birth_date: '1978-03-20',
    address: 'Jl. Permata Hijau No. 15, Jakarta Selatan',
    status: 'active',
    employment_type: 'permanent',
    salary: 35000000,
    current_project: 'PRJ-2025-001',
    skills: JSON.stringify([
      { name: 'Strategic Planning', level: 'expert' },
      { name: 'Project Management', level: 'expert' },
      { name: 'Leadership', level: 'expert' },
      { name: 'Business Development', level: 'advanced' }
    ]),
    metadata: JSON.stringify({
      certifications: ['PMP', 'Strategic_Management', 'ISO_9001_Lead_Auditor'],
      performance_rating: 4.8,
      notes: 'Pemimpin berpengalaman dengan track record excellent dalam mengelola multiple projects'
    }),
    created_at: new Date(),
    updated_at: new Date()
  },

  {
    id: 'EMP002',
    employee_id: 'MGT-2024-002',
    name: 'Dra. Sari Indira, M.M.',
    position: 'HR Manager',
    department: 'Human Resources',
    email: 'sari.indira@nusantaragroup.co.id',
    phone: '+62-813-2222-0002',
    join_date: '2021-06-20',
    birth_date: '1980-08-15',
    address: 'Jl. Cipete Raya No. 88, Jakarta Selatan',
    status: 'active',
    employment_type: 'permanent',
    salary: 18500000,
    current_project: 'HR-DEVELOPMENT-2025',
    skills: JSON.stringify([
      { name: 'Human Resource Management', level: 'expert' },
      { name: 'Recruitment & Selection', level: 'expert' },
      { name: 'Performance Management', level: 'advanced' },
      { name: 'Training & Development', level: 'advanced' }
    ]),
    metadata: JSON.stringify({
      certifications: ['CHRP', 'Training_Specialist', 'Labor_Law', 'Psychotest'],
      performance_rating: 4.6,
      notes: 'HR professional dengan expertise dalam talent management dan employee engagement'
    }),
    created_at: new Date(),
    updated_at: new Date()
  },

  // ==================== PROJECT MANAGEMENT ====================
  {
    id: 'EMP003',
    employee_id: 'PM-2024-001',
    name: 'Ir. Budi Setiawan, M.T.',
    position: 'Senior Project Manager',
    department: 'Project Management',
    email: 'budi.setiawan@nusantaragroup.co.id',
    phone: '+62-814-3333-0003',
    join_date: '2019-03-10',
    birth_date: '1975-11-28',
    address: 'Jl. Kemang Raya No. 45, Jakarta Selatan',
    status: 'active',
    employment_type: 'permanent',
    salary: 28000000,
    current_project: 'PRJ-2025-001',
    skills: JSON.stringify([
      { name: 'Project Planning & Control', level: 'expert' },
      { name: 'Construction Management', level: 'expert' },
      { name: 'Quality Management', level: 'advanced' },
      { name: 'Risk Management', level: 'advanced' }
    ]),
    metadata: JSON.stringify({
      certifications: ['PMP', 'Construction_Management', 'PRINCE2', 'Risk_Management'],
      performance_rating: 4.7,
      notes: 'Project manager berpengalaman dengan track record sukses mengelola proyek senilai > 50M'
    }),
    created_at: new Date(),
    updated_at: new Date()
  },

  {
    id: 'EMP004',
    employee_id: 'PM-2024-002',
    name: 'Ir. Maya Sari, M.T.',
    position: 'Project Manager',
    department: 'Project Management',
    email: 'maya.sari@nusantaragroup.co.id',
    phone: '+62-815-4444-0004',
    join_date: '2020-09-15',
    birth_date: '1982-05-12',
    address: 'Jl. Radio Dalam No. 22, Jakarta Selatan',
    status: 'active',
    employment_type: 'permanent',
    salary: 22000000,
    current_project: 'PRJ-2025-002',
    skills: JSON.stringify([
      { name: 'Project Coordination', level: 'advanced' },
      { name: 'Schedule Management', level: 'advanced' },
      { name: 'Stakeholder Management', level: 'advanced' },
      { name: 'Contract Administration', level: 'intermediate' }
    ]),
    metadata: JSON.stringify({
      certifications: ['CAPM', 'MS_Project', 'Contract_Management'],
      performance_rating: 4.4,
      notes: 'Project manager handal dengan spesialisasi residential dan commercial projects'
    }),
    created_at: new Date(),
    updated_at: new Date()
  },

  // ==================== ENGINEERING ====================
  {
    id: 'EMP005',
    employee_id: 'ENG-2024-001',
    name: 'Dr. Ir. Joko Susilo, M.T.',
    position: 'Chief Engineer',
    department: 'Engineering',
    email: 'joko.susilo@nusantaragroup.co.id',
    phone: '+62-816-5555-0005',
    join_date: '2018-01-20',
    birth_date: '1970-09-08',
    address: 'Jl. Prapatan Raya No. 67, Jakarta Pusat',
    status: 'active',
    employment_type: 'permanent',
    salary: 32000000,
    current_project: 'PRJ-2025-001',
    skills: JSON.stringify([
      { name: 'Structural Engineering', level: 'expert' },
      { name: 'Structural Analysis & Design', level: 'expert' },
      { name: 'Building Code Compliance', level: 'expert' },
      { name: 'CAD/BIM Software', level: 'advanced' }
    ]),
    metadata: JSON.stringify({
      certifications: ['Professional_Engineer', 'ETABS_Expert', 'SAP2000', 'Building_Code'],
      performance_rating: 4.9,
      notes: 'Senior engineer dengan expertise dalam high-rise building dan infrastructure design'
    }),
    created_at: new Date(),
    updated_at: new Date()
  },

  {
    id: 'EMP006',
    employee_id: 'ENG-2024-002',
    name: 'Ir. Linda Kartika, M.T.',
    position: 'Senior Civil Engineer',
    department: 'Engineering',
    email: 'linda.kartika@nusantaragroup.co.id',
    phone: '+62-817-6666-0006',
    join_date: '2020-07-12',
    birth_date: '1983-12-03',
    address: 'Jl. Tebet Raya No. 33, Jakarta Selatan',
    status: 'active',
    employment_type: 'permanent',
    salary: 19500000,
    current_project: 'PRJ-2025-003',
    skills: JSON.stringify([
      { name: 'Civil Engineering Design', level: 'advanced' },
      { name: 'Road & Bridge Design', level: 'advanced' },
      { name: 'Drainage Systems', level: 'advanced' },
      { name: 'AutoCAD', level: 'expert' }
    ]),
    metadata: JSON.stringify({
      certifications: ['SKA_Civil', 'Road_Design', 'Bridge_Engineering', 'AutoCAD_Professional'],
      performance_rating: 4.5,
      notes: 'Civil engineer dengan spesialisasi infrastruktur jalan dan sistem drainase'
    }),
    created_at: new Date(),
    updated_at: new Date()
  },

  {
    id: 'EMP007',
    employee_id: 'ENG-2024-003',
    name: 'Ir. Andi Prasetyo, M.T.',
    position: 'Electrical Engineer',
    department: 'Engineering',
    email: 'andi.prasetyo@nusantaragroup.co.id',
    phone: '+62-818-7777-0007',
    join_date: '2021-02-08',
    birth_date: '1985-04-17',
    address: 'Jl. Warung Buncit No. 55, Jakarta Selatan',
    status: 'active',
    employment_type: 'permanent',
    salary: 17500000,
    current_project: 'PRJ-2025-002',
    skills: JSON.stringify([
      { name: 'Electrical Systems Design', level: 'advanced' },
      { name: 'Power Distribution', level: 'advanced' },
      { name: 'Building Automation', level: 'intermediate' },
      { name: 'Electrical Safety', level: 'advanced' }
    ]),
    metadata: JSON.stringify({
      certifications: ['SKA_Electrical', 'PJK3_Electrical', 'Building_Automation', 'Safety_Inspector'],
      performance_rating: 4.3,
      notes: 'Electrical engineer dengan expertise dalam building electrical systems dan automation'
    }),
    created_at: new Date(),
    updated_at: new Date()
  },

  {
    id: 'EMP008',
    employee_id: 'ENG-2024-004',
    name: 'Ir. Bambang Hartono, M.T.',
    position: 'Mechanical Engineer',
    department: 'Engineering',
    email: 'bambang.hartono@nusantaragroup.co.id',
    phone: '+62-819-8888-0008',
    join_date: '2019-11-15',
    birth_date: '1981-07-22',
    address: 'Jl. Pasar Minggu No. 44, Jakarta Selatan',
    status: 'active',
    employment_type: 'permanent',
    salary: 18000000,
    current_project: 'PRJ-2025-004',
    skills: JSON.stringify([
      { name: 'HVAC Systems Design', level: 'advanced' },
      { name: 'Plumbing Systems', level: 'advanced' },
      { name: 'Fire Protection Systems', level: 'intermediate' },
      { name: 'Energy Efficiency', level: 'advanced' }
    ]),
    metadata: JSON.stringify({
      certifications: ['HVAC_Professional', 'Plumbing_Systems', 'Fire_Protection', 'Energy_Audit'],
      performance_rating: 4.4,
      notes: 'Mechanical engineer dengan spesialisasi HVAC dan building mechanical systems'
    }),
    created_at: new Date(),
    updated_at: new Date()
  },

  // ==================== QUANTITY SURVEYING & ESTIMATION ====================
  {
    id: 'EMP009',
    employee_id: 'QS-2024-001',
    name: 'Ir. Dewi Sartika, M.T.',
    position: 'Senior Quantity Surveyor',
    department: 'Quantity Surveying',
    email: 'dewi.sartika@nusantaragroup.co.id',
    phone: '+62-820-9999-0009',
    join_date: '2020-04-10',
    birth_date: '1979-10-14',
    address: 'Jl. Fatmawati No. 77, Jakarta Selatan',
    status: 'active',
    employment_type: 'permanent',
    salary: 16500000,
    current_project: 'PRJ-2025-001',
    skills: JSON.stringify([
      { name: 'Quantity Surveying', level: 'expert' },
      { name: 'Cost Estimation', level: 'expert' },
      { name: 'Contract Management', level: 'advanced' },
      { name: 'Value Engineering', level: 'advanced' }
    ]),
    metadata: JSON.stringify({
      certifications: ['RICS', 'QS_Professional', 'Contract_Administration', 'Cost_Management'],
      performance_rating: 4.6,
      notes: 'Quantity surveyor berpengalaman dengan track record akurasi estimasi > 95%'
    }),
    created_at: new Date(),
    updated_at: new Date()
  },

  {
    id: 'EMP010',
    employee_id: 'QS-2024-002',
    name: 'Rini Handayani, S.T., M.M.',
    position: 'Cost Estimator',
    department: 'Quantity Surveying',
    email: 'rini.handayani@nusantaragroup.co.id',
    phone: '+62-821-0000-0010',
    join_date: '2021-08-25',
    birth_date: '1986-01-30',
    address: 'Jl. Kalibata Raya No. 21, Jakarta Selatan',
    status: 'active',
    employment_type: 'permanent',
    salary: 13500000,
    current_project: 'PRJ-2025-002',
    skills: JSON.stringify([
      { name: 'Cost Analysis', level: 'advanced' },
      { name: 'Budget Planning', level: 'advanced' },
      { name: 'Material Procurement', level: 'intermediate' },
      { name: 'Cost Control', level: 'advanced' }
    ]),
    metadata: JSON.stringify({
      certifications: ['Cost_Estimating', 'Budget_Planning', 'Procurement'],
      performance_rating: 4.2,
      notes: 'Cost estimator yang detail dan akurat dalam analisis biaya konstruksi'
    }),
    created_at: new Date(),
    updated_at: new Date()
  },

  // ==================== SAFETY & QUALITY ====================
  {
    id: 'EMP011',
    employee_id: 'SF-2024-001',
    name: 'Ir. Hendra Gunawan, M.K3.',
    position: 'Safety Manager',
    department: 'Safety & Quality',
    email: 'hendra.gunawan@nusantaragroup.co.id',
    phone: '+62-822-1111-0011',
    join_date: '2019-05-20',
    birth_date: '1977-06-25',
    address: 'Jl. Pancoran Barat No. 99, Jakarta Selatan',
    status: 'active',
    employment_type: 'permanent',
    salary: 20000000,
    current_project: 'ALL-PROJECTS',
    skills: JSON.stringify([
      { name: 'Safety Management Systems', level: 'expert' },
      { name: 'Risk Assessment', level: 'expert' },
      { name: 'Emergency Response', level: 'expert' },
      { name: 'Safety Training', level: 'advanced' }
    ]),
    metadata: JSON.stringify({
      certifications: ['NEBOSH', 'K3_Construction', 'First_Aid', 'Fire_Safety', 'ISO_45001'],
      performance_rating: 4.8,
      notes: 'Safety manager dengan zero accident record dan expertise dalam SMK3 konstruksi'
    }),
    created_at: new Date(),
    updated_at: new Date()
  },

  {
    id: 'EMP012',
    employee_id: 'QC-2024-001',
    name: 'Ir. Siti Nurjanah, M.T.',
    position: 'Quality Control Manager',
    department: 'Quality Control',
    email: 'siti.nurjanah@nusantaragroup.co.id',
    phone: '+62-823-2222-0012',
    join_date: '2020-10-12',
    birth_date: '1980-09-18',
    address: 'Jl. Mampang Prapatan No. 56, Jakarta Selatan',
    status: 'active',
    employment_type: 'permanent',
    salary: 18500000,
    current_project: 'QC-ALL-PROJECTS',
    skills: JSON.stringify([
      { name: 'Quality Control Systems', level: 'expert' },
      { name: 'Testing & Inspection', level: 'expert' },
      { name: 'Quality Assurance', level: 'advanced' },
      { name: 'Material Testing', level: 'advanced' }
    ]),
    metadata: JSON.stringify({
      certifications: ['ISO_9001_Lead_Auditor', 'Quality_Inspector', 'Material_Testing', 'Construction_QC'],
      performance_rating: 4.5,
      notes: 'QC manager dengan expertise dalam sistem manajemen mutu dan material testing'
    }),
    created_at: new Date(),
    updated_at: new Date()
  },

  // ==================== SITE OPERATIONS ====================
  {
    id: 'EMP013',
    employee_id: 'SM-2024-001',
    name: 'Ir. Agus Wijaya, M.T.',
    position: 'Site Manager',
    department: 'Site Operations',
    email: 'agus.wijaya@nusantaragroup.co.id',
    phone: '+62-824-3333-0013',
    join_date: '2018-12-01',
    birth_date: '1976-04-11',
    address: 'Jl. Cawang Baru No. 18, Jakarta Timur',
    status: 'active',
    employment_type: 'permanent',
    salary: 25000000,
    current_project: 'PRJ-2025-001',
    skills: JSON.stringify([
      { name: 'Site Management', level: 'expert' },
      { name: 'Construction Supervision', level: 'expert' },
      { name: 'Team Leadership', level: 'advanced' },
      { name: 'Problem Solving', level: 'advanced' }
    ]),
    metadata: JSON.stringify({
      certifications: ['Site_Management', 'Construction_Supervision', 'Leadership', 'Safety_Officer'],
      performance_rating: 4.7,
      notes: 'Site manager berpengalaman dengan track record menyelesaikan proyek tepat waktu'
    }),
    created_at: new Date(),
    updated_at: new Date()
  },

  {
    id: 'EMP014',
    employee_id: 'FMN-2024-001',
    name: 'Bambang Sutrisno, S.T.',
    position: 'Site Foreman',
    department: 'Site Operations',
    email: 'bambang.sutrisno@nusantaragroup.co.id',
    phone: '+62-825-4444-0014',
    join_date: '2019-07-15',
    birth_date: '1982-12-05',
    address: 'Jl. Duren Tiga No. 45, Jakarta Selatan',
    status: 'active',
    employment_type: 'permanent',
    salary: 12500000,
    current_project: 'PRJ-2025-001',
    skills: JSON.stringify([
      { name: 'Construction Supervision', level: 'advanced' },
      { name: 'Trade Coordination', level: 'advanced' },
      { name: 'Quality Control', level: 'intermediate' },
      { name: 'Safety Enforcement', level: 'advanced' }
    ]),
    metadata: JSON.stringify({
      certifications: ['Foreman_Certification', 'Safety_Training', 'Construction_Skills'],
      performance_rating: 4.3,
      notes: 'Foreman berpengalaman dengan kemampuan koordinasi tim yang baik'
    }),
    created_at: new Date(),
    updated_at: new Date()
  },

  {
    id: 'EMP015',
    employee_id: 'FMN-2024-002',
    name: 'Joko Prasetyo, S.T.',
    position: 'Electrical Foreman',
    department: 'Site Operations',
    email: 'joko.prasetyo@nusantaragroup.co.id',
    phone: '+62-826-5555-0015',
    join_date: '2020-03-20',
    birth_date: '1984-08-14',
    address: 'Jl. Kebayoran Lama No. 78, Jakarta Selatan',
    status: 'active',
    employment_type: 'permanent',
    salary: 13000000,
    current_project: 'PRJ-2025-002',
    skills: JSON.stringify([
      { name: 'Electrical Installation', level: 'advanced' },
      { name: 'Electrical Safety', level: 'advanced' },
      { name: 'Team Leadership', level: 'intermediate' },
      { name: 'Troubleshooting', level: 'advanced' }
    ]),
    metadata: JSON.stringify({
      certifications: ['Electrical_Foreman', 'Electrical_Safety', 'PJK3_Listrik'],
      performance_rating: 4.4,
      notes: 'Electrical foreman dengan expertise dalam instalasi listrik industrial'
    }),
    created_at: new Date(),
    updated_at: new Date()
  },

  // ==================== TECHNICAL SPECIALISTS ====================
  {
    id: 'EMP016',
    employee_id: 'SPV-2024-001',
    name: 'Ir. Ratna Dewi, M.T.',
    position: 'Architecture Supervisor',
    department: 'Technical',
    email: 'ratna.dewi@nusantaragroup.co.id',
    phone: '+62-827-6666-0016',
    join_date: '2021-01-10',
    birth_date: '1983-11-07',
    address: 'Jl. Bintaro Raya No. 34, Jakarta Selatan',
    status: 'active',
    employment_type: 'permanent',
    salary: 16000000,
    current_project: 'PRJ-2025-003',
    skills: JSON.stringify([
      { name: 'Architectural Design', level: 'advanced' },
      { name: 'Building Code Compliance', level: 'advanced' },
      { name: 'CAD Design', level: 'expert' },
      { name: 'Project Coordination', level: 'intermediate' }
    ]),
    metadata: JSON.stringify({
      certifications: ['Architect_Professional', 'AutoCAD_Expert', 'Building_Code'],
      performance_rating: 4.3,
      notes: 'Architect dengan spesialisasi dalam residential dan commercial design'
    }),
    created_at: new Date(),
    updated_at: new Date()
  },

  {
    id: 'EMP017',
    employee_id: 'TCH-2024-001',
    name: 'Ahmad Fauzi, A.Md.',
    position: 'Survey Technician',
    department: 'Technical',
    email: 'ahmad.fauzi@nusantaragroup.co.id',
    phone: '+62-828-7777-0017',
    join_date: '2020-08-18',
    birth_date: '1987-02-28',
    address: 'Jl. Cilandak Raya No. 89, Jakarta Selatan',
    status: 'active',
    employment_type: 'permanent',
    salary: 9500000,
    current_project: 'PRJ-2025-004',
    skills: JSON.stringify([
      { name: 'Land Surveying', level: 'advanced' },
      { name: 'GPS/GIS Technology', level: 'advanced' },
      { name: 'Topographic Survey', level: 'advanced' },
      { name: 'Survey Equipment', level: 'expert' }
    ]),
    metadata: JSON.stringify({
      certifications: ['Survey_Technician', 'GPS_Operation', 'GIS_Software'],
      performance_rating: 4.2,
      notes: 'Survey technician dengan keahlian dalam penggunaan alat survey modern'
    }),
    created_at: new Date(),
    updated_at: new Date()
  },

  {
    id: 'EMP018',
    employee_id: 'TCH-2024-002',
    name: 'Rudi Santoso, A.Md.',
    position: 'CAD Technician',
    department: 'Technical',
    email: 'rudi.santoso@nusantaragroup.co.id',
    phone: '+62-829-8888-0018',
    join_date: '2021-05-22',
    birth_date: '1989-09-16',
    address: 'Jl. Jagakarsa No. 67, Jakarta Selatan',
    status: 'active',
    employment_type: 'permanent',
    salary: 8500000,
    current_project: 'PRJ-2025-001',
    skills: JSON.stringify([
      { name: 'AutoCAD', level: 'expert' },
      { name: 'SketchUp', level: 'advanced' },
      { name: 'Technical Drawing', level: 'advanced' },
      { name: 'BIM Software', level: 'intermediate' }
    ]),
    metadata: JSON.stringify({
      certifications: ['AutoCAD_Professional', 'SketchUp_Pro', 'Technical_Drawing'],
      performance_rating: 4.1,
      notes: 'CAD technician dengan kemampuan drafting yang detail dan akurat'
    }),
    created_at: new Date(),
    updated_at: new Date()
  },

  // ==================== LOGISTICS & PROCUREMENT ====================
  {
    id: 'EMP019',
    employee_id: 'LOG-2024-001',
    name: 'Ir. Yudi Hermawan, M.M.',
    position: 'Procurement Manager',
    department: 'Logistics',
    email: 'yudi.hermawan@nusantaragroup.co.id',
    phone: '+62-830-9999-0019',
    join_date: '2019-09-05',
    birth_date: '1978-07-13',
    address: 'Jl. Ragunan No. 23, Jakarta Selatan',
    status: 'active',
    employment_type: 'permanent',
    salary: 19500000,
    current_project: 'PROCUREMENT-ALL',
    skills: JSON.stringify([
      { name: 'Procurement Management', level: 'expert' },
      { name: 'Vendor Management', level: 'advanced' },
      { name: 'Contract Negotiation', level: 'advanced' },
      { name: 'Supply Chain Management', level: 'advanced' }
    ]),
    metadata: JSON.stringify({
      certifications: ['Procurement_Professional', 'Contract_Management', 'Supply_Chain'],
      performance_rating: 4.5,
      notes: 'Procurement manager dengan network vendor yang luas dan kemampuan negosiasi yang baik'
    }),
    created_at: new Date(),
    updated_at: new Date()
  },

  {
    id: 'EMP020',
    employee_id: 'LOG-2024-002',
    name: 'Eko Prasetyo, S.T.',
    position: 'Logistics Coordinator',
    department: 'Logistics',
    email: 'eko.prasetyo@nusantaragroup.co.id',
    phone: '+62-831-0000-0020',
    join_date: '2020-11-30',
    birth_date: '1985-05-09',
    address: 'Jl. Pondok Labu No. 12, Jakarta Selatan',
    status: 'active',
    employment_type: 'permanent',
    salary: 11500000,
    current_project: 'LOGISTICS-ALL',
    skills: JSON.stringify([
      { name: 'Logistics Coordination', level: 'advanced' },
      { name: 'Inventory Management', level: 'advanced' },
      { name: 'Transportation Management', level: 'intermediate' },
      { name: 'Warehouse Management', level: 'advanced' }
    ]),
    metadata: JSON.stringify({
      certifications: ['Logistics_Management', 'Inventory_Control', 'Transportation'],
      performance_rating: 4.2,
      notes: 'Logistics coordinator yang efisien dalam mengatur distribusi material'
    }),
    created_at: new Date(),
    updated_at: new Date()
  },

  // ==================== FINANCE & ADMINISTRATION ====================
  {
    id: 'EMP021',
    employee_id: 'FIN-2024-001',
    name: 'Dra. Indira Sari, M.M., CPA',
    position: 'Finance Manager',
    department: 'Finance',
    email: 'indira.sari@nusantaragroup.co.id',
    phone: '+62-832-1111-0021',
    join_date: '2018-06-15',
    birth_date: '1975-12-20',
    address: 'Jl. Kemang Utara No. 56, Jakarta Selatan',
    status: 'active',
    employment_type: 'permanent',
    salary: 24000000,
    current_project: 'FINANCE-ALL',
    skills: JSON.stringify([
      { name: 'Financial Management', level: 'expert' },
      { name: 'Financial Reporting', level: 'expert' },
      { name: 'Budget Planning', level: 'advanced' },
      { name: 'Tax Management', level: 'advanced' }
    ]),
    metadata: JSON.stringify({
      certifications: ['CPA', 'Financial_Management', 'Tax_Consultant', 'Budget_Planning'],
      performance_rating: 4.6,
      notes: 'Finance manager dengan expertise dalam financial planning dan tax compliance'
    }),
    created_at: new Date(),
    updated_at: new Date()
  },

  {
    id: 'EMP022',
    employee_id: 'ADM-2024-001',
    name: 'Sri Wahyuni, S.E.',
    position: 'Administrative Manager',
    department: 'Administration',
    email: 'sri.wahyuni@nusantaragroup.co.id',
    phone: '+62-833-2222-0022',
    join_date: '2020-02-10',
    birth_date: '1983-03-25',
    address: 'Jl. Ampera Raya No. 78, Jakarta Selatan',
    status: 'active',
    employment_type: 'permanent',
    salary: 12000000,
    current_project: 'ADMIN-ALL',
    skills: JSON.stringify([
      { name: 'Administrative Management', level: 'advanced' },
      { name: 'Document Management', level: 'advanced' },
      { name: 'Office Management', level: 'advanced' },
      { name: 'Data Management', level: 'intermediate' }
    ]),
    metadata: JSON.stringify({
      certifications: ['Administrative_Professional', 'Document_Management', 'Office_Management'],
      performance_rating: 4.3,
      notes: 'Administrative manager yang efisien dalam mengelola operasional kantor'
    }),
    created_at: new Date(),
    updated_at: new Date()
  },

  // ==================== IT & TECHNOLOGY ====================
  {
    id: 'EMP023',
    employee_id: 'IT-2024-001',
    name: 'Ir. Denny Kurniawan, M.T.',
    position: 'IT Manager',
    department: 'Information Technology',
    email: 'denny.kurniawan@nusantaragroup.co.id',
    phone: '+62-834-3333-0023',
    join_date: '2021-03-08',
    birth_date: '1982-10-12',
    address: 'Jl. Senayan No. 90, Jakarta Pusat',
    status: 'active',
    employment_type: 'permanent',
    salary: 21000000,
    current_project: 'IT-INFRASTRUCTURE',
    skills: JSON.stringify([
      { name: 'IT Infrastructure', level: 'expert' },
      { name: 'System Administration', level: 'advanced' },
      { name: 'Network Management', level: 'advanced' },
      { name: 'Database Management', level: 'intermediate' }
    ]),
    metadata: JSON.stringify({
      certifications: ['Network_Professional', 'System_Administrator', 'Database_Management'],
      performance_rating: 4.4,
      notes: 'IT manager dengan expertise dalam infrastructure dan system integration'
    }),
    created_at: new Date(),
    updated_at: new Date()
  },

  // ==================== ADDITIONAL SPECIALISTS ====================
  {
    id: 'EMP024',
    employee_id: 'SPE-2024-001',
    name: 'Ir. Fitri Handayani, M.T.',
    position: 'Environmental Specialist',
    department: 'Environment',
    email: 'fitri.handayani@nusantaragroup.co.id',
    phone: '+62-835-4444-0024',
    join_date: '2021-07-20',
    birth_date: '1984-06-18',
    address: 'Jl. Lebak Bulus No. 45, Jakarta Selatan',
    status: 'active',
    employment_type: 'permanent',
    salary: 15500000,
    current_project: 'ENVIRONMENTAL-ALL',
    skills: JSON.stringify([
      { name: 'Environmental Impact Assessment', level: 'advanced' },
      { name: 'Environmental Compliance', level: 'advanced' },
      { name: 'Waste Management', level: 'intermediate' },
      { name: 'Green Building', level: 'intermediate' }
    ]),
    metadata: JSON.stringify({
      certifications: ['Environmental_Professional', 'EIA_Specialist', 'Green_Building'],
      performance_rating: 4.2,
      notes: 'Environmental specialist dengan expertise dalam AMDAL dan green construction'
    }),
    created_at: new Date(),
    updated_at: new Date()
  },

  {
    id: 'EMP025',
    employee_id: 'SPE-2024-002',
    name: 'Dr. Ir. Rahmat Hidayat, M.T.',
    position: 'Research & Development Manager',
    department: 'Research & Development',
    email: 'rahmat.hidayat@nusantaragroup.co.id',
    phone: '+62-836-5555-0025',
    join_date: '2020-12-15',
    birth_date: '1973-08-30',
    address: 'Jl. UI No. 123, Depok',
    status: 'active',
    employment_type: 'permanent',
    salary: 26500000,
    current_project: 'R&D-INNOVATION',
    skills: JSON.stringify([
      { name: 'Research & Development', level: 'expert' },
      { name: 'Innovation Management', level: 'expert' },
      { name: 'Technology Assessment', level: 'advanced' },
      { name: 'Product Development', level: 'advanced' }
    ]),
    metadata: JSON.stringify({
      certifications: ['PhD_Civil_Engineering', 'Innovation_Management', 'Technology_Assessment'],
      performance_rating: 4.7,
      notes: 'R&D manager dengan fokus pada inovasi teknologi konstruksi dan sustainable building'
    }),
    created_at: new Date(),
    updated_at: new Date()
  }
];

/**
 * Seed Comprehensive Manpower Data
 */
async function seedComprehensiveManpower() {
  try {
    console.log('🌱 Starting Comprehensive Manpower/SDM seeding...');
    
    // Clear existing manpower first
    console.log('🗑️  Clearing existing manpower data...');
    const deletedCount = await Manpower.destroy({
      where: {},
      force: true // Hard delete
    });
    console.log(`✅ Cleared ${deletedCount} existing manpower records`);
    
    // Insert new comprehensive manpower data
    console.log('📝 Creating comprehensive manpower with professional expertise...');
    const createdEmployees = [];
    
    for (const employee of manpowerData) {
      try {
        const created = await Manpower.create(employee);
        createdEmployees.push(created);
        console.log(`✅ Created: ${employee.name} - ${employee.position} (${employee.department})`);
      } catch (error) {
        console.error(`❌ Failed to create ${employee.name}:`, error.message);
      }
    }
    
    // Generate summary statistics
    const departmentStats = manpowerData.reduce((acc, emp) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1;
      return acc;
    }, {});
    
    const positionLevels = {
      'Manager Level': manpowerData.filter(emp => emp.position.toLowerCase().includes('manager')).length,
      'Senior Level': manpowerData.filter(emp => emp.position.toLowerCase().includes('senior')).length,
      'Engineer Level': manpowerData.filter(emp => emp.position.toLowerCase().includes('engineer')).length,
      'Supervisor/Foreman': manpowerData.filter(emp => 
        emp.position.toLowerCase().includes('supervisor') || 
        emp.position.toLowerCase().includes('foreman')
      ).length,
      'Specialist': manpowerData.filter(emp => emp.position.toLowerCase().includes('specialist')).length,
      'Technician': manpowerData.filter(emp => emp.position.toLowerCase().includes('technician')).length
    };
    
    console.log('\n🎉 Comprehensive Manpower seeding completed!');
    console.log(`📊 Summary:`);
    console.log(`   • Total employees created: ${createdEmployees.length}`);
    console.log(`   • Department distribution:`);
    Object.entries(departmentStats).forEach(([dept, count]) => {
      console.log(`     - ${dept}: ${count} employees`);
    });
    console.log(`   • Position level distribution:`);
    Object.entries(positionLevels).forEach(([level, count]) => {
      console.log(`     - ${level}: ${count} employees`);
    });
    
    const avgSalary = manpowerData.reduce((sum, emp) => sum + emp.salary, 0) / manpowerData.length;
    console.log(`   • Average salary: Rp ${avgSalary.toLocaleString()}`);
    
    return {
      success: true,
      employees: createdEmployees,
      cleared: deletedCount,
      summary: {
        totalEmployees: createdEmployees.length,
        departmentStats,
        positionLevels,
        averageSalary: avgSalary
      }
    };
    
  } catch (error) {
    console.error('❌ Error seeding comprehensive manpower:', error);
    throw error;
  }
}

// Run seeder if called directly
if (require.main === module) {
  seedComprehensiveManpower()
    .then(result => {
      console.log('✅ Manpower seeder completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Manpower seeder failed:', error);
      process.exit(1);
    });
}

module.exports = {
  seedComprehensiveManpower,
  manpowerData
};
