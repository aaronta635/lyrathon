import os
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings

def is_allowed_origin(origin: str, frontend_url: str) -> bool:
    """Check if origin is allowed, including Vercel preview deployments"""
    if not origin:
        return False
    
    # Always allow localhost for local development
    if origin.startswith('http://localhost:') or origin.startswith('http://127.0.0.1:'):
        return True
    
    # Allow exact frontend URL match
    if origin == frontend_url:
        return True
    
    # Allow all Vercel preview deployments (*.vercel.app)
    if 'vercel.app' in origin and origin.startswith('https://'):
        return True
    
    return False

def add_middlewares(app):
    # Get frontend URL from environment or config (check both sources)
    frontend_url = os.getenv('FRONTEND_URL', '') or settings.frontend_url
    
    # Strip trailing slash if present (CORS is sensitive to exact URL matching)
    if frontend_url:
        frontend_url = frontend_url.rstrip('/')
    
    # Default origins: allow all in development, restrict in production
    if settings.debug or not frontend_url:
        # Development: allow all origins
        origins = ['*']
        allow_credentials = False  # Can't use credentials with wildcard
    else:
        # Production: use custom origin validator to allow Vercel preview deployments
        # This allows both the production frontend URL and any Vercel preview deployment
        app.add_middleware(
            CORSMiddleware,
            allow_origin_func=lambda origin, state: is_allowed_origin(origin, frontend_url),
            allow_credentials=True,
            allow_methods=['*'],
            allow_headers=['*']
        )
        return  # Early return since middleware is already added
    
    # For development mode (debug=True or no frontend_url)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=allow_credentials,
        allow_methods=['*'],
        allow_headers=['*']
    )
