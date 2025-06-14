# ViralForge AI - Development Guide 🛠️

This guide provides comprehensive information for developers working with ViralForge AI.

## 🏗️ System Architecture

### Core Components

```
┌─────────────────────────────────────────────────────────────┐
│                    ViralForge AI System                     │
├─────────────────┬─────────────────┬─────────────────────────┤
│   Frontend      │   Backend API   │   Background Workers    │
│                 │                 │                         │
│ • Admin Panel   │ • FastAPI       │ • Celery Workers        │
│ • Monitoring    │ • REST API      │ • Content Generation    │
│ • Configuration │ • Authentication│ • Social Media Posting  │
│                 │ • Rate Limiting │ • Analytics Processing  │
└─────────────────┴─────────────────┴─────────────────────────┘
            │                │                      │
┌───────────▼────┐  ┌────────▼─────┐    ┌──────────▼───────────┐
│   Database     │  │  Redis Cache │    │   AI Services        │
│                │  │              │    │                      │
│ • PostgreSQL   │  │ • Task Queue │    │ • OpenAI GPT-4       │
│ • User Data    │  │ • Session    │    │ • DALL-E 3           │
│ • Content      │  │ • Rate Limit │    │ • ElevenLabs TTS     │
│ • Analytics    │  │              │    │ • Stability AI       │
└────────────────┘  └──────────────┘    └──────────────────────┘
            │                                       │
┌───────────▼─────────────────────────────────────▼─────────────┐
│                Social Media Platforms                        │
│                                                               │
│        Instagram Graph API      │      TikTok Creator API     │
│        • Feed Posting           │      • Video Upload         │
│        • Story Publishing       │      • Hashtag Management   │
│        • Analytics Retrieval    │      • Performance Metrics  │
└───────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Content Generation Pipeline**
   ```
   Trending Topics → AI Content Generation → Media Creation → 
   Hashtag Generation → Platform Optimization → Scheduling
   ```

2. **Posting Pipeline**
   ```
   Scheduled Content → Platform APIs → Post Publishing → 
   Performance Tracking → Analytics Update → Feedback Loop
   ```

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose
- AI Service API Keys (OpenAI, etc.)

### Local Development Setup

1. **Clone and Setup Environment**
   ```bash
   git clone <repository>
   cd viralforge-ai
   
   # Create virtual environment
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   # or
   venv\Scripts\activate     # Windows
   
   # Install dependencies
   pip install -r requirements.txt
   ```

2. **Configure Environment Variables**
   ```bash
   cp config.env.example .env
   # Edit .env with your API keys and settings
   ```

3. **Start Dependencies with Docker**
   ```bash
   # Start only database and Redis
   docker-compose up postgres redis -d
   ```

4. **Initialize Database**
   ```bash
   python scripts/setup.py
   ```

5. **Start Development Server**
   ```bash
   # API Server
   uvicorn src.api.main:app --reload --host 0.0.0.0 --port 8000
   
   # Celery Worker (separate terminal)
   celery -A src.core.celery_app worker --loglevel=info
   
   # Celery Beat Scheduler (separate terminal)
   celery -A src.core.celery_app beat --loglevel=info
   ```

### Docker Development Setup

```bash
# Start all services
docker-compose up

# Or start specific services
docker-compose up viralforge-api viralforge-worker postgres redis
```

## 📊 API Documentation

### Base URL
- Development: `http://localhost:8000`
- Production: `https://your-domain.com`

### Authentication
- Development: No authentication required
- Production: Bearer token authentication

### Core Endpoints

#### Content Generation
```
POST /api/v1/content/generate
POST /api/v1/content/generate/bulk
GET  /api/v1/content/stats
```

#### Social Media Management
```
GET  /api/v1/social/accounts
POST /api/v1/social/schedule
GET  /api/v1/social/posts
```

#### Analytics
```
GET  /api/v1/analytics/
GET  /api/v1/analytics/performance
GET  /api/v1/analytics/trends
```

#### System Health
```
GET  /health/
GET  /health/detailed
GET  /health/readiness
GET  /health/liveness
```

### Example API Usage

**Generate Content:**
```bash
curl -X POST "http://localhost:8000/api/v1/content/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "content_type": "facts",
    "topic": "space exploration",
    "location": "US"
  }'
```

**Bulk Generation:**
```bash
curl -X POST "http://localhost:8000/api/v1/content/generate/bulk" \
  -H "Content-Type: application/json" \
  -d '{
    "count": 5,
    "content_types": ["facts", "trivia", "quotes"]
  }'
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=src --cov-report=html

# Run specific test file
pytest tests/test_content_generation.py

# Run integration tests
pytest tests/integration/
```

