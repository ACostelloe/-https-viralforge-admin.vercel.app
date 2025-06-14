import { NavLink } from 'react-router-dom'
import { 
  HomeIcon, 
  DocumentTextIcon, 
  CalendarIcon, 
  UserIcon, 
  ChartBarIcon, 
  ClipboardDocumentListIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'
import {
  HomeIcon as HomeIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  CalendarIcon as CalendarIconSolid,
  UserIcon as UserIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  ClipboardDocumentListIcon as ClipboardDocumentListIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid
} from '@heroicons/react/24/solid'

interface SidebarProps {
  collapsed: boolean
  onToggle: (collapsed: boolean) => void
  currentPath: string
}

const navigationItems = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: HomeIcon,
    activeIcon: HomeIconSolid
  },
  {
    name: 'Content',
    path: '/content',
    icon: DocumentTextIcon,
    activeIcon: DocumentTextIconSolid
  },
  {
    name: 'Scheduling',
    path: '/scheduling',
    icon: CalendarIcon,
    activeIcon: CalendarIconSolid
  },
  {
    name: 'Accounts',
    path: '/accounts',
    icon: UserIcon,
    activeIcon: UserIconSolid
  },
  {
    name: 'Analytics',
    path: '/analytics',
    icon: ChartBarIcon,
    activeIcon: ChartBarIconSolid
  },
  {
    name: 'Logs',
    path: '/logs',
    icon: ClipboardDocumentListIcon,
    activeIcon: ClipboardDocumentListIconSolid
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: Cog6ToothIcon,
    activeIcon: Cog6ToothIconSolid
  }
]

export default function Sidebar({ collapsed, onToggle, currentPath }: SidebarProps) {
  return (
    <div 
      className={`fixed left-0 top-16 h-screen bg-primary-900 transition-all duration-300 z-40 ${
        collapsed ? 'w-16' : 'w-sidebar'
      }`}
    >
      <nav className="mt-6">
        <div className="px-3">
          {navigationItems.map((item) => {
            const isActive = currentPath === item.path
            const Icon = isActive ? item.activeIcon : item.icon
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-3 mb-1 text-sm font-medium rounded-md transition-colors duration-200 group relative ${
                  isActive
                    ? 'text-white bg-primary-800 border-l-4 border-accent-400'
                    : 'text-primary-600 hover:text-white hover:bg-primary-800'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && (
                  <span className="ml-3">{item.name}</span>
                )}
                
                {/* Active indicator */}
                {isActive && !collapsed && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-400 rounded-r-full" />
                )}
                
                {/* Tooltip for collapsed state */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </NavLink>
            )
          })}
        </div>
      </nav>
      
      {/* Toggle Button */}
      <button
        onClick={() => onToggle(!collapsed)}
        className="absolute bottom-6 left-3 right-3 flex items-center justify-center py-2 text-primary-600 hover:text-white hover:bg-primary-800 rounded-md transition-colors duration-200"
      >
        <svg
          className={`h-5 w-5 transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {!collapsed && <span className="ml-2 text-sm">Collapse</span>}
      </button>
    </div>
  )
} 