from fastapi import APIRouter
from database import content_collection

router = APIRouter()

@router.get('/')
def search_item(query: str):
    results = list(content_collection.find({
        "title": {"$regex": query, "$options": "i"}
    }))
    return {"results": results}
