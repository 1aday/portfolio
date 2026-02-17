"use client";

import { projects, stats, expertise, tools } from "@/app/data/projects";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";
import { motion, useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";

/* ================================================================
   CORSAIR — Pirate Treasure Cartography Portfolio
   Colors: Parchment #F0DEB4 | Burnt #8B4513 | Gold #C4963A
           Sea #1B3A4B | Ink #2C1810 | Blood #8B0000
           Forest #2D5A27
   ================================================================ */

const C = {
  parchment: "#F0DEB4",
  parchmentLight: "#F7EACA",
  parchmentDark: "#E0CC9A",
  burnt: "#8B4513",
  burntLight: "#A0592A",
  burntDim: "rgba(139,69,19,0.2)",
  gold: "#C4963A",
  goldLight: "#D4AC5A",
  goldDim: "rgba(196,150,58,0.15)",
  goldGlow: "rgba(196,150,58,0.35)",
  sea: "#1B3A4B",
  seaLight: "#2A5468",
  seaDark: "#0F2330",
  ink: "#2C1810",
  inkLight: "#4A3528",
  inkFaded: "rgba(44,24,16,0.5)",
  blood: "#8B0000",
  bloodLight: "#A52A2A",
  forest: "#2D5A27",
  forestLight: "#3E7A35",
  rope: "#B89A6A",
  ropeLight: "#C8AA7A",
};

/* ─── Treasure map coordinates for each project ─── */
const mapCoords = [
  { lat: "23°42'N", lng: "75°18'W", island: "Isla del Reloj", region: "Caribbean Sea" },
  { lat: "18°15'N", lng: "64°53'W", island: "Porto Visión", region: "Virgin Isles" },
  { lat: "15°24'N", lng: "61°26'W", island: "Isla Capitán", region: "Windward Passage" },
  { lat: "12°07'N", lng: "68°56'W", island: "Themeify Cay", region: "Leeward Antilles" },
  { lat: "9°58'N", lng: "76°15'W", island: "Bahía Vector", region: "Darién Gulf" },
  { lat: "21°28'N", lng: "71°08'W", island: "Isla Interior", region: "Turks & Caicos" },
  { lat: "17°45'N", lng: "77°23'W", island: "Porto Voz", region: "Jamaican Waters" },
  { lat: "14°36'N", lng: "61°04'W", island: "Monte Análisis", region: "Martinique Strait" },
  { lat: "19°50'N", lng: "72°42'W", island: "Isla Métrica", region: "Hispaniola Coast" },
  { lat: "16°15'N", lng: "86°30'W", island: "Cayo Creativo", region: "Bay of Honduras" },
];

/* ─── Treasure value labels ─── */
const treasureValues = [
  "800 Doubloons", "1200 Doubloons", "650 Doubloons", "900 Doubloons", "750 Doubloons",
  "1100 Doubloons", "500 Doubloons", "950 Doubloons", "850 Doubloons", "1050 Doubloons",
];

/* ================================================================
   GLOBAL STYLES — Injected once
   ================================================================ */
function CorsairStyles() {
  return (
    <style>{`
      @keyframes compassSpin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes compassNeedleSwing {
        0% { transform: rotate(-15deg); }
        25% { transform: rotate(10deg); }
        50% { transform: rotate(-5deg); }
        75% { transform: rotate(3deg); }
        100% { transform: rotate(0deg); }
      }
      @keyframes waveRoll {
        0% { transform: translateX(0) translateY(0); }
        25% { transform: translateX(-5px) translateY(3px); }
        50% { transform: translateX(0) translateY(0); }
        75% { transform: translateX(5px) translateY(-3px); }
        100% { transform: translateX(0) translateY(0); }
      }
      @keyframes treasureBounce {
        0% { transform: scale(1); }
        30% { transform: scale(1.15); }
        50% { transform: scale(0.95); }
        70% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      @keyframes parchmentEdgeCurl {
        0% { transform: scaleX(1); opacity: 0.6; }
        50% { transform: scaleX(1.02); opacity: 0.8; }
        100% { transform: scaleX(1); opacity: 0.6; }
      }
      @keyframes flickerGlow {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 1; }
      }
      @keyframes skullFloat {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-6px) rotate(3deg); }
      }
      @keyframes dashDraw {
        to { stroke-dashoffset: 0; }
      }
      @keyframes tentacleWave {
        0%, 100% { transform: rotate(0deg) scaleX(1); }
        25% { transform: rotate(3deg) scaleX(1.02); }
        50% { transform: rotate(-2deg) scaleX(0.98); }
        75% { transform: rotate(1deg) scaleX(1.01); }
      }
      @keyframes xPulse {
        0%, 100% { opacity: 0.8; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.1); }
      }
      @keyframes anchorSwing {
        0%, 100% { transform: rotate(-5deg); }
        50% { transform: rotate(5deg); }
      }

      .corsair-page {
        background: ${C.parchment};
        color: ${C.ink};
        min-height: 100vh;
        overflow-x: hidden;
        position: relative;
      }
      .corsair-page * { box-sizing: border-box; }

      /* Parchment texture overlay */
      .corsair-page::before {
        content: '';
        position: fixed;
        inset: 0;
        background:
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            rgba(139,69,19,0.015) 3px,
            rgba(139,69,19,0.015) 4px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 3px,
            rgba(139,69,19,0.01) 3px,
            rgba(139,69,19,0.01) 4px
          );
        pointer-events: none;
        z-index: 1;
      }

      /* Age stain spots */
      .corsair-page::after {
        content: '';
        position: fixed;
        inset: 0;
        background:
          radial-gradient(ellipse 400px 300px at 15% 25%, rgba(139,69,19,0.06), transparent),
          radial-gradient(ellipse 300px 400px at 80% 60%, rgba(139,69,19,0.04), transparent),
          radial-gradient(ellipse 250px 200px at 50% 80%, rgba(139,69,19,0.05), transparent),
          radial-gradient(ellipse 200px 250px at 30% 50%, rgba(44,24,16,0.03), transparent);
        pointer-events: none;
        z-index: 1;
      }

      /* Scrollbar */
      .corsair-page::-webkit-scrollbar { width: 8px; }
      .corsair-page::-webkit-scrollbar-track { background: ${C.parchmentDark}; }
      .corsair-page::-webkit-scrollbar-thumb {
        background: ${C.burnt};
        border-radius: 4px;
      }
    `}</style>
  );
}

/* ================================================================
   SVG COMPONENTS
   ================================================================ */

/* Ornate 8-point Compass Rose */
function CompassRose({ size = 200, spinning = false }: { size?: number; spinning?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      style={spinning ? { animation: "compassSpin 20s linear infinite" } : undefined}
    >
      {/* Outer decorative ring */}
      <circle cx="100" cy="100" r="95" stroke={C.burnt} strokeWidth="1.5" fill="none" />
      <circle cx="100" cy="100" r="90" stroke={C.gold} strokeWidth="0.5" fill="none" />
      <circle cx="100" cy="100" r="85" stroke={C.burnt} strokeWidth="0.5" fill="none" strokeDasharray="4 3" />

      {/* Degree tick marks */}
      {Array.from({ length: 36 }).map((_, i) => {
        const angle = (i * 10 * Math.PI) / 180;
        const r1 = i % 9 === 0 ? 78 : 82;
        const r2 = 88;
        return (
          <line
            key={i}
            x1={100 + r1 * Math.sin(angle)}
            y1={100 - r1 * Math.cos(angle)}
            x2={100 + r2 * Math.sin(angle)}
            y2={100 - r2 * Math.cos(angle)}
            stroke={i % 9 === 0 ? C.gold : C.burnt}
            strokeWidth={i % 9 === 0 ? 1.5 : 0.5}
          />
        );
      })}

      {/* Cardinal direction labels */}
      <text x="100" y="22" textAnchor="middle" fill={C.blood} fontSize="14" fontWeight="bold" fontFamily="var(--font-dm-serif)">N</text>
      <text x="100" y="190" textAnchor="middle" fill={C.ink} fontSize="12" fontFamily="var(--font-dm-serif)">S</text>
      <text x="185" y="104" textAnchor="middle" fill={C.ink} fontSize="12" fontFamily="var(--font-dm-serif)">E</text>
      <text x="16" y="104" textAnchor="middle" fill={C.ink} fontSize="12" fontFamily="var(--font-dm-serif)">W</text>

      {/* Intercardinal labels */}
      <text x="158" y="45" textAnchor="middle" fill={C.inkFaded} fontSize="8" fontFamily="var(--font-inter)">NE</text>
      <text x="158" y="162" textAnchor="middle" fill={C.inkFaded} fontSize="8" fontFamily="var(--font-inter)">SE</text>
      <text x="42" y="162" textAnchor="middle" fill={C.inkFaded} fontSize="8" fontFamily="var(--font-inter)">SW</text>
      <text x="42" y="45" textAnchor="middle" fill={C.inkFaded} fontSize="8" fontFamily="var(--font-inter)">NW</text>

      {/* Main 4-point star (cardinal) */}
      <polygon points="100,28 108,92 100,82 92,92" fill={C.blood} /> {/* N - red */}
      <polygon points="100,172 108,108 100,118 92,108" fill={C.ink} /> {/* S */}
      <polygon points="172,100 108,92 118,100 108,108" fill={C.ink} /> {/* E */}
      <polygon points="28,100 92,92 82,100 92,108" fill={C.ink} /> {/* W */}

      {/* Shadow sides of cardinal points */}
      <polygon points="100,28 100,82 108,92" fill={C.burnt} opacity="0.6" />
      <polygon points="100,172 100,118 92,108" fill={C.inkLight} opacity="0.5" />
      <polygon points="172,100 118,100 108,92" fill={C.inkLight} opacity="0.5" />
      <polygon points="28,100 82,100 92,108" fill={C.inkLight} opacity="0.5" />

      {/* 4-point star (intercardinal) */}
      <polygon points="150,50 112,90 108,95 110,88" fill={C.gold} />
      <polygon points="150,150 112,110 108,105 110,112" fill={C.gold} opacity="0.8" />
      <polygon points="50,150 88,110 92,105 90,112" fill={C.gold} opacity="0.8" />
      <polygon points="50,50 88,90 92,95 90,88" fill={C.gold} />

      {/* Center hub */}
      <circle cx="100" cy="100" r="8" fill={C.gold} />
      <circle cx="100" cy="100" r="6" fill={C.parchment} />
      <circle cx="100" cy="100" r="3" fill={C.burnt} />

      {/* Fleur-de-lis at North */}
      <path
        d="M100,30 C98,34 96,36 96,38 C96,40 98,40 100,42 C102,40 104,40 104,38 C104,36 102,34 100,30Z"
        fill={C.blood}
        opacity="0.6"
      />
    </svg>
  );
}

/* Sea Serpent / Kraken Tentacle */
function KrakenTentacle({ side = "left", size = 120 }: { side?: "left" | "right"; size?: number }) {
  const flip = side === "right";
  return (
    <svg
      width={size}
      height={size * 2}
      viewBox="0 0 120 240"
      fill="none"
      style={{
        transform: flip ? "scaleX(-1)" : undefined,
        animation: "tentacleWave 6s ease-in-out infinite",
      }}
    >
      <path
        d="M10,240 C10,200 30,180 25,150 C20,120 40,100 35,70 C30,40 50,20 60,10 C65,5 70,8 68,15 C66,22 55,45 55,70 C55,90 45,110 48,140 C51,170 35,190 38,210 C40,225 30,235 20,240"
        stroke={C.sea}
        strokeWidth="3"
        fill="none"
        opacity="0.25"
      />
      <path
        d="M20,240 C20,205 38,185 33,158 C28,130 48,108 43,80 C38,52 55,32 65,18"
        stroke={C.seaLight}
        strokeWidth="2"
        fill="none"
        opacity="0.15"
      />
      {/* Suction cups */}
      {[160, 130, 100, 75, 55].map((y, i) => (
        <circle key={i} cx={35 + i * 3} cy={y} r={4 - i * 0.5} fill={C.sea} opacity={0.12 - i * 0.015} />
      ))}
    </svg>
  );
}

/* Treasure Chest Icon */
function TreasureChestIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      {/* Chest body */}
      <rect x="4" y="13" width="20" height="11" rx="1" fill={C.burnt} stroke={C.ink} strokeWidth="0.8" />
      {/* Chest lid */}
      <path d="M3,13 L14,6 L25,13 Z" fill={C.burntLight} stroke={C.ink} strokeWidth="0.8" />
      {/* Metal bands */}
      <rect x="4" y="16" width="20" height="1.5" fill={C.gold} opacity="0.7" />
      <rect x="4" y="20" width="20" height="1.5" fill={C.gold} opacity="0.7" />
      {/* Lock */}
      <circle cx="14" cy="18" r="2.5" fill={C.gold} stroke={C.ink} strokeWidth="0.5" />
      <rect x="13" y="18" width="2" height="3" rx="0.5" fill={C.gold} />
    </svg>
  );
}

