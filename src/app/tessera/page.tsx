"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";

/* ═══════════════════════════════════════════════════════════════
   TESSERA — Islamic Geometric Tessellation Portfolio Theme
   Inspired by the Alhambra, Topkapi, and Sheikh Lotfollah Mosque
   ═══════════════════════════════════════════════════════════════ */

/* ─── Color Palette ─── */
const C = {
  bg: "#0C1445",
  bgDeep: "#080E30",
  gold: "#D4A03C",
  goldFaint: "rgba(212,160,60,0.08)",
  goldLine: "rgba(212,160,60,0.30)",
  goldGlow: "rgba(212,160,60,0.15)",
  ruby: "#9B1B30",
  rubyGlow: "rgba(155,27,48,0.25)",
  emerald: "#065F46",
  emeraldGlow: "rgba(6,95,70,0.25)",
  ivory: "#F5F0E6",
  ivoryMuted: "#B8B0A0",
  card: "rgba(12,20,69,0.80)",
  cardBorder: "rgba(212,160,60,0.25)",
  cardHover: "rgba(212,160,60,0.12)",
};

/* Jewel cycle: gold, ruby, emerald */
const jewels = [C.gold, C.ruby, C.emerald];
const jewelGlows = [C.goldGlow, C.rubyGlow, C.emeraldGlow];
const jewelAt = (i: number) => jewels[i % 3];
const glowAt = (i: number) => jewelGlows[i % 3];

/* ═══════════════════════════════════════════════════════════════
   SVG GENERATORS — Mathematical Islamic Geometric Construction
   ═══════════════════════════════════════════════════════════════ */

/* ─── 8-Pointed Star (Octagram) Tessellation Tile ─── */
function generateOctagramTile(size: number): string {
  const cx = size / 2;
  const cy = size / 2;
  const rOuter = size * 0.45;
  const rInner = rOuter * 0.42;
  const paths: string[] = [];

  /* Outer octagram: connect every other vertex of a 16-gon */
  for (let i = 0; i < 8; i++) {
    const a1 = (i * 45 * Math.PI) / 180;
    const a2 = ((i + 3) * 45 * Math.PI) / 180;
    const x1 = cx + rOuter * Math.cos(a1);
    const y1 = cy + rOuter * Math.sin(a1);
    const x2 = cx + rOuter * Math.cos(a2);
    const y2 = cy + rOuter * Math.sin(a2);
    paths.push(`M${x1},${y1} L${x2},${y2}`);
  }

  /* Inner star ring — kite connectors */
  for (let i = 0; i < 8; i++) {
    const a = ((i * 45 + 22.5) * Math.PI) / 180;
    const x = cx + rInner * Math.cos(a);
    const y = cy + rInner * Math.sin(a);
    const aPrev = ((i * 45) * Math.PI) / 180;
    const aNext = (((i + 1) * 45) * Math.PI) / 180;
    const xp = cx + rOuter * Math.cos(aPrev);
    const yp = cy + rOuter * Math.sin(aPrev);
    const xn = cx + rOuter * Math.cos(aNext);
    const yn = cy + rOuter * Math.sin(aNext);
    paths.push(`M${xp},${yp} L${x},${y} L${xn},${yn}`);
  }

  return paths.join(" ");
}

/* ─── Rosette Motif (12-fold) ─── */
function generateRosette(cx: number, cy: number, r: number, petals: number = 12): string {
  const paths: string[] = [];
  const angleStep = (2 * Math.PI) / petals;

  /* Multiple rings for depth */
  for (let ring = 0; ring < 3; ring++) {
    const rr = r * (0.4 + ring * 0.3);
    const offset = ring * (angleStep / 6);

    for (let i = 0; i < petals; i++) {
      const a = i * angleStep + offset;
      const aNext = (i + 1) * angleStep + offset;
      const aMid = a + angleStep / 2;

      const x1 = cx + rr * Math.cos(a);
      const y1 = cy + rr * Math.sin(a);
      const x2 = cx + rr * Math.cos(aNext);
      const y2 = cy + rr * Math.sin(aNext);
      const xMid = cx + rr * 1.15 * Math.cos(aMid);
      const yMid = cy + rr * 1.15 * Math.sin(aMid);

      paths.push(`M${x1},${y1} Q${xMid},${yMid} ${x2},${y2}`);
    }
  }

  /* Central star */
  const rCenter = r * 0.25;
  for (let i = 0; i < petals; i++) {
    const a = i * angleStep;
    const aNext = ((i + 2) % petals) * angleStep;
    const x1 = cx + rCenter * Math.cos(a);
    const y1 = cy + rCenter * Math.sin(a);
    const x2 = cx + rCenter * Math.cos(aNext);
    const y2 = cy + rCenter * Math.sin(aNext);
    paths.push(`M${x1},${y1} L${x2},${y2}`);
  }

  return paths.join(" ");
}

