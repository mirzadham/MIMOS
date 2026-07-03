"use client";

import React, { useState, useTransition, useRef } from "react";
import { Plus, Edit2, Trash2, X, Users, AlertCircle, Upload, Save, ArrowUp, ArrowDown } from "lucide-react";
import { 
  updateAboutSettingsAction, 
  createTeamMemberAction, 
  updateTeamMemberAction, 
  deleteTeamMemberAction 
} from "@/app/actions/aboutActions";
import { Button } from "@/components/ui/button";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  imageUrl: string | null;
  initials: string;
  order: number;
}

interface AboutSettings {
  mission: string;
  vision: string;
}

interface ManageAboutClientProps {
  initialSettings: AboutSettings;
  initialTeam: TeamMember[];
}

export default function ManageAboutClient({ initialSettings, initialTeam }: ManageAboutClientProps) {
  const [isPending, startTransition] = useTransition();
  const [settings, setSettings] = useState<AboutSettings>(initialSettings);
  const [team, setTeam] = useState<TeamMember[]>(initialTeam);
  
  // Settings Form State
  const [mission, setMission] = useState(settings.mission);
  const [vision, setVision] = useState(settings.vision);
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);

  // Team Modal State
  const [isOpen, setIsOpen] = useState(false);
  const [editMember, setEditMember] = useState<TeamMember | null>(null);
  const [teamError, setTeamError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Team Form Fields
  const [memberName, setMemberName] = useState("");
  const [memberRole, setMemberRole] = useState("");
  const [memberInitials, setMemberInitials] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Settings Submit handler
  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSuccess(false);
    setSettingsError(null);

    startTransition(async () => {
      try {
        const res = await updateAboutSettingsAction({ mission, vision });
        if (!res.success) throw new Error("Failed to update about settings.");
        setSettings({ mission, vision });
        setSettingsSuccess(true);
      } catch (err) {
        setSettingsError(err instanceof Error ? err.message : "An error occurred.");
      }
    });
  };

  // 2. Open Team Modal Handlers
  const handleOpenAdd = () => {
    setEditMember(null);
    setMemberName("");
    setMemberRole("");
    setMemberInitials("");
    setImageUrl("");
    setSelectedFile(null);
    setTeamError(null);
    setIsOpen(true);
  };

  const handleOpenEdit = (member: TeamMember) => {
    setEditMember(member);
    setMemberName(member.name);
    setMemberRole(member.role);
    setMemberInitials(member.initials);
    setImageUrl(member.imageUrl || "");
    setSelectedFile(null);
    setTeamError(null);
    setIsOpen(true);
  };

  // 3. File upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setImageUrl(URL.createObjectURL(file));
      
      // Auto-extract initials if empty
      if (!memberInitials) {
        const parts = memberName.split(" ");
        const calculatedInitials = parts.map(p => p[0]).join("").substring(0, 3).toUpperCase();
        setMemberInitials(calculatedInitials);
      }
    }
  };

  const uploadToR2 = async (file: File): Promise<string> => {
    const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type)}&prefix=team`);
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

  // 4. Team Member Form Submit
  const handleTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim() || !memberRole.trim() || !memberInitials.trim()) {
      setTeamError("Please fill in Name, Role, and Monogram Initials.");
      return;
    }

    setUploading(true);
    setTeamError(null);

    const run = async () => {
      let finalImageUrl = imageUrl;
      try {
        if (selectedFile) {
          finalImageUrl = await uploadToR2(selectedFile);
        }

        startTransition(async () => {
          try {
            if (editMember) {
              const res = await updateTeamMemberAction(editMember.id, {
                name: memberName,
                role: memberRole,
                imageUrl: finalImageUrl || null,
                initials: memberInitials,
                order: editMember.order
              });
              if (!res.success) throw new Error("Failed to update team member.");
              
              setTeam(prev => prev.map(m => m.id === editMember.id 
                ? { ...m, name: memberName, role: memberRole, imageUrl: finalImageUrl || null, initials: memberInitials } 
                : m
              ));
            } else {
              const res = await createTeamMemberAction({
                name: memberName,
                role: memberRole,
                imageUrl: finalImageUrl || null,
                initials: memberInitials
              });
              if (!res.success || !res.member) throw new Error("Failed to create team member.");
              
              setTeam(prev => [...prev, res.member as TeamMember]);
            }
            setIsOpen(false);
          } catch (err) {
            setTeamError(err instanceof Error ? err.message : "An error occurred.");
          } finally {
            setUploading(false);
          }
        });
      } catch (err) {
        setTeamError(err instanceof Error ? err.message : "Image upload failed.");
        setUploading(false);
      }
    };

    run();
  };

  // 5. Team delete handler
  const handleTeamDelete = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from the leadership directory?`)) return;

    startTransition(async () => {
      try {
        const res = await deleteTeamMemberAction(id);
        if (!res.success) throw new Error("Failed to delete team member.");
        setTeam(prev => prev.filter(m => m.id !== id));
      } catch (err) {
        alert(err instanceof Error ? err.message : "An error occurred.");
      }
    });
  };

  // 6. Custom sorting handlers
  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= team.length) return;

    const originalOrder = team[index].order;
    const swapOrder = team[targetIndex].order;

    const list = [...team];
    const itemAtIdx = { ...list[index], order: originalOrder };
    const itemAtTargetIdx = { ...list[targetIndex], order: swapOrder };

    list[index] = itemAtTargetIdx;
    list[targetIndex] = itemAtIdx;

    setTeam(list);

    // Persist swaps in background
    startTransition(async () => {
      try {
        await Promise.all([
          updateTeamMemberAction(list[index].id, {
            name: list[index].name,
            role: list[index].role,
            imageUrl: list[index].imageUrl || "",
            initials: list[index].initials,
            order: list[index].order
          }),
          updateTeamMemberAction(list[targetIndex].id, {
            name: list[targetIndex].name,
            role: list[targetIndex].role,
            imageUrl: list[targetIndex].imageUrl || "",
            initials: list[targetIndex].initials,
            order: list[targetIndex].order
          })
        ]);
      } catch (e) {
        console.error("Sorting persist failed:", e);
      }
    });
  };

  return (
    <div className="space-y-12">
      
      {/* Overview Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-extrabold text-foreground flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <span>Manage About Us & Team</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure the Mission statement, Vision clause, and the Leadership Team directory.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        
        {/* Left Column: Mission & Vision Settings (5/12 width) */}
        <form onSubmit={handleSettingsSubmit} className="lg:col-span-5 space-y-6 bg-white border border-slate-200 p-6 rounded-xl shadow-sm h-fit">
          <h2 className="font-heading text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-3">
            Company Core Statements
          </h2>

          {settingsSuccess && (
            <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-xs text-green-700 flex items-center gap-2">
              <Save className="h-4 w-4 shrink-0" />
              <span>Statements saved successfully.</span>
            </div>
          )}

          {settingsError && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{settingsError}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Mission Statement
            </label>
            <textarea
              value={mission}
              onChange={(e) => setMission(e.target.value)}
              rows={4}
              className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:outline-none focus:border-primary font-body leading-relaxed"
              placeholder="Enter the company mission..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Vision Statement
            </label>
            <textarea
              value={vision}
              onChange={(e) => setVision(e.target.value)}
              rows={5}
              className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:outline-none focus:border-primary font-body leading-relaxed"
              placeholder="Enter the company vision..."
            />
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg h-10 text-xs font-bold bg-primary hover:bg-primary-hover text-white transition-colors cursor-pointer"
          >
            {isPending ? "Saving..." : "Save Statements"}
          </Button>
        </form>

        {/* Right Column: Leadership Team Table (7/12 width) */}
        <div className="lg:col-span-7 space-y-6 bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-heading text-sm font-extrabold text-slate-900">
              Leadership Team Roster
            </h2>
            <button
              onClick={handleOpenAdd}
              className="rounded-lg bg-primary hover:bg-primary-hover px-3 py-1.5 text-[10px] font-bold text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Member</span>
            </button>
          </div>

          {team.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
              <Users className="h-8 w-8 text-slate-300 mx-auto" />
              <h3 className="text-xs font-bold text-slate-700 mt-2">No team members</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Click &quot;Add Member&quot; to populate your directory.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-650">
                <thead>
                  <tr className="border-b border-slate-150 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Avatar</th>
                    <th className="py-2.5 px-3">Details</th>
                    <th className="py-2.5 px-3 text-center">Reorder</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {team.map((member, index) => (
                    <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Avatar preview */}
                      <td className="py-3 px-3">
                        <div className="h-12 w-9 rounded-lg bg-gradient-to-b from-[#faf5fa] to-[#e6d0e4] border border-primary/5 flex items-center justify-center overflow-hidden">
                          {member.imageUrl ? (
                            <img
                              src={member.imageUrl}
                              alt={member.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="font-heading font-black text-xs text-[#a72190]/30 select-none">
                              {member.initials}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Name & Role */}
                      <td className="py-3 px-3">
                        <span className="font-heading font-bold text-slate-900 block">{member.name}</span>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mt-0.5">{member.role}</span>
                      </td>

                      {/* Sorting Reorder */}
                      <td className="py-3 px-3">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleMove(index, "up")}
                            disabled={index === 0 || isPending}
                            className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-500 disabled:opacity-30 disabled:hover:bg-slate-100 cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleMove(index, "down")}
                            disabled={index === team.length - 1 || isPending}
                            className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-500 disabled:opacity-30 disabled:hover:bg-slate-100 cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* CRUD Actions */}
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(member)}
                            className="p-1.5 text-slate-400 hover:text-primary transition-colors cursor-pointer"
                            title="Edit Details"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleTeamDelete(member.id, member.name)}
                            className="p-1.5 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                            title="Delete Member"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Add / Edit Team Member Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md bg-white border border-slate-200 p-6 shadow-xl rounded-2xl relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 p-1 rounded-full text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="font-heading text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span>{editMember ? "Edit Team Member" : "Add New Team Member"}</span>
            </h3>

            {teamError && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700 flex items-center gap-2 mt-4">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{teamError}</span>
              </div>
            )}

            <form onSubmit={handleTeamSubmit} className="space-y-4 mt-4">
              
              {/* Form Field: Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Full Name
                </label>
                <input
                  type="text"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary font-body"
                  placeholder="e.g. Ir. Dr. Ahmad Nizar"
                  required
                />
              </div>

              {/* Form Field: Role */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Role / Title
                </label>
                <input
                  type="text"
                  value={memberRole}
                  onChange={(e) => setMemberRole(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary font-body"
                  placeholder="e.g. CEO-Designate"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Form Field: Monogram Initials */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block" title="Used if photo is missing">
                    Monogram Initials
                  </label>
                  <input
                    type="text"
                    value={memberInitials}
                    onChange={(e) => setMemberInitials(e.target.value.toUpperCase().slice(0, 3))}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary font-body uppercase text-center font-bold tracking-widest"
                    placeholder="e.g. AN"
                    maxLength={3}
                    required
                  />
                </div>

                {/* Form Field: Order index (Readonly inside modal) */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Display Order
                  </label>
                  <input
                    type="text"
                    value={editMember ? editMember.order : team.length}
                    className="w-full text-xs p-2.5 border border-slate-200 bg-slate-50 text-slate-400 rounded-lg font-body text-center font-bold"
                    disabled
                  />
                </div>
              </div>

              {/* File Upload / Image Picker */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Portrait Photo
                </label>
                
                <div className="flex items-center gap-3">
                  <div className="h-16 w-12 rounded-lg bg-gradient-to-b from-[#faf5fa] to-[#e6d0e4] border border-primary/5 flex items-center justify-center overflow-hidden shrink-0">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="font-heading font-black text-sm text-[#a72190]/30 select-none">
                        {memberInitials || "?"}
                      </span>
                    )}
                  </div>

                  <div className="flex-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-lg border border-slate-250 bg-white hover:bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer w-full justify-center"
                    >
                      <Upload className="h-4 w-4 text-slate-500" />
                      <span>{selectedFile ? "Change Image" : "Upload Portrait"}</span>
                    </button>
                    {selectedFile && (
                      <span className="text-[10px] text-slate-400 block truncate mt-1 text-center font-medium">
                        {selectedFile.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg border border-slate-250 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                  disabled={uploading || isPending}
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  disabled={uploading || isPending}
                  className="rounded-lg h-10 px-4 text-xs font-bold bg-primary hover:bg-primary-hover text-white transition-colors cursor-pointer"
                >
                  {uploading ? "Uploading..." : isPending ? "Saving..." : editMember ? "Update Details" : "Add Member"}
                </Button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
