"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";

/* ================================================================
   PETROGLYPH — Ancient Rock Engravings Portfolio Theme
   Stroke-animated SVG carvings chiseled into rock, ochre pigment
   color washes, and torch flicker lighting effects.
   ================================================================ */

/* --- Color Palette --- */
const C = {
  bg: "#2A2118",
  rock: "#4A3C2E",
  ochre: "#D4773A",
  redOxide: "#A0422D",
  charcoal: "#1A1510",
  bone: "#E8DCC8",
  amber: "#FFB347",
  darkRock: "#1E1A12",
  midRock: "#3A3024",
  lightRock: "#5A4E3E",
  faintBone: "rgba(232,220,200,0.08)",
  ochreGlow: "rgba(212,119,58,0.15)",
};

/* --- Pictogram icons per project (stick-figure style) --- */
const PICTOGRAMS = [
  "eye",      // AI Watch Auth
  "film",     // AI Video Production
  "figure",   // Leader Dossier
  "palette",  // AI Theme Generator
  "scroll",   // Production RAG
  "house",    // AI Interior Design
  "wave",     // Article to Audio
  "chart",    // AI Financial Analyst
  "compass",  // GA4 Analytics
  "sun",      // Creative Gen Platform
];

/* --- Carving styles for expertise panels --- */
const CARVING_STYLES = ["dots", "lines", "spirals", "handprints"];

/* ================================================================
   SVG COMPONENTS
   ================================================================ */

/* --- Sun Symbol (Hero) --- */
function SunSymbol({ size = 200 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
      {/* Radiating lines */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i * 360) / 16;
        const rad = (angle * Math.PI) / 180;
        const x1 = 100 + Math.cos(rad) * 50;
        const y1 = 100 + Math.sin(rad) * 50;
        const x2 = 100 + Math.cos(rad) * (i % 2 === 0 ? 90 : 72);
        const y2 = 100 + Math.sin(rad) * (i % 2 === 0 ? 90 : 72);
        return (
          <motion.line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={C.ochre}
            strokeWidth={i % 2 === 0 ? 2.5 : 1.5}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.8 + i * 0.06, ease: "easeOut" }}
          />
        );
      })}
      {/* Outer circle */}
      <motion.circle
        cx={100}
        cy={100}
        r={45}
        stroke={C.bone}
        strokeWidth={2.5}
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.8, delay: 0.3, ease: "easeInOut" }}
      />
      {/* Inner circle */}
      <motion.circle
        cx={100}
        cy={100}
        r={28}
        stroke={C.ochre}
        strokeWidth={2}
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, delay: 0.6, ease: "easeInOut" }}
      />
      {/* Center dot */}
      <motion.circle
        cx={100}
        cy={100}
        r={8}
        fill={C.ochre}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 1.5 }}
      />
    </svg>
  );
}

/* --- Hunting Scene SVG (Hero decoration) --- */
function HuntingScene() {
  return (
    <svg width="400" height="80" viewBox="0 0 400 80" fill="none" className="opacity-40">
      {/* Ground line */}
      <motion.line x1={0} y1={70} x2={400} y2={70} stroke={C.ochre} strokeWidth={1}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay: 2 }} />
      {/* Stick figure 1 - running */}
      <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.2, duration: 0.8 }}>
        <circle cx={60} cy={30} r={6} stroke={C.bone} strokeWidth={1.5} fill="none" />
        <line x1={60} y1={36} x2={60} y2={55} stroke={C.bone} strokeWidth={1.5} />
        <line x1={60} y1={55} x2={50} y2={68} stroke={C.bone} strokeWidth={1.5} />
        <line x1={60} y1={55} x2={70} y2={68} stroke={C.bone} strokeWidth={1.5} />
        <line x1={60} y1={42} x2={48} y2={38} stroke={C.bone} strokeWidth={1.5} />
        <line x1={60} y1={42} x2={75} y2={35} stroke={C.bone} strokeWidth={1.5} />
        {/* Spear */}
        <line x1={75} y1={35} x2={110} y2={25} stroke={C.ochre} strokeWidth={1.5} />
        <polygon points="110,25 106,21 108,28" fill={C.ochre} />
      </motion.g>
      {/* Stick figure 2 - archer */}
      <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.5, duration: 0.8 }}>
        <circle cx={140} cy={32} r={6} stroke={C.bone} strokeWidth={1.5} fill="none" />
        <line x1={140} y1={38} x2={140} y2={56} stroke={C.bone} strokeWidth={1.5} />
        <line x1={140} y1={56} x2={132} y2={68} stroke={C.bone} strokeWidth={1.5} />
        <line x1={140} y1={56} x2={148} y2={68} stroke={C.bone} strokeWidth={1.5} />
        <line x1={140} y1={44} x2={155} y2={38} stroke={C.bone} strokeWidth={1.5} />
        {/* Bow */}
        <path d="M152,28 Q162,38 152,48" stroke={C.ochre} strokeWidth={1.5} fill="none" />
        <line x1={152} y1={28} x2={152} y2={48} stroke={C.ochre} strokeWidth={1} />
      </motion.g>
      {/* Deer */}
      <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.8, duration: 0.8 }}>
        <ellipse cx={260} cy={42} rx={25} ry={12} stroke={C.ochre} strokeWidth={1.5} fill="none" />
        <line x1={245} y1={54} x2={242} y2={68} stroke={C.ochre} strokeWidth={1.5} />
        <line x1={255} y1={54} x2={252} y2={68} stroke={C.ochre} strokeWidth={1.5} />
        <line x1={268} y1={54} x2={270} y2={68} stroke={C.ochre} strokeWidth={1.5} />
        <line x1={275} y1={54} x2={278} y2={68} stroke={C.ochre} strokeWidth={1.5} />
        {/* Head and antlers */}
        <line x1={285} y1={42} x2={300} y2={30} stroke={C.ochre} strokeWidth={1.5} />
        <circle cx={302} cy={28} r={4} stroke={C.ochre} strokeWidth={1.5} fill="none" />
        <line x1={300} y1={24} x2={295} y2={12} stroke={C.ochre} strokeWidth={1.2} />
        <line x1={295} y1={12} x2={290} y2={8} stroke={C.ochre} strokeWidth={1} />
        <line x1={295} y1={12} x2={298} y2={6} stroke={C.ochre} strokeWidth={1} />
        <line x1={302} y1={24} x2={308} y2={12} stroke={C.ochre} strokeWidth={1.2} />
        <line x1={308} y1={12} x2={312} y2={8} stroke={C.ochre} strokeWidth={1} />
        <line x1={308} y1={12} x2={305} y2={6} stroke={C.ochre} strokeWidth={1} />
      </motion.g>
      {/* Bird in sky */}
      <motion.path d="M340,15 Q345,10 350,15 Q355,10 360,15"
        stroke={C.bone} strokeWidth={1.2} fill="none"
        initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 3.2, duration: 0.6 }} />
    </svg>
  );
}

