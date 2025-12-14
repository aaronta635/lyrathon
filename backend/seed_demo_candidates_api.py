"""
Seed script to add demo candidates via API (Option 2).
This tests the full application flow including resume extraction and GitHub analysis.

Requirements:
    pip install reportlab requests

Usage:
    python seed_demo_candidates_api.py
"""

import requests
import json
import os
from pathlib import Path

# API Configuration
API_BASE_URL = os.getenv("API_BASE_URL", "https://lyrathon-production.up.railway.app/api")
# For local testing, use: "http://localhost:8000/api"

# Demo candidates data
# IMPORTANT: Replace these GitHub URLs with real GitHub profiles to test the full flow!
# You can use your own GitHub profile or any public GitHub profile for testing.
# If you want to skip GitHub analysis, use the SQL script (update_github_data.sql) instead.

DEMO_CANDIDATES = [
    {
        "name": "Sarah Chen",
        "email": "sarah.chen@demo.com",
        "github_url": "https://github.com/aaronta635",  # REPLACE with real GitHub URL
        "focus": "fullstack",
        "resume_text": """
        SARAH CHEN
        Senior Full-Stack Engineer
        Email: sarah.chen@demo.com
        Location: Sydney, Australia
        Years of Experience: 7 years

        SUMMARY
        Experienced full-stack engineer with 7 years of production experience building scalable web applications. 
        Expertise in React, Node.js, TypeScript, and cloud infrastructure.

        SKILLS
        - React, TypeScript, JavaScript
        - Node.js, Express, NestJS
        - PostgreSQL, MongoDB
        - AWS, Docker, Kubernetes
        - CI/CD, Testing (Jest, Cypress)

        EXPERIENCE
        Senior Full-Stack Engineer | TechCorp | 2020 - Present
        - Built e-commerce platform with real-time inventory management serving 100K+ users
        - Designed microservices architecture for payment processing system
        - Developed React-based admin dashboard with analytics and reporting
        - Optimized database queries reducing response time by 40%

        Full-Stack Engineer | StartupXYZ | 2018 - 2020
        - Developed RESTful APIs using Node.js and Express
        - Built responsive frontend components with React and TypeScript
        - Implemented authentication and authorization systems

        PROJECTS
        1. E-commerce Platform - Full-stack e-commerce solution with real-time inventory management
        2. Payment Service - Microservices architecture for payment processing
        3. Admin Dashboard - React-based dashboard with analytics and reporting features
        """
    },
    {
        "name": "Marcus Rodriguez",
        "email": "marcus.r@demo.com",
        "github_url": "https://github.com/aaronta635",  # REPLACE with real GitHub URL
        "focus": "backend",
        "resume_text": """
        MARCUS RODRIGUEZ
        Backend Engineer
        Email: marcus.r@demo.com
        Location: Melbourne, Australia
        Years of Experience: 4 years

        SUMMARY
        Backend engineer specializing in Python, Django, and database optimization. 
        Experienced in building scalable APIs and optimizing database performance.

        SKILLS
        - Python, Django, Flask
        - PostgreSQL, Redis
        - Docker, AWS
        - RESTful APIs, GraphQL
        - Database Optimization

        EXPERIENCE
        Backend Engineer | DataTech | 2021 - Present
        - Built RESTful API for mobile app serving 1M+ users
        - Optimized database queries reducing query time by 60%
        - Implemented caching layer using Redis
        - Designed database schema for high-traffic application

        Junior Backend Engineer | WebSolutions | 2019 - 2021
        - Developed Django REST APIs
        - Maintained and optimized PostgreSQL databases
        - Implemented authentication and authorization

        PROJECTS
        1. Mobile API - RESTful API for mobile app with 1M+ users
        2. Database Optimizer - System reducing query time by 60%
        3. Notification Service - Real-time notification service using WebSockets
        """
    },
    {
        "name": "Emma Watson",
        "email": "emma.w@demo.com",
        "github_url": "https://github.com/aaronta635",  # REPLACE with real GitHub URL
        "focus": "frontend",
        "resume_text": """
        EMMA WATSON
        Frontend Developer
        Email: emma.w@demo.com
        Location: Brisbane, Australia
        Years of Experience: 3 years

        SUMMARY
        Frontend developer passionate about creating beautiful and intuitive user interfaces. 
        Strong expertise in React, TypeScript, and modern CSS.

        SKILLS
        - React, TypeScript, JavaScript
        - GraphQL, Apollo Client
        - CSS, SCSS, Tailwind CSS
        - Jest, React Testing Library
        - Storybook, Design Systems

        EXPERIENCE
        Frontend Developer | DesignStudio | 2021 - Present
        - Built design system component library with Storybook
        - Developed progressive web app with offline capabilities
        - Created data visualization dashboard using D3.js
        - Collaborated with designers to implement pixel-perfect UI

        Junior Frontend Developer | DigitalAgency | 2019 - 2021
        - Developed React components for client websites
        - Implemented responsive designs
        - Wrote unit tests using Jest

        PROJECTS
        1. Design System - Component library with Storybook documentation
        2. PWA App - Progressive web app with offline capabilities
        3. Data Dashboard - Visualization dashboard with D3.js
        """
    },
    {
        "name": "James Park",
        "email": "james.p@demo.com",
        "github_url": "https://github.com/aaronta635",  # REPLACE with real GitHub URL
        "focus": "frontend",
        "resume_text": """
        JAMES PARK
        Junior Frontend Developer
        Email: james.p@demo.com
        Location: Adelaide, Australia
        Years of Experience: 1 year

        SUMMARY
        Enthusiastic junior developer eager to learn and grow. 
        Passionate about web development and building user-friendly applications.

        SKILLS
        - JavaScript, HTML, CSS
        - React (Basic)
        - Git, GitHub

        EXPERIENCE
        Junior Developer | LocalTech | 2023 - Present
        - Maintained company website
        - Fixed bugs in existing codebase
        - Participated in code reviews

        PROJECTS
        1. Portfolio Website - Personal portfolio website built with React
        2. Todo App - Todo application using React hooks
        3. Weather App - Weather application using OpenWeather API
        """
    },
    {
        "name": "Lisa Kumar",
        "email": "lisa.k@demo.com",
        "github_url": "https://github.com/aaronta635",  # REPLACE with real GitHub URL
        "focus": "fullstack",
        "resume_text": """
        LISA KUMAR
        DevOps Engineer
        Email: lisa.k@demo.com
        Location: Perth, Australia
        Years of Experience: 6 years

        SUMMARY
        DevOps engineer with extensive experience in cloud infrastructure, CI/CD, and automation. 
        Expert in Kubernetes, AWS, and infrastructure as code.

        SKILLS
        - Kubernetes, Docker
        - AWS, Terraform
        - CI/CD (GitHub Actions, Jenkins)
        - Python, Bash
        - Monitoring (Prometheus, Grafana)

        EXPERIENCE
        DevOps Engineer | CloudTech | 2019 - Present
        - Built CI/CD pipeline with GitHub Actions and Docker
        - Set up Kubernetes cluster for microservices architecture
        - Implemented infrastructure as code using Terraform
        - Reduced deployment time by 70%

        Infrastructure Engineer | TechCorp | 2017 - 2019
        - Managed AWS infrastructure
        - Automated deployment processes
        - Implemented monitoring and alerting

        PROJECTS
        1. CI/CD Pipeline - GitHub Actions pipeline with Docker
        2. K8s Setup - Kubernetes cluster for microservices
        3. Terraform Infrastructure - Infrastructure as code setup
        """
    },
    {
        "name": "Tom Wilson",
        "email": "tom.w@demo.com",
        "github_url": "https://github.com/aaronta635",  # REPLACE with real GitHub URL
        "focus": "fullstack",
        "resume_text": """
        TOM WILSON
        Senior Full-Stack Engineer
        Email: tom.w@demo.com
        Location: Sydney, Australia
        Years of Experience: 8 years

        SUMMARY
        Senior full-stack engineer with 8 years of experience building enterprise-scale applications. 
        Expert in React, Node.js, and system architecture. Strong leadership and collaboration skills.

        SKILLS
        - React, TypeScript, JavaScript
        - Node.js, GraphQL
        - PostgreSQL, MongoDB, Redis
        - AWS, Docker, Kubernetes
        - System Design, Architecture

        EXPERIENCE
        Senior Full-Stack Engineer | EnterpriseCorp | 2018 - Present
        - Built enterprise SaaS platform with multi-tenancy serving 500K+ users
        - Designed and implemented real-time collaboration features using WebSockets
        - Developed mobile app backend with GraphQL API
        - Led team of 5 engineers

        Full-Stack Engineer | StartupHub | 2016 - 2018
        - Developed full-stack features for web application
        - Built RESTful APIs and GraphQL endpoints
        - Implemented authentication and authorization

        PROJECTS
        1. SaaS Platform - Enterprise platform with multi-tenancy
        2. Collaboration Service - Real-time features with WebSockets
        3. Mobile Backend - GraphQL API for mobile app
        """
    }
]


