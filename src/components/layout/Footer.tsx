import Link from "next/link";
import { GraduationCap, Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-slate-50/50 text-slate-600">
      
      {/* Main Footer Links & Info */}
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/5 border border-primary/10">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-md font-extrabold tracking-tight text-slate-900 leading-none">
                  MIMOS
                </span>
                <span className="font-sans text-[9px] font-bold tracking-widest text-primary uppercase mt-0.5">
                  Academy
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed font-body">
              MIMOS Academy is the professional talent development arm of MIMOS Berhad, Malaysia&apos;s National Applied Research and Development Centre. We bridge education and industry through high-tech hands-on R&D training.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4 md:ml-8">
            <h3 className="font-heading text-xs font-bold tracking-wider text-slate-900 uppercase">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm font-semibold text-slate-500">
              <li>
                <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1 group">
                  <span>Home</span>
                  <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors flex items-center gap-1 group">
                  <span>About Us</span>
                  <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/programs" className="hover:text-primary transition-colors flex items-center gap-1 group">
                  <span>Programmes</span>
                  <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/facilities" className="hover:text-primary transition-colors flex items-center gap-1 group">
                  <span>Facilities</span>
                  <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 transition-all" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Bulletins */}
          <div className="space-y-4">
            <h3 className="font-heading text-xs font-bold tracking-wider text-slate-900 uppercase">
              Academy Bulletin
            </h3>
            <ul className="space-y-2.5 text-sm font-semibold text-slate-500">
              <li>
                <Link href="/news" className="hover:text-primary transition-colors">Upcoming Training Schedules</Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-primary transition-colors">Past Cohort Galleries</Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-primary transition-colors">Corporate Collaboration Notices</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Details */}
          <div className="space-y-4">
            <h3 className="font-heading text-xs font-bold tracking-wider text-slate-900 uppercase">
              Contact Us
            </h3>
            <ul className="space-y-3.5 text-sm font-medium text-slate-500">
              <li className="flex gap-2.5 items-start">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span className="text-slate-500 text-xs">
                  MIMOS Academy, Kulim Hi-Tech Park, 09000 Kulim, Kedah, Malaysia.
                </span>
              </li>
              <li className="flex gap-2.5 items-center">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-slate-500 text-xs font-semibold">Tel: +604-405 2540</span>
              </li>
              <li className="flex gap-2.5 items-center">
                <Mail className="h-4 w-4 text-primary" />
                <a href="mailto:academy@mimos.my" className="text-slate-500 hover:text-primary text-xs font-semibold transition-colors">
                  academy@mimos.my
                </a>
              </li>
              <li className="flex gap-2.5 items-start border-t border-slate-200/60 pt-3">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <span className="text-slate-400 text-[11px] leading-snug">
                  HQ: Technology Park Malaysia, Bukit Jalil, 57000 Kuala Lumpur.
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="mt-12 border-t border-slate-200/80 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} MIMOS Berhad. All Rights Reserved. | <a href="https://www.mimos.my/legal-notice/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-all">Legal Notice</a>
          </p>
          <div className="flex gap-1.5 items-center">
            <span>Powered by Next.js & Tailwind CSS</span>
          </div>
        </div>

      </div>

    </footer>
  );
}
