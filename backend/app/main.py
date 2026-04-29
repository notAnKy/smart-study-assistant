from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import study, chat, sessions

app = FastAPI(title="Smart Study Assistant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(study.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(sessions.router, prefix="/api")

@app.get("/")
def root():
    return {"status": "Study Assistant API is running 🚀"}