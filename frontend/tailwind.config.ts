import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        alexa: {
          cyan: '#00d4ff',
          blue: '#0066ff',
          deep: '#0a2540',
        },
        surface: {
          base: '#e9eef5',
          card: '#f2f6fa',
          dark: '#1e293b',
        },
      },
      boxShadow: {
        'neu-raised': '7px 7px 16px #cad3df, -7px -7px 16px #ffffff',
        'neu-raised-sm': '4px 4px 10px #cad3df, -4px -4px 10px #ffffff',
        'neu-inset': 'inset 4px 4px 8px #cad3df, inset -4px -4px 8px #ffffff',
        'neu-button': '5px 5px 12px #cad3df, -5px -5px 12px #ffffff',
      },
    },
  },
  plugins: [],
};

export default config;
