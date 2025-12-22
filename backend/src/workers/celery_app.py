from celery import Celery
from kombu import Queue

celery_app = Celery(
    'screenshot_scraper',
    broker='redis://localhost:6379/1',
    backend='redis://localhost:6379/2'
)

# Configure task routes with priorities
task_routes = {
    'scrape_playstore': {
        'queue': 'playstore',
        'routing_key': 'playstore.high_priority',
    },
    'scrape_appstore': {
        'queue': 'appstore',
        'routing_key': 'appstore.high_priority',
    },
    'download_screenshots': {
        'queue': 'downloads',
        'routing_key': 'downloads.high_priority',
    },
    'cleanup_old_screenshots': {
        'queue': 'maintenance',
        'routing_key': 'maintenance.low_priority',
    },
}

# Define task queues with priorities
task_queues = (
    Queue('playstore', routing_key='playstore.#', queue_arguments={'x-max-priority': 10}),
    Queue('appstore', routing_key='appstore.#', queue_arguments={'x-max-priority': 10}),
    Queue('downloads', routing_key='downloads.#', queue_arguments={'x-max-priority': 10}),
    Queue('maintenance', routing_key='maintenance.#', queue_arguments={'x-max-priority': 3}),
)

celery_app.conf.update(
    task_serializer='json',
    result_serializer='json',
    accept_content=['json'],
    timezone='UTC',
    enable_utc=True,
    task_routes=task_routes,
    task_queues=task_queues,
    # Configure task retries with exponential backoff
    task_acks_late=True,
    worker_prefetch_multiplier=1,
    task_reject_on_worker_lost=True,
    # Worker configuration for multiple instances
    worker_max_tasks_per_child=1000,
    worker_max_memory_per_child=100000,  # 100MB
)

# Celery Beat schedule for periodic tasks
celery_app.conf.beat_schedule = {
    'cleanup-old-screenshots': {
        'task': 'cleanup_old_screenshots',
        'schedule': 86400.0,  # Every 24 hours (in seconds)
        'options': {
            'queue': 'maintenance',
            'routing_key': 'maintenance.low_priority',
        }
    },
}