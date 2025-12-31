from sqlalchemy import Column, Integer, Text, ForeignKey, Index, TIMESTAMP
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import VARCHAR
import os
from typing import Optional


Base = declarative_base()


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(VARCHAR(255), unique=True, nullable=False)
    api_key = Column(VARCHAR(64), unique=True, nullable=False)
    tier = Column(VARCHAR(20), default='free')
    quota_remaining = Column(Integer, default=100)
    created_at = Column(TIMESTAMP, server_default=func.now())

    # Relationship
    scrape_jobs = relationship("ScrapeJob", back_populates="user")
    api_usage_records = relationship("ApiUsage", back_populates="user")


class ScrapeJob(Base):
    __tablename__ = 'scrape_jobs'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    app_id = Column(VARCHAR(255), nullable=False)
    store = Column(VARCHAR(20), nullable=False)
    status = Column(VARCHAR(20), default='pending')
    screenshots_count = Column(Integer, default=0)
    started_at = Column(TIMESTAMP)
    completed_at = Column(TIMESTAMP)
    error_message = Column(Text)
    created_at = Column(TIMESTAMP, server_default=func.now())

    # Relationship
    user = relationship("User", back_populates="scrape_jobs")
    screenshots = relationship("Screenshot", back_populates="job")


class Screenshot(Base):
    __tablename__ = 'screenshots'

    id = Column(Integer, primary_key=True, autoincrement=True)
    job_id = Column(Integer, ForeignKey('scrape_jobs.id'))
    url = Column(Text, nullable=False)
    s3_key = Column(VARCHAR(512))
    device_type = Column(VARCHAR(20))
    resolution = Column(VARCHAR(20))
    file_size = Column(Integer)
    created_at = Column(TIMESTAMP, server_default=func.now())

    # Relationship
    job = relationship("ScrapeJob", back_populates="screenshots")


class ApiUsage(Base):
    __tablename__ = 'api_usage'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    endpoint = Column(VARCHAR(100))
    response_time_ms = Column(Integer)
    status_code = Column(Integer)
    created_at = Column(TIMESTAMP, server_default=func.now())

    # Relationship
    user = relationship("User", back_populates="api_usage_records")


# Define the index for api_usage table
Index('idx_user_created', ApiUsage.user_id, ApiUsage.created_at)