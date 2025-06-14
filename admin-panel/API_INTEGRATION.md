# API Integration Guide

## Overview

This document provides comprehensive information about integrating the ViralForge Admin Panel with various APIs and services required for production deployment.

## Required API Keys & Services

### 1. OpenAI API (Required)
**Purpose**: AI content generation and optimization

```bash
# Environment Variables
VITE_OPENAI_API_KEY=sk-your-openai-api-key-here
VITE_OPENAI_MODEL=gpt-4
VITE_OPENAI_MAX_TOKENS=1000
```

**Setup Steps**:
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account and verify your phone number
3. Navigate to API Keys section
4. Create a new secret key
5. Set up billing (required for GPT-4)

**Usage Limits**:
- Free tier: $5 credit for first 3 months
- Pay-per-use: ~$0.03 per 1K tokens (GPT-4)
- Rate limits: 3 RPM (requests per minute) for free tier

### 2. Twitter/X API (Required)
**Purpose**: Twitter account management and posting

```bash
# Environment Variables
VITE_TWITTER_API_KEY=your-twitter-api-key
VITE_TWITTER_API_SECRET=your-twitter-api-secret
VITE_TWITTER_ACCESS_TOKEN=your-twitter-access-token
VITE_TWITTER_ACCESS_TOKEN_SECRET=your-twitter-access-token-secret
VITE_TWITTER_BEARER_TOKEN=your-twitter-bearer-token
```

**Setup Steps**:
1. Apply for [Twitter Developer Account](https://developer.twitter.com/)
2. Create a new App in the Developer Portal
3. Generate API keys and tokens
4. Enable OAuth 1.0a for user authentication
5. Set callback URLs for OAuth flow

**API Endpoints Used**:
- `POST /2/tweets` - Create tweets
- `GET /2/users/me` - Get user profile
- `GET /2/tweets/search/recent` - Search tweets
- `POST /2/users/:id/following` - Follow users

### 3. Instagram Basic Display API (Required)
**Purpose**: Instagram account management and posting

```bash
# Environment Variables
VITE_INSTAGRAM_CLIENT_ID=your-instagram-client-id
VITE_INSTAGRAM_CLIENT_SECRET=your-instagram-client-secret
VITE_INSTAGRAM_REDIRECT_URI=https://admin.viralforge.ai/auth/instagram/callback
```

**Setup Steps**:
1. Create [Facebook Developer Account](https://developers.facebook.com/)
2. Create a new App
3. Add Instagram Basic Display product
4. Configure OAuth redirect URIs
5. Submit for App Review (required for production)

**API Endpoints Used**:
- `GET /me` - Get user profile
- `GET /me/media` - Get user media
- `POST /me/media` - Create media container
- `POST /me/media_publish` - Publish media

### 4. Facebook Graph API (Optional)
**Purpose**: Facebook page management and posting

```bash
# Environment Variables
VITE_FACEBOOK_APP_ID=your-facebook-app-id
VITE_FACEBOOK_APP_SECRET=your-facebook-app-secret
VITE_FACEBOOK_REDIRECT_URI=https://admin.viralforge.ai/auth/facebook/callback
```

**Setup Steps**:
1. Use same Facebook Developer Account as Instagram
2. Add Facebook Login product
3. Configure permissions: `pages_manage_posts`, `pages_read_engagement`
4. Submit for App Review for advanced permissions

### 5. LinkedIn API (Optional)
**Purpose**: LinkedIn profile and company page management

```bash
# Environment Variables
VITE_LINKEDIN_CLIENT_ID=your-linkedin-client-id
VITE_LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
VITE_LINKEDIN_REDIRECT_URI=https://admin.viralforge.ai/auth/linkedin/callback
```

**Setup Steps**:
1. Create [LinkedIn Developer Account](https://www.linkedin.com/developers/)
2. Create a new App
3. Request access to LinkedIn Share API
4. Configure OAuth 2.0 settings
5. Verify your app (may require company verification)

## Authentication Flow

### OAuth 2.0 Implementation

```typescript
// Example: Twitter OAuth Flow
export class TwitterAuthService {
  static async initiateAuth(): Promise<string> {
    const authUrl = `https://twitter.com/i/oauth2/authorize?` +
      `response_type=code&` +
      `client_id=${import.meta.env.VITE_TWITTER_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(import.meta.env.VITE_TWITTER_REDIRECT_URI)}&` +
      `scope=tweet.read%20tweet.write%20users.read&` +
      `state=${generateRandomState()}&` +
      `code_challenge=${generateCodeChallenge()}&` +
      `code_challenge_method=S256`;
    
    return authUrl;
  }

  static async exchangeCodeForToken(code: string): Promise<TokenResponse> {
    const response = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
      },
      body: new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        client_id: import.meta.env.VITE_TWITTER_CLIENT_ID,
        redirect_uri: import.meta.env.VITE_TWITTER_REDIRECT_URI,
        code_verifier: getStoredCodeVerifier(),
      }),
    });

    return response.json();
  }
}
```

## API Rate Limiting

### Implementation Strategy

```typescript
// Rate limiting utility
export class RateLimiter {
  private static limits = new Map<string, { count: number; resetTime: number }>();

