from locust import HttpUser, task, between
import random
import string

# helper: generate random email
def random_email():
    return "test_" + ''.join(random.choices(string.ascii_lowercase, k=6)) + "@mail.com"

class WebsiteUser(HttpUser):
    wait_time = between(1, 3)  # wait between tasks

    @task
    def full_signup_flow(self):
        email = random_email()
        password = "Test@123"

        # Step 1: Send OTP
        with self.client.post(
            "/api/send-otp/",
            json={"email": email},
            catch_response=True,
        ) as response:
            if response.status_code != 200:
                response.failure(f"Send OTP failed: {response.text}")
                return
            
        with self.client.post(
            "/api/verify-otp/",
            json={"email": email, "otp": "123456"},  # ✅ test mode OTP
            catch_response=True,
        ) as response:
            if response.status_code != 200:
                response.failure(f"Verify OTP failed: {response.text}")
                return

        # Step 2: Register (with fixed OTP for test mode)
        with self.client.post(
            "/api/register/",
            json={
                "first_name": "Test",
                "last_name": "User",
                "email": email,
                "password": password,
                "otp": "123456"  # ✅ test mode OTP
            },
            catch_response=True,
        ) as response:
            if response.status_code != 201:
                response.failure(f"Register failed: {response.text}")
                return

        # Step 3: Login
        with self.client.post(
            "/api/login/",
            json={"email": email, "password": password},
            catch_response=True,
        ) as response:
            if response.status_code != 200:
                response.failure(f"Login failed: {response.text}")
            else:
                response.success()
