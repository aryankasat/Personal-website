import os
import uuid
import shutil
import logging
from fastapi import FastAPI, Request, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

import config
from routes import general, experience, projects, skills, publications, contact, content

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("MainApp")

app = FastAPI(
    title="Aryan Kasat - Portfolio API",
    description="FastAPI Backend for Aryan Kasat's Portfolio Website",
    version="1.0.0",
    docs_url="/docs" if config.DEBUG else None,
    redoc_url="/redoc" if config.DEBUG else None
)

# Ensure uploads directory exists
os.makedirs("uploads", exist_ok=True)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers under /api
app.include_router(general.router, prefix="/api", tags=["General"])
app.include_router(experience.router, prefix="/api", tags=["Experience"])
app.include_router(projects.router, prefix="/api", tags=["Projects"])
app.include_router(skills.router, prefix="/api", tags=["Skills"])
app.include_router(publications.router, prefix="/api", tags=["Publications"])
app.include_router(contact.router, prefix="/api", tags=["Contact"])
app.include_router(content.router, prefix="/api", tags=["Articles"])

# Image upload endpoint
@app.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    # Validate file type is image
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are allowed.")
    
    # Extract extension and create secure unique name
    ext = os.path.splitext(file.filename)[1]
    if not ext:
        ext = ".png"
    unique_filename = f"{uuid.uuid4()}{ext}"
    filepath = os.path.join("uploads", unique_filename)
    
    # Save the file
    try:
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file: {str(e)}")
        
    return {"url": f"/uploads/{unique_filename}"}

# General Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception caught on {request.url.path}: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred. Please try again later."}
    )

# Mount the uploads directory to serve images
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Mount the images directory to serve article and layout images
app.mount("/images", StaticFiles(directory="images"), name="images")

# Mount the static files directory at the root (/) to serve the frontend
# Note: This should be registered LAST so it doesn't intercept API routes
app.mount("/", StaticFiles(directory="static", html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    # In production, run with gunicorn or similar
    logger.info(f"Starting development server at {config.BACKEND_URL}")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=config.DEBUG)
