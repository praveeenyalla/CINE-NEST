import os
import google.generativeai as genai
from fastapi import APIRouter, HTTPException
from database import content_collection
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# Configure Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-pro")

@router.get("/overview")
async def get_dataset_analytics():
    try:
        # Fetch a sample of data for analysis
        # In a real scenario, we'd use aggregation to get stats, 
        # but for "analyzing the dataset" with Gemini, we'll provide metadata and samples.
        
        total_count = content_collection.count_documents({})
        
        # Get platform distribution
        pipeline = [{"$group": {"_id": "$platform", "count": {"$sum": 1}}}]
        platforms = list(content_collection.aggregate(pipeline))
        
        # Get genre distribution (assuming 'genre' field exists)
        genre_pipeline = [
            {"$unwind": "$genre"}, 
            {"$group": {"_id": "$genre", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": 10}
        ]
        # We'll try to get genres, but handle if it fails (e.g. field doesn't exist or is not an array)
        try:
            genres = list(content_collection.aggregate(genre_pipeline))
        except:
            genres = "Field 'genre' not in expected format or missing."

        # Get top rated movies
        top_rated = list(content_collection.find({}, {"_id":0, "title":1, "imdb_rating":1, "platform":1}).sort("imdb_rating", -1).limit(10))

        # Build prompt for Gemini to analyze this metadata
        prompt = f"""
        You are a Data Analyst for an OTT Platform. Analyze the following summary of our movie dataset:
        
        - Total Movies: {total_count}
        - Platform Distribution: {platforms}
        - Top 10 Genres: {genres}
        - Top 10 Rated Movies: {top_rated}
        
        Provide a comprehensive analysis including:
        1. Content saturation per platform.
        2. Quality trends based on IMDb ratings.
        3. Strategic recommendations for content acquisition.
        4. Any interesting patterns you notice.
        
        Keep the analysis professional, insightful, and formatted for a report.
        """
        
        response = model.generate_content(prompt)
        
        return {
            "metadata": {
                "total_count": total_count,
                "platforms": platforms,
                "top_rated_sample": top_rated
            },
            "analysis": response.text
        }
    except Exception as e:
        # If it fails due to auth or other issues, we'll return a helpful error
        raise HTTPException(status_code=500, detail=f"Database analysis failed: {str(e)}")
