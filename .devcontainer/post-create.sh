#!/bin/bash
set -e

echo "🚀 Post-create setup..."

# Python venv
if [ ! -d "backend/venv" ] && [ -d "backend" ]; then
  echo "🐍 Creating Python virtual environment..."
  python -m venv backend/venv
fi

# Install Python dependencies
if [ -f "backend/requirements.txt" ]; then
  echo "📦 Installing Python dependencies..."
  source backend/venv/bin/activate
  pip install -r backend/requirements.txt
fi

# Install Node dependencies
if [ -f "package.json" ]; then
  echo "📦 Installing Node dependencies..."
  npm install
fi

# Copy env file if not exist
if [ ! -f ".env" ] && [ -f ".devcontainer/env.example" ]; then
  cp .devcontainer/env.example .env
fi

echo "✅ Dev Container ready!"