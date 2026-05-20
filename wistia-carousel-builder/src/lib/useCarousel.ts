"use client";

import { useCallback, useState } from "react";
import {
  Carousel,
  CarouselFormat,
  ColorScheme,
  emptyCarousel,
  emptySlide,
  MAX_SLIDES,
  Slide,
  SlideType,
} from "./types";

/**
 * Editor state hook.
 *
 * Keeps all mutations in one place so templates and controls can call a
 * narrow API instead of poking at state directly. When we add undo/redo or
 * persistence, this is the seam.
 */
export function useCarousel() {
  const [carousel, setCarousel] = useState<Carousel>(() => emptyCarousel());
  const [activeSlideId, setActiveSlideId] = useState<string>(
    () => carousel.slides[0]?.id ?? ""
  );

  const activeSlide =
    carousel.slides.find((s) => s.id === activeSlideId) ?? carousel.slides[0];

  // ---- Slide mutations ----------------------------------------------------

  const addSlide = useCallback(
    (type: SlideType) => {
      setCarousel((c) => {
        if (c.slides.length >= MAX_SLIDES) return c;
        const next = emptySlide(type);
        setActiveSlideId(next.id);
        return { ...c, slides: [...c.slides, next] };
      });
    },
    []
  );

  const removeSlide = useCallback(
    (id: string) => {
      setCarousel((c) => {
        // Keep at least one slide so the canvas always has something to show.
        if (c.slides.length <= 1) return c;
        const idx = c.slides.findIndex((s) => s.id === id);
        const slides = c.slides.filter((s) => s.id !== id);
        // Move active selection to a neighbor if we removed the active slide.
        if (id === activeSlideId) {
          const newIdx = Math.min(idx, slides.length - 1);
          setActiveSlideId(slides[newIdx].id);
        }
        return { ...c, slides };
      });
    },
    [activeSlideId]
  );

  const moveSlide = useCallback((id: string, direction: "left" | "right") => {
    setCarousel((c) => {
      const idx = c.slides.findIndex((s) => s.id === id);
      if (idx === -1) return c;
      const target = direction === "left" ? idx - 1 : idx + 1;
      if (target < 0 || target >= c.slides.length) return c;
      const slides = [...c.slides];
      [slides[idx], slides[target]] = [slides[target], slides[idx]];
      return { ...c, slides };
    });
  }, []);

  // Generic patch: lets template controls update any field on the active
  // slide. Type-safe via the discriminated union on `type`.
  const updateSlide = useCallback(
    <T extends Slide>(id: string, patch: Partial<T>) => {
      setCarousel((c) => ({
        ...c,
        slides: c.slides.map((s) =>
          s.id === id ? ({ ...s, ...patch } as Slide) : s
        ),
      }));
    },
    []
  );

  // Swap a slide's template. We rebuild from emptySlide() so we don't end up
  // with stale fields from the old template type — cleaner than trying to
  // merge across discriminated unions.
  const changeSlideType = useCallback((id: string, type: SlideType) => {
    setCarousel((c) => ({
      ...c,
      slides: c.slides.map((s) =>
        s.id === id ? { ...emptySlide(type), id } : s
      ),
    }));
  }, []);

  // ---- Carousel-level mutations ------------------------------------------

  const setFormat = useCallback((format: CarouselFormat) => {
    setCarousel((c) => ({ ...c, format }));
  }, []);

  const setColorScheme = useCallback((colorScheme: ColorScheme) => {
    setCarousel((c) => ({ ...c, colorScheme }));
  }, []);

  return {
    carousel,
    activeSlide,
    activeSlideId,
    setActiveSlideId,
    addSlide,
    removeSlide,
    moveSlide,
    updateSlide,
    changeSlideType,
    setFormat,
    setColorScheme,
  };
}

export type CarouselStore = ReturnType<typeof useCarousel>;
