"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";

/* ================================================================
   SEXTANT — Maritime Navigation & Nautical Chart Portfolio
   Colors: Parchment #F0E6D3 | Sea #2E8B8F | Navy #1A2744
           Brass #B8860B | Rope #C4A565 | Red #CC3333
   ================================================================ */

const C = {
  parchment: "#F0E6D3",
  parchmentLight: "#F7F0E3",
  sea: "#2E8B8F",
  seaLight: "#3AA5A9",
  seaDark: "#1E6B6F",
  navy: "#1A2744",
  navyLight: "#2A3B5E",
  brass: "#B8860B",
  brassLight: "#D4A84B",
  brassDim: "rgba(184,134,11,0.15)",
  rope: "#C4A565",
  ropeLight: "#D4B87A",
  red: "#CC3333",
  redLight: "#E04444",
  ink: "#2A2520",
  inkLight: "#5A4E42",
  faded: "#8A7D6B",
  fadedLight: "rgba(138,125,107,0.4)",
  gridLine: "rgba(46,139,143,0.08)",
  depthNum: "rgba(46,139,143,0.12)",
};

/* ─── Nautical coordinates for each project ─── */
const nauticalCoords = [
  { lat: "51\u00b030'26\"N", lng: "0\u00b007'39\"W", bearing: "NNW", knots: 12 },
  { lat: "34\u00b003'08\"N", lng: "118\u00b014'37\"W", bearing: "WSW", knots: 9 },
  { lat: "48\u00b051'24\"N", lng: "2\u00b021'07\"E", bearing: "ENE", knots: 14 },
  { lat: "40\u00b042'46\"N", lng: "74\u00b000'22\"W", bearing: "SSE", knots: 11 },
  { lat: "35\u00b041'22\"N", lng: "139\u00b041'30\"E", bearing: "NNE", knots: 8 },
  { lat: "22\u00b016'42\"S", lng: "43\u00b010'23\"W", bearing: "SW", knots: 10 },
  { lat: "55\u00b045'20\"N", lng: "37\u00b037'04\"E", bearing: "ESE", knots: 13 },
  { lat: "37\u00b046'30\"N", lng: "122\u00b025'10\"W", bearing: "WNW", knots: 7 },
  { lat: "1\u00b017'12\"N", lng: "103\u00b051'00\"E", bearing: "SE", knots: 15 },
  { lat: "41\u00b023'29\"N", lng: "2\u00b010'25\"E", bearing: "NW", knots: 6 },
];

/* ─── Format date like ship's log ─── */
function formatLogDate(year: string, index: number): string {
  const days = [15, 3, 22, 8, 17, 1, 29, 11, 26, 5];
  const months = [
    "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November",
  ];
  const suffixes = ["th", "rd", "nd", "th", "th", "st", "th", "th", "th", "th"];
  return `${days[index]}${suffixes[index]} Day of ${months[index]}, Anno ${year}`;
}

/* ================================================================
   GLOBAL STYLES — Injected once
   ================================================================ */
function NauticalStyles() {
  return (
    <style jsx global>{`
      @keyframes compassRotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes ropeWave {
        0% { transform: translateX(0); }
        50% { transform: translateX(-12px); }
        100% { transform: translateX(0); }
      }
      @keyframes anchorDrop {
        0% { opacity: 0; transform: translateY(-20px); }
        60% { opacity: 1; transform: translateY(4px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      @keyframes rhumbFade {
        0% { opacity: 0; }
        100% { opacity: 0.06; }
      }
      @keyframes gentleSway {
        0%, 100% { transform: rotate(-1deg); }
        50% { transform: rotate(1deg); }
      }
      @keyframes inkReveal {
        0% { opacity: 0; filter: blur(2px); }
        100% { opacity: 1; filter: blur(0px); }
      }
      .nautical-grid {
        background-image:
          linear-gradient(${C.gridLine} 1px, transparent 1px),
          linear-gradient(90deg, ${C.gridLine} 1px, transparent 1px);
        background-size: 80px 80px;
      }
      .depth-sounding {
        font-style: italic;
        color: ${C.depthNum};
        font-size: 11px;
        pointer-events: none;
        user-select: none;
      }
      .rope-border {
        animation: ropeWave 8s ease-in-out infinite;
      }
      .compass-spin {
        animation: compassRotate 120s linear infinite;
      }
      .anchor-drop {
        animation: anchorDrop 0.6s ease-out forwards;
      }
      .sway {
        animation: gentleSway 6s ease-in-out infinite;
      }
      .rhumb-line {
        animation: rhumbFade 1.5s ease-out forwards;
      }
      /* Scrollbar */
      .sextant-page::-webkit-scrollbar { width: 8px; }
      .sextant-page::-webkit-scrollbar-track { background: ${C.parchment}; }
      .sextant-page::-webkit-scrollbar-thumb {
        background: ${C.rope};
        border-radius: 4px;
      }
      .sextant-page::-webkit-scrollbar-thumb:hover {
        background: ${C.brass};
      }
    `}</style>
  );
}

