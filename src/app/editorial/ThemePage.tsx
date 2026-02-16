"use client";
import { useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { getProjectImage } from "@/lib/theme-images";

/* ─── Color constants ─── */
const C = {
  bg: "#FFFFFF",
  text: "#111111",
  dim: "#666666",
  accent: "#DC2626",
  rule: "#E5E5E5",
  sidebar: "#F8F8F8",
};

/* ─── Scroll-reveal wrapper ─── */
function Reveal({
  children,
  className = "",
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ─── Thin horizontal rule ─── */
function Rule({ color = C.rule }: { color?: string }) {
  return <div className="w-full" style={{ height: 1, background: color }} />;
}

/* ─── Cover Story project (even-indexed: large, 2-col internal) ─── */
function CoverStoryCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="py-16 sm:py-20"
    >
      {/* Project image */}
      <div style={{ marginBottom: 24, overflow: "hidden", position: "relative" }}>
        <img
          src={getProjectImage("editorial", project.image)}
          alt={project.title.replace(/\n/g, " ")}
          loading="lazy"
          style={{
            display: "block", width: "100%", aspectRatio: "16/9", objectFit: "cover",
            filter: "grayscale(0.8) contrast(1.2)",
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
        {/* Left: Title + Meta */}
        <div>
          <span
            className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.25em] block mb-4"
            style={{ color: C.dim }}
          >
            {num} / {project.client}
          </span>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group block cursor-pointer"
          >
            <h3
              className="font-[family-name:var(--font-dm-serif)] leading-[1.1] tracking-tight transition-colors duration-500"
              style={{
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                color: C.text,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = C.accent;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = C.text;
              }}
            >
              {project.title.replace(/\n/g, " ")}
            </h3>
          </a>
          <div className="flex items-center gap-3 mt-4">
            <span
              className="font-[family-name:var(--font-inter)] text-[11px] uppercase tracking-[0.15em]"
              style={{ color: C.dim }}
            >
              {project.year}
            </span>
          </div>
          {/* Tech */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-6">
            {project.tech.map((t) => (
              <span
                key={t}
                className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.12em]"
                style={{ color: "#999999" }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Description + Technical */}
        <div className="flex flex-col justify-center">
          <p
            className="font-[family-name:var(--font-body)] leading-[1.85]"
            style={{
              fontSize: "clamp(0.95rem, 1.2vw, 1.05rem)",
              color: C.dim,
            }}
          >
            {project.description}
          </p>
          <p
            className="font-[family-name:var(--font-body)] leading-[1.85] mt-4"
            style={{
              fontSize: "clamp(0.85rem, 1.1vw, 0.95rem)",
              color: "#999999",
            }}
          >
            {project.technical}
          </p>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.2em] transition-colors duration-300"
            style={{ color: C.dim }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = C.accent;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = C.dim;
            }}
          >
            View Project
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </a>
        </div>
      </div>
      {/* Thick bottom rule */}
      <div
        className="mt-16 sm:mt-20"
        style={{ height: 2, background: C.rule }}
      />
    </motion.div>
  );
}

/* ─── Column project (odd-indexed: compact, stacked) ─── */
function ColumnCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="py-10 sm:py-12 max-w-2xl"
    >
      <span
        className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.25em] block mb-3"
        style={{ color: "#BBBBBB" }}
      >
        {num} / {project.client} / {project.year}
      </span>

      {/* Project thumbnail */}
      <div style={{ float: "left", marginRight: 12, marginBottom: 8, width: 80, height: 56, overflow: "hidden", position: "relative", flexShrink: 0 }}>
        <img
          src={getProjectImage("editorial", project.image)}
          alt=""
          loading="lazy"
          style={{
            display: "block", width: "100%", height: "100%", objectFit: "cover",
            filter: "grayscale(0.8) contrast(1.2)",
          }}
        />
      </div>

      <a
        href={project.github}
        target="_blank"
        rel="noopener noreferrer"
        className="block cursor-pointer"
      >
        <h3
          className="font-[family-name:var(--font-dm-serif)] leading-[1.15] tracking-tight transition-colors duration-500"
          style={{
            fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
            color: C.text,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = C.accent;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = C.text;
          }}
        >
          {project.title.replace(/\n/g, " ")}
        </h3>
      </a>
      <p
        className="font-[family-name:var(--font-body)] leading-[1.8] mt-3 line-clamp-3"
        style={{
          fontSize: "clamp(0.9rem, 1.1vw, 1rem)",
          color: C.dim,
        }}
      >
        {project.description}
      </p>
      {/* Tech */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-4">
        {project.tech.map((t) => (
          <span
            key={t}
            className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.12em]"
            style={{ color: "#BBBBBB" }}
          >
            {t}
          </span>
        ))}
      </div>
      {/* Thin bottom rule */}
      <div className="mt-10 sm:mt-12" style={{ height: 1, background: C.rule }} />
    </motion.div>
  );
}

