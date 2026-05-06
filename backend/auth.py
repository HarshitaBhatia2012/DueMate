import os
import httpx
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import JWTError, jwt
from passlib.context import CryptContext
from dotenv import load_dotenv

# Define the path to the .env file in the backend directory
env_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path=env_path)

# Password hashing configuration
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT configuration (Legacy)
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# Clerk configuration
CLERK_JWKS_URL = os.getenv("CLERK_JWKS_URL")
CLERK_FRONTEND_API = os.getenv("CLERK_FRONTEND_API")

# JWKS Cache
_jwks_cache: Optional[Dict[str, Any]] = None

async def get_jwks():
    global _jwks_cache
    if _jwks_cache is None:
        async with httpx.AsyncClient() as client:
            response = await client.get(CLERK_JWKS_URL)
            response.raise_for_status()
            _jwks_cache = response.json()
    return _jwks_cache

async def verify_clerk_token(token: str) -> Dict[str, Any]:
    jwks = await get_jwks()
    try:
        # The Clerk audience (aud) is usually the Frontend API URL
        # The issuer (iss) is the Frontend API URL (with https://)
        payload = jwt.decode(
            token, 
            jwks, 
            algorithms=["RS256"], 
            audience=CLERK_FRONTEND_API,
            issuer=f"https://{CLERK_FRONTEND_API}"
        )
        return payload
    except JWTError as e:
        print(f"JWT Verification Error: {e}")
        raise e

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

