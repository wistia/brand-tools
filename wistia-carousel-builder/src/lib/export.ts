"use client";

import { toPng } from "html-to-image";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Carousel, FORMAT_DIMENSIONS, Slide } from "./types";

/**
 * Multi-asset export pipeline.
 *
 * Strategy: render each slide INTO an off-screen container at native 1080-wide
 * resolution, rasterize to PNG via html-to-image (which uses the browser's
 * own SVG-foreignObject pipeline to do the heavy lifting), zip everything up
 * with jszip, and trigger a download via file-saver.
 *
 * Why off-screen render? The on-screen Canvas is CSS-scaled to fit the
 * viewport. If we rasterized that directly, we'd get a sub-resolution PNG.
 * Rendering into a 1080×1080 (or 1080×1350) hidden container means we get
 * pixel-perfect output regardless of the user's window size.
 *
 * This module is called from useExport hook below. Keep mutation/UI state
 * in the hook so this stays a pure pipeline.
 */

interface RenderableSlide {
  slide: Slide;
  index: number;
  /** DOM node that already contains the SlideView for this slide at native dims */
  element: HTMLElement;
}

/**
 * Rasterize one slide DOM node to a PNG data URL.
 *
 * We pass `cacheBust` so html-to-image refetches inline data-URLs cleanly
 * across multiple slides (otherwise we'd see ghosts from the previous slide
 * sharing the same image src).
 *
 * `pixelRatio: 1` because we ALREADY render at native pixel dimensions —
 * doubling here would give us a 2160×2160 PNG, which we don't want.
 */
async function rasterizeSlide(element: HTMLElement): Promise<string> {
  return toPng(element, {
    pixelRatio: 1,
    cacheBust: true,
    // Fonts may not be loaded the first time we render; wait briefly.
    fontEmbedCSS: undefined,
  });
}

/**
 * Wait for all webfonts to be ready before rasterizing. Critical — if we
 * rasterize before GT Walsheim has loaded, the export will fall back to
 * system-ui, which looks wrong.
 */
async function waitForFonts() {
  if (typeof document === "undefined") return;
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }
  // Small extra delay to let any data-URL images decode.
  await new Promise((r) => setTimeout(r, 100));
}

/**
 * Export a carousel as a zip of PNGs. Caller supplies a function that, given
 * a hidden container, will render each slide into it sequentially. We can't
 * just JSX-render off-screen from a pure function — React owns the DOM, so
 * the hook below uses createRoot to mount slides into the container.
 *
 * @returns a Blob that has been saved via file-saver.
 */
export async function exportCarouselAsZip(params: {
  carousel: Carousel;
  /** Callback that mounts slide N into the provided container and resolves when done */
  renderSlide: (slideIndex: number, container: HTMLElement) => Promise<void>;
  /** Optional progress callback (0..1) */
  onProgress?: (progress: number, message: string) => void;
}): Promise<void> {
  const { carousel, renderSlide, onProgress } = params;
  const { width, height } = FORMAT_DIMENSIONS[carousel.format];

  // Off-screen container — positioned outside the viewport but still rendered
  // by the browser. Visibility:visible (NOT display:none) because hidden
  // elements don't lay out, which would break our font metrics.
  const offscreen = document.createElement("div");
  offscreen.style.position = "fixed";
  offscreen.style.top = "-99999px";
  offscreen.style.left = "0";
  offscreen.style.width = `${width}px`;
  offscreen.style.height = `${height}px`;
  offscreen.style.pointerEvents = "none";
  offscreen.style.zIndex = "-1";
  document.body.appendChild(offscreen);

  try {
    await waitForFonts();

    const zip = new JSZip();
    const total = carousel.slides.length;

    for (let i = 0; i < total; i++) {
      onProgress?.(i / total, `Rendering slide ${i + 1} of ${total}...`);

      // Clear and remount the offscreen container with the i-th slide.
      offscreen.innerHTML = "";
      const slideHost = document.createElement("div");
      slideHost.style.width = `${width}px`;
      slideHost.style.height = `${height}px`;
      offscreen.appendChild(slideHost);

      await renderSlide(i, slideHost);

      // Wait a tick for React to flush, then for fonts/images.
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      await waitForFonts();

      const dataUrl = await rasterizeSlide(slideHost);
      const base64 = dataUrl.replace(/^data:image\/png;base64,/, "");
      const filename = `wistia-carousel-${String(i + 1).padStart(2, "0")}.png`;
      zip.file(filename, base64, { base64: true });
    }

    onProgress?.(0.95, "Zipping...");
    const blob = await zip.generateAsync({ type: "blob" });

    const stamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-")
      .slice(0, 16);
    saveAs(blob, `wistia-carousel-${stamp}.zip`);

    onProgress?.(1, "Done");
  } finally {
    // Always clean up, even if rasterization throws.
    document.body.removeChild(offscreen);
  }
}
