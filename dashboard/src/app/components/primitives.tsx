import { ReactNode } from "react";

export function Card({
  children,
  className = "",
  elevated = false,
}: {
  children: ReactNode;
  className?: string;
  elevated?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-border ${
        elevated ? "bg-card-elevated" : "bg-card"
      } shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset,0_20px_40px_-24px_rgba(0,0,0,0.6)] ${className}`}
    >
      {children}
    </div>
  );
}

/* ============================================================
   LED-DOT NUMERALS — v11 signature type for hero metrics
   ============================================================ */
export const DOT_GLYPHS: Record<string, string[]> = {
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  "1": ["010", "110", "010", "010", "010", "010", "111"],
  "2": ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  "3": ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
  "4": ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  "5": ["11111", "10000", "10000", "11110", "00001", "00001", "11110"],
  "6": ["01110", "10000", "10000", "11110", "10001", "10001", "01110"],
  "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  "9": ["01110", "10001", "10001", "01111", "00001", "00001", "01110"],
  ".": ["0", "0", "0", "0", "0", "0", "1"],
  "%": ["11001", "11010", "00100", "01000", "01011", "10011", "00000"],
};

export function DotNumber({
  value,
  unit,
  color,
  className = "",
}: {
  value: string;
  unit?: string;
  color?: string;
  className?: string;
}) {
  const pitchX = 5;
  const pitchY = 4;
  const gap = 1;
  const r = 1.7;
  const circles: { cx: number; cy: number }[] = [];
  let x = 0;
  for (const ch of value) {
    const g = DOT_GLYPHS[ch];
    if (!g) {
      x += (2 + gap) * pitchX;
      continue;
    }
    const cols = g[0].length;
    g.forEach((row, ri) =>
      [...row].forEach((bit, ci) => {
        if (bit === "1") circles.push({ cx: x + ci * pitchX + 1.55, cy: ri * pitchY + 1.55 });
      })
    );
    x += (cols + gap) * pitchX;
  }
  const width = Math.max(x - gap * pitchX, 1);
  return (
    <span className={`inline-flex items-end gap-2 ${className}`} style={{ color: color ?? "var(--foreground)" }}>
      <svg
        viewBox={`0 0 ${width} 28`}
        fill="currentColor"
        className="block h-[1em] w-auto overflow-visible"
        preserveAspectRatio="xMidYMid meet"
        aria-label={value}
      >
        {circles.map((c, i) => (
          <circle key={i} cx={c.cx} cy={c.cy} r={r} />
        ))}
      </svg>
      {unit && <span className="text-[0.44em] font-medium leading-none translate-y-[-0.12em]">{unit}</span>}
    </span>
  );
}

export function SectionHeading({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-5">
      <div>
        <h2 className="tracking-tight">{title}</h2>
        {subtitle && (
          <p className="text-[0.8125rem] text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
      {right}
    </div>
  );
}

// Lightweight inline SVG sparkline
export function Sparkline({
  data,
  color,
  width = 120,
  height = 36,
}: {
  data: number[];
  color: string;
  width?: number;
  height?: number;
}) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 3;
  const step = (width - pad * 2) / (data.length - 1);
  const pts = data.map((v, i) => {
    const x = pad + i * step;
    const y = pad + (height - pad * 2) * (1 - (v - min) / range);
    return [x, y];
  });
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)},${height} L${pts[0][0].toFixed(1)},${height} Z`;
  const gid = `sg-${color.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.28} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path d={line} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={2.6} fill={color} />
    </svg>
  );
}

export function Pill({
  children,
  tone = "muted",
}: {
  children: ReactNode;
  tone?: "success" | "danger" | "warning" | "purple" | "muted";
}) {
  const tones: Record<string, string> = {
    success: "bg-success/12 text-success",
    danger: "bg-danger/12 text-danger",
    warning: "bg-warning/12 text-warning",
    purple: "bg-primary/15 text-primary",
    muted: "bg-white/[0.06] text-muted-foreground",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.6875rem] tracking-wide ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
