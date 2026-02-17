"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { projects, stats, expertise, tools } from "@/app/data/projects";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";

/* ─── Color Palette ─── */
const C = {
  bg: "#0C0C14",
  bgCard: "#161620",
  brass: "#D4A844",
  brassMuted: "rgba(212,168,68,0.5)",
  brassLight: "rgba(212,168,68,0.12)",
  steel: "#A0A8B4",
  steelMuted: "rgba(160,168,180,0.4)",
  copper: "#B87333",
  ruby: "#C62828",
  rubyGlow: "rgba(198,40,40,0.5)",
  ivory: "#FFF8E8",
  ivoryMuted: "rgba(255,248,232,0.85)",
  gunmetal: "#2C2C34",
  text: "#E8E4D8",
  textMuted: "rgba(232,228,216,0.5)",
  border: "rgba(212,168,68,0.2)",
  borderBright: "rgba(212,168,68,0.4)",
};

/* ─── Roman Numerals ─── */
const ROMAN = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];

/* ─── SVG Gear Component ─── */
function GearSVG({
  cx,
  cy,
  outerR,
  innerR,
  teeth,
  toothDepth,
  fill = "none",
  stroke = C.brass,
  strokeWidth = 1.5,
  id,
}: {
  cx: number;
  cy: number;
  outerR: number;
  innerR: number;
  teeth: number;
  toothDepth: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  id?: string;
}) {
  const points: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a1 = (i / teeth) * Math.PI * 2 - Math.PI / 2;
    const a2 = ((i + 0.3) / teeth) * Math.PI * 2 - Math.PI / 2;
    const a3 = ((i + 0.5) / teeth) * Math.PI * 2 - Math.PI / 2;
    const a4 = ((i + 0.8) / teeth) * Math.PI * 2 - Math.PI / 2;
    const r1 = outerR;
    const r2 = outerR + toothDepth;
    points.push(`${cx + r1 * Math.cos(a1)},${cy + r1 * Math.sin(a1)}`);
    points.push(`${cx + r2 * Math.cos(a2)},${cy + r2 * Math.sin(a2)}`);
    points.push(`${cx + r2 * Math.cos(a3)},${cy + r2 * Math.sin(a3)}`);
    points.push(`${cx + r1 * Math.cos(a4)},${cy + r1 * Math.sin(a4)}`);
  }
  return (
    <g id={id}>
      <polygon points={points.join(" ")} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
      <circle cx={cx} cy={cy} r={innerR} fill="none" stroke={stroke} strokeWidth={strokeWidth * 0.8} />
      <circle cx={cx} cy={cy} r={3} fill={stroke} />
    </g>
  );
}

/* ─── Pendulum SVG ─── */
function PendulumSVG() {
  return (
    <svg width="40" height="200" viewBox="0 0 40 200" fill="none" className="cw-pendulum">
      <line x1="20" y1="0" x2="20" y2="160" stroke={C.brass} strokeWidth="2" />
      <circle cx="20" cy="175" r="18" fill="none" stroke={C.brass} strokeWidth="2" />
      <circle cx="20" cy="175" r="12" fill={C.brassLight} stroke={C.brass} strokeWidth="1" />
      <circle cx="20" cy="175" r="4" fill={C.brass} />
    </svg>
  );
}

/* ─── Watch Hands SVG ─── */
function WatchHands() {
  return (
    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" className="cw-watch-hands">
      {/* Hour hand */}
      <line x1="100" y1="100" x2="100" y2="45" stroke={C.brass} strokeWidth="4" strokeLinecap="round" className="cw-hour-hand" />
      {/* Minute hand */}
      <line x1="100" y1="100" x2="100" y2="28" stroke={C.steel} strokeWidth="2.5" strokeLinecap="round" className="cw-minute-hand" />
      {/* Second hand */}
      <g className="cw-second-hand">
        <line x1="100" y1="120" x2="100" y2="22" stroke={C.ruby} strokeWidth="1" strokeLinecap="round" />
        <circle cx="100" cy="22" r="2" fill={C.ruby} />
      </g>
      {/* Center jewel */}
      <circle cx="100" cy="100" r="5" fill={C.brass} />
      <circle cx="100" cy="100" r="3" fill={C.ruby} />
    </svg>
  );
}

/* ─── Noise Texture ─── */
function NoiseOverlay() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1 }}>
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.03 }}>
        <filter id="cw-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#cw-noise)" />
      </svg>
    </div>
  );
}

