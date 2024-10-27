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
        primaryMaroon: "#800000",
        darkBlue: "#000080",
        lightBlue: "#4682B4",
        goldAccent: "#FFD700",
        white: "#FFFFFF", // if you want to reference it as a custom color
      },
    },
  },
  plugins: [],
};
export default config;
