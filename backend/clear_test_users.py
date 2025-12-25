"""
Quick utility to clear test users from the database.
Run this if you're getting "Email already registered" or "Username already taken" errors.
"""
from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["ott_platform"]
users = db["users"]

# Clear test users (keep admin)
test_patterns = ["test", "debug", "fix@", "new", "browser"]

deleted_count = 0
for pattern in test_patterns:
    result = users.delete_many({
        "$or": [
            {"email": {"$regex": pattern, "$options": "i"}},
            {"username": {"$regex": pattern, "$options": "i"}}
        ]
    })
    deleted_count += result.deleted_count

print(f"✅ Cleared {deleted_count} test user(s) from the database.")
print("You can now sign up with fresh credentials!")
