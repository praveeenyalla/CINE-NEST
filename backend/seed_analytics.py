import json
from database import user_analytics_collection, client

def seed_data():
    try:
        with open("new_data.json", "r") as f:
            data = json.load(f)
        
        if user_analytics_collection is not None:
            # Clear existing data to avoid duplicates if re-run
            user_analytics_collection.delete_many({})
            
            result = user_analytics_collection.insert_many(data)
            print(f"✅ Successfully inserted {len(result.inserted_ids)} records into 'user_analytics_data'")
        else:
            print("❌ Database collection not initialized.")
            
    except Exception as e:
        print(f"❌ Error seeding data: {e}")
    finally:
        if client:
            client.close()

if __name__ == "__main__":
    seed_data()
