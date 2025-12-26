#!/bin/bash

# Script to start development services for App-Screen

echo "Starting development services..."

# Start backend services
if [ -d "/workspaces/App-Screen/backend" ]; then
    cd /workspaces/App-Screen/backend
    
    # Start the backend API server in development mode on port 5000
    if [ -f "start_api.sh" ]; then
        echo "Starting backend API server on port 5000..."
        # Create a temporary version of start_api.sh that runs on port 5000
        sed 's/--port 8000/--port 5000/' start_api.sh > start_api_dev.sh
        bash start_api_dev.sh &
        rm start_api_dev.sh  # Clean up temporary file
    elif [ -f "src/main.py" ]; then
        python -m uvicorn src.main:app --host 0.0.0.0 --port 5000 --reload &
    fi
    
    # Start Celery workers if they exist
    if [ -f "start_workers.sh" ]; then
        echo "Starting Celery workers..."
        bash start_workers.sh &
    elif [ -f "workers/worker.py" ]; then
        cd workers
        python worker.py &
    fi
fi

# Start the frontend development server if needed
if [ -f "/workspaces/App-Screen/package.json" ]; then
    cd /workspaces/App-Screen
    if [ -f "vite.config.ts" ] || [ -f "vite.config.js" ]; then
        echo "Starting frontend development server on port 3000..."
        npm run dev -- --host 0.0.0.0 &
    elif [ -f "start.sh" ]; then
        bash start.sh &
    fi
fi

echo "Development services started. Frontend on port 3000, Backend API on port 5000."
#!/bin/bash

# Post-start script for App-Screen SaaS Development DevContainer

echo "Starting App-Screen services..."

# Exit immediately if a command exits with a non-zero status
set -e

# Wait for services to be ready
echo "Waiting for PostgreSQL, Redis and MinIO to be ready..."
sleep 15

# Perform git operations if the workspace is a git repository
cd /workspaces/App-Screen
if [ -d ".git" ] || git rev-parse --git-dir > /dev/null 2>&1; then
    echo "Detected Git repository, performing Git operations..."
    
    # Configure git if not already configured
    if ! git config user.email > /dev/null 2>&1; then
        echo "Please configure your Git user.email before proceeding"
    fi
    
    if ! git config user.name > /dev/null 2>&1; then
        echo "Please configure your Git user.name before proceeding"
    fi
    
    # Initialize Git LFS if not already done (assuming it's already installed via Dockerfile)
    git lfs install
    
    # Check if the repository uses Git LFS by looking at .gitattributes
    echo "Checking if repository uses Git LFS..."
    if [ -f ".gitattributes" ]; then
        echo "Found .gitattributes file, checking for LFS entries:"
        grep -i "filter=lfs" .gitattributes || true
        if [ $? -eq 0 ]; then
            echo "Git LFS is being used in this repository."
            echo "LFS tracked files:"
            git lfs track || true
            
            # List LFS files to confirm they exist
            echo "Checking for existing LFS files in repository:"
            git lfs ls-files || true
            if [ $? -eq 0 ]; then
                echo "LFS files found - Git LFS is required for this repository."
            else
                echo "No LFS files found in repository."
            fi
            
            # Check for Git hooks that enforce LFS
            echo "Checking for Git LFS enforcement hooks..."
            if [ -d ".git/hooks" ]; then
                ls .git/hooks | grep -E "(pre-push|post-commit)" || true
                if [ $? -eq 0 ]; then
                    echo "Git LFS enforcement hooks found - LFS is required."
                else
                    echo "No LFS enforcement hooks found."
                fi
            else
                echo ".git/hooks directory does not exist"
            fi
        else
            echo "No LFS entries found in .gitattributes"
        fi
    else
        echo ".gitattributes file does not exist"
    fi
    
    # Pull latest changes
    echo "Pulling latest changes from origin/main..."
    git pull origin main || echo "Could not pull from origin/main (branch may not exist or no internet connection)"
else
    echo "Not a Git repository or Git not properly initialized"
fi

# Wait a bit more to ensure services are running
sleep 5

# Run health checks after services have started
echo "Running post-start health checks..."
if [ -f "/workspaces/App-Screen/.devcontainer/health-check.sh" ]; then
    chmod +x /workspaces/App-Screen/.devcontainer/health-check.sh
    bash /workspaces/App-Screen/.devcontainer/health-check.sh
    if [ $? -ne 0 ]; then
        echo "Post-start health checks failed"
    fi
else
    echo "Health check script not found, skipping health checks"
fi

echo "Services started successfully! The development environment is ready."
echo "Frontend should be available on port 3000"
echo "Backend API (dev) should be available on port 5000"
echo "PostgreSQL is on port 5432"
echo "Redis is on port 6379"
echo "MinIO is on port 9000"
echo "MailHog SMTP on port 1025, Web UI on port 8025"
echo ""
echo "To start development services, run: /workspaces/App-Screen/start_dev_services.sh"
#!/bin/bash

# Post-start script for Next.js Development DevContainer

echo "Next.js development environment ready!"
echo "You can now run your application with: npm run dev"