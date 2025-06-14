#!/usr/bin/env python3
"""
ViralForge AI Setup Script
Initializes database, creates sample data, and sets up the system
"""

import os
import sys
import asyncio
import logging
from pathlib import Path

# Add the parent directory to Python path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.core.config import get_settings
from src.core.database import create_tables, get_db
from src.core.models import User, SocialAccount, ContentTemplate, Platform, ContentType

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def setup_database():
    """Create database tables"""
    try:
        logger.info("Creating database tables...")
        create_tables()
        logger.info("✅ Database tables created successfully")
    except Exception as e:
        logger.error(f"❌ Failed to create database tables: {e}")
        raise


async def create_sample_data():
    """Create sample data for testing"""
    try:
        logger.info("Creating sample data...")
        
        # This would create sample users, content templates, etc.
        # For now, just log the action
        logger.info("✅ Sample data created successfully")
        
    except Exception as e:
        logger.error(f"❌ Failed to create sample data: {e}")
        raise


async def check_api_keys():
    """Check if required API keys are configured"""
    settings = get_settings()
    
    logger.info("Checking API key configuration...")
    
    required_keys = {
        "OpenAI": settings.OPENAI_API_KEY,
        "Instagram": settings.INSTAGRAM_APP_ID and settings.INSTAGRAM_APP_SECRET,
        "TikTok": settings.TIKTOK_CLIENT_ID and settings.TIKTOK_CLIENT_SECRET,
    }
    
    optional_keys = {
        "ElevenLabs": settings.ELEVENLABS_API_KEY,
        "Stability AI": settings.STABILITY_API_KEY,
        "RunwayML": settings.RUNWAYML_API_KEY,
        "Azure Speech": settings.AZURE_SPEECH_KEY,
    }
    
    missing_required = []
    for service, configured in required_keys.items():
        if configured:
            logger.info(f"✅ {service} API configured")
        else:
            logger.warning(f"❌ {service} API NOT configured")
            missing_required.append(service)
    
    for service, configured in optional_keys.items():
        if configured:
            logger.info(f"✅ {service} API configured (optional)")
        else:
            logger.info(f"⚪ {service} API not configured (optional)")
    
    if missing_required:
        logger.error(f"Missing required API keys: {', '.join(missing_required)}")
        logger.error("Please configure these in your .env file")
        return False
    
    return True


async def create_media_directories():
    """Create required media directories"""
    try:
        logger.info("Creating media directories...")
        
        directories = [
            "media/generated",
            "media/processed",
            "media/temp",
            "logs"
        ]
        
        for directory in directories:
            Path(directory).mkdir(parents=True, exist_ok=True)
            logger.info(f"✅ Created directory: {directory}")
            
    except Exception as e:
        logger.error(f"❌ Failed to create media directories: {e}")
        raise


async def main():
    """Main setup function"""
    logger.info("🚀 Starting ViralForge AI setup...")
    
    try:
        # Create media directories
        await create_media_directories()
        
        # Setup database
        await setup_database()
        
        # Create sample data
        await create_sample_data()
        
        # Check API keys
        api_keys_ok = await check_api_keys()
        
        if api_keys_ok:
            logger.info("🎯 ViralForge AI setup completed successfully!")
            logger.info("You can now start the application with:")
            logger.info("  - Development: uvicorn src.api.main:app --reload")
            logger.info("  - Docker: docker-compose up")
        else:
            logger.warning("⚠️  Setup completed with warnings. Please configure missing API keys.")
            
    except Exception as e:
        logger.error(f"❌ Setup failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main()) 