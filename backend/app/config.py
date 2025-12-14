from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Database
    database_url: str = "sqlite:///./test.db"
    
    # Supabase - only need URL and anon key for token verification
    supabase_url: str = ""
    supabase_anon_key: str = ""
    supabase_secret_key: str = ""  # For admin operations if needed
    
    # OpenAI
    openai_api_key: str = ""
    
    # GitHub Analyzer Microservice
    github_analyzer_url: str = ""  # e.g., "https://github-analyzer.their-domain.com"
    
    # GitHub API (for repository verification)
    github_api_token: str = ""  # Optional: Personal Access Token for higher rate limits
    
    # Frontend URL (for CORS)
    frontend_url: str = ""  # e.g., "https://your-frontend.vercel.app"
    
    # App settings
    debug: bool = False

    class Config:
        env_file = ".env"


settings = Settings()
