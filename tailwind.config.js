/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          bg: '#FAF7F2',
          surface: '#FFFFFF',
          card: '#F5EFEB',
          border: '#E8DED1',
          50: '#FAF6F0',
          100: '#F2E8DC',
          200: '#E5D3C2',
          300: '#D5BBA3',
          400: '#B99373',
          500: '#9B724D',
          600: '#7E5938',
          700: '#614328',
          800: '#462E1A',
          900: '#2D1D10',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(126, 89, 56, 0.08)',
        'soft-lg': '0 10px 30px -4px rgba(126, 89, 56, 0.12)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(126, 89, 56, 0.05)',
      }
    },
  },
  plugins: [],
}

