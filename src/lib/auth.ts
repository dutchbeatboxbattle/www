import crypto from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "dbb_admin_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24; // 24 uur

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "dbb-admin-2025";
}

function getSigningSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    `dbb-secret-salt-${getAdminPassword()}`
  );
}

export function getAdminSecretSlug(): string {
  return process.env.ADMIN_SECRET_SLUG || "dbb-beheer";
}

/**
 * Controleert het wachtwoord op een timing-safe manier.
 */
export function verifyPassword(inputPassword: string): boolean {
  const expected = getAdminPassword();
  const inputBuf = Buffer.from(inputPassword, "utf-8");
  const expectedBuf = Buffer.from(expected, "utf-8");

  if (inputBuf.length !== expectedBuf.length) {
    return false;
  }

  return crypto.timingSafeEqual(inputBuf, expectedBuf);
}

/**
 * Maakt een gesigneerd sessie-token aan (payload.signature).
 */
export function createSessionToken(): string {
  const payload = JSON.stringify({
    role: "admin",
    exp: Date.now() + SESSION_DURATION_MS,
  });
  const payloadBase64 = Buffer.from(payload).toString("base64url");
  const signature = crypto
    .createHmac("sha256", getSigningSecret())
    .update(payloadBase64)
    .digest("base64url");

  return `${payloadBase64}.${signature}`;
}

/**
 * Verifieert een gesigneerd sessie-token.
 */
export function verifySessionToken(token: string | undefined): boolean {
  if (!token || !token.includes(".")) return false;

  const [payloadBase64, signature] = token.split(".");
  if (!payloadBase64 || !signature) return false;

  const expectedSignature = crypto
    .createHmac("sha256", getSigningSecret())
    .update(payloadBase64)
    .digest("base64url");

  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expectedSignature);
  if (sigBuf.length !== expectedBuf.length) return false;
  if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return false;

  try {
    const payload = JSON.parse(
      Buffer.from(payloadBase64, "base64url").toString("utf-8")
    );
    if (!payload.exp || Date.now() > payload.exp) {
      return false;
    }
    return payload.role === "admin";
  } catch {
    return false;
  }
}

/**
 * Hulpfunctie voor Server Components en API-routes om te controleren of de bezoeker is ingelogd.
 */
export async function isAuthenticatedAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}