/* --- Pictogram Icon Component --- */
function PictogramIcon({ type, size = 40 }: { type: string; size?: number }) {
  const s = size;
  const common = { stroke: C.bone, strokeWidth: 1.5, fill: "none" as const };
  switch (type) {
    case "eye":
      return (
        <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
          <ellipse cx={20} cy={20} rx={14} ry={8} {...common} />
          <circle cx={20} cy={20} r={5} {...common} />
          <circle cx={20} cy={20} r={2} fill={C.ochre} />
        </svg>
      );
    case "film":
      return (
        <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
          <rect x={8} y={8} width={24} height={24} rx={2} {...common} />
          <line x1={8} y1={14} x2={32} y2={14} {...common} />
          <line x1={8} y1={26} x2={32} y2={26} {...common} />
          {[12, 17, 23, 28].map((x) => <line key={x} x1={x} y1={8} x2={x} y2={14} {...common} strokeWidth={1} />)}
          {[12, 17, 23, 28].map((x) => <line key={x} x1={x} y1={26} x2={x} y2={32} {...common} strokeWidth={1} />)}
        </svg>
      );
    case "figure":
      return (
        <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
          <circle cx={20} cy={8} r={5} {...common} />
          <line x1={20} y1={13} x2={20} y2={26} {...common} />
          <line x1={20} y1={26} x2={12} y2={36} {...common} />
          <line x1={20} y1={26} x2={28} y2={36} {...common} />
          <line x1={20} y1={18} x2={10} y2={22} {...common} />
          <line x1={20} y1={18} x2={30} y2={22} {...common} />
        </svg>
      );
    case "palette":
      return (
        <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
          <path d="M20 4C11 4 4 11 4 20s7 16 16 16c1.8 0 3.2-1.4 3.2-3.2 0-.8-.3-1.5-.7-2-.5-.6-.8-1.3-.8-2 0-1.8 1.4-3.2 3.2-3.2H28c6 0 11-5 11-11C39 6.5 30.5 0 20 4z" {...common} />
          <circle cx={14} cy={14} r={2.5} fill={C.ochre} />
          <circle cx={22} cy={12} r={2.5} fill={C.redOxide} />
          <circle cx={12} cy={22} r={2.5} fill={C.bone} />
        </svg>
      );
    case "scroll":
      return (
        <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
          <path d="M10 6 Q6 6 6 10 L6 30 Q6 34 10 34 L30 34 Q34 34 34 30 L34 10 Q34 6 30 6 Z" {...common} />
          <line x1={12} y1={14} x2={28} y2={14} {...common} strokeWidth={1} />
          <line x1={12} y1={19} x2={28} y2={19} {...common} strokeWidth={1} />
          <line x1={12} y1={24} x2={22} y2={24} {...common} strokeWidth={1} />
        </svg>
      );
    case "house":
      return (
        <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
          <path d="M20 4L4 18H10V36H30V18H36L20 4Z" {...common} />
          <rect x={16} y={22} width={8} height={14} {...common} />
        </svg>
      );
    case "wave":
      return (
        <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
          <path d="M4 20 Q10 10 16 20 Q22 30 28 20 Q34 10 40 20" {...common} />
          <path d="M4 28 Q10 18 16 28 Q22 38 28 28 Q34 18 40 28" {...common} strokeWidth={1} opacity={0.5} />
        </svg>
      );
    case "chart":
      return (
        <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
          <line x1={6} y1={34} x2={6} y2={6} {...common} />
          <line x1={6} y1={34} x2={36} y2={34} {...common} />
          <polyline points="10,28 16,18 22,22 28,12 34,16" {...common} />
        </svg>
      );
    case "compass":
      return (
        <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
          <circle cx={20} cy={20} r={16} {...common} />
          <polygon points="20,6 22,18 20,22 18,18" fill={C.ochre} stroke={C.ochre} strokeWidth={0.5} />
          <polygon points="20,34 18,22 20,18 22,22" fill={C.bone} stroke={C.bone} strokeWidth={0.5} opacity={0.4} />
        </svg>
      );
    case "sun":
      return (
        <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
          <circle cx={20} cy={20} r={8} {...common} />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i * 360) / 8;
            const r1 = (a * Math.PI) / 180;
            return (
              <line key={i}
                x1={20 + Math.cos(r1) * 12} y1={20 + Math.sin(r1) * 12}
                x2={20 + Math.cos(r1) * 17} y2={20 + Math.sin(r1) * 17}
                {...common} strokeWidth={1.2} />
            );
          })}
        </svg>
      );
    default:
      return (
        <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
          <circle cx={20} cy={20} r={14} {...common} />
          <circle cx={20} cy={20} r={4} fill={C.ochre} />
        </svg>
      );
  }
}

