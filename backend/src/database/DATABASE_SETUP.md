# Database Setup Guide

This document explains how to set up the PostgreSQL database for the AppScreens application.

## Schema Overview

The database consists of four main tables:

1. **users** - Stores user information and API keys
2. **scrape_jobs** - Tracks scraping jobs initiated by users
3. **screenshots** - Stores information about captured screenshots
4. **api_usage** - Logs API usage statistics

## Prerequisites

- PostgreSQL server installed and running
- Database user with appropriate permissions
- Python environment with required dependencies installed

## Setup Process

### 1. Configure Database Connection

Set the `DATABASE_URL` environment variable:

```bash
export DATABASE_URL=postgresql://username:password@localhost:5432/database_name
```

Or modify the default in [connection.py](file:///workspaces/App-Screen-/backend/src/database/connection.py):

```python
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://appscreens_user:appscreens_pass@localhost:5432/appscreens")
```

### 2. Run Database Setup

You can set up the database in two ways:

#### Option A: Automated Setup (Recommended)

From the backend directory, run:

```bash
./setup_database.sh
```

#### Option B: Manual Setup

Navigate to the database directory and run:

```bash
cd src/database
python setup_comprehensive.py
```

### 3. Verify Setup

The setup script will automatically verify that all tables and indexes have been created correctly.

## Schema Details

### users
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    api_key VARCHAR(64) UNIQUE NOT NULL,
    tier VARCHAR(20) DEFAULT 'free',
    quota_remaining INTEGER DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### scrape_jobs
```sql
CREATE TABLE scrape_jobs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    app_id VARCHAR(255) NOT NULL,
    store VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    screenshots_count INTEGER DEFAULT 0,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### screenshots
```sql
CREATE TABLE screenshots (
    id SERIAL PRIMARY KEY,
    job_id INTEGER REFERENCES scrape_jobs(id),
    url TEXT NOT NULL,
    s3_key VARCHAR(512),
    device_type VARCHAR(20),
    resolution VARCHAR(20),
    file_size INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### api_usage
```sql
CREATE TABLE api_usage (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    endpoint VARCHAR(100),
    response_time_ms INTEGER,
    status_code INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Indexes

For optimal performance, the following indexes are created:

1. `idx_scrape_jobs_user_id` on `scrape_jobs(user_id)`
2. `idx_screenshots_job_id` on `screenshots(job_id)`
3. `idx_api_usage_user_created` on `api_usage(user_id, created_at)`

## Troubleshooting

If you encounter issues during setup:

1. Ensure PostgreSQL is running:
   ```bash
   sudo systemctl status postgresql
   ```

2. Verify database connectivity:
   ```bash
   psql $DATABASE_URL
   ```

3. Check that the database user has CREATE TABLE permissions

4. Make sure all Python dependencies are installed:
   ```bash
   pip install -r requirements.txt
   ```