from http.server import BaseHTTPRequestHandler
import json
import re
import os
from datetime import datetime
from pymongo import MongoClient
from urllib.parse import quote_plus

def is_valid_email(email):
    pattern = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    return re.match(pattern, email) is not None

def get_database():
    """Get MongoDB database connection"""
    try:
        mongodb_uri = os.getenv("MONGODB_URI")
        if not mongodb_uri:
            print("ERROR: MONGODB_URI environment variable not found")
            return None
            
        print(f"Connecting to MongoDB with URI: {mongodb_uri[:50]}...")
        client = MongoClient(mongodb_uri)
        
        # Test the connection
        client.admin.command('ping')
        print("MongoDB connection successful!")
        
        # Get database (use default from connection string or fallback)
        db = client.get_default_database()
        if not db:
            db = client['thetruthschool']
            
        return db
        
    except Exception as e:
        print(f"MongoDB connection failed: {str(e)}")
        return None

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
            print(f"Received waitlist request: {data}")
            
            # Validate email
            if not data or 'email' not in data:
                self.send_error_response(400, "Email is required")
                return
            
            email = data['email'].strip().lower()
            
            if not is_valid_email(email):
                self.send_error_response(400, "Invalid email format")
                return
            
            # Get database connection
            db = get_database()
            if not db:
                self.send_error_response(500, "Database connection failed")
                return
                
            collection = db.waitlist_entries
            
            # Check if email already exists
            existing = collection.find_one({"email": email})
            if existing:
                print(f"Email {email} already exists in waitlist")
                response = {
                    "message": "Email already registered for early access!",
                    "success": True
                }
            else:
                # Add to waitlist
                waitlist_entry = {
                    "email": email,
                    "created_at": datetime.utcnow(),
                    "source": "website"
                }
                
                result = collection.insert_one(waitlist_entry)
                print(f"Added {email} to waitlist with ID: {result.inserted_id}")
                
                response = {
                    "message": "Successfully joined the waitlist!",
                    "success": True
                }
            
            self.send_success_response(response)
            
        except json.JSONDecodeError:
            print("Invalid JSON received")
            self.send_error_response(400, "Invalid JSON")
        except Exception as e:
            print(f"Error processing waitlist request: {str(e)}")
            self.send_error_response(500, f"Server error: {str(e)}")

    def send_success_response(self, data, status_code=200):
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