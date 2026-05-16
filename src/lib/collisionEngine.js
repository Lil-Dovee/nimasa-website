import { checkCollision, getOtherVessels } from "./api";
import { haversineNm } from "./utils";

const NEARBY_RADIUS_NM = 6;

export async function findNearbyVessels(ownVessel, bbox) {
  const all = await getOtherVessels(bbox);
  return (all || [])
    .filter((v) => v.mmsi !== ownVessel.mmsi)
    .map((v) => ({
      ...v,
      distance_nm: haversineNm(ownVessel.lat, ownVessel.lon, v.lat, v.lon),
    }))
    .filter((v) => v.distance_nm <= NEARBY_RADIUS_NM)
    .sort((a, b) => a.distance_nm - b.distance_nm);
}

export async function runCollisionCheck(ownVessel, bbox) {
  const nearby = await findNearbyVessels(ownVessel, bbox);

  if (nearby.length === 0) {
    return {
      threat_detected: false,
      cri: 0,
      nearby_count: 0,
      raw: null,
    };
  }

  const payload = {
    mmsi: ownVessel.mmsi,
    lat: ownVessel.lat,
    lon: ownVessel.lon,
    heading: Math.round(ownVessel.heading ?? 0),
    speed: ownVessel.speed ?? 0,
  };

  const targets = nearby.slice(0, 10).map((v) => ({
    mmsi: v.mmsi,
    lat: v.lat,
    lon: v.lon,
    heading: Math.round(v.heading ?? 0),
    speed: v.speed ?? 0,
  }));

  const result = await checkCollision(payload, targets);

  let threatVessel = null;
  if (result.primary_threat_mmsi) {
    threatVessel = nearby.find((v) => v.mmsi === result.primary_threat_mmsi) || null;
  }

  return {
    ...result,
    nearby_count: nearby.length,
    threat_vessel: threatVessel,
    raw: result,
  };
}