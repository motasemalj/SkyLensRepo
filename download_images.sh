#!/bin/bash

# Create the public directory if it doesn't exist
mkdir -p frontend/public

# Download Services page images
curl -o frontend/public/aerial-photography.jpg "https://images.unsplash.com/photo-1506947411487-a56738267384"
curl -o frontend/public/video-production.jpg "https://images.unsplash.com/photo-1579829366248-204fe8413f31"
curl -o frontend/public/real-estate.jpg "https://images.unsplash.com/photo-1512917774080-9991f1c4c750"
curl -o frontend/public/event-coverage.jpg "https://images.unsplash.com/photo-1511795409834-ef04bbd61622"
curl -o frontend/public/construction.jpg "https://images.unsplash.com/photo-1504307651254-35680f356dfd"
curl -o frontend/public/custom-projects.jpg "https://images.unsplash.com/photo-1473968512647-3e447244af8f"

# Download About page images
curl -o frontend/public/about-story.jpg "https://images.unsplash.com/photo-1507812984078-9174812417b3"
curl -o frontend/public/team-1.jpg "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
curl -o frontend/public/team-2.jpg "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
curl -o frontend/public/team-3.jpg "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d"

echo "All images have been downloaded to frontend/public/" 