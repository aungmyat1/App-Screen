#!/bin/bash

set -e

echo "🚀 Setting up App-Screen development environment..."

# Wait for PostgreSQL and Redis to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Frontend setup
echo "📦 Installing Node.js dependencies..."
cd /workspaces/App-Screen
npm install

# Backend setup
echo "🐍 Setting up Python backend..."
cd /workspaces/App-Screen/backend

# Install Python dependencies
if [ -f "requirements.txt" ]; then
    pip install --upgrade pip
    pip install -r requirements.txt
fi

# Install Playwright browser
python -m playwright install chromium

# Database setup (using SQLite as in the current configuration)
echo "🗄️ Setting up database..."
cd /workspaces/App-Screen/backend
python -m src.database.init_db

# Create/update .env file if needed
if [ ! -f "/workspaces/App-Screen/backend/.env" ]; then
    echo "📝 Creating .env file..."
    cp /workspaces/App-Screen/backend/.env.example /workspaces/App-Screen/backend/.env
fi

# Update the .env file to use PostgreSQL if services are available
if grep -q "DATABASE_URL=sqlite" "/workspaces/App-Screen/backend/.env"; then
    sed -i 's|DATABASE_URL=sqlite.*|DATABASE_URL=postgresql://appscreens_user:appscreens_pass@postgres:5432/appscreens|' "/workspaces/App-Screen/backend/.env"
    echo "🔧 Updated .env to use PostgreSQL service"
fi

if grep -q "REDIS_URL=redis" "/workspaces/App-Screen/backend/.env"; then
    sed -i 's|REDIS_URL=redis.*|REDIS_URL=redis://redis:6379/0|' "/workspaces/App-Screen/backend/.env"
    echo "🔧 Updated .env to use Redis service"
fi

# Install frontend dependencies again to ensure they're properly cached
cd /workspaces/App-Screen
npm install

echo "✅ Setup complete!"
echo ""
echo "📋 Available commands:"
echo "   Frontend: npm run dev"
echo "   Backend API: cd backend && python -m uvicorn src.api.main:app --host 0.0.0.0 --port 8000"
echo ""
echo "🌐 Ports:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://localhost:5173"
echo ""
echo "💾 Services:"
echo "   - PostgreSQL: postgres:5432"
echo "   - Redis: redis:6379"