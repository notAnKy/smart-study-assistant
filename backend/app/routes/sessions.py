from fastapi import APIRouter
from app.services.db import get_all_sessions, get_session_results, delete_session

router = APIRouter()

@router.get("/sessions")
def list_sessions():
    return get_all_sessions()

@router.get("/sessions/{session_id}")
def get_session(session_id: int):
    return get_session_results(session_id)

@router.delete("/sessions/{session_id}")
def remove_session(session_id: int):
    delete_session(session_id)
    return {"success": True}