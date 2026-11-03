import smtplib
from email.message import EmailMessage
from app.config import settings


def send_verification_email(to_email: str, token: str) -> None:
    verify_link = f"{settings.CLIENT_URL}/app/verify-email?token={token}"

    if settings.ENVIRONMENT.lower() == "development" or not settings.SMTP_HOST:
        print(f"\n=======================================================")
        print(f"[DEV EMAIL] VERIFY EMAIL LINK FOR {to_email}:")
        print(f"{verify_link}")
        print(f"=======================================================\n")
        return

    # Production SMTP delivery
    try:
        msg = EmailMessage()
        msg["Subject"] = "Verify your email - sBLOOM Affiliate Programme"
        msg["From"] = settings.SMTP_FROM
        msg["To"] = to_email
        msg.set_content(
            f"Hello,\n\nPlease verify your sBLOOM affiliate account email by clicking the link below:\n\n{verify_link}\n\n"
            f"If you did not create an account, please ignore this email.\n\nBest regards,\nsBLOOM Team"
        )

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            if settings.SMTP_USE_TLS:
                server.starttls()
            if settings.SMTP_USER and settings.SMTP_PASSWORD:
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(msg)
    except Exception as e:
        print(f"[EMAIL ERROR] Failed to send verification email to {to_email}: {e}")


def send_password_reset_email(to_email: str, token: str) -> None:
    reset_link = f"{settings.CLIENT_URL}/app/reset-password?token={token}"

    if settings.ENVIRONMENT.lower() == "development" or not settings.SMTP_HOST:
        print(f"\n=======================================================")
        print(f"[DEV EMAIL] PASSWORD RESET LINK FOR {to_email}:")
        print(f"{reset_link}")
        print(f"=======================================================\n")
        return

    try:
        msg = EmailMessage()
        msg["Subject"] = "Reset your password - sBLOOM Affiliate Programme"
        msg["From"] = settings.SMTP_FROM
        msg["To"] = to_email
        msg.set_content(
            f"Hello,\n\nYou requested a password reset for your sBLOOM account. Click the link below to set a new password:\n\n{reset_link}\n\n"
            f"This link will expire in {settings.PASSWORD_RESET_EXPIRE_HOURS} hours.\n\n"
            f"If you did not request this, you can safely ignore this email.\n\nBest regards,\nsBLOOM Team"
        )

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            if settings.SMTP_USE_TLS:
                server.starttls()
            if settings.SMTP_USER and settings.SMTP_PASSWORD:
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(msg)
    except Exception as e:
        print(f"[EMAIL ERROR] Failed to send password reset email to {to_email}: {e}")
