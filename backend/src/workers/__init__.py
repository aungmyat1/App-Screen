"""
Worker Module for Screenshot Scraper Application

This module contains Celery tasks and configuration for handling
background jobs such as scraping app store screenshots and downloading images.
"""

# Import tasks to make them available to Celery
from . import tasks

__all__ = ['tasks']