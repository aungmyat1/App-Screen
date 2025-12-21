class TaskQueue:
    """Task queue for managing scraping jobs"""
    
    def __init__(self):
        self.queue = []
    
    def enqueue(self, task: dict):
        """Add a task to the queue"""
        self.queue.append(task)
    
    def dequeue(self):
        """Remove and return the next task from the queue"""
        if self.queue:
            return self.queue.pop(0)
        return None
    
    def size(self):
        """Return the number of tasks in the queue"""
        return len(self.queue)
    
    def is_empty(self):
        """Check if the queue is empty"""
        return len(self.queue) == 0