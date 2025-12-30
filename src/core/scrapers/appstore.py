"""
App Store scraper implementation.
"""
import asyncio
import aiohttp
from typing import List, Dict, Any
from bs4 import BeautifulSoup
from .base import BaseScraper


class AppStoreScraper(BaseScraper):
    """
    Scraper for Apple App Store.
    """
    
    def __init__(self, headless: bool = True):
        super().__init__(base_url="https://apps.apple.com", headless=headless)
    
    async def get_app_screenshots(self, app_id: str) -> List[Dict[str, Any]]:
        """
        Get screenshots for an app from the App Store.
        
        Args:
            app_id: The App Store app ID (e.g., "1234567890")
            
        Returns:
            List of screenshot data
        """
        url = f"{self.base_url}/us/app/id{app_id}"
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(url) as response:
                    if response.status != 200:
                        return []
                    
                    html = await response.text()
                    soup = BeautifulSoup(html, 'html.parser')
                    
                    # Find screenshot elements (this selector might need adjustment based on actual page structure)
                    screenshot_elements = soup.select('div.we-screenshot-group img, figure.screenshots img')
                    
                    screenshots = []
                    for img in screenshot_elements:
                        src = img.get('data-src') or img.get('src')
                        if src:
                            # Handle relative URLs
                            if src.startswith('//'):
                                src = 'https:' + src
                            elif src.startswith('/'):
                                src = self.base_url + src
                            
                            screenshots.append({
                                'url': src,
                                'alt': img.get('alt', ''),
                                'type': 'appstore'
                            })
                    
                    return screenshots
        except Exception as e:
            print(f"Error scraping App Store for app {app_id}: {str(e)}")
            return []
    
    async def search_apps(self, query: str) -> List[Dict[str, Any]]:
        """
        Search for apps on the App Store.
        
        Args:
            query: Search query string
            
        Returns:
            List of app data
        """
        search_url = f"{self.base_url}/us/search/{query}"
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(search_url) as response:
                    if response.status != 200:
                        return []
                    
                    html = await response.text()
                    soup = BeautifulSoup(html, 'html.parser')
                    
                    # Find app elements (this selector might need adjustment based on actual page structure)
                    app_elements = soup.select('div.apps-list div.app')
                    
                    apps = []
                    for app in app_elements:
                        title_elem = app.select_one('h3 a')
                        if title_elem:
                            app_data = {
                                'name': title_elem.text.strip(),
                                'id': self._extract_app_id(title_elem.get('href', '')),
                                'url': title_elem.get('href', ''),
                                'type': 'appstore'
                            }
                            apps.append(app_data)
                    
                    return apps
        except Exception as e:
            print(f"Error searching App Store for query '{query}': {str(e)}")
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
        match = re.search(r'id(\d+)', url)
        return match.group(1) if match else ""