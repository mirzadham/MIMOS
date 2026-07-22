"use client";

import { MouseEvent, useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface FacilityImageCardProps {
  src: string | null;
  alt: string;
  title: string;
  subtitle: string;
  priority?: boolean;
  aspectRatio?: string;
  onImageClick: (src: string, title: string, subtitle: string) => void;
}

export default function FacilityImageCard({
  src,
  alt,
  title,
  subtitle,
  priority = false,
  aspectRatio = "aspect-[16/10] sm:aspect-[5/4]",
  onImageClick,
}: FacilityImageCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse position values for 3D Perspective Tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring physics for fluid movement
  const mouseXSpring = useSpring(x, { stiffness: 350, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 350, damping: 25 });

  // Map mouse movement to tilt rotation (-4deg to +4deg)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["4deg", "-4deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-4deg", "4deg"]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate normalized position between -0.5 and 0.5
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => src && onImageClick(src, title, subtitle)}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative ${aspectRatio} w-full rounded-sm overflow-hidden bg-slate-100 group shadow-sm cursor-pointer select-none`}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          priority={priority}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 font-sans text-xs">
          No Image Available
        </div>
      )}

      {/* Hover visual cue indicator - Square container at bottom right without arrow sticks */}
      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100 pointer-events-none z-10">
        <div className="w-9 h-9 rounded-sm bg-slate-900/80 border border-white/20 text-white backdrop-blur-md shadow-md flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 text-white"
          >
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}
