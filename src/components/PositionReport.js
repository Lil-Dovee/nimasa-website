import { formatLatitude, formatLongitude, timeAgo } from "@/lib/utils";

export default function PositionReport({ vessel }) {
  return (
    <div className="px-6 py-4">
      <div className="flex items-center gap-2 mb-3">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-cyan)" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <div className="text-xs font-semibold tracking-wider text-[var(--color-text-primary)]">
          POSITION REPORT
        </div>
      </div>

      <div className="bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] rounded-md p-4 font-mono text-xs space-y-2">
        <div className="flex justify-between">
          <span className="text-[var(--color-text-muted)]">Latitude</span>
          <span className="text-[var(--color-text-primary)]">{formatLatitude(vessel.lat)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--color-text-muted)]">Longitude</span>
          <span className="text-[var(--color-text-primary)]">{formatLongitude(vessel.lon)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--color-text-muted)]">Heading</span>
          <span className="text-[var(--color-text-primary)]">
            {vessel.heading != null ? `${vessel.heading.toFixed(1)}° (True)` : "—"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--color-text-muted)]">Last Update</span>
          <span className="text-[var(--color-status-success)]">{timeAgo(vessel.last_update)}</span>
        </div>
      </div>
    </div>
  );
}