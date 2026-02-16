"use client";

import { motion, useInView, useScroll, useTransform } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { getProjectImage } from "@/lib/theme-images";

/* ─── Seasonal Color Palettes ─── */
const seasons = {
  spring: {
    primary: "#4CAF50",
    secondary: "#FFB7C5",
    tertiary: "#87CEEB",
    bg: "#FFFEF5",
    text: "#2E3A1F",
    muted: "#6B7B5C",
    accent: "#D4885C",
    border: "#4CAF5040",
  },
  summer: {
    primary: "#FFB300",
    secondary: "#2E7D32",
    tertiary: "#FF6B6B",
    bg: "#FFF8E1",
    text: "#3E2F1C",
    muted: "#8B7355",
    accent: "#E67E22",
    border: "#FFB30040",
  },
  autumn: {
    primary: "#CC6B2C",
    secondary: "#8B1A1A",
    tertiary: "#DAA520",
    bg: "#FFF5E6",
    text: "#3C2415",
    muted: "#7A5C3E",
    accent: "#CC6B2C",
    border: "#CC6B2C40",
  },
  winter: {
    primary: "#B3E5FC",
    secondary: "#C0C0C0",
    tertiary: "#1A237E",
    bg: "#F0F4F8",
    text: "#1A2332",
    muted: "#5C6B7A",
    accent: "#4A6FA5",
    border: "#B3E5FC40",
  },
};

type SeasonKey = keyof typeof seasons;
const seasonOrder: SeasonKey[] = ["spring", "summer", "autumn", "winter"];
const seasonLabels: Record<SeasonKey, string> = {
  spring: "Vernal Equinox",
  summer: "Summer Solstice",
  autumn: "Autumnal Equinox",
  winter: "Winter Solstice",
};

/* Project season assignments: 3 Spring, 3 Summer, 2 Autumn, 2 Winter */
const projectSeasons: SeasonKey[] = [
  "spring", "spring", "spring",
  "summer", "summer", "summer",
  "autumn", "autumn",
  "winter", "winter",
];

const ease = [0.22, 1, 0.36, 1] as const;

