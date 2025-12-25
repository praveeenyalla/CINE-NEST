import os
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends, status, Body
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
import bcrypt
from pydantic import BaseModel
from bson import ObjectId
from database import content_collection, user_collection, db
import numpy as np

# Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-super-secret-key-for-ott-platform")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing (replaces passlib for Python 3.13 compatibility)
# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="admin/login")

router = APIRouter()

# --- Models ---
class AdminUser(BaseModel):
    email: str # Changed from EmailStr to allow 'admin' username
    password: str

class ContentItem(BaseModel):
    title: str
    platform: str
    imdb: float
    year: int
    genres: str
    type: str
    views: int = 0

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# --- Helpers ---
def verify_password(plain_password, hashed_password):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password):
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_admin(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    
    admin = db["admins"].find_one({"email": token_data.email})
    if admin is None:
        raise credentials_exception
    return admin

# --- Authentication Endpoints ---

@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_admin(admin: AdminUser):
    """Create a new admin account (Initial setup)"""
    if db["admins"].find_one({"email": admin.email}):
        raise HTTPException(status_code=400, detail="Admin with this email already exists")
    
    hashed_password = get_password_hash(admin.password)
    db["admins"].insert_one({
        "email": admin.email,
        "password": hashed_password,
        "created_at": datetime.utcnow()
    })
    return {"message": "Admin account created successfully"}

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Authenticate admin and return JWT"""
    # Find by email OR username (if username is stored in email field)
    admin = db["admins"].find_one({"email": form_data.username})
    
    if not admin or not verify_password(form_data.password, admin["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": admin["email"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Add default admin on module load or via manual call if needed
def seed_default_admin():
    if not db["admins"].find_one({"email": "admin"}):
        hashed_password = get_password_hash("admin@123")
        db["admins"].insert_one({
            "email": "admin",
            "password": hashed_password,
            "created_at": datetime.utcnow()
        })
        print("Default admin seeded: admin / admin@123")

seed_default_admin()

# --- Content CRUD Endpoints ---

@router.get("/content")
async def get_all_content(admin: dict = Depends(get_current_admin)):
    """Fetch all movie/show records"""
    content = list(content_collection.find())
    for item in content:
        item["_id"] = str(item["_id"])
    return content

@router.post("/content", status_code=status.HTTP_201_CREATED)
async def create_content(item: ContentItem, admin: dict = Depends(get_current_admin)):
    """Add a new movie or show"""
    new_item = item.dict()
    result = content_collection.insert_one(new_item)
    return {"message": "Content created", "id": str(result.inserted_id)}

@router.put("/content/{item_id}")
async def update_content(item_id: str, item: ContentItem, admin: dict = Depends(get_current_admin)):
    """Update existing content by ID"""
    try:
        obj_id = ObjectId(item_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid ID format")
    
    result = content_collection.update_one({"_id": obj_id}, {"$set": item.dict()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Content not found")
    
    return {"message": "Content updated successfully"}

@router.delete("/content/{item_id}")
async def delete_content(item_id: str, admin: dict = Depends(get_current_admin)):
    """Remove content by ID"""
    try:
        obj_id = ObjectId(item_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid ID format")
    
    result = content_collection.delete_one({"_id": obj_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Content not found")
    
    return {"message": "Content deleted successfully"}

# --- User Management Endpoints ---

@router.get("/users")
async def get_all_users(admin: dict = Depends(get_current_admin)):
    """Fetch all registered users"""
    users = list(user_collection.find({}, {"password": 0})) # Don't return passwords
    for user in users:
        user["_id"] = str(user["_id"])
    return users

@router.delete("/user/{user_id}")
async def delete_user(user_id: str, admin: dict = Depends(get_current_admin)):
    """Remove a user by ID"""
    try:
        obj_id = ObjectId(user_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid ID format")
    
    result = user_collection.delete_one({"_id": obj_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": "User deleted successfully"}

# --- Dashboard Stats ---
@router.get("/stats")
async def get_dashboard_stats(admin: dict = Depends(get_current_admin)):
    """Fetch high-level overview stats for dashboard using the JSON dataset and database"""
    # Load dataset for consistent stats
    import os
    import json
    import pandas as pd
    import numpy as np
    import math
    
    JSON_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "final_df_cleaned.json")
    
    if not os.path.exists(JSON_PATH):
        # Fallback to CSV if JSON missing (though user specifically asked for JSON)
        CSV_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "dataset", "final_df_cleaned.csv")
        if os.path.exists(CSV_PATH):
            df = pd.read_csv(CSV_PATH)
        else:
            return {"error": "Dataset not found"}
    else:
        with open(JSON_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
        df = pd.DataFrame(data)

    # Sanitize dataframe to avoid NaN issues
    df['IMDb'] = pd.to_numeric(df['IMDb'], errors='coerce').fillna(0)
    df['Title'] = df['Title'].fillna('Unknown Title')
    df['Genres'] = df['Genres'].fillna('Unknown')
    df['Year'] = pd.to_numeric(df['Year'], errors='coerce').fillna(0)
    
    total_movies = int(len(df))
    
    # Platform counts
    platforms = ["Netflix", "Hulu", "Prime Video", "Disney+"]
    platform_counts = {}
    for p in platforms:
        if p in df.columns:
            count = int(df[df[p] == 1].shape[0])
        else:
            count = 0
        platform_counts[p] = count
        
    # Average IMDb
    avg_imdb = df['IMDb'].mean()
    if pd.isna(avg_imdb) or math.isinf(avg_imdb): 
        avg_imdb = 0.0
    
    # Get total users from database
    total_users = user_collection.count_documents({})

    # User Statistics - Matching image: 4 categories
    userData = [
        {"name": "New Customer", "value": int(total_users * 0.25)},
        {"name": "Existing Subscriber's", "value": int(total_users * 0.45)},
        {"name": "Daily Visitor's", "value": int(total_users * 0.2)},
        {"name": "Extended Subscriber's", "value": int(total_users * 0.1)}
    ]
    # Platform Traffic Timeline (Last 30 days)
    # Simulate daily traffic based on platform popularity (using total content as a proxy for engagement logic)
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=30)
    
    platform_traffic_timeline = []
    current_date = start_date
    
    # Base traffic factors derived from platform counts (normalized)
    total_content_count = sum(platform_counts.values()) or 1
    factors = {k: v/total_content_count for k, v in platform_counts.items()}
    
    while current_date <= end_date:
        # Base daily organic traffic (e.g., 2000 - 5000 visits total)
        daily_base = np.random.randint(2000, 5000)
        
        day_data = {"date": current_date.strftime("%b %d")}
        for p in platforms:
            # Traffic for platform = Base * PlatformShare * RandomVariance
            share = factors.get(p, 0.25)
            # Add some noise (+/- 10%)
            noise = np.random.uniform(0.9, 1.1)
            visits = int(daily_base * share * noise)
            day_data[p] = visits
            
        platform_traffic_timeline.append(day_data)
        current_date += timedelta(days=1)

    # Category Analysis (Top Genres from Dataset)
    genre_series = df['Genres'].str.split(',').explode().str.strip()
    top_genres_counts = genre_series.value_counts().head(7)
    
    categoryData = []
    genres_list = top_genres_counts.index.tolist()
    for genre in genres_list:
        count = int(top_genres_counts[genre])
        this_month = int(count * 0.1)
        last_month = int(count * 0.08)
        categoryData.append({
            "name": str(genre),
            "thisMonth": this_month,
            "lastMonth": last_month
        })

    # Top Category - Matching image: 6 items with trends
    top_6_genres = genre_series.value_counts().head(6)
    topCategoryData = []
    
    genres_6 = top_6_genres.index.tolist()
    trends = ["+24%", "-8%", "+60%", "+44%", "+55%", "+40%"] # Simulating trends from image
    for i, genre in enumerate(genres_6):
        count = int(top_6_genres[genre])
        percentage = round((count / total_movies) * 100, 1) if total_movies > 0 else 0.0
        
        topCategoryData.append({
            "name": str(genre),
            "value": count,
            "percentage": percentage,
            "trend": trends[i % len(trends)]
        })

    # Recent items from DB or Sample from Dataset if DB empty
    top_viewed = list(content_collection.find().sort("views", -1).limit(5))
    if not top_viewed:
        sample = df.sample(min(5, len(df)))
        top_viewed = []
        for _, row in sample.iterrows():
            imdb_val = row['IMDb']
            if pd.isna(imdb_val) or math.isinf(imdb_val): imdb_val = 0.0
            
            # Determine platform string
            avail = []
            if row.get('Netflix') == 1: avail.append('Netflix')
            if row.get('Hulu') == 1: avail.append('Hulu')
            if row.get('Prime Video') == 1: avail.append('Prime Video')
            if row.get('Disney+') == 1: avail.append('Disney+')
            
            top_viewed.append({
                "title": str(row['Title']),
                "platform": ", ".join(avail) if avail else "Other",
                "imdb": float(imdb_val),
                "year": int(row['Year']),
                "genres": str(row['Genres']),
                "type": str(row.get('Type', 'movie')),
                "views": int(np.random.randint(1000, 5000))
            })
    else:
        for item in top_viewed:
            item["_id"] = str(item["_id"])
            if "imdb" in item and (pd.isna(item["imdb"]) or math.isinf(item["imdb"])):
                item["imdb"] = 0.0
            
    return {
        "total_movies": int(total_movies),
        "platform_counts": platform_counts,
        "avg_imdb": round(float(avg_imdb), 2),
        "total_users": int(total_users),
        "userData": userData,
        "categoryData": categoryData,
        "topCategoryData": topCategoryData,
        "top_viewed": top_viewed,
        "top_viewed": top_viewed,
        "platform_traffic_timeline": platform_traffic_timeline
    }

@router.get("/ratings")
async def get_ratings(admin: dict = Depends(get_current_admin)):
    """Fetch top rated movies and simulated 2025 releases"""
    # 1. Top Real Movies (IMDb > 8.0)
    # Using 'Votes' if available, otherwise defaulting to valid count
    cursor = content_collection.find({"imdb": {"$gt": 8.0}}).sort("imdb", -1).limit(10)
    top_rated = []
    for doc in cursor:
        doc["_id"] = str(doc["_id"])
        # Mocking total votes if not present in dataset
        if "votes" not in doc:
            doc["votes"] = np.random.randint(10000, 2000000)
        top_rated.append(doc)

    # 2. Simulated 2025 Movies (Upcoming)
    fake_movies = [
        {"title": "Cyber Horizon", "year": 2025, "imdb": 9.2, "platform": "Netflix", "genres": "Sci-Fi", "thumbnail": "", "type": "movie", "votes": 0},
        {"title": "The Last Starship", "year": 2025, "imdb": 8.9, "platform": "Disney+", "genres": "Adventure", "thumbnail": "", "type": "movie", "votes": 0},
        {"title": "Quantum Paradox", "year": 2025, "imdb": 8.7, "platform": "Prime Video", "genres": "Thriller", "thumbnail": "", "type": "movie", "votes": 0},
        {"title": "Neon Nights 2077", "year": 2025, "imdb": 8.5, "platform": "Hulu", "genres": "Action", "thumbnail": "", "type": "series", "votes": 0},
        {"title": "Mars Colony Alpha", "year": 2025, "imdb": 9.0, "platform": "Netflix", "genres": "Drama", "thumbnail": "", "type": "series", "votes": 0},
    ]
    
    return {"top_rated": top_rated, "upcoming_2025": fake_movies}

@router.get("/comments")
async def get_comments(admin: dict = Depends(get_current_admin)):
    """Generate fake comments from diverse users across platforms"""
    platforms = ["Netflix", "Prime Video", "Hulu", "Disney+"]
    users = [
        {"name": "Wei Zhang", "region": "Asia"},
        {"name": "Priya Patel", "region": "Asia"},
        {"name": "John Smith", "region": "USA"},
        {"name": "Carlos Rodriguez", "region": "Latin America"},
        {"name": "Aiko Tanaka", "region": "Asia"},
        {"name": "Fatima Al-Fayed", "region": "Middle East"},
        {"name": "Sven Mueller", "region": "Europe"},
        {"name": "Kenji Sato", "region": "Asia"},
        {"name": "Rahul Kapoor", "region": "India"},
        {"name": "Min-Jae Kim", "region": "Korea"}
    ]
    comments_list = [
        "Amazing subplot! stunning visuals.",
        "The ending was totally unexpected.",
        "Characters felt a bit shallow, but great action.",
        "Best series of the year so far!",
        "Can't wait for season 2.",
        "Production quality is next level.",
        "A bit slow in the middle, but worth it.",
        "Truly a masterpiece.",
        "Rewatching this for the 3rd time!",
        "Highly recommended for sci-fi fans."
    ]
    
    # Get random movie titles to associate with comments
    cursor = content_collection.aggregate([{"$sample": {"size": 20}}])
    movie_titles = []
    for doc in cursor:
        movie_titles.append(doc.get("title", "Unknown Movie"))

    if not movie_titles:
        movie_titles = ["Inception", "The Matrix", "Interstellar", "Dark", "Stranger Things"]

    generated_comments = []
    for i in range(20):
        u = users[i % len(users)]
        p = platforms[i % len(platforms)]
        c = comments_list[i % len(comments_list)]
        movie = movie_titles[i % len(movie_titles)]
        
        generated_comments.append({
            "id": i,
            "user": u["name"],
            "platform": p,
            "comment": c,
            "movie": movie,
            "rating": round(np.random.uniform(3.5, 5.0), 1),
            "date": (datetime.utcnow() - timedelta(hours=i*2)).strftime("%Y-%m-%d %H:%M")
        })
        
    return generated_comments

@router.get("/auth-users")
async def get_auth_users(admin: dict = Depends(get_current_admin)):
    """Get list of users with simulated linked accounts"""
    # Fetch real users
    cursor = user_collection.find().limit(50)
    users = []
    platforms = ["Netflix", "Prime Video", "Hulu", "Disney+"]
    
    for doc in cursor:
        # Determine status and role randomly for simulation if not in DB
        status = np.random.choice(["Active", "Pending", "Banned"], p=[0.8, 0.1, 0.1])
        role = np.random.choice(["User", "Admin"], p=[0.9, 0.1])
        
        user = {
            "id": str(doc["_id"]),
            "username": doc.get("username", "Unknown"),
            "email": doc.get("email", ""),
            # Simulate password hash visualization
            "password_hash": "****************", 
            # Simulate linked accounts
            "linked": [p for p in platforms if np.random.random() > 0.7],
            "role": role,
            "status": status,
            "origin": "Native" # Or randomly assign external origin
        }
        users.append(user)
        
    return users

@router.get("/content-list")
async def get_advanced_content_list(
    sort_by: str = "year", 
    order: str = "desc", 
    type_filter: str = "all",
    platform_filter: str = "all",
    page: int = 1,
    limit: int = 20,
    search: str = "",
    admin: dict = Depends(get_current_admin)
):
    """Enhanced content list with filtering, sorting, pagination, and search"""
    query = {}
    
    # 1. Type Filter (Movie/Series)
    if type_filter != "all":
        # The dataset uses 'Type' (capital T) or 'type' (lowercase). Handling both or case-insensitive
        query["type"] = type_filter
    
    # 2. Platform Filter
    if platform_filter != "all":
        # Check if field exists and is 1 (e.g. "Netflix": 1)
        # Note: In Mongo, query strictly requires matching field names from dataset (e.g. "Netflix" vs "netflix")
        # Assuming dataset keys are Capitalized like "Netflix", "Prime Video", "Disney+", "Hulu"
        query[platform_filter] = 1

    # 3. Search
    if search:
        query["title"] = {"$regex": search, "$options": "i"}
        
    direction = -1 if order == "desc" else 1
    sort_field = sort_by.lower()
    
    # Map sort_by to actual DB field names if needed
    if sort_field == "year": sort_field = "year" # lowercase in cleaned json?
    elif sort_field == "imdb": sort_field = "imdb"
    elif sort_field == "title": sort_field = "title"

    skip = (page - 1) * limit
    
    total_count = content_collection.count_documents(query)
    cursor = content_collection.find(query).sort(sort_field, direction).skip(skip).limit(limit)
    
    content = []
    for doc in cursor:
        doc["_id"] = str(doc["_id"])
        content.append(doc)
        
    return {
        "data": content,
        "total": total_count,
        "page": page,
        "pages": (total_count // limit) + 1
    }
