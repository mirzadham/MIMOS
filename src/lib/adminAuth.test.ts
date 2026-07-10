/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { loginAdmin, logoutAdmin, getSessionAdmin } from "./adminAuth";
import { cookies } from "next/headers";

// Mock next/headers using a regular function (not a vi.fn()) so it is not affected by vi.resetAllMocks()
vi.mock("next/headers", () => {
  const store = {
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  };
  const cookiesFn = () => store;
  (cookiesFn as any)._store = store;
  
  return {
    cookies: cookiesFn,
  };
});

describe("Admin Authentication Tests", () => {
  let mockStore: any;

  beforeEach(() => {
    vi.resetAllMocks();
    mockStore = (cookies as any)._store;
  });

  it("should successfully set a signed cookie on loginAdmin", async () => {
    const email = "admin@mimos.my";
    const result = await loginAdmin(email);
    
    expect(result).toBe(true);
    expect(mockStore.set).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "mimos_admin_session",
        value: expect.stringContaining(email + ":"),
        httpOnly: true,
      })
    );
  });

  it("should delete the session cookie on logoutAdmin", async () => {
    const result = await logoutAdmin();
    expect(result).toBe(true);
    expect(mockStore.delete).toHaveBeenCalledWith("mimos_admin_session");
  });

  it("should return null for getSessionAdmin if no cookie is set", async () => {
    mockStore.get.mockReturnValue(undefined);

    const session = await getSessionAdmin();
    expect(session).toBeNull();
  });

  it("should return null for getSessionAdmin if signature is invalid", async () => {
    mockStore.get.mockReturnValue({
      value: "admin@mimos.my:invalid_sig",
    } as any);

    const session = await getSessionAdmin();
    expect(session).toBeNull();
  });

  it("should verify signature and return session details for a valid signed cookie", async () => {
    const email = "admin@mimos.my";

    // Call loginAdmin first to get a valid signed value set to the mock store
    await loginAdmin(email);
    
    // Extract the signed value that was set
    const setCallArgs = mockStore.set.mock.calls[0][0] as any;
    const signedValue = setCallArgs.value;

    mockStore.get.mockReturnValue({
      value: signedValue,
    } as any);

    const session = await getSessionAdmin();
    expect(session).not.toBeNull();
    expect(session?.email).toBe(email);
    expect(session?.role).toBe("ADMIN");
  });
});



