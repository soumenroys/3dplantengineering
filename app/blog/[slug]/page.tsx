// app/blog/[slug]/page.tsx
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { posts } from "../../lib/posts"; // <-- inside app/lib now

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};

  return {
    title: `${post.title} — 3D Plant Engineering`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `https://your-domain.com/blog/${post.slug}`,
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

function formatDateDDMMYYYY(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const yyyy = d.getUTCFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export default async function BlogPost(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
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
