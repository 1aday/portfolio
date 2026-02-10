export const projects = [
  {
    title: "AI Watch\nAuthentication",
    image: "/projects/watch-auth.webp",
    client: "Luxury Goods",
    year: "2025",
    description:
      "Computer vision-powered watch identification and authentication. Analyzes photos to verify luxury watches with confidence scoring, condition assessment, and market value estimation.",
    technical:
      "Multi-stage pipeline: capture \u2192 classification \u2192 authenticity scoring \u2192 condition grading \u2192 value estimation. iOS companion app in Swift/SwiftUI with real-time Supabase sync.",
    tech: ["Next.js", "Swift", "OpenAI Vision", "Supabase"],
    github: "https://github.com/1aday/Watchfinder",
  },
  {
    title: "AI Video\nProduction",
    image: "/projects/video-production.webp",
    client: "Media & Entertainment",
    year: "2025",
    description:
      "Full episodic content creation system \u2014 character management, automated trailer generation, and poster creation. An AI production studio in the browser.",
    technical:
      "Character identity persistence via reference image anchoring. Kling v2.6 for cinematic video generation. Supabase for asset management and episode state.",
    tech: ["Next.js", "Kling v2.6", "Replicate", "Supabase"],
    github: "https://github.com/1aday/Production_Flow",
  },
  {
    title: "Leader Dossier\nGenerator",
    image: "/projects/leader-dossier.webp",
    client: "Research & Intelligence",
    year: "2025",
    description:
      "Multi-model pipeline generating comprehensive leader profiles with consistent AI portraits, intro videos, and structured dossier data.",
    technical:
      "Three-model chain: OpenAI \u2192 Replicate portraits \u2192 Kling video synthesis. Identity consistency across text, image, and video media types.",
    tech: ["OpenAI", "Replicate", "Kling v2.6", "Supabase"],
    github: "https://github.com/1aday/leaders",
  },
  {
    title: "AI Theme\nGenerator",
    image: "/projects/theme-generator.webp",
    client: "Developer Tools",
    year: "2025",
    description:
      "Generate complete shadcn/ui design system themes from text prompts, images, or SVGs. Live preview with WCAG accessibility compliance.",
    technical:
      "Perceptual color manipulation in OKLCH space via Culori. Real-time preview across component variants. Automatic WCAG contrast validation.",
    tech: ["Next.js 15", "Tailwind v4", "Culori", "Zustand"],
    github: "https://github.com/1aday/Themeify",
  },
  {
    title: "Production\nRAG System",
    image: "/projects/rag-system.webp",
    client: "Enterprise",
    year: "2025",
    description:
      "Production-ready RAG with multiple chunking strategies and async document ingestion for large-scale document sets.",
    technical:
      "Semantic, fixed-size, and recursive chunking. pgvector with HNSW indexing. Inngest background jobs with retry logic and progress tracking.",
    tech: ["pgvector", "Prisma", "OpenAI", "Inngest"],
    github: "https://github.com/1aday/rag2",
  },
  {
    title: "AI Interior\nDesign Studio",
    image: "/projects/interior-design.webp",
    client: "Real Estate",
    year: "2025",
    description:
      "Transform room photos into styled design concepts using multi-model rendering with iterative refinement in a workspace UI.",
    technical:
      "GPT-4o Vision analyzes layout \u2192 generates prompts \u2192 Replicate renders redesigned concepts. Multiple style presets with adjustable parameters.",
    tech: ["GPT-4o Vision", "Replicate", "Next.js"],
    github: "https://github.com/1aday/bananator",
  },
  {
    title: "Article to\nAudio Platform",
    image: "/projects/article-audio.webp",
    client: "Media & Publishing",
    year: "2025",
    description:
      "Content-to-audio pipeline converting any web article into natural-sounding speech. Three chained AI services with retro terminal aesthetic.",
    technical:
      "Firecrawl extraction \u2192 text processing \u2192 ElevenLabs/OpenAI TTS synthesis. Drizzle + SQLite for local listening history.",
    tech: ["Firecrawl", "ElevenLabs", "OpenAI TTS", "Drizzle"],
    github: "https://github.com/1aday/tts-article-reader",
  },
  {
    title: "AI Financial\nAnalyst",
    image: "/projects/financial-analyst.webp",
    client: "Finance",
    year: "2024",
    description:
      "Conversational data analysis powered by Claude. Upload CSV, PDF, or images \u2014 get automated analysis with interactive chart visualizations.",
    technical:
      "Multi-format parsing: CSV, PDF via PDF.js, images via Claude vision. Auto-generates analysis narratives and Recharts specifications simultaneously.",
    tech: ["Claude", "Recharts", "Prisma", "PDF.js"],
    github: "https://github.com/1aday/grox_ai",
  },
  {
    title: "GA4 Analytics\nDashboard",
    image: "/projects/analytics-dashboard.webp",
    client: "Marketing Agency",
    year: "2025",
    description:
      "Comprehensive Google Analytics 4 dashboard with drill-through views, conversion funnels, and custom data visualization.",
    technical:
      "TanStack Query with optimistic updates. Virtualized data grids. Custom Visx SVG charts. Drill-through navigation preserving filter context.",
    tech: ["TanStack", "Visx", "Supabase", "Next.js 15"],
    github: "https://github.com/1aday/growth",
  },
  {
    title: "Creative\nGeneration Platform",
    image: "/projects/creative-platform.webp",
    client: "Creative Agency",
    year: "2025",
    description:
      "Batch creative generation for portrait series, multi-image outputs, and videos with consistent theme styling at production scale.",
    technical:
      "Theme engine with shared style tokens for batch consistency. Queue-based processing with progress tracking. Portrait, editorial, and video formats.",
    tech: ["AI APIs", "Next.js", "shadcn/ui", "Tailwind"],
    github: "https://github.com/1aday/Creative_Factory",
  },
];

export type Project = (typeof projects)[number];

export const stats = [
  { value: "30+", label: "Projects" },
  { value: "12+", label: "AI Models" },
  { value: "8", label: "Industries" },
];

export const expertise = [
  {
    title: "Multi-Model Orchestration",
    body: "Chaining OpenAI, Anthropic, Replicate, ElevenLabs, and custom models into cohesive experiences where each model handles what it does best.",
  },
  {
    title: "Computer Vision & NLP",
    body: "Image analysis, document understanding, RAG systems, vector search with pgvector, and embedding-based retrieval at production scale.",
  },
  {
    title: "AI Video & Audio",
    body: "Video generation with Kling v2.6, text-to-speech with ElevenLabs and OpenAI TTS, image generation with Replicate and DALL-E.",
  },
  {
    title: "Full-Stack Product Dev",
    body: "Next.js, TypeScript, React, Swift/SwiftUI, PostgreSQL, Supabase, Prisma \u2014 from database schema to pixel-perfect UI.",
  },
];

export const tools = [
  { label: "Languages", items: ["TypeScript", "Swift", "Python"] },
  { label: "Frontend", items: ["Next.js", "React", "SwiftUI", "Tailwind"] },
  { label: "Backend", items: ["Node.js", "Prisma", "Drizzle", "Inngest"] },
  { label: "AI / ML", items: ["OpenAI", "Claude", "Replicate", "ElevenLabs"] },
  { label: "Data", items: ["PostgreSQL", "Supabase", "pgvector", "BigQuery"] },
  { label: "Infra", items: ["Vercel", "Docker", "GitHub Actions"] },
];
