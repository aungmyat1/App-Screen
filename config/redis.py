"""
Redis configuration for the App-Screen SaaS application.
"""
REDIS_CONFIG = {
    'host': 'localhost',
    'port': 6379,
    'db': 0,
    'decode_responses': True,
    'max_connections': 50
}

CACHE_TTL = {
    'screenshots': 86400,      # 24 hours
    'metadata': 3600,          # 1 hour
    'rate_limits': 60,         # 1 minute
}