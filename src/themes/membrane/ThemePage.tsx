"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import Link from "next/link";
import { projects, stats, expertise, tools } from "@/app/data/projects";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";

/* ═══════════════════════════════════════════════════════════════════ */
/*  COLORS — Cellular Biology Palette                                 */
/* ═══════════════════════════════════════════════════════════════════ */
const C = {
  bg: "#0A1A1A",
  bgCard: "#0D2222",
  bgDeep: "#071414",
  teal: "#00D4AA",
  pink: "#FF6B9D",
  purple: "#7C3AED",
  cytoplasm: "#E0FFF0",
  blue: "#4A90D9",
  orange: "#FF8C42",
  text: "#B8E8D8",
  muted: "#5A8A7A",
  border: "rgba(0,212,170,0.12)",
  glowSoft: "rgba(0,212,170,0.08)",
  glowMed: "rgba(0,212,170,0.2)",
  glowStrong: "rgba(0,212,170,0.45)",
};

/* ═══════════════════════════════════════════════════════════════════ */
/*  SEEDED RNG                                                        */
/* ═══════════════════════════════════════════════════════════════════ */
function seededRng(seed: number) {
  return (i: number) => {
    const s = Math.sin(seed * 127.1 + i * 311.7) * 43758.5453;
    return s - Math.floor(s);
  };
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  VESICLE BUBBLE DATA                                               */
/* ═══════════════════════════════════════════════════════════════════ */
interface Vesicle {
  id: number;
  x: number;
  y: number;
  r: number;
  delay: number;
  duration: number;
  opacity: number;
  color1: string;
  color2: string;
}

function generateVesicles(count: number, seed: number): Vesicle[] {
  const rng = seededRng(seed);
  const colors = [
    [C.teal, "rgba(0,212,170,0.1)"],
    [C.pink, "rgba(255,107,157,0.1)"],
    [C.purple, "rgba(124,58,237,0.1)"],
    [C.blue, "rgba(74,144,217,0.1)"],
    [C.orange, "rgba(255,140,66,0.1)"],
  ];
  return Array.from({ length: count }, (_, i) => {
    const c = colors[Math.floor(rng(i * 7) * colors.length)];
    return {
      id: i,
      x: rng(i * 3) * 100,
      y: rng(i * 5) * 100,
      r: 4 + rng(i * 11) * 18,
      delay: rng(i * 13) * 8,
      duration: 12 + rng(i * 17) * 20,
      opacity: 0.15 + rng(i * 19) * 0.35,
      color1: c[0],
      color2: c[1],
    };
  });
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  ORGANELLE CONFIG                                                  */
/* ═══════════════════════════════════════════════════════════════════ */
const organelleColors = [
  { border: C.teal, bg: "rgba(0,212,170,0.06)", glow: "rgba(0,212,170,0.15)" },
  { border: C.pink, bg: "rgba(255,107,157,0.06)", glow: "rgba(255,107,157,0.15)" },
  { border: C.purple, bg: "rgba(124,58,237,0.06)", glow: "rgba(124,58,237,0.15)" },
  { border: C.blue, bg: "rgba(74,144,217,0.06)", glow: "rgba(74,144,217,0.15)" },
  { border: C.orange, bg: "rgba(255,140,66,0.06)", glow: "rgba(255,140,66,0.15)" },
];

const organelleShapes = [
  "62% 38% 46% 54% / 42% 58% 42% 58%",
  "48% 52% 58% 42% / 55% 45% 55% 45%",
  "55% 45% 40% 60% / 60% 40% 52% 48%",
  "42% 58% 52% 48% / 48% 52% 60% 40%",
  "58% 42% 45% 55% / 52% 48% 38% 62%",
  "45% 55% 55% 45% / 58% 42% 48% 52%",
  "52% 48% 42% 58% / 45% 55% 62% 38%",
  "60% 40% 48% 52% / 38% 62% 45% 55%",
  "46% 54% 60% 40% / 55% 45% 40% 60%",
  "50% 50% 44% 56% / 46% 54% 56% 44%",
];

/* ═══════════════════════════════════════════════════════════════════ */
/*  EXPERTISE ORGANELLE CONFIG                                        */
/* ═══════════════════════════════════════════════════════════════════ */
const expertiseOrganelles = [
  { name: "Mitochondria", color: C.teal, accent: C.orange },
  { name: "Ribosome", color: C.purple, accent: C.pink },
  { name: "Endoplasmic Reticulum", color: C.blue, accent: C.teal },
  { name: "Golgi Apparatus", color: C.orange, accent: C.purple },
];

/* ═══════════════════════════════════════════════════════════════════ */
/*  SVG COMPONENTS                                                    */
/* ═══════════════════════════════════════════════════════════════════ */

/* Phospholipid Bilayer Divider */
function PhospholipidDivider({ flip = false }: { flip?: boolean }) {
  const count = 28;
  return (
    <div style={{ width: "100%", overflow: "hidden", height: 60, position: "relative" }}>
      <svg
        viewBox="0 0 1200 60"
        fill="none"
        style={{ width: "100%", height: 60, display: "block" }}
        preserveAspectRatio="none"
      >
        {/* Upper leaflet */}
        {Array.from({ length: count }, (_, i) => {
          const x = 20 + (i / (count - 1)) * 1160;
          const topY = flip ? 42 : 18;
          const tailDir = flip ? -1 : 1;
          return (
            <g key={`upper-${i}`}>
              <circle cx={x} cy={topY} r={4.5} fill={C.teal} opacity={0.7} />
              <line
                x1={x}
                y1={topY + tailDir * 5}
                x2={x - 3}
                y2={topY + tailDir * 18}
                stroke={C.teal}
                strokeWidth={1.2}
                opacity={0.35}
              />
              <line
                x1={x}
                y1={topY + tailDir * 5}
                x2={x + 3}
                y2={topY + tailDir * 18}
                stroke={C.teal}
                strokeWidth={1.2}
                opacity={0.35}
              />
            </g>
          );
        })}
        {/* Lower leaflet */}
        {Array.from({ length: count }, (_, i) => {
          const x = 20 + (i / (count - 1)) * 1160 + 20;
          const bottomY = flip ? 18 : 42;
          const tailDir = flip ? 1 : -1;
          return (
            <g key={`lower-${i}`}>
              <circle cx={x} cy={bottomY} r={4.5} fill={C.pink} opacity={0.5} />
              <line
                x1={x}
                y1={bottomY + tailDir * 5}
                x2={x - 3}
                y2={bottomY + tailDir * 18}
                stroke={C.pink}
                strokeWidth={1.2}
                opacity={0.25}
              />
              <line
                x1={x}
                y1={bottomY + tailDir * 5}
                x2={x + 3}
                y2={bottomY + tailDir * 18}
                stroke={C.pink}
                strokeWidth={1.2}
                opacity={0.25}
              />
            </g>
          );
        })}
        {/* Protein channels */}
        {[300, 600, 900].map((cx) => (
          <g key={`protein-${cx}`}>
            <rect
              x={cx - 8}
              y={8}
              width={16}
              height={44}
              rx={8}
              fill={C.purple}
              opacity={0.25}
            />
            <rect
              x={cx - 3}
              y={12}
              width={6}
              height={36}
              rx={3}
              fill={C.bgDeep}
              opacity={0.8}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}

/* Cell Membrane Cross-Section for Hero */
function CellCrossSection() {
  return (
    <svg viewBox="0 0 800 600" fill="none" style={{ width: "100%", height: "100%" }}>
      <defs>
        <radialGradient id="cellGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={C.bgDeep} />
          <stop offset="60%" stopColor="rgba(0,212,170,0.03)" />
          <stop offset="100%" stopColor="rgba(0,212,170,0.08)" />
        </radialGradient>
        <radialGradient id="nucleusGrad" cx="45%" cy="45%" r="50%">
          <stop offset="0%" stopColor="rgba(124,58,237,0.3)" />
          <stop offset="70%" stopColor="rgba(124,58,237,0.1)" />
          <stop offset="100%" stopColor="rgba(124,58,237,0.02)" />
        </radialGradient>
        <filter id="cellGlow">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* Cell membrane outer boundary */}
      <ellipse
        cx={400}
        cy={300}
        rx={360}
        ry={260}
        fill="url(#cellGrad)"
        stroke={C.teal}
        strokeWidth={2}
        opacity={0.4}
      />
      {/* Inner membrane */}
      <ellipse
        cx={400}
        cy={300}
        rx={350}
        ry={250}
        fill="none"
        stroke={C.teal}
        strokeWidth={1}
        opacity={0.2}
        strokeDasharray="4 8"
      />

      {/* Phospholipid details on membrane */}
      {Array.from({ length: 36 }, (_, i) => {
        const angle = (i / 36) * Math.PI * 2;
        const outerX = 400 + Math.cos(angle) * 360;
        const outerY = 300 + Math.sin(angle) * 260;
        const innerX = 400 + Math.cos(angle) * 345;
        const innerY = 300 + Math.sin(angle) * 248;
        return (
          <g key={`lipid-${i}`}>
            <circle cx={outerX} cy={outerY} r={3} fill={C.teal} opacity={0.5} />
            <line
              x1={outerX}
              y1={outerY}
              x2={innerX}
              y2={innerY}
              stroke={C.teal}
              strokeWidth={0.8}
              opacity={0.2}
            />
          </g>
        );
      })}

      {/* Nucleus */}
      <ellipse
        cx={380}
        cy={290}
        rx={100}
        ry={80}
        fill="url(#nucleusGrad)"
        stroke={C.purple}
        strokeWidth={1.5}
        opacity={0.6}
        filter="url(#cellGlow)"
      />
      {/* Nucleolus */}
      <circle cx={370} cy={285} r={25} fill="rgba(124,58,237,0.2)" stroke={C.purple} strokeWidth={1} opacity={0.5} />
      {/* Chromatin strands */}
      <path
        d="M340 270 Q360 260 380 275 T420 270"
        stroke={C.purple}
        strokeWidth={1.5}
        opacity={0.3}
        fill="none"
      />
      <path
        d="M350 300 Q370 310 390 295 T430 305"
        stroke={C.purple}
        strokeWidth={1}
        opacity={0.25}
        fill="none"
      />

      {/* Mitochondria */}
      <g transform="translate(580, 200) rotate(-20)">
        <ellipse rx={45} ry={22} fill="rgba(255,140,66,0.15)" stroke={C.orange} strokeWidth={1.2} opacity={0.6} />
        <path d="M-30 0 Q-20 -15 -10 0 T10 0 T30 0" stroke={C.orange} strokeWidth={0.8} opacity={0.3} fill="none" />
        <path d="M-25 8 Q-15 -5 -5 8 T15 8 T25 8" stroke={C.orange} strokeWidth={0.8} opacity={0.25} fill="none" />
      </g>

      {/* Mitochondria 2 */}
      <g transform="translate(230, 400) rotate(15)">
        <ellipse rx={38} ry={18} fill="rgba(255,140,66,0.12)" stroke={C.orange} strokeWidth={1} opacity={0.5} />
        <path d="M-25 0 Q-15 -12 -5 0 T15 0 T25 0" stroke={C.orange} strokeWidth={0.7} opacity={0.25} fill="none" />
      </g>

      {/* Endoplasmic Reticulum */}
      <path
        d="M480 340 Q500 320 520 340 T560 340 Q580 360 560 380 T520 380 Q500 360 480 380 T440 380"
        stroke={C.blue}
        strokeWidth={1.5}
        opacity={0.35}
        fill="none"
      />
      <path
        d="M490 350 Q510 330 530 350 T570 350"
        stroke={C.blue}
        strokeWidth={1}
        opacity={0.2}
        fill="none"
      />
      {/* Ribosomes on ER */}
      {[490, 510, 530, 550].map((x, i) => (
        <circle key={`rib-${i}`} cx={x} cy={340 + (i % 2 === 0 ? -5 : 5)} r={3} fill={C.pink} opacity={0.4} />
      ))}

      {/* Golgi apparatus */}
      <g transform="translate(280, 180)">
        {[0, 12, 24, 36].map((offset, i) => (
          <path
            key={`golgi-${i}`}
            d={`M-40 ${offset} Q-20 ${offset - 8 + i * 2} 0 ${offset} T40 ${offset}`}
            stroke={C.teal}
            strokeWidth={2 - i * 0.3}
            opacity={0.3 - i * 0.05}
            fill="none"
          />
        ))}
        {/* Golgi vesicles */}
        <circle cx={50} cy={10} r={5} fill="rgba(0,212,170,0.15)" stroke={C.teal} strokeWidth={0.8} opacity={0.4} />
        <circle cx={55} cy={25} r={4} fill="rgba(0,212,170,0.1)" stroke={C.teal} strokeWidth={0.6} opacity={0.3} />
      </g>

      {/* Free ribosomes */}
      {[
        [560, 450], [600, 420], [180, 340], [200, 360],
        [640, 320], [160, 250], [620, 260],
      ].map(([x, y], i) => (
        <circle key={`free-rib-${i}`} cx={x} cy={y} r={2.5} fill={C.pink} opacity={0.3} />
      ))}

      {/* Vesicles floating */}
      {[
        { cx: 150, cy: 180, r: 12 },
        { cx: 650, cy: 440, r: 10 },
        { cx: 520, cy: 160, r: 8 },
        { cx: 300, cy: 450, r: 14 },
      ].map((v, i) => (
        <circle
          key={`vesicle-${i}`}
          cx={v.cx}
          cy={v.cy}
          r={v.r}
          fill={`rgba(0,212,170,${0.05 + i * 0.02})`}
          stroke={C.teal}
          strokeWidth={0.8}
          opacity={0.35}
        />
      ))}

      {/* Protein channels on membrane */}
      {[0, 60, 150, 210, 290].map((deg, i) => {
        const angle = (deg / 360) * Math.PI * 2;
        const x = 400 + Math.cos(angle) * 355;
        const y = 300 + Math.sin(angle) * 255;
        return (
          <g key={`channel-${i}`} transform={`translate(${x},${y}) rotate(${deg + 90})`}>
            <rect x={-4} y={-10} width={8} height={20} rx={4} fill={C.blue} opacity={0.3} />
            <rect x={-1.5} y={-7} width={3} height={14} rx={1.5} fill={C.bgDeep} opacity={0.6} />
          </g>
        );
      })}
    </svg>
  );
}

/* Mitochondria SVG for expertise card */
function MitochondriaSVG({ color, accent }: { color: string; accent: string }) {
  return (
    <svg viewBox="0 0 120 60" fill="none" style={{ width: 120, height: 60 }}>
      <ellipse cx={60} cy={30} rx={55} ry={25} fill={`${color}15`} stroke={color} strokeWidth={1.5} opacity={0.6} />
      <path d="M15 30 Q25 12 40 30 T65 30 T90 30 T105 30" stroke={accent} strokeWidth={1} opacity={0.4} fill="none" />
      <path d="M20 38 Q30 22 45 38 T70 38 T95 38" stroke={accent} strokeWidth={0.8} opacity={0.3} fill="none" />
    </svg>
  );
}

/* Ribosome SVG */
function RibosomeSVG({ color, accent }: { color: string; accent: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" style={{ width: 80, height: 80 }}>
      <circle cx={40} cy={30} r={18} fill={`${color}15`} stroke={color} strokeWidth={1.5} opacity={0.6} />
      <circle cx={40} cy={55} r={14} fill={`${accent}15`} stroke={accent} strokeWidth={1.2} opacity={0.5} />
      <path d="M30 42 Q40 38 50 42" stroke={color} strokeWidth={1} opacity={0.4} fill="none" />
    </svg>
  );
}

/* ER SVG */
function ERSVG({ color, accent }: { color: string; accent: string }) {
  return (
    <svg viewBox="0 0 140 60" fill="none" style={{ width: 140, height: 60 }}>
      <path
        d="M10 30 Q25 10 40 30 T70 30 T100 30 T130 30"
        stroke={color}
        strokeWidth={2}
        opacity={0.5}
        fill="none"
      />
      <path
        d="M10 40 Q25 20 40 40 T70 40 T100 40 T130 40"
        stroke={color}
        strokeWidth={1.5}
        opacity={0.35}
        fill="none"
      />
      {[25, 50, 75, 100, 120].map((x, i) => (
        <circle key={i} cx={x} cy={30 + (i % 2 === 0 ? -4 : 4)} r={3} fill={accent} opacity={0.4} />
      ))}
    </svg>
  );
}

/* Golgi SVG */
function GolgiSVG({ color, accent }: { color: string; accent: string }) {
  return (
    <svg viewBox="0 0 120 80" fill="none" style={{ width: 120, height: 80 }}>
      {[0, 14, 28, 42].map((y, i) => (
        <path
          key={i}
          d={`M10 ${20 + y} Q35 ${12 + y + i * 3} 60 ${20 + y} T110 ${20 + y}`}
          stroke={color}
          strokeWidth={2.5 - i * 0.4}
          opacity={0.5 - i * 0.08}
          fill="none"
        />
      ))}
      <circle cx={105} cy={25} r={6} fill={`${accent}20`} stroke={accent} strokeWidth={1} opacity={0.5} />
      <circle cx={110} cy={42} r={5} fill={`${accent}15`} stroke={accent} strokeWidth={0.8} opacity={0.4} />
      <circle cx={108} cy={58} r={4} fill={`${accent}10`} stroke={accent} strokeWidth={0.6} opacity={0.3} />
    </svg>
  );
}

const expertiseSVGs = [MitochondriaSVG, RibosomeSVG, ERSVG, GolgiSVG];

/* ═══════════════════════════════════════════════════════════════════ */
/*  ION CHANNEL FOR TOOLS                                             */
/* ═══════════════════════════════════════════════════════════════════ */
function IonChannel({ color, index }: { color: string; index: number }) {
  return (
    <svg viewBox="0 0 60 80" fill="none" style={{ width: 40, height: 56 }}>
      {/* Channel walls */}
      <rect x={8} y={0} width={12} height={80} rx={6} fill={color} opacity={0.2} />
      <rect x={40} y={0} width={12} height={80} rx={6} fill={color} opacity={0.2} />
      {/* Channel interior */}
      <rect x={22} y={5} width={16} height={70} rx={3} fill={C.bgDeep} opacity={0.6} />
      {/* Ion passing through */}
      <circle cx={30} cy={20 + (index * 12) % 40} r={4} fill={color} opacity={0.7}>
        <animate
          attributeName="cy"
          values="10;70;10"
          dur={`${2.5 + index * 0.3}s`}
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.7;0.3;0.7"
          dur={`${2.5 + index * 0.3}s`}
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  MITOSIS ANIMATION for Footer                                      */
/* ═══════════════════════════════════════════════════════════════════ */
function MitosisAnimation() {
  return (
    <svg viewBox="0 0 300 100" fill="none" style={{ width: 300, height: 100 }}>
      <defs>
        <radialGradient id="cell1Grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={C.teal} stopOpacity={0.2} />
          <stop offset="100%" stopColor={C.teal} stopOpacity={0.02} />
        </radialGradient>
        <radialGradient id="cell2Grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={C.pink} stopOpacity={0.2} />
          <stop offset="100%" stopColor={C.pink} stopOpacity={0.02} />
        </radialGradient>
      </defs>
      {/* Left daughter cell */}
      <ellipse cx={100} cy={50} rx={60} ry={40} fill="url(#cell1Grad)" stroke={C.teal} strokeWidth={1.2} opacity={0.5}>
        <animate attributeName="cx" values="150;100;100" dur="4s" repeatCount="indefinite" />
        <animate attributeName="rx" values="55;60;60" dur="4s" repeatCount="indefinite" />
      </ellipse>
      {/* Right daughter cell */}
      <ellipse cx={200} cy={50} rx={60} ry={40} fill="url(#cell2Grad)" stroke={C.pink} strokeWidth={1.2} opacity={0.5}>
        <animate attributeName="cx" values="150;200;200" dur="4s" repeatCount="indefinite" />
        <animate attributeName="rx" values="55;60;60" dur="4s" repeatCount="indefinite" />
      </ellipse>
      {/* Cleavage furrow */}
      <line x1={150} y1={15} x2={150} y2={85} stroke={C.purple} strokeWidth={1} opacity={0.3} strokeDasharray="3 4">
        <animate attributeName="opacity" values="0;0.3;0.5;0.3;0" dur="4s" repeatCount="indefinite" />
      </line>
      {/* Nuclei */}
      <circle cx={100} cy={50} r={10} fill="rgba(124,58,237,0.2)" stroke={C.purple} strokeWidth={0.8} opacity={0.5}>
        <animate attributeName="cx" values="150;100;100" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx={200} cy={50} r={10} fill="rgba(124,58,237,0.2)" stroke={C.purple} strokeWidth={0.8} opacity={0.5}>
        <animate attributeName="cx" values="150;200;200" dur="4s" repeatCount="indefinite" />
      </circle>
      {/* Spindle fibers */}
      {[-15, 0, 15].map((offset, i) => (
        <line
          key={i}
          x1={100}
          y1={50}
          x2={200}
          y2={50 + offset}
          stroke={C.teal}
          strokeWidth={0.5}
          opacity={0.2}
          strokeDasharray="2 4"
        >
          <animate attributeName="opacity" values="0.2;0.05;0.2" dur="4s" repeatCount="indefinite" />
        </line>
      ))}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  FLOATING VESICLES LAYER                                           */
/* ═══════════════════════════════════════════════════════════════════ */
function VesicleLayer({ vesicles }: { vesicles: Vesicle[] }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      {vesicles.map((v) => (
        <div
          key={v.id}
          className="vesicle-float"
          style={{
            position: "absolute",
            left: `${v.x}%`,
            top: `${v.y}%`,
            width: v.r * 2,
            height: v.r * 2,
            borderRadius: "50%",
            background: `radial-gradient(circle at 35% 35%, ${v.color1}30, ${v.color2})`,
            border: `1px solid ${v.color1}20`,
            opacity: v.opacity,
            animationDelay: `${v.delay}s`,
            animationDuration: `${v.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  SECTION WRAPPER                                                   */
/* ═══════════════════════════════════════════════════════════════════ */
function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  MAIN PAGE COMPONENT                                               */
/* ═══════════════════════════════════════════════════════════════════ */
export default function MembranePage() {
  const [vesicles, setVesicles] = useState<Vesicle[]>([]);
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true });

  useEffect(() => {
    setVesicles(generateVesicles(24, 42));
    setMounted(true);
  }, []);

  const toolColors = [C.teal, C.pink, C.purple, C.blue, C.orange, C.teal];

  return (
    <>
      <style>{`
        /* ─── Vesicle floating animation ─── */
        @keyframes vesicleFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(12px, -18px) scale(1.05); }
          50% { transform: translate(-8px, -30px) scale(0.95); }
          75% { transform: translate(15px, -12px) scale(1.03); }
        }
        .vesicle-float {
          animation: vesicleFloat 20s ease-in-out infinite;
        }

        /* ─── Membrane undulation ─── */
        @keyframes membraneUndulate {
          0%, 100% { transform: scaleY(1) translateY(0); }
          33% { transform: scaleY(1.02) translateY(-2px); }
          66% { transform: scaleY(0.98) translateY(2px); }
        }
        .membrane-undulate {
          animation: membraneUndulate 6s ease-in-out infinite;
        }

        /* ─── Organelle pulse ─── */
        @keyframes organellePulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.03); opacity: 1; }
        }
        .organelle-pulse {
          animation: organellePulse 4s ease-in-out infinite;
        }

        /* ─── Protein transport ─── */
        @keyframes proteinTransport {
          0% { transform: translateX(-100%); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateX(100vw); opacity: 0; }
        }
        .protein-transport {
          animation: proteinTransport 18s linear infinite;
        }

        /* ─── Cell division at footer ─── */
        @keyframes cellDivide {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(1.15); }
        }

        /* ─── Bio teal glow ─── */
        @keyframes bioGlow {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(0,212,170,0.2)); }
          50% { filter: drop-shadow(0 0 20px rgba(0,212,170,0.4)); }
        }
        .bio-glow {
          animation: bioGlow 3s ease-in-out infinite;
        }

        /* ─── Cytoplasm drift ─── */
        @keyframes cytoplasmDrift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        /* ─── Ion transport for tool items ─── */
        @keyframes ionPass {
          0%, 100% { transform: translateY(0); opacity: 0.6; }
          50% { transform: translateY(-6px); opacity: 1; }
        }
        .ion-pass {
          animation: ionPass 2s ease-in-out infinite;
        }

        /* ─── Nucleus rotate ─── */
        @keyframes nucleusRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* ─── Hero letter animation ─── */
        @keyframes letterFlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        /* ─── Scrollbar styling ─── */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${C.bgDeep}; }
        ::-webkit-scrollbar-thumb {
          background: ${C.teal}40;
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover { background: ${C.teal}70; }

        /* ─── Selection ─── */
        ::selection {
          background: ${C.teal}40;
          color: ${C.cytoplasm};
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: C.bg,
          color: C.text,
          fontFamily: "var(--font-inter)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Floating vesicles background */}
        {mounted && <VesicleLayer vesicles={vesicles} />}

        {/* Protein transport lines */}
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="protein-transport"
              style={{
                position: "absolute",
                top: `${20 + i * 25}%`,
                left: 0,
                width: 60,
                height: 2,
                background: `linear-gradient(90deg, transparent, ${C.teal}30, transparent)`,
                borderRadius: 1,
                animationDelay: `${i * 6}s`,
              }}
            />
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/*  HERO                                                   */}
        {/* ═══════════════════════════════════════════════════════ */}
        <div
          ref={heroRef}
          style={{
            position: "relative",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 24px 60px",
            zIndex: 1,
          }}
        >
          {/* Cell cross-section background */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0.35,
              pointerEvents: "none",
            }}
          >
            <div style={{ width: "min(90vw, 800px)", height: "min(70vh, 600px)" }} className="membrane-undulate">
              <CellCrossSection />
            </div>
          </div>

          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={heroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              fontSize: 40,
              color: C.teal,
              marginBottom: 24,
              position: "relative",
              zIndex: 2,
            }}
            className="bio-glow"
          >
            ⬭
          </motion.div>

          {/* MEMBRANE title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.3 }}
            style={{
              fontFamily: "var(--font-space-grotesk)",
              fontSize: "clamp(48px, 10vw, 120px)",
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: C.cytoplasm,
              textAlign: "center",
              position: "relative",
              zIndex: 2,
              lineHeight: 1,
              marginBottom: 16,
            }}
          >
            {"MEMBRANE".split("").map((char, i) => (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  animation: `letterFlow ${2 + i * 0.15}s ease-in-out infinite`,
                  animationDelay: `${i * 0.12}s`,
                  textShadow: `0 0 40px ${C.teal}60, 0 0 80px ${C.teal}20`,
                }}
              >
                {char}
              </span>
            ))}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{
              fontFamily: "var(--font-sora)",
              fontSize: "clamp(14px, 2vw, 18px)",
              color: C.muted,
              textAlign: "center",
              maxWidth: 520,
              lineHeight: 1.7,
              position: "relative",
              zIndex: 2,
              letterSpacing: "0.04em",
            }}
          >
            Cellular biology interface. AI products engineered as
            living organelles — each system a vital component of the whole organism.
          </motion.p>

          {/* Stats as cellular measurements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.7 }}
            style={{
              display: "flex",
              gap: 48,
              marginTop: 48,
              position: "relative",
              zIndex: 2,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {stats.map((stat, i) => {
              const units = ["specimens", "enzymes", "biomes"];
              const symbols = ["μm", "kDa", "pH"];
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={heroInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.9 + i * 0.15 }}
                  style={{
                    textAlign: "center",
                    padding: "16px 24px",
                    borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                    background: `radial-gradient(circle at 40% 40%, ${C.teal}10, transparent)`,
                    border: `1px solid ${C.teal}15`,
                    minWidth: 120,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-jetbrains)",
                      fontSize: 32,
                      fontWeight: 700,
                      color: C.teal,
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                    <span style={{ fontSize: 12, opacity: 0.5, marginLeft: 2 }}>{symbols[i]}</span>
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-sora)",
                      fontSize: 11,
                      color: C.muted,
                      marginTop: 6,
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                    }}
                  >
                    {stat.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-jetbrains)",
                      fontSize: 9,
                      color: `${C.teal}60`,
                      marginTop: 4,
                    }}
                  >
                    {units[i]}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ delay: 1.5, duration: 1 }}
            style={{
              position: "absolute",
              bottom: 32,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: 10,
                color: C.muted,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              Explore Organelles
            </span>
            <div
              style={{
                width: 1,
                height: 32,
                background: `linear-gradient(to bottom, ${C.teal}50, transparent)`,
              }}
            />
          </motion.div>
        </div>

        {/* Bilayer divider */}
        <PhospholipidDivider />

        {/* ═══════════════════════════════════════════════════════ */}
        {/*  PROJECTS                                               */}
        {/* ═══════════════════════════════════════════════════════ */}
        <Section id="projects">
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
            {/* Section header */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              style={{ textAlign: "center", marginBottom: 64 }}
            >
              <div
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  fontSize: 11,
                  color: C.teal,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                Organelle Catalog
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-space-grotesk)",
                  fontSize: "clamp(28px, 5vw, 48px)",
                  fontWeight: 600,
                  color: C.cytoplasm,
                  lineHeight: 1.15,
                }}
              >
                Cellular Components
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-sora)",
                  fontSize: 14,
                  color: C.muted,
                  marginTop: 12,
                  maxWidth: 460,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                Each project is an organelle — specialized, essential, working in concert
              </p>
            </motion.div>

            {/* Project grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                gap: 32,
              }}
            >
              {projects.map((project, i) => {
                const oc = organelleColors[i % organelleColors.length];
                const shape = organelleShapes[i % organelleShapes.length];
                return (
                  <ProjectCard
                    key={project.title}
                    project={project}
                    index={i}
                    colors={oc}
                    shape={shape}
                  />
                );
              })}
            </div>
          </div>
        </Section>

        {/* Bilayer divider flipped */}
        <PhospholipidDivider flip />

        {/* ═══════════════════════════════════════════════════════ */}
        {/*  EXPERTISE                                              */}
        {/* ═══════════════════════════════════════════════════════ */}
        <Section id="expertise">
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              style={{ textAlign: "center", marginBottom: 56 }}
            >
              <div
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  fontSize: 11,
                  color: C.pink,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                Specialized Organelles
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-space-grotesk)",
                  fontSize: "clamp(28px, 5vw, 44px)",
                  fontWeight: 600,
                  color: C.cytoplasm,
                  lineHeight: 1.15,
                }}
              >
                Core Capabilities
              </h2>
            </motion.div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: 28,
              }}
            >
              {expertise.map((exp, i) => (
                <ExpertiseCard key={exp.title} item={exp} index={i} />
              ))}
            </div>
          </div>
        </Section>

        {/* Bilayer divider */}
        <PhospholipidDivider />

        {/* ═══════════════════════════════════════════════════════ */}
        {/*  TOOLS                                                  */}
        {/* ═══════════════════════════════════════════════════════ */}
        <Section id="tools">
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              style={{ textAlign: "center", marginBottom: 56 }}
            >
              <div
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  fontSize: 11,
                  color: C.blue,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                Ion Channel Selector
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-space-grotesk)",
                  fontSize: "clamp(28px, 5vw, 44px)",
                  fontWeight: 600,
                  color: C.cytoplasm,
                  lineHeight: 1.15,
                }}
              >
                Molecular Toolkit
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-sora)",
                  fontSize: 14,
                  color: C.muted,
                  marginTop: 12,
                  maxWidth: 400,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                Molecules passing through membrane channels, powering cellular function
              </p>
            </motion.div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: 24,
              }}
            >
              {tools.map((toolGroup, gi) => (
                <ToolCard key={toolGroup.label} group={toolGroup} index={gi} color={toolColors[gi]} />
              ))}
            </div>
          </div>
        </Section>

        {/* Bilayer divider flipped */}
        <PhospholipidDivider flip />

        {/* ═══════════════════════════════════════════════════════ */}
        {/*  FOOTER                                                 */}
        {/* ═══════════════════════════════════════════════════════ */}
        <footer
          style={{
            position: "relative",
            padding: "80px 24px 48px",
            textAlign: "center",
            zIndex: 1,
          }}
        >
          {/* Background gradient */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(ellipse at 50% 100%, ${C.teal}08, transparent 60%)`,
              pointerEvents: "none",
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ position: "relative", zIndex: 1 }}
          >
            {/* Mitosis animation */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
              <MitosisAnimation />
            </div>

            <h3
              style={{
                fontFamily: "var(--font-space-grotesk)",
                fontSize: "clamp(24px, 4vw, 40px)",
                fontWeight: 700,
                letterSpacing: "0.06em",
                color: C.cytoplasm,
                marginBottom: 12,
              }}
            >
              {"CELL DIVISION COMPLETE".split("").map((char, i) => (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    textShadow: char !== " " ? `0 0 20px ${C.teal}30` : "none",
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </h3>

            <p
              style={{
                fontFamily: "var(--font-sora)",
                fontSize: 14,
                color: C.muted,
                marginBottom: 24,
                maxWidth: 400,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              Two daughter cells emerge. The organism grows.
            </p>

            {/* Decorative DNA double helix divider */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
              <svg viewBox="0 0 200 30" fill="none" style={{ width: 200, height: 30 }}>
                <path
                  d="M10 15 Q30 2 50 15 T90 15 T130 15 T170 15 T190 15"
                  stroke={C.teal}
                  strokeWidth={1.2}
                  opacity={0.3}
                  fill="none"
                />
                <path
                  d="M10 15 Q30 28 50 15 T90 15 T130 15 T170 15 T190 15"
                  stroke={C.pink}
                  strokeWidth={1.2}
                  opacity={0.3}
                  fill="none"
                />
                {[30, 50, 70, 90, 110, 130, 150, 170].map((x, i) => (
                  <line
                    key={i}
                    x1={x}
                    y1={8 + (i % 2) * 4}
                    x2={x}
                    y2={18 - (i % 2) * 4}
                    stroke={C.purple}
                    strokeWidth={0.8}
                    opacity={0.2}
                  />
                ))}
              </svg>
            </div>

            {/* Footer links */}
            <div
              style={{
                display: "flex",
                gap: 32,
                justifyContent: "center",
                flexWrap: "wrap",
                marginBottom: 32,
              }}
            >
              {["GitHub", "Email", "LinkedIn"].map((label) => (
                <span
                  key={label}
                  style={{
                    fontFamily: "var(--font-jetbrains)",
                    fontSize: 12,
                    color: C.muted,
                    letterSpacing: "0.08em",
                    cursor: "pointer",
                    transition: "color 0.3s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = C.teal)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
                >
                  {label}
                </span>
              ))}
            </div>

            {/* Bio lab attribution */}
            <div
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: 10,
                color: `${C.muted}80`,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              <span style={{ color: C.teal, opacity: 0.5 }}>⬭</span>
              {" "}Bio Lab /// Membrane Interface v1.0
            </div>

            {/* Floating cell decoration */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 12,
                marginTop: 24,
                opacity: 0.2,
              }}
            >
              {Array.from({ length: 7 }, (_, i) => (
                <div
                  key={i}
                  style={{
                    width: 6 + i * 2,
                    height: 6 + i * 2,
                    borderRadius: "50%",
                    border: `1px solid ${C.teal}`,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </footer>

        {/* Theme Switcher */}
        <ThemeSwitcher current="/membrane" variant="dark" />
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  PROJECT CARD                                                      */
/* ═══════════════════════════════════════════════════════════════════ */
function ProjectCard({
  project,
  index,
  colors,
  shape,
}: {
  project: (typeof projects)[number];
  index: number;
  colors: { border: string; bg: string; glow: string };
  shape: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.7,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        borderRadius: shape,
        background: hovered ? colors.bg : C.bgCard,
        border: `1px solid ${hovered ? colors.border + "40" : C.border}`,
        padding: "32px 28px 28px",
        cursor: "pointer",
        transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        overflow: "hidden",
        boxShadow: hovered ? `0 0 40px ${colors.glow}, inset 0 0 30px ${colors.bg}` : "none",
      }}
    >
      {/* Background organelle pattern */}
      <div
        style={{
          position: "absolute",
          top: -20,
          right: -20,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.border}08, transparent 70%)`,
          transition: "opacity 0.4s",
          opacity: hovered ? 0.6 : 0.2,
        }}
      />

      {/* Protein channel marker */}
      <div
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          width: 28,
          height: 28,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `${colors.border}10`,
          border: `1px solid ${colors.border}25`,
          transition: "all 0.3s",
          transform: hovered ? "scale(1.1)" : "scale(1)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-jetbrains)",
            fontSize: 10,
            color: colors.border,
            opacity: 0.7,
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Category badge */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 14,
        }}
      >
        {/* Mini vesicle icon */}
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: `radial-gradient(circle at 30% 30%, ${colors.border}, ${colors.border}40)`,
            boxShadow: `0 0 6px ${colors.border}40`,
          }}
          className="organelle-pulse"
        />
        <span
          style={{
            fontFamily: "var(--font-jetbrains)",
            fontSize: 10,
            color: colors.border,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          {project.client}
        </span>
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: "var(--font-space-grotesk)",
          fontSize: 20,
          fontWeight: 600,
          color: C.cytoplasm,
          lineHeight: 1.3,
          marginBottom: 10,
          whiteSpace: "pre-line",
          transition: "color 0.3s",
        }}
      >
        {project.title}
      </h3>

      {/* Year */}
      <div
        style={{
          fontFamily: "var(--font-jetbrains)",
          fontSize: 10,
          color: C.muted,
          marginBottom: 12,
          letterSpacing: "0.1em",
        }}
      >
        {project.year} /// {project.tech.length} molecules
      </div>

      {/* Description */}
      <p
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: 13,
          color: C.text,
          lineHeight: 1.65,
          marginBottom: 16,
          opacity: 0.8,
        }}
      >
        {project.description}
      </p>

      {/* Technical detail */}
      <p
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: 12,
          color: C.muted,
          lineHeight: 1.6,
          marginBottom: 18,
          opacity: 0.65,
          borderLeft: `2px solid ${colors.border}25`,
          paddingLeft: 12,
        }}
      >
        {project.technical}
      </p>

      {/* Tech tags as molecules */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {project.tech.map((t, ti) => (
          <span
            key={t}
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: 10,
              color: colors.border,
              padding: "4px 10px",
              borderRadius: "12px",
              background: `${colors.border}0A`,
              border: `1px solid ${colors.border}18`,
              letterSpacing: "0.04em",
              transition: "all 0.3s",
              animationDelay: `${ti * 0.2}s`,
            }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* GitHub link */}
      <Link
        href={project.github}
        target="_blank"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontFamily: "var(--font-jetbrains)",
          fontSize: 11,
          color: hovered ? colors.border : C.muted,
          textDecoration: "none",
          transition: "color 0.3s",
          letterSpacing: "0.06em",
        }}
      >
        <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor" opacity={0.7}>
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
        Source
      </Link>

      {/* Bottom membrane line */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "10%",
          right: "10%",
          height: 2,
          background: `linear-gradient(90deg, transparent, ${colors.border}${hovered ? "40" : "15"}, transparent)`,
          transition: "all 0.4s",
          borderRadius: 1,
        }}
      />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  EXPERTISE CARD                                                    */
