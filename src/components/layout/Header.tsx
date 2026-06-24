"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Search, 
  Globe, 
  Menu, 
  X, 
  GraduationCap
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

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
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
    { name: "Programs", href: "/#programs-catalog" },
    { name: "Facilities", href: "/facilities" },
    { name: "News", href: "/news" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo - Top Left */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-[#d7569f]" />
            <div className="flex flex-col">
              <span className="font-heading text-lg font-bold tracking-tight text-slate-900 leading-none">
                MIMOS
              </span>
              <span className="font-sans text-xs font-semibold tracking-widest text-[#d7569f] uppercase">
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
                className={`text-sm font-semibold transition-colors duration-200 hover:text-[#d7569f] ${
                  isActive ? "text-[#d7569f]" : "text-slate-600"
                }`}
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
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            aria-label="Search site"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Language Selector */}
          <div className="relative group">
            <button className="flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
              <Globe className="h-3.5 w-3.5" />
              <span>{lang}</span>
            </button>
            <div className="absolute right-0 mt-1 hidden group-hover:block w-24 rounded-md border border-slate-200 bg-white shadow-lg z-50">
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
              href="https://www.linkedin.com/company/mimosmalaysia" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-400 hover:text-[#d7569f] transition-colors"
            >
              <LinkedinIcon className="h-4 w-4" />
            </a>
            <a 
              href="https://www.facebook.com/mimosmalaysia" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-400 hover:text-[#d7569f] transition-colors"
            >
              <FacebookIcon className="h-4 w-4" />
            </a>
            <a 
              href="https://twitter.com/mimosmalaysia" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-400 hover:text-[#d7569f] transition-colors"
            >
              <TwitterIcon className="h-4 w-4" />
            </a>
            <a 
              href="https://www.youtube.com/@mimosmalaysia" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-400 hover:text-[#d7569f] transition-colors"
            >
              <YoutubeIcon className="h-4 w-4" />
            </a>
          </div>

          {/* Quick Portal Access */}
          <Link
            href="/admin"
            className="rounded-md bg-[#d7569f] px-4 py-2 text-xs font-bold text-white hover:bg-[#c0438a] transition-all hover:shadow-md"
          >
            Admin Panel
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-3">
          <Link
            href="/admin"
            className="rounded-md bg-[#d7569f] px-3 py-1.5 text-xs font-bold text-white"
          >
            Portal
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
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
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[#d7569f] focus:outline-none"
            />
            <button className="rounded-md bg-[#d7569f] px-4 py-2 text-sm font-bold text-white hover:bg-[#c0438a]">
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
                className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#d7569f]"
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
                  className={`text-xs px-2.5 py-1 rounded border ${lang === 'EN' ? 'border-[#d7569f] bg-pink-50 text-[#d7569f]' : 'border-slate-200'}`}
                >
                  EN
                </button>
                <button 
                  onClick={() => setLang("BM")}
                  className={`text-xs px-2.5 py-1 rounded border ${lang === 'BM' ? 'border-[#d7569f] bg-pink-50 text-[#d7569f]' : 'border-slate-200'}`}
                >
                  BM
                </button>
              </div>
            </div>
            <div className="flex gap-3 justify-center text-slate-400 py-2">
              <a href="https://www.linkedin.com/company/mimosmalaysia"><LinkedinIcon className="h-5 w-5" /></a>
              <a href="https://www.facebook.com/mimosmalaysia"><FacebookIcon className="h-5 w-5" /></a>
              <a href="https://twitter.com/mimosmalaysia"><TwitterIcon className="h-5 w-5" /></a>
              <a href="https://www.youtube.com/@mimosmalaysia"><YoutubeIcon className="h-5 w-5" /></a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
