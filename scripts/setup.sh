#!/bin/bash

# Setup script for local development
echo "🚀 Setting up Anime Streaming Platform..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✓ Node.js version: $(node -v)"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker is not installed. You'll need Docker to run services."
    echo "   Install from: https://docs.docker.com/get-docker/"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Copy environment files
echo ""
echo "📝 Setting up environment files..."

if [ ! -f "services/api/.env" ]; then
    cp services/api/.env.example services/api/.env
    echo "✓ Created services/api/.env"
else
    echo "✓ services/api/.env already exists"
fi

if [ ! -f "apps/web/.env" ]; then
    cp apps/web/.env.example apps/web/.env
    echo "✓ Created apps/web/.env"
else
    echo "✓ apps/web/.env already exists"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Review and update .env files with your configuration"
echo "2. Start services: docker-compose up -d"
echo "3. Seed database: node scripts/seed.js"
echo "4. Start development: npm run dev"
echo ""
echo "For more information, see docs/SETUP.md"
