const fs = require('fs');
const path = require('path');

// Fungsi untuk mencari semua file JS dalam direktori
function getAllJSFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            getAllJSFiles(filePath, fileList);
        } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
            fileList.push(filePath);
        }
    });
    
    return fileList;
}

// Fungsi untuk mencari import statements dalam file
function findImports(content) {
    const importRegex = /import\s+.*\s+from\s+['"]([^'"]+)['"];?/g;
    const imports = [];
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
        imports.push(match[1]);
    }
    
    return imports;
}

// Fungsi untuk mencari require statements
function findRequires(content) {
    const requireRegex = /require\(['"]([^'"]+)['"]\)/g;
    const requires = [];
    let match;
    
    while ((match = requireRegex.exec(content)) !== null) {
        requires.push(match[1]);
    }
    
    return requires;
}

// Fungsi untuk normalize path
function normalizePath(importPath, currentFile) {
    if (importPath.startsWith('./') || importPath.startsWith('../')) {
        const currentDir = path.dirname(currentFile);
        return path.resolve(currentDir, importPath);
    }
    return importPath;
}

// Main analysis
function analyzeUnusedFiles() {
    const srcDir = './src';
    const allFiles = getAllJSFiles(srcDir);
    const usedFiles = new Set();
    const importMap = new Map();
    
    console.log(`Analyzing ${allFiles.length} files...`);
    
    // Collect all imports and requires
    allFiles.forEach(file => {
        try {
            const content = fs.readFileSync(file, 'utf8');
            const imports = findImports(content);
            const requires = findRequires(content);
            const allDependencies = [...imports, ...requires];
            
            importMap.set(file, allDependencies);
            
            allDependencies.forEach(dep => {
                if (dep.startsWith('./') || dep.startsWith('../')) {
                    const resolvedPath = normalizePath(dep, file);
                    // Try multiple extensions
                    const possiblePaths = [
                        resolvedPath + '.js',
                        resolvedPath + '.jsx',
                        resolvedPath + '/index.js',
                        resolvedPath + '/index.jsx',
                        resolvedPath
                    ];
                    
                    possiblePaths.forEach(possiblePath => {
                        if (fs.existsSync(possiblePath)) {
                            usedFiles.add(path.resolve(possiblePath));
                        }
                    });
                }
            });
        } catch (error) {
            console.log(`Error reading file ${file}: ${error.message}`);
        }
    });
    
    // Always mark entry points as used
    const entryPoints = [
        path.resolve('./src/App.js'),
        path.resolve('./src/index.js'),
    ];
    
    entryPoints.forEach(entry => {
        if (fs.existsSync(entry)) {
            usedFiles.add(entry);
        }
    });
    
    // Find unused files
    const unusedFiles = allFiles.filter(file => !usedFiles.has(path.resolve(file)));
    
    console.log('\n=== ANALYSIS RESULTS ===\n');
    console.log(`Total files: ${allFiles.length}`);
    console.log(`Used files: ${usedFiles.size}`);
    console.log(`Unused files: ${unusedFiles.length}`);
    
    if (unusedFiles.length > 0) {
        console.log('\n=== UNUSED FILES ===\n');
        unusedFiles.forEach(file => {
            const relativePath = path.relative('./src', file);
            console.log(relativePath);
        });
    }
    
    return unusedFiles;
}

// Run analysis
const unusedFiles = analyzeUnusedFiles();

// Create report
const report = {
    timestamp: new Date().toISOString(),
    totalFiles: 0,
    unusedFiles: unusedFiles.map(file => path.relative('./src', file)),
    unusedCount: unusedFiles.length
};

fs.writeFileSync('unused-files-report.json', JSON.stringify(report, null, 2));
console.log('\nReport saved to unused-files-report.json');