/* ================================================================
   SVG COMPONENTS
   ================================================================ */

/* ─── Compass Rose (32-point) ─── */
function CompassRose({ size = 400 }: { size?: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.46;
  const innerR = size * 0.32;
  const tinyR = size * 0.18;
  const centerR = size * 0.06;

  const cardinals = [
    { label: "N", angle: 0 },
    { label: "E", angle: 90 },
    { label: "S", angle: 180 },
    { label: "W", angle: 270 },
  ];

  const intercardinals = [
    { label: "NE", angle: 45 },
    { label: "SE", angle: 135 },
    { label: "SW", angle: 225 },
    { label: "NW", angle: 315 },
  ];

  /* Build 32 directional points */
  const points32: { angle: number; length: number; filled: boolean }[] = [];
  for (let i = 0; i < 32; i++) {
    const angle = i * 11.25;
    let length: number;
    let filled: boolean;
    if (i % 8 === 0) {
      length = outerR;
      filled = true;
    } else if (i % 4 === 0) {
      length = innerR;
      filled = true;
    } else if (i % 2 === 0) {
      length = tinyR;
      filled = i % 4 !== 2;
    } else {
      length = tinyR * 0.7;
      filled = false;
    }
    points32.push({ angle, length, filled });
  }

  function polarToXY(angle: number, r: number) {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="compass-spin"
      style={{ opacity: 0.85 }}
    >
      {/* Outer decorative rings */}
      <circle cx={cx} cy={cy} r={outerR + 8} fill="none" stroke={C.brass} strokeWidth="1" opacity="0.3" />
      <circle cx={cx} cy={cy} r={outerR + 4} fill="none" stroke={C.brass} strokeWidth="0.5" opacity="0.2" />
      <circle cx={cx} cy={cy} r={innerR} fill="none" stroke={C.brass} strokeWidth="0.5" opacity="0.25" />
      <circle cx={cx} cy={cy} r={tinyR} fill="none" stroke={C.brass} strokeWidth="0.5" opacity="0.2" />

      {/* Degree tick marks */}
      {Array.from({ length: 72 }).map((_, i) => {
        const angle = i * 5;
        const isMajor = angle % 30 === 0;
        const tickOuter = outerR + 6;
        const tickInner = outerR + (isMajor ? 0 : 2);
        const p1 = polarToXY(angle, tickOuter);
        const p2 = polarToXY(angle, tickInner);
        return (
          <line
            key={`tick-${i}`}
            x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
            stroke={C.brass}
            strokeWidth={isMajor ? "1" : "0.5"}
            opacity={isMajor ? "0.5" : "0.3"}
          />
        );
      })}

      {/* 32-point directional triangles */}
      {points32.map((pt, i) => {
        const tip = polarToXY(pt.angle, pt.length);
        const spread = pt.length > innerR ? 6 : pt.length > tinyR ? 4 : 2.5;
        const leftAngle = pt.angle - 90;
        const rightAngle = pt.angle + 90;
        const lRad = (leftAngle * Math.PI) / 180;
        const rRad = (rightAngle * Math.PI) / 180;
        const baseL = { x: cx + spread * Math.cos(lRad), y: cy + spread * Math.sin(lRad) };
        const baseR = { x: cx + spread * Math.cos(rRad), y: cy + spread * Math.sin(rRad) };
        const d = `M${tip.x},${tip.y} L${baseL.x},${baseL.y} L${baseR.x},${baseR.y} Z`;
        return (
          <path
            key={`pt-${i}`}
            d={d}
            fill={pt.filled ? (i % 8 === 0 ? C.brass : C.rope) : "none"}
            stroke={pt.filled ? C.brass : C.rope}
            strokeWidth="0.5"
            opacity={pt.filled ? (i % 8 === 0 ? "0.9" : "0.5") : "0.3"}
          />
        );
      })}

      {/* Center circle */}
      <circle cx={cx} cy={cy} r={centerR} fill={C.brass} opacity="0.6" />
      <circle cx={cx} cy={cy} r={centerR - 2} fill={C.parchment} opacity="0.8" />
      <circle cx={cx} cy={cy} r={2} fill={C.brass} opacity="0.9" />

      {/* Cardinal labels */}
      {cardinals.map((c) => {
        const pos = polarToXY(c.angle, outerR + 18);
        return (
          <text
            key={c.label}
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            dominantBaseline="central"
            fill={C.navy}
            fontSize="16"
            fontWeight="700"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            {c.label}
          </text>
        );
      })}

      {/* Intercardinal labels */}
      {intercardinals.map((c) => {
        const pos = polarToXY(c.angle, outerR + 16);
        return (
          <text
            key={c.label}
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            dominantBaseline="central"
            fill={C.faded}
            fontSize="10"
            fontWeight="400"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            {c.label}
          </text>
        );
      })}
    </svg>
  );
}

/* ─── Anchor SVG ─── */
function AnchorIcon({ size = 20, color = C.brass }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="3" />
      <line x1="12" y1="8" x2="12" y2="22" />
      <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
    </svg>
  );
}

