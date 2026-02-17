"use client";

import { projects, stats, expertise, tools } from "@/app/data/projects";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { useRef, useState, useEffect } from "react";

/* ═══════════════════════════════════════════════════
   COLORS — Edison Tungsten Palette
   ═══════════════════════════════════════════════════ */
const C = {
  darkest: "#050505",
  warmDark: "#1A1008",
  amber: "#FFB347",
  amberGlow: "rgba(255,179,71,0.35)",
  amberMuted: "rgba(255,179,71,0.12)",
  tungsten: "#FFF5D4",
  brass: "#B8860B",
  darkGlass: "#1A1A1A",
  warmGray: "#3A3228",
  text: "#FFF5D4",
  textMuted: "rgba(255,245,212,0.45)",
  border: "rgba(255,179,71,0.15)",
  filamentCore: "#FFEAA7",
};

/* ═══════════════════════════════════════════════════
   FONT HELPERS
   ═══════════════════════════════════════════════════ */
const playfair = () => `var(--font-playfair), "Playfair Display", Georgia, serif`;
const instrument = () => `var(--font-instrument), "Instrument Serif", Georgia, serif`;
const inter = () => `var(--font-inter), "Inter", system-ui, sans-serif`;
const jetbrains = () => `var(--font-jetbrains), "JetBrains Mono", monospace`;

/* ═══════════════════════════════════════════════════
   SVG COMPONENTS
   ═══════════════════════════════════════════════════ */

function EdisonBulbSVG({ size = 280, glow = false }: { size?: number; glow?: boolean }) {
  return (
    <svg
      width={size}
      height={size * 1.4}
      viewBox="0 0 200 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: glow ? `drop-shadow(0 0 20px ${C.amberGlow})` : "none" }}
    >
      {/* Bulb glass */}
      <path
        d="M100 20 C50 20 20 70 20 120 C20 160 40 180 60 200 L60 220 L140 220 L140 200 C160 180 180 160 180 120 C180 70 150 20 100 20Z"
        stroke={C.amber}
        strokeWidth="1.5"
        fill="none"
        opacity={glow ? 0.8 : 0.3}
        className="bulb-glass"
      />
      {/* Filament support wires */}
      <line x1="80" y1="220" x2="80" y2="160" stroke={C.brass} strokeWidth="1" opacity="0.5" />
      <line x1="120" y1="220" x2="120" y2="160" stroke={C.brass} strokeWidth="1" opacity="0.5" />
      {/* Filament coil */}
      <path
        d="M80 160 C85 150, 90 155, 92 145 C94 135, 96 140, 100 130 C104 140, 106 135, 108 145 C110 155, 115 150, 120 160"
        stroke={glow ? C.filamentCore : C.amber}
        strokeWidth={glow ? "2.5" : "1.5"}
        fill="none"
        className="filament-coil"
        style={{
          filter: glow ? `drop-shadow(0 0 8px ${C.amber}) drop-shadow(0 0 16px ${C.amberGlow})` : "none",
        }}
      />
      {/* Socket base */}
      <rect x="55" y="220" width="90" height="8" rx="2" fill={C.brass} opacity="0.6" />
      <rect x="60" y="228" width="80" height="6" rx="2" fill={C.brass} opacity="0.4" />
      <rect x="65" y="234" width="70" height="6" rx="2" fill={C.brass} opacity="0.3" />
      {/* Thread lines on socket */}
      {[220, 224, 228, 232].map((y) => (
        <line key={y} x1="55" y1={y} x2="145" y2={y} stroke={C.brass} strokeWidth="0.5" opacity="0.2" />
      ))}
      {/* Contact tip */}
      <circle cx="100" cy="246" r="6" fill={C.brass} opacity="0.5" />
    </svg>
  );
}

function FilamentWireSVG({ width = 600 }: { width?: number }) {
  return (
    <svg
      width={width}
      height="60"
      viewBox="0 0 600 60"
      fill="none"
      style={{ overflow: "visible" }}
    >
      <path
        d="M0 30 C50 10, 100 50, 150 30 C200 10, 250 50, 300 30 C350 10, 400 50, 450 30 C500 10, 550 50, 600 30"
        stroke={C.amber}
        strokeWidth="1.5"
        fill="none"
        opacity="0.3"
        className="wire-path"
      />
      {/* Glow dots along the wire */}
      {[75, 225, 375, 525].map((cx, i) => (
        <circle key={i} cx={cx} cy="30" r="3" fill={C.amber} opacity="0.4" className="wire-glow-dot" />
      ))}
    </svg>
  );
}

