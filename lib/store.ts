// lib/store.ts
'use client';

import { create } from 'zustand';
import { nanoid } from 'nanoid';
import LZString from 'lz-string';
import type { Deck, Slide, LayoutType } from './types';
import type { ThemeName } from './themes';

const STORAGE_KEY = 'wistia-slidegen:decks';
const RECENTS_LIMIT = 20;

// ----- Default content -----

export function makeBlankSlide(layout: LayoutType = 'section'): Slide {
  return {
    id: nanoid(8),
    layout,
    themeOverride: null,
    showLogo: true,
    notes: '',
    content: {
      title: layout === 'cover' ? 'Your headline here' : 'Slide title',
      subtitle: layout === 'cover' ? 'A supporting subtitle for context' : '',
      body: 'Add your content here. Keep it short and punchy.',
    },
  };
}

export function makeStarterDeck(title = 'Untitled deck'): Deck {
  const now = Date.now();
  return {
    id: nanoid(10),
    title,
    theme: 'blue',
    createdAt: now,
    updatedAt: now,
    slides: [
      {
        id: nanoid(8),
        layout: 'cover',
        themeOverride: null,
        showLogo: true,
        notes: '',
        content: {
          eyebrow: 'WISTIA',
          title: 'Video that means business.',
          subtitle: 'A platform for creating, hosting, and measuring video.',
        },
      },
      {
        id: nanoid(8),
        layout: 'section',
        themeOverride: null,
        showLogo: true,
        notes: '',
        content: {
          sectionNumber: '01',
          eyebrow: 'THE PROBLEM',
          title: 'Most video tools are built for studios, not teams.',
          body: 'Marketing teams are stuck juggling players, hosting providers, and analytics platforms that were never designed to talk to each other.',
        },
      },
      {
        id: nanoid(8),
        layout: 'two-col',
        themeOverride: null,
        showLogo: true,
        notes: '',
        content: {
          eyebrow: 'HOW IT WORKS',
          title: 'One platform, every step.',
          columns: [
            { heading: 'Create', body: 'Record, upload, and edit — all in your browser.' },
            { heading: 'Host', body: 'A customizable player that works anywhere your audience is.' },
            { heading: 'Measure', body: 'Engagement analytics that tell you what your viewers actually care about.' },
          ],
        },
      },
      {
        id: nanoid(8),
        layout: 'stats',
        themeOverride: 'green',
        showLogo: true,
        notes: '',
        content: {
          eyebrow: 'IMPACT',
          title: 'The results speak for themselves.',
          stats: [
            { value: '3x', label: 'higher engagement vs. native players' },
            { value: '40%', label: 'reduction in production time' },
            { value: '10x', label: 'more qualified leads from video' },
          ],
        },
      },
      {
        id: nanoid(8),
        layout: 'big-quote',
        themeOverride: 'pink',
        showLogo: true,
        notes: '',
        content: {
          quote: 'Wistia goes beyond conventional metrics, offering valuable insights on viewer engagement.',
          attribution: 'Mark Novakovic — Head of Creative, FishingBooker',
        },
      },
      {
        id: nanoid(8),
        layout: 'hero',
        themeOverride: null,
        showLogo: true,
        notes: '',
        content: {
          eyebrow: "LET'S TALK",
          title: 'Ready to make video work for your business?',
          subtitle: 'Start a free trial or book a demo today.',
        },
      },
    ],
  };
}

// ----- Persistence -----

type Recents = Record<string, { id: string; title: string; updatedAt: number; theme: ThemeName }>;

function loadRecents(): Recents {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveRecents(recents: Recents) {
  if (typeof window === 'undefined') return;
  // trim to most recent
  const entries = Object.values(recents)
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, RECENTS_LIMIT);
  const trimmed: Recents = {};
  for (const e of entries) trimmed[e.id] = e;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}

function loadDeck(id: string): Deck | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}:${id}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveDeck(deck: Deck) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`${STORAGE_KEY}:${deck.id}`, JSON.stringify(deck));
  const recents = loadRecents();
  recents[deck.id] = {
    id: deck.id,
    title: deck.title,
    updatedAt: deck.updatedAt,
    theme: deck.theme,
  };
  saveRecents(recents);
}

// ----- URL sharing (LZ-compressed deck in hash) -----

export function deckToShareUrl(deck: Deck): string {
  const json = JSON.stringify(deck);
  const compressed = LZString.compressToEncodedURIComponent(json);
  if (typeof window === 'undefined') return '';
  return `${window.location.origin}/deck/shared#${compressed}`;
}

