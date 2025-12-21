-- PostgreSQL Schema
-- Migration: Initial schema setup

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    api_key VARCHAR(64) UNIQUE NOT NULL,
    tier VARCHAR(20) DEFAULT 'free',
    quota_remaining INTEGER DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Scrape jobs table
CREATE TABLE scrape_jobs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    app_id VARCHAR(255) NOT NULL,
    store VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    screenshots_count INTEGER DEFAULT 0,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Screenshots table
CREATE TABLE screenshots (
    id SERIAL PRIMARY KEY,
    job_id INTEGER REFERENCES scrape_jobs(id),
    url TEXT NOT NULL,
    s3_key VARCHAR(512),
    device_type VARCHAR(20),
    resolution VARCHAR(20),
    file_size INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- API usage table
CREATE TABLE api_usage (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    endpoint VARCHAR(100),
    response_time_ms INTEGER,
    status_code INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better performance
CREATE INDEX idx_scrape_jobs_user_id ON scrape_jobs(user_id);
CREATE INDEX idx_screenshots_job_id ON screenshots(job_id);
CREATE INDEX idx_api_usage_user_created ON api_usage(user_id, created_at);