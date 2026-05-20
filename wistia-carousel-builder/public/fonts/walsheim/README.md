# Drop GT Walsheim fonts here

Download the font pack from:
https://wistia.github.io/brand/fonts/GT-Walsheim.zip

Convert to .woff2 (if not already) and place these files in this folder:

- GT-Walsheim-Regular.woff2
- GT-Walsheim-Bold.woff2
- GT-Walsheim-Black.woff2

The @font-face declarations in src/app/globals.css will pick them up
automatically.

Until the fonts are dropped in, the builder falls back to system-ui for the
display font. The color/layout system still works; the headlines just look
generic instead of Wistia-y.
