#!/bin/bash

echo "📥 Downloading images for SkyLens..."

# Create necessary directories
mkdir -p frontend/public/about
mkdir -p frontend/public/optimized
mkdir -p frontend/public/services

# Function to download with retry
download_image() {
  local url=$1
  local output=$2
  echo "Downloading $output..."
  curl -L -f -o "$output" "$url" || echo "⚠️  Failed to download $output"
}

# OPTION 1: Download from your own CDN/storage (RECOMMENDED)
# Replace these URLs with your actual image hosting URLs (Cloudinary, S3, etc.)
# download_image "https://your-cdn.com/hero-drone.jpg" "frontend/public/hero-drone.jpg"

# OPTION 2: Download from Unsplash (for demo/testing)
# Hero and main images
download_image "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1920&q=80" "frontend/public/hero-drone.jpg"
download_image "https://images.unsplash.com/photo-1507812984078-9174812417b3?w=800&q=80" "frontend/public/skylens-logo.png"

# Services images
download_image "https://images.unsplash.com/photo-1506947411487-a56738267384?w=800&q=80" "frontend/public/aerial-photography.jpg"
download_image "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80" "frontend/public/construction.jpg"
download_image "https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=800&q=80" "frontend/public/video-production.jpg"
download_image "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80" "frontend/public/real-estate.jpg"
download_image "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80" "frontend/public/event-coverage.jpg"
download_image "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80" "frontend/public/custom-projects.jpg"

# About page images
download_image "https://images.unsplash.com/photo-1507812984078-9174812417b3?w=800&q=80" "frontend/public/about-story.jpg"
download_image "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" "frontend/public/about/team1.jpg"
download_image "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80" "frontend/public/optimized/team-1.jpg"
download_image "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80" "frontend/public/optimized/team-2.jpg"
download_image "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80" "frontend/public/optimized/team-3.jpg"

# Project images
for i in {1..6}; do
  download_image "https://images.unsplash.com/photo-147396851264$i-3e447244af8f?w=800&q=80" "frontend/public/project$i.jpg"
done

# GIF placeholders (you'll need to host these somewhere or keep them in Git)
# download_image "https://your-cdn.com/3d-mapping.gif" "frontend/public/3d-mapping.gif"
# download_image "https://your-cdn.com/edited.gif" "frontend/public/edited.gif"

echo "✅ Image download complete!"