/* --- Rock Edge Border SVG --- */
function RockEdge({ width = 300, side = "top" }: { width?: number; side?: string }) {
  const h = 12;
  const points = Array.from({ length: Math.floor(width / 8) + 1 }).map((_, i) => {
    const x = i * 8;
    const y = side === "top"
      ? h - (Math.sin(i * 1.7) * 3 + Math.random() * 2)
      : Math.sin(i * 1.7) * 3 + Math.random() * 2;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={width} height={h} viewBox={`0 0 ${width} ${h}`} className="pointer-events-none">
      <polyline points={points} stroke={C.lightRock} strokeWidth={1.5} fill="none" opacity={0.6} />
    </svg>
  );
}

/* --- Spiral Decoration --- */
function SpiralSVG({ size = 60, color = C.ochre }: { size?: number; color?: string }) {
  const points: string[] = [];
  for (let t = 0; t < 12; t += 0.1) {
    const r = 2 + t * 2;
    const x = size / 2 + r * Math.cos(t);
    const y = size / 2 + r * Math.sin(t);
    points.push(`${x},${y}`);
  }
  return (
    <motion.svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none"
      animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }}>
      <motion.polyline
        points={points.join(" ")}
        stroke={color}
        strokeWidth={1.5}
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 3, delay: 0.5, ease: "easeOut" }}
      />
    </motion.svg>
  );
}

/* --- Concentric Circles --- */
function ConcentricCircles({ size = 50, color = C.bone }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      {[4, 10, 16, 22].map((r) => (
        <circle key={r} cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={1} opacity={0.4} />
      ))}
    </svg>
  );
}

/* --- Zigzag Pattern --- */
function ZigzagLine({ width = 200, color = C.ochre }: { width?: number; color?: string }) {
  const pts = Array.from({ length: Math.floor(width / 10) + 1 })
    .map((_, i) => `${i * 10},${i % 2 === 0 ? 0 : 10}`)
    .join(" ");
  return (
    <svg width={width} height={12} viewBox={`0 0 ${width} 12`} fill="none" className="opacity-30">
      <polyline points={pts} stroke={color} strokeWidth={1.5} fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* --- Hand Stencil --- */
function HandStencil({ size = 50, color = C.redOxide }: { size?: number; color?: string }) {
  const s = size / 50;
  return (
    <svg width={size} height={size} viewBox="0 0 50 50" fill="none">
      <g transform={`scale(${1})`} opacity={0.5}>
        <path d="M18 48 L18 25 Q18 22 15 20 L15 10 Q15 7 17 7 Q19 7 19 10 L19 20"
          stroke={color} strokeWidth={1.5} fill="none" />
        <path d="M19 20 L19 6 Q19 3 21 3 Q23 3 23 6 L23 18"
          stroke={color} strokeWidth={1.5} fill="none" />
        <path d="M23 18 L23 4 Q23 1 25 1 Q27 1 27 4 L27 18"
          stroke={color} strokeWidth={1.5} fill="none" />
        <path d="M27 18 L27 6 Q27 3 29 3 Q31 3 31 6 L31 20"
          stroke={color} strokeWidth={1.5} fill="none" />
        <path d="M31 20 L33 18 Q35 16 36 18 L34 22 Q32 26 32 30 L32 48"
          stroke={color} strokeWidth={1.5} fill="none" />
        <line x1={18} y1={48} x2={32} y2={48} stroke={color} strokeWidth={1.5} />
      </g>
    </svg>
  );
}

/* --- Carving Style Decoration for Expertise Panels --- */
function CarvingDecor({ style, size = 60 }: { style: string; size?: number }) {
  const c = C.ochre;
  switch (style) {
    case "dots":
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {Array.from({ length: 9 }).map((_, i) => {
            const row = Math.floor(i / 3);
            const col = i % 3;
            return (
              <circle key={i}
                cx={15 + col * 15} cy={15 + row * 15} r={3}
                fill={c} opacity={0.3 + (i * 0.07)} />
            );
          })}
        </svg>
      );
    case "lines":
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <line key={i}
              x1={8} y1={10 + i * 10} x2={size - 8} y2={10 + i * 10}
              stroke={c} strokeWidth={1.5} opacity={0.3 + i * 0.12} />
          ))}
        </svg>
      );
    case "spirals":
      return <SpiralSVG size={size} color={c} />;
    case "handprints":
      return <HandStencil size={size} color={C.redOxide} />;
    default:
      return <ConcentricCircles size={size} color={c} />;
  }
}

