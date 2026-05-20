// lib/pdf.ts
'use client';

import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';
import type { Deck } from './types';

/**
 * Render each slide off-screen to a PNG, then drop into a 16:9 landscape PDF.
 * We mount a hidden DOM stage to keep the export pixel-accurate.
 */
export async function exportDeckToPDF(
  deck: Deck,
  onProgress?: (done: number, total: number) => void
) {
  const { renderSlideToImage } = await import('./renderSlideToImage');

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [1600, 900],
    compress: true,
  });

  for (let i = 0; i < deck.slides.length; i++) {
    const dataUrl = await renderSlideToImage(deck.slides[i], deck.theme);
    if (i > 0) pdf.addPage([1600, 900], 'landscape');
    pdf.addImage(dataUrl, 'PNG', 0, 0, 1600, 900);
    onProgress?.(i + 1, deck.slides.length);
  }

  pdf.save(`${deck.title.replace(/[^a-z0-9-_ ]/gi, '_')}.pdf`);
}

export { toPng };
