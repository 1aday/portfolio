"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "@/app/data/projects";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";
import { getProjectImage } from "@/lib/theme-images";

/* ─── Color Palette ─── */
const C = {
  bg: "#1A1A3E",
  bgDeep: "#0F0F2A",
  terracotta: "#C4451C",
  terracottaGlow: "rgba(196,69,28,0.35)",
  gold: "#DAA520",
  goldGlow: "rgba(218,165,32,0.3)",
  turquoise: "#2EC4B6",
  turquoiseGlow: "rgba(46,196,182,0.25)",
  saffron: "#F5B041",
  saffronGlow: "rgba(245,176,65,0.3)",
  sand: "#D4A574",
  sandMuted: "rgba(212,165,116,0.15)",
  white: "#FFFFFF",
  whiteMuted: "rgba(255,255,255,0.7)",
  whiteGhost: "rgba(255,255,255,0.08)",
  whiteLight: "rgba(255,255,255,0.12)",
  midnight: "#0A2463",
  shadow: "rgba(0,0,0,0.4)",
};

const stallColors = [
  "#1E1E4A", "#201A3A", "#1A2440", "#221833",
  "#1C2238", "#1F1A42", "#1A1E44", "#201838",
  "#1E1C3E", "#1C2040",
];

const accentCycle = [C.terracotta, C.turquoise, C.gold, C.saffron];
const glowCycle = [C.terracottaGlow, C.turquoiseGlow, C.goldGlow, C.saffronGlow];

/* ═══════════════════════════════════════════════════════════
   SVG DECORATIONS
   ═══════════════════════════════════════════════════════════ */

/* ─── Horseshoe / Moorish Arch ─── */
function HorseshoeArch({
  width = 300,
  height = 360,
  strokeColor = C.gold,
  fillColor = "none",
  strokeWidth = 2.5,
  className = "",
}: {
  width?: number;
  height?: number;
  strokeColor?: string;
  fillColor?: string;
  strokeWidth?: number;
  className?: string;
}) {
  const w = width;
  const h = height;
  const cx = w / 2;
  const archRadius = w * 0.44;
  const archTop = h * 0.12;
  const archBottom = h * 0.55;
  const pillarWidth = w * 0.08;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className={className}>
      {/* Outer horseshoe arch — extends past semicircle */}
      <path
        d={`
          M ${cx - archRadius} ${archBottom}
          L ${cx - archRadius} ${archBottom}
          A ${archRadius} ${archRadius * 1.05} 0 1 1 ${cx + archRadius} ${archBottom}
          L ${cx + archRadius} ${h}
          L ${cx - archRadius} ${h}
          Z
        `}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
      {/* Inner arch line */}
      <path
        d={`
          M ${cx - archRadius + 10} ${archBottom}
          A ${archRadius - 10} ${(archRadius - 10) * 1.05} 0 1 1 ${cx + archRadius - 10} ${archBottom}
        `}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth * 0.5}
        strokeOpacity={0.4}
      />
      {/* Left pillar capital */}
      <rect
        x={cx - archRadius - pillarWidth / 2}
        y={archBottom - 4}
        width={pillarWidth + 10}
        height={8}
        fill={strokeColor}
        fillOpacity={0.6}
        rx={2}
      />
      {/* Right pillar capital */}
      <rect
        x={cx + archRadius - pillarWidth / 2 - 5}
        y={archBottom - 4}
        width={pillarWidth + 10}
        height={8}
        fill={strokeColor}
        fillOpacity={0.6}
        rx={2}
      />
      {/* Keystone */}
      <path
        d={`M ${cx - 8} ${archTop + archRadius * 0.02 - 2} L ${cx} ${archTop - 6} L ${cx + 8} ${archTop + archRadius * 0.02 - 2} Z`}
        fill={strokeColor}
        fillOpacity={0.5}
      />
    </svg>
  );
}

