import { useMemo } from 'react';
import { qrRects } from '../game/qr';

export function QrCode({ seed, size = 132 }: { seed: string; size?: number }) {
  const rects = useMemo(() => qrRects(seed), [seed]);
  return (
    <svg
      className="qr-svg"
      viewBox="-1 -1 23 23"
      width={size}
      height={size}
      shapeRendering="crispEdges"
      role="img"
      aria-label="Simulovaný QR kód"
    >
      <rect x="-1" y="-1" width="23" height="23" fill="#ffffff" />
      <g fill="#101820">
        {rects.map((rect) => (
          <rect key={`${rect.x}-${rect.y}`} x={rect.x} y={rect.y} width="1" height="1" />
        ))}
      </g>
    </svg>
  );
}
