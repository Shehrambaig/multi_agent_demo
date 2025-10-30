#Simple rule - based agent(fails)
"""
Single Agent - A simple rule-based agent that fails on complex problems
This simulates a small/weak model by using basic pattern matching
"""

import re
from typing import List, Tuple
from models.schemas import ReasoningStep, AgentResponse


class SimpleAgent:
    """A simple rule-based agent that fails on multi-step reasoning"""

    def __init__(self):
        self.reasoning_steps: List[ReasoningStep] = []
        self.step_count = 0

    def add_step(self, content: str):
        """Add a reasoning step"""
        self.step_count += 1
        step = ReasoningStep(
            agent="Simple Agent",
            content=content,
            step_number=self.step_count
        )
        self.reasoning_steps.append(step)

    def extract_numbers(self, text: str) -> List[float]:
        """Extract numbers from text"""
        # Find all numbers (including decimals)
        numbers = re.findall(r'-?\d+\.?\d*', text)
        return [float(n) for n in numbers if n]

    def solve(self, problem: str) -> AgentResponse:
        """
        Attempt to solve the problem using simple pattern matching.
        This agent will fail because it:
        1. Only does basic arithmetic without understanding context
        2. Doesn't handle multi-step reasoning
        3. Gets confused by complex word problems
        """
        self.reasoning_steps = []
        self.step_count = 0

        try:
            self.add_step(f"Analyzing problem: {problem}")

            # Extract all numbers
            numbers = self.extract_numbers(problem)
            self.add_step(f"Found numbers in problem: {numbers}")

            if not numbers:
                self.add_step("ERROR: No numbers found in problem!")
                return AgentResponse(
                    success=False,
                    final_answer="Cannot solve - no numbers found",
                    reasoning_steps=self.reasoning_steps,
                    total_steps=self.step_count,
                    error="No numbers detected"
                )

            # Simple heuristics (these will fail on complex problems)
            problem_lower = problem.lower()

            if 'total' in problem_lower or 'sum' in problem_lower or 'altogether' in problem_lower:
                self.add_step("Detected keywords: 'total/sum/altogether' → Will ADD all numbers")
                result = sum(numbers)
                self.add_step(f"Calculation: {' + '.join(map(str, numbers))} = {result}")

            elif 'difference' in problem_lower or 'more than' in problem_lower or 'less than' in problem_lower:
                self.add_step("Detected keywords: 'difference/more/less' → Will SUBTRACT")
                if len(numbers) >= 2:
                    result = numbers[0] - numbers[1]
                    self.add_step(f"Calculation: {numbers[0]} - {numbers[1]} = {result}")
                else:
                    result = numbers[0]
                    self.add_step(f"Only one number, using: {result}")

            elif 'times' in problem_lower or 'multiply' in problem_lower or 'product' in problem_lower:
                self.add_step("Detected keywords: 'times/multiply/product' → Will MULTIPLY")
                result = 1
                for n in numbers:
                    result *= n
                self.add_step(f"Calculation: {' × '.join(map(str, numbers))} = {result}")

            elif 'divide' in problem_lower or 'half' in problem_lower or 'split' in problem_lower:
                self.add_step("Detected keywords: 'divide/half/split' → Will DIVIDE")
                if len(numbers) >= 2:
                    result = numbers[0] / numbers[1]
                    self.add_step(f"Calculation: {numbers[0]} ÷ {numbers[1]} = {result}")
                else:
                    result = numbers[0] / 2
                    self.add_step(f"Dividing by 2: {numbers[0]} ÷ 2 = {result}")

            else:
                # When confused, just add everything (wrong approach!)
                self.add_step("No clear keywords detected. Defaulting to ADDITION (likely wrong!)")
                result = sum(numbers)
                self.add_step(f"Calculation: {' + '.join(map(str, numbers))} = {result}")

            self.add_step(f"FINAL ANSWER: {result}")

            return AgentResponse(
                success=True,
                final_answer=str(result),
                reasoning_steps=self.reasoning_steps,
                total_steps=self.step_count
            )

        except Exception as e:
            self.add_step(f"ERROR occurred: {str(e)}")
            return AgentResponse(
                success=False,
                final_answer="Error in calculation",
                reasoning_steps=self.reasoning_steps,
                total_steps=self.step_count,
                error=str(e)
            )


def solve_with_single_agent(problem: str) -> AgentResponse:
    """Solve a problem using the simple single agent"""
    agent = SimpleAgent()
    return agent.solve(problem)