"""
Script to update GitHub data for demo candidates in the database.
This uses the mock GitHub data from github_data_mocks.json.

Usage:
    # Option 1: Run with DATABASE_URL pointing to Supabase (works with remote DB)
    DATABASE_URL="postgresql://..." python update_github_data.py
    
    # Option 2: Use the SQL file (update_github_data.sql) in Supabase SQL Editor
    # Copy and paste the SQL from update_github_data.sql into Supabase SQL Editor
"""

import sys
import os
import json
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal

# Try to import Application model
try:
    from app.models.application import Application
except ImportError:
    print("❌ Could not import Application model. Make sure you're on the aaron-backend branch.")
    print("   The Application model should be in backend/app/models/application.py")
    sys.exit(1)

# Load GitHub data mocks
GITHUB_DATA_FILE = Path(__file__).parent / "github_data_mocks.json"

# Email to GitHub data mapping
EMAIL_TO_GITHUB_DATA = {
    "sarah.chen@demo.com": "sarah_chen",
    "marcus.r@demo.com": "marcus_rodriguez",
    "emma.w@demo.com": "emma_watson",
    "james.p@demo.com": "james_park",
    "lisa.k@demo.com": "lisa_kumar",
    "tom.w@demo.com": "tom_wilson",
}


def update_github_data():
    """Update GitHub data for demo candidates."""
    # Load GitHub data mocks
    if not GITHUB_DATA_FILE.exists():
        print(f"❌ GitHub data file not found: {GITHUB_DATA_FILE}")
        return
    
    with open(GITHUB_DATA_FILE, 'r') as f:
        github_data_mocks = json.load(f)
    
    db = SessionLocal()
    
    try:
        print("🔄 Updating GitHub data for demo candidates...\n")
        
        updated_count = 0
        for email, github_key in EMAIL_TO_GITHUB_DATA.items():
            # Find application by email
            application = db.query(Application).filter(Application.email == email).first()
            
            if not application:
                print(f"⏭️  Skipping {email} (application not found)")
                continue
            
            # Get GitHub data for this candidate
            if github_key not in github_data_mocks:
                print(f"⚠️  No GitHub data found for {github_key}")
                continue
            
            github_data = github_data_mocks[github_key]
            
            # Update application
            application.github_data = github_data
            db.commit()
            
            print(f"✅ Updated {application.name} ({email})")
            print(f"   - Match Score: {github_data.get('confidence_percentage', 'N/A')}%")
            print(f"   - Seniority: {github_data.get('inferred_seniority', 'N/A')}")
            print(f"   - Core Strengths: {', '.join(github_data.get('core_strengths', []))}")
            updated_count += 1
        
        print(f"\n🎉 Successfully updated {updated_count} candidates!")
        print("\n💡 Note: The decision cards will be regenerated on the next request.")
        print("   Refresh the recruiter dashboard to see updated match scores.")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error updating GitHub data: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    update_github_data()

