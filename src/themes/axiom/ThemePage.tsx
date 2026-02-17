"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "@/app/data/projects";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";
import { getProjectImage } from "@/lib/theme-images";

/* ═══════════════════════════════════════════════════════════ */
/*  AXIOM THEME — Mathematical First Principles               */
/* ═══════════════════════════════════════════════════════════ */

/* ────────────── Color Palette ────────────── */
const CHALK = "#FAFBFE";
const PROOF_BLUE = "#1848CC";
const GOLDEN = "#D4A843";
const GRAPHITE = "#3C3C46";
const RED_PROOF = "#CC3344";
const NOTATION = "#2A2A35";
const CONSTRUCTION = "#8E8EA0";
const BLUE_FAINT = "rgba(24,72,204,0.06)";
const CONSTRUCTION_LINE = "rgba(142,142,160,0.20)";
const GOLDEN_FAINT = "rgba(212,168,67,0.15)";

/* ────────────── Mathematical Symbols ────────────── */
const SYMBOLS = ["∑", "∫", "∂", "φ", "π", "∇", "∞", "λ", "Δ", "Ω"];

/* ────────────── Scroll-reveal Section ────────────── */
function Section({
  children,
  className = "",
  id,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ────────────── Golden Ratio Spiral SVG ────────────── */
function GoldenSpiral({ size = 500 }: { size?: number }) {
  /* Fibonacci spiral built from quarter-circle arcs */
  const fibSequence = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55];
  const scale = size / 144;

  /* Build the spiral path from Fibonacci quarter-arcs */
  let x = 0;
  let y = 0;
  let path = `M ${0} ${0}`;

  /* Each arc sweeps a quarter-circle with radius = fib number */
  const arcs = [
    { dx: 1, dy: 0, sx: 0, sy: -1 },  /* right */
    { dx: 0, dy: 1, sx: 1, sy: 0 },   /* down */
    { dx: -1, dy: 0, sx: 0, sy: 1 },  /* left */
    { dx: 0, dy: -1, sx: -1, sy: 0 }, /* up */
  ];

  for (let i = 0; i < 8; i++) {
    const r = fibSequence[i] * scale;
    const dir = arcs[i % 4];
    const ex = x + dir.dx * r;
    const ey = y + dir.dy * r;
    path += ` A ${r} ${r} 0 0 1 ${ex} ${ey}`;
    x = ex;
    y = ey;
  }

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox={`-${size * 0.1} -${size * 0.5} ${size * 1.2} ${size * 1.2}`}
      fill="none"
      className="absolute pointer-events-none"
      style={{ right: "-5%", top: "50%", transform: "translateY(-50%)" }}
    >
      <motion.path
        d={path}
        stroke={GOLDEN}
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.6 }}
        transition={{ duration: 2.5, ease: "easeInOut", delay: 0.3 }}
      />
    </motion.svg>
  );
}

/* ────────────── Construction Grid Background ────────────── */
function ConstructionGrid() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern
          id="axiom-grid"
          width="80"
          height="80"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 80 0 L 0 0 0 80"
            fill="none"
            stroke={CONSTRUCTION_LINE}
            strokeWidth="0.5"
          />
        </pattern>
        <pattern
          id="axiom-grid-fine"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 20 0 L 0 0 0 20"
            fill="none"
            stroke={CONSTRUCTION_LINE}
            strokeWidth="0.25"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#axiom-grid-fine)" opacity={0.4} />
      <rect width="100%" height="100%" fill="url(#axiom-grid)" opacity={0.6} />
      {/* Diagonal construction lines */}
      <line x1="0" y1="0" x2="100%" y2="100%" stroke={CONSTRUCTION_LINE} strokeWidth="0.5" opacity={0.3} />
      <line x1="100%" y1="0" x2="0" y2="100%" stroke={CONSTRUCTION_LINE} strokeWidth="0.5" opacity={0.3} />
    </svg>
  );
}

