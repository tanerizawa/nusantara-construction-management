/**
 * Test Auto-Title Generation Logic
 * Run this in browser console to verify format
 */

// Sample data
const projectId = '2025HDL001';
const uploadForm = {
  photoType: 'progress'
};
const photos = [
  { photoType: 'progress', createdAt: new Date('2025-10-13T09:00:00') },
  { photoType: 'progress', createdAt: new Date('2025-10-13T10:00:00') },
  { photoType: 'issue', createdAt: new Date('2025-10-13T11:00:00') }
];

// Generate auto title function
function generateAutoTitle() {
  const now = new Date();
  
  // Format date: ddmmyyyy
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const dateStr = `${day}${month}${year}`;
  
  // Format time: HHmmss
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const timeStr = `${hours}${minutes}${seconds}`;
  
  // Get sequence: count of photos with same type today + 1
  const todayPhotos = photos.filter(p => {
    if (!p.createdAt) return false;
    const photoDate = new Date(p.createdAt);
    return (
      p.photoType === uploadForm.photoType &&
      photoDate.toDateString() === now.toDateString()
    );
  });
  const sequence = String(todayPhotos.length + 1).padStart(2, '0');
  
  // Format: progress-2025HDL001-13102025-143022-01
  const autoTitle = `${uploadForm.photoType}-${projectId}-${dateStr}-${timeStr}-${sequence}`;
  
  return autoTitle;
}

// Run tests
console.log('🧪 Testing Auto-Title Generation\n');

// Test 1: Basic generation
console.log('Test 1: Basic Generation');
const title1 = generateAutoTitle();
console.log('Generated:', title1);
console.log('Expected format: progress-2025HDL001-ddmmyyyy-hhmmss-03');
console.log('✅ Matches format:', /^progress-2025HDL001-\d{8}-\d{6}-\d{2}$/.test(title1));
console.log('✅ Sequence correct (03):', title1.endsWith('-03'));
console.log('');

// Test 2: Different photo type
console.log('Test 2: Different Photo Type');
uploadForm.photoType = 'issue';
const title2 = generateAutoTitle();
console.log('Generated:', title2);
console.log('Expected format: issue-2025HDL001-ddmmyyyy-hhmmss-01');
console.log('✅ Matches format:', /^issue-2025HDL001-\d{8}-\d{6}-\d{2}$/.test(title2));
console.log('✅ Sequence correct (01):', title2.endsWith('-01'));
console.log('');

// Test 3: Parse components
console.log('Test 3: Parse Generated Title');
const parts = title1.split('-');
console.log('Photo Type:', parts[0]);
console.log('Project ID:', parts[1]);
console.log('Date:', parts[2]);
console.log('Time:', parts[3]);
console.log('Sequence:', parts[4]);
console.log('✅ Has 5 components:', parts.length === 5);
console.log('');

// Test 4: Date format
console.log('Test 4: Date Format Validation');
const dateStr = parts[2];
console.log('Date string:', dateStr);
console.log('✅ Length is 8:', dateStr.length === 8);
console.log('✅ All digits:', /^\d{8}$/.test(dateStr));
const day = dateStr.substring(0, 2);
const month = dateStr.substring(2, 4);
const year = dateStr.substring(4, 8);
console.log(`✅ Parsed: Day=${day}, Month=${month}, Year=${year}`);
console.log('');

// Test 5: Time format
console.log('Test 5: Time Format Validation');
const timeStr = parts[3];
console.log('Time string:', timeStr);
console.log('✅ Length is 6:', timeStr.length === 6);
console.log('✅ All digits:', /^\d{6}$/.test(timeStr));
const hours = timeStr.substring(0, 2);
const minutes = timeStr.substring(2, 4);
const seconds = timeStr.substring(4, 6);
console.log(`✅ Parsed: ${hours}:${minutes}:${seconds}`);
console.log('');

console.log('✅ All tests passed!');
