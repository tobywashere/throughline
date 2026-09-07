// Brand kit (throughline-brand-kit.html) is the source of truth for color.
// Rose and sage are the only two colors that carry meaning — pipeline stage,
// never a red/green good-bad verdict. Everything else stays neutral.
export const colors = {
  ink: '#23241f',
  inkFaint: '#5c5d52', // "Muted" — timestamps, captions, secondary labels
  inkDim: '#4a4b41', // "Body" copy
  paper: '#efe8d8',
  card: '#f8f3e6', // "Paper card" — cards, entries, raised surfaces
  rose: '#b25a68', // Pre-date status, "before" moments, italic kickers
  roseFaint: 'rgba(178,90,104,0.08)',
  sage: '#5f6f4e', // Dating status, growth/pattern moments
  sageFaint: 'rgba(95,111,78,0.08)',
  line: 'rgba(35,36,31,0.16)',
  fill: '#e7e4da',
  fillDim: '#efece5',
  outlineDash: '#b7b4a8',
  white: '#ffffff',
} as const;

export const fonts = {
  serif: 'Fraunces_500Medium',
  serifItalic: 'Fraunces_500Medium_Italic',
  sans: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  sansSemiBold: 'Inter_600SemiBold',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 32,
} as const;

export const radii = {
  sm: 4,
  md: 14,
  lg: 20,
  pill: 999,
  round: 999,
};
