// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.3dplantengineering.com"), // ✅ update if domain differs
  title: {
    default: "Mastering 3D Plant Engineering — Digitalisation & Automation",
    template: "%s | 3D Plant Engineering",
  },
  description:
    "Official website for the book 'Mastering 3D Plant Engineering, Digitalisation & Automation' by Soumen Roy & S.B. Sengupta — learnings, case studies, and where to buy.",
  keywords: [
    "3D Plant Engineering",
    "Digitalisation",
    "Automation",
    "Industry 4.0",
    "Industry 5.0",
    "BIM",
    "Digital Twin",
    "Soumen Roy",
    "S.B. Sengupta",
  ],
  authors: [{ name: "Soumen Roy" }, { name: "S.B. Sengupta" }],
  creator: "Soumen Roy",
  publisher: "3D Plant Engineering",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "book",
    url: "https://www.3dplantengineering.com",
    siteName: "3D Plant Engineering",
    title: "Mastering 3D Plant Engineering — Digitalisation & Automation",
    description:
      "Practical guide to BIM, digital twins, and automation for EPCs & owner-operators.",
    images: [
      {
        url: "/og/og-default.png", // ✅ put a 1200x630 image in public/og/
        width: 1200,
        height: 630,
        alt: "Mastering 3D Plant Engineering — Book Cover",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mastering 3D Plant Engineering",
    description:
      "Explore the official site of the book by Soumen Roy & S.B. Sengupta. Read highlights, download a sample, and find purchase links.",
    images: ["/og/og-default.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b1220",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0b1220]`}
      >
        {children}
      </body>
    </html>
  );
}
