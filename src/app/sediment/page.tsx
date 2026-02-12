"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";

/* ================================================================
   SEDIMENT — Deep Ocean Core Sample Portfolio Theme
   A vertical journey through ocean floor sediment layers.
   Central core column layout with depth markers and fossil icons.
   ================================================================ */

/* ─── Color Palette ─── */
const C = {
  bg: "#0A1628",
  surface: "#D4B896",
  shallow: "#A0522D",
  mid: "#4A5C4F",
  deep: "#4A6FA5",
  core: "#1A1A2E",
  cream: "#F0E6D2",
  white: "#FFFFFF",
  accent: "#4A6FA5",
  oceanTop: "#1B3A5C",
  oceanMid: "#0F2844",
  abyss: "#060E1A",
  sand: "#C4A86B",
  clay: "#8B5E3C",
  shale: "#3A4A5C",
  basalt: "#252533",
};

/* ─── Sediment layer colors for projects ─── */
const LAYER_COLORS = [
  { bg: "#D4B896", text: "#1A1A2E", label: "Sandy Silt", pattern: "dots" },
  { bg: "#C4986B", text: "#1A1A2E", label: "Calcareous Ooze", pattern: "circles" },
  { bg: "#A0522D", text: "#F0E6D2", label: "Red Clay", pattern: "dashes" },
  { bg: "#8B6F4E", text: "#F0E6D2", label: "Terrigenous Mud", pattern: "cross" },
  { bg: "#4A5C4F", text: "#F0E6D2", label: "Glauconite Sand", pattern: "dots" },
  { bg: "#5A6E80", text: "#F0E6D2", label: "Siliceous Ooze", pattern: "circles" },
  { bg: "#4A6FA5", text: "#F0E6D2", label: "Pelagic Clay", pattern: "dashes" },
  { bg: "#3A4A5C", text: "#F0E6D2", label: "Turbidite", pattern: "cross" },
  { bg: "#2A3444", text: "#F0E6D2", label: "Volcanic Ash", pattern: "dots" },
  { bg: "#1A1A2E", text: "#F0E6D2", label: "Basement Rock", pattern: "dashes" },
];

/* ─── Depth markers for projects ─── */
const DEPTHS = ["0m", "50m", "120m", "280m", "450m", "680m", "920m", "1200m", "1600m", "2100m"];

/* ─── Fossil icon names ─── */
const FOSSIL_TYPES = [
  "ammonite", "trilobite", "fish", "leaf", "shell",
  "coral", "ammonite", "trilobite", "fish", "leaf",
];

/* ─── Rock pattern types for expertise ─── */
const ROCK_PATTERNS = ["sandstone", "limestone", "shale", "basalt"];

/* ================================================================
   SVG COMPONENTS — Fossils, Patterns, Decorations
   ================================================================ */

