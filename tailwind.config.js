
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FEF9E7',
          100: '#FDF3CF',
          200: '#FBE7A0',
          300: '#F9DB70',
          400: '#F7CF41',
          500: '#F5C311',
          600: '#C49C0E',
          700: '#93750A',
          800: '#624E07',
          900: '#312703',
        },
        black: {
          50: '#E8E8E8',
          100: '#D1D1D1',
          200: '#A3A3A3',
          300: '#757575',
          400: '#474747',
          500: '#191919',
          600: '#141414',
          700: '#0F0F0F',
          800: '#0A0A0A',
          900: '#050505',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        serif: ['var(--font-playfair)'],
      },
      boxShadow: {
        'gold': '0 4px 14px 0 rgba(245, 195, 17, 0.25)',
        'premium': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}
