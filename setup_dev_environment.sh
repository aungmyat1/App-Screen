#!/bin/bash

# Setup script for App-Screen development environment

echo "🔧 Setting up App-Screen development environment..."

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "requirements.txt" ]; then
    echo "❌ This script must be run from the project root directory"
    exit 1
fi

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed"
    exit 1
fi

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed"
    exit 1
fi

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is required but not installed"
    exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "🐍 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
pip install --upgrade pip

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Install Playwright browsers
echo "🌐 Installing Playwright browsers..."
python -m playwright install chromium --quiet

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Create storage directory if it doesn't exist
if [ ! -d "storage" ]; then
    echo "📁 Creating storage directory..."
    mkdir -p storage/screenshots/appstore storage/screenshots/playstore storage/metadata
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "⚙️ Creating .env file..."
    cat > .env << EOF
# App Configuration
REDIS_URL=redis://localhost:6379
DATABASE_URL=postgresql://localhost:5432/appscreen
SECRET_KEY=your-super-secret-key-change-this-in-production
DEBUG=true

# AWS Configuration (for S3 storage)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET_NAME=
AWS_S3_REGION=us-east-1

# API Configuration
API_BASE_URL=http://localhost:8000
EOF
    echo "📝 Created .env file with default values - please update with your actual configuration"
fi

echo "✅ Development environment setup complete!"
echo ""
echo "🚀 To start the application, run:"
echo "   source venv/bin/activate  # Activate virtual environment"
echo "   ./start_dev_services.sh   # Start all services"
echo ""
echo "📝 Note: Make sure Redis server is running before starting the services"
echo "   You can start Redis with: redis-server"
echo ""
echo "🔍 For VSCode users: We've added configuration files for an improved development experience"