/* ─── Rope Border SVG Pattern ─── */
function RopeBorder() {
  return (
    <div className="rope-border" style={{ width: "100%", overflow: "hidden", height: "16px", position: "relative" }}>
      <svg width="100%" height="16" viewBox="0 0 600 16" preserveAspectRatio="none" style={{ display: "block" }}>
        <defs>
          <pattern id="ropePattern" x="0" y="0" width="40" height="16" patternUnits="userSpaceOnUse">
            <path
              d="M0,8 C5,3 10,3 15,8 C20,13 25,13 30,8 C35,3 40,3 40,8"
              fill="none"
              stroke={C.rope}
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.6"
            />
            <path
              d="M0,8 C5,13 10,13 15,8 C20,3 25,3 30,8 C35,13 40,13 40,8"
              fill="none"
              stroke={C.brass}
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.3"
            />
          </pattern>
        </defs>
        <rect width="600" height="16" fill="url(#ropePattern)" />
      </svg>
    </div>
  );
}

/* ─── Rhumb Lines ─── */
function RhumbLines() {
  const lines = [15, 45, 75, 105, 135, 165, -15, -45, -75];
  return (
    <div
      className="rhumb-line"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        {lines.map((angle, i) => {
          const cx = 50 + (i % 3) * 15;
          const cy = 20;
          const len = 2000;
          const rad = (angle * Math.PI) / 180;
          const x2 = cx + len * Math.sin(rad);
          const y2 = cy + len * Math.cos(rad);
          return (
            <line
              key={`rhumb-${i}`}
              x1={`${cx}%`}
              y1={`${cy}%`}
              x2={x2}
              y2={y2}
              stroke={C.sea}
              strokeWidth="0.5"
              opacity="0.06"
            />
          );
        })}
      </svg>
    </div>
  );
}

/* ─── Depth Soundings ─── */
function DepthSoundings() {
  const soundings = [
    { x: "8%", y: "15%", val: "12" },
    { x: "92%", y: "22%", val: "27" },
    { x: "15%", y: "38%", val: "8" },
    { x: "85%", y: "45%", val: "45" },
    { x: "5%", y: "55%", val: "19" },
    { x: "95%", y: "62%", val: "33" },
    { x: "12%", y: "72%", val: "6" },
    { x: "88%", y: "78%", val: "41" },
    { x: "7%", y: "88%", val: "22" },
    { x: "93%", y: "92%", val: "15" },
    { x: "20%", y: "25%", val: "31" },
    { x: "78%", y: "35%", val: "9" },
    { x: "25%", y: "58%", val: "37" },
    { x: "72%", y: "68%", val: "14" },
    { x: "18%", y: "82%", val: "52" },
    { x: "82%", y: "10%", val: "3" },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      {soundings.map((s, i) => (
        <span
          key={`snd-${i}`}
          className="depth-sounding"
          style={{
            position: "absolute",
            left: s.x,
            top: s.y,
            fontFamily: "var(--font-jetbrains)",
          }}
        >
          {s.val}
        </span>
      ))}
    </div>
  );
}

