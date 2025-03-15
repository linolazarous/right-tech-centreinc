// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}', // Adjust paths as needed
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#1fb6ff',
        'custom-pink': '#ff49db',
        'custom-orange': '#ff7849',
        'custom-green': '#13ce66',
        'custom-gray': '#8492a6',
      },
      fontFamily: {
        sans: ['Graphik', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    // Add other plugins here if needed
  ],
}