import os
from dotenv import load_dotenv
import google.generativeai as genai
from groq import Groq

load_dotenv()

# Use the keys from ai.py (copy-pasted for this test script)
g_key = os.getenv("GROQ_API_KEY")
gemini_key = os.getenv("GOOGLE_API_KEY")

print("--- Checking Gemini Models ---")
try:
    genai.configure(api_key=gemini_key)
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"Gemini Model: {m.name}")
except Exception as e:
    print(f"Gemini Error: {e}")

print("\n--- Checking Groq Models ---")
try:
    client = Groq(api_key=g_key)
    models = client.models.list()
    for m in models.data:
        print(f"Groq Model: {m.id}")
except Exception as e:
    print(f"Groq Error: {e}")
