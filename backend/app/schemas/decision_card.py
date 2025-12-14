from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class GitHubSignals(BaseModel):
    ownership: list[str]
    patterns: list[str]
    quality: list[str]

class DecisionCard(BaseModel):
    id: str
    name: str
    email: str
    role_label: str
    built: list[str]
    github_signals: GitHubSignals
    risk_flags: list[str]
    match_score: float
    status: str
    created_at: datetime