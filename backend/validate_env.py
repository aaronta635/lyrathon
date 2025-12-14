#!/usr/bin/env python3
"""
Production Environment Validation Script

This script validates that all required environment variables are set
and properly configured for production deployment.
"""

import os
import sys
from urllib.parse import urlparse

# Note: This script reads from environment variables
# Make sure to source your .env file or set them in your environment
# For local testing: export $(cat .env | xargs) && python validate_env.py

# Color codes for terminal output
RED = '\033[91m'
GREEN = '\033[92m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'

def check_required(var_name: str, description: str = "") -> tuple[bool, str]:
    """Check if a required environment variable is set."""
    value = os.getenv(var_name)
    if not value or value.strip() == "":
        return False, f"{RED}❌ MISSING{RESET}"
    return True, f"{GREEN}✓ OK{RESET}"

def check_database_url() -> tuple[bool, str]:
    """Validate DATABASE_URL format."""
    db_url = os.getenv("DATABASE_URL", "")
    if not db_url:
        return False, f"{RED}❌ MISSING{RESET}"
    
    # Check if it's a PostgreSQL URL (production should use PostgreSQL, not SQLite)
    if db_url.startswith("sqlite"):
        return False, f"{YELLOW}⚠ WARNING: Using SQLite (not recommended for production){RESET}"
    
    if db_url.startswith("postgresql://") or db_url.startswith("postgres://"):
        try:
            parsed = urlparse(db_url)
            if not parsed.hostname:
                return False, f"{RED}❌ INVALID: Missing hostname{RESET}"
            if not parsed.path or parsed.path == "/":
                return False, f"{RED}❌ INVALID: Missing database name{RESET}"
            return True, f"{GREEN}✓ OK (PostgreSQL){RESET}"
        except Exception as e:
            return False, f"{RED}❌ INVALID: {str(e)}{RESET}"
    
    return True, f"{GREEN}✓ OK{RESET}"

def check_url_format(var_name: str) -> tuple[bool, str]:
    """Check if a variable is a valid URL."""
    value = os.getenv(var_name, "")
    if not value:
        return False, f"{RED}❌ MISSING{RESET}"
    
    if not value.startswith("http://") and not value.startswith("https://"):
        return False, f"{RED}❌ INVALID: Must be a valid URL (http:// or https://){RESET}"
    
    return True, f"{GREEN}✓ OK{RESET}"

def check_debug_mode() -> tuple[bool, str]:
    """Check if DEBUG is set to False for production."""
    debug = os.getenv("DEBUG", "false").lower()
    if debug in ("true", "1", "yes"):
        return False, f"{RED}❌ WARNING: DEBUG is enabled (security risk in production){RESET}"
    return True, f"{GREEN}✓ OK (DEBUG=false){RESET}"

def main():
    print(f"\n{BLUE}{'='*60}{RESET}")
    print(f"{BLUE}Production Environment Validation{RESET}")
    print(f"{BLUE}{'='*60}{RESET}\n")
    
    checks = []
    all_passed = True
    
    # Required variables
    print(f"{BLUE}Required Variables:{RESET}\n")
    
    # Database
    passed, msg = check_database_url()
    checks.append(("DATABASE_URL", passed, msg, "PostgreSQL connection string"))
    if not passed:
        all_passed = False
    
    # Supabase
    passed, msg = check_required("SUPABASE_URL")
    checks.append(("SUPABASE_URL", passed, msg, "Supabase project URL"))
    if not passed:
        all_passed = False
    
    passed, msg = check_required("SUPABASE_ANON_KEY")
    checks.append(("SUPABASE_ANON_KEY", passed, msg, "Supabase anonymous key"))
    if not passed:
        all_passed = False
    
    # OpenAI (required for resume extraction)
    passed, msg = check_required("OPENAI_API_KEY")
    checks.append(("OPENAI_API_KEY", passed, msg, "OpenAI API key for resume extraction"))
    if not passed:
        all_passed = False
    
    # Frontend URL (required for CORS)
    passed, msg = check_url_format("FRONTEND_URL")
    checks.append(("FRONTEND_URL", passed, msg, "Frontend URL for CORS configuration"))
    if not passed:
        all_passed = False
    
    # Debug mode
    passed, msg = check_debug_mode()
    checks.append(("DEBUG", passed, msg, "Debug mode (should be false)"))
    if not passed:
        all_passed = False
    
    # Print results
    for var_name, passed, msg, desc in checks:
        status = f"{GREEN}✓{RESET}" if passed else f"{RED}✗{RESET}"
        print(f"  {status} {var_name:25} {msg}")
        if desc:
            print(f"    {YELLOW}→{RESET} {desc}")
    
    # Optional variables
    print(f"\n{BLUE}Optional Variables:{RESET}\n")
    
    optional_vars = [
        ("SUPABASE_SECRET_KEY", "For admin operations"),
        ("GITHUB_ANALYZER_URL", "GitHub analyzer microservice URL"),
        ("GITHUB_API_TOKEN", "GitHub API token for higher rate limits"),
    ]
    
    for var_name, desc in optional_vars:
        value = os.getenv(var_name, "")
        if value:
            print(f"  {GREEN}✓{RESET} {var_name:25} {GREEN}Set{RESET}")
            print(f"    {YELLOW}→{RESET} {desc}")
        else:
            print(f"  {YELLOW}○{RESET} {var_name:25} {YELLOW}Not set (optional){RESET}")
    
    # Summary
    print(f"\n{BLUE}{'='*60}{RESET}")
    if all_passed:
        print(f"{GREEN}✓ All required variables are configured!{RESET}")
        print(f"{GREEN}Your environment is ready for production.{RESET}\n")
        return 0
    else:
        print(f"{RED}✗ Some required variables are missing or invalid.{RESET}")
        print(f"{YELLOW}Please fix the issues above before deploying to production.{RESET}\n")
        return 1

if __name__ == "__main__":
    sys.exit(main())

