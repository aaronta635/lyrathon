import os
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings

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
    else:
        # Production: restrict to frontend domain
        origins = [frontend_url]
        # Also allow localhost for testing (optional, only in debug mode)
        if settings.debug:
            origins.append('http://localhost:3000')
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=['*'],
        allow_headers=['*']
    )
