import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brandOrange: '#ff8c42',
        brandPurple: '#7c3aed',
      },
    },
  },
  plugins: [],
};

export default config;
