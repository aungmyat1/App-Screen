#!/bin/bash
# Rollback script for App-Screen development environment

set -e

echo "Starting rollback process..."

# Function to print error and exit
error_exit() {
    echo "ERROR: $1" >&2
    exit 1
}

# Check if we're in a git repository
if [ ! -d "/workspace/.git" ] && ! git -C /workspace rev-parse --git-dir >/dev/null 2>&1; then
    error_exit "Not in a git repository, cannot rollback"
fi

cd /workspace

# Get the current branch
current_branch=$(git branch --show-current 2>/dev/null || git rev-parse --abbrev-ref HEAD 2>/dev/null)
if [ -z "$current_branch" ]; then
    error_exit "Could not determine current branch"
fi

echo "Current branch: $current_branch"

# Try to restore .devcontainer files to previous state
echo "Restoring .devcontainer configuration files..."
if git show HEAD@{1}:.devcontainer/devcontainer.json 2>/dev/null; then
    echo "Found previous devcontainer.json in git history"
    git show HEAD@{1}:.devcontainer/devcontainer.json > .devcontainer/devcontainer.json.tmp && \
    mv .devcontainer/devcontainer.json.tmp .devcontainer/devcontainer.json && \
    echo "Restored devcontainer.json from previous commit"
else
    echo "Could not find previous devcontainer.json in git history"
fi

if git show HEAD:.devcontainer/devcontainer.json 2>/dev/null; then
    echo "Validating current devcontainer.json..."
    if python -m json.tool .devcontainer/devcontainer.json >/dev/null 2>&1; then
        echo "✓ Current devcontainer.json is valid JSON"
    else
        echo "Current devcontainer.json is invalid, restoring from backup if available"
        if [ -f ".devcontainer/devcontainer.json.tmp" ]; then
            mv .devcontainer/devcontainer.json.tmp .devcontainer/devcontainer.json
        fi
    fi
else
    echo "Could not validate current devcontainer.json"
fi

# Check if we have a backup of Dockerfile
if [ -f ".devcontainer/Dockerfile.backup" ]; then
    echo "Restoring Dockerfile from backup..."
    cp .devcontainer/Dockerfile.backup .devcontainer/Dockerfile
    echo "Dockerfile restored from backup"
fi

# Check if we have a backup of compose files
if [ -f ".devcontainer/docker-compose.yml.backup" ]; then
    echo "Restoring docker-compose.yml from backup..."
    cp .devcontainer/docker-compose.yml.backup .devcontainer/docker-compose.yml
    echo "docker-compose.yml restored from backup"
fi

# If setup failed during post-create, try to reset the workspace to a known good state
if [ -f "/tmp/devcontainer_setup_failed" ]; then
    echo "Setup failed flag detected, performing additional rollback steps..."
    
    # Remove any partially installed dependencies
    if [ -d "/workspace/node_modules" ] && [ ! -s "/workspace/node_modules/package-lock.json" ]; then
        echo "Removing incomplete node_modules..."
        rm -rf /workspace/node_modules
    fi
    
    # Try to restore package-lock.json if it was corrupted
    if [ -f "/workspace/package-lock.json.backup" ]; then
        echo "Restoring package-lock.json from backup..."
        cp /workspace/package-lock.json.backup /workspace/package-lock.json
    fi
    
    # Clean up any temporary files
    rm -f /tmp/devcontainer_setup_failed
fi

echo "Rollback process completed!"
echo "Note: You may need to rebuild the container for changes to take effect."
echo "To rebuild: Run 'Codespaces: Rebuild Container' from the command palette (F1)"