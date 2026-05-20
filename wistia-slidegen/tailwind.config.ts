import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Poppins', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Wistia Blue
        blue: {
          100: '#F5F6FF', 200: '#CCD5FF', 300: '#99ACFF', 400: '#6B84FF',
          500: '#2A49E5', 600: '#1F3398', 700: '#222E67', 800: '#000833',
        },
        // Wistia Green
        green: {
          100: '#F2FFF0', 200: '#E1FFDB', 300: '#AFE5A4', 400: '#77D963',
          500: '#45B82E', 600: '#268613', 700: '#38662E', 800: '#093300',
        },
        // Wistia Yellow
        yellow: {
          100: '#FFFFF0', 200: '#EFF18E', 300: '#E8EB1E', 400: '#D8DB24',
          500: '#BBBE19', 600: '#9C9F0F', 700: '#777901', 800: '#4A4D00',
        },
        // Wistia Orange
        orange: {
          100: '#FFFBFA', 200: '#FFC8B8', 300: '#FF9D80', 400: '#FF6E42',
          500: '#D1451A', 600: '#B33109', 700: '#82280D', 800: '#4D1200',
        },
        // Wistia Pink
        pink: {
          100: '#FFFAFD', 200: '#FFE5F4', 300: '#FFC7E8', 400: '#FF8ACE',
          500: '#FF42B4', 600: '#DE128C', 700: '#651F49', 800: '#4D002E',
        },
        // Wistia Purple
        purple: {
          100: '#FCF5FF', 200: '#F9E5FF', 300: '#F2CCFF', 400: '#E094FA',
          500: '#D65CFF', 600: '#AB12DE', 700: '#732D8B', 800: '#38004D',
        },
        // Wistia Neutral
        ink: '#0C0C0E',
        grey: {
          100: '#F2F2F3', 200: '#DFDFE2', 300: '#CACBCE', 400: '#A1A3AA',
          500: '#797B86', 600: '#61636B', 700: '#3D3E42', 800: '#242528',
        },
      },
      boxShadow: {
        'elev-1': '0 4px 24px 2px rgba(34, 45, 102, 0.20)',
        'elev-2': '0 2px 12px 0 rgba(34, 45, 102, 0.15)',
        'elev-3': '0 1px 1px 0 rgba(34, 45, 102, 0.15)',
      },
    },
  },
  plugins: [],
};
export default config;
