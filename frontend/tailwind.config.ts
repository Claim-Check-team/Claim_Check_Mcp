import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        aubergine: {
          950: '#1e0822',
          900: '#2b0f32',
          850: '#35133c',
          800: '#42184b',
          700: '#561f62',
          600: '#712981',
          500: '#8f34a3',
          200: '#ecd7f1',
          100: '#f6ecf9',
          50: '#faf5fb',
        },
        marigold: {
          600: '#d48b1e',
          500: '#e59d28', // elegant, refined warm gold (not harsh deep orange)
          400: '#f2b544',
          300: '#f8cc6f',
          200: '#fde3a4',
          100: '#fef3d6',
          50: '#fffbf0',
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
        'aubergine-glow': '0 10px 30px -5px rgba(53, 19, 60, 0.3)',
        'marigold-glow': '0 0 20px rgba(229, 157, 40, 0.45)',
      },
    },
  },
  plugins: [],
};

export default config;
