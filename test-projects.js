const fs = require('fs');
const path = require('path');

// Test loading projects data
try {
  const projectsPath = path.join(__dirname, 'data/projects.json');
  const data = fs.readFileSync(projectsPath, 'utf8');
  const projectsData = JSON.parse(data);
  
  console.log('✅ Projects JSON is valid');
  console.log('📊 Number of projects:', projectsData.projects?.length || 0);
  
  if (projectsData.projects && projectsData.projects.length > 0) {
    console.log('🏗️ First project:', projectsData.projects[0].name);
    console.log('📋 First project structure:', Object.keys(projectsData.projects[0]));
  }
} catch (error) {
  console.error('❌ Error:', error.message);
}
