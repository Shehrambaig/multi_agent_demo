# OpenAI debate agents
"""
Multi-Agent System - Two agents debate to solve complex problems
Agent 1 (Proposer): Proposes solutions and reasoning
Agent 2 (Critic): Critiques and suggests improvements
"""

from openai import OpenAI
from typing import List, Optional
from models.schemas import ReasoningStep, AgentResponse


class DebateAgents:
    """Two agents that debate to reach the correct solution"""

    def __init__(self, api_key: str, max_rounds: int = 3):
        self.client = OpenAI(api_key=api_key)
        self.max_rounds = max_rounds
        self.reasoning_steps: List[ReasoningStep] = []
        self.step_count = 0
        self.model = "gpt-4o-mini"  # Using cheaper model for demo

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
                max_tokens=500
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Error: {str(e)}"

    def solve(self, problem: str) -> AgentResponse:
        """
        Solve problem through multi-agent debate:
        1. Agent 1 proposes a solution
        2. Agent 2 critiques it
        3. Agent 1 refines based on critique
        4. Continue until consensus or max rounds
        """
        self.reasoning_steps = []
        self.step_count = 0

        try:
            self.add_step("System", f"Starting multi-agent debate for problem: {problem}")

            # Agent 1: Proposer
            proposer_system = """You are Agent 1 (Proposer). Your role is to:
1. Carefully analyze math word problems
2. Break down the problem step-by-step
3. Propose a solution with clear reasoning
4. Be open to criticism and refine your approach

Be thorough and show your work clearly."""

            # Agent 2: Critic
            critic_system = """You are Agent 2 (Critic). Your role is to:
1. Carefully review Agent 1's reasoning
2. Identify any logical errors or mistakes
3. Check if all parts of the problem were addressed
4. Suggest improvements or confirm if the solution is correct

Be constructive and specific in your feedback."""

            conversation_history = ""
            final_answer = None

            for round_num in range(self.max_rounds):
                self.add_step("System", f"--- Round {round_num + 1} ---")

                # Agent 1 proposes or refines
                if round_num == 0:
                    proposer_prompt = f"Solve this problem step by step:\n\n{problem}\n\nShow your reasoning clearly."
                else:
                    proposer_prompt = f"Based on Agent 2's feedback, refine your solution:\n\n{conversation_history}"

                agent1_response = self.get_agent_response(proposer_system, proposer_prompt)
                self.add_step("Agent 1 (Proposer)", agent1_response)
                conversation_history += f"\n\nAgent 1's response:\n{agent1_response}"

                # Agent 2 critiques
                critic_prompt = f"Review Agent 1's solution for this problem:\n\nProblem: {problem}\n\n{conversation_history}\n\nProvide feedback: Is it correct? Any errors? Should anything be improved?"

                agent2_response = self.get_agent_response(critic_system, critic_prompt)
                self.add_step("Agent 2 (Critic)", agent2_response)
                conversation_history += f"\n\nAgent 2's feedback:\n{agent2_response}"

                # Check if Agent 2 confirms correctness
                if any(phrase in agent2_response.lower() for phrase in [
                    "correct", "looks good", "well done", "accurate",
                    "solution is right", "i agree", "no errors"
                ]):
                    self.add_step("System", "Agents reached consensus!")
                    # Extract final answer from Agent 1's last response
                    final_answer = self._extract_final_answer(agent1_response)
                    break

            # If no consensus, use last proposal
            if final_answer is None:
                self.add_step("System", "Max rounds reached. Using Agent 1's final proposal.")
                final_answer = self._extract_final_answer(agent1_response)

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

    def _extract_final_answer(self, response: str) -> str:
        """Extract the numerical answer from agent's response"""
        import re

        # Look for common answer patterns
        patterns = [
            r'final answer[:\s]+([0-9,.]+)',
            r'answer[:\s]+([0-9,.]+)',
            r'therefore[,\s]+([0-9,.]+)',
            r'result[:\s]+([0-9,.]+)',
            r'=\s*([0-9,.]+)',
        ]

        for pattern in patterns:
            match = re.search(pattern, response.lower())
            if match:
                return match.group(1)

        # Fallback: find last number in response
        numbers = re.findall(r'[0-9,.]+', response)
        if numbers:
            return numbers[-1]

        return "Unable to extract answer"


def solve_with_multi_agent(problem: str, api_key: str) -> AgentResponse:
    """Solve a problem using multi-agent debate system"""
    agents = DebateAgents(api_key=api_key, max_rounds=3)
    return agents.solve(problem)