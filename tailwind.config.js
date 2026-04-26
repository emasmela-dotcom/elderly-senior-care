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
        garden: {
          cream: '#F4EFE6',
          'cream-deep': '#E8E0D4',
          sage: {
            50: '#F2F6F0',
            100: '#E2EBDD',
            200: '#C8D9C0',
            300: '#A8C29D',
            400: '#87A67A',
            500: '#6B8A5E',
            600: '#557049',
            700: '#445A3C',
            800: '#384832',
            900: '#2F3D2A',
          },
          clay: {
            50: '#FAF5F1',
            100: '#F0E4DA',
            200: '#E0CCBC',
            300: '#CEB19D',
            400: '#B8947E',
            500: '#A37B66',
            600: '#8A6654',
            700: '#715446',
            800: '#5D463B',
            900: '#4D3B33',
          },
          wood: '#2C2824',
          mist: 'rgba(255, 255, 255, 0.72)',
        },
        primary: {
          50: '#F2F6F0',
          100: '#E2EBDD',
          200: '#C8D9C0',
          300: '#A8C29D',
          400: '#87A67A',
          500: '#6B8A5E',
          600: '#557049',
          700: '#445A3C',
          800: '#384832',
          900: '#2F3D2A',
        },
      },
      boxShadow: {
        garden: '0 2px 24px -6px rgba(47, 61, 42, 0.12)',
        'garden-inner': 'inset 0 1px 0 rgba(255,255,255,0.6)',
      },
      borderRadius: {
        garden: '1.125rem',
      },
    },
  },
  plugins: [],
}
