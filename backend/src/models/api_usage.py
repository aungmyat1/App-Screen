from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database.connection import Base

class APIUsage(Base):
    __tablename__ = "api_usage"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    endpoint = Column(String(100))
    response_time_ms = Column(Integer)
    status_code = Column(Integer)
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="api_usages")
    
    def __repr__(self):
        return f"<APIUsage(id={self.id}, user_id={self.user_id}, endpoint='{self.endpoint}', status_code={self.status_code})>"

# Add relationship to User model
from .user import User
User.api_usages = relationship("APIUsage", back_populates="user")