import type { Config } from "tailwindcss";

const config: Config = {
  // This enables the dark: variants
  darkMode: "class",

  // This tells Tailwind where to look for class names
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  // This is where your custom theme is defined
  theme: {
    extend: {
      colors: {
        // --- Your Light Theme ---
        'background': '#FEF3E2',
        'primary': '#FA812F',
        'accent': '#FAB12F',
        'destructive': '#DD0303',
        'text-color': '#27272a',

        // --- Your Dark Theme ---
        'dark-background': '#1c1917',
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