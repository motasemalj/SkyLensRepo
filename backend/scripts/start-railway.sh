#!/bin/bash

echo "🚀 Starting SkyLens Backend on Railway..."
echo "=========================================="
echo ""

# Wait a moment for database to be ready
echo "⏳ Waiting for database connection..."
sleep 2

# Run database migrations
echo ""
echo "🔄 Running database migrations..."
npx prisma migrate deploy

if [ $? -eq 0 ]; then
    echo "✅ Migrations completed successfully"
else
    echo "⚠️ Warning: Migrations may have failed, but continuing to start server..."
fi

# Start the application
echo ""
echo "🚀 Starting application server..."
exec npm start

