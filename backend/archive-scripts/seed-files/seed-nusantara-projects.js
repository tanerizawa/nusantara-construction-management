const { models } = require('./models');
const { Project, Subsidiary, Manpower, User } = models;

/**
 * Professional Project Seeder untuk NUSANTARA GROUP
 * - 10 proyek beragam berlokasi di Karawang
 * - 80% proyek swasta, 20% pemerintah
 * - Terhubung dengan subsidiaries dan manpower
 * - Sesuai best practice industri konstruksi Indonesia
 */

const projectsData = [
  // PROYEK SWASTA (8 proyek - 80%)
  {
    id: 'PRJ-2025-001',
    name: 'Karawang Industrial Complex Phase 2',
    description: 'Pembangunan kompleks industri modern seluas 15 hektar dengan fasilitas pabrik, gudang, dan kantor administrasi. Proyek ini merupakan ekspansi dari fase pertama dan akan menampung 5 perusahaan manufaktur multinasional.',
    clientName: 'PT. Karawang Industrial Estate',
    clientContact: {
      name: 'Ir. Bambang Wijaya',
      position: 'Project Director',
      phone: '+62-267-8401001',
      email: 'bambang.wijaya@kie.co.id',
      address: 'Jl. Industri Utama No. 1, KIIC Karawang'
    },
    location: {
      address: 'Kawasan Industri Karawang International (KIIC)',
      city: 'Karawang',
      state: 'Jawa Barat',
      postalCode: '41361',
      coordinates: {
        lat: -6.3026,
        lng: 107.3008
      },
      area: '15 hektar'
    },
    budget: 85000000000, // 85 Miliar
    actualCost: 0,
    status: 'planning',
    priority: 'high',
    progress: 0,
    startDate: '2025-10-01',
    endDate: '2026-08-30',
    estimatedDuration: 334, // ~11 bulan
    subsidiaryId: 'NU005', // CV. SAHABAT SINAR RAYA (Industrial)
    projectManagerId: null, // Will be assigned from manpower
    subsidiaryInfo: {
      specialization: 'industrial',
      capabilities: ['warehouse construction', 'factory building', 'industrial infrastructure']
    },
    team: [], // Will be populated from manpower
    milestones: [
      {
        id: 'MS-001-01',
        name: 'Site Preparation & Foundation',
        description: 'Persiapan lahan dan pembangunan pondasi',
        targetDate: '2025-12-15',
        status: 'pending',
        progress: 0
      },
      {
        id: 'MS-001-02', 
        name: 'Structure & Building Shell',
        description: 'Pembangunan struktur utama dan shell bangunan',
        targetDate: '2026-04-30',
        status: 'pending',
        progress: 0
      },
      {
        id: 'MS-001-03',
        name: 'MEP Installation',
        description: 'Instalasi mechanical, electrical, dan plumbing',
        targetDate: '2026-07-15',
        status: 'pending',
        progress: 0
      },
      {
        id: 'MS-001-04',
        name: 'Finishing & Commissioning',
        description: 'Finishing dan commissioning seluruh sistem',
        targetDate: '2026-08-30',
        status: 'pending',
        progress: 0
      }
    ],
    documents: [
      {
        type: 'contract',
        name: 'Kontrak Konstruksi KIC Phase 2',
        status: 'draft'
      },
      {
        type: 'permit',
        name: 'IMB Kawasan Industri',
        status: 'in_progress'
      }
    ],
    notes: 'Proyek strategis untuk ekspansi kawasan industri Karawang. Klien multinasional dengan standar kualitas tinggi.',
    tags: ['industrial', 'swasta', 'karawang', 'manufaktur', 'multinasional']
  },

  {
    id: 'PRJ-2025-002',
    name: 'Karawang Central Mall Renovation',
    description: 'Renovasi dan modernisasi mall eksisting dengan luas 45.000 m², termasuk upgrade system MEP, redesign interior, dan penambahan food court modern serta entertainment center.',
    clientName: 'PT. Karawang Central Property',
    clientContact: {
      name: 'Dra. Sinta Maharani',
      position: 'Development Manager',
      phone: '+62-267-8402002',
      email: 'sinta.maharani@kcproperty.co.id',
      address: 'Jl. Central Mall No. 88, Karawang'
    },
    location: {
      address: 'Jl. Ahmad Yani No. 88, Pusat Kota Karawang',
      city: 'Karawang',
      state: 'Jawa Barat',
      postalCode: '41311',
      coordinates: {
        lat: -6.3066,
        lng: 107.3026
      },
      area: '45.000 m²'
    },
    budget: 28000000000, // 28 Miliar
    actualCost: 0,
    status: 'planning',
    priority: 'medium',
    progress: 0,
    startDate: '2025-11-01',
    endDate: '2026-05-30',
    estimatedDuration: 210, // 7 bulan
    subsidiaryId: 'NU003', // CV. LATANSA (Renovation)
    projectManagerId: null,
    subsidiaryInfo: {
      specialization: 'renovation',
      capabilities: ['mall renovation', 'interior design', 'MEP upgrade']
    },
    team: [],
    milestones: [
      {
        id: 'MS-002-01',
        name: 'Design Development',
        description: 'Pengembangan desain detail renovasi',
        targetDate: '2025-12-01',
        status: 'pending',
        progress: 0
      },
      {
        id: 'MS-002-02',
        name: 'Phase 1 Renovation',
        description: 'Renovasi zona A (50% area)',
        targetDate: '2026-02-28',
        status: 'pending',
        progress: 0
      },
      {
        id: 'MS-002-03',
        name: 'Phase 2 Renovation',
        description: 'Renovasi zona B dan finishing',
        targetDate: '2026-05-30',
        status: 'pending',
        progress: 0
      }
    ],
    documents: [
      {
        type: 'contract',
        name: 'Kontrak Renovasi Mall',
        status: 'signed'
      },
      {
        type: 'design',
        name: 'Desain Interior Modern',
        status: 'in_progress'
      }
    ],
    notes: 'Renovasi mall dengan tetap beroperasi. Perlu koordinasi ketat untuk meminimalisir gangguan operasional.',
    tags: ['renovation', 'swasta', 'karawang', 'retail', 'interior']
  },

  {
    id: 'PRJ-2025-003',
    name: 'Karawang Hills Residence',
    description: 'Pembangunan perumahan mewah 150 unit dengan konsep modern minimalis, dilengkapi fasilitas clubhouse, swimming pool, playground, dan jogging track. Target pasar keluarga menengah atas.',
    clientName: 'PT. Karawang Hills Developer',
    clientContact: {
      name: 'Ir. Ahmad Surya',
      position: 'Project Development Director',
      phone: '+62-267-8403003',
      email: 'ahmad.surya@khd.co.id',
      address: 'Jl. Bukit Indah No. 25, Karawang'
    },
    location: {
      address: 'Jl. Bukit Hijau, Karawang Timur',
      city: 'Karawang',
      state: 'Jawa Barat', 
      postalCode: '41314',
      coordinates: {
        lat: -6.2985,
        lng: 107.3155
      },
      area: '12 hektar'
    },
    budget: 42000000000, // 42 Miliar
    actualCost: 0,
    status: 'planning',
    priority: 'medium',
    progress: 0,
    startDate: '2025-09-15',
    endDate: '2026-12-31',
    estimatedDuration: 473, // ~15.5 bulan
    subsidiaryId: 'NU002', // CV. BINTANG SURAYA (Residential)
    projectManagerId: null,
    subsidiaryInfo: {
      specialization: 'residential',
      capabilities: ['residential development', 'housing construction', 'landscape architecture']
    },
    team: [],
    milestones: [
      {
        id: 'MS-003-01',
        name: 'Infrastructure Development',
        description: 'Pembangunan infrastruktur jalan dan utilitas',
        targetDate: '2025-12-31',
        status: 'pending',
        progress: 0
      },
      {
        id: 'MS-003-02',
        name: 'Phase 1 Housing (50 units)',
        description: 'Pembangunan 50 unit rumah fase pertama',
        targetDate: '2026-06-30',
        status: 'pending',
        progress: 0
      },
      {
        id: 'MS-003-03',
        name: 'Phase 2 Housing (100 units)',
        description: 'Pembangunan 100 unit rumah fase kedua',
        targetDate: '2026-12-31',
        status: 'pending',
        progress: 0
      }
    ],
    documents: [
      {
        type: 'contract',
        name: 'Kontrak Pembangunan Perumahan',
        status: 'signed'
      },
      {
        type: 'permit',
        name: 'Surat Izin Lokasi',
        status: 'approved'
      }
    ],
    notes: 'Proyek perumahan premium dengan target market menengah atas. Focus pada kualitas dan desain modern.',
    tags: ['residential', 'swasta', 'karawang', 'perumahan', 'premium']
  },

  {
    id: 'PRJ-2025-004',
    name: 'Karawang Business District Tower',
    description: 'Pembangunan menara perkantoran 25 lantai dengan konsep green building, dilengkapi retail di lantai dasar, parking basement 3 lantai, dan sky lobby. Sertifikasi LEED Gold target.',
    clientName: 'PT. Metropolitan Karawang Property',
    clientContact: {
      name: 'Ir. Budi Hartanto, M.T.',
      position: 'CEO',
      phone: '+62-267-8404004',
      email: 'budi.hartanto@mkproperty.co.id',
      address: 'Jl. Metropolitan No. 1, Karawang'
    },
    location: {
      address: 'Jl. Pemuda Raya No. 168, CBD Karawang',
      city: 'Karawang',
      state: 'Jawa Barat',
      postalCode: '41312',
      coordinates: {
        lat: -6.3045,
        lng: 107.3001
      },
      area: '2.500 m²'
    },
    budget: 125000000000, // 125 Miliar
    actualCost: 0,
    status: 'planning',
    priority: 'high',
    progress: 0,
    startDate: '2025-12-01',
    endDate: '2027-11-30',
    estimatedDuration: 730, // 2 tahun
    subsidiaryId: 'NU001', // CV. CAHAYA UTAMA EMPATBELAS (Commercial)
    projectManagerId: null,
    subsidiaryInfo: {
      specialization: 'commercial',
      capabilities: ['high-rise construction', 'commercial building', 'green building']
    },
    team: [],
    milestones: [
      {
        id: 'MS-004-01',
        name: 'Foundation & Basement',
        description: 'Pembangunan pondasi dan basement 3 lantai',
        targetDate: '2026-06-30',
        status: 'pending',
        progress: 0
      },
      {
        id: 'MS-004-02',
        name: 'Structure to 15th Floor',
        description: 'Pembangunan struktur sampai lantai 15',
        targetDate: '2026-12-31',
        status: 'pending',
        progress: 0
      },
      {
        id: 'MS-004-03',
        name: 'Top Structure & MEP',
        description: 'Penyelesaian struktur atas dan instalasi MEP',
        targetDate: '2027-06-30',
        status: 'pending',
        progress: 0
      },
      {
        id: 'MS-004-04',
        name: 'Finishing & LEED Certification',
        description: 'Finishing dan proses sertifikasi LEED',
        targetDate: '2027-11-30',
        status: 'pending',
        progress: 0
      }
    ],
    documents: [
      {
        type: 'contract',
        name: 'Kontrak Pembangunan Tower',
        status: 'negotiation'
      },
      {
        type: 'permit',
        name: 'IMB High Rise Building',
        status: 'in_progress'
      }
    ],
    notes: 'Proyek landmark Karawang dengan target sertifikasi LEED Gold. Kompleksitas tinggi dengan standar internasional.',
    tags: ['commercial', 'swasta', 'karawang', 'high-rise', 'green-building']
  },

  {
    id: 'PRJ-2025-005',
    name: 'Karawang Automotive Parts Factory',
    description: 'Pembangunan pabrik suku cadang otomotif modern dengan kapasitas produksi 50.000 unit/bulan, dilengkapi clean room, quality control lab, dan automated warehouse system.',
    clientName: 'PT. Nippon Auto Parts Indonesia',
    clientContact: {
      name: 'Tanaka Hiroshi',
      position: 'Factory Development Manager',
      phone: '+62-267-8405005',
      email: 'tanaka.hiroshi@napi.co.id',
      address: 'Jl. Industri Surya No. 77, KIIC Karawang'
    },
    location: {
      address: 'Kawasan Industri Surya Cipta, Karawang',
      city: 'Karawang',
      state: 'Jawa Barat',
      postalCode: '41363',
      coordinates: {
        lat: -6.2995,
        lng: 107.3112
      },
      area: '8 hektar'
    },
    budget: 68000000000, // 68 Miliar
    actualCost: 0,
    status: 'planning',
    priority: 'high',
    progress: 0,
    startDate: '2025-10-15',
    endDate: '2026-10-14',
    estimatedDuration: 365, // 1 tahun
    subsidiaryId: 'NU005', // CV. SAHABAT SINAR RAYA (Industrial)
    projectManagerId: null,
    subsidiaryInfo: {
      specialization: 'industrial',
      capabilities: ['automotive factory', 'clean room construction', 'industrial automation']
    },
    team: [],
    milestones: [
      {
        id: 'MS-005-01',
        name: 'Site Development',
        description: 'Persiapan site dan infrastruktur dasar',
        targetDate: '2025-12-31',
        status: 'pending',
        progress: 0
      },
      {
        id: 'MS-005-02',
        name: 'Production Building',
        description: 'Pembangunan bangunan produksi utama',
        targetDate: '2026-05-31',
        status: 'pending',
        progress: 0
      },
      {
        id: 'MS-005-03',
        name: 'Equipment Installation',
        description: 'Instalasi peralatan produksi',
        targetDate: '2026-08-31',
        status: 'pending',
        progress: 0
      },
      {
        id: 'MS-005-04',
        name: 'Testing & Commissioning',
        description: 'Testing dan commissioning sistem',
        targetDate: '2026-10-14',
        status: 'pending',
        progress: 0
      }
    ],
    documents: [
      {
        type: 'contract',
        name: 'Kontrak EPC Automotive Factory',
        status: 'draft'
      },
      {
        type: 'technical',
        name: 'Technical Specification',
        status: 'approved'
      }
    ],
    notes: 'Proyek dengan standar Jepang yang sangat ketat. Memerlukan expertise khusus untuk automotive manufacturing.',
    tags: ['industrial', 'swasta', 'karawang', 'automotive', 'manufacturing']
  },

  {
    id: 'PRJ-2025-006',
    name: 'Karawang Medical Center Hospital',
    description: 'Pembangunan rumah sakit umum 150 bed dengan fasilitas lengkap: IGD, ICU, kamar operasi, laboratorium, radiologi, dan helipad. Mengikuti standar akreditasi internasional JCI.',
    clientName: 'PT. Medika Karawang Sejahtera',
    clientContact: {
      name: 'Dr. Siti Nurhaliza, Sp.A',
      position: 'Medical Director',
      phone: '+62-267-8406006',
      email: 'siti.nurhaliza@medikakarawang.co.id',
      address: 'Jl. Kesehatan No. 15, Karawang'
    },
    location: {
      address: 'Jl. Dr. Sutomo No. 45, Karawang Barat',
      city: 'Karawang',
      state: 'Jawa Barat',
      postalCode: '41316',
      coordinates: {
        lat: -6.3125,
        lng: 107.2885
      },
      area: '5 hektar'
    },
    budget: 95000000000, // 95 Miliar
    actualCost: 0,
    status: 'planning',
    priority: 'high',
    progress: 0,
    startDate: '2025-11-15',
    endDate: '2027-05-14',
    estimatedDuration: 545, // ~18 bulan
    subsidiaryId: 'NU006', // PT. PUTRA JAYA KONSTRUKASI (General)
    projectManagerId: null,
    subsidiaryInfo: {
      specialization: 'general',
      capabilities: ['healthcare construction', 'complex MEP systems', 'specialized facilities']
    },
    team: [],
    milestones: [
      {
        id: 'MS-006-01',
        name: 'Infrastructure & Foundation',
        description: 'Pembangunan infrastruktur dan pondasi',
        targetDate: '2026-03-31',
        status: 'pending',
        progress: 0
      },
      {
        id: 'MS-006-02',
        name: 'Main Structure',
        description: 'Pembangunan struktur utama bangunan',
        targetDate: '2026-09-30',
        status: 'pending',
        progress: 0
      },
      {
        id: 'MS-006-03',
        name: 'Medical MEP Systems',
        description: 'Instalasi sistem MEP khusus medis',
        targetDate: '2027-02-28',
        status: 'pending',
        progress: 0
      },
      {
        id: 'MS-006-04',
        name: 'JCI Accreditation Prep',
        description: 'Persiapan sertifikasi JCI',
        targetDate: '2027-05-14',
        status: 'pending',
        progress: 0
      }
    ],
    documents: [
      {
        type: 'contract',
        name: 'Kontrak Pembangunan RS',
        status: 'signed'
      },
      {
        type: 'permit',
        name: 'Izin Mendirikan Rumah Sakit',
        status: 'in_progress'
      }
    ],
    notes: 'Proyek rumah sakit dengan standar JCI. Memerlukan expertise khusus dalam healthcare construction.',
    tags: ['healthcare', 'swasta', 'karawang', 'hospital', 'JCI-standard']
  },

  {
    id: 'PRJ-2025-007',
    name: 'Karawang International School Campus',
    description: 'Pembangunan kampus sekolah internasional dengan kurikulum Cambridge untuk kapasitas 1.200 siswa, dilengkapi laboratorium sains, perpustakaan digital, gymnasium, dan boarding facilities.',
    clientName: 'Yayasan Pendidikan Karawang Global',
    clientContact: {
      name: 'Prof. Dr. Rina Kartika, M.Ed',
      position: 'School Director',
      phone: '+62-267-8407007',
      email: 'rina.kartika@kgschool.edu',
      address: 'Jl. Pendidikan Global No. 88, Karawang'
    },
    location: {
      address: 'Jl. Education Valley, Karawang Timur',
      city: 'Karawang',
      state: 'Jawa Barat',
      postalCode: '41317',
      coordinates: {
        lat: -6.2955,
        lng: 107.3201
      },
      area: '10 hektar'
    },
    budget: 58000000000, // 58 Miliar
    actualCost: 0,
    status: 'planning',
    priority: 'medium',
    progress: 0,
    startDate: '2025-09-01',
    endDate: '2026-12-15',
    estimatedDuration: 471, // ~15.5 bulan
    subsidiaryId: 'NU001', // CV. CAHAYA UTAMA EMPATBELAS (Commercial)
    projectManagerId: null,
    subsidiaryInfo: {
      specialization: 'commercial',
      capabilities: ['educational facilities', 'modern architecture', 'sustainable design']
    },
    team: [],
    milestones: [
      {
        id: 'MS-007-01',
        name: 'Academic Buildings',
        description: 'Pembangunan bangunan akademik utama',
        targetDate: '2026-03-31',
        status: 'pending',
        progress: 0
      },
      {
        id: 'MS-007-02',
        name: 'Sports & Recreation',
        description: 'Pembangunan fasilitas olahraga',
        targetDate: '2026-08-31',
        status: 'pending',
        progress: 0
      },
      {
        id: 'MS-007-03',
        name: 'Boarding Facilities',
        description: 'Pembangunan asrama siswa',
        targetDate: '2026-12-15',
        status: 'pending',
        progress: 0
      }
    ],
    documents: [
      {
        type: 'contract',
        name: 'Kontrak Pembangunan Sekolah',
        status: 'signed'
      },
      {
        type: 'permit',
        name: 'Izin Operasional Sekolah',
        status: 'approved'
      }
    ],
    notes: 'Proyek pendidikan internasional dengan standar Cambridge. Focus pada fasilitas pembelajaran modern.',
    tags: ['education', 'swasta', 'karawang', 'international', 'cambridge']
  },

  {
    id: 'PRJ-2025-008',
    name: 'Karawang Logistics Hub Center',
    description: 'Pembangunan pusat logistik modern dengan automated warehouse seluas 25.000 m², loading dock 50 unit, cold storage, dan truck terminal. Mendukung e-commerce dan distribusi regional.',
    clientName: 'PT. Express Logistics Indonesia',
    clientContact: {
      name: 'Ir. Joko Widodo, M.M.',
      position: 'Operations Director',
      phone: '+62-267-8408008',
      email: 'joko.widodo@express-logistics.co.id',
      address: 'Jl. Logistik Prima No. 99, Karawang'
    },
    location: {
      address: 'Jl. Bypass Tol Karawang, Exit Karawang Timur',
      city: 'Karawang',
      state: 'Jawa Barat',
      postalCode: '41319',
      coordinates: {
        lat: -6.2875,
        lng: 107.3301
      },
      area: '6 hektar'
    },
    budget: 38000000000, // 38 Miliar
    actualCost: 0,
    status: 'planning',
    priority: 'medium',
    progress: 0,
    startDate: '2025-10-01',
    endDate: '2026-06-30',
    estimatedDuration: 273, // 9 bulan
    subsidiaryId: 'NU005', // CV. SAHABAT SINAR RAYA (Industrial)
    projectManagerId: null,
    subsidiaryInfo: {
      specialization: 'industrial',
      capabilities: ['warehouse construction', 'logistics facilities', 'automation systems']
    },
    team: [],
    milestones: [
      {
        id: 'MS-008-01',
        name: 'Site Infrastructure',
        description: 'Pembangunan infrastruktur dasar site',
        targetDate: '2025-12-15',
        status: 'pending',
        progress: 0
      },
      {
        id: 'MS-008-02',
        name: 'Warehouse Construction',
        description: 'Pembangunan gudang utama',
        targetDate: '2026-04-15',
        status: 'pending',
        progress: 0
      },
      {
        id: 'MS-008-03',
        name: 'Automation Installation',
        description: 'Instalasi sistem otomasi',
        targetDate: '2026-06-30',
        status: 'pending',
        progress: 0
      }
    ],
    documents: [
      {
        type: 'contract',
        name: 'Kontrak Logistics Hub',
        status: 'signed'
      },
      {
        type: 'technical',
        name: 'Automation Specification',
        status: 'approved'
      }
    ],
    notes: 'Proyek logistics modern dengan fokus pada automation dan efficiency. Strategic location dekat tol.',
    tags: ['logistics', 'swasta', 'karawang', 'warehouse', 'automation']
  },

  // PROYEK PEMERINTAH (2 proyek - 20%)
  {
    id: 'PRJ-2025-009',
    name: 'Jembatan Karawang - Bekasi Infrastructure',
    description: 'Pembangunan jembatan penghubung Karawang-Bekasi sepanjang 1.2 km dengan 4 lajur, dilengkapi pedestrian way dan bicycle lane. Proyek strategis untuk mengurangi kemacetan akses Jakarta.',
    clientName: 'Dinas Pekerjaan Umum Provinsi Jawa Barat',
    clientContact: {
      name: 'Ir. Agus Prasetyo, M.T.',
      position: 'Kepala Bidang Jalan dan Jembatan',
      phone: '+62-267-8409009',
      email: 'agus.prasetyo@dpu.jabarprov.go.id',
      address: 'Jl. Pemerintahan No. 1, Karawang'
    },
    location: {
      address: 'Sungai Citarum, Perbatasan Karawang-Bekasi',
      city: 'Karawang',
      state: 'Jawa Barat',
      postalCode: '41351',
      coordinates: {
        lat: -6.2665,
        lng: 107.1850
      },
      area: '1.2 km'
    },
    budget: 150000000000, // 150 Miliar
    actualCost: 0,
    status: 'planning',
    priority: 'urgent',
    progress: 0,
    startDate: '2025-08-01',
    endDate: '2027-02-28',
    estimatedDuration: 577, // ~19 bulan
    subsidiaryId: 'NU004', // CV. GRAHA BANGUN NUSANTARA (Infrastructure)
    projectManagerId: null,
    subsidiaryInfo: {
      specialization: 'infrastructure',
      capabilities: ['bridge construction', 'highway infrastructure', 'large scale projects']
    },
    team: [],
    milestones: [
      {
        id: 'MS-009-01',
        name: 'Environmental Clearance',
        description: 'Penyelesaian AMDAL dan perizinan lingkungan',
        targetDate: '2025-10-31',
        status: 'pending',
        progress: 0
      },
      {
        id: 'MS-009-02',
        name: 'Foundation & Pier',
        description: 'Pembangunan pondasi dan pier jembatan',
        targetDate: '2026-06-30',
        status: 'pending',
        progress: 0
      },
      {
        id: 'MS-009-03',
        name: 'Superstructure',
        description: 'Pembangunan struktur atas jembatan',
        targetDate: '2026-12-31',
        status: 'pending',
        progress: 0
      },
      {
        id: 'MS-009-04',
        name: 'Road Connection & Testing',
        description: 'Koneksi jalan dan load testing',
        targetDate: '2027-02-28',
        status: 'pending',
        progress: 0
      }
    ],
    documents: [
      {
        type: 'contract',
        name: 'Kontrak Pemerintah Jembatan',
        status: 'in_process'
      },
      {
        type: 'environmental',
        name: 'AMDAL Jembatan',
        status: 'in_progress'
      }
    ],
    notes: 'Proyek infrastruktur strategis provinsi. Proses tender dan perizinan kompleks sesuai regulasi pemerintah.',
    tags: ['infrastructure', 'pemerintah', 'karawang', 'jembatan', 'strategis']
  },

  {
    id: 'PRJ-2025-010',
    name: 'Karawang Regional Hospital Expansion',
    description: 'Ekspansi RSUD Karawang dengan penambahan 100 bed, new emergency wing, modern laboratory, dan parking structure. Meningkatkan kapasitas pelayanan kesehatan masyarakat.',
    clientName: 'Pemerintah Kabupaten Karawang',
    clientContact: {
      name: 'dr. Rina Sari, Sp.PD',
      position: 'Direktur RSUD Karawang',
      phone: '+62-267-8410010',
      email: 'rina.sari@rsudkarawang.go.id',
      address: 'Jl. Rumah Sakit No. 2, Karawang'
    },
    location: {
      address: 'Jl. HS. Ronggowaluyo, Telukjambe Timur',
      city: 'Karawang',
      state: 'Jawa Barat',
      postalCode: '41361',
      coordinates: {
        lat: -6.3155,
        lng: 107.2995
      },
      area: '3 hektar'
    },
    budget: 85000000000, // 85 Miliar
    actualCost: 0,
    status: 'planning',
    priority: 'high',
    progress: 0,
    startDate: '2025-07-01',
    endDate: '2026-12-31',
    estimatedDuration: 549, // ~18 bulan
    subsidiaryId: 'NU006', // PT. PUTRA JAYA KONSTRUKASI (General)
    projectManagerId: null,
    subsidiaryInfo: {
      specialization: 'general',
      capabilities: ['healthcare expansion', 'government projects', 'complex renovation']
    },
    team: [],
    milestones: [
      {
        id: 'MS-010-01',
        name: 'Design & Permits',
        description: 'Penyelesaian desain dan perizinan',
        targetDate: '2025-09-30',
        status: 'pending',
        progress: 0
      },
      {
        id: 'MS-010-02',
        name: 'Emergency Wing',
        description: 'Pembangunan emergency wing baru',
        targetDate: '2026-03-31',
        status: 'pending',
        progress: 0
      },
      {
        id: 'MS-010-03',
        name: 'Inpatient Expansion',
        description: 'Ekspansi ruang rawat inap',
        targetDate: '2026-09-30',
        status: 'pending',
        progress: 0
      },
      {
        id: 'MS-010-04',
        name: 'Equipment & Commissioning',
        description: 'Instalasi equipment dan commissioning',
        targetDate: '2026-12-31',
        status: 'pending',
        progress: 0
      }
    ],
    documents: [
      {
        type: 'contract',
        name: 'Kontrak Pemerintah RSUD',
        status: 'draft'
      },
      {
        type: 'budget',
        name: 'APBD Allocation',
        status: 'approved'
      }
    ],
    notes: 'Proyek ekspansi rumah sakit daerah dengan dana APBD. Proses birokrasi pemerintah dan standar pelayanan publik.',
    tags: ['healthcare', 'pemerintah', 'karawang', 'RSUD', 'ekspansi']
  }
];