export function deckFromHash(hash: string): Deck | null {
  try {
    const trimmed = hash.replace(/^#/, '');
    if (!trimmed) return null;
    const json = LZString.decompressFromEncodedURIComponent(trimmed);
    if (!json) return null;
    return JSON.parse(json) as Deck;
  } catch {
    return null;
  }
}

// ----- Store -----

type DeckStore = {
  deck: Deck | null;
  activeIndex: number;

  loadOrCreate: (id: string) => void;
  loadFromHash: (hash: string) => void;
  setDeck: (deck: Deck) => void;

  setTitle: (title: string) => void;
  setTheme: (theme: ThemeName) => void;

  setActive: (i: number) => void;
  addSlide: (afterIndex?: number) => void;
  duplicateSlide: (i: number) => void;
  deleteSlide: (i: number) => void;
  moveSlide: (from: number, to: number) => void;
  reorderSlides: (slides: Slide[]) => void;

  updateSlide: (i: number, patch: Partial<Slide>) => void;
  updateContent: (i: number, patch: Partial<Slide['content']>) => void;
  setLayout: (i: number, layout: LayoutType) => void;
  setSlideTheme: (i: number, theme: ThemeName | null) => void;
  toggleLogo: (i: number) => void;
};

function persist(deck: Deck): Deck {
  const next = { ...deck, updatedAt: Date.now() };
  saveDeck(next);
  return next;
}

export const useDeckStore = create<DeckStore>((set, get) => ({
  deck: null,
  activeIndex: 0,

  loadOrCreate: (id) => {
    const existing = loadDeck(id);
    if (existing) {
      set({ deck: existing, activeIndex: 0 });
    } else {
      const fresh = makeStarterDeck();
      fresh.id = id;
      saveDeck(fresh);
      set({ deck: fresh, activeIndex: 0 });
    }
  },

  loadFromHash: (hash) => {
    const d = deckFromHash(hash);
    if (d) set({ deck: d, activeIndex: 0 });
  },

  setDeck: (deck) => set({ deck: persist(deck), activeIndex: 0 }),

  setTitle: (title) => {
    const { deck } = get();
    if (!deck) return;
    set({ deck: persist({ ...deck, title }) });
  },

  setTheme: (theme) => {
    const { deck } = get();
    if (!deck) return;
    set({ deck: persist({ ...deck, theme }) });
  },

  setActive: (i) => set({ activeIndex: i }),

  addSlide: (afterIndex) => {
    const { deck, activeIndex } = get();
    if (!deck) return;
    const idx = afterIndex ?? activeIndex;
    const slide = makeBlankSlide('section');
    const slides = [...deck.slides.slice(0, idx + 1), slide, ...deck.slides.slice(idx + 1)];
    set({ deck: persist({ ...deck, slides }), activeIndex: idx + 1 });
  },

  duplicateSlide: (i) => {
    const { deck } = get();
    if (!deck) return;
    const original = deck.slides[i];
    if (!original) return;
    const copy = { ...original, id: nanoid(8), content: { ...original.content } };
    const slides = [...deck.slides.slice(0, i + 1), copy, ...deck.slides.slice(i + 1)];
    set({ deck: persist({ ...deck, slides }), activeIndex: i + 1 });
  },

  deleteSlide: (i) => {
    const { deck, activeIndex } = get();
    if (!deck || deck.slides.length <= 1) return;
    const slides = deck.slides.filter((_, idx) => idx !== i);
    const newActive = Math.min(activeIndex, slides.length - 1);
    set({ deck: persist({ ...deck, slides }), activeIndex: newActive });
  },

  moveSlide: (from, to) => {
    const { deck } = get();
    if (!deck) return;
    const slides = [...deck.slides];
    const [moved] = slides.splice(from, 1);
    slides.splice(to, 0, moved);
    set({ deck: persist({ ...deck, slides }), activeIndex: to });
  },

  reorderSlides: (slides) => {
    const { deck, activeIndex } = get();
    if (!deck) return;
    const activeId = deck.slides[activeIndex]?.id;
    const newActive = slides.findIndex((s) => s.id === activeId);
    set({ deck: persist({ ...deck, slides }), activeIndex: newActive >= 0 ? newActive : 0 });
  },

  updateSlide: (i, patch) => {
    const { deck } = get();
    if (!deck) return;
    const slides = deck.slides.map((s, idx) => (idx === i ? { ...s, ...patch } : s));
    set({ deck: persist({ ...deck, slides }) });
  },

  updateContent: (i, patch) => {
    const { deck } = get();
    if (!deck) return;
    const slides = deck.slides.map((s, idx) =>
      idx === i ? { ...s, content: { ...s.content, ...patch } } : s
    );
    set({ deck: persist({ ...deck, slides }) });
  },

  setLayout: (i, layout) => {
    const { deck } = get();
    if (!deck) return;
    const slides = deck.slides.map((s, idx) => (idx === i ? { ...s, layout } : s));
    set({ deck: persist({ ...deck, slides }) });
  },

  setSlideTheme: (i, theme) => {
    const { deck } = get();
    if (!deck) return;
    const slides = deck.slides.map((s, idx) => (idx === i ? { ...s, themeOverride: theme } : s));
    set({ deck: persist({ ...deck, slides }) });
  },

  toggleLogo: (i) => {
    const { deck } = get();
    if (!deck) return;
    const slides = deck.slides.map((s, idx) => (idx === i ? { ...s, showLogo: !s.showLogo } : s));
    set({ deck: persist({ ...deck, slides }) });
  },
}));

export function getRecents() {
  const r = loadRecents();
  return Object.values(r).sort((a, b) => b.updatedAt - a.updatedAt);
}