/* ===================================================================
   EDITORIAL — HIGH-FASHION MAGAZINE PORTFOLIO
   Vogue/Harper's Bazaar inspired, asymmetric 2-column sidebar layout
   =================================================================== */
export default function EditorialPage() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, margin: "-40px" });

  useEffect(() => {
    document.documentElement.style.setProperty("--scroll", "0");
    const handleScroll = () => {
      const scrolled =
        window.scrollY / (document.body.scrollHeight - window.innerHeight);
      document.documentElement.style.setProperty("--scroll", String(scrolled));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main
      className="min-h-screen overflow-x-hidden"
      style={{
        background: C.bg,
        color: C.text,
        colorScheme: "light",
      }}
    >
      {/* ─── MOBILE NAV (shown below md) ─── */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="md:hidden fixed top-0 left-0 right-0 z-50"
        style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: `1px solid ${C.rule}`,
        }}
      >
        <div className="px-6 py-4 flex items-center justify-between">
          <span
            className="font-[family-name:var(--font-dm-serif)] text-xl tracking-tight"
            style={{ color: C.text }}
          >
            Grox
          </span>
          <div className="flex items-center gap-6">
            {[
              { label: "Work", href: "#work" },
              { label: "About", href: "#about" },
              { label: "GitHub", href: "https://github.com/1aday", external: true },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.2em] transition-colors duration-300"
                style={{ color: C.dim }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = C.text;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = C.dim;
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* ─── MAIN GRID: Sidebar + Content ─── */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: "1fr",
        }}
      >
        {/* ─── LEFT SIDEBAR (desktop only) ─── */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="hidden md:flex fixed top-0 left-0 z-40 flex-col justify-between"
          style={{
            width: 240,
            height: "100vh",
            background: C.sidebar,
            borderLeft: `2px solid ${C.accent}`,
            padding: "40px 28px",
          }}
        >
          {/* Top: Logo + Nav */}
          <div>
            {/* Logo — vertical text */}
            <div className="mb-12">
              <span
                className="font-[family-name:var(--font-dm-serif)] text-2xl tracking-tight block"
                style={{ color: C.text }}
              >
                Grox
              </span>
              <span
                className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.3em] block mt-1"
                style={{ color: "#AAAAAA" }}
              >
                AI Product Studio
              </span>
            </div>

            {/* Navigation links */}
            <nav className="flex flex-col gap-5">
              {[
                { label: "Work", href: "#work" },
                { label: "Expertise", href: "#about" },
                { label: "Stack", href: "#stack" },
                { label: "Contact", href: "#footer" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.25em] transition-colors duration-300"
                  style={{ color: C.dim }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = C.accent;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = C.dim;
                  }}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Bottom: Metadata */}
          <div>
            <div
              className="mb-4"
              style={{ height: 1, background: C.rule }}
            />
            <span
              className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.25em] block"
              style={{ color: "#BBBBBB" }}
            >
              Portfolio 2024 - 2025
            </span>
            <a
              href="https://github.com/1aday"
              target="_blank"
              rel="noopener noreferrer"
              className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.25em] block mt-2 transition-colors duration-300"
              style={{ color: "#BBBBBB" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = C.accent;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#BBBBBB";
              }}
            >
              github.com/1aday
            </a>
          </div>
        </motion.aside>

        {/* ─── RIGHT COLUMN (all main content) ─── */}
        <div
          className="min-h-screen"
          style={{
            marginLeft: 0,
          }}
        >
          {/* Responsive margin for sidebar on desktop */}
          <style
            dangerouslySetInnerHTML={{
              __html: `
                @media (min-width: 768px) {
                  .editorial-content { margin-left: 240px; }
                }
              `,
            }}
          />
          <div className="editorial-content">
            {/* ─── ART BANNER ─── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full overflow-hidden mt-[56px] md:mt-0"
              style={{ height: "50vh", minHeight: 360 }}
            >
              <img
                src="/themes/editorial/editorial-art.webp"
                alt="Editorial art"
                className="w-full h-full object-cover"
                style={{
                  filter: "grayscale(30%) contrast(1.05)",
                }}
              />
              {/* Overlay gradient for text readability */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(255,255,255,0) 40%, rgba(255,255,255,0.6) 80%, rgba(255,255,255,1) 100%)",
                }}
              />
            </motion.div>

            {/* ─── MASSIVE STACKED HEADLINE ─── */}
            <section className="px-6 sm:px-10 lg:px-16 pt-12 sm:pt-16 pb-8">
              <motion.div
                ref={heroRef}
                initial={{ opacity: 0, y: 60 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
                transition={{
                  duration: 1.4,
                  delay: 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <h1
                  className="font-[family-name:var(--font-dm-serif)] tracking-[-0.03em]"
                  style={{
                    fontSize: "clamp(3rem, 8vw, 8rem)",
                    lineHeight: 0.95,
                    color: C.text,
                  }}
                >
                  <span className="block">I turn</span>
                  <span className="block relative">
                    <span className="relative inline-block">
                      AI models
                      {/* Red accent underline on "AI" */}
                      <span
                        className="absolute left-0 bottom-[0.05em]"
                        style={{
                          width: "1.85em",
                          height: 3,
                          background: C.accent,
                        }}
                      />
                    </span>
                  </span>
                  <span className="block">into products</span>
                </h1>
              </motion.div>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                transition={{
                  duration: 1,
                  delay: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="font-[family-name:var(--font-body)] leading-[1.75] mt-8 max-w-xl"
                style={{
                  fontSize: "clamp(1rem, 1.3vw, 1.15rem)",
                  color: C.dim,
                }}
              >
                End-to-end product ownership &mdash; from computer vision and
                multi-model orchestration to pixel-perfect interfaces.
              </motion.p>

              {/* Stats as editorial metadata inline */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{
                  duration: 0.8,
                  delay: 0.9,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex items-center gap-0 mt-10"
              >
                {stats.map((stat, i) => (
                  <div key={stat.label} className="flex items-center">
                    {i > 0 && (
                      <div
                        className="mx-4 sm:mx-6"
                        style={{
                          width: 1,
                          height: 28,
                          background: C.rule,
                        }}
                      />
                    )}
                    <span className="font-[family-name:var(--font-inter)] text-[11px] uppercase tracking-[0.15em]">
                      <span style={{ color: C.text, fontWeight: 600 }}>
                        {stat.value}
                      </span>{" "}
                      <span style={{ color: "#999999" }}>{stat.label}</span>
                    </span>
                  </div>
                ))}
              </motion.div>
            </section>

            {/* Thin red rule after hero */}
            <div className="px-6 sm:px-10 lg:px-16">
              <div style={{ height: 1, background: C.accent, opacity: 0.3 }} />
            </div>

            {/* ─── PROJECTS SECTION ─── */}
            <section
              id="work"
              className="px-6 sm:px-10 lg:px-16 pt-20 sm:pt-28 pb-8"
            >
              <Reveal>
                <span
                  className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.3em] block mb-3"
                  style={{ color: "#BBBBBB" }}
                >
                  Portfolio
                </span>
                <h2
                  className="font-[family-name:var(--font-dm-serif)] tracking-tight"
                  style={{
                    fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                    lineHeight: 1.05,
                    color: C.text,
                  }}
                >
                  Selected Work
                </h2>
              </Reveal>

              <div className="mt-12 sm:mt-16">
                {projects.map((project, i) =>
                  i % 2 === 0 ? (
                    <CoverStoryCard
                      key={project.title}
                      project={project}
                      index={i}
                    />
                  ) : (
                    <ColumnCard
                      key={project.title}
                      project={project}
                      index={i}
                    />
                  )
                )}
              </div>
            </section>

            {/* ─── EXPERTISE SECTION — Pull-quote style ─── */}
            <section
              id="about"
              className="px-6 sm:px-10 lg:px-16 py-20 sm:py-28"
            >
              <Reveal>
                <span
                  className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.3em] block mb-3"
                  style={{ color: "#BBBBBB" }}
                >
                  Expertise
                </span>
                <h2
                  className="font-[family-name:var(--font-dm-serif)] tracking-tight"
                  style={{
                    fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                    lineHeight: 1.05,
                    color: C.text,
                  }}
                >
                  What I Do
                </h2>
              </Reveal>

              <div className="mt-16 sm:mt-20 flex flex-col">
                {expertise.map((item, i) => (
                  <Reveal key={item.title} delay={i * 0.1}>
                    <div
                      className="py-12 sm:py-16"
                      style={{
                        borderBottom:
                          i < expertise.length - 1
                            ? `1px solid ${C.rule}`
                            : "none",
                      }}
                    >
                      {/* Pull-quote number */}
                      <span
                        className="font-[family-name:var(--font-dm-serif)] italic leading-none select-none block mb-4"
                        style={{
                          fontSize: "clamp(3rem, 5vw, 5rem)",
                          color: C.rule,
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      {/* Title as large italic pull-quote */}
                      <h3
                        className="font-[family-name:var(--font-dm-serif)] italic tracking-tight"
                        style={{
                          fontSize: "clamp(1.75rem, 3vw, 2.75rem)",
                          lineHeight: 1.15,
                          color: C.text,
                        }}
                      >
                        {item.title}
                      </h3>

                      {/* Body with drop cap on the FIRST expertise item only */}
                      {i === 0 ? (
                        <p
                          className="font-[family-name:var(--font-body)] leading-[1.85] mt-6 max-w-2xl"
                          style={{
                            fontSize: "clamp(0.95rem, 1.2vw, 1.05rem)",
                            color: C.dim,
                          }}
                        >
                          <span
                            className="font-[family-name:var(--font-dm-serif)] float-left mr-3"
                            style={{
                              fontSize: "4rem",
                              lineHeight: 0.8,
                              color: C.accent,
                              paddingTop: "0.1em",
                            }}
                          >
                            {item.body.charAt(0)}
                          </span>
                          {item.body.slice(1)}
                        </p>
                      ) : (
                        <p
                          className="font-[family-name:var(--font-body)] leading-[1.85] mt-6 max-w-2xl"
                          style={{
                            fontSize: "clamp(0.95rem, 1.2vw, 1.05rem)",
                            color: C.dim,
                          }}
                        >
                          {item.body}
                        </p>
                      )}
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* ─── TOOLS SECTION — Editorial Table ─── */}
            <section
              id="stack"
              className="px-6 sm:px-10 lg:px-16 py-20 sm:py-28"
            >
              <Reveal>
                <span
                  className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.3em] block mb-3"
                  style={{ color: "#BBBBBB" }}
                >
                  Stack
                </span>
                <h2
                  className="font-[family-name:var(--font-dm-serif)] tracking-tight"
                  style={{
                    fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                    lineHeight: 1.05,
                    color: C.text,
                  }}
                >
                  Tools &amp; Technologies
                </h2>
              </Reveal>

              <div className="mt-12 sm:mt-16 max-w-3xl">
                {tools.map((group, gi) => (
                  <Reveal key={group.label} delay={gi * 0.06}>
                    <div
                      className="flex items-baseline justify-between py-5 sm:py-6"
                      style={{
                        borderBottom: `1px solid ${C.rule}`,
                      }}
                    >
                      {/* Label — left-aligned */}
                      <span
                        className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.25em] shrink-0"
                        style={{ color: "#AAAAAA" }}
                      >
                        {group.label}
                      </span>

                      {/* Items — right-aligned */}
                      <div className="flex flex-wrap justify-end gap-x-5 gap-y-1 ml-8">
                        {group.items.map((item) => (
                          <span
                            key={item}
                            className="font-[family-name:var(--font-body)] text-[14px] cursor-default transition-colors duration-300"
                            style={{ color: C.dim }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = C.text;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = C.dim;
                            }}
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* ─── FOOTER ─── */}
            <footer id="footer" className="px-6 sm:px-10 lg:px-16 py-20 sm:py-28">
              {/* Thin red rule above */}
              <div
                className="mb-12 sm:mb-16 mx-auto max-w-xs"
                style={{ height: 1, background: C.accent, opacity: 0.4 }}
              />

              <Reveal>
                <div className="text-center">
                  <h3
                    className="font-[family-name:var(--font-dm-serif)] italic tracking-tight"
                    style={{
                      fontSize: "clamp(2rem, 4vw, 3.5rem)",
                      color: C.text,
                      lineHeight: 1.1,
                    }}
                  >
                    Let&apos;s build something.
                  </h3>
                  <a
                    href="https://github.com/1aday"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-8 font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.25em] transition-colors duration-300"
                    style={{ color: C.dim }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = C.accent;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = C.dim;
                    }}
                  >
                    github.com/1aday
                  </a>
                  <div className="mt-12">
                    <span
                      className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.25em]"
                      style={{ color: "#CCCCCC" }}
                    >
                      Grox AI Product Studio &mdash; 2024 &ndash; Present
                    </span>
                  </div>
                </div>
              </Reveal>
            </footer>

            {/* Theme Switcher */}
            <ThemeSwitcher current="/editorial" variant="light" />
          </div>
        </div>
      </div>
    </main>
  );
}
