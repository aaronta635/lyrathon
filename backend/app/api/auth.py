from fastapi import APIRouter, Depends
from app.auth import get_current_user, SupabaseUser

router = APIRouter()


@router.get("/me")
async def get_me(current_user: SupabaseUser = Depends(get_current_user)):
    """Get the current authenticated user from Supabase token."""
    return {
        "id": current_user.id,
        "email": current_user.email,
        "role": current_user.role
    }

