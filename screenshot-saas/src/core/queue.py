import time
import uuid
from typing import Dict, Any, Optional
from datetime import datetime


class TaskQueue:
    """Task queue for managing scraping jobs"""
    
    def __init__(self):
        """Initialize the task queue"""
        self.queue = []  # List of tasks
        self.processing = {}  # Tasks currently being processed
        self.completed = {}  # Completed tasks
    
    def enqueue(self, task_data: Dict[str, Any]) -> str:
        """
        Add a task to the queue
        
        Args:
            task_data (dict): Task data containing app_id, scraper_type, etc.
            
        Returns:
            str: Task ID
        """
        task_id = str(uuid.uuid4())
        task = {
            'id': task_id,
            'data': task_data,
            'status': 'queued',
            'created_at': datetime.now(),
            'started_at': None,
            'completed_at': None,
            'result': None,
            'error': None
        }
        
        self.queue.append(task)
        return task_id
    
    def dequeue(self) -> Optional[Dict[str, Any]]:
        """
        Remove and return the next task from the queue
        
        Returns:
            dict: Task dictionary or None if queue is empty
        """
        if self.queue:
            task = self.queue.pop(0)
            task['status'] = 'processing'
            task['started_at'] = datetime.now()
            self.processing[task['id']] = task
            return task
        return None
    
    def complete_task(self, task_id: str, result: Any = None, error: str = None):
        """
        Mark a task as completed
        
        Args:
            task_id (str): Task identifier
            result (Any): Task result
            error (str): Error message if task failed
        """
        if task_id in self.processing:
            task = self.processing.pop(task_id)
            task['completed_at'] = datetime.now()
            
            if error:
                task['status'] = 'failed'
                task['error'] = error
            else:
                task['status'] = 'completed'
                task['result'] = result
                
            self.completed[task_id] = task
    
    def get_task_status(self, task_id: str) -> Optional[Dict[str, Any]]:
        """
        Get the status of a task
        
        Args:
            task_id (str): Task identifier
            
        Returns:
            dict: Task status information or None if not found
        """
        # Check in all states
        for task_dict in [self.processing, self.completed]:
            if task_id in task_dict:
                return task_dict[task_id]
                
        # Check in queue
        for task in self.queue:
            if task['id'] == task_id:
                return task
                
        return None
    
    def size(self) -> int:
        """
        Return the number of tasks in the queue
        
        Returns:
            int: Number of queued tasks
        """
        return len(self.queue)
    
    def processing_count(self) -> int:
        """
        Return the number of tasks currently being processed
        
        Returns:
            int: Number of processing tasks
        """
        return len(self.processing)
    
    def completed_count(self) -> int:
        """
        Return the number of completed tasks
        
        Returns:
            int: Number of completed tasks
        """
        return len(self.completed)
    
    def is_empty(self) -> bool:
        """
        Check if the queue is empty
        
        Returns:
            bool: True if queue is empty, False otherwise
        """
        return len(self.queue) == 0