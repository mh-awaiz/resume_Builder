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
        blue: {
          600: "#2563eb", // rgb fallback for blue-600
        },
        gray: {
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
        },
      },
    },
    plugins: [],
  },
   corePlugins: {
    preflight: false, // optional: avoids modern css reset introducing lab()
  },
};
