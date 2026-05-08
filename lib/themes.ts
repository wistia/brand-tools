// lib/themes.ts
// "Paper" themes — each defines bg/fg/accent/muted/eyebrow/divider for a slide.
// Modeled after the AirOps reference: a deck-level theme + per-slide override.

import { colors } from './tokens';

export type ThemeName = 'blue' | 'green' | 'pink' | 'yellow' | 'purple' | 'white';

export type Theme = {
  name: ThemeName;
  label: string;
  bg: string;        // page background
  fg: string;        // primary text
  muted: string;     // secondary text
  accent: string;    // brand accent (buttons, marks)
  eyebrow: string;   // tiny eyebrow text
  divider: string;   // hairlines
  swatch: [string, string, string]; // 3-color preview chip for the picker
};

export const themes: Record<ThemeName, Theme> = {
  blue: {
    name: 'blue',
    label: 'Blue Paper',
    bg: colors.blue[800],
    fg: colors.blue[100],
    muted: colors.blue[300],
    accent: colors.blue[400],
    eyebrow: colors.blue[400],
    divider: colors.blue[700],
    swatch: [colors.blue[800], colors.blue[100], colors.blue[400]],
  },
  green: {
    name: 'green',
    label: 'Green Paper',
    bg: colors.green[800],
    fg: colors.green[100],
    muted: colors.green[300],
    accent: colors.green[400],
    eyebrow: colors.green[400],
    divider: colors.green[700],
    swatch: [colors.green[800], colors.green[100], colors.green[400]],
  },
  pink: {
    name: 'pink',
    label: 'Pink Paper',
    bg: colors.pink[800],
    fg: colors.pink[100],
    muted: colors.pink[300],
    accent: colors.pink[400],
    eyebrow: colors.pink[400],
    divider: colors.pink[700],
    swatch: [colors.pink[800], colors.pink[100], colors.pink[400]],
  },
  yellow: {
    name: 'yellow',
    label: 'Yellow Paper',
    bg: colors.yellow[100],
    fg: colors.neutral.ink,
    muted: colors.neutral[600],
    accent: colors.yellow[600],
    eyebrow: colors.yellow[700],
    divider: colors.yellow[300],
    swatch: [colors.yellow[100], colors.neutral.ink, colors.yellow[400]],
  },
  purple: {
    name: 'purple',
    label: 'Purple Paper',
    bg: colors.purple[800],
    fg: colors.purple[100],
    muted: colors.purple[300],
    accent: colors.purple[400],
    eyebrow: colors.purple[400],
    divider: colors.purple[700],
    swatch: [colors.purple[800], colors.purple[100], colors.purple[400]],
  },
  white: {
    name: 'white',
    label: 'White Paper',
    bg: colors.neutral.white,
    fg: colors.blue[800],
    muted: colors.neutral[600],
    accent: colors.blue[500],
    eyebrow: colors.blue[500],
    divider: colors.neutral[200],
    swatch: [colors.neutral.white, colors.blue[800], colors.blue[500]],
  },
};

export const themeList = Object.values(themes);
