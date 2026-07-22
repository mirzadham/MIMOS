"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface LightboxImageData {
  src: string;
  title: string;
  subtitle: string;
}

interface FacilityLightboxModalProps {
  imageData: LightboxImageData | null;
  onClose: () => void;
}

export default function FacilityLightboxModal({ imageData, onClose }: FacilityLightboxModalProps) {
  // Listen for Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (imageData) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [imageData, onClose]);

  return (
    <AnimatePresence>
      {imageData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-slate-950/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative max-w-5xl w-full rounded-sm overflow-hidden bg-slate-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 flex items-center justify-center w-9 h-9 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close Lightbox"
            >
              ✕
            </button>

            {/* High-Res Image Container */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full">
              <Image
                src={imageData.src}
                alt={imageData.title}
                fill
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-contain bg-slate-950"
                priority
              />
            </div>

            {/* Caption bar */}
            <div className="p-4 sm:p-6 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-mono text-primary font-semibold uppercase tracking-widest block">
                  {imageData.subtitle}
                </span>
                <h3 className="text-base sm:text-xl font-bold text-white font-heading uppercase">
                  {imageData.title}
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                [ ESC TO CLOSE ]
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
