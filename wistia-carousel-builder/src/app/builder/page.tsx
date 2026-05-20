"use client";

import Link from "next/link";
import { Canvas } from "@/components/Canvas";
import { GlobalControls } from "@/components/GlobalControls";
import { SlideControls } from "@/components/SlideControls";
import { SlideRail } from "@/components/SlideRail";
import { TemplatePicker } from "@/components/TemplatePicker";
import { useCarousel } from "@/lib/useCarousel";
import { useExport } from "@/lib/useExport";
import { useKeyboardShortcuts } from "@/lib/useKeyboardShortcuts";

/**
 * Builder layout: everything in a left panel (slide rail at top, then per-slide
 * controls, then global controls), canvas takes the rest. The left panel is a
 * fixed-width column that scrolls independently so long content doesn't push
 * the canvas around.
 */
export default function BuilderPage() {
  const store = useCarousel();
  const exportState = useExport();
  useKeyboardShortcuts(store);

  return (
    <main className="flex h-screen overflow-hidden bg-grey-100">
      {/* Left panel */}
      <aside className="flex h-full w-[380px] shrink-0 flex-col border-r border-grey-200 bg-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-grey-200 px-5 py-4">
          <Link
            href="/"
            className="font-display text-base font-black text-blue-800"
          >
            ← Wistia
          </Link>
          <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-grey-500">
            Carousel builder
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="flex flex-col gap-6">
            <SlideRail store={store} />
            <Divider />
            <TemplatePicker store={store} />
            <SlideControls store={store} />
            <Divider />
            <GlobalControls store={store} />
          </div>
        </div>

        {/* Footer: export */}
        <div className="border-t border-grey-200 px-5 py-4">
          {exportState.exporting ? (
            <ExportingButton
              progress={exportState.progress}
              message={exportState.message}
            />
          ) : (
            <button
              type="button"
              onClick={() => exportState.run(store.carousel)}
              className="w-full rounded-full bg-blue-500 px-5 py-3 font-display text-sm font-bold text-white shadow-elevation-2 transition hover:bg-blue-600 active:scale-[0.99]"
            >
              Export carousel
              <span className="ml-2 opacity-70">
                ({store.carousel.slides.length}{" "}
                {store.carousel.slides.length === 1 ? "slide" : "slides"})
              </span>
            </button>
          )}
          {exportState.error && (
            <div className="mt-2 rounded-md bg-orange-100 px-3 py-2 text-xs font-medium text-orange-700">
              {exportState.error}
            </div>
          )}
        </div>
      </aside>

      {/* Canvas */}
      <section className="flex-1">
        {store.activeSlide && (
          <Canvas slide={store.activeSlide} carousel={store.carousel} />
        )}
      </section>
    </main>
  );
}

function ExportingButton({
  progress,
  message,
}: {
  progress: number;
  message: string;
}) {
  return (
    <div className="relative w-full overflow-hidden rounded-full bg-blue-200 px-5 py-3">
      <div
        className="absolute inset-y-0 left-0 bg-blue-500 transition-[width] duration-200"
        style={{ width: `${Math.round(progress * 100)}%` }}
      />
      <div className="relative z-10 flex items-center justify-between font-display text-sm font-bold text-blue-800">
        <span>{message || "Exporting..."}</span>
        <span>{Math.round(progress * 100)}%</span>
      </div>
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-grey-200" />;
}
