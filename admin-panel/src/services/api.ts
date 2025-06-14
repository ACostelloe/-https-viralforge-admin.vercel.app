import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const API_TIMEOUT = 10000;

// Types
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export interface DashboardMetrics {
  totalPosts: number;
  activeAccounts: number;
  scheduledPosts: number;
  engagementRate: number;
}

export interface SystemHealth {
  api: 'online' | 'offline' | 'warning';
  database: 'online' | 'offline' | 'warning';
  scheduler: 'online' | 'offline' | 'warning';
  aiService: 'online' | 'offline' | 'warning';
}

export interface ActivityItem {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
}

export interface Account {
  id: string;
  platform: 'twitter' | 'instagram' | 'facebook' | 'linkedin';
  username: string;
  status: 'connected' | 'disconnected' | 'error';
  followers: number;
  lastPost: string;
}

export interface ContentSettings {
  aiModel: string;
  tone: string;
  maxLength: number;
  includeHashtags: boolean;
  includeEmojis: boolean;
}

// Create axios instance
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor for auth
  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor for error handling
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      const apiError: ApiError = {
        message: error.message || 'An unexpected error occurred',
        status: error.response?.status || 500,
        code: error.code,
      };

      // Handle specific error cases
      if (error.response?.status === 401) {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }

      return Promise.reject(apiError);
    }
  );

  return client;
};

const apiClient = createApiClient();

// API Service Class
export class ApiService {
  // Dashboard endpoints
  static async getDashboardMetrics(): Promise<DashboardMetrics> {
    const response = await apiClient.get<DashboardMetrics>('/dashboard/metrics');
    return response.data;
  }

  static async getSystemHealth(): Promise<SystemHealth> {
    const response = await apiClient.get<SystemHealth>('/dashboard/health');
    return response.data;
  }

  static async getRecentActivity(): Promise<ActivityItem[]> {
    const response = await apiClient.get<ActivityItem[]>('/dashboard/activity');
    return response.data;
  }

  // Content endpoints
  static async getContentSettings(): Promise<ContentSettings> {
    const response = await apiClient.get<ContentSettings>('/content/settings');
    return response.data;
  }

  static async updateContentSettings(settings: Partial<ContentSettings>): Promise<ContentSettings> {
    const response = await apiClient.put<ContentSettings>('/content/settings', settings);
    return response.data;
  }

  // Account endpoints
  static async getAccounts(): Promise<Account[]> {
    const response = await apiClient.get<Account[]>('/accounts');
    return response.data;
  }

  static async connectAccount(platform: string, credentials: any): Promise<Account> {
    const response = await apiClient.post<Account>('/accounts/connect', {
      platform,
      credentials,
    });
    return response.data;
  }

  static async disconnectAccount(accountId: string): Promise<void> {
    await apiClient.delete(`/accounts/${accountId}`);
  }

  // AI Content Generation
  static async generateContent(prompt: string, settings?: Partial<ContentSettings>): Promise<string> {
    const response = await apiClient.post<{ content: string }>('/ai/generate', {
      prompt,
      settings,
    });
    return response.data.content;
  }

  // Scheduling endpoints
  static async schedulePost(accountId: string, content: string, scheduledTime: string): Promise<void> {
    await apiClient.post('/posts/schedule', {
      accountId,
      content,
      scheduledTime,
    });
  }

  static async getScheduledPosts(): Promise<any[]> {
    const response = await apiClient.get('/posts/scheduled');
    return response.data;
  }

  // Analytics endpoints
  static async getAnalytics(timeRange: string = '7d'): Promise<any> {
    const response = await apiClient.get(`/analytics?range=${timeRange}`);
    return response.data;
  }

  // Health check
  static async healthCheck(): Promise<boolean> {
    try {
      await apiClient.get('/health');
      return true;
    } catch {
      return false;
    }
  }
}

export default ApiService; 