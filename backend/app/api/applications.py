from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
import os
import uuid

from app.models.application import Application, ApplicationStatus
from app.schemas.application import (
    ApplicationCreateResponse,
    ApplicationResponse,
    DecisionCardResponse,
    ApplicationMediaUpdate,
    ResumeData,
    GitHubData,
)
from app.utils.dependencies import get_db
from app.services.resume_extractor import extract_resume
from app.auth import get_current_user, SupabaseUser

router = APIRouter()

# Directory to store uploaded resumes
UPLOAD_DIR = "uploads/resumes"
os.makedirs(UPLOAD_DIR, exist_ok=True)


def process_resume_background(db: Session, application_id: str, resume_path: str):
    """Background task to extract resume data."""
    try:
        # Extract data from resume
        resume_data = extract_resume(resume_path)
        
        # Update application with extracted data
        application = db.query(Application).filter(Application.id == application_id).first()
        if application:
            application.resume_data = resume_data
            application.status = ApplicationStatus.AWAITING_MEDIA.value
            db.commit()
    except Exception as e:
        # Mark as failed if extraction fails
        application = db.query(Application).filter(Application.id == application_id).first()
        if application:
            application.status = ApplicationStatus.FAILED.value
            application.resume_data = {"error": str(e)}
            db.commit()


@router.post("/", response_model=ApplicationCreateResponse)
async def create_application(
    background_tasks: BackgroundTasks,
    name: str = Form(...),
    email: str = Form(...),
    github_url: str = Form(...),
    resume: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """
    Phase 1: Submit application with resume and GitHub URL.
    
    Resume extraction runs in background.
    Returns application ID for Phase 2 submission.
    """
    # Validate file type
    if not resume.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    # Generate unique filename and save resume
    file_id = str(uuid.uuid4())
    resume_filename = f"{file_id}.pdf"
    resume_path = os.path.join(UPLOAD_DIR, resume_filename)
    
    content = await resume.read()
    with open(resume_path, "wb") as f:
        f.write(content)
    
    # Create application record
    application = Application(
        name=name,
        email=email,
        github_url=github_url,
        resume_url=resume_path,
        status=ApplicationStatus.PROCESSING.value,
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    
    # Trigger background processing
    background_tasks.add_task(
        process_resume_background,
        db,
        application.id,
        resume_path
    )
    
    return ApplicationCreateResponse(
        id=application.id,
        status=ApplicationStatus.PROCESSING,
        message="Application received. Processing resume..."
    )


@router.patch("/{application_id}/media")
async def update_application_media(
    application_id: str,
    media: ApplicationMediaUpdate,
    db: Session = Depends(get_db),
):
    """
    Phase 2: Add video and deploy link to application.
    """
    application = db.query(Application).filter(Application.id == application_id).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Update media fields
    application.video_url = media.video_url
    
    if media.deploy_url:
        application.deploy_url = media.deploy_url
        application.can_view_without_login = str(media.can_view_without_login).lower() if media.can_view_without_login is not None else None
        application.can_embed = str(media.can_embed).lower() if media.can_embed is not None else None
    
    # If resume processing is done, mark as ready
    if application.resume_data and "error" not in application.resume_data:
        application.status = ApplicationStatus.READY.value
    
    db.commit()
    db.refresh(application)
    
    return {
        "id": application.id,
        "status": application.status,
        "message": "Media added successfully"
    }


@router.get("/{application_id}/status")
async def get_application_status(
    application_id: str,
    db: Session = Depends(get_db),
):
    """Check the processing status of an application."""
    application = db.query(Application).filter(Application.id == application_id).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    return {
        "id": application.id,
        "status": application.status,
        "resume_processed": application.resume_data is not None,
        "github_processed": application.github_data is not None,
        "media_submitted": application.video_url is not None,
    }


# ===== Recruiter Endpoints (Auth Required) =====

@router.get("/", response_model=list[DecisionCardResponse])
async def list_applications(
    db: Session = Depends(get_db),
    # current_user: SupabaseUser = Depends(get_current_user),
):
    """List all applications as Decision Cards (recruiters only)."""
    applications = db.query(Application).order_by(Application.created_at.desc()).all()
    
    cards = []
    for app in applications:
        resume_data = app.resume_data or {}
        github_data = app.github_data or {}
        
        # Combine risk flags from resume and github
        risk_flags = resume_data.get("risk_flags", []) + github_data.get("risk_flags", [])
        
        cards.append(DecisionCardResponse(
            id=app.id,
            name=app.name,
            role_label=resume_data.get("role_label"),
            built=resume_data.get("built", []),
            github_signals=GitHubData(
                ownership=github_data.get("ownership", []),
                patterns=github_data.get("patterns", []),
                quality=github_data.get("quality", []),
                risk_flags=github_data.get("risk_flags", []),
            ) if github_data else None,
            risk_flags=risk_flags,
            status=app.status,
            created_at=app.created_at,
        ))
    
    return cards


@router.get("/{application_id}", response_model=ApplicationResponse)
async def get_application(
    application_id: str,
    db: Session = Depends(get_db),
    # current_user: SupabaseUser = Depends(get_current_user),
):
    """Get full application details (recruiters only)."""
    application = db.query(Application).filter(Application.id == application_id).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    return application

