const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

const rootDir = __dirname;
const srcDir = path.join(rootDir, 'src');
const distDir = path.join(rootDir, 'dist');

// Clean up dist directory if it exists
if (fs.existsSync(distDir)) {
  try {
    fs.rmSync(distDir, { recursive: true, force: true });
  } catch (error) {
    console.log('Note: Could not remove dist directory, continuing...');
  }
}
fs.mkdirSync(distDir, { recursive: true });

function addFilesToZip(zip, sourceDir) {
  const files = fs.readdirSync(sourceDir);
  files.forEach(file => {
    const filePath = path.join(sourceDir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      // For directories, add their contents recursively
      const subFiles = fs.readdirSync(filePath);
      subFiles.forEach(subFile => {
        const subFilePath = path.join(filePath, subFile);
        const subStats = fs.statSync(subFilePath);
        if (!subStats.isDirectory()) {
          // Add file directly to zip root
          zip.addLocalFile(subFilePath);
        }
      });
    } else {
      // Add file directly to zip root
      zip.addLocalFile(filePath);
    }
  });
}

function buildFirefox() {
  const firefoxDir = path.join(distDir, 'firefox');
  fs.cpSync(srcDir, firefoxDir, { recursive: true });
  fs.rmSync(path.join(firefoxDir, 'manifest-chrome.json'), { force: true });
  
  // Create zip using adm-zip instead of external zip command
  const zip = new AdmZip();
  addFilesToZip(zip, firefoxDir);
  zip.writeZip(path.join(distDir, 'firefox.zip'));
  console.log('firefox.zip created successfully!');
  
  fs.rmSync(firefoxDir, { recursive: true, force: true });
}

function buildChrome() {
  const chromeDir = path.join(distDir, 'chrome');
  fs.cpSync(srcDir, chromeDir, { recursive: true });
  fs.rmSync(path.join(chromeDir, 'manifest.json'), { force: true });
  fs.renameSync(
    path.join(chromeDir, 'manifest-chrome.json'),
    path.join(chromeDir, 'manifest.json')
  );
  
  // Create zip using adm-zip instead of external zip command
  const zip = new AdmZip();
  addFilesToZip(zip, chromeDir);
  zip.writeZip(path.join(distDir, 'chrome.zip'));
  console.log('chrome.zip created successfully!');
  
  fs.rmSync(chromeDir, { recursive: true, force: true });
}

buildFirefox();
buildChrome();
