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
          950: '#1b091c',
          900: '#2b102d',
          800: '#3c183f',
          700: '#532157',
          600: '#6d2c73',
          500: '#8c3a93',
          100: '#f5e8f6',
          50: '#fcf6fd',
        },
        marigold: {
          600: '#d97706',
          500: '#f59e0b',
          400: '#fbbf24',
          300: '#fcd34d',
          100: '#fef3c7',
          50: '#fffbeb',
        },
        silver: {
          900: '#334155',
          700: '#64748b',
          500: '#94a3b8',
          300: '#cbd5e1',
          200: '#e2e8f0',
          100: '#f1f5f9',
          50: '#f8fafc',
          chassis: '#e4ebf5',
        },
        alexa: {
          marigold: '#f59e0b',
          amber: '#fbbf24',
          aubergine: '#2b102d',
        },
      },
      boxShadow: {
        'neu-raised': '7px 7px 16px #c4cddb, -7px -7px 16px #ffffff',
        'neu-raised-sm': '4px 4px 10px #c4cddb, -4px -4px 10px #ffffff',
        'neu-inset': 'inset 4px 4px 8px #c4cddb, inset -4px -4px 8px #ffffff',
        'neu-button': '5px 5px 12px #c4cddb, -5px -5px 12px #ffffff',
      },
    },
  },
  plugins: [],
};

export default config;
