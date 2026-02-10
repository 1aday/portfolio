"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";

/* ═══════════════════════════════════════════════════════════ */
/*  BLUEPRINT THEME — Architectural Technical Drawing         */
/* ═══════════════════════════════════════════════════════════ */

/* ────────────── Color Palette ────────────── */
const BG = "#0A1628";
const CYAN = "#4FC3F7";
const CYAN_DIM = "rgba(79,195,247,0.35)";
const CYAN_FAINT = "rgba(79,195,247,0.08)";
const CYAN_LINE = "rgba(79,195,247,0.15)";
const WHITE = "#E8F0FE";
const WHITE_DIM = "rgba(232,240,254,0.5)";
const RED = "#EF5350";
const RED_DIM = "rgba(239,83,80,0.6)";

/* ────────────── Section Labels ────────────── */
const sectionLabels = [
  "DETAIL A",
  "SECTION B-B",
  "ELEVATION C",
  "PLAN VIEW D",
  "DETAIL E",
  "SECTION F-F",
];

/* ────────────── Scroll-reveal Section Wrapper ────────────── */
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
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ────────────── Dimension Line Component ────────────── */
function DimensionLine({
  label,
  width = "100%",
  color = CYAN,
}: {
  label: string;
  width?: string;
  color?: string;
}) {
  return (
    <div className="flex items-center gap-0" style={{ width }}>
      {/* Left arrow */}
      <div
        style={{
          width: 0,
          height: 0,
          borderTop: "4px solid transparent",
          borderBottom: "4px solid transparent",
          borderRight: `6px solid ${color}`,
          flexShrink: 0,
        }}
      />
      {/* Line */}
      <div
        className="flex-1 relative"
        style={{ height: 1, background: color }}
      >
        {/* Center label */}
        <span
          className="absolute left-1/2 -translate-x-1/2 -top-3 text-[9px] font-[family-name:var(--font-jetbrains)] tracking-wider whitespace-nowrap px-1"
          style={{ color, background: BG }}
        >
          {label}
        </span>
      </div>
      {/* Right arrow */}
      <div
        style={{
          width: 0,
          height: 0,
          borderTop: "4px solid transparent",
          borderBottom: "4px solid transparent",
          borderLeft: `6px solid ${color}`,
          flexShrink: 0,
        }}
      />
    </div>
  );
}

/* ────────────── Technical Callout Label ────────────── */
function CalloutLabel({
  label,
  position = "top-left",
}: {
  label: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}) {
  const positionStyles: Record<string, React.CSSProperties> = {
    "top-left": { top: -10, left: 12 },
    "top-right": { top: -10, right: 12 },
    "bottom-left": { bottom: -10, left: 12 },
    "bottom-right": { bottom: -10, right: 12 },
  };

  return (
    <span
      className="absolute text-[9px] font-[family-name:var(--font-jetbrains)] tracking-[0.2em] px-2 py-0.5 z-10"
      style={{
        color: RED,
        background: BG,
        border: `1px solid ${RED_DIM}`,
        ...positionStyles[position],
      }}
    >
      {label}
    </span>
  );
}

/* ────────────── North Arrow ────────────── */
function NorthArrow() {
  return (
    <svg
      width="40"
      height="60"
      viewBox="0 0 40 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line x1="20" y1="55" x2="20" y2="8" stroke={CYAN} strokeWidth="1" />
      <polygon points="20,2 14,14 20,10 26,14" fill={CYAN} />
      <text
        x="20"
        y="6"
        textAnchor="middle"
        fill={WHITE}
        fontSize="9"
        fontFamily="monospace"
        fontWeight="bold"
      >
        N
      </text>
      <circle cx="20" cy="38" r="8" stroke={CYAN_DIM} strokeWidth="0.5" fill="none" />
      <line x1="12" y1="38" x2="28" y2="38" stroke={CYAN_DIM} strokeWidth="0.5" />
      <line x1="20" y1="30" x2="20" y2="46" stroke={CYAN_DIM} strokeWidth="0.5" />
    </svg>
  );
}

