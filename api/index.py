from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from beanie import Document, init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional
import os
from contextlib import asynccontextmanager

# Pydantic models for request/response
class WaitlistRequest(BaseModel):
    email: EmailStr

class FeedbackRequest(BaseModel):
    email: EmailStr
    frustration: str
    ai_coach_help: str
    confidence_area: str
    additional_features: Optional[str] = None

class SuccessResponse(BaseModel):
    message: str
    success: bool = True

# Beanie Document models for MongoDB
class WaitlistEntry(Document):
    email: EmailStr
    created_at: datetime = datetime.utcnow()

    class Settings:
        name = "waitlist_entries"

class FeedbackResponse(Document):
    email: EmailStr
    frustration: str
    ai_coach_help: str
    confidence_area: str
    additional_features: Optional[str] = None
    created_at: datetime = datetime.utcnow()

    class Settings:
        name = "feedback_responses"

# Database connection
async def init_database():
    # Get MongoDB URI from environment variable
    mongodb_uri = os.getenv("MONGODB_URI")
    if not mongodb_uri:
        raise ValueError("MONGODB_URI environment variable is required")
    
    # Create Motor client
    client = AsyncIOMotorClient(mongodb_uri)
    
    # Initialize beanie with the database and document models
    await init_beanie(
        database=client.get_default_database(),
        document_models=[WaitlistEntry, FeedbackResponse]
    )

# Lifespan context manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_database()
    yield
    # Shutdown (if needed)

# Create FastAPI app
app = FastAPI(
    title="TheTruthSchool API",
    description="Backend API for TheTruthSchool pre-launch website",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "TheTruthSchool API is running"}

# Waitlist endpoint
@app.post("/api/waitlist", response_model=SuccessResponse, status_code=status.HTTP_201_CREATED)
async def join_waitlist(request: WaitlistRequest):
    try:
        # Check if email already exists
        existing_entry = await WaitlistEntry.find_one(WaitlistEntry.email == request.email)
        
        if existing_entry:
            return SuccessResponse(
                message="Email already registered for early access!",
                success=True
            )
        
        # Create new waitlist entry
        new_entry = WaitlistEntry(email=request.email)
        await new_entry.insert()
        
        return SuccessResponse(
            message="Successfully joined the waitlist!",
            success=True
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to join waitlist: {str(e)}"
        )

# Feedback endpoint
@app.post("/api/feedback", response_model=SuccessResponse, status_code=status.HTTP_201_CREATED)
async def submit_feedback(request: FeedbackRequest):
    try:
        # Create new feedback response
        new_feedback = FeedbackResponse(
            email=request.email,
            frustration=request.frustration,
            ai_coach_help=request.ai_coach_help,
            confidence_area=request.confidence_area,
            additional_features=request.additional_features
        )
        await new_feedback.insert()
        
        return SuccessResponse(
            message="Feedback submitted successfully!",
            success=True
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit feedback: {str(e)}"
        )

# Get waitlist stats (optional admin endpoint)
@app.get("/api/stats")
async def get_stats():
    try:
        waitlist_count = await WaitlistEntry.count()
        feedback_count = await FeedbackResponse.count()
        
        return {
            "waitlist_entries": waitlist_count,
            "feedback_responses": feedback_count
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get stats: {str(e)}"
        )

# Export for Vercel
handler = app