import { SeededRng } from './prng';

export interface Point {
  x: number;
  y: number;
}

export interface TracePath {
  points: Point[];
  cumLen: Float64Array;
  totalLength: number;
  width: number;
  net: string;
  isHeroLinked?: boolean;
}

export interface ViaNode {
  x: number;
  y: number;
  outerR: number;
  innerR: number;
}

export interface PadNode {
  x: number;
  y: number;
  size: number;
  kind: 'circle' | 'square';
}

export interface FootprintRect {
  x: number;
  y: number;
  w: number;
  h: number;
  pinsTop: number;
  pinsSide: number;
  label: string;
}

export interface NetLabelAnchor {
  x: number;
  y: number;
  net: string;
}

export interface PcbLayout {
  width: number;
  height: number;
  traces: TracePath[];
  vias: ViaNode[];
  pads: PadNode[];
  footprints: FootprintRect[];
  netLabels: NetLabelAnchor[];
}

const NET_NAMES = [
  'VCC',
  'GND',
  'SDA',
  'SCL',
  'TX',
  'RX',
  'MOSI',
  'SCK',
  '3V3',
  'EN',
] as const;

const SQRT2 = Math.SQRT2;
const TAN_22_5 = SQRT2 - 1;

function computeTraceMetrics(points: Point[], width: number, net: string, isHeroLinked = false): TracePath {
  const cumLen = new Float64Array(points.length);
  let total = 0;
  cumLen[0] = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    total += Math.hypot(dx, dy);
    cumLen[i] = total;
  }
  return { points, cumLen, totalLength: total, width, net, isHeroLinked };
}

/**
 * Generates an exact orthogonal + 45-degree chamfered polyline for lane `laneIdx`
 * inside a parallel bus, preserving perpendicular spacing `pitch`.
 * Mode 'hdh': Horizontal -> 45deg Diagonal -> Horizontal
 * Mode 'vdv': Vertical -> 45deg Diagonal -> Vertical
 */
function makeBusLaneHDH(
  x0: number,
  x1: number,
  y0: number,
  dy: number,
  turnX: number,
  laneIdx: number,
  pitch: number
): Point[] {
  const signY = dy >= 0 ? 1 : -1;
  const diagLen = Math.abs(dy);
  const offset = laneIdx * pitch;
  const yStart = y0 + offset;
  const yEnd = y0 + dy + offset;

  // Miter offset along X so perpendicular distance across the 45° diagonal stays `pitch`
  const xTurn1 = turnX - signY * offset * TAN_22_5;
  const xTurn2 = turnX + diagLen - signY * offset * TAN_22_5;

  const pts: Point[] = [{ x: x0, y: yStart }];
  if (xTurn1 > x0 + 6) {
    pts.push({ x: xTurn1, y: yStart });
  }
  if (xTurn2 > xTurn1 + 2 && xTurn2 < x1 - 4) {
    pts.push({ x: xTurn2, y: yEnd });
  }
  pts.push({ x: x1, y: yEnd });
  return pts;
}

function makeBusLaneVDV(
  y0: number,
  y1: number,
  x0: number,
  dx: number,
  turnY: number,
  laneIdx: number,
  pitch: number
): Point[] {
  const signX = dx >= 0 ? 1 : -1;
  const diagLen = Math.abs(dx);
  const offset = laneIdx * pitch;
  const xStart = x0 + offset;
  const xEnd = x0 + dx + offset;

  const yTurn1 = turnY - signX * offset * TAN_22_5;
  const yTurn2 = turnY + diagLen - signX * offset * TAN_22_5;

  const pts: Point[] = [{ x: xStart, y: y0 }];
  if (yTurn1 > y0 + 6) {
    pts.push({ x: xStart, y: yTurn1 });
  }
  if (yTurn2 > yTurn1 + 2 && yTurn2 < y1 - 4) {
    pts.push({ x: xEnd, y: yTurn2 });
  }
  pts.push({ x: xEnd, y: y1 });
  return pts;
}

