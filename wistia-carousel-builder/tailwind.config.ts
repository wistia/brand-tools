import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Wistia brand colors — full scales straight from the brand guide
        blue: {
          100: "#F5F6FF",
          200: "#CCD5FF",
          300: "#99ACFF",
          400: "#6B84FF",
          500: "#2A49E5",
          600: "#1F3398",
          700: "#222E67",
          800: "#000833",
        },
        green: {
          100: "#F2FFF0",
          200: "#E1FFDB",
          300: "#AFE5A4",
          400: "#77D963",
          500: "#45B82E",
          600: "#268613",
          700: "#38662E",
          800: "#093300",
        },
        yellow: {
          100: "#FFFFF0",
          200: "#EFF18E",
          300: "#E8EB1E",
          400: "#D8DB24",
          500: "#BBBE19",
          600: "#9C9F0F",
          700: "#777901",
          800: "#4A4D00",
        },
        orange: {
          100: "#FFFBFA",
          200: "#FFC8B8",
          300: "#FF9D80",
          400: "#FF6E42",
          500: "#D1451A",
          600: "#B33109",
          700: "#82280D",
          800: "#4D1200",
        },
        pink: {
          100: "#FFFAFD",
          200: "#FFE5F4",
          300: "#FFC7E8",
          400: "#FF8ACE",
          500: "#FF42B4",
          600: "#DE128C",
          700: "#651F49",
          800: "#4D002E",
        },
        purple: {
          100: "#FCF5FF",
          200: "#F9E5FF",
          300: "#F2CCFF",
          400: "#E094FA",
          500: "#D65CFF",
          600: "#AB12DE",
          700: "#732D8B",
          800: "#38004D",
        },
        grey: {
          100: "#F2F2F3",
          200: "#DFDFE2",
          300: "#CACBCE",
          400: "#A1A3AA",
          500: "#797B86",
          600: "#61636B",
          700: "#3D3E42",
          800: "#242528",
        },
        ink: "#0C0C0E", // brand black
      },
      fontFamily: {
        // GT Walsheim (display) and Inter (body) — see globals.css for @font-face
        display: ['"GT Walsheim"', "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        // Wistia elevation system — shadow uses blue700 @ varying alpha
        "elevation-1": "0 4px 24px 2px rgba(34, 45, 102, 0.20)",
        "elevation-2": "0 2px 12px 0 rgba(34, 45, 102, 0.15)",
        "elevation-3": "0 1px 1px 0 rgba(34, 45, 102, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