/* ─── Interpolate between two hex colors ─── */
function lerpColor(a: string, b: string, t: number): string {
  const parse = (hex: string) => {
    const h = hex.replace("#", "");
    return [
      parseInt(h.substring(0, 2), 16),
      parseInt(h.substring(2, 4), 16),
      parseInt(h.substring(4, 6), 16),
    ];
  };
  const ca = parse(a);
  const cb = parse(b);
  const r = Math.round(ca[0] + (cb[0] - ca[0]) * t);
  const g = Math.round(ca[1] + (cb[1] - ca[1]) * t);
  const bl = Math.round(ca[2] + (cb[2] - ca[2]) * t);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${bl.toString(16).padStart(2, "0")}`;
}

/* ─── Moon Phase SVGs ─── */
function MoonPhase({ phase, size = 32, color = "#3C2415" }: { phase: number; size?: number; color?: string }) {
  /* phase 0-7: new, waxing crescent, first quarter, waxing gibbous, full, waning gibbous, last quarter, waning crescent */
  const r = size / 2 - 2;
  const cx = size / 2;
  const cy = size / 2;

  const getMoonPath = () => {
    switch (phase) {
      case 0: /* New Moon */
        return <circle cx={cx} cy={cy} r={r} fill={color} opacity={0.15} stroke={color} strokeWidth={1} />;
      case 1: /* Waxing Crescent */
        return (
          <g>
            <circle cx={cx} cy={cy} r={r} fill={color} opacity={0.15} stroke={color} strokeWidth={0.8} />
            <path d={`M${cx},${cy - r} A${r},${r} 0 0,1 ${cx},${cy + r} A${r * 0.6},${r} 0 0,0 ${cx},${cy - r}`} fill={color} opacity={0.7} />
          </g>
        );
      case 2: /* First Quarter */
        return (
          <g>
            <circle cx={cx} cy={cy} r={r} fill={color} opacity={0.15} stroke={color} strokeWidth={0.8} />
            <path d={`M${cx},${cy - r} A${r},${r} 0 0,1 ${cx},${cy + r} L${cx},${cy - r}Z`} fill={color} opacity={0.7} />
          </g>
        );
      case 3: /* Waxing Gibbous */
        return (
          <g>
            <circle cx={cx} cy={cy} r={r} fill={color} opacity={0.7} stroke={color} strokeWidth={0.8} />
            <path d={`M${cx},${cy - r} A${r},${r} 0 0,0 ${cx},${cy + r} A${r * 0.6},${r} 0 0,0 ${cx},${cy - r}`} fill={color} opacity={0.15} />
          </g>
        );
      case 4: /* Full Moon */
        return <circle cx={cx} cy={cy} r={r} fill={color} opacity={0.7} stroke={color} strokeWidth={0.8} />;
      case 5: /* Waning Gibbous */
        return (
          <g>
            <circle cx={cx} cy={cy} r={r} fill={color} opacity={0.7} stroke={color} strokeWidth={0.8} />
            <path d={`M${cx},${cy - r} A${r},${r} 0 0,1 ${cx},${cy + r} A${r * 0.6},${r} 0 0,1 ${cx},${cy - r}`} fill={color} opacity={0.15} />
          </g>
        );
      case 6: /* Last Quarter */
        return (
          <g>
            <circle cx={cx} cy={cy} r={r} fill={color} opacity={0.15} stroke={color} strokeWidth={0.8} />
            <path d={`M${cx},${cy - r} A${r},${r} 0 0,0 ${cx},${cy + r} L${cx},${cy - r}Z`} fill={color} opacity={0.7} />
          </g>
        );
      case 7: /* Waning Crescent */
        return (
          <g>
            <circle cx={cx} cy={cy} r={r} fill={color} opacity={0.15} stroke={color} strokeWidth={0.8} />
            <path d={`M${cx},${cy - r} A${r},${r} 0 0,0 ${cx},${cy + r} A${r * 0.6},${r} 0 0,1 ${cx},${cy - r}`} fill={color} opacity={0.7} />
          </g>
        );
      default:
        return <circle cx={cx} cy={cy} r={r} fill={color} opacity={0.3} />;
    }
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      {getMoonPath()}
    </svg>
  );
}

/* ─── Moon Phase Cycle Row ─── */
function MoonCycleRow({ color = "#3C2415", size = 36 }: { color?: string; size?: number }) {
  const phaseNames = ["New", "Wax. Cres.", "First Qtr.", "Wax. Gib.", "Full", "Wan. Gib.", "Last Qtr.", "Wan. Cres."];
  return (
    <div className="flex items-center justify-center gap-3 md:gap-5">
      {phaseNames.map((name, i) => (
        <motion.div
          key={name}
          className="flex flex-col items-center gap-1"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 + i * 0.1, ease }}
        >
          <MoonPhase phase={i} size={size} color={color} />
          <span
            className="font-[family-name:var(--font-jetbrains)] text-[7px] md:text-[8px] tracking-wider uppercase"
            style={{ color, opacity: 0.6 }}
          >
            {name}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Thermometer SVG (scroll-linked) ─── */
function Thermometer({ progress, season }: { progress: number; season: SeasonKey }) {
  const pal = seasons[season];
  const mercuryHeight = 120 * progress;
  const tempLabels = ["32\u00b0F", "50\u00b0F", "68\u00b0F", "86\u00b0F", "100\u00b0F"];

  return (
    <div className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
      <svg width="40" height="200" viewBox="0 0 40 200" aria-hidden>
        {/* Thermometer bulb */}
        <circle cx="20" cy="180" r="14" fill="none" stroke={pal.text} strokeWidth={1.2} opacity={0.4} />
        <circle cx="20" cy="180" r="10" fill={pal.primary} opacity={0.8} />

        {/* Thermometer tube */}
        <rect x="15" y="30" width="10" height="150" rx="5" fill="none" stroke={pal.text} strokeWidth={1} opacity={0.3} />

        {/* Mercury fill */}
        <rect
          x="17"
          y={180 - mercuryHeight - 10}
          width="6"
          height={mercuryHeight + 10}
          rx="3"
          fill={pal.primary}
          opacity={0.75}
        />

        {/* Tick marks */}
        {tempLabels.map((label, i) => {
          const y = 160 - i * 30;
          return (
            <g key={i}>
              <line x1="26" y1={y} x2="32" y2={y} stroke={pal.text} strokeWidth={0.8} opacity={0.3} />
              <text x="34" y={y + 3} fill={pal.muted} fontSize="5" fontFamily="var(--font-jetbrains)" opacity={0.6}>
                {label}
              </text>
            </g>
          );
        })}

        {/* Season label */}
        <text
          x="20"
          y="18"
          textAnchor="middle"
          fill={pal.primary}
          fontSize="6"
          fontFamily="var(--font-jetbrains)"
          letterSpacing="0.1em"
          className="uppercase"
        >
          {season}
        </text>
      </svg>
    </div>
  );
}

/* ─── Seasonal SVG Decorations ─── */
function SpringFlower({ x, y, size = 24, color = "#FFB7C5" }: { x: number; y: number; size?: number; color?: string }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <ellipse
          key={i}
          cx={0}
          cy={-size / 3}
          rx={size / 6}
          ry={size / 3}
          fill={color}
          opacity={0.5}
          transform={`rotate(${angle})`}
        />
      ))}
      <circle cx={0} cy={0} r={size / 8} fill="#FFD700" opacity={0.7} />
    </g>
  );
}

function SummerSun({ x, y, size = 28, color = "#FFB300" }: { x: number; y: number; size?: number; color?: string }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle cx={0} cy={0} r={size / 3} fill={color} opacity={0.6} />
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const inner = size / 3 + 2;
        const outer = size / 2;
        return (
          <line
            key={i}
            x1={Math.cos(angle) * inner}
            y1={Math.sin(angle) * inner}
            x2={Math.cos(angle) * outer}
            y2={Math.sin(angle) * outer}
            stroke={color}
            strokeWidth={1.5}
            strokeLinecap="round"
            opacity={0.5}
          />
        );
      })}
    </g>
  );
}

function AutumnLeaf({ x, y, size = 20, color = "#CC6B2C", rotation = 0 }: { x: number; y: number; size?: number; color?: string; rotation?: number }) {
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotation})`}>
      <path
        d={`M0,${-size / 2} C${size / 3},${-size / 3} ${size / 2.5},0 0,${size / 2} C${-size / 2.5},0 ${-size / 3},${-size / 3} 0,${-size / 2}Z`}
        fill={color}
        opacity={0.45}
      />
      <line x1={0} y1={-size / 2} x2={0} y2={size / 2} stroke={color} strokeWidth={0.6} opacity={0.6} />
      <line x1={0} y1={-size / 6} x2={size / 5} y2={-size / 3} stroke={color} strokeWidth={0.4} opacity={0.4} />
      <line x1={0} y1={size / 8} x2={-size / 5} y2={-size / 10} stroke={color} strokeWidth={0.4} opacity={0.4} />
    </g>
  );
}

