FROM python:3.10
WORKDIR /app

# Copy requirements first for better caching
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy all backend application code to root (copy contents, not the directory)
COPY backend/. ./

# Make start script executable
RUN chmod +x start.sh

# Expose port (Railway will set PORT env var)
EXPOSE 8000

# Run with production settings using start script
CMD ["./start.sh"]

