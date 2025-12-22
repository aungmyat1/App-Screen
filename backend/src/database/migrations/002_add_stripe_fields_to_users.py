"""
Migration to add Stripe fields to users table
"""

from sqlalchemy import MetaData, Table, Column, String, text
from sqlalchemy.dialects.postgresql import TIMESTAMP
from sqlalchemy.sql import func

revision = '002_add_stripe_fields_to_users'
down_revision = '001_initial_schema'
branch_labels = None
depends_on = None


def upgrade(migrate_engine):
    meta = MetaData(bind=migrate_engine)
    users_table = Table('users', meta, autoload=True)
    
    # Add stripe_customer_id column
    stripe_customer_id_column = Column('stripe_customer_id', String(255), nullable=True)
    stripe_customer_id_column.create(users_table, populate_default=True)
    
    # Add stripe_subscription_id column
    stripe_subscription_id_column = Column('stripe_subscription_id', String(255), nullable=True)
    stripe_subscription_id_column.create(users_table, populate_default=True)


def downgrade(migrate_engine):
    meta = MetaData(bind=migrate_engine)
    users_table = Table('users', meta, autoload=True)
    
    # Drop stripe_subscription_id column
    stripe_subscription_id = users_table.c.stripe_subscription_id
    stripe_subscription_id.drop()
    
    # Drop stripe_customer_id column
    stripe_customer_id = users_table.c.stripe_customer_id
    stripe_customer_id.drop()