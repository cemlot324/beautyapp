/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'scroll-left': 'scroll-left 60s linear infinite',
        'scroll-right': 'scroll-right 60s linear infinite',
      },
      keyframes: {
        'scroll-left': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(calc(-320px * 8))' }
        },
        'scroll-right': {
          '0%': { transform: 'translateX(calc(-320px * 8))' },
          '100%': { transform: 'translateX(0)' }
        }
      },
    },
  },
  plugins: [],
} 