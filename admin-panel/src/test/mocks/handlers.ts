import { http, HttpResponse } from 'msw';

// Mock data
const mockMetrics = {
  totalPosts: 1247,
  activeAccounts: 23,
  scheduledPosts: 156,
  engagementRate: 8.4
};

const mockSystemHealth = {
  api: 'online',
  database: 'online',
  scheduler: 'warning',
  aiService: 'online'
};

const mockRecentActivity = [
  {
    id: '1',
    type: 'post_created',
    message: 'New post created for @techstartup',
    timestamp: new Date().toISOString(),
    status: 'success'
  },
  {
    id: '2',
    type: 'account_connected',
    message: 'Instagram account connected',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    status: 'success'
  },
  {
    id: '3',
    type: 'scheduler_warning',
    message: 'Scheduler service experiencing delays',
    timestamp: new Date(Date.now() - 600000).toISOString(),
    status: 'warning'
  }
];

export const handlers = [
  // Dashboard metrics
  http.get('/api/dashboard/metrics', () => {
    return HttpResponse.json(mockMetrics);
  }),

  // System health
  http.get('/api/dashboard/health', () => {
    return HttpResponse.json(mockSystemHealth);
  }),

  // Recent activity
  http.get('/api/dashboard/activity', () => {
    return HttpResponse.json(mockRecentActivity);
  }),

  // Content settings
  http.get('/api/content/settings', () => {
    return HttpResponse.json({
      aiModel: 'gpt-4',
      tone: 'professional',
      maxLength: 280,
      includeHashtags: true,
      includeEmojis: false
    });
  }),

  // Accounts
  http.get('/api/accounts', () => {
    return HttpResponse.json([
      {
        id: '1',
        platform: 'twitter',
        username: '@techstartup',
        status: 'connected',
        followers: 15420,
        lastPost: new Date().toISOString()
      },
      {
        id: '2',
        platform: 'instagram',
        username: '@techstartup_ig',
        status: 'connected',
        followers: 8930,
        lastPost: new Date(Date.now() - 86400000).toISOString()
      }
    ]);
  }),

  // Error handling
  http.get('/api/error', () => {
    return new HttpResponse(null, { status: 500 });
  })
]; 