/* --- Tally Marks for stats --- */
function TallyMarks({ value }: { value: string }) {
  const num = parseInt(value) || 8;
  const display = Math.min(num, 12);
  const groups = Math.floor(display / 5);
  const remainder = display % 5;
  return (
    <svg width={80} height={36} viewBox="0 0 80 36" fill="none">
      {Array.from({ length: groups }).map((_, g) => (
        <g key={g} transform={`translate(${g * 24}, 0)`}>
          {Array.from({ length: 4 }).map((_, i) => (
            <line key={i} x1={4 + i * 5} y1={4} x2={4 + i * 5} y2={32}
              stroke={C.bone} strokeWidth={2} strokeLinecap="round" />
          ))}
          <line x1={1} y1={22} x2={22} y2={8}
            stroke={C.ochre} strokeWidth={2} strokeLinecap="round" />
        </g>
      ))}
      {Array.from({ length: remainder }).map((_, i) => (
        <line key={`r-${i}`}
          x1={groups * 24 + 4 + i * 5} y1={4}
          x2={groups * 24 + 4 + i * 5} y2={32}
          stroke={C.bone} strokeWidth={2} strokeLinecap="round" />
      ))}
    </svg>
  );
}

/* --- Animal Silhouette (Deer) --- */
function DeerSilhouette({ size = 60 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" opacity={0.2}>
      <path d="M15 50 L15 35 Q15 28 20 25 L25 22 Q30 20 35 22 L40 25 Q45 28 45 35 L45 50"
        stroke={C.ochre} strokeWidth={1.5} />
      <line x1={15} y1={50} x2={12} y2={58} stroke={C.ochre} strokeWidth={1.5} />
      <line x1={22} y1={48} x2={20} y2={58} stroke={C.ochre} strokeWidth={1.5} />
      <line x1={38} y1={48} x2={40} y2={58} stroke={C.ochre} strokeWidth={1.5} />
      <line x1={45} y1={50} x2={48} y2={58} stroke={C.ochre} strokeWidth={1.5} />
      <path d="M20 25 L14 15 Q12 12 10 8" stroke={C.ochre} strokeWidth={1.2} />
      <path d="M10 8 L6 4" stroke={C.ochre} strokeWidth={1} />
      <path d="M10 8 L12 3" stroke={C.ochre} strokeWidth={1} />
      <circle cx={18} cy={20} r={2} stroke={C.ochre} strokeWidth={1} />
    </svg>
  );
}

/* --- Arrow/Spear decoration --- */
function SpearDecor() {
  return (
    <svg width={120} height={16} viewBox="0 0 120 16" fill="none" className="opacity-30">
      <line x1={0} y1={8} x2={100} y2={8} stroke={C.bone} strokeWidth={1.5} />
      <polygon points="100,3 115,8 100,13" fill={C.ochre} />
      {/* Feathers */}
      <line x1={8} y1={8} x2={2} y2={2} stroke={C.bone} strokeWidth={1} />
      <line x1={12} y1={8} x2={6} y2={2} stroke={C.bone} strokeWidth={1} />
      <line x1={8} y1={8} x2={2} y2={14} stroke={C.bone} strokeWidth={1} />
      <line x1={12} y1={8} x2={6} y2={14} stroke={C.bone} strokeWidth={1} />
    </svg>
  );
}

/* ================================================================
   SECTION COMPONENTS
   ================================================================ */

