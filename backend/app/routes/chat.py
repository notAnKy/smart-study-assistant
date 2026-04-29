from fastapi import APIRouter
from pydantic import BaseModel
from app.agents.explainer import run_explainer
from app.services.db import save_chat_message, get_chat_history

router = APIRouter()

class ChatRequest(BaseModel):
    session_id: int
    context: str
    question: str

@router.post("/chat")
def chat_with_explainer(req: ChatRequest):
    # Save user message
    save_chat_message(req.session_id, "user", req.question)

    # Get answer
    answer = run_explainer(req.context, req.question)

    # Save assistant message
    save_chat_message(req.session_id, "assistant", answer)

    return {"answer": answer}

@router.get("/chat/{session_id}/history")
def get_history(session_id: int):
    return get_chat_history(session_id)