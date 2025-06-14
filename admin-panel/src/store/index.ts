import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { 
  DashboardMetrics, 
  SystemStatus, 
  QueueStatus, 
  ContentSettings, 
  ScheduleSettings,
  SocialAccount,
  LogEntry,
  LoadingState 
} from '@/types'

// Dashboard Store
interface DashboardStore {
  metrics: DashboardMetrics | null
  systemStatus: SystemStatus | null
  queueStatus: QueueStatus | null
  isLoading: boolean
  error: string | null
  fetchDashboardData: () => Promise<void>
  updateMetrics: (metrics: DashboardMetrics) => void
}

export const useDashboardStore = create<DashboardStore>()(
  subscribeWithSelector((set, get) => ({
    metrics: null,
    systemStatus: null,
    queueStatus: null,
    isLoading: false,
    error: null,
    
    fetchDashboardData: async () => {
      set({ isLoading: true, error: null })
      try {
        // Mock data - replace with actual API calls
        const mockMetrics: DashboardMetrics = {
          posts_today: 12,
          posts_today_change: 3,
          next_post_time: '15:45',
          next_post_in_minutes: 32,
          platforms_active: {
            instagram: true,
            tiktok: true
          },
          uptime_percentage: 99.97,
          uptime_days: 30
        }
        
        const mockSystemStatus: SystemStatus = {
          api_server: 'online',
          content_generator: 'active',
          scheduler: 'running',
          database: 'connected',
          last_updated: new Date().toISOString()
        }
        
        const mockQueueStatus: QueueStatus = {
          pending_tasks: 3,
          processing: 1,
          failed: 0
        }
        
        set({
          metrics: mockMetrics,
          systemStatus: mockSystemStatus,
          queueStatus: mockQueueStatus,
          isLoading: false
        })
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to fetch dashboard data',
          isLoading: false 
        })
      }
    },
    
    updateMetrics: (metrics) => set({ metrics })
  }))
)

// Settings Store
interface SettingsStore {
  contentSettings: ContentSettings | null
  scheduleSettings: ScheduleSettings | null
  isLoading: boolean
  isSaving: boolean
  error: string | null
  saveStatus: 'idle' | 'saving' | 'success' | 'error'
  fetchSettings: () => Promise<void>
  updateContentSettings: (settings: Partial<ContentSettings>) => void
  updateScheduleSettings: (settings: Partial<ScheduleSettings>) => void
  saveSettings: () => Promise<void>
}

export const useSettingsStore = create<SettingsStore>()(
  subscribeWithSelector((set, get) => ({
    contentSettings: null,
    scheduleSettings: null,
    isLoading: false,
    isSaving: false,
    error: null,
    saveStatus: 'idle',
    
    fetchSettings: async () => {
      set({ isLoading: true, error: null })
      try {
        // Mock data - replace with actual API calls
        const mockContentSettings: ContentSettings = {
          enabled_types: {
            facts: true,
            quotes: true,
            memes: true,
            location: true,
            educational: true,
            custom: false
          },
          ai_config: {
            model: 'gpt-4',
            creativity_level: 70,
            content_length: 'medium',
            language: 'English',
            custom_instructions: ''
          },
          trending_sources: {
            google_trends: true,
            tiktok_discovery: true,
            instagram_explore: true,
            twitter_trending: false,
            reddit_hot: false,
            youtube_trending: false
          },
          media_settings: {
            image_style: 'Realistic',
            video_length_range: [15, 30],
            voice_provider: 'ElevenLabs',
            voice_id: 'default',
            background_music: true
          }
        }
        
        const mockScheduleSettings: ScheduleSettings = {
          auto_schedule: true,
          posts_per_day: {
            instagram: 2,
            tiktok: 3
          },
          time_windows: {
            morning: ['06:00', '12:00'],
            afternoon: ['12:00', '18:00'],
            evening: ['18:00', '24:00']
          },
          time_zones: ['America/New_York'],
          blackout_dates: []
        }
        
        set({
          contentSettings: mockContentSettings,
          scheduleSettings: mockScheduleSettings,
          isLoading: false
        })
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to fetch settings',
          isLoading: false 
        })
      }
    },
    
    updateContentSettings: (updates) => {
      const current = get().contentSettings
      if (current) {
        set({ contentSettings: { ...current, ...updates } })
      }
    },
    
    updateScheduleSettings: (updates) => {
      const current = get().scheduleSettings
      if (current) {
        set({ scheduleSettings: { ...current, ...updates } })
      }
    },
    
    saveSettings: async () => {
      set({ isSaving: true, saveStatus: 'saving' })
      try {
        // Mock API call - replace with actual implementation
        await new Promise(resolve => setTimeout(resolve, 1000))
        set({ isSaving: false, saveStatus: 'success' })
        // Reset save status after 2 seconds
        setTimeout(() => set({ saveStatus: 'idle' }), 2000)
      } catch (error) {
        set({ 
          isSaving: false, 
          saveStatus: 'error',
          error: error instanceof Error ? error.message : 'Failed to save settings'
        })
      }
    }
  }))
)

