// app/blog/page.tsx
import { posts } from "../lib/posts";


export const metadata = {
  title: "Blog — 3D Plant Engineering",
  description: "Implementation notes, case studies, and tool tips.",
};

export default function BlogIndex() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 text-white">
      <header className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-orange-400">Articles</p>
        <h1 className="text-3xl md:text-4xl font-bold">Blog</h1>
        <p className="mt-3 max-w-2xl text-white/70">
          Implementation notes, case studies, and tool tips.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {posts.map((p) => (
          <article
            key={p.slug}
            className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/0 p-6 shadow-inner"
          >
            <p className="text-xs text-white/60">
              {new Date(p.date).toLocaleDateString()}
            </p>
            <h2 className="mt-1 text-lg font-semibold">{p.title}</h2>
            <p className="mt-2 text-sm text-white/70">{p.excerpt}</p>
            <div className="mt-4">
              <a
                href={`/blog/${p.slug}`}
                className="inline-flex items-center rounded-2xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/10"
              >
                Read more →
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
