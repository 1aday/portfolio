"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { projects, stats, expertise, tools } from "@/app/data/projects";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";
import { getProjectImage } from "@/lib/theme-images";

/* ═══════════════════════════════════════════════════════════════
   LIMINAL — Hauntological Non-Places
   Empty corridors, drained pools, humming fluorescent tubes.
   Portfolio content as artifacts left behind in liminal space.
   ═══════════════════════════════════════════════════════════════ */

const C = {
  drywall: "#F2EDE8",
  poolTile: "#8BBCC8",
  concrete: "#4A4A52",
  warmGrey: "#A8A4A0",
  fluorescent: "#D4E8D0",
  mauve: "#C8A0B0",
  exitRed: "#CC3333",
  ceiling: "#E8E0D4",
  linoleum: "#D8D0C4",
};

const ease = [0.16, 1, 0.3, 1] as const;
const slow = { duration: 1.2, ease };

/* ── SVG linoleum feTurbulence filter ── */
function LinoleumOverlay() {
  return (
    <svg className="fixed inset-0 w-full h-full pointer-events-none z-[1]" aria-hidden>
      <defs>
        <filter id="linoleum-texture">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="4"
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix
            type="saturate"
            values="0"
            in="noise"
            result="mono"
          />
          <feBlend in="SourceGraphic" in2="mono" mode="multiply" />
        </filter>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill={C.drywall}
        filter="url(#linoleum-texture)"
        opacity="0.04"
      />
    </svg>
  );
}

/* ── SVG EXIT sign with red glow ── */
function ExitSign({ className = "" }: { className?: string }) {
  return (
    <svg
      width="120"
      height="48"
      viewBox="0 0 120 48"
      className={className}
      aria-label="EXIT"
    >
      <defs>
        <filter id="exit-glow">
          <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor={C.exitRed} floodOpacity="0.7" />
          <feDropShadow dx="0" dy="0" stdDeviation="12" floodColor={C.exitRed} floodOpacity="0.3" />
        </filter>
      </defs>
      <rect
        x="2"
        y="2"
        width="116"
        height="44"
        rx="3"
        fill={C.exitRed}
        filter="url(#exit-glow)"
        opacity="0.95"
      />
      <rect x="5" y="5" width="110" height="38" rx="2" fill="none" stroke="#FF6666" strokeWidth="1" />
      <text
        x="60"
        y="32"
        textAnchor="middle"
        fill="white"
        fontSize="24"
        fontWeight="700"
        letterSpacing="8"
        style={{ fontFamily: "var(--font-jetbrains), monospace" }}
      >
        EXIT
      </text>
    </svg>
  );
}

/* ── SVG 1-point perspective corridor lines ── */
function CorridorLines() {
  const cx = 50;
  const cy = 50;
  const lines = [];
  // Converging lines from edges to center vanishing point
  for (let i = 0; i <= 100; i += 5) {
    lines.push(`M 0 ${i} L ${cx} ${cy}`);
    lines.push(`M 100 ${i} L ${cx} ${cy}`);
    lines.push(`M ${i} 0 L ${cx} ${cy}`);
    lines.push(`M ${i} 100 L ${cx} ${cy}`);
  }
  return (
    <svg
      viewBox="0 0 100 100"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="none"
      aria-hidden
    >
      {lines.map((d, i) => (
        <path
          key={i}
          d={d}
          stroke={C.warmGrey}
          strokeWidth="0.15"
          fill="none"
          opacity="0.3"
        />
      ))}
      {/* Central vanishing rectangle */}
      <rect
        x="42"
        y="42"
        width="16"
        height="16"
        fill="none"
        stroke={C.poolTile}
        strokeWidth="0.3"
        opacity="0.5"
      />
    </svg>
  );
}

/* ── Room number plate ── */
function RoomNumber({ number, hover = false }: { number: string; hover?: boolean }) {
  return (
    <div
      className="inline-flex items-center justify-center px-3 py-1.5 rounded-sm transition-colors duration-500"
      style={{
        background: hover ? C.exitRed : C.concrete,
        boxShadow: "inset 1px 1px 2px rgba(255,255,255,0.15), inset -1px -1px 2px rgba(0,0,0,0.3)",
        minWidth: "52px",
      }}
    >
      <span
        className="font-[family-name:var(--font-jetbrains)] text-xs tracking-widest"
        style={{ color: hover ? "#fff" : C.ceiling }}
      >
        {number}
      </span>
    </div>
  );
}