// Function to create users from manpower for project managers
async function createUsersFromManpower() {
  try {
    // Find manpower that can be project managers (directors, senior managers, project managers)
    const eligibleManpower = await Manpower.findAll({
      where: {
        position: {
          [require('sequelize').Op.iLike]: {
            [require('sequelize').Op.any]: [
              '%direktur%',
              '%project manager%', 
              '%senior%manager%',
              '%kepala%',
              '%manager%'
            ]
          }
        }
      }
    });

    if (eligibleManpower.length === 0) {
      console.log('⚠️  No eligible manpower found for creating users');
      return [];
    }

    console.log(`👥 Found ${eligibleManpower.length} eligible manpower for user creation`);

    const createdUsers = [];
    for (const manpower of eligibleManpower) {
      try {
        // Generate username from name
        const username = manpower.name
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '')
          .substring(0, 20);

        // Generate email from name and position
        const emailPrefix = manpower.name
          .toLowerCase()
          .split(' ')
          .slice(0, 2)
          .join('.')
          .replace(/[^a-z.]/g, '');
        
        const email = `${emailPrefix}@nusantara-group.co.id`;

        // Determine role based on position
        let role = 'supervisor';
        if (manpower.position.toLowerCase().includes('direktur')) {
          role = 'admin';
        } else if (manpower.position.toLowerCase().includes('project manager')) {
          role = 'project_manager';
        } else if (manpower.position.toLowerCase().includes('finance') || 
                   manpower.position.toLowerCase().includes('keuangan')) {
          role = 'finance_manager';
        } else if (manpower.position.toLowerCase().includes('hr') || 
                   manpower.position.toLowerCase().includes('sdm')) {
          role = 'hr_manager';
        } else if (manpower.position.toLowerCase().includes('inventory') || 
                   manpower.position.toLowerCase().includes('gudang')) {
          role = 'inventory_manager';
        } else if (manpower.position.toLowerCase().includes('senior') ||
                   manpower.position.toLowerCase().includes('kepala') ||
                   manpower.position.toLowerCase().includes('manager')) {
          role = 'supervisor';
        }

        // Create user
        const user = await User.create({
          id: `USR-${manpower.id}`, // Link to manpower ID
          username: username,
          email: email,
          password: '$2b$10$defaultpasswordhash', // Default hashed password
          role: role,
          profile: {
            manpowerId: manpower.id,
            fullName: manpower.name,
            position: manpower.position,
            department: manpower.department,
            subsidiaryId: manpower.subsidiaryId
          },
          isActive: true
        });

        createdUsers.push({
          user: user,
          manpower: manpower
        });

        console.log(`✅ Created user ${user.username} for ${manpower.name} (${manpower.position})`);
      } catch (error) {
        console.log(`⚠️  Skipped creating user for ${manpower.name}: ${error.message}`);
      }
    }

    console.log(`✅ Created ${createdUsers.length} users from manpower`);
    return createdUsers;
  } catch (error) {
    console.error('❌ Error creating users from manpower:', error);
    return [];
  }
}

