import { CarouselFormat, ColorScheme, Slide } from "@/lib/types";
import { CoverTemplate } from "./templates/CoverTemplate";
import { QuoteTemplate } from "./templates/QuoteTemplate";
import { RichTextTemplate } from "./templates/RichTextTemplate";

interface SlideViewProps {
  slide: Slide;
  scheme: ColorScheme;
  format: CarouselFormat;
}

/**
 * Single dispatch point for rendering slides. Each template file owns its
 * own variants and layout logic so this stays a thin router.
 *
 * IMPORTANT: All templates render at the slide's natural pixel dimensions
 * (1080×1080 or 1080×1350). The Canvas wrapper handles scaling; the export
 * pipeline (M5) rasterizes the same DOM at native resolution.
 */
export function SlideView({ slide, scheme, format }: SlideViewProps) {
  switch (slide.type) {
    case "cover":
      return <CoverTemplate slide={slide} scheme={scheme} format={format} />;
    case "quote":
      return <QuoteTemplate slide={slide} scheme={scheme} format={format} />;
    case "richText":
      return <RichTextTemplate slide={slide} scheme={scheme} format={format} />;
  }
}
