#!/bin/bash

# Redis Sentinel setup script
# This script configures Redis Sentinel for high availability

set -e  # Exit on any error

echo "Setting up Redis Sentinel for high availability..."

# Check if Redis is installed
if ! command -v redis-sentinel &> /dev/null; then
    echo "Redis Sentinel is not installed. Installing Redis..."
    sudo apt-get update
    sudo apt-get install -y redis-server
fi

# Copy our sentinel configuration
echo "Copying Sentinel configuration..."
sudo cp /workspaces/App-Screen/backend/config/sentinel.conf /etc/redis/sentinel.conf

# Set proper ownership
sudo chown redis:redis /etc/redis/sentinel.conf

# Create necessary directories
sudo mkdir -p /var/log/redis
sudo touch /var/log/redis/sentinel.log
sudo chown redis:redis /var/log/redis/sentinel.log

# Create systemd service file for Sentinel
echo "Creating Sentinel systemd service..."
sudo tee /etc/systemd/system/redis-sentinel.service > /dev/null <<EOF
[Unit]
Description=Advanced key-value store (sentinel)
After=network.target

[Service]
Type=forking
ExecStart=/usr/bin/redis-sentinel /etc/redis/sentinel.conf
PIDFile=/var/run/redis-sentinel.pid
TimeoutStopSec=0
Restart=always

[Install]
WantedBy=multi-user.target
Alias=redis-sentinel.service
EOF

# Reload systemd
sudo systemctl daemon-reload

# Start Sentinel
echo "Starting Redis Sentinel..."
sudo systemctl start redis-sentinel

# Wait a moment for the service to start
sleep 3

# Enable Sentinel to start on boot
sudo systemctl enable redis-sentinel

# Test Sentinel connection
echo "Testing Sentinel connection..."
if redis-cli -p 26379 ping > /dev/null 2>&1; then
    echo "Redis Sentinel is running!"
    
    # Show Sentinel status
    echo "Sentinel master status:"
    redis-cli -p 26379 SENTINEL masters
else
    echo "Failed to connect to Redis Sentinel. Please check the service status."
    exit 1
fi

echo ""
echo "Redis Sentinel setup completed successfully!"
echo "Redis Sentinel is now running and monitoring the Redis master."
echo ""
echo "To check Sentinel status manually, run:"
echo "  sudo systemctl status redis-sentinel"
echo ""
echo "To test Sentinel connection, run:"
echo "  redis-cli -p 26379 ping"
echo ""
echo "To check monitored masters, run:"
echo "  redis-cli -p 26379 SENTINEL masters"