/* ─── Hanging Moroccan Lantern (Star shaped) ─── */
function Lantern({
  size = 60,
  color = C.saffron,
  glowColor = C.saffronGlow,
  delay = 0,
}: {
  size?: number;
  color?: string;
  glowColor?: string;
  delay?: number;
}) {
  const s = size;
  const cx = s / 2;
  const cy = s * 0.55;
  const r = s * 0.28;

  // 8-point star
  const starPoints: string[] = [];
  for (let i = 0; i < 16; i++) {
    const angle = (i * 360) / 16 - 90;
    const rad = (angle * Math.PI) / 180;
    const pr = i % 2 === 0 ? r : r * 0.55;
    starPoints.push(`${cx + pr * Math.cos(rad)},${cy + pr * Math.sin(rad)}`);
  }

  return (
    <motion.svg
      width={s}
      height={s}
      viewBox={`0 0 ${s} ${s}`}
      animate={{ rotate: [0, 2, -2, 0] }}
      transition={{ duration: 4, repeat: Infinity, delay, ease: "easeInOut" }}
      style={{ filter: `drop-shadow(0 0 12px ${glowColor})`, transformOrigin: `${cx}px 0px` }}
    >
      {/* Chain */}
      <line x1={cx} y1={0} x2={cx} y2={cy - r - 6} stroke={color} strokeWidth={1.2} strokeOpacity={0.5} />
      {/* Top cap */}
      <path
        d={`M ${cx - 6} ${cy - r - 6} Q ${cx} ${cy - r - 12} ${cx + 6} ${cy - r - 6}`}
        fill={color}
        fillOpacity={0.7}
      />
      {/* Star body */}
      <polygon
        points={starPoints.join(" ")}
        fill={color}
        fillOpacity={0.25}
        stroke={color}
        strokeWidth={1.2}
      />
      {/* Inner glow */}
      <circle cx={cx} cy={cy} r={r * 0.4} fill={color} fillOpacity={0.5}>
        <animate attributeName="fillOpacity" values="0.5;0.8;0.5" dur="3s" repeatCount="indefinite" begin={`${delay}s`} />
      </circle>
      {/* Outer glow */}
      <circle cx={cx} cy={cy} r={r * 0.7} fill={glowColor} fillOpacity={0.15}>
        <animate attributeName="r" values={`${r * 0.65};${r * 0.8};${r * 0.65}`} dur="3s" repeatCount="indefinite" begin={`${delay}s`} />
      </circle>
      {/* Bottom finial */}
      <circle cx={cx} cy={cy + r + 5} r={2.5} fill={color} fillOpacity={0.6} />
      <line x1={cx} y1={cy + r} x2={cx} y2={cy + r + 4} stroke={color} strokeWidth={1} strokeOpacity={0.5} />
    </motion.svg>
  );
}

/* ─── Zellige Tile Star Pattern ─── */
function ZelligeStar({ size = 40, color = C.gold, opacity = 0.3 }: { size?: number; color?: string; opacity?: number }) {
  const s = size;
  const cx = s / 2;
  const cy = s / 2;
  const r = s * 0.4;

  // 8-point star via two overlapping squares
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{ opacity }}>
      <rect
        x={cx - r * 0.7}
        y={cy - r * 0.7}
        width={r * 1.4}
        height={r * 1.4}
        fill="none"
        stroke={color}
        strokeWidth={1}
        transform={`rotate(0 ${cx} ${cy})`}
      />
      <rect
        x={cx - r * 0.7}
        y={cy - r * 0.7}
        width={r * 1.4}
        height={r * 1.4}
        fill="none"
        stroke={color}
        strokeWidth={1}
        transform={`rotate(45 ${cx} ${cy})`}
      />
      <circle cx={cx} cy={cy} r={r * 0.2} fill={color} fillOpacity={0.4} />
    </svg>
  );
}

