"use client";

import { useRef, useState, useEffect, createElement, type ReactNode } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { getProjectImage } from "@/lib/theme-images";

/* ─── Color constants ─── */
const C = {
  bg: "#1C1C20",
  card: "#222228",
  verdigris: "#43B3A0",
  bronze: "#8B6F47",
  copper: "#C87941",
  deepPatina: "#2A7A6E",
  silver: "#B8B8C0",
  tarnish: "#7A7880",
  rawCopper: "#E8915A",
  copperTint: "rgba(200,121,65,0.06)",
  verdigrisTint: "rgba(67,179,160,0.06)",
};

/* ─── SVG Noise Filter (metal grain) ─── */
function MetalGrainOverlay() {
  return (
    <svg className="fixed inset-0 w-full h-full pointer-events-none z-[1]" style={{ opacity: 0.035 }}>
      <filter id="metalGrain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.75"
          numOctaves="4"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#metalGrain)" />
    </svg>
  );
}

/* ─── Forge Mark SVGs ─── */
function ForgeMarkCircleCross({ size = 24, color = C.verdigris }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="4" x2="12" y2="20" />
      <line x1="4" y1="12" x2="20" y2="12" />
    </svg>
  );
}

function ForgeMarkDiamond({ size = 20, color = C.bronze }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1">
      <path d="M10 2 L18 10 L10 18 L2 10 Z" />
      <circle cx="10" cy="10" r="3" />
    </svg>
  );
}

function ForgeMarkHexagon({ size = 22, color = C.copper }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none" stroke={color} strokeWidth="1">
      <path d="M11 1 L20 6 L20 16 L11 21 L2 16 L2 6 Z" />
      <circle cx="11" cy="11" r="2" fill={color} />
    </svg>
  );
}

function ForgeMarkStamp({ size = 18, color = C.rawCopper }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke={color} strokeWidth="0.8">
      <rect x="2" y="2" width="14" height="14" rx="1" />
      <line x1="5" y1="9" x2="13" y2="9" />
      <line x1="9" y1="5" x2="9" y2="13" />
      <circle cx="9" cy="9" r="5" />
    </svg>
  );
}

const forgeMarks = [ForgeMarkCircleCross, ForgeMarkDiamond, ForgeMarkHexagon, ForgeMarkStamp];

/* ─── Metallic gradient border wrapper ─── */
function MetallicBorderCard({
  children,
  className = "",
  hovered = false,
}: {
  children: ReactNode;
  className?: string;
  hovered?: boolean;
}) {
  return (
    <div className={`relative p-[1px] ${className}`}>
      {/* Gradient border via background */}
      <div
        className="absolute inset-0 rounded-sm transition-opacity duration-600"
        style={{
          background: `linear-gradient(135deg, ${C.copper}, ${C.bronze}, ${C.verdigris})`,
          opacity: hovered ? 1 : 0.4,
        }}
      />
      {/* Card interior */}
      <div className="relative rounded-sm" style={{ background: C.card }}>
        {children}
      </div>
    </div>
  );
}

/* ─── Scroll reveal wrapper with oxidation color shift ─── */
function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Forge mark with stamp-in animation ─── */
function AnimatedForgeMark({
  index,
  delay = 0,
}: {
  index: number;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const Mark = forgeMarks[index % forgeMarks.length];

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 0.5 } : { scale: 0, opacity: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.34, 1.56, 0.64, 1], // overshoot for stamp effect
      }}
    >
      <Mark />
    </motion.div>
  );
}

/* ─── Section divider ─── */
function PatinaDivider() {
  return (
    <div className="relative py-6 flex items-center justify-center gap-4">
      <div
        className="flex-1 h-[1px]"
        style={{
          background: `linear-gradient(to right, transparent, ${C.bronze}40, ${C.verdigris}30, transparent)`,
        }}
      />
      <ForgeMarkDiamond size={12} color={`${C.tarnish}80`} />
      <div
        className="flex-1 h-[1px]"
        style={{
          background: `linear-gradient(to left, transparent, ${C.bronze}40, ${C.verdigris}30, transparent)`,
        }}
      />
    </div>
  );
}