/* ─── Mainspring Spiral SVG ─── */
function MainspringSVG({ size = 120 }: { size?: number }) {
  const cx = size / 2;
  const cy = size / 2;
  let d = `M ${cx} ${cy}`;
  for (let i = 0; i < 720; i += 5) {
    const angle = (i * Math.PI) / 180;
    const r = 4 + i * 0.06;
    d += ` L ${cx + r * Math.cos(angle)} ${cy + r * Math.sin(angle)}`;
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <path d={d} stroke={C.brass} strokeWidth="1.2" opacity="0.6" />
    </svg>
  );
}

/* ─── Jewel Bearing SVG ─── */
function JewelBearingSVG({ size = 32, glow = false }: { size?: number; glow?: boolean }) {
  const r = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <defs>
        <radialGradient id={`jewel-${size}-${glow ? "g" : "n"}`} cx="40%" cy="35%">
          <stop offset="0%" stopColor="#FF4444" />
          <stop offset="50%" stopColor={C.ruby} />
          <stop offset="100%" stopColor="#8B0000" />
        </radialGradient>
      </defs>
      {glow && <circle cx={r} cy={r} r={r} fill={C.rubyGlow} opacity="0.3" />}
      <circle cx={r} cy={r} r={r * 0.7} fill={`url(#jewel-${size}-${glow ? "g" : "n"})`} />
      <circle cx={r} cy={r} r={r * 0.7} fill="none" stroke={C.brass} strokeWidth="1.5" />
      <circle cx={r * 0.75} cy={r * 0.7} r={r * 0.15} fill="rgba(255,255,255,0.4)" />
    </svg>
  );
}

/* ─── Section Divider ─── */
function GearDivider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "40px 0", justifyContent: "center" }}>
      <div style={{ height: 1, flex: 1, maxWidth: 200, background: `linear-gradient(to right, transparent, ${C.border})` }} />
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <GearSVG cx={20} cy={20} outerR={14} innerR={6} teeth={12} toothDepth={4} stroke={C.brassMuted} strokeWidth={1} />
      </svg>
      <div style={{ height: 1, flex: 1, maxWidth: 200, background: `linear-gradient(to left, transparent, ${C.border})` }} />
    </div>
  );
}

