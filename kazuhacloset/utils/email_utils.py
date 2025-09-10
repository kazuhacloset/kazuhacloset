from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from threading import Thread
import os

def send_email_async(to_email, subject, html_content, plain_text_content):
    def send():
        sg = SendGridAPIClient(api_key=os.getenv("SENDGRID_API_KEY"))
        message = Mail(
            from_email=os.getenv("SENDGRID_FROM_EMAIL"),
            to_emails=to_email,
            subject=subject,
            plain_text_content=plain_text_content,
            html_content=html_content
        )
        sg.send(message)
    Thread(target=send, daemon=True).start()