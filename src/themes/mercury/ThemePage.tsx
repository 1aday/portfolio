"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "@/app/data/projects";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";

/* ── Palette ── */
const BG = "#050505";
const SURFACE = "#0C0C14";
const SILVER = "#C0C0C0";
const CHROME = "#E8E8E8";
const MERCURY_BLUE = "#7B8FA1";
const DARK_REFLECT = "#1A1A2E";
const BRIGHT = "#FFFFFF";
const WARM_CHROME = "#D4D0C8";
const MUTED = "#555566";
const GUNMETAL = "#2A2A3E";

/* ── Font vars ── */
const heading = "font-[family-name:var(--font-space-grotesk)]";
const body = "font-[family-name:var(--font-inter)]";
const mono = "font-[family-name:var(--font-jetbrains)]";
const display = "font-[family-name:var(--font-sora)]";

/* ── Chrome gradient strings ── */
const CHROME_GRAD = `linear-gradient(135deg, ${GUNMETAL}, ${SILVER}, ${BRIGHT}, ${SILVER}, ${GUNMETAL})`;
const CHROME_BORDER_GRAD = `linear-gradient(var(--mercury-angle, 0deg), ${DARK_REFLECT}, ${SILVER}, ${CHROME}, ${SILVER}, ${DARK_REFLECT})`;
const POOL_GRAD = `linear-gradient(180deg, ${SILVER}18, transparent)`;

/* ──────────────────────────────────────────────────────────
   Global Keyframes
   ────────────────────────────────────────────────────────── */
function Styles() {
  return (
    <style>{`
      @keyframes mercury-rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes blob-morph {
        0%, 100% {
          border-radius: 60% 40% 55% 45% / 50% 60% 42% 58%;
        }
        25% {
          border-radius: 42% 58% 48% 52% / 62% 38% 55% 45%;
        }
        50% {
          border-radius: 55% 45% 38% 62% / 45% 55% 60% 40%;
        }
        75% {
          border-radius: 48% 52% 62% 38% / 55% 45% 48% 52%;
        }
      }
      @keyframes chrome-shimmer {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      @keyframes mercury-pool {
        0% { transform: scaleX(0.4) scaleY(0.1); opacity: 0; }
        60% { transform: scaleX(1.1) scaleY(0.9); opacity: 0.8; }
        80% { transform: scaleX(0.95) scaleY(1.05); opacity: 1; }
        100% { transform: scaleX(1) scaleY(1); opacity: 1; }
      }
      @keyframes drip {
        0% { transform: translateY(-10px) scaleY(0.3); opacity: 0; }
        30% { transform: translateY(0px) scaleY(1.4); opacity: 1; }
        50% { transform: translateY(4px) scaleY(0.8); opacity: 1; }
        70% { transform: translateY(1px) scaleY(1.1); opacity: 1; }
        100% { transform: translateY(0px) scaleY(1); opacity: 1; }
      }
      @keyframes reflection-slide {
        0% { transform: translateX(-100%) skewX(-15deg); }
        100% { transform: translateX(300%) skewX(-15deg); }
      }
      @keyframes surface-wave {
        0%, 100% { d: path("M0,8 Q60,0 120,8 T240,8 T360,8 L360,16 L0,16 Z"); }
        50% { d: path("M0,4 Q60,12 120,4 T240,4 T360,4 L360,16 L0,16 Z"); }
      }
      @keyframes droplet-pool {
        0% { transform: scale(0) translateY(-40px); opacity: 0; }
        50% { transform: scale(1.15) translateY(0px); opacity: 1; }
        70% { transform: scale(0.95) translateY(2px); opacity: 1; }
        100% { transform: scale(1) translateY(0); opacity: 1; }
      }
      @keyframes sphere-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes float-slow {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-12px); }
      }
      @keyframes solidify {
        0% { filter: blur(4px); opacity: 0.3; }
        40% { filter: blur(1px); opacity: 0.7; }
        100% { filter: blur(0); opacity: 1; }
      }
      @keyframes border-flow {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      .mercury-chrome-text {
        background: linear-gradient(
          180deg,
          ${GUNMETAL} 0%,
          ${MUTED} 15%,
          ${SILVER} 30%,
          ${BRIGHT} 50%,
          ${SILVER} 70%,
          ${MUTED} 85%,
          ${GUNMETAL} 100%
        );
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }
      .mercury-shimmer {
        background: ${CHROME_GRAD};
        background-size: 300% 300%;
        animation: chrome-shimmer 6s ease infinite;
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }
      .mercury-border-anim {
        background: linear-gradient(135deg, ${DARK_REFLECT}, ${SILVER}, ${CHROME}, ${SILVER}, ${DARK_REFLECT});
        background-size: 300% 300%;
        animation: chrome-shimmer 4s ease infinite;
        padding: 1px;
        border-radius: 12px;
      }
      .mercury-border-anim:hover {
        padding: 2px;
      }
      .mercury-blob {
        animation: blob-morph 8s ease-in-out infinite;
      }
      .mercury-reflection-slide::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(90deg, transparent, ${BRIGHT}15, transparent);
        animation: reflection-slide 4s ease-in-out infinite;
        pointer-events: none;
      }
      .mercury-pool-anim {
        animation: mercury-pool 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      }
      .mercury-droplet-anim {
        animation: droplet-pool 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      }
    `}</style>
  );
}

