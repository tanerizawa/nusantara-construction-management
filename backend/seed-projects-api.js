const axios = require('axios');

// Base URL untuk API
const BASE_URL = 'http://localhost:5000/api';

// Data proyek Karawang yang realistis
const projectsData = [
  // RESIDENTIAL PROJECTS - CV. BINTANG SURAYA (BSR)
  {
    id: "KRW001",
    name: "Perumahan Bintang Indah Residence",
    description: "Pembangunan perumahan cluster premium dengan 150 unit rumah tipe 36-70 di kawasan strategis Karawang Timur. Dilengkapi fasilitas taman bermain, security 24 jam, dan akses mudah ke TOL.",
    clientName: "PT. Cipta Karya Mandiri",
    clientContact: {
      phone: "+62-267-8441234",
      email: "project@ciptakaryamandiri.co.id"
    },
    location: {
      address: "Jl. Raya Karawang Timur Km 15",
      city: "Karawang",
      province: "Jawa Barat"
    },
    budget: 45000000000,
    actualCost: 42500000000,
    status: "active",
    priority: "high",
    progress: 75,
    startDate: "2024-03-01",
    endDate: "2025-08-31",
    subsidiaryId: "NU002"
  },
  {
    id: "KRW002", 
    name: "Renovasi Perumahan Taman Karawang",
    description: "Renovasi dan upgrade 75 unit rumah di perumahan Taman Karawang meliputi perbaikan atap, pengecatan ulang, modernisasi instalasi listrik dan plumbing.",
    clientName: "Paguyuban Warga Taman Karawang",
    clientContact: {
      phone: "+62-267-8442345",
      email: "paguyuban.tk@gmail.com"
    },
    location: {
      address: "Perumahan Taman Karawang Blok A-E",
      city: "Karawang",
      province: "Jawa Barat"
    },
    budget: 8500000000,
    actualCost: 8200000000,
    status: "completed",
    priority: "medium",
    progress: 100,
    startDate: "2024-01-15",
    endDate: "2024-07-15",
    subsidiaryId: "NU002"
  },

  // COMMERCIAL PROJECTS - CV. CAHAYA UTAMA EMPATBELAS (CUE14)
  {
    id: "KRW003",
    name: "Pembangunan Mall Karawang Central Plaza",
    description: "Pembangunan mall 4 lantai dengan luas 25.000 m² di pusat kota Karawang. Dilengkapi dengan food court, bioskop, supermarket, dan 200 tenant retail.",
    clientName: "PT. Karawang Central Development",
    clientContact: {
      phone: "+62-267-8443456",
      email: "development@karawangcentral.co.id"
    },
    location: {
      address: "Jl. Ahmad Yani No. 125, Pusat Kota",
      city: "Karawang",
      province: "Jawa Barat"
    },
    budget: 125000000000,
    actualCost: 118000000000,
    status: "active",
    priority: "high",
    progress: 85,
    startDate: "2023-06-01",
    endDate: "2025-12-31",
    subsidiaryId: "NU001"
  },
  {
    id: "KRW004",
    name: "Gedung Perkantoran Wisma Karawang Business Center",
    description: "Pembangunan gedung perkantoran 15 lantai dengan total luas 18.000 m². Fasilitas lengkap termasuk lobby mewah, lift penumpang & barang, generator backup, dan parking basement.",
    clientName: "PT. Karawang Business Property",
    clientContact: {
      phone: "+62-267-8444567",
      email: "info@karawangbusiness.co.id"
    },
    location: {
      address: "Jl. Pancasila Raya No. 88",
      city: "Karawang",
      province: "Jawa Barat"
    },
    budget: 95000000000,
    actualCost: 0,
    status: "planning",
    priority: "high",
    progress: 15,
    startDate: "2025-01-15",
    endDate: "2027-06-30",
    subsidiaryId: "NU001"
  },

  // INFRASTRUCTURE PROJECTS - CV. GRAHA BANGUN NUSANTARA (GBN)
  {
    id: "KRW005",
    name: "Pembangunan Jembatan Citarum-Karawang",
    description: "Pembangunan jembatan beton prategang sepanjang 450 meter dengan lebar 12 meter melintasi Sungai Citarum. Menghubungkan Karawang Barat dengan Karawang Timur.",
    clientName: "Dinas Pekerjaan Umum Kabupaten Karawang",
    clientContact: {
      phone: "+62-267-8445678",
      email: "pu@karawangkab.go.id"
    },
    location: {
      address: "Sungai Citarum, Kel. Margasari",
      city: "Karawang",
      province: "Jawa Barat"
    },
    budget: 75000000000,
    actualCost: 72000000000,
    status: "active",
    priority: "critical",
    progress: 90,
    startDate: "2023-09-01",
    endDate: "2025-03-31",
    subsidiaryId: "NU004"
  },
  {
    id: "KRW006",
    name: "Konstruksi Terminal Bus Karawang Terpadu",
    description: "Pembangunan terminal bus terpadu dengan kapasitas 45 bus, area komersial, ruang tunggu ber-AC, toilet modern, dan area parkir 300 kendaraan.",
    clientName: "PT. Karawang Transport Management",
    clientContact: {
      phone: "+62-267-8446789",
      email: "terminal@karawangtransport.co.id"
    },
    location: {
      address: "Jl. Bypass Karawang Km 8",
      city: "Karawang",
      province: "Jawa Barat"
    },
    budget: 35000000000,
    actualCost: 0,
    status: "planning",
    priority: "medium",
    progress: 25,
    startDate: "2025-04-01",
    endDate: "2026-12-31",
    subsidiaryId: "NU004"
  },

  // RENOVATION PROJECTS - CV. LATANSA (LTN)
  {
    id: "KRW007",
    name: "Renovasi Gedung DPRD Karawang",
    description: "Renovasi total gedung DPRD Kabupaten Karawang meliputi perbaikan struktur, modernisasi sistem kelistrikan, AC central, sistem audio visual, dan landscape taman.",
    clientName: "Sekretariat DPRD Kabupaten Karawang",
    clientContact: {
      phone: "+62-267-8447890",
      email: "sekretariat@dprd.karawangkab.go.id"
    },
    location: {
      address: "Jl. Galuh Mas Raya No. 1",
      city: "Karawang",
      province: "Jawa Barat"
    },
    budget: 28000000000,
    actualCost: 26500000000,
    status: "completed",
    priority: "high",
    progress: 100,
    startDate: "2023-11-01",
    endDate: "2024-08-31",
    subsidiaryId: "NU003"
  },
  {
    id: "KRW008",
    name: "Upgrade Jalan Lingkar Karawang Fase 2",
    description: "Upgrade dan overlay jalan lingkar Karawang sepanjang 12 km, perbaikan drainase, pembuatan trotoar, dan instalasi penerangan jalan LED.",
    clientName: "Dinas Perhubungan Kabupaten Karawang",
    clientContact: {
      phone: "+62-267-8448901",
      email: "dishub@karawangkab.go.id"
    },
    location: {
      address: "Jalan Lingkar Karawang Km 5-17",
      city: "Karawang",
      province: "Jawa Barat"
    },
    budget: 42000000000,
    actualCost: 40500000000,
    status: "active",
    priority: "high",
    progress: 65,
    startDate: "2024-02-01",
    endDate: "2025-09-30",
    subsidiaryId: "NU003"
  },

  // INDUSTRIAL PROJECTS - CV. SAHABAT SINAR RAYA (SSR)
  {
    id: "KRW009",
    name: "Pembangunan Pabrik Otomotif Hyundai Motor Karawang",
    description: "Pembangunan fasilitas pabrik otomotif seluas 45 hektar untuk Hyundai Motor Manufacturing. Termasuk building produksi, warehouse, utility building, dan infrastruktur pendukung.",
    clientName: "PT. Hyundai Motor Manufacturing Indonesia",
    clientContact: {
      phone: "+62-267-8449012",
      email: "construction@hyundai-motor.co.id"
    },
    location: {
      address: "Kawasan Industri KIIC Blok F",
      city: "Karawang",
      province: "Jawa Barat"
    },
    budget: 285000000000,
    actualCost: 275000000000,
    status: "active",
    priority: "critical",
    progress: 95,
    startDate: "2022-08-01",
    endDate: "2025-06-30",
    subsidiaryId: "NU005"
  },
  {
    id: "KRW010",
    name: "Renovasi Pabrik Tekstil PT. Karawang Textile",
    description: "Renovasi dan modernisasi pabrik tekstil meliputi upgrade mesin produksi, perbaikan sistem ventilasi, instalasi waste water treatment, dan penambahan kapasitas produksi.",
    clientName: "PT. Karawang Textile Manufacturing",
    clientContact: {
      phone: "+62-267-8450123",
      email: "facility@karawangtextile.co.id"
    },
    location: {
      address: "Jl. Industri Tekstil No. 45, KIIC",
      city: "Karawang",
      province: "Jawa Barat"
    },
    budget: 65000000000,
    actualCost: 0,
    status: "planning",
    priority: "medium",
    progress: 10,
    startDate: "2025-02-01",
    endDate: "2026-11-30",
    subsidiaryId: "NU005"
  },

  // GENERAL CONSTRUCTION - PT. PUTRA JAYA KONSTRUKSI (PJK)
  {
    id: "KRW011",
    name: "Pembangunan Rumah Sakit Umum Karawang Medika",
    description: "Pembangunan rumah sakit umum 8 lantai dengan kapasitas 300 tempat tidur. Dilengkapi ruang ICU, IGD, laboratorium, radiologi, apotek, dan helipad.",
    clientName: "Yayasan Kesehatan Karawang Medika",
    clientContact: {
      phone: "+62-267-8451234",
      email: "project@karawangmedika.org"
    },
    location: {
      address: "Jl. Dr. Sutomo No. 156",
      city: "Karawang",
      province: "Jawa Barat"
    },
    budget: 185000000000,
    actualCost: 175000000000,
    status: "active",
    priority: "critical",
    progress: 78,
    startDate: "2023-04-01",
    endDate: "2025-12-31",
    subsidiaryId: "NU006"
  },
  {
    id: "KRW012",
    name: "Konstruksi Sekolah Menengah Atas Negeri 5 Karawang",
    description: "Pembangunan gedung sekolah 3 lantai dengan 24 ruang kelas, laboratorium sains, perpustakaan, aula serbaguna, lapangan olahraga, dan kantin.",
    clientName: "Dinas Pendidikan Kabupaten Karawang",
    clientContact: {
      phone: "+62-267-8452345",
      email: "disdik@karawangkab.go.id"
    },
    location: {
      address: "Jl. Pendidikan No. 89, Telukjambe",
      city: "Karawang",
      province: "Jawa Barat"
    },
    budget: 45000000000,
    actualCost: 43200000000,
    status: "completed",
    priority: "high",
    progress: 100,
    startDate: "2023-01-15",
    endDate: "2024-06-30",
    subsidiaryId: "NU006"
  },

  // MIXED DEVELOPMENT PROJECTS
  {
    id: "KRW013",
    name: "Karawang Smart City Development Phase 1",
    description: "Pembangunan kawasan smart city dengan integrasi teknologi IoT, pembangunan gedung pemerintahan digital, e-government center, dan infrastruktur smart grid.",
    clientName: "Pemerintah Kabupaten Karawang",
    clientContact: {
      phone: "+62-267-8453456",
      email: "smartcity@karawangkab.go.id"
    },
    location: {
      address: "Kawasan Pemerintahan Galuh Mas",
      city: "Karawang",
      province: "Jawa Barat"
    },
    budget: 150000000000,
    actualCost: 0,
    status: "planning",
    priority: "critical",
    progress: 5,
    startDate: "2025-07-01",
    endDate: "2027-12-31",
    subsidiaryId: "NU004"
  },
  {
    id: "KRW014",
    name: "Pembangunan Hotel Bintang 4 Karawang Grand Palace",
    description: "Pembangunan hotel bintang 4 dengan 180 kamar, ballroom, meeting room, restaurant, spa, fitness center, dan swimming pool. Target pasar business dan leisure travelers.",
    clientName: "PT. Karawang Hospitality Group",
    clientContact: {
      phone: "+62-267-8454567",
      email: "development@karawanggrand.com"
    },
    location: {
      address: "Jl. Ahmad Yani No. 200",
      city: "Karawang",
      province: "Jawa Barat"
    },
    budget: 78000000000,
    actualCost: 0,
    status: "planning",
    priority: "medium",
    progress: 20,
    startDate: "2025-03-01",
    endDate: "2026-12-31",
    subsidiaryId: "NU001"
  }
];