/* ─── Arabesque S-Curves ─── */
function generateArabesque(width: number, height: number): string {
  const paths: string[] = [];
  const segments = 8;
  const segW = width / segments;

  for (let i = 0; i < segments; i++) {
    const x0 = i * segW;
    const x1 = x0 + segW / 2;
    const x2 = x0 + segW;
    const y0 = height / 2;
    const cp1y = height * 0.05;
    const cp2y = height * 0.95;

    paths.push(`M${x0},${y0} C${x1},${cp1y} ${x1},${cp2y} ${x2},${y0}`);
  }

  /* Mirror below */
  for (let i = 0; i < segments; i++) {
    const x0 = i * segW;
    const x1 = x0 + segW / 2;
    const x2 = x0 + segW;
    const y0 = height / 2;
    const cp1y = height * 0.95;
    const cp2y = height * 0.05;

    paths.push(`M${x0},${y0} C${x1},${cp1y} ${x1},${cp2y} ${x2},${y0}`);
  }

  return paths.join(" ");
}

/* ─── Calligraphic Swoosh (abstract) ─── */
function generateSwoosh(width: number, height: number): string {
  const mid = height / 2;
  return [
    `M${width * 0.1},${mid}`,
    `C${width * 0.25},${mid - height * 0.4}`,
    `${width * 0.4},${mid + height * 0.3}`,
    `${width * 0.5},${mid}`,
    `S${width * 0.75},${mid - height * 0.35}`,
    `${width * 0.9},${mid}`,
  ].join(" ");
}

/* ═══════════════════════════════════════════════════════════════
   SVG COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

/* ─── Background Tessellation Pattern ─── */
function TessellationBackground() {
  const tileSize = 120;
  const tilePath = generateOctagramTile(tileSize);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          inset: "-50%",
          width: "200%",
          height: "200%",
        }}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="octagram-tile"
              x="0"
              y="0"
              width={tileSize}
              height={tileSize}
              patternUnits="userSpaceOnUse"
            >
              <path
                d={tilePath}
                fill="none"
                stroke={C.gold}
                strokeWidth="0.5"
                opacity="0.08"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#octagram-tile)" />
        </svg>
      </motion.div>
    </div>
  );
}

/* ─── Rosette Motif Component ─── */
function RosetteMotif({
  size = 300,
  opacity = 0.15,
  className = "",
}: {
  size?: number;
  opacity?: number;
  className?: string;
}) {
  const path = generateRosette(size / 2, size / 2, size / 2, 16);

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      animate={{ rotate: 360 }}
      transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
      style={{ opacity }}
    >
      <path
        d={path}
        fill="none"
        stroke={C.gold}
        strokeWidth="0.8"
      />
      {/* Outer ring */}
      <circle cx={size / 2} cy={size / 2} r={size * 0.47} fill="none" stroke={C.gold} strokeWidth="0.5" opacity="0.5" />
      <circle cx={size / 2} cy={size / 2} r={size * 0.35} fill="none" stroke={C.gold} strokeWidth="0.4" opacity="0.3" />
      <circle cx={size / 2} cy={size / 2} r={size * 0.12} fill="none" stroke={C.gold} strokeWidth="0.6" opacity="0.6" />
    </motion.svg>
  );
}

/* ─── Arabesque Border ─── */
function ArabesqueBorder({ width = 1100, height = 30 }: { width?: number; height?: number }) {
  const path = generateArabesque(width, height);

  return (
    <div style={{ width: "100%", overflow: "hidden", padding: "8px 0" }}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        style={{ display: "block" }}
      >
        <path d={path} fill="none" stroke={C.gold} strokeWidth="0.8" opacity="0.3" />
      </svg>
    </div>
  );
}

