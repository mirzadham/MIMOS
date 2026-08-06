import { redirect } from "next/navigation";
import { getSessionAdmin } from "@/lib/adminAuth";
import AdminProviders from "@/components/admin/AdminProviders";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 1. Session check: if not logged in, redirect to login
  const admin = await getSessionAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <AdminProviders>
      <AdminShell adminEmail={admin.email}>{children}</AdminShell>
    </AdminProviders>
  );
}
