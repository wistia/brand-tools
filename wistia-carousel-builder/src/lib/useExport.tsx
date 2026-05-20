"use client";

import { useCallback, useState } from "react";
import { createRoot, Root } from "react-dom/client";
import { Carousel } from "./types";
import { exportCarouselAsZip } from "./export";
import { SlideView } from "@/components/SlideView";

interface ExportState {
  exporting: boolean;
  progress: number; // 0..1
  message: string;
  error?: string;
}

/**
 * React hook around the export pipeline.
 *
 * Why React.createRoot instead of just appending HTML? The slide templates
 * are React components with state and props. We need React to actually
 * render them into the offscreen container with the right scheme/format —
 * not just toString them. createRoot gives us a real, isolated React tree
 * inside our hidden DOM node.
 */
export function useExport() {
  const [state, setState] = useState<ExportState>({
    exporting: false,
    progress: 0,
    message: "",
  });

  const run = useCallback(async (carousel: Carousel) => {
    setState({ exporting: true, progress: 0, message: "Preparing..." });

    let root: Root | null = null;

    try {
      await exportCarouselAsZip({
        carousel,
        renderSlide: async (slideIndex, container) => {
          const slide = carousel.slides[slideIndex];
          // Reuse the same root across slides — cheaper than creating a new
          // one each iteration. Container is recreated each loop so we
          // create the root fresh each call.
          root = createRoot(container);
          root.render(
            <SlideView
              slide={slide}
              scheme={carousel.colorScheme}
              format={carousel.format}
            />
          );

          // Wait for the render to commit. Two RAFs is the standard trick
          // to ensure React has flushed and the browser has painted.
          await new Promise((r) => requestAnimationFrame(r));
          await new Promise((r) => requestAnimationFrame(r));
        },
        onProgress: (progress, message) =>
          setState((s) => ({ ...s, progress, message })),
      });

      setState({
        exporting: false,
        progress: 1,
        message: "Exported.",
      });
    } catch (err) {
      console.error("Export failed:", err);
      setState({
        exporting: false,
        progress: 0,
        message: "",
        error: err instanceof Error ? err.message : "Export failed",
      });
    } finally {
      if (root) {
        // Tiny delay so React doesn't yell about unmounting during render.
        setTimeout(() => root?.unmount(), 0);
      }
    }
  }, []);

  const reset = useCallback(() => {
    setState({ exporting: false, progress: 0, message: "" });
  }, []);

  return { ...state, run, reset };
}
