module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class', // Enable dark mode via class
  theme: {
    extend: {
      colors: {
        'dark-bg': '#1f2937', // Dark background
        'dark-card': '#374151', // Dark card background
        'dark-text': '#e5e7eb', // Light text for dark mode
      },
    },
  },
  plugins: [],
};