/* --- Scroll-triggered carving reveal wrapper --- */
function CarvingReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* --- Stroke-draw SVG border for project panels --- */
function StonePanel({ children, index }: { children: React.ReactNode; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const w = 600;
  const h = 420;
  const perimeter = 2 * (w + h);

  return (
    <div ref={ref} className="relative" style={{ maxWidth: w }}>
      {/* SVG stroke border that draws on scroll */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
        fill="none"
        style={{ zIndex: 2 }}
      >
        <motion.rect
          x={2}
          y={2}
          width={w - 4}
          height={h - 4}
          rx={4}
          stroke={C.ochre}
          strokeWidth={1.5}
          initial={{ strokeDasharray: perimeter, strokeDashoffset: perimeter }}
          animate={inView ? { strokeDashoffset: 0 } : {}}
          transition={{ duration: 1.8, delay: index * 0.1, ease: "easeInOut" }}
        />
        {/* Inner decorative line */}
        <motion.rect
          x={8}
          y={8}
          width={w - 16}
          height={h - 16}
          rx={2}
          stroke={C.bone}
          strokeWidth={0.5}
          opacity={0.2}
          initial={{ strokeDasharray: perimeter, strokeDashoffset: perimeter }}
          animate={inView ? { strokeDashoffset: 0 } : {}}
          transition={{ duration: 2.2, delay: index * 0.1 + 0.3, ease: "easeInOut" }}
        />
      </svg>
      {/* Content */}
      <motion.div
        className="relative"
        style={{
          background: `linear-gradient(145deg, ${C.midRock}, ${C.darkRock})`,
          borderRadius: 4,
          padding: "32px 28px",
          minHeight: h,
          zIndex: 1,
        }}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: index * 0.1 + 0.4 }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ================================================================
   HERO SECTION
   ================================================================ */

function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: C.bg }}
    >
      {/* Torch glow — top-left */}
      <div className="torch-glow-tl" />
      {/* Torch glow — top-right */}
      <div className="torch-glow-tr" />

      {/* Rock texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 20% 50%, ${C.ochreGlow}, transparent 50%),
            radial-gradient(ellipse at 80% 30%, rgba(255,179,71,0.05), transparent 40%),
            repeating-conic-gradient(${C.faintBone} 0% 25%, transparent 0% 50%)
          `,
          backgroundSize: "100% 100%, 100% 100%, 4px 4px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto">
        {/* Sun Symbol */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <SunSymbol size={180} />
        </motion.div>

        {/* Title — carved into stone */}
        <motion.h1
          className="mt-6 tracking-[0.3em] uppercase"
          style={{
            fontFamily: "var(--font-space-grotesk)",
            fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
            fontWeight: 700,
            color: C.bone,
            textShadow: `
              1px 1px 0 ${C.charcoal},
              2px 2px 4px rgba(0,0,0,0.6),
              inset 0 0 0 transparent
            `,
            WebkitTextStroke: `0.5px ${C.lightRock}`,
            letterSpacing: "0.3em",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          PETROGLYPH
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="mt-4 tracking-[0.15em] uppercase"
          style={{
            fontFamily: "var(--font-manrope)",
            fontSize: "clamp(0.85rem, 1.5vw, 1.1rem)",
            color: C.ochre,
            fontWeight: 500,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          Stories Carved in Stone ---- AI Engineering Portfolio
        </motion.p>

        {/* Zigzag divider */}
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 1.3 }}
        >
          <ZigzagLine width={280} />
        </motion.div>

        {/* Description */}
        <motion.p
          className="mt-6 max-w-xl leading-relaxed"
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "1rem",
            color: `${C.bone}99`,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          Each mark tells a tale of innovation — AI systems etched into the landscape
          of modern technology, enduring as stone.
        </motion.p>

        {/* Hunting Scene */}
        <motion.div
          className="mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
        >
          <HuntingScene />
        </motion.div>

        {/* Stats as tally marks */}
        <motion.div
          className="mt-12 flex flex-wrap justify-center gap-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.2 }}
        >
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <TallyMarks value={stat.value} />
              <span
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  fontSize: "1.4rem",
                  fontWeight: 700,
                  color: C.ochre,
                }}
              >
                {stat.value}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-manrope)",
                  fontSize: "0.75rem",
                  color: `${C.bone}88`,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Spiral decorations flanking */}
        <div className="absolute left-4 top-1/3 hidden lg:block opacity-20">
          <SpiralSVG size={80} color={C.redOxide} />
        </div>
        <div className="absolute right-4 bottom-1/4 hidden lg:block opacity-20">
          <SpiralSVG size={60} color={C.ochre} />
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <span style={{ fontFamily: "var(--font-manrope)", fontSize: "0.65rem", color: `${C.bone}55`, letterSpacing: "0.2em", textTransform: "uppercase" }}>
          Descend
        </span>
        <svg width={16} height={24} viewBox="0 0 16 24" fill="none">
          <line x1={8} y1={0} x2={8} y2={18} stroke={C.ochre} strokeWidth={1.5} />
          <polyline points="3,14 8,20 13,14" stroke={C.ochre} strokeWidth={1.5} fill="none" />
        </svg>
      </motion.div>
    </section>
  );
}

/* ================================================================
   PROJECTS SECTION
   ================================================================ */

