# Redis Configuration

This document describes the Redis configuration used in the AppScreens application.

## Configuration Parameters

The Redis configuration is defined in [redis.py](file:///workspaces/App-Screen-/backend/src/config/redis.py):

```python
REDIS_CONFIG = {
    'host': 'localhost',
    'port': 6379,
    'db': 0,
    'decode_responses': True,
    'max_connections': 50
}
```

### Parameter Details

- `host`: The Redis server hostname (default: localhost)
- `port`: The Redis server port (default: 6379)
- `db`: The Redis database number to use (default: 0)
- `decode_responses`: Automatically decode responses to Python strings (default: True)
- `max_connections`: Maximum number of connections in the connection pool (default: 50)

## Cache TTL Settings

Cache TTL (Time To Live) settings are defined in the same file:

```python
CACHE_TTL = {
    'screenshots': 86400,      # 24 hours
    'metadata': 3600,          # 1 hour
    'rate_limits': 60,         # 1 minute
}
```

### TTL Values

- `screenshots`: 86400 seconds (24 hours) - Screenshots are cached for a day
- `metadata`: 3600 seconds (1 hour) - App metadata is cached for an hour
- `rate_limits`: 60 seconds (1 minute) - Rate limiting counters expire after a minute

## Cache Keys Structure

The application uses structured cache keys for different types of data:

1. **Screenshots**: `screenshots:{store}:{app_id}`
   - Example: `screenshots:playstore:com.example.app`

2. **Metadata**: `metadata:{store}:{app_id}`
   - Example: `metadata:appstore:123456789`

3. **Rate Limits**: `rate_limit:{user_id}:{endpoint}`
   - Example: `rate_limit:user123:/screenshots/scrape`

## Usage Examples

### Caching Screenshots

```python
from src.services.cache_service import cache_service

# Cache screenshots
success = cache_service.cache_screenshots(
    app_id="com.example.app",
    store="playstore",
    screenshots=["url1", "url2", "url3"]
)

# Retrieve cached screenshots
screenshots = cache_service.get_cached_screenshots(
    app_id="com.example.app",
    store="playstore"
)
```

### Rate Limiting

```python
from src.services.cache_service import cache_service

# Increment rate limit counter
count = cache_service.increment_rate_limit_counter(
    user_id="user123",
    endpoint="/screenshots/scrape"
)

# Check if user has exceeded rate limit (e.g., 100 requests per minute)
if count and count > 100:
    # Reject request
    pass
```

## Installation

To install Redis locally:

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install redis-server
```

### macOS
```bash
brew install redis
```

### Windows
Download from: https://github.com/microsoftarchive/redis/releases

## Starting Redis

### As a service
```bash
sudo systemctl start redis
```

### Manually
```bash
redis-server
```

## Testing Redis Connection

To test if Redis is running properly:

```bash
redis-cli ping
```

Should return `PONG` if Redis is running correctly.