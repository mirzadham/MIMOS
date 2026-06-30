import { Cpu, Server, Shield, Layers, ChevronRight, Presentation } from "lucide-react";
import Link from "next/link";

export default function FacilitiesPage() {
  const labs = [
    {
      title: "Semiconductor Technology Centre (STC)",
      specs: [
        "Class 10, Class 100, and Class 1000 Cleanrooms",
        "Complete 6-inch wafer fab processing line",
        "E-Beam Lithography & Photolithography chambers",
        "Thin film PECVD, LPCVD, and Sputtering machines",
        "Failure Analysis scanning electron microscopes (SEM)"
      ],
      desc: "Malaysia's premier shared R&D fabrication center. Used by leading local semiconductor firms and research groups, STC provides hands-on practical training space for engineering cohorts.",
      icon: Cpu,
      imageUrl: "/semiconductor_cleanroom.png"
    },
    {
      title: "5G & AI Innovation Hub",
      specs: [
        "Private standalone 5G sub-6GHz testbeds",
        "NVIDIA H100 GPU compute nodes",
        "High-performance storage array (NVMe SAN)",
        "Secure model training sandboxes",
        "IoT protocol verification arrays"
      ],
      desc: "A cooperative facility focused on simulating enterprise workloads. Students train and deploy generative models, customize deep-learning parameters, and verify networking latency in real-world scenarios.",
      icon: Server,
      imageUrl: "/ai_5g_hub.png"
    },
    {
      title: "Cyber Security Range",
      specs: [
        "Modular network simulation racks",
        "Active threat simulation vectors (cyber-range)",
        "Packet capture and packet analysis nodes",
        "Air-gapped verification testing environments"
      ],
      desc: "Designed to train cybersecurity groups. The lab runs physical simulations of high-level threat profiles, privilege escalation, and active logging analytics.",
      icon: Shield,
      imageUrl: "/cyber_security_range.png"
    }
  ];

  return (
    <div className="bg-background min-h-screen py-16 sm:py-24 relative overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute right-1/4 top-0 -z-10 h-96 w-96 rounded-none bg-primary/3 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-16">
        
        {/* Breadcrumbs & Header */}
        <div className="space-y-8">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-300" />
            <span className="text-slate-900">Facilities</span>
          </nav>

          {/* Editorial Banner */}
          <div className="rounded-none border border-slate-200 bg-white p-8 sm:p-14 relative overflow-hidden transition-all duration-300">
            <div className="max-w-3xl space-y-4 relative z-10">
              <span className="text-xs font-extrabold text-primary tracking-widest uppercase bg-primary/5 px-3 py-1 rounded-none border border-primary/10">
                Infrastructure Overview
              </span>
              <h1 className="font-heading text-3xl font-black text-slate-900 sm:text-5xl tracking-tight leading-tight">
                Shared R&D Facilities
              </h1>
              <p className="text-sm sm:text-md text-slate-650 leading-relaxed font-body">
                MIMOS Academy is situated inside the main MIMOS Berhad headquarters, featuring direct shared access to Malaysia&apos;s leading applied research laboratories and testing environments.
              </p>
            </div>
          </div>
        </div>

        {/* Labs Showcase */}
        <div id="lab" className="space-y-12 scroll-mt-24">
          {labs.map((lab, index) => {
            const Icon = lab.icon;
            return (
              <div 
                key={index} 
                className="grid grid-cols-1 gap-10 lg:grid-cols-2 items-center bg-white rounded-none border border-slate-200 p-6 sm:p-10 transition-all duration-300"
              >
                
                {/* Visual Image container */}
                <div className={`relative h-64 sm:h-80 overflow-hidden rounded-none border border-slate-200 bg-slate-50 group ${index % 2 === 1 ? 'lg:order-last' : ''}`}>
                  <img
                    src={lab.imageUrl}
                    alt={lab.title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-102"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/10 via-transparent to-transparent pointer-events-none" />
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3.5">
                    <div className="rounded-none bg-primary/5 border border-primary/10 p-3 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h2 className="font-heading text-xl sm:text-2xl font-black text-slate-900 leading-tight">{lab.title}</h2>
                  </div>

                  <p className="text-sm text-slate-605 leading-relaxed font-body">
                    {lab.desc}
                  </p>

                  <div className="space-y-3.5 pt-2 border-t border-slate-200">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-widest block">Lab Specifications:</span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 text-xs font-semibold text-slate-650 font-body">
                      {lab.specs.map((spec, sIdx) => (
                        <li key={sIdx} className="flex gap-2 items-start">
                          <Layers className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>
            );
          })}

          {/* Training & Seminar Rooms */}
          <div 
            id="training-room"
            className="grid grid-cols-1 gap-10 lg:grid-cols-2 items-center bg-white rounded-none border border-slate-200 p-6 sm:p-10 transition-all duration-300 scroll-mt-24"
          >
            
            {/* Visual Image container */}
            <div className="relative h-64 sm:h-80 overflow-hidden rounded-none border border-slate-200 bg-slate-50 group lg:order-last">
              <img
                src="/training_seminar_room.png"
                alt="Training & Seminar Rooms"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-102"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/10 via-transparent to-transparent pointer-events-none" />
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3.5">
                <div className="rounded-none bg-primary/5 border border-primary/10 p-3 text-primary">
                  <Presentation className="h-6 w-6" />
                </div>
                <h2 className="font-heading text-xl sm:text-2xl font-black text-slate-900 leading-tight">Training & Seminar Rooms</h2>
              </div>

              <p className="text-sm text-slate-605 leading-relaxed font-body">
                Premium multi-functional spaces tailored for technical training cohorts and executive presentations. Featuring state-of-the-art visual presentation hardware and pre-configured student computing terminals, these facilities support comprehensive knowledge transfer and professional seminars.
              </p>

              <div className="space-y-3.5 pt-2 border-t border-slate-200">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-widest block">Room Specifications:</span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 text-xs font-semibold text-slate-650 font-body">
                  {[
                    "Interactive smart displays & dual-projectors",
                    "Pre-configured student dev workstations",
                    "High-definition AV conferencing gear",
                    "Flexible seating plans up to 60 pax",
                    "Localized UPS power backup arrays",
                    "Integrated acoustics & presentation controls"
                  ].map((spec, sIdx) => (
                    <li key={sIdx} className="flex gap-2 items-start">
                      <Layers className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
