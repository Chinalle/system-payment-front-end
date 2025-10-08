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
  // 🚨 NOVO: Lista segura para preservar classes dinâmicas (filtros e cores)
  safelist: [
    // Preserva todas as combinações de bg/text/border e as cores usadas
    { pattern: /(bg|text|border)-(red|orange|cyan|lime)-(400|500|600|700|800)/ },
    { pattern: /bg-(blue)-(900)\/40/ }, // bg-blue-900/40 para o destaque de seleção
    { pattern: /border-(blue)-(600)/ }, // border-blue-600 para o destaque de seleção
    { pattern: /text-(gray)-(900)/ }, // text-gray-900 para eventos com cores claras
  ],
  plugins: [],
}