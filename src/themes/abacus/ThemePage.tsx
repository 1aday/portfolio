"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { projects, stats, expertise, tools } from "@/app/data/projects";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";

/* ─── Color Palette ─── */
const C = {
  bg: "#1A0E05",
  bgCard: "#2A1A0A",
  lacquer: "#CC3333",
  lacquerGlow: "rgba(204,51,51,0.4)",
  lacquerMuted: "rgba(204,51,51,0.15)",
  beadBrown: "#8B5A2B",
  beadBrownLight: "rgba(139,90,43,0.3)",
  bamboo: "#C4A458",
  bambooMuted: "rgba(196,164,88,0.25)",
  frameDark: "#2A1A0A",
  beadBlack: "#1A1A1A",
  ivory: "#E8DCC8",
  ivoryMuted: "rgba(232,220,200,0.7)",
  gold: "#D4A03C",
  goldGlow: "rgba(212,160,60,0.3)",
  text: "#E8DCC8",
  textMuted: "rgba(232,220,200,0.5)",
  border: "rgba(196,164,88,0.2)",
  borderBright: "rgba(196,164,88,0.4)",
  wood: "#3D2512",
  woodLight: "#5A3A1E",
  rodColor: "#8B7355",
};

/* ─── Category Colors ─── */
const BEAD_COLORS = [
  C.lacquer, C.bamboo, C.gold, C.beadBrown, "#A0522D",
  "#B85C38", "#C17817", "#9B2335", "#D4773A", "#7B3F00",
];

/* ─── SVG: Wooden Bead ─── */
function BeadSVG({
  cx,
  cy,
  r = 12,
  color = C.lacquer,
  id,
}: {
  cx: number;
  cy: number;
  r?: number;
  color?: string;
  id?: string;
}) {
  return (
    <g id={id}>
      <defs>
        <radialGradient id={`bead-grad-${id}`} cx="35%" cy="35%">
          <stop offset="0%" stopColor={color} stopOpacity="1" />
          <stop offset="60%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.6" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill={`url(#bead-grad-${id})`} />
      <ellipse
        cx={cx - r * 0.2}
        cy={cy - r * 0.25}
        rx={r * 0.35}
        ry={r * 0.2}
        fill="rgba(255,255,255,0.2)"
      />
    </g>
  );
}

