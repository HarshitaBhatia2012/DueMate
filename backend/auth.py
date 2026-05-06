import os
import httpx
from typing import Optional, Dict, Any
from jose import JWTError, jwt
from dotenv import load_dotenv

env_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path=env_path)

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

