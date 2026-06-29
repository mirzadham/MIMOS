"use client";

import { useState, useTransition } from "react";
import { 
  createProgramAction, 
  updateProgramAction, 
  deleteProgramAction,
  createCategoryAction
} from "@/app/actions/adminActions";
import { Plus, Edit2, Trash2, X, PlusCircle, ExternalLink, Calendar, MapPin } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Program {
  id: string;
  title: string;
  slug: string;
  description: string;
  syllabus: string;
  location: string;
  price: string | null;
  duration: string | null;
  dates: string | null;
  microsoftFormUrl: string;
  categoryId: string;
  category?: {
    name: string;
  };
  imageUrl?: string | null;
}

interface ManageProgramsClientProps {
  categories: Category[];
  programs: Program[];
}

export default function ManageProgramsClient({
  categories,
  programs,
}: ManageProgramsClientProps) {
  const [isPending, startTransition] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);
  const [editProgram, setEditProgram] = useState<Program | null>(null);

  // File Upload states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Category modal states
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const closeModal = () => {
    setModalOpen(false);
    setEditProgram(null);
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  const uploadToR2 = async (file: File): Promise<string> => {
    const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type)}`);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    setUploading(true);
    try {
      let uploadedUrl = "";
      if (selectedFile) {
        uploadedUrl = await uploadToR2(selectedFile);
      } else if (previewUrl) {
        uploadedUrl = previewUrl; // keep the existing image
      }

      const programData = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        syllabus: formData.get("syllabus") as string,
        location: formData.get("location") as string,
        price: formData.get("price") as string,
        duration: formData.get("duration") as string,
        dates: formData.get("dates") as string,
        microsoftFormUrl: formData.get("microsoftFormUrl") as string,
        categoryId: formData.get("categoryId") as string,
        imageUrl: uploadedUrl || undefined,
      };

      startTransition(async () => {
        if (editProgram) {
          await updateProgramAction(editProgram.id, programData);
        } else {
          await createProgramAction(programData);
        }
        closeModal();
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred during upload.";
      alert(message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this program?")) {
      startTransition(async () => {
        await deleteProgramAction(id);
      });
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    startTransition(async () => {
      await createCategoryAction(newCategoryName);
      setNewCategoryName("");
      setCategoryModalOpen(false);
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Action Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-slate-900">Manage Programs</h1>
          <p className="text-xs text-slate-500 mt-1">Publish, update, and categorize physical training runs.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCategoryModalOpen(true)}
            className="flex items-center gap-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add Category</span>
          </button>
          <button
            onClick={() => {
              setEditProgram(null);
              setPreviewUrl(null);
              setSelectedFile(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-1 rounded-md bg-primary hover:bg-primary-hover px-4 py-2.5 text-xs font-bold text-white transition-all hover:shadow-md cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Create Program</span>
          </button>
        </div>
      </div>

      {/* Program Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-slate-400 font-bold uppercase tracking-wider">
              <th className="px-6 py-3 font-semibold">Course Title</th>
              <th className="px-6 py-3 font-semibold">Category</th>
              <th className="px-6 py-3 font-semibold">Venue / Dates</th>
              <th className="px-6 py-3 font-semibold">Microsoft Form Link</th>
              <th className="px-6 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
            {programs.map((prog) => (
              <tr key={prog.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {prog.imageUrl && (
                      <img src={prog.imageUrl} alt={prog.title} className="w-10 h-10 rounded object-cover border border-slate-100 shrink-0" />
                    )}
                    <div>
                      <span className="font-bold text-slate-800 block text-sm">{prog.title}</span>
                      <span className="text-[10px] text-slate-400 font-medium block truncate max-w-xs mt-0.5">
                        {prog.description}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                    {prog.category?.name || "Upskilling"}
                  </span>
                </td>
                <td className="px-6 py-4 space-y-1">
                  <div className="flex gap-1 items-center">
                    <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                    <span className="truncate max-w-[120px]">{prog.location}</span>
                  </div>
                  <div className="flex gap-1 items-center text-slate-400">
                    <Calendar className="h-3 w-3 shrink-0" />
                    <span>{prog.dates || "Scheduled"}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <a
                    href={prog.microsoftFormUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-slate-500 hover:text-primary transition-colors hover:underline"
                  >
                    <span>Form Link</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => {
                        setEditProgram(prog);
                        setPreviewUrl(prog.imageUrl || null);
                        setSelectedFile(null);
                        setModalOpen(true);
                      }}
                      className="rounded p-1.5 border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                      title="Edit Course"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(prog.id)}
                      className="rounded p-1.5 border border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-150 transition-colors"
                      title="Delete Course"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Program Form Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center shrink-0">
              <h3 className="font-heading text-sm font-bold text-slate-900 uppercase">
                {editProgram ? "Edit Program Details" : "Create New Program"}
              </h3>
              <button 
                onClick={closeModal}
                className="rounded p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto text-xs font-body">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 col-span-2">
                  <label className="font-bold text-slate-700 uppercase block">Course Title</label>
                  <input
                    type="text"
                    name="title"
                    required
                    defaultValue={editProgram?.title || ""}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none"
                    placeholder="e.g. Advanced Wafer Fabrication"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase block">Category Selection</label>
                  <select
                    name="categoryId"
                    required
                    defaultValue={editProgram?.categoryId || ""}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 bg-white focus:border-primary focus:outline-none"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase block">Conduct Duration</label>
                  <input
                    type="text"
                    name="duration"
                    defaultValue={editProgram?.duration || ""}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none"
                    placeholder="e.g. 5 Days (Physical)"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase block">Short Description</label>
                <textarea
                  name="description"
                  required
                  rows={2}
                  defaultValue={editProgram?.description || ""}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none"
                  placeholder="Provide a quick summary of targets and scope..."
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase block">Detailed Syllabus (Markdown outline)</label>
                <textarea
                  name="syllabus"
                  required
                  rows={4}
                  defaultValue={editProgram?.syllabus || ""}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none font-mono"
                  placeholder="### Course Modules&#10;1. **Cleanroom Safety** (Day 1)&#10;- Clothes protocols"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 col-span-2">
                  <label className="font-bold text-slate-700 uppercase block">Microsoft Form URL (Redirection link)</label>
                  <input
                    type="url"
                    name="microsoftFormUrl"
                    required
                    defaultValue={editProgram?.microsoftFormUrl || ""}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none"
                    placeholder="https://forms.office.com/r/..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase block">Training Lab Location</label>
                  <input
                    type="text"
                    name="location"
                    required
                    defaultValue={editProgram?.location || ""}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none"
                    placeholder="e.g. MIMOS STC Cleanroom, Bukit Jalil"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase block">Course Fee Info</label>
                  <input
                    type="text"
                    name="price"
                    defaultValue={editProgram?.price || ""}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none"
                    placeholder="e.g. RM 4,500 / pax (HRD Corp claimable)"
                  />
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="font-bold text-slate-700 uppercase block">Active Batch Dates</label>
                  <input
                    type="text"
                    name="dates"
                    defaultValue={editProgram?.dates || ""}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none"
                    placeholder="e.g. 15th - 19th July 2026"
                  />
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="font-bold text-slate-700 uppercase block font-medium">Program Image / Poster (Cloudflare R2)</label>
                  <div className="flex items-center gap-4 border border-slate-200 rounded-md p-3 bg-slate-50/50">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedFile(file);
                          setPreviewUrl(URL.createObjectURL(file));
                        }
                      }}
                      className="text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                    />
                    {previewUrl && (
                      <div className="relative shrink-0 w-12 h-12 rounded border border-slate-200 overflow-hidden">
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            setPreviewUrl(null);
                          }}
                          className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5 hover:bg-black transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit panel */}
              <div className="border-t border-slate-100 pt-4 flex justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-md border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending || uploading}
                  className="rounded-md bg-primary hover:bg-primary-hover text-white px-4 py-2 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                >
                  {uploading ? "Uploading Image..." : isPending ? "Processing..." : editProgram ? "Save Changes" : "Create Program"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Category Creation Modal */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden p-6">
            <h3 className="font-heading text-sm font-bold text-slate-900 uppercase mb-4">Add Course Category</h3>
            <form onSubmit={handleAddCategory} className="space-y-4 text-xs font-body">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase block">Category Name</label>
                <input
                  type="text"
                  required
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none"
                  placeholder="e.g. Artificial Intelligence"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setNewCategoryName("");
                    setCategoryModalOpen(false);
                  }}
                  className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-md bg-primary hover:bg-primary-hover text-white px-3 py-1.5 text-xs font-bold transition-all cursor-pointer"
                >
                  {isPending ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
