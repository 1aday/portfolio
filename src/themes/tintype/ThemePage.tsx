"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "@/app/data/projects";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";

/* ─── palette ─── */
const C = {
  bg: "#1A1A18",
  silver: "#C0B8A8",
  sepia: "#8B7355",
  stain: "#4A3C2E",
  rust: "#6B4226",
  highlight: "#E8DCC8",
  vignette: "#0A0A08",
  plate: "#222220",
  plateDark: "#141412",
  warmBlack: "#1E1E1C",
  faintSilver: "rgba(192,184,168,0.08)",
  borderSilver: "rgba(192,184,168,0.15)",
  chemical: "#3A3228",
  tarnish: "#554A3A",
  developer: "#2A2218",
};

/* ─── plate identifiers ─── */
const plateNums = projects.map(
  (_, i) => `PLATE ${String(i + 1).padStart(3, "0")}`
);

/* ─── Victorian ornament chars ─── */
const ornaments = ["✦", "❧", "✠", "❦", "✣", "✤", "❡", "✥", "✧", "❖"];

/* ═══════════════════════════════════════════
   SVG COMPONENTS
   ═══════════════════════════════════════════ */

/* ─── Collodion Drip SVG ─── */
function CollodionDrip({
  width = 120,
  height = 60,
  side = "left",
  color = C.vignette,
  style,
}: {
  width?: number;
  height?: number;
  side?: "left" | "right" | "top" | "bottom";
  color?: string;
  style?: React.CSSProperties;
}) {
  const paths =
    side === "left" || side === "right"
      ? [
          `M0,0 Q${width * 0.3},${height * 0.15} ${width * 0.15},${height * 0.4} Q${width * 0.05},${height * 0.6} ${width * 0.2},${height * 0.75} Q${width * 0.35},${height * 0.9} ${width * 0.1},${height} L0,${height} Z`,
          `M0,${height * 0.1} Q${width * 0.2},${height * 0.25} ${width * 0.08},${height * 0.5} Q${width * 0.15},${height * 0.65} ${width * 0.05},${height * 0.85} L0,${height * 0.85} Z`,
        ]
      : [
          `M0,0 Q${width * 0.1},${height * 0.8} ${width * 0.2},${height * 0.5} Q${width * 0.3},${height * 0.9} ${width * 0.4},${height * 0.3} Q${width * 0.5},${height * 0.7} ${width * 0.6},${height * 0.4} Q${width * 0.7},${height * 0.85} ${width * 0.8},${height * 0.2} Q${width * 0.9},${height * 0.6} ${width},0 Z`,
          `M${width * 0.15},0 Q${width * 0.2},${height * 0.4} ${width * 0.35},${height * 0.6} Q${width * 0.5},${height} ${width * 0.65},${height * 0.5} Q${width * 0.8},${height * 0.3} ${width * 0.85},0 Z`,
        ];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      style={style}
    >
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill={color}
          opacity={0.6 + i * 0.2}
        />
      ))}
    </svg>
  );
}

