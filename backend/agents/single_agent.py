"""
Single Agent - Using Small Model from Hugging Face Router
This uses a small parameter model that will struggle with complex reasoning
"""

import requests
import os
from typing import List
from models.schemas import ReasoningStep, AgentResponse


class SmallModelAgent:
    """A single agent powered by a small model from Hugging Face Router"""

    def __init__(self, api_key: str):
        """Initialize the small model agent with Hugging Face API key"""
        if not api_key or api_key == "your_huggingface_api_key_here":
            raise ValueError("Please set a valid HUGGINGFACE_API_KEY in your .env file")

        self.api_key = api_key
        self.api_url = "https://router.huggingface.co/v1/chat/completions"
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

        # Use a small model that will struggle with complex reasoning
        # You can change this to other small models
        self.model = "katanemo/Arch-Router-1.5B:hf-inference"
        # Alternative small models to try:
        # self.model = "google/gemma-2b-it"
        # self.model = "microsoft/phi-2"

        self.reasoning_steps: List[ReasoningStep] = []
        self.step_count = 0

    def add_step(self, agent: str, content: str):
        """Add a reasoning step"""
        self.step_count += 1
        step = ReasoningStep(
            agent=agent,
            content=content,
            step_number=self.step_count
        )
        self.reasoning_steps.append(step)

    def query_model(self, messages: List[dict]) -> dict:
        """Query Hugging Face Router API"""
        payload = {
            "model": self.model,
            "messages": messages,
            "max_tokens": 500,
            "temperature": 0.7
        }

        try:
            response = requests.post(
                self.api_url,
                headers=self.headers,
                json=payload,
                timeout=60
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.HTTPError as e:
            raise Exception(f"API Error: {e.response.status_code} - {e.response.text}")
        except requests.exceptions.Timeout:
            raise Exception("Request timed out")
        except Exception as e:
            raise Exception(f"Error querying model: {str(e)}")

    def solve(self, problem: str) -> AgentResponse:
        """
        Solve the problem using a small model.
        This is a very small model that will struggle
        with complex multi-step reasoning problems.
        """
        self.reasoning_steps = []
        self.step_count = 0

        try:
            self.add_step("Small Model Agent", f"Received problem: {problem}")

            # Create messages for the chat API
            messages = [
                {
                    "role": "system",
                    "content": "You are a math problem solver. Solve problems step by step and show your reasoning clearly. Always end your response with 'FINAL ANSWER: [number]'"
                },
                {
                    "role": "user",
                    "content": f"Solve this math problem step by step:\n\n{problem}\n\nRemember to show your work and end with 'FINAL ANSWER: [number]'"
                }
            ]

            self.add_step("Small Model Agent", f"Sending problem to {self.model}...")

            # Call Hugging Face Router API
            response = self.query_model(messages)

            # Extract response text
            if "choices" in response and len(response["choices"]) > 0:
                response_text = response["choices"][0]["message"]["content"]
            else:
                raise Exception(f"Unexpected response format: {response}")

            self.add_step("Small Model Agent", "Received response from model")

            # Add the model's reasoning as steps
            if response_text:
                lines = response_text.strip().split('\n')
                for line in lines:
                    if line.strip():
                        self.add_step("Small Model Agent", line.strip())

            # Extract the final answer
            final_answer = self._extract_answer(response_text)

            self.add_step("Small Model Agent", f"Extracted Answer: {final_answer}")

            return AgentResponse(
                success=True,
                final_answer=final_answer,
                reasoning_steps=self.reasoning_steps,
                total_steps=self.step_count
            )

        except Exception as e:
            self.add_step("Small Model Agent", f"ERROR: {str(e)}")
            return AgentResponse(
                success=False,
                final_answer="Error occurred",
                reasoning_steps=self.reasoning_steps,
                total_steps=self.step_count,
                error=str(e)
            )

    def _extract_answer(self, response: str) -> str:
        """Extract the numerical answer from model's response"""
        import re

        if not response:
            return "No response"

        # Look for "FINAL ANSWER:" pattern first (most reliable)
        match = re.search(r'FINAL ANSWER:\s*([0-9,.]+(?:\s+\w+)?)', response, re.IGNORECASE)
        if match:
            return match.group(1).strip()

        # Look for other common answer patterns
        patterns = [
            r'(?:the answer is|answer:|result:|total:)\s*([0-9,.]+)',
            r'(?:therefore|thus|so),?\s+(?:the answer is|there (?:are|is))\s*([0-9,.]+)',
            r'(?:=|equals)\s*([0-9,.]+)\s*(?:apples|marbles|meters|miles|dollars|$)?',
        ]

        response_lower = response.lower()
        for pattern in patterns:
            match = re.search(pattern, response_lower)
            if match:
                return match.group(1)

        # Fallback: find the last number mentioned in the response
        numbers = re.findall(r'\b([0-9,.]+)\b', response)
        if numbers:
            # Return the last number (likely the final answer)
            return numbers[-1]

        return "Unable to extract answer"


def solve_with_single_agent(problem: str, api_key: str) -> AgentResponse:
    """Solve a problem using the small model single agent"""
    agent = SmallModelAgent(api_key)
    return agent.solve(problem)