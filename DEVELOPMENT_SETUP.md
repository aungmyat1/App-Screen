# App-Screen Development Setup Guide

This document outlines the current development setup for App-Screen, including how we handle missing dependencies like Playwright and PostgreSQL.

## Current Status

✅ **Backend API**: Working with SQLite fallback when PostgreSQL is unavailable  
✅ **Frontend Dependencies**: Successfully installed  
✅ **Playwright Handling**: Implemented graceful degradation when not available  
✅ **Development Mode**: Properly configured for local development  

## Key Changes Made

### 1. Playwright Availability Check
- Added runtime checks in all scraper components
- Implemented graceful fallback for development environments
- API endpoints return mock data when Playwright is unavailable

### 2. Database Fallback
- Backend automatically falls back to SQLite when PostgreSQL is unavailable
- No need to have PostgreSQL running for basic development
- Production environments will still use PostgreSQL

### 3. Development Environment Variables
- Set `ENVIRONMENT=development` to enable mock data when dependencies are missing
- This allows full functionality during development without all production services

## How to Start Development

### Backend API Server
```bash
cd /workspaces/App-Screen/backend
source venv/bin/activate
ENVIRONMENT=development uvicorn src.main:app --host 0.0.0.0 --port 5000 --reload
```

### Frontend Development Server
```bash
cd /workspaces/App-Screen
npm run dev
```

## API Endpoints Available

- `GET /` - Welcome message
- `GET /health` - Health check
- `POST /screenshots/scrape` - Screenshot scraping endpoint (returns mock data in development)
- `GET /docs` - Swagger UI documentation

## Next Steps for Full Production Setup

1. **Playwright Installation**:
   - Use Python 3.7-3.11 (Playwright has compatibility issues with 3.12)
   - Install Playwright: `pip install playwright`
   - Install browsers: `playwright install chromium`

2. **PostgreSQL Setup**:
   - Install and run PostgreSQL locally
   - Update DATABASE_URL in environment variables

3. **Redis Setup**:
   - Install and run Redis for task queue
   - Update REDIS_URL in environment variables

4. **S3 Storage**:
   - Configure AWS credentials for image storage

## Development Without Full Infrastructure

The application is now configured to allow development without:
- Playwright (browser automation) - returns mock data
- PostgreSQL (uses SQLite for development)
- Redis (task queue features disabled in dev mode)
- AWS S3 (local storage in development)

This enables you to work on:
- API design and testing
- Frontend development
- Core business logic
- Database schema (using SQLite for development)
- Authentication and authorization flows