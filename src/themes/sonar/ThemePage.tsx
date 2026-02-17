"use client";

import { motion, useInView } from "motion/react";
import React, { useRef, useMemo, useState } from "react";
import { projects, stats, expertise, tools } from "@/app/data/projects";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";

/* ─── palette ─── */
const C = {
  bg: "#06061A",
  panel: "#12122A",
  phosphor: "#00FF88",
  amber: "#FFAA00",
  echo: "#3366CC",
  grid: "#0088AA",
  peak: "#FF3344",
  text: "#C8D0E0",
  muted: "#4A5570",
  gridLine: "rgba(0,136,170,0.12)",
};

const phosphorGlow =
  "0 0 10px #00FF88, 0 0 20px rgba(0,255,136,0.3), 0 0 40px rgba(0,255,136,0.1)";
const amberGlow =
  "0 0 8px #FFAA00, 0 0 16px rgba(255,170,0,0.25)";

/* ─── helpers ─── */
function generateWaveformPath(
  width: number,
  height: number,
  cycles: number,
  amplitude: number,
  offset = 0,
): string {
  const mid = height / 2;
  const points: string[] = [];
  const steps = 200;
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * width;
    const y =
      mid +
      Math.sin((i / steps) * cycles * Math.PI * 2 + offset) * amplitude +
      Math.sin((i / steps) * cycles * 1.5 * Math.PI * 2 + offset * 0.7) *
        (amplitude * 0.3);
    points.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return points.join(" ");
}

function SectionWrapper({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ x: -20, opacity: 0 }}
      animate={inView ? { x: 0, opacity: 1 } : {}}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ─── spectrum analyzer bars ─── */
function SpectrumBars({ seed, hover }: { seed: number; hover: boolean }) {
  const bars = useMemo(
    () => Array.from({ length: 12 }, (_, i) => 8 + Math.abs(Math.sin(seed * 1.7 + i * 0.9)) * 28),
    [seed],
  );

  return (
    <svg width="72" height="40" viewBox="0 0 72 40" className="flex-shrink-0">
      {bars.map((h, i) => (
        <rect
          key={i}
          x={i * 6}
          y={40 - h}
          width="4"
          rx="1"
          height={h}
          fill={i < 4 ? C.phosphor : i < 8 ? C.amber : C.peak}
          opacity={0.7}
        >
          <animate
            attributeName="height"
            values={`${h};${h * (hover ? 0.4 : 0.7)};${h};${h * (hover ? 1.3 : 1.1)};${h}`}
            dur={hover ? "0.6s" : "2s"}
            repeatCount="indefinite"
          />
          <animate
            attributeName="y"
            values={`${40 - h};${40 - h * (hover ? 0.4 : 0.7)};${40 - h};${40 - h * (hover ? 1.3 : 1.1)};${40 - h}`}
            dur={hover ? "0.6s" : "2s"}
            repeatCount="indefinite"
          />
        </rect>
      ))}
    </svg>
  );
}

/* ─── project waveform ─── */
function ProjectWaveform({ index, hover }: { index: number; hover: boolean }) {
  const cycles = 3 + (index % 6);
  const amplitude = 10 + (index % 4) * 4;
  const path = useMemo(
    () => generateWaveformPath(600, 48, cycles, amplitude, index * 1.2),
    [cycles, amplitude, index],
  );
  return (
    <svg
      width="100%"
      height="48"
      viewBox="0 0 600 48"
      preserveAspectRatio="none"
      className="w-full"
    >
      <path
        d={path}
        fill="none"
        stroke={C.phosphor}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity={0.6}
        pathLength="1"
        strokeDasharray="1"
        strokeDashoffset={hover ? undefined : "0"}
      >
        {hover && (
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="-1"
            dur="2s"
            repeatCount="indefinite"
          />
        )}
      </path>
      <path
        d={path}
        fill="none"
        stroke={C.phosphor}
        strokeWidth="3"
        strokeLinecap="round"
        opacity={0.15}
        filter="blur(4px)"
      />
    </svg>
  );
}

