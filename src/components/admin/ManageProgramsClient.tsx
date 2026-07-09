"use client";

import { useState, useTransition } from "react";
import { 
  createProgramAction, 
  updateProgramAction, 
  deleteProgramAction,
  createCategoryAction
} from "@/app/actions/adminActions";
import { Plus, Edit2, Trash2, X, PlusCircle, ExternalLink, Calendar, MapPin } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
  imageUrls?: string[] | null;
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
  const [posters, setPosters] = useState<PosterItem[]>([]);
  const [uploading, setUploading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setPosters((prev) => {
        const oldIndex = prev.findIndex((p) => p.id === active.id);
        const newIndex = prev.findIndex((p) => p.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  // Category modal states
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const closeModal = () => {
    setModalOpen(false);
    setEditProgram(null);
    setPosters([]);
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
      const uploadedUrls = await Promise.all(
        posters.map(async (poster) => {
          if (poster.file) {
            return await uploadToR2(poster.file);
          }
          return poster.url;
        })
      );

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
        imageUrl: uploadedUrls[0] || undefined,
        imageUrls: uploadedUrls,
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
          <h1 className="font-heading text-2xl font-semibold text-slate-900">Manage Programs</h1>
          <p className="text-xs text-slate-500 mt-1">Publish, update, and categorize physical training runs.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCategoryModalOpen(true)}
            className="flex items-center gap-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-700 transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add Category</span>
          </button>
          <button
            onClick={() => {
              setEditProgram(null);
              setPosters([]);
              setModalOpen(true);
            }}
            className="flex items-center gap-1 rounded-md bg-primary hover:bg-primary-hover px-4 py-2.5 text-xs font-semibold text-white transition-all hover:shadow-md cursor-pointer"
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
            <tr className="border-b border-slate-100 bg-slate-50 text-slate-400 font-semibold uppercase tracking-wider">
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
                    {((prog.imageUrls && prog.imageUrls.length > 0) ? prog.imageUrls[0] : prog.imageUrl) && (
                      <img
                        src={(prog.imageUrls && prog.imageUrls.length > 0) ? prog.imageUrls[0]! : prog.imageUrl!}
                        alt={prog.title}
                        className="w-10 h-10 rounded object-cover border border-slate-100 shrink-0"
                      />
                    )}
                    <div>
                      <span className="font-semibold text-slate-800 block text-sm">{prog.title}</span>
                      <span className="text-[10px] text-slate-400 font-medium block truncate max-w-xs mt-0.5">
                        {prog.description}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
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
                        const initialPosters = prog.imageUrls && prog.imageUrls.length > 0
                          ? prog.imageUrls.map((url, idx) => ({ id: `existing-${idx}-${url}`, url }))
                          : prog.imageUrl
                            ? [{ id: `existing-0-${prog.imageUrl}`, url: prog.imageUrl }]
                            : [];
                        setPosters(initialPosters);
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
              <h3 className="font-heading text-sm font-semibold text-slate-900 uppercase">
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
                  <label className="font-semibold text-slate-700 uppercase block">Course Title</label>
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
                  <label className="font-semibold text-slate-700 uppercase block">Category Selection</label>
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
                  <label className="font-semibold text-slate-700 uppercase block">Conduct Duration</label>
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
                <label className="font-semibold text-slate-700 uppercase block">Short Description</label>
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
                <label className="font-semibold text-slate-700 uppercase block">Detailed Syllabus (Markdown outline)</label>
                <textarea
                  name="syllabus"
                  required
                  rows={4}
                  defaultValue={editProgram?.syllabus || ""}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none font-sans"
                  placeholder="### Course Modules&#10;1. **Cleanroom Safety** (Day 1)&#10;- Clothes protocols"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 col-span-2">
                  <label className="font-semibold text-slate-700 uppercase block">Microsoft Form URL (Redirection link)</label>
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
                  <label className="font-semibold text-slate-700 uppercase block">Training Lab Location</label>
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
                  <label className="font-semibold text-slate-700 uppercase block">Course Fee Info</label>
                  <input
                    type="text"
                    name="price"
                    defaultValue={editProgram?.price || ""}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none"
                    placeholder="e.g. RM 4,500 / pax (HRD Corp claimable)"
                  />
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="font-semibold text-slate-700 uppercase block">Active Batch Dates</label>
                  <input
                    type="text"
                    name="dates"
                    defaultValue={editProgram?.dates || ""}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none"
                    placeholder="e.g. 15th - 19th July 2026"
                  />
                </div>

                <div className="space-y-1 col-span-2">
                  <div className="flex justify-between items-center">
                    <label className="font-semibold text-slate-700 uppercase block font-medium">
                      Program Image / Poster Pages (Cloudflare R2)
                    </label>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">
                      {posters.length} / 5 Pages
                    </span>
                  </div>

                  <div className="border-2 border-dashed border-slate-200 hover:border-primary rounded-xl p-4 bg-slate-50/50 transition-colors flex flex-col items-center justify-center relative min-h-[100px] group/drop">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      disabled={posters.length >= 5}
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        if (posters.length + files.length > 5) {
                          alert("You can only upload up to 5 poster pages in total.");
                          return;
                        }
                        const newPosters = files.map((file) => {
                          const id = `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                          const url = URL.createObjectURL(file);
                          return { id, url, file };
                        });
                        setPosters((prev) => [...prev, ...newPosters]);
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                    />
                    <div className="text-center space-y-1 flex flex-col items-center">
                      <PlusCircle className="h-6 w-6 text-slate-400 group-hover/drop:text-primary transition-colors" />
                      <span className="text-[11px] font-semibold text-slate-700">Click or Drag & Drop to Upload Poster Pages</span>
                      <span className="text-[9px] text-slate-400">PNG, JPG, or WEBP up to 5 pages. Drag to sort pages.</span>
                    </div>
                  </div>

                  {posters.length > 0 && (
                    <div className="mt-4 border border-slate-100 bg-white rounded-xl p-3 shadow-inner">
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                      >
                        <SortableContext
                          items={posters.map(p => p.id)}
                          strategy={rectSortingStrategy}
                        >
                          <div className="grid grid-cols-3 gap-3">
                            {posters.map((poster, index) => (
                              <SortablePosterCard
                                key={poster.id}
                                poster={poster}
                                index={index}
                                onRemove={(id) => {
                                  setPosters((prev) => {
                                    const item = prev.find(p => p.id === id);
                                    if (item?.file) {
                                      URL.revokeObjectURL(item.url);
                                    }
                                    return prev.filter(p => p.id !== id);
                                  });
                                }}
                              />
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit panel */}
              <div className="border-t border-slate-100 pt-4 flex justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-md border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending || uploading}
                  className="rounded-md bg-primary hover:bg-primary-hover text-white px-4 py-2 text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer"
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
            <h3 className="font-heading text-sm font-semibold text-slate-900 uppercase mb-4">Add Course Category</h3>
            <form onSubmit={handleAddCategory} className="space-y-4 text-xs font-body">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 uppercase block">Category Name</label>
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
                  className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-md bg-primary hover:bg-primary-hover text-white px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer"
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

interface PosterItem {
  id: string;
  url: string;
  file?: File;
}

interface SortablePosterCardProps {
  poster: PosterItem;
  index: number;
  onRemove: (id: string) => void;
}

function SortablePosterCard({ poster, index, onRemove }: SortablePosterCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: poster.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group flex flex-col bg-slate-50 border rounded-lg overflow-hidden transition-all select-none ${
        isDragging ? "border-primary shadow-lg scale-102 cursor-grabbing animate-pulse" : "border-slate-200 cursor-grab hover:border-slate-350"
      }`}
    >
      <div 
        {...attributes} 
        {...listeners} 
        className="w-full aspect-[4/3] bg-slate-100 relative overflow-hidden"
      >
        <img 
          src={poster.url} 
          alt={`Poster Page ${index + 1}`} 
          className="w-full h-full object-cover pointer-events-none" 
        />
        <div className="absolute top-2 left-2 bg-slate-900/75 backdrop-blur-md text-white text-[9px] font-semibold px-1.5 py-0.5 rounded uppercase font-sans">
          Page {index + 1} {index === 0 && "(Cover)"}
        </div>
      </div>
      <button
        type="button"
        onClick={() => onRemove(poster.id)}
        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 z-10 cursor-pointer shadow-sm"
        title="Delete Page"
      >
        <X className="h-3 w-3" />
      </button>
      <div 
        {...attributes}
        {...listeners}
        className="p-2 text-[10px] text-slate-500 font-semibold truncate bg-white border-t border-slate-100"
      >
        {poster.file ? poster.file.name : "Uploaded Poster"}
      </div>
    </div>
  );
}
