"""
Database models for ViralForge AI
"""

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Float, JSON, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
from enum import Enum as PyEnum
import uuid

from .database import Base


class ContentStatus(PyEnum):
    DRAFT = "draft"
    GENERATED = "generated"
    SCHEDULED = "scheduled"
    POSTED = "posted"
    FAILED = "failed"
    ARCHIVED = "archived"


class Platform(PyEnum):
    INSTAGRAM = "instagram"
    TIKTOK = "tiktok"


class ContentType(PyEnum):
    FACTS = "facts"
    TRIVIA = "trivia"
    MEMES = "memes"
    QUOTES = "quotes"
    LOCATION_CONTENT = "location_content"


class User(Base):
    """
    User accounts and authentication
    """
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255))
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    social_accounts = relationship("SocialAccount", back_populates="user")
    content_items = relationship("ContentItem", back_populates="user")


class SocialAccount(Base):
    """
    Social media account connections
    """
    __tablename__ = "social_accounts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    platform = Column(Enum(Platform), nullable=False)
    account_id = Column(String(255), nullable=False)  # Platform-specific account ID
    account_username = Column(String(100), nullable=False)
    access_token = Column(Text)  # Encrypted access token
    refresh_token = Column(Text)  # Encrypted refresh token
    token_expires_at = Column(DateTime(timezone=True))
    
    is_active = Column(Boolean, default=True)
    last_sync = Column(DateTime(timezone=True))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="social_accounts")
    posts = relationship("Post", back_populates="social_account")


class ContentItem(Base):
    """
    Generated content items (scripts, ideas, etc.)
    """
    __tablename__ = "content_items"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    title = Column(String(255), nullable=False)
    content_type = Column(Enum(ContentType), nullable=False)
    script = Column(Text)  # Main text content
    description = Column(Text)
    hashtags = Column(JSON)  # List of hashtags
    
    # AI generation metadata
    ai_model_used = Column(String(100))  # e.g., "gpt-4", "claude-3"
    generation_prompt = Column(Text)
    generation_metadata = Column(JSON)  # Additional AI generation data
    
    # Location and targeting
    target_locations = Column(JSON)  # List of target location codes
    target_demographics = Column(JSON)  # Target age groups, interests, etc.
    
    status = Column(Enum(ContentStatus), default=ContentStatus.DRAFT)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="content_items")
    media_assets = relationship("MediaAsset", back_populates="content_item")
    posts = relationship("Post", back_populates="content_item")


class MediaAsset(Base):
    """
    Generated media assets (images, videos, audio)
    """
    __tablename__ = "media_assets"
    
    id = Column(Integer, primary_key=True, index=True)
    content_item_id = Column(Integer, ForeignKey("content_items.id"), nullable=False)
    
    asset_type = Column(String(50), nullable=False)  # image, video, audio
    file_path = Column(String(500))  # Local or S3 path
    file_url = Column(String(500))  # Public URL
    file_size = Column(Integer)  # Size in bytes
    mime_type = Column(String(100))
    
    # Media properties
    width = Column(Integer)
    height = Column(Integer)
    duration = Column(Float)  # Duration in seconds for video/audio
    
    # AI generation metadata
    ai_service_used = Column(String(100))  # e.g., "dall-e-3", "runwayml"
    generation_prompt = Column(Text)
    generation_parameters = Column(JSON)
    
    # Processing status
    is_processed = Column(Boolean, default=False)
    processing_status = Column(String(50))  # processing, completed, failed
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    content_item = relationship("ContentItem", back_populates="media_assets")


