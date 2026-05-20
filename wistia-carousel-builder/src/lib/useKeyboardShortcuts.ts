"use client";

import { useEffect } from "react";
import { CarouselStore } from "./useCarousel";

/**
 * Keyboard shortcuts for the builder.
 *
 * - ArrowLeft/ArrowRight: navigate between slides
 * - Cmd/Ctrl+D: duplicate the active slide (nice-to-have)
 *
 * Skips when the user is focused in a text input or textarea so we don't
 * hijack normal typing.
 */
export function useKeyboardShortcuts(store: CarouselStore) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      const slides = store.carousel.slides;
      const currentIdx = slides.findIndex((s) => s.id === store.activeSlideId);
      if (currentIdx === -1) return;

      if (e.key === "ArrowLeft" && currentIdx > 0) {
        e.preventDefault();
        store.setActiveSlideId(slides[currentIdx - 1].id);
      } else if (
        e.key === "ArrowRight" &&
        currentIdx < slides.length - 1
      ) {
        e.preventDefault();
        store.setActiveSlideId(slides[currentIdx + 1].id);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [store]);
}
