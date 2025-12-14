#!/bin/bash
# Start script for Railway deployment
# Railway will set the PORT environment variable

# Use PORT if set, otherwise default to 8000
PORT=${PORT:-8000}

# Start the FastAPI application
exec uvicorn app.main:app --host 0.0.0.0 --port $PORT

