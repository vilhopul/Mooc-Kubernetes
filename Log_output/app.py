import os
import random
import string
import time
import threading
from datetime import datetime, timezone
from http.server import HTTPServer, BaseHTTPRequestHandler


length = 24
PORT = int(os.environ.get('PORT'))

def generate_random_string(length):
    letters = string.ascii_letters + string.digits
    return ''.join(random.choice(letters) for i in range(length))

def get_timestamp():
    return datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'

def log_loop():
    while True:
        timestamp = get_timestamp()
        print(f"{timestamp}: {random_string}", flush=True)
        time.sleep(5)

class RequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            timestamp = get_timestamp()
            self.wfile.write(f"{timestamp}: {random_string}".encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

if __name__ == "__main__":
    random_string = generate_random_string(length)

    log_loop_thread = threading.Thread(target=log_loop, daemon=True)
    log_loop_thread.start()

    server = HTTPServer(('0.0.0.0', PORT), RequestHandler)
    print(f"Server started on port {PORT}", flush=True)
    server.serve_forever()