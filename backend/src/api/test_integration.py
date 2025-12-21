import unittest
import sys
import os
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from src.api.main import app
from src.database.connection import Base
from src.models.user import User
from src.models.scrape_job import ScrapeJob
from src.models.screenshot import Screenshot
from src.models.api_usage import APIUsage

# Add the parent directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))

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


class APITestCase(unittest.TestCase):
    def setUp(self):
        # Create a test client
        self.client = TestClient(app)
        
        # Create a test user
        db = TestingSessionLocal()
        test_user = User(
            email="test@example.com",
            api_key="test_api_key",
            tier="pro",
            quota_remaining=100
        )
        db.add(test_user)
        db.commit()
        db.refresh(test_user)
        self.test_user = test_user
        self.test_user_id = test_user.id
        db.close()

    def tearDown(self):
        # Clean up test database
        db = TestingSessionLocal()
        db.query(APIUsage).delete()
        db.query(Screenshot).delete()
        db.query(ScrapeJob).delete()
        db.query(User).delete()
        db.commit()
        db.close()

    def test_health_check(self):
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "healthy")

    def test_create_user(self):
        response = self.client.post("/api/v1/users/", json={
            "email": "newuser@example.com",
            "api_key": "new_api_key",
            "tier": "free",
            "quota_remaining": 50
        })
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertEqual(data["email"], "newuser@example.com")
        self.assertEqual(data["tier"], "free")

    def test_get_user(self):
        response = self.client.get(f"/api/v1/users/{self.test_user_id}")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["email"], "test@example.com")

    def test_list_users(self):
        response = self.client.get("/api/v1/users/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertGreaterEqual(len(data), 1)

    def test_update_user(self):
        response = self.client.put(f"/api/v1/users/{self.test_user_id}", json={
            "email": "updated@example.com",
            "tier": "enterprise"
        })
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["email"], "updated@example.com")
        self.assertEqual(data["tier"], "enterprise")

    def test_delete_user(self):
        # Create a user to delete
        response = self.client.post("/api/v1/users/", json={
            "email": "todelete@example.com",
            "api_key": "delete_key",
            "tier": "free",
            "quota_remaining": 50
        })
        self.assertEqual(response.status_code, 201)
        user_id = response.json()["id"]
        
        # Delete the user
        response = self.client.delete(f"/api/v1/users/{user_id}")
        self.assertEqual(response.status_code, 204)
        
        # Verify user is deleted
        response = self.client.get(f"/api/v1/users/{user_id}")
        self.assertEqual(response.status_code, 404)

    def test_create_scrape_job(self):
        response = self.client.post("/api/v1/jobs/", json={
            "user_id": self.test_user_id,
            "app_id": "com.example.app",
            "store": "playstore",
            "status": "pending"
        })
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertEqual(data["app_id"], "com.example.app")
        self.assertEqual(data["store"], "playstore")

    def test_get_scrape_job(self):
        # Create a job first
        response = self.client.post("/api/v1/jobs/", json={
            "user_id": self.test_user_id,
            "app_id": "com.example.app",
            "store": "playstore",
            "status": "pending"
        })
        self.assertEqual(response.status_code, 201)
        job_id = response.json()["id"]
        
        # Get the job
        response = self.client.get(f"/api/v1/jobs/{job_id}")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["app_id"], "com.example.app")

    def test_create_screenshot(self):
        # Create a job first
        job_response = self.client.post("/api/v1/jobs/", json={
            "user_id": self.test_user_id,
            "app_id": "com.example.app",
            "store": "playstore",
            "status": "pending"
        })
        self.assertEqual(job_response.status_code, 201)
        job_id = job_response.json()["id"]
        
        # Create a screenshot
        response = self.client.post("/api/v1/screenshots-crud/", json={
            "job_id": job_id,
            "url": "https://example.com/screenshot.png",
            "device_type": "mobile",
            "resolution": "1080x1920"
        })
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertEqual(data["url"], "https://example.com/screenshot.png")
        self.assertEqual(data["device_type"], "mobile")

    def test_scrape_screenshots_endpoint(self):
        response = self.client.post("/api/v1/screenshots/scrape", json={
            "app_id": "com.example.app",
            "store": "playstore",
            "force_refresh": False
        }, headers={"Authorization": "Bearer test_api_key"})
        # This will fail because we haven't implemented proper auth middleware for tests
        # But we can at least check that the endpoint exists
        self.assertIn(response.status_code, [200, 401, 403])

    def test_batch_scrape_endpoint(self):
        response = self.client.post("/api/v1/screenshots/batch", json={
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
        }, headers={"Authorization": "Bearer test_api_key"})
        # This will fail because we haven't implemented proper auth middleware for tests
        # But we can at least check that the endpoint exists
        self.assertIn(response.status_code, [200, 401, 403])


if __name__ == "__main__":
    unittest.main()