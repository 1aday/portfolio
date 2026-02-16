"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";

/* ================================================================
   AQUIFER — Underground Water Systems Portfolio Theme
   Cave cross-section frame, stalactite drip animations,
   underground river flow, mineral deposits, and water strata.
   ================================================================ */

/* ─── Color Palette ─── */
const C = {
  bg: "#0A1018",
  cyan: "#2ECBE9",
  limestone: "#C4B896",
  stalactite: "#6B6B6B",
  river: "#1A5276",
  mineral: "#E8F0F2",
  sediment: "#5D4E37",
  caveWall: "#1A2030",
  deepCave: "#0D161F",
  waterDark: "#0E3D5C",
  crystalBlue: "#1E8FBF",
  crystalTeal: "#17A2A2",
  rockDark: "#2A2018",
  rockMid: "#3D3428",
  rockLight: "#524838",
  drip: "#5AC8E0",
  glow: "rgba(46,203,233,0.15)",
};

/* ─── Chamber colors for project cards ─── */
const CHAMBER_COLORS = [
  { rock: "#3D3428", mineral: "#2ECBE9", accent: "#5AC8E0" },
  { rock: "#2A3038", mineral: "#1E8FBF", accent: "#43B0D4" },
  { rock: "#382E20", mineral: "#17A2A2", accent: "#22C4B0" },
  { rock: "#1A2530", mineral: "#2ECBE9", accent: "#6BD8EE" },
  { rock: "#302820", mineral: "#1A5276", accent: "#3A82A6" },
  { rock: "#252030", mineral: "#5AC8E0", accent: "#82DFF0" },
  { rock: "#2D2818", mineral: "#1E8FBF", accent: "#4DB8D4" },
  { rock: "#1A2028", mineral: "#17A2A2", accent: "#2AB8B0" },
  { rock: "#332A1A", mineral: "#2ECBE9", accent: "#5AC8E0" },
  { rock: "#202830", mineral: "#1A5276", accent: "#2A7296" },
];

/* ─── Cave formation types for expertise ─── */
const CAVE_FORMATIONS = [
  { name: "Crystal Cave", color: "#5AC8E0", symbol: "crystal" },
  { name: "Underground Lake", color: "#1E8FBF", symbol: "lake" },
  { name: "Mineral Vein", color: "#C4B896", symbol: "vein" },
  { name: "Water Channel", color: "#2ECBE9", symbol: "channel" },
];

/* ─── Depth levels for tools ─── */
const DEPTH_LEVELS = [
  "Surface — 0ft",
  "Vadose Zone — 50ft",
  "Water Table — 120ft",
  "Saturated Zone — 250ft",
  "Confined Aquifer — 400ft",
  "Deep Aquifer — 600ft",
];

/* ─── Water flow stats labels ─── */
const STAT_UNITS = ["GPM", "ft depth", "psi"];

/* ================================================================
   SVG COMPONENTS — Cave formations, water, minerals
   ================================================================ */

/* Stalactite — pointed formation hanging from top */
function Stalactite({
  x,
  height = 60,
  width = 16,
  color = C.stalactite,
  dripping = false,
}: {
  x: number;
  height?: number;
  width?: number;
  color?: string;
  dripping?: boolean;
}) {
  return (
    <g>
      <polygon
        points={`${x - width / 2},0 ${x + width / 2},0 ${x + width / 4},${height * 0.4} ${x},${height} ${x - width / 4},${height * 0.4}`}
        fill={color}
        opacity={0.85}
      />
      <polygon
        points={`${x - width / 3},0 ${x + width / 3},0 ${x + width / 6},${height * 0.3} ${x},${height * 0.7} ${x - width / 6},${height * 0.3}`}
        fill={color}
        opacity={0.5}
      />
      {dripping && (
        <ellipse cx={x} cy={height + 4} rx={2} ry={3} fill={C.drip} opacity={0.8}>
          <animate attributeName="cy" values={`${height + 4};${height + 60};${height + 4}`} dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0;0.8" dur="3s" repeatCount="indefinite" />
        </ellipse>
      )}
    </g>
  );
}

/* Stalagmite — pointed formation growing from bottom */
function Stalagmite({
  x,
  baseY,
  height = 40,
  width = 14,
  color = C.stalactite,
}: {
  x: number;
  baseY: number;
  height?: number;
  width?: number;
  color?: string;
}) {
  return (
    <polygon
      points={`${x - width / 2},${baseY} ${x + width / 2},${baseY} ${x + width / 4},${baseY - height * 0.4} ${x},${baseY - height} ${x - width / 4},${baseY - height * 0.4}`}
      fill={color}
      opacity={0.7}
    />
  );
}

/* Water droplet SVG */
function WaterDrop({ size = 16, color = C.cyan }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 16 22" fill="none">
      <path d="M8 0C8 0 0 10 0 15a8 8 0 0016 0C16 10 8 0 8 0z" fill={color} opacity={0.8} />
      <ellipse cx="6" cy="14" rx="2" ry="1.5" fill="white" opacity={0.3} />
    </svg>
  );
}

/* Mineral crystal SVG */
function Crystal({ size = 24, color = C.cyan }: { size?: number; color?: string }) {
  const s = size;
  return (
    <svg width={s} height={s * 1.3} viewBox="0 0 24 32" fill="none">
      <polygon points="12,0 18,8 18,24 12,32 6,24 6,8" fill={color} opacity={0.3} />
      <polygon points="12,0 16,8 16,22 12,28 8,22 8,8" fill={color} opacity={0.5} />
      <polygon points="12,2 14,9 14,20 12,26 10,20 10,9" fill={color} opacity={0.7} />
      <line x1="12" y1="2" x2="12" y2="26" stroke="white" strokeWidth="0.5" opacity={0.3} />
    </svg>
  );
}

