"""
Database Setup Script

This script creates the required tables in the PostgreSQL database based on the schema:
- users
- scrape_jobs
- screenshots
- api_usage
"""

from sqlalchemy import text
from .database import engine
from .models import Base


def create_all_tables():
    """
    Create all tables defined in models using SQLAlchemy
    This will create the following tables:
    - users
    - scrape_jobs
    - screenshots
    - api_usage
    """
    print("Creating database tables...")
    
    # Create all tables using SQLAlchemy's metadata
    Base.metadata.create_all(bind=engine)
    
    print("Database tables created successfully!")


def create_indexes():
    """
    Create additional indexes that may not be handled properly by SQLAlchemy
    """
    print("Creating database indexes...")
    
    with engine.connect() as conn:
        # Create the index for api_usage table if it doesn't exist
        conn.execute(text(
            "CREATE INDEX IF NOT EXISTS "
            "idx_user_created ON api_usage (user_id, created_at);"
        ))
        conn.commit()
    
    print("Database indexes created successfully!")


def verify_tables():
    """
    Verify that all required tables have been created
    """
    from sqlalchemy import inspect
    
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    
    required_tables = ['users', 'scrape_jobs', 'screenshots', 'api_usage']
    
    print("Verifying tables...")
    for table in required_tables:
        if table in tables:
            print(f"✓ Table '{table}' exists")
        else:
            print(f"✗ Table '{table}' missing")
    
    # Check for the index
    with engine.connect() as conn:
        result = conn.execute(text(
            "SELECT indexname FROM pg_indexes "
            "WHERE tablename = 'api_usage' AND indexname = 'idx_user_created';"
        )).fetchone()
        
        if result:
            print(f"✓ Index 'idx_user_created' on api_usage exists")
        else:
            print(f"✗ Index 'idx_user_created' on api_usage missing")
    
    return all(table in tables for table in required_tables)


if __name__ == "__main__":
    print("AppScreens Database Setup")
    print("=========================")
    
    # Create all tables
    create_all_tables()
    
    # Create indexes
    create_indexes()
    
    # Verify tables were created
    if verify_tables():
        print("\n✓ All tables and indexes created successfully!")
    else:
        print("\n✗ Some tables or indexes are missing!")
        exit(1)