/* ──────────────────────────────────────────────────────────
   SVG Components
   ────────────────────────────────────────────────────────── */

/* Large morphing blob for hero */
function MorphingBlob({ size = 400, delay = 0 }: { size?: number; delay?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 400 400"
      style={{ filter: `blur(1px)`, overflow: "visible" }}
    >
      <defs>
        <radialGradient id="blob-chrome" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor={BRIGHT} />
          <stop offset="25%" stopColor={CHROME} />
          <stop offset="50%" stopColor={SILVER} />
          <stop offset="75%" stopColor={MERCURY_BLUE} />
          <stop offset="100%" stopColor={DARK_REFLECT} />
        </radialGradient>
        <radialGradient id="blob-highlight" cx="30%" cy="25%" r="30%">
          <stop offset="0%" stopColor={BRIGHT} stopOpacity="0.9" />
          <stop offset="100%" stopColor={BRIGHT} stopOpacity="0" />
        </radialGradient>
        <filter id="blob-glow">
          <feGaussianBlur stdDeviation="8" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#blob-glow)">
        <ellipse
          cx="200"
          cy="200"
          rx="140"
          ry="130"
          fill="url(#blob-chrome)"
          style={{
            animation: `blob-morph 8s ease-in-out ${delay}s infinite`,
            transformOrigin: "center",
          }}
        />
        <ellipse
          cx="175"
          cy="170"
          rx="60"
          ry="50"
          fill="url(#blob-highlight)"
          style={{
            animation: `blob-morph 6s ease-in-out ${delay + 1}s infinite reverse`,
            transformOrigin: "center",
          }}
        />
      </g>
    </svg>
  );
}

/* Chrome sphere with reflections */
function ChromeSphere({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      <defs>
        <radialGradient id="sphere-main" cx="40%" cy="35%" r="55%">
          <stop offset="0%" stopColor={BRIGHT} />
          <stop offset="30%" stopColor={CHROME} />
          <stop offset="60%" stopColor={SILVER} />
          <stop offset="85%" stopColor={MERCURY_BLUE} />
          <stop offset="100%" stopColor={DARK_REFLECT} />
        </radialGradient>
        <radialGradient id="sphere-gloss" cx="35%" cy="28%" r="25%">
          <stop offset="0%" stopColor={BRIGHT} stopOpacity="0.95" />
          <stop offset="100%" stopColor={BRIGHT} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sphere-rim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={SILVER} stopOpacity="0.4" />
          <stop offset="100%" stopColor={DARK_REFLECT} stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="55" fill="url(#sphere-main)" />
      <circle cx="60" cy="60" r="55" fill="url(#sphere-rim)" />
      <ellipse cx="48" cy="42" rx="18" ry="14" fill="url(#sphere-gloss)" />
      {/* Small secondary highlight */}
      <ellipse cx="72" cy="75" rx="6" ry="4" fill={BRIGHT} opacity="0.15" />
      {/* Subtle ring reflection */}
      <ellipse cx="60" cy="60" rx="55" ry="55" fill="none" stroke={SILVER} strokeWidth="0.5" opacity="0.3" />
    </svg>
  );
}

