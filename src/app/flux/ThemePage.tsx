"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { getProjectImage } from "@/lib/theme-images";

/* ─── Color constants ─── */
const C = {
  bg: "#FFF7ED",
  coral: "#FF6B6B",
  teal: "#0891B2",
  cream: "#FFF7ED",
  dark: "#1A1A2E",
  muted: "#64748B",
  card: "#FFFFFF",
  rule: "rgba(8,145,178,0.15)",
};

/* ─── Diagonal rule ─── */
function DiagonalRule() {
  return (
    <div className="relative h-24 overflow-hidden">
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(135deg, ${C.coral}15 0%, ${C.teal}15 100%)`,
          clipPath: "polygon(0 40%, 100% 0%, 100% 60%, 0% 100%)",
        }}
      />
    </div>
  );
}

/* ─── Scroll reveal wrapper ─── */
function Reveal({
  children,
  className = "",
  delay = 0,
  direction = "left",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "left" | "right" | "up";
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const xOffset = direction === "left" ? -60 : direction === "right" ? 60 : 0;
  const yOffset = direction === "up" ? 40 : 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: xOffset, y: yOffset }}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 0, x: xOffset, y: yOffset }
      }
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Zigzag project card ─── */
function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const isEven = index % 2 === 0;
  const num = String(index + 1).padStart(2, "0");

  const imageBlock = (
    <div className="relative overflow-hidden rounded-2xl group/img" style={{ aspectRatio: "4/3" }}>
      <motion.img
        src={getProjectImage("flux", project.image)}
        alt={project.title}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105"
      />
      <div
        className="absolute inset-0 opacity-0 group-hover/img:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${C.coral}30, ${C.teal}30)`,
        }}
      />
      <div
        className="absolute top-4 left-4 font-[family-name:var(--font-sora)] font-bold text-sm px-3 py-1 rounded-full"
        style={{ background: C.coral, color: "#FFF" }}
      >
        {num}
      </div>
    </div>
  );

  const textBlock = (
    <div className="flex flex-col justify-center gap-4 py-4">
      <div className="flex items-center gap-3">
        <span
          className="text-[11px] uppercase tracking-[0.2em] font-[family-name:var(--font-inter)] font-medium"
          style={{ color: C.teal }}
        >
          {project.client}
        </span>
        <span style={{ color: `${C.muted}60` }}>/</span>
        <span
          className="text-[11px] uppercase tracking-[0.2em] font-[family-name:var(--font-inter)]"
          style={{ color: C.muted }}
        >
          {project.year}
        </span>
      </div>
      <h3
        className="font-[family-name:var(--font-sora)] font-semibold leading-[1.15] whitespace-pre-line"
        style={{
          fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
          color: C.dark,
        }}
      >
        {project.title}
      </h3>
      <p
        className="font-[family-name:var(--font-inter)] text-[14px] leading-[1.8] font-light"
        style={{ color: C.muted }}
      >
        {project.description}
      </p>
      <div className="flex flex-wrap gap-2 mt-1">
        {project.tech.map((t) => (
          <span
            key={t}
            className="text-[10px] uppercase tracking-[0.12em] font-[family-name:var(--font-inter)] font-medium rounded-full px-3 py-1"
            style={{
              color: C.teal,
              background: `${C.teal}12`,
            }}
          >
            {t}
          </span>
        ))}
      </div>
      <a
        href={project.github}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 mt-2 text-[12px] font-medium font-[family-name:var(--font-sora)] transition-colors duration-300"
        style={{ color: C.coral }}
        onMouseEnter={(e) => (e.currentTarget.style.color = C.teal)}
        onMouseLeave={(e) => (e.currentTarget.style.color = C.coral)}
      >
        View Project
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 17L17 7M17 7H7M17 7V17" />
        </svg>
      </a>
    </div>
  );

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isEven ? -80 : 80 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? -80 : 80 }}
      transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {/* Diagonal background slash */}
      <div
        className="absolute inset-0 -z-10 rounded-3xl"
        style={{
          background: isEven
            ? `linear-gradient(135deg, ${C.coral}06 0%, ${C.teal}06 100%)`
            : `linear-gradient(225deg, ${C.coral}06 0%, ${C.teal}06 100%)`,
          clipPath: isEven
            ? "polygon(0 0, 100% 5%, 100% 100%, 0 95%)"
            : "polygon(0 5%, 100% 0, 100% 95%, 0 100%)",
        }}
      />

      {/* Desktop: alternating image/text */}
      <div className="hidden md:grid md:grid-cols-2 md:gap-12 lg:gap-16 items-center py-8">
        {isEven ? (
          <>
            {imageBlock}
            {textBlock}
          </>
        ) : (
          <>
            {textBlock}
            {imageBlock}
          </>
        )}
      </div>

      {/* Mobile: always image first */}
      <div className="md:hidden flex flex-col gap-6 py-6">
        {imageBlock}
        {textBlock}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   FLUX — DIAGONAL SPLIT-SCREEN
   ═══════════════════════════════════════════ */
