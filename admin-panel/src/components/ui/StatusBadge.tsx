import { StatusBadgeProps } from '@/types'

export default function StatusBadge({ status, children }: StatusBadgeProps) {
  const statusClasses = {
    success: 'status-success',
    error: 'status-error',
    warning: 'status-warning',
    info: 'status-info'
  }
  
  return (
    <span className={statusClasses[status]}>
      {children}
    </span>
  )
} 