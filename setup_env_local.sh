#!/bin/bash

# Create .env.local file for frontend
echo "Creating .env.local file for frontend..."

cat > frontend/.env.local << EOF
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/skylens_db"

# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:4001"
API_URL="http://localhost:4001"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-here"

# Email Configuration (Optional)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# Railway Configuration
PORT=3000
NODE_ENV=development

# Next.js Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-here"

# Image Configuration
NEXT_PUBLIC_IMAGE_BASE_URL="https://res.cloudinary.com/dm2sd9t1n/image/upload"
EOF

echo "✅ .env.local file created successfully!"
echo "📁 Location: frontend/.env.local"
echo "🔧 You can now run: cd frontend && npm run dev"
