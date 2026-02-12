"use client";

import { motion, useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";

/* ─── Palette ─── */
const C = {
  bg: "#1A2F23", bgDeep: "#0F1D15", parchment: "#F5E6C8", brass: "#C8A96E",
  amber: "#D4883A", red: "#8B2500", cream: "#FFF8F0", green: "#2A4A34",
  greenLight: "#3A6A48", wood: "#3D2B1F", woodLight: "#5C3D2E",
};
const ease = [0.22, 1, 0.36, 1] as const;
const liquidColors = [
  "#7BAE7F","#D4883A","#8B2500","#3B7DD8","#C8A96E",
  "#9B59B6","#2E8B57","#CD853F","#B8860B","#6B8E23",
];
const expertiseColors = ["#7BAE7F", "#D4883A", "#3B7DD8", "#9B59B6"];

/* ─── Reveal ─── */
function Reveal({ children, className = "", delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease, delay }}
    >{children}</motion.div>
  );
}

/* ─── SVG: Victorian Corner Ornament ─── */
function VictorianCorner({ flip = false, flipY = false, color = C.brass, size = 60 }: {
  flip?: boolean; flipY?: boolean; color?: string; size?: number;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none"
      style={{ transform: `scaleX(${flip ? -1 : 1}) scaleY(${flipY ? -1 : 1})` }}>
      <path d="M5 55 C5 30 10 15 25 10 C30 8 40 5 55 5" stroke={color} strokeWidth="1.5" fill="none" />
      <path d="M8 55 C8 35 12 20 25 15 C30 13 38 10 55 8" stroke={color} strokeWidth="0.5" opacity={0.5} fill="none" />
      <circle cx="55" cy="5" r="2" fill={color} opacity={0.7} />
      <circle cx="5" cy="55" r="2" fill={color} opacity={0.7} />
      <path d="M20 35 Q25 28 30 30 Q25 32 22 38Z" fill={color} opacity={0.25} />
    </svg>
  );
}

