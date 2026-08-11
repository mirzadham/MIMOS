"use client";

import { useState, useTransition } from "react";
import {
  createCareerAction,
  updateCareerAction,
  deleteCareerAction,
} from "@/app/actions/careerActions";
import {
  createCareerOptionAction,
  updateCareerOptionAction,
  deleteCareerOptionAction,
} from "@/app/actions/careerOptionActions";
import { useToast } from "@/components/ui/toast";
import { useConfirm } from "@/components/ui/confirm-dialog";
import type { CareerOptionItem, CareerOptionKind } from "@/lib/db";
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
  Tag,
  Layers,
  Pencil,
  Check,
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
  initialOptions: CareerOptionItem[];
}

const KIND_TABS: { kind: CareerOptionKind; label: string; singular: string }[] = [
  { kind: "CATEGORY", label: "Categories", singular: "category" },
  { kind: "EMPLOYMENT_TYPE", label: "Employment Types", singular: "employment type" },
  { kind: "LOCATION_MODE", label: "Location Modes", singular: "location mode" },
];

export default function ManageCareersClient({
  initialCareers,
  initialOptions,
}: ManageCareersClientProps) {
  const [careers, setCareers] = useState<CareerItem[]>(initialCareers);
  const [options, setOptions] = useState<CareerOptionItem[]>(initialOptions);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("View all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCareer, setEditingCareer] = useState<CareerItem | null>(null);

  const [isPending, startTransition] = useTransition();
  const [isOptionPending, startOptionTransition] = useTransition();

  const { toast } = useToast();
  const confirm = useConfirm();

  // Options panel state
  const [activeOptionTab, setActiveOptionTab] =
    useState<CareerOptionKind>("CATEGORY");
  const [newOptionName, setNewOptionName] = useState("");
  const [editingOptionId, setEditingOptionId] = useState<string | null>(null);
  const [editingOptionName, setEditingOptionName] = useState("");

  // Hint shown when a legacy free-text value is replaced by a managed option
  const [legacyReplacedHint, setLegacyReplacedHint] = useState<string | null>(null);

  const optionsByKind = (kind: CareerOptionKind) =>
    options
      .filter((o) => o.kind === kind)
      .sort((a, b) => a.order - b.order);

  const categoryOptions = optionsByKind("CATEGORY");
  const employmentTypeOptions = optionsByKind("EMPLOYMENT_TYPE");
  const locationModeOptions = optionsByKind("LOCATION_MODE");

  const categoryNames = categoryOptions.map((o) => o.name);
  const employmentTypeNames = employmentTypeOptions.map((o) => o.name);
  const locationModeNames = locationModeOptions.map((o) => o.name);

  const filterCategories = ["View all", ...categoryNames];

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: categoryNames[0] ?? "Development",
    location: locationModeNames[0] ?? "Remote",
    employmentType: employmentTypeNames[0] ?? "Full-time",
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

  /**
   * Map a stored value onto the managed option list. Values that were typed
   * freely before options existed (e.g. "100% remote") fall back to the
   * closest managed option instead of leaving the select empty.
   */
  const normalizeToOption = (
    value: string,
    allowed: string[],
    fallback: string
  ): { value: string; replacedFrom: string | null } => {
    if (allowed.includes(value)) return { value, replacedFrom: null };
    if (fallback.toLowerCase() === "remote" && /remote/i.test(value)) {
      return { value: "Remote", replacedFrom: value };
    }
    return { value: allowed[0] ?? fallback, replacedFrom: value };
  };

  const openCreateModal = () => {
    setEditingCareer(null);
    setLegacyReplacedHint(null);
    setFormData({
      title: "",
      description: "",
      category: categoryNames[0] ?? "Development",
      location: locationModeNames[0] ?? "Remote",
      employmentType: employmentTypeNames[0] ?? "Full-time",
      applyUrl: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (career: CareerItem) => {
    setEditingCareer(career);
    const normalizedCategory = normalizeToOption(
      career.category,
      categoryNames,
      categoryNames[0] ?? "Development"
    );
    const normalizedEmployment = normalizeToOption(
      career.employmentType,
      employmentTypeNames,
      employmentTypeNames[0] ?? "Full-time"
    );
    const normalizedLocation = normalizeToOption(
      career.location,
      locationModeNames,
      locationModeNames[0] ?? "Remote"
    );
    setLegacyReplacedHint(
      normalizedLocation.replacedFrom
        ? `Location "${normalizedLocation.replacedFrom}" is not in the managed location modes; it will be saved as "${normalizedLocation.value}".`
        : normalizedEmployment.replacedFrom
        ? `Employment type "${normalizedEmployment.replacedFrom}" is not in the managed list; it will be saved as "${normalizedEmployment.value}".`
        : null
    );
    setFormData({
      title: career.title,
      description: career.description,
      category: normalizedCategory.value,
      location: normalizedLocation.value,
      employmentType: normalizedEmployment.value,
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

  // --- Career option management (categories / employment types / location modes) ---

  const activeTab = KIND_TABS.find((t) => t.kind === activeOptionTab) ?? KIND_TABS[0];

  const usageCount = (option: CareerOptionItem) => {
    if (option.kind === "CATEGORY") {
      return careers.filter((c) => c.category === option.name).length;
    }
    if (option.kind === "EMPLOYMENT_TYPE") {
      return careers.filter((c) => c.employmentType === option.name).length;
    }
    return careers.filter((c) => c.location === option.name).length;
  };

  const handleAddOption = () => {
    const name = newOptionName.trim();
    if (!name) {
      toast.error("Missing name", "Please enter an option name.");
      return;
    }
    startOptionTransition(async () => {
      const res = await createCareerOptionAction(activeOptionTab, name);
      if (res.success && res.data) {
        setOptions((prev) => [...prev, res.data]);
        setNewOptionName("");
        toast.success("Option added.", `"${res.data.name}" added to ${activeTab.label}.`);
      } else {
        toast.error("Failed to add option.", res.error);
      }
    });
  };

  const startRename = (option: CareerOptionItem) => {
    setEditingOptionId(option.id);
    setEditingOptionName(option.name);
  };

  const cancelRename = () => {
    setEditingOptionId(null);
    setEditingOptionName("");
  };

  const handleSaveRename = (option: CareerOptionItem) => {
    const name = editingOptionName.trim();
    if (!name) {
      toast.error("Missing name", "Option name cannot be empty.");
      return;
    }
    if (name === option.name) {
      cancelRename();
      return;
    }
    startOptionTransition(async () => {
      const res = await updateCareerOptionAction(option.id, name);
      if (res.success && res.data) {
        const newName = res.data.name;
        setOptions((prev) =>
          prev.map((o) => (o.id === option.id ? { ...o, name: newName } : o))
        );
        // Rebind careers that referenced the old name (mirrors the server-side updateMany)
        setCareers((prev) =>
          prev.map((c) => {
            if (option.kind === "CATEGORY" && c.category === option.name) {
              return { ...c, category: newName };
            }
            if (option.kind === "EMPLOYMENT_TYPE" && c.employmentType === option.name) {
              return { ...c, employmentType: newName };
            }
            if (option.kind === "LOCATION_MODE" && c.location === option.name) {
              return { ...c, location: newName };
            }
            return c;
          })
        );
        // Keep the active filter pill in sync
        if (option.kind === "CATEGORY" && selectedCategory === option.name) {
          setSelectedCategory(newName);
        }
        cancelRename();
        toast.success("Option renamed.", `Renamed to "${newName}".`);
      } else {
        toast.error("Failed to rename option.", res.error);
      }
    });
  };

  const handleDeleteOption = async (option: CareerOptionItem) => {
    const confirmed = await confirm({
      title: `Delete ${activeTab.singular}?`,
      message: `"${option.name}" will be permanently removed. Career positions using it must be updated first.`,
      confirmLabel: "Delete",
      danger: true,
      onConfirm: async () => {
        const res = await deleteCareerOptionAction(option.id);
        if (!res.success) throw new Error(res.error || "Failed to delete option.");
      },
    });
    if (!confirmed) return;
    setOptions((prev) => prev.filter((o) => o.id !== option.id));
    if (option.kind === "CATEGORY" && selectedCategory === option.name) {
      setSelectedCategory("View all");
    }
    toast.success("Option deleted.", `"${option.name}" removed.`);
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

      {/* Career Options Panel */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-slate-100">
          <div>
            <h2 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              Career Options
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Manage the categories, employment types and location modes used by the form below
              and the public careers page filters.
            </p>
          </div>
        </div>

        {/* Option Kind Tabs */}
        <div className="flex gap-1 px-5 pt-3 border-b border-slate-100 overflow-x-auto">
          {KIND_TABS.map((tab) => (
            <button
              key={tab.kind}
              onClick={() => {
                setActiveOptionTab(tab.kind);
                cancelRename();
              }}
              className={`inline-flex items-center gap-1.5 rounded-t-lg px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer border-b-2 ${
                activeOptionTab === tab.kind
                  ? "border-primary text-slate-900"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
              <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
                {optionsByKind(tab.kind).length}
              </span>
            </button>
          ))}
        </div>

        <div className="p-5 space-y-4">
          {/* Add Option Row */}
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newOptionName}
              onChange={(e) => setNewOptionName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddOption();
                }
              }}
              placeholder={`Add new ${activeTab.singular}...`}
              className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-900 focus:outline-2 focus:outline-primary"
            />
            <button
              onClick={handleAddOption}
              disabled={isOptionPending}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-all cursor-pointer disabled:opacity-50 shrink-0"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>

          {/* Option List */}
          <ul className="divide-y divide-slate-100 rounded-xl border border-slate-100">
            {optionsByKind(activeOptionTab).map((option) => {
              const inUse = usageCount(option);
              return (
                <li
                  key={option.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-3.5 py-2.5"
                >
                  {editingOptionId === option.id ? (
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <input
                        type="text"
                        autoFocus
                        value={editingOptionName}
                        onChange={(e) => setEditingOptionName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleSaveRename(option);
                          } else if (e.key === "Escape") {
                            cancelRename();
                          }
                        }}
                        className="flex-1 min-w-0 rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm text-slate-900 focus:outline-2 focus:outline-primary"
                      />
                      <button
                        onClick={() => handleSaveRename(option)}
                        disabled={isOptionPending}
                        title="Save name"
                        className="rounded-lg border border-slate-200 bg-white p-1.5 text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={cancelRename}
                        title="Cancel"
                        className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Tag className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="text-sm font-medium text-slate-800 truncate">
                          {option.name}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold shrink-0 ${
                            inUse > 0
                              ? "bg-primary/10 text-primary"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {inUse > 0 ? `${inUse} in use` : "Unused"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => startRename(option)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
                        >
                          <Pencil className="h-3 w-3 text-slate-500" />
                          Rename
                        </button>
                        <button
                          onClick={() => handleDeleteOption(option)}
                          disabled={isOptionPending}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50/50 px-2.5 py-1.5 text-[11px] font-semibold text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <Trash2 className="h-3 w-3 text-rose-600" />
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              );
            })}
            {optionsByKind(activeOptionTab).length === 0 && (
              <li className="px-3.5 py-6 text-center text-xs text-slate-500">
                No options yet — add one above.
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Filters & Search Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1">
          {filterCategories.map((cat) => (
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
                    {categoryOptions.map((opt) => (
                      <option key={opt.id} value={opt.name}>
                        {opt.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Employment Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.employmentType}
                    onChange={(e) =>
                      setFormData({ ...formData, employmentType: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-2 focus:outline-primary bg-white"
                  >
                    {employmentTypeOptions.map((opt) => (
                      <option key={opt.id} value={opt.name}>
                        {opt.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location Mode & Apply URL Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Location Mode <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-2 focus:outline-primary bg-white"
                  >
                    {locationModeOptions.map((opt) => (
                      <option key={opt.id} value={opt.name}>
                        {opt.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Microsoft Form Link <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://forms.office.com/r/..."
                    value={formData.applyUrl}
                    onChange={(e) => setFormData({ ...formData, applyUrl: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-2 focus:outline-primary"
                  />
                </div>
              </div>

              {/* Legacy value hint */}
              {legacyReplacedHint && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs text-amber-800">
                  {legacyReplacedHint}
                </div>
              )}

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
