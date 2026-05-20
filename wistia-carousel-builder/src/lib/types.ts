// ============================================================================
// Carousel Builder — Type Definitions
// ============================================================================
// Single source of truth for everything that flows between the editor, the
// templates, and the export pipeline. Add a new slide type? Add it here first.

// ---- Format ---------------------------------------------------------------

export type CarouselFormat = "square" | "portrait";

export const FORMAT_DIMENSIONS: Record<
  CarouselFormat,
  { width: number; height: number; label: string }
> = {
  square: { width: 1080, height: 1080, label: "1:1 Square" },
  portrait: { width: 1080, height: 1350, label: "4:5 Portrait" },
};

// ---- Color schemes --------------------------------------------------------
// Per user spec: each carousel picks ONE primary color and ONE accent color,
// shared across all slides for brand consistency.

export type ColorName =
  | "blue"
  | "green"
  | "yellow"
  | "orange"
  | "pink"
  | "purple"
  | "grey"
  | "ink"
  | "white";

export interface ColorScheme {
  primary: ColorName; // dominant background/foreground color
  accent: ColorName; // used for highlights, decorative elements
}

// Maps our color names to hex values. Mirrors tailwind.config.ts but lives
// in code so templates and export can read it directly.
export const COLOR_PALETTE: Record<ColorName, Record<string, string>> = {
  blue: {
    "100": "#F5F6FF", "200": "#CCD5FF", "300": "#99ACFF", "400": "#6B84FF",
    "500": "#2A49E5", "600": "#1F3398", "700": "#222E67", "800": "#000833",
  },
  green: {
    "100": "#F2FFF0", "200": "#E1FFDB", "300": "#AFE5A4", "400": "#77D963",
    "500": "#45B82E", "600": "#268613", "700": "#38662E", "800": "#093300",
  },
  yellow: {
    "100": "#FFFFF0", "200": "#EFF18E", "300": "#E8EB1E", "400": "#D8DB24",
    "500": "#BBBE19", "600": "#9C9F0F", "700": "#777901", "800": "#4A4D00",
  },
  orange: {
    "100": "#FFFBFA", "200": "#FFC8B8", "300": "#FF9D80", "400": "#FF6E42",
    "500": "#D1451A", "600": "#B33109", "700": "#82280D", "800": "#4D1200",
  },
  pink: {
    "100": "#FFFAFD", "200": "#FFE5F4", "300": "#FFC7E8", "400": "#FF8ACE",
    "500": "#FF42B4", "600": "#DE128C", "700": "#651F49", "800": "#4D002E",
  },
  purple: {
    "100": "#FCF5FF", "200": "#F9E5FF", "300": "#F2CCFF", "400": "#E094FA",
    "500": "#D65CFF", "600": "#AB12DE", "700": "#732D8B", "800": "#38004D",
  },
  grey: {
    "100": "#F2F2F3", "200": "#DFDFE2", "300": "#CACBCE", "400": "#A1A3AA",
    "500": "#797B86", "600": "#61636B", "700": "#3D3E42", "800": "#242528",
  },
  ink: { "500": "#0C0C0E" },
  white: { "500": "#FFFFFF" },
};

// Resolves a (color, shade) pair to a hex. Falls back to 500 if shade missing,
// which keeps ink/white from blowing up since they only define one shade.
export function colorHex(color: ColorName, shade: string = "500"): string {
  return COLOR_PALETTE[color][shade] ?? COLOR_PALETTE[color]["500"];
}

// ---- Slide content --------------------------------------------------------

export type SlideType = "cover" | "quote" | "richText";

export interface CoverSlide {
  id: string;
  type: "cover";
  // Per user spec: large text is primary; logo + images + subtext are
  // configurable secondary elements.
  headline: string;
  subtext?: string;
  showLogo: boolean;
  // Up to 3 images, stored as data URLs so the export pipeline can
  // render them inline without CORS pain.
  images: string[]; // each entry is a data URL
  variant: "minimal" | "showcase";
}

