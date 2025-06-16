from http.server import BaseHTTPRequestHandler
import json
import re
from datetime import datetime

# Simple in-memory storage
newsletter_data = []

def is_valid_email(email):
    pattern = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    return re.match(pattern, email) is not None

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        try:
            # Read the request body
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            
            # Parse JSON
            data = json.loads(post_data.decode('utf-8'))
            
            # Validate email
            if not data or 'email' not in data:
                self.send_error_response(400, "Email is required")
                return
            
            email = data['email'].strip().lower()
            
            if not is_valid_email(email):
                self.send_error_response(400, "Invalid email format")
                return
            
            # Optional: Get preferences
            preferences = data.get('preferences', {})
            weekly_updates = preferences.get('weekly_updates', True)
            product_updates = preferences.get('product_updates', True)
            career_tips = preferences.get('career_tips', True)
            
            # Check if email already subscribed
            if any(entry['email'] == email for entry in newsletter_data):
                response = {
                    "message": "Email already subscribed to newsletter!",
                    "success": True
                }
            else:
                # Add to newsletter
                newsletter_entry = {
                    "email": email,
                    "weekly_updates": weekly_updates,
                    "product_updates": product_updates,
                    "career_tips": career_tips,
                    "subscribed_at": datetime.now().isoformat()
                }
                
                newsletter_data.append(newsletter_entry)
                
                response = {
                    "message": "Successfully subscribed to TheTruthSchool newsletter!",
                    "success": True
                }
            
            self.send_success_response(response)
            
        except json.JSONDecodeError:
            self.send_error_response(400, "Invalid JSON")
        except Exception as e:
            self.send_error_response(500, f"Server error: {str(e)}")

    def send_success_response(self, data, status_code=201):
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

    def send_error_response(self, status_code, message):
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        error_data = {"error": message, "success": False}
        self.wfile.write(json.dumps(error_data).encode('utf-8'))