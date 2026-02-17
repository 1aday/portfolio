"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import Link from "next/link";
import { projects, stats, expertise, tools } from "@/app/data/projects";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";

/* ═══════════════════════════════════════════════════════════════════ */
/*  COLORS — Genetic Expression Lab                                   */
/* ═══════════════════════════════════════════════════════════════════ */
const C = {
  bg: "#0A1A14",
  bgCard: "#0D2219",
  bgCardAlt: "#0F2A1F",
  green: "#00CC88",
  greenDim: "rgba(0,204,136,0.15)",
  greenGlow: "rgba(0,204,136,0.3)",
  greenBright: "rgba(0,204,136,0.6)",
  blue: "#4A90D9",
  yellow: "#F5C542",
  red: "#E53935",
  purple: "#9C27B0",
  white: "#FFFFFF",
  text: "#C8E0D6",
  muted: "#5A7D6E",
  border: "rgba(0,204,136,0.12)",
  borderBright: "rgba(0,204,136,0.25)",
};

/* DNA base colors: A=adenine(red), T=thymine(purple), C=cytosine(yellow), G=guanine(green) */
const BASE_COLORS: Record<string, string> = {
  A: C.red,
  T: C.purple,
  C: C.yellow,
  G: C.green,
};

const BASES = ["A", "T", "C", "G"] as const;

/* ═══════════════════════════════════════════════════════════════════ */
/*  DNA SEQUENCE GENERATOR                                            */
/* ═══════════════════════════════════════════════════════════════════ */
function generateSequence(length: number, seed: number): string[] {
  const seq: string[] = [];
  let s = seed;
  for (let i = 0; i < length; i++) {
    s = Math.sin(s * 127.1 + i * 311.7) * 43758.5453;
    s = s - Math.floor(s);
    seq.push(BASES[Math.floor(s * 4)]);
  }
  return seq;
}

