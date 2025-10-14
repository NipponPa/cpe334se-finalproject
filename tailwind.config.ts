import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'auth-bg': '#373434', // Dark gray background
        'auth-text': '#FFDA68', // Gold/yellow text
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;