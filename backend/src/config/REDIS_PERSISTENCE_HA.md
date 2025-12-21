# Redis Persistence and High Availability Setup

This document describes how to configure Redis with persistence and high availability for the AppScreens application.

## Redis Persistence

Redis provides two main persistence options:

1. **RDB (Redis Database)**: Point-in-time snapshots of your dataset at specified intervals
2. **AOF (Append Only File)**: Logs every write operation received by the server

### RDB Persistence

RDB creates compact point-in-time snapshots of your data at specified intervals. Our configuration includes:

```
save 3600 1     # Save if at least 1 key changed in 3600 seconds (1 hour)
save 300 100    # Save if at least 100 keys changed in 300 seconds (5 minutes)
save 60 10000   # Save if at least 10000 keys changed in 60 seconds (1 minute)
```

Benefits:
- Compact snapshots for backups and disaster recovery
- Faster restarts with big datasets
- Good for disaster recovery

Drawbacks:
- May lose recent data if Redis stops unexpectedly
- Needs to fork() often, which can impact performance

### AOF Persistence

AOF logs every write operation received by the server. Our configuration includes:

```
appendonly yes              # Enable AOF
appendfilename "appendonly.aof"  # AOF file name
appendfsync everysec        # fsync every second
```

Benefits:
- Better durability (can configure to never lose data)
- Automatically rewinds invalid commands
- Append-only file with all operations in a readable format

Drawbacks:
- AOF files are usually bigger than equivalent RDB files
- Can be slower than RDB depending on fsync policy

### Mixed Approach (Our Configuration)

We use both RDB and AOF for optimal benefits:

1. RDB for compact snapshots and faster restarts
2. AOF for better durability and point-in-time recovery

With `aof-use-rdb-preamble yes`, Redis uses the RDB preamble to rebuild the state of the dataset on startup, making restarts faster.

## High Availability with Redis Sentinel

Redis Sentinel provides high availability for Redis. It performs:

1. Monitoring: Checks if master and replica instances are working
2. Notification: Notifies administrators when instances fail
3. Automatic failover: Reconfigure replicas when master fails
4. Configuration provider: Provides clients with authoritative info about instances

### Sentinel Configuration

Our Sentinel configuration monitors the master:

```
sentinel monitor mymaster 127.0.0.1 6379 2
sentinel down-after-milliseconds mymaster 5000
sentinel parallel-syncs mymaster 1
sentinel failover-timeout mymaster 10000
```

This means:
- Monitor a master named "mymaster" at 127.0.0.1:6379
- Require agreement from 2 Sentinels to consider master down
- Consider master down after 5000ms without response
- During failover, update 1 replica at a time
- Wait up to 10000ms for failover completion

## Cache Warming Strategies

Cache warming is the process of pre-populating the cache with frequently accessed data to improve performance.

### Implementation

Our cache warming service (`cache_warming_service.py`) pre-populates:

1. **Screenshots cache**: Frequently requested app screenshots
2. **Metadata cache**: App metadata for popular applications

The service:
- Identifies popular apps from both Play Store and App Store
- Pre-fetches and caches their screenshots and metadata
- Respects TTL settings from the main Redis configuration

### Benefits

1. Reduced latency for popular content
2. Decreased load on external APIs
3. Better user experience with faster initial loads

## Setup Instructions

### 1. Persistent Redis Setup

Run the persistent Redis setup script:

```bash
./scripts/setup_persistent_redis.sh
```

This script:
1. Ensures Redis is installed
2. Copies our custom configuration with AOF+RDB persistence
3. Restarts Redis with the new configuration
4. Verifies the persistence settings

### 2. Redis Sentinel Setup

Run the Sentinel setup script:

```bash
./scripts/setup_sentinel.sh
```

This script:
1. Ensures Redis/Sentinel is installed
2. Copies our Sentinel configuration
3. Creates and starts the Sentinel systemd service
4. Verifies Sentinel is monitoring the master

### 3. Cache Warming

Run the cache warming script:

```bash
./scripts/warm_cache.sh
```

This script:
1. Activates the virtual environment (if available)
2. Runs the cache warming service
3. Pre-populates cache with popular app data

## Verification Commands

### Check Redis Persistence

```bash
# Check current save configuration
redis-cli CONFIG GET save

# Check AOF status
redis-cli CONFIG GET appendonly

# Check AOF fsync setting
redis-cli CONFIG GET appendfsync

# Check last save time
redis-cli LASTSAVE
```

### Check Redis Sentinel

```bash
# Connect to Sentinel
redis-cli -p 26379

# Check monitored masters
127.0.0.1:26379> SENTINEL masters

# Check monitored replicas
127.0.0.1:26379> SENTINEL replicas mymaster

# Check Sentinel status
127.0.0.1:26379> SENTINEL ckquorum mymaster
```

### Check Cache Warming

```bash
# Check keys in Redis
redis-cli KEYS "*"

# Check specific cache key
redis-cli GET screenshots:playstore:com.whatsapp

# Check cache size
redis-cli DBSIZE
```

## Monitoring and Maintenance

### Regular Tasks

1. **Monitor AOF file size**: Large AOF files can impact performance
   ```bash
   du -h /var/lib/redis/appendonly.aof
   ```

2. **Check RDB snapshots**: Ensure snapshots are being created
   ```bash
   ls -la /var/lib/redis/dump.rdb
   ```

3. **Monitor Sentinel health**:
   ```bash
   redis-cli -p 26379 SENTINEL masters
   ```

### Backup Strategy

1. **RDB backups**: Copy dump.rdb files regularly
2. **AOF backups**: Copy appendonly.aof files regularly
3. **Configuration backups**: Keep copies of redis.conf and sentinel.conf

### Recovery Procedures

1. **From RDB**: Stop Redis, replace dump.rdb, start Redis
2. **From AOF**: Stop Redis, replace appendonly.aof, start Redis
3. **Failover recovery**: If Sentinel performed failover, check new master status

## Performance Tuning

### Memory Management

Our configuration includes:

```
maxmemory 256mb
maxmemory-policy allkeys-lru
```

This limits Redis to 256MB and evicts least recently used keys when limit is reached.

### Network and Connections

```
maxclients 10000
tcp-keepalive 300
```

Supports up to 10,000 concurrent clients with TCP keepalive enabled.

## Security Considerations

### Authentication

Production deployments should enable password authentication:

```
# In redis.conf
requirepass "your-strong-password"

# In sentinel.conf
sentinel auth-pass mymaster "your-strong-password"
```

### Network Security

- Bind to specific interfaces (avoid 0.0.0.0)
- Use firewalls to restrict access
- Consider SSL/TLS for sensitive environments

## Troubleshooting

### Common Issues

1. **Persistence failures**: Check disk space and permissions
2. **Sentinel not detecting master**: Verify network connectivity
3. **High memory usage**: Adjust maxmemory or eviction policy
4. **Slow performance**: Check AOF file size and fsync settings

### Diagnostic Commands

```bash
# Check server info
redis-cli INFO

# Check memory usage
redis-cli INFO memory

# Check persistence status
redis-cli INFO persistence

# Check replication status
redis-cli INFO replication

# Check Sentinel status
redis-cli -p 26379 INFO sentinel
```