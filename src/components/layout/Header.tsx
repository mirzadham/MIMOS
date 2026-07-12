"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X
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

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Track scroll position for threshold (10% viewport height)
  useEffect(() => {
    const handleScroll = () => {
      const threshold = window.innerHeight * 0.1;
      setIsScrolled(window.scrollY > threshold);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track mobile screen size for responsive variants
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lock scroll when mobile overlay is active
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Programmes", href: "/programs" },
    { name: "Facilities", href: "/facilities" },
    { name: "News", href: "/news" },
    { name: "Contact", href: "/contact" },
  ];

  const socialIconClass = isScrolled
    ? "rounded-full p-1.5 text-white hover:text-white/80 transition-all animate-none"
    : pathname === "/"
      ? "p-1.5 text-white hover:text-[#ff00cc] transition-all duration-200"
      : "p-1.5 text-black hover:text-[#ff00cc] transition-all duration-200";

  // Motion variants for the outer header inner container
  const headerVariants = {
    top: {
      width: "100%",
      maxWidth: "1280px",
      marginTop: "0px",
      height: "80px",
      backgroundColor: "rgba(255, 255, 255, 0)",
      borderRadius: "0px",
      borderWidth: "0px 0px 1px 0px",
      borderColor: "rgba(226, 232, 240, 0)", // transparent border
      boxShadow: "none",
      paddingLeft: isMobile ? "24px" : "32px",
      paddingRight: isMobile ? "24px" : "32px",
    },
    scrolled: {
      width: isMobile ? "90%" : "auto",
      maxWidth: isMobile ? "240px" : "620px", // compact floating bar width
      marginTop: "12px",
      height: "44px", // compact floating bar height
      backgroundColor: "#000000cc", // black with 80% opacity
      borderRadius: "12px", // rounded a little bit more
      borderWidth: "1px",
      borderColor: "rgba(51, 65, 85, 0.5)", // slate-800
      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3)",
      paddingLeft: isMobile ? "8px" : "12px",
      paddingRight: isMobile ? "8px" : "12px",
    }
  };

  // Motion variants for logo container clipping (cuts out text on scroll)
  const logoContainerVariants = {
    top: {
      width: "136px",
      height: "40px",
      transition: { duration: 0.3, ease: "easeOut" as const }
    },
    scrolled: {
      width: "32px",
      height: "32px",
      transition: { duration: 0.3, ease: "easeIn" as const }
    }
  };

  // Motion variants for control items fading out
  const controlsVariants = {
    top: {
      width: "auto",
      opacity: 1,
      scale: 1,
      display: "flex",
      transition: { duration: 0.3, ease: "easeOut" as const }
    },
    scrolled: {
      width: 0,
      opacity: 0,
      scale: 0.8,
      transitionEnd: { display: "none" },
      transition: { duration: 0.2, ease: "easeIn" as const }
    }
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full pointer-events-none bg-transparent">
      <motion.div
        layout
        initial="top"
        animate={isScrolled ? "scrolled" : "top"}
        variants={headerVariants}
        transition={{ type: "spring", stiffness: 180, damping: 24 }}
        className={`mx-auto flex items-center pointer-events-auto border-solid ${isScrolled
            ? "backdrop-blur-md justify-between md:justify-center md:gap-5"
            : "justify-between"
          }`}
      >

        {/* Logo - Top Left */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center group">
            <motion.div
              variants={logoContainerVariants}
              className="relative overflow-hidden flex items-center justify-start select-none"
            >
              {isScrolled && (
                <div className="absolute inset-[2px] bg-white -z-10" />
              )}
              <img
                src="/MIMOS-Academy.png"
                alt="MIMOS Academy"
                fetchPriority="high"
                className="h-full w-auto max-w-none block object-contain object-left relative z-10 transition-all"
                style={
                  !isScrolled && pathname === "/"
                    ? { filter: "drop-shadow(0 0 1.5px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 3px rgba(255, 255, 255, 0.7))" }
                    : undefined
                }
              />
            </motion.div>
          </Link>
        </div>

        {/* Desktop Navigation - Center / Right */}
        <nav className="hidden md:flex space-x-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                className={
                  isScrolled
                    ? `relative transition-all duration-250 rounded-lg font-semibold tracking-wide select-none px-3 py-1.5 text-xs text-white hover:text-white/80`
                    : `relative font-semibold tracking-wide select-none px-4 py-2 text-sm header-nav-link-not-scrolled ${
                        isActive ? "active" : pathname === "/" ? "inactive on-dark" : "inactive on-light"
                      }`
                }
              >
                <span className="relative z-10">{link.name}</span>
                {isActive && isScrolled && (
                  <motion.div
                    layoutId="activeNavUnderline"
                    className="absolute inset-0 rounded-lg border bg-white/10 border-white/10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Controls - Top Right */}
        <motion.div
          variants={controlsVariants}
          className="hidden md:flex items-center gap-4"
        >
          {/* Social Icons */}
          <div className="flex items-center gap-2">
            <a
              href="https://www.linkedin.com/company/mimosacademy/"
              target="_blank"
              rel="noopener noreferrer"
              className={socialIconClass}
              aria-label="LinkedIn"
            >
              <LinkedinIcon className="h-4 w-4" />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61567561791997"
              target="_blank"
              rel="noopener noreferrer"
              className={socialIconClass}
              aria-label="Facebook"
            >
              <FacebookIcon className="h-4 w-4" />
            </a>
            <a
              href="https://www.instagram.com/mimos.academy/"
              target="_blank"
              rel="noopener noreferrer"
              className={socialIconClass}
              aria-label="Instagram"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a
              href="https://x.com/MIMOSACADEMY?s=20"
              target="_blank"
              rel="noopener noreferrer"
              className={socialIconClass}
              aria-label="X (formerly Twitter)"
            >
              <XIcon className="h-4 w-4" />
            </a>
            <a
              href="https://www.tiktok.com/@mimos.academy?_r=1&_t=ZS-97niHcJy2wa"
              target="_blank"
              rel="noopener noreferrer"
              className={socialIconClass}
              aria-label="TikTok"
            >
              <TikTokIcon className="h-4 w-4" />
            </a>
          </div>

        </motion.div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`rounded-full p-2.5 transition-colors ${isScrolled
                ? "text-white hover:bg-white/10"
                : pathname === "/"
                  ? "text-white hover:bg-white/10"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </motion.div>

      {/* Mobile Fullscreen Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-50 bg-slate-950/98 backdrop-blur-xl flex flex-col justify-between p-8 pointer-events-auto"
          >
            {/* Header row */}
            <div className="flex items-center justify-between">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5">
                <div className="overflow-hidden flex h-10 w-10 items-center justify-center bg-white/10">
                  <img
                    src="/MIMOS-Academy.png"
                    alt="MIMOS Academy"
                    fetchPriority="high"
                    className="h-10 w-auto max-w-none block object-contain object-left"
                  />
                </div>
                <div className="flex flex-col select-none">
                  <span className="font-heading text-xl font-semibold tracking-tight text-white leading-none">
                    MIMOS
                  </span>
                  <span className="font-sans text-[10px] font-semibold tracking-widest text-primary uppercase mt-0.5">
                    Academy
                  </span>
                </div>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-full p-2.5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>

            {/* Nav Links Stack */}
            <nav className="flex flex-col items-center justify-center space-y-6 my-auto">
              {navLinks.map((link, idx) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-2xl font-semibold font-heading tracking-wide transition-colors ${isActive ? "text-primary" : "text-slate-300 hover:text-white"
                        }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Bottom Panel */}
            <div className="border-t border-slate-800 pt-6 flex flex-col gap-6">
              {/* Social Icons row */}
              <div className="flex gap-6 justify-center text-slate-400 py-2">
                <a href="https://www.linkedin.com/company/mimosacademy/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="LinkedIn"><LinkedinIcon className="h-6 w-6" /></a>
                <a href="https://www.facebook.com/profile.php?id=61567561791997" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Facebook"><FacebookIcon className="h-6 w-6" /></a>
                <a href="https://www.instagram.com/mimos.academy/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Instagram"><InstagramIcon className="h-6 w-6" /></a>
                <a href="https://x.com/MIMOSACADEMY?s=20" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="X (formerly Twitter)"><XIcon className="h-6 w-6" /></a>
                <a href="https://www.tiktok.com/@mimos.academy?_r=1&_t=ZS-97niHcJy2wa" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="TikTok"><TikTokIcon className="h-6 w-6" /></a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
