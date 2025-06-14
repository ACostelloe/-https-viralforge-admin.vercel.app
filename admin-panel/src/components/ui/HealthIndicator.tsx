import { HealthIndicatorProps } from '@/types'

export default function HealthIndicator({ status, label }: HealthIndicatorProps) {
  const statusClasses = {
    online: 'health-online',
    warning: 'health-warning',
    error: 'health-error',
    offline: 'health-offline'
  }
  
  return (
    <div className="flex items-center">
      <div className={statusClasses[status]}></div>
      {label && <span className="ml-2 text-sm text-gray-600">{label}</span>}
    </div>
  )
} 