/* ─── SVG: Abacus Frame ─── */
function AbacusFrameSVG({
  width = 600,
  height = 400,
  rods = 10,
  beadsPerRod = 7,
  scrollProgress = 0,
}: {
  width?: number;
  height?: number;
  rods?: number;
  beadsPerRod?: number;
  scrollProgress?: number;
}) {
  const frameThick = 14;
  const rodSpacing = (height - frameThick * 2) / (rods + 1);
  const dividerX = width * 0.25;
  const beadR = Math.min(rodSpacing * 0.32, 14);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height="100%"
      style={{ maxWidth: width }}
    >
      <defs>
        <linearGradient id="wood-frame-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5A3A1E" />
          <stop offset="50%" stopColor="#3D2512" />
          <stop offset="100%" stopColor="#2A1508" />
        </linearGradient>
        <linearGradient id="rod-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A08B6A" />
          <stop offset="100%" stopColor="#6B5B45" />
        </linearGradient>
        <filter id="wood-shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.5" />
        </filter>
      </defs>

      {/* Outer Frame */}
      <rect
        x="0" y="0" width={width} height={height}
        rx="6" fill="url(#wood-frame-grad)"
        stroke={C.bamboo} strokeWidth="1.5"
        filter="url(#wood-shadow)"
      />
      {/* Inner cut */}
      <rect
        x={frameThick} y={frameThick}
        width={width - frameThick * 2} height={height - frameThick * 2}
        rx="3" fill={C.bg} stroke={C.border} strokeWidth="0.5"
      />

      {/* Center divider bar */}
      <rect
        x={dividerX} y={frameThick}
        width="4" height={height - frameThick * 2}
        fill="url(#wood-frame-grad)" stroke={C.bamboo} strokeWidth="0.5"
      />

      {/* Rods and Beads */}
      {Array.from({ length: rods }).map((_, rodIdx) => {
        const y = frameThick + rodSpacing * (rodIdx + 1);
        const offset = ((scrollProgress + rodIdx * 0.1) % 1) * 0.6;
        const upperBeadCount = 2;
        const lowerBeadCount = beadsPerRod - upperBeadCount;

        return (
          <g key={rodIdx}>
            {/* Rod */}
            <line
              x1={frameThick + 4} y1={y}
              x2={width - frameThick - 4} y2={y}
              stroke="url(#rod-grad)" strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Upper section beads (heaven beads) */}
            {Array.from({ length: upperBeadCount }).map((_, bi) => {
              const baseX = frameThick + 20 + bi * (beadR * 2.5);
              const moveX = offset * (dividerX - frameThick - upperBeadCount * beadR * 2.5 - 30);
              return (
                <BeadSVG
                  key={`u-${rodIdx}-${bi}`}
                  id={`u-${rodIdx}-${bi}`}
                  cx={baseX + moveX * ((rodIdx + bi) % 2 === 0 ? 1 : 0.3)}
                  cy={y}
                  r={beadR}
                  color={rodIdx % 2 === 0 ? C.lacquer : C.ivory}
                />
              );
            })}

            {/* Lower section beads (earth beads) */}
            {Array.from({ length: lowerBeadCount }).map((_, bi) => {
              const baseX = dividerX + 20 + bi * (beadR * 2.5);
              const moveX = offset * 40;
              const shifted = (rodIdx + bi) % 3 === 0;
              return (
                <BeadSVG
                  key={`l-${rodIdx}-${bi}`}
                  id={`l-${rodIdx}-${bi}`}
                  cx={baseX + (shifted ? moveX : 0)}
                  cy={y}
                  r={beadR}
                  color={
                    bi === 0
                      ? C.gold
                      : bi % 2 === 0
                      ? C.beadBrown
                      : C.beadBlack
                  }
                />
              );
            })}
          </g>
        );
      })}

      {/* Corner decorations */}
      {[
        [6, 6],
        [width - 6, 6],
        [6, height - 6],
        [width - 6, height - 6],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill={C.gold} opacity="0.6" />
      ))}
    </svg>
  );
}

/* ─── SVG: Brush Stroke ─── */
function BrushStrokeSVG({ width = 200, color = C.lacquer }: { width?: number; color?: string }) {
  return (
    <svg viewBox="0 0 200 20" width={width} height={width * 0.1} style={{ display: "block" }}>
      <path
        d="M5 10 Q30 3 50 10 Q70 17 100 8 Q130 0 160 12 Q180 18 195 10"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M10 12 Q40 6 70 13 Q110 20 150 9 Q175 3 190 11"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.3"
      />
    </svg>
  );
}

/* ─── SVG: Bamboo Frame ─── */
function BambooFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={className} style={{ position: "relative", padding: "24px" }}>
      {/* Corner bamboo joints */}
      <svg
        viewBox="0 0 40 40"
        width="40"
        height="40"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <line x1="0" y1="20" x2="40" y2="20" stroke={C.bamboo} strokeWidth="3" opacity="0.5" />
        <line x1="20" y1="0" x2="20" y2="40" stroke={C.bamboo} strokeWidth="3" opacity="0.5" />
        <circle cx="20" cy="20" r="4" fill={C.bamboo} opacity="0.6" />
        <circle cx="20" cy="20" r="2" fill={C.gold} opacity="0.8" />
      </svg>
      <svg
        viewBox="0 0 40 40"
        width="40"
        height="40"
        style={{ position: "absolute", top: 0, right: 0 }}
      >
        <line x1="0" y1="20" x2="40" y2="20" stroke={C.bamboo} strokeWidth="3" opacity="0.5" />
        <line x1="20" y1="0" x2="20" y2="40" stroke={C.bamboo} strokeWidth="3" opacity="0.5" />
        <circle cx="20" cy="20" r="4" fill={C.bamboo} opacity="0.6" />
        <circle cx="20" cy="20" r="2" fill={C.gold} opacity="0.8" />
      </svg>
      <svg
        viewBox="0 0 40 40"
        width="40"
        height="40"
        style={{ position: "absolute", bottom: 0, left: 0 }}
      >
        <line x1="0" y1="20" x2="40" y2="20" stroke={C.bamboo} strokeWidth="3" opacity="0.5" />
        <line x1="20" y1="0" x2="20" y2="40" stroke={C.bamboo} strokeWidth="3" opacity="0.5" />
        <circle cx="20" cy="20" r="4" fill={C.bamboo} opacity="0.6" />
        <circle cx="20" cy="20" r="2" fill={C.gold} opacity="0.8" />
      </svg>
      <svg
        viewBox="0 0 40 40"
        width="40"
        height="40"
        style={{ position: "absolute", bottom: 0, right: 0 }}
      >
        <line x1="0" y1="20" x2="40" y2="20" stroke={C.bamboo} strokeWidth="3" opacity="0.5" />
        <line x1="20" y1="0" x2="20" y2="40" stroke={C.bamboo} strokeWidth="3" opacity="0.5" />
        <circle cx="20" cy="20" r="4" fill={C.bamboo} opacity="0.6" />
        <circle cx="20" cy="20" r="2" fill={C.gold} opacity="0.8" />
      </svg>
      {/* Border lines */}
      <div
        style={{
          position: "absolute",
          inset: "18px",
          border: `1px solid ${C.border}`,
          borderRadius: "2px",
          pointerEvents: "none",
        }}
      />
      {children}
    </div>
  );
}

