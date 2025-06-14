/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_OPENAI_API_KEY: string;
  readonly VITE_TWITTER_API_KEY: string;
  readonly VITE_TWITTER_API_SECRET: string;
  readonly VITE_INSTAGRAM_CLIENT_ID: string;
  readonly VITE_INSTAGRAM_CLIENT_SECRET: string;
  readonly VITE_FACEBOOK_APP_ID: string;
  readonly VITE_FACEBOOK_APP_SECRET: string;
  readonly VITE_LINKEDIN_CLIENT_ID: string;
  readonly VITE_LINKEDIN_CLIENT_SECRET: string;
  readonly VITE_APP_ENV: 'development' | 'staging' | 'production';
  readonly VITE_SENTRY_DSN: string;
  readonly VITE_ANALYTICS_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 