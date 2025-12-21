import re
import requests
from typing import List, Dict
from .base import BaseScraper


class AppStoreScraper(BaseScraper):
    """App Store scraper for iOS app screenshots"""
    
    def __init__(self, timeout: int = 30):
        """
        Initialize the App Store scraper
        
        Args:
            timeout (int): Request timeout in seconds
        """
        super().__init__(timeout)
        self.base_url = "https://apps.apple.com/us/app"
    
    def scrape_screenshots(self, app_id: str) -> List[Dict[str, str]]:
        """
        Scrape screenshots from App Store
        
        Args:
            app_id (str): App Store app ID (e.g., numeric ID or slug)
            
        Returns:
            list: List of dictionaries containing screenshot URLs and metadata
            
        Raises:
            ValueError: If app_id is invalid
            ConnectionError: If unable to connect to App Store
        """
        if not self.validate_app_id(app_id):
            raise ValueError(f"Invalid App Store app ID: {app_id}")
            
        try:
            # Handle both numeric IDs and slugs
            if app_id.isdigit():
                url = f"{self.base_url}/id{app_id}"
            else:
                url = f"{self.base_url}/{app_id}"
                
            response = requests.get(url, timeout=self.timeout)
            response.raise_for_status()
            
            # Extract screenshot URLs using regex
            # In a real implementation, you would use a proper HTML parser
            screenshot_pattern = r'https://is\d+-ssl\.mzstatic\.com/image/thumb/[^\s"]+'
            matches = re.findall(screenshot_pattern, response.text)
            
            screenshots = []
            for url in matches:
                # Determine device type from URL
                device_type = "phone"  # default
                if "ipad" in url.lower():
                    device_type = "tablet"
                    
                screenshots.append({
                    "url": url,
                    "type": device_type
                })
            
            return screenshots[:8]  # Limit to first 8 screenshots
            
        except requests.RequestException as e:
            raise ConnectionError(f"Failed to fetch App Store page: {str(e)}")
    
    def validate_app_id(self, app_id: str) -> bool:
        """
        Validate App Store app ID format
        
        Args:
            app_id (str): Application identifier to validate
            
        Returns:
            bool: True if valid, False otherwise
        """
        if not app_id or not isinstance(app_id, str):
            return False
            
        # Can be either numeric ID or alphanumeric slug
        return bool(re.match(r'^[a-zA-Z0-9-]+$', app_id)) or app_id.isdigit()