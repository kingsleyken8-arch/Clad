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
        ink: "#161520",
        panel: "#1e1c28",
        lilac: {
          light: "#cbbdf2",
          DEFAULT: "#a892e6",
          deep: "#7c63d8",
        },
        taupe: "#c7c2ba",
      },
    },
  },
  plugins: [],
};
