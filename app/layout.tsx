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
  title: "Mastering 3D Plant Engineering — Digitalisation & Automation",
  description:
    "A hands-on playbook for EPCs and owner-operators to design faster, reduce clashes, and deliver clean, handover-ready data.",
  metadataBase: new URL("https://your-domain.com"), // ← update to your real domain
  openGraph: {
    title: "Mastering 3D Plant Engineering — Digitalisation & Automation",
    description:
      "Practical guide to BIM, digital twins, and automation for EPCs & owner-operators.",
    url: "https://your-domain.com", // ← update to your real domain
    siteName: "3D Plant Engineering",
    images: [{ url: "/images/cover.jpg", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mastering 3D Plant Engineering",
    description:
      "Practical guide to BIM, digital twins, and automation for EPCs & owner-operators.",
    images: ["/images/cover.jpg"],
  },
  icons: { icon: "/favicon.ico" },
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