/* Anchor Icon */
function AnchorIcon({ size = 24, color = C.gold }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ animation: "anchorSwing 4s ease-in-out infinite" }}>
      <circle cx="12" cy="5" r="2.5" stroke={color} strokeWidth="1.5" fill="none" />
      <line x1="12" y1="7.5" x2="12" y2="20" stroke={color} strokeWidth="1.5" />
      <path d="M12,20 C12,20 6,18 5,13" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M12,20 C12,20 18,18 19,13" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <line x1="8" y1="11" x2="16" y2="11" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="5" cy="13" r="1" fill={color} />
      <circle cx="19" cy="13" r="1" fill={color} />
    </svg>
  );
}

/* Ship Wheel Icon */
function ShipWheel({ size = 32, color = C.gold }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="12" stroke={color} strokeWidth="1.5" fill="none" />
      <circle cx="16" cy="16" r="4" stroke={color} strokeWidth="1.5" fill="none" />
      {/* Spokes */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 45 * Math.PI) / 180;
        return (
          <line
            key={i}
            x1={16 + 4 * Math.cos(angle)}
            y1={16 + 4 * Math.sin(angle)}
            x2={16 + 12 * Math.cos(angle)}
            y2={16 + 12 * Math.sin(angle)}
            stroke={color}
            strokeWidth="1.5"
          />
        );
      })}
      {/* Handle pegs */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 45 * Math.PI) / 180;
        return (
          <line
            key={`h${i}`}
            x1={16 + 12 * Math.cos(angle)}
            y1={16 + 12 * Math.sin(angle)}
            x2={16 + 15 * Math.cos(angle)}
            y2={16 + 15 * Math.sin(angle)}
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

/* Crossed Swords Icon */
function CrossedSwords({ size = 24, color = C.ink }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <line x1="3" y1="3" x2="21" y2="21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="21" y1="3" x2="3" y2="21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      {/* Guards */}
      <line x1="5" y1="8" x2="8" y2="5" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="16" y1="5" x2="19" y2="8" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      {/* Pommels */}
      <circle cx="3" cy="3" r="1.5" fill={color} />
      <circle cx="21" cy="3" r="1.5" fill={color} />
    </svg>
  );
}

