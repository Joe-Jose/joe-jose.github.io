import React, { useEffect, useRef } from 'react';
import { generatePcbLayout, PcbLayout, TracePath } from '../pcb/generator';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface PcbCanvasProps {
  debugNets?: boolean;
  pulseBoost?: number;
}

interface PulseSlot {
  traceIdx: number;
  dist: number;
  speed: number;
  tailLen: number;
  cooldown: number;
}

const COPPER_BASE = 'rgba(200, 147, 90, 0.2)';
const COPPER_PAD_STROKE = 'rgba(200, 147, 90, 0.28)';
const COPPER_LIT = 'rgba(227, 183, 120, 0.84)';
const COPPER_LIT_PAD = 'rgba(245, 224, 188, 0.9)';
const BG_BASE = '#07080A';

function drawTraceGeometry(ctx: CanvasRenderingContext2D, trace: TracePath) {
  const pts = trace.points;
  if (pts.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) {
    ctx.lineTo(pts[i].x, pts[i].y);
  }
  ctx.lineWidth = trace.width;
  ctx.stroke();
}

function renderLayoutToCanvas(
  canvas: HTMLCanvasElement,
  layout: PcbLayout,
  dpr: number,
  lit: boolean
) {
  canvas.width = Math.max(1, Math.floor(layout.width * dpr));
  canvas.height = Math.max(1, Math.floor(layout.height * dpr));
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, layout.width, layout.height);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Traces
  ctx.strokeStyle = lit ? COPPER_LIT : COPPER_BASE;
  for (let i = 0; i < layout.traces.length; i++) {
    drawTraceGeometry(ctx, layout.traces[i]);
  }

  // Footprints (outlined rectangles + pin ticks + pin-1 dot)
  ctx.strokeStyle = lit ? 'rgba(227, 183, 120, 0.55)' : 'rgba(200, 147, 90, 0.14)';
  ctx.fillStyle = lit ? 'rgba(227, 183, 120, 0.65)' : 'rgba(200, 147, 90, 0.22)';
  ctx.lineWidth = 1;
  for (let i = 0; i < layout.footprints.length; i++) {
    const fp = layout.footprints[i];
    ctx.strokeRect(fp.x, fp.y, fp.w, fp.h);
    // Pin-1 fiducial dot
    ctx.beginPath();
    ctx.arc(fp.x + 6, fp.y + 6, 1.8, 0, Math.PI * 2);
    ctx.fill();

    if (fp.pinsSide > 0) {
      const step = fp.h / (fp.pinsSide + 1);
      for (let p = 1; p <= fp.pinsSide; p++) {
        const py = fp.y + step * p;
        ctx.fillRect(fp.x - 5, py - 1.2, 5, 2.4);
        ctx.fillRect(fp.x + fp.w, py - 1.2, 5, 2.4);
      }
    }
    if (fp.pinsTop > 0) {
      const step = fp.w / (fp.pinsTop + 1);
      for (let p = 1; p <= fp.pinsTop; p++) {
        const px = fp.x + step * p;
        ctx.fillRect(px - 1.2, fp.y - 5, 2.4, 5);
        ctx.fillRect(px - 1.2, fp.y + fp.h, 2.4, 5);
      }
    }
  }

  // Pads
  ctx.strokeStyle = lit ? COPPER_LIT_PAD : COPPER_PAD_STROKE;
  ctx.fillStyle = lit ? 'rgba(227, 183, 120, 0.26)' : 'rgba(200, 147, 90, 0.08)';
  ctx.lineWidth = 1.2;
  for (let i = 0; i < layout.pads.length; i++) {
    const pad = layout.pads[i];
    if (pad.kind === 'square') {
      const s = pad.size;
      ctx.fillRect(pad.x - s / 2, pad.y - s / 2, s, s);
      ctx.strokeRect(pad.x - s / 2, pad.y - s / 2, s, s);
    } else {
      ctx.beginPath();
      ctx.arc(pad.x, pad.y, pad.size * 0.55, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }

  // Vias (copper ring + dark core hole)
  for (let i = 0; i < layout.vias.length; i++) {
    const via = layout.vias[i];
    ctx.beginPath();
    ctx.arc(via.x, via.y, via.outerR, 0, Math.PI * 2);
    ctx.strokeStyle = lit ? COPPER_LIT_PAD : COPPER_PAD_STROKE;
    ctx.lineWidth = 1.25;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(via.x, via.y, via.innerR, 0, Math.PI * 2);
    ctx.fillStyle = BG_BASE;
    ctx.fill();
  }
}

/**
 * Interpolates a sub-polyline along `trace` from `dStart` to `dEnd` into pre-allocated
 * flat coordinate buffer `outXY` (length >= 2 * points.length). Returns vertex count written.
 */
function sampleSubPath(
  trace: TracePath,
  dStart: number,
  dEnd: number,
  outXY: Float64Array
): number {
  const pts = trace.points;
  const cum = trace.cumLen;
  const n = pts.length;
  if (n < 2 || dEnd <= dStart) return 0;

  let count = 0;

  for (let i = 0; i < n - 1; i++) {
    const segStart = cum[i];
    const segEnd = cum[i + 1];
    if (segEnd < dStart || segStart > dEnd) continue;

    const segLen = segEnd - segStart;
    if (segLen <= 0.0001) continue;

    const p0 = pts[i];
    const p1 = pts[i + 1];

    if (count === 0) {
      const t0 = Math.max(0, (dStart - segStart) / segLen);
      outXY[count * 2] = p0.x + (p1.x - p0.x) * t0;
      outXY[count * 2 + 1] = p0.y + (p1.y - p0.y) * t0;
      count++;
    }

    if (segEnd <= dEnd) {
      outXY[count * 2] = p1.x;
      outXY[count * 2 + 1] = p1.y;
      count++;
    } else {
      const t1 = Math.min(1, (dEnd - segStart) / segLen);
      outXY[count * 2] = p0.x + (p1.x - p0.x) * t1;
      outXY[count * 2 + 1] = p0.y + (p1.y - p0.y) * t1;
      count++;
      break;
    }
  }

  return count;
}

export const PcbCanvas: React.FC<PcbCanvasProps> = ({ debugNets = false, pulseBoost = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = useReducedMotion();
  const debugRef = useRef(debugNets);
  const boostRef = useRef(pulseBoost);

  debugRef.current = debugNets;
  boostRef.current = pulseBoost;

  useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      (window as any).__PCB_MOUNTED__ = true;
      console.log('[PcbCanvas] useEffect mounted', canvas.clientWidth, canvas.clientHeight);

      const staticCanvas = document.createElement('canvas');
      const litCanvas = document.createElement('canvas');
      const maskCanvas = document.createElement('canvas');
      const maskCtx = maskCanvas.getContext('2d');

      let dpr = Math.min(window.devicePixelRatio || 1, 2);
      let viewW = canvas.clientWidth || window.innerWidth;
      let viewH = canvas.clientHeight || window.innerHeight;
      let isMobile = viewW < 768;
      const parallaxPad = 320;

      console.log('[PcbCanvas] initial dimensions', { viewW, viewH, dpr, isMobile });

      let layout = generatePcbLayout(viewW, viewH + parallaxPad, isMobile);
      const scratchXY = new Float64Array(64);

      console.log('[PcbCanvas] layout generated', { traces: layout.traces.length, vias: layout.vias.length });

      // Pre-allocate pulse pool (zero runtime allocations)
      const maxPulses = 20;
      const pulses: PulseSlot[] = new Array(maxPulses);
      for (let i = 0; i < maxPulses; i++) {
        pulses[i] = {
          traceIdx: 0,
          dist: 0,
          speed: 90,
          tailLen: 100,
          cooldown: 0,
        };
      }

      let activePulseCount = isMobile ? 8 : 16;

      const initPulses = () => {
        activePulseCount = Math.min(
          maxPulses,
          Math.min(layout.traces.length, isMobile ? 8 : 17)
        );
        for (let i = 0; i < activePulseCount; i++) {
          const traceIdx = Math.floor((i * layout.traces.length) / Math.max(1, activePulseCount));
          const trace = layout.traces[traceIdx];
          const slot = pulses[i];
          slot.traceIdx = traceIdx;
          slot.speed = 68 + ((i * 23) % 58);
          slot.tailLen = 84 + ((i * 17) % 56);
          slot.dist = ((i * 73) % Math.max(120, Math.floor(trace.totalLength))) - slot.tailLen * 0.4;
          slot.cooldown = (i % 4) * 0.45;
        }
      };

      const rebuildBuffers = () => {
        console.log('[PcbCanvas] rebuildBuffers');
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        viewW = canvas.clientWidth || window.innerWidth;
        viewH = canvas.clientHeight || window.innerHeight;
        isMobile = viewW < 768;

        canvas.width = Math.max(1, Math.floor(viewW * dpr));
        canvas.height = Math.max(1, Math.floor(viewH * dpr));

        maskCanvas.width = canvas.width;
        maskCanvas.height = canvas.height;

        layout = generatePcbLayout(viewW, viewH + parallaxPad, isMobile);
        renderLayoutToCanvas(staticCanvas, layout, dpr, false);
        if (!isMobile && !reducedMotion) {
          renderLayoutToCanvas(litCanvas, layout, dpr, true);
        }
        initPulses();
      };

      rebuildBuffers();

      // Pointer glow state (lerped smoothly)
      let targetX = viewW * 0.5;
      let targetY = viewH * 0.35;
      let glowX = targetX;
      let glowY = targetY;
      let targetGlowAlpha = 0;
      let glowAlpha = 0;

      const onPointerMove = (e: PointerEvent) => {
        if (isMobile || reducedMotion) return;
        targetX = e.clientX;
        targetY = e.clientY;
        targetGlowAlpha = 1;
      };

      const onPointerLeave = () => {
        targetGlowAlpha = 0;
      };

      window.addEventListener('pointermove', onPointerMove, { passive: true });
      document.addEventListener('mouseleave', onPointerLeave);

      // Scroll parallax & velocity boost
      let lastScrollY = window.scrollY;
      let scrollVelocity = 0;

      const drawStaticOnly = () => {
        console.log('[PcbCanvas] drawStaticOnly');
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
          staticCanvas,
          0,
          0,
          canvas.width,
          canvas.height,
          0,
          0,
          canvas.width,
          canvas.height
        );
        if (debugRef.current) {
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          ctx.font = '500 10px "JetBrains Mono", monospace';
          ctx.fillStyle = 'rgba(227, 183, 120, 0.55)';
          for (let i = 0; i < layout.netLabels.length; i++) {
            const nl = layout.netLabels[i];
            ctx.fillText(nl.net, nl.x, nl.y);
          }
        }
      };

      if (reducedMotion) {
        console.log('[PcbCanvas] reducedMotion mode');
        drawStaticOnly();
        let resizeTimer: number | undefined;
        const onResizeReduced = () => {
          window.clearTimeout(resizeTimer);
          resizeTimer = window.setTimeout(() => {
            rebuildBuffers();
            drawStaticOnly();
          }, 160);
        };
        window.addEventListener('resize', onResizeReduced, { passive: true });
        return () => {
          window.clearTimeout(resizeTimer);
          window.removeEventListener('resize', onResizeReduced);
          window.removeEventListener('pointermove', onPointerMove);
          document.removeEventListener('mouseleave', onPointerLeave);
        };
      }

      let rafId = 0;
      let lastTime = performance.now();
      let isVisible = true;
      let isInViewport = true;

      const io = new IntersectionObserver(
        (entries) => {
          if (entries[0]) {
            isInViewport = entries[0].isIntersecting;
          }
        },
        { threshold: 0.01 }
      );
      io.observe(canvas);

      const onVisibility = () => {
        isVisible = !document.hidden;
        if (isVisible) {
          lastTime = performance.now();
        }
      };
      document.addEventListener('visibilitychange', onVisibility);

      let resizeTimer: number | undefined;
      const onResize = () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
          rebuildBuffers();
        }, 120);
      };
      window.addEventListener('resize', onResize, { passive: true });
      const ro = new ResizeObserver(onResize);
      ro.observe(canvas);

      const tick = (now: number) => {
            rafId = window.requestAnimationFrame(tick);
            (window as any).__PCB_TICK_COUNT__ = ((window as any).__PCB_TICK_COUNT__ || 0) + 1;

        if (!isVisible || !isInViewport) {
          lastTime = now;
          return;
        }

        const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) * 0.001));
        lastTime = now;

        // Scroll parallax (~5% of scroll distance, clamped inside offscreen buffer)
        const currentScroll = window.scrollY;
        const deltaScroll = currentScroll - lastScrollY;
        lastScrollY = currentScroll;
        const instantVel = Math.abs(deltaScroll) / Math.max(dt, 0.016);
        scrollVelocity = scrollVelocity * 0.88 + Math.min(instantVel, 2600) * 0.12;
        const velMultiplier = 1 + Math.min(1.6, scrollVelocity * 0.0012);
        const speedMult = velMultiplier * Math.max(1, boostRef.current);

        const parallaxOffsetY = Math.min(parallaxPad - 8, currentScroll * 0.05);
        const srcY = Math.floor(parallaxOffsetY * dpr);

        // 1. Draw base static PCB layer shifted by parallax
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
          staticCanvas,
          0,
          srcY,
          canvas.width,
          canvas.height,
          0,
          0,
          canvas.width,
          canvas.height
        );

        // 2. Cursor glow composite (desktop only)
        if (!isMobile && maskCtx) {
          glowX += (targetX - glowX) * 0.14;
          glowY += (targetY - glowY) * 0.14;
          glowAlpha += (targetGlowAlpha - glowAlpha) * 0.1;

          if (glowAlpha > 0.01) {
            const rx = Math.max(0, Math.floor(glowX - 192));
            const ry = Math.max(0, Math.floor(glowY - 192));
            const rw = Math.min(viewW - rx, Math.ceil(glowX + 192) - rx);
            const rh = Math.min(viewH - ry, Math.ceil(glowY + 192) - ry);

            if (rw > 0 && rh > 0) {
              const srx = Math.floor(rx * dpr);
              const sry = Math.floor(ry * dpr);
              const srw = Math.max(1, Math.floor(rw * dpr));
              const srh = Math.max(1, Math.floor(rh * dpr));

              maskCtx.setTransform(1, 0, 0, 1, 0, 0);
              maskCtx.globalCompositeOperation = 'source-over';
              maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
              maskCtx.drawImage(
                litCanvas,
                srx,
                srcY + sry,
                srw,
                srh,
                srx,
                sry,
                srw,
                srh
              );

              maskCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
              maskCtx.globalCompositeOperation = 'destination-in';
              const grad = maskCtx.createRadialGradient(glowX, glowY, 0, glowX, glowY, 185);
              grad.addColorStop(0, `rgba(255, 255, 255, ${(0.9 * glowAlpha).toFixed(3)})`);
              grad.addColorStop(0.45, `rgba(255, 255, 255, ${(0.36 * glowAlpha).toFixed(3)})`);
              grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
              maskCtx.fillStyle = grad;
              maskCtx.fillRect(rx - 2, ry - 2, rw + 4, rh + 4);

              ctx.drawImage(maskCanvas, srx, sry, srw, srh, srx, sry, srw, srh);
            }
          }
        }

        // 3. Signal pulses along precomputed traces
        ctx.setTransform(dpr, 0, 0, dpr, 0, -parallaxOffsetY);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        for (let i = 0; i < activePulseCount; i++) {
          const slot = pulses[i];
          const trace = layout.traces[slot.traceIdx];
          if (!trace || trace.totalLength < 20) continue;

          if (slot.cooldown > 0) {
            slot.cooldown -= dt;
            continue;
          }

          const localBoost = trace.isHeroLinked ? speedMult : velMultiplier;
          slot.dist += slot.speed * localBoost * dt;

          if (slot.dist - slot.tailLen > trace.totalLength) {
            slot.dist = -20;
            slot.cooldown = 0.25 + ((i * 0.37) % 1.4);
            continue;
          }

          const dStart = Math.max(0, slot.dist - slot.tailLen);
          const dEnd = Math.min(trace.totalLength, slot.dist);
          if (dEnd <= dStart + 2) continue;

          const vCount = sampleSubPath(trace, dStart, dEnd, scratchXY);
          if (vCount < 2) continue;

          const sx = scratchXY[0];
          const sy = scratchXY[1];
          const ex = scratchXY[(vCount - 1) * 2];
          const ey = scratchXY[(vCount - 1) * 2 + 1];

          const pGrad = ctx.createLinearGradient(sx, sy, ex, ey);
          pGrad.addColorStop(0, 'rgba(200, 147, 90, 0)');
          pGrad.addColorStop(0.55, 'rgba(200, 147, 90, 0.42)');
          pGrad.addColorStop(0.88, 'rgba(227, 183, 120, 0.85)');
          pGrad.addColorStop(1, 'rgba(255, 248, 236, 0.92)');

          ctx.beginPath();
          ctx.moveTo(sx, sy);
          for (let v = 1; v < vCount; v++) {
            ctx.lineTo(scratchXY[v * 2], scratchXY[v * 2 + 1]);
          }
          ctx.strokeStyle = pGrad;
          ctx.lineWidth = trace.width + 0.5;
          ctx.stroke();

          // Crisp glowing head dot when head is on path
          if (slot.dist <= trace.totalLength && slot.dist >= 0) {
            ctx.beginPath();
            ctx.arc(ex, ey, 2.0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 248, 236, 0.9)';
            ctx.fill();
          }
        }

        // 4. Optional Net Debug Labels
        if (debugRef.current) {
          ctx.font = '500 10px "JetBrains Mono", monospace';
          for (let i = 0; i < layout.netLabels.length; i++) {
            const nl = layout.netLabels[i];
            const textW = ctx.measureText(nl.net).width + 8;
            ctx.fillStyle = 'rgba(13, 15, 18, 0.82)';
            ctx.fillRect(nl.x - 4, nl.y - 10, textW, 13);
            ctx.strokeStyle = 'rgba(200, 147, 90, 0.45)';
            ctx.lineWidth = 0.75;
            ctx.strokeRect(nl.x - 4, nl.y - 10, textW, 13);
            ctx.fillStyle = 'rgba(227, 183, 120, 0.9)';
            ctx.fillText(nl.net, nl.x, nl.y);
          }
        }
      };

      console.log('[PcbCanvas] starting animation loop');
          (window as any).__PCB_TICK_COUNT__ = 0;
          
          // Initial draw immediately (not waiting for rAF) for hidden/background tabs
          tick(performance.now());
          
          rafId = window.requestAnimationFrame(tick);

      return () => {
        console.log('[PcbCanvas] cleanup');
        window.cancelAnimationFrame(rafId);
        window.clearTimeout(resizeTimer);
        io.disconnect();
        ro.disconnect();
        document.removeEventListener('visibilitychange', onVisibility);
        window.removeEventListener('resize', onResize);
        window.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('mouseleave', onPointerLeave);
      };
    }, [reducedMotion]);

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="pcb-grid-overlay fixed inset-0" />
      <div className="pcb-grain-overlay fixed inset-0" />
      <div className="pcb-vignette-overlay fixed inset-0" />
    </div>
  );
};
