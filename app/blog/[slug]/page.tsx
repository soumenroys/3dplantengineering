// app/blog/[slug]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { posts } from "../../lib/posts"; // relative to /app/blog/[slug]/

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata(
  { params }: { params: { slug: string } }
): Metadata {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) return {};

  return {
    title: `${post.title} — 3D Plant Engineering`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `https://3dplantengineering.com/blog/${post.slug}`,
      images: [{ url: "/images/cover.jpg" }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: ["/images/cover.jpg"],
    },
  };
}

// Deterministic date formatter (SSR/client safe)
function formatDateDDMMYYYY(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year = d.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) return notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-white">
      <p className="text-xs text-white/60">{formatDateDDMMYYYY(post.date)}</p>
      <h1 className="mt-2 text-3xl md:text-4xl font-bold">{post.title}</h1>

      <div
        className="prose prose-invert mt-6 max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="mt-10">
        <Link href="/blog" className="text-sm text-orange-300 underline">
          ← Back to Blog
        </Link>
      </div>
    </div>
  );
}