/* Mercury droplet shape */
function MercuryDroplet({ size = 80, color = SILVER }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <defs>
        <radialGradient id={`droplet-${size}`} cx="40%" cy="35%" r="50%">
          <stop offset="0%" stopColor={BRIGHT} />
          <stop offset="40%" stopColor={color} />
          <stop offset="100%" stopColor={DARK_REFLECT} />
        </radialGradient>
      </defs>
      <circle cx="40" cy="40" r="35" fill={`url(#droplet-${size})`} />
      <ellipse cx="32" cy="30" rx="10" ry="8" fill={BRIGHT} opacity="0.5" />
    </svg>
  );
}

/* Liquid pool surface line */
function PoolSurface({ width = 360 }: { width?: number }) {
  return (
    <svg width={width} height="16" viewBox="0 0 360 16" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="pool-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={SILVER} stopOpacity="0" />
          <stop offset="30%" stopColor={SILVER} stopOpacity="0.4" />
          <stop offset="50%" stopColor={CHROME} stopOpacity="0.6" />
          <stop offset="70%" stopColor={SILVER} stopOpacity="0.4" />
          <stop offset="100%" stopColor={SILVER} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0,8 Q60,0 120,8 T240,8 T360,8 L360,16 L0,16 Z"
        fill="url(#pool-grad)"
        style={{ animation: "surface-wave 3s ease-in-out infinite" }}
      />
    </svg>
  );
}