/* Skull and Crossbones */
function SkullAndCrossbones({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={{ animation: "skullFloat 5s ease-in-out infinite" }}>
      {/* Skull */}
      <ellipse cx="24" cy="18" rx="12" ry="14" fill={C.parchment} stroke={C.ink} strokeWidth="1.5" />
      {/* Eyes */}
      <ellipse cx="19" cy="16" rx="3" ry="3.5" fill={C.ink} />
      <ellipse cx="29" cy="16" rx="3" ry="3.5" fill={C.ink} />
      {/* Eye highlights */}
      <ellipse cx="18" cy="15" rx="1" ry="1.2" fill={C.parchment} opacity="0.4" />
      <ellipse cx="28" cy="15" rx="1" ry="1.2" fill={C.parchment} opacity="0.4" />
      {/* Nose */}
      <path d="M22,21 L24,24 L26,21" stroke={C.ink} strokeWidth="1.2" fill="none" />
      {/* Jaw */}
      <path d="M16,26 Q24,32 32,26" stroke={C.ink} strokeWidth="1.2" fill="none" />
      {/* Teeth */}
      {[18, 21, 24, 27, 30].map((x, i) => (
        <line key={i} x1={x} y1="26" x2={x} y2={28 + (i === 2 ? 1 : 0)} stroke={C.ink} strokeWidth="0.8" />
      ))}
      {/* Crossbones */}
      <line x1="6" y1="36" x2="42" y2="44" stroke={C.parchment} strokeWidth="3" strokeLinecap="round" />
      <line x1="42" y1="36" x2="6" y2="44" stroke={C.parchment} strokeWidth="3" strokeLinecap="round" />
      <line x1="6" y1="36" x2="42" y2="44" stroke={C.ink} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="42" y1="36" x2="6" y2="44" stroke={C.ink} strokeWidth="1.5" strokeLinecap="round" />
      {/* Bone ends */}
      {[[6,36],[42,36],[6,44],[42,44]].map(([cx,cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="2.5" fill={C.parchment} stroke={C.ink} strokeWidth="1" />
      ))}
    </svg>
  );
}

/* Map Scale Ruler */
function MapScaleRuler() {
  return (
    <svg width="200" height="30" viewBox="0 0 200 30" fill="none">
      <line x1="10" y1="15" x2="190" y2="15" stroke={C.ink} strokeWidth="1" />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <line x1={10 + i * 45} y1="10" x2={10 + i * 45} y2="20" stroke={C.ink} strokeWidth="1" />
          <text x={10 + i * 45} y="28" textAnchor="middle" fill={C.ink} fontSize="7" fontFamily="var(--font-jetbrains)">{i * 50}</text>
        </g>
      ))}
      <text x="100" y="8" textAnchor="middle" fill={C.inkFaded} fontSize="6" fontFamily="var(--font-inter)">NAUTICAL LEAGUES</text>
    </svg>
  );
}