### Test Categories
- **Unit Tests**: Individual component testing
- **Integration Tests**: API endpoint testing
- **End-to-End Tests**: Full workflow testing
- **Performance Tests**: Load and stress testing

## 🔧 Development Workflow

### Adding New Features

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/new-ai-service
   ```

2. **Implement Feature**
   - Add service in `src/ai_services/`
   - Create tests in `tests/`
   - Update configuration if needed
   - Add API endpoints if required

3. **Test Implementation**
   ```bash
   pytest tests/test_your_feature.py
   ```

4. **Update Documentation**
   - Add to README.md if user-facing
   - Update DEVELOPMENT.md if dev-related
   - Add docstrings to new functions

5. **Create Pull Request**

### Code Style
- **Formatter**: Black
- **Linter**: Flake8
- **Type Checking**: MyPy
- **Import Sorting**: isort

```bash
# Format code
black src/
flake8 src/
mypy src/
isort src/
```

## 🚀 Deployment

### Production Deployment

1. **Environment Variables**
   ```bash
   # Required production variables
   SECRET_KEY=your-production-secret
   DATABASE_URL=postgresql://...
   OPENAI_API_KEY=sk-...
   INSTAGRAM_ACCESS_TOKEN=...
   TIKTOK_ACCESS_TOKEN=...
   ```

2. **Docker Production Build**
   ```bash
   docker build -t viralforge-ai:latest .
   docker-compose -f docker-compose.prod.yml up -d
   ```

3. **AWS/Cloud Deployment**
   - Use provided Kubernetes manifests
   - Configure AWS RDS for database
   - Set up AWS ElastiCache for Redis
   - Use AWS S3 for media storage

### Monitoring & Logging

- **Health Checks**: `/health/detailed`
- **Metrics**: Prometheus endpoints
- **Logs**: Structured JSON logging
- **Alerts**: Configurable via Slack/Email

## 🔍 Debugging

### Common Issues

1. **OpenAI API Errors**
   ```bash
   # Check API key configuration
   echo $OPENAI_API_KEY
   
   # Test API connectivity
   curl -H "Authorization: Bearer $OPENAI_API_KEY" \
     https://api.openai.com/v1/models
   ```

2. **Database Connection Issues**
   ```bash
   # Check database connectivity
   psql $DATABASE_URL -c "SELECT 1;"
   
   # Reset database
   python scripts/setup.py --reset-db
   ```

3. **Celery Task Issues**
   ```bash
   # Monitor Celery tasks
   celery -A src.core.celery_app inspect active
   
   # Purge failed tasks
   celery -A src.core.celery_app purge
   ```

### Debug Mode
```bash
# Enable debug logging
export LOG_LEVEL=DEBUG
export DEBUG=True

# Run with debugger
python -m debugpy --listen 5678 --wait-for-client -m uvicorn src.api.main:app
```

## 📈 Performance Optimization

### Content Generation
- **Parallel Processing**: Multiple AI requests
- **Caching**: Redis for frequent requests
- **Rate Limiting**: Respect API limits
- **Batch Operations**: Bulk content generation

### Database Optimization
- **Indexing**: Key database fields
- **Connection Pooling**: SQLAlchemy pool
- **Query Optimization**: Efficient queries
- **Archival**: Old data cleanup

### Scaling
- **Horizontal Scaling**: Multiple workers
- **Load Balancing**: Nginx/ALB
- **Auto Scaling**: Based on queue length
- **CDN**: Static content delivery

## 🛠️ Contributing

### Development Standards
- Write comprehensive tests
- Follow PEP 8 style guidelines
- Add type hints to all functions
- Document all public APIs
- Use meaningful commit messages

### Pull Request Process
1. Fork the repository
2. Create feature branch
3. Implement changes with tests
4. Ensure all tests pass
5. Update documentation
6. Submit pull request

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Celery Documentation](https://docs.celeryproject.org/)
- [OpenAI API Documentation](https://platform.openai.com/docs/)
- [Instagram Graph API](https://developers.facebook.com/docs/instagram-api/)
- [TikTok Developer Documentation](https://developers.tiktok.com/)

## 🆘 Support

- **Issues**: GitHub issue tracker
- **Discussions**: GitHub discussions
- **Documentation**: This repository
- **Community**: Discord/Slack (if available)

---

**Happy coding! 🚀** 