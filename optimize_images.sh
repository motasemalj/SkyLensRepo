#!/bin/bash

# Create optimized directory if it doesn't exist
mkdir -p frontend/public/optimized

# Optimize project6.jpg
convert frontend/public/project6.jpg -strip -quality 85 -resize 1920x frontend/public/optimized/project6.jpg

# Optimize team member images
convert frontend/public/team-1.jpg -strip -quality 85 -resize 400x400 frontend/public/optimized/team-1.jpg
convert frontend/public/team-2.jpg -strip -quality 85 -resize 400x400 frontend/public/optimized/team-2.jpg
convert frontend/public/team-3.jpg -strip -quality 85 -resize 400x400 frontend/public/optimized/team-3.jpg

echo "Image optimization complete!" 