/* Cave rock layer texture */
function RockLayer({
  y,
  height,
  color,
  rough = false,
}: {
  y: number;
  height: number;
  color: string;
  rough?: boolean;
}) {
  const w = 1200;
  const topPath = rough
    ? `M0,${y} Q${w * 0.1},${y - 8} ${w * 0.2},${y + 4} Q${w * 0.3},${y - 6} ${w * 0.4},${y + 2} Q${w * 0.5},${y - 10} ${w * 0.6},${y + 6} Q${w * 0.7},${y - 4} ${w * 0.8},${y + 8} Q${w * 0.9},${y - 6} ${w},${y + 2} L${w},${y + height} L0,${y + height} Z`
    : `M0,${y} L${w},${y} L${w},${y + height} L0,${y + height} Z`;
  return <path d={topPath} fill={color} opacity={0.6} />;
}

/* Underground river path SVG */
function UndergroundRiverSVG() {
  return (
    <svg
      width="100%"
      height="80"
      viewBox="0 0 1200 80"
      preserveAspectRatio="none"
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id="riverGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={C.cyan} stopOpacity={0} />
          <stop offset="30%" stopColor={C.cyan} stopOpacity={0.4} />
          <stop offset="70%" stopColor={C.crystalBlue} stopOpacity={0.4} />
          <stop offset="100%" stopColor={C.cyan} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path
        d="M0,40 Q150,10 300,40 T600,40 T900,40 T1200,40"
        stroke="url(#riverGrad)"
        strokeWidth="40"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M0,40 Q150,10 300,40 T600,40 T900,40 T1200,40"
        stroke={C.cyan}
        strokeWidth="2"
        fill="none"
        strokeDasharray="8 12"
        opacity={0.6}
      >
        <animate attributeName="stroke-dashoffset" values="0;-40" dur="2s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

/* Cave cross-section hero SVG */
function CaveCrossSectionSVG() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: "absolute", inset: 0, opacity: 0.35 }}
    >
      <defs>
        <linearGradient id="surfaceGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1B3020" />
          <stop offset="100%" stopColor="#0D1A12" />
        </linearGradient>
        <linearGradient id="rockGrad1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.rockMid} />
          <stop offset="100%" stopColor={C.rockDark} />
        </linearGradient>
        <linearGradient id="waterGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={C.waterDark} />
          <stop offset="50%" stopColor={C.river} />
          <stop offset="100%" stopColor={C.waterDark} />
        </linearGradient>
        <radialGradient id="caveGlow" cx="0.5" cy="0.6" r="0.4">
          <stop offset="0%" stopColor={C.cyan} stopOpacity={0.15} />
          <stop offset="100%" stopColor={C.cyan} stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* Surface layer — grass/soil */}
      <path d="M0,0 L1200,0 L1200,80 Q1000,90 800,85 Q600,95 400,80 Q200,90 0,85 Z" fill="url(#surfaceGrad)" />

      {/* Rock layers */}
      <RockLayer y={80} height={60} color={C.rockLight} rough />
      <RockLayer y={140} height={80} color={C.rockMid} rough />
      <RockLayer y={220} height={60} color={C.sediment} rough />

      {/* Cave void */}
      <path
        d="M200,280 Q300,240 450,260 Q550,230 650,250 Q750,220 900,250 Q1000,230 1050,260 L1050,420 Q950,440 850,430 Q700,450 550,420 Q400,450 300,430 Q220,440 200,420 Z"
        fill={C.deepCave}
      />

      {/* Cave glow */}
      <ellipse cx="600" cy="350" rx="350" ry="100" fill="url(#caveGlow)" />

      {/* Underground water */}
      <path
        d="M220,380 Q350,370 500,385 Q650,370 800,380 Q950,370 1030,385 L1030,420 Q950,440 850,430 Q700,450 550,420 Q400,450 300,430 Q220,440 220,420 Z"
        fill="url(#waterGrad)"
        opacity={0.7}
      />

      {/* Water surface shimmer */}
      <path
        d="M220,380 Q350,370 500,385 Q650,370 800,380 Q950,370 1030,385"
        stroke={C.cyan}
        strokeWidth="1.5"
        fill="none"
        opacity={0.5}
      >
        <animate attributeName="d"
          values="M220,380 Q350,370 500,385 Q650,370 800,380 Q950,370 1030,385;M220,383 Q350,373 500,382 Q650,373 800,383 Q950,373 1030,382;M220,380 Q350,370 500,385 Q650,370 800,380 Q950,370 1030,385"
          dur="4s" repeatCount="indefinite" />
      </path>

      {/* Stalactites from cave ceiling */}
      <Stalactite x={280} height={50} width={14} color={C.stalactite} dripping />
      <Stalactite x={370} height={35} width={10} color="#7A7A7A" />
      <Stalactite x={460} height={55} width={16} color={C.stalactite} dripping />
      <Stalactite x={560} height={30} width={10} color="#808080" />
      <Stalactite x={650} height={45} width={14} color={C.stalactite} dripping />
      <Stalactite x={740} height={38} width={12} color="#757575" />
      <Stalactite x={830} height={52} width={14} color={C.stalactite} />
      <Stalactite x={920} height={28} width={10} color="#858585" dripping />

      {/* Stalagmites from cave floor */}
      <Stalagmite x={310} baseY={420} height={30} width={12} color={C.rockLight} />
      <Stalagmite x={420} baseY={430} height={25} width={10} color={C.sediment} />
      <Stalagmite x={540} baseY={420} height={35} width={14} color={C.rockLight} />
      <Stalagmite x={680} baseY={435} height={28} width={12} color={C.sediment} />
      <Stalagmite x={790} baseY={425} height={32} width={14} color={C.rockLight} />
      <Stalagmite x={890} baseY={430} height={22} width={10} color={C.sediment} />
      <Stalagmite x={980} baseY={420} height={30} width={12} color={C.rockLight} />

      {/* Lower rock layers */}
      <RockLayer y={440} height={60} color={C.rockDark} rough />
      <RockLayer y={500} height={50} color="#151520" rough />
      <RockLayer y={550} height={50} color="#0A0A14" />

      {/* Mineral deposits — small crystals in cave walls */}
      <circle cx="250" cy="300" r="3" fill={C.cyan} opacity={0.6} />
      <circle cx="380" cy="270" r="2" fill={C.crystalTeal} opacity={0.5} />
      <circle cx="520" cy="255" r="3" fill={C.cyan} opacity={0.7} />
      <circle cx="700" cy="260" r="2" fill={C.crystalBlue} opacity={0.5} />
      <circle cx="850" cy="275" r="3" fill={C.cyan} opacity={0.6} />
      <circle cx="960" cy="265" r="2" fill={C.crystalTeal} opacity={0.5} />
    </svg>
  );
}