/* ─── Cartouche (Ornate Title Frame) ─── */
function Cartouche({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 400 200"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        preserveAspectRatio="none"
      >
        {/* Outer ornate border */}
        <rect x="4" y="4" width="392" height="192" rx="8" fill="none" stroke={C.brass} strokeWidth="2" opacity="0.6" />
        <rect x="10" y="10" width="380" height="180" rx="4" fill="none" stroke={C.brass} strokeWidth="0.5" opacity="0.3" />
        {/* Corner ornaments */}
        {[
          [16, 16], [384, 16], [16, 184], [384, 184],
        ].map(([x, y], i) => (
          <g key={`corner-${i}`}>
            <circle cx={x} cy={y} r="6" fill="none" stroke={C.brass} strokeWidth="1" opacity="0.5" />
            <circle cx={x} cy={y} r="2" fill={C.brass} opacity="0.4" />
          </g>
        ))}
        {/* Top/bottom scroll ornaments */}
        <path d="M80,4 Q100,-6 120,4" fill="none" stroke={C.brass} strokeWidth="1.5" opacity="0.4" />
        <path d="M280,4 Q300,-6 320,4" fill="none" stroke={C.brass} strokeWidth="1.5" opacity="0.4" />
        <path d="M80,196 Q100,206 120,196" fill="none" stroke={C.brass} strokeWidth="1.5" opacity="0.4" />
        <path d="M280,196 Q300,206 320,196" fill="none" stroke={C.brass} strokeWidth="1.5" opacity="0.4" />
        {/* Side flourishes */}
        <path d="M4,70 Q-4,80 4,90" fill="none" stroke={C.brass} strokeWidth="1" opacity="0.3" />
        <path d="M4,110 Q-4,120 4,130" fill="none" stroke={C.brass} strokeWidth="1" opacity="0.3" />
        <path d="M396,70 Q404,80 396,90" fill="none" stroke={C.brass} strokeWidth="1" opacity="0.3" />
        <path d="M396,110 Q404,120 396,130" fill="none" stroke={C.brass} strokeWidth="1" opacity="0.3" />
      </svg>
      <div style={{ position: "relative", padding: "28px 36px", zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}

/* ─── Chart Legend ─── */
function ChartLegend() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.2 }}
      style={{
        border: `1.5px solid ${C.brass}`,
        borderRadius: "4px",
        padding: "20px 24px",
        background: `${C.parchmentLight}`,
        maxWidth: "320px",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-dm-serif)",
          fontSize: "14px",
          color: C.navy,
          marginBottom: "16px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          borderBottom: `1px solid ${C.fadedLight}`,
          paddingBottom: "8px",
        }}
      >
        Chart Legend
      </div>
      {[
        { symbol: <AnchorIcon size={16} color={C.sea} />, label: "Port of Call (Project)" },
        { symbol: <span style={{ fontSize: "16px", color: C.brass }}>&#9678;</span>, label: "Navigation Instrument (Expertise)" },
        { symbol: <span style={{ fontSize: "16px", color: C.rope }}>&#9724;</span>, label: "Ship\u2019s Provisions (Tool)" },
      ].map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
          <span style={{ width: "24px", display: "flex", justifyContent: "center" }}>{item.symbol}</span>
          <span style={{ fontFamily: "var(--font-inter)", fontSize: "12px", color: C.faded }}>{item.label}</span>
        </div>
      ))}
    </motion.div>
  );
}

/* ─── Latitude/Longitude Edge Markers ─── */
function LatLngMarkers() {
  const latMarks = [10, 20, 30, 40, 50, 60, 70, 80];
  const lngMarks = [10, 20, 30, 40, 50, 60, 70, 80, 90];

  return (
    <>
      {/* Left edge - latitude markers */}
      <div style={{ position: "fixed", left: "4px", top: 0, bottom: 0, zIndex: 1, pointerEvents: "none" }}>
        {latMarks.map((pct) => (
          <span
            key={`lat-${pct}`}
            style={{
              position: "absolute",
              top: `${pct}%`,
              left: 0,
              fontFamily: "var(--font-jetbrains)",
              fontSize: "8px",
              color: C.fadedLight,
              transform: "rotate(-90deg)",
              transformOrigin: "left center",
              whiteSpace: "nowrap",
            }}
          >
            {pct - 10}\u00b0N
          </span>
        ))}
      </div>
      {/* Bottom edge - longitude markers */}
      <div style={{ position: "fixed", bottom: "4px", left: 0, right: 0, zIndex: 1, pointerEvents: "none", display: "flex", justifyContent: "space-around" }}>
        {lngMarks.map((pct) => (
          <span
            key={`lng-${pct}`}
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: "8px",
              color: C.fadedLight,
            }}
          >
            {pct}\u00b0W
          </span>
        ))}
      </div>
    </>
  );
}

/* ─── Section Anchor Marker ─── */
function SectionMarker({ label }: { label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        marginBottom: "40px",
      }}
    >
      <div className={inView ? "anchor-drop" : ""} style={{ opacity: inView ? 1 : 0 }}>
        <AnchorIcon size={28} color={C.navy} />
      </div>
      <h2
        style={{
          fontFamily: "var(--font-dm-serif)",
          fontSize: "clamp(24px, 4vw, 36px)",
          color: C.navy,
          margin: 0,
          letterSpacing: "0.02em",
        }}
      >
        {label}
      </h2>
      <div style={{ flex: 1, height: "1px", background: `linear-gradient(to right, ${C.brass}, transparent)` }} />
    </motion.div>
  );
}

