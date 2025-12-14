from app.models.application import Application
from app.schemas.application import DecisionCardResponse, BuiltVerification


def build_decision_card(application: Application) -> DecisionCardResponse:
    """
    Build a Decision Card from an Application.
    
    This is the single source of truth for Decision Card construction.
    If the schema changes, only update this function.
    
    Args:
        application: The Application model instance
        
    Returns:
        DecisionCardResponse with all card data
    """
    resume_data = application.resume_data or {}
    github_data = application.github_data or {}
    
    # Build the Decision Card
    return DecisionCardResponse(
        id=application.id,
        name=application.name,
        built=resume_data.get("built", []),  # AI extracted from resume
        # GitHub analyzer fields
        inferred_seniority=github_data.get("inferred_seniority") if github_data else None,
        core_strengths=github_data.get("core_strengths", []) if github_data else [],
        collaboration_style=github_data.get("collaboration_style") if github_data else None,
        recommendations=github_data.get("recommendations", []) if github_data else [],
        justification=github_data.get("justification") if github_data else None,
        built_verification=resume_data.get("built_verification") if resume_data else None,
        # Percentages
        suitability_percentage=resume_data.get("suitability_percentage") if resume_data else None,
        confidence_percentage=github_data.get("confidence_percentage") if github_data else None,
        status=application.status,
        created_at=application.created_at,
    )


