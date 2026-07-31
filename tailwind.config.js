/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          950: '#080608',
          900: '#0d0a0f',
          850: '#120f16',
          800: '#181320',
          700: '#221a2e',
        },
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(135deg, #f59e0b 0%, #f43f5e 100%)',
        'accent-soft': 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(244,63,94,0.15) 100%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        shimmer: 'shimmer 1.6s infinite',
      },
    },
  },
  plugins: [],
};
