"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";

/* ─── Color palette ─── */
const C = {
  sandstone: "#D4A574",
  lapis: "#2D6B8A",
  gold: "#DAA520",
  papyrus: "#F5E6C8",
  obsidian: "#1A1A2E",
  turquoise: "#40E0D0",
  terracotta: "#C75B39",
  bg: "#E8D5B7",
  cardBg: "#F0DFC4",
  darkBg: "#2A1F14",
  borderLight: "rgba(218,165,32,0.35)",
  borderStrong: "rgba(218,165,32,0.7)",
};

/* ─── SVG: Winged Sun Disc ─── */
function WingedSunDisc({ width = 600 }: { width?: number }) {
  return (
    <svg
      viewBox="0 0 600 120"
      width={width}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: "visible" }}
    >
      {/* Left wing */}
      <motion.g
        initial={{ scaleX: 0, originX: "50%" }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.4, ease: "easeOut", delay: 0.3 }}
      >
        {/* Outer feathers */}
        {[...Array(12)].map((_, i) => {
          const angle = -10 - i * 7;
          const x = 270 - i * 18;
          return (
            <motion.path
              key={`lf-${i}`}
              d={`M300,60 Q${x},${45 - i * 2} ${x - 20},${30 - i * 1.5}`}
              stroke={i % 2 === 0 ? C.gold : C.lapis}
              strokeWidth={2.2 - i * 0.1}
              opacity={0.8 - i * 0.04}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.4 + i * 0.06 }}
            />
          );
        })}
        {/* Inner feathers */}
        {[...Array(8)].map((_, i) => {
          const x = 280 - i * 22;
          return (
            <motion.path
              key={`lfi-${i}`}
              d={`M300,60 Q${x},${55 - i * 1} ${x - 15},${50}`}
              stroke={C.terracotta}
              strokeWidth={1.5}
              opacity={0.5}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.6 + i * 0.05 }}
            />
          );
        })}
      </motion.g>

      {/* Right wing (mirrored) */}
      <motion.g
        initial={{ scaleX: 0, originX: "50%" }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.4, ease: "easeOut", delay: 0.3 }}
      >
        {[...Array(12)].map((_, i) => {
          const x = 330 + i * 18;
          return (
            <motion.path
              key={`rf-${i}`}
              d={`M300,60 Q${x},${45 - i * 2} ${x + 20},${30 - i * 1.5}`}
              stroke={i % 2 === 0 ? C.gold : C.lapis}
              strokeWidth={2.2 - i * 0.1}
              opacity={0.8 - i * 0.04}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.4 + i * 0.06 }}
            />
          );
        })}
        {[...Array(8)].map((_, i) => {
          const x = 320 + i * 22;
          return (
            <motion.path
              key={`rfi-${i}`}
              d={`M300,60 Q${x},${55 - i * 1} ${x + 15},${50}`}
              stroke={C.terracotta}
              strokeWidth={1.5}
              opacity={0.5}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.6 + i * 0.05 }}
            />
          );
        })}
      </motion.g>

      {/* Center sun disc */}
      <motion.circle
        cx="300"
        cy="60"
        r="22"
        fill={C.gold}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1, type: "spring" }}
      />
      <motion.circle
        cx="300"
        cy="60"
        r="16"
        fill={C.terracotta}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
      />
      <motion.circle
        cx="300"
        cy="60"
        r="10"
        fill={C.gold}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3, type: "spring" }}
      />

      {/* Uraei (cobras) flanking the disc */}
      <motion.path
        d="M272,60 Q268,40 272,30 Q275,25 278,30 Q280,35 276,45 Q274,52 278,58"
        stroke={C.gold}
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
      />
      <motion.path
        d="M328,60 Q332,40 328,30 Q325,25 322,30 Q320,35 324,45 Q326,52 322,58"
        stroke={C.gold}
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
      />
    </svg>
  );
}