def create_resume_pdf(resume_text: str, output_path: str):
    """Create a simple text-based PDF from resume text."""
    # Try to import reportlab
    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.pdfgen import canvas
    except ImportError:
        # Try to install reportlab automatically
        try:
            import subprocess
            import sys
            print("📦 Installing reportlab (required for PDF generation)...")
            subprocess.check_call([sys.executable, "-m", "pip", "install", "reportlab", "-q"], 
                                stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            from reportlab.lib.pagesizes import letter
            from reportlab.pdfgen import canvas
            print("✅ reportlab installed successfully")
        except Exception as e:
            print(f"❌ Could not install reportlab: {e}")
            print("💡 Please install manually: pip install reportlab")
            return False
    
    # Create PDF
    try:
        c = canvas.Canvas(output_path, pagesize=letter)
        width, height = letter
        
        # Split text into lines and add to PDF
        y_position = height - 50
        for line in resume_text.split('\n'):
            if y_position < 50:
                c.showPage()
                y_position = height - 50
            # Only add non-empty lines
            if line.strip():
                c.drawString(50, y_position, line.strip())
                y_position -= 15
        
        c.save()
        return True
    except Exception as e:
        print(f"❌ Error creating PDF: {e}")
        return False


def submit_application(name: str, email: str, github_url: str, focus: str, resume_text: str):
    """Submit an application via API."""
    print(f"\n📝 Submitting application for {name}...")
    
    # Create temporary resume file
    temp_resume = f"/tmp/resume_{email.replace('@', '_at_').replace('.', '_')}.pdf"
    create_resume_pdf(resume_text, temp_resume)
    
    # Check if file was created
    if not os.path.exists(temp_resume):
        temp_resume = temp_resume.replace('.pdf', '.txt')
        if not os.path.exists(temp_resume):
            print(f"❌ Failed to create resume file for {name}")
            return False
    
    try:
        # Prepare form data
        with open(temp_resume, 'rb') as f:
            files = {
                'resume': (os.path.basename(temp_resume), f, 'application/pdf')
            }
            data = {
                'name': name,
                'email': email,
                'github_url': github_url,
                'focus': focus
            }
            
            # Submit to API
            response = requests.post(
                f"{API_BASE_URL}/applications/",
                files=files,
                data=data,
                timeout=60
            )
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Successfully submitted {name} - Status: {result.get('status')}")
                print(f"   Application ID: {result.get('id')}")
                return True
            else:
                print(f"❌ Failed to submit {name}: {response.status_code}")
                print(f"   Error: {response.text}")
                return False
                
    except Exception as e:
        print(f"❌ Error submitting {name}: {e}")
        return False
    finally:
        # Clean up temp file
        if os.path.exists(temp_resume):
            os.remove(temp_resume)


def seed_demo_candidates():
    """Seed demo candidates via API."""
    print(f"🌱 Seeding demo candidates via API: {API_BASE_URL}")
    print(f"📊 This will test the full application flow (resume extraction + GitHub analysis)")
    print(f"⏱️  Each submission may take 15-30 seconds to process...")
    print(f"📦 Note: reportlab will be installed automatically if needed")
    print(f"\n⚠️  IMPORTANT: All candidates currently use the same GitHub URL (aaronta635)")
    print(f"   For better testing, update the github_url for each candidate in the script.")
    print(f"   Or use update_github_data.sql to update github_data directly in the database.\n")
    
    success_count = 0
    for candidate in DEMO_CANDIDATES:
        success = submit_application(
            candidate["name"],
            candidate["email"],
            candidate["github_url"],
            candidate["focus"],
            candidate["resume_text"]
        )
        if success:
            success_count += 1
    
    print(f"\n🎉 Successfully submitted {success_count}/{len(DEMO_CANDIDATES)} candidates!")
    print(f"\n💡 Note: Applications will be processed in the background.")
    print(f"   Check the recruiter dashboard in a few minutes to see the results.")


if __name__ == "__main__":
    seed_demo_candidates()

