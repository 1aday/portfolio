"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";

/* ─────────────────── Palette ─────────────────── */
const BK = "#0A0A0A";   // Detector black
const GR = "#39FF14";    // Radioactive green
const BL = "#4FC3F7";    // Particle blue
const MG = "#FF00FF";    // Muon magenta
const CK = "#00CCFF";    // Cherenkov blue
const YW = "#FFD600";    // Warning yellow
const GY = "#2A2A2A";    // Detector gray
const WH = "#E0E0E0";    // Track white

/* ─── Font helpers ─── */
const FO = "var(--font-orbitron), sans-serif";
const FJ = "var(--font-jetbrains), monospace";
const FS = "var(--font-space-grotesk), sans-serif";
const FI = "var(--font-inter), sans-serif";

/* ─── Data ─── */
const particleLabels = [
  "Top Quark", "W Boson", "Higgs Boson", "Tau Neutrino", "Gluon",
  "Z Boson", "Charm Quark", "Muon", "Photon", "Strange Quark",
];
const forces = [
  { name: "Strong Nuclear", sym: "g", color: GR, charge: "Color Charge" },
  { name: "Electromagnetic", sym: "γ", color: BL, charge: "Electric Charge" },
  { name: "Weak Nuclear", sym: "W±", color: MG, charge: "Weak Isospin" },
  { name: "Gravitational", sym: "G", color: YW, charge: "Mass-Energy" },
];
const toolAtomicNum = [1, 6, 7, 8, 14, 26];
const toolSym = ["H", "C", "N", "O", "Si", "Fe"];
const pal = [GR, BL, MG, CK, YW];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* ─── Section Wrapper ─── */
function Fade({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ─── Atom SVG with Orbiting Electrons ─── */
function AtomSVG({ size = 280 }: { size?: number }) {
  const c = size / 2, r1 = size * 0.35, r2 = size * 0.28, r3 = size * 0.32;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <ellipse cx={c} cy={c} rx={r1} ry={r1 * 0.38} stroke={GR} strokeWidth="1" opacity="0.5" className="iso-orbit1" />
      <ellipse cx={c} cy={c} rx={r2} ry={r2 * 0.38} stroke={BL} strokeWidth="1" opacity="0.5" className="iso-orbit2"
        style={{ transform: "rotate(60deg)", transformOrigin: `${c}px ${c}px` }} />
      <ellipse cx={c} cy={c} rx={r3} ry={r3 * 0.38} stroke={MG} strokeWidth="1" opacity="0.5" className="iso-orbit3"
        style={{ transform: "rotate(-60deg)", transformOrigin: `${c}px ${c}px` }} />
      {/* Nucleus */}
      <circle cx={c} cy={c} r={8} fill={GR} opacity="0.9" className="iso-nucleus" />
      <circle cx={c} cy={c} r={12} fill="none" stroke={GR} strokeWidth="0.5" opacity="0.3" className="iso-nring" />
      {/* Orbiting electrons */}
      <circle r="4" fill={BL}>
        <animateMotion dur="3s" repeatCount="indefinite"
          path={`M${c + r1},${c} A${r1},${r1 * 0.38} 0 1,1 ${c - r1},${c} A${r1},${r1 * 0.38} 0 1,1 ${c + r1},${c}`} />
      </circle>
      <circle r="3.5" fill={MG}>
        <animateMotion dur="2.5s" repeatCount="indefinite"
          path={`M${c},${c - r2 * 0.38} A${r2},${r2 * 0.38} 0 1,0 ${c},${c + r2 * 0.38} A${r2},${r2 * 0.38} 0 1,0 ${c},${c - r2 * 0.38}`} />
      </circle>
      <circle r="3" fill={GR}>
        <animateMotion dur="4s" repeatCount="indefinite"
          path={`M${c + r3},${c} A${r3},${r3 * 0.38} 0 1,0 ${c - r3},${c} A${r3},${r3 * 0.38} 0 1,0 ${c + r3},${c}`} />
      </circle>
    </svg>
  );
}

/* ─── Collision Event Display SVG ─── */
function CollisionSVG({ size = 400 }: { size?: number }) {
  const c = size / 2, rng = seededRandom(42);
  const tracks = Array.from({ length: 24 }, (_, i) => ({
    angle: (i / 24) * 360 + (rng() - 0.5) * 15,
    len: 60 + rng() * 120,
    curve: (rng() - 0.5) * 60,
    color: pal[i % 5],
    dash: rng() > 0.6,
  }));
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" style={{ opacity: 0.6 }}>
      {[0.15, 0.3, 0.45].map((f, i) => (
        <circle key={i} cx={c} cy={c} r={size * f} stroke={GY} strokeWidth="0.5" strokeDasharray="4 4" />
      ))}
      <circle cx={c} cy={c} r={3} fill={GR} />
      {tracks.map((t, i) => {
        const rad = (t.angle * Math.PI) / 180;
        const x2 = c + Math.cos(rad) * t.len, y2 = c + Math.sin(rad) * t.len;
        const cpx = (c + x2) / 2 + Math.cos(rad + Math.PI / 2) * t.curve;
        const cpy = (c + y2) / 2 + Math.sin(rad + Math.PI / 2) * t.curve;
        return (
          <path key={i} d={`M${c},${c} Q${cpx},${cpy} ${x2},${y2}`}
            stroke={t.color} strokeWidth={t.dash ? 0.8 : 1.2}
            strokeDasharray={t.dash ? "3 3" : "none"} opacity={0.7}
            className="iso-track-draw" style={{ animationDelay: `${i * 0.08}s` }} />
        );
      })}
    </svg>
  );
}

