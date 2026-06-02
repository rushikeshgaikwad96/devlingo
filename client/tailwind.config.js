/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#58CC02",
        danger: "#FF4B4B",
        warning: "#FFC800",
        dark: "#1A1A2E",
      },
    },
  },
  plugins: [],
}