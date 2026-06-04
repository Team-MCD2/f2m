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
        f2m: {
          navy: "#0f1419",
          teal: "#0d9488",
          "teal-light": "#5eead4",
          blue: "#0d9488",
          gold: "#ea580c",
          cream: "#f8fafc",
        },
      },
    },
  },
  plugins: [],
};

export default config;
