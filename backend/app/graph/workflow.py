from langgraph.graph import StateGraph, END
from typing import TypedDict
from app.agents.summarizer import run_summarizer
from app.agents.quiz_maker import run_quiz_maker
from app.agents.reviewer import run_reviewer

# Define the shared state across all agents
class StudyState(TypedDict):
    raw_text: str
    summary: str
    key_points: list
    quiz: list
    review: dict

# Node functions (each agent is a node)
def summarize_node(state: StudyState) -> StudyState:
    result = run_summarizer(state["raw_text"])
    return {**state, "summary": result["summary"], "key_points": result["key_points"]}

def quiz_node(state: StudyState) -> StudyState:
    result = run_quiz_maker(state["raw_text"])
    return {**state, "quiz": result}

def review_node(state: StudyState) -> StudyState:
    result = run_reviewer(state["summary"], len(state["quiz"]))
    return {**state, "review": result}

# Build the graph
def build_workflow():
    graph = StateGraph(StudyState)

    graph.add_node("summarizer", summarize_node)
    graph.add_node("quiz_maker", quiz_node)
    graph.add_node("reviewer", review_node)

    # Define the flow
    graph.set_entry_point("summarizer")
    graph.add_edge("summarizer", "quiz_maker")
    graph.add_edge("quiz_maker", "reviewer")
    graph.add_edge("reviewer", END)

    return graph.compile()

workflow = build_workflow()