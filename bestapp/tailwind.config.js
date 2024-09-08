/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // Adjust this path if needed
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7357a4',     // Purple
        main: '#880000',        // Dark Red
        bu: '#2740CD',          // Blue
        accent: '#FFA500',      // Orange
        background: '#F5F5F5',  // Light Grey
      },
    },
  },
  plugins: [],
};
