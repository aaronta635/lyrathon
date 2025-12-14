from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
import os
import uuid
import asyncio

from app.models.application import Application, ApplicationStatus
from app.schemas.application import (
    ApplicationCreateResponse,
    ApplicationResponse,
    DecisionCardResponse,
    ApplicationMediaUpdate,
    ResumeData,
)
from app.utils.dependencies import get_db
from app.services.resume_extractor import extract_resume
from app.services.github_analyzer import analyze_github
from app.services.decision_card import build_decision_card
from app.auth import get_current_user, SupabaseUser

router = APIRouter()

# Directory to store uploaded resumes
UPLOAD_DIR = "uploads/resumes"
os.makedirs(UPLOAD_DIR, exist_ok=True)


def process_application_background(db: Session, application_id: str, resume_path: str, github_url: str, focus: str):
    """Background task to extract resume data and analyze GitHub."""
    # Run async code in sync context
    asyncio.run(_process_application_async(db, application_id, resume_path, github_url, focus))


async def _process_application_async(db: Session, application_id: str, resume_path: str, github_url: str, focus: str):
    """Async processing logic."""
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        return
    
    try:
        # 1. Extract data from resume (synchronous, takes ~5s)
        resume_data = extract_resume(resume_path)
        application.resume_data = resume_data
        db.commit()
        
        # 2. Analyze GitHub (async, takes ~10s)
        # Use focus from application form
        job_title = f"{focus.capitalize()} Engineer"  # "Fullstack Engineer", "Frontend Engineer", etc.
        required_skills = "JS"  # Always JS for all roles
        seniority = "mid"  # Default
        
        print(f"🚀 Starting GitHub analysis for: {github_url}")
        print(f"   Focus: {focus}, Job Title: {job_title}, Skills: {required_skills}")
        github_data = await analyze_github(
            github_url=github_url,
            job_title=job_title,
            required_skills=required_skills,
            seniority=seniority,
            focus=focus
        )
        print(f"💾 Saving GitHub data: {github_data}")
        application.github_data = github_data
        db.commit()
        print(f"✅ GitHub data saved to application {application_id}")
        
        # 3. Verify built items against GitHub repos
        if resume_data.get("built") and github_url:
            try:
                from app.services.github_api import get_user_repositories
                from app.services.verification import verify_built_items
                
                print(f"🔍 Verifying built items against GitHub repos...")
                resume_skills = resume_data.get("skills", [])
                
                # Fetch repos with smart filtering
                repos = await get_user_repositories(
                    github_url=github_url,
                    max_repos=30,
                    max_to_verify=20,
                    resume_skills=resume_skills
                )
                
                if repos:
                    # Verify built items
                    built_items = resume_data.get("built", [])
                    print(f"🔍 Verifying {len(built_items)} built items against {len(repos)} repos...")
                    verification_results = await verify_built_items(built_items, repos)
                    
                    # Store verification results
                    resume_data["built_verification"] = verification_results
                    application.resume_data = resume_data
                    db.commit()
                    
                    # Log results
                    matched_count = sum(1 for v in verification_results if v.get("confidence", 0) > 0)
                    print(f"✅ Verification complete: {matched_count}/{len(verification_results)} items matched")
                    for v in verification_results:
                        if v.get("matched_repo"):
                            print(f"   - {v['item']}: {v['confidence']}% → {v['matched_repo']}")
                        else:
                            print(f"   - {v['item']}: No match found")
                else:
                    print(f"⚠️  No public repositories found for verification")
                    
            except Exception as e:
                print(f"⚠️  Verification failed (non-critical): {e}")
                # Don't fail the whole process if verification fails
        
        # 4. Update status
        application.status = ApplicationStatus.AWAITING_MEDIA.value
        db.commit()
        
    except Exception as e:
        # Mark as failed if anything goes wrong
        application = db.query(Application).filter(Application.id == application_id).first()
        if application:
            application.status = ApplicationStatus.FAILED.value
            if not application.resume_data:
                application.resume_data = {"error": str(e)}
            db.commit()


@router.post("/", response_model=ApplicationCreateResponse)
async def create_application(
    background_tasks: BackgroundTasks,
    name: str = Form(...),
    email: str = Form(...),
    github_url: str = Form(...),
    focus: str = Form(...),  # "fullstack", "frontend", or "backend"
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
    
    # Validate file size (10MB limit)
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
    content = await resume.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size is {MAX_FILE_SIZE / 1024 / 1024}MB"
        )
    
    # Generate unique filename and save resume
    file_id = str(uuid.uuid4())
    resume_filename = f"{file_id}.pdf"
    resume_path = os.path.join(UPLOAD_DIR, resume_filename)
    
    with open(resume_path, "wb") as f:
        f.write(content)
    
    # Validate focus
    if focus not in ["fullstack", "frontend", "backend"]:
        raise HTTPException(
            status_code=400, 
            detail="focus must be one of: fullstack, frontend, backend"
        )
    
    # Create application record
    application = Application(
        name=name,
        email=email,
        github_url=github_url,
        focus=focus,
        resume_url=resume_path,
        status=ApplicationStatus.PROCESSING.value,
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    
    # Trigger background processing (resume + GitHub)
    background_tasks.add_task(
        process_application_background,
        db,
        application.id,
        resume_path,
        github_url,
        focus
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


@router.get("/{application_id}/debug")
async def debug_application(
    application_id: str,
    db: Session = Depends(get_db),
):
    """Debug endpoint to see raw stored data."""
    application = db.query(Application).filter(Application.id == application_id).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    return {
        "id": application.id,
        "status": application.status,
        "github_url": application.github_url,
        "resume_data": application.resume_data,
        "github_data": application.github_data,  # Raw stored data
        "github_data_keys": list(application.github_data.keys()) if application.github_data else None,
    }


# ===== Recruiter Endpoints (Auth Required) =====

@router.get("/", response_model=list[DecisionCardResponse])
async def list_applications(
    db: Session = Depends(get_db),
    # current_user: SupabaseUser = Depends(get_current_user),
):
    """List all applications as Decision Cards (recruiters only)."""
    applications = db.query(Application).order_by(Application.created_at.desc()).all()
    
    # Use DecisionCardService to build all cards
    cards = [build_decision_card(app) for app in applications]
    
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

