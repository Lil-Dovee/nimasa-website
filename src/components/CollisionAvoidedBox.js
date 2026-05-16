export default function CollisionAvoidedBox({ clearedAt, threatName }) {
  return (
    <div className="px-6 py-4">
      <div className="flex items-center gap-2 mb-3">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-status-success)" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <path d="m9 11 3 3L22 4" />
        </svg>
        <div className="text-xs font-bold tracking-wider text-[var(--color-status-success)]">
          COLLISION AVOIDED — THREAT CLEARED
        </div>
      </div>

      <div className="rounded-md border-l-4 border-[var(--color-status-success)] bg-[var(--color-status-success)]/10 p-4">
        <div className="text-[10px] font-semibold tracking-wider text-[var(--color-text-muted)] mb-2">
          MITIGATION SUCCESSFUL
        </div>
        <div className="text-sm text-[var(--color-text-primary)] mb-3">
          Risk of collision with{" "}
          <span className="font-bold text-[var(--color-status-success)]">
            {threatName || "target vessel"}
          </span>{" "}
          has been successfully mitigated.
        </div>
        <div className="bg-[var(--color-bg-tertiary)] rounded-md p-3 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-semibold tracking-wider text-[var(--color-text-muted)] mb-1">
              STATUS CLEARED AT
            </div>
            <div className="text-sm font-mono text-[var(--color-text-primary)]">
              {clearedAt}
            </div>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-status-success)" strokeWidth="2">
            <path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
          </svg>
        </div>
      </div>
    </div>
  );
}