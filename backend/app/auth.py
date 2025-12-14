from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import httpx
from pydantic import BaseModel
from typing import Optional
from app.config import settings


security = HTTPBearer()


class SupabaseUser(BaseModel):
    id: str
    email: Optional[str] = None
    role: Optional[str] = None


async def verify_supabase_token(token: str) -> dict:
    """
    Verify a Supabase JWT token by calling Supabase's auth API.
    
    This approach works regardless of which signing key Supabase uses
    (Legacy HS256 or new ECC keys) because Supabase verifies the token.
    """
    supabase_url = settings.supabase_url
    
    if not supabase_url:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Supabase URL not configured",
        )
    
    # Call Supabase to verify the token and get user info
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{supabase_url}/auth/v1/user",
                headers={
                    "Authorization": f"Bearer {token}",
                    "apikey": settings.supabase_anon_key,
                }
            )
            
            if response.status_code == 401:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid or expired token",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail=f"Token verification failed: {response.text}",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            
            return response.json()
            
        except httpx.RequestError as e:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Could not verify token: {str(e)}",
            )


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> SupabaseUser:
    """
    Dependency that extracts and validates the current user from the JWT.
    
    Use this in your route handlers:
        @router.get("/protected")
        async def protected_route(user: SupabaseUser = Depends(get_current_user)):
            return {"user_id": user.id}
    """
    token = credentials.credentials
    user_data = await verify_supabase_token(token)
    
    user_id = user_data.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token: missing user ID",
        )
    
    # Get role from user metadata or app_metadata
    role = user_data.get("role")
    if not role:
        app_metadata = user_data.get("app_metadata", {})
        role = app_metadata.get("role")
    
    return SupabaseUser(
        id=user_id,
        email=user_data.get("email"),
        role=role
    )


async def get_current_admin_user(
    user: SupabaseUser = Depends(get_current_user)
) -> SupabaseUser:
    """
    Dependency that requires the user to have admin role.
    
    You can set user roles in Supabase Dashboard > Authentication > Users
    or via the Supabase Admin API by setting app_metadata.role = "admin"
    """
    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return user
