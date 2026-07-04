/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)"],
        head: ["var(--font-head)"],
        mono: ["var(--font-mono)"],
        body: ["var(--font-body)"],
        interdisplay: ["'Inter Display'", "Inter", "sans-serif"],
      },
      colors: {
        ink: "var(--ink)",
        paper: "var(--paper)",
        steel: "var(--steel)",
        signal: "var(--signal)",
      },
    },
  },
  plugins: [],
};
