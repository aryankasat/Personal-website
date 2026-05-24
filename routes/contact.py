from fastapi import APIRouter, HTTPException, status
from datetime import datetime, timezone
import models
from utils.validators import sanitize_text
from utils.email_service import send_contact_email

router = APIRouter()

@router.post("/contact", response_model=models.ContactResponse, status_code=status.HTTP_200_OK)
async def submit_contact_form(request: models.ContactRequest):
    # Sanitize input fields
    sanitized_name = sanitize_text(request.name)
    sanitized_email = sanitize_text(request.email)
    sanitized_subject = sanitize_text(request.subject)
    sanitized_message = sanitize_text(request.message)

    # Dispatches email asynchronously
    success = await send_contact_email(
        name=sanitized_name,
        sender_email=sanitized_email,
        subject=sanitized_subject,
        message_content=sanitized_message
    )

    if not success:
        # We don't crash, but let the user know there was a service bottleneck
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="We received your request, but failed to forward the email. Please try reaching out directly."
        )

    return models.ContactResponse(
        success=True,
        message="Your message has been sent successfully!",
        timestamp=datetime.now(timezone.utc).isoformat()
    )
