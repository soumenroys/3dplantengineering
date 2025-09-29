// app/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  Facebook,
  BookOpen,
  Youtube,
  ShoppingCart,
  Instagram,
  ExternalLink,
} from "lucide-react";
import { getCookieCountry } from "../lib/client/country";

// ===== Social links (your real pages) =====
const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61579794313524";
const INSTAGRAM_URL = "https://www.instagram.com/roy_3d/";
const YOUTUBE_URL = "https://www.youtube.com/@3DPlantEngineering-e4f3b/videos";
const GOODREADS_URL =
  "https://www.goodreads.com/author/list/34690983.Soumen_Roy";

// ===== Files under /public =====
const SAMPLE_PDF = "/sample/Sample.pdf"; // /public/sample/Sample.pdf
const PRESS_KIT_ZIP = "/press/press-kit.zip";
const PRESS_SHEET_PDF = "/press/press-sheet.pdf";
const QR_AMZN_IN = "/images/qr-amazon-in.png";
const QR_AMZN_COM = "/images/qr-amazon-com.png";

// ===== Author headshots (add these files to /public/images/authors/) =====
const AUTHOR_SB_IMG = "/images/authors/sb-sengupta.jpg"; // 800x800 JPG/PNG
const AUTHOR_SR_IMG = "/images/authors/soumen-roy.jpg"; // 800x800 JPG/PNG

// ===== Extra Stores =====
const FLIPKART_URL =
  "https://www.flipkart.com/product/p/itme?pid=9789349311763";
const WFP_STORE_URL =
  "https://store.whitefalconpublishing.com/products/mastering-3d-plant-engineering-digitalisation-automation";

// ===== Contact =====
const CONTACT_EMAIL = "plantengineering3d@gmail.com";

// ===== Navigation links =====
const nav = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#toc", label: "Contents" },
  { href: "#sample", label: "Sample" },
  { href: "#reviews", label: "Reviews" },
  { href: "#authors", label: "Authors" },
  { href: "#buy", label: "Buy" },
  { href: "#press", label: "Press Kit" },
  { href: "#blog", label: "Blog" },
  { href: "#contact", label: "Contact" },
];

// ===== Store links (Main Book: B0F9GXGZ96) =====
type CC =
  | "US"
  | "UK"
  | "DE"
  | "BR"
  | "CA"
  | "AU"
  | "FR"
  | "MX"
  | "ES"
  | "IT"
  | "NL"
  | "JP"
  | "IN"
  | "PL"
  | "SE";

const AMAZON_BOOK: Record<CC, string> = {
  US: "https://www.amazon.com/dp/B0F9GXGZ96",
  UK: "https://www.amazon.co.uk/dp/B0F9GXGZ96",
  DE: "https://www.amazon.de/dp/B0F9GXGZ96",
  BR: "https://www.amazon.com.br/dp/B0F9GXGZ96",
  CA: "https://www.amazon.ca/dp/B0F9GXGZ96",
  AU: "https://www.amazon.com.au/dp/B0F9GXGZ96",
  FR: "https://www.amazon.fr/dp/B0F9GXGZ96",
  MX: "https://www.amazon.com.mx/dp/B0F9GXGZ96",
  ES: "https://www.amazon.es/dp/B0F9GXGZ96",
  IT: "https://www.amazon.it/dp/B0F9GXGZ96",
  NL: "https://www.amazon.nl/dp/B0F9GXGZ96",
  JP: "https://www.amazon.co.jp/dp/B0F9GXGZ96",
  IN: "https://www.amazon.in/dp/B0F9GXGZ96",
  PL: "https://www.amazon.pl/dp/B0F9GXGZ96",
  SE: "https://www.amazon.se/dp/B0F9GXGZ96",
};

// ===== International Edition (B0F7M239VJ) =====
const AMAZON_INTL: Record<CC, string> = {
  US: "https://www.amazon.com/dp/B0F7M239VJ",
  UK: "https://www.amazon.co.uk/dp/B0F7M239VJ",
  DE: "https://www.amazon.de/dp/B0F7M239VJ",
  BR: "https://www.amazon.com.br/dp/B0F7M239VJ",
  CA: "https://www.amazon.ca/dp/B0F7M239VJ",
  AU: "https://www.amazon.com.au/dp/B0F7M239VJ",
  FR: "https://www.amazon.fr/dp/B0F7M239VJ",
  MX: "https://www.amazon.com.mx/dp/B0F7M239VJ",
  ES: "https://www.amazon.es/dp/B0F7M239VJ",
  IT: "https://www.amazon.it/dp/B0F7M239VJ",
  NL: "https://www.amazon.nl/dp/B0F7M239VJ",
  JP: "https://www.amazon.co.jp/dp/B0F7M239VJ",
  IN: "https://www.amazon.in/dp/B0F7M239VJ",
  PL: "https://www.amazon.pl/dp/B0F7M239VJ",
  SE: "https://www.amazon.se/dp/B0F7M239VJ",
};

