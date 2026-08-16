import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("docuflow.database")

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_NAME = os.getenv("DB_NAME", "docuflow_db")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "rootpassword")

# MySQL URL
MYSQL_DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
# SQLite Fallback URL
SQLITE_DATABASE_URL = "sqlite:///./docuflow.db"

engine = None

# Attempt MySQL connection first
try:
    mysql_engine = create_engine(
        MYSQL_DATABASE_URL, 
        pool_pre_ping=True,
        connect_args={"connect_timeout": 3}
    )
    with mysql_engine.connect() as conn:
        logger.info("Successfully connected to MySQL database engine.")
    engine = mysql_engine
except Exception as e:
    logger.warning(f"MySQL connection failed ({e}). Falling back to local SQLite database (sqlite:///./docuflow.db).")
    engine = create_engine(
        SQLITE_DATABASE_URL, 
        connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
