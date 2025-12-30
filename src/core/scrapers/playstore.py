"""
Google Play Store scraper implementation.
"""
import asyncio
import aiohttp
from typing import List, Dict, Any
from bs4 import BeautifulSoup
from .base import BaseScraper


class PlayStoreScraper(BaseScraper):
    """
    Scraper for Google Play Store.
    """
    
    def __init__(self, headless: bool = True):
        super().__init__(base_url="https://play.google.com", headless=headless)
    
    async def get_app_screenshots(self, app_id: str) -> List[Dict[str, Any]]:
        """
        Get screenshots for an app from the Google Play Store.
        
        Args:
            app_id: The Play Store app ID (e.g., "com.example.app")
            
        Returns:
            List of screenshot data
        """
        url = f"{self.base_url}/store/apps/details?id={app_id}"
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(url) as response:
                    if response.status != 200:
                        return []
                    
                    html = await response.text()
                    soup = BeautifulSoup(html, 'html.parser')
                    
                    # Find screenshot elements (this selector might need adjustment based on actual page structure)
                    screenshot_elements = soup.select('img[data-screenshot-url], img.UCccjd')
                    
                    screenshots = []
                    for img in screenshot_elements:
                        src = img.get('data-screenshot-url') or img.get('src')
                        if src:
                            # Handle relative URLs
                            if src.startswith('//'):
                                src = 'https:' + src
                            elif src.startswith('/'):
                                src = self.base_url + src
                            
                            screenshots.append({
                                'url': src,
                                'alt': img.get('alt', ''),
                                'type': 'playstore'
                            })
                    
                    return screenshots
        except Exception as e:
            print(f"Error scraping Play Store for app {app_id}: {str(e)}")
            return []
    
    async def search_apps(self, query: str) -> List[Dict[str, Any]]:
        """
        Search for apps on the Google Play Store.
        
        Args:
            query: Search query string
            
        Returns:
            List of app data
        """
        search_url = f"{self.base_url}/store/search?q={query}&c=apps"
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(search_url) as response:
                    if response.status != 200:
                        return []
                    
                    html = await response.text()
                    soup = BeautifulSoup(html, 'html.parser')
                    
                    # Find app elements (this selector might need adjustment based on actual page structure)
                    app_elements = soup.select('div[data-g-id="apps"] div[data-uitype]')
                    
                    apps = []
                    for app in app_elements:
                        title_elem = app.select_one('a')
                        if title_elem:
                            app_data = {
                                'name': title_elem.get('title', ''),
                                'id': self._extract_app_id(title_elem.get('href', '')),
                                'url': title_elem.get('href', ''),
                                'type': 'playstore'
                            }
                            apps.append(app_data)
                    
                    return apps
        except Exception as e:
            print(f"Error searching Play Store for query '{query}': {str(e)}")
            return []
    
    def _extract_app_id(self, url: str) -> str:
        """
        Extract app ID from URL.
        
        Args:
            url: App URL
            
        Returns:
            App ID string
        """
        # Implementation to extract ID from URL
        # This is a simplified version - actual implementation may vary
        import re
        match = re.search(r'id=([a-zA-Z][a-zA-Z0-9_\.]*)', url)
        return match.group(1) if match else ""