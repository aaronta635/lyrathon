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
    
    # App settings
    debug: bool = False

    class Config:
        env_file = ".env"


settings = Settings()
