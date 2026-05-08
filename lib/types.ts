// lib/types.ts
import type { ThemeName } from './themes';

export type LayoutType = 'cover' | 'section' | 'two-col' | 'big-quote' | 'hero' | 'stats';

export type ColumnContent = { heading: string; body: string };

export type StatItem = { value: string; label: string };

// One slide carries ALL possible content fields. Each layout uses the
// subset it cares about. This is what makes "Remix Layout" work — switching
// from Cover to Two-col doesn't destroy your title, it just reflows.
export type Slide = {
  id: string;
  layout: LayoutType;
  themeOverride: ThemeName | null; // null = inherit deck theme
  showLogo: boolean;
  notes: string;
  content: {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    body?: string;
    quote?: string;
    attribution?: string;
    sectionNumber?: string;
    image?: { src: string; alt?: string } | null;
    columns?: ColumnContent[];
    stats?: StatItem[];
  };
};

export type Deck = {
  id: string;
  title: string;
  theme: ThemeName;
  slides: Slide[];
  createdAt: number;
  updatedAt: number;
};
