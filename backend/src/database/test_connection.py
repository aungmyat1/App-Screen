#!/usr/bin/env python3
"""
Test database connection and basic operations
"""

import sys
import os

# Add the src directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from .connection import SessionLocal, engine
from ..models.user import User
from ..models.scrape_job import ScrapeJob
from ..models.screenshot import Screenshot
from ..models.api_usage import APIUsage

def test_connection():
    """
    Test database connection by performing basic operations
    """
    print("Testing database connection...")
    
    try:
        # Create a session
        db = SessionLocal()
        
        # Test creating a user
        test_user = User(
            email="test@example.com",
            api_key="test_api_key_12345",
            tier="premium",
            quota_remaining=500
        )
        
        db.add(test_user)
        db.commit()
        db.refresh(test_user)
        
        print(f"Successfully created user with ID: {test_user.id}")
        
        # Test querying the user
        user = db.query(User).filter(User.email == "test@example.com").first()
        print(f"Retrieved user: {user.email}, tier: {user.tier}")
        
        # Clean up - delete the test user
        db.delete(test_user)
        db.commit()
        
        print("Database connection test successful!")
        return True
        
    except Exception as e:
        print(f"Database connection test failed: {e}")
        return False
    finally:
        db.close()

if __name__ == "__main__":
    test_connection()