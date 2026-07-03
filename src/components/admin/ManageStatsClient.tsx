"use client";

import React, { useState, useTransition } from "react";
import { Plus, Edit2, Trash2, X, BarChart3, AlertCircle } from "lucide-react";
import { createStatAction, updateStatAction, deleteStatAction } from "@/app/actions/adminActions";

interface Stat {
  id: string;
  number: string;
  label: string;
}

interface ManageStatsClientProps {
  stats: Stat[];
}

export default function ManageStatsClient({ stats }: ManageStatsClientProps) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [editStat, setEditStat] = useState<Stat | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [number, setNumber] = useState("");
  const [label, setLabel] = useState("");

  const handleOpenAdd = () => {
    setEditStat(null);
    setNumber("");
    setLabel("");
    setError(null);
    setIsOpen(true);
  };

  const handleOpenEdit = (stat: Stat) => {
    setEditStat(stat);
    setNumber(stat.number);
    setLabel(stat.label);
    setError(null);
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!number.trim() || !label.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    startTransition(async () => {
      try {
        if (editStat) {
          const res = await updateStatAction(editStat.id, { number, label });
          if (!res.success) throw new Error("Failed to update stat.");
        } else {
          const res = await createStatAction({ number, label });
          if (!res.success) throw new Error("Failed to create stat.");
        }
        setIsOpen(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred.");
      }
    });
  };

  const handleDelete = (id: string, label: string) => {
    if (!confirm(`Are you sure you want to delete the stat: "${label}"?`)) return;

    startTransition(async () => {
      try {
        const res = await deleteStatAction(id);
        if (!res.success) throw new Error("Failed to delete stat.");
      } catch (err) {
        alert(err instanceof Error ? err.message : "An error occurred.");
      }
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-extrabold text-foreground flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span>Manage Homepage Stats</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, edit, or delete the key performance statistics shown directly under the Hero section.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="rounded-lg bg-primary hover:bg-primary-hover px-4 py-2.5 text-xs font-bold text-white transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Stat</span>
        </button>
      </div>

      {/* Stats List Table */}
      <div className="overflow-hidden border border-slate-200 bg-white shadow-sm rounded-2xl">
        <table className="min-w-full divide-y divide-slate-200 text-left text-xs font-semibold text-slate-700">
          <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3">Stat Value</th>
              <th className="px-6 py-3">What it is about</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {stats.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-center text-slate-400 font-medium font-body">
                  No statistics configured yet. Click &quot;Add New Stat&quot; to begin.
                </td>
              </tr>
            ) : (
              stats.map((stat) => (
                <tr key={stat.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="whitespace-nowrap px-6 py-4 font-heading text-lg font-black text-slate-900">
                    {stat.number}
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium font-body">
                    {stat.label}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(stat)}
                      className="inline-flex items-center gap-1 text-slate-500 hover:text-primary transition-colors cursor-pointer px-2 py-1 border border-slate-200 hover:border-primary/20 bg-white rounded-md"
                    >
                      <Edit2 className="h-3 w-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(stat.id, stat.label)}
                      className="inline-flex items-center gap-1 text-slate-500 hover:text-red-600 transition-colors cursor-pointer px-2 py-1 border border-slate-200 hover:border-red-200 bg-white rounded-md"
                      disabled={isPending}
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Dialog Form */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col rounded-2xl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50">
              <h2 className="font-heading text-sm font-bold text-slate-900 uppercase tracking-wider">
                {editStat ? "Edit Homepage Stat" : "Add Homepage Stat"}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="flex gap-2 rounded-lg border border-red-150 bg-red-50 p-3 text-xs text-red-700 font-medium">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Stat Value Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Stat Value (e.g. 150,000+, 20+, 99.9%)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 150,000+"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className="w-full border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:border-primary focus:outline-none placeholder-slate-300 font-heading font-bold rounded-lg"
                />
              </div>

              {/* Stat Label Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  What it is about
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Students & Professionals"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="w-full border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:border-primary focus:outline-none placeholder-slate-300 font-body font-medium rounded-lg"
                />
              </div>

              {/* Actions Footer */}
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 border border-slate-250 text-xs font-bold text-slate-650 transition-colors cursor-pointer rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-xs font-bold text-white transition-colors cursor-pointer rounded-lg"
                >
                  {isPending ? "Saving..." : editStat ? "Save Changes" : "Create Stat"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