/* Chrome reflection gradient overlay for cards */
function ChromeReflection() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(135deg, ${BRIGHT}08 0%, ${SILVER}12 30%, transparent 50%, ${SILVER}08 70%, ${BRIGHT}05 100%)`,
        pointerEvents: "none",
        borderRadius: "inherit",
      }}
    />
  );
}

/* T-1000 style chrome drip SVG */
function ChromeDrip({ width = 200, height = 80 }: { width?: number; height?: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 200 80" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="drip-grad" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor={CHROME} />
          <stop offset="50%" stopColor={SILVER} />
          <stop offset="100%" stopColor={MERCURY_BLUE} stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {/* Central drip */}
      <path
        d="M90,0 Q90,20 88,35 Q86,50 90,55 Q94,60 100,65 Q106,60 110,55 Q114,50 112,35 Q110,20 110,0"
        fill="url(#drip-grad)"
        style={{ animation: "drip 2s ease-out infinite", transformOrigin: "100px 0" }}
      />
      {/* Left minor drip */}
      <path
        d="M50,0 Q50,12 49,20 Q48,28 50,32 Q52,36 55,38 Q58,36 60,32 Q62,28 61,20 Q60,12 60,0"
        fill="url(#drip-grad)"
        opacity="0.6"
        style={{ animation: "drip 2.5s ease-out 0.3s infinite", transformOrigin: "55px 0" }}
      />
      {/* Right minor drip */}
      <path
        d="M140,0 Q140,10 139,18 Q138,26 140,30 Q142,34 145,36 Q148,34 150,30 Q152,26 151,18 Q150,10 150,0"
        fill="url(#drip-grad)"
        opacity="0.5"
        style={{ animation: "drip 2.8s ease-out 0.6s infinite", transformOrigin: "145px 0" }}
      />
      {/* Tiny side drips */}
      <ellipse cx="30" cy="10" rx="4" ry="6" fill={SILVER} opacity="0.3"
        style={{ animation: "drip 3s ease-out 1s infinite" }} />
      <ellipse cx="170" cy="8" rx="3" ry="5" fill={SILVER} opacity="0.25"
        style={{ animation: "drip 3.2s ease-out 0.8s infinite" }} />
    </svg>
  );
}

/* Metallic Sphere with environment mapping illusion */
function MetallicSphereGrid() {
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="msphere" cx="38%" cy="32%" r="55%">
          <stop offset="0%" stopColor={BRIGHT} />
          <stop offset="35%" stopColor={CHROME} />
          <stop offset="70%" stopColor={SILVER} />
          <stop offset="100%" stopColor={DARK_REFLECT} />
        </radialGradient>
      </defs>
      <circle cx="30" cy="30" r="26" fill="url(#msphere)" />
      <ellipse cx="24" cy="22" rx="8" ry="6" fill={BRIGHT} opacity="0.6" />
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────
   Section Components
   ────────────────────────────────────────────────────────── */

/* ── Hero ── */
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: BG }}
    >
      {/* Background subtle radial glow */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 50% 50%, ${SILVER}08, transparent)`,
        }}
      />

      {/* Floating chrome spheres */}
      <motion.div
        className="absolute"
        style={{ top: "12%", left: "8%", animation: "float-slow 6s ease-in-out infinite" }}
        initial={{ opacity: 0, scale: 0 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.2, delay: 0.3 }}
      >
        <ChromeSphere size={70} />
      </motion.div>
      <motion.div
        className="absolute"
        style={{ top: "20%", right: "10%", animation: "float-slow 7s ease-in-out 1s infinite" }}
        initial={{ opacity: 0, scale: 0 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.2, delay: 0.6 }}
      >
        <ChromeSphere size={50} />
      </motion.div>
      <motion.div
        className="absolute"
        style={{ bottom: "25%", left: "15%", animation: "float-slow 8s ease-in-out 2s infinite" }}
        initial={{ opacity: 0, scale: 0 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.2, delay: 0.9 }}
      >
        <ChromeSphere size={40} />
      </motion.div>
      <motion.div
        className="absolute"
        style={{ bottom: "18%", right: "6%", animation: "float-slow 5s ease-in-out 0.5s infinite" }}
        initial={{ opacity: 0, scale: 0 }}
        animate={inView ? { opacity: 0.7, scale: 1 } : {}}
        transition={{ duration: 1.2, delay: 1.1 }}
      >
        <ChromeSphere size={35} />
      </motion.div>

      {/* Large morphing blob behind title */}
      <motion.div
        className="absolute"
        style={{ opacity: 0.35 }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 0.35 } : {}}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <MorphingBlob size={500} />
      </motion.div>

      {/* Icon */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className={`${mono} text-sm tracking-[0.3em] mb-6`}
        style={{ color: MERCURY_BLUE }}
      >
        ◉ LIQUID CHROME SURFACE
      </motion.div>

      {/* MERCURY title */}
      <motion.h1
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`${display} text-7xl md:text-9xl font-bold tracking-tight mercury-chrome-text relative z-10`}
        style={{ lineHeight: 1.05 }}
      >
        MERCURY
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.7 }}
        className={`${body} text-lg md:text-xl mt-6 max-w-xl text-center relative z-10`}
        style={{ color: MERCURY_BLUE }}
      >
        AI-powered products engineered with liquid precision.
        <br />
        Full-stack developer forging intelligent systems.
      </motion.p>

      {/* Pool surface */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0.3 }}
        animate={inView ? { opacity: 1, scaleX: 1 } : {}}
        transition={{ duration: 1.2, delay: 0.9 }}
        className="mt-10 relative z-10"
      >
        <PoolSurface width={400} />
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 1.1 }}
        className="flex gap-12 mt-12 relative z-10"
      >
        {stats.map((s, i) => (
          <div key={i} className="flex flex-col items-center">
            <span
              className={`${heading} text-3xl md:text-4xl font-bold mercury-shimmer`}
            >
              {s.value}
            </span>
            <span
              className={`${mono} text-xs tracking-[0.2em] mt-2 uppercase`}
              style={{ color: MUTED }}
            >
              {s.label}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 0.5 } : {}}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-10 flex flex-col items-center gap-2"
      >
        <span className={`${mono} text-[10px] tracking-[0.3em] uppercase`} style={{ color: MUTED }}>
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ width: 1, height: 24, background: `linear-gradient(180deg, ${SILVER}, transparent)` }}
        />
      </motion.div>
    </section>
  );
}