/* ─── Zellige Border Strip ─── */
function ZelligeBorder({ width = 800, height = 24, color = C.gold }: { width?: number; height?: number; color?: string }) {
  const tileCount = Math.floor(width / height);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block", margin: "0 auto", maxWidth: "100%" }}>
      {Array.from({ length: tileCount }).map((_, i) => {
        const x = i * height + height / 2;
        const y = height / 2;
        const r = height * 0.35;
        return (
          <g key={i}>
            <rect
              x={x - r * 0.6}
              y={y - r * 0.6}
              width={r * 1.2}
              height={r * 1.2}
              fill="none"
              stroke={color}
              strokeWidth={0.8}
              strokeOpacity={0.35}
              transform={`rotate(45 ${x} ${y})`}
            />
            {i % 3 === 0 && (
              <circle cx={x} cy={y} r={r * 0.2} fill={color} fillOpacity={0.25} />
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ─── Arabesque Ornament ─── */
function Arabesque({ size = 100, color = C.gold }: { size?: number; color?: string }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{ opacity: 0.15 }}>
      {/* Interlocking arcs */}
      <circle cx={s / 2} cy={s / 2} r={s * 0.35} fill="none" stroke={color} strokeWidth={1.5} />
      <circle cx={s / 2} cy={s / 2} r={s * 0.22} fill="none" stroke={color} strokeWidth={1} />
      {[0, 60, 120, 180, 240, 300].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = s / 2 + s * 0.22 * Math.cos(rad);
        const y1 = s / 2 + s * 0.22 * Math.sin(rad);
        const x2 = s / 2 + s * 0.35 * Math.cos(rad);
        const y2 = s / 2 + s * 0.35 * Math.sin(rad);
        return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} />;
      })}
      {[0, 90, 180, 270].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const cx = s / 2 + s * 0.28 * Math.cos(rad);
        const cy = s / 2 + s * 0.28 * Math.sin(rad);
        return <circle key={deg} cx={cx} cy={cy} r={s * 0.06} fill="none" stroke={color} strokeWidth={0.8} />;
      })}
    </svg>
  );
}

/* ─── Crescent Moon ─── */
function CrescentMoon({ size = 36, color = C.saffron }: { size?: number; color?: string }) {
  const r = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={r} cy={r} r={r * 0.7} fill={color} fillOpacity={0.8} />
      <circle cx={r + r * 0.3} cy={r - r * 0.1} r={r * 0.55} fill={C.bg} />
    </svg>
  );
}

