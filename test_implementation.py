#!/usr/bin/env python3
"""
Test script to verify the implementation of Playwright availability checks
and the fallback mechanisms we've implemented.
"""

import os
import sys
import asyncio

# Add the backend/src directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend', 'src'))

# Set development environment
os.environ['ENVIRONMENT'] = 'development'

def test_playwright_availability():
    """Test that Playwright availability is properly checked"""
    from api.screenshot_routes import PLAYWRIGHT_AVAILABLE
    print(f"Playwright available: {PLAYWRIGHT_AVAILABLE}")
    
    # This should be False since Playwright is not installed
    assert PLAYWRIGHT_AVAILABLE is False, "Playwright should not be available in this environment"
    print("✅ Playwright availability correctly detected as False")


def test_app_store_scraper():
    """Test AppStore scraper with fallback mechanism"""
    from core.appstore_scraper import AppStoreScraper
    
    scraper = AppStoreScraper()
    print(f"AppStore Scraper Playwright available: {scraper.playwright_available}")
    
    # Test validation
    assert scraper.validate_app_id("123456789") is True, "Valid App Store ID should pass validation"
    assert scraper.validate_app_id("abc") is False, "Invalid App Store ID should fail validation"
    print("✅ AppStore scraper validation working correctly")
    
    # Test async scraping (this will return mock data in development)
    async def test_scrape():
        screenshots = await scraper.scrape_screenshots("123456789")
        print(f"AppStore scraper returned {len(screenshots)} screenshots: {screenshots}")
        # In development mode without Playwright, it should return mock data
        if os.getenv("ENVIRONMENT") == "development" and not scraper.playwright_available:
            assert len(screenshots) > 0, "Should return mock data in development mode"
        print("✅ AppStore scraper working with fallback")
    
    asyncio.run(test_scrape())


def test_play_store_scraper():
    """Test PlayStore scraper with fallback mechanism"""
    from core.playstore_scraper import PlayStoreScraper
    
    scraper = PlayStoreScraper()
    print(f"PlayStore Scraper Playwright available: {scraper.playwright_available}")
    
    # Test validation
    assert scraper.validate_app_id("com.example.app") is True, "Valid Play Store ID should pass validation"
    assert scraper.validate_app_id("invalid") is False, "Invalid Play Store ID should fail validation"
    print("✅ PlayStore scraper validation working correctly")
    
    # Test async scraping (this will return mock data in development)
    async def test_scrape():
        screenshots = await scraper.scrape_screenshots("com.example.app")
        print(f"PlayStore scraper returned {len(screenshots)} screenshots: {screenshots}")
        # In development mode without Playwright, it should return mock data
        if os.getenv("ENVIRONMENT") == "development" and not scraper.playwright_available:
            assert len(screenshots) > 0, "Should return mock data in development mode"
        print("✅ PlayStore scraper working with fallback")
    
    asyncio.run(test_scrape())


def test_base_scraper():
    """Test that base scraper has the availability check"""
    from core.base_scraper import PLAYWRIGHT_AVAILABLE
    print(f"Base scraper Playwright available: {PLAYWRIGHT_AVAILABLE}")
    
    assert PLAYWRIGHT_AVAILABLE is False, "Base scraper should also detect Playwright as unavailable"
    print("✅ Base scraper Playwright availability check working")


if __name__ == "__main__":
    print("Testing App-Screen implementation with Playwright fallback...")
    print()
    
    test_playwright_availability()
    print()
    
    test_base_scraper()
    print()
    
    test_app_store_scraper()
    print()
    
    test_play_store_scraper()
    print()
    
    print("🎉 All tests passed! Implementation is working correctly.")
    print()
    print("Summary:")
    print("- Playwright availability is properly checked at runtime")
    print("- Fallback mechanisms work in development mode")
    print("- Both AppStore and PlayStore scrapers return mock data when Playwright is unavailable")
    print("- Validation logic works for both store types")
    print("- Development can proceed without Playwright installed")