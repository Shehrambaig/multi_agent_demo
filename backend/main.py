# FastAPI server
"""
FastAPI Backend for Multi-Agent Demo
Exposes endpoints for single-agent and multi-agent problem solving
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
    Solve a problem using a simple single agent
    This agent will likely fail on complex problems
    """
    try:
        result = solve_with_single_agent(request.problem)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/solve/multi", response_model=AgentResponse)
async def solve_multi_agent(request: ProblemRequest):
    """
    Solve a problem using multi-agent debate system
    This system should succeed where single agent fails
    """
    # Get API key from request or environment
    api_key = request.openai_api_key or os.getenv("OPENAI_API_KEY")

    if not api_key:
        raise HTTPException(
            status_code=400,
            detail="OpenAI API key required. Provide in request or set OPENAI_API_KEY environment variable."
        )

    try:
        result = solve_with_multi_agent(request.problem, api_key)
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
                "problem": "Sarah has 15 apples. She gives 3 apples to her friend and then buys 8 more apples from the store. After that, she uses half of her apples to make a pie. How many apples does Sarah have left?",
                "correct_answer": "10",
                "why_single_fails": "Single agent will likely just add/subtract numbers without tracking the sequence of operations correctly"
            },
            {
                "id": 2,
                "difficulty": "hard",
                "problem": "A train travels from City A to City B at 60 mph. The return journey from City B to City A takes 3 hours at 80 mph. What is the total distance of the round trip?",
                "correct_answer": "480 miles",
                "why_single_fails": "Single agent struggles with relationships between speed, time, and distance across multiple steps"
            },
            {
                "id": 3,
                "difficulty": "medium",
                "problem": "Tom has twice as many marbles as Jerry. Jerry has 5 more marbles than Bobby. If Bobby has 8 marbles, how many marbles do Tom, Jerry, and Bobby have in total?",
                "correct_answer": "47",
                "why_single_fails": "Single agent doesn't handle transitive relationships well"
            },
            {
                "id": 4,
                "difficulty": "hard",
                "problem": "A rectangular garden is 3 times as long as it is wide. If the perimeter is 96 meters, what is the area of the garden?",
                "correct_answer": "432 square meters",
                "why_single_fails": "Single agent can't set up and solve algebraic relationships"
            }
        ]
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)