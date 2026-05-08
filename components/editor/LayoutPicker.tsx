// components/editor/LayoutPicker.tsx
'use client';

import { useDeckStore } from '@/lib/store';
import type { LayoutType } from '@/lib/types';
import { cn } from '@/lib/cn';

const LAYOUTS: { type: LayoutType; label: string; preview: React.ReactNode }[] = [
  {
    type: 'cover',
    label: 'Cover',
    preview: (
      <svg viewBox="0 0 60 36" className="w-full h-full">
        <rect x="20" y="14" width="20" height="2" fill="currentColor" opacity="0.6" />
        <rect x="14" y="18" width="32" height="3" fill="currentColor" />
        <rect x="22" y="24" width="16" height="1.5" fill="currentColor" opacity="0.5" />
      </svg>
    ),
  },
  {
    type: 'section',
    label: 'Section',
    preview: (
      <svg viewBox="0 0 60 36" className="w-full h-full">
        <text x="6" y="22" fontSize="14" fill="currentColor" fontWeight="700">01</text>
        <rect x="22" y="12" width="32" height="2" fill="currentColor" />
        <rect x="22" y="16" width="28" height="2" fill="currentColor" />
        <rect x="22" y="22" width="20" height="1.5" fill="currentColor" opacity="0.5" />
      </svg>
    ),
  },
  {
    type: 'two-col',
    label: 'Two-col',
    preview: (
      <svg viewBox="0 0 60 36" className="w-full h-full">
        <rect x="6" y="6" width="20" height="2" fill="currentColor" />
        <rect x="6" y="14" width="3" height="0.6" fill="currentColor" opacity="0.7" />
        <rect x="6" y="17" width="14" height="1.5" fill="currentColor" />
        <rect x="6" y="20" width="18" height="1" fill="currentColor" opacity="0.5" />
        <rect x="6" y="22" width="16" height="1" fill="currentColor" opacity="0.5" />
        <rect x="32" y="14" width="3" height="0.6" fill="currentColor" opacity="0.7" />
        <rect x="32" y="17" width="14" height="1.5" fill="currentColor" />
        <rect x="32" y="20" width="18" height="1" fill="currentColor" opacity="0.5" />
        <rect x="32" y="22" width="16" height="1" fill="currentColor" opacity="0.5" />
      </svg>
    ),
  },
  {
    type: 'big-quote',
    label: 'Big quote',
    preview: (
      <svg viewBox="0 0 60 36" className="w-full h-full">
        <text x="6" y="14" fontSize="10" fill="currentColor" fontWeight="700">“</text>
        <rect x="6" y="16" width="40" height="2" fill="currentColor" />
        <rect x="6" y="20" width="34" height="2" fill="currentColor" />
        <rect x="6" y="26" width="20" height="1.2" fill="currentColor" opacity="0.5" />
      </svg>
    ),
  },
  {
    type: 'hero',
    label: 'Hero',
    preview: (
      <svg viewBox="0 0 60 36" className="w-full h-full">
        <rect x="6" y="10" width="20" height="2" fill="currentColor" />
        <rect x="6" y="14" width="22" height="2" fill="currentColor" />
        <rect x="6" y="20" width="20" height="1" fill="currentColor" opacity="0.5" />
        <rect x="6" y="22" width="16" height="1" fill="currentColor" opacity="0.5" />
        <rect x="34" y="8" width="20" height="20" rx="2" fill="currentColor" opacity="0.3" />
      </svg>
    ),
  },
  {
    type: 'stats',
    label: 'Stats',
    preview: (
      <svg viewBox="0 0 60 36" className="w-full h-full">
        <text x="8" y="20" fontSize="10" fill="currentColor" fontWeight="700">3x</text>
        <text x="24" y="20" fontSize="10" fill="currentColor" fontWeight="700">40</text>
        <text x="42" y="20" fontSize="10" fill="currentColor" fontWeight="700">10x</text>
        <rect x="6" y="24" width="14" height="1" fill="currentColor" opacity="0.5" />
        <rect x="22" y="24" width="14" height="1" fill="currentColor" opacity="0.5" />
        <rect x="40" y="24" width="14" height="1" fill="currentColor" opacity="0.5" />
      </svg>
    ),
  },
];

export function LayoutPicker() {
  const { deck, activeIndex, setLayout } = useDeckStore();
  if (!deck) return null;
  const slide = deck.slides[activeIndex];
  if (!slide) return null;

  return (
    <div className="bg-grey-800 border-t border-grey-700 px-6 py-4">
      <div className="flex items-center gap-4">
        <div className="text-grey-400 text-[11px] tracking-[0.2em] font-mono uppercase">
          Remix Layout |
        </div>
        <div className="flex gap-2">
          {LAYOUTS.map((l) => (
            <button
              key={l.type}
              onClick={() => setLayout(activeIndex, l.type)}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-md border transition w-[110px]',
                slide.layout === l.type
                  ? 'border-green-400 bg-grey-900 text-green-400'
                  : 'border-grey-700 hover:border-grey-500 text-grey-300'
              )}
            >
              <div className="w-full aspect-[16/9] bg-grey-900/50 rounded-sm flex items-center justify-center px-2">
                <div className="w-full h-full">{l.preview}</div>
              </div>
              <span className="text-[11px] font-body">{l.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