/* ─── SVG: Calligraphy Character ─── */
function CalligraphyChar({ char, size = 80 }: { char: string; size?: number }) {
  return (
    <span
      style={{
        fontFamily: "var(--font-dm-serif), serif",
        fontSize: size,
        color: C.lacquer,
        opacity: 0.12,
        lineHeight: 1,
        userSelect: "none",
      }}
    >
      {char}
    </span>
  );
}

/* ─── SVG: Rod with Sliding Beads ─── */
function ProjectRod({
  beadCount = 5,
  beadPositions,
  color = C.lacquer,
  width = 300,
}: {
  beadCount?: number;
  beadPositions?: number[];
  color?: string;
  width?: number;
}) {
  const rodH = 30;
  const beadR = 10;
  const positions = beadPositions || Array.from({ length: beadCount }, (_, i) => (i + 1) / (beadCount + 1));

  return (
    <svg viewBox={`0 0 ${width} ${rodH}`} width={width} height={rodH}>
      <defs>
        <linearGradient id={`proj-rod-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A08B6A" />
          <stop offset="100%" stopColor="#6B5B45" />
        </linearGradient>
      </defs>
      {/* Rod */}
      <line
        x1="5" y1={rodH / 2} x2={width - 5} y2={rodH / 2}
        stroke={C.rodColor} strokeWidth="3" strokeLinecap="round"
      />
      {/* End caps */}
      <circle cx="5" cy={rodH / 2} r="4" fill={C.wood} stroke={C.bamboo} strokeWidth="0.5" />
      <circle cx={width - 5} cy={rodH / 2} r="4" fill={C.wood} stroke={C.bamboo} strokeWidth="0.5" />
      {/* Beads */}
      {positions.map((pos, i) => (
        <g key={i}>
          <circle
            cx={10 + pos * (width - 20)}
            cy={rodH / 2}
            r={beadR}
            fill={i === 0 ? color : i % 2 === 0 ? C.beadBrown : C.beadBlack}
          />
          <ellipse
            cx={10 + pos * (width - 20) - beadR * 0.2}
            cy={rodH / 2 - beadR * 0.25}
            rx={beadR * 0.3}
            ry={beadR * 0.15}
            fill="rgba(255,255,255,0.2)"
          />
        </g>
      ))}
    </svg>
  );
}

/* ─── Bead Counter Display ─── */
function BeadCounter({ value, max = 10, color = C.lacquer }: { value: number; max?: number; color?: string }) {
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: i < value ? color : "rgba(232,220,200,0.1)",
            border: `1px solid ${i < value ? color : C.border}`,
            transition: "all 0.3s ease",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Wooden Token ─── */
function WoodenToken({ label }: { label: string }) {
  return (
    <div
      style={{
        padding: "6px 14px",
        background: `linear-gradient(135deg, ${C.wood}, ${C.woodLight})`,
        border: `1px solid ${C.bamboo}40`,
        borderRadius: "4px",
        fontFamily: "var(--font-jetbrains), monospace",
        fontSize: "12px",
        color: C.ivory,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Wood grain effect */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `repeating-linear-gradient(
            90deg,
            transparent 0px,
            transparent 3px,
            rgba(196,164,88,0.04) 3px,
            rgba(196,164,88,0.04) 4px
          )`,
          pointerEvents: "none",
        }}
      />
      <span style={{ position: "relative", zIndex: 1 }}>{label}</span>
    </div>
  );
}

/* ─── Section Heading ─── */
function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{ textAlign: "center", marginBottom: 60 }}
    >
      <BrushStrokeSVG width={120} color={C.lacquer} />
      <h2
        style={{
          fontFamily: "var(--font-dm-serif), serif",
          fontSize: "clamp(32px, 5vw, 52px)",
          color: C.ivory,
          letterSpacing: "-0.02em",
          marginTop: 16,
          marginBottom: 8,
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 15,
            color: C.textMuted,
            maxWidth: 500,
            margin: "0 auto",
          }}
        >
          {subtitle}
        </p>
      )}
      <div style={{ marginTop: 16 }}>
        <BrushStrokeSVG width={160} color={C.bamboo} />
      </div>
    </motion.div>
  );
}

/* ─── Project Card ─── */
function ProjectCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const beadColor = BEAD_COLORS[index % BEAD_COLORS.length];
  const [beadSlide, setBeadSlide] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      setBeadSlide(Math.min(frame / 20, 1));
      if (frame >= 20) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [inView]);

  const beadPositions = project.tech.map(
    (_, i) => 0.05 + beadSlide * ((i + 1) / (project.tech.length + 1)) * 0.9
  );

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: `linear-gradient(135deg, ${C.bgCard}, ${C.bg})`,
        border: `1px solid ${C.border}`,
        borderRadius: 6,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Wood grain background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `repeating-linear-gradient(
            ${85 + index * 3}deg,
            transparent 0px,
            transparent 8px,
            rgba(139,90,43,0.03) 8px,
            rgba(139,90,43,0.03) 9px
          )`,
          pointerEvents: "none",
        }}
      />

      <div style={{ padding: "28px 28px 20px", position: "relative" }}>
        {/* Row number indicator */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                fontFamily: "var(--font-dm-serif), serif",
                fontSize: 28,
                color: beadColor,
                lineHeight: 1,
                opacity: 0.7,
              }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <span
                style={{
                  fontFamily: "var(--font-jetbrains), monospace",
                  fontSize: 10,
                  color: C.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                {project.client} / {project.year}
              </span>
            </div>
          </div>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: 11,
                color: C.bamboo,
                textDecoration: "none",
                opacity: 0.7,
                transition: "opacity 0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
            >
              source
            </a>
          )}
        </div>

        {/* Project Rod -- beads sliding animation */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ transformOrigin: "left", marginBottom: 16 }}
        >
          <ProjectRod
            beadCount={project.tech.length}
            beadPositions={beadPositions}
            color={beadColor}
            width={320}
          />
        </motion.div>

        {/* Title */}
        <h3
          style={{
            fontFamily: "var(--font-dm-serif), serif",
            fontSize: 22,
            color: C.ivory,
            lineHeight: 1.2,
            marginBottom: 10,
            whiteSpace: "pre-line",
          }}
        >
          {project.title}
        </h3>

        {/* Description */}
        <p
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 13,
            color: C.textMuted,
            lineHeight: 1.65,
            marginBottom: 12,
          }}
        >
          {project.description}
        </p>

        {/* Technical */}
        <p
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 12,
            color: C.ivoryMuted,
            lineHeight: 1.6,
            marginBottom: 16,
            borderLeft: `2px solid ${beadColor}40`,
            paddingLeft: 12,
          }}
        >
          {project.technical}
        </p>

        {/* Tech tags as beads */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {project.tech.map((t, i) => (
            <motion.span
              key={t}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.4 + i * 0.08, duration: 0.3 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 10px",
                background: C.lacquerMuted,
                border: `1px solid ${beadColor}30`,
                borderRadius: 3,
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: 11,
                color: C.ivory,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: beadColor,
                  flexShrink: 0,
                }}
              />
              {t}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Bottom rod decoration */}
      <div
        style={{
          height: 3,
          background: `linear-gradient(90deg, transparent, ${beadColor}40, transparent)`,
        }}
      />
    </motion.div>
  );
}

/* ─── Expertise Card ─── */
function ExpertiseCard({ item, index }: { item: (typeof expertise)[number]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const mastery = [8, 9, 8, 9][index];
  const cardColor = [C.lacquer, C.bamboo, C.gold, C.beadBrown][index];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      <BambooFrame>
        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Mastery counter */}
          <div style={{ marginBottom: 16 }}>
            <BeadCounter value={mastery} max={10} color={cardColor} />
            <span
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: 10,
                color: C.textMuted,
                marginTop: 6,
                display: "block",
              }}
            >
              Mastery: {mastery}/10
            </span>
          </div>

          {/* Number */}
          <div
            style={{
              fontFamily: "var(--font-dm-serif), serif",
              fontSize: 36,
              color: cardColor,
              opacity: 0.3,
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
              fontSize: 20,
              color: C.ivory,
              marginBottom: 12,
              lineHeight: 1.2,
            }}
          >
            {item.title}
          </h3>

          {/* Body */}
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 13,
              color: C.textMuted,
              lineHeight: 1.65,
            }}
          >
            {item.body}
          </p>

          {/* Decorative rod at bottom */}
          <div style={{ marginTop: 20 }}>
            <svg viewBox="0 0 200 8" width="100%" height="8">
              <line x1="0" y1="4" x2="200" y2="4" stroke={C.rodColor} strokeWidth="2" />
              {[0.2, 0.4, 0.6, 0.8].map((pos, i) => (
                <circle
                  key={i}
                  cx={pos * 200}
                  cy="4"
                  r="3"
                  fill={i < mastery / 3 ? cardColor : C.beadBlack}
                />
              ))}
            </svg>
          </div>
        </div>
      </BambooFrame>
    </motion.div>
  );
}

/* ─── Tool Shelf ─── */
function ToolShelf({ tool, index }: { tool: (typeof tools)[number]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const shelfColor = BEAD_COLORS[index % BEAD_COLORS.length];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{
        background: `linear-gradient(180deg, ${C.bgCard}, ${C.bg})`,
        border: `1px solid ${C.border}`,
        borderRadius: 4,
        overflow: "hidden",
      }}
    >
      {/* Shelf top (wooden plank) */}
      <div
        style={{
          height: 6,
          background: `linear-gradient(90deg, ${C.wood}, ${C.woodLight}, ${C.wood})`,
          borderBottom: `1px solid ${C.bamboo}40`,
        }}
      />

      <div style={{ padding: "20px 20px 16px" }}>
        {/* Label with accent bead */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: shelfColor,
              boxShadow: `0 0 8px ${shelfColor}40`,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontSize: 14,
              fontWeight: 600,
              color: C.ivory,
              letterSpacing: "0.02em",
            }}
          >
            {tool.label}
          </span>
        </div>

        {/* Tool tokens */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {tool.items.map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.07 }}
            >
              <WoodenToken label={item} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Shelf bottom */}
      <div
        style={{
          height: 4,
          background: `linear-gradient(90deg, ${C.wood}, ${C.woodLight}, ${C.wood})`,
        }}
      />
    </motion.div>
  );
}

/* ─── Wood Grain Background Pattern ─── */
function WoodGrainBg() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        background: `
          repeating-linear-gradient(
            87deg,
            transparent 0px,
            transparent 20px,
            rgba(139,90,43,0.015) 20px,
            rgba(139,90,43,0.015) 21px
          ),
          repeating-linear-gradient(
            93deg,
            transparent 0px,
            transparent 35px,
            rgba(196,164,88,0.01) 35px,
            rgba(196,164,88,0.01) 36px
          )
        `,
      }}
    />
  );
}

/* ─── Floating Calligraphy Background ─── */
function CalligraphyBg() {
  const chars = ["算", "珠", "計", "数", "玉", "盤"];
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {chars.map((ch, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: `${15 + i * 15}%`,
            left: i % 2 === 0 ? "5%" : "85%",
            transform: `rotate(${-10 + i * 5}deg)`,
          }}
        >
          <CalligraphyChar char={ch} size={60 + i * 10} />
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function AbacusPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const abacusSlide = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);
  const heroY = useTransform(heroScroll, [0, 1], [0, -100]);

  const [scrollVal, setScrollVal] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const unsub = abacusSlide.on("change", (v) => setScrollVal(v));
    return unsub;
  }, [abacusSlide]);

  if (!mounted) return null;

  return (
    <>
      <style>{`
        @keyframes abacus-bead-slide {
          0% { transform: translateX(0); }
          50% { transform: translateX(20px); }
          100% { transform: translateX(0); }
        }
        @keyframes abacus-bead-click {
          0% { transform: scale(1); }
          30% { transform: scale(1.15); }
          60% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        @keyframes bamboo-grow {
          0% { transform: scaleY(0); opacity: 0; }
          60% { transform: scaleY(1.05); opacity: 1; }
          100% { transform: scaleY(1); opacity: 1; }
        }
        @keyframes wood-reveal {
          0% { clip-path: inset(50% 50% 50% 50%); opacity: 0; }
          100% { clip-path: inset(0% 0% 0% 0%); opacity: 1; }
        }
        @keyframes count-up {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes rod-extend {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        @keyframes float-bead {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes grain-shift {
          0% { background-position: 0 0; }
          100% { background-position: 100px 50px; }
        }
        @keyframes brush-draw {
          0% { stroke-dashoffset: 400; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(204,51,51,0); }
          50% { box-shadow: 0 0 20px 4px rgba(204,51,51,0.15); }
        }

        .abacus-page::-webkit-scrollbar { width: 6px; }
        .abacus-page::-webkit-scrollbar-track { background: #1A0E05; }
        .abacus-page::-webkit-scrollbar-thumb {
          background: #8B5A2B;
          border-radius: 3px;
        }
        .abacus-page a { transition: color 0.25s ease; }
      `}</style>

      <div
        ref={containerRef}
        className="abacus-page"
        style={{
          minHeight: "100vh",
          background: C.bg,
          color: C.text,
          fontFamily: "var(--font-inter), sans-serif",
          position: "relative",
          overflowX: "hidden",
        }}
      >
        <WoodGrainBg />

        {/* ─── HERO SECTION ─── */}
        <motion.section
          ref={heroRef}
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative"
        >
          <div
            style={{
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "60px 24px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <CalligraphyBg />

            {/* Wooden frame border */}
            <div
              style={{
                position: "absolute",
                inset: 20,
                border: `2px solid ${C.bamboo}20`,
                borderRadius: 8,
                pointerEvents: "none",
              }}
            />

            {/* Top decorative rod */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: "80%",
                maxWidth: 600,
                height: 3,
                background: `linear-gradient(90deg, transparent, ${C.lacquer}, transparent)`,
                marginBottom: 40,
                transformOrigin: "center",
              }}
            />

            {/* Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              style={{
                fontSize: 48,
                color: C.lacquer,
                marginBottom: 16,
                animation: "float-bead 3s ease-in-out infinite",
              }}
            >
              ⊟
            </motion.div>

            {/* Title: ABACUS */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "var(--font-dm-serif), serif",
                fontSize: "clamp(52px, 10vw, 120px)",
                color: C.ivory,
                letterSpacing: "0.15em",
                lineHeight: 1,
                textAlign: "center",
                marginBottom: 8,
                textShadow: `0 0 60px ${C.lacquer}30`,
              }}
            >
              ABACUS
            </motion.h1>

            {/* Calligraphy subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              style={{
                fontFamily: "var(--font-dm-serif), serif",
                fontSize: "clamp(16px, 2.5vw, 22px)",
                color: C.bamboo,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Ancient Computation Grid
            </motion.p>

            {/* Brush stroke separator */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <BrushStrokeSVG width={240} color={C.lacquer} />
            </motion.div>

            {/* Large Abacus SVG with scroll-driven beads */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: "100%",
                maxWidth: 560,
                margin: "40px auto 48px",
                animation: "wood-reveal 1.5s ease-out 1.2s both",
              }}
            >
              <AbacusFrameSVG
                width={560}
                height={320}
                rods={8}
                beadsPerRod={7}
                scrollProgress={scrollVal}
              />
            </motion.div>

            {/* Stats as bead configurations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.6 }}
              style={{
                display: "flex",
                gap: 48,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  style={{
                    textAlign: "center",
                    position: "relative",
                  }}
                >
                  {/* Bead visual */}
                  <svg viewBox="0 0 80 20" width="80" height="20" style={{ marginBottom: 8 }}>
                    <line x1="5" y1="10" x2="75" y2="10" stroke={C.rodColor} strokeWidth="2" />
                    {Array.from({ length: parseInt(stat.value) || 3 }).map((_, bi) => (
                      <circle
                        key={bi}
                        cx={15 + bi * 14}
                        cy="10"
                        r="6"
                        fill={i === 0 ? C.lacquer : i === 1 ? C.gold : C.bamboo}
                      />
                    ))}
                  </svg>
                  <div
                    style={{
                      fontFamily: "var(--font-dm-serif), serif",
                      fontSize: 32,
                      color: C.ivory,
                      lineHeight: 1,
                      marginBottom: 4,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-space-grotesk), sans-serif",
                      fontSize: 12,
                      color: C.textMuted,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2 }}
              style={{
                position: "absolute",
                bottom: 40,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-jetbrains), monospace",
                  fontSize: 10,
                  color: C.textMuted,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                Slide beads to calculate
              </span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: C.lacquer,
                  opacity: 0.6,
                }}
              />
            </motion.div>
          </div>
        </motion.section>

        {/* ─── PROJECTS SECTION ─── */}
        <section
          style={{
            padding: "100px 24px 80px",
            maxWidth: 1200,
            margin: "0 auto",
            position: "relative",
          }}
        >
          {/* Vertical bamboo accent */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 3,
              background: `linear-gradient(180deg, transparent, ${C.bamboo}30, transparent)`,
            }}
          />

          <SectionHeading
            title="Computations"
            subtitle="Each row on the abacus represents a completed calculation -- a project brought to fruition."
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 480px), 1fr))",
              gap: 28,
            }}
          >
            {projects.map((project, i) => (
              <ProjectCard key={project.title} project={project} index={i} />
            ))}
          </div>
        </section>

        {/* ─── EXPERTISE SECTION ─── */}
        <section
          style={{
            padding: "80px 24px",
            maxWidth: 1100,
            margin: "0 auto",
            position: "relative",
          }}
        >
          {/* Background abacus ghost */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              opacity: 0.03,
              pointerEvents: "none",
              width: "80%",
              maxWidth: 800,
            }}
          >
            <AbacusFrameSVG width={800} height={500} rods={6} scrollProgress={scrollVal} />
          </div>

          <SectionHeading
            title="Calculation Panels"
            subtitle="Areas of mastery, measured bead by bead."
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 460px), 1fr))",
              gap: 24,
            }}
          >
            {expertise.map((item, i) => (
              <ExpertiseCard key={item.title} item={item} index={i} />
            ))}
          </div>
        </section>

        {/* ─── TOOLS SECTION ─── */}
        <section
          style={{
            padding: "80px 24px",
            maxWidth: 1100,
            margin: "0 auto",
            position: "relative",
          }}
        >
          <SectionHeading
            title="Wooden Rack"
            subtitle="Tools carved from experience, organized on the shelf."
          />

          {/* Rack frame */}
          <div
            style={{
              background: `linear-gradient(180deg, ${C.wood}40, transparent)`,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: 24,
              position: "relative",
            }}
          >
            {/* Rack top plank */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 8,
                background: `linear-gradient(90deg, ${C.wood}, ${C.woodLight}, ${C.wood})`,
                borderRadius: "8px 8px 0 0",
              }}
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
                gap: 20,
                paddingTop: 8,
              }}
            >
              {tools.map((tool, i) => (
                <ToolShelf key={tool.label} tool={tool} index={i} />
              ))}
            </div>

            {/* Rack bottom plank */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 8,
                background: `linear-gradient(90deg, ${C.wood}, ${C.woodLight}, ${C.wood})`,
                borderRadius: "0 0 8px 8px",
              }}
            />
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer
          style={{
            padding: "80px 24px 48px",
            textAlign: "center",
            position: "relative",
            borderTop: `1px solid ${C.border}`,
          }}
        >
          {/* Wooden frame decoration top */}
          <div
            style={{
              position: "absolute",
              top: -1,
              left: "50%",
              transform: "translateX(-50%)",
              width: "60%",
              maxWidth: 400,
              height: 6,
              background: `linear-gradient(90deg, transparent, ${C.wood}, ${C.woodLight}, ${C.wood}, transparent)`,
              borderRadius: "0 0 3px 3px",
            }}
          />

          {/* Final abacus tally */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ maxWidth: 500, margin: "0 auto" }}
          >
            <div style={{ marginBottom: 20 }}>
              <BrushStrokeSVG width={100} color={C.lacquer} />
            </div>

            {/* Mini final abacus */}
            <svg viewBox="0 0 300 100" width="300" height="100" style={{ margin: "0 auto 24px", display: "block" }}>
              {/* Frame */}
              <rect x="5" y="5" width="290" height="90" rx="4" fill="none" stroke={C.bamboo} strokeWidth="2" opacity="0.4" />
              <rect x="10" y="10" width="280" height="80" rx="2" fill={C.bg} stroke={C.border} strokeWidth="0.5" />
              {/* Divider */}
              <line x1="80" y1="10" x2="80" y2="90" stroke={C.bamboo} strokeWidth="2" opacity="0.3" />
              {/* Three rods */}
              {[30, 50, 70].map((y, ri) => (
                <g key={ri}>
                  <line x1="15" y1={y} x2="285" y2={y} stroke={C.rodColor} strokeWidth="2" />
                  {/* Heaven beads */}
                  <circle cx={30 + ri * 12} cy={y} r="7" fill={C.lacquer} />
                  <circle cx={55 + ri * 8} cy={y} r="7" fill={C.ivory} />
                  {/* Earth beads */}
                  {[100, 130, 160, 190, 220].map((bx, bi) => (
                    <circle
                      key={bi}
                      cx={bx + ri * 5}
                      cy={y}
                      r="7"
                      fill={bi % 2 === 0 ? C.beadBrown : C.beadBlack}
                    />
                  ))}
                </g>
              ))}
              {/* Corner dots */}
              {[[8, 8], [292, 8], [8, 92], [292, 92]].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="2" fill={C.gold} opacity="0.5" />
              ))}
            </svg>

            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              style={{
                fontFamily: "var(--font-dm-serif), serif",
                fontSize: "clamp(24px, 4vw, 36px)",
                color: C.ivory,
                letterSpacing: "0.1em",
                marginBottom: 8,
              }}
            >
              CALCULATION COMPLETE
            </motion.h3>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <BrushStrokeSVG width={180} color={C.bamboo} />
            </motion.div>

            {/* Tally summary */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 32,
                marginTop: 24,
                flexWrap: "wrap",
              }}
            >
              {[
                { label: "Projects Tallied", value: "10" },
                { label: "Domains Counted", value: "4" },
                { label: "Tools Racked", value: "6" },
              ].map((item) => (
                <div key={item.label} style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-dm-serif), serif",
                      fontSize: 24,
                      color: C.lacquer,
                      lineHeight: 1,
                      marginBottom: 4,
                    }}
                  >
                    {item.value}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-jetbrains), monospace",
                      fontSize: 10,
                      color: C.textMuted,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {item.label}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Company */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              style={{ marginTop: 48 }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 24px",
                  background: C.bgCard,
                  border: `1px solid ${C.border}`,
                  borderRadius: 4,
                }}
              >
                <span style={{ fontSize: 18, color: C.lacquer }}>⊟</span>
                <span
                  style={{
                    fontFamily: "var(--font-space-grotesk), sans-serif",
                    fontSize: 13,
                    color: C.ivory,
                    letterSpacing: "0.08em",
                  }}
                >
                  Grox Computing Co.
                </span>
              </div>
            </motion.div>

            {/* Bottom frame decoration */}
            <div
              style={{
                marginTop: 40,
                display: "flex",
                justifyContent: "center",
                gap: 8,
                alignItems: "center",
              }}
            >
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i === 3 ? 12 : 8,
                    height: i === 3 ? 12 : 8,
                    borderRadius: "50%",
                    background: i === 3 ? C.lacquer : C.beadBrown,
                    opacity: i === 3 ? 1 : 0.3 + i * 0.08,
                  }}
                />
              ))}
            </div>

            <p
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: 10,
                color: C.textMuted,
                marginTop: 20,
                letterSpacing: "0.1em",
              }}
            >
              Crafted with ancient precision
            </p>
          </motion.div>
        </footer>

        {/* ─── THEME SWITCHER ─── */}
        <ThemeSwitcher current="/abacus" variant="dark" />
      </div>
    </>
  );
}