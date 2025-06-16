from flask import Flask, request, jsonify
import os
import re
from datetime import datetime

# Create Flask app
app = Flask(__name__)

# Enable CORS manually
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# In-memory storage (replace with database later)
waitlist_entries = []
feedback_responses = []

def is_valid_email(email):
    pattern = r'^[^\s@]+@[^\s@]+\.[^\s@]+'
    return re.match(pattern, email) is not None

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy", 
        "message": "TheTruthSchool API is running with Flask"
    })

@app.route('/api/debug', methods=['GET'])
def debug_info():
    return jsonify({
        "flask_version": "working",
        "waitlist_count": len(waitlist_entries),
        "feedback_count": len(feedback_responses),
        "python_version": "3.x"
    })

@app.route('/api/waitlist', methods=['POST', 'OPTIONS'])
def join_waitlist():
    if request.method == 'OPTIONS':
        return '', 200
        
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
            "created_at": datetime.now().isoformat()
        })
        
        return jsonify({
            "message": "Successfully joined the waitlist!",
            "success": True
        }), 201
        
    except Exception as e:
        return jsonify({"error": f"Failed to join waitlist: {str(e)}"}), 500

@app.route('/api/feedback', methods=['POST', 'OPTIONS'])
def submit_feedback():
    if request.method == 'OPTIONS':
        return '', 200
        
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
            "created_at": datetime.now().isoformat()
        })
        
        return jsonify({
            "message": "Feedback submitted successfully!",
            "success": True
        }), 201
        
    except Exception as e:
        return jsonify({"error": f"Failed to submit feedback: {str(e)}"}), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    return jsonify({
        "waitlist_entries": len(waitlist_entries),
        "feedback_responses": len(feedback_responses)
    })

@app.route('/', methods=['GET'])
def index():
    return jsonify({"message": "TheTruthSchool API is running"})

# Vercel handler
def handler(event, context):
    return app

if __name__ == '__main__':
    app.run(debug=True)