/* ═══════════════════════════════════════════════════════════════════ */
function ExpertiseCard({
  item,
  index,
}: {
  item: (typeof expertise)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [hovered, setHovered] = useState(false);
  const org = expertiseOrganelles[index];
  const SVGComponent = expertiseSVGs[index];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        background: C.bgCard,
        borderRadius: "24px 24px 32px 24px",
        border: `1px solid ${hovered ? org.color + "30" : C.border}`,
        padding: "28px 24px 24px",
        overflow: "hidden",
        transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        cursor: "default",
        boxShadow: hovered ? `0 0 30px ${org.color}15` : "none",
      }}
    >
      {/* Background radial */}
      <div
        style={{
          position: "absolute",
          top: -30,
          right: -30,
          width: 140,
          height: 140,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${org.color}06, transparent 70%)`,
          opacity: hovered ? 1 : 0.4,
          transition: "opacity 0.4s",
        }}
      />

      {/* Organelle SVG */}
      <div
        style={{
          marginBottom: 18,
          opacity: hovered ? 1 : 0.7,
          transition: "opacity 0.3s",
          position: "relative",
          zIndex: 1,
        }}
        className="organelle-pulse"
      >
        <SVGComponent color={org.color} accent={org.accent} />
      </div>

      {/* Organelle name tag */}
      <div
        style={{
          fontFamily: "var(--font-jetbrains)",
          fontSize: 9,
          color: org.color,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          marginBottom: 8,
          opacity: 0.6,
          position: "relative",
          zIndex: 1,
        }}
      >
        {org.name}
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: "var(--font-space-grotesk)",
          fontSize: 18,
          fontWeight: 600,
          color: C.cytoplasm,
          marginBottom: 10,
          lineHeight: 1.3,
          position: "relative",
          zIndex: 1,
        }}
      >
        {item.title}
      </h3>

      {/* Body */}
      <p
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: 13,
          color: C.text,
          lineHeight: 1.65,
          opacity: 0.75,
          position: "relative",
          zIndex: 1,
        }}
      >
        {item.body}
      </p>

      {/* Bottom membrane accent */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, transparent, ${org.color}${hovered ? "35" : "10"}, transparent)`,
          transition: "all 0.4s",
        }}
      />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  TOOL CARD                                                         */
