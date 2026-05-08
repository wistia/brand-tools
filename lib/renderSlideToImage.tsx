// lib/renderSlideToImage.ts
'use client';

import { createRoot } from 'react-dom/client';
import { toPng } from 'html-to-image';
import type { Slide } from './types';
import type { ThemeName } from './themes';
import { SlideRenderer } from '@/components/slides/Layouts';

/**
 * Mount a slide into a hidden 1600x900 DOM container, snapshot it as a PNG,
 * then unmount. Used by the PDF exporter to get high-res slide images.
 */
export async function renderSlideToImage(slide: Slide, deckTheme: ThemeName): Promise<string> {
  const host = document.createElement('div');
  host.style.position = 'fixed';
  host.style.left = '-99999px';
  host.style.top = '0';
  host.style.width = '1600px';
  host.style.height = '900px';
  host.style.zIndex = '-1';
  document.body.appendChild(host);

  const root = createRoot(host);

  return new Promise<string>((resolve, reject) => {
    root.render(
      <div style={{ width: 1600, height: 900 }}>
        <SlideRenderer slide={slide} deckTheme={deckTheme} editable={false} />
      </div>
    );

    // Give the DOM a tick to paint, then snapshot.
    setTimeout(async () => {
      try {
        const dataUrl = await toPng(host, {
          width: 1600,
          height: 900,
          pixelRatio: 1.5,
          cacheBust: true,
        });
        resolve(dataUrl);
      } catch (e) {
        reject(e);
      } finally {
        root.unmount();
        host.remove();
      }
    }, 200);
  });
}
