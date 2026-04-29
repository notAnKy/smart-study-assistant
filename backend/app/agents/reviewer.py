from langchain_groq import ChatGroq
from app.config import GROQ_API_KEY
from app.utils.prompt_templates import REVIEWER_PROMPT
import json

llm = ChatGroq(api_key=GROQ_API_KEY, model="llama-3.3-70b-versatile")

def run_reviewer(summary: str, quiz_count: int) -> dict:
    prompt = REVIEWER_PROMPT.format(summary=summary, quiz_count=quiz_count)
    response = llm.invoke(prompt)
    try:
        return json.loads(response.content)
    except:
        return {"score": 7, "feedback": response.content}