// Accounts Store
interface AccountsStore {
  accounts: SocialAccount[]
  isLoading: boolean
  error: string | null
  fetchAccounts: () => Promise<void>
  connectAccount: (platform: string) => Promise<void>
  disconnectAccount: (accountId: string) => Promise<void>
  refreshAccount: (accountId: string) => Promise<void>
}

export const useAccountsStore = create<AccountsStore>()(
  subscribeWithSelector((set, get) => ({
    accounts: [],
    isLoading: false,
    error: null,
    
    fetchAccounts: async () => {
      set({ isLoading: true, error: null })
      try {
        // Mock data - replace with actual API calls
        const mockAccounts: SocialAccount[] = [
          {
            id: '1',
            platform: 'instagram',
            username: '@myaccount',
            is_connected: true,
            token_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            permissions: ['basic_info', 'content_publish'],
            last_post_at: new Date().toISOString(),
            monthly_posts: 45
          },
          {
            id: '2',
            platform: 'tiktok',
            username: '@myaccount',
            is_connected: true,
            token_expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
            permissions: ['user.info.basic', 'video.publish'],
            last_post_at: new Date().toISOString(),
            monthly_posts: 67
          }
        ]
        
        set({ accounts: mockAccounts, isLoading: false })
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to fetch accounts',
          isLoading: false 
        })
      }
    },
    
    connectAccount: async (platform) => {
      // Mock OAuth flow - replace with actual implementation
      console.log(`Connecting to ${platform}...`)
    },
    
    disconnectAccount: async (accountId) => {
      const accounts = get().accounts.filter(acc => acc.id !== accountId)
      set({ accounts })
    },
    
    refreshAccount: async (accountId) => {
      // Mock refresh - replace with actual implementation
      console.log(`Refreshing account ${accountId}...`)
    }
  }))
)

// Logs Store
interface LogsStore {
  logs: LogEntry[]
  errorSummary: any
  isLoading: boolean
  autoRefresh: boolean
  refreshInterval: number
  filters: {
    timeRange: string
    severity: string
    module: string
    search: string
  }
  fetchLogs: () => Promise<void>
  setAutoRefresh: (enabled: boolean) => void
  updateFilters: (filters: Partial<LogsStore['filters']>) => void
}

export const useLogsStore = create<LogsStore>()(
  subscribeWithSelector((set, get) => ({
    logs: [],
    errorSummary: null,
    isLoading: false,
    autoRefresh: false,
    refreshInterval: 30000, // 30 seconds
    filters: {
      timeRange: '24h',
      severity: 'all',
      module: 'all',
      search: ''
    },
    
    fetchLogs: async () => {
      set({ isLoading: true })
      try {
        // Mock data - replace with actual API calls
        const mockLogs: LogEntry[] = [
          {
            id: '1',
            timestamp: new Date().toISOString(),
            level: 'error',
            module: 'Content Generation',
            message: 'Failed to generate image: OpenAI API rate limit exceeded',
            details: 'Module: openai_service.py:127',
            actions: [
              { label: 'Retry', action: 'retry' },
              { label: 'View Details', action: 'view_details' },
              { label: 'Ignore', action: 'ignore' }
            ]
          },
          {
            id: '2',
            timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
            level: 'info',
            module: 'Social Posting',
            message: 'Successfully posted to Instagram: @account',
            details: 'Post ID: 12345, Engagement: 45 likes in 2min',
            actions: [
              { label: 'View Post', action: 'view_post' },
              { label: 'View Analytics', action: 'view_analytics' }
            ]
          }
        ]
        
        const mockErrorSummary = {
          critical: 0,
          errors: 3,
          warnings: 12,
          info: 156,
          top_errors: [
            { type: 'API Rate Limits', count: 2 },
            { type: 'Network Timeouts', count: 1 },
            { type: 'Content Generation', count: 0 }
          ]
        }
        
        set({ 
          logs: mockLogs, 
          errorSummary: mockErrorSummary,
          isLoading: false 
        })
      } catch (error) {
        set({ isLoading: false })
      }
    },
    
    setAutoRefresh: (enabled) => {
      set({ autoRefresh: enabled })
    },
    
    updateFilters: (newFilters) => {
      const currentFilters = get().filters
      set({ filters: { ...currentFilters, ...newFilters } })
    }
  }))
) 