/* ── Project Card ── */
function ProjectCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative group"
    >
      {/* Animated chrome border */}
      <div className="mercury-border-anim">
        <div
          className="relative overflow-hidden"
          style={{
            background: SURFACE,
            borderRadius: 11,
          }}
        >
          <ChromeReflection />

          {/* Mercury reflection slide effect on hover */}
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ borderRadius: "inherit" }}
          >
            <motion.div
              animate={hovered ? { x: ["0%", "200%"] } : { x: "-100%" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              style={{
                position: "absolute",
                top: 0,
                left: "-50%",
                width: "50%",
                height: "100%",
                background: `linear-gradient(90deg, transparent, ${BRIGHT}10, ${SILVER}15, transparent)`,
                transform: "skewX(-15deg)",
              }}
            />
          </div>

          <div className="p-6 relative z-10">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    background: `radial-gradient(circle at 35% 30%, ${BRIGHT}, ${SILVER}, ${DARK_REFLECT})`,
                  }}
                >
                  <span className="text-xs" style={{ color: DARK_REFLECT }}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div>
                  <p className={`${mono} text-[10px] tracking-[0.2em] uppercase`} style={{ color: MERCURY_BLUE }}>
                    {project.client}
                  </p>
                  <p className={`${mono} text-[10px]`} style={{ color: MUTED }}>
                    {project.year}
                  </p>
                </div>
              </div>
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors"
                  style={{ color: MUTED }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = SILVER)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = MUTED)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </a>
              )}
            </div>

            {/* Title */}
            <h3
              className={`${heading} text-xl font-semibold mb-3 leading-tight`}
              style={{ color: CHROME, whiteSpace: "pre-line" }}
            >
              {project.title}
            </h3>

            {/* Description */}
            <p className={`${body} text-sm leading-relaxed mb-4`} style={{ color: MERCURY_BLUE }}>
              {project.description}
            </p>

            {/* Technical */}
            <p className={`${body} text-xs leading-relaxed mb-5`} style={{ color: MUTED }}>
              {project.technical}
            </p>

            {/* Tech tags */}
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className={`${mono} text-[10px] px-3 py-1 rounded-full tracking-wider uppercase`}
                  style={{
                    background: `linear-gradient(135deg, ${DARK_REFLECT}, ${GUNMETAL})`,
                    color: SILVER,
                    border: `1px solid ${SILVER}20`,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Card reflection bottom (mirrored flipped gradient) */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 60,
              background: `linear-gradient(0deg, ${SILVER}08, transparent)`,
              pointerEvents: "none",
              borderRadius: "0 0 11px 11px",
            }}
          />
        </div>
      </div>

      {/* Shadow reflection underneath */}
      <div
        style={{
          position: "absolute",
          bottom: -8,
          left: "10%",
          right: "10%",
          height: 16,
          background: `radial-gradient(ellipse at center, ${SILVER}15, transparent)`,
          filter: "blur(4px)",
          transform: "scaleY(0.3)",
          pointerEvents: "none",
        }}
      />
    </motion.div>
  );
}

