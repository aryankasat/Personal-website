from fastapi import APIRouter, HTTPException
import config

router = APIRouter()

@router.get("/skills")
async def get_skills():
    try:
        data = config.load_json_data("profile.json")
        return {"skills": data.get("skills", {})}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load skills data: {str(e)}")
