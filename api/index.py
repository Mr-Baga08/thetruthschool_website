from fastapi import FastAPI, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from beanie import Document, init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional
import os
import traceback
import logging
from contextlib import asynccontextmanager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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
    try:
        # Get MongoDB URI from environment variable
        mongodb_uri = os.getenv("MONGODB_URI")
        if not mongodb_uri:
            logger.error("MONGODB_URI environment variable is not set")
            raise ValueError("MONGODB_URI environment variable is required")
        
        logger.info("Connecting to MongoDB...")
        
        # Create Motor client
        client = AsyncIOMotorClient(mongodb_uri)
        
        # Test connection
        await client.admin.command('ping')
        logger.info("MongoDB connection successful")
        
        # Get database (will use default from connection string)
        database = client.get_default_database()
        if not database:
            # Fallback to a specific database name
            database = client.thetruthschool
        
        # Initialize beanie with the database and document models
        await init_beanie(
            database=database,
            document_models=[WaitlistEntry, FeedbackResponse]
        )
        logger.info("Beanie initialization successful")
        
    except Exception as e:
        logger.error(f"Database initialization failed: {str(e)}")
        logger.error(traceback.format_exc())
        raise

# Lifespan context manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    try:
        await init_database()
        logger.info("Application startup complete")
    except Exception as e:
        logger.error(f"Application startup failed: {str(e)}")
        # Don't raise here to allow app to start even if DB fails
    yield
    # Shutdown (if needed)
    logger.info("Application shutdown")

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

# Debug endpoint to check environment
@app.get("/api/debug")
async def debug_info():
    return {
        "mongodb_uri_exists": bool(os.getenv("MONGODB_URI")),
        "mongodb_uri_prefix": os.getenv("MONGODB_URI", "")[:20] + "..." if os.getenv("MONGODB_URI") else None,
        "environment": dict(os.environ)
    }

# Waitlist endpoint
@app.post("/api/waitlist", response_model=SuccessResponse, status_code=status.HTTP_201_CREATED)
async def join_waitlist(request: WaitlistRequest):
    try:
        logger.info(f"Waitlist request received for email: {request.email}")
        
        # Check if email already exists
        existing_entry = await WaitlistEntry.find_one(WaitlistEntry.email == request.email)
        
        if existing_entry:
            logger.info(f"Email {request.email} already exists in waitlist")
            return SuccessResponse(
                message="Email already registered for early access!",
                success=True
            )
        
        # Create new waitlist entry
        new_entry = WaitlistEntry(email=request.email)
        await new_entry.insert()
        
        logger.info(f"Successfully added {request.email} to waitlist")
        return SuccessResponse(
            message="Successfully joined the waitlist!",
            success=True
        )
        
    except Exception as e:
        logger.error(f"Waitlist error: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to join waitlist: {str(e)}"
        )

# Feedback endpoint
@app.post("/api/feedback", response_model=SuccessResponse, status_code=status.HTTP_201_CREATED)
async def submit_feedback(request: FeedbackRequest):
    try:
        logger.info(f"Feedback request received for email: {request.email}")
        
        # Create new feedback response
        new_feedback = FeedbackResponse(
            email=request.email,
            frustration=request.frustration,
            ai_coach_help=request.ai_coach_help,
            confidence_area=request.confidence_area,
            additional_features=request.additional_features
        )
        await new_feedback.insert()
        
        logger.info(f"Successfully saved feedback for {request.email}")
        return SuccessResponse(
            message="Feedback submitted successfully!",
            success=True
        )
        
    except Exception as e:
        logger.error(f"Feedback error: {str(e)}")
        logger.error(traceback.format_exc())
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
        logger.error(f"Stats error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get stats: {str(e)}"
        )

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception: {str(exc)}")
    logger.error(traceback.format_exc())
    return HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="Internal server error"
    )

# Export for Vercel
handler = app