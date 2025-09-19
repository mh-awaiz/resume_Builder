/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  future: {
    disableColorOpacityUtilitiesByDefault: true,
  },
  theme: {
    extend: {
      colors: {
        primary: "#155dfc", // Blue
        secondary: "#1d4ed8", // light blue
        background: "oklch(1 0 0)", // White
        foreground: "black", // Black
        black: "#000000",
        white: "#ffffff",
        blue: {
          600: "#2563eb", // rgb fallback for blue-600
        },
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        },
      },
    },
    plugins: [],
  },
  corePlugins: {
    preflight: false, // optional: avoids modern css reset introducing lab()
  },
};
