from langchain_groq import ChatGroq
from app.config import GROQ_API_KEY
from app.utils.prompt_templates import EXPLAINER_PROMPT

llm = ChatGroq(api_key=GROQ_API_KEY, model="llama-3.3-70b-versatile")

def run_explainer(context: str, question: str) -> str:
    prompt = EXPLAINER_PROMPT.format(context=context[:4000], question=question)
    response = llm.invoke(prompt)
    return response.content