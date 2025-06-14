"""
Celery configuration for background task processing
"""

from celery import Celery
from celery.schedules import crontab
import logging

from .config import get_settings

logger = logging.getLogger(__name__)

# Get settings
settings = get_settings()

# Create Celery app
celery_app = Celery(
    "viralforge_ai",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=[
        "src.content_pipeline.tasks",
        "src.social_platforms.tasks",
        "src.scheduler.tasks",
        "src.analytics.tasks",
        "src.ai_services.tasks",
    ]
)

# Celery configuration
celery_app.conf.update(
    # Task routing
    task_routes={
        "src.content_pipeline.tasks.*": {"queue": "content_generation"},
        "src.social_platforms.tasks.*": {"queue": "social_posting"},
        "src.scheduler.tasks.*": {"queue": "scheduling"},
        "src.analytics.tasks.*": {"queue": "analytics"},
        "src.ai_services.tasks.*": {"queue": "ai_processing"},
    },
    
    # Task serialization
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    
    # Task execution
    task_acks_late=True,
    worker_prefetch_multiplier=1,
    
    # Result backend settings
    result_expires=3600,  # 1 hour
    
    # Time zone
    timezone="UTC",
    enable_utc=True,
    
    # Task retry settings
    task_retry_max_retries=3,
    task_retry_delay=60,  # 1 minute
    
    # Worker settings
    worker_disable_rate_limits=False,
    worker_log_level="INFO",
)

# Periodic tasks (Celery Beat schedule)
celery_app.conf.beat_schedule = {
    # Content generation tasks
    "generate-daily-content": {
        "task": "src.content_pipeline.tasks.generate_daily_content",
        "schedule": crontab(hour=6, minute=0),  # 6 AM UTC daily
    },
    
    # Trend analysis
    "fetch-trending-topics": {
        "task": "src.content_pipeline.tasks.fetch_trending_topics",
        "schedule": crontab(minute=0, hour="*/4"),  # Every 4 hours
    },
    
    # Posting tasks
    "process-scheduled-posts": {
        "task": "src.social_platforms.tasks.process_scheduled_posts",
        "schedule": crontab(minute="*/15"),  # Every 15 minutes
    },
    
    # Analytics tasks
    "update-post-analytics": {
        "task": "src.analytics.tasks.update_post_analytics",
        "schedule": crontab(minute=30, hour="*/2"),  # Every 2 hours at :30
    },
    
    "generate-analytics-report": {
        "task": "src.analytics.tasks.generate_analytics_report",
        "schedule": crontab(hour=9, minute=0),  # 9 AM UTC daily
    },
    
    # Maintenance tasks
    "cleanup-old-files": {
        "task": "src.core.tasks.cleanup_old_files",
        "schedule": crontab(hour=2, minute=0),  # 2 AM UTC daily
    },
    
    "refresh-social-tokens": {
        "task": "src.social_platforms.tasks.refresh_social_tokens",
        "schedule": crontab(hour=3, minute=0),  # 3 AM UTC daily
    },
    
    # Health checks
    "system-health-check": {
        "task": "src.core.tasks.system_health_check",
        "schedule": crontab(minute="*/30"),  # Every 30 minutes
    },
}

# Task error handling
@celery_app.task(bind=True)
def debug_task(self):
    """Debug task for testing Celery setup"""
    print(f"Request: {self.request!r}")
    return "Celery is working!"


# Custom task base class for error handling
from celery import Task
from celery.exceptions import Retry


class CallbackTask(Task):
    """Base task class with error handling and callbacks"""
    
    def on_success(self, retval, task_id, args, kwargs):
        """Called on task success"""
        logger.info(f"Task {task_id} succeeded with result: {retval}")
    
    def on_failure(self, exc, task_id, args, kwargs, einfo):
        """Called on task failure"""
        logger.error(f"Task {task_id} failed: {exc}")
    
    def on_retry(self, exc, task_id, args, kwargs, einfo):
        """Called on task retry"""
        logger.warning(f"Task {task_id} retrying: {exc}")


# Register custom task base
celery_app.Task = CallbackTask


def get_celery_app():
    """Get the Celery app instance"""
    return celery_app 