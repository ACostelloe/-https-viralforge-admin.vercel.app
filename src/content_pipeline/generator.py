"""
Content generator that orchestrates AI services to create complete content pieces
"""

import asyncio
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime
import random

from ..core.config import get_settings, ContentType
from ..core.models import ContentItem, MediaAsset
from ..ai_services.openai_service import get_openai_service

logger = logging.getLogger(__name__)
settings = get_settings()


class ContentGenerator:
    """Main content generator orchestrating AI services"""
    
    def __init__(self):
        self.openai_service = get_openai_service()
    
    async def generate_content_piece(
        self,
        content_type: ContentType,
        topic: Optional[str] = None,
        target_audience: Optional[Dict[str, Any]] = None,
        location: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Generate a complete content piece with script, media, and metadata
        """
        try:
            logger.info(f"Generating {content_type.value} content - Topic: {topic}")
            
            # Use default audience if not provided
            if not target_audience:
                target_audience = {
                    "age_groups": settings.TARGET_AGE_GROUPS,
                    "locations": settings.TARGET_LOCATIONS,
                    "interests": ["general"]
                }
            
            # Generate topic if not provided
            if not topic:
                topic = await self._generate_topic(content_type, location)
            
            # Generate duration
            duration = random.randint(
                settings.VIDEO_DURATION_MIN,
                settings.VIDEO_DURATION_MAX
            )
            
            # Generate content script
            content_data = await self.openai_service.generate_content_script(
                content_type=content_type,
                topic=topic,
                target_audience=target_audience,
                duration_seconds=duration,
                location=location
            )
            
            # Generate hashtags
            hashtags = await self.openai_service.generate_hashtags(
                content=content_data.get("script", ""),
                platform="instagram",  # Default platform
                max_hashtags=20
            )
            
            # Generate image prompt and create image
            image_prompt = await self.openai_service.generate_image_prompt(
                content=content_data.get("script", ""),
                style="modern",
                aspect_ratio="9:16"
            )
            
            # Generate image
            image_data = await self.openai_service.generate_image(
                prompt=image_prompt,
                size="1024x1792"  # 9:16 aspect ratio
            )
            
            # Compile final content piece
            final_content = {
                "content_type": content_type.value,
                "title": content_data.get("title", topic),
                "script": content_data.get("script", ""),
                "description": content_data.get("description", ""),
                "duration_seconds": duration,
                "hashtags": hashtags,
                "target_audience": target_audience,
                "location": location,
                "media_assets": [
                    {
                        "type": "image",
                        "url": image_data["url"],
                        "prompt": image_prompt,
                        "revised_prompt": image_data.get("revised_prompt", ""),
                        "size": image_data["size"]
                    }
                ],
                "generated_at": datetime.utcnow().isoformat(),
                "ai_metadata": {
                    "content_model": "gpt-4o",
                    "image_model": "dall-e-3",
                    "generation_parameters": {
                        "temperature": 0.8,
                        "image_quality": "hd"
                    }
                }
            }
            
            # Add content-specific fields
            if content_type == ContentType.FACTS:
                final_content["fact"] = content_data.get("fact", "")
                final_content["sources"] = content_data.get("sources", [])
            elif content_type == ContentType.TRIVIA:
                final_content["question"] = content_data.get("question", "")
                final_content["answer"] = content_data.get("answer", "")
            elif content_type == ContentType.QUOTES:
                final_content["quote"] = content_data.get("quote", "")
                final_content["author"] = content_data.get("author", "")
                final_content["context"] = content_data.get("context", "")
            elif content_type == ContentType.MEMES:
                final_content["concept"] = content_data.get("concept", "")
                final_content["humor_type"] = content_data.get("humor_type", "")
            elif content_type == ContentType.LOCATION_CONTENT:
                final_content["location_fact"] = content_data.get("location_fact", "")
                final_content["travel_tip"] = content_data.get("travel_tip", "")
            
            logger.info(f"Successfully generated {content_type.value} content: {final_content['title']}")
            return final_content
            
        except Exception as e:
            logger.error(f"Failed to generate content piece: {e}")
            raise
    
    async def generate_multiple_content_pieces(
        self,
        count: int,
        content_types: Optional[List[ContentType]] = None,
        locations: Optional[List[str]] = None
    ) -> List[Dict[str, Any]]:
        """
        Generate multiple content pieces in parallel
        """
        try:
            if not content_types:
                content_types = settings.CONTENT_TYPES
            
            if not locations:
                locations = settings.TARGET_LOCATIONS
            
            # Create tasks for parallel generation
            tasks = []
            for i in range(count):
                content_type = random.choice(content_types)
                location = random.choice(locations) if locations else None
                
                task = self.generate_content_piece(
                    content_type=content_type,
                    location=location
                )
                tasks.append(task)
            
            # Execute all tasks in parallel
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Filter out exceptions and log errors
            successful_results = []
            for i, result in enumerate(results):
                if isinstance(result, Exception):
                    logger.error(f"Content generation {i+1} failed: {result}")
                else:
                    successful_results.append(result)
            
            logger.info(f"Generated {len(successful_results)} out of {count} content pieces")
            return successful_results
            
        except Exception as e:
            logger.error(f"Failed to generate multiple content pieces: {e}")
            raise
    
    async def _generate_topic(
        self,
        content_type: ContentType,
        location: Optional[str] = None
    ) -> str:
        """
        Generate a topic for the given content type and location
        """
        try:
            # You could integrate with trending topics here
            # For now, use predefined topics based on content type
            
            topics_by_type = {
                ContentType.FACTS: [
                    "space exploration",
                    "ocean depths",
                    "human psychology",
                    "animal behavior",
                    "historical mysteries",
                    "scientific discoveries",
                    "technology innovations",
                    "cultural traditions"
                ],
                ContentType.TRIVIA: [
                    "movie trivia",
                    "sports facts",
                    "geography quiz",
                    "science trivia",
                    "history questions",
                    "pop culture",
                    "food trivia",
                    "nature facts"
                ],
                ContentType.MEMES: [
                    "daily struggles",
                    "work life",
                    "technology problems",
                    "social media habits",
                    "food cravings",
                    "weather moods",
                    "weekend plans",
                    "online shopping"
                ],
                ContentType.QUOTES: [
                    "motivation",
                    "success mindset",
                    "personal growth",
                    "relationships",
                    "creativity",
                    "perseverance",
                    "wisdom",
                    "happiness"
                ],
                ContentType.LOCATION_CONTENT: [
                    f"hidden gems in {location}" if location else "travel destinations",
                    f"local culture of {location}" if location else "cultural diversity",
                    f"history of {location}" if location else "historical places",
                    f"food specialties in {location}" if location else "world cuisine"
                ]
            }
            
            available_topics = topics_by_type.get(content_type, ["general interest"])
            return random.choice(available_topics)
            
        except Exception as e:
            logger.error(f"Failed to generate topic: {e}")
            return "interesting facts"
    
    async def generate_platform_specific_content(
        self,
        base_content: Dict[str, Any],
        platform: str
    ) -> Dict[str, Any]:
        """
        Adapt content for specific platform requirements
        """
        try:
            platform_content = base_content.copy()
            
            # Generate platform-specific caption
            caption = await self.openai_service.generate_caption(
                content=base_content["script"],
                platform=platform.lower(),
                tone="engaging",
                include_cta=True
            )
            
            # Generate platform-specific hashtags
            hashtags = await self.openai_service.generate_hashtags(
                content=base_content["script"],
                platform=platform.lower(),
                max_hashtags=30 if platform.lower() == "instagram" else 10
            )
            
            platform_content.update({
                "platform": platform.lower(),
                "caption": caption,
                "hashtags": hashtags[:30 if platform.lower() == "instagram" else 10],
                "adapted_at": datetime.utcnow().isoformat()
            })
            
            return platform_content
            
        except Exception as e:
            logger.error(f"Failed to adapt content for {platform}: {e}")
            return base_content


# Global generator instance
content_generator = ContentGenerator()


def get_content_generator() -> ContentGenerator:
    """Get the content generator instance"""
    return content_generator 