import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        md: '3rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem'
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '100%'
      }
    },
    extend: {
      colors: {
        'border-primary': 'rgb(var(--color-border-primary))',
        'background-primary': 'rgb(var(--color-background-primary))',
        'background-alternative': 'rgb(var(--color-background-alternative))',
        'background-secondary': 'rgb(var(--color-background-secondary))',
        'text-primary': 'rgb(var(--color-text-primary))',
        'text-alternative': 'rgb(var(--color-text-alternative))',
        neutral: 'rgb(var(--color-neutral))',
        'neutral-white': 'rgb(var(--color-neutral-white))',
        'neutral-light': 'rgb(var(--color-neutral-light))',
        accent: 'rgb(var(--color-accent))',
        'accent-hover': 'rgb(var(--color-accent-hover))',
        'accent-light': 'rgb(var(--color-accent-light))'
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