/* ─── Project Gear Card ─── */
function ProjectGear({
  project,
  index,
  scrollProgress,
}: {
  project: (typeof projects)[number];
  index: number;
  scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const isEven = index % 2 === 0;

  const teethCount = 20 + (index % 4) * 4;
  const gearSize = 280 + (index % 3) * 40;
  const rotation = useTransform(scrollProgress, [0, 1], isEven ? [0, 360] : [0, -360]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isEven ? -60 : 60 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.1 }}
      style={{
        display: "flex",
        alignItems: isEven ? "flex-start" : "flex-end",
        flexDirection: "column",
        position: "relative",
        marginBottom: -20,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 32,
          flexDirection: isEven ? "row" : "row-reverse",
          width: "100%",
          maxWidth: 900,
        }}
      >
        {/* Rotating gear decoration */}
        <motion.div
          style={{
            rotate: rotation,
            flexShrink: 0,
            width: gearSize * 0.4,
            height: gearSize * 0.4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width={gearSize * 0.4} height={gearSize * 0.4} viewBox={`0 0 ${gearSize * 0.4} ${gearSize * 0.4}`} fill="none">
            <GearSVG
              cx={gearSize * 0.2}
              cy={gearSize * 0.2}
              outerR={gearSize * 0.15}
              innerR={gearSize * 0.06}
              teeth={teethCount}
              toothDepth={gearSize * 0.025}
              stroke={C.brass}
              fill={C.brassLight}
              strokeWidth={1}
            />
          </svg>
        </motion.div>

        {/* Content card */}
        <div
          style={{
            flex: 1,
            background: C.bgCard,
            border: `1px solid ${C.border}`,
            borderRadius: 4,
            padding: "28px 32px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Top accent line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background: `linear-gradient(to right, ${C.brass}, ${C.copper}, ${C.brass})`,
            }}
          />

          {/* Index number */}
          <div
            style={{
              position: "absolute",
              top: 12,
              right: 16,
              fontFamily: "var(--font-jetbrains)",
              fontSize: 11,
              color: C.brassMuted,
              letterSpacing: "0.1em",
            }}
          >
            CAL.{String(index + 1).padStart(2, "0")}
          </div>

          {/* Project title */}
          <h3
            style={{
              fontFamily: "var(--font-dm-serif)",
              fontSize: 22,
              color: C.ivory,
              lineHeight: 1.2,
              marginBottom: 6,
              whiteSpace: "pre-line",
            }}
          >
            {project.title}
          </h3>

          {/* Client + Year */}
          <div
            style={{
              display: "flex",
              gap: 16,
              marginBottom: 12,
              fontFamily: "var(--font-space-grotesk)",
              fontSize: 12,
              color: C.brass,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            <span>{project.client}</span>
            <span style={{ color: C.steelMuted }}>|</span>
            <span style={{ fontFamily: "var(--font-jetbrains)" }}>{project.year}</span>
          </div>

          {/* Description */}
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: 14,
              lineHeight: 1.65,
              color: C.text,
              marginBottom: 12,
              opacity: 0.85,
            }}
          >
            {project.description}
          </p>

          {/* Technical */}
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: 13,
              lineHeight: 1.6,
              color: C.textMuted,
              marginBottom: 16,
            }}
          >
            {project.technical}
          </p>

          {/* Tech stack */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {project.tech.map((t) => (
              <span
                key={t}
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  fontSize: 11,
                  padding: "4px 10px",
                  border: `1px solid ${C.border}`,
                  borderRadius: 2,
                  color: C.brass,
                  background: C.brassLight,
                  letterSpacing: "0.03em",
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
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                marginTop: 14,
                fontFamily: "var(--font-space-grotesk)",
                fontSize: 12,
                color: C.steel,
                textDecoration: "none",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Source
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Expertise Jewel ─── */
function ExpertiseJewel({ item, index }: { item: (typeof expertise)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const angle = (index / 4) * 360;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      style={{
        position: "relative",
        padding: "32px 28px",
        background: C.bgCard,
        border: `1px solid ${C.border}`,
        borderRadius: 4,
        overflow: "hidden",
      }}
    >
      {/* Jewel accent top-left */}
      <div style={{ position: "absolute", top: 16, left: 16 }} className="cw-jewel-pulse">
        <JewelBearingSVG size={20} glow />
      </div>

      {/* Radial line decoration */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 300 200"
        style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.06 }}
        preserveAspectRatio="none"
      >
        {Array.from({ length: 12 }, (_, i) => {
          const a = ((i + angle / 30) * 30 * Math.PI) / 180;
          return (
            <line
              key={i}
              x1="150"
              y1="100"
              x2={150 + 200 * Math.cos(a)}
              y2={100 + 200 * Math.sin(a)}
              stroke={C.brass}
              strokeWidth="0.5"
            />
          );
        })}
      </svg>

      {/* Index marker */}
      <div
        style={{
          fontFamily: "var(--font-jetbrains)",
          fontSize: 10,
          color: C.ruby,
          letterSpacing: "0.15em",
          marginBottom: 16,
          paddingLeft: 28,
          textTransform: "uppercase",
        }}
      >
        Jewel {String(index + 1).padStart(2, "0")}
      </div>

      <h3
        style={{
          fontFamily: "var(--font-dm-serif)",
          fontSize: 20,
          color: C.ivory,
          marginBottom: 12,
          lineHeight: 1.3,
        }}
      >
        {item.title}
      </h3>

      <p
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: 14,
          lineHeight: 1.65,
          color: C.text,
          opacity: 0.8,
        }}
      >
        {item.body}
      </p>

      {/* Bottom brass accent */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(to right, transparent, ${C.brass}, transparent)`,
          opacity: 0.4,
        }}
      />
    </motion.div>
  );
}

/* ─── Watch Movement Component Names ─── */
const MOVEMENT_PARTS = ["Mainspring", "Balance Wheel", "Escapement", "Gear Train", "Crown Wheel", "Barrel"];

/* ────────────────────────────────────────────────────── */
/* ─── MAIN PAGE COMPONENT ─── */
/* ────────────────────────────────────────────────────── */
export default function ClockworkPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  /* Gear rotations from scroll */
  const gearRot1 = useTransform(scrollYProgress, [0, 1], [0, 720]);
  const gearRot2 = useTransform(scrollYProgress, [0, 1], [0, -540]);
  const gearRot3 = useTransform(scrollYProgress, [0, 1], [0, 480]);
  const gearRot4 = useTransform(scrollYProgress, [0, 1], [0, -600]);
  const gearRot5 = useTransform(scrollYProgress, [0, 1], [0, 900]);

  /* Pendulum from scroll — slight offset */
  const pendulumRotate = useTransform(scrollYProgress, [0, 0.5, 1], [-15, 15, -15]);

  /* Hero section refs */
  const heroRef = useRef<HTMLElement>(null);
  const heroInView = useInView(heroRef, { once: true });

  /* Projects section ref */
  const projectsRef = useRef<HTMLElement>(null);
  const projectsInView = useInView(projectsRef, { once: true, margin: "-80px" });

  /* Tools section ref */
  const toolsRef = useRef<HTMLElement>(null);
  const toolsInView = useInView(toolsRef, { once: true, margin: "-60px" });

  /* Footer ref */
  const footerRef = useRef<HTMLElement>(null);
  const footerInView = useInView(footerRef, { once: true });

  /* Time state for watch hands */
  const [time, setTime] = useState({ h: 10, m: 10, s: 0 });
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime({ h: d.getHours() % 12, m: d.getMinutes(), s: d.getSeconds() });
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);

  const hourAngle = (time.h + time.m / 60) * 30;
  const minuteAngle = (time.m + time.s / 60) * 6;
  const secondAngle = time.s * 6;

  return (
    <>
      {/* ─── Global Styles & Keyframes ─── */}
      <style>{`
        @keyframes cw-pendulum-swing {
          0%, 100% { transform: rotate(-18deg); }
          50% { transform: rotate(18deg); }
        }
        @keyframes cw-second-tick {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes cw-jewel-sparkle {
          0%, 100% { opacity: 0.7; filter: brightness(1); }
          50% { opacity: 1; filter: brightness(1.5); }
        }
        @keyframes cw-gear-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes cw-gear-slow-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes cw-pulse-ring {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes cw-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        .cw-pendulum {
          transform-origin: 20px 0px;
          animation: cw-pendulum-swing 3s ease-in-out infinite;
        }
        .cw-second-hand {
          transform-origin: 100px 100px;
          animation: cw-second-tick 60s linear infinite;
        }
        .cw-hour-hand {
          transform-origin: 100px 100px;
        }
        .cw-minute-hand {
          transform-origin: 100px 100px;
        }
        .cw-jewel-pulse {
          animation: cw-jewel-sparkle 3s ease-in-out infinite;
        }
        .cw-gear-spin {
          animation: cw-gear-slow 30s linear infinite;
        }
        .cw-gear-spin-reverse {
          animation: cw-gear-slow-reverse 25s linear infinite;
        }
        .cw-pulse-ring-anim {
          animation: cw-pulse-ring 2s ease-out infinite;
        }
        .cw-float {
          animation: cw-float 6s ease-in-out infinite;
        }

        /* Scrollbar */
        .cw-page::-webkit-scrollbar { width: 6px; }
        .cw-page::-webkit-scrollbar-track { background: ${C.bg}; }
        .cw-page::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
        .cw-page::-webkit-scrollbar-thumb:hover { background: ${C.brass}; }

        /* Selection */
        .cw-page ::selection {
          background: ${C.brass};
          color: ${C.bg};
        }
      `}</style>

      <div
        ref={containerRef}
        className="cw-page"
        style={{
          background: C.bg,
          color: C.text,
          minHeight: "100vh",
          position: "relative",
          overflowX: "hidden",
        }}
      >
        <NoiseOverlay />

        {/* ─── FIXED BACKGROUND GEARS ─── */}
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
          {/* Large gear — top right */}
          <motion.div
            style={{
              position: "absolute",
              top: -80,
              right: -100,
              rotate: gearRot1,
            }}
          >
            <svg width="400" height="400" viewBox="0 0 400 400" fill="none" opacity="0.04">
              <GearSVG cx={200} cy={200} outerR={160} innerR={60} teeth={32} toothDepth={18} stroke={C.brass} strokeWidth={2} />
            </svg>
          </motion.div>

          {/* Medium gear — left center */}
          <motion.div
            style={{
              position: "absolute",
              top: "40%",
              left: -60,
              rotate: gearRot2,
            }}
          >
            <svg width="280" height="280" viewBox="0 0 280 280" fill="none" opacity="0.035">
              <GearSVG cx={140} cy={140} outerR={110} innerR={45} teeth={24} toothDepth={14} stroke={C.brass} strokeWidth={1.5} />
            </svg>
          </motion.div>

          {/* Small gear — bottom right */}
          <motion.div
            style={{
              position: "absolute",
              bottom: "20%",
              right: -40,
              rotate: gearRot3,
            }}
          >
            <svg width="200" height="200" viewBox="0 0 200 200" fill="none" opacity="0.04">
              <GearSVG cx={100} cy={100} outerR={75} innerR={30} teeth={18} toothDepth={10} stroke={C.copper} strokeWidth={1.5} />
            </svg>
          </motion.div>

          {/* Tiny gear — top left */}
          <motion.div
            style={{
              position: "absolute",
              top: "25%",
              left: "15%",
              rotate: gearRot4,
            }}
          >
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" opacity="0.03">
              <GearSVG cx={60} cy={60} outerR={45} innerR={18} teeth={14} toothDepth={8} stroke={C.steel} strokeWidth={1} />
            </svg>
          </motion.div>

          {/* Another gear — bottom left */}
          <motion.div
            style={{
              position: "absolute",
              bottom: "5%",
              left: "25%",
              rotate: gearRot5,
            }}
          >
            <svg width="160" height="160" viewBox="0 0 160 160" fill="none" opacity="0.03">
              <GearSVG cx={80} cy={80} outerR={60} innerR={24} teeth={20} toothDepth={9} stroke={C.brass} strokeWidth={1} />
            </svg>
          </motion.div>
        </div>

        {/* ════════════════════════════════════════════════════ */}
        {/* ─── HERO SECTION ─── */}
        {/* ════════════════════════════════════════════════════ */}
        <section
          ref={heroRef}
          style={{
            position: "relative",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 24px",
            zIndex: 2,
            overflow: "hidden",
          }}
        >
          {/* Roman Numeral Chapter Ring */}
          <div
            style={{
              position: "absolute",
              width: 520,
              height: 520,
              borderRadius: "50%",
              border: `2px solid ${C.borderBright}`,
            }}
          >
            {/* Inner ring */}
            <div
              style={{
                position: "absolute",
                inset: 20,
                borderRadius: "50%",
                border: `1px solid ${C.border}`,
              }}
            />
            {/* Minute marks */}
            {Array.from({ length: 60 }, (_, i) => {
              const angle = (i / 60) * 360;
              const isHour = i % 5 === 0;
              const rad = (angle * Math.PI) / 180;
              const outerR = 258;
              const innerR = isHour ? 240 : 248;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: isHour ? 2 : 1,
                    height: outerR - innerR,
                    background: isHour ? C.brass : C.steelMuted,
                    transformOrigin: "center top",
                    transform: `translate(-50%, 0) rotate(${angle}deg) translateY(-${outerR}px)`,
                  }}
                />
              );
            })}
            {/* Roman numerals */}
            {ROMAN.map((numeral, i) => {
              const angle = (i / 12) * 360 - 90;
              const rad = ((angle + 90) * Math.PI) / 180;
              const r = 220;
              return (
                <motion.div
                  key={numeral}
                  initial={{ opacity: 0 }}
                  animate={heroInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: `translate(-50%, -50%) translate(${r * Math.cos(rad)}px, ${r * Math.sin(rad)}px)`,
                    fontFamily: "var(--font-dm-serif)",
                    fontSize: i === 0 ? 24 : 18,
                    color: i === 0 ? C.brass : C.ivoryMuted,
                    letterSpacing: "0.05em",
                  }}
                >
                  {numeral}
                </motion.div>
              );
            })}
          </div>

          {/* Watch Hands — Real Time */}
          <div
            style={{
              position: "absolute",
              width: 200,
              height: 200,
            }}
          >
            <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
              {/* Hour hand */}
              <line
                x1="100" y1="100"
                x2={100 + 55 * Math.sin((hourAngle * Math.PI) / 180)}
                y2={100 - 55 * Math.cos((hourAngle * Math.PI) / 180)}
                stroke={C.brass}
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Minute hand */}
              <line
                x1="100" y1="100"
                x2={100 + 72 * Math.sin((minuteAngle * Math.PI) / 180)}
                y2={100 - 72 * Math.cos((minuteAngle * Math.PI) / 180)}
                stroke={C.steel}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Second hand */}
              <line
                x1={100 - 15 * Math.sin((secondAngle * Math.PI) / 180)}
                y1={100 + 15 * Math.cos((secondAngle * Math.PI) / 180)}
                x2={100 + 78 * Math.sin((secondAngle * Math.PI) / 180)}
                y2={100 - 78 * Math.cos((secondAngle * Math.PI) / 180)}
                stroke={C.ruby}
                strokeWidth="1"
                strokeLinecap="round"
              />
              <circle cx="100" cy="100" r="5" fill={C.brass} />
              <circle cx="100" cy="100" r="3" fill={C.ruby} />
            </svg>
          </div>

          {/* Dial Face — Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={heroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
            style={{
              position: "relative",
              zIndex: 3,
              textAlign: "center",
              marginTop: 300,
            }}
          >
            {/* Icon */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              style={{
                fontSize: 32,
                marginBottom: 16,
              }}
            >
              ⚙
            </motion.div>

            {/* CLOCKWORK title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
              style={{
                fontFamily: "var(--font-dm-serif)",
                fontSize: "clamp(48px, 8vw, 84px)",
                color: C.ivory,
                letterSpacing: "0.15em",
                lineHeight: 1.1,
                marginBottom: 8,
                textShadow: `0 0 60px rgba(212,168,68,0.15)`,
              }}
            >
              CLOCKWORK
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={heroInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7 }}
              style={{
                fontFamily: "var(--font-space-grotesk)",
                fontSize: 14,
                color: C.brass,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                marginBottom: 40,
              }}
            >
              Swiss Precision Engineering
            </motion.p>

            {/* Stats as precision measurements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.9 }}
              style={{
                display: "flex",
                gap: 48,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {stats.map((stat, i) => (
                <div key={stat.label} style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-jetbrains)",
                      fontSize: 32,
                      color: C.brass,
                      fontWeight: 600,
                      lineHeight: 1,
                      marginBottom: 6,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-space-grotesk)",
                      fontSize: 11,
                      color: C.steelMuted,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                    }}
                  >
                    {stat.label}
                  </div>
                  {/* Precision marker dot */}
                  <div
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: "50%",
                      background: C.ruby,
                      margin: "8px auto 0",
                    }}
                    className="cw-jewel-pulse"
                  />
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Pendulum at bottom of hero */}
          <motion.div
            style={{
              position: "absolute",
              bottom: 20,
              left: "50%",
              marginLeft: -20,
              rotate: pendulumRotate,
              transformOrigin: "top center",
              zIndex: 2,
            }}
          >
            <PendulumSVG />
          </motion.div>

          {/* Decorative interlocking gears — hero */}
          <motion.div
            className="cw-gear-spin"
            style={{
              position: "absolute",
              top: 80,
              right: "10%",
              opacity: 0.08,
            }}
          >
            <svg width="150" height="150" viewBox="0 0 150 150" fill="none">
              <GearSVG cx={75} cy={75} outerR={55} innerR={22} teeth={16} toothDepth={10} stroke={C.brass} strokeWidth={1.5} />
            </svg>
          </motion.div>

          <div
            className="cw-gear-spin-reverse"
            style={{
              position: "absolute",
              top: 145,
              right: "calc(10% + 100px)",
              opacity: 0.06,
            }}
          >
            <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
              <GearSVG cx={45} cy={45} outerR={32} innerR={14} teeth={12} toothDepth={7} stroke={C.copper} strokeWidth={1} />
            </svg>
          </div>

          <motion.div
            className="cw-gear-spin"
            style={{
              position: "absolute",
              bottom: 160,
              left: "8%",
              opacity: 0.06,
            }}
          >
            <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
              <GearSVG cx={90} cy={90} outerR={70} innerR={28} teeth={22} toothDepth={12} stroke={C.steel} strokeWidth={1.5} />
            </svg>
          </motion.div>
        </section>

        <GearDivider />

        {/* ════════════════════════════════════════════════════ */}
        {/* ─── PROJECTS SECTION ─── */}
        {/* ════════════════════════════════════════════════════ */}
        <section
          ref={projectsRef}
          style={{
            position: "relative",
            zIndex: 2,
            padding: "40px 24px 80px",
            maxWidth: 1000,
            margin: "0 auto",
          }}
        >
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={projectsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            style={{ textAlign: "center", marginBottom: 60 }}
          >
            <div
              style={{
                fontFamily: "var(--font-space-grotesk)",
                fontSize: 11,
                color: C.brassMuted,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Movement Complications
            </div>
            <h2
              style={{
                fontFamily: "var(--font-dm-serif)",
                fontSize: "clamp(32px, 5vw, 48px)",
                color: C.ivory,
                letterSpacing: "0.06em",
              }}
            >
              Caliber Works
            </h2>
            <div
              style={{
                width: 60,
                height: 2,
                background: C.brass,
                margin: "16px auto 0",
                borderRadius: 1,
              }}
            />
          </motion.div>

          {/* All 10 projects as gear cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 40, alignItems: "center" }}>
            {projects.map((project, i) => (
              <ProjectGear key={project.title} project={project} index={i} scrollProgress={scrollYProgress} />
            ))}
          </div>
        </section>

        <GearDivider />

        {/* ════════════════════════════════════════════════════ */}
        {/* ─── EXPERTISE SECTION — Jeweled Bearings ─── */}
        {/* ════════════════════════════════════════════════════ */}
        <section
          style={{
            position: "relative",
            zIndex: 2,
            padding: "40px 24px 80px",
            maxWidth: 1000,
            margin: "0 auto",
          }}
        >
          {/* Central shaft decoration */}
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div
              style={{
                fontFamily: "var(--font-space-grotesk)",
                fontSize: 11,
                color: C.ruby,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Jeweled Bearings
            </div>
            <h2
              style={{
                fontFamily: "var(--font-dm-serif)",
                fontSize: "clamp(32px, 5vw, 48px)",
                color: C.ivory,
                letterSpacing: "0.06em",
              }}
            >
              Expertise
            </h2>

            {/* Central shaft SVG */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
              <svg width="200" height="40" viewBox="0 0 200 40" fill="none">
                <line x1="0" y1="20" x2="80" y2="20" stroke={C.border} strokeWidth="1" />
                <circle cx="100" cy="20" r="8" fill="none" stroke={C.brass} strokeWidth="1.5" />
                <circle cx="100" cy="20" r="4" fill={C.ruby} />
                <line x1="120" y1="20" x2="200" y2="20" stroke={C.border} strokeWidth="1" />
              </svg>
            </div>
          </div>

          {/* Four jeweled bearings grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
            }}
          >
            {expertise.map((item, i) => (
              <ExpertiseJewel key={item.title} item={item} index={i} />
            ))}
          </div>
        </section>

        <GearDivider />

        {/* ════════════════════════════════════════════════════ */}
        {/* ─── TOOLS SECTION — The Escapement Mechanism ─── */}
        {/* ════════════════════════════════════════════════════ */}
        <section
          ref={toolsRef}
          style={{
            position: "relative",
            zIndex: 2,
            padding: "40px 24px 80px",
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={toolsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            style={{ textAlign: "center", marginBottom: 48 }}
          >
            <div
              style={{
                fontFamily: "var(--font-space-grotesk)",
                fontSize: 11,
                color: C.copper,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Escapement Mechanism
            </div>
            <h2
              style={{
                fontFamily: "var(--font-dm-serif)",
                fontSize: "clamp(32px, 5vw, 48px)",
                color: C.ivory,
                letterSpacing: "0.06em",
              }}
            >
              Toolkit
            </h2>
            <div
              style={{
                width: 60,
                height: 2,
                background: C.copper,
                margin: "16px auto 0",
                borderRadius: 1,
              }}
            />
          </motion.div>

          {/* 6 Tool categories as movement components */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 24,
            }}
          >
            {tools.map((category, catIdx) => {
              const partName = MOVEMENT_PARTS[catIdx] || "Component";
              return (
                <ToolCategory key={category.label} category={category} index={catIdx} partName={partName} isInView={toolsInView} />
              );
            })}
          </div>
        </section>

        <GearDivider />

        {/* ════════════════════════════════════════════════════ */}
        {/* ─── FOOTER ─── */}
        {/* ════════════════════════════════════════════════════ */}
        <footer
          ref={footerRef}
          style={{
            position: "relative",
            zIndex: 2,
            padding: "60px 24px 100px",
            textAlign: "center",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={footerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            {/* Swiss cross */}
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ margin: "0 auto 20px" }}>
              <rect x="0" y="0" width="32" height="32" rx="2" fill={C.ruby} />
              <rect x="8" y="13" width="16" height="6" rx="0.5" fill="white" />
              <rect x="13" y="8" width="6" height="16" rx="0.5" fill="white" />
            </svg>

            {/* PRECISION CRAFTED */}
            <h3
              style={{
                fontFamily: "var(--font-dm-serif)",
                fontSize: 28,
                color: C.ivory,
                letterSpacing: "0.2em",
                marginBottom: 12,
              }}
            >
              PRECISION CRAFTED
            </h3>

            {/* Caliber designation */}
            <div
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: 12,
                color: C.brass,
                letterSpacing: "0.2em",
                marginBottom: 8,
              }}
            >
              Caliber GROX-2025
            </div>

            {/* Serial number */}
            <div
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: 11,
                color: C.textMuted,
                letterSpacing: "0.15em",
                marginBottom: 24,
              }}
            >
              S/N {Math.floor(Date.now() / 86400000).toString(16).toUpperCase()}
            </div>

            {/* Decorative footer line with gears */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 80, height: 1, background: C.border }} />
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <GearSVG cx={10} cy={10} outerR={7} innerR={3} teeth={8} toothDepth={2} stroke={C.brassMuted} strokeWidth={0.8} />
              </svg>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <GearSVG cx={7} cy={7} outerR={5} innerR={2} teeth={6} toothDepth={1.5} stroke={C.steelMuted} strokeWidth={0.6} />
              </svg>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <GearSVG cx={10} cy={10} outerR={7} innerR={3} teeth={8} toothDepth={2} stroke={C.brassMuted} strokeWidth={0.8} />
              </svg>
              <div style={{ width: 80, height: 1, background: C.border }} />
            </div>

            {/* Mainspring decoration */}
            <div style={{ display: "flex", justifyContent: "center", opacity: 0.3, marginBottom: 24 }}>
              <MainspringSVG size={80} />
            </div>

            {/* Jewel count */}
            <div
              style={{
                fontFamily: "var(--font-space-grotesk)",
                fontSize: 11,
                color: C.steelMuted,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              21 Jewels &middot; Automatic &middot; Swiss Made
            </div>

            {/* Watch crown decoration */}
            <svg width="24" height="40" viewBox="0 0 24 40" fill="none" style={{ margin: "20px auto 0" }}>
              <rect x="6" y="0" width="12" height="20" rx="3" fill="none" stroke={C.border} strokeWidth="1" />
              <line x1="6" y1="4" x2="18" y2="4" stroke={C.border} strokeWidth="0.5" />
              <line x1="6" y1="8" x2="18" y2="8" stroke={C.border} strokeWidth="0.5" />
              <line x1="6" y1="12" x2="18" y2="12" stroke={C.border} strokeWidth="0.5" />
              <line x1="6" y1="16" x2="18" y2="16" stroke={C.border} strokeWidth="0.5" />
              <rect x="4" y="20" width="16" height="4" rx="1" fill="none" stroke={C.border} strokeWidth="1" />
              <line x1="12" y1="24" x2="12" y2="40" stroke={C.border} strokeWidth="1" />
            </svg>
          </motion.div>
        </footer>

        {/* ─── Theme Switcher ─── */}
        <ThemeSwitcher current="/clockwork" variant="dark" />
      </div>
    </>
  );
}

/* ─── Tool Category Component ─── */
function ToolCategory({
  category,
  index,
  partName,
  isInView,
}: {
  category: (typeof tools)[number];
  index: number;
  partName: string;
  isInView: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const localInView = useInView(ref, { once: true, margin: "-40px" });

  /* SVG decoration per tool category */
  const decorations: Record<number, React.ReactNode> = {
    0: <MainspringSVG size={48} />,
    1: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <GearSVG cx={24} cy={24} outerR={18} innerR={8} teeth={10} toothDepth={4} stroke={C.brass} strokeWidth={1} />
      </svg>
    ),
    2: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="16" fill="none" stroke={C.copper} strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="24" cy="24" r="8" fill="none" stroke={C.copper} strokeWidth="1.5" />
        <circle cx="24" cy="24" r="3" fill={C.copper} />
      </svg>
    ),
    3: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <JewelBearingSVG size={48} glow />
      </svg>
    ),
    4: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect x="8" y="12" width="32" height="24" rx="4" fill="none" stroke={C.steel} strokeWidth="1" />
        <line x1="14" y1="20" x2="34" y2="20" stroke={C.steelMuted} strokeWidth="0.5" />
        <line x1="14" y1="24" x2="34" y2="24" stroke={C.steelMuted} strokeWidth="0.5" />
        <line x1="14" y1="28" x2="34" y2="28" stroke={C.steelMuted} strokeWidth="0.5" />
      </svg>
    ),
    5: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <polygon points="24,6 42,18 42,34 24,42 6,34 6,18" fill="none" stroke={C.brass} strokeWidth="1" />
        <polygon points="24,14 34,20 34,30 24,36 14,30 14,20" fill="none" stroke={C.brassMuted} strokeWidth="0.8" />
      </svg>
    ),
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={localInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{
        background: C.bgCard,
        border: `1px solid ${C.border}`,
        borderRadius: 4,
        padding: "28px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Movement part label */}
      <div
        style={{
          position: "absolute",
          top: 12,
          right: 14,
          fontFamily: "var(--font-jetbrains)",
          fontSize: 10,
          color: C.steelMuted,
          letterSpacing: "0.1em",
        }}
      >
        {partName}
      </div>

      {/* Decoration + Label row */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
        <div style={{ flexShrink: 0, opacity: 0.7 }}>{decorations[index]}</div>
        <div>
          <h3
            style={{
              fontFamily: "var(--font-space-grotesk)",
              fontSize: 18,
              color: C.brass,
              letterSpacing: "0.05em",
              fontWeight: 500,
            }}
          >
            {category.label}
          </h3>
          <div
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: 10,
              color: C.textMuted,
              letterSpacing: "0.08em",
              marginTop: 2,
            }}
          >
            {category.items.length} COMPONENTS
          </div>
        </div>
      </div>

      {/* Tool items */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {category.items.map((item) => (
          <span
            key={item}
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: 13,
              padding: "6px 14px",
              background: C.brassLight,
              border: `1px solid ${C.border}`,
              borderRadius: 2,
              color: C.text,
              letterSpacing: "0.02em",
            }}
          >
            {item}
          </span>
        ))}
      </div>

      {/* Subtle bottom accent */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "20%",
          right: "20%",
          height: 1,
          background: `linear-gradient(to right, transparent, ${C.brass}40, transparent)`,
        }}
      />
    </motion.div>
  );
}
