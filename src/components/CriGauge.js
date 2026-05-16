import { criLevel } from "@/lib/utils";

export default function CriGauge({ cri }) {
  const level = criLevel(cri);
  const pct = Math.min(100, Math.max(0, (cri ?? 0) * 100));

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-32 h-32">
        <svg width="128" height="128" viewBox="0 0 128 128">
          <circle
            cx="64"
            cy="64"
            r="56"
            fill="none"
            stroke="var(--color-bg-tertiary)"
            strokeWidth="10"
          />
          <circle
            cx="64"
            cy="64"
            r="56"
            fill="none"
            stroke={level.color}
            strokeWidth="10"
            strokeDasharray={`${(pct / 100) * 351.86} 351.86`}
            strokeDashoffset="0"
            strokeLinecap="round"
            transform="rotate(-90 64 64)"
            style={{ transition: "stroke-dasharray 400ms ease" }}
          />
          <line
            x1="64"
            y1="14"
            x2="64"
            y2="22"
            stroke="var(--color-text-muted)"
            strokeWidth="2"
            transform={`rotate(${(0.33 / 1) * 360} 64 64)`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold font-mono" style={{ color: level.color }}>
            {cri != null ? cri.toFixed(2) : "—"}
          </span>
          <span className="text-[10px] tracking-wider text-[var(--color-text-muted)]">
            CRI SCORE
          </span>
        </div>
      </div>
      <span
        className="text-xs font-bold tracking-widest"
        style={{ color: level.color }}
      >
        {level.label}
      </span>
    </div>
  );
}