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

# Initialize Git LFS if it's a Git repository
if command -v git >/dev/null 2>&1 && [ -d .git ]; then
  echo "🔍 Git repository detected, checking Git LFS..."
  if git lfs version >/dev/null 2>&1; then
    echo "-lfs Initializing Git LFS..."
    git lfs install
  else
    echo "⚠️ Git LFS not available in this environment"
  fi
fi

echo "✅ Dev Container ready!"