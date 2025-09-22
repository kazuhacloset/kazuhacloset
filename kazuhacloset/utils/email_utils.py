import os
from threading import Thread
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException

def send_email_async(to_email, subject, html_content, plain_text_content=""):
    def send():
        configuration = sib_api_v3_sdk.Configuration()
        configuration.api_key['api-key'] = os.getenv("BREVO_API_KEY")

        api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))

        sender = {"name": "Kazuha Closet", "email": os.getenv("BREVO_FROM_EMAIL")}
        to = [{"email": to_email}]

        send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
            to=to,
            sender=sender,
            subject=subject,
            html_content=html_content,
            text_content=plain_text_content
        )

        try:
            api_instance.send_transac_email(send_smtp_email)
        except ApiException as e:
            print(f"Exception when sending email: {e}")

    Thread(target=send, daemon=True).start()
