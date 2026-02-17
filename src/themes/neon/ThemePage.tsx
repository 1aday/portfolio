"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "@/app/data/projects";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";

/* ═══════════════════════════════════════════════════════════════════════ */
/*  NEON CYBERPUNK — Colors & Constants                                   */
/* ═══════════════════════════════════════════════════════════════════════ */
const BG = "#0A0A12";
const SURFACE = "#14141F";
const SURFACE_ALT = "#1A1A2E";
const NEON_PINK = "#FF1493";
const NEON_CYAN = "#00F5FF";
const NEON_YELLOW = "#FFE700";
const TEXT = "#E0E0E8";
const DIM = "#6B6B80";
const BORDER_SUBTLE = "rgba(255,255,255,0.06)";

const neonColors = [NEON_PINK, NEON_CYAN, NEON_YELLOW];
const neonAt = (i: number) => neonColors[i % 3];

/* ═══════════════════════════════════════════════════════════════════════ */
/*  NEON GLOW HELPERS                                                      */
/* ═══════════════════════════════════════════════════════════════════════ */
function neonGlow(color: string, intensity: number = 1) {
  const s = intensity;
  return `0 0 ${7 * s}px ${color}, 0 0 ${10 * s}px ${color}, 0 0 ${21 * s}px ${color}, 0 0 ${42 * s}px ${color}, 0 0 ${82 * s}px ${color}, 0 0 ${92 * s}px ${color}`;
}

function neonGlowSoft(color: string) {
  return `0 0 7px ${color}, 0 0 15px ${color}, 0 0 30px ${color}80`;
}

function neonBorder(color: string) {
  return {
    border: `1px solid ${color}`,
    boxShadow: `inset 0 0 15px ${color}26, 0 0 15px ${color}26, 0 0 30px ${color}14`,
  };
}