/* ─── Geometric Islamic Border (Horizontal divider) ─── */
function IslamicDivider() {
  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center", padding: "48px 0" }}>
      <svg width="700" height="40" viewBox="0 0 700 40" style={{ maxWidth: "90%" }}>
        {/* Central diamond */}
        <polygon points="350,2 365,20 350,38 335,20" fill="none" stroke={C.gold} strokeWidth={1.5} strokeOpacity={0.5} />
        <polygon points="350,8 359,20 350,32 341,20" fill={C.gold} fillOpacity={0.15} />
        {/* Left line */}
        <line x1="0" y1="20" x2="330" y2="20" stroke={C.gold} strokeWidth={0.8} strokeOpacity={0.25} />
        {/* Right line */}
        <line x1="370" y1="20" x2="700" y2="20" stroke={C.gold} strokeWidth={0.8} strokeOpacity={0.25} />
        {/* Left diamonds */}
        {[100, 200, 500, 600].map((x) => (
          <polygon key={x} points={`${x},12 ${x + 8},20 ${x},28 ${x - 8},20`} fill="none" stroke={C.gold} strokeWidth={0.8} strokeOpacity={0.2} />
        ))}
        {/* Small dots */}
        {[50, 150, 250, 450, 550, 650].map((x) => (
          <circle key={x} cx={x} cy={20} r={1.5} fill={C.gold} fillOpacity={0.3} />
        ))}
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SCROLL REVEAL
   ═══════════════════════════════════════════════════════════ */
function Reveal({
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
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      style={style}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════════════════════════ */
function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <section
      ref={ref}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        background: `radial-gradient(ellipse at 50% 30%, #2A2260 0%, ${C.bg} 50%, ${C.bgDeep} 100%)`,
        padding: "80px 24px 60px",
      }}
    >
      {/* Background zellige pattern overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 25% 25%, ${C.goldGlow} 0%, transparent 2%),
            radial-gradient(circle at 75% 75%, ${C.terracottaGlow} 0%, transparent 2%),
            radial-gradient(circle at 50% 50%, ${C.turquoiseGlow} 0%, transparent 1.5%)
          `,
          backgroundSize: "80px 80px, 120px 120px, 60px 60px",
          opacity: 0.3,
          pointerEvents: "none",
        }}
      />

      {/* Arabesque corners */}
      <div style={{ position: "absolute", top: 20, left: 20 }}>
        <Arabesque size={120} color={C.gold} />
      </div>
      <div style={{ position: "absolute", top: 20, right: 20, transform: "scaleX(-1)" }}>
        <Arabesque size={120} color={C.gold} />
      </div>

      {/* Hanging lanterns - left side */}
      <div style={{ position: "absolute", top: 0, left: "8%", display: "flex", gap: "40px" }}>
        <Lantern size={55} color={C.saffron} glowColor={C.saffronGlow} delay={0} />
        <Lantern size={45} color={C.gold} glowColor={C.goldGlow} delay={0.8} />
      </div>
      {/* Hanging lanterns - right side */}
      <div style={{ position: "absolute", top: 0, right: "8%", display: "flex", gap: "40px" }}>
        <Lantern size={45} color={C.gold} glowColor={C.goldGlow} delay={0.4} />
        <Lantern size={55} color={C.saffron} glowColor={C.saffronGlow} delay={1.2} />
      </div>

      {/* Crescent moon */}
      <motion.div
        style={{ position: "absolute", top: "6%", right: "18%" }}
        initial={{ opacity: 0, y: -20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.5, delay: 0.8 }}
      >
        <CrescentMoon size={40} color={C.saffron} />
      </motion.div>

      {/* Main horseshoe arch framing the title */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <HorseshoeArch
          width={480}
          height={500}
          strokeColor={C.gold}
          strokeWidth={2.5}
        />

        {/* Title inside the arch */}
        <div
          style={{
            position: "absolute",
            top: "18%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
          }}
        >
          {/* Icon */}
          <motion.span
            style={{
              fontSize: "2rem",
              color: C.gold,
              filter: `drop-shadow(0 0 8px ${C.goldGlow})`,
            }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            &#x27E1;
          </motion.span>

          {/* Zellige star border top */}
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <ZelligeStar size={20} color={C.terracotta} opacity={0.5} />
            <ZelligeStar size={16} color={C.gold} opacity={0.4} />
            <ZelligeStar size={20} color={C.turquoise} opacity={0.5} />
          </div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(2rem, 5.5vw, 3.5rem)",
              color: C.white,
              textAlign: "center",
              lineHeight: 1.1,
              letterSpacing: "0.12em",
              textShadow: `0 2px 20px ${C.shadow}, 0 0 40px ${C.goldGlow}`,
            }}
          >
            THE GROX
            <br />
            BAZAAR
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.7 }}
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "clamp(0.8rem, 1.5vw, 1rem)",
              color: C.sand,
              textAlign: "center",
              maxWidth: "320px",
              lineHeight: 1.6,
              letterSpacing: "0.05em",
            }}
          >
            Curated AI craftsmanship from the digital souk
          </motion.p>

          {/* Zellige star border bottom */}
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <ZelligeStar size={16} color={C.turquoise} opacity={0.4} />
            <ZelligeStar size={20} color={C.saffron} opacity={0.5} />
            <ZelligeStar size={16} color={C.terracotta} opacity={0.4} />
          </div>
        </div>
      </motion.div>

      {/* Zellige mosaic border */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.6 }}
        style={{ marginTop: "32px" }}
      >
        <ZelligeBorder width={600} height={20} color={C.gold} />
      </motion.div>

      {/* Stats as marketplace signs */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.9 }}
        style={{
          display: "flex",
          gap: "32px",
          marginTop: "40px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {stats.map((stat, i) => {
          const accent = accentCycle[i % accentCycle.length];
          return (
            <motion.div
              key={i}
              whileHover={{ y: -4, scale: 1.05 }}
              style={{
                background: C.whiteGhost,
                border: `1.5px solid ${accent}`,
                borderRadius: "4px",
                padding: "16px 28px",
                textAlign: "center",
                position: "relative",
                boxShadow: `0 4px 20px ${C.shadow}`,
                backdropFilter: "blur(4px)",
              }}
            >
              {/* Hanging hook */}
              <div
                style={{
                  position: "absolute",
                  top: "-12px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "20px",
                  height: "12px",
                  borderTop: `2px solid ${accent}`,
                  borderLeft: `2px solid ${accent}`,
                  borderRight: `2px solid ${accent}`,
                  borderRadius: "8px 8px 0 0",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  fontSize: "1.8rem",
                  color: accent,
                  display: "block",
                  lineHeight: 1,
                  textShadow: `0 0 12px ${glowCycle[i % glowCycle.length]}`,
                }}
              >
                {stat.value}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "0.7rem",
                  color: C.sand,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  marginTop: "6px",
                  display: "block",
                }}
              >
                {stat.label}
              </span>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION HEADER
   ═══════════════════════════════════════════════════════════ */
function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7 }}
      style={{ textAlign: "center", marginBottom: "56px" }}
    >
      {/* Mini arch above title */}
      <svg width="80" height="44" viewBox="0 0 80 44" style={{ display: "block", margin: "0 auto 12px" }}>
        <path
          d="M 8 44 L 8 22 A 32 34 0 1 1 72 22 L 72 44"
          fill="none"
          stroke={C.gold}
          strokeWidth={1.5}
          strokeOpacity={0.4}
        />
        <circle cx="40" cy="10" r="2.5" fill={C.saffron} fillOpacity={0.5} />
      </svg>

      <span
        style={{
          fontFamily: "var(--font-space-grotesk)",
          fontSize: "0.7rem",
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          color: C.saffron,
          opacity: 0.7,
        }}
      >
        {subtitle}
      </span>
      <h2
        style={{
          fontFamily: "var(--font-playfair)",
          fontSize: "clamp(2rem, 5vw, 3.2rem)",
          color: C.white,
          marginTop: "8px",
          lineHeight: 1.1,
          letterSpacing: "0.06em",
          textShadow: `0 2px 20px ${C.shadow}`,
        }}
      >
        {title}
      </h2>
      {/* Decorative underline with zellige motif */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "16px" }}>
        <div style={{ width: "40px", height: "1px", background: `linear-gradient(90deg, transparent, ${C.terracotta})` }} />
        <ZelligeStar size={16} color={C.terracotta} opacity={0.6} />
        <div style={{ width: "40px", height: "1px", background: `linear-gradient(90deg, ${C.terracotta}, transparent)` }} />
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PROJECT STALL
   ═══════════════════════════════════════════════════════════ */
