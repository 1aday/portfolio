"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "@/app/data/projects";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";

/* ─── Color Palette: Cathedral ─── */
const C = {
  bg: "#1A1A20",
  nave: "#0A0A14",
  gold: "#D4AF37",
  goldMuted: "rgba(212,175,55,0.5)",
  goldFaint: "rgba(212,175,55,0.12)",
  goldGlow: "rgba(212,175,55,0.25)",
  stainedBlue: "#2D4A7A",
  stainedBlueBright: "#4A7AC7",
  stainedRed: "#8B2500",
  stainedRedBright: "#C44B2F",
  stainedGreen: "#2D6B3F",
  stainedGreenBright: "#4AAF6A",
  stainedPurple: "#5B2D7A",
  stainedPurpleBright: "#8A4AC7",
  stone: "#4A4A50",
  stoneDark: "#2A2A30",
  stoneLight: "#6A6A72",
  candle: "#FFE4B5",
  candleBright: "#FFF0D0",
  text: "#E8E0D0",
  textMuted: "rgba(232,224,208,0.55)",
  border: "rgba(212,175,55,0.2)",
  borderBright: "rgba(212,175,55,0.4)",
};

/* ─── Stained glass color sets for project cards ─── */
const GLASS_COLORS = [
  { primary: C.stainedBlue, bright: C.stainedBlueBright },
  { primary: C.stainedRed, bright: C.stainedRedBright },
  { primary: C.stainedGreen, bright: C.stainedGreenBright },
  { primary: C.stainedPurple, bright: C.stainedPurpleBright },
];

/* ─── Rose Window SVG Component ─── */
function RoseWindow({ size = 400, className = "" }: { size?: number; className?: string }) {
  const petals = 12;
  const innerPetals = 8;
  const r = size / 2;
  const outerR = r - 4;
  const petalR = outerR * 0.65;
  const innerPetalR = outerR * 0.38;
  const coreR = outerR * 0.18;

  const petalPaths: string[] = [];
  for (let i = 0; i < petals; i++) {
    const angle = (i / petals) * Math.PI * 2 - Math.PI / 2;
    const nextAngle = ((i + 1) / petals) * Math.PI * 2 - Math.PI / 2;
    const midAngle = (angle + nextAngle) / 2;
    const px = r + petalR * Math.cos(midAngle);
    const py = r + petalR * Math.sin(midAngle);
    const sx = r + coreR * 1.5 * Math.cos(angle);
    const sy = r + coreR * 1.5 * Math.sin(angle);
    const ex = r + coreR * 1.5 * Math.cos(nextAngle);
    const ey = r + coreR * 1.5 * Math.sin(nextAngle);
    petalPaths.push(`M ${sx},${sy} Q ${px},${py} ${ex},${ey}`);
  }

  const innerPetalPaths: string[] = [];
  for (let i = 0; i < innerPetals; i++) {
    const angle = (i / innerPetals) * Math.PI * 2 - Math.PI / 2 + Math.PI / innerPetals;
    const nextAngle = ((i + 1) / innerPetals) * Math.PI * 2 - Math.PI / 2 + Math.PI / innerPetals;
    const midAngle = (angle + nextAngle) / 2;
    const px = r + innerPetalR * Math.cos(midAngle);
    const py = r + innerPetalR * Math.sin(midAngle);
    const sx = r + coreR * 0.8 * Math.cos(angle);
    const sy = r + coreR * 0.8 * Math.sin(angle);
    const ex = r + coreR * 0.8 * Math.cos(nextAngle);
    const ey = r + coreR * 0.8 * Math.sin(nextAngle);
    innerPetalPaths.push(`M ${sx},${sy} Q ${px},${py} ${ex},${ey}`);
  }

  /* outer tracery spokes */
  const spokes: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 0; i < petals; i++) {
    const angle = (i / petals) * Math.PI * 2 - Math.PI / 2;
    spokes.push({
      x1: r + coreR * 1.2 * Math.cos(angle),
      y1: r + coreR * 1.2 * Math.sin(angle),
      x2: r + outerR * 0.88 * Math.cos(angle),
      y2: r + outerR * 0.88 * Math.sin(angle),
    });
  }

  /* small trefoil arcs between spokes */
  const trefoils: string[] = [];
  for (let i = 0; i < petals; i++) {
    const a1 = (i / petals) * Math.PI * 2 - Math.PI / 2;
    const a2 = ((i + 1) / petals) * Math.PI * 2 - Math.PI / 2;
    const midA = (a1 + a2) / 2;
    const tipR = outerR * 0.82;
    const baseR = outerR * 0.6;
    const sx = r + baseR * Math.cos(a1);
    const sy = r + baseR * Math.sin(a1);
    const tx = r + tipR * Math.cos(midA);
    const ty = r + tipR * Math.sin(midA);
    const ex = r + baseR * Math.cos(a2);
    const ey = r + baseR * Math.sin(a2);
    trefoils.push(`M ${sx},${sy} Q ${tx},${ty} ${ex},${ey}`);
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      fill="none"
    >
      <defs>
        <radialGradient id="roseGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={C.candle} stopOpacity="0.15" />
          <stop offset="60%" stopColor={C.gold} stopOpacity="0.08" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="roseCenter" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={C.gold} stopOpacity="0.6" />
          <stop offset="100%" stopColor={C.gold} stopOpacity="0.1" />
        </radialGradient>
      </defs>

      {/* Background glow */}
      <circle cx={r} cy={r} r={outerR} fill="url(#roseGlow)" />

      {/* Outer ring */}
      <circle cx={r} cy={r} r={outerR} stroke={C.gold} strokeWidth="2.5" />
      <circle cx={r} cy={r} r={outerR - 8} stroke={C.goldMuted} strokeWidth="1" />
      <circle cx={r} cy={r} r={outerR - 16} stroke={C.goldMuted} strokeWidth="0.5" />

      {/* Trefoil arcs */}
      {trefoils.map((d, i) => (
        <path
          key={`trefoil-${i}`}
          d={d}
          stroke={[C.stainedBlue, C.stainedRed, C.stainedGreen, C.stainedPurple][i % 4]}
          strokeWidth="2"
          fill={[
            "rgba(45,74,122,0.15)",
            "rgba(139,37,0,0.15)",
            "rgba(45,107,63,0.15)",
            "rgba(91,45,122,0.15)",
          ][i % 4]}
        />
      ))}

      {/* Spokes */}
      {spokes.map((s, i) => (
        <line
          key={`spoke-${i}`}
          x1={s.x1}
          y1={s.y1}
          x2={s.x2}
          y2={s.y2}
          stroke={C.gold}
          strokeWidth="1.2"
        />
      ))}

      {/* Outer petals */}
      {petalPaths.map((d, i) => (
        <path
          key={`petal-${i}`}
          d={d}
          stroke={C.gold}
          strokeWidth="1.8"
          fill={[
            "rgba(45,74,122,0.2)",
            "rgba(139,37,0,0.2)",
            "rgba(45,107,63,0.2)",
            "rgba(91,45,122,0.2)",
          ][i % 4]}
        />
      ))}

      {/* Inner petals */}
      {innerPetalPaths.map((d, i) => (
        <path
          key={`inner-${i}`}
          d={d}
          stroke={C.goldMuted}
          strokeWidth="1.2"
          fill={[
            "rgba(74,122,199,0.12)",
            "rgba(196,75,47,0.12)",
            "rgba(74,175,106,0.12)",
            "rgba(138,74,199,0.12)",
          ][i % 4]}
        />
      ))}

      {/* Center core */}
      <circle cx={r} cy={r} r={coreR} fill="url(#roseCenter)" stroke={C.gold} strokeWidth="2" />
      <circle cx={r} cy={r} r={coreR * 0.5} stroke={C.goldMuted} strokeWidth="1" />

      {/* Small center cross */}
      <line x1={r} y1={r - coreR * 0.35} x2={r} y2={r + coreR * 0.35} stroke={C.gold} strokeWidth="1.5" />
      <line x1={r - coreR * 0.25} y1={r - coreR * 0.1} x2={r + coreR * 0.25} y2={r - coreR * 0.1} stroke={C.gold} strokeWidth="1.5" />

      {/* Decorative dots around rim */}
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * Math.PI * 2;
        return (
          <circle
            key={`dot-${i}`}
            cx={r + (outerR - 4) * Math.cos(a)}
            cy={r + (outerR - 4) * Math.sin(a)}
            r="1.5"
            fill={C.gold}
            opacity="0.5"
          />
        );
      })}
    </svg>
  );
}

