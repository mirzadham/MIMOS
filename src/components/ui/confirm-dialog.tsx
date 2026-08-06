"use client";

import * as React from "react";
import { AlertDialog } from "@base-ui/react/alert-dialog";
import { AlertCircle, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ConfirmOptions {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Style the confirm button as destructive (red). */
  danger?: boolean;
  /**
   * Optional async handler run while the dialog stays open.
   * Resolves on success (dialog closes with `true`); errors are shown
   * inline in the dialog and it resolves with `false`.
   */
  onConfirm?: () => Promise<void>;
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = React.createContext<ConfirmFn>(() => Promise.resolve(false));

/**
 * Promise-based confirmation dialogs built on Base UI's AlertDialog.
 * Mount once near the app root; consume via `useConfirm()`.
 */
export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [options, setOptions] = React.useState<ConfirmOptions | null>(null);
  const [open, setOpen] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const resolverRef = React.useRef<((value: boolean) => void) | null>(null);
  const resultRef = React.useRef(false);
  const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const confirm = React.useCallback<ConfirmFn>((opts) => {
    return new Promise<boolean>((resolve) => {
      // A previous dialog still animating out: cancel it and resolve as cancelled.
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      resolverRef.current?.(false);
      resolverRef.current = resolve;
      resultRef.current = false;
      setOptions(opts);
      setError(null);
      setBusy(false);
      setOpen(true);
    });
  }, []);

  const handleOpenChange = React.useCallback((next: boolean) => {
    setOpen(next);
    if (!next) {
      // Wait for the exit transition before unmounting + resolving.
      // Capture the resolver/result now so a dialog opened during the exit
      // animation can never be resolved (or wiped) by this stale timer.
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      const resolver = resolverRef.current;
      const result = resultRef.current;
      closeTimerRef.current = setTimeout(() => {
        resolver?.(result);
        if (resolverRef.current === resolver) resolverRef.current = null;
        setOptions(null);
        setBusy(false);
        setError(null);
      }, 200);
    }
  }, []);

  const handleCancel = React.useCallback(() => {
    resultRef.current = false;
    setOpen(false);
  }, []);

  const handleConfirm = React.useCallback(async () => {
    if (!options) return;

    if (options.onConfirm) {
      setBusy(true);
      setError(null);
      try {
        await options.onConfirm();
        resultRef.current = true;
        setOpen(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred.");
        setBusy(false);
      }
      return;
    }

    resultRef.current = true;
    setOpen(false);
  }, [options]);

  const contextValue = React.useMemo(() => confirm, [confirm]);

  return (
    <ConfirmContext.Provider value={contextValue}>
      {children}
      <AlertDialog.Root open={open} onOpenChange={handleOpenChange}>
        <AlertDialog.Portal>
          <AlertDialog.Backdrop className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0" />
          <AlertDialog.Popup className="fixed left-1/2 top-1/2 z-50 w-[min(calc(100vw-2rem),26rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg transition-[scale,opacity] duration-200 ease-out data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0">
            {options && (
              <div className="w-full">
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                      options.danger ? "bg-red-50 text-red-600" : "bg-accent text-primary"
                    )}
                  >
                    {options.danger ? (
                      <AlertTriangle className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <AlertDialog.Title className="font-heading text-sm font-semibold text-slate-900">
                      {options.title}
                    </AlertDialog.Title>
                    {options.message && (
                      <AlertDialog.Description className="mt-1 text-xs leading-relaxed text-slate-500">
                        {options.message}
                      </AlertDialog.Description>
                    )}
                    {error && (
                      <p className="mt-2 flex items-start gap-1.5 text-xs font-medium text-red-600">
                        <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" />
                        <span>{error}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={busy}
                    className="cursor-pointer rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
                  >
                    {options.cancelLabel || "Cancel"}
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={busy}
                    className={cn(
                      "flex min-w-[5.5rem] cursor-pointer items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-xs font-semibold text-white transition-colors disabled:opacity-70",
                      options.danger ? "bg-red-600 hover:bg-red-700" : "bg-primary hover:bg-primary-hover"
                    )}
                  >
                    {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    <span>{busy ? `${options.confirmLabel || "Confirm"}…` : options.confirmLabel || "Confirm"}</span>
                  </button>
                </div>
              </div>
            )}
          </AlertDialog.Popup>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </ConfirmContext.Provider>
  );
}

export function useConfirm(): ConfirmFn {
  const ctx = React.useContext(ConfirmContext);
  if (!ctx) {
    throw new Error("useConfirm must be used within a ConfirmProvider.");
  }
  return ctx;
}
