# AppScreens Backend

This is the backend service for the AppScreens application, which provides APIs for downloading app store screenshots.

## Requirements

- Python 3.11+
- Virtual environment (recommended)
- PostgreSQL database
- Redis (for caching and background tasks)

## Setup

1. Create a virtual environment:
   ```bash
   python3 -m venv venv
   ```

2. Activate the virtual environment:
   ```bash
   source venv/bin/activate  # On Linux/Mac
   # or
   venv\Scripts\activate     # On Windows
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Install Playwright browsers:
   ```bash
   playwright install chromium
   ```

5. Set up the database:
   See [Database Setup Guide](src/database/DATABASE_SETUP.md) for detailed instructions.
   
   Quick setup:
   ```bash
   ./setup_database.sh
   ```

6. PostgreSQL setup:
   See [PostgreSQL Setup Guide](src/database/POSTGRESQL_SETUP.md) for detailed instructions.
   
   Quick setup:
   ```bash
   ./scripts/init_db.sh
   ```

7. Redis setup:
   See [Redis Setup Guide](src/config/REDIS.md) for detailed instructions.
   
   Quick setup:
   ```bash
   ./scripts/setup_redis.sh
   ```

8. Redis persistence and high availability (optional, for production):
   See [Redis Persistence and HA Setup](src/config/REDIS_PERSISTENCE_HA.md) for detailed instructions.
   
   Quick setup:
   ```bash
   # Setup Redis with AOF+RDB persistence
   ./scripts/setup_persistent_redis.sh
   
   # Setup Redis Sentinel for high availability
   ./scripts/setup_sentinel.sh
   
   # Warm the cache with popular app data
   ./scripts/warm_cache.sh
   ```

## Running the Application

To start the development server:

```bash
./start.sh
```

Or run directly with uvicorn:

```bash
source venv/bin/activate
uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
```

For the new FastAPI application structure:

```bash
./start_api.sh
```

Or run directly with uvicorn:

```bash
source venv/bin/activate
uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --reload
```

## Environment Variables

Copy the [.env.example](file:///workspaces/App-Screen-/backend/.env.example) file to `.env` and update the values as needed:

```bash
cp .env.example .env
```

Then edit the `.env` file with your actual configuration values.

## API Documentation

Once the server is running, you can access the API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

For the new API structure, see [API Documentation](src/api/API_DOCUMENTATION.md).

## Project Structure

```
src/
├── api/              # API routes and schemas
│   ├── middleware/   # API middleware components
│   └── main.py       # FastAPI application entry point
├── core/             # Core business logic (scrapers)
├── database/         # Database setup and management
├── models/           # Database models
├── services/         # Business services
├── utils/            # Utility functions
├── workers/          # Background workers
└── config/           # Configuration files
```

## Database Schema

The application uses PostgreSQL and consists of four main tables:

1. **users** - Stores user information and API keys
2. **scrape_jobs** - Tracks screenshot scraping jobs
3. **screenshots** - Stores information about individual screenshots
4. **api_usage** - Tracks API usage for analytics and billing

See [Database Schema Documentation](src/database/DATABASE_SETUP.md) for detailed schema information.

## PostgreSQL Setup

See [PostgreSQL Setup Guide](src/database/POSTGRESQL_SETUP.md) for detailed setup instructions.

## Redis Setup

See [Redis Setup Guide](src/config/REDIS.md) for detailed setup instructions.

## Redis Persistence and High Availability

For production deployments, Redis should be configured with persistence and high availability:

See [Redis Persistence and HA Setup](src/config/REDIS_PERSISTENCE_HA.md) for detailed instructions.

## Environment Variables

Copy `.env.example` to `.env` and update the values as needed:
- Database connection details
- Redis connection details
- API keys and secrets