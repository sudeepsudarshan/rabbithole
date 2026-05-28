import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Surface tokens (theme-aware via CSS vars) ──────────────────
        page:     'var(--bg-page)',
        elevated: 'var(--bg-elevated)',
        sunken:   'var(--bg-sunken)',
        input:    'var(--bg-input)',
        overlay:  'var(--bg-overlay)',

        // ── Ink / type ──────────────────────────────────────────────────
        ink: {
          primary:   'var(--ink-primary)',
          secondary: 'var(--ink-secondary)',
          muted:     'var(--ink-muted)',
          faint:     'var(--ink-faint)',
        },

        // ── Borders ─────────────────────────────────────────────────────
        hairline:   'var(--border-hairline)',
        'ink-line': 'var(--border-ink)',

        // ── Accents — one at a time ──────────────────────────────────────
        accent: {
          rust:    'var(--accent-rust)',
          mustard: 'var(--accent-mustard)',
          sage:    'var(--accent-sage)',
          rose:    'var(--accent-rose)',
          sky:     'var(--accent-sky)',
          plum:    'var(--accent-plum)',
        },

        // ── Legacy aliases — kept so spark feed components compile ───────
        // Spark cards are always dark-overlay; these stay as fixed values.
        gold: {
          DEFAULT: '#C9A84C',
          dim:    '#8A6E2F',
          bright: '#DFC068',
          faint:  'rgba(201,168,76,0.12)',
        },
      },

      borderRadius: {
        DEFAULT: '8px',
        sm:      '4px',
        md:      '8px',
        lg:      '12px',
        xl:      '16px',
        '2xl':   '20px',
        full:    '9999px',
      },

      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        serif:   ['var(--font-playfair)', 'Georgia', 'serif'],
        sans:    ['var(--font-body)',     'system-ui', 'sans-serif'],
        mono:    ['var(--font-jetbrains)', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