function ProjectsSection() {
  return (
    <section className="relative py-28 px-6" style={{ background: C.charcoal }}>
      {/* Section glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 10% 20%, ${C.ochreGlow}, transparent 40%),
            radial-gradient(ellipse at 90% 80%, rgba(160,66,45,0.08), transparent 40%)
          `,
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section header */}
        <CarvingReveal>
          <div className="flex items-center gap-6 mb-4">
            <SpearDecor />
            <h2
              className="tracking-[0.2em] uppercase"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                fontWeight: 700,
                color: C.bone,
              }}
            >
              Rock Panels
            </h2>
          </div>
          <p
            className="mb-16 max-w-lg"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.95rem",
              color: `${C.bone}77`,
              lineHeight: 1.7,
            }}
          >
            Ten engravings documenting the creation of AI-powered systems.
            Each panel is carved from a unique vein of digital stone.
          </p>
        </CarvingReveal>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {projects.map((project, i) => (
            <CarvingReveal key={i} delay={i * 0.08}>
              <StonePanel index={i}>
                {/* Panel header */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center"
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 4,
                        background: `${C.ochre}15`,
                        border: `1px solid ${C.ochre}30`,
                      }}
                    >
                      <PictogramIcon type={PICTOGRAMS[i]} size={32} />
                    </div>
                    <div>
                      <span
                        style={{
                          fontFamily: "var(--font-jetbrains)",
                          fontSize: "0.7rem",
                          color: C.ochre,
                          letterSpacing: "0.1em",
                        }}
                      >
                        {String(i + 1).padStart(2, "0")} / {project.client}
                      </span>
                    </div>
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-jetbrains)",
                      fontSize: "0.65rem",
                      color: `${C.bone}55`,
                    }}
                  >
                    {project.year}
                  </span>
                </div>

                {/* Title — carved style */}
                <h3
                  className="mb-4"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: C.bone,
                    lineHeight: 1.2,
                    whiteSpace: "pre-line",
                    textShadow: `1px 1px 3px rgba(0,0,0,0.5)`,
                  }}
                >
                  {project.title}
                </h3>

                {/* Ochre line divider */}
                <div
                  className="mb-4"
                  style={{
                    width: 60,
                    height: 2,
                    background: `linear-gradient(to right, ${C.ochre}, transparent)`,
                    borderRadius: 1,
                  }}
                />

                {/* Description */}
                <p
                  className="mb-3"
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.85rem",
                    lineHeight: 1.65,
                    color: `${C.bone}99`,
                  }}
                >
                  {project.description}
                </p>

                {/* Technical detail */}
                <p
                  className="mb-5"
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.78rem",
                    lineHeight: 1.6,
                    color: `${C.bone}66`,
                    fontStyle: "italic",
                  }}
                >
                  {project.technical}
                </p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((t, ti) => (
                    <span
                      key={ti}
                      style={{
                        fontFamily: "var(--font-jetbrains)",
                        fontSize: "0.68rem",
                        padding: "3px 10px",
                        borderRadius: 2,
                        background: `${C.ochre}12`,
                        border: `1px solid ${C.ochre}25`,
                        color: C.ochre,
                        letterSpacing: "0.03em",
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
                  className="inline-flex items-center gap-2 transition-colors duration-300"
                  style={{
                    fontFamily: "var(--font-manrope)",
                    fontSize: "0.75rem",
                    color: `${C.bone}66`,
                    textDecoration: "none",
                    letterSpacing: "0.05em",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = C.ochre)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = `${C.bone}66`)}
                >
                  <svg width={14} height={14} viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                  View Source
                </a>

                {/* Corner decoration — concentric circles */}
                <div className="absolute bottom-3 right-3 opacity-15 pointer-events-none">
                  <ConcentricCircles size={40} color={C.ochre} />
                </div>
              </StonePanel>
            </CarvingReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   EXPERTISE SECTION
   ================================================================ */

function ExpertiseSection() {
  return (
    <section className="relative py-28 px-6" style={{ background: C.bg }}>
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse at 50% 0%, ${C.ochreGlow}, transparent 50%)`,
      }} />

      <div className="relative z-10 max-w-5xl mx-auto">
        <CarvingReveal>
          <div className="text-center mb-16">
            <div className="flex justify-center mb-4">
              <DeerSilhouette size={70} />
            </div>
            <h2
              className="tracking-[0.2em] uppercase"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)",
                fontWeight: 700,
                color: C.bone,
              }}
            >
              Sacred Knowledge
            </h2>
            <p
              className="mt-3"
              style={{
                fontFamily: "var(--font-manrope)",
                fontSize: "0.9rem",
                color: `${C.bone}66`,
              }}
            >
              Four disciplines mastered and etched into memory
            </p>
            <div className="flex justify-center mt-4">
              <ZigzagLine width={160} />
            </div>
          </div>
        </CarvingReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {expertise.map((item, i) => {
            const ref = useRef<HTMLDivElement>(null);
            const inView = useInView(ref, { once: true, margin: "-60px" });
            const style = CARVING_STYLES[i];
            return (
              <motion.div
                key={i}
                ref={ref}
                className="relative overflow-hidden"
                style={{
                  background: `linear-gradient(160deg, ${C.midRock}, ${C.darkRock})`,
                  borderRadius: 6,
                  padding: "32px 28px",
                  border: `1px solid ${C.lightRock}30`,
                }}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.12 }}
              >
                {/* Ochre wash overlay animation */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, ${C.ochre}08, ${C.ochre}03, transparent)`,
                  }}
                  initial={{ opacity: 0, x: "-100%" }}
                  animate={inView ? { opacity: 1, x: "0%" } : {}}
                  transition={{ duration: 1.2, delay: i * 0.12 + 0.3 }}
                />

                <div className="relative z-10">
                  {/* Carving style decoration */}
                  <div className="flex items-center gap-4 mb-4">
                    <CarvingDecor style={style} size={48} />
                    <div>
                      <span
                        style={{
                          fontFamily: "var(--font-jetbrains)",
                          fontSize: "0.65rem",
                          color: C.ochre,
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                        }}
                      >
                        Panel {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3
                        style={{
                          fontFamily: "var(--font-space-grotesk)",
                          fontSize: "1.25rem",
                          fontWeight: 700,
                          color: C.bone,
                          marginTop: 2,
                        }}
                      >
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  {/* Carved line */}
                  <div
                    style={{
                      width: "100%",
                      height: 1,
                      background: `linear-gradient(to right, ${C.ochre}40, transparent)`,
                      marginBottom: 16,
                    }}
                  />

                  <p
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: "0.85rem",
                      lineHeight: 1.7,
                      color: `${C.bone}88`,
                    }}
                  >
                    {item.body}
                  </p>
                </div>

                {/* SVG stroke border */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  preserveAspectRatio="none"
                  fill="none"
                >
                  <motion.rect
                    x={1}
                    y={1}
                    width="calc(100% - 2px)"
                    height="calc(100% - 2px)"
                    rx={6}
                    stroke={C.ochre}
                    strokeWidth={1}
                    opacity={0.3}
                    initial={{ strokeDasharray: 1200, strokeDashoffset: 1200 }}
                    animate={inView ? { strokeDashoffset: 0 } : {}}
                    transition={{ duration: 2, delay: i * 0.12 + 0.2 }}
                  />
                </svg>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   TOOLS SECTION
   ================================================================ */

function ToolsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative py-28 px-6"
      style={{
        background: `linear-gradient(180deg, ${C.charcoal}, ${C.bg})`,
      }}
    >
      {/* Torch glow from sides */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse at 5% 50%, rgba(255,179,71,0.06), transparent 30%),
          radial-gradient(ellipse at 95% 50%, rgba(255,179,71,0.06), transparent 30%)
        `,
      }} />

      <div className="relative z-10 max-w-5xl mx-auto">
        <CarvingReveal>
          <div className="text-center mb-16">
            <h2
              className="tracking-[0.2em] uppercase"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)",
                fontWeight: 700,
                color: C.bone,
              }}
            >
              Cave Paintings
            </h2>
            <p
              className="mt-3 mb-4"
              style={{
                fontFamily: "var(--font-manrope)",
                fontSize: "0.9rem",
                color: `${C.bone}66`,
              }}
            >
              The instruments and pigments used to create
            </p>
            <div className="flex justify-center">
              <SpearDecor />
            </div>
          </div>
        </CarvingReveal>

        {/* Tools — cave wall layout */}
        <div
          className="relative rounded-lg overflow-hidden"
          style={{
            background: `
              linear-gradient(145deg, ${C.midRock}, ${C.darkRock} 60%, ${C.charcoal})
            `,
            border: `1px solid ${C.lightRock}20`,
            padding: "40px 32px",
          }}
        >
          {/* Rock texture overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage: `repeating-conic-gradient(${C.faintBone} 0% 25%, transparent 0% 50%)`,
              backgroundSize: "3px 3px",
            }}
          />

          {/* Decorative hand stencils scattered */}
          <div className="absolute top-4 right-4 opacity-10 pointer-events-none">
            <HandStencil size={60} color={C.redOxide} />
          </div>
          <div className="absolute bottom-4 left-4 opacity-10 pointer-events-none rotate-12">
            <HandStencil size={45} color={C.ochre} />
          </div>

          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((group, gi) => (
              <motion.div
                key={gi}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: gi * 0.1 }}
              >
                {/* Category label */}
                <div className="flex items-center gap-2 mb-3">
                  <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                    <circle cx={8} cy={8} r={5} stroke={C.ochre} strokeWidth={1.5} fill="none" />
                    <circle cx={8} cy={8} r={1.5} fill={C.ochre} />
                  </svg>
                  <span
                    style={{
                      fontFamily: "var(--font-space-grotesk)",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: C.ochre,
                      textTransform: "uppercase",
                      letterSpacing: "0.15em",
                    }}
                  >
                    {group.label}
                  </span>
                </div>

                {/* Separator */}
                <div
                  style={{
                    height: 1,
                    background: `linear-gradient(to right, ${C.ochre}30, transparent)`,
                    marginBottom: 10,
                  }}
                />

                {/* Items */}
                <div className="flex flex-col gap-1.5">
                  {group.items.map((item, ii) => (
                    <motion.div
                      key={ii}
                      className="flex items-center gap-2 group cursor-default"
                      initial={{ opacity: 0, x: -10 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.4, delay: gi * 0.1 + ii * 0.05 + 0.3 }}
                      whileHover={{ x: 4 }}
                    >
                      {/* Dot marker */}
                      <div
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background: `${C.bone}40`,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "var(--font-inter)",
                          fontSize: "0.82rem",
                          color: `${C.bone}aa`,
                          transition: "color 0.3s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = C.bone)}
                        onMouseLeave={(e) => (e.currentTarget.style.color = `${C.bone}aa`)}
                      >
                        {item}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* SVG cave painting decorations along the bottom */}
          <div className="relative z-10 mt-10 flex items-center justify-center gap-8 opacity-20">
            <DeerSilhouette size={50} />
            <svg width={30} height={30} viewBox="0 0 30 30" fill="none">
              <circle cx={15} cy={15} r={10} stroke={C.ochre} strokeWidth={1} />
              <circle cx={15} cy={15} r={6} stroke={C.ochre} strokeWidth={1} />
              <circle cx={15} cy={15} r={2} fill={C.ochre} />
            </svg>
            {/* Bird */}
            <svg width={40} height={20} viewBox="0 0 40 20" fill="none">
              <path d="M5,15 Q12,5 20,10 Q28,5 35,15" stroke={C.ochre} strokeWidth={1.5} fill="none" />
            </svg>
            <SpiralSVG size={40} color={C.redOxide} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   FOOTER SECTION
   ================================================================ */

function FooterSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <footer
      ref={ref}
      className="relative py-24 px-6 text-center overflow-hidden"
      style={{ background: C.charcoal }}
    >
      {/* Torch glow at bottom */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse at 50% 100%, rgba(255,179,71,0.08), transparent 50%)`,
      }} />

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Spiral petroglyph */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1 }}
        >
          <SpiralSVG size={90} color={C.ochre} />
        </motion.div>

        {/* "THE STORY CONTINUES" */}
        <motion.h2
          className="tracking-[0.25em] uppercase"
          style={{
            fontFamily: "var(--font-space-grotesk)",
            fontSize: "clamp(1.4rem, 3vw, 2.2rem)",
            fontWeight: 700,
            color: C.bone,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          The Story Continues
        </motion.h2>

        {/* Zigzag */}
        <motion.div
          className="flex justify-center mt-4 mb-8"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <ZigzagLine width={140} />
        </motion.div>

        {/* Hand stencils */}
        <motion.div
          className="flex justify-center gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <HandStencil size={45} color={C.redOxide} />
          <div style={{ transform: "scaleX(-1)" }}>
            <HandStencil size={45} color={C.ochre} />
          </div>
          <HandStencil size={45} color={C.redOxide} />
        </motion.div>

        {/* "Carved by Grox" */}
        <motion.p
          style={{
            fontFamily: "var(--font-manrope)",
            fontSize: "0.8rem",
            color: `${C.bone}55`,
            letterSpacing: "0.1em",
          }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
        >
          Carved by{" "}
          <span style={{ color: C.ochre, fontWeight: 600 }}>Grox</span>
          {" "} --- {new Date().getFullYear()}
        </motion.p>

        {/* Sun symbol small */}
        <motion.div
          className="flex justify-center mt-6"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.3 } : {}}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <circle cx={12} cy={12} r={8} stroke={C.ochre} strokeWidth={1} />
            <circle cx={12} cy={12} r={3} fill={C.ochre} />
          </svg>
        </motion.div>
      </div>
    </footer>
  );
}

