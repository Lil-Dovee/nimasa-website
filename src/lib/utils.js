export function haversineNm(lat1, lon1, lat2, lon2) {
  const R = 3440.065;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export function formatLatitude(lat) {
  if (lat == null) return "—";
  const dir = lat >= 0 ? "N" : "S";
  const abs = Math.abs(lat);
  const deg = Math.floor(abs);
  const minFloat = (abs - deg) * 60;
  const min = Math.floor(minFloat);
  const sec = ((minFloat - min) * 60).toFixed(1);
  return `${deg}° ${min}' ${sec}" ${dir}`;
}

export function formatLongitude(lon) {
  if (lon == null) return "—";
  const dir = lon >= 0 ? "E" : "W";
  const abs = Math.abs(lon);
  const deg = Math.floor(abs);
  const minFloat = (abs - deg) * 60;
  const min = Math.floor(minFloat);
  const sec = ((minFloat - min) * 60).toFixed(1);
  return `${deg}° ${min}' ${sec}" ${dir}`;
}

export function timeAgo(isoString) {
  if (!isoString) return "—";
  const then = new Date(isoString).getTime();
  const now = Date.now();
  const seconds = Math.floor((now - then) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ${minutes % 60}m ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function trafficDensityLabel(count) {
  if (count == null) return { label: "—", level: 0 };
  if (count < 50) return { label: "LOW", level: 1 };
  if (count < 200) return { label: "MODERATE", level: 2 };
  if (count < 500) return { label: "BUSY", level: 3 };
  return { label: "HIGH", level: 4 };
}
export function timeAgoSeconds(isoString) {
  if (!isoString) return null;
  return (Date.now() - new Date(isoString).getTime()) / 1000;
}
export function criLevel(cri) {
  if (cri == null || cri < 0.33) return { label: "SAFE", color: "var(--color-status-success)", level: 0 };
  if (cri < 0.5) return { label: "CAUTION", color: "var(--color-status-warning)", level: 1 };
  if (cri < 0.7) return { label: "WARNING", color: "var(--color-status-warning)", level: 2 };
  return { label: "CRITICAL", color: "var(--color-status-critical)", level: 3 };
}

export function encounterTypeFromHeadings(ownHeading, targetHeading, bearingToTarget) {
  if (ownHeading == null || targetHeading == null) return "UNKNOWN";
  const relative = ((targetHeading - ownHeading + 360) % 360);
  const bearingRelative = bearingToTarget != null
    ? ((bearingToTarget - ownHeading + 360) % 360)
    : null;

  if (relative > 165 && relative < 195) return "HEAD-ON";
  if (bearingRelative != null && (bearingRelative < 22.5 || bearingRelative > 337.5)) {
    if (Math.abs(relative) < 30 || Math.abs(relative - 360) < 30) return "OVERTAKING";
  }
  return "CROSSING";
}

export function colregsRuleText(encounterType) {
  switch (encounterType) {
    case "HEAD-ON":
      return "Rule 14: Head-on situation. Both vessels alter course to starboard.";
    case "CROSSING":
      return "Rules 15 & 16: Crossing situation. Give-way vessel turns starboard to pass astern.";
    case "OVERTAKING":
      return "Rule 13: Overtaking. Keep clear of vessel being overtaken.";
    default:
      return "Maintain safe distance and proceed with caution.";
  }
}