// lib/tokens.ts
// Wistia brand tokens — sourced from https://wistia.github.io/brand/

export const colors = {
  blue: {
    100: '#F5F6FF', 200: '#CCD5FF', 300: '#99ACFF', 400: '#6B84FF',
    500: '#2A49E5', 600: '#1F3398', 700: '#222E67', 800: '#000833',
  },
  green: {
    100: '#F2FFF0', 200: '#E1FFDB', 300: '#AFE5A4', 400: '#77D963',
    500: '#45B82E', 600: '#268613', 700: '#38662E', 800: '#093300',
  },
  yellow: {
    100: '#FFFFF0', 200: '#EFF18E', 300: '#E8EB1E', 400: '#D8DB24',
    500: '#BBBE19', 600: '#9C9F0F', 700: '#777901', 800: '#4A4D00',
  },
  orange: {
    100: '#FFFBFA', 200: '#FFC8B8', 300: '#FF9D80', 400: '#FF6E42',
    500: '#D1451A', 600: '#B33109', 700: '#82280D', 800: '#4D1200',
  },
  pink: {
    100: '#FFFAFD', 200: '#FFE5F4', 300: '#FFC7E8', 400: '#FF8ACE',
    500: '#FF42B4', 600: '#DE128C', 700: '#651F49', 800: '#4D002E',
  },
  purple: {
    100: '#FCF5FF', 200: '#F9E5FF', 300: '#F2CCFF', 400: '#E094FA',
    500: '#D65CFF', 600: '#AB12DE', 700: '#732D8B', 800: '#38004D',
  },
  neutral: {
    ink: '#0C0C0E', white: '#FFFFFF',
    100: '#F2F2F3', 200: '#DFDFE2', 300: '#CACBCE', 400: '#A1A3AA',
    500: '#797B86', 600: '#61636B', 700: '#3D3E42', 800: '#242528',
  },
} as const;

// SVG snippets for the Wistia "flags" mark — drawn from brand
export const wistiaFlagSVG = (fill: string) => `
<svg viewBox="0 0 32 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path fill="${fill}" d="M0 4 C0 1.8 1.8 0 4 0 L18 0 L14 24 L4 24 C1.8 24 0 22.2 0 20 Z"/>
  <path fill="${fill}" opacity="0.7" d="M16 4 C16 1.8 17.8 0 20 0 L28 0 C30.2 0 32 1.8 32 4 L32 20 C32 22.2 30.2 24 28 24 L20 24 L24 0 Z" transform="translate(0,0)"/>
</svg>`;

// Wistia wordmark + flag lockup for slide footers
export const wistiaLockupSVG = (fill: string) => `
<svg viewBox="0 0 120 24" xmlns="http://www.w3.org/2000/svg" aria-label="Wistia">
  <g fill="${fill}">
    <path d="M0 4 C0 1.8 1.8 0 4 0 L18 0 L14 24 L4 24 C1.8 24 0 22.2 0 20 Z"/>
    <path opacity="0.7" d="M16 4 C16 1.8 17.8 0 20 0 L28 0 C30.2 0 32 1.8 32 4 L32 20 C32 22.2 30.2 24 28 24 L20 24 L24 0 Z"/>
  </g>
  <text x="40" y="18" font-family="Poppins, sans-serif" font-weight="700" font-size="18" fill="${fill}" letter-spacing="-0.02em">wistia</text>
</svg>`;

export const elevation = {
  1: '0 4px 24px 2px rgba(34, 45, 102, 0.20)',
  2: '0 2px 12px 0 rgba(34, 45, 102, 0.15)',
  3: '0 1px 1px 0 rgba(34, 45, 102, 0.15)',
} as const;

export type ColorFamily = keyof typeof colors;
