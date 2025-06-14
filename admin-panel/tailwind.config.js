/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          900: '#0F172A', // Dark Navy Blue - Main backgrounds
          800: '#1E293B', // Slate Blue - Secondary backgrounds
          700: '#334155', // Lighter slate for borders
          600: '#475569', // Text on dark backgrounds
        },
        accent: {
          400: '#FACC15', // Yellow - Primary CTAs, highlights
          300: '#FDE047', // Light yellow - Hover states
        },
        success: {
          500: '#10B981', // Green - Success states
          100: '#D1FAE5', // Light green - Success backgrounds
        },
        error: {
          500: '#EF4444', // Red - Error states
          100: '#FEE2E2', // Light red - Error backgrounds
        },
        warning: {
          500: '#F59E0B', // Orange - Warning states
          100: '#FEF3C7', // Light orange - Warning backgrounds
        },
        info: {
          500: '#3B82F6', // Blue - Info states
          100: '#DBEAFE', // Light blue - Info backgrounds
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        'xs': '12px',
        'sm': '14px',
        'base': '16px',
        'lg': '18px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '30px',
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      width: {
        'sidebar': '280px',
        'sidebar-collapsed': '64px',
      },
      height: {
        'nav': '64px',
        'nav-item': '48px',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
} 