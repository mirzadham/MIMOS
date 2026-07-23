import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mimos-academy.my"),
  title: "MIMOS Academy - Applied R&D Talent Development",
  description:
    "Upskilling and physical training programs in Semiconductors, AI, Cybersecurity, 5G, and Professional Project Management by MIMOS Berhad.",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
    ],
    apple: "/icon.png",
  },
  openGraph: {
    siteName: "MIMOS Academy",
    title: "MIMOS Academy - Applied R&D Talent Development",
    description:
      "Upskilling and physical training programs in Semiconductors, AI, Cybersecurity, 5G, and Professional Project Management by MIMOS Berhad.",
    url: "https://mimos-academy.my",
    type: "website",
    images: [
      {
        url: "/MIMOS-Academy-dark.png",
        width: 620,
        height: 220,
        alt: "MIMOS Academy Logo",
      },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://mimos-academy.my/#website",
      "url": "https://mimos-academy.my",
      "name": "MIMOS Academy",
      "alternateName": ["MIMOS Academy Malaysia"],
    },
    {
      "@type": "Organization",
      "@id": "https://mimos-academy.my/#organization",
      "name": "MIMOS Academy",
      "url": "https://mimos-academy.my",
      "logo": "https://mimos-academy.my/icon.png",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
