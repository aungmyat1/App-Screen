from celery import Celery
from kombu import Queue

celery_app = Celery(
    'screenshot_scraper',
    broker='redis://localhost:6379/1',
    backend='redis://localhost:6379/2'
)

celery_app.conf.update(
    task_serializer='json',
    result_serializer='json',
    accept_content=['json'],
    timezone='UTC',
    enable_utc=True,
    task_routes={
        'scrape_playstore': {'queue': 'playstore'},
        'scrape_appstore': {'queue': 'appstore'},
        'download_screenshots': {'queue': 'downloads'}
    },
    task_queues=(
        Queue('playstore', routing_key='playstore'),
        Queue('appstore', routing_key='appstore'),
        Queue('downloads', routing_key='downloads'),
    )
)