/* ─── Radiation Trefoil SVG ─── */
function Trefoil({ size = 60, color = GR }: { size?: number; color?: string }) {
  const c = size / 2, r = size * 0.35;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      {[0, 120, 240].map((a, i) => (
        <path key={i}
          d={`M${c},${c} L${c + Math.cos(((a - 120) * Math.PI) / 180) * r},${c + Math.sin(((a - 120) * Math.PI) / 180) * r} A${r},${r} 0 0,1 ${c + Math.cos(((a - 60) * Math.PI) / 180) * r},${c + Math.sin(((a - 60) * Math.PI) / 180) * r} Z`}
          fill={color} opacity={0.8} />
      ))}
      <circle cx={c} cy={c} r={size * 0.12} fill={BK} />
      <circle cx={c} cy={c} r={size * 0.05} fill={color} opacity={0.6} />
    </svg>
  );
}

/* ─── Cloud Chamber Track SVG ─── */
function ChamberTrack({ seed, w = 600, h = 120 }: { seed: number; w?: number; h?: number }) {
  const rng = seededRandom(seed);
  const tracks = Array.from({ length: 5 + Math.floor(rng() * 4) }, (_, i) => {
    const sx = w * 0.1 + rng() * w * 0.3, sy = h * 0.3 + rng() * h * 0.4;
    const ex = w * 0.5 + rng() * w * 0.45, ey = rng() * h;
    return {
      d: `M${sx},${sy} Q${(sx + ex) / 2 + (rng() - 0.5) * 80},${(sy + ey) / 2 + (rng() - 0.5) * 40} ${ex},${ey}`,
      color: [GR, BL, MG, CK][i % 4],
      sw: 0.5 + rng() * 1.2,
    };
  });
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none"
      style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
      {tracks.map((t, i) => (
        <path key={i} d={t.d} stroke={t.color} strokeWidth={t.sw} opacity={0.25} strokeLinecap="round" />
      ))}
    </svg>
  );
}

/* ─── Feynman Diagram SVG ─── */
function Feynman({ v = 0, size = 80 }: { v?: number; size?: number }) {
  const c = size / 2;
  if (v === 0) {
    const pts = Array.from({ length: 21 }, (_, i) =>
      `${(i / 20) * size},${c + Math.sin((i / 20) * Math.PI * 4) * 6}`
    ).join(" ");
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
        <polyline points={pts} stroke={BL} strokeWidth="1.5" opacity="0.5" />
        <circle cx={2} cy={c} r={3} fill={GR} opacity="0.6" />
        <circle cx={size - 2} cy={c} r={3} fill={GR} opacity="0.6" />
      </svg>
    );
  }
  if (v === 1) {
    const pts = Array.from({ length: 31 }, (_, i) =>
      `${(i / 30) * size},${c + Math.sin((i / 30) * Math.PI * 6) * 5}`
    ).join(" ");
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
        <polyline points={pts} stroke={MG} strokeWidth="1.5" opacity="0.5" />
        <circle cx={2} cy={c} r={3} fill={MG} opacity="0.6" />
        <circle cx={size - 2} cy={c} r={3} fill={MG} opacity="0.6" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <line x1={0} y1={0} x2={c} y2={c} stroke={GR} strokeWidth="1" opacity="0.4" />
      <line x1={size} y1={0} x2={c} y2={c} stroke={BL} strokeWidth="1" opacity="0.4" />
      <line x1={c} y1={c} x2={c} y2={size} stroke={CK} strokeWidth="1" opacity="0.4" strokeDasharray="3 2" />
      <circle cx={c} cy={c} r={4} fill={YW} opacity="0.6" />
    </svg>
  );
}