function FossilIcon({ type, size = 40, color = C.cream }: { type: string; size?: number; color?: string }) {
  const s = size;
  switch (type) {
    case "ammonite":
      return (
        <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
          <path
            d="M20 4C11.2 4 4 11.2 4 20s7.2 16 16 16c2 0 3.5-1.5 3.5-3.5 0-.9-.3-1.7-.9-2.3-.5-.6-.8-1.3-.8-2.2 0-1.9 1.6-3.5 3.5-3.5H28c6.6 0 12-5.4 12-12C40 6 31 0 20 4z"
            stroke={color}
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M20 8c-6.6 0-12 5.4-12 12"
            stroke={color}
            strokeWidth="1"
            strokeDasharray="2 2"
          />
          <circle cx="20" cy="20" r="3" stroke={color} strokeWidth="1" fill="none" />
          <path d="M20 17C20 12 15 8 15 8" stroke={color} strokeWidth="0.8" fill="none" />
          <path d="M17 20C12 20 8 25 8 25" stroke={color} strokeWidth="0.8" fill="none" />
          <path d="M20 23C20 28 25 32 25 32" stroke={color} strokeWidth="0.8" fill="none" />
          <path
            d="M20 6a14 14 0 0 0-14 14"
            stroke={color}
            strokeWidth="0.6"
            strokeDasharray="3 3"
            fill="none"
          />
          <path
            d="M20 10a10 10 0 0 0-10 10"
            stroke={color}
            strokeWidth="0.6"
            strokeDasharray="2 2"
            fill="none"
          />
        </svg>
      );
    case "trilobite":
      return (
        <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
          <ellipse cx="20" cy="20" rx="10" ry="16" stroke={color} strokeWidth="1.5" fill="none" />
          <line x1="20" y1="4" x2="20" y2="36" stroke={color} strokeWidth="1" />
          <path d="M10 10h20M10 15h20M10 20h20M10 25h20M10 30h20" stroke={color} strokeWidth="0.7" strokeDasharray="1.5 1" />
          <ellipse cx="20" cy="8" rx="6" ry="4" stroke={color} strokeWidth="1.2" fill="none" />
          <circle cx="17" cy="7.5" r="1" fill={color} />
          <circle cx="23" cy="7.5" r="1" fill={color} />
        </svg>
      );
    case "fish":
      return (
        <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
          <path d="M8 20c0-6 6-12 16-12 4 0 6 2 8 4l-4 8 4 8c-2 2-4 4-8 4-10 0-16-6-16-12z" stroke={color} strokeWidth="1.5" fill="none" />
          <circle cx="26" cy="17" r="1.5" fill={color} />
          <path d="M12 14l4 2-4 2M16 12l4 3-4 3M20 11l4 3.5-4 3.5" stroke={color} strokeWidth="0.7" />
          <path d="M12 22l4 2-4 2M16 24l4-3M20 25l4-3.5" stroke={color} strokeWidth="0.7" />
          <line x1="10" y1="20" x2="28" y2="20" stroke={color} strokeWidth="0.8" strokeDasharray="2 1" />
        </svg>
      );
    case "leaf":
      return (
        <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
          <path d="M20 4C10 10 6 20 8 30c2 4 6 6 12 6 6 0 10-2 12-6 2-10-2-20-12-26z" stroke={color} strokeWidth="1.5" fill="none" />
          <line x1="20" y1="6" x2="20" y2="34" stroke={color} strokeWidth="1" />
          <path d="M14 12l6 4M26 12l-6 4M12 18l8 4M28 18l-8 4M14 24l6 4M26 24l-6 4" stroke={color} strokeWidth="0.7" />
        </svg>
      );
    case "shell":
      return (
        <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
          <path d="M20 4c-8 0-14 8-14 16s6 16 14 16 14-8 14-16S28 4 20 4z" stroke={color} strokeWidth="1.2" fill="none" />
          <path d="M20 4c-4 4-6 12-6 16s2 12 6 16" stroke={color} strokeWidth="0.8" fill="none" />
          <path d="M20 4c4 4 6 12 6 16s-2 12-6 16" stroke={color} strokeWidth="0.8" fill="none" />
          <path d="M8 16h24M8 24h24M10 12h20M10 28h20" stroke={color} strokeWidth="0.6" strokeDasharray="2 2" />
        </svg>
      );
    case "coral":
      return (
        <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
          <path d="M20 36V20" stroke={color} strokeWidth="1.5" />
          <path d="M20 20c0-6-4-10-8-14" stroke={color} strokeWidth="1.2" fill="none" />
          <path d="M20 20c0-6 4-10 8-14" stroke={color} strokeWidth="1.2" fill="none" />
          <path d="M20 24c-3-2-8-2-12-1" stroke={color} strokeWidth="1" fill="none" />
          <path d="M20 24c3-2 8-2 12-1" stroke={color} strokeWidth="1" fill="none" />
          <path d="M12 6c-1-2-3-3-5-2M28 6c1-2 3-3 5-2" stroke={color} strokeWidth="0.8" fill="none" />
          <circle cx="12" cy="6" r="1.5" stroke={color} strokeWidth="0.7" fill="none" />
          <circle cx="28" cy="6" r="1.5" stroke={color} strokeWidth="0.7" fill="none" />
          <circle cx="7" cy="4" r="1" stroke={color} strokeWidth="0.6" fill="none" />
          <circle cx="33" cy="4" r="1" stroke={color} strokeWidth="0.6" fill="none" />
          <circle cx="8" cy="23" r="1.5" stroke={color} strokeWidth="0.6" fill="none" />
          <circle cx="32" cy="23" r="1.5" stroke={color} strokeWidth="0.6" fill="none" />
        </svg>
      );
    default:
      return (
        <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="14" stroke={color} strokeWidth="1.2" fill="none" />
          <circle cx="20" cy="20" r="8" stroke={color} strokeWidth="0.8" strokeDasharray="2 2" fill="none" />
          <circle cx="20" cy="20" r="2" fill={color} />
        </svg>
      );
  }
}

