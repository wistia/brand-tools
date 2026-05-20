"use client";

import { CarouselStore } from "@/lib/useCarousel";
import { FORMAT_DIMENSIONS, MAX_SLIDES, Slide } from "@/lib/types";
import { SlideView } from "./SlideView";

interface SlideRailProps {
  store: CarouselStore;
}

/**
 * Horizontal rail of slide thumbnails. Each thumbnail is the actual slide
 * rendered at micro scale — gives an honest preview without us building a
 * separate thumbnail component.
 */
export function SlideRail({ store }: SlideRailProps) {
  const {
    carousel,
    activeSlideId,
    setActiveSlideId,
    addSlide,
    removeSlide,
    moveSlide,
  } = store;

  const canAdd = carousel.slides.length < MAX_SLIDES;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-grey-600">
          Slides · {carousel.slides.length}/{MAX_SLIDES}
        </div>
      </div>

      <div className="thumb-rail flex gap-3 overflow-x-auto pb-2">
        {carousel.slides.map((slide, idx) => (
          <Thumbnail
            key={slide.id}
            slide={slide}
            index={idx}
            active={slide.id === activeSlideId}
            onSelect={() => setActiveSlideId(slide.id)}
            onMoveLeft={
              idx > 0 ? () => moveSlide(slide.id, "left") : undefined
            }
            onMoveRight={
              idx < carousel.slides.length - 1
                ? () => moveSlide(slide.id, "right")
                : undefined
            }
            onDelete={
              carousel.slides.length > 1
                ? () => removeSlide(slide.id)
                : undefined
            }
            scheme={carousel.colorScheme}
            format={carousel.format}
          />
        ))}

        {canAdd && (
          <button
            type="button"
            onClick={() => addSlide("quote")}
            className="flex h-[110px] w-[88px] shrink-0 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-blue-300 text-blue-600 transition hover:border-blue-500 hover:bg-blue-100"
            aria-label="Add slide"
          >
            <span className="text-2xl font-light leading-none">+</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider">
              Add
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

interface ThumbnailProps {
  slide: Slide;
  index: number;
  active: boolean;
  onSelect: () => void;
  onMoveLeft?: () => void;
  onMoveRight?: () => void;
  onDelete?: () => void;
  scheme: import("@/lib/types").ColorScheme;
  format: import("@/lib/types").CarouselFormat;
}

function Thumbnail({
  slide,
  index,
  active,
  onSelect,
  onMoveLeft,
  onMoveRight,
  onDelete,
  scheme,
  format,
}: ThumbnailProps) {
  const dims = FORMAT_DIMENSIONS[format];
  // Thumbnail height target ~ 110px, scale to fit
  const THUMB_H = 110;
  const scale = THUMB_H / dims.height;
  const thumbW = dims.width * scale;

  return (
    <div className="group relative shrink-0">
      <button
        type="button"
        onClick={onSelect}
        className={`relative overflow-hidden rounded-xl transition ${
          active
            ? "ring-[3px] ring-blue-500 ring-offset-2 ring-offset-grey-100"
            : "ring-1 ring-blue-700/15 hover:ring-blue-500/40"
        }`}
        style={{ width: thumbW, height: THUMB_H }}
        aria-label={`Select slide ${index + 1}`}
      >
        <div
          style={{
            width: dims.width,
            height: dims.height,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <SlideView slide={slide} scheme={scheme} format={format} />
        </div>
        {/* Slide index pill */}
        <div className="absolute left-1.5 top-1.5 rounded-full bg-blue-800/85 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur">
          {String(index + 1).padStart(2, "0")}
        </div>
      </button>

      {/* Hover/active actions */}
      <div
        className={`absolute -bottom-2 left-1/2 flex -translate-x-1/2 gap-1 rounded-full bg-blue-800 px-1.5 py-1 shadow-elevation-2 transition ${
          active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        <ActionBtn
          label="Move left"
          disabled={!onMoveLeft}
          onClick={onMoveLeft}
        >
          ←
        </ActionBtn>
        <ActionBtn
          label="Move right"
          disabled={!onMoveRight}
          onClick={onMoveRight}
        >
          →
        </ActionBtn>
        <ActionBtn label="Delete" disabled={!onDelete} onClick={onDelete}>
          ×
        </ActionBtn>
      </div>
    </div>
  );
}

function ActionBtn({
  children,
  label,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className="flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white transition hover:bg-white/15 disabled:opacity-30"
    >
      {children}
    </button>
  );
}
