"use client";

import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

/* ─── Font assignments ─── */
const FONTS = {
  hero: "font-[family-name:var(--font-playfair)]",
  section: "font-[family-name:var(--font-dm-serif)]",
  project: "font-[family-name:var(--font-instrument)]",
  body: "font-[family-name:var(--font-inter)]",
  data: "font-[family-name:var(--font-jetbrains)]",
  label: "font-[family-name:var(--font-space-grotesk)]",
  number: "font-[family-name:var(--font-sora)]",
};

/* ─── Color palette ─── */
const C = {
  bg: "#FAFAFA",
  text: "#000000",
  red: "#E53935",
  grid: "#E0E0E0",
  muted: "#999999",
};

/* ─── Specimen font catalog for project cards ─── */
const specimenFonts = [
  { name: "Playfair Display", style: "Italic", size: "24/32", font: FONTS.hero },
  { name: "DM Serif Display", style: "Regular", size: "22/30", font: FONTS.section },
  { name: "Instrument Serif", style: "Italic", size: "20/28", font: FONTS.project },
  { name: "Inter", style: "Regular", size: "16/24", font: FONTS.body },
  { name: "Space Grotesk", style: "Medium", size: "14/20", font: FONTS.label },
  { name: "JetBrains Mono", style: "Regular", size: "13/20", font: FONTS.data },
  { name: "Sora", style: "SemiBold", size: "18/26", font: FONTS.number },
  { name: "Playfair Display", style: "Bold", size: "28/36", font: FONTS.hero },
  { name: "DM Serif Display", style: "Regular", size: "32/40", font: FONTS.section },
  { name: "Instrument Serif", style: "Italic", size: "26/34", font: FONTS.project },
];

/* ─── Animated metric line (SVG stroke-dasharray) ─── */
function MetricLine({
  y,
  label,
  color = C.red,
  delay = 0,
}: {
  y: number;
  label: string;
  color?: string;
  delay?: number;
}) {
  return (
    <g>
      <motion.line
        x1="0"
        y1={y}
        x2="100%"
        y2={y}
        stroke={color}
        strokeWidth="1"
        strokeDasharray="1200"
        initial={{ strokeDashoffset: 1200 }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 1.8, delay, ease: "easeInOut" }}
      />
      <motion.text
        x="8"
        y={y - 6}
        fill={color}
        fontSize="10"
        fontFamily="var(--font-jetbrains)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: delay + 0.8 }}
      >
        {label}
      </motion.text>
    </g>
  );
}

/* ─── Section wrapper with in-view animation ─── */
function Section({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.section
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.section>
  );
}

