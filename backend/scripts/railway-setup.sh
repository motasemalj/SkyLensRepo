#!/bin/bash

echo "🚂 Railway Setup Script for SkyLens Backend"
echo "==========================================="
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL is not set"
    echo "Please set DATABASE_URL in Railway environment variables"
    exit 1
fi

echo "✅ DATABASE_URL is set"

# Generate Prisma Client
echo ""
echo "📦 Generating Prisma Client..."
npx prisma generate

if [ $? -eq 0 ]; then
    echo "✅ Prisma Client generated successfully"
else
    echo "❌ Failed to generate Prisma Client"
    exit 1
fi

# Run database migrations
echo ""
echo "🔄 Running database migrations..."
npx prisma migrate deploy

if [ $? -eq 0 ]; then
    echo "✅ Migrations completed successfully"
else
    echo "❌ Migration failed"
    exit 1
fi

# Verify database connection
echo ""
echo "🔍 Verifying database connection..."
node -e "const { PrismaClient } = require('./generated/prisma'); const prisma = new PrismaClient(); prisma.\$connect().then(() => { console.log('✅ Database connection successful'); prisma.\$disconnect(); }).catch((e) => { console.error('❌ Database connection failed:', e.message); process.exit(1); });"

echo ""
echo "🎉 Railway setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Create an admin user: npm run create-admin"
echo "2. Check /health endpoint to verify server is running"

