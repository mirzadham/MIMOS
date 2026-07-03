"use client";

import React, { useState, useTransition, useRef } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, X, Sparkles, AlertCircle, Upload } from "lucide-react";
import { 
  createWhyChooseUsCardAction, 
  updateWhyChooseUsCardAction, 
  deleteWhyChooseUsCardAction 
} from "@/app/actions/adminActions";

interface WhyChooseUsCard {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  colspan: number;
  order: number;
}

interface ManageWhyChooseUsClientProps {
  cards: WhyChooseUsCard[];
}

const getAlignmentClasses = (order: number) => {
  const mod = order % 4;
  switch (mod) {
    case 0:
      // Top Left
      return {
        container: "justify-start items-start",
        text: "text-left items-start"
      };
    case 1:
      // Bottom Left
      return {
        container: "justify-end items-start",
        text: "text-left items-start"
      };
    case 2:
      // Top Right
      return {
        container: "justify-start items-end",
        text: "text-right items-end"
      };
    case 3:
      // Bottom Right
      return {
        container: "justify-end items-end",
        text: "text-right items-end"
      };
    default:
      return {
        container: "justify-start items-start",
        text: "text-left items-start"
      };
  }
};

export default function ManageWhyChooseUsClient({ cards }: ManageWhyChooseUsClientProps) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [editCard, setEditCard] = useState<WhyChooseUsCard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [colspan, setColspan] = useState(1);
  const [order, setOrder] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const revokeObjectURL = () => {
    if (imageUrl && imageUrl.startsWith("blob:")) {
      URL.revokeObjectURL(imageUrl);
    }
  };

  const handleOpenAdd = () => {
    revokeObjectURL();
    setEditCard(null);
    setTitle("");
    setDescription("");
    setImageUrl(null);
    setColspan(1);
    // Suggest the next order index
    const nextOrder = cards.length > 0 ? Math.max(...cards.map(c => c.order)) + 1 : 0;
    setOrder(nextOrder);
    setSelectedFile(null);
    setError(null);
    setIsOpen(true);
  };

  const handleOpenEdit = (card: WhyChooseUsCard) => {
    revokeObjectURL();
    setEditCard(card);
    setTitle(card.title);
    setDescription(card.description);
    setImageUrl(card.imageUrl);
    setColspan(card.colspan);
    setOrder(card.order);
    setSelectedFile(null);
    setError(null);
    setIsOpen(true);
  };

  const handleClose = () => {
    revokeObjectURL();
    setIsOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      revokeObjectURL();
      // Create local URL for preview
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const uploadToR2 = async (file: File): Promise<string> => {
    const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type)}&prefix=whychooseus`);
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
    if (!title.trim() || !description.trim()) {
      setError("Please fill in the title and description fields.");
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

        startTransition(async () => {
          try {
            const dataPayload = {
              title,
              description,
              imageUrl: finalImageUrl,
              colspan,
              order
            };

            if (editCard) {
              const res = await updateWhyChooseUsCardAction(editCard.id, dataPayload);
              if (!res.success) throw new Error("Failed to update card.");
            } else {
              const res = await createWhyChooseUsCardAction(dataPayload);
              if (!res.success) throw new Error("Failed to create card.");
            }
            revokeObjectURL();
            setIsOpen(false);
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

  const handleDelete = (id: string, cardTitle: string) => {
    if (!confirm(`Are you sure you want to delete the card: "${cardTitle}"?`)) return;

    startTransition(async () => {
      try {
        const res = await deleteWhyChooseUsCardAction(id);
        if (!res.success) throw new Error("Failed to delete card.");
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
            <Sparkles className="h-5 w-5 text-primary" />
            <span>Manage Why Choose Us Bento Cards</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Maintain the dynamic cards displayed in the homepage Bento grid.
          </p>
        </div>
        
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-primary hover:bg-primary/95 text-white px-4 py-2.5 text-xs font-bold transition-all shadow-sm shadow-primary/10"
        >
          <Plus className="h-4 w-4" />
          <span>Add Card</span>
        </button>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => {
          const align = getAlignmentClasses(card.order);
          return (
            <div 
              key={card.id} 
              className={`group relative border border-slate-200 bg-slate-950 rounded-xl p-5 flex flex-col overflow-hidden min-h-[260px] hover:border-primary/60 hover:shadow-[0_0_20px_rgba(167,33,144,0.1)] transition-all shadow-sm ${
                card.colspan === 2 ? "md:col-span-2" : "md:col-span-1"
              } ${align.container}`}
            >
              {/* Background Image / Placeholder */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                {card.imageUrl ? (
                  <Image 
                    src={card.imageUrl} 
                    alt={card.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-w-768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#2a0a25] via-[#100318] to-slate-950 flex items-center justify-center">
                    <span className="text-[9px] font-bold text-slate-500 tracking-wider uppercase font-sans">[Placeholder Image]</span>
                  </div>
                )}
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-[#3a0b33]/25 to-[#10000e]/95 z-10" />
              </div>

              {/* Floating Content */}
              <div className={`relative z-20 space-y-3 flex flex-col w-full ${align.text}`}>
                {/* Badge for Order and Colspan */}
                <div className="flex items-center justify-between w-full">
                  <span className="inline-flex items-center rounded-md bg-slate-900/80 border border-slate-700/60 px-2 py-0.5 text-[9px] font-bold text-slate-400">
                    Order: {card.order}
                  </span>
                  <span className="inline-flex items-center rounded-md bg-primary/20 border border-primary/30 px-2 py-0.5 text-[9px] font-bold text-white font-sans">
                    Colspan: {card.colspan}
                  </span>
                </div>

                {/* Title & Desc */}
                <h3 className="font-heading font-extrabold text-white text-sm">{card.title}</h3>
                <p className="text-[11px] text-slate-300 leading-relaxed font-body mt-2 line-clamp-3">{card.description}</p>
              </div>

            {/* Actions Footer */}
            <div className="relative z-20 flex items-center gap-2 mt-5 pt-3 border-t border-slate-800/80 justify-end">
              <button
                onClick={() => handleOpenEdit(card)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
                title="Edit Card"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => handleDelete(card.id, card.title)}
                disabled={isPending}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-red-50 hover:border-red-200 text-slate-600 hover:text-red-650 transition-colors"
                title="Delete Card"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        );
      })}
      </div>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full overflow-hidden shadow-xl animate-scale-up">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-heading font-extrabold text-slate-900 text-sm">
                {editCard ? "Edit Bento Card" : "Add Bento Card"}
              </h2>
              <button 
                onClick={handleClose}
                className="h-7 w-7 rounded-lg hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2.5 text-xs font-semibold text-red-600">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              {/* Title input */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 block uppercase">Card Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Applied Learning & Lab Research"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-none transition-colors"
                  required
                />
              </div>

              {/* Description input */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 block uppercase">Card Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe this academy advantage..."
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-none transition-colors resize-none leading-relaxed"
                  required
                />
              </div>

              {/* Grid Layout Configuration */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 block uppercase">Bento Grid Span</label>
                  <select
                    value={colspan}
                    onChange={(e) => setColspan(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 focus:border-primary focus:outline-none transition-colors"
                  >
                    <option value={1}>1 Column Span (Narrow)</option>
                    <option value={2}>2 Column Span (Wide)</option>
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 block uppercase">Display Order Index</label>
                  <input 
                    type="number" 
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 focus:border-primary focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Image Upload Block */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 block uppercase">Card Image</label>
                <div className="flex gap-4 items-center">
                  {/* Preview box */}
                  <div className="relative h-20 w-32 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                    {imageUrl ? (
                      <Image src={imageUrl} alt="preview" fill className="object-cover" />
                    ) : (
                      <span className="text-[9px] font-bold text-slate-400 uppercase">No Image</span>
                    )}
                  </div>
                  
                  {/* File Selector */}
                  <div className="flex flex-col gap-1.5">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3 py-2 text-xs font-bold transition-all shadow-xs shrink-0"
                    >
                      <Upload className="h-3.5 w-3.5 text-slate-400" />
                      <span>{selectedFile ? "Change File" : "Select Image File"}</span>
                    </button>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {selectedFile ? selectedFile.name : "Optional. If not provided, a placeholder will be displayed."}
                    </span>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-4 border-t border-slate-100 justify-end">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-600 transition-colors"
                  disabled={uploading || isPending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || isPending}
                  className="rounded-lg bg-primary hover:bg-primary/95 text-white px-5 py-2.5 text-xs font-bold transition-all shadow-sm shadow-primary/10 flex items-center gap-2"
                >
                  {(uploading || isPending) ? (
                    <>
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
