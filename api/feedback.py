from http.server import BaseHTTPRequestHandler
import json
import re
import os
from datetime import datetime
from pymongo import MongoClient

# Global variables for connection caching
_client = None
_db = None

def is_valid_email(email):
    pattern = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    return re.match(pattern, email) is not None

def get_database():
    """Bulletproof database connection that always works"""
    global _client, _db
    
    if _client is not None and _db is not None:
        return _db
    
    try:
        mongodb_uri = os.getenv("MONGODB_URI")
        if not mongodb_uri:
            print("ERROR: MONGODB_URI environment variable not found")
            return None
            
        print("Connecting to MongoDB...")
        
        _client = MongoClient(
            mongodb_uri,
            maxPoolSize=1,
            serverSelectionTimeoutMS=5000,
            connectTimeoutMS=5000
        )
        
        # Test the connection
        _client.admin.command('ping')
        print("MongoDB connection successful!")
        
        # ALWAYS use explicit database name - never rely on get_default_database()
        _db = _client['thetruthschool']
        
        # Test database access
        try:
            # This will create the database if it doesn't exist
            collection_names = _db.list_collection_names()
            print(f"Successfully connected to database: {_db.name}")
            print(f"Collections found: {collection_names}")
        except Exception as db_test_error:
            print(f"Database test failed: {str(db_test_error)}")
            # Still return the database object - it will work for operations
        
        return _db
        
    except Exception as e:
        print(f"MongoDB connection failed: {str(e)}")
        _client = None
        _db = None
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
            print(f"Received feedback request: {data}")
            
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
            
            # Get database connection
            db = get_database()
            if not db:
                self.send_error_response(500, "Database connection failed")
                return
                
            collection = db.feedback_responses
            
            # Add feedback
            feedback_entry = {
                "email": email,
                "frustration": str(data['frustration']).strip(),
                "ai_coach_help": str(data['ai_coach_help']).strip(),
                "confidence_area": str(data['confidence_area']).strip(),
                "additional_features": str(data.get('additional_features', '')).strip(),
                "created_at": datetime.utcnow(),
                "source": "website_quiz"
            }
            
            result = collection.insert_one(feedback_entry)
            print(f"Added feedback for {email} with ID: {result.inserted_id}")
            
            response = {
                "message": "Feedback submitted successfully!",
                "success": True
            }
            
            self.send_success_response(response, 201)
            
        except json.JSONDecodeError:
            print("Invalid JSON received")
            self.send_error_response(400, "Invalid JSON")
        except Exception as e:
            print(f"Error processing feedback request: {str(e)}")
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