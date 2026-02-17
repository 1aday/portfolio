"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "@/app/data/projects";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";

/* ─── Color palette ─── */
const C = {
  bg: "#0A0A1A",
  gold: "#D4AF37",
  goldMuted: "rgba(212,175,55,0.25)",
  goldFaint: "rgba(212,175,55,0.08)",
  blue: "#2D3A8C",
  blueMuted: "rgba(45,58,140,0.4)",
  white: "#F0E6D2",
  silver: "#C0C0D0",
  amethyst: "#7B2D8E",
  blood: "#8B0000",
  card: "rgba(212,175,55,0.04)",
  cardBorder: "rgba(212,175,55,0.15)",
};

/* ─── Roman numerals ─── */
const ROMAN = [
  "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X",
  "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX",
];

/* ─── Major Arcana card names for projects ─── */
const ARCANA_NAMES = [
  "The Magician",
  "The High Priestess",
  "The Empress",
  "The Emperor",
  "The Hierophant",
  "The Lovers",
  "The Chariot",
  "Strength",
  "The Hermit",
  "Wheel of Fortune",
];

/* ─── Major Arcana for expertise ─── */
const EXPERTISE_ARCANA = [
  { name: "The Magician", numeral: "I", symbol: "wand" },
  { name: "The High Priestess", numeral: "II", symbol: "scroll" },
  { name: "The Emperor", numeral: "IV", symbol: "orb" },
  { name: "The Star", numeral: "XVII", symbol: "star" },
];

/* ─── Minor Arcana suits for tools ─── */
const SUITS: Record<string, { suit: string; icon: string }> = {
  Languages: { suit: "Wands", icon: "wand" },
  Frontend: { suit: "Cups", icon: "cup" },
  Backend: { suit: "Swords", icon: "sword" },
  "AI / ML": { suit: "Pentacles", icon: "pentacle" },
  Data: { suit: "Pentacles", icon: "pentacle" },
  Infra: { suit: "Swords", icon: "sword" },
};

/* ─── Constellation data (star positions and connections) ─── */
const constellations = [
  { stars: [[80,60],[120,40],[160,55],[140,90],[100,95]], lines: [[0,1],[1,2],[2,3],[3,4],[4,0]] },
  { stars: [[300,80],[340,50],[380,70],[360,110],[320,120]], lines: [[0,1],[1,2],[2,3],[3,4]] },
  { stars: [[500,40],[540,60],[580,35],[560,80],[520,90]], lines: [[0,1],[1,2],[0,3],[3,4]] },
  { stars: [[700,70],[740,45],[780,65],[760,100]], lines: [[0,1],[1,2],[2,3],[3,0]] },
  { stars: [[200,200],[240,180],[280,210],[260,240]], lines: [[0,1],[1,2],[2,3]] },
  { stars: [[600,180],[640,160],[680,190],[660,220],[620,230]], lines: [[0,1],[1,2],[2,3],[3,4],[4,0]] },
  { stars: [[900,50],[940,70],[960,40],[980,80]], lines: [[0,1],[1,2],[2,3]] },
  { stars: [[100,300],[140,280],[180,310],[160,340]], lines: [[0,1],[1,2],[2,3],[3,0]] },
];

/* ═══════════════════════════════════════════
   SVG Components
   ═══════════════════════════════════════════ */

function ConstellationBackground() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1200 500"
      preserveAspectRatio="xMidYMid slice"
      style={{ opacity: 0.3 }}
    >
      {constellations.map((c, ci) => (
        <g key={ci}>
          {c.lines.map(([a, b], li) => (
            <line
              key={li}
              x1={c.stars[a][0]} y1={c.stars[a][1]}
              x2={c.stars[b][0]} y2={c.stars[b][1]}
              stroke={C.gold}
              strokeWidth="0.5"
              strokeOpacity="0.4"
              strokeDasharray="4 4"
            >
              <animate
                attributeName="stroke-opacity"
                values="0.2;0.6;0.2"
                dur={`${3 + ci * 0.5}s`}
                repeatCount="indefinite"
              />
            </line>
          ))}
          {c.stars.map(([x, y], si) => (
            <circle key={si} cx={x} cy={y} r="1.5" fill={C.gold}>
              <animate
                attributeName="r"
                values="1;2.5;1"
                dur={`${2 + si * 0.3}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.5;1;0.5"
                dur={`${2 + si * 0.3}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </g>
      ))}
    </svg>
  );
}

function CrescentMoon({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={className} fill="none">
      <path
        d="M28 5C18.06 5 10 13.06 10 23s8.06 18 18 18c2.14 0 4.18-.38 6.08-1.06C28.18 36.36 23 29.3 23 21c0-8.3 5.18-15.36 11.08-18.94C32.18 .38 30.14 0 28 0"
        fill={C.gold}
        opacity="0.8"
        transform="translate(-5,-1) scale(0.95)"
      />
    </svg>
  );
}

function SunRays({ size = 50, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 50 50" className={className} fill="none">
      <circle cx="25" cy="25" r="8" fill={C.gold} opacity="0.9" />
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30) * (Math.PI / 180);
        const x1 = 25 + Math.cos(angle) * 12;
        const y1 = 25 + Math.sin(angle) * 12;
        const x2 = 25 + Math.cos(angle) * (i % 2 === 0 ? 22 : 18);
        const y2 = 25 + Math.sin(angle) * (i % 2 === 0 ? 22 : 18);
        return (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={C.gold}
            strokeWidth={i % 2 === 0 ? "1.5" : "0.8"}
            strokeLinecap="round"
            opacity="0.8"
          />
        );
      })}
    </svg>
  );
}

