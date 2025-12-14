from fastapi import APIRouter, HTTPException
from datetime import datetime
from app.schemas.decision_card import DecisionCard, GitHubSignals

router = APIRouter()

MOCK_CARDS = [
    DecisionCard(
        id="card_001",
        name="Jane Doe",
        email="jane@example.com",
        role_label="Backend Engineer",
        built=[
            "Multi-tenant auth system serving 50K users",
            "Real-time payments integration with Stripe",
            "Automated CI/CD pipeline reducing deploy time by 70%"
        ],
        github_signals=GitHubSignals(
            ownership=["Main contributor to auth module (73% of commits)"],
            patterns=["Consistent daily commits", "Clean commit messages"],
            quality=["Refactors legacy code", "Adds tests with features"]
        ),
        risk_flags=["No distributed systems experience"],
        match_score=0.85,
        status="ready",
        created_at=datetime.now()
    ),
    DecisionCard(
        id="card_002",
        name="John Smith",
        email="john@example.com",
        role_label="Frontend Engineer",
        built=[
            "Design system used across 12 products",
            "Real-time collaboration editor",
            "Reduced bundle size by 40%"
        ],
        github_signals=GitHubSignals(
            ownership=["Owns entire component library"],
            patterns=["Weekly contributions", "Detailed PR descriptions"],
            quality=["Accessibility focused", "Performance optimizations"]
        ),
        risk_flags=["Limited backend experience", "Short tenure at last role"],
        match_score=0.72,
        status="ready",
        created_at=datetime.now()
    )
]


@router.get("/", response_model=list[DecisionCard])
def get_decision_cards():
    return MOCK_CARDS


@router.get("/{card_id}", response_model=DecisionCard)
def get_decision_card(card_id: str):
    for card in MOCK_CARDS:
        if card.id == card_id:
            return card
    raise HTTPException(status_code=404, detail="Card not found")