function detectIN(): boolean {
  try {
    const lang = (navigator.language || "").toUpperCase();
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (lang.endsWith("-IN") || tz === "Asia/Kolkata") return true;
  } catch {}
  return false;
}

// Deterministic date formatter (SSR/client safe)
function formatDateDDMMYYYY(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year = d.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

const Pill = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur">
    {children}
  </span>
);

const CTA = ({
  href = "#",
  target,
  rel,
  children,
  ariaLabel,
}: {
  href?: string;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
  children: React.ReactNode;
  ariaLabel?: string;
}) => (
  <a
    href={href}
    target={target}
    rel={rel}
    aria-label={ariaLabel}
    className="inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_30px_rgb(2,6,23,0.35)] outline-none transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-orange-400"
    style={{
      background:
        "linear-gradient(135deg, rgba(249,115,22,1) 0%, rgba(245,158,11,1) 100%)",
    }}
  >
    {children}
  </a>
);

const Ghost = ({
  href = "#",
  children,
  target,
  rel,
  ariaLabel,
}: {
  href?: string;
  children: React.ReactNode;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
  ariaLabel?: string;
}) => (
  <a
    href={href}
    target={target}
    rel={rel}
    aria-label={ariaLabel}
    className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 backdrop-blur transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/40"
  >
    {children}
  </a>
);

const SectionTitle = ({
  kicker,
  title,
  sub,
}: {
  kicker?: string;
  title: string;
  sub?: string;
}) => (
  <header className="mb-8">
    {kicker && (
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-orange-400">
        {kicker}
      </p>
    )}
    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-white">
      {title}
    </h2>
    {sub && <p className="mt-3 max-w-2xl text-white/70">{sub}</p>}
  </header>
);

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/0 p-6 shadow-inner">
    {children}
  </div>
);

