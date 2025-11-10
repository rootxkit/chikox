import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        'border-primary': 'rgb(var(--color-border-primary) / <alpha-value>)',
        'background-primary': 'rgb(var(--color-background-primary) / <alpha-value>)',
        'background-alternative': 'rgb(var(--color-background-alternative) / <alpha-value>)',
        'background-secondary': 'rgb(var(--color-background-secondary) / <alpha-value>)',
        'text-primary': 'rgb(var(--color-text-primary) / <alpha-value>)',
        'text-alternative': 'rgb(var(--color-text-alternative) / <alpha-value>)',
        neutral: 'rgb(var(--color-neutral) / <alpha-value>)',
        'neutral-white': 'rgb(var(--color-neutral-white) / <alpha-value>)',
        'neutral-light': 'rgb(var(--color-neutral-light) / <alpha-value>)'
      },
      fontSize: {
        '9xl': ['8rem', { lineHeight: '1' }],
        '10xl': ['10rem', { lineHeight: '1' }]
      },
      spacing: {
        '18': '4.5rem'
      }
    }
  },
  plugins: []
};

export default config;
