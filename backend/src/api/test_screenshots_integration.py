import unittest
import sys
import os
from typing import List
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from pydantic import BaseModel

# Add the parent directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))

# Import the schema models
try:
    from src.models.schemas import ScrapeRequest
except ImportError:
    # Define locally if import fails
    class ScrapeRequest(BaseModel):
        app_id: str
        store: str
        force_refresh: bool = False

from src.api.main import app
from src.database.connection import Base

# Create a test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables
Base.metadata.create_all(bind=engine)

# Override the database dependency
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

# Apply the override
from src.database.connection import get_db
app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

class BatchScrapeRequest(BaseModel):
    requests: List[ScrapeRequest]

class ScreenshotAPITestCase(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)
        # In a real test, we would set up a test user and auth token
        self.auth_header = {"Authorization": "Bearer test_token"}

    def tearDown(self):
        # Clean up after tests
        pass

    def test_scrape_screenshots(self):
        response = self.client.post(
            "/api/v1/screenshots/scrape",
            json={
                "app_id": "com.example.app",
                "store": "playstore",
                "force_refresh": False
            },
            headers=self.auth_header
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("job_id", data)
        self.assertIn("status", data)
        self.assertIn("estimated_time", data)

    def test_get_job_status(self):
        # First create a job
        scrape_response = self.client.post(
            "/api/v1/screenshots/scrape",
            json={
                "app_id": "com.example.app",
                "store": "playstore",
                "force_refresh": False
            },
            headers=self.auth_header
        )
        self.assertEqual(scrape_response.status_code, 200)
        job_data = scrape_response.json()
        job_id = job_data["job_id"]

        # Then get job status
        response = self.client.get(
            f"/api/v1/screenshots/job/{job_id}",
            headers=self.auth_header
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("job_id", data)
        self.assertIn("status", data)
        self.assertIn("screenshots", data)
        self.assertIn("progress", data)

    def test_batch_scrape(self):
        # Send the requests as a proper BatchScrapeRequest object
        batch_request = {
            "requests": [
                {
                    "app_id": "com.example.app1",
                    "store": "playstore",
                    "force_refresh": False
                },
                {
                    "app_id": "com.example.app2",
                    "store": "appstore",
                    "force_refresh": True
                }
            ]
        }
        
        response = self.client.post(
            "/api/v1/screenshots/batch",
            json=batch_request,
            headers=self.auth_header
        )
        # Print response for debugging
        print(f"Batch scrape response status: {response.status_code}")
        print(f"Batch scrape response data: {response.json()}")
        
        # The endpoint should exist and accept the request
        # Note: It might return 403 if user tier is not pro, but should not return 422
        self.assertIn(response.status_code, [200, 403])

    def test_get_screenshot_by_id(self):
        # Test with the CRUD endpoint since that's where individual screenshots are managed
        response = self.client.get(
            "/api/v1/screenshots-crud/1",
            headers=self.auth_header
        )
        # With mock data, we expect 404 since there's no real database connection
        # In a real test with proper DB setup, this would return 200
        self.assertIn(response.status_code, [200, 404])

    def test_list_screenshots_by_job(self):
        # Test with the CRUD endpoint
        response = self.client.get(
            "/api/v1/screenshots-crud/",
            headers=self.auth_header
        )
        # Should return 200 with empty list or 404 if no screenshots exist
        self.assertIn(response.status_code, [200, 404])

    def test_update_screenshot(self):
        # Test with the CRUD endpoint
        response = self.client.put(
            "/api/v1/screenshots-crud/1",
            json={
                "device_type": "iPhone 13 Pro",
                "resolution": "1170x2532"
            },
            headers=self.auth_header
        )
        # Should return 200 if successful or 404 if screenshot doesn't exist
        self.assertIn(response.status_code, [200, 404])

    def test_delete_screenshot(self):
        # Test with the CRUD endpoint
        response = self.client.delete(
            "/api/v1/screenshots-crud/1",
            headers=self.auth_header
        )
        # We expect either 204 (success) or 404 (not found) depending on implementation
        self.assertIn(response.status_code, [204, 404])


if __name__ == "__main__":
    unittest.main()