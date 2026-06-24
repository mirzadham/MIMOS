import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MIMOS Academy - Applied R&D Talent Development",
  description: "Upskilling and physical training programs in Semiconductors, AI, Cybersecurity, 5G, and Professional Project Management by MIMOS Berhad.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
