import json
import random
from datetime import datetime
from database import client, db, user_analytics_collection

# --- Configuration ---
# DB_NAME and MONGO_URI are handled by database.py
COLLECTION_NAME = "user_analytics_data"
USERS_FILE = "../users_1000.json"
HISTORY_FILE = "../watch_history.json"

# --- Constants for Enrichment ---
GENRES = ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Romance', 'Thriller', 'Documentary', 'Adventure', 'Fantasy']
AVG_DURATION_MINS = 45  # Assumed average duration per watch count

def load_json(filepath):
    print(f"Loading {filepath}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def transform_date(date_str):
    try:
        if not date_str: return datetime.now()
        return datetime.strptime(date_str, "%Y-%m-%d")
    except ValueError:
        return datetime.now()

def main():
    # 1. Connect to MongoDB (Handled by import)
    # db and user_analytics_collection are already available
    collection = user_analytics_collection

    if collection is None:
        print("Error: Could not get collection from database.py")
        return

    # 2. Load Data
    try:
        users = load_json(USERS_FILE)
        history = load_json(HISTORY_FILE)
    except FileNotFoundError as e:
        print(f"Error: {e}")
        return

    print(f"Loaded {len(users)} users and {len(history)} history records.")

    # 3. Index History by User ID for faster lookup
    history_by_user = {}
    for entry in history:
        uid = entry.get('user_id')
        if not uid: continue
        if uid not in history_by_user:
            history_by_user[uid] = []
        history_by_user[uid].append(entry)

    # 4. Merge and Transform
    merged_data = []
    
    for user in users:
        user_id = user.get('user_id')
        user_history = history_by_user.get(user_id, [])
        
        # Calculate Aggregates
        total_watch_time = 0
        formatted_history = []
        formatted_ratings = []
        
        # Category tracking for preferences
        category_counts = {g: 0 for g in GENRES} 
        
        for h in user_history:
            # Watch Time
            count = h.get('watch_count', 1)
            duration = count * AVG_DURATION_MINS
            total_watch_time += duration
            
            # History Item
            history_item = {
                "title": h.get("Title"),
                "platform": h.get("platform", "Unknown"),
                "date": h.get("watch_date"),
                "watched_duration_mins": duration
            }
            formatted_history.append(history_item)
            
            # Rating Item (if rated)
            rating = h.get("user_rating")
            if rating:
                formatted_ratings.append({
                    "title": h.get("Title"),
                    "rating": rating,
                    "review": "Enjoyed watching this!" if rating >= 4 else "It was okay." if rating == 3 else "Not my type."
                })
            
            # Infer Genre (Randomly assigned for seed since not in source)
            # In a real scenario, we'd lookup the title in a content DB.
            # Here we assign a random genre to "simulate" preferences based on watch history
            assigned_genre = random.choice(GENRES) 
            category_counts[assigned_genre] += 1

        # Determine Top Preferences
        sorted_genres = sorted(category_counts.items(), key=lambda item: item[1], reverse=True)
        top_preferences = [g[0] for g in sorted_genres if g[1] > 0][:3]
        if not top_preferences: top_preferences = random.sample(GENRES, 3)

        # Construct Final Object
        user_doc = {
            "user_id": user_id, # Keep original ID for reference
            "username": user.get("username"),
            "email": user.get("email"),
            "full_name": user.get("username").replace(" ", "").capitalize(), # Simple name derivation
            "joined_date": transform_date(user.get("created_at")),
            "subscription_tier": user.get("subscription_plan", "Free"),
            "preferences": top_preferences,
            "total_watch_time_mins": total_watch_time,
            "history": formatted_history, # Store full history or limit if too large? 
                                        # Storing all for now, as mongo doc limit is 16MB which is plenty for this
            "ratings": formatted_ratings,
            "account_status": "Active",
            "last_login": datetime.now()
        }
        
        merged_data.append(user_doc)

    # 5. Seed Database
    print(f"Preparing to insert {len(merged_data)} records...")
    
    # Clear existing data
    collection.delete_many({})
    print("Cleared existing user_analytics_data collection.")
    
    # Insert new data
    if merged_data:
        collection.insert_many(merged_data)
        print(f"Successfully inserted {len(merged_data)} users into '{COLLECTION_NAME}'.")
    else:
        print("No data to insert.")

if __name__ == "__main__":
    main()
