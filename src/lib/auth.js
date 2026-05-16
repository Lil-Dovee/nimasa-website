import { jwtDecode } from "jwt-decode";
import { getAuthToken } from "./api";

export function getDecodedToken() {
  const token = getAuthToken();
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}

export function isLoggedIn() {
  const decoded = getDecodedToken();
  if (!decoded) return false;
  if (decoded.exp && decoded.exp * 1000 < Date.now()) return false;
  return true;
}

export function getUserRole() {
  const decoded = getDecodedToken();
  return decoded?.role || "viewer";
}

export function getUserId() {
  const decoded = getDecodedToken();
  return decoded?.sub || decoded?.user_id || null;
}