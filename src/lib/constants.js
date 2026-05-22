// API configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://maritime-vessel-tracking-platform-1.onrender.com";
export const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_BASE_URL || "wss://maritime-vessel-tracking-platform-1.onrender.com";

// CRI thresholds matching the backend specification
export const CRI_THRESHOLDS = {
  SAFE: 0.33,
  WARNING: 0.5,
  CRITICAL: 0.7,
};

// Default map view — centered on Lagos, Nigeria
export const DEFAULT_MAP_CENTER = [5.5, 4.5];
export const DEFAULT_MAP_ZOOM = 7;

// Bounding box for Nigerian waters (used in traffic API calls)
export const NIGERIAN_WATERS_BBOX = {
  min_lat: 3.0,
  min_lon: 2.5,
  max_lat: 7.0,
  max_lon: 9.0,
};

// AIS navigation status codes
export const NAV_STATUS = {
  0: "Under Way",
  1: "At Anchor",
  2: "Not Under Command",
  3: "Restricted Maneuverability",
  4: "Constrained by Draught",
  5: "Moored",
  6: "Aground",
  7: "Fishing",
  8: "Under Way Sailing",
  9: "Reserved (HSC)",
  10: "Reserved (WIG)",
  11: "Reserved",
  12: "Reserved",
  13: "Reserved",
  14: "AIS-SART",
  15: "Undefined",
};

// AIS vessel type ranges
export const VESSEL_TYPE_NAMES = {
  30: "Fishing",
  31: "Towing",
  32: "Towing Large",
  33: "Dredging",
  34: "Diving",
  35: "Military",
  36: "Sailing",
  37: "Pleasure Craft",
  40: "High Speed Craft",
  50: "Pilot Vessel",
  51: "Search and Rescue",
  52: "Tug",
  60: "Passenger",
  70: "Cargo",
  80: "Tanker",
};