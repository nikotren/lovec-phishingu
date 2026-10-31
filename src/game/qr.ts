export interface QrRect {
  x: number;
  y: number;
}

/** Vrací deterministický pseudografický QR vzor — žádná data se nikam neposílají. */
export function qrRects(seed: string): QrRect[] {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  const size = 21;
  const random = () => {
    hash = (hash * 1664525 + 1013904223) >>> 0;
    return hash / 4294967296;
  };

  const finder = (x: number, y: number): number => {
    for (const [offsetX, offsetY] of [
      [0, 0],
      [14, 0],
      [0, 14],
    ]) {
      const dx = x - offsetX;
      const dy = y - offsetY;
      if (dx >= 0 && dx < 7 && dy >= 0 && dy < 7) {
        const border = dx === 0 || dx === 6 || dy === 0 || dy === 6;
        const center = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4;
        return border || center ? 1 : 0;
      }
    }
    return -1;
  };

  const rects: QrRect[] = [];
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const area = finder(x, y);
      const enabled = area === -1 ? random() > 0.5 : area === 1;
      if (enabled) rects.push({ x, y });
    }
  }
  return rects;
}