/* ─── Detector Cross-Section SVG ─── */
function DetectorBG({ size = 600 }: { size?: number }) {
  const c = size / 2;
  const layers = [
    { r: size * 0.45, s: 16 }, { r: size * 0.35, s: 12 },
    { r: size * 0.25, s: 8 }, { r: size * 0.15, s: 8 }, { r: size * 0.06, s: 6 },
  ];
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none"
      style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", opacity: 0.12 }}>
      {layers.map((l, i) => (
        <g key={i}>
          <circle cx={c} cy={c} r={l.r} stroke={GR} strokeWidth="0.5"
            fill={i % 2 ? "#1A1A1A" : GY} fillOpacity={0.3} />
          {Array.from({ length: l.s }).map((_, j) => {
            const a = (j / l.s) * Math.PI * 2;
            const ir = layers[Math.min(i + 1, layers.length - 1)].r;
            return (
              <line key={j}
                x1={c + Math.cos(a) * ir} y1={c + Math.sin(a) * ir}
                x2={c + Math.cos(a) * l.r} y2={c + Math.sin(a) * l.r}
                stroke={GR} strokeWidth="0.3" opacity="0.5" />
            );
          })}
        </g>
      ))}
    </svg>
  );
}

/* ─── Half-Life Decay Curve SVG ─── */
function DecayCurve({ w = 320, h = 80 }: { w?: number; h?: number }) {
  const pts = Array.from({ length: 51 }, (_, i) =>
    `${(i / 50) * w},${h - h * 0.85 * Math.exp(-i / 12) - h * 0.05}`
  ).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <line x1={0} y1={h - 2} x2={w} y2={h - 2} stroke={GY} strokeWidth="1" />
      <line x1={2} y1={0} x2={2} y2={h} stroke={GY} strokeWidth="1" />
      <polyline points={pts} stroke={GR} strokeWidth="1.5" fill="none" />
      {[12, 24, 36].map((t, i) => {
        const x = (t / 50) * w, y = h - h * 0.85 * Math.exp(-t / 12) - h * 0.05;
        return (
          <g key={i}>
            <line x1={x} y1={y} x2={x} y2={h - 2} stroke={YW}
              strokeWidth="0.5" strokeDasharray="3 3" opacity="0.5" />
            <circle cx={x} cy={y} r={2.5} fill={YW} opacity="0.7" />
          </g>
        );
      })}
    </svg>
  );
}

