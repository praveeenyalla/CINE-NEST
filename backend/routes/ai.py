import os
import json
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
from database import content_collection, history_collection, user_collection
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

import google.generativeai as genai

# Configuration
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

client = Groq(api_key=GROQ_API_KEY)
genai.configure(api_key=GOOGLE_API_KEY)
gemini_model = genai.GenerativeModel("gemini-2.0-flash-exp")

class ChatMessage(BaseModel):
    user_email: str
    message: str
    category: Optional[str] = "general"

def get_platform_data():
    """Helper to get platform stats for the AI to analyze"""
    platforms = ["Netflix", "Hulu", "Prime Video", "Disney+"]
    stats = []
    for platform in platforms:
        count = content_collection.count_documents({platform: 1})
        stats.append({"name": platform, "value": count})
    return stats

def get_trending_shows():
    """Returns some hardcoded trending data for analysis if not in DB"""
    return [
        {"title": "Money Heist", "popularity": 98, "interest": 95, "rating": 8.2},
        {"title": "Stranger Things", "popularity": 96, "interest": 92, "rating": 8.7},
        {"title": "The Boys", "popularity": 90, "interest": 88, "rating": 8.7},
        {"title": "Dark", "popularity": 85, "interest": 89, "rating": 8.7},
        {"title": "Arcane", "popularity": 94, "interest": 96, "rating": 9.0},
    ]

def sanitize_response(text: str) -> str:
    """Removes any mention of AI providers for a white-labeled experience"""
    replacements = {
        "Google": "Core",
        "Gemini": "Brain",
        "Groq": "Neural Engine",
        "llama": "Model-X",
        "mixtral": "Model-Y",
        "openai": "AI",
        "ChatGPT": "Assistant"
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
        text = text.replace(old.lower(), new)
    return text

@router.post("/chat")
async def chat_with_ai(chat: ChatMessage):
    try:
        platform_stats = get_platform_data()
        trending = get_trending_shows()
        
        system_prompt = f"""
        You are an advanced Brain Assistant. 
        Data Context: {json.dumps(platform_stats)} | Trending: {json.dumps(trending)}
        
        Guidelines:
        - NEVER mention the names 'Groq', 'Google', 'Gemini', or 'LLM'.
        - Provide high-quality analysis with IMDb ratings.
        - Return ONLY a JSON object.
        """

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": chat.message}
        ]

        try:
            # 1. Primary Attempt with Groq (Fast)
            # Switch to a more stable model ID
            completion = client.chat.completions.create(
                model="llama-3.3-70b-versatile", 
                messages=messages
            )
            content = completion.choices[0].message.content
        except Exception as e:
            # 2. Secondary Attempt with Gemini (Powerful Fallback)
            print(f"Groq failed ({e}), switching to Gemini...")
            gemini_response = gemini_model.generate_content(f"{system_prompt}\nUser Request: {chat.message}")
            content = gemini_response.text

        # Parse and Clean
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0]
        elif "```" in content:
            content = content.split("```")[1].split("```")[0]
            
        try:
            ai_response = json.loads(content.strip())
        except:
            # If not JSON, wrapped it
            ai_response = {"text": content.strip(), "chartData": None, "chartType": None}

        # White-labeling
        ai_response["text"] = sanitize_response(ai_response["text"])

        # Save to history
        history_item = {
            "user_email": chat.user_email,
            "query": chat.message,
            "response": ai_response,
            "timestamp": datetime.utcnow()
        }
        history_collection.insert_one(history_item)

        return ai_response

    except Exception as e:
        print(f"CRITICAL AI ERROR: {str(e)}")
        return {
            "text": "The Brain Engine is currently offline. Please verify API keys in backend configuration.",
            "chartData": platform_stats,
            "chartType": "pie"
        }

@router.get("/history/{user_email}")
async def get_chat_history(user_email: str):
    history = list(history_collection.find({"user_email": user_email}).sort("timestamp", -1).limit(20))
    for item in history:
        item["_id"] = str(item["_id"])
        item["timestamp"] = item["timestamp"].isoformat()
    return history

@router.get("/recommendations")
async def get_special_recommendations(category: str = Query(...)):
    prompt = f"Give me the top analysis and recommendations for category: {category}. Include IMDb ratings and popularity trends. Return as a structured JSON object with text and chartData."
    
    try:
        completion = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        return json.loads(completion.choices[0].message.content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