/* Water ripple effect for hero title */
function WaterRipple({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      style={{
        position: "absolute",
        width: 300,
        height: 300,
        borderRadius: "50%",
        border: `1px solid ${C.cyan}`,
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
      }}
      initial={{ scale: 0.3, opacity: 0.6 }}
      animate={{ scale: 2.5, opacity: 0 }}
      transition={{ duration: 4, repeat: Infinity, delay, ease: "easeOut" }}
    />
  );
}

/* Depth gauge indicator */
function DepthGauge({ depth, maxDepth }: { depth: number; maxDepth: number }) {
  const pct = (depth / maxDepth) * 100;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        style={{
          width: 4,
          height: 40,
          background: `${C.caveWall}`,
          borderRadius: 2,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <motion.div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            background: C.cyan,
            borderRadius: 2,
          }}
          initial={{ height: 0 }}
          animate={{ height: `${pct}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>
      <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 11, color: C.cyan }}>
        {depth}ft
      </span>
    </div>
  );
}

/* Water level indicator bar */
function WaterLevelIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16 }}>
      <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, color: C.stalactite, letterSpacing: 2, textTransform: "uppercase" }}>
        Water Level
      </span>
      <div style={{ flex: 1, height: 2, background: C.caveWall, borderRadius: 1, position: "relative", overflow: "hidden" }}>
        <motion.div
          style={{ position: "absolute", left: 0, top: 0, height: "100%", background: `linear-gradient(90deg, ${C.cyan}, ${C.crystalBlue})`, borderRadius: 1 }}
          initial={{ width: "0%" }}
          animate={{ width: "72%" }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
        />
      </div>
      <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 11, color: C.cyan }}>72%</span>
    </div>
  );
}

/* ================================================================
   SECTION COMPONENTS
   ================================================================ */

/* ─── Hero Section ─── */
function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let v = 0;
    const target = 2847;
    const step = Math.ceil(target / 60);
    const iv = setInterval(() => {
      v += step;
      if (v >= target) { v = target; clearInterval(iv); }
      setCount(v);
    }, 25);
    return () => clearInterval(iv);
  }, [inView]);

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        padding: "80px 24px",
      }}
    >
      {/* Cave cross-section background */}
      <CaveCrossSectionSVG />

      {/* Stalactite border at top */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 80, overflow: "hidden" }}>
        <svg width="100%" height="80" viewBox="0 0 1200 80" preserveAspectRatio="none">
          <rect x="0" y="0" width="1200" height="20" fill={C.rockDark} />
          {Array.from({ length: 40 }).map((_, i) => {
            const x = 15 + i * 30;
            const h = 20 + Math.sin(i * 0.8) * 15 + Math.random() * 10;
            return (
              <polygon
                key={i}
                points={`${x - 6},20 ${x + 6},20 ${x + 3},${20 + h * 0.4} ${x},${20 + h} ${x - 3},${20 + h * 0.4}`}
                fill={i % 3 === 0 ? C.stalactite : C.rockMid}
                opacity={0.7 + Math.random() * 0.3}
              />
            );
          })}
        </svg>
      </div>

      {/* Water ripple effects */}
      <WaterRipple delay={0} />
      <WaterRipple delay={1.3} />
      <WaterRipple delay={2.6} />

      {/* Icon */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        style={{
          fontSize: 48,
          marginBottom: 16,
          color: C.cyan,
          filter: `drop-shadow(0 0 20px ${C.cyan})`,
          zIndex: 2,
        }}
      >
        <WaterDrop size={40} color={C.cyan} />
      </motion.div>

      {/* Pre-title */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.3, duration: 0.8 }}
        style={{
          fontFamily: "var(--font-jetbrains)",
          fontSize: 11,
          letterSpacing: 6,
          textTransform: "uppercase",
          color: C.stalactite,
          marginBottom: 24,
          zIndex: 2,
        }}
      >
        Subsurface Hydrology System
      </motion.p>

      {/* Main title — AQUIFER */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5, duration: 1 }}
        style={{
          fontFamily: "var(--font-space-grotesk)",
          fontSize: "clamp(64px, 12vw, 160px)",
          fontWeight: 700,
          color: C.mineral,
          letterSpacing: "-0.02em",
          lineHeight: 0.9,
          textAlign: "center",
          position: "relative",
          zIndex: 2,
          textShadow: `0 0 60px ${C.glow}, 0 0 120px rgba(46,203,233,0.08)`,
        }}
      >
        AQUIFER
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.8, duration: 0.8 }}
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: 16,
          color: C.limestone,
          marginTop: 24,
          maxWidth: 500,
          textAlign: "center",
          lineHeight: 1.6,
          zIndex: 2,
        }}
      >
        AI engineering drawn from deep wells of innovation.
        <br />
        Each project flows from underground springs of possibility.
      </motion.p>

      {/* Water Level Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 1, duration: 0.8 }}
        style={{ width: "100%", maxWidth: 500, zIndex: 2, marginTop: 8 }}
      >
        <WaterLevelIndicator />
      </motion.div>

      {/* Stats as water flow measurements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1.2, duration: 0.8 }}
        style={{
          display: "flex",
          gap: 48,
          marginTop: 48,
          zIndex: 2,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {stats.map((s, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "var(--font-space-grotesk)",
                fontSize: 36,
                fontWeight: 700,
                color: C.cyan,
                lineHeight: 1,
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: 10,
                color: C.stalactite,
                letterSpacing: 2,
                textTransform: "uppercase",
                marginTop: 6,
              }}
            >
              {s.label}
            </div>
            <div
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: 9,
                color: C.cyan,
                opacity: 0.5,
                marginTop: 2,
              }}
            >
              {STAT_UNITS[i]}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Depth counter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 1.5, duration: 0.8 }}
        style={{
          position: "absolute",
          right: 32,
          bottom: 80,
          textAlign: "right",
          zIndex: 2,
        }}
      >
        <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 9, color: C.stalactite, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>
          Depth Measured
        </div>
        <div style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 32, fontWeight: 700, color: C.cyan }}>
          {count.toLocaleString()}
          <span style={{ fontSize: 14, color: C.stalactite, marginLeft: 4 }}>ft</span>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 2, duration: 1 }}
        style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          zIndex: 2,
        }}
      >
        <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 9, letterSpacing: 3, color: C.stalactite, textTransform: "uppercase" }}>
          Dive Deeper
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ color: C.cyan, fontSize: 18 }}
        >
          <WaterDrop size={12} color={C.cyan} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─── Project Card — Underground Chamber ─── */
function ProjectCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const chamber = CHAMBER_COLORS[index % CHAMBER_COLORS.length];
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.1 }}
      style={{
        position: "relative",
        background: chamber.rock,
        borderRadius: 16,
        overflow: "hidden",
        border: `1px solid rgba(46,203,233,0.1)`,
      }}
    >
      {/* Cave rock formation top — stalactites */}
      <svg width="100%" height="32" viewBox="0 0 400 32" preserveAspectRatio="none" style={{ display: "block" }}>
        <rect x="0" y="0" width="400" height="8" fill={chamber.rock} opacity={0.8} />
        {Array.from({ length: 20 }).map((_, i) => {
          const x = 10 + i * 20;
          const h = 8 + Math.sin(i * 1.2 + index) * 8 + Math.random() * 4;
          return (
            <polygon
              key={i}
              points={`${x - 4},8 ${x + 4},8 ${x + 2},${8 + h * 0.5} ${x},${8 + h} ${x - 2},${8 + h * 0.5}`}
              fill={i % 4 === 0 ? chamber.mineral : C.stalactite}
              opacity={0.5 + (i % 3) * 0.15}
            />
          );
        })}
      </svg>

      {/* Card content */}
      <div style={{ padding: "16px 24px 20px" }}>
        {/* Chamber header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 9, color: chamber.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>
              Chamber {String(index + 1).padStart(2, "0")} &middot; {project.client}
            </div>
            <h3
              style={{
                fontFamily: "var(--font-space-grotesk)",
                fontSize: 22,
                fontWeight: 700,
                color: C.mineral,
                lineHeight: 1.2,
                whiteSpace: "pre-line",
              }}
            >
              {project.title}
            </h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
            <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, color: C.stalactite }}>{project.year}</span>
            <DepthGauge depth={(index + 1) * 60} maxDepth={600} />
          </div>
        </div>

        {/* Description */}
        <p style={{ fontFamily: "var(--font-inter)", fontSize: 13, color: C.limestone, lineHeight: 1.65, marginBottom: 12, opacity: 0.85 }}>
          {project.description}
        </p>

        {/* Technical detail */}
        <p style={{ fontFamily: "var(--font-inter)", fontSize: 12, color: C.stalactite, lineHeight: 1.6, marginBottom: 16, fontStyle: "italic" }}>
          {project.technical}
        </p>

        {/* Tech tags as mineral deposits */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
          {project.tech.map((t) => (
            <span
              key={t}
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: 10,
                color: chamber.accent,
                background: `${chamber.mineral}15`,
                border: `1px solid ${chamber.mineral}30`,
                padding: "3px 10px",
                borderRadius: 12,
                letterSpacing: 0.5,
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
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: 10,
              color: C.cyan,
              textDecoration: "none",
              letterSpacing: 1,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              opacity: 0.7,
              transition: "opacity 0.3s",
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.opacity = "1")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.opacity = "0.7")}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23A11.5 11.5 0 0112 5.8c1.02 0 2.05.14 3.01.41 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.82.58C20.57 21.8 24 17.3 24 12 24 5.37 18.63 0 12 0z" />
            </svg>
            View Source
          </a>
        )}
      </div>

      {/* Cave rock formation bottom — stalagmites */}
      <svg width="100%" height="24" viewBox="0 0 400 24" preserveAspectRatio="none" style={{ display: "block" }}>
        {Array.from({ length: 18 }).map((_, i) => {
          const x = 12 + i * 22;
          const h = 6 + Math.sin(i * 0.9 + index) * 5 + Math.random() * 3;
          return (
            <polygon
              key={i}
              points={`${x - 4},24 ${x + 4},24 ${x + 2},${24 - h * 0.5} ${x},${24 - h} ${x - 2},${24 - h * 0.5}`}
              fill={i % 5 === 0 ? chamber.mineral : C.rockLight}
              opacity={0.4 + (i % 3) * 0.1}
            />
          );
        })}
        <rect x="0" y="20" width="400" height="4" fill={chamber.rock} opacity={0.6} />
      </svg>

      {/* Mineral crystal decoration */}
      <div style={{ position: "absolute", top: 16, right: 16, opacity: 0.15 }}>
        <Crystal size={32} color={chamber.mineral} />
      </div>
    </motion.div>
  );
}

/* ─── Projects Section ─── */
function ProjectsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ position: "relative", padding: "100px 24px", maxWidth: 1100, margin: "0 auto" }}>
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        style={{ textAlign: "center", marginBottom: 64 }}
      >
        <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, letterSpacing: 4, color: C.stalactite, textTransform: "uppercase", marginBottom: 12 }}>
          Underground Chambers
        </div>
        <h2 style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 700, color: C.mineral }}>
          Project <span style={{ color: C.cyan }}>Excavations</span>
        </h2>
        <p style={{ fontFamily: "var(--font-inter)", fontSize: 15, color: C.limestone, marginTop: 12, maxWidth: 550, margin: "12px auto 0", opacity: 0.7 }}>
          Each project occupies its own subterranean chamber, connected by flowing underground rivers of innovation.
        </p>
      </motion.div>

      {/* Underground river connector */}
      <div style={{ marginBottom: 32 }}>
        <UndergroundRiverSVG />
      </div>

      {/* Project cards grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 480px), 1fr))",
          gap: 32,
        }}
      >
        {projects.map((p, i) => (
          <ProjectCard key={i} project={p} index={i} />
        ))}
      </div>

      {/* Water flow line at bottom */}
      <div style={{ marginTop: 48 }}>
        <svg width="100%" height="40" viewBox="0 0 1200 40" preserveAspectRatio="none">
          <path
            d="M0,20 Q100,5 200,20 T400,20 T600,20 T800,20 T1000,20 T1200,20"
            stroke={C.cyan}
            strokeWidth="1"
            fill="none"
            strokeDasharray="6 8"
            opacity={0.3}
          >
            <animate attributeName="stroke-dashoffset" values="0;-28" dur="2s" repeatCount="indefinite" />
          </path>
        </svg>
      </div>
    </section>
  );
}

/* ─── Expertise Card — Geological Chamber ─── */
function ExpertiseCard({ item, index }: { item: (typeof expertise)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const formation = CAVE_FORMATIONS[index % CAVE_FORMATIONS.length];

  /* Unique SVG decoration per formation type */
  const FormationSVG = () => {
    switch (formation.symbol) {
      case "crystal":
        return (
          <svg width="80" height="100" viewBox="0 0 80 100" fill="none">
            <polygon points="40,0 55,20 55,70 40,100 25,70 25,20" fill={formation.color} opacity={0.15} />
            <polygon points="40,10 50,25 50,65 40,90 30,65 30,25" fill={formation.color} opacity={0.25} />
            <polygon points="40,20 46,30 46,60 40,80 34,60 34,30" fill={formation.color} opacity={0.35} />
            <line x1="40" y1="10" x2="40" y2="90" stroke={formation.color} strokeWidth="0.5" opacity={0.3} />
            {/* Sparkle points */}
            <circle cx="40" cy="25" r="2" fill="white" opacity={0.6}>
              <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="36" cy="50" r="1.5" fill="white" opacity={0.4}>
              <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2.5s" repeatCount="indefinite" begin="0.5s" />
            </circle>
            <circle cx="44" cy="70" r="1" fill="white" opacity={0.5}>
              <animate attributeName="opacity" values="0.5;0.1;0.5" dur="1.8s" repeatCount="indefinite" begin="1s" />
            </circle>
          </svg>
        );
      case "lake":
        return (
          <svg width="100" height="60" viewBox="0 0 100 60" fill="none">
            <ellipse cx="50" cy="40" rx="45" ry="15" fill={formation.color} opacity={0.1} />
            <ellipse cx="50" cy="38" rx="40" ry="12" fill={formation.color} opacity={0.15} />
            <path d="M10,38 Q30,30 50,38 T90,38" stroke={formation.color} strokeWidth="1" opacity={0.4}>
              <animate attributeName="d" values="M10,38 Q30,30 50,38 T90,38;M10,36 Q30,32 50,36 T90,36;M10,38 Q30,30 50,38 T90,38" dur="3s" repeatCount="indefinite" />
            </path>
            <path d="M15,40 Q35,33 55,40 T95,40" stroke={formation.color} strokeWidth="0.5" opacity={0.3}>
              <animate attributeName="d" values="M15,40 Q35,33 55,40 T95,40;M15,38 Q35,35 55,38 T95,38;M15,40 Q35,33 55,40 T95,40" dur="3.5s" repeatCount="indefinite" begin="0.3s" />
            </path>
            {/* Dripping drops */}
            <circle cx="35" cy="15" r="2" fill={formation.color} opacity={0.5}>
              <animate attributeName="cy" values="15;35;15" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;0;0.5" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="65" cy="10" r="1.5" fill={formation.color} opacity={0.4}>
              <animate attributeName="cy" values="10;35;10" dur="3s" repeatCount="indefinite" begin="1s" />
              <animate attributeName="opacity" values="0.4;0;0.4" dur="3s" repeatCount="indefinite" begin="1s" />
            </circle>
          </svg>
        );
      case "vein":
        return (
          <svg width="80" height="90" viewBox="0 0 80 90" fill="none">
            <path d="M10,0 Q20,20 40,30 Q60,40 50,60 Q40,75 60,90" stroke={formation.color} strokeWidth="3" opacity={0.2} />
            <path d="M10,0 Q20,20 40,30 Q60,40 50,60 Q40,75 60,90" stroke={formation.color} strokeWidth="1.5" opacity={0.4} />
            {/* Mineral nodes */}
            <circle cx="40" cy="30" r="4" fill={formation.color} opacity={0.3} />
            <circle cx="50" cy="60" r="3" fill={formation.color} opacity={0.25} />
            <circle cx="25" cy="15" r="2" fill={formation.color} opacity={0.2} />
            {/* Gold/mineral specks */}
            <circle cx="35" cy="25" r="1" fill="#D4A03C" opacity={0.6} />
            <circle cx="48" cy="50" r="1" fill="#D4A03C" opacity={0.5} />
            <circle cx="55" cy="65" r="1" fill="#D4A03C" opacity={0.4} />
          </svg>
        );
      case "channel":
        return (
          <svg width="100" height="80" viewBox="0 0 100 80" fill="none">
            <path d="M0,40 Q25,20 50,40 T100,40" stroke={formation.color} strokeWidth="8" opacity={0.1} strokeLinecap="round" />
            <path d="M0,40 Q25,20 50,40 T100,40" stroke={formation.color} strokeWidth="4" opacity={0.2} strokeLinecap="round" />
            <path d="M0,40 Q25,20 50,40 T100,40" stroke={formation.color} strokeWidth="1.5" opacity={0.5} strokeLinecap="round" strokeDasharray="4 6">
              <animate attributeName="stroke-dashoffset" values="0;-20" dur="1.5s" repeatCount="indefinite" />
            </path>
            {/* Flow arrows */}
            <path d="M70,36 L78,40 L70,44" stroke={formation.color} strokeWidth="1" opacity={0.4} fill="none" />
            <path d="M30,36 L38,40 L30,44" stroke={formation.color} strokeWidth="1" opacity={0.3} fill="none" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15 }}
      style={{
        position: "relative",
        background: `linear-gradient(180deg, ${C.caveWall}, ${C.deepCave})`,
        borderRadius: 16,
        padding: "32px 28px",
        border: `1px solid ${formation.color}20`,
        overflow: "hidden",
      }}
    >
      {/* Formation SVG decoration */}
      <div style={{ position: "absolute", top: 8, right: 8, opacity: 0.6, pointerEvents: "none" }}>
        <FormationSVG />
      </div>

      {/* Formation label */}
      <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 9, color: formation.color, letterSpacing: 3, textTransform: "uppercase", marginBottom: 16, opacity: 0.7 }}>
        {formation.name}
      </div>

      {/* Title */}
      <h3 style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 20, fontWeight: 700, color: C.mineral, marginBottom: 14, lineHeight: 1.3, position: "relative", zIndex: 1 }}>
        {item.title}
      </h3>

      {/* Body */}
      <p style={{ fontFamily: "var(--font-inter)", fontSize: 13, color: C.limestone, lineHeight: 1.7, opacity: 0.8, position: "relative", zIndex: 1 }}>
        {item.body}
      </p>

      {/* Bottom accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.4 + index * 0.15 }}
        style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${formation.color}60, transparent)`, transformOrigin: "left" }}
      />
    </motion.div>
  );
}

