/**
 * Stateless signed sessions for the admin and teacher panels.
 * Cookie value = "<role>.<subject>.<issuedAt>.<expiresAt>.<hmac>".
 * Uses Web Crypto so it runs both in middleware (edge) and server actions (node).
 */
export type Role = "admin" | "teacher";

export const SESSION_COOKIES: Record<Role, string> = { admin: "gw_admin", teacher: "gw_teacher" };
export const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours

export type Session = { role: Role; sub: string; issuedAt: number };

const encoder = new TextEncoder();

function getSecret() {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || secret.length < 16) throw new Error("ADMIN_SECRET must be set (16+ characters).");
  return secret;
}

async function hmac(value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

export function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createSessionToken(role: Role, sub: string) {
  const now = Date.now();
  const payload = `${role}.${sub}.${now}.${now + SESSION_TTL_SECONDS * 1000}`;
  return `${payload}.${await hmac(payload)}`;
}

export async function verifySessionToken(token: string | undefined, role: Role): Promise<Session | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 5) return null;
  const [tokenRole, sub, issuedAt, expiresAt, sig] = parts;
  if (tokenRole !== role || !sub || Number(expiresAt) < Date.now()) return null;
  if (!safeEqual(sig, await hmac(parts.slice(0, 4).join(".")))) return null;
  return { role, sub, issuedAt: Number(issuedAt) };
}

export async function checkAdminPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  // Compare HMACs so the check is constant-time regardless of length.
  return safeEqual(await hmac(password), await hmac(expected));
}