/* ─── Pointed Gothic Arch SVG ─── */
function PointedArch({
  width = 300,
  height = 400,
  strokeColor = C.gold,
  fillColor = "none",
  strokeW = 2,
  children,
}: {
  width?: number;
  height?: number;
  strokeColor?: string;
  fillColor?: string;
  strokeW?: number;
  children?: React.ReactNode;
}) {
  const archHeight = height * 0.35;
  const d = `
    M 0,${height}
    L 0,${archHeight}
    Q 0,0 ${width / 2},0
    Q ${width},0 ${width},${archHeight}
    L ${width},${height}
  `;

  return (
    <div style={{ position: "relative", width, height }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: "absolute", top: 0, left: 0 }}
        fill="none"
      >
        <defs>
          <clipPath id={`arch-clip-${width}-${height}`}>
            <path d={d} />
          </clipPath>
        </defs>
        <path d={d} stroke={strokeColor} strokeWidth={strokeW} fill={fillColor} />
      </svg>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          clipPath: `path('${d}')`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ─── Candle Flame SVG ─── */
function CandleFlame({ size = 24, delay = 0 }: { size?: number; delay?: number }) {
  return (
    <motion.svg
      width={size}
      height={size * 1.8}
      viewBox="0 0 24 43"
      fill="none"
      animate={{
        scaleX: [1, 1.05, 0.95, 1.02, 1],
        scaleY: [1, 1.08, 0.96, 1.04, 1],
      }}
      transition={{
        duration: 2 + delay * 0.3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{ originX: "50%", originY: "100%" }}
    >
      {/* Flame glow */}
      <ellipse cx="12" cy="20" rx="10" ry="14" fill={C.gold} opacity="0.12" />
      {/* Outer flame */}
      <path
        d="M12 2C12 2 4 14 4 22C4 28 8 32 12 32C16 32 20 28 20 22C20 14 12 2 12 2Z"
        fill={C.gold}
        opacity="0.6"
      />
      {/* Inner flame */}
      <path
        d="M12 8C12 8 8 16 8 22C8 26 10 28 12 28C14 28 16 26 16 22C16 16 12 8 12 8Z"
        fill={C.candle}
        opacity="0.9"
      />
      {/* Bright core */}
      <ellipse cx="12" cy="24" rx="3" ry="4" fill={C.candleBright} opacity="0.95" />
      {/* Candle body */}
      <rect x="9" y="32" width="6" height="10" rx="1" fill={C.stoneLight} opacity="0.6" />
    </motion.svg>
  );
}

/* ─── Flying Buttress SVG ─── */
function FlyingButtress({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      width="120"
      height="200"
      viewBox="0 0 120 200"
      fill="none"
      style={{ transform: flip ? "scaleX(-1)" : "none" }}
    >
      {/* Main arch */}
      <path
        d="M10,190 Q10,80 60,40 Q110,0 110,0"
        stroke={C.gold}
        strokeWidth="2"
        fill="none"
      />
      {/* Support strut */}
      <path
        d="M10,190 Q30,140 60,110"
        stroke={C.goldMuted}
        strokeWidth="1.5"
        fill="none"
      />
      {/* Secondary arch */}
      <path
        d="M20,180 Q20,100 55,60 Q90,20 100,10"
        stroke={C.gold}
        strokeWidth="1"
        opacity="0.5"
        fill="none"
      />
      {/* Base block */}
      <rect x="0" y="180" width="30" height="20" fill={C.stoneDark} stroke={C.gold} strokeWidth="1" opacity="0.6" />
      {/* Pinnacle */}
      <path d="M105,10 L110,0 L115,10 Z" fill={C.gold} opacity="0.7" />
      {/* Decorative circles */}
      <circle cx="40" cy="130" r="4" stroke={C.goldMuted} strokeWidth="1" fill="none" />
      <circle cx="70" cy="70" r="3" stroke={C.goldMuted} strokeWidth="1" fill="none" />
    </svg>
  );
}

/* ─── Gothic Tracery Pattern SVG ─── */
function TraceryPattern({ width = 600, height = 60 }: { width?: number; height?: number }) {
  const units = Math.ceil(width / 60);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      {Array.from({ length: units }).map((_, i) => {
        const x = i * 60;
        return (
          <g key={i}>
            {/* Gothic arch unit */}
            <path
              d={`M ${x + 5},${height} L ${x + 5},${height * 0.4} Q ${x + 30},0 ${x + 55},${height * 0.4} L ${x + 55},${height}`}
              stroke={C.gold}
              strokeWidth="1"
              opacity="0.4"
            />
            {/* Inner trefoil */}
            <circle cx={x + 30} cy={height * 0.45} r="6" stroke={C.gold} strokeWidth="0.8" opacity="0.3" />
            <circle cx={x + 22} cy={height * 0.55} r="4" stroke={C.gold} strokeWidth="0.6" opacity="0.25" />
            <circle cx={x + 38} cy={height * 0.55} r="4" stroke={C.gold} strokeWidth="0.6" opacity="0.25" />
          </g>
        );
      })}
      {/* Bottom line */}
      <line x1="0" y1={height - 1} x2={width} y2={height - 1} stroke={C.gold} strokeWidth="0.5" opacity="0.3" />
    </svg>
  );
}

/* ─── Stone Column Capital SVG ─── */
function ColumnCapital({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 80 96" fill="none">
      {/* Abacus (top slab) */}
      <rect x="2" y="0" width="76" height="10" rx="2" fill={C.stoneDark} stroke={C.gold} strokeWidth="1" opacity="0.8" />
      {/* Echinus (curved part) */}
      <path d="M8,10 Q8,20 15,28 Q25,36 40,38 Q55,36 65,28 Q72,20 72,10" fill={C.stoneDark} stroke={C.gold} strokeWidth="1" opacity="0.7" />
      {/* Volutes */}
      <path d="M10,18 Q4,20 6,26 Q8,32 14,30" stroke={C.gold} strokeWidth="0.8" opacity="0.5" fill="none" />
      <path d="M70,18 Q76,20 74,26 Q72,32 66,30" stroke={C.gold} strokeWidth="0.8" opacity="0.5" fill="none" />
      {/* Shaft */}
      <rect x="25" y="38" width="30" height="50" rx="3" fill={C.stoneDark} stroke={C.gold} strokeWidth="1" opacity="0.6" />
      {/* Fluting lines */}
      <line x1="32" y1="40" x2="32" y2="86" stroke={C.gold} strokeWidth="0.4" opacity="0.3" />
      <line x1="40" y1="40" x2="40" y2="86" stroke={C.gold} strokeWidth="0.4" opacity="0.3" />
      <line x1="48" y1="40" x2="48" y2="86" stroke={C.gold} strokeWidth="0.4" opacity="0.3" />
      {/* Base */}
      <rect x="20" y="88" width="40" height="8" rx="2" fill={C.stoneDark} stroke={C.gold} strokeWidth="0.8" opacity="0.5" />
      {/* Leaf decoration */}
      <path d="M30,26 Q34,18 40,22 Q46,18 50,26" stroke={C.gold} strokeWidth="0.8" fill={C.goldFaint} />
    </svg>
  );
}

/* ─── Stained Glass Panel for Project Cards ─── */
function StainedGlassPanel({
  color,
  bright,
  width = 300,
  height = 80,
}: {
  color: string;
  bright: string;
  width?: number;
  height?: number;
}) {
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" style={{ display: "block" }}>
      <defs>
        <linearGradient id={`glass-${color.replace("#", "")}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="50%" stopColor={bright} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0.35" />
        </linearGradient>
      </defs>
      {/* Background */}
      <rect width={width} height={height} fill={`url(#glass-${color.replace("#", "")})`} />
      {/* Leading (dividing lines) */}
      <line x1={width * 0.33} y1="0" x2={width * 0.33} y2={height} stroke={C.gold} strokeWidth="1" opacity="0.35" />
      <line x1={width * 0.66} y1="0" x2={width * 0.66} y2={height} stroke={C.gold} strokeWidth="1" opacity="0.35" />
      <line x1="0" y1={height * 0.5} x2={width} y2={height * 0.5} stroke={C.gold} strokeWidth="0.5" opacity="0.25" />
      {/* Diamond patterns */}
      <path
        d={`M ${width * 0.165},5 L ${width * 0.25},${height * 0.25} L ${width * 0.165},${height * 0.45} L ${width * 0.08},${height * 0.25} Z`}
        fill={bright}
        opacity="0.15"
        stroke={C.gold}
        strokeWidth="0.5"
      />
      <path
        d={`M ${width * 0.5},5 L ${width * 0.58},${height * 0.25} L ${width * 0.5},${height * 0.45} L ${width * 0.42},${height * 0.25} Z`}
        fill={bright}
        opacity="0.12"
        stroke={C.gold}
        strokeWidth="0.5"
      />
      <path
        d={`M ${width * 0.835},5 L ${width * 0.92},${height * 0.25} L ${width * 0.835},${height * 0.45} L ${width * 0.75},${height * 0.25} Z`}
        fill={bright}
        opacity="0.15"
        stroke={C.gold}
        strokeWidth="0.5"
      />
      {/* Circular motifs */}
      <circle cx={width * 0.165} cy={height * 0.72} r="8" stroke={C.gold} strokeWidth="0.6" opacity="0.3" fill={color} fillOpacity="0.15" />
      <circle cx={width * 0.5} cy={height * 0.72} r="8" stroke={C.gold} strokeWidth="0.6" opacity="0.3" fill={color} fillOpacity="0.15" />
      <circle cx={width * 0.835} cy={height * 0.72} r="8" stroke={C.gold} strokeWidth="0.6" opacity="0.3" fill={color} fillOpacity="0.15" />
    </svg>
  );
}

/* ─── Gothic Cross SVG ─── */
function GothicCross({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 40 52" fill="none">
      <path
        d="M17,0 L23,0 L23,18 L40,18 L40,24 L23,24 L23,52 L17,52 L17,24 L0,24 L0,18 L17,18 Z"
        fill={C.gold}
        opacity="0.3"
      />
      <path
        d="M18.5,2 L21.5,2 L21.5,19.5 L38,19.5 L38,22.5 L21.5,22.5 L21.5,50 L18.5,50 L18.5,22.5 L2,22.5 L2,19.5 L18.5,19.5 Z"
        fill={C.gold}
        opacity="0.5"
      />
      {/* Fleur-de-lis tips */}
      <circle cx="20" cy="1" r="2" fill={C.gold} opacity="0.4" />
      <circle cx="39" cy="21" r="2" fill={C.gold} opacity="0.4" />
      <circle cx="1" cy="21" r="2" fill={C.gold} opacity="0.4" />
      <circle cx="20" cy="51" r="2" fill={C.gold} opacity="0.4" />
    </svg>
  );
}

/* ─── Ribbed Vault Ceiling Pattern ─── */
function VaultPattern({ width = 1200, height = 120 }: { width?: number; height?: number }) {
  const ribs = 8;
  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      fill="none"
      style={{ display: "block" }}
    >
      {Array.from({ length: ribs }).map((_, i) => {
        const x = ((i + 0.5) / ribs) * width;
        return (
          <g key={i}>
            {/* Main rib */}
            <path
              d={`M ${x},${height} Q ${x - 60},${height * 0.2} ${width / 2},0`}
              stroke={C.gold}
              strokeWidth="1"
              opacity="0.2"
            />
            <path
              d={`M ${x},${height} Q ${x + 60},${height * 0.2} ${width / 2},0`}
              stroke={C.gold}
              strokeWidth="1"
              opacity="0.2"
            />
          </g>
        );
      })}
      {/* Keystone */}
      <circle cx={width / 2} cy="4" r="6" fill={C.gold} opacity="0.15" />
      <circle cx={width / 2} cy="4" r="3" fill={C.gold} opacity="0.3" />
    </svg>
  );
}

/* ─── Section wrapper with scroll reveal ─── */
function Section({
  children,
  className = "",
  style = {},
  id,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      style={style}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
}

/* ─── Animated text line reveal ─── */
function RevealText({
  children,
  delay = 0,
  style = {},
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <div ref={ref} style={{ overflow: "hidden", ...style }} className={className}>
      <motion.div
        initial={{ y: "100%" }}
        animate={inView ? { y: 0 } : {}}
        transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CATHEDRAL PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function CathedralPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  /* ─── Candle flicker state for ambient effect ─── */
  const [flickerPhase, setFlickerPhase] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setFlickerPhase((p) => (p + 1) % 100);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <style>{`
        @keyframes roseRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes candleFlicker {
          0%, 100% { opacity: 0.7; transform: scaleY(1); }
          25% { opacity: 0.9; transform: scaleY(1.05); }
          50% { opacity: 0.6; transform: scaleY(0.95); }
          75% { opacity: 0.85; transform: scaleY(1.02); }
        }
        @keyframes goldGleam {
          0%, 100% { text-shadow: 0 0 20px rgba(212,175,55,0.3); }
          50% { text-shadow: 0 0 40px rgba(212,175,55,0.6), 0 0 80px rgba(212,175,55,0.2); }
        }
        @keyframes stainedShimmer {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes vaultReveal {
          from { stroke-dashoffset: 500; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes floatCandle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(212,175,55,0.1); }
          50% { box-shadow: 0 0 40px rgba(212,175,55,0.2), 0 0 60px rgba(212,175,55,0.08); }
        }
        @keyframes archReveal {
          from { clip-path: inset(100% 0 0 0); }
          to { clip-path: inset(0 0 0 0); }
        }
        @keyframes traceryDraw {
          from { stroke-dashoffset: 200; }
          to { stroke-dashoffset: 0; }
        }

        .cathedral-body {
          background: ${C.bg};
          color: ${C.text};
          font-family: var(--font-inter), sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
        }
        .cathedral-body::-webkit-scrollbar { width: 6px; }
        .cathedral-body::-webkit-scrollbar-track { background: ${C.nave}; }
        .cathedral-body::-webkit-scrollbar-thumb { background: ${C.goldMuted}; border-radius: 3px; }

        .gold-text {
          color: ${C.gold};
          animation: goldGleam 4s ease-in-out infinite;
        }

        .stone-card {
          background: ${C.stoneDark};
          border: 1px solid ${C.border};
          animation: glowPulse 6s ease-in-out infinite;
        }

        .stone-card:hover {
          border-color: ${C.borderBright};
          box-shadow: 0 0 30px rgba(212,175,55,0.15), inset 0 1px 0 rgba(212,175,55,0.1);
        }

        .stained-shimmer {
          animation: stainedShimmer 5s ease-in-out infinite;
        }

        .candle-float {
          animation: floatCandle 3s ease-in-out infinite;
        }

        .rose-spin {
          animation: roseRotate 120s linear infinite;
        }
      `}</style>

      <div className="cathedral-body">
        {/* ═══════════════════════════════════════════
            HERO SECTION
           ═══════════════════════════════════════════ */}
        <section
          style={{
            position: "relative",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            background: `radial-gradient(ellipse at 50% 20%, rgba(212,175,55,0.06) 0%, transparent 60%), ${C.nave}`,
          }}
        >
          {/* Vault ceiling pattern at top */}
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", opacity: 0.5 }}>
            <VaultPattern />
          </div>

          {/* Ambient candle glow */}
          <div
            style={{
              position: "absolute",
              top: "20%",
              left: "50%",
              transform: "translateX(-50%)",
              width: 600,
              height: 600,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(255,228,181,0.06) 0%, transparent 70%)`,
              pointerEvents: "none",
            }}
          />

          {/* Rose Window */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginBottom: 40 }}
          >
            <div className="rose-spin">
              <RoseWindow size={280} />
            </div>
          </motion.div>

          {/* Title with Gothic arch frame */}
          <div style={{ position: "relative", textAlign: "center" }}>
            {/* Pointed arch frame around title */}
            <svg
              width="500"
              height="180"
              viewBox="0 0 500 180"
              fill="none"
              style={{ position: "absolute", top: -30, left: "50%", transform: "translateX(-50%)" }}
            >
              <path
                d="M 40,180 L 40,70 Q 40,0 250,0 Q 460,0 460,70 L 460,180"
                stroke={C.gold}
                strokeWidth="1.5"
                opacity="0.3"
              />
              <path
                d="M 55,180 L 55,75 Q 55,10 250,10 Q 445,10 445,75 L 445,180"
                stroke={C.gold}
                strokeWidth="0.8"
                opacity="0.15"
              />
            </svg>

            <RevealText>
              <h1
                style={{
                  fontFamily: "var(--font-playfair), serif",
                  fontSize: "clamp(3.5rem, 8vw, 7rem)",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  lineHeight: 1,
                  color: C.gold,
                  textShadow: `0 0 40px rgba(212,175,55,0.4), 0 0 80px rgba(212,175,55,0.15)`,
                }}
                className="gold-text"
              >
                CATHEDRAL
              </h1>
            </RevealText>

            <RevealText delay={0.2}>
              <p
                style={{
                  fontFamily: "var(--font-instrument), serif",
                  fontSize: "clamp(1rem, 2vw, 1.35rem)",
                  color: C.candle,
                  opacity: 0.7,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  marginTop: 12,
                }}
              >
                AI Engineering &mdash; Built to Last
              </p>
            </RevealText>

            <RevealText delay={0.35}>
              <p
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.85rem",
                  color: C.textMuted,
                  maxWidth: 480,
                  margin: "20px auto 0",
                  lineHeight: 1.7,
                }}
              >
                Crafting intelligent systems with the permanence and precision
                of Gothic architecture. Each project a stone in an enduring edifice.
              </p>
            </RevealText>
          </div>

          {/* Stats on stone tablets */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            style={{
              display: "flex",
              gap: 32,
              marginTop: 48,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.15, duration: 0.6 }}
                style={{
                  background: C.stoneDark,
                  border: `1px solid ${C.border}`,
                  padding: "18px 32px",
                  textAlign: "center",
                  position: "relative",
                }}
              >
                {/* Stone tablet top edge */}
                <div
                  style={{
                    position: "absolute",
                    top: -1,
                    left: 8,
                    right: 8,
                    height: 2,
                    background: C.gold,
                    opacity: 0.4,
                  }}
                />
                <div
                  style={{
                    fontFamily: "var(--font-playfair), serif",
                    fontSize: "1.8rem",
                    fontWeight: 700,
                    color: C.gold,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "0.7rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: C.textMuted,
                    marginTop: 4,
                  }}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Decorative candles flanking */}
          <div style={{ position: "absolute", bottom: 40, left: 60, opacity: 0.5 }} className="candle-float">
            <CandleFlame size={18} delay={0} />
          </div>
          <div style={{ position: "absolute", bottom: 40, right: 60, opacity: 0.5 }} className="candle-float">
            <CandleFlame size={18} delay={1} />
          </div>
          <div style={{ position: "absolute", bottom: 60, left: 120, opacity: 0.3 }} className="candle-float">
            <CandleFlame size={14} delay={2} />
          </div>
          <div style={{ position: "absolute", bottom: 60, right: 120, opacity: 0.3 }} className="candle-float">
            <CandleFlame size={14} delay={3} />
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            style={{
              position: "absolute",
              bottom: 24,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: C.textMuted,
              }}
            >
              Enter the Nave
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ color: C.gold, fontSize: "1.2rem" }}
            >
              &#x25BE;
            </motion.div>
          </motion.div>
        </section>

        {/* Tracery divider */}
        <div style={{ overflow: "hidden" }}>
          <TraceryPattern width={1400} />
        </div>

        {/* ═══════════════════════════════════════════
            PROJECTS SECTION
           ═══════════════════════════════════════════ */}
        <Section
          id="projects"
          style={{
            padding: "100px 24px",
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          {/* Section header */}
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <RevealText>
              <div
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: C.goldMuted,
                  marginBottom: 12,
                }}
              >
                &#x2720; The Nave &#x2720;
              </div>
            </RevealText>
            <RevealText delay={0.1}>
              <h2
                style={{
                  fontFamily: "var(--font-playfair), serif",
                  fontSize: "clamp(2rem, 4vw, 3.2rem)",
                  fontWeight: 700,
                  color: C.gold,
                  letterSpacing: "0.08em",
                }}
              >
                Sacred Works
              </h2>
            </RevealText>
            <RevealText delay={0.2}>
              <p
                style={{
                  color: C.textMuted,
                  fontSize: "0.9rem",
                  maxWidth: 500,
                  margin: "12px auto 0",
                  lineHeight: 1.7,
                }}
              >
                Ten pillars of engineering, each bearing the weight of innovation.
              </p>
            </RevealText>
          </div>

          {/* Project cards in Gothic arch frames */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: 40,
            }}
          >
            {projects.map((project, i) => {
              const glassColor = GLASS_COLORS[i % GLASS_COLORS.length];
              return (
                <ProjectCard
                  key={project.title}
                  project={project}
                  index={i}
                  glassColor={glassColor}
                />
              );
            })}
          </div>
        </Section>

        {/* Tracery divider */}
        <div style={{ overflow: "hidden" }}>
          <TraceryPattern width={1400} />
        </div>

        {/* ═══════════════════════════════════════════
            EXPERTISE SECTION — Flying Buttresses
           ═══════════════════════════════════════════ */}
        <Section
          id="expertise"
          style={{
            padding: "100px 24px",
            background: `linear-gradient(180deg, ${C.nave} 0%, ${C.bg} 100%)`,
          }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            {/* Section header */}
            <div style={{ textAlign: "center", marginBottom: 80 }}>
              <RevealText>
                <div
                  style={{
                    fontSize: "0.65rem",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: C.goldMuted,
                    marginBottom: 12,
                  }}
                >
                  &#x2720; Structural Supports &#x2720;
                </div>
              </RevealText>
              <RevealText delay={0.1}>
                <h2
                  style={{
                    fontFamily: "var(--font-playfair), serif",
                    fontSize: "clamp(2rem, 4vw, 3.2rem)",
                    fontWeight: 700,
                    color: C.gold,
                    letterSpacing: "0.08em",
                  }}
                >
                  Flying Buttresses
                </h2>
              </RevealText>
              <RevealText delay={0.2}>
                <p style={{ color: C.textMuted, fontSize: "0.9rem", maxWidth: 500, margin: "12px auto 0", lineHeight: 1.7 }}>
                  Core expertise that supports every structure we build.
                </p>
              </RevealText>
            </div>

            {/* Expertise cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 32,
              }}
            >
              {expertise.map((item, i) => (
                <ExpertiseCard key={item.title} item={item} index={i} />
              ))}
            </div>
          </div>
        </Section>

        {/* Tracery divider */}
        <div style={{ overflow: "hidden" }}>
          <TraceryPattern width={1400} />
        </div>

        {/* ═══════════════════════════════════════════
            TOOLS SECTION — Nave Columns
           ═══════════════════════════════════════════ */}
        <Section
          id="tools"
          style={{
            padding: "100px 24px",
          }}
        >
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            {/* Section header */}
            <div style={{ textAlign: "center", marginBottom: 80 }}>
              <RevealText>
                <div
                  style={{
                    fontSize: "0.65rem",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: C.goldMuted,
                    marginBottom: 12,
                  }}
                >
                  &#x2720; The Colonnade &#x2720;
                </div>
              </RevealText>
              <RevealText delay={0.1}>
                <h2
                  style={{
                    fontFamily: "var(--font-playfair), serif",
                    fontSize: "clamp(2rem, 4vw, 3.2rem)",
                    fontWeight: 700,
                    color: C.gold,
                    letterSpacing: "0.08em",
                  }}
                >
                  Nave Columns
                </h2>
              </RevealText>
              <RevealText delay={0.2}>
                <p style={{ color: C.textMuted, fontSize: "0.9rem", maxWidth: 500, margin: "12px auto 0", lineHeight: 1.7 }}>
                  The pillars and instruments of our craft, carved into stone.
                </p>
              </RevealText>
            </div>

            {/* Tools as columns */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
                gap: 28,
              }}
            >
              {tools.map((toolGroup, i) => (
                <ToolColumn key={toolGroup.label} toolGroup={toolGroup} index={i} />
              ))}
            </div>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            FOOTER
           ═══════════════════════════════════════════ */}
        <footer
          style={{
            position: "relative",
            padding: "80px 24px 40px",
            background: C.nave,
            textAlign: "center",
            overflow: "hidden",
          }}
        >
          {/* Gothic tracery at top */}
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", opacity: 0.4 }}>
            <TraceryPattern width={1400} height={50} />
          </div>

          {/* Candle row */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 40,
              marginBottom: 40,
            }}
          >
            {Array.from({ length: 7 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="candle-float"
                style={{ animationDelay: `${i * 0.3}s` }}
              >
                <CandleFlame size={16} delay={i * 0.5} />
              </motion.div>
            ))}
          </div>

          {/* Gothic cross */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}
          >
            <GothicCross size={32} />
          </motion.div>

          {/* AMEN */}
          <RevealText>
            <h3
              style={{
                fontFamily: "var(--font-playfair), serif",
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                fontWeight: 700,
                color: C.gold,
                letterSpacing: "0.25em",
                textShadow: `0 0 30px rgba(212,175,55,0.3)`,
              }}
              className="gold-text"
            >
              AMEN
            </h3>
          </RevealText>

          <RevealText delay={0.15}>
            <p
              style={{
                fontFamily: "var(--font-instrument), serif",
                fontSize: "1rem",
                color: C.candle,
                opacity: 0.6,
                letterSpacing: "0.15em",
                marginTop: 8,
              }}
            >
              Built to Last &mdash; Grox Cathedral
            </p>
          </RevealText>

          {/* Small rose window in footer */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 1 }}
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 32,
            }}
          >
            <div className="rose-spin" style={{ animationDuration: "90s" }}>
              <RoseWindow size={80} />
            </div>
          </motion.div>

          {/* Bottom info */}
          <div
            style={{
              marginTop: 40,
              paddingTop: 24,
              borderTop: `1px solid ${C.border}`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontSize: "0.7rem", color: C.textMuted, letterSpacing: "0.1em" }}>
              MMXXV
            </span>
            <span style={{ fontSize: "0.7rem", color: C.goldMuted }}>&#x2720;</span>
            <span style={{ fontSize: "0.7rem", color: C.textMuted, letterSpacing: "0.1em" }}>
              DEO VOLENTE
            </span>
          </div>
        </footer>

        <ThemeSwitcher current="/cathedral" variant="dark" />
      </div>
    </>
  );
}

/* ─────────────────────────────────────────
   PROJECT CARD COMPONENT
   ───────────────────────────────────────── */
function ProjectCard({
  project,
  index,
  glassColor,
}: {
  project: (typeof projects)[number];
  index: number;
  glassColor: { primary: string; bright: string };
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);
  const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        cursor: "pointer",
      }}
    >
      {/* Pointed arch frame */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 0,
        }}
      >
        {/* Arch top SVG */}
        <svg
          width="100%"
          height="60"
          viewBox="0 0 400 60"
          preserveAspectRatio="none"
          style={{ display: "block" }}
        >
          <defs>
            <linearGradient id={`archGrad-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={glassColor.primary} stopOpacity="0.3" />
              <stop offset="100%" stopColor={C.stoneDark} stopOpacity="1" />
            </linearGradient>
          </defs>
          <path
            d="M 0,60 L 0,30 Q 0,0 200,0 Q 400,0 400,30 L 400,60 Z"
            fill={`url(#archGrad-${index})`}
          />
          <path
            d="M 0,60 L 0,30 Q 0,0 200,0 Q 400,0 400,30 L 400,60"
            fill="none"
            stroke={C.gold}
            strokeWidth="1.5"
            opacity="0.5"
          />
          {/* Inner arch line */}
          <path
            d="M 10,60 L 10,33 Q 10,5 200,5 Q 390,5 390,33 L 390,60"
            fill="none"
            stroke={C.gold}
            strokeWidth="0.6"
            opacity="0.2"
          />
          {/* Roman numeral in arch peak */}
          <text
            x="200"
            y="25"
            textAnchor="middle"
            fill={C.gold}
            opacity="0.5"
            style={{ fontSize: "12px", fontFamily: "var(--font-playfair), serif" }}
          >
            {romanNumerals[index]}
          </text>
        </svg>

        {/* Stained glass header panel */}
        <StainedGlassPanel
          color={glassColor.primary}
          bright={glassColor.bright}
          width={400}
          height={60}
        />

        {/* Card body */}
        <motion.div
          className="stone-card"
          animate={{
            borderColor: hovered ? C.borderBright : C.border,
          }}
          transition={{ duration: 0.3 }}
          style={{
            padding: "24px 20px 20px",
            background: `linear-gradient(180deg, ${C.stoneDark} 0%, rgba(26,26,32,0.95) 100%)`,
            borderTop: "none",
            position: "relative",
          }}
        >
          {/* Gold leaf accent line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 20,
              right: 20,
              height: 1,
              background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
              opacity: hovered ? 0.6 : 0.2,
              transition: "opacity 0.3s",
            }}
          />

          {/* Project number + year */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: "0.6rem",
                letterSpacing: "0.15em",
                color: C.goldMuted,
                textTransform: "uppercase",
              }}
            >
              {project.client}
            </span>
            <span
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: "0.6rem",
                color: C.textMuted,
              }}
            >
              {project.year}
            </span>
          </div>

          {/* Title */}
          <h3
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontSize: "1.2rem",
              fontWeight: 700,
              color: C.text,
              lineHeight: 1.3,
              marginBottom: 10,
              whiteSpace: "pre-line",
            }}
          >
            {project.title}
          </h3>

          {/* Description */}
          <p
            style={{
              fontSize: "0.78rem",
              color: C.textMuted,
              lineHeight: 1.65,
              marginBottom: 12,
            }}
          >
            {project.description}
          </p>

          {/* Technical detail */}
          <p
            style={{
              fontSize: "0.72rem",
              color: `rgba(232,224,208,0.4)`,
              lineHeight: 1.6,
              marginBottom: 16,
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            {project.technical}
          </p>

          {/* Tech tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
            {project.tech.map((t) => (
              <span
                key={t}
                style={{
                  fontFamily: "var(--font-jetbrains), monospace",
                  fontSize: "0.6rem",
                  padding: "3px 8px",
                  background: C.goldFaint,
                  color: C.gold,
                  border: `1px solid ${C.border}`,
                  letterSpacing: "0.05em",
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
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: "0.68rem",
              color: C.gold,
              textDecoration: "none",
              opacity: 0.6,
              transition: "opacity 0.2s",
              fontFamily: "var(--font-jetbrains), monospace",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            Source
          </a>
        </motion.div>

        {/* Bottom arch decoration */}
        <svg
          width="100%"
          height="8"
          viewBox="0 0 400 8"
          preserveAspectRatio="none"
          style={{ display: "block" }}
        >
          <rect width="400" height="8" fill={C.stoneDark} />
          <line x1="0" y1="0" x2="400" y2="0" stroke={C.gold} strokeWidth="0.5" opacity="0.2" />
          {/* Small decorative elements */}
          <circle cx="200" cy="4" r="2" fill={C.gold} opacity="0.3" />
          <circle cx="100" cy="4" r="1" fill={C.gold} opacity="0.2" />
          <circle cx="300" cy="4" r="1" fill={C.gold} opacity="0.2" />
        </svg>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   EXPERTISE CARD — Flying Buttress
   ───────────────────────────────────────── */
function ExpertiseCard({
  item,
  index,
}: {
  item: (typeof expertise)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: "relative" }}
    >
      <motion.div
        className="stone-card"
        animate={{
          borderColor: hovered ? C.borderBright : C.border,
        }}
        transition={{ duration: 0.3 }}
        style={{
          padding: "28px 24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Flying buttress SVG in background */}
        <div
          style={{
            position: "absolute",
            top: -10,
            right: index % 2 === 0 ? -20 : undefined,
            left: index % 2 !== 0 ? -20 : undefined,
            opacity: hovered ? 0.3 : 0.12,
            transition: "opacity 0.4s",
          }}
        >
          <FlyingButtress flip={index % 2 !== 0} />
        </div>

        {/* Number */}
        <div
          style={{
            fontFamily: "var(--font-playfair), serif",
            fontSize: "2.5rem",
            fontWeight: 700,
            color: C.gold,
            opacity: 0.15,
            lineHeight: 1,
            marginBottom: 8,
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily: "var(--font-dm-serif), serif",
            fontSize: "1.15rem",
            fontWeight: 400,
            color: C.text,
            marginBottom: 12,
            position: "relative",
          }}
        >
          {item.title}
        </h3>

        {/* Gold accent line */}
        <div
          style={{
            width: 40,
            height: 2,
            background: C.gold,
            opacity: hovered ? 0.6 : 0.3,
            transition: "opacity 0.3s, width 0.3s",
            marginBottom: 12,
          }}
        />

        {/* Body text */}
        <p
          style={{
            fontSize: "0.78rem",
            color: C.textMuted,
            lineHeight: 1.7,
            position: "relative",
          }}
        >
          {item.body}
        </p>

        {/* Bottom arch decoration */}
        <svg
          width="100%"
          height="20"
          viewBox="0 0 280 20"
          preserveAspectRatio="none"
          fill="none"
          style={{ position: "absolute", bottom: 0, left: 0 }}
        >
          <path
            d="M 0,20 Q 140,0 280,20"
            stroke={C.gold}
            strokeWidth="0.5"
            opacity={hovered ? 0.4 : 0.15}
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   TOOL COLUMN — Nave Column Capital
   ───────────────────────────────────────── */
function ToolColumn({
  toolGroup,
  index,
}: {
  toolGroup: (typeof tools)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {/* Column capital SVG */}
      <motion.div
        animate={{
          y: hovered ? -4 : 0,
          scale: hovered ? 1.05 : 1,
        }}
        transition={{ duration: 0.3 }}
        style={{ marginBottom: 16 }}
      >
        <ColumnCapital size={60} />
      </motion.div>

      {/* Label */}
      <div
        style={{
          fontFamily: "var(--font-playfair), serif",
          fontSize: "0.85rem",
          fontWeight: 700,
          color: C.gold,
          letterSpacing: "0.08em",
          marginBottom: 12,
        }}
      >
        {toolGroup.label}
      </div>

      {/* Column shaft visual */}
      <div
        style={{
          width: 2,
          height: 16,
          background: `linear-gradient(180deg, ${C.gold}, transparent)`,
          opacity: 0.3,
          marginBottom: 12,
        }}
      />

      {/* Items */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {toolGroup.items.map((item) => (
          <motion.div
            key={item}
            animate={{
              color: hovered ? C.candle : C.textMuted,
            }}
            transition={{ duration: 0.3 }}
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: "0.68rem",
              letterSpacing: "0.05em",
              padding: "4px 10px",
              background: hovered ? C.goldFaint : "transparent",
              border: `1px solid ${hovered ? C.border : "transparent"}`,
              transition: "all 0.3s",
            }}
          >
            {item}
          </motion.div>
        ))}
      </div>

      {/* Column base */}
      <div
        style={{
          marginTop: 12,
          width: 40,
          height: 6,
          background: C.stoneDark,
          border: `1px solid ${C.border}`,
          opacity: 0.5,
        }}
      />
    </motion.div>
  );
}
