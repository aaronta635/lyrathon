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
        allow_credentials = False  # Can't use credentials with wildcard
    else:
        # Production: restrict to frontend domain
        origins = [frontend_url]
        # Always allow localhost for local development/testing
        # This won't affect production security since localhost can't be accessed from outside
        origins.extend([
            'http://localhost:3000',
            'http://localhost:3001',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:3001',
        ])
        allow_credentials = True
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=allow_credentials,
        allow_methods=['*'],
        allow_headers=['*']
    )
