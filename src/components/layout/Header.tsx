"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Search, 
  Globe, 
  Menu, 
  X, 
  GraduationCap,
  ChevronDown
} from "lucide-react";

// Safe SVG fallbacks for social icons
const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
);

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState("EN");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Programs", href: "/programs" },
    { name: "Facilities", href: "/facilities" },
    { name: "News", href: "/news" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo - Top Left */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <GraduationCap className="h-8 w-8 text-primary transition-colors duration-300" />
            <div className="flex flex-col">
              <span className="font-heading text-lg font-bold tracking-tight text-foreground leading-none">
                MIMOS
              </span>
              <span className="font-sans text-xs font-semibold tracking-widest text-primary transition-colors duration-300 uppercase">
                Academy
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation - Center */}
        <nav className="hidden md:flex space-x-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-semibold transition-all duration-200 relative py-1 hover:text-primary ${
                  isActive ? "text-primary after:scale-x-100" : "text-slate-600 after:scale-x-0"
                } after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary after:origin-left after:transition-transform after:duration-200`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Controls - Top Right */}
        <div className="hidden md:flex items-center gap-4">
          
          {/* Search Trigger */}
          <button 
            onClick={() => setSearchOpen(!searchOpen)}
            className="rounded-md p-2 text-slate-400 hover:bg-slate-50 hover:text-primary transition-all"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Language Selector */}
          <div className="relative group/lang">
            <button className="flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all">
              <Globe className="h-3.5 w-3.5" />
              <span>{lang}</span>
              <ChevronDown className="h-3 w-3" />
            </button>
            <div className="absolute right-0 mt-1 w-28 origin-top-right rounded-md border border-slate-100 bg-white shadow-lg ring-1 ring-black/5 opacity-0 invisible group-hover/lang:opacity-100 group-hover/lang:visible transition-all duration-200 z-50">
              <button 
                onClick={() => setLang("EN")}
                className="w-full px-3 py-2 text-left text-xs font-semibold hover:bg-slate-50 text-slate-700"
              >
                English
              </button>
              <button 
                onClick={() => setLang("BM")}
                className="w-full px-3 py-2 text-left text-xs font-semibold hover:bg-slate-50 text-slate-700 border-t border-slate-100"
              >
                B. Melayu
              </button>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
            <a 
              href="https://www.linkedin.com/company/mimosacademy/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-400 hover:text-primary transition-colors"
            >
              <LinkedinIcon className="h-4 w-4" />
            </a>
            <a 
              href="https://www.facebook.com/profile.php?id=61567561791997" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-400 hover:text-primary transition-colors"
            >
              <FacebookIcon className="h-4 w-4" />
            </a>
            <a 
              href="https://www.instagram.com/mimos.academy/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-400 hover:text-primary transition-colors"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a 
              href="https://x.com/MIMOSACADEMY?s=20" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-400 hover:text-primary transition-colors"
            >
              <XIcon className="h-4 w-4" />
            </a>
          </div>


        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-3">

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-foreground"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

      </div>

      {/* Search Dropdown Overlay */}
      {searchOpen && (
        <div className="absolute top-16 left-0 w-full border-b border-slate-200 bg-white p-4 shadow-md z-40">
          <div className="mx-auto max-w-3xl flex gap-2">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search training programs, labs, news..."
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
            <button className="rounded-md bg-primary hover:bg-primary-hover px-4 py-2 text-sm font-bold text-white transition-all cursor-pointer">
              Search
            </button>
            <button 
              onClick={() => setSearchOpen(false)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 shadow-inner">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary"
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="border-t border-slate-100 pt-3 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Language:</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => setLang("EN")}
                  className={`text-xs px-2.5 py-1 rounded border ${lang === 'EN' ? 'border-primary bg-accent text-primary' : 'border-slate-200'}`}
                >
                  EN
                </button>
                <button 
                  onClick={() => setLang("BM")}
                  className={`text-xs px-2.5 py-1 rounded border ${lang === 'BM' ? 'border-primary bg-accent text-primary' : 'border-slate-200'}`}
                >
                  BM
                </button>
              </div>
            </div>
            <div className="flex gap-3 justify-center text-slate-400 py-2">
              <a href="https://www.linkedin.com/company/mimosacademy/" target="_blank" rel="noopener noreferrer"><LinkedinIcon className="h-5 w-5 hover:text-primary transition-colors" /></a>
              <a href="https://www.facebook.com/profile.php?id=61567561791997" target="_blank" rel="noopener noreferrer"><FacebookIcon className="h-5 w-5 hover:text-primary transition-colors" /></a>
              <a href="https://www.instagram.com/mimos.academy/" target="_blank" rel="noopener noreferrer"><InstagramIcon className="h-5 w-5 hover:text-primary transition-colors" /></a>
              <a href="https://x.com/MIMOSACADEMY?s=20" target="_blank" rel="noopener noreferrer"><XIcon className="h-5 w-5 hover:text-primary transition-colors" /></a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
