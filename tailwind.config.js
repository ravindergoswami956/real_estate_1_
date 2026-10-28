/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FDFCF9',
          100: '#FAF8F5',
          200: '#F4EFE6',
          300: '#EAE3D4',
          DEFAULT: '#FAF8F5',
        },
        charcoal: {
          950: '#0E1012',
          900: '#15181C',
          850: '#1C2025',
          800: '#252A30',
          700: '#383F47',
          DEFAULT: '#15181C',
        },
        champagne: {
          50: '#FAF7F0',
          100: '#F3ECD9',
          200: '#E7D8B3',
          300: '#D9C189',
          400: '#CCA861',
          500: '#C5A059', // Primary Champagne Gold
          600: '#B0883B',
          700: '#8C6726',
          800: '#67491A',
          DEFAULT: '#C5A059',
        },
        sand: {
          50: '#F8F6F2',
          100: '#F0ECE3',
          200: '#E4DDD0',
          300: '#D5CCBC',
          DEFAULT: '#E4DDD0',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Cinzel', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 10px 30px -10px rgba(18, 20, 23, 0.08), 0 20px 40px -15px rgba(197, 160, 89, 0.1)',
        'luxury-hover': '0 20px 40px -15px rgba(18, 20, 23, 0.12), 0 0 25px rgba(197, 160, 89, 0.2)',
      }
    },
  },
  plugins: [],
}
