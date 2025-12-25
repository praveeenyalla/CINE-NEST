from fastapi import APIRouter
from database import content_collection

router = APIRouter()

@router.get('/{platform_name}')
def get_platform_data(platform_name: str):
    data = list(content_collection.find({"platform": platform_name}))
    return {"count": len(data), "items": data}
