import { MetricCardProps } from '@/types'

export default function MetricCard({ icon, value, label, trend, sublabel }: MetricCardProps) {
  return (
    <div className="metric-card">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Icon */}
          <div className="flex items-center justify-center w-12 h-12 bg-accent-400 bg-opacity-10 rounded-lg mb-4">
            <span className="text-2xl text-accent-400">{icon}</span>
          </div>
          
          {/* Value */}
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {value}
          </div>
          
          {/* Label */}
          <div className="text-sm text-gray-600 mb-2">
            {label}
          </div>
          
          {/* Sublabel */}
          {sublabel && (
            <div className="text-xs text-gray-500">
              {sublabel}
            </div>
          )}
        </div>
        
        {/* Trend Indicator */}
        {trend && (
          <div className={`flex items-center text-sm ${
            trend.isPositive ? 'text-success-500' : 'text-error-500'
          }`}>
            <svg 
              className={`w-4 h-4 mr-1 ${trend.isPositive ? '' : 'rotate-180'}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
            </svg>
            <span className="font-medium">
              {trend.isPositive ? '+' : ''}{trend.value}
            </span>
            <span className="text-gray-500 ml-1">
              {trend.label}
            </span>
          </div>
        )}
      </div>
    </div>
  )
} 