/* ─── SVG: Apothecary Jar ─── */
function ApothecaryJar({ liquidColor = "#7BAE7F", fillPercent = 0.6, size = 100, label = "" }: {
  liquidColor?: string; fillPercent?: number; size?: number; label?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const id = useRef(`jar-${Math.random().toString(36).slice(2, 8)}`).current;
  return (
    <div ref={ref} style={{ width: size, height: size * 1.4 }}>
      <svg width={size} height={size * 1.4} viewBox="0 0 100 140" fill="none">
        <defs>
          <clipPath id={`${id}-c`}>
            <path d="M30 15 L30 25 C15 35 10 55 10 80 C10 100 20 120 50 120 C80 120 90 100 90 80 C90 55 85 35 70 25 L70 15Z" />
          </clipPath>
          <linearGradient id={`${id}-l`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={liquidColor} stopOpacity={0.9} />
            <stop offset="100%" stopColor={liquidColor} stopOpacity={0.5} />
          </linearGradient>
          <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="white" stopOpacity={0.15} />
            <stop offset="50%" stopColor="white" stopOpacity={0.02} />
            <stop offset="100%" stopColor="white" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <path d="M30 15 L30 25 C15 35 10 55 10 80 C10 100 20 120 50 120 C80 120 90 100 90 80 C90 55 85 35 70 25 L70 15Z"
          fill={C.bgDeep} stroke={C.brass} strokeWidth="1.2" opacity={0.9} />
        <motion.rect clipPath={`url(#${id}-c)`} x="0" width="100" height={120 * fillPercent}
          fill={`url(#${id}-l)`} initial={{ y: 140 }}
          animate={inView ? { y: 120 - 120 * fillPercent } : { y: 140 }}
          transition={{ duration: 1.8, ease, delay: 0.3 }} />
        <path d="M30 15 L30 25 C15 35 10 55 10 80 C10 100 20 120 50 120 C80 120 90 100 90 80 C90 55 85 35 70 25 L70 15Z"
          fill={`url(#${id}-g)`} />
        <path d="M25 35 C22 50 22 70 28 95" stroke="white" strokeWidth="1.5" opacity={0.12} strokeLinecap="round" />
        <rect x="32" y="5" width="36" height="12" rx="2" fill={C.wood} stroke={C.brass} strokeWidth="0.8" />
        <rect x="35" y="0" width="30" height="7" rx="3" fill={C.woodLight} stroke={C.brass} strokeWidth="0.6" />
        {label && (<g>
          <rect x="25" y="65" width="50" height="28" rx="2" fill={C.cream} opacity={0.9} />
          <rect x="25" y="65" width="50" height="28" rx="2" fill="none" stroke={C.brass} strokeWidth="0.5" />
          <text x="50" y="82" textAnchor="middle" fontSize="7" fill={C.bgDeep}
            fontFamily="var(--font-instrument)">{label.length > 10 ? label.slice(0, 10) + "..." : label}</text>
        </g>)}
        <motion.ellipse clipPath={`url(#${id}-c)`} cx="50" rx="30" ry="3" fill="white" opacity={0.1}
          initial={{ cy: 140 }} animate={inView ? { cy: 120 - 120 * fillPercent + 2 } : { cy: 140 }}
          transition={{ duration: 1.8, ease, delay: 0.3 }} />
      </svg>
    </div>
  );
}

/* ─── SVG: Tall Bottle ─── */
function TallBottle({ liquidColor = "#D4883A", fillPercent = 0.5, size = 80 }: {
  liquidColor?: string; fillPercent?: number; size?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const id = useRef(`btl-${Math.random().toString(36).slice(2, 8)}`).current;
  return (
    <div ref={ref} style={{ width: size, height: size * 2 }}>
      <svg width={size} height={size * 2} viewBox="0 0 60 120" fill="none">
        <defs>
          <clipPath id={`${id}-c`}>
            <path d="M22 20 L22 30 C12 38 8 50 8 70 C8 90 15 105 30 105 C45 105 52 90 52 70 C52 50 48 38 38 30 L38 20Z" />
          </clipPath>
          <linearGradient id={`${id}-l`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={liquidColor} stopOpacity={0.85} />
            <stop offset="100%" stopColor={liquidColor} stopOpacity={0.4} />
          </linearGradient>
        </defs>
        <path d="M22 20 L22 30 C12 38 8 50 8 70 C8 90 15 105 30 105 C45 105 52 90 52 70 C52 50 48 38 38 30 L38 20Z"
          fill={C.bgDeep} stroke={C.brass} strokeWidth="1" opacity={0.85} />
        <motion.rect clipPath={`url(#${id}-c)`} x="0" width="60" height={90 * fillPercent}
          fill={`url(#${id}-l)`} initial={{ y: 120 }}
          animate={inView ? { y: 105 - 90 * fillPercent } : { y: 120 }}
          transition={{ duration: 1.6, ease, delay: 0.4 }} />
        <path d="M18 40 C16 55 17 75 22 92" stroke="white" strokeWidth="1" opacity={0.1} strokeLinecap="round" />
        <rect x="24" y="10" width="12" height="12" rx="1" fill={C.wood} stroke={C.brass} strokeWidth="0.6" />
        <rect x="26" y="5" width="8" height="7" rx="3" fill={C.woodLight} stroke={C.brass} strokeWidth="0.5" />
      </svg>
    </div>
  );
}

/* ─── SVG: Mortar and Pestle ─── */
function MortarAndPestle({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <path d="M20 50 C20 50 15 85 25 100 C35 112 85 112 95 100 C105 85 100 50 100 50"
        fill={C.green} stroke={C.brass} strokeWidth="1.5" />
      <ellipse cx="60" cy="50" rx="42" ry="12" fill={C.greenLight} stroke={C.brass} strokeWidth="1.2" />
      <ellipse cx="60" cy="50" rx="35" ry="8" fill={C.bgDeep} opacity={0.5} />
      <motion.g animate={{ rotate: [0, -15, 0, 15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "60px 50px" }}>
        <rect x="56" y="10" width="8" height="50" rx="4" fill={C.parchment} stroke={C.brass} strokeWidth="1" />
        <ellipse cx="60" cy="58" rx="7" ry="5" fill={C.parchment} stroke={C.brass} strokeWidth="0.8" />
        <circle cx="60" cy="12" r="5" fill={C.woodLight} stroke={C.brass} strokeWidth="0.8" />
      </motion.g>
      <circle cx="50" cy="48" r="1.5" fill="#5C8A5E" opacity={0.7} />
      <circle cx="65" cy="47" r="1" fill="#5C8A5E" opacity={0.5} />
    </svg>
  );
}

/* ─── SVG: Victorian Flourish Divider ─── */
function VictorianDivider({ width = 300 }: { width?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });
  return (
    <div ref={ref} className="flex justify-center">
      <svg width={width} height="30" viewBox="0 0 300 30" fill="none">
        <motion.path d="M10 15 L130 15" stroke={C.brass} strokeWidth="0.8"
          initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ duration: 1.2, ease }} />
        <motion.path d="M170 15 L290 15" stroke={C.brass} strokeWidth="0.8"
          initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ duration: 1.2, ease }} />
        <motion.g initial={{ scale: 0, opacity: 0 }} animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6, ease }}>
          <circle cx="150" cy="15" r="4" fill={C.brass} opacity={0.8} />
          <circle cx="150" cy="15" r="7" fill="none" stroke={C.brass} strokeWidth="0.5" opacity={0.5} />
          <path d="M138 15 L142 12 L142 18Z" fill={C.brass} opacity={0.5} />
          <path d="M162 15 L158 12 L158 18Z" fill={C.brass} opacity={0.5} />
        </motion.g>
        <circle cx="125" cy="15" r="1.5" fill={C.brass} opacity={0.4} />
        <circle cx="175" cy="15" r="1.5" fill={C.brass} opacity={0.4} />
      </svg>
    </div>
  );
}

/* ─── SVG: Botanical Sketch ─── */
function BotanicalSketch({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" opacity={0.2}>
      <path d="M40 75 C40 60 38 45 40 30" stroke={C.brass} strokeWidth="0.8" />
      <path d="M40 55 C30 48 25 40 30 35 C35 30 40 38 40 48" stroke={C.brass} strokeWidth="0.6" fill="none" />
      <path d="M40 45 C50 38 55 30 50 25 C45 20 40 28 40 38" stroke={C.brass} strokeWidth="0.6" fill="none" />
      <circle cx="40" cy="25" r="6" stroke={C.brass} strokeWidth="0.6" fill="none" />
      <circle cx="40" cy="25" r="2" fill={C.brass} opacity={0.3} />
    </svg>
  );
}

/* ─── SVG: Poison Skull ─── */
function PoisonSkull({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" opacity={0.3}>
      <circle cx="12" cy="10" r="7" stroke={C.red} strokeWidth="0.8" />
      <circle cx="9" cy="9" r="2" fill={C.red} opacity={0.6} />
      <circle cx="15" cy="9" r="2" fill={C.red} opacity={0.6} />
      <path d="M10 14 L12 16 L14 14" stroke={C.red} strokeWidth="0.6" />
      <path d="M9 18 L12 22 L15 18" stroke={C.red} strokeWidth="0.6" fill="none" />
    </svg>
  );
}

