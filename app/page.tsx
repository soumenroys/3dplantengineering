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
  Linkedin,
} from "lucide-react";
import { getCookieCountry } from "../lib/client/country";

// --- GA typing (avoid no-explicit-any) ---
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// ===== Social links =====
const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61579794313524";
const INSTAGRAM_URL = "https://www.instagram.com/roy_3d/";
const YOUTUBE_URL = "https://www.youtube.com/@3DPlantEngineering-e4f3b/videos";
const GOODREADS_URL =
  "https://www.goodreads.com/author/list/34690983.Soumen_Roy";
const LINKEDIN_URL =
  "https://www.linkedin.com/in/3d-plant-engineering-5b1633387/";

// ===== Files under /public =====
const SAMPLE_PDF = "/sample/Sample.pdf";
const PRESS_KIT_ZIP = "/press/press-kit.zip";
const PRESS_SHEET_PDF = "/press/press-sheet.pdf";
const QR_AMZN_IN = "/images/qr-amazon-in.png";
const QR_AMZN_COM = "/images/qr-amazon-com.png";
const BACK_COVER_IMG = "/images/back-cover.jpg"; // ensure exists

// ===== Author headshots (add to /public/images/authors/) =====
const AUTHOR_SB_IMG = "/images/authors/sb-sengupta.jpg";
const AUTHOR_SR_IMG = "/images/authors/soumen-roy.jpg";

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
  { href: "#backcover", label: "Back Cover" },
  { href: "#reviews", label: "Reviews" },
  { href: "#authors", label: "Authors" },
  { href: "#buy", label: "Buy" },
  { href: "#press", label: "Press Kit" },
  { href: "#blog", label: "Blog" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

// ===== Store links (B0F9GXGZ96) =====
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

// ——— Helpers: UTM & lightweight outbound click tracking ———
const withUTM = (url: string, content: string) =>
  `${url}?utm_source=site&utm_medium=cta&utm_campaign=book_launch&utm_content=${encodeURIComponent(
    content
  )}`;

const track = (name: string) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", "click", {
      event_category: "outbound",
      event_label: name,
    });
  }
};

function detectIN(): boolean {
  try {
    const lang = (navigator.language || "").toUpperCase();
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (lang.endsWith("-IN") || tz === "Asia/Kolkata") return true;
  } catch {}
  return false;
}

