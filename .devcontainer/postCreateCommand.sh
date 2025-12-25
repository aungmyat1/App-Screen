#!/bin/bash
set -e

echo "🎉 Post-create commands running..."

cd /workspaces/App-Screen

# Create default .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating default .env file..."
    cat > .env << EOF
# Environment variables
NODE_ENV=development
PYTHONPATH=/workspaces/App-Screen/backend
DATABASE_URL=postgresql://appscreens_user:appscreens_pass@postgres:5432/appscreens
REDIS_URL=redis://redis:6379
GEMINI_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
EOF
fi

echo "✨ Dev container is ready!"
echo "📊 Services:"
echo "  - PostgreSQL: localhost:5432"
echo "  - Redis: localhost:6379"
echo "  - Backend API: http://localhost:8000"
echo "  - Frontend: http://localhost:5173"