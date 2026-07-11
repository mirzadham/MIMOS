"use client";

import React, { useState, useTransition, useRef } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, X, Handshake, AlertCircle, Upload } from "lucide-react";
import { createPartnerAction, updatePartnerAction, deletePartnerAction } from "@/app/actions/adminActions";

interface Partner {
  id: string;
  name: string;
  logoUrl: string;
}

interface ManagePartnersClientProps {
  partners: Partner[];
}

export default function ManagePartnersClient({ partners }: ManagePartnersClientProps) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [editPartner, setEditPartner] = useState<Partner | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenAdd = () => {
    setEditPartner(null);
    setName("");
    setLogoUrl("");
    setSelectedFile(null);
    setError(null);
    setIsOpen(true);
  };

  const handleOpenEdit = (partner: Partner) => {
    setEditPartner(partner);
    setName(partner.name);
    setLogoUrl(partner.logoUrl);
    setSelectedFile(null);
    setError(null);
    setIsOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError("Error: Logo file size exceeds 5MB limit.");
        if (e.target) e.target.value = "";
        return;
      }
      setSelectedFile(file);
      // Create local URL for preview
      setLogoUrl(URL.createObjectURL(file));
    }
  };

  const uploadToR2 = async (file: File): Promise<string> => {
    const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type)}&prefix=partners`);
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
    if (!name.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (!logoUrl && !selectedFile) {
      setError("Please select a partner logo image.");
      return;
    }

    setUploading(true);
    setError(null);

    const run = async () => {
      let finalLogoUrl = logoUrl;
      try {
        if (selectedFile) {
          finalLogoUrl = await uploadToR2(selectedFile);
        }

        startTransition(async () => {
          try {
            if (editPartner) {
              const res = await updatePartnerAction(editPartner.id, { name, logoUrl: finalLogoUrl });
              if (!res.success) throw new Error("Failed to update partner.");
            } else {
              const res = await createPartnerAction({ name, logoUrl: finalLogoUrl });
              if (!res.success) throw new Error("Failed to create partner.");
            }
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

  const handleDelete = (id: string, partnerName: string) => {
    if (!confirm(`Are you sure you want to delete the partner: "${partnerName}"?`)) return;

    startTransition(async () => {
      try {
        const res = await deletePartnerAction(id);
        if (!res.success) throw new Error("Failed to delete partner.");
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
            <Handshake className="h-5 w-5 text-primary" />
            <span>Manage Ecosystem Partners</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Maintain the roster of corporate and academic partners displayed in the homepage marquee slider.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="rounded-lg bg-primary hover:bg-primary-hover px-4 py-2.5 text-xs font-semibold text-white transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Partner</span>
        </button>
      </div>

      {/* Partners List Table */}
      <div className="overflow-hidden border border-slate-200 bg-white shadow-sm rounded-2xl">
        <table className="min-w-full divide-y divide-slate-200 text-left text-xs font-semibold text-slate-700">
          <thead className="bg-slate-50 text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3">Partner Logo</th>
              <th className="px-6 py-3">Partner Name</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {partners.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-center text-slate-400 font-medium font-body">
                  No partners configured yet. Click &quot;Add New Partner&quot; to begin.
                </td>
              </tr>
            ) : (
              partners.map((partner) => (
                <tr key={partner.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="whitespace-nowrap px-6 py-3">
                    <div className="relative h-10 w-24 bg-slate-50 border border-slate-100 p-1 rounded-lg">
                      <Image
                        src={partner.logoUrl}
                        alt={partner.name}
                        fill
                        sizes="100px"
                        className="object-contain p-1 grayscale"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-heading text-sm font-semibold text-slate-900">
                    {partner.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(partner)}
                      className="inline-flex items-center gap-1 text-slate-500 hover:text-primary transition-colors cursor-pointer px-2 py-1 border border-slate-200 hover:border-primary/20 bg-white rounded-md"
                    >
                      <Edit2 className="h-3 w-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(partner.id, partner.name)}
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
              <h2 className="font-heading text-sm font-semibold text-slate-900 uppercase tracking-wider">
                {editPartner ? "Edit Partner Logo" : "Add Partner Logo"}
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

              {/* Partner Name Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Partner Brand Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inari Amertron"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:border-primary focus:outline-none placeholder-slate-300 font-heading font-semibold rounded-lg"
                />
              </div>

              {/* Logo File Upload Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Partner Logo Graphic
                </label>
                
                <div className="flex items-start gap-4">
                  {/* File Selector Box */}
                  <div className="flex-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/png, image/jpeg, image/svg+xml"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border border-dashed border-slate-300 hover:border-primary/50 bg-slate-50/50 p-4 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-1 rounded-lg"
                    >
                      <Upload className="h-5 w-5 text-slate-400" />
                      <span className="text-[10px] font-semibold text-slate-600 block">
                        {selectedFile ? selectedFile.name : "Choose logo file"}
                      </span>
                      <span className="text-[8px] text-slate-400 block font-medium">
                        PNG, JPG, or SVG. Max 5MB.
                      </span>
                    </button>
                  </div>

                  {/* Logo Preview box */}
                  {logoUrl && (
                    <div className="h-16 w-24 relative bg-slate-50 border border-slate-200 shrink-0 p-1 flex items-center justify-center overflow-hidden rounded-lg">
                      <Image
                        src={logoUrl}
                        alt="Logo preview"
                        fill
                        className="object-contain p-1 grayscale"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 border border-slate-250 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending || uploading}
                  className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-xs font-semibold text-white transition-colors cursor-pointer rounded-lg"
                >
                  {uploading ? "Uploading Logo..." : isPending ? "Saving..." : editPartner ? "Save Changes" : "Create Partner"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