/* ─── Baseline grid overlay for paragraph samples ─── */
function BaselineGrid({ lines = 12 }: { lines?: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="w-full border-b"
          style={{
            borderColor: C.grid,
            height: "24px",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Weight spectrum component ─── */
function WeightSpectrum() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const weights = [
    { name: "Thin", weight: 100 },
    { name: "Light", weight: 300 },
    { name: "Regular", weight: 400 },
    { name: "Medium", weight: 500 },
    { name: "Bold", weight: 700 },
    { name: "Black", weight: 900 },
  ];

  return (
    <div ref={ref} className="overflow-x-auto">
      <div className="flex items-baseline gap-6 md:gap-10 min-w-[600px]">
        {weights.map((w, i) => (
          <motion.div
            key={w.name}
            className="flex flex-col items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.12, ease: "easeOut" }}
          >
            <span
              className={`${FONTS.hero} text-3xl md:text-4xl lg:text-5xl`}
              style={{ fontWeight: w.weight, color: C.text }}
            >
              Grox
            </span>
            <span
              className={`${FONTS.data} text-[10px] mt-2 tracking-widest uppercase`}
              style={{ color: C.muted }}
            >
              {w.name} — {w.weight}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── Size scale component ─── */
function SizeScale() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const sizes = [
    { pt: 8, px: "text-[8px]" },
    { pt: 10, px: "text-[10px]" },
    { pt: 12, px: "text-[12px]" },
    { pt: 14, px: "text-[14px]" },
    { pt: 18, px: "text-[18px]" },
    { pt: 24, px: "text-[24px]" },
    { pt: 36, px: "text-[36px]" },
    { pt: 48, px: "text-[48px]" },
    { pt: 72, px: "text-[72px]" },
  ];

  return (
    <div ref={ref} className="space-y-1">
      {sizes.map((s, i) => (
        <motion.div
          key={s.pt}
          className="flex items-baseline gap-4"
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: i * 0.06 }}
        >
          <span
            className={`${FONTS.data} text-[10px] w-12 text-right shrink-0`}
            style={{ color: C.red }}
          >
            {s.pt}pt
          </span>
          <span
            className={`${FONTS.section} ${s.px} leading-tight`}
            style={{ color: C.text }}
          >
            AI Product Studio
          </span>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Character set display ─── */
function CharacterSet() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 1.2 }}
      className="space-y-4"
    >
      <div
        className={`${FONTS.hero} text-lg md:text-xl lg:text-2xl tracking-[0.15em] leading-relaxed break-all`}
        style={{ color: C.text }}
      >
        ABCDEFGHIJKLMNOPQRSTUVWXYZ
      </div>
      <div
        className={`${FONTS.hero} text-lg md:text-xl lg:text-2xl tracking-[0.15em] leading-relaxed break-all`}
        style={{ color: C.text }}
      >
        abcdefghijklmnopqrstuvwxyz
      </div>
      <div
        className={`${FONTS.number} text-lg md:text-xl lg:text-2xl tracking-[0.2em] leading-relaxed`}
        style={{ color: C.text }}
      >
        0123456789
      </div>
      <div
        className={`${FONTS.data} text-sm tracking-[0.1em]`}
        style={{ color: C.muted }}
      >
        {`! @ # $ % ^ & * ( ) — – + = { } [ ] | \\ : ; " ' < > , . ? /`}
      </div>
    </motion.div>
  );
}

/* ─── Project specimen card ─── */
function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const specimen = specimenFonts[index % specimenFonts.length];
  const projectNum = String(index + 1).padStart(2, "0");

  return (
    <motion.article
      ref={ref}
      className="relative border-t py-12 md:py-16 overflow-hidden"
      style={{ borderColor: C.grid }}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Giant background numeral */}
      <div
        className={`absolute top-0 right-0 ${FONTS.number} leading-none pointer-events-none select-none`}
        style={{
          fontSize: "clamp(10rem, 30vw, 22rem)",
          color: C.text,
          opacity: 0.03,
          lineHeight: 0.85,
        }}
        aria-hidden="true"
      >
        {projectNum}
      </div>

      {/* Foundry metadata header */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <span
          className={`${FONTS.data} text-[10px] tracking-widest uppercase`}
          style={{ color: C.red }}
        >
          Specimen {projectNum}
        </span>
        <span
          className={`${FONTS.data} text-[10px]`}
          style={{ color: C.muted }}
        >
          /
        </span>
        <span
          className={`${FONTS.data} text-[10px] tracking-widest uppercase`}
          style={{ color: C.muted }}
        >
          {project.client}
        </span>
        <span
          className={`${FONTS.data} text-[10px]`}
          style={{ color: C.muted }}
        >
          /
        </span>
        <span
          className={`${FONTS.data} text-[10px] tracking-widest uppercase`}
          style={{ color: C.muted }}
        >
          {project.year}
        </span>
      </div>

      {/* Project title in featured font */}
      <h3
        className={`${specimen.font} text-3xl md:text-4xl lg:text-5xl italic mb-2`}
        style={{ color: C.text, lineHeight: 1.1 }}
      >
        {project.title.replace("\n", " ")}
      </h3>

      {/* Typographic metadata line */}
      <div
        className={`${FONTS.data} text-[10px] tracking-widest mb-8`}
        style={{ color: C.muted }}
      >
        Set in {specimen.name} {specimen.style}, {specimen.size}
      </div>

      {/* Paragraph sample with baseline grid */}
      <div className="relative mb-8 max-w-2xl">
        <BaselineGrid lines={6} />
        <p
          className={`${FONTS.body} text-sm md:text-base leading-[24px] relative z-10`}
          style={{ color: C.text }}
        >
          {project.description}
        </p>
      </div>

      {/* Technical detail as secondary sample */}
      <div className="relative mb-8 max-w-2xl">
        <p
          className={`${FONTS.data} text-xs leading-[20px]`}
          style={{ color: C.muted }}
        >
          {project.technical}
        </p>
      </div>

      {/* Tech tags as character set snippet */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
        {project.tech.map((t) => (
          <span
            key={t}
            className={`${FONTS.label} text-xs tracking-widest uppercase`}
            style={{ color: C.text }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* Bottom metadata */}
      <div className="flex flex-wrap items-center gap-4 mt-6">
        <span
          className={`${FONTS.data} text-[10px]`}
          style={{ color: C.muted }}
        >
          font-size: {specimen.size.split("/")[0]}px
        </span>
        <span
          className={`${FONTS.data} text-[10px]`}
          style={{ color: C.muted }}
        >
          line-height: {specimen.size.split("/")[1]}px
        </span>
        <span
          className={`${FONTS.data} text-[10px]`}
          style={{ color: C.muted }}
        >
          tracking: 0
        </span>
        <span
          className={`${FONTS.data} text-[10px]`}
          style={{ color: C.muted }}
        >
          weight: 400
        </span>
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className={`${FONTS.data} text-[10px] underline underline-offset-2 transition-colors hover:text-[#E53935]`}
            style={{ color: C.muted }}
          >
            View Source
          </a>
        )}
      </div>
    </motion.article>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function SpecimenPage() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  return (
    <main
      className="min-h-screen relative"
      style={{ backgroundColor: C.bg, color: C.text }}
    >
      {/* ─── HERO ─── */}
      <header
        ref={heroRef}
        className="relative overflow-hidden px-6 md:px-8"
        style={{ minHeight: "100vh" }}
      >
        {/* Subtle baseline grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage: `repeating-linear-gradient(
              to bottom,
              transparent,
              transparent 23px,
              ${C.grid} 23px,
              ${C.grid} 24px
            )`,
            opacity: 0.4,
          }}
        />

        <div className="max-w-[1100px] mx-auto relative">
          {/* Top bar */}
          <div
            className="flex justify-between items-center pt-8 pb-12 border-b"
            style={{ borderColor: C.grid }}
          >
            <div className={`${FONTS.label} text-xs tracking-[0.3em] uppercase`}>
              Grox Type Foundry
            </div>
            <div
              className={`${FONTS.data} text-[10px] tracking-widest`}
              style={{ color: C.muted }}
            >
              Specimen 001 / 2025
            </div>
          </div>

          {/* Giant display characters with metric lines */}
          <div className="relative mt-12 md:mt-20">
            {/* SVG overlay for metric lines */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <MetricLine y={30} label="Ascender" delay={0.4} />
              <MetricLine y={80} label="Cap Height" delay={0.6} />
              <MetricLine y={180} label="x-height" delay={0.8} />
              <MetricLine y={280} label="Baseline" delay={1.0} />
              <MetricLine y={350} label="Descender" delay={1.2} />
            </svg>

            {/* Giant letterforms */}
            <motion.div
              className={`${FONTS.hero} italic select-none`}
              style={{
                fontSize: "clamp(8rem, 20vw, 20rem)",
                lineHeight: 0.9,
                color: C.text,
                letterSpacing: "-0.03em",
              }}
              initial={{ opacity: 0, y: 60 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              Grox
            </motion.div>

            {/* Smaller secondary display */}
            <motion.div
              className={`${FONTS.section} mt-2`}
              style={{
                fontSize: "clamp(2rem, 5vw, 4.5rem)",
                lineHeight: 1,
                color: C.muted,
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            >
              AI Product Studio
            </motion.div>
          </div>

          {/* Hero stats as typographic data */}
          <motion.div
            className="flex flex-wrap gap-8 md:gap-16 mt-16 md:mt-24 pb-8 border-b"
            style={{ borderColor: C.grid }}
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col">
                <span
                  className={`${FONTS.number} text-4xl md:text-5xl font-semibold`}
                  style={{ color: C.text }}
                >
                  {stat.value}
                </span>
                <span
                  className={`${FONTS.label} text-xs tracking-[0.2em] uppercase mt-1`}
                  style={{ color: C.muted }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Hero description block */}
          <motion.div
            className="max-w-xl mt-12 pb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <p
              className={`${FONTS.body} text-base md:text-lg leading-relaxed`}
              style={{ color: C.muted }}
            >
              A type specimen sheet for the digital age. Each project is presented
              as a typeface sample -- exploring form, weight, and rhythm through
              the lens of AI-powered product development.
            </p>
          </motion.div>
        </div>
      </header>

      {/* ─── WEIGHT SPECTRUM ─── */}
      <Section className="px-6 md:px-8 py-16 md:py-24">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex items-center gap-4 mb-10">
            <span
              className={`${FONTS.data} text-[10px] tracking-[0.3em] uppercase`}
              style={{ color: C.red }}
            >
              Weight Spectrum
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: C.grid }} />
          </div>
          <WeightSpectrum />
        </div>
      </Section>

      {/* ─── CHARACTER SET ─── */}
      <Section className="px-6 md:px-8 py-16 md:py-24">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex items-center gap-4 mb-10">
            <span
              className={`${FONTS.data} text-[10px] tracking-[0.3em] uppercase`}
              style={{ color: C.red }}
            >
              Character Set
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: C.grid }} />
          </div>
          <CharacterSet />
        </div>
      </Section>

      {/* ─── SIZE SCALE ─── */}
      <Section className="px-6 md:px-8 py-16 md:py-24">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex items-center gap-4 mb-10">
            <span
              className={`${FONTS.data} text-[10px] tracking-[0.3em] uppercase`}
              style={{ color: C.red }}
            >
              Size Scale
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: C.grid }} />
          </div>
          <SizeScale />
        </div>
      </Section>

      {/* ─── PROJECTS ─── */}
      <section className="px-6 md:px-8 py-16 md:py-24">
        <div className="max-w-[1100px] mx-auto">
          {/* Section label */}
          <div className="flex items-center gap-4 mb-4">
            <span
              className={`${FONTS.data} text-[10px] tracking-[0.3em] uppercase`}
              style={{ color: C.red }}
            >
              Specimen Collection
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: C.grid }} />
          </div>

          {/* Section header */}
          <div className="mb-16">
            <h2
              className={`${FONTS.section} text-4xl md:text-5xl lg:text-6xl`}
              style={{ color: C.text, lineHeight: 1.1 }}
            >
              10 Typeface Samples
            </h2>
            <p
              className={`${FONTS.body} text-sm md:text-base mt-4 max-w-lg`}
              style={{ color: C.muted }}
            >
              Each project is set in a different typeface at a different scale.
              Observe the interplay of form, counter, and stroke across digital
              specimens.
            </p>
          </div>

          {/* Project cards */}
          {projects.map((project, i) => (
            <ProjectCard key={i} project={project} index={i} />
          ))}
        </div>
      </section>

      {/* ─── EXPERTISE — Type Testing Area ─── */}
      <Section className="px-6 md:px-8 py-16 md:py-24">
        <div className="max-w-[1100px] mx-auto">
          {/* Section label */}
          <div className="flex items-center gap-4 mb-4">
            <span
              className={`${FONTS.data} text-[10px] tracking-[0.3em] uppercase`}
              style={{ color: C.red }}
            >
              Type Testing Area
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: C.grid }} />
          </div>

          <h2
            className={`${FONTS.section} text-4xl md:text-5xl lg:text-6xl mb-16`}
            style={{ color: C.text, lineHeight: 1.1 }}
          >
            Expertise
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {expertise.map((item, i) => {
              const fonts = [FONTS.hero, FONTS.section, FONTS.project, FONTS.label];
              const sizes = [
                "text-2xl md:text-3xl",
                "text-xl md:text-2xl",
                "text-2xl md:text-3xl italic",
                "text-lg md:text-xl",
              ];
              const chosenFont = fonts[i % fonts.length];
              const chosenSize = sizes[i % sizes.length];

              return (
                <ExpertiseCard
                  key={i}
                  item={item}
                  index={i}
                  font={chosenFont}
                  size={chosenSize}
                />
              );
            })}
          </div>
        </div>
      </Section>

      {/* ─── TOOLS ─── */}
      <Section className="px-6 md:px-8 py-16 md:py-24">
        <div className="max-w-[1100px] mx-auto">
          {/* Section label */}
          <div className="flex items-center gap-4 mb-4">
            <span
              className={`${FONTS.data} text-[10px] tracking-[0.3em] uppercase`}
              style={{ color: C.red }}
            >
              Glyph Inventory
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: C.grid }} />
          </div>

          <h2
            className={`${FONTS.section} text-4xl md:text-5xl lg:text-6xl mb-16`}
            style={{ color: C.text, lineHeight: 1.1 }}
          >
            Tools & Technologies
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
            {tools.map((category, i) => (
              <ToolCategory key={i} category={category} index={i} />
            ))}
          </div>
        </div>
      </Section>

      {/* ─── FOOTER — Colophon ─── */}
      <footer
        className="px-6 md:px-8 py-16 md:py-24 border-t"
        style={{ borderColor: C.grid }}
      >
        <div className="max-w-[1100px] mx-auto">
          {/* Section label */}
          <div className="flex items-center gap-4 mb-12">
            <span
              className={`${FONTS.data} text-[10px] tracking-[0.3em] uppercase`}
              style={{ color: C.red }}
            >
              Colophon
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: C.grid }} />
          </div>

          {/* Foundry name */}
          <div className="mb-16">
            <h2
              className={`${FONTS.hero} italic text-5xl md:text-6xl lg:text-7xl`}
              style={{ color: C.text, lineHeight: 1 }}
            >
              Grox
            </h2>
            <p
              className={`${FONTS.label} text-xs tracking-[0.3em] uppercase mt-3`}
              style={{ color: C.muted }}
            >
              Digital Type Foundry & AI Product Studio
            </p>
          </div>

          {/* Colophon details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
            {/* Typefaces Used */}
            <ColophonBlock title="Typefaces Used">
              <ColophonItem label="Display" value="Playfair Display" />
              <ColophonItem label="Headers" value="DM Serif Display" />
              <ColophonItem label="Titles" value="Instrument Serif" />
              <ColophonItem label="Body" value="Inter" />
              <ColophonItem label="Data" value="JetBrains Mono" />
              <ColophonItem label="Labels" value="Space Grotesk" />
              <ColophonItem label="Numbers" value="Sora" />
            </ColophonBlock>

            {/* Available Weights */}
            <ColophonBlock title="Available Weights">
              <ColophonItem label="100" value="Thin" />
              <ColophonItem label="300" value="Light" />
              <ColophonItem label="400" value="Regular" />
              <ColophonItem label="500" value="Medium" />
              <ColophonItem label="600" value="SemiBold" />
              <ColophonItem label="700" value="Bold" />
              <ColophonItem label="800" value="ExtraBold" />
            </ColophonBlock>

            {/* Release Info */}
            <ColophonBlock title="Release Info">
              <ColophonItem label="Version" value="1.0" />
              <ColophonItem label="Released" value="2025" />
              <ColophonItem label="Specimens" value="10" />
              <ColophonItem label="Glyphs" value="500+" />
              <ColophonItem label="Format" value="Digital" />
              <ColophonItem label="Render" value="Next.js 15" />
            </ColophonBlock>

            {/* Licensing */}
            <ColophonBlock title="Licensing">
              <ColophonItem label="Type" value="Open Source" />
              <ColophonItem label="Use" value="Commercial" />
              <ColophonItem label="Platform" value="Web" />
              <ColophonItem label="Embed" value="Allowed" />
              <ColophonItem label="Modify" value="Allowed" />
              <ColophonItem label="Source" value="Google Fonts" />
            </ColophonBlock>
          </div>

          {/* Character set display in footer */}
          <div
            className="border-t pt-10 mb-12"
            style={{ borderColor: C.grid }}
          >
            <p
              className={`${FONTS.hero} text-sm md:text-base tracking-[0.12em] leading-relaxed`}
              style={{ color: C.muted }}
            >
              ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789
            </p>
          </div>

          {/* Bottom bar */}
          <div
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t pt-8"
            style={{ borderColor: C.grid }}
          >
            <span
              className={`${FONTS.data} text-[10px] tracking-widest`}
              style={{ color: C.muted }}
            >
              Designed & Developed by Grox / 2025
            </span>
            <span
              className={`${FONTS.data} text-[10px] tracking-widest`}
              style={{ color: C.muted }}
            >
              Specimen Sheet No. 001
            </span>
          </div>
        </div>
      </footer>

      <ThemeSwitcher current="/specimen" variant="light" />
    </main>
  );
}

