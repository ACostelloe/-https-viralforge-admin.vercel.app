import { useEffect } from 'react'
import { useDashboardStore } from '@/store'
import MetricCard from '@/components/ui/MetricCard'
import HealthIndicator from '@/components/ui/HealthIndicator'
import StatusBadge from '@/components/ui/StatusBadge'

export default function Dashboard() {
  const { 
    metrics, 
    systemStatus, 
    queueStatus, 
    isLoading, 
    error,
    fetchDashboardData 
  } = useDashboardStore()

  useEffect(() => {
    fetchDashboardData()
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000)
    return () => clearInterval(interval)
  }, [fetchDashboardData])

  if (isLoading && !metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-400"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-error-100 border border-error-500 text-error-500 px-4 py-3 rounded">
        Error: {error}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Monitor your ViralForge AI system performance</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon="📝"
          value={metrics?.posts_today || 0}
          label="Posts Today"
          trend={{
            value: metrics?.posts_today_change || 0,
            isPositive: (metrics?.posts_today_change || 0) >= 0,
            label: "from yesterday"
          }}
        />
        
        <MetricCard
          icon="⏰"
          value={metrics?.next_post_time || "--:--"}
          label="Next Post"
          sublabel={`in ${metrics?.next_post_in_minutes || 0} minutes`}
        />
        
        <MetricCard
          icon="🔗"
          value={
            metrics?.platforms_active ? 
            `${(metrics.platforms_active.instagram ? 1 : 0) + (metrics.platforms_active.tiktok ? 1 : 0)}/2`
            : "0/2"
          }
          label="Platforms Active"
          sublabel={
            metrics?.platforms_active ? 
            `IG ${metrics.platforms_active.instagram ? '✅' : '❌'} TT ${metrics.platforms_active.tiktok ? '✅' : '❌'}`
            : ""
          }
        />
        
        <MetricCard
          icon="📈"
          value={`${metrics?.uptime_percentage || 0}%`}
          label="System Uptime"
          sublabel={`${metrics?.uptime_days || 0} days`}
        />
      </div>

      {/* Content Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* System Status Panel */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">System Health</h2>
          
          <div className="space-y-4">
            {/* Service Status */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">API Server</span>
                <HealthIndicator 
                  status={systemStatus?.api_server || 'offline'} 
                  label={systemStatus?.api_server === 'online' ? 'Online' : 'Offline'}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Content Gen</span>
                <HealthIndicator 
                  status={systemStatus?.content_generator === 'active' ? 'online' : 'offline'} 
                  label={systemStatus?.content_generator === 'active' ? 'Active' : 'Inactive'}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Scheduler</span>
                <HealthIndicator 
                  status={systemStatus?.scheduler === 'running' ? 'online' : 'offline'} 
                  label={systemStatus?.scheduler === 'running' ? 'Running' : 'Stopped'}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Database</span>
                <HealthIndicator 
                  status={systemStatus?.database === 'connected' ? 'online' : 'offline'} 
                  label={systemStatus?.database === 'connected' ? 'Connected' : 'Disconnected'}
                />
              </div>
            </div>

            {/* Queue Status */}
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Queue Status</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Pending Tasks:</span>
                  <span className="ml-2 font-medium text-gray-900">{queueStatus?.pending_tasks || 0}</span>
                </div>
                <div>
                  <span className="text-gray-500">Processing:</span>
                  <span className="ml-2 font-medium text-gray-900">{queueStatus?.processing || 0}</span>
                </div>
              </div>
            </div>

            {/* Last Updated */}
            <div className="text-xs text-gray-400 border-t pt-2">
              Last Updated: {systemStatus?.last_updated ? 
                new Date(systemStatus.last_updated).toLocaleTimeString() : 
                'Never'
              }
            </div>
          </div>
        </div>

        {/* Recent Activity Panel */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Posts</h2>
          
          <div className="space-y-3">
            {/* Mock Recent Posts */}
            {[
              {
                id: '1',
                thumbnail: '🖼️',
                caption: 'Did you know that octopuses have three hearts?',
                platform: 'instagram',
                time: '2 hours ago',
                status: 'posted'
              },
              {
                id: '2',
                thumbnail: '🎥',
                caption: 'Morning motivation: Success is not final...',
                platform: 'tiktok',
                time: '5 hours ago',
                status: 'posted'
              },
              {
                id: '3',
                thumbnail: '📸',
                caption: 'Local coffee shops in downtown Seattle',
                platform: 'instagram',
                time: '8 hours ago',
                status: 'posted'
              },
              {
                id: '4',
                thumbnail: '🎬',
                caption: 'Quick productivity tip for remote workers',
                platform: 'tiktok',
                time: '12 hours ago',
                status: 'scheduled'
              }
            ].map((post) => (
              <div key={post.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-md">
                <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center text-lg">
                  {post.thumbnail}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {post.caption}
                  </p>
                  <p className="text-xs text-gray-500">
                    {post.time}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <StatusBadge status={post.platform === 'instagram' ? 'info' : 'warning'}>
                    {post.platform === 'instagram' ? 'IG' : 'TT'}
                  </StatusBadge>
                  
                  <StatusBadge status={post.status === 'posted' ? 'success' : 'warning'}>
                    {post.status}
                  </StatusBadge>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t">
            <button className="text-sm text-accent-400 hover:text-accent-300 font-medium">
              View All Posts →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 