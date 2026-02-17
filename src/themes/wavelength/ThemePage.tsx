"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "@/app/data/projects";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";

/* ─── Spectrum Palette ─── */
const C = {
  bg: "#0A0A14", bgCard: "rgba(12,12,24,0.85)", accent: "#00BFFF",
  white: "#F0F0FF", textMuted: "rgba(240,240,255,0.5)",
  border: "rgba(0,191,255,0.2)", cardBorder: "rgba(255,255,255,0.08)",
};
const SPECTRUM = ["#FF0000","#FF7700","#FFFF00","#00FF00","#00FFFF","#0066FF","#4400FF","#8B00FF"];
const SPECTRUM_10 = ["#FF0000","#FF4400","#FF7700","#FFBB00","#FFFF00","#66FF00","#00FF00","#00FFAA","#00FFFF","#8B00FF"];
const FREQ_LABELS = ["430 THz","500 THz","520 THz","560 THz","610 THz","640 THz","670 THz","700 THz","750 THz","790 THz"];
const WAVE_LABELS = ["700 nm","630 nm","580 nm","540 nm","490 nm","470 nm","450 nm","430 nm","400 nm","380 nm"];

function Section({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section ref={ref} className={className} initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}>
      {children}
    </motion.section>
  );
}

/* ═══ SVG COMPONENTS ═══ */

function SineWave({ color, amplitude = 30, frequency = 2, phase = 0, strokeWidth = 2, opacity = 0.6, yOffset = 0, animDuration = 4 }: {
  color: string; amplitude?: number; frequency?: number; phase?: number;
  strokeWidth?: number; opacity?: number; yOffset?: number; animDuration?: number;
}) {
  const pts: string[] = [];
  for (let x = 0; x <= 1200; x += 2) {
    const y = 50 + yOffset + amplitude * Math.sin((x / 1200) * Math.PI * 2 * frequency + phase);
    pts.push(`${x},${y.toFixed(2)}`);
  }
  return (
    <motion.path d={`M ${pts.join(" L ")}`} stroke={color} strokeWidth={strokeWidth} fill="none"
      opacity={opacity} strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ duration: animDuration, ease: "easeOut" }} />
  );
}

function PrismDispersion() {
  return (
    <svg viewBox="0 0 800 400" fill="none" className="w-full h-auto" style={{ maxWidth: 600 }}>
      <motion.line x1="0" y1="200" x2="280" y2="200" stroke="white" strokeWidth="4"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.9 }}
        transition={{ duration: 1.5, ease: "easeInOut" }} />
      <motion.polygon points="280,80 440,320 120,320" fill="rgba(0,191,255,0.08)"
        stroke="rgba(0,191,255,0.5)" strokeWidth="2" initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.5 }}
        style={{ transformOrigin: "280px 200px" }} />
      <motion.line x1="280" y1="200" x2="380" y2="200" stroke="rgba(255,255,255,0.3)"
        strokeWidth="3" strokeDasharray="4 4" initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }} transition={{ delay: 1.5, duration: 0.5 }} />
      {SPECTRUM.map((color, i) => {
        const angle = -28 + (i * 56) / (SPECTRUM.length - 1);
        const rad = (angle * Math.PI) / 180;
        const x2 = 380 + Math.cos(rad) * 400;
        const y2 = 200 + Math.sin(rad) * 400;
        return (
          <motion.line key={i} x1="380" y1="200" x2={x2} y2={y2} stroke={color} strokeWidth="3" opacity={0.8}
            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.8 }}
            transition={{ duration: 1.2, delay: 1.8 + i * 0.12, ease: "easeOut" }} />
        );
      })}
      <motion.text x="280" y="360" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="12"
        fontFamily="var(--font-jetbrains)" initial={{ opacity: 0 }} animate={{ opacity: 0.3 }}
        transition={{ delay: 2.5 }}>DISPERSION PRISM</motion.text>
    </svg>
  );
}

