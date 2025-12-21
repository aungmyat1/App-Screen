#!/bin/bash

# Setup script for automated database backups using cron

# Get the absolute path to the backup script
SCRIPT_PATH="/workspaces/App-Screen-/backend/scripts/backup_db.sh"

# Add a cron job to run daily at 2 AM
(crontab -l 2>/dev/null; echo "0 2 * * * $SCRIPT_PATH") | crontab -

echo "Cron job added for daily database backups at 2 AM"
echo "To view your crontab: crontab -l"
echo "To remove the cron job: crontab -r"