/* Dashed Treasure Trail SVG */
function TreasureTrailSVG() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <svg
      ref={ref}
      width="100%"
      height="100%"
      viewBox="0 0 100 2600"
      fill="none"
      preserveAspectRatio="none"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <motion.path
        d="M50,0 C25,130 75,260 40,390 C5,520 90,650 60,780 C30,910 70,1040 45,1170 C20,1300 80,1430 55,1560 C30,1690 70,1820 50,1950 C30,2080 65,2210 50,2340 L50,2600"
        stroke={C.gold}
        strokeWidth="2"
        strokeDasharray="12 8"
        fill="none"
        opacity={0.4}
        initial={{ strokeDashoffset: 3000 }}
        animate={inView ? { strokeDashoffset: 0 } : { strokeDashoffset: 3000 }}
        transition={{ duration: 5, ease: "easeInOut" }}
      />
      <motion.path
        d="M50,0 C25,130 75,260 40,390 C5,520 90,650 60,780 C30,910 70,1040 45,1170 C20,1300 80,1430 55,1560 C30,1690 70,1820 50,1950 C30,2080 65,2210 50,2340 L50,2600"
        stroke={C.burnt}
        strokeWidth="1"
        strokeDasharray="6 12"
        fill="none"
        opacity={0.2}
        initial={{ strokeDashoffset: 2000 }}
        animate={inView ? { strokeDashoffset: 0 } : { strokeDashoffset: 2000 }}
        transition={{ duration: 4, ease: "easeInOut", delay: 0.5 }}
      />
    </svg>
  );
}

/* Burnt Parchment Edge Effect */
function BurntEdge({ position }: { position: "top" | "bottom" }) {
  const isTop = position === "top";
  return (
    <div
      style={{
        position: "absolute",
        [isTop ? "top" : "bottom"]: 0,
        left: 0,
        right: 0,
        height: 60,
        zIndex: 2,
        pointerEvents: "none",
        animation: "parchmentEdgeCurl 8s ease-in-out infinite",
      }}
    >
      <svg width="100%" height="60" viewBox="0 0 1200 60" preserveAspectRatio="none" fill="none">
        <path
          d={isTop
            ? "M0,0 L1200,0 L1200,20 C1150,35 1100,15 1050,30 C1000,45 950,25 900,35 C850,45 800,20 750,30 C700,40 650,15 600,25 C550,35 500,20 450,30 C400,40 350,25 300,35 C250,45 200,20 150,30 C100,40 50,25 0,35 Z"
            : "M0,60 L1200,60 L1200,40 C1150,25 1100,45 1050,30 C1000,15 950,35 900,25 C850,15 800,40 750,30 C700,20 650,45 600,35 C550,25 500,40 450,30 C400,20 350,35 300,25 C250,15 200,40 150,30 C100,20 50,35 0,25 Z"
          }
          fill={C.burnt}
          opacity="0.4"
        />
        <path
          d={isTop
            ? "M0,0 L1200,0 L1200,10 C1130,22 1060,8 990,18 C920,28 850,12 780,20 C710,28 640,10 570,18 C500,26 430,12 360,20 C290,28 220,10 150,18 C80,26 40,14 0,22 Z"
            : "M0,60 L1200,60 L1200,50 C1130,38 1060,52 990,42 C920,32 850,48 780,40 C710,32 640,50 570,42 C500,34 430,48 360,40 C290,32 220,50 150,42 C80,34 40,46 0,38 Z"
          }
          fill={C.ink}
          opacity="0.15"
        />
      </svg>
    </div>
  );
}

/* Rope Border */
function RopeBorder({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        position: "relative",
        border: `3px solid ${C.rope}`,
        borderRadius: 4,
        padding: "24px",
        ...style,
      }}
    >
      {/* Rope knot corners */}
      {["top-left", "top-right", "bottom-left", "bottom-right"].map((corner) => {
        const [v, h] = corner.split("-");
        return (
          <div
            key={corner}
            style={{
              position: "absolute",
              [v]: -6,
              [h]: -6,
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: C.rope,
              border: `2px solid ${C.burnt}`,
            }}
          />
        );
      })}
      {/* Double rope effect */}
      <div
        style={{
          position: "absolute",
          inset: 4,
          border: `1px solid ${C.ropeLight}`,
          borderRadius: 2,
          pointerEvents: "none",
          opacity: 0.4,
        }}
      />
      {children}
    </div>
  );
}

