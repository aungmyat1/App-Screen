from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database.connection import Base

class Screenshot(Base):
    __tablename__ = "screenshots"
    
    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("scrape_jobs.id"))
    url = Column(Text, nullable=False)
    s3_key = Column(String(512))
    device_type = Column(String(20))
    resolution = Column(String(20))
    file_size = Column(Integer)
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    job = relationship("ScrapeJob", back_populates="screenshots")
    
    def __repr__(self):
        return f"<Screenshot(id={self.id}, job_id={self.job_id}, url='{self.url}')>"