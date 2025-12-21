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
