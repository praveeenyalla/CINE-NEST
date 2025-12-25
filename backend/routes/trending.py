from fastapi import APIRouter
from database import content_collection

router = APIRouter()

@router.get('/')
def trending_items():
    items = list(content_collection.find().sort("views", -1).limit(10))
    return {"trending": items}