class Post(Base):
    """
    Posted content to social media platforms
    """
    __tablename__ = "posts"
    
    id = Column(Integer, primary_key=True, index=True)
    content_item_id = Column(Integer, ForeignKey("content_items.id"), nullable=False)
    social_account_id = Column(Integer, ForeignKey("social_accounts.id"), nullable=False)
    
    platform_post_id = Column(String(255))  # Platform-specific post ID
    platform = Column(Enum(Platform), nullable=False)
    
    caption = Column(Text)
    hashtags = Column(JSON)  # Final hashtags used
    media_urls = Column(JSON)  # URLs of posted media
    
    # Scheduling
    scheduled_at = Column(DateTime(timezone=True))
    posted_at = Column(DateTime(timezone=True))
    
    # Status and performance
    status = Column(Enum(ContentStatus), default=ContentStatus.SCHEDULED)
    post_url = Column(String(500))  # Direct link to the post
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    content_item = relationship("ContentItem", back_populates="posts")
    social_account = relationship("SocialAccount", back_populates="posts")
    analytics = relationship("PostAnalytics", back_populates="post")


class PostAnalytics(Base):
    """
    Post performance analytics
    """
    __tablename__ = "post_analytics"
    
    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False)
    
    # Engagement metrics
    views = Column(Integer, default=0)
    likes = Column(Integer, default=0)
    comments = Column(Integer, default=0)
    shares = Column(Integer, default=0)
    saves = Column(Integer, default=0)
    
    # Calculated metrics
    engagement_rate = Column(Float, default=0.0)
    reach = Column(Integer, default=0)
    impressions = Column(Integer, default=0)
    
    # Demographics data (if available)
    audience_demographics = Column(JSON)
    
    # Last update from platform API
    last_updated = Column(DateTime(timezone=True), server_default=func.now())
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    post = relationship("Post", back_populates="analytics")


class TrendingTopic(Base):
    """
    Trending topics and keywords
    """
    __tablename__ = "trending_topics"
    
    id = Column(Integer, primary_key=True, index=True)
    
    keyword = Column(String(255), nullable=False, index=True)
    source = Column(String(100), nullable=False)  # google_trends, tiktok, instagram
    category = Column(String(100))
    
    # Trend data
    search_volume = Column(Integer)
    trend_score = Column(Float)  # Custom scoring algorithm
    related_queries = Column(JSON)  # Related keywords/queries
    
    # Geographic data
    regions = Column(JSON)  # Regions where this is trending
    
    # Temporal data
    trending_since = Column(DateTime(timezone=True))
    peak_date = Column(DateTime(timezone=True))
    
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class ContentTemplate(Base):
    """
    Reusable content templates and formats
    """
    __tablename__ = "content_templates"
    
    id = Column(Integer, primary_key=True, index=True)
    
    name = Column(String(255), nullable=False)
    content_type = Column(Enum(ContentType), nullable=False)
    template_text = Column(Text, nullable=False)  # Template with placeholders
    
    # Template metadata
    description = Column(Text)
    tags = Column(JSON)  # Template tags for organization
    
    # Usage tracking
    usage_count = Column(Integer, default=0)
    avg_performance_score = Column(Float, default=0.0)
    
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class SystemLog(Base):
    """
    System logs and events
    """
    __tablename__ = "system_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    
    level = Column(String(20), nullable=False)  # INFO, WARNING, ERROR, etc.
    message = Column(Text, nullable=False)
    module = Column(String(100))  # Which module generated this log
    
    # Context data
    user_id = Column(Integer, ForeignKey("users.id"))
    content_item_id = Column(Integer, ForeignKey("content_items.id"))
    post_id = Column(Integer, ForeignKey("posts.id"))
    
    # Additional data
    metadata = Column(JSON)  # Additional context data
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class APIUsage(Base):
    """
    Track API usage and costs
    """
    __tablename__ = "api_usage"
    
    id = Column(Integer, primary_key=True, index=True)
    
    service_name = Column(String(100), nullable=False)  # openai, stability_ai, etc.
    endpoint = Column(String(200))
    
    # Usage metrics
    requests_count = Column(Integer, default=0)
    tokens_used = Column(Integer, default=0)  # For AI services
    data_processed = Column(Float, default=0.0)  # MB, seconds, etc.
    
    # Cost tracking
    estimated_cost = Column(Float, default=0.0)
    currency = Column(String(3), default="USD")
    
    # Time tracking
    date = Column(DateTime(timezone=True), server_default=func.now())
    
    # Additional metadata
    metadata = Column(JSON) 