/* ─── Expertise Card ─── */
function ExpertiseCard({
  item,
  index,
  font,
  size,
}: {
  item: (typeof expertise)[number];
  index: number;
  font: string;
  size: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const fontMeta = [
    { name: "Playfair Display", style: "Regular", tracking: "0", leading: "1.2" },
    { name: "DM Serif Display", style: "Regular", tracking: "0", leading: "1.3" },
    { name: "Instrument Serif", style: "Italic", tracking: "-0.01em", leading: "1.2" },
    { name: "Space Grotesk", style: "Medium", tracking: "0.02em", leading: "1.4" },
  ];
  const meta = fontMeta[index % fontMeta.length];

  return (
    <motion.div
      ref={ref}
      className="border-t border-l p-6 md:p-8"
      style={{ borderColor: C.grid }}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1 }}
    >
      {/* Metadata header */}
      <div className="flex items-center gap-2 mb-6">
        <span
          className={`${FONTS.data} text-[10px] tracking-widest uppercase`}
          style={{ color: C.red }}
        >
          {meta.name}
        </span>
        <span className={`${FONTS.data} text-[10px]`} style={{ color: C.muted }}>
          {meta.style}
        </span>
      </div>

      {/* Title in featured font */}
      <h3
        className={`${font} ${size} mb-4`}
        style={{ color: C.text, lineHeight: 1.2 }}
      >
        {item.title}
      </h3>

      {/* Body with baseline grid */}
      <div className="relative">
        <BaselineGrid lines={5} />
        <p
          className={`${FONTS.body} text-sm leading-[24px] relative z-10`}
          style={{ color: C.muted }}
        >
          {item.body}
        </p>
      </div>

      {/* Bottom metadata */}
      <div className="flex flex-wrap gap-3 mt-6">
        <span className={`${FONTS.data} text-[9px]`} style={{ color: C.muted }}>
          tracking: {meta.tracking}
        </span>
        <span className={`${FONTS.data} text-[9px]`} style={{ color: C.muted }}>
          leading: {meta.leading}
        </span>
      </div>
    </motion.div>
  );
}

