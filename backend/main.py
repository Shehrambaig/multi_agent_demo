"""
FastAPI Backend for Multi-Agent Demo
Exposes endpoints for single-agent and multi-agent problem solving
All API keys are read from .env file
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models.schemas import ProblemRequest, AgentResponse
from agents.single_agent import solve_with_single_agent
from agents.multi_agent import solve_with_multi_agent
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Multi-Agent Demo API")

# CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    """Health check endpoint"""
    return {
        "status": "running",
        "message": "Multi-Agent Demo API",
        "endpoints": {
            "single_agent": "/api/solve/single",
            "multi_agent": "/api/solve/multi"
        }
    }

@app.post("/api/solve/single", response_model=AgentResponse)
async def solve_single_agent(request: ProblemRequest):
    """
    Solve a problem using a small model (Qwen2.5-0.5B from Hugging Face)
    The API key is read from the .env file on the backend
    """
    # Get Hugging Face API key from environment
    hf_api_key = os.getenv("HUGGINGFACE_API_KEY")

    if not hf_api_key or hf_api_key == "your_huggingface_api_key_here":
        raise HTTPException(
            status_code=500,
            detail="HUGGINGFACE_API_KEY not configured. Please set it in the .env file on the server."
        )

    try:
        result = solve_with_single_agent(request.problem, hf_api_key)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/solve/multi", response_model=AgentResponse)
async def solve_multi_agent(request: ProblemRequest):
    """
    Solve a problem using multi-agent debate system
    The API key is read from the .env file on the backend
    """
    # Get OpenAI API key from environment
    openai_api_key = os.getenv("OPENAI_API_KEY")

    if not openai_api_key or openai_api_key == "your_openai_api_key_here":
        raise HTTPException(
            status_code=500,
            detail="OPENAI_API_KEY not configured. Please set it in the .env file on the server."
        )

    try:
        result = solve_with_multi_agent(request.problem, openai_api_key)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/sample-problems")
async def get_sample_problems():
    """Get sample problems that demonstrate the difference"""
    return {
        "problems": [
            {
                "id": 1,
                "difficulty": "medium",
                "problem": "A meal costs €97. You pay €100, get €3 back, and tip €2. But your spending is confusingly calculated. What’s the real expense?",
                "correct_answer": "10",
                "why_single_fails": "Small model struggles with tracking sequential operations correctly"
            },
            {
                "id": 2,
                "difficulty": "hard",
                "problem": "A train travels from City A to City B at 60 mph. The return journey from City B to City A takes 3 hours at 80 mph. What is the total distance of the round trip?",
                "correct_answer": "480 miles",
                "why_single_fails": "Small model struggles with relationships between speed, time, and distance across multiple steps"
            },
            {
                "id": 3,
                "difficulty": "medium",
                "problem": "Tom has twice as many marbles as Jerry. Jerry has 5 more marbles than Bobby. If Bobby has 8 marbles, how many marbles do Tom, Jerry, and Bobby have in total?",
                "correct_answer": "47",
                "why_single_fails": "Small model doesn't handle transitive relationships well"
            },
            {
                "id": 4,
                "difficulty": "hard",
                "problem": "A rectangular garden is 3 times as long as it is wide. If the perimeter is 96 meters, what is the area of the garden?",
                "correct_answer": "432 square meters",
                "why_single_fails": "Small model may struggle with setting up algebraic relationships"
            },
            {
                "id": 5,
                "difficulty": "hard",
                "problem": "A stock price starts at $50. On Monday it increases by 20%. On Tuesday it decreases by 15%. On Wednesday it increases by 10%. What is the final stock price?",
                "correct_answer": "$56.10",
                "why_single_fails": "Small model compounds percentages incorrectly"
            }
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)