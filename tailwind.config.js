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
        brand: {
          DEFAULT: "#ef7a52",
          light: "#f59873",
          dark: "#e05f33",
        },
      },
      boxShadow: {
        card: "0 18px 40px -20px rgba(17,24,39,0.18)",
      },
    },
  },
  plugins: [],
};
