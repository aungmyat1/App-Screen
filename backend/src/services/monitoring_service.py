import time
import os
from typing import Dict, Any
from prometheus_client import Counter, Histogram, Gauge, generate_latest, CONTENT_TYPE_LATEST
from fastapi import Request, Response


# Metrics
REQUEST_COUNT = Counter(
    'http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status_code']
)

REQUEST_DURATION = Histogram(
    'http_request_duration_seconds',
    'HTTP request duration in seconds',
    ['method', 'endpoint']
)

ACTIVE_CONNECTIONS = Gauge(
    'active_connections',
    'Number of active connections'
)

TASK_QUEUE_SIZE = Gauge(
    'task_queue_size',
    'Number of tasks in queue',
    ['queue_name']
)

WORKER_COUNT = Gauge(
    'worker_count',
    'Number of active workers',
    ['worker_type']
)


class MonitoringMiddleware:
    """
    Middleware for collecting Prometheus metrics
    """
    
    def __init__(self, app):
        self.app = app
    
    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return
        
        # Record start time
        start_time = time.time()
        
        # Increment active connections
        ACTIVE_CONNECTIONS.inc()
        
        try:
            await self.app(scope, receive, send)
        finally:
            # Decrement active connections
            ACTIVE_CONNECTIONS.dec()
            
            # Record request metrics
            request_time = time.time() - start_time
            # Note: We would need to extract method, endpoint, and status_code from the response
            # This is simplified for demonstration purposes


def generate_metrics():
    """
    Generate Prometheus metrics
    
    Returns:
        Tuple of (metrics_content, content_type)
    """
    return generate_latest(), CONTENT_TYPE_LATEST


def update_task_queue_size(queue_name: str, size: int):
    """
    Update the task queue size metric
    
    Args:
        queue_name: Name of the queue
        size: Current size of the queue
    """
    TASK_QUEUE_SIZE.labels(queue_name=queue_name).set(size)


def update_worker_count(worker_type: str, count: int):
    """
    Update the worker count metric
    
    Args:
        worker_type: Type of worker
        count: Number of workers
    """
    WORKER_COUNT.labels(worker_type=worker_type).set(count)


# Alert rules constants
ALERT_RULES = {
    "high_error_rate": {
        "expr": "rate(http_requests_total{status_code=~'5..'}[5m]) > 0.05",
        "description": "High error rate (>5%) for 5 minutes"
    },
    "high_latency": {
        "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2",
        "description": "95th percentile latency > 2 seconds for 5 minutes"
    },
    "low_workers": {
        "expr": "worker_count < 2",
        "description": "Less than 2 workers running"
    }
}