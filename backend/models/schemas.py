#pydentic models
from pydantic import BaseModel
from typing import List, Optional

class ReasoningStep(BaseModel):
    """A single step in the reasoning process"""
    agent: str
    content: str
    step_number: int
    timestamp: Optional[str] = None

class AgentResponse(BaseModel):
    """Response from an agent system"""
    success: bool
    final_answer: str
    reasoning_steps: List[ReasoningStep]
    total_steps: int
    error: Optional[str] = None

class ProblemRequest(BaseModel):
    """Request to solve a problem"""
    problem: str
    openai_api_key: Optional[str] = None