import { useEffect, useRef, useState, CSSProperties } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

export const CoordReadout: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number>();
  const targetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (reducedMotion) return;

    const onPointerMove = (e: PointerEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    const tick = () => {
      const current = coords;
      const target = targetRef.current;
      const nextX = current.x + (target.x - current.x) * 0.12;
      const nextY = current.y + (target.y - current.y) * 0.12;
      setCoords({ x: Math.round(nextX), y: Math.round(nextY) });
      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [coords, reducedMotion]);

  if (reducedMotion) return null;

  const containerStyle: CSSProperties = {
    opacity: coords.x || coords.y ? 1 : 0,
    transition: 'opacity 400ms',
  } as CSSProperties;

  const cardStyle: CSSProperties = { '--sheen-opacity': 0 } as CSSProperties;

  return (
    <div
      aria-hidden="true"
      className="fixed bottom-4 left-4 z-10 pointer-events-none select-none"
      style={containerStyle}
    >
      <div className="glass-card px-3 py-1.5" style={cardStyle}>
        <span className="font-mono text-[10px] tracking-[0.1em] text-ink-tertiary">
          X:{' '}
          <span className="font-mono tabular-nums text-copper-warm">{coords.x.toString().padStart(4, '0')}</span>{' '}
          Y:{' '}
          <span className="font-mono tabular-nums text-copper-warm">{coords.y.toString().padStart(4, '0')}</span>
        </span>
      </div>
    </div>
  );
};