function WinterSnowflake({ x, y, size = 22, color = "#B3E5FC" }: { x: number; y: number; size?: number; color?: string }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {[0, 60, 120].map((angle, i) => (
        <g key={i} transform={`rotate(${angle})`}>
          <line x1={0} y1={-size / 2} x2={0} y2={size / 2} stroke={color} strokeWidth={1} opacity={0.5} />
          <line x1={-size / 6} y1={-size / 3} x2={0} y2={-size / 4.5} stroke={color} strokeWidth={0.7} opacity={0.4} />
          <line x1={size / 6} y1={-size / 3} x2={0} y2={-size / 4.5} stroke={color} strokeWidth={0.7} opacity={0.4} />
          <line x1={-size / 6} y1={size / 3} x2={0} y2={size / 4.5} stroke={color} strokeWidth={0.7} opacity={0.4} />
          <line x1={size / 6} y1={size / 3} x2={0} y2={size / 4.5} stroke={color} strokeWidth={0.7} opacity={0.4} />
        </g>
      ))}
      <circle cx={0} cy={0} r={1.5} fill={color} opacity={0.6} />
    </g>
  );
}

/* ─── Season Divider SVG ─── */
function SeasonDivider({ season, label }: { season: SeasonKey; label: string }) {
  const pal = seasons[season];
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const renderDecoration = () => {
    switch (season) {
      case "spring":
        return (
          <svg width="300" height="50" viewBox="0 0 300 50" aria-hidden>
            <SpringFlower x={50} y={25} size={22} color={pal.secondary} />
            <SpringFlower x={100} y={30} size={16} color={pal.primary} />
            <SpringFlower x={150} y={22} size={20} color={pal.secondary} />
            <SpringFlower x={200} y={28} size={18} color={pal.primary} />
            <SpringFlower x={250} y={25} size={22} color={pal.secondary} />
          </svg>
        );
      case "summer":
        return (
          <svg width="300" height="50" viewBox="0 0 300 50" aria-hidden>
            <SummerSun x={80} y={25} size={24} color={pal.primary} />
            <SummerSun x={150} y={25} size={30} color={pal.primary} />
            <SummerSun x={220} y={25} size={24} color={pal.primary} />
          </svg>
        );
      case "autumn":
        return (
          <svg width="300" height="50" viewBox="0 0 300 50" aria-hidden>
            <AutumnLeaf x={50} y={25} size={18} color={pal.primary} rotation={-20} />
            <AutumnLeaf x={100} y={28} size={22} color={pal.tertiary} rotation={15} />
            <AutumnLeaf x={150} y={22} size={20} color={pal.secondary} rotation={-10} />
            <AutumnLeaf x={200} y={26} size={24} color={pal.primary} rotation={25} />
            <AutumnLeaf x={250} y={24} size={18} color={pal.tertiary} rotation={-15} />
          </svg>
        );
      case "winter":
        return (
          <svg width="300" height="50" viewBox="0 0 300 50" aria-hidden>
            <WinterSnowflake x={50} y={25} size={18} color={pal.primary} />
            <WinterSnowflake x={110} y={20} size={14} color={pal.secondary} />
            <WinterSnowflake x={150} y={28} size={20} color={pal.primary} />
            <WinterSnowflake x={190} y={18} size={16} color={pal.secondary} />
            <WinterSnowflake x={250} y={25} size={18} color={pal.primary} />
          </svg>
        );
    }
  };

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center gap-3 py-10"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 1, ease }}
    >
      <div className="flex items-center gap-4 w-full max-w-[600px]">
        <div className="h-px flex-1" style={{ background: pal.border }} />
        <span
          className="font-[family-name:var(--font-jetbrains)] text-[9px] tracking-[0.3em] uppercase"
          style={{ color: pal.muted }}
        >
          {label}
        </span>
        <div className="h-px flex-1" style={{ background: pal.border }} />
      </div>
      {renderDecoration()}
      <h3
        className="font-[family-name:var(--font-dm-serif)] text-2xl md:text-3xl capitalize"
        style={{ color: pal.primary }}
      >
        {season}
      </h3>
    </motion.div>
  );
}

/* ─── Wheat Stalk SVG ─── */
function WheatStalk({ height = 100, color = "#CC6B2C" }: { height?: number; color?: string }) {
  return (
    <svg width="24" height={height} viewBox={`0 0 24 ${height}`} aria-hidden>
      <line x1="12" y1={height} x2="12" y2={10} stroke={color} strokeWidth={1.2} opacity={0.5} />
      {Array.from({ length: Math.floor(height / 16) }).map((_, i) => {
        const y = height - 20 - i * 16;
        return (
          <g key={i}>
            <ellipse cx={i % 2 === 0 ? 6 : 18} cy={y} rx={4} ry={8} fill="none" stroke={color} strokeWidth={0.7} opacity={0.4} transform={`rotate(${i % 2 === 0 ? -15 : 15} ${i % 2 === 0 ? 6 : 18} ${y})`} />
          </g>
        );
      })}
      {/* Top wheat head */}
      {[0, 1, 2, 3].map((i) => (
        <ellipse
          key={`head-${i}`}
          cx={12 + (i % 2 === 0 ? -3 : 3)}
          cy={12 + i * 4}
          rx={3}
          ry={6}
          fill={color}
          opacity={0.3}
          transform={`rotate(${i % 2 === 0 ? -10 : 10} ${12 + (i % 2 === 0 ? -3 : 3)} ${12 + i * 4})`}
        />
      ))}
    </svg>
  );
}

