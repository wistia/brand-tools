import {
  autoHeadlineSize,
  CarouselFormat,
  ColorScheme,
  colorHex,
  CoverSlide,
  isLightColor,
  readableTextOn,
} from "@/lib/types";
import { WistiaFlags, WistiaLogo } from "../WistiaLogo";

interface CoverTemplateProps {
  slide: CoverSlide;
  scheme: ColorScheme;
  format: CarouselFormat;
}

/**
 * Cover slide — slide 01 of any carousel.
 *
 * Variants:
 *   - "minimal": text-forward. Large headline dominates, optional subtext,
 *     optional logo top-left, optional image strip along the bottom.
 *     The default. Punchy and clean.
 *   - "showcase": image-led. Large featured image takes ~half the canvas,
 *     headline and copy sit alongside. Best when the carousel is selling
 *     a specific feature/product/visual.
 */
export function CoverTemplate({ slide, scheme, format }: CoverTemplateProps) {
  return slide.variant === "showcase" ? (
    <ShowcaseVariant slide={slide} scheme={scheme} format={format} />
  ) : (
    <MinimalVariant slide={slide} scheme={scheme} format={format} />
  );
}

// ---- Minimal variant ----------------------------------------------------

function MinimalVariant({ slide, scheme, format }: CoverTemplateProps) {
  const bg = colorHex(scheme.primary, "500");
  const fg = readableTextOn(scheme.primary, "500");
  const accent = colorHex(scheme.accent, "400");
  const subFg = fg === "#FFFFFF" ? "rgba(255,255,255,0.85)" : colorHex(scheme.primary, "700");

  // Light primaries (yellow, grey) at 500 look washed out as a full bg.
  // Use 700 instead for those — gives the cover more presence.
  const primaryIsLight = isLightColor(scheme.primary);
  const bgFinal = primaryIsLight ? colorHex(scheme.primary, "700") : bg;
  const fgFinal = primaryIsLight ? "#FFFFFF" : fg;
  const subFgFinal =
    primaryIsLight ? "rgba(255,255,255,0.85)" : subFg;

  const headlineSize = autoHeadlineSize(slide.headline);
  const padY = format === "portrait" ? 90 : 80;

  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden"
      style={{ background: bgFinal, color: fgFinal, padding: `${padY}px 80px` }}
    >
      {/* Decorative concentric corners — Wistia-y geometric flourish */}
      <div
        className="pointer-events-none absolute"
        style={{
          bottom: -120,
          right: -120,
          width: 360,
          height: 360,
          borderRadius: "50%",
          background: accent,
          opacity: 0.35,
          zIndex: 0,
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          bottom: -60,
          right: -60,
          width: 240,
          height: 240,
          borderRadius: "50%",
          background: accent,
          opacity: 0.5,
          zIndex: 0,
        }}
      />

      {/* Top row: logo */}
      <div className="relative z-10 flex items-start justify-between">
        {slide.showLogo ? (
          <WistiaLogo color={fgFinal} height={64} />
        ) : (
          <div />
        )}
        {/* Carousel hint pill */}
        <div
          className="font-body uppercase"
          style={{
            color: fgFinal,
            opacity: 0.6,
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: "0.18em",
          }}
        >
          Swipe →
        </div>
      </div>

      {/* Middle: big headline */}
      <div className="relative z-10 mt-auto">
        <h1
          className="font-display tracking-tight"
          style={{
            fontSize: headlineSize,
            fontWeight: 900,
            lineHeight: 0.95,
          }}
        >
          {slide.headline || "Your headline goes here"}
        </h1>

        {slide.subtext && (
          <p
            className="font-body"
            style={{
              marginTop: 36,
              maxWidth: "82%",
              fontSize: 30,
              lineHeight: 1.4,
              color: subFgFinal,
            }}
          >
            {slide.subtext}
          </p>
        )}
      </div>

      {/* Bottom: image strip (up to 3) */}
      {slide.images.length > 0 && (
        <div
          className="relative z-10 mt-12 flex gap-4"
          style={{ marginBottom: 0 }}
        >
          {slide.images.slice(0, 3).map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src}
              alt=""
              style={{
                width: 168,
                height: 168,
                borderRadius: 20,
                objectFit: "cover",
                boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ---- Showcase variant ---------------------------------------------------

function ShowcaseVariant({ slide, scheme, format }: CoverTemplateProps) {
  const bg = colorHex(scheme.primary, "100");
  const fg = colorHex(scheme.primary, "800");
  const accent = colorHex(scheme.accent, "500");
  const accentBg = colorHex(scheme.primary, "500");
  const featuredFg = readableTextOn(scheme.primary, "500");

  const primaryIsLight = isLightColor(scheme.primary);
  const accentBgFinal = primaryIsLight
    ? colorHex(scheme.primary, "700")
    : accentBg;
  const featuredFgFinal = primaryIsLight ? "#FFFFFF" : featuredFg;

  const headlineSize = Math.min(autoHeadlineSize(slide.headline), 88);
  const featuredImage = slide.images[0];
  const supportingImages = slide.images.slice(1, 3);

  // For portrait: stack vertically (image on top, content below)
  // For square: side-by-side
  if (format === "portrait") {
    return (
      <div
        className="flex h-full w-full flex-col"
        style={{ background: bg, color: fg }}
      >
        {/* Top: featured image or accent block */}
        <div
          className="relative flex items-center justify-center overflow-hidden"
          style={{
            flex: 1,
            background: accentBgFinal,
            color: featuredFgFinal,
          }}
        >
          {featuredImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={featuredImage}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <WistiaFlags color={featuredFgFinal} height={180} />
          )}

          {/* Logo overlay */}
          {slide.showLogo && (
            <div className="absolute left-12 top-12">
              <WistiaLogo
                color={featuredImage ? "#FFFFFF" : featuredFgFinal}
                height={56}
              />
            </div>
          )}
        </div>

        {/* Bottom: content */}
        <div
          className="flex flex-col justify-center"
          style={{ flex: 1, padding: "80px 100px" }}
        >
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
            Cover
          </div>
          <h1
            className="font-display tracking-tight"
            style={{
              fontSize: headlineSize,
              fontWeight: 900,
              lineHeight: 0.98,
            }}
          >
            {slide.headline || "Your headline goes here"}
          </h1>
          {slide.subtext && (
            <p
              className="font-body"
              style={{
                marginTop: 32,
                fontSize: 28,
                lineHeight: 1.4,
                color: colorHex(scheme.primary, "700"),
                opacity: 0.8,
              }}
            >
              {slide.subtext}
            </p>
          )}
          {supportingImages.length > 0 && (
            <div className="mt-10 flex gap-4">
              {supportingImages.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={src}
                  alt=""
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 16,
                    objectFit: "cover",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Square: side-by-side
  return (
    <div className="flex h-full w-full" style={{ background: bg, color: fg }}>
      {/* Left: featured image */}
      <div
        className="relative flex shrink-0 items-center justify-center overflow-hidden"
        style={{
          width: "48%",
          background: accentBgFinal,
        }}
      >
        {featuredImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={featuredImage}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <WistiaFlags color={featuredFgFinal} height={200} />
        )}
      </div>

      {/* Right: content */}
      <div
        className="flex flex-1 flex-col justify-center"
        style={{ padding: "80px 80px" }}
      >
        {slide.showLogo && (
          <div className="mb-12">
            <WistiaLogo color={fg} height={48} />
          </div>
        )}
        <div
          className="font-body uppercase"
          style={{
            color: accent,
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "0.2em",
            marginBottom: 24,
          }}
        >
          Cover
        </div>
        <h1
          className="font-display tracking-tight"
          style={{
            fontSize: headlineSize,
            fontWeight: 900,
            lineHeight: 0.98,
          }}
        >
          {slide.headline || "Your headline goes here"}
        </h1>
        {slide.subtext && (
          <p
            className="font-body"
            style={{
              marginTop: 28,
              fontSize: 26,
              lineHeight: 1.4,
              color: colorHex(scheme.primary, "700"),
              opacity: 0.8,
            }}
          >
            {slide.subtext}
          </p>
        )}
        {supportingImages.length > 0 && (
          <div className="mt-10 flex gap-3">
            {supportingImages.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={src}
                alt=""
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 14,
                  objectFit: "cover",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
