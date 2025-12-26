# App-Screen Development Container Setup

This repository includes a pre-configured development container for a consistent development environment. This document provides instructions for setting up and using the development container.

## Prerequisites

- Visual Studio Code with the Remote Development extension pack
- Docker Desktop (with WSL 2 backend if on Windows)
- Git

## Quick Start

1. Clone this repository
2. Open the repository in VS Code
3. When prompted to "Reopen in Container", click "Reopen in Container"
   - Or, open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) and select "Dev Containers: Reopen in Container"

## WSL 2 Optimization (Windows Users)

If you're using WSL 2 on Windows, you can optimize performance by creating a `.wslconfig` file in your home directory (`C:\Users\<YourUsername>\.wslconfig`):

```ini
[wsl2]
# Increase memory limits for better performance with multiple services
memory=8GB

# Increase processor cores for faster builds
processors=4

# Allocate more swap space if needed
swap=2GB

# Enable nested virtualization (if supported)
nestedVirtualization=true

# Optimized kernel command line parameters
kernelCommandLine="vs-wsl utsnamespace=usernamespace"
```

After creating this file, restart WSL:
```bash
wsl --shutdown
```

## Services Included

The development container includes:

- Python 3.11 with virtual environment setup
- Node.js 20 with npm
- PostgreSQL 15
- Redis 7
- MinIO (S3-compatible storage)
- MailHog (email testing)
- Docker-in-Docker support
- Essential build tools

## Ports Forwarded

- `3000`: Frontend (React/Vite)
- `5000`: Backend API (Python/Flask)
- `5173`: Vite Dev Server
- `5432`: PostgreSQL
- `6379`: Redis
- `9000`: MinIO
- `9001`: MinIO Console
- `8025`: MailHog Web UI
- `1025`: MailHog SMTP

## Development Workflow

1. After the container is set up, run `/workspace/start_dev_services.sh` to start all development services
2. The script will start:
   - Backend API server on port 5000
   - Frontend development server on port 3000
   - Any background workers (Celery, etc.)

## Troubleshooting

### Slow Startup
- Ensure you've configured WSL 2 properly with sufficient memory
- Check that your project directory is stored on an SSD
- Make sure you have sufficient CPU and RAM allocated to WSL

### Docker Issues
- Verify that Docker Desktop is running
- Ensure the "Docker WSL 2 Backend" is enabled in Docker settings
- Check that the Docker-in-Docker service is working properly

### Git LFS Issues
- The container should automatically initialize Git LFS
- If you encounter issues, run `git lfs install` manually
- Check that large files are properly tracked with `git lfs ls-files`

### Python Virtual Environment
- The Python virtual environment is automatically created in `/workspace/backend/venv`
- It's shared between container rebuilds via a Docker volume
- To activate it manually: `source /workspace/backend/venv/bin/activate`

## Customization

You can customize the development environment by modifying:

- [.devcontainer/devcontainer.json](devcontainer.json): Main configuration file
- [.devcontainer/Dockerfile](Dockerfile): Base image configuration
- [.devcontainer/docker-compose.yml](docker-compose.yml): Service definitions
- [.devcontainer/post-create.sh](post-create.sh): Setup script run after container creation
- [.devcontainer/post-start.sh](post-start.sh): Script run after container starts

# DevContainer Best Practices for Reliable Codespace Setup

This directory contains configuration and scripts that implement best practices for a reliable Codespace setup.

## Features Implemented

### 1. Version Control for Configuration Files
- All critical configuration files are tracked in Git
- Backup script (`backup-configs.sh`) creates timestamped backups of important files before setup
- Automatic backup of:
  - `devcontainer.json`
  - `Dockerfile`
  - `docker-compose.yml`
  - `package.json` and `package-lock.json`
  - Backend `requirements.txt`

### 2. Feature Flags and Metadata
- Added Python feature with version 3.11 in `devcontainer.json`
- Proper feature installation order using `overrideFeatureInstallOrder`
- Metadata with `lastWorkingVersion` and `fallbackVersion` for tracking stable configurations

### 3. Health Checks
- `health-check.sh` validates:
  - Correct Python (3.11) and Node.js (v20) versions
  - Installation of required packages (pip, npm, git, docker, etc.)
  - Backend dependencies (FastAPI, Redis, Celery)
  - Frontend dependencies (node_modules)
  - Running services

### 4. Automated Rollback
- `rollback.sh` script to revert to previous working configuration
- Handles corrupted package installations
- Restores backup files when setup fails

### 5. Validation Script
- `validate.sh` checks if the setup is working correctly
- Validates backend and frontend requirements
- Checks for running services on expected ports

### 6. Enhanced Post-Create Command
- Backs up configuration files before setup
- Runs setup script with error handling
- Performs validation after setup
- Initiates rollback if setup fails

### 7. Port Configuration
- All relevant ports are properly configured:
  - 3000: Frontend
  - 5000: Backend API
  - 5432: PostgreSQL
  - 6379: Redis
  - 9000: MinIO

## Recovery Process

### Manual Recovery
1. Open command palette (F1)
2. Run "Codespaces: Rebuild Container"
3. Select "Rebuild with configuration in 'devcontainer.json'"

### Automated Recovery
- The container will automatically run the rollback script if the primary setup script exits with non-zero status.

### Git-based Recovery
- In case of configuration issues, you can revert to a previous commit that contains the .devcontainer changes.

## Scripts Overview

- `backup-configs.sh`: Creates timestamped backups of critical config files
- `health-check.sh`: Validates the development environment setup
- `validate.sh`: Performs comprehensive validation of installed components
- `rollback.sh`: Reverts to a previous working configuration
- `setup.sh`: Extended to include health checks
- `post-start.sh`: Includes post-start health checks