// deterministic date
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
  onClick,
}: {
  href?: string;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
  children: React.ReactNode;
  ariaLabel?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}) => (
  <a
    href={href}
    target={target}
    rel={rel}
    aria-label={ariaLabel}
    onClick={onClick}
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
  onClick,
}: {
  href?: string;
  children: React.ReactNode;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
  ariaLabel?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}) => (
  <a
    href={href}
    target={target}
    rel={rel}
    aria-label={ariaLabel}
    onClick={onClick}
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
    {sub && <p className="mt-3 max-w-3xl text-white/70">{sub}</p>}
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
      h: "Part I — Foundations & Set-up",
      t: [
        "1. The Shift to Data-Centric Engineering",
        "2. 3D/BIM Toolchain, Roles & RACI",
        "3. Standards, Codes & Governance",
        "4. Infra & Project Set-up (hardware, networks, cloud)",
        "5. Document Control & Versioning",
      ],
    },
    {
      h: "Part II — Design, Libraries & Automation",
      t: [
        "6. Intelligent P&IDs & Tagging Strategy",
        "7. Parametric Catalogs & Commodity Coding for BOQ",
        "8. Rules, Clash Avoidance & Model Integrity",
        "9. Concurrent Engineering & Distributed Worksharing",
        "10. Review Workflows, Issue Tracking & Sign-off",
      ],
    },
    {
      h: "Part III — Digitalisation & Reality Capture",
      t: [
        "11. Photogrammetry, LiDAR & GPS/Survey Integration",
        "12. Satellite Imagery & Holographic/AR Models",
        "13. As-Built Reconciliation & Change Management",
        "14. Documented Architecture for Global Collaboration",
      ],
    },
    {
      h: "Part IV — From 3D to Digital Twins",
      t: [
        "15. Data Models & Twin Architecture",
        "16. Integrations with ERP/CMMS/MES",
        "17. KPI Dashboards & Lifecycle Data Handover",
      ],
    },
    {
      h: "Part V — AI/ML & Industry 4→5",
      t: [
        "18. Practical AI for QA/QC & Model Checks",
        "19. Throughput, Safety & Cost Optimisation",
        "20. Roadmaps, ROI & Org Readiness",
      ],
    },
    {
      h: "Appendices",
      t: [
        "A. SOP Templates & Checklists",
        "B. Sample Data Dictionaries & Tagging Schemes",
        "C. Pilot Plans & Risk Registers",
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
      <a
        href={LINKEDIN_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-white/70 hover:text-white"
        aria-label="LinkedIn"
      >
        <Linkedin className="h-5 w-5" />
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

// ————————— Blog (expanded inline content) —————————
type BlogPost = {
  title: string;
  date: string;
  excerpt: string;
  body: string;
};
const blogPosts: BlogPost[] = [
  {
    title: "How Data-Centric Engineering Cuts Rework by 30%",
    date: "2025-08-18",
    excerpt:
      "A governance model + clean tagging scheme eliminates a surprising amount of churn.",
    body:
      "Most clash firefighting is a governance problem, not a tools problem. Start with a reference tagging scheme, freeze it, and drive all downstream artifacts from tags.\n\n" +
      "Set up three simple controls: (1) a tag dictionary with ownership, (2) a change request workflow for new classes/tags, and (3) an automated nightly integrity check that flags missing metadata and spec mismatches.\n\n" +
      "Measure rework as a KPI and publish it weekly. When teams see their rework trend, behaviors change. Pair this with a rules library (typical clearances, nozzle envelopes, maintenance zones) so issues never reach the model.\n\n" +
      "Practical tip: run a 'no orphan tags' query daily. If a tag lacks a discipline owner or a location, the issue goes to the coordinator within 24 hours. This one routine prevents a month of reconciliation headaches later.\n\n" +
      "Case study snippet: one EPC reduced late-stage pipe reroutes by 28% in two quarters after freezing a commodity-coding scheme and making it the single source of truth for BOQ and procurement.",
  },
  {
    title: "From 3D Models to Living Digital Twins",
    date: "2025-07-02",
    excerpt:
      "Digital twins are a process, not a file. Think ownership, sync cadence, and integrations.",
    body:
      "Treat your model as a data backbone. Define which system owns which attributes (CDE vs ERP vs CMMS), how often each sync runs, and who signs off success.\n\n" +
      "A minimal viable twin links tags, locations, and status to maintenance work orders. Start with a commissioning handover where every tag in CMMS has a pointer back to the model object. This alone saves countless hours during shutdown planning.\n\n" +
      "Establish stewardship: engineering owns geometry and specs; operations owns runtime attributes; IT owns pipelines and access. The twin thrives when ownership is clear.\n\n" +
      "Governance pattern: an integration catalog (what flows where, frequency, owner), plus a 'red list' of attributes that may not be overwritten during syncs (think serial numbers, certifications, QA status).",
  },
  {
    title: "Getting Started with AI/ML for Plant QA",
    date: "2025-06-10",
    excerpt:
      "Small pilots first: model integrity checks, missing attributes, and spec drift.",
    body:
      "Begin with CSV exports of your model database. Use rule-based and ML-based anomaly detection to flag outliers: diameter-pressure mismatches, missing class notes, orphaned tags, and non-compliant valve orientations.\n\n" +
      "Close the loop by pushing results into your issue tracker with tag IDs and screenshot links. Aim for a one-week pilot that runs nightly and emails a succinct report to the QA/QC channel.\n\n" +
      "Scale cautiously: once trust is built, add predictive checks (e.g., likely clash zones based on past data) and auto-fixes for common attribute gaps.\n\n" +
      "What to track: % of issues auto-detected, time-to-close, and recurrence rate by discipline. Use these metrics to justify the next automation step.",
  },
];

function BlogItem({ p }: { p: BlogPost }) {
  const [open, setOpen] = useState(false);
  const paragraphs = p.body.split("\n\n");
  return (
    <Card>
      <p className="text-xs text-white/60">{formatDateDDMMYYYY(p.date)}</p>
      <h3 className="mt-1 text-lg font-semibold">{p.title}</h3>
      <p className="mt-2 text-sm text-white/70">{p.excerpt}</p>
      {open && (
        <div className="mt-3 space-y-3">
          {paragraphs.map((para, i) => (
            <p key={i} className="text-sm text-white/80">
              {para}
            </p>
          ))}
        </div>
      )}
      <div className="mt-4">
        <button
          onClick={() => setOpen(!open)}
          className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 backdrop-blur transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/40"
        >
          {open ? "Show less ↑" : "Read more →"}
        </button>
      </div>
    </Card>
  );
}

export default function BookWebsiteDesign() {
  const [isIN, setIsIN] = useState<boolean>(false);
  const [country, setCountry] = useState<CC>("US");
  const [backCoverError, setBackCoverError] = useState(false);

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

  const onCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cc = e.target.value as CC;
    setCountry(cc);
    setIsIN(cc === "IN");
    document.cookie = `country=${cc}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  };

  const heroBuyUrlRaw = isIN ? AMAZON_BOOK.IN : AMAZON_BOOK.US;
  const heroBuyUrl = withUTM(heroBuyUrlRaw, "hero-primary");
  const heroQR = isIN ? QR_AMZN_IN : QR_AMZN_COM;
  const heroLabel = isIN ? "Amazon India" : "Amazon.com";

  const bookUrl = withUTM(AMAZON_BOOK[country] || AMAZON_BOOK.US, "buy-main");

  return (
    <div className="min-h-screen scroll-smooth bg-[#0b1220] text-white pb-20 md:pb-0">
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
            <CTA
              href={heroBuyUrl}
              target="_blank"
              rel="noopener noreferrer"
              ariaLabel="Buy now"
              onClick={() => track("hero_buy_now")}
            >
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
              <CTA
                href={SAMPLE_PDF}
                target="_blank"
                rel="noopener noreferrer"
                ariaLabel="Read sample PDF"
                onClick={() => track("hero_read_sample")}
              >
                Read Sample (PDF)
              </CTA>
              <Ghost
                href={withUTM(heroBuyUrlRaw, "hero-ghost")}
                target="_blank"
                rel="noopener noreferrer"
                ariaLabel={`Buy on ${heroLabel}`}
                onClick={() => track("hero_buy_on_amazon")}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Buy on {heroLabel}
              </Ghost>
            </div>

            {/* Hero micro social proof */}
            <p className="mt-4 text-xs text-white/70 italic">
              “The digital-twin section alone is worth the price.” — Plant Digitalization Lead
            </p>

            <div className="mt-6 flex flex-wrap gap-2 text-white/70">
              <Pill>EPC / Owner-Operator</Pill>
              <Pill>BIM / Piping / QA</Pill>
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
                  href={withUTM(heroBuyUrlRaw, "hero-qr-text")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm text-orange-300 underline"
                  onClick={() => track("hero_qr_text_link")}
                >
                  Open {heroLabel} →
                </a>
              </div>
            </div>

            <div className="mt-6">
              <SocialLinks />
            </div>
          </div>

          {/* Book cover → clickable to enlarge (open image) */}
          <div className="mx-auto w-full max-w-sm">
            <a
              href="/images/cover.jpg"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open large book cover image"
              title="Open large book cover image"
              onClick={() => track("hero_cover_enlarge")}
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
              Click to view large cover image.
            </p>
          </div>
        </div>
      </section>

      {/* About (detailed) */}
      <section id="about" className="border-t border-white/10 bg-white/5">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <SectionTitle
            kicker="About the Book"
            title="A practical, vendor-neutral roadmap for data-driven plant projects"
            sub="Move from drawing-centric delivery to information-centric engineering. The book explains the people, process and platform shifts that shorten schedules, reduce rework, and deliver clean handover data that operations can trust."
          />
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <h3 className="text-lg font-semibold">What you’ll learn</h3>
              <ul className="mt-2 list-disc pl-6 text-sm text-white/80 space-y-1.5">
                <li>Set up a robust 3D/BIM environment and distributed collaboration.</li>
                <li>Design SOPs for reviews, issue tracking and clash resolution.</li>
                <li>Create parametric catalogs & commodity codes for accurate BOQ.</li>
                <li>Manage documents and models in cloud-ready CDEs.</li>
                <li>Plan data handover with ERP/CMMS/MES integrations.</li>
                <li>Introduce AI/ML pilots for QA/QC and throughput gains.</li>
              </ul>
            </Card>
            <Card>
              <h3 className="text-lg font-semibold">How the playbook works</h3>
              <p className="mt-2 text-white/80 text-sm">
                Each chapter ends with a checklist and an “activation”—a small, high-leverage change
                you can run in a week (e.g., tag dictionary freeze, nozzle-clearance rules, or a clash-
                prevention gate). Templates for RACI, approval matrices, data dictionaries and KPI
                dashboards make improvements measurable and repeatable across projects.
              </p>
              <p className="mt-3 text-white/80 text-sm">
                Workflows are tool-agnostic and focus on handoffs between functions—engineering,
                procurement, construction and operations—so information stays consistent from bid to
                commissioning and beyond.
              </p>
            </Card>
            <Card>
              <h3 className="text-lg font-semibold">Outcomes</h3>
              <ul className="mt-2 list-disc pl-6 text-sm text-white/80 space-y-1.5">
                <li>Fewer clashes and change orders with early rules & libraries.</li>
                <li>Handover-ready, structured asset data aligned to operations.</li>
                <li>Clear KPIs and governance that sustain gains over time.</li>
                <li>Reusable playbooks and templates for future projects and teams.</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Contents */}
      <section id="toc" className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <SectionTitle
            kicker="Inside the Book"
            title="Table of Contents"
            sub="Expand each part to explore chapters, workflows, and templates."
          />
          <TOCAccordion />
        </div>
      </section>

      {/* Sample + Lead Magnet */}
      <section id="sample" className="border-t border-white/10 bg-white/5">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <SectionTitle
            kicker="Free Excerpt"
            title="Read a Sample Chapter"
            sub="Download a short PDF to get a feel for the writing, structure, and tools we recommend."
          />
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <CTA
                  href={SAMPLE_PDF}
                  target="_blank"
                  rel="noopener noreferrer"
                  ariaLabel="Download Sample PDF"
                  onClick={() => track("sample_download_pdf")}
                >
                  Download Sample (PDF)
                </CTA>
                <Ghost
                  href={withUTM(AMAZON_BOOK.IN, "sample-amazon-in")}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("sample_amazon_in")}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Amazon.in
                </Ghost>
                <Ghost
                  href={withUTM(AMAZON_BOOK.US, "sample-amazon-us")}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("sample_amazon_us")}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Amazon.com
                </Ghost>
                <Ghost
                  href={withUTM(YOUTUBE_URL, "sample-look-inside-video")}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("sample_look_inside_video")}
                >
                  <Youtube className="mr-2 h-4 w-4" />
                  Watch 60s Look-Inside
                </Ghost>
              </div>
              <p className="mt-6 text-sm text-white/80">
                The sample includes the foundational checklist for setting up a 3D/BIM project, a practical
                clash-prevention workflow, and a preview of the handover data model.
              </p>
              <ul className="mt-4 list-disc pl-6 text-white/80 text-sm space-y-1.5">
                <li>
                  <em>“Don’t treat models as drawings.”</em> Treat them as structured data objects that drive
                  procurement, construction and operations.
                </li>
                <li>
                  <em>“Clash firefighting is a symptom.”</em> Fix root causes with early rules, libraries and
                  governance—then clashes drop naturally.
                </li>
                <li>
                  <em>“Handover starts on day one.”</em> Define tags, metadata and ownership early—the last mile
                  becomes a click, not a scramble.
                </li>
              </ul>

              {/* Lead magnet */}
              <Card>
                <h3 className="text-base font-semibold">Free: Project Kickoff Checklist (PDF)</h3>
                <p className="mt-2 text-sm text-white/80">
                  Get a one-page checklist we use to start 3D/BIM projects on the right foot.
                </p>
                <form
                  action="https://formspree.io/f/yourid" // TODO: replace with your Formspree/ESP endpoint
                  method="POST"
                  className="mt-3 flex gap-3 max-w-lg"
                >
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Work email"
                    className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3 py-3 text-sm text-white placeholder-white/50"
                  />
                  <button
                    type="submit"
                    className="rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_30px_rgb(2,6,23,0.35)]"
                    style={{ background: "linear-gradient(135deg,#f97316,#f59e0b)" }}
                    onClick={() => track("lead_magnet_submit")}
                  >
                    Get PDF
                  </button>
                </form>
              </Card>
            </div>
            <Card>
              <h3 className="text-lg font-semibold">Excerpt</h3>
              <p className="mt-2 text-sm text-white/80">
                “Towards that end, this book offers a comprehensive guide for learning as well as applying
                techniques for faster delivery of capital projects including their overall lifecycle management.
                We move beyond ‘drawing packages’ and establish a common data language across engineering,
                procurement, construction and plant operations.”
              </p>
              <p className="mt-3 text-sm text-white/80">
                “Customization and commodity coding of bulk items enables reliable BOQ and inventory streams.
                When these codes flow through your 3D model, ERP and CMMS, you unlock management by facts—
                not by emails and spreadsheets.”
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Back Cover (same visual size as hero cover + enlarge on click) */}
      <section id="backcover" className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <SectionTitle
            kicker="From the Back Cover"
            title="What this book equips you to do"
            sub="Highlights and author details as printed on the back cover."
          />
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <ul className="list-disc pl-6 text-white/80 text-sm space-y-1.5">
                <li>Effectively develop a 3D engineering set-up and distributed collaboration.</li>
                <li>Establish hardware/software infrastructure for project execution.</li>
                <li>Create 3D workflows, SOPs, review mechanisms & clash resolution procedures.</li>
                <li>Leverage intelligence & data for higher productivity and quality.</li>
                <li>Commodity coding for BOQ generation and streamlined procurement/inventory.</li>
                <li>Digitalisation using photogrammetry, GPS, holographic models & digital twins.</li>
                <li>Document management using cloud CDEs tailored to 3D deliverables.</li>
                <li>Capital Project Management (cPLM) and lifecycle handover strategies.</li>
                <li>Use of BIM in operations with ERP, SAP & MES aligned to Industry 4.0/5.0.</li>
                <li>Core concepts of AI/ML/NLP applied to 3D plant engineering.</li>
              </ul>
              {backCoverError && (
                <p className="mt-3 text-xs text-red-300">
                  Back cover image not found. Please place <code>/public/images/back-cover.jpg</code>.
                </p>
              )}
            </div>

            {/* Make size == hero cover: wrap with same max-w-sm */}
            <div className="mx-auto w-full max-w-sm">
              <a
                href={BACK_COVER_IMG}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open large back cover image"
                title="Open large back cover image"
                onClick={() => track("backcover_enlarge")}
              >
                <img
                  src={BACK_COVER_IMG}
                  alt="Back cover of the book showing highlights and author bios"
                  className="rounded-3xl shadow-2xl border border-white/10 transition hover:opacity-90"
                  loading="lazy"
                  decoding="async"
                  onError={() => setBackCoverError(true)}
                />
              </a>
              <p className="mt-2 text-center text-xs text-white/60">
                Click to view large back cover image.
              </p>
            </div>
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
              <p className="mt-3 text-sm text-white/60">— Project Engineering Lead</p>
            </Card>
            <Card>
              <p className="text-white/90">
                “Our handover data quality jumped immediately using the checklists and KPIs in this book.”
              </p>
              <p className="mt-3 text-sm text-white/60">— Commissioning Manager</p>
            </Card>
            <Card>
              <p className="text-white/90">
                “The digital-twin section alone is worth the price—clear, vendor-neutral, and practical.”
              </p>
              <p className="mt-3 text-sm text-white/60">— Plant Digitalization Lead</p>
            </Card>
          </div>
          <div className="mt-8 flex items-center justify-center">
            <GoodreadsButton />
          </div>
        </div>
      </section>

      {/* Authors — unified button style (Ghost) */}
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
                  <h3 className="text-lg font-semibold">Subhra Baran Sengupta</h3>
                  <p className="mt-2 text-white/70 text-sm">
                    37+ years across power, oil &amp; gas, infrastructure, chemicals, mineral beneficiation and
                    steel. Has led consulting, EPC and owner’s engineering teams; set up engineering organizations;
                    and created initiatives for performance improvement and engineering solutions.
                  </p>
                  <p className="mt-2 text-white/70 text-sm">
                    Graduate Mechanical Engineer (IIT Kharagpur); postgraduate in Project Engineering; Cost Accountant.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <Ghost
                      href="https://www.linkedin.com/in/subhra-sengupta-6aa3512a/"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Subhra Baran Sengupta on LinkedIn"
                      onClick={() => track("author_sb_linkedin")}
                    >
                      <Linkedin className="mr-2 h-4 w-4" />
                      LinkedIn
                    </Ghost>
                  </div>
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
                      onClick={() => track("author_sr_portfolio")}
                    >
                      Soumen Roy
                    </a>
                    <ExternalLink className="h-4 w-4 opacity-75" aria-hidden />
                  </h3>
                  <p className="mt-2 text-white/70 text-sm">
                    Technology &amp; operations leader in business transformation and data-driven delivery.
                    MCA (SMU) and DCE (SCETE); Six Sigma, ESRI GIS and AI/ML certified. Pioneered drone-based
                    photogrammetry and LiDAR in steel plants; led automation using AI/BI/ML/RPA.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <Ghost
                      href="https://soumenroy.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Visit Soumen Roy portfolio"
                      onClick={() => track("author_sr_portfolio_ghost")}
                    >
                      Visit Portfolio
                    </Ghost>
                    <Ghost
                      href="https://www.linkedin.com/in/sowmenroy/"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Soumen Roy on LinkedIn"
                      onClick={() => track("author_sr_linkedin")}
                    >
                      <Linkedin className="mr-2 h-4 w-4" />
                      LinkedIn
                    </Ghost>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Buy */}
      <section id="buy" className="border-t border-white/10 bg-[#111827]">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <SectionTitle
            kicker="Get Your Copy"
            title="Buy the Book"
            sub="Choose the store that works best for you"
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Book Edition */}
            <Card>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-orange-400" /> Book Edition
              </h3>
              <p className="mt-2 text-sm text-white/70">Select your region:</p>

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
                aria-label="Buy book"
                onClick={() => track("buy_amazon_country")}
              >
                <ShoppingCart className="h-4 w-4" />
                Buy — Amazon ({country})
              </a>
              <p className="mt-3 text-xs text-white/50">
                ISBN: 978-93-49311-76-3 • Publisher: White Falcon Publishing
              </p>
            </Card>

            {/* Other Stores */}
            <Card>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-orange-400" /> Other Stores
              </h3>
              <p className="mt-2 text-sm text-white/70">Prefer a different marketplace?</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={withUTM(FLIPKART_URL, "buy-flipkart")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
                  onClick={() => track("buy_flipkart")}
                >
                  Flipkart (IN)
                </a>
                <a
                  href={withUTM(WFP_STORE_URL, "buy-wfp")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
                  onClick={() => track("buy_wfp_store")}
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
              onClick={() => track("press_zip")}
            >
              Download Press Kit (ZIP)
            </CTA>
            <Ghost
              href={PRESS_SHEET_PDF}
              target="_blank"
              rel="noopener noreferrer"
              ariaLabel="Download one-page Press Sheet PDF"
              onClick={() => track("press_sheet_pdf")}
            >
              Download Press Sheet (PDF)
            </Ghost>
            <Ghost
              href={GOODREADS_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("press_goodreads")}
            >
              Goodreads
            </Ghost>
            <Ghost
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("press_linkedin")}
            >
              LinkedIn
            </Ghost>
          </div>
        </div>
      </section>

      {/* Blog (inline, expanded) */}
      <section id="blog" className="border-t border-white/10 bg-white/5">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <SectionTitle
            kicker="Articles"
            title="Blog"
            sub="Implementation notes, case studies, and tool tips."
          />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {blogPosts.map((bp) => (
              <BlogItem key={bp.title} p={bp} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ (adds trust & SEO) */}
      <section id="faq" className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <SectionTitle
            kicker="FAQ"
            title="Frequently Asked Questions"
            sub="A few quick answers about scope, tooling, and who it’s for."
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <h3 className="font-semibold">Is this book tool-specific?</h3>
              <p className="mt-2 text-white/80 text-sm">
                No—vendor neutral. Workflows and data handoffs apply across major BIM/plant tools.
              </p>
            </Card>
            <Card>
              <h3 className="font-semibold">Who benefits most?</h3>
              <p className="mt-2 text-white/80 text-sm">
                EPC/EPCM teams, owner-operators, BIM leads, piping designers, QA/QC and commissioning.
              </p>
            </Card>
            <Card>
              <h3 className="font-semibold">Do I need AI expertise?</h3>
              <p className="mt-2 text-white/80 text-sm">
                No. We start with simple, production-ready pilots (integrity checks, anomaly detection).
              </p>
            </Card>
            <Card>
              <h3 className="font-semibold">Can I use this to standardize handover?</h3>
              <p className="mt-2 text-white/80 text-sm">
                Yes—there are tagging templates, data dictionaries, and KPI dashboards to make handover repeatable.
              </p>
            </Card>
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
          <div className="flex flex-wrap items-center gap-3">
            <CTA
              href={`mailto:${CONTACT_EMAIL}?subject=Enquiry:%203D%20Plant%20Engineering`}
              ariaLabel="Email us"
              onClick={() => track("contact_email_us")}
            >
              Email Us
            </CTA>
            <Ghost
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("contact_linkedin_book")}
            >
              LinkedIn (Book)
            </Ghost>
          </div>

          {/* Contact Writers (images added) */}
          <div className="mt-10">
            <h3 className="text-lg font-semibold">Contact Writers</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Card>
                <div className="flex items-start gap-3">
                  <img
                    src={AUTHOR_SB_IMG}
                    alt="Subhra Baran Sengupta"
                    className="h-12 w-12 rounded-xl border border-white/10 object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div>
                    <p className="text-sm text-white/80">
                      <span className="font-semibold">Subhra Baran Sengupta</span>
                    </p>
                    <a
                      className="mt-1 inline-block text-sm text-orange-300 underline"
                      href="mailto:sbsengup@yahoo.com?subject=Enquiry:%203D%20Plant%20Engineering"
                      onClick={() => track("contact_writer_sb_email")}
                    >
                      sbsengup@yahoo.com
                    </a>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="flex items-start gap-3">
                  <img
                    src={AUTHOR_SR_IMG}
                    alt="Soumen Roy"
                    className="h-12 w-12 rounded-xl border border-white/10 object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div>
                    <p className="text-sm text-white/80">
                      <span className="font-semibold">Soumen Roy</span>
                    </p>
                    <a
                      className="mt-1 inline-block text-sm text-orange-300 underline"
                      href="mailto:soumenroy@outlook.com?subject=Enquiry:%203D%20Plant%20Engineering"
                      onClick={() => track("contact_writer_sr_email")}
                    >
                      soumenroy@outlook.com
                    </a>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky mobile buy bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#0b1220]/95 backdrop-blur md:hidden">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-3">
          <span className="text-xs text-white/70 truncate">
            Mastering 3D Plant Engineering
          </span>
          <a
            href={withUTM(heroBuyUrlRaw, "sticky-mobile")}
            aria-label={`Buy on ${heroLabel}`}
            className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_30px_rgb(2,6,23,0.35)]"
            style={{ background: "linear-gradient(135deg,#f97316,#f59e0b)" }}
            onClick={() => track("sticky_mobile_buy")}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Buy on {heroLabel}
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
          <p className="text-xs text-white/60">
            © {new Date().getFullYear()} 3D Plant Engineering. All rights reserved.
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