/* ─── SVG pattern backgrounds ─── */
function SedimentPattern({ pattern, color, opacity = 0.15 }: { pattern: string; color: string; opacity?: number }) {
  const id = `sed-${pattern}-${color.replace("#", "")}`;
  return (
    <svg className="absolute inset-0 w-full h-full" style={{ opacity }}>
      <defs>
        {pattern === "dots" && (
          <pattern id={id} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1.5" fill={color} />
          </pattern>
        )}
        {pattern === "circles" && (
          <pattern id={id} x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="15" cy="15" r="6" stroke={color} strokeWidth="0.5" fill="none" />
          </pattern>
        )}
        {pattern === "dashes" && (
          <pattern id={id} x="0" y="0" width="16" height="8" patternUnits="userSpaceOnUse">
            <line x1="2" y1="4" x2="14" y2="4" stroke={color} strokeWidth="1" />
          </pattern>
        )}
        {pattern === "cross" && (
          <pattern id={id} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <line x1="0" y1="10" x2="20" y2="10" stroke={color} strokeWidth="0.5" />
            <line x1="10" y1="0" x2="10" y2="20" stroke={color} strokeWidth="0.5" />
          </pattern>
        )}
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/* ─── Rock-type pattern for expertise cards ─── */
function RockPattern({ type, color }: { type: string; color: string }) {
  const id = `rock-${type}`;
  return (
    <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.08 }}>
      <defs>
        {type === "sandstone" && (
          <pattern id={id} width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.8" fill={color} />
            <circle cx="5" cy="5" r="0.6" fill={color} />
            <circle cx="4" cy="1" r="0.4" fill={color} />
          </pattern>
        )}
        {type === "limestone" && (
          <pattern id={id} width="20" height="12" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="20" height="6" stroke={color} strokeWidth="0.3" fill="none" />
            <rect x="5" y="6" width="20" height="6" stroke={color} strokeWidth="0.3" fill="none" />
          </pattern>
        )}
        {type === "shale" && (
          <pattern id={id} width="24" height="4" patternUnits="userSpaceOnUse">
            <line x1="0" y1="2" x2="10" y2="2" stroke={color} strokeWidth="0.5" />
            <line x1="14" y1="2" x2="24" y2="2" stroke={color} strokeWidth="0.3" />
          </pattern>
        )}
        {type === "basalt" && (
          <pattern id={id} width="20" height="20" patternUnits="userSpaceOnUse">
            <polygon points="10,2 18,7 18,15 10,20 2,15 2,7" stroke={color} strokeWidth="0.4" fill="none" />
          </pattern>
        )}
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/* ─── Core cross-section SVG for hero ─── */
function CoreSectionSVG() {
  return (
    <svg width="120" height="400" viewBox="0 0 120 400" fill="none" className="opacity-80">
      {/* Ocean surface */}
      <rect x="10" y="0" width="100" height="60" rx="4" fill={C.oceanTop} />
      <path d="M10 15Q30 8 50 15T90 15T110 12" stroke="#5B9BD5" strokeWidth="1" opacity="0.5" />
      <path d="M10 25Q35 18 55 25T95 25T110 22" stroke="#5B9BD5" strokeWidth="0.8" opacity="0.4" />
      <text x="60" y="42" textAnchor="middle" fill={C.cream} fontSize="7" fontFamily="var(--font-space-grotesk)">OCEAN</text>

      {/* Seafloor boundary */}
      <path d="M10 60Q30 55 60 62T110 58" stroke={C.sand} strokeWidth="1.5" />

      {/* Sandy layer */}
      <rect x="10" y="60" width="100" height="50" fill={C.surface} />
      <circle cx="30" cy="75" r="1" fill={C.clay} opacity="0.4" />
      <circle cx="50" cy="80" r="0.8" fill={C.clay} opacity="0.3" />
      <circle cx="70" cy="72" r="1.2" fill={C.clay} opacity="0.35" />
      <circle cx="85" cy="85" r="0.9" fill={C.clay} opacity="0.4" />
      <text x="60" y="92" textAnchor="middle" fill={C.core} fontSize="6" fontFamily="var(--font-jetbrains)">SAND</text>

      {/* Clay layer */}
      <rect x="10" y="110" width="100" height="50" fill={C.shallow} />
      <path d="M15 125h20M40 125h15M65 125h25M20 135h25M55 135h30" stroke={C.surface} strokeWidth="0.5" opacity="0.3" />
      <text x="60" y="142" textAnchor="middle" fill={C.cream} fontSize="6" fontFamily="var(--font-jetbrains)">CLAY</text>

      {/* Transition */}
      <rect x="10" y="160" width="100" height="50" fill={C.mid} />
      <text x="60" y="192" textAnchor="middle" fill={C.cream} fontSize="6" fontFamily="var(--font-jetbrains)">SILT</text>

      {/* Deep layer */}
      <rect x="10" y="210" width="100" height="60" fill={C.deep} />
      {/* Fossil silhouette */}
      <circle cx="60" cy="240" r="10" stroke={C.cream} strokeWidth="0.8" fill="none" opacity="0.3" />
      <path d="M60 230a10 10 0 0 0-10 10" stroke={C.cream} strokeWidth="0.5" opacity="0.25" />
      <text x="60" y="258" textAnchor="middle" fill={C.cream} fontSize="6" fontFamily="var(--font-jetbrains)">PELAGIC</text>

      {/* Slate layer */}
      <rect x="10" y="270" width="100" height="50" fill={C.shale} />
      <text x="60" y="300" textAnchor="middle" fill={C.cream} fontSize="6" fontFamily="var(--font-jetbrains)">SHALE</text>

      {/* Basement rock */}
      <rect x="10" y="320" width="100" height="80" rx="0 0 4 4" fill={C.core} />
      <polygon points="30,340 40,355 20,355" stroke={C.deep} strokeWidth="0.6" fill="none" opacity="0.3" />
      <polygon points="70,345 80,360 60,360" stroke={C.deep} strokeWidth="0.6" fill="none" opacity="0.3" />
      <text x="60" y="370" textAnchor="middle" fill={C.accent} fontSize="6" fontFamily="var(--font-jetbrains)">BASALT</text>

      {/* Depth scale on left */}
      <line x1="6" y1="0" x2="6" y2="400" stroke={C.cream} strokeWidth="0.5" opacity="0.3" />
      {[0, 60, 110, 160, 210, 270, 320, 400].map((y, i) => (
        <line key={i} x1="3" y1={y} x2="9" y2={y} stroke={C.cream} strokeWidth="0.5" opacity="0.4" />
      ))}

      {/* Core tube outline */}
      <rect x="10" y="0" width="100" height="400" rx="4" stroke={C.cream} strokeWidth="1" fill="none" opacity="0.2" />
    </svg>
  );
}

/* ─── Depth gauge indicator (fixed on screen) ─── */
function DepthGauge({ progress }: { progress: number }) {
  const depth = Math.round(progress * 2100);
  return (
    <div
      className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-1"
      style={{ fontFamily: "var(--font-space-grotesk)" }}
    >
      <div className="text-[10px] tracking-wider" style={{ color: C.accent }}>DEPTH</div>
      <div className="w-[2px] h-[200px] relative rounded-full overflow-hidden" style={{ background: `${C.cream}15` }}>
        <motion.div
          className="absolute bottom-0 left-0 w-full rounded-full"
          style={{
            background: `linear-gradient(to top, ${C.accent}, ${C.surface})`,
            height: `${Math.min(progress * 100, 100)}%`,
          }}
        />
      </div>
      <div
        className="text-xs tabular-nums font-bold"
        style={{ color: C.cream, fontFamily: "var(--font-jetbrains)" }}
      >
        {depth}m
      </div>
      <div className="text-[9px] tracking-wider" style={{ color: `${C.cream}60` }}>▽</div>
    </div>
  );
}

/* ─── Depth marker labels (left side of core) ─── */
function DepthMarker({ depth, label }: { depth: string; label: string }) {
  return (
    <div className="flex items-center gap-3" style={{ fontFamily: "var(--font-space-grotesk)" }}>
      <span className="text-xs tracking-wider tabular-nums" style={{ color: C.accent, fontFamily: "var(--font-jetbrains)" }}>
        {depth}
      </span>
      <div className="w-8 h-[1px]" style={{ background: `${C.cream}30` }} />
      <span className="text-[10px] uppercase tracking-[0.15em]" style={{ color: `${C.cream}60` }}>
        {label}
      </span>
    </div>
  );
}

/* ─── Core drill bit SVG for footer ─── */
function DrillBitSVG() {
  return (
    <svg width="60" height="100" viewBox="0 0 60 100" fill="none" className="opacity-60">
      <rect x="22" y="0" width="16" height="50" rx="2" stroke={C.cream} strokeWidth="1" fill="none" />
      <line x1="22" y1="10" x2="38" y2="10" stroke={C.cream} strokeWidth="0.5" />
      <line x1="22" y1="20" x2="38" y2="20" stroke={C.cream} strokeWidth="0.5" />
      <line x1="22" y1="30" x2="38" y2="30" stroke={C.cream} strokeWidth="0.5" />
      <line x1="22" y1="40" x2="38" y2="40" stroke={C.cream} strokeWidth="0.5" />
      <path d="M22 50L15 70L30 100L45 70L38 50" stroke={C.accent} strokeWidth="1.2" fill="none" />
      <line x1="30" y1="50" x2="30" y2="95" stroke={C.accent} strokeWidth="0.5" strokeDasharray="2 2" />
      <path d="M18 65L30 90L42 65" stroke={C.accent} strokeWidth="0.5" fill="none" opacity="0.5" />
    </svg>
  );
}

/* ================================================================
   ANIMATED SECTION COMPONENTS
   ================================================================ */

/* ─── Section wrapper with in-view animation ─── */
function AnimSection({
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
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Sediment layer for each project ─── */
function SedimentLayer({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const layer = LAYER_COLORS[index];
  const fromLeft = index % 2 === 0;
  const fossil = FOSSIL_TYPES[index];
  const depth = DEPTHS[index];
  const title = project.title.replace("\n", " ");

  return (
    <div ref={ref} className="relative">
      {/* Depth marker */}
      <motion.div
        className="absolute -left-[180px] top-1/2 -translate-y-1/2 hidden lg:block"
        initial={{ opacity: 0, x: -20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <DepthMarker depth={depth} label={layer.label} />
      </motion.div>

      {/* Main layer card */}
      <motion.div
        className="relative overflow-hidden rounded-lg mb-1"
        initial={{ opacity: 0, x: fromLeft ? -60 : 60 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: layer.bg,
          color: layer.text,
          borderLeft: `3px solid ${C.accent}40`,
        }}
      >
        {/* Pattern overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <SedimentPattern pattern={layer.pattern} color={layer.text} opacity={0.1} />
        </div>

        <div className="relative z-10 p-6 md:p-8">
          {/* Header row */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              {/* Fossil icon */}
              <motion.div
                initial={{ opacity: 0, rotate: -30, scale: 0.5 }}
                animate={inView ? { opacity: 1, rotate: 0, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex-shrink-0"
              >
                <FossilIcon type={fossil} size={36} color={layer.text === C.cream ? C.cream : C.core} />
              </motion.div>

              <div>
                <h3
                  className="text-lg md:text-xl font-bold leading-tight"
                  style={{ fontFamily: "var(--font-manrope)" }}
                >
                  {title}
                </h3>
                <div
                  className="flex items-center gap-3 mt-1 text-xs"
                  style={{ fontFamily: "var(--font-jetbrains)", opacity: 0.7 }}
                >
                  <span>{project.client}</span>
                  <span style={{ opacity: 0.4 }}>|</span>
                  <span>{project.year}</span>
                </div>
              </div>
            </div>

            {/* Layer index badge */}
            <div
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                background: `${layer.text}15`,
                border: `1px solid ${layer.text}30`,
                fontFamily: "var(--font-space-grotesk)",
              }}
            >
              {String(index + 1).padStart(2, "0")}
            </div>
          </div>

          {/* Description */}
          <p
            className="text-sm leading-relaxed mb-4"
            style={{ fontFamily: "var(--font-inter)", opacity: 0.85, maxWidth: "520px" }}
          >
            {project.description}
          </p>

          {/* Technical note */}
          <p
            className="text-xs leading-relaxed mb-4"
            style={{ fontFamily: "var(--font-inter)", opacity: 0.6, maxWidth: "520px" }}
          >
            {project.technical}
          </p>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 rounded text-[11px] font-medium"
                style={{
                  background: `${layer.text}12`,
                  border: `1px solid ${layer.text}25`,
                  fontFamily: "var(--font-jetbrains)",
                }}
              >
                {t}
              </span>
            ))}
          </div>

          {/* GitHub link */}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-4 text-xs hover:underline"
              style={{ fontFamily: "var(--font-jetbrains)", opacity: 0.6 }}
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              Source
            </a>
          )}
        </div>

        {/* Layer depth indicator bar at bottom */}
        <div className="h-1 w-full" style={{ background: `linear-gradient(to right, ${C.accent}60, transparent)` }} />
      </motion.div>
    </div>
  );
}

/* ─── Depth counter component ─── */
function DepthCounter({ target, label, suffix = "" }: { target: string; label: string; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [value, setValue] = useState(0);
  const numericTarget = parseInt(target.replace(/\D/g, "")) || 0;

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = numericTarget;
    const duration = 1500;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(eased * end);
      setValue(start);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, numericTarget]);

  const displaySuffix = target.includes("+") ? "+" : suffix;

  return (
    <div ref={ref} className="text-center">
      <div
        className="text-3xl md:text-4xl font-bold tabular-nums"
        style={{ color: C.accent, fontFamily: "var(--font-space-grotesk)" }}
      >
        {value}{displaySuffix}
      </div>
      <div
        className="text-[11px] uppercase tracking-[0.2em] mt-2"
        style={{ color: `${C.cream}70`, fontFamily: "var(--font-inter)" }}
      >
        {label}
      </div>
    </div>
  );
}

/* ================================================================
   MAIN PAGE COMPONENT
   ================================================================ */

export default function SedimentPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [scrollProgress, setScrollProgress] = useState(0);

  /* Track scroll progress for depth gauge */
  useEffect(() => {
    return scrollYProgress.on("change", (v) => setScrollProgress(v));
  }, [scrollYProgress]);

  /* Background darkening on scroll */
  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6, 1],
    [C.bg, C.oceanMid, C.abyss, "#030810"]
  );

  return (
    <>
      <style jsx global>{`
        @keyframes sediment-drift {
          0%, 100% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(6px) translateY(-3px); }
        }
        @keyframes sediment-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes sediment-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes sediment-scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes sediment-particles {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(120px) rotate(180deg); opacity: 0; }
        }
        @keyframes sediment-wave {
          0%, 100% { d: path("M0 20 Q25 10 50 20 T100 20"); }
          50% { d: path("M0 20 Q25 30 50 20 T100 20"); }
        }
        @keyframes depth-tick {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        .sediment-particle {
          animation: sediment-particles 8s ease-in-out infinite;
        }
        .sediment-particle:nth-child(2n) { animation-delay: -2s; animation-duration: 10s; }
        .sediment-particle:nth-child(3n) { animation-delay: -4s; animation-duration: 12s; }
        .sediment-particle:nth-child(5n) { animation-delay: -6s; animation-duration: 9s; }
      `}</style>

      <motion.div
        ref={containerRef}
        className="min-h-screen relative"
        style={{ backgroundColor: bgColor }}
      >
        {/* ─── Depth Gauge (fixed sidebar) ─── */}
        <DepthGauge progress={scrollProgress} />

        {/* ─── Floating ocean particles ─── */}
        <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="sediment-particle absolute rounded-full"
              style={{
                width: `${2 + (i % 3)}px`,
                height: `${2 + (i % 3)}px`,
                left: `${8 + i * 8}%`,
                top: `${10 + (i * 17) % 80}%`,
                background: C.accent,
                opacity: 0.3,
              }}
            />
          ))}
        </div>

        {/* ================================================================
            HERO SECTION — Ocean Surface to Core Preview
            ================================================================ */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
          {/* Ocean surface wave decoration */}
          <div className="absolute top-0 left-0 right-0 h-40 pointer-events-none overflow-hidden">
            <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-full absolute bottom-0">
              <path
                d="M0 60C240 20 480 100 720 60C960 20 1200 100 1440 60L1440 0L0 0Z"
                fill={C.oceanTop}
                opacity="0.3"
              />
              <path
                d="M0 80C200 40 400 90 600 60C800 30 1000 80 1200 50C1300 35 1400 60 1440 55L1440 0L0 0Z"
                fill={C.oceanTop}
                opacity="0.2"
              />
            </svg>
          </div>

          {/* Title */}
          <motion.div
            className="text-center mb-12 relative z-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="text-[10px] uppercase tracking-[0.4em] mb-6"
              style={{ color: C.accent, fontFamily: "var(--font-space-grotesk)" }}
            >
              Core Sample Analysis ▥ Deep Ocean Survey
            </div>

            <h1
              className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight"
              style={{
                fontFamily: "var(--font-manrope)",
                color: C.cream,
                textShadow: `0 0 80px ${C.accent}30`,
              }}
            >
              SEDIMENT
            </h1>

            <div
              className="mt-4 text-sm tracking-[0.2em] uppercase"
              style={{ color: `${C.cream}50`, fontFamily: "var(--font-inter)" }}
            >
              Portfolio — Deep Ocean Core Sample
            </div>
          </motion.div>

          {/* Core section diagram + stats */}
          <motion.div
            className="flex flex-col md:flex-row items-center gap-8 md:gap-16 relative z-20"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {/* Core diagram */}
            <div className="flex-shrink-0" style={{ animation: "sediment-float 6s ease-in-out infinite" }}>
              <CoreSectionSVG />
            </div>

            {/* Stats as depth readings */}
            <div className="flex flex-col gap-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="flex items-center gap-6"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + i * 0.15 }}
                >
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center border"
                    style={{
                      borderColor: `${C.accent}40`,
                      background: `${C.accent}10`,
                    }}
                  >
                    <span
                      className="text-lg font-bold"
                      style={{ color: C.accent, fontFamily: "var(--font-space-grotesk)" }}
                    >
                      {stat.value}
                    </span>
                  </div>
                  <div>
                    <div
                      className="text-xs uppercase tracking-[0.15em]"
                      style={{ color: `${C.cream}60`, fontFamily: "var(--font-space-grotesk)" }}
                    >
                      {stat.label}
                    </div>
                    <div
                      className="text-[10px] mt-0.5"
                      style={{ color: `${C.cream}30`, fontFamily: "var(--font-jetbrains)" }}
                    >
                      DEPTH READING {String(i + 1).padStart(2, "0")}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <span
              className="text-[10px] uppercase tracking-[0.3em]"
              style={{ color: `${C.cream}40`, fontFamily: "var(--font-space-grotesk)" }}
            >
              Begin Descent
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg width="20" height="30" viewBox="0 0 20 30" fill="none">
                <rect x="1" y="1" width="18" height="28" rx="9" stroke={C.accent} strokeWidth="1" opacity="0.4" />
                <motion.circle
                  cx="10"
                  cy="10"
                  r="3"
                  fill={C.accent}
                  animate={{ cy: [8, 20, 8] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </svg>
            </motion.div>
          </motion.div>
        </section>

        {/* ================================================================
            PROJECTS SECTION — Sediment Layers in Core Column
            ================================================================ */}
        <section className="relative py-20 md:py-32">
          {/* Section header */}
          <AnimSection className="text-center mb-16 px-4">
            <div
              className="text-[10px] uppercase tracking-[0.4em] mb-3"
              style={{ color: C.accent, fontFamily: "var(--font-space-grotesk)" }}
            >
              Core Sample Layers ▥ Sedimentary Record
            </div>
            <h2
              className="text-3xl md:text-5xl font-bold"
              style={{ color: C.cream, fontFamily: "var(--font-manrope)" }}
            >
              Project Strata
            </h2>
            <p
              className="mt-4 text-sm max-w-lg mx-auto"
              style={{ color: `${C.cream}60`, fontFamily: "var(--font-inter)" }}
            >
              Each layer represents a distinct project — preserved in the geological record of creative work.
              Scroll deeper to uncover older formations.
            </p>
          </AnimSection>

          {/* Central core column with depth scale */}
          <div className="relative max-w-[640px] mx-auto px-4">
            {/* Vertical depth ruler line */}
            <div
              className="absolute left-0 top-0 bottom-0 w-[1px] hidden lg:block"
              style={{
                left: "calc(50% - 340px)",
                background: `linear-gradient(to bottom, ${C.accent}40, ${C.accent}10)`,
              }}
            />

            {/* Depth scale ticks */}
            <div className="absolute left-0 top-0 bottom-0 hidden lg:block" style={{ left: "calc(50% - 345px)" }}>
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-[10px] h-[1px]"
                  style={{
                    top: `${(i / 19) * 100}%`,
                    background: `${C.accent}${i % 5 === 0 ? "60" : "25"}`,
                  }}
                />
              ))}
            </div>

            {/* Project layers */}
            <div className="space-y-3">
              {projects.map((project, i) => (
                <SedimentLayer key={project.title} project={project} index={i} />
              ))}
            </div>

            {/* Bottom cap */}
            <AnimSection className="mt-6 text-center">
              <div
                className="inline-block px-6 py-3 rounded-b-lg border-t-2"
                style={{
                  borderColor: C.accent,
                  background: `${C.core}80`,
                }}
              >
                <span
                  className="text-[10px] uppercase tracking-[0.3em]"
                  style={{ color: C.accent, fontFamily: "var(--font-space-grotesk)" }}
                >
                  ▥ End of Core Sample — 2100m Depth
                </span>
              </div>
            </AnimSection>
          </div>
        </section>

        {/* ================================================================
            EXPERTISE SECTION — Geological Strata Cards
            ================================================================ */}
        <section className="relative py-20 md:py-32 px-4">
          <AnimSection className="text-center mb-16">
            <div
              className="text-[10px] uppercase tracking-[0.4em] mb-3"
              style={{ color: C.accent, fontFamily: "var(--font-space-grotesk)" }}
            >
              Stratigraphic Analysis ▥ Competency Mapping
            </div>
            <h2
              className="text-3xl md:text-5xl font-bold"
              style={{ color: C.cream, fontFamily: "var(--font-manrope)" }}
            >
              Expertise Formation
            </h2>
          </AnimSection>

          <div className="max-w-[640px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            {expertise.map((item, i) => {
              const rockType = ROCK_PATTERNS[i];
              const layerColor = [C.surface, C.shallow, C.mid, C.deep][i];
              return (
                <AnimSection key={item.title} delay={i * 0.1}>
                  <div
                    className="relative overflow-hidden rounded-lg p-6 h-full"
                    style={{
                      background: `linear-gradient(135deg, ${layerColor}18, ${layerColor}08)`,
                      border: `1px solid ${layerColor}30`,
                    }}
                  >
                    {/* Rock texture pattern */}
                    <div className="absolute inset-0 pointer-events-none">
                      <RockPattern type={rockType} color={C.cream} />
                    </div>

                    <div className="relative z-10">
                      {/* Rock type badge */}
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="w-8 h-8 rounded flex items-center justify-center"
                          style={{ background: `${layerColor}30` }}
                        >
                          <div className="w-3 h-3 rounded-full" style={{ background: layerColor }} />
                        </div>
                        <div>
                          <span
                            className="text-[9px] uppercase tracking-[0.2em] block"
                            style={{ color: `${C.cream}50`, fontFamily: "var(--font-jetbrains)" }}
                          >
                            {rockType.toUpperCase()} FORMATION
                          </span>
                        </div>
                      </div>

                      <h3
                        className="text-lg font-bold mb-3"
                        style={{ color: C.cream, fontFamily: "var(--font-manrope)" }}
                      >
                        {item.title}
                      </h3>

                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: `${C.cream}70`, fontFamily: "var(--font-inter)" }}
                      >
                        {item.body}
                      </p>
                    </div>

                    {/* Decorative layer line at bottom */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-1"
                      style={{ background: `linear-gradient(to right, ${layerColor}, transparent)` }}
                    />
                  </div>
                </AnimSection>
              );
            })}
          </div>
        </section>

        {/* ================================================================
            TOOLS SECTION — Mineral Composition Bars
            ================================================================ */}
        <section className="relative py-20 md:py-32 px-4">
          <AnimSection className="text-center mb-16">
            <div
              className="text-[10px] uppercase tracking-[0.4em] mb-3"
              style={{ color: C.accent, fontFamily: "var(--font-space-grotesk)" }}
            >
              Mineral Composition ▥ Element Analysis
            </div>
            <h2
              className="text-3xl md:text-5xl font-bold"
              style={{ color: C.cream, fontFamily: "var(--font-manrope)" }}
            >
              Tool Mineralogy
            </h2>
            <p
              className="mt-4 text-sm max-w-md mx-auto"
              style={{ color: `${C.cream}50`, fontFamily: "var(--font-inter)" }}
            >
              Compositional analysis of the technology stack — each mineral band represents a core capability.
            </p>
          </AnimSection>

          <div className="max-w-[640px] mx-auto space-y-8">
            {tools.map((category, ci) => {
              const barColors = [
                ["#D4B896", "#C4A06B", "#B08A50", "#9A7040"],
                ["#4A6FA5", "#5A82B8", "#6A94CA", "#7AA6DC"],
                ["#A0522D", "#B8663E", "#CF7A50", "#E08E62"],
                ["#4A5C4F", "#5A6E5F", "#6A8070", "#7A9280"],
                ["#3A4A5C", "#4A5C6E", "#5A6E80", "#6A8092"],
                ["#6B4FA0", "#7B5FB0", "#8B6FC0", "#9B7FD0"],
              ];
              const colors = barColors[ci] || barColors[0];
              const totalItems = category.items.length;

              return (
                <AnimSection key={category.label} delay={ci * 0.08}>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: colors[0] }}
                      />
                      <span
                        className="text-sm font-bold uppercase tracking-[0.1em]"
                        style={{ color: C.cream, fontFamily: "var(--font-space-grotesk)" }}
                      >
                        {category.label}
                      </span>
                    </div>
                    <span
                      className="text-[10px]"
                      style={{ color: `${C.cream}40`, fontFamily: "var(--font-jetbrains)" }}
                    >
                      {totalItems} minerals
                    </span>
                  </div>

                  {/* Stacked bar */}
                  <div className="flex rounded-md overflow-hidden h-10 border" style={{ borderColor: `${C.cream}10` }}>
                    {category.items.map((item, ii) => (
                      <motion.div
                        key={item}
                        className="relative flex items-center justify-center group cursor-default"
                        style={{
                          background: colors[ii % colors.length],
                          flex: 1,
                          borderRight: ii < totalItems - 1 ? `1px solid ${C.bg}` : "none",
                        }}
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.6,
                          delay: ci * 0.08 + ii * 0.1,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        <span
                          className="text-[10px] font-medium truncate px-1.5 relative z-10"
                          style={{
                            color: ii < 2 && ci !== 1 && ci !== 4 ? C.core : C.cream,
                            fontFamily: "var(--font-jetbrains)",
                          }}
                        >
                          {item}
                        </span>

                        {/* Hover tooltip */}
                        <div
                          className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[9px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none"
                          style={{
                            background: C.core,
                            color: C.cream,
                            border: `1px solid ${C.accent}40`,
                            fontFamily: "var(--font-jetbrains)",
                          }}
                        >
                          {item} — {Math.round(100 / totalItems)}%
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Percentage marks */}
                  <div className="flex justify-between mt-1">
                    {category.items.map((_, ii) => (
                      <span
                        key={ii}
                        className="text-[8px] tabular-nums"
                        style={{
                          color: `${C.cream}25`,
                          fontFamily: "var(--font-jetbrains)",
                          flex: 1,
                          textAlign: "center",
                        }}
                      >
                        {Math.round(((ii + 1) / totalItems) * 100)}%
                      </span>
                    ))}
                  </div>
                </AnimSection>
              );
            })}
          </div>
        </section>

        {/* ================================================================
            FOOTER — Core Sample Analysis Complete
            ================================================================ */}
        <footer className="relative py-20 md:py-32 px-4 overflow-hidden">
          {/* Top separator */}
          <div className="max-w-[640px] mx-auto mb-16">
            <div className="h-[1px] w-full" style={{ background: `linear-gradient(to right, transparent, ${C.accent}40, transparent)` }} />
          </div>

          <AnimSection className="max-w-[640px] mx-auto text-center">
            {/* Drill bit decoration */}
            <div className="flex justify-center mb-8">
              <DrillBitSVG />
            </div>

            <div
              className="text-[10px] uppercase tracking-[0.5em] mb-4"
              style={{ color: C.accent, fontFamily: "var(--font-space-grotesk)" }}
            >
              ▥ Analysis Report
            </div>

            <h2
              className="text-2xl md:text-4xl font-bold mb-8"
              style={{ color: C.cream, fontFamily: "var(--font-manrope)" }}
            >
              Core Sample Analysis Complete
            </h2>

            {/* Summary stats */}
            <div className="grid grid-cols-3 gap-8 mb-12">
              {stats.map((stat) => (
                <DepthCounter key={stat.label} target={stat.value} label={stat.label} />
              ))}
            </div>

            {/* Summary diagram - mini core visualization */}
            <div className="flex justify-center mb-12">
              <div className="flex flex-col items-center">
                <div
                  className="text-[9px] uppercase tracking-[0.2em] mb-3"
                  style={{ color: `${C.cream}40`, fontFamily: "var(--font-space-grotesk)" }}
                >
                  Core Profile Summary
                </div>
                <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: `${C.cream}15` }}>
                  {LAYER_COLORS.map((layer, i) => (
                    <motion.div
                      key={i}
                      className="w-6 h-20"
                      style={{ background: layer.bg }}
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05, duration: 0.4 }}
                    />
                  ))}
                </div>
                <div className="flex justify-between w-full mt-1">
                  <span className="text-[8px]" style={{ color: `${C.cream}30`, fontFamily: "var(--font-jetbrains)" }}>0m</span>
                  <span className="text-[8px]" style={{ color: `${C.cream}30`, fontFamily: "var(--font-jetbrains)" }}>2100m</span>
                </div>
              </div>
            </div>

            {/* Depth total */}
            <div
              className="inline-block px-8 py-4 rounded-lg mb-12"
              style={{
                background: `${C.accent}10`,
                border: `1px solid ${C.accent}25`,
              }}
            >
              <div
                className="text-[10px] uppercase tracking-[0.2em] mb-1"
                style={{ color: `${C.cream}50`, fontFamily: "var(--font-space-grotesk)" }}
              >
                Total Depth Reached
              </div>
              <div
                className="text-3xl font-bold tabular-nums"
                style={{ color: C.accent, fontFamily: "var(--font-space-grotesk)" }}
              >
                2,100m
              </div>
            </div>

            {/* Institutional labels */}
            <div className="space-y-3">
              <div
                className="text-[10px] uppercase tracking-[0.3em]"
                style={{ color: `${C.cream}30`, fontFamily: "var(--font-space-grotesk)" }}
              >
                Deep Ocean Survey Institute
              </div>
              <div
                className="text-[9px] tracking-[0.2em]"
                style={{ color: `${C.cream}20`, fontFamily: "var(--font-jetbrains)" }}
              >
                CORE SAMPLE REF: SED-2025-001 — ANALYSIS CERTIFIED
              </div>
              <div
                className="text-[9px] tracking-[0.15em]"
                style={{ color: `${C.cream}15`, fontFamily: "var(--font-inter)" }}
              >
                Classification: Pelagic Sedimentary — Mixed Biogenic & Terrigenous
              </div>
            </div>

            {/* Bottom fossil decoration row */}
            <div className="flex justify-center gap-6 mt-12 opacity-20">
              {["ammonite", "trilobite", "fish", "leaf", "shell", "coral"].map((type) => (
                <FossilIcon key={type} type={type} size={28} color={C.cream} />
              ))}
            </div>
          </AnimSection>

          {/* Absolute bottom line */}
          <div className="mt-16 max-w-[640px] mx-auto">
            <div className="h-[1px] w-full" style={{ background: `${C.cream}08` }} />
            <div className="flex justify-between items-center mt-4">
              <span
                className="text-[9px]"
                style={{ color: `${C.cream}20`, fontFamily: "var(--font-jetbrains)" }}
              >
                SEDIMENT v1.0
              </span>
              <span
                className="text-[9px]"
                style={{ color: `${C.cream}20`, fontFamily: "var(--font-jetbrains)" }}
              >
                {new Date().getFullYear()}
              </span>
            </div>
          </div>
        </footer>

        {/* ─── Theme Switcher ─── */}
        <ThemeSwitcher current="/sediment" variant="light" />
      </motion.div>
    </>
  );
}
