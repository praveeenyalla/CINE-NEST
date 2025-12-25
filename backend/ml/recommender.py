import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MinMaxScaler, normalize
from database import content_collection

class Recommender:
    def __init__(self):
        self.df = None
        self.similarity_matrix = None
        self.load_data()

    def load_data(self):
        """Load movie dataset from JSON and build similarity matrix"""
        try:
            import os
            import json
            
            # Resolve path to the JSON dataset
            JSON_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "final_df_cleaned.json")
            
            if not os.path.exists(JSON_PATH):
                print(f"Warning: Dataset file not found at {JSON_PATH}")
                self.df = pd.DataFrame()
                return

            with open(JSON_PATH, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            if not data:
                print("Warning: Dataset is empty. Recommendation engine failed to load.")
                self.df = pd.DataFrame()
                return

            self.df = pd.DataFrame(data)
            
            # Preprocessing fields into vectors
            # 1. Genre similarity (40%) - Multi-hot encoding
            self.df['Genres'] = self.df['Genres'].fillna('')
            genre_matrix = self.df['Genres'].str.get_dummies(sep=',')
            genre_matrix_norm = normalize(genre_matrix)
            
            # 2. IMDb similarity (30%) - Scaling scores
            scaler = MinMaxScaler()
            self.df['IMDb'] = pd.to_numeric(self.df['IMDb'], errors='coerce').fillna(0)
            imdb_scaled = scaler.fit_transform(self.df['IMDb'].values.reshape(-1, 1))
            
            # 3. Platform similarity (20%) - Multi-hot
            platforms = ['Netflix', 'Hulu', 'Prime Video', 'Disney+']
            for p in platforms:
                if p not in self.df.columns:
                    self.df[p] = 0
                self.df[p] = pd.to_numeric(self.df[p], errors='coerce').fillna(0).astype(int)
            
            platform_matrix = self.df[platforms].values
            platform_matrix_norm = normalize(platform_matrix) if platform_matrix.any() else platform_matrix
            
            # 4. Year proximity (10%) - Scaling release year
            self.df['Year'] = pd.to_numeric(self.df['Year'], errors='coerce').fillna(0)
            year_scaled = scaler.fit_transform(self.df['Year'].values.reshape(-1, 1))
            
            # Combine weighted features
            v_genre = genre_matrix_norm * np.sqrt(0.40)
            v_imdb = imdb_scaled * np.sqrt(0.30)
            v_platform = platform_matrix_norm * np.sqrt(0.20)
            v_year = year_scaled * np.sqrt(0.10)
            
            combined_features = np.hstack([v_genre, v_imdb, v_platform, v_year])
            
            # Generate similarity matrix
            self.similarity_matrix = cosine_similarity(combined_features)
            print(f"Successfully loaded recommendation engine with {len(self.df)} items from JSON.")
            
        except Exception as e:
            print(f"Error initializing recommender: {str(e)}")
            self.df = pd.DataFrame()

    def get_recommendations(self, title: str, limit: int = 10):
        """Return top N recommended movies based on similarity score"""
        if self.df is None or self.df.empty or self.similarity_matrix is None:
            return []
        
        # Primary search: Exact match (case-insensitive)
        indices = self.df.index[self.df['Title'].str.lower() == title.lower()].tolist()
        
        # Fallback: Substring match
        if not indices:
            indices = self.df.index[self.df['Title'].str.contains(title, case=False, na=False)].tolist()
        
        if not indices:
            return [] # Title not found
            
        # Use only the first match found
        idx = indices[0]
        
        # Get similarity scores for this movie index
        sim_scores = list(enumerate(self.similarity_matrix[idx]))
        
        # Sort by similarity score descending
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        
        # Filter out the title itself and take top 'limit' results
        recommendations = []
        for i, score in sim_scores:
            if i == idx: continue
            if len(recommendations) >= limit: break
            
            row = self.df.iloc[i]
            # Consolidate platform availability
            available_platforms = [p for p in ['Netflix', 'Hulu', 'Prime Video', 'Disney+'] if row.get(p) == 1]
            
            recommendations.append({
                "title": row.get('Title', 'Unknown'),
                "platform": ", ".join(available_platforms) if available_platforms else "None",
                "imdb_rating": float(row.get('IMDb', 0)),
                "release_year": int(row.get('Year', 0)),
                "similarity_score": round(float(score) * 100, 2)
            })
            
        return recommendations

# Initialize once into memory (Singleton pattern as requested)
engine = Recommender()

def get_recommendations(title: str, limit: int = 10):
    return engine.get_recommendations(title, limit)