function ProjectStall({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const accent = accentCycle[index % accentCycle.length];
  const glow = glowCycle[index % glowCycle.length];
  const bgColor = stallColors[index % stallColors.length];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: (index % 3) * 0.12 }}
      style={{ position: "relative" }}
    >
      <div
        style={{
          background: bgColor,
          border: `1.5px solid ${accent}40`,
          borderRadius: "8px 8px 4px 4px",
          overflow: "hidden",
          transition: "border-color 0.4s ease, box-shadow 0.4s ease",
          boxShadow: `0 4px 24px ${C.shadow}`,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = `${accent}90`;
          e.currentTarget.style.boxShadow = `0 8px 40px ${glow}, 0 0 0 1px ${accent}30`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = `${accent}40`;
          e.currentTarget.style.boxShadow = `0 4px 24px ${C.shadow}`;
        }}
      >
        {/* Horseshoe arch header with zellige pattern */}
        <div
          style={{
            position: "relative",
            height: "56px",
            background: `linear-gradient(135deg, ${accent}18, ${accent}08)`,
            borderBottom: `1px solid ${accent}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* Zellige background pattern */}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", opacity: 0.15 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <ZelligeStar key={i} size={24} color={accent} opacity={1} />
            ))}
          </div>

          {/* Mini arch + title */}
          <svg width="28" height="20" viewBox="0 0 28 20" style={{ marginRight: "8px", flexShrink: 0 }}>
            <path d="M 2 20 L 2 10 A 12 13 0 1 1 26 10 L 26 20" fill="none" stroke={accent} strokeWidth={1.5} strokeOpacity={0.6} />
          </svg>
          <span
            style={{
              fontFamily: "var(--font-dm-serif)",
              fontSize: "0.85rem",
              color: accent,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {project.client} &middot; {project.year}
          </span>
        </div>

        {/* Image area */}
        <div style={{ position: "relative", height: "180px", overflow: "hidden" }}>
          {project.image && (
            <img
              src={getProjectImage("bazaar", project.image)}
              alt={project.title.replace("\n", " ")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "brightness(0.65) saturate(0.8)",
              }}
            />
          )}
          {/* Warm overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(180deg, transparent 40%, ${bgColor} 100%)`,
            }}
          />
          {/* Accent glow */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "200px",
              height: "80px",
              background: `radial-gradient(ellipse, ${glow}, transparent 70%)`,
              pointerEvents: "none",
            }}
          />

          {/* Hanging price tag / sign */}
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "12px",
              background: `${accent}DD`,
              color: C.white,
              fontFamily: "var(--font-jetbrains)",
              fontSize: "0.65rem",
              padding: "4px 8px",
              borderRadius: "2px",
              boxShadow: `0 2px 8px ${C.shadow}`,
              letterSpacing: "0.05em",
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
          <h3
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "1.25rem",
              color: C.white,
              marginBottom: "10px",
              lineHeight: 1.25,
              whiteSpace: "pre-line",
            }}
          >
            {project.title}
          </h3>
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.85rem",
              color: C.whiteMuted,
              lineHeight: 1.6,
              flex: 1,
            }}
          >
            {project.description}
          </p>

          {/* Technical detail */}
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.75rem",
              color: C.sand,
              lineHeight: 1.5,
              marginTop: "10px",
              opacity: 0.7,
              borderLeft: `2px solid ${accent}40`,
              paddingLeft: "10px",
            }}
          >
            {project.technical}
          </p>

          {/* Tech tags as colorful tiles */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "14px" }}>
            {project.tech.map((tag, ti) => {
              const tagColor = accentCycle[ti % accentCycle.length];
              return (
                <span
                  key={tag}
                  style={{
                    fontFamily: "var(--font-jetbrains)",
                    fontSize: "0.68rem",
                    color: tagColor,
                    background: `${tagColor}15`,
                    border: `1px solid ${tagColor}35`,
                    borderRadius: "3px",
                    padding: "3px 8px",
                    letterSpacing: "0.03em",
                  }}
                >
                  {tag}
                </span>
              );
            })}
          </div>

          {/* GitHub link */}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "0.75rem",
                color: accent,
                textDecoration: "none",
                marginTop: "12px",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                opacity: 0.7,
                transition: "opacity 0.3s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.7"; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              View Source
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PROJECTS SECTION
   ═══════════════════════════════════════════════════════════ */
