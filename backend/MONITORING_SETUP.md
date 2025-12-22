# Monitoring Setup Guide

This guide explains how to set up Prometheus and Grafana for monitoring the screenshot scraper application.

## Prerequisites

1. Docker and Docker Compose installed
2. Basic understanding of monitoring concepts
3. Access to the application server

## Prometheus Setup

### Step 1: Create Prometheus Configuration

Create a `prometheus.yml` file with the following content:

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'screenshot-scraper-api'
    static_configs:
      - targets: ['host.docker.internal:8000']  # Adjust based on your setup
    metrics_path: '/metrics'
    
  - job_name: 'celery-workers'
    static_configs:
      - targets: ['host.docker.internal:5555']  # Flower metrics endpoint
```

### Step 2: Create Docker Compose File

Create a `monitoring/docker-compose.yml` file:

```yaml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=200h'
      - '--web.enable-lifecycle'
    restart: unless-stopped

  grafana:
    image: grafana/grafana-enterprise
    container_name: grafana
    ports:
      - "3000:3000"
    volumes:
      - grafana_data:/var/lib/grafana
    restart: unless-stopped
    depends_on:
      - prometheus

volumes:
  prometheus_data:
  grafana_data:
```

### Step 3: Start Monitoring Services

Run the following command to start Prometheus and Grafana:

```bash
cd monitoring
docker-compose up -d
```

## Grafana Setup

### Step 1: Access Grafana

Navigate to `http://localhost:3000` in your browser.

Default credentials:
- Username: admin
- Password: admin

You'll be prompted to change the password on first login.

### Step 2: Configure Data Source

1. Click "Configuration" (gear icon) in the left sidebar
2. Select "Data Sources"
3. Click "Add data source"
4. Select "Prometheus"
5. Set URL to `http://prometheus:9090`
6. Click "Save & Test"

### Step 3: Import Dashboards

Import the following dashboards for monitoring the screenshot scraper application:

1. Click "Create" (+ icon) in the left sidebar
2. Select "Import"
3. Enter dashboard ID or upload JSON file

Recommended dashboards:
- **FastAPI Dashboard**: For monitoring API performance
- **Celery Dashboard**: For monitoring task queue and workers
- **System Metrics**: For monitoring host-level metrics

### Step 4: Create Custom Dashboard

Create a custom dashboard with the following panels:

1. **Request Rate**: `rate(http_requests_total[5m])`
2. **Error Rate**: `rate(http_requests_total{status_code=~"5.."}[5m])`
3. **Latency**: `histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))`
4. **Active Connections**: `active_connections`
5. **Task Queue Size**: `task_queue_size`
6. **Worker Count**: `worker_count`

## Sentry Setup

### Step 1: Create Sentry Account

1. Go to [sentry.io](https://sentry.io)
2. Create an account or sign in
3. Create a new project for Python/FastAPI

### Step 2: Configure Application

1. Add `SENTRY_DSN` to your environment variables
2. The DSN can be found in your Sentry project settings

### Step 3: Verify Integration

Trigger an error in your application to verify Sentry is receiving events.

## Alerting Rules

The application includes built-in alerting rules defined in the monitoring service:

1. **High Error Rate**: Triggers when error rate exceeds 5% for 5 minutes
2. **High Latency**: Triggers when 95th percentile latency exceeds 2 seconds for 5 minutes
3. **Low Workers**: Triggers when fewer than 2 workers are running

### Configure Prometheus Alerts

Create an `alerts.yml` file:

```yaml
groups:
- name: screenshot-scraper-alerts
  rules:
  - alert: HighErrorRate
    expr: rate(http_requests_total{status_code=~"5.."}[5m]) > 0.05
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "High error rate detected"
      description: "Error rate has exceeded 5% for the last 5 minutes"

  - alert: HighLatency
    expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "High latency detected"
      description: "95th percentile latency has exceeded 2 seconds for the last 5 minutes"

  - alert: LowWorkers
    expr: worker_count < 2
    for: 1m
    labels:
      severity: critical
    annotations:
      summary: "Low worker count"
      description: "Less than 2 workers are currently running"
```

Add this to your `prometheus.yml`:

```yaml
rule_files:
  - "alerts.yml"
```

### Configure Alert Manager (Optional)

For advanced notification routing, set up Alertmanager:

1. Create an `alertmanager.yml` configuration file
2. Add Alertmanager service to your Docker Compose file
3. Configure notification channels (email, Slack, etc.)

## Best Practices

1. **Retention Policy**: Set appropriate retention periods for metrics
2. **Resource Limits**: Configure memory and CPU limits for monitoring containers
3. **Backup**: Regularly backup Grafana dashboards and Prometheus data
4. **Security**: Secure access to monitoring interfaces with authentication
5. **Alert Tuning**: Regularly review and tune alerts to minimize noise
6. **Documentation**: Document all custom dashboards and alerts

## Troubleshooting

### Metrics Not Appearing

1. Check that the metrics endpoint is accessible
2. Verify Prometheus target configuration
3. Check for network connectivity issues

### High Memory Usage

1. Adjust Prometheus retention period
2. Optimize metric cardinality
3. Scale up monitoring infrastructure if needed

### Alerts Not Firing

1. Verify alert rule syntax
2. Check that the underlying metrics exist
3. Confirm alert evaluation interval