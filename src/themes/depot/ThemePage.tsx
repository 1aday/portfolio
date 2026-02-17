"use client";

import { projects, stats, expertise, tools } from "@/app/data/projects";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";
import { motion, useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";

/* ─── Color Palette ─── */
const C = {
  bg: "#1A1A1A",
  board: "#0A0A0A",
  yellow: "#F5C542",
  yellowDim: "rgba(245,197,66,0.3)",
  yellowGlow: "rgba(245,197,66,0.12)",
  platform: "#4A4A4A",
  white: "#FFFFFF",
  whiteMuted: "rgba(255,255,255,0.5)",
  red: "#CC3333",
  teal: "#2EC4B6",
  tealDim: "rgba(46,196,182,0.25)",
  boardBorder: "#2A2A2A",
  trackGray: "#333333",
  steel: "#6B6B6B",
};

const FLAP_CHARS = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.-/:&+()";

/* ─── Split-Flap Character ─── */
function SplitFlapChar({ target, delay = 0, speed = 40, width = "1.1ch", fontSize = "inherit" }: {
  target: string; delay?: number; speed?: number; width?: string; fontSize?: string;
}) {
  const [current, setCurrent] = useState(" ");
  const [flipping, setFlipping] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const t = target.toUpperCase();
    const targetIdx = Math.max(0, FLAP_CHARS.indexOf(t));
    let idx = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        if (idx >= targetIdx) { clearInterval(interval); setCurrent(t); setFlipping(false); return; }
        idx++; setFlipping(true); setCurrent(FLAP_CHARS[idx]);
        setTimeout(() => setFlipping(false), speed * 0.6);
      }, speed);
    }, delay);
    return () => clearTimeout(timer);
  }, [inView, target, delay, speed]);

  return (
    <span ref={ref} style={{
      display: "inline-block", width, height: "1.4em", lineHeight: "1.4em", textAlign: "center",
      background: C.board, color: C.white, fontSize, fontFamily: "var(--font-space-grotesk)",
      fontWeight: 600, position: "relative", overflow: "hidden", borderRadius: 2, margin: "0 0.5px",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 1px 2px rgba(0,0,0,0.5)",
    }}>
      <span style={{
        display: "block", transform: flipping ? "rotateX(90deg)" : "rotateX(0deg)",
        transition: `transform ${speed * 0.4}ms ease-in`, transformOrigin: "bottom center",
      }}>{current}</span>
      <span style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "rgba(0,0,0,0.6)", zIndex: 2 }} />
    </span>
  );
}

/* ─── Split-Flap Text Row ─── */
function SplitFlapText({ text, delay = 0, charWidth = "1.1ch", fontSize = "inherit", maxLength, speed = 40 }: {
  text: string; delay?: number; charWidth?: string; fontSize?: string; maxLength?: number; speed?: number;
}) {
  const padded = maxLength ? text.padEnd(maxLength).slice(0, maxLength) : text;
  return (
    <span style={{ display: "inline-flex", gap: 1 }}>
      {padded.split("").map((ch, i) => (
        <SplitFlapChar key={i} target={ch} delay={delay + i * 20} speed={speed} width={charWidth} fontSize={fontSize} />
      ))}
    </span>
  );
}

/* ─── Station Clock SVG ─── */
function StationClock({ size = 160 }: { size?: number }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const iv = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(iv); }, []);

  const r = size / 2;
  const h = time.getHours() % 12, m = time.getMinutes(), s = time.getSeconds();
  const hA = h * 30 + m * 0.5, mA = m * 6, sA = s * 6;
  const sin = (a: number) => Math.sin((a * Math.PI) / 180);
  const cos = (a: number) => Math.cos((a * Math.PI) / 180);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={r} cy={r} r={r - 2} fill={C.board} stroke={C.yellow} strokeWidth={3} />
      <circle cx={r} cy={r} r={r - 8} fill="none" stroke={C.platform} strokeWidth={1} />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        return <line key={i} x1={r + Math.sin(a) * (r - 14)} y1={r - Math.cos(a) * (r - 14)}
          x2={r + Math.sin(a) * (r - 24)} y2={r - Math.cos(a) * (r - 24)} stroke={C.white} strokeWidth={3} strokeLinecap="round" />;
      })}
      {Array.from({ length: 60 }).map((_, i) => {
        if (i % 5 === 0) return null;
        const a = (i * 6 * Math.PI) / 180;
        return <line key={i} x1={r + Math.sin(a) * (r - 14)} y1={r - Math.cos(a) * (r - 14)}
          x2={r + Math.sin(a) * (r - 18)} y2={r - Math.cos(a) * (r - 18)} stroke={C.platform} strokeWidth={1} strokeLinecap="round" />;
      })}
      <line x1={r} y1={r} x2={r + sin(hA) * r * 0.45} y2={r - cos(hA) * r * 0.45} stroke={C.white} strokeWidth={4} strokeLinecap="round" />
      <line x1={r} y1={r} x2={r + sin(mA) * r * 0.65} y2={r - cos(mA) * r * 0.65} stroke={C.white} strokeWidth={3} strokeLinecap="round" />
      <line x1={r - sin(sA) * r * 0.15} y1={r + cos(sA) * r * 0.15}
        x2={r + sin(sA) * r * 0.7} y2={r - cos(sA) * r * 0.7} stroke={C.red} strokeWidth={1.5} strokeLinecap="round" />
      <circle cx={r + sin(sA) * r * 0.58} cy={r - cos(sA) * r * 0.58} r={4} fill={C.red} />
      <circle cx={r} cy={r} r={5} fill={C.yellow} />
      <circle cx={r} cy={r} r={2} fill={C.board} />
    </svg>
  );
}

