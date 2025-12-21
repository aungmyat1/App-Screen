# Database Setup

This directory contains all the database-related code for the AppScreens application.

## Directory Structure

```
database/
├── migrations/           # Raw SQL migration files
├── alembic/             # Alembic migration tool configuration
│   ├── versions/        # Generated migration scripts
│   └── env.py           # Alembic environment configuration
├── alembic.ini          # Alembic configuration file
├── connection.py        # Database connection setup
├── setup.py             # Database initialization script
└── utils.py             # Database utility functions
```

## Database Schema

The application uses PostgreSQL and consists of four main tables:

1. **users** - Stores user information and API keys
2. **scrape_jobs** - Tracks screenshot scraping jobs
3. **screenshots** - Stores information about individual screenshots
4. **api_usage** - Tracks API usage for analytics and billing

## Setup Instructions

1. Ensure PostgreSQL is installed and running
2. Create a database named `appscreens`
3. Update the database connection string in `alembic.ini` if needed
4. Run the database setup script:

```bash
python src/database/setup.py
```

## Migration Management

Alembic is used for database migrations:

- To create a new migration:
  ```bash
  alembic revision --autogenerate -m "Description of changes"
  ```

- To apply migrations:
  ```bash
  alembic upgrade head
  ```

## Tables Description

### users
Stores user account information including email, API key, subscription tier, and quota.

### scrape_jobs
Tracks each screenshot scraping job with status, timestamps, and error information.

### screenshots
Stores metadata about individual screenshots including URL, S3 key, and device information.

### api_usage
Records API usage statistics for analytics, billing, and rate limiting.

## Indexes

The schema includes the following indexes for performance:
- Index on `scrape_jobs.user_id` for faster user job lookups
- Index on `screenshots.job_id` for faster job screenshot retrieval
- Composite index on `api_usage.user_id` and `created_at` for usage analytics