/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Warm, energetic, playful palette (Duolingo-ish energy)
      colors: {
        amber: {
          DEFAULT: '#FF8A1F',
        },
        brand: {
          50: '#FFF4E6',
          100: '#FFE6C7',
          200: '#FFD199',
          300: '#FFB35C',
          400: '#FF9A33',
          500: '#FF8A1F', // primary warm orange
          600: '#F2730A',
          700: '#C75A05',
          800: '#9B470A',
          900: '#7A390C',
        },
        grape: {
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
        },
        leaf: {
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
        },
        sky: {
          400: '#38BDF8',
          500: '#0EA5E9',
        },
        ink: {
          DEFAULT: '#2B2233',
          soft: '#6B6275',
        },
        cream: '#FFFBF5',
      },
      fontFamily: {
        // Display = playful rounded; body = clean sans; serif = book prose on
        // the story world Home. Loaded via Google Fonts in index.html.
        display: ['"Baloo 2"', 'system-ui', 'sans-serif'],
        body: ['Nunito', 'system-ui', 'sans-serif'],
        serif: ['"Crimson Text"', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 8px 24px -8px rgba(43,34,51,0.18)',
        node: '0 6px 0 0 rgba(0,0,0,0.12)',
        pop: '0 12px 32px -10px rgba(255,138,31,0.55)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      keyframes: {
        floaty: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        floaty: 'floaty 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
