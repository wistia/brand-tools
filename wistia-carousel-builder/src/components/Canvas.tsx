"use client";

import { useEffect, useRef, useState } from "react";
import { Carousel, FORMAT_DIMENSIONS, Slide } from "@/lib/types";
import { SlideView } from "./SlideView";

interface CanvasProps {
  slide: Slide;
  carousel: Carousel;
}

/**
 * Renders the active slide at native pixel dimensions (1080×1080 or
 * 1080×1350) inside a scaled wrapper. Two reasons to render at native size:
 *
 *   1. The export pipeline (M5) rasterizes the same DOM with no scaling,
 *      so it gets full-resolution PNGs without re-laying-out anything.
 *   2. Designers can work in pixel-true sizes — a 72pt headline IS 72pt.
 *
 * We use a ResizeObserver on the canvas frame to compute the largest scale
 * that fits, with some padding so the slide doesn't kiss the edges.
 */
export function Canvas({ slide, carousel }: CanvasProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const { width: nativeW, height: nativeH } = FORMAT_DIMENSIONS[carousel.format];

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const recompute = () => {
      const padding = 48; // breathing room around the slide
      const availW = frame.clientWidth - padding * 2;
      const availH = frame.clientHeight - padding * 2;
      const next = Math.min(availW / nativeW, availH / nativeH, 1);
      setScale(next > 0 ? next : 0.1);
    };

    recompute();
    const ro = new ResizeObserver(recompute);
    ro.observe(frame);
    return () => ro.disconnect();
  }, [nativeW, nativeH]);

  return (
    <div
      ref={frameRef}
      className="relative flex h-full w-full items-center justify-center overflow-hidden bg-grey-100"
    >
      {/* Subtle dot grid behind the canvas for depth */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, rgba(34, 45, 102, 0.08) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div
        // Scaled slide. We render at native px size, then scale.
        className="slide-canvas shadow-elevation-1"
        style={{
          width: nativeW,
          height: nativeH,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          // border radius is applied to a visually scaled-down element, so we
          // want it crisp regardless of zoom — divide by scale to keep it ~16px on screen
          borderRadius: 16 / scale,
        }}
      >
        <SlideView slide={slide} scheme={carousel.colorScheme} format={carousel.format} />
      </div>

      {/* Format badge in the corner so users know what they're looking at */}
      <div className="absolute bottom-4 right-4 rounded-full bg-blue-800/90 px-3 py-1.5 font-body text-xs font-semibold text-white backdrop-blur">
        {FORMAT_DIMENSIONS[carousel.format].label} ·{" "}
        {Math.round(scale * 100)}%
      </div>
    </div>
  );
}
