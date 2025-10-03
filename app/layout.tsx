// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
  metadataBase: new URL("https://www.3dplantengineering.com"),
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
  alternates: { canonical: "/" },
  openGraph: {
    type: "book",
    url: "https://www.3dplantengineering.com",
    siteName: "3D Plant Engineering",
    title: "Mastering 3D Plant Engineering — Digitalisation & Automation",
    description:
      "Practical guide to BIM, digital twins, and automation for EPCs & owner-operators.",
    images: [
      {
        url: "/og/og-default.png",
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
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  themeColor: "#0b1220",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: "Mastering 3D Plant Engineering — Digitalisation & Automation",
    isbn: "978-93-49311-76-3",
    bookEdition: "Paperback",
    author: [
      {
        "@type": "Person",
        name: "Subhra Baran Sengupta",
        sameAs: "https://www.linkedin.com/in/subhra-sengupta-6aa3512a/",
      },
      {
        "@type": "Person",
        name: "Soumen Roy",
        sameAs: "https://www.linkedin.com/in/sowmenroy/",
      },
    ],
    publisher: {
      "@type": "Organization",
      name: "White Falcon Publishing",
    },
    url: "https://www.3dplantengineering.com",
    image: "https://www.3dplantengineering.com/og/og-default.png",
    workExample: [
      {
        "@type": "Book",
        bookFormat: "EBook",
        url: "https://www.amazon.com/dp/B0F9GXGZ96",
      },
    ],
    about:
      "Data-centric engineering, BIM, digital twins, AI/ML, handover data, EPC delivery",
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0b1220]`}
      >
        {children}

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Google Analytics (renders only if GA ID is set) */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  anonymize_ip: true,
                  allow_google_signals: false,
                  send_page_view: true
                });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