// Fungsi untuk menunggu delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fungsi untuk membuat project menggunakan API
async function createProjectsViaAPI() {
  try {
    console.log('🚀 Starting Karawang Construction Projects Creation via API...');
    
    const createdProjects = [];
    const errors = [];

    for (let i = 0; i < projectsData.length; i++) {
      const project = projectsData[i];
      try {
        console.log(`📝 Creating project ${i + 1}/${projectsData.length}: ${project.name}`);
        
        const response = await axios.post(`${BASE_URL}/projects`, project, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 201) {
          createdProjects.push({
            id: project.id,
            name: project.name,
            subsidiaryId: project.subsidiaryId,
            status: project.status,
            budget: (project.budget / 1000000000).toFixed(1) + 'B'
          });
          console.log(`   ✅ Success: ${project.name}`);
        }

        // Delay singkat untuk menghindari overload
        await delay(100);

      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        errors.push({
          id: project.id,
          name: project.name,
          error: errorMessage
        });
        console.log(`   ❌ Failed: ${project.name} - ${errorMessage}`);
      }
    }

    // Tampilkan hasil
    console.log(`\n📊 CREATION SUMMARY:`);
    console.log(`   ✅ Successfully created: ${createdProjects.length} projects`);
    console.log(`   ❌ Failed: ${errors.length} projects`);

    if (createdProjects.length > 0) {
      console.log(`\n🎉 CREATED PROJECTS:`);
      // Group by subsidiary
      const projectsBySubsidiary = {};
      createdProjects.forEach(project => {
        if (!projectsBySubsidiary[project.subsidiaryId]) {
          projectsBySubsidiary[project.subsidiaryId] = [];
        }
        projectsBySubsidiary[project.subsidiaryId].push(project);
      });

      Object.keys(projectsBySubsidiary).forEach(subsidiaryId => {
        console.log(`\n   📋 Subsidiary ${subsidiaryId}:`);
        projectsBySubsidiary[subsidiaryId].forEach(project => {
          console.log(`      • ${project.name} (${project.status}) - Rp ${project.budget}`);
        });
      });

      // Calculate total budget
      const totalBudget = projectsData.reduce((sum, project) => sum + project.budget, 0);
      console.log(`\n   💰 Total Budget: Rp ${(totalBudget / 1000000000000).toFixed(2)} Triliun`);
    }

    if (errors.length > 0) {
      console.log(`\n❌ ERRORS:`);
      errors.forEach(error => {
        console.log(`   • ${error.name}: ${error.error}`);
      });
    }

    console.log('\n🏗️ Karawang Construction Projects creation completed!');
    console.log('🔗 All projects integrated with subsidiary database');
    
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    throw error;
  }
}

// Jalankan seeding
if (require.main === module) {
  createProjectsViaAPI()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { createProjectsViaAPI, projectsData };
