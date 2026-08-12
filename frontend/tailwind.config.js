/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        military: {
          900: '#1e293b',
          800: '#334155',
          700: '#475569',
          600: '#64748b'
        }
      }
    },
  },
  plugins: [],
}