/* ── Projects Section ── */
function Projects() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section
      ref={ref}
      className="relative py-32 px-6"
      style={{ background: BG }}
    >
      {/* Section header */}
      <div className="max-w-6xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-4 mb-3"
        >
          <MetallicSphereGrid />
          <span className={`${mono} text-xs tracking-[0.3em] uppercase`} style={{ color: MERCURY_BLUE }}>
            Selected Works
          </span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className={`${display} text-4xl md:text-5xl font-bold mercury-chrome-text`}
        >
          Projects
        </motion.h2>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.3 }}
          style={{ originX: 0 }}
        >
          <PoolSurface width={300} />
        </motion.div>
      </div>

      {/* Projects grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}

/* ── Expertise Section ── */
function Expertise() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  const dropletColors = [SILVER, CHROME, MERCURY_BLUE, WARM_CHROME];

  return (
    <section
      ref={ref}
      className="relative py-32 px-6 overflow-hidden"
      style={{ background: SURFACE }}
    >
      {/* Background mercury pool effect */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 80% 30% at 50% 100%, ${SILVER}10, transparent)`,
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className={`${mono} text-xs tracking-[0.3em] uppercase block mb-4`} style={{ color: MERCURY_BLUE }}>
            ◉ Core Capabilities
          </span>
          <h2 className={`${display} text-4xl md:text-5xl font-bold mercury-chrome-text`}>
            Expertise
          </h2>
        </motion.div>

        {/* Four mercury droplet cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {expertise.map((exp, i) => {
            const cardRef = useRef<HTMLDivElement>(null);
            const cardInView = useInView(cardRef, { once: true, margin: "-40px" });

            return (
              <motion.div
                ref={cardRef}
                key={exp.title}
                initial={{ opacity: 0, scale: 0, y: 40 }}
                animate={cardInView ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{
                  duration: 0.8,
                  delay: i * 0.15,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
                className="flex flex-col items-center text-center group"
              >
                {/* Mercury droplet circle */}
                <div
                  className="relative w-28 h-28 rounded-full mb-6 flex items-center justify-center overflow-hidden"
                  style={{
                    background: `radial-gradient(circle at 35% 30%, ${BRIGHT}, ${dropletColors[i]}, ${DARK_REFLECT})`,
                    boxShadow: `0 8px 32px ${SILVER}20, inset 0 -4px 12px ${DARK_REFLECT}40`,
                  }}
                >
                  {/* Highlight glint */}
                  <div
                    className="absolute w-10 h-8 rounded-full"
                    style={{
                      top: "15%",
                      left: "20%",
                      background: `radial-gradient(ellipse, ${BRIGHT}90, transparent)`,
                    }}
                  />
                  {/* Number */}
                  <span
                    className={`${heading} text-2xl font-bold relative z-10`}
                    style={{ color: DARK_REFLECT }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Pool shadow underneath the droplet */}
                  <div
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2"
                    style={{
                      width: "80%",
                      height: 8,
                      background: `radial-gradient(ellipse, ${SILVER}30, transparent)`,
                      borderRadius: "50%",
                      filter: "blur(3px)",
                    }}
                  />
                </div>

                <h3
                  className={`${heading} text-base font-semibold mb-3`}
                  style={{ color: CHROME }}
                >
                  {exp.title}
                </h3>
                <p
                  className={`${body} text-sm leading-relaxed`}
                  style={{ color: MERCURY_BLUE }}
                >
                  {exp.body}
                </p>

                {/* Small pool surface under each card */}
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={cardInView ? { scaleX: 1, opacity: 1 } : {}}
                  transition={{ duration: 1, delay: i * 0.15 + 0.5 }}
                  className="mt-4"
                >
                  <PoolSurface width={120} />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── Tools Section ── */
function Tools() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section
      ref={ref}
      className="relative py-32 px-6"
      style={{ background: BG }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className={`${mono} text-xs tracking-[0.3em] uppercase block mb-4`} style={{ color: MERCURY_BLUE }}>
            ◉ Technical Arsenal
          </span>
          <h2 className={`${display} text-4xl md:text-5xl font-bold mercury-chrome-text`}>
            Tools
          </h2>
        </motion.div>

        {/* Chrome panel grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, i) => {
            const toolRef = useRef<HTMLDivElement>(null);
            const toolInView = useInView(toolRef, { once: true, margin: "-40px" });

            return (
              <motion.div
                ref={toolRef}
                key={tool.label}
                initial={{ opacity: 0, y: 40 }}
                animate={toolInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="relative overflow-hidden group"
                style={{
                  background: `linear-gradient(145deg, ${SURFACE}, ${GUNMETAL}40)`,
                  borderRadius: 12,
                  border: `1px solid ${SILVER}15`,
                }}
              >
                {/* Mirror-finish reflection gradient */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{
                    background: `linear-gradient(135deg, ${BRIGHT}05, ${SILVER}10, ${BRIGHT}05, transparent)`,
                    pointerEvents: "none",
                  }}
                />

                {/* Reflection slide on hover */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ borderRadius: "inherit" }}>
                  <div
                    className="absolute top-0 -left-1/2 w-1/2 h-full opacity-0 group-hover:opacity-100"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${BRIGHT}08, transparent)`,
                      transform: "skewX(-15deg)",
                      transition: "all 0.8s ease",
                    }}
                  />
                </div>

                <div className="p-6 relative z-10">
                  {/* Label row */}
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{
                        background: `radial-gradient(circle at 35% 30%, ${BRIGHT}, ${SILVER}, ${DARK_REFLECT})`,
                      }}
                    >
                      <MetallicSphereGrid />
                    </div>
                    <h3
                      className={`${heading} text-sm font-semibold tracking-wider uppercase`}
                      style={{ color: CHROME }}
                    >
                      {tool.label}
                    </h3>
                  </div>

                  {/* Items */}
                  <div className="flex flex-wrap gap-2">
                    {tool.items.map((item, j) => (
                      <motion.span
                        key={item}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={toolInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.4, delay: i * 0.1 + j * 0.05 + 0.3 }}
                        className={`${mono} text-xs px-3 py-1.5 rounded-full`}
                        style={{
                          background: `linear-gradient(135deg, ${DARK_REFLECT}, ${GUNMETAL}80)`,
                          color: SILVER,
                          border: `1px solid ${SILVER}18`,
                        }}
                      >
                        {item}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Bottom reflection */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 40,
                    background: `linear-gradient(0deg, ${SILVER}06, transparent)`,
                    pointerEvents: "none",
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── Footer ── */
function Footer() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <footer
      ref={ref}
      className="relative py-32 px-6 overflow-hidden"
      style={{ background: SURFACE }}
    >
      {/* Mercury pool ambient glow */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 50% 80%, ${SILVER}08, transparent)`,
        }}
      />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Chrome drip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="flex justify-center mb-8"
        >
          <ChromeDrip width={240} height={80} />
        </motion.div>

        {/* SOLIDIFIED text */}
        <motion.h2
          initial={{ opacity: 0, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, filter: "blur(0px)" } : {}}
          transition={{ duration: 1.5, delay: 0.5 }}
          className={`${display} text-5xl md:text-7xl font-bold mercury-chrome-text mb-6`}
        >
          SOLIDIFIED
        </motion.h2>

        {/* Settling pool surface */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={inView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 1.5, delay: 0.8 }}
          className="flex justify-center mb-8"
        >
          <PoolSurface width={360} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className={`${body} text-lg mb-3`}
          style={{ color: MERCURY_BLUE }}
        >
          Let&apos;s forge something extraordinary together.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
          className={`${body} text-sm`}
          style={{ color: MUTED }}
        >
          Every great product starts as liquid potential.
        </motion.p>

        {/* Contact row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="flex justify-center gap-8 mt-10"
        >
          {["GitHub", "LinkedIn", "Email"].map((label, i) => (
            <a
              key={label}
              href="#"
              className={`${mono} text-xs tracking-[0.2em] uppercase transition-colors`}
              style={{ color: MUTED }}
              onMouseEnter={(e) => (e.currentTarget.style.color = SILVER)}
              onMouseLeave={(e) => (e.currentTarget.style.color = MUTED)}
            >
              {label}
            </a>
          ))}
        </motion.div>

        {/* Mercury droplets at footer bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.4 } : {}}
          transition={{ duration: 1.5, delay: 1.6 }}
          className="flex justify-center gap-4 mt-12"
        >
          {[12, 8, 16, 6, 10, 14, 7].map((size, i) => (
            <div
              key={i}
              className="rounded-full"
              style={{
                width: size,
                height: size,
                background: `radial-gradient(circle at 35% 30%, ${BRIGHT}, ${SILVER}, ${DARK_REFLECT})`,
                animation: `float-slow ${3 + i * 0.5}s ease-in-out ${i * 0.3}s infinite`,
              }}
            />
          ))}
        </motion.div>

        {/* Copyright */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.3 } : {}}
          transition={{ duration: 0.8, delay: 1.8 }}
          className={`${mono} text-[10px] mt-12 tracking-[0.2em] uppercase`}
          style={{ color: MUTED }}
        >
          &copy; {new Date().getFullYear()} Mercury Theme &middot; Liquid Chrome Surface
        </motion.p>
      </div>
    </footer>
  );
}

/* ──────────────────────────────────────────────────────────
   Main Page
   ────────────────────────────────────────────────────────── */
export default function MercuryPage() {
  return (
    <main
      className="min-h-screen overflow-x-hidden"
      style={{ background: BG, color: CHROME }}
    >
      <Styles />

      {/* SVG defs used globally */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          {/* Mercury noise filter for texture */}
          <filter id="mercury-noise" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              seed="5"
              result="noise"
            />
            <feColorMatrix
              in="noise"
              type="saturate"
              values="0"
              result="mono"
            />
            <feBlend in="SourceGraphic" in2="mono" mode="overlay" result="blended" />
            <feComponentTransfer in="blended">
              <feFuncA type="linear" slope="0.15" />
            </feComponentTransfer>
          </filter>

          {/* Chrome environment map gradient */}
          <linearGradient id="chrome-env" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={GUNMETAL} />
            <stop offset="20%" stopColor={SILVER} />
            <stop offset="40%" stopColor={BRIGHT} />
            <stop offset="60%" stopColor={SILVER} />
            <stop offset="80%" stopColor={MERCURY_BLUE} />
            <stop offset="100%" stopColor={DARK_REFLECT} />
          </linearGradient>

          {/* Radial chrome for spheres */}
          <radialGradient id="chrome-radial" cx="35%" cy="30%" r="60%">
            <stop offset="0%" stopColor={BRIGHT} />
            <stop offset="30%" stopColor={CHROME} />
            <stop offset="60%" stopColor={SILVER} />
            <stop offset="100%" stopColor={DARK_REFLECT} />
          </radialGradient>
        </defs>
      </svg>

      <Hero />
      <Projects />
      <Expertise />
      <Tools />
      <Footer />

      <ThemeSwitcher current="/mercury" variant="dark" />
    </main>
  );
}
