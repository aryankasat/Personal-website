from fastapi import APIRouter, HTTPException, Path
import config

router = APIRouter()

@router.get("/blogs")
async def get_blogs():
    try:
        data = config.load_json_data("blogs.json")
        # Return summary listing (excluding large full contents if we want, or simple list)
        return {"blogs": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load blogs: {str(e)}")

@router.get("/blogs/{blog_id}")
async def get_blog_by_id(blog_id: int = Path(..., title="The ID of the blog to get")):
    try:
        data = config.load_json_data("blogs.json")
        blog = next((b for b in data if b.get("id") == blog_id), None)
        if not blog:
            raise HTTPException(status_code=404, detail="Blog article not found")
        return blog
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load blog details: {str(e)}")

@router.get("/system-designs")
async def get_system_designs():
    try:
        data = config.load_json_data("system_designs.json")
        return {"system_designs": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load system designs: {str(e)}")

@router.get("/system-designs/{design_id}")
async def get_system_design_by_id(design_id: int = Path(..., title="The ID of the system design to get")):
    try:
        data = config.load_json_data("system_designs.json")
        design = next((d for d in data if d.get("id") == design_id), None)
        if not design:
            raise HTTPException(status_code=404, detail="System design article not found")
        return design
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load system design details: {str(e)}")