/* ─── Ornate Oval Frame SVG ─── */
function OrnateOvalFrame({
  width = 300,
  height = 360,
  strokeColor = C.silver,
  children,
  className,
  style,
}: {
  width?: number;
  height?: number;
  strokeColor?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const cx = width / 2;
  const cy = height / 2;
  const rx = width * 0.42;
  const ry = height * 0.42;
  const outerRx = width * 0.46;
  const outerRy = height * 0.46;

  return (
    <div className={`relative ${className || ""}`} style={{ width, height, ...style }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        className="absolute inset-0"
      >
        {/* Outer ornate border */}
        <ellipse cx={cx} cy={cy} rx={outerRx} ry={outerRy} stroke={strokeColor} strokeWidth="1" opacity="0.3" />
        {/* Main frame ellipse */}
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} stroke={strokeColor} strokeWidth="2" opacity="0.6" />
        {/* Inner subtle border */}
        <ellipse cx={cx} cy={cy} rx={rx - 6} ry={ry - 6} stroke={strokeColor} strokeWidth="0.5" opacity="0.25" />

        {/* Victorian corner filigree - top */}
        <path
          d={`M${cx - 20},${cy - ry + 8} Q${cx - 10},${cy - ry - 5} ${cx},${cy - ry + 2} Q${cx + 10},${cy - ry - 5} ${cx + 20},${cy - ry + 8}`}
          stroke={strokeColor}
          strokeWidth="1"
          fill="none"
          opacity="0.5"
        />
        <circle cx={cx} cy={cy - ry - 2} r="2" fill={strokeColor} opacity="0.4" />

        {/* Victorian corner filigree - bottom */}
        <path
          d={`M${cx - 20},${cy + ry - 8} Q${cx - 10},${cy + ry + 5} ${cx},${cy + ry - 2} Q${cx + 10},${cy + ry + 5} ${cx + 20},${cy + ry - 8}`}
          stroke={strokeColor}
          strokeWidth="1"
          fill="none"
          opacity="0.5"
        />
        <circle cx={cx} cy={cy + ry + 2} r="2" fill={strokeColor} opacity="0.4" />

        {/* Left and right filigree */}
        <path
          d={`M${cx - outerRx + 4},${cy - 15} Q${cx - outerRx - 4},${cy} ${cx - outerRx + 4},${cy + 15}`}
          stroke={strokeColor}
          strokeWidth="0.8"
          fill="none"
          opacity="0.35"
        />
        <path
          d={`M${cx + outerRx - 4},${cy - 15} Q${cx + outerRx + 4},${cy} ${cx + outerRx - 4},${cy + 15}`}
          stroke={strokeColor}
          strokeWidth="0.8"
          fill="none"
          opacity="0.35"
        />

        {/* Decorative dots around the oval */}
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i / 24) * Math.PI * 2;
          const dotRx = outerRx + 4;
          const dotRy = outerRy + 4;
          const dotX = cx + dotRx * Math.cos(angle);
          const dotY = cy + dotRy * Math.sin(angle);
          return (
            <circle
              key={i}
              cx={dotX}
              cy={dotY}
              r="0.8"
              fill={strokeColor}
              opacity="0.3"
            />
          );
        })}
      </svg>
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          clipPath: `ellipse(${rx - 8}px ${ry - 8}px at ${cx}px ${cy}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ─── Victorian Corner SVG ─── */
function VictorianCorner({
  position,
  size = 60,
  color = C.silver,
}: {
  position: "tl" | "tr" | "bl" | "br";
  size?: number;
  color?: string;
}) {
  const flip = {
    tl: "",
    tr: `scale(-1,1) translate(-${size},0)`,
    bl: `scale(1,-1) translate(0,-${size})`,
    br: `scale(-1,-1) translate(-${size},-${size})`,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      className="absolute"
      style={{
        top: position.includes("t") ? -2 : "auto",
        bottom: position.includes("b") ? -2 : "auto",
        left: position.includes("l") ? -2 : "auto",
        right: position.includes("r") ? -2 : "auto",
      }}
    >
      <g transform={flip[position]}>
        <path
          d={`M4,4 L${size * 0.4},4 Q${size * 0.25},4 ${size * 0.2},${size * 0.15} L${size * 0.15},${size * 0.2} Q4,${size * 0.25} 4,${size * 0.4} L4,4`}
          stroke={color}
          strokeWidth="1"
          fill="none"
          opacity="0.5"
        />
        <path
          d={`M8,8 Q8,${size * 0.18} ${size * 0.18},8`}
          stroke={color}
          strokeWidth="0.5"
          fill="none"
          opacity="0.35"
        />
        <circle cx="6" cy="6" r="1.5" fill={color} opacity="0.4" />
      </g>
    </svg>
  );
}

/* ─── Chemical Stain SVG ─── */
function ChemicalStain({
  size = 80,
  color = C.stain,
  opacity = 0.15,
  style,
}: {
  size?: number;
  color?: string;
  opacity?: number;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      style={style}
      className="absolute pointer-events-none"
    >
      <path
        d="M20,10 Q35,5 50,12 Q65,18 70,35 Q75,52 60,62 Q48,72 30,68 Q12,64 8,48 Q4,32 20,10 Z"
        fill={color}
        opacity={opacity}
      />
      <path
        d="M30,20 Q42,15 52,25 Q58,35 50,48 Q42,56 28,50 Q18,42 30,20 Z"
        fill={color}
        opacity={opacity * 0.7}
      />
    </svg>
  );
}

/* ─── Camera Obscura SVG ─── */
function CameraObscura({ size = 48, color = C.silver }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Body */}
      <rect x="6" y="14" width="36" height="24" rx="3" stroke={color} strokeWidth="1.2" opacity="0.6" />
      {/* Lens barrel */}
      <circle cx="24" cy="26" r="8" stroke={color} strokeWidth="1.2" opacity="0.6" />
      <circle cx="24" cy="26" r="5" stroke={color} strokeWidth="0.8" opacity="0.4" />
      <circle cx="24" cy="26" r="2" fill={color} opacity="0.3" />
      {/* Viewfinder */}
      <rect x="18" y="10" width="12" height="6" rx="1" stroke={color} strokeWidth="0.8" opacity="0.4" />
      {/* Flash bracket */}
      <line x1="32" y1="10" x2="38" y2="10" stroke={color} strokeWidth="0.8" opacity="0.3" />
      <rect x="36" y="6" width="6" height="8" rx="1" stroke={color} strokeWidth="0.6" opacity="0.3" />
    </svg>
  );
}

/* ─── Plate Holder SVG ─── */
function PlateHolder({ width = 200, color = C.sepia }: { width?: number; color?: string }) {
  const h = width * 0.12;
  return (
    <svg width={width} height={h} viewBox={`0 0 ${width} ${h}`} fill="none">
      <rect x="0" y="0" width={width} height={h} rx="2" stroke={color} strokeWidth="1" opacity="0.3" fill={`${color}11`} />
      <line x1={width * 0.1} y1={h * 0.5} x2={width * 0.9} y2={h * 0.5} stroke={color} strokeWidth="0.5" opacity="0.2" />
      <rect x={width * 0.4} y={h * 0.2} width={width * 0.2} height={h * 0.6} rx="1" stroke={color} strokeWidth="0.5" opacity="0.25" />
    </svg>
  );
}

/* ─── Section Divider ─── */
function TintypeDivider() {
  return (
    <div className="flex items-center justify-center gap-4 py-12">
      <div className="h-px flex-1 max-w-[120px]" style={{ background: `linear-gradient(to right, transparent, ${C.silver}40)` }} />
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="8" stroke={C.silver} strokeWidth="0.8" opacity="0.4" />
        <circle cx="12" cy="12" r="3" fill={C.silver} opacity="0.3" />
        <path d="M12,4 L12,2 M12,22 L12,20 M4,12 L2,12 M22,12 L20,12" stroke={C.silver} strokeWidth="0.5" opacity="0.3" />
      </svg>
      <div className="h-px flex-1 max-w-[120px]" style={{ background: `linear-gradient(to left, transparent, ${C.silver}40)` }} />
    </div>
  );
}

/* ═══════════════════════════════════════════
   SECTION COMPONENTS
   ═══════════════════════════════════════════ */

/* ─── Hero Section ─── */
function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [developed, setDeveloped] = useState(false);

  useEffect(() => {
    if (isInView) {
      const t = setTimeout(() => setDeveloped(true), 600);
      return () => clearTimeout(t);
    }
  }, [isInView]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: C.bg }}
    >
      {/* Full-screen chemical vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, ${C.vignette} 100%)`,
        }}
      />

      {/* Collodion drips - edges */}
      <div className="absolute top-0 left-0 opacity-40">
        <CollodionDrip width={80} height={300} side="left" color={C.vignette} />
      </div>
      <div className="absolute top-0 right-0 opacity-40" style={{ transform: "scaleX(-1)" }}>
        <CollodionDrip width={80} height={300} side="left" color={C.vignette} />
      </div>
      <div className="absolute bottom-0 left-[10%] opacity-30">
        <CollodionDrip width={400} height={50} side="bottom" color={C.vignette} />
      </div>

      {/* Chemical stains */}
      <ChemicalStain size={200} color={C.stain} opacity={0.06} style={{ top: "8%", left: "5%" }} />
      <ChemicalStain size={160} color={C.rust} opacity={0.05} style={{ bottom: "12%", right: "8%" }} />
      <ChemicalStain size={120} color={C.chemical} opacity={0.07} style={{ top: "60%", left: "70%" }} />

      {/* Central composition */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Camera obscura icon */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <CameraObscura size={56} color={C.silver} />
        </motion.div>

        {/* Subtitle above oval */}
        <motion.p
          className="mt-6 tracking-[0.4em] uppercase text-xs"
          style={{ color: C.sepia, fontFamily: "var(--font-inter)" }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.4 }}
        >
          Wet Plate Collodion Process
        </motion.p>

        {/* Large oval matte frame with title */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.6 }}
        >
          <OrnateOvalFrame width={420} height={480} strokeColor={C.silver}>
            <div
              className="w-full h-full flex flex-col items-center justify-center"
              style={{
                background: `radial-gradient(ellipse at center, ${C.plate}ee 0%, ${C.vignette} 80%)`,
              }}
            >
              {/* Developing chemical animation */}
              <motion.div
                className="text-center"
                initial={{ filter: "brightness(0) sepia(1) contrast(0.3)" }}
                animate={
                  developed
                    ? { filter: "brightness(1) sepia(0.3) contrast(1)" }
                    : {}
                }
                transition={{ duration: 3, ease: "easeOut" }}
              >
                <h1
                  className="text-7xl leading-none tracking-tight"
                  style={{
                    fontFamily: "var(--font-dm-serif)",
                    color: C.highlight,
                    textShadow: `0 0 40px ${C.silver}30`,
                  }}
                >
                  TINTYPE
                </h1>
                <div
                  className="mt-3 w-24 h-px mx-auto"
                  style={{ background: `${C.silver}50` }}
                />
                <p
                  className="mt-3 text-sm tracking-[0.25em] uppercase"
                  style={{
                    fontFamily: "var(--font-playfair)",
                    color: C.sepia,
                  }}
                >
                  Portfolio
                </p>
              </motion.div>
            </div>
          </OrnateOvalFrame>
        </motion.div>

        {/* Victorian ornament beneath */}
        <motion.div
          className="mt-6 flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.5 } : {}}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <span style={{ color: C.sepia, fontSize: 10, fontFamily: "var(--font-inter)" }}>
            ❧
          </span>
          <span
            className="text-[10px] tracking-[0.5em] uppercase"
            style={{ color: C.sepia, fontFamily: "var(--font-inter)" }}
          >
            Ferrotype Plates
          </span>
          <span style={{ color: C.sepia, fontSize: 10, fontFamily: "var(--font-inter)" }}>
            ❧
          </span>
        </motion.div>

        {/* Stats as plate numbers */}
        <motion.div
          className="mt-10 flex items-center gap-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <span
                className="text-2xl font-light"
                style={{
                  fontFamily: "var(--font-dm-serif)",
                  color: C.highlight,
                }}
              >
                {stat.value}
              </span>
              <span
                className="text-[9px] tracking-[0.3em] uppercase mt-1"
                style={{
                  fontFamily: "var(--font-inter)",
                  color: C.sepia,
                }}
              >
                {stat.label}
              </span>
              {i < stats.length - 1 && (
                <div
                  className="absolute"
                  style={{
                    right: -20,
                    top: "50%",
                    width: 1,
                    height: 20,
                    background: C.borderSilver,
                  }}
                />
              )}
            </div>
          ))}
        </motion.div>

        {/* Plate holder ornament */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.4 } : {}}
          transition={{ duration: 1, delay: 1.8 }}
        >
          <PlateHolder width={240} color={C.sepia} />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <span
          className="text-[9px] tracking-[0.4em] uppercase"
          style={{ color: `${C.silver}50`, fontFamily: "var(--font-inter)" }}
        >
          Expose
        </span>
        <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
          <rect x="1" y="1" width="10" height="18" rx="5" stroke={C.silver} strokeWidth="0.8" opacity="0.3" />
          <circle cx="6" cy="6" r="1.5" fill={C.silver} opacity="0.4" />
        </svg>
      </motion.div>
    </section>
  );
}

