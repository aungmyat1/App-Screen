# App-Screen Development Container Configuration

This directory contains the configuration for the DevContainer environment for the App-Screen project.

## Overview

The development container provides a complete environment for working on the App-Screen SaaS project with all necessary tools and dependencies pre-installed.

## Services

The development environment includes:

- **dev-environment**: Main development container with Python 3.11, Node.js 20, and all necessary tools
- **postgres**: PostgreSQL database running on port 5432
- **redis**: Redis cache and message broker running on port 6379
- **minio**: S3-compatible storage service running on port 9000
- **mailhog**: Email testing service with SMTP on port 1025 and web UI on port 8025

## Configuration

The devcontainer.json file configures:

- Python 3.11 and Node.js 20 environments
- Docker-in-Docker support
- GitHub CLI and AWS CLI tools
- VS Code extensions for both Python and TypeScript/React development
- Port forwarding for all necessary services
- Automatic setup and post-start scripts

## Setup Scripts

- `setup.sh`: Runs after the container is created, installs dependencies, and sets up the environment
- `post-start.sh`: Runs when the container starts, initializes services

## Ports

- 3000: Frontend development server
- 5000: Backend API development server
- 8000: Backend API production server
- 5432: PostgreSQL database
- 6379: Redis
- 9000: MinIO storage
- 1025: MailHog SMTP server
- 8025: MailHog web UI

## Volumes

The configuration includes persistent volumes for:
- PostgreSQL data
- Redis data
- MinIO data
- Node modules
- Python virtual environment

## Networks

All services run on a dedicated `appscreen-network` bridge network for proper communication.

## Usage

When using VS Code with the Remote-Containers extension, the development environment will be automatically configured when you open this folder. The setup scripts will install all necessary dependencies and start the required services.