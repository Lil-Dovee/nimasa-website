import { API_BASE_URL } from "./constants";

/**
 * Get the stored JWT token from localStorage.
 * Returns null if no token is stored.
 */
export function getAuthToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("nimasa_auth_token");
}

/**
 * Store JWT token after successful login.
 */
export function setAuthToken(token) {
  if (typeof window === "undefined") return;
  localStorage.setItem("nimasa_auth_token", token);
}

/**
 * Clear JWT token on logout.
 */
export function clearAuthToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("nimasa_auth_token");
}

/**
 * Generic API fetch wrapper.
 * Adds auth header if token exists and `auth: true` is passed.
 * Throws on non-2xx responses.
 */
export async function apiFetch(path, options = {}) {
  const { auth = false, headers = {}, ...rest } = options;

  const finalHeaders = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (auth) {
    const token = getAuthToken();
    if (token) {
      finalHeaders.Authorization = `Bearer ${token}`;
    }
  }

  const url = `${API_BASE_URL}${path}`;

  let response;
  try {
    response = await fetch(url, {
      ...rest,
      headers: finalHeaders,
    });
  } catch (networkErr) {
    throw new Error("Backend unreachable. Check that the API is running on " + API_BASE_URL);
  }

  if (response.status === 401) {
    clearAuthToken();
    throw new Error("Session expired. Please sign in again.");
  }

  if (!response.ok) {
    let detail = response.statusText;
    try {
      const body = await response.json();
      detail = body.detail || body.message || detail;
    } catch {
      // fallback to statusText
    }
    throw new Error(`API ${response.status}: ${detail}`);
  }

  return response.json();
}

// ============================================================
// Public Traffic API (no auth required)
// ============================================================

export async function getActiveVesselCount() {
  return apiFetch("/api/v1/traffic/active-count");
}

export async function getOtherVessels(bbox) {
  const params = new URLSearchParams({
    min_lat: bbox.min_lat,
    min_lon: bbox.min_lon,
    max_lat: bbox.max_lat,
    max_lon: bbox.max_lon,
  });
  return apiFetch(`/api/v1/traffic/other-vessels?${params}`);
}

export async function getTrafficDensity(bbox) {
  const params = new URLSearchParams({
    min_lat: bbox.min_lat,
    min_lon: bbox.min_lon,
    max_lat: bbox.max_lat,
    max_lon: bbox.max_lon,
  });
  return apiFetch(`/api/v1/traffic/density?${params}`);
}

// ============================================================
// Collision Avoidance API (auth required)
// ============================================================

export async function checkCollision(ownVessel, nearbyVessels) {
  return apiFetch("/api/v1/collision-avoidance/check", {
    method: "POST",
    auth: true,
    body: JSON.stringify({
      own_vessel: ownVessel,
      nearby_vessels: nearbyVessels,
    }),
  });
}

export async function checkRestrictedZone(mmsi, lat, lon, vesselType = null) {
  return apiFetch("/api/v1/collision-avoidance/zone-check", {
    method: "POST",
    auth: true,
    body: JSON.stringify({
      mmsi,
      lat,
      lon,
      vessel_type: vesselType,
    }),
  });
}
export async function login(email, password) {
  const data = await apiFetch("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (data.access_token) {
    setAuthToken(data.access_token);
  }
  return data;
}

export async function register(email, password, fullName) {
  return apiFetch("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      full_name: fullName,
    }),
  });
}

export async function getCurrentUser() {
  return apiFetch("/api/v1/auth/me", { auth: true });
}

export async function logout() {
  clearAuthToken();
}

export async function getMyVessels() {
  return apiFetch("/api/v1/fleet/my-vessels", { auth: true });
}

export async function submitVerification(formData) {
  const token = getAuthToken();
  const url = `${API_BASE_URL}/api/v1/verification/submit`;

  const response = await fetch(url, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API ${response.status}: ${errorBody || response.statusText}`);
  }

  return response.json();
}