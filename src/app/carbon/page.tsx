"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { getProjectImage } from "@/lib/theme-images";

/* ─── Color constants ─── */
const C = {
  bg: "#0C0C0C",
  card: "#111111",
  cyan: "#06B6D4",
  dim: "#3F3F46",
  muted: "#71717A",
  text: "#D4D4D8",
  grid: "rgba(6,182,212,0.04)",
};

/* ─── Corner markers (┌ ┐ └ ┘) ─── */
function CornerMarkers({ color = C.cyan }: { color?: string }) {
  const style = { position: "absolute" as const, width: "12px", height: "12px" };
  const lineStyle = { background: color };
  return (
    <>
      {/* Top-left ┌ */}
      <div style={{ ...style, top: 0, left: 0 }}>
        <div className="absolute top-0 left-0 w-full h-[1px]" style={lineStyle} />
        <div className="absolute top-0 left-0 w-[1px] h-full" style={lineStyle} />
      </div>
      {/* Top-right ┐ */}
      <div style={{ ...style, top: 0, right: 0 }}>
        <div className="absolute top-0 right-0 w-full h-[1px]" style={lineStyle} />
        <div className="absolute top-0 right-0 w-[1px] h-full" style={lineStyle} />
      </div>
      {/* Bottom-left └ */}
      <div style={{ ...style, bottom: 0, left: 0 }}>
        <div className="absolute bottom-0 left-0 w-full h-[1px]" style={lineStyle} />
        <div className="absolute bottom-0 left-0 w-[1px] h-full" style={lineStyle} />
      </div>
      {/* Bottom-right ┘ */}
      <div style={{ ...style, bottom: 0, right: 0 }}>
        <div className="absolute bottom-0 right-0 w-full h-[1px]" style={lineStyle} />
        <div className="absolute bottom-0 right-0 w-[1px] h-full" style={lineStyle} />
      </div>
    </>
  );
}

/* ─── Section label (SECTION 02 // TITLE) ─── */
function SectionLabel({ number, label }: { number: string; label: string }) {
  return (
    <div
      className="text-[10px] uppercase tracking-[0.3em] font-[family-name:var(--font-jetbrains)] mb-8"
      style={{ color: C.cyan }}
    >
      SECTION {number} // {label}
    </div>
  );
}

/* ─── Blueprint rule ─── */
function BlueprintRule() {
  return (
    <div className="relative py-3">
      <div className="h-[1px]" style={{ background: `${C.cyan}15` }} />
      <div
        className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-[8px] px-4 font-[family-name:var(--font-jetbrains)]"
        style={{ color: `${C.cyan}40`, background: C.bg }}
      >
        ///
      </div>
    </div>
  );
}

