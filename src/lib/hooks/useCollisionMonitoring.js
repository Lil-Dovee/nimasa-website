"use client";

import { useEffect, useRef, useState } from "react";
import { runCollisionCheck } from "../collisionEngine";
import { checkRestrictedZone } from "../api";
import { NIGERIAN_WATERS_BBOX } from "../constants";

const NORMAL_INTERVAL_MS = 10000;
const ALERT_INTERVAL_MS = 5000;

export function useCollisionMonitoring(ownVessel) {
  const [collisionResult, setCollisionResult] = useState(null);
  const [zoneResult, setZoneResult] = useState(null);
  const [lastClearedAt, setLastClearedAt] = useState(null);
  const [lastZoneName, setLastZoneName] = useState(null);
  const prevThreatRef = useRef(false);
  const prevInZoneRef = useRef(false);

  useEffect(() => {
    if (!ownVessel || ownVessel.lat == null || ownVessel.lon == null) return;

    let cancelled = false;
    let timer = null;

    async function tick() {
      try {
        const result = await runCollisionCheck(ownVessel, NIGERIAN_WATERS_BBOX);
        if (cancelled) return;
        setCollisionResult(result);

        if (prevThreatRef.current && !result.threat_detected) {
          setLastClearedAt(new Date().toISOString());
        }
        prevThreatRef.current = result.threat_detected;
      } catch (err) {
        if (!cancelled) console.warn("Collision check failed:", err.message);
      }

      try {
        const zone = await checkRestrictedZone(
          ownVessel.mmsi,
          ownVessel.lat,
          ownVessel.lon,
          ownVessel.vessel_type || null
        );
        if (cancelled) return;

        if (prevInZoneRef.current && !zone.in_restricted_zone) {
          setLastZoneName(zone.zone_name || lastZoneName);
        }
        prevInZoneRef.current = zone.in_restricted_zone;

        setZoneResult({
          ...zone,
          last_zone_name: zone.zone_name || lastZoneName,
        });
      } catch (err) {
        if (!cancelled) console.warn("Zone check failed:", err.message);
      }

      if (cancelled) return;
      const next = collisionResult?.threat_detected ? ALERT_INTERVAL_MS : NORMAL_INTERVAL_MS;
      timer = setTimeout(tick, next);
    }

    tick();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [ownVessel?.mmsi, ownVessel?.lat, ownVessel?.lon]);

  return {
    collisionResult,
    zoneResult,
    lastClearedAt,
    lastZoneName,
  };
}