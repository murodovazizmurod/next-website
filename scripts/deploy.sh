#!/bin/bash

# Deployment script for azizmurod.uz
# This script helps prepare your project for deployment

echo "🚀 Preparing deployment for azizmurod.uz..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating template..."
    cat > .env << EOF
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
ADMIN_PASSWORD="your_secure_password_here"
EOF
    echo "✅ Created .env template. Please update it with your production values."
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate

# Build the project
echo "🏗️  Building project..."
npm run build

echo "✅ Build complete!"
echo ""
echo "📋 Next steps:"
echo "1. Push your code to GitHub"
echo "2. Import the repository to Vercel"
echo "3. Set up PostgreSQL database"
echo "4. Configure environment variables in Vercel:"
echo "   - DATABASE_URL (PostgreSQL connection string)"
echo "   - NEXT_PUBLIC_APP_URL (https://azizmurod.uz)"
echo "   - ADMIN_PASSWORD (your secure password)"
echo "5. Add custom domain azizmurod.uz in Vercel settings"
echo "6. Run database migrations: npx prisma db push"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"



