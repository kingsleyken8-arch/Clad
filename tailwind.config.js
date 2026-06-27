/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['"Poppins"', "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#08070b",
        card: "#141319",
        brand: { DEFAULT: "#ff6a2b", light: "#ff8a4d", dark: "#e6531a" },
      },
    },
  },
  plugins: [],
};
