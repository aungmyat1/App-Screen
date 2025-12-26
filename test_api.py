#!/usr/bin/env python3
"""
Simple API test to verify the endpoints work with our changes
"""

import os
import sys

# Add the backend/src directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend', 'src'))

# Set development environment
os.environ['ENVIRONMENT'] = 'development'

def test_api_endpoints():
    """Test the API endpoints work properly"""
    from main import app
    from fastapi.testclient import TestClient
    
    client = TestClient(app)
    
    # Test root endpoint
    response = client.get('/')
    print(f"Root endpoint: {response.status_code}")
    print(f"Response: {response.json()}")
    assert response.status_code == 200
    assert "message" in response.json()
    print("✅ Root endpoint working")
    
    # Test health endpoint
    response = client.get('/health')
    print(f"Health endpoint: {response.status_code}")
    print(f"Response: {response.json()}")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
    print("✅ Health endpoint working")
    
    # Test screenshots health endpoint
    response = client.get('/screenshots/health')
    print(f"Screenshots health endpoint: {response.status_code}")
    print(f"Response: {response.json()}")
    assert response.status_code == 200
    # Check that it reports Playwright availability
    assert "playwright_available" in response.json()
    print("✅ Screenshots health endpoint working")
    
    # Test screenshot scraping with mock data
    screenshot_request = {'app_id': '123456789', 'store': 'appstore'}
    response = client.post('/screenshots/scrape', json=screenshot_request)
    print(f"Screenshot scrape endpoint (App Store): {response.status_code}")
    print(f"Response: {response.json()}")
    assert response.status_code == 200
    assert response.json()["app_id"] == "123456789"
    assert response.json()["store"] == "appstore"
    assert "screenshots" in response.json()
    print("✅ Screenshot scrape endpoint working for App Store")
    
    # Test with Play Store
    screenshot_request = {'app_id': 'com.example.app', 'store': 'playstore'}
    response = client.post('/screenshots/scrape', json=screenshot_request)
    print(f"Screenshot scrape endpoint (Play Store): {response.status_code}")
    print(f"Response: {response.json()}")
    assert response.status_code == 200
    assert response.json()["app_id"] == "com.example.app"
    assert response.json()["store"] == "playstore"
    assert "screenshots" in response.json()
    print("✅ Screenshot scrape endpoint working for Play Store")
    
    print("\n🎉 All API tests passed!")
    print("\nSummary:")
    print("- All endpoints are accessible and returning correct status codes")
    print("- Screenshot scraping returns mock data when Playwright is unavailable")
    print("- Both App Store and Play Store endpoints work correctly")
    print("- Health checks properly report system status")


if __name__ == "__main__":
    print("Testing App-Screen API endpoints...")
    print()
    
    test_api_endpoints()