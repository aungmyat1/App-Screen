import sys
import os
from typing import Any, Optional, List

# Add the src directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from database.redis_manager import redis_manager
from config.redis import CACHE_TTL

class CacheService:
    """
    Service for caching application data using Redis
    """
    
    def __init__(self):
        self.redis = redis_manager
        self.ttl = CACHE_TTL
    
    # Screenshot caching
    def cache_screenshots(self, app_id: str, store: str, screenshots: List[str]) -> bool:
        """
        Cache screenshots for an app
        
        Args:
            app_id: The application ID
            store: The store (playstore or appstore)
            screenshots: List of screenshot URLs
            
        Returns:
            bool: True if successful, False otherwise
        """
        key = f"screenshots:{store}:{app_id}"
        return self.redis.set(key, screenshots, self.ttl['screenshots'])
    
    def get_cached_screenshots(self, app_id: str, store: str) -> Optional[List[str]]:
        """
        Get cached screenshots for an app
        
        Args:
            app_id: The application ID
            store: The store (playstore or appstore)
            
        Returns:
            List of screenshot URLs or None if not cached
        """
        key = f"screenshots:{store}:{app_id}"
        return self.redis.get(key)
    
    def invalidate_screenshots_cache(self, app_id: str, store: str) -> bool:
        """
        Invalidate cached screenshots for an app
        
        Args:
            app_id: The application ID
            store: The store (playstore or appstore)
            
        Returns:
            bool: True if successful, False otherwise
        """
        key = f"screenshots:{store}:{app_id}"
        return self.redis.delete(key)
    
    # Metadata caching
    def cache_app_metadata(self, app_id: str, store: str, metadata: dict) -> bool:
        """
        Cache app metadata
        
        Args:
            app_id: The application ID
            store: The store (playstore or appstore)
            metadata: Dictionary containing app metadata
            
        Returns:
            bool: True if successful, False otherwise
        """
        key = f"metadata:{store}:{app_id}"
        return self.redis.set(key, metadata, self.ttl['metadata'])
    
    def get_cached_app_metadata(self, app_id: str, store: str) -> Optional[dict]:
        """
        Get cached app metadata
        
        Args:
            app_id: The application ID
            store: The store (playstore or appstore)
            
        Returns:
            Dictionary containing app metadata or None if not cached
        """
        key = f"metadata:{store}:{app_id}"
        return self.redis.get(key)
    
    # Rate limiting
    def increment_rate_limit_counter(self, user_id: str, endpoint: str) -> Optional[int]:
        """
        Increment rate limit counter for a user and endpoint
        
        Args:
            user_id: The user ID
            endpoint: The API endpoint
            
        Returns:
            The new counter value or None if error
        """
        key = f"rate_limit:{user_id}:{endpoint}"
        current_count = self.redis.increment(key)
        
        # Set expiration if this is the first request
        if current_count == 1:
            self.redis.expire(key, self.ttl['rate_limits'])
            
        return current_count
    
    def get_rate_limit_count(self, user_id: str, endpoint: str) -> Optional[int]:
        """
        Get current rate limit count for a user and endpoint
        
        Args:
            user_id: The user ID
            endpoint: The API endpoint
            
        Returns:
            The current counter value or None if not found
        """
        key = f"rate_limit:{user_id}:{endpoint}"
        value = self.redis.get(key)
        return int(value) if value is not None else None
    
    def reset_rate_limit_counter(self, user_id: str, endpoint: str) -> bool:
        """
        Reset rate limit counter for a user and endpoint
        
        Args:
            user_id: The user ID
            endpoint: The API endpoint
            
        Returns:
            bool: True if successful, False otherwise
        """
        key = f"rate_limit:{user_id}:{endpoint}"
        return self.redis.delete(key)

# Global instance for easy access
cache_service = CacheService()