/* Complementary base pair */
function complement(base: string): string {
  const map: Record<string, string> = { A: "T", T: "A", C: "G", G: "C" };
  return map[base] || "A";
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  GEL ELECTROPHORESIS BAND GENERATOR                                */
/* ═══════════════════════════════════════════════════════════════════ */
function generateGelBands(
  count: number,
  seed: number
): { y: number; height: number; opacity: number; color: string }[] {
  const bands: { y: number; height: number; opacity: number; color: string }[] = [];
  let s = seed;
  const rng = () => {
    s = Math.sin(s * 127.1 + 311.7) * 43758.5453;
    s = s - Math.floor(s);
    return s;
  };
  let currentY = 4;
  for (let i = 0; i < count; i++) {
    const gap = 3 + rng() * 10;
    currentY += gap;
    const h = 2 + rng() * 5;
    const baseIdx = Math.floor(rng() * 4);
    bands.push({
      y: currentY,
      height: h,
      opacity: 0.4 + rng() * 0.5,
      color: [C.green, C.blue, C.yellow, C.red][baseIdx],
    });
    currentY += h;
  }
  return bands;
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  DNA DOUBLE HELIX SVG                                              */
/* ═══════════════════════════════════════════════════════════════════ */
function DNAHelix({
  height = 800,
  width = 60,
  className = "",
  animate = true,
}: {
  height?: number;
  width?: number;
  className?: string;
  animate?: boolean;
}) {
  const steps = Math.floor(height / 8);
  const cx = width / 2;
  const amplitude = width * 0.35;
  const seq = generateSequence(steps, 42);

  let path1 = "";
  let path2 = "";
  const rungs: { x1: number; y1: number; x2: number; y2: number; base: string; idx: number }[] =
    [];

  for (let i = 0; i <= steps; i++) {
    const y = (i / steps) * height;
    const phase = (i / steps) * Math.PI * 6;
    const x1 = cx + Math.sin(phase) * amplitude;
    const x2 = cx + Math.sin(phase + Math.PI) * amplitude;

    if (i === 0) {
      path1 += `M ${x1.toFixed(1)} ${y.toFixed(1)}`;
      path2 += `M ${x2.toFixed(1)} ${y.toFixed(1)}`;
    } else {
      path1 += ` L ${x1.toFixed(1)} ${y.toFixed(1)}`;
      path2 += ` L ${x2.toFixed(1)} ${y.toFixed(1)}`;
    }

    if (i % 4 === 0 && i > 0 && i < steps) {
      const baseIdx = Math.floor(i / 4) % seq.length;
      rungs.push({ x1, y1: y, x2, y2: y, base: seq[baseIdx], idx: i });
    }
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id="helixGrad1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.green} stopOpacity="0.8" />
          <stop offset="50%" stopColor={C.blue} stopOpacity="0.6" />
          <stop offset="100%" stopColor={C.green} stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="helixGrad2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.purple} stopOpacity="0.6" />
          <stop offset="50%" stopColor={C.red} stopOpacity="0.5" />
          <stop offset="100%" stopColor={C.purple} stopOpacity="0.15" />
        </linearGradient>
        <filter id="helixGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Backbone strands */}
      <path
        d={path1}
        fill="none"
        stroke="url(#helixGrad1)"
        strokeWidth="2"
        filter="url(#helixGlow)"
        className={animate ? "helix-strand-1" : ""}
      />
      <path
        d={path2}
        fill="none"
        stroke="url(#helixGrad2)"
        strokeWidth="2"
        filter="url(#helixGlow)"
        className={animate ? "helix-strand-2" : ""}
      />

      {/* Base pair rungs */}
      {rungs.map((r, i) => (
        <g key={i}>
          <line
            x1={r.x1}
            y1={r.y1}
            x2={r.x2}
            y2={r.y2}
            stroke={BASE_COLORS[r.base]}
            strokeWidth="1.5"
            opacity="0.5"
            className={animate ? "base-pair-rung" : ""}
            style={{ animationDelay: `${i * 0.15}s` }}
          />
          {/* Base letter at midpoint */}
          <text
            x={(r.x1 + r.x2) / 2}
            y={r.y1 - 3}
            fill={BASE_COLORS[r.base]}
            fontSize="6"
            fontFamily="var(--font-jetbrains)"
            textAnchor="middle"
            opacity="0.7"
          >
            {r.base}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  GEL ELECTROPHORESIS SVG                                           */
/* ═══════════════════════════════════════════════════════════════════ */
function GelLane({
  width = 100,
  height = 80,
  seed = 1,
  bandCount = 6,
}: {
  width?: number;
  height?: number;
  seed?: number;
  bandCount?: number;
}) {
  const bands = generateGelBands(bandCount, seed);
  const maxY = bands.length > 0 ? bands[bands.length - 1].y + bands[bands.length - 1].height : 80;
  const scale = height / Math.max(maxY + 4, 80);

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <rect width={width} height={height} fill="rgba(0,204,136,0.03)" rx="2" />
      {bands.map((band, i) => (
        <motion.rect
          key={i}
          x={width * 0.1}
          y={band.y * scale}
          width={width * 0.8}
          height={band.height * scale}
          fill={band.color}
          opacity={0}
          rx="1"
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: band.opacity, scaleX: 1 }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
          viewport={{ once: true }}
          style={{ originX: "50%" }}
        />
      ))}
      {/* Well at top */}
      <rect
        x={width * 0.25}
        y={0}
        width={width * 0.5}
        height={3}
        fill={C.green}
        opacity={0.5}
        rx="1"
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  SEQUENCE STRIP DECORATION                                         */
/* ═══════════════════════════════════════════════════════════════════ */
function SequenceStrip({ length = 60, seed = 7 }: { length?: number; seed?: number }) {
  const seq = generateSequence(length, seed);
  return (
    <div
      style={{
        display: "flex",
        gap: "1px",
        fontFamily: "var(--font-jetbrains)",
        fontSize: "9px",
        letterSpacing: "1px",
        overflow: "hidden",
      }}
    >
      {seq.map((base, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.6 }}
          transition={{ delay: i * 0.01, duration: 0.3 }}
          viewport={{ once: true }}
          style={{ color: BASE_COLORS[base] }}
        >
          {base}
        </motion.span>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  PUNNETT SQUARE SVG                                                */
/* ═══════════════════════════════════════════════════════════════════ */
function PunnettSquare({ size = 120 }: { size?: number }) {
  const half = size / 2;
  const labels = ["A", "a"];
  const combos = [
    ["AA", "Aa"],
    ["Aa", "aa"],
  ];
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Grid lines */}
      <line x1={0} y1={half} x2={size} y2={half} stroke={C.green} strokeWidth="1" opacity="0.3" />
      <line x1={half} y1={0} x2={half} y2={size} stroke={C.green} strokeWidth="1" opacity="0.3" />
      <rect
        x={0}
        y={0}
        width={size}
        height={size}
        fill="none"
        stroke={C.green}
        strokeWidth="1"
        opacity="0.2"
        rx="4"
      />
      {/* Cell contents */}
      {combos.map((row, r) =>
        row.map((cell, c) => (
          <text
            key={`${r}-${c}`}
            x={c * half + half / 2}
            y={r * half + half / 2 + 5}
            textAnchor="middle"
            fill={cell === "AA" ? C.green : cell === "aa" ? C.muted : C.blue}
            fontSize="14"
            fontFamily="var(--font-jetbrains)"
            fontWeight={cell === "AA" ? 700 : 400}
            opacity={0.8}
          >
            {cell}
          </text>
        ))
      )}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  CHROMOSOME SVG                                                    */
/* ═══════════════════════════════════════════════════════════════════ */
function Chromosome({
  size = 40,
  color = C.green,
  rotation = 0,
}: {
  size?: number;
  color?: string;
  rotation?: number;
}) {
  const h = size;
  const w = size * 0.35;
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* Top arm */}
      <path
        d={`M ${w * 0.5} ${h * 0.45} C ${w * 0.1} ${h * 0.35}, ${w * 0.1} ${h * 0.1}, ${w * 0.3} ${h * 0.02} C ${w * 0.5} ${h * -0.02}, ${w * 0.7} ${h * 0.02}, ${w * 0.7} ${h * 0.02} C ${w * 0.9} ${h * 0.1}, ${w * 0.9} ${h * 0.35}, ${w * 0.5} ${h * 0.45}`}
        fill={color}
        opacity="0.5"
      />
      {/* Bottom arm */}
      <path
        d={`M ${w * 0.5} ${h * 0.55} C ${w * 0.1} ${h * 0.65}, ${w * 0.05} ${h * 0.85}, ${w * 0.25} ${h * 0.98} C ${w * 0.4} ${h * 1.02}, ${w * 0.6} ${h * 1.02}, ${w * 0.75} ${h * 0.98} C ${w * 0.95} ${h * 0.85}, ${w * 0.9} ${h * 0.65}, ${w * 0.5} ${h * 0.55}`}
        fill={color}
        opacity="0.5"
      />
      {/* Centromere */}
      <ellipse cx={w * 0.5} cy={h * 0.5} rx={w * 0.18} ry={h * 0.04} fill={color} opacity="0.8" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  MICROSCOPE SVG                                                    */
/* ═══════════════════════════════════════════════════════════════════ */
function MicroscopeSVG({ size = 48, color = C.green }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Base */}
      <rect x="10" y="42" width="28" height="3" rx="1.5" fill={color} opacity="0.6" />
      {/* Stage */}
      <rect x="14" y="34" width="20" height="2" rx="1" fill={color} opacity="0.4" />
      {/* Arm */}
      <path d="M30 34 L30 14 C30 12 28 10 26 10" stroke={color} strokeWidth="2.5" fill="none" opacity="0.5" />
      {/* Pillar */}
      <rect x="28" y="34" width="4" height="8" fill={color} opacity="0.4" />
      {/* Eyepiece */}
      <rect x="22" y="6" width="8" height="5" rx="2" fill={color} opacity="0.6" />
      <rect x="24" y="4" width="4" height="3" rx="1" fill={color} opacity="0.8" />
      {/* Objective */}
      <rect x="18" y="30" width="4" height="5" rx="1" fill={color} opacity="0.5" />
      {/* Focus knob */}
      <circle cx="34" cy="24" r="3" fill={color} opacity="0.4" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  LAB EQUIPMENT ICONS                                               */
/* ═══════════════════════════════════════════════════════════════════ */
function PipetteSVG({ size = 40, color = C.blue }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect x="18" y="2" width="4" height="8" rx="2" fill={color} opacity="0.5" />
      <path d="M16 10 L24 10 L22 32 L18 32 Z" fill={color} opacity="0.4" />
      <path d="M18 32 L20 38 L22 32" fill={color} opacity="0.6" />
      <rect x="15" y="14" width="10" height="1.5" rx="0.5" fill={color} opacity="0.3" />
      <rect x="15" y="18" width="10" height="1.5" rx="0.5" fill={color} opacity="0.3" />
    </svg>
  );
}

function CentrifugeSVG({ size = 44, color = C.yellow }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <circle cx="22" cy="22" r="16" stroke={color} strokeWidth="1.5" opacity="0.3" fill="none" />
      <circle cx="22" cy="22" r="4" fill={color} opacity="0.5" />
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = 22 + Math.cos(rad) * 12;
        const y = 22 + Math.sin(rad) * 12;
        return (
          <g key={i}>
            <line x1={22} y1={22} x2={x} y2={y} stroke={color} strokeWidth="1" opacity="0.3" />
            <circle cx={x} cy={y} r="2.5" fill={color} opacity="0.5" />
          </g>
        );
      })}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  ANIMATED SECTION WRAPPER                                          */
/* ═══════════════════════════════════════════════════════════════════ */
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
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.section>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  LAB LABEL COMPONENT                                               */
/* ═══════════════════════════════════════════════════════════════════ */
function LabLabel({ text, code }: { text: string; code?: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "12px",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-jetbrains)",
          fontSize: "10px",
          color: C.green,
          letterSpacing: "3px",
          textTransform: "uppercase",
          opacity: 0.7,
        }}
      >
        {text}
      </span>
      {code && (
        <span
          style={{
            fontFamily: "var(--font-jetbrains)",
            fontSize: "9px",
            color: C.muted,
            padding: "2px 8px",
            border: `1px solid ${C.border}`,
            borderRadius: "2px",
          }}
        >
          {code}
        </span>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  TECH TAG WITH DNA COLOR CODING                                    */
/* ═══════════════════════════════════════════════════════════════════ */
function TechTag({ label, index }: { label: string; index: number }) {
  const baseIndex = index % 4;
  const base = BASES[baseIndex];
  const color = BASE_COLORS[base];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "3px 10px",
        fontSize: "11px",
        fontFamily: "var(--font-jetbrains)",
        color,
        background: `${color}11`,
        border: `1px solid ${color}33`,
        borderRadius: "3px",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ fontSize: "8px", opacity: 0.6 }}>{base}</span>
      {label}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  MAIN PAGE COMPONENT                                               */
/* ═══════════════════════════════════════════════════════════════════ */
export default function PhenotypePage() {
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true });

  useEffect(() => {
    setMounted(true);
  }, []);

  /* Accession number for footer */
  const accession = "GX-" + new Date().getFullYear() + "-" + "0088" + "PH";

  /* Lab report number */
  const labReport =
    "LAB-" +
    String(new Date().getMonth() + 1).padStart(2, "0") +
    String(new Date().getDate()).padStart(2, "0") +
    "-" +
    String(projects.length).padStart(3, "0");

  return (
    <>
      <style>{`
        /* ── Scrollbar ── */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.green}33; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: ${C.green}66; }

        /* ── DNA Helix rotation ── */
        @keyframes helixRotate {
          0% { transform: translateY(0); }
          100% { transform: translateY(-40px); }
        }
        .helix-strand-1 {
          animation: helixRotate 8s ease-in-out infinite alternate;
        }
        .helix-strand-2 {
          animation: helixRotate 8s ease-in-out infinite alternate-reverse;
        }

        /* ── Base pair pulse ── */
        @keyframes basePairPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        .base-pair-rung {
          animation: basePairPulse 3s ease-in-out infinite;
        }

        /* ── Gel band slide ── */
        @keyframes gelSlide {
          from { transform: scaleX(0); opacity: 0; }
          to { transform: scaleX(1); opacity: 1; }
        }

        /* ── Sequence flash ── */
        @keyframes sequenceFlash {
          0%, 90%, 100% { opacity: 0.5; }
          95% { opacity: 1; filter: brightness(1.5); }
        }
        .seq-flash {
          animation: sequenceFlash 4s ease-in-out infinite;
        }

        /* ── Lab card hover ── */
        @keyframes labPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0,204,136,0); }
          50% { box-shadow: 0 0 20px 2px rgba(0,204,136,0.1); }
        }

        /* ── Spin for centrifuge ── */
        @keyframes centrifugeSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* ── Expression bar fill ── */
        @keyframes expressionFill {
          from { width: 0%; }
          to { width: var(--target-width); }
        }

        /* ── Chromosome float ── */
        @keyframes chromosomeFloat {
          0%, 100% { transform: translateY(0) rotate(var(--chr-rot, 0deg)); }
          50% { transform: translateY(-8px) rotate(var(--chr-rot, 0deg)); }
        }

        /* ── Grid scan line ── */
        @keyframes gridScan {
          0% { top: 0%; }
          100% { top: 100%; }
        }

        /* ── Nucleotide glow ── */
        @keyframes nucleotideGlow {
          0%, 100% { text-shadow: 0 0 4px currentColor; }
          50% { text-shadow: 0 0 12px currentColor, 0 0 20px currentColor; }
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
        {/* ── DNA Helix Edge Decoration (Left) ── */}
        <div
          style={{
            position: "fixed",
            left: "12px",
            top: 0,
            bottom: 0,
            zIndex: 5,
            pointerEvents: "none",
            opacity: mounted ? 0.6 : 0,
            transition: "opacity 1s ease",
          }}
        >
          <DNAHelix height={1200} width={48} animate={true} />
        </div>

        {/* ── DNA Helix Edge Decoration (Right) ── */}
        <div
          style={{
            position: "fixed",
            right: "12px",
            top: 0,
            bottom: 0,
            zIndex: 5,
            pointerEvents: "none",
            opacity: mounted ? 0.35 : 0,
            transition: "opacity 1.5s ease 0.3s",
          }}
        >
          <DNAHelix height={1200} width={40} animate={true} />
        </div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/*  HERO                                                      */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <section
          ref={heroRef}
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "80px 24px 60px",
            position: "relative",
            textAlign: "center",
          }}
        >
          {/* Background grid */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `
                linear-gradient(${C.green}08 1px, transparent 1px),
                linear-gradient(90deg, ${C.green}08 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
              pointerEvents: "none",
            }}
          />

          {/* Scanning line */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              height: "1px",
              background: `linear-gradient(90deg, transparent, ${C.green}40, transparent)`,
              animation: "gridScan 6s linear infinite",
              pointerEvents: "none",
            }}
          />

          {/* Lab notebook header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: "10px",
              letterSpacing: "4px",
              color: C.muted,
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            Laboratory Notebook — Experiment #{labReport}
          </motion.div>

          {/* ATCG decoration strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            style={{ marginBottom: "28px" }}
          >
            <SequenceStrip length={80} seed={42} />
          </motion.div>

          {/* Main title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={heroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: "relative", marginBottom: "20px" }}
          >
            {/* Decorative chromosomes */}
            <div
              style={{
                position: "absolute",
                top: "-30px",
                left: "-50px",
                opacity: 0.3,
              }}
            >
              <Chromosome size={50} color={C.green} rotation={-15} />
            </div>
            <div
              style={{
                position: "absolute",
                bottom: "-20px",
                right: "-40px",
                opacity: 0.25,
              }}
            >
              <Chromosome size={40} color={C.blue} rotation={25} />
            </div>

            <h1
              style={{
                fontFamily: "var(--font-space-grotesk)",
                fontSize: "clamp(56px, 10vw, 120px)",
                fontWeight: 800,
                color: C.white,
                letterSpacing: "-3px",
                lineHeight: 0.9,
                position: "relative",
              }}
            >
              <span style={{ color: C.green }}>P</span>
              <span>HENO</span>
              <span style={{ color: C.blue }}>T</span>
              <span>YPE</span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={heroInView ? { opacity: 0.7, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.7 }}
            style={{
              fontFamily: "var(--font-manrope)",
              fontSize: "15px",
              color: C.muted,
              letterSpacing: "6px",
              textTransform: "uppercase",
              marginBottom: "48px",
            }}
          >
            Genetic Expression Lab
          </motion.p>

          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, rotate: -90 }}
            animate={heroInView ? { opacity: 0.6, rotate: 0 } : {}}
            transition={{ duration: 1, delay: 0.9 }}
            style={{
              fontSize: "36px",
              color: C.green,
              marginBottom: "48px",
              filter: `drop-shadow(0 0 12px ${C.greenGlow})`,
            }}
          >
            ⧬
          </motion.div>

          {/* Stats as Gene Expression Levels */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 1.0 }}
            style={{
              display: "flex",
              gap: "40px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {stats.map((stat, i) => {
              const expressionPct = i === 0 ? 85 : i === 1 ? 72 : 60;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={heroInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 1.1 + i * 0.15 }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "6px",
                    minWidth: "140px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-jetbrains)",
                      fontSize: "8px",
                      color: C.muted,
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                    }}
                  >
                    Expression Level
                  </span>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-space-grotesk)",
                        fontSize: "32px",
                        fontWeight: 700,
                        color: C.green,
                      }}
                    >
                      {stat.value}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-inter)",
                        fontSize: "12px",
                        color: C.muted,
                      }}
                    >
                      {stat.label}
                    </span>
                  </div>
                  {/* Expression bar */}
                  <div
                    style={{
                      width: "100%",
                      height: "3px",
                      background: C.greenDim,
                      borderRadius: "2px",
                      overflow: "hidden",
                    }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={heroInView ? { width: `${expressionPct}%` } : {}}
                      transition={{ duration: 1.5, delay: 1.3 + i * 0.2, ease: "easeOut" }}
                      style={{
                        height: "100%",
                        background: `linear-gradient(90deg, ${C.green}, ${C.blue})`,
                        borderRadius: "2px",
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Bottom sequence decoration */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 1.5 }}
            style={{ marginTop: "60px" }}
          >
            <SequenceStrip length={100} seed={99} />
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/*  PROJECTS — Lab Reports                                    */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <Section id="projects" className="relative" delay={0}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "80px 24px" }}>
            <LabLabel text="Research Outputs" code="SEC:002" />

            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              style={{
                fontFamily: "var(--font-space-grotesk)",
                fontSize: "clamp(32px, 5vw, 48px)",
                fontWeight: 700,
                color: C.white,
                marginBottom: "8px",
                letterSpacing: "-1px",
              }}
            >
              Lab Reports
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.5 }}
              viewport={{ once: true }}
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: "11px",
                color: C.muted,
                marginBottom: "48px",
                letterSpacing: "1px",
              }}
            >
              {projects.length} specimens catalogued — ordered by expression date
            </motion.p>

            {/* Projects Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                gap: "24px",
              }}
            >
              {projects.map((project, i) => {
                const gelSeed = (i + 1) * 17;
                const sampleId = `SP-${String(i + 1).padStart(3, "0")}`;
                const seq = generateSequence(12, i * 7);

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.6, delay: i * 0.06 }}
                    whileHover={{ y: -4, transition: { duration: 0.25 } }}
                    style={{
                      background: C.bgCard,
                      border: `1px solid ${C.border}`,
                      borderRadius: "6px",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    {/* Gel electrophoresis band header */}
                    <div
                      style={{
                        padding: "12px 16px",
                        borderBottom: `1px solid ${C.border}`,
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        background: `${C.bg}`,
                      }}
                    >
                      <GelLane width={80} height={50} seed={gelSeed} bandCount={5 + (i % 4)} />
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "4px",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "var(--font-jetbrains)",
                              fontSize: "9px",
                              color: C.green,
                              letterSpacing: "2px",
                            }}
                          >
                            {sampleId}
                          </span>
                          <span
                            style={{
                              fontFamily: "var(--font-jetbrains)",
                              fontSize: "9px",
                              color: C.muted,
                            }}
                          >
                            {project.year}
                          </span>
                        </div>
                        {/* Mini sequence */}
                        <div
                          style={{
                            display: "flex",
                            gap: "2px",
                            fontFamily: "var(--font-jetbrains)",
                            fontSize: "8px",
                          }}
                        >
                          {seq.map((base, j) => (
                            <span key={j} style={{ color: BASE_COLORS[base], opacity: 0.6 }}>
                              {base}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card body */}
                    <div style={{ padding: "20px" }}>
                      {/* Client label */}
                      <span
                        style={{
                          fontFamily: "var(--font-jetbrains)",
                          fontSize: "9px",
                          color: C.green,
                          letterSpacing: "2px",
                          textTransform: "uppercase",
                          opacity: 0.7,
                        }}
                      >
                        {project.client}
                      </span>

                      {/* Title */}
                      <h3
                        style={{
                          fontFamily: "var(--font-space-grotesk)",
                          fontSize: "20px",
                          fontWeight: 700,
                          color: C.white,
                          lineHeight: 1.2,
                          margin: "8px 0 12px",
                          whiteSpace: "pre-line",
                        }}
                      >
                        {project.title}
                      </h3>

                      {/* Description */}
                      <p
                        style={{
                          fontFamily: "var(--font-inter)",
                          fontSize: "13px",
                          lineHeight: 1.6,
                          color: C.text,
                          opacity: 0.75,
                          marginBottom: "12px",
                        }}
                      >
                        {project.description}
                      </p>

                      {/* Technical detail */}
                      <p
                        style={{
                          fontFamily: "var(--font-inter)",
                          fontSize: "12px",
                          lineHeight: 1.5,
                          color: C.muted,
                          marginBottom: "16px",
                          borderLeft: `2px solid ${C.greenDim}`,
                          paddingLeft: "10px",
                        }}
                      >
                        {project.technical}
                      </p>

                      {/* Tech tags with DNA base coding */}
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "6px",
                          marginBottom: "16px",
                        }}
                      >
                        {project.tech.map((t, j) => (
                          <TechTag key={j} label={t} index={j + i} />
                        ))}
                      </div>

                      {/* Footer with link */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingTop: "12px",
                          borderTop: `1px solid ${C.border}`,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--font-jetbrains)",
                            fontSize: "9px",
                            color: C.muted,
                          }}
                        >
                          GenBank: {sampleId}-{project.year}
                        </span>
                        <Link
                          href={project.github}
                          target="_blank"
                          style={{
                            fontFamily: "var(--font-jetbrains)",
                            fontSize: "10px",
                            color: C.green,
                            textDecoration: "none",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            opacity: 0.8,
                            transition: "opacity 0.2s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.8")}
                        >
                          View Source
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path
                              d="M3 9L9 3M9 3H4M9 3V8"
                              stroke={C.green}
                              strokeWidth="1.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </Link>
                      </div>
                    </div>

                    {/* Hover glow border */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "6px",
                        border: `1px solid transparent`,
                        pointerEvents: "none",
                        transition: "border-color 0.3s",
                      }}
                      className="lab-card-glow"
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/*  EXPERTISE — Punnett Square Cards                          */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <Section id="expertise" delay={0}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "80px 24px" }}>
            <LabLabel text="Dominant Traits" code="SEC:003" />

            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              style={{
                fontFamily: "var(--font-space-grotesk)",
                fontSize: "clamp(32px, 5vw, 48px)",
                fontWeight: 700,
                color: C.white,
                marginBottom: "8px",
                letterSpacing: "-1px",
              }}
            >
              Expertise Genotype
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.5 }}
              viewport={{ once: true }}
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: "11px",
                color: C.muted,
                marginBottom: "48px",
                letterSpacing: "1px",
              }}
            >
              Dominant alleles expressed — recessive traits masked
            </motion.p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "20px",
              }}
            >
              {expertise.map((exp, i) => {
                const traitColors = [C.green, C.blue, C.yellow, C.red];
                const traitColor = traitColors[i % traitColors.length];
                const alleles = ["AA", "Aa", "aA", "aa"];
                const dominance = ["Dominant", "Co-dominant", "Co-dominant", "Recessive"];

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30, rotateX: 10 }}
                    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: `0 8px 32px ${traitColor}20`,
                      transition: { duration: 0.25 },
                    }}
                    style={{
                      background: C.bgCard,
                      border: `1px solid ${C.border}`,
                      borderRadius: "6px",
                      padding: "24px",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* Top: Punnett square + trait label */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "20px",
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontFamily: "var(--font-jetbrains)",
                            fontSize: "9px",
                            color: traitColor,
                            letterSpacing: "2px",
                            textTransform: "uppercase",
                            opacity: 0.8,
                          }}
                        >
                          Locus {String.fromCharCode(65 + i)}
                        </span>
                        <div
                          style={{
                            fontFamily: "var(--font-jetbrains)",
                            fontSize: "10px",
                            color: C.muted,
                            marginTop: "2px",
                          }}
                        >
                          {dominance[i]} Expression
                        </div>
                      </div>
                      <PunnettSquare size={80} />
                    </div>

                    {/* Title */}
                    <h3
                      style={{
                        fontFamily: "var(--font-space-grotesk)",
                        fontSize: "20px",
                        fontWeight: 700,
                        color: C.white,
                        marginBottom: "12px",
                        lineHeight: 1.2,
                      }}
                    >
                      {exp.title}
                    </h3>

                    {/* Body */}
                    <p
                      style={{
                        fontFamily: "var(--font-inter)",
                        fontSize: "13px",
                        lineHeight: 1.65,
                        color: C.text,
                        opacity: 0.7,
                        marginBottom: "16px",
                      }}
                    >
                      {exp.body}
                    </p>

                    {/* Allele expression bar */}
                    <div
                      style={{
                        display: "flex",
                        gap: "4px",
                        alignItems: "center",
                      }}
                    >
                      {alleles.map((allele, a) => (
                        <div
                          key={a}
                          style={{
                            flex: 1,
                            height: "4px",
                            borderRadius: "2px",
                            background:
                              allele === "AA" || allele === "Aa" || allele === "aA"
                                ? traitColor
                                : C.muted,
                            opacity: allele === "AA" ? 0.9 : allele === "aa" ? 0.2 : 0.5,
                          }}
                        />
                      ))}
                    </div>

                    {/* Corner decoration: chromosome */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: "-8px",
                        right: "-4px",
                        opacity: 0.1,
                        animation: "chromosomeFloat 5s ease-in-out infinite",
                        animationDelay: `${i * 0.5}s`,
                      }}
                    >
                      <Chromosome size={60} color={traitColor} rotation={15 + i * 20} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/*  TOOLS — Lab Equipment Inventory                           */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <Section id="tools" delay={0}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "80px 24px" }}>
            <LabLabel text="Lab Equipment" code="SEC:004" />

            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              style={{
                fontFamily: "var(--font-space-grotesk)",
                fontSize: "clamp(32px, 5vw, 48px)",
                fontWeight: 700,
                color: C.white,
                marginBottom: "8px",
                letterSpacing: "-1px",
              }}
            >
              Equipment Inventory
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.5 }}
              viewport={{ once: true }}
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: "11px",
                color: C.muted,
                marginBottom: "48px",
                letterSpacing: "1px",
              }}
            >
              Calibrated instruments and reagents — {tools.reduce((a, t) => a + t.items.length, 0)}{" "}
              total items
            </motion.p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: "20px",
              }}
            >
              {tools.map((toolGroup, i) => {
                const icons = [
                  <MicroscopeSVG key="m" size={36} color={C.green} />,
                  <PipetteSVG key="p" size={36} color={C.blue} />,
                  <CentrifugeSVG key="c" size={36} color={C.yellow} />,
                  <MicroscopeSVG key="m2" size={36} color={C.red} />,
                  <PipetteSVG key="p2" size={36} color={C.purple} />,
                  <CentrifugeSVG key="c2" size={36} color={C.green} />,
                ];
                const equipmentLabels = [
                  "Sequencer Bay",
                  "Observation Deck",
                  "Processing Unit",
                  "Analysis Station",
                  "Storage Module",
                  "Deployment Chamber",
                ];
                const statusColors = [C.green, C.blue, C.yellow, C.red, C.purple, C.green];

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.08 }}
                    whileHover={{
                      y: -3,
                      transition: { duration: 0.25 },
                    }}
                    style={{
                      background: C.bgCard,
                      border: `1px solid ${C.border}`,
                      borderRadius: "6px",
                      overflow: "hidden",
                    }}
                  >
                    {/* Header with equipment icon */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        padding: "18px 20px",
                        borderBottom: `1px solid ${C.border}`,
                        background: `linear-gradient(135deg, ${C.bg}, ${C.bgCard})`,
                      }}
                    >
                      <div
                        style={{
                          width: "44px",
                          height: "44px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: `${statusColors[i]}10`,
                          borderRadius: "8px",
                          border: `1px solid ${statusColors[i]}22`,
                        }}
                      >
                        {icons[i]}
                      </div>
                      <div>
                        <h3
                          style={{
                            fontFamily: "var(--font-space-grotesk)",
                            fontSize: "16px",
                            fontWeight: 700,
                            color: C.white,
                            marginBottom: "2px",
                          }}
                        >
                          {toolGroup.label}
                        </h3>
                        <span
                          style={{
                            fontFamily: "var(--font-jetbrains)",
                            fontSize: "9px",
                            color: C.muted,
                            letterSpacing: "1px",
                          }}
                        >
                          {equipmentLabels[i]}
                        </span>
                      </div>
                      {/* Status indicator */}
                      <div
                        style={{
                          marginLeft: "auto",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <div
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: C.green,
                            boxShadow: `0 0 6px ${C.green}`,
                          }}
                        />
                        <span
                          style={{
                            fontFamily: "var(--font-jetbrains)",
                            fontSize: "9px",
                            color: C.green,
                            opacity: 0.7,
                          }}
                        >
                          ACTIVE
                        </span>
                      </div>
                    </div>

                    {/* Items */}
                    <div style={{ padding: "14px 20px" }}>
                      {toolGroup.items.map((item, j) => {
                        const base = BASES[(j + i) % 4];
                        return (
                          <motion.div
                            key={j}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 + j * 0.05, duration: 0.4 }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              padding: "8px 0",
                              borderBottom:
                                j < toolGroup.items.length - 1
                                  ? `1px solid ${C.border}`
                                  : "none",
                            }}
                          >
                            {/* Base indicator */}
                            <span
                              style={{
                                fontFamily: "var(--font-jetbrains)",
                                fontSize: "10px",
                                fontWeight: 700,
                                color: BASE_COLORS[base],
                                width: "16px",
                                textAlign: "center",
                              }}
                            >
                              {base}
                            </span>
                            {/* Item name */}
                            <span
                              style={{
                                fontFamily: "var(--font-inter)",
                                fontSize: "13px",
                                color: C.text,
                                flex: 1,
                              }}
                            >
                              {item}
                            </span>
                            {/* Calibration indicator */}
                            <div
                              style={{
                                width: "32px",
                                height: "3px",
                                borderRadius: "2px",
                                background: C.greenDim,
                                overflow: "hidden",
                              }}
                            >
                              <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: "100%" }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 + j * 0.1, duration: 0.6 }}
                                style={{
                                  height: "100%",
                                  background: BASE_COLORS[base],
                                  borderRadius: "2px",
                                  opacity: 0.6,
                                }}
                              />
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Gel lane decoration at bottom */}
                    <div
                      style={{
                        padding: "0 20px 14px",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <GelLane
                        width={280}
                        height={20}
                        seed={i * 31 + 7}
                        bandCount={toolGroup.items.length}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/*  FOOTER — Sequence Complete                                */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <Section id="footer" delay={0}>
          <footer
            style={{
              padding: "80px 24px 40px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* DNA helix fade-out background */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: 0,
                transform: "translateX(-50%)",
                opacity: 0.15,
                pointerEvents: "none",
              }}
            >
              <DNAHelix height={400} width={120} animate={true} />
            </div>

            {/* Gradient overlay to fade helix */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(to bottom, ${C.bg}00 0%, ${C.bg} 70%)`,
                pointerEvents: "none",
              }}
            />

            <div style={{ position: "relative", zIndex: 2 }}>
              {/* Terminal sequence decoration */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                style={{ marginBottom: "32px" }}
              >
                <SequenceStrip length={50} seed={314} />
              </motion.div>

              {/* SEQUENCE COMPLETE */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{
                  fontFamily: "var(--font-space-grotesk)",
                  fontSize: "clamp(28px, 5vw, 44px)",
                  fontWeight: 800,
                  color: C.green,
                  letterSpacing: "-1px",
                  marginBottom: "16px",
                  textShadow: `0 0 30px ${C.greenGlow}`,
                }}
              >
                SEQUENCE COMPLETE
              </motion.h2>

              {/* Completion icon */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 0.6, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                style={{
                  fontSize: "28px",
                  color: C.green,
                  marginBottom: "24px",
                }}
              >
                ⧬
              </motion.div>

              {/* Lab report number */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.5 }}
                viewport={{ once: true }}
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  fontSize: "10px",
                  color: C.muted,
                  letterSpacing: "2px",
                  marginBottom: "8px",
                }}
              >
                Lab Report: {labReport}
              </motion.div>

              {/* GenBank accession */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.4 }}
                viewport={{ once: true }}
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  fontSize: "9px",
                  color: C.muted,
                  letterSpacing: "3px",
                  marginBottom: "32px",
                }}
              >
                GenBank Accession: {accession}
              </motion.div>

              {/* Base pair summary */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "24px",
                  marginBottom: "40px",
                }}
              >
                {BASES.map((base) => (
                  <div
                    key={base}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-jetbrains)",
                        fontSize: "20px",
                        fontWeight: 700,
                        color: BASE_COLORS[base],
                        textShadow: `0 0 10px ${BASE_COLORS[base]}40`,
                      }}
                    >
                      {base}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-jetbrains)",
                        fontSize: "8px",
                        color: C.muted,
                        letterSpacing: "1px",
                      }}
                    >
                      {base === "A"
                        ? "ADENINE"
                        : base === "T"
                          ? "THYMINE"
                          : base === "C"
                            ? "CYTOSINE"
                            : "GUANINE"}
                    </span>
                  </div>
                ))}
              </motion.div>

              {/* Divider */}
              <div
                style={{
                  width: "200px",
                  height: "1px",
                  background: `linear-gradient(90deg, transparent, ${C.green}40, transparent)`,
                  margin: "0 auto 24px",
                }}
              />

              {/* Bottom credits */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.4 }}
                viewport={{ once: true }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-jetbrains)",
                    fontSize: "9px",
                    color: C.muted,
                    letterSpacing: "3px",
                  }}
                >
                  PHENOTYPE — GENETIC EXPRESSION LAB
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-jetbrains)",
                    fontSize: "9px",
                    color: C.muted,
                    letterSpacing: "1px",
                  }}
                >
                  {projects.length} genes expressed / {tools.reduce((a, t) => a + t.items.length, 0)}{" "}
                  reagents catalogued / {expertise.length} loci mapped
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-jetbrains)",
                    fontSize: "8px",
                    color: C.muted,
                    opacity: 0.5,
                    letterSpacing: "2px",
                    marginTop: "8px",
                  }}
                >
                  5&apos;—ATCGATCGATCG—3&apos;
                </span>
              </motion.div>

              {/* Final sequence strip */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.6 }}
                viewport={{ once: true }}
                style={{ marginTop: "32px" }}
              >
                <SequenceStrip length={60} seed={271} />
              </motion.div>
            </div>
          </footer>
        </Section>

        {/* ── Theme Switcher ── */}
        <ThemeSwitcher current="/phenotype" variant="dark" />
      </div>
    </>
  );
}
