class BaseScraper:
    """Base class for all scrapers"""
    
    def __init__(self, timeout: int = 30):
        """
        Initialize the scraper
        
        Args:
            timeout (int): Request timeout in seconds
        """
        self.timeout = timeout
    
    def scrape_screenshots(self, app_id: str) -> list:
        """
        Abstract method to scrape screenshots
        
        Args:
            app_id (str): Application identifier
            
        Returns:
            list: List of screenshot URLs or data
            
        Raises:
            NotImplementedError: If not implemented by subclass
        """
        raise NotImplementedError("Subclasses must implement this method")
        
    def validate_app_id(self, app_id: str) -> bool:
        """
        Validate the app identifier
        
        Args:
            app_id (str): Application identifier to validate
            
        Returns:
            bool: True if valid, False otherwise
            
        Raises:
            NotImplementedError: If not implemented by subclass
        """
        raise NotImplementedError("Subclasses must implement this method")
        
    def _download_image(self, url: str) -> bytes:
        """
        Download image from URL
        
        Args:
            url (str): Image URL
            
        Returns:
            bytes: Image data
        """
        # Implementation would go here
        pass