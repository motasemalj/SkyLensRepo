#!/bin/bash

echo "🔧 Setting up environment variables for SkyLens..."
echo ""

# Create .env.local for frontend
cat > frontend/.env.local << 'EOF'
# Cloudinary Configuration
NEXT_PUBLIC_IMAGE_BASE_URL=https://res.cloudinary.com/dm2sd9t1n/image/upload

# Backend API URL (local development)
NEXT_PUBLIC_API_URL=http://localhost:4001
EOF

echo "✅ Created frontend/.env.local"
echo ""
echo "📝 For Railway deployment, add these environment variables:"
echo "   NEXT_PUBLIC_IMAGE_BASE_URL=https://res.cloudinary.com/dm2sd9t1n/image/upload"
echo "   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app"
echo ""
echo "✅ Setup complete!"

