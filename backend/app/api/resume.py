from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.resume_extractor import extract_resume
import tempfile
import os

router = APIRouter()


@router.post("/extract")
async def extract_from_resume(file: UploadFile = File(...)):
    """
    Upload a PDF resume and extract structured "built" data.
    
    Returns:
    {
        "role_label": "Backend Engineer",
        "built": ["accomplishment 1", ...],
        "skills": ["Python", ...],
        "years_experience": 4,
        "risk_flags": ["concern 1", ...]
    }
    """
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    # Save uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name
    
    try:
        result = extract_resume(tmp_path)
        return result
    finally:
        os.unlink(tmp_path)

