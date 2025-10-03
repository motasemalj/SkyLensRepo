const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const CLOUD_NAME = 'dm2sd9t1n';

console.log('🌥️  SkyLens Cloudinary Upload Script');
console.log('=====================================\n');
console.log('⚠️  IMPORTANT: You need to upload images manually to Cloudinary\n');
console.log('📋 Instructions:\n');
console.log('1. Go to: https://console.cloudinary.com/console/media_library\n');
console.log('2. Create a folder called "skylens"\n');
console.log('3. Upload these images from frontend/public/:\n');

const publicDir = path.join(__dirname, 'frontend', 'public');

// List all images that need to be uploaded
const imagesToUpload = [
  { local: 'hero-drone.jpg', cloudinary: 'skylens/hero-drone' },
  { local: 'skylens-logo.png', cloudinary: 'skylens/skylens-logo' },
  { local: 'skylens-text.png', cloudinary: 'skylens/skylens-text' },
  { local: 'aerial-photography.jpg', cloudinary: 'skylens/aerial-photography' },
  { local: 'construction.jpg', cloudinary: 'skylens/construction' },
  { local: 'video-production.jpg', cloudinary: 'skylens/video-production' },
  { local: 'real-estate.jpg', cloudinary: 'skylens/real-estate' },
  { local: 'event-coverage.jpg', cloudinary: 'skylens/event-coverage' },
  { local: 'custom-projects.jpg', cloudinary: 'skylens/custom-projects' },
  { local: '3d-mapping.gif', cloudinary: 'skylens/3d-mapping' },
  { local: 'edited.gif', cloudinary: 'skylens/edited' },
  { local: 'about-story.jpg', cloudinary: 'skylens/about-story' },
  { local: 'team-3.jpg', cloudinary: 'skylens/team-3' },
  { local: 'abdelhadi.png', cloudinary: 'skylens/abdelhadi' },
  { local: 'project1.jpg', cloudinary: 'skylens/project1' },
  { local: 'project2.jpg', cloudinary: 'skylens/project2' },
  { local: 'project3.jpg', cloudinary: 'skylens/project3' },
  { local: 'project4.jpg', cloudinary: 'skylens/project4' },
  { local: 'project6.jpg', cloudinary: 'skylens/project6' },
];

let existCount = 0;
let missingCount = 0;

imagesToUpload.forEach(img => {
  const filePath = path.join(publicDir, img.local);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`   ✓ ${img.local.padEnd(30)} (${sizeMB} MB) -> ${img.cloudinary}`);
    existCount++;
  } else {
    console.log(`   ✗ ${img.local.padEnd(30)} (MISSING)`);
    missingCount++;
  }
});

console.log(`\n📊 Summary: ${existCount} images found, ${missingCount} missing\n`);
console.log('4. After uploading, your images will be available at:');
console.log(`   https://res.cloudinary.com/${CLOUD_NAME}/image/upload/skylens/hero-drone.jpg\n`);
console.log('5. Test a URL in your browser to confirm upload!\n');
console.log('6. Then run: npm run dev (in frontend folder)\n');
console.log('✅ Done! Your app will now use Cloudinary CDN for images.');