/* X Marks the Spot */
function XMark({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      style={{ animation: "xPulse 3s ease-in-out infinite" }}
    >
      <line x1="4" y1="4" x2="28" y2="28" stroke={C.blood} strokeWidth="4" strokeLinecap="round" />
      <line x1="28" y1="4" x2="4" y2="28" stroke={C.blood} strokeWidth="4" strokeLinecap="round" />
      <line x1="5" y1="5" x2="27" y2="27" stroke={C.bloodLight} strokeWidth="2" strokeLinecap="round" />
      <line x1="27" y1="5" x2="5" y2="27" stroke={C.bloodLight} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* Section wrapper with scroll reveal */
function MapSection({
  children,
  delay = 0,
  style = {},
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      style={{ position: "relative", ...style }}
    >
      {children}
    </motion.section>
  );
}

/* ================================================================
   HERO SECTION
   ================================================================ */
function HeroSection() {
  const [needleAngle, setNeedleAngle] = useState(-30);

  useEffect(() => {
    const timer = setTimeout(() => setNeedleAngle(0), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 24px",
        overflow: "hidden",
      }}
    >
      <BurntEdge position="top" />

      {/* Kraken tentacles at edges */}
      <div style={{ position: "absolute", left: -20, top: "20%", opacity: 0.3 }}>
        <KrakenTentacle side="left" size={100} />
      </div>
      <div style={{ position: "absolute", right: -20, top: "35%", opacity: 0.3 }}>
        <KrakenTentacle side="right" size={80} />
      </div>

      {/* "Here Be Dragons" top text */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        style={{
          fontFamily: "var(--font-instrument)",
          fontSize: 14,
          color: C.burnt,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          marginBottom: 24,
          textAlign: "center",
        }}
      >
        ~ Here Be Dragons ~
      </motion.div>

      {/* Map cartouche / title block */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        style={{
          position: "relative",
          textAlign: "center",
          padding: "40px 60px",
          border: `2px solid ${C.burnt}`,
          borderRadius: 8,
          background: `linear-gradient(135deg, ${C.parchmentLight}, ${C.parchment})`,
          boxShadow: `inset 0 0 30px ${C.burntDim}, 0 4px 20px rgba(0,0,0,0.1)`,
          maxWidth: 700,
        }}
      >
        {/* Decorative corner flourishes */}
        {[
          { top: 8, left: 8 },
          { top: 8, right: 8 },
          { bottom: 8, left: 8 },
          { bottom: 8, right: 8 },
        ].map((pos, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              ...pos,
              width: 20,
              height: 20,
              borderTop: i < 2 ? `2px solid ${C.gold}` : undefined,
              borderBottom: i >= 2 ? `2px solid ${C.gold}` : undefined,
              borderLeft: i % 2 === 0 ? `2px solid ${C.gold}` : undefined,
              borderRight: i % 2 === 1 ? `2px solid ${C.gold}` : undefined,
            }}
          />
        ))}

        <div
          style={{
            fontFamily: "var(--font-instrument)",
            fontSize: 13,
            color: C.burnt,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          A Charting of the Works of
        </div>

        <h1
          style={{
            fontFamily: "var(--font-dm-serif)",
            fontSize: "clamp(36px, 6vw, 64px)",
            color: C.ink,
            lineHeight: 1.1,
            margin: "8px 0",
            letterSpacing: "-0.01em",
          }}
        >
          TREASURE MAP
        </h1>

        <div
          style={{
            fontFamily: "var(--font-dm-serif)",
            fontSize: "clamp(16px, 2.5vw, 22px)",
            color: C.burnt,
            fontStyle: "italic",
            margin: "4px 0 16px",
          }}
        >
          of Captain Grox&apos;s Expeditions
        </div>

        {/* Decorative divider */}
        <svg width="200" height="12" viewBox="0 0 200 12" fill="none" style={{ margin: "8px auto" }}>
          <line x1="10" y1="6" x2="80" y2="6" stroke={C.gold} strokeWidth="1" />
          <circle cx="100" cy="6" r="4" fill="none" stroke={C.gold} strokeWidth="1" />
          <circle cx="100" cy="6" r="1.5" fill={C.gold} />
          <line x1="120" y1="6" x2="190" y2="6" stroke={C.gold} strokeWidth="1" />
        </svg>

        <div
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: 13,
            color: C.inkFaded,
            marginTop: 8,
            lineHeight: 1.6,
          }}
        >
          Documenting AI-powered expeditions across uncharted digital waters
        </div>
      </motion.div>

      {/* Compass Rose */}
      <motion.div
        initial={{ opacity: 0, rotate: -90 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
        style={{ marginTop: 40, position: "relative" }}
      >
        <CompassRose size={180} />
        {/* Animated needle overlay */}
        <motion.div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 2,
            height: 60,
            background: C.blood,
            transformOrigin: "bottom center",
            marginLeft: -1,
            marginTop: -60,
          }}
          initial={{ rotate: -30 }}
          animate={{ rotate: needleAngle }}
          transition={{ duration: 2, type: "spring", stiffness: 30, damping: 8 }}
        />
      </motion.div>

      {/* Stats as coordinates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        style={{
          display: "flex",
          gap: 48,
          marginTop: 40,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {stats.map((stat, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: 11,
                color: C.burnt,
                letterSpacing: "0.15em",
                marginBottom: 4,
              }}
            >
              {i === 0 ? "LAT 23\u00b042'N" : i === 1 ? "LNG 75\u00b018'W" : "DEPTH 120FM"}
            </div>
            <div
              style={{
                fontFamily: "var(--font-dm-serif)",
                fontSize: 32,
                color: C.gold,
                lineHeight: 1,
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: 12,
                color: C.inkFaded,
                marginTop: 4,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Map scale */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        style={{ marginTop: 32, opacity: 0.6 }}
      >
        <MapScaleRuler />
      </motion.div>

      <BurntEdge position="bottom" />
    </section>
  );
}

/* ================================================================
   PROJECT CARD — Treasure Island Location
   ================================================================ */
function ProjectCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const isEven = index % 2 === 0;
  const coord = mapCoords[index];
  const title = project.title.replace("\n", " ");

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isEven ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? -40 : 40 }}
      transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
      style={{
        display: "grid",
        gridTemplateColumns: isEven ? "auto 1fr" : "1fr auto",
        gap: 24,
        alignItems: "start",
        marginBottom: 48,
        position: "relative",
      }}
    >
      {/* Waypoint marker */}
      <div
        style={{
          order: isEven ? 0 : 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          minWidth: 60,
          paddingTop: 8,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-jetbrains)",
            fontSize: 10,
            color: C.burnt,
            letterSpacing: "0.15em",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </div>
        <motion.div
          animate={inView ? { scale: [0, 1.2, 1] } : { scale: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <XMark size={28} />
        </motion.div>
        <div
          style={{
            fontFamily: "var(--font-jetbrains)",
            fontSize: 8,
            color: C.inkFaded,
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          {coord.lat}
          <br />
          {coord.lng}
        </div>
      </div>

      {/* Scroll-style description panel */}
      <div
        style={{
          order: isEven ? 1 : 0,
          background: `linear-gradient(145deg, ${C.parchmentLight}, ${C.parchment})`,
          border: `1.5px solid ${C.burnt}`,
          borderRadius: 4,
          padding: "20px 24px",
          position: "relative",
          boxShadow: `inset 0 0 20px ${C.burntDim}, 2px 3px 10px rgba(0,0,0,0.08)`,
        }}
      >
        {/* Scroll roll top */}
        <div
          style={{
            position: "absolute",
            top: -4,
            left: 8,
            right: 8,
            height: 8,
            background: `linear-gradient(to bottom, ${C.burnt}, transparent)`,
            borderRadius: "4px 4px 0 0",
            opacity: 0.15,
          }}
        />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <TreasureChestIcon size={20} />
              <h3
                style={{
                  fontFamily: "var(--font-dm-serif)",
                  fontSize: 18,
                  color: C.ink,
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                {title}
              </h3>
            </div>
            <div
              style={{
                fontFamily: "var(--font-instrument)",
                fontSize: 13,
                color: C.gold,
                fontStyle: "italic",
              }}
            >
              {coord.island} &mdash; {coord.region}
            </div>
          </div>

          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: 10,
                color: C.burnt,
                opacity: 0.7,
              }}
            >
              {project.year}
            </div>
            <div
              style={{
                fontFamily: "var(--font-instrument)",
                fontSize: 10,
                color: C.gold,
                marginTop: 2,
              }}
            >
              {treasureValues[index]}
            </div>
          </div>
        </div>

        {/* Client badge */}
        <div
          style={{
            display: "inline-block",
            fontFamily: "var(--font-inter)",
            fontSize: 10,
            color: C.sea,
            background: `rgba(27,58,75,0.08)`,
            padding: "2px 8px",
            borderRadius: 2,
            border: `1px solid rgba(27,58,75,0.15)`,
            marginBottom: 10,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          {project.client}
        </div>

        {/* Description */}
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: 13,
            color: C.inkLight,
            lineHeight: 1.7,
            margin: "0 0 10px",
          }}
        >
          {project.description}
        </p>

        {/* Technical detail */}
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: 12,
            color: C.inkFaded,
            lineHeight: 1.6,
            margin: "0 0 12px",
            fontStyle: "italic",
          }}
        >
          {project.technical}
        </p>

        {/* Tech tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
          {project.tech.map((t) => (
            <span
              key={t}
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: 10,
                color: C.burnt,
                background: C.goldDim,
                padding: "3px 8px",
                borderRadius: 2,
                border: `1px solid ${C.gold}40`,
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
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: 10,
              color: C.sea,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              borderBottom: `1px dashed ${C.sea}40`,
              paddingBottom: 1,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill={C.sea}>
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            View Chart
          </a>
        )}

        {/* Scroll roll bottom */}
        <div
          style={{
            position: "absolute",
            bottom: -4,
            left: 8,
            right: 8,
            height: 8,
            background: `linear-gradient(to top, ${C.burnt}, transparent)`,
            borderRadius: "0 0 4px 4px",
            opacity: 0.12,
          }}
        />
      </div>
    </motion.div>
  );
}

/* ================================================================
   PROJECTS SECTION
   ================================================================ */
function ProjectsSection() {
  return (
    <MapSection style={{ padding: "80px 24px", maxWidth: 820, margin: "0 auto" }}>
      {/* Section header */}
      <div style={{ textAlign: "center", marginBottom: 48, position: "relative" }}>
        <div
          style={{
            fontFamily: "var(--font-instrument)",
            fontSize: 12,
            color: C.burnt,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          The Treasure Trail
        </div>
        <h2
          style={{
            fontFamily: "var(--font-dm-serif)",
            fontSize: "clamp(28px, 4vw, 40px)",
            color: C.ink,
            margin: 0,
          }}
        >
          Expedition Waypoints
        </h2>
        <svg width="120" height="8" viewBox="0 0 120 8" fill="none" style={{ margin: "12px auto 0" }}>
          <line x1="0" y1="4" x2="50" y2="4" stroke={C.gold} strokeWidth="1" />
          <circle cx="60" cy="4" r="3" fill="none" stroke={C.gold} strokeWidth="1" />
          <line x1="70" y1="4" x2="120" y2="4" stroke={C.gold} strokeWidth="1" />
        </svg>
        <div
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: 13,
            color: C.inkFaded,
            marginTop: 12,
          }}
        >
          10 charted locations &mdash; Follow the dashed trail to hidden riches
        </div>
      </div>

      {/* Treasure trail and project cards */}
      <div style={{ position: "relative" }}>
        <TreasureTrailSVG />
        <div style={{ position: "relative", zIndex: 1 }}>
          {projects.map((project, i) => (
            <ProjectCard key={i} project={project} index={i} />
          ))}
        </div>
      </div>
    </MapSection>
  );
}

/* ================================================================
   EXPERTISE SECTION — Islands of Knowledge
   ================================================================ */
function ExpertiseSection() {
  const islandColors = [C.forest, C.sea, C.burnt, C.gold];
  const islandNames = ["Isle of Orchestration", "Isle of Vision", "Isle of Media", "Isle of Craft"];

  return (
    <MapSection style={{ padding: "80px 24px", maxWidth: 900, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div
          style={{
            fontFamily: "var(--font-instrument)",
            fontSize: 12,
            color: C.burnt,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          Known Territories
        </div>
        <h2
          style={{
            fontFamily: "var(--font-dm-serif)",
            fontSize: "clamp(28px, 4vw, 40px)",
            color: C.ink,
            margin: 0,
          }}
        >
          Islands of Knowledge
        </h2>
        <svg width="120" height="8" viewBox="0 0 120 8" fill="none" style={{ margin: "12px auto 0" }}>
          <line x1="0" y1="4" x2="50" y2="4" stroke={C.gold} strokeWidth="1" />
          <circle cx="60" cy="4" r="3" fill="none" stroke={C.gold} strokeWidth="1" />
          <line x1="70" y1="4" x2="120" y2="4" stroke={C.gold} strokeWidth="1" />
        </svg>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 28,
        }}
      >
        {expertise.map((exp, i) => {
          const ref = useRef(null);
          const inView = useInView(ref, { once: true, margin: "-40px" });
          const clr = islandColors[i];

          return (
            <motion.div
              key={i}
              ref={ref}
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.96 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              style={{
                background: `linear-gradient(145deg, ${C.parchmentLight}, ${C.parchment})`,
                border: `1.5px solid ${C.burnt}`,
                borderRadius: 6,
                padding: 24,
                position: "relative",
                boxShadow: `inset 0 0 20px ${C.burntDim}, 2px 3px 12px rgba(0,0,0,0.06)`,
              }}
            >
              {/* Island illustration */}
              <svg width="100%" height="60" viewBox="0 0 260 60" fill="none" style={{ marginBottom: 16 }}>
                {/* Water */}
                <path
                  d="M0,45 Q30,40 60,45 Q90,50 120,45 Q150,40 180,45 Q210,50 240,45 L260,45 L260,60 L0,60 Z"
                  fill={C.sea}
                  opacity="0.12"
                />
                {/* Island land mass */}
                <path
                  d={
                    i === 0
                      ? "M60,42 Q80,15 120,18 Q160,15 180,25 Q200,35 195,42 Z"
                      : i === 1
                      ? "M70,42 Q90,20 130,12 Q170,20 190,42 Z"
                      : i === 2
                      ? "M50,42 Q70,25 100,18 Q130,12 160,22 Q190,28 200,42 Z"
                      : "M80,42 Q100,10 140,15 Q180,10 190,25 Q195,35 192,42 Z"
                  }
                  fill={clr}
                  opacity="0.25"
                  stroke={clr}
                  strokeWidth="1"
                />
                {/* Palm tree or feature */}
                <line x1="130" y1="18" x2="130" y2="8" stroke={C.forest} strokeWidth="1.5" opacity="0.5" />
                <path d="M125,10 Q130,4 135,10" stroke={C.forest} strokeWidth="1" fill="none" opacity="0.4" />
                <path d="M123,12 Q130,6 137,12" stroke={C.forest} strokeWidth="1" fill="none" opacity="0.3" />
                {/* Waves */}
                <path
                  d="M10,50 Q25,47 40,50 Q55,53 70,50"
                  stroke={C.sea}
                  strokeWidth="0.8"
                  fill="none"
                  opacity="0.2"
                />
                <path
                  d="M170,52 Q185,49 200,52 Q215,55 230,52"
                  stroke={C.sea}
                  strokeWidth="0.8"
                  fill="none"
                  opacity="0.15"
                />
              </svg>

              {/* Island name label */}
              <div
                style={{
                  fontFamily: "var(--font-instrument)",
                  fontSize: 10,
                  color: clr,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                {islandNames[i]}
              </div>

              <h3
                style={{
                  fontFamily: "var(--font-dm-serif)",
                  fontSize: 18,
                  color: C.ink,
                  margin: "0 0 8px",
                  lineHeight: 1.3,
                }}
              >
                {exp.title}
              </h3>

              <p
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: 13,
                  color: C.inkLight,
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {exp.body}
              </p>

              {/* Compass in corner */}
              <div style={{ position: "absolute", top: 12, right: 12, opacity: 0.15 }}>
                <ShipWheel size={24} color={clr} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </MapSection>
  );
}

/* ================================================================
   TOOLS SECTION — Ship's Inventory Manifest
   ================================================================ */
function ToolsSection() {
  return (
    <MapSection style={{ padding: "80px 24px", maxWidth: 800, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div
          style={{
            fontFamily: "var(--font-instrument)",
            fontSize: 12,
            color: C.burnt,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          Ship&apos;s Manifest
        </div>
        <h2
          style={{
            fontFamily: "var(--font-dm-serif)",
            fontSize: "clamp(28px, 4vw, 40px)",
            color: C.ink,
            margin: 0,
          }}
        >
          Inventory &amp; Provisions
        </h2>
        <svg width="120" height="8" viewBox="0 0 120 8" fill="none" style={{ margin: "12px auto 0" }}>
          <line x1="0" y1="4" x2="50" y2="4" stroke={C.gold} strokeWidth="1" />
          <circle cx="60" cy="4" r="3" fill="none" stroke={C.gold} strokeWidth="1" />
          <line x1="70" y1="4" x2="120" y2="4" stroke={C.gold} strokeWidth="1" />
        </svg>
      </div>

      <RopeBorder
        style={{
          background: `linear-gradient(170deg, ${C.parchmentLight}, ${C.parchment}, ${C.parchmentDark})`,
          boxShadow: `inset 0 0 40px ${C.burntDim}`,
        }}
      >
        {/* Manifest heading */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 24,
            paddingBottom: 16,
            borderBottom: `1px solid ${C.burnt}30`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <AnchorIcon size={20} color={C.burnt} />
            <div
              style={{
                fontFamily: "var(--font-dm-serif)",
                fontSize: 16,
                color: C.ink,
                letterSpacing: "0.1em",
              }}
            >
              HMS PORTFOLIO &mdash; CARGO HOLD
            </div>
            <AnchorIcon size={20} color={C.burnt} />
          </div>
          <div
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: 10,
              color: C.inkFaded,
              marginTop: 4,
            }}
          >
            Manifest Date: Anno Domini 2025 &mdash; Last Port: Vercel Harbor
          </div>
        </div>

        {/* Tool categories as manifest entries */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 20,
          }}
        >
          {tools.map((cat, i) => {
            const ref = useRef(null);
            const inView = useInView(ref, { once: true, margin: "-30px" });

            return (
              <motion.div
                key={i}
                ref={ref}
                initial={{ opacity: 0, y: 15 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                {/* Category label */}
                <div
                  style={{
                    fontFamily: "var(--font-dm-serif)",
                    fontSize: 14,
                    color: C.gold,
                    marginBottom: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <circle cx="4" cy="4" r="3" fill={C.gold} opacity="0.6" />
                  </svg>
                  {cat.label}
                </div>

                {/* Items */}
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {cat.items.map((item) => (
                    <div
                      key={item}
                      style={{
                        fontFamily: "var(--font-inter)",
                        fontSize: 12,
                        color: C.inkLight,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        paddingLeft: 4,
                      }}
                    >
                      <span style={{ color: C.burnt, fontSize: 8, opacity: 0.6 }}>&bull;</span>
                      {item}
                    </div>
                  ))}
                </div>

                {/* Manifest line */}
                <div
                  style={{
                    marginTop: 8,
                    borderBottom: `1px dashed ${C.burnt}30`,
                    width: "100%",
                  }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Manifest footer */}
        <div
          style={{
            marginTop: 24,
            paddingTop: 16,
            borderTop: `1px solid ${C.burnt}30`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-instrument)",
              fontSize: 11,
              color: C.inkFaded,
              fontStyle: "italic",
            }}
          >
            &ldquo;A ship is safe in harbor, but that is not what ships are built for.&rdquo;
          </div>
          <div
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: 9,
              color: C.burnt,
              marginTop: 6,
              opacity: 0.5,
            }}
          >
            MANIFEST VERIFIED &mdash; QUARTERMASTER&apos;S SEAL
          </div>
        </div>
      </RopeBorder>
    </MapSection>
  );
}

/* ================================================================
   FOOTER — End of Map
   ================================================================ */
function FooterSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.footer
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 1 }}
      style={{
        position: "relative",
        padding: "80px 24px 120px",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      {/* Wave decoration at top */}
      <svg
        width="100%"
        height="40"
        viewBox="0 0 1200 40"
        preserveAspectRatio="none"
        fill="none"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          animation: "waveRoll 6s ease-in-out infinite",
        }}
      >
        <path
          d="M0,20 Q75,5 150,20 Q225,35 300,20 Q375,5 450,20 Q525,35 600,20 Q675,5 750,20 Q825,35 900,20 Q975,5 1050,20 Q1125,35 1200,20"
          stroke={C.sea}
          strokeWidth="1.5"
          fill="none"
          opacity="0.2"
        />
        <path
          d="M0,25 Q75,10 150,25 Q225,40 300,25 Q375,10 450,25 Q525,40 600,25 Q675,10 750,25 Q825,40 900,25 Q975,10 1050,25 Q1125,40 1200,25"
          stroke={C.sea}
          strokeWidth="1"
          fill="none"
          opacity="0.1"
        />
      </svg>

      {/* "END OF MAP" banner */}
      <div
        style={{
          display: "inline-block",
          padding: "16px 48px",
          border: `2px solid ${C.burnt}`,
          borderRadius: 4,
          position: "relative",
          marginBottom: 32,
          background: `linear-gradient(135deg, ${C.parchmentLight}, ${C.parchment})`,
          boxShadow: `inset 0 0 20px ${C.burntDim}`,
        }}
      >
        {/* Corner ornaments */}
        {[
          { top: 4, left: 4 },
          { top: 4, right: 4 },
          { bottom: 4, left: 4 },
          { bottom: 4, right: 4 },
        ].map((pos, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              ...pos,
              width: 12,
              height: 12,
              borderTop: i < 2 ? `1.5px solid ${C.gold}` : undefined,
              borderBottom: i >= 2 ? `1.5px solid ${C.gold}` : undefined,
              borderLeft: i % 2 === 0 ? `1.5px solid ${C.gold}` : undefined,
              borderRight: i % 2 === 1 ? `1.5px solid ${C.gold}` : undefined,
            }}
          />
        ))}
        <div
          style={{
            fontFamily: "var(--font-dm-serif)",
            fontSize: "clamp(20px, 3vw, 32px)",
            color: C.ink,
            letterSpacing: "0.15em",
          }}
        >
          END OF MAP
        </div>
      </div>

      {/* Skull and Crossbones */}
      <motion.div
        animate={inView ? { scale: [0, 1.1, 1] } : { scale: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        style={{ margin: "0 auto 24px" }}
      >
        <SkullAndCrossbones size={56} />
      </motion.div>

      {/* Captain's Log */}
      <div
        style={{
          fontFamily: "var(--font-instrument)",
          fontSize: 15,
          color: C.burnt,
          fontStyle: "italic",
          marginBottom: 8,
        }}
      >
        Captain Grox&apos;s Expedition Log
      </div>

      <div
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: 12,
          color: C.inkFaded,
          marginBottom: 24,
          lineHeight: 1.6,
        }}
      >
        &ldquo;The seas of innovation are boundless. Each project is an island,
        <br />
        each solution a treasure discovered.&rdquo;
      </div>

      {/* Mini compass pointing home */}
      <motion.div
        animate={inView ? { rotate: [0, 360] } : {}}
        transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
        style={{ display: "inline-block", marginBottom: 20 }}
      >
        <CompassRose size={64} />
      </motion.div>

      {/* Navigation links */}
      <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 24, flexWrap: "wrap" }}>
        {[
          { label: "Expedition Log", href: "#" },
          { label: "Ship's Charts", href: "#" },
          { label: "Crow's Nest", href: "#" },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: 12,
              color: C.sea,
              textDecoration: "none",
              borderBottom: `1px dashed ${C.sea}40`,
              paddingBottom: 2,
              transition: "color 0.2s",
            }}
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Footer details */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
        <CrossedSwords size={16} color={C.burnt} />
        <div
          style={{
            fontFamily: "var(--font-jetbrains)",
            fontSize: 10,
            color: C.inkFaded,
            letterSpacing: "0.1em",
          }}
        >
          CHARTERED IN THE YEAR OF OUR LORD MMXXV
        </div>
        <CrossedSwords size={16} color={C.burnt} />
      </div>

      <div
        style={{
          fontFamily: "var(--font-jetbrains)",
          fontSize: 9,
          color: `${C.ink}40`,
        }}
      >
        PROPERTY OF CAPTAIN GROX &mdash; RETURN TO PORT IF FOUND
      </div>

      {/* Bottom wave animation */}
      <svg
        width="100%"
        height="30"
        viewBox="0 0 1200 30"
        preserveAspectRatio="none"
        fill="none"
        style={{
          position: "absolute",
          bottom: 60,
          left: 0,
          animation: "waveRoll 8s ease-in-out infinite",
        }}
      >
        <path
          d="M0,15 Q50,5 100,15 Q150,25 200,15 Q250,5 300,15 Q350,25 400,15 Q450,5 500,15 Q550,25 600,15 Q650,5 700,15 Q750,25 800,15 Q850,5 900,15 Q950,25 1000,15 Q1050,5 1100,15 Q1150,25 1200,15"
          stroke={C.sea}
          strokeWidth="1"
          fill="none"
          opacity="0.15"
        />
      </svg>
    </motion.footer>
  );
}

/* ================================================================
   MAIN PAGE COMPONENT
   ================================================================ */
export default function CorsairPage() {
  return (
    <div className="corsair-page">
      <CorsairStyles />

      {/* Subtle sea serpent tentacles at page edges */}
      <div
        style={{
          position: "fixed",
          left: -10,
          bottom: "10%",
          zIndex: 0,
          opacity: 0.15,
          pointerEvents: "none",
        }}
      >
        <KrakenTentacle side="left" size={60} />
      </div>
      <div
        style={{
          position: "fixed",
          right: -10,
          bottom: "30%",
          zIndex: 0,
          opacity: 0.12,
          pointerEvents: "none",
        }}
      >
        <KrakenTentacle side="right" size={50} />
      </div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <HeroSection />
        <ProjectsSection />
        <ExpertiseSection />
        <ToolsSection />
        <FooterSection />
      </div>

      {/* Theme Switcher */}
      <ThemeSwitcher current="/corsair" variant="dark" />
    </div>
  );
}
