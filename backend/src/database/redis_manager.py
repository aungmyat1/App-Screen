import redis
import json
import sys
import os
from typing import Any, Optional

# Add the src directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from config.redis import REDIS_CONFIG, CACHE_TTL

class RedisManager:
    """
    Redis connection manager for caching and other Redis operations
    """
    
    def __init__(self):
        """
        Initialize Redis connection pool and client
        """
        self.connection_pool = redis.ConnectionPool(**REDIS_CONFIG)
        self.client = redis.Redis(connection_pool=self.connection_pool)
    
    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> bool:
        """
        Set a key-value pair in Redis
        
        Args:
            key: The key to set
            value: The value to set (will be serialized to JSON)
            ttl: Time to live in seconds (optional)
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            serialized_value = json.dumps(value)
            if ttl:
                return self.client.setex(key, ttl, serialized_value)
            else:
                return self.client.set(key, serialized_value)
        except Exception as e:
            print(f"Error setting key {key}: {e}")
            return False
    
    def get(self, key: str) -> Optional[Any]:
        """
        Get a value from Redis by key
        
        Args:
            key: The key to retrieve
            
        Returns:
            The deserialized value or None if not found
        """
        try:
            value = self.client.get(key)
            if value is None:
                return None
            return json.loads(value)
        except Exception as e:
            print(f"Error getting key {key}: {e}")
            return None
    
    def delete(self, key: str) -> bool:
        """
        Delete a key from Redis
        
        Args:
            key: The key to delete
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            return bool(self.client.delete(key))
        except Exception as e:
            print(f"Error deleting key {key}: {e}")
            return False
    
    def exists(self, key: str) -> bool:
        """
        Check if a key exists in Redis
        
        Args:
            key: The key to check
            
        Returns:
            bool: True if key exists, False otherwise
        """
        try:
            return bool(self.client.exists(key))
        except Exception as e:
            print(f"Error checking existence of key {key}: {e}")
            return False
    
    def increment(self, key: str, amount: int = 1) -> Optional[int]:
        """
        Increment a numeric value in Redis
        
        Args:
            key: The key to increment
            amount: The amount to increment by (default: 1)
            
        Returns:
            The new value or None if error
        """
        try:
            return self.client.incrby(key, amount)
        except Exception as e:
            print(f"Error incrementing key {key}: {e}")
            return None
    
    def expire(self, key: str, ttl: int) -> bool:
        """
        Set a TTL (time to live) for a key
        
        Args:
            key: The key to set TTL for
            ttl: Time to live in seconds
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            return bool(self.client.expire(key, ttl))
        except Exception as e:
            print(f"Error setting TTL for key {key}: {e}")
            return False
    
    def flush_db(self) -> bool:
        """
        Flush the current Redis database
        
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            return bool(self.client.flushdb())
        except Exception as e:
            print(f"Error flushing database: {e}")
            return False
    
    def close(self):
        """
        Close the Redis connection
        """
        try:
            self.client.close()
        except Exception as e:
            print(f"Error closing Redis connection: {e}")

# Global instance for easy access
redis_manager = RedisManager()