/* ─── SVG: Wide Apothecary Jar ─── */
function WideJar({ liquidColor = "#7BAE7F", fillPercent = 0.5, size = 80 }: {
  liquidColor?: string; fillPercent?: number; size?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const id = useRef(`wj-${Math.random().toString(36).slice(2, 8)}`).current;
  return (
    <div ref={ref} style={{ width: size, height: size * 1.2 }}>
      <svg width={size} height={size * 1.2} viewBox="0 0 80 96" fill="none">
        <defs>
          <clipPath id={`${id}-c`}>
            <path d="M28 18 L28 24 C10 30 5 42 5 58 C5 74 15 84 40 84 C65 84 75 74 75 58 C75 42 70 30 52 24 L52 18Z" />
          </clipPath>
          <linearGradient id={`${id}-l`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={liquidColor} stopOpacity={0.85} />
            <stop offset="100%" stopColor={liquidColor} stopOpacity={0.45} />
          </linearGradient>
        </defs>
        <path d="M28 18 L28 24 C10 30 5 42 5 58 C5 74 15 84 40 84 C65 84 75 74 75 58 C75 42 70 30 52 24 L52 18Z"
          fill={C.bgDeep} stroke={C.brass} strokeWidth="1" opacity={0.85} />
        <motion.rect clipPath={`url(#${id}-c)`} x="0" width="80" height={70 * fillPercent}
          fill={`url(#${id}-l)`} initial={{ y: 96 }}
          animate={inView ? { y: 84 - 70 * fillPercent } : { y: 96 }}
          transition={{ duration: 1.5, ease, delay: 0.3 }} />
        <path d="M20 36 C18 48 19 62 24 76" stroke="white" strokeWidth="1" opacity={0.1} strokeLinecap="round" />
        <rect x="30" y="8" width="20" height="12" rx="2" fill={C.wood} stroke={C.brass} strokeWidth="0.6" />
        <ellipse cx="40" cy="7" rx="12" ry="4" fill={C.woodLight} stroke={C.brass} strokeWidth="0.5" />
      </svg>
    </div>
  );
}

/* ─── SVG: Ornamental Border Frame ─── */
function OrnamentalFrame({ children, className = "" }: {
  children: React.ReactNode; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Animated border */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 400 200">
        <motion.rect x="4" y="4" width="392" height="192" rx="3" fill="none" stroke={C.brass}
          strokeWidth="1" opacity={0.4} pathLength={1}
          initial={{ strokeDasharray: "1", strokeDashoffset: 1 }}
          animate={inView ? { strokeDashoffset: 0 } : {}}
          transition={{ duration: 2, ease }} />
        <motion.rect x="8" y="8" width="384" height="184" rx="2" fill="none" stroke={C.brass}
          strokeWidth="0.5" opacity={0.2} pathLength={1}
          initial={{ strokeDasharray: "1", strokeDashoffset: 1 }}
          animate={inView ? { strokeDashoffset: 0 } : {}}
          transition={{ duration: 2, ease, delay: 0.3 }} />
      </svg>
      {children}
    </div>
  );
}

/* ─── SVG: Licensed Seal ─── */
function LicensedSeal({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="55" stroke={C.brass} strokeWidth="1.5" fill="none" />
      <circle cx="60" cy="60" r="50" stroke={C.brass} strokeWidth="0.5" fill="none" opacity={0.5} />
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i * 15 * Math.PI) / 180;
        return <circle key={i} cx={60 + 52 * Math.cos(a)} cy={60 + 52 * Math.sin(a)} r="1" fill={C.brass} opacity={0.4} />;
      })}
      <text x="60" y="58" textAnchor="middle" fontSize="28" fontFamily="var(--font-instrument)"
        fill={C.brass} fontWeight="bold">&#8478;</text>
      <path id="sealTop" d="M20 60 A40 40 0 0 1 100 60" fill="none" />
      <text fontSize="7" fill={C.brass} fontFamily="var(--font-instrument)" letterSpacing="3">
        <textPath href="#sealTop" startOffset="50%" textAnchor="middle">LICENSED PRACTITIONER</textPath>
      </text>
      <path id="sealBot" d="M100 68 A40 40 0 0 1 20 68" fill="none" />
      <text fontSize="7" fill={C.brass} fontFamily="var(--font-instrument)" letterSpacing="2">
        <textPath href="#sealBot" startOffset="50%" textAnchor="middle">EST. MMXXIV</textPath>
      </text>
      <circle cx="22" cy="64" r="2" fill={C.brass} opacity={0.6} />
      <circle cx="98" cy="64" r="2" fill={C.brass} opacity={0.6} />
    </svg>
  );
}

