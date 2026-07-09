"use client";

import React, { useState, useTransition } from "react";
import { Plus, Edit2, Trash2, X, MessageSquare, AlertCircle } from "lucide-react";
import { 
  createTestimonialAction, 
  updateTestimonialAction, 
  deleteTestimonialAction 
} from "@/app/actions/adminActions";

interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  order: number;
}

interface ManageTestimonialsClientProps {
  testimonials: Testimonial[];
}

export default function ManageTestimonialsClient({ testimonials }: ManageTestimonialsClientProps) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [editTestimonial, setEditTestimonial] = useState<Testimonial | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [quote, setQuote] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [order, setOrder] = useState(0);

  const handleOpenAdd = () => {
    setEditTestimonial(null);
    setQuote("");
    setName("");
    setRole("");
    setCompany("");
    // Suggest the next order index
    const nextOrder = testimonials.length > 0 ? Math.max(...testimonials.map(t => t.order)) + 1 : 0;
    setOrder(nextOrder);
    setError(null);
    setIsOpen(true);
  };

  const handleOpenEdit = (testimonial: Testimonial) => {
    setEditTestimonial(testimonial);
    setQuote(testimonial.quote);
    setName(testimonial.name);
    setRole(testimonial.role);
    setCompany(testimonial.company);
    setOrder(testimonial.order);
    setError(null);
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quote.trim() || !name.trim() || !role.trim() || !company.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    startTransition(async () => {
      try {
        if (editTestimonial) {
          const res = await updateTestimonialAction(editTestimonial.id, {
            quote,
            name,
            role,
            company,
            order: Number(order)
          });
          if (!res.success) throw new Error("Failed to update testimonial.");
        } else {
          const res = await createTestimonialAction({
            quote,
            name,
            role,
            company,
            order: Number(order)
          });
          if (!res.success) throw new Error("Failed to create testimonial.");
        }
        setIsOpen(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred.");
      }
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the testimonial from: "${name}"?`)) return;

    startTransition(async () => {
      try {
        const res = await deleteTestimonialAction(id);
        if (!res.success) throw new Error("Failed to delete testimonial.");
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
          <h1 className="font-heading text-xl font-semibold text-foreground flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <span>Manage Homepage Testimonials</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, edit, or delete student and alumni success stories displayed in the dynamic testimonials slider.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="rounded-lg bg-primary hover:bg-primary-hover px-4 py-2.5 text-xs font-semibold text-white transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* Testimonials List Table */}
      <div className="overflow-hidden border border-slate-200 bg-white shadow-sm rounded-2xl">
        <table className="min-w-full divide-y divide-slate-200 text-left text-xs font-semibold text-slate-700">
          <thead className="bg-slate-50 text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 w-16">Order</th>
              <th className="px-6 py-3">Graduate</th>
              <th className="px-6 py-3">Affiliation</th>
              <th className="px-6 py-3 max-w-md">Quote</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {testimonials.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-slate-400 font-medium font-body">
                  No testimonials configured yet. Click &quot;Add Testimonial&quot; to begin.
                </td>
              </tr>
            ) : (
              testimonials.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-sans text-slate-400 font-semibold">
                    {t.order}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 font-heading font-semibold text-slate-900">
                    {t.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-500 font-medium font-body">
                    {t.role} at <span className="text-primary font-semibold">{t.company}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium font-body line-clamp-2 max-w-md">
                    &ldquo;{t.quote}&rdquo;
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(t)}
                      className="inline-flex items-center gap-1 text-slate-500 hover:text-primary transition-colors cursor-pointer px-2 py-1 border border-slate-200 hover:border-primary/20 bg-white rounded-md"
                    >
                      <Edit2 className="h-3 w-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(t.id, t.name)}
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

      {/* Add / Edit Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg border border-slate-200 bg-white p-6 shadow-lg animate-in zoom-in-95 duration-200 rounded-2xl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="font-heading text-sm font-semibold text-slate-900">
                {editTestimonial ? "Edit Testimonial" : "Create New Testimonial"}
              </h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-red-55 px-3 py-2 text-xs font-semibold text-red-650 border border-red-200 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs font-semibold text-slate-700">
              
              <div>
                <label className="block text-slate-500 mb-1">Graduate Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Lim"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800 focus:border-primary focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 mb-1">Job Role</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Software Engineer"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800 focus:border-primary focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Company / Institution</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. TechNova Solutions"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800 focus:border-primary focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Testimonial Quote</label>
                <textarea
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="Enter the graduate's quote here..."
                  rows={4}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800 focus:border-primary focus:outline-none font-body font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Display Order</label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800 focus:border-primary focus:outline-none"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-650 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-lg bg-primary hover:bg-primary-hover px-5 py-2.5 text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  {isPending ? "Saving..." : editTestimonial ? "Save Changes" : "Create Testimonial"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
