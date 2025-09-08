// check-imports.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to recursively find all JS files
const findAllJSFiles = (dir, fileList = []) => {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !filePath.includes('node_modules')) {
      findAllJSFiles(filePath, fileList);
    } else if (file.endsWith('.js')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
};

// Function to check import statements in a file
const checkFileImports = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    let hasIssues = false;
    
    lines.forEach((line, index) => {
      if (line.includes('import') && line.includes('from')) {
        // Check for common import issues
        const issues = [];
        
        // Check for wrong file extensions
        if (line.includes('.js\'') || line.includes('.js"')) {
          issues.push('Contains .js extension (should not in ES modules)');
        }
        
        // Check for wrong paths
        if (line.includes('../models/User.js') || line.includes('../models/User\'')) {
          issues.push('Should be ../models/UserModel.js');
        }
        
        if (line.includes('../models/Auth.js') || line.includes('../models/Auth\'')) {
          issues.push('Should be ../models/AuthModel.js');
        }
        
        if (line.includes('../validators/')) {
          issues.push('Should be ../utils/ instead of ../validators/');
        }
        
        // Check for missing file extensions in relative imports
        const importMatch = line.match(/from\s+['"](\.\/[^'"]+)['"]/);
        if (importMatch && !importMatch[1].endsWith('.js')) {
          const importPath = importMatch[1];
          // Check if this is a relative import (starts with ./ or ../)
          if (importPath.startsWith('./') || importPath.startsWith('../')) {
            issues.push(`Missing .js extension in: ${importPath}`);
          }
        }
        
        // Check if imported file actually exists
        const pathMatch = line.match(/from\s+['"]([^'"]+)['"]/);
        if (pathMatch) {
          const importPath = pathMatch[1];
          if (importPath.startsWith('./') || importPath.startsWith('../')) {
            const fullPath = path.resolve(path.dirname(filePath), importPath);
            
            // Check for .js file
            if (!fs.existsSync(fullPath) && !fs.existsSync(fullPath + '.js')) {
              // Check if it's a directory with index.js
              const dirIndexPath = path.join(fullPath, 'index.js');
              if (!fs.existsSync(dirIndexPath)) {
                issues.push(`File does not exist: ${importPath}`);
              }
            }
          }
        }
        
        if (issues.length > 0) {
          if (!hasIssues) {
            console.log(`\n📁 ${filePath}:`);
            hasIssues = true;
          }
          console.log(`   Line ${index + 1}: ${line.trim()}`);
          issues.forEach(issue => console.log(`   ❌ ${issue}`));
        }
      }
    });
    
    return hasIssues;
  } catch (error) {
    console.log(`❌ Could not read ${filePath}: ${error.message}`);
    return false;
  }
};

// Main function to check all files
const checkAllImports = () => {
  console.log('🔍 Scanning for import issues...\n');
  
  const projectRoot = path.join(__dirname, 'src');
  const allJSFiles = findAllJSFiles(projectRoot);
  
  let totalIssues = 0;
  let filesWithIssues = 0;
  
  allJSFiles.forEach(filePath => {
    const relativePath = path.relative(process.cwd(), filePath);
    const hasIssues = checkFileImports(filePath);
    
    if (hasIssues) {
      filesWithIssues++;
      totalIssues++;
    }
  });
  
  console.log('\n' + '='.repeat(50));
  if (totalIssues === 0) {
    console.log('✅ No import issues found!');
  } else {
    console.log(`📊 Found ${totalIssues} issues in ${filesWithIssues} files`);
    console.log('\n💡 Common fixes:');
    console.log('   - Change ../models/User.js to ../models/UserModel.js');
    console.log('   - Change ../models/Auth.js to ../models/AuthModel.js');
    console.log('   - Change ../validators/ to ../utils/');
    console.log('   - Add .js extension to relative imports');
    console.log('   - Ensure imported files actually exist');
  }
  console.log('='.repeat(50));
};

// Run the check
checkAllImports();
