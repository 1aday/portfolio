"use client";

import React, { useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";

/* ─── Colors ─── */
const C = {
  bg: "#0D0D12",
  bgCard: "#12121A",
  infrared: "#FF3366",
  violet: "#7B2FBE",
  coldBlue: "#2845C7",
  orange: "#FF8A00",
  hotYellow: "#FFDD33",
  text: "#E6E8F0",
  muted: "#6E7186",
  border: "rgba(255,255,255,0.06)",
  gridLine: "rgba(255,255,255,0.04)",
};

const THERMAL_GRADIENT =
  "linear-gradient(90deg, #2845C7, #7B2FBE, #FF3366, #FF8A00, #FFDD33)";

/* ─── Fonts ─── */
const grotesk = "font-[family-name:var(--font-space-grotesk)]";
const inter = "font-[family-name:var(--font-inter)]";
const jetbrains = "font-[family-name:var(--font-jetbrains)]";

/* ─── Timestamp helper (deterministic to avoid hydration mismatch) ─── */
function ts(offset = 0): string {
  const h = 14 + Math.floor(offset / 60);
  const m = 32 + (offset % 60);
  const s = (offset * 7 + 13) % 60;
  const ms = (offset * 137 + 882) % 1000;
  return `[${String(h).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(ms).padStart(3, "0")}]`;
}

/* ─── Confidence badge ─── */
function confidenceForIndex(i: number): string {
  const base = 99.2 - i * 1.3 + (i % 3) * 0.4;
  return base.toFixed(1);
}

/* ─── Heat color for index (cold→hot) ─── */
function heatColor(i: number, total: number): string {
  const t = total <= 1 ? 1 : i / (total - 1);
  if (t < 0.25) return C.coldBlue;
  if (t < 0.5) return C.violet;
  if (t < 0.75) return C.infrared;
  if (t < 0.9) return C.orange;
  return C.hotYellow;
}

function heatGradient(i: number, total: number): string {
  const t = total <= 1 ? 1 : i / (total - 1);
  if (t < 0.33) return `linear-gradient(135deg, ${C.coldBlue}, ${C.violet})`;
  if (t < 0.66) return `linear-gradient(135deg, ${C.violet}, ${C.infrared})`;
  return `linear-gradient(135deg, ${C.infrared}, ${C.orange})`;
}

/* ─── Inject keyframes ─── */
function useInjectKeyframes() {
  useEffect(() => {
    const id = "thermal-keyframes";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      @keyframes thermalScanLine {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      @keyframes thermalPulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.4; transform: scale(1.8); }
      }
      @keyframes hotspotPing {
        0% { transform: scale(1); opacity: 0.8; }
        100% { transform: scale(3); opacity: 0; }
      }
      @keyframes thermalReveal {
        0% { clip-path: inset(0 100% 0 0); }
        100% { clip-path: inset(0 0% 0 0); }
      }
      @keyframes gridShimmer {
        0%, 100% { opacity: 0.03; }
        50% { opacity: 0.07; }
      }
      @keyframes reticleRotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes typewriter {
        0% { width: 0; }
        100% { width: 100%; }
      }
      @keyframes scanFlicker {
        0%, 95%, 100% { opacity: 1; }
        96% { opacity: 0.7; }
        97% { opacity: 1; }
        98% { opacity: 0.85; }
      }
      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };
  }, []);
}

