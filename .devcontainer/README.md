# Dev Container Setup for App-Screen

This directory contains the configuration for the development container environment for the App-Screen project.

## Overview

The devcontainer provides a complete development environment with:
- Python 3.11 with all required dependencies
- Node.js 18 with npm
- PostgreSQL database
- Redis cache
- Playwright for browser automation
- All necessary VS Code extensions pre-installed

## What's Included

### Services
- `app`: Main application container with Python and Node.js
- `postgres`: PostgreSQL database for data persistence
- `redis`: Redis cache for session and temporary data

### VS Code Extensions
- Python & Pylance
- Flake8 linter
- TypeScript/JavaScript support
- Tailwind CSS IntelliSense
- Docker support

### Port Forwarding
- 54320: PostgreSQL (mapped to avoid conflicts)
- 63790: Redis (mapped to avoid conflicts)
- 8000: Backend API
- 5173: Frontend development server

## Setup Scripts

### `setup.sh`
- Installs frontend dependencies with `npm ci`
- Installs Python dependencies from `backend/requirements.txt`
- Installs Playwright browsers

### `postCreateCommand.sh`
- Creates a default `.env` file with environment variables
- Provides information about the dev container

## Configuration Notes

- PostgreSQL port is mapped to 54320 on the host to avoid conflicts if PostgreSQL is running locally
- Redis port is mapped to 63790 on the host for the same reason
- node_modules are persisted in a Docker volume to speed up dependency installation
- The database uses a persistent volume to maintain data between container restarts

## Usage

When opening this project in GitHub Codespaces or VS Code with Dev Containers enabled, the environment will be automatically set up with all required dependencies and services.