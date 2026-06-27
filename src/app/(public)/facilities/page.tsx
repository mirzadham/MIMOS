import { Cpu, Server, Shield, Layers, Image as ImageIcon } from "lucide-react";

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
      icon: Cpu
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
      icon: Server
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
      icon: Shield
    }
  ];
  return (
    <div className="bg-background min-h-screen py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-xs font-bold text-primary tracking-wider uppercase">Facility Tour</span>
          <h1 className="font-heading text-3xl font-extrabold text-foreground sm:text-5xl">
            National Technology Shared Facilities
          </h1>
          <p className="mx-auto max-w-3xl text-sm sm:text-md text-slate-500 leading-relaxed font-body">
            MIMOS Academy is located inside the main MIMOS Berhad headquarters, featuring direct shared access to Malaysia&apos;s top applied research laboratories and testing environments.
          </p>
        </div>

        {/* Labs Showcase */}
        <div className="space-y-12">
          {labs.map((lab, index) => {
            const Icon = lab.icon;
            return (
              <div key={index} className="grid grid-cols-1 gap-8 lg:grid-cols-2 items-center bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                
                {/* Visual placeholder box - no image generation */}
                <div className={`placeholder-image h-64 rounded-xl flex items-center justify-center text-slate-400 ${index % 2 === 1 ? 'lg:order-last' : ''}`}>
                  <div className="flex flex-col items-center gap-2">
                    <ImageIcon className="h-10 w-10 text-slate-300" />
                    <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Facility Image Placeholder</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-accent p-2.5 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h2 className="font-heading text-xl font-bold text-foreground">{lab.title}</h2>
                  </div>

                  <p className="text-sm text-slate-500 leading-relaxed font-body">
                    {lab.desc}
                  </p>

                  <div className="space-y-3">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider block">Lab Specifications:</span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-slate-600 font-body">
                      {lab.specs.map((spec, sIdx) => (
                        <li key={sIdx} className="flex gap-2 items-start">
                          <Layers className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