function neonBorderHover(color: string) {
  return {
    border: `1px solid ${color}`,
    boxShadow: `inset 0 0 20px ${color}40, 0 0 25px ${color}40, 0 0 50px ${color}20, 0 0 80px ${color}10`,
  };
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  NEON TEXT COMPONENT                                                    */
/* ═══════════════════════════════════════════════════════════════════════ */
function NeonText({
  children,
  color = NEON_PINK,
  className = "",
  as: Tag = "span",
  intensity = 1,
  style: extraStyle = {},
}: {
  children: React.ReactNode;
  color?: string;
  className?: string;
  as?: "span" | "h1" | "h2" | "h3" | "p" | "div";
  intensity?: number;
  style?: React.CSSProperties;
}) {
  return (
    <Tag
      className={className}
      style={{
        color,
        textShadow: neonGlow(color, intensity),
        ...extraStyle,
      }}
    >
      {children}
    </Tag>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  SCAN LINES OVERLAY                                                     */
/* ═══════════════════════════════════════════════════════════════════════ */
function ScanLines() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50"
      style={{
        background: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0,0,0,0.03) 2px,
          rgba(0,0,0,0.03) 4px
        )`,
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  POWER LINES DECORATION                                                 */
/* ═══════════════════════════════════════════════════════════════════════ */
function PowerLines() {
  const linePositions = [12, 28, 55, 72, 88];
  const nodePositions = [
    { x: 12, y: 0 },
    { x: 28, y: 1 },
    { x: 55, y: 0 },
    { x: 55, y: 1 },
    { x: 72, y: 1 },
    { x: 88, y: 0 },
    { x: 12, y: 2 },
    { x: 72, y: 2 },
  ];

  return (
    <div className="absolute top-0 left-0 right-0 h-16 overflow-hidden z-10">
      {/* Horizontal lines */}
      {[0, 1, 2].map((row) => (
        <div
          key={`line-${row}`}
          className="absolute left-0 right-0"
          style={{
            top: 8 + row * 18,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${NEON_CYAN}20 10%, ${NEON_CYAN}40 50%, ${NEON_CYAN}20 90%, transparent)`,
          }}
        />
      ))}
      {/* Vertical connecting segments */}
      {linePositions.map((x, i) => (
        <div
          key={`vert-${i}`}
          className="absolute"
          style={{
            left: `${x}%`,
            top: 8,
            width: 1,
            height: 36,
            background: `linear-gradient(180deg, ${NEON_CYAN}40, ${NEON_CYAN}10)`,
          }}
        />
      ))}
      {/* Node circles */}
      {nodePositions.map((pos, i) => (
        <div
          key={`node-${i}`}
          className="absolute"
          style={{
            left: `${pos.x}%`,
            top: 8 + pos.y * 18 - 3,
            width: 7,
            height: 7,
            borderRadius: "50%",
            border: `1px solid ${NEON_CYAN}`,
            background: `${NEON_CYAN}30`,
            boxShadow: `0 0 6px ${NEON_CYAN}60`,
            transform: "translateX(-50%)",
          }}
        />
      ))}
      {/* Travelling pulse light */}
      <motion.div
        className="absolute"
        style={{
          top: 8,
          height: 1,
          width: 80,
          background: `linear-gradient(90deg, transparent, ${NEON_CYAN}, transparent)`,
        }}
        animate={{ left: ["-80px", "110%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
      />
      <motion.div
        className="absolute"
        style={{
          top: 26,
          height: 1,
          width: 60,
          background: `linear-gradient(90deg, transparent, ${NEON_PINK}80, transparent)`,
        }}
        animate={{ left: ["110%", "-60px"] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  NEON SIGN BOX — small decorative neon sign                             */
/* ═══════════════════════════════════════════════════════════════════════ */
function NeonSignBox({
  text,
  color = NEON_PINK,
  className = "",
  flicker = false,
}: {
  text: string;
  color?: string;
  className?: string;
  flicker?: boolean;
}) {
  return (
    <div
      className={`inline-flex items-center px-3 py-1.5 ${className}`}
      style={{
        ...neonBorder(color),
        borderRadius: 2,
        animation: flicker ? "neonFlicker 4s infinite" : undefined,
      }}
    >
      <span
        className="text-xs font-bold tracking-[0.2em] uppercase font-[family-name:var(--font-orbitron)]"
        style={{
          color,
          textShadow: neonGlowSoft(color),
        }}
      >
        {text}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  NEON SHAPE DECORATIONS                                                 */
/* ═══════════════════════════════════════════════════════════════════════ */
function NeonCircle({ color = NEON_PINK, size = 24, className = "" }: { color?: string; size?: number; className?: string }) {
  return (
    <div
      className={`absolute ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: `1px solid ${color}`,
        boxShadow: `0 0 8px ${color}50, inset 0 0 8px ${color}20`,
      }}
    />
  );
}

function NeonTriangle({ color = NEON_YELLOW, size = 20, className = "" }: { color?: string; size?: number; className?: string }) {
  return (
    <div className={`absolute ${className}`}>
      <svg width={size} height={size} viewBox="0 0 20 20">
        <polygon
          points="10,2 18,18 2,18"
          fill="none"
          stroke={color}
          strokeWidth="1"
          filter={`drop-shadow(0 0 4px ${color}80)`}
        />
      </svg>
    </div>
  );
}

function NeonCross({ color = NEON_CYAN, size = 16, className = "" }: { color?: string; size?: number; className?: string }) {
  return (
    <div className={`absolute ${className}`}>
      <svg width={size} height={size} viewBox="0 0 16 16">
        <line x1="8" y1="1" x2="8" y2="15" stroke={color} strokeWidth="1" filter={`drop-shadow(0 0 3px ${color}80)`} />
        <line x1="1" y1="8" x2="15" y2="8" stroke={color} strokeWidth="1" filter={`drop-shadow(0 0 3px ${color}80)`} />
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  NEON ARROW DECORATION                                                  */
/* ═══════════════════════════════════════════════════════════════════════ */
function NeonArrow({ color = NEON_CYAN, className = "" }: { color?: string; className?: string }) {
  return (
    <span
      className={`inline-block font-[family-name:var(--font-orbitron)] text-lg ${className}`}
      style={{
        color,
        textShadow: neonGlowSoft(color),
      }}
    >
      {"\u2192"}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  NEON LED DOT                                                           */
/* ═══════════════════════════════════════════════════════════════════════ */
function NeonDot({ color = NEON_PINK, size = 6 }: { color?: string; size?: number }) {
  return (
    <span
      className="inline-block rounded-full"
      style={{
        width: size,
        height: size,
        background: color,
        boxShadow: `0 0 4px ${color}, 0 0 8px ${color}80`,
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  FADE SECTION — scroll reveal wrapper                                   */
/* ═══════════════════════════════════════════════════════════════════════ */
function FadeSection({
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
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  NEON DIVIDER                                                           */
/* ═══════════════════════════════════════════════════════════════════════ */
function NeonDivider({ color = NEON_PINK }: { color?: string }) {
  return (
    <div className="relative py-8">
      <div
        className="h-px w-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}60, ${color}, ${color}60, transparent)`,
          boxShadow: `0 0 8px ${color}40, 0 0 16px ${color}20`,
        }}
      />
      {/* Center dot */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 10px ${color}, 0 0 20px ${color}80`,
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  WET STREET REFLECTION                                                  */
/* ═══════════════════════════════════════════════════════════════════════ */
function WetReflection({ text, color }: { text: string; color: string }) {
  return (
    <div className="relative overflow-hidden" style={{ height: 80 }}>
      <div
        className="absolute left-0 right-0 top-0 font-[family-name:var(--font-orbitron)] text-center"
        style={{
          fontSize: "clamp(2.5rem, 7vw, 5rem)",
          fontWeight: 900,
          color,
          textShadow: neonGlow(color, 0.5),
          transform: "scaleY(-1)",
          filter: "blur(2px)",
          opacity: 0.15,
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 80%)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 80%)",
        }}
      >
        {text}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  VIGNETTE OVERLAY                                                       */
/* ═══════════════════════════════════════════════════════════════════════ */
function Vignette() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10"
      style={{
        background: `radial-gradient(ellipse at center, transparent 40%, ${BG}cc 85%, ${BG} 100%)`,
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  NEON PULSE — subtle glow pulse animation on text                       */
/* ═══════════════════════════════════════════════════════════════════════ */
function NeonPulse({
  children,
  color,
  className = "",
}: {
  children: React.ReactNode;
  color: string;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      animate={{ opacity: [0.88, 1, 0.88] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  PROJECT CARD                                                           */
/* ═══════════════════════════════════════════════════════════════════════ */
function ProjectCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const color = neonAt(index);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const borderStyle = hovered ? neonBorderHover(color) : {
    border: `1px solid ${BORDER_SUBTLE}`,
    boxShadow: "none",
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="relative group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative p-6 md:p-8 transition-all duration-500"
        style={{
          background: `linear-gradient(135deg, ${SURFACE}, ${SURFACE_ALT})`,
          borderRadius: 4,
          ...borderStyle,
        }}
      >
        {/* Neon number */}
        <div className="flex items-start gap-6 md:gap-8">
          <div className="flex-shrink-0">
            <NeonText
              color={color}
              className="text-5xl md:text-7xl font-[family-name:var(--font-orbitron)] font-black leading-none"
              intensity={hovered ? 1.2 : 0.6}
            >
              {String(index + 1).padStart(2, "0")}
            </NeonText>
          </div>

          <div className="flex-1 min-w-0">
            {/* Header row */}
            <div className="flex items-center gap-3 mb-3">
              <NeonDot color={color} />
              <span
                className="text-[10px] uppercase tracking-[0.25em] font-[family-name:var(--font-jetbrains)]"
                style={{ color: DIM }}
              >
                {project.client} / {project.year}
              </span>
            </div>

            {/* Title */}
            <h3
              className="text-xl md:text-2xl font-bold font-[family-name:var(--font-orbitron)] mb-3 leading-tight"
              style={{ color: TEXT, whiteSpace: "pre-line" }}
            >
              {project.title}
            </h3>

            {/* Description */}
            <p
              className="text-sm leading-relaxed mb-4 font-[family-name:var(--font-inter)]"
              style={{ color: DIM }}
            >
              {project.description}
            </p>

            {/* Technical detail */}
            <p
              className="text-xs leading-relaxed mb-5 font-[family-name:var(--font-jetbrains)]"
              style={{ color: `${DIM}cc` }}
            >
              {project.technical}
            </p>

            {/* Tech tags */}
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-[family-name:var(--font-jetbrains)]"
                  style={{
                    color: `${color}cc`,
                    border: `1px solid ${color}40`,
                    borderRadius: 2,
                    background: `${color}08`,
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
                className="inline-flex items-center gap-2 mt-4 text-xs font-[family-name:var(--font-jetbrains)] transition-colors duration-300"
                style={{ color: DIM }}
                onMouseEnter={(e) => { e.currentTarget.style.color = color; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = DIM; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                View Source
              </a>
            )}
          </div>
        </div>

        {/* Corner accent */}
        <div
          className="absolute top-0 right-0 w-8 h-8 transition-opacity duration-500"
          style={{ opacity: hovered ? 1 : 0 }}
        >
          <div
            className="absolute top-0 right-0 w-full h-px"
            style={{ background: color, boxShadow: `0 0 6px ${color}` }}
          />
          <div
            className="absolute top-0 right-0 h-full w-px"
            style={{ background: color, boxShadow: `0 0 6px ${color}` }}
          />
        </div>

        {/* Bottom-left corner accent */}
        <div
          className="absolute bottom-0 left-0 w-8 h-8 transition-opacity duration-500"
          style={{ opacity: hovered ? 1 : 0 }}
        >
          <div
            className="absolute bottom-0 left-0 w-full h-px"
            style={{ background: color, boxShadow: `0 0 6px ${color}` }}
          />
          <div
            className="absolute bottom-0 left-0 h-full w-px"
            style={{ background: color, boxShadow: `0 0 6px ${color}` }}
          />
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  STAT BOX                                                               */
/* ═══════════════════════════════════════════════════════════════════════ */
function StatBox({ stat, index }: { stat: (typeof stats)[number]; index: number }) {
  return (
    <div
      className="relative px-6 py-5 text-center"
      style={{
        ...neonBorder(NEON_CYAN),
        background: `${SURFACE}cc`,
        borderRadius: 2,
      }}
    >
      <NeonText
        color={NEON_YELLOW}
        className="text-3xl md:text-4xl font-black font-[family-name:var(--font-orbitron)] block mb-1"
        as="div"
        intensity={0.7}
      >
        {stat.value}
      </NeonText>
      <span
        className="text-[10px] uppercase tracking-[0.25em] font-[family-name:var(--font-jetbrains)]"
        style={{ color: DIM }}
      >
        {stat.label}
      </span>
      {/* Corner LED */}
      <div className="absolute top-2 right-2">
        <NeonDot color={neonAt(index)} size={4} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  EXPERTISE CARD                                                         */
/* ═══════════════════════════════════════════════════════════════════════ */
function ExpertiseCard({ item, index }: { item: (typeof expertise)[number]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const color = neonAt(index);
  return (
    <div
      className="relative p-6 transition-all duration-500"
      style={{
        background: `linear-gradient(135deg, ${SURFACE}, ${SURFACE_ALT})`,
        borderRadius: 4,
        ...(hovered ? neonBorderHover(color) : { border: `1px solid ${color}30`, boxShadow: "none" }),
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-6 right-6 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}80, transparent)`,
        }}
      />

      <div className="flex items-center gap-3 mb-4">
        <NeonDot color={color} />
        <NeonText
          color={color}
          className="text-xs font-bold tracking-[0.15em] uppercase font-[family-name:var(--font-orbitron)]"
          intensity={0.5}
        >
          {String(index + 1).padStart(2, "0")}
        </NeonText>
      </div>

      <h3
        className="text-lg font-bold font-[family-name:var(--font-orbitron)] mb-3"
        style={{ color: TEXT }}
      >
        {item.title}
      </h3>

      <p
        className="text-sm leading-relaxed font-[family-name:var(--font-inter)]"
        style={{ color: DIM }}
      >
        {item.body}
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  TOOL CATEGORY                                                          */
/* ═══════════════════════════════════════════════════════════════════════ */
function ToolCategory({ tool, index }: { tool: (typeof tools)[number]; index: number }) {
  const color = neonAt(index);
  return (
    <div
      className="p-5 transition-all duration-300"
      style={{
        background: `${SURFACE}cc`,
        border: `1px solid ${color}20`,
        borderRadius: 4,
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <NeonDot color={color} size={5} />
        <NeonText
          color={color}
          className="text-[11px] font-bold tracking-[0.2em] uppercase font-[family-name:var(--font-orbitron)]"
          intensity={0.4}
        >
          {tool.label}
        </NeonText>
      </div>

      <div className="space-y-2">
        {tool.items.map((item) => (
          <div
            key={item}
            className="flex items-center gap-2 text-xs font-[family-name:var(--font-jetbrains)]"
            style={{ color: `${TEXT}cc` }}
          >
            <span style={{ color: `${color}60` }}>{"\u25B8"}</span>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  SECTION HEADER                                                         */
/* ═══════════════════════════════════════════════════════════════════════ */
function SectionHeader({
  label,
  title,
  color = NEON_CYAN,
}: {
  label: string;
  title: string;
  color?: string;
}) {
  return (
    <div className="mb-12 md:mb-16">
      <div className="flex items-center gap-3 mb-4">
        <NeonDot color={color} />
        <span
          className="text-[10px] uppercase tracking-[0.3em] font-[family-name:var(--font-jetbrains)]"
          style={{ color: DIM }}
        >
          {label}
        </span>
        <div
          className="flex-1 h-px"
          style={{ background: `linear-gradient(90deg, ${color}40, transparent)` }}
        />
      </div>
      <NeonPulse color={color}>
        <NeonText
          color={color}
          as="h2"
          className="text-3xl md:text-4xl font-black font-[family-name:var(--font-orbitron)] tracking-tight"
          intensity={0.8}
        >
          {title}
        </NeonText>
      </NeonPulse>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  MAIN PAGE COMPONENT                                                    */
/* ═══════════════════════════════════════════════════════════════════════ */
export default function NeonPage() {
  /* Inject flicker keyframes */
  useEffect(() => {
    const styleId = "neon-flicker-keyframes";
    if (document.getElementById(styleId)) return;
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      @keyframes neonFlicker {
        0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100% {
          opacity: 1;
        }
        20%, 21.999%, 63%, 63.999%, 65%, 69.999% {
          opacity: 0.65;
        }
      }
      @keyframes neonPulseGlow {
        0%, 100% { opacity: 0.88; }
        50% { opacity: 1; }
      }
      @keyframes scanMove {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(100vh); }
      }
      @keyframes powerPulse {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.8; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      const el = document.getElementById(styleId);
      if (el) el.remove();
    };
  }, []);

  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{ background: BG, color: TEXT }}
    >
      {/* Scan lines — full page overlay */}
      <ScanLines />

      {/* Moving scan bar */}
      <motion.div
        className="pointer-events-none fixed left-0 right-0 z-40 h-px"
        style={{
          background: `linear-gradient(90deg, transparent 5%, ${NEON_CYAN}15 30%, ${NEON_CYAN}25 50%, ${NEON_CYAN}15 70%, transparent 95%)`,
        }}
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Power lines at top */}
      <PowerLines />

      {/* Background ambient glow spots */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute top-1/4 -left-32 w-96 h-96 rounded-full"
          style={{
            background: `radial-gradient(circle, ${NEON_PINK}08, transparent 70%)`,
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute top-2/3 -right-32 w-96 h-96 rounded-full"
          style={{
            background: `radial-gradient(circle, ${NEON_CYAN}08, transparent 70%)`,
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full"
          style={{
            background: `radial-gradient(circle, ${NEON_YELLOW}05, transparent 70%)`,
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/*  HERO SECTION                                                   */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <header className="relative pt-24 md:pt-32 pb-4">
        <Vignette />

        {/* Decorative neon shapes */}
        <NeonCircle color={NEON_PINK} size={32} className="top-28 left-[8%] opacity-40" />
        <NeonTriangle color={NEON_YELLOW} size={24} className="top-36 right-[12%] opacity-30" />
        <NeonCross color={NEON_CYAN} size={18} className="top-20 right-[30%] opacity-25" />
        <NeonCircle color={NEON_CYAN} size={16} className="bottom-32 left-[15%] opacity-20" />
        <NeonTriangle color={NEON_PINK} size={16} className="bottom-20 right-[20%] opacity-20" />

        <div className="relative z-20 max-w-[1200px] mx-auto px-6">
          {/* OPEN sign */}
          <div className="flex items-center gap-4 mb-8">
            <NeonSignBox text="OPEN" color={NEON_PINK} flicker />
            <NeonArrow color={NEON_CYAN} />
            <span
              className="text-[10px] uppercase tracking-[0.3em] font-[family-name:var(--font-jetbrains)]"
              style={{ color: DIM }}
            >
              Portfolio v2.0
            </span>
          </div>

          {/* Main title */}
          <NeonPulse color={NEON_PINK}>
            <NeonText
              color={NEON_PINK}
              as="h1"
              className="text-[clamp(2.5rem,7vw,5rem)] font-black font-[family-name:var(--font-orbitron)] leading-[0.95] tracking-tight mb-4"
              intensity={1}
            >
              Full-Stack
              <br />
              AI Engineer
            </NeonText>
          </NeonPulse>

          {/* Subtitle */}
          <NeonText
            color={NEON_CYAN}
            as="p"
            className="text-lg md:text-xl font-[family-name:var(--font-orbitron)] mb-2 tracking-wide"
            intensity={0.5}
          >
            Building the future with code & light
          </NeonText>

          <p
            className="text-sm md:text-base max-w-xl mb-10 font-[family-name:var(--font-inter)] leading-relaxed"
            style={{ color: DIM }}
          >
            Shipping AI-powered products from concept to production.
            Multi-model orchestration, computer vision, generative media,
            and full-stack systems that scale.
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 md:gap-4 max-w-lg mb-6">
            {stats.map((s, i) => (
              <StatBox key={s.label} stat={s} index={i} />
            ))}
          </div>

          {/* Navigation arrows to projects */}
          <div className="flex items-center gap-2 mt-6">
            <span
              className="text-[10px] uppercase tracking-[0.3em] font-[family-name:var(--font-jetbrains)]"
              style={{ color: DIM }}
            >
              Scroll to explore
            </span>
            <NeonArrow color={NEON_PINK} />
            <NeonArrow color={NEON_CYAN} />
            <NeonArrow color={NEON_YELLOW} />
          </div>
        </div>

        {/* Wet street reflection */}
        <div className="relative z-20 max-w-[1200px] mx-auto px-6 mt-2">
          <WetReflection text="Full-Stack AI Engineer" color={NEON_PINK} />
        </div>

        {/* Bottom edge glow */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent 10%, ${NEON_PINK}40, ${NEON_CYAN}40, transparent 90%)`,
            boxShadow: `0 0 20px ${NEON_PINK}20, 0 0 40px ${NEON_CYAN}10`,
          }}
        />
      </header>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/*  PROJECTS SECTION                                               */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="relative z-20 max-w-[1200px] mx-auto px-6 pt-16 md:pt-24">
        <FadeSection>
          <SectionHeader
            label="Selected Work"
            title="Projects"
            color={NEON_CYAN}
          />
        </FadeSection>

        {/* Neon arrow decorations */}
        <div className="flex items-center gap-2 mb-8">
          <NeonArrow color={NEON_PINK} />
          <NeonArrow color={NEON_CYAN} />
          <span
            className="text-[10px] uppercase tracking-[0.25em] font-[family-name:var(--font-jetbrains)]"
            style={{ color: DIM }}
          >
            {projects.length} projects loaded
          </span>
          <div
            className="flex-1 h-px ml-4"
            style={{ background: `${NEON_CYAN}20` }}
          />
        </div>

        {/* Project cards — single column with neon dividers */}
        <div className="space-y-0">
          {projects.map((project, i) => (
            <div key={project.title}>
              <ProjectCard project={project} index={i} />
              {i < projects.length - 1 && (
                <NeonDivider color={neonAt(i + 1)} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/*  EXPERTISE SECTION                                              */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="relative z-20 max-w-[1200px] mx-auto px-6 pt-24 md:pt-32">
        <FadeSection>
          <SectionHeader
            label="Core Skills"
            title="Expertise"
            color={NEON_PINK}
          />
        </FadeSection>

        {/* Decorative shapes */}
        <div className="relative">
          <NeonCircle color={NEON_YELLOW} size={20} className="-top-6 right-8 opacity-30" />
          <NeonCross color={NEON_PINK} size={14} className="top-4 -left-4 opacity-20 hidden md:block" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {expertise.map((item, i) => (
              <FadeSection key={item.title} delay={i * 0.1}>
                <ExpertiseCard item={item} index={i} />
              </FadeSection>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/*  TOOLS SECTION                                                  */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="relative z-20 max-w-[1200px] mx-auto px-6 pt-24 md:pt-32">
        <FadeSection>
          <SectionHeader
            label="Tech Stack"
            title="Tools"
            color={NEON_YELLOW}
          />
        </FadeSection>

        {/* Decorative */}
        <div className="relative">
          <NeonTriangle color={NEON_CYAN} size={18} className="-top-8 left-12 opacity-20" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool, i) => (
              <FadeSection key={tool.label} delay={i * 0.08}>
                <ToolCategory tool={tool} index={i} />
              </FadeSection>
            ))}
          </div>
        </div>

        {/* Status line below tools */}
        <FadeSection delay={0.3}>
          <div className="mt-12 flex items-center gap-3">
            <NeonDot color={NEON_PINK} />
            <span
              className="text-[10px] uppercase tracking-[0.25em] font-[family-name:var(--font-jetbrains)]"
              style={{ color: DIM }}
            >
              System status: All tools operational
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: `${NEON_PINK}20` }}
            />
            <NeonSignBox text="LIVE" color={NEON_PINK} />
          </div>
        </FadeSection>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/*  FOOTER                                                         */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <footer className="relative z-20 mt-24 md:mt-32">
        {/* Top border glow */}
        <div
          className="h-px w-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${NEON_PINK}60, ${NEON_CYAN}60, ${NEON_YELLOW}60, transparent)`,
            boxShadow: `0 0 20px ${NEON_PINK}20`,
          }}
        />

        <div
          className="py-16 md:py-24"
          style={{ background: `linear-gradient(180deg, ${SURFACE}, ${BG})` }}
        >
          <div className="max-w-[1200px] mx-auto px-6">
            {/* Footer neon sign */}
            <div className="text-center mb-12">
              <NeonPulse color={NEON_PINK}>
                <NeonText
                  color={NEON_PINK}
                  as="h2"
                  className="text-3xl md:text-5xl font-black font-[family-name:var(--font-orbitron)] tracking-tight mb-4"
                  intensity={0.9}
                >
                  Let&apos;s Build
                </NeonText>
              </NeonPulse>
              <NeonText
                color={NEON_CYAN}
                as="p"
                className="text-lg md:text-xl font-[family-name:var(--font-orbitron)] mb-6"
                intensity={0.4}
              >
                Something Electric
              </NeonText>
              <p
                className="text-sm max-w-md mx-auto font-[family-name:var(--font-inter)] leading-relaxed"
                style={{ color: DIM }}
              >
                Available for AI product development, multi-model system architecture,
                and full-stack engineering projects.
              </p>
            </div>

            {/* Footer decorative elements */}
            <div className="flex justify-center items-center gap-6 mb-12">
              <NeonSignBox text="2025" color={NEON_CYAN} />
              <NeonDot color={NEON_YELLOW} />
              <NeonSignBox text="AI" color={NEON_PINK} flicker />
              <NeonDot color={NEON_YELLOW} />
              <NeonSignBox text="PORTFOLIO" color={NEON_YELLOW} />
            </div>

            {/* Horizontal neon lines */}
            <div className="relative h-12 mb-8">
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${NEON_PINK}40, transparent)`,
                }}
              />
              <div
                className="absolute top-4 left-[10%] right-[10%] h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${NEON_CYAN}30, transparent)`,
                }}
              />
              <div
                className="absolute top-8 left-[20%] right-[20%] h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${NEON_YELLOW}20, transparent)`,
                }}
              />
              {/* Small nodes */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
                style={{
                  background: NEON_PINK,
                  boxShadow: `0 0 6px ${NEON_PINK}`,
                }}
              />
              <div
                className="absolute top-4 left-1/3 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                style={{
                  background: NEON_CYAN,
                  boxShadow: `0 0 4px ${NEON_CYAN}`,
                }}
              />
              <div
                className="absolute top-4 left-2/3 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                style={{
                  background: NEON_CYAN,
                  boxShadow: `0 0 4px ${NEON_CYAN}`,
                }}
              />
            </div>

            {/* Bottom row */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <NeonDot color={NEON_PINK} size={4} />
                <span
                  className="text-[10px] tracking-[0.2em] font-[family-name:var(--font-jetbrains)]"
                  style={{ color: DIM }}
                >
                  CRAFTED WITH NEON AND CODE
                </span>
              </div>

              <div
                className="text-[10px] tracking-[0.15em] font-[family-name:var(--font-jetbrains)]"
                style={{ color: `${DIM}80` }}
              >
                {"\u00A9"} 2025 {"\u2014"} ALL SYSTEMS ONLINE
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/*  THEME SWITCHER                                                 */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <ThemeSwitcher current="/neon" />
    </div>
  );
}
