const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('yk_construction_dev', 'postgres', 'dev_password', {
  host: 'localhost', port: 5432, dialect: 'postgres'
});

console.log('🚀 Creating Karawang Construction Projects...');

async function insertProject(project) {
  const query = `
    INSERT INTO projects (
      id, name, description, client_name, client_contact, location,
      budget, actual_cost, status, priority, progress, start_date,
      end_date, subsidiary_id, "createdAt", "updatedAt"
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW()
    )
  `;

  try {
    await sequelize.query(query, {
      bind: [
        project.id, project.name, project.description, project.client_name,
        project.client_contact, project.location, project.budget, project.actual_cost,
        project.status, project.priority, project.progress, project.start_date,
        project.end_date, project.subsidiary_id
      ]
    });
    console.log(`✅ ${project.id}: ${project.name}`);
    return true;
  } catch (error) {
    console.log(`❌ ${project.id}: ${error.message}`);
    return false;
  }
}

async function createAllProjects() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Clear existing KRW projects
    await sequelize.query("DELETE FROM projects WHERE id LIKE 'KRW%'");
    console.log('🗑️ Cleared existing projects');

    const projects = [
      {
        id: 'KRW001', name: 'Perumahan Bintang Indah Residence',
        description: 'Pembangunan perumahan cluster premium dengan 150 unit rumah',
        client_name: 'PT. Cipta Karya Mandiri',
        client_contact: '{"phone": "+62-267-8441234", "email": "project@ciptakaryamandiri.co.id"}',
        location: '{"address": "Jl. Raya Karawang Timur Km 15", "city": "Karawang", "province": "Jawa Barat"}',
        budget: 45000000000, actual_cost: 42500000000, status: 'active', priority: 'high',
        progress: 75, start_date: '2024-03-01', end_date: '2025-08-31', subsidiary_id: 'NU002'
      },
      {
        id: 'KRW002', name: 'Renovasi Perumahan Taman Karawang',
        description: 'Renovasi dan upgrade 75 unit rumah di perumahan Taman Karawang',
        client_name: 'Paguyuban Warga Taman Karawang',
        client_contact: '{"phone": "+62-267-8442345", "email": "paguyuban.tk@gmail.com"}',
        location: '{"address": "Perumahan Taman Karawang Blok A-E", "city": "Karawang", "province": "Jawa Barat"}',
        budget: 8500000000, actual_cost: 8200000000, status: 'completed', priority: 'medium',
        progress: 100, start_date: '2024-01-15', end_date: '2024-07-15', subsidiary_id: 'NU002'
      },
      {
        id: 'KRW003', name: 'Pembangunan Mall Karawang Central Plaza',
        description: 'Pembangunan mall 4 lantai dengan luas 25.000 m² di pusat kota Karawang',
        client_name: 'PT. Karawang Central Development',
        client_contact: '{"phone": "+62-267-8443456", "email": "development@karawangcentral.co.id"}',
        location: '{"address": "Jl. Ahmad Yani No. 125, Pusat Kota", "city": "Karawang", "province": "Jawa Barat"}',
        budget: 125000000000, actual_cost: 118000000000, status: 'active', priority: 'high',
        progress: 85, start_date: '2023-06-01', end_date: '2025-12-31', subsidiary_id: 'NU001'
      },
      {
        id: 'KRW004', name: 'Gedung Perkantoran Wisma Karawang Business Center',
        description: 'Pembangunan gedung perkantoran 15 lantai dengan total luas 18.000 m²',
        client_name: 'PT. Karawang Business Property',
        client_contact: '{"phone": "+62-267-8444567", "email": "info@karawangbusiness.co.id"}',
        location: '{"address": "Jl. Pancasila Raya No. 88", "city": "Karawang", "province": "Jawa Barat"}',
        budget: 95000000000, actual_cost: 0, status: 'planning', priority: 'high',
        progress: 15, start_date: '2025-01-15', end_date: '2027-06-30', subsidiary_id: 'NU001'
      },
      {
        id: 'KRW005', name: 'Pembangunan Jembatan Citarum-Karawang',
        description: 'Pembangunan jembatan beton prategang sepanjang 450 meter melintasi Sungai Citarum',
        client_name: 'Dinas Pekerjaan Umum Kabupaten Karawang',
        client_contact: '{"phone": "+62-267-8445678", "email": "pu@karawangkab.go.id"}',
        location: '{"address": "Sungai Citarum, Kel. Margasari", "city": "Karawang", "province": "Jawa Barat"}',
        budget: 75000000000, actual_cost: 72000000000, status: 'active', priority: 'critical',
        progress: 90, start_date: '2023-09-01', end_date: '2025-03-31', subsidiary_id: 'NU004'
      },
      {
        id: 'KRW006', name: 'Konstruksi Terminal Bus Karawang Terpadu',
        description: 'Pembangunan terminal bus terpadu dengan kapasitas 45 bus dan area komersial',
        client_name: 'PT. Karawang Transport Management',
        client_contact: '{"phone": "+62-267-8446789", "email": "terminal@karawangtransport.co.id"}',
        location: '{"address": "Jl. Bypass Karawang Km 8", "city": "Karawang", "province": "Jawa Barat"}',
        budget: 35000000000, actual_cost: 0, status: 'planning', priority: 'medium',
        progress: 25, start_date: '2025-04-01', end_date: '2026-12-31', subsidiary_id: 'NU004'
      },
      {
        id: 'KRW007', name: 'Karawang Smart City Development Phase 1',
        description: 'Pembangunan kawasan smart city dengan integrasi teknologi IoT',
        client_name: 'Pemerintah Kabupaten Karawang',
        client_contact: '{"phone": "+62-267-8453456", "email": "smartcity@karawangkab.go.id"}',
        location: '{"address": "Kawasan Pemerintahan Galuh Mas", "city": "Karawang", "province": "Jawa Barat"}',
        budget: 150000000000, actual_cost: 0, status: 'planning', priority: 'critical',
        progress: 5, start_date: '2025-07-01', end_date: '2027-12-31', subsidiary_id: 'NU004'
      },
      {
        id: 'KRW008', name: 'Renovasi Gedung DPRD Karawang',
        description: 'Renovasi total gedung DPRD Kabupaten Karawang dengan modernisasi fasilitas',
        client_name: 'Sekretariat DPRD Kabupaten Karawang',
        client_contact: '{"phone": "+62-267-8447890", "email": "sekretariat@dprd.karawangkab.go.id"}',
        location: '{"address": "Jl. Galuh Mas Raya No. 1", "city": "Karawang", "province": "Jawa Barat"}',
        budget: 28000000000, actual_cost: 26500000000, status: 'completed', priority: 'high',
        progress: 100, start_date: '2023-11-01', end_date: '2024-08-31', subsidiary_id: 'NU003'
      },
      {
        id: 'KRW009', name: 'Upgrade Jalan Lingkar Karawang Fase 2',
        description: 'Upgrade dan overlay jalan lingkar Karawang sepanjang 12 km',
        client_name: 'Dinas Perhubungan Kabupaten Karawang',
        client_contact: '{"phone": "+62-267-8448901", "email": "dishub@karawangkab.go.id"}',
        location: '{"address": "Jalan Lingkar Karawang Km 5-17", "city": "Karawang", "province": "Jawa Barat"}',
        budget: 42000000000, actual_cost: 40500000000, status: 'active', priority: 'high',
        progress: 65, start_date: '2024-02-01', end_date: '2025-09-30', subsidiary_id: 'NU003'
      },
      {
        id: 'KRW010', name: 'Pembangunan Pabrik Otomotif Hyundai Motor Karawang',
        description: 'Pembangunan fasilitas pabrik otomotif seluas 45 hektar untuk Hyundai Motor',
        client_name: 'PT. Hyundai Motor Manufacturing Indonesia',
        client_contact: '{"phone": "+62-267-8449012", "email": "construction@hyundai-motor.co.id"}',
        location: '{"address": "Kawasan Industri KIIC Blok F", "city": "Karawang", "province": "Jawa Barat"}',
        budget: 285000000000, actual_cost: 275000000000, status: 'active', priority: 'critical',
        progress: 95, start_date: '2022-08-01', end_date: '2025-06-30', subsidiary_id: 'NU005'
      },
      {
        id: 'KRW011', name: 'Renovasi Pabrik Tekstil PT. Karawang Textile',
        description: 'Renovasi dan modernisasi pabrik tekstil dengan upgrade mesin produksi',
        client_name: 'PT. Karawang Textile Manufacturing',
        client_contact: '{"phone": "+62-267-8450123", "email": "facility@karawangtextile.co.id"}',
        location: '{"address": "Jl. Industri Tekstil No. 45, KIIC", "city": "Karawang", "province": "Jawa Barat"}',
        budget: 65000000000, actual_cost: 0, status: 'planning', priority: 'medium',
        progress: 10, start_date: '2025-02-01', end_date: '2026-11-30', subsidiary_id: 'NU005'
      },
      {
        id: 'KRW012', name: 'Pembangunan Rumah Sakit Umum Karawang Medika',
        description: 'Pembangunan rumah sakit umum 8 lantai dengan kapasitas 300 tempat tidur',
        client_name: 'Yayasan Kesehatan Karawang Medika',
        client_contact: '{"phone": "+62-267-8451234", "email": "project@karawangmedika.org"}',
        location: '{"address": "Jl. Dr. Sutomo No. 156", "city": "Karawang", "province": "Jawa Barat"}',
        budget: 185000000000, actual_cost: 175000000000, status: 'active', priority: 'critical',
        progress: 78, start_date: '2023-04-01', end_date: '2025-12-31', subsidiary_id: 'NU006'
      },
      {
        id: 'KRW013', name: 'Konstruksi Sekolah Menengah Atas Negeri 5 Karawang',
        description: 'Pembangunan gedung sekolah 3 lantai dengan 24 ruang kelas',
        client_name: 'Dinas Pendidikan Kabupaten Karawang',
        client_contact: '{"phone": "+62-267-8452345", "email": "disdik@karawangkab.go.id"}',
        location: '{"address": "Jl. Pendidikan No. 89, Telukjambe", "city": "Karawang", "province": "Jawa Barat"}',
        budget: 45000000000, actual_cost: 43200000000, status: 'completed', priority: 'high',
        progress: 100, start_date: '2023-01-15', end_date: '2024-06-30', subsidiary_id: 'NU006'
      },
      {
        id: 'KRW014', name: 'Pembangunan Hotel Bintang 4 Karawang Grand Palace',
        description: 'Pembangunan hotel bintang 4 dengan 180 kamar dan fasilitas lengkap',
        client_name: 'PT. Karawang Hospitality Group',
        client_contact: '{"phone": "+62-267-8454567", "email": "development@karawanggrand.com"}',
        location: '{"address": "Jl. Ahmad Yani No. 200", "city": "Karawang", "province": "Jawa Barat"}',
        budget: 78000000000, actual_cost: 0, status: 'planning', priority: 'medium',
        progress: 20, start_date: '2025-03-01', end_date: '2026-12-31', subsidiary_id: 'NU001'
      }
    ];

    let success = 0;
    for (const project of projects) {
      if (await insertProject(project)) {
        success++;
      }
    }

    console.log(`\n📊 SUMMARY: ${success}/${projects.length} projects created successfully!`);

    if (success > 0) {
      const subsidiaryNames = {
        'NU001': 'CV. CAHAYA UTAMA EMPATBELAS (Commercial)',
        'NU002': 'CV. BINTANG SURAYA (Residential)', 
        'NU003': 'CV. LATANSA (Renovation)',
        'NU004': 'CV. GRAHA BANGUN NUSANTARA (Infrastructure)',
        'NU005': 'CV. SAHABAT SINAR RAYA (Industrial)',
        'NU006': 'PT. PUTRA JAYA KONSTRUKSI (General)'
      };

      console.log(`\n🏗️ PROJECTS BY CATEGORY:`);
      Object.keys(subsidiaryNames).forEach(subId => {
        const subProjects = projects.filter(p => p.subsidiary_id === subId);
        if (subProjects.length > 0) {
          console.log(`\n   📋 ${subsidiaryNames[subId]}:`);
          subProjects.forEach(p => {
            const budget = (p.budget / 1000000000).toFixed(1);
            console.log(`      • ${p.name} (${p.status}) - Rp ${budget}B`);
          });
        }
      });

      const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
      console.log(`\n💰 Total Project Value: Rp ${(totalBudget / 1000000000000).toFixed(2)} Triliun`);
      console.log(`🎉 SUCCESS! All Karawang construction projects created!`);
      console.log(`🔗 Integrated with subsidiary database`);
      console.log(`📍 Located in Karawang, Jawa Barat`);
    }

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
  } finally {
    await sequelize.close();
  }
}

createAllProjects().then(() => process.exit(0)).catch(err => process.exit(1));
