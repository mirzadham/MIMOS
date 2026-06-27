import { cookies } from "next/headers";

const ADMIN_COOKIE_NAME = "mimos_admin_session";

export async function loginAdmin(email: string) {
  // Set session cookie for admin session (valid for 2 hours)
  const cookieStore = await cookies();
  cookieStore.set({
    name: ADMIN_COOKIE_NAME,
    value: email,
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
    return {
      email: sessionCookie.value,
      role: "ADMIN"
    };
  } catch {
    return null;
  }
}
