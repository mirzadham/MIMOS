"use client";

import React, { useState, useTransition, useRef } from "react";
import { Plus, Edit2, Trash2, X, AlertCircle, Upload, Building2, Eye, ListPlus, Trash } from "lucide-react";
import { createFacilityAction, updateFacilityAction, deleteFacilityAction } from "@/app/actions/adminActions";

interface Facility {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  imageUrl: string | null;
  desc: string;
  specs: string[];
  order: number;
}

interface ManageFacilitiesClientProps {
  facilities: Facility[];
}

export default function ManageFacilitiesClient({ facilities }: ManageFacilitiesClientProps) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [editFacility, setEditFacility] = useState<Facility | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Form Fields
  const [index, setIndex] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [desc, setDesc] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [specs, setSpecs] = useState<{ label: string; content: string }[]>([{ label: "", content: "" }]);
  const [order, setOrder] = useState(0);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseSpecs = (specsArray: string[]) => {
    if (!specsArray || specsArray.length === 0) {
      return [{ label: "", content: "" }];
    }
    return specsArray.map(spec => {
      const idx = spec.indexOf(": ");
      if (idx === -1) {
        return { label: spec, content: "" };
      }
      const label = spec.substring(0, idx);
      const content = spec.substring(idx + 2);
      return { label, content };
    });
  };

  const handleClose = () => {
    if (imageUrl && imageUrl.startsWith("blob:")) {
      URL.revokeObjectURL(imageUrl);
    }
    setIsOpen(false);
  };

  const handleOpenAdd = () => {
    setEditFacility(null);
    setIndex(String(facilities.length + 1).padStart(2, "0"));
    setTitle("");
    setSubtitle("");
    setDesc("");
    setImageUrl("");
    setSpecs([{ label: "", content: "" }]);
    setOrder(facilities.length);
    setSelectedFile(null);
    setError(null);
    setIsOpen(true);
  };

  const handleOpenEdit = (fac: Facility) => {
    setEditFacility(fac);
    setIndex(fac.index);
    setTitle(fac.title);
    setSubtitle(fac.subtitle);
    setDesc(fac.desc);
    setImageUrl(fac.imageUrl || "");
    setSpecs(parseSpecs(fac.specs));
    setOrder(fac.order);
    setSelectedFile(null);
    setError(null);
    setIsOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError("Error: Facility image size exceeds 5MB limit.");
        if (e.target) e.target.value = "";
        return;
      }
      setSelectedFile(file);
      // Clean up previous blob URL if any
      if (imageUrl && imageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imageUrl);
      }
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleAddSpecRow = () => {
    setSpecs([...specs, { label: "", content: "" }]);
  };

  const handleRemoveSpecRow = (idx: number) => {
    setSpecs(specs.filter((_, i) => i !== idx));
  };

  const handleSpecChange = (idx: number, field: "label" | "content", val: string) => {
    const updated = [...specs];
    updated[idx][field] = val;
    setSpecs(updated);
  };

  const uploadToR2 = async (file: File): Promise<string> => {
    const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type)}&prefix=facilities`);
    if (!res.ok) {
      throw new Error("Failed to get upload signature");
    }
    const { uploadUrl, publicUrl } = await res.json();

    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!uploadRes.ok) {
      throw new Error("Failed to upload image to storage");
    }
    return publicUrl;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!index.trim() || !title.trim() || !subtitle.trim() || !desc.trim()) {
      setError("Please fill in all basic fields.");
      return;
    }

    setUploading(true);
    setError(null);

    const run = async () => {
      let finalImageUrl = imageUrl;
      try {
        if (selectedFile) {
          finalImageUrl = await uploadToR2(selectedFile);
        }

        // Format specs
        const formattedSpecs = specs
          .filter(s => s.label.trim() || s.content.trim())
          .map(s => {
            const lbl = s.label.trim();
            const val = s.content.trim();
            if (lbl && val) return `${lbl}: ${val}`;
            return lbl || val;
          });

        startTransition(async () => {
          try {
            const dataObj = {
              index,
              title,
              subtitle,
              imageUrl: finalImageUrl || null,
              desc,
              specs: formattedSpecs,
              order
            };

            if (editFacility) {
              const res = await updateFacilityAction(editFacility.id, dataObj);
              if (!res.success) throw new Error("Failed to update facility.");
            } else {
              const res = await createFacilityAction(dataObj);
              if (!res.success) throw new Error("Failed to create facility.");
            }
            handleClose();
          } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred.");
          } finally {
            setUploading(false);
          }
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Image upload failed.");
        setUploading(false);
      }
    };

    run();
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the facility: "${name}"?`)) return;

    startTransition(async () => {
      try {
        const res = await deleteFacilityAction(id);
        if (!res.success) throw new Error("Failed to delete facility.");
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
            <Building2 className="h-5 w-5 text-primary" />
            <span>Manage Facilities</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, edit, or delete technical research environments and lab spaces on the public website.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="rounded-lg bg-primary hover:bg-primary-hover px-4 py-2.5 text-xs font-semibold text-white transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Facility</span>
        </button>
      </div>

      {/* Facilities List Table */}
      <div className="overflow-hidden border border-slate-200 bg-white shadow-sm rounded-2xl">
        <table className="min-w-full divide-y divide-slate-200 text-left text-xs font-semibold text-slate-700">
          <thead className="bg-slate-50 text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 w-16">Index</th>
              <th className="px-6 py-3 w-28">Image</th>
              <th className="px-6 py-3">Facility Title / Subtitle</th>
              <th className="px-6 py-3">Specs Count</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {facilities.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-slate-400 font-medium font-body">
                  No facilities configured yet. Click &quot;Add New Facility&quot; to begin.
                </td>
              </tr>
            ) : (
              facilities.map((fac) => (
                <tr key={fac.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="whitespace-nowrap px-6 py-4 font-heading text-base font-semibold text-slate-900">
                    {fac.index}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="relative h-12 w-20 rounded-md overflow-hidden bg-slate-100 border border-slate-200">
                      {fac.imageUrl ? (
                        <img
                          src={fac.imageUrl}
                          alt={fac.title}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-slate-350 bg-slate-50">
                          <Eye className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-heading text-sm font-semibold text-slate-900">{fac.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{fac.subtitle}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-body font-medium">
                    {fac.specs.length} specs
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(fac)}
                      className="inline-flex items-center gap-1 text-slate-500 hover:text-primary transition-colors cursor-pointer px-2 py-1 border border-slate-200 hover:border-primary/20 bg-white rounded-md"
                    >
                      <Edit2 className="h-3 w-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(fac.id, fac.title)}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in overflow-y-auto">
          <div className="my-8 w-full max-w-xl bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col rounded-2xl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50">
              <h2 className="font-heading text-sm font-semibold text-slate-900 uppercase tracking-wider">
                {editFacility ? "Edit Facility" : "Add Facility"}
              </h2>
              <button
                onClick={handleClose}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {error && (
                <div className="flex gap-2 rounded-lg border border-red-150 bg-red-50 p-3 text-xs text-red-700 font-medium">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                {/* Index Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Index (e.g. 01)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 01"
                    value={index}
                    onChange={(e) => setIndex(e.target.value)}
                    className="w-full border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:border-primary focus:outline-none placeholder-slate-300 font-heading font-semibold rounded-lg"
                  />
                </div>

                {/* Display Order Input */}
                <div className="space-y-1.5 col-span-2">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Display Order (sorting)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 0"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:border-primary focus:outline-none placeholder-slate-300 font-heading rounded-lg"
                  />
                </div>
              </div>

              {/* Title Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Facility Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Semiconductor Technology Centre (STC)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:border-primary focus:outline-none placeholder-slate-300 font-heading font-semibold rounded-lg"
                />
              </div>

              {/* Subtitle Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Subtitle
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wafer Fabrication & Microelectronics R&D"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:border-primary focus:outline-none placeholder-slate-300 font-body font-medium rounded-lg"
                />
              </div>

              {/* Image Input (File Selection) */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Facility Cover Image
                </label>
                <div className="flex gap-4 items-center">
                  <div className="relative h-20 w-32 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-slate-400">
                        <Upload className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-xs font-semibold text-slate-700 rounded-lg cursor-pointer flex items-center gap-1.5"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>Upload New Image</span>
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <input
                      type="text"
                      placeholder="Or enter public image URL directly"
                      value={imageUrl}
                      onChange={(e) => {
                        setSelectedFile(null);
                        setImageUrl(e.target.value);
                      }}
                      className="w-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] text-slate-700 focus:border-primary focus:outline-none placeholder-slate-300 font-mono rounded-md"
                    />
                  </div>
                </div>
              </div>

              {/* Description textarea */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the facility resources and capacity..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:border-primary focus:outline-none placeholder-slate-300 font-body font-medium rounded-lg"
                />
              </div>

              {/* Specifications Dynamic List */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Specifications & Capabilities List
                  </span>
                  <button
                    type="button"
                    onClick={handleAddSpecRow}
                    className="inline-flex items-center gap-1 text-[10px] text-primary hover:text-primary-hover font-semibold"
                  >
                    <ListPlus className="h-3.5 w-3.5" />
                    <span>Add Spec Item</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {specs.length === 0 ? (
                    <div className="text-center text-slate-400 text-xs py-2">
                      No specs added. Click &quot;Add Spec Item&quot; to define technical details.
                    </div>
                  ) : (
                    specs.map((spec, sIdx) => (
                      <div key={sIdx} className="flex gap-2 items-center">
                        <div className="w-6 text-[10px] font-semibold text-slate-400 text-center shrink-0">
                          {`0${sIdx + 1}`}
                        </div>
                        <input
                          type="text"
                          placeholder="Label (e.g. Cleanroom Class)"
                          value={spec.label}
                          onChange={(e) => handleSpecChange(sIdx, "label", e.target.value)}
                          className="w-[35%] border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:border-primary focus:outline-none placeholder-slate-300 rounded-md font-semibold"
                        />
                        <span className="text-slate-400">—</span>
                        <input
                          type="text"
                          placeholder="Detail value (e.g. Certified Class 10)"
                          value={spec.content}
                          onChange={(e) => handleSpecChange(sIdx, "content", e.target.value)}
                          className="flex-1 border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:border-primary focus:outline-none placeholder-slate-300 rounded-md font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSpecRow(sIdx)}
                          className="text-slate-400 hover:text-red-500 p-1 rounded-md hover:bg-slate-50 transition-colors shrink-0"
                        >
                          <Trash className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 border border-slate-250 text-xs font-semibold text-slate-650 transition-colors cursor-pointer rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending || uploading}
                  className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-xs font-semibold text-white transition-colors cursor-pointer rounded-lg"
                >
                  {isPending || uploading ? "Saving..." : editFacility ? "Save Changes" : "Create Facility"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
