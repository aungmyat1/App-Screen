# App-Screen Development Container Setup

This development container provides a complete environment for working on the App-Screen project, with all necessary tools and dependencies pre-installed.

## What's Included

- **Node.js 20** with npm
- **Python 3.11** with virtual environment
- **PostgreSQL 15** database service
- **Redis** for caching and task queues
- **Playwright** with Chromium, Firefox, and WebKit browsers
- **Git** with Git LFS support
- **GitHub CLI**
- VS Code extensions for Python, TypeScript, React, Tailwind CSS, and more

## Services Configuration

The devcontainer automatically starts these services:

- **Backend API**: FastAPI application on port 8000
- **Frontend Dev Server**: Vite development server on port 5173
- **PostgreSQL**: Database on port 5432
- **Redis**: Cache/queue on port 6379

## Automatic Startup

When you attach to the devcontainer, the services are automatically started using the `start_services.sh` script. You can see the status of the services in the terminal output.

## Manual Service Control

If you need to manually control the services, you can use these scripts:

- Start services: `/workspaces/App-Screen/start_services.sh`
- Stop services: `/workspaces/App-Screen/stop_services.sh`

The services log their output to `/tmp/services.log` where you can check for any issues.

## Ports

The following ports are automatically forwarded:

- `8000`: Backend API server
- `5173`: Frontend Vite development server
- `5432`: PostgreSQL database
- `6379`: Redis server

## Available Commands

From the workspace root:

```bash
# Start both backend and frontend services
./start_services.sh

# Stop running services
./stop_services.sh

# Start backend API only
cd backend && /opt/venv/bin/uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --reload

# Start frontend only
npm run dev
```

## Troubleshooting

1. **Services not starting**: Check `/tmp/services.log` for error messages
2. **Port conflicts**: Ensure ports 8000 and 5173 are available
3. **Dependency issues**: The `postCreateCommand` should install all dependencies, but you can run `npm install` and `pip install -r requirements.txt` again if needed
