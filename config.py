import os
import json
from pathlib import Path
from dotenv import load_dotenv

# Load .env file if it exists
load_dotenv()

# Environment variables with sensible defaults
DEBUG = os.getenv("DEBUG", "False").lower() in ("true", "1", "yes")
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")
API_ENDPOINT = os.getenv("API_ENDPOINT", "/api")

# Contact Form Email Configuration
CONTACT_EMAIL = os.getenv("CONTACT_EMAIL", "aryankasat@outlook.com")
CONTACT_EMAIL_PASSWORD = os.getenv("CONTACT_EMAIL_PASSWORD", "")
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")

try:
    SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
except ValueError:
    SMTP_PORT = 587

# Helper to verify if SMTP is configured
def is_smtp_configured() -> bool:
    return bool(CONTACT_EMAIL and CONTACT_EMAIL_PASSWORD and SMTP_SERVER)

# Helper to load JSON data from data/ folder
def load_json_data(filename: str):
    base_dir = Path(__file__).parent
    file_path = base_dir / "data" / filename
    if not file_path.exists():
        raise FileNotFoundError(f"Data file {filename} not found at {file_path}")
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)