// Function to assign project managers from created users
async function assignProjectManagers(projectsData) {
  // First, create users from eligible manpower
  const createdUsers = await createUsersFromManpower();
  
  if (createdUsers.length === 0) {
    console.log('⚠️  No users created, projects will have no project managers');
    return projectsData.map(project => ({
      ...project,
      projectManagerId: null
    }));
  }

  console.log(`🔍 Available ${createdUsers.length} users for project management`);

  // Assign project managers to projects based on best practices
  const assignedProjects = projectsData.map(project => {
    // Priority 1: Find project managers from same subsidiary
    let compatibleUsers = createdUsers.filter(userInfo => 
      userInfo.manpower.subsidiaryId === project.subsidiaryId &&
      (userInfo.manpower.position.toLowerCase().includes('project manager') ||
       userInfo.manpower.position.toLowerCase().includes('direktur'))
    );

    // Priority 2: Find any manager from same subsidiary
    if (compatibleUsers.length === 0) {
      compatibleUsers = createdUsers.filter(userInfo => 
        userInfo.manpower.subsidiaryId === project.subsidiaryId &&
        (userInfo.manpower.position.toLowerCase().includes('manager') ||
         userInfo.manpower.position.toLowerCase().includes('kepala'))
      );
    }

    // Priority 3: Find directors from parent company (NU006)
    if (compatibleUsers.length === 0) {
      compatibleUsers = createdUsers.filter(userInfo => 
        userInfo.manpower.subsidiaryId === 'NU006' &&
        userInfo.manpower.position.toLowerCase().includes('direktur')
      );
    }

    // Priority 4: Any senior manager from any subsidiary
    if (compatibleUsers.length === 0) {
      compatibleUsers = createdUsers.filter(userInfo => 
        userInfo.manpower.position.toLowerCase().includes('senior') ||
        userInfo.manpower.position.toLowerCase().includes('project manager')
      );
    }

    if (compatibleUsers.length > 0) {
      const selectedUser = compatibleUsers[Math.floor(Math.random() * compatibleUsers.length)];
      console.log(`👤 Assigned PM ${selectedUser.user.username} (${selectedUser.manpower.name}) to project ${project.name}`);
      
      return {
        ...project,
        projectManagerId: selectedUser.user.id,
        selectedProjectManager: selectedUser.manpower
      };
    }

    console.log(`⚠️  No suitable project manager found for ${project.name}`);
    return {
      ...project,
      projectManagerId: null
    };
  });

  return assignedProjects;
}

