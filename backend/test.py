import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv('GEMINI_API_KEY')

if not api_key:
    print("Error: GEMINI_API_KEY not found")
    exit(1)

genai.configure(api_key=api_key)

print("Checking if gemma-3-27b-it is available...\n")

try:
    model = genai.GenerativeModel('gemma-3-1b-it')
    response = model.generate_content("Say hello")
    print("SUCCESS! gemma-3-27b-it is available!")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"FAILED: {e}\n")
    print("Available models:")
    print("-" * 60)
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"  - {m.name}")
            if 'gemma' in m.name.lower():
                print("    ^ This is a Gemma model!")