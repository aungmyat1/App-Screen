import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .pool import create_pooled_engine

# Get database URL from environment variables or use default
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://appscreens_user:appscreens_pass@localhost:5432/appscreens")

# Create engine with connection pooling
engine = create_pooled_engine()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """
    Dependency to get DB session
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()