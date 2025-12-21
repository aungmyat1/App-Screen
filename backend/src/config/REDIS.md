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

## Installation and Setup

### Automated Setup

Run the setup script:

```bash
./scripts/setup_redis.sh
```

This script will:
1. Install Redis if not already installed
2. Start the Redis service
3. Enable Redis to start automatically on system boot
4. Test the connection to ensure everything is working

### Manual Installation

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install redis-server
```

#### macOS
```bash
brew install redis
```

#### Windows
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

## Persistence and High Availability

For production deployments, Redis should be configured with persistence and high availability:

- [Redis Persistence and High Availability Setup](REDIS_PERSISTENCE_HA.md) - Detailed guide for configuring Redis with AOF+RDB persistence and Redis Sentinel for high availability

### Quick Setup

1. **Persistent Redis**:
   ```bash
   ./scripts/setup_persistent_redis.sh
   ```

2. **Redis Sentinel**:
   ```bash
   ./scripts/setup_sentinel.sh
   ```

3. **Cache Warming**:
   ```bash
   ./scripts/warm_cache.sh
   ```

## Testing Redis Connection

To test if Redis is running properly:

```bash
redis-cli ping
```

Should return `PONG` if Redis is running correctly.

## Integration with Application

The application uses a custom RedisManager class defined in [redis_manager.py](file:///workspaces/App-Screen-/backend/src/database/redis_manager.py) which:

1. Uses connection pooling for efficient resource management
2. Provides convenient methods for common Redis operations
3. Integrates with the application's configuration system
4. Handles serialization/deserialization of complex data types

You can access the RedisManager instance directly:

```python
from database.redis_manager import redis_manager

# Set a value
redis_manager.set("my_key", {"data": "value"}, ttl=3600)

# Get a value
value = redis_manager.get("my_key")

# Delete a key
redis_manager.delete("my_key")
```