/* ─── Tintype Project Card ─── */
function TintypeCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      className="relative group"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay: index * 0.08, ease: "easeOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative overflow-hidden"
        style={{
          background: C.plateDark,
          border: `1px solid ${C.borderSilver}`,
          borderRadius: 4,
        }}
      >
        {/* Victorian corners */}
        <VictorianCorner position="tl" size={40} color={C.silver} />
        <VictorianCorner position="tr" size={40} color={C.silver} />
        <VictorianCorner position="bl" size={40} color={C.silver} />
        <VictorianCorner position="br" size={40} color={C.silver} />

        {/* Plate number label */}
        <div
          className="absolute top-3 left-3 z-10"
          style={{
            fontFamily: "var(--font-jetbrains)",
            fontSize: 9,
            color: C.sepia,
            letterSpacing: "0.15em",
            opacity: 0.6,
          }}
        >
          {plateNums[index]}
        </div>

        {/* Year stamp */}
        <div
          className="absolute top-3 right-3 z-10"
          style={{
            fontFamily: "var(--font-jetbrains)",
            fontSize: 9,
            color: C.sepia,
            letterSpacing: "0.1em",
            opacity: 0.5,
          }}
        >
          {project.year}
        </div>

        {/* Content area with oval matte */}
        <div className="pt-10 pb-4 px-6">
          {/* Oval-matted image area */}
          <div className="relative mx-auto" style={{ width: "100%", paddingTop: "70%" }}>
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background: `radial-gradient(ellipse 60% 55% at 50% 50%, ${C.warmBlack} 0%, ${C.vignette} 70%)`,
                clipPath: isEven
                  ? "ellipse(45% 42% at 50% 50%)"
                  : "inset(5% round 2px)",
              }}
            >
              {/* Project title inside the matte */}
              <div className="text-center px-4">
                <motion.h3
                  className="text-xl leading-tight whitespace-pre-line"
                  style={{
                    fontFamily: "var(--font-dm-serif)",
                    color: hovered ? C.highlight : C.silver,
                    transition: "color 1.2s ease",
                  }}
                >
                  {project.title}
                </motion.h3>
                <motion.p
                  className="mt-2 text-[10px] tracking-[0.2em] uppercase"
                  style={{
                    fontFamily: "var(--font-inter)",
                    color: C.sepia,
                  }}
                >
                  {project.client}
                </motion.p>
              </div>
            </div>

            {/* Vignette overlay on the plate */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse 80% 75% at 50% 50%, transparent 40%, ${C.vignette}cc 100%)`,
              }}
            />

            {/* Chemical drip marks on edges */}
            <div className="absolute -bottom-1 left-[15%] opacity-25">
              <CollodionDrip width={60} height={20} side="bottom" color={C.stain} />
            </div>
            <div className="absolute -bottom-1 right-[20%] opacity-20">
              <CollodionDrip width={40} height={15} side="bottom" color={C.chemical} />
            </div>
          </div>

          {/* Victorian label beneath matte */}
          <div className="mt-4 text-center">
            <div
              className="inline-block px-4 py-1"
              style={{
                borderTop: `1px solid ${C.borderSilver}`,
                borderBottom: `1px solid ${C.borderSilver}`,
              }}
            >
              <span
                className="text-[10px] tracking-[0.3em] uppercase"
                style={{
                  fontFamily: "var(--font-playfair)",
                  color: C.sepia,
                }}
              >
                {ornaments[index % ornaments.length]}&ensp;{project.client}&ensp;{ornaments[index % ornaments.length]}
              </span>
            </div>
          </div>
        </div>

        {/* Description area */}
        <div
          className="px-6 pb-4"
          style={{ borderTop: `1px solid ${C.faintSilver}` }}
        >
          <p
            className="mt-3 text-xs leading-relaxed"
            style={{
              fontFamily: "var(--font-inter)",
              color: `${C.silver}bb`,
            }}
          >
            {project.description}
          </p>
        </div>

        {/* Tech & link footer */}
        <div
          className="px-6 pb-5 pt-2 flex items-center justify-between gap-3"
          style={{ borderTop: `1px solid ${C.faintSilver}` }}
        >
          <div className="flex flex-wrap gap-1.5">
            {project.tech.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 text-[9px] tracking-wider uppercase"
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  color: C.sepia,
                  background: `${C.stain}44`,
                  border: `1px solid ${C.borderSilver}`,
                  borderRadius: 2,
                }}
              >
                {t}
              </span>
            ))}
          </div>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 text-[9px] tracking-[0.2em] uppercase transition-colors duration-500"
            style={{
              fontFamily: "var(--font-inter)",
              color: hovered ? C.highlight : C.sepia,
              borderBottom: `1px solid ${hovered ? C.highlight : C.sepia}40`,
            }}
          >
            View Plate &rarr;
          </a>
        </div>

        {/* Silver toning hover effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${C.silver}05 0%, transparent 50%, ${C.silver}08 100%)`,
          }}
          animate={{
            opacity: hovered ? 1 : 0,
          }}
          transition={{ duration: 1.2 }}
        />

        {/* Chemical stain decoration */}
        {index % 3 === 0 && (
          <ChemicalStain
            size={60}
            color={C.rust}
            opacity={0.08}
            style={{ bottom: 10, right: 10 }}
          />
        )}
      </div>
    </motion.div>
  );
}