/* ─── Geiger Counter Indicator ─── */
function Geiger() {
  const [clicks, setClicks] = useState<number[]>([]);
  useEffect(() => {
    const iv = setInterval(() => {
      setClicks((p) => [...p, Date.now()].slice(-8));
    }, 400 + Math.random() * 1200);
    return () => clearInterval(iv);
  }, []);
  return (
    <div className="flex items-center gap-1" style={{ height: 20 }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            height: clicks.length > i ? [2, 16, 2] : 2,
            backgroundColor: clicks.length > i ? [GR, GR, GY] : GY,
          }}
          transition={{ duration: 0.3 }}
          style={{ width: 2, borderRadius: 1 }}
        />
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════ */
/*                      MAIN PAGE                          */
/* ════════════════════════════════════════════════════════ */
export default function IsotopePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <main
      style={{
        background: BK,
        color: WH,
        fontFamily: `${FI}, system-ui, sans-serif`,
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style jsx global>{`
        @keyframes iso-orb1 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes iso-orb2 { from { transform: rotate(60deg); } to { transform: rotate(420deg); } }
        @keyframes iso-orb3 { from { transform: rotate(-60deg); } to { transform: rotate(300deg); } }
        .iso-orbit1 { animation: iso-orb1 8s linear infinite; transform-origin: 140px 140px; }
        .iso-orbit2 { animation: iso-orb2 6s linear infinite; transform-origin: 140px 140px; }
        .iso-orbit3 { animation: iso-orb3 10s linear infinite; transform-origin: 140px 140px; }

        @keyframes iso-glow {
          0%, 100% { filter: drop-shadow(0 0 8px ${GR}40); }
          50% { filter: drop-shadow(0 0 24px ${GR}90); }
        }
        .iso-nucleus, .iso-nring { animation: iso-glow 2s ease-in-out infinite; }

        @keyframes iso-rglow {
          0%, 100% { text-shadow: 0 0 10px ${GR}60, 0 0 30px ${GR}30, 0 0 60px ${GR}15; }
          50% { text-shadow: 0 0 20px ${GR}90, 0 0 50px ${GR}50, 0 0 100px ${GR}25; }
        }
        .iso-glow-text { animation: iso-rglow 3s ease-in-out infinite; }

        @keyframes iso-tdraw {
          from { stroke-dasharray: 0 1000; opacity: 0; }
          to { stroke-dasharray: 1000 0; opacity: 0.7; }
        }
        .iso-track-draw { animation: iso-tdraw 1.5s ease-out forwards; stroke-dasharray: 0 1000; }

        @keyframes iso-scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .iso-scanline {
          position: fixed; top: 0; left: 0; width: 100%; height: 2px;
          background: linear-gradient(90deg, transparent, ${GR}15, transparent);
          animation: iso-scan 8s linear infinite;
          pointer-events: none; z-index: 50;
        }

        .iso-grid-bg {
          background-image:
            linear-gradient(${GR}08 1px, transparent 1px),
            linear-gradient(90deg, ${GR}08 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .iso-card:hover {
          border-color: ${GR}60 !important;
          box-shadow: 0 0 30px ${GR}15, inset 0 0 30px ${GR}05 !important;
        }
        .iso-card:hover .iso-card-label { color: ${GR} !important; }

        .iso-el:hover {
          background: ${GR}15 !important;
          border-color: ${GR}80 !important;
          transform: scale(1.05);
        }

        @keyframes iso-rpulse {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        .iso-ring-pulse { animation: iso-rpulse 2.5s ease-out infinite; }

        @keyframes iso-flicker {
          0%, 97%, 100% { opacity: 1; }
          98% { opacity: 0.3; }
          99% { opacity: 0.8; }
        }
        .iso-flicker { animation: iso-flicker 4s linear infinite; }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${BK}; }
        ::-webkit-scrollbar-thumb { background: ${GR}40; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: ${GR}70; }
      `}</style>

      {mounted && <div className="iso-scanline" />}

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center iso-grid-bg"
        style={{ padding: "2rem 1rem" }}
      >
        <DetectorBG size={700} />
        <div className="absolute" style={{ opacity: 0.35 }}>
          <CollisionSVG size={500} />
        </div>

        {/* Radiation warning corners */}
        <div className="absolute top-6 left-6 flex items-center gap-3" style={{ opacity: 0.5 }}>
          <Trefoil size={28} />
          <span style={{
            fontFamily: FJ, fontSize: 10, color: YW,
            letterSpacing: "0.15em", textTransform: "uppercase" as const,
          }}>
            Caution: Active Isotopes
          </span>
        </div>
        <div className="absolute top-6 right-6" style={{ opacity: 0.5 }}>
          <Geiger />
        </div>

        {/* Main hero content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex flex-col items-center text-center"
        >
          <motion.div
            initial={{ opacity: 0, rotate: -180 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <AtomSVG size={280} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="iso-glow-text"
            style={{
              fontFamily: FO,
              fontSize: "clamp(3rem, 10vw, 7rem)",
              fontWeight: 900,
              color: GR,
              letterSpacing: "0.2em",
              lineHeight: 1,
              marginTop: "-1rem",
            }}
          >
            ISOTOPE
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            style={{
              fontFamily: FJ, fontSize: 13, color: BL,
              letterSpacing: "0.3em", textTransform: "uppercase" as const,
              marginTop: "0.75rem",
            }}
          >
            Particle Physics Lab &mdash; Portfolio
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5, type: "spring" }}
            style={{ fontSize: 32, marginTop: "0.75rem" }}
          >
            ⚛
          </motion.div>

          {/* Trefoil divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="flex items-center gap-4 mt-8"
          >
            <div style={{ width: 60, height: 1, background: `linear-gradient(90deg, transparent, ${GR})` }} />
            <Trefoil size={24} />
            <div style={{ width: 60, height: 1, background: `linear-gradient(90deg, ${GR}, transparent)` }} />
          </motion.div>

          {/* Stats as particle data readout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-8 mt-8"
          >
            {stats.map((s, i) => {
              const units = ["GeV", "σ", "Events"][i];
              const colors = [GR, MG, BL];
              return (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.08 }}
                  className="flex flex-col items-center"
                  style={{
                    background: `${GY}80`,
                    border: `1px solid ${colors[i]}30`,
                    borderRadius: 4,
                    padding: "1rem 1.5rem",
                    minWidth: 120,
                  }}
                >
                  <span className="iso-flicker" style={{ fontFamily: FO, fontSize: 28, fontWeight: 700, color: colors[i] }}>
                    {s.value}
                  </span>
                  <span style={{ fontFamily: FJ, fontSize: 10, color: WH, opacity: 0.6, textTransform: "uppercase" as const, letterSpacing: "0.15em", marginTop: 2 }}>
                    {s.label}
                  </span>
                  <span style={{ fontFamily: FJ, fontSize: 9, color: colors[i], opacity: 0.4, marginTop: 2 }}>
                    [{units}]
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.6 }}
          className="absolute bottom-8 flex flex-col items-center gap-2"
        >
          <span style={{ fontFamily: FJ, fontSize: 9, color: GR, opacity: 0.5, letterSpacing: "0.2em", textTransform: "uppercase" as const }}>
            Begin Experiment
          </span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ color: GR, opacity: 0.5 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ PROJECTS ═══════════════════ */}
      <Fade id="projects" className="relative py-24 px-4 md:px-8 iso-grid-bg">
        <div className="max-w-7xl mx-auto mb-16">
          <div className="flex items-center gap-4 mb-4">
            <Feynman v={0} size={60} />
            <div>
              <span style={{ fontFamily: FJ, fontSize: 11, color: BL, letterSpacing: "0.2em", textTransform: "uppercase" as const }}>
                Event Log &mdash; Collision Data
              </span>
              <h2 style={{ fontFamily: FO, fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 800, color: GR, letterSpacing: "0.1em", lineHeight: 1.1 }}>
                Detected Particles
              </h2>
            </div>
          </div>
          <div style={{ width: "100%", height: 1, background: `linear-gradient(90deg, ${GR}60, ${BL}30, transparent)` }} />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 relative">
          {projects.map((p, i) => (
            <motion.a
              key={i}
              href={p.github}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className="iso-card relative group"
              style={{
                background: `linear-gradient(145deg, ${GY}50, ${BK}90)`,
                border: `1px solid ${GY}`,
                borderRadius: 2,
                overflow: "hidden",
                cursor: "pointer",
                textDecoration: "none",
                color: WH,
                transition: "border-color 0.3s, box-shadow 0.3s",
              }}
            >
              {/* Cloud chamber header */}
              <div style={{ position: "relative", height: 120, overflow: "hidden" }}>
                <ChamberTrack seed={i * 137 + 42} />
                <div className="absolute top-3 left-3 flex items-center gap-2" style={{ zIndex: 2 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: pal[i % 5],
                    boxShadow: `0 0 8px ${pal[i % 5]}60`,
                  }} />
                  <span
                    className="iso-card-label"
                    style={{
                      fontFamily: FJ, fontSize: 10, color: pal[i % 5],
                      letterSpacing: "0.15em", textTransform: "uppercase" as const,
                      transition: "color 0.3s",
                    }}
                  >
                    {particleLabels[i]}
                  </span>
                </div>
                <div className="absolute top-3 right-3" style={{ fontFamily: FJ, fontSize: 9, color: WH, opacity: 0.3 }}>
                  EVT-{String(2024000 + i).padStart(7, "0")}
                </div>
                {/* Collision point with pulse ring */}
                <div className="absolute" style={{ bottom: 10, left: "15%", zIndex: 2 }}>
                  <div style={{ position: "relative" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: GR }} />
                    <div className="iso-ring-pulse" style={{
                      position: "absolute", top: -4, left: -4,
                      width: 14, height: 14, borderRadius: "50%",
                      border: `1px solid ${GR}40`,
                    }} />
                  </div>
                </div>
                <div className="absolute bottom-2 right-4" style={{ opacity: 0.3 }}>
                  <Feynman v={i % 3} size={50} />
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: "1.25rem 1.5rem" }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 style={{ fontFamily: FS, fontSize: 18, fontWeight: 700, color: WH, lineHeight: 1.3, whiteSpace: "pre-line" }}>
                      {p.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span style={{ fontFamily: FJ, fontSize: 10, color: BL, opacity: 0.7 }}>{p.client}</span>
                      <span style={{ fontFamily: FJ, fontSize: 10, color: WH, opacity: 0.3 }}>|</span>
                      <span style={{ fontFamily: FJ, fontSize: 10, color: YW, opacity: 0.6 }}>{p.year}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end" style={{ fontFamily: FO, fontSize: 11, color: GR, opacity: 0.6 }}>
                    <span>{(13.6 - i * 0.8).toFixed(1)}</span>
                    <span style={{ fontSize: 8, opacity: 0.5 }}>TeV</span>
                  </div>
                </div>

                <p style={{ fontFamily: FI, fontSize: 13, lineHeight: 1.6, color: WH, opacity: 0.65, marginBottom: "0.75rem" }}>
                  {p.description}
                </p>
                <p style={{
                  fontFamily: FJ, fontSize: 11, lineHeight: 1.5, color: BL,
                  opacity: 0.45, marginBottom: "1rem",
                  borderLeft: `2px solid ${BL}20`, paddingLeft: "0.75rem",
                }}>
                  {p.technical}
                </p>

                <div className="flex flex-wrap gap-2">
                  {p.tech.map((t, j) => (
                    <span key={j} style={{
                      fontFamily: FJ, fontSize: 10, color: GR,
                      background: `${GR}10`, border: `1px solid ${GR}20`,
                      borderRadius: 1, padding: "2px 8px", letterSpacing: "0.05em",
                    }}>
                      {t}
                    </span>
                  ))}
                </div>

                {/* Detector readout bar */}
                <div className="mt-4 flex items-center gap-3">
                  <div style={{ flex: 1, height: 3, background: GY, borderRadius: 2, overflow: "hidden" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${70 + ((i * 3) % 30)}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3, duration: 1.2, ease: "easeOut" }}
                      style={{
                        height: "100%",
                        background: `linear-gradient(90deg, ${GR}, ${[BL, MG, CK][i % 3]})`,
                        borderRadius: 2,
                      }}
                    />
                  </div>
                  <span style={{ fontFamily: FJ, fontSize: 9, color: WH, opacity: 0.3 }}>
                    {(0.9842 - i * 0.012).toFixed(4)}σ
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Decorative Feynman diagrams */}
        <div className="max-w-7xl mx-auto mt-8 flex justify-center gap-6" style={{ opacity: 0.3 }}>
          <Feynman v={0} size={100} />
          <Feynman v={1} size={100} />
          <Feynman v={2} size={100} />
          <Feynman v={0} size={100} />
        </div>
      </Fade>

      {/* ═══════════════════ EXPERTISE ═══════════════════ */}
      <Fade id="expertise" className="relative py-24 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <span style={{ fontFamily: FJ, fontSize: 11, color: MG, letterSpacing: "0.25em", textTransform: "uppercase" as const }}>
              Fundamental Forces
            </span>
            <h2 style={{ fontFamily: FO, fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 800, color: GR, letterSpacing: "0.1em", marginTop: "0.5rem" }}>
              Core Interactions
            </h2>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div style={{ width: 40, height: 1, background: MG, opacity: 0.4 }} />
              <Trefoil size={20} color={MG} />
              <div style={{ width: 40, height: 1, background: MG, opacity: 0.4 }} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {expertise.map((exp, i) => {
              const f = forces[i];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ scale: 1.02 }}
                  style={{
                    background: BK,
                    border: `1px solid ${f.color}25`,
                    borderRadius: 2,
                    overflow: "hidden",
                    transition: "border-color 0.3s",
                  }}
                >
                  {/* Readout header */}
                  <div
                    className="flex items-center justify-between"
                    style={{ padding: "0.75rem 1.25rem", background: `${f.color}08`, borderBottom: `1px solid ${f.color}15` }}
                  >
                    <div className="flex items-center gap-3">
                      <div style={{
                        width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
                        border: `1px solid ${f.color}40`, borderRadius: 2,
                        fontFamily: FO, fontSize: 16, fontWeight: 700, color: f.color,
                      }}>
                        {f.sym}
                      </div>
                      <div>
                        <div style={{ fontFamily: FJ, fontSize: 9, color: f.color, letterSpacing: "0.2em", textTransform: "uppercase" as const, opacity: 0.7 }}>
                          {f.name} Force
                        </div>
                        <div style={{ fontFamily: FJ, fontSize: 8, color: WH, opacity: 0.3, letterSpacing: "0.1em" }}>
                          Mediator: {f.charge}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: f.color, boxShadow: `0 0 8px ${f.color}60` }} />
                      <span style={{ fontFamily: FJ, fontSize: 9, color: f.color, opacity: 0.6 }}>ACTIVE</span>
                    </div>
                  </div>

                  {/* Readout body */}
                  <div style={{ padding: "1.25rem" }}>
                    <h3 style={{ fontFamily: FS, fontSize: 18, fontWeight: 700, color: WH, marginBottom: "0.5rem" }}>
                      {exp.title}
                    </h3>
                    <p style={{ fontFamily: FI, fontSize: 13, lineHeight: 1.7, color: WH, opacity: 0.6 }}>
                      {exp.body}
                    </p>
                    {/* Detector histogram bars */}
                    <div className="mt-4 flex gap-1">
                      {Array.from({ length: 20 }).map((_, j) => (
                        <motion.div
                          key={j}
                          initial={{ height: 2 }}
                          whileInView={{ height: 2 + Math.sin(j * 0.8 + i * 2) * 8 + 8 }}
                          viewport={{ once: true }}
                          transition={{ delay: j * 0.03 + i * 0.1, duration: 0.4 }}
                          style={{ width: 3, background: f.color, opacity: 0.3 + (j / 20) * 0.5, borderRadius: 1 }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Fade>

      {/* ═══════════════════ TOOLS ═══════════════════ */}
      <Fade id="tools" className="relative py-24 px-4 md:px-8 iso-grid-bg">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <span style={{ fontFamily: FJ, fontSize: 11, color: CK, letterSpacing: "0.25em", textTransform: "uppercase" as const }}>
              Periodic Table of
            </span>
            <h2 style={{ fontFamily: FO, fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 800, color: GR, letterSpacing: "0.1em", marginTop: "0.5rem" }}>
              Technical Elements
            </h2>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div style={{ width: 40, height: 1, background: CK, opacity: 0.4 }} />
              <span style={{ color: CK, fontSize: 14 }}>⚛</span>
              <div style={{ width: 40, height: 1, background: CK, opacity: 0.4 }} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((group, gi) => {
              const gc = [GR, BL, MG, CK, YW, WH][gi % 6];
              const aN = toolAtomicNum[gi], aS = toolSym[gi];
              return (
                <motion.div
                  key={gi}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ delay: gi * 0.1, duration: 0.5 }}
                >
                  {/* Group header element box */}
                  <div className="flex items-center gap-3 mb-4">
                    <div style={{
                      width: 48, height: 48, display: "flex", flexDirection: "column" as const,
                      alignItems: "center", justifyContent: "center",
                      border: `2px solid ${gc}50`, borderRadius: 2,
                      background: `${gc}08`, position: "relative" as const,
                    }}>
                      <span style={{ fontFamily: FJ, fontSize: 7, color: gc, opacity: 0.6, position: "absolute" as const, top: 2, left: 4 }}>
                        {aN}
                      </span>
                      <span style={{ fontFamily: FO, fontSize: 18, fontWeight: 700, color: gc }}>
                        {aS}
                      </span>
                    </div>
                    <div>
                      <span style={{ fontFamily: FS, fontSize: 16, fontWeight: 700, color: WH }}>
                        {group.label}
                      </span>
                      <div style={{ fontFamily: FJ, fontSize: 9, color: gc, opacity: 0.5, letterSpacing: "0.1em" }}>
                        Group {gi + 1} &middot; {group.items.length} isotopes
                      </div>
                    </div>
                  </div>

                  {/* Individual tool element boxes */}
                  <div className="grid grid-cols-2 gap-2">
                    {group.items.map((item, ii) => {
                      const eN = aN * 10 + ii + 1, eS = item.slice(0, 2);
                      return (
                        <motion.div
                          key={ii}
                          whileHover={{ scale: 1.05 }}
                          className="iso-el"
                          style={{
                            border: `1px solid ${gc}20`, borderRadius: 2,
                            padding: "0.6rem", background: `${GY}40`,
                            cursor: "default", transition: "all 0.2s",
                            position: "relative" as const,
                          }}
                        >
                          <span style={{ fontFamily: FJ, fontSize: 8, color: gc, opacity: 0.4, position: "absolute" as const, top: 4, left: 6 }}>
                            {eN}
                          </span>
                          <div className="text-center mt-1">
                            <span style={{ fontFamily: FO, fontSize: 16, fontWeight: 700, color: gc, display: "block" }}>
                              {eS}
                            </span>
                            <span style={{ fontFamily: FJ, fontSize: 9, color: WH, opacity: 0.6, display: "block", marginTop: 1 }}>
                              {item}
                            </span>
                          </div>
                          <span style={{ fontFamily: FJ, fontSize: 7, color: WH, opacity: 0.2, position: "absolute" as const, bottom: 3, right: 5 }}>
                            {(eN * 3.14).toFixed(1)}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Fade>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <Fade className="relative py-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Warning stripe */}
            <div className="mx-auto mb-8" style={{
              maxWidth: 400, height: 6,
              background: `repeating-linear-gradient(-45deg, ${YW}, ${YW} 8px, ${BK} 8px, ${BK} 16px)`,
              opacity: 0.4, borderRadius: 1,
            }} />

            {/* Experiment Complete */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <Trefoil size={32} color={YW} />
              <span style={{
                fontFamily: FO, fontSize: "clamp(1.2rem, 3vw, 2rem)",
                fontWeight: 800, color: YW, letterSpacing: "0.15em",
              }}>
                EXPERIMENT COMPLETE
              </span>
              <Trefoil size={32} color={YW} />
            </div>

            {/* Half-life decay curve */}
            <div className="flex justify-center mb-8">
              <DecayCurve />
            </div>

            {/* Decay formula */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <span style={{ fontFamily: FJ, fontSize: 10, color: GR, opacity: 0.5, letterSpacing: "0.15em" }}>
                t<sub>1/2</sub> = 5.27 years
              </span>
              <span style={{ color: WH, opacity: 0.2 }}>|</span>
              <span style={{ fontFamily: FJ, fontSize: 10, color: BL, opacity: 0.5, letterSpacing: "0.15em" }}>
                N(t) = N<sub>0</sub> &middot; e<sup>-&lambda;t</sup>
              </span>
            </div>

            {/* CERN-style reference */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "1rem",
              background: `${GY}50`, border: `1px solid ${GY}`,
              borderRadius: 2, padding: "0.75rem 1.5rem", marginBottom: "1.5rem",
            }}>
              <span style={{ fontFamily: FJ, fontSize: 10, color: WH, opacity: 0.4, letterSpacing: "0.1em" }}>
                ISOTOPE-PORTFOLIO-2025
              </span>
              <span style={{ color: GY }}>|</span>
              <span style={{ fontFamily: FJ, fontSize: 10, color: GR, opacity: 0.5, letterSpacing: "0.1em" }}>
                CERN-EX-2025-001
              </span>
              <span style={{ color: GY }}>|</span>
              <span style={{ fontFamily: FJ, fontSize: 10, color: MG, opacity: 0.4, letterSpacing: "0.1em" }}>
                DOI:10.1234/isotope
              </span>
            </div>

            <div className="mx-auto my-6" style={{
              maxWidth: 200, height: 1,
              background: `linear-gradient(90deg, transparent, ${GR}30, transparent)`,
            }} />

            {/* Feynman diagram decoration */}
            <div className="flex items-center justify-center gap-6 mb-8" style={{ opacity: 0.25 }}>
              <Feynman v={0} size={60} />
              <Feynman v={1} size={60} />
              <Feynman v={2} size={60} />
            </div>

            {/* Radiation warning */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trefoil size={16} color={GR} />
              <span style={{
                fontFamily: FJ, fontSize: 9, color: GR, opacity: 0.3,
                letterSpacing: "0.2em", textTransform: "uppercase" as const,
              }}>
                Radioactive Material &mdash; Handle with Care
              </span>
              <Trefoil size={16} color={GR} />
            </div>

            <p style={{ fontFamily: FJ, fontSize: 10, color: WH, opacity: 0.25, letterSpacing: "0.1em" }}>
              &copy; {new Date().getFullYear()} &middot; Isotope Lab &middot; All Particles Reserved
            </p>

            {/* Bottom warning stripe */}
            <div className="mx-auto mt-8" style={{
              maxWidth: 400, height: 6,
              background: `repeating-linear-gradient(-45deg, ${YW}, ${YW} 8px, ${BK} 8px, ${BK} 16px)`,
              opacity: 0.4, borderRadius: 1,
            }} />
          </motion.div>
        </div>
      </Fade>

      {/* Theme Switcher */}
      <ThemeSwitcher current="/isotope" variant="dark" />
    </main>
  );
}
