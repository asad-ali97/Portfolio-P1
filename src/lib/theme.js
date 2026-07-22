/**
 * Plain JS mirror of src/styles/tokens.css color values, for contexts
 * that can't read CSS custom properties directly (WebGL materials,
 * <canvas>, etc). Keep in sync with tokens.css by hand — there's no
 * build step that generates one from the other.
 */
export const THEME_COLORS = {
  dark: {
    background: '#08121F',
    surface: '#111827',
    primary: '#F97316',
    secondary: '#2DD4BF',
    text: '#F8F5EC',
    muted: '#94A3B8',
  },
  light: {
    background: '#F6F4EF',
    surface: '#FFFFFF',
    primary: '#C2410C',
    secondary: '#0F766E',
    text: '#101C2C',
    muted: '#4B5B70',
  },
}

export function getThemeColors(theme) {
  return THEME_COLORS[theme] ?? THEME_COLORS.dark
}