/* ─── Projects Section ─── */
function ProjectsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="projects"
      ref={ref}
      className="relative py-24 px-6"
      style={{ background: C.bg }}
    >
      {/* Subtle plate-edge texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${C.stain}08, transparent)`,
        }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span
            className="text-[10px] tracking-[0.5em] uppercase"
            style={{ color: C.sepia, fontFamily: "var(--font-inter)" }}
          >
            Collection of Works
          </span>
          <h2
            className="mt-3 text-4xl"
            style={{
              fontFamily: "var(--font-dm-serif)",
              color: C.highlight,
            }}
          >
            Exposed Plates
          </h2>
          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="h-px w-16" style={{ background: `${C.sepia}40` }} />
            <span style={{ color: C.sepia, opacity: 0.5, fontSize: 12 }}>◫</span>
            <div className="h-px w-16" style={{ background: `${C.sepia}40` }} />
          </div>
        </motion.div>

        {/* Project grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, i) => (
            <TintypeCard key={i} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Expertise Daguerreotype Frame ─── */
function ExpertiseFrame({
  item,
  index,
}: {
  item: (typeof expertise)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);

  const frameIcons = ["✦", "✠", "❖", "✣"];

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <OrnateOvalFrame
        width={260}
        height={300}
        strokeColor={hovered ? C.highlight : C.silver}
        style={{ transition: "all 0.6s ease" }}
      >
        <div
          className="w-full h-full flex flex-col items-center justify-center p-8"
          style={{
            background: `radial-gradient(ellipse at center, ${C.plate} 0%, ${C.vignette} 85%)`,
          }}
        >
          {/* Ornament icon */}
          <motion.span
            className="text-2xl mb-3"
            style={{ color: C.silver, opacity: 0.6 }}
            animate={{ opacity: hovered ? 0.9 : 0.6 }}
            transition={{ duration: 0.6 }}
          >
            {frameIcons[index]}
          </motion.span>

          {/* Title */}
          <h3
            className="text-base text-center leading-snug"
            style={{
              fontFamily: "var(--font-dm-serif)",
              color: hovered ? C.highlight : C.silver,
              transition: "color 0.8s ease",
            }}
          >
            {item.title}
          </h3>

          {/* Description */}
          <p
            className="mt-3 text-[10px] leading-relaxed text-center"
            style={{
              fontFamily: "var(--font-inter)",
              color: `${C.silver}99`,
            }}
          >
            {item.body.split(" ").slice(0, 20).join(" ")}...
          </p>
        </div>
      </OrnateOvalFrame>

      {/* Victorian label beneath */}
      <motion.div
        className="mt-4 text-center"
        animate={{ opacity: hovered ? 1 : 0.6 }}
        transition={{ duration: 0.5 }}
      >
        <p
          className="text-[9px] tracking-[0.4em] uppercase"
          style={{
            fontFamily: "var(--font-inter)",
            color: C.sepia,
          }}
        >
          {`${String(index + 1).padStart(2, "0")}. ${item.title}`}
        </p>
      </motion.div>
    </motion.div>
  );
}

