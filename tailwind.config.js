import plugin from 'tailwindcss/plugin.js'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
    },
    extend: {
      screens: {
        // pinned scroll sections only on desktop screens tall enough to fit them
        pin: { raw: '(min-width: 1025px) and (min-height: 780px)' },
        // pinned, but short enough that inactive step descriptions should collapse
        pinshort: { raw: '(min-width: 1025px) and (min-height: 780px) and (max-height: 899px)' },
      },
      colors: {
        canvas: '#FAF7F2',
        'canvas-subtle': '#F3ECE1',
        ink: {
          DEFAULT: '#12101F',
          secondary: '#575266',
          muted: '#827C94',
        },
        brand: {
          violet: '#6B3CFF',
          'violet-hover': '#582CD6',
          magenta: '#FF4FA3',
          lime: '#D6F36B',
          dark: '#0E0B1E',
        },
        border: {
          DEFAULT: '#E8E2D8',
          hover: '#D5CCBD',
        },
        sector: {
          healthcare: '#FF6B6B',
          education: '#D6F36B',
          professional: '#2DD4BF',
        },
      },
      fontFamily: {
        headline: ['Fraunces', 'Georgia', 'serif'],
        body: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        'telugu-serif': ['Noto Serif Telugu', 'serif'],
        'telugu-sans': ['Noto Sans Telugu', 'system-ui', 'sans-serif'],
        mono: ['Space Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        sm: '10px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        pill: '9999px',
      },
      boxShadow: {
        sm: '0 2px 8px rgba(18, 16, 31, 0.04)',
        md: '0 8px 24px rgba(18, 16, 31, 0.06)',
        lg: '0 16px 44px rgba(18, 16, 31, 0.08)',
        glass: '0 12px 32px rgba(18, 16, 31, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.8)',
        'violet-glow': '0 10px 30px rgba(107, 60, 255, 0.28)',
      },
      backgroundImage: {
        'gradient-bloom': 'linear-gradient(135deg, #6B3CFF 0%, #FF4FA3 52%, #D6F36B 100%)',
        'gradient-violet-magenta': 'linear-gradient(135deg, #6B3CFF 0%, #FF4FA3 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(250, 247, 242, 0.65) 100%)',
        'gradient-stage-card': 'linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
      },
      maxWidth: {
        desktop: '1440px',
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      // Add custom variant for Telugu mode
      addVariant('lang-te', ['html.lang-te &', 'html[lang="te"] &', '&:is(html.lang-te *)'])
    }),
  ],
}
