import { ShieldCheck, Award, HeartHandshake, History } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { label: "Upskilled Engineers", value: "5,000+" },
    { label: "Partner Companies", value: "120+" },
    { label: "R&D Training Labs", value: "6" },
    { label: "Years of Tech Applied R&D", value: "20+" }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Editorial Heading */}
        <div className="text-center space-y-4">
          <span className="text-xs font-bold text-[#d7569f] tracking-wider uppercase">Our Background</span>
          <h1 className="font-heading text-3xl font-extrabold text-slate-900 sm:text-5xl">
            upskilling Malaysia's Applied Engineering Workforce
          </h1>
          <p className="mx-auto max-w-3xl text-sm sm:text-md text-slate-500 leading-relaxed font-body">
            MIMOS Academy was established to bridge the gap between academic theory and practical applied research. As a subsidiary of MIMOS Berhad, we coordinate and conduct hands-on technology upskilling.
          </p>
        </div>

        {/* Highlight Stats Banner */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <span className="text-3xl font-extrabold text-[#d7569f] block">{stat.value}</span>
                <span className="text-xs text-slate-500 font-semibold block">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pillars / Values Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="rounded-lg bg-pink-50 p-2.5 text-[#d7569f] inline-block">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="font-heading text-md font-bold text-slate-900">National Accreditation</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our certificates and course standards are verified directly under MIMOS R&D structures and supported by national HRD Corp policies.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="rounded-lg bg-pink-50 p-2.5 text-[#d7569f] inline-block">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-heading text-md font-bold text-slate-900">Applied Deep Tech</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We skip generic theoretical slides. Our students work physically inside actual wafer fab cleanrooms and deep-learning clusters.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="rounded-lg bg-pink-50 p-2.5 text-[#d7569f] inline-block">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <h3 className="font-heading text-md font-bold text-slate-900">B2B Co-Design</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We collaborate with enterprise partners to build tailored physical training modules targeting active technological gaps.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="rounded-lg bg-pink-50 p-2.5 text-[#d7569f] inline-block">
              <History className="h-6 w-6" />
            </div>
            <h3 className="font-heading text-md font-bold text-slate-900">R&D Legacy</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Backed by MIMOS's 20+ year legacy in microelectronics patenting, material analyses, and national data registries.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
