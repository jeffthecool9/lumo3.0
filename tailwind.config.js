/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["Inter", "sans-serif"] },
      colors: {
        cloud: "#FAFAFA",
        brand: {
          dark: "#0f172a",
          accent: "#2563eb",
        },
      },
    },
  },
  plugins: [],
};
