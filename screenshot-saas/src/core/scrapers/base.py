class BaseScraper:
    """Base class for all scrapers"""
    
    def __init__(self):
        pass
    
    def scrape_screenshots(self, app_id: str):
        """Abstract method to scrape screenshots"""
        raise NotImplementedError("Subclasses must implement this method")
        
    def validate_app_id(self, app_id: str) -> bool:
        """Validate the app identifier"""
        raise NotImplementedError("Subclasses must implement this method")