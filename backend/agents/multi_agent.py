#testing change in branch
#adding more comment
# OpenAI debate agents
"""
Multi-Agent System - Two agents debate to solve complex problems
Agent 1 (Proposer): Proposes solutions and reasoning
Agent 2 (Critic): Critiques and suggests improvements
"""

from openai import OpenAI
from typing import List, Optional
from models.schemas import ReasoningStep, AgentResponse
import re
import json


class DebateAgents:
    """Two agents that debate to reach the correct solution"""

    def __init__(self, api_key: str, max_rounds: int = 3):
        self.client = OpenAI(api_key=api_key)
        self.max_rounds = max_rounds
        self.reasoning_steps: List[ReasoningStep] = []
        self.step_count = 0
        self.model = "gpt-4o"

    def add_step(self, agent: str, content: str):
        """Add a reasoning step"""
        self.step_count += 1
        step = ReasoningStep(
            agent=agent,
            content=content,
            step_number=self.step_count
        )
        self.reasoning_steps.append(step)

    def get_agent_response(self, system_prompt: str, user_message: str) -> str:
        """Get response from OpenAI"""
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                temperature=0.7,
                max_tokens=800
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Error: {str(e)}"

    def solve(self, problem: str) -> AgentResponse:
        """
        Solve problem through multi-agent debate with structured responses
        """
        self.reasoning_steps = []
        self.step_count = 0

        try:
            self.add_step("System", f"Starting multi-agent debate for problem: {problem}")

            # Agent 1: Proposer with structured output requirement
            proposer_system = """You are Agent 1 (Proposer). Your role is to:
1. Carefully analyze math word problems step-by-step
2. Show all your calculations clearly
3. Propose a solution with detailed reasoning
4. CRITICAL: End your response with exactly this format:

   MY PROPOSED ANSWER: [number] [unit]

   Example: MY PROPOSED ANSWER: 10 apples

Be thorough, show your work, and ALWAYS end with "MY PROPOSED ANSWER:" followed by the exact numerical answer."""

            # Agent 2: Critic with structured output requirement
            critic_system = """You are Agent 2 (Critic). Your role is to:
1. Carefully review Agent 1's step-by-step reasoning
2. Verify each calculation
3. Identify any logical errors or mistakes
4. Check if all parts of the problem were addressed
5. CRITICAL: End your response with exactly this format:

   If correct:
   VERDICT: CORRECT
   MY ANSWER: [number] [unit]

   If incorrect:
   VERDICT: INCORRECT
   MY ANSWER: [number] [unit]
   REASON: [brief explanation of the error]

Example if correct: 
VERDICT: CORRECT
MY ANSWER: 10 apples

Example if incorrect:
VERDICT: INCORRECT  
MY ANSWER: 12 apples
REASON: Agent 1 forgot to divide by 2 in the final step

ALWAYS provide a verdict and your calculated answer."""

            agent1_answer = None
            agent2_answer = None
            final_answer = None

            for round_num in range(self.max_rounds):
                self.add_step("System", f"--- Round {round_num + 1} ---")

                # Agent 1 proposes solution
                if round_num == 0:
                    proposer_prompt = f"""Solve this problem step by step:

{problem}

Remember to:
1. Show all your calculations
2. Explain each step clearly
3. End with "MY PROPOSED ANSWER: [number] [unit]" """
                else:
                    proposer_prompt = f"""Agent 2 found an issue with your previous answer.

Agent 2's feedback: {agent2_response}

Please recalculate and provide a corrected solution.

Remember to end with "MY PROPOSED ANSWER: [number] [unit]" """

                agent1_response = self.get_agent_response(proposer_system, proposer_prompt)
                self.add_step("Agent 1 (Proposer)", agent1_response)

                # Extract Agent 1's answer
                agent1_answer = self._extract_structured_answer(agent1_response, "MY PROPOSED ANSWER:")

                # Agent 2 critiques
                critic_prompt = f"""Review Agent 1's solution for this problem:

PROBLEM: {problem}

AGENT 1'S SOLUTION:
{agent1_response}

Verify the solution step-by-step and provide your verdict.

Remember to end with:
VERDICT: [CORRECT or INCORRECT]
MY ANSWER: [number] [unit]"""

                agent2_response = self.get_agent_response(critic_system, critic_prompt)
                self.add_step("Agent 2 (Critic)", agent2_response)

                # Extract Agent 2's answer and verdict
                agent2_answer = self._extract_structured_answer(agent2_response, "MY ANSWER:")
                verdict = self._extract_verdict(agent2_response)

                # Check if agents agree
                if verdict == "CORRECT":
                    self.add_step("System", f"✓ Agents reached consensus! Both agree the answer is: {agent2_answer}")
                    final_answer = agent2_answer
                    break
                else:
                    self.add_step("System",
                                  f"✗ Disagreement - Agent 1: {agent1_answer}, Agent 2: {agent2_answer}. Continuing debate...")

            # If no consensus after max rounds, use Agent 2's last answer (critic is more reliable)
            if final_answer is None:
                self.add_step("System", f"Max rounds reached. Using Agent 2's final answer: {agent2_answer}")
                final_answer = agent2_answer or agent1_answer or "Unable to determine"

            self.add_step("System", f"FINAL ANSWER: {final_answer}")

            return AgentResponse(
                success=True,
                final_answer=final_answer,
                reasoning_steps=self.reasoning_steps,
                total_steps=self.step_count
            )

        except Exception as e:
            self.add_step("System", f"ERROR: {str(e)}")
            return AgentResponse(
                success=False,
                final_answer="Error in multi-agent processing",
                reasoning_steps=self.reasoning_steps,
                total_steps=self.step_count,
                error=str(e)
            )

    def _extract_structured_answer(self, response: str, marker: str) -> str:
        """Extract answer from structured response using marker"""
        # Look for the marker pattern
        pattern = rf'{re.escape(marker)}\s*([0-9,.]+(?:\s+[a-zA-Z]+)?)'
        match = re.search(pattern, response, re.IGNORECASE)

        if match:
            return match.group(1).strip()

        # Fallback: look for answer near end of response
        lines = response.strip().split('\n')
        for line in reversed(lines[-5:]):  # Check last 5 lines
            # Look for number with optional unit
            match = re.search(r'([0-9,.]+(?:\s+[a-zA-Z]+)?)', line)
            if match:
                return match.group(1).strip()

        return "Unable to extract"

    def _extract_verdict(self, response: str) -> str:
        """Extract verdict from Agent 2's response"""
        match = re.search(r'VERDICT:\s*(CORRECT|INCORRECT)', response, re.IGNORECASE)
        if match:
            return match.group(1).upper()

        # Fallback: look for consensus keywords
        response_lower = response.lower()
        if any(word in response_lower for word in ['correct', 'accurate', 'right', 'agree', 'looks good']):
            return "CORRECT"
        elif any(word in response_lower for word in ['incorrect', 'wrong', 'error', 'mistake']):
            return "INCORRECT"

        return "UNCLEAR"


def solve_with_multi_agent(problem: str, api_key: str) -> AgentResponse:
    """Solve a problem using multi-agent debate system"""
    agents = DebateAgents(api_key=api_key, max_rounds=3)
    return agents.solve(problem)