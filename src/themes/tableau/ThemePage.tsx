"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "@/app/data/projects";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";

/* ═══════════════════════════════════════════════════════════════════
   TABLEAU — Living Data Dashboard
   Accent: #6366F1 (indigo)  Icon: ⊡
   Bento grid widgets, animated sparklines/donut charts, live status
   ═══════════════════════════════════════════════════════════════════ */

const INDIGO = "#6366F1", EMERALD = "#10B981", AMBER = "#F59E0B";
const ROSE = "#F43F5E", CYAN = "#06B6D4", GRAY = "#374151";
const BG = "#0F0F1A", CARD = "#1A1A2E", CB = "#2A2A40";
const T1 = "#E5E7EB", T2 = "#9CA3AF", T3 = "#6B7280";
const ACCENTS = [INDIGO, EMERALD, AMBER, ROSE, CYAN];

/* ── fonts shorthand ── */
const fSG = "var(--font-space-grotesk)", fI = "var(--font-inter)";
const fJB = "var(--font-jetbrains)", fS = "var(--font-sora)";

/* ── deterministic pseudo-random ── */
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/* ── generate sparkline points ── */
function sparkPts(seed: string, w: number, h: number, n = 8): string {
  const hv = hash(seed);
  return Array.from({ length: n }, (_, i) => {
    const x = (i / (n - 1)) * w;
    const y = h * 0.15 + (((hv * (i + 1) * 7919) % 1000) / 1000) * h * 0.7;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
}

/* ── generate bar chart data ── */
function barData(seed: string, count = 6): number[] {
  const hv = hash(seed);
  return Array.from({ length: count }, (_, i) =>
    0.2 + (((hv * (i + 1) * 4967) % 1000) / 1000) * 0.8
  );
}

/* ── animated counter hook ── */
function useCounter(target: number, dur = 1500, go = true): number {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!go) return;
    const t0 = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - t0) / dur, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, dur, go]);
  return val;
}

