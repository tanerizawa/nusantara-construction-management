const fs = require('fs');
const path = require('path');

// Files that need ESLint fixes based on the logs
const fixes = [
  {
    file: 'src/pages/SubsidiaryEdit.js',
    fixes: [
      // Remove unused imports
      {
        search: ", Briefcase",
        replace: ""
      },
      {
        search: ", AlertCircle",
        replace: ""
      },
      {
        search: ", Edit",
        replace: ""
      },
      {
        search: ", Check",
        replace: ""
      }
    ]
  }
];

console.log('🔧 Applying ESLint fixes...');

fixes.forEach(({ file, fixes: fileFixes }) => {
  const filePath = path.join(__dirname, file);
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    fileFixes.forEach(({ search, replace }) => {
      content = content.replace(search, replace);
    });
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${file}`);
  } else {
    console.log(`❌ File not found: ${file}`);
  }
});

console.log('🎉 ESLint fixes completed');
