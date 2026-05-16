"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TopNav from "@/components/TopNav";
import AuthGuard from "@/components/AuthGuard";
import VesselMap from "@/components/VesselMapDynamic";
import VesselDetailHeader from "@/components/VesselDetailHeader";
import PositionReport from "@/components/PositionReport";
import SensitiveLogistics from "@/components/SensitiveLogistics";
import CollisionAlertBox from "@/components/CollisionAlertBox";
import CollisionAvoidedBox from "@/components/CollisionAvoidedBox";
import RestrictedAreaBox from "@/components/RestrictedAreaBox";
import { getMyVessels, getOtherVessels } from "@/lib/api";
import { NIGERIAN_WATERS_BBOX } from "@/lib/constants";
import { useCollisionMonitoring } from "@/lib/hooks/useCollisionMonitoring";

function VesselDashboardContent({ mmsi }) {
  const router = useRouter();
  const [vessel, setVessel] = useState(null);
  const [allVessels, setAllVessels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { collisionResult, zoneResult, lastClearedAt } = useCollisionMonitoring(vessel);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [fleet, others] = await Promise.all([
          getMyVessels(),
          getOtherVessels(NIGERIAN_WATERS_BBOX).catch(() => []),
        ]);

        if (cancelled) return;

        const match = (fleet || []).find((v) => v.mmsi === mmsi);
        if (!match) {
          setError("Vessel not found in your fleet");
          setLoading(false);
          return;
        }

        setVessel(match);
        const otherVessels = (others || []).filter((v) => v.mmsi !== mmsi);
        setAllVessels([match, ...otherVessels]);
        setError(null);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    const interval = setInterval(load, 10000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [mmsi]);

  if (loading) {
    return (
      <div className="flex flex-col h-screen">
        <TopNav showVtsActive={true} />
        <div className="flex-1 flex items-center justify-center text-sm text-[var(--color-text-muted)]">
          Loading vessel...
        </div>
      </div>
    );
  }

  if (error || !vessel) {
    return (
      <div className="flex flex-col h-screen">
        <TopNav showVtsActive={true} />
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-sm">
          <div className="text-[var(--color-status-danger)]">{error || "Vessel not available"}</div>
          <button
            onClick={() => router.push("/my-vessels")}
            className="px-4 py-2 bg-[var(--color-accent-cyan)] text-[var(--color-bg-primary)] font-semibold rounded-md text-xs"
          >
            Back to fleet
          </button>
        </div>
      </div>
    );
  }

  const mapCenter = [vessel.lat, vessel.lon];
  const threatMmsi = collisionResult?.primary_threat_mmsi;
  const showAvoided =
    !collisionResult?.threat_detected && lastClearedAt &&
    (Date.now() - new Date(lastClearedAt).getTime()) < 30000;

  return (
    <div className="flex flex-col h-screen">
      <TopNav showVtsActive={true} />

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-[380px] bg-[var(--color-bg-secondary)] border-r border-[var(--color-border-subtle)] overflow-y-auto">
          <VesselDetailHeader vessel={vessel} onClose={() => router.push("/my-vessels")} />

          {collisionResult?.threat_detected && (
            <CollisionAlertBox collisionResult={collisionResult} />
          )}

          {showAvoided && (
            <CollisionAvoidedBox
              clearedAt={new Date(lastClearedAt).toISOString().replace("T", " ").substring(0, 19) + " UTC"}
              threatName={collisionResult?.threat_vessel?.name}
            />
          )}

          {zoneResult && (
            <RestrictedAreaBox zoneResult={zoneResult} />
          )}

          <PositionReport vessel={vessel} />
          <SensitiveLogistics mmsi={vessel.mmsi} />
        </aside>

        <main className="flex-1 relative">
          <VesselMap
            vessels={allVessels}
            ownVesselMmsi={vessel.mmsi}
            threatMmsi={threatMmsi}
            center={mapCenter}
            zoom={11}
          />
        </main>
      </div>
    </div>
  );
}

export default function VesselDashboardPage({ params }) {
  const { mmsi } = use(params);
  return (
    <AuthGuard>
      <VesselDashboardContent mmsi={mmsi} />
    </AuthGuard>
  );
}