/* ─── SVG: Apothecary Cabinet (Hero) ─── */
function ApothecaryCabinet() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <div ref={ref}>
      <svg width="320" height="380" viewBox="0 0 320 380" fill="none" className="w-full max-w-[320px]">
        <motion.rect x="10" y="10" width="300" height="360" rx="4" fill={C.wood} stroke={C.brass} strokeWidth="2"
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.8, ease }} />
        <rect x="20" y="20" width="280" height="340" rx="2" fill={C.bgDeep} stroke={C.brass} strokeWidth="0.8" opacity={0.9} />
        <motion.path d="M110 30 Q160 10 210 30" stroke={C.brass} strokeWidth="1" fill="none"
          initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ duration: 1.5, ease, delay: 0.5 }} />
        {/* Shelves */}
        {[80, 155, 230, 305].map((y, i) => (
          <motion.line key={i} x1="25" y1={y} x2="295" y2={y} stroke={C.brass} strokeWidth="1.5"
            initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}}
            transition={{ duration: 0.8, ease, delay: 0.3 + i * 0.15 }} />
        ))}
        {/* Row 1: wide jars */}
        {[55, 110, 165, 220].map((x, i) => (
          <g key={`r1-${i}`}>
            <rect x={x} y={42} width="38" height="32" rx="3" fill={C.bgDeep} stroke={C.brass} strokeWidth="0.5" opacity={0.8} />
            <motion.rect x={x + 2} width="34" height={20 * (0.4 + i * 0.15)} rx="2"
              fill={liquidColors[i]} opacity={0.5}
              initial={{ height: 0, y: 74 }}
              animate={inView ? { height: 20 * (0.4 + i * 0.15), y: 74 - 20 * (0.4 + i * 0.15) } : {}}
              transition={{ duration: 1.4, ease, delay: 0.8 + i * 0.2 }} />
            <rect x={x + 5} y={34} width="28" height="10" rx="2" fill={C.woodLight} stroke={C.brass} strokeWidth="0.3" />
          </g>
        ))}
        {/* Row 2: tall bottles */}
        {[45, 95, 145, 195, 245].map((x, i) => (
          <g key={`r2-${i}`}>
            <rect x={x + 8} y={90} width="20" height="55" rx="4" fill={C.bgDeep} stroke={C.brass} strokeWidth="0.4" opacity={0.7} />
            <motion.rect x={x + 10} width="16" height={35 * (0.3 + i * 0.12)} rx="3"
              fill={liquidColors[i + 4]} opacity={0.45}
              initial={{ height: 0, y: 145 }}
              animate={inView ? { height: 35 * (0.3 + i * 0.12), y: 145 - 35 * (0.3 + i * 0.12) } : {}}
              transition={{ duration: 1.2, ease, delay: 1 + i * 0.15 }} />
            <rect x={x + 12} y={84} width="12" height="8" rx="2" fill={C.woodLight} stroke={C.brass} strokeWidth="0.3" />
          </g>
        ))}
        {/* Row 3: round flasks */}
        {[40, 120, 200].map((x, i) => (
          <g key={`r3-${i}`}>
            <path d={`M${x + 10} 168 L${x + 10} 175 C${x} 180 ${x - 2} 195 ${x + 5} 220 C${x + 12} 225 ${x + 52} 225 ${x + 58} 220 C${x + 65} 195 ${x + 62} 180 ${x + 52} 175 L${x + 52} 168Z`}
              fill={C.bgDeep} stroke={C.brass} strokeWidth="0.5" opacity={0.8} />
            <motion.rect x={x} width={62} height={40 * (0.5 + i * 0.15)} rx="2"
              fill={liquidColors[i + 7]} opacity={0.4}
              initial={{ height: 0, y: 225 }}
              animate={inView ? { height: 40 * (0.5 + i * 0.15), y: 225 - 40 * (0.5 + i * 0.15) } : {}}
              transition={{ duration: 1.4, ease, delay: 1.2 + i * 0.2 }} />
            <rect x={x + 14} y={162} width="34" height="8" rx="2" fill={C.woodLight} stroke={C.brass} strokeWidth="0.3" />
          </g>
        ))}
        {/* Row 4: square containers */}
        {[50, 130, 210].map((x, i) => (
          <g key={`r4-${i}`}>
            <rect x={x} y={245} width="50" height="50" rx="3" fill={C.bgDeep} stroke={C.brass} strokeWidth="0.4" opacity={0.6} />
            <motion.rect x={x + 3} width="44" height={30 * (0.4 + i * 0.2)} rx="2"
              fill={liquidColors[(i + 2) % 10]} opacity={0.4}
              initial={{ height: 0, y: 295 }}
              animate={inView ? { height: 30 * (0.4 + i * 0.2), y: 295 - 30 * (0.4 + i * 0.2) } : {}}
              transition={{ duration: 1.2, ease, delay: 1.4 + i * 0.15 }} />
            <rect x={x + 10} y={260} width="30" height="12" rx="1" fill={C.cream} opacity={0.6} />
          </g>
        ))}
        <rect x="145" y="345" width="30" height="8" rx="4" fill={C.brass} opacity={0.7} />
      </svg>
    </div>
  );
}

