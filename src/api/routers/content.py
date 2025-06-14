"""
Content generation API endpoints
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime
import logging

from ...core.config import ContentType, get_settings
from ...content_pipeline.generator import get_content_generator

logger = logging.getLogger(__name__)
router = APIRouter()

settings = get_settings()


# Pydantic models for request/response
class ContentGenerationRequest(BaseModel):
    content_type: ContentType
    topic: Optional[str] = None
    location: Optional[str] = None
    target_audience: Optional[Dict[str, Any]] = None


class BulkContentGenerationRequest(BaseModel):
    count: int = 3
    content_types: Optional[List[ContentType]] = None
    locations: Optional[List[str]] = None


class ContentResponse(BaseModel):
    id: Optional[str] = None
    content_type: str
    title: str
    script: str
    description: str
    hashtags: List[str]
    duration_seconds: int
    media_assets: List[Dict[str, Any]]
    generated_at: str
    status: str = "generated"


@router.get("/")
async def get_content_list():
    """Get list of generated content"""
    # This would typically query the database
    return {
        "message": "Content list endpoint",
        "content": [],
        "total": 0,
        "timestamp": datetime.utcnow().isoformat()
    }


@router.post("/generate", response_model=ContentResponse)
async def generate_content(request: ContentGenerationRequest):
    """Generate a single piece of content"""
    try:
        logger.info(f"Generating content: {request.content_type}")
        
        generator = get_content_generator()
        
        content_data = await generator.generate_content_piece(
            content_type=request.content_type,
            topic=request.topic,
            target_audience=request.target_audience,
            location=request.location
        )
        
        return ContentResponse(
            content_type=content_data["content_type"],
            title=content_data["title"],
            script=content_data["script"],
            description=content_data["description"],
            hashtags=content_data["hashtags"],
            duration_seconds=content_data["duration_seconds"],
            media_assets=content_data["media_assets"],
            generated_at=content_data["generated_at"]
        )
        
    except Exception as e:
        logger.error(f"Content generation failed: {e}")
        raise HTTPException(status_code=500, detail=f"Content generation failed: {str(e)}")


@router.post("/generate/bulk")
async def generate_bulk_content(request: BulkContentGenerationRequest):
    """Generate multiple pieces of content"""
    try:
        logger.info(f"Generating {request.count} pieces of content")
        
        generator = get_content_generator()
        
        content_pieces = await generator.generate_multiple_content_pieces(
            count=request.count,
            content_types=request.content_types,
            locations=request.locations
        )
        
        return {
            "message": f"Generated {len(content_pieces)} pieces of content",
            "content": content_pieces,
            "requested": request.count,
            "generated": len(content_pieces),
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Bulk content generation failed: {e}")
        raise HTTPException(status_code=500, detail=f"Bulk content generation failed: {str(e)}")


@router.post("/generate/daily")
async def trigger_daily_generation(background_tasks: BackgroundTasks):
    """Trigger daily content generation"""
    try:
        from ...content_pipeline.tasks import generate_daily_content
        
        # Add background task
        background_tasks.add_task(generate_daily_content.delay)
        
        return {
            "message": "Daily content generation triggered",
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Failed to trigger daily generation: {e}")
        raise HTTPException(status_code=500, detail="Failed to trigger daily generation")


@router.get("/stats")
async def get_content_stats():
    """Get content generation statistics"""
    # This would typically query the database for real stats
    return {
        "total_content": 0,
        "by_type": {
            "facts": 0,
            "trivia": 0,
            "memes": 0,
            "quotes": 0,
            "location_content": 0
        },
        "today": 0,
        "this_week": 0,
        "timestamp": datetime.utcnow().isoformat()
    }


@router.get("/templates")
async def get_content_templates():
    """Get available content templates"""
    return {
        "message": "Content templates endpoint",
        "templates": [],
        "timestamp": datetime.utcnow().isoformat()
    } 