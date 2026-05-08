// components/editor/Canvas.tsx
'use client';

import { useDeckStore } from '@/lib/store';
import { SlideRenderer } from '@/components/slides/Layouts';
import { SlideStage } from '@/components/slides/SlideStage';

export function Canvas() {
  const { deck, activeIndex, updateContent } = useDeckStore();
  if (!deck) return null;
  const slide = deck.slides[activeIndex];
  if (!slide) return null;

  return (
    <div className="flex-1 bg-grey-900 p-12 flex items-center justify-center min-h-0">
      <div className="w-full h-full max-w-[1600px] max-h-[900px] aspect-video shadow-2xl rounded-lg overflow-hidden">
        <SlideStage>
          <SlideRenderer
            slide={slide}
            deckTheme={deck.theme}
            editable
            onChange={(patch) => updateContent(activeIndex, patch)}
          />
        </SlideStage>
      </div>
    </div>
  );
}