/* ────────────── Drawing Stamp / Cartouche ────────────── */
function Cartouche() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 1.2, delay: 0.3 }}
      className="font-[family-name:var(--font-jetbrains)]"
      style={{
        border: `1px solid ${CYAN}`,
        maxWidth: 340,
        fontSize: 10,
      }}
    >
      {/* Title block rows */}
      <div
        className="flex"
        style={{ borderBottom: `1px solid ${CYAN_DIM}` }}
      >
        <div
          className="px-3 py-2 flex-1"
          style={{ borderRight: `1px solid ${CYAN_DIM}` }}
        >
          <div style={{ color: CYAN_DIM }} className="text-[8px] tracking-widest mb-0.5">
            PROJECT
          </div>
          <div style={{ color: WHITE }} className="tracking-wider">
            GROX AI PORTFOLIO
          </div>
        </div>
        <div className="px-3 py-2" style={{ minWidth: 90 }}>
          <div style={{ color: CYAN_DIM }} className="text-[8px] tracking-widest mb-0.5">
            SHEET
          </div>
          <div style={{ color: WHITE }} className="tracking-wider">
            01 OF 01
          </div>
        </div>
      </div>
      <div
        className="flex"
        style={{ borderBottom: `1px solid ${CYAN_DIM}` }}
      >
        <div
          className="px-3 py-2 flex-1"
          style={{ borderRight: `1px solid ${CYAN_DIM}` }}
        >
          <div style={{ color: CYAN_DIM }} className="text-[8px] tracking-widest mb-0.5">
            DRAWN BY
          </div>
          <div style={{ color: WHITE }} className="tracking-wider">
            GROX
          </div>
        </div>
        <div
          className="px-3 py-2 flex-1"
          style={{ borderRight: `1px solid ${CYAN_DIM}` }}
        >
          <div style={{ color: CYAN_DIM }} className="text-[8px] tracking-widest mb-0.5">
            CHECKED
          </div>
          <div style={{ color: WHITE }} className="tracking-wider">
            AI
          </div>
        </div>
        <div className="px-3 py-2" style={{ minWidth: 90 }}>
          <div style={{ color: CYAN_DIM }} className="text-[8px] tracking-widest mb-0.5">
            DATE
          </div>
          <div style={{ color: WHITE }} className="tracking-wider">
            2025.02
          </div>
        </div>
      </div>
      <div className="flex">
        <div
          className="px-3 py-2 flex-1"
          style={{ borderRight: `1px solid ${CYAN_DIM}` }}
        >
          <div style={{ color: CYAN_DIM }} className="text-[8px] tracking-widest mb-0.5">
            SCALE
          </div>
          <div style={{ color: WHITE }} className="tracking-wider">
            1 : 100
          </div>
        </div>
        <div className="px-3 py-2" style={{ minWidth: 90 }}>
          <div style={{ color: CYAN_DIM }} className="text-[8px] tracking-widest mb-0.5">
            REV
          </div>
          <div style={{ color: RED }} className="tracking-wider font-bold">
            C
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ────────────── SVG Drawing Line (animated stroke) ────────────── */
function DrawLine({
  d,
  delay = 0,
  duration = 1.5,
  color = CYAN,
  strokeWidth = 1,
}: {
  d: string;
  delay?: number;
  duration?: number;
  color?: string;
  strokeWidth?: number;
}) {
  const ref = useRef<SVGPathElement>(null);
  const containerRef = useRef<SVGSVGElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-40px" });

  return (
    <svg
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ overflow: "visible" }}
    >
      <motion.path
        ref={ref}
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration, delay, ease: "easeInOut" }}
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*  MAIN PAGE COMPONENT                                       */
/* ═══════════════════════════════════════════════════════════ */

