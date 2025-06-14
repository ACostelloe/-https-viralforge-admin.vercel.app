import { ToggleProps } from '@/types'

export default function Toggle({ enabled, onChange, label, description }: ToggleProps) {
  return (
    <div className="flex items-start">
      <div className="flex-shrink-0">
        <button
          type="button"
          className={`${
            enabled ? 'bg-accent-400' : 'bg-gray-300'
          } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2`}
          onClick={() => onChange(!enabled)}
        >
          <span
            className={`${
              enabled ? 'translate-x-5' : 'translate-x-0'
            } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
          />
        </button>
      </div>
      
      {(label || description) && (
        <div className="ml-3">
          {label && (
            <label className="text-sm font-medium text-gray-900">
              {label}
            </label>
          )}
          {description && (
            <p className="text-sm text-gray-500">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  )
} 