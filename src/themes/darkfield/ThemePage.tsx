"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "@/app/data/projects";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";

/* ─────────────────── Colors ─────────────────── */
const LAB_BLACK = "#0A0A12";
const CARD_BLACK = "#0E0E18";
const REFRACTION_BLUE = "#4D9EFF";
const BIO_GREEN = "#44FFB2";
const AMBER_SIGNAL = "#FFAA33";
const UV_VIOLET = "#8855FF";
const SPECIMEN_WHITE = "#FFFFFF";
const TEXT_COLOR = "#D0D8E8";
const MUTED = "#5A6070";

/* ─────────────────── Bokeh Particles ─────────────────── */
const BOKEH_PARTICLES = [
  { x: 8, y: 12, size: 80, color: REFRACTION_BLUE, blur: 30, opacity: 0.18, duration: 20, delayX: 0 },
  { x: 75, y: 25, size: 60, color: BIO_GREEN, blur: 25, opacity: 0.15, duration: 18, delayX: -5 },
  { x: 20, y: 70, size: 90, color: AMBER_SIGNAL, blur: 35, opacity: 0.12, duration: 22, delayX: -8 },
  { x: 85, y: 65, size: 50, color: UV_VIOLET, blur: 20, opacity: 0.2, duration: 16, delayX: -3 },
  { x: 45, y: 85, size: 70, color: REFRACTION_BLUE, blur: 28, opacity: 0.14, duration: 24, delayX: -12 },
  { x: 60, y: 15, size: 55, color: BIO_GREEN, blur: 22, opacity: 0.16, duration: 19, delayX: -7 },
  { x: 30, y: 45, size: 100, color: UV_VIOLET, blur: 40, opacity: 0.1, duration: 25, delayX: -10 },
  { x: 92, y: 40, size: 45, color: AMBER_SIGNAL, blur: 24, opacity: 0.17, duration: 17, delayX: -4 },
];

/* ─────────────────── Aperture Iris SVG ─────────────────── */
function ApertureIris({ size = 200, className = "" }: { size?: number; className?: string }) {
  const bladeCount = 8;
  const blades: string[] = [];
  const r = size / 2;
  const innerR = r * 0.35;
  const outerR = r * 0.95;

  for (let i = 0; i < bladeCount; i++) {
    const angle = (i / bladeCount) * Math.PI * 2;
    const nextAngle = ((i + 0.6) / bladeCount) * Math.PI * 2;
    const cx = r;
    const cy = r;

    const x1 = cx + Math.cos(angle) * innerR;
    const y1 = cy + Math.sin(angle) * innerR;
    const x2 = cx + Math.cos(angle) * outerR;
    const y2 = cy + Math.sin(angle) * outerR;
    const x3 = cx + Math.cos(nextAngle) * outerR;
    const y3 = cy + Math.sin(nextAngle) * outerR;
    const x4 = cx + Math.cos(nextAngle) * innerR;
    const y4 = cy + Math.sin(nextAngle) * innerR;

    blades.push(`M${x1},${y1} L${x2},${y2} L${x3},${y3} L${x4},${y4} Z`);
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      fill="none"
    >
      {blades.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke={REFRACTION_BLUE}
          strokeWidth="1"
          opacity={0.25}
        />
      ))}
      <circle
        cx={r}
        cy={r}
        r={innerR}
        fill="none"
        stroke={REFRACTION_BLUE}
        strokeWidth="0.5"
        opacity={0.3}
      />
    </svg>
  );
}

/* ─────────────────── Concentric Circles ─────────────────── */
function ConcentricCircles({ size = 60, color = REFRACTION_BLUE }: { size?: number; color?: string }) {
  const r = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      {[0.9, 0.65, 0.4, 0.2].map((scale, i) => (
        <circle
          key={i}
          cx={r}
          cy={r}
          r={r * scale}
          stroke={color}
          strokeWidth="0.5"
          opacity={0.3 - i * 0.05}
        />
      ))}
    </svg>
  );
}

