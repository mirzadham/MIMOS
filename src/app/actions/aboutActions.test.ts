import { describe, it, expect, vi, beforeEach } from "vitest";
import { 
  updateAboutSettingsAction, 
  createTeamMemberAction, 
  updateTeamMemberAction, 
  deleteTeamMemberAction 
} from "./aboutActions";
import { getSessionAdmin } from "@/lib/adminAuth";
import { prisma, mockAboutSettings, mockTeamMembers } from "@/lib/db";

// Mock next/cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// Mock adminAuth
vi.mock("@/lib/adminAuth", () => ({
  getSessionAdmin: vi.fn(),
}));

// Mock DB layer
vi.mock("@/lib/db", () => {
  const mockPrisma = {
    aboutSettings: {
      findFirst: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
    },
    teamMember: {
      count: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
  };
  return {
    prisma: mockPrisma,
    mockAboutSettings: {
      mission: "Mock mission",
      vision: "Mock vision",
    },
    mockTeamMembers: [],
    setMockAboutSettings: vi.fn(),
    setMockTeamMembers: vi.fn(),
  };
});

describe("About and Team Server Actions Tests", () => {
  const mockAdmin = { email: "admin@mimos.my" };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("updateAboutSettingsAction", () => {
    it("should throw an error if the user is unauthorized", async () => {
      vi.mocked(getSessionAdmin).mockResolvedValue(null);
      await expect(
        updateAboutSettingsAction({ mission: "New Mission", vision: "New Vision" })
      ).rejects.toThrow("Unauthorized");
    });

    it("should update settings in DB if authorized and settings exist", async () => {
      vi.mocked(getSessionAdmin).mockResolvedValue(mockAdmin);
      vi.mocked(prisma.aboutSettings.findFirst).mockResolvedValue({ id: "settings-1", mission: "Old", vision: "Old" } as any);
      vi.mocked(prisma.aboutSettings.update).mockResolvedValue({ id: "settings-1", mission: "New Mission", vision: "New Vision" } as any);

      const res = await updateAboutSettingsAction({ mission: "New Mission", vision: "New Vision" });
      
      expect(res.success).toBe(true);
      expect(res.settings?.mission).toBe("New Mission");
      expect(prisma.aboutSettings.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "settings-1" },
          data: { mission: "New Mission", vision: "New Vision" },
        })
      );
    });

    it("should create new settings if authorized and no settings exist", async () => {
      vi.mocked(getSessionAdmin).mockResolvedValue(mockAdmin);
      vi.mocked(prisma.aboutSettings.findFirst).mockResolvedValue(null);
      vi.mocked(prisma.aboutSettings.create).mockResolvedValue({ id: "settings-new", mission: "New Mission", vision: "New Vision" } as any);

      const res = await updateAboutSettingsAction({ mission: "New Mission", vision: "New Vision" });
      
      expect(res.success).toBe(true);
      expect(res.settings?.mission).toBe("New Mission");
      expect(prisma.aboutSettings.create).toHaveBeenCalled();
    });
  });

  describe("createTeamMemberAction", () => {
    it("should throw an error if the user is unauthorized", async () => {
      vi.mocked(getSessionAdmin).mockResolvedValue(null);
      await expect(
        createTeamMemberAction({
          name: "Test Name",
          role: "Test Role",
          imageUrl: null,
          initials: "TN",
        })
      ).rejects.toThrow("Unauthorized");
    });

    it("should create a team member inside prisma if authorized", async () => {
      vi.mocked(getSessionAdmin).mockResolvedValue(mockAdmin);
      vi.mocked(prisma.teamMember.count).mockResolvedValue(5);
      const createdMember = {
        id: "tm-1",
        name: "Test Name",
        role: "Test Role",
        imageUrl: null,
        initials: "TN",
        order: 5,
      };
      vi.mocked(prisma.teamMember.create).mockResolvedValue(createdMember as any);

      const res = await createTeamMemberAction({
        name: "Test Name",
        role: "Test Role",
        imageUrl: null,
        initials: "TN",
      });

      expect(res.success).toBe(true);
      expect(res.member?.name).toBe("Test Name");
      expect(res.member?.order).toBe(5);
      expect(prisma.teamMember.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            name: "Test Name",
            role: "Test Role",
            imageUrl: null,
            initials: "TN",
            order: 5,
          },
        })
      );
    });
  });

  describe("updateTeamMemberAction", () => {
    it("should throw an error if the user is unauthorized", async () => {
      vi.mocked(getSessionAdmin).mockResolvedValue(null);
      await expect(
        updateTeamMemberAction("tm-1", {
          name: "Updated Name",
          role: "Updated Role",
          imageUrl: "https://example.com/img.jpg",
          initials: "UN",
          order: 3,
        })
      ).rejects.toThrow("Unauthorized");
    });

    it("should update a team member inside prisma if authorized", async () => {
      vi.mocked(getSessionAdmin).mockResolvedValue(mockAdmin);
      const updatedMember = {
        id: "tm-1",
        name: "Updated Name",
        role: "Updated Role",
        imageUrl: "https://example.com/img.jpg",
        initials: "UN",
        order: 3,
      };
      vi.mocked(prisma.teamMember.update).mockResolvedValue(updatedMember as any);

      const res = await updateTeamMemberAction("tm-1", {
        name: "Updated Name",
        role: "Updated Role",
        imageUrl: "https://example.com/img.jpg",
        initials: "UN",
        order: 3,
      });

      expect(res.success).toBe(true);
      expect(res.member?.name).toBe("Updated Name");
      expect(prisma.teamMember.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "tm-1" },
          data: {
            name: "Updated Name",
            role: "Updated Role",
            imageUrl: "https://example.com/img.jpg",
            initials: "UN",
            order: 3,
          },
        })
      );
    });
  });

  describe("deleteTeamMemberAction", () => {
    it("should throw an error if the user is unauthorized", async () => {
      vi.mocked(getSessionAdmin).mockResolvedValue(null);
      await expect(deleteTeamMemberAction("tm-1")).rejects.toThrow("Unauthorized");
    });

    it("should delete a team member from DB if authorized", async () => {
      vi.mocked(getSessionAdmin).mockResolvedValue(mockAdmin);
      vi.mocked(prisma.teamMember.delete).mockResolvedValue({ id: "tm-1", name: "Deleted" } as any);

      const res = await deleteTeamMemberAction("tm-1");

      expect(res.success).toBe(true);
      expect(prisma.teamMember.delete).toHaveBeenCalledWith({
        where: { id: "tm-1" },
      });
    });
  });
});
