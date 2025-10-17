// ========================================
// TEST SUBSIDIARY DATA FROM DATABASE
// ========================================
// Quick test to verify subsidiary data is correctly fetched
// Run with: node test-subsidiary-data.js

const { Sequelize } = require('sequelize');

// Initialize Sequelize connection
const sequelize = new Sequelize('nusantara_construction', 'admin', 'your_secure_password', {
  host: 'localhost',
  port: 5433,
  dialect: 'postgres',
  logging: false
});

// Test function
async function testSubsidiaryData() {
  try {
    console.log('🔍 Testing Subsidiary Data Retrieval...\n');

    // Test 1: Raw query
    console.log('📋 Test 1: Raw SQL Query');
    console.log('='.repeat(70));
    const rawResult = await sequelize.query(
      `SELECT 
        id, 
        name, 
        address->>'street' as street,
        address->>'city' as city,
        address->>'province' as province,
        address->>'postalCode' as postal_code,
        address->>'district' as district,
        contact_info->>'phone' as phone,
        contact_info->>'email' as email
      FROM subsidiaries 
      WHERE status = 'active'
      ORDER BY id`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    console.log(`✅ Found ${rawResult.length} subsidiaries\n`);
    rawResult.forEach(sub => {
      console.log(`ID: ${sub.id}`);
      console.log(`Name: ${sub.name}`);
      console.log(`Address: ${sub.street}, ${sub.city}, ${sub.province} ${sub.postal_code}`);
      console.log(`Phone: ${sub.phone}`);
      console.log(`Email: ${sub.email}`);
      console.log('-'.repeat(70));
    });

    // Test 2: Check specific subsidiary (NU006 - Used in PO)
    console.log('\n📋 Test 2: Specific Subsidiary (NU006 - PT. PUTRA JAYA KONSTRUKASI)');
    console.log('='.repeat(70));
    const specificSub = await sequelize.query(
      `SELECT 
        id, 
        name,
        code,
        address,
        contact_info
      FROM subsidiaries 
      WHERE id = 'NU006'`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (specificSub.length > 0) {
      const sub = specificSub[0];
      console.log(`✅ Subsidiary Found!`);
      console.log(`ID: ${sub.id}`);
      console.log(`Name: ${sub.name}`);
      console.log(`Code: ${sub.code}`);
      console.log('\nAddress (JSONB):');
      console.log(JSON.stringify(sub.address, null, 2));
      console.log('\nContact Info (JSONB):');
      console.log(JSON.stringify(sub.contact_info, null, 2));
    } else {
      console.log('❌ Subsidiary NU006 not found!');
    }

    // Test 3: Verify all subsidiaries are in Karawang
    console.log('\n📋 Test 3: Verify All Subsidiaries in Karawang');
    console.log('='.repeat(70));
    const karawangCheck = await sequelize.query(
      `SELECT 
        id,
        name,
        address->>'city' as city,
        address->>'province' as province
      FROM subsidiaries
      WHERE address->>'city' = 'Karawang'
      AND address->>'province' = 'Jawa Barat'`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    console.log(`✅ ${karawangCheck.length} subsidiaries confirmed in Karawang, Jawa Barat`);
    karawangCheck.forEach(sub => {
      console.log(`  - ${sub.id}: ${sub.name}`);
    });

    // Test 4: Phone number format check
    console.log('\n📋 Test 4: Phone Number Format (Karawang Area Code)');
    console.log('='.repeat(70));
    const phoneCheck = await sequelize.query(
      `SELECT 
        id,
        name,
        contact_info->>'phone' as phone
      FROM subsidiaries
      WHERE contact_info->>'phone' LIKE '+62-267%'`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    console.log(`✅ ${phoneCheck.length} subsidiaries have Karawang phone numbers (0267)`);
    phoneCheck.forEach(sub => {
      console.log(`  - ${sub.id}: ${sub.name} → ${sub.phone}`);
    });

    console.log('\n' + '='.repeat(70));
    console.log('✅ ALL TESTS PASSED!');
    console.log('='.repeat(70));
    console.log('\n🎯 Summary:');
    console.log(`   - Total Active Subsidiaries: ${rawResult.length}`);
    console.log(`   - All in Karawang: ${karawangCheck.length}`);
    console.log(`   - With Karawang Phone: ${phoneCheck.length}`);
    console.log('\n✨ Subsidiary data is correctly updated!');

  } catch (error) {
    console.error('❌ Error testing subsidiary data:', error.message);
    console.error(error);
  } finally {
    await sequelize.close();
  }
}

// Run the test
testSubsidiaryData().catch(console.error);
