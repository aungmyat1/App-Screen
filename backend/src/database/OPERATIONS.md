# Database Operations Guide

## Connection Pooling

This application uses SQLAlchemy's QueuePool for database connection management with the following configuration:

- Pool Size: 10 connections
- Max Overflow: 20 additional connections
- Connection Recycle: 1 hour
- Pool Pre-Ping: Enabled (verifies connections before use)
- Pool Timeout: 30 seconds

## Backup Strategy

### Manual Backups

To create a manual backup of the database:

```bash
/workspaces/App-Screen-/backend/scripts/backup_db.sh
```

This will:
1. Create a SQL dump of the database
2. Compress it with gzip
3. Store it in `/workspaces/App-Screen-/backups/`
4. Remove backups older than 7 days

### Automated Backups

To set up automated daily backups at 2 AM:

```bash
/workspaces/App-Screen-/backend/scripts/setup_cron_backup.sh
```

This adds a cron job that runs the backup script daily.

### Restoring from Backup

To restore from a backup:

```bash
gunzip -c /path/to/backup.sql.gz | psql -U appscreens_user -h localhost appscreens
```

## Migration Management

### Applying Migrations

```bash
cd /workspaces/App-Screen-/backend/src/database
alembic upgrade head
```

### Creating New Migrations

```bash
cd /workspaces/App-Screen-/backend/src/database
alembic revision --autogenerate -m "Description of changes"
```

## Database Setup (When PostgreSQL is accessible)

1. Create the database:
   ```sql
   CREATE DATABASE appscreens;
   ```

2. Create the database user:
   ```sql
   CREATE USER appscreens_user WITH PASSWORD 'appscreens_pass';
   ```

3. Grant privileges:
   ```sql
   GRANT ALL PRIVILEGES ON DATABASE appscreens TO appscreens_user;
   ```

4. Run migrations:
   ```bash
   cd /workspaces/App-Screen-/backend/src/database
   alembic upgrade head
   ```

## Troubleshooting

### Common Issues

1. **Connection refused**: Ensure PostgreSQL is running
2. **Authentication failed**: Check username/password
3. **Role does not exist**: Create the appropriate database user
4. **Permission denied**: Grant necessary privileges

### Checking PostgreSQL Status

```bash
service postgresql status
```

### Starting PostgreSQL

```bash
sudo service postgresql start
```