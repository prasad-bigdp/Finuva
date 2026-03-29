import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#F3EEFF",
          100: "#E4D6FF",
          200: "#C9ADFF",
          300: "#A97EFF",
          400: "#8B5CF6",
          500: "#7B4FD4",
          600: "#6A3FBB",
          700: "#5530A0",
          800: "#3D2278",
          900: "#1E1050",
        },
        finuva: {
          blue: "#5B9AF5",
          purple: "#7B4FD4",
          pink: "#E040A0",
          dark: "#120B2E",
          navy: "#1E1847",
          slate: "#6B6B8A",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