// ————————— TOC —————————
function TOCAccordion() {
  const [open, setOpen] = useState<number | null>(0);
  const items = [
    {
      h: "Foundations",
      t: [
        "Why Data-Centric Engineering Wins",
        "Core Toolchain: BIM, P&IDs, 3D, Document Control",
        "Standards & Governance",
      ],
    },
    {
      h: "Design & Automation",
      t: [
        "Intelligent P&IDs & Tagging",
        "Parametric Libraries & CAD Automation",
        "Concurrent Worksharing & Clash Avoidance",
      ],
    },
    {
      h: "Digital Twins & AI",
      t: [
        "From 3D to Digital Twin",
        "Photogrammetry, LiDAR & Reality Capture",
        "AI/ML for Quality & Throughput",
      ],
    },
    {
      h: "Delivery & Handover",
      t: [
        "Data Handover, CMMS/ERP Integrations",
        "Owner-Operator Readiness",
        "KPIs & ROI Dashboards",
      ],
    },
  ];
  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div key={idx} className="overflow-hidden rounded-xl border border-white/10">
          <button
            onClick={() => setOpen(open === idx ? null : idx)}
            className="flex w-full items-center justify-between bg-white/5 px-4 py-3 text-left text-white"
            aria-expanded={open === idx}
            aria-controls={`toc-panel-${idx}`}
          >
            <span className="text-sm sm:text-base font-semibold">{item.h}</span>
            <span className="text-white/70">{open === idx ? "−" : "+"}</span>
          </button>
          <div
            id={`toc-panel-${idx}`}
            className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
              open === idx ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            <div className="min-h-0 overflow-hidden bg-white/0 px-4 pb-4">
              <ul className="list-disc pl-6 text-white/80">
                {item.t.map((t, j) => (
                  <li key={j} className="py-1 text-sm sm:text-base">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ————————— Socials —————————
function SocialLinks() {
  return (
    <div className="flex gap-4" aria-label="Social links">
      <a
        href={FACEBOOK_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-white/70 hover:text-white"
        aria-label="Facebook"
      >
        <Facebook className="h-5 w-5" />
      </a>
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-white/70 hover:text-white"
        aria-label="Instagram"
      >
        <Instagram className="h-5 w-5" />
      </a>
      <a
        href={YOUTUBE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-white/70 hover:text-white"
        aria-label="YouTube"
      >
        <Youtube className="h-5 w-5" />
      </a>
      <a
        href={GOODREADS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-white/70 hover:text-white"
        aria-label="Goodreads Author Page"
      >
        <BookOpen className="h-5 w-5" />
      </a>
    </div>
  );
}

function GoodreadsButton({ href = GOODREADS_URL }: { href?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Add this book on Goodreads"
      className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold shadow-[0_8px_30px_rgb(2,6,23,0.35)] transition focus-visible:ring-2 focus-visible:ring-white/40"
      style={{ background: "#382110", color: "#fff" }}
    >
      <BookOpen className="h-4 w-4" />
      <span>Add on Goodreads</span>
    </a>
  );
}

// ————————— Blog data —————————
const posts = [
  {
    title: "How Data-Centric Engineering Cuts Rework by 30%",
    date: "2025-08-18",
    href: "/blog/data-centric-engineering-cuts-rework",
    excerpt:
      "A simple governance model and clean tagging scheme can eliminate a shocking amount of churn. Here&rsquo;s the checklist we use.",
  },
  {
    title: "From 3D Models to Living Digital Twins",
    date: "2025-07-02",
    href: "/blog/from-3d-models-to-living-digital-twins",
    excerpt:
      "Digital twins aren&rsquo;t a &lsquo;deliverable&rsquo;&mdash;they&rsquo;re a process. This post covers integrations, sync cadence, and ownership.",
  },
  {
    title: "Getting Started with AI/ML for Plant QA",
    date: "2025-06-10",
    href: "/blog/ai-ml-plant-qa-getting-started",
    excerpt:
      "Practical use-cases where AI catches issues earlier: spec mismatches, missing metadata, and model integrity checks.",
  },
];

export default function BookWebsiteDesign() {
  const [isIN, setIsIN] = useState<boolean>(false);
  const [country, setCountry] = useState<CC>("US");

  useEffect(() => {
    const cookieCC = getCookieCountry();
    if (cookieCC) {
      setCountry(cookieCC as CC);
      setIsIN(cookieCC === "IN");
    } else {
      const inUser = detectIN();
      setIsIN(inUser);
      setCountry(inUser ? "IN" : "US");
    }
  }, []);

  // Persist selection + sync isIN
  const onCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cc = e.target.value as CC;
    setCountry(cc);
    setIsIN(cc === "IN");
    document.cookie = `country=${cc}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  };

  // Hero buy/QR: simple IN vs GLOBAL
  const heroBuyUrl = isIN ? AMAZON_BOOK.IN : AMAZON_BOOK.US;
  const heroQR = isIN ? QR_AMZN_IN : QR_AMZN_COM;
  const heroLabel = isIN ? "Amazon India" : "Amazon.com";

  // Buy section: use selected country for both editions
  const bookUrl = AMAZON_BOOK[country] || AMAZON_BOOK.US;
  const intlUrl = AMAZON_INTL[country] || AMAZON_INTL.US;

  return (
    <div className="min-h-screen scroll-smooth bg-[#0b1220] text-white">
      {/* Glow background */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(600px 300px at 20% 10%, rgba(249,115,22,0.25), transparent 60%), radial-gradient(600px 300px at 80% 0%, rgba(56,189,248,0.16), transparent 60%)",
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b1220]/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <a href="#home" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400" />
            <div className="text-sm font-bold tracking-wide">3D Plant Engineering</div>
          </a>
          <nav className="hidden gap-2 md:flex" aria-label="Primary">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="rounded-lg px-3 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-4">
            <SocialLinks />
            <CTA href={heroBuyUrl} target="_blank" rel="noopener noreferrer" ariaLabel="Buy now">
              Buy Now
            </CTA>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="home" className="relative">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-10 px-4 py-16 md:grid-cols-2">
          <div>
            <Pill>Practical guide • BIM • Digital Twins • AI</Pill>
            <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
              Mastering 3D Plant Engineering, Digitalisation & Automation
            </h1>
            <p className="mt-4 max-w-xl text-white/80">
              A hands-on playbook for EPCs and owner-operators to design faster, automate deliverables,
              reduce clashes, and hand over clean datasets ready for operations.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <CTA href={SAMPLE_PDF} target="_blank" rel="noopener noreferrer" ariaLabel="Read sample PDF">
                Read Sample (PDF)
              </CTA>
              <Ghost href={heroBuyUrl} target="_blank" rel="noopener noreferrer" ariaLabel={`Buy on ${heroLabel}`}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Buy on {heroLabel}
              </Ghost>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 text-white/70">
              <Pill>For EPC / Owners</Pill>
              <Pill>Clash ↓, Throughput ↑</Pill>
              <Pill>Data-centric Handover</Pill>
            </div>

            {/* QR quick-scan block */}
            <div className="mt-8 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <img
                src={heroQR}
                alt={`Scan to buy on ${heroLabel}`}
                className="h-28 w-28 rounded-lg border border-white/10"
                loading="lazy"
                decoding="async"
              />
              <div>
                <p className="text-sm text-white/80">
                  Prefer mobile? Scan this QR to open the book on {heroLabel}.
                </p>
                <a
                  href={heroBuyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm text-orange-300 underline"
                >
                  Open {heroLabel} →
                </a>
              </div>
            </div>

            <div className="mt-6">
              <SocialLinks />
            </div>
          </div>

          {/* Book cover → clickable */}
          <div className="mx-auto w/full max-w-sm">
            <a
              href={heroBuyUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Buy on ${heroLabel}`}
              title={`Buy on ${heroLabel}`}
            >
              <img
                src="/images/cover.jpg"
                alt="Mastering 3D Plant Engineering book cover"
                className="rounded-3xl shadow-2xl border border-white/10 transition hover:opacity-90"
                loading="lazy"
                decoding="async"
              />
            </a>
            <p className="mt-2 text-center text-xs text-white/60">
              Clicking the cover opens {heroLabel} in a new tab.
            </p>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="border-t border-white/10 bg-white/5">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <SectionTitle
            kicker="About the Book"
            title="Build plants smarter with data-centric design"
            sub="From intelligent P&IDs and parametric catalogs to digital twins and AI—this book turns best practices into a repeatable playbook for EPCs and owner-operators."
          />
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <h3 className="text-lg font-semibold">Who it's for</h3>
              <p className="mt-2 text-white/70 text-sm">
                Engineering managers, BIM leads, piping designers, project controls, QA/QC, and owner-operator teams who need faster, clash-free, handover-ready projects.
              </p>
            </Card>
            <Card>
              <h3 className="text-lg font-semibold">What you'll get</h3>
              <p className="mt-2 text-white/70 text-sm">
                Clear workflows, checklists, KPIs, and templates to reduce rework, automate deliverables, and deliver clean, structured data that integrates with CMMS/ERP.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Contents */}
      <section id="toc" className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <SectionTitle kicker="Inside the Book" title="Table of Contents" sub="Expand each part to preview chapters" />
          <TOCAccordion />
        </div>
      </section>

      {/* Sample */}
      <section id="sample" className="border-t border-white/10 bg-white/5">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <SectionTitle
            kicker="Free Excerpt"
            title="Read a Sample Chapter"
            sub="Download a short PDF to get a feel for the writing, structure, and tools we recommend."
          />
          <div className="flex flex-wrap items-center gap-3">
            <CTA href={SAMPLE_PDF} target="_blank" rel="noopener noreferrer" ariaLabel="Download Sample PDF">
              Download Sample (PDF)
            </CTA>
            <Ghost href={AMAZON_BOOK.IN} target="_blank" rel="noopener noreferrer">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Amazon.in
            </Ghost>
            <Ghost href={AMAZON_BOOK.US} target="_blank" rel="noopener noreferrer">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Amazon.com
            </Ghost>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <SectionTitle
            kicker="Social Proof"
            title="What readers say"
            sub="Independent practitioners and leaders on the playbook"
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card>
              <p className="text-white/90">
                “Finally, a no-nonsense bridge between BIM theory and what EPC teams actually do under deadline.”
              </p>
              <p className="mt-3 text-sm text-white/60">— Priya Mehta, Project Engineering Lead</p>
            </Card>
            <Card>
              <p className="text-white/90">
                “Our handover data quality jumped immediately using the checklists and KPIs in this book.”
              </p>
              <p className="mt-3 text-sm text-white/60">— Daniel Ortiz, Commissioning Manager</p>
            </Card>
            <Card>
              <p className="text-white/90">
                “The digital-twin section alone is worth the price—clear, vendor-neutral, and practical.”
              </p>
              <p className="mt-3 text-sm text-white/60">— Akiko Tanaka, Plant Digitalization Lead</p>
            </Card>
            <Card>
              <p className="text-white/90">
                “If you&rsquo;re stuck in clash firefighting, this is the roadmap out.”
              </p>
              <p className="mt-3 text-sm text-white/60">— Ravi Narayanan, BIM Coordinator</p>
            </Card>
            <Card>
              <p className="text-white/90">
                “Loved the AI/ML chapter—simple pilots we could run in a week, not a research project.”
              </p>
              <p className="mt-3 text-sm text-white/60">— Laura Kim, QA/QC Manager</p>
            </Card>
            <Card>
              <p className="text-white/90">
                “Transforms handover from a scramble to a predictable, data-centric process.”
              </p>
              <p className="mt-3 text-sm text-white/60">— Marco Rossi, Owner-Operator Representative</p>
            </Card>
          </div>
          <div className="mt-8 flex items-center justify-center">
            <GoodreadsButton />
          </div>
        </div>
      </section>

      {/* Authors — equal weight with images and portfolio CTA for Soumen */}
      <section id="authors" className="border-t border-white/10 bg-white/5">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <SectionTitle
            kicker="Authors"
            title="S. B. Sengupta & Soumen Roy"
            sub="Decades of experience across EPC/EPCM delivery, plant design automation, and data-centric engineering."
          />

          <div className="grid gap-6 md:grid-cols-2">
            {/* S. B. Sengupta */}
            <Card>
              <div className="flex items-start gap-4">
                <img
                  src={AUTHOR_SB_IMG}
                  alt="Portrait of S. B. Sengupta"
                  className="h-20 w-20 shrink-0 rounded-2xl border border-white/10 object-cover ring-1 ring-white/10"
                  loading="lazy"
                  decoding="async"
                />
                <div>
                  <h3 className="text-lg font-semibold">S. B. Sengupta</h3>
                  <p className="mt-2 text-white/70 text-sm">
                    Veteran plant engineer with 37+ years across power, oil &amp; gas, infrastructure, chemicals,
                    mineral beneficiation, and steel. He has set up engineering organizations, led large
                    multidisciplinary EPC/EPCM and owner’s engineering teams, and driven reliable delivery through
                    people–process–CAD/CAE toolchains.
                  </p>
                  <p className="mt-2 text-white/70 text-sm">
                    Qualifications include Graduate Mechanical Engineer (IIT Kharagpur), postgraduate in Project
                    Engineering, and Cost Accountant.
                  </p>
                </div>
              </div>
            </Card>

            {/* Soumen Roy */}
            <Card>
              <div className="flex items-start gap-4">
                <img
                  src={AUTHOR_SR_IMG}
                  alt="Portrait of Soumen Roy"
                  className="h-20 w-20 shrink-0 rounded-2xl border border-white/10 object-cover ring-1 ring-white/10"
                  loading="lazy"
                  decoding="async"
                />
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <a
                      href="https://soumenroy.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-2 underline-offset-4 hover:opacity-90"
                      title="Open Soumen Roy’s portfolio"
                    >
                      Soumen Roy
                    </a>
                    <ExternalLink className="h-4 w-4 opacity-75" aria-hidden />
                  </h3>
                  <p className="mt-2 text-white/70 text-sm">
                    Technology &amp; operations leader focused on business transformation and data-driven delivery.
                    MCA (SMU) and DCE (SCETE); certifications in Six Sigma (manufacturing), ESRI GIS, and AI/ML.
                    He has led automation initiatives using AI/BI/ML/RPA to boost throughput and quality.
                  </p>
                  <p className="mt-2 text-white/70 text-sm">
                    Early innovation work includes deploying drone-based digital photogrammetry and LiDAR in the steel
                    industry.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <CTA
                      href="https://soumenroy.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      ariaLabel="Visit Soumen Roy portfolio"
                    >
                      Visit Portfolio
                    </CTA>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Buy (country-wise) */}
      <section id="buy" className="border-t border-white/10 bg-[#111827]">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <SectionTitle
            kicker="Get Your Copy"
            title="Buy the Book"
            sub="Choose the store that works best for you"
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Main Book with selector INSIDE the tile */}
            <Card>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-orange-400" /> Main Book
              </h3>
              <p className="mt-2 text-sm text-white/70">
                Choose your country to get the right store link:
              </p>

              <div className="mt-3 flex items-center gap-3">
                <label htmlFor="country" className="text-sm text-white/80">
                  Country / Store
                </label>
                <select
                  id="country"
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
                  value={country}
                  onChange={onCountryChange}
                >
                  <option value="US">USA</option>
                  <option value="UK">United Kingdom</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="ES">Spain</option>
                  <option value="IT">Italy</option>
                  <option value="NL">Netherlands</option>
                  <option value="PL">Poland</option>
                  <option value="SE">Sweden</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                  <option value="JP">Japan</option>
                  <option value="MX">Mexico</option>
                  <option value="BR">Brazil</option>
                  <option value="IN">India</option>
                </select>
              </div>

              <a
                href={bookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
                aria-label="Buy main book"
              >
                <ShoppingCart className="h-4 w-4" />
                Buy — Amazon ({country})
              </a>
            </Card>

            {/* International Edition */}
            <Card>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-orange-400" /> International Edition
              </h3>
              <p className="mt-2 text-sm text-white/70">Alternate listing available in many regions</p>
              <a
                href={intlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
                aria-label="Buy international edition"
              >
                <ShoppingCart className="h-4 w-4" />
                Buy — Amazon ({country})
              </a>
            </Card>

            {/* Other Stores */}
            <Card>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-orange-400" /> Other Stores
              </h3>
              <p className="mt-2 text-sm text-white/70">Prefer a different marketplace?</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={FLIPKART_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
                >
                  Flipkart (IN)
                </a>
                <a
                  href={WFP_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
                >
                  WFP Store
                </a>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Press Kit */}
      <section id="press" className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <SectionTitle
            kicker="Media"
            title="Press Kit"
            sub="Download high-res cover, author bio, headshot, blurbs, and a one-page press sheet."
          />
          <div className="flex flex-wrap items-center gap-3">
            <CTA
              href={PRESS_KIT_ZIP}
              target="_blank"
              rel="noopener noreferrer"
              ariaLabel="Download Press Kit ZIP"
            >
              Download Press Kit (ZIP)
            </CTA>
            <Ghost
              href={PRESS_SHEET_PDF}
              target="_blank"
              rel="noopener noreferrer"
              ariaLabel="Download one-page Press Sheet PDF"
            >
              Download Press Sheet (PDF)
            </Ghost>
            <Ghost href={GOODREADS_URL} target="_blank" rel="noopener noreferrer">
              Goodreads Profile
            </Ghost>
          </div>
        </div>
      </section>

      {/* Blog */}
      <section id="blog" className="border-t border-white/10 bg-white/5">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <SectionTitle
            kicker="Articles"
            title="Blog"
            sub="Implementation notes, case studies, and tool tips."
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {posts.map((p) => (
              <Card key={p.title}>
                <p className="text-xs text-white/60">{formatDateDDMMYYYY(p.date)}</p>
                <h3 className="mt-1 text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-white/70">{p.excerpt}</p>
                <div className="mt-4">
                  <Ghost href={p.href}>Read more →</Ghost>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <SectionTitle
            kicker="Contact"
            title="Get in Touch"
            sub="Speaking, consulting, bulk orders, or press enquiries."
          />
        </div>
        <div className="mx-auto max-w-7xl px-4 pb-16">
          <div className="flex flex-wrap items-center gap-3">
            <CTA
              href={`mailto:${CONTACT_EMAIL}?subject=Enquiry:%203D%20Plant%20Engineering`}
              ariaLabel="Email us"
            >
              Email Us
            </CTA>
            <Ghost href={GOODREADS_URL} target="_blank" rel="noopener noreferrer">
              Goodreads
            </Ghost>
          </div>
        </div>
      </section>

      {/* Footer with small QR */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
          <p className="text-xs text-white/60">
            © {new Date().getFullYear()} 3D Plant Engineering. All rights
            reserved.
          </p>
          <div className="flex items-center gap-3">
            <img
              src={heroQR}
              alt={`Scan to buy on ${heroLabel}`}
              className="h-12 w-12 rounded-md border border-white/10"
              loading="lazy"
              decoding="async"
            />
            <SocialLinks />
          </div>
        </div>
      </footer>
    </div>
  );
}