/* ─── Prescription Label Card ─── */
function PrescriptionCard({ project, index }: {
  project: (typeof projects)[number]; index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const rxNum = String(index + 1).padStart(4, "0");
  const liqColor = liquidColors[index % liquidColors.length];
  const fillPct = 0.35 + (((index * 7 + 3) % 10) / 10) * 0.5;
  const title = project.title.replace("\n", " ");

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40, y: 20 }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.8, ease, delay: 0.1 }}
      className="relative">
      <div className="flex gap-6 items-start">
        <div className="hidden md:block flex-shrink-0 mt-4">
          <ApothecaryJar liquidColor={liqColor} fillPercent={fillPct} size={80} label={project.tech[0]} />
        </div>
        <div className="flex-1 relative overflow-hidden"
          style={{ background: C.cream, border: `1px solid ${C.brass}`, borderRadius: 4 }}>
          {/* Corner ornaments */}
          <div className="absolute top-0 left-0"><VictorianCorner size={36} /></div>
          <div className="absolute top-0 right-0"><VictorianCorner flip size={36} /></div>
          <div className="absolute bottom-0 left-0"><VictorianCorner flipY size={36} /></div>
          <div className="absolute bottom-0 right-0"><VictorianCorner flip flipY size={36} /></div>

          {/* Header band */}
          <div className="flex items-center justify-between px-6 py-2"
            style={{ background: C.bgDeep, borderBottom: `1px solid ${C.brass}` }}>
            <div className="flex items-center gap-3">
              <span style={{ fontFamily: "var(--font-instrument)", color: C.brass, fontSize: 20 }}>&#8478;</span>
              <span style={{ fontFamily: "var(--font-instrument)", color: C.brass, fontSize: 14, letterSpacing: "0.05em" }}>
                PRESCRIPTION No. {rxNum}
              </span>
            </div>
            <span style={{ fontFamily: "var(--font-jetbrains)", color: C.parchment, fontSize: 11, opacity: 0.6 }}>
              {project.year}
            </span>
          </div>

          <div className="px-6 py-5 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 22, color: C.bgDeep, fontWeight: 700, lineHeight: 1.2 }}>
                  {title}
                </div>
                <div className="mt-1" style={{ fontFamily: "var(--font-instrument)", fontSize: 13, color: C.amber, letterSpacing: "0.03em" }}>
                  Patient: {project.client}
                </div>
              </div>
              <div className="md:hidden flex-shrink-0">
                <ApothecaryJar liquidColor={liqColor} fillPercent={fillPct} size={50} />
              </div>
            </div>

            <div style={{ borderTop: `1px dashed ${C.brass}`, opacity: 0.4 }} />

            <div>
              <div style={{ fontFamily: "var(--font-instrument)", fontSize: 11, color: C.brass, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
                Prescribed Treatment
              </div>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: 13, color: "#3D2B1F", lineHeight: 1.6, opacity: 0.85 }}>
                {project.description}
              </p>
            </div>

            <div>
              <div style={{ fontFamily: "var(--font-instrument)", fontSize: 11, color: C.brass, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
                Dosage Instructions
              </div>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: 12, color: "#3D2B1F", lineHeight: 1.6, opacity: 0.7 }}>
                {project.technical}
              </p>
            </div>

            <div>
              <div style={{ fontFamily: "var(--font-instrument)", fontSize: 11, color: C.brass, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>
                Active Ingredients
              </div>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span key={t} className="inline-block px-2 py-1 rounded-sm"
                    style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, color: C.bgDeep, background: C.parchment, border: `1px solid ${C.brass}` }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3" style={{ borderTop: `1px solid ${C.brass}20` }}>
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer"
                  style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, color: C.amber, textDecoration: "underline", textUnderlineOffset: 2 }}>
                  View Formula &rarr;
                </a>
              )}
              <div className="flex items-center gap-1 opacity-30">
                <PoisonSkull size={16} />
                <span style={{ fontFamily: "var(--font-instrument)", fontSize: 9, color: C.red }}>Rx Only</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Remedy Bottle (Expertise) ─── */
function RemedyBottle({ title, body, color, index }: {
  title: string; body: string; color: string; index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease, delay: index * 0.15 }}
      className="flex flex-col items-center text-center">
      <div className="mb-4">
        <TallBottle liquidColor={color} fillPercent={0.5 + index * 0.1} size={70} />
      </div>
      <div className="w-full p-4 relative" style={{ background: C.cream, border: `1px solid ${C.brass}40`, borderRadius: 4 }}>
        <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 700, color: C.bgDeep, marginBottom: 8 }}>
          {title}
        </div>
        <p style={{ fontFamily: "var(--font-inter)", fontSize: 12, color: "#3D2B1F", lineHeight: 1.6, opacity: 0.75 }}>
          {body}
        </p>
        <div className="absolute top-2 right-2 opacity-[0.06]">
          <svg width="40" height="40" viewBox="0 0 60 60" fill="none">
            <text x="30" y="45" textAnchor="middle" fontSize="42" fontFamily="var(--font-instrument)"
              fill={C.bgDeep} fontWeight="bold">&#8478;</text>
          </svg>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Ingredient Drawer (Tools) ─── */
function IngredientDrawer({ label, items, index }: {
  label: string; items: string[]; index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease, delay: index * 0.1 }}
      className="relative cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
      <div className="relative overflow-hidden transition-all duration-300"
        style={{ background: `linear-gradient(180deg, ${C.woodLight} 0%, ${C.wood} 100%)`,
          border: `1px solid ${C.brass}40`, borderRadius: 4, padding: "16px 20px" }}>
        {/* Brass handle */}
        <div className="flex items-center justify-center mb-2">
          <svg width="40" height="12" viewBox="0 0 40 12" fill="none">
            <rect x="5" y="4" width="30" height="4" rx="2" fill={C.brass} opacity={0.9} />
            <circle cx="8" cy="6" r="2" fill={C.brass} />
            <circle cx="32" cy="6" r="2" fill={C.brass} />
          </svg>
        </div>
        <div className="text-center mb-1"
          style={{ fontFamily: "var(--font-instrument)", fontSize: 14, color: C.cream, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {label}
        </div>
        <motion.div initial={false}
          animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.3, ease }} className="overflow-hidden">
          <div className="pt-3 mt-2 flex flex-wrap gap-2 justify-center" style={{ borderTop: `1px solid ${C.brass}30` }}>
            {items.map((item) => (
              <span key={item} className="inline-block px-2 py-1"
                style={{ fontFamily: "var(--font-jetbrains)", fontSize: 11, color: C.parchment,
                  background: `${C.brass}20`, border: `1px solid ${C.brass}30`, borderRadius: 2 }}>
                {item}
              </span>
            ))}
          </div>
        </motion.div>
        <div className="flex justify-center mt-2">
          <motion.svg width="12" height="8" viewBox="0 0 12 8" fill="none"
            animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <path d="M1 1L6 6L11 1" stroke={C.brass} strokeWidth="1" strokeLinecap="round" />
          </motion.svg>
        </div>
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(255,255,255,0.1) 3px, rgba(255,255,255,0.1) 4px)" }} />
      </div>
    </motion.div>
  );
}

