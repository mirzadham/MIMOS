"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Programmes", href: "/programs" },
    { name: "Facilities", href: "/facilities" },
    { name: "News", href: "/news" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      isScrolled 
        ? "border-b border-slate-100 bg-white/90 backdrop-blur-md shadow-sm" 
        : "border-b border-transparent bg-transparent"
    }`}>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        
        {/* Logo - Top Left */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 transition-all duration-300 group-hover:bg-primary">
              <GraduationCap className="h-6 w-6 text-primary transition-colors duration-300 group-hover:text-white" />
              <div className="absolute -inset-0.5 rounded-xl bg-primary/20 opacity-0 blur group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-xl font-black tracking-tight text-slate-900 leading-none">
                MIMOS
              </span>
              <span className="font-sans text-[10px] font-bold tracking-widest text-primary uppercase mt-0.5">
                Academy
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation - Center */}
        <nav className="hidden md:flex space-x-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-bold tracking-wide transition-colors duration-200 rounded-lg hover:text-primary ${
                  isActive ? "text-primary" : "text-slate-600"
                }`}
              >
                <span className="relative z-10">{link.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeNavUnderline"
                    className="absolute inset-0 bg-primary/5 rounded-lg border border-primary/10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Controls - Top Right */}
        <div className="hidden md:flex items-center gap-4">
          
          {/* Animated Search Input Wrapper */}
          <div className="relative flex items-center">
            <AnimatePresence initial={false}>
              {searchOpen && (
                <motion.div 
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 220, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden mr-2"
                >
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search courses..."
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-1.5 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 text-slate-800 placeholder-slate-400 font-medium"
                    autoFocus
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <button 
              onClick={() => setSearchOpen(!searchOpen)}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-primary transition-all cursor-pointer"
              aria-label="Search"
            >
              {searchOpen ? <X className="h-4.5 w-4.5" /> : <Search className="h-4.5 w-4.5" />}
            </button>
          </div>

          {/* Language Selector */}
          <div className="relative group/lang">
            <button className="flex items-center gap-1 rounded-lg border border-slate-200/80 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all">
              <Globe className="h-3.5 w-3.5 text-slate-400" />
              <span>{lang}</span>
              <ChevronDown className="h-3 w-3 text-slate-400 group-hover/lang:rotate-180 transition-transform duration-200" />
            </button>
            <div className="absolute right-0 mt-1.5 w-28 origin-top-right rounded-lg border border-slate-100 bg-white p-1 shadow-sm opacity-0 invisible group-hover/lang:opacity-100 group-hover/lang:visible transition-all duration-200 z-50">
              <button 
                onClick={() => setLang("EN")}
                className="w-full rounded-md px-3 py-2 text-left text-xs font-bold hover:bg-slate-50 text-slate-700 transition-colors"
              >
                English
              </button>
              <button 
                onClick={() => setLang("BM")}
                className="w-full rounded-md px-3 py-2 text-left text-xs font-bold hover:bg-slate-50 text-slate-700 transition-colors"
              >
                B. Melayu
              </button>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-2 border-l border-slate-200/80 pl-4">
            <a 
              href="https://www.linkedin.com/company/mimosacademy/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="rounded-full p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 transition-all"
            >
              <LinkedinIcon className="h-4 w-4" />
            </a>
            <a 
              href="https://www.facebook.com/profile.php?id=61567561791997" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="rounded-full p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 transition-all"
            >
              <FacebookIcon className="h-4 w-4" />
            </a>
            <a 
              href="https://www.instagram.com/mimos.academy/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="rounded-full p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 transition-all"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a 
              href="https://x.com/MIMOSACADEMY?s=20" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="rounded-full p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 transition-all"
            >
              <XIcon className="h-4 w-4" />
            </a>
          </div>

        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-xl overflow-hidden shadow-inner"
          >
            <div className="px-6 py-5 space-y-4">
              <nav className="flex flex-col space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
              
              <div className="border-t border-slate-100 pt-4 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Language:</span>
                  <div className="flex gap-1 bg-slate-50 p-0.5 rounded-md border border-slate-200/60">
                    <button 
                      onClick={() => setLang("EN")}
                      className={`text-xs font-bold px-3 py-1 rounded-md transition-colors ${lang === 'EN' ? 'bg-white text-primary shadow-sm' : 'text-slate-600'}`}
                    >
                      EN
                    </button>
                    <button 
                      onClick={() => setLang("BM")}
                      className={`text-xs font-bold px-3 py-1 rounded-md transition-colors ${lang === 'BM' ? 'bg-white text-primary shadow-sm' : 'text-slate-600'}`}
                    >
                      BM
                    </button>
                  </div>
                </div>

                <div className="flex gap-4 justify-center text-slate-400 py-2 border-t border-slate-100">
                  <a href="https://www.linkedin.com/company/mimosacademy/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><LinkedinIcon className="h-5 w-5" /></a>
                  <a href="https://www.facebook.com/profile.php?id=61567561791997" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><FacebookIcon className="h-5 w-5" /></a>
                  <a href="https://www.instagram.com/mimos.academy/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><InstagramIcon className="h-5 w-5" /></a>
                  <a href="https://x.com/MIMOSACADEMY?s=20" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><XIcon className="h-5 w-5" /></a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
