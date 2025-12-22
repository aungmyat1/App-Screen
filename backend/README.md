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

# Backend Services

This directory contains all backend services for the screenshot scraper application.

## Services Overview

1. **API Service** - Main FastAPI application for handling HTTP requests
2. **Worker Service** - Celery workers for processing scraping jobs
3. **Beat Service** - Celery Beat scheduler for periodic tasks
4. **Monitoring** - Flower for monitoring workers and tasks
5. **Storage** - S3 integration for storing screenshots with CDN support
6. **Image Processing** - Automatic resizing and format conversion

## Setup Instructions

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up the database:
   ```bash
   ./setup_database.sh
   ```

4. Configure environment variables:
   Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```

## Running Services

### Starting the API Server
```bash
./start_api.sh
```

### Starting Worker Instances
```bash
./start_workers.sh
```

This will start 4 different types of workers:
- Play Store workers (2 concurrent processes)
- App Store workers (2 concurrent processes)
- Downloads workers (4 concurrent processes)
- Maintenance workers (1 concurrent process)

### Starting Periodic Task Scheduler
```bash
./start_beat.sh
```

This starts the Celery Beat scheduler which runs periodic tasks like cleaning up old screenshots.

### Starting Monitoring Dashboard
```bash
./start_flower.sh
```

This starts the Flower monitoring dashboard accessible at http://localhost:5555.

## Configuration

### Task Priorities
Tasks are routed with different priorities:
- High priority: scraping tasks
- Low priority: maintenance tasks

### Retry Logic
Tasks implement exponential backoff retry logic with jitter to prevent thundering herd problems.

### Multiple Worker Instances
Multiple worker instances can be run for scalability and fault tolerance.

### S3 Storage & CDN
Screenshots are stored in S3 with the following features:
- Long-term caching with 1-year expiration
- CDN distribution for fast delivery
- Presigned URLs for temporary access
- Metadata tracking for uploaded files

Environment variables needed:
- `AWS_ACCESS_KEY_ID` - Your AWS access key
- `AWS_SECRET_ACCESS_KEY` - Your AWS secret key
- `AWS_REGION` - AWS region (default: us-east-1)
- `S3_BUCKET` - S3 bucket name (default: screenshot-scraper-prod)
- `CDN_URL` - CDN base URL (default: https://cdn.yourapp.com)

See [S3_CLOUDFRONT_SETUP.md](S3_CLOUDFRONT_SETUP.md) for detailed setup instructions.

### Image Processing
Screenshots are automatically processed to generate multiple sizes:
- Thumbnail (200x400)
- Medium (600x1200)
- Large (1080x2400)
- Original (unmodified)

Images are converted to WebP format for optimal file size while maintaining quality.

#### Watermarking (Optional)
To add a watermark to your screenshots:
1. Set the `WATERMARK_TEXT` environment variable in your `.env` file
2. Restart your workers

The watermark will appear in the bottom-right corner of all processed images with 50% opacity.

### Security Features

The API includes several security hardening measures:

1. **Security Headers**:
   - `X-Content-Type-Options: nosniff` - Prevents MIME type sniffing
   - `X-Frame-Options: DENY` - Prevents clickjacking attacks
   - `X-XSS-Protection: 1; mode=block` - Enables XSS protection
   - `Strict-Transport-Security: max-age=31536000; includeSubDomains` - Enforces HTTPS
   - `Content-Security-Policy` - Limits sources for content loading

2. **Rate Limiting**:
   - Per-endpoint rate limiting using slowapi
   - Tier-based limits (free, basic, premium, enterprise)
   - Default limits vary by endpoint type:
     - Free tier: 100 requests/hour
     - Basic tier: 500 requests/hour
     - Premium tier: 2000 requests/hour
     - Enterprise tier: 10000 requests/hour
   - Rate limiting based on client IP address or user tier
   - Customizable limits via decorators

3. **Authentication**:
   - JWT-based authentication middleware
   - Protected endpoints require valid authorization tokens

4. **Webhook Security**:
   - Request signing for webhook verification
   - HMAC SHA-256 signatures with timestamp validation
   - Protection against replay attacks

5. **WAF Protection**:
   - See [WAF_RULES.md](WAF_RULES.md) for configuration details
   - Protection against common attack vectors
   - Rate limiting at the network level

### Billing and Subscription

The application includes a billing system powered by Stripe:

1. **Subscription Plans**:
   - Free tier: 10 screenshots/month
   - Pro tier: 500 screenshots/month for $29/month
   - Enterprise tier: 50,000 screenshots/month for $299/month

2. **Features**:
   - Stripe integration for payments
   - Subscription management
   - Webhook handling for payment events
   - Trial periods for new subscribers

3. **Setup**:
   - Configure `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY` in your environment
   - Set up webhook endpoints in the Stripe dashboard
   - Configure `STRIPE_WEBHOOK_SECRET` for secure webhook handling

4. **Validation**:
   - Pricing plans are validated between frontend and backend ([PRICING_VALIDATION.md](../PRICING_VALIDATION.md))
   - Regular checks ensure consistency between displayed and actual plans

### Monitoring and Observability

The application includes several monitoring features:

1. **Celery Monitoring**:
   - Flower dashboard for worker and task monitoring
   - Real-time metrics and statistics
   - Task success/failure rates

2. **Health Checks**:
   - `/health` endpoint for service status
   - Database connectivity verification
   - External service dependency checks

3. **Logging**:
   - Structured logging throughout the application
   - Error tracking and reporting
   - Performance metrics collection

4. **Prometheus Metrics**:
   - Built-in metrics endpoint at `/metrics`
   - Request counts, durations, and error rates
   - Active connection tracking
   - Task queue and worker metrics
   - See [MONITORING_SETUP.md](MONITORING_SETUP.md) for setup instructions

5. **Error Tracking**:
   - Sentry integration for error reporting
   - Performance tracing
   - User context and request information

6. **Alerting**:
   - Pre-configured alert rules for common issues
   - High error rate detection
   - Performance degradation alerts
   - Resource availability monitoring
