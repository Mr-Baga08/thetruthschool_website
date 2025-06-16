from http.server import BaseHTTPRequestHandler
import json
import os
from pymongo import MongoClient

def get_database():
    """Get MongoDB database connection"""
    try:
        mongodb_uri = os.getenv("MONGODB_URI")
        if not mongodb_uri:
            print("ERROR: MONGODB_URI environment variable not found")
            return None
            
        print(f"Connecting to MongoDB for stats...")
        client = MongoClient(mongodb_uri)
        
        # Test the connection
        client.admin.command('ping')
        print("MongoDB connection successful!")
        
        # Get database
        db = client.get_default_database()
        if not db:
            db = client['thetruthschool']
            
        return db
        
    except Exception as e:
        print(f"MongoDB connection failed: {str(e)}")
        return None

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            # Get database connection
            db = get_database()
            if not db:
                self.send_error_response(500, "Database connection failed")
                return
            
            # Get collection counts
            waitlist_count = db.waitlist_entries.count_documents({})
            feedback_count = db.feedback_responses.count_documents({})
            newsletter_count = db.newsletter_subscribers.count_documents({})
            
            # Get some sample data (latest entries)
            latest_waitlist = list(db.waitlist_entries.find().sort("created_at", -1).limit(3))
            latest_feedback = list(db.feedback_responses.find().sort("created_at", -1).limit(3))
            latest_newsletter = list(db.newsletter_subscribers.find().sort("subscribed_at", -1).limit(3))
            
            # Convert ObjectId to string for JSON serialization
            for item in latest_waitlist + latest_feedback + latest_newsletter:
                if '_id' in item:
                    item['_id'] = str(item['_id'])
                # Convert datetime to string
                for key, value in item.items():
                    if hasattr(value, 'isoformat'):
                        item[key] = value.isoformat()
            
            response = {
                "success": True,
                "database_connected": True,
                "collections": {
                    "waitlist_entries": waitlist_count,
                    "feedback_responses": feedback_count,
                    "newsletter_subscribers": newsletter_count
                },
                "total_users": waitlist_count,
                "latest_entries": {
                    "waitlist": latest_waitlist,
                    "feedback": latest_feedback,
                    "newsletter": latest_newsletter
                }
            }
            
            print(f"Stats: Waitlist: {waitlist_count}, Feedback: {feedback_count}, Newsletter: {newsletter_count}")
            
            self.send_success_response(response)
            
        except Exception as e:
            print(f"Error getting stats: {str(e)}")
            self.send_error_response(500, f"Server error: {str(e)}")

    def send_success_response(self, data, status_code=200):
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data, indent=2).encode('utf-8'))

    def send_error_response(self, status_code, message):
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        error_data = {"error": message, "success": False}
        self.wfile.write(json.dumps(error_data).encode('utf-8'))