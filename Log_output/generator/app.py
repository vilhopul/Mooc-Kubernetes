import os
import random
import string
import time
import threading
from datetime import datetime, timezone

length = 24

def generate_random_string(length):
    letters = string.ascii_letters + string.digits
    return ''.join(random.choice(letters) for i in range(length))

def get_timestamp():
    return datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'

def log_loop():
    file_path = "/usr/src/app/files/log.txt"
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    while True:
        timestamp = get_timestamp()
        log_message = f"{timestamp}: {random_string}"
        print(log_message, flush=True)
        with open(file_path, "w") as f:
            f.write(log_message)
        time.sleep(5)

if __name__ == "__main__":
    random_string = generate_random_string(length)
    log_loop()