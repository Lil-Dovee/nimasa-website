import { NAV_STATUS } from "@/lib/constants";
import SignalQualityBadge from "./SignalQualityBadge";

export default function VesselDetailHeader({ vessel, onClose }) {
  const statusText = NAV_STATUS[vessel.nav_status] || "Unknown";

  return (
    <div className="px-6 pt-6 pb-4 border-b border-[var(--color-border-subtle)]">
      <div className="flex items-start justify-between mb-4">
        <div className="text-xs font-semibold tracking-wider text-[var(--color-accent-cyan)]">
          VESSEL DETAIL ANALYSIS
        </div>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="text-2xl font-bold text-[var(--color-text-primary)] tracking-wide">
        {vessel.name || "UNNAMED VESSEL"}
      </div>
      <div className="text-xs font-mono text-[var(--color-text-muted)] mt-1">
        MMSI: {vessel.mmsi}
        {vessel.imo ? <>  |  IMO: {vessel.imo}</> : null}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-5">
        <div className="bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] rounded-md px-3 py-2.5">
          <div className="text-[10px] font-semibold tracking-wider text-[var(--color-text-muted)] mb-1">
            STATUS
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-status-success)]" />
            <span className="text-sm text-[var(--color-text-primary)]">{statusText}</span>
          </div>
        </div>

        <div className="bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] rounded-md px-3 py-2.5">
          <div className="text-[10px] font-semibold tracking-wider text-[var(--color-text-muted)] mb-1">
            SIGNAL QUALITY
          </div>
          <SignalQualityBadge lastUpdate={vessel.last_update} />
        </div>
      </div>
    </div>
  );
}