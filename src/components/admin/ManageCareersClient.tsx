"use client";

import { useState, useTransition } from "react";
import {
  createCareerAction,
  updateCareerAction,
  deleteCareerAction,
} from "@/app/actions/careerActions";
import { CAREER_CATEGORIES } from "@/data/careersData";
import { useToast } from "@/components/ui/toast";
import { useConfirm } from "@/components/ui/confirm-dialog";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  MapPin,
  Clock,
  Briefcase,
  Search,
  ExternalLink,
} from "lucide-react";

export interface CareerItem {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  employmentType: string;
  applyUrl?: string | null;
}

interface ManageCareersClientProps {
  initialCareers: CareerItem[];
}

export default function ManageCareersClient({
  initialCareers,
}: ManageCareersClientProps) {
  const [careers, setCareers] = useState<CareerItem[]>(initialCareers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("View all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCareer, setEditingCareer] = useState<CareerItem | null>(null);

  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();
  const confirm = useConfirm();

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Development",
    location: "100% remote",
    employmentType: "Full-time",
    applyUrl: "",
  });

  const filteredCareers = careers.filter((c) => {
    const matchesCategory =
      selectedCategory === "View all" || c.category === selectedCategory;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openCreateModal = () => {
    setEditingCareer(null);
    setFormData({
      title: "",
      description: "",
      category: "Development",
      location: "100% remote",
      employmentType: "Full-time",
      applyUrl: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (career: CareerItem) => {
    setEditingCareer(career);
    setFormData({
      title: career.title,
      description: career.description,
      category: career.category,
      location: career.location,
      employmentType: career.employmentType,
      applyUrl: career.applyUrl || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      toast.error("Missing required fields", "Please fill in job title and description.");
      return;
    }

    startTransition(async () => {
      if (editingCareer) {
        // Update Action
        const res = await updateCareerAction(editingCareer.id, formData);
        if (res.success && res.data) {
          setCareers((prev) =>
            prev.map((item) =>
              item.id === editingCareer.id
                ? { ...item, ...formData, applyUrl: formData.applyUrl || null }
                : item
            )
          );
          toast.success("Career listing updated.");
          setIsModalOpen(false);
        } else {
          toast.error("Failed to update career listing.", res.error);
        }
      } else {
        // Create Action
        const res = await createCareerAction(formData);
        if (res.success && res.data) {
          setCareers((prev) => [
            {
              id: res.data.id,
              title: res.data.title,
              description: res.data.description,
              category: res.data.category,
              location: res.data.location,
              employmentType: res.data.employmentType,
              applyUrl: res.data.applyUrl,
            },
            ...prev,
          ]);
          toast.success("Career position created.");
          setIsModalOpen(false);
        } else {
          toast.error("Failed to create career position.", res.error);
        }
      }
    });
  };

  const handleDelete = async (career: CareerItem) => {
    const confirmed = await confirm({
      title: "Delete career position?",
      message: `"${career.title}" will be permanently removed from the careers page.`,
      confirmLabel: "Delete",
      danger: true,
      onConfirm: async () => {
        const res = await deleteCareerAction(career.id);
        if (!res.success) throw new Error(res.error || "Failed to delete career position.");
      },
    });
    if (!confirmed) return;
    setCareers((prev) => prev.filter((item) => item.id !== career.id));
    toast.success("Career position deleted.");
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2.5">
            <Briefcase className="h-7 w-7 text-primary" />
            Manage Career Listings
          </h1>
          <p className="mt-1 text-sm text-slate-600 font-sans">
            Create, update, and publish open positions for the MIMOS Academy Careers portal.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover transition-all cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Position</span>
        </button>
      </div>

      {/* Filters & Search Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1">
          {CAREER_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search job title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-2 focus:outline-primary"
          />
        </div>
      </div>

      {/* Career Listings Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        {filteredCareers.length > 0 ? (
          <div className="divide-y divide-slate-200">
            {filteredCareers.map((career) => (
              <div
                key={career.id}
                className="p-5 sm:p-6 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Info Column */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="font-heading text-lg font-bold text-slate-900">
                      {career.title}
                    </h3>
                    <span className="rounded-full bg-slate-100 text-slate-700 px-2.5 py-0.5 text-[11px] font-semibold border border-slate-200 uppercase tracking-wider">
                      {career.category}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans line-clamp-2">
                    {career.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 border border-slate-200 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      {career.location}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 border border-slate-200 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                      <Clock className="h-3 w-3 text-slate-400" />
                      {career.employmentType}
                    </span>
                    {career.applyUrl && (
                      <a
                        href={career.applyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline ml-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Apply Link
                      </a>
                    )}
                  </div>
                </div>

                {/* Actions Column */}
                <div className="flex items-center gap-2 pt-2 md:pt-0 shrink-0">
                  <button
                    onClick={() => openEditModal(career)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    <Edit2 className="h-3.5 w-3.5 text-slate-500" />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(career)}
                    disabled={isPending}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50/50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-rose-600" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Briefcase className="mx-auto h-10 w-10 text-slate-300" />
            <h3 className="mt-3 text-sm font-semibold text-slate-800">
              No career listings found
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Try adjusting your search query or create a new job position.
            </p>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="font-heading text-xl font-bold text-slate-900">
                {editingCareer ? "Edit Career Position" : "Create New Career Position"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Job Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Job Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Full Stack Developer"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-2 focus:outline-primary"
                />
              </div>

              {/* Category & Employment Type Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-2 focus:outline-primary bg-white"
                  >
                    {CAREER_CATEGORIES.filter((c) => c !== "View all").map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Employment Type <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Full-time, Part-time"
                    value={formData.employmentType}
                    onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-2 focus:outline-primary"
                  />
                </div>
              </div>

              {/* Location & Apply URL Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Location <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 100% remote or Kuala Lumpur"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-2 focus:outline-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Apply URL or Mailto Link
                  </label>
                  <input
                    type="text"
                    placeholder="mailto:careers@mimos.my or Form URL"
                    value={formData.applyUrl}
                    onChange={(e) => setFormData({ ...formData, applyUrl: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-2 focus:outline-primary"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Job Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe key responsibilities and expectations for this role..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-2 focus:outline-primary"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-white hover:bg-primary-hover transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isPending
                    ? "Saving..."
                    : editingCareer
                    ? "Save Changes"
                    : "Create Position"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
