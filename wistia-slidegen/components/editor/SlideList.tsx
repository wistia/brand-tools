// components/editor/SlideList.tsx
'use client';

import { useDeckStore } from '@/lib/store';
import { SlideRenderer } from '@/components/slides/Layouts';
import { SlideStage } from '@/components/slides/SlideStage';
import { cn } from '@/lib/cn';
import { Plus, Copy, Trash2, GripVertical } from 'lucide-react';
import { Reorder, useDragControls } from 'framer-motion';
import type { Slide } from '@/lib/types';
import type { ThemeName } from '@/lib/themes';

function SlideThumbnail({
  slide,
  index,
  active,
  deckTheme,
  onSelect,
  onDuplicate,
  onDelete,
  canDelete,
}: {
  slide: Slide;
  index: number;
  active: boolean;
  deckTheme: ThemeName;
  onSelect: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  canDelete: boolean;
}) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={slide}
      dragListener={false}
      dragControls={controls}
      className="group relative"
    >
      <div className="flex items-start gap-2">
        <div className="flex flex-col items-center gap-1 mt-1 shrink-0">
          <span className="text-grey-400 text-xs font-mono w-4 text-center">{index + 1}</span>
          <button
            onPointerDown={(e) => controls.start(e)}
            className="cursor-grab active:cursor-grabbing text-grey-600 hover:text-grey-400 touch-none"
            title="Drag to reorder"
          >
            <GripVertical size={14} />
          </button>
        </div>
        <button
          onClick={onSelect}
          className={cn(
            'flex-1 aspect-video rounded-md overflow-hidden border-2 transition-all',
            active
              ? 'border-green-400 shadow-lg'
              : 'border-grey-700 hover:border-grey-500'
          )}
        >
          <SlideStage interactive={false}>
            <SlideRenderer
              slide={slide}
              deckTheme={deckTheme}
              editable={false}
            />
          </SlideStage>
        </button>
      </div>

      {active && canDelete && (
        <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
            className="p-1 rounded bg-grey-900/80 hover:bg-grey-700 text-grey-200"
            title="Duplicate"
          >
            <Copy size={12} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1 rounded bg-grey-900/80 hover:bg-pink-600 text-grey-200"
            title="Delete"
          >
            <Trash2 size={12} />
          </button>
        </div>
      )}
    </Reorder.Item>
  );
}

export function SlideList() {
  const { deck, activeIndex, setActive, addSlide, duplicateSlide, deleteSlide, reorderSlides } = useDeckStore();
  if (!deck) return null;

  return (
    <div className="w-[240px] shrink-0 bg-grey-800 border-r border-grey-700 overflow-y-auto">
      <div className="p-3 space-y-3">
        <Reorder.Group
          axis="y"
          values={deck.slides}
          onReorder={reorderSlides}
          className="space-y-3"
        >
          {deck.slides.map((slide, i) => (
            <SlideThumbnail
              key={slide.id}
              slide={slide}
              index={i}
              active={i === activeIndex}
              deckTheme={deck.theme}
              onSelect={() => setActive(i)}
              onDuplicate={() => duplicateSlide(i)}
              onDelete={() => deleteSlide(i)}
              canDelete={deck.slides.length > 1}
            />
          ))}
        </Reorder.Group>

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
