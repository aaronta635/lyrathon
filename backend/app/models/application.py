from sqlalchemy import Column, String, Text, DateTime, JSON, Enum
from sqlalchemy.sql import func
from app.models import Base
import uuid
import enum


class ApplicationStatus(str, enum.Enum):
    PROCESSING = "processing"
    AWAITING_MEDIA = "awaiting_media"
    READY = "ready"
    FAILED = "failed"


class Application(Base):
    __tablename__ = "applications"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Applicant info
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    
    # Phase 1: Resume + GitHub
    resume_url = Column(String, nullable=True)  # Path to stored PDF
    github_url = Column(String, nullable=True)
    focus = Column(String, nullable=True)  # "fullstack", "frontend", or "backend"
    
    # Phase 2: Video + Deploy
    video_url = Column(String, nullable=True)
    deploy_url = Column(String, nullable=True)
    # Simple yes/no questions
    can_view_without_login = Column(String, nullable=True)  # "true" or "false"
    can_embed = Column(String, nullable=True)  # "true" or "false"
    
    # Extracted data
    resume_data = Column(JSON, nullable=True)  # From OpenAI extraction
    github_data = Column(JSON, nullable=True)  # From GitHub analyzer (later)
    
    # Status
    status = Column(String, default=ApplicationStatus.PROCESSING.value)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

