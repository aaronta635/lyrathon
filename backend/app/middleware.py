import os
from starlette.middleware.cors import CORSMiddleware
from starlette.requests import Request
from starlette.responses import Response
from starlette.middleware.base import BaseHTTPMiddleware
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

class CustomCORSMiddleware(BaseHTTPMiddleware):
    """Custom CORS middleware that supports dynamic origin validation"""
    
    def __init__(self, app, frontend_url: str):
        super().__init__(app)
        self.frontend_url = frontend_url
    
    async def dispatch(self, request: Request, call_next):
        origin = request.headers.get("origin")
        
        # Handle preflight requests
        if request.method == "OPTIONS":
            response = Response()
            if origin and is_allowed_origin(origin, self.frontend_url):
                response.headers["Access-Control-Allow-Origin"] = origin
                response.headers["Access-Control-Allow-Credentials"] = "true"
                response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, PATCH, OPTIONS"
                response.headers["Access-Control-Allow-Headers"] = "*"
                response.headers["Access-Control-Max-Age"] = "600"
            return response
        
        # Handle actual requests
        response = await call_next(request)
        
        if origin and is_allowed_origin(origin, self.frontend_url):
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
        
        return response

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
        app.add_middleware(
            CORSMiddleware,
            allow_origins=origins,
            allow_credentials=allow_credentials,
            allow_methods=['*'],
            allow_headers=['*']
        )
    else:
        # Production: use custom CORS middleware to allow Vercel preview deployments
        app.add_middleware(CustomCORSMiddleware, frontend_url=frontend_url)
