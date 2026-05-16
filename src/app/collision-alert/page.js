"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TopNav from "@/components/TopNav";
import AuthGuard from "@/components/AuthGuard";
import VesselMap from "@/components/VesselMapDynamic";
import CriGauge from "@/components/CriGauge";
import { getMyVessels, getOtherVessels } from "@/lib/api";
import { runCollisionCheck } from "@/lib/collisionEngine";
import { NIGERIAN_WATERS_BBOX } from "@/lib/constants";
import { criLevel, formatLatitude, formatLongitude } from "@/lib/utils";

function CollisionAlertContent() {
  const router = useRouter();
  const [ownVessel, setOwnVessel] = useState(null);
  const [result, setResult] = useState(null);
  const [allVessels, setAllVessels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noFleet, setNoFleet] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timer = null;

    async function tick() {
      try {
        const fleet = await getMyVessels();
        if (cancelled) return;

        if (!fleet || fleet.length === 0) {
          setNoFleet(true);
          setLoading(false);
          return;
        }

        const own = fleet[0];
        setOwnVessel(own);

        const [collision, others] = await Promise.all([
          runCollisionCheck(own, NIGERIAN_WATERS_BBOX).catch(() => null),
          getOtherVessels(NIGERIAN_WATERS_BBOX).catch(() => []),
        ]);

        if (cancelled) return;
        setResult(collision);
        setAllVessels([own, ...(others || []).filter((v) => v.mmsi !== own.mmsi)]);
        setLoading(false);
      } catch (err) {
        if (!cancelled) {
          setLoading(false);
        }
      }

      if (!cancelled) {
        timer = setTimeout(tick, 5000);
      }
    }

    tick();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col h-screen">
        <TopNav showVtsActive={true} />
        <div className="flex-1 flex items-center justify-center text-sm text-[var(--color-text-muted)]">
          Loading collision data...
        </div>
      </div>
    );
  }

  if (noFleet || !result || !result.threat_detected) {
    return (
      <div className="flex flex-col h-screen">
        <TopNav showVtsActive={true} />
        <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center px-6">
          <svg width="200" height="140" viewBox="0 0 200 140" fill="none" stroke="var(--color-text-muted)" strokeWidth="1" opacity="0.4">
            <path d="M20 90 L180 90 L165 110 L35 110 Z" />
            <rect x="55" y="60" width="90" height="30" />
            <rect x="80" y="35" width="40" height="25" />
            <line x1="100" y1="35" x2="100" y2="15" />
            <line x1="115" y1="35" x2="115" y2="15" />
            <line x1="85" y1="35" x2="85" y2="15" />
          </svg>
          <div className="text-2xl font-bold text-[var(--color-text-primary)]">
            No active collision threats
          </div>
          <div className="text-sm text-[var(--color-text-secondary)] max-w-md">
            All vessels in your fleet are currently operating within safe parameters.
          </div>
        </div>
      </div>
    );
  }

  const level = criLevel(result.cri);
  const threat = result.threat_vessel;

  return (
    <div className="flex flex-col h-screen">
      <TopNav showVtsActive={true} />

      <main className="flex-1 px-8 py-6 overflow-y-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={level.color} strokeWidth="2">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
              </svg>
              <span className="text-xs font-bold tracking-wider" style={{ color: level.color }}>
                CRITICAL OPERATIONAL ALERT
              </span>
            </div>
            <h1 className="text-4xl font-bold text-[var(--color-text-primary)] tracking-tight">
              COLLISION ALERT CENTER
            </h1>
          </div>
          <div
            className="px-6 py-4 rounded-md border-2 text-center"
            style={{
              borderColor: level.color,
              background: "rgba(0, 0, 0, 0.3)",
            }}
          >
            <div className="text-[10px] font-semibold tracking-wider text-[var(--color-text-muted)] mb-1">
              RISK LEVEL
            </div>
            <div className="text-2xl font-bold" style={{ color: level.color }}>
              {level.label === "CRITICAL" ? "THREAT" : level.label}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-5 space-y-4">
            <div
              className="rounded-md p-5 border-l-4"
              style={{
                borderColor: level.color,
                background: "var(--color-bg-secondary)",
              }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-[10px] font-semibold tracking-wider text-[var(--color-text-muted)] mb-1">
                    OWN SHIP
                  </div>
                  <div className="text-xl font-bold text-[var(--color-text-primary)]">
                    {ownVessel.name || `MMSI ${ownVessel.mmsi}`}
                  </div>
                  <div className="text-xs font-mono text-[var(--color-text-muted)] mt-1">
                    MMSI: {ownVessel.mmsi}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-semibold tracking-wider text-[var(--color-status-danger)] mb-1">
                    COLLISION RISK
                  </div>
                  <CriGauge cri={result.cri} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-[var(--color-bg-tertiary)] rounded-md px-3 py-2.5">
                  <div className="text-[10px] tracking-wider text-[var(--color-text-muted)]">TCPA</div>
                  <div className="text-lg font-bold" style={{ color: level.color }}>
                    {result.primary_tcpa_min != null ? `${result.primary_tcpa_min.toFixed(1)}` : "—"}
                    <span className="text-xs text-[var(--color-text-muted)] ml-1">MIN</span>
                  </div>
                </div>
                <div className="bg-[var(--color-bg-tertiary)] rounded-md px-3 py-2.5">
                  <div className="text-[10px] tracking-wider text-[var(--color-text-muted)]">DCPA</div>
                  <div className="text-lg font-bold" style={{ color: level.color }}>
                    {result.primary_dcpa_nm != null ? `${result.primary_dcpa_nm.toFixed(2)}` : "—"}
                    <span className="text-xs text-[var(--color-text-muted)] ml-1">NM</span>
                  </div>
                </div>
                <div className="bg-[var(--color-bg-tertiary)] rounded-md px-3 py-2.5">
                  <div className="text-[10px] tracking-wider text-[var(--color-text-muted)]">LATITUDE</div>
                  <div className="text-sm font-mono text-[var(--color-text-primary)]">
                    {formatLatitude(ownVessel.lat)}
                  </div>
                </div>
                <div className="bg-[var(--color-bg-tertiary)] rounded-md px-3 py-2.5">
                  <div className="text-[10px] tracking-wider text-[var(--color-text-muted)]">LONGITUDE</div>
                  <div className="text-sm font-mono text-[var(--color-text-primary)]">
                    {formatLongitude(ownVessel.lon)}
                  </div>
                </div>
              </div>

              <div className="bg-[var(--color-text-primary)]/5 rounded-md p-3 mb-3 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-semibold tracking-wider text-[var(--color-text-muted)]">
                    PPO RECOMMENDED ACTION
                  </div>
                  <div className="text-base font-bold text-[var(--color-text-primary)] uppercase">
                    {result.recommendation_direction === "steady"
                      ? "Maintain course"
                      : `Turn ${result.recommendation_direction} ${result.recommendation_degrees != null ? `${Math.abs(result.recommendation_degrees).toFixed(0)}°` : ""}`}
                  </div>
                </div>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-cyan)" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                </svg>
              </div>

              <div className="bg-[var(--color-bg-tertiary)] border border-dashed border-[var(--color-status-warning)]/40 rounded-md p-3">
                <div className="text-[10px] font-bold tracking-wider text-[var(--color-status-warning)] mb-1">
                  ENCOUNTER: GIVE WAY VESSEL
                </div>
                <div className="text-xs text-[var(--color-text-secondary)] italic">
                  "Rule 15 + Rule 16: You must give way — take early and substantial action to keep well clear by passing astern of target."
                </div>
              </div>
            </div>

            {threat && (
              <div className="rounded-md p-5 border-l-4 border-[var(--color-status-warning)] bg-[var(--color-bg-secondary)]">
                <div className="text-[10px] font-semibold tracking-wider text-[var(--color-text-muted)] mb-1">
                  TARGET VESSEL
                </div>
                <div className="text-xl font-bold text-[var(--color-text-primary)]">
                  {threat.name || `MMSI ${threat.mmsi}`}
                </div>
                <div className="text-xs font-mono text-[var(--color-text-muted)] mt-1 mb-4">
                  MMSI: {threat.mmsi}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[var(--color-bg-tertiary)] rounded-md px-3 py-2.5">
                    <div className="text-[10px] tracking-wider text-[var(--color-text-muted)]">LATITUDE</div>
                    <div className="text-sm font-mono text-[var(--color-text-primary)]">
                      {formatLatitude(threat.lat)}
                    </div>
                  </div>
                  <div className="bg-[var(--color-bg-tertiary)] rounded-md px-3 py-2.5">
                    <div className="text-[10px] tracking-wider text-[var(--color-text-muted)]">LONGITUDE</div>
                    <div className="text-sm font-mono text-[var(--color-text-primary)]">
                      {formatLongitude(threat.lon)}
                    </div>
                  </div>
                  <div className="bg-[var(--color-bg-tertiary)] rounded-md px-3 py-2.5">
                    <div className="text-[10px] tracking-wider text-[var(--color-text-muted)]">SOG</div>
                    <div className="text-sm font-mono text-[var(--color-text-primary)]">
                      {threat.speed != null ? `${threat.speed.toFixed(1)} knots` : "—"}
                    </div>
                  </div>
                  <div className="bg-[var(--color-bg-tertiary)] rounded-md px-3 py-2.5">
                    <div className="text-[10px] tracking-wider text-[var(--color-text-muted)]">COG</div>
                    <div className="text-sm font-mono text-[var(--color-text-primary)]">
                      {threat.heading != null ? `${threat.heading.toFixed(0)}°` : "—"}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="col-span-7 bg-[var(--color-bg-secondary)] rounded-md border border-[var(--color-border-subtle)] overflow-hidden">
            <div className="px-5 py-3 border-b border-[var(--color-border-subtle)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-cyan)" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <span className="text-xs font-semibold tracking-wider text-[var(--color-text-primary)]">
                  LIVE TACTICAL MAP | RELATIVE MOTION
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <span className="px-2 py-1 bg-[var(--color-bg-tertiary)] rounded text-[var(--color-text-secondary)]">
                  SCALE: 6NM
                </span>
                <span className="px-2 py-1 bg-[var(--color-bg-tertiary)] rounded text-[var(--color-text-secondary)]">
                  HDG: {ownVessel.heading != null ? `${ownVessel.heading.toFixed(0)}°` : "—"}
                </span>
              </div>
            </div>
            <div style={{ height: "560px" }}>
              <VesselMap
                vessels={allVessels}
                ownVesselMmsi={ownVessel.mmsi}
                threatMmsi={threat?.mmsi}
                center={[ownVessel.lat, ownVessel.lon]}
                zoom={12}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CollisionAlertPage() {
  return (
    <AuthGuard>
      <CollisionAlertContent />
    </AuthGuard>
  );
}