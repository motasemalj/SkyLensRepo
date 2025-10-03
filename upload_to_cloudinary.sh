#!/bin/bash

echo "🌥️  SkyLens Cloudinary Upload Script"
echo "===================================="
echo ""

# Check if cloudinary CLI is installed
if ! command -v cloudinary &> /dev/null; then
    echo "❌ Cloudinary CLI not found. Installing..."
    npm install -g cloudinary-cli
fi

# Check if configured
echo "📋 Make sure you've run 'cloudinary config' first!"
echo ""
read -p "Have you configured Cloudinary CLI? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please run: cloudinary config"
    echo "Then run this script again."
    exit 1
fi

# Get cloud name
read -p "Enter your Cloudinary Cloud Name: " CLOUD_NAME

if [ -z "$CLOUD_NAME" ]; then
    echo "❌ Cloud name is required!"
    exit 1
fi

echo ""
echo "📤 Uploading images to Cloudinary..."
echo ""

# Upload public folder
cd frontend/public || exit

# Upload all images
echo "Uploading main images..."
cloudinary uploader upload hero-drone.jpg --public-id "skylens/hero-drone" 2>/dev/null
cloudinary uploader upload skylens-logo.png --public-id "skylens/skylens-logo" 2>/dev/null
cloudinary uploader upload aerial-photography.jpg --public-id "skylens/aerial-photography" 2>/dev/null
cloudinary uploader upload construction.jpg --public-id "skylens/construction" 2>/dev/null
cloudinary uploader upload video-production.jpg --public-id "skylens/video-production" 2>/dev/null
cloudinary uploader upload real-estate.jpg --public-id "skylens/real-estate" 2>/dev/null
cloudinary uploader upload event-coverage.jpg --public-id "skylens/event-coverage" 2>/dev/null
cloudinary uploader upload custom-projects.jpg --public-id "skylens/custom-projects" 2>/dev/null
cloudinary uploader upload "3d-mapping.gif" --public-id "skylens/3d-mapping" 2>/dev/null
cloudinary uploader upload edited.gif --public-id "skylens/edited" 2>/dev/null

echo "Uploading about images..."
cloudinary uploader upload about-story.jpg --public-id "skylens/about-story" 2>/dev/null

echo "Uploading project images..."
for i in {1..6}; do
    [ -f "project$i.jpg" ] && cloudinary uploader upload "project$i.jpg" --public-id "skylens/project$i" 2>/dev/null
    [ -f "project$i.JPG" ] && cloudinary uploader upload "project$i.JPG" --public-id "skylens/project$i" 2>/dev/null
done

cd ../..

echo ""
echo "✅ Upload complete!"
echo ""
echo "📝 Next steps:"
echo "1. Add this to Railway environment variables:"
echo "   NEXT_PUBLIC_IMAGE_BASE_URL=https://res.cloudinary.com/$CLOUD_NAME/image/upload"
echo ""
echo "2. Update your image paths to:"
echo "   {baseUrl}/skylens/hero-drone.jpg"
echo ""
echo "3. Or use the getImageUrl() helper from lib/imageConfig.ts"
echo ""