/* ─── Expertise Section ─── */
function ExpertiseSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="expertise"
      ref={ref}
      className="relative py-24 px-6"
      style={{
        background: `linear-gradient(180deg, ${C.bg} 0%, ${C.plateDark} 50%, ${C.bg} 100%)`,
      }}
    >
      {/* Chemical exposure vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 50%, transparent, ${C.vignette}60)`,
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span
            className="text-[10px] tracking-[0.5em] uppercase"
            style={{ color: C.sepia, fontFamily: "var(--font-inter)" }}
          >
            Fields of Expertise
          </span>
          <h2
            className="mt-3 text-4xl"
            style={{
              fontFamily: "var(--font-dm-serif)",
              color: C.highlight,
            }}
          >
            Daguerreotype Gallery
          </h2>
          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="h-px w-16" style={{ background: `${C.sepia}40` }} />
            <span style={{ color: C.sepia, opacity: 0.5, fontSize: 12 }}>✠</span>
            <div className="h-px w-16" style={{ background: `${C.sepia}40` }} />
          </div>
        </motion.div>

        {/* Four daguerreotype frames */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {expertise.map((item, i) => (
            <ExpertiseFrame key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Chemical Tray (single tool category) ─── */
function ChemicalTray({
  tool,
  index,
}: {
  tool: (typeof tools)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [hovered, setHovered] = useState(false);

  const trayColors = [C.stain, C.chemical, C.sepia, C.rust, C.tarnish, C.developer];

  return (
    <motion.div
      ref={ref}
      className="relative"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Tray container */}
      <div
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${trayColors[index]}22 0%, ${C.plateDark} 100%)`,
          border: `1px solid ${C.borderSilver}`,
          borderRadius: 3,
          padding: "20px 18px 16px",
        }}
      >
        {/* Tray rim effect */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            background: `linear-gradient(90deg, ${C.borderSilver}, ${trayColors[index]}66, ${C.borderSilver})`,
          }}
        />

        {/* Chemical liquid level */}
        <motion.div
          className="absolute bottom-0 left-0 right-0"
          style={{
            background: `linear-gradient(180deg, transparent, ${trayColors[index]}15)`,
            height: "40%",
          }}
          animate={{
            height: hovered ? "55%" : "40%",
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />

        {/* Label */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            {/* Bottle icon */}
            <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
              <rect x="5" y="0" width="6" height="4" rx="1" stroke={C.silver} strokeWidth="0.6" opacity="0.4" />
              <path
                d="M5,4 L3,8 L3,22 Q3,23 4,23 L12,23 Q13,23 13,22 L13,8 L11,4"
                stroke={C.silver}
                strokeWidth="0.8"
                fill={`${trayColors[index]}33`}
                opacity="0.5"
              />
              <rect x="4" y="12" width="8" height="6" rx="0.5" fill={C.silver} opacity="0.15" />
            </svg>
            <span
              className="text-[10px] tracking-[0.3em] uppercase"
              style={{
                fontFamily: "var(--font-playfair)",
                color: hovered ? C.highlight : C.sepia,
                transition: "color 0.5s ease",
              }}
            >
              {tool.label}
            </span>
          </div>

          {/* Items as chemical labels */}
          <div className="flex flex-wrap gap-1.5">
            {tool.items.map((item, j) => (
              <motion.span
                key={item}
                className="px-2.5 py-1 text-[10px]"
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  color: `${C.silver}cc`,
                  background: `${C.stain}33`,
                  border: `1px solid ${C.borderSilver}`,
                  borderRadius: 2,
                  letterSpacing: "0.05em",
                }}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: index * 0.1 + j * 0.06, duration: 0.5 }}
              >
                {item}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Chemical stain on some trays */}
        {index % 2 === 0 && (
          <ChemicalStain
            size={50}
            color={trayColors[index]}
            opacity={0.12}
            style={{ top: 5, right: 5 }}
          />
        )}
      </div>
    </motion.div>
  );
}

/* ─── Tools Section ─── */
function ToolsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="tools"
      ref={ref}
      className="relative py-24 px-6"
      style={{ background: C.bg }}
    >
      {/* Top drip effect */}
      <div className="absolute top-0 left-[20%] opacity-15">
        <CollodionDrip width={300} height={40} side="bottom" color={C.stain} />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span
            className="text-[10px] tracking-[0.5em] uppercase"
            style={{ color: C.sepia, fontFamily: "var(--font-inter)" }}
          >
            Darkroom Chemicals
          </span>
          <h2
            className="mt-3 text-4xl"
            style={{
              fontFamily: "var(--font-dm-serif)",
              color: C.highlight,
            }}
          >
            Developer Trays
          </h2>
          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="h-px w-16" style={{ background: `${C.sepia}40` }} />
            <span style={{ color: C.sepia, opacity: 0.5, fontSize: 12 }}>❖</span>
            <div className="h-px w-16" style={{ background: `${C.sepia}40` }} />
          </div>
        </motion.div>

        {/* Chemical tray grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, i) => (
            <ChemicalTray key={i} tool={tool} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Footer Section ─── */
function FooterSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <footer
      id="contact"
      ref={ref}
      className="relative py-24 px-6 overflow-hidden"
      style={{ background: C.vignette }}
    >
      {/* Darkroom safe-light glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 50% 60% at 50% 40%, ${C.rust}12, transparent)`,
        }}
      />

      {/* Edge drips */}
      <div className="absolute top-0 left-[5%] opacity-20">
        <CollodionDrip width={200} height={35} side="bottom" color={C.stain} />
      </div>
      <div className="absolute top-0 right-[15%] opacity-15">
        <CollodionDrip width={150} height={30} side="bottom" color={C.chemical} />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Safe-light glow text */}
          <motion.p
            className="text-[10px] tracking-[0.6em] uppercase mb-6"
            style={{
              fontFamily: "var(--font-inter)",
              color: C.rust,
            }}
            animate={{
              opacity: [0.5, 0.8, 0.5],
              textShadow: [
                `0 0 10px ${C.rust}40`,
                `0 0 20px ${C.rust}60`,
                `0 0 10px ${C.rust}40`,
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            Exposed &amp; Developed
          </motion.p>

          {/* Photographer stamp */}
          <div
            className="inline-block px-8 py-5 relative"
            style={{
              border: `2px solid ${C.sepia}40`,
              borderRadius: 4,
            }}
          >
            {/* Stamp corners */}
            <VictorianCorner position="tl" size={30} color={C.sepia} />
            <VictorianCorner position="tr" size={30} color={C.sepia} />
            <VictorianCorner position="bl" size={30} color={C.sepia} />
            <VictorianCorner position="br" size={30} color={C.sepia} />

            <div className="flex flex-col items-center gap-2">
              <CameraObscura size={36} color={C.sepia} />
              <h3
                className="text-2xl tracking-tight"
                style={{
                  fontFamily: "var(--font-dm-serif)",
                  color: C.highlight,
                }}
              >
                Grox Tintype Studio
              </h3>
              <div
                className="w-20 h-px"
                style={{ background: `${C.sepia}50` }}
              />
              <p
                className="text-[9px] tracking-[0.4em] uppercase"
                style={{
                  fontFamily: "var(--font-inter)",
                  color: C.sepia,
                }}
              >
                Ferrotypes &amp; Ambrotypes
              </p>
            </div>
          </div>

          {/* Victorian ornament */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <div className="h-px w-20" style={{ background: `${C.sepia}30` }} />
            <span style={{ color: C.sepia, opacity: 0.4, fontSize: 14 }}>❧</span>
            <div className="h-px w-20" style={{ background: `${C.sepia}30` }} />
          </div>

          {/* Copyright as plate inscription */}
          <p
            className="mt-6 text-[9px] tracking-[0.3em] uppercase"
            style={{
              fontFamily: "var(--font-jetbrains)",
              color: `${C.sepia}80`,
            }}
          >
            &copy; {new Date().getFullYear()} &mdash; All Plates Reserved
          </p>

          {/* Chemical formula ornament */}
          <p
            className="mt-3 text-[8px] tracking-[0.2em]"
            style={{
              fontFamily: "var(--font-jetbrains)",
              color: `${C.sepia}50`,
            }}
          >
            AgNO&#8323; + KCN &rarr; AgCN + KNO&#8323;
          </p>
        </motion.div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════ */

export default function TintypePage() {
  return (
    <div
      className="relative min-h-screen tintype-page"
      style={{ background: C.bg, color: C.silver }}
    >
      <style>{`
        /* ─── Tintype Keyframes ─── */

        @keyframes tintype-develop {
          0% {
            filter: brightness(0) sepia(1) contrast(0.2);
            opacity: 0;
          }
          30% {
            filter: brightness(0.3) sepia(0.8) contrast(0.5);
            opacity: 0.4;
          }
          70% {
            filter: brightness(0.7) sepia(0.5) contrast(0.8);
            opacity: 0.8;
          }
          100% {
            filter: brightness(1) sepia(0.2) contrast(1);
            opacity: 1;
          }
        }

        @keyframes tintype-silver-tone {
          0% {
            filter: sepia(0.4) brightness(0.9);
          }
          50% {
            filter: sepia(0) brightness(1.05) saturate(0.3);
          }
          100% {
            filter: sepia(0.4) brightness(0.9);
          }
        }

        @keyframes tintype-vignette-pulse {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes tintype-drip-flow {
          0% {
            transform: translateY(-10px);
            opacity: 0;
          }
          20% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(0);
            opacity: 0.3;
          }
        }

        @keyframes tintype-border-draw {
          0% {
            stroke-dashoffset: 1000;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        @keyframes tintype-plate-emerge {
          0% {
            transform: translateY(20px) scale(0.95);
            opacity: 0;
            filter: brightness(0) sepia(1);
          }
          60% {
            filter: brightness(0.6) sepia(0.6);
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
            filter: brightness(1) sepia(0.15);
          }
        }

        @keyframes tintype-safe-light {
          0%, 100% {
            opacity: 0.4;
            filter: brightness(0.8);
          }
          50% {
            opacity: 0.7;
            filter: brightness(1.2);
          }
        }

        @keyframes tintype-chemical-bubble {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-8px) scale(1.2);
            opacity: 0.5;
          }
          100% {
            transform: translateY(-16px) scale(0.8);
            opacity: 0;
          }
        }

        @keyframes tintype-tarnish-spread {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        /* ─── Global Tintype Styles ─── */

        .tintype-page {
          cursor: default;
        }

        .tintype-page *::selection {
          background: ${C.sepia}44;
          color: ${C.highlight};
        }

        .tintype-page ::-webkit-scrollbar {
          width: 6px;
        }

        .tintype-page ::-webkit-scrollbar-track {
          background: ${C.vignette};
        }

        .tintype-page ::-webkit-scrollbar-thumb {
          background: ${C.stain};
          border-radius: 3px;
        }

        .tintype-page ::-webkit-scrollbar-thumb:hover {
          background: ${C.sepia};
        }

        /* Plate card hover silver-toning */
        .tintype-page .group:hover {
          animation: tintype-silver-tone 3s ease-in-out;
        }

        /* Vignette pulse on sections */
        .tintype-vignette-pulse {
          animation: tintype-vignette-pulse 5s ease-in-out infinite;
        }

        /* Drip animation */
        .tintype-drip-animate {
          animation: tintype-drip-flow 2s ease-out forwards;
        }

        /* Safe light glow */
        .tintype-safe-light {
          animation: tintype-safe-light 3s ease-in-out infinite;
        }

        /* Chemical bubble effect */
        .tintype-bubble {
          animation: tintype-chemical-bubble 2s ease-in-out infinite;
        }

        /* Film grain overlay for entire page */
        .tintype-page::before {
          content: "";
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 9999;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 256px 256px;
        }

        /* Chemical tray liquid wobble */
        @keyframes tintype-liquid-wobble {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-2px);
          }
          75% {
            transform: translateX(2px);
          }
        }

        /* Plate card develop-on-scroll */
        .tintype-plate-enter {
          animation: tintype-plate-emerge 1.5s ease-out forwards;
        }
      `}</style>

      <HeroSection />
      <TintypeDivider />
      <ProjectsSection />
      <TintypeDivider />
      <ExpertiseSection />
      <TintypeDivider />
      <ToolsSection />
      <FooterSection />

      <ThemeSwitcher current="/tintype" variant="dark" />
    </div>
  );
}
