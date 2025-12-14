#!/usr/bin/env python3
"""
Test script for built item verification.
Run this to test the verification system without submitting a full application.
"""
import sys
import asyncio
from pathlib import Path

# Add the backend directory to the path
sys.path.insert(0, str(Path(__file__).parent))

from app.services.github_api import get_user_repositories
from app.services.verification import verify_built_items


async def test_verification():
    """Test the verification system with sample data."""
    
    # Test data
    github_url = input("Enter GitHub URL (e.g., https://github.com/username): ").strip()
    if not github_url:
        print("❌ GitHub URL required")
        return
    
    # Sample built items (you can modify these)
    built_items = [
        "Full-stack food-rescue marketplace connecting restaurants",
        "Notion-integrated blog system for content updates",
        "AI-powered community insight app for user engagement"
    ]
    
    print(f"\n🔍 Testing verification for: {github_url}")
    print(f"📋 Built items to verify: {len(built_items)}")
    for item in built_items:
        print(f"   - {item}")
    
    print("\n⏳ Fetching repositories...")
    repos = await get_user_repositories(
        github_url=github_url,
        max_repos=30,
        max_to_verify=20,
        resume_skills=["TypeScript", "JavaScript", "React"]  # Optional
    )
    
    if not repos:
        print("❌ No public repositories found or error fetching repos")
        return
    
    print(f"✅ Found {len(repos)} repositories to check")
    print("\n📦 Top repositories:")
    for i, repo in enumerate(repos[:5], 1):
        print(f"   {i}. {repo.get('name')} - {repo.get('description', 'No description')}")
    
    print("\n⏳ Verifying built items with AI...")
    verification_results = await verify_built_items(built_items, repos)
    
    print("\n" + "="*60)
    print("VERIFICATION RESULTS")
    print("="*60)
    
    for result in verification_results:
        confidence = result.get("confidence", 0)
        emoji = "✅" if confidence >= 60 else "⚠️" if confidence > 0 else "❌"
        
        print(f"\n{emoji} {result['item']}")
        print(f"   Match: {confidence}%")
        
        if result.get("matched_repo"):
            print(f"   Repo: {result['matched_repo']}")
            print(f"   URL: {result['repo_url']}")
        else:
            print(f"   No matching repository found")
    
    print("\n" + "="*60)
    
    # Summary
    high_match = sum(1 for r in verification_results if r.get("confidence", 0) >= 60)
    low_match = sum(1 for r in verification_results if 0 < r.get("confidence", 0) < 60)
    no_match = sum(1 for r in verification_results if r.get("confidence", 0) == 0)
    
    print(f"\n📊 Summary:")
    print(f"   High Match (≥60%): {high_match}")
    print(f"   Low Match (<60%): {low_match}")
    print(f"   No Match (0%): {no_match}")


if __name__ == "__main__":
    print("🧪 Built Item Verification Test")
    print("="*60)
    asyncio.run(test_verification())

