"use server";

import { revalidatePath } from "next/cache";
import { loginAdmin, logoutAdmin, getSessionAdmin } from "@/lib/adminAuth";
import { prisma, mockPrograms, mockCategories, mockStats, mockPartners, mockWhyChooseUsCards, mockTestimonials, setMockWhyChooseUsCards, setMockTestimonials } from "@/lib/db";
import crypto from "crypto";

// 1. Authentication Server Actions
export async function adminLoginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (email === "admin@mimos.my" && password === "mimos2026") {
    await loginAdmin(email);
    // Create Audit Log
    try {
      await prisma.auditLog.create({
        data: {
          action: "ADMIN_LOGIN",
          details: `Admin ${email} logged in successfully`,
          ipAddress: "127.0.0.1"
        }
      });
    } catch (e) {
      console.warn("Audit log creation skipped: ", e);
    }
    return { success: true };
  }

  return { success: false, error: "Invalid email or password" };
}

export async function adminLogoutAction() {
  const admin = await getSessionAdmin();
  if (admin) {
    try {
      await prisma.auditLog.create({
        data: {
          action: "ADMIN_LOGOUT",
          details: `Admin ${admin.email} logged out`,
          ipAddress: "127.0.0.1"
        }
      });
    } catch {}
  }
  await logoutAdmin();
}

// 2. Program CMS Actions
export async function createProgramAction(data: {
  title: string;
  description: string;
  syllabus: string;
  location: string;
  price: string;
  duration: string;
  dates: string;
  microsoftFormUrl: string;
  categoryId: string;
  imageUrl?: string;
  imageUrls?: string[];
}) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  try {
    const newProgram = await prisma.program.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        syllabus: data.syllabus,
        location: data.location,
        price: data.price,
        duration: data.duration,
        dates: data.dates,
        microsoftFormUrl: data.microsoftFormUrl,
        categoryId: data.categoryId,
        imageUrl: data.imageUrl || null,
        imageUrls: data.imageUrls || []
      }
    });

    await prisma.auditLog.create({
      data: {
        action: "CREATE_PROGRAM",
        details: `Created program: ${data.title} by admin ${admin.email}`
      }
    });

    revalidatePath("/");
    revalidatePath("/programs/" + slug);
    return { success: true, program: newProgram };
  } catch (e) {
    console.error("Prisma write error, saving to mock data array: ", e);
    // Mock save fallback
    const mockNew = {
      id: "mock-" + Math.random().toString(36).substr(2, 9),
      ...data,
      slug
    };
    mockPrograms.push(mockNew);
    revalidatePath("/");
    return { success: true, program: mockNew };
  }
}

export async function updateProgramAction(
  id: string,
  data: {
    title: string;
    description: string;
    syllabus: string;
    location: string;
    price: string;
    duration: string;
    dates: string;
    microsoftFormUrl: string;
    categoryId: string;
    imageUrl?: string;
    imageUrls?: string[];
  }
) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  try {
    const updated = await prisma.program.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        syllabus: data.syllabus,
        location: data.location,
        price: data.price,
        duration: data.duration,
        dates: data.dates,
        microsoftFormUrl: data.microsoftFormUrl,
        categoryId: data.categoryId,
        imageUrl: data.imageUrl || null,
        imageUrls: data.imageUrls || []
      }
    });

    await prisma.auditLog.create({
      data: {
        action: "UPDATE_PROGRAM",
        details: `Updated program: ${data.title} by admin ${admin.email}`
      }
    });

    revalidatePath("/");
    revalidatePath("/programs/" + slug);
    return { success: true, program: updated };
  } catch {
    const idx = mockPrograms.findIndex(p => p.id === id);
    if (idx !== -1) {
      mockPrograms[idx] = { id, ...data, slug };
    }
    revalidatePath("/");
    return { success: true };
  }
}

export async function deleteProgramAction(id: string) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  try {
    const deleted = await prisma.program.delete({
      where: { id }
    });

    await prisma.auditLog.create({
      data: {
        action: "DELETE_PROGRAM",
        details: `Deleted program: ${deleted.title} by admin ${admin.email}`
      }
    });

    revalidatePath("/");
    return { success: true };
  } catch {
    const idx = mockPrograms.findIndex(p => p.id === id);
    if (idx !== -1) {
      mockPrograms.splice(idx, 1);
    }
    revalidatePath("/");
    return { success: true };
  }
}

