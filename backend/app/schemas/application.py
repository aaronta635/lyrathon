from pydantic import BaseModel, EmailStr, HttpUrl
from typing import Optional
from datetime import datetime
from enum import Enum


class ApplicationStatus(str, Enum):
    PROCESSING = "processing"
    AWAITING_MEDIA = "awaiting_media"
    READY = "ready"
    FAILED = "failed"


# Phase 1: Initial submission
class ApplicationCreate(BaseModel):
    name: str
    email: EmailStr
    github_url: str


class ApplicationCreateResponse(BaseModel):
    id: str
    status: ApplicationStatus
    message: str

    class Config:
        from_attributes = True


# Phase 2: Add media
# Simple yes/no questions for deploy link
class ApplicationMediaUpdate(BaseModel):
    video_url: str
    deploy_url: Optional[str] = None
    # Simple questions:
    # Q1: "Can recruiters view your project without logging in?"
    can_view_without_login: Optional[bool] = None
    # Q2: "Can your website be displayed inside other websites?"
    can_embed: Optional[bool] = None


# Resume extraction result (stored in resume_data)
class ResumeData(BaseModel):
    role_label: Optional[str] = None
    built: list[str] = []
    skills: list[str] = []
    years_experience: Optional[int] = None
    risk_flags: list[str] = []


# GitHub analysis result (stored in github_data)
class GitHubData(BaseModel):
    ownership: list[str] = []
    patterns: list[str] = []
    quality: list[str] = []
    risk_flags: list[str] = []


# Full application response (for recruiters)
class ApplicationResponse(BaseModel):
    id: str
    name: str
    email: str
    github_url: Optional[str] = None
    video_url: Optional[str] = None
    deploy_url: Optional[str] = None
    can_view_without_login: Optional[bool] = None
    can_embed: Optional[bool] = None
    resume_data: Optional[ResumeData] = None
    github_data: Optional[GitHubData] = None
    status: ApplicationStatus
    created_at: datetime

    class Config:
        from_attributes = True


# Decision Card view (simplified for list)
class DecisionCardResponse(BaseModel):
    id: str
    name: str
    role_label: Optional[str] = None
    built: list[str] = []
    github_signals: Optional[GitHubData] = None
    risk_flags: list[str] = []
    status: ApplicationStatus
    created_at: datetime

    class Config:
        from_attributes = True

