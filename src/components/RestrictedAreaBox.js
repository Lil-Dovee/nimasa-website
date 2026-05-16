"use client";

export default function RestrictedAreaBox({ zoneResult }) {
  if (!zoneResult) return null;

  const inZone = zoneResult.in_restricted_zone;
  const distance = zoneResult.distance_to_zone_boundary_nm;
  const zoneName = zoneResult.zone_name || "Restricted Zone";
  const isApproaching = !inZone && distance != null && distance <= 5;
  const isCleared = !inZone && !isApproaching;

  if (isCleared && !zoneResult.show_cleared) return null;

  if (inZone) {
    return (
      <div className="px-6 py-4">
        <div className="flex items-center gap-2 mb-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-status-critical)" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div className="text-xs font-bold tracking-wider text-[var(--color-status-critical)]">
            RESTRICTED AREA ALERT
          </div>
        </div>

        <div className="rounded-md border border-[var(--color-status-critical)]/60 bg-[var(--color-status-critical)]/10 p-4">
          <div className="text-sm font-bold text-[var(--color-text-primary)] uppercase mb-2">
            RESTRICTED AREA ENTERED — {zoneName}
          </div>
          <div className="text-xs text-[var(--color-text-secondary)] mb-3">
            {zoneResult.alert_message || "Immediate action required. Your vessel has breached a restricted perimeter."}
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-status-critical)] animate-pulse" />
            <span className="text-[10px] font-bold tracking-wider text-[var(--color-status-critical)]">
              ACTIVE VIOLATION
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (isApproaching) {
    return (
      <div className="px-6 py-4">
        <div className="flex items-center gap-2 mb-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-status-warning)" strokeWidth="2">
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div className="text-xs font-bold tracking-wider text-[var(--color-status-warning)]">
            RESTRICTED AREA WARNING
          </div>
        </div>

        <div className="rounded-md border border-[var(--color-status-warning)]/60 bg-[var(--color-status-warning)]/10 p-4">
          <div className="text-sm text-[var(--color-text-primary)] mb-3">
            Approaching restricted area —{" "}
            <span className="text-[var(--color-status-warning)] font-semibold">{zoneName}</span>.
          </div>
          <div className="bg-[var(--color-bg-tertiary)] rounded-md p-3 mb-3 flex items-center justify-between">
            <div>
              <div className="text-sm font-mono text-[var(--color-text-primary)]">
                You are {distance.toFixed(1)}nm away.
              </div>
              <div className="text-xs text-[var(--color-status-warning)] mt-1">
                Alter Course
              </div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-status-warning)" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="6" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-status-warning)]" />
            Action required: Course adjustment advised.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-4">
      <div className="flex items-center gap-2 mb-3">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-status-success)" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <div className="text-xs font-bold tracking-wider text-[var(--color-status-success)]">
          RESTRICTED AREA STATUS
        </div>
      </div>

      <div className="rounded-md border border-[var(--color-status-success)]/40 bg-[var(--color-status-success)]/10 p-4 flex items-center gap-3">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-status-success)" strokeWidth="2">
          <path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
        </svg>
        <div>
          <div className="text-sm font-bold text-[var(--color-text-primary)]">ZONE CLEARED</div>
          <div className="text-xs text-[var(--color-text-secondary)]">
            {zoneResult.last_zone_name || "Restricted zone"} cleared.
          </div>
        </div>
      </div>
    </div>
  );
}