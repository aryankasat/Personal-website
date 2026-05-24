from fastapi import APIRouter, HTTPException
import config

router = APIRouter()

@router.get("/publications")
async def get_publications():
    try:
        data = config.load_json_data("profile.json")
        return {"publications": data.get("publications", [])}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load publications data: {str(e)}")
