from fastapi import APIRouter, HTTPException, Path
import config
import re

router = APIRouter()

def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s-]+', '-', text)
    return text.strip('-')

@router.get("/blogs")
async def get_blogs():
    try:
        data = config.load_json_data("blogs.json")
        for b in data:
            b["slug"] = slugify(b.get("title", ""))
        return {"blogs": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load blogs: {str(e)}")

@router.get("/blogs/{identifier}")
async def get_blog_by_id(identifier: str = Path(..., title="The ID or slug of the blog to get")):
    try:
        data = config.load_json_data("blogs.json")
        blog = None
        for b in data:
            if slugify(b.get("title", "")) == identifier or (identifier.isdigit() and b.get("id") == int(identifier)):
                blog = b
                break
        if not blog:
            raise HTTPException(status_code=404, detail="Blog article not found")
        blog["slug"] = slugify(blog.get("title", ""))
        return blog
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load blog details: {str(e)}")

@router.get("/system-designs")
async def get_system_designs():
    try:
        data = config.load_json_data("system_designs.json")
        for d in data:
            d["slug"] = slugify(d.get("title", ""))
        return {"system_designs": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load system designs: {str(e)}")

@router.get("/system-designs/{identifier}")
async def get_system_design_by_id(identifier: str = Path(..., title="The ID or slug of the system design to get")):
    try:
        data = config.load_json_data("system_designs.json")
        design = None
        for d in data:
            if slugify(d.get("title", "")) == identifier or (identifier.isdigit() and d.get("id") == int(identifier)):
                design = d
                break
        if not design:
            raise HTTPException(status_code=404, detail="System design article not found")
        design["slug"] = slugify(design.get("title", ""))
        return design
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load system design details: {str(e)}")
