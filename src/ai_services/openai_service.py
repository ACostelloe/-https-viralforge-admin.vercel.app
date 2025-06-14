"""
OpenAI service integration for content generation and DALL-E image creation
"""

import openai
import asyncio
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime
import json

from ..core.config import get_settings
from ..core.models import ContentType

logger = logging.getLogger(__name__)

# Get settings
settings = get_settings()

# Configure OpenAI
if settings.OPENAI_API_KEY:
    openai.api_key = settings.OPENAI_API_KEY


class OpenAIService:
    """OpenAI integration service for content generation"""
    
    def __init__(self):
        self.client = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
    
    async def generate_content_script(
        self,
        content_type: ContentType,
        topic: str,
        target_audience: Dict[str, Any],
        duration_seconds: int = 30,
        location: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Generate content script using GPT-4
        """
        try:
            # Build the prompt based on content type
            prompt = self._build_content_prompt(
                content_type, topic, target_audience, duration_seconds, location
            )
            
            response = await self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {
                        "role": "system",
                        "content": self._get_system_prompt(content_type)
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=800,
                temperature=0.8,
                top_p=0.9
            )
            
            content_text = response.choices[0].message.content
            
            # Parse structured response if JSON format
            try:
                content_data = json.loads(content_text)
            except json.JSONDecodeError:
                # Fallback to plain text
                content_data = {
                    "script": content_text,
                    "title": topic,
                    "description": f"AI-generated {content_type.value} content"
                }
            
            # Track API usage
            await self._track_api_usage(
                "gpt-4o",
                response.usage.total_tokens,
                content_type.value
            )
            
            return content_data
            
        except Exception as e:
            logger.error(f"Failed to generate content script: {e}")
            raise
    
    async def generate_image_prompt(
        self,
        content: str,
        style: str = "modern",
        aspect_ratio: str = "9:16"
    ) -> str:
        """
        Generate an optimized DALL-E prompt for the content
        """
        try:
            prompt = f"""
            Create a detailed DALL-E prompt for generating a {aspect_ratio} aspect ratio image that complements this content:
            
            Content: {content[:500]}
            Style: {style}
            
            Requirements:
            - Visual, engaging, and suitable for social media
            - No text overlays (will be added separately)
            - High contrast and vibrant colors
            - Professional quality
            - Safe for all audiences
            
            Provide only the DALL-E prompt, no additional text.
            """
            
            response = await self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert at creating visual prompts for AI image generation."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=200,
                temperature=0.7
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            logger.error(f"Failed to generate image prompt: {e}")
            raise
    
    async def generate_image(
        self,
        prompt: str,
        size: str = "1024x1792",  # 9:16 aspect ratio
        quality: str = "hd"
    ) -> Dict[str, Any]:
        """
        Generate image using DALL-E 3
        """
        try:
            response = await self.client.images.generate(
                model="dall-e-3",
                prompt=prompt,
                size=size,
                quality=quality,
                n=1
            )
            
            image_data = {
                "url": response.data[0].url,
                "revised_prompt": response.data[0].revised_prompt,
                "size": size,
                "quality": quality
            }
            
            # Track API usage
            await self._track_api_usage("dall-e-3", 1, "image_generation")
            
            return image_data
            
        except Exception as e:
            logger.error(f"Failed to generate image: {e}")
            raise
    
    async def generate_hashtags(
        self,
        content: str,
        platform: str,
        max_hashtags: int = 30
    ) -> List[str]:
        """
        Generate relevant hashtags for the content
        """
        try:
            prompt = f"""
            Generate {max_hashtags} relevant hashtags for this {platform} post:
            
            Content: {content[:300]}
            
            Requirements:
            - Mix of popular and niche hashtags
            - Platform-specific best practices
            - Include trending keywords when relevant
            - No banned or problematic hashtags
            - Format: #hashtag (one per line)
            
            Return only the hashtags, one per line.
            """
            
            response = await self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a social media marketing expert specializing in hashtag strategy."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=400,
                temperature=0.6
            )
            
            hashtags_text = response.choices[0].message.content
            hashtags = [
                tag.strip().replace("#", "")
                for tag in hashtags_text.split("\n")
                if tag.strip() and tag.strip().startswith("#")
            ]
            
            return hashtags[:max_hashtags]
            
        except Exception as e:
            logger.error(f"Failed to generate hashtags: {e}")
            return []
    
    async def generate_caption(
        self,
        content: str,
        platform: str,
        tone: str = "engaging",
        include_cta: bool = True
    ) -> str:
        """
        Generate social media caption
        """
        try:
            cta_instruction = "Include a call-to-action" if include_cta else "No call-to-action needed"
            
            prompt = f"""
            Create an engaging {platform} caption for this content:
            
            Content: {content[:400]}
            Tone: {tone}
            {cta_instruction}
            
            Requirements:
            - Optimized for {platform} algorithm
            - Hook in the first line
            - Use line breaks for readability
            - {platform}-appropriate length
            - Encourage engagement
            
            Return only the caption text.
            """
            
            response = await self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {
                        "role": "system",
                        "content": f"You are a {platform} content creator known for viral, engaging posts."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=300,
                temperature=0.7
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            logger.error(f"Failed to generate caption: {e}")
            return content[:200] + "..."
    
    def _build_content_prompt(
        self,
        content_type: ContentType,
        topic: str,
        target_audience: Dict[str, Any],
        duration_seconds: int,
        location: Optional[str] = None
    ) -> str:
        """Build content generation prompt based on type"""
        
        audience_info = f"Target audience: {target_audience.get('age_groups', 'general')}, interests: {target_audience.get('interests', 'general')}"
        location_info = f"Location context: {location}" if location else ""
        
        base_prompt = f"""
        Create {content_type.value} content about: {topic}
        
        {audience_info}
        {location_info}
        Target duration: {duration_seconds} seconds (for video narration)
        
        """
        
        if content_type == ContentType.FACTS:
            return base_prompt + """
            Requirements:
            - Share a fascinating, lesser-known fact
            - Make it surprising and memorable
            - Include context or explanation
            - Suitable for short-form video
            
            Return JSON format:
            {
                "title": "Hook title",
                "script": "Full narration script",
                "fact": "The main fact",
                "description": "Brief description",
                "sources": ["credible sources if available"]
            }
            """
            
        elif content_type == ContentType.TRIVIA:
            return base_prompt + """
            Requirements:
            - Create an interesting trivia question and answer
            - Make it engaging and shareable
            - Include surprising or fun details
            - Perfect for audience interaction
            
            Return JSON format:
            {
                "title": "Trivia hook",
                "question": "The trivia question",
                "answer": "The answer with explanation",
                "script": "Full narration script",
                "description": "Brief description"
            }
            """
            
        elif content_type == ContentType.MEMES:
            return base_prompt + """
            Requirements:
            - Create relatable, humorous content
            - Use current trends or timeless humor
            - Keep it light and entertaining
            - Avoid controversial topics
            
            Return JSON format:
            {
                "title": "Meme title",
                "script": "Narration or text overlay script",
                "concept": "Visual concept description",
                "description": "Brief description",
                "humor_type": "Type of humor used"
            }
            """
            
        elif content_type == ContentType.QUOTES:
            return base_prompt + """
            Requirements:
            - Create inspiring or thought-provoking quote
            - Can be original or well-known with attribution
            - Include context or explanation
            - Motivational and shareable
            
            Return JSON format:
            {
                "title": "Quote theme",
                "quote": "The main quote",
                "author": "Quote author or 'Original'",
                "script": "Narration expanding on the quote",
                "description": "Brief description",
                "context": "Background context"
            }
            """
            
        elif content_type == ContentType.LOCATION_CONTENT:
            return base_prompt + """
            Requirements:
            - Share interesting information about the location
            - Include local facts, history, or culture
            - Make it travel/location-focused
            - Educational yet entertaining
            
            Return JSON format:
            {
                "title": "Location hook",
                "script": "Full narration about the location",
                "location_fact": "Main interesting fact",
                "description": "Brief description",
                "travel_tip": "Optional travel tip"
            }
            """
        
        return base_prompt + "Create engaging content suitable for social media."
    
    def _get_system_prompt(self, content_type: ContentType) -> str:
        """Get system prompt based on content type"""
        
        base_system = """You are ViralForge AI, an expert content creator for social media platforms like Instagram and TikTok. You specialize in creating viral, engaging short-form content that resonates with audiences."""
        
        type_specific = {
            ContentType.FACTS: "You excel at finding and presenting fascinating facts that make people say 'I didn't know that!'",
            ContentType.TRIVIA: "You create engaging trivia that sparks curiosity and encourages audience participation.",
            ContentType.MEMES: "You understand viral humor and create relatable, shareable meme content.",
            ContentType.QUOTES: "You craft inspiring quotes and expand on their meaning in compelling ways.",
            ContentType.LOCATION_CONTENT: "You bring locations to life with interesting stories, facts, and cultural insights."
        }
        
        return f"{base_system} {type_specific.get(content_type, '')}"
    
    async def _track_api_usage(
        self,
        service: str,
        tokens_or_units: int,
        operation_type: str
    ):
        """Track API usage for cost monitoring"""
        try:
            # This would typically save to database
            # For now, just log the usage
            logger.info(f"OpenAI API usage - Service: {service}, Units: {tokens_or_units}, Operation: {operation_type}")
        except Exception as e:
            logger.error(f"Failed to track API usage: {e}")


# Global service instance
openai_service = OpenAIService()


def get_openai_service() -> OpenAIService:
    """Get the OpenAI service instance"""
    return openai_service 