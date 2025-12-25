#!/bin/bash
set -e

echo "🚀 Setting up development environment..."

# Ensure we're in the workspace
cd /workspaces/App-Screen

# Install frontend dependencies if package.json exists
if [ -f "package.json" ]; then
    echo "📦 Installing Node.js dependencies..."
    npm ci
else
    echo "⚠️  No package.json found"
fi

# Install Python dependencies if requirements exist
if [ -f "backend/requirements.txt" ]; then
    echo "🐍 Installing Python dependencies..."
    pip install -r backend/requirements.txt
fi

# Install Playwright browsers
echo "🌐 Installing Playwright browsers..."
playwright install chromium

echo "✅ Setup complete!"