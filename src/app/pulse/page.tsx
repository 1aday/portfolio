"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";

/* ─── Colors ─── */
const C = {
  bg: "#0A0A0F",
  bgCard: "#111118",
  red: "#EF4444",
  redGlow: "rgba(239,68,68,0.25)",
  redMuted: "rgba(239,68,68,0.6)",
  green: "#22C55E",
  greenDim: "rgba(34,197,94,0.15)",
  text: "#E8E8EC",
  textMuted: "rgba(232,232,236,0.45)",
  border: "rgba(255,255,255,0.06)",
  gridLine: "rgba(255,255,255,0.03)",
};

/* ─── Fonts ─── */
const mono = "var(--font-jetbrains), 'JetBrains Mono', monospace";
const heading = "var(--font-space-grotesk), 'Space Grotesk', sans-serif";

/* ─── ECG PQRST wave segment (one beat) ─── */
const BEAT_WIDTH = 120;
const ecgBeatPath = (offsetX: number) =>
  `${offsetX},50 ${offsetX + 20},50 ${offsetX + 25},50 ${offsetX + 28},20 ${offsetX + 32},80 ${offsetX + 35},45 ${offsetX + 40},50 ${offsetX + 60},50 ${offsetX + 80},50 ${offsetX + 85},50 ${offsetX + 88},30 ${offsetX + 92},70 ${offsetX + 95},48 ${offsetX + 100},50 ${offsetX + 120},50`;

function buildEcgPoints(beats: number): string {
  const segments: string[] = [];
  for (let i = 0; i < beats; i++) {
    segments.push(ecgBeatPath(i * BEAT_WIDTH));
  }
  return segments.join(" ");
}

/* ─── Inject global keyframes ─── */
function useInjectKeyframes() {
  useEffect(() => {
    const id = "pulse-keyframes";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      @keyframes ecgScroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-${BEAT_WIDTH * 4}px); }
      }
      @keyframes ecgDash {
        to { stroke-dashoffset: -2400; }
      }
      @keyframes bpmPulse {
        0%, 100% { transform: scale(1); }
        15% { transform: scale(1.15); }
        30% { transform: scale(1); }
      }
      @keyframes statusPing {
        0% { transform: scale(1); opacity: 1; }
        75% { transform: scale(2.5); opacity: 0; }
        100% { transform: scale(1); opacity: 0; }
      }
      @keyframes flatlineSpike {
        0%, 40%, 100% { d: path("M0,1 L1000,1"); }
        45% { d: path("M0,1 Q200,1 220,1 L225,1 L228,-8 L232,10 L235,0 L240,1 Q260,1 1000,1"); }
      }
      @keyframes monitorFlicker {
        0%, 97%, 100% { opacity: 1; }
        98% { opacity: 0.85; }
      }
      @keyframes gridPulse {
        0%, 100% { opacity: 0.03; }
        50% { opacity: 0.06; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };
  }, []);
}

/* ─── Timestamp helper ─── */
function useTimestamp() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);
  return time;
}

/* ─── Status Dot ─── */
function StatusDot({ color = C.green, size = 8 }: { color?: string; size?: number }) {
  return (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", width: size * 3, height: size * 3 }}>
      <span
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: color,
          animation: "statusPing 1.5s cubic-bezier(0,0,0.2,1) infinite",
          opacity: 0.6,
        }}
      />
      <span
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: color,
          position: "relative",
          zIndex: 1,
        }}
      />
    </span>
  );
}

