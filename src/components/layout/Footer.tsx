import Link from "next/link";
import { GraduationCap, Mail, Phone, Printer, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border/20 bg-foreground text-slate-300">
      
      {/* Main Footer Links & Info */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-7 w-7 text-primary" />
              <div className="flex flex-col">
                <span className="font-heading text-md font-bold tracking-tight text-white leading-none">
                  MIMOS
                </span>
                <span className="font-sans text-[10px] font-semibold tracking-widest text-primary uppercase">
                  Academy
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              MIMOS Academy is the professional talent development arm of MIMOS Berhad, Malaysia&apos;s National Applied Research and Development Centre. We deliver hands-on, physical upskilling programs in deep tech, semiconductors, and advanced software systems.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4 md:ml-8">
            <h3 className="font-heading text-sm font-bold tracking-wider text-white uppercase">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-gold transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gold transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/#programs-catalog" className="hover:text-gold transition-colors">Training Catalog</Link>
              </li>
              <li>
                <Link href="/facilities" className="hover:text-gold transition-colors">R&D Lab Facilities</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Bulletins */}
          <div className="space-y-4">
            <h3 className="font-heading text-sm font-bold tracking-wider text-white uppercase">
              Academy Bulletin
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/news" className="hover:text-gold transition-colors">Upcoming Training Schedules</Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-gold transition-colors">Past Cohort Galleries</Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-gold transition-colors">Corporate Collaboration Notices</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Details */}
          <div className="space-y-4">
            <h3 className="font-heading text-sm font-bold tracking-wider text-white uppercase">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2 items-start">
                <MapPin className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                <span className="text-slate-400">
                  MIMOS Academy, Kulim Hi-Tech Park, 09000 Kulim, Kedah Darul Aman, Malaysia.
                </span>
              </li>
              <li className="flex gap-2 items-center">
                <Phone className="h-4 w-4 text-gold" />
                <span className="text-slate-400">Tel: +604-405 2540</span>
              </li>
              <li className="flex gap-2 items-center">
                <Mail className="h-4 w-4 text-gold" />
                <a href="mailto:academy@mimos.my" className="text-slate-400 hover:text-gold">
                  academy@mimos.my
                </a>
              </li>
              <li className="flex gap-2 items-start">
                <MapPin className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                <span className="text-slate-400 text-xs italic">
                  HQ: Technology Park Malaysia, Bukit Jalil, 57000 Kuala Lumpur.
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="mt-8 border-t border-border/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            &copy; 2026 MIMOS Berhad. All Rights Reserved. | <a href="https://www.mimos.my/legal-notice/" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline">Legal Notice</a>
          </p>
          <div className="text-xs text-slate-500">
            Powered by Next.js & Tailwind CSS
          </div>
        </div>

      </div>

    </footer>
  );
}