// Function to assign team members from manpower data
async function assignTeamMembers(projectsData) {
  const allManpower = await Manpower.findAll();

  if (allManpower.length === 0) {
    console.log('⚠️  No manpower data found');
    return projectsData;
  }

  const assignedProjects = projectsData.map(project => {
    // Get manpower from same subsidiary or general subsidiary
    const subsidiaryManpower = allManpower.filter(mp => 
      mp.subsidiaryId === project.subsidiaryId || mp.subsidiaryId === 'NU006'
    );

    // Start team with project manager if assigned
    let team = [];
    if (project.selectedProjectManager) {
      team.push({
        id: project.selectedProjectManager.id,
        name: project.selectedProjectManager.name,
        position: project.selectedProjectManager.position,
        department: project.selectedProjectManager.department,
        role: 'Project Manager',
        isProjectManager: true
      });
      console.log(`👤 Added ${project.selectedProjectManager.name} as Project Manager`);
    }
    
    // Select 3-5 additional team members (excluding the PM)
    const availableManpower = subsidiaryManpower.filter(mp => 
      !project.selectedProjectManager || mp.id !== project.selectedProjectManager.id
    );
    
    const teamSize = Math.min(Math.floor(Math.random() * 3) + 3, availableManpower.length);
    const selectedTeam = availableManpower
      .sort(() => 0.5 - Math.random())
      .slice(0, teamSize)
      .map(member => ({
        id: member.id,
        name: member.name,
        position: member.position,
        department: member.department,
        role: getProjectRole(member.position, project.subsidiaryInfo.specialization),
        isProjectManager: false
      }));

    team.push(...selectedTeam);

    console.log(`👥 Assigned ${team.length} team members to ${project.name}`);
    return {
      ...project,
      team: team,
      selectedProjectManager: undefined // Remove temporary field
    };
  });

  return assignedProjects;
}

