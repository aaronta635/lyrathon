from fastapi.middleware.cors import CORSMiddleware
import os

def add_middlewares(app):
    # Get frontend URL from environment
    frontend_url = os.getenv('FRONTEND_URL', '').rstrip('/')
    
    # If frontend URL is set, use it; otherwise allow all origins (but without credentials)
    if frontend_url:
        origins = [frontend_url, 'http://localhost:3000', 'http://localhost:3001']
        allow_credentials = True
    else:
        # Allow all origins but without credentials (CORS limitation)
        origins = ['*']
        allow_credentials = False
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=allow_credentials,
        allow_methods=['*'],
        allow_headers=['*']
    )
