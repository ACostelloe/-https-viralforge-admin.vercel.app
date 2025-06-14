"""
Configuration management for ViralForge AI
"""

import os
from typing import List, Optional
from pydantic import BaseSettings, Field, validator
from enum import Enum


class LogLevel(str, Enum):
    DEBUG = "DEBUG"
    INFO = "INFO"
    WARNING = "WARNING"
    ERROR = "ERROR"
    CRITICAL = "CRITICAL"


class ContentType(str, Enum):
    FACTS = "facts"
    TRIVIA = "trivia"
    MEMES = "memes"
    QUOTES = "quotes"
    LOCATION_CONTENT = "location_content"


class VideoQuality(str, Enum):
    HD_720P = "720p"
    FHD_1080P = "1080p"
    UHD_4K = "4k"


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables
    """
    
    # =================================
    # Application Settings
    # =================================
    APP_NAME: str = "ViralForge AI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    LOG_LEVEL: LogLevel = LogLevel.INFO
    SECRET_KEY: str = Field(..., description="Secret key for JWT and encryption")
    
    # =================================
    # Database Configuration
    # =================================
    DATABASE_URL: str = Field(..., description="PostgreSQL database URL")
    DATABASE_ECHO: bool = False
    
    # =================================
    # Redis Configuration
    # =================================
    REDIS_URL: str = Field(default="redis://localhost:6379/0")
    CELERY_BROKER_URL: str = Field(default="redis://localhost:6379/0")
    CELERY_RESULT_BACKEND: str = Field(default="redis://localhost:6379/0")
    
    # =================================
    # AI Service API Keys
    # =================================
    OPENAI_API_KEY: Optional[str] = Field(None, description="OpenAI API key for GPT-4 and DALL-E")
    ANTHROPIC_API_KEY: Optional[str] = Field(None, description="Anthropic API key for Claude")
    STABILITY_API_KEY: Optional[str] = Field(None, description="Stability AI API key")
    ELEVENLABS_API_KEY: Optional[str] = Field(None, description="ElevenLabs TTS API key")
    AZURE_SPEECH_KEY: Optional[str] = Field(None, description="Azure Speech Services key")
    AZURE_SPEECH_REGION: Optional[str] = Field(None, description="Azure Speech Services region")
    RUNWAYML_API_KEY: Optional[str] = Field(None, description="RunwayML API key")
    PIKA_LABS_API_KEY: Optional[str] = Field(None, description="Pika Labs API key")
    SYNTHESIA_API_KEY: Optional[str] = Field(None, description="Synthesia API key")
    
    # =================================
    # Social Media Platform APIs
    # =================================
    INSTAGRAM_APP_ID: Optional[str] = Field(None, description="Instagram App ID")
    INSTAGRAM_APP_SECRET: Optional[str] = Field(None, description="Instagram App Secret")
    INSTAGRAM_ACCESS_TOKEN: Optional[str] = Field(None, description="Instagram Access Token")
    
    TIKTOK_CLIENT_ID: Optional[str] = Field(None, description="TikTok Client ID")
    TIKTOK_CLIENT_SECRET: Optional[str] = Field(None, description="TikTok Client Secret")
    TIKTOK_ACCESS_TOKEN: Optional[str] = Field(None, description="TikTok Access Token")
    
    # =================================
    # External APIs
    # =================================
    GOOGLE_TRENDS_ENABLED: bool = True
    GOOGLE_PLACES_API_KEY: Optional[str] = Field(None, description="Google Places API key")
    IPSTACK_API_KEY: Optional[str] = Field(None, description="IPStack API key")
    
    # =================================
    # AWS Configuration
    # =================================
    AWS_ACCESS_KEY_ID: Optional[str] = Field(None, description="AWS Access Key ID")
    AWS_SECRET_ACCESS_KEY: Optional[str] = Field(None, description="AWS Secret Access Key")
    AWS_REGION: str = Field(default="us-east-1", description="AWS Region")
    AWS_S3_BUCKET: Optional[str] = Field(None, description="AWS S3 bucket for assets")
    
    # =================================
    # Content Generation Settings
    # =================================
    DAILY_CONTENT_COUNT: int = Field(default=3, ge=1, le=50, description="Daily content count")
    CONTENT_TYPES: List[ContentType] = Field(
        default=[ContentType.FACTS, ContentType.TRIVIA, ContentType.MEMES],
        description="Content types to generate"
    )
    
    VIDEO_DURATION_MIN: int = Field(default=10, ge=5, le=60, description="Min video duration (seconds)")
    VIDEO_DURATION_MAX: int = Field(default=60, ge=10, le=180, description="Max video duration (seconds)")
    VIDEO_QUALITY: VideoQuality = Field(default=VideoQuality.FHD_1080P, description="Video quality")
    
    TTS_VOICE_ID: str = Field(default="default", description="Text-to-speech voice ID")
    TTS_STABILITY: float = Field(default=0.75, ge=0.0, le=1.0, description="TTS stability")
    TTS_SIMILARITY_BOOST: float = Field(default=0.75, ge=0.0, le=1.0, description="TTS similarity boost")
    
    # =================================
    # Scheduling & Automation
    # =================================
    TIMEZONE: str = Field(default="UTC", description="Timezone for scheduling")
    AUTO_POSTING_ENABLED: bool = Field(default=True, description="Enable automatic posting")
    
    INSTAGRAM_POSTS_PER_DAY: int = Field(default=2, ge=0, le=20, description="Instagram posts per day")
    TIKTOK_POSTS_PER_DAY: int = Field(default=3, ge=0, le=20, description="TikTok posts per day")
    
    # =================================
    # Target Audience Settings
    # =================================
    TARGET_LOCATIONS: List[str] = Field(
        default=["US", "CA", "GB", "AU"],
        description="Target location country codes"
    )
    TARGET_AGE_GROUPS: List[str] = Field(
        default=["18-24", "25-34", "35-44"],
        description="Target age groups"
    )
    
    PRIMARY_LANGUAGE: str = Field(default="en", description="Primary language code")
    MULTILINGUAL_ENABLED: bool = Field(default=False, description="Enable multilingual content")
    SUPPORTED_LANGUAGES: List[str] = Field(
        default=["en", "es", "fr", "de"],
        description="Supported language codes"
    )
    
    # =================================
    # Analytics & Monitoring
    # =================================
    ANALYTICS_ENABLED: bool = Field(default=True, description="Enable analytics tracking")
    MIN_ENGAGEMENT_RATE: float = Field(
        default=0.02, ge=0.0, le=1.0, 
        description="Minimum engagement rate threshold"
    )
    ANALYTICS_REPORT_FREQUENCY: int = Field(
        default=24, ge=1, le=168,
        description="Analytics report frequency (hours)"
    )
    
    # =================================
    # Security Settings
    # =================================
    JWT_SECRET_KEY: str = Field(..., description="JWT secret key")
    JWT_ALGORITHM: str = Field(default="HS256", description="JWT algorithm")
    JWT_EXPIRATION_HOURS: int = Field(default=24, ge=1, le=168, description="JWT expiration hours")
    
    RATE_LIMIT_PER_MINUTE: int = Field(default=60, ge=1, le=1000, description="Rate limit per minute")
    RATE_LIMIT_PER_HOUR: int = Field(default=1000, ge=1, le=10000, description="Rate limit per hour")
    
    # =================================
    # Notifications
    # =================================
    SLACK_WEBHOOK_URL: Optional[str] = Field(None, description="Slack webhook URL")
    
    SMTP_SERVER: Optional[str] = Field(None, description="SMTP server")
    SMTP_PORT: int = Field(default=587, description="SMTP port")
    SMTP_USERNAME: Optional[str] = Field(None, description="SMTP username")
    SMTP_PASSWORD: Optional[str] = Field(None, description="SMTP password")
    NOTIFICATION_EMAIL: Optional[str] = Field(None, description="Notification email")
    
    # =================================
    # Development Settings
    # =================================
    DEVELOPMENT_MODE: bool = Field(default=False, description="Development mode")
    MOCK_API_CALLS: bool = Field(default=False, description="Mock API calls for testing")
    
    TEST_INSTAGRAM_ACCOUNT: Optional[str] = Field(None, description="Test Instagram account")
    TEST_TIKTOK_ACCOUNT: Optional[str] = Field(None, description="Test TikTok account")
    
    @validator('VIDEO_DURATION_MAX')
    def validate_video_duration(cls, v, values):
        if 'VIDEO_DURATION_MIN' in values and v <= values['VIDEO_DURATION_MIN']:
            raise ValueError('VIDEO_DURATION_MAX must be greater than VIDEO_DURATION_MIN')
        return v
    
    @validator('CONTENT_TYPES', pre=True)
    def parse_content_types(cls, v):
        if isinstance(v, str):
            return [ContentType(item.strip()) for item in v.split(',')]
        return v
    
    @validator('TARGET_LOCATIONS', pre=True)
    def parse_target_locations(cls, v):
        if isinstance(v, str):
            return [item.strip().upper() for item in v.split(',')]
        return v
    
    @validator('TARGET_AGE_GROUPS', pre=True)
    def parse_target_age_groups(cls, v):
        if isinstance(v, str):
            return [item.strip() for item in v.split(',')]
        return v
    
    @validator('SUPPORTED_LANGUAGES', pre=True)
    def parse_supported_languages(cls, v):
        if isinstance(v, str):
            return [item.strip().lower() for item in v.split(',')]
        return v
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        validate_assignment = True


# Global settings instance
settings = Settings()


def get_settings() -> Settings:
    """
    Get the global settings instance
    """
    return settings


def reload_settings() -> Settings:
    """
    Reload settings from environment (useful for testing)
    """
    global settings
    settings = Settings()
    return settings 