/* ─── ECG Line Component ─── */
function ECGLine({ width = 960, height = 100, beats = 8, strokeColor = C.red, speed = 6 }: { width?: number; height?: number; beats?: number; strokeColor?: string; speed?: number }) {
  const points = buildEcgPoints(beats);
  const totalWidth = beats * BEAT_WIDTH;

  return (
    <div style={{ width, height, overflow: "hidden", position: "relative" }}>
      <svg
        width={totalWidth * 2}
        height={height}
        viewBox={`0 0 ${totalWidth * 2} ${height}`}
        style={{
          animation: `ecgScroll ${speed}s linear infinite`,
        }}
      >
        {/* Glow layer */}
        <polyline
          points={points + " " + buildEcgPoints(beats).split(" ").map((p) => {
            const [x, y] = p.split(",");
            return `${parseFloat(x) + totalWidth},${y}`;
          }).join(" ")}
          fill="none"
          stroke={strokeColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="blur(6px)"
          opacity="0.4"
        />
        {/* Main line */}
        <polyline
          points={points + " " + buildEcgPoints(beats).split(" ").map((p) => {
            const [x, y] = p.split(",");
            return `${parseFloat(x) + totalWidth},${y}`;
          }).join(" ")}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/* ─── Flatline Divider ─── */
function FlatlineDivider() {
  return (
    <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 0" }}>
      <svg width="100%" height="3" viewBox="0 0 1000 3" preserveAspectRatio="none" style={{ maxWidth: 1000 }}>
        <line x1="0" y1="1.5" x2="1000" y2="1.5" stroke={C.redMuted} strokeWidth="1" opacity="0.3" />
        <line x1="440" y1="1.5" x2="560" y2="1.5" stroke={C.red} strokeWidth="1.5" opacity="0.6" />
        {/* spike */}
        <polyline
          points="470,1.5 480,1.5 485,1.5 488,-6 492,9 495,0 500,1.5 510,1.5 515,1.5 518,-4 522,7 525,1 530,1.5"
          fill="none"
          stroke={C.red}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/* ─── Monitor Bezel Card ─── */
function MonitorBezel({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        background: C.bgCard,
        border: `1px solid ${C.border}`,
        borderRadius: 16,
        boxShadow: `inset 0 1px 0 ${C.border}, inset 0 -1px 0 rgba(0,0,0,0.5), 0 0 40px rgba(0,0,0,0.4)`,
        overflow: "hidden",
        position: "relative",
        animation: "monitorFlicker 8s ease-in-out infinite",
        ...style,
      }}
    >
      {/* Scanline overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />
      {children}
    </div>
  );
}

/* ─── Grid Background ─── */
function GridBG() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        backgroundImage: `
          linear-gradient(${C.gridLine} 1px, transparent 1px),
          linear-gradient(90deg, ${C.gridLine} 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
        animation: "gridPulse 4s ease-in-out infinite",
      }}
    />
  );
}

/* ─── BPM Counter ─── */
function BPMCounter({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const duration = 2000;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setDisplay(Math.round(progress * value));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return (
    <span
      style={{
        fontFamily: mono,
        fontSize: 72,
        fontWeight: 700,
        color: C.red,
        display: "inline-block",
        animation: "bpmPulse 1s ease-in-out infinite",
        textShadow: `0 0 20px ${C.redGlow}, 0 0 40px ${C.redGlow}`,
        lineHeight: 1,
      }}
    >
      {display}
    </span>
  );
}

/* ═══════════════════════════════════════════════
   NAVIGATION
   ═══════════════════════════════════════════════ */
function Navigation() {
  const time = useTimestamp();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "0 32px",
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontFamily: mono,
        fontSize: 12,
        color: C.textMuted,
        background: scrolled ? "rgba(10,10,15,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
        transition: "background 0.3s, border-bottom 0.3s, backdrop-filter 0.3s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <StatusDot color={C.green} size={6} />
        <span style={{ color: C.text, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" }}>
          PULSE
        </span>
        <span style={{ color: C.textMuted }}>v1.0.0</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        {["Vitals", "Cases", "Diagnostics", "Protocols"].map((item, i) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            style={{
              color: C.textMuted,
              textDecoration: "none",
              textTransform: "uppercase",
              letterSpacing: 1.5,
              transition: "color 0.2s",
              fontSize: 11,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.red)}
            onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}
          >
            {item}
          </a>
        ))}
        <span style={{ color: C.redMuted, fontVariantNumeric: "tabular-nums" }}>{time}</span>
      </div>
    </motion.nav>
  );
}

/* ═══════════════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════════════ */
function HeroSection() {
  const time = useTimestamp();

  return (
    <section
      id="vitals"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        padding: "120px 32px 80px",
        overflow: "hidden",
      }}
    >
      {/* ECG background waveform */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          opacity: 0.12,
          width: "120%",
        }}
      >
        <ECGLine width={1400} height={200} beats={12} speed={8} />
      </div>

      {/* Monitor readout top-left */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
        style={{
          position: "absolute",
          top: 80,
          left: 40,
          fontFamily: mono,
          fontSize: 11,
          color: C.textMuted,
          lineHeight: 1.8,
        }}
      >
        <div>SYS.STATUS: <span style={{ color: C.green }}>NOMINAL</span></div>
        <div>UPTIME: 99.97%</div>
        <div>CLOCK: {time}</div>
      </motion.div>

      {/* Monitor readout top-right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        style={{
          position: "absolute",
          top: 80,
          right: 40,
          fontFamily: mono,
          fontSize: 11,
          color: C.textMuted,
          textAlign: "right",
          lineHeight: 1.8,
        }}
      >
        <div>LEAD: <span style={{ color: C.red }}>II</span></div>
        <div>GAIN: 10mm/mV</div>
        <div>SPEED: 25mm/s</div>
      </motion.div>

      {/* Central content */}
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 800 }}>
        {/* BPM display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 16, display: "flex", alignItems: "baseline", justifyContent: "center", gap: 12 }}
        >
          <BPMCounter value={72} />
          <span style={{ fontFamily: mono, fontSize: 14, color: C.redMuted, textTransform: "uppercase", letterSpacing: 2 }}>
            BPM
          </span>
        </motion.div>

        {/* ECG line under BPM */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}
        >
          <ECGLine width={480} height={60} beats={4} speed={4} />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: heading,
            fontSize: "clamp(36px, 5vw, 64px)",
            fontWeight: 700,
            color: C.text,
            margin: 0,
            lineHeight: 1.1,
            letterSpacing: -1,
          }}
        >
          Vital Signs of{" "}
          <span style={{ color: C.red, textShadow: `0 0 30px ${C.redGlow}` }}>
            Innovation
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          style={{
            fontFamily: mono,
            fontSize: 14,
            color: C.textMuted,
            marginTop: 20,
            maxWidth: 520,
            marginLeft: "auto",
            marginRight: "auto",
            lineHeight: 1.8,
            letterSpacing: 0.5,
          }}
        >
          Monitoring the heartbeat of digital craftsmanship.
          Each project is a living system — measured, optimized, alive.
        </motion.p>

        {/* Status bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
            marginTop: 32,
            fontFamily: mono,
            fontSize: 11,
            color: C.textMuted,
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <StatusDot color={C.green} size={5} /> SYSTEMS ONLINE
          </span>
          <span style={{ color: C.border }}>|</span>
          <span>ALL CHANNELS ACTIVE</span>
          <span style={{ color: C.border }}>|</span>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <StatusDot color={C.red} size={5} /> RECORDING
          </span>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   STATS / VITAL READOUTS
   ═══════════════════════════════════════════════ */
function VitalReadout({ stat, index, vitalLabel }: { stat: { value: string; label: string }; index: number; vitalLabel: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <MonitorBezel
        style={{
          padding: "28px 24px",
          textAlign: "center",
          minWidth: 180,
        }}
      >
        <div style={{ fontFamily: mono, fontSize: 10, color: C.redMuted, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>
          {vitalLabel}
        </div>
        <div
          style={{
            fontFamily: mono,
            fontSize: 40,
            fontWeight: 700,
            color: C.red,
            lineHeight: 1,
            textShadow: `0 0 16px ${C.redGlow}`,
            marginBottom: 8,
          }}
        >
          {stat.value}
        </div>
        <div style={{ fontFamily: mono, fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: 1.5 }}>
          {stat.label}
        </div>
        {/* Mini ECG at bottom */}
        <div style={{ marginTop: 16, opacity: 0.3, display: "flex", justifyContent: "center" }}>
          <ECGLine width={140} height={24} beats={2} strokeColor={C.red} speed={3} />
        </div>
      </MonitorBezel>
    </motion.div>
  );
}

function StatsSection() {
  const vitalLabels = ["HR", "SpO2", "SYS/DIA", "RESP", "TEMP", "EtCO2"];

  return (
    <section style={{ padding: "40px 32px 80px", position: "relative", zIndex: 1 }}>
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: 20,
        }}
      >
        {stats.map((stat: { value: string; label: string }, i: number) => (
          <VitalReadout key={i} stat={stat} index={i} vitalLabel={vitalLabels[i % vitalLabels.length]} />
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   PROJECT CARD + PROJECTS SECTION
   ═══════════════════════════════════════════════ */
function ProjectCard({
  project,
  index,
}: {
  project: {
    title: string;
    image: string;
    client: string;
    year: string;
    description: string;
    technical: string;
    tech: string[];
    github: string;
  };
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <MonitorBezel>
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{ cursor: "pointer" }}
        >
          {/* Monitor header bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 20px",
              borderBottom: `1px solid ${C.border}`,
              fontFamily: mono,
              fontSize: 10,
              color: C.textMuted,
              textTransform: "uppercase",
              letterSpacing: 1.5,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <StatusDot color={C.green} size={5} />
              <span>CASE #{String(index + 1).padStart(3, "0")}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span>{project.client}</span>
              <span style={{ color: C.redMuted }}>{project.year}</span>
            </div>
          </div>

          {/* Image area */}
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              height: 220,
              background: `linear-gradient(135deg, ${C.bgCard}, #0D0D14)`,
            }}
          >
            <img
              src={project.image}
              alt={project.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: hovered ? 0.7 : 0.5,
                transition: "opacity 0.4s ease, transform 0.6s ease",
                transform: hovered ? "scale(1.05)" : "scale(1)",
                filter: "saturate(0.3) brightness(0.6)",
              }}
            />
            {/* ECG overlay on image */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                opacity: hovered ? 0.6 : 0.2,
                transition: "opacity 0.4s ease",
              }}
            >
              <ECGLine width={600} height={40} beats={5} speed={5} />
            </div>
            {/* Gradient overlay */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 80,
                background: `linear-gradient(transparent, ${C.bgCard})`,
              }}
            />
          </div>

          {/* Content */}
          <div style={{ padding: "20px 24px 24px" }}>
            <h3
              style={{
                fontFamily: heading,
                fontSize: 22,
                fontWeight: 700,
                color: C.text,
                margin: "0 0 8px",
                lineHeight: 1.3,
              }}
            >
              {project.title}
            </h3>

            <p
              style={{
                fontFamily: mono,
                fontSize: 12,
                color: C.textMuted,
                lineHeight: 1.7,
                margin: "0 0 16px",
              }}
            >
              {project.description}
            </p>

            <p
              style={{
                fontFamily: mono,
                fontSize: 11,
                color: C.redMuted,
                lineHeight: 1.7,
                margin: "0 0 20px",
              }}
            >
              {project.technical}
            </p>

            {/* Tech tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
              {project.tech.map((t: string) => (
                <span
                  key={t}
                  style={{
                    fontFamily: mono,
                    fontSize: 10,
                    padding: "4px 10px",
                    borderRadius: 4,
                    background: C.greenDim,
                    color: C.green,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    border: `1px solid rgba(34,197,94,0.1)`,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Github link */}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: mono,
                  fontSize: 11,
                  color: C.red,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  textTransform: "uppercase",
                  letterSpacing: 1.5,
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = C.text;
                  e.currentTarget.style.textShadow = `0 0 10px ${C.redGlow}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = C.red;
                  e.currentTarget.style.textShadow = "none";
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                View Source
              </a>
            )}
          </div>
        </div>
      </MonitorBezel>
    </motion.div>
  );
}

function ProjectsSection() {
  return (
    <section id="cases" style={{ padding: "40px 32px 80px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Section header */}
        <div style={{ marginBottom: 48, display: "flex", alignItems: "center", gap: 16 }}>
          <StatusDot color={C.red} size={6} />
          <h2
            style={{
              fontFamily: heading,
              fontSize: 32,
              fontWeight: 700,
              color: C.text,
              margin: 0,
              letterSpacing: -0.5,
            }}
          >
            Case Files
          </h2>
          <span
            style={{
              fontFamily: mono,
              fontSize: 10,
              color: C.textMuted,
              textTransform: "uppercase",
              letterSpacing: 2,
              marginLeft: "auto",
            }}
          >
            {projects.length} Records
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: 24,
          }}
        >
          {projects.map((project: any, i: number) => (
            <ProjectCard key={i} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   EXPERTISE SECTION (Diagnostics)
   ═══════════════════════════════════════════════ */
function ExpertiseSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="diagnostics" ref={ref} style={{ padding: "40px 32px 80px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Section header */}
        <div style={{ marginBottom: 48, display: "flex", alignItems: "center", gap: 16 }}>
          <StatusDot color={C.green} size={6} />
          <h2
            style={{
              fontFamily: heading,
              fontSize: 32,
              fontWeight: 700,
              color: C.text,
              margin: 0,
              letterSpacing: -0.5,
            }}
          >
            Diagnostic Readouts
          </h2>
          <span
            style={{
              fontFamily: mono,
              fontSize: 10,
              color: C.green,
              textTransform: "uppercase",
              letterSpacing: 2,
              marginLeft: "auto",
            }}
          >
            ALL NORMAL
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 20,
          }}
        >
          {expertise.map((item: { title: string; body: string }, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <MonitorBezel style={{ padding: "24px", height: "100%" }}>
                {/* Readout header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 16,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 2,
                        background: C.red,
                        boxShadow: `0 0 8px ${C.redGlow}`,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: mono,
                        fontSize: 10,
                        color: C.redMuted,
                        textTransform: "uppercase",
                        letterSpacing: 2,
                      }}
                    >
                      CH-{String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <StatusDot color={C.green} size={4} />
                </div>

                <h3
                  style={{
                    fontFamily: heading,
                    fontSize: 18,
                    fontWeight: 600,
                    color: C.text,
                    margin: "0 0 12px",
                    lineHeight: 1.3,
                  }}
                >
                  {item.title}
                </h3>

                <p
                  style={{
                    fontFamily: mono,
                    fontSize: 12,
                    color: C.textMuted,
                    lineHeight: 1.8,
                    margin: 0,
                  }}
                >
                  {item.body}
                </p>

                {/* Mini waveform footer */}
                <div style={{ marginTop: 20, opacity: 0.25 }}>
                  <ECGLine width={260} height={20} beats={2} strokeColor={C.green} speed={4} />
                </div>
              </MonitorBezel>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   TOOLS SECTION (Protocols)
   ═══════════════════════════════════════════════ */
function ToolsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="protocols" ref={ref} style={{ padding: "40px 32px 80px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Section header */}
        <div style={{ marginBottom: 48, display: "flex", alignItems: "center", gap: 16 }}>
          <StatusDot color={C.green} size={6} />
          <h2
            style={{
              fontFamily: heading,
              fontSize: 32,
              fontWeight: 700,
              color: C.text,
              margin: 0,
              letterSpacing: -0.5,
            }}
          >
            Active Protocols
          </h2>
          <span
            style={{
              fontFamily: mono,
              fontSize: 10,
              color: C.textMuted,
              textTransform: "uppercase",
              letterSpacing: 2,
              marginLeft: "auto",
            }}
          >
            ADMINISTERED
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          {tools.map((tool: { label: string; items: string[] }, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <MonitorBezel style={{ padding: "24px" }}>
                {/* Protocol header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 20,
                    paddingBottom: 16,
                    borderBottom: `1px solid ${C.border}`,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: `linear-gradient(135deg, ${C.redGlow}, transparent)`,
                      border: `1px solid ${C.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: mono,
                      fontSize: 12,
                      fontWeight: 700,
                      color: C.red,
                    }}
                  >
                    Rx
                  </div>
                  <div>
                    <h3
                      style={{
                        fontFamily: heading,
                        fontSize: 16,
                        fontWeight: 600,
                        color: C.text,
                        margin: 0,
                        lineHeight: 1.3,
                      }}
                    >
                      {tool.label}
                    </h3>
                    <span style={{ fontFamily: mono, fontSize: 10, color: C.textMuted }}>
                      {tool.items.length} COMPOUNDS
                    </span>
                  </div>
                </div>

                {/* Items as medication list */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {tool.items.map((item: string, j: number) => (
                    <div
                      key={j}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        fontFamily: mono,
                        fontSize: 12,
                        color: C.textMuted,
                      }}
                    >
                      <span
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: "50%",
                          background: C.green,
                          flexShrink: 0,
                          boxShadow: `0 0 6px ${C.greenDim}`,
                        }}
                      />
                      <span>{item}</span>
                      <span
                        style={{
                          marginLeft: "auto",
                          fontSize: 9,
                          color: C.green,
                          textTransform: "uppercase",
                          letterSpacing: 1,
                        }}
                      >
                        ACTIVE
                      </span>
                    </div>
                  ))}
                </div>
              </MonitorBezel>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════ */
