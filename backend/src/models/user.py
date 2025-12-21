from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from ..database.connection import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    api_key = Column(String(64), unique=True, index=True, nullable=False)
    tier = Column(String(20), default="free")
    quota_remaining = Column(Integer, default=100)
    created_at = Column(DateTime, default=func.now())
    
    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', tier='{self.tier}')>"