/* ─── Platform Number Circle ─── */
function PlatformNumber({ num, size = 56 }: { num: string | number; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56">
      <circle cx={28} cy={28} r={26} fill={C.yellow} />
      <circle cx={28} cy={28} r={22} fill={C.board} />
      <text x={28} y={30} textAnchor="middle" dominantBaseline="middle" fill={C.white}
        fontFamily="var(--font-space-grotesk)" fontWeight="700" fontSize="22">{num}</text>
    </svg>
  );
}

/* ─── Signal Light SVG ─── */
function SignalLight({ active = "green" }: { active?: "red" | "amber" | "green" }) {
  return (
    <svg width={24} height={64} viewBox="0 0 24 64">
      <rect x={2} y={0} width={20} height={64} rx={4} fill={C.board} stroke={C.platform} strokeWidth={1} />
      {[{ cy: 12, c: C.red, k: "red" }, { cy: 32, c: C.yellow, k: "amber" }, { cy: 52, c: C.teal, k: "green" }].map(({ cy, c, k }) => (
        <g key={k}>
          <circle cx={12} cy={cy} r={7} fill={active === k ? c : "rgba(0,0,0,0.3)"} opacity={active === k ? 1 : 0.3} />
          {active === k && <circle cx={12} cy={cy} r={7} fill={c} opacity={0.5} className="signal-glow" />}
        </g>
      ))}
    </svg>
  );
}

/* ─── Railway Track Lines ─── */
function TrackLines() {
  return (
    <svg width="100%" height={20} viewBox="0 0 800 20" preserveAspectRatio="none">
      <line x1={0} y1={4} x2={800} y2={4} stroke={C.platform} strokeWidth={2} />
      <line x1={0} y1={16} x2={800} y2={16} stroke={C.platform} strokeWidth={2} />
      {Array.from({ length: 50 }).map((_, i) => (
        <rect key={i} x={i * 16 + 2} y={0} width={6} height={20} rx={1} fill={C.trackGray} opacity={0.5} />
      ))}
    </svg>
  );
}

/* ─── Train Silhouette (detailed) ─── */
function TrainSilhouette({ scale = 1 }: { scale?: number }) {
  const w = 200 * scale;
  const h = 48 * scale;
  return (
    <svg width={w} height={h} viewBox="0 0 200 48" fill="none">
      {/* Body */}
      <rect x={8} y={8} width={180} height={28} rx={6} fill={C.yellow} opacity={0.12} />
      <rect x={8} y={8} width={180} height={28} rx={6} stroke={C.yellow} strokeWidth={1} opacity={0.2} />
      {/* Front nose */}
      <path d="M188 8h4c4 0 6 3 6 7v14c0 4-2 7-6 7h-4V8z" fill={C.yellow} opacity={0.18} />
      {/* Windows */}
      {[24, 52, 80, 108, 136, 164].map((x, i) => (
        <rect key={i} x={x} y={14} width={16} height={10} rx={2}
          fill={i === 0 ? C.teal : C.yellow} opacity={i === 0 ? 0.3 : 0.1} />
      ))}
      {/* Headlight */}
      <circle cx={194} cy={22} r={3} fill={C.yellow} opacity={0.4} />
      {/* Wheels */}
      {[28, 56, 140, 168].map((x, i) => (
        <g key={i}>
          <circle cx={x} cy={40} r={5} fill={C.platform} opacity={0.4} />
          <circle cx={x} cy={40} r={2} fill={C.steel} opacity={0.6} />
        </g>
      ))}
      {/* Pantograph */}
      <line x1={100} y1={8} x2={90} y2={0} stroke={C.platform} strokeWidth={1} opacity={0.3} />
      <line x1={100} y1={8} x2={110} y2={0} stroke={C.platform} strokeWidth={1} opacity={0.3} />
      <line x1={88} y1={0} x2={112} y2={0} stroke={C.yellow} strokeWidth={1.5} opacity={0.25} />
    </svg>
  );
}

/* ─── Split-Flap Mechanism SVG (decorative) ─── */
function FlapMechanismSVG({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      {/* Housing */}
      <rect x={4} y={4} width={72} height={72} rx={4} fill={C.board} stroke={C.boardBorder} strokeWidth={1} />
      {/* Flap halves */}
      <rect x={10} y={10} width={60} height={28} rx={2} fill="#111" stroke={C.platform} strokeWidth={0.5} />
      <rect x={10} y={42} width={60} height={28} rx={2} fill="#0D0D0D" stroke={C.platform} strokeWidth={0.5} />
      {/* Center split line */}
      <line x1={10} y1={40} x2={70} y2={40} stroke={C.board} strokeWidth={2} />
      {/* Character */}
      <text x={40} y={42} textAnchor="middle" dominantBaseline="middle"
        fill={C.white} fontFamily="var(--font-space-grotesk)" fontSize={32} fontWeight={700}>G</text>
      {/* Axle */}
      <circle cx={6} cy={40} r={3} fill={C.platform} />
      <circle cx={74} cy={40} r={3} fill={C.platform} />
      {/* Roller hint */}
      <circle cx={6} cy={40} r={1.5} fill={C.steel} />
      <circle cx={74} cy={40} r={1.5} fill={C.steel} />
    </svg>
  );
}

/* ─── Destination Board Banner SVG ─── */
function DestinationBanner({ text }: { text: string }) {
  return (
    <svg width="100%" height={36} viewBox="0 0 600 36" preserveAspectRatio="xMidYMid meet">
      <rect x={0} y={0} width={600} height={36} fill={C.board} />
      <rect x={0} y={0} width={600} height={2} fill={C.yellow} opacity={0.6} />
      <rect x={0} y={34} width={600} height={2} fill={C.yellow} opacity={0.6} />
      {/* LED dots pattern */}
      {Array.from({ length: 40 }).map((_, i) => (
        <circle key={i} cx={8 + i * 15} cy={18} r={1} fill={C.yellow} opacity={0.15} />
      ))}
      <text x={300} y={20} textAnchor="middle" dominantBaseline="middle"
        fill={C.yellow} fontFamily="var(--font-space-grotesk)" fontSize={12}
        fontWeight={700} letterSpacing={4}>{text}</text>
    </svg>
  );
}

