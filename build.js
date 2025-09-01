const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = __dirname;
const srcDir = path.join(rootDir, 'src');
const distDir = path.join(rootDir, 'dist');

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });

function buildFirefox() {
  const firefoxDir = path.join(distDir, 'firefox');
  fs.cpSync(srcDir, firefoxDir, { recursive: true });
  fs.rmSync(path.join(firefoxDir, 'manifest-chrome.json'), { force: true });
  execSync('zip -r ../firefox.zip .', { cwd: firefoxDir, stdio: 'inherit' });
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
  execSync('zip -r ../chrome.zip .', { cwd: chromeDir, stdio: 'inherit' });
  fs.rmSync(chromeDir, { recursive: true, force: true });
}

buildFirefox();
buildChrome();