/* ─── Expertise Section ─── */
function ExpertiseSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ position: "relative", padding: "100px 24px", maxWidth: 1100, margin: "0 auto" }}>
      {/* Rock layer divider */}
      <svg width="100%" height="24" viewBox="0 0 1200 24" preserveAspectRatio="none" style={{ position: "absolute", top: 0, left: 0 }}>
        <path d="M0,12 Q100,0 200,12 T400,12 T600,12 T800,12 T1000,12 T1200,12 L1200,24 L0,24Z" fill={C.rockDark} opacity={0.5} />
      </svg>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        style={{ textAlign: "center", marginBottom: 56 }}
      >
        <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, letterSpacing: 4, color: C.stalactite, textTransform: "uppercase", marginBottom: 12 }}>
          Geological Survey
        </div>
        <h2 style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 700, color: C.mineral }}>
          Core <span style={{ color: C.cyan }}>Expertise</span>
        </h2>
      </motion.div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 480px), 1fr))",
          gap: 24,
        }}
      >
        {expertise.map((e, i) => (
          <ExpertiseCard key={i} item={e} index={i} />
        ))}
      </div>
    </section>
  );
}

/* ─── Tools Section — Water Table Diagram ─── */
function ToolsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ position: "relative", padding: "100px 24px", maxWidth: 1000, margin: "0 auto" }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        style={{ textAlign: "center", marginBottom: 56 }}
      >
        <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, letterSpacing: 4, color: C.stalactite, textTransform: "uppercase", marginBottom: 12 }}>
          Water Table Survey
        </div>
        <h2 style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 700, color: C.mineral }}>
          Technology <span style={{ color: C.cyan }}>Strata</span>
        </h2>
      </motion.div>

      {/* Water table diagram layout */}
      <div style={{ position: "relative" }}>
        {/* Vertical depth gauge on left */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 48,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ width: 2, flex: 1, background: `linear-gradient(180deg, ${C.cyan}40, ${C.river}40)`, borderRadius: 1, position: "relative" }}>
            {/* Water table marker */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.5, delay: 0.5 }}
              style={{
                position: "absolute",
                top: "20%",
                left: -12,
                width: 26,
                height: 2,
                background: C.cyan,
                borderRadius: 1,
                transformOrigin: "left",
              }}
            />
            <span
              style={{
                position: "absolute",
                top: "18%",
                left: 20,
                fontFamily: "var(--font-jetbrains)",
                fontSize: 8,
                color: C.cyan,
                whiteSpace: "nowrap",
                letterSpacing: 1,
              }}
            >
              WATER TABLE
            </span>
          </div>
        </div>

        {/* Tool strata layers */}
        <div style={{ marginLeft: 64, display: "flex", flexDirection: "column", gap: 16 }}>
          {tools.map((tool, i) => {
            const depth = DEPTH_LEVELS[i];
            const layerOpacity = 0.9 - i * 0.08;
            const layerBlue = Math.min(255, 46 + i * 20);
            const isWaterTable = i >= 2; /* Below water table at index 2 */

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -40 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                style={{
                  position: "relative",
                  background: isWaterTable
                    ? `linear-gradient(135deg, ${C.caveWall}, ${C.waterDark})`
                    : `linear-gradient(135deg, ${C.caveWall}, ${C.rockDark})`,
                  borderRadius: 12,
                  padding: "20px 24px",
                  border: `1px solid ${isWaterTable ? `rgba(46,203,233,0.15)` : `rgba(100,100,100,0.15)`}`,
                  overflow: "hidden",
                }}
              >
                {/* Layer depth label */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {/* Layer indicator dot */}
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: isWaterTable ? C.cyan : C.stalactite,
                        boxShadow: isWaterTable ? `0 0 8px ${C.cyan}60` : "none",
                      }}
                    />
                    <span style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 15, fontWeight: 600, color: C.mineral }}>
                      {tool.label}
                    </span>
                  </div>
                  <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 9, color: isWaterTable ? C.cyan : C.stalactite, letterSpacing: 1, opacity: 0.7 }}>
                    {depth}
                  </span>
                </div>

                {/* Tool items */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {tool.items.map((item) => (
                    <motion.span
                      key={item}
                      whileHover={{ scale: 1.05, borderColor: `${C.cyan}60` }}
                      style={{
                        fontFamily: "var(--font-jetbrains)",
                        fontSize: 11,
                        color: isWaterTable ? C.drip : C.limestone,
                        background: isWaterTable ? `${C.cyan}10` : `${C.stalactite}15`,
                        border: `1px solid ${isWaterTable ? `${C.cyan}20` : `${C.stalactite}20`}`,
                        padding: "5px 14px",
                        borderRadius: 20,
                        cursor: "default",
                        transition: "all 0.3s",
                      }}
                    >
                      {item}
                    </motion.span>
                  ))}
                </div>

                {/* Water level fill for submerged layers */}
                {isWaterTable && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 1, delay: 0.8 + i * 0.1 }}
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                      background: `linear-gradient(90deg, transparent, ${C.cyan}30, transparent)`,
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Footer Section ─── */
function FooterSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <footer
      ref={ref}
      style={{
        position: "relative",
        padding: "80px 24px 48px",
        overflow: "hidden",
        borderTop: `1px solid ${C.caveWall}`,
      }}
    >
      {/* Underground river flowing animation */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "100%", overflow: "hidden", pointerEvents: "none" }}>
        <svg
          width="200%"
          height="100%"
          viewBox="0 0 2400 200"
          preserveAspectRatio="none"
          style={{ position: "absolute", top: "30%", left: 0, opacity: 0.15 }}
        >
          <defs>
            <linearGradient id="footerRiverGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={C.cyan} stopOpacity={0} />
              <stop offset="25%" stopColor={C.cyan} stopOpacity={0.5} />
              <stop offset="50%" stopColor={C.crystalBlue} stopOpacity={0.5} />
              <stop offset="75%" stopColor={C.cyan} stopOpacity={0.5} />
              <stop offset="100%" stopColor={C.cyan} stopOpacity={0} />
            </linearGradient>
          </defs>
          <path
            d="M0,100 Q200,50 400,100 T800,100 T1200,100 T1600,100 T2000,100 T2400,100"
            stroke="url(#footerRiverGrad)"
            strokeWidth="60"
            fill="none"
            strokeLinecap="round"
          >
            <animate attributeName="d"
              values="M0,100 Q200,50 400,100 T800,100 T1200,100 T1600,100 T2000,100 T2400,100;M0,100 Q200,70 400,100 T800,100 T1200,100 T1600,100 T2000,100 T2400,100;M0,100 Q200,50 400,100 T800,100 T1200,100 T1600,100 T2000,100 T2400,100"
              dur="6s" repeatCount="indefinite" />
          </path>
        </svg>

        {/* Flowing particles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              width: 3 + (i % 3),
              height: 3 + (i % 3),
              borderRadius: "50%",
              background: C.cyan,
              top: `${30 + Math.sin(i) * 20}%`,
              left: `${-10 + i * 10}%`,
              opacity: 0.2 + (i % 4) * 0.1,
            }}
            animate={{ x: ["0vw", "110vw"] }}
            transition={{
              duration: 8 + i * 1.5,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.8,
            }}
          />
        ))}
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
        {/* Deep Waters title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 9, letterSpacing: 5, color: C.stalactite, textTransform: "uppercase", marginBottom: 16 }}>
            From the Depths
          </div>
          <h2 style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 700, color: C.mineral, letterSpacing: "-0.02em" }}>
            DEEP <span style={{ color: C.cyan }}>WATERS</span>
          </h2>
        </motion.div>

        {/* Depth gauge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.8 }}
          style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16, marginTop: 24, marginBottom: 32 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <WaterDrop size={14} color={C.cyan} />
            <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, color: C.cyan, letterSpacing: 2 }}>
              DEPTH: 2,847 FT
            </span>
          </div>
          <span style={{ color: C.stalactite, fontSize: 10 }}>|</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6" stroke={C.cyan} strokeWidth="1" opacity={0.5} />
              <circle cx="7" cy="7" r="3" fill={C.cyan} opacity={0.3} />
            </svg>
            <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, color: C.stalactite, letterSpacing: 2 }}>
              PRESSURE: 1,240 PSI
            </span>
          </div>
        </motion.div>

        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <p style={{ fontFamily: "var(--font-manrope)", fontSize: 14, color: C.limestone, marginBottom: 8, opacity: 0.7 }}>
            Grox Hydrology
          </p>
          <p style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, color: C.stalactite, letterSpacing: 1 }}>
            {new Date().getFullYear()} &middot; Subsurface Engineering Division
          </p>
        </motion.div>

        {/* Bottom drip decoration */}
        <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 32 }}>
          {[0, 0.6, 1.2].map((delay, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, 12, 0], opacity: [0.5, 0.15, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, delay }}
            >
              <WaterDrop size={10} color={C.cyan} />
            </motion.div>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ================================================================
   MAIN PAGE COMPONENT
   ================================================================ */

export default function AquiferPage() {
  return (
    <>
      <style jsx global>{`
        @keyframes aquiferRiverFlow {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes aquiferDrip {
          0% { transform: translateY(0); opacity: 0.8; }
          60% { transform: translateY(40px); opacity: 0.3; }
          80% { transform: translateY(50px); opacity: 0; }
          100% { transform: translateY(0); opacity: 0.8; }
        }

        @keyframes aquiferRipple {
          0% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.3); opacity: 0.1; }
          100% { transform: scale(0.8); opacity: 0.5; }
        }

        @keyframes aquiferCrystalSparkle {
          0%, 100% { opacity: 0.2; filter: brightness(1); }
          50% { opacity: 1; filter: brightness(1.5); }
        }

        @keyframes aquiferFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        @keyframes aquiferWaterShimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes aquiferDepthPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(46,203,233,0.3); }
          50% { box-shadow: 0 0 20px 4px rgba(46,203,233,0.1); }
        }

        @keyframes aquiferFlowDash {
          to { stroke-dashoffset: -40; }
        }

        @keyframes aquiferBubbleRise {
          0% { transform: translateY(0) scale(1); opacity: 0.6; }
          100% { transform: translateY(-80px) scale(0.3); opacity: 0; }
        }

        .aquifer-card:hover {
          border-color: rgba(46,203,233,0.25) !important;
          box-shadow: 0 0 40px rgba(46,203,233,0.08), inset 0 0 30px rgba(46,203,233,0.03);
        }

        .aquifer-card {
          transition: border-color 0.4s, box-shadow 0.4s;
        }

        /* Scrollbar styling */
        .aquifer-page::-webkit-scrollbar {
          width: 6px;
        }
        .aquifer-page::-webkit-scrollbar-track {
          background: ${C.bg};
        }
        .aquifer-page::-webkit-scrollbar-thumb {
          background: ${C.caveWall};
          border-radius: 3px;
        }
        .aquifer-page::-webkit-scrollbar-thumb:hover {
          background: ${C.stalactite};
        }
      `}</style>

      <div
        className="aquifer-page"
        style={{
          minHeight: "100vh",
          background: C.bg,
          color: C.mineral,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient cave wall texture overlay */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            background: `
              radial-gradient(ellipse at 20% 30%, rgba(46,203,233,0.03) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 60%, rgba(26,82,118,0.04) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 90%, rgba(46,203,233,0.02) 0%, transparent 40%)
            `,
          }}
        />

        {/* Bubbles floating up from underground */}
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, overflow: "hidden" }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              style={{
                position: "absolute",
                width: 4 + (i % 3) * 2,
                height: 4 + (i % 3) * 2,
                borderRadius: "50%",
                border: `1px solid ${C.cyan}`,
                opacity: 0,
                left: `${10 + i * 11}%`,
                bottom: -20,
              }}
              animate={{
                y: [0, -window?.innerHeight || -800],
                opacity: [0, 0.3, 0.15, 0],
              }}
              transition={{
                duration: 12 + i * 2,
                repeat: Infinity,
                delay: i * 2.5,
                ease: "linear",
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <HeroSection />

          {/* Cave transition SVG between hero and projects */}
          <div style={{ position: "relative", height: 80, overflow: "hidden" }}>
            <svg width="100%" height="80" viewBox="0 0 1200 80" preserveAspectRatio="none">
              <path
                d="M0,0 Q150,30 300,10 Q450,40 600,15 Q750,35 900,10 Q1050,30 1200,0 L1200,80 L0,80 Z"
                fill={C.rockDark}
                opacity={0.4}
              />
              <path
                d="M0,20 Q100,40 250,25 Q400,50 550,30 Q700,45 850,25 Q1000,40 1200,20 L1200,80 L0,80 Z"
                fill={C.bg}
              />
              {/* Water seepage line */}
              <path
                d="M0,40 Q200,30 400,40 T800,40 T1200,40"
                stroke={C.cyan}
                strokeWidth="0.5"
                fill="none"
                opacity={0.2}
                strokeDasharray="4 8"
              >
                <animate attributeName="stroke-dashoffset" values="0;-24" dur="3s" repeatCount="indefinite" />
              </path>
            </svg>
          </div>

          <ProjectsSection />

          {/* Rock layer transition */}
          <div style={{ position: "relative", height: 60, overflow: "hidden" }}>
            <svg width="100%" height="60" viewBox="0 0 1200 60" preserveAspectRatio="none">
              <path d="M0,0 Q200,20 400,5 Q600,25 800,10 Q1000,20 1200,0 L1200,60 L0,60Z" fill={C.caveWall} opacity={0.3} />
              <path d="M0,15 Q300,30 600,15 Q900,30 1200,15 L1200,60 L0,60Z" fill={C.bg} />
            </svg>
          </div>

          <ExpertiseSection />

          {/* Aquifer layer transition */}
          <div style={{ position: "relative", height: 60, overflow: "hidden" }}>
            <svg width="100%" height="60" viewBox="0 0 1200 60" preserveAspectRatio="none">
              <path d="M0,10 Q150,0 300,15 Q450,5 600,18 Q750,8 900,20 Q1050,10 1200,15 L1200,60 L0,60Z" fill={C.waterDark} opacity={0.2} />
              <path d="M0,25 Q200,15 400,30 Q600,18 800,28 Q1000,15 1200,22 L1200,60 L0,60Z" fill={C.bg} />
              {/* Water table line */}
              <line x1="0" y1="20" x2="1200" y2="20" stroke={C.cyan} strokeWidth="1" opacity={0.1} strokeDasharray="8 12" />
            </svg>
          </div>

          <ToolsSection />

          <FooterSection />
        </div>

        {/* Theme Switcher */}
        <ThemeSwitcher current="/aquifer" variant="dark" />
      </div>
    </>
  );
}