/* ─── Grid Overlay Component ─── */
function GridOverlay({ spacing = 50, opacity = 0.04 }: { spacing?: number; opacity?: number }) {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255,255,255,${opacity}) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,${opacity}) 1px, transparent 1px)
        `,
        backgroundSize: `${spacing}px ${spacing}px`,
      }}
    />
  );
}

/* ─── Crosshair Reticle SVG ─── */
function Reticle({ size = 120, color = C.infrared }: { size?: number; color?: string }) {
  const half = size / 2;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      className="pointer-events-none"
      style={{ opacity: 0.25 }}
    >
      <circle cx={half} cy={half} r={half * 0.7} stroke={color} strokeWidth="1" strokeDasharray="4 4" />
      <circle cx={half} cy={half} r={half * 0.35} stroke={color} strokeWidth="0.5" />
      <line x1={0} y1={half} x2={size} y2={half} stroke={color} strokeWidth="0.5" strokeDasharray="2 6" />
      <line x1={half} y1={0} x2={half} y2={size} stroke={color} strokeWidth="0.5" strokeDasharray="2 6" />
      <circle cx={half} cy={half} r="2" fill={color} />
    </svg>
  );
}

/* ─── Scan Line (horizontal sweep) ─── */
function ScanLine() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute top-0 h-full w-[2px]"
        style={{
          background: `linear-gradient(to bottom, transparent, ${C.infrared}, transparent)`,
          animation: "thermalScanLine 4s linear infinite",
          boxShadow: `0 0 12px 4px rgba(255,51,102,0.3)`,
        }}
      />
    </div>
  );
}

/* ─── Hotspot Dot (pulsing) ─── */
function HotspotDot({ color = C.infrared, size = 8 }: { color?: string; size?: number }) {
  return (
    <span className="relative inline-flex" style={{ width: size, height: size }}>
      <span
        className="absolute inset-0 rounded-full"
        style={{
          backgroundColor: color,
          animation: "hotspotPing 2s cubic-bezier(0, 0, 0.2, 1) infinite",
        }}
      />
      <span
        className="relative inline-flex rounded-full"
        style={{ width: size, height: size, backgroundColor: color }}
      />
    </span>
  );
}

/* ─── Section wrapper with scan-in animation ─── */
function ThermalSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.section
      ref={ref}
      initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0 }}
      animate={
        inView
          ? { clipPath: "inset(0 0% 0 0)", opacity: 1 }
          : { clipPath: "inset(0 100% 0 0)", opacity: 0 }
      }
      transition={{ duration: 0.9, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ─── Temperature Scale Bar ─── */
function TempScale({ height = 200 }: { height?: number }) {
  return (
    <div className="flex flex-col items-center gap-1" style={{ height }}>
      <span className={`text-[10px] ${jetbrains}`} style={{ color: C.hotYellow }}>
        HOT
      </span>
      <div
        className="w-2 flex-1 rounded-full"
        style={{
          background: `linear-gradient(to bottom, ${C.hotYellow}, ${C.orange}, ${C.infrared}, ${C.violet}, ${C.coldBlue})`,
        }}
      />
      <span className={`text-[10px] ${jetbrains}`} style={{ color: C.coldBlue }}>
        COLD
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════════════════ */
function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden" style={{ background: C.bg }}>
      {/* Thermal gradient sweep bar at top */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: THERMAL_GRADIENT,
          backgroundSize: "200% 100%",
          animation: "gradientShift 6s ease infinite",
        }}
      />

      {/* Grid overlay */}
      <GridOverlay spacing={50} opacity={0.035} />

      {/* Scan line */}
      <ScanLine />

      {/* Corner readouts */}
      <div className="absolute top-6 left-6 z-10">
        <p className={`text-[11px] ${jetbrains}`} style={{ color: C.muted }}>
          {ts(0)} THERMAL_CAM_01
        </p>
        <p className={`text-[10px] ${jetbrains}`} style={{ color: C.muted }}>
          LAT 40.7128 / LNG -74.0060
        </p>
      </div>
      <div className="absolute top-6 right-6 z-10 text-right">
        <p className={`text-[11px] ${jetbrains}`} style={{ color: C.muted }}>
          SENSITIVITY: MAX
        </p>
        <p className={`text-[10px] ${jetbrains}`} style={{ color: C.infrared }}>
          <span style={{ animation: "scanFlicker 3s infinite" }}>REC</span>{" "}
          <HotspotDot color={C.infrared} size={6} />
        </p>
      </div>

      {/* Central content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
        {/* Reticle behind text */}
        <div className="absolute" style={{ opacity: 0.15 }}>
          <Reticle size={320} color={C.infrared} />
        </div>

        {/* Small label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className={`mb-4 flex items-center gap-2 text-xs ${jetbrains}`}
          style={{ color: C.muted }}
        >
          <HotspotDot color={C.infrared} size={6} />
          <span>INFRARED SPECTRUM ACTIVE</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className={`relative text-center text-5xl font-bold tracking-tight sm:text-7xl md:text-8xl ${grotesk}`}
          style={{ color: C.text }}
        >
          <span className="relative">
            THERMAL
            <br />
            DETECTION
            <br />
            <span
              style={{
                background: THERMAL_GRADIENT,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundSize: "200% 100%",
                animation: "gradientShift 4s ease infinite",
              }}
            >
              ACTIVE
            </span>
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className={`mt-6 max-w-md text-center text-sm ${inter}`}
          style={{ color: C.muted }}
        >
          AI products engineered to reveal what others cannot see.
          <br />
          We detect patterns, expose insights, illuminate value.
        </motion.p>

        {/* Thermal spectrum bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.2, duration: 1.0, ease: "easeOut" }}
          className="mt-10 h-[3px] w-64 origin-left rounded-full sm:w-96"
          style={{ background: THERMAL_GRADIENT }}
        />

        {/* Stats as detection readings */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="mt-12 flex flex-wrap justify-center gap-8 sm:gap-14"
        >
          {stats.map((s, i) => (
            <div key={s.label} className="text-center">
              <p className={`text-[10px] uppercase tracking-wider ${jetbrains}`} style={{ color: C.muted }}>
                {ts(i * 3)} DETECT
              </p>
              <p
                className={`mt-1 text-3xl font-bold ${grotesk}`}
                style={{ color: heatColor(i, stats.length) }}
              >
                {s.value}
              </p>
              <p className={`mt-1 text-xs ${inter}`} style={{ color: C.muted }}>
                {s.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom measurement bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="h-[2px]" style={{ background: THERMAL_GRADIENT }} />
        <div
          className={`flex justify-between px-6 py-2 text-[10px] ${jetbrains}`}
          style={{ color: C.muted, background: "rgba(13,13,18,0.8)" }}
        >
          <span>RANGE: 0.1 - 14.0 um</span>
          <span>NETD: &lt;40mK</span>
          <span>FPS: 60</span>
          <span>RES: 1920x1080</span>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   PROJECTS — Detection Panels
   ═══════════════════════════════════════════════════ */
function ProjectCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const heat = heatGradient(index, projects.length);
  const conf = confidenceForIndex(index);

  return (
    <motion.div
      ref={ref}
      initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0 }}
      animate={
        inView
          ? { clipPath: "inset(0 0% 0 0)", opacity: 1 }
          : { clipPath: "inset(0 100% 0 0)", opacity: 0 }
      }
      transition={{ duration: 0.7, delay: (index % 2) * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative overflow-hidden rounded-md"
      style={{ background: C.bgCard }}
    >
      {/* Gradient border top */}
      <div className="h-[2px]" style={{ background: heat }} />

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Content */}
      <div className="relative p-5 sm:p-6">
        {/* Header row: timestamp + confidence */}
        <div className="mb-3 flex items-center justify-between">
          <span className={`text-[10px] ${jetbrains}`} style={{ color: C.muted }}>
            {ts(index * 5)} DETECT #{String(index + 1).padStart(3, "0")}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${jetbrains}`}
            style={{
              background: "rgba(255,51,102,0.12)",
              color: C.infrared,
              border: `1px solid rgba(255,51,102,0.2)`,
            }}
          >
            CONF: {conf}%
          </span>
        </div>

        {/* Client + year */}
        <div className="mb-2 flex items-center gap-3">
          <HotspotDot color={heatColor(index, projects.length)} size={6} />
          <span className={`text-[11px] uppercase tracking-wider ${jetbrains}`} style={{ color: C.muted }}>
            {project.client} / {project.year}
          </span>
        </div>

        {/* Title */}
        <h3
          className={`mb-2 text-lg font-bold leading-tight sm:text-xl ${grotesk}`}
          style={{ color: C.text, whiteSpace: "pre-line" }}
        >
          {project.title}
        </h3>

        {/* Description */}
        <p className={`mb-3 text-sm leading-relaxed ${inter}`} style={{ color: C.muted }}>
          {project.description}
        </p>

        {/* Technical */}
        <div
          className="mb-4 rounded-sm border-l-2 py-1 pl-3"
          style={{ borderColor: heatColor(index, projects.length) }}
        >
          <p className={`text-xs leading-relaxed ${inter}`} style={{ color: "rgba(230,232,240,0.6)" }}>
            {project.technical}
          </p>
        </div>

        {/* Tech tags */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <span
              key={t}
              className={`rounded-sm px-2 py-0.5 text-[10px] ${jetbrains}`}
              style={{
                background: "rgba(255,255,255,0.04)",
                color: "rgba(230,232,240,0.7)",
                border: "1px solid rgba(255,255,255,0.06)",
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
          className={`inline-flex items-center gap-1.5 text-xs transition-colors ${jetbrains}`}
          style={{ color: C.infrared }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <span>SOURCE CODE</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </a>
      </div>

      {/* Hover glow effect */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          boxShadow: `inset 0 0 40px rgba(255,51,102,0.06), 0 0 30px rgba(255,138,0,0.08)`,
        }}
      />
    </motion.div>
  );
}

function ProjectsSection() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32" style={{ background: C.bg }}>
      <GridOverlay spacing={50} opacity={0.025} />
      <ScanLine />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* Section header */}
        <ThermalSection>
          <div className="mb-12">
            <div className="mb-3 flex items-center gap-3">
              <HotspotDot color={C.infrared} />
              <span className={`text-[11px] uppercase tracking-widest ${jetbrains}`} style={{ color: C.infrared }}>
                Detection Log
              </span>
            </div>
            <h2 className={`text-3xl font-bold sm:text-5xl ${grotesk}`} style={{ color: C.text }}>
              Thermal Detections
            </h2>
            <p className={`mt-3 max-w-lg text-sm ${inter}`} style={{ color: C.muted }}>
              Each project scanned and verified. Heat signatures confirm active systems, live deployments, measurable outcomes.
            </p>
            <div className="mt-4 h-[2px] w-48" style={{ background: THERMAL_GRADIENT }} />
          </div>
        </ThermalSection>

        {/* Project grid */}
        <div className="grid gap-5 md:grid-cols-2">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   EXPERTISE — Thermal Layer Readings
   ═══════════════════════════════════════════════════ */
function ExpertiseSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-24 sm:py-32"
      style={{ background: "#0B0B10" }}
    >
      <GridOverlay spacing={60} opacity={0.03} />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <ThermalSection>
          <div className="mb-12">
            <div className="mb-3 flex items-center gap-3">
              <HotspotDot color={C.orange} />
              <span className={`text-[11px] uppercase tracking-widest ${jetbrains}`} style={{ color: C.orange }}>
                Sensor Readings
              </span>
            </div>
            <h2 className={`text-3xl font-bold sm:text-5xl ${grotesk}`} style={{ color: C.text }}>
              Thermal Layers
            </h2>
            <p className={`mt-3 max-w-lg text-sm ${inter}`} style={{ color: C.muted }}>
              Core competencies detected across the infrared spectrum. Each layer reveals a distinct heat signature.
            </p>
            <div className="mt-4 h-[2px] w-48" style={{ background: THERMAL_GRADIENT }} />
          </div>
        </ThermalSection>

        <div className="grid gap-5 md:grid-cols-2">
          {expertise.map((item, i) => {
            const heat = heatColor(i, expertise.length);
            return (
              <motion.div
                key={item.title}
                initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0 }}
                animate={
                  inView
                    ? { clipPath: "inset(0 0% 0 0)", opacity: 1 }
                    : { clipPath: "inset(0 100% 0 0)", opacity: 0 }
                }
                transition={{ duration: 0.7, delay: i * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
                className="group relative overflow-hidden rounded-md"
                style={{ background: C.bgCard }}
              >
                {/* Top gradient accent */}
                <div className="h-[2px]" style={{ background: `linear-gradient(90deg, ${heat}, transparent)` }} />

                <div className="flex gap-4 p-5 sm:p-6">
                  {/* Temperature scale sidebar */}
                  <div className="hidden flex-shrink-0 sm:block">
                    <TempScale height={140} />
                  </div>

                  <div className="flex-1">
                    {/* Detection ID */}
                    <div className="mb-3 flex items-center gap-2">
                      <HotspotDot color={heat} size={6} />
                      <span
                        className={`text-[10px] uppercase tracking-widest ${jetbrains}`}
                        style={{ color: heat }}
                      >
                        LAYER #{String(i + 1).padStart(2, "0")} / {ts(i * 8)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      className={`mb-2 text-lg font-bold ${grotesk}`}
                      style={{ color: C.text }}
                    >
                      {item.title}
                    </h3>

                    {/* Body */}
                    <p className={`text-sm leading-relaxed ${inter}`} style={{ color: C.muted }}>
                      {item.body}
                    </p>

                    {/* Heat level indicator */}
                    <div className="mt-4 flex items-center gap-2">
                      <div className="h-1 flex-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${60 + i * 12}%`,
                            background: `linear-gradient(90deg, ${C.coldBlue}, ${heat})`,
                          }}
                        />
                      </div>
                      <span className={`text-[10px] ${jetbrains}`} style={{ color: heat }}>
                        {(32 + i * 8).toFixed(1)}C
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hover glow */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    boxShadow: `inset 0 0 30px rgba(255,51,102,0.05)`,
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   TOOLS — Instrument Readout Cards
   ═══════════════════════════════════════════════════ */
function ToolsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-24 sm:py-32"
      style={{ background: C.bg }}
    >
      <GridOverlay spacing={50} opacity={0.03} />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <ThermalSection>
          <div className="mb-12">
            <div className="mb-3 flex items-center gap-3">
              <HotspotDot color={C.hotYellow} />
              <span className={`text-[11px] uppercase tracking-widest ${jetbrains}`} style={{ color: C.hotYellow }}>
                Instrument Panel
              </span>
            </div>
            <h2 className={`text-3xl font-bold sm:text-5xl ${grotesk}`} style={{ color: C.text }}>
              Readout Data
            </h2>
            <p className={`mt-3 max-w-lg text-sm ${inter}`} style={{ color: C.muted }}>
              Full instrument calibration across all operational frequencies. Hardware and software signatures detected.
            </p>
            <div className="mt-4 h-[2px] w-48" style={{ background: THERMAL_GRADIENT }} />
          </div>
        </ThermalSection>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool, i) => {
            const heat = heatColor(i, tools.length);
            return (
              <motion.div
                key={tool.label}
                initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0 }}
                animate={
                  inView
                    ? { clipPath: "inset(0 0% 0 0)", opacity: 1 }
                    : { clipPath: "inset(0 100% 0 0)", opacity: 0 }
                }
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
                className="group relative overflow-hidden rounded-md"
                style={{ background: C.bgCard }}
              >
                {/* Grid background */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, rgba(255,255,255,0.015) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(255,255,255,0.015) 1px, transparent 1px)
                    `,
                    backgroundSize: "30px 30px",
                  }}
                />

                <div className="relative p-5">
                  {/* Header */}
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-sm"
                        style={{ background: heat }}
                      />
                      <h3 className={`text-sm font-bold uppercase tracking-wider ${grotesk}`} style={{ color: C.text }}>
                        {tool.label}
                      </h3>
                    </div>
                    <span className={`text-[10px] ${jetbrains}`} style={{ color: C.muted }}>
                      CH.{String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="space-y-2">
                    {tool.items.map((item, j) => (
                      <div key={item} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] ${jetbrains}`}
                            style={{ color: C.muted, width: 20 }}
                          >
                            {String(j + 1).padStart(2, "0")}
                          </span>
                          <span className={`text-xs ${inter}`} style={{ color: "rgba(230,232,240,0.8)" }}>
                            {item}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div
                            className="h-1 rounded-full"
                            style={{
                              width: `${30 + j * 12}px`,
                              background: `linear-gradient(90deg, ${C.coldBlue}60, ${heat})`,
                            }}
                          />
                          <span
                            className={`text-[9px] ${jetbrains}`}
                            style={{ color: heat }}
                          >
                            {(0.7 + j * 0.08).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom thermal bar */}
                  <div className="mt-4 h-[1px]" style={{ background: `linear-gradient(90deg, ${heat}40, transparent)` }} />
                </div>

                {/* Hover glow */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    boxShadow: `inset 0 0 25px ${heat}10, 0 0 20px ${heat}08`,
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   FOOTER — Scan Complete
   ═══════════════════════════════════════════════════ */
function FooterSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <footer
      ref={ref}
      className="relative overflow-hidden py-20 sm:py-28"
      style={{ background: "#08080D" }}
    >
      <GridOverlay spacing={60} opacity={0.02} />

      <div className="relative z-10 mx-auto max-w-4xl px-6">
        {/* Scan complete banner */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mx-auto mb-10 h-[3px] max-w-md origin-left"
          style={{ background: THERMAL_GRADIENT }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center"
        >
          {/* Reticle */}
          <div className="mx-auto mb-6 flex justify-center" style={{ opacity: 0.2 }}>
            <Reticle size={80} color={C.infrared} />
          </div>

          {/* Status */}
          <div className="mb-2 flex items-center justify-center gap-2">
            <HotspotDot color="#22C55E" size={6} />
            <span className={`text-[11px] uppercase tracking-widest ${jetbrains}`} style={{ color: "#22C55E" }}>
              Scan Complete
            </span>
          </div>

          <h2 className={`text-3xl font-bold sm:text-4xl ${grotesk}`} style={{ color: C.text }}>
            All Signatures Verified
          </h2>

          <p className={`mx-auto mt-3 max-w-md text-sm ${inter}`} style={{ color: C.muted }}>
            Thermal scan concluded. Contact to initiate next detection sequence.
          </p>
        </motion.div>

        {/* Contact links as transmission log */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mx-auto mt-10 max-w-sm"
        >
          <div
            className="rounded-md border p-5"
            style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
          >
            <p className={`mb-3 text-[10px] uppercase tracking-widest ${jetbrains}`} style={{ color: C.infrared }}>
              Transmission Log
            </p>

            {[
              { label: "EMAIL", value: "hello@grox.studio", href: "mailto:hello@grox.studio" },
              { label: "GITHUB", value: "github.com/1aday", href: "https://github.com/1aday" },
              { label: "SITE", value: "grox.studio", href: "https://grox.studio" },
            ].map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link flex items-center justify-between border-t py-2.5 transition-colors"
                style={{ borderColor: "rgba(255,255,255,0.04)" }}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] ${jetbrains}`} style={{ color: C.muted }}>
                    {ts(30 + i * 2)}
                  </span>
                  <span className={`text-[10px] uppercase tracking-wider ${jetbrains}`} style={{ color: C.muted }}>
                    {link.label}
                  </span>
                </div>
                <span
                  className={`text-xs transition-colors ${inter}`}
                  style={{ color: C.infrared }}
                >
                  {link.value}
                </span>
              </a>
            ))}
          </div>
        </motion.div>

        {/* Detection log footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <div
            className={`mx-auto max-w-lg space-y-1 text-[10px] ${jetbrains}`}
            style={{ color: "rgba(110,113,134,0.5)" }}
          >
            <p>{ts(45)} END_OF_LOG</p>
            <p>{ts(45)} TOTAL_DETECTIONS: {projects.length}</p>
            <p>{ts(45)} THERMAL_LAYERS: {expertise.length}</p>
            <p>{ts(45)} INSTRUMENTS: {tools.length}</p>
            <p className="pt-2" style={{ color: C.muted }}>
              {ts(46)} SESSION_TERMINATED
            </p>
          </div>

          {/* Final gradient bar */}
          <div className="mx-auto mt-8 h-[2px] w-32" style={{ background: THERMAL_GRADIENT }} />
          <p className={`mt-4 text-[10px] ${jetbrains}`} style={{ color: "rgba(110,113,134,0.4)" }}>
            THERMAL v1.0 / GROX STUDIO / 2025
          </p>
        </motion.div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════ */
export default function ThermalPage() {
  useInjectKeyframes();

  return (
    <main
      className="relative min-h-screen"
      style={{
        background: C.bg,
        color: C.text,
        animation: "scanFlicker 8s infinite",
      }}
    >
      <HeroSection />
      <ProjectsSection />
      <ExpertiseSection />
      <ToolsSection />
      <FooterSection />
      <ThemeSwitcher current="/thermal" variant="dark" />
    </main>
  );
}
