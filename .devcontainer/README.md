# App-Screen Dev Container

This is a development container configuration for the App-Screen full-stack application.

## Features
- Node.js 20 for frontend (React + Vite + Tailwind)
- Python 3.11 for backend (FastAPI)
- PostgreSQL database service
- Redis service for caching and background tasks
- Pre-configured VS Code extensions
- Volume caching for node_modules and Python virtual environment
- Port forwarding (3000 for frontend, 8000 for backend API)

## Getting Started

1. Open in VS Code with Dev Containers extension
2. Open command palette (Ctrl+Shift+P)
3. Select "Dev Containers: Reopen in Container"

## Manual Setup (if needed)

```bash
# Frontend
cd /workspaces/App-Screen-
npm install
npm run dev

# Backend
cd /workspaces/App-Screen-/backend
pip install -r requirements.txt
python -m uvicorn src.api.main:app --host 0.0.0.0 --port 8000
```

## Services
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- PostgreSQL: postgres://postgres:5432 (internal to container: postgres:5432)
- Redis: redis://redis:6379 (internal to container: redis:6379)

## Project Structure
```
/workspaces/App-Screen-        # Main project directory
├── backend/                   # Python backend with FastAPI
├── frontend/                  # React/Vite frontend
└── .devcontainer/             # Dev container configuration
```

# Development Container Setup

This project includes a development container configuration for VS Code, which provides a consistent development environment with all required dependencies pre-installed.

## Prerequisites

- Docker Desktop
- Visual Studio Code
- Remote - Containers extension for VS Code

## What's included

The development container includes:

- Python 3.11
- Node.js LTS
- PostgreSQL (as a separate service)
- Redis (as a separate service)
- All Python dependencies from [backend/requirements.txt](../backend/requirements.txt)
- All Node dependencies from [package.json](../package.json)
- Playwright browsers for screenshot functionality

## Using the Development Container

1. Open this project in VS Code
2. When prompted, click "Reopen in Container", or:
   - Press `Ctrl/Cmd+Shift+P` to open the command palette
   - Type "Remote-Containers: Reopen in Container" and select it
3. Wait for the container to build (this may take several minutes on first run)

## Services

Once the container is running, these services will be available:

- Main development container: localhost (access via VS Code terminal)
- Frontend development server: port 3000
- Backend API server: port 8000
- PostgreSQL database: port 5432
- Redis: port 6379

## Running the Applications

### Frontend

```bash
# In the integrated terminal
npm run dev
```

The frontend will be available at http://localhost:3000

### Backend

```bash
# In the integrated terminal
cd backend
./start.sh
```

The backend API will be available at http://localhost:8000

## Database Access

The PostgreSQL database is automatically configured. To connect:

- Host: postgres (from within the container)
- Port: 5432
- Database: appscreens
- User: appscreens_user
- Password: appscreens_pass

From the terminal:
```bash
psql postgresql://appscreens_user:appscreens_pass@postgres:5432/appscreens
```

## Redis Access

Redis is available at:

- Host: redis (from within the container)
- Port: 6379

## Troubleshooting

If you encounter issues:

1. Make sure Docker is running
2. Try rebuilding the container:
   - Press `Ctrl/Cmd+Shift+P`
   - Run "Remote-Containers: Rebuild Container"
3. Check that all required ports are available on your host machine
