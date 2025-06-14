"""
Health check endpoints
"""

from fastapi import APIRouter, HTTPException
from datetime import datetime
import psutil
import logging

from ...core.config import get_settings
from ...core.database import check_database_connection

logger = logging.getLogger(__name__)
router = APIRouter()

settings = get_settings()


@router.get("/")
async def health_check():
    """Basic health check"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "ViralForge AI",
        "version": settings.APP_VERSION
    }


@router.get("/detailed")
async def detailed_health_check():
    """Detailed system health check"""
    try:
        # Database check
        db_healthy = await check_database_connection()
        
        # System resources
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        
        # Service status
        health_data = {
            "status": "healthy" if db_healthy else "degraded",
            "timestamp": datetime.utcnow().isoformat(),
            "service": "ViralForge AI",
            "version": settings.APP_VERSION,
            "components": {
                "database": {
                    "status": "healthy" if db_healthy else "unhealthy",
                    "connected": db_healthy
                },
                "content_generation": {
                    "status": "healthy",
                    "auto_posting_enabled": settings.AUTO_POSTING_ENABLED
                },
                "ai_services": {
                    "status": "healthy",
                    "openai_configured": bool(settings.OPENAI_API_KEY),
                    "elevenlabs_configured": bool(settings.ELEVENLABS_API_KEY)
                }
            },
            "system": {
                "cpu_usage_percent": cpu_percent,
                "memory": {
                    "total_gb": round(memory.total / (1024**3), 2),
                    "available_gb": round(memory.available / (1024**3), 2),
                    "used_percent": memory.percent
                },
                "disk": {
                    "total_gb": round(disk.total / (1024**3), 2),
                    "free_gb": round(disk.free / (1024**3), 2),
                    "used_percent": round((disk.used / disk.total) * 100, 2)
                }
            }
        }
        
        return health_data
        
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=500, detail="Health check failed")


@router.get("/readiness")
async def readiness_check():
    """Kubernetes readiness probe"""
    try:
        db_ready = await check_database_connection()
        
        if not db_ready:
            raise HTTPException(status_code=503, detail="Database not ready")
        
        return {
            "status": "ready",
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Readiness check failed: {e}")
        raise HTTPException(status_code=503, detail="Service not ready")


@router.get("/liveness")
async def liveness_check():
    """Kubernetes liveness probe"""
    return {
        "status": "alive",
        "timestamp": datetime.utcnow().isoformat()
    } 