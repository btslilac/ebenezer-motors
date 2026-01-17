export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#0f172a",
          surface: "#f0f4ff",
          accent: "#2563eb",
          accentLight: "#60a5fa",
          muted: "#e2e8f0",
        },
      },
      fontFamily: {
        heading: ["Plus Jakarta Sans", "sans-serif"],
        body: ["Plus Jakarta Sans", "sans-serif"],
      },
      boxShadow: {
        elevated: "0 24px 45px -22px rgba(37, 99, 235, 0.35)",
      },
    },
  },
  plugins: [],
}