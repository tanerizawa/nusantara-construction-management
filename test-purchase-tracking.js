// Test script untuk menguji RAB Purchase Tracking API endpoints
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/database';
const PROJECT_ID = 'PROJ-001'; // Sesuaikan dengan project ID yang ada
const RAB_ITEM_ID = 1; // Sesuaikan dengan RAB item ID yang ada

async function testEndpoints() {
  try {
    console.log('🧪 Testing RAB Purchase Tracking API Endpoints...\n');

    // Test 1: Get purchase summary for all RAB items in project
    console.log('1. Testing GET /projects/:projectId/purchase-summary');
    try {
      const response1 = await axios.get(`${BASE_URL}/projects/${PROJECT_ID}/purchase-summary`);
      console.log('✅ Success:', response1.data);
    } catch (error) {
      console.log('❌ Error:', error.response?.data || error.message);
    }
    console.log('');

    // Test 2: Get purchase summary for specific RAB item
    console.log('2. Testing GET /projects/:projectId/rab-items/:rabItemId/purchase-summary');
    try {
      const response2 = await axios.get(`${BASE_URL}/projects/${PROJECT_ID}/rab-items/${RAB_ITEM_ID}/purchase-summary`);
      console.log('✅ Success:', response2.data);
    } catch (error) {
      console.log('❌ Error:', error.response?.data || error.message);
    }
    console.log('');

    // Test 3: Create new purchase tracking record
    console.log('3. Testing POST /projects/:projectId/rab-items/:rabItemId/purchase-tracking');
    try {
      const testPurchaseData = {
        quantity: 50.5,
        unitPrice: 100000,
        totalAmount: 5050000,
        poReference: 'PO-TEST-001',
        purchaseDate: new Date().toISOString(),
        status: 'pending',
        notes: 'Test partial purchase order - 50.5 kg out of 100 kg total'
      };

      const response3 = await axios.post(
        `${BASE_URL}/projects/${PROJECT_ID}/rab-items/${RAB_ITEM_ID}/purchase-tracking`,
        testPurchaseData
      );
      console.log('✅ Purchase tracking record created:', response3.data);
      
      // Store the tracking ID for update test
      const trackingId = response3.data.data.id;

      // Test 4: Update purchase tracking record
      console.log('\n4. Testing PUT /projects/:projectId/rab-items/:rabItemId/purchase-tracking/:trackingId');
      try {
        const updateData = {
          poReference: 'PO-FINAL-001',
          status: 'approved',
          notes: 'Updated with final PO number'
        };

        const response4 = await axios.put(
          `${BASE_URL}/projects/${PROJECT_ID}/rab-items/${RAB_ITEM_ID}/purchase-tracking/${trackingId}`,
          updateData
        );
        console.log('✅ Purchase tracking record updated:', response4.data);
      } catch (error) {
        console.log('❌ Update Error:', error.response?.data || error.message);
      }

    } catch (error) {
      console.log('❌ Create Error:', error.response?.data || error.message);
    }
    console.log('');

    // Test 5: Get updated purchase summary
    console.log('5. Testing updated purchase summary');
    try {
      const response5 = await axios.get(`${BASE_URL}/projects/${PROJECT_ID}/rab-items/${RAB_ITEM_ID}/purchase-summary`);
      console.log('✅ Updated purchase summary:', response5.data);
    } catch (error) {
      console.log('❌ Error:', error.response?.data || error.message);
    }

    console.log('\n🎉 Testing completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the tests
testEndpoints();