/* ─── Hazard Stripe ─── */
function HazardStripe() {
  return (
    <div
      className="hazard-animate"
      style={{
        height: 12,
        width: "100%",
        background: `repeating-linear-gradient(
          -45deg,
          ${C.yellow} 0px,
          ${C.yellow} 12px,
          ${C.board} 12px,
          ${C.board} 24px
        )`,
        backgroundSize: "48px 12px",
      }}
    />
  );
}

/* ─── Arrival/Departure Indicator Pill ─── */
function StatusPill({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px",
      borderRadius: 3, border: `1px solid ${color}`, fontFamily: "var(--font-space-grotesk)",
      fontSize: 9, fontWeight: 700, letterSpacing: 1, color, textTransform: "uppercase",
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: color, opacity: 0.8 }} />
      {label}
    </span>
  );
}

/* ─── Platform Edge Warning Pattern ─── */
function PlatformEdge() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, overflow: "hidden" }}>
      {Array.from({ length: 60 }).map((_, i) => (
        <div key={i} style={{
          width: 12, height: 6, background: i % 2 === 0 ? C.yellow : C.board,
          opacity: 0.5, flexShrink: 0,
        }} />
      ))}
    </div>
  );
}

/* ─── Section Title ─── */
function SectionTitle({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 48 }}
    >
      <SignalLight active="amber" />
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: "var(--font-sora)",
          fontSize: "clamp(28px, 4vw, 40px)",
          fontWeight: 800,
          color: C.white,
          letterSpacing: -1,
        }}>
          {children}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
          <div style={{ height: 3, background: C.yellow, width: 80, borderRadius: 2 }} />
          {subtitle && (
            <span style={{
              fontFamily: "var(--font-space-grotesk)",
              fontSize: 10,
              letterSpacing: 2,
              color: C.whiteMuted,
              textTransform: "uppercase",
            }}>
              {subtitle}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Departure Board Row ─── */
function DepartureBoardRow({ platform, destination, time, status, callingAt, index }: {
  platform: string | number; destination: string; time: string; status: string; callingAt: string; index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const statusColor = status === "ON TIME" ? C.teal : status === "BOARDING" ? C.yellow : C.white;
  return (
    <motion.div ref={ref} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.3, delay: index * 0.08 }}
      className="departure-row" style={{ display: "grid", gridTemplateColumns: "60px 1fr 80px 100px 1fr", gap: 0,
      background: C.board, borderBottom: `1px solid ${C.boardBorder}`, alignItems: "center", minHeight: 48 }}>
      <div style={{ textAlign: "center", fontFamily: "var(--font-space-grotesk)", fontWeight: 700, fontSize: 20, color: C.yellow, padding: "8px 0" }}>
        {inView ? <SplitFlapText text={String(platform)} delay={index * 80} charWidth="1.2ch" fontSize="20px" /> : <span style={{ opacity: 0 }}>{platform}</span>}
      </div>
      <div style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 600, fontSize: 15, color: C.white, padding: "8px 12px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
        {inView ? <SplitFlapText text={destination.toUpperCase()} delay={index * 80 + 100} charWidth="1ch" fontSize="15px" maxLength={24} speed={30} /> : <span style={{ opacity: 0 }}>{destination}</span>}
      </div>
      <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 14, color: C.yellow, textAlign: "center", padding: "8px 4px" }}>
        {inView ? <SplitFlapText text={time} delay={index * 80 + 200} charWidth="1.2ch" fontSize="14px" /> : <span style={{ opacity: 0 }}>{time}</span>}
      </div>
      <div style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 11, fontWeight: 700, color: statusColor, textAlign: "center", letterSpacing: 1, padding: "8px 4px" }}>{status}</div>
      <div style={{ fontFamily: "var(--font-inter)", fontSize: 11, color: C.whiteMuted, padding: "8px 12px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{callingAt}</div>
    </motion.div>
  );
}

/* ─── Routing Diagram ─── */
function RoutingDiagram({ stops }: { stops: string[] }) {
  const h = stops.length * 36 + 16;
  return (
    <svg width={280} height={h} viewBox={`0 0 280 ${h}`}>
      <line x1={20} y1={16} x2={20} y2={h - 16} stroke={C.yellow} strokeWidth={3} />
      {stops.map((stop, i) => {
        const y = 16 + i * 36;
        return (
          <g key={i}>
            <circle cx={20} cy={y} r={6} fill={C.board} stroke={C.yellow} strokeWidth={2} />
            <circle cx={20} cy={y} r={3} fill={i === 0 ? C.teal : i === stops.length - 1 ? C.red : C.yellow} />
            <text x={36} y={y + 1} fill={C.white} fontFamily="var(--font-inter)" fontSize={12} dominantBaseline="middle">{stop}</text>
            {i % 2 === 1 && i < stops.length - 1 && <line x1={20} y1={y} x2={45} y2={y - 8} stroke={C.platform} strokeWidth={1} strokeDasharray="3,3" />}
          </g>
        );
      })}
    </svg>
  );
}

