"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "@/app/data/projects";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";

/* ═══════════════════════════════════════════════════════════════
   DISTILLERY — Craft Spirits Production Theme
   Accent: #C87533 (copper still)  Icon: ⏢
   ═══════════════════════════════════════════════════════════════ */

const C = {
  bg: "#1A0E05",
  copper: "#C87533",
  copperLight: "#DA8E4A",
  amber: "#D4883A",
  oak: "#5D3A1A",
  cream: "#FFF8E8",
  brass: "#B8860B",
  charredOak: "#2A1A0A",
  text: "#FFF8E8",
  textMuted: "rgba(255,248,232,0.5)",
  textDim: "rgba(255,248,232,0.3)",
  copperGlow: "rgba(200,117,51,0.35)",
  amberGlow: "rgba(212,136,58,0.2)",
  border: "rgba(200,117,51,0.15)",
  borderBright: "rgba(200,117,51,0.45)",
  labelBg: "#FFF8E8",
  waxRed: "#8B1A1A",
  waxDark: "#6B1010",
};

/* ─── Font helpers ─── */
const dmSerif = () => `var(--font-dm-serif), "Georgia", serif`;
const playfair = () => `var(--font-playfair), "Georgia", serif`;
const inter = () => `var(--font-inter), ui-sans-serif, system-ui, sans-serif`;
const jetbrains = () => `var(--font-jetbrains), ui-monospace, monospace`;

