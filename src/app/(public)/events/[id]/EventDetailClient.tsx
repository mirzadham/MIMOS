"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { UpcomingEvent } from "@/lib/db";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Share2, 
  ArrowUpRight, 
  X, 
  UserCheck, 
  Building2 
} from "lucide-react";

interface EventDetailClientProps {
  event: UpcomingEvent;
}

export default function EventDetailClient({ event }: EventDetailClientProps) {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
  });

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsRegisterModalOpen(false);
      setFormData({ fullName: "", email: "", phone: "", organization: "" });
    }, 2500);
  };

  return (
    <div className="bg-background min-h-screen pt-28 pb-20 sm:pt-36 sm:pb-28 relative overflow-x-clip">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 space-y-10">
        
        {/* Back Link Breadcrumb */}
        <div>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-primary transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to All Events</span>
          </Link>
        </div>

        {/* Main Event Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          
          {/* Left Column: Poster, Title, Badges, Details & Agenda */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Event Poster / Feature Image (ABOVE TITLE) */}
            <div className="w-full aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden relative shadow-md border border-slate-200/80 bg-slate-900">
              <Image
                src={event.imageUrl || "/semiconductor_cleanroom.png"}
                alt={event.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Header Info */}
            <div className="space-y-4 border-b border-slate-200/80 pb-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5" />
                  {event.date}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-xs font-semibold uppercase tracking-widest">
                  {event.category}
                </span>
                {event.isPast && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold uppercase">
                    Past Event
                  </span>
                )}
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-slate-900 leading-tight">
                {event.title}
              </h1>

              {event.location && (
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-medium pt-1">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>

            {/* Event Description */}
            <div className="space-y-4">
              <h2 className="font-heading text-lg sm:text-xl font-semibold text-slate-900">
                About this Event
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-body">
                {event.description || "Join MIMOS Academy for an immersive technical session led by national applied researchers and industry experts."}
              </p>
            </div>

            {/* Event Agenda Timeline */}
            {event.agenda && event.agenda.length > 0 && (
              <div className="space-y-6 pt-4">
                <h2 className="font-heading text-lg sm:text-xl font-semibold text-slate-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>Event Agenda</span>
                </h2>

                <div className="relative border-l-2 border-slate-200 pl-6 space-y-6">
                  {event.agenda.map((item, idx) => (
                    <div key={idx} className="relative group">
                      {/* Circle indicator */}
                      <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-primary group-hover:bg-primary transition-colors" />

                      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-1">
                        <span className="text-xs font-semibold text-primary tracking-wider uppercase font-sans">
                          {item.time}
                        </span>
                        <h3 className="text-sm sm:text-base font-semibold text-slate-900">
                          {item.topic}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Registration Card (Sticky on Scroll) */}
          <div className="lg:col-span-1 space-y-6 sticky top-32 lg:top-36 self-start">
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-5 sm:p-7 shadow-md space-y-5">
              <div className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Event Status
                </span>
                <div className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  {event.isPast ? (
                    <span className="text-slate-500">Event Completed</span>
                  ) : (
                    <span className="text-emerald-600 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Registration Open
                    </span>
                  )}
                </div>
              </div>

              <div className="divide-y divide-slate-100 text-xs sm:text-sm space-y-2.5 pt-1">
                <div className="flex justify-between py-2">
                  <span className="text-slate-500 font-medium">Date</span>
                  <span className="font-semibold text-slate-900">{event.date}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-500 font-medium">Category</span>
                  <span className="font-semibold text-slate-900">{event.category}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-500 font-medium">Location</span>
                  <span className="font-semibold text-slate-900 text-right max-w-[160px] truncate">
                    {event.location || "Bukit Jalil, KL"}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-500 font-medium">HRD Corp</span>
                  <span className="font-semibold text-emerald-600">Claimable</span>
                </div>
              </div>

              {/* Action Button */}
              {event.isPast ? (
                <button
                  disabled
                  type="button"
                  className="w-full py-3 px-4 rounded-xl bg-slate-100 text-slate-400 text-sm font-semibold cursor-not-allowed text-center"
                >
                  Event Concluded
                </button>
              ) : (
                <a
                  href={event.microsoftFormUrl || "https://forms.office.com/r/mimos-academy-registration"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-6 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer text-center"
                >
                  <span>Register for Event</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              )}

              {event.link && (
                <Link
                  href={event.link}
                  className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-primary transition-colors text-center pt-2"
                >
                  <span>View Full Course Syllabus Page</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Registration Modal Dialog */}
      <AnimatePresence>
        {isRegisterModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 p-6 sm:p-8"
            >
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {submitted ? (
                <div className="py-8 text-center space-y-3">
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 350, damping: 22 }}
                  >
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-slate-900">Registration Received!</h3>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Thank you. A MIMOS Academy representative will contact you with attendance details.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">Event Registration</span>
                    <h3 className="text-xl font-semibold text-slate-900 mt-1">{event.title}</h3>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Dr. Ahmad Razak"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                      <input
                        required
                        type="email"
                        placeholder="name@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                      <input
                        required
                        type="tel"
                        placeholder="+60 12-345 6789"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Organization / Company</label>
                      <input
                        type="text"
                        placeholder="e.g. MIMOS Berhad / Intel"
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-hover transition-colors shadow-sm cursor-pointer"
                  >
                    Confirm Registration
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
