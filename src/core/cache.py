"""
Cache module for the screenshot SaaS application.
"""
import json
import redis
from typing import Any, Optional, Union
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)


class CacheManager:
    """
    Manager for caching operations using Redis.
    """
    
    def __init__(self, redis_url: str = "redis://localhost:6379"):
        """
        Initialize the cache manager.
        
        Args:
            redis_url: URL for the Redis instance
        """
        try:
            self.redis_client = redis.from_url(redis_url, decode_responses=True, socket_connect_timeout=5)
            # Test connection
            self.redis_client.ping()
            logger.info("Connected to Redis successfully")
        except Exception as e:
            logger.error(f"Failed to connect to Redis: {e}")
            raise
    
    def set(self, key: str, value: Any, expiration: Union[int, timedelta] = 3600) -> bool:
        """
        Set a value in the cache.
        
        Args:
            key: Cache key
            value: Value to cache
            expiration: Expiration time in seconds or as timedelta
            
        Returns:
            True if successful, False otherwise
        """
        try:
            # Serialize complex objects to JSON
            if isinstance(value, (dict, list, tuple)):
                serialized_value = json.dumps(value)
            else:
                serialized_value = str(value)
            
            result = self.redis_client.setex(key, expiration, serialized_value)
            return result
        except Exception as e:
            logger.error(f"Error setting cache for key {key}: {e}")
            return False
    
    def get(self, key: str) -> Optional[Any]:
        """
        Get a value from the cache.
        
        Args:
            key: Cache key
            
        Returns:
            Cached value or None if not found
        """
        try:
            value = self.redis_client.get(key)
            if value is None:
                return None
            
            # Try to deserialize as JSON, fallback to string
            try:
                return json.loads(value)
            except json.JSONDecodeError:
                return value
        except Exception as e:
            logger.error(f"Error getting cache for key {key}: {e}")
            return None
    
    def delete(self, key: str) -> bool:
        """
        Delete a key from the cache.
        
        Args:
            key: Cache key to delete
            
        Returns:
            True if successful, False otherwise
        """
        try:
            result = self.redis_client.delete(key)
            return result == 1
        except Exception as e:
            logger.error(f"Error deleting cache for key {key}: {e}")
            return False
    
    def exists(self, key: str) -> bool:
        """
        Check if a key exists in the cache.
        
        Args:
            key: Cache key to check
            
        Returns:
            True if key exists, False otherwise
        """
        try:
            return self.redis_client.exists(key) == 1
        except Exception as e:
            logger.error(f"Error checking existence of cache key {key}: {e}")
            return False
    
    def expire(self, key: str, expiration: Union[int, timedelta]) -> bool:
        """
        Set expiration for a key.
        
        Args:
            key: Cache key
            expiration: Expiration time in seconds or as timedelta
            
        Returns:
            True if successful, False otherwise
        """
        try:
            result = self.redis_client.expire(key, expiration)
            return result
        except Exception as e:
            logger.error(f"Error setting expiration for key {key}: {e}")
            return False