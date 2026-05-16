"use client";

import Link from "next/link";
import { NAV_STATUS } from "@/lib/constants";
import { formatLatitude, formatLongitude, timeAgo } from "@/lib/utils";
import SignalQualityBadge from "./SignalQualityBadge";

export default function VesselListRow({ vessel }) {
  const statusText = NAV_STATUS[vessel.nav_status] || "Unknown";
  const isUnknown = vessel.nav_status === 2 || vessel.nav_status == null;

  return (
    <div className="grid grid-cols-12 gap-4 items-center py-4 px-4 border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-bg-tertiary)]/50 transition-colors">
      <div className="col-span-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-md bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-cyan)" strokeWidth="2">
            <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
            <path d="M19 7H5l2-4h10l2 4z" />
            <path d="M12 7v14" />
          </svg>
        </div>
        <div>
          <div className="text-sm font-bold text-[var(--color-text-primary)]">
            {vessel.name || "UNNAMED VESSEL"}
          </div>
          <div className="text-xs text-[var(--color-text-muted)] font-mono">
            MMSI: {vessel.mmsi}
          </div>
        </div>
      </div>

      <div className="col-span-2">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{
              background: isUnknown
                ? "var(--color-status-danger)"
                : "var(--color-status-success)",
            }}
          />
          <span className="text-sm text-[var(--color-text-primary)]">{statusText}</span>
        </div>
        <div className="text-xs text-[var(--color-text-muted)] mt-1">
          Speed: {vessel.speed != null ? `${vessel.speed.toFixed(1)} kts` : "—"}
        </div>
      </div>

      <div className="col-span-3 text-xs font-mono text-[var(--color-text-secondary)]">
        <div>LAT: {formatLatitude(vessel.lat)}</div>
        <div>LON: {formatLongitude(vessel.lon)}</div>
      </div>

      <div className="col-span-2 text-xs font-mono text-[var(--color-text-secondary)]">
        <div>HEADING: {vessel.heading != null ? `${vessel.heading.toFixed(1)}°` : "—"}</div>
        <div className="text-[var(--color-text-muted)] mt-1">{timeAgo(vessel.last_update)}</div>
      </div>

      <div className="col-span-1">
        <SignalQualityBadge lastUpdate={vessel.last_update} />
      </div>

      <div className="col-span-1 flex justify-end gap-2">
        <Link
          href={`/my-vessels/${vessel.mmsi}`}
          className="p-2 rounded-md bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] hover:border-[var(--color-accent-cyan)] transition-colors"
          aria-label="View vessel"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}