function WaveInterference({ color, type = "constructive" }: { color: string; type?: "constructive" | "destructive" }) {
  const p1: string[] = [], p2: string[] = [], pR: string[] = [];
  for (let x = 0; x <= 300; x += 2) {
    const ph2 = type === "constructive" ? 0 : Math.PI;
    const y1 = 40 + 15 * Math.sin((x / 300) * Math.PI * 4);
    const y2 = 40 + 15 * Math.sin((x / 300) * Math.PI * 4 + ph2);
    p1.push(`${x},${y1.toFixed(2)}`); p2.push(`${x},${y2.toFixed(2)}`);
    pR.push(`${x},${(40 + (y1 - 40) + (y2 - 40)).toFixed(2)}`);
  }
  return (
    <svg viewBox="0 0 300 80" fill="none" className="w-full" style={{ height: 60 }}>
      <path d={`M ${p1.join(" L ")}`} stroke={color} strokeWidth="1" opacity={0.3} />
      <path d={`M ${p2.join(" L ")}`} stroke={color} strokeWidth="1" opacity={0.3} strokeDasharray="3 3" />
      <motion.path d={`M ${pR.join(" L ")}`} stroke={color} strokeWidth="2" opacity={0.9}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, ease: "easeOut" }} />
    </svg>
  );
}