/* ═══════════════════════════════════════════════════════════════════ */
function ToolCard({
  group,
  index,
  color,
}: {
  group: (typeof tools)[number];
  index: number;
  color: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        background: C.bgCard,
        borderRadius: "20px",
        border: `1px solid ${hovered ? color + "30" : C.border}`,
        padding: "24px 22px 20px",
        overflow: "hidden",
        transition: "all 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
        boxShadow: hovered ? `0 0 25px ${color}12` : "none",
      }}
    >
      {/* Channel SVG decoration */}
      <div
        style={{
          position: "absolute",
          top: 14,
          right: 14,
          opacity: hovered ? 0.8 : 0.3,
          transition: "opacity 0.3s",
        }}
      >
        <IonChannel color={color} index={index} />
      </div>

      {/* Label */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: `radial-gradient(circle at 35% 35%, ${color}, ${color}50)`,
            boxShadow: `0 0 8px ${color}30`,
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-space-grotesk)",
            fontSize: 15,
            fontWeight: 600,
            color: C.cytoplasm,
            letterSpacing: "0.02em",
          }}
        >
          {group.label}
        </span>
        <span
          style={{
            fontFamily: "var(--font-jetbrains)",
            fontSize: 9,
            color: C.muted,
            marginLeft: "auto",
            marginRight: 48,
            letterSpacing: "0.1em",
          }}
        >
          {group.items.length} molecules
        </span>
      </div>

      {/* Items as ions */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {group.items.map((item, ii) => (
          <motion.span
            key={item}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: index * 0.08 + ii * 0.06, duration: 0.4 }}
            className="ion-pass"
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: 11,
              color: hovered ? color : C.text,
              padding: "5px 12px",
              borderRadius: "16px",
              background: `${color}08`,
              border: `1px solid ${color}15`,
              transition: "all 0.3s",
              animationDelay: `${ii * 0.3}s`,
              letterSpacing: "0.02em",
            }}
          >
            {item}
          </motion.span>
        ))}
      </div>

      {/* Bottom membrane */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "5%",
          right: "5%",
          height: 2,
          background: `linear-gradient(90deg, transparent, ${color}${hovered ? "30" : "10"}, transparent)`,
          transition: "all 0.4s",
          borderRadius: 1,
        }}
      />
    </motion.div>
  );
}