export interface QuoteSlide {
  id: string;
  type: "quote";
  quote: string;
  attributionName: string;
  attributionRole?: string;
  // Two layouts per the M3 spec: a clean light variant and a bold filled
  // variant. Both work in 1:1 and 4:5.
  variant: "light" | "bold";
}

export interface RichTextSlide {
  id: string;
  type: "richText";
  eyebrow?: string;
  headline: string;
  body: string;
  variant: "stacked" | "split";
}

export type Slide = CoverSlide | QuoteSlide | RichTextSlide;

// ---- Carousel -------------------------------------------------------------

export interface Carousel {
  format: CarouselFormat;
  colorScheme: ColorScheme;
  slides: Slide[];
}

export const MAX_SLIDES = 10;

// ---- Factory helpers ------------------------------------------------------
// Centralizes empty-state defaults so the editor and tests stay aligned.

let _idCounter = 0;
export function makeId(): string {
  // Use ONLY a monotonic counter — not Date.now() — so IDs are identical
  // between server-rendered HTML and client hydration. Pre-M5, slides only
  // need stable identity within a session; no DB persistence yet.
  _idCounter += 1;
  return `slide_${_idCounter}`;
}

export function emptySlide(type: SlideType): Slide {
  switch (type) {
    case "cover":
      return {
        id: makeId(),
        type: "cover",
        headline: "Your headline goes here",
        subtext: "",
        showLogo: true,
        images: [],
        variant: "minimal",
      };
    case "quote":
      return {
        id: makeId(),
        type: "quote",
        quote: "A short, punchy quote that fits Wistia's voice.",
        attributionName: "First Last",
        attributionRole: "Title at Company",
        variant: "light",
      };
    case "richText":
      return {
        id: makeId(),
        type: "richText",
        eyebrow: "Content eyebrow",
        headline: "Big headlines in the header are big",
        body:
          "The copy that goes under the big header is larger than normal body copy but still acts as normal body copy that grounds the reader in a longer description.",
        variant: "stacked",
      };
  }
}

export function emptyCarousel(): Carousel {
  return {
    format: "square",
    colorScheme: { primary: "blue", accent: "pink" },
    slides: [emptySlide("cover")],
  };
}

// ---- Color helpers -------------------------------------------------------
// Light/dark detection so templates can pick a readable foreground for any
// chosen primary. Computed at runtime, no need for a lookup table.

const LIGHT_COLORS: ColorName[] = ["yellow", "white", "grey"];

export function isLightColor(name: ColorName, shade: string = "500"): boolean {
  if (LIGHT_COLORS.includes(name)) {
    // Even within "light" colors, the 700/800 shades are dark.
    const shadeNum = parseInt(shade, 10);
    if (shadeNum >= 700) return false;
    return true;
  }
  // For other colors, the 100-300 range is light, 400+ is dark.
  const shadeNum = parseInt(shade, 10);
  return shadeNum < 400;
}

// Returns a readable foreground (white or near-black) for a given background.
export function readableTextOn(name: ColorName, shade: string = "500"): string {
  return isLightColor(name, shade)
    ? colorHex("blue", "800") // brand-y dark instead of pure black
    : "#FFFFFF";
}

// ---- Auto-scale text to fit -----------------------------------------------
// Templates render at a fixed 1080-wide canvas, so we can pick font sizes
// based on raw character count. This is a heuristic, not perfect, but it
// keeps long quotes from overflowing without forcing the user to fiddle.

export function autoQuoteSize(text: string): number {
  const len = text.length;
  if (len < 60) return 96;
  if (len < 120) return 80;
  if (len < 200) return 68;
  if (len < 280) return 56;
  return 48;
}

export function autoHeadlineSize(text: string): number {
  const len = text.length;
  if (len < 30) return 130;
  if (len < 60) return 104;
  if (len < 100) return 84;
  if (len < 150) return 68;
  return 56;
}
