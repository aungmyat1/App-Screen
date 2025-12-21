#!/bin/bash

# Database initialization script
# This script sets up the PostgreSQL database for the AppScreens application

set -e  # Exit on any error

echo "Initializing PostgreSQL database for AppScreens application..."

# Start PostgreSQL service
echo "Starting PostgreSQL service..."
sudo service postgresql start

# Wait a moment for the service to start
sleep 2

# Create database and user
echo "Creating database and user..."
sudo -u postgres psql << EOF
-- Create user if not exists
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'appscreens_user') THEN
    CREATE USER appscreens_user WITH PASSWORD 'appscreens_pass';
  END IF;
END
\$\$;

-- Create database if not exists
SELECT 'CREATE DATABASE appscreens OWNER appscreens_user'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'appscreens')\gexec

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE appscreens TO appscreens_user;
EOF

echo "Database and user created successfully!"

# Update database URL in environment
echo "Updating database connection configuration..."
cd /workspaces/App-Screen-/backend

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    cp .env.example .env
fi

# Update the DATABASE_URL in .env file
sed -i 's|DATABASE_URL=.*|DATABASE_URL=postgresql://appscreens_user:appscreens_pass@localhost:5432/appscreens|' .env

echo "Database initialization completed!"
echo ""
echo "To run database migrations, execute:"
echo "  cd src/database && python setup_comprehensive.py"
echo ""
echo "Or use the setup script:"
echo "  ./setup_database.sh"