/* ── Animated section wrapper ── */
function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={slow}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════════════════ */
export default function LiminalPage() {
  const [fluorescentOn, setFluorescentOn] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    // Fluorescent turns on after a short delay, simulating warm-up flicker
    const t = setTimeout(() => setFluorescentOn(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <main
      className="relative min-h-screen overflow-x-hidden"
      style={{ background: C.drywall, color: C.concrete }}
    >
      <LinoleumOverlay />

      {/* ═══ KEYFRAME STYLES ═══ */}
      <style>{`
        @keyframes fluorescent-flicker {
          0%   { opacity: 0; }
          3%   { opacity: 0.8; }
          5%   { opacity: 0.1; }
          7%   { opacity: 0.9; }
          10%  { opacity: 0.2; }
          12%  { opacity: 0; }
          20%  { opacity: 0.6; }
          22%  { opacity: 0; }
          35%  { opacity: 0.8; }
          37%  { opacity: 0.3; }
          40%  { opacity: 0.9; }
          50%  { opacity: 0.1; }
          55%  { opacity: 0.95; }
          60%  { opacity: 0.4; }
          70%  { opacity: 1; }
          75%  { opacity: 0.85; }
          80%  { opacity: 1; }
          100% { opacity: 1; }
        }
        .fluorescent-tube {
          animation: fluorescent-flicker 2s ease-out forwards;
        }
        .fluorescent-tube.off {
          opacity: 0;
          animation: none;
        }
        @keyframes corridor-grid-scroll {
          from { transform: perspective(600px) rotateX(60deg) translateY(0); }
          to   { transform: perspective(600px) rotateX(60deg) translateY(40px); }
        }
        .corridor-floor-grid {
          animation: corridor-grid-scroll 4s linear infinite;
        }
        @keyframes scroll-dash {
          from { stroke-dashoffset: 0; }
          to   { stroke-dashoffset: -20; }
        }
        .scroll-dash-line {
          animation: scroll-dash 1.5s linear infinite;
        }
        @keyframes double-vision-drift {
          0%, 100% { transform: translate(0, 0); }
          50%      { transform: translate(2px, -1px); }
        }
        .double-vision {
          position: relative;
        }
        .double-vision::after {
          content: attr(data-text);
          position: absolute;
          left: 3px;
          top: 2px;
          color: ${C.poolTile};
          opacity: 0.35;
          z-index: -1;
          animation: double-vision-drift 6s ease-in-out infinite;
        }
      `}</style>

      {/* ═══════════════════════════════════════════════════════
          SECTION 1 — HERO: Corridor Perspective
          ═══════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Perspective corridor floor grid */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200%] h-[60%] origin-bottom overflow-hidden"
          style={{ perspective: "600px" }}
        >
          <div
            className="corridor-floor-grid w-full h-[200%] -mt-[50%]"
            style={{
              backgroundImage: `
                linear-gradient(${C.warmGrey}40 1px, transparent 1px),
                linear-gradient(90deg, ${C.warmGrey}40 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
              transformOrigin: "center bottom",
            }}
          />
        </div>

        {/* SVG corridor converging lines */}
        <div className="absolute inset-0 opacity-20">
          <CorridorLines />
        </div>

        {/* Fluorescent tube rectangle */}
        <div
          className={`absolute top-[12%] left-1/2 -translate-x-1/2 w-[320px] h-[80px] md:w-[500px] md:h-[100px] rounded-sm ${fluorescentOn ? "fluorescent-tube" : "fluorescent-tube off"}`}
          style={{
            border: `2px solid ${C.fluorescent}`,
            boxShadow: fluorescentOn
              ? `0 0 40px ${C.fluorescent}80, 0 0 80px ${C.fluorescent}40, inset 0 0 30px ${C.fluorescent}30`
              : "none",
            background: fluorescentOn
              ? `linear-gradient(180deg, ${C.fluorescent}15, transparent)`
              : "transparent",
            transition: "box-shadow 0.3s",
          }}
        >
          {/* Inner fluorescent bar */}
          <div
            className="absolute top-1/2 left-[10%] right-[10%] h-[3px] -translate-y-1/2 rounded-full"
            style={{
              background: fluorescentOn ? C.fluorescent : "transparent",
              boxShadow: fluorescentOn ? `0 0 12px ${C.fluorescent}, 0 0 24px ${C.fluorescent}80` : "none",
            }}
          />
        </div>

        {/* EXIT sign floating */}
        <motion.div
          className="absolute top-8 right-8 md:top-12 md:right-16 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, ...slow }}
        >
          <ExitSign />
        </motion.div>

        {/* Hero content */}
        <div className="relative z-10 text-center px-6 mt-24">
          <motion.p
            className="font-[family-name:var(--font-jetbrains)] text-xs tracking-[0.4em] uppercase mb-6"
            style={{ color: C.warmGrey }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, ...slow }}
          >
            AI Product Studio
          </motion.p>

          <motion.h1
            className="font-[family-name:var(--font-josefin)] font-light text-5xl md:text-7xl lg:text-8xl tracking-[0.25em] md:tracking-[0.4em] uppercase leading-tight"
            style={{ color: C.concrete }}
            initial={{ opacity: 0, y: 30, letterSpacing: "0.6em" }}
            animate={{ opacity: 1, y: 0, letterSpacing: undefined }}
            transition={{ delay: 2.4, duration: 1.6, ease }}
          >
            G R O X
          </motion.h1>

          <motion.div
            className="w-[60px] h-px mx-auto mt-8 mb-8"
            style={{ background: C.poolTile }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 2.8, ...slow }}
          />

          <motion.p
            className="font-[family-name:var(--font-sora)] text-sm md:text-base max-w-md mx-auto leading-relaxed"
            style={{ color: C.warmGrey }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, ...slow }}
          >
            Building intelligent systems in the spaces between
            what exists and what is possible.
          </motion.p>

          {/* Stats as corridor wayfinding markers */}
          <motion.div
            className="flex items-center justify-center gap-10 md:gap-16 mt-14"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.2, ...slow }}
          >
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div
                  className="font-[family-name:var(--font-josefin)] text-3xl md:text-4xl font-light tracking-wider"
                  style={{ color: C.poolTile }}
                >
                  {s.value}
                </div>
                <div
                  className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[0.3em] uppercase mt-2"
                  style={{ color: C.warmGrey }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator — vertical dashed line (emergency floor lighting) */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.6, ...slow }}
        >
          <svg width="2" height="48" viewBox="0 0 2 48" aria-hidden>
            <line
              x1="1" y1="0" x2="1" y2="48"
              stroke={C.poolTile}
              strokeWidth="1.5"
              strokeDasharray="4 6"
              className="scroll-dash-line"
            />
          </svg>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 2 — PROJECTS: Rooms with doorframe borders
          ═══════════════════════════════════════════════════════ */}
      <section className="relative z-10 px-6 md:px-12 lg:px-20 py-32">
        <Reveal className="mb-20">
          <div className="flex items-center gap-6 mb-4">
            <div className="w-12 h-px" style={{ background: C.poolTile }} />
            <p
              className="font-[family-name:var(--font-jetbrains)] text-xs tracking-[0.35em] uppercase"
              style={{ color: C.warmGrey }}
            >
              Floor Directory
            </p>
          </div>
          <h2
            className="font-[family-name:var(--font-josefin)] text-3xl md:text-5xl font-light tracking-[0.15em] uppercase"
            style={{ color: C.concrete }}
          >
            Projects
          </h2>
        </Reveal>

        {/* Staggered 2-column offset grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {projects.map((project, i) => {
            const roomNum = String(100 + i + 1);
            const isHovered = hoveredCard === i;
            const isOffset = i % 2 === 1;

            return (
              <Reveal key={i} className={isOffset ? "md:mt-16" : ""}>
                <Link href={project.github} target="_blank" rel="noopener noreferrer">
                  <motion.article
                    className="relative group cursor-pointer"
                    style={{
                      border: `3px solid ${C.ceiling}`,
                      borderRadius: "2px",
                      background: C.drywall,
                      padding: "0",
                      boxShadow: isHovered
                        ? `inset 0 0 20px rgba(139,188,200,0.15), 0 4px 20px rgba(0,0,0,0.06)`
                        : `0 2px 8px rgba(0,0,0,0.04)`,
                      transition: "box-shadow 0.6s ease",
                    }}
                    onHoverStart={() => setHoveredCard(i)}
                    onHoverEnd={() => setHoveredCard(null)}
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.6, ease }}
                  >
                    {/* Doorframe top beam */}
                    <div
                      className="h-2"
                      style={{
                        background: `linear-gradient(180deg, ${C.linoleum}, ${C.ceiling})`,
                        borderBottom: `1px solid ${C.warmGrey}40`,
                      }}
                    />

                    {/* Room number plate */}
                    <div className="absolute top-5 right-4 z-10">
                      <RoomNumber number={roomNum} hover={isHovered} />
                    </div>

                    {/* Project image with washed-out filter */}
                    <div className="relative w-full aspect-[16/10] overflow-hidden">
                      <Image
                        src={getProjectImage("liminal", project.image)}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-[1.2s]"
                        style={{
                          filter: "brightness(1.3) saturate(0.5)",
                        }}
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      {/* Haze overlay */}
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(180deg, ${C.drywall}30 0%, transparent 40%, ${C.drywall}60 100%)`,
                        }}
                      />
                    </div>

                    {/* Card content */}
                    <div className="p-6 pb-5">
                      {/* Client / Year */}
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[0.25em] uppercase"
                          style={{ color: C.warmGrey }}
                        >
                          {project.client}
                        </span>
                        <span style={{ color: C.warmGrey }}>|</span>
                        <span
                          className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-wider"
                          style={{ color: C.warmGrey }}
                        >
                          {project.year}
                        </span>
                      </div>

                      {/* Title */}
                      <h3
                        className="font-[family-name:var(--font-josefin)] text-xl md:text-2xl font-light tracking-wider leading-snug mb-3 whitespace-pre-line"
                        style={{ color: C.concrete }}
                      >
                        {project.title}
                      </h3>

                      {/* Description */}
                      <p
                        className="font-[family-name:var(--font-sora)] text-sm leading-relaxed mb-4 line-clamp-3"
                        style={{ color: C.warmGrey }}
                      >
                        {project.description}
                      </p>

                      {/* Technical detail */}
                      <p
                        className="font-[family-name:var(--font-sora)] text-xs leading-relaxed mb-5"
                        style={{ color: `${C.warmGrey}BB` }}
                      >
                        {project.technical}
                      </p>

                      {/* Tech tags */}
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((t) => (
                          <span
                            key={t}
                            className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-wider px-2.5 py-1 rounded-sm"
                            style={{
                              background: `${C.ceiling}`,
                              color: C.concrete,
                              border: `1px solid ${C.warmGrey}30`,
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Doorframe bottom baseboard */}
                    <div
                      className="h-1.5"
                      style={{
                        background: C.linoleum,
                        borderTop: `1px solid ${C.warmGrey}30`,
                      }}
                    />
                  </motion.article>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 3 — EXPERTISE: Wayfinding Placards
          ═══════════════════════════════════════════════════════ */}
      <section
        className="relative z-10 py-32"
        style={{ background: `linear-gradient(180deg, ${C.drywall}, ${C.ceiling}40, ${C.drywall})` }}
      >
        <div className="px-6 md:px-12 lg:px-20 max-w-5xl mx-auto">
          <Reveal className="mb-20">
            <div className="flex items-center gap-6 mb-4">
              <div className="w-12 h-px" style={{ background: C.mauve }} />
              <p
                className="font-[family-name:var(--font-jetbrains)] text-xs tracking-[0.35em] uppercase"
                style={{ color: C.warmGrey }}
              >
                Wayfinding
              </p>
            </div>
            <h2
              className="font-[family-name:var(--font-josefin)] text-3xl md:text-5xl font-light tracking-[0.15em] uppercase"
              style={{ color: C.concrete }}
            >
              Expertise
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 gap-0">
            {expertise.map((exp, i) => (
              <Reveal key={i}>
                <div
                  className="relative flex items-start gap-6 md:gap-10 py-10 group"
                  style={{
                    borderBottom: i < expertise.length - 1 ? `1px solid ${C.warmGrey}30` : "none",
                  }}
                >
                  {/* Directional arrow placard */}
                  <div
                    className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-sm mt-1"
                    style={{
                      background: C.ceiling,
                      border: `2px solid ${C.warmGrey}40`,
                      boxShadow: "inset 1px 1px 3px rgba(255,255,255,0.5), 1px 2px 4px rgba(0,0,0,0.08)",
                    }}
                  >
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
                      {/* Arrow pointing right, rotated based on index for visual variety */}
                      <g transform={`rotate(${[0, 45, -45, 90][i % 4]} 14 14)`}>
                        <path
                          d="M6 14H22M22 14L16 8M22 14L16 20"
                          stroke={C.concrete}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                    </svg>
                  </div>

                  {/* Placard content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <span
                        className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[0.3em]"
                        style={{ color: C.mauve }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="flex-1 h-px" style={{ background: `${C.warmGrey}20` }} />
                    </div>
                    <h3
                      className="font-[family-name:var(--font-josefin)] text-xl md:text-2xl font-light tracking-wider mb-3 group-hover:tracking-[0.15em] transition-all duration-700"
                      style={{ color: C.concrete }}
                    >
                      {exp.title}
                    </h3>
                    <p
                      className="font-[family-name:var(--font-sora)] text-sm leading-relaxed max-w-xl"
                      style={{ color: C.warmGrey }}
                    >
                      {exp.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 4 — TOOLS: Lobby Directory Board
          ═══════════════════════════════════════════════════════ */}
      <section className="relative z-10 px-6 md:px-12 lg:px-20 py-32">
        <div className="max-w-4xl mx-auto">
          <Reveal className="mb-20">
            <div className="flex items-center gap-6 mb-4">
              <div className="w-12 h-px" style={{ background: C.poolTile }} />
              <p
                className="font-[family-name:var(--font-jetbrains)] text-xs tracking-[0.35em] uppercase"
                style={{ color: C.warmGrey }}
              >
                Lobby Directory
              </p>
            </div>
            <h2
              className="font-[family-name:var(--font-josefin)] text-3xl md:text-5xl font-light tracking-[0.15em] uppercase"
              style={{ color: C.concrete }}
            >
              Tools
            </h2>
          </Reveal>

          {/* Directory board */}
          <Reveal>
            <div
              className="rounded-sm overflow-hidden"
              style={{
                background: C.ceiling,
                border: `3px solid ${C.warmGrey}50`,
                boxShadow: `inset 0 2px 6px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.05)`,
              }}
            >
              {/* Board header */}
              <div
                className="px-6 py-4 flex items-center justify-between"
                style={{
                  background: C.concrete,
                  borderBottom: `2px solid ${C.warmGrey}`,
                }}
              >
                <span
                  className="font-[family-name:var(--font-josefin)] text-sm tracking-[0.3em] uppercase"
                  style={{ color: C.ceiling }}
                >
                  Building Directory
                </span>
                <span
                  className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-wider"
                  style={{ color: C.warmGrey }}
                >
                  {tools.length} FLOORS
                </span>
              </div>

              {/* Directory rows */}
              {tools.map((tool, i) => (
                <motion.div
                  key={i}
                  className="flex items-center px-6 py-5 group"
                  style={{
                    borderBottom: i < tools.length - 1 ? `1px solid ${C.warmGrey}30` : "none",
                  }}
                  whileHover={{
                    backgroundColor: `${C.drywall}`,
                  }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Floor number */}
                  <div
                    className="w-10 h-10 flex items-center justify-center rounded-sm mr-6 flex-shrink-0"
                    style={{
                      background: C.concrete,
                      boxShadow: "inset 1px 1px 2px rgba(255,255,255,0.1), inset -1px -1px 2px rgba(0,0,0,0.3)",
                    }}
                  >
                    <span
                      className="font-[family-name:var(--font-jetbrains)] text-xs font-bold"
                      style={{ color: C.ceiling }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Category label */}
                  <div className="w-28 md:w-36 flex-shrink-0">
                    <span
                      className="font-[family-name:var(--font-josefin)] text-sm md:text-base tracking-wider uppercase"
                      style={{ color: C.concrete }}
                    >
                      {tool.label}
                    </span>
                  </div>

                  {/* Dotted leader line */}
                  <div
                    className="flex-1 mx-4 h-px"
                    style={{
                      backgroundImage: `repeating-linear-gradient(90deg, ${C.warmGrey}60 0px, ${C.warmGrey}60 2px, transparent 2px, transparent 6px)`,
                    }}
                  />

                  {/* Items */}
                  <div className="flex flex-wrap gap-x-3 gap-y-1 justify-end">
                    {tool.items.map((item) => (
                      <span
                        key={item}
                        className="font-[family-name:var(--font-sora)] text-xs md:text-sm whitespace-nowrap"
                        style={{ color: C.warmGrey }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 5 — FOOTER: Double-vision CTA & baseboard
          ═══════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-32 px-6 md:px-12 lg:px-20 overflow-hidden">
        {/* Faint corridor echo behind */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <CorridorLines />
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <Reveal>
            <p
              className="font-[family-name:var(--font-jetbrains)] text-xs tracking-[0.4em] uppercase mb-8"
              style={{ color: C.warmGrey }}
            >
              End of corridor
            </p>

            {/* Double-vision heading */}
            <h2
              className="double-vision font-[family-name:var(--font-josefin)] text-4xl md:text-6xl lg:text-7xl font-light tracking-[0.2em] uppercase mb-6"
              style={{ color: C.concrete }}
              data-text="Let's Build"
            >
              Let&apos;s Build
            </h2>
            <h2
              className="double-vision font-[family-name:var(--font-josefin)] text-4xl md:text-6xl lg:text-7xl font-light tracking-[0.2em] uppercase mb-10"
              style={{ color: C.poolTile }}
              data-text="Something"
            >
              Something
            </h2>

            <p
              className="font-[family-name:var(--font-sora)] text-sm md:text-base leading-relaxed max-w-lg mx-auto mb-12"
              style={{ color: C.warmGrey }}
            >
              Every corridor leads somewhere. If you are building AI-powered products
              and need someone who has been through these spaces before,
              I would like to hear from you.
            </p>

            {/* CTA */}
            <motion.a
              href="mailto:hello@grox.studio"
              className="inline-flex items-center gap-4 px-8 py-4 rounded-sm font-[family-name:var(--font-josefin)] text-sm tracking-[0.2em] uppercase transition-all duration-700"
              style={{
                border: `2px solid ${C.concrete}`,
                color: C.concrete,
                background: "transparent",
              }}
              whileHover={{
                backgroundColor: C.concrete,
                color: C.drywall,
              }}
              transition={{ duration: 0.5 }}
            >
              <span>Get in Touch</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path
                  d="M3 8H13M13 8L9 4M13 8L9 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.a>
          </Reveal>

          {/* EXIT sign at bottom */}
          <motion.div
            className="mt-20 flex justify-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, ...slow }}
          >
            <ExitSign />
          </motion.div>

          {/* Bottom credit line */}
          <Reveal className="mt-16">
            <p
              className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[0.3em] uppercase"
              style={{ color: `${C.warmGrey}80` }}
            >
              Grox Studio / {new Date().getFullYear()} / All rights reserved
            </p>
          </Reveal>
        </div>

        {/* Baseboard trim line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-3"
          style={{
            background: `linear-gradient(180deg, ${C.linoleum}, ${C.warmGrey}60)`,
            borderTop: `1px solid ${C.warmGrey}40`,
          }}
        />
      </section>

      <ThemeSwitcher current="/liminal" variant="light" />
    </main>
  );
}