function ProjectsSection() {
  return (
    <section
      id="projects"
      style={{
        padding: "100px 24px",
        maxWidth: "1300px",
        margin: "0 auto",
      }}
    >
      <SectionHeader title="The Marketplace" subtitle="Step inside the souk" />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: "24px",
        }}
      >
        {projects.map((project, i) => (
          <ProjectStall key={project.title} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   EXPERTISE SECTION — Ornate Mosaic Tiles
   ═══════════════════════════════════════════════════════════ */
function ExpertiseSection() {
  const tileAccents = [C.terracotta, C.turquoise, C.saffron, C.gold];
  const tileGlows = [C.terracottaGlow, C.turquoiseGlow, C.saffronGlow, C.goldGlow];

  return (
    <section
      id="expertise"
      style={{
        padding: "100px 24px",
        background: `linear-gradient(180deg, ${C.bgDeep} 0%, ${C.bg} 50%, ${C.bgDeep} 100%)`,
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <SectionHeader title="Master Crafts" subtitle="Ancient wisdom, modern mastery" />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {expertise.map((item, i) => {
            const accent = tileAccents[i % tileAccents.length];
            const glow = tileGlows[i % tileGlows.length];

            return (
              <Reveal key={item.title} delay={i * 0.12}>
                <div
                  style={{
                    position: "relative",
                    background: C.whiteGhost,
                    border: `2px solid ${accent}35`,
                    borderRadius: "6px",
                    padding: "32px 28px",
                    minHeight: "260px",
                    overflow: "hidden",
                    transition: "border-color 0.4s ease, box-shadow 0.4s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${accent}70`;
                    e.currentTarget.style.boxShadow = `0 8px 40px ${glow}, inset 0 0 40px ${glow}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${accent}35`;
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Zellige pattern border along top */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: accent, opacity: 0.6 }} />

                  {/* Corner zellige stars */}
                  <div style={{ position: "absolute", top: 8, right: 8 }}>
                    <ZelligeStar size={28} color={accent} opacity={0.25} />
                  </div>
                  <div style={{ position: "absolute", bottom: 8, left: 8 }}>
                    <ZelligeStar size={22} color={accent} opacity={0.15} />
                  </div>

                  {/* Index number */}
                  <span
                    style={{
                      fontFamily: "var(--font-jetbrains)",
                      fontSize: "0.65rem",
                      color: accent,
                      opacity: 0.6,
                      letterSpacing: "0.1em",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <h3
                    style={{
                      fontFamily: "var(--font-dm-serif)",
                      fontSize: "1.3rem",
                      color: C.white,
                      marginTop: "12px",
                      marginBottom: "14px",
                      lineHeight: 1.2,
                    }}
                  >
                    {item.title}
                  </h3>

                  <p
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: "0.88rem",
                      color: C.whiteMuted,
                      lineHeight: 1.65,
                    }}
                  >
                    {item.body}
                  </p>

                  {/* Bottom decorative arch motif */}
                  <svg
                    width="60"
                    height="30"
                    viewBox="0 0 60 30"
                    style={{ display: "block", margin: "18px auto 0", opacity: 0.25 }}
                  >
                    <path d="M 4 30 L 4 14 A 26 28 0 1 1 56 14 L 56 30" fill="none" stroke={accent} strokeWidth={1.2} />
                  </svg>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   TOOLS SECTION — Spice Rack / Merchant Shelf
   ═══════════════════════════════════════════════════════════ */
function ToolsSection() {
  const shelfAccents = [C.terracotta, C.turquoise, C.gold, C.saffron, C.sand, C.terracotta];

  return (
    <section
      id="tools"
      style={{
        padding: "100px 24px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <SectionHeader title="The Spice Rack" subtitle="Ingredients of the craft" />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "16px",
        }}
      >
        {tools.map((group, i) => {
          const accent = shelfAccents[i % shelfAccents.length];

          return (
            <Reveal key={group.label} delay={i * 0.08}>
              <div
                style={{
                  background: `linear-gradient(180deg, ${C.whiteGhost}, ${accent}08)`,
                  border: `1px solid ${accent}25`,
                  borderRadius: "6px",
                  padding: "24px",
                  position: "relative",
                  overflow: "hidden",
                  transition: "border-color 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${accent}50`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${accent}25`;
                }}
              >
                {/* Shelf line */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "3px",
                    background: `linear-gradient(90deg, transparent, ${accent}40, transparent)`,
                  }}
                />

                {/* Category header */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                  <ZelligeStar size={18} color={accent} opacity={0.5} />
                  <h3
                    style={{
                      fontFamily: "var(--font-dm-serif)",
                      fontSize: "1.05rem",
                      color: accent,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {group.label}
                  </h3>
                </div>

                {/* Tool items as goods with tile labels */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {group.items.map((tool) => (
                    <span
                      key={tool}
                      style={{
                        fontFamily: "var(--font-jetbrains)",
                        fontSize: "0.75rem",
                        color: C.white,
                        background: `${accent}12`,
                        border: `1px solid ${accent}30`,
                        borderRadius: "3px",
                        padding: "5px 12px",
                        letterSpacing: "0.02em",
                        transition: "background 0.3s ease, border-color 0.3s ease",
                        cursor: "default",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = `${accent}25`;
                        e.currentTarget.style.borderColor = `${accent}60`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = `${accent}12`;
                        e.currentTarget.style.borderColor = `${accent}30`;
                      }}
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════════ */
function FooterSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <footer
      ref={ref}
      style={{
        position: "relative",
        borderTop: `1px solid ${C.gold}30`,
        background: C.bgDeep,
        padding: "80px 24px 40px",
        overflow: "hidden",
      }}
    >
      {/* Lantern string along the top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: "60px",
          transform: "translateY(-10px)",
        }}
      >
        <Lantern size={36} color={C.saffron} glowColor={C.saffronGlow} delay={0} />
        <Lantern size={30} color={C.gold} glowColor={C.goldGlow} delay={0.5} />
        <Lantern size={36} color={C.terracotta} glowColor={C.terracottaGlow} delay={1} />
        <Lantern size={30} color={C.turquoise} glowColor={C.turquoiseGlow} delay={1.5} />
        <Lantern size={36} color={C.saffron} glowColor={C.saffronGlow} delay={2} />
      </div>

      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
        }}
      >
        {/* Decorative arch around "SHUKRAN" */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
          style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <HorseshoeArch
            width={220}
            height={200}
            strokeColor={C.gold}
            strokeWidth={1.5}
          />
          <div
            style={{
              position: "absolute",
              top: "28%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "1.8rem",
                color: C.gold,
                letterSpacing: "0.2em",
                textShadow: `0 0 20px ${C.goldGlow}`,
              }}
            >
              SHUKRAN
            </span>
            <span
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "0.65rem",
                color: C.sand,
                opacity: 0.6,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              Thank You
            </span>
          </div>
        </motion.div>

        {/* Zellige border */}
        <ZelligeBorder width={300} height={16} color={C.gold} />

        {/* Crescent + star */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "8px" }}>
          <CrescentMoon size={22} color={C.saffron} />
          <span style={{ color: C.gold, fontSize: "1.2rem", filter: `drop-shadow(0 0 6px ${C.goldGlow})` }}>&#x27E1;</span>
          <CrescentMoon size={22} color={C.saffron} />
        </div>

        {/* Establishment */}
        <p
          style={{
            fontFamily: "var(--font-space-grotesk)",
            fontSize: "0.75rem",
            color: C.sand,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            opacity: 0.5,
            marginTop: "8px",
          }}
        >
          The Grox Bazaar Est. 2024
        </p>

        {/* Horizontal line */}
        <div
          style={{
            width: "160px",
            height: "1px",
            background: `linear-gradient(90deg, transparent, ${C.gold}40, transparent)`,
            marginTop: "8px",
          }}
        />

        <ThemeSwitcher current="/bazaar" variant="dark" />
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════ */
export default function BazaarPage() {
  return (
    <>
      <style>{`
        @keyframes lanternGlow {
          0%, 100% { box-shadow: 0 0 15px rgba(245,176,65,0.3); }
          50% { box-shadow: 0 0 30px rgba(245,176,65,0.6); }
        }
        @keyframes shimmerGold {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes lanternSway {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(1.5deg); }
          75% { transform: rotate(-1.5deg); }
        }
        @keyframes tileReveal {
          0% { opacity: 0; transform: scale(0.8) rotate(-5deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes warmPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes archReveal {
          0% { clip-path: inset(100% 0 0 0); }
          100% { clip-path: inset(0 0 0 0); }
        }
        @keyframes floatUp {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: C.bg,
          color: C.white,
          fontFamily: "var(--font-inter)",
          overflowX: "hidden",
        }}
      >
        <HeroSection />
        <IslamicDivider />
        <ProjectsSection />
        <IslamicDivider />
        <ExpertiseSection />
        <IslamicDivider />
        <ToolsSection />
        <IslamicDivider />
        <FooterSection />
      </div>
    </>
  );
}
