// System Status Types
export interface SystemStatus {
  api_server: 'online' | 'warning' | 'error' | 'offline'
  content_generator: 'active' | 'inactive' | 'error'
  scheduler: 'running' | 'paused' | 'error'
  database: 'connected' | 'disconnected' | 'error'
  last_updated: string
}

export interface QueueStatus {
  pending_tasks: number
  processing: number
  failed: number
}

// Metrics Types
export interface DashboardMetrics {
  posts_today: number
  posts_today_change: number
  next_post_time: string
  next_post_in_minutes: number
  platforms_active: {
    instagram: boolean
    tiktok: boolean
  }
  uptime_percentage: number
  uptime_days: number
}

// Content Types
export interface ContentItem {
  id: string
  type: 'facts' | 'quotes' | 'memes' | 'location' | 'educational' | 'custom'
  caption: string
  media_url?: string
  platform: 'instagram' | 'tiktok'
  scheduled_time: string
  status: 'scheduled' | 'posted' | 'failed' | 'draft'
  engagement?: {
    views: number
    likes: number
    comments: number
    shares: number
  }
  created_at: string
}

// Social Account Types
export interface SocialAccount {
  id: string
  platform: 'instagram' | 'tiktok'
  username: string
  is_connected: boolean
  token_expires_at: string
  permissions: string[]
  last_post_at?: string
  monthly_posts: number
}

// Settings Types
export interface ContentSettings {
  enabled_types: {
    facts: boolean
    quotes: boolean
    memes: boolean
    location: boolean
    educational: boolean
    custom: boolean
  }
  ai_config: {
    model: 'gpt-4' | 'claude' | 'gemini'
    creativity_level: number // 0-100
    content_length: 'short' | 'medium' | 'long'
    language: string
    custom_instructions?: string
  }
  trending_sources: {
    google_trends: boolean
    tiktok_discovery: boolean
    instagram_explore: boolean
    twitter_trending: boolean
    reddit_hot: boolean
    youtube_trending: boolean
  }
  media_settings: {
    image_style: string
    video_length_range: [number, number]
    voice_provider: string
    voice_id: string
    background_music: boolean
  }
}

export interface ScheduleSettings {
  auto_schedule: boolean
  posts_per_day: {
    instagram: number
    tiktok: number
  }
  time_windows: {
    morning: [string, string] // ['06:00', '12:00']
    afternoon: [string, string]
    evening: [string, string]
  }
  time_zones: string[]
  blackout_dates: string[]
}

// Analytics Types
export interface AnalyticsData {
  total_posts: number
  total_posts_change: number
  avg_engagement_rate: number
  engagement_rate_change: number
  top_platform: 'instagram' | 'tiktok'
  top_platform_percentage: number
  best_posting_time: string
}

export interface ChartData {
  date: string
  views: number
  likes: number
  comments: number
  shares: number
  engagement_rate: number
}

export interface PostPerformance {
  id: string
  thumbnail_url: string
  caption: string
  platform: 'instagram' | 'tiktok'
  posted_at: string
  views: number
  likes: number
  comments: number
  shares: number
  engagement_rate: number
}

// Log Types
export interface LogEntry {
  id: string
  timestamp: string
  level: 'info' | 'warning' | 'error' | 'critical'
  module: string
  message: string
  details?: string
  actions?: LogAction[]
}

export interface LogAction {
  label: string
  action: 'retry' | 'view_details' | 'ignore' | 'view_post' | 'view_analytics'
  data?: any
}

export interface ErrorSummary {
  critical: number
  errors: number
  warnings: number
  info: number
  top_errors: {
    type: string
    count: number
  }[]
}

// Navigation Types
export type NavigationItem = {
  id: string
  label: string
  icon: string
  path: string
  badge?: number
}

// Component Props Types
export interface MetricCardProps {
  icon: string
  value: string | number
  label: string
  trend?: {
    value: number
    isPositive: boolean
    label: string
  }
  sublabel?: string
}

export interface StatusBadgeProps {
  status: 'success' | 'error' | 'warning' | 'info'
  children: any
}

export interface HealthIndicatorProps {
  status: 'online' | 'warning' | 'error' | 'offline'
  label?: string
}

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  disabled?: boolean
  children: any
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

export interface ToggleProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
  label?: string
  description?: string
}

// Form Types
export interface FormState {
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
  errorMessage?: string
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Utility Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export type Theme = 'light' | 'dark'

export type TimePeriod = '7d' | '30d' | '90d' | '1y'

export type ChartMetric = 'views' | 'likes' | 'comments' | 'shares' | 'engagement_rate' 