/* ─── Scroll reveal wrapper ─── */
function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Spec-sheet project card ─── */
function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [isHovered, setIsHovered] = useState(false);
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card body */}
      <div
        className="relative p-6 sm:p-8 overflow-hidden transition-all duration-500"
        style={{
          background: C.card,
          border: `1px solid ${isHovered ? `${C.cyan}40` : `${C.dim}30`}`,
        }}
      >
        <CornerMarkers color={isHovered ? C.cyan : `${C.dim}60`} />

        {/* Scan-line on hover */}
        <motion.div
          className="absolute left-0 right-0 h-[1px] pointer-events-none"
          style={{ background: `${C.cyan}30` }}
          initial={{ top: 0, opacity: 0 }}
          animate={isHovered ? { top: ["0%", "100%"], opacity: [0, 1, 0] } : { opacity: 0 }}
          transition={{ duration: 1.5, ease: "linear" }}
        />

        <div className="grid sm:grid-cols-[1fr,1.5fr] gap-6 sm:gap-8">
          {/* Left: Image */}
          <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
            <img
              src={getProjectImage("carbon", project.image)}
              alt={project.title}
              loading="lazy"
              className="w-full h-full object-cover transition-all duration-700"
              style={{
                filter: isHovered ? "none" : "grayscale(0.6) brightness(0.8)",
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(180deg, transparent, ${C.bg}40)`,
              }}
            />
            {/* Coordinate marker */}
            <div
              className="absolute top-2 left-2 text-[8px] font-[family-name:var(--font-jetbrains)]"
              style={{ color: `${C.cyan}60` }}
            >
              X:{index * 2} Y:{index}
            </div>
          </div>

          {/* Right: Spec sheet */}
          <div className="flex flex-col gap-3">
            {/* Project number */}
            <div
              className="text-[10px] font-[family-name:var(--font-jetbrains)] mb-1"
              style={{ color: `${C.cyan}80` }}
            >
              PROJECT_{num}
            </div>

            {/* Title */}
            <h3
              className="font-[family-name:var(--font-space-grotesk)] font-semibold leading-[1.15] whitespace-pre-line"
              style={{
                fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
                color: C.text,
              }}
            >
              {project.title}
            </h3>

            {/* Spec fields */}
            <div className="mt-1 flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span
                  className="text-[9px] uppercase tracking-[0.15em] font-[family-name:var(--font-jetbrains)]"
                  style={{ color: C.cyan }}
                >
                  CLIENT:
                </span>
                <span
                  className="text-[12px] font-[family-name:var(--font-jetbrains)]"
                  style={{ color: C.muted }}
                >
                  {project.client}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="text-[9px] uppercase tracking-[0.15em] font-[family-name:var(--font-jetbrains)]"
                  style={{ color: C.cyan }}
                >
                  YEAR:
                </span>
                <span
                  className="text-[12px] font-[family-name:var(--font-jetbrains)]"
                  style={{ color: C.muted }}
                >
                  {project.year}
                </span>
              </div>
            </div>

            {/* Description */}
            <p
              className="text-[13px] leading-[1.7] font-light font-[family-name:var(--font-jetbrains)]"
              style={{ color: C.muted }}
            >
              {project.description}
            </p>

            {/* Tech tags as terminal labels */}
            <div className="flex flex-wrap gap-1.5 mt-1">
              <span
                className="text-[9px] uppercase tracking-[0.15em] font-[family-name:var(--font-jetbrains)]"
                style={{ color: C.cyan }}
              >
                TECH:
              </span>
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="text-[10px] font-[family-name:var(--font-jetbrains)] px-2 py-0.5"
                  style={{
                    color: C.cyan,
                    border: `1px solid ${C.cyan}30`,
                    background: `${C.cyan}08`,
                  }}
                >
                  [ {t.toUpperCase()} ]
                </span>
              ))}
            </div>

            {/* Link */}
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-2 text-[10px] uppercase tracking-[0.15em] font-[family-name:var(--font-jetbrains)] transition-colors duration-300"
              style={{ color: `${C.cyan}80` }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.cyan)}
              onMouseLeave={(e) => (e.currentTarget.style.color = `${C.cyan}80`)}
            >
              &gt; VIEW_PROJECT
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   CARBON — TECHNICAL BLUEPRINT
   ═══════════════════════════════════════════ */
export default function CarbonPage() {
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
      className="min-h-screen overflow-hidden font-[family-name:var(--font-jetbrains)]"
      style={{
        background: C.bg,
        color: C.text,
        backgroundImage: `
          linear-gradient(${C.grid} 1px, transparent 1px),
          linear-gradient(90deg, ${C.grid} 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }}
    >
      {/* ─── Navigation ─── */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b"
        style={{
          background: `${C.bg}EE`,
          borderColor: `${C.cyan}15`,
        }}
      >
        <div className="mx-auto max-w-[1200px] px-4 sm:px-10 py-5 flex items-center justify-between">
          <span className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold tracking-wider">
            GROX<span style={{ color: C.cyan }}>_</span>
          </span>
          <div className="flex items-center gap-6 sm:gap-8">
            {[
              { label: "WORK", href: "#work" },
              { label: "ABOUT", href: "#about" },
              { label: "GITHUB", href: "https://github.com/1aday", external: true },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="text-[10px] tracking-[0.2em] transition-colors duration-300"
                style={{ color: C.muted }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.cyan)}
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
        {/* Crosshair graphic */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.06]">
          <svg width="600" height="600" viewBox="0 0 600 600" fill="none" stroke={C.cyan}>
            <circle cx="300" cy="300" r="200" strokeWidth="0.5" />
            <circle cx="300" cy="300" r="150" strokeWidth="0.5" />
            <circle cx="300" cy="300" r="100" strokeWidth="0.5" />
            <line x1="300" y1="0" x2="300" y2="600" strokeWidth="0.5" />
            <line x1="0" y1="300" x2="600" y2="300" strokeWidth="0.5" />
          </svg>
        </div>

        {/* Coordinate labels */}
        <div
          className="absolute top-28 left-4 sm:left-10 text-[9px]"
          style={{ color: `${C.cyan}30` }}
        >
          X:0 Y:0
        </div>
        <div
          className="absolute top-28 right-4 sm:right-10 text-[9px]"
          style={{ color: `${C.cyan}30` }}
        >
          X:1920 Y:0
        </div>

        <div className="relative mx-auto max-w-[1200px] px-4 sm:px-10 w-full pt-32 sm:pt-0">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="h-2 w-2" style={{ background: C.cyan }} />
              <span
                className="text-[10px] tracking-[0.3em]"
                style={{ color: C.cyan }}
              >
                // AI_PRODUCT_STUDIO
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="font-[family-name:var(--font-space-grotesk)] font-bold leading-[1.1] tracking-tight"
              style={{ fontSize: "clamp(2.5rem, 6.5vw, 5.5rem)" }}
            >
              <span style={{ color: C.text }}>I turn </span>
              <span style={{ color: C.cyan }}>AI models</span>
              <br />
              <span style={{ color: C.muted }}>into products people use</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-8 text-[13px] leading-[1.9] font-light max-w-xl"
              style={{ color: C.muted }}
            >
              End-to-end product ownership — from computer vision and multi-model
              orchestration to pixel-perfect interfaces. 30+ shipped applications
              across 8 industries.
            </motion.p>

            {/* Stats as gauge-like displays */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="mt-12 flex gap-8 sm:gap-12"
            >
              {stats.map((stat, i) => (
                <div key={stat.label} className="relative">
                  <div
                    className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center"
                  >
                    {/* Circular gauge */}
                    <svg className="absolute inset-0" viewBox="0 0 80 80" fill="none">
                      <circle cx="40" cy="40" r="36" stroke={`${C.dim}40`} strokeWidth="1" />
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke={C.cyan}
                        strokeWidth="1"
                        strokeDasharray={`${(i + 1) * 60} ${226 - (i + 1) * 60}`}
                        strokeLinecap="round"
                        transform="rotate(-90 40 40)"
                      />
                    </svg>
                    <span
                      className="font-[family-name:var(--font-space-grotesk)] font-bold text-lg sm:text-xl"
                      style={{ color: C.cyan }}
                    >
                      {stat.value}
                    </span>
                  </div>
                  <div
                    className="text-[8px] tracking-[0.2em] mt-2 text-center uppercase"
                    style={{ color: C.muted }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[8px] tracking-[0.2em]" style={{ color: `${C.cyan}40` }}>
            SCROLL
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-[1px] h-6"
            style={{ background: `linear-gradient(to bottom, ${C.cyan}60, transparent)` }}
          />
        </motion.div>
      </section>

      <div className="mx-auto max-w-[1200px] px-4 sm:px-10">
        <BlueprintRule />
      </div>

      {/* ─── Selected Work ─── */}
      <section id="work" className="mx-auto max-w-[1200px] px-4 sm:px-10 py-20 sm:py-28">
        <Reveal>
          <SectionLabel number="02" label="SELECTED WORK" />
          <div className="flex items-end justify-between mb-12">
            <h2
              className="font-[family-name:var(--font-space-grotesk)] font-bold text-3xl sm:text-5xl tracking-tight"
              style={{ color: C.text }}
            >
              Selected <span style={{ color: C.cyan }}>Work</span>
            </h2>
            <span
              className="text-[10px] tracking-[0.15em] hidden sm:block"
              style={{ color: C.muted }}
            >
              COUNT: {projects.length}
            </span>
          </div>
        </Reveal>

        <div className="flex flex-col gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-[1200px] px-4 sm:px-10">
        <BlueprintRule />
      </div>

      {/* ─── Expertise ─── */}
      <section id="about" className="mx-auto max-w-[1200px] px-4 sm:px-10 py-24 sm:py-36">
        <Reveal>
          <SectionLabel number="03" label="EXPERTISE" />
          <h2
            className="font-[family-name:var(--font-space-grotesk)] font-bold text-3xl sm:text-5xl tracking-tight max-w-3xl leading-[1.15]"
            style={{ color: C.text }}
          >
            Building at the intersection of{" "}
            <span style={{ color: C.cyan }}>design</span> and intelligence
          </h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-6 mt-16">
          {expertise.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1}>
              <div
                className="relative p-6 sm:p-8 transition-all duration-500"
                style={{
                  background: C.card,
                  border: `1px solid ${C.dim}30`,
                }}
              >
                <CornerMarkers color={`${C.cyan}40`} />
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="font-[family-name:var(--font-space-grotesk)] font-bold text-3xl"
                    style={{ color: C.cyan }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="h-[1px] w-6" style={{ background: `${C.cyan}40` }} />
                </div>
                <h3
                  className="text-sm font-[family-name:var(--font-space-grotesk)] font-semibold tracking-tight mb-3 uppercase"
                  style={{ color: C.text }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-[13px] leading-[1.8] font-light"
                  style={{ color: C.muted }}
                >
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-[1200px] px-4 sm:px-10">
        <BlueprintRule />
      </div>

      {/* ─── Tools ─── */}
      <section className="py-24 sm:py-32 overflow-hidden">
        <Reveal className="mx-auto max-w-[1200px] px-4 sm:px-10 mb-12">
          <SectionLabel number="04" label="TECH STACK" />
          <h2
            className="font-[family-name:var(--font-space-grotesk)] font-bold text-3xl sm:text-5xl tracking-tight"
            style={{ color: C.text }}
          >
            Tools &amp; <span style={{ color: C.cyan }}>Technologies</span>
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
                  className="font-[family-name:var(--font-space-grotesk)] font-semibold text-lg sm:text-xl tracking-wide px-4 sm:px-6"
                  style={{ color: `${C.text}CC` }}
                >
                  {item}
                </span>
                <span className="text-[8px]" style={{ color: C.cyan }}>
                  &#9632;
                </span>
              </span>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-[1200px] px-4 sm:px-10 mt-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-10">
            {tools.map((group, gi) => (
              <Reveal key={group.label} delay={gi * 0.05}>
                <h4
                  className="text-[9px] uppercase tracking-[0.25em] mb-4 font-semibold"
                  style={{ color: C.cyan }}
                >
                  {group.label}
                </h4>
                <div className="flex flex-col gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="text-[12px] cursor-default transition-colors duration-300"
                      style={{ color: C.muted }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = C.cyan)}
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

      <div className="mx-auto max-w-[1200px] px-4 sm:px-10">
        <BlueprintRule />
      </div>

      {/* ─── Footer ─── */}
      <footer className="mx-auto max-w-[1200px] px-4 sm:px-10 py-24 sm:py-36">
        <Reveal>
          <div className="text-center">
            <h2
              className="font-[family-name:var(--font-space-grotesk)] font-bold tracking-tight leading-[1.1]"
              style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)", color: C.text }}
            >
              Let&apos;s build{" "}
              <span style={{ color: C.cyan }}>something.</span>
            </h2>
            <div className="mt-10 flex justify-center">
              <a
                href="https://github.com/1aday"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] tracking-[0.2em] transition-colors duration-300"
                style={{ color: C.muted }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.cyan)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
              >
                &gt; OPEN_GITHUB &#8599;
              </a>
            </div>
          </div>
        </Reveal>

        <div className="mt-16 mb-8 mx-auto max-w-xl">
          <BlueprintRule />
        </div>

        <div className="flex items-center justify-between">
          <span
            className="text-[9px] tracking-[0.2em]"
            style={{ color: `${C.muted}60` }}
          >
            GROX_AI_PRODUCT_STUDIO
          </span>
          <span
            className="text-[9px] tracking-[0.2em]"
            style={{ color: `${C.muted}60` }}
          >
            2024 &mdash; PRESENT
          </span>
        </div>
      </footer>

      <ThemeSwitcher current="/carbon" />
    </main>
  );
}
