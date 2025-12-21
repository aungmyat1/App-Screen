#!/bin/bash

# Exit on any error
set -e

# Setup script for Python environment and dependencies
echo "🚀 Starting setup of Python virtual environment..."

# Check if python is available
if ! command -v python &> /dev/null; then
    echo "❌ Python not found. Please install Python 3.7+ first."
    exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python -m venv venv
else
    echo "✅ Virtual environment already exists."
fi

# Activate virtual environment
echo "🔁 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "⏫ Upgrading pip..."
pip install --upgrade pip

# Install Python dependencies
if [ -f "requirements.txt" ]; then
    echo "📥 Installing Python dependencies from requirements.txt..."
    pip install -r requirements.txt
else
    echo "❌ Missing requirements.txt file. Please ensure it exists in the backend directory."
    exit 1
fi

# Install Playwright system dependencies
echo "🛠️ Installing Playwright system dependencies (may require sudo)..."
python -m playwright install-deps

# Install Chromium browser for Playwright
echo "🌐 Installing Chromium browser for Playwright..."
python -m playwright install chromium

# Final message
echo ""
echo "🎉 Setup complete!"
echo ""
echo "💡 To activate the virtual environment manually, run:"
echo "   source venv/bin/activate"
echo ""
echo "💡 To start the application, run your main script after activation."