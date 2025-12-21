from abc import ABC, abstractmethod

class BaseScraper(ABC):
    """
    Abstract base class for all scrapers.
    Defines the common interface for scraping app store screenshots.
    """
    
    def __init__(self, headless: bool = True):
        self.headless = headless
    
    @abstractmethod
    async def scrape_screenshots(self, app_id: str, **kwargs):
        """
        Scrape screenshots for the given app ID.
        
        Args:
            app_id (str): The ID of the app to scrape
            
        Returns:
            list: List of screenshot URLs or file paths
        """
        pass
    
    @abstractmethod
    def validate_app_id(self, app_id: str) -> bool:
        """
        Validate the app ID format for this scraper.
        
        Args:
            app_id (str): The app ID to validate
            
        Returns:
            bool: True if valid, False otherwise
        """
        pass