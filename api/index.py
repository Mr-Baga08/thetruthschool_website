from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import logging
from datetime import datetime
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# In-memory storage for demo (replace with database later)
waitlist_entries = []
feedback_responses = []

# Helper function to validate email
def is_valid_email(email):
    import re
    pattern = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    return re.match(pattern, email) is not None

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy", 
        "message": "TheTruthSchool API is running"
    })

@app.route('/api/debug', methods=['GET'])
def debug_info():
    return jsonify({
        "mongodb_uri_exists": bool(os.getenv("MONGODB_URI")),
        "mongodb_uri_prefix": os.getenv("MONGODB_URI", "")[:20] + "..." if os.getenv("MONGODB_URI") else None,
        "waitlist_count": len(waitlist_entries),
        "feedback_count": len(feedback_responses)
    })

@app.route('/api/waitlist', methods=['POST'])
def join_waitlist():
    try:
        data = request.get_json()
        
        if not data or 'email' not in data:
            return jsonify({"error": "Email is required"}), 400
        
        email = data['email'].strip().lower()
        
        if not is_valid_email(email):
            return jsonify({"error": "Invalid email format"}), 400
        
        # Check if email already exists
        if any(entry['email'] == email for entry in waitlist_entries):
            return jsonify({
                "message": "Email already registered for early access!",
                "success": True
            }), 200
        
        # Add to waitlist
        waitlist_entries.append({
            "email": email,
            "created_at": datetime.utcnow().isoformat()
        })
        
        logger.info(f"Added {email} to waitlist")
        
        return jsonify({
            "message": "Successfully joined the waitlist!",
            "success": True
        }), 201
        
    except Exception as e:
        logger.error(f"Waitlist error: {str(e)}")
        return jsonify({"error": "Failed to join waitlist"}), 500

@app.route('/api/feedback', methods=['POST'])
def submit_feedback():
    try:
        data = request.get_json()
        
        required_fields = ['email', 'frustration', 'ai_coach_help', 'confidence_area']
        for field in required_fields:
            if not data or field not in data or not data[field].strip():
                return jsonify({"error": f"{field} is required"}), 400
        
        email = data['email'].strip().lower()
        
        if not is_valid_email(email):
            return jsonify({"error": "Invalid email format"}), 400
        
        # Add feedback
        feedback_responses.append({
            "email": email,
            "frustration": data['frustration'].strip(),
            "ai_coach_help": data['ai_coach_help'].strip(),
            "confidence_area": data['confidence_area'].strip(),
            "additional_features": data.get('additional_features', '').strip(),
            "created_at": datetime.utcnow().isoformat()
        })
        
        logger.info(f"Added feedback for {email}")
        
        return jsonify({
            "message": "Feedback submitted successfully!",
            "success": True
        }), 201
        
    except Exception as e:
        logger.error(f"Feedback error: {str(e)}")
        return jsonify({"error": "Failed to submit feedback"}), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    try:
        return jsonify({
            "waitlist_entries": len(waitlist_entries),
            "feedback_responses": len(feedback_responses)
        })
    except Exception as e:
        logger.error(f"Stats error: {str(e)}")
        return jsonify({"error": "Failed to get stats"}), 500

# Default route
@app.route('/')
def index():
    return jsonify({"message": "TheTruthSchool API"})

# Export for Vercel
def handler(event, context):
    return app(event, context)

if __name__ == '__main__':
    app.run(debug=True)