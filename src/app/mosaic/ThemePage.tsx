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
  blue: "#2563EB",
  red: "#DC2626",
  yellow: "#EAB308",
  gray: "#F5F5F5",
};

/* Color cycling helper */
const accentAt = (i: number) => [C.blue, C.red, C.yellow][i % 3];

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

/* ─── Mondrian Project Card ─── */
function ProjectCard({
  project,
  index,
  size,
}: {
  project: (typeof projects)[0];
  index: number;
  size: "large" | "wide" | "compact";
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const borderColor = accentAt(index);
  const num = String(index + 1).padStart(2, "0");

  /* Grid placement */
  const gridStyles: React.CSSProperties =
    size === "large"
      ? { gridColumn: "span 2", gridRow: "span 2" }
      : size === "wide"
        ? { gridColumn: "span 2", gridRow: "span 1" }
        : {};

  return (
    <motion.a
      ref={ref}
      href={project.github}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration: 0.5,
        delay: 0.04,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="block cursor-pointer"
      style={{
        ...gridStyles,
        background: C.bg,
        borderLeft: `4px solid ${borderColor}`,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
        padding: size === "large" ? "32px" : "24px",
        transition: "transform 0.25s cubic-bezier(0.22,1,0.36,1), box-shadow 0.25s ease",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: size === "compact" ? "auto" : undefined,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow =
          "0 4px 12px rgba(0,0,0,0.1), 0 12px 32px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow =
          "0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)";
      }}
    >
      <div>
        {/* Project image */}
        <div style={{ margin: size === "large" ? "-32px -32px 16px -32px" : "-24px -24px 12px -24px", overflow: "hidden", position: "relative" }}>
          <img
            src={getProjectImage("mosaic", project.image)}
            alt={project.title.replace(/\n/g, " ")}
            loading="lazy"
            style={{
              display: "block", width: "100%", aspectRatio: "16/9", objectFit: "cover",
              filter: "grayscale(0.5) contrast(1.1)",
            }}
          />
          <div style={{ position: "absolute", inset: 0, background: `${borderColor}4D` }} />
        </div>
        {/* Number */}
        <span
          className="font-[family-name:var(--font-space-grotesk)] font-bold block mb-3"
          style={{
            fontSize: size === "large" ? "48px" : "32px",
            color: C.text,
            opacity: 0.08,
            lineHeight: 1,
          }}
        >
          {num}
        </span>

        {/* Title */}
        <h3
          className="font-[family-name:var(--font-space-grotesk)] font-bold uppercase leading-[1.15] tracking-[0.02em]"
          style={{
            fontSize:
              size === "large"
                ? "clamp(1.25rem, 2.2vw, 1.75rem)"
                : size === "wide"
                  ? "clamp(1.1rem, 1.8vw, 1.4rem)"
                  : "clamp(0.95rem, 1.4vw, 1.15rem)",
            color: C.text,
          }}
        >
          {project.title.replace(/\n/g, " ")}
        </h3>

        {/* Client + Year */}
        <div
          className="flex items-center gap-2 mt-2 font-[family-name:var(--font-inter)] text-[11px] uppercase tracking-[0.12em]"
          style={{ color: C.text, opacity: 0.45 }}
        >
          <span>{project.client}</span>
          <span style={{ opacity: 0.4 }}>/</span>
          <span>{project.year}</span>
        </div>

        {/* Description — only large & wide */}
        {size !== "compact" && (
          <p
            className="font-[family-name:var(--font-inter)] text-[13px] sm:text-[14px] leading-[1.7] mt-4"
            style={{ color: C.text, opacity: 0.6 }}
          >
            {project.description}
          </p>
        )}

        {/* Technical — large cards only */}
        {size === "large" && (
          <p
            className="font-[family-name:var(--font-inter)] text-[12px] leading-[1.7] mt-3"
            style={{ color: C.text, opacity: 0.4 }}
          >
            {project.technical}
          </p>
        )}
      </div>

      {/* Bottom section */}
      <div className="mt-4">
        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <span
              key={t}
              className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.08em] px-2 py-1 font-medium"
              style={{
                background: C.gray,
                color: C.text,
                opacity: 0.8,
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* View link */}
        <div
          className="mt-4 font-[family-name:var(--font-inter)] text-[11px] uppercase tracking-[0.12em] font-semibold flex items-center gap-2"
          style={{ color: borderColor }}
        >
          VIEW PROJECT
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </div>
      </div>
    </motion.a>
  );
}

/* ═══════════════════════════════════════════
   MOSAIC PAGE
   ═══════════════════════════════════════════ */
export default function MosaicPage() {
  /* Determine card sizing for Mondrian grid */
  const cardSize = (i: number): "large" | "wide" | "compact" => {
    if (i === 0 || i === 4 || i === 8) return "large";
    if (i === 1 || i === 5 || i === 9) return "wide";
    return "compact";
  };

  return (
    <main
      className="min-h-screen overflow-x-hidden"
      style={{ background: C.bg, color: C.text, colorScheme: "light" }}
    >
      {/* ─── Navigation ─── */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: C.bg,
          borderBottom: `1px solid ${C.text}15`,
        }}
      >
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 py-4 flex items-center justify-between">
          {/* Logo + decorative red square */}
          <div className="flex items-center gap-3">
            <span
              style={{
                width: 10,
                height: 10,
                background: C.red,
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            <span
              className="font-[family-name:var(--font-space-grotesk)] font-bold uppercase tracking-[0.12em]"
              style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)", color: C.text }}
            >
              GROX
            </span>
          </div>

          {/* Nav links */}
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
                className="font-[family-name:var(--font-space-grotesk)] text-[11px] uppercase tracking-[0.16em] font-semibold"
                style={{
                  color: C.text,
                  opacity: 0.6,
                  transition: "opacity 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "0.6";
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* ─── Hero Section — White BG ─── */}
      <section
        className="relative overflow-hidden"
        style={{ background: C.bg, minHeight: "100vh" }}
      >
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 pt-32 sm:pt-40 pb-20 sm:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Subtitle */}
              <div className="flex items-center gap-3 mb-6">
                <span
                  style={{
                    width: 24,
                    height: 24,
                    background: C.red,
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                <span
                  className="font-[family-name:var(--font-space-grotesk)] text-[11px] sm:text-[12px] uppercase tracking-[0.25em] font-semibold"
                  style={{ color: C.text, opacity: 0.5 }}
                >
                  AI PRODUCT STUDIO
                </span>
              </div>

              {/* Headline */}
              <h1
                className="font-[family-name:var(--font-space-grotesk)] font-bold uppercase leading-[0.95] tracking-[-0.02em]"
                style={{
                  fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
                  color: C.text,
                }}
              >
                WE BUILD{" "}
                <span
                  className="relative inline-block px-3"
                  style={{ background: C.yellow, color: C.text }}
                >
                  AI
                </span>{" "}
                MODELS
              </h1>

              {/* Thin structural line */}
              <div
                className="mt-8 mb-6"
                style={{ width: 80, height: 2, background: C.text }}
              />

              {/* Subtext */}
              <p
                className="font-[family-name:var(--font-inter)] text-[14px] sm:text-[16px] leading-[1.7] max-w-lg"
                style={{ color: C.text, opacity: 0.6 }}
              >
                End-to-end product ownership — from computer vision and
                multi-model orchestration to pixel-perfect interfaces.
              </p>
            </motion.div>

            {/* Right — Geometric Composition */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex justify-center lg:justify-end"
            >
              {/* Large yellow circle — decorative, partially cropped */}
              <div
                className="absolute pointer-events-none"
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: "50%",
                  background: C.yellow,
                  top: -40,
                  right: -30,
                  opacity: 0.9,
                  zIndex: 0,
                }}
              />

              {/* Image */}
              <div
                className="relative z-10 overflow-hidden"
                style={{
                  borderRadius: 12,
                  maxWidth: 460,
                  width: "100%",
                  aspectRatio: "4 / 3",
                  background: C.gray,
                }}
              >
                <img
                  src="/themes/mosaic/geometric-comp.webp"
                  alt="AI geometric composition"
                  className="w-full h-full object-cover"
                  style={{ display: "block" }}
                />
              </div>

              {/* Small decorative blue square */}
              <div
                className="absolute pointer-events-none"
                style={{
                  width: 40,
                  height: 40,
                  background: C.blue,
                  bottom: -16,
                  left: 20,
                  zIndex: 20,
                }}
              />
            </motion.div>
          </div>

          {/* Stats in colored circles */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap justify-center lg:justify-start gap-8 sm:gap-12 mt-16 sm:mt-20"
          >
            {stats.map((stat, i) => {
              const circleColor = [C.blue, C.red, C.yellow][i % 3];
              const textColor = i === 2 ? C.text : "#FFFFFF";
              return (
                <div key={stat.label} className="flex flex-col items-center">
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: "50%",
                      background: circleColor,
                    }}
                  >
                    <span
                      className="font-[family-name:var(--font-space-grotesk)] font-bold uppercase"
                      style={{ fontSize: "2rem", color: textColor, lineHeight: 1 }}
                    >
                      {stat.value}
                    </span>
                  </div>
                  <span
                    className="font-[family-name:var(--font-space-grotesk)] text-[11px] uppercase tracking-[0.16em] font-semibold mt-3"
                    style={{ color: C.text, opacity: 0.5 }}
                  >
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Large decorative yellow circle — top right, partially hidden */}
        <div
          className="absolute pointer-events-none hidden lg:block"
          style={{
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: C.yellow,
            top: -60,
            right: -60,
            opacity: 0.2,
          }}
        />
      </section>

      {/* ─── Projects Section — Gray BG ─── */}
      <section
        id="work"
        style={{ background: C.gray }}
      >
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 py-20 sm:py-28">
          <Reveal>
            <div className="flex items-center gap-3 mb-3">
              <span
                style={{
                  width: 24,
                  height: 24,
                  background: C.red,
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              <span
                className="font-[family-name:var(--font-space-grotesk)] text-[11px] uppercase tracking-[0.25em] font-semibold"
                style={{ color: C.text, opacity: 0.4 }}
              >
                PORTFOLIO
              </span>
            </div>
            <h2
              className="font-[family-name:var(--font-space-grotesk)] font-bold uppercase tracking-[0.02em]"
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                color: C.text,
              }}
            >
              SELECTED WORK
            </h2>
            {/* Thin structural line */}
            <div
              className="mt-4"
              style={{ width: 60, height: 2, background: C.text }}
            />
          </Reveal>

          {/* Mondrian Grid */}
          <div
            className="mt-14"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "16px",
            }}
          >
            {projects.map((project, i) => (
              <ProjectCard
                key={project.title}
                project={project}
                index={i}
                size={cardSize(i)}
              />
            ))}
          </div>

          {/* Mobile override — single column */}
          <style>{`
            @media (max-width: 1023px) {
              #work > div > div:last-child {
                grid-template-columns: 1fr !important;
              }
              #work > div > div:last-child > a {
                grid-column: span 1 !important;
                grid-row: span 1 !important;
              }
            }
            @media (min-width: 640px) and (max-width: 1023px) {
              #work > div > div:last-child {
                grid-template-columns: repeat(2, 1fr) !important;
              }
            }
          `}</style>
        </div>
      </section>

      {/* ─── Expertise Section — Blue BG ─── */}
      <section
        id="about"
        className="relative overflow-hidden"
        style={{ background: C.blue }}
      >
        {/* Decorative yellow circle */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: C.yellow,
            top: 40,
            right: 40,
            opacity: 0.6,
          }}
        />

        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 py-20 sm:py-28 relative z-10">
          <Reveal>
            <div className="flex items-center gap-3 mb-3">
              <span
                style={{
                  width: 24,
                  height: 24,
                  background: C.yellow,
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              <span
                className="font-[family-name:var(--font-space-grotesk)] text-[11px] uppercase tracking-[0.25em] font-semibold"
                style={{ color: "#FFFFFF", opacity: 0.6 }}
              >
                EXPERTISE
              </span>
            </div>
            <h2
              className="font-[family-name:var(--font-space-grotesk)] font-bold uppercase tracking-[0.02em]"
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                color: "#FFFFFF",
              }}
            >
              WHAT I DO
            </h2>
            {/* Thin white structural line */}
            <div
              className="mt-4"
              style={{ width: 60, height: 2, background: "#FFFFFF", opacity: 0.4 }}
            />
          </Reveal>

          {/* 2x2 Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10 mt-14">
            {expertise.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08}>
                <div
                  className="p-6 sm:p-8"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    borderLeft: `3px solid ${C.yellow}`,
                  }}
                >
                  {/* Number */}
                  <span
                    className="font-[family-name:var(--font-space-grotesk)] font-bold block mb-2"
                    style={{
                      fontSize: "2.5rem",
                      color: "#FFFFFF",
                      opacity: 0.12,
                      lineHeight: 1,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Title */}
                  <h3
                    className="font-[family-name:var(--font-space-grotesk)] font-bold uppercase tracking-[0.04em] mb-3"
                    style={{
                      fontSize: "clamp(1rem, 1.8vw, 1.3rem)",
                      color: "#FFFFFF",
                    }}
                  >
                    {item.title}
                  </h3>

                  {/* Body */}
                  <p
                    className="font-[family-name:var(--font-inter)] text-[13px] sm:text-[14px] leading-[1.75]"
                    style={{ color: "#FFFFFF", opacity: 0.7 }}
                  >
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Decorative small red square */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 32,
            height: 32,
            background: C.red,
            bottom: 60,
            left: 60,
            opacity: 0.5,
          }}
        />
      </section>

      {/* ─── Tools Section — White BG ─── */}
      <section style={{ background: C.bg }}>
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 py-20 sm:py-28">
          <Reveal>
            <div className="flex items-center gap-3 mb-3">
              <span
                style={{
                  width: 24,
                  height: 24,
                  background: C.red,
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              <span
                className="font-[family-name:var(--font-space-grotesk)] text-[11px] uppercase tracking-[0.25em] font-semibold"
                style={{ color: C.text, opacity: 0.4 }}
              >
                STACK
              </span>
            </div>
            <h2
              className="font-[family-name:var(--font-space-grotesk)] font-bold uppercase tracking-[0.02em]"
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                color: C.text,
              }}
            >
              TOOLS & TECHNOLOGIES
            </h2>
            {/* Thin structural line */}
            <div
              className="mt-4"
              style={{ width: 60, height: 2, background: C.text }}
            />
          </Reveal>

          {/* Tools Grid — Swiss bordered cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 mt-14">
            {tools.map((group, gi) => {
              const topColor = accentAt(gi);
              return (
                <Reveal key={group.label} delay={gi * 0.05}>
                  <div
                    style={{
                      background: C.bg,
                      border: `1px solid ${C.text}12`,
                      borderTop: `4px solid ${topColor}`,
                      padding: "20px 16px",
                    }}
                  >
                    {/* Group label */}
                    <h4
                      className="font-[family-name:var(--font-space-grotesk)] font-bold text-[11px] uppercase tracking-[0.16em] mb-5"
                      style={{ color: C.text }}
                    >
                      {group.label}
                    </h4>

                    {/* Items */}
                    <div className="flex flex-col gap-3">
                      {group.items.map((item) => (
                        <div key={item} className="flex items-center gap-2.5">
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              background: topColor,
                              flexShrink: 0,
                            }}
                          />
                          <span
                            className="font-[family-name:var(--font-inter)] text-[12px] sm:text-[13px] tracking-[0.02em]"
                            style={{ color: C.text, opacity: 0.65 }}
                          >
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Footer — Black BG ─── */}
      <footer style={{ background: C.text }}>
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 py-24 sm:py-36">
          <Reveal>
            <div className="text-center">
              {/* Headline */}
              <h2
                className="font-[family-name:var(--font-space-grotesk)] font-bold uppercase tracking-[0.02em] leading-[1]"
                style={{
                  fontSize: "clamp(3rem, 8vw, 7rem)",
                  color: "#FFFFFF",
                }}
              >
                LET&apos;S BUILD.
              </h2>

              {/* Three decorative dots */}
              <div className="flex justify-center gap-4 mt-8">
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: C.blue,
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: C.red,
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: C.yellow,
                    display: "inline-block",
                  }}
                />
              </div>

              {/* GitHub link */}
              <div className="mt-10">
                <a
                  href="https://github.com/1aday"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-[family-name:var(--font-space-grotesk)] text-[12px] uppercase tracking-[0.16em] font-semibold inline-flex items-center gap-2"
                  style={{
                    color: "#FFFFFF",
                    padding: "12px 28px",
                    border: "1px solid rgba(255,255,255,0.25)",
                    transition: "border-color 0.2s ease, background 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = C.blue;
                    e.currentTarget.style.background = "rgba(37,99,235,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  GITHUB
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </a>
              </div>
            </div>
          </Reveal>

          {/* Bottom bar */}
          <div className="mt-20 flex items-center justify-between">
            <span
              className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.14em]"
              style={{ color: "#FFFFFF", opacity: 0.3 }}
            >
              GROX AI PRODUCT STUDIO
            </span>
            <span
              className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.14em]"
              style={{ color: "#FFFFFF", opacity: 0.3 }}
            >
              2024 &mdash; PRESENT
            </span>
          </div>
        </div>
      </footer>

      {/* Theme Switcher */}
      <ThemeSwitcher current="/mosaic" variant="light" />
    </main>
  );
}
