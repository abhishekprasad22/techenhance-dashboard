/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          400: "#60A5FA",
          500: "#3B82F6",
        },
        accent: {
          400: "#34D399",
        },
        slate: {
          900: "#0F172A",
        },
      },
    },
  },
  plugins: [],
};
