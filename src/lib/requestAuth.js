import { verifyJWT } from "@/lib/auth";

/**
 * Read JWT from httpOnly cookie (preferred) or Authorization: Bearer header
 * (localStorage-backed clients).
 */
export function getTokenFromRequest(req) {
  const cookieToken = req.cookies?.get?.("token")?.value;
  if (cookieToken) return cookieToken;

  const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7).trim();
  }
  return null;
}

export async function getAuthPayload(req) {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  return verifyJWT(token);
}
