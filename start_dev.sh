#!/bin/bash

echo "Starting App-Screen development environment..."

# Set environment to development
export ENVIRONMENT=development

# Start infrastructure services in the background
echo "Starting PostgreSQL and Redis..."
docker-compose up -d db redis

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 10

# Verify services are running
echo "Verifying services..."
docker-compose ps

# Start backend API in the background
echo "Starting backend API server..."
cd backend
source venv/bin/activate
uvicorn src.main:app --host 0.0.0.0 --port 5000 --reload &

# Wait a bit for the backend to start
sleep 5

# Start frontend in the background
echo "Starting frontend development server..."
cd ..
npm run dev &

echo "Development environment started!"
echo "Backend API available at: http://localhost:5000"
echo "Backend API docs available at: http://localhost:5000/docs"
echo "Frontend available at: http://localhost:3000 (or as shown in the npm output)"
echo ""
echo "To stop everything, run: docker-compose down && pkill -f 'uvicorn\|npm'"