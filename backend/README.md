# AppScreens Backend

This is the backend service for the AppScreens application, which provides APIs for downloading app store screenshots.

## Requirements

- Python 3.11+
- Virtual environment (recommended)
- PostgreSQL database
- Redis (for Celery)

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
   - Create a PostgreSQL database named `appscreens`
   - Update the database connection string in `src/database/alembic.ini` if needed
   - Run the database setup script:
     ```bash
     python src/database/setup.py
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

## Project Structure

```
src/
├── api/              # API routes and schemas
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

## Environment Variables

Copy `.env.example` to `.env` and update the values as needed:
- Database connection details
- Redis configuration for Celery
- AWS credentials for S3 storage
- Stripe keys for payments
- Sentry DSN for error tracking