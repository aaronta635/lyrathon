from fastapi import APIRouter

api_router = APIRouter()

from app.api import auth, decision_card, resume, applications

api_router.include_router(auth.router, prefix='/auth', tags=['auth'])
api_router.include_router(decision_card.router, prefix='/decision-cards', tags=['decision-cards'])
api_router.include_router(resume.router, prefix='/resume', tags=['resume'])
api_router.include_router(applications.router, prefix='/applications', tags=['applications'])
