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
    client = OpenAI(api_key=settings.openai_api_key)
    
    prompt = """You are analyzing a software engineer's resume to produce a fast, recruiter-ready decision summary.

Extract the following information:

1. role_label  
The most appropriate primary role for this engineer.
Choose ONE from:
"Backend Engineer", "Frontend Engineer", "Fullstack Engineer",
"DevOps Engineer", "Data Engineer", "Mobile Engineer".

2. built  
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

3. skill_signals  
High-level capability signals inferred from experience.
These are NOT tools or technologies.

Examples:
- "Backend system ownership"
- "API design and maintenance"
- "Production debugging experience"

Rules:
- Maximum 3 items
- No programming languages
- No frameworks
- No buzzwords

4. experience_summary  
A short human-readable summary of experience.
Format: "<X> years building <type> systems"

Examples:
- "4 years building backend systems"
- "2 years building full-stack web applications"

5. risk_flags  
Concrete, recruiter-relevant concerns based ONLY on evidence in the resume.

Rules:
- Be specific and factual
- Avoid vague statements
- Do NOT invent risks
- Maximum 3 items
- If no clear risks exist, return an empty array

Examples:
GOOD: "No evidence of production-scale systems"
GOOD: "Multiple roles under one year duration"
BAD: "Might struggle in senior role"

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
            "role_label": None,
            "built": [],
            "skills": [],
            "years_experience": None,
            "risk_flags": ["Could not parse resume"]
        }
    
    return extract_built_from_text(text)

