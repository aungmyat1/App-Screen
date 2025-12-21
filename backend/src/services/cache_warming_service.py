#!/usr/bin/env python3
"""
Cache Warming Service for AppScreens
This service pre-populates the Redis cache with frequently accessed data
to improve application performance.
"""

import sys
import os
import asyncio
import logging
from typing import List, Dict, Any

# Add the parent directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from database.redis_manager import redis_manager
from config.redis import CACHE_TTL

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CacheWarmingService:
    """
    Service responsible for pre-populating the Redis cache with frequently accessed data.
    """
    
    def __init__(self):
        self.redis_manager = redis_manager
        self.warmed_keys = []
    
    async def warm_screenshots_cache(self, app_ids: List[str], store: str = "playstore") -> int:
        """
        Warm the screenshots cache with frequently requested app IDs.
        
        Args:
            app_ids: List of app IDs to warm in cache
            store: Store identifier (playstore or appstore)
            
        Returns:
            Number of entries warmed
        """
        warmed_count = 0
        
        for app_id in app_ids:
            cache_key = f"screenshots:{store}:{app_id}"
            
            # Check if already in cache
            if not self.redis_manager.exists(cache_key):
                # Simulate fetching data from external source
                # In a real implementation, this would fetch actual screenshots
                screenshots_data = {
                    "app_id": app_id,
                    "store": store,
                    "screenshots": [
                        f"https://example.com/{store}/{app_id}/screenshot_1.jpg",
                        f"https://example.com/{store}/{app_id}/screenshot_2.jpg",
                        f"https://example.com/{store}/{app_id}/screenshot_3.jpg"
                    ],
                    "timestamp": "2023-01-01T00:00:00Z"
                }
                
                # Cache the data
                success = self.redis_manager.set(
                    cache_key, 
                    screenshots_data, 
                    CACHE_TTL['screenshots']
                )
                
                if success:
                    self.warmed_keys.append(cache_key)
                    warmed_count += 1
                    logger.info(f"Warmed cache for {cache_key}")
                else:
                    logger.warning(f"Failed to warm cache for {cache_key}")
            else:
                logger.info(f"Cache already exists for {cache_key}")
        
        return warmed_count
    
    async def warm_metadata_cache(self, app_ids: List[str], store: str = "playstore") -> int:
        """
        Warm the metadata cache with frequently requested app IDs.
        
        Args:
            app_ids: List of app IDs to warm in cache
            store: Store identifier (playstore or appstore)
            
        Returns:
            Number of entries warmed
        """
        warmed_count = 0
        
        for app_id in app_ids:
            cache_key = f"metadata:{store}:{app_id}"
            
            # Check if already in cache
            if not self.redis_manager.exists(cache_key):
                # Simulate fetching data from external source
                # In a real implementation, this would fetch actual metadata
                metadata = {
                    "app_id": app_id,
                    "store": store,
                    "name": f"App {app_id}",
                    "developer": f"Developer {app_id}",
                    "rating": 4.5,
                    "downloads": "1M+",
                    "last_updated": "2023-01-01"
                }
                
                # Cache the data
                success = self.redis_manager.set(
                    cache_key, 
                    metadata, 
                    CACHE_TTL['metadata']
                )
                
                if success:
                    self.warmed_keys.append(cache_key)
                    warmed_count += 1
                    logger.info(f"Warmed metadata cache for {cache_key}")
                else:
                    logger.warning(f"Failed to warm metadata cache for {cache_key}")
            else:
                logger.info(f"Metadata cache already exists for {cache_key}")
        
        return warmed_count
    
    async def warm_popular_apps(self) -> Dict[str, int]:
        """
        Warm cache for popular apps based on predefined lists.
        
        Returns:
            Dictionary with warming statistics
        """
        # Popular Play Store apps
        playstore_apps = [
            "com.whatsapp",
            "com.facebook.katana",
            "com.instagram.android",
            "com.snapchat.android",
            "com.google.android.apps.maps",
            "com.netflix.mediaclient",
            "com.spotify.client",
            "com.google.android.youtube",
            "com.android.chrome",
            "com.microsoft.office.word"
        ]
        
        # Popular App Store apps (using bundle IDs)
        appstore_apps = [
            "310633997",  # WhatsApp
            "284882215",  # Facebook
            "389801252",  # Instagram
            "447188347",  # SnapChat
            "585027354",  # Google Maps
            "363590051",  # Netflix
            "324684580",  # Spotify
            "544007664",  # YouTube
            "358634042",  # Chrome
            "586449534"   # Microsoft Word
        ]
        
        # Warm screenshots cache
        playstore_screenshots = await self.warm_screenshots_cache(playstore_apps, "playstore")
        appstore_screenshots = await self.warm_screenshots_cache(appstore_apps, "appstore")
        
        # Warm metadata cache
        playstore_metadata = await self.warm_metadata_cache(playstore_apps, "playstore")
        appstore_metadata = await self.warm_metadata_cache(appstore_apps, "appstore")
        
        return {
            "playstore_screenshots": playstore_screenshots,
            "appstore_screenshots": appstore_screenshots,
            "playstore_metadata": playstore_metadata,
            "appstore_metadata": appstore_metadata,
            "total": playstore_screenshots + appstore_screenshots + playstore_metadata + appstore_metadata
        }
    
    def clear_warmed_cache(self):
        """
        Clear all warmed cache entries.
        """
        for key in self.warmed_keys:
            self.redis_manager.delete(key)
        
        count = len(self.warmed_keys)
        self.warmed_keys.clear()
        logger.info(f"Cleared {count} warmed cache entries")
        return count

# Global instance
cache_warming_service = CacheWarmingService()

async def main():
    """
    Main function to run cache warming.
    """
    print("Starting cache warming process...")
    
    # Warm popular apps
    stats = await cache_warming_service.warm_popular_apps()
    
    print(f"Cache warming completed with the following statistics:")
    print(f"- Play Store screenshots warmed: {stats['playstore_screenshots']}")
    print(f"- App Store screenshots warmed: {stats['appstore_screenshots']}")
    print(f"- Play Store metadata warmed: {stats['playstore_metadata']}")
    print(f"- App Store metadata warmed: {stats['appstore_metadata']}")
    print(f"- Total entries warmed: {stats['total']}")

if __name__ == "__main__":
    # Run the cache warming process
    asyncio.run(main())