function BulbTypeIcon({ type, size = 60 }: { type: "edison" | "globe" | "tube" | "candle"; size?: number }) {
  const h = size * 1.5;
  return (
    <svg width={size} height={h} viewBox="0 0 60 90" fill="none">
      {type === "edison" && (
        <>
          <path d="M30 8 C15 8 5 28 5 45 C5 58 15 65 22 72 L22 78 L38 78 L38 72 C45 65 55 58 55 45 C55 28 45 8 30 8Z" stroke={C.amber} strokeWidth="1" fill="none" opacity="0.5" />
          <path d="M22 55 C25 48, 28 52, 30 45 C32 52, 35 48, 38 55" stroke={C.filamentCore} strokeWidth="1.5" fill="none" className="filament-coil" />
          <rect x="20" y="78" width="20" height="8" rx="2" fill={C.brass} opacity="0.4" />
        </>
      )}
      {type === "globe" && (
        <>
          <circle cx="30" cy="38" r="26" stroke={C.amber} strokeWidth="1" fill="none" opacity="0.5" />
          <path d="M25 38 C28 32, 32 32, 35 38" stroke={C.filamentCore} strokeWidth="1.5" fill="none" className="filament-coil" />
          <rect x="23" y="64" width="14" height="8" rx="2" fill={C.brass} opacity="0.4" />
        </>
      )}
      {type === "tube" && (
        <>
          <rect x="18" y="8" width="24" height="60" rx="12" stroke={C.amber} strokeWidth="1" fill="none" opacity="0.5" />
          <line x1="30" y1="20" x2="30" y2="55" stroke={C.filamentCore} strokeWidth="1.5" className="filament-coil" />
          <rect x="20" y="68" width="20" height="8" rx="2" fill={C.brass} opacity="0.4" />
        </>
      )}
      {type === "candle" && (
        <>
          <path d="M30 8 C22 8 15 25 15 45 C15 55 18 62 22 68 L22 78 L38 78 L38 68 C42 62 45 55 45 45 C45 25 38 8 30 8Z" stroke={C.amber} strokeWidth="1" fill="none" opacity="0.5" />
          <path d="M28 40 L30 30 L32 40" stroke={C.filamentCore} strokeWidth="1.5" fill="none" className="filament-coil" />
          <rect x="20" y="78" width="20" height="6" rx="2" fill={C.brass} opacity="0.4" />
        </>
      )}
    </svg>
  );
}

