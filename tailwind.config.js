/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0f172a',
        },
        card: '#111827',
        primary: {
          DEFAULT: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca'
        },
        accent: '#22c55e'
      },
      boxShadow: {
        soft: '0 8px 24px rgba(0,0,0,0.35)'
      },
      borderRadius: {
        '2xl': '1.25rem'
      }
    },
  },
  plugins: [],
}
