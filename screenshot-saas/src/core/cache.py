import time
import json
from typing import Any, Optional


class CacheManager:
    """Manage caching for scraped data and screenshots"""
    
    def __init__(self, default_ttl: int = 3600):
        """
        Initialize the cache manager
        
        Args:
            default_ttl (int): Default time-to-live in seconds
        """
        self.default_ttl = default_ttl
        self._cache = {}
    
    def get_cached_data(self, key: str) -> Optional[Any]:
        """
        Retrieve cached data by key
        
        Args:
            key (str): Cache key
            
        Returns:
            Any: Cached data or None if not found/expired
        """
        if key not in self._cache:
            return None
            
        item = self._cache[key]
        if time.time() > item['expires_at']:
            # Expired, remove it
            del self._cache[key]
            return None
            
        return item['data']
    
    def set_cache_data(self, key: str, data: Any, ttl: int = None):
        """
        Cache data with TTL (time to live)
        
        Args:
            key (str): Cache key
            data (Any): Data to cache
            ttl (int, optional): Time to live in seconds. Uses default if not specified.
        """
        if ttl is None:
            ttl = self.default_ttl
            
        expires_at = time.time() + ttl
        self._cache[key] = {
            'data': data,
            'expires_at': expires_at
        }
    
    def invalidate_cache(self, key: str) -> bool:
        """
        Invalidate specific cache entry
        
        Args:
            key (str): Cache key to invalidate
            
        Returns:
            bool: True if key existed and was removed, False otherwise
        """
        if key in self._cache:
            del self._cache[key]
            return True
        return False
    
    def clear_expired(self) -> int:
        """
        Clear expired cache entries
        
        Returns:
            int: Number of entries removed
        """
        current_time = time.time()
        expired_keys = [
            key for key, item in self._cache.items() 
            if current_time > item['expires_at']
        ]
        
        for key in expired_keys:
            del self._cache[key]
            
        return len(expired_keys)
    
    def clear_all(self) -> int:
        """
        Clear all cache entries
        
        Returns:
            int: Number of entries removed
        """
        count = len(self._cache)
        self._cache.clear()
        return count