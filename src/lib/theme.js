/**
 * Plain JS mirror of src/styles/tokens.css color values, for contexts
 * that can't read CSS custom properties directly (WebGL materials,
 * <canvas>, etc). Keep in sync with tokens.css by hand — there's no
 * build step that generates one from the other.
 */
export const THEME_COLORS = {
  background: '#08121F',
  surface: '#111827',
  primary: '#F97316',
  secondary: '#2DD4BF',
  text: '#F8F5EC',
  muted: '#94A3B8',
}