function Footer() {
  const time = useTimestamp();

  return (
    <footer
      style={{
        padding: "60px 32px 40px",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Final ECG line */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 40, opacity: 0.3 }}>
          <ECGLine width={600} height={40} beats={5} speed={6} />
        </div>

        {/* Footer content */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 20,
            paddingTop: 24,
            borderTop: `1px solid ${C.border}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <StatusDot color={C.green} size={5} />
            <span style={{ fontFamily: mono, fontSize: 11, color: C.textMuted }}>
              MONITORING ACTIVE
            </span>
            <span style={{ fontFamily: mono, fontSize: 11, color: C.redMuted, fontVariantNumeric: "tabular-nums" }}>
              {time}
            </span>
          </div>

          <div style={{ fontFamily: mono, fontSize: 10, color: C.textMuted, letterSpacing: 1 }}>
            PULSE MONITOR v1.0 &copy; {new Date().getFullYear()}
          </div>
        </div>

        {/* Theme Switcher */}
        <div style={{ marginTop: 32, display: "flex", justifyContent: "center" }}>
          <ThemeSwitcher current="/pulse" variant="dark" />
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════
   PAGE EXPORT
   ═══════════════════════════════════════════════ */
export default function PulsePage() {
  useInjectKeyframes();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        color: C.text,
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <GridBG />
      <Navigation />
      <HeroSection />
      <StatsSection />
      <FlatlineDivider />
      <ProjectsSection />
      <FlatlineDivider />
      <ExpertiseSection />
      <FlatlineDivider />
      <ToolsSection />
      <Footer />
    </div>
  );
}