/* ─── Geometric Divider Strip ─── */
function GeometricDivider() {
  const tileSize = 60;
  const tilePath = generateOctagramTile(tileSize);

  return (
    <div style={{ width: "100%", padding: "24px 0", overflow: "hidden" }}>
      <svg width="100%" height="60" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="divider-tile"
            x="0"
            y="0"
            width={tileSize}
            height={tileSize}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={tilePath}
              fill="none"
              stroke={C.gold}
              strokeWidth="0.6"
              opacity="0.2"
            />
          </pattern>
        </defs>
        <rect width="100%" height="60" fill="url(#divider-tile)" />
        {/* Top and bottom gold lines */}
        <line x1="0" y1="0" x2="100%" y2="0" stroke={C.gold} strokeWidth="1" opacity="0.3" />
        <line x1="0" y1="60" x2="100%" y2="60" stroke={C.gold} strokeWidth="1" opacity="0.3" />
      </svg>
    </div>
  );
}

/* ─── Calligraphic Swoosh Separator ─── */
function CalligraphicSwoosh() {
  const w = 400;
  const h = 60;
  const path = generateSwoosh(w, h);

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "32px 0" }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <path
          d={path}
          fill="none"
          stroke={C.gold}
          strokeWidth="1.5"
          opacity="0.4"
          strokeLinecap="round"
        />
        {/* Decorative dot at center */}
        <circle cx={w / 2} cy={h / 2} r="3" fill={C.gold} opacity="0.5" />
        {/* Small flanking dots */}
        <circle cx={w * 0.35} cy={h / 2} r="1.5" fill={C.gold} opacity="0.3" />
        <circle cx={w * 0.65} cy={h / 2} r="1.5" fill={C.gold} opacity="0.3" />
      </svg>
    </div>
  );
}

/* ─── Gold Inlay Line (draws in on scroll) ─── */
function GoldInlayLine({ width = "100%", vertical = false }: { width?: string; vertical?: boolean }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ scaleX: vertical ? 1 : 0, scaleY: vertical ? 0 : 1 }}
      animate={
        inView
          ? { scaleX: 1, scaleY: 1 }
          : { scaleX: vertical ? 1 : 0, scaleY: vertical ? 0 : 1 }
      }
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width: vertical ? "1px" : width,
        height: vertical ? "100%" : "1px",
        background: `linear-gradient(${vertical ? "to bottom" : "to right"}, transparent, ${C.gold}, transparent)`,
        opacity: 0.35,
        transformOrigin: "center",
      }}
    />
  );
}

/* ─── Corner Ornament SVG ─── */
function CornerOrnament({
  position,
  size = 24,
}: {
  position: "tl" | "tr" | "bl" | "br";
  size?: number;
}) {
  const rot =
    position === "tl" ? 0 : position === "tr" ? 90 : position === "bl" ? 270 : 180;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{
        position: "absolute",
        ...(position.includes("t") ? { top: -1 } : { bottom: -1 }),
        ...(position.includes("l") ? { left: -1 } : { right: -1 }),
        transform: `rotate(${rot}deg)`,
      }}
    >
      <path
        d="M0,0 L8,0 L8,2 L2,2 L2,8 L0,8 Z"
        fill={C.gold}
        opacity="0.5"
      />
      <path
        d="M0,0 L12,0 L12,1 L1,1 L1,12 L0,12 Z"
        fill="none"
        stroke={C.gold}
        strokeWidth="0.5"
        opacity="0.3"
      />
      {/* Small diamond accent */}
      <path d="M4,4 L6,2 L8,4 L6,6 Z" fill={C.gold} opacity="0.3" />
    </svg>
  );
}

/* ─── Muqarnas Clip Path for Card Top ─── */
function muqarnasClipPath(scallops: number = 7): string {
  const points: string[] = [];
  const step = 100 / scallops;

  points.push("0% 8%");
  for (let i = 0; i < scallops; i++) {
    const xStart = i * step;
    const xMid = xStart + step / 2;
    const xEnd = xStart + step;
    points.push(`${xStart}% 8%`);
    points.push(`${xMid}% 0%`);
    points.push(`${xEnd}% 8%`);
  }
  points.push("100% 8%");
  points.push("100% 100%");
  points.push("0% 100%");

  return `polygon(${points.join(", ")})`;
}

