# Screenshot Scraper API Documentation

This document describes the FastAPI application for the Screenshot Scraper API.

## Overview

The Screenshot Scraper API is built using FastAPI and provides endpoints for scraping app store screenshots. It includes middleware for authentication, rate limiting, CORS, and GZip compression.

## Features

1. **Authentication Middleware**: Validates API keys for secure access
2. **Rate Limiting Middleware**: Prevents abuse by limiting requests per IP
3. **CORS Middleware**: Allows cross-origin requests from any origin
4. **GZip Middleware**: Compresses responses larger than 1000 bytes
5. **Health Check Endpoint**: Provides a simple health check endpoint

## API Endpoints

### Health Check

```
GET /health
```

Returns the health status of the API.

Example response:
```json
{
  "status": "healthy",
  "version": "2.0.0"
}
```

## Middleware

### Authentication Middleware

The authentication middleware validates API keys provided in the Authorization header. It skips validation for the following endpoints:
- `/health`
- `/docs`
- `/redoc`
- `/openapi.json`

To authenticate, include an `Authorization` header with your API key:
```
Authorization: Bearer YOUR_API_KEY
```

### Rate Limiting Middleware

The rate limiting middleware limits requests to 100 per minute per IP address. If the limit is exceeded, a 429 (Too Many Requests) response is returned.

### CORS Middleware

The CORS middleware allows requests from any origin, with any method and headers.

### GZip Middleware

The GZip middleware compresses responses that are larger than 1000 bytes to reduce bandwidth usage.

## Running the Application

To run the application, use the startup script:

```bash
./start_api.sh
```

Or run directly with uvicorn:

```bash
uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --reload
```

## Environment Variables

The application uses the following environment variables:

- `API_KEYS`: Comma-separated list of valid API keys for authentication
- `DATABASE_URL`: Database connection URL (used by other components)
- `REDIS_URL`: Redis connection URL (used by other components)

## API Documentation

Once the server is running, you can access the API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Extending the API

To add new endpoints, create new route files in the `src/api` directory and include them in the main application:

```python
from src.api.your_new_routes import router as your_new_router
app.include_router(your_new_router)
```

## Testing

To test the application, you can use the built-in test client or tools like curl or Postman:

```bash
curl http://localhost:8000/health
```

## Deployment

For production deployment, consider using a process manager like Gunicorn:

```bash
gunicorn -w 4 -k uvicorn.workers.UvicornWorker src.api.main:app
```