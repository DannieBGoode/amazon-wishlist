const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

const rootDir = __dirname;
const srcDir = path.join(rootDir, 'src');
const distDir = path.join(rootDir, 'dist');

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });

function buildFirefox() {
  const firefoxDir = path.join(distDir, 'firefox');
  fs.cpSync(srcDir, firefoxDir, { recursive: true });
  fs.rmSync(path.join(firefoxDir, 'manifest-chrome.json'), { force: true });
  
  // Create zip using adm-zip instead of external zip command
  const zip = new AdmZip();
  const files = fs.readdirSync(firefoxDir);
  files.forEach(file => {
    const filePath = path.join(firefoxDir, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      zip.addLocalFolder(filePath, file);
    } else {
      zip.addLocalFile(filePath, file);
    }
  });
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
  const files = fs.readdirSync(chromeDir);
  files.forEach(file => {
    const filePath = path.join(chromeDir, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      zip.addLocalFolder(filePath, file);
    } else {
      zip.addLocalFile(filePath, file);
    }
  });
  zip.writeZip(path.join(distDir, 'chrome.zip'));
  console.log('chrome.zip created successfully!');
  
  fs.rmSync(chromeDir, { recursive: true, force: true });
}

buildFirefox();
buildChrome();
