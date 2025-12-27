# CINE NEST - AI-Powered OTT Platform

[![Netlify Status](https://api.netlify.com/api/v1/badges/0f1e542c-8209-4c97-b692-55452b40986a/deploy-status)](https://app.netlify.com/projects/cinenestai/deploys)

## Overview
CINE NEST is a next-generation OTT (Over-The-Top) streaming platform that leverages Artificial Intelligence to provide personalized content recommendations and deep user analytics. Built with a modern tech stack, it offers a premium user experience for both viewers and administrators.

## Key Features

### For Users
- **AI-Curated Content**: Personalized recommendations based on viewing history and preferences.
- **Smart Search**: Find movies and shows instantly.
- **User Analytics Dashboard**: View your own watch history, favorite genres, and engagement metrics.
- **Responsive Design**: Seamless experience across all devices.

### For Admins
- **Comprehensive Dashboard**: Real-time overview of platform performance.
- **User Intelligence**: Detailed analytics on user behavior, including:
    - 1000+ Synthetic User Records generated for testing.
    - Deep dive into individual user history and ratings.
    - Filters for Platform, Category, and User Search.
- **Content Management**: Manage movies, series, and metadata.

## Tech Stack
- **Frontend**: Next.js, React, TailwindCSS, Recharts
- **Backend**: Python FastAPI
- **Database**: MongoDB
- **Authentication**: JWT / Firebase (hybrid support)

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- MongoDB installed and running locally on port 27017

### Installation & Run

1.  **Clone the Repository**
    ```bash
    git clone <repository-url>
    cd OTT_WEBSITE
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    pip install -r requirements.txt
    
    # Generate Synthetic User Data (Optional - Data is already provided)
    python generate_syn_data.py
    
    # Seed Database
    python seed_analytics.py
    
    # Run Server
    uvicorn main:app --reload --port 8000
    ```

3.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

4.  **Access the Application**
    - **Frontend**: http://localhost:3000
    - **Backend API**: http://localhost:8000/docs (Swagger UI)

## Project Structure
- `backend/`: FastAPI application, routes, and database logic.
- `frontend/`: Next.js application, components, and pages.
- `new_data.json`: Synthetic dataset of 1000 users.

## Synthetic Data Generation
We have included a script `backend/generate_syn_data.py` that generates realistic user profiles, watch history, and ratings using real names and content titles. This data is seeded into MongoDB for the Admin User Analytics view.

---
&copy; 2025 CINE NEST.
