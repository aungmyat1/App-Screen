import os
import sys
from alembic.config import Config
from alembic import command
from .connection import DATABASE_URL

def run_migrations():
    """
    Run database migrations
    """
    # Change to the database directory
    db_dir = os.path.dirname(os.path.abspath(__file__))
    alembic_cfg = Config(os.path.join(db_dir, "alembic.ini"))
    
    try:
        command.upgrade(alembic_cfg, "head")
        print("Database migrations applied successfully!")
    except Exception as e:
        print(f"Error applying migrations: {e}")
        raise

def create_migration(message: str):
    """
    Create a new migration
    """
    db_dir = os.path.dirname(os.path.abspath(__file__))
    alembic_cfg = Config(os.path.join(db_dir, "alembic.ini"))
    
    try:
        command.revision(alembic_cfg, autogenerate=True, message=message)
        print(f"Migration '{message}' created successfully!")
    except Exception as e:
        print(f"Error creating migration: {e}")
        raise