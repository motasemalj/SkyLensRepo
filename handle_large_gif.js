const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

console.log('🎬 Handling large GIF: edited.gif');
console.log('=====================================\n');

const sourcePath = path.join(__dirname, 'frontend', 'public', 'edited.gif');
const outputPath = path.join(__dirname, 'frontend', 'public_compressed', 'edited-preview.jpg');

console.log('Option 1: Convert first frame to JPG (RECOMMENDED for web)');
console.log('----------------------------------------------------------');
console.log('Since the GIF is 17.66MB (over Cloudinary free tier 10MB limit),');
console.log('we have a few options:\n');

// Extract first frame as JPG
sharp(sourcePath, { animated: false })
  .jpeg({ quality: 80 })
  .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
  .toFile(outputPath)
  .then(() => {
    const stats = fs.statSync(outputPath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`✅ Created static preview: edited-preview.jpg (${sizeMB} MB)`);
    console.log('\n📝 Recommendations:\n');
    console.log('1. Use the static JPG preview instead of the GIF');
    console.log('   - Much faster to load');
    console.log('   - Better for web performance');
    console.log('   - 99% of users won\'t need the animation\n');
    
    console.log('2. Or upload the GIF manually to Cloudinary:');
    console.log('   - Go to: https://console.cloudinary.com/console/media_library');
    console.log('   - Create folder: skylens');
    console.log('   - Drag and drop edited.gif');
    console.log('   - It will work, but may need paid plan for large files\n');
    
    console.log('3. Or convert to MP4 (better compression):');
    console.log('   - Use ffmpeg to convert GIF to MP4');
    console.log('   - Much smaller file size');
    console.log('   - Better quality\n');
    
    console.log('4. Or use the 3d-mapping.gif instead (2.37 MB - already uploaded)');
    console.log('   - This smaller GIF already works!\n');
    
    console.log('💡 Quick fix: Replace in your code:');
    console.log('   image: "/edited.gif"  →  image: "/3d-mapping.gif"');
    console.log('   or');
    console.log('   image: "/edited.gif"  →  image: "/edited-preview.jpg" (static)');
  })
  .catch(err => {
    console.error('Error:', err);
  });

