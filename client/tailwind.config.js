/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a2744',
          50: '#f0f3fb',
          100: '#dde5f5',
          200: '#b8caeb',
          300: '#86a3d9',
          400: '#5577c3',
          500: '#3457ad',
          600: '#253f8e',
          700: '#1e3272',
          800: '#1a2744',
          900: '#121c30',
          950: '#0b1020',
        },
        accent: {
          DEFAULT: '#f59e0b',
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 12px 0 rgba(26,39,68,0.08)',
        'card-hover': '0 8px 32px 0 rgba(26,39,68,0.16)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
