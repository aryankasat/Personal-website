from fastapi import APIRouter, HTTPException
import config

router = APIRouter()

@router.get("/experience")
async def get_experience():
    try:
        data = config.load_json_data("experience.json")
        return {"experience": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load experience data: {str(e)}")
