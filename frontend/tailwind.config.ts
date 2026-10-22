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
        aubergine: {
          950: '#18071c',
          900: '#260c2d',
          850: '#32103b',
          800: '#42164d',
          700: '#581f66',
          600: '#722a84',
          500: '#8e37a4',
          200: '#ecd4f2',
          100: '#f6eaf8',
          50: '#faf5fb',
        },
        alexa: {
          cyan: '#00d2ff',
          neon: '#00caff',
          sapphire: '#0284c7',
          deep: '#0369a1',
          glow: 'rgba(0, 210, 255, 0.45)',
        },
        cyan: {
          950: '#082f49',
          900: '#0c4a6e',
          800: '#075985',
          700: '#0369a1',
          600: '#0284c7',
          500: '#0ea5e9',
          400: '#38bdf8',
          300: '#7dd3fc',
          200: '#bae6fd',
          100: '#e0f2fe',
          50: '#f0f9ff',
        },
        // Fallback compatibility mapped to Alexa Cyan
        marigold: {
          600: '#0284c7',
          500: '#0ea5e9',
          400: '#38bdf8',
          300: '#7dd3fc',
          200: '#bae6fd',
          100: '#e0f2fe',
          50: '#f0f9ff',
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
        'neu-raised': '6px 6px 14px #cbd5e1, -6px -6px 14px #ffffff',
        'neu-raised-sm': '3px 3px 8px #cbd5e1, -3px -3px 8px #ffffff',
        'neu-inset': 'inset 3px 3px 6px #cbd5e1, inset -3px -3px 6px #ffffff',
        'neu-button': '4px 4px 10px #cbd5e1, -4px -4px 10px #ffffff',
        'aubergine-glow': '0 10px 30px -5px rgba(38, 12, 45, 0.4)',
        'alexa-glow': '0 0 25px rgba(0, 210, 255, 0.55)',
      },
    },
  },
  plugins: [],
};

export default config;