/* ================================================================== */
/*  MAIN PAGE                                                          */
/* ================================================================== */
export default function ApothecaryPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      <style jsx global>{`
        @keyframes apothGlow {
          0%, 100% { filter: drop-shadow(0 0 4px ${C.brass}40); }
          50% { filter: drop-shadow(0 0 12px ${C.brass}70); }
        }
        @keyframes apothFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes apothPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        .apoth-glow { animation: apothGlow 3s ease-in-out infinite; }
        .apoth-float { animation: apothFloat 4s ease-in-out infinite; }
        body { background: ${C.bg}; }
        ::selection { background: ${C.brass}40; color: ${C.cream}; }
      `}</style>

      <div className="min-h-screen relative"
        style={{ background: `linear-gradient(180deg, ${C.bgDeep} 0%, ${C.bg} 15%, ${C.bg} 85%, ${C.bgDeep} 100%)`, color: C.parchment }}>

        {/* Texture overlay */}
        <div className="fixed inset-0 pointer-events-none z-0"
          style={{ backgroundImage: `radial-gradient(circle at 50% 50%, ${C.brass}05 1px, transparent 1px)`, backgroundSize: "24px 24px" }} />

        {/* ─── HERO ─── */}
        <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
          <div className="absolute top-4 left-4 opacity-40"><VictorianCorner size={80} /></div>
          <div className="absolute top-4 right-4 opacity-40"><VictorianCorner flip size={80} /></div>
          <div className="absolute bottom-4 left-4 opacity-40"><VictorianCorner flipY size={80} /></div>
          <div className="absolute bottom-4 right-4 opacity-40"><VictorianCorner flip flipY size={80} /></div>

          <div className="absolute top-20 left-10 opacity-30 hidden lg:block"><BotanicalSketch size={100} /></div>
          <div className="absolute bottom-20 right-10 opacity-30 hidden lg:block" style={{ transform: "scaleX(-1)" }}><BotanicalSketch size={100} /></div>

          {/* Giant Rx background */}
          <motion.div className="absolute opacity-[0.03]"
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 0.03 }} transition={{ duration: 2, ease }}>
            <svg width="500" height="500" viewBox="0 0 60 60" fill="none">
              <text x="30" y="45" textAnchor="middle" fontSize="42" fontFamily="var(--font-instrument)"
                fill={C.brass} fontWeight="bold">&#8478;</text>
            </svg>
          </motion.div>

          {/* Title */}
          <motion.div className="text-center mb-10 relative z-10"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease }}>
            <motion.div className="flex items-center justify-center gap-3 mb-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.3, ease }}>
              <div style={{ width: 40, height: 1, background: C.brass, opacity: 0.5 }} />
              <span style={{ fontFamily: "var(--font-instrument)", fontSize: 13, color: C.brass, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                Victorian Remedy Cabinet
              </span>
              <div style={{ width: 40, height: 1, background: C.brass, opacity: 0.5 }} />
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease }}>
              <span className="block" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(48px, 8vw, 96px)",
                fontWeight: 900, color: C.parchment, letterSpacing: "0.08em", lineHeight: 1,
                textShadow: `2px 2px 0 ${C.bgDeep}, 0 0 40px ${C.brass}30` }}>
                APOTHECARY
              </span>
            </motion.h1>

            <motion.div className="mt-3 apoth-glow"
              initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.8, ease }}>
              <svg width="50" height="50" viewBox="0 0 60 60" fill="none">
                <text x="30" y="45" textAnchor="middle" fontSize="42" fontFamily="var(--font-instrument)"
                  fill={C.brass} fontWeight="bold">&#8478;</text>
              </svg>
            </motion.div>

            <motion.p className="mt-4" style={{ fontFamily: "var(--font-instrument)", fontSize: 18, color: C.brass,
              letterSpacing: "0.03em", maxWidth: 480, marginInline: "auto" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1, ease }}>
              Curating digital remedies &amp; technological elixirs since MMXXIV
            </motion.p>
          </motion.div>

          {/* Cabinet */}
          <motion.div className="relative z-10 mb-12"
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.6, ease }}>
            <ApothecaryCabinet />
          </motion.div>

          {/* Stats as dosage readings */}
          <motion.div className="grid grid-cols-3 gap-8 md:gap-16 relative z-10"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease }}>
            {stats.map((stat, i) => (
              <div key={stat.label} className="text-center">
                <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.4 + i * 0.15, ease }}>
                  <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: "clamp(28px, 5vw, 44px)",
                    fontWeight: 700, color: C.brass, lineHeight: 1 }}>{stat.value}</div>
                  <div className="mt-1" style={{ fontFamily: "var(--font-instrument)", fontSize: 12,
                    color: C.parchment, opacity: 0.6, letterSpacing: "0.08em", textTransform: "uppercase" }}>{stat.label}</div>
                  <div className="mt-1" style={{ fontFamily: "var(--font-instrument)", fontSize: 9,
                    color: C.amber, opacity: 0.4 }}>DOSAGE {i + 1}</div>
                </motion.div>
              </div>
            ))}
          </motion.div>

          {/* Decorative floating jars flanking cabinet */}
          <motion.div className="absolute left-4 top-1/2 -translate-y-1/2 hidden xl:block opacity-30"
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 0.3, x: 0 }}
            transition={{ duration: 1.5, delay: 1.5, ease }}>
            <div className="space-y-6">
              <WideJar liquidColor="#7BAE7F" fillPercent={0.4} size={50} />
              <TallBottle liquidColor="#9B59B6" fillPercent={0.6} size={35} />
            </div>
          </motion.div>
          <motion.div className="absolute right-4 top-1/2 -translate-y-1/2 hidden xl:block opacity-30"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 0.3, x: 0 }}
            transition={{ duration: 1.5, delay: 1.5, ease }}>
            <div className="space-y-6">
              <TallBottle liquidColor="#D4883A" fillPercent={0.5} size={35} />
              <WideJar liquidColor="#3B7DD8" fillPercent={0.55} size={50} />
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div className="absolute bottom-8 apoth-float"
            initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ duration: 1, delay: 2, ease }}>
            <svg width="20" height="30" viewBox="0 0 20 30" fill="none">
              <rect x="1" y="1" width="18" height="28" rx="9" stroke={C.brass} strokeWidth="1" />
              <motion.circle cx="10" r="2" fill={C.brass}
                animate={{ cy: [8, 18, 8] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
            </svg>
          </motion.div>
        </section>

        <VictorianDivider width={400} />

        {/* ─── PROJECTS ─── */}
        <section className="relative z-10 px-6 py-20 max-w-4xl mx-auto">
          <Reveal className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-3"
              style={{ fontFamily: "var(--font-instrument)", fontSize: 12, color: C.brass, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              <PoisonSkull size={18} />
              <span>Prescribed Formulae</span>
              <PoisonSkull size={18} />
            </div>
            <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 800, color: C.parchment, lineHeight: 1.1 }}>Prescriptions</h2>
            <p className="mt-3 mx-auto" style={{ fontFamily: "var(--font-instrument)", fontSize: 15,
              color: C.parchment, opacity: 0.5, maxWidth: 500 }}>
              Each remedy carefully measured, mixed, and administered with precision
            </p>
          </Reveal>
          <div className="space-y-10">
            {projects.map((project, i) => (
              <PrescriptionCard key={project.title} project={project} index={i} />
            ))}
          </div>
        </section>

        <div className="py-8"><VictorianDivider width={300} /></div>

        {/* ─── EXPERTISE ─── */}
        <section className="relative z-10 px-6 py-20 max-w-5xl mx-auto">
          <Reveal className="text-center mb-16">
            <div className="mb-3" style={{ fontFamily: "var(--font-instrument)", fontSize: 12,
              color: C.brass, letterSpacing: "0.12em", textTransform: "uppercase" }}>Specialty Remedies</div>
            <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 800, color: C.parchment, lineHeight: 1.1 }}>Areas of Practice</h2>
            <p className="mt-3 mx-auto" style={{ fontFamily: "var(--font-instrument)", fontSize: 15,
              color: C.parchment, opacity: 0.5, maxWidth: 500 }}>
              Four essential disciplines, each distilled to its purest form
            </p>
          </Reveal>

          {/* Decorative shelf above bottles */}
          <Reveal className="mb-8">
            <div className="flex justify-center">
              <svg width="600" height="12" viewBox="0 0 600 12" fill="none" className="w-full max-w-[600px]">
                <rect x="0" y="8" width="600" height="3" rx="1" fill={C.wood} stroke={C.brass} strokeWidth="0.5" />
                <rect x="50" y="0" width="2" height="8" fill={C.brass} opacity={0.4} />
                <rect x="548" y="0" width="2" height="8" fill={C.brass} opacity={0.4} />
                <rect x="150" y="4" width="2" height="4" fill={C.brass} opacity={0.3} />
                <rect x="300" y="4" width="2" height="4" fill={C.brass} opacity={0.3} />
                <rect x="448" y="4" width="2" height="4" fill={C.brass} opacity={0.3} />
              </svg>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {expertise.map((exp, i) => (
              <RemedyBottle key={exp.title} title={exp.title} body={exp.body}
                color={expertiseColors[i]} index={i} />
            ))}
          </div>

          {/* Bottom shelf */}
          <Reveal delay={0.4} className="mt-8">
            <div className="flex justify-center">
              <svg width="600" height="8" viewBox="0 0 600 8" fill="none" className="w-full max-w-[600px]">
                <rect x="0" y="0" width="600" height="3" rx="1" fill={C.wood} stroke={C.brass} strokeWidth="0.5" />
              </svg>
            </div>
          </Reveal>
        </section>

        <div className="py-8"><VictorianDivider width={300} /></div>

        {/* ─── TOOLS ─── */}
        <section className="relative z-10 px-6 py-20 max-w-4xl mx-auto">
          <Reveal className="text-center mb-16">
            <div className="mb-3" style={{ fontFamily: "var(--font-instrument)", fontSize: 12,
              color: C.brass, letterSpacing: "0.12em", textTransform: "uppercase" }}>Materia Medica</div>
            <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 800, color: C.parchment, lineHeight: 1.1 }}>Ingredient Cabinet</h2>
            <p className="mt-3 mx-auto" style={{ fontFamily: "var(--font-instrument)", fontSize: 15,
              color: C.parchment, opacity: 0.5, maxWidth: 420 }}>
              Open each drawer to reveal the tools within
            </p>
          </Reveal>

          <div className="relative p-6 md:p-8" style={{ background: `linear-gradient(180deg, ${C.wood} 0%, ${C.woodLight}90 50%, ${C.wood} 100%)`,
            border: `2px solid ${C.brass}40`, borderRadius: 8, boxShadow: `inset 0 2px 20px ${C.bgDeep}80, 0 8px 32px ${C.bgDeep}60` }}>
            <div className="absolute top-1 left-1"><VictorianCorner size={40} color={`${C.brass}80`} /></div>
            <div className="absolute top-1 right-1"><VictorianCorner flip size={40} color={`${C.brass}80`} /></div>
            <div className="absolute bottom-1 left-1"><VictorianCorner flipY size={40} color={`${C.brass}80`} /></div>
            <div className="absolute bottom-1 right-1"><VictorianCorner flip flipY size={40} color={`${C.brass}80`} /></div>
            <div className="absolute top-0 left-8 right-8 h-[3px]"
              style={{ background: `linear-gradient(90deg, transparent, ${C.brass}60, transparent)` }} />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {tools.map((tool, i) => (
                <IngredientDrawer key={tool.label} label={tool.label} items={tool.items} index={i} />
              ))}
            </div>
            <div className="absolute bottom-0 left-8 right-8 h-[3px]"
              style={{ background: `linear-gradient(90deg, transparent, ${C.brass}60, transparent)` }} />
          </div>
        </section>

        <div className="py-8"><VictorianDivider width={350} /></div>

        {/* ─── FOOTER ─── */}
        <footer className="relative z-10 px-6 py-24 text-center overflow-hidden">
          {/* Background corner ornaments */}
          <div className="absolute top-8 left-8 opacity-20 hidden md:block"><VictorianCorner size={60} /></div>
          <div className="absolute top-8 right-8 opacity-20 hidden md:block"><VictorianCorner flip size={60} /></div>

          <Reveal className="flex justify-center mb-8">
            <MortarAndPestle size={100} />
          </Reveal>

          {/* Victorian seal */}
          <Reveal delay={0.2} className="flex justify-center mb-8">
            <LicensedSeal size={130} />
          </Reveal>

          {/* EST. 2024 with ornamental frame */}
          <Reveal delay={0.3}>
            <OrnamentalFrame className="inline-block px-8 py-4 mx-auto">
              <div style={{ fontFamily: "var(--font-playfair)", fontSize: 28, fontWeight: 700,
                color: C.brass, letterSpacing: "0.1em" }}>
                EST. 2024
              </div>
              <div className="mt-1" style={{ fontFamily: "var(--font-instrument)", fontSize: 11,
                color: C.parchment, opacity: 0.4, letterSpacing: "0.15em" }}>
                APOTHECARIUS DIGITALIS
              </div>
            </OrnamentalFrame>
          </Reveal>

          <Reveal delay={0.4} className="my-8">
            <VictorianDivider width={250} />
          </Reveal>

          {/* Quote */}
          <Reveal delay={0.5}>
            <p style={{ fontFamily: "var(--font-instrument)", fontSize: 14, color: C.parchment, opacity: 0.5,
              letterSpacing: "0.06em", maxWidth: 400, marginInline: "auto", lineHeight: 1.8 }}>
              &ldquo;For every ailment of the digital age, there exists a remedy
              measured in code and administered with care.&rdquo;
            </p>
          </Reveal>

          {/* Botanical + Rx row */}
          <Reveal delay={0.6} className="flex justify-center items-center gap-6 mt-8 opacity-30">
            <BotanicalSketch size={50} />
            <PoisonSkull size={20} />
            <svg width="30" height="30" viewBox="0 0 60 60" fill="none">
              <text x="30" y="45" textAnchor="middle" fontSize="42" fontFamily="var(--font-instrument)"
                fill={C.brass} fontWeight="bold">&#8478;</text>
            </svg>
            <PoisonSkull size={20} />
            <BotanicalSketch size={50} />
          </Reveal>

          {/* Decorative jar row */}
          <Reveal delay={0.7} className="flex justify-center items-end gap-4 mt-6">
            {["#7BAE7F", "#D4883A", "#8B2500", "#9B59B6", "#C8A96E"].map((color, i) => (
              <div key={i} className="opacity-40">
                {i % 2 === 0 ? (
                  <TallBottle liquidColor={color} fillPercent={0.3 + i * 0.12} size={28} />
                ) : (
                  <WideJar liquidColor={color} fillPercent={0.4 + i * 0.1} size={32} />
                )}
              </div>
            ))}
          </Reveal>

          {/* Closing flourish */}
          <Reveal delay={0.8}>
            <div className="mt-8 space-y-2">
              <div style={{ fontFamily: "var(--font-instrument)", fontSize: 11, color: C.brass,
                opacity: 0.4, letterSpacing: "0.1em" }}>
                &#9670; FINIS &#9670;
              </div>
              <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, color: C.brass, opacity: 0.25 }}>
                Licensed Digital Apothecary &bull; All Remedies Guaranteed
              </div>
              <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 9, color: C.parchment, opacity: 0.15 }}>
                &copy; MMXXIV &mdash; Compounded with care in the digital laboratory
              </div>
            </div>
          </Reveal>
        </footer>

        <ThemeSwitcher current="/apothecary" variant="dark" />
      </div>
    </>
  );
}
