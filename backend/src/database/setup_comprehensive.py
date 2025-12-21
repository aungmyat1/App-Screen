#!/usr/bin/env python3
"""
Comprehensive database setup script for the AppScreens application.
This script initializes the database with the exact schema specified.
"""

import os
import sys
import asyncio

# Add the src directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError
from .connection import DATABASE_URL


# SQL schema definition matching exactly what was specified
SCHEMA_SQL = """
-- PostgreSQL Schema
-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    api_key VARCHAR(64) UNIQUE NOT NULL,
    tier VARCHAR(20) DEFAULT 'free',
    quota_remaining INTEGER DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Scrape jobs table
CREATE TABLE IF NOT EXISTS scrape_jobs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    app_id VARCHAR(255) NOT NULL,
    store VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    screenshots_count INTEGER DEFAULT 0,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Screenshots table
CREATE TABLE IF NOT EXISTS screenshots (
    id SERIAL PRIMARY KEY,
    job_id INTEGER REFERENCES scrape_jobs(id),
    url TEXT NOT NULL,
    s3_key VARCHAR(512),
    device_type VARCHAR(20),
    resolution VARCHAR(20),
    file_size INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- API usage table
CREATE TABLE IF NOT EXISTS api_usage (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    endpoint VARCHAR(100),
    response_time_ms INTEGER,
    status_code INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_scrape_jobs_user_id ON scrape_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_screenshots_job_id ON screenshots(job_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_user_created ON api_usage(user_id, created_at);
"""


def setup_database():
    """
    Setup the database with the exact schema specified
    """
    print("Setting up the database with specified schema...")
    
    try:
        # Create engine
        engine = create_engine(DATABASE_URL)
        
        # Execute the schema SQL
        with engine.connect() as conn:
            # Execute each statement separately to handle any issues
            statements = SCHEMA_SQL.split(';')
            for statement in statements:
                statement = statement.strip()
                if statement and not statement.startswith('--'):
                    print(f"Executing: {statement[:50]}...")
                    conn.execute(text(statement))
            
            conn.commit()
            
        print("Database schema created successfully!")
        return True
        
    except SQLAlchemyError as e:
        print(f"Error setting up database: {e}")
        return False
    except Exception as e:
        print(f"Unexpected error: {e}")
        return False


def verify_schema():
    """
    Verify that all tables and indexes were created correctly
    """
    print("Verifying database schema...")
    
    try:
        engine = create_engine(DATABASE_URL)
        
        # Check if all tables exist
        expected_tables = ['users', 'scrape_jobs', 'screenshots', 'api_usage']
        
        with engine.connect() as conn:
            # Get list of tables
            result = conn.execute(text("SELECT tablename FROM pg_tables WHERE schemaname = 'public'"))
            tables = [row[0] for row in result]
            
            # Verify each expected table exists
            for table in expected_tables:
                if table in tables:
                    print(f"✓ Table '{table}' exists")
                else:
                    print(f"✗ Table '{table}' is missing")
                    
            # Check indexes
            index_check_sql = """
            SELECT indexname FROM pg_indexes 
            WHERE schemaname = 'public' 
            AND indexname IN ('idx_scrape_jobs_user_id', 'idx_screenshots_job_id', 'idx_api_usage_user_created')
            """
            
            result = conn.execute(text(index_check_sql))
            indexes = [row[0] for row in result]
            
            expected_indexes = ['idx_scrape_jobs_user_id', 'idx_screenshots_job_id', 'idx_api_usage_user_created']
            for index in expected_indexes:
                if index in indexes:
                    print(f"✓ Index '{index}' exists")
                else:
                    print(f"✗ Index '{index}' is missing")
                    
        print("Schema verification completed!")
        return True
        
    except Exception as e:
        print(f"Error verifying schema: {e}")
        return False


if __name__ == "__main__":
    print("AppScreens Database Setup")
    print("=" * 30)
    
    # Setup database
    if setup_database():
        # Verify schema
        verify_schema()
        print("\nDatabase setup completed successfully!")
    else:
        print("\nDatabase setup failed!")
        sys.exit(1)