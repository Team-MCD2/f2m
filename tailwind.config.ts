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
          navy: "#1e3a5f",
          blue: "#2563eb",
          gold: "#c9a227",
          cream: "#f8f6f1",
        },
      },
    },
  },
  plugins: [],
};

export default config;
