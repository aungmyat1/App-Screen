from sqlalchemy import create_engine
from .connection import Base, DATABASE_URL
from ..models.user import User
from ..models.scrape_job import ScrapeJob
from ..models.screenshot import Screenshot
from ..models.api_usage import APIUsage

def init_database():
    """
    Initialize the database by creating all tables
    """
    engine = create_engine(DATABASE_URL)
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    init_database()