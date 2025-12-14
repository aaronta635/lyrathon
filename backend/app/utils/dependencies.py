from fastapi import Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.auth import get_current_user, get_current_admin_user, SupabaseUser


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Re-export auth dependencies for convenience
__all__ = ["get_db", "get_current_user", "get_current_admin_user", "SupabaseUser"]