function StarSVG({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} fill="none">
      <path
        d="M8 0L9.8 6.2L16 8L9.8 9.8L8 16L6.2 9.8L0 8L6.2 6.2Z"
        fill={C.gold}
        opacity="0.9"
      />
    </svg>
  );
}

function PentacleSVG({ size = 32, className = "" }: { size?: number; className?: string }) {
  const points: [number, number][] = [];
  for (let i = 0; i < 5; i++) {
    const angle = (i * 72 - 90) * (Math.PI / 180);
    points.push([16 + Math.cos(angle) * 13, 16 + Math.sin(angle) * 13]);
  }
  const starPath = [0, 2, 4, 1, 3, 0].map((idx, i) =>
    `${i === 0 ? "M" : "L"}${points[idx][0]},${points[idx][1]}`
  ).join(" ") + "Z";

  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} fill="none">
      <circle cx="16" cy="16" r="14" stroke={C.gold} strokeWidth="1" opacity="0.6" />
      <path d={starPath} stroke={C.gold} strokeWidth="0.8" fill="none" opacity="0.8" />
    </svg>
  );
}

function CrystalBall({ size = 60, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} fill="none">
      <defs>
        <radialGradient id="crystalGrad" cx="40%" cy="35%">
          <stop offset="0%" stopColor={C.amethyst} stopOpacity="0.3" />
          <stop offset="50%" stopColor={C.blue} stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0A0A2A" stopOpacity="0.9" />
        </radialGradient>
        <radialGradient id="crystalShine" cx="35%" cy="30%">
          <stop offset="0%" stopColor="white" stopOpacity="0.3" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="30" cy="54" rx="18" ry="4" fill={C.gold} opacity="0.3" />
      <path d="M18 52h24l2 4H16l2-4z" fill={C.gold} opacity="0.6" />
      <path d="M22 48h16l2 4H20l2-4z" fill={C.gold} opacity="0.5" />
      <circle cx="30" cy="28" r="20" fill="url(#crystalGrad)" stroke={C.gold} strokeWidth="0.8" />
      <circle cx="30" cy="28" r="20" fill="url(#crystalShine)" />
      <circle cx="24" cy="22" r="4" fill="white" opacity="0.08" />
      {/* tiny stars inside */}
      <circle cx="25" cy="30" r="0.8" fill={C.gold} opacity="0.6">
        <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="35" cy="25" r="0.6" fill={C.gold} opacity="0.5">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="30" cy="35" r="0.7" fill={C.white} opacity="0.4">
        <animate attributeName="opacity" values="0.2;0.8;0.2" dur="2.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

/* ─── Ornate Tarot Card Frame SVG ─── */
function TarotCardFrame({
  width = 260,
  height = 400,
  children,
  className = "",
  glowColor = C.gold,
}: {
  width?: number;
  height?: number;
  children?: React.ReactNode;
  className?: string;
  glowColor?: string;
}) {
  const m = 8; // margin
  const cSize = 14; // corner decoration size
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      fill="none"
    >
      <defs>
        <filter id="tarotGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Outer frame */}
      <rect
        x={m} y={m}
        width={width - m * 2} height={height - m * 2}
        rx="6"
        stroke={glowColor}
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />
      {/* Inner frame */}
      <rect
        x={m + 8} y={m + 8}
        width={width - m * 2 - 16} height={height - m * 2 - 16}
        rx="4"
        stroke={glowColor}
        strokeWidth="0.8"
        fill="none"
        opacity="0.4"
      />
      {/* Corner decorations - top left */}
      <g opacity="0.7" filter="url(#tarotGlow)">
        {/* Top-left star */}
        <path d={`M${m + 4} ${m + cSize} L${m + cSize / 2 + 4} ${m + 4} L${m + cSize + 4} ${m + cSize}`} stroke={glowColor} strokeWidth="0.8" fill="none" />
        <circle cx={m + cSize / 2 + 4} cy={m + 4} r="2" fill={glowColor} opacity="0.5" />
        {/* Top-right star */}
        <path d={`M${width - m - 4} ${m + cSize} L${width - m - cSize / 2 - 4} ${m + 4} L${width - m - cSize - 4} ${m + cSize}`} stroke={glowColor} strokeWidth="0.8" fill="none" />
        <circle cx={width - m - cSize / 2 - 4} cy={m + 4} r="2" fill={glowColor} opacity="0.5" />
        {/* Bottom-left crescent */}
        <path d={`M${m + 6} ${height - m - 6} A6 6 0 0 1 ${m + 18} ${height - m - 6}`} stroke={glowColor} strokeWidth="0.8" fill="none" />
        <circle cx={m + 12} cy={height - m - 8} r="1.5" fill={glowColor} opacity="0.4" />
        {/* Bottom-right crescent */}
        <path d={`M${width - m - 18} ${height - m - 6} A6 6 0 0 1 ${width - m - 6} ${height - m - 6}`} stroke={glowColor} strokeWidth="0.8" fill="none" />
        <circle cx={width - m - 12} cy={height - m - 8} r="1.5" fill={glowColor} opacity="0.4" />
      </g>
      {/* Center top decoration */}
      <path
        d={`M${width / 2 - 15} ${m + 2} L${width / 2} ${m - 2} L${width / 2 + 15} ${m + 2}`}
        stroke={glowColor}
        strokeWidth="0.8"
        fill="none"
        opacity="0.5"
      />
      {/* Center bottom decoration */}
      <path
        d={`M${width / 2 - 15} ${height - m - 2} L${width / 2} ${height - m + 2} L${width / 2 + 15} ${height - m - 2}`}
        stroke={glowColor}
        strokeWidth="0.8"
        fill="none"
        opacity="0.5"
      />
      {children}
    </svg>
  );
}