function DimmerSwitchSVG() {
  return (
    <svg width="40" height="80" viewBox="0 0 40 80" fill="none" style={{ opacity: 0.3 }}>
      <rect x="5" y="5" width="30" height="70" rx="4" stroke={C.warmGray} strokeWidth="1" fill="none" />
      <rect x="12" y="15" width="16" height="40" rx="8" stroke={C.amber} strokeWidth="1" fill="none" />
      <circle cx="20" cy="35" r="6" fill={C.amber} opacity="0.3" />
      <line x1="20" y1="55" x2="20" y2="65" stroke={C.warmGray} strokeWidth="1" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════
   REUSABLE ANIMATED COMPONENTS
   ═══════════════════════════════════════════════════ */

function FadeInSection({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function GlowText({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <span
      style={{
        color: C.amber,
        textShadow: `0 0 10px ${C.amberGlow}, 0 0 30px ${C.amberGlow}, 0 0 60px rgba(255,179,71,0.15)`,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

/* ═══════════════════════════════════════════════════
   PROJECT CARD — Bulb-framed card
   ═══════════════════════════════════════════════════ */

function ProjectCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);
  const titleLines = project.title.split("\n");

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index % 2 === 0 ? 0 : 0.15, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        background: hovered
          ? `radial-gradient(ellipse at 50% 30%, rgba(255,179,71,0.08), ${C.darkGlass} 70%)`
          : C.darkGlass,
        border: `1px solid ${hovered ? C.amber + "40" : C.border}`,
        borderRadius: "16px",
        overflow: "hidden",
        transition: "all 0.5s ease",
        cursor: "pointer",
      }}
    >
      {/* Bulb silhouette clip overlay */}
      <div
        style={{
          position: "absolute",
          top: "-20px",
          right: "-20px",
          opacity: hovered ? 0.15 : 0.05,
          transition: "opacity 0.5s ease",
          pointerEvents: "none",
        }}
      >
        <EdisonBulbSVG size={140} glow={hovered} />
      </div>

      {/* Filament glow indicator */}
      <motion.div
        animate={{
          opacity: hovered ? 1 : 0.3,
          scale: hovered ? 1.2 : 1,
        }}
        transition={{ duration: 0.4 }}
        style={{
          position: "absolute",
          top: "16px",
          left: "16px",
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: C.amber,
          boxShadow: hovered
            ? `0 0 8px ${C.amber}, 0 0 20px ${C.amberGlow}`
            : "none",
        }}
      />

      {/* Content */}
      <div style={{ padding: "28px 24px 24px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
          <div>
            <span
              style={{
                fontFamily: jetbrains(),
                fontSize: "10px",
                letterSpacing: "0.15em",
                color: C.amber,
                textTransform: "uppercase",
                opacity: 0.7,
              }}
            >
              {project.client} &mdash; {project.year}
            </span>
            <h3
              style={{
                fontFamily: playfair(),
                fontSize: "22px",
                lineHeight: 1.2,
                color: C.text,
                marginTop: "6px",
              }}
            >
              {titleLines.map((line, i) => (
                <span key={i}>
                  {i === 0 ? <GlowText style={{ textShadow: hovered ? undefined : "none", color: hovered ? C.amber : C.text }}>{line}</GlowText> : line}
                  {i < titleLines.length - 1 && <br />}
                </span>
              ))}
            </h3>
          </div>
          <span
            style={{
              fontFamily: jetbrains(),
              fontSize: "11px",
              color: C.brass,
              opacity: 0.5,
              whiteSpace: "nowrap",
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Description */}
        <p
          style={{
            fontFamily: inter(),
            fontSize: "13px",
            lineHeight: 1.65,
            color: C.textMuted,
            marginBottom: "14px",
          }}
        >
          {project.description}
        </p>

        {/* Technical detail */}
        <p
          style={{
            fontFamily: inter(),
            fontSize: "12px",
            lineHeight: 1.6,
            color: "rgba(255,245,212,0.3)",
            marginBottom: "16px",
            fontStyle: "italic",
          }}
        >
          {project.technical}
        </p>

        {/* Tech tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "14px" }}>
          {project.tech.map((t) => (
            <span
              key={t}
              style={{
                fontFamily: jetbrains(),
                fontSize: "10px",
                padding: "3px 10px",
                borderRadius: "20px",
                background: C.amberMuted,
                color: C.amber,
                border: `1px solid ${C.border}`,
                letterSpacing: "0.03em",
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Footer wire */}
        <div
          style={{
            height: "1px",
            background: `linear-gradient(90deg, transparent, ${C.amber}30, transparent)`,
            marginBottom: "12px",
          }}
        />

        {/* GitHub link */}
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: jetbrains(),
            fontSize: "11px",
            color: C.amber,
            opacity: 0.6,
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transition: "opacity 0.3s",
          }}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.opacity = "1")}
          onMouseLeave={(e) => ((e.target as HTMLElement).style.opacity = "0.6")}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          View Source
        </a>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   EXPERTISE CARD — Light fixture style
   ═══════════════════════════════════════════════════ */

const bulbTypes: Array<"edison" | "globe" | "tube" | "candle"> = ["edison", "globe", "tube", "candle"];

function ExpertiseCard({ item, index }: { item: (typeof expertise)[number]; index: number }) {
  const ref = useRef(null);
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
      style={{
        position: "relative",
        textAlign: "center",
        padding: "40px 24px 32px",
        background: hovered
          ? `radial-gradient(ellipse at 50% 20%, rgba(255,179,71,0.06), transparent 70%)`
          : "transparent",
        border: `1px solid ${hovered ? C.border : "transparent"}`,
        borderRadius: "12px",
        transition: "all 0.5s ease",
      }}
    >
      {/* Cord from top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          width: "1px",
          height: "20px",
          background: C.brass,
          opacity: 0.3,
        }}
      />

      {/* Bulb icon */}
      <motion.div
        animate={{
          filter: hovered
            ? `drop-shadow(0 0 12px ${C.amberGlow}) drop-shadow(0 0 24px rgba(255,179,71,0.15))`
            : "none",
        }}
        transition={{ duration: 0.4 }}
        style={{ display: "inline-block", marginBottom: "20px" }}
      >
        <BulbTypeIcon type={bulbTypes[index]} size={50} />
      </motion.div>

      <h4
        style={{
          fontFamily: playfair(),
          fontSize: "18px",
          color: C.text,
          marginBottom: "12px",
          letterSpacing: "0.01em",
        }}
      >
        {item.title}
      </h4>

      <p
        style={{
          fontFamily: inter(),
          fontSize: "13px",
          lineHeight: 1.7,
          color: C.textMuted,
        }}
      >
        {item.body}
      </p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   TOOLS — Wiring diagram layout
   ═══════════════════════════════════════════════════ */

function ToolCategory({ category, index }: { category: (typeof tools)[number]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        padding: "20px 24px",
        border: `1px solid ${hovered ? C.amber + "30" : C.border}`,
        borderRadius: "10px",
        background: hovered ? `rgba(255,179,71,0.03)` : "transparent",
        transition: "all 0.4s ease",
      }}
    >
      {/* Wire connector dot on left */}
      <div
        style={{
          position: "absolute",
          left: "-5px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          background: hovered ? C.amber : C.warmGray,
          border: `2px solid ${C.darkGlass}`,
          transition: "background 0.4s",
          boxShadow: hovered ? `0 0 8px ${C.amberGlow}` : "none",
        }}
      />

      {/* Category label */}
      <div
        style={{
          fontFamily: jetbrains(),
          fontSize: "10px",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: C.amber,
          marginBottom: "12px",
          opacity: 0.7,
        }}
      >
        {category.label}
      </div>

      {/* Items */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {category.items.map((item) => (
          <span
            key={item}
            style={{
              fontFamily: inter(),
              fontSize: "12px",
              padding: "4px 12px",
              borderRadius: "6px",
              background: C.amberMuted,
              color: C.tungsten,
              border: `1px solid ${C.border}`,
              transition: "all 0.3s",
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════ */

export default function FilamentPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  /* ── Dim-to-bright background interpolation ── */
  const bgR = useTransform(scrollYProgress, [0, 0.5, 1], [5, 20, 35]);
  const bgG = useTransform(scrollYProgress, [0, 0.5, 1], [5, 14, 26]);
  const bgB = useTransform(scrollYProgress, [0, 0.5, 1], [5, 6, 14]);
  const ambientOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.03, 0.08, 0.14]);
  const heroGlow = useTransform(scrollYProgress, [0, 0.15], [0.4, 1]);
  const titleBlur = useTransform(scrollYProgress, [0, 0.08], [3, 0]);

  return (
    <>
      {/* Global keyframes */}
      <style>{`
        @keyframes filament-pulse {
          0%, 100% {
            opacity: 0.6;
            filter: drop-shadow(0 0 4px rgba(255,179,71,0.3));
          }
          50% {
            opacity: 1;
            filter: drop-shadow(0 0 12px rgba(255,179,71,0.6)) drop-shadow(0 0 24px rgba(255,179,71,0.3));
          }
        }

        @keyframes filament-flicker {
          0%, 100% { opacity: 1; }
          4% { opacity: 0.85; }
          6% { opacity: 1; }
          12% { opacity: 0.9; }
          14% { opacity: 1; }
          40% { opacity: 0.95; }
          42% { opacity: 1; }
          68% { opacity: 0.92; }
          70% { opacity: 1; }
        }

        @keyframes wire-draw {
          from { stroke-dashoffset: 1000; }
          to { stroke-dashoffset: 0; }
        }

        @keyframes glow-expand {
          0% {
            box-shadow: 0 0 4px rgba(255,179,71,0.1);
          }
          50% {
            box-shadow: 0 0 20px rgba(255,179,71,0.2), 0 0 40px rgba(255,179,71,0.1);
          }
          100% {
            box-shadow: 0 0 4px rgba(255,179,71,0.1);
          }
        }

        @keyframes dim-pulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 0.2; }
        }

        @keyframes warm-drift {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        .filament-coil {
          animation: filament-pulse 3s ease-in-out infinite;
        }

        .wire-path {
          stroke-dasharray: 1000;
          animation: wire-draw 4s ease forwards;
        }

        .wire-glow-dot {
          animation: filament-pulse 2.5s ease-in-out infinite;
        }

        .bulb-glass {
          animation: filament-flicker 8s ease-in-out infinite;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: ${C.darkest};
        }
        ::-webkit-scrollbar-thumb {
          background: ${C.warmGray};
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: ${C.amber};
        }
      `}</style>

      <motion.div
        ref={containerRef}
        style={{
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated background layer */}
        <motion.div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            background: useTransform(
              [bgR, bgG, bgB],
              ([r, g, b]) => `rgb(${Math.round(r as number)}, ${Math.round(g as number)}, ${Math.round(b as number)})`
            ),
          }}
        />

        {/* Warm ambient radial glow that builds */}
        <motion.div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            background: `radial-gradient(ellipse at 50% 30%, ${C.amber}, transparent 70%)`,
            opacity: ambientOpacity,
            pointerEvents: "none",
          }}
        />

        {/* Content container */}
        <div style={{ position: "relative", zIndex: 1 }}>

          {/* ═══════════════════════════════════════
              HERO SECTION
              ═══════════════════════════════════════ */}
          <section
            style={{
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px 24px",
              position: "relative",
            }}
          >
            {/* Dimmer switch decoration */}
            <div style={{ position: "absolute", left: "40px", top: "50%", transform: "translateY(-50%)" }}>
              <DimmerSwitchSVG />
            </div>

            {/* Central bulb */}
            <motion.div
              style={{
                filter: useTransform(
                  heroGlow,
                  (v) => `drop-shadow(0 0 ${30 * (v as number)}px ${C.amberGlow}) drop-shadow(0 0 ${60 * (v as number)}px rgba(255,179,71,0.15))`
                ),
                marginBottom: "32px",
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <EdisonBulbSVG size={180} glow={true} />
            </motion.div>

            {/* FILAMENT title */}
            <motion.h1
              style={{
                fontFamily: playfair(),
                fontSize: "clamp(48px, 10vw, 120px)",
                fontWeight: 400,
                letterSpacing: "0.25em",
                color: C.amber,
                textAlign: "center",
                textShadow: `0 0 20px ${C.amberGlow}, 0 0 60px ${C.amberGlow}, 0 0 100px rgba(255,179,71,0.1)`,
                filter: useTransform(titleBlur, (v) => `blur(${v as number}px)`),
                marginBottom: "16px",
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              FILAMENT
            </motion.h1>

            {/* Icon */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ duration: 1, delay: 0.6 }}
              style={{
                fontFamily: inter(),
                fontSize: "24px",
                color: C.amber,
                marginBottom: "16px",
              }}
            >
              ◍
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              style={{
                fontFamily: instrument(),
                fontSize: "clamp(18px, 3vw, 28px)",
                color: C.tungsten,
                textAlign: "center",
                fontStyle: "italic",
                opacity: 0.7,
                marginBottom: "48px",
              }}
            >
              Ideas illuminated
            </motion.p>

            {/* Stats as wattage readings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              style={{
                display: "flex",
                gap: "48px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {stats.map((stat, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontFamily: jetbrains(),
                      fontSize: "32px",
                      fontWeight: 700,
                      color: C.amber,
                      textShadow: `0 0 12px ${C.amberGlow}`,
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontFamily: jetbrains(),
                      fontSize: "9px",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: C.textMuted,
                      marginTop: "8px",
                    }}
                  >
                    {stat.label}
                  </div>
                  <div
                    style={{
                      fontFamily: jetbrains(),
                      fontSize: "8px",
                      color: C.brass,
                      marginTop: "4px",
                      opacity: 0.4,
                    }}
                  >
                    {i === 0 ? "WATT" : i === 1 ? "VOLT" : "AMP"}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Scroll hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              style={{
                position: "absolute",
                bottom: "40px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span
                style={{
                  fontFamily: jetbrains(),
                  fontSize: "9px",
                  letterSpacing: "0.2em",
                  color: C.textMuted,
                  textTransform: "uppercase",
                }}
              >
                Turn up the brightness
              </span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{ color: C.amber, opacity: 0.4 }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </motion.div>
            </motion.div>
          </section>

          {/* Decorative wire separator */}
          <div style={{ maxWidth: "700px", margin: "0 auto", padding: "0 24px" }}>
            <FilamentWireSVG width={700} />
          </div>

          {/* ═══════════════════════════════════════
              PROJECTS SECTION
              ═══════════════════════════════════════ */}
          <section style={{ padding: "80px 24px 100px", maxWidth: "1100px", margin: "0 auto" }}>
            <FadeInSection>
              <div style={{ textAlign: "center", marginBottom: "64px" }}>
                <span
                  style={{
                    fontFamily: jetbrains(),
                    fontSize: "10px",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: C.brass,
                  }}
                >
                  Illuminated Works
                </span>
                <h2
                  style={{
                    fontFamily: playfair(),
                    fontSize: "clamp(32px, 5vw, 52px)",
                    color: C.text,
                    marginTop: "12px",
                    fontWeight: 400,
                  }}
                >
                  <GlowText>Projects</GlowText>
                </h2>
                <p
                  style={{
                    fontFamily: instrument(),
                    fontSize: "16px",
                    color: C.textMuted,
                    marginTop: "12px",
                    fontStyle: "italic",
                  }}
                >
                  Each idea, a glowing filament
                </p>
              </div>
            </FadeInSection>

            {/* Connecting wire SVG behind projects */}
            <div style={{ position: "relative" }}>
              {/* Vertical wire backbone */}
              <svg
                style={{
                  position: "absolute",
                  left: "50%",
                  top: 0,
                  height: "100%",
                  width: "2px",
                  transform: "translateX(-50%)",
                  zIndex: 0,
                  overflow: "visible",
                }}
              >
                <line
                  x1="1"
                  y1="0"
                  x2="1"
                  y2="100%"
                  stroke={C.amber}
                  strokeWidth="1"
                  opacity="0.1"
                  strokeDasharray="4 8"
                />
              </svg>

              {/* Project grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 480px), 1fr))",
                  gap: "32px",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {projects.map((project, i) => (
                  <ProjectCard key={i} project={project} index={i} />
                ))}
              </div>
            </div>
          </section>

          {/* Wire separator */}
          <div style={{ maxWidth: "700px", margin: "0 auto", padding: "0 24px" }}>
            <FilamentWireSVG width={700} />
          </div>

          {/* ═══════════════════════════════════════
              EXPERTISE SECTION — Light Fixtures
              ═══════════════════════════════════════ */}
          <section style={{ padding: "80px 24px 100px", maxWidth: "1000px", margin: "0 auto" }}>
            <FadeInSection>
              <div style={{ textAlign: "center", marginBottom: "60px" }}>
                <span
                  style={{
                    fontFamily: jetbrains(),
                    fontSize: "10px",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: C.brass,
                  }}
                >
                  Core Luminance
                </span>
                <h2
                  style={{
                    fontFamily: playfair(),
                    fontSize: "clamp(32px, 5vw, 48px)",
                    color: C.text,
                    marginTop: "12px",
                    fontWeight: 400,
                  }}
                >
                  <GlowText>Expertise</GlowText>
                </h2>
              </div>
            </FadeInSection>

            {/* Hanging cord SVG decoration */}
            <div style={{ position: "relative" }}>
              {/* Top rail wire */}
              <FadeInSection>
                <svg
                  width="100%"
                  height="30"
                  viewBox="0 0 1000 30"
                  preserveAspectRatio="none"
                  style={{ display: "block", marginBottom: "0px", overflow: "visible" }}
                >
                  <line x1="0" y1="15" x2="1000" y2="15" stroke={C.brass} strokeWidth="1.5" opacity="0.25" />
                  {/* Hanging cord attachment points */}
                  {[125, 375, 625, 875].map((x, i) => (
                    <g key={i}>
                      <circle cx={x} cy="15" r="4" fill={C.brass} opacity="0.3" />
                      <line x1={x} y1="15" x2={x} y2="30" stroke={C.brass} strokeWidth="1" opacity="0.2" />
                    </g>
                  ))}
                </svg>
              </FadeInSection>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "24px",
                }}
              >
                {expertise.map((item, i) => (
                  <ExpertiseCard key={i} item={item} index={i} />
                ))}
              </div>
            </div>
          </section>

          {/* Wire separator */}
          <div style={{ maxWidth: "700px", margin: "0 auto", padding: "0 24px" }}>
            <FilamentWireSVG width={700} />
          </div>

          {/* ═══════════════════════════════════════
              TOOLS SECTION — Wiring Diagram
              ═══════════════════════════════════════ */}
          <section style={{ padding: "80px 24px 100px", maxWidth: "900px", margin: "0 auto" }}>
            <FadeInSection>
              <div style={{ textAlign: "center", marginBottom: "60px" }}>
                <span
                  style={{
                    fontFamily: jetbrains(),
                    fontSize: "10px",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: C.brass,
                  }}
                >
                  Wiring Diagram
                </span>
                <h2
                  style={{
                    fontFamily: playfair(),
                    fontSize: "clamp(32px, 5vw, 48px)",
                    color: C.text,
                    marginTop: "12px",
                    fontWeight: 400,
                  }}
                >
                  <GlowText>Tools &amp; Stack</GlowText>
                </h2>
                <p
                  style={{
                    fontFamily: instrument(),
                    fontSize: "15px",
                    color: C.textMuted,
                    marginTop: "10px",
                    fontStyle: "italic",
                  }}
                >
                  The circuitry behind every build
                </p>
              </div>
            </FadeInSection>

            {/* Wiring diagram layout */}
            <div style={{ position: "relative" }}>
              {/* Vertical backbone wire */}
              <svg
                style={{
                  position: "absolute",
                  left: "24px",
                  top: 0,
                  height: "100%",
                  width: "2px",
                  overflow: "visible",
                  zIndex: 0,
                }}
              >
                <line
                  x1="1"
                  y1="0"
                  x2="1"
                  y2="100%"
                  stroke={C.amber}
                  strokeWidth="1"
                  opacity="0.15"
                />
                {/* Junction dots */}
                {tools.map((_, i) => (
                  <circle
                    key={i}
                    cx="1"
                    cy={`${(i + 0.5) * (100 / tools.length)}%`}
                    r="3"
                    fill={C.amber}
                    opacity="0.2"
                  />
                ))}
              </svg>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "16px",
                  paddingLeft: "40px",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {tools.map((category, i) => (
                  <ToolCategory key={i} category={category} index={i} />
                ))}
              </div>
            </div>

            {/* Circuit diagram footer decoration */}
            <FadeInSection delay={0.3}>
              <svg
                width="100%"
                height="60"
                viewBox="0 0 900 60"
                preserveAspectRatio="none"
                style={{ marginTop: "48px", overflow: "visible" }}
              >
                {/* Ground symbol */}
                <g transform="translate(450, 10)">
                  <line x1="0" y1="0" x2="0" y2="15" stroke={C.amber} strokeWidth="1" opacity="0.3" />
                  <line x1="-15" y1="15" x2="15" y2="15" stroke={C.amber} strokeWidth="1" opacity="0.3" />
                  <line x1="-10" y1="22" x2="10" y2="22" stroke={C.amber} strokeWidth="1" opacity="0.25" />
                  <line x1="-5" y1="29" x2="5" y2="29" stroke={C.amber} strokeWidth="1" opacity="0.2" />
                </g>
                {/* Horizontal wire */}
                <line x1="100" y1="10" x2="400" y2="10" stroke={C.amber} strokeWidth="0.5" opacity="0.1" />
                <line x1="500" y1="10" x2="800" y2="10" stroke={C.amber} strokeWidth="0.5" opacity="0.1" />
                {/* Resistor symbol */}
                <path
                  d="M200 10 L210 0 L220 20 L230 0 L240 20 L250 0 L260 10"
                  stroke={C.amber}
                  strokeWidth="0.8"
                  fill="none"
                  opacity="0.15"
                />
                {/* Capacitor symbol */}
                <g transform="translate(700, 0)">
                  <line x1="0" y1="10" x2="0" y2="0" stroke={C.amber} strokeWidth="0.8" opacity="0.15" />
                  <line x1="0" y1="20" x2="0" y2="10" stroke={C.amber} strokeWidth="0.8" opacity="0.15" />
                  <line x1="-8" y1="7" x2="8" y2="7" stroke={C.amber} strokeWidth="1" opacity="0.15" />
                  <path d="M-8 13 Q0 10, 8 13" stroke={C.amber} strokeWidth="1" fill="none" opacity="0.15" />
                </g>
              </svg>
            </FadeInSection>
          </section>

          {/* ═══════════════════════════════════════
              FOOTER
              ═══════════════════════════════════════ */}
          <footer style={{ padding: "80px 24px 48px", textAlign: "center", position: "relative" }}>
            {/* Top wire */}
            <div
              style={{
                width: "120px",
                height: "1px",
                background: `linear-gradient(90deg, transparent, ${C.amber}40, transparent)`,
                margin: "0 auto 48px",
              }}
            />

            {/* Dimming bulb */}
            <FadeInSection>
              <motion.div
                animate={{ opacity: [0.8, 0.3, 0.6, 0.2, 0.7, 0.4] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                style={{ marginBottom: "32px" }}
              >
                <EdisonBulbSVG size={80} glow={true} />
              </motion.div>
            </FadeInSection>

            <FadeInSection delay={0.1}>
              <h3
                style={{
                  fontFamily: playfair(),
                  fontSize: "clamp(24px, 4vw, 42px)",
                  letterSpacing: "0.2em",
                  fontWeight: 400,
                  marginBottom: "16px",
                }}
              >
                <GlowText>POWERED BY IDEAS</GlowText>
              </h3>
            </FadeInSection>

            <FadeInSection delay={0.2}>
              <p
                style={{
                  fontFamily: instrument(),
                  fontSize: "16px",
                  color: C.textMuted,
                  fontStyle: "italic",
                  marginBottom: "24px",
                }}
              >
                &ldquo;Genius is one percent inspiration, ninety-nine percent perspiration.&rdquo;
              </p>
            </FadeInSection>

            <FadeInSection delay={0.3}>
              <div
                style={{
                  fontFamily: jetbrains(),
                  fontSize: "10px",
                  letterSpacing: "0.15em",
                  color: C.warmGray,
                  marginBottom: "8px",
                }}
              >
                PATENT No. 223,898
              </div>
              <div
                style={{
                  fontFamily: playfair(),
                  fontSize: "14px",
                  color: C.amber,
                  opacity: 0.5,
                  letterSpacing: "0.15em",
                }}
              >
                Edison Studios
              </div>
            </FadeInSection>

            {/* Bottom filament decoration */}
            <FadeInSection delay={0.4}>
              <svg
                width="200"
                height="40"
                viewBox="0 0 200 40"
                fill="none"
                style={{ margin: "32px auto 0", display: "block" }}
              >
                {/* Filament coil */}
                <path
                  d="M40 20 C50 8, 60 32, 70 20 C80 8, 90 32, 100 20 C110 8, 120 32, 130 20 C140 8, 150 32, 160 20"
                  stroke={C.amber}
                  strokeWidth="1.5"
                  fill="none"
                  opacity="0.3"
                  className="filament-coil"
                />
                {/* End caps */}
                <circle cx="40" cy="20" r="3" fill={C.brass} opacity="0.3" />
                <circle cx="160" cy="20" r="3" fill={C.brass} opacity="0.3" />
              </svg>
            </FadeInSection>

            {/* Copyright */}
            <FadeInSection delay={0.5}>
              <div
                style={{
                  fontFamily: inter(),
                  fontSize: "11px",
                  color: C.textMuted,
                  marginTop: "40px",
                  opacity: 0.4,
                }}
              >
                &copy; {new Date().getFullYear()} &middot; Handcrafted with tungsten &amp; code
              </div>
            </FadeInSection>
          </footer>

          {/* Theme Switcher */}
          <ThemeSwitcher current="/filament" variant="dark" />
        </div>
      </motion.div>
    </>
  );
}
