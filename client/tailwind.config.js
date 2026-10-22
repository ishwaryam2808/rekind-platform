/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rekind: {
          dark: '#141210',       // Deep rich warm black
          charcoal: '#221F1C',   // Elevated dark surface
          espresso: '#382B22',   // Deep espresso brown
          brown: '#5C4435',      // Warm wood brown
          terracotta: '#9A634B', // Muted terracotta accent
          tan: '#C2A68C',        // Warm tan
          sand: '#E6DDD2',       // Sand / soft border
          beige: '#F4EFE6',      // Warm beige background / card
          cream: '#FAF7F2',      // Crisp warm white / page background
          white: '#FFFFFF',
          muted: '#7A726A',      // Subtle secondary text
          border: '#E8E1D5',     // Elegant hairline border
        }
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        heading: ['"Manrope"', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      borderRadius: {
        'card': '16px',
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(20, 18, 16, 0.04)',
        'elevated': '0 10px 30px -5px rgba(20, 18, 16, 0.08)',
        'float': '0 20px 40px -10px rgba(20, 18, 16, 0.12)',
      }
    },
  },
  plugins: [],
}
