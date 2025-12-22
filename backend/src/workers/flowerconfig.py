"""
Flower configuration for monitoring Celery workers
"""

# Broker settings
broker_url = 'redis://localhost:6379/1'

# Result backend settings
result_backend = 'redis://localhost:6379/2'

# Basic auth credentials (username:password)
basic_auth = ['admin:password']  # Change in production

# Enable debug logging
logging = 'INFO'

# Address to bind to
address = '0.0.0.0'

# Port to listen on
port = 5555

# Enable persistent data storage
persistent = True
db = 'flower.db'

# Enable events
events = True

# Enable auto refresh
auto_refresh = True

# URL prefix
url_prefix = ''

# Maximum number of workers to show
worker_max_tasks_per_child = 1000

# Timezone
timezone = 'UTC'