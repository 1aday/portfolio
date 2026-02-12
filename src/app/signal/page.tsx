"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { getProjectImage } from "@/lib/theme-images";

/* ═══════════════════════════════════════════════════════════ */
/*  CONSTANTS                                                  */
/* ═══════════════════════════════════════════════════════════ */
const PHOSPHOR = "#39FF14";
const AMBER = "#FFB300";
const PANEL_BG = "#0C0C0C";
const SCREEN_BG = "#0A1A0A";
const GRID_COLOR = "#1A3A1A";
const DIM_GREEN = "rgba(57,255,20,0.35)";
const GLOW_GREEN = "rgba(57,255,20,0.5)";
const DIM_AMBER = "rgba(255,179,0,0.4)";
const BORDER = "#1A1A1A";
const MUTED = "#2A2A2A";

/* ═══════════════════════════════════════════════════════════ */
/*  PANEL SCREW — small corner detail                          */
/* ═══════════════════════════════════════════════════════════ */
function PanelScrew({ className = "" }: { className?: string }) {
  return (
    <div
      className={`absolute ${className}`}
      style={{
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: `radial-gradient(circle at 35% 35%, #3A3A3A, #1A1A1A)`,
        border: "1px solid #2A2A2A",
        boxShadow: "inset 0 1px 2px rgba(0,0,0,0.6), 0 0 3px rgba(0,0,0,0.4)",
      }}
    >
      {/* Cross slot */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "25%",
          right: "25%",
          height: 1,
          background: "#0A0A0A",
          transform: "translateY(-50%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "25%",
          bottom: "25%",
          width: 1,
          background: "#0A0A0A",
          transform: "translateX(-50%)",
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*  PANEL — wraps content in instrument-panel chrome           */
/* ═══════════════════════════════════════════════════════════ */
function Panel({
  children,
  className = "",
  label,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  label?: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={`relative ${className}`}
      style={{
        background: PANEL_BG,
        border: `1px solid ${BORDER}`,
        borderRadius: 2,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.03), 0 4px 20px rgba(0,0,0,0.5)`,
      }}
    >
      <PanelScrew className="top-2 left-2" />
      <PanelScrew className="top-2 right-2" />
      <PanelScrew className="bottom-2 left-2" />
      <PanelScrew className="bottom-2 right-2" />
      {label && (
        <div
          className="absolute -top-3 left-6 px-2 text-[9px] uppercase tracking-[0.25em] font-[family-name:var(--font-jetbrains)]"
          style={{ background: PANEL_BG, color: DIM_AMBER }}
        >
          {label}
        </div>
      )}
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*  OSCILLOSCOPE SCREEN — CRT display with grid                */
/* ═══════════════════════════════════════════════════════════ */
function OscilloscopeScreen({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: SCREEN_BG,
        borderRadius: 4,
        border: `2px solid ${BORDER}`,
        boxShadow: `inset 0 0 40px rgba(57,255,20,0.04), inset 0 0 80px rgba(0,0,0,0.3)`,
      }}
    >
      {/* Grid lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, ${GRID_COLOR} 0px, transparent 1px, transparent 40px),
            repeating-linear-gradient(90deg, ${GRID_COLOR} 0px, transparent 1px, transparent 40px)
          `,
          opacity: 0.6,
        }}
      />
      {/* Center crosshair */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "50%",
          left: 0,
          right: 0,
          height: 1,
          background: GRID_COLOR,
          opacity: 0.8,
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          left: "50%",
          top: 0,
          bottom: 0,
          width: 1,
          background: GRID_COLOR,
          opacity: 0.8,
        }}
      />
      {/* Phosphor glow overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, rgba(57,255,20,0.03) 0%, transparent 70%)`,
        }}
      />
      {/* Scan line overlay */}
      <div
        className="absolute inset-0 pointer-events-none scan-line-overlay"
        style={{ opacity: 0.08 }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*  WAVEFORM SVG — animated sine wave                          */
/* ═══════════════════════════════════════════════════════════ */
function Waveform({
  color = PHOSPHOR,
  amplitude = 30,
  frequency = 2,
  speed = 4,
  height = 120,
  strokeWidth = 2,
  opacity = 1,
}: {
  color?: string;
  amplitude?: number;
  frequency?: number;
  speed?: number;
  height?: number;
  strokeWidth?: number;
  opacity?: number;
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const animRef = useRef<number>(0);
  const phaseRef = useRef(0);

  useEffect(() => {
    const animate = () => {
      phaseRef.current += speed * 0.02;
      const path = pathRef.current;
      if (path) {
        const w = 800;
        const cy = height / 2;
        let d = `M 0 ${cy}`;
        for (let x = 0; x <= w; x += 2) {
          const y =
            cy +
            amplitude *
              Math.sin((x / w) * frequency * Math.PI * 2 + phaseRef.current);
          d += ` L ${x} ${y}`;
        }
        path.setAttribute("d", d);
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [amplitude, frequency, speed, height]);

  return (
    <svg
      viewBox={`0 0 800 ${height}`}
      className="w-full"
      style={{ height, opacity }}
      preserveAspectRatio="none"
    >
      <defs>
        <filter id="phosphor-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        ref={pathRef}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        filter="url(#phosphor-glow)"
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*  RADAR SWEEP — circular rotating indicator                  */
/* ═══════════════════════════════════════════════════════════ */
function RadarSweep({ size = 160 }: { size?: number }) {
  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
    >
      {/* Concentric rings */}
      {[0.9, 0.65, 0.4].map((scale, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: size * scale,
            height: size * scale,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            border: `1px solid ${GRID_COLOR}`,
          }}
        />
      ))}
      {/* Crosshair */}
      <div
        className="absolute"
        style={{
          top: "50%",
          left: 0,
          right: 0,
          height: 1,
          background: GRID_COLOR,
        }}
      />
      <div
        className="absolute"
        style={{
          left: "50%",
          top: 0,
          bottom: 0,
          width: 1,
          background: GRID_COLOR,
        }}
      />
      {/* Sweep */}
      <div
        className="absolute inset-0 rounded-full radar-sweep"
        style={{
          background: `conic-gradient(from 0deg, transparent 0deg, ${GLOW_GREEN} 20deg, transparent 60deg)`,
        }}
      />
      {/* Center dot */}
      <div
        className="absolute rounded-full"
        style={{
          width: 6,
          height: 6,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: PHOSPHOR,
          boxShadow: `0 0 8px ${PHOSPHOR}`,
        }}
      />
      {/* Blips */}
      {[
        { top: "25%", left: "60%" },
        { top: "55%", left: "30%" },
        { top: "70%", left: "65%" },
      ].map((pos, i) => (
        <div
          key={i}
          className="absolute rounded-full radar-blip"
          style={{
            width: 4,
            height: 4,
            ...pos,
            background: PHOSPHOR,
            boxShadow: `0 0 6px ${PHOSPHOR}`,
            animationDelay: `${i * 1.5}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*  VU METER — vertical bar meter                              */
/* ═══════════════════════════════════════════════════════════ */
function VUMeter({ value, label }: { value: number; label: string }) {
  const segments = 12;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex flex-col-reverse gap-[2px]">
        {Array.from({ length: segments }).map((_, i) => {
          const active = i < Math.round(value * segments);
          const isHot = i >= segments - 3;
          const isWarm = i >= segments - 6;
          const color = active
            ? isHot
              ? "#FF3333"
              : isWarm
                ? AMBER
                : PHOSPHOR
            : MUTED;
          return (
            <div
              key={i}
              style={{
                width: 14,
                height: 4,
                background: color,
                borderRadius: 1,
                boxShadow: active ? `0 0 4px ${color}` : "none",
                transition: "background 0.3s, box-shadow 0.3s",
              }}
            />
          );
        })}
      </div>
      <span
        className="text-[8px] uppercase tracking-wider font-[family-name:var(--font-jetbrains)] mt-1"
        style={{ color: DIM_AMBER }}
      >
        {label}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*  SIGNAL STRENGTH — horizontal bar indicator                 */
/* ═══════════════════════════════════════════════════════════ */
function SignalStrength({ strength }: { strength: number }) {
  return (
    <div className="flex gap-[2px] items-end">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 3,
            height: 4 + i * 3,
            background: i < strength ? PHOSPHOR : MUTED,
            borderRadius: 1,
            boxShadow: i < strength ? `0 0 4px ${PHOSPHOR}` : "none",
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*  CHANNEL KNOB — rotary selector                             */
/* ═══════════════════════════════════════════════════════════ */
function ChannelKnob({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="relative"
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: `radial-gradient(circle at 40% 35%, #2A2A2A, #111)`,
          border: "2px solid #333",
          boxShadow: `0 2px 8px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.05)`,
        }}
      >
        {/* Indicator line */}
        <div
          style={{
            position: "absolute",
            top: 4,
            left: "50%",
            width: 2,
            height: 10,
            background: PHOSPHOR,
            borderRadius: 1,
            transform: "translateX(-50%)",
            boxShadow: `0 0 4px ${PHOSPHOR}`,
          }}
        />
        {/* Ring markers */}
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <div
            key={deg}
            className="absolute"
            style={{
              width: 2,
              height: 2,
              borderRadius: "50%",
              background: "#444",
              top: "50%",
              left: "50%",
              transform: `rotate(${deg}deg) translate(0, -20px) translate(-1px, -1px)`,
            }}
          />
        ))}
      </div>
      <span
        className="text-[8px] uppercase tracking-[0.15em] font-[family-name:var(--font-jetbrains)]"
        style={{ color: DIM_AMBER }}
      >
        {label}
      </span>
      <span
        className="text-[10px] font-[family-name:var(--font-jetbrains)]"
        style={{ color: PHOSPHOR }}
      >
        {value}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*  READOUT — digital numeric display                          */
/* ═══════════════════════════════════════════════════════════ */
function Readout({
  value,
  label,
  unit = "",
  color = PHOSPHOR,
}: {
  value: string;
  label: string;
  unit?: string;
  color?: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <span
        className="text-[9px] uppercase tracking-[0.2em] font-[family-name:var(--font-manrope)]"
        style={{ color: DIM_AMBER }}
      >
        {label}
      </span>
      <div className="flex items-baseline gap-1 mt-1">
        <span
          className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-jetbrains)]"
          style={{
            color,
            textShadow: `0 0 12px ${color}80`,
          }}
        >
          {value}
        </span>
        {unit && (
          <span
            className="text-[10px] font-[family-name:var(--font-jetbrains)]"
            style={{ color: DIM_GREEN }}
          >
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*  SCROLL REVEAL                                              */
/* ═══════════════════════════════════════════════════════════ */
function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*  SCAN LINE REVEAL — clip-path expanding animation           */
/* ═══════════════════════════════════════════════════════════ */
function ScanReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ clipPath: "inset(0 100% 0 0)" }}
      animate={
        inView
          ? { clipPath: "inset(0 0% 0 0)" }
          : { clipPath: "inset(0 100% 0 0)" }
      }
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*  MAIN SIGNAL PAGE                                           */
/* ═══════════════════════════════════════════════════════════ */
export default function SignalPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* VU meter values — animate on mount */
  const [vuValues, setVuValues] = useState([0, 0, 0, 0, 0, 0]);
  useEffect(() => {
    if (!mounted) return;
    const targets = [0.75, 0.58, 0.9, 0.42, 0.83, 0.66];
    const timer = setTimeout(() => setVuValues(targets), 400);
    return () => clearTimeout(timer);
  }, [mounted]);

  const navLinks = [
    { label: "CH.1 Projects", href: "#projects" },
    { label: "CH.2 Analysis", href: "#expertise" },
    { label: "CH.3 Equipment", href: "#tools" },
    { label: "CH.4 Contact", href: "#footer" },
  ];

  return (
    <div
      className="relative min-h-screen"
      style={{
        background: PANEL_BG,
        color: PHOSPHOR,
        fontFamily: "var(--font-jetbrains), monospace",
      }}
    >
      {/* ── GLOBAL STYLES ── */}
      <style jsx global>{`
        @keyframes radar-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes scan-line {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes blip-fade {
          0%, 20% { opacity: 1; }
          100% { opacity: 0; }
        }
        .radar-sweep {
          animation: radar-spin 6s linear infinite;
        }
        .radar-blip {
          animation: blip-fade 6s ease-out infinite;
        }
        .scan-line-overlay {
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(57, 255, 20, 0.03) 2px,
            rgba(57, 255, 20, 0.03) 4px
          );
        }
        .signal-card {
          transition: all 0.3s ease;
        }
        .signal-card:hover {
          border-color: ${PHOSPHOR} !important;
          box-shadow: 0 0 20px rgba(57,255,20,0.1), inset 0 0 20px rgba(57,255,20,0.02) !important;
        }
        .signal-card:hover .readout-value {
          text-shadow: 0 0 20px ${PHOSPHOR};
        }
        .equipment-item {
          transition: all 0.3s ease;
        }
        .equipment-item:hover {
          color: ${PHOSPHOR} !important;
          text-shadow: 0 0 8px ${GLOW_GREEN};
        }
        .rec-blink {
          animation: blink 1.5s ease-in-out infinite;
        }
      `}</style>

      {/* ═══════════════════════════════════════════════════ */}
      {/*  NAV                                                */}
      {/* ═══════════════════════════════════════════════════ */}
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: "rgba(12,12,12,0.92)",
          borderBottom: `1px solid ${BORDER}`,
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="max-w-[1200px] mx-auto px-6 py-3 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            {/* Signal icon */}
            <div className="flex items-center gap-1.5">
              <div
                className="rec-blink"
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#FF3333",
                  boxShadow: "0 0 6px #FF3333",
                }}
              />
              <span
                className="text-[10px] font-[family-name:var(--font-jetbrains)] uppercase tracking-wider"
                style={{ color: "#FF3333" }}
              >
                REC
              </span>
            </div>
            <div
              style={{
                width: 1,
                height: 14,
                background: BORDER,
              }}
            />
            <span
              className="text-xs font-[family-name:var(--font-jetbrains)] uppercase tracking-wider"
              style={{ color: PHOSPHOR }}
            >
              GROX
            </span>
            <span
              className="text-[10px] font-[family-name:var(--font-jetbrains)]"
              style={{ color: DIM_GREEN }}
            >
              SIG-2025
            </span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[10px] uppercase tracking-wider font-[family-name:var(--font-jetbrains)] transition-colors duration-200"
                style={{ color: DIM_GREEN }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = PHOSPHOR)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = DIM_GREEN)
                }
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════ */}
      {/*  HERO — OSCILLOSCOPE DISPLAY                        */}
      {/* ═══════════════════════════════════════════════════ */}
      <section
        className="min-h-screen flex flex-col justify-center px-4 sm:px-6"
        style={{ paddingTop: 80, paddingBottom: 40 }}
      >
        <div className="max-w-[1200px] mx-auto w-full">
          <Reveal>
            <Panel label="MAIN DISPLAY" className="p-5 sm:p-8">
              {/* Top bar — instrument readouts */}
              <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-4 sm:gap-6">
                  <ChannelKnob label="Time/Div" value="5ms" />
                  <ChannelKnob label="Volts/Div" value="2V" />
                  <ChannelKnob label="Trigger" value="AUTO" />
                </div>
                <div className="flex items-center gap-4">
                  {vuValues.slice(0, 3).map((v, i) => (
                    <VUMeter
                      key={i}
                      value={v}
                      label={["CH1", "CH2", "CH3"][i]}
                    />
                  ))}
                </div>
              </div>

              {/* Main oscilloscope screen */}
              <OscilloscopeScreen>
                <div className="relative py-6 sm:py-10 px-4 sm:px-8">
                  {/* Frequency label */}
                  <div
                    className="absolute top-3 left-4 text-[9px] font-[family-name:var(--font-jetbrains)] uppercase tracking-wider"
                    style={{ color: DIM_GREEN }}
                  >
                    CH1 &mdash; 440Hz &mdash; 2Vpp
                  </div>
                  <div
                    className="absolute top-3 right-4 text-[9px] font-[family-name:var(--font-jetbrains)]"
                    style={{ color: DIM_AMBER }}
                  >
                    TRIG: AUTO
                  </div>

                  {/* Waveforms — layered */}
                  <div className="relative">
                    {mounted && (
                      <>
                        <Waveform
                          color={PHOSPHOR}
                          amplitude={35}
                          frequency={3}
                          speed={3}
                          height={140}
                          strokeWidth={2.5}
                        />
                        <div className="absolute inset-0">
                          <Waveform
                            color={AMBER}
                            amplitude={20}
                            frequency={5}
                            speed={5}
                            height={140}
                            strokeWidth={1.5}
                            opacity={0.5}
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Headline overlay */}
                  <div className="mt-6 sm:mt-8">
                    <h1
                      className="text-2xl sm:text-4xl md:text-5xl font-bold font-[family-name:var(--font-manrope)] leading-tight"
                      style={{
                        color: PHOSPHOR,
                        textShadow: `0 0 20px ${GLOW_GREEN}, 0 0 40px rgba(57,255,20,0.2)`,
                      }}
                    >
                      I turn AI models
                      <br />
                      into products
                      <br />
                      people use
                    </h1>
                    <p
                      className="mt-4 text-xs sm:text-sm font-[family-name:var(--font-jetbrains)] max-w-md leading-relaxed"
                      style={{ color: DIM_GREEN }}
                    >
                      Full-stack AI product engineer. Multi-model orchestration,
                      computer vision, NLP, and production systems.
                    </p>
                  </div>

                  {/* Bottom readout bar */}
                  <div
                    className="absolute bottom-3 left-4 right-4 flex justify-between items-center text-[9px] font-[family-name:var(--font-jetbrains)]"
                    style={{ color: DIM_GREEN }}
                  >
                    <span>SAMPLE: 1GSa/s</span>
                    <span>BW: 200MHz</span>
                    <span>MEMORY: 2Mpts</span>
                  </div>
                </div>
              </OscilloscopeScreen>

              {/* Stats row below screen */}
              <div className="mt-6 flex items-center justify-between flex-wrap gap-6">
                <div className="flex items-center gap-6 sm:gap-10">
                  {stats.map((s, i) => (
                    <Readout
                      key={i}
                      value={s.value}
                      label={s.label}
                      color={i === 0 ? PHOSPHOR : i === 1 ? AMBER : PHOSPHOR}
                    />
                  ))}
                </div>
                <div className="hidden sm:block">
                  <RadarSweep size={120} />
                </div>
              </div>
            </Panel>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ */}
      {/*  PROJECTS — CHANNEL READOUTS                        */}
      {/* ═══════════════════════════════════════════════════ */}
      <section id="projects" className="px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-[1200px] mx-auto w-full">
          <Reveal>
            <div className="flex items-center gap-3 mb-10">
              <div
                style={{
                  width: 8,
                  height: 8,
                  background: PHOSPHOR,
                  borderRadius: "50%",
                  boxShadow: `0 0 8px ${PHOSPHOR}`,
                }}
              />
              <h2
                className="text-xs sm:text-sm uppercase tracking-[0.3em] font-[family-name:var(--font-jetbrains)]"
                style={{
                  color: AMBER,
                  textShadow: `0 0 10px ${DIM_AMBER}`,
                }}
              >
                CH.1 &mdash; Signal Channels &mdash; Projects
              </h2>
              <div
                className="flex-1 h-[1px]"
                style={{ background: BORDER }}
              />
              <span
                className="text-[10px] font-[family-name:var(--font-jetbrains)]"
                style={{ color: DIM_GREEN }}
              >
                {projects.length} SIGNALS
              </span>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
            {projects.map((project, i) => {
              const title = project.title.replace(/\n/g, " ");
              const signalStrength = Math.floor(Math.random() * 2) + 4; // 4-5
              const freq = (220 + i * 110).toFixed(0);

              return (
                <Reveal key={i} delay={i * 0.06}>
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block signal-card group"
                  >
                    <Panel className="p-0 overflow-hidden h-full">
                      {/* Channel header bar */}
                      <div
                        className="px-4 py-2.5 flex items-center justify-between"
                        style={{
                          borderBottom: `1px solid ${BORDER}`,
                          background: "rgba(57,255,20,0.02)",
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="text-[10px] font-[family-name:var(--font-jetbrains)] font-bold"
                            style={{
                              color: AMBER,
                              textShadow: `0 0 6px ${DIM_AMBER}`,
                            }}
                          >
                            CH.{String(i + 1).padStart(2, "0")}
                          </span>
                          <div
                            style={{
                              width: 1,
                              height: 10,
                              background: BORDER,
                            }}
                          />
                          <span
                            className="text-[10px] font-[family-name:var(--font-jetbrains)]"
                            style={{ color: DIM_GREEN }}
                          >
                            {freq}Hz
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <SignalStrength strength={signalStrength} />
                          <span
                            className="text-[9px] font-[family-name:var(--font-jetbrains)]"
                            style={{ color: DIM_GREEN }}
                          >
                            {project.year}
                          </span>
                        </div>
                      </div>

                      <div className="p-4">
                        {/* Project image — oscilloscope-filtered */}
                        <ScanReveal delay={i * 0.06 + 0.2}>
                          <div
                            className="relative mb-4 overflow-hidden"
                            style={{
                              height: 140,
                              borderRadius: 2,
                              border: `1px solid ${GRID_COLOR}`,
                              background: SCREEN_BG,
                            }}
                          >
                            {/* Grid overlay on image */}
                            <div
                              className="absolute inset-0 z-10 pointer-events-none"
                              style={{
                                backgroundImage: `
                                  repeating-linear-gradient(0deg, ${GRID_COLOR} 0px, transparent 1px, transparent 30px),
                                  repeating-linear-gradient(90deg, ${GRID_COLOR} 0px, transparent 1px, transparent 30px)
                                `,
                                opacity: 0.4,
                              }}
                            />
                            {/* Phosphor overlay */}
                            <div
                              className="absolute inset-0 z-10 pointer-events-none"
                              style={{
                                background:
                                  "linear-gradient(180deg, rgba(57,255,20,0.06) 0%, rgba(10,26,10,0.3) 100%)",
                                mixBlendMode: "screen",
                              }}
                            />
                            {/* Scanline overlay */}
                            <div
                              className="absolute inset-0 z-10 pointer-events-none scan-line-overlay"
                              style={{ opacity: 0.12 }}
                            />
                            <img
                              src={getProjectImage("signal", project.image)}
                              alt={title}
                              loading="lazy"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              style={{
                                filter:
                                  "brightness(0.7) contrast(1.2) saturate(0.6)",
                              }}
                            />
                          </div>
                        </ScanReveal>

                        {/* Title */}
                        <h3
                          className="text-sm sm:text-base font-bold font-[family-name:var(--font-manrope)] mb-1.5 readout-value transition-all duration-300"
                          style={{
                            color: PHOSPHOR,
                            textShadow: `0 0 8px ${GLOW_GREEN}`,
                          }}
                        >
                          {title}
                        </h3>

                        {/* Client / Description */}
                        <div
                          className="text-[10px] font-[family-name:var(--font-jetbrains)] uppercase tracking-wider mb-2"
                          style={{ color: DIM_AMBER }}
                        >
                          {project.client}
                        </div>
                        <p
                          className="text-[11px] font-[family-name:var(--font-jetbrains)] leading-relaxed mb-3"
                          style={{ color: DIM_GREEN }}
                        >
                          {project.description}
                        </p>

                        {/* Tech tags */}
                        <div className="flex flex-wrap gap-1.5">
                          {project.tech.map((t) => (
                            <span
                              key={t}
                              className="text-[9px] font-[family-name:var(--font-jetbrains)] uppercase tracking-wider px-2 py-0.5"
                              style={{
                                color: DIM_GREEN,
                                border: `1px solid ${GRID_COLOR}`,
                                borderRadius: 2,
                                background: "rgba(57,255,20,0.03)",
                              }}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Bottom signal bar */}
                      <div
                        className="px-4 py-2 flex items-center justify-between"
                        style={{
                          borderTop: `1px solid ${BORDER}`,
                          background: "rgba(57,255,20,0.01)",
                        }}
                      >
                        <span
                          className="text-[8px] font-[family-name:var(--font-jetbrains)] uppercase tracking-wider"
                          style={{ color: MUTED }}
                        >
                          SNR: {(18 + i * 2.3).toFixed(1)}dB
                        </span>
                        <div className="flex items-center gap-2">
                          <div
                            className="rec-blink"
                            style={{
                              width: 4,
                              height: 4,
                              borderRadius: "50%",
                              background: PHOSPHOR,
                              boxShadow: `0 0 4px ${PHOSPHOR}`,
                            }}
                          />
                          <span
                            className="text-[8px] font-[family-name:var(--font-jetbrains)] uppercase tracking-wider"
                            style={{ color: DIM_GREEN }}
                          >
                            LOCKED
                          </span>
                        </div>
                      </div>
                    </Panel>
                  </a>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ */}
      {/*  EXPERTISE — SIGNAL ANALYSIS DISPLAYS               */}
      {/* ═══════════════════════════════════════════════════ */}
      <section id="expertise" className="px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-[1200px] mx-auto w-full">
          <Reveal>
            <div className="flex items-center gap-3 mb-10">
              <div
                style={{
                  width: 8,
                  height: 8,
                  background: AMBER,
                  borderRadius: "50%",
                  boxShadow: `0 0 8px ${AMBER}`,
                }}
              />
              <h2
                className="text-xs sm:text-sm uppercase tracking-[0.3em] font-[family-name:var(--font-jetbrains)]"
                style={{
                  color: AMBER,
                  textShadow: `0 0 10px ${DIM_AMBER}`,
                }}
              >
                CH.2 &mdash; Signal Analysis &mdash; Expertise
              </h2>
              <div
                className="flex-1 h-[1px]"
                style={{ background: BORDER }}
              />
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {expertise.map((item, i) => {
              const meterVal = [0.82, 0.71, 0.9, 0.76][i];
              return (
                <Reveal key={i} delay={i * 0.1}>
                  <Panel
                    className="p-0 signal-card overflow-hidden h-full"
                  >
                    {/* Analysis header */}
                    <div
                      className="px-4 py-2.5 flex items-center justify-between"
                      style={{
                        borderBottom: `1px solid ${BORDER}`,
                        background: "rgba(255,179,0,0.02)",
                      }}
                    >
                      <span
                        className="text-[10px] font-[family-name:var(--font-jetbrains)] uppercase tracking-wider font-bold"
                        style={{ color: AMBER }}
                      >
                        ANALYSIS {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[9px] font-[family-name:var(--font-jetbrains)]"
                          style={{ color: DIM_GREEN }}
                        >
                          LEVEL
                        </span>
                        <div
                          className="relative"
                          style={{
                            width: 60,
                            height: 6,
                            background: MUTED,
                            borderRadius: 3,
                            overflow: "hidden",
                          }}
                        >
                          <motion.div
                            initial={{ width: "0%" }}
                            whileInView={{
                              width: `${meterVal * 100}%`,
                            }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 1.2,
                              ease: "easeOut",
                              delay: 0.3 + i * 0.1,
                            }}
                            style={{
                              height: "100%",
                              background: `linear-gradient(90deg, ${PHOSPHOR}, ${AMBER})`,
                              borderRadius: 3,
                              boxShadow: `0 0 8px ${GLOW_GREEN}`,
                            }}
                          />
                        </div>
                        <span
                          className="text-[9px] font-[family-name:var(--font-jetbrains)]"
                          style={{ color: PHOSPHOR }}
                        >
                          {Math.round(meterVal * 100)}%
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex gap-4">
                      {/* Mini waveform */}
                      <div className="flex-shrink-0 hidden sm:block">
                        <div
                          className="overflow-hidden"
                          style={{
                            width: 80,
                            height: 60,
                            background: SCREEN_BG,
                            border: `1px solid ${GRID_COLOR}`,
                            borderRadius: 2,
                          }}
                        >
                          {mounted && (
                            <Waveform
                              color={i % 2 === 0 ? PHOSPHOR : AMBER}
                              amplitude={18}
                              frequency={2 + i}
                              speed={2 + i}
                              height={60}
                              strokeWidth={1.5}
                            />
                          )}
                        </div>
                      </div>

                      <div className="flex-1">
                        <h3
                          className="text-sm font-bold font-[family-name:var(--font-manrope)] mb-2"
                          style={{
                            color: PHOSPHOR,
                            textShadow: `0 0 8px ${GLOW_GREEN}`,
                          }}
                        >
                          {item.title}
                        </h3>
                        <p
                          className="text-[11px] font-[family-name:var(--font-jetbrains)] leading-relaxed"
                          style={{ color: DIM_GREEN }}
                        >
                          {item.body}
                        </p>
                      </div>
                    </div>
                  </Panel>
                </Reveal>
              );
            })}
          </div>

          {/* Bottom VU meter bank */}
          <Reveal delay={0.3}>
            <Panel label="OUTPUT LEVELS" className="mt-8 p-5 sm:p-8">
              <div className="flex items-end justify-center gap-4 sm:gap-8">
                {vuValues.map((v, i) => (
                  <VUMeter
                    key={i}
                    value={v}
                    label={
                      [
                        "ORCH",
                        "VISION",
                        "VIDEO",
                        "AUDIO",
                        "RAG",
                        "PROD",
                      ][i]
                    }
                  />
                ))}
              </div>
              <div
                className="text-center mt-4 text-[9px] font-[family-name:var(--font-jetbrains)] uppercase tracking-wider"
                style={{ color: DIM_GREEN }}
              >
                Multi-Model Output Levels &mdash; All Channels Nominal
              </div>
            </Panel>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ */}
      {/*  TOOLS — EQUIPMENT RACK                             */}
      {/* ═══════════════════════════════════════════════════ */}
      <section id="tools" className="px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-[1200px] mx-auto w-full">
          <Reveal>
            <div className="flex items-center gap-3 mb-10">
              <div
                style={{
                  width: 8,
                  height: 8,
                  background: PHOSPHOR,
                  borderRadius: "50%",
                  boxShadow: `0 0 8px ${PHOSPHOR}`,
                }}
              />
              <h2
                className="text-xs sm:text-sm uppercase tracking-[0.3em] font-[family-name:var(--font-jetbrains)]"
                style={{
                  color: AMBER,
                  textShadow: `0 0 10px ${DIM_AMBER}`,
                }}
              >
                CH.3 &mdash; Equipment Rack &mdash; Tech Stack
              </h2>
              <div
                className="flex-1 h-[1px]"
                style={{ background: BORDER }}
              />
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {tools.map((group, gi) => (
              <Reveal key={gi} delay={gi * 0.08}>
                <Panel className="p-0 signal-card h-full">
                  {/* Rack unit header */}
                  <div
                    className="px-4 py-3 flex items-center gap-3"
                    style={{
                      borderBottom: `1px solid ${BORDER}`,
                      background: "rgba(57,255,20,0.02)",
                    }}
                  >
                    <ChannelKnob label="" value="" />
                    <div>
                      <div
                        className="text-[10px] font-[family-name:var(--font-jetbrains)] uppercase tracking-[0.2em] font-bold"
                        style={{ color: AMBER }}
                      >
                        {group.label}
                      </div>
                      <div
                        className="text-[9px] font-[family-name:var(--font-jetbrains)]"
                        style={{ color: DIM_GREEN }}
                      >
                        {group.items.length} modules
                      </div>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="p-4 space-y-2">
                    {group.items.map((item, ii) => (
                      <div
                        key={ii}
                        className="flex items-center gap-3 equipment-item cursor-default"
                      >
                        {/* LED indicator */}
                        <div
                          style={{
                            width: 4,
                            height: 4,
                            borderRadius: "50%",
                            background: PHOSPHOR,
                            boxShadow: `0 0 4px ${PHOSPHOR}`,
                            flexShrink: 0,
                          }}
                        />
                        <span
                          className="text-xs font-[family-name:var(--font-jetbrains)]"
                          style={{ color: DIM_GREEN }}
                        >
                          {item}
                        </span>
                        <div
                          className="flex-1 h-[1px]"
                          style={{
                            background: `repeating-linear-gradient(90deg, ${GRID_COLOR} 0px, ${GRID_COLOR} 2px, transparent 2px, transparent 6px)`,
                          }}
                        />
                        <span
                          className="text-[9px] font-[family-name:var(--font-jetbrains)]"
                          style={{ color: MUTED }}
                        >
                          ON
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Rack unit footer */}
                  <div
                    className="px-4 py-2 flex items-center justify-between"
                    style={{
                      borderTop: `1px solid ${BORDER}`,
                    }}
                  >
                    <span
                      className="text-[8px] font-[family-name:var(--font-jetbrains)] uppercase tracking-wider"
                      style={{ color: MUTED }}
                    >
                      UNIT {String(gi + 1).padStart(2, "0")}
                    </span>
                    <SignalStrength strength={4 + (gi % 2)} />
                  </div>
                </Panel>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ */}
      {/*  FOOTER — TRANSMISSION LOG                          */}
      {/* ═══════════════════════════════════════════════════ */}
      <section id="footer" className="px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-[1200px] mx-auto w-full">
          <Reveal>
            <Panel label="TRANSMISSION" className="p-5 sm:p-8">
              <OscilloscopeScreen>
                <div className="p-6 sm:p-10">
                  {/* Contact header */}
                  <div
                    className="text-[10px] font-[family-name:var(--font-jetbrains)] uppercase tracking-[0.3em] mb-6"
                    style={{ color: DIM_AMBER }}
                  >
                    Outgoing Transmission &mdash; Open Channel
                  </div>

                  <h3
                    className="text-xl sm:text-2xl font-bold font-[family-name:var(--font-manrope)] mb-8"
                    style={{
                      color: PHOSPHOR,
                      textShadow: `0 0 15px ${GLOW_GREEN}`,
                    }}
                  >
                    Ready to transmit.
                  </h3>

                  {/* Contact entries */}
                  <div className="space-y-3">
                    {[
                      {
                        label: "EMAIL",
                        value: "hello@grox.ai",
                        href: "mailto:hello@grox.ai",
                      },
                      {
                        label: "GITHUB",
                        value: "github.com/1aday",
                        href: "https://github.com/1aday",
                      },
                      {
                        label: "LOCATION",
                        value: "Remote / Worldwide",
                        href: null,
                      },
                    ].map((entry, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4"
                      >
                        <span
                          className="text-[10px] font-[family-name:var(--font-jetbrains)] w-20 text-right uppercase tracking-wider"
                          style={{ color: AMBER }}
                        >
                          {entry.label}
                        </span>
                        <div
                          style={{
                            width: 1,
                            height: 12,
                            background: GRID_COLOR,
                          }}
                        />
                        {entry.href ? (
                          <a
                            href={entry.href}
                            target={
                              entry.href.startsWith("mailto")
                                ? undefined
                                : "_blank"
                            }
                            rel="noopener noreferrer"
                            className="text-xs font-[family-name:var(--font-jetbrains)] transition-colors duration-200 underline underline-offset-2"
                            style={{ color: DIM_GREEN }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.color = PHOSPHOR)
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.color = DIM_GREEN)
                            }
                          >
                            {entry.value}
                          </a>
                        ) : (
                          <span
                            className="text-xs font-[family-name:var(--font-jetbrains)]"
                            style={{ color: DIM_GREEN }}
                          >
                            {entry.value}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Waveform decoration */}
                  <div className="mt-8">
                    {mounted && (
                      <Waveform
                        color={PHOSPHOR}
                        amplitude={10}
                        frequency={8}
                        speed={1}
                        height={40}
                        strokeWidth={1}
                        opacity={0.3}
                      />
                    )}
                  </div>
                </div>
              </OscilloscopeScreen>

              {/* Footer bar */}
              <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="rec-blink"
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: "50%",
                      background: PHOSPHOR,
                      boxShadow: `0 0 4px ${PHOSPHOR}`,
                    }}
                  />
                  <span
                    className="text-[9px] font-[family-name:var(--font-jetbrains)] uppercase tracking-wider"
                    style={{ color: DIM_GREEN }}
                  >
                    All Systems Operational
                  </span>
                </div>
                <span
                  className="text-[9px] font-[family-name:var(--font-jetbrains)]"
                  style={{ color: MUTED }}
                >
                  &copy; {new Date().getFullYear()} Grox AI &mdash;
                  Signal v2.0
                </span>
              </div>
            </Panel>
          </Reveal>
        </div>
      </section>

      {/* Theme Switcher */}
      <ThemeSwitcher current="/signal" />
    </div>
  );
}
