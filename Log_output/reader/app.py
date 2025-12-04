import os
from http.server import HTTPServer, BaseHTTPRequestHandler

PORT = int(os.environ.get('PORT'))

class RequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            with open("/usr/src/app/files/log.txt", "r") as f:
                log_message = f.read()
            
            pingpong_message = ""
            try:
                with open("/usr/src/app/files/pingpong.txt", "r") as f:
                    pingpong_message = f.read()
            except FileNotFoundError:
                pass

            self.wfile.write(f"{log_message}\nPing /pingpong: {pingpong_message}".encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

if __name__ == "__main__":
    server = HTTPServer(('0.0.0.0', PORT), RequestHandler)
    print(f"Server started on port {PORT}", flush=True)
    server.serve_forever()