/* ─── SVG: Cartouche Oval Border ─── */
function CartoucheOval({
  children,
  className = "",
  width = 320,
  height = 100,
  animate: shouldAnimate = true,
}: {
  children: React.ReactNode;
  className?: string;
  width?: number;
  height?: number;
  animate?: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref} className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        fill="none"
        className="absolute inset-0 w-full h-full"
        style={{ overflow: "visible" }}
      >
        {/* Rope border effect */}
        <motion.rect
          x="8"
          y="8"
          width={width - 16}
          height={height - 16}
          rx={(height - 16) / 2}
          ry={(height - 16) / 2}
          stroke={C.gold}
          strokeWidth="3"
          initial={shouldAnimate ? { pathLength: 0 } : {}}
          animate={shouldAnimate && isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        <motion.rect
          x="4"
          y="4"
          width={width - 8}
          height={height - 8}
          rx={(height - 8) / 2}
          ry={(height - 8) / 2}
          stroke={C.gold}
          strokeWidth="1"
          opacity={0.5}
          initial={shouldAnimate ? { pathLength: 0 } : {}}
          animate={shouldAnimate && isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
        />
        {/* Vertical endcap lines (cartouche binding) */}
        <motion.line
          x1={width - 4}
          y1={height * 0.25}
          x2={width - 4}
          y2={height * 0.75}
          stroke={C.gold}
          strokeWidth="4"
          initial={shouldAnimate ? { pathLength: 0 } : {}}
          animate={shouldAnimate && isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 0.6, delay: 1.2 }}
        />
      </svg>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/* ─── SVG: Temple Column ─── */
function TempleColumn({ side, height = 500 }: { side: "left" | "right"; height?: number }) {
  const colW = 48;
  return (
    <motion.svg
      viewBox={`0 0 ${colW} ${height}`}
      width={colW}
      height={height}
      fill="none"
      className={`hidden lg:block absolute top-0 ${side === "left" ? "left-0" : "right-0"}`}
      initial={{ scaleY: 0, originY: "100%" }}
      animate={{ scaleY: 1 }}
      transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
    >
      {/* Capital (top) */}
      <rect x="4" y="0" width={colW - 8} height="8" fill={C.gold} rx="2" />
      <path d={`M0,14 L${colW / 2},2 L${colW},14`} fill={C.lapis} opacity="0.6" />
      {/* Lotus capital detail */}
      <path
        d={`M${colW / 2 - 10},14 Q${colW / 2},4 ${colW / 2 + 10},14`}
        stroke={C.gold}
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d={`M${colW / 2 - 6},14 Q${colW / 2},7 ${colW / 2 + 6},14`}
        stroke={C.terracotta}
        strokeWidth="1"
        fill="none"
      />
      {/* Shaft */}
      <rect x="10" y="14" width={colW - 20} height={height - 30} fill={C.sandstone} opacity="0.3" />
      {/* Fluting lines */}
      {[...Array(5)].map((_, i) => (
        <line
          key={i}
          x1={14 + i * 5}
          y1="18"
          x2={14 + i * 5}
          y2={height - 20}
          stroke={C.gold}
          strokeWidth="0.5"
          opacity={0.3}
        />
      ))}
      {/* Hieroglyphic decorations on shaft */}
      {[...Array(6)].map((_, i) => (
        <g key={`h-${i}`} opacity={0.25}>
          <text
            x={colW / 2}
            y={60 + i * 65}
            textAnchor="middle"
            fill={C.lapis}
            fontSize="14"
            fontFamily="serif"
          >
            {["☥", "𓂀", "☥", "𓃭", "☥", "𓆣"][i]}
          </text>
        </g>
      ))}
      {/* Base */}
      <rect x="6" y={height - 16} width={colW - 12} height="16" fill={C.sandstone} opacity="0.4" rx="2" />
      <rect x="2" y={height - 6} width={colW - 4} height="6" fill={C.gold} opacity="0.5" rx="1" />
    </motion.svg>
  );
}

/* ─── SVG: Eye of Horus ─── */
function EyeOfHorus({ size = 28 }: { size?: number }) {
  return (
    <svg viewBox="0 0 40 30" width={size} height={size * 0.75} fill="none">
      {/* Eye outline */}
      <path
        d="M5,15 Q12,5 20,5 Q28,5 35,15 Q28,25 20,25 Q12,25 5,15Z"
        stroke={C.lapis}
        strokeWidth="1.5"
        fill="none"
      />
      {/* Iris */}
      <circle cx="20" cy="15" r="5" fill={C.lapis} />
      <circle cx="20" cy="15" r="2.5" fill={C.gold} />
      {/* Decorative tearline */}
      <path d="M20,20 Q18,26 16,30" stroke={C.lapis} strokeWidth="1.5" fill="none" />
      {/* Eyebrow line */}
      <path d="M5,12 Q12,3 20,3 Q28,3 35,12" stroke={C.gold} strokeWidth="1" fill="none" />
      {/* Spiral tail */}
      <path d="M5,15 Q2,18 3,22 Q4,25 7,24" stroke={C.lapis} strokeWidth="1.2" fill="none" />
    </svg>
  );
}

/* ─── SVG: Ankh ─── */
function AnkhSymbol({ size = 24, color = C.gold }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 24 36" width={size} height={size * 1.5} fill="none">
      <ellipse cx="12" cy="8" rx="6" ry="7" stroke={color} strokeWidth="2" />
      <line x1="12" y1="15" x2="12" y2="34" stroke={color} strokeWidth="2" />
      <line x1="5" y1="22" x2="19" y2="22" stroke={color} strokeWidth="2" />
    </svg>
  );
}

/* ─── SVG: Scarab Beetle ─── */
function ScarabBeetle({ size = 50 }: { size?: number }) {
  return (
    <svg viewBox="0 0 60 50" width={size} height={size * 0.83} fill="none">
      {/* Body */}
      <ellipse cx="30" cy="28" rx="12" ry="16" fill={C.lapis} opacity="0.8" />
      {/* Head */}
      <circle cx="30" cy="10" r="7" fill={C.lapis} opacity="0.9" />
      {/* Center line */}
      <line x1="30" y1="12" x2="30" y2="42" stroke={C.gold} strokeWidth="1" />
      {/* Wing line */}
      <path d="M18,28 L30,16 L42,28" stroke={C.gold} strokeWidth="1" fill="none" />
      {/* Legs */}
      <path d="M20,22 L8,16" stroke={C.lapis} strokeWidth="1.5" />
      <path d="M40,22 L52,16" stroke={C.lapis} strokeWidth="1.5" />
      <path d="M19,30 L6,28" stroke={C.lapis} strokeWidth="1.5" />
      <path d="M41,30 L54,28" stroke={C.lapis} strokeWidth="1.5" />
      <path d="M20,36 L10,40" stroke={C.lapis} strokeWidth="1.5" />
      <path d="M40,36 L50,40" stroke={C.lapis} strokeWidth="1.5" />
      {/* Horns */}
      <path d="M25,6 Q22,0 26,2" stroke={C.gold} strokeWidth="1.2" />
      <path d="M35,6 Q38,0 34,2" stroke={C.gold} strokeWidth="1.2" />
      {/* Sun disc held by scarab */}
      <circle cx="30" cy="3" r="4" fill={C.gold} opacity="0.6" />
    </svg>
  );
}

/* ─── SVG: Lotus Flower ─── */
function LotusFlower({ size = 30 }: { size?: number }) {
  return (
    <svg viewBox="0 0 40 30" width={size} height={size * 0.75} fill="none">
      {/* Center petal */}
      <path d="M20,28 Q20,10 20,2" stroke={C.lapis} strokeWidth="1" />
      <path d="M20,28 Q16,14 14,4 Q18,10 20,2 Q22,10 26,4 Q24,14 20,28Z" fill={C.lapis} opacity="0.5" />
      {/* Side petals */}
      <path d="M20,28 Q10,16 4,8 Q12,14 20,12 Q14,18 20,28Z" fill={C.turquoise} opacity="0.3" />
      <path d="M20,28 Q30,16 36,8 Q28,14 20,12 Q26,18 20,28Z" fill={C.turquoise} opacity="0.3" />
      {/* Outer petals */}
      <path d="M20,28 Q6,20 2,14" stroke={C.gold} strokeWidth="0.8" opacity="0.6" />
      <path d="M20,28 Q34,20 38,14" stroke={C.gold} strokeWidth="0.8" opacity="0.6" />
    </svg>
  );
}

/* ─── Hieroglyphic Border Pattern ─── */
function HieroBorder() {
  const symbols = ["☥", "𓂀", "𓃭", "𓆣", "☥", "𓁹", "☥", "𓃠", "☥", "𓆓"];
  return (
    <div className="flex items-center justify-center gap-3 py-6 overflow-hidden">
      <div className="h-[1px] flex-1 max-w-[100px]" style={{ background: `linear-gradient(90deg, transparent, ${C.borderStrong})` }} />
      {symbols.map((s, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 0.4, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06 }}
          style={{ color: i % 2 === 0 ? C.gold : C.lapis, fontFamily: "serif" }}
          className="text-sm select-none"
        >
          {s}
        </motion.span>
      ))}
      <div className="h-[1px] flex-1 max-w-[100px]" style={{ background: `linear-gradient(90deg, ${C.borderStrong}, transparent)` }} />
    </div>
  );
}

