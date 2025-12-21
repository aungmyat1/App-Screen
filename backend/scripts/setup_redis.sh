#!/bin/bash

# Redis setup script
# This script installs and starts Redis service

set -e  # Exit on any error

echo "Setting up Redis for AppScreens application..."

# Check if Redis is already installed
if command -v redis-server &> /dev/null; then
    echo "Redis is already installed. Version:"
    redis-server --version
else
    echo "Installing Redis..."
    sudo apt-get update
    sudo apt-get install -y redis-server
fi

# Start Redis service
echo "Starting Redis service..."
sudo service redis-server start

# Wait a moment for the service to start
sleep 2

# Test Redis connection
echo "Testing Redis connection..."
if redis-cli ping > /dev/null 2>&1; then
    echo "Redis is running and accessible!"
else
    echo "Failed to connect to Redis. Please check the service status."
    exit 1
fi

# Enable Redis to start on boot
sudo systemctl enable redis-server

echo ""
echo "Redis setup completed successfully!"
echo "Redis is now running and will start automatically on system boot."
echo ""
echo "To check Redis status manually, run:"
echo "  sudo service redis-server status"
echo ""
echo "To test Redis connection, run:"
echo "  redis-cli ping"