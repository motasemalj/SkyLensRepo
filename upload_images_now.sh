#!/bin/bash

CLOUD_NAME="dm2sd9t1n"

echo "🌥️  Uploading SkyLens images to Cloudinary..."
echo "Cloud Name: $CLOUD_NAME"
echo ""

cd frontend/public || exit

# Upload main images
echo "📤 Uploading hero and logo..."
cloudinary uploader upload hero-drone.jpg --public-id "skylens/hero-drone" --resource_type image || true
cloudinary uploader upload skylens-logo.png --public-id "skylens/skylens-logo" --resource_type image || true
cloudinary uploader upload skylens-text.png --public-id "skylens/skylens-text" --resource_type image || true

# Upload service images
echo "📤 Uploading service images..."
cloudinary uploader upload aerial-photography.jpg --public-id "skylens/aerial-photography" --resource_type image || true
cloudinary uploader upload construction.jpg --public-id "skylens/construction" --resource_type image || true
cloudinary uploader upload video-production.jpg --public-id "skylens/video-production" --resource_type image || true
cloudinary uploader upload real-estate.jpg --public-id "skylens/real-estate" --resource_type image || true
cloudinary uploader upload event-coverage.jpg --public-id "skylens/event-coverage" --resource_type image || true
cloudinary uploader upload custom-projects.jpg --public-id "skylens/custom-projects" --resource_type image || true

# Upload GIFs
echo "📤 Uploading GIFs..."
cloudinary uploader upload "3d-mapping.gif" --public-id "skylens/3d-mapping" --resource_type image || true
cloudinary uploader upload edited.gif --public-id "skylens/edited" --resource_type image || true

# Upload about/team images
echo "📤 Uploading about/team images..."
cloudinary uploader upload about-story.jpg --public-id "skylens/about-story" --resource_type image || true
cloudinary uploader upload team-3.jpg --public-id "skylens/team-3" --resource_type image || true
cloudinary uploader upload abdelhadi.png --public-id "skylens/abdelhadi" --resource_type image || true

# Upload project images
echo "📤 Uploading project images..."
for i in 1 2 3 4 6; do
    if [ -f "project$i.jpg" ]; then
        cloudinary uploader upload "project$i.jpg" --public-id "skylens/project$i" --resource_type image || true
    fi
    if [ -f "project$i.JPG" ]; then
        cloudinary uploader upload "project$i.JPG" --public-id "skylens/project$i" --resource_type image || true
    fi
done

# Upload optimized images
echo "📤 Uploading optimized team photos..."
if [ -d "optimized" ]; then
    cd optimized || exit
    cloudinary uploader upload team-1.jpg --public-id "skylens/optimized/team-1" --resource_type image || true
    cloudinary uploader upload team-2.jpg --public-id "skylens/optimized/team-2" --resource_type image || true
    cloudinary uploader upload team-3.jpg --public-id "skylens/optimized/team-3" --resource_type image || true
    cloudinary uploader upload project6.jpg --public-id "skylens/optimized/project6" --resource_type image || true
    cd ..
fi

# Upload about folder
if [ -d "about" ]; then
    cd about || exit
    cloudinary uploader upload aerial1.jpg --public-id "skylens/about/aerial1" --resource_type image || true
    cloudinary uploader upload aerial2.jpg --public-id "skylens/about/aerial2" --resource_type image || true
    cloudinary uploader upload team1.jpg --public-id "skylens/about/team1" --resource_type image || true
    cd ..
fi

# Upload services folder
if [ -d "services" ]; then
    cd services || exit
    cloudinary uploader upload edited.jpg --public-id "skylens/services/edited" --resource_type image || true
    cloudinary uploader upload raw.jpg --public-id "skylens/services/raw" --resource_type image || true
    cd ..
fi

cd ../..

echo ""
echo "✅ Upload complete!"
echo ""
echo "📝 Next steps:"
echo ""
echo "1️⃣  Add this to your .env.local (for local development):"
echo "   NEXT_PUBLIC_IMAGE_BASE_URL=https://res.cloudinary.com/$CLOUD_NAME/image/upload"
echo ""
echo "2️⃣  Add this to Railway environment variables:"
echo "   NEXT_PUBLIC_IMAGE_BASE_URL=https://res.cloudinary.com/$CLOUD_NAME/image/upload"
echo ""
echo "3️⃣  Your images are now available at:"
echo "   https://res.cloudinary.com/$CLOUD_NAME/image/upload/skylens/hero-drone.jpg"
echo "   https://res.cloudinary.com/$CLOUD_NAME/image/upload/skylens/aerial-photography.jpg"
echo "   etc..."
echo ""