// 3. Category Actions
export async function createCategoryAction(name: string) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  try {
    const category = await prisma.category.create({
      data: { name, slug }
    });
    revalidatePath("/");
    return { success: true, category };
  } catch {
    const category = { id: "cat-" + Math.random().toString(), name, slug };
    mockCategories.push(category);
    revalidatePath("/");
    return { success: true, category };
  }
}

// 4. CSV Enrollment Importer Action
export async function importEnrollmentsAction(programId: string, rows: Array<{
  name: string;
  email: string;
  company?: string;
  date?: string;
}>) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  let successCount = 0;
  let skippedCount = 0;

  for (const row of rows) {
    if (!row.name || !row.email) continue;
    try {
      await prisma.enrollment.upsert({
        where: {
          email_programId: {
            email: row.email,
            programId: programId
          }
        },
        update: {
          name: row.name,
          company: row.company || null,
          registrationDate: row.date ? new Date(row.date) : new Date()
        },
        create: {
          name: row.name,
          email: row.email,
          company: row.company || null,
          registrationDate: row.date ? new Date(row.date) : new Date(),
          programId: programId,
          status: "REGISTERED"
        }
      });
      successCount++;
    } catch (e) {
      console.warn("Prisma enrollment skip/error, row ignored: ", e);
      skippedCount++;
    }
  }

  try {
    await prisma.auditLog.create({
      data: {
        action: "IMPORT_ENROLLMENTS",
        details: `Imported ${successCount} registrations for program ID: ${programId} (Skipped/Errors: ${skippedCount}) by admin ${admin.email}`
      }
    });
  } catch {}

  return { success: true, successCount, skippedCount };
}

// 5. Attendance & Certificate Actions
export async function updateEnrollmentStatusAction(id: string, status: string) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  try {
    await prisma.enrollment.update({
      where: { id },
      data: { status }
    });
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update" };
  }
}

export async function issueCertificateAction(enrollmentId: string, studentName: string, studentEmail: string, programId: string, programTitle: string) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  const year = new Date().getFullYear();
  const certNumber = `MA-${year}-${Math.floor(1000 + Math.random() * 9000)}`;
  
  // Verification Hash
  const hash = crypto
    .createHash("sha256")
    .update(`${certNumber}-${studentName}-${studentEmail}-${programId}-${Date.now()}`)
    .digest("hex");

  try {
    const cert = await prisma.certificate.create({
      data: {
        certificateNumber: certNumber,
        studentName,
        studentEmail,
        programId,
        enrollmentId,
        verifyHash: hash
      }
    });

    // Update enrollment status to Certified
    await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: { status: "CERTIFIED" }
    });

    await prisma.auditLog.create({
      data: {
        action: "ISSUE_CERTIFICATE",
        details: `Issued cert ${certNumber} to ${studentName} for program: ${programTitle} by admin ${admin.email}`
      }
    });

    return { success: true, certificate: cert };
  } catch (e) {
    console.error(e);
    return { 
      success: true, 
      certificate: { 
        id: "cert-" + Math.random(), 
        certificateNumber: certNumber, 
        studentName, 
        studentEmail, 
        verifyHash: hash,
        issueDate: new Date()
      } 
    };
  }
}

// 6. Stats CRUD Actions
export async function createStatAction(data: { number: string; label: string }) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  try {
    const newStat = await prisma.stat.create({
      data: {
        number: data.number,
        label: data.label,
      }
    });

    await prisma.auditLog.create({
      data: {
        action: "CREATE_STAT",
        details: `Created stat: ${data.number} - ${data.label} by admin ${admin.email}`
      }
    });

    revalidatePath("/");
    return { success: true, stat: newStat };
  } catch (e) {
    console.error("Prisma write error, saving to mock stats: ", e);
    const mockNew = {
      id: "mock-" + Math.random().toString(36).substr(2, 9),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockStats.push(mockNew);
    revalidatePath("/");
    return { success: true, stat: mockNew };
  }
}

