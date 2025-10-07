// Emergency RAB Test - Run this in browser console
// Akan test API dan state secara manual

async function emergencyRABTest() {
  console.log('🚨 EMERGENCY RAB TEST START 🚨');
  
  // Test 1: Check if we're logged in
  const token = localStorage.getItem('token');
  console.log('1. Auth token:', token ? '✅ EXISTS' : '❌ MISSING');
  
  // Test 2: Try to fetch RAB data directly
  if (token) {
    try {
      console.log('2. Testing RAB API directly...');
      const response = await fetch('/api/projects/PRJ-2025-001/rab', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      console.log('2. RAB API Response:', response.status, data);
      
      if (data.success && data.data) {
        console.log('✅ RAB Data found:', data.data.length, 'items');
        data.data.forEach((item, i) => {
          console.log(`   Item ${i+1}:`, item.description, '- Rp', item.totalPrice);
        });
      } else {
        console.log('❌ No RAB data in response');
      }
    } catch (error) {
      console.log('❌ RAB API Error:', error);
    }
  }
  
  // Test 3: Check React components
  console.log('3. Checking React components...');
  const rabElements = document.querySelectorAll('[class*="rab"], [id*="rab"]');
  console.log('3. RAB DOM elements:', rabElements.length);
  
  const addButtons = Array.from(document.querySelectorAll('button')).filter(btn => 
    btn.textContent.toLowerCase().includes('tambah') || 
    btn.textContent.toLowerCase().includes('add')
  );
  console.log('3. Add/Tambah buttons:', addButtons.length);
  addButtons.forEach((btn, i) => console.log(`   Button ${i+1}:`, btn.textContent));
  
  // Test 4: Check for debug indicator
  const debugBoxes = document.querySelectorAll('.bg-yellow-100');
  console.log('4. Debug boxes found:', debugBoxes.length);
  
  console.log('🚨 EMERGENCY RAB TEST COMPLETE 🚨');
}

// Run the test
emergencyRABTest();