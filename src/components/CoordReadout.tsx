import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

export const CoordReadout: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const xRef = useRef<HTMLSpanElement>(null);
  const yRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let raf = 0;
    let seen = false;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!seen && wrapRef.current) {
        seen = true;
        wrapRef.current.style.opacity = '1';
      }
    };

    const tick = () => {
      current.x += (target.x - current.x) * 0.15;
      current.y += (target.y - current.y) * 0.15;
      if (xRef.current) xRef.current.textContent = String(Math.round(current.x)).padStart(4, '0');
      if (yRef.current) yRef.current.textContent = String(Math.round(current.y)).padStart(4, '0');
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="hidden md:block fixed bottom-4 left-4 z-10 pointer-events-none select-none"
      style={{ opacity: 0, transition: 'opacity 400ms' }}
    >
      <div className="glass-card px-3 py-1.5">
        <span className="font-mono text-[10px] tracking-[0.1em] text-ink-tertiary">
          X: <span ref={xRef} className="tabular-nums text-copper-warm">0000</span> Y:{' '}
          <span ref={yRef} className="tabular-nums text-copper-warm">0000</span>
        </span>
      </div>
    </div>
  );
};
