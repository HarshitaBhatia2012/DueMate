import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Define the path to the .env file in the backend directory
env_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path=env_path)

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# Automatic database creation logic
def create_db_if_not_exists():
    from sqlalchemy import create_engine
    from sqlalchemy_utils import database_exists, create_database
    # Extract the base URL without the DB name
    # Example: mysql+pymysql://root:password@localhost/duemate -> mysql+pymysql://root:password@localhost/
    if not database_exists(SQLALCHEMY_DATABASE_URL):
        create_database(SQLALCHEMY_DATABASE_URL)
        print(f"Database 'duemate' created successfully.")

# Note: sqlalchemy-utils is needed for this, but we can also do it with raw SQL
# Let's use a simpler method since we already have pymysql
import pymysql

def ensure_db_exists():
    try:
        url = SQLALCHEMY_DATABASE_URL.replace("mysql+pymysql://", "")
        auth, rest = url.split("@")
        user, password = auth.split(":")
        host_port, db_name = rest.split("/")
        host = host_port.split(":")[0]
        
        print(f"Attempting to connect to MySQL at {host} as {user}...")
        connection = pymysql.connect(host=host, user=user, password=password)
        try:
            with connection.cursor() as cursor:
                cursor.execute(f"CREATE DATABASE IF NOT EXISTS {db_name}")
                print(f"Database '{db_name}' ensured.")
            connection.commit()
        finally:
            connection.close()
    except Exception as e:
        print(f"CRITICAL: Failed to ensure database existence: {e}")

ensure_db_exists()

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
