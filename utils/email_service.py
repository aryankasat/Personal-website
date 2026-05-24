import logging
from email.message import EmailMessage
import aiosmtplib
import config

# Set up logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("EmailService")

async def send_contact_email(name: str, sender_email: str, subject: str, message_content: str) -> bool:
    """
    Asynchronously sends a contact form email notification.
    If SMTP credentials are not configured, it writes to logs as a local fallback.
    """
    mail_subject = f"Portfolio Contact: {subject}"
    mail_body = (
        f"You have received a new message from your portfolio contact form:\n\n"
        f"Name: {name}\n"
        f"Email: {sender_email}\n"
        f"Subject: {subject}\n\n"
        f"Message:\n{message_content}\n"
    )

    # Check configuration
    if not config.is_smtp_configured():
        logger.warning("SMTP is not fully configured (missing email, password, or server). Logging message locally:")
        logger.info(f"\n--- MOCK EMAIL START ---\nTo: {config.CONTACT_EMAIL}\nSubject: {mail_subject}\nBody:\n{mail_body}--- MOCK EMAIL END ---")
        return True

    # Construct message
    msg = EmailMessage()
    msg["From"] = config.CONTACT_EMAIL
    msg["To"] = config.CONTACT_EMAIL
    msg["Subject"] = mail_subject
    msg.set_content(mail_body)

    # Add Reply-To so Aryan can directly click reply to answer the user
    msg["Reply-To"] = sender_email

    try:
        # Connect and send
        await aiosmtplib.send(
            msg,
            hostname=config.SMTP_SERVER,
            port=config.SMTP_PORT,
            username=config.CONTACT_EMAIL,
            password=config.CONTACT_EMAIL_PASSWORD,
            use_tls=config.SMTP_PORT == 465,
            start_tls=config.SMTP_PORT == 587,
            timeout=10
        )
        logger.info(f"Email successfully sent from {sender_email} to {config.CONTACT_EMAIL}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email via SMTP server {config.SMTP_SERVER}: {str(e)}")
        # Fall back to logging it so no data is lost
        logger.info(f"\n--- FALLBACK LOGGED EMAIL ---\nSubject: {mail_subject}\nBody:\n{mail_body}")
        # Return False to let the router know it failed, or return True if we want to treat it as captured
        return False
