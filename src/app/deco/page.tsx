"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { getProjectImage } from "@/lib/theme-images";

/* ─── Color constants ─── */
const C = {
  bg: "#0F4C5C",
  card: "#0D3F4D",
  gold: "#D4A574",
  cream: "#F5F0E8",
  muted: "#A8C4CC",
  rule: "rgba(212,165,116,0.25)",
  dark: "#0A3640",
};

/* ─── Art Deco ornamental divider ─── */
function DecoDivider() {
  return (
    <div className="flex items-center justify-center gap-4 py-4">
      <div
        className="h-[1px] flex-1 max-w-[200px]"
        style={{ background: `linear-gradient(90deg, transparent, ${C.rule})` }}
      />
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="5" y="5" width="10" height="10" transform="rotate(45 10 10)" stroke={C.gold} strokeWidth="1" />
        <rect x="7.5" y="7.5" width="5" height="5" transform="rotate(45 10 10)" fill={C.gold} />
      </svg>
      <div
        className="h-[1px] flex-1 max-w-[200px]"
        style={{ background: `linear-gradient(90deg, ${C.rule}, transparent)` }}
      />
    </div>
  );
}

/* ─── Stepped corner border card ─── */
function SteppedCard({
  children,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`relative ${className}`} style={style}>
      {/* Stepped corners - top-left */}
      <div className="absolute top-0 left-0 pointer-events-none">
        <div className="w-4 h-[1px]" style={{ background: C.gold }} />
        <div className="w-[1px] h-4" style={{ background: C.gold }} />
        <div className="absolute top-[4px] left-[4px] w-2 h-[1px]" style={{ background: `${C.gold}60` }} />
        <div className="absolute top-[4px] left-[4px] w-[1px] h-2" style={{ background: `${C.gold}60` }} />
      </div>
      {/* Stepped corners - top-right */}
      <div className="absolute top-0 right-0 pointer-events-none flex flex-col items-end">
        <div className="w-4 h-[1px]" style={{ background: C.gold }} />
        <div className="absolute right-0 w-[1px] h-4" style={{ background: C.gold }} />
        <div className="absolute top-[4px] right-[4px] w-2 h-[1px]" style={{ background: `${C.gold}60` }} />
        <div className="absolute top-[4px] right-[4px] w-[1px] h-2" style={{ background: `${C.gold}60` }} />
      </div>
      {/* Stepped corners - bottom-left */}
      <div className="absolute bottom-0 left-0 pointer-events-none">
        <div className="absolute bottom-0 w-4 h-[1px]" style={{ background: C.gold }} />
        <div className="absolute bottom-0 w-[1px] h-4" style={{ background: C.gold }} />
        <div className="absolute bottom-[4px] left-[4px] w-2 h-[1px]" style={{ background: `${C.gold}60` }} />
        <div className="absolute bottom-[4px] left-[4px] w-[1px] h-2" style={{ background: `${C.gold}60` }} />
      </div>
      {/* Stepped corners - bottom-right */}
      <div className="absolute bottom-0 right-0 pointer-events-none flex flex-col items-end">
        <div className="absolute bottom-0 w-4 h-[1px]" style={{ background: C.gold }} />
        <div className="absolute bottom-0 right-0 w-[1px] h-4" style={{ background: C.gold }} />
        <div className="absolute bottom-[4px] right-[4px] w-2 h-[1px]" style={{ background: `${C.gold}60` }} />
        <div className="absolute bottom-[4px] right-[4px] w-[1px] h-2" style={{ background: `${C.gold}60` }} />
      </div>
      {children}
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
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Project card with gold shimmer ─── */
function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <SteppedCard className="group p-6 sm:p-8 transition-all duration-500 overflow-hidden">
        {/* Gold shimmer overlay on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, transparent 30%, ${C.gold}08 50%, transparent 70%)`,
          }}
        />

        {/* Background */}
        <div
          className="absolute inset-0 transition-colors duration-500"
          style={{ background: C.card }}
        />

        <div className="relative z-10">
          {/* Project image */}
          <div className="relative overflow-hidden mb-6" style={{ aspectRatio: "16/9" }}>
            <img
              src={getProjectImage("deco", project.image)}
              alt={project.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              style={{ filter: "sepia(0.2) contrast(1.1)" }}
            />
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(180deg, transparent 60%, ${C.dark}CC)` }}
            />
            <div
              className="absolute bottom-4 left-4 font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl italic"
              style={{ color: C.gold }}
            >
              {num}
            </div>
          </div>

          {/* Content */}
          <div className="flex items-center gap-3 mb-3">
            <span
              className="text-[10px] uppercase tracking-[0.2em] font-[family-name:var(--font-josefin)]"
              style={{ color: C.gold }}
            >
              {project.client}
            </span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="3" y="3" width="6" height="6" transform="rotate(45 6 6)" fill={`${C.gold}40`} />
            </svg>
            <span
              className="text-[10px] uppercase tracking-[0.2em] font-[family-name:var(--font-josefin)]"
              style={{ color: C.muted }}
            >
              {project.year}
            </span>
          </div>

          <h3
            className="font-[family-name:var(--font-playfair)] leading-[1.15] tracking-tight whitespace-pre-line mb-4"
            style={{
              fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
              color: C.cream,
            }}
          >
            {project.title}
          </h3>

          <p
            className="font-[family-name:var(--font-josefin)] text-[13px] leading-[1.8] font-light mb-4"
            style={{ color: C.muted }}
          >
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {project.tech.map((t) => (
              <span
                key={t}
                className="text-[9px] uppercase tracking-[0.15em] font-[family-name:var(--font-josefin)] px-3 py-1 border"
                style={{
                  color: C.gold,
                  borderColor: `${C.gold}30`,
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
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-[family-name:var(--font-josefin)] transition-colors duration-500"
            style={{ color: `${C.gold}99` }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.gold)}
            onMouseLeave={(e) => (e.currentTarget.style.color = `${C.gold}99`)}
          >
            View Project
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </a>
        </div>
      </SteppedCard>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   DECO — ART DECO LUXURY
   ═══════════════════════════════════════════ */
export default function DecoPage() {
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
      className="min-h-screen overflow-hidden font-[family-name:var(--font-josefin)]"
      style={{ background: C.bg, color: C.cream }}
    >
      {/* ─── Navigation ─── */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b"
        style={{
          background: `${C.bg}DD`,
          borderColor: `${C.gold}15`,
        }}
      >
        <div className="mx-auto max-w-[1200px] px-4 sm:px-10 py-5 sm:py-6 flex items-center justify-between">
          <span className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl tracking-wider">
            G<span style={{ color: C.gold }}>R</span>OX
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
                className="text-[10px] uppercase tracking-[0.25em] font-[family-name:var(--font-josefin)] transition-colors duration-300"
                style={{ color: `${C.muted}99` }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.gold)}
                onMouseLeave={(e) => (e.currentTarget.style.color = `${C.muted}99`)}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* ─── Hero ─── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Sunburst background pattern */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
          <svg width="900" height="900" viewBox="0 0 900 900" fill="none">
            {Array.from({ length: 24 }).map((_, i) => (
              <line
                key={i}
                x1="450"
                y1="450"
                x2={450 + 450 * Math.cos((i * 15 * Math.PI) / 180)}
                y2={450 + 450 * Math.sin((i * 15 * Math.PI) / 180)}
                stroke={C.gold}
                strokeWidth="1"
              />
            ))}
          </svg>
        </div>

        <div className="relative text-center px-4 pt-24 sm:pt-0">
          {/* Stepped border frame */}
          <SteppedCard className="px-10 sm:px-20 py-16 sm:py-24">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.3 }}
            >
              <DecoDivider />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="flex items-center justify-center gap-3 mt-6 mb-8"
            >
              <span
                className="text-[10px] uppercase tracking-[0.4em] font-[family-name:var(--font-josefin)]"
                style={{ color: C.gold }}
              >
                AI Product Studio
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="font-[family-name:var(--font-playfair)] italic leading-[1.1] tracking-tight"
              style={{ fontSize: "clamp(2.8rem, 7vw, 6.5rem)" }}
            >
              I turn{" "}
              <span style={{ color: C.gold }}>AI models</span>
              <br />
              into <span style={{ color: `${C.muted}` }}>products people use</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="mt-10 text-[14px] leading-[1.9] font-light max-w-xl mx-auto"
              style={{ color: C.muted }}
            >
              End-to-end product ownership — from computer vision and
              multi-model orchestration to pixel-perfect interfaces.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="mt-12 flex justify-center gap-12 sm:gap-16"
            >
              {stats.map((stat, i) => (
                <div key={stat.label}>
                  <div
                    className="font-[family-name:var(--font-playfair)] italic text-4xl sm:text-5xl"
                    style={{ color: C.gold }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-[9px] uppercase tracking-[0.25em] mt-2"
                    style={{ color: C.muted }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 1.8 }}
              className="mt-10"
            >
              <DecoDivider />
            </motion.div>
          </SteppedCard>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-[1px] h-8"
            style={{ background: `linear-gradient(to bottom, ${C.gold}60, transparent)` }}
          />
        </motion.div>
      </section>

      <div className="mx-auto max-w-[1200px] px-4 sm:px-10">
        <DecoDivider />
      </div>

      {/* ─── Selected Work ─── */}
      <section id="work" className="mx-auto max-w-[1200px] px-4 sm:px-10 py-20 sm:py-28">
        <Reveal>
          <div className="text-center mb-16">
            <span
              className="text-[10px] uppercase tracking-[0.4em] block mb-4"
              style={{ color: C.gold }}
            >
              Portfolio
            </span>
            <h2
              className="font-[family-name:var(--font-playfair)] italic text-4xl sm:text-6xl tracking-tight"
              style={{ color: C.cream }}
            >
              Selected Work
            </h2>
          </div>
        </Reveal>

        {/* 2-column masonry-like grid */}
        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-[1200px] px-4 sm:px-10">
        <DecoDivider />
      </div>

      {/* ─── Expertise ─── */}
      <section id="about" className="mx-auto max-w-[1200px] px-4 sm:px-10 py-24 sm:py-36">
        <Reveal>
          <div className="text-center mb-20">
            <span
              className="text-[10px] uppercase tracking-[0.4em] block mb-4"
              style={{ color: C.gold }}
            >
              Expertise
            </span>
            <h2
              className="font-[family-name:var(--font-playfair)] italic text-4xl sm:text-6xl tracking-tight max-w-3xl mx-auto leading-[1.1]"
              style={{ color: C.cream }}
            >
              Building at the intersection of{" "}
              <span style={{ color: C.gold }}>design</span> and intelligence
            </h2>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-8">
          {expertise.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1}>
              <SteppedCard className="p-8 transition-all duration-500" style={{ background: `${C.card}80` }}>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-5">
                    <span
                      className="font-[family-name:var(--font-playfair)] italic text-4xl leading-none"
                      style={{ color: C.gold }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex items-center gap-1">
                      <div className="h-[1px] w-3" style={{ background: C.gold }} />
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <rect x="2" y="2" width="4" height="4" transform="rotate(45 4 4)" fill={C.gold} />
                      </svg>
                      <div className="h-[1px] w-3" style={{ background: C.gold }} />
                    </div>
                  </div>
                  <h3
                    className="text-lg font-[family-name:var(--font-playfair)] tracking-tight mb-3"
                    style={{ color: C.cream }}
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
              </SteppedCard>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-[1200px] px-4 sm:px-10">
        <DecoDivider />
      </div>

      {/* ─── Tools ─── */}
      <section className="py-24 sm:py-32 overflow-hidden">
        <Reveal className="mx-auto max-w-[1200px] px-4 sm:px-10 mb-12">
          <div className="text-center">
            <span
              className="text-[10px] uppercase tracking-[0.4em] block mb-4"
              style={{ color: C.gold }}
            >
              Stack
            </span>
            <h2
              className="font-[family-name:var(--font-playfair)] italic text-4xl sm:text-6xl tracking-tight"
              style={{ color: C.cream }}
            >
              Tools &amp; Technologies
            </h2>
          </div>
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
                  className="font-[family-name:var(--font-playfair)] italic text-xl sm:text-2xl tracking-wide px-4 sm:px-6"
                  style={{ color: `${C.cream}CC` }}
                >
                  {item}
                </span>
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <rect x="2" y="2" width="4" height="4" transform="rotate(45 4 4)" fill={C.gold} />
                </svg>
              </span>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-[1200px] px-4 sm:px-10 mt-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-10">
            {tools.map((group, gi) => (
              <Reveal key={group.label} delay={gi * 0.05}>
                <h4
                  className="text-[10px] uppercase tracking-[0.25em] mb-4 font-medium"
                  style={{ color: C.gold }}
                >
                  {group.label}
                </h4>
                <div className="flex flex-col gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="text-[13px] font-light cursor-default transition-colors duration-300"
                      style={{ color: `${C.muted}99` }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = C.cream)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = `${C.muted}99`)}
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
        <DecoDivider />
      </div>

      {/* ─── Footer ─── */}
      <footer className="mx-auto max-w-[1200px] px-4 sm:px-10 py-24 sm:py-36">
        <Reveal>
          <div className="text-center">
            <DecoDivider />
            <h2
              className="font-[family-name:var(--font-playfair)] italic tracking-tight leading-[1.1] mt-10"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", color: C.cream }}
            >
              Let&apos;s build{" "}
              <span style={{ color: C.gold }}>something.</span>
            </h2>

            <div className="mt-10 flex justify-center gap-8">
              <a
                href="https://github.com/1aday"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] uppercase tracking-[0.25em] transition-colors duration-300"
                style={{ color: `${C.muted}99` }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.gold)}
                onMouseLeave={(e) => (e.currentTarget.style.color = `${C.muted}99`)}
              >
                GitHub &#8599;
              </a>
            </div>
            <div className="mt-10">
              <DecoDivider />
            </div>
          </div>
        </Reveal>

        <div className="flex items-center justify-between mt-12">
          <span
            className="text-[9px] uppercase tracking-[0.25em]"
            style={{ color: `${C.muted}60` }}
          >
            Grox AI Product Studio
          </span>
          <span
            className="text-[9px] uppercase tracking-[0.25em]"
            style={{ color: `${C.muted}60` }}
          >
            2024 &mdash; Present
          </span>
        </div>
      </footer>

      <ThemeSwitcher current="/deco" />
    </main>
  );
}