function AntennaIcon({ color, size = 32 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <line x1="16" y1="28" x2="16" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <motion.circle cx="16" cy="8" r="4" stroke={color} strokeWidth="1.5" fill="none"
        initial={{ r: 2 }} animate={{ r: [2, 6, 2] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
      <motion.circle cx="16" cy="8" r="8" stroke={color} strokeWidth="1" fill="none" opacity={0.3}
        initial={{ r: 4 }} animate={{ r: [4, 12, 4] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }} />
      <line x1="10" y1="28" x2="22" y2="28" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function WaveBackground() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none", overflow: "hidden" }}>
      <svg viewBox="0 0 1200 100" preserveAspectRatio="none"
        style={{ position: "absolute", bottom: 0, left: 0, width: "200%", height: 200, animation: "waveSlide 12s linear infinite" }}>
        <SineWave color={SPECTRUM[0]} amplitude={8} frequency={3} phase={0} strokeWidth={1} opacity={0.15} yOffset={0} animDuration={0} />
        <SineWave color={SPECTRUM[2]} amplitude={6} frequency={4} phase={1} strokeWidth={1} opacity={0.12} yOffset={15} animDuration={0} />
        <SineWave color={SPECTRUM[4]} amplitude={10} frequency={2.5} phase={2} strokeWidth={1} opacity={0.1} yOffset={30} animDuration={0} />
        <SineWave color={SPECTRUM[6]} amplitude={5} frequency={5} phase={3} strokeWidth={1} opacity={0.08} yOffset={45} animDuration={0} />
      </svg>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(to right, ${SPECTRUM.join(", ")})`, opacity: 0.6 }} />
    </div>
  );
}

function NoiseOverlay() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 2 }}>
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.03 }}>
        <filter id="wave-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#wave-noise)" />
      </svg>
    </div>
  );
}

function HeroWaves() {
  return (
    <svg viewBox="0 0 1200 300" fill="none" preserveAspectRatio="none"
      style={{ position: "absolute", top: "50%", left: 0, width: "100%", height: 300,
        transform: "translateY(-50%)", zIndex: 2, pointerEvents: "none" }}>
      {SPECTRUM.map((color, i) => (
        <SineWave key={i} color={color} amplitude={12 + i * 4} frequency={1.5 + i * 0.5}
          phase={i * 0.8} strokeWidth={1.5} opacity={0.2 + i * 0.03} yOffset={100 + i * 12} animDuration={2 + i * 0.3} />
      ))}
    </svg>
  );
}

function CardWaveBorder({ color }: { color: string }) {
  const pts: string[] = [];
  for (let x = 0; x <= 400; x += 2) {
    const y = 8 + 6 * Math.sin((x / 400) * Math.PI * 6);
    pts.push(`${x},${y.toFixed(2)}`);
  }
  return (
    <svg viewBox="0 0 400 16" preserveAspectRatio="none" className="w-full" style={{ height: 16, display: "block" }}>
      <path d={`M 0,16 L 0,${pts[0]?.split(",")[1]} L ${pts.join(" L ")} L 400,16 Z`} fill={`${color}15`} />
      <path d={`M ${pts.join(" L ")}`} stroke={color} strokeWidth="1.5" fill="none" opacity={0.7} />
    </svg>
  );
}

function SpectrumText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={className} style={{
      background: `linear-gradient(90deg, ${SPECTRUM.join(", ")})`,
      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
    }}>{children}</span>
  );
}

/* ═══ MAIN PAGE ═══ */
export default function WavelengthPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const statReadings = [
    { value: stats[0].value, label: stats[0].label, freq: "30.0 Hz", wave: "\u221E m" },
    { value: stats[1].value, label: stats[1].label, freq: "12.0 Hz", wave: "2.5\u00D710\u2077 m" },
    { value: stats[2].value, label: stats[2].label, freq: "8.0 Hz", wave: "3.7\u00D710\u2077 m" },
  ];
  const interferenceTypes: Array<"constructive" | "destructive"> = ["constructive", "destructive", "constructive", "destructive"];

  if (!mounted) return null;

  return (
    <>
      <style>{`
        @keyframes waveSlide { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes spectrumShimmer { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes oscillate { 0% { transform: translateX(0); } 50% { transform: translateX(12px); } 100% { transform: translateX(0); } }
        @keyframes pulseBright { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
        @keyframes colorCycle { 0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(360deg); } }
        @keyframes beamDraw { 0% { stroke-dashoffset: 600; } 100% { stroke-dashoffset: 0; } }
        @keyframes amplitudePulse { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(1.3); } }
        @keyframes fadeFloat { 0%, 100% { opacity: 0.15; transform: translateY(0); } 50% { opacity: 0.3; transform: translateY(-10px); } }
        .spectrum-shimmer-text {
          background: linear-gradient(90deg, #FF0000, #FF7700, #FFFF00, #00FF00, #00FFFF, #0066FF, #8B00FF, #FF0000);
          background-size: 200% 100%; -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; animation: spectrumShimmer 6s linear infinite;
        }
        .wave-card:hover .wave-card-inner { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(0,0,0,0.5); }
        .wave-card-inner { transition: transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s cubic-bezier(0.22,1,0.36,1); }
        .spectrum-bar-hover:hover { animation: colorCycle 2s linear infinite; }
        .tool-freq-band:hover { filter: brightness(1.4); transform: scaleY(1.1); }
        .tool-freq-band { transition: all 0.3s ease; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0A0A14; }
        ::-webkit-scrollbar-thumb { background: rgba(0,191,255,0.3); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(0,191,255,0.5); }
      `}</style>

      <div style={{ minHeight: "100vh", background: C.bg, color: C.white,
        fontFamily: "var(--font-inter)", position: "relative", overflow: "hidden" }}>
        <WaveBackground />
        <NoiseOverlay />

        {/* ═══ HERO ═══ */}
        <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column",
          justifyContent: "center", alignItems: "center", zIndex: 10, padding: "40px 24px", overflow: "hidden" }}>
          <HeroWaves />
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            style={{ position: "relative", zIndex: 3, width: "100%", maxWidth: 600, margin: "0 auto" }}>
            <PrismDispersion />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }} style={{ textAlign: "center", position: "relative", zIndex: 3 }}>
            <h1 className="spectrum-shimmer-text" style={{ fontFamily: "var(--font-space-grotesk)",
              fontSize: "clamp(52px, 10vw, 120px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1, margin: 0 }}>
              WAVELENGTH
            </h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 1.2, duration: 1 }}
              style={{ fontFamily: "var(--font-jetbrains)", fontSize: 13, color: C.textMuted,
                letterSpacing: "0.3em", marginTop: 16, textTransform: "uppercase" }}>
              Electromagnetic Spectrum Portfolio
            </motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} transition={{ delay: 1.6, duration: 1 }}
              style={{ fontFamily: "var(--font-jetbrains)", fontSize: 14, color: C.accent, marginTop: 12 }}>
              c = f{"\u00B7"}{"\u03BB"} &nbsp;|&nbsp; E = hf &nbsp;|&nbsp; {"\u03BB"} = c/f
            </motion.p>
          </motion.div>

          {/* Stats as frequency readings */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            style={{ display: "flex", gap: 48, marginTop: 48, position: "relative", zIndex: 3, flexWrap: "wrap", justifyContent: "center" }}>
            {statReadings.map((s, i) => (
              <div key={i} style={{ textAlign: "center", padding: "20px 24px", background: "rgba(0,191,255,0.04)",
                border: `1px solid ${C.border}`, borderRadius: 12, minWidth: 140 }}>
                <div style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 36, fontWeight: 700,
                  color: SPECTRUM_10[i * 3] || C.accent }}>{s.value}</div>
                <div style={{ fontFamily: "var(--font-sora)", fontSize: 13, color: C.white, marginTop: 4, fontWeight: 500 }}>{s.label}</div>
                <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, color: C.textMuted,
                  marginTop: 8, borderTop: `1px solid ${C.border}`, paddingTop: 8 }}>
                  {s.freq} &bull; {s.wave}
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: 2.5, duration: 1 }}
            style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", zIndex: 3, textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, color: C.textMuted, letterSpacing: "0.15em" }}>
              SCROLL TO EXPLORE SPECTRUM
            </div>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
              style={{ marginTop: 8, color: C.accent, fontSize: 18 }}>{"\u2193"}</motion.div>
          </motion.div>
        </section>

        {/* ═══ PROJECTS ═══ */}
        <Section className="relative z-10" delay={0}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px 40px" }}>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                transition={{ duration: 0.6 }} style={{ fontFamily: "var(--font-jetbrains)", fontSize: 11,
                  letterSpacing: "0.3em", color: C.textMuted, textTransform: "uppercase", marginBottom: 12 }}>
                EMISSION SPECTRUM &bull; 10 SPECTRAL LINES
              </motion.div>
              <h2 style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 700, margin: 0 }}>
                <SpectrumText>Projects</SpectrumText>
              </h2>
              <div style={{ width: 300, height: 3, margin: "16px auto 0",
                background: `linear-gradient(to right, ${SPECTRUM.join(", ")})`, borderRadius: 2, opacity: 0.6 }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              {projects.map((project, i) => (
                <ProjectCard key={i} project={project} index={i}
                  color={SPECTRUM_10[i]} freq={FREQ_LABELS[i]} wave={WAVE_LABELS[i]} />
              ))}
            </div>
          </div>
        </Section>

        {/* ═══ EXPERTISE ═══ */}
        <Section className="relative z-10" delay={0.1}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 11, letterSpacing: "0.3em",
                color: C.textMuted, textTransform: "uppercase", marginBottom: 12 }}>
                WAVE INTERFERENCE PATTERNS
              </div>
              <h2 style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 700, margin: 0 }}>
                <SpectrumText>Expertise</SpectrumText>
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
              {expertise.map((item, i) => (
                <ExpertiseCard key={i} item={item} index={i}
                  color={SPECTRUM_10[i * 2 + 1] || C.accent} interferenceType={interferenceTypes[i]} />
              ))}
            </div>
          </div>
        </Section>

        {/* ═══ TOOLS ═══ */}
        <Section className="relative z-10" delay={0.1}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 11, letterSpacing: "0.3em",
                color: C.textMuted, textTransform: "uppercase", marginBottom: 12 }}>
                SPECTRUM ANALYZER
              </div>
              <h2 style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 700, margin: 0 }}>
                <SpectrumText>Tools</SpectrumText>
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
              {tools.map((toolGroup, i) => (
                <ToolGroup key={i} group={toolGroup} index={i} />
              ))}
            </div>
          </div>
        </Section>

        {/* ═══ FOOTER ═══ */}
        <footer style={{ position: "relative", zIndex: 10, padding: "80px 24px 48px", textAlign: "center" }}>
          <div style={{ width: "100%", maxWidth: 800, height: 2, margin: "0 auto 48px",
            background: `linear-gradient(to right, transparent, ${SPECTRUM.join(", ")}, transparent)`, opacity: 0.5 }} />
          <svg viewBox="0 0 600 60" fill="none"
            style={{ maxWidth: 400, width: "100%", height: 40, margin: "0 auto 32px", display: "block" }}>
            {SPECTRUM.slice(0, 5).map((color, i) => {
              const pts: string[] = [];
              for (let x = 0; x <= 600; x += 3) {
                const y = 30 + (8 - i * 1.5) * Math.sin((x / 600) * Math.PI * (3 + i) + i * 0.6);
                pts.push(`${x},${y.toFixed(2)}`);
              }
              return <path key={i} d={`M ${pts.join(" L ")}`} stroke={color} strokeWidth="1" opacity={0.25} fill="none" />;
            })}
          </svg>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h3 className="spectrum-shimmer-text" style={{ fontFamily: "var(--font-space-grotesk)",
              fontSize: "clamp(24px, 4vw, 44px)", fontWeight: 700, margin: 0 }}>
              END OF SPECTRUM
            </h3>
            <p style={{ fontFamily: "var(--font-jetbrains)", fontSize: 12, color: C.textMuted, marginTop: 16, letterSpacing: "0.1em" }}>
              {"\u03C8"}(x,t) = A sin(kx - {"\u03C9"}t + {"\u03C6"}) &nbsp;&bull;&nbsp; c = 3.0 {"\u00D7"} 10{"\u2078"} m/s
            </p>
            <p style={{ fontFamily: "var(--font-sora)", fontSize: 14, color: "rgba(240,240,255,0.35)", marginTop: 24 }}>
              Grox Optics Lab
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 2, marginTop: 20 }}>
              {SPECTRUM.map((color, i) => (
                <motion.div key={i} style={{ width: 24, height: 4, background: color, borderRadius: 1 }}
                  animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.2 }} />
              ))}
            </div>
            <p style={{ fontFamily: "var(--font-jetbrains)", fontSize: 11, color: "rgba(240,240,255,0.2)", marginTop: 32 }}>
              {"\u00A9"} 2025 &bull; All wavelengths reserved &bull; 380-700 nm visible spectrum
            </p>
          </motion.div>
        </footer>

        <ThemeSwitcher current="/wavelength" variant="dark" />
      </div>
    </>
  );
}

/* ═══ PROJECT CARD ═══ */
function ProjectCard({ project, index, color, freq, wave }: {
  project: (typeof projects)[number]; index: number; color: string; freq: string; wave: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div ref={ref} className="wave-card" initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="wave-card-inner" style={{ background: C.bgCard,
        border: `1px solid ${hovered ? `${color}44` : C.cardBorder}`, borderRadius: 16, overflow: "hidden", position: "relative" }}>
        <CardWaveBorder color={color} />

        {/* Frequency label strip */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 24px", marginTop: 4 }}>
          <AntennaIcon color={color} size={20} />
          <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, color: color,
            letterSpacing: "0.15em", textTransform: "uppercase" }}>
            SPECTRAL LINE {String(index + 1).padStart(2, "0")} &bull; {freq} &bull; {wave}
          </span>
          <div style={{ flex: 1 }} />
          <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, color: C.textMuted }}>{project.year}</span>
        </div>

        <div style={{ padding: "16px 24px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 22, fontWeight: 700,
                margin: 0, lineHeight: 1.2, color: C.white, whiteSpace: "pre-line" }}>
                {project.title}
              </h3>
              <div style={{ fontFamily: "var(--font-sora)", fontSize: 12, color: color, marginTop: 6, fontWeight: 500 }}>
                {project.client}
              </div>
            </div>
            {/* Mini spectrum visualization */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 2, paddingTop: 4 }}>
              {[...Array(8)].map((_, j) => (
                <motion.div key={j} style={{ width: 3, borderRadius: 1,
                  background: j === index % 8 ? color : `${color}33` }}
                  animate={hovered ? { height: [8, 16 + Math.random() * 12, 8] } : { height: 8 }}
                  transition={{ duration: 0.8, repeat: hovered ? Infinity : 0, delay: j * 0.08 }} />
              ))}
            </div>
          </div>

          <p style={{ fontFamily: "var(--font-inter)", fontSize: 14, lineHeight: 1.6,
            color: "rgba(240,240,255,0.65)", margin: 0 }}>{project.description}</p>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: 13, lineHeight: 1.6,
            color: "rgba(240,240,255,0.45)", margin: 0 }}>{project.technical}</p>

          {/* Tech tags + link */}
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
            {project.tech.map((t) => (
              <span key={t} style={{ fontFamily: "var(--font-jetbrains)", fontSize: 11, padding: "4px 10px",
                borderRadius: 6, background: `${color}12`, border: `1px solid ${color}30`, color: color }}>{t}</span>
            ))}
            <div style={{ flex: 1 }} />
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: "var(--font-jetbrains)", fontSize: 11, color: C.textMuted,
                  textDecoration: "none", display: "flex", alignItems: "center", gap: 4, transition: "color 0.3s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = color)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                Source
              </a>
            )}
          </div>
        </div>

        <div style={{ height: 2, background: `linear-gradient(to right, transparent, ${color}, transparent)`,
          opacity: hovered ? 0.6 : 0.2, transition: "opacity 0.4s" }} />
      </div>
    </motion.div>
  );
}

/* ═══ EXPERTISE CARD ═══ */
function ExpertiseCard({ item, index, color, interferenceType }: {
  item: (typeof expertise)[number]; index: number; color: string;
  interferenceType: "constructive" | "destructive";
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12 }}
      style={{ background: C.bgCard, border: `1px solid ${C.cardBorder}`, borderRadius: 16,
        overflow: "hidden", position: "relative" }}>
      <div style={{ height: 3, background: `linear-gradient(to right, ${color}00, ${color}, ${color}00)` }} />
      <div style={{ padding: "16px 20px 0" }}>
        <WaveInterference color={color} type={interferenceType} />
      </div>
      <div style={{ padding: "4px 20px 0", fontFamily: "var(--font-jetbrains)", fontSize: 9,
        color: C.textMuted, letterSpacing: "0.15em", textTransform: "uppercase" }}>
        {interferenceType === "constructive" ? "CONSTRUCTIVE" : "DESTRUCTIVE"} INTERFERENCE &bull; MODE {index + 1}
      </div>
      <div style={{ padding: "12px 20px 24px" }}>
        <h3 style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 20, fontWeight: 700, margin: 0, color }}>{item.title}</h3>
        <p style={{ fontFamily: "var(--font-inter)", fontSize: 14, lineHeight: 1.65,
          color: "rgba(240,240,255,0.55)", margin: "10px 0 0" }}>{item.body}</p>
      </div>
      <div style={{ display: "flex", padding: "0 20px 16px", gap: 2 }}>
        {SPECTRUM.map((c, j) => (
          <div key={j} style={{ flex: 1, height: 2, borderRadius: 1, background: c,
            opacity: j <= index * 2 + 1 ? 0.6 : 0.1 }} />
        ))}
      </div>
    </motion.div>
  );
}

/* ═══ TOOL GROUP (Spectrum Analyzer) ═══ */
function ToolGroup({ group, index }: { group: (typeof tools)[number]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const groupColor = SPECTRUM_10[index] || C.accent;
  const barHeights = group.items.map((_, j) => 40 + ((j * 17 + index * 13) % 55));

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.08 }}
      style={{ background: C.bgCard, border: `1px solid ${C.cardBorder}`, borderRadius: 16,
        padding: 24, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(to right, transparent, ${groupColor}, transparent)`, opacity: 0.5 }} />

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <AntennaIcon color={groupColor} size={24} />
        <div>
          <h3 style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 18, fontWeight: 700,
            margin: 0, color: groupColor }}>{group.label}</h3>
          <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 9, color: C.textMuted,
            letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 2 }}>
            FREQUENCY BAND {String(index + 1).padStart(2, "0")} &bull; {group.items.length} CHANNELS
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 16, padding: "0 8px" }}>
        {group.items.map((item, j) => {
          const itemColor = SPECTRUM_10[(index + j * 2) % SPECTRUM_10.length];
          return (
            <div key={j} className="tool-freq-band"
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flex: 1 }}>
              <div style={{ position: "relative", width: "100%", maxWidth: 48, height: 100,
                display: "flex", alignItems: "flex-end" }}>
                <motion.div style={{ width: "100%", background: `linear-gradient(to top, ${itemColor}, ${itemColor}66)`,
                  borderRadius: "4px 4px 0 0", boxShadow: `0 0 16px ${itemColor}33, inset 0 1px 0 ${itemColor}88`,
                  position: "relative" }}
                  initial={{ height: 0 }} animate={inView ? { height: `${barHeights[j]}%` } : { height: 0 }}
                  transition={{ duration: 1, delay: 0.3 + j * 0.1, ease: [0.22, 1, 0.36, 1] }}>
                  <motion.div style={{ position: "absolute", top: -2, left: "50%", transform: "translateX(-50%)",
                    width: 6, height: 6, borderRadius: "50%", background: itemColor,
                    boxShadow: `0 0 8px ${itemColor}` }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: j * 0.2 }} />
                </motion.div>
              </div>
              <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, color: "rgba(240,240,255,0.5)",
                textAlign: "center", lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden",
                textOverflow: "ellipsis", maxWidth: 80 }}>{item}</span>
            </div>
          );
        })}
      </div>

      <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${groupColor}40, transparent)`, marginTop: 2 }} />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8,
        fontFamily: "var(--font-jetbrains)", fontSize: 8, color: C.textMuted }}>
        <span>{(index + 1) * 100} MHz</span>
        <span>{(index + 1) * 100 + 50} MHz</span>
        <span>{(index + 1) * 200} MHz</span>
      </div>
    </motion.div>
  );
}
