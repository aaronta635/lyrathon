import httpx
import re
from urllib.parse import urlparse
from app.config import settings
from typing import Optional, Dict, Any


def parse_github_response(raw_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Parse the complex GitHub analyzer response into Decision Card format.
    
    Extracts signals for:
    - ownership: Core strengths, working style
    - patterns: Collaboration style, activity patterns
    - quality: Documentation, code quality indicators
    - risk_flags: Risk factors, missing skills
    
    Also stores the full raw response for deep-dive.
    """
    if "error" in raw_data:
        return raw_data
    
    parsed = {
        "raw": raw_data,  # Store full response for deep-dive
        # Decision Card fields
        "inferred_seniority": None,
        "core_strengths": [],
        "collaboration_style": None,
        "recommendations": [],  # Combined recommendations (limited to first 3)
        "confidence_percentage": None,
        "justification": None  # From hiring_recommendation.justification
    }
    
    # Extract from engineer_summary
    engineer = raw_data.get("engineer_summary", {})
    if engineer:
        parsed["inferred_seniority"] = engineer.get("inferred_seniority")
        parsed["core_strengths"] = engineer.get("core_strengths", [])
        parsed["collaboration_style"] = engineer.get("collaboration_style")
    
    # Extract from hiring_recommendation
    recommendation = raw_data.get("hiring_recommendation", {})
    if recommendation:
        parsed["confidence_percentage"] = recommendation.get("confidence_percentage")
        parsed["justification"] = recommendation.get("justification")
    
    # Extract from recommendations (combine all, deduplicate)
    recommendations = raw_data.get("recommendations", {})
    if recommendations:
        all_recommendations = []
        seen = set()  # Track seen recommendations to avoid duplicates (normalized)
        
        github_improvements = recommendations.get("github_improvements", [])
        for rec in github_improvements:
            if rec:
                # Normalize for comparison (lowercase, strip whitespace)
                normalized = rec.strip().lower()
                if normalized not in seen:
                    all_recommendations.append(rec)  # Keep original casing
                    seen.add(normalized)
        
        skill_development = recommendations.get("skill_development", [])
        for rec in skill_development:
            if rec:
                normalized = rec.strip().lower()
                if normalized not in seen:
                    all_recommendations.append(rec)
                    seen.add(normalized)
        
        project_suggestions = recommendations.get("project_suggestions", [])
        for rec in project_suggestions:
            if rec:
                normalized = rec.strip().lower()
                if normalized not in seen:
                    all_recommendations.append(rec)
                    seen.add(normalized)
        
        # Limit to first 3 recommendations
        parsed["recommendations"] = all_recommendations[:3]
    
    return parsed


def extract_github_username(github_url: str) -> Optional[str]:
    """
    Extract username from GitHub URL.
    
    Examples:
        https://github.com/octocat -> octocat
        github.com/username -> username
        @username -> username
    """
    # Remove @ if present
    github_url = github_url.strip().lstrip("@")
    
    # If it's already just a username (no URL)
    if "/" not in github_url and "github.com" not in github_url:
        return github_url
    
    # Parse URL
    if not github_url.startswith(("http://", "https://")):
        github_url = "https://" + github_url
    
    try:
        parsed = urlparse(github_url)
        path = parsed.path.strip("/")
        
        # Extract username (first part of path)
        if path:
            username = path.split("/")[0]
            return username
    except Exception:
        pass
    
    return None


async def analyze_github(
    github_url: str,
    job_title: str = "Engineer",
    required_skills: str = "",
    seniority: str = "mid",
    focus: str = "fullstack"
) -> Optional[Dict[str, Any]]:
    """
    Call the GitHub analyzer microservice to analyze a GitHub profile.
    
    Args:
        github_url: The GitHub profile URL to analyze
        job_title: Job title for matching (default: "Engineer")
        required_skills: Comma-separated required skills (default: "")
        seniority: Seniority level - "junior", "mid", "senior" (default: "mid")
        focus: Focus area - "frontend", "backend", "fullstack" (default: "fullstack")
        
    Returns:
        Parsed dictionary with GitHub analysis data in Decision Card format
    """
    analyzer_url = settings.github_analyzer_url
    
    if not analyzer_url:
        # Return mock data if URL not configured
        print("⚠️  WARNING: GITHUB_ANALYZER_URL not set, using mock data")
        return {
            "raw": {},
            "inferred_seniority": "mid to senior-level",
            "core_strengths": ["React", "Node.js"],
            "collaboration_style": "active team contributor",
            "recommendations": [
                "Increase commit frequency",
                "Learn Next.js 14",
                "Build fullstack application"
            ],
            "confidence_percentage": 75,
            "justification": "Mock data: Candidate shows good technical skills but needs more consistent activity."
        }
    
    # Extract username from GitHub URL
    username = extract_github_username(github_url)
    if not username:
        print(f"❌ ERROR: Could not extract username from: {github_url}")
        return {
            "error": f"Could not extract username from GitHub URL: {github_url}"
        }
    
    print(f"🔍 Calling GitHub analyzer for: {username}")
    print(f"   URL: {analyzer_url}/api/analyze")
    print(f"   Params: username={username}, job_title={job_title}, skills={required_skills}")
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            # Use GET with query parameters
            response = await client.get(
                f"{analyzer_url}/api/analyze",
                params={
                    "username": username,
                    "job_title": job_title,
                    "required_skills": required_skills,
                    "seniority": seniority,
                    "focus": focus
                }
            )
            
            print(f"📡 Response status: {response.status_code}")
            
            if response.status_code == 200:
                # Get raw JSON response
                raw_data = response.json()
                print(f"✅ Got response, parsing...")
                # Parse into Decision Card format
                parsed = parse_github_response(raw_data)
                print(f"✅ Parsed: seniority={parsed.get('inferred_seniority')}, strengths={parsed.get('core_strengths')}")
                return parsed
            else:
                error_msg = f"GitHub analyzer returned status {response.status_code}: {response.text}"
                print(f"❌ {error_msg}")
                return {
                    "error": error_msg
                }
                
    except httpx.TimeoutException:
        return {
            "error": "GitHub analyzer request timed out"
        }
    except Exception as e:
        return {
            "error": f"Failed to call GitHub analyzer: {str(e)}"
        }
