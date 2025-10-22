import random
import string
import time
from datetime import datetime, timezone

length = 24

def generate_random_string(length):
    letters = string.ascii_letters + string.digits
    return ''.join(random.choice(letters) for i in range(length))

if __name__ == "__main__":
    random_string = generate_random_string(length)
    while True:
        timestamp = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'
        print(f"{timestamp}: {random_string}", flush=True)
        time.sleep(5)