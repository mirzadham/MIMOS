"use client";

import { ConfirmProvider } from "@/components/ui/confirm-dialog";
import { ToastProvider } from "@/components/ui/toast";

/**
 * Client-side providers shared by every admin dashboard page:
 * toast notifications + promise-based confirm dialogs.
 */
export default function AdminProviders({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <ConfirmProvider>{children}</ConfirmProvider>
    </ToastProvider>
  );
}
