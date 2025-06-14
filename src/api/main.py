"""
ViralForge AI - Main FastAPI Application
"""

from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.security import HTTPBearer
from contextlib import asynccontextmanager
import logging
from datetime import datetime

from ..core.config import get_settings
from ..core.database import create_tables, check_database_connection
from .routers import content, social, analytics, admin, health

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get settings
settings = get_settings()

# Security
security = HTTPBearer()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    logger.info("🚀 Starting ViralForge AI...")
    
    # Initialize database
    try:
        create_tables()
        if await check_database_connection():
            logger.info("✅ Database connection established")
        else:
            logger.error("❌ Database connection failed")
    except Exception as e:
        logger.error(f"❌ Database initialization failed: {e}")
    
    logger.info("🎯 ViralForge AI started successfully!")
    
    yield
    
    # Shutdown
    logger.info("🛑 Shutting down ViralForge AI...")


# Create FastAPI app
app = FastAPI(
    title="ViralForge AI",
    description="Fully Autonomous AI-Powered Social Media Content Generation & Posting System",
    version=settings.APP_VERSION,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    lifespan=lifespan
)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.DEBUG else ["https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"] if settings.DEBUG else ["yourdomain.com", "*.yourdomain.com"]
)


# Include routers
app.include_router(
    health.router,
    prefix="/health",
    tags=["Health Check"]
)

app.include_router(
    content.router,
    prefix="/api/v1/content",
    tags=["Content Generation"],
    dependencies=[Depends(security)] if not settings.DEBUG else []
)

app.include_router(
    social.router,
    prefix="/api/v1/social",
    tags=["Social Media"],
    dependencies=[Depends(security)] if not settings.DEBUG else []
)

app.include_router(
    analytics.router,
    prefix="/api/v1/analytics",
    tags=["Analytics"],
    dependencies=[Depends(security)] if not settings.DEBUG else []
)

app.include_router(
    admin.router,
    prefix="/api/v1/admin",
    tags=["Admin"],
    dependencies=[Depends(security)] if not settings.DEBUG else []
)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to ViralForge AI 🚀",
        "description": "Fully Autonomous AI-Powered Social Media Content Generation System",
        "version": settings.APP_VERSION,
        "status": "operational",
        "timestamp": datetime.utcnow().isoformat(),
        "docs": "/docs" if settings.DEBUG else "Contact admin for API documentation"
    }


@app.get("/status")
async def status():
    """System status endpoint"""
    try:
        db_status = await check_database_connection()
        
        return {
            "status": "healthy" if db_status else "degraded",
            "database": "connected" if db_status else "disconnected",
            "timestamp": datetime.utcnow().isoformat(),
            "version": settings.APP_VERSION,
            "debug_mode": settings.DEBUG,
            "auto_posting": settings.AUTO_POSTING_ENABLED
        }
    except Exception as e:
        logger.error(f"Status check failed: {e}")
        raise HTTPException(status_code=500, detail="System health check failed")


@app.post("/trigger-content-generation")
async def trigger_content_generation(background_tasks: BackgroundTasks):
    """Manually trigger content generation (admin endpoint)"""
    try:
        from ..content_pipeline.tasks import generate_daily_content
        
        # Add background task
        background_tasks.add_task(generate_daily_content.delay)
        
        return {
            "message": "Content generation triggered successfully",
            "timestamp": datetime.utcnow().isoformat()
        }
    
    except Exception as e:
        logger.error(f"Failed to trigger content generation: {e}")
        raise HTTPException(status_code=500, detail="Failed to trigger content generation")


@app.post("/trigger-post-processing")
async def trigger_post_processing(background_tasks: BackgroundTasks):
    """Manually trigger post processing (admin endpoint)"""
    try:
        from ..social_platforms.tasks import process_scheduled_posts
        
        # Add background task
        background_tasks.add_task(process_scheduled_posts.delay)
        
        return {
            "message": "Post processing triggered successfully",
            "timestamp": datetime.utcnow().isoformat()
        }
    
    except Exception as e:
        logger.error(f"Failed to trigger post processing: {e}")
        raise HTTPException(status_code=500, detail="Failed to trigger post processing")


# Error handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return {
        "error": "Endpoint not found",
        "message": "The requested endpoint does not exist",
        "available_endpoints": [
            "/",
            "/status",
            "/health/",
            "/api/v1/content/",
            "/api/v1/social/",
            "/api/v1/analytics/",
            "/api/v1/admin/",
        ]
    }


@app.exception_handler(500)
async def internal_error_handler(request, exc):
    logger.error(f"Internal server error: {exc}")
    return {
        "error": "Internal server error",
        "message": "An unexpected error occurred",
        "timestamp": datetime.utcnow().isoformat()
    }


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "src.api.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower()
    ) 