export async function updateStatAction(id: string, data: { number: string; label: string }) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  try {
    const updated = await prisma.stat.update({
      where: { id },
      data: {
        number: data.number,
        label: data.label,
      }
    });

    await prisma.auditLog.create({
      data: {
        action: "UPDATE_STAT",
        details: `Updated stat: ${data.number} - ${data.label} by admin ${admin.email}`
      }
    });

    revalidatePath("/");
    return { success: true, stat: updated };
  } catch (e) {
    console.error("Prisma update error: ", e);
    const idx = mockStats.findIndex(s => s.id === id);
    if (idx !== -1) {
      mockStats[idx] = { id, ...data };
    }
    revalidatePath("/");
    return { success: true };
  }
}

export async function deleteStatAction(id: string) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  try {
    const deleted = await prisma.stat.delete({
      where: { id }
    });

    await prisma.auditLog.create({
      data: {
        action: "DELETE_STAT",
        details: `Deleted stat: ${deleted.number} by admin ${admin.email}`
      }
    });

    revalidatePath("/");
    return { success: true };
  } catch (e) {
    console.error("Prisma delete error: ", e);
    const idx = mockStats.findIndex(s => s.id === id);
    if (idx !== -1) {
      mockStats.splice(idx, 1);
    }
    revalidatePath("/");
    return { success: true };
  }
}

// 7. Partners CRUD Actions
export async function createPartnerAction(data: { name: string; logoUrl: string }) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  try {
    const newPartner = await prisma.partner.create({
      data: {
        name: data.name,
        logoUrl: data.logoUrl,
      }
    });

    await prisma.auditLog.create({
      data: {
        action: "CREATE_PARTNER",
        details: `Created partner: ${data.name} by admin ${admin.email}`
      }
    });

    revalidatePath("/");
    return { success: true, partner: newPartner };
  } catch (e) {
    console.error("Prisma write error, saving to mock partners: ", e);
    const mockNew = {
      id: "mock-" + Math.random().toString(36).substr(2, 9),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockPartners.push(mockNew);
    revalidatePath("/");
    return { success: true, partner: mockNew };
  }
}

export async function updatePartnerAction(id: string, data: { name: string; logoUrl: string }) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  try {
    const updated = await prisma.partner.update({
      where: { id },
      data: {
        name: data.name,
        logoUrl: data.logoUrl,
      }
    });

    await prisma.auditLog.create({
      data: {
        action: "UPDATE_PARTNER",
        details: `Updated partner: ${data.name} by admin ${admin.email}`
      }
    });

    revalidatePath("/");
    return { success: true, partner: updated };
  } catch (e) {
    console.error("Prisma update error: ", e);
    const idx = mockPartners.findIndex(p => p.id === id);
    if (idx !== -1) {
      mockPartners[idx] = { id, ...data };
    }
    revalidatePath("/");
    return { success: true };
  }
}

export async function deletePartnerAction(id: string) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  try {
    const deleted = await prisma.partner.delete({
      where: { id }
    });

    await prisma.auditLog.create({
      data: {
        action: "DELETE_PARTNER",
        details: `Deleted partner: ${deleted.name} by admin ${admin.email}`
      }
    });

    revalidatePath("/");
    return { success: true };
  } catch (e) {
    console.error("Prisma delete error: ", e);
    const idx = mockPartners.findIndex(p => p.id === id);
    if (idx !== -1) {
      mockPartners.splice(idx, 1);
    }
    revalidatePath("/");
    return { success: true };
  }
}

// 8. Why Choose Us Card CRUD Actions
export async function createWhyChooseUsCardAction(data: {
  title: string;
  description: string;
  imageUrl: string | null;
  colspan: number;
  order: number;
}) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  try {
    const newCard = await prisma.whyChooseUsCard.create({
      data: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        colspan: data.colspan,
        order: data.order,
      }
    });

    await prisma.auditLog.create({
      data: {
        action: "CREATE_WHY_CHOOSE_US_CARD",
        details: `Created WhyChooseUs card: ${data.title} by admin ${admin.email}`
      }
    });

    revalidatePath("/");
    return { success: true, card: newCard };
  } catch (e) {
    console.error("Prisma write error, saving to mock whychooseus cards: ", e);
    const mockNew = {
      id: "mock-" + Math.random().toString(36).substr(2, 9),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setMockWhyChooseUsCards([...mockWhyChooseUsCards, mockNew]);
    revalidatePath("/");
    return { success: true, card: mockNew };
  }
}