/* ────────────── Angle Marker SVG ────────────── */
function AngleMarker({
  corner = "tl",
  color = PROOF_BLUE,
}: {
  corner?: "tl" | "tr" | "bl" | "br";
  color?: string;
}) {
  const rotations = { tl: "0", tr: "90", br: "180", bl: "270" };
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      className={`absolute ${
        corner === "tl" ? "top-2 left-2" :
        corner === "tr" ? "top-2 right-2" :
        corner === "bl" ? "bottom-2 left-2" :
        "bottom-2 right-2"
      }`}
      style={{ transform: `rotate(${rotations[corner]}deg)` }}
    >
      <path
        d="M 0 12 L 0 0 L 12 0"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity={0.4}
      />
      <path
        d="M 0 6 A 6 6 0 0 0 6 0"
        fill="none"
        stroke={color}
        strokeWidth="0.75"
        opacity={0.3}
      />
    </svg>
  );
}

/* ────────────── QED Marker ────────────── */
function QED({ delay = 0 }: { delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.4, delay: delay + 0.4, ease: "easeOut" }}
      className="inline-block w-3 h-3 ml-2"
      style={{ backgroundColor: PROOF_BLUE }}
      aria-label="Q.E.D."
    />
  );
}

/* ────────────── Floating Math Symbols ────────────── */
function FloatingSymbols() {
  const positions = [
    { symbol: "∑", x: "8%", y: "15%", size: "2.5rem", color: CONSTRUCTION, opacity: 0.15 },
    { symbol: "∫", x: "85%", y: "25%", size: "3rem", color: GOLDEN, opacity: 0.12 },
    { symbol: "∂", x: "92%", y: "60%", size: "2rem", color: CONSTRUCTION, opacity: 0.1 },
    { symbol: "φ", x: "5%", y: "70%", size: "2.8rem", color: GOLDEN, opacity: 0.14 },
    { symbol: "π", x: "15%", y: "45%", size: "2rem", color: CONSTRUCTION, opacity: 0.08 },
    { symbol: "∇", x: "78%", y: "80%", size: "2.2rem", color: CONSTRUCTION, opacity: 0.1 },
    { symbol: "λ", x: "50%", y: "10%", size: "1.8rem", color: GOLDEN, opacity: 0.1 },
    { symbol: "Δ", x: "70%", y: "45%", size: "2rem", color: CONSTRUCTION, opacity: 0.08 },
  ];

  return (
    <>
      {positions.map((p, i) => (
        <motion.span
          key={i}
          className="absolute pointer-events-none select-none font-[family-name:var(--font-jetbrains)]"
          style={{
            left: p.x,
            top: p.y,
            fontSize: p.size,
            color: p.color,
            opacity: 0,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: p.opacity, y: 0 }}
          transition={{ duration: 1.5, delay: 0.5 + i * 0.15, ease: "easeOut" }}
        >
          {p.symbol}
        </motion.span>
      ))}
    </>
  );
}

