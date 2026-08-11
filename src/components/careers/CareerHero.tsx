import React from "react";

export default function CareerHero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-12 sm:pt-36 sm:pb-16">
      {/* Upper-right soft gradient glow aura inspired by reference visual */}
      <div 
        className="pointer-events-none absolute -top-10 right-0 -z-10 h-[360px] w-[360px] sm:h-[480px] sm:w-[480px] rounded-full bg-gradient-to-br from-pink-400/25 via-rose-300/20 to-purple-400/10 blur-[100px]"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        {/* Outlined Pill Badge */}
        <div className="inline-flex items-center rounded-full border border-slate-300 bg-white/60 px-3.5 py-1 text-xs sm:text-sm font-medium text-slate-800 backdrop-blur-xs shadow-xs transition-colors">
          We&apos;re hiring!
        </div>

        {/* Large Heading */}
        <h1 className="mt-5 font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1]">
          Be part of our mission
        </h1>

        {/* Short Paragraph */}
        <p className="mt-4 max-w-2xl text-base sm:text-lg text-slate-600 font-sans leading-relaxed">
          We&apos;re looking for passionate people to join us on our mission. We value flat hierarchies, clear communication, and full ownership and responsibility.
        </p>
      </div>
    </section>
  );
}
