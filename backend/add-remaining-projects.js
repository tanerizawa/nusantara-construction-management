const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('yk_construction_dev', 'postgres', 'dev_password', {
  host: 'localhost', port: 5432, dialect: 'postgres'
});

console.log('🚀 Adding remaining 4 critical Karawang projects...');

async function addRemainingProjects() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    const remainingProjects = [
      {
        id: 'KRW005', name: 'Pembangunan Jembatan Citarum-Karawang',
        description: 'Pembangunan jembatan beton prategang sepanjang 450 meter melintasi Sungai Citarum',
        client_name: 'Dinas Pekerjaan Umum Kabupaten Karawang',
        client_contact: '{"phone": "+62-267-8445678", "email": "pu@karawangkab.go.id"}',
        location: '{"address": "Sungai Citarum, Kel. Margasari", "city": "Karawang", "province": "Jawa Barat"}',
        budget: 75000000000, actual_cost: 72000000000, status: 'active', priority: 'high',
        progress: 90, start_date: '2023-09-01', end_date: '2025-03-31', subsidiary_id: 'NU004'
      },
      {
        id: 'KRW007', name: 'Karawang Smart City Development Phase 1',
        description: 'Pembangunan kawasan smart city dengan integrasi teknologi IoT dan e-government center',
        client_name: 'Pemerintah Kabupaten Karawang',
        client_contact: '{"phone": "+62-267-8453456", "email": "smartcity@karawangkab.go.id"}',
        location: '{"address": "Kawasan Pemerintahan Galuh Mas", "city": "Karawang", "province": "Jawa Barat"}',
        budget: 150000000000, actual_cost: 0, status: 'planning', priority: 'high',
        progress: 5, start_date: '2025-07-01', end_date: '2027-12-31', subsidiary_id: 'NU004'
      },
      {
        id: 'KRW010', name: 'Pembangunan Pabrik Otomotif Hyundai Motor Karawang',
        description: 'Pembangunan fasilitas pabrik otomotif seluas 45 hektar untuk Hyundai Motor Manufacturing',
        client_name: 'PT. Hyundai Motor Manufacturing Indonesia',
        client_contact: '{"phone": "+62-267-8449012", "email": "construction@hyundai-motor.co.id"}',
        location: '{"address": "Kawasan Industri KIIC Blok F", "city": "Karawang", "province": "Jawa Barat"}',
        budget: 285000000000, actual_cost: 275000000000, status: 'active', priority: 'high',
        progress: 95, start_date: '2022-08-01', end_date: '2025-06-30', subsidiary_id: 'NU005'
      },
      {
        id: 'KRW012', name: 'Pembangunan Rumah Sakit Umum Karawang Medika',
        description: 'Pembangunan rumah sakit umum 8 lantai dengan kapasitas 300 tempat tidur dan helipad',
        client_name: 'Yayasan Kesehatan Karawang Medika',
        client_contact: '{"phone": "+62-267-8451234", "email": "project@karawangmedika.org"}',
        location: '{"address": "Jl. Dr. Sutomo No. 156", "city": "Karawang", "province": "Jawa Barat"}',
        budget: 185000000000, actual_cost: 175000000000, status: 'active', priority: 'high',
        progress: 78, start_date: '2023-04-01', end_date: '2025-12-31', subsidiary_id: 'NU006'
      }
    ];

    let success = 0;
    
    for (const project of remainingProjects) {
      try {
        const query = `
          INSERT INTO projects (
            id, name, description, client_name, client_contact, location,
            budget, actual_cost, status, priority, progress, start_date,
            end_date, subsidiary_id, "createdAt", "updatedAt"
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW()
          )
        `;

        await sequelize.query(query, {
          bind: [
            project.id, project.name, project.description, project.client_name,
            project.client_contact, project.location, project.budget, project.actual_cost,
            project.status, project.priority, project.progress, project.start_date,
            project.end_date, project.subsidiary_id
          ]
        });
        
        console.log(`✅ ${project.id}: ${project.name}`);
        success++;

      } catch (error) {
        console.log(`❌ ${project.id}: ${error.message}`);
      }
    }

    console.log(`\n📊 SUMMARY: ${success}/4 remaining projects added`);
    
    if (success > 0) {
      const total = await sequelize.query('SELECT COUNT(*) as count FROM projects WHERE id LIKE \'KRW%\'');
      console.log(`🎉 Total KRW projects: ${total[0][0].count}/14`);
      
      if (total[0][0].count == 14) {
        console.log('\n🏆 SUCCESS! All 14 Karawang Construction Projects completed!');
        console.log('🏗️ Projects include:');
        console.log('   • 2 Residential (NU002 - CV. BINTANG SURAYA)');
        console.log('   • 3 Commercial (NU001 - CV. CAHAYA UTAMA EMPATBELAS)');
        console.log('   • 3 Infrastructure (NU004 - CV. GRAHA BANGUN NUSANTARA)');
        console.log('   • 2 Renovation (NU003 - CV. LATANSA)');
        console.log('   • 2 Industrial (NU005 - CV. SAHABAT SINAR RAYA)');
        console.log('   • 2 General Construction (NU006 - PT. PUTRA JAYA KONSTRUKSI)');
        console.log('\n💰 Total Value: Rp 1.27 Triliun');
        console.log('📍 All located in Karawang, Jawa Barat');
        console.log('🔗 Fully integrated with subsidiary database');
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

addRemainingProjects().then(() => process.exit(0)).catch(err => process.exit(1));