/* ─── Vapor/Steam particle component ─── */
function VaporParticles({ count = 18, area = "hero" }: { count?: number; area?: string }) {
  const particles = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: 30 + Math.random() * 40,
      delay: Math.random() * 8,
      duration: 4 + Math.random() * 5,
      size: 6 + Math.random() * 16,
      drift: (Math.random() - 0.5) * 80,
      opacity: 0.08 + Math.random() * 0.12,
    }))
  ).current;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {particles.map((p) => (
        <div
          key={`${area}-vapor-${p.id}`}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            bottom: "20%",
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, rgba(255,248,232,${p.opacity}) 0%, transparent 70%)`,
            animation: `vapor-rise ${p.duration}s ${p.delay}s infinite ease-out`,
            ["--vapor-drift" as string]: `${p.drift}px`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Copper shimmer SVG filter ─── */
function CopperFilters() {
  return (
    <svg className="absolute w-0 h-0" aria-hidden>
      <defs>
        <filter id="copper-shimmer">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.01 0.06"
            numOctaves="3"
            seed="7"
            result="turbulence"
          >
            <animate
              attributeName="baseFrequency"
              values="0.01 0.06;0.015 0.09;0.01 0.06"
              dur="5s"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="turbulence"
            scale="4"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        <linearGradient id="copper-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A0622A" />
          <stop offset="30%" stopColor={C.copper} />
          <stop offset="60%" stopColor="#DA8E4A" />
          <stop offset="100%" stopColor="#A0622A" />
        </linearGradient>
        <linearGradient id="amber-liquid-grad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#6B3A10" />
          <stop offset="30%" stopColor="#A05520" />
          <stop offset="60%" stopColor={C.amber} />
          <stop offset="100%" stopColor="#E8A850" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="brass-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D4A020" />
          <stop offset="50%" stopColor={C.brass} />
          <stop offset="100%" stopColor="#8A6508" />
        </linearGradient>
        <radialGradient id="wax-seal-grad" cx="45%" cy="40%">
          <stop offset="0%" stopColor="#B02020" />
          <stop offset="50%" stopColor={C.waxRed} />
          <stop offset="100%" stopColor={C.waxDark} />
        </radialGradient>
        <pattern id="oak-grain" x="0" y="0" width="60" height="8" patternUnits="userSpaceOnUse">
          <rect width="60" height="8" fill={C.charredOak} />
          <path d="M0 2 Q15 0 30 3 Q45 6 60 2" fill="none" stroke="rgba(200,117,51,0.06)" strokeWidth="0.5" />
          <path d="M0 5 Q20 3 40 6 Q55 8 60 5" fill="none" stroke="rgba(200,117,51,0.04)" strokeWidth="0.3" />
        </pattern>
      </defs>
    </svg>
  );
}

/* ─── Copper Pot Still SVG (tall alembic with swan neck) ─── */
function CopperStillSVG() {
  return (
    <svg viewBox="0 0 320 420" className="w-full max-w-[320px]" aria-hidden>
      <defs>
        <linearGradient id="still-body-grad" x1="0" y1="0" x2="1" y2="0.5">
          <stop offset="0%" stopColor="#8A5020" />
          <stop offset="25%" stopColor={C.copper} />
          <stop offset="50%" stopColor="#DA9550" />
          <stop offset="75%" stopColor={C.copper} />
          <stop offset="100%" stopColor="#8A5020" />
        </linearGradient>
        <linearGradient id="still-dome-grad" x1="0" y1="1" x2="0.3" y2="0">
          <stop offset="0%" stopColor={C.copper} />
          <stop offset="40%" stopColor="#E0A060" />
          <stop offset="70%" stopColor="#DA9550" />
          <stop offset="100%" stopColor="#8A5020" />
        </linearGradient>
        <linearGradient id="neck-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8A5020" />
          <stop offset="50%" stopColor={C.copper} />
          <stop offset="100%" stopColor="#8A5020" />
        </linearGradient>
        <linearGradient id="liquid-fill-grad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#5A2A08" />
          <stop offset="40%" stopColor="#8A4A15" />
          <stop offset="80%" stopColor={C.amber} />
          <stop offset="100%" stopColor="#E8A850" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {/* Pot body — large rounded vessel */}
      <ellipse cx="130" cy="320" rx="100" ry="70" fill="url(#still-body-grad)" stroke="#7A4A18" strokeWidth="1.5" />
      {/* Copper band at base */}
      <ellipse cx="130" cy="370" rx="90" ry="18" fill="none" stroke={C.copper} strokeWidth="2" opacity="0.5" />
      {/* Rivets */}
      {[60, 90, 120, 150, 180, 200].map((x, i) => (
        <circle key={`rivet-${i}`} cx={x} cy={370} r="2" fill="#7A4A18" stroke="#5A3510" strokeWidth="0.5" />
      ))}

      {/* Amber liquid inside with animated fill */}
      <clipPath id="pot-clip">
        <ellipse cx="130" cy="320" rx="95" ry="65" />
      </clipPath>
      <g clipPath="url(#pot-clip)">
        <rect x="35" y="290" width="190" height="80" fill="url(#liquid-fill-grad)" opacity="0.7">
          <animate attributeName="y" values="295;288;295" dur="3s" repeatCount="indefinite" />
        </rect>
        {/* Liquid surface wave */}
        <path d="M35 295 Q80 290 130 295 Q180 300 225 295" fill="none" stroke="#E8A850" strokeWidth="0.8" opacity="0.4">
          <animate
            attributeName="d"
            values="M35 295 Q80 290 130 295 Q180 300 225 295;M35 295 Q80 300 130 293 Q180 288 225 295;M35 295 Q80 290 130 295 Q180 300 225 295"
            dur="3s"
            repeatCount="indefinite"
          />
        </path>
      </g>

      {/* Dome / onion top */}
      <path
        d="M40 270 Q40 250 60 220 Q80 190 100 170 Q120 150 130 130 Q140 150 150 170 Q170 190 190 220 Q210 250 220 270 Q200 260 130 260 Q60 260 40 270Z"
        fill="url(#still-dome-grad)"
        stroke="#7A4A18"
        strokeWidth="1"
      />
      {/* Highlight streak on dome */}
      <path
        d="M100 200 Q110 175 120 160 Q130 175 135 200"
        fill="none"
        stroke="rgba(255,220,160,0.25)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Swan neck — curves upward then right */}
      <path
        d="M130 130 Q130 100 135 80 Q140 50 155 35 Q175 18 200 15 Q230 12 260 20 Q280 25 290 40"
        fill="none"
        stroke="url(#neck-grad)"
        strokeWidth="14"
        strokeLinecap="round"
      />
      {/* Inner neck highlight */}
      <path
        d="M130 130 Q130 100 135 80 Q140 50 155 35 Q175 18 200 15 Q230 12 260 20 Q280 25 290 40"
        fill="none"
        stroke="rgba(255,200,120,0.15)"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Condenser / Lyne arm end — coil */}
      <path
        d="M290 40 Q300 50 295 65 Q290 80 280 85 Q270 90 275 105 Q280 120 270 130 Q260 140 265 155"
        fill="none"
        stroke="url(#neck-grad)"
        strokeWidth="10"
        strokeLinecap="round"
      />

      {/* Drip at condenser end */}
      <ellipse cx="265" cy="165" rx="4" ry="6" fill={C.amber} opacity="0.8">
        <animate attributeName="ry" values="6;8;2;6" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;0.9;0.3;0.8" dur="2.5s" repeatCount="indefinite" />
      </ellipse>

      {/* Steam/vapor from top */}
      <g opacity="0.2" style={{ filter: "url(#copper-shimmer)" }}>
        <path d="M130 125 Q125 105 132 90 Q138 75 128 60" stroke={C.cream} fill="none" strokeWidth="2" opacity="0.3">
          <animate attributeName="opacity" values="0.15;0.35;0.15" dur="3s" repeatCount="indefinite" />
        </path>
        <path d="M140 120 Q145 100 138 82 Q132 65 142 50" stroke={C.cream} fill="none" strokeWidth="1.5" opacity="0.2">
          <animate attributeName="opacity" values="0.1;0.3;0.1" dur="4s" repeatCount="indefinite" />
        </path>
      </g>

      {/* Fire under pot */}
      <g>
        <path d="M80 395 Q90 375 100 385 Q110 370 120 388 Q130 365 140 385 Q150 372 160 395Z" fill="#D44A00" opacity="0.6">
          <animate
            attributeName="d"
            values="M80 395 Q90 375 100 385 Q110 370 120 388 Q130 365 140 385 Q150 372 160 395Z;M80 395 Q92 378 102 387 Q112 368 122 383 Q132 362 142 387 Q152 375 160 395Z;M80 395 Q90 375 100 385 Q110 370 120 388 Q130 365 140 385 Q150 372 160 395Z"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </path>
        <path d="M95 395 Q105 380 115 390 Q120 378 130 392 Q138 382 145 395Z" fill="#FF8030" opacity="0.4">
          <animate
            attributeName="d"
            values="M95 395 Q105 380 115 390 Q120 378 130 392 Q138 382 145 395Z;M95 395 Q108 383 117 388 Q122 375 132 390 Q140 380 145 395Z;M95 395 Q105 380 115 390 Q120 378 130 392 Q138 382 145 395Z"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </path>
      </g>

      {/* Base platform */}
      <rect x="30" y="392" width="210" height="8" rx="3" fill="#3A2010" stroke="#5A3510" strokeWidth="0.5" />
      <rect x="20" y="400" width="230" height="14" rx="4" fill="#2A1508" stroke="#4A2A10" strokeWidth="0.5" />
    </svg>
  );
}

/* ─── Barrel End-Grain SVG ─── */
function BarrelEndSVG({ size = 120 }: { size?: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden>
      {/* Outer barrel rim */}
      <circle cx="60" cy="60" r="56" fill={C.oak} stroke={C.copper} strokeWidth="2" />
      {/* Metal bands */}
      <circle cx="60" cy="60" r="56" fill="none" stroke={C.copper} strokeWidth="2.5" opacity="0.7" />
      <circle cx="60" cy="60" r="48" fill="none" stroke="rgba(200,117,51,0.3)" strokeWidth="1" />
      {/* Wood grain rings */}
      <circle cx="60" cy="60" r="42" fill="none" stroke="rgba(200,117,51,0.15)" strokeWidth="0.5" />
      <circle cx="60" cy="60" r="34" fill="none" stroke="rgba(200,117,51,0.12)" strokeWidth="0.5" />
      <circle cx="60" cy="60" r="26" fill="none" stroke="rgba(200,117,51,0.1)" strokeWidth="0.5" />
      <circle cx="60" cy="60" r="18" fill="none" stroke="rgba(200,117,51,0.08)" strokeWidth="0.5" />
      <circle cx="60" cy="60" r="10" fill="none" stroke="rgba(200,117,51,0.06)" strokeWidth="0.5" />
      {/* Stave lines */}
      {[0, 30, 60, 90, 120, 150].map((angle) => (
        <line
          key={angle}
          x1={60 + 48 * Math.cos((angle * Math.PI) / 180)}
          y1={60 + 48 * Math.sin((angle * Math.PI) / 180)}
          x2={60 + 48 * Math.cos(((angle + 180) * Math.PI) / 180)}
          y2={60 + 48 * Math.sin(((angle + 180) * Math.PI) / 180)}
          stroke="rgba(200,117,51,0.1)"
          strokeWidth="0.5"
        />
      ))}
      {/* Center bung */}
      <circle cx="60" cy="60" r="6" fill={C.charredOak} stroke={C.copper} strokeWidth="1" opacity="0.8" />
    </svg>
  );
}

/* ─── Wax Seal SVG ─── */
function WaxSealSVG({ number }: { number: string }) {
  return (
    <svg viewBox="0 0 60 60" width="48" height="48" aria-hidden>
      {/* Wax blob with irregular edges */}
      <path
        d="M30 4 Q40 2 48 10 Q56 18 54 28 Q58 38 50 46 Q42 54 32 56 Q22 58 14 50 Q6 42 4 32 Q2 22 10 14 Q18 6 30 4Z"
        fill="url(#wax-seal-grad)"
        stroke="#5A0808"
        strokeWidth="0.5"
      />
      {/* Inner circle */}
      <circle cx="30" cy="30" r="18" fill="none" stroke="rgba(255,200,200,0.15)" strokeWidth="0.8" />
      {/* Number */}
      <text
        x="30"
        y="35"
        textAnchor="middle"
        style={{
          fontFamily: dmSerif(),
          fontSize: "14px",
          fill: "rgba(255,200,200,0.7)",
          fontWeight: 400,
        }}
      >
        {number}
      </text>
    </svg>
  );
}

/* ─── Wheat Stalks SVG ─── */
function WheatStalksSVG({ size = 60 }: { size?: number }) {
  return (
    <svg viewBox="0 0 80 100" width={size} height={(size * 100) / 80} aria-hidden>
      {/* Left stalk */}
      <path d="M25 95 Q27 60 30 30 Q32 15 35 5" fill="none" stroke={C.brass} strokeWidth="1.2" opacity="0.5" />
      {[20, 32, 44, 56, 68].map((y, i) => (
        <g key={`l-${i}`}>
          <path d={`M${30 - i * 0.5} ${y} Q${20 - i} ${y - 6} ${15 - i} ${y - 10}`} fill="none" stroke={C.brass} strokeWidth="0.8" opacity="0.4" />
          <ellipse cx={15 - i} cy={y - 10} rx="3" ry="5" fill={C.brass} opacity="0.25" transform={`rotate(-15, ${15 - i}, ${y - 10})`} />
        </g>
      ))}
      {/* Right stalk */}
      <path d="M50 95 Q48 60 47 30 Q46 15 45 5" fill="none" stroke={C.brass} strokeWidth="1.2" opacity="0.5" />
      {[22, 34, 46, 58, 70].map((y, i) => (
        <g key={`r-${i}`}>
          <path d={`M${47 + i * 0.5} ${y} Q${57 + i} ${y - 6} ${62 + i} ${y - 10}`} fill="none" stroke={C.brass} strokeWidth="0.8" opacity="0.4" />
          <ellipse cx={62 + i} cy={y - 10} rx="3" ry="5" fill={C.brass} opacity="0.25" transform={`rotate(15, ${62 + i}, ${y - 10})`} />
        </g>
      ))}
      {/* Center crown */}
      <path d="M35 5 Q40 0 45 5" fill="none" stroke={C.brass} strokeWidth="1" opacity="0.4" />
    </svg>
  );
}

/* ─── Bottle Silhouette SVG ─── */
function BottleSVG({ size = 40 }: { size?: number }) {
  return (
    <svg viewBox="0 0 30 80" width={size * 0.375} height={size} aria-hidden>
      {/* Neck */}
      <rect x="11" y="0" width="8" height="20" rx="2" fill={C.oak} opacity="0.4" />
      {/* Cork */}
      <rect x="11.5" y="0" width="7" height="8" rx="1.5" fill="#8A6530" opacity="0.5" />
      {/* Shoulder */}
      <path d="M11 20 Q5 25 4 35 L4 72 Q4 78 15 78 Q26 78 26 72 L26 35 Q25 25 19 20Z" fill={C.oak} opacity="0.3" stroke={C.copper} strokeWidth="0.5" opacity-stroke="0.2" />
      {/* Liquid fill */}
      <path d="M5 40 L5 72 Q5 77 15 77 Q25 77 25 72 L25 40Z" fill={C.amber} opacity="0.2" />
      {/* Label area */}
      <rect x="6" y="42" width="18" height="22" rx="1" fill={C.cream} opacity="0.08" />
    </svg>
  );
}

/* ─── Copper drip decoration ─── */
function CopperDrip() {
  return (
    <svg viewBox="0 0 200 30" className="w-48 h-8 mx-auto" aria-hidden>
      <path
        d="M0 2 Q50 2 100 2 Q150 2 200 2"
        stroke={C.copper}
        strokeWidth="2"
        fill="none"
        opacity="0.4"
      />
      {/* Drips */}
      {[40, 80, 120, 160].map((x, i) => (
        <g key={`drip-${i}`}>
          <path
            d={`M${x} 2 L${x} ${8 + i * 3} Q${x} ${14 + i * 3} ${x} ${12 + i * 3}`}
            stroke={C.copper}
            strokeWidth="1.5"
            fill="none"
            opacity="0.3"
          />
          <ellipse cx={x} cy={14 + i * 3} rx="2" ry="3" fill={C.amber} opacity="0.3">
            <animate attributeName="ry" values="3;4;2;3" dur={`${2 + i * 0.5}s`} repeatCount="indefinite" />
          </ellipse>
        </g>
      ))}
    </svg>
  );
}

/* ─── Barrel Row SVG for footer ─── */
function BarrelRowSVG() {
  return (
    <svg viewBox="0 0 500 80" className="w-full max-w-lg h-20 mx-auto" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => {
        const x = 30 + i * 95;
        return (
          <g key={`barrel-${i}`}>
            {/* Barrel body */}
            <ellipse cx={x + 35} cy={40} rx="35" ry="30" fill={C.oak} opacity="0.3" />
            {/* Bands */}
            <ellipse cx={x + 35} cy={40} rx="35" ry="30" fill="none" stroke={C.copper} strokeWidth="1" opacity="0.25" />
            <ellipse cx={x + 35} cy={28} rx="30" ry="5" fill="none" stroke={C.copper} strokeWidth="0.8" opacity="0.2" />
            <ellipse cx={x + 35} cy={52} rx="30" ry="5" fill="none" stroke={C.copper} strokeWidth="0.8" opacity="0.2" />
            {/* Stave lines */}
            <line x1={x + 15} y1={12} x2={x + 15} y2={68} stroke="rgba(200,117,51,0.08)" strokeWidth="0.5" />
            <line x1={x + 35} y1={10} x2={x + 35} y2={70} stroke="rgba(200,117,51,0.08)" strokeWidth="0.5" />
            <line x1={x + 55} y1={12} x2={x + 55} y2={68} stroke="rgba(200,117,51,0.08)" strokeWidth="0.5" />
            {/* Bung */}
            <circle cx={x + 35} cy={40} r="3" fill={C.charredOak} stroke={C.copper} strokeWidth="0.5" opacity="0.4" />
          </g>
        );
      })}
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

/* ─── Distillation process icons for tools ─── */
const distillationIcons: Record<string, React.ReactNode> = {
  Languages: (
    <svg viewBox="0 0 40 40" width="32" height="32">
      {/* Grain/mash - wheat kernel */}
      <ellipse cx="20" cy="20" rx="10" ry="14" fill={C.brass} opacity="0.4" />
      <path d="M20 6 Q22 14 20 20 Q18 26 20 34" fill="none" stroke={C.copper} strokeWidth="0.8" opacity="0.5" />
      <path d="M12 12 Q16 16 20 15" fill="none" stroke={C.copper} strokeWidth="0.6" opacity="0.3" />
      <path d="M28 12 Q24 16 20 15" fill="none" stroke={C.copper} strokeWidth="0.6" opacity="0.3" />
    </svg>
  ),
  Frontend: (
    <svg viewBox="0 0 40 40" width="32" height="32">
      {/* Fermentation vessel */}
      <rect x="10" y="8" width="20" height="28" rx="3" fill="none" stroke={C.copper} strokeWidth="1.2" opacity="0.5" />
      <rect x="12" y="20" width="16" height="14" rx="1" fill={C.amber} opacity="0.2" />
      {/* Bubbles */}
      <circle cx="17" cy="25" r="2" fill={C.amber} opacity="0.2" />
      <circle cx="23" cy="22" r="1.5" fill={C.amber} opacity="0.15" />
      <circle cx="20" cy="28" r="1.8" fill={C.amber} opacity="0.18" />
      <rect x="14" y="4" width="12" height="5" rx="1" fill={C.copper} opacity="0.3" />
    </svg>
  ),
  Backend: (
    <svg viewBox="0 0 40 40" width="32" height="32">
      {/* Still / distillation */}
      <ellipse cx="16" cy="28" rx="10" ry="8" fill="none" stroke={C.copper} strokeWidth="1.2" opacity="0.5" />
      <path d="M16 20 Q16 14 18 10 Q22 6 28 8 Q34 10 36 14" fill="none" stroke={C.copper} strokeWidth="1.2" opacity="0.5" />
      <ellipse cx="16" cy="30" rx="8" ry="4" fill={C.amber} opacity="0.15" />
    </svg>
  ),
  "AI / ML": (
    <svg viewBox="0 0 40 40" width="32" height="32">
      {/* Barrel / aging */}
      <ellipse cx="20" cy="20" rx="14" ry="10" fill="none" stroke={C.copper} strokeWidth="1.2" opacity="0.5" />
      <ellipse cx="20" cy="20" rx="14" ry="10" fill={C.oak} opacity="0.15" />
      <ellipse cx="20" cy="14" rx="11" ry="3" fill="none" stroke={C.copper} strokeWidth="0.8" opacity="0.3" />
      <ellipse cx="20" cy="26" rx="11" ry="3" fill="none" stroke={C.copper} strokeWidth="0.8" opacity="0.3" />
      <circle cx="20" cy="20" r="2" fill={C.copper} opacity="0.3" />
    </svg>
  ),
  Data: (
    <svg viewBox="0 0 40 40" width="32" height="32">
      {/* Bottle */}
      <rect x="16" y="2" width="8" height="10" rx="2" fill={C.copper} opacity="0.3" />
      <path d="M16 12 Q10 16 10 22 L10 34 Q10 38 20 38 Q30 38 30 34 L30 22 Q30 16 24 12Z" fill="none" stroke={C.copper} strokeWidth="1.2" opacity="0.5" />
      <path d="M11 22 L11 34 Q11 37 20 37 Q29 37 29 34 L29 22Z" fill={C.amber} opacity="0.15" />
    </svg>
  ),
  Infra: (
    <svg viewBox="0 0 40 40" width="32" height="32">
      {/* Copper tubing/condenser coil */}
      <path d="M8 8 Q32 8 32 16 Q32 20 8 20 Q8 24 32 24 Q32 28 8 28 Q8 32 32 32" fill="none" stroke={C.copper} strokeWidth="2" opacity="0.4" strokeLinecap="round" />
    </svg>
  ),
};

/* ─── Aging stage labels ─── */
const agingStages = [
  { stage: "New Make", years: "0 yrs", color: "#E8D8B0" },
  { stage: "Young Spirit", years: "3 yrs", color: "#D4A850" },
  { stage: "Mature Reserve", years: "12 yrs", color: C.amber },
  { stage: "Master Blend", years: "25 yrs", color: "#8A4A15" },
];

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function DistilleryPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      <style>{`
        @keyframes vapor-rise {
          0% {
            transform: translateY(0) translateX(0) scale(0.5);
            opacity: 0;
          }
          10% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.15;
          }
          100% {
            transform: translateY(-400px) translateX(var(--vapor-drift, 0px)) scale(2);
            opacity: 0;
          }
        }
        @keyframes copper-sheen {
          0%, 100% {
            background-position: -200% center;
          }
          50% {
            background-position: 200% center;
          }
        }
        @keyframes liquid-fill {
          0% {
            height: 0%;
          }
          100% {
            height: var(--fill-height, 60%);
          }
        }
        @keyframes amber-glow {
          0%, 100% {
            box-shadow:
              0 0 15px rgba(200,117,51,0.1),
              0 0 40px rgba(200,117,51,0.05);
          }
          50% {
            box-shadow:
              0 0 25px rgba(200,117,51,0.2),
              0 0 60px rgba(200,117,51,0.08);
          }
        }
        @keyframes barrel-breathe {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(1.005); }
        }
        @keyframes label-age {
          0% { filter: sepia(0) brightness(1); }
          100% { filter: sepia(0.2) brightness(0.98); }
        }
        @keyframes wax-drip {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.03); }
        }
        @keyframes still-bubble {
          0%, 100% { r: 2; opacity: 0.3; }
          50% { r: 3; opacity: 0.5; }
        }
        @keyframes copper-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes text-copper-sheen {
          0%, 100% {
            text-shadow: 0 0 20px rgba(200,117,51,0.3), 0 0 40px rgba(200,117,51,0.15);
          }
          50% {
            text-shadow: 0 0 30px rgba(200,117,51,0.5), 0 0 60px rgba(200,117,51,0.25), 0 0 80px rgba(200,117,51,0.1);
          }
        }
        @keyframes drip-fall {
          0% { transform: translateY(0); opacity: 0.8; }
          80% { transform: translateY(20px); opacity: 0.4; }
          100% { transform: translateY(25px); opacity: 0; }
        }
        @keyframes age-darken {
          0% { background-color: #E8D8B0; }
          33% { background-color: #D4A850; }
          66% { background-color: #D4883A; }
          100% { background-color: #8A4A15; }
        }
      `}</style>

      <CopperFilters />

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
          {/* Background oak-barrel ambience */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 70% 50% at 50% 60%, rgba(200,117,51,0.06) 0%, transparent 70%),
                           radial-gradient(ellipse 40% 40% at 50% 80%, rgba(93,58,26,0.15) 0%, transparent 60%)`,
            }}
            aria-hidden
          />

          {/* Vapor */}
          {mounted && <VaporParticles count={20} area="hero" />}

          {/* Wheat stalks decoration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-4"
          >
            <WheatStalksSVG size={70} />
          </motion.div>

          {/* DISTILLERY title in DM Serif Display with copper sheen */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center relative"
            style={{
              fontFamily: dmSerif(),
              fontWeight: 400,
              fontSize: "clamp(3.5rem, 11vw, 8.5rem)",
              letterSpacing: "0.02em",
              lineHeight: 0.95,
              background: `linear-gradient(100deg, #8A5020 0%, ${C.copper} 20%, #E0B070 40%, ${C.copperLight} 50%, #E0B070 60%, ${C.copper} 80%, #8A5020 100%)`,
              backgroundSize: "300% 100%",
              animation: "copper-flow 8s ease infinite, text-copper-sheen 4s ease-in-out infinite",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            DISTILLERY
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-5 text-center max-w-lg"
            style={{
              fontFamily: playfair(),
              fontSize: "1.05rem",
              color: C.textMuted,
              letterSpacing: "0.01em",
              fontStyle: "italic",
              lineHeight: 1.7,
            }}
          >
            Small-batch applications, crafted with patience.
            <br />
            Distilled from raw data into refined spirits of software.
          </motion.p>

          {/* Copper Still SVG illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.7 }}
            className="mt-10 relative"
          >
            <CopperStillSVG />
          </motion.div>

          {/* Stats as proof/ABV readings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="mt-14 flex gap-10 md:gap-16 flex-wrap justify-center"
          >
            {stats.map((s, i) => {
              const proofLabels = ["PROOF", "DISTILLATIONS", "CASK TYPES"];
              return (
                <div key={s.label} className="flex flex-col items-center gap-2">
                  {/* Barrel end mini */}
                  <BarrelEndSVG size={48} />
                  <span
                    style={{
                      fontFamily: dmSerif(),
                      fontSize: "1.8rem",
                      color: C.copper,
                      animation: "text-copper-sheen 3s ease-in-out infinite",
                      animationDelay: `${i * 0.4}s`,
                    }}
                  >
                    {s.value}
                  </span>
                  <span
                    style={{
                      fontFamily: jetbrains(),
                      fontSize: "0.6rem",
                      color: C.textDim,
                      textTransform: "uppercase",
                      letterSpacing: "0.15em",
                    }}
                  >
                    {proofLabels[i] || s.label}
                  </span>
                  <span
                    style={{
                      fontFamily: inter(),
                      fontSize: "0.7rem",
                      color: C.textMuted,
                    }}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span style={{ fontFamily: jetbrains(), fontSize: "0.6rem", color: C.textDim, letterSpacing: "0.15em" }}>
              EXPLORE THE BARRELHOUSE
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              style={{ width: 1, height: 24, background: `linear-gradient(to bottom, ${C.copper}, transparent)` }}
            />
          </motion.div>
        </Section>

        {/* ══════════ PROJECTS (Bottle Labels) ══════════ */}
        <Section id="projects" className="px-6 py-28 max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <span
              style={{
                fontFamily: jetbrains(),
                fontSize: "0.65rem",
                color: C.copper,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              The Cask Collection — Bottled Works
            </span>
            <h2
              className="mt-4"
              style={{
                fontFamily: dmSerif(),
                fontWeight: 400,
                fontSize: "clamp(2rem, 5vw, 3.2rem)",
                letterSpacing: "0.01em",
                color: C.cream,
              }}
            >
              Spirit Collection
            </h2>
            <div
              className="mt-4 mx-auto"
              style={{
                width: 100,
                height: 2,
                background: `linear-gradient(to right, transparent, ${C.copper}, transparent)`,
              }}
            />
          </div>

          <div className="grid gap-8">
            {projects.map((project, idx) => (
              <ProjectCard key={project.title} project={project} index={idx} />
            ))}
          </div>
        </Section>

        {/* ══════════ EXPERTISE (Barrel Cross-Sections) ══════════ */}
        <Section id="expertise" className="px-6 py-28 max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span
              style={{
                fontFamily: jetbrains(),
                fontSize: "0.65rem",
                color: C.copper,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              The Aging Process — Barrel Craft
            </span>
            <h2
              className="mt-4"
              style={{
                fontFamily: dmSerif(),
                fontWeight: 400,
                fontSize: "clamp(2rem, 5vw, 3rem)",
                letterSpacing: "0.01em",
                color: C.cream,
              }}
            >
              Aged Expertise
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {expertise.map((exp, i) => (
              <ExpertiseCard key={exp.title} item={exp} index={i} />
            ))}
          </div>
        </Section>

        {/* ══════════ TOOLS (Distillation Column) ══════════ */}
        <Section id="tools" className="px-6 py-28 max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span
              style={{
                fontFamily: jetbrains(),
                fontSize: "0.65rem",
                color: C.copper,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              The Distillation Process — From Mash to Spirit
            </span>
            <h2
              className="mt-4"
              style={{
                fontFamily: dmSerif(),
                fontWeight: 400,
                fontSize: "clamp(2rem, 5vw, 3rem)",
                letterSpacing: "0.01em",
                color: C.cream,
              }}
            >
              The Column
            </h2>
          </div>

          {/* Distillation column layout */}
          <div
            className="relative rounded-xl overflow-hidden"
            style={{
              background: `linear-gradient(180deg, ${C.charredOak} 0%, #150A02 100%)`,
              border: `1px solid ${C.border}`,
            }}
          >
            {/* Copper pipe running down left side */}
            <div
              className="absolute left-6 md:left-10 top-0 bottom-0 w-1"
              style={{
                background: `linear-gradient(to bottom, ${C.copper}60, ${C.copper}20, ${C.copper}60)`,
              }}
              aria-hidden
            />

            <div className="py-8 px-8 md:px-16 space-y-0">
              {tools.map((tool, i) => {
                const stageLabels = ["MASHING", "FERMENTATION", "DISTILLATION", "AGING", "BLENDING", "BOTTLING"];
                return (
                  <ToolCategory key={tool.label} tool={tool} index={i} stageLabel={stageLabels[i] || "PROCESS"} />
                );
              })}
            </div>

            {/* Copper valve at bottom */}
            <div className="flex justify-center pb-6">
              <svg viewBox="0 0 40 30" width="40" height="30" aria-hidden>
                <rect x="14" y="0" width="12" height="20" rx="3" fill={C.copper} opacity="0.4" />
                <circle cx="20" cy="10" r="6" fill="none" stroke={C.copper} strokeWidth="1.5" opacity="0.3" />
                <line x1="20" y1="5" x2="20" y2="15" stroke={C.copper} strokeWidth="1" opacity="0.3" />
                <ellipse cx="20" cy="25" rx="4" ry="3" fill={C.amber} opacity="0.2">
                  <animate attributeName="ry" values="3;4;2;3" dur="2s" repeatCount="indefinite" />
                </ellipse>
              </svg>
            </div>
          </div>
        </Section>

        {/* ══════════ FOOTER ══════════ */}
        <Section className="px-6 py-24">
          <div className="max-w-4xl mx-auto text-center">
            {/* Wheat stalks flanking */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex justify-center mb-6"
            >
              <WheatStalksSVG size={80} />
            </motion.div>

            {/* AGED TO PERFECTION */}
            <h2
              style={{
                fontFamily: dmSerif(),
                fontWeight: 400,
                fontSize: "clamp(2rem, 6vw, 4rem)",
                letterSpacing: "0.02em",
                background: `linear-gradient(135deg, ${C.copper} 0%, ${C.amber} 40%, ${C.cream} 70%, ${C.copper} 100%)`,
                backgroundSize: "200% 200%",
                animation: "copper-flow 6s ease infinite",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              AGED TO PERFECTION
            </h2>

            {/* Barrel row illustration */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-8"
            >
              <BarrelRowSVG />
            </motion.div>

            {/* Copper drip */}
            <div className="mt-6">
              <CopperDrip />
            </div>

            <p
              className="mt-6"
              style={{
                fontFamily: playfair(),
                fontSize: "0.95rem",
                color: C.textMuted,
                fontStyle: "italic",
                letterSpacing: "0.01em",
              }}
            >
              Every application, patiently distilled. Every feature, barrel-aged to maturity.
            </p>

            {/* Establishment label */}
            <div
              className="mt-8 inline-block px-6 py-3 rounded-lg"
              style={{
                background: "rgba(200,117,51,0.04)",
                border: `1px solid ${C.border}`,
              }}
            >
              <div
                style={{
                  fontFamily: dmSerif(),
                  fontSize: "0.9rem",
                  color: C.copper,
                  letterSpacing: "0.08em",
                }}
              >
                GROX CRAFT SPIRITS
              </div>
              <div
                className="mt-1"
                style={{
                  fontFamily: jetbrains(),
                  fontSize: "0.6rem",
                  color: C.textDim,
                  letterSpacing: "0.2em",
                }}
              >
                EST. 2024 &mdash; SMALL BATCH &mdash; HANDCRAFTED
              </div>
            </div>

            {/* Barrel end grain decoration */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.3 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.4 }}
              className="flex justify-center mt-10"
            >
              <BarrelEndSVG size={80} />
            </motion.div>

            {/* Vapor at footer */}
            {mounted && (
              <div className="relative h-28 mt-6">
                <VaporParticles count={10} area="footer" />
              </div>
            )}
          </div>
        </Section>

        {/* ══════════ THEME SWITCHER ══════════ */}
        <ThemeSwitcher current="/distillery" variant="dark" />
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PROJECT CARD — Bottle Label Style
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

  const barrelNum = `CASK No. ${String(index + 1).padStart(3, "0")}`;
  const batchYear = project.year;

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
        background: C.labelBg,
        borderRadius: 8,
        border: `2px solid ${hovered ? C.copper : "rgba(200,117,51,0.3)"}`,
        animation: hovered ? "amber-glow 2.5s ease infinite" : "none",
        transition: "border-color 0.4s ease",
        overflow: "hidden",
      }}
    >
      {/* Copper top border accent */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: `linear-gradient(to right, #8A5020, ${C.copper}, ${C.copperLight}, ${C.copper}, #8A5020)`,
          opacity: hovered ? 1 : 0.6,
          transition: "opacity 0.4s ease",
        }}
      />

      {/* Aged paper texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 20% 30%, rgba(200,117,51,0.04) 0%, transparent 50%),
                       radial-gradient(ellipse at 80% 70%, rgba(93,58,26,0.03) 0%, transparent 50%)`,
        }}
        aria-hidden
      />

      <div className="p-6 md:p-8 relative">
        {/* Top row: barrel number + wax seal */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex flex-col gap-1">
            <span
              style={{
                fontFamily: jetbrains(),
                fontSize: "0.6rem",
                color: C.oak,
                letterSpacing: "0.15em",
              }}
            >
              {barrelNum}
            </span>
            <div className="flex items-center gap-2">
              <div className="h-px flex-1" style={{ width: 30, background: "rgba(93,58,26,0.2)" }} />
              <span
                style={{
                  fontFamily: jetbrains(),
                  fontSize: "0.55rem",
                  color: "rgba(93,58,26,0.5)",
                  letterSpacing: "0.08em",
                }}
              >
                {project.client}
              </span>
            </div>
          </div>

          {/* Wax seal with number */}
          <motion.div
            animate={hovered ? { scale: 1.08, rotate: 3 } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.3 }}
            style={{ animation: hovered ? "wax-drip 2s ease infinite" : "none" }}
          >
            <WaxSealSVG number={String(index + 1).padStart(2, "0")} />
          </motion.div>
        </div>

        {/* Decorative line */}
        <div
          className="mb-4"
          style={{
            height: 1,
            background: `linear-gradient(to right, ${C.copper}40, ${C.copper}15, transparent)`,
          }}
        />

        {/* Title — aged serif typography */}
        <h3
          style={{
            fontFamily: dmSerif(),
            fontWeight: 400,
            fontSize: "1.5rem",
            letterSpacing: "0.01em",
            color: C.charredOak,
            lineHeight: 1.25,
          }}
        >
          {title}
        </h3>

        {/* Vintage / batch year */}
        <div className="flex items-center gap-3 mt-2">
          <span
            className="inline-block px-2 py-0.5 rounded"
            style={{
              fontFamily: jetbrains(),
              fontSize: "0.55rem",
              color: C.copper,
              background: "rgba(200,117,51,0.08)",
              border: `1px solid rgba(200,117,51,0.2)`,
              letterSpacing: "0.1em",
            }}
          >
            VINTAGE {batchYear}
          </span>
          <BottleSVG size={24} />
        </div>

        {/* Description — "Tasting Notes" */}
        <div className="mt-4">
          <span
            style={{
              fontFamily: jetbrains(),
              fontSize: "0.55rem",
              color: C.oak,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Tasting Notes
          </span>
          <p
            className="mt-1"
            style={{
              fontFamily: playfair(),
              fontSize: "0.875rem",
              lineHeight: 1.7,
              color: "rgba(42,26,10,0.7)",
              fontStyle: "italic",
            }}
          >
            {project.description}
          </p>
        </div>

        {/* Technical — process details */}
        <p
          className="mt-3"
          style={{
            fontFamily: inter(),
            fontSize: "0.8rem",
            lineHeight: 1.6,
            color: "rgba(42,26,10,0.45)",
          }}
        >
          {project.technical}
        </p>

        {/* Tech tags — "Grain Bill / Ingredients" */}
        <div className="mt-5">
          <span
            style={{
              fontFamily: jetbrains(),
              fontSize: "0.55rem",
              color: C.oak,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Grain Bill
          </span>
          <div className="flex flex-wrap gap-2 mt-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="px-3 py-1 rounded-sm"
                style={{
                  fontFamily: jetbrains(),
                  fontSize: "0.65rem",
                  color: C.copper,
                  background: "rgba(200,117,51,0.06)",
                  border: `1px solid rgba(200,117,51,0.2)`,
                  letterSpacing: "0.03em",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom: copper line + barrel reference + GitHub */}
        <div
          className="mt-6 pt-4"
          style={{
            borderTop: `1px solid rgba(200,117,51,0.15)`,
          }}
        >
          <div className="flex items-center justify-between">
            <span
              style={{
                fontFamily: jetbrains(),
                fontSize: "0.55rem",
                color: "rgba(93,58,26,0.35)",
                letterSpacing: "0.1em",
              }}
            >
              BARREL REF: GRX-{batchYear}-{String(index + 1).padStart(3, "0")}
            </span>

            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
                style={{
                  fontFamily: jetbrains(),
                  fontSize: "0.6rem",
                  color: C.oak,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.copper)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.oak)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                View Source
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   EXPERTISE CARD — Barrel Cross-Section / Aging Stages
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
  const stage = agingStages[index] || agingStages[0];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative"
      style={{
        background: C.charredOak,
        borderRadius: 12,
        border: `1px solid ${C.border}`,
        padding: "2rem",
        transition: "border-color 0.4s ease",
        borderColor: hovered ? C.borderBright : C.border,
        overflow: "hidden",
        animation: hovered ? "barrel-breathe 3s ease infinite" : "none",
      }}
    >
      {/* Oak grain texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 6px,
            rgba(200,117,51,0.03) 6px,
            rgba(200,117,51,0.03) 7px
          )`,
        }}
        aria-hidden
      />

      {/* Copper band shimmer on hover */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, transparent 30%, rgba(200,117,51,0.04) 50%, transparent 70%)`,
          transform: hovered ? "translateX(100%)" : "translateX(-100%)",
          transition: "transform 0.8s ease",
        }}
        aria-hidden
      />

      {/* Barrel cross-section icon */}
      <div className="mb-4 flex items-center gap-3">
        <BarrelEndSVG size={56} />
        <div>
          {/* Aging stage label */}
          <div
            className="flex items-center gap-2 mb-1"
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: stage.color,
                boxShadow: `0 0 8px ${stage.color}40`,
              }}
            />
            <span
              style={{
                fontFamily: jetbrains(),
                fontSize: "0.55rem",
                color: C.copper,
                letterSpacing: "0.15em",
              }}
            >
              {stage.stage.toUpperCase()} &mdash; {stage.years}
            </span>
          </div>
          <span
            style={{
              fontFamily: jetbrains(),
              fontSize: "0.55rem",
              color: C.textDim,
              letterSpacing: "0.12em",
            }}
          >
            EXPERTISE {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3
        className="mt-2"
        style={{
          fontFamily: dmSerif(),
          fontWeight: 400,
          fontSize: "1.25rem",
          color: C.cream,
          letterSpacing: "0.01em",
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
          color: C.textMuted,
        }}
      >
        {item.body}
      </p>

      {/* Aging color bar — shows progression */}
      <div className="flex gap-1 mt-5">
        {agingStages.map((s, si) => (
          <motion.div
            key={s.stage}
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 + si * 0.1 }}
            className="h-1 rounded-full flex-1"
            style={{
              background: s.color,
              opacity: si <= index ? 0.8 : 0.15,
              transformOrigin: "left",
            }}
          />
        ))}
      </div>

      {/* Bottom copper accent */}
      <div
        className="mt-4 h-px"
        style={{
          background: `linear-gradient(to right, ${C.copper}30, transparent)`,
          opacity: hovered ? 1 : 0.4,
          transition: "opacity 0.4s ease",
        }}
      />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TOOL CATEGORY — Distillation Column Stage
   ═══════════════════════════════════════════════════════════════ */
function ToolCategory({
  tool,
  index,
  stageLabel,
}: {
  tool: (typeof tools)[number];
  index: number;
  stageLabel: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative pl-8 md:pl-12 py-6"
      style={{
        borderBottom: index < tools.length - 1 ? `1px solid ${C.border}` : "none",
      }}
    >
      {/* Connection node on copper pipe */}
      <div
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
        style={{
          background: C.copper,
          boxShadow: `0 0 8px ${C.copperGlow}`,
          border: `2px solid ${C.charredOak}`,
        }}
      />

      {/* Stage label */}
      <div className="flex items-center gap-3 mb-3">
        <span
          style={{
            fontFamily: jetbrains(),
            fontSize: "0.55rem",
            color: C.copper,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          STAGE {String(index + 1).padStart(2, "0")} &mdash; {stageLabel}
        </span>
      </div>

      {/* Process icon + label */}
      <div className="flex items-center gap-3 mb-4">
        <div className="opacity-60">
          {distillationIcons[tool.label] || distillationIcons.Languages}
        </div>
        <h4
          style={{
            fontFamily: dmSerif(),
            fontWeight: 400,
            fontSize: "1.1rem",
            color: C.cream,
            letterSpacing: "0.02em",
          }}
        >
          {tool.label}
        </h4>
      </div>

      {/* Items in a horizontal flow */}
      <div className="flex flex-wrap gap-2">
        {tool.items.map((item, i) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: index * 0.1 + i * 0.05 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md"
            style={{
              background: "rgba(200,117,51,0.04)",
              border: `1px solid ${C.border}`,
              transition: "border-color 0.3s ease, background 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = C.borderBright;
              e.currentTarget.style.background = "rgba(200,117,51,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = C.border;
              e.currentTarget.style.background = "rgba(200,117,51,0.04)";
            }}
          >
            <div
              className="w-1 h-1 rounded-full flex-shrink-0"
              style={{
                background: C.amber,
                boxShadow: `0 0 4px ${C.amberGlow}`,
              }}
            />
            <span
              style={{
                fontFamily: jetbrains(),
                fontSize: "0.7rem",
                color: C.textMuted,
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
