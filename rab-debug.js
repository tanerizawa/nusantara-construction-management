// RAB Debug Script - untuk dijalankan di browser console
// Paste script ini di browser console saat mengakses halaman project detail

console.log('=== RAB DEBUG SCRIPT START ===');

// Check if we're on the right page
console.log('Current URL:', window.location.href);

// Check if React components are loaded
const rabWorkflowElements = document.querySelectorAll('[class*="rab"], [class*="RAB"]');
console.log('RAB related elements found:', rabWorkflowElements.length);

// Check for RAB buttons
const addButtons = document.querySelectorAll('button');
const rabButtons = Array.from(addButtons).filter(btn => 
  btn.textContent.includes('Tambah') || 
  btn.textContent.includes('Add') || 
  btn.textContent.includes('RAB')
);
console.log('RAB-related buttons found:', rabButtons.length);
rabButtons.forEach((btn, i) => console.log(`Button ${i}:`, btn.textContent));

// Check for forms
const forms = document.querySelectorAll('form');
console.log('Forms found:', forms.length);

// Check for RAB data in component state (if accessible)
if (window.React) {
  console.log('React detected');
  // Try to find React components with RAB data
  const reactElements = document.querySelectorAll('[data-reactroot] *');
  console.log('React elements found:', reactElements.length);
}

// Check local storage for auth
const token = localStorage.getItem('token');
console.log('Auth token exists:', !!token);
if (token) {
  console.log('Token preview:', token.substring(0, 30) + '...');
}

// Check API calls - monitor network
console.log('=== MONITORING NETWORK REQUESTS ===');
const originalFetch = window.fetch;
window.fetch = function(...args) {
  console.log('🌐 FETCH REQUEST:', args[0]);
  return originalFetch.apply(this, args).then(response => {
    console.log('🌐 FETCH RESPONSE:', response.status, response.url);
    return response;
  }).catch(error => {
    console.log('🌐 FETCH ERROR:', error);
    throw error;
  });
};

console.log('=== RAB DEBUG SCRIPT ACTIVE ===');
console.log('Network monitoring enabled. Now try to interact with RAB components.');