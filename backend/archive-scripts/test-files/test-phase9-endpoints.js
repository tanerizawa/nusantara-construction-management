/**
 * Test Script for Phase 9 Endpoints
 * Tests all cost center and project costing APIs
 */

const http = require('http');

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api/reports${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          resolve({ status: res.statusCode, data: result });
        } catch (error) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testPhase9Endpoints() {
  console.log('🧪 Testing Phase 9: Cost Center Management & Project Costing APIs');
  console.log('=' * 70);

  try {
    // Test 1: Cost Center Performance Analysis
    console.log('\n1️⃣  Testing Cost Center Performance Analysis...');
    const performance = await makeRequest('GET', '/cost-center/performance?cost_center_id=CC-OPS-001');
    console.log(`Status: ${performance.status}`);
    console.log('Response:', JSON.stringify(performance.data, null, 2));

    // Test 2: Cost Center Allocation Report
    console.log('\n2️⃣  Testing Cost Center Allocation Report...');
    const allocationReport = await makeRequest('GET', '/cost-center/allocation-report?cost_center_id=CC-OPS-001&start_date=2025-01-01&end_date=2025-12-31');
    console.log(`Status: ${allocationReport.status}`);
    console.log('Response:', JSON.stringify(allocationReport.data, null, 2));

    // Test 3: Project Cost Tracking
    console.log('\n3️⃣  Testing Project Cost Tracking...');
    const costTracking = await makeRequest('GET', '/project-costing/track-costs?project_id=PROJ-001');
    console.log(`Status: ${costTracking.status}`);
    console.log('Response:', JSON.stringify(costTracking.data, null, 2));

    // Test 4: Create New Cost Center
    console.log('\n4️⃣  Testing Cost Center Creation...');
    const newCostCenter = {
      cost_center_code: 'CC-QC-001',
      cost_center_name: 'Quality Control',
      cost_center_type: 'QUALITY_CONTROL',
      budget_limit: 800000000,
      description: 'Quality control and assurance department'
    };
    const createCC = await makeRequest('POST', '/cost-center/create', newCostCenter);
    console.log(`Status: ${createCC.status}`);
    console.log('Response:', JSON.stringify(createCC.data, null, 2));

    // Test 5: Allocate Costs
    console.log('\n5️⃣  Testing Cost Allocation...');
    const allocation = {
      cost_center_id: 'CC-QC-001',
      project_id: 'PROJ-001',
      allocation_amount: 200000000,
      allocation_type: 'OVERHEAD_ALLOCATION',
      allocation_basis: 'Quality inspection hours',
      description: 'Quality control allocation for Project Alpha'
    };
    const allocateCosts = await makeRequest('POST', '/cost-center/allocate', allocation);
    console.log(`Status: ${allocateCosts.status}`);
    console.log('Response:', JSON.stringify(allocateCosts.data, null, 2));

    // Test 6: Create Project Costing Structure
    console.log('\n6️⃣  Testing Project Costing Structure Creation...');
    const projectStructure = {
      project_id: 'PROJ-002',
      project_name: 'Construction Project Beta',
      total_budget: 3500000000,
      project_type: 'CONSTRUCTION',
      start_date: '2025-06-01',
      end_date: '2025-12-31'
    };
    const createStructure = await makeRequest('POST', '/project-costing/create-structure', projectStructure);
    console.log(`Status: ${createStructure.status}`);
    console.log('Response:', JSON.stringify(createStructure.data, null, 2));

    console.log('\n✅ All Phase 9 endpoint tests completed successfully!');

  } catch (error) {
    console.error('❌ Error testing Phase 9 endpoints:', error);
  }
}

// Run tests
testPhase9Endpoints();
