"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { getProjectImage } from "@/lib/theme-images";

/* ─── Color constants ─── */
const C = {
  bg: "#FAFAF8",
  ink: "#1A1A1A",
  red: "#C41E3A",
  muted: "#8A8A8A",
  rule: "rgba(26,26,26,0.08)",
};

/* ─── Zen reveal — opacity only, no translate ─── */
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
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 2, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Hover-to-reveal project row ─── */
function ProjectRow({
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
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 1.5, delay: index * 0.08 }}
      className="relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main row */}
      <div className="py-10 sm:py-14" style={{ borderBottom: `1px solid ${C.rule}` }}>
        <div className="flex items-baseline gap-6 sm:gap-10">
          <span
            className="font-[family-name:var(--font-instrument)] italic text-5xl sm:text-7xl leading-none select-none transition-colors duration-700"
            style={{ color: isHovered ? C.red : `${C.ink}15` }}
          >
            {num}
          </span>
          <div className="flex-1">
            <h3
              className="font-[family-name:var(--font-instrument)] italic leading-[1.15] tracking-tight whitespace-pre-line transition-colors duration-700"
              style={{
                fontSize: "clamp(1.5rem, 3.5vw, 2.75rem)",
                color: isHovered ? C.ink : `${C.ink}CC`,
              }}
            >
              {project.title}
            </h3>
            <p
              className="font-[family-name:var(--font-manrope)] text-[13px] mt-3 transition-colors duration-700"
              style={{ color: C.muted }}
            >
              {project.client} — {project.year}
            </p>
          </div>
          {/* Arrow */}
          <motion.div
            animate={{ x: isHovered ? 4 : 0, opacity: isHovered ? 1 : 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke={isHovered ? C.red : C.ink}
              strokeWidth="1"
              className="transition-colors duration-700"
            >
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Expanding detail panel */}
      <motion.div
        initial={false}
        animate={{
          height: isHovered ? "auto" : 0,
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
        style={{ borderBottom: isHovered ? `1px solid ${C.red}20` : "none" }}
      >
        <div className="pb-10 pt-2 grid sm:grid-cols-[1fr,1.5fr] gap-8 sm:gap-16 pl-0 sm:pl-[calc(4rem+2.5rem)]">
          {/* Image */}
          <div className="relative overflow-hidden rounded-sm" style={{ aspectRatio: "4/3" }}>
            <img
              src={getProjectImage("studio", project.image)}
              alt={project.title}
              loading="lazy"
              className="w-full h-full object-cover"
              style={{ filter: "grayscale(0.3) contrast(1.05)" }}
            />
          </div>
          {/* Details */}
          <div className="flex flex-col justify-center gap-4">
            <p
              className="font-[family-name:var(--font-manrope)] text-[14px] leading-[1.9] font-light"
              style={{ color: `${C.ink}CC` }}
            >
              {project.description}
            </p>
            <p
              className="font-[family-name:var(--font-manrope)] text-[13px] leading-[1.8] font-light"
              style={{ color: C.muted }}
            >
              {project.technical}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="text-[10px] uppercase tracking-[0.15em] font-[family-name:var(--font-manrope)] px-3 py-1 border"
                  style={{
                    color: C.ink,
                    borderColor: C.rule,
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
              className="inline-flex items-center gap-2 mt-2 text-[11px] uppercase tracking-[0.2em] font-[family-name:var(--font-manrope)] transition-colors duration-500"
              style={{ color: C.red }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.ink)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.red)}
            >
              View Project
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   STUDIO — JAPANESE ZEN MINIMALISM
   ═══════════════════════════════════════════ */
export default function StudioPage() {
  const { scrollYProgress } = useScroll();
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    document.documentElement.style.setProperty("--scroll", "0");
    const handleScroll = () => {
      const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      document.documentElement.style.setProperty("--scroll", String(scrolled));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main
      className="min-h-screen overflow-hidden font-[family-name:var(--font-manrope)]"
      style={{ background: C.bg, color: C.ink }}
    >
      {/* ─── Vertical red line (left margin) ─── */}
      <div className="fixed left-6 sm:left-10 top-0 bottom-0 z-40 w-[1px] pointer-events-none">
        <motion.div
          className="w-full origin-top"
          style={{
            height: lineHeight,
            background: C.red,
          }}
        />
      </div>

      {/* ─── Navigation ─── */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{ background: `${C.bg}F0` }}
      >
        <div className="mx-auto max-w-[1100px] px-12 sm:px-20 py-8 flex items-center justify-between">
          <span className="flex items-center gap-3">
            <span className="font-[family-name:var(--font-instrument)] italic text-2xl tracking-wide">
              Grox
            </span>
            {/* Hanko seal */}
            <span
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ background: C.red }}
            />
          </span>
          <div className="flex items-center gap-8">
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
                className="text-[10px] uppercase tracking-[0.25em] font-[family-name:var(--font-manrope)] transition-colors duration-500"
                style={{ color: C.muted }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.red)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* ─── Hero ─── */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3, delay: 0.5 }}
            className="flex flex-col items-center gap-2"
          >
            <span
              className="text-[10px] uppercase tracking-[0.5em] font-[family-name:var(--font-manrope)]"
              style={{ color: C.muted }}
            >
              AI Product Studio
            </span>
            <div
              className="w-8 h-[1px] my-6"
              style={{ background: C.red }}
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.5, delay: 1 }}
            className="font-[family-name:var(--font-instrument)] italic leading-[1.4] tracking-tight"
            style={{
              fontSize: "clamp(2.5rem, 7vw, 6.5rem)",
              lineHeight: 1.3,
            }}
          >
            <span style={{ color: C.ink }}>I turn</span>
            <br />
            <span style={{ color: C.red }}>AI models</span>
            <br />
            <span style={{ color: `${C.ink}60` }}>into products</span>
            <br />
            <span style={{ color: `${C.ink}35` }}>people use</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 2 }}
            className="mt-16 flex justify-center gap-16"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div
                  className="font-[family-name:var(--font-instrument)] italic text-3xl sm:text-4xl"
                  style={{ color: C.ink }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-[9px] uppercase tracking-[0.3em] mt-2 font-[family-name:var(--font-manrope)]"
                  style={{ color: C.muted }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 3, duration: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-[1px] h-10"
            style={{ background: `linear-gradient(to bottom, ${C.ink}40, transparent)` }}
          />
        </motion.div>
      </section>

      {/* ─── Selected Work ─── */}
      <section
        id="work"
        className="mx-auto max-w-[1100px] px-12 sm:px-20 py-32 sm:py-48"
      >
        <Reveal>
          <div className="mb-24">
            <span
              className="text-[10px] uppercase tracking-[0.4em] block mb-6 font-[family-name:var(--font-manrope)]"
              style={{ color: C.muted }}
            >
              Selected Work
            </span>
            <div className="w-6 h-[1px]" style={{ background: C.red }} />
          </div>
        </Reveal>

        <div>
          {projects.map((project, i) => (
            <ProjectRow key={project.title} project={project} index={i} />
          ))}
        </div>
      </section>

      {/* ─── Expertise ─── */}
      <section
        id="about"
        className="mx-auto max-w-[1100px] px-12 sm:px-20 py-32 sm:py-48"
      >
        <Reveal>
          <span
            className="text-[10px] uppercase tracking-[0.4em] block mb-6 font-[family-name:var(--font-manrope)]"
            style={{ color: C.muted }}
          >
            Expertise
          </span>
          <div className="w-6 h-[1px] mb-20" style={{ background: C.red }} />
        </Reveal>

        <Reveal delay={0.3}>
          <h2
            className="font-[family-name:var(--font-instrument)] italic text-4xl sm:text-5xl tracking-tight max-w-2xl leading-[1.2]"
            style={{ color: C.ink }}
          >
            Building at the intersection of{" "}
            <span style={{ color: C.red }}>design</span> and intelligence
          </h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-x-20 gap-y-20 mt-24">
          {expertise.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.15}>
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <span
                    className="font-[family-name:var(--font-instrument)] italic text-4xl leading-none"
                    style={{ color: `${C.ink}15` }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3
                  className="text-base font-[family-name:var(--font-manrope)] font-medium tracking-tight mb-4"
                  style={{ color: C.ink }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-[14px] leading-[2] font-light font-[family-name:var(--font-manrope)]"
                  style={{ color: C.muted }}
                >
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─── Tools ─── */}
      <section className="mx-auto max-w-[1100px] px-12 sm:px-20 py-32 sm:py-48">
        <Reveal>
          <span
            className="text-[10px] uppercase tracking-[0.4em] block mb-6 font-[family-name:var(--font-manrope)]"
            style={{ color: C.muted }}
          >
            Stack
          </span>
          <div className="w-6 h-[1px] mb-20" style={{ background: C.red }} />
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-16">
          {tools.map((group, gi) => (
            <Reveal key={group.label} delay={gi * 0.1}>
              <h4
                className="text-[10px] uppercase tracking-[0.25em] mb-5 font-[family-name:var(--font-manrope)] font-medium"
                style={{ color: C.ink }}
              >
                {group.label}
              </h4>
              <div className="flex flex-col gap-3">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="text-[13px] font-light cursor-default transition-colors duration-700 font-[family-name:var(--font-manrope)]"
                    style={{ color: C.muted }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = C.red)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="mx-auto max-w-[1100px] px-12 sm:px-20 py-32 sm:py-48">
        <Reveal>
          <div className="text-center">
            <div className="w-6 h-[1px] mx-auto mb-16" style={{ background: C.red }} />
            <h2
              className="font-[family-name:var(--font-instrument)] italic tracking-tight leading-[1.2]"
              style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)", color: C.ink }}
            >
              Let&apos;s build{" "}
              <span style={{ color: C.red }}>something.</span>
            </h2>

            <div className="mt-12 flex justify-center">
              <a
                href="https://github.com/1aday"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] uppercase tracking-[0.3em] transition-colors duration-700 font-[family-name:var(--font-manrope)]"
                style={{ color: C.muted }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.red)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
              >
                GitHub &#8599;
              </a>
            </div>
          </div>
        </Reveal>

        <div
          className="mt-20 mb-10 mx-auto max-w-[200px] h-[1px]"
          style={{ background: C.rule }}
        />

        <div className="flex items-center justify-between">
          <span
            className="text-[9px] uppercase tracking-[0.3em] font-[family-name:var(--font-manrope)]"
            style={{ color: `${C.muted}80` }}
          >
            Grox AI Product Studio
          </span>
          <span
            className="text-[9px] uppercase tracking-[0.3em] font-[family-name:var(--font-manrope)]"
            style={{ color: `${C.muted}80` }}
          >
            2024 &mdash; Present
          </span>
        </div>
      </footer>

      <ThemeSwitcher current="/studio" variant="light" />
    </main>
  );
}