/* ─── Tool Category ─── */
function ToolCategory({
  category,
  index,
}: {
  category: (typeof tools)[number];
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className="border-t border-l p-6 md:p-8"
      style={{ borderColor: C.grid }}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08 }}
    >
      {/* Category label */}
      <div className="flex items-center gap-2 mb-4">
        <span
          className={`${FONTS.label} text-xs tracking-[0.2em] uppercase font-medium`}
          style={{ color: C.red }}
        >
          {category.label}
        </span>
        <span
          className={`${FONTS.data} text-[10px]`}
          style={{ color: C.muted }}
        >
          ({category.items.length})
        </span>
      </div>

      {/* Items as character set */}
      <div className="space-y-2">
        {category.items.map((item, i) => (
          <motion.div
            key={item}
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -10 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4, delay: index * 0.08 + i * 0.05 }}
          >
            <span
              className={`${FONTS.data} text-[10px] w-4 text-right`}
              style={{ color: C.muted }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              className={`${FONTS.body} text-sm`}
              style={{ color: C.text }}
            >
              {item}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Decorative glyph */}
      <div
        className={`${FONTS.hero} text-5xl mt-4 select-none`}
        style={{ color: C.text, opacity: 0.04 }}
        aria-hidden="true"
      >
        {category.label.charAt(0)}
      </div>
    </motion.div>
  );
}

/* ─── Colophon Block ─── */
function ColophonBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3
        className={`${FONTS.label} text-xs tracking-[0.2em] uppercase font-medium mb-4`}
        style={{ color: C.red }}
      >
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

/* ─── Colophon Item ─── */
function ColophonItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span
        className={`${FONTS.data} text-[10px] tracking-widest`}
        style={{ color: C.muted }}
      >
        {label}
      </span>
      <span
        className="flex-1 border-b border-dotted"
        style={{ borderColor: C.grid }}
      />
      <span
        className={`${FONTS.data} text-[10px]`}
        style={{ color: C.text }}
      >
        {value}
      </span>
    </div>
  );
}