/* ─── Hero Tarot Card (The Star) ─── */
function HeroTarotCard() {
  return (
    <div className="relative" style={{ width: 280, height: 420 }}>
      <TarotCardFrame width={280} height={420}>
        {/* Background gradient */}
        <defs>
          <linearGradient id="heroCardBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.blue} stopOpacity="0.4" />
            <stop offset="100%" stopColor={C.amethyst} stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <rect x="18" y="18" width="244" height="384" rx="3" fill="url(#heroCardBg)" />

        {/* The Star - large 8-pointed star */}
        <g transform="translate(140,180)">
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 45) * (Math.PI / 180);
            const x = Math.cos(angle) * 50;
            const y = Math.sin(angle) * 50;
            return (
              <line key={i} x1="0" y1="0" x2={x} y2={y} stroke={C.gold} strokeWidth="1.2" opacity="0.7">
                <animate attributeName="opacity" values="0.4;0.9;0.4" dur={`${2 + i * 0.2}s`} repeatCount="indefinite" />
              </line>
            );
          })}
          <circle r="12" fill={C.gold} opacity="0.3" />
          <circle r="8" fill={C.gold} opacity="0.5" />
          <circle r="4" fill={C.gold} opacity="0.8" />
          {/* Orbiting smaller stars */}
          {Array.from({ length: 7 }).map((_, i) => {
            const angle = (i * 51.4) * (Math.PI / 180);
            const r = 35;
            return (
              <g key={i}>
                <circle
                  cx={Math.cos(angle) * r}
                  cy={Math.sin(angle) * r}
                  r="2.5"
                  fill={C.gold}
                  opacity="0.6"
                >
                  <animate attributeName="opacity" values="0.3;0.8;0.3" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
                </circle>
              </g>
            );
          })}
        </g>

        {/* Water below */}
        <path d="M18 300 Q70 290 140 300 Q210 310 262 300 V402 H18 Z" fill={C.blue} opacity="0.15" />
        <path d="M18 310 Q80 300 140 310 Q200 320 262 310" stroke={C.silver} strokeWidth="0.5" fill="none" opacity="0.3" />
        <path d="M18 325 Q90 315 140 325 Q190 335 262 325" stroke={C.silver} strokeWidth="0.4" fill="none" opacity="0.2" />

        {/* Title */}
        <text x="140" y="55" textAnchor="middle" fill={C.gold} fontSize="11" fontFamily="var(--font-instrument)" letterSpacing="3" opacity="0.8">
          XVII
        </text>
        <text x="140" y="378" textAnchor="middle" fill={C.gold} fontSize="12" fontFamily="var(--font-instrument)" letterSpacing="2" opacity="0.8">
          THE STAR
        </text>
      </TarotCardFrame>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Animation Helpers
   ═══════════════════════════════════════════ */

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   Tarot Card Flip Component
   ═══════════════════════════════════════════ */

function TarotProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [flipped, setFlipped] = useState(false);
  const numeral = ROMAN[index] || String(index + 1);
  const arcanaName = ARCANA_NAMES[index] || "The Unknown";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, rotateY: -90 }}
      animate={isInView ? { opacity: 1, rotateY: 0 } : { opacity: 0, rotateY: -90 }}
      transition={{
        duration: 0.9,
        delay: (index % 5) * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="cursor-pointer"
      style={{ perspective: "1200px" }}
      onClick={() => setFlipped(!flipped)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          transformStyle: "preserve-3d",
          position: "relative",
          width: "100%",
          minHeight: 440,
        }}
      >
        {/* ── Front of card ── */}
        <div
          className="absolute inset-0 rounded-lg overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            background: `linear-gradient(180deg, rgba(45,58,140,0.15) 0%, rgba(10,10,26,0.95) 100%)`,
            border: `1px solid ${C.cardBorder}`,
          }}
        >
          <div className="relative p-5 sm:p-6 h-full flex flex-col">
            {/* Ornate border overlay */}
            <div className="absolute inset-2 rounded pointer-events-none" style={{
              border: `1px solid ${C.goldMuted}`,
              borderRadius: 4,
            }} />
            {/* Corner stars */}
            <div className="absolute top-4 left-4"><StarSVG size={10} /></div>
            <div className="absolute top-4 right-4"><StarSVG size={10} /></div>
            <div className="absolute bottom-4 left-4 opacity-60">
              <CrescentMoon size={14} />
            </div>
            <div className="absolute bottom-4 right-4 opacity-60">
              <CrescentMoon size={14} />
            </div>

            {/* Roman numeral */}
            <div className="text-center mb-3">
              <span
                style={{
                  color: C.gold,
                  fontFamily: "var(--font-instrument)",
                  fontSize: 14,
                  letterSpacing: 4,
                  opacity: 0.8,
                }}
              >
                {numeral}
              </span>
            </div>

            {/* Central illustration area */}
            <div
              className="flex-1 flex flex-col items-center justify-center text-center px-2"
              style={{ minHeight: 200 }}
            >
              {/* Mystical decorative circle */}
              <div
                className="relative mb-4"
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  border: `1px solid ${C.goldMuted}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: `radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)`,
                }}
              >
                <SunRays size={44} />
              </div>

              <h3
                className="mb-2"
                style={{
                  fontFamily: "var(--font-dm-serif)",
                  fontSize: 18,
                  color: C.white,
                  lineHeight: 1.3,
                  whiteSpace: "pre-line",
                }}
              >
                {project.title}
              </h3>

              <p
                className="mb-3"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: 12,
                  color: C.silver,
                  lineHeight: 1.5,
                  opacity: 0.75,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1.5 justify-center mt-auto">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded-full text-[10px]"
                    style={{
                      border: `1px solid ${C.goldMuted}`,
                      color: C.gold,
                      fontFamily: "var(--font-jetbrains)",
                      background: C.goldFaint,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Card name at bottom */}
            <div className="text-center mt-3 pt-3" style={{ borderTop: `1px solid ${C.goldMuted}` }}>
              <span
                style={{
                  color: C.gold,
                  fontFamily: "var(--font-instrument)",
                  fontSize: 11,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  opacity: 0.8,
                }}
              >
                {arcanaName}
              </span>
            </div>

            {/* Flip hint */}
            <div className="absolute bottom-2 right-2 opacity-40" style={{ fontSize: 8, color: C.silver, fontFamily: "var(--font-inter)" }}>
              tap to reveal
            </div>
          </div>
        </div>

        {/* ── Back of card (revealed reading) ── */}
        <div
          className="absolute inset-0 rounded-lg overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: `linear-gradient(180deg, rgba(123,45,142,0.12) 0%, rgba(10,10,26,0.98) 100%)`,
            border: `1px solid ${C.amethyst}40`,
          }}
        >
          <div className="relative p-5 sm:p-6 h-full flex flex-col">
            {/* Ornate border */}
            <div className="absolute inset-2 rounded pointer-events-none" style={{
              border: `1px solid rgba(123,45,142,0.25)`,
              borderRadius: 4,
            }} />

            <div className="text-center mb-2">
              <span style={{ color: C.amethyst, fontFamily: "var(--font-instrument)", fontSize: 11, letterSpacing: 3, opacity: 0.9 }}>
                THE READING
              </span>
            </div>

            <h3
              className="text-center mb-3"
              style={{
                fontFamily: "var(--font-dm-serif)",
                fontSize: 17,
                color: C.white,
                lineHeight: 1.3,
                whiteSpace: "pre-line",
              }}
            >
              {project.title}
            </h3>

            <div className="flex items-center gap-2 mb-3">
              <span style={{ fontSize: 10, color: C.gold, fontFamily: "var(--font-jetbrains)" }}>
                {project.client}
              </span>
              <span style={{ fontSize: 10, color: C.silver, opacity: 0.4 }}>|</span>
              <span style={{ fontSize: 10, color: C.silver, fontFamily: "var(--font-jetbrains)", opacity: 0.6 }}>
                {project.year}
              </span>
            </div>

            <p
              className="mb-3"
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: 11.5,
                color: C.silver,
                lineHeight: 1.6,
                opacity: 0.8,
              }}
            >
              {project.technical}
            </p>

            <div className="flex flex-wrap gap-1.5 mt-auto mb-3">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded-full text-[10px]"
                  style={{
                    border: `1px solid rgba(123,45,142,0.3)`,
                    color: C.amethyst,
                    fontFamily: "var(--font-jetbrains)",
                    background: "rgba(123,45,142,0.08)",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>

            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-auto"
                style={{
                  fontSize: 11,
                  color: C.gold,
                  fontFamily: "var(--font-inter)",
                  opacity: 0.8,
                  textDecoration: "underline",
                  textUnderlineOffset: 3,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                View Repository
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 8L8 2M8 2H3M8 2V7" stroke={C.gold} strokeWidth="1" strokeLinecap="round" />
                </svg>
              </a>
            )}

            <div className="text-center mt-3 pt-3" style={{ borderTop: `1px solid rgba(123,45,142,0.2)` }}>
              <span style={{ color: C.amethyst, fontFamily: "var(--font-instrument)", fontSize: 10, letterSpacing: 2, opacity: 0.6 }}>
                {numeral} - {arcanaName.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   Expertise Arcana Card
   ═══════════════════════════════════════════ */

function ExpertiseCard({
  item,
  arcana,
  index,
}: {
  item: (typeof expertise)[0];
  arcana: (typeof EXPERTISE_ARCANA)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.85, rotateY: -30 }}
      animate={isInView ? { opacity: 1, scale: 1, rotateY: 0 } : { opacity: 0, scale: 0.85, rotateY: -30 }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="relative group"
      style={{ perspective: "800px" }}
    >
      <div
        className="relative rounded-lg p-6 h-full transition-all duration-500"
        style={{
          background: `linear-gradient(170deg, rgba(45,58,140,0.12) 0%, rgba(10,10,26,0.95) 100%)`,
          border: `1px solid ${C.cardBorder}`,
          minHeight: 320,
        }}
      >
        {/* Inner border */}
        <div className="absolute inset-3 rounded pointer-events-none" style={{ border: `1px solid ${C.goldMuted}` }} />

        {/* Corner accents */}
        <div className="absolute top-3 left-3"><StarSVG size={8} /></div>
        <div className="absolute top-3 right-3"><StarSVG size={8} /></div>
        <div className="absolute bottom-3 left-3 opacity-50"><CrescentMoon size={12} /></div>
        <div className="absolute bottom-3 right-3 opacity-50"><CrescentMoon size={12} /></div>

        {/* Numeral */}
        <div className="text-center mb-4">
          <span style={{ color: C.gold, fontFamily: "var(--font-instrument)", fontSize: 13, letterSpacing: 3, opacity: 0.7 }}>
            {arcana.numeral}
          </span>
        </div>

        {/* Symbol */}
        <div className="flex justify-center mb-4">
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              border: `1px solid ${C.goldMuted}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `radial-gradient(circle, ${C.goldFaint} 0%, transparent 70%)`,
            }}
          >
            {arcana.symbol === "wand" && <SunRays size={30} />}
            {arcana.symbol === "scroll" && <CrescentMoon size={28} />}
            {arcana.symbol === "orb" && <PentacleSVG size={28} />}
            {arcana.symbol === "star" && <StarSVG size={24} />}
          </div>
        </div>

        <h3
          className="text-center mb-3"
          style={{
            fontFamily: "var(--font-dm-serif)",
            fontSize: 17,
            color: C.white,
            lineHeight: 1.3,
          }}
        >
          {item.title}
        </h3>

        <p
          className="text-center"
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: 12,
            color: C.silver,
            lineHeight: 1.7,
            opacity: 0.7,
          }}
        >
          {item.body}
        </p>

        {/* Arcana name */}
        <div className="text-center mt-4 pt-3" style={{ borderTop: `1px solid ${C.goldMuted}` }}>
          <span style={{ color: C.gold, fontFamily: "var(--font-instrument)", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", opacity: 0.7 }}>
            {arcana.name}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   Tool Suit Card
   ═══════════════════════════════════════════ */

function ToolSuitCard({
  tool,
  index,
}: {
  tool: (typeof tools)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const suitInfo = SUITS[tool.label] || { suit: "Wands", icon: "wand" };

  const SuitIcon = () => {
    switch (suitInfo.icon) {
      case "wand":
        return <SunRays size={20} />;
      case "cup":
        return <CrescentMoon size={20} />;
      case "sword":
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <line x1="10" y1="2" x2="10" y2="18" stroke={C.gold} strokeWidth="1.2" />
            <line x1="6" y1="6" x2="14" y2="6" stroke={C.gold} strokeWidth="1" />
            <circle cx="10" cy="5" r="1" fill={C.gold} opacity="0.6" />
          </svg>
        );
      case "pentacle":
        return <PentacleSVG size={22} />;
      default:
        return <StarSVG size={18} />;
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="rounded-lg p-5 h-full relative"
        style={{
          background: `linear-gradient(180deg, rgba(212,175,55,0.03) 0%, rgba(10,10,26,0.95) 100%)`,
          border: `1px solid ${C.cardBorder}`,
        }}
      >
        {/* Inner border */}
        <div className="absolute inset-2 rounded pointer-events-none" style={{ border: `1px solid ${C.goldFaint}` }} />

        <div className="flex items-center gap-3 mb-4">
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: `1px solid ${C.goldMuted}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: C.goldFaint,
            }}
          >
            <SuitIcon />
          </div>
          <div>
            <h4
              style={{
                fontFamily: "var(--font-dm-serif)",
                fontSize: 15,
                color: C.white,
              }}
            >
              {tool.label}
            </h4>
            <span
              style={{
                fontFamily: "var(--font-instrument)",
                fontSize: 10,
                color: C.gold,
                letterSpacing: 2,
                opacity: 0.6,
                textTransform: "uppercase",
              }}
            >
              Suit of {suitInfo.suit}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {tool.items.map((item) => (
            <span
              key={item}
              className="px-2.5 py-1 rounded text-xs"
              style={{
                border: `1px solid ${C.goldMuted}`,
                color: C.gold,
                fontFamily: "var(--font-jetbrains)",
                fontSize: 11,
                background: C.goldFaint,
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   Floating Stars Background
   ═══════════════════════════════════════════ */

function FloatingStars() {
  const starData = Array.from({ length: 60 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    delay: Math.random() * 5,
    dur: 2 + Math.random() * 3,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {starData.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            background: i % 5 === 0 ? C.gold : C.white,
            opacity: 0.3,
            animation: `twinkle ${s.dur}s ${s.delay}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════
   Footer Fan of Cards
   ═══════════════════════════════════════════ */

function CardFan() {
  const cards = Array.from({ length: 7 });
  return (
    <div className="relative flex justify-center items-end" style={{ height: 160 }}>
      {cards.map((_, i) => {
        const angle = (i - 3) * 12;
        const yShift = Math.abs(i - 3) * 8;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.6 }}
            className="absolute"
            style={{
              width: 50,
              height: 80,
              borderRadius: 4,
              border: `1px solid ${C.goldMuted}`,
              background: `linear-gradient(180deg, rgba(45,58,140,0.2) 0%, rgba(10,10,26,0.9) 100%)`,
              transform: `rotate(${angle}deg) translateY(-${yShift}px)`,
              transformOrigin: "bottom center",
            }}
          >
            <div className="absolute inset-1 rounded-sm" style={{ border: `0.5px solid ${C.goldFaint}` }} />
            <div className="flex items-center justify-center h-full">
              <StarSVG size={8} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════
   Section Divider
   ═══════════════════════════════════════════ */

function MysticDivider() {
  return (
    <div className="flex items-center justify-center gap-4 py-8">
      <div className="h-px flex-1 max-w-[120px]" style={{ background: `linear-gradient(90deg, transparent, ${C.goldMuted})` }} />
      <CrescentMoon size={18} />
      <StarSVG size={12} />
      <SunRays size={22} />
      <StarSVG size={12} />
      <CrescentMoon size={18} />
      <div className="h-px flex-1 max-w-[120px]" style={{ background: `linear-gradient(90deg, ${C.goldMuted}, transparent)` }} />
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */

export default function TarotPage() {
  const [moonPhase, setMoonPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMoonPhase((p) => (p + 1) % 8);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        @keyframes mysticGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(212,175,55,0.1), 0 0 40px rgba(212,175,55,0.05); }
          50% { box-shadow: 0 0 30px rgba(212,175,55,0.2), 0 0 60px rgba(212,175,55,0.1); }
        }
        @keyframes constellationDraw {
          0% { stroke-dashoffset: 200; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes moonFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes cardReveal {
          0% { transform: perspective(1200px) rotateY(180deg); opacity: 0; }
          100% { transform: perspective(1200px) rotateY(0deg); opacity: 1; }
        }
        @keyframes starPulse {
          0%, 100% { filter: drop-shadow(0 0 4px rgba(212,175,55,0.3)); }
          50% { filter: drop-shadow(0 0 12px rgba(212,175,55,0.6)); }
        }
        @keyframes celestialRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes borderShimmer {
          0% { border-color: rgba(212,175,55,0.15); }
          50% { border-color: rgba(212,175,55,0.35); }
          100% { border-color: rgba(212,175,55,0.15); }
        }
        @keyframes mysticWave {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(1.02); }
        }
      `}</style>

      <div
        className="relative min-h-screen"
        style={{
          background: C.bg,
          color: C.white,
          fontFamily: "var(--font-inter)",
          overflowX: "hidden",
        }}
      >
        <FloatingStars />

        {/* ═══════════════════════════════════════
            HERO SECTION
           ═══════════════════════════════════════ */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden">
          {/* Constellation background */}
          <div className="absolute inset-0">
            <ConstellationBackground />
          </div>

          {/* Celestial border frame */}
          <div
            className="absolute inset-4 sm:inset-8 md:inset-12 pointer-events-none rounded-lg"
            style={{
              border: `1px solid ${C.goldMuted}`,
              animation: "borderShimmer 4s ease-in-out infinite",
            }}
          >
            {/* Corner celestial decorations */}
            <div className="absolute -top-3 -left-3">
              <StarSVG size={20} />
            </div>
            <div className="absolute -top-3 -right-3">
              <CrescentMoon size={22} />
            </div>
            <div className="absolute -bottom-3 -left-3">
              <CrescentMoon size={22} />
            </div>
            <div className="absolute -bottom-3 -right-3">
              <SunRays size={26} />
            </div>
            {/* Mid-border decorations */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <SunRays size={30} />
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
              <PentacleSVG size={24} />
            </div>
          </div>

          {/* Rotating celestial ring */}
          <div
            className="absolute pointer-events-none"
            style={{
              width: 500,
              height: 500,
              animation: "celestialRotate 60s linear infinite",
              opacity: 0.12,
            }}
          >
            <svg width="500" height="500" viewBox="0 0 500 500" fill="none">
              <circle cx="250" cy="250" r="240" stroke={C.gold} strokeWidth="0.5" strokeDasharray="8 8" />
              <circle cx="250" cy="250" r="200" stroke={C.gold} strokeWidth="0.3" strokeDasharray="4 12" />
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * 30) * (Math.PI / 180);
                const x = 250 + Math.cos(angle) * 240;
                const y = 250 + Math.sin(angle) * 240;
                return <circle key={i} cx={x} cy={y} r="3" fill={C.gold} />;
              })}
            </svg>
          </div>

          {/* Title and card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 text-center mb-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="mb-4 flex items-center justify-center gap-3"
            >
              <CrescentMoon size={20} />
              <span
                style={{
                  fontFamily: "var(--font-instrument)",
                  fontSize: 13,
                  color: C.gold,
                  letterSpacing: 6,
                  textTransform: "uppercase",
                  opacity: 0.7,
                }}
              >
                A Mystical Divination
              </span>
              <CrescentMoon size={20} />
            </motion.div>

            <h1
              style={{
                fontFamily: "var(--font-instrument)",
                fontStyle: "italic",
                fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
                color: C.gold,
                lineHeight: 1.1,
                letterSpacing: 2,
                textShadow: `0 0 40px rgba(212,175,55,0.3), 0 0 80px rgba(212,175,55,0.1)`,
              }}
            >
              The Grox Tarot
            </h1>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto mt-4 h-px"
              style={{ maxWidth: 300, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)` }}
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 1 }}
              className="mt-4"
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: 14,
                color: C.silver,
                letterSpacing: 2,
                maxWidth: 500,
              }}
            >
              AI Product Studio &mdash; Revealing the Future Through Code
            </motion.p>
          </motion.div>

          {/* Central Tarot Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10"
            style={{
              perspective: "1200px",
              animation: "mysticGlow 3s ease-in-out infinite",
              borderRadius: 8,
            }}
          >
            <HeroTarotCard />
          </motion.div>

          {/* Stats as card readings */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="relative z-10 flex gap-8 sm:gap-12 mt-10"
          >
            {stats.map((stat, i) => (
              <div key={stat.label} className="text-center">
                <div className="flex justify-center mb-2">
                  <StarSVG size={10} />
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-dm-serif)",
                    fontSize: 28,
                    color: C.gold,
                    lineHeight: 1,
                    textShadow: `0 0 20px rgba(212,175,55,0.3)`,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  className="mt-1"
                  style={{
                    fontFamily: "var(--font-instrument)",
                    fontSize: 11,
                    color: C.silver,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    opacity: 0.6,
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
            animate={{ opacity: 0.5 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            style={{ animation: "moonFloat 2s ease-in-out infinite" }}
          >
            <svg width="20" height="30" viewBox="0 0 20 30" fill="none">
              <rect x="1" y="1" width="18" height="28" rx="9" stroke={C.gold} strokeWidth="1" opacity="0.4" />
              <circle cx="10" cy="10" r="2" fill={C.gold} opacity="0.6">
                <animate attributeName="cy" values="8;18;8" dur="2s" repeatCount="indefinite" />
              </circle>
            </svg>
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════
            PROJECTS SECTION (ALL 10)
           ═══════════════════════════════════════ */}
        <section className="relative py-24 sm:py-32 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <Reveal className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-16" style={{ background: `linear-gradient(90deg, transparent, ${C.goldMuted})` }} />
                <StarSVG size={14} />
                <span
                  style={{
                    fontFamily: "var(--font-instrument)",
                    fontSize: 12,
                    color: C.gold,
                    letterSpacing: 4,
                    textTransform: "uppercase",
                    opacity: 0.7,
                  }}
                >
                  The Major Arcana
                </span>
                <StarSVG size={14} />
                <div className="h-px w-16" style={{ background: `linear-gradient(90deg, ${C.goldMuted}, transparent)` }} />
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-instrument)",
                  fontStyle: "italic",
                  fontSize: "clamp(2rem, 4vw, 3.2rem)",
                  color: C.white,
                  letterSpacing: 1,
                }}
              >
                The Spread
              </h2>
              <p
                className="mt-3 max-w-md mx-auto"
                style={{ fontFamily: "var(--font-inter)", fontSize: 13, color: C.silver, opacity: 0.6, lineHeight: 1.7 }}
              >
                Each card reveals a creation &mdash; tap to read the full divination
              </p>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-8">
              {projects.map((project, i) => (
                <TarotProjectCard key={project.title} project={project} index={i} />
              ))}
            </div>
          </div>
        </section>

        <MysticDivider />

        {/* ═══════════════════════════════════════
            EXPERTISE SECTION (ALL 4)
           ═══════════════════════════════════════ */}
        <section className="relative py-24 sm:py-32 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <Reveal className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-4">
                <CrescentMoon size={16} />
                <span
                  style={{
                    fontFamily: "var(--font-instrument)",
                    fontSize: 12,
                    color: C.gold,
                    letterSpacing: 4,
                    textTransform: "uppercase",
                    opacity: 0.7,
                  }}
                >
                  The Court Cards
                </span>
                <CrescentMoon size={16} />
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-instrument)",
                  fontStyle: "italic",
                  fontSize: "clamp(2rem, 4vw, 3.2rem)",
                  color: C.white,
                  letterSpacing: 1,
                }}
              >
                Domains of Mastery
              </h2>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {expertise.map((item, i) => (
                <ExpertiseCard
                  key={item.title}
                  item={item}
                  arcana={EXPERTISE_ARCANA[i]}
                  index={i}
                />
              ))}
            </div>
          </div>
        </section>

        <MysticDivider />

        {/* ═══════════════════════════════════════
            TOOLS SECTION (ALL 6)
           ═══════════════════════════════════════ */}
        <section className="relative py-24 sm:py-32 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <Reveal className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-4">
                <PentacleSVG size={18} />
                <span
                  style={{
                    fontFamily: "var(--font-instrument)",
                    fontSize: 12,
                    color: C.gold,
                    letterSpacing: 4,
                    textTransform: "uppercase",
                    opacity: 0.7,
                  }}
                >
                  The Minor Arcana
                </span>
                <PentacleSVG size={18} />
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-instrument)",
                  fontStyle: "italic",
                  fontSize: "clamp(2rem, 4vw, 3.2rem)",
                  color: C.white,
                  letterSpacing: 1,
                }}
              >
                The Four Suits
              </h2>
              <p
                className="mt-3 max-w-md mx-auto"
                style={{ fontFamily: "var(--font-inter)", fontSize: 13, color: C.silver, opacity: 0.6, lineHeight: 1.7 }}
              >
                Tools of the craft, organized by elemental affinity
              </p>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {tools.map((tool, i) => (
                <ToolSuitCard key={tool.label} tool={tool} index={i} />
              ))}
            </div>
          </div>
        </section>

        <MysticDivider />

        {/* ═══════════════════════════════════════
            FOOTER
           ═══════════════════════════════════════ */}
        <footer className="relative py-24 sm:py-32 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <Reveal>
              <CardFan />
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-12 mb-6 flex justify-center">
                <CrystalBall size={70} />
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <h2
                style={{
                  fontFamily: "var(--font-instrument)",
                  fontStyle: "italic",
                  fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                  color: C.gold,
                  letterSpacing: 2,
                  textShadow: `0 0 30px rgba(212,175,55,0.2)`,
                }}
              >
                The Reading is Complete
              </h2>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="mt-4 flex items-center justify-center gap-3">
                <div className="h-px w-10" style={{ background: `linear-gradient(90deg, transparent, ${C.goldMuted})` }} />
                <CrescentMoon size={14} />
                <div className="h-px w-10" style={{ background: `linear-gradient(90deg, ${C.goldMuted}, transparent)` }} />
              </div>
            </Reveal>

            <Reveal delay={0.5}>
              <p
                className="mt-6"
                style={{
                  fontFamily: "var(--font-instrument)",
                  fontSize: 14,
                  color: C.silver,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  opacity: 0.5,
                }}
              >
                Mystic Grox Divination
              </p>
            </Reveal>

            <Reveal delay={0.6}>
              <div className="mt-8 flex items-center justify-center gap-6">
                <StarSVG size={8} />
                <span
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: 11,
                    color: C.silver,
                    opacity: 0.35,
                  }}
                >
                  The cards have spoken &mdash; the future belongs to those who build it
                </span>
                <StarSVG size={8} />
              </div>
            </Reveal>

            {/* Moon phase display */}
            <Reveal delay={0.7}>
              <div className="mt-10 flex items-center justify-center gap-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-full transition-all duration-500"
                    style={{
                      width: 10,
                      height: 10,
                      background: i === moonPhase ? C.gold : "transparent",
                      border: `1px solid ${i === moonPhase ? C.gold : C.goldMuted}`,
                      boxShadow: i === moonPhase ? `0 0 8px ${C.gold}40` : "none",
                      transform: i === moonPhase ? "scale(1.3)" : "scale(1)",
                    }}
                  />
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.8}>
              <p
                className="mt-4"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: 10,
                  color: C.silver,
                  opacity: 0.25,
                  letterSpacing: 1,
                }}
              >
                &copy; {new Date().getFullYear()} Grox
              </p>
            </Reveal>
          </div>
        </footer>

        {/* Theme Switcher */}
        <ThemeSwitcher current="/tarot" variant="dark" />
      </div>
    </>
  );
}
