/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // Update this based on your project structure
  ],
  theme: {
    extend: {},
    screens: {
      sm: '640px',    // Small screens
      md: '1024px',    // Medium screens
      lg: '1280px',   // Large screens
      xl: '1980px',   // Extra large screens
    },

  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}