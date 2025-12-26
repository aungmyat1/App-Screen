#!/bin/bash
# Backup script for critical devcontainer configuration files

set -e

echo "Creating backups of critical configuration files..."

# Create timestamp for backup
timestamp=$(date +%Y%m%d_%H%M%S)

# Backup devcontainer.json if it exists
if [ -f ".devcontainer/devcontainer.json" ]; then
    cp .devcontainer/devcontainer.json .devcontainer/devcontainer.json.backup-$timestamp
    echo "Backed up devcontainer.json to .devcontainer/devcontainer.json.backup-$timestamp"
fi

# Backup Dockerfile if it exists
if [ -f ".devcontainer/Dockerfile" ]; then
    cp .devcontainer/Dockerfile .devcontainer/Dockerfile.backup-$timestamp
    echo "Backed up Dockerfile to .devcontainer/Dockerfile.backup-$timestamp"
fi

# Backup docker-compose files if they exist
if [ -f ".devcontainer/docker-compose.yml" ]; then
    cp .devcontainer/docker-compose.yml .devcontainer/docker-compose.yml.backup-$timestamp
    echo "Backed up docker-compose.yml to .devcontainer/docker-compose.yml.backup-$timestamp"
fi

if [ -f ".devcontainer/docker-compose.dev.yml" ]; then
    cp .devcontainer/docker-compose.dev.yml .devcontainer/docker-compose.dev.yml.backup-$timestamp
    echo "Backed up docker-compose.dev.yml to .devcontainer/docker-compose.dev.yml.backup-$timestamp"
fi

# Backup package files if they exist in workspace
if [ -f "/workspace/package.json" ]; then
    cp /workspace/package.json /workspace/package.json.backup-$timestamp
    echo "Backed up package.json to /workspace/package.json.backup-$timestamp"
fi

if [ -f "/workspace/package-lock.json" ]; then
    cp /workspace/package-lock.json /workspace/package-lock.json.backup-$timestamp
    echo "Backed up package-lock.json to /workspace/package-lock.json.backup-$timestamp"
fi

# Backup backend requirements if they exist
if [ -f "/workspace/backend/requirements.txt" ]; then
    cp /workspace/backend/requirements.txt /workspace/backend/requirements.txt.backup-$timestamp
    echo "Backed up backend requirements.txt to /workspace/backend/requirements.txt.backup-$timestamp"
fi

echo "Backup process completed!"
echo "Backups created with timestamp: $timestamp"