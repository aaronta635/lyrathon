from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config import settings

# Create engine with connection pooling and lazy connection
# pool_pre_ping=True ensures connections are checked before use
# connect_args with connect_timeout helps with connection issues
db_engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,  # Verify connections before using
    pool_recycle=300,    # Recycle connections after 5 minutes
    connect_args={
        "connect_timeout": 10,  # 10 second connection timeout
    }
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=db_engine)
