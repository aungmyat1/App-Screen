# App-Screen Development Setup Guide

This document provides comprehensive information about the development environment and setup requirements for the App-Screen project.

## Table of Contents
- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Development Environment Setup](#development-environment-setup)
- [Running the Application](#running-the-application)
- [Development Best Practices](#development-best-practices)
- [Maintaining the Development Setup](#maintaining-the-development-setup)
- [WSL Troubleshooting](#wsl-troubleshooting)

## Project Overview

App-Screen is a full-stack application designed to automate the process of capturing screenshots from mobile app stores (App Store and Play Store). The system combines a React frontend with a FastAPI backend, leveraging Playwright for browser automation, Celery for asynchronous task processing, and Redis for caching.

**Core Features:**
- Automated screenshot capture from app stores
- Frontend React interface for user interaction
- Asynchronous task processing with Celery
- Caching with Redis for performance optimization
- Support for local and containerized deployment

## Technology Stack

### Frontend
- **Framework**: React v19.2.0
- **Build Tool**: Vite v6.2.0
- **Styling**: Tailwind CSS + PostCSS
- **Language**: TypeScript ~5.8.2
- **Router**: React Router v7.11.0

### Backend
- **Runtime**: Python 3.11+ (with support for Python 3.12)
- **Framework**: FastAPI 0.126.0
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Caching/Message Broker**: Redis
- **Browser Automation**: Playwright v1.57.0
- **Task Queue**: Celery
- **ASGI Server**: Uvicorn

### Infrastructure
- **Containerization**: Docker and Docker Compose
- **Deployment**: Kubernetes support
- **Monitoring**: Flower for Celery task monitoring

## Prerequisites

Before starting development, ensure your system has the following installed:

- **Node.js** (v18+ recommended, v24+ works as well)
- **Python** (v3.11+ or v3.12+)
- **npm** (v11+)
- **Docker** and **Docker Compose**
- **Git**

Optional tools for advanced development:
- **Kubernetes CLI** (kubectl)
- **Helm** (for advanced deployments)
- **Chrome Browser** (for debugging Playwright automation)

## Development Environment Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd App-Screen
```

### 2. Frontend Setup

1. Install frontend dependencies:
   ```bash
   npm install
   ```

2. Create environment file for frontend:
   ```bash
   echo "VITE_API_URL=http://localhost:8000" > .env.local
   ```

### 3. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Linux/Mac
   # or
   venv\Scripts\activate     # On Windows
   ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Install Playwright browsers:
   ```bash
   playwright install chromium
   ```

5. Set up environment variables in `backend/.env`:
   ```
   DATABASE_URL=postgresql://appscreen:password@localhost:5432/appscreen
   REDIS_URL=redis://localhost:6379
   GEMINI_API_KEY=your_api_key_here  # If using AI features
   ```

### 4. Database and Redis Setup

You can use Docker Compose to set up PostgreSQL and Redis:

```bash
# From the project root
docker-compose up -d db redis
```

Then run the database migrations:
```bash
cd backend
source venv/bin/activate
python -m src.database.init_db
```

## Running the Application

### Development Mode

For development with auto-reload, you have two options:

#### Option 1: Full Stack Development Server

Run the complete development environment:
```bash
./start_dev.sh
```

This script will:
1. Start PostgreSQL and Redis via Docker Compose
2. Start the backend API server with auto-reload
3. Start the frontend development server

#### Option 2: Manual Start

1. **Backend**: From the backend directory:
   ```bash
   source venv/bin/activate
   uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
   ```

2. **Frontend**: From the project root:
   ```bash
   npm run dev
   ```

### Production Mode

To run in production mode using Docker Compose:
```bash
docker-compose up --build
```

## Development Best Practices

### Environment Management
- Always use virtual environments for Python development
- Keep environment variables in `.env` files (and add them to `.gitignore`)
- Use consistent versions of Node.js and Python across the team

### Code Standards
- Follow TypeScript/JavaScript standards for frontend code
- Follow PEP8 standards for Python code
- Use meaningful variable and function names
- Write comprehensive comments and docstrings

### Git Workflow
- Use feature branches for new development
- Follow a consistent commit message format
- Update this document when making significant changes to the development environment

### Testing
- Write unit tests for backend API endpoints
- Test Playwright automation scripts regularly
- Ensure frontend components are properly tested

## Maintaining the Development Setup

This section details how to keep the development setup documentation current with project updates.

### When to Update This Document

Update this document when any of the following occur:
- Adding new dependencies to `package.json` or `requirements.txt`
- Changing the minimum required versions of Node.js, Python, or other tools
- Updating the Docker configuration
- Adding new environment variables
- Changing the database schema or adding new services
- Modifying the deployment process

### Update Process

1. **Identify Changes**: When making changes to the project that affect development setup, document them immediately.

2. **Update Dependencies**: 
   - If adding new packages to [package.json](file:///workspaces/App-Screen/package.json), update the Technology Stack section
   - If adding new packages to [requirements.txt](file:///workspaces/App-Screen/backend/requirements.txt), update the Technology Stack section

3. **Environment Changes**:
   - Note any new environment variables required
   - Update setup instructions if new services are required

4. **Infrastructure Changes**:
   - Update Docker Compose instructions if new services are added
   - Update Kubernetes deployment instructions if applicable

5. **Review Periodically**: 
   - Review this document quarterly to ensure it remains accurate
   - Test the setup instructions on a clean environment periodically

### Automated Checks

Consider implementing:
- A script that validates the development setup on a clean environment
- CI/CD checks that verify the setup process
- Dependency update notifications to keep packages current

### Version Tracking

Maintain a changelog section in this document for major development environment changes:

#### Recent Updates
- **December 2025**: Initial comprehensive development setup guide created
- **Technology versions updated**: Node.js v24+, Python v3.12+, React v19.2.0, FastAPI 0.126.0

## Troubleshooting

### Common Issues

1. **Playwright Installation Issues**:
   - Make sure system dependencies are installed: `npx playwright install-deps`
   - For Linux systems, additional packages might be needed

2. **Port Conflicts**:
   - Default ports: Frontend (3000), Backend (8000), PostgreSQL (5432), Redis (6379)
   - Change ports in [docker-compose.yml](file:///workspaces/App-Screen/docker-compose.yml) and environment files if needed

3. **Database Connection Issues**:
   - Verify PostgreSQL is running via Docker Compose
   - Check database connection strings in environment variables

## Additional Resources

- [API Documentation](backend/src/api/API_DOCUMENTATION.md)
- [Database Setup Guide](backend/src/database/DATABASE_SETUP.md)
- [Redis Configuration Guide](backend/src/config/REDIS.md)
- [Security Guidelines](backend/SECURITY.md)
- [Monitoring Setup](backend/MONITORING_SETUP.md)

## WSL Troubleshooting

If you're developing on Windows using WSL (Windows Subsystem for Linux), you may encounter specific issues related to file permissions, Docker integration, or Dev Container setup. This section provides guidance on resolving common WSL-related problems in the App-Screen development environment.

### Using the WSL Troubleshooting Script

The project includes a comprehensive troubleshooting script that addresses all common WSL issues. To use it, run the following command from your project directory:

```bash
# From WSL terminal or VS Code terminal inside Dev Container
./wsl_troubleshoot.sh
```

The script performs the following checks and provides recommendations:

1. **WSL Version Check**: Verifies your WSL version and provides instructions to upgrade to WSL 2 if necessary
2. **Docker Installation**: Confirms Docker is installed and running properly with WSL integration
3. **File Permissions**: Checks permissions for the project directory and important subdirectories
4. **VS Code Server Status**: Verifies VS Code server installation in the Dev Container
5. **Path Conversions**: Tests path conversion between Windows and Linux using `wslpath`
6. **VS Code Logs**: Examines VS Code server logs for deeper error messages
7. **Additional Checks**: Performs additional Dev Container and port availability checks

### Common WSL Issues and Solutions

#### 1. Updating to WSL 2

To ensure you're using WSL 2, run the following command in Windows PowerShell as Administrator:

```powershell
wsl --set-default-version 2
```

To convert an existing distribution to WSL 2:
```powershell
wsl --set-version <distro-name> 2
```

#### 2. Rebuilding Dev Container

To rebuild your Dev Container from VS Code:
1. Open the Command Palette (`Ctrl+Shift+P`)
2. Type "Dev Containers: Rebuild Container"
3. Select the command and confirm

#### 3. File Permissions Issues

If you're experiencing permission issues with files in your project directory, ensure your project is stored on a local NTFS drive rather than a network drive. Then run the troubleshooting script to check and fix permissions automatically.

#### 4. Docker Integration

Make sure Docker Desktop is running on Windows and WSL integration is enabled for your Linux distribution in Docker Desktop settings. The troubleshooting script will verify this configuration and provide guidance if issues are found.

#### 5. VS Code Server Issues

If VS Code server files aren't correctly installed in the container, try reconnecting to the Dev Container:
1. Open Command Palette (`Ctrl+Shift+P`)
2. Select "Dev Containers: Reopen in Container"

### Further Assistance

If the troubleshooting script doesn't resolve your issues, refer to the [WSL_TROUBLESHOOTING.md](WSL_TROUBLESHOOTING.md) file for more detailed instructions and support options. The file contains comprehensive information about diagnosing and resolving WSL-related development environment issues.