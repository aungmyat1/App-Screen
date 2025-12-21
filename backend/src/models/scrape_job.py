from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database.connection import Base

class ScrapeJob(Base):
    __tablename__ = "scrape_jobs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    app_id = Column(String(255), nullable=False)
    store = Column(String(20), nullable=False)
    status = Column(String(20), default="pending")
    screenshots_count = Column(Integer, default=0)
    started_at = Column(DateTime)
    completed_at = Column(DateTime)
    error_message = Column(Text)
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="scrape_jobs")
    screenshots = relationship("Screenshot", back_populates="job")
    
    def __repr__(self):
        return f"<ScrapeJob(id={self.id}, app_id='{self.app_id}', store='{self.store}', status='{self.status}')>"

# Add relationship to User model
from .user import User
User.scrape_jobs = relationship("ScrapeJob", back_populates="user")