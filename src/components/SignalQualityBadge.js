import { timeAgoSeconds } from "@/lib/utils";

function computeSignal(lastUpdateIso) {
  if (!lastUpdateIso) return { label: "POOR", color: "var(--color-status-danger)" };
  const seconds = (Date.now() - new Date(lastUpdateIso).getTime()) / 1000;
  if (seconds < 120) return { label: "EXCELLENT", color: "var(--color-status-success)" };
  if (seconds < 600) return { label: "FAIR", color: "var(--color-status-warning)" };
  return { label: "POOR", color: "var(--color-status-danger)" };
}

export default function SignalQualityBadge({ lastUpdate }) {
  const signal = computeSignal(lastUpdate);
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider"
      style={{ color: signal.color }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 12h2M6 12h2M12 6v12M16 8v8M20 10v4" />
      </svg>
      {signal.label}
    </span>
  );
}