  static async checkLimit(service: string, limit: number, windowMs: number): Promise<boolean> {
    const now = Date.now();
    const key = service;
    const current = this.limits.get(key);

    if (!current || now > current.resetTime) {
      this.limits.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (current.count >= limit) {
      return false;
    }

    current.count++;
    return true;
  }

  static async waitForReset(service: string): Promise<void> {
    const current = this.limits.get(service);
    if (current && Date.now() < current.resetTime) {
      const waitTime = current.resetTime - Date.now();
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}

// Usage in API service
export class TwitterService {
  static async createTweet(content: string): Promise<Tweet> {
    const canProceed = await RateLimiter.checkLimit('twitter-post', 300, 15 * 60 * 1000); // 300 per 15 min
    
    if (!canProceed) {
      await RateLimiter.waitForReset('twitter-post');
    }

    // Make API call
    return this.apiCall('/2/tweets', { text: content });
  }
}
```

## Error Handling

### Comprehensive Error Management

```typescript
export class ApiErrorHandler {
  static handle(error: any, service: string): ApiError {
    // Twitter API errors
    if (service === 'twitter') {
      if (error.status === 429) {
        return {
          type: 'RATE_LIMIT_EXCEEDED',
          message: 'Twitter API rate limit exceeded. Please try again later.',
          retryAfter: error.headers['x-rate-limit-reset'],
        };
      }
      
      if (error.status === 401) {
        return {
          type: 'AUTHENTICATION_FAILED',
          message: 'Twitter authentication failed. Please reconnect your account.',
          action: 'RECONNECT_ACCOUNT',
        };
      }
    }

    // Instagram API errors
    if (service === 'instagram') {
      if (error.error?.code === 190) {
        return {
          type: 'TOKEN_EXPIRED',
          message: 'Instagram access token expired. Please reconnect your account.',
          action: 'REFRESH_TOKEN',
        };
      }
    }

    // Generic error
    return {
      type: 'UNKNOWN_ERROR',
      message: error.message || 'An unexpected error occurred.',
      originalError: error,
    };
  }
}
```

## Security Best Practices

### 1. Environment Variables
- Never commit API keys to version control
- Use different keys for development/staging/production
- Rotate keys regularly (quarterly recommended)

### 2. Token Storage
```typescript
// Secure token storage
export class TokenManager {
  private static readonly ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

  static async storeToken(service: string, token: string): Promise<void> {
    const encrypted = await this.encrypt(token);
    localStorage.setItem(`${service}_token`, encrypted);
  }

  static async getToken(service: string): Promise<string | null> {
    const encrypted = localStorage.getItem(`${service}_token`);
    if (!encrypted) return null;
    
    return this.decrypt(encrypted);
  }

  private static async encrypt(text: string): Promise<string> {
    // Implementation using Web Crypto API
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(this.ENCRYPTION_KEY),
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );
    
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );
    
    return btoa(String.fromCharCode(...new Uint8Array([...iv, ...new Uint8Array(encrypted)])));
  }
}
```

### 3. API Key Validation
```typescript
export class ApiKeyValidator {
  static async validateOpenAI(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  static async validateTwitter(apiKey: string, apiSecret: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.twitter.com/oauth/request_token', {
        method: 'POST',
        headers: {
          'Authorization': `OAuth oauth_consumer_key="${apiKey}", oauth_signature_method="HMAC-SHA1", oauth_timestamp="${Math.floor(Date.now() / 1000)}", oauth_nonce="${Math.random().toString(36)}", oauth_version="1.0", oauth_signature="${generateSignature(apiSecret)}"`
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}
```

## Monitoring & Analytics

### 1. API Usage Tracking
```typescript
export class ApiUsageTracker {
  static async trackUsage(service: string, endpoint: string, success: boolean): Promise<void> {
    const usage = {
      service,
      endpoint,
      success,
      timestamp: new Date().toISOString(),
      userId: getCurrentUserId(),
    };

    // Send to analytics service
    await fetch('/api/analytics/usage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usage),
    });
  }
}
```

### 2. Error Reporting
```typescript
// Sentry integration
import * as Sentry from '@sentry/react';

export class ErrorReporter {
  static reportApiError(error: ApiError, context: any): void {
    Sentry.captureException(error, {
      tags: {
        service: context.service,
        endpoint: context.endpoint,
      },
      extra: context,
    });
  }
}
```

## Testing API Integration

### 1. Mock API Responses
```typescript
// MSW handlers for testing
export const apiHandlers = [
  http.post('https://api.openai.com/v1/chat/completions', () => {
    return HttpResponse.json({
      choices: [{ message: { content: 'Generated content' } }]
    });
  }),

  http.post('https://api.twitter.com/2/tweets', () => {
    return HttpResponse.json({
      data: { id: '1234567890', text: 'Tweet content' }
    });
  }),
];
```

### 2. Integration Tests
```typescript
describe('API Integration', () => {
  it('should generate content using OpenAI', async () => {
    const content = await ApiService.generateContent('Create a tweet about AI');
    expect(content).toBeDefined();
    expect(content.length).toBeGreaterThan(0);
  });

  it('should post to Twitter', async () => {
    const tweet = await TwitterService.createTweet('Test tweet');
    expect(tweet.id).toBeDefined();
  });
});
```

## Deployment Checklist

### Pre-deployment
- [ ] All API keys configured in environment variables
- [ ] OAuth redirect URIs updated for production domain
- [ ] Rate limiting implemented and tested
- [ ] Error handling implemented for all API calls
- [ ] Token refresh mechanisms in place
- [ ] API usage monitoring configured

### Post-deployment
- [ ] Test all OAuth flows in production
- [ ] Verify API rate limits are respected
- [ ] Monitor error rates and response times
- [ ] Set up alerts for API failures
- [ ] Document any API-specific issues

## Troubleshooting

### Common Issues

1. **OAuth Redirect Mismatch**
   - Ensure redirect URIs match exactly in API console
   - Check for trailing slashes and protocol (http vs https)

2. **Rate Limit Exceeded**
   - Implement exponential backoff
   - Cache responses when possible
   - Use webhooks instead of polling

3. **Token Expiration**
   - Implement automatic token refresh
   - Handle 401 errors gracefully
   - Provide clear user messaging

4. **CORS Issues**
   - Use server-side proxy for API calls
   - Configure proper CORS headers
   - Avoid client-side API key exposure

### Debug Commands
```bash
# Test API connectivity
curl -H "Authorization: Bearer $OPENAI_API_KEY" https://api.openai.com/v1/models

# Validate Twitter credentials
curl -X POST "https://api.twitter.com/oauth/request_token" \
  -H "Authorization: OAuth oauth_consumer_key=\"$TWITTER_API_KEY\""

# Check Instagram token
curl "https://graph.instagram.com/me?access_token=$INSTAGRAM_ACCESS_TOKEN"
```

## Support & Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Twitter API v2 Documentation](https://developer.twitter.com/en/docs/twitter-api)
- [Instagram Basic Display API](https://developers.facebook.com/docs/instagram-basic-display-api)
- [Facebook Graph API](https://developers.facebook.com/docs/graph-api)
- [LinkedIn API Documentation](https://docs.microsoft.com/en-us/linkedin/)

For API integration issues, please check the respective platform's status pages and developer forums before creating support tickets. 