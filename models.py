from pydantic import BaseModel, EmailStr, Field

class ContactRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, description="Name of the sender")
    email: EmailStr = Field(..., description="Email address of the sender")
    subject: str = Field(..., min_length=3, max_length=150, description="Subject of the message")
    message: str = Field(..., min_length=10, max_length=5000, description="Message content")

class ContactResponse(BaseModel):
    success: bool
    message: str
    timestamp: str
