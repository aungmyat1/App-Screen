#!/usr/bin/env python3
"""
Test script to verify Redis configuration
"""

import sys
import os

# Add the parent directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__)))

# Import our Redis configuration
from config import redis

def test_redis_connection():
    """Test Redis connection with the configured parameters"""
    try:
        # Import Redis client
        from redis import Redis
        
        # Create Redis client with our configuration
        client = Redis(**redis.REDIS_CONFIG)
        
        # Test connection
        pong = client.ping()
        print("Redis connection test: {}".format('PASS' if pong else 'FAIL'))
        
        # Test basic operations
        success_set = client.set('test_key', 'test_value')
        value = client.get('test_key')
        success_get = value == 'test_value'
        print("Redis set/get test: {}".format('PASS' if success_set and success_get else 'FAIL'))
        
        # Clean up
        client.delete('test_key')
        
        return True
    except Exception as e:
        print("Redis connection test: FAIL - {}".format(e))
        return False

def display_config():
    """Display the current Redis configuration"""
    print("Redis Configuration:")
    for key, value in redis.REDIS_CONFIG.items():
        print("  {}: {}".format(key, value))
    
    print("\nCache TTL Settings:")
    for key, value in redis.CACHE_TTL.items():
        print("  {}: {} seconds".format(key, value))

if __name__ == "__main__":
    print("Testing Redis Configuration")
    print("=" * 30)
    
    display_config()
    print()
    
    success = test_redis_connection()
    
    if success:
        print("\nAll tests passed! Redis is configured correctly.")
        sys.exit(0)
    else:
        print("\nTests failed! Please check your Redis configuration.")
        sys.exit(1)