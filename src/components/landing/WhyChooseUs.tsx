"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface WhyChooseUsCard {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  colspan: number;
  order: number;
}

interface WhyChooseUsProps {
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

export default function WhyChooseUs({ cards }: WhyChooseUsProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } }
  };

  // Sort cards by order to guarantee layout alignment
  const sortedCards = [...cards].sort((a, b) => a.order - b.order);

  return (
    <section className="border-b border-slate-200/60 bg-background py-20 sm:py-28 relative overflow-hidden">
      {/* Background ambient blurs */}
      <div className="absolute left-1/3 top-1/2 -translate-y-1/2 -z-10 h-96 w-96 rounded-full bg-primary/3 blur-[120px]" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Header - Aligned to Left */}
        <div className="text-left space-y-4 max-w-3xl">
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Bridging Education and Industry Excellence
          </h2>
          <p className="text-sm sm:text-md text-slate-600 leading-relaxed font-body">
            MIMOS Academy integrates state-of-the-art laboratory infrastructure with national applied researchers to offer talent upskilling tracks that stand out globally.
          </p>
        </div>

        {/* Bento Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {sortedCards.map((card) => {
            const align = getAlignmentClasses(card.order);
            return (
              <motion.div 
                key={card.id}
                variants={itemVariants}
                className={`group relative rounded-2xl border border-slate-200/80 bg-slate-950 p-8 sm:p-10 hover:border-primary/60 hover:shadow-[0_0_30px_rgba(167,33,144,0.15)] transition-all duration-500 flex flex-col overflow-hidden min-h-[380px] ${
                  card.colspan === 2 ? "md:col-span-2" : "md:col-span-1"
                } ${align.container}`}
              >
                {/* Background Image / Placeholder spanning the whole card */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  {card.imageUrl ? (
                    <Image 
                      src={card.imageUrl} 
                      alt={card.title} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-w-768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#2a0a25] via-[#100318] to-slate-950 flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                      <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase font-sans">[Placeholder Image]</span>
                    </div>
                  )}
                  
                  {/* Deep premium purplish gradient overlay to blend image and ensure readable text */}
                  <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-[#3a0b33]/25 to-[#10000e]/95 group-hover:via-[#470f3f]/35 transition-all duration-700 z-10" />
                </div>

                {/* Text content placed at the top/bottom left/right (floating on top of background) */}
                <div className={`relative z-20 space-y-4 max-w-xl flex flex-col ${align.text}`}>
                  <h3 className="font-heading text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-sm">
                    {card.title}
                  </h3>
                  <p className="text-sm text-slate-200 leading-relaxed font-body drop-shadow-sm">
                    {card.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}


