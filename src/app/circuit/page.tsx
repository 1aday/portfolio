"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";

/* ─── Color Palette ─── */
const C = {
  bg: "#0A3622",
  bgLight: "rgba(10,54,34,0.95)",
  copper: "#D4883A",
  copperMuted: "rgba(212,136,58,0.6)",
  copperLight: "rgba(212,136,58,0.15)",
  silver: "#C0C0C0",
  silkscreen: "#E8E8E8",
  viaGold: "#FFD700",
  text: "#E8E8E8",
  textMuted: "rgba(232,232,232,0.5)",
  cardBg: "rgba(212,136,58,0.08)",
  border: "rgba(212,136,58,0.25)",
  shadow1: "rgba(0,0,0,0.2)",
  shadow2: "rgba(0,0,0,0.35)",
};

/* ─── PCB Texture Overlay ─── */
function PcbTexture() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      {/* Noise grain */}
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.04 }}>
        <filter id="pcb-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#pcb-noise)" />
      </svg>
      {/* Grid pattern */}
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.06 }}>
        <defs>
          <pattern id="pcb-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="12" cy="12" r="0.5" fill={C.copper} />
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke={C.copper} strokeWidth="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pcb-grid)" />
      </svg>
    </div>
  );
}

/* ─── SVG Copper Traces (Hero decoration) ─── */
function CopperTraces() {
  return (
    <svg
      viewBox="0 0 1200 700"
      fill="none"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 2,
        pointerEvents: "none",
      }}
    >
      {/* Trace 1 — top left routing */}
      <motion.path
        d="M 0 120 H 200 Q 220 120 220 140 V 300 Q 220 320 240 320 H 500"
        stroke={C.copper}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.5 }}
        transition={{ duration: 2.5, ease: "easeInOut", delay: 0.3 }}
      />
      {/* Trace 2 — bottom right routing */}
      <motion.path
        d="M 1200 580 H 900 Q 880 580 880 560 V 420 Q 880 400 860 400 H 650"
        stroke={C.copper}
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.4 }}
        transition={{ duration: 2.8, ease: "easeInOut", delay: 0.6 }}
      />
      {/* Trace 3 — diagonal bus */}
      <motion.path
        d="M 100 650 H 300 Q 320 650 320 630 V 500 Q 320 480 340 480 H 580 Q 600 480 600 460 V 350"
        stroke={C.copper}
        strokeWidth="1.8"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.35 }}
        transition={{ duration: 3, ease: "easeInOut", delay: 0.9 }}
      />
      {/* Trace 4 — top right signal */}
      <motion.path
        d="M 1200 80 H 1000 Q 980 80 980 100 V 220 Q 980 240 960 240 H 750"
        stroke={C.copperMuted}
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.3 }}
        transition={{ duration: 2.2, ease: "easeInOut", delay: 1.2 }}
      />
      {/* Trace 5 — center ground plane */}
      <motion.path
        d="M 400 0 V 80 Q 400 100 420 100 H 700 Q 720 100 720 120 V 250"
        stroke={C.copper}
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.25 }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
      />
      {/* Trace 6 — power rail */}
      <motion.path
        d="M 0 400 H 150 Q 170 400 170 380 V 200 Q 170 180 190 180 H 400"
        stroke={C.copperMuted}
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.3 }}
        transition={{ duration: 2.6, ease: "easeInOut", delay: 1 }}
      />

      {/* Solder pads at endpoints */}
      {[
        [500, 320], [650, 400], [580, 480], [750, 240], [720, 250], [400, 180],
        [220, 140], [880, 560], [320, 630], [600, 350], [980, 100],
      ].map(([cx, cy], i) => (
        <motion.g
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.5 + i * 0.1, duration: 0.4 }}
        >
          <circle cx={cx} cy={cy} r="8" fill="none" stroke={C.copper} strokeWidth="1.5" opacity={0.5} />
          <circle cx={cx} cy={cy} r="4" fill={C.copper} opacity={0.6} />
          <circle cx={cx} cy={cy} r="1.5" fill={C.viaGold} opacity={0.8} />
        </motion.g>
      ))}

      {/* Through-hole vias scattered */}
      {[
        [150, 250], [350, 150], [850, 300], [700, 550], [1050, 450],
        [250, 500], [550, 200], [950, 150], [450, 600], [1100, 250],
      ].map(([cx, cy], i) => (
        <motion.g
          key={`via-${i}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 2 + i * 0.08, duration: 0.3 }}
        >
          <circle cx={cx} cy={cy} r="5" fill="none" stroke={C.copperMuted} strokeWidth="1" opacity={0.3} />
          <circle cx={cx} cy={cy} r="2" fill={C.viaGold} opacity={0.4} />
        </motion.g>
      ))}
    </svg>
  );
}

/* ─── Through-Hole Via Component ─── */
function Via({ size = 12, style }: { size?: number; style?: React.CSSProperties }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: "50%",
        border: `1.5px solid ${C.copper}`,
        position: "relative",
        ...style,
      }}
    >
      <span
        style={{
          width: size * 0.5,
          height: size * 0.5,
          borderRadius: "50%",
          background: C.viaGold,
          boxShadow: `0 0 4px ${C.viaGold}`,
        }}
      />
    </span>
  );
}

/* ─── Component Designator Label ─── */
function Designator({
  label,
  style,
}: {
  label: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      style={{
        fontFamily: "var(--font-jetbrains)",
        fontSize: 10,
        letterSpacing: "0.08em",
        color: C.silkscreen,
        opacity: 0.45,
        textTransform: "uppercase",
        position: "absolute",
        userSelect: "none",
        ...style,
      }}
    >
      {label}
    </span>
  );
}

/* ─── Copper Trace Divider ─── */
function TraceDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
        padding: "48px 0",
        position: "relative",
        zIndex: 5,
      }}
    >
      {/* Left solder pad */}
      <motion.div
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Via size={16} />
      </motion.div>

      {/* Copper trace line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        style={{
          height: 2,
          width: "min(80%, 600px)",
          background: `linear-gradient(90deg, ${C.copper}, ${C.copperMuted}, ${C.copper})`,
          transformOrigin: "left center",
          borderRadius: 1,
        }}
      />

      {/* Right solder pad */}
      <motion.div
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <Via size={16} />
      </motion.div>
    </div>
  );
}

/* ─── Section Header ─── */
function SectionHeader({
  title,
  subtitle,
  designator,
}: {
  title: string;
  subtitle: string;
  designator: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7 }}
      style={{
        textAlign: "center",
        marginBottom: 56,
        position: "relative",
      }}
    >
      {/* Designator badge */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.3 }}
        style={{
          fontFamily: "var(--font-jetbrains)",
          fontSize: 11,
          color: C.copper,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 16,
          border: `1px solid ${C.border}`,
          padding: "4px 14px",
          borderRadius: 2,
          background: C.copperLight,
        }}
      >
        <Via size={8} />
        {designator}
      </motion.span>

      <h2
        style={{
          fontFamily: "var(--font-space-grotesk)",
          fontSize: "clamp(28px, 4vw, 44px)",
          fontWeight: 700,
          color: C.silkscreen,
          letterSpacing: "-0.02em",
          lineHeight: 1.15,
          margin: "12px 0 0",
        }}
      >
        {title}
      </h2>
      <p
        style={{
          fontFamily: "var(--font-jetbrains)",
          fontSize: 14,
          color: C.textMuted,
          marginTop: 12,
          letterSpacing: "0.02em",
        }}
      >
        {subtitle}
      </p>
    </motion.div>
  );
}

/* ─── Scroll-Reveal Wrapper ─── */
function Reveal({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: "easeOut" }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   NAVIGATION
   ═══════════════════════════════════════════════════ */
function Navigation() {
  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: C.bgLight,
        backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${C.border}`,
        padding: "0 24px",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 60,
        }}
      >
        {/* Logo */}
        <a
          href="#"
          style={{
            fontFamily: "var(--font-space-grotesk)",
            fontSize: 22,
            fontWeight: 800,
            color: C.silkscreen,
            textDecoration: "none",
            letterSpacing: "0.06em",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          GROX
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: C.copper,
              display: "inline-block",
              marginLeft: 1,
              boxShadow: `0 0 8px ${C.copper}`,
            }}
          />
        </a>

        {/* Nav links */}
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {[
            { label: "Projects", href: "#projects" },
            { label: "Expertise", href: "#expertise" },
            { label: "Tools", href: "#tools" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: 13,
                color: C.copper,
                textDecoration: "none",
                letterSpacing: "0.04em",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.viaGold)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.copper)}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}

/* ═══════════════════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════════════════ */
function HeroSection() {
  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        padding: "120px 24px 80px",
      }}
    >
      <CopperTraces />

      {/* Silkscreen corner marks */}
      <Designator label="REV 2.4" style={{ top: 90, left: 32, zIndex: 5 }} />
      <Designator label="PCB-001" style={{ top: 90, right: 32, zIndex: 5 }} />
      <Designator label="LAYER: TOP COPPER" style={{ bottom: 24, left: 32, zIndex: 5 }} />
      <Designator label="SCALE: 1:1" style={{ bottom: 24, right: 32, zIndex: 5 }} />

      {/* Fiducial marks */}
      {[
        { top: 100, left: 28 },
        { top: 100, right: 28 },
        { bottom: 20, left: 28 },
        { bottom: 20, right: 28 },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            ...pos,
            zIndex: 5,
            width: 20,
            height: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              border: `1px solid ${C.copperMuted}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.copper, opacity: 0.5 }} />
          </div>
        </div>
      ))}

      {/* Hero content */}
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: 820 }}>
        {/* Chip designator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            fontFamily: "var(--font-jetbrains)",
            fontSize: 12,
            color: C.copper,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: 20,
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Via size={10} />
          <span>IC-PORTFOLIO // MAIN CONTROLLER</span>
          <Via size={10} />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{
            fontFamily: "var(--font-space-grotesk)",
            fontSize: "clamp(36px, 6vw, 72px)",
            fontWeight: 800,
            color: C.silkscreen,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          Engineered circuits
          <br />
          <span style={{ color: C.copper }}>of intelligence</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          style={{
            fontFamily: "var(--font-jetbrains)",
            fontSize: "clamp(14px, 1.6vw, 17px)",
            color: C.textMuted,
            maxWidth: 560,
            margin: "24px auto 0",
            lineHeight: 1.7,
            letterSpacing: "0.01em",
          }}
        >
          Routing signals between design and technology.
          <br />
          Every trace placed with precision, every connection tested.
        </motion.p>

        {/* Stats as chip packages */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.2 }}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 20,
            marginTop: 52,
            flexWrap: "wrap",
          }}
        >
          {stats.map((stat: { value: string; label: string }, i: number) => (
            <motion.div
              key={i}
              whileHover={{
                boxShadow: `0 0 20px ${C.copperMuted}`,
                borderColor: C.copper,
              }}
              style={{
                position: "relative",
                background: C.cardBg,
                border: `1px solid ${C.border}`,
                padding: "20px 28px",
                minWidth: 140,
                textAlign: "center",
                // IC chip notch at top
                clipPath:
                  "polygon(0 0, calc(50% - 8px) 0, calc(50% - 6px) 4px, calc(50% + 6px) 4px, calc(50% + 8px) 0, 100% 0, 100% 100%, 0 100%)",
              }}
            >
              {/* Pin marks along sides */}
              {[0, 1, 2].map((p) => (
                <span
                  key={`l-${p}`}
                  style={{
                    position: "absolute",
                    left: -3,
                    top: `${25 + p * 25}%`,
                    width: 6,
                    height: 2,
                    background: C.copper,
                    opacity: 0.4,
                  }}
                />
              ))}
              {[0, 1, 2].map((p) => (
                <span
                  key={`r-${p}`}
                  style={{
                    position: "absolute",
                    right: -3,
                    top: `${25 + p * 25}%`,
                    width: 6,
                    height: 2,
                    background: C.copper,
                    opacity: 0.4,
                  }}
                />
              ))}

              <Designator
                label={`U${i + 1}`}
                style={{ top: -14, left: 4, position: "absolute" }}
              />

              <div
                style={{
                  fontFamily: "var(--font-space-grotesk)",
                  fontSize: 28,
                  fontWeight: 800,
                  color: C.copper,
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  fontSize: 11,
                  color: C.textMuted,
                  marginTop: 6,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-jetbrains)",
            fontSize: 10,
            color: C.textMuted,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          SCROLL
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: 1.5, height: 20, background: C.copperMuted, borderRadius: 1 }}
        />
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   PROJECT CARD (IC Package)
   ═══════════════════════════════════════════════════ */
function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const pinCount = 6;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      whileHover={{
        boxShadow: `0 0 30px ${C.shadow2}, 0 0 60px rgba(212,136,58,0.1)`,
        borderColor: C.copper,
      }}
      style={{
        position: "relative",
        background: C.cardBg,
        border: `1px solid ${C.border}`,
        padding: "32px 28px 28px",
        // IC chip notch
        clipPath:
          "polygon(0 0, calc(50% - 10px) 0, calc(50% - 7px) 6px, calc(50% + 7px) 6px, calc(50% + 10px) 0, 100% 0, 100% 100%, 0 100%)",
        transition: "border-color 0.3s, box-shadow 0.3s",
        overflow: "visible",
      }}
    >
      {/* Pin marks — left side */}
      {Array.from({ length: pinCount }).map((_, p) => (
        <span
          key={`lp-${p}`}
          style={{
            position: "absolute",
            left: -4,
            top: `${(100 / (pinCount + 1)) * (p + 1)}%`,
            width: 8,
            height: 2,
            background: C.copper,
            opacity: 0.35,
            borderRadius: 1,
          }}
        />
      ))}
      {/* Pin marks — right side */}
      {Array.from({ length: pinCount }).map((_, p) => (
        <span
          key={`rp-${p}`}
          style={{
            position: "absolute",
            right: -4,
            top: `${(100 / (pinCount + 1)) * (p + 1)}%`,
            width: 8,
            height: 2,
            background: C.copper,
            opacity: 0.35,
            borderRadius: 1,
          }}
        />
      ))}
      {/* Bottom pins */}
      {Array.from({ length: 4 }).map((_, p) => (
        <span
          key={`bp-${p}`}
          style={{
            position: "absolute",
            bottom: -4,
            left: `${(100 / 5) * (p + 1)}%`,
            width: 2,
            height: 8,
            background: C.copper,
            opacity: 0.35,
            borderRadius: 1,
          }}
        />
      ))}

      {/* Component designator */}
      <Designator
        label={`IC${index + 1}`}
        style={{ top: 10, right: 12, position: "absolute", opacity: 0.35, fontSize: 9 }}
      />

      {/* Year badge as designator */}
      <div
        style={{
          fontFamily: "var(--font-jetbrains)",
          fontSize: 10,
          color: C.copper,
          border: `1px solid ${C.border}`,
          display: "inline-block",
          padding: "2px 8px",
          marginBottom: 14,
          letterSpacing: "0.1em",
          background: C.copperLight,
        }}
      >
        {project.year}
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: "var(--font-space-grotesk)",
          fontSize: 20,
          fontWeight: 700,
          color: C.silkscreen,
          margin: "0 0 8px",
          lineHeight: 1.3,
        }}
      >
        {project.title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontFamily: "var(--font-jetbrains)",
          fontSize: 13,
          color: C.textMuted,
          lineHeight: 1.65,
          margin: "0 0 18px",
        }}
      >
        {project.description}
      </p>

      {/* Tags as component values */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
        {project.tech.map((tag: string) => (
          <span
            key={tag}
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: 10,
              color: C.copper,
              border: `1px solid ${C.border}`,
              padding: "3px 8px",
              letterSpacing: "0.05em",
              background: C.copperLight,
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Pin 1 dot indicator (IC convention) */}
      <div
        style={{
          position: "absolute",
          bottom: 10,
          left: 10,
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: C.copper,
          opacity: 0.4,
        }}
      />

      {/* Via decoration */}
      <div style={{ position: "absolute", bottom: 8, right: 10 }}>
        <Via size={8} />
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   PROJECTS SECTION
   ═══════════════════════════════════════════════════ */
function ProjectsSection() {
  return (
    <section id="projects" style={{ padding: "80px 24px", position: "relative", zIndex: 5 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader
          title="Integrated Circuits"
          subtitle="// Each project routed with precision signal integrity"
          designator="SECTION U1 -- PROJECTS"
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: 28,
          }}
        >
          {projects.map(
            (project: (typeof projects)[number], i: number) => (
              <ProjectCard key={project.title} project={project} index={i} />
            )
          )}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   EXPERTISE SECTION — Component Datasheets
   ═══════════════════════════════════════════════════ */
function ExpertiseSection() {
  const designators = ["U1", "U2", "U3", "U4", "U5", "U6", "U7", "U8"];

  return (
    <section id="expertise" style={{ padding: "80px 24px", position: "relative", zIndex: 5 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader
          title="Component Datasheets"
          subtitle="// Technical specifications of core competencies"
          designator="SECTION U2 -- EXPERTISE"
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 24,
          }}
        >
          {expertise.map(
            (item: { title: string; body: string }, i: number) => (
              <Reveal key={item.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{
                    borderColor: C.copper,
                    boxShadow: `inset 0 0 30px ${C.copperLight}`,
                  }}
                  style={{
                    position: "relative",
                    background: C.cardBg,
                    border: `1px solid ${C.border}`,
                    padding: "28px 24px 24px",
                    transition: "border-color 0.3s, box-shadow 0.3s",
                  }}
                >
                  {/* Technical border — top double line */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 12,
                      right: 12,
                      height: 0,
                      borderTop: `1px dashed ${C.copperMuted}`,
                      opacity: 0.3,
                    }}
                  />

                  {/* Designator */}
                  <div
                    style={{
                      fontFamily: "var(--font-jetbrains)",
                      fontSize: 10,
                      color: C.copper,
                      opacity: 0.6,
                      marginBottom: 12,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Via size={7} />
                    <span>{designators[i] || `U${i + 1}`}</span>
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontFamily: "var(--font-space-grotesk)",
                      fontSize: 18,
                      fontWeight: 700,
                      color: C.silkscreen,
                      margin: "0 0 10px",
                      lineHeight: 1.3,
                    }}
                  >
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontFamily: "var(--font-jetbrains)",
                      fontSize: 12.5,
                      color: C.textMuted,
                      lineHeight: 1.65,
                      margin: 0,
                    }}
                  >
                    {item.body}
                  </p>

                  {/* Corner vias */}
                  <div style={{ position: "absolute", top: 6, right: 6 }}>
                    <Via size={6} />
                  </div>
                  <div style={{ position: "absolute", bottom: 6, left: 6 }}>
                    <Via size={6} />
                  </div>

                  {/* Pin marks top */}
                  {[0, 1, 2].map((p) => (
                    <span
                      key={`tp-${p}`}
                      style={{
                        position: "absolute",
                        top: -3,
                        left: `${25 + p * 25}%`,
                        width: 2,
                        height: 6,
                        background: C.copper,
                        opacity: 0.25,
                        borderRadius: 1,
                      }}
                    />
                  ))}
                  {/* Pin marks bottom */}
                  {[0, 1, 2].map((p) => (
                    <span
                      key={`btmp-${p}`}
                      style={{
                        position: "absolute",
                        bottom: -3,
                        left: `${25 + p * 25}%`,
                        width: 2,
                        height: 6,
                        background: C.copper,
                        opacity: 0.25,
                        borderRadius: 1,
                      }}
                    />
                  ))}
                </motion.div>
              </Reveal>
            )
          )}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   TOOLS SECTION — Bill of Materials
   ═══════════════════════════════════════════════════ */
function ToolsSection() {
  const bomCategories = ["R", "C", "L", "D", "Q", "U", "J", "SW"];

  return (
    <section id="tools" style={{ padding: "80px 24px", position: "relative", zIndex: 5 }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <SectionHeader
          title="Bill of Materials"
          subtitle="// Component inventory and tooling specifications"
          designator="SECTION U3 -- BOM"
        />

        {/* BOM Table Header */}
        <Reveal>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "60px 1fr 80px",
              gap: 0,
              borderBottom: `2px solid ${C.copper}`,
              paddingBottom: 10,
              marginBottom: 4,
            }}
          >
            {["REF", "COMPONENT", "QTY"].map((h) => (
              <span
                key={h}
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  fontSize: 10,
                  fontWeight: 700,
                  color: C.copper,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                {h}
              </span>
            ))}
          </div>
        </Reveal>

        {/* BOM Rows — grouped by category */}
        {tools.map((category, ci) => (
          <div key={category.label}>
            {/* Category header row */}
            <Reveal delay={ci * 0.08}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "60px 1fr 80px",
                  alignItems: "center",
                  padding: "14px 0 6px",
                  borderBottom: `1px solid ${C.copper}`,
                  marginTop: ci > 0 ? 16 : 0,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-jetbrains)",
                    fontSize: 10,
                    color: C.viaGold,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Via size={7} />
                  {bomCategories[ci % bomCategories.length]}{ci + 1}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    fontSize: 13,
                    color: C.copper,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {category.label}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-jetbrains)",
                    fontSize: 11,
                    color: C.textMuted,
                    textAlign: "right",
                  }}
                >
                  x{category.items.length}
                </span>
              </div>
            </Reveal>
            {/* Individual items */}
            {category.items.map((item, ii) => (
              <Reveal key={item} delay={ci * 0.08 + ii * 0.04}>
                <motion.div
                  whileHover={{
                    background: C.copperLight,
                    borderColor: C.copper,
                  }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "60px 1fr 80px",
                    alignItems: "center",
                    gap: 0,
                    padding: "10px 0",
                    borderBottom: `1px solid ${C.border}`,
                    transition: "background 0.2s, border-color 0.2s",
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-jetbrains)",
                      fontSize: 10,
                      color: C.textMuted,
                      paddingLeft: 20,
                    }}
                  >
                    {bomCategories[ci % bomCategories.length]}{ci + 1}.{ii + 1}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-space-grotesk)",
                      fontSize: 14,
                      color: C.silkscreen,
                      fontWeight: 500,
                    }}
                  >
                    {item}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-jetbrains)",
                      fontSize: 11,
                      color: C.textMuted,
                      textAlign: "right",
                    }}
                  >
                    x1
                  </span>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    style={{
                      position: "absolute",
                      left: 0,
                      bottom: 0,
                      width: "100%",
                      height: 1,
                      background: C.copper,
                      transformOrigin: "left center",
                    }}
                  />
                </motion.div>
              </Reveal>
            ))}
          </div>
        ))}

        {/* BOM summary */}
        <Reveal delay={0.3}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 20,
              padding: "14px 0",
              borderTop: `2px solid ${C.copper}`,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: 11,
                color: C.textMuted,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Total Components
            </span>
            <span
              style={{
                fontFamily: "var(--font-space-grotesk)",
                fontSize: 18,
                color: C.copper,
                fontWeight: 700,
              }}
            >
              {tools.length}
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer
      style={{
        position: "relative",
        zIndex: 5,
        padding: "60px 24px 40px",
        borderTop: `1px solid ${C.border}`,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Copper trace decoration */}
        <svg
          viewBox="0 0 800 20"
          fill="none"
          style={{ width: "100%", height: 20, marginBottom: 32, opacity: 0.35 }}
        >
          <path
            d="M 0 10 H 200 Q 210 10 210 5 H 300 Q 310 5 310 10 H 490 Q 500 10 500 15 H 600 Q 610 15 610 10 H 800"
            stroke={C.copper}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="200" cy="10" r="3" fill={C.viaGold} opacity={0.6} />
          <circle cx="500" cy="10" r="3" fill={C.viaGold} opacity={0.6} />
          <circle cx="310" cy="10" r="2.5" fill={C.copper} opacity={0.5} />
          <circle cx="610" cy="10" r="2.5" fill={C.copper} opacity={0.5} />
        </svg>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 24,
          }}
        >
          {/* Logo */}
          <div>
            <div
              style={{
                fontFamily: "var(--font-space-grotesk)",
                fontSize: 20,
                fontWeight: 800,
                color: C.silkscreen,
                letterSpacing: "0.06em",
                display: "flex",
                alignItems: "center",
                gap: 2,
                marginBottom: 8,
              }}
            >
              GROX
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: C.copper,
                  display: "inline-block",
                  boxShadow: `0 0 6px ${C.copper}`,
                }}
              />
            </div>
            <p
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: 11,
                color: C.textMuted,
                margin: 0,
                letterSpacing: "0.04em",
              }}
            >
              Designed, routed & soldered with precision.
            </p>
          </div>

          {/* Board markings */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 6,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: 10,
                color: C.textMuted,
                letterSpacing: "0.08em",
              }}
            >
              PCB REV 2.4 // {new Date().getFullYear()}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Designator label="RoHS" style={{ position: "relative", opacity: 0.35, fontSize: 9 }} />
              <Via size={8} />
              <Designator
                label="LEAD-FREE"
                style={{ position: "relative", opacity: 0.35, fontSize: 9 }}
              />
            </div>
          </div>
        </div>

        {/* Theme Switcher */}
        <div style={{ marginTop: 40, display: "flex", justifyContent: "center" }}>
          <ThemeSwitcher current="/circuit" variant="dark" />
        </div>

        {/* Bottom silkscreen */}
        <div
          style={{
            marginTop: 32,
            paddingTop: 20,
            borderTop: `1px solid ${C.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: 10,
              color: C.textMuted,
              letterSpacing: "0.08em",
            }}
          >
            SILKSCREEN LAYER // TOP
          </span>
          <span
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: 10,
              color: C.textMuted,
              letterSpacing: "0.08em",
            }}
          >
            FABRICATION DATE: {new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }).toUpperCase()}
          </span>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════ */
export default function CircuitPage() {
  return (
    <div
      style={{
        background: C.bg,
        minHeight: "100vh",
        color: C.text,
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <PcbTexture />
      <Navigation />
      <HeroSection />
      <TraceDivider />
      <ProjectsSection />
      <TraceDivider />
      <ExpertiseSection />
      <TraceDivider />
      <ToolsSection />
      <Footer />
    </div>
  );
}
