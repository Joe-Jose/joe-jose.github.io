import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

export interface SpineNodeSpec {
  id: string;
  ref: string;
}

interface SignalSpineProps {
  nodes: SpineNodeSpec[];
}

interface MeasuredNode extends SpineNodeSpec {
  y: number;
  fraction: number;
}

/**
 * Scroll-driven main copper signal bus running down the left rail.
 * Uses direct DOM attribute updates inside rAF so scrolling causes zero React re-renders.
 */
export const SignalSpine: React.FC<SignalSpineProps> = ({ nodes }) => {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const progressPathRef = useRef<SVGPathElement | null>(null);
  const pulseHeadRef = useRef<SVGCircleElement | null>(null);
  const mobilePathRef = useRef<SVGPathElement | null>(null);
  const mobileHeadRef = useRef<SVGCircleElement | null>(null);
  const nodeRingRefs = useRef<(SVGCircleElement | null)[]>([]);
  const nodeCoreRefs = useRef<(SVGCircleElement | null)[]>([]);
  const nodeLabelRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const [height, setHeight] = useState(1200);
  const [measured, setMeasured] = useState<MeasuredNode[]>([]);
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});

  // Measure actual Y positions of each section relative to <main> parent container
  useEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      const parent = container?.parentElement;
      if (!container || !parent) return;

      const parentRect = parent.getBoundingClientRect();
      const totalH = Math.max(600, parent.scrollHeight);
      setHeight(totalH);

      const next: MeasuredNode[] = [];
      for (const node of nodes) {
        const el = document.getElementById(node.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const y = Math.max(48, Math.min(totalH - 48, rect.top - parentRect.top + 38));
        next.push({
          ...node,
          y,
          fraction: y / totalH,
        });
      }
      setMeasured(next);
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current?.parentElement) {
      ro.observe(containerRef.current.parentElement);
    }
    window.addEventListener('resize', measure, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [nodes]);

  // One-time branch trace draw-in when each section enters viewport
  useEffect(() => {
    if (reducedMotion) {
      const all: Record<string, boolean> = {};
      nodes.forEach((n) => (all[n.id] = true));
      setRevealedIds(all);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setRevealedIds((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
          }
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -10% 0px' }
    );

    for (const n of nodes) {
      const el = document.getElementById(n.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [nodes, reducedMotion]);

  // Scroll-linked pulse position via rAF (no React state updates on scroll)
  useEffect(() => {
    const lineStart = 32;
    const lineEnd = Math.max(lineStart + 100, height - 48);
    const totalLen = lineEnd - lineStart;

    const update = () => {
      const doc = document.documentElement;
      const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
      const progress = reducedMotion ? 1 : Math.min(1, Math.max(0, window.scrollY / maxScroll));

      // Desktop spine
      const path = progressPathRef.current;
      const head = pulseHeadRef.current;
      if (path) {
        path.style.strokeDasharray = `${totalLen}`;
        path.style.strokeDashoffset = `${totalLen * (1 - progress)}`;
      }
      const headY = lineStart + totalLen * progress;
      if (head) {
        head.setAttribute('cy', headY.toFixed(1));
        head.style.opacity = reducedMotion ? '0' : '0.92';
      }

      // Mobile compact rail
      const mPath = mobilePathRef.current;
      const mHead = mobileHeadRef.current;
      if (mPath) {
        const mLen = 96;
        mPath.style.strokeDasharray = `${mLen}`;
        mPath.style.strokeDashoffset = `${mLen * (1 - progress)}`;
      }
      if (mHead) {
        mHead.setAttribute('cy', (12 + 96 * progress).toFixed(1));
        mHead.style.opacity = reducedMotion ? '0' : '0.9';
      }

      // Light up nodes when pulse reaches them
      for (let i = 0; i < measured.length; i++) {
        const reached = headY >= measured[i].y - 18 || reducedMotion;
        const ring = nodeRingRefs.current[i];
        const core = nodeCoreRefs.current[i];
        const lbl = nodeLabelRefs.current[i];
        if (ring) {
          ring.style.strokeOpacity = reached ? '0.8' : '0.24';
          ring.style.fillOpacity = reached ? '0.16' : '0';
        }
        if (core) {
          core.style.fill = reached ? '#E3B778' : '#5F6670';
          core.style.fillOpacity = reached ? '0.95' : '0.55';
        }
        if (lbl) {
          lbl.style.color = reached ? '#E3B778' : '#7F8794';
        }
      }
    };

    let rafPending = false;
    const onScroll = () => {
      if (rafPending) return;
      rafPending = true;
      window.requestAnimationFrame(() => {
        rafPending = false;
        update();
      });
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [height, measured, reducedMotion]);

  const lineStart = 32;
  const lineEnd = Math.max(lineStart + 100, height - 48);

  return (
    <>
      {/* Desktop Full-Height Signal Spine */}
      <div
        ref={containerRef}
        aria-hidden="true"
        className="hidden md:block pointer-events-none select-none absolute top-0 bottom-0 left-3 lg:left-6 xl:left-10 w-16 z-10"
      >
        <svg
          width="64"
          height={height}
          viewBox={`0 0 64 ${height}`}
          fill="none"
          className="overflow-visible"
        >
          {/* Base dormant bus trace */}
          <path
            d={`M 18 ${lineStart} V ${lineEnd}`}
            stroke="rgba(200, 147, 90, 0.16)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Energized scroll trace */}
          <path
            ref={progressPathRef}
            d={`M 18 ${lineStart} V ${lineEnd}`}
            stroke="rgba(227, 183, 120, 0.65)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Branch traces connecting spine node toward each section card */}
          {measured.map((node) => {
            const isDrawn = Boolean(revealedIds[node.id]);
            const branchPath = `M 23 ${node.y} H 38 L 48 ${node.y - 10} H 64`;
            return (
              <path
                key={node.id}
                d={branchPath}
                stroke="rgba(200, 147, 90, 0.34)"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="64"
                strokeDashoffset={isDrawn ? 0 : 64}
                style={{
                  transition: reducedMotion
                    ? 'none'
                    : 'stroke-dashoffset 650ms cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              />
            );
          })}

          {/* Spine Nodes (pad + outer ring) */}
          {measured.map((node, idx) => (
            <g key={node.id}>
              <circle
                ref={(el) => {
                  nodeRingRefs.current[idx] = el;
                }}
                cx="18"
                cy={node.y}
                r="6.5"
                fill="#C8935A"
                fillOpacity="0"
                stroke="#C8935A"
                strokeOpacity="0.24"
                strokeWidth="1.25"
                style={{ transition: 'stroke-opacity 350ms, fill-opacity 350ms' }}
              />
              <circle
                ref={(el) => {
                  nodeCoreRefs.current[idx] = el;
                }}
                cx="18"
                cy={node.y}
                r="2.4"
                fill="#5F6670"
                fillOpacity="0.55"
                style={{ transition: 'fill 350ms, fill-opacity 350ms' }}
              />
            </g>
          ))}

          {/* Moving copper pulse head */}
          <circle
            ref={pulseHeadRef}
            cx="18"
            cy={lineStart}
            r="3.2"
            fill="#FFF7EC"
            stroke="#E3B778"
            strokeWidth="1.5"
            style={{ opacity: 0 }}
          />
        </svg>

        {/* Ref labels beside nodes */}
        {measured.map((node, idx) => (
          <span
            key={node.id}
            ref={(el) => {
              nodeLabelRefs.current[idx] = el;
            }}
            style={{ top: `${node.y - 22}px` }}
            className="absolute left-0 font-mono text-[10px] tracking-[0.14em] uppercase text-[#7F8794] transition-colors duration-300"
          >
            {node.ref}
          </span>
        ))}
      </div>

      {/* Mobile Compact Short Rail */}
      <div
        aria-hidden="true"
        className="md:hidden fixed left-2 top-1/2 -translate-y-1/2 z-10 pointer-events-none select-none opacity-75"
      >
        <svg width="14" height="120" viewBox="0 0 14 120" fill="none">
          <path d="M 7 12 V 108" stroke="rgba(200, 147, 90, 0.2)" strokeWidth="1.5" strokeLinecap="round" />
          <path
            ref={mobilePathRef}
            d="M 7 12 V 108"
            stroke="rgba(227, 183, 120, 0.72)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="7" cy="12" r="2" fill="#C8935A" fillOpacity="0.5" />
          <circle cx="7" cy="60" r="2" fill="#C8935A" fillOpacity="0.5" />
          <circle cx="7" cy="108" r="2" fill="#C8935A" fillOpacity="0.5" />
          <circle ref={mobileHeadRef} cx="7" cy="12" r="2.6" fill="#FFF7EC" stroke="#E3B778" strokeWidth="1.2" />
        </svg>
      </div>
    </>
  );
};
