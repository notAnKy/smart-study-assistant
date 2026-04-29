from fastapi import APIRouter, UploadFile, File, Form
from app.graph.workflow import workflow
from app.services.file_parser import extract_text
from app.services.db import save_session, save_agent_result
import json

router = APIRouter()

@router.post("/study")
async def run_study_pipeline(
    file: UploadFile = File(None),
    text: str = Form(None)
):
    if file:
        contents = await file.read()
        try:
            raw_text = extract_text(contents, file.filename)
        except ValueError as e:
            return {"error": str(e)}
    elif text:
        raw_text = text
    else:
        return {"error": "Provide a file or text"}

    if not raw_text.strip():
        return {"error": "Could not extract any text from the file."}

    session_id = save_session(raw_text)

    result = workflow.invoke({
        "raw_text": raw_text,
        "summary": "",
        "key_points": [],
        "quiz": [],
        "review": {}
    })

    save_agent_result(session_id, "summarizer", json.dumps({
        "summary": result["summary"],
        "key_points": result["key_points"]
    }))
    save_agent_result(session_id, "quiz_maker", json.dumps(result["quiz"]))
    save_agent_result(session_id, "reviewer", json.dumps(result["review"]))

    return {
        "session_id": session_id,
        "summary": result["summary"],
        "key_points": result["key_points"],
        "quiz": result["quiz"],
        "review": result["review"]
    }