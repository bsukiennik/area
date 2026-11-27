import os
import time
import requests

from concurrent.futures import ThreadPoolExecutor, as_completed

BASE_URL = os.getenv("BACKEND_URL", "http://localhost:8080")

EMAIL = os.getenv("TEST_EMAIL", "user@test.area")
PASSWORD = os.getenv("TEST_PASSWORD", "area2026")

REQUESTS = 10000
CONCURRENCY = 200


def send_request():
    payload = {
        "email": EMAIL,
        "password": PASSWORD
    }

    start = time.perf_counter()

    try:
        response = requests.post(
            f"{BASE_URL}/login",
            json=payload,
            timeout=15
        )

        elapsed = time.perf_counter() - start

        return {
            "success": response.status_code == 200,
            "time": elapsed
        }

    except requests.RequestException:
        elapsed = time.perf_counter() - start

        return {
            "success": False,
            "time": elapsed
        }


def load_test():
    results = []

    print(f"Starting load test...")
    print(f"Requests: {REQUESTS}")
    print(f"Concurrency: {CONCURRENCY}")

    start = time.perf_counter()

    with ThreadPoolExecutor(max_workers=CONCURRENCY) as executor:
        futures = [
            executor.submit(send_request)
            for _ in range(REQUESTS)
        ]

        for future in as_completed(futures):
            results.append(future.result())

    total_time = time.perf_counter() - start

    successful = sum(r["success"] for r in results)
    failed = REQUESTS - successful

    average_latency = sum(r["time"] for r in results) / REQUESTS
    requests_per_second = REQUESTS / total_time

    print("\n========== RESULTS ==========")
    print(f"Total time:        {total_time:.2f} seconds")
    print(f"Successful:        {successful}")
    print(f"Failed:            {failed}")
    print(f"Average latency:   {average_latency * 1000:.2f} ms")
    print(f"Requests/second:   {requests_per_second:.2f}")
    print("=============================")


if __name__ == "__main__":
    load_test()