export default function FluxPage() {
  useEffect(() => {
    document.documentElement.style.setProperty("--scroll", "0");
    const handleScroll = () => {
      const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      document.documentElement.style.setProperty("--scroll", String(scrolled));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const allToolItems = tools.flatMap((g) => g.items);

  return (
    <main
      className="min-h-screen overflow-hidden font-[family-name:var(--font-inter)]"
      style={{ background: C.bg, color: C.dark }}
    >
      {/* ─── Navigation ─── */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b"
        style={{
          background: `${C.bg}EE`,
          borderColor: `${C.teal}15`,
        }}
      >
        <div className="mx-auto max-w-[1200px] px-4 sm:px-10 py-5 flex items-center justify-between">
          <span className="font-[family-name:var(--font-sora)] text-xl font-bold tracking-tight">
            Grox
            <span
              style={{
                background: `linear-gradient(135deg, ${C.coral}, ${C.teal})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              .
            </span>
          </span>
          <div className="flex items-center gap-6 sm:gap-8">
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
                className="text-[11px] uppercase tracking-[0.15em] font-[family-name:var(--font-sora)] font-medium transition-colors duration-300"
                style={{ color: C.muted }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.coral)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* ─── Hero ─── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Diagonal background split */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: `linear-gradient(135deg, ${C.coral}12 0%, transparent 50%, ${C.teal}12 100%)`,
          }}
        />
        <div
          className="absolute inset-0 -z-10"
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% 55%, 0 75%)",
            background: `linear-gradient(135deg, ${C.coral}08, ${C.teal}08)`,
          }}
        />

        {/* Floating gradient orbs */}
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] right-[15%] w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${C.coral}20 0%, transparent 70%)`,
            filter: "blur(80px)",
          }}
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[10%] left-[10%] w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${C.teal}20 0%, transparent 70%)`,
            filter: "blur(80px)",
          }}
        />

        <div className="relative mx-auto max-w-[1200px] px-4 sm:px-10 w-full pt-32 sm:pt-0">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="h-2 w-2 rounded-full" style={{ background: C.coral }} />
              <span
                className="text-[11px] uppercase tracking-[0.3em] font-[family-name:var(--font-sora)] font-medium"
                style={{ color: C.muted }}
              >
                AI Product Studio
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="font-[family-name:var(--font-sora)] font-bold leading-[1.05] tracking-tight"
              style={{ fontSize: "clamp(2.8rem, 7vw, 6rem)" }}
            >
              <span style={{ color: C.dark }}>I turn </span>
              <span
                style={{
                  background: `linear-gradient(135deg, ${C.coral}, ${C.teal})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                AI models
              </span>
              <br />
              <span style={{ color: `${C.muted}CC` }}>into products people use</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-8 text-[15px] leading-[1.9] font-light max-w-xl"
              style={{ color: C.muted }}
            >
              End-to-end product ownership — from computer vision and multi-model
              orchestration to pixel-perfect interfaces. 30+ shipped applications
              across 8 industries.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-12 flex gap-10 sm:gap-14"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.9 + i * 0.1 }}
                >
                  <div
                    className="font-[family-name:var(--font-sora)] font-bold text-4xl sm:text-5xl"
                    style={{
                      background: `linear-gradient(135deg, ${C.coral}, ${C.teal})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-[10px] uppercase tracking-[0.2em] mt-2 font-[family-name:var(--font-sora)]"
                    style={{ color: C.muted }}
                  >
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-[2px] h-8 rounded-full"
            style={{
              background: `linear-gradient(to bottom, ${C.coral}, ${C.teal})`,
            }}
          />
        </motion.div>
      </section>

      <DiagonalRule />

      {/* ─── Selected Work ─── */}
      <section id="work" className="mx-auto max-w-[1200px] px-4 sm:px-10 py-20 sm:py-28">
        <Reveal direction="left">
          <div className="flex items-end justify-between mb-16">
            <div>
              <span
                className="text-[11px] uppercase tracking-[0.3em] block mb-4 font-[family-name:var(--font-sora)] font-medium"
                style={{ color: C.teal }}
              >
                Portfolio
              </span>
              <h2
                className="font-[family-name:var(--font-sora)] font-bold text-4xl sm:text-5xl tracking-tight"
                style={{ color: C.dark }}
              >
                Selected{" "}
                <span
                  style={{
                    background: `linear-gradient(135deg, ${C.coral}, ${C.teal})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Work
                </span>
              </h2>
            </div>
            <span
              className="text-[11px] uppercase tracking-[0.2em] hidden sm:block font-[family-name:var(--font-sora)]"
              style={{ color: C.muted }}
            >
              {projects.length} Projects
            </span>
          </div>
        </Reveal>

        <div className="flex flex-col gap-8 sm:gap-12">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </section>

      <DiagonalRule />

      {/* ─── Expertise ─── */}
      <section id="about" className="mx-auto max-w-[1200px] px-4 sm:px-10 py-24 sm:py-36">
        <Reveal direction="right">
          <span
            className="text-[11px] uppercase tracking-[0.3em] block mb-4 font-[family-name:var(--font-sora)] font-medium"
            style={{ color: C.coral }}
          >
            Expertise
          </span>
          <h2
            className="font-[family-name:var(--font-sora)] font-bold text-4xl sm:text-5xl tracking-tight max-w-3xl leading-[1.1]"
            style={{ color: C.dark }}
          >
            Building at the intersection of{" "}
            <span
              style={{
                background: `linear-gradient(135deg, ${C.coral}, ${C.teal})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              design
            </span>{" "}
            and intelligence
          </h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-8 mt-16">
          {expertise.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1} direction={i % 2 === 0 ? "left" : "right"}>
              <div
                className="group p-8 rounded-2xl transition-all duration-500 border"
                style={{
                  background: C.card,
                  borderColor: `${C.teal}15`,
                  boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${C.coral}40`;
                  e.currentTarget.style.boxShadow = `0 8px 32px ${C.coral}12`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${C.teal}15`;
                  e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.04)";
                }}
              >
                <div className="flex items-center gap-4 mb-5">
                  <span
                    className="font-[family-name:var(--font-sora)] font-bold text-4xl"
                    style={{
                      background: `linear-gradient(135deg, ${C.coral}, ${C.teal})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div
                    className="h-[2px] w-8 rounded-full transition-all duration-500 group-hover:w-16"
                    style={{
                      background: `linear-gradient(90deg, ${C.coral}, ${C.teal})`,
                    }}
                  />
                </div>
                <h3
                  className="text-lg font-[family-name:var(--font-sora)] font-semibold tracking-tight mb-3"
                  style={{ color: C.dark }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-[14px] leading-[1.8] font-light font-[family-name:var(--font-inter)]"
                  style={{ color: C.muted }}
                >
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <DiagonalRule />

      {/* ─── Tools ─── */}
      <section className="py-24 sm:py-32 overflow-hidden">
        <Reveal direction="left" className="mx-auto max-w-[1200px] px-4 sm:px-10 mb-12">
          <span
            className="text-[11px] uppercase tracking-[0.3em] block mb-4 font-[family-name:var(--font-sora)] font-medium"
            style={{ color: C.teal }}
          >
            Stack
          </span>
          <h2
            className="font-[family-name:var(--font-sora)] font-bold text-4xl sm:text-5xl tracking-tight"
            style={{ color: C.dark }}
          >
            Tools &amp; Technologies
          </h2>
        </Reveal>

        {/* Ticker */}
        <div className="relative w-full overflow-hidden">
          <div
            className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: `linear-gradient(to right, ${C.bg}, transparent)` }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: `linear-gradient(to left, ${C.bg}, transparent)` }}
          />
          <div className="flex animate-marquee whitespace-nowrap">
            {[...allToolItems, ...allToolItems].map((item, i) => (
              <span key={i} className="flex items-center">
                <span
                  className="font-[family-name:var(--font-sora)] font-semibold text-xl sm:text-2xl px-4 sm:px-6"
                  style={{ color: `${C.dark}CC` }}
                >
                  {item}
                </span>
                <span
                  className="text-[8px]"
                  style={{
                    background: `linear-gradient(135deg, ${C.coral}, ${C.teal})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  &#9679;
                </span>
              </span>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-[1200px] px-4 sm:px-10 mt-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-10">
            {tools.map((group, gi) => (
              <Reveal key={group.label} delay={gi * 0.05} direction={gi % 2 === 0 ? "left" : "right"}>
                <h4
                  className="text-[10px] uppercase tracking-[0.25em] mb-4 font-[family-name:var(--font-sora)] font-medium"
                  style={{ color: C.coral }}
                >
                  {group.label}
                </h4>
                <div className="flex flex-col gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="text-[14px] font-light cursor-default transition-colors duration-300 font-[family-name:var(--font-inter)]"
                      style={{ color: C.muted }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = C.dark)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <DiagonalRule />

      {/* ─── Footer ─── */}
      <footer className="mx-auto max-w-[1200px] px-4 sm:px-10 py-24 sm:py-36">
        <Reveal direction="up">
          <div className="text-center">
            <h2
              className="font-[family-name:var(--font-sora)] font-bold tracking-tight leading-[1.1]"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", color: C.dark }}
            >
              Let&apos;s build{" "}
              <span
                style={{
                  background: `linear-gradient(135deg, ${C.coral}, ${C.teal})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                something.
              </span>
            </h2>
            <div className="mt-10 flex justify-center gap-8">
              <a
                href="https://github.com/1aday"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] uppercase tracking-[0.2em] font-[family-name:var(--font-sora)] font-medium transition-colors duration-300"
                style={{ color: C.muted }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.coral)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
              >
                GitHub &#8599;
              </a>
            </div>
          </div>
        </Reveal>

        <div
          className="mt-16 mb-8 mx-auto max-w-xl h-[2px] rounded-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${C.coral}30, ${C.teal}30, transparent)`,
          }}
        />

        <div className="flex items-center justify-between">
          <span
            className="text-[10px] uppercase tracking-[0.2em] font-[family-name:var(--font-sora)]"
            style={{ color: `${C.muted}80` }}
          >
            Grox AI Product Studio
          </span>
          <span
            className="text-[10px] uppercase tracking-[0.2em] font-[family-name:var(--font-sora)]"
            style={{ color: `${C.muted}80` }}
          >
            2024 &mdash; Present
          </span>
        </div>
      </footer>

      <ThemeSwitcher current="/flux" variant="light" />
    </main>
  );
}
