"""
Seed script to add demo candidates for pitching purposes.
These candidates showcase different profiles and how the platform can help them.

Usage:
    python seed_demo_candidates.py
"""

import sys
import os
import uuid
from datetime import datetime
from sqlalchemy.orm import Session

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal

# Try to import Application model - it might be in different locations
try:
    from app.models.application import Application, ApplicationStatus
except ImportError:
    try:
        from app.models import Application, ApplicationStatus
    except ImportError:
        print("❌ Could not import Application model. Make sure you're on the aaron-backend branch.")
        print("   The Application model should be in backend/app/models/application.py")
        sys.exit(1)

# Demo candidates with varied profiles for pitching
DEMO_CANDIDATES = [
    {
        "name": "Sarah Chen",
        "email": "sarah.chen@demo.com",
        "github_url": "https://github.com/sarah-chen-dev",
        "focus": "fullstack",
        "status": ApplicationStatus.READY.value,
        "resume_data": {
            "role_label": "Senior Full-Stack Engineer",
            "built": [
                "E-commerce platform with real-time inventory management",
                "Microservices architecture for payment processing",
                "React-based admin dashboard with analytics"
            ],
            "skills": ["React", "Node.js", "PostgreSQL", "AWS", "Docker", "TypeScript"],
            "years_experience": 7,
            "risk_flags": [],
            "suitability_percentage": 92,
            "built_verification": [
                {
                    "item": "E-commerce platform with real-time inventory management",
                    "confidence": 88,
                    "matched_repo": "ecommerce-platform",
                    "repo_url": "https://github.com/sarah-chen-dev/ecommerce-platform"
                },
                {
                    "item": "Microservices architecture for payment processing",
                    "confidence": 85,
                    "matched_repo": "payment-service",
                    "repo_url": "https://github.com/sarah-chen-dev/payment-service"
                }
            ]
        },
        "github_data": {
            "inferred_seniority": "senior",
            "core_strengths": ["React", "Node.js", "TypeScript", "AWS"],
            "collaboration_style": "highly collaborative",
            "recommendations": [
                "Excellent fit for senior fullstack roles requiring React expertise",
                "Strong production experience with scalable architectures",
                "Would benefit from pair programming on Next.js 14 features"
            ],
            "justification": "Sarah demonstrates exceptional fullstack capabilities with 7 years of production experience. Her React and Node.js expertise is well-documented through active GitHub contributions and verified project implementations. The candidate shows strong architectural thinking with microservices experience and cloud infrastructure knowledge. This is an ideal candidate for senior fullstack engineering roles.",
            "confidence_percentage": 90
        }
    },
    {
        "name": "Marcus Rodriguez",
        "email": "marcus.r@demo.com",
        "github_url": "https://github.com/marcus-backend",
        "focus": "backend",
        "status": ApplicationStatus.READY.value,
        "resume_data": {
            "role_label": "Backend Engineer",
            "built": [
                "RESTful API for mobile app with 1M+ users",
                "Database optimization system reducing query time by 60%",
                "Real-time notification service using WebSockets"
            ],
            "skills": ["Python", "Django", "PostgreSQL", "Redis", "Docker"],
            "years_experience": 4,
            "risk_flags": [],
            "suitability_percentage": 78,
            "built_verification": [
                {
                    "item": "RESTful API for mobile app with 1M+ users",
                    "confidence": 82,
                    "matched_repo": "mobile-api",
                    "repo_url": "https://github.com/marcus-backend/mobile-api"
                }
            ]
        },
        "github_data": {
            "inferred_seniority": "mid-level",
            "core_strengths": ["Python", "Django", "PostgreSQL"],
            "collaboration_style": "moderate collaboration",
            "recommendations": [
                "Good fit for backend-heavy roles with Python/Django stack",
                "Strong database optimization skills demonstrated",
                "Could benefit from more frontend exposure for fullstack growth"
            ],
            "justification": "Marcus shows solid backend engineering skills with proven experience in high-scale systems. His database optimization work demonstrates strong technical depth. However, the candidate has limited frontend experience which may limit growth opportunities in fullstack roles. Best suited for backend-focused positions where Python and Django expertise is valued.",
            "confidence_percentage": 80
        }
    },
    {
        "name": "Emma Watson",
        "email": "emma.w@demo.com",
        "github_url": "https://github.com/emma-frontend",
        "focus": "frontend",
        "status": ApplicationStatus.READY.value,
        "resume_data": {
            "role_label": "Frontend Developer",
            "built": [
                "Design system component library with Storybook",
                "Progressive Web App with offline capabilities",
                "Data visualization dashboard with D3.js"
            ],
            "skills": ["React", "TypeScript", "GraphQL", "CSS", "Jest"],
            "years_experience": 3,
            "risk_flags": [],
            "suitability_percentage": 85,
            "built_verification": [
                {
                    "item": "Design system component library with Storybook",
                    "confidence": 90,
                    "matched_repo": "design-system",
                    "repo_url": "https://github.com/emma-frontend/design-system"
                }
            ]
        },
        "github_data": {
            "inferred_seniority": "mid-level",
            "core_strengths": ["React", "TypeScript", "GraphQL"],
            "collaboration_style": "collaborative",
            "recommendations": [
                "Strong frontend skills with modern React patterns",
                "Excellent UI/UX focus with design system experience",
                "Would benefit from backend exposure to become fullstack"
            ],
            "justification": "Emma demonstrates strong frontend engineering capabilities with a focus on user experience and design systems. Her React and TypeScript skills are well-documented, and she shows good collaboration patterns. The candidate is well-suited for frontend roles but would need backend experience to transition to fullstack positions.",
            "confidence_percentage": 85
        }
    },
    {
        "name": "James Park",
        "email": "james.p@demo.com",
        "github_url": "https://github.com/james-junior",
        "focus": "frontend",
        "status": ApplicationStatus.READY.value,
        "resume_data": {
            "role_label": "Junior Frontend Developer",
            "built": [
                "Personal portfolio website",
                "Todo app with React hooks",
                "Weather app using OpenWeather API"
            ],
            "skills": ["JavaScript", "React", "CSS", "HTML"],
            "years_experience": 1,
            "risk_flags": ["Limited production experience", "No testing experience"],
            "suitability_percentage": 65,
            "built_verification": [
                {
                    "item": "Personal portfolio website",
                    "confidence": 75,
                    "matched_repo": "portfolio",
                    "repo_url": "https://github.com/james-junior/portfolio"
                }
            ]
        },
        "github_data": {
            "inferred_seniority": "junior",
            "core_strengths": ["JavaScript", "React"],
            "collaboration_style": "solo-focused",
            "recommendations": [
                "Needs more production experience and testing knowledge",
                "Would benefit from mentorship and pair programming",
                "Consider for junior roles with strong onboarding support"
            ],
            "justification": "James shows enthusiasm and basic React skills, but lacks production experience and testing knowledge. The candidate's projects are primarily learning exercises rather than production applications. This candidate would require significant mentorship and training before being ready for mid-level roles. Best suited for junior positions with strong support structures.",
            "confidence_percentage": 70
        }
    },
    {
        "name": "Lisa Kumar",
        "email": "lisa.k@demo.com",
        "github_url": "https://github.com/lisa-devops",
        "focus": "fullstack",
        "status": ApplicationStatus.READY.value,
        "resume_data": {
            "role_label": "DevOps Engineer",
            "built": [
                "CI/CD pipeline with GitHub Actions and Docker",
                "Kubernetes cluster setup for microservices",
                "Infrastructure as Code with Terraform"
            ],
            "skills": ["Kubernetes", "AWS", "Terraform", "Docker", "CI/CD", "Python"],
            "years_experience": 6,
            "risk_flags": [],
            "suitability_percentage": 88,
            "built_verification": [
                {
                    "item": "CI/CD pipeline with GitHub Actions and Docker",
                    "confidence": 92,
                    "matched_repo": "ci-cd-pipeline",
                    "repo_url": "https://github.com/lisa-devops/ci-cd-pipeline"
                },
                {
                    "item": "Kubernetes cluster setup for microservices",
                    "confidence": 88,
                    "matched_repo": "k8s-setup",
                    "repo_url": "https://github.com/lisa-devops/k8s-setup"
                }
            ]
        },
        "github_data": {
            "inferred_seniority": "senior",
            "core_strengths": ["Kubernetes", "AWS", "Terraform"],
            "collaboration_style": "highly collaborative",
            "recommendations": [
                "Excellent fit for DevOps and infrastructure roles",
                "Strong cloud architecture and automation skills",
                "Would excel in platform engineering positions"
            ],
            "justification": "Lisa demonstrates exceptional DevOps and infrastructure expertise with 6 years of experience. Her Kubernetes and AWS skills are production-tested, and she shows strong automation capabilities. The candidate is highly collaborative and would be an excellent fit for platform engineering or senior DevOps roles requiring cloud infrastructure expertise.",
            "confidence_percentage": 90
        }
    },
    {
        "name": "Tom Wilson",
        "email": "tom.w@demo.com",
        "github_url": "https://github.com/tom-fullstack",
        "focus": "fullstack",
        "status": ApplicationStatus.READY.value,
        "resume_data": {
            "role_label": "Senior Full-Stack Engineer",
            "built": [
                "Enterprise SaaS platform with multi-tenancy",
                "Real-time collaboration features with WebSockets",
                "Mobile app backend with GraphQL API"
            ],
            "skills": ["React", "Node.js", "PostgreSQL", "GraphQL", "AWS", "TypeScript", "Docker"],
            "years_experience": 8,
            "risk_flags": [],
            "suitability_percentage": 95,
            "built_verification": [
                {
                    "item": "Enterprise SaaS platform with multi-tenancy",
                    "confidence": 95,
                    "matched_repo": "saas-platform",
                    "repo_url": "https://github.com/tom-fullstack/saas-platform"
                },
                {
                    "item": "Real-time collaboration features with WebSockets",
                    "confidence": 90,
                    "matched_repo": "collab-service",
                    "repo_url": "https://github.com/tom-fullstack/collab-service"
                }
            ]
        },
        "github_data": {
            "inferred_seniority": "senior",
            "core_strengths": ["React", "Node.js", "PostgreSQL", "GraphQL"],
            "collaboration_style": "highly collaborative",
            "recommendations": [
                "Exceptional candidate for senior fullstack leadership roles",
                "Strong architecture and system design capabilities",
                "Ideal for technical lead or principal engineer positions"
            ],
            "justification": "Tom is an exceptional fullstack engineer with 8 years of production experience building enterprise-scale applications. His React and Node.js expertise is outstanding, and he demonstrates strong architectural thinking with multi-tenancy and real-time systems. The candidate shows excellent collaboration patterns and would be ideal for senior technical leadership roles.",
            "confidence_percentage": 95
        }
    }
]


