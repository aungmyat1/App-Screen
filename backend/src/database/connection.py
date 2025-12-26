import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
from .pool import create_pooled_engine

# Database setup with fallback
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://appscreens_user:appscreens_pass@localhost:5432/appscreens")

# Check if it's a PostgreSQL URL
if DATABASE_URL.startswith("postgresql"):
    try:
        # Try PostgreSQL first with connection pooling
        engine = create_pooled_engine()
        # Test the connection
        with engine.connect() as conn:
            pass
    except Exception as e:
        print(f"PostgreSQL connection failed: {e}")
        print("Falling back to SQLite for development...")
        DATABASE_URL = "sqlite:///./appscreen.db"
        engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    # Use SQLite directly
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

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