import Link from "next/link";
import React from "react";
import Image from "next/image";

// Component representing a single row of dots flowing at independent speeds
const MovingDotsRow = ({ rowIndex }: { rowIndex: number }) => {
  const dotCount = 28; // Increased dot density
  const dots: React.ReactNode[] = [];
  
  // Seeded random helper so the delays and durations are stable and consistent on renders
  let seed = rowIndex * 123;
  const random = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  for (let i = 0; i < dotCount; i++) {
    // Slowed down the dots: duration between 25s and 45s
    const duration = 25 + random() * 20; 
    // Randomize delay between -45s and 0s to match new slower speed distribution
    const delay = -random() * 45;
    // Slight vertical wobble within the row
    const yOffset = (random() - 0.5) * 6; // -3px to +3px
    const opacity = 0.45 + random() * 0.45; // 0.45 to 0.9
    const isDouble = random() > 0.8; // 20% chance of being a double-dot

    const dotStyle: React.CSSProperties = {
      position: 'absolute',
      left: 0,
      top: `calc(50% + ${yOffset}px)`,
      opacity: opacity,
      animation: `dot-move-left ${duration}s linear infinite`,
      animationDelay: `${delay}s`,
      willChange: 'transform',
    };

    dots.push(
      <div key={i} style={dotStyle} className="pointer-events-none select-none">
        {isDouble ? (
          <div className="flex gap-[3px]">
            {/* Tighter shadow glow for a cleaner look */}
            <div className="w-[3px] h-[3px] rounded-full bg-[#ff00cc] shadow-[0_0_2px_#ff00cc]" />
            <div className="w-[3px] h-[3px] rounded-full bg-[#ff00cc] shadow-[0_0_2px_#ff00cc]" />
          </div>
        ) : (
          <div className="w-[5px] h-[5px] rounded-full bg-[#ff00cc] shadow-[0_0_3px_#ff00cc]" />
        )}
      </div>
    );
  }

  return (
    <div className="w-full relative h-8 overflow-hidden bg-transparent">
      {dots}
    </div>
  );
};

export default function Footer() {
  return (
    <footer className="w-full bg-background border-t border-slate-200 text-slate-900 md:h-[580px] flex flex-col justify-between relative font-sans">
      
      {/* Top Spacer: 3rem (48px) */}
      <div className="h-12 w-full block shrink-0" aria-hidden="true" />

      {/* Top Part: Tagline & Sleek Columns (Padded layout aligned to grid) */}
      <div className="mx-auto max-w-[1440px] w-full px-8 md:px-16 flex flex-col lg:flex-row justify-between items-start gap-16 lg:gap-8 relative z-2">
        {/* Tagline */}
        <div className="max-w-2xl">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-[42px] lg:text-[46px] font-light tracking-tight text-slate-900 leading-[1.08]">
            Driving Malaysia&apos;s<br />
            High-Tech Excellence
          </h2>
        </div>

        {/* Right side: Sleek Columns (No Titles, No Icons) */}
        <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 lg:gap-28 text-sm text-slate-900 font-semibold self-stretch lg:self-auto justify-end">
          {/* Quick Links Column */}
          <ul className="space-y-4">
            <li>
              <Link href="/" className="hover:text-primary transition-colors footer-hover-line">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-primary transition-colors footer-hover-line">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/programs" className="hover:text-primary transition-colors footer-hover-line">
                Programmes
              </Link>
            </li>
            <li>
              <Link href="/facilities" className="hover:text-primary transition-colors footer-hover-line">
                Facilities
              </Link>
            </li>
          </ul>

          {/* Contact Details Column */}
          <div className="space-y-4">
            <p>
              <a 
                href="https://www.google.com/maps/search/?api=1&query=Technology+Park+Malaysia,+Kuala+Lumpur" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-primary transition-colors footer-hover-line"
              >
                Technology Park Malaysia, Kuala Lumpur
              </a>
            </p>
            <p>
              <a 
                href="https://www.google.com/maps/search/?api=1&query=Kulim+Hi-Tech+Park,+Kedah" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-primary transition-colors footer-hover-line"
              >
                Kulim Hi-Tech Park, Kedah
              </a>
            </p>
            <p>
              <a 
                href="tel:+6044052540" 
                className="hover:text-primary transition-colors footer-hover-line"
              >
                Tel: +604-405 2540
              </a>
            </p>
            <p>
              <a 
                href="mailto:academy@mimos.my" 
                className="hover:text-primary transition-colors footer-hover-line"
              >
                academy@mimos.my
              </a>
            </p>
          </div>

          {/* Social Links Column */}
          <ul className="space-y-4">
            <li>
              <a 
                href="https://www.linkedin.com/company/mimosacademy/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-primary transition-colors footer-hover-line"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a 
                href="https://www.facebook.com/profile.php?id=61567561791997" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-primary transition-colors footer-hover-line"
              >
                Facebook
              </a>
            </li>
            <li>
              <a 
                href="https://www.instagram.com/mimos.academy/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-primary transition-colors footer-hover-line"
              >
                Instagram
              </a>
            </li>
            <li>
              <a 
                href="https://x.com/MIMOSACADEMY?s=20" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-primary transition-colors footer-hover-line"
              >
                X
              </a>
            </li>
            <li>
              <a 
                href="https://www.tiktok.com/@mimos.academy?_r=1&_t=ZS-97niHcJy2wa" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-primary transition-colors footer-hover-line"
              >
                TikTok
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Middle Part: Horizontal Moving Dot Matrix (Borderless, full edge-to-edge width, no horizontal spacing) */}
      <div className="w-full overflow-hidden my-12 py-2 h-[120px] flex flex-col justify-around relative z-1 bg-transparent">
        {/* Style block for the custom particle translate animation */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes dot-move-left {
            0% {
              transform: translateX(102vw);
            }
            100% {
              transform: translateX(-10vw);
            }
          }
        `}} />
        <MovingDotsRow rowIndex={0} />
        <MovingDotsRow rowIndex={1} />
        <MovingDotsRow rowIndex={2} />
      </div>

      {/* Bottom Part: Logo & Copyright (Borderless, padded layout aligned to grid) */}
      <div className="mx-auto max-w-[1440px] w-full px-8 md:px-16 flex flex-col sm:flex-row justify-between items-center gap-8 relative z-2">
        {/* Logo on the Bottom Left */}
        <Link href="/" className="flex items-center">
          <Image 
            src="/MIMOS-Academy-dark.png" 
            alt="MIMOS Academy Logo" 
            width={180}
            height={64}
            className="h-16 w-auto object-contain block"
          />
        </Link>

        {/* Copyright on the Bottom Right */}
        <span className="text-xs font-semibold text-slate-400 select-none">
          &copy; {new Date().getFullYear()} MIMOS Academy. All Rights Reserved.
        </span>
      </div>

      {/* Bottom Spacer: 3rem (48px) */}
      <div className="h-12 w-full block shrink-0" aria-hidden="true" />

    </footer>
  );
}

