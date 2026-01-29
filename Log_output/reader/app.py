import os
import requests
from http.server import HTTPServer, BaseHTTPRequestHandler

PORT = int(os.environ.get('PORT'))
env_message = os.environ.get('MESSAGE')

class RequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            
            try:
                with open("/config/information.txt", "r") as f:
                    file_content = f.read().strip()
            except FileNotFoundError:
                file_content = "File not found"
            

            with open("/usr/src/app/files/log.txt", "r") as f:
                log_message = f.read()
            
            pingpong_message = ""
            try:
                response = requests.get('http://pingpong-svc:3456/pings')
                pingpong_message = response.text
            except Exception as e:
                print(e)
                pingpong_message = "0"

            self.wfile.write(f"file content: {file_content}\nenv variable: MESSAGE={env_message}\n{log_message}\nPing / pingpong: {pingpong_message}".encode('utf-8'))
        elif self.path == '/healthz':
            try:
                response = requests.get('http://pingpong-svc:3456/pings', timeout=2)
                if response.status_code == 200:
                    self.send_response(200)
                    self.send_header('Content-type', 'text/plain')
                    self.end_headers()
                    self.wfile.write(b'OK')
                else:
                    self.send_response(503)
                    self.end_headers()
            except Exception as e:
                print(f"Health check failed: {e}")
                self.send_response(503)
                self.end_headers()
        else:
            self.send_response(404)
            self.end_headers()

if __name__ == "__main__":
    server = HTTPServer(('0.0.0.0', PORT), RequestHandler)
    print(f"Server started on port {PORT}", flush=True)
    server.serve_forever()