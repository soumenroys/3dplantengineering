// app/lib/posts.ts
export type Post = {
  slug: string;
  title: string;
  date: string; // ISO
  excerpt: string;
  content: string; // simple HTML or MD you render directly
};

export const posts: Post[] = [
  {
    slug: "data-centric-engineering-cuts-rework",
    title: "How Data-Centric Engineering Cuts Rework by 30%",
    date: "2025-08-18",
    excerpt:
      "A simple governance model and clean tagging scheme can eliminate a shocking amount of churn. Here’s the checklist we use.",
    content: `
      <p>Rework creeps in when data ownership is fuzzy. This post outlines a lightweight governance model:
      clear tag dictionaries, single-source-of-truth P&IDs, and a review cadence tied to milestones.</p>
      <ul>
        <li>Define authoritative sources (P&ID, spec, 3D) and their change windows</li>
        <li>Use tag dictionaries with lint checks before model publish</li>
        <li>Track KPIs: clash density, late changes, handover data completeness</li>
      </ul>
    `,
  },
  {
    slug: "from-3d-models-to-living-digital-twins",
    title: "From 3D Models to Living Digital Twins",
    date: "2025-07-02",
    excerpt:
      "Digital twins aren’t a ‘deliverable’—they’re a process. This post covers integrations, sync cadence, and ownership.",
    content: `
      <p>A living twin needs an integration map: CAD → CDE → CMMS/ERP and IoT. We discuss
      versioning strategies, model decimation for web, and keeping IDs stable across tools.</p>
      <p>Start small: one unit, weekly sync, measured by operator queries answered by the twin.</p>
    `,
  },
  {
    slug: "ai-ml-plant-qa-getting-started",
    title: "Getting Started with AI/ML for Plant QA",
    date: "2025-06-10",
    excerpt:
      "Practical use-cases where AI catches issues earlier: spec mismatches, missing metadata, and model integrity checks.",
    content: `
      <p>AI can lint your datasets. We show three pilots: spec mismatch detection, orphan tags,
      and model integrity checks. Each pilot is a 1–2 week loop with baselines and acceptance criteria.</p>
    `,
  },
];
