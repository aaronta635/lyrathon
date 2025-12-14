import pdfplumber
from openai import OpenAI
from app.config import settings
import json


def extract_text_from_pdf(pdf_file) -> str:
    """Extract raw text from a PDF file."""
    text = ""
    with pdfplumber.open(pdf_file) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text


def extract_built_from_text(resume_text: str) -> dict:
    """
    Use OpenAI to extract structured data from resume text.
    
    Returns:
    {
        "role_label": "Backend Engineer",
        "built": ["accomplishment 1", "accomplishment 2", ...],
        "skills": ["Python", "AWS", ...],
        "years_experience": 4,
        "risk_flags": ["concern 1", ...]
    }
    """
    if not settings.openai_api_key:
        raise ValueError("OpenAI API key not configured")
    
    client = OpenAI(api_key=settings.openai_api_key)
    
    prompt = """You are analyzing a software engineer's resume to produce a fast, recruiter-ready decision summary.

Extract the following information:

1. built  
A list of concrete systems, products, or features the engineer BUILT, SHIPPED, or OWNED.

CRITICAL RULES:
- Focus on WHAT exists, not HOW it was built
- Do NOT mention technologies, tools, or frameworks
- Each item must be 6–10 words MAX
- Each item must describe something real and tangible
- Maximum 3 items, ordered by impact

Examples:
GOOD: "Real-time multiplayer poker platform"
GOOD: "Authentication system for SaaS product"
BAD: "Built APIs using Node.js and PostgreSQL"

2. suitability_percentage
A percentage (0-100) indicating how suitable this candidate is for a software engineering role based on their resume.

Consider:
- Relevant experience
- Technical depth
- Project quality
- Career progression

Return as an integer (e.g., 75, not "75%").

Return ONLY valid JSON.
No explanations.
No markdown.

Resume:

"""
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You extract structured data from resumes. Return only valid JSON."},
            {"role": "user", "content": prompt + resume_text}
        ],
        response_format={"type": "json_object"}
    )
    
    result = response.choices[0].message.content
    return json.loads(result)


def extract_resume(pdf_file) -> dict:
    """
    Main function: PDF file → structured data.
    """
    text = extract_text_from_pdf(pdf_file)
    if not text.strip():
        return {
            "error": "Could not extract text from PDF",
            "built": [],
            "suitability_percentage": None
        }
    
    return extract_built_from_text(text)

