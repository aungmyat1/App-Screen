#!/usr/bin/env python3
"""
Database setup script for the AppScreens application.
This script initializes the database and runs migrations.
"""

import os
import sys
import asyncio

# Add the src directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from .connection import Base, engine
from .utils import run_migrations
from ..models.user import User
from ..models.scrape_job import ScrapeJob
from ..models.screenshot import Screenshot
from ..models.api_usage import APIUsage

def create_tables():
    """
    Create all tables in the database
    """
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

def setup_database():
    """
    Setup the database with tables and initial migrations
    """
    print("Setting up the database...")
    create_tables()
    print("Database setup completed!")

if __name__ == "__main__":
    setup_database()