import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Noto Sans KR', 'sans-serif'],
      },
      colors: {
        princess: {
          50:  '#fff0f5',
          100: '#ffe0eb',
          200: '#ffc0d8',
          300: '#ff96be',
          400: '#ff6ba3',
          500: '#f04780',
          600: '#c93066',
          700: '#a0224f',
          800: '#80183d',
          900: '#601030',
        },
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-5deg) scale(1.05)' },
          '50%':  { transform: 'rotate(5deg) scale(1.05)' },
        },
        'fade-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'ping-slow': {
          '75%, 100%': { transform: 'scale(2)', opacity: '0' },
        },
      },
      animation: {
        wiggle:       'wiggle 0.5s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.4s ease-out',
        'ping-slow':  'ping-slow 1.5s cubic-bezier(0,0,0.2,1) infinite',
      },
    },
  },
  plugins: [],
}

export default config