/* ── live clock ── */
function useClock(): string {
  const [t, setT] = useState("");
  useEffect(() => {
    const u = () => setT(new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    u(); const id = setInterval(u, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

/* ── Section wrapper ── */
function Section({ children, id }: { children: React.ReactNode; id?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const iv = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.section ref={ref} id={id}
      initial={{ opacity: 0, y: 20 }} animate={iv ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}>
      {children}
    </motion.section>
  );
}

/* ── Sparkline SVG ── */
function Sparkline({ seed, color, width = 120, height = 32, delay = 0 }: {
  seed: string; color: string; width?: number; height?: number; delay?: number;
}) {
  const pts = sparkPts(seed, width, height);
  const ref = useRef<HTMLDivElement>(null);
  const iv = useInView(ref, { once: true, margin: "-40px" });
  return (
    <div ref={ref}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id={`sg-${seed}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.polygon points={`0,${height} ${pts} ${width},${height}`} fill={`url(#sg-${seed})`}
          initial={{ opacity: 0 }} animate={iv ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: delay + 0.3 }} />
        <motion.polyline points={pts} stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none"
          initial={{ pathLength: 0, opacity: 0 }} animate={iv ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut", delay }} />
      </svg>
    </div>
  );
}

/* ── Bar Chart SVG ── */
function BarChart({ seed, color, width = 100, height = 40, delay = 0 }: {
  seed: string; color: string; width?: number; height?: number; delay?: number;
}) {
  const bars = barData(seed);
  const bw = width / (bars.length * 2), gap = bw;
  const ref = useRef<HTMLDivElement>(null);
  const iv = useInView(ref, { once: true, margin: "-40px" });
  return (
    <div ref={ref}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {bars.map((v, i) => {
          const bh = v * height * 0.85, x = i * (bw + gap) + gap / 2;
          return (
            <motion.rect key={i} x={x} y={height - bh} width={bw} height={bh} rx={2}
              fill={color} fillOpacity={0.6 + v * 0.4}
              initial={{ scaleY: 0 }} animate={iv ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ duration: 0.6, delay: delay + i * 0.08, ease: "easeOut" }}
              style={{ transformOrigin: `${x + bw / 2}px ${height}px` }} />
          );
        })}
      </svg>
    </div>
  );
}

/* ── Donut Chart SVG ── */
function DonutChart({ percentage, color, size = 80, sw = 6, delay = 0, label }: {
  percentage: number; color: string; size?: number; sw?: number; delay?: number; label?: string;
}) {
  const r = (size - sw) / 2, circ = 2 * Math.PI * r;
  const ref = useRef<HTMLDivElement>(null);
  const iv = useInView(ref, { once: true, margin: "-40px" });
  const count = useCounter(percentage, 1200, iv);
  return (
    <div ref={ref} style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={CB} strokeWidth={sw} />
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color}
          strokeWidth={sw} strokeLinecap="round" strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={iv ? { strokeDashoffset: circ * (1 - percentage / 100) } : { strokeDashoffset: circ }}
          transition={{ duration: 1.4, ease: "easeOut", delay }}
          style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: fSG, fontSize: size > 70 ? 18 : 14, fontWeight: 700, color: T1, lineHeight: 1 }}>{count}%</span>
        {label && <span style={{ fontFamily: fI, fontSize: 9, color: T3, marginTop: 2, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>}
      </div>
    </div>
  );
}

/* ── Mini Area Chart ── */
function MiniArea({ seed, color, width = 140, height = 44, delay = 0 }: {
  seed: string; color: string; width?: number; height?: number; delay?: number;
}) {
  const pts = sparkPts(seed + "-area", width, height, 12);
  const ref = useRef<HTMLDivElement>(null);
  const iv = useInView(ref, { once: true, margin: "-40px" });
  return (
    <div ref={ref}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
        <defs>
          <linearGradient id={`ag-${seed}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <motion.polygon points={`0,${height} ${pts} ${width},${height}`} fill={`url(#ag-${seed})`}
          initial={{ opacity: 0 }} animate={iv ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: delay + 0.2 }} />
        <motion.polyline points={pts} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none"
          initial={{ pathLength: 0, opacity: 0 }} animate={iv ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeOut", delay }} />
      </svg>
    </div>
  );
}

/* ── Status Dot ── */
function StatusDot({ color = EMERALD, size = 8 }: { color?: string; size?: number }) {
  return <span style={{ display: "inline-block", width: size, height: size, borderRadius: "50%", background: color, boxShadow: `0 0 ${size}px ${color}80`, animation: "statusPulse 2s ease-in-out infinite", flexShrink: 0 }} />;
}

/* ── Trend Arrow ── */
function TrendArrow({ up = true, color }: { up?: boolean; color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d={up ? "M7 2L12 7L10 7L10 12L4 12L4 7L2 7L7 2Z" : "M7 12L2 7L4 7L4 2L10 2L10 7L12 7L7 12Z"} fill={color} fillOpacity={0.8} />
    </svg>
  );
}

/* ── Widget title bar ── */
function WidgetBar({ title, color, sub }: { title: string; color: string; sub?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, paddingBottom: 10, borderBottom: `1px solid ${CB}` }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}60`, flexShrink: 0 }} />
      <span style={{ fontFamily: fSG, fontSize: 13, fontWeight: 600, color: T1, letterSpacing: "0.02em", flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</span>
      {sub && <span style={{ fontFamily: fJB, fontSize: 10, color: T3 }}>{sub}</span>}
    </div>
  );
}

/* ── KPI Value with animated counter ── */
function KPIValue({ value, color }: { value: string; color: string }) {
  const num = parseInt(value.replace(/\D/g, ""), 10) || 0;
  const sfx = value.replace(/\d/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const iv = useInView(ref, { once: true, margin: "-40px" });
  const c = useCounter(num, 1200, iv);
  return (
    <div ref={ref}>
      <span style={{ fontFamily: fSG, fontSize: 32, fontWeight: 800, color, lineHeight: 1, letterSpacing: "-0.02em" }}>{c}{sfx}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════════════════════ */
export default function TableauPage() {
  const clock = useClock();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const widgetSizes = projects.map((_, i) => (i % 3 === 0 ? "wide" : "normal"));
  const expertisePct = [92, 88, 85, 95];
  const statColors = [INDIGO, EMERALD, AMBER];
  const toolStatus = ["active", "active", "active", "active", "standby", "active"];

  return (
    <div style={{ background: BG, color: T1, minHeight: "100vh", fontFamily: fI, position: "relative", overflow: "hidden" }}>
      <style>{`
        @keyframes statusPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes scanline { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
        @keyframes liveIndicator { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.85)} }
        @keyframes widgetGlow { 0%,100%{box-shadow:0 0 0 1px rgba(99,102,241,0.1)} 50%{box-shadow:0 0 20px 1px rgba(99,102,241,0.06)} }

        .tableau-widget {
          background:${CARD}; border:1px solid ${CB}; border-radius:12px; padding:20px;
          transition:border-color 0.3s,box-shadow 0.3s;
        }
        .tableau-widget:hover { border-color:${INDIGO}40; box-shadow:0 4px 24px rgba(99,102,241,0.08),0 0 0 1px ${INDIGO}20; }

        .tableau-tag {
          display:inline-flex; align-items:center; padding:3px 8px; border-radius:4px;
          font-size:10px; font-family:${fJB}; letter-spacing:0.02em; white-space:nowrap;
        }

        .tableau-grid-bg {
          background-image:linear-gradient(${CB}30 1px,transparent 1px),linear-gradient(90deg,${CB}30 1px,transparent 1px);
          background-size:40px 40px;
        }

        @media (max-width:900px) { .tableau-bento { grid-template-columns:repeat(2,1fr)!important; } }
        @media (max-width:560px) {
          .tableau-bento { grid-template-columns:1fr!important; }
          .tableau-bento>* { grid-column:span 1!important; }
        }
      `}</style>

      {/* Grid background */}
      <div className="tableau-grid-bg" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.4 }} />

      {/* Scanline overlay */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${INDIGO}15,transparent)`, animation: "scanline 8s linear infinite", pointerEvents: "none", zIndex: 1 }} />

      {/* ═══ TOP BAR ═══ */}
      <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ position: "sticky", top: 0, zIndex: 40, background: `${BG}E6`, backdropFilter: "blur(12px)", borderBottom: `1px solid ${CB}`, padding: "0 24px", height: 48, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="1" y="1" width="8" height="8" rx="2" fill={INDIGO} fillOpacity="0.9" />
            <rect x="11" y="1" width="8" height="8" rx="2" fill={EMERALD} fillOpacity="0.6" />
            <rect x="1" y="11" width="8" height="8" rx="2" fill={AMBER} fillOpacity="0.6" />
            <rect x="11" y="11" width="8" height="8" rx="2" fill={ROSE} fillOpacity="0.4" />
          </svg>
          <span style={{ fontFamily: fSG, fontSize: 14, fontWeight: 700, color: T1, letterSpacing: "0.08em" }}>TABLEAU</span>
          <span style={{ fontFamily: fJB, fontSize: 10, color: T3, padding: "2px 6px", background: `${CB}60`, borderRadius: 4 }}>v2.1</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: EMERALD, animation: "liveIndicator 2s ease-in-out infinite", display: "inline-block" }} />
            <span style={{ fontFamily: fJB, fontSize: 10, color: EMERALD, letterSpacing: "0.04em" }}>LIVE</span>
          </div>
          <span style={{ fontFamily: fJB, fontSize: 11, color: T3, letterSpacing: "0.06em" }}>{mounted ? clock : "--:--:--"}</span>
          <div style={{ display: "flex", gap: 6 }}>
            {["#projects", "#expertise", "#tools", "#footer"].map((href, i) => (
              <a key={href} href={href} style={{ width: 8, height: 8, borderRadius: 2, background: ACCENTS[i % 5], opacity: 0.5, transition: "opacity 0.2s", display: "block" }}
                onMouseEnter={e => ((e.target as HTMLElement).style.opacity = "1")}
                onMouseLeave={e => ((e.target as HTMLElement).style.opacity = "0.5")} />
            ))}
          </div>
        </div>
      </motion.header>

      {/* ═══ MAIN ═══ */}
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2 }}>

        {/* ──── HERO ──── */}
        <Section id="hero">
          <div style={{ padding: "60px 0 40px" }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} style={{ marginBottom: 8 }}>
              <span style={{ fontFamily: fJB, fontSize: 11, color: INDIGO, letterSpacing: "0.12em", textTransform: "uppercase" }}>Dashboard Overview</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
              style={{ fontFamily: fSG, fontSize: "clamp(42px,6vw,72px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1, color: T1, margin: 0 }}>
              TABLEAU
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}
              style={{ fontFamily: fS, fontSize: 16, color: T2, maxWidth: 480, lineHeight: 1.6, margin: "16px 0 32px" }}>
              AI engineering portfolio — real-time metrics, project analytics, and system status. Monitoring 10 active deployments across 8 industries.
            </motion.p>

            {/* KPI Widgets */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 16 }}>
              {stats.map((stat, i) => {
                const color = statColors[i];
                const up = i !== 2;
                return (
                  <motion.div key={stat.label} className="tableau-widget"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                      <span style={{ fontFamily: fJB, fontSize: 10, color: T3, textTransform: "uppercase", letterSpacing: "0.1em" }}>{stat.label}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <TrendArrow up={up} color={up ? EMERALD : ROSE} />
                        <StatusDot color={EMERALD} size={6} />
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
                      <div>
                        <KPIValue value={stat.value} color={color} />
                        <span style={{ fontFamily: fI, fontSize: 11, color: up ? EMERALD : ROSE, display: "block", marginTop: 4 }}>
                          {up ? "+12%" : "stable"} vs last quarter
                        </span>
                      </div>
                      <MiniArea seed={stat.label} color={color} width={100} height={36} delay={0.5 + i * 0.15} />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Last updated */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
              style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: EMERALD, animation: "statusPulse 2s ease-in-out infinite", display: "inline-block" }} />
              <span style={{ fontFamily: fJB, fontSize: 10, color: T3, letterSpacing: "0.04em" }}>
                Last updated: just now &middot; {mounted ? clock : "--:--:--"}
              </span>
            </motion.div>
          </div>
        </Section>

        {/* ──── PROJECTS ──── */}
        <Section id="projects">
          <div style={{ padding: "40px 0 60px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="0" y="0" width="7" height="7" rx="1.5" fill={INDIGO} />
                  <rect x="9" y="0" width="7" height="7" rx="1.5" fill={INDIGO} fillOpacity="0.5" />
                  <rect x="0" y="9" width="7" height="7" rx="1.5" fill={INDIGO} fillOpacity="0.5" />
                  <rect x="9" y="9" width="7" height="7" rx="1.5" fill={INDIGO} fillOpacity="0.3" />
                </svg>
                <span style={{ fontFamily: fSG, fontSize: 18, fontWeight: 700, color: T1, letterSpacing: "0.04em" }}>PROJECT ANALYTICS</span>
              </div>
              <span style={{ fontFamily: fJB, fontSize: 10, color: T3, background: `${CB}60`, padding: "3px 8px", borderRadius: 4 }}>{projects.length} widgets</span>
            </div>

            {/* Bento Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }} className="tableau-bento">
              {projects.map((p, idx) => {
                const wide = widgetSizes[idx] === "wide";
                const ac = ACCENTS[idx % 5];
                const chart = idx % 3;
                const title = p.title.replace("\n", " ");
                const metric = 70 + ((hash(title) * 37) % 30);
                return (
                  <motion.div key={idx} className="tableau-widget"
                    initial={{ opacity: 0, y: 20, scale: 0.97 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, delay: idx * 0.06 }}
                    whileHover={{ y: -3 }}
                    style={{ gridColumn: wide ? "span 2" : "span 1", display: "flex", flexDirection: "column" }}>
                    <WidgetBar title={title} color={ac} sub={p.year} />
                    {/* Client badge */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                      <span className="tableau-tag" style={{ background: `${ac}15`, color: ac, border: `1px solid ${ac}30` }}>{p.client}</span>
                      <span style={{ fontFamily: fJB, fontSize: 10, color: T3 }}>{p.year}</span>
                    </div>
                    {/* Description */}
                    <p style={{ fontFamily: fI, fontSize: 12, color: T2, lineHeight: 1.5, margin: "0 0 14px", flex: 1, display: "-webkit-box", WebkitLineClamp: wide ? 3 : 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {p.description}
                    </p>
                    {/* Chart area */}
                    <div style={{ background: `${BG}80`, borderRadius: 8, padding: 12, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <span style={{ fontFamily: fSG, fontSize: 22, fontWeight: 700, color: ac, lineHeight: 1 }}>{metric}</span>
                        <span style={{ fontFamily: fJB, fontSize: 9, color: T3, display: "block", marginTop: 2 }}>performance score</span>
                      </div>
                      {chart === 0 && <BarChart seed={title} color={ac} width={wide ? 120 : 80} height={36} delay={idx * 0.06} />}
                      {chart === 1 && <Sparkline seed={title} color={ac} width={wide ? 120 : 80} height={36} delay={idx * 0.06} />}
                      {chart === 2 && <DonutChart percentage={metric} color={ac} size={44} sw={4} delay={idx * 0.06} />}
                    </div>
                    {/* Tech tags */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {p.tech.map(t => (
                        <span key={t} className="tableau-tag" style={{ background: `${GRAY}40`, color: T2, border: `1px solid ${CB}` }}>{t}</span>
                      ))}
                    </div>
                    {/* Footer row */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12, paddingTop: 10, borderTop: `1px solid ${CB}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <StatusDot color={EMERALD} size={5} />
                        <span style={{ fontFamily: fJB, fontSize: 9, color: EMERALD }}>deployed</span>
                      </div>
                      {p.github && (
                        <a href={p.github} target="_blank" rel="noopener noreferrer"
                          style={{ fontFamily: fJB, fontSize: 9, color: T3, textDecoration: "none", display: "flex", alignItems: "center", gap: 4, transition: "color 0.2s" }}
                          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = INDIGO)}
                          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = T3)}>
                          <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                          </svg>
                          source
                        </a>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </Section>

        {/* ──── EXPERTISE ──── */}
        <Section id="expertise">
          <div style={{ padding: "40px 0 60px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke={CYAN} strokeWidth="1.5" fill="none" />
                <circle cx="8" cy="8" r="3" fill={CYAN} fillOpacity="0.5" />
              </svg>
              <span style={{ fontFamily: fSG, fontSize: 18, fontWeight: 700, color: T1, letterSpacing: "0.04em" }}>SYSTEM CAPABILITIES</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
              {expertise.map((exp, i) => {
                const ac = ACCENTS[i % 5], pct = expertisePct[i];
                return (
                  <motion.div key={exp.title} className="tableau-widget"
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    style={{ textAlign: "center", padding: "28px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                      <DonutChart percentage={pct} color={ac} size={90} sw={6} delay={i * 0.12} label="capacity" />
                    </div>
                    <h3 style={{ fontFamily: fSG, fontSize: 15, fontWeight: 700, color: T1, margin: "0 0 8px", letterSpacing: "0.01em" }}>{exp.title}</h3>
                    <p style={{ fontFamily: fI, fontSize: 12, color: T2, lineHeight: 1.6, margin: 0 }}>{exp.body}</p>
                    <div style={{ marginTop: 16, height: 3, borderRadius: 2, background: CB, overflow: "hidden" }}>
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: i * 0.1 + 0.3 }}
                        style={{ height: "100%", background: ac, borderRadius: 2 }} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </Section>

        {/* ──── TOOLS ──── */}
        <Section id="tools">
          <div style={{ padding: "40px 0 60px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="1" y="1" width="14" height="14" rx="2" stroke={AMBER} strokeWidth="1.5" fill="none" />
                  <line x1="1" y1="5" x2="15" y2="5" stroke={AMBER} strokeWidth="1" strokeOpacity="0.4" />
                  <line x1="1" y1="9" x2="15" y2="9" stroke={AMBER} strokeWidth="1" strokeOpacity="0.4" />
                  <line x1="6" y1="5" x2="6" y2="15" stroke={AMBER} strokeWidth="1" strokeOpacity="0.4" />
                </svg>
                <span style={{ fontFamily: fSG, fontSize: 18, fontWeight: 700, color: T1, letterSpacing: "0.04em" }}>STATUS BOARD</span>
              </div>
              <span style={{ fontFamily: fJB, fontSize: 10, color: EMERALD, display: "flex", alignItems: "center", gap: 4 }}>
                <StatusDot color={EMERALD} size={5} />All systems operational
              </span>
            </div>

            <div className="tableau-widget" style={{ padding: 0, overflow: "hidden" }}>
              {/* Table header */}
              <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 2fr 100px", padding: "12px 20px", background: `${CB}30`, borderBottom: `1px solid ${CB}`, gap: 12 }}>
                {["#", "CATEGORY", "TECHNOLOGIES", "STATUS"].map(h => (
                  <span key={h} style={{ fontFamily: fJB, fontSize: 9, color: T3, letterSpacing: "0.12em", textTransform: "uppercase" }}>{h}</span>
                ))}
              </div>
              {/* Table rows */}
              {tools.map((tool, i) => {
                const st = toolStatus[i] || "active";
                const sc = st === "active" ? EMERALD : AMBER;
                const ra = ACCENTS[i % 5];
                return (
                  <motion.div key={tool.label} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.07 }}
                    style={{ display: "grid", gridTemplateColumns: "40px 1fr 2fr 100px", padding: "14px 20px", borderBottom: i < tools.length - 1 ? `1px solid ${CB}40` : "none", gap: 12, alignItems: "center", transition: "background 0.2s" }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = `${CB}20`)}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}>
                    <span style={{ fontFamily: fJB, fontSize: 10, color: T3 }}>{String(i + 1).padStart(2, "0")}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: ra, flexShrink: 0 }} />
                      <span style={{ fontFamily: fSG, fontSize: 13, fontWeight: 600, color: T1 }}>{tool.label}</span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {tool.items.map(item => (
                        <span key={item} className="tableau-tag" style={{ background: `${ra}12`, color: ra, border: `1px solid ${ra}25` }}>{item}</span>
                      ))}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <StatusDot color={sc} size={6} />
                      <span style={{ fontFamily: fJB, fontSize: 10, color: sc, textTransform: "uppercase", letterSpacing: "0.06em" }}>{st}</span>
                    </div>
                  </motion.div>
                );
              })}
              {/* Table footer */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", background: `${CB}20`, borderTop: `1px solid ${CB}` }}>
                <span style={{ fontFamily: fJB, fontSize: 9, color: T3 }}>
                  {tools.length} categories &middot; {tools.reduce((s, t) => s + t.items.length, 0)} technologies
                </span>
                <span style={{ fontFamily: fJB, fontSize: 9, color: T3 }}>Last scan: {mounted ? clock : "--:--:--"}</span>
              </div>
            </div>
          </div>
        </Section>

        {/* ──── FOOTER ──── */}
        <Section id="footer">
          <footer style={{ padding: "48px 0 32px", borderTop: `1px solid ${CB}` }}>
            <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{ background: CARD, border: `1px solid ${CB}`, borderRadius: 12, padding: "32px 28px", textAlign: "center", marginBottom: 32 }}>
              {/* Dashboard controls SVG */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                <svg width="200" height="40" viewBox="0 0 200 40" fill="none">
                  <rect x="0" y="14" width="200" height="12" rx="6" fill={`${CB}60`} />
                  <rect x="2" y="16" width="30" height="8" rx="4" fill={INDIGO} fillOpacity="0.8" />
                  <rect x="35" y="16" width="25" height="8" rx="4" fill={EMERALD} fillOpacity="0.6" />
                  <rect x="63" y="16" width="35" height="8" rx="4" fill={AMBER} fillOpacity="0.6" />
                  <rect x="101" y="16" width="20" height="8" rx="4" fill={ROSE} fillOpacity="0.5" />
                  <rect x="124" y="16" width="28" height="8" rx="4" fill={CYAN} fillOpacity="0.5" />
                  <rect x="155" y="16" width="15" height="8" rx="4" fill={INDIGO} fillOpacity="0.3" />
                  <circle cx="6" cy="6" r="3" fill={INDIGO} fillOpacity="0.4" />
                  <circle cx="16" cy="6" r="3" fill={EMERALD} fillOpacity="0.4" />
                  <circle cx="26" cy="6" r="3" fill={AMBER} fillOpacity="0.4" />
                  <circle cx="180" cy="6" r="3" fill={ROSE} fillOpacity="0.3" />
                  <circle cx="190" cy="6" r="3" fill={CYAN} fillOpacity="0.3" />
                </svg>
              </div>

              <h2 style={{ fontFamily: fSG, fontSize: 28, fontWeight: 800, color: T1, letterSpacing: "0.12em", margin: "0 0 8px" }}>SESSION ENDED</h2>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: `${T3}60`, display: "inline-block" }} />
                <span style={{ fontFamily: fJB, fontSize: 11, color: T3, letterSpacing: "0.06em" }}>
                  {mounted ? new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : ""} &middot; {mounted ? clock : "--:--:--"} UTC
                </span>
              </div>

              {/* Metrics summary */}
              <div style={{ display: "flex", justifyContent: "center", gap: 32, marginBottom: 20, flexWrap: "wrap" }}>
                {[
                  { label: "Widgets Rendered", value: "23", color: INDIGO },
                  { label: "Data Points", value: "148", color: EMERALD },
                  { label: "Uptime", value: "99.9%", color: AMBER },
                ].map(m => (
                  <div key={m.label} style={{ textAlign: "center" }}>
                    <span style={{ fontFamily: fSG, fontSize: 20, fontWeight: 700, color: m.color, display: "block" }}>{m.value}</span>
                    <span style={{ fontFamily: fJB, fontSize: 9, color: T3, letterSpacing: "0.06em", textTransform: "uppercase" }}>{m.label}</span>
                  </div>
                ))}
              </div>

              {/* Decorative bar chart */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                <svg width="240" height="32" viewBox="0 0 240 32" fill="none">
                  {Array.from({ length: 24 }, (_, i) => {
                    const h = 8 + ((hash(`footer-${i}`) * 31) % 20);
                    return <rect key={i} x={i * 10} y={32 - h} width={7} height={h} rx={1.5} fill={ACCENTS[i % 5]} fillOpacity={0.15 + (i % 3) * 0.1} />;
                  })}
                </svg>
              </div>

              <p style={{ fontFamily: fJB, fontSize: 10, color: `${T3}80`, letterSpacing: "0.08em", margin: 0 }}>Powered by Grox Analytics</p>
            </motion.div>

            {/* Bottom bar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="1" width="5" height="5" rx="1" fill={INDIGO} fillOpacity="0.6" />
                  <rect x="8" y="1" width="5" height="5" rx="1" fill={INDIGO} fillOpacity="0.4" />
                  <rect x="1" y="8" width="5" height="5" rx="1" fill={INDIGO} fillOpacity="0.4" />
                  <rect x="8" y="8" width="5" height="5" rx="1" fill={INDIGO} fillOpacity="0.2" />
                </svg>
                <span style={{ fontFamily: fJB, fontSize: 10, color: T3, letterSpacing: "0.04em" }}>tableau.grox.studio</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontFamily: fJB, fontSize: 10, color: T3 }}>&copy; {new Date().getFullYear()}</span>
                <span style={{ fontFamily: fJB, fontSize: 10, color: `${T3}60` }}>&#x22A1;</span>
              </div>
            </div>
          </footer>
        </Section>
      </main>

      <ThemeSwitcher current="/tableau" variant="dark" />
    </div>
  );
}
