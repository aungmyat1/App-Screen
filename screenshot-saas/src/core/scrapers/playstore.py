import re
import requests
from typing import List, Dict
from .base import BaseScraper


class PlayStoreScraper(BaseScraper):
    """Play Store scraper for Android app screenshots"""
    
    def __init__(self, timeout: int = 30):
        """
        Initialize the Play Store scraper
        
        Args:
            timeout (int): Request timeout in seconds
        """
        super().__init__(timeout)
        self.base_url = "https://play.google.com/store/apps/details"
    
    def scrape_screenshots(self, app_id: str) -> List[Dict[str, str]]:
        """
        Scrape screenshots from Play Store
        
        Args:
            app_id (str): Play Store app ID (e.g., com.example.app)
            
        Returns:
            list: List of dictionaries containing screenshot URLs and metadata
            
        Raises:
            ValueError: If app_id is invalid
            ConnectionError: If unable to connect to Play Store
        """
        if not self.validate_app_id(app_id):
            raise ValueError(f"Invalid Play Store app ID: {app_id}")
            
        try:
            response = requests.get(
                self.base_url,
                params={"id": app_id},
                timeout=self.timeout
            )
            response.raise_for_status()
            
            # Extract screenshot URLs using regex
            # In a real implementation, you would use a proper HTML parser
            screenshot_pattern = r'https://play-lh\.googleusercontent\.com/[^"\s]+'
            matches = re.findall(screenshot_pattern, response.text)
            
            # Filter for actual screenshots (avoid icons, feature graphics, etc.)
            screenshots = [
                {"url": url, "type": "phone"} 
                for url in matches 
                if "photo.jpg" in url or "screenshot" in url
            ]
            
            return screenshots[:8]  # Limit to first 8 screenshots
            
        except requests.RequestException as e:
            raise ConnectionError(f"Failed to fetch Play Store page: {str(e)}")
    
    def validate_app_id(self, app_id: str) -> bool:
        """
        Validate Play Store app ID format
        
        Args:
            app_id (str): Application identifier to validate
            
        Returns:
            bool: True if valid, False otherwise
        """
        if not app_id or not isinstance(app_id, str):
            return False
            
        # Play Store app IDs typically follow reverse domain notation
        pattern = r'^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)+$'
        return bool(re.match(pattern, app_id))