/* ─── main page ─── */
export default function SonarPage() {
  return (
    <main
      className="relative min-h-screen overflow-x-hidden font-[family-name:var(--font-sora)]"
      style={{ background: C.bg, color: C.text }}
    >
      {/* CRT scanline overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50"
        style={{
          background:
            "repeating-linear-gradient(to bottom, transparent, transparent 2px, rgba(0,255,136,0.03) 2px, rgba(0,255,136,0.03) 4px)",
        }}
      />

      {/* ════════════════ HERO ════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Oscilloscope grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(${C.gridLine} 1px, transparent 1px),
              linear-gradient(90deg, ${C.gridLine} 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Sonar ping rings */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
              style={{
                borderColor: C.phosphor,
                width: 80,
                height: 80,
                animation: `sonarPing 4s ease-out ${i * 1.3}s infinite`,
              }}
            />
          ))}
        </div>

        {/* Hero waveform */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-4">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-[120px]"
          >
            <motion.path
              d={generateWaveformPath(1200, 120, 6, 40)}
              fill="none"
              stroke={C.phosphor}
              strokeWidth="2"
              strokeLinecap="round"
              pathLength="1"
              initial={{ strokeDasharray: "1", strokeDashoffset: 1 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 3, ease: "easeInOut" }}
            />
            <motion.path
              d={generateWaveformPath(1200, 120, 6, 40)}
              fill="none"
              stroke={C.phosphor}
              strokeWidth="6"
              strokeLinecap="round"
              opacity={0.15}
              pathLength="1"
              filter="blur(6px)"
              initial={{ strokeDasharray: "1", strokeDashoffset: 1 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 3, ease: "easeInOut" }}
            />
          </svg>
        </div>

        {/* REC indicator */}
        <motion.div
          className="absolute top-8 right-8 flex items-center gap-2 font-[family-name:var(--font-jetbrains)] text-xs tracking-widest"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{
              background: C.peak,
              boxShadow: `0 0 6px ${C.peak}, 0 0 12px rgba(255,51,68,0.3)`,
              animation: "recBlink 1s step-end infinite",
            }}
          />
          <span style={{ color: C.peak }}>REC</span>
        </motion.div>

        {/* Hero content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
          >
            <p
              className="font-[family-name:var(--font-jetbrains)] text-xs tracking-[0.3em] uppercase mb-6"
              style={{ color: C.muted }}
            >
              Signal Acquired &bull; All Channels Active
            </p>
          </motion.div>

          <motion.h1
            className="font-[family-name:var(--font-space-grotesk)] text-5xl sm:text-7xl md:text-8xl font-bold leading-[0.95] mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 1 }}
          >
            <span style={{ color: C.phosphor, textShadow: phosphorGlow }}>
              Full-Stack
            </span>
            <br />
            <span style={{ color: C.text }}>AI Engineer</span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl max-w-2xl mx-auto mb-12"
            style={{ color: C.muted }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 1 }}
          >
            Building intelligent systems across the full spectrum — from vision
            models and generative AI to production-grade web platforms.
          </motion.p>

          {/* Channel readouts (stats) */}
          <motion.div
            className="flex flex-wrap justify-center gap-8 sm:gap-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.6, duration: 1 }}
          >
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                {/* Mini sine wave */}
                <svg width="40" height="20" viewBox="0 0 40 20">
                  <path
                    d={generateWaveformPath(40, 20, 2 + i, 6)}
                    fill="none"
                    stroke={i === 0 ? C.phosphor : i === 1 ? C.amber : C.echo}
                    strokeWidth="1.5"
                    opacity={0.6}
                  />
                </svg>
                <div className="text-left">
                  <div
                    className="font-[family-name:var(--font-jetbrains)] text-2xl font-bold"
                    style={{
                      color:
                        i === 0 ? C.phosphor : i === 1 ? C.amber : C.echo,
                      textShadow:
                        i === 0
                          ? phosphorGlow
                          : i === 1
                            ? amberGlow
                            : "none",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[0.2em] uppercase"
                    style={{ color: C.muted }}
                  >
                    CH.{i + 1} {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Frequency labels left */}
        <div
          className="absolute left-4 top-1/2 -translate-y-1/2 font-[family-name:var(--font-jetbrains)] text-[9px] tracking-wider hidden lg:flex flex-col gap-12"
          style={{ color: C.muted }}
        >
          <span>20 kHz</span>
          <span>4 kHz</span>
          <span>1 kHz</span>
          <span>200 Hz</span>
          <span>20 Hz</span>
        </div>
      </section>

      {/* ════════════════ PROJECTS ════════════════ */}
      <SectionWrapper id="projects" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ background: C.phosphor, boxShadow: `0 0 8px ${C.phosphor}` }} />
            <h2
              className="font-[family-name:var(--font-space-grotesk)] text-3xl sm:text-4xl font-bold"
              style={{ color: C.phosphor, textShadow: phosphorGlow }}
            >
              Recorded Signals
            </h2>
          </div>
          <p
            className="font-[family-name:var(--font-jetbrains)] text-xs tracking-[0.2em] uppercase ml-7"
            style={{ color: C.muted }}
          >
            {projects.length} channels captured
          </p>
        </div>

        <div className="space-y-4">
          {projects.map((project, i) => (
            <ProjectStrip key={i} project={project} index={i} />
          ))}
        </div>
      </SectionWrapper>

      {/* ════════════════ EXPERTISE ════════════════ */}
      <SectionWrapper id="expertise" className="py-24 relative">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-3 h-3 rounded-full" style={{ background: C.amber, boxShadow: `0 0 8px ${C.amber}` }} />
            <h2
              className="font-[family-name:var(--font-space-grotesk)] text-3xl sm:text-4xl font-bold"
              style={{ color: C.amber, textShadow: amberGlow }}
            >
              Frequency Bands
            </h2>
          </div>

          <div className="grid gap-5">
            {expertise.map((exp, i) => (
              <FrequencyBand key={i} exp={exp} index={i} />
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* ════════════════ TOOLS ════════════════ */}
      <SectionWrapper id="tools" className="py-24 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-3 h-3 rounded-full" style={{ background: C.echo, boxShadow: `0 0 8px ${C.echo}` }} />
            <h2
              className="font-[family-name:var(--font-space-grotesk)] text-3xl sm:text-4xl font-bold"
              style={{ color: C.echo }}
            >
              Signal Chain
            </h2>
          </div>

          <div className="relative">
            {/* Animated connection line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px -translate-y-1/2 z-0">
              <svg width="100%" height="2" className="overflow-visible">
                <line
                  x1="0"
                  y1="1"
                  x2="100%"
                  y2="1"
                  stroke={C.grid}
                  strokeWidth="1"
                  strokeDasharray="8 6"
                  opacity={0.5}
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="0"
                    to="-28"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </line>
              </svg>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 relative z-10">
              {tools.map((group, i) => (
                <ToolNode key={i} group={group} index={i} />
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* ════════════════ FOOTER ════════════════ */}
      <footer className="relative py-24 overflow-hidden">
        {/* Footer waveform */}
        <div className="absolute inset-x-0 top-0">
          <svg
            viewBox="0 0 1200 60"
            preserveAspectRatio="none"
            className="w-full h-[60px]"
          >
            <path
              d={generateWaveformPath(1200, 60, 10, 20)}
              fill="none"
              stroke={C.phosphor}
              strokeWidth="1"
              opacity={0.2}
            />
          </svg>
        </div>

        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <motion.h2
            className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-5xl font-bold mb-6"
            style={{
              color: C.phosphor,
              textShadow: phosphorGlow,
              animation: "phosphorPulse 3s ease-in-out infinite",
            }}
          >
            Signal Clear
          </motion.h2>
          <p className="text-lg mb-10" style={{ color: C.muted }}>
            Ready to establish a connection? Transmit your signal.
          </p>
          <a
            href="mailto:hello@example.com"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-lg font-[family-name:var(--font-space-grotesk)] font-semibold text-sm tracking-wider uppercase transition-all duration-300 hover:scale-105"
            style={{
              background: C.phosphor,
              color: C.bg,
              boxShadow: `0 0 20px rgba(0,255,136,0.3), 0 0 40px rgba(0,255,136,0.1)`,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="2" fill={C.bg} />
              <circle cx="8" cy="8" r="5" stroke={C.bg} strokeWidth="1.5" fill="none" opacity="0.5" />
              <circle cx="8" cy="8" r="7.5" stroke={C.bg} strokeWidth="1" fill="none" opacity="0.25" />
            </svg>
            Open Channel
          </a>

          {/* System log */}
          <div
            className="mt-16 font-[family-name:var(--font-jetbrains)] text-[10px] tracking-wider"
            style={{ color: C.muted }}
          >
            <p>SYS.LOG &mdash; {new Date().getFullYear()}.{String(new Date().getMonth() + 1).padStart(2, "0")}.{String(new Date().getDate()).padStart(2, "0")}</p>
            <p className="mt-1 opacity-60">
              SONAR v1.0 &bull; ALL CHANNELS NOMINAL &bull; SIGNAL STRENGTH: EXCELLENT
            </p>
          </div>
        </div>
      </footer>

      {/* ─── Global keyframe styles ─── */}
      <style>{`
        @keyframes sonarPing { 0% { transform: translate(-50%,-50%) scale(0); opacity: 0.4; } 100% { transform: translate(-50%,-50%) scale(3); opacity: 0; } }
        @keyframes recBlink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes phosphorPulse { 0%,100% { text-shadow: 0 0 10px #00ff88, 0 0 20px rgba(0,255,136,0.3), 0 0 40px rgba(0,255,136,0.1); } 50% { text-shadow: 0 0 15px #00ff88, 0 0 30px rgba(0,255,136,0.5), 0 0 60px rgba(0,255,136,0.2); } }
        @keyframes marchingAnts { to { stroke-dashoffset: -20; } }
        @keyframes waveScroll { to { stroke-dashoffset: -1; } }
      `}</style>

      <ThemeSwitcher current="/sonar" />
    </main>
  );
}

/* ── PROJECT STRIP ── */
function ProjectStrip({ project, index }: { project: (typeof projects)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ x: -30, opacity: 0 }}
      animate={inView ? { x: 0, opacity: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.06 }}
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <a
        href={project.github}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div
          className="relative mx-4 sm:mx-6 rounded-lg overflow-hidden transition-all duration-300"
          style={{
            background: C.panel,
            borderLeft: `3px solid ${C.phosphor}`,
            boxShadow: hovered
              ? `0 0 30px rgba(0,255,136,0.08), inset 0 0 30px rgba(0,255,136,0.02)`
              : "none",
          }}
        >
          {/* Grid background */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                linear-gradient(${C.gridLine} 1px, transparent 1px),
                linear-gradient(90deg, ${C.gridLine} 1px, transparent 1px)
              `,
              backgroundSize: "30px 30px",
            }}
          />

          <div className="relative p-5 sm:p-6">
            {/* Top row: index, title, year, client */}
            <div className="flex flex-wrap items-start gap-4 sm:gap-6 mb-4">
              <span
                className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-wider mt-1"
                style={{ color: C.muted }}
              >
                CH.{String(index + 1).padStart(2, "0")}
              </span>

              <div className="flex-1 min-w-0">
                <h3
                  className="font-[family-name:var(--font-space-grotesk)] text-lg sm:text-xl font-bold leading-tight whitespace-pre-line"
                  style={{ color: C.text }}
                >
                  {project.title}
                </h3>
              </div>

              <div className="flex items-center gap-4 flex-shrink-0">
                <span
                  className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-wider"
                  style={{ color: C.muted }}
                >
                  {project.client}
                </span>
                <span
                  className="font-[family-name:var(--font-jetbrains)] text-[10px] px-2 py-0.5 rounded"
                  style={{
                    color: C.amber,
                    border: `1px solid rgba(255,170,0,0.3)`,
                  }}
                >
                  {project.year}
                </span>
              </div>
            </div>

            {/* Waveform + spectrum */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1">
                <ProjectWaveform index={index} hover={hovered} />
              </div>
              <SpectrumBars seed={index + 1} hover={hovered} />
            </div>

            {/* Description */}
            <p
              className="text-sm leading-relaxed mb-3 max-w-3xl"
              style={{ color: C.muted }}
            >
              {project.description}
            </p>

            {/* Tech tags */}
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="font-[family-name:var(--font-jetbrains)] text-[10px] px-2.5 py-1 rounded"
                  style={{
                    color: C.phosphor,
                    background: "rgba(0,255,136,0.08)",
                    border: "1px solid rgba(0,255,136,0.15)",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </a>
    </motion.div>
  );
}

/* ── FREQUENCY BAND (Expertise) ── */
const bandLabels = ["LOW", "MID-LOW", "MID-HIGH", "HIGH"];
const bandColors = [C.echo, C.grid, C.amber, C.peak];
const bandFreqs = ["20\u2013200 Hz", "200\u20132k Hz", "2k\u20138k Hz", "8k\u201320k Hz"];

function FrequencyBand({ exp, index }: { exp: (typeof expertise)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const color = bandColors[index];

  const waveBg = useMemo(() => {
    const freq = 4 + index * 3;
    return `url("data:image/svg+xml,%3Csvg width='200' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='${encodeURIComponent(generateWaveformPath(200, 40, freq, 10))}' fill='none' stroke='${encodeURIComponent(color)}' stroke-width='0.5' opacity='0.08'/%3E%3C/svg%3E")`;
  }, [index, color]);

  return (
    <motion.div
      ref={ref}
      initial={{ x: -20, opacity: 0 }}
      animate={inView ? { x: 0, opacity: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative rounded-lg overflow-hidden"
      style={{
        background: C.panel,
        borderLeft: `3px solid ${color}`,
      }}
    >
      <div
        className="absolute inset-0"
        style={{ backgroundImage: waveBg, backgroundRepeat: "repeat" }}
      />
      <div className="relative p-6 flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="flex-shrink-0 w-24">
          <span
            className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[0.2em] font-bold"
            style={{ color }}
          >
            {bandLabels[index]}
          </span>
          <div
            className="font-[family-name:var(--font-jetbrains)] text-[9px] mt-0.5"
            style={{ color: C.muted }}
          >
            {bandFreqs[index]}
          </div>
        </div>
        <div className="flex-1">
          <h3
            className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold mb-2"
            style={{ color: C.text }}
          >
            {exp.title}
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: C.muted }}>
            {exp.body}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ── TOOL NODE (Signal Chain) ── */
function ToolNode({ group, index }: { group: (typeof tools)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ y: 20, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="relative"
    >
      {/* Connector arrow for md+ (except first) */}
      {index > 0 && (
        <div className="hidden lg:block absolute -left-4 top-1/2 -translate-y-1/2 w-4">
          <svg width="16" height="12" viewBox="0 0 16 12">
            <path
              d="M0 6 L12 6 M8 2 L14 6 L8 10"
              stroke={C.grid}
              strokeWidth="1"
              fill="none"
              opacity={0.4}
              strokeDasharray="3 2"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="-10"
                dur="1s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </div>
      )}

      <div
        className="rounded-lg p-4 h-full transition-all duration-300 hover:scale-[1.02]"
        style={{
          background: C.panel,
          border: `1px solid ${C.gridLine}`,
        }}
      >
        <div
          className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[0.15em] uppercase mb-3 flex items-center gap-2"
          style={{ color: C.grid }}
        >
          <svg width="8" height="8" viewBox="0 0 8 8">
            <rect
              width="8"
              height="8"
              rx="1"
              fill={C.grid}
              opacity={0.3}
            />
            <rect x="2" y="2" width="4" height="4" rx="0.5" fill={C.grid} />
          </svg>
          {group.label}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {group.items.map((item) => (
            <span
              key={item}
              className="font-[family-name:var(--font-sora)] text-xs px-2 py-0.5 rounded"
              style={{
                color: C.text,
                background: "rgba(0,136,170,0.08)",
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
