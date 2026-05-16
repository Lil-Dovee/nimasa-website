"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TopNav from "@/components/TopNav";
import VesselMap from "@/components/VesselMapDynamic";
import { getOtherVessels } from "@/lib/api";
import { NIGERIAN_WATERS_BBOX } from "@/lib/constants";
import { formatLatitude, formatLongitude } from "@/lib/utils";

export default function OtherVesselPage({ params }) {
  const { mmsi } = use(params);
  const router = useRouter();
  const [vessel, setVessel] = useState(null);
  const [allVessels, setAllVessels] = useState([]);
  const [activeCount, setActiveCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const others = await getOtherVessels(NIGERIAN_WATERS_BBOX);
        if (cancelled) return;

        const match = (others || []).find((v) => v.mmsi === mmsi);
        if (!match) {
          setError("Vessel not currently tracked");
          setLoading(false);
          return;
        }

        setVessel(match);
        setAllVessels(others || []);
        setActiveCount((others || []).length);
        setError(null);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    const interval = setInterval(load, 15000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [mmsi]);

  if (loading) {
    return (
      <div className="flex flex-col h-screen">
        <TopNav />
        <div className="flex-1 flex items-center justify-center text-sm text-[var(--color-text-muted)]">
          Loading vessel...
        </div>
      </div>
    );
  }

  if (error || !vessel) {
    return (
      <div className="flex flex-col h-screen">
        <TopNav />
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-sm">
          <div className="text-[var(--color-status-danger)]">{error || "Vessel not found"}</div>
          <button
            onClick={() => router.push("/map")}
            className="px-4 py-2 bg-[var(--color-accent-cyan)] text-[var(--color-bg-primary)] font-semibold rounded-md text-xs"
          >
            Back to map
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <TopNav />

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-[360px] bg-[var(--color-bg-secondary)] border-r border-[var(--color-border-subtle)] overflow-y-auto">
          <div className="px-6 pt-6 pb-4">
            <div className="inline-block px-2 py-1 rounded bg-[var(--color-accent-cyan)]/15 border border-[var(--color-accent-cyan)]/40 mb-4">
              <span className="text-[10px] font-bold tracking-wider text-[var(--color-accent-cyan)]">
                AIS ACTIVE
              </span>
            </div>

            <div className="flex items-start justify-between">
              <div className="text-2xl font-bold text-[var(--color-text-primary)] tracking-wide">
                {vessel.name || `VESSEL ${vessel.mmsi}`}
              </div>
              <button
                onClick={() => router.back()}
                aria-label="Close"
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="px-6 pb-4 grid grid-cols-2 gap-3">
            <div className="bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] rounded-md px-3 py-2.5">
              <div className="text-[10px] font-semibold tracking-wider text-[var(--color-text-muted)] mb-1">
                STATUS
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--color-status-success)]" />
                <span className="text-sm text-[var(--color-text-primary)]">Under Way</span>
              </div>
            </div>

            <div className="bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] rounded-md px-3 py-2.5">
              <div className="text-[10px] font-semibold tracking-wider text-[var(--color-text-muted)] mb-1">
                HEADING
              </div>
              <div className="text-sm text-[var(--color-text-primary)]">
                {vessel.heading != null ? `${vessel.heading.toFixed(0)}° TRUE` : "—"}
              </div>
            </div>

            <div className="bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] rounded-md px-3 py-2.5">
              <div className="text-[10px] font-semibold tracking-wider text-[var(--color-text-muted)] mb-1">
                SOG (SPEED)
              </div>
              <div className="text-lg font-bold text-[var(--color-accent-cyan)]">
                {vessel.speed != null ? `${vessel.speed.toFixed(1)}` : "—"}
                <span className="text-xs text-[var(--color-text-muted)] ml-1">KN</span>
              </div>
            </div>

            <div className="bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] rounded-md px-3 py-2.5">
              <div className="text-[10px] font-semibold tracking-wider text-[var(--color-text-muted)] mb-1">
                COG (COURSE)
              </div>
              <div className="text-sm text-[var(--color-text-primary)]">
                {vessel.heading != null ? `${vessel.heading.toFixed(1)}°` : "—"}
              </div>
            </div>
          </div>

          <div className="px-6 py-4">
            <div className="flex items-center gap-2 mb-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-cyan)" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div className="text-xs font-semibold tracking-wider text-[var(--color-text-primary)]">
                PRECISION COORDINATES
              </div>
            </div>
            <div className="bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] rounded-md p-4 font-mono text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">LATITUDE</span>
                <span className="text-[var(--color-text-primary)]">{formatLatitude(vessel.lat)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">LONGITUDE</span>
                <span className="text-[var(--color-text-primary)]">{formatLongitude(vessel.lon)}</span>
              </div>
            </div>
          </div>

          <div className="px-6 py-4">
            <div className="bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] rounded-md px-4 py-3">
              <div className="text-[10px] font-semibold tracking-wider text-[var(--color-text-muted)] mb-1">
                ACTIVE TRACKED VESSELS
              </div>
              <div className="text-2xl font-bold text-[var(--color-text-primary)] font-mono">
                {activeCount != null ? activeCount.toLocaleString() : "—"}
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 relative">
          <VesselMap
            vessels={allVessels}
            threatMmsi={null}
            center={[vessel.lat, vessel.lon]}
            zoom={11}
          />
        </main>
      </div>
    </div>
  );
}