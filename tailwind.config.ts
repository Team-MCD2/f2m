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
          navy: "#1a2332",
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
