"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import { UpcomingEvent } from "@/lib/db";
import { saveUpcomingEventAction, deleteUpcomingEventAction } from "@/app/actions/adminActions";
import { useToast } from "@/components/ui/toast";
import { useConfirm } from "@/components/ui/confirm-dialog";
import { 
  Calendar, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  X, 
  Copy,
  AlertCircle,
  Sparkles,
  Upload,
  Image as ImageIcon
} from "lucide-react";

interface AdminEventsClientProps {
  initialEvents: UpcomingEvent[];
}

export default function AdminEventsClient({ initialEvents }: AdminEventsClientProps) {
  const [events, setEvents] = useState<UpcomingEvent[]>(initialEvents);
  const [activeTab, setActiveTab] = useState<"ALL" | "UPCOMING" | "PAST">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();
  const confirm = useConfirm();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Partial<UpcomingEvent> | null>(null);

  // Dynamic Agenda Form State
  const [agendaList, setAgendaList] = useState<{ time: string; topic: string }[]>([]);

  // Open Modal for Create or Edit
  const handleOpenModal = (event?: UpcomingEvent) => {
    if (event) {
      setEditingEvent(event);
      setAgendaList(event.agenda || []);
    } else {
      setEditingEvent({
        id: "",
        title: "",
        category: "SEMINAR",
        date: "OCT 15",
        rawDate: new Date().toISOString().split("T")[0],
        location: "MIMOS Berhad, Bukit Jalil",
        description: "",
        imageUrl: "",
        microsoftFormUrl: "",
        isPast: false,
      });
      setAgendaList([
        { time: "09:00 AM", topic: "Opening Keynote & Registration" },
        { time: "11:00 AM", topic: "Technical Session & Q&A" }
      ]);
    }
    setIsModalOpen(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
    setAgendaList([]);
  };

  // Duplicate Event
  const handleDuplicate = (event: UpcomingEvent) => {
    const duplicated: Partial<UpcomingEvent> = {
      ...event,
      id: "",
      title: `${event.title} (Copy)`,
    };
    handleOpenModal(duplicated as UpcomingEvent);
  };

  // Save Event Action
  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent || !editingEvent.title) return;

    const isEdit = Boolean(editingEvent.id);

    const payload: Partial<UpcomingEvent> & { title: string } = {
      id: editingEvent.id || undefined,
      title: editingEvent.title,
      category: editingEvent.category || "SEMINAR",
      date: editingEvent.date || "TBD",
      rawDate: editingEvent.rawDate || new Date().toISOString().split("T")[0],
      location: editingEvent.location || "MIMOS Berhad, Bukit Jalil",
      description: editingEvent.description || "",
      imageUrl: editingEvent.imageUrl || "",
      microsoftFormUrl: editingEvent.microsoftFormUrl || "",
      isPast: Boolean(editingEvent.isPast),
      agenda: agendaList,
    };

    startTransition(async () => {
      const res = await saveUpcomingEventAction(payload);
      if (res.success && res.event) {
        setEvents((prev) => {
          const index = prev.findIndex((item) => item.id === res.event.id);
          if (index >= 0) {
            const next = [...prev];
            next[index] = res.event;
            return next;
          }
          return [res.event, ...prev];
        });
        handleCloseModal();
        toast.success(isEdit ? "Event updated." : "Event created.");
      } else {
        toast.error("Failed to save event.");
      }
    });
  };

  // Delete Event Action
  const handleDeleteEvent = async (id: string, title: string) => {
    const confirmed = await confirm({
      title: "Delete event?",
      message: `"${title}" will be permanently removed.`,
      confirmLabel: "Delete",
      danger: true,
      onConfirm: async () => {
        const res = await deleteUpcomingEventAction(id);
        if (!res.success) throw new Error("Failed to delete event.");
      },
    });
    if (!confirmed) return;
    setEvents((prev) => prev.filter((item) => item.id !== id));
    toast.success("Event deleted.");
  };

  // Agenda list handlers
  const handleAddAgendaRow = () => {
    setAgendaList((prev) => [...prev, { time: "02:00 PM", topic: "Technical Workshop Session" }]);
  };

  const handleRemoveAgendaRow = (index: number) => {
    setAgendaList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAgendaChange = (index: number, field: "time" | "topic", val: string) => {
    setAgendaList((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      return next;
    });
  };

  // Image Upload File Handler
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setEditingEvent((prev) => (prev ? { ...prev, imageUrl: result } : null));
      }
    };
    reader.readAsDataURL(file);
  };

  // Filtered Events
  const filteredEvents = events.filter((evt) => {
    // Status tab
    if (activeTab === "UPCOMING" && evt.isPast) return false;
    if (activeTab === "PAST" && !evt.isPast) return false;

    // Category filter
    if (categoryFilter !== "ALL" && evt.category !== categoryFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = evt.title.toLowerCase().includes(q);
      const matchLoc = (evt.location || "").toLowerCase().includes(q);
      const matchDesc = (evt.description || "").toLowerCase().includes(q);
      return matchTitle || matchLoc || matchDesc;
    }

    return true;
  });

  const totalCount = events.length;
  const upcomingCount = events.filter((e) => !e.isPast).length;
  const pastCount = events.filter((e) => e.isPast).length;

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">
      
      {/* Header & Main Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2.5">
            <Calendar className="w-7 h-7 text-primary" />
            <span>Manage Events</span>
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Create, update, and manage MIMOS seminars, lab visits, workshops, and Microsoft Form registration links.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors shadow-sm cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Event</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Events</p>
            <p className="text-3xl font-semibold text-slate-900 mt-1">{totalCount}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Upcoming</p>
            <p className="text-3xl font-semibold text-emerald-600 mt-1">{upcomingCount}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Past / Completed</p>
            <p className="text-3xl font-semibold text-slate-600 mt-1">{pastCount}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: Status Tab Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab("ALL")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "ALL"
                ? "bg-white text-slate-900 shadow-xs"
                : "bg-transparent text-slate-700 hover:text-slate-900"
            }`}
          >
            All Events ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("UPCOMING")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "UPCOMING"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-transparent text-slate-700 hover:text-slate-900"
            }`}
          >
            Upcoming ({upcomingCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("PAST")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "PAST"
                ? "bg-slate-700 text-white shadow-xs"
                : "bg-transparent text-slate-700 hover:text-slate-900"
            }`}
          >
            Past ({pastCount})
          </button>
        </div>

        {/* Right: Search & Category Filter */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="LAB VISIT">Lab Visit</option>
            <option value="TRAINING">Training</option>
            <option value="SEMINAR">Seminar</option>
            <option value="WORKSHOP">Workshop</option>
          </select>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search event title or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/40 w-64"
            />
          </div>
        </div>

      </div>

      {/* Events Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Event Details</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">MS Form Link</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 text-sm">
                    <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    No events found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Event Title + Location + Image */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5 max-w-sm">
                        <div className="w-12 h-12 rounded-lg bg-slate-900 overflow-hidden relative shrink-0 border border-slate-200">
                          <Image
                            src={evt.imageUrl || "/semiconductor_cleanroom.png"}
                            alt={evt.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{evt.title}</p>
                          {evt.location && (
                            <p className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-primary shrink-0" />
                              <span>{evt.location}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category Tag */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-semibold capitalize">
                        {evt.category.toLowerCase()}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-900 capitalize">{evt.date.toLowerCase()}</span>
                    </td>

                    {/* MS Form Link */}
                    <td className="px-6 py-4">
                      {evt.microsoftFormUrl ? (
                        <a
                          href={evt.microsoftFormUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                        >
                          <span>Forms Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">Default Form</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      {evt.isPast ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                          <Clock className="w-3 h-3" />
                          Past
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                          <CheckCircle2 className="w-3 h-3" />
                          Upcoming
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleDuplicate(evt)}
                          title="Duplicate Event"
                          className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenModal(evt)}
                          title="Edit Event"
                          className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteEvent(evt.id, evt.title)}
                          title="Delete Event"
                          className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span>{editingEvent?.id ? "Edit Event Details" : "Create New Event"}</span>
              </h2>
              <button
                type="button"
                onClick={handleCloseModal}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveEvent} className="p-6 overflow-y-auto space-y-5 flex-1 text-sm">
              
              {/* Event Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Event Title <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Advanced Semiconductor Wafer Fabrication Clinic"
                  value={editingEvent?.title || ""}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Category & Display Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={editingEvent?.category || "SEMINAR"}
                    onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value as UpcomingEvent["category"] })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="LAB VISIT">Lab Visit</option>
                    <option value="TRAINING">Training</option>
                    <option value="SEMINAR">Seminar</option>
                    <option value="WORKSHOP">Workshop</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Display Date (e.g. Oct 15)</label>
                  <input
                    type="text"
                    placeholder="Oct 15"
                    value={editingEvent?.date || ""}
                    onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              {/* Location & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Location / Venue</label>
                  <input
                    type="text"
                    placeholder="MIMOS Berhad, Bukit Jalil"
                    value={editingEvent?.location || ""}
                    onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Event Status</label>
                  <select
                    value={editingEvent?.isPast ? "PAST" : "UPCOMING"}
                    onChange={(e) => setEditingEvent({ ...editingEvent, isPast: e.target.value === "PAST" })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="UPCOMING">Upcoming (Registration Open)</option>
                    <option value="PAST">Past (Concluded)</option>
                  </select>
                </div>
              </div>

              {/* Microsoft Form Link */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Microsoft Form Registration URL
                </label>
                <input
                  type="url"
                  placeholder="https://forms.office.com/r/mimos-your-event-code"
                  value={editingEvent?.microsoftFormUrl || ""}
                  onChange={(e) => setEditingEvent({ ...editingEvent, microsoftFormUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Poster Image Upload & Preview */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Event Poster Image
                </label>
                
                {editingEvent?.imageUrl ? (
                  <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-xs group">
                    <Image
                      src={editingEvent.imageUrl}
                      alt="Poster Preview"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <label htmlFor="poster-file-input" className="px-3 py-1.5 rounded-lg bg-white text-slate-900 text-xs font-semibold cursor-pointer hover:bg-slate-100 transition-colors flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5 text-primary" />
                        <span>Change Image</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setEditingEvent({ ...editingEvent, imageUrl: "" })}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center space-y-3 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-900">Upload Poster Image File</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">PNG, JPG, WEBP or SVG format</p>
                    </div>
                    <label
                      htmlFor="poster-file-input"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shadow-xs"
                    >
                      <Upload className="w-3.5 h-3.5 text-primary" />
                      <span>Browse Image File</span>
                    </label>
                  </div>
                )}

                <input
                  id="poster-file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileUpload}
                  className="hidden"
                />

                <div className="pt-1">
                  <span className="text-[11px] text-slate-500 font-medium">Or enter image URL:</span>
                  <input
                    type="text"
                    placeholder="/semiconductor_cleanroom.png or https://..."
                    value={editingEvent?.imageUrl || ""}
                    onChange={(e) => setEditingEvent({ ...editingEvent, imageUrl: e.target.value })}
                    className="w-full mt-1 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Brief summary of event objectives, target audience, and key topics..."
                  value={editingEvent?.description || ""}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Agenda Builder */}
              <div className="border-t border-slate-200 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-900">Event Agenda Timeline</label>
                  <button
                    type="button"
                    onClick={handleAddAgendaRow}
                    className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Time Slot</span>
                  </button>
                </div>

                {agendaList.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="09:00 AM"
                      value={item.time}
                      onChange={(e) => handleAgendaChange(idx, "time", e.target.value)}
                      className="w-28 px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900"
                    />
                    <input
                      type="text"
                      placeholder="Topic description..."
                      value={item.topic}
                      onChange={(e) => handleAgendaChange(idx, "topic", e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveAgendaRow(idx)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Modal Footer Actions */}
              <div className="border-t border-slate-200 pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  disabled={isPending}
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {isPending ? "Saving..." : "Save Event"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
