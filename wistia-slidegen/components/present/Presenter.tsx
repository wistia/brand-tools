// components/present/Presenter.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDeckStore } from '@/lib/store';
import { SlideRenderer } from '@/components/slides/Layouts';
import { SlideStage } from '@/components/slides/SlideStage';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export function Presenter({ startIndex = 0 }: { startIndex?: number }) {
  const router = useRouter();
  const { deck } = useDeckStore();
  const [i, setI] = useState(startIndex);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!deck) return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setDirection(1);
        setI((prev) => Math.min(prev + 1, deck.slides.length - 1));
      } else if (e.key === 'ArrowLeft') {
        setDirection(-1);
        setI((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Escape') {
        router.back();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [deck, router]);

  if (!deck) return null;
  const slide = deck.slides[i];

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={slide.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <SlideStage interactive={false}>
              <SlideRenderer slide={slide} deckTheme={deck.theme} editable={false} />
            </SlideStage>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute top-4 right-4 flex items-center gap-2">
        <span className="text-grey-400 text-sm font-mono">
          {i + 1} / {deck.slides.length}
        </span>
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full bg-grey-800/80 hover:bg-grey-700 text-grey-100"
        >
          <X size={18} />
        </button>
      </div>

      <button
        onClick={() => { setDirection(-1); setI(Math.max(i - 1, 0)); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-grey-800/40 hover:bg-grey-700/80 text-grey-100 opacity-0 hover:opacity-100 transition"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => { setDirection(1); setI(Math.min(i + 1, deck.slides.length - 1)); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-grey-800/40 hover:bg-grey-700/80 text-grey-100 opacity-0 hover:opacity-100 transition"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