/* ================================================================
   HERO SECTION
   ================================================================ */
function HeroSection() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "80px 24px 60px",
        overflow: "hidden",
      }}
    >
      {/* Rhumb lines in hero */}
      <RhumbLines />

      {/* Compass Rose */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        style={{ position: "absolute", opacity: 0.15 }}
      >
        <CompassRose size={600} />
      </motion.div>

      {/* Cartouche with title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: "600px" }}
      >
        <Cartouche>
          <div style={{ textAlign: "center" }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: "11px",
                color: C.faded,
                letterSpacing: "0.2em",
                marginBottom: "8px",
                textTransform: "uppercase",
              }}
            >
              Charted &amp; Surveyed
            </motion.div>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              style={{
                fontFamily: "var(--font-dm-serif)",
                fontSize: "clamp(32px, 6vw, 56px)",
                color: C.navy,
                margin: "0 0 8px",
                lineHeight: 1.1,
              }}
            >
              AI Product
              <br />
              Studio
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              style={{
                fontFamily: "var(--font-dm-serif)",
                fontSize: "clamp(14px, 2.5vw, 18px)",
                color: C.sea,
                fontStyle: "italic",
                marginBottom: "12px",
              }}
            >
              A Navigator&apos;s Chart of Digital Voyages
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: "10px",
                color: C.faded,
                letterSpacing: "0.15em",
              }}
            >
              LAT 51\u00b030&apos;N &bull; LNG 0\u00b007&apos;W
            </motion.div>
          </div>
        </Cartouche>
      </motion.div>

      {/* Wind Rose Stats */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        style={{
          position: "relative",
          zIndex: 2,
          marginTop: "60px",
        }}
      >
        <WindRoseStats />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        style={{
          position: "absolute",
          bottom: "40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          zIndex: 2,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-jetbrains)",
            fontSize: "9px",
            color: C.faded,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          Open the Log
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
            <path d="M8 2v16M2 12l6 6 6-6" stroke={C.brass} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─── Wind Rose Stats ─── */
function WindRoseStats() {
  const compassPoints = [
    { angle: 0, label: "N" },
    { angle: 90, label: "E" },
    { angle: 180, label: "S" },
    { angle: 270, label: "W" },
  ];

  const statAngles = [45, 165, 285];

  return (
    <div style={{ position: "relative", width: "280px", height: "280px" }}>
      {/* Background circle */}
      <svg
        width="280"
        height="280"
        viewBox="0 0 280 280"
        style={{ position: "absolute", inset: 0 }}
      >
        <circle cx="140" cy="140" r="120" fill="none" stroke={C.brass} strokeWidth="1" opacity="0.3" />
        <circle cx="140" cy="140" r="80" fill="none" stroke={C.brass} strokeWidth="0.5" opacity="0.2" />
        <circle cx="140" cy="140" r="40" fill="none" stroke={C.brass} strokeWidth="0.5" opacity="0.15" />
        {/* Cross lines */}
        <line x1="140" y1="20" x2="140" y2="260" stroke={C.brass} strokeWidth="0.5" opacity="0.15" />
        <line x1="20" y1="140" x2="260" y2="140" stroke={C.brass} strokeWidth="0.5" opacity="0.15" />
        <line x1="55" y1="55" x2="225" y2="225" stroke={C.brass} strokeWidth="0.3" opacity="0.1" />
        <line x1="225" y1="55" x2="55" y2="225" stroke={C.brass} strokeWidth="0.3" opacity="0.1" />
      </svg>

      {/* Compass point labels */}
      {compassPoints.map((pt) => {
        const rad = ((pt.angle - 90) * Math.PI) / 180;
        const x = 140 + 130 * Math.cos(rad);
        const y = 140 + 130 * Math.sin(rad);
        return (
          <div
            key={pt.label}
            style={{
              position: "absolute",
              left: `${x}px`,
              top: `${y}px`,
              transform: "translate(-50%, -50%)",
              fontFamily: "var(--font-dm-serif)",
              fontSize: "12px",
              color: C.faded,
            }}
          >
            {pt.label}
          </div>
        );
      })}

      {/* Stats at compass angles */}
      {stats.map((stat, i) => {
        const angle = statAngles[i];
        const rad = ((angle - 90) * Math.PI) / 180;
        const x = 140 + 90 * Math.cos(rad);
        const y = 140 + 90 * Math.sin(rad);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}px`,
              top: `${y}px`,
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-dm-serif)",
                fontSize: "28px",
                color: C.navy,
                lineHeight: 1,
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: "9px",
                color: C.faded,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginTop: "4px",
              }}
            >
              {stat.label}
            </div>
          </div>
        );
      })}

      {/* Center emblem */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <AnchorIcon size={24} color={C.brass} />
      </div>
    </div>
  );
}

/* ================================================================
   SHIP'S LOG — PROJECT ENTRIES
   ================================================================ */
function LogEntry({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const coords = nauticalCoords[index];
  const title = project.title.replace("\n", " ");
  const logDate = formatLogDate(project.year, index);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.1 }}
      style={{
        position: "relative",
        marginBottom: "56px",
        paddingLeft: "48px",
        borderLeft: `2px solid ${C.brassDim}`,
      }}
    >
      {/* Anchor marker on the left line */}
      <div
        className={inView ? "anchor-drop" : ""}
        style={{
          position: "absolute",
          left: "-13px",
          top: "0px",
          background: C.parchment,
          padding: "2px",
          opacity: inView ? 1 : 0,
        }}
      >
        <AnchorIcon size={22} color={C.sea} />
      </div>

      {/* Entry number */}
      <div
        style={{
          position: "absolute",
          left: "-60px",
          top: "2px",
          fontFamily: "var(--font-jetbrains)",
          fontSize: "11px",
          color: C.fadedLight,
          textAlign: "right",
          width: "36px",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* Date line */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.2, duration: 0.6 }}
        style={{
          fontFamily: "var(--font-dm-serif)",
          fontSize: "13px",
          fontStyle: "italic",
          color: C.faded,
          marginBottom: "6px",
        }}
      >
        {logDate}
      </motion.div>

      {/* Bearing line */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.3, duration: 0.6 }}
        style={{
          fontFamily: "var(--font-jetbrains)",
          fontSize: "10px",
          color: C.sea,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          marginBottom: "12px",
        }}
      >
        Course: {coords.bearing} at {coords.knots} knots &bull; Position: {coords.lat}, {coords.lng}
      </motion.div>

      {/* Port of call (project title) */}
      <motion.h3
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.35, duration: 0.6 }}
        style={{
          fontFamily: "var(--font-dm-serif)",
          fontSize: "clamp(22px, 3.5vw, 30px)",
          color: C.navy,
          margin: "0 0 4px",
          lineHeight: 1.2,
        }}
      >
        {title}
      </motion.h3>

      {/* Client / Industry */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.4, duration: 0.6 }}
        style={{
          fontFamily: "var(--font-jetbrains)",
          fontSize: "10px",
          color: C.brass,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: "14px",
        }}
      >
        {project.client}
      </motion.div>

      {/* Log entry (description) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.45, duration: 0.6 }}
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: "14px",
          lineHeight: 1.7,
          color: C.ink,
          marginBottom: "10px",
          maxWidth: "640px",
        }}
      >
        {project.description}
      </motion.div>

      {/* Technical notes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.5, duration: 0.6 }}
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: "13px",
          lineHeight: 1.65,
          color: C.faded,
          marginBottom: "16px",
          maxWidth: "640px",
          fontStyle: "italic",
        }}
      >
        {project.technical}
      </motion.div>

      {/* Tech tags */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.55, duration: 0.6 }}
        style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}
      >
        {project.tech.map((t) => (
          <span
            key={t}
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: "10px",
              padding: "4px 10px",
              border: `1px solid ${C.rope}`,
              borderRadius: "2px",
              color: C.seaDark,
              background: "rgba(46,139,143,0.05)",
              letterSpacing: "0.05em",
            }}
          >
            {t}
          </span>
        ))}
      </motion.div>

      {/* GitHub link */}
      <motion.a
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.6, duration: 0.6 }}
        href={project.github}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          fontFamily: "var(--font-jetbrains)",
          fontSize: "11px",
          color: C.sea,
          textDecoration: "none",
          letterSpacing: "0.05em",
          borderBottom: `1px dotted ${C.fadedLight}`,
          paddingBottom: "2px",
          transition: "color 0.3s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = C.brass)}
        onMouseLeave={(e) => (e.currentTarget.style.color = C.sea)}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
        View Chart
      </motion.a>
    </motion.div>
  );
}

/* ================================================================
   EXPERTISE SECTION — Navigation Instruments
   ================================================================ */
function ExpertiseCard({
  item,
  index,
}: {
  item: (typeof expertise)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const instrumentIcons = [
    /* Sextant */
    <svg key="sextant" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.brass} strokeWidth="1.2">
      <path d="M12 2L2 22h20L12 2z" />
      <circle cx="12" cy="16" r="4" />
      <line x1="12" y1="2" x2="12" y2="12" />
    </svg>,
    /* Telescope */
    <svg key="telescope" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.brass} strokeWidth="1.2">
      <rect x="2" y="10" width="20" height="4" rx="2" />
      <circle cx="22" cy="12" r="1.5" fill={C.brass} />
      <line x1="4" y1="14" x2="6" y2="22" />
      <line x1="10" y1="14" x2="8" y2="22" />
    </svg>,
    /* Astrolabe */
    <svg key="astrolabe" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.brass} strokeWidth="1.2">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
      <line x1="12" y1="2" x2="12" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
    </svg>,
    /* Chronometer */
    <svg key="chrono" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.brass} strokeWidth="1.2">
      <circle cx="12" cy="13" r="9" />
      <circle cx="12" cy="13" r="6" />
      <line x1="12" y1="7" x2="12" y2="13" />
      <line x1="12" y1="13" x2="16" y2="13" />
      <path d="M10 2h4" />
      <line x1="12" y1="2" x2="12" y2="4" />
    </svg>,
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      style={{
        border: `1px solid ${C.rope}`,
        borderRadius: "4px",
        padding: "28px 24px",
        background: `linear-gradient(135deg, ${C.parchmentLight} 0%, ${C.parchment} 100%)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Corner brass rivets */}
      {[
        { top: "6px", left: "6px" },
        { top: "6px", right: "6px" },
        { bottom: "6px", left: "6px" },
        { bottom: "6px", right: "6px" },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${C.brassLight} 0%, ${C.brass} 100%)`,
            opacity: 0.4,
            ...pos,
          }}
        />
      ))}

      <div style={{ marginBottom: "16px" }}>
        {instrumentIcons[index]}
      </div>
      <h3
        style={{
          fontFamily: "var(--font-dm-serif)",
          fontSize: "18px",
          color: C.navy,
          margin: "0 0 10px",
          lineHeight: 1.3,
        }}
      >
        {item.title}
      </h3>
      <p
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: "13px",
          lineHeight: 1.65,
          color: C.faded,
          margin: 0,
        }}
      >
        {item.body}
      </p>
    </motion.div>
  );
}

/* ================================================================
   TOOLS SECTION — Ship's Provisions
   ================================================================ */
function ToolCategory({
  category,
  index,
}: {
  category: (typeof tools)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      style={{ marginBottom: "28px" }}
    >
      {/* Category label with brass underline */}
      <div
        style={{
          fontFamily: "var(--font-dm-serif)",
          fontSize: "15px",
          color: C.navy,
          marginBottom: "10px",
          paddingBottom: "6px",
          borderBottom: `1px solid ${C.brassDim}`,
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <svg width="12" height="12" viewBox="0 0 16 16" fill={C.rope} opacity="0.6">
          <rect x="2" y="4" width="12" height="10" rx="2" />
          <path d="M5 4V2a3 3 0 0 1 6 0v2" fill="none" stroke={C.rope} strokeWidth="1.5" />
        </svg>
        {category.label}
      </div>

      {/* Items */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {category.items.map((item) => (
          <motion.span
            key={item}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1 + index * 0.05, duration: 0.4 }}
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: "11px",
              padding: "5px 12px",
              background: `linear-gradient(135deg, rgba(46,139,143,0.06), rgba(184,134,11,0.06))`,
              border: `1px solid ${C.fadedLight}`,
              borderRadius: "2px",
              color: C.ink,
              letterSpacing: "0.03em",
            }}
          >
            {item}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

/* ================================================================
   FOOTER
   ================================================================ */
function FooterSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <motion.footer
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8 }}
      style={{
        textAlign: "center",
        padding: "60px 24px 100px",
        position: "relative",
      }}
    >
      <RopeBorder />

      <div style={{ marginTop: "40px" }}>
        {/* Decorative compass */}
        <div
          style={{
            margin: "0 auto 20px",
            width: "48px",
            height: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="20" stroke={C.brass} strokeWidth="1" opacity="0.4" />
            <circle cx="24" cy="24" r="14" stroke={C.brass} strokeWidth="0.5" opacity="0.25" />
            <polygon points="24,4 26,22 24,24 22,22" fill={C.red} opacity="0.6" />
            <polygon points="24,44 26,26 24,24 22,26" fill={C.navy} opacity="0.4" />
            <polygon points="4,24 22,22 24,24 22,26" fill={C.faded} opacity="0.3" />
            <polygon points="44,24 26,22 24,24 26,26" fill={C.faded} opacity="0.3" />
            <circle cx="24" cy="24" r="2" fill={C.brass} opacity="0.6" />
          </svg>
        </div>

        <div
          style={{
            fontFamily: "var(--font-dm-serif)",
            fontSize: "22px",
            color: C.navy,
            marginBottom: "8px",
          }}
        >
          End of the Log
        </div>

        <div
          style={{
            fontFamily: "var(--font-dm-serif)",
            fontSize: "14px",
            fontStyle: "italic",
            color: C.faded,
            marginBottom: "16px",
          }}
        >
          &quot;There is nothing more enticing, disenchanting, and enslaving
          <br />
          than the life at sea.&quot;
        </div>

        <div
          style={{
            fontFamily: "var(--font-jetbrains)",
            fontSize: "10px",
            color: C.fadedLight,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          &mdash; Joseph Conrad
        </div>

        <div
          style={{
            marginTop: "30px",
            display: "flex",
            justifyContent: "center",
            gap: "24px",
          }}
        >
          <a
            href="https://github.com/1aday"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: "11px",
              color: C.sea,
              textDecoration: "none",
              letterSpacing: "0.05em",
              borderBottom: `1px dotted ${C.fadedLight}`,
              paddingBottom: "2px",
              transition: "color 0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.brass)}
            onMouseLeave={(e) => (e.currentTarget.style.color = C.sea)}
          >
            GitHub
          </a>
        </div>

        <div
          style={{
            marginTop: "24px",
            fontFamily: "var(--font-jetbrains)",
            fontSize: "9px",
            color: C.fadedLight,
            letterSpacing: "0.1em",
          }}
        >
          SURVEYED &amp; CHARTED &bull; ANNO {new Date().getFullYear()}
        </div>
      </div>
    </motion.footer>
  );
}

/* ================================================================
   MAIN PAGE COMPONENT
   ================================================================ */
export default function SextantPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div style={{ minHeight: "100vh", background: C.parchment }} />
    );
  }

  return (
    <div
      className="sextant-page nautical-grid"
      style={{
        minHeight: "100vh",
        background: C.parchment,
        color: C.ink,
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <NauticalStyles />
      <DepthSoundings />
      <LatLngMarkers />

      {/* ─── Hero ─── */}
      <HeroSection />

      {/* ─── Chart Legend ─── */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px 40px" }}>
        <ChartLegend />
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
        {/* ─── Rope Divider ─── */}
        <RopeBorder />

        {/* ─── Ship's Log: Projects ─── */}
        <section style={{ padding: "60px 0" }}>
          <SectionMarker label="Ship\u2019s Log \u2014 Ports of Call" />

          <div
            style={{
              fontFamily: "var(--font-dm-serif)",
              fontSize: "14px",
              fontStyle: "italic",
              color: C.faded,
              marginBottom: "40px",
              maxWidth: "560px",
            }}
          >
            A record of voyages undertaken, harbours reached, and charts drawn
            in service of the art of making machines think.
          </div>

          <div style={{ paddingLeft: "20px" }}>
            {projects.map((project, i) => (
              <LogEntry key={i} project={project} index={i} />
            ))}
          </div>
        </section>

        {/* ─── Rope Divider ─── */}
        <RopeBorder />

        {/* ─── Navigation Instruments: Expertise ─── */}
        <section style={{ padding: "60px 0" }}>
          <SectionMarker label="Navigation Instruments \u2014 Expertise" />

          <div
            style={{
              fontFamily: "var(--font-dm-serif)",
              fontSize: "14px",
              fontStyle: "italic",
              color: C.faded,
              marginBottom: "36px",
              maxWidth: "480px",
            }}
          >
            The instruments by which we navigate uncharted waters
            and bring safe harbour to complex endeavours.
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {expertise.map((item, i) => (
              <ExpertiseCard key={i} item={item} index={i} />
            ))}
          </div>
        </section>

        {/* ─── Rope Divider ─── */}
        <RopeBorder />

        {/* ─── Ship's Provisions: Tools ─── */}
        <section style={{ padding: "60px 0" }}>
          <SectionMarker label="Ship\u2019s Provisions \u2014 Tools" />

          <div
            style={{
              fontFamily: "var(--font-dm-serif)",
              fontSize: "14px",
              fontStyle: "italic",
              color: C.faded,
              marginBottom: "36px",
              maxWidth: "460px",
            }}
          >
            Provisions and materiel stowed aboard for the voyage,
            each chosen for reliability under all conditions.
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "16px 40px",
            }}
          >
            {tools.map((category, i) => (
              <ToolCategory key={i} category={category} index={i} />
            ))}
          </div>
        </section>
      </div>

      {/* ─── Footer ─── */}
      <FooterSection />

      {/* ─── Theme Switcher ─── */}
      <ThemeSwitcher current="/sextant" variant="light" />
    </div>
  );
}
