// components/editor/SlideList.tsx
'use client';

import { useDeckStore } from '@/lib/store';
import { SlideRenderer } from '@/components/slides/Layouts';
import { SlideStage } from '@/components/slides/SlideStage';
import { cn } from '@/lib/cn';
import { Plus, Copy, Trash2 } from 'lucide-react';

export function SlideList() {
  const { deck, activeIndex, setActive, addSlide, duplicateSlide, deleteSlide } = useDeckStore();
  if (!deck) return null;

  return (
    <div className="w-[240px] shrink-0 bg-grey-800 border-r border-grey-700 overflow-y-auto">
      <div className="p-3 space-y-3">
        {deck.slides.map((slide, i) => (
          <div key={slide.id} className="group relative">
            <div className="flex items-start gap-2">
              <span className="text-grey-400 text-xs font-mono w-4 mt-2 shrink-0">{i + 1}</span>
              <button
                onClick={() => setActive(i)}
                className={cn(
                  'flex-1 aspect-video rounded-md overflow-hidden border-2 transition-all',
                  i === activeIndex
                    ? 'border-green-400 shadow-lg'
                    : 'border-grey-700 hover:border-grey-500'
                )}
              >
                <SlideStage interactive={false}>
                  <SlideRenderer
                    slide={slide}
                    deckTheme={deck.theme}
                    editable={false}
                  />
                </SlideStage>
              </button>
            </div>

            {i === activeIndex && deck.slides.length > 1 && (
              <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={(e) => { e.stopPropagation(); duplicateSlide(i); }}
                  className="p-1 rounded bg-grey-900/80 hover:bg-grey-700 text-grey-200"
                  title="Duplicate"
                >
                  <Copy size={12} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteSlide(i); }}
                  className="p-1 rounded bg-grey-900/80 hover:bg-pink-600 text-grey-200"
                  title="Delete"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            )}
          </div>
        ))}

        <button
          onClick={() => addSlide()}
          className="w-full aspect-video rounded-md border-2 border-dashed border-grey-700 hover:border-green-400 text-grey-400 hover:text-green-400 transition flex items-center justify-center gap-2 ml-6"
        >
          <Plus size={16} /> <span className="text-xs">Add slide</span>
        </button>
      </div>
    </div>
  );
}
