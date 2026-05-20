import {
  autoQuoteSize,
  CarouselFormat,
  ColorScheme,
  colorHex,
  isLightColor,
  QuoteSlide,
  readableTextOn,
} from "@/lib/types";

interface QuoteTemplateProps {
  slide: QuoteSlide;
  scheme: ColorScheme;
  format: CarouselFormat;
}

/**
 * Wistia pull-quote layout.
 *
 * Two variants drive different uses:
 *   - "light": soft tinted background, dark Walsheim quote, accent-color
 *     decorative quote mark. Use for editorial quotes, longer copy.
 *   - "bold": saturated background, white quote, big accent quote-mark
 *     hairline along the left rail. More attention-grabbing.
 *
 * Both adapt naturally to 4:5 (just more vertical room) without needing
 * a separate code path — the flex column does the work.
 */
export function QuoteTemplate({ slide, scheme, format }: QuoteTemplateProps) {
  return slide.variant === "bold" ? (
    <BoldVariant slide={slide} scheme={scheme} format={format} />
  ) : (
    <LightVariant slide={slide} scheme={scheme} format={format} />
  );
}

// ---- Light variant -------------------------------------------------------

function LightVariant({ slide, scheme, format }: QuoteTemplateProps) {
  // Light tinted background using the 100 shade of primary. Pure brand pattern.
  const bg = colorHex(scheme.primary, "100");
  const fg = colorHex(scheme.primary, "800");
  // Accent at 500 for the big curly quote — pops without overwhelming.
  const accent = colorHex(scheme.accent, "500");
  const subFg = colorHex(scheme.primary, "700");

  const quoteSize = autoQuoteSize(slide.quote);
  // 4:5 has more vertical room, slightly bigger pad-top to balance.
  const padY = format === "portrait" ? 140 : 100;

  return (
    <div
      className="relative flex h-full w-full flex-col justify-center"
      style={{ background: bg, color: fg, padding: `${padY}px 100px` }}
    >
      {/* Decorative accent stripe along the left edge — subtle brand mark */}
      <div
        className="absolute bottom-0 left-0 top-0 w-2"
        style={{ background: accent }}
      />

      {/* Giant curly quote mark — purely decorative, in accent color */}
      <div
        className="font-display"
        style={{
          color: accent,
          fontSize: 200,
          fontWeight: 900,
          lineHeight: 0.7,
          marginBottom: 16,
          marginLeft: -8,
        }}
      >
        &ldquo;
      </div>

      <p
        className="font-display tracking-tight"
        style={{
          fontSize: quoteSize,
          fontWeight: 900,
          lineHeight: 1.05,
        }}
      >
        {slide.quote || "Your quote here."}
      </p>

      {/* Hairline divider between quote and attribution */}
      <div
        className="mt-12"
        style={{ width: 80, height: 4, background: accent }}
      />

      <div className="mt-8">
        <div
          className="font-display"
          style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.1 }}
        >
          {slide.attributionName || "First Last"}
        </div>
        {slide.attributionRole && (
          <div
            className="mt-1 font-body"
            style={{ fontSize: 26, color: subFg, opacity: 0.75 }}
          >
            {slide.attributionRole}
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Bold variant --------------------------------------------------------

function BoldVariant({ slide, scheme, format }: QuoteTemplateProps) {
  // Saturated primary background. We use 600 instead of 500 so the
  // decorative big quote in primary-400 reads as a tonal lighter shape.
  const bg = colorHex(scheme.primary, "600");
  const fg = readableTextOn(scheme.primary, "600");
  // Tonal — same hue, lighter shade — gives a sophisticated brand-y feel.
  const decorative = colorHex(scheme.primary, "400");
  const accent = colorHex(scheme.accent, "400");

  // On light-primary backgrounds (yellow, grey) we want to flip things —
  // the tonal "lighter" version would be too pale. Use 700 instead.
  const primaryIsLight = isLightColor(scheme.primary);
  const decorativeFinal = primaryIsLight
    ? colorHex(scheme.primary, "700")
    : decorative;

  const quoteSize = autoQuoteSize(slide.quote);
  const padY = format === "portrait" ? 160 : 110;

  return (
    <div
      className="relative flex h-full w-full flex-col justify-center overflow-hidden"
      style={{ background: bg, color: fg, padding: `${padY}px 110px` }}
    >
      {/* Giant background quote mark — sits behind content, tonal */}
      <div
        className="pointer-events-none absolute font-display"
        style={{
          color: decorativeFinal,
          fontSize: format === "portrait" ? 900 : 800,
          fontWeight: 900,
          lineHeight: 0.7,
          top: -100,
          right: -60,
          opacity: 0.7,
          zIndex: 0,
        }}
      >
        &rdquo;
      </div>

      <div className="relative z-10">
        <p
          className="font-display tracking-tight"
          style={{
            fontSize: quoteSize,
            fontWeight: 900,
            lineHeight: 1.05,
          }}
        >
          {slide.quote || "Your quote here."}
        </p>

        <div className="mt-14 flex items-center gap-5">
          {/* Accent dot as a brand-y separator */}
          <div
            className="shrink-0 rounded-full"
            style={{ width: 14, height: 14, background: accent }}
          />
          <div>
            <div
              className="font-display"
              style={{
                fontSize: 32,
                fontWeight: 700,
                lineHeight: 1.1,
                color: fg,
              }}
            >
              {slide.attributionName || "First Last"}
            </div>
            {slide.attributionRole && (
              <div
                className="mt-0.5 font-body"
                style={{
                  fontSize: 24,
                  color: fg,
                  opacity: 0.75,
                }}
              >
                {slide.attributionRole}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
