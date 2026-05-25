from fastapi import APIRouter, HTTPException
import config

router = APIRouter()

@router.get("/profile")
async def get_profile():
    try:
        data = config.load_json_data("profile.json")
        return data.get("profile", {})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load profile data: {str(e)}")

@router.get("/overview")
async def get_overview():
    try:
        data = config.load_json_data("profile.json")
        return data.get("overview", {})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load overview data: {str(e)}")

@router.get("/education")
async def get_education():
    try:
        data = config.load_json_data("profile.json")
        return data.get("education", [])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load education data: {str(e)}")

@router.get("/certifications")
async def get_certifications():
    try:
        data = config.load_json_data("profile.json")
        return data.get("certifications", [])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load certifications data: {str(e)}")

