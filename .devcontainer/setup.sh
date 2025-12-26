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
    echo "Cannot detect OS, assuming Alpine"
    OS="Alpine Linux"
fi

# Install system dependencies based on OS
if [[ "$OS" == *"Alpine"* ]]; then
    echo "Installing system dependencies for Alpine Linux..."
    # Update package index
    sudo apk update
    # Install necessary packages including those needed for Playwright
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
        git-lfs
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
        xdg-utils
fi

# Setup Python virtual environment in backend
echo "Setting up Python virtual environment..."
cd backend
if [ ! -d "venv" ]; then
    python -m venv venv
fi
source venv/bin/activate

# Upgrade pip and install Python dependencies
echo "Installing Python dependencies..."
pip install --upgrade pip setuptools wheel

# Install Rust for Alpine (needed for some Python packages)
if [ -f /etc/alpine-release ]; then
    echo "Installing Rust for Alpine Linux..."
    if [ ! -f "$HOME/.cargo/env" ]; then
        curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    fi
    source "$HOME/.cargo/env"
fi

# Install Python dependencies
if [ -f /etc/alpine-release ]; then
    # Use Alpine-specific requirements file that excludes Playwright
    if [ -f "requirements-alpine.txt" ]; then
        echo "Installing Alpine-specific requirements..."
        pip install -r requirements-alpine.txt
    else
        echo "Installing standard requirements..."
        pip install -r requirements.txt
    fi
else
    pip install -r requirements.txt
fi

# Install Playwright separately for non-Alpine systems
if [ ! -f /etc/alpine-release ]; then
    echo "Installing Playwright..."
    pip install playwright
    playwright install chromium
else
    # For Alpine, try to install Playwright but don't fail if it doesn't work
    echo "Attempting to install Playwright for Alpine (this may fail)..."
    if pip install playwright; then
        echo "✓ Playwright installed successfully on Alpine"
        python -m playwright install chromium
    else
        echo "⚠ Playwright could not be installed on Alpine Linux (this is expected)"
        echo "  You may need to use a different browser automation solution for this platform"
    fi
fi

# Setup frontend
echo "Setting up frontend..."
if [ -f "package.json" ]; then
    npm install
fi

# If there's a frontend directory, set it up separately
if [ -d "../frontend" ]; then
    cd ../frontend
    if [ -f "package.json" ]; then
        npm install
    fi
    cd ../backend
fi

# Setup environment variables
echo "Setting up environment variables..."
cd "$WORKSPACE_ROOT"
if [ ! -f ".env" ] && [ -f ".env.example" ]; then
    cp .env.example .env
    echo "Created .env file from example"
fi

# Setup database
echo "Setting up database..."
cd backend
if [ -f "setup_database.sh" ]; then
    bash setup_database.sh
elif [ -f "src/database/init_db.py" ]; then
    python -m src.database.init_db
else
    echo "Database setup script not found, skipping"
fi

# Install development tools
echo "Installing development tools..."
source venv/bin/activate
pip install black flake8 pytest

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

echo "Setup complete!"