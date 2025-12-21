from sqlalchemy import create_engine
from sqlalchemy.pool import QueuePool
import os

# Database connection pooling configuration
def get_database_url():
    """
    Get database URL from environment variables or return default
    """
    return os.getenv(
        "DATABASE_URL", 
        "postgresql://appscreens_user:appscreens_pass@localhost:5432/appscreens"
    )

def create_pooled_engine():
    """
    Create a database engine with connection pooling
    """
    database_url = get_database_url()
    
    engine = create_engine(
        database_url,
        poolclass=QueuePool,
        pool_size=10,              # Number of connections to maintain in the pool
        max_overflow=20,           # Number of connections that can be created beyond pool_size
        pool_recycle=3600,         # Recycle connections after 1 hour
        pool_pre_ping=True,        # Verify connections before use
        pool_timeout=30,           # Timeout when getting connection from pool
        echo=False                 # Set to True for SQL debugging
    )
    
    return engine

# Example usage:
# engine = create_pooled_engine()
# connection = engine.connect()