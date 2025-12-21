#!/bin/bash

# Redis persistent setup script
# This script configures Redis with both AOF and RDB persistence

set -e  # Exit on any error

echo "Setting up Redis with AOF+RDB persistence for AppScreens application..."

# Check if Redis is installed
if ! command -v redis-server &> /dev/null; then
    echo "Redis is not installed. Installing Redis..."
    sudo apt-get update
    sudo apt-get install -y redis-server
fi

echo "Current Redis version:"
redis-server --version

# Copy our custom configuration
echo "Copying custom Redis configuration..."
sudo cp /workspaces/App-Screen-/backend/config/redis-persistent.conf /etc/redis/redis.conf

# Create necessary directories
sudo mkdir -p /var/lib/redis
sudo mkdir -p /var/log/redis
sudo mkdir -p /var/run/redis

# Set proper ownership
sudo chown redis:redis /var/lib/redis
sudo chown redis:redis /var/log/redis
sudo chown redis:redis /var/run/redis

# Restart Redis with new configuration
echo "Restarting Redis with persistent configuration..."
sudo systemctl restart redis-server

# Wait a moment for the service to start
sleep 3

# Test Redis connection
echo "Testing Redis connection..."
if redis-cli ping > /dev/null 2>&1; then
    echo "Redis is running with persistent configuration!"
else
    echo "Failed to connect to Redis. Please check the service status."
    exit 1
fi

# Verify persistence settings
echo "Verifying persistence configuration:"
echo "- RDB snapshots: $(redis-cli CONFIG GET save | tail -n 1)"
echo "- AOF enabled: $(redis-cli CONFIG GET appendonly | tail -n 1)"
echo "- AOF filename: $(redis-cli CONFIG GET appendfilename | tail -n 1)"
echo "- AOF fsync: $(redis-cli CONFIG GET appendfsync | tail -n 1)"

# Enable Redis to start on boot
sudo systemctl enable redis-server

echo ""
echo "Redis persistence setup completed successfully!"
echo "Redis is now running with both AOF and RDB persistence enabled."
echo ""
echo "To check Redis status manually, run:"
echo "  sudo systemctl status redis-server"
echo ""
echo "To test Redis connection, run:"
echo "  redis-cli ping"