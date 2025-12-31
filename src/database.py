from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import QueuePool
from pydantic_settings import BaseSettings
import os


class Settings(BaseSettings):
    database_url: str = os.getenv("DATABASE_URL", "postgresql://appscreen:password@localhost:5432/appscreen")
    database_pool_size: int = int(os.getenv("DATABASE_POOL_SIZE", "10"))
    database_pool_max_overflow: int = int(os.getenv("DATABASE_POOL_MAX_OVERFLOW", "20"))
    database_pool_pre_ping: bool = os.getenv("DATABASE_POOL_PRE_PING", "True").lower() == "true"
    database_pool_recycle: int = int(os.getenv("DATABASE_POOL_RECYCLE", "300"))
    
    class Config:
        env_file = ".env"


settings = Settings()

# Create the SQLAlchemy engine with connection pooling
engine = create_engine(
    settings.database_url,
    poolclass=QueuePool,
    pool_size=settings.database_pool_size,
    max_overflow=settings.database_pool_max_overflow,
    pool_pre_ping=settings.database_pool_pre_ping,
    pool_recycle=settings.database_pool_recycle,
)

# Create a session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()


def get_db():
    """Dependency for FastAPI to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_all_tables():
    """Create all tables defined in models"""
    from .models import Base
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    # Create all tables when running this module directly
    create_all_tables()
    print("Database tables created successfully!")