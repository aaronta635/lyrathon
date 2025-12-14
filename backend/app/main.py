from fastapi import FastAPI
from app.api import api_router
from app.middleware import add_middlewares
from app.database import db_engine
from app.models import Base

app = FastAPI()
add_middlewares(app)
Base.metadata.create_all(bind=db_engine)
app.include_router(api_router, prefix='/api')

@app.get('/')
def root():
    return {'message': 'Enhanced FastAPI App'}


@app.get('/health')
def health_check():
    """Health check endpoint for monitoring."""
    from app.database import db_engine
    from sqlalchemy import text
    
    try:
        # Test database connection
        with db_engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception:
        db_status = "disconnected"
    
    return {
        "status": "healthy" if db_status == "connected" else "degraded",
        "database": db_status,
        "service": "lyrathon-backend"
    }