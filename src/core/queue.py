"""
Queue module for the screenshot SaaS application.
"""
from celery import Celery
from typing import Any, Dict
import logging

logger = logging.getLogger(__name__)


class QueueManager:
    """
    Manager for task queue operations using Celery.
    """
    
    def __init__(self, broker_url: str = "redis://localhost:6379", backend_url: str = "redis://localhost:6379"):
        """
        Initialize the queue manager.
        
        Args:
            broker_url: URL for the message broker (Redis/RabbitMQ)
            backend_url: URL for the result backend
        """
        self.celery_app = Celery(
            'screenshot_saas',
            broker=broker_url,
            backend=backend_url
        )
        
        # Configure Celery
        self.celery_app.conf.update(
            task_serializer='json',
            accept_content=['json'],
            result_serializer='json',
            timezone='UTC',
            enable_utc=True,
            result_expires=3600,
            task_routes={
                'scraper_task': {'queue': 'scraper'},
                'storage_task': {'queue': 'storage'},
                'image_processing_task': {'queue': 'image_processing'},
            }
        )
    
    def register_task(self, func):
        """
        Decorator to register a function as a Celery task.
        
        Args:
            func: Function to register as a task
            
        Returns:
            Celery task
        """
        return self.celery_app.task(func)
    
    def send_task(self, name: str, args: tuple = None, kwargs: dict = None) -> Any:
        """
        Send a task to the queue.
        
        Args:
            name: Name of the task
            args: Arguments to pass to the task
            kwargs: Keyword arguments to pass to the task
            
        Returns:
            AsyncResult object
        """
        try:
            result = self.celery_app.send_task(name, args=args, kwargs=kwargs)
            logger.info(f"Task {name} sent with ID: {result.task_id}")
            return result
        except Exception as e:
            logger.error(f"Error sending task {name}: {e}")
            raise
    
    def get_task_result(self, task_id: str):
        """
        Get the result of a task.
        
        Args:
            task_id: ID of the task
            
        Returns:
            Task result
        """
        try:
            result = self.celery_app.AsyncResult(task_id)
            return result
        except Exception as e:
            logger.error(f"Error getting result for task {task_id}: {e}")
            raise
    
    def is_task_ready(self, task_id: str) -> bool:
        """
        Check if a task is ready (completed).
        
        Args:
            task_id: ID of the task
            
        Returns:
            True if task is ready, False otherwise
        """
        result = self.get_task_result(task_id)
        return result.ready()
    
    def get_task_status(self, task_id: str) -> str:
        """
        Get the status of a task.
        
        Args:
            task_id: ID of the task
            
        Returns:
            Task status
        """
        result = self.get_task_result(task_id)
        return result.status