/* ────────────── Coordinate Axis Labels ────────────── */
function AxisLabels() {
  return (
    <>
      {/* Y-axis labels along left edge */}
      <div className="fixed left-3 top-0 h-full z-10 pointer-events-none hidden lg:flex flex-col justify-between py-20">
        {["0", "1", "2", "3", "4", "5"].map((label, i) => (
          <motion.span
            key={label}
            className="font-[family-name:var(--font-jetbrains)] text-[10px]"
            style={{ color: CONSTRUCTION, opacity: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            transition={{ delay: 1 + i * 0.1, duration: 0.6 }}
          >
            y={label}
          </motion.span>
        ))}
      </div>
      {/* X-axis labels along top edge */}
      <div className="fixed top-3 left-0 w-full z-10 pointer-events-none hidden lg:flex flex-row justify-between px-20">
        {["0", "1", "2", "3", "4"].map((label, i) => (
          <motion.span
            key={label}
            className="font-[family-name:var(--font-jetbrains)] text-[10px]"
            style={{ color: CONSTRUCTION, opacity: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            transition={{ delay: 1.2 + i * 0.1, duration: 0.6 }}
          >
            x={label}
          </motion.span>
        ))}
      </div>
    </>
  );
}

/* ────────────── Theorem Project Card ────────────── */
function TheoremCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: (index % 2) * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <a
        href={project.github}
        target="_blank"
        rel="noopener noreferrer"
        className="group block relative p-8 md:p-10 transition-all duration-500"
        style={{
          backgroundColor: "rgba(250,251,254,0.7)",
          border: `1px solid ${CONSTRUCTION_LINE}`,
          borderLeft: `2px solid ${PROOF_BLUE}`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = GOLDEN;
          e.currentTarget.style.borderLeftColor = GOLDEN;
          e.currentTarget.style.backgroundColor = "rgba(212,168,67,0.03)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = CONSTRUCTION_LINE;
          e.currentTarget.style.borderLeftColor = PROOF_BLUE;
          e.currentTarget.style.backgroundColor = "rgba(250,251,254,0.7)";
        }}
      >
        {/* Angle markers */}
        <AngleMarker corner="tl" color={PROOF_BLUE} />
        <AngleMarker corner="br" color={PROOF_BLUE} />

        {/* Theorem header */}
        <div className="flex items-baseline gap-4 mb-6">
          <span
            className="font-[family-name:var(--font-jetbrains)] text-xs tracking-[0.2em] uppercase"
            style={{ color: PROOF_BLUE }}
          >
            Theorem {index + 1}
          </span>
          <span
            className="font-[family-name:var(--font-jetbrains)] text-[10px]"
            style={{ color: CONSTRUCTION }}
          >
            {project.client} &middot; {project.year}
          </span>
        </div>

        {/* Project image */}
        <div
          className="mb-6 overflow-hidden"
          style={{ border: `1px solid ${CONSTRUCTION_LINE}` }}
        >
          <img
            src={getProjectImage("axiom", project.image)}
            alt={project.title.replace(/\n/g, " ")}
            loading="lazy"
            className="w-full block transition-transform duration-700 group-hover:scale-[1.02]"
            style={{
              aspectRatio: "16/9",
              objectFit: "cover",
              filter: "saturate(0.85) contrast(1.05)",
            }}
          />
        </div>

        {/* Theorem statement (title) */}
        <h3
          className="font-[family-name:var(--font-instrument)] text-2xl md:text-3xl leading-tight mb-4"
          style={{ color: NOTATION }}
        >
          {project.title.replace(/\n/g, " ")}
        </h3>

        {/* Proposition (description) */}
        <p
          className="font-[family-name:var(--font-inter)] text-sm leading-relaxed mb-5"
          style={{ color: GRAPHITE, lineHeight: 1.75 }}
        >
          {project.description}
        </p>

        {/* Proof section */}
        <div className="mb-5">
          <span
            className="font-[family-name:var(--font-jetbrains)] text-xs tracking-wider italic mb-2 block"
            style={{ color: PROOF_BLUE }}
          >
            Proof:
          </span>
          <p
            className="font-[family-name:var(--font-inter)] text-xs leading-relaxed"
            style={{ color: CONSTRUCTION, lineHeight: 1.8 }}
          >
            {project.technical}
          </p>
        </div>

        {/* Lemmas (tech tags) */}
        <div className="flex flex-wrap gap-2 mb-5">
          {project.tech.map((t, i) => (
            <span
              key={t}
              className="font-[family-name:var(--font-jetbrains)] text-[10px] px-3 py-1 tracking-wider"
              style={{
                color: PROOF_BLUE,
                backgroundColor: BLUE_FAINT,
                border: `1px solid rgba(24,72,204,0.12)`,
              }}
            >
              Lemma {String.fromCharCode(65 + i)}: {t}
            </span>
          ))}
        </div>

        {/* Footer: See proof + QED */}
        <div className="flex items-center justify-between">
          <span
            className="font-[family-name:var(--font-jetbrains)] text-xs tracking-wider transition-colors duration-300 group-hover:underline"
            style={{ color: GOLDEN }}
          >
            See proof &rarr;
          </span>
          <QED delay={(index % 2) * 0.12} />
        </div>
      </a>
    </motion.div>
  );
}

/* ────────────── Proof Step Card ────────────── */
function ProofStep({
  item,
  index,
  total,
}: {
  item: (typeof expertise)[0];
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative pl-10 md:pl-14"
    >
      {/* Vertical proof chain line */}
      {index < total - 1 && (
        <div
          className="absolute left-[15px] md:left-[23px] top-8 bottom-0 w-[1px]"
          style={{ backgroundColor: CONSTRUCTION_LINE }}
        />
      )}

      {/* Step dot with construction mark */}
      <div className="absolute left-0 md:left-2 top-1 flex items-center justify-center">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center"
          style={{
            border: `1.5px solid ${PROOF_BLUE}`,
            backgroundColor: CHALK,
          }}
        >
          <span
            className="font-[family-name:var(--font-jetbrains)] text-[10px] font-medium"
            style={{ color: PROOF_BLUE }}
          >
            {index + 1}
          </span>
        </div>
        {/* Small angle construction mark */}
        <svg
          width="8"
          height="8"
          viewBox="0 0 8 8"
          className="absolute -right-2 -top-1"
        >
          <path
            d="M 0 8 L 0 0 L 8 0"
            fill="none"
            stroke={GOLDEN}
            strokeWidth="0.75"
            opacity={0.4}
          />
        </svg>
      </div>

      {/* Step content */}
      <div className="pb-10">
        <span
          className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[0.2em] uppercase block mb-2"
          style={{ color: CONSTRUCTION }}
        >
          Step {index + 1}
        </span>
        <h3
          className="font-[family-name:var(--font-instrument)] text-xl md:text-2xl mb-3"
          style={{ color: NOTATION }}
        >
          {item.title}
        </h3>
        <p
          className="font-[family-name:var(--font-inter)] text-sm leading-relaxed"
          style={{ color: GRAPHITE, lineHeight: 1.75 }}
        >
          {item.body}
        </p>
        {/* Midpoint marker */}
        <svg width="6" height="6" viewBox="0 0 6 6" className="mt-4">
          <circle cx="3" cy="3" r="2" fill="none" stroke={GOLDEN} strokeWidth="1" opacity={0.4} />
          <circle cx="3" cy="3" r="0.75" fill={GOLDEN} opacity={0.5} />
        </svg>
      </div>
    </motion.div>
  );
}

/* ────────────── Coordinate Grid Tool Group ────────────── */
function ToolGroup({
  group,
  index,
}: {
  group: (typeof tools)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative p-6"
      style={{
        backgroundColor: "rgba(250,251,254,0.5)",
        border: `1px solid ${CONSTRUCTION_LINE}`,
      }}
    >
      {/* Faint coordinate grid background */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id={`tool-grid-${index}`}
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke={CONSTRUCTION_LINE}
              strokeWidth="0.3"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#tool-grid-${index})`} opacity={0.5} />
      </svg>

      {/* Axis label */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <span
            className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[0.2em] uppercase"
            style={{ color: PROOF_BLUE }}
          >
            {group.label}
          </span>
          <div className="flex-1 h-[1px]" style={{ backgroundColor: CONSTRUCTION_LINE }} />
          <span
            className="font-[family-name:var(--font-jetbrains)] text-[10px]"
            style={{ color: CONSTRUCTION }}
          >
            ({group.items.length})
          </span>
        </div>

        {/* Data points */}
        <div className="flex flex-wrap gap-2">
          {group.items.map((item, i) => (
            <span
              key={item}
              className="font-[family-name:var(--font-jetbrains)] text-xs px-3 py-1.5"
              style={{
                color: GRAPHITE,
                backgroundColor: CHALK,
                border: `1px solid ${CONSTRUCTION_LINE}`,
              }}
            >
              <span style={{ color: GOLDEN, marginRight: "6px", fontSize: "10px" }}>
                ({index},{i})
              </span>
              {item}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*  MAIN PAGE COMPONENT                                       */
/* ═══════════════════════════════════════════════════════════ */

export default function AxiomPage() {
  return (
    <div
      className="relative min-h-screen font-[family-name:var(--font-inter)]"
      style={{ backgroundColor: CHALK, color: NOTATION }}
    >
      {/* Coordinate axis labels */}
      <AxisLabels />

      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Construction grid background */}
        <ConstructionGrid />

        {/* Floating mathematical symbols */}
        <FloatingSymbols />

        {/* Golden ratio spiral */}
        <GoldenSpiral size={480} />

        {/* Hero content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 lg:px-20 py-32">
          {/* Labeled point A */}
          <motion.div
            className="flex items-center gap-2 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="3" fill="none" stroke={PROOF_BLUE} strokeWidth="1.5" />
              <circle cx="10" cy="10" r="1" fill={PROOF_BLUE} />
            </svg>
            <span
              className="font-[family-name:var(--font-jetbrains)] text-xs tracking-widest"
              style={{ color: CONSTRUCTION }}
            >
              POINT A &mdash; ORIGIN
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="font-[family-name:var(--font-instrument)] text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.9] mb-8"
            style={{ color: PROOF_BLUE }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            First
            <br />
            Principles
          </motion.h1>

          {/* Subtitle notation */}
          <motion.div
            className="flex items-center gap-3 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <div className="h-[1px] w-12" style={{ backgroundColor: GOLDEN }} />
            <p
              className="font-[family-name:var(--font-inter)] text-base md:text-lg max-w-lg"
              style={{ color: GRAPHITE, lineHeight: 1.6 }}
            >
              Building digital products from axioms.
              <br />
              Every decision grounded in logic and precision.
            </p>
          </motion.div>

          {/* Stats as "Given:" axiom statements */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              className="font-[family-name:var(--font-jetbrains)] text-xs tracking-[0.25em] uppercase block mb-4"
              style={{ color: PROOF_BLUE }}
            >
              Given:
            </span>
            {stats.map((stat, i) => (
              <div key={i} className="flex items-baseline gap-3">
                <span
                  className="font-[family-name:var(--font-jetbrains)] text-xs"
                  style={{ color: CONSTRUCTION }}
                >
                  ({String.fromCharCode(105 + i)})
                </span>
                <span
                  className="font-[family-name:var(--font-jetbrains)] text-2xl md:text-3xl font-medium"
                  style={{ color: NOTATION }}
                >
                  {stat.value}
                </span>
                <span
                  className="font-[family-name:var(--font-inter)] text-sm"
                  style={{ color: GRAPHITE }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Connection line to next section */}
          <motion.div
            className="mt-16 flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 1.5, duration: 1 }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="3" fill="none" stroke={CONSTRUCTION} strokeWidth="1" />
              <circle cx="10" cy="10" r="1" fill={CONSTRUCTION} />
            </svg>
            <div className="h-[1px] w-16" style={{ backgroundColor: CONSTRUCTION_LINE }} />
            <span
              className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-widest"
              style={{ color: CONSTRUCTION }}
            >
              POINT B &mdash; THEOREMS
            </span>
          </motion.div>
        </div>
      </section>

      {/* ─── PROJECTS SECTION (Numbered Theorems) ─── */}
      <Section id="theorems" className="relative py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20">
          {/* Section header */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <svg width="20" height="20" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="3" fill="none" stroke={PROOF_BLUE} strokeWidth="1.5" />
                <circle cx="10" cy="10" r="1" fill={PROOF_BLUE} />
              </svg>
              <span
                className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-widest"
                style={{ color: CONSTRUCTION }}
              >
                POINT B &mdash; THEOREMS
              </span>
            </div>
            <h2
              className="font-[family-name:var(--font-instrument)] text-4xl md:text-5xl lg:text-6xl mb-4"
              style={{ color: NOTATION }}
            >
              Theorems &amp; Proofs
            </h2>
            <div className="flex items-center gap-3">
              <div className="h-[1px] w-12" style={{ backgroundColor: GOLDEN }} />
              <p
                className="font-[family-name:var(--font-inter)] text-sm"
                style={{ color: GRAPHITE }}
              >
                Each project as a formal proof, from hypothesis through verification.
              </p>
            </div>
          </div>

          {/* Thin horizontal construction line */}
          <div
            className="h-[1px] w-full mb-12"
            style={{ backgroundColor: CONSTRUCTION_LINE }}
          />

          {/* Project cards grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <TheoremCard key={index} project={project} index={index} />
            ))}
          </div>
        </div>
      </Section>

      {/* ─── EXPERTISE SECTION (Proof Steps) ─── */}
      <Section id="proof-steps" className="relative py-24 md:py-32">
        {/* Faint diagonal construction lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          <line x1="0" y1="0" x2="40%" y2="100%" stroke={CONSTRUCTION_LINE} strokeWidth="0.5" opacity={0.2} />
          <line x1="60%" y1="0" x2="100%" y2="100%" stroke={CONSTRUCTION_LINE} strokeWidth="0.5" opacity={0.2} />
        </svg>

        <div className="relative max-w-4xl mx-auto px-6 md:px-12 lg:px-20">
          {/* Section header */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <svg width="20" height="20" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="3" fill="none" stroke={PROOF_BLUE} strokeWidth="1.5" />
                <circle cx="10" cy="10" r="1" fill={PROOF_BLUE} />
              </svg>
              <span
                className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-widest"
                style={{ color: CONSTRUCTION }}
              >
                POINT C &mdash; METHODOLOGY
              </span>
            </div>
            <h2
              className="font-[family-name:var(--font-instrument)] text-4xl md:text-5xl lg:text-6xl mb-4"
              style={{ color: NOTATION }}
            >
              Proof Steps
            </h2>
            <div className="flex items-center gap-3">
              <div className="h-[1px] w-12" style={{ backgroundColor: GOLDEN }} />
              <p
                className="font-[family-name:var(--font-inter)] text-sm"
                style={{ color: GRAPHITE }}
              >
                Sequential methodology, each step building on the last.
              </p>
            </div>
          </div>

          {/* Horizontal rule */}
          <div
            className="h-[1px] w-full mb-12"
            style={{ backgroundColor: CONSTRUCTION_LINE }}
          />

          {/* Proof steps */}
          <div>
            {expertise.map((item, index) => (
              <ProofStep
                key={index}
                item={item}
                index={index}
                total={expertise.length}
              />
            ))}
          </div>

          {/* Therefore conclusion */}
          <motion.div
            className="mt-4 pl-10 md:pl-14 flex items-center gap-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <span
              className="font-[family-name:var(--font-jetbrains)] text-lg"
              style={{ color: PROOF_BLUE }}
            >
              &there4;
            </span>
            <span
              className="font-[family-name:var(--font-inter)] text-sm italic"
              style={{ color: GRAPHITE }}
            >
              Full-stack AI engineering, proven.
            </span>
            <QED delay={0.6} />
          </motion.div>
        </div>
      </Section>

      {/* ─── TOOLS SECTION (Coordinate System Grid) ─── */}
      <Section id="coordinates" className="relative py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20">
          {/* Section header */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <svg width="20" height="20" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="3" fill="none" stroke={PROOF_BLUE} strokeWidth="1.5" />
                <circle cx="10" cy="10" r="1" fill={PROOF_BLUE} />
              </svg>
              <span
                className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-widest"
                style={{ color: CONSTRUCTION }}
              >
                POINT D &mdash; COORDINATE SPACE
              </span>
            </div>
            <h2
              className="font-[family-name:var(--font-instrument)] text-4xl md:text-5xl lg:text-6xl mb-4"
              style={{ color: NOTATION }}
            >
              Tool Set
            </h2>
            <div className="flex items-center gap-3">
              <div className="h-[1px] w-12" style={{ backgroundColor: GOLDEN }} />
              <p
                className="font-[family-name:var(--font-inter)] text-sm"
                style={{ color: GRAPHITE }}
              >
                Coordinates in the solution space. Each axis a domain, each point a tool.
              </p>
            </div>
          </div>

          {/* Horizontal construction line */}
          <div
            className="h-[1px] w-full mb-12"
            style={{ backgroundColor: CONSTRUCTION_LINE }}
          />

          {/* Tool grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((group, index) => (
              <ToolGroup key={index} group={group} index={index} />
            ))}
          </div>

          {/* Dimension summary */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <span
              className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-wider"
              style={{ color: CONSTRUCTION }}
            >
              {tools.length} axes
            </span>
            <span style={{ color: CONSTRUCTION_LINE }}>&middot;</span>
            <span
              className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-wider"
              style={{ color: CONSTRUCTION }}
            >
              {tools.reduce((sum, g) => sum + g.items.length, 0)} data points
            </span>
            <span style={{ color: CONSTRUCTION_LINE }}>&middot;</span>
            <span
              className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-wider"
              style={{ color: CONSTRUCTION }}
            >
              &infin; solutions
            </span>
          </div>
        </div>
      </Section>

      {/* ─── FOOTER (Q.E.D.) ─── */}
      <footer className="relative py-24 md:py-32 border-t" style={{ borderColor: CONSTRUCTION_LINE }}>
        {/* Faint grid background */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          <defs>
            <pattern id="footer-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke={CONSTRUCTION_LINE} strokeWidth="0.25" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-grid)" opacity={0.3} />
        </svg>

        <div className="relative max-w-6xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            {/* Left: Q.E.D. closing */}
            <div>
              {/* Labeled point E */}
              <div className="flex items-center gap-3 mb-8">
                <svg width="20" height="20" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="3" fill="none" stroke={PROOF_BLUE} strokeWidth="1.5" />
                  <circle cx="10" cy="10" r="1" fill={PROOF_BLUE} />
                </svg>
                <span
                  className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-widest"
                  style={{ color: CONSTRUCTION }}
                >
                  POINT E &mdash; CONCLUSION
                </span>
              </div>

              <h2
                className="font-[family-name:var(--font-instrument)] text-6xl md:text-7xl lg:text-8xl mb-6"
                style={{ color: PROOF_BLUE }}
              >
                Q.E.D.
              </h2>
              <p
                className="font-[family-name:var(--font-inter)] text-sm mb-6 max-w-sm"
                style={{ color: GRAPHITE, lineHeight: 1.75 }}
              >
                Quod erat demonstrandum. The proof is complete.
                <br />
                From axioms to implementation, rigorous at every step.
              </p>

              {/* Small golden ratio spiral decoration */}
              <svg width="80" height="80" viewBox="-10 -40 100 100" fill="none" className="mt-4 opacity-40">
                <motion.path
                  d={`M 0 0 A 3.5 3.5 0 0 1 3.5 0 A 3.5 3.5 0 0 1 3.5 3.5 A 7 7 0 0 1 -3.5 3.5 A 10.5 10.5 0 0 1 -3.5 -7 A 17.5 17.5 0 0 1 14 -7 A 28 28 0 0 1 14 21 A 45.5 45.5 0 0 1 -31.5 21`}
                  stroke={GOLDEN}
                  strokeWidth={1.5}
                  fill="none"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
              </svg>
            </div>

            {/* Right: Correspondence (contact) */}
            <div>
              <span
                className="font-[family-name:var(--font-jetbrains)] text-xs tracking-[0.2em] uppercase block mb-6"
                style={{ color: PROOF_BLUE }}
              >
                Correspondence
              </span>

              <div className="space-y-4 mb-10">
                <a
                  href="mailto:hello@example.com"
                  className="group flex items-center gap-3 transition-colors duration-300"
                  style={{ color: GRAPHITE }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = PROOF_BLUE)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = GRAPHITE)}
                >
                  <span
                    className="font-[family-name:var(--font-jetbrains)] text-[10px]"
                    style={{ color: CONSTRUCTION }}
                  >
                    (a)
                  </span>
                  <span className="font-[family-name:var(--font-inter)] text-sm">
                    Email &rarr;
                  </span>
                </a>
                <a
                  href="https://github.com/1aday"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 transition-colors duration-300"
                  style={{ color: GRAPHITE }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = PROOF_BLUE)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = GRAPHITE)}
                >
                  <span
                    className="font-[family-name:var(--font-jetbrains)] text-[10px]"
                    style={{ color: CONSTRUCTION }}
                  >
                    (b)
                  </span>
                  <span className="font-[family-name:var(--font-inter)] text-sm">
                    GitHub &rarr;
                  </span>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 transition-colors duration-300"
                  style={{ color: GRAPHITE }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = PROOF_BLUE)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = GRAPHITE)}
                >
                  <span
                    className="font-[family-name:var(--font-jetbrains)] text-[10px]"
                    style={{ color: CONSTRUCTION }}
                  >
                    (c)
                  </span>
                  <span className="font-[family-name:var(--font-inter)] text-sm">
                    LinkedIn &rarr;
                  </span>
                </a>
              </div>

              {/* Mathematical closing notation */}
              <div
                className="p-5"
                style={{
                  border: `1px solid ${CONSTRUCTION_LINE}`,
                  backgroundColor: "rgba(250,251,254,0.5)",
                }}
              >
                <p
                  className="font-[family-name:var(--font-jetbrains)] text-xs leading-relaxed"
                  style={{ color: CONSTRUCTION }}
                >
                  <span style={{ color: GOLDEN }}>Definition.</span> Let{" "}
                  <span style={{ color: PROOF_BLUE }}>f</span> : Ideas &rarr; Products be a
                  continuous mapping. Then for all{" "}
                  <span style={{ color: PROOF_BLUE }}>x</span> &isin; Requirements,{" "}
                  <span style={{ color: PROOF_BLUE }}>f</span>(x) converges to an optimal
                  solution.
                </p>
                <div className="flex justify-end mt-3">
                  <span
                    className="inline-block w-2.5 h-2.5"
                    style={{ backgroundColor: PROOF_BLUE }}
                  />
                </div>
              </div>

              {/* Copyright */}
              <p
                className="font-[family-name:var(--font-jetbrains)] text-[10px] mt-8 tracking-wider"
                style={{ color: CONSTRUCTION }}
              >
                &copy; {new Date().getFullYear()} &middot; All rights reserved &middot;
                Built from first principles
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Theme Switcher */}
      <ThemeSwitcher current="/axiom" variant="light" />
    </div>
  );
}