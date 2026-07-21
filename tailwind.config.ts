import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef6ff",
          100: "#d8eaff",
          200: "#b8d7ff",
          300: "#88bbff",
          400: "#5294ff",
          500: "#2d72f6",
          600: "#1f57db",
          700: "#1b46b1",
          800: "#1d3d8b",
          900: "#1d356f"
        }
      }
    }
  },
  plugins: []
};

export default config;