/* ================================================================
   MAIN PAGE
   ================================================================ */

export default function PetroglyphPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: C.bg }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <SpiralSVG size={60} color={C.ochre} />
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        /* --- Torch Flicker Animation --- */
        @keyframes torchFlicker {
          0%, 100% { opacity: 0.4; filter: blur(80px); }
          15% { opacity: 0.55; filter: blur(85px); }
          30% { opacity: 0.35; filter: blur(78px); }
          50% { opacity: 0.5; filter: blur(82px); }
          65% { opacity: 0.3; filter: blur(76px); }
          80% { opacity: 0.45; filter: blur(84px); }
        }

        /* --- Carving Shimmer --- */
        @keyframes carvingShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        /* --- Pulse Glow for ochre elements --- */
        @keyframes ochreGlow {
          0%, 100% { box-shadow: 0 0 15px rgba(212,119,58,0.1); }
          50% { box-shadow: 0 0 25px rgba(212,119,58,0.2); }
        }

        /* --- Slow Drift for decorative elements --- */
        @keyframes slowDrift {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }

        /* --- Rock Grain Texture --- */
        @keyframes grainShift {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-1px, 1px); }
          50% { transform: translate(1px, -1px); }
          75% { transform: translate(-1px, -1px); }
        }

        /* --- Torch Glow Positions --- */
        .torch-glow-tl {
          position: absolute;
          top: -40px;
          left: -40px;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,179,71,0.25), transparent 70%);
          animation: torchFlicker 4s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }

        .torch-glow-tr {
          position: absolute;
          top: -30px;
          right: -30px;
          width: 260px;
          height: 260px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,179,71,0.2), transparent 70%);
          animation: torchFlicker 5s ease-in-out infinite 1s;
          pointer-events: none;
          z-index: 0;
        }

        /* --- Selection Color --- */
        ::selection {
          background: rgba(212,119,58,0.3);
          color: #E8DCC8;
        }

        /* --- Scrollbar Styling --- */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #1A1510;
        }
        ::-webkit-scrollbar-thumb {
          background: #4A3C2E;
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #D4773A;
        }

        /* --- Link hover for project panels --- */
        .petroglyph-panel:hover .panel-border {
          stroke: #D4773A;
          stroke-width: 2;
        }

        /* --- Smooth scroll --- */
        html {
          scroll-behavior: smooth;
        }
      `}</style>

      <main
        className="min-h-screen w-full overflow-x-hidden"
        style={{
          background: C.bg,
          color: C.bone,
          fontFamily: "var(--font-inter)",
        }}
      >
        <HeroSection />
        <ProjectsSection />
        <ExpertiseSection />
        <ToolsSection />
        <FooterSection />
        <ThemeSwitcher current="/petroglyph" variant="dark" />
      </main>
    </>
  );
}
