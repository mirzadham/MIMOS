"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

interface ProgramPosterGalleryProps {
  imageUrls?: string[] | null;
  fallbackUrl?: string | null;
  title: string;
}

export default function ProgramPosterGallery({ imageUrls, fallbackUrl, title }: ProgramPosterGalleryProps) {
  const urls = imageUrls && imageUrls.length > 0
    ? imageUrls
    : fallbackUrl
      ? [fallbackUrl]
      : [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (urls.length === 0) return null;

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % urls.length);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + urls.length) % urls.length);
  };

  return (
    <div className="relative w-full overflow-hidden select-none">
      {/* Outer Container */}
      <div 
        onClick={() => setLightboxOpen(true)}
        className="group relative cursor-zoom-in w-full aspect-[21/9] rounded-xl overflow-hidden bg-slate-100 border border-slate-200"
      >
        {/* Animated Slide */}
        <div className="w-full h-full relative">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={urls[currentIndex]}
              alt={`${title} poster page ${currentIndex + 1}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
        </div>

        {/* Hover zoom icon badge */}
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <Maximize2 className="h-4 w-4" />
        </div>

        {/* Controls Overlay (Only if multiple pages) */}
        {urls.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 rounded-full p-2 border border-slate-200 hover:scale-105 active:scale-95 transition-all"
              title="Previous Page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 rounded-full p-2 border border-slate-200 hover:scale-105 active:scale-95 transition-all"
              title="Next Page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* Pagination indicators (Only if multiple pages) */}
      {urls.length > 1 && (
        <div className="flex justify-between items-center mt-3 px-1 text-[11px] font-bold text-slate-500">
          <div className="flex gap-1.5">
            {urls.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 transition-all duration-300 ${
                  currentIndex === idx ? "w-6 bg-primary" : "w-2 bg-slate-200 hover:bg-slate-350"
                }`}
                style={{ borderRadius: "9999px" }}
              />
            ))}
          </div>
          <span>Page {currentIndex + 1} of {urls.length}</span>
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md p-4 cursor-zoom-out"
          >
            {/* Top Close Panel */}
            <div className="absolute top-4 right-4 flex items-center gap-3">
              <span className="text-white/60 text-xs font-bold font-mono">
                Page {currentIndex + 1} / {urls.length}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxOpen(false);
                }}
                className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Lightbox Image Container */}
            <div className="relative max-w-5xl w-full h-[80vh] flex items-center justify-center">
              <motion.img
                key={`lightbox-${currentIndex}`}
                src={urls[currentIndex]}
                alt={`${title} full poster`}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-full max-h-full object-contain rounded-lg border border-white/5 cursor-default select-none"
              />

              {/* Lightbox Controls */}
              {urls.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev();
                    }}
                    className="absolute left-2 lg:left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-full p-3 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    className="absolute right-2 lg:right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-full p-3 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>

            {/* Helper notice */}
            <span className="absolute bottom-4 text-white/40 text-[10px] uppercase font-bold tracking-wider pointer-events-none">
              Click anywhere outside the poster to close
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
