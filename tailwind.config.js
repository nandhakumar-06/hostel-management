/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#263238',       // Deep Slate
          dark: '#1B2529',          // Dark Navy Slate
          accent: '#4F8A89',        // Muted Teal
          accentHover: '#3d6e6d',   // Darker Muted Teal
          secondary: '#78909C',     // Soft Sage
          bg: '#F5F6F4',            // Warm Off-White
          card: '#FFFFFF',          // White
          mainText: '#263238',      // Charcoal
          subText: '#667085',       // Grey
          border: '#D9DEDF',        // Light Grey
          success: '#5F8068',       // Muted Green
          warning: '#A9824A',       // Muted Amber
          error: '#A65D5D',         // Muted Red
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
