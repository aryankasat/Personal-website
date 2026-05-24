from fastapi import APIRouter, HTTPException, Query
from typing import Optional
import config

router = APIRouter()

@router.get("/projects")
async def get_projects(
    category: Optional[str] = Query(None, description="Filter projects by category"),
    tech: Optional[str] = Query(None, description="Filter projects by technology used")
):
    try:
        data = config.load_json_data("profile.json")
        projects = data.get("projects", [])
        
        # Apply filters if provided
        if category:
            projects = [p for p in projects if p.get("category", "").lower() == category.lower()]
            
        if tech:
            projects = [
                p for p in projects 
                if any(t.lower() == tech.lower() for t in p.get("technologies", []))
            ]
            
        return {"projects": projects}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load projects data: {str(e)}")
