#!/bin/bash

# Post-create script for Next.js Development DevContainer

echo "Setting up Next.js development environment..."

# Exit immediately if a command exits with a non-zero status
set -e

# Install Node.js dependencies if package.json exists
if [ -f "/workspace/package.json" ]; then
    echo "Installing Node.js dependencies..."
    cd /workspace
    npm install
fi

# Setup Git configuration if needed
if ! git config user.email > /dev/null 2>&1; then
    echo "Please configure your Git email: git config --global user.email <your-email>"
fi

if ! git config user.name > /dev/null 2>&1; then
    echo "Please configure your Git username: git config --global user.name <your-username>"
fi

# Initialize Git LFS if .gitattributes exists
if [ -f "/workspace/.gitattributes" ]; then
    git lfs install
fi

# Set proper permissions for scripts
chmod +x /workspace/.devcontainer/post-start.sh

echo "Development environment setup complete!"
echo "Next steps:"
echo "1. If you haven't already, configure Git: git config --global user.email 'your-email@example.com'"
echo "2. Run your frontend with: cd /workspace && npm run dev"