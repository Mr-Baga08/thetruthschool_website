from http.server import BaseHTTPRequestHandler
import json
import re
from datetime import datetime

# Simple in-memory storage
feedback_data = []

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
            
            # Validate required fields
            required_fields = ['email', 'frustration', 'ai_coach_help', 'confidence_area']
            for field in required_fields:
                if not data or field not in data or not str(data[field]).strip():
                    self.send_error_response(400, f"{field} is required")
                    return
            
            email = data['email'].strip().lower()
            
            if not is_valid_email(email):
                self.send_error_response(400, "Invalid email format")
                return
            
            # Add feedback
            feedback_entry = {
                "email": email,
                "frustration": str(data['frustration']).strip(),
                "ai_coach_help": str(data['ai_coach_help']).strip(),
                "confidence_area": str(data['confidence_area']).strip(),
                "additional_features": str(data.get('additional_features', '')).strip(),
                "created_at": datetime.now().isoformat()
            }
            
            feedback_data.append(feedback_entry)
            
            response = {
                "message": "Feedback submitted successfully!",
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