/* ─── Ticket Stub ─── */
function TicketStub({ category, items, index }: { category: string; items: string[]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const ticketDate = new Date();
  const dateStr = ticketDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, rotateZ: -1 }}
      animate={inView ? { opacity: 1, y: 0, rotateZ: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{
        background: "#FFFEF8",
        borderRadius: 8,
        padding: "24px 28px 32px",
        position: "relative",
        overflow: "hidden",
        minWidth: 240,
        boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
      }}
    >
      {/* Perforation left edge */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 20,
        background: `repeating-linear-gradient(to bottom, transparent 0px, transparent 6px, ${C.bg} 6px, ${C.bg} 8px)`,
      }} />
      {/* Perforation right edge */}
      <div style={{
        position: "absolute", right: 0, top: 0, bottom: 0, width: 20,
        background: `repeating-linear-gradient(to bottom, transparent 0px, transparent 6px, ${C.bg} 6px, ${C.bg} 8px)`,
      }} />

      {/* Header */}
      <div style={{ paddingLeft: 16, paddingRight: 16 }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 2,
        }}>
          <div style={{
            fontFamily: "var(--font-space-grotesk)", fontSize: 9, fontWeight: 700,
            letterSpacing: 3, color: C.platform,
          }}>
            GROX RAILWAYS
          </div>
          <div style={{
            fontFamily: "var(--font-jetbrains)", fontSize: 8, color: C.platform, letterSpacing: 1,
          }}>
            {dateStr}
          </div>
        </div>

        {/* Category title */}
        <div style={{
          fontFamily: "var(--font-sora)", fontSize: 20, fontWeight: 700,
          color: C.board, marginBottom: 4,
        }}>
          {category}
        </div>

        {/* Class indicator */}
        <div style={{
          display: "inline-block", fontFamily: "var(--font-space-grotesk)", fontSize: 8,
          fontWeight: 700, letterSpacing: 2, color: C.white, background: C.board,
          padding: "2px 6px", borderRadius: 2, marginBottom: 10,
        }}>
          ZONE {index + 1} &mdash; ALL ROUTES
        </div>
      </div>

      {/* Tear line */}
      <div style={{
        borderTop: `2px dashed ${C.platform}`, margin: "0 16px 12px",
        opacity: 0.35, position: "relative",
      }}>
        {/* Semicircle notches */}
        <div style={{
          position: "absolute", left: -24, top: -6, width: 12, height: 12,
          borderRadius: "50%", background: C.bg,
        }} />
        <div style={{
          position: "absolute", right: -24, top: -6, width: 12, height: 12,
          borderRadius: "50%", background: C.bg,
        }} />
      </div>

      {/* Items list */}
      <div style={{ paddingLeft: 16, paddingRight: 16 }}>
        {items.map((item, i) => (
          <div key={i} style={{
            fontFamily: "var(--font-jetbrains)", fontSize: 13, color: C.bg,
            padding: "5px 0", display: "flex", alignItems: "center", gap: 8,
            borderBottom: i < items.length - 1 ? `1px solid rgba(0,0,0,0.06)` : "none",
          }}>
            <span style={{ color: C.yellow, fontSize: 10 }}>&#x25C6;</span>
            {item}
            <span style={{
              marginLeft: "auto", fontFamily: "var(--font-jetbrains)",
              fontSize: 10, color: C.platform,
            }}>
              &#x2713;
            </span>
          </div>
        ))}
      </div>

      {/* Ticket number watermark */}
      <div style={{
        position: "absolute", bottom: 8, right: 24, fontFamily: "var(--font-jetbrains)",
        fontSize: 28, fontWeight: 700, color: "rgba(245,197,66,0.12)",
      }}>
        #{String(index + 1).padStart(2, "0")}
      </div>

      {/* Barcode decoration */}
      <div style={{
        position: "absolute", bottom: 8, left: 24, display: "flex", gap: 1,
        alignItems: "flex-end", height: 20,
      }}>
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} style={{
            width: i % 3 === 0 ? 2 : 1, background: C.board, opacity: 0.15,
            height: 8 + (i * 7) % 12,
          }} />
        ))}
      </div>

      {/* Corner triangle */}
      <div style={{
        position: "absolute", top: 0, right: 0, width: 50, height: 50,
        background: `linear-gradient(135deg, ${C.yellow} 0%, ${C.yellow} 50%, transparent 50%)`,
        opacity: 0.12,
      }} />
    </motion.div>
  );
}