def seed_demo_candidates():
    """Add demo candidates to the database."""
    db: Session = SessionLocal()
    
    try:
        print("🌱 Seeding demo candidates...")
        
        for candidate_data in DEMO_CANDIDATES:
            # Check if candidate already exists
            existing = db.query(Application).filter(
                Application.email == candidate_data["email"]
            ).first()
            
            if existing:
                print(f"⏭️  Skipping {candidate_data['name']} (already exists)")
                continue
            
            # Create new application
            application = Application(
                id=str(uuid.uuid4()),
                name=candidate_data["name"],
                email=candidate_data["email"],
                github_url=candidate_data["github_url"],
                focus=candidate_data["focus"],
                status=candidate_data["status"],
                resume_data=candidate_data["resume_data"],
                github_data=candidate_data["github_data"],
                created_at=datetime.utcnow()
            )
            
            db.add(application)
            print(f"✅ Added {candidate_data['name']} ({candidate_data['resume_data']['suitability_percentage']}% match)")
        
        db.commit()
        print(f"\n🎉 Successfully seeded {len(DEMO_CANDIDATES)} demo candidates!")
        print("\nCandidates added:")
        for candidate in DEMO_CANDIDATES:
            print(f"  - {candidate['name']}: {candidate['resume_data']['suitability_percentage']}% match, {candidate['resume_data']['years_experience']}y exp")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding candidates: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_demo_candidates()

