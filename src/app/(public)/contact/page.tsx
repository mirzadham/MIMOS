"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Send, ArrowRight, Loader2, ExternalLink } from "lucide-react";

// Animation settings for the staggered columns fade-in
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 15,
    },
  },
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Card cursor glow tracking coordinates
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);

    // Simulate an API submit call with 1.5s delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      organization: "",
      message: "",
    });
    setIsSubmitted(false);
  };

  return (
    <div className="relative min-h-screen w-full bg-background text-foreground overflow-hidden flex flex-col justify-between">

      {/* 1. Background Grid & Ambient Blur Orbs */}
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none"
        aria-hidden="true"
      />

      {/* Soft floating background colors */}
      <div
        className="absolute top-[10%] left-[-10%] -z-10 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-primary/10 to-transparent blur-[120px] pointer-events-none animate-[pulse_12s_infinite]"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[20%] right-[-15%] -z-10 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-primary/5 to-transparent blur-[140px] pointer-events-none animate-[pulse_15s_infinite]"
        aria-hidden="true"
      />

      {/* Main Content Layout Container (Top Padded Section) */}
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 space-y-12 md:space-y-20 relative z-10 flex-1 flex flex-col justify-center pt-28 pb-16 sm:pt-36 sm:pb-20">

        {/* Main Content Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start my-auto">

          {/* Left Column: Title and Editorial Grid Details */}
          <div className="lg:col-span-7 space-y-12 sm:space-y-16">

            {/* Title Block */}
            <div className="space-y-4">
              <div className="overflow-hidden">
                <h1 className="font-heading text-left">
                  <motion.span
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                    className="block text-3xl sm:text-5xl md:text-6xl text-slate-900 font-semibold tracking-tight"
                  >
                    Contact with
                  </motion.span>
                  <motion.span
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="block text-3xl sm:text-5xl md:text-6xl text-slate-900 font-semibold tracking-tight mt-1"
                  >
                    MIMOS Academy
                  </motion.span>
                </h1>
              </div>
            </div>

            {/* Editorial Details Grid - 4 columns/sections without numbers/cards */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10 pt-10 border-t border-slate-200/60"
            >

              {/* KL HQ */}
              <motion.div variants={itemVariants} className="border-l border-slate-200 pl-5 space-y-1.5 group">
                <span className="block text-[10px] tracking-widest text-slate-400 uppercase font-black">Kuala Lumpur HQ</span>
                <a
                  href="https://maps.app.goo.gl/xSVfSpm4y676p2k59"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link inline-flex items-start gap-1.5 text-sm font-semibold text-slate-800 hover:text-primary transition-colors leading-relaxed font-body"
                >
                  <span className="relative">
                    Technology Park Malaysia, Bukit Jalil
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover/link:w-full transition-all duration-300" />
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover/link:text-primary transition-colors shrink-0 mt-1" />
                </a>
                <p className="text-xs text-slate-500 font-body">
                  57000 Kuala Lumpur, Malaysia
                </p>
              </motion.div>

              {/* Kulim Office */}
              <motion.div variants={itemVariants} className="border-l border-slate-200 pl-5 space-y-1.5 group">
                <span className="block text-[10px] tracking-widest text-slate-400 uppercase font-black">Kedah Branch</span>
                <a
                  href="https://maps.app.goo.gl/sjTpprYimsJfLyqr7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link inline-flex items-start gap-1.5 text-sm font-semibold text-slate-800 hover:text-primary transition-colors leading-relaxed font-body"
                >
                  <span className="relative">
                    Kulim Hi-Tech Park, Kulim
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover/link:w-full transition-all duration-300" />
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover/link:text-primary transition-colors shrink-0 mt-1" />
                </a>
                <p className="text-xs text-slate-500 font-body">
                  09000 Kulim, Kedah, Malaysia
                </p>
              </motion.div>

              {/* Email */}
              <motion.div variants={itemVariants} className="border-l border-slate-200 pl-5 space-y-1.5 group">
                <span className="block text-[10px] tracking-widest text-slate-400 uppercase font-black">Direct Email</span>
                <a
                  href="mailto:academy@mimos.my"
                  className="group/link inline-flex items-start gap-1.5 text-sm font-semibold text-slate-800 hover:text-primary transition-colors font-body leading-relaxed"
                >
                  <span className="relative">
                    academy@mimos.my
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover/link:w-full transition-all duration-300" />
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover/link:text-primary transition-colors shrink-0 mt-1" />
                </a>
                <p className="text-[10px] text-slate-400 font-body">
                  Response within 24 business hours
                </p>
              </motion.div>

              {/* Phone */}
              <motion.div variants={itemVariants} className="border-l border-slate-200 pl-5 space-y-1.5 group">
                <span className="block text-[10px] tracking-widest text-slate-400 uppercase font-black">Hotline</span>
                <a
                  href="tel:04-40525404"
                  className="group/link inline-flex items-start gap-1.5 text-sm font-semibold text-slate-800 hover:text-primary transition-colors font-body leading-relaxed"
                >
                  <span className="relative">
                    04-40525404
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover/link:w-full transition-all duration-300" />
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover/link:text-primary transition-colors shrink-0 mt-1" />
                </a>
                <p className="text-[10px] text-slate-400 font-body">
                  Mon - Fri, 9:00 AM - 5:00 PM (GMT+8)
                </p>
              </motion.div>

            </motion.div>

          </div>

          {/* Right Column: Glassmorphic Inquiry Form Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 w-full"
          >
            <div
              onMouseMove={handleMouseMove}
              className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/70 backdrop-blur-xl p-8 shadow-[0_20px_50px_rgba(15,23,42,0.08)] group"
            >

              {/* Radial gradient spotlight element */}
              <div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, rgba(167, 33, 144, 0.08), transparent 80%)`,
                }}
                aria-hidden="true"
              />

              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.div
                    key="contact-form"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="font-heading text-base font-bold text-slate-900 uppercase tracking-widest">Inquiry Console</h3>
                      <p className="text-xs text-slate-500 mt-1 leading-normal font-body">
                        Send an academic coordination query directly to our team.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">

                      {/* Name input */}
                      <div className="relative z-0 w-full group">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder=" "
                          className="block py-3 px-0 w-full text-xs font-semibold text-slate-800 bg-transparent border-0 border-b border-slate-200 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer transition-colors duration-300"
                        />
                        <label
                          htmlFor="name"
                          className="absolute text-slate-400 duration-300 transform -translate-y-5 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-5 peer-focus:text-primary uppercase tracking-wider font-extrabold text-[9px]"
                        >
                          Full Name
                        </label>
                        <div className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-primary peer-focus:w-full transition-all duration-500 ease-out" />
                      </div>

                      {/* Email input */}
                      <div className="relative z-0 w-full group">
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder=" "
                          className="block py-3 px-0 w-full text-xs font-semibold text-slate-800 bg-transparent border-0 border-b border-slate-200 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer transition-colors duration-300"
                        />
                        <label
                          htmlFor="email"
                          className="absolute text-slate-400 duration-300 transform -translate-y-5 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-5 peer-focus:text-primary uppercase tracking-wider font-extrabold text-[9px]"
                        >
                          Email Address
                        </label>
                        <div className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-primary peer-focus:w-full transition-all duration-500 ease-out" />
                      </div>

                      {/* Organization input */}
                      <div className="relative z-0 w-full group">
                        <input
                          type="text"
                          name="organization"
                          id="organization"
                          value={formData.organization}
                          onChange={handleChange}
                          placeholder=" "
                          className="block py-3 px-0 w-full text-xs font-semibold text-slate-800 bg-transparent border-0 border-b border-slate-200 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer transition-colors duration-300"
                        />
                        <label
                          htmlFor="organization"
                          className="absolute text-slate-400 duration-300 transform -translate-y-5 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-5 peer-focus:text-primary uppercase tracking-wider font-extrabold text-[9px]"
                        >
                          Organization / Company
                        </label>
                        <div className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-primary peer-focus:w-full transition-all duration-500 ease-out" />
                      </div>

                      {/* Message input */}
                      <div className="relative z-0 w-full group">
                        <textarea
                          name="message"
                          id="message"
                          rows={4}
                          value={formData.message}
                          onChange={handleChange}
                          required
                          placeholder=" "
                          className="block py-3 px-0 w-full text-xs font-semibold text-slate-800 bg-transparent border-0 border-b border-slate-200 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer transition-colors duration-300 resize-none"
                        />
                        <label
                          htmlFor="message"
                          className="absolute text-slate-400 duration-300 transform -translate-y-5 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-5 peer-focus:text-primary uppercase tracking-wider font-extrabold text-[9px]"
                        >
                          Your Message
                        </label>
                        <div className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-primary peer-focus:w-full transition-all duration-500 ease-out" />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full relative flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-hover text-white py-4 text-xs font-black uppercase tracking-widest transition-all duration-300 shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-80"
                      >
                        {isSubmitting ? (
                          <>
                            <span>Submitting Query</span>
                            <Loader2 className="h-4.5 w-4.5 animate-spin" />
                          </>
                        ) : (
                          <>
                            <span>Submit Inquiry</span>
                            <Send className="h-3.5 w-3.5" />
                          </>
                        )}
                      </button>

                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success-screen"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center justify-center py-10 text-center space-y-6"
                  >
                    {/* Animated checkmark circle */}
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <svg
                        className="h-8 w-8"
                        viewBox="0 0 52 52"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <motion.circle
                          cx="26"
                          cy="26"
                          r="23"
                          stroke="currentColor"
                          strokeWidth="3.5"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                        <motion.path
                          d="M16 26l7 7 13-13"
                          stroke="currentColor"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                      </svg>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.3 }}
                        className="absolute -inset-1 rounded-full border border-primary/30 animate-ping [animation-duration:2s]"
                      />
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-heading text-xl font-extrabold text-slate-900">Inquiry Dispatched</h3>
                      <p className="text-xs font-semibold text-primary uppercase tracking-wider">Thank you, {formData.name}!</p>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed max-w-sm font-body">
                      We have received your B2B / general academic coordination inquiry. A member of the MIMOS Academy advisory team will get in touch with you shortly at <span className="font-bold text-slate-700">{formData.email}</span>.
                    </p>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleReset}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 px-5 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 transition-all cursor-pointer"
                    >
                      <span>Submit another inquiry</span>
                      <ArrowRight className="h-3 w-3" />
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>

        </div>

      </div>

      {/* 3. Bottom Tagline Section: Full-width background block in Awwwards-style plum dark gradient with clean slate text */}
      <div className="w-full bg-gradient-to-br from-brand-plum-start via-brand-plum-via to-brand-plum-end py-16 sm:py-24 px-6 lg:px-8 flex justify-center items-center relative z-10 border-t border-brand-plum-start/20">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-heading text-2xl sm:text-4xl md:text-5xl font-semibold italic text-slate-50 tracking-tight leading-normal select-none text-center max-w-4xl"
        >
          The opportunity to create, grow, and look ahead.
        </motion.p>
      </div>

    </div>
  );
}
