"use client";

import Link from "next/link";
import { criLevel } from "@/lib/utils";

export default function CollisionAlertBox({ collisionResult }) {
  if (!collisionResult) return null;
  if (!collisionResult.threat_detected) return null;

  const level = criLevel(collisionResult.cri);
  const threat = collisionResult.threat_vessel;
  const direction = collisionResult.recommendation_direction || "steady";
  const degrees = collisionResult.recommendation_degrees;

  return (
    <div className="px-6 py-4">
      <div className="flex items-center gap-2 mb-3">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={level.color} strokeWidth="2">
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <div className="text-xs font-bold tracking-wider" style={{ color: level.color }}>
          CRITICAL OPERATIONAL ALERT
        </div>
      </div>

      <div
        className="rounded-md border-l-4 p-4"
        style={{
          background: "rgba(220, 38, 38, 0.08)",
          borderColor: level.color,
        }}
      >
        <div className="text-[10px] font-semibold tracking-wider text-[var(--color-text-muted)] mb-2">
          COLLISION RISK ASSESSMENT
        </div>
        <div className="text-sm text-[var(--color-text-primary)] mb-4">
          You are at risk to collide with{" "}
          <span className="font-bold" style={{ color: level.color }}>
            {threat?.name || `MMSI ${threat?.mmsi || collisionResult.primary_threat_mmsi}`}
          </span>
        </div>

        <div
          className="rounded-md p-3 mb-3"
          style={{ background: "rgba(0, 0, 0, 0.3)" }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[10px] font-semibold tracking-wider text-[var(--color-text-muted)] mb-1">
                PPO RECOMMENDED ACTION
              </div>
              <div className="text-sm font-bold text-[var(--color-text-primary)] uppercase">
                {direction === "steady"
                  ? "Maintain course"
                  : `Turn ${direction} ${degrees != null ? `${Math.abs(degrees).toFixed(0)}°` : ""}`}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-semibold tracking-wider text-[var(--color-text-muted)] mb-1">
                URGENCY
              </div>
              <div className="text-sm font-bold" style={{ color: level.color }}>
                {collisionResult.primary_tcpa_min != null
                  ? `${collisionResult.primary_tcpa_min.toFixed(1)} min`
                  : "—"}
              </div>
              <div className="text-[9px] text-[var(--color-text-muted)]">TCPA</div>
            </div>
          </div>
        </div>

        <div className="text-xs italic text-[var(--color-text-secondary)] mb-3">
          Rationale: Crossing situation — target on starboard bow has right of way. Turn starboard to pass astern (COLREGs Rules 15 & 16).
        </div>

        <Link
          href="/collision-alert"
          className="inline-flex items-center gap-2 px-3 py-2 bg-[var(--color-text-primary)]/10 hover:bg-[var(--color-text-primary)]/20 border border-[var(--color-border-default)] rounded-md text-xs font-semibold tracking-wider text-[var(--color-text-primary)] transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 3h6v6M14 10l7-7M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
          </svg>
          VIEW FULL ALERT
        </Link>
      </div>
    </div>
  );
}