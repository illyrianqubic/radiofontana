import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      screens: {
        tiny: '320px',
        massive: '2560px',
      },
    },
  },
};

export default config;
