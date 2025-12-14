#!/usr/bin/env python3
"""
Script to fix duplicate recommendations in existing database records.
This re-processes the github_data to deduplicate recommendations.
"""
import sys
from pathlib import Path

# Add the backend directory to the path so we can import app modules
sys.path.insert(0, str(Path(__file__).parent))

from app.database import SessionLocal
from app.models.application import Application
from app.services.github_analyzer import parse_github_response


def deduplicate_recommendations(recommendations_list):
    """Deduplicate recommendations, handling case and whitespace differences."""
    seen = set()
    deduplicated = []
    
    for rec in recommendations_list:
        if not rec:
            continue
        
        # Normalize: lowercase and strip whitespace for comparison
        normalized = rec.strip().lower()
        
        if normalized not in seen:
            seen.add(normalized)
            deduplicated.append(rec)  # Keep original casing
    
    return deduplicated


def fix_application_recommendations(application):
    """Fix recommendations in a single application's github_data."""
    if not application.github_data:
        return False
    
    github_data = application.github_data.copy()
    
    # If recommendations already exist, deduplicate them and limit to 3
    if "recommendations" in github_data and isinstance(github_data["recommendations"], list):
        original_count = len(github_data["recommendations"])
        github_data["recommendations"] = deduplicate_recommendations(github_data["recommendations"])
        # Limit to first 3
        if len(github_data["recommendations"]) > 3:
            github_data["recommendations"] = github_data["recommendations"][:3]
        new_count = len(github_data["recommendations"])
        
        # Also check if we have raw data and should re-parse for justification
        if "raw" in github_data and "hiring_recommendation" in github_data["raw"]:
            parsed = parse_github_response(github_data["raw"])
            github_data["recommendations"] = parsed.get("recommendations", [])  # Already limited to 3
            if "justification" in parsed:
                github_data["justification"] = parsed.get("justification")
        
        if original_count != new_count or "justification" not in github_data:
            application.github_data = github_data
            return True
    
    # If we have raw data, re-parse it to get properly deduplicated recommendations
    if "raw" in github_data:
        parsed = parse_github_response(github_data["raw"])
        if "recommendations" in parsed:
            github_data["recommendations"] = parsed["recommendations"]  # Already limited to 3 in parse_github_response
            # Also update justification if available
            if "justification" in parsed:
                github_data["justification"] = parsed.get("justification")
            application.github_data = github_data
            return True
    
    return False


def fix_all_recommendations():
    """Fix duplicate recommendations in all applications."""
    db = SessionLocal()
    
    try:
        applications = db.query(Application).filter(
            Application.github_data.isnot(None)
        ).all()
        
        fixed_count = 0
        total_count = len(applications)
        
        print(f"Found {total_count} applications with GitHub data")
        
        for app in applications:
            if fix_application_recommendations(app):
                fixed_count += 1
                print(f"✓ Fixed recommendations for application {app.id} ({app.name})")
        
        if fixed_count > 0:
            db.commit()
            print(f"\n✅ Fixed {fixed_count} out of {total_count} applications")
        else:
            print(f"\n✓ No duplicates found in {total_count} applications")
            
    except Exception as e:
        db.rollback()
        print(f"✗ Error fixing recommendations: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    print("Fixing duplicate recommendations in database...")
    fix_all_recommendations()