/* ─── Project Card ─── */
function ProjectCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [expanded, setExpanded] = useState(false);
  const titleClean = project.title.replace(/\n/g, " ");
  const status = index % 3 === 1 ? "BOARDING" : "ON TIME";
  const statusColor = status === "BOARDING" ? C.yellow : C.teal;

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.05 }} onClick={() => setExpanded(!expanded)}
      style={{ background: C.board, borderRadius: 8, border: `1px solid ${expanded ? C.yellow : C.boardBorder}`,
        overflow: "hidden", cursor: "pointer", transition: "border-color 0.3s" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px" }}>
        <PlatformNumber num={index + 1} size={44} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "var(--font-sora)", fontSize: 16, fontWeight: 700, color: C.white, marginBottom: 2,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{titleClean}</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 11, color: C.whiteMuted }}>{project.client}</span>
            <span style={{ color: C.platform }}>&#x2022;</span>
            <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 11, color: C.yellow }}>{project.year}</span>
          </div>
        </div>
        <div style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 10, fontWeight: 700, letterSpacing: 1,
          color: statusColor, border: `1px solid ${statusColor}`, borderRadius: 4, padding: "3px 8px", flexShrink: 0 }}>{status}</div>
        <motion.span animate={{ rotate: expanded ? 90 : 0 }}
          style={{ color: C.yellow, fontSize: 18, flexShrink: 0, fontFamily: "var(--font-space-grotesk)" }}>&#x27F6;</motion.span>
      </div>
      <div style={{ padding: "0 20px 12px 80px", display: "flex", gap: 6, flexWrap: "wrap" }}>
        {project.tech.map((t, ti) => (
          <span key={ti} style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, color: C.board,
            background: C.yellow, borderRadius: 3, padding: "2px 6px", fontWeight: 600 }}>{t}</span>
        ))}
      </div>
      <motion.div initial={false} animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
        transition={{ duration: 0.35 }} style={{ overflow: "hidden" }}>
        <div style={{ padding: "0 20px 20px", borderTop: `1px solid ${C.boardBorder}`, paddingTop: 16 }}>
          <div style={{ fontFamily: "var(--font-inter)", fontSize: 13, lineHeight: 1.7, color: C.whiteMuted, marginBottom: 12 }}>
            {project.description}
          </div>
          <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 12, lineHeight: 1.6, color: "rgba(245,197,66,0.7)",
            padding: "12px 16px", background: "rgba(245,197,66,0.05)", borderRadius: 6,
            border: "1px solid rgba(245,197,66,0.1)", marginBottom: 12 }}>{project.technical}</div>
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
              style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 12, color: C.teal, textDecoration: "none",
                display: "inline-flex", alignItems: "center", gap: 6 }}>
              <svg width={14} height={14} viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              View Source
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Expertise Platform Display ─── */
function ExpertisePlatform({ exp, index }: { exp: { title: string; body: string }; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const stops = exp.body.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 5);
  const signalStates: Array<"red" | "amber" | "green"> = ["green", "amber", "green", "amber"];
  const platformLetters = ["A", "B", "C", "D"];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      style={{
        background: C.board,
        borderRadius: 12,
        border: `1px solid ${C.boardBorder}`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Platform header bar */}
      <div style={{
        background: C.yellow,
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}>
        <PlatformNumber num={platformLetters[index]} size={36} />
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: "var(--font-sora)", fontSize: 15,
            fontWeight: 700, color: C.board,
          }}>
            {exp.title}
          </div>
          <div style={{
            fontFamily: "var(--font-jetbrains)", fontSize: 9,
            color: "rgba(10,10,10,0.5)", letterSpacing: 1, marginTop: 1,
          }}>
            PLATFORM {index + 1}{platformLetters[index]}
          </div>
        </div>
        <SignalLight active={signalStates[index]} />
      </div>

      {/* Destination banner */}
      <div style={{ padding: "0" }}>
        <DestinationBanner text={`SERVICE ${index + 1}: ${exp.title.toUpperCase()}`} />
      </div>

      {/* Body */}
      <div style={{ padding: "16px 20px", flex: 1 }}>
        <div style={{
          fontFamily: "var(--font-inter)", fontSize: 13,
          lineHeight: 1.7, color: C.whiteMuted, marginBottom: 16,
        }}>
          {exp.body}
        </div>

        {/* Route diagram with station-style labels */}
        <div style={{
          background: "rgba(255,255,255,0.02)",
          borderRadius: 8,
          padding: "12px 8px",
          border: `1px solid ${C.boardBorder}`,
        }}>
          <div style={{
            fontFamily: "var(--font-space-grotesk)", fontSize: 9,
            color: C.yellow, letterSpacing: 2, marginBottom: 8,
            paddingLeft: 8, textTransform: "uppercase",
          }}>
            Route Stations
          </div>
          <RoutingDiagram stops={stops} />
        </div>
      </div>

      {/* Bottom status strip */}
      <div style={{
        padding: "10px 16px",
        borderTop: `1px solid ${C.boardBorder}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <StatusPill label="Active" color={C.teal} />
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            fontFamily: "var(--font-jetbrains)", fontSize: 9,
            color: C.platform, letterSpacing: 1,
          }}>
            NEXT TRAIN
          </span>
          <span
            className="arrow-slide"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              color: C.yellow, fontSize: 14,
            }}
          >
            &#x27F6;
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════ */
export default function DepotPage() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const tick = () => setCurrentTime(new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    tick(); const iv = setInterval(tick, 1000); return () => clearInterval(iv);
  }, []);

  const statusFor = (i: number) => (i % 3 === 1 ? "BOARDING" : "ON TIME");

  return (
    <>
      <style>{`
        @keyframes signal-pulse { 0%,100% { opacity: 0.3 } 50% { opacity: 0.8 } }
        .signal-glow { animation: signal-pulse 2s ease-in-out infinite; }
        @keyframes blink-indicator { 0%,49% { opacity: 1 } 50%,100% { opacity: 0.3 } }
        .blink { animation: blink-indicator 1.5s step-end infinite; }
        @keyframes platform-pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(245,197,66,0.4) } 50% { box-shadow: 0 0 20px 4px rgba(245,197,66,0.15) } }
        .platform-glow { animation: platform-pulse 3s ease-in-out infinite; }
        @keyframes train-move { 0% { transform: translateX(-100%) } 100% { transform: translateX(100vw) } }
        .train-animate { animation: train-move 20s linear infinite; }
        @keyframes board-scan { 0% { top: 0 } 100% { top: 100% } }
        .board-scanline { position:absolute; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(245,197,66,0.1),transparent); animation:board-scan 4s linear infinite; pointer-events:none; }
        .departure-row:hover { background: #111 !important; }
        @keyframes arrow-slide { 0%,100% { transform: translateX(0) } 50% { transform: translateX(6px) } }
        .arrow-slide { animation: arrow-slide 2s ease-in-out infinite; }
        ::selection { background: rgba(245,197,66,0.3); color: #fff; }
        .depot-page::-webkit-scrollbar { width: 6px }
        .depot-page::-webkit-scrollbar-track { background: #1A1A1A }
        .depot-page::-webkit-scrollbar-thumb { background: #F5C542; border-radius: 3px }
        @keyframes hazard-scroll { 0% { background-position: 0 0 } 100% { background-position: 48px 0 } }
        .hazard-animate { animation: hazard-scroll 1s linear infinite; }
        @keyframes flicker { 0%,97%,100% { opacity: 1 } 98% { opacity: 0.85 } 99% { opacity: 0.95 } }
        .led-flicker { animation: flicker 5s ease-in-out infinite; }
        @keyframes dot-pulse { 0%,100% { opacity: 0.2 } 50% { opacity: 0.7 } }
        .dot-pulse { animation: dot-pulse 3s ease-in-out infinite; }
      `}</style>

      <div className="depot-page" style={{ background: C.bg, color: C.white, minHeight: "100vh", fontFamily: "var(--font-inter)", overflowX: "hidden" }}>

        {/* ═══ HERO ═══ */}
        <section ref={heroRef} style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center",
          alignItems: "center", position: "relative", overflow: "hidden", padding: "40px 24px" }}>
          {/* Background grid */}
          <div style={{ position: "absolute", inset: 0, opacity: 0.03, pointerEvents: "none",
            backgroundImage: `repeating-linear-gradient(90deg, ${C.yellow} 0px, ${C.yellow} 2px, transparent 2px, transparent 30px),
              repeating-linear-gradient(0deg, ${C.platform} 0px, ${C.platform} 1px, transparent 1px, transparent 60px)` }} />
          {/* Floating flap mechanism decorations */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 0.06 } : {}}
            transition={{ duration: 1, delay: 1.5 }}
            style={{ position: "absolute", top: 60, left: 40, pointerEvents: "none" }}
          >
            <FlapMechanismSVG size={100} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 0.04 } : {}}
            transition={{ duration: 1, delay: 1.8 }}
            style={{ position: "absolute", top: 120, right: 60, pointerEvents: "none" }}
          >
            <FlapMechanismSVG size={70} />
          </motion.div>

          {/* Animated train */}
          <div style={{ position: "absolute", bottom: 100, left: 0, width: "100%", pointerEvents: "none" }}>
            <div className="train-animate" style={{ display: "inline-block" }}><TrainSilhouette scale={1.2} /></div>
          </div>
          {/* Track */}
          <div style={{ position: "absolute", bottom: 80, left: 0, right: 0 }}><TrackLines /></div>

          {/* Overhead wire */}
          <div style={{
            position: "absolute", top: 30, left: 0, right: 0, height: 1,
            background: C.platform, opacity: 0.15, pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", top: 32, left: 0, right: 0, height: 1,
            background: C.platform, opacity: 0.08, pointerEvents: "none",
          }} />

          {/* Station sign */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={heroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }} className="platform-glow"
            style={{ background: C.board, border: `3px solid ${C.yellow}`, borderRadius: 12, padding: "32px 64px",
              marginBottom: 40, position: "relative", boxShadow: `0 0 60px rgba(245,197,66,0.1), inset 0 0 40px rgba(0,0,0,0.5)` }}>
            {/* Corner rivets */}
            {[{ top: 8, left: 8 }, { top: 8, right: 8 }, { bottom: 8, left: 8 }, { bottom: 8, right: 8 }].map((pos, i) => (
              <div key={i} style={{ position: "absolute", ...pos, width: 8, height: 8, borderRadius: "50%",
                background: C.platform, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)" } as React.CSSProperties} />
            ))}
            <div style={{ fontFamily: "var(--font-sora)", fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 800,
              color: C.white, textAlign: "center", letterSpacing: 4, lineHeight: 1.1 }}>GRAND CENTRAL</div>
            <div style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "clamp(20px, 3vw, 36px)", fontWeight: 600,
              color: C.yellow, textAlign: "center", letterSpacing: 12, marginTop: 4 }}>GROX</div>
          </motion.div>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              fontFamily: "var(--font-inter)", fontSize: 14, color: C.whiteMuted,
              textAlign: "center", marginBottom: 32, maxWidth: 400, lineHeight: 1.6,
            }}
          >
            AI Product Engineer &mdash; building intelligent systems from platform to production
          </motion.div>

          {/* Clock with label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ marginBottom: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
          >
            <StationClock size={140} />
            <span style={{
              fontFamily: "var(--font-space-grotesk)", fontSize: 9, letterSpacing: 3,
              color: C.platform, textTransform: "uppercase",
            }}>
              Swiss Railway Clock
            </span>
          </motion.div>

          {/* Information board */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.5 }}
            style={{ background: C.board, border: `1px solid ${C.boardBorder}`, borderRadius: 8,
              padding: "24px 32px", maxWidth: 600, width: "100%", position: "relative", overflow: "hidden" }}>
            <div className="board-scanline" />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16,
              borderBottom: `1px solid ${C.boardBorder}`, paddingBottom: 8 }}>
              <span style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 10, fontWeight: 700, letterSpacing: 3, color: C.yellow }}>INFORMATION</span>
              <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 13, color: C.teal }}>{currentTime}</span>
            </div>
            {[{ label: "ROLE", text: "AI PRODUCT ENGINEER", d: 600 }, { label: "LINE", text: "FULL STACK + AI/ML", d: 1000 },
              { label: "STATUS", text: "ALL SERVICES RUNNING", d: 1400 }].map(({ label, text, d }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <span style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 11, color: C.yellow, width: 60, letterSpacing: 1 }}>{label}</span>
                <SplitFlapText text={text} delay={d} charWidth="1ch" fontSize="14px" maxLength={28} />
              </div>
            ))}
          </motion.div>

          {/* Platform stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            style={{ display: "flex", gap: 40, marginTop: 48, flexWrap: "wrap", justifyContent: "center" }}>
            {stats.map((stat, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <PlatformNumber num={stat.value} size={64} />
                <div style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 11, fontWeight: 600, letterSpacing: 2,
                  color: C.whiteMuted, marginTop: 8, textTransform: "uppercase" }}>{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 0.6 }}
            style={{ position: "absolute", bottom: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 10, letterSpacing: 3, color: C.yellow }}>DEPARTURES BELOW</span>
            <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
              style={{ color: C.yellow, fontSize: 20 }}>&#x25BC;</motion.span>
          </motion.div>
        </section>

        <HazardStripe />

        {/* ═══ PROJECTS ═══ */}
        <section style={{ padding: "80px 24px", maxWidth: 1200, margin: "0 auto" }}>
          <SectionTitle subtitle="10 scheduled services">Departures</SectionTitle>

          {/* Departure board */}
          <div style={{ background: C.board, borderRadius: 12, overflow: "hidden", border: `1px solid ${C.boardBorder}`,
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)", position: "relative" }}>
            <div className="board-scanline" />
            {/* Column headers */}
            <div style={{ display: "grid", gridTemplateColumns: "60px 1fr 80px 100px 1fr", gap: 0, padding: "12px 0",
              borderBottom: `2px solid ${C.yellow}` }}>
              {["PLT", "DESTINATION", "TIME", "STATUS", "CALLING AT"].map((h, i) => (
                <div key={i} style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 10, fontWeight: 700, letterSpacing: 2,
                  color: C.yellow, textAlign: i === 0 || i === 2 || i === 3 ? "center" : "left", padding: "0 12px" }}>{h}</div>
              ))}
            </div>
            {/* Live indicator */}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 16px", background: "#050505",
              borderBottom: `1px solid ${C.boardBorder}` }}>
              <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, color: C.teal }}>&#x25CF; LIVE DEPARTURES</span>
              <span className="blink" style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, color: C.teal }}>{currentTime}</span>
            </div>
            {/* Rows */}
            {projects.map((p, i) => (
              <DepartureBoardRow key={i} platform={i + 1} destination={p.title.replace(/\n/g, " ")}
                time={p.year} status={statusFor(i)} callingAt={p.tech.join(" \u2022 ")} index={i} />
            ))}
            <div style={{ padding: "12px 16px", borderTop: `1px solid ${C.boardBorder}`, display: "flex",
              justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 10, color: C.platform, letterSpacing: 2 }}>
                {projects.length} SERVICES SCHEDULED</span>
              <span className="arrow-slide" style={{ color: C.yellow, fontFamily: "var(--font-space-grotesk)", fontSize: 14 }}>&#x27F6;</span>
            </div>
          </div>

          {/* Expanded cards */}
          <div style={{ marginTop: 48, display: "flex", flexDirection: "column", gap: 24 }}>
            {projects.map((p, i) => <ProjectCard key={i} project={p} index={i} />)}
          </div>
        </section>

        {/* Track divider with train */}
        <div style={{ padding: "0 24px", maxWidth: 1200, margin: "0 auto" }}>
          <TrackLines />
          <div style={{
            display: "flex", justifyContent: "center", padding: "16px 0",
            opacity: 0.3,
          }}>
            <TrainSilhouette scale={0.8} />
          </div>
          <TrackLines />
        </div>

        {/* ═══ EXPERTISE ═══ */}
        <section style={{ padding: "80px 24px", maxWidth: 1200, margin: "0 auto" }}>
          <SectionTitle subtitle="4 service lines">Platform Information</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {expertise.map((exp, i) => <ExpertisePlatform key={i} exp={exp} index={i} />)}
          </div>
        </section>

        <HazardStripe />

        {/* ═══ TOOLS ═══ */}
        <section style={{ padding: "80px 24px", maxWidth: 1200, margin: "0 auto" }}>
          <SectionTitle subtitle="6 zones available">Ticket Office</SectionTitle>

          {/* Ticket machine frame */}
          <div style={{
            background: C.board,
            borderRadius: 16,
            border: `2px solid ${C.boardBorder}`,
            padding: "0",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Machine header strip */}
            <div style={{
              background: "linear-gradient(180deg, #151515, #0A0A0A)",
              padding: "20px 32px 16px",
              borderBottom: `1px solid ${C.boardBorder}`,
            }}>
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                marginBottom: 12,
              }}>
                <div>
                  <div style={{
                    fontFamily: "var(--font-sora)", fontSize: 16, fontWeight: 700,
                    letterSpacing: 4, color: C.yellow, textTransform: "uppercase",
                  }}>
                    Select Your Route
                  </div>
                  <div style={{
                    fontFamily: "var(--font-inter)", fontSize: 12, color: C.whiteMuted,
                    marginTop: 4,
                  }}>
                    Technologies &amp; tools across the full stack
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <SignalLight active="green" />
                </div>
              </div>
              {/* LED display strip */}
              <div className="led-flicker" style={{
                background: C.board, borderRadius: 4, padding: "6px 12px",
                border: `1px solid ${C.boardBorder}`,
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <span style={{
                  fontFamily: "var(--font-jetbrains)", fontSize: 10, color: C.teal,
                  letterSpacing: 1,
                }}>
                  &#x25CF; {tools.length} TICKET CATEGORIES AVAILABLE
                </span>
                <span className="dot-pulse" style={{
                  fontFamily: "var(--font-jetbrains)", fontSize: 10, color: C.yellow,
                }}>
                  SELECT BELOW
                </span>
              </div>
            </div>

            {/* Ticket grid */}
            <div style={{ padding: "28px 32px 20px" }}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 20,
              }}>
                {tools.map((tool, i) => (
                  <TicketStub key={i} category={tool.label} items={tool.items} index={i} />
                ))}
              </div>
            </div>

            {/* Machine bottom panel */}
            <div style={{
              padding: "16px 32px 20px",
              borderTop: `1px solid ${C.boardBorder}`,
              display: "flex", justifyContent: "center", alignItems: "center", gap: 24,
            }}>
              {/* Coin slot */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 30, height: 4, background: C.platform, borderRadius: 2,
                  boxShadow: "inset 0 1px 2px rgba(0,0,0,0.5)",
                }} />
                <span style={{
                  fontFamily: "var(--font-jetbrains)", fontSize: 9,
                  color: C.platform, letterSpacing: 2,
                }}>
                  INSERT COIN
                </span>
                <div style={{
                  width: 30, height: 4, background: C.platform, borderRadius: 2,
                  boxShadow: "inset 0 1px 2px rgba(0,0,0,0.5)",
                }} />
              </div>
              {/* Card reader */}
              <div style={{
                width: 1, height: 16, background: C.boardBorder,
              }} />
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 24, height: 16, borderRadius: 3, border: `1px solid ${C.platform}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <div style={{ width: 14, height: 2, background: C.platform, borderRadius: 1 }} />
                </div>
                <span style={{
                  fontFamily: "var(--font-jetbrains)", fontSize: 9,
                  color: C.platform, letterSpacing: 2,
                }}>
                  TAP CARD
                </span>
              </div>
            </div>

            {/* Corner signals */}
            <div style={{ position: "absolute", top: 16, right: 16 }}>
              <SignalLight active="green" />
            </div>
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer style={{ position: "relative" }}>
          {/* Platform edge warning */}
          <PlatformEdge />
          <HazardStripe />

          <div style={{ background: C.board, padding: "60px 24px 40px", textAlign: "center" }}>
            {/* Mind the gap headline */}
            <motion.div
              initial={{ opacity: 0, letterSpacing: 0 }}
              whileInView={{ opacity: 1, letterSpacing: 12 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              style={{
                fontFamily: "var(--font-sora)",
                fontSize: "clamp(32px, 5vw, 56px)",
                fontWeight: 800,
                color: C.yellow,
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Mind the Gap
            </motion.div>

            {/* Gap visualization */}
            <div style={{
              maxWidth: 400, margin: "0 auto 32px",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
            }}>
              <div style={{
                flex: 1, height: 8, background: C.platform, borderRadius: "4px 0 0 4px",
              }} />
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ width: 60, height: 8, borderBottom: `2px dashed ${C.red}` }}
              />
              <div style={{
                flex: 1, height: 8, background: C.platform, borderRadius: "0 4px 4px 0",
              }} />
            </div>

            {/* Terminal info */}
            <div style={{
              fontFamily: "var(--font-space-grotesk)", fontSize: 12, letterSpacing: 4,
              color: C.whiteMuted, textTransform: "uppercase", marginBottom: 32,
            }}>
              Terminal: GROX Central
            </div>

            {/* Departure summary board */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{
                maxWidth: 500, margin: "0 auto 32px",
                background: "rgba(255,255,255,0.02)",
                borderRadius: 8, border: `1px solid ${C.boardBorder}`,
                padding: "16px 24px",
              }}
            >
              <div style={{
                fontFamily: "var(--font-space-grotesk)", fontSize: 10,
                letterSpacing: 3, color: C.yellow, marginBottom: 12,
                textTransform: "uppercase",
              }}>
                Today&apos;s Service Summary
              </div>
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16,
              }}>
                {[
                  { label: "Total Services", value: "10", color: C.white },
                  { label: "On Time", value: "7", color: C.teal },
                  { label: "Boarding", value: "3", color: C.yellow },
                ].map((stat, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{
                      fontFamily: "var(--font-jetbrains)", fontSize: 24,
                      fontWeight: 700, color: stat.color,
                    }}>
                      {stat.value}
                    </div>
                    <div style={{
                      fontFamily: "var(--font-inter)", fontSize: 10, color: C.whiteMuted,
                    }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Train illustration */}
            <div style={{
              display: "flex", justifyContent: "center", gap: 24, marginBottom: 24,
            }}>
              <TrainSilhouette scale={1.5} />
            </div>

            {/* Track */}
            <div style={{ maxWidth: 600, margin: "0 auto 24px" }}><TrackLines /></div>

            {/* Info columns */}
            <div style={{
              display: "flex", justifyContent: "center", gap: 40,
              flexWrap: "wrap", marginBottom: 32,
            }}>
              {[
                { l: "NETWORK", v: "GROX RAILWAYS" },
                { l: "ZONE", v: "AI / FULL-STACK" },
                { l: "TERMINUS", v: "PRODUCTION" },
                { l: "SERVICE", v: currentTime },
              ].map((item, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{
                    fontFamily: "var(--font-space-grotesk)", fontSize: 9,
                    letterSpacing: 2, color: C.yellow, marginBottom: 2,
                  }}>
                    {item.l}
                  </div>
                  <div style={{
                    fontFamily: "var(--font-jetbrains)", fontSize: 12, color: C.whiteMuted,
                  }}>
                    {item.v}
                  </div>
                </div>
              ))}
            </div>

            {/* Signal lights row */}
            <div style={{
              display: "flex", justifyContent: "center", gap: 16, marginBottom: 32,
            }}>
              <SignalLight active="red" />
              <SignalLight active="amber" />
              <SignalLight active="green" />
            </div>

            {/* Announcement */}
            <div style={{
              maxWidth: 500, margin: "0 auto 24px", padding: "10px 16px",
              background: "rgba(245,197,66,0.04)", borderRadius: 6,
              border: `1px solid rgba(245,197,66,0.1)`,
            }}>
              <span style={{
                fontFamily: "var(--font-space-grotesk)", fontSize: 10,
                color: C.yellow, letterSpacing: 1,
              }}>
                &#x1F4E2; ANNOUNCEMENT:
              </span>
              <span style={{
                fontFamily: "var(--font-inter)", fontSize: 11, color: C.whiteMuted,
                marginLeft: 8,
              }}>
                All services running normally. Next departure from Platform 1.
              </span>
            </div>

            {/* Copyright */}
            <div style={{
              fontFamily: "var(--font-inter)", fontSize: 11, color: C.platform,
            }}>
              &copy; {new Date().getFullYear()} Grox Central Station &mdash; All services operational
            </div>
          </div>

          <HazardStripe />
          <PlatformEdge />
        </footer>

        <ThemeSwitcher current="/depot" variant="dark" />
      </div>
    </>
  );
}
