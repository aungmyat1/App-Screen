# PostgreSQL Setup Guide

This document explains how to set up PostgreSQL for the AppScreens application.

## Prerequisites

- Ubuntu/Debian-based system (other systems may require different commands)
- Root or sudo access

## Installation

PostgreSQL 16 has already been installed as part of the project setup. You can verify the installation with:

```bash
psql --version
```

## Service Management

### Start PostgreSQL Service

```bash
sudo service postgresql start
```

### Stop PostgreSQL Service

```bash
sudo service postgresql stop
```

### Restart PostgreSQL Service

```bash
sudo service postgresql restart
```

### Check PostgreSQL Service Status

```bash
sudo service postgresql status
```

## Database and User Setup

The application requires a specific database and user to function correctly. 

### Automatic Setup

Run the initialization script:

```bash
./scripts/init_db.sh
```

This script will:
1. Start the PostgreSQL service
2. Create the `appscreens_user` user with password `appscreens_pass`
3. Create the `appscreens` database owned by `appscreens_user`
4. Grant all privileges on the database to the user
5. Update the `.env` file with the correct database connection string

### Manual Setup

If you prefer to set up the database manually:

1. Start PostgreSQL service:
   ```bash
   sudo service postgresql start
   ```

2. Create the user:
   ```bash
   sudo -u postgres psql -c "CREATE USER appscreens_user WITH PASSWORD 'appscreens_pass';"
   ```

3. Create the database:
   ```bash
   sudo -u postgres psql -c "CREATE DATABASE appscreens OWNER appscreens_user;"
   ```

4. Grant privileges:
   ```bash
   sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE appscreens TO appscreens_user;"
   ```

## Connection Pooling

Connection pooling is configured in [pool.py](file:///workspaces/App-Screen-/backend/src/database/pool.py) with the following settings:

- Pool class: QueuePool
- Pool size: 10 connections maintained in the pool
- Max overflow: 20 additional connections beyond pool_size
- Pool recycle: Connections recycled after 1 hour (3600 seconds)
- Pool pre-ping: Enabled to verify connections before use
- Pool timeout: 30 seconds timeout when getting connection from pool

These settings can be adjusted in [pool.py](file:///workspaces/App-Screen-/backend/src/database/pool.py) based on your application's needs.

## Alembic Migrations

Alembic is used for database migrations. The configuration is in [alembic.ini](file:///workspaces/App-Screen-/backend/src/database/alembic.ini).

To run migrations:

```bash
cd src/database
alembic upgrade head
```

Or use the comprehensive setup script:

```bash
./setup_database.sh
```

## Backup Strategy

A backup strategy is implemented with two scripts:

1. [backup_db.sh](file:///workspaces/App-Screen-/backend/scripts/backup_db.sh) - Creates database backups
2. [setup_cron_backup.sh](file:///workspaces/App-Screen-/backend/scripts/setup_cron_backup.sh) - Sets up automatic backups via cron

### Manual Backup

```bash
./scripts/backup_db.sh
```

This creates a timestamped backup in the `/workspaces/App-Screen-/backups` directory and automatically compresses it with gzip.

### Automatic Backups

To set up daily automatic backups at 2 AM:

```bash
./scripts/setup_cron_backup.sh
```

To view your crontab:

```bash
crontab -l
```

To remove the cron job:

```bash
crontab -r
```

## Configuration Files

- [alembic.ini](file:///workspaces/App-Screen-/backend/src/database/alembic.ini) - Alembic configuration
- [pool.py](file:///workspaces/App-Screen-/backend/src/database/pool.py) - Connection pooling configuration
- [.env](file:///workspaces/App-Screen-/backend/.env.example) - Environment variables (including database URL)

## Troubleshooting

### Permission Denied Errors

If you encounter permission denied errors when running PostgreSQL commands, ensure you're running them with `sudo -u postgres`.

### Connection Issues

If the application cannot connect to the database:

1. Ensure PostgreSQL service is running:
   ```bash
   sudo service postgresql status
   ```

2. Check that the database and user exist:
   ```bash
   sudo -u postgres psql -l  # List databases
   sudo -u postgres psql -c "\du"  # List users
   ```

3. Verify the connection string in your [.env](file:///workspaces/App-Screen-/backend/.env.example) file.

### Authentication Failures

If authentication fails:

1. Check that the password is correct in the database setup.
2. Ensure `pg_hba.conf` is configured correctly (usually located at `/etc/postgresql/16/main/pg_hba.conf`).
3. You might need to adjust authentication methods in the configuration file.