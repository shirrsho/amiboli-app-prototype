/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // ── Amiboli brand palette (Brand Guidelines v1.2) ──
      // Every colour has a defined role; never used interchangeably.
      colors: {
        // PRIMARY · Story Violet — nav, buttons, primary surfaces.
        // Mapped onto the `brand` scale so existing brand-* classes adopt it.
        brand: {
          50: '#EEEAFF', // violet xl (tints / chips)
          100: '#E4E0FF',
          200: '#D4C8E0',
          300: '#9D90D8',
          400: '#7C5CDB', // lavender (hover)
          500: '#4A35B0', // Story Violet (primary)
          600: '#3A28A0',
          700: '#2D1F50',
          800: '#26215C',
          900: '#1A1040',
        },
        // MASCOT · Ami Teal — progress, secondary, book spine.
        teal: {
          light: '#A8F0E8',
          DEFAULT: '#2ABFA8',
          dark: '#1D9E86',
        },
        // REWARD · XP Gold — rewards, streaks, XP, brows.
        gold: {
          DEFAULT: '#FFD166',
          dark: '#E8920A',
        },
        coral: {
          DEFAULT: '#D85A30', // tie / errors
        },
        forest: '#2E7A48', // book cover
        slate: '#1E3A6E', // teacher jacket
        ink: {
          DEFAULT: '#1A1040', // text / dark bg
          soft: '#5A4D8A', // secondary text
          mute: '#9D90D8', // muted text
        },
        cream: '#F6F4FF', // app background
        // legacy aliases kept so older class names still resolve sensibly
        grape: { 400: '#7C5CDB', 500: '#4A35B0', 600: '#3A28A0' },
        leaf: { 400: '#5BD6BE', 500: '#2ABFA8', 600: '#1D9E86' },
        sky: { 400: '#5B8FD4', 500: '#1E3A6E' },
        amber: { DEFAULT: '#FFD166' },
      },
      fontFamily: {
        // Nunito for UI energy. Lora for story reading. Never swapped.
        display: ['Nunito', 'system-ui', 'sans-serif'],
        body: ['Nunito', 'system-ui', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 8px 24px -8px rgba(26,16,64,0.18)',
        node: '0 6px 0 0 rgba(26,16,64,0.12)',
        pop: '0 12px 32px -10px rgba(74,53,176,0.45)',
      },
      borderRadius: {
        // Brand radius tokens
        chip: '4px',
        btn: '8px',
        card: '14px',
        sheet: '22px',
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
