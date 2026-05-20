import {
  autoHeadlineSize,
  CarouselFormat,
  ColorScheme,
  colorHex,
  isLightColor,
  readableTextOn,
  RichTextSlide,
} from "@/lib/types";

interface RichTextTemplateProps {
  slide: RichTextSlide;
  scheme: ColorScheme;
  format: CarouselFormat;
}

/**
 * Wistia rich-text layout, modeled after the "type in context" section of
 * the brand site (eyebrow → big Walsheim headline → body).
 *
 * Variants:
 *   - "stacked": all text top-left aligned, generous whitespace. The
 *     editorial default — great when you want the headline to breathe.
 *   - "split": headline pinned to top, body in a tinted card at the bottom.
 *     Better for longer body copy and snappier scanning.
 */
export function RichTextTemplate({
  slide,
  scheme,
  format,
}: RichTextTemplateProps) {
  return slide.variant === "split" ? (
    <SplitVariant slide={slide} scheme={scheme} format={format} />
  ) : (
    <StackedVariant slide={slide} scheme={scheme} format={format} />
  );
}

// ---- Stacked variant ----------------------------------------------------

function StackedVariant({ slide, scheme, format }: RichTextTemplateProps) {
  const bg = colorHex(scheme.primary, "100");
  const fg = colorHex(scheme.primary, "800");
  const accent = colorHex(scheme.accent, "600");
  const bodyColor = colorHex(scheme.primary, "700");

  const headlineSize = autoHeadlineSize(slide.headline);
  // Square gets centered vertically; portrait anchors to top for breathing room
  const justify = format === "portrait" ? "flex-start" : "center";
  const padTop = format === "portrait" ? 140 : 110;

  return (
    <div
      className="relative flex h-full w-full flex-col"
      style={{
        background: bg,
        color: fg,
        padding: `${padTop}px 110px`,
        justifyContent: justify,
      }}
    >
      {/* Accent corner mark — a tiny brand flourish */}
      <div
        className="absolute right-12 top-12 rounded-full"
        style={{ width: 24, height: 24, background: accent }}
      />

      {slide.eyebrow && (
        <div
          className="font-body uppercase"
          style={{
            color: accent,
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: "0.18em",
          }}
        >
          {slide.eyebrow}
        </div>
      )}

      <h2
        className="font-display tracking-tight"
        style={{
          fontSize: headlineSize,
          fontWeight: 900,
          lineHeight: 0.98,
          marginTop: slide.eyebrow ? 32 : 0,
        }}
      >
        {slide.headline || "Headline"}
      </h2>

      <p
        className="font-body"
        style={{
          marginTop: 48,
          fontSize: 30,
          lineHeight: 1.45,
          color: bodyColor,
          maxWidth: "92%",
        }}
      >
        {slide.body || "Body copy."}
      </p>
    </div>
  );
}

// ---- Split variant ------------------------------------------------------

function SplitVariant({ slide, scheme, format }: RichTextTemplateProps) {
  // Top half: saturated primary with white headline. Bottom: light card.
  const topBg = colorHex(scheme.primary, "500");
  const topFg = readableTextOn(scheme.primary, "500");
  const bottomBg = colorHex(scheme.primary, "100");
  const bottomFg = colorHex(scheme.primary, "800");
  const accent = colorHex(scheme.accent, "500");

  // For light primaries (yellow especially), saturated 500 doesn't read; use 700.
  const primaryIsLight = isLightColor(scheme.primary);
  const topBgFinal = primaryIsLight ? colorHex(scheme.primary, "700") : topBg;
  const topFgFinal = primaryIsLight ? "#FFFFFF" : topFg;

  const headlineSize = Math.min(autoHeadlineSize(slide.headline), 96);

  // Portrait has more vertical room — split 60/40, square is 55/45.
  const topFlex = format === "portrait" ? 6 : 5.5;
  const bottomFlex = format === "portrait" ? 4 : 4.5;

  return (
    <div className="flex h-full w-full flex-col">
      {/* Top — headline + eyebrow */}
      <div
        className="relative flex flex-col justify-end"
        style={{
          flex: topFlex,
          background: topBgFinal,
          color: topFgFinal,
          padding: "80px 100px",
        }}
      >
        {slide.eyebrow && (
          <div
            className="font-body uppercase"
            style={{
              color: accent,
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "0.2em",
              marginBottom: 28,
            }}
          >
            {slide.eyebrow}
          </div>
        )}
        <h2
          className="font-display tracking-tight"
          style={{
            fontSize: headlineSize,
            fontWeight: 900,
            lineHeight: 0.98,
          }}
        >
          {slide.headline || "Headline"}
        </h2>

        {/* Decorative bar at the seam */}
        <div
          className="absolute left-0 right-0"
          style={{
            bottom: -8,
            height: 16,
            background: accent,
          }}
        />
      </div>

      {/* Bottom — body copy on light card */}
      <div
        className="flex flex-col justify-center"
        style={{
          flex: bottomFlex,
          background: bottomBg,
          color: bottomFg,
          padding: "70px 100px",
        }}
      >
        <p
          className="font-body"
          style={{
            fontSize: 30,
            lineHeight: 1.45,
            maxWidth: "94%",
          }}
        >
          {slide.body || "Body copy."}
        </p>
      </div>
    </div>
  );
}
