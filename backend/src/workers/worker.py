#!/usr/bin/env python3
"""
Celery Worker Entry Point for Screenshot Scraper
"""

import os
import sys

# Add the project root to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))

if __name__ == '__main__':
    # Import the Celery app
    from backend.src.workers.celery_app import celery_app
    
    # Start the Celery worker
    celery_app.start()