/* ─────────────────── Scale Bar ─────────────────── */
function ScaleBar({ width = 60 }: { width?: number }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="relative"
        style={{ width, height: 6 }}
      >
        <div
          className="absolute top-0 left-0 w-full"
          style={{ height: 1, background: MUTED }}
        />
        <div
          className="absolute top-0 left-0"
          style={{ width: 1, height: 6, background: MUTED }}
        />
        <div
          className="absolute top-0 right-0"
          style={{ width: 1, height: 6, background: MUTED }}
        />
      </div>
      <span
        className="font-[family-name:var(--font-jetbrains)] text-[9px] uppercase tracking-wider"
        style={{ color: MUTED }}
      >
        {width}px
      </span>
    </div>
  );
}

/* ─────────────────── Specimen Ring ─────────────────── */
function SpecimenRing({
  size = 24,
  borderWidth = 2,
  color = REFRACTION_BLUE,
}: {
  size?: number;
  borderWidth?: number;
  color?: string;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: `${borderWidth}px solid ${color}`,
        boxShadow: `0 0 ${size / 2}px ${color}33`,
      }}
    />
  );
}

/* ─────────────────── Resolve Section (blur to sharp on scroll) ─────────────────── */
function ResolveSection({
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
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ─────────────────── Resolve Card (individual blur resolve) ─────────────────── */
function ResolveCard({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, filter: "blur(4px)" }}
      animate={inView ? { opacity: 1, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────── Counting Number ─────────────────── */
function CountUp({ value, duration = 1.5 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const numericMatch = value.match(/(\d+)/);
    if (!numericMatch) {
      setDisplay(value);
      return;
    }
    const target = parseInt(numericMatch[1], 10);
    const prefix = value.slice(0, value.indexOf(numericMatch[1]));
    const suffix = value.slice(value.indexOf(numericMatch[1]) + numericMatch[1].length);
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = (now - startTime) / (duration * 1000);
      if (elapsed >= 1) {
        setDisplay(value);
        return;
      }
      const current = Math.floor(target * elapsed);
      setDisplay(`${prefix}${current}${suffix}`);
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, value, duration]);

  return <span ref={ref}>{display}</span>;
}

/* ════════════════════════════════════════════════════════════
   DARKFIELD PAGE
   ════════════════════════════════════════════════════════════ */
export default function DarkfieldPage() {
  const [irisScale, setIrisScale] = useState(0.3);

  useEffect(() => {
    const timer = setTimeout(() => setIrisScale(1), 200);
    return () => clearTimeout(timer);
  }, []);

  const magnifications = ["x100", "x400", "x1000", "x2000"];
  const accentColors = [REFRACTION_BLUE, BIO_GREEN, AMBER_SIGNAL, UV_VIOLET];

  return (
    <div
      className="relative min-h-screen overflow-hidden font-[family-name:var(--font-inter)]"
      style={{ background: LAB_BLACK, color: TEXT_COLOR }}
    >
      {/* ─── Global Keyframe Styles ─── */}
      <style>{`
        @keyframes bokeh-drift {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(15px, -20px); }
          50% { transform: translate(-10px, 15px); }
          75% { transform: translate(20px, 10px); }
        }
        @keyframes bokeh-drift-alt {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-20px, 10px); }
          50% { transform: translate(15px, -15px); }
          75% { transform: translate(-10px, -20px); }
        }
        @keyframes cellular-drift {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(8px, -12px) rotate(5deg); }
          66% { transform: translate(-6px, 8px) rotate(-3deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes iris-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .darkfield-card {
          transition: box-shadow 0.4s ease, border-color 0.4s ease;
        }
        .darkfield-card:hover {
          box-shadow: 0 0 30px rgba(77, 158, 255, 0.15), 0 0 60px rgba(77, 158, 255, 0.05);
          border-color: rgba(77, 158, 255, 0.5);
        }
        .tool-card:hover {
          box-shadow: 0 0 25px rgba(77, 158, 255, 0.12);
          border-color: rgba(77, 158, 255, 0.4);
        }
        .expertise-card {
          transition: box-shadow 0.4s ease, border-color 0.4s ease;
        }
        .expertise-card:hover {
          box-shadow: 0 0 40px rgba(77, 158, 255, 0.12), inset 0 0 30px rgba(77, 158, 255, 0.03);
          border-color: rgba(77, 158, 255, 0.5);
        }
      `}</style>

      {/* ════════════════════ HERO ════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Bokeh particles */}
        {BOKEH_PARTICLES.map((p, i) => (
          <div
            key={i}
            className="absolute pointer-events-none"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${p.color}${Math.round(p.opacity * 255).toString(16).padStart(2, "0")} 0%, transparent 70%)`,
              filter: `blur(${p.blur}px)`,
              opacity: p.opacity,
              animation: `${i % 2 === 0 ? "bokeh-drift" : "bokeh-drift-alt"} ${p.duration}s ease-in-out infinite`,
              animationDelay: `${p.delayX}s`,
            }}
          />
        ))}

        {/* Radial light-scatter background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${REFRACTION_BLUE}08 0%, transparent 70%)`,
          }}
        />

        {/* Aperture Iris decoration (animated scale) */}
        <div
          className="absolute pointer-events-none"
          style={{
            transition: "transform 1.5s cubic-bezier(0.22, 1, 0.36, 1)",
            transform: `scale(${irisScale})`,
            opacity: 0.4,
            animation: "iris-rotate 120s linear infinite",
          }}
        >
          <ApertureIris size={500} />
        </div>

        {/* Specimen slide frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex flex-col items-center"
        >
          {/* Circular specimen frame */}
          <div
            className="relative flex items-center justify-center mb-10"
            style={{
              width: 360,
              height: 360,
              borderRadius: "50%",
              border: `2px solid rgba(77, 158, 255, 0.6)`,
              boxShadow: `0 0 40px rgba(77, 158, 255, 0.15), inset 0 0 60px rgba(77, 158, 255, 0.05)`,
            }}
          >
            {/* Inner concentric rings */}
            <div
              className="absolute"
              style={{
                width: 280,
                height: 280,
                borderRadius: "50%",
                border: `1px solid rgba(77, 158, 255, 0.2)`,
              }}
            />
            <div
              className="absolute"
              style={{
                width: 200,
                height: 200,
                borderRadius: "50%",
                border: `1px solid rgba(77, 158, 255, 0.1)`,
              }}
            />

            {/* Title inside specimen */}
            <div className="text-center px-8 relative z-10">
              <motion.div
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.4, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <p
                  className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[0.3em] uppercase mb-4"
                  style={{ color: REFRACTION_BLUE }}
                >
                  Darkfield Microscopy
                </p>
                <h1
                  className="font-[family-name:var(--font-sora)] text-4xl sm:text-5xl font-bold leading-tight"
                  style={{
                    color: SPECIMEN_WHITE,
                    textShadow: `0 0 30px rgba(255, 255, 255, 0.3), 0 0 60px rgba(77, 158, 255, 0.15)`,
                  }}
                >
                  Revealing the
                  <br />
                  Invisible
                </h1>
                <p
                  className="mt-4 text-sm max-w-[240px] mx-auto leading-relaxed"
                  style={{ color: MUTED }}
                >
                  AI that sees what others cannot. Structures invisible under normal light blazing with luminosity.
                </p>
              </motion.div>
            </div>

            {/* Cellular floating shapes */}
            {[
              { x: -30, y: 50, s: 12, r: "45%", c: BIO_GREEN },
              { x: 140, y: -20, s: 8, r: "55%", c: REFRACTION_BLUE },
              { x: -50, y: 150, s: 10, r: "40%", c: UV_VIOLET },
              { x: 160, y: 140, s: 14, r: "50%", c: AMBER_SIGNAL },
            ].map((cell, i) => (
              <div
                key={i}
                className="absolute pointer-events-none"
                style={{
                  left: `calc(50% + ${cell.x}px)`,
                  top: `calc(50% + ${cell.y}px)`,
                  width: cell.s,
                  height: cell.s,
                  borderRadius: cell.r,
                  background: cell.c,
                  opacity: 0.2,
                  animation: `cellular-drift ${15 + i * 3}s ease-in-out infinite`,
                  animationDelay: `${-i * 2}s`,
                }}
              />
            ))}
          </div>

          {/* Scientific label */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex items-center gap-3 mb-2"
          >
            <span
              className="font-[family-name:var(--font-jetbrains)] text-[9px] tracking-[0.25em] uppercase"
              style={{ color: MUTED }}
            >
              AI Engineering Portfolio
            </span>
            <div style={{ width: 30, height: 1, background: MUTED }} />
            <span
              className="font-[family-name:var(--font-jetbrains)] text-[9px]"
              style={{ color: MUTED }}
            >
              2024-2025
            </span>
          </motion.div>
        </motion.div>

        {/* Stats as specimen readings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mt-12 flex gap-12 sm:gap-16"
        >
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div
                className="font-[family-name:var(--font-jetbrains)] text-[9px] tracking-[0.2em] uppercase mb-2"
                style={{ color: MUTED }}
              >
                Reading {String(i + 1).padStart(2, "0")}
              </div>
              <div
                className="font-[family-name:var(--font-sora)] text-3xl sm:text-4xl font-bold"
                style={{
                  color: SPECIMEN_WHITE,
                  textShadow: `0 0 20px ${accentColors[i]}40`,
                }}
              >
                <CountUp value={stat.value} />
              </div>
              <div
                className="font-[family-name:var(--font-jetbrains)] text-[10px] mt-1 tracking-wider uppercase"
                style={{ color: accentColors[i] }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 flex flex-col items-center gap-2"
        >
          <span
            className="font-[family-name:var(--font-jetbrains)] text-[9px] tracking-[0.2em] uppercase"
            style={{ color: MUTED }}
          >
            Begin Analysis
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M4 6L8 10L12 6"
                stroke={REFRACTION_BLUE}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* ════════════════════ PROJECTS ════════════════════ */}
      <ResolveSection
        id="projects"
        className="relative px-6 sm:px-10 py-28 max-w-6xl mx-auto"
      >
        {/* Section header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <SpecimenRing size={16} borderWidth={2} color={REFRACTION_BLUE} />
            <span
              className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[0.3em] uppercase"
              style={{ color: REFRACTION_BLUE }}
            >
              Illuminated Specimens
            </span>
          </div>
          <h2
            className="font-[family-name:var(--font-sora)] text-3xl sm:text-4xl font-bold"
            style={{
              color: SPECIMEN_WHITE,
              textShadow: `0 0 20px rgba(255, 255, 255, 0.1)`,
            }}
          >
            Projects
          </h2>
          <p className="mt-3 text-sm max-w-lg" style={{ color: MUTED }}>
            Each project revealed through darkfield illumination. Structures that emerge from the substrate, brilliant against absolute darkness.
          </p>
        </div>

        {/* Project cards */}
        <div className="flex flex-col gap-8">
          {projects.map((project, i) => {
            const specimenId = `SPEC-${String(i + 1).padStart(3, "0")}`;
            const mag = `x${[100, 200, 400, 800, 1000, 1600, 2000, 2500, 4000, 5000][i % 10]}`;
            const accent = accentColors[i % accentColors.length];

            return (
              <ResolveCard key={i} delay={i * 0.05}>
                <div
                  className="darkfield-card relative rounded-lg p-6 sm:p-8 overflow-hidden"
                  style={{
                    background: CARD_BLACK,
                    border: `1px solid rgba(77, 158, 255, 0.3)`,
                    boxShadow: `0 0 20px rgba(77, 158, 255, 0.08)`,
                  }}
                >
                  {/* Radial scatter glow */}
                  <div
                    className="absolute top-0 right-0 w-60 h-60 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 100% 0%, ${accent}08 0%, transparent 70%)`,
                    }}
                  />

                  {/* Header row */}
                  <div className="flex items-start justify-between mb-5 relative z-10">
                    <div className="flex items-center gap-4">
                      {/* Specimen ring accent */}
                      <SpecimenRing size={32} borderWidth={2} color={accent} />

                      {/* Project number + specimen info */}
                      <div>
                        <div className="flex items-center gap-3">
                          <span
                            className="font-[family-name:var(--font-sora)] text-lg sm:text-xl font-bold"
                            style={{ color: SPECIMEN_WHITE }}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span
                            className="font-[family-name:var(--font-jetbrains)] text-[9px] tracking-[0.15em] uppercase px-2 py-0.5 rounded"
                            style={{
                              color: accent,
                              border: `1px solid ${accent}40`,
                              background: `${accent}08`,
                            }}
                          >
                            {specimenId}
                          </span>
                          <span
                            className="font-[family-name:var(--font-jetbrains)] text-[9px] tracking-[0.15em]"
                            style={{ color: MUTED }}
                          >
                            {mag}
                          </span>
                        </div>
                        <h3
                          className="font-[family-name:var(--font-sora)] text-base sm:text-lg font-semibold mt-1 whitespace-pre-line leading-snug"
                          style={{ color: SPECIMEN_WHITE }}
                        >
                          {project.title}
                        </h3>
                      </div>
                    </div>

                    {/* Client + Year */}
                    <div className="text-right hidden sm:block">
                      <div
                        className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-wider uppercase"
                        style={{ color: MUTED }}
                      >
                        {project.client}
                      </div>
                      <div
                        className="font-[family-name:var(--font-jetbrains)] text-[10px] mt-0.5"
                        style={{ color: accent }}
                      >
                        {project.year}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p
                    className="text-sm leading-relaxed mb-4 relative z-10 max-w-2xl"
                    style={{ color: TEXT_COLOR }}
                  >
                    {project.description}
                  </p>

                  {/* Technical details */}
                  <div className="mb-5 relative z-10">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div
                        style={{ width: 4, height: 4, borderRadius: "50%", background: accent }}
                      />
                      <span
                        className="font-[family-name:var(--font-jetbrains)] text-[9px] tracking-[0.15em] uppercase"
                        style={{ color: accent }}
                      >
                        Technical Analysis
                      </span>
                    </div>
                    <p
                      className="text-xs leading-relaxed pl-6"
                      style={{ color: MUTED }}
                    >
                      {project.technical}
                    </p>
                  </div>

                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-2 mb-5 relative z-10">
                    {project.tech.map((t, j) => (
                      <span
                        key={j}
                        className="font-[family-name:var(--font-jetbrains)] text-[10px] px-2.5 py-1 rounded tracking-wider"
                        style={{
                          color: TEXT_COLOR,
                          background: `${REFRACTION_BLUE}10`,
                          border: `1px solid ${REFRACTION_BLUE}20`,
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Footer: GitHub link + Scale bar */}
                  <div className="flex items-center justify-between relative z-10">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-wider uppercase flex items-center gap-2 transition-colors duration-300"
                      style={{ color: REFRACTION_BLUE }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = SPECIMEN_WHITE)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = REFRACTION_BLUE)
                      }
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      View Source
                    </a>
                    <ScaleBar width={60} />
                  </div>
                </div>
              </ResolveCard>
            );
          })}
        </div>
      </ResolveSection>

      {/* ════════════════════ EXPERTISE ════════════════════ */}
      <ResolveSection
        id="expertise"
        className="relative px-6 sm:px-10 py-28 max-w-6xl mx-auto"
      >
        {/* Scatter glow bg */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 50% 40% at 30% 50%, ${BIO_GREEN}06 0%, transparent 70%)`,
          }}
        />

        {/* Section header */}
        <div className="mb-16 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <SpecimenRing size={16} borderWidth={2} color={BIO_GREEN} />
            <span
              className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[0.3em] uppercase"
              style={{ color: BIO_GREEN }}
            >
              Magnification Layers
            </span>
          </div>
          <h2
            className="font-[family-name:var(--font-sora)] text-3xl sm:text-4xl font-bold"
            style={{
              color: SPECIMEN_WHITE,
              textShadow: `0 0 20px rgba(255, 255, 255, 0.1)`,
            }}
          >
            Expertise
          </h2>
          <p className="mt-3 text-sm max-w-lg" style={{ color: MUTED }}>
            Increasing magnification reveals deeper layers of capability. Each level brings finer detail into focus.
          </p>
        </div>

        {/* Expertise cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
          {expertise.map((item, i) => {
            const accent = accentColors[i % accentColors.length];
            const magLabel = magnifications[i];

            return (
              <ResolveCard key={i} delay={i * 0.08}>
                <div
                  className="expertise-card relative rounded-lg p-6 sm:p-8 overflow-hidden h-full"
                  style={{
                    background: CARD_BLACK,
                    border: `1px solid ${accent}30`,
                    boxShadow: `0 0 20px ${accent}08`,
                  }}
                >
                  {/* Concentric circles decoration */}
                  <div className="absolute top-4 right-4 opacity-40 pointer-events-none">
                    <ConcentricCircles size={80} color={accent} />
                  </div>

                  {/* Magnification level */}
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="font-[family-name:var(--font-jetbrains)] text-xs font-bold tracking-wider"
                      style={{ color: accent }}
                    >
                      {magLabel}
                    </div>
                    <div style={{ width: 20, height: 1, background: `${accent}40` }} />
                    <span
                      className="font-[family-name:var(--font-jetbrains)] text-[9px] tracking-[0.15em] uppercase"
                      style={{ color: MUTED }}
                    >
                      Level {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Circular accent */}
                  <div className="flex items-start gap-4 relative z-10">
                    <div className="mt-1 flex-shrink-0">
                      <SpecimenRing size={20} borderWidth={2} color={accent} />
                    </div>
                    <div>
                      <h3
                        className="font-[family-name:var(--font-sora)] text-lg font-semibold mb-3"
                        style={{ color: SPECIMEN_WHITE }}
                      >
                        {item.title}
                      </h3>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: TEXT_COLOR }}
                      >
                        {item.body}
                      </p>
                    </div>
                  </div>

                  {/* Focus ring pulse */}
                  <div
                    className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full pointer-events-none"
                    style={{
                      border: `1px solid ${accent}15`,
                      animation: "pulse-glow 4s ease-in-out infinite",
                      animationDelay: `${i * 0.5}s`,
                    }}
                  />
                </div>
              </ResolveCard>
            );
          })}
        </div>
      </ResolveSection>

      {/* ════════════════════ TOOLS ════════════════════ */}
      <ResolveSection
        id="tools"
        className="relative px-6 sm:px-10 py-28 max-w-6xl mx-auto"
      >
        {/* Scatter glow bg */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 50% 40% at 70% 50%, ${UV_VIOLET}06 0%, transparent 70%)`,
          }}
        />

        {/* Section header */}
        <div className="mb-16 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <SpecimenRing size={16} borderWidth={2} color={AMBER_SIGNAL} />
            <span
              className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[0.3em] uppercase"
              style={{ color: AMBER_SIGNAL }}
            >
              Lab Instrument Panel
            </span>
          </div>
          <h2
            className="font-[family-name:var(--font-sora)] text-3xl sm:text-4xl font-bold"
            style={{
              color: SPECIMEN_WHITE,
              textShadow: `0 0 20px rgba(255, 255, 255, 0.1)`,
            }}
          >
            Tools & Technologies
          </h2>
          <p className="mt-3 text-sm max-w-lg" style={{ color: MUTED }}>
            Precision instruments calibrated for AI engineering. Each tool selected for its role in the analysis pipeline.
          </p>
        </div>

        {/* Tools grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
          {tools.map((tool, i) => {
            const accent = accentColors[i % accentColors.length];

            return (
              <ResolveCard key={i} delay={i * 0.06}>
                <div
                  className="tool-card relative rounded-lg p-5 sm:p-6 overflow-hidden transition-all duration-400"
                  style={{
                    background: CARD_BLACK,
                    border: `1px solid ${REFRACTION_BLUE}20`,
                    boxShadow: `0 0 15px ${REFRACTION_BLUE}05`,
                  }}
                >
                  {/* Small bokeh decoration */}
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      top: 12,
                      right: 16,
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      background: `radial-gradient(circle, ${accent}20 0%, transparent 70%)`,
                      filter: "blur(8px)",
                    }}
                  />

                  {/* Instrument header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: accent,
                        boxShadow: `0 0 8px ${accent}60`,
                      }}
                    />
                    <span
                      className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[0.2em] uppercase font-semibold"
                      style={{ color: accent }}
                    >
                      {tool.label}
                    </span>
                    <div className="flex-1" />
                    <span
                      className="font-[family-name:var(--font-jetbrains)] text-[9px]"
                      style={{ color: MUTED }}
                    >
                      INST-{String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Separator */}
                  <div
                    className="mb-4"
                    style={{ height: 1, background: `${REFRACTION_BLUE}15` }}
                  />

                  {/* Readings / items */}
                  <div className="flex flex-col gap-2">
                    {tool.items.map((item, j) => (
                      <div key={j} className="flex items-center gap-2.5">
                        <div
                          style={{
                            width: 3,
                            height: 3,
                            borderRadius: "50%",
                            background: `${REFRACTION_BLUE}60`,
                          }}
                        />
                        <span
                          className="font-[family-name:var(--font-inter)] text-[13px]"
                          style={{ color: TEXT_COLOR }}
                        >
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Bottom accent line */}
                  <div
                    className="absolute bottom-0 left-0 h-[1px]"
                    style={{
                      width: "100%",
                      background: `linear-gradient(90deg, transparent 0%, ${accent}30 50%, transparent 100%)`,
                    }}
                  />
                </div>
              </ResolveCard>
            );
          })}
        </div>
      </ResolveSection>

      {/* ════════════════════ FOOTER ════════════════════ */}
      <footer className="relative px-6 sm:px-10 py-24 overflow-hidden">
        {/* Light scatter bg */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 40% 50% at 50% 100%, ${REFRACTION_BLUE}06 0%, transparent 70%)`,
          }}
        />

        {/* Bokeh accents */}
        {[
          { x: "10%", y: "20%", s: 40, c: REFRACTION_BLUE, b: 15 },
          { x: "80%", y: "30%", s: 30, c: BIO_GREEN, b: 12 },
          { x: "50%", y: "60%", s: 50, c: UV_VIOLET, b: 20 },
        ].map((p, i) => (
          <div
            key={i}
            className="absolute pointer-events-none"
            style={{
              left: p.x,
              top: p.y,
              width: p.s,
              height: p.s,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${p.c}25 0%, transparent 70%)`,
              filter: `blur(${p.b}px)`,
              animation: `bokeh-drift ${18 + i * 4}s ease-in-out infinite`,
            }}
          />
        ))}

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Aperture decoration */}
          <div className="flex justify-center mb-10">
            <div style={{ opacity: 0.3 }}>
              <ApertureIris size={100} />
            </div>
          </div>

          {/* Analysis Complete */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div style={{ width: 40, height: 1, background: `${REFRACTION_BLUE}40` }} />
              <span
                className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[0.3em] uppercase"
                style={{ color: REFRACTION_BLUE }}
              >
                Analysis Complete
              </span>
              <div style={{ width: 40, height: 1, background: `${REFRACTION_BLUE}40` }} />
            </div>
            <h2
              className="font-[family-name:var(--font-sora)] text-2xl sm:text-3xl font-bold mb-3"
              style={{
                color: SPECIMEN_WHITE,
                textShadow: `0 0 20px rgba(255, 255, 255, 0.15)`,
              }}
            >
              Full Spectrum Revealed
            </h2>
            <p className="text-sm max-w-md mx-auto" style={{ color: MUTED }}>
              Every project begins with darkness. The right illumination reveals what was always there, waiting to be seen.
            </p>
          </div>

          {/* Lab Correspondence */}
          <div className="flex flex-col items-center gap-6 mb-14">
            <span
              className="font-[family-name:var(--font-jetbrains)] text-[9px] tracking-[0.3em] uppercase"
              style={{ color: MUTED }}
            >
              Lab Correspondence
            </span>
            <div className="flex gap-6">
              {[
                {
                  label: "GitHub",
                  href: "https://github.com/1aday",
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  ),
                },
                {
                  label: "LinkedIn",
                  href: "https://linkedin.com",
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  ),
                },
                {
                  label: "Email",
                  href: "mailto:hello@example.com",
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M22 7l-10 7L2 7" />
                    </svg>
                  ),
                },
              ].map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition-colors duration-300"
                  style={{ color: MUTED }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = REFRACTION_BLUE)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = MUTED)
                  }
                >
                  {link.icon}
                  <span className="font-[family-name:var(--font-jetbrains)] text-[11px] tracking-wider">
                    {link.label}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ borderTop: `1px solid ${REFRACTION_BLUE}15` }}
          >
            <div className="flex items-center gap-3">
              <SpecimenRing size={12} borderWidth={1.5} color={REFRACTION_BLUE} />
              <span
                className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-wider"
                style={{ color: MUTED }}
              >
                Illuminating since 2024
              </span>
            </div>
            <div className="flex items-center gap-4">
              <ScaleBar width={40} />
              <span
                className="font-[family-name:var(--font-jetbrains)] text-[9px] tracking-wider uppercase"
                style={{ color: MUTED }}
              >
                Darkfield v1.0
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* ─── Theme Switcher ─── */}
      <ThemeSwitcher current="/darkfield" variant="dark" />
    </div>
  );
}
