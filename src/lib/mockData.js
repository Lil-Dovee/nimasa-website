export function getSensitiveLogistics(mmsi) {
  return {
    cargo_type: "Liquified Petroleum Gas",
    eta: "2026-06-15T14:30:00Z",
    destination: "Lagos Offshore Terminal",
    security_level: "ISPS Level 1",
    crew_complement: 24,
    verified_owner: true,
  };
}

export function getVesselProfile(mmsi) {
  return {
    vessel_class: "LPG Tanker",
    length_m: 185,
    beam_m: 32,
    imo: "9410123",
  };
}