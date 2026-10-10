/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#ffffff',
          850: '#f8fafc',
          800: '#f1f5f9',
          750: '#e2e8f0',
          700: '#cbd5e1',
          600: '#94a3b8',
        },
        surface: {
          white: '#ffffff',
          subtle: '#f8fafc',
          card: '#ffffff',
          border: '#e2e8f0',
        },
        content: {
          primary: '#172033', // Deep navy
          secondary: '#64748b', // Slate grey
          muted: '#94a3b8',
        },
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5', // Vivid indigo-blue main accent
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        accent: {
          violet: '#8b5cf6', // Soft violet supporting accent
          indigo: '#4f46e5',
          blue: '#3b82f6',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#ef4444'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient-x': 'gradient-x 8s ease infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        }
      }
    },
  },
  plugins: [],
}
