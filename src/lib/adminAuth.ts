import { cookies } from "next/headers";
import crypto from "crypto";

const ADMIN_COOKIE_NAME = "mimos_admin_session";

// Generate a unique fallback secret at runtime if not configured in the environment
const RUNTIME_SECRET = crypto.randomBytes(32).toString("hex");
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || process.env.AUTH_SECRET || RUNTIME_SECRET;

/**
 * Sign value with HMAC-SHA256
 */
function signValue(value: string): string {
  const signature = crypto.createHmac("sha256", SESSION_SECRET).update(value).digest("hex");
  return `${value}:${signature}`;
}

/**
 * Verify HMAC-SHA256 signature and return unsigned value if valid
 */
function verifyValue(signedValue: string): string | null {
  try {
    const parts = signedValue.split(":");
    if (parts.length !== 2) return null;
    const [value, signature] = parts;
    
    const expectedSignature = crypto.createHmac("sha256", SESSION_SECRET).update(value).digest("hex");
    const signatureBuf = Buffer.from(signature, "hex");
    const expectedBuf = Buffer.from(expectedSignature, "hex");

    if (signatureBuf.length !== expectedBuf.length) {
      return null;
    }

    if (crypto.timingSafeEqual(signatureBuf, expectedBuf)) {
      return value;
    }
  } catch {
    // Catch any potential buffer parsing errors
  }
  return null;
}

export async function loginAdmin(email: string) {
  // Set session cookie for admin session (valid for 2 hours)
  const cookieStore = await cookies();
  const signedValue = signValue(email);
  
  cookieStore.set({
    name: ADMIN_COOKIE_NAME,
    value: signedValue,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 2, // 2 hours
    path: "/"
  });
  return true;
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  return true;
}

export async function getSessionAdmin() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(ADMIN_COOKIE_NAME);
    if (!sessionCookie || !sessionCookie.value) {
      return null;
    }
    
    const verifiedEmail = verifyValue(sessionCookie.value);
    if (!verifiedEmail) {
      return null;
    }
    
    return {
      email: verifiedEmail,
      role: "ADMIN"
    };
  } catch {
    return null;
  }
}

