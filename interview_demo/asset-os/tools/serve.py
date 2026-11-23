"""Serve the app folder with caching off, so a browser refresh always shows the latest files.
Usage: python3 tools/serve.py [host] [port]   (defaults: 127.0.0.1 8765)
The app also runs by double-clicking index.html; this is only a convenience while editing.
"""
import functools, http.server, os, sys

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
host = sys.argv[1] if len(sys.argv) > 1 else "127.0.0.1"
port = int(sys.argv[2]) if len(sys.argv) > 2 else 8765


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


print(f"Serving {root} at http://{host}:{port}/")
http.server.ThreadingHTTPServer((host, port), functools.partial(Handler, directory=root)).serve_forever()