/* ═══════════════════════════════════════════════════════════════
   REUSABLE COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

/* ─── Scroll-Reveal Wrapper ─── */
function Reveal({
  children,
  className = "",
  delay = 0,
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 28, scale: 0.97 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ─── Section Title ─── */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 48 }}>
      <ArabesqueBorder />
      <h2
        className="font-[family-name:var(--font-josefin)]"
        style={{
          fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
          color: C.ivory,
          fontWeight: 300,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          margin: "16px 0",
        }}
      >
        {children}
      </h2>
      <ArabesqueBorder />
    </div>
  );
}

/* ─── Stat Box ─── */
function StatBox({
  stat,
  index,
}: {
  stat: (typeof stats)[number];
  index: number;
}) {
  const jewel = jewelAt(index);

  return (
    <Reveal delay={index * 0.12} style={{ flex: "1 1 160px" }}>
      <div
        style={{
          border: `1px solid ${jewel}`,
          borderRadius: 2,
          padding: "24px 20px",
          textAlign: "center",
          position: "relative",
          background: C.card,
          backdropFilter: "blur(12px)",
        }}
      >
        <CornerOrnament position="tl" />
        <CornerOrnament position="tr" />
        <CornerOrnament position="bl" />
        <CornerOrnament position="br" />
        <div
          className="font-[family-name:var(--font-josefin)]"
          style={{
            fontSize: "2.25rem",
            fontWeight: 300,
            color: jewel,
            lineHeight: 1,
            marginBottom: 8,
          }}
        >
          {stat.value}
        </div>
        <div
          className="font-[family-name:var(--font-inter)]"
          style={{
            fontSize: "0.75rem",
            color: C.ivoryMuted,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          {stat.label}
        </div>
      </div>
    </Reveal>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PROJECT CARD — Muqarnas-inspired with gold inlay
   ═══════════════════════════════════════════════════════════════ */

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const jewel = jewelAt(index);
  const glow = glowAt(index);
  const num = String(index + 1).padStart(2, "0");
  const clipPath = muqarnasClipPath(7);
  const title = project.title.replace(/\n/g, " ");

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36, scale: 0.96 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 36, scale: 0.96 }}
      transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "relative",
        clipPath,
        paddingTop: 12,
      }}
    >
      <div
        style={{
          position: "relative",
          border: `1px solid ${C.cardBorder}`,
          borderTop: "none",
          background: C.card,
          backdropFilter: "blur(16px)",
          borderRadius: "0 0 4px 4px",
          padding: "40px 32px 32px",
          transition: "background 0.4s ease, box-shadow 0.4s ease",
          overflow: "hidden",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = C.cardHover;
          e.currentTarget.style.boxShadow = `0 0 40px ${glow}, inset 0 0 60px ${glow}`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = C.card;
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {/* Corner ornaments */}
        <CornerOrnament position="bl" />
        <CornerOrnament position="br" />

        {/* Subtle geometric pattern on hover (always rendered, low opacity) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.03,
            pointerEvents: "none",
          }}
        >
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id={`card-pattern-${index}`}
                x="0"
                y="0"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d={generateOctagramTile(60)}
                  fill="none"
                  stroke={C.gold}
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#card-pattern-${index})`} />
          </svg>
        </div>

        {/* Top gold inlay line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "10%",
            right: "10%",
            height: 1,
            background: `linear-gradient(to right, transparent, ${C.gold}, transparent)`,
            opacity: 0.4,
          }}
        />

        {/* Card content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Header row */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <div style={{ flex: 1 }}>
              {/* Number + Client */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 8,
                }}
              >
                <span
                  className="font-[family-name:var(--font-josefin)]"
                  style={{
                    fontSize: "0.8rem",
                    color: jewel,
                    letterSpacing: "0.1em",
                    fontWeight: 300,
                  }}
                >
                  {num}
                </span>
                <span
                  style={{
                    width: 32,
                    height: 1,
                    background: `linear-gradient(to right, ${jewel}, transparent)`,
                    display: "inline-block",
                  }}
                />
                <span
                  className="font-[family-name:var(--font-inter)]"
                  style={{
                    fontSize: "0.7rem",
                    color: C.ivoryMuted,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                  }}
                >
                  {project.client}
                </span>
              </div>

              {/* Title */}
              <h3
                className="font-[family-name:var(--font-josefin)]"
                style={{
                  fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
                  color: C.ivory,
                  fontWeight: 300,
                  letterSpacing: "0.04em",
                  lineHeight: 1.3,
                  margin: 0,
                }}
              >
                {title}
              </h3>
            </div>

            {/* Year badge */}
            <div
              style={{
                padding: "6px 14px",
                border: `1px solid ${C.cardBorder}`,
                fontSize: "0.7rem",
                color: C.ivoryMuted,
                letterSpacing: "0.1em",
                fontFamily: "monospace",
                flexShrink: 0,
              }}
            >
              {project.year}
            </div>
          </div>

          {/* Description */}
          <p
            className="font-[family-name:var(--font-inter)]"
            style={{
              fontSize: "0.9rem",
              lineHeight: 1.65,
              color: C.ivoryMuted,
              margin: 0,
            }}
          >
            {project.description}
          </p>

          {/* Technical detail */}
          <p
            className="font-[family-name:var(--font-instrument)]"
            style={{
              fontSize: "0.85rem",
              lineHeight: 1.6,
              color: `${C.ivoryMuted}cc`,
              margin: 0,
              fontStyle: "italic",
            }}
          >
            {project.technical}
          </p>

          {/* Divider */}
          <div
            style={{
              height: 1,
              background: `linear-gradient(to right, transparent, ${C.goldLine}, transparent)`,
            }}
          />

          {/* Tech tags + GitHub */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="font-[family-name:var(--font-inter)]"
                  style={{
                    padding: "4px 12px",
                    border: `1px solid ${C.goldLine}`,
                    borderRadius: 2,
                    fontSize: "0.7rem",
                    color: C.gold,
                    letterSpacing: "0.05em",
                    transition: "background 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLSpanElement).style.background = C.goldGlow;
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLSpanElement).style.background = "transparent";
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
              className="font-[family-name:var(--font-inter)]"
              style={{
                fontSize: "0.7rem",
                color: C.gold,
                letterSpacing: "0.1em",
                textDecoration: "none",
                opacity: 0.7,
                transition: "opacity 0.3s ease",
                textTransform: "uppercase",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLAnchorElement).style.opacity = "1";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLAnchorElement).style.opacity = "0.7";
              }}
            >
              View Source &rarr;
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   EXPERTISE CARD
   ═══════════════════════════════════════════════════════════════ */

function ExpertiseCard({
  item,
  index,
}: {
  item: (typeof expertise)[number];
  index: number;
}) {
  const jewel = jewelAt(index);

  return (
    <Reveal delay={index * 0.1}>
      <div
        style={{
          border: `1px solid ${C.cardBorder}`,
          borderRadius: 2,
          padding: "28px 24px",
          background: C.card,
          backdropFilter: "blur(12px)",
          position: "relative",
          overflow: "hidden",
          transition: "border-color 0.4s ease",
          minHeight: 180,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = jewel;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = C.cardBorder;
        }}
      >
        <CornerOrnament position="tl" />
        <CornerOrnament position="tr" />
        <CornerOrnament position="bl" />
        <CornerOrnament position="br" />

        {/* Accent line top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: 2,
            background: `linear-gradient(to right, transparent, ${jewel}, transparent)`,
            opacity: 0.5,
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 14,
          }}
        >
          {/* Small rosette icon */}
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path
              d={generateRosette(9, 9, 8, 8)}
              fill="none"
              stroke={jewel}
              strokeWidth="0.5"
            />
          </svg>
          <h3
            className="font-[family-name:var(--font-josefin)]"
            style={{
              fontSize: "1rem",
              color: C.ivory,
              fontWeight: 400,
              letterSpacing: "0.08em",
              margin: 0,
            }}
          >
            {item.title}
          </h3>
        </div>

        <p
          className="font-[family-name:var(--font-inter)]"
          style={{
            fontSize: "0.85rem",
            lineHeight: 1.65,
            color: C.ivoryMuted,
            margin: 0,
          }}
        >
          {item.body}
        </p>
      </div>
    </Reveal>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TOOLS SECTION
   ═══════════════════════════════════════════════════════════════ */

function ToolCategory({
  category,
  index,
}: {
  category: (typeof tools)[number];
  index: number;
}) {
  const jewel = jewelAt(index);

  return (
    <Reveal delay={index * 0.08}>
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 10,
          }}
        >
          {/* Diamond accent */}
          <svg width="10" height="10" viewBox="0 0 10 10">
            <path d="M5,0 L10,5 L5,10 L0,5 Z" fill={jewel} opacity="0.6" />
          </svg>
          <span
            className="font-[family-name:var(--font-josefin)]"
            style={{
              fontSize: "0.75rem",
              color: jewel,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 400,
            }}
          >
            {category.label}
          </span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, paddingLeft: 20 }}>
          {category.items.map((item) => (
            <span
              key={item}
              className="font-[family-name:var(--font-inter)]"
              style={{
                padding: "5px 14px",
                border: `1px solid ${C.cardBorder}`,
                borderRadius: 2,
                fontSize: "0.75rem",
                color: C.ivory,
                letterSpacing: "0.04em",
                background: C.card,
                transition: "border-color 0.3s ease, color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.target as HTMLSpanElement;
                el.style.borderColor = C.gold;
                el.style.color = C.gold;
              }}
              onMouseLeave={(e) => {
                const el = e.target as HTMLSpanElement;
                el.style.borderColor = C.cardBorder;
                el.style.color = C.ivory;
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function TesseraPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: `radial-gradient(ellipse at 50% 20%, #101B55 0%, ${C.bg} 50%, ${C.bgDeep} 100%)`,
        color: C.ivory,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Fixed tessellation background */}
      <TessellationBackground />

      {/* Content container */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* ─── HERO SECTION ─── */}
        <section
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 24px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Central rosette background */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
            }}
          >
            <RosetteMotif size={600} opacity={0.06} />
          </div>

          {/* Smaller flanking rosettes */}
          <div
            style={{
              position: "absolute",
              top: "15%",
              left: "5%",
              pointerEvents: "none",
            }}
          >
            <RosetteMotif size={200} opacity={0.04} />
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "10%",
              right: "5%",
              pointerEvents: "none",
            }}
          >
            <RosetteMotif size={250} opacity={0.04} />
          </div>

          {/* Hero content */}
          <div
            style={{
              maxWidth: 800,
              width: "100%",
              textAlign: "center",
              position: "relative",
              zIndex: 2,
            }}
          >
            {/* Top arabesque */}
            <Reveal>
              <ArabesqueBorder />
            </Reveal>

            {/* Subtitle */}
            <Reveal delay={0.1}>
              <p
                className="font-[family-name:var(--font-inter)]"
                style={{
                  fontSize: "0.7rem",
                  letterSpacing: "0.35em",
                  textTransform: "uppercase",
                  color: C.gold,
                  marginTop: 24,
                  marginBottom: 16,
                }}
              >
                AI Engineering Portfolio
              </p>
            </Reveal>

            {/* Main title */}
            <Reveal delay={0.2}>
              <h1
                className="font-[family-name:var(--font-josefin)]"
                style={{
                  fontSize: "clamp(2.5rem, 8vw, 5rem)",
                  fontWeight: 300,
                  letterSpacing: "0.12em",
                  lineHeight: 1.1,
                  color: C.ivory,
                  margin: "0 0 8px",
                  textTransform: "uppercase",
                }}
              >
                Tessera
              </h1>
            </Reveal>

            {/* Decorative rosette between title and tagline */}
            <Reveal delay={0.25}>
              <div style={{ display: "flex", justifyContent: "center", margin: "16px 0" }}>
                <RosetteMotif size={80} opacity={0.3} />
              </div>
            </Reveal>

            {/* Tagline */}
            <Reveal delay={0.3}>
              <p
                className="font-[family-name:var(--font-instrument)]"
                style={{
                  fontSize: "clamp(1rem, 2.5vw, 1.4rem)",
                  fontStyle: "italic",
                  color: C.gold,
                  marginBottom: 12,
                  lineHeight: 1.4,
                }}
              >
                Where sacred geometry meets intelligent systems
              </p>
            </Reveal>

            {/* Description */}
            <Reveal delay={0.35}>
              <p
                className="font-[family-name:var(--font-inter)]"
                style={{
                  fontSize: "0.9rem",
                  lineHeight: 1.7,
                  color: C.ivoryMuted,
                  maxWidth: 550,
                  margin: "0 auto 32px",
                }}
              >
                Building production AI applications that chain multiple models into
                cohesive experiences. From computer vision to generative media.
              </p>
            </Reveal>

            {/* Calligraphic swoosh */}
            <Reveal delay={0.4}>
              <CalligraphicSwoosh />
            </Reveal>

            {/* Stats */}
            <div
              style={{
                display: "flex",
                gap: 20,
                justifyContent: "center",
                flexWrap: "wrap",
                marginTop: 8,
              }}
            >
              {stats.map((stat, i) => (
                <StatBox key={stat.label} stat={stat} index={i} />
              ))}
            </div>

            {/* Bottom arabesque */}
            <Reveal delay={0.6}>
              <div style={{ marginTop: 40 }}>
                <ArabesqueBorder />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ─── Geometric Divider ─── */}
        <GeometricDivider />

        {/* ─── PROJECTS SECTION ─── */}
        <section
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "80px 24px",
          }}
        >
          <Reveal>
            <SectionTitle>Selected Works</SectionTitle>
          </Reveal>

          {/* Gold inlay line */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 48 }}>
            <GoldInlayLine width="60%" />
          </div>

          {/* Project cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            {projects.map((project, i) => (
              <ProjectCard key={project.title} project={project} index={i} />
            ))}
          </div>
        </section>

        {/* ─── Calligraphic Swoosh ─── */}
        <CalligraphicSwoosh />

        {/* ─── Geometric Divider ─── */}
        <GeometricDivider />

        {/* ─── EXPERTISE SECTION ─── */}
        <section
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "80px 24px",
          }}
        >
          <Reveal>
            <SectionTitle>Expertise</SectionTitle>
          </Reveal>

          <div style={{ display: "flex", justifyContent: "center", marginBottom: 48 }}>
            <GoldInlayLine width="40%" />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 440px), 1fr))",
              gap: 24,
            }}
          >
            {expertise.map((item, i) => (
              <ExpertiseCard key={item.title} item={item} index={i} />
            ))}
          </div>
        </section>

        {/* ─── Geometric Divider ─── */}
        <GeometricDivider />

        {/* ─── TOOLS SECTION ─── */}
        <section
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "80px 24px",
          }}
        >
          <Reveal>
            <SectionTitle>Tools &amp; Technologies</SectionTitle>
          </Reveal>

          <div style={{ display: "flex", justifyContent: "center", marginBottom: 48 }}>
            <GoldInlayLine width="50%" />
          </div>

          <div
            style={{
              border: `1px solid ${C.cardBorder}`,
              borderRadius: 2,
              padding: "32px 28px",
              background: C.card,
              backdropFilter: "blur(12px)",
              position: "relative",
            }}
          >
            <CornerOrnament position="tl" size={32} />
            <CornerOrnament position="tr" size={32} />
            <CornerOrnament position="bl" size={32} />
            <CornerOrnament position="br" size={32} />

            {tools.map((category, i) => (
              <ToolCategory key={category.label} category={category} index={i} />
            ))}
          </div>
        </section>

        {/* ─── Calligraphic Swoosh ─── */}
        <CalligraphicSwoosh />

        {/* ─── Geometric Divider ─── */}
        <GeometricDivider />

        {/* ─── FOOTER ─── */}
        <footer
          style={{
            padding: "80px 24px 120px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background rosette */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
            }}
          >
            <RosetteMotif size={500} opacity={0.04} />
          </div>

          <div
            style={{
              maxWidth: 700,
              margin: "0 auto",
              textAlign: "center",
              position: "relative",
              zIndex: 1,
            }}
          >
            <Reveal>
              <ArabesqueBorder />
            </Reveal>

            <Reveal delay={0.1}>
              <div style={{ margin: "32px 0" }}>
                <RosetteMotif size={60} opacity={0.3} />
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <h2
                className="font-[family-name:var(--font-josefin)]"
                style={{
                  fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
                  fontWeight: 300,
                  letterSpacing: "0.12em",
                  color: C.ivory,
                  marginBottom: 16,
                  textTransform: "uppercase",
                }}
              >
                Let&apos;s Create Together
              </h2>
            </Reveal>

            <Reveal delay={0.2}>
              <p
                className="font-[family-name:var(--font-instrument)]"
                style={{
                  fontSize: "1.1rem",
                  fontStyle: "italic",
                  color: C.gold,
                  marginBottom: 12,
                }}
              >
                Patterns emerge from collaboration
              </p>
            </Reveal>

            <Reveal delay={0.25}>
              <p
                className="font-[family-name:var(--font-inter)]"
                style={{
                  fontSize: "0.85rem",
                  lineHeight: 1.7,
                  color: C.ivoryMuted,
                  maxWidth: 500,
                  margin: "0 auto 32px",
                }}
              >
                Building AI-powered products that combine technical depth with
                thoughtful design. Every project is a new tile in the mosaic.
              </p>
            </Reveal>

            {/* Contact links */}
            <Reveal delay={0.3}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 32,
                  flexWrap: "wrap",
                  marginBottom: 40,
                }}
              >
                {[
                  { label: "GitHub", href: "https://github.com/1aday" },
                  { label: "Email", href: "mailto:hello@grox.dev" },
                  { label: "LinkedIn", href: "https://linkedin.com" },
                ].map((link, i) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-[family-name:var(--font-inter)]"
                    style={{
                      fontSize: "0.75rem",
                      color: jewelAt(i),
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      textDecoration: "none",
                      padding: "8px 20px",
                      border: `1px solid ${jewelAt(i)}`,
                      borderRadius: 2,
                      transition: "background 0.3s ease, color 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget;
                      el.style.background = jewelAt(i);
                      el.style.color = C.ivory;
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget;
                      el.style.background = "transparent";
                      el.style.color = jewelAt(i);
                    }}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </Reveal>

            {/* Final arabesque */}
            <Reveal delay={0.35}>
              <ArabesqueBorder />
            </Reveal>

            {/* Copyright */}
            <Reveal delay={0.4}>
              <p
                className="font-[family-name:var(--font-inter)]"
                style={{
                  fontSize: "0.7rem",
                  color: `${C.ivoryMuted}80`,
                  letterSpacing: "0.1em",
                  marginTop: 24,
                }}
              >
                &copy; {new Date().getFullYear()} &middot; Crafted with geometric precision
              </p>
            </Reveal>

            {/* Small decorative octagram */}
            <Reveal delay={0.45}>
              <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path
                    d={(() => {
                      const cx = 12;
                      const cy = 12;
                      const r = 10;
                      const pts: string[] = [];
                      for (let i = 0; i < 8; i++) {
                        const a = (i * 45 * Math.PI) / 180 - Math.PI / 2;
                        const x = cx + r * Math.cos(a);
                        const y = cy + r * Math.sin(a);
                        pts.push(`${i === 0 ? "M" : "L"}${x},${y}`);
                      }
                      pts.push("Z");
                      return pts.join(" ");
                    })()}
                    fill="none"
                    stroke={C.gold}
                    strokeWidth="0.5"
                    opacity="0.3"
                  />
                  <path
                    d={(() => {
                      const cx = 12;
                      const cy = 12;
                      const r = 10;
                      const pts: string[] = [];
                      for (let i = 0; i < 8; i++) {
                        const a = ((i * 45 + 22.5) * Math.PI) / 180 - Math.PI / 2;
                        const x = cx + r * Math.cos(a);
                        const y = cy + r * Math.sin(a);
                        pts.push(`${i === 0 ? "M" : "L"}${x},${y}`);
                      }
                      pts.push("Z");
                      return pts.join(" ");
                    })()}
                    fill="none"
                    stroke={C.gold}
                    strokeWidth="0.5"
                    opacity="0.3"
                  />
                </svg>
              </div>
            </Reveal>
          </div>
        </footer>

        {/* Theme switcher */}
        <ThemeSwitcher current="/tessera" />
      </div>
    </div>
  );
}