/* ─── Scroll Reveal Wrapper ─── */
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
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Pharaoh Seal SVG (footer) ─── */
function PharaohSeal({ size = 80 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} fill="none">
      {/* Outer ring */}
      <circle cx="50" cy="50" r="46" stroke={C.gold} strokeWidth="2" />
      <circle cx="50" cy="50" r="42" stroke={C.gold} strokeWidth="0.5" opacity="0.5" />
      {/* Inner ankh */}
      <ellipse cx="50" cy="35" rx="10" ry="12" stroke={C.gold} strokeWidth="2" />
      <line x1="50" y1="47" x2="50" y2="78" stroke={C.gold} strokeWidth="2" />
      <line x1="38" y1="60" x2="62" y2="60" stroke={C.gold} strokeWidth="2" />
      {/* Decorative dots around the ring */}
      {[...Array(16)].map((_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        return (
          <circle
            key={i}
            cx={50 + 44 * Math.cos(angle)}
            cy={50 + 44 * Math.sin(angle)}
            r="1.5"
            fill={C.gold}
            opacity={0.6}
          />
        );
      })}
    </svg>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MAIN PAGE COMPONENT
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function CartouchePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => setIsLoaded(true), []);

  return (
    <>
      <style jsx global>{`
        @keyframes goldShimmer {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.3); }
        }
        @keyframes hieroglyphFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes papyrusGrain {
          0% { background-position: 0 0; }
          100% { background-position: 200px 200px; }
        }
        @keyframes sandDrift {
          0% { opacity: 0.03; transform: translateX(0); }
          50% { opacity: 0.06; transform: translateX(20px); }
          100% { opacity: 0.03; transform: translateX(0); }
        }
        @keyframes scarabSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes cartoucheGlow {
          0%, 100% { box-shadow: 0 0 8px rgba(218,165,32,0.1); }
          50% { box-shadow: 0 0 20px rgba(218,165,32,0.25); }
        }
        .papyrus-texture {
          background-image:
            radial-gradient(ellipse at 20% 50%, rgba(210,170,120,0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 50%, rgba(210,170,120,0.1) 0%, transparent 50%),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 3px,
              rgba(160,120,60,0.04) 3px,
              rgba(160,120,60,0.04) 4px
            ),
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 5px,
              rgba(160,120,60,0.03) 5px,
              rgba(160,120,60,0.03) 6px
            );
        }
        .stone-card {
          background: linear-gradient(
            145deg,
            ${C.cardBg} 0%,
            ${C.papyrus} 30%,
            ${C.sandstone}22 70%,
            ${C.cardBg} 100%
          );
          border: 1px solid ${C.borderLight};
        }
        .chisel-text {
          text-shadow:
            1px 1px 0px rgba(255,255,255,0.4),
            -1px -1px 0px rgba(0,0,0,0.15);
        }
        .gold-shimmer {
          animation: goldShimmer 3s ease-in-out infinite;
        }
        .cartouche-glow {
          animation: cartoucheGlow 4s ease-in-out infinite;
        }
      `}</style>

      <div
        className="min-h-screen papyrus-texture"
        style={{
          backgroundColor: C.bg,
          color: C.obsidian,
          fontFamily: "var(--font-inter)",
        }}
      >
        {/* ═══════════════ HERO SECTION ═══════════════ */}
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4">
          {/* Temple columns framing */}
          <TempleColumn side="left" height={700} />
          <TempleColumn side="right" height={700} />

          {/* Background hieroglyphic pattern */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.04]">
            {[...Array(40)].map((_, i) => (
              <span
                key={i}
                className="absolute text-2xl select-none"
                style={{
                  left: `${(i % 8) * 13 + 2}%`,
                  top: `${Math.floor(i / 8) * 20 + 5}%`,
                  color: C.obsidian,
                  fontFamily: "serif",
                  animation: `hieroglyphFloat ${3 + (i % 3)}s ease-in-out ${i * 0.2}s infinite`,
                }}
              >
                {["☥", "𓂀", "𓃭", "𓆣", "𓁹", "𓃠", "𓆓", "𓇳"][i % 8]}
              </span>
            ))}
          </div>

          {/* Winged sun disc */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-6"
          >
            <WingedSunDisc width={Math.min(550, 500)} />
          </motion.div>

          {/* Subtitle above cartouche */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-sm tracking-[0.4em] uppercase mb-8"
            style={{ color: C.lapis, fontFamily: "var(--font-space-grotesk)" }}
          >
            AI Product Studio
          </motion.p>

          {/* Main cartouche with GROX */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5, type: "spring", stiffness: 80 }}
            className="cartouche-glow rounded-full"
          >
            <CartoucheOval width={380} height={120} animate={true}>
              <div className="flex items-center gap-4 px-8">
                <AnkhSymbol size={28} color={C.gold} />
                <h1
                  className="text-6xl md:text-7xl tracking-[0.2em] gold-shimmer"
                  style={{
                    fontFamily: "var(--font-dm-serif)",
                    color: C.obsidian,
                    textShadow: `2px 2px 0px ${C.gold}40`,
                  }}
                >
                  GROX
                </h1>
                <AnkhSymbol size={28} color={C.gold} />
              </div>
            </CartoucheOval>
          </motion.div>

          {/* Descriptive text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 0.7, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-10 text-center max-w-lg leading-relaxed"
            style={{ fontFamily: "var(--font-playfair)", color: C.obsidian }}
          >
            Crafting AI-powered products with the precision of ancient builders
            and the vision of modern engineers.
          </motion.p>

          {/* Stats as offering counts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="flex gap-10 md:gap-16 mt-12"
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div
                  className="text-3xl md:text-4xl font-bold chisel-text"
                  style={{ fontFamily: "var(--font-dm-serif)", color: C.lapis }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-xs tracking-[0.3em] uppercase mt-1 opacity-60"
                  style={{ fontFamily: "var(--font-jetbrains)" }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 0.5 } : {}}
            transition={{ delay: 2 }}
            className="absolute bottom-10"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-xs tracking-[0.3em] uppercase" style={{ fontFamily: "var(--font-jetbrains)", color: C.lapis }}>
                Descend
              </span>
              <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
                <path d="M8,0 L8,20 M2,14 L8,20 L14,14" stroke={C.lapis} strokeWidth="1.5" />
              </svg>
            </motion.div>
          </motion.div>
        </section>

        <HieroBorder />

        {/* ═══════════════ PROJECTS SECTION ═══════════════ */}
        <section className="py-24 px-4 max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-4">
                <EyeOfHorus size={32} />
                <h2
                  className="text-4xl md:text-5xl chisel-text"
                  style={{ fontFamily: "var(--font-playfair)", color: C.obsidian }}
                >
                  Sacred Works
                </h2>
                <EyeOfHorus size={32} />
              </div>
              <p className="text-sm tracking-[0.3em] uppercase opacity-50" style={{ fontFamily: "var(--font-jetbrains)" }}>
                Inscriptions of AI Mastery
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <motion.div
                  className="stone-card rounded-2xl p-6 relative overflow-hidden group"
                  whileHover={{ y: -4, boxShadow: `0 8px 30px ${C.gold}25` }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Cartouche title header */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="mt-1 shrink-0 gold-shimmer">
                      {i % 2 === 0 ? (
                        <AnkhSymbol size={18} color={C.gold} />
                      ) : (
                        <EyeOfHorus size={22} />
                      )}
                    </div>
                    <div className="flex-1">
                      <CartoucheOval width={260} height={52} animate={true} className="mb-2">
                        <h3
                          className="text-lg px-4 whitespace-nowrap chisel-text"
                          style={{
                            fontFamily: "var(--font-dm-serif)",
                            color: C.obsidian,
                          }}
                        >
                          {project.title.replace("\n", " ")}
                        </h3>
                      </CartoucheOval>
                      <div className="flex items-center gap-3 mt-2">
                        <span
                          className="text-xs tracking-wider uppercase opacity-60"
                          style={{ fontFamily: "var(--font-jetbrains)" }}
                        >
                          {project.client}
                        </span>
                        <span style={{ color: C.gold }}>|</span>
                        <span
                          className="text-xs opacity-50"
                          style={{ fontFamily: "var(--font-jetbrains)" }}
                        >
                          {project.year}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p
                    className="text-sm leading-relaxed mb-3 opacity-75"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {project.description}
                  </p>

                  {/* Technical detail */}
                  <p
                    className="text-xs leading-relaxed mb-4 opacity-50 italic"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {project.technical}
                  </p>

                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.tech.map((t, j) => (
                      <span
                        key={j}
                        className="text-xs px-3 py-1 rounded-full"
                        style={{
                          fontFamily: "var(--font-jetbrains)",
                          backgroundColor: `${C.lapis}15`,
                          color: C.lapis,
                          border: `1px solid ${C.lapis}30`,
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
                      className="inline-flex items-center gap-2 text-xs opacity-50 hover:opacity-80 transition-opacity"
                      style={{ fontFamily: "var(--font-jetbrains)", color: C.lapis }}
                    >
                      <span>&#x2192;</span>
                      <span>View Scroll</span>
                    </a>
                  )}

                  {/* Corner hieroglyphic accents */}
                  <div className="absolute top-2 right-3 text-sm opacity-10 select-none" style={{ color: C.gold }}>
                    {["☥", "𓂀", "𓃭", "𓆣", "𓁹", "𓃠", "𓆓", "𓇳", "☥", "𓂀"][i]}
                  </div>
                  <div className="absolute bottom-2 left-3 text-sm opacity-10 select-none" style={{ color: C.gold }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  {/* Decorative bottom border */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-[2px]"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${C.gold}50, ${C.lapis}30, ${C.gold}50, transparent)`,
                    }}
                  />
                </motion.div>
              </Reveal>
            ))}
          </div>
        </section>

        <HieroBorder />

        {/* ═══════════════ EXPERTISE SECTION ═══════════════ */}
        <section className="py-24 px-4 max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-4">
                <LotusFlower size={28} />
                <h2
                  className="text-4xl md:text-5xl chisel-text"
                  style={{ fontFamily: "var(--font-playfair)", color: C.obsidian }}
                >
                  Four Pillars of Wisdom
                </h2>
                <LotusFlower size={28} />
              </div>
              <p className="text-sm tracking-[0.3em] uppercase opacity-50" style={{ fontFamily: "var(--font-jetbrains)" }}>
                The Foundation of the Temple
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {expertise.map((item, i) => (
              <Reveal key={i} delay={i * 0.12}>
                <motion.div
                  className="relative flex flex-col items-center text-center"
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Column SVG */}
                  <motion.svg
                    viewBox="0 0 80 280"
                    width={80}
                    height={280}
                    fill="none"
                    className="mb-4"
                    initial={{ scaleY: 0, originY: "100%" }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: i * 0.15, ease: "easeOut" }}
                  >
                    {/* Capital with papyrus/lotus top */}
                    <rect x="10" y="0" width="60" height="10" fill={C.gold} rx="3" />
                    <path d="M5,16 L40,2 L75,16" fill={C.lapis} opacity="0.4" />
                    <path d="M25,16 Q40,4 55,16" stroke={C.gold} strokeWidth="1.5" fill="none" />
                    <path d="M30,16 Q40,6 50,16" stroke={C.terracotta} strokeWidth="1" fill="none" />

                    {/* Shaft */}
                    <rect x="18" y="16" width="44" height="240" fill={C.sandstone} opacity="0.2" />

                    {/* Fluting */}
                    {[...Array(7)].map((_, j) => (
                      <line
                        key={j}
                        x1={22 + j * 6}
                        y1="20"
                        x2={22 + j * 6}
                        y2="252"
                        stroke={C.gold}
                        strokeWidth="0.4"
                        opacity={0.25}
                      />
                    ))}

                    {/* Hieroglyphic decoration */}
                    <text
                      x="40"
                      y="80"
                      textAnchor="middle"
                      fill={C.lapis}
                      fontSize="18"
                      opacity="0.3"
                    >
                      ☥
                    </text>
                    <text
                      x="40"
                      y="140"
                      textAnchor="middle"
                      fill={C.gold}
                      fontSize="14"
                      opacity="0.25"
                    >
                      {["𓂀", "𓃭", "𓆣", "𓁹"][i]}
                    </text>
                    <text
                      x="40"
                      y="200"
                      textAnchor="middle"
                      fill={C.lapis}
                      fontSize="18"
                      opacity="0.3"
                    >
                      ☥
                    </text>

                    {/* Base */}
                    <rect x="12" y="256" width="56" height="10" fill={C.sandstone} opacity="0.35" rx="2" />
                    <rect x="6" y="266" width="68" height="14" fill={C.gold} opacity="0.3" rx="3" />
                  </motion.svg>

                  {/* Expertise inscription */}
                  <CartoucheOval width={200} height={44} animate={true}>
                    <h3
                      className="text-sm px-3 chisel-text whitespace-nowrap"
                      style={{
                        fontFamily: "var(--font-dm-serif)",
                        color: C.obsidian,
                      }}
                    >
                      {item.title}
                    </h3>
                  </CartoucheOval>

                  <p
                    className="text-xs leading-relaxed mt-4 opacity-60 max-w-[220px]"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {item.body}
                  </p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </section>

        <HieroBorder />

        {/* ═══════════════ TOOLS SECTION ═══════════════ */}
        <section className="py-24 px-4 max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-4">
                <ScarabBeetle size={36} />
                <h2
                  className="text-4xl md:text-5xl chisel-text"
                  style={{ fontFamily: "var(--font-playfair)", color: C.obsidian }}
                >
                  Wall of Glyphs
                </h2>
                <ScarabBeetle size={36} />
              </div>
              <p className="text-sm tracking-[0.3em] uppercase opacity-50" style={{ fontFamily: "var(--font-jetbrains)" }}>
                Tools of the Master Builder
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((category, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <motion.div
                  className="stone-card rounded-xl p-6 relative overflow-hidden"
                  whileHover={{
                    boxShadow: `0 4px 24px ${C.gold}20`,
                    borderColor: C.gold,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Stone panel header with hieroglyphic accent */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-8 h-8 rounded flex items-center justify-center text-sm"
                      style={{
                        backgroundColor: `${C.lapis}15`,
                        border: `1px solid ${C.lapis}30`,
                        color: C.lapis,
                      }}
                    >
                      {["𓂀", "𓃭", "𓆣", "𓁹", "𓃠", "𓆓"][i]}
                    </div>
                    <h3
                      className="text-lg chisel-text"
                      style={{
                        fontFamily: "var(--font-dm-serif)",
                        color: C.obsidian,
                      }}
                    >
                      {category.label}
                    </h3>
                  </div>

                  {/* Tool items as hieroglyphic tiles */}
                  <div className="grid grid-cols-2 gap-2">
                    {category.items.map((item, j) => (
                      <motion.div
                        key={j}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg"
                        style={{
                          backgroundColor: `${C.papyrus}80`,
                          border: `1px solid ${C.borderLight}`,
                        }}
                        whileHover={{
                          backgroundColor: `${C.gold}15`,
                          borderColor: C.gold,
                        }}
                      >
                        <span
                          className="text-xs gold-shimmer"
                          style={{ color: C.gold }}
                        >
                          ☥
                        </span>
                        <span
                          className="text-xs"
                          style={{
                            fontFamily: "var(--font-jetbrains)",
                            color: C.obsidian,
                            opacity: 0.8,
                          }}
                        >
                          {item}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Decorative corner marks */}
                  <svg className="absolute top-0 left-0 w-5 h-5 pointer-events-none" viewBox="0 0 20 20" fill="none">
                    <path d="M0,0 L20,0 L0,0 L0,20" stroke={C.gold} strokeWidth="1.5" opacity="0.4" />
                  </svg>
                  <svg className="absolute top-0 right-0 w-5 h-5 pointer-events-none" viewBox="0 0 20 20" fill="none">
                    <path d="M20,0 L0,0 M20,0 L20,20" stroke={C.gold} strokeWidth="1.5" opacity="0.4" />
                  </svg>
                  <svg className="absolute bottom-0 left-0 w-5 h-5 pointer-events-none" viewBox="0 0 20 20" fill="none">
                    <path d="M0,20 L20,20 M0,20 L0,0" stroke={C.gold} strokeWidth="1.5" opacity="0.4" />
                  </svg>
                  <svg className="absolute bottom-0 right-0 w-5 h-5 pointer-events-none" viewBox="0 0 20 20" fill="none">
                    <path d="M20,20 L0,20 M20,20 L20,0" stroke={C.gold} strokeWidth="1.5" opacity="0.4" />
                  </svg>

                  {/* Subtle stone texture overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none rounded-xl opacity-[0.03]"
                    style={{
                      backgroundImage: `repeating-linear-gradient(
                        45deg,
                        ${C.obsidian},
                        ${C.obsidian} 1px,
                        transparent 1px,
                        transparent 8px
                      )`,
                    }}
                  />
                </motion.div>
              </Reveal>
            ))}
          </div>
        </section>

        <HieroBorder />

        {/* ═══════════════ FOOTER ═══════════════ */}
        <footer className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Lotus flower border */}
            <Reveal>
              <div className="flex items-center justify-center gap-4 mb-10">
                {[...Array(7)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 0.5, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, type: "spring" }}
                  >
                    <LotusFlower size={i === 3 ? 36 : 24} />
                  </motion.div>
                ))}
              </div>
            </Reveal>

            {/* Pharaoh's Seal */}
            <Reveal delay={0.1}>
              <div className="flex justify-center mb-8">
                <motion.div
                  whileHover={{ rotate: 15 }}
                  transition={{ duration: 0.5 }}
                >
                  <PharaohSeal size={90} />
                </motion.div>
              </div>
            </Reveal>

            {/* Scarab */}
            <Reveal delay={0.2}>
              <div className="flex justify-center mb-6">
                <ScarabBeetle size={44} />
              </div>
            </Reveal>

            {/* Cartouche seal name */}
            <Reveal delay={0.3}>
              <CartoucheOval width={200} height={50} animate={true}>
                <span
                  className="text-xl px-4 chisel-text"
                  style={{
                    fontFamily: "var(--font-dm-serif)",
                    color: C.obsidian,
                  }}
                >
                  ☥ GROX ☥
                </span>
              </CartoucheOval>
            </Reveal>

            {/* Inscription text */}
            <Reveal delay={0.4}>
              <p
                className="mt-8 text-sm tracking-[0.3em] uppercase opacity-40"
                style={{ fontFamily: "var(--font-jetbrains)" }}
              >
                Inscribed in the Year 2025
              </p>
            </Reveal>

            <Reveal delay={0.5}>
              <p
                className="mt-3 text-xs opacity-30 italic"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                May these works endure as the pyramids endure,
                <br />
                and may they be found worthy by those who seek wisdom.
              </p>
            </Reveal>

            {/* Bottom lotus border */}
            <Reveal delay={0.6}>
              <div className="flex items-center justify-center gap-2 mt-12">
                <div
                  className="h-[1px] flex-1 max-w-[120px]"
                  style={{ background: `linear-gradient(90deg, transparent, ${C.borderStrong})` }}
                />
                <LotusFlower size={20} />
                <AnkhSymbol size={16} color={C.gold} />
                <LotusFlower size={20} />
                <div
                  className="h-[1px] flex-1 max-w-[120px]"
                  style={{ background: `linear-gradient(90deg, ${C.borderStrong}, transparent)` }}
                />
              </div>
            </Reveal>

            {/* Decorative hieroglyphic footer strip */}
            <Reveal delay={0.7}>
              <div className="flex justify-center gap-4 mt-8">
                {["☥", "𓂀", "𓃭", "𓆣", "☥", "𓁹", "𓃠", "𓆓", "☥"].map((s, i) => (
                  <motion.span
                    key={i}
                    className="text-lg select-none"
                    style={{ color: i % 2 === 0 ? C.gold : C.lapis, opacity: 0.15 }}
                    animate={{ y: [0, -4, 0] }}
                    transition={{
                      duration: 2 + i * 0.3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.15,
                    }}
                  >
                    {s}
                  </motion.span>
                ))}
              </div>
            </Reveal>
          </div>
        </footer>

        {/* ─── Theme Switcher ─── */}
        <ThemeSwitcher current="/cartouche" variant="dark" />
      </div>
    </>
  );
}
