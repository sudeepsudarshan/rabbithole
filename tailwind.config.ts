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
        ink: {
          DEFAULT: '#0F0E0C',
          50: '#1A1814',
          100: '#2C2822',
        },
        paper: {
          DEFAULT: '#F5F0E8',
          muted: '#B8B0A0',
          faint: '#6B6560',
        },
        gold: {
          DEFAULT: '#C9A84C',
          dim: '#8A6E2F',
          bright: '#DFC068',
          faint: 'rgba(201,168,76,0.12)',
        },
        cream: '#EDE7D9',
        rust: '#B5451B',
        sage: '#4A6741',
        border: {
          DEFAULT: 'rgba(255,255,255,0.08)',
          gold: 'rgba(201,168,76,0.20)',
          strong: 'rgba(255,255,255,0.16)',
        }
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
