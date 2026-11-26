import os
import time
import requests

BASE_URL = os.getenv("BACKEND_URL", "http://localhost:8080")

EMAIL = os.getenv("TEST_EMAIL", "user@test.area")
PASSWORD = os.getenv("TEST_PASSWORD", "area2026")


def test_login():
    url = f"{BASE_URL}/login"

    payload = {
        "email": EMAIL,
        "password": PASSWORD
    }

    start = time.perf_counter()

    try:
        response = requests.post(url, json=payload, timeout=10)
        elapsed = time.perf_counter() - start

        print(f"Status code: {response.status_code}")
        print(f"Response time: {elapsed * 1000:.2f} ms")

        if response.status_code == 200:
            data = response.json()
            print("Login successful!")
            print(f"JWT: {data['token']}")
        else:
            print("Login failed:")
            print(response.text)

    except requests.RequestException as error:
        print(f"Request failed: {error}")


if __name__ == "__main__":
    test_login()