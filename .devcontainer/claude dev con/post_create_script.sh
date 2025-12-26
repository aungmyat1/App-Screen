#!/bin/bash
set -e

echo "🚀 Starting post-create setup for App-Screen..."

# Set working directory
cd /workspace

# Configure git safe directory
git config --global --add safe.directory /workspace

# Setup Python virtual environment for backend
if [ -d "backend" ]; then
    echo "📦 Setting up Python backend..."
    cd backend
    
    if [ ! -d ".venv" ]; then
        python3 -m venv .venv
    fi
    
    source .venv/bin/activate
    
    if [ -f "requirements.txt" ]; then
        pip install --upgrade pip
        pip install -r requirements.txt
        echo "✅ Backend Python dependencies installed"
    fi
    
    deactivate
    cd ..
fi

# Install root level Python dependencies if exists
if [ -f "requirements.txt" ] && [ ! -d "backend" ]; then
    echo "📦 Setting up Python dependencies..."
    python3 -m venv .venv
    source .venv/bin/activate
    pip install --upgrade pip
    pip install -r requirements.txt
    echo "✅ Python dependencies installed"
    deactivate
fi

# Setup Node.js dependencies for frontend
if [ -f "package.json" ]; then
    echo "📦 Installing Node.js dependencies..."
    
    # Detect package manager
    if [ -f "pnpm-lock.yaml" ]; then
        echo "Using pnpm..."
        pnpm install
    elif [ -f "yarn.lock" ]; then
        echo "Using yarn..."
        yarn install
    else
        echo "Using npm..."
        npm install
    fi
    
    echo "✅ Frontend dependencies installed"
fi

# Setup screenshot-saas directory if exists
if [ -d "screenshot-saas" ]; then
    echo "📦 Setting up screenshot-saas..."
    cd screenshot-saas
    
    if [ -f "package.json" ]; then
        if [ -f "pnpm-lock.yaml" ]; then
            pnpm install
        elif [ -f "yarn.lock" ]; then
            yarn install
        else
            npm install
        fi
        echo "✅ Screenshot-saas dependencies installed"
    fi
    
    cd ..
fi

# Setup Chrome extension
if [ -d "chrome-extension" ]; then
    echo "🧩 Setting up Chrome extension..."
    cd chrome-extension
    
    if [ -f "package.json" ]; then
        if [ -f "pnpm-lock.yaml" ]; then
            pnpm install
        elif [ -f "yarn.lock" ]; then
            yarn install
        else
            npm install
        fi
        echo "✅ Chrome extension dependencies installed"
    fi
    
    cd ..
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ] && [ -f ".env.example" ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update .env with your configuration"
fi

# Create .env.local for Gemini API if needed
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
# Gemini API Configuration
GEMINI_API_KEY=your_api_key_here

# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/appscreen

# Redis Configuration
REDIS_URL=redis://localhost:6379

# App Configuration
NODE_ENV=development
PORT=3000
BACKEND_PORT=5000
EOF
    echo "⚠️  Please update .env.local with your API keys"
fi

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL..."
until pg_isready -h localhost -p 5432 -U postgres > /dev/null 2>&1; do
    sleep 1
done
echo "✅ PostgreSQL is ready"

# Run database migrations if they exist
if [ -d "backend/migrations" ] || [ -d "migrations" ]; then
    echo "🗄️  Running database migrations..."
    # Add migration commands here based on your setup
    # Example: python backend/manage.py migrate
fi

echo "
╔════════════════════════════════════════════════════════════╗
║  ✅ App-Screen Development Environment Ready!              ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  Frontend:         npm run dev          (Port 3000/5173)  ║
║  Backend:          python backend/app.py (Port 5000/8000) ║
║  PostgreSQL:       localhost:5432                         ║
║  Redis:            localhost:6379                         ║
║                                                            ║
║  📝 Don't forget to:                                       ║
║     1. Update .env.local with your API keys               ║
║     2. Configure database credentials if needed           ║
║     3. Build Chrome extension: cd chrome-extension        ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
"