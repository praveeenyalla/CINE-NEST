import os
from pymongo import MongoClient

MONGO_URI = "mongodb+srv://praveenyalla2_db_user:yVjclaabvs5U9U3R@cluster0.kdojygr.mongodb.net/?appName=Cluster0"

try:
    # Added tlsAllowInvalidCertificates=True to fix SSL issues on some Windows systems
    client = MongoClient(MONGO_URI, tlsAllowInvalidCertificates=True, serverSelectionTimeoutMS=5000)
    # Trigger a connection check
    client.admin.command('ping')
    print("MongoDB Connected successfully!")
except Exception as e:
    print(f"MongoDB Connection Warning: {e}. Some features may be limited.")
    # Still initialize the client so other parts don't break immediately, 
    # but they will handle failed operations.
    client = MongoClient(MONGO_URI, tlsAllowInvalidCertificates=True)

db = client["ott_database"]
content_collection = db["content"]
user_collection = db["users"]
history_collection = db["history"]

def get_db():
    return db
