const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '../../Backend/src/main/resources/static/browser');
const dest = path.join(__dirname, '../../Backend/src/main/resources/static');

if (fs.existsSync(src)) {
  fs.readdirSync(src).forEach(file => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    if (fs.existsSync(destPath)) {
      fs.rmSync(destPath, { recursive: true, force: true });
    }
    fs.renameSync(srcPath, destPath);
  });
  fs.rmSync(src, { recursive: true, force: true });
  console.log('✓ Moved browser folder contents to static root');
} else {
  console.log('ℹ No browser folder found, skipping move');
}
