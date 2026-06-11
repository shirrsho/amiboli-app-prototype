// ────────────────────────────────────────────────────────────────────────────
// Per-book world themes. Each book's feed section and Book screen are fully
// styled from its theme: palette + one scenery set + exactly ONE ambient
// effect. Add a theme, point a book's themeId at it, done.
//
//   scenery: 'london' | 'rail' | 'southern'   (static layered SVG, no parallax)
//   ambient: 'fog' | 'streaks' | 'fireflies'  (one subtle effect, max)
// ────────────────────────────────────────────────────────────────────────────

export const bookThemes = {
  // A Study in Scarlet — foggy Victorian London at night.
  'victorian-london': {
    id: 'victorian-london',
    palette: {
      bg: '#1c2438', // navy night sky
      bgDeep: '#0e1220', // charcoal street level
      accent: '#d4a857', // gaslight gold
      accentDeep: '#a87a2e',
      glow: 'rgba(255,196,110,0.45)',
      textOnBg: '#f3ead9',
      textMuted: 'rgba(243,234,217,0.62)',
      panel: 'rgba(18,23,37,0.78)',
      panelBorder: 'rgba(212,168,87,0.28)',
      ctaText: '#170f04', // dark text on the gold button
    },
    scenery: 'london',
    ambient: 'fog',
    sealColor: '#8c2f39', // crimson wax
  },

  // The Girl on the Train — moody commuter rail at dusk.
  'rail-dusk': {
    id: 'rail-dusk',
    palette: {
      bg: '#363c63', // slate blue-violet dusk
      bgDeep: '#171b2e',
      accent: '#3fc1d4', // signal cyan
      accentDeep: '#2a93a3',
      glow: 'rgba(63,193,212,0.4)',
      textOnBg: '#e9eef7',
      textMuted: 'rgba(233,238,247,0.62)',
      panel: 'rgba(21,25,42,0.78)',
      panelBorder: 'rgba(63,193,212,0.3)',
      ctaText: '#0b2227',
    },
    scenery: 'rail',
    ambient: 'streaks',
    sealColor: '#2a7e8c', // teal wax
  },

  // To Kill a Mockingbird — warm Southern summer evening.
  'southern-summer': {
    id: 'southern-summer',
    palette: {
      bg: '#f6e7c6', // cream evening sky
      bgDeep: '#e3a35e', // dusty orange horizon
      accent: '#2f6b3f', // deep oak green
      accentDeep: '#24522f',
      glow: 'rgba(47,107,63,0.3)',
      textOnBg: '#3a2a18', // dark walnut (light theme → dark text)
      textMuted: 'rgba(58,42,24,0.66)',
      panel: 'rgba(255,250,238,0.82)',
      panelBorder: 'rgba(47,107,63,0.32)',
      ctaText: '#fef8ec',
    },
    scenery: 'southern',
    ambient: 'fireflies',
    sealColor: '#2f6b3f', // green wax
  },
}

export const getTheme = (themeId) => bookThemes[themeId] ?? bookThemes['victorian-london']
