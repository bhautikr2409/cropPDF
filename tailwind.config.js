/** @type {import('tailwindcss').Config} */

/** Accent scale resolves to the active category palette (see index.css). */
const accentScale = Object.fromEntries(
  [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => [
    shade,
    `rgb(var(--accent-${shade}) / <alpha-value>)`,
  ])
);

export default {
  // Avoid a single recursive `./src/**` walk — on Windows leftover folders
  // (e.g. deleted `src/components/crop`) can throw EPERM during scandir.
  content: [
    './index.html',
    './src/*.{js,jsx,ts,tsx}',
    './src/components/*.{js,jsx,ts,tsx}',
    './src/components/home/**/*.{js,jsx,ts,tsx}',
    './src/components/layout/**/*.{js,jsx,ts,tsx}',
    './src/components/seo/**/*.{js,jsx,ts,tsx}',
    './src/components/tools/**/*.{js,jsx,ts,tsx}',
    './src/components/ui/**/*.{js,jsx,ts,tsx}',
    './src/features/**/*.{js,jsx,ts,tsx}',
    './src/pages/**/*.{js,jsx,ts,tsx}',
    './src/constants/**/*.{js,jsx,ts,tsx}',
    './src/lib/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Figtree Variable"', 'Figtree', 'system-ui', 'sans-serif'],
        display: ['"Bricolage Grotesque Variable"', '"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          50: '#F7F7FB',
          100: '#EFEFF6',
          200: '#E2E1EC',
          300: '#C9C7D8',
          400: '#9C99B2',
          500: '#73708C',
          600: '#57546F',
          700: '#403D57',
          800: '#2A2840',
          900: '#1B1930',
          950: '#100F21',
        },
        brand: {
          50: '#F4F0FF',
          100: '#E9E1FF',
          200: '#D3C4FF',
          300: '#B49BFF',
          400: '#9370FF',
          500: '#7A4FF5',
          600: '#6638E0',
          700: '#5528C2',
          800: '#45219C',
          900: '#371C7A',
        },
        accent: accentScale,
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        lift: '0 1px 0 rgb(27 25 48 / 0.04), 0 12px 32px -12px rgb(27 25 48 / 0.18)',
      },
    },
  },
  plugins: [],
};