// Helper function to determine project role based on position and specialization
function getProjectRole(position, specialization) {
  const roleMapping = {
    'Direktur Utama': 'Project Sponsor',
    'Direktur Operasional': 'Project Director',
    'Direktur Teknik': 'Technical Director',
    'Project Manager': 'Project Manager',
    'Senior Project Manager': 'Project Manager',
    'Civil Engineer': 'Site Engineer',
    'Senior Civil Engineer': 'Chief Engineer',
    'Architect': 'Design Coordinator',
    'Senior Architect': 'Design Manager',
    'Interior Designer': 'Interior Specialist',
    'Quantity Surveyor': 'Cost Controller',
    'Safety Officer': 'HSE Officer',
    'Site Supervisor': 'Field Supervisor',
    'Construction Foreman': 'Construction Supervisor'
  };

  return roleMapping[position] || 'Team Member';
}

// Main seeder function
async function seedNusantaraProjects() {
  try {
    console.log('🏗️  Starting NUSANTARA GROUP projects seeding...');
    
    // Clear existing projects
    console.log('🗑️  Clearing existing projects...');
    const deletedCount = await Project.destroy({
      where: {},
      force: true
    });
    console.log(`✅ Cleared ${deletedCount} existing projects`);
    
    // Verify subsidiaries and manpower exist
    const subsidiaries = await Subsidiary.findAll({
      attributes: ['id', 'name', 'code', 'specialization']
    });
    
    const manpowerCount = await Manpower.count();
    
    if (subsidiaries.length === 0) {
      throw new Error('No subsidiaries found! Please seed subsidiaries first.');
    }

    console.log(`📊 Found ${subsidiaries.length} subsidiaries and ${manpowerCount} manpower records`);
    
    // Assign project managers and team members
    console.log('👥 Assigning project managers and team members...');
    let enrichedProjects = await assignProjectManagers(projectsData);
    enrichedProjects = await assignTeamMembers(enrichedProjects);
    
    // Create projects
    console.log('📝 Creating projects...');
    const createdProjects = [];
    
    for (const projectData of enrichedProjects) {
      try {
        const project = await Project.create(projectData);
        createdProjects.push(project);
        
        const subsidiary = subsidiaries.find(s => s.id === project.subsidiaryId);
        console.log(`✅ Created: ${project.name} (${subsidiary.code}) - ${project.clientName}`);
      } catch (error) {
        console.error(`❌ Failed to create ${projectData.name}:`, error.message);
      }
    }
    
    console.log('\n🎉 PROJECTS SEEDING COMPLETED!');
    console.log(`📊 Total projects created: ${createdProjects.length}`);
    
    // Summary by type
    const privateProjects = createdProjects.filter(p => !p.tags.includes('pemerintah'));
    const governmentProjects = createdProjects.filter(p => p.tags.includes('pemerintah'));
    
    console.log(`💼 Private projects: ${privateProjects.length} (${Math.round(privateProjects.length/createdProjects.length*100)}%)`);
    console.log(`🏛️  Government projects: ${governmentProjects.length} (${Math.round(governmentProjects.length/createdProjects.length*100)}%)`);
    
    // Summary by budget
    const totalBudget = createdProjects.reduce((sum, p) => sum + parseFloat(p.budget || 0), 0);
    console.log(`💰 Total project value: Rp ${(totalBudget/1000000000).toFixed(1)} Miliar`);
    
    // Summary by subsidiary
    console.log('\n📋 PROJECTS BY SUBSIDIARY:');
    subsidiaries.forEach(sub => {
      const subProjects = createdProjects.filter(p => p.subsidiaryId === sub.id);
      if (subProjects.length > 0) {
        console.log(`\n${sub.name} (${sub.code}) - ${sub.specialization}:`);
        subProjects.forEach((proj, index) => {
          const budgetMiliar = (parseFloat(proj.budget || 0) / 1000000000).toFixed(1);
          console.log(`  ${index + 1}. ${proj.name} - Rp ${budgetMiliar}M`);
        });
      }
    });
    
    console.log('\n✅ All NUSANTARA GROUP projects have been successfully created!');
    
    return {
      success: true,
      totalCreated: createdProjects.length,
      privateProjects: privateProjects.length,
      governmentProjects: governmentProjects.length,
      totalBudget: totalBudget,
      data: createdProjects
    };
    
  } catch (error) {
    console.error('❌ Error during projects seeding:', error);
    throw error;
  }
}

// Export functions
module.exports = {
  seedNusantaraProjects,
  projectsData,
  assignProjectManagers,
  assignTeamMembers
};

// Run seeder if called directly
if (require.main === module) {
  seedNusantaraProjects()
    .then(result => {
      console.log('✅ Projects seeding completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Projects seeding failed:', error);
      process.exit(1);
    });
}
