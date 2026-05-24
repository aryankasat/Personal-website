import html

def sanitize_text(text: str) -> str:
    """
    Sanitize text input by escaping HTML special characters to prevent HTML injection/XSS.
    """
    if not text:
        return ""
    return html.escape(text.strip())