/* ─── Embossed text style ─── */
const embossedShadow = "1px 1px 0 rgba(255,255,255,0.05), -1px -1px 0 rgba(0,0,0,0.3)";
const embossedShadowHover = "1px 1px 0 rgba(255,255,255,0.08), -1px -1px 0 rgba(0,0,0,0.5)";

/* ─── Project Card ─── */
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
      transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <MetallicBorderCard hovered={isHovered}>
        <div
          className="relative p-6 sm:p-8 overflow-hidden transition-all duration-[600ms]"
          style={{
            backgroundColor: isHovered
              ? `color-mix(in srgb, ${C.card} 94%, ${C.verdigris})`
              : `color-mix(in srgb, ${C.card} 96%, ${C.copper})`,
          }}
        >
          {/* Subtle shimmer overlay on hover */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(135deg, transparent 30%, ${C.verdigris}08 50%, transparent 70%)`,
            }}
            animate={
              isHovered
                ? { backgroundPosition: ["0% 0%", "200% 200%"] }
                : { backgroundPosition: "0% 0%" }
            }
            transition={{ duration: 1.5, ease: "linear" }}
          />

          <div className="grid sm:grid-cols-[1fr,1.6fr] gap-6 sm:gap-8">
            {/* Left: Image */}
            <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
              <img
                src={getProjectImage("patina", project.image)}
                alt={project.title}
                loading="lazy"
                className="w-full h-full object-cover transition-all duration-700"
                style={{
                  filter: isHovered
                    ? "sepia(0.1) saturate(1.1)"
                    : "sepia(0.3) saturate(0.7) brightness(0.85)",
                }}
              />
              {/* Oxidation overlay */}
              <div
                className="absolute inset-0 pointer-events-none transition-all duration-[600ms]"
                style={{
                  background: isHovered
                    ? `linear-gradient(180deg, ${C.verdigris}15, ${C.card}80)`
                    : `linear-gradient(180deg, ${C.copper}10, ${C.card}70)`,
                }}
              />
              {/* Embossed project number stamp */}
              <div
                className="absolute top-3 left-3 w-10 h-10 flex items-center justify-center rounded-sm"
                style={{
                  background: `${C.bg}CC`,
                  border: `1px solid ${C.bronze}40`,
                  textShadow: embossedShadow,
                }}
              >
                <span
                  className="font-[family-name:var(--font-instrument)] text-sm font-bold"
                  style={{ color: C.copper }}
                >
                  {num}
                </span>
              </div>
            </div>

            {/* Right: Details */}
            <div className="flex flex-col gap-3">
              {/* Client & Year */}
              <div className="flex items-center gap-3">
                <span
                  className="text-[10px] uppercase tracking-[0.15em] font-[family-name:var(--font-inter)]"
                  style={{ color: C.bronze }}
                >
                  {project.client}
                </span>
                <span
                  className="text-[10px] font-[family-name:var(--font-inter)]"
                  style={{ color: C.tarnish }}
                >
                  /
                </span>
                <span
                  className="text-[10px] font-[family-name:var(--font-inter)]"
                  style={{ color: C.tarnish }}
                >
                  {project.year}
                </span>
              </div>

              {/* Title */}
              <h3
                className="font-[family-name:var(--font-instrument)] font-semibold leading-[1.15] whitespace-pre-line transition-all duration-300"
                style={{
                  fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
                  color: C.silver,
                  textShadow: isHovered ? embossedShadowHover : embossedShadow,
                }}
              >
                {project.title}
              </h3>

              {/* Description */}
              <p
                className="text-[13px] leading-[1.7] font-light font-[family-name:var(--font-inter)]"
                style={{ color: C.tarnish }}
              >
                {project.description}
              </p>

              {/* Technical */}
              <p
                className="text-[12px] leading-[1.7] font-[family-name:var(--font-display)] italic"
                style={{ color: `${C.tarnish}CC` }}
              >
                {project.technical}
              </p>

              {/* Tech tags — metal-etched labels */}
              <div className="flex flex-wrap gap-1.5 mt-1">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-[family-name:var(--font-inter)] px-2.5 py-1 transition-all duration-300"
                    style={{
                      color: isHovered ? C.verdigris : C.bronze,
                      border: `1px solid ${isHovered ? `${C.verdigris}40` : `${C.bronze}30`}`,
                      background: isHovered ? `${C.verdigris}08` : `${C.bronze}06`,
                      textShadow: embossedShadow,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* GitHub link */}
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-2 text-[11px] uppercase tracking-[0.12em] font-[family-name:var(--font-inter)] transition-all duration-300 group/link"
                style={{ color: C.copper }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = C.verdigris;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = C.copper;
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
        </div>
      </MetallicBorderCard>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   PATINA — OXIDIZED METAL TRANSFORMATION
   ═══════════════════════════════════════════ */
export default function PatinaPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main
      className="relative min-h-screen overflow-hidden font-[family-name:var(--font-inter)]"
      style={{ background: C.bg, color: C.silver }}
    >
      <MetalGrainOverlay />

      {/* ─── Navigation ─── */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
        style={{
          background: `${C.bg}EE`,
          borderBottom: `1px solid ${C.bronze}15`,
        }}
      >
        <div className="mx-auto max-w-[1200px] px-4 sm:px-10 py-5 flex items-center justify-between">
          <span
            className="font-[family-name:var(--font-instrument)] text-lg font-bold tracking-wide"
            style={{
              background: `linear-gradient(135deg, ${C.copper}, ${C.bronze})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            GROX
          </span>
          <div className="flex items-center gap-6 sm:gap-8">
            {[
              { label: "Work", href: "#work" },
              { label: "Expertise", href: "#expertise" },
              { label: "GitHub", href: "https://github.com/1aday", external: true },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="text-[11px] tracking-[0.12em] uppercase font-[family-name:var(--font-inter)] transition-colors duration-300"
                style={{ color: C.tarnish }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.verdigris)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.tarnish)}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* ═══════════════════════════════════════
         HERO — Textured metal surface
         ═══════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background decorative forge marks */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Scattered forge marks at low opacity */}
          <div className="absolute top-[15%] left-[8%] opacity-[0.06]">
            <ForgeMarkCircleCross size={80} color={C.copper} />
          </div>
          <div className="absolute top-[25%] right-[12%] opacity-[0.04]">
            <ForgeMarkHexagon size={60} color={C.verdigris} />
          </div>
          <div className="absolute bottom-[20%] left-[15%] opacity-[0.05]">
            <ForgeMarkDiamond size={70} color={C.bronze} />
          </div>
          <div className="absolute bottom-[30%] right-[20%] opacity-[0.04]">
            <ForgeMarkStamp size={50} color={C.copper} />
          </div>
          {/* Subtle radial gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 60% 40% at 30% 50%, ${C.copper}08, transparent 70%)`,
            }}
          />
        </div>

        <div className="relative z-[2] mx-auto max-w-[1200px] px-4 sm:px-10 w-full pt-32 sm:pt-0">
          <div className="max-w-3xl">
            {/* Forge mark + tagline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex items-center gap-3 mb-8"
            >
              <AnimatedForgeMark index={0} delay={0.5} />
              <span
                className="text-[10px] uppercase tracking-[0.3em] font-[family-name:var(--font-inter)]"
                style={{ color: C.bronze }}
              >
                AI Product Studio
              </span>
            </motion.div>

            {/* Main title — metallic gradient text */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="font-[family-name:var(--font-instrument)] font-bold leading-[1.05] tracking-tight"
              style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)" }}
            >
              <span
                style={{
                  background: `linear-gradient(135deg, ${C.copper}, ${C.bronze}, ${C.verdigris})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "none",
                }}
              >
                Forged Through
              </span>
              <br />
              <span
                style={{
                  color: C.silver,
                  textShadow: embossedShadow,
                }}
              >
                Expertise
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-8 text-[14px] leading-[1.9] font-light max-w-xl font-[family-name:var(--font-inter)]"
              style={{ color: C.tarnish }}
            >
              End-to-end product ownership — from{" "}
              <span style={{ color: C.verdigris }}>computer vision</span> and
              multi-model orchestration to pixel-perfect interfaces. Every
              project{" "}
              <span style={{ color: C.copper }}>tempered by experience</span>,
              refined by iteration.
            </motion.p>

            {/* Stats as forge marks */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="mt-14 flex gap-10 sm:gap-14"
            >
              {stats.map((stat, i) => (
                <div key={stat.label} className="relative group">
                  <div className="flex flex-col items-center">
                    {/* Value in copper */}
                    <span
                      className="font-[family-name:var(--font-instrument)] font-bold text-3xl sm:text-4xl"
                      style={{
                        color: C.copper,
                        textShadow: embossedShadow,
                      }}
                    >
                      {stat.value}
                    </span>
                    {/* Decorative line */}
                    <div
                      className="w-8 h-[1px] my-2"
                      style={{
                        background: `linear-gradient(to right, ${C.copper}60, ${C.verdigris}40)`,
                      }}
                    />
                    {/* Label */}
                    <span
                      className="text-[9px] uppercase tracking-[0.2em] font-[family-name:var(--font-inter)]"
                      style={{ color: C.tarnish }}
                    >
                      {stat.label}
                    </span>
                  </div>
                  {/* Forge stamp behind value */}
                  <div className="absolute -top-2 -left-2 opacity-[0.08]">
                    {createElement(forgeMarks[i % forgeMarks.length], {
                      size: 16,
                      color: C.copper,
                    })}
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
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span
            className="text-[8px] tracking-[0.25em] uppercase font-[family-name:var(--font-inter)]"
            style={{ color: `${C.bronze}50` }}
          >
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-[1px] h-8"
            style={{
              background: `linear-gradient(to bottom, ${C.copper}60, transparent)`,
            }}
          />
        </motion.div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-[1200px] px-4 sm:px-10">
        <PatinaDivider />
      </div>

      {/* ═══════════════════════════════════════
         PROJECTS — Copper plates with oxidation reveal
         ═══════════════════════════════════════ */}
      <section id="work" className="mx-auto max-w-[1200px] px-4 sm:px-10 py-20 sm:py-28">
        <Reveal>
          <div className="flex items-center gap-3 mb-4">
            <AnimatedForgeMark index={1} delay={0.1} />
            <span
              className="text-[10px] uppercase tracking-[0.3em] font-[family-name:var(--font-inter)]"
              style={{ color: C.deepPatina }}
            >
              Selected Work
            </span>
          </div>
          <div className="flex items-end justify-between mb-14">
            <h2
              className="font-[family-name:var(--font-instrument)] font-bold tracking-tight leading-[1.1]"
              style={{
                fontSize: "clamp(1.75rem, 4vw, 3.5rem)",
                textShadow: embossedShadow,
              }}
            >
              <span style={{ color: C.silver }}>Crafted </span>
              <span
                style={{
                  background: `linear-gradient(135deg, ${C.copper}, ${C.verdigris})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Works
              </span>
            </h2>
            <span
              className="text-[10px] tracking-[0.15em] hidden sm:block font-[family-name:var(--font-inter)]"
              style={{ color: C.tarnish }}
            >
              {projects.length} projects
            </span>
          </div>
        </Reveal>

        <div className="flex flex-col gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-[1200px] px-4 sm:px-10">
        <PatinaDivider />
      </div>

      {/* ═══════════════════════════════════════
         EXPERTISE — Material transformation panels
         ═══════════════════════════════════════ */}
      <section id="expertise" className="mx-auto max-w-[1200px] px-4 sm:px-10 py-24 sm:py-36">
        <Reveal>
          <div className="flex items-center gap-3 mb-4">
            <AnimatedForgeMark index={2} delay={0.1} />
            <span
              className="text-[10px] uppercase tracking-[0.3em] font-[family-name:var(--font-inter)]"
              style={{ color: C.deepPatina }}
            >
              Expertise
            </span>
          </div>
          <h2
            className="font-[family-name:var(--font-instrument)] font-bold tracking-tight max-w-3xl leading-[1.15] mb-4"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 3.5rem)",
              color: C.silver,
              textShadow: embossedShadow,
            }}
          >
            Layers of{" "}
            <span
              style={{
                background: `linear-gradient(135deg, ${C.copper}, ${C.verdigris})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              transformation
            </span>
          </h2>
          <p
            className="text-[13px] leading-[1.8] font-light max-w-xl font-[family-name:var(--font-inter)]"
            style={{ color: C.tarnish }}
          >
            Each capability developed through rigorous application — raw material
            refined into proven methodology.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-6 mt-16">
          {expertise.map((item, i) => {
            const stageColors = [C.copper, C.rawCopper, C.bronze, C.verdigris];
            const stageLabels = [
              "Raw Material",
              "Heat Treatment",
              "Alloy Formation",
              "Final Patina",
            ];
            const stageColor = stageColors[i % stageColors.length];

            return (
              <Reveal key={item.title} delay={i * 0.1}>
                <ExpertiseCard
                  item={item}
                  index={i}
                  stageColor={stageColor}
                  stageLabel={stageLabels[i % stageLabels.length]}
                />
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-[1200px] px-4 sm:px-10">
        <PatinaDivider />
      </div>

      {/* ═══════════════════════════════════════
         TOOLS — Forge mark grid
         ═══════════════════════════════════════ */}
      <section className="mx-auto max-w-[1200px] px-4 sm:px-10 py-24 sm:py-32">
        <Reveal>
          <div className="flex items-center gap-3 mb-4">
            <AnimatedForgeMark index={3} delay={0.1} />
            <span
              className="text-[10px] uppercase tracking-[0.3em] font-[family-name:var(--font-inter)]"
              style={{ color: C.deepPatina }}
            >
              Forge Marks
            </span>
          </div>
          <h2
            className="font-[family-name:var(--font-instrument)] font-bold tracking-tight leading-[1.1] mb-14"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 3.5rem)",
              color: C.silver,
              textShadow: embossedShadow,
            }}
          >
            Tools &amp;{" "}
            <span
              style={{
                background: `linear-gradient(135deg, ${C.copper}, ${C.verdigris})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Technologies
            </span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
          {tools.map((group, gi) => {
            const Mark = forgeMarks[gi % forgeMarks.length];
            return (
              <Reveal key={group.label} delay={gi * 0.06}>
                <div className="relative">
                  {/* Forge stamp decoration */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="opacity-60">
                      <Mark size={16} color={C.copper} />
                    </div>
                    <h4
                      className="text-[10px] uppercase tracking-[0.2em] font-semibold font-[family-name:var(--font-inter)]"
                      style={{ color: C.copper }}
                    >
                      {group.label}
                    </h4>
                  </div>
                  {/* Top border accent */}
                  <div
                    className="w-full h-[1px] mb-4"
                    style={{
                      background: `linear-gradient(to right, ${C.copper}40, ${C.verdigris}20, transparent)`,
                    }}
                  />
                  {/* Items list */}
                  <div className="flex flex-col gap-2.5">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="flex items-center gap-2 text-[12px] font-[family-name:var(--font-inter)] cursor-default transition-colors duration-300"
                        style={{ color: C.tarnish }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = C.verdigris;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = C.tarnish;
                        }}
                      >
                        {/* Tiny forge dot bullet */}
                        <span
                          className="inline-block w-1 h-1 rounded-full flex-shrink-0"
                          style={{ background: C.bronze }}
                        />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-[1200px] px-4 sm:px-10">
        <PatinaDivider />
      </div>

      {/* ═══════════════════════════════════════
         FOOTER — CTA and contact
         ═══════════════════════════════════════ */}
      <footer className="mx-auto max-w-[1200px] px-4 sm:px-10 py-24 sm:py-36">
        <Reveal>
          <div className="text-center">
            {/* CTA in Instrument Serif italic */}
            <h2
              className="font-[family-name:var(--font-instrument)] font-bold italic tracking-tight leading-[1.1]"
              style={{
                fontSize: "clamp(2rem, 5vw, 4.5rem)",
                textShadow: embossedShadow,
              }}
            >
              <span style={{ color: C.silver }}>Let&apos;s forge</span>
              <br />
              <span
                style={{
                  background: `linear-gradient(135deg, ${C.copper}, ${C.bronze}, ${C.verdigris})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                something enduring.
              </span>
            </h2>

            <p
              className="mt-6 text-[13px] font-light font-[family-name:var(--font-display)] italic max-w-md mx-auto"
              style={{ color: C.tarnish }}
            >
              The best products, like the finest metals, are transformed through
              expertise and time.
            </p>

            {/* Contact links as embossed metal buttons */}
            <div className="mt-10 flex justify-center gap-4">
              <a
                href="https://github.com/1aday"
                target="_blank"
                rel="noopener noreferrer"
                className="relative group/btn inline-flex items-center gap-2 px-6 py-3 text-[11px] uppercase tracking-[0.15em] font-[family-name:var(--font-inter)] transition-all duration-500"
                style={{
                  color: C.silver,
                  border: `1px solid ${C.bronze}40`,
                  background: `linear-gradient(135deg, ${C.card}, ${C.bg})`,
                  textShadow: embossedShadow,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${C.verdigris}60`;
                  e.currentTarget.style.color = C.verdigris;
                  e.currentTarget.style.background = `linear-gradient(135deg, ${C.card}, ${C.deepPatina}15)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${C.bronze}40`;
                  e.currentTarget.style.color = C.silver;
                  e.currentTarget.style.background = `linear-gradient(135deg, ${C.card}, ${C.bg})`;
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
                <svg
                  width="10"
                  height="10"
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

        {/* Decorative patina pattern */}
        <div className="mt-20 mb-8 relative">
          <div
            className="h-[1px]"
            style={{
              background: `linear-gradient(to right, transparent, ${C.copper}30, ${C.bronze}40, ${C.verdigris}30, transparent)`,
            }}
          />
          <div className="flex justify-center -mt-2">
            <div
              className="px-6 py-1"
              style={{ background: C.bg }}
            >
              <ForgeMarkDiamond size={14} color={`${C.bronze}50`} />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between">
          <span
            className="text-[9px] tracking-[0.2em] uppercase font-[family-name:var(--font-inter)]"
            style={{ color: `${C.tarnish}60` }}
          >
            Grox AI Product Studio
          </span>
          <span
            className="text-[9px] tracking-[0.2em] font-[family-name:var(--font-display)] italic"
            style={{ color: `${C.tarnish}60` }}
          >
            Forged in {new Date().getFullYear()}
          </span>
        </div>
      </footer>

      <ThemeSwitcher current="/patina" variant="dark" />
    </main>
  );
}

/* ─── Expertise Card Component ─── */
function ExpertiseCard({
  item,
  index,
  stageColor,
  stageLabel,
}: {
  item: (typeof expertise)[0];
  index: number;
  stageColor: string;
  stageLabel: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const num = String(index + 1).padStart(2, "0");

  return (
    <div
      className="relative overflow-hidden transition-all duration-500 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: C.card,
        border: `1px solid ${isHovered ? `${stageColor}30` : `${C.tarnish}15`}`,
      }}
    >
      {/* Left border gradient — copper to verdigris */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[2px] transition-opacity duration-500"
        style={{
          background: `linear-gradient(to bottom, ${C.copper}, ${C.bronze}, ${C.verdigris})`,
          opacity: isHovered ? 1 : 0.5,
        }}
      />

      <div className="p-6 sm:p-8 pl-8 sm:pl-10">
        {/* Stage label and forge mark */}
        <div className="flex items-center gap-2 mb-4">
          <motion.div
            className="opacity-50"
            animate={isHovered ? { scale: [1, 1.15, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            {createElement(forgeMarks[index % forgeMarks.length], {
              size: 14,
              color: stageColor,
            })}
          </motion.div>
          <span
            className="text-[8px] uppercase tracking-[0.25em] font-[family-name:var(--font-inter)]"
            style={{ color: `${stageColor}80` }}
          >
            Stage {num} / {stageLabel}
          </span>
        </div>

        {/* Number */}
        <span
          className="font-[family-name:var(--font-instrument)] font-bold text-3xl block mb-3 transition-colors duration-500"
          style={{
            color: isHovered ? C.verdigris : C.copper,
            textShadow: embossedShadow,
          }}
        >
          {num}
        </span>

        {/* Title */}
        <h3
          className="text-[15px] font-[family-name:var(--font-instrument)] font-semibold tracking-tight mb-3 transition-all duration-300"
          style={{
            color: C.silver,
            textShadow: isHovered ? embossedShadowHover : embossedShadow,
          }}
        >
          {item.title}
        </h3>

        {/* Body */}
        <p
          className="text-[13px] leading-[1.8] font-light font-[family-name:var(--font-inter)]"
          style={{ color: C.tarnish }}
        >
          {item.body}
        </p>
      </div>
    </div>
  );
}
