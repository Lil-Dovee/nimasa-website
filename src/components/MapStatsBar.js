"use client";

import { trafficDensityLabel } from "@/lib/utils";

export default function MapStatsBar({ activeCount, showVerifyCta = false }) {
  const density = trafficDensityLabel(activeCount);

  const barWidth = density.level === 0 ? 0 : (density.level / 4) * 100;
  const barColor =
    density.level <= 1
      ? "var(--color-status-success)"
      : density.level === 2
      ? "var(--color-accent-cyan)"
      : density.level === 3
      ? "var(--color-status-warning)"
      : "var(--color-status-danger)";

  return (
    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-4 pointer-events-none z-[400]">
      <div className="flex items-center gap-6 px-5 py-3 bg-[var(--color-bg-secondary)]/95 backdrop-blur-sm border border-[var(--color-border-default)] rounded-lg pointer-events-auto">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold tracking-wider text-[var(--color-text-muted)]">
            LIVE TRAFFIC DENSITY
          </span>
          <div className="flex items-center gap-2">
            <div className="w-20 h-1.5 rounded-full bg-[var(--color-bg-tertiary)] overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${barWidth}%`, background: barColor }}
              />
            </div>
            <span
              className="text-xs font-bold tracking-wider"
              style={{ color: barColor }}
            >
              {density.label}
            </span>
          </div>
        </div>

        <div className="w-px h-8 bg-[var(--color-border-default)]" />

        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold tracking-wider text-[var(--color-text-muted)]">
            ACTIVE TRACKED VESSELS
          </span>
          <span className="text-2xl font-bold text-[var(--color-text-primary)] font-mono">
            {activeCount != null ? activeCount.toLocaleString() : "—"}
          </span>
        </div>
      </div>

      {showVerifyCta && (
        
        <a  href="/verify"
          className="pointer-events-auto px-5 py-3 bg-[var(--color-accent-cyan)] hover:bg-[var(--color-accent-cyan-dim)] text-[var(--color-bg-primary)] font-semibold text-sm rounded-lg transition-colors flex items-center gap-2"
        >
          VERIFY MY VESSEL
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
          </svg>
        </a>
      )}
    </div>
  );
}