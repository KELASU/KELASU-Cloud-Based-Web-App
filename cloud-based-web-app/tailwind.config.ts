import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': '#FEF3E2',
        'primary': '#FA812F',
        'accent': '#FAB12F',
        'destructive': '#DD0303',
        'text-color': '#111827',

        'dark-background': '#1a202c',
        'dark-primary': '#FA812F',
        'dark-accent': '#FAB12F',
        'dark-destructive': '#DD0303',
        'dark-text-color': '#FEF3E2',
      },
    },
  },
  plugins: [],
};
export default config;