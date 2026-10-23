import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          emerald: '#00f59b',
          mint: '#10b981',
          gold: '#f59e0b',
          amber: '#d97706',
          sun: '#fbbf24',
        },
        obsidian: {
          950: '#05080c',
          900: '#0a0f16',
          850: '#101722',
          800: '#16202e',
          700: '#1f2d3f',
          600: '#2c3e56',
        },
        silver: {
          900: '#1e293b',
          700: '#475569',
          500: '#64748b',
          400: '#94a3b8',
          300: '#cbd5e1',
          200: '#e2e8f0',
          100: '#f1f5f9',
          50: '#f8fafc',
          platinum: '#edf2f7',
        },
      },
      boxShadow: {
        'neu-raised': '8px 8px 20px #cbd5e1, -8px -8px 20px #ffffff',
        'neu-raised-sm': '4px 4px 12px #cbd5e1, -4px -4px 12px #ffffff',
        'neu-inset': 'inset 4px 4px 8px #cbd5e1, inset -4px -4px 8px #ffffff',
        'neu-button': '5px 5px 12px #cbd5e1, -5px -5px 12px #ffffff',
        'emerald-glow': '0 0 30px rgba(0, 245, 155, 0.45)',
        'gold-glow': '0 0 30px rgba(245, 158, 11, 0.45)',
        'hud-glow': '0 0 20px rgba(16, 185, 129, 0.35)',
      },
      animation: {
        'spin-slow': 'spin 24s linear infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radarSweep 4s linear infinite',
      },
      keyframes: {
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
