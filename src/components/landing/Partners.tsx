"use client";

import React from "react";
import Image from "next/image";

interface Partner {
  id?: string;
  name: string;
  logoUrl: string;
}

interface PartnersProps {
  partners?: Partner[];
}

export default function Partners({ partners = [] }: PartnersProps) {
  if (!partners || partners.length === 0) return null;

  return (
    <section className="bg-background py-8 border-b border-slate-200/60 relative overflow-hidden select-none">
      {/* Premium fade borders on sides */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
      
      <div className="w-full overflow-hidden">
        <div className="animate-marquee-scroll flex gap-12 sm:gap-20 items-center group/marquee">
          
          {/* List 1 */}
          <div className="flex gap-12 sm:gap-20 items-center shrink-0">
            {partners.map((partner, idx) => (
              <div 
                key={`p1-${partner.id || idx}`} 
                className="h-10 w-28 sm:w-36 flex items-center justify-center grayscale-0 opacity-80 group-hover/marquee:grayscale group-hover/marquee:opacity-35 hover:!grayscale-0 hover:!opacity-100 transition-all duration-300 cursor-pointer"
                title={partner.name}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={partner.logoUrl}
                    alt={`${partner.name} logo`}
                    fill
                    sizes="(max-width: 640px) 120px, 160px"
                    className="object-contain"
                    priority={idx < 4}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* List 2 (Duplicate for loop) */}
          <div className="flex gap-12 sm:gap-20 items-center shrink-0" aria-hidden="true">
            {partners.map((partner, idx) => (
              <div 
                key={`p2-${partner.id || idx}`} 
                className="h-10 w-28 sm:w-36 flex items-center justify-center grayscale-0 opacity-80 group-hover/marquee:grayscale group-hover/marquee:opacity-35 hover:!grayscale-0 hover:!opacity-100 transition-all duration-300 cursor-pointer"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={partner.logoUrl}
                    alt={`${partner.name} logo`}
                    fill
                    sizes="(max-width: 640px) 120px, 160px"
                    className="object-contain"
                  />
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

