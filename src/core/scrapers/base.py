"""
Base scraper class for app store screenshot extraction.
"""
from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
import asyncio


class BaseScraper(ABC):
    """
    Abstract base class for app store scrapers.
    """
    
    def __init__(self, base_url: str, headless: bool = True):
        self.base_url = base_url
        self.headless = headless
        
    @abstractmethod
    async def get_app_screenshots(self, app_id: str) -> List[Dict[str, Any]]:
        """
        Abstract method to get screenshots for an app.
        
        Args:
            app_id: The unique identifier for the app
            
        Returns:
            List of screenshot data
        """
        pass
    
    @abstractmethod
    async def search_apps(self, query: str) -> List[Dict[str, Any]]:
        """
        Abstract method to search for apps.
        
        Args:
            query: Search query string
            
        Returns:
            List of app data
        """
        pass
    
    async def validate_app_id(self, app_id: str) -> bool:
        """
        Validate if the app ID is valid for this store.
        
        Args:
            app_id: The app ID to validate
            
        Returns:
            True if valid, False otherwise
        """
        # Default implementation, can be overridden
        return len(app_id) > 0