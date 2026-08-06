"use client";

import * as React from "react";
import { Toast } from "@base-ui/react/toast";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "info";

const VARIANT_ICONS: Record<ToastVariant, React.ComponentType<{ className?: string }>> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const VARIANT_ICON_CLASS: Record<ToastVariant, string> = {
  success: "text-emerald-500",
  error: "text-red-500",
  info: "text-primary",
};

interface ToastProviderProps {
  children: React.ReactNode;
}

/**
 * Application toast system built on Base UI's Toast primitive.
 * Mount once near the app root; consume via `useToast()`.
 */
export function ToastProvider({ children }: ToastProviderProps) {
  return (
    <Toast.Provider timeout={5000} limit={4}>
      {children}
      <Toast.Portal>
        <Toast.Viewport className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[min(calc(100vw-2rem),22rem)] flex-col gap-2">
          <ToastList />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  );
}

function ToastList() {
  const { toasts } = Toast.useToastManager();
  return toasts.map((toast) => <ToastItem key={toast.id} toast={toast} />);
}

function ToastItem({ toast }: { toast: React.ComponentProps<typeof Toast.Root>["toast"] }) {
  const variant = (toast.type as ToastVariant) || "info";
  const Icon = VARIANT_ICONS[variant];

  return (
    <Toast.Root
      toast={toast}
      className="pointer-events-auto rounded-xl border border-slate-200 bg-white shadow-sm transition-[opacity,transform] duration-200 ease-out data-ending-style:translate-y-1 data-ending-style:opacity-0 data-starting-style:translate-y-1 data-starting-style:opacity-0 data-limited:opacity-0"
    >
      <Toast.Content className="flex items-start gap-2.5 p-3.5">
        <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", VARIANT_ICON_CLASS[variant])} />
        <div className="min-w-0 flex-1">
          <Toast.Title className="text-xs font-semibold text-slate-900" />
          {toast.description && (
            <Toast.Description className="mt-0.5 text-xs font-medium text-slate-500" />
          )}
        </div>
        <Toast.Close
          aria-label="Dismiss notification"
          className="shrink-0 cursor-pointer rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600"
        >
          <X className="h-3.5 w-3.5" />
        </Toast.Close>
      </Toast.Content>
    </Toast.Root>
  );
}

export interface ToastApi {
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

export function useToast(): { toast: ToastApi } {
  const manager = Toast.useToastManager();

  return React.useMemo(() => {
    const show = (type: ToastVariant, title: string, description?: string, timeout?: number) => {
      manager.add({
        type,
        title,
        description,
        timeout,
        priority: type === "error" ? "high" : "low",
      });
    };

    return {
      toast: {
        success: (title, description) => show("success", title, description, 4000),
        error: (title, description) => show("error", title, description, 6000),
        info: (title, description) => show("info", title, description, 4000),
      },
    };
  }, [manager]);
}