export default function BlueprintPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "FLOOR PLAN", href: "#projects" },
    { label: "CROSS-SECTION", href: "#expertise" },
    { label: "MATERIALS", href: "#tools" },
    { label: "REVISIONS", href: "#footer" },
  ];

  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{ background: BG, color: WHITE }}
    >
      {/* ═══════ GRID PAPER BACKGROUND ═══════ */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              ${CYAN_LINE} 0px,
              ${CYAN_LINE} 1px,
              transparent 1px,
              transparent 50px
            ),
            repeating-linear-gradient(
              90deg,
              ${CYAN_LINE} 0px,
              ${CYAN_LINE} 1px,
              transparent 1px,
              transparent 50px
            ),
            repeating-linear-gradient(
              0deg,
              ${CYAN_FAINT} 0px,
              ${CYAN_FAINT} 1px,
              transparent 1px,
              transparent 10px
            ),
            repeating-linear-gradient(
              90deg,
              ${CYAN_FAINT} 0px,
              ${CYAN_FAINT} 1px,
              transparent 1px,
              transparent 10px
            )
          `,
          transform: `translateY(${scrollY * 0.03}px)`,
          willChange: "transform",
        }}
      />

      {/* ═══════ EDGE BORDER / DRAWING FRAME ═══════ */}
      <div
        className="fixed inset-4 pointer-events-none z-10"
        style={{
          border: `1px solid ${CYAN_DIM}`,
        }}
      >
        {/* Corner ticks */}
        {[
          { top: -1, left: -1 },
          { top: -1, right: -1 },
          { bottom: -1, left: -1 },
          { bottom: -1, right: -1 },
        ].map((pos, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              ...pos,
              width: 16,
              height: 16,
            }}
          >
            <div
              className="absolute"
              style={{
                width: 16,
                height: 1,
                background: CYAN,
                top: 0,
                left: 0,
              }}
            />
            <div
              className="absolute"
              style={{
                width: 1,
                height: 16,
                background: CYAN,
                top: 0,
                left: 0,
              }}
            />
          </div>
        ))}
      </div>

      {/* ═══════ FIXED NORTH ARROW ═══════ */}
      <div
        className="fixed top-8 right-8 z-20 pointer-events-none hidden md:block"
        style={{ opacity: 0.6 }}
      >
        <NorthArrow />
      </div>

      {/* ═══════ NAV ═══════ */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 font-[family-name:var(--font-jetbrains)]"
        style={{
          background: `linear-gradient(to bottom, ${BG}ee, ${BG}00)`,
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="max-w-[1200px] mx-auto px-8 py-4 flex items-center justify-between">
          <a
            href="#"
            className="text-sm tracking-[0.3em] font-bold font-[family-name:var(--font-space-grotesk)]"
            style={{ color: CYAN }}
          >
            GROX
            <span
              className="text-[9px] ml-2 tracking-widest"
              style={{ color: CYAN_DIM }}
            >
              ARCHITECTS
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[10px] tracking-[0.25em] transition-colors duration-300"
                style={{ color: CYAN_DIM }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = CYAN)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = CYAN_DIM)
                }
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════ */}
      {/*  HERO                                       */}
      {/* ═══════════════════════════════════════════ */}
      <header
        className="relative flex flex-col items-center justify-center min-h-screen px-6"
        style={{ zIndex: 2 }}
      >
        {/* Center cross-hair */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div
            className="absolute"
            style={{
              width: 1,
              height: 120,
              background: `linear-gradient(to bottom, transparent, ${CYAN_DIM}, transparent)`,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
          <div
            className="absolute"
            style={{
              width: 120,
              height: 1,
              background: `linear-gradient(to right, transparent, ${CYAN_DIM}, transparent)`,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
          {/* Center circle */}
          <div
            className="absolute rounded-full"
            style={{
              width: 300,
              height: 300,
              border: `1px dashed ${CYAN_LINE}`,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative z-10 max-w-4xl text-center"
        >
          {/* Technical label above headline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-[10px] tracking-[0.5em] mb-6 font-[family-name:var(--font-jetbrains)]"
            style={{ color: CYAN_DIM }}
          >
            DRAWING NO. GRX-2025-001 &mdash; GENERAL ARRANGEMENT
          </motion.p>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-8 font-[family-name:var(--font-space-grotesk)] uppercase"
            style={{
              color: WHITE,
              textShadow: `0 0 40px rgba(79,195,247,0.15)`,
            }}
          >
            I turn AI models
            <br />
            into products
            <br />
            people use
          </motion.h1>

          {/* Dimension line under headline */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="max-w-md mx-auto mb-8"
          >
            <DimensionLine label="PORTFOLIO SCOPE" />
          </motion.div>

          {/* Stats as technical annotations */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="flex items-center justify-center gap-8 sm:gap-12 font-[family-name:var(--font-jetbrains)]"
          >
            {stats.map((s, i) => (
              <div key={s.label} className="text-center">
                <div
                  className="text-2xl sm:text-3xl font-bold mb-1"
                  style={{ color: CYAN }}
                >
                  {s.value}
                </div>
                <div
                  className="text-[9px] tracking-[0.2em] uppercase"
                  style={{ color: CYAN_DIM }}
                >
                  {s.label}
                </div>
                {i < stats.length - 1 && (
                  <div
                    className="absolute right-0 top-1/2 -translate-y-1/2 hidden"
                    style={{
                      width: 1,
                      height: 24,
                      background: CYAN_DIM,
                    }}
                  />
                )}
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-12"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ color: CYAN_DIM, zIndex: 10 }}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-[9px] font-[family-name:var(--font-jetbrains)] tracking-[0.3em]">
              SCROLL
            </span>
            <svg
              width="16"
              height="24"
              viewBox="0 0 16 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <rect x="1" y="1" width="14" height="22" rx="7" />
              <motion.circle
                cx="8"
                cy="8"
                r="2"
                fill="currentColor"
                animate={{ cy: [8, 16, 8] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </svg>
          </div>
        </motion.div>
      </header>

      {/* ═══════════════════════════════════════════ */}
      {/*  PROJECTS — FLOOR PLAN CARDS               */}
      {/* ═══════════════════════════════════════════ */}
      <Section id="projects" className="relative px-6 md:px-12 py-24">
        <div className="relative z-10 max-w-[1200px] mx-auto">
          {/* Section header with technical label */}
          <div className="flex items-center gap-4 mb-3">
            <span
              className="text-[9px] font-[family-name:var(--font-jetbrains)] tracking-[0.3em] px-2 py-1"
              style={{
                color: RED,
                border: `1px solid ${RED_DIM}`,
                background: BG,
              }}
            >
              DETAIL A
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: CYAN_DIM }}
            />
          </div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 font-[family-name:var(--font-space-grotesk)] uppercase"
            style={{
              color: WHITE,
              textShadow: `0 0 30px rgba(79,195,247,0.1)`,
            }}
          >
            Floor Plan
          </h2>
          <p
            className="text-xs font-[family-name:var(--font-jetbrains)] tracking-wider mb-16"
            style={{ color: CYAN_DIM }}
          >
            PROJECT DRAWINGS &mdash; SCALE 1:100 &mdash; ALL DIMENSIONS IN
            PIXELS
          </p>

          {/* Project Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {projects.map((project, i) => {
              const title = project.title.replace(/\n/g, " ");
              return (
                <motion.a
                  key={project.title}
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.7,
                    delay: i * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group relative block"
                  style={{
                    border: `1px solid ${CYAN_DIM}`,
                    background: "rgba(10,22,40,0.85)",
                    transition:
                      "border-color 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = CYAN;
                    el.style.boxShadow = `0 0 30px rgba(79,195,247,0.1), inset 0 0 30px rgba(79,195,247,0.03)`;
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = CYAN_DIM;
                    el.style.boxShadow = "none";
                  }}
                >
                  {/* Callout label */}
                  <CalloutLabel
                    label={sectionLabels[i % sectionLabels.length]}
                    position="top-left"
                  />

                  {/* Animated border lines (stroke draw-in) */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <DrawLine
                      d="M 0,0 L 100%,0"
                      delay={i * 0.1}
                      color={CYAN}
                      strokeWidth={0.5}
                    />
                  </div>

                  {/* Project image */}
                  <div className="relative overflow-hidden" style={{ height: 200 }}>
                    <img
                      src={project.image}
                      alt={title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      style={{
                        filter:
                          "brightness(0.35) saturate(0.3) sepia(0.4) hue-rotate(180deg) contrast(1.2)",
                      }}
                    />
                    {/* Blueprint overlay tint */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(to bottom, rgba(10,22,40,0.3), rgba(10,22,40,0.8))`,
                        mixBlendMode: "multiply",
                      }}
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `rgba(79,195,247,0.05)`,
                        mixBlendMode: "screen",
                      }}
                    />

                    {/* Drawing number overlay */}
                    <div className="absolute top-3 left-3">
                      <span
                        className="text-[9px] font-[family-name:var(--font-jetbrains)] tracking-[0.3em] px-2 py-1"
                        style={{
                          background: "rgba(10,22,40,0.8)",
                          color: CYAN,
                          border: `1px solid ${CYAN_DIM}`,
                        }}
                      >
                        DWG-{String(i + 1).padStart(3, "0")}
                      </span>
                    </div>

                    {/* Year / scale annotation (slides in on hover) */}
                    <div className="absolute top-3 right-3 overflow-hidden">
                      <motion.span
                        className="block text-[9px] font-[family-name:var(--font-jetbrains)] tracking-[0.2em] px-2 py-1"
                        style={{
                          background: "rgba(10,22,40,0.8)",
                          color: RED,
                          border: `1px solid ${RED_DIM}`,
                        }}
                        initial={{ x: 60, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
                      >
                        {project.year} &mdash; 1:100
                      </motion.span>
                    </div>
                  </div>

                  {/* Card content */}
                  <div className="p-5">
                    {/* Client & year metadata */}
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="text-[9px] font-[family-name:var(--font-jetbrains)] tracking-[0.2em] uppercase"
                        style={{ color: CYAN_DIM }}
                      >
                        {project.client}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      className="text-lg font-bold mb-2 font-[family-name:var(--font-space-grotesk)] uppercase leading-tight"
                      style={{ color: WHITE }}
                    >
                      {title}
                    </h3>

                    {/* Description */}
                    <p
                      className="text-xs leading-relaxed mb-4 font-[family-name:var(--font-jetbrains)]"
                      style={{ color: WHITE_DIM }}
                    >
                      {project.description}
                    </p>

                    {/* Technical spec */}
                    <div
                      className="text-[10px] leading-relaxed mb-4 pl-3 font-[family-name:var(--font-jetbrains)]"
                      style={{
                        color: CYAN_DIM,
                        borderLeft: `2px solid ${CYAN_LINE}`,
                      }}
                    >
                      {project.technical}
                    </div>

                    {/* Dimension line separator */}
                    <div className="mb-3">
                      <DimensionLine
                        label={`${project.tech.length} SYSTEMS`}
                        color={CYAN_DIM}
                      />
                    </div>

                    {/* Tech tags */}
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="text-[9px] font-[family-name:var(--font-jetbrains)] tracking-wider px-2 py-1"
                          style={{
                            color: CYAN,
                            border: `1px solid ${CYAN_LINE}`,
                            background: CYAN_FAINT,
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.a>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════ */}
      {/*  EXPERTISE — CROSS-SECTION DIAGRAMS        */}
      {/* ═══════════════════════════════════════════ */}
      <Section id="expertise" className="relative px-6 md:px-12 py-24">
        <div className="relative z-10 max-w-[1200px] mx-auto">
          {/* Section header */}
          <div className="flex items-center gap-4 mb-3">
            <span
              className="text-[9px] font-[family-name:var(--font-jetbrains)] tracking-[0.3em] px-2 py-1"
              style={{
                color: RED,
                border: `1px solid ${RED_DIM}`,
                background: BG,
              }}
            >
              SECTION B-B
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: CYAN_DIM }}
            />
          </div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 font-[family-name:var(--font-space-grotesk)] uppercase"
            style={{
              color: WHITE,
              textShadow: `0 0 30px rgba(79,195,247,0.1)`,
            }}
          >
            Cross-Section
          </h2>
          <p
            className="text-xs font-[family-name:var(--font-jetbrains)] tracking-wider mb-16"
            style={{ color: CYAN_DIM }}
          >
            EXPERTISE ANALYSIS &mdash; STRUCTURAL CAPABILITIES
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {expertise.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative group"
                style={{
                  border: `1px solid ${CYAN_DIM}`,
                  background: "rgba(10,22,40,0.7)",
                  transition: "border-color 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = CYAN;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = CYAN_DIM;
                }}
              >
                {/* Cross-section diagram header */}
                <div
                  className="px-5 py-3 flex items-center justify-between"
                  style={{
                    borderBottom: `1px solid ${CYAN_DIM}`,
                    background: CYAN_FAINT,
                  }}
                >
                  <span
                    className="text-[9px] font-[family-name:var(--font-jetbrains)] tracking-[0.3em]"
                    style={{ color: CYAN }}
                  >
                    LAYER {String(i + 1).padStart(2, "0")}
                  </span>
                  {/* Cross-section indicator lines */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <div
                        key={j}
                        style={{
                          width: j === 1 || j === 2 ? 12 : 6,
                          height: 2,
                          background:
                            j === 1 || j === 2 ? CYAN : CYAN_DIM,
                        }}
                      />
                    ))}
                  </div>
                  <span
                    className="text-[9px] font-[family-name:var(--font-jetbrains)] tracking-[0.2em]"
                    style={{ color: RED }}
                  >
                    CUT {String.fromCharCode(65 + i)}-{String.fromCharCode(65 + i)}
                  </span>
                </div>

                {/* Hatching pattern (cross-section fill) */}
                <div className="relative">
                  <div
                    className="absolute top-0 left-0 w-1 h-full"
                    style={{
                      background: `repeating-linear-gradient(
                        45deg,
                        transparent,
                        transparent 3px,
                        ${CYAN_FAINT} 3px,
                        ${CYAN_FAINT} 4px
                      )`,
                    }}
                  />
                  <div
                    className="absolute top-0 left-0 w-1 h-full"
                    style={{
                      background: `repeating-linear-gradient(
                        -45deg,
                        transparent,
                        transparent 3px,
                        ${CYAN_FAINT} 3px,
                        ${CYAN_FAINT} 4px
                      )`,
                    }}
                  />
                </div>

                <div className="p-5 pl-6">
                  <h3
                    className="text-lg font-bold mb-3 font-[family-name:var(--font-space-grotesk)] uppercase"
                    style={{ color: WHITE }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-xs leading-relaxed font-[family-name:var(--font-jetbrains)]"
                    style={{ color: WHITE_DIM }}
                  >
                    {item.body}
                  </p>

                  {/* Dimension annotation at bottom */}
                  <div className="mt-4">
                    <DimensionLine
                      label={`DEPTH ${(i + 1) * 250}mm`}
                      color={CYAN_DIM}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════ */}
      {/*  TOOLS — MATERIALS SPECIFICATION TABLE     */}
      {/* ═══════════════════════════════════════════ */}
      <Section id="tools" className="relative px-6 md:px-12 py-24">
        <div className="relative z-10 max-w-[1200px] mx-auto">
          {/* Section header */}
          <div className="flex items-center gap-4 mb-3">
            <span
              className="text-[9px] font-[family-name:var(--font-jetbrains)] tracking-[0.3em] px-2 py-1"
              style={{
                color: RED,
                border: `1px solid ${RED_DIM}`,
                background: BG,
              }}
            >
              ELEVATION C
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: CYAN_DIM }}
            />
          </div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 font-[family-name:var(--font-space-grotesk)] uppercase"
            style={{
              color: WHITE,
              textShadow: `0 0 30px rgba(79,195,247,0.1)`,
            }}
          >
            Materials Spec
          </h2>
          <p
            className="text-xs font-[family-name:var(--font-jetbrains)] tracking-wider mb-16"
            style={{ color: CYAN_DIM }}
          >
            SPECIFICATION SCHEDULE &mdash; APPROVED MATERIALS
          </p>

          {/* Materials table */}
          <div
            style={{
              border: `1px solid ${CYAN}`,
              background: "rgba(10,22,40,0.85)",
            }}
          >
            {/* Table header */}
            <div
              className="grid grid-cols-[80px_1fr_2fr] md:grid-cols-[100px_180px_1fr] font-[family-name:var(--font-jetbrains)]"
              style={{
                borderBottom: `2px solid ${CYAN}`,
                background: CYAN_FAINT,
              }}
            >
              <div
                className="px-4 py-3 text-[9px] tracking-[0.3em] font-bold"
                style={{ color: CYAN, borderRight: `1px solid ${CYAN_DIM}` }}
              >
                ITEM
              </div>
              <div
                className="px-4 py-3 text-[9px] tracking-[0.3em] font-bold"
                style={{ color: CYAN, borderRight: `1px solid ${CYAN_DIM}` }}
              >
                CATEGORY
              </div>
              <div
                className="px-4 py-3 text-[9px] tracking-[0.3em] font-bold"
                style={{ color: CYAN }}
              >
                SPECIFICATION
              </div>
            </div>

            {/* Table rows */}
            {tools.map((category, gi) => (
              <motion.div
                key={category.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{
                  duration: 0.5,
                  delay: gi * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="grid grid-cols-[80px_1fr_2fr] md:grid-cols-[100px_180px_1fr] font-[family-name:var(--font-jetbrains)] group"
                style={{
                  borderBottom:
                    gi < tools.length - 1
                      ? `1px solid ${CYAN_LINE}`
                      : "none",
                  transition: "background 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(79,195,247,0.03)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "transparent";
                }}
              >
                <div
                  className="px-4 py-4 text-[10px] font-bold"
                  style={{
                    color: RED,
                    borderRight: `1px solid ${CYAN_LINE}`,
                  }}
                >
                  {String(gi + 1).padStart(2, "0")}
                </div>
                <div
                  className="px-4 py-4 text-xs tracking-wider font-bold uppercase"
                  style={{
                    color: CYAN,
                    borderRight: `1px solid ${CYAN_LINE}`,
                  }}
                >
                  {category.label}
                </div>
                <div className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    {category.items.map((item) => (
                      <span
                        key={item}
                        className="text-[10px] tracking-wider px-2 py-1"
                        style={{
                          color: WHITE_DIM,
                          border: `1px solid ${CYAN_LINE}`,
                          background: CYAN_FAINT,
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Approval stamp below table */}
          <motion.div
            initial={{ opacity: 0, rotate: -3 }}
            whileInView={{ opacity: 1, rotate: -2 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8 flex justify-end"
          >
            <div
              className="px-6 py-3 font-[family-name:var(--font-jetbrains)] text-center"
              style={{
                border: `2px solid ${RED}`,
                color: RED,
                transform: "rotate(-2deg)",
              }}
            >
              <div className="text-lg font-bold tracking-[0.3em]">
                APPROVED
              </div>
              <div className="text-[9px] tracking-[0.2em] mt-1" style={{ color: RED_DIM }}>
                FOR CONSTRUCTION
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════ */}
      {/*  REVISION HISTORY TABLE                    */}
      {/* ═══════════════════════════════════════════ */}
      <Section className="relative px-6 md:px-12 py-16">
        <div className="relative z-10 max-w-[1200px] mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <span
              className="text-[9px] font-[family-name:var(--font-jetbrains)] tracking-[0.3em] px-2 py-1"
              style={{
                color: RED,
                border: `1px solid ${RED_DIM}`,
                background: BG,
              }}
            >
              REV LOG
            </span>
            <div className="flex-1 h-px" style={{ background: CYAN_DIM }} />
          </div>

          <div
            className="font-[family-name:var(--font-jetbrains)]"
            style={{
              border: `1px solid ${CYAN_DIM}`,
              background: "rgba(10,22,40,0.85)",
            }}
          >
            {/* Revision table header */}
            <div
              className="grid grid-cols-[50px_80px_1fr_100px] text-[9px] tracking-[0.2em]"
              style={{
                borderBottom: `1px solid ${CYAN}`,
                background: CYAN_FAINT,
                color: CYAN,
              }}
            >
              <div className="px-3 py-2 font-bold" style={{ borderRight: `1px solid ${CYAN_LINE}` }}>
                REV
              </div>
              <div className="px-3 py-2 font-bold" style={{ borderRight: `1px solid ${CYAN_LINE}` }}>
                DATE
              </div>
              <div className="px-3 py-2 font-bold" style={{ borderRight: `1px solid ${CYAN_LINE}` }}>
                DESCRIPTION
              </div>
              <div className="px-3 py-2 font-bold">BY</div>
            </div>

            {[
              {
                rev: "C",
                date: "2025.02",
                desc: "Added AI video production & interior design modules",
                by: "GROX",
              },
              {
                rev: "B",
                date: "2025.01",
                desc: "Expanded multi-model orchestration capabilities",
                by: "GROX",
              },
              {
                rev: "A",
                date: "2024.12",
                desc: "Initial portfolio release with core projects",
                by: "GROX",
              },
            ].map((row, i) => (
              <motion.div
                key={row.rev}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="grid grid-cols-[50px_80px_1fr_100px] text-[10px]"
                style={{
                  borderBottom:
                    i < 2 ? `1px solid ${CYAN_LINE}` : "none",
                }}
              >
                <div
                  className="px-3 py-3 font-bold"
                  style={{
                    color: i === 0 ? RED : CYAN_DIM,
                    borderRight: `1px solid ${CYAN_LINE}`,
                  }}
                >
                  {row.rev}
                </div>
                <div
                  className="px-3 py-3"
                  style={{
                    color: CYAN_DIM,
                    borderRight: `1px solid ${CYAN_LINE}`,
                  }}
                >
                  {row.date}
                </div>
                <div
                  className="px-3 py-3"
                  style={{
                    color: WHITE_DIM,
                    borderRight: `1px solid ${CYAN_LINE}`,
                  }}
                >
                  {row.desc}
                </div>
                <div className="px-3 py-3" style={{ color: CYAN_DIM }}>
                  {row.by}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════ */}
      {/*  FOOTER                                    */}
      {/* ═══════════════════════════════════════════ */}
      <Section id="footer" className="relative px-6 md:px-12 py-24">
        <div className="relative z-10 max-w-[1200px] mx-auto">
          {/* Contact block */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-12 mb-16">
            {/* Left: contact info */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <span
                  className="text-[9px] font-[family-name:var(--font-jetbrains)] tracking-[0.3em] px-2 py-1"
                  style={{
                    color: RED,
                    border: `1px solid ${RED_DIM}`,
                    background: BG,
                  }}
                >
                  NOTES
                </span>
                <div
                  className="h-px w-24"
                  style={{ background: CYAN_DIM }}
                />
              </div>

              <h2
                className="text-2xl sm:text-3xl font-bold mb-6 font-[family-name:var(--font-space-grotesk)] uppercase"
                style={{ color: WHITE }}
              >
                Project Inquiry
              </h2>

              <div className="space-y-3 font-[family-name:var(--font-jetbrains)]">
                <div className="flex items-center gap-3">
                  <span
                    className="text-[9px] tracking-[0.2em] w-16"
                    style={{ color: CYAN_DIM }}
                  >
                    EMAIL
                  </span>
                  <a
                    href="mailto:hello@grox.studio"
                    className="text-xs tracking-wider transition-colors duration-300"
                    style={{ color: CYAN }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = WHITE)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = CYAN)
                    }
                  >
                    hello@grox.studio
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="text-[9px] tracking-[0.2em] w-16"
                    style={{ color: CYAN_DIM }}
                  >
                    GITHUB
                  </span>
                  <a
                    href="https://github.com/1aday"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs tracking-wider transition-colors duration-300"
                    style={{ color: CYAN }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = WHITE)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = CYAN)
                    }
                  >
                    github.com/1aday
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="text-[9px] tracking-[0.2em] w-16"
                    style={{ color: CYAN_DIM }}
                  >
                    ZONE
                  </span>
                  <span
                    className="text-xs tracking-wider"
                    style={{ color: WHITE_DIM }}
                  >
                    Remote / Worldwide
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Cartouche stamp */}
            <Cartouche />
          </div>

          {/* Final dimension line */}
          <div className="mb-8">
            <DimensionLine label="END OF DRAWING" />
          </div>

          {/* Copyright */}
          <div className="flex items-center justify-between font-[family-name:var(--font-jetbrains)]">
            <span className="text-[9px] tracking-[0.2em]" style={{ color: CYAN_DIM }}>
              &copy; {new Date().getFullYear()} GROX AI
            </span>
            <span className="text-[9px] tracking-[0.2em]" style={{ color: CYAN_DIM }}>
              ALL RIGHTS RESERVED
            </span>
            <span
              className="text-[9px] tracking-[0.2em] hidden sm:inline"
              style={{ color: CYAN_DIM }}
            >
              DO NOT SCALE FROM THIS DRAWING
            </span>
          </div>
        </div>
      </Section>

      {/* Theme Switcher */}
      <div className="relative z-20 pb-8">
        <ThemeSwitcher current="/blueprint" />
      </div>

      {/* ═══════════ GLOBAL STYLES ═══════════ */}
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        /* Scrollbar styling for blueprint feel */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: ${BG};
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(79, 195, 247, 0.2);
          border-radius: 0;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(79, 195, 247, 0.4);
        }

        /* Selection color */
        ::selection {
          background: rgba(79, 195, 247, 0.3);
          color: ${WHITE};
        }
      `}</style>
    </div>
  );
}
