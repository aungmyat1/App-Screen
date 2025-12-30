#!/bin/bash

set -e  # Exit on error

echo "Setting up App-Screen development environment..."

# Set workspace root correctly
WORKSPACE_ROOT="/workspaces/App-Screen"
cd "$WORKSPACE_ROOT"

echo "✓ Working in: $(pwd)"

# Detect the OS to use the correct package manager
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$NAME
    VER=$VERSION_ID
    echo "Detected OS: $OS version $VER"
else
    echo "Cannot detect OS, assuming Debian/Ubuntu"
    OS="Debian GNU/Linux"
fi

# Install system dependencies based on OS
if [[ "$OS" == *"Alpine"* ]]; then
    echo "Installing system dependencies for Alpine Linux..."
    # Update package index
    sudo apk update
    # Install necessary packages
    sudo apk add --no-cache \
        postgresql-client \
        postgresql-dev \
        python3-dev \
        gcc \
        musl-dev \
        libffi-dev \
        openssl-dev \
        cargo \
        chromium \
        nss \
        freetype \
        harfbuzz \
        ca-certificates \
        ttf-freefont \
        font-noto-emoji \
        xauth \
        git-lfs \
        curl
else
    echo "Installing system dependencies for Ubuntu/Debian..."
    sudo apt-get update
    sudo apt-get install -y \
        postgresql-client \
        libpq-dev \
        python3-dev \
        build-essential \
        libglib2.0-0 \
        libnss3 \
        libnspr4 \
        libatk1.0-0 \
        libatk-bridge2.0-0 \
        libcups2 \
        libdrm2 \
        libdbus-1-3 \
        libxkbcommon0 \
        libxcomposite1 \
        libxdamage1 \
        libxfixes3 \
        libxrandr2 \
        libgbm1 \
        libasound2 \
        libatspi2.0-0 \
        libwayland-client0 \
        xvfb \
        x11-utils \
        x11-xserver-utils \
        xdg-utils \
        curl \
        git-lfs
fi

# Setup frontend
echo "Setting up frontend dependencies..."
if [ -f "package.json" ]; then
    npm install
    echo "✓ Frontend dependencies installed"
else
    echo "package.json not found"
    exit 1
fi

# Check if backend directory exists and has setup scripts
if [ -d "backend" ]; then
    echo "Setting up backend environment..."
    
    # Check if Python is needed for backend
    if [ -f "backend/setup_env.sh" ]; then
        echo "Running backend setup script..."
        cd backend
        chmod +x setup_env.sh
        bash setup_env.sh
        cd "$WORKSPACE_ROOT"
    fi
    
    # Setup Python virtual environment if needed
    if [ -f "backend/requirements.txt" ] || [ -f "backend/setup_env.sh" ]; then
        if [ ! -d "backend/venv" ]; then
            python3 -m venv backend/venv
        fi
        source backend/venv/bin/activate
        if [ -f "backend/requirements.txt" ]; then
            pip install -r backend/requirements.txt
        else
            pip install python-dotenv requests
        fi
    fi
    
    cd "$WORKSPACE_ROOT"
fi

# Make sure all shell scripts are executable
echo "Setting executable permissions for shell scripts..."
find . -name "*.sh" -type f -exec chmod +x {} \;

# Setup environment variables
echo "Setting up environment variables..."
if [ ! -f ".env.local" ] && [ -f ".env.example" ]; then
    cp .env.example .env.local
    echo "Created .env.local file from example"
elif [ ! -f ".env.local" ]; then
    echo "Creating basic .env.local file"
    touch .env.local
    echo "# Add your environment variables here" >> .env.local
    echo "GEMINI_API_KEY=" >> .env.local
    echo "Created basic .env.local file - please add your API key"
fi

# Setup Git LFS
echo "Setting up Git LFS..."
git lfs install

# Run health checks to validate the setup
echo "Running health checks..."
if [ -f "/workspaces/App-Screen/.devcontainer/health-check.sh" ]; then
    chmod +x /workspaces/App-Screen/.devcontainer/health-check.sh
    bash /workspaces/App-Screen/.devcontainer/health-check.sh
    if [ $? -ne 0 ]; then
        echo "Health checks failed, marking setup as failed"
        touch /tmp/devcontainer_setup_failed
        exit 1
    fi
else
    echo "Health check script not found, skipping health checks"
fi

echo "Setup complete! You can now run 'npm run dev' to start the development server."