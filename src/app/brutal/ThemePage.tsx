"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { getProjectImage } from "@/lib/theme-images";

/* ─── Color constants ─── */
const C = {
  bg: "#FFFFFF",
  text: "#000000",
  accent: "#FFD600",
  border: "#000000",
  hoverBg: "rgba(255, 214, 0, 0.10)",
};

/* ─── Scroll-reveal wrapper ─── */
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
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Project card ─── */
function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.a
      ref={ref}
      href={project.github}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{
        duration: 0.5,
        delay: 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group block cursor-pointer"
      style={{
        border: `3px solid ${C.border}`,
        padding: 0,
        background: C.bg,
        transition: "background 0s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = C.accent;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = C.bg;
      }}
    >
      <div className="p-6 sm:p-8 md:p-10">
        {/* Project image */}
        <div style={{ margin: "-24px -24px 16px -24px", overflow: "hidden", position: "relative" }}>
          <img
            src={getProjectImage("brutal", project.image)}
            alt={project.title.replace(/\n/g, " ")}
            loading="lazy"
            style={{
              display: "block", width: "100%", aspectRatio: "16/9", objectFit: "cover",
              filter: "grayscale(1) contrast(1.5) brightness(0.9)",
            }}
          />
        </div>

        {/* Top row: number + meta */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8">
          {/* Massive number */}
          <span
            className="font-[family-name:var(--font-space-grotesk)] font-bold leading-none select-none shrink-0"
            style={{
              fontSize: "clamp(5rem, 8vw, 8rem)",
              color: C.text,
              transition: "text-shadow 0s",
            }}
          >
            <span className="group-hover:[text-shadow:4px_4px_0_#FFD600]">
              {num}
            </span>
          </span>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h3
              className="font-[family-name:var(--font-space-grotesk)] font-bold uppercase leading-[1.1] tracking-[0.04em]"
              style={{
                fontSize: "clamp(1.25rem, 3vw, 2rem)",
                color: C.text,
              }}
            >
              {project.title.replace(/\n/g, " ")}
            </h3>

            {/* Client + Year */}
            <div
              className="flex items-center gap-3 mt-2 font-[family-name:var(--font-jetbrains)] text-[11px] uppercase tracking-[0.15em]"
              style={{ color: C.text }}
            >
              <span>{project.client}</span>
              <span style={{ opacity: 0.4 }}>/</span>
              <span>{project.year}</span>
            </div>

            {/* Description */}
            <p
              className="font-[family-name:var(--font-jetbrains)] text-[13px] sm:text-[14px] leading-[1.7] mt-4 uppercase tracking-[0.02em]"
              style={{ color: C.text, opacity: 0.7 }}
            >
              {project.description}
            </p>

            {/* Technical */}
            <p
              className="font-[family-name:var(--font-jetbrains)] text-[12px] sm:text-[13px] leading-[1.7] mt-3 uppercase tracking-[0.02em]"
              style={{ color: C.text, opacity: 0.5 }}
            >
              {project.technical}
            </p>

            {/* Tech tags */}
            <div className="flex flex-wrap gap-2 mt-5">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="font-[family-name:var(--font-jetbrains)] text-[10px] sm:text-[11px] uppercase tracking-[0.1em] px-3 py-1.5 font-bold"
                  style={{
                    background: C.text,
                    color: C.bg,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>

            {/* View link */}
            <div
              className="mt-5 font-[family-name:var(--font-jetbrains)] text-[11px] uppercase tracking-[0.15em] font-bold flex items-center gap-2"
              style={{ color: C.text }}
            >
              VIEW PROJECT
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </motion.a>
  );
}

/* ═══════════════════════════════════════════
   BRUTAL PAGE
   ═══════════════════════════════════════════ */
export default function BrutalPage() {
  return (
    <main
      className="min-h-screen overflow-x-hidden font-[family-name:var(--font-jetbrains)]"
      style={{
        background: C.bg,
        color: C.text,
        colorScheme: "light",
      }}
    >
      {/* ─── Navigation ─── */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: C.bg,
          borderTop: `4px solid ${C.border}`,
          borderBottom: `3px solid ${C.border}`,
        }}
      >
        <div className="mx-auto max-w-[1400px] px-4 sm:px-10 py-4 flex items-center justify-between">
          <span
            className="font-[family-name:var(--font-space-grotesk)] font-bold uppercase tracking-[0.1em]"
            style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: C.text }}
          >
            GROX
          </span>
          <div className="flex items-center gap-4 sm:gap-8">
            {[
              { label: "WORK", href: "#work" },
              { label: "ABOUT", href: "#about" },
              {
                label: "GITHUB",
                href: "https://github.com/1aday",
                external: true,
              },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="font-[family-name:var(--font-jetbrains)] text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold px-2 py-1"
                style={{
                  color: C.text,
                  transition: "background 0s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = C.accent;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* ─── Hero ─── */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-24 sm:pt-0">
        {/* Rotated yellow accent bar */}
        <div
          className="absolute top-[38%] left-[-5%] w-[110%] pointer-events-none"
          style={{
            height: "clamp(60px, 10vw, 120px)",
            background: C.accent,
            transform: "rotate(-2deg)",
            zIndex: 0,
          }}
        />

        <div className="relative mx-auto max-w-[1400px] px-4 sm:px-10 w-full z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Subtitle */}
            <div
              className="font-[family-name:var(--font-jetbrains)] text-[11px] sm:text-[12px] uppercase tracking-[0.3em] font-bold mb-6"
              style={{ color: C.text }}
            >
              AI PRODUCT STUDIO
            </div>

            {/* Hero headline */}
            <h1
              className="font-[family-name:var(--font-space-grotesk)] font-bold uppercase leading-[0.95] tracking-[-0.02em]"
              style={{
                fontSize: "clamp(3rem, 10vw, 9rem)",
                color: C.text,
              }}
            >
              I TURN{" "}
              <span className="relative inline-block">
                <span
                  className="absolute inset-0 -skew-x-2"
                  style={{
                    background: C.accent,
                    zIndex: -1,
                    top: "10%",
                    bottom: "5%",
                    left: "-4px",
                    right: "-4px",
                  }}
                />
                AI MODELS
              </span>
              <br />
              INTO PRODUCTS
            </h1>

            {/* Subtext */}
            <p
              className="font-[family-name:var(--font-jetbrains)] text-[13px] sm:text-[15px] uppercase tracking-[0.05em] leading-[1.7] mt-8 max-w-2xl"
              style={{ color: C.text, opacity: 0.6 }}
            >
              END-TO-END PRODUCT OWNERSHIP — FROM COMPUTER VISION AND
              MULTI-MODEL ORCHESTRATION TO PIXEL-PERFECT INTERFACES.
            </p>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 flex flex-wrap gap-0"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex-1 min-w-[120px]"
                style={{
                  border: `3px solid ${C.border}`,
                  marginRight: "-3px",
                  padding: "20px 24px",
                }}
              >
                <div
                  className="font-[family-name:var(--font-space-grotesk)] font-bold uppercase"
                  style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", color: C.text }}
                >
                  {stat.value}
                </div>
                <div
                  className="font-[family-name:var(--font-jetbrains)] text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold mt-1"
                  style={{ color: C.text, opacity: 0.5 }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Thick divider ─── */}
      <div
        className="w-full"
        style={{ height: 4, background: C.border }}
      />

      {/* ─── Projects ─── */}
      <section
        id="work"
        className="mx-auto max-w-[1400px] px-4 sm:px-10 py-20 sm:py-28"
      >
        <Reveal>
          <div className="flex items-end justify-between mb-12">
            <div>
              <span
                className="font-[family-name:var(--font-jetbrains)] text-[11px] uppercase tracking-[0.3em] font-bold block mb-3"
                style={{ color: C.text, opacity: 0.5 }}
              >
                PORTFOLIO
              </span>
              <h2
                className="font-[family-name:var(--font-space-grotesk)] font-bold uppercase tracking-[0.04em]"
                style={{
                  fontSize: "clamp(2rem, 5vw, 4rem)",
                  color: C.text,
                }}
              >
                SELECTED WORK
              </h2>
            </div>
            <span
              className="font-[family-name:var(--font-jetbrains)] text-[11px] uppercase tracking-[0.15em] font-bold hidden sm:block"
              style={{ color: C.text, opacity: 0.4 }}
            >
              {projects.length} PROJECTS
            </span>
          </div>
        </Reveal>

        <div className="flex flex-col gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </section>

      {/* ─── Thick divider ─── */}
      <div
        className="w-full"
        style={{ height: 4, background: C.border }}
      />

      {/* ─── Expertise ─── */}
      <section
        id="about"
        className="mx-auto max-w-[1400px] px-4 sm:px-10 py-20 sm:py-28"
      >
        <Reveal>
          <span
            className="font-[family-name:var(--font-jetbrains)] text-[11px] uppercase tracking-[0.3em] font-bold block mb-3"
            style={{ color: C.text, opacity: 0.5 }}
          >
            EXPERTISE
          </span>
          <h2
            className="font-[family-name:var(--font-space-grotesk)] font-bold uppercase tracking-[0.04em]"
            style={{
              fontSize: "clamp(2rem, 5vw, 4rem)",
              color: C.text,
            }}
          >
            WHAT I DO
          </h2>
        </Reveal>

        <div className="flex flex-col gap-0 mt-16">
          {expertise.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08}>
              <div
                className="py-8 sm:py-10"
                style={{
                  borderLeft: `4px solid ${C.accent}`,
                  paddingLeft: "24px",
                  borderBottom: i < expertise.length - 1 ? `1px solid ${C.border}20` : "none",
                }}
              >
                {/* Number */}
                <span
                  className="font-[family-name:var(--font-space-grotesk)] font-bold uppercase tracking-[0.1em] block mb-3"
                  style={{
                    fontSize: "clamp(2.5rem, 4vw, 4rem)",
                    color: C.text,
                    opacity: 0.15,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Title */}
                <h3
                  className="font-[family-name:var(--font-space-grotesk)] font-bold uppercase tracking-[0.06em] mb-3"
                  style={{
                    fontSize: "clamp(1.1rem, 2vw, 1.5rem)",
                    color: C.text,
                  }}
                >
                  {item.title}
                </h3>

                {/* Body */}
                <p
                  className="font-[family-name:var(--font-jetbrains)] text-[13px] sm:text-[14px] leading-[1.8] uppercase tracking-[0.02em] max-w-3xl"
                  style={{ color: C.text, opacity: 0.6 }}
                >
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─── Thick divider ─── */}
      <div
        className="w-full"
        style={{ height: 4, background: C.border }}
      />

      {/* ─── Tools ─── */}
      <section className="mx-auto max-w-[1400px] px-4 sm:px-10 py-20 sm:py-28">
        <Reveal>
          <span
            className="font-[family-name:var(--font-jetbrains)] text-[11px] uppercase tracking-[0.3em] font-bold block mb-3"
            style={{ color: C.text, opacity: 0.5 }}
          >
            STACK
          </span>
          <h2
            className="font-[family-name:var(--font-space-grotesk)] font-bold uppercase tracking-[0.04em]"
            style={{
              fontSize: "clamp(2rem, 5vw, 4rem)",
              color: C.text,
            }}
          >
            TOOLS & TECHNOLOGIES
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-12 mt-16">
          {tools.map((group, gi) => (
            <Reveal key={group.label} delay={gi * 0.05}>
              <h4
                className="font-[family-name:var(--font-space-grotesk)] font-bold text-[11px] uppercase tracking-[0.2em] mb-5"
                style={{ color: C.text }}
              >
                {group.label}
              </h4>
              <div className="flex flex-col gap-3">
                {group.items.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    {/* Yellow square bullet */}
                    <span
                      className="shrink-0"
                      style={{
                        width: 8,
                        height: 8,
                        background: C.accent,
                      }}
                    />
                    <span
                      className="font-[family-name:var(--font-jetbrains)] text-[13px] uppercase tracking-[0.05em]"
                      style={{ color: C.text, opacity: 0.7 }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─── Thick divider ─── */}
      <div
        className="w-full"
        style={{ height: 4, background: C.border }}
      />

      {/* ─── Footer ─── */}
      <footer className="mx-auto max-w-[1400px] px-4 sm:px-10 py-24 sm:py-36">
        <Reveal>
          <div className="text-center">
            <h2
              className="font-[family-name:var(--font-space-grotesk)] font-bold uppercase tracking-[0.02em] leading-[1]"
              style={{
                fontSize: "clamp(3rem, 8vw, 8rem)",
                color: C.text,
              }}
            >
              LET&apos;S BUILD
              <span style={{ color: C.accent }}>.</span>
            </h2>

            <div className="mt-10 flex justify-center gap-8">
              <a
                href="https://github.com/1aday"
                target="_blank"
                rel="noopener noreferrer"
                className="font-[family-name:var(--font-jetbrains)] text-[11px] uppercase tracking-[0.2em] font-bold px-4 py-2"
                style={{
                  color: C.text,
                  border: `3px solid ${C.border}`,
                  transition: "background 0s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = C.accent;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                GITHUB &#8599;
              </a>
            </div>
          </div>
        </Reveal>

        <div className="mt-20 flex items-center justify-between">
          <span
            className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-[0.15em] font-bold"
            style={{ color: C.text, opacity: 0.4 }}
          >
            GROX AI PRODUCT STUDIO
          </span>
          <span
            className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-[0.15em] font-bold"
            style={{ color: C.text, opacity: 0.4 }}
          >
            2024 &mdash; PRESENT
          </span>
        </div>
      </footer>

      {/* Theme Switcher */}
      <ThemeSwitcher current="/brutal" variant="light" />
    </main>
  );
}
