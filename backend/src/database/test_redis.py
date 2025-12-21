#!/usr/bin/env python3
"""
Test Redis configuration and connection
"""

import sys
import os

# Add the src directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

# Import with full paths
from database.redis_manager import redis_manager
from services.cache_service import cache_service

def test_redis_connection():
    """
    Test basic Redis connection
    """
    print("Testing Redis connection...")
    
    try:
        # Test ping
        result = redis_manager.client.ping()
        print(f"Ping result: {result}")
        
        # Test setting a value
        success = redis_manager.set("test_key", "test_value", 10)
        print(f"Set operation successful: {success}")
        
        # Test getting a value
        value = redis_manager.get("test_key")
        print(f"Retrieved value: {value}")
        
        # Test deleting a value
        deleted = redis_manager.delete("test_key")
        print(f"Delete operation successful: {deleted}")
        
        print("Redis connection test completed successfully!")
        return True
        
    except Exception as e:
        print(f"Redis connection test failed: {e}")
        return False

def test_cache_service():
    """
    Test cache service functionality
    """
    print("\nTesting Cache Service...")
    
    try:
        # Test caching screenshots
        screenshots = [
            "https://example.com/screenshot1.png",
            "https://example.com/screenshot2.png",
            "https://example.com/screenshot3.png"
        ]
        
        success = cache_service.cache_screenshots("com.test.app", "playstore", screenshots)
        print(f"Screenshots caching successful: {success}")
        
        # Test retrieving cached screenshots
        cached_screenshots = cache_service.get_cached_screenshots("com.test.app", "playstore")
        print(f"Retrieved cached screenshots: {cached_screenshots}")
        
        # Test caching metadata
        metadata = {
            "title": "Test App",
            "developer": "Test Developer",
            "rating": 4.5
        }
        
        success = cache_service.cache_app_metadata("com.test.app", "playstore", metadata)
        print(f"Metadata caching successful: {success}")
        
        # Test retrieving cached metadata
        cached_metadata = cache_service.get_cached_app_metadata("com.test.app", "playstore")
        print(f"Retrieved cached metadata: {cached_metadata}")
        
        # Test rate limiting
        count = cache_service.increment_rate_limit_counter("user123", "/test/endpoint")
        print(f"Rate limit count: {count}")
        
        # Get rate limit count
        count = cache_service.get_rate_limit_count("user123", "/test/endpoint")
        print(f"Current rate limit count: {count}")
        
        print("Cache service test completed successfully!")
        return True
        
    except Exception as e:
        print(f"Cache service test failed: {e}")
        return False

if __name__ == "__main__":
    success1 = test_redis_connection()
    success2 = test_cache_service()
    
    if success1 and success2:
        print("\nAll tests passed!")
        sys.exit(0)
    else:
        print("\nSome tests failed!")
        sys.exit(1)