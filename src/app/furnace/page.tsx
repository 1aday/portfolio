"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";

/* ═══════════════════════════════════════════════════════════════
   FURNACE — Molten Steel Foundry Theme
   ═══════════════════════════════════════════════════════════════ */

const C = {
  bg: "#0A0A0A",
  forge: "#1A1A1A",
  molten: "#FF4500",
  ember: "#CC2200",
  hotWhite: "#FFFFAA",
  coolSteel: "#4A6FA5",
  charcoal: "#1A1A1A",
  ash: "#555555",
  text: "#F0EDE8",
  textMuted: "rgba(240,237,232,0.45)",
  moltenGlow: "rgba(255,69,0,0.3)",
  emberGlow: "rgba(204,34,0,0.2)",
  border: "rgba(255,69,0,0.12)",
  borderBright: "rgba(255,69,0,0.35)",
};

/* ─── Font helpers ─── */
const spaceGrotesk = () => `var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif`;
const manrope = () => `var(--font-manrope), ui-sans-serif, system-ui, sans-serif`;
const inter = () => `var(--font-inter), ui-sans-serif, system-ui, sans-serif`;
const jetbrains = () => `var(--font-jetbrains), ui-monospace, monospace`;

/* ─── Spark particle component ─── */
function Sparks({ count = 24, area = "hero" }: { count?: number; area?: string }) {
  const sparks = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 6,
      duration: 2.5 + Math.random() * 3,
      size: 1.5 + Math.random() * 3,
      drift: (Math.random() - 0.5) * 60,
      opacity: 0.5 + Math.random() * 0.5,
    }))
  ).current;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {sparks.map((s) => (
        <div
          key={`${area}-spark-${s.id}`}
          className="absolute rounded-full"
          style={{
            left: `${s.left}%`,
            bottom: "0%",
            width: s.size,
            height: s.size,
            background: s.size > 3 ? C.hotWhite : C.molten,
            boxShadow: `0 0 ${s.size * 2}px ${s.size > 3 ? C.hotWhite : C.molten}`,
            animation: `spark-rise ${s.duration}s ${s.delay}s infinite ease-out`,
            ["--spark-drift" as string]: `${s.drift}px`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Heat shimmer SVG filter ─── */
function HeatShimmerFilter() {
  return (
    <svg className="absolute w-0 h-0" aria-hidden>
      <defs>
        <filter id="heat-shimmer">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.015 0.08"
            numOctaves="3"
            seed="2"
            result="turbulence"
          >
            <animate
              attributeName="baseFrequency"
              values="0.015 0.08;0.02 0.12;0.015 0.08"
              dur="4s"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="turbulence"
            scale="6"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        <filter id="heat-shimmer-strong">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.02 0.1"
            numOctaves="4"
            seed="5"
            result="turb"
          >
            <animate
              attributeName="baseFrequency"
              values="0.02 0.1;0.03 0.15;0.02 0.1"
              dur="3s"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="turb"
            scale="10"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        <filter id="molten-glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}

/* ─── Furnace cross-section SVG ─── */
function FurnaceSVG() {
  return (
    <svg viewBox="0 0 400 350" className="w-full max-w-[400px]" aria-hidden>
      {/* Outer shell */}
      <rect x="60" y="30" width="280" height="290" rx="8" fill="#1A1A1A" stroke="#333" strokeWidth="2" />
      {/* Inner chamber */}
      <rect x="90" y="60" width="220" height="200" rx="4" fill="#0A0A0A" stroke={C.ember} strokeWidth="1" />
      {/* Fire chamber glow */}
      <rect x="100" y="160" width="200" height="90" rx="4" fill="url(#fire-gradient)" opacity="0.9">
        <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
      </rect>
      {/* Flames */}
      <g style={{ filter: "url(#heat-shimmer)" }}>
        <path d="M150 160 Q155 120 160 140 Q165 100 170 130 Q175 90 180 140 Q185 110 190 160Z" fill={C.molten} opacity="0.8">
          <animate attributeName="d" values="M150 160 Q155 120 160 140 Q165 100 170 130 Q175 90 180 140 Q185 110 190 160Z;M150 160 Q158 110 162 135 Q168 95 173 125 Q178 85 183 135 Q188 105 190 160Z;M150 160 Q155 120 160 140 Q165 100 170 130 Q175 90 180 140 Q185 110 190 160Z" dur="1.5s" repeatCount="indefinite" />
        </path>
        <path d="M195 160 Q200 130 205 145 Q210 105 215 135 Q220 95 225 145 Q230 120 235 160Z" fill={C.hotWhite} opacity="0.6">
          <animate attributeName="d" values="M195 160 Q200 130 205 145 Q210 105 215 135 Q220 95 225 145 Q230 120 235 160Z;M195 160 Q203 125 208 140 Q213 100 218 130 Q223 90 228 140 Q233 115 235 160Z;M195 160 Q200 130 205 145 Q210 105 215 135 Q220 95 225 145 Q230 120 235 160Z" dur="1.8s" repeatCount="indefinite" />
        </path>
        <path d="M120 160 Q125 135 130 148 Q135 115 140 140 Q142 128 145 160Z" fill="#FF6B00" opacity="0.7">
          <animate attributeName="d" values="M120 160 Q125 135 130 148 Q135 115 140 140 Q142 128 145 160Z;M120 160 Q128 130 132 145 Q137 110 142 138 Q144 125 145 160Z;M120 160 Q125 135 130 148 Q135 115 140 140 Q142 128 145 160Z" dur="2s" repeatCount="indefinite" />
        </path>
        <path d="M240 160 Q244 138 248 150 Q252 120 256 142 Q260 132 265 160Z" fill={C.molten} opacity="0.65">
          <animate attributeName="opacity" values="0.65;0.9;0.65" dur="1.6s" repeatCount="indefinite" />
        </path>
      </g>
      {/* Chimney */}
      <rect x="170" y="0" width="60" height="35" fill="#222" stroke="#333" strokeWidth="1.5" />
      <rect x="165" y="28" width="70" height="8" rx="2" fill="#2A2A2A" stroke="#333" strokeWidth="1" />
      {/* Heat waves from chimney */}
      <g opacity="0.3" style={{ filter: "url(#heat-shimmer)" }}>
        <path d="M185 0 Q190 -15 195 -5 Q200 -20 205 0" stroke={C.molten} fill="none" strokeWidth="1.5" opacity="0.4">
          <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2s" repeatCount="indefinite" />
        </path>
      </g>
      {/* Air vents */}
      {[80, 100, 120].map((y) => (
        <g key={y}>
          <rect x="64" y={y} width="20" height="3" rx="1" fill="#333" />
          <rect x="316" y={y} width="20" height="3" rx="1" fill="#333" />
        </g>
      ))}
      {/* Ingot in chamber */}
      <rect x="140" y="200" width="120" height="40" rx="3" fill="url(#ingot-gradient)" stroke={C.molten} strokeWidth="0.5">
        <animate attributeName="stroke-opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
      </rect>
      {/* Base/legs */}
      <rect x="80" y="320" width="40" height="20" rx="2" fill="#222" />
      <rect x="280" y="320" width="40" height="20" rx="2" fill="#222" />
      {/* Temperature gauge */}
      <rect x="340" y="80" width="8" height="160" rx="4" fill="#222" stroke="#444" strokeWidth="0.5" />
      <rect x="341" y="140" width="6" height="100" rx="3" fill="url(#temp-gradient)">
        <animate attributeName="height" values="100;90;100" dur="3s" repeatCount="indefinite" />
        <animate attributeName="y" values="140;150;140" dur="3s" repeatCount="indefinite" />
      </rect>
      <circle cx="344" cy="248" r="8" fill={C.ember} stroke="#444" strokeWidth="0.5" />
      {/* Gradients */}
      <defs>
        <linearGradient id="fire-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.molten} stopOpacity="0.3" />
          <stop offset="50%" stopColor={C.ember} stopOpacity="0.6" />
          <stop offset="100%" stopColor={C.hotWhite} stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="ingot-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF6B00" />
          <stop offset="40%" stopColor={C.molten} />
          <stop offset="100%" stopColor={C.hotWhite} />
        </linearGradient>
        <linearGradient id="temp-gradient" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={C.ember} />
          <stop offset="60%" stopColor={C.molten} />
          <stop offset="100%" stopColor={C.hotWhite} />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─── Anvil SVG ─── */
function AnvilSVG({ size = 80 }: { size?: number }) {
  return (
    <svg viewBox="0 0 120 80" width={size} height={(size * 80) / 120} aria-hidden>
      {/* Horn */}
      <path d="M5 35 Q15 25 40 30 L40 45 Q15 50 5 40Z" fill="#444" stroke="#555" strokeWidth="0.8" />
      {/* Body */}
      <rect x="40" y="25" width="50" height="25" rx="2" fill="#3A3A3A" stroke="#555" strokeWidth="0.8" />
      {/* Top face */}
      <rect x="35" y="20" width="60" height="8" rx="2" fill="#4A4A4A" stroke="#555" strokeWidth="0.5" />
      {/* Heel */}
      <path d="M90 30 L110 28 L110 47 L90 50Z" fill="#3A3A3A" stroke="#555" strokeWidth="0.8" />
      {/* Base */}
      <path d="M30 50 L100 50 L105 60 Q105 75 100 75 L30 75 Q25 75 25 60Z" fill="#333" stroke="#555" strokeWidth="0.8" />
      {/* Highlight */}
      <rect x="38" y="22" width="55" height="2" rx="1" fill="#666" opacity="0.5" />
    </svg>
  );
}

/* ─── Crossed hammers SVG ─── */
function CrossedHammersSVG({ size = 60 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden>
      {/* Left hammer */}
      <g transform="rotate(-30, 50, 50)">
        <rect x="45" y="15" width="10" height="70" rx="2" fill="#555" />
        <rect x="35" y="10" width="30" height="18" rx="3" fill="#666" stroke="#777" strokeWidth="0.5" />
        <rect x="35" y="10" width="30" height="4" rx="1" fill="#777" opacity="0.4" />
      </g>
      {/* Right hammer */}
      <g transform="rotate(30, 50, 50)">
        <rect x="45" y="15" width="10" height="70" rx="2" fill="#555" />
        <rect x="35" y="10" width="30" height="18" rx="3" fill="#666" stroke="#777" strokeWidth="0.5" />
        <rect x="35" y="10" width="30" height="4" rx="1" fill="#777" opacity="0.4" />
      </g>
    </svg>
  );
}

/* ─── Forge tool icons for tools section ─── */
const forgeToolIcons: Record<string, React.ReactNode> = {
  Languages: (
    <svg viewBox="0 0 40 40" width="32" height="32">
      <rect x="14" y="2" width="12" height="36" rx="2" fill="#555" />
      <rect x="6" y="2" width="28" height="10" rx="3" fill="#666" stroke="#777" strokeWidth="0.5" />
      <rect x="6" y="2" width="28" height="3" rx="1" fill="#777" opacity="0.3" />
    </svg>
  ),
  Frontend: (
    <svg viewBox="0 0 40 40" width="32" height="32">
      <circle cx="20" cy="12" r="8" fill="none" stroke="#666" strokeWidth="2" />
      <rect x="17" y="18" width="6" height="20" rx="2" fill="#555" />
      <line x1="12" y1="35" x2="28" y2="35" stroke="#555" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  Backend: (
    <svg viewBox="0 0 40 40" width="32" height="32">
      <path d="M10 8 L30 8 L28 35 L12 35Z" fill="#555" stroke="#666" strokeWidth="0.8" />
      <path d="M12 8 L10 2 L30 2 L28 8" fill="#666" stroke="#777" strokeWidth="0.5" />
      <line x1="14" y1="15" x2="26" y2="15" stroke="#777" strokeWidth="0.5" />
    </svg>
  ),
  "AI / ML": (
    <svg viewBox="0 0 40 40" width="32" height="32">
      <path d="M5 30 Q20 5 35 30" fill="none" stroke="#666" strokeWidth="2" />
      <circle cx="20" cy="15" r="4" fill={C.molten} opacity="0.6" />
      <rect x="17" y="28" width="6" height="10" rx="1" fill="#555" />
    </svg>
  ),
  Data: (
    <svg viewBox="0 0 40 40" width="32" height="32">
      <ellipse cx="20" cy="10" rx="14" ry="5" fill="#555" stroke="#666" strokeWidth="0.8" />
      <path d="M6 10 L6 30 Q6 35 20 35 Q34 35 34 30 L34 10" fill="#444" stroke="#666" strokeWidth="0.8" />
      <ellipse cx="20" cy="30" rx="14" ry="5" fill="none" stroke="#666" strokeWidth="0.8" />
      <ellipse cx="20" cy="20" rx="14" ry="5" fill="none" stroke="#555" strokeWidth="0.5" />
    </svg>
  ),
  Infra: (
    <svg viewBox="0 0 40 40" width="32" height="32">
      {/* Chain link */}
      <ellipse cx="15" cy="15" rx="8" ry="12" fill="none" stroke="#666" strokeWidth="2" />
      <ellipse cx="25" cy="25" rx="8" ry="12" fill="none" stroke="#666" strokeWidth="2" />
    </svg>
  ),
};

/* ─── Molten pour stream SVG ─── */
function MoltenPourSVG() {
  return (
    <svg viewBox="0 0 60 200" className="absolute right-8 top-0 h-48 w-16 opacity-20" aria-hidden>
      <path d="M30 0 Q35 40 28 80 Q22 120 32 160 Q38 180 30 200" stroke="url(#pour-grad)" strokeWidth="4" fill="none" strokeLinecap="round">
        <animate attributeName="d" values="M30 0 Q35 40 28 80 Q22 120 32 160 Q38 180 30 200;M30 0 Q25 40 33 80 Q38 120 27 160 Q22 180 30 200;M30 0 Q35 40 28 80 Q22 120 32 160 Q38 180 30 200" dur="3s" repeatCount="indefinite" />
      </path>
      <defs>
        <linearGradient id="pour-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.hotWhite} />
          <stop offset="40%" stopColor={C.molten} />
          <stop offset="100%" stopColor={C.ember} stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─── Chain link decoration SVG ─── */
function ChainLinks() {
  return (
    <svg viewBox="0 0 200 30" className="w-48 h-8" aria-hidden>
      {[0, 30, 60, 90, 120, 150].map((x) => (
        <g key={x}>
          <ellipse cx={x + 15} cy="15" rx="12" ry="8" fill="none" stroke="#444" strokeWidth="2" />
        </g>
      ))}
    </svg>
  );
}

/* ─── Section wrapper with reveal ─── */
function Section({
  children,
  id,
  className = "",
}: {
  children: React.ReactNode;
  id?: string;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.section
      ref={ref}
      id={id}
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function FurnacePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      <style jsx global>{`
        @keyframes spark-rise {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0;
          }
          8% {
            opacity: 1;
          }
          60% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-500px) translateX(var(--spark-drift, 0px)) scale(0.15);
            opacity: 0;
          }
        }
        @keyframes molten-pulse {
          0%, 100% {
            box-shadow:
              0 0 20px rgba(255,69,0,0.15),
              0 0 60px rgba(255,69,0,0.05),
              inset 0 1px 0 rgba(255,69,0,0.08);
          }
          50% {
            box-shadow:
              0 0 30px rgba(255,69,0,0.3),
              0 0 80px rgba(255,69,0,0.1),
              inset 0 1px 0 rgba(255,69,0,0.15);
          }
        }
        @keyframes heat-wave {
          0%, 100% { transform: translateY(0) scaleX(1); }
          25% { transform: translateY(-1px) scaleX(1.002); }
          50% { transform: translateY(0.5px) scaleX(0.998); }
          75% { transform: translateY(-0.5px) scaleX(1.001); }
        }
        @keyframes forge-glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes molten-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes ingot-cool {
          0% { border-color: rgba(255,69,0,0.5); }
          33% { border-color: rgba(255,140,0,0.3); }
          66% { border-color: rgba(74,111,165,0.3); }
          100% { border-color: rgba(74,111,165,0.15); }
        }
        @keyframes temp-flicker {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        @keyframes anvil-strike {
          0%, 85%, 100% { transform: scaleY(1); }
          90% { transform: scaleY(0.97); }
          95% { transform: scaleY(1.01); }
        }
        @keyframes glow-text {
          0%, 100% {
            text-shadow: 0 0 20px rgba(255,69,0,0.4), 0 0 40px rgba(255,69,0,0.2);
          }
          50% {
            text-shadow: 0 0 30px rgba(255,69,0,0.6), 0 0 60px rgba(255,69,0,0.3), 0 0 80px rgba(255,69,0,0.1);
          }
        }
        @keyframes border-heat {
          0% { border-image-source: linear-gradient(135deg, #FF4500, #CC2200, #FF4500); }
          33% { border-image-source: linear-gradient(135deg, #CC2200, #FF4500, #FFFFAA); }
          66% { border-image-source: linear-gradient(135deg, #FFFFAA, #FF4500, #CC2200); }
          100% { border-image-source: linear-gradient(135deg, #FF4500, #CC2200, #FF4500); }
        }
      `}</style>

      <HeatShimmerFilter />

      <div
        style={{
          background: C.bg,
          color: C.text,
          fontFamily: inter(),
          minHeight: "100vh",
          overflowX: "hidden",
        }}
      >
        {/* ══════════ HERO ══════════ */}
        <Section className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
          {/* Background radial heat */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 60% 50% at 50% 70%, rgba(255,69,0,0.08) 0%, transparent 70%),
                           radial-gradient(ellipse 40% 30% at 50% 80%, rgba(204,34,0,0.06) 0%, transparent 60%)`,
            }}
            aria-hidden
          />

          {/* Floating sparks */}
          {mounted && <Sparks count={30} area="hero" />}

          {/* Heat shimmer overlay at bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
            style={{ filter: "url(#heat-shimmer)", opacity: 0.3 }}
            aria-hidden
          >
            <div className="w-full h-full" style={{ background: `linear-gradient(to top, rgba(255,69,0,0.06), transparent)` }} />
          </div>

          {/* Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
            className="mb-6 text-5xl"
            style={{ filter: `drop-shadow(0 0 20px ${C.moltenGlow})` }}
          >
            ⚒
          </motion.div>

          {/* FURNACE title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center relative"
            style={{
              fontFamily: spaceGrotesk(),
              fontWeight: 900,
              fontSize: "clamp(4rem, 12vw, 9rem)",
              letterSpacing: "-0.03em",
              lineHeight: 0.9,
              background: `linear-gradient(135deg, ${C.molten} 0%, ${C.hotWhite} 40%, ${C.molten} 70%, ${C.ember} 100%)`,
              backgroundSize: "200% 200%",
              animation: "molten-flow 6s ease infinite, glow-text 3s ease-in-out infinite",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            FURNACE
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-6 text-center max-w-md"
            style={{
              fontFamily: manrope(),
              fontSize: "1.1rem",
              color: C.textMuted,
              letterSpacing: "0.02em",
            }}
          >
            Code forged in fire. Projects tempered through iteration.
            <br />
            AI-powered applications, hammered into production.
          </motion.p>

          {/* Furnace SVG illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-12 relative"
          >
            <FurnaceSVG />
          </motion.div>

          {/* Stats as temperature gauges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-16 flex gap-12 flex-wrap justify-center"
          >
            {stats.map((s, i) => (
              <div key={s.label} className="flex flex-col items-center gap-2">
                {/* Gauge bar */}
                <div
                  className="relative w-3 h-16 rounded-full overflow-hidden"
                  style={{ background: "#1A1A1A", border: `1px solid ${C.border}` }}
                >
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${60 + i * 15}%` }}
                    transition={{ duration: 1.5, delay: 1 + i * 0.2, ease: "easeOut" }}
                    className="absolute bottom-0 left-0 right-0 rounded-full"
                    style={{
                      background: `linear-gradient(to top, ${C.ember}, ${C.molten}, ${C.hotWhite})`,
                    }}
                  />
                </div>
                <span
                  style={{
                    fontFamily: jetbrains(),
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: C.molten,
                    animation: "temp-flicker 2s ease infinite",
                    animationDelay: `${i * 0.3}s`,
                  }}
                >
                  {s.value}
                </span>
                <span
                  style={{
                    fontFamily: manrope(),
                    fontSize: "0.75rem",
                    color: C.ash,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span style={{ fontFamily: jetbrains(), fontSize: "0.65rem", color: C.ash, letterSpacing: "0.15em" }}>
              SCROLL TO FORGE
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ width: 1, height: 20, background: `linear-gradient(to bottom, ${C.molten}, transparent)` }}
            />
          </motion.div>
        </Section>

        {/* ══════════ PROJECTS ══════════ */}
        <Section id="projects" className="px-6 py-28 max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <span
              style={{
                fontFamily: jetbrains(),
                fontSize: "0.7rem",
                color: C.molten,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              ⚒ Steel Ingots — Forged Works
            </span>
            <h2
              className="mt-4"
              style={{
                fontFamily: spaceGrotesk(),
                fontWeight: 800,
                fontSize: "clamp(2rem, 5vw, 3.2rem)",
                letterSpacing: "-0.02em",
                color: C.text,
              }}
            >
              Projects
            </h2>
            <div
              className="mt-4 mx-auto h-px"
              style={{
                width: 80,
                background: `linear-gradient(to right, transparent, ${C.molten}, transparent)`,
              }}
            />
          </div>

          <div className="grid gap-8">
            {projects.map((project, idx) => (
              <ProjectCard key={project.title} project={project} index={idx} />
            ))}
          </div>
        </Section>

        {/* ══════════ EXPERTISE ══════════ */}
        <Section id="expertise" className="px-6 py-28 max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span
              style={{
                fontFamily: jetbrains(),
                fontSize: "0.7rem",
                color: C.molten,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              Anvil & Hammer — Expertise
            </span>
            <h2
              className="mt-4"
              style={{
                fontFamily: spaceGrotesk(),
                fontWeight: 800,
                fontSize: "clamp(2rem, 5vw, 3rem)",
                letterSpacing: "-0.02em",
              }}
            >
              Forged Expertise
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {expertise.map((exp, i) => (
              <ExpertiseCard key={exp.title} item={exp} index={i} />
            ))}
          </div>
        </Section>

        {/* ══════════ TOOLS ══════════ */}
        <Section id="tools" className="px-6 py-28 max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span
              style={{
                fontFamily: jetbrains(),
                fontSize: "0.7rem",
                color: C.molten,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              Forge Rack — Implements
            </span>
            <h2
              className="mt-4"
              style={{
                fontFamily: spaceGrotesk(),
                fontWeight: 800,
                fontSize: "clamp(2rem, 5vw, 3rem)",
                letterSpacing: "-0.02em",
              }}
            >
              Tools of the Trade
            </h2>
          </div>

          {/* Tool rack background */}
          <div
            className="relative rounded-xl p-8 md:p-12"
            style={{
              background: `linear-gradient(180deg, ${C.forge} 0%, #111 100%)`,
              border: `1px solid ${C.border}`,
            }}
          >
            {/* Rack bar top */}
            <div
              className="absolute top-0 left-8 right-8 h-1 rounded-full"
              style={{ background: `linear-gradient(to right, #333, #555, #333)` }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {tools.map((tool, i) => (
                <ToolCategory key={tool.label} tool={tool} index={i} />
              ))}
            </div>

            {/* Rack bar bottom */}
            <div
              className="absolute bottom-0 left-8 right-8 h-1 rounded-full"
              style={{ background: `linear-gradient(to right, #333, #555, #333)` }}
            />
          </div>
        </Section>

        {/* ══════════ FOOTER ══════════ */}
        <Section className="px-6 py-24">
          <div className="max-w-4xl mx-auto text-center">
            {/* Crossed hammers */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex justify-center mb-8"
            >
              <CrossedHammersSVG size={80} />
            </motion.div>

            {/* FORGED IN CODE */}
            <h2
              style={{
                fontFamily: spaceGrotesk(),
                fontWeight: 900,
                fontSize: "clamp(2rem, 6vw, 4rem)",
                letterSpacing: "-0.02em",
                background: `linear-gradient(135deg, ${C.molten} 0%, ${C.coolSteel} 50%, ${C.forge} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              FORGED IN CODE
            </h2>

            {/* Anvil */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center mt-6"
            >
              <AnvilSVG size={100} />
            </motion.div>

            {/* Chain links divider */}
            <div className="flex justify-center mt-8 mb-8 opacity-30">
              <ChainLinks />
            </div>

            {/* Cooling gradient bar */}
            <div
              className="mx-auto h-1 rounded-full mb-8"
              style={{
                width: 200,
                background: `linear-gradient(to right, ${C.molten}, ${C.coolSteel}, ${C.forge})`,
              }}
            />

            <p
              style={{
                fontFamily: manrope(),
                fontSize: "0.85rem",
                color: C.ash,
                letterSpacing: "0.05em",
              }}
            >
              Every line of code is a hammer strike. Every deployment, a quench.
            </p>

            {/* Temperature reading */}
            <div
              className="mt-6 inline-block px-4 py-2 rounded-md"
              style={{
                background: "rgba(255,69,0,0.05)",
                border: `1px solid ${C.border}`,
              }}
            >
              <span style={{ fontFamily: jetbrains(), fontSize: "0.7rem", color: C.molten }}>
                FORGE TEMP: 1538°C
              </span>
              <span
                className="ml-3"
                style={{
                  fontFamily: jetbrains(),
                  fontSize: "0.7rem",
                  color: C.ash,
                }}
              >
                STATUS: OPERATIONAL
              </span>
            </div>

            {/* Sparks at footer */}
            {mounted && (
              <div className="relative h-32 mt-8">
                <Sparks count={12} area="footer" />
              </div>
            )}
          </div>
        </Section>

        {/* ══════════ THEME SWITCHER ══════════ */}
        <ThemeSwitcher current="/furnace" variant="dark" />
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PROJECT CARD
   ═══════════════════════════════════════════════════════════════ */
function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [hovered, setHovered] = useState(false);
  const title = project.title.replace(/\n/g, " ");

  // Temperature label based on index
  const temp = 1538 - index * 80;
  const heatLevel = temp > 1200 ? "MOLTEN" : temp > 900 ? "RED-HOT" : "COOLING";
  const heatColor = temp > 1200 ? C.hotWhite : temp > 900 ? C.molten : C.coolSteel;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative group"
      style={{
        background: C.forge,
        borderRadius: 12,
        border: `1px solid ${hovered ? C.borderBright : C.border}`,
        animation: hovered ? "molten-pulse 2s ease infinite" : "none",
        transition: "border-color 0.4s ease",
        overflow: "hidden",
      }}
    >
      {/* Molten edge glow — top */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(to right, transparent, ${C.molten}40, ${C.hotWhite}30, ${C.molten}40, transparent)`,
          opacity: hovered ? 1 : 0.4,
          transition: "opacity 0.4s ease",
        }}
      />

      {/* Sparks on reveal */}
      {inView && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={`card-spark-${index}-${i}`}
              className="absolute rounded-full"
              style={{
                left: `${20 + Math.random() * 60}%`,
                bottom: "50%",
                width: 2,
                height: 2,
                background: C.molten,
                boxShadow: `0 0 4px ${C.molten}`,
                animation: `spark-rise ${2 + Math.random() * 2}s ${i * 0.15}s ease-out forwards`,
                ["--spark-drift" as string]: `${(Math.random() - 0.5) * 40}px`,
                opacity: 0,
              }}
            />
          ))}
        </div>
      )}

      <div className="p-6 md:p-8">
        {/* Top row: index + temp */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <span
              style={{
                fontFamily: jetbrains(),
                fontSize: "0.65rem",
                color: C.ash,
                letterSpacing: "0.1em",
              }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="h-px flex-1" style={{ width: 24, background: C.border }} />
            <span
              style={{
                fontFamily: jetbrains(),
                fontSize: "0.6rem",
                color: C.textMuted,
                letterSpacing: "0.05em",
              }}
            >
              {project.client}
            </span>
          </div>

          {/* Temperature indicator */}
          <div
            className="flex items-center gap-2 px-2 py-1 rounded"
            style={{
              background: "rgba(255,69,0,0.05)",
              border: `1px solid ${C.border}`,
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: heatColor,
                boxShadow: `0 0 6px ${heatColor}`,
                animation: "forge-glow 2s ease infinite",
              }}
            />
            <span
              style={{
                fontFamily: jetbrains(),
                fontSize: "0.6rem",
                color: heatColor,
                letterSpacing: "0.1em",
              }}
            >
              {temp}°C — {heatLevel}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily: spaceGrotesk(),
            fontWeight: 700,
            fontSize: "1.4rem",
            letterSpacing: "-0.01em",
            color: C.text,
            lineHeight: 1.2,
          }}
        >
          {title}
        </h3>

        {/* Year badge */}
        <span
          className="inline-block mt-2 px-2 py-0.5 rounded"
          style={{
            fontFamily: jetbrains(),
            fontSize: "0.6rem",
            color: C.molten,
            background: "rgba(255,69,0,0.06)",
            border: `1px solid ${C.border}`,
          }}
        >
          {project.year}
        </span>

        {/* Description */}
        <p
          className="mt-4"
          style={{
            fontFamily: inter(),
            fontSize: "0.875rem",
            lineHeight: 1.65,
            color: "rgba(240,237,232,0.6)",
          }}
        >
          {project.description}
        </p>

        {/* Technical details */}
        <p
          className="mt-3"
          style={{
            fontFamily: inter(),
            fontSize: "0.8rem",
            lineHeight: 1.6,
            color: "rgba(240,237,232,0.35)",
            fontStyle: "italic",
          }}
        >
          {project.technical}
        </p>

        {/* Ingot-style tech tags */}
        <div className="flex flex-wrap gap-2 mt-5">
          {project.tech.map((t) => (
            <span
              key={t}
              className="px-3 py-1 rounded-sm"
              style={{
                fontFamily: jetbrains(),
                fontSize: "0.65rem",
                color: C.molten,
                background: `linear-gradient(135deg, rgba(255,69,0,0.08), rgba(255,69,0,0.03))`,
                border: `1px solid ${C.border}`,
                letterSpacing: "0.03em",
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Bottom bar: ingot shape */}
        <div
          className="mt-6 h-1.5 rounded-full"
          style={{
            background: `linear-gradient(to right, ${C.ember}40, ${C.molten}60, ${C.hotWhite}30, ${C.molten}60, ${C.ember}40)`,
            opacity: hovered ? 0.8 : 0.3,
            transition: "opacity 0.4s ease",
          }}
        />

        {/* GitHub link */}
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 group/link"
            style={{
              fontFamily: jetbrains(),
              fontSize: "0.65rem",
              color: C.ash,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.molten)}
            onMouseLeave={(e) => (e.currentTarget.style.color = C.ash)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            View Source
          </a>
        )}
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
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative"
      style={{
        background: C.forge,
        borderRadius: 12,
        border: `1px solid ${C.border}`,
        padding: "2rem",
        animation: hovered ? "anvil-strike 1.5s ease infinite" : "none",
        transition: "border-color 0.4s ease",
        borderColor: hovered ? C.borderBright : C.border,
        overflow: "hidden",
      }}
    >
      {/* Metallic sheen overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.02) 50%, transparent 60%)`,
          transform: hovered ? "translateX(100%)" : "translateX(-100%)",
          transition: "transform 0.8s ease",
        }}
        aria-hidden
      />

      {/* Anvil icon */}
      <div className="mb-4 opacity-60">
        <AnvilSVG size={50} />
      </div>

      {/* Number */}
      <span
        style={{
          fontFamily: jetbrains(),
          fontSize: "0.6rem",
          color: C.molten,
          letterSpacing: "0.15em",
        }}
      >
        EXPERTISE {String(index + 1).padStart(2, "0")}
      </span>

      {/* Title */}
      <h3
        className="mt-2"
        style={{
          fontFamily: spaceGrotesk(),
          fontWeight: 700,
          fontSize: "1.2rem",
          color: C.text,
          letterSpacing: "-0.01em",
        }}
      >
        {item.title}
      </h3>

      {/* Body */}
      <p
        className="mt-3"
        style={{
          fontFamily: inter(),
          fontSize: "0.85rem",
          lineHeight: 1.7,
          color: "rgba(240,237,232,0.5)",
        }}
      >
        {item.body}
      </p>

      {/* Bottom ember line */}
      <div
        className="mt-5 h-px"
        style={{
          background: `linear-gradient(to right, ${C.molten}40, transparent)`,
          opacity: hovered ? 1 : 0.4,
          transition: "opacity 0.4s ease",
        }}
      />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TOOL CATEGORY
   ═══════════════════════════════════════════════════════════════ */
function ToolCategory({
  tool,
  index,
}: {
  tool: (typeof tools)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="relative"
    >
      {/* Hook / hanging connector */}
      <div className="flex justify-center mb-3">
        <svg viewBox="0 0 20 24" width="16" height="20" aria-hidden>
          <path d="M10 0 L10 8 Q10 14 14 14 Q18 14 18 18 Q18 22 14 22 Q10 22 10 18 L10 14" fill="none" stroke="#444" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Tool icon */}
      <div className="flex justify-center mb-3 opacity-50">
        {forgeToolIcons[tool.label] || forgeToolIcons.Languages}
      </div>

      {/* Label */}
      <h4
        className="text-center mb-4"
        style={{
          fontFamily: spaceGrotesk(),
          fontWeight: 700,
          fontSize: "0.85rem",
          color: C.text,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        {tool.label}
      </h4>

      {/* Items */}
      <div className="flex flex-col gap-2">
        {tool.items.map((item, i) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, x: -10 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4, delay: index * 0.08 + i * 0.06 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md"
            style={{
              background: "rgba(255,69,0,0.03)",
              border: `1px solid ${C.border}`,
              transition: "border-color 0.3s ease, background 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = C.borderBright;
              e.currentTarget.style.background = "rgba(255,69,0,0.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = C.border;
              e.currentTarget.style.background = "rgba(255,69,0,0.03)";
            }}
          >
            <div
              className="w-1 h-1 rounded-full flex-shrink-0"
              style={{
                background: C.molten,
                boxShadow: `0 0 4px ${C.moltenGlow}`,
              }}
            />
            <span
              style={{
                fontFamily: jetbrains(),
                fontSize: "0.7rem",
                color: "rgba(240,237,232,0.6)",
                letterSpacing: "0.03em",
              }}
            >
              {item}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
