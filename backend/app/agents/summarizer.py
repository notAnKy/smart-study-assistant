from langchain_groq import ChatGroq
from app.config import GROQ_API_KEY
from app.utils.prompt_templates import SUMMARIZER_PROMPT
import json

llm = ChatGroq(api_key=GROQ_API_KEY, model="llama-3.3-70b-versatile")

def run_summarizer(text: str) -> dict:
    prompt = SUMMARIZER_PROMPT.format(text=text[:6000])  # limit tokens
    response = llm.invoke(prompt)
    try:
        return json.loads(response.content)
    except:
        return {"summary": response.content, "key_points": []}