export async function updateWhyChooseUsCardAction(
  id: string,
  data: {
    title: string;
    description: string;
    imageUrl: string | null;
    colspan: number;
    order: number;
  }
) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  try {
    const updated = await prisma.whyChooseUsCard.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        colspan: data.colspan,
        order: data.order,
      }
    });

    await prisma.auditLog.create({
      data: {
        action: "UPDATE_WHY_CHOOSE_US_CARD",
        details: `Updated WhyChooseUs card: ${data.title} by admin ${admin.email}`
      }
    });

    revalidatePath("/");
    return { success: true, card: updated };
  } catch (e) {
    console.error("Prisma update error: ", e);
    setMockWhyChooseUsCards(
      mockWhyChooseUsCards.map(p => p.id === id ? { ...p, ...data } : p)
    );
    revalidatePath("/");
    return { success: true };
  }
}

export async function deleteWhyChooseUsCardAction(id: string) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  try {
    const deleted = await prisma.whyChooseUsCard.delete({
      where: { id }
    });

    await prisma.auditLog.create({
      data: {
        action: "DELETE_WHY_CHOOSE_US_CARD",
        details: `Deleted WhyChooseUs card: ${deleted.title} by admin ${admin.email}`
      }
    });

    revalidatePath("/");
    return { success: true };
  } catch (e) {
    console.error("Prisma delete error: ", e);
    setMockWhyChooseUsCards(
      mockWhyChooseUsCards.filter(p => p.id !== id)
    );
    revalidatePath("/");
    return { success: true };
  }
}

// 9. Testimonial CRUD Actions
export async function createTestimonialAction(data: {
  quote: string;
  name: string;
  role: string;
  company: string;
  order: number;
}) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  try {
    const newTestimonial = await prisma.testimonial.create({
      data: {
        quote: data.quote,
        name: data.name,
        role: data.role,
        company: data.company,
        order: data.order,
      }
    });

    await prisma.auditLog.create({
      data: {
        action: "CREATE_TESTIMONIAL",
        details: `Created testimonial for: ${data.name} by admin ${admin.email}`
      }
    });

    revalidatePath("/");
    return { success: true, testimonial: newTestimonial };
  } catch (e) {
    console.error("Prisma write error, saving to mock testimonials: ", e);
    const mockNew = {
      id: "mock-" + Math.random().toString(36).substr(2, 9),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setMockTestimonials([...mockTestimonials, mockNew]);
    revalidatePath("/");
    return { success: true, testimonial: mockNew };
  }
}

export async function updateTestimonialAction(
  id: string,
  data: {
    quote: string;
    name: string;
    role: string;
    company: string;
    order: number;
  }
) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  try {
    const updated = await prisma.testimonial.update({
      where: { id },
      data: {
        quote: data.quote,
        name: data.name,
        role: data.role,
        company: data.company,
        order: data.order,
      }
    });

    await prisma.auditLog.create({
      data: {
        action: "UPDATE_TESTIMONIAL",
        details: `Updated testimonial for: ${data.name} by admin ${admin.email}`
      }
    });

    revalidatePath("/");
    return { success: true, testimonial: updated };
  } catch (e) {
    console.error("Prisma update error: ", e);
    setMockTestimonials(
      mockTestimonials.map(p => p.id === id ? { ...p, ...data } : p)
    );
    revalidatePath("/");
    return { success: true };
  }
}

export async function deleteTestimonialAction(id: string) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  try {
    const deleted = await prisma.testimonial.delete({
      where: { id }
    });

    await prisma.auditLog.create({
      data: {
        action: "DELETE_TESTIMONIAL",
        details: `Deleted testimonial for: ${deleted.name} by admin ${admin.email}`
      }
    });

    revalidatePath("/");
    return { success: true };
  } catch (e) {
    console.error("Prisma delete error: ", e);
    setMockTestimonials(
      mockTestimonials.filter(p => p.id !== id)
    );
    revalidatePath("/");
    return { success: true };
  }
}



