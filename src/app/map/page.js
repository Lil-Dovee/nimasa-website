"use client";

import { useEffect, useState } from "react";
import TopNav from "@/components/TopNav";
import VesselMap from "@/components/VesselMapDynamic";
import MapStatsBar from "@/components/MapStatsBar";
import { getActiveVesselCount, getOtherVessels } from "@/lib/api";
import { NIGERIAN_WATERS_BBOX } from "@/lib/constants";
import { isLoggedIn } from "@/lib/auth";

export default function PublicMapPage() {
  const [activeCount, setActiveCount] = useState(null);
  const [vessels, setVessels] = useState([]);
  const [error, setError] = useState(null);
  const [authed, setAuthed] = useState(false);
  console.log("heree")
  useEffect(() => {
    setAuthed(isLoggedIn());
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [countRes, vesselsRes] = await Promise.all([
          getActiveVesselCount(),
          getOtherVessels(NIGERIAN_WATERS_BBOX),
        ]);
        console.log(countRes, vesselsRes, NIGERIAN_WATERS_BBOX)
        if (cancelled) return;
        setActiveCount(countRes.count);
        setVessels(vesselsRes || []);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        setError(err.message);
      }
    }

    load();
    const interval = setInterval(load, 30000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  function handleVesselClick(vessel) {
    if (authed) {
      window.location.href = `/vessel/${vessel.mmsi}`;
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <TopNav showVtsActive={authed} />
      <div className="relative flex-1 overflow-hidden">
        <VesselMap vessels={vessels} onVesselClick={handleVesselClick} />
        <MapStatsBar activeCount={activeCount} showVerifyCta={!authed} />
        {error && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-[var(--color-status-danger)]/20 border border-[var(--color-status-danger)] rounded-md text-[var(--color-status-danger)] text-xs font-mono z-[500]">
            Backend unavailable — showing empty map
          </div>
        )}
      </div>
    </div>
  );
}