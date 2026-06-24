/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Massive condensed display word (PLAY STRONG)
        anton: ['"Anton"', "sans-serif"],
        // Heavy section headings + UI
        archivo: ['"Archivo"', "sans-serif"],
        // Body, nav, captions, stats
        inter: ['"Inter"', "sans-serif"],
      },
      colors: {
        // Brand chartreuse / lime accent
        lime: {
          DEFAULT: "#C2DB1E",
          400: "#CDE53A",
          500: "#C2DB1E",
          600: "#A9C00B",
          700: "#8FA200",
        },
        ink: "#0B0B0C",
        paper: "#F4F4F1",
        sky: {
          top: "#2C7FD6",
          mid: "#5FA8E8",
          low: "#A7D2F4",
        },
      },
      boxShadow: {
        card: "0 18px 50px -20px rgba(0,0,0,0.25)",
        float: "0 30px 80px -30px rgba(0,0,0,0.45)",
      },
    },
  },
  plugins: [],
};
