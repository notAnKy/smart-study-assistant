from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.config import DATABASE_URL

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def save_session(raw_text: str) -> int:
    with SessionLocal() as db:
        result = db.execute(
            text("INSERT INTO sessions (raw_text) VALUES (:text) RETURNING id"),
            {"text": raw_text}
        )
        db.commit()
        return result.fetchone()[0]

def save_agent_result(session_id: int, agent_name: str, output: str):
    with SessionLocal() as db:
        db.execute(
            text("INSERT INTO agent_results (session_id, agent_name, output) VALUES (:sid, :agent, :output)"),
            {"sid": session_id, "agent": agent_name, "output": output}
        )
        db.commit()

def save_chat_message(session_id: int, role: str, content: str):
    with SessionLocal() as db:
        db.execute(
            text("INSERT INTO chat_messages (session_id, role, content) VALUES (:sid, :role, :content)"),
            {"sid": session_id, "role": role, "content": content}
        )
        db.commit()

def get_chat_history(session_id: int) -> list:
    with SessionLocal() as db:
        result = db.execute(
            text("SELECT role, content FROM chat_messages WHERE session_id = :sid ORDER BY created_at"),
            {"sid": session_id}
        )
        return [{"role": r, "content": c} for r, c in result.fetchall()]
    
def get_all_sessions() -> list:
    with SessionLocal() as db:
        result = db.execute(
            text("""
                SELECT s.id, s.created_at, LEFT(s.raw_text, 120) as preview
                FROM sessions s
                ORDER BY s.created_at DESC
            """)
        )
        rows = result.fetchall()
        return [{"id": r[0], "created_at": str(r[1]), "preview": r[2]} for r in rows]

def get_session_results(session_id: int) -> dict:
    with SessionLocal() as db:
        # Get agent results
        result = db.execute(
            text("SELECT agent_name, output FROM agent_results WHERE session_id = :sid"),
            {"sid": session_id}
        )
        rows = result.fetchall()
        data = {"session_id": session_id}
        import json
        for agent_name, output in rows:
            parsed = json.loads(output)
            if agent_name == "summarizer":
                data["summary"] = parsed.get("summary", "")
                data["key_points"] = parsed.get("key_points", [])
            elif agent_name == "quiz_maker":
                data["quiz"] = parsed
            elif agent_name == "reviewer":
                data["review"] = parsed
        return data
    

def delete_session(session_id: int):
    with SessionLocal() as db:
        db.execute(
            text("DELETE FROM sessions WHERE id = :sid"),
            {"sid": session_id}
        )
        db.commit()