export function generatePcbLayout(width: number, height: number, isMobile: boolean): PcbLayout {
  const rng = new SeededRng(20260714);
  const traces: TracePath[] = [];
  const vias: ViaNode[] = [];
  const pads: PadNode[] = [];
  const footprints: FootprintRect[] = [];
  const netLabels: NetLabelAnchor[] = [];

  const padMargin = isMobile ? 16 : 28;
  const pitch = isMobile ? 8 : 10;

  // Helper to place a via and optional net label
  const addVia = (x: number, y: number, r = 3.2) => {
    vias.push({ x, y, outerR: r, innerR: Math.max(1.2, r * 0.42) });
  };

  const addPad = (x: number, y: number, kind: 'circle' | 'square' = 'circle', size = 4.6) => {
    pads.push({ x, y, kind, size });
  };

  // 1. Hero QFP Pin Fan-out Buses (connects the top hero area to the board edges)
  if (!isMobile) {
    const heroBusCount = 6;
    const heroBaseY = Math.min(240, height * 0.22);
    for (let i = 0; i < heroBusCount; i++) {
      const net = NET_NAMES[i % NET_NAMES.length];
      const yA = heroBaseY + i * pitch;
      const diag = 88;
      const xTurn1 = width * 0.27 + i * pitch * TAN_22_5;
      const xTurn2 = xTurn1 - diag;
      const cleanPts = [
        { x: width * 0.37, y: yA },
        { x: xTurn1, y: yA },
        { x: xTurn2, y: yA + diag },
        { x: padMargin + 28, y: yA + diag },
      ];
      traces.push(computeTraceMetrics(cleanPts, 1.3, net, true));
      addVia(padMargin + 28, yA + diag, 3.2);
      if (i === 0 || i === 3) {
        netLabels.push({ x: Math.max(padMargin + 40, xTurn2 - 36), y: yA + diag - 8, net });
      }
    }

    // Right side Hero QFP fan-out bus
    const rightStartX = width * 0.63;
    for (let i = 0; i < 6; i++) {
      const net = NET_NAMES[(i + 2) % NET_NAMES.length];
      const pts = makeBusLaneHDH(
        rightStartX,
        width - padMargin - 20,
        heroBaseY - 36,
        96,
        width * 0.74,
        i,
        pitch
      );
      traces.push(computeTraceMetrics(pts, 1.3, net, true));
      const last = pts[pts.length - 1];
      addPad(last.x, last.y, i === 0 ? 'square' : 'circle', 4.8);
      if (i === 1 || i === 4) {
        netLabels.push({ x: width * 0.82, y: last.y - 8, net });
      }
    }
  }

  // 2. Parallel Vertical Trunk Buses along Left and Right Margins (keeping center clean for text)
  const sideBusGroups = isMobile ? 2 : 4;
  for (let g = 0; g < sideBusGroups; g++) {
    const isLeft = g % 2 === 0;
    const laneCount = isMobile ? rng.int(4, 5) : rng.int(5, 8);
    const xBase = isLeft
      ? rng.range(width * 0.08, width * 0.16)
      : rng.range(width * 0.78, width * 0.88);
    const yStart = rng.range(height * 0.04, height * 0.18) + Math.floor(g / 2) * (height * 0.34);
    const yEnd = Math.min(height - 30, yStart + rng.range(height * 0.28, height * 0.42));
    const dx = isLeft ? rng.range(40, 74) : -rng.range(40, 74);
    const turnY = yStart + (yEnd - yStart) * rng.range(0.32, 0.68);

    for (let i = 0; i < laneCount; i++) {
      const pts = makeBusLaneVDV(yStart, yEnd, xBase, dx, turnY, i, pitch);
      const net = NET_NAMES[(g * 3 + i) % NET_NAMES.length];
      traces.push(computeTraceMetrics(pts, 1.2, net));

      if (i === 0 || i === laneCount - 1 || rng.next() > 0.65) {
        const first = pts[0];
        const last = pts[pts.length - 1];
        addVia(first.x, first.y, 3.1);
        addPad(last.x, last.y, i === 0 ? 'square' : 'circle', 4.2);
      }

      // Occasional crisp 45-degree branch stub off outer lane
      if (!isMobile && i === laneCount - 1 && rng.next() > 0.35) {
        const branchY = turnY + 60;
        const dir = isLeft ? 1 : -1;
        const bx0 = xBase + dx + i * pitch;
        const bx1 = bx0 + dir * 28;
        const by1 = branchY + 28;
        const bx2 = bx1 + dir * rng.range(24, 56);
        const branchPts = [
          { x: bx0, y: branchY },
          { x: bx1, y: by1 },
          { x: bx2, y: by1 },
        ];
        traces.push(computeTraceMetrics(branchPts, 1.0, 'SDA'));
        addVia(bx0, branchY, 2.8);
        addPad(bx2, by1, 'circle', 4.2);
        netLabels.push({ x: (bx1 + bx2) / 2, y: by1 - 8, net: rng.pick(NET_NAMES) });
      }
    }

    if (ptsCenterValid(xBase, yStart)) {
      netLabels.push({
        x: xBase + 8,
        y: yStart + 20,
        net: NET_NAMES[g % NET_NAMES.length],
      });
    }
  }

  function ptsCenterValid(x: number, y: number): boolean {
    return x > 20 && x < width - 40 && y > 20 && y < height - 30;
  }

  // 3. Horizontal Cross-Board Feeder Buses (kept sparse and subtle behind bands)
  const hBusGroups = isMobile ? 2 : 4;
  for (let g = 0; g < hBusGroups; g++) {
    const laneCount = isMobile ? 4 : rng.int(4, 6);
    const y0 = rng.range(height * 0.16, height * 0.84);
    const fromLeft = g % 2 === 0;
    const xStart = fromLeft ? padMargin : width * rng.range(0.56, 0.7);
    const xEnd = fromLeft ? width * rng.range(0.28, 0.44) : width - padMargin;
    const dy = rng.pick([-1, 1]) * rng.range(28, 64);
    const turnX = xStart + (xEnd - xStart) * rng.range(0.35, 0.62);

    for (let i = 0; i < laneCount; i++) {
      const pts = makeBusLaneHDH(xStart, xEnd, y0, dy, turnX, i, pitch);
      const net = NET_NAMES[(g * 2 + i) % NET_NAMES.length];
      traces.push(computeTraceMetrics(pts, 1.1, net));
      const endPt = pts[pts.length - 1];
      if (i % 2 === 0) {
        addVia(endPt.x, endPt.y, 2.9);
      } else {
        addPad(endPt.x, endPt.y, 'circle', 4);
      }
    }
    netLabels.push({
      x: (xStart + xEnd) / 2,
      y: y0 - 8,
      net: NET_NAMES[(g + 4) % NET_NAMES.length],
    });
  }

  // 4. Tiny Background IC Footprints in Peripheral Board Space
  const icCandidates: FootprintRect[] = isMobile
    ? [
        { x: width - 84, y: height * 0.22, w: 46, h: 64, pinsTop: 0, pinsSide: 5, label: 'U9' },
        { x: 24, y: height * 0.68, w: 54, h: 40, pinsTop: 4, pinsSide: 0, label: 'IC2' },
      ]
    : [
        { x: width * 0.06, y: height * 0.44, w: 62, h: 86, pinsTop: 0, pinsSide: 7, label: 'U12' },
        { x: width * 0.87, y: height * 0.28, w: 72, h: 72, pinsTop: 5, pinsSide: 5, label: 'U14' },
        { x: width * 0.86, y: height * 0.72, w: 64, h: 48, pinsTop: 5, pinsSide: 0, label: 'J4' },
        { x: width * 0.08, y: height * 0.79, w: 56, h: 56, pinsTop: 4, pinsSide: 4, label: 'U19' },
      ];

  for (const fp of icCandidates) {
    footprints.push(fp);
    // Route small 45-degree stub traces from a couple of pins on each footprint
    if (fp.pinsSide > 0) {
      const step = fp.h / (fp.pinsSide + 1);
      for (let p = 0; p < Math.min(3, fp.pinsSide); p++) {
        const py = fp.y + step * (p + 1);
        const dir = fp.x < width * 0.5 ? 1 : -1;
        const sx = dir > 0 ? fp.x + fp.w : fp.x;
        const ex = sx + dir * (28 + p * 12);
        const ey = py + (p % 2 === 0 ? 18 : -18);
        const stub = [
          { x: sx, y: py },
          { x: sx + dir * 16, y: py },
          { x: sx + dir * 34, y: ey },
          { x: ex + dir * 24, y: ey },
        ];
        traces.push(computeTraceMetrics(stub, 1.0, NET_NAMES[(p + 1) % NET_NAMES.length]));
        addVia(ex + dir * 24, ey, 2.8);
      }
    }
  }

  return {
    width,
    height,
    traces,
    vias,
    pads,
    footprints,
    netLabels,
  };
}