/* ─── Acorn SVG ─── */
function Acorn({ size = 24, color = "#CC6B2C" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 24 30" aria-hidden>
      {/* Cap */}
      <path d="M6,12 Q6,6 12,5 Q18,6 18,12Z" fill={color} opacity={0.4} />
      <path d="M6,12 Q6,8 12,7 Q18,8 18,12" fill="none" stroke={color} strokeWidth={0.8} opacity={0.6} />
      {/* Stem */}
      <line x1="12" y1="5" x2="12" y2="2" stroke={color} strokeWidth={1} opacity={0.5} strokeLinecap="round" />
      {/* Body */}
      <ellipse cx="12" cy="19" rx="6" ry="8" fill="none" stroke={color} strokeWidth={1} opacity={0.5} />
      <ellipse cx="12" cy="18" rx="4" ry="6" fill={color} opacity={0.15} />
    </svg>
  );
}

/* ─── Reveal wrapper ─── */
function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Seasonal Project Card ─── */
function AlmanacCard({
  project,
  index,
  season,
}: {
  project: (typeof projects)[number];
  index: number;
  season: SeasonKey;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const pal = seasons[season];
  const entryNum = String(index + 1).padStart(2, "0");

  return (
    <motion.a
      ref={ref}
      href={project.github}
      target="_blank"
      rel="noopener noreferrer"
      className="block group relative overflow-hidden"
      style={{
        background: pal.bg,
        border: `1px solid ${pal.border}`,
        borderRadius: "2px",
      }}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease, delay: 0.1 }}
      whileHover={{
        boxShadow: `0 4px 24px ${pal.primary}30, 0 0 0 1px ${pal.primary}50`,
        y: -2,
      }}
    >
      {/* Season accent bar at top */}
      <div
        className="h-1 w-full"
        style={{
          background: `linear-gradient(90deg, ${pal.primary}, ${pal.tertiary}, ${pal.primary})`,
          opacity: 0.6,
        }}
      />

      {/* Header row */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderBottom: `1px solid ${pal.border}` }}
      >
        <div className="flex items-center gap-3">
          <span
            className="font-[family-name:var(--font-jetbrains)] text-xs tracking-[0.2em] uppercase"
            style={{ color: pal.primary }}
          >
            Entry {entryNum}
          </span>
          <span
            className="font-[family-name:var(--font-jetbrains)] text-[9px] px-2 py-0.5 rounded-sm uppercase tracking-wider"
            style={{
              background: `${pal.primary}15`,
              color: pal.primary,
              border: `1px solid ${pal.primary}30`,
            }}
          >
            {season}
          </span>
        </div>
        <span
          className="font-[family-name:var(--font-jetbrains)] text-[10px]"
          style={{ color: pal.muted }}
        >
          {project.year} &middot; {project.client}
        </span>
      </div>

      {/* Body */}
      <div className="flex gap-5 p-5">
        {/* Project image */}
        <div
          className="hidden md:block flex-shrink-0 w-[160px] h-[160px] overflow-hidden self-center"
          style={{ border: `1px solid ${pal.border}`, borderRadius: "2px" }}
        >
          <img
            src={getProjectImage("almanac", project.image)}
            alt={project.title.replace("\n", " ")}
            className="w-full h-full object-cover opacity-90
                       group-hover:opacity-100 group-hover:scale-105
                       transition-all duration-700"
            style={{
              filter: season === "winter" ? "saturate(0.7) brightness(1.1)" : "none",
            }}
          />
        </div>

        {/* Text content */}
        <div className="flex-1 min-w-0">
          <h4
            className="font-[family-name:var(--font-dm-serif)] text-xl md:text-2xl leading-tight mb-2"
            style={{ color: pal.text }}
          >
            {project.title.replace("\n", " ")}
          </h4>

          <div className="h-px my-3" style={{ background: pal.border }} />

          <p
            className="font-[family-name:var(--font-inter)] text-sm leading-relaxed mb-3"
            style={{ color: pal.muted }}
          >
            {project.description}
          </p>

          <p
            className="font-[family-name:var(--font-jetbrains)] text-[11px] leading-relaxed mb-4"
            style={{ color: pal.muted, opacity: 0.8 }}
          >
            {project.technical}
          </p>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-1.5">
            {project.tech.map((tag) => (
              <span
                key={tag}
                className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-wider uppercase px-2.5 py-1"
                style={{
                  background: `${pal.primary}12`,
                  color: pal.primary,
                  border: `1px solid ${pal.primary}25`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Corner season icon */}
      <div className="absolute bottom-3 right-3 opacity-10 group-hover:opacity-20 transition-opacity">
        <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden>
          {season === "spring" && <SpringFlower x={20} y={20} size={30} color={pal.primary} />}
          {season === "summer" && <SummerSun x={20} y={20} size={30} color={pal.primary} />}
          {season === "autumn" && <AutumnLeaf x={20} y={20} size={30} color={pal.primary} />}
          {season === "winter" && <WinterSnowflake x={20} y={20} size={30} color={pal.primary} />}
        </svg>
      </div>
    </motion.a>
  );
}

/* ─── Expertise as Seasonal Planting Guide ─── */
function PlantingGuideCard({
  item,
  index,
}: {
  item: (typeof expertise)[number];
  index: number;
}) {
  const season = seasonOrder[index % 4];
  const pal = seasons[season];
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const seasonIcon = () => {
    switch (season) {
      case "spring": return <SpringFlower x={20} y={20} size={28} color={pal.primary} />;
      case "summer": return <SummerSun x={20} y={20} size={28} color={pal.primary} />;
      case "autumn": return <AutumnLeaf x={20} y={20} size={28} color={pal.primary} />;
      case "winter": return <WinterSnowflake x={20} y={20} size={28} color={pal.primary} />;
    }
  };

  return (
    <motion.div
      ref={ref}
      className="relative overflow-hidden"
      style={{
        background: pal.bg,
        border: `1px solid ${pal.border}`,
        borderTop: `3px solid ${pal.primary}`,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease, delay: index * 0.12 }}
    >
      <div className="p-5">
        {/* Season badge + icon */}
        <div className="flex items-center justify-between mb-4">
          <span
            className="font-[family-name:var(--font-jetbrains)] text-[9px] tracking-[0.25em] uppercase px-2 py-1"
            style={{
              background: `${pal.primary}15`,
              color: pal.primary,
              border: `1px solid ${pal.primary}25`,
            }}
          >
            {season} planting
          </span>
          <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden>
            {seasonIcon()}
          </svg>
        </div>

        <h4
          className="font-[family-name:var(--font-dm-serif)] text-lg mb-2"
          style={{ color: pal.text }}
        >
          {item.title}
        </h4>

        <div className="h-px my-3" style={{ background: pal.border }} />

        <p
          className="font-[family-name:var(--font-inter)] text-sm leading-relaxed"
          style={{ color: pal.muted }}
        >
          {item.body}
        </p>
      </div>

      {/* Bottom decoration */}
      <div
        className="h-8 flex items-center justify-center gap-2"
        style={{ background: `${pal.primary}08` }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="w-1 h-1 rounded-full"
            style={{ background: pal.primary, opacity: 0.3 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN ALMANAC PAGE
   ═══════════════════════════════════════════════════ */
export default function AlmanacPage() {
  const mainRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: mainRef });
  const [currentSeason, setCurrentSeason] = useState<SeasonKey>("spring");
  const [bgColor, setBgColor] = useState(seasons.spring.bg);
  const [textColor, setTextColor] = useState(seasons.spring.text);

  /* Determine current season and interpolate bg color based on scroll */
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      /* Map scroll progress to season transitions:
         0.00 - 0.25 = Spring
         0.25 - 0.50 = Summer
         0.50 - 0.75 = Autumn
         0.75 - 1.00 = Winter */
      let season: SeasonKey;
      let bg: string;
      let text: string;

      if (v < 0.2) {
        season = "spring";
        const t = v / 0.2;
        bg = lerpColor(seasons.spring.bg, seasons.spring.bg, t);
        text = seasons.spring.text;
      } else if (v < 0.3) {
        season = "spring";
        const t = (v - 0.2) / 0.1;
        bg = lerpColor(seasons.spring.bg, seasons.summer.bg, t);
        text = lerpColor(seasons.spring.text, seasons.summer.text, t);
      } else if (v < 0.45) {
        season = "summer";
        bg = seasons.summer.bg;
        text = seasons.summer.text;
      } else if (v < 0.55) {
        season = "summer";
        const t = (v - 0.45) / 0.1;
        bg = lerpColor(seasons.summer.bg, seasons.autumn.bg, t);
        text = lerpColor(seasons.summer.text, seasons.autumn.text, t);
      } else if (v < 0.7) {
        season = "autumn";
        bg = seasons.autumn.bg;
        text = seasons.autumn.text;
      } else if (v < 0.8) {
        season = "autumn";
        const t = (v - 0.7) / 0.1;
        bg = lerpColor(seasons.autumn.bg, seasons.winter.bg, t);
        text = lerpColor(seasons.autumn.text, seasons.winter.text, t);
      } else {
        season = "winter";
        bg = seasons.winter.bg;
        text = seasons.winter.text;
      }

      setCurrentSeason(season);
      setBgColor(bg);
      setTextColor(text);
    });

    return unsubscribe;
  }, [scrollYProgress]);

  const thermometerProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const [thermoValue, setThermoValue] = useState(0);
  useEffect(() => {
    const unsubscribe = thermometerProgress.on("change", (v) => setThermoValue(v));
    return unsubscribe;
  }, [thermometerProgress]);

  /* Group projects by season for rendering */
  const springProjects = projects.slice(0, 3);
  const summerProjects = projects.slice(3, 6);
  const autumnProjects = projects.slice(6, 8);
  const winterProjects = projects.slice(8, 10);

  const currentYear = new Date().getFullYear();

  return (
    <>
      <style jsx global>{`
        @keyframes almanacGentleSway {
          0%, 100% { transform: rotate(-1deg); }
          50% { transform: rotate(1deg); }
        }
        @keyframes almanacFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes almanacPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes almanacSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes almanacGrow {
          0% { transform: scaleY(0); transform-origin: bottom; }
          100% { transform: scaleY(1); transform-origin: bottom; }
        }
        @keyframes almanacFadeSlide {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .almanac-sway { animation: almanacGentleSway 4s ease-in-out infinite; }
        .almanac-float { animation: almanacFloat 5s ease-in-out infinite; }
        .almanac-pulse { animation: almanacPulse 3s ease-in-out infinite; }
        .almanac-spin-slow { animation: almanacSpin 30s linear infinite; }
      `}</style>

      <main
        ref={mainRef}
        className="relative min-h-screen transition-colors duration-700"
        style={{ background: bgColor, color: textColor }}
      >
        {/* Thermometer fixed on the side */}
        <Thermometer progress={thermoValue} season={currentSeason} />

        {/* ═══════════════ HERO ═══════════════ */}
        <section className="relative flex items-center justify-center min-h-[100vh] px-6 overflow-hidden">
          {/* Background decorative circle */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            aria-hidden
          >
            <motion.div
              className="almanac-spin-slow"
              style={{
                width: 500,
                height: 500,
                borderRadius: "50%",
                border: `1px solid ${seasons[currentSeason].primary}15`,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2, ease }}
            />
          </div>

          <div className="relative z-10 text-center max-w-[760px] mx-auto">
            {/* Vintage frame top */}
            <motion.div
              className="flex items-center justify-center gap-3 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <WheatStalk height={60} color={seasons[currentSeason].primary} />
              <div className="flex flex-col items-center">
                <span
                  className="font-[family-name:var(--font-jetbrains)] text-[9px] tracking-[0.4em] uppercase"
                  style={{ color: seasons[currentSeason].muted }}
                >
                  Est. MMXXV &middot; Grox Press
                </span>
              </div>
              <WheatStalk height={60} color={seasons[currentSeason].primary} />
            </motion.div>

            {/* Icon */}
            <motion.div
              className="text-4xl mb-4"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3, ease }}
            >
              <span style={{ color: "#CC6B2C" }}>&#x2302;</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="font-[family-name:var(--font-instrument)] text-5xl md:text-7xl lg:text-8xl mb-2 tracking-tight"
              style={{ color: seasons[currentSeason].text }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease }}
            >
              THE GROX
            </motion.h1>
            <motion.h1
              className="font-[family-name:var(--font-dm-serif)] text-4xl md:text-6xl lg:text-7xl mb-4"
              style={{ color: "#CC6B2C" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.55, ease }}
            >
              ALMANAC
            </motion.h1>

            {/* Year */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <span
                className="font-[family-name:var(--font-dm-serif)] text-6xl md:text-8xl lg:text-9xl"
                style={{
                  color: seasons[currentSeason].primary,
                  opacity: 0.15,
                  lineHeight: 1,
                }}
              >
                {currentYear}
              </span>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              className="font-[family-name:var(--font-inter)] text-sm md:text-base mb-10 max-w-[480px] mx-auto"
              style={{ color: seasons[currentSeason].muted }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              A Farmer&apos;s Seasonal Guide to AI Engineering &mdash; Planting, Growing &amp; Harvesting Digital Projects Through the Year
            </motion.p>

            {/* Moon Phase Cycle */}
            <motion.div
              className="mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.9 }}
            >
              <p
                className="font-[family-name:var(--font-jetbrains)] text-[8px] tracking-[0.3em] uppercase mb-4"
                style={{ color: seasons[currentSeason].muted, opacity: 0.7 }}
              >
                Lunar Cycle Almanac
              </p>
              <MoonCycleRow color={seasons[currentSeason].text} size={30} />
            </motion.div>

            {/* Stats as Almanac Data */}
            <motion.div
              className="inline-block px-8 py-5"
              style={{
                border: `1px solid ${seasons[currentSeason].border}`,
                background: `${seasons[currentSeason].bg}CC`,
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
            >
              <p
                className="font-[family-name:var(--font-jetbrains)] text-[8px] tracking-[0.3em] uppercase mb-4"
                style={{ color: seasons[currentSeason].muted }}
              >
                Almanac Data &middot; Annual Yield
              </p>
              <div className="flex gap-8 md:gap-12 justify-center">
                {stats.map((s, i) => (
                  <div key={s.label} className="text-center">
                    <motion.div
                      className="font-[family-name:var(--font-dm-serif)] text-3xl md:text-4xl"
                      style={{ color: seasons[currentSeason].primary }}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: 1.3 + i * 0.15, ease }}
                    >
                      {s.value}
                    </motion.div>
                    <div
                      className="font-[family-name:var(--font-jetbrains)] text-[9px] tracking-[0.15em] uppercase mt-1"
                      style={{ color: seasons[currentSeason].muted }}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Scroll hint */}
            <motion.div
              className="mt-12 flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.6 }}
            >
              <span
                className="font-[family-name:var(--font-jetbrains)] text-[8px] tracking-[0.3em] uppercase mb-2"
                style={{ color: seasons[currentSeason].muted, opacity: 0.5 }}
              >
                Scroll to Turn the Seasons
              </span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                  <path d="M4 8L10 14L16 8" stroke={seasons[currentSeason].muted} strokeWidth="1.5" strokeLinecap="round" opacity={0.4} />
                </svg>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════ PROJECTS ═══════════════ */}
        <section className="relative px-6 py-16 max-w-[880px] mx-auto">
          <Reveal>
            <div className="text-center mb-6">
              <p
                className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[0.35em] uppercase mb-3"
                style={{ color: seasons[currentSeason].muted }}
              >
                Seasonal Planting Schedule &middot; {projects.length} Entries
              </p>
              <h2
                className="font-[family-name:var(--font-dm-serif)] text-3xl md:text-4xl"
                style={{ color: seasons[currentSeason].text }}
              >
                The Year&apos;s Harvest
              </h2>
            </div>
          </Reveal>

          {/* SPRING */}
          <SeasonDivider season="spring" label={seasonLabels.spring} />
          <div className="flex flex-col gap-6 mb-8">
            {springProjects.map((project, i) => (
              <AlmanacCard key={project.title} project={project} index={i} season="spring" />
            ))}
          </div>

          {/* SUMMER */}
          <SeasonDivider season="summer" label={seasonLabels.summer} />
          <div className="flex flex-col gap-6 mb-8">
            {summerProjects.map((project, i) => (
              <AlmanacCard key={project.title} project={project} index={i + 3} season="summer" />
            ))}
          </div>

          {/* AUTUMN */}
          <SeasonDivider season="autumn" label={seasonLabels.autumn} />
          <div className="flex flex-col gap-6 mb-8">
            {autumnProjects.map((project, i) => (
              <AlmanacCard key={project.title} project={project} index={i + 6} season="autumn" />
            ))}
          </div>

          {/* WINTER */}
          <SeasonDivider season="winter" label={seasonLabels.winter} />
          <div className="flex flex-col gap-6 mb-8">
            {winterProjects.map((project, i) => (
              <AlmanacCard key={project.title} project={project} index={i + 8} season="winter" />
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 my-8 px-6">
          <div className="h-px flex-1 max-w-[200px]" style={{ background: seasons[currentSeason].border }} />
          <Acorn size={20} color={seasons[currentSeason].primary} />
          <div className="h-px flex-1 max-w-[200px]" style={{ background: seasons[currentSeason].border }} />
        </div>

        {/* ═══════════════ EXPERTISE ═══════════════ */}
        <section className="relative px-6 py-16 max-w-[880px] mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <p
                className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[0.35em] uppercase mb-3"
                style={{ color: seasons[currentSeason].muted }}
              >
                The Planting Guides
              </p>
              <h2
                className="font-[family-name:var(--font-dm-serif)] text-3xl md:text-4xl"
                style={{ color: seasons[currentSeason].text }}
              >
                Seasonal Expertise
              </h2>
              <p
                className="font-[family-name:var(--font-inter)] text-sm mt-3 max-w-[500px] mx-auto"
                style={{ color: seasons[currentSeason].muted }}
              >
                Each discipline, like each season, has its own requirements for nurturing growth
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {expertise.map((item, i) => (
              <PlantingGuideCard key={item.title} item={item} index={i} />
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 my-8 px-6">
          <div className="h-px flex-1 max-w-[200px]" style={{ background: seasons[currentSeason].border }} />
          <WheatStalk height={40} color={seasons[currentSeason].primary} />
          <div className="h-px flex-1 max-w-[200px]" style={{ background: seasons[currentSeason].border }} />
        </div>

        {/* ═══════════════ TOOLS — SEED CATALOG ═══════════════ */}
        <section className="relative px-6 py-16 max-w-[880px] mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <p
                className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[0.35em] uppercase mb-3"
                style={{ color: seasons[currentSeason].muted }}
              >
                Seed Catalog &middot; {currentYear} Edition
              </p>
              <h2
                className="font-[family-name:var(--font-dm-serif)] text-3xl md:text-4xl"
                style={{ color: seasons[currentSeason].text }}
              >
                Planting Chart
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {tools.map((group, gi) => {
              const season = seasonOrder[gi % 4];
              const pal = seasons[season];
              return (
                <Reveal key={group.label} delay={gi * 0.08}>
                  <div
                    className="relative overflow-hidden"
                    style={{
                      background: pal.bg,
                      border: `1px solid ${pal.border}`,
                    }}
                  >
                    {/* Top color bar */}
                    <div
                      className="h-0.5"
                      style={{ background: pal.primary, opacity: 0.5 }}
                    />

                    <div className="p-4">
                      {/* Category header */}
                      <div className="flex items-center gap-2 mb-3">
                        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                          {gi % 4 === 0 && <SpringFlower x={7} y={7} size={10} color={pal.primary} />}
                          {gi % 4 === 1 && <SummerSun x={7} y={7} size={10} color={pal.primary} />}
                          {gi % 4 === 2 && <AutumnLeaf x={7} y={7} size={10} color={pal.primary} />}
                          {gi % 4 === 3 && <WinterSnowflake x={7} y={7} size={10} color={pal.primary} />}
                        </svg>
                        <h3
                          className="font-[family-name:var(--font-dm-serif)] text-base"
                          style={{ color: pal.text }}
                        >
                          {group.label}
                        </h3>
                      </div>

                      <div className="h-px mb-3" style={{ background: pal.border }} />

                      {/* Seed items */}
                      <div className="space-y-2">
                        {group.items.map((item, ii) => (
                          <div
                            key={item}
                            className="flex items-center gap-2"
                          >
                            {/* Seed dot */}
                            <div
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ background: pal.primary, opacity: 0.5 }}
                            />
                            <span
                              className="font-[family-name:var(--font-inter)] text-sm"
                              style={{ color: pal.muted }}
                            >
                              {item}
                            </span>
                            {/* Season badge */}
                            <span
                              className="ml-auto font-[family-name:var(--font-jetbrains)] text-[7px] tracking-wider uppercase"
                              style={{ color: pal.primary, opacity: 0.5 }}
                            >
                              {season.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Seed count */}
                    <div
                      className="px-4 py-2 text-center"
                      style={{ background: `${pal.primary}08`, borderTop: `1px solid ${pal.border}` }}
                    >
                      <span
                        className="font-[family-name:var(--font-jetbrains)] text-[8px] tracking-wider uppercase"
                        style={{ color: pal.muted }}
                      >
                        {group.items.length} varieties
                      </span>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* Catalog summary */}
          <Reveal delay={0.3}>
            <div className="mt-8 text-center">
              <p
                className="font-[family-name:var(--font-jetbrains)] text-[9px] tracking-[0.15em]"
                style={{ color: seasons[currentSeason].muted }}
              >
                {tools.reduce((sum, g) => sum + g.items.length, 0)} seed varieties across{" "}
                {tools.length} categories &middot; All tested for {currentYear} growing season
              </p>
            </div>
          </Reveal>
        </section>

        {/* ═══════════════ FOOTER ═══════════════ */}
        <footer className="relative px-6 py-20 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-5" aria-hidden>
            <div className="almanac-spin-slow" style={{ width: 400, height: 400 }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    left: "50%",
                    top: "50%",
                    transform: `rotate(${i * 45}deg) translateY(-180px)`,
                  }}
                >
                  <MoonPhase phase={i} size={40} color={seasons[currentSeason].text} />
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 max-w-[600px] mx-auto text-center">
            <Reveal>
              <div>
                {/* Moon phase decoration */}
                <div className="flex items-center justify-center gap-3 mb-8">
                  <MoonPhase phase={6} size={24} color={seasons[currentSeason].muted} />
                  <MoonPhase phase={4} size={32} color={seasons[currentSeason].primary} />
                  <MoonPhase phase={2} size={24} color={seasons[currentSeason].muted} />
                </div>

                <p
                  className="font-[family-name:var(--font-jetbrains)] text-[9px] tracking-[0.3em] uppercase mb-4"
                  style={{ color: seasons[currentSeason].muted }}
                >
                  Coming Next Season
                </p>

                <h3
                  className="font-[family-name:var(--font-dm-serif)] text-2xl md:text-3xl mb-3"
                  style={{ color: seasons[currentSeason].text }}
                >
                  Next Year&apos;s Edition
                </h3>

                <p
                  className="font-[family-name:var(--font-inter)] text-sm leading-relaxed mb-8 max-w-[400px] mx-auto"
                  style={{ color: seasons[currentSeason].muted }}
                >
                  New planting guides, expanded seed catalogs, and forecasts for the {currentYear + 1} growing season. Subscribe for early sowing notifications.
                </p>

                {/* Wheat stalks row */}
                <div className="flex items-end justify-center gap-2 mb-8">
                  {[50, 65, 80, 70, 55, 75, 60].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.08, ease }}
                      style={{ transformOrigin: "bottom" }}
                    >
                      <WheatStalk height={h} color={seasons[currentSeason].primary} />
                    </motion.div>
                  ))}
                </div>

                {/* Publisher info */}
                <div
                  className="inline-block px-6 py-4"
                  style={{
                    border: `1px solid ${seasons[currentSeason].border}`,
                    background: `${seasons[currentSeason].bg}80`,
                  }}
                >
                  <p
                    className="font-[family-name:var(--font-jetbrains)] text-[8px] tracking-[0.25em] uppercase mb-2"
                    style={{ color: seasons[currentSeason].muted }}
                  >
                    Published by
                  </p>
                  <p
                    className="font-[family-name:var(--font-dm-serif)] text-lg"
                    style={{ color: seasons[currentSeason].text }}
                  >
                    Grox Press
                  </p>
                  <p
                    className="font-[family-name:var(--font-inter)] text-[10px] mt-2"
                    style={{ color: seasons[currentSeason].muted }}
                  >
                    Composed in DM Serif Display &amp; Inter. Rendered with Next.js.
                    <br />
                    Seasonal illustrations drawn in SVG. Moon phases computed algorithmically.
                  </p>
                </div>

                {/* Final decorative line */}
                <div className="flex items-center justify-center gap-3 mt-10">
                  <div className="h-px w-12" style={{ background: `${seasons[currentSeason].primary}40` }} />
                  <Acorn size={16} color={seasons[currentSeason].primary} />
                  <div className="h-px w-12" style={{ background: `${seasons[currentSeason].primary}40` }} />
                  <MoonPhase phase={4} size={12} color={seasons[currentSeason].primary} />
                  <div className="h-px w-12" style={{ background: `${seasons[currentSeason].primary}40` }} />
                  <Acorn size={16} color={seasons[currentSeason].primary} />
                  <div className="h-px w-12" style={{ background: `${seasons[currentSeason].primary}40` }} />
                </div>

                <p
                  className="font-[family-name:var(--font-jetbrains)] text-[7px] tracking-[0.2em] uppercase mt-6"
                  style={{ color: seasons[currentSeason].muted, opacity: 0.5 }}
                >
                  &copy; {currentYear} &middot; All Rights Reserved &middot; Printed in the Digital Fields
                </p>
              </div>
            </Reveal>
          </div>
        </footer>

        <ThemeSwitcher current="/almanac" variant="dark" />
      </main>
    </>
  );
}
