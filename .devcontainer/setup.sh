#!/bin/bash

# Setup script for App-Screen SaaS Development DevContainer

echo "Setting up App-Screen development environment..."

# Create necessary directories
mkdir -p /workspace

# Install Python dependencies from backend directory
if [ -f "/workspace/backend/requirements.txt" ]; then
    pip install --upgrade pip
    pip install -r /workspace/backend/requirements.txt
else
    echo "Warning: /workspace/backend/requirements.txt not found"
fi

# Install Node.js dependencies if package.json exists at root
if [ -f "/workspace/package.json" ]; then
    cd /workspace
    npm install
fi

# Install backend Node dependencies if needed
if [ -f "/workspace/backend/package.json" ]; then
    cd /workspace/backend
    npm install
fi

# Install Playwright browsers
echo "Installing Playwright browsers..."
playwright install chromium

# Install additional dependencies if needed
if [ -f "/workspace/backend/install_deps.sh" ]; then
    bash /workspace/backend/install_deps.sh
fi

# Set up the database
if [ -f "/workspace/backend/setup_database.sh" ]; then
    bash /workspace/backend/setup_database.sh
elif [ -f "/workspace/backend/src/database/init_db.py" ]; then
    cd /workspace/backend
    python -m pip install psycopg2-binary
    python src/database/init_db.py
fi

# Set up environment variables
if [ ! -f "/workspace/.env" ]; then
    echo "Creating .env file from example..."
    if [ -f "/workspace/.env.example" ]; then
        cp /workspace/.env.example /workspace/.env
    else
        touch /workspace/.env
        echo "# Development environment variables" > /workspace/.env
        echo "DATABASE_URL=postgresql://appscreen:devpass@postgres:5432/appscreen_db" >> /workspace/.env
        echo "REDIS_URL=redis://redis:6379/0" >> /workspace/.env
        echo "MINIO_ACCESS_KEY=minioadmin" >> /workspace/.env
        echo "MINIO_SECRET_KEY=minioadmin123" >> /workspace/.env
        echo "MINIO_ENDPOINT=minio" >> /workspace/.env
        echo "MINIO_PORT=9000" >> /workspace/.env
        echo "STRIPE_SECRET_KEY=your_test_key_here" >> /workspace/.env
        echo "STRIPE_WEBHOOK_SECRET=your_webhook_secret_here" >> /workspace/.env
        echo "MAIL_HOST=mailhog" >> /workspace/.env
        echo "MAIL_PORT=1025" >> /workspace/.env
    fi
fi

# Create init-scripts directory if needed for PostgreSQL
mkdir -p /workspace/.devcontainer/init-scripts

# Install additional Python packages that might be needed for development
pip install black flake8 pytest

echo "Setup complete!"