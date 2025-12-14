#!/usr/bin/env python3
"""
Script to clear all data from the test database.
This deletes all rows from all tables while keeping the schema intact.
"""
import sys
from pathlib import Path

# Add the backend directory to the path so we can import app modules
sys.path.insert(0, str(Path(__file__).parent))

from app.database import db_engine, SessionLocal
from app.models import Base
from app.models.application import Application

def clear_database():
    """Delete all data from all tables in the database."""
    # Create a session
    db = SessionLocal()
    
    try:
        # Delete all rows from the applications table
        deleted_count = db.query(Application).delete()
        db.commit()
        print(f"✓ Deleted {deleted_count} rows from 'applications' table")
        
        # Verify the table is empty
        remaining = db.query(Application).count()
        if remaining == 0:
            print("✓ Database cleared successfully!")
        else:
            print(f"⚠ Warning: {remaining} rows still remain")
            
    except Exception as e:
        db.rollback()
        print(f"✗ Error clearing database: {e}")
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    print("Clearing database...")
    clear_database()

