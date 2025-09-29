// app/blog/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
// NOTE: relative path from app/blog/[slug]/page.tsx → /lib/posts.ts
import { posts } from "../../lib/posts";

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

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) return notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-white">
      <p className="text-xs text-white/60">
        {new Date(post.date).toLocaleDateString()}
      </p>
      <h1 className="mt-2 text-3xl md:text-4xl font-bold">{post.title}</h1>
      <div
        className="prose prose-invert mt-6 max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      <div className="mt-10">
        <a href="/blog" className="text-sm text-orange-300 underline">
          ← Back to Blog
        </a>
      </div>
    </div>
  );
}
