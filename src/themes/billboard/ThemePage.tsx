"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "@/app/data/projects";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";

/* ═══════════════════════════════════════════════════════════════════
   BILLBOARD THEME
   Outdoor advertising / wheat-paste poster aesthetic
   Massive typography on concrete walls, billboard frames, urban context
   ═══════════════════════════════════════════════════════════════════ */

/* ─── Colors ─── */
const C = {
  concrete: "#D3D0CB",
  concreteDark: "#C5C2BC",
  concreteLight: "#E0DDDA",
  yellow: "#FFEB3B",
  pink: "#FF1744",
  black: "#000000",
  white: "#FFFFFF",
  wheatPaste: "#B8A88A",
  metal: "#7A7A7A",
  metalDark: "#5A5A5A",
  metalLight: "#9A9A9A",
};

/* ─── SVG Concrete Noise Texture ─── */
function ConcreteTexture() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }}>
      <defs>
        <filter id="concrete-noise" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="4"
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix
            type="saturate"
            values="0"
            in="noise"
            result="grayNoise"
          />
          <feBlend
            mode="multiply"
            in="SourceGraphic"
            in2="grayNoise"
            result="blend"
          />
        </filter>
        <filter id="concrete-surface">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.45"
            numOctaves="6"
            stitchTiles="stitch"
            result="noise"
          />
          <feDiffuseLighting
            in="noise"
            lightingColor={C.concrete}
            surfaceScale="1.5"
            result="lit"
          >
            <feDistantLight azimuth="45" elevation="55" />
          </feDiffuseLighting>
          <feComposite
            operator="in"
            in="lit"
            in2="SourceGraphic"
            result="textured"
          />
        </filter>
      </defs>
    </svg>
  );
}

/* ─── Billboard Mounting Hardware (corner bolts) ─── */
function MountBolt({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const pos = {
    tl: { top: 8, left: 8 },
    tr: { top: 8, right: 8 },
    bl: { bottom: 8, left: 8 },
    br: { bottom: 8, right: 8 },
  }[position];

  return (
    <div
      style={{
        position: "absolute",
        ...pos,
        width: 14,
        height: 14,
        borderRadius: "50%",
        background: `radial-gradient(circle at 40% 35%, ${C.metalLight}, ${C.metalDark})`,
        boxShadow: `inset 0 1px 2px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.3)`,
        zIndex: 10,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 6,
          height: 1,
          background: C.metalDark,
          borderRadius: 1,
        }}
      />
    </div>
  );
}

/* ─── Billboard Spotlight ─── */
function Spotlight({ hovering = false }: { hovering?: boolean }) {
  return (
    <div
      style={{
        position: "absolute",
        top: -16,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 15,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Light housing */}
      <div
        style={{
          width: 32,
          height: 12,
          background: `linear-gradient(180deg, ${C.metalLight}, ${C.metalDark})`,
          borderRadius: "4px 4px 0 0",
          boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
        }}
      />
      {/* Light glow */}
      <div
        style={{
          position: "absolute",
          top: 10,
          width: hovering ? 300 : 200,
          height: hovering ? 140 : 80,
          background: `radial-gradient(ellipse at top, rgba(255,235,59,${hovering ? 0.25 : 0.1}), transparent 70%)`,
          pointerEvents: "none",
          transition: "all 0.5s ease",
        }}
      />
    </div>
  );
}

/* ─── Construction Tape Pattern ─── */
function ConstructionTape({
  width = "100%",
  style = {},
}: {
  width?: string | number;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        width,
        height: 28,
        overflow: "hidden",
        position: "relative",
        ...style,
      }}
    >
      <div
        style={{
          width: "200%",
          height: "100%",
          background: `repeating-linear-gradient(
            -45deg,
            ${C.yellow} 0px,
            ${C.yellow} 14px,
            ${C.black} 14px,
            ${C.black} 28px
          )`,
        }}
      />
    </div>
  );
}

/* ─── Neon Arrow Sign ─── */
function NeonArrow({
  label,
  direction = "right",
  style = {},
}: {
  label: string;
  direction?: "right" | "down" | "left";
  style?: React.CSSProperties;
}) {
  const rotation =
    direction === "down" ? 90 : direction === "left" ? 180 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: direction === "right" ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        ...style,
      }}
    >
      <svg
        width="36"
        height="24"
        viewBox="0 0 36 24"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <polygon
          points="0,4 24,4 24,0 36,12 24,24 24,20 0,20"
          fill="none"
          stroke={C.pink}
          strokeWidth="2"
          style={{
            filter: `drop-shadow(0 0 6px ${C.pink}) drop-shadow(0 0 12px ${C.pink})`,
          }}
        />
        <polygon
          points="2,6 22,6 22,2 34,12 22,22 22,18 2,18"
          fill="none"
          stroke={C.pink}
          strokeWidth="0.5"
          opacity={0.5}
        />
      </svg>
      <span
        style={{
          fontFamily: "var(--font-sora)",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: C.pink,
          textShadow: `0 0 8px ${C.pink}, 0 0 16px rgba(255,23,68,0.3)`,
        }}
      >
        {label}
      </span>
    </motion.div>
  );
}

/* ─── Stencil Stamp (POST NO BILLS etc.) ─── */
function StencilStamp({
  text,
  rotation = -5,
  style = {},
}: {
  text: string;
  rotation?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        display: "inline-block",
        padding: "6px 16px",
        border: `3px solid ${C.pink}`,
        fontFamily: "var(--font-sora)",
        fontSize: "clamp(10px, 1.2vw, 14px)",
        fontWeight: 700,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: C.pink,
        transform: `rotate(${rotation}deg)`,
        opacity: 0.65,
        userSelect: "none",
        pointerEvents: "none",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {text}
    </div>
  );
}

/* ─── Wheat-Paste Torn Edge Clip Paths ─── */
const tornClipPaths = [
  "polygon(0% 1%, 3% 0%, 7% 2%, 12% 0%, 18% 1%, 22% 0%, 28% 2%, 33% 0%, 38% 1%, 43% 0%, 48% 2%, 52% 0%, 57% 1%, 62% 0%, 68% 2%, 73% 0%, 78% 1%, 83% 0%, 88% 2%, 93% 0%, 97% 1%, 100% 0%, 100% 98%, 97% 100%, 93% 98%, 88% 100%, 83% 98%, 78% 100%, 73% 98%, 68% 100%, 62% 98%, 57% 100%, 52% 98%, 48% 100%, 43% 98%, 38% 100%, 33% 98%, 28% 100%, 22% 98%, 18% 100%, 12% 98%, 7% 100%, 3% 98%, 0% 100%)",
  "polygon(0% 2%, 4% 0%, 8% 1%, 14% 0%, 19% 2%, 25% 0%, 30% 1%, 36% 0%, 41% 2%, 46% 0%, 51% 1%, 56% 0%, 61% 2%, 66% 0%, 71% 1%, 76% 0%, 81% 2%, 86% 0%, 91% 1%, 96% 0%, 100% 2%, 100% 99%, 96% 100%, 91% 98%, 86% 100%, 81% 99%, 76% 100%, 71% 98%, 66% 100%, 61% 99%, 56% 100%, 51% 98%, 46% 100%, 41% 99%, 36% 100%, 30% 98%, 25% 100%, 19% 99%, 14% 100%, 8% 98%, 4% 100%, 0% 99%)",
];

/* ─── Billboard Project Card ─── */
function BillboardCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const rotation = index % 2 === 0 ? -1.2 : 1.5;
  const clipPath = tornClipPaths[index % 2];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 1.05, rotate: rotation * 1.5 }}
      animate={
        isInView
          ? { opacity: 1, scale: 1, rotate: rotation }
          : { opacity: 0, scale: 1.05, rotate: rotation * 1.5 }
      }
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ rotate: 0, scale: 1.02 }}
      style={{
        position: "relative",
        cursor: "pointer",
        transform: `rotate(${rotation}deg)`,
      }}
    >
      {/* Billboard metal frame */}
      <div
        style={{
          position: "relative",
          background: `linear-gradient(135deg, ${C.metal}, ${C.metalDark}, ${C.metal})`,
          padding: 6,
          borderRadius: 2,
          boxShadow: `0 8px 32px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.15)`,
        }}
      >
        {/* Mounting bolts */}
        <MountBolt position="tl" />
        <MountBolt position="tr" />
        <MountBolt position="bl" />
        <MountBolt position="br" />

        {/* Spotlight */}
        <Spotlight />

        {/* Poster content (white paper with torn edges) */}
        <div
          style={{
            background: C.white,
            clipPath,
            padding: "32px 28px 28px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Wheat paste edge stain */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              boxShadow: `inset 0 0 40px rgba(184,168,138,0.3)`,
              pointerEvents: "none",
            }}
          />

          {/* Project number */}
          <div
            style={{
              fontFamily: "var(--font-space-grotesk)",
              fontSize: "clamp(60px, 8vw, 100px)",
              fontWeight: 700,
              lineHeight: 0.85,
              color: "rgba(0,0,0,0.04)",
              position: "absolute",
              top: 10,
              right: 16,
              userSelect: "none",
              pointerEvents: "none",
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </div>

          {/* Client & Year banner */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <span
              style={{
                background: C.yellow,
                padding: "3px 10px",
                fontFamily: "var(--font-sora)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: C.black,
              }}
            >
              {project.client}
            </span>
            <span
              style={{
                fontFamily: "var(--font-sora)",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.1em",
                color: C.metal,
              }}
            >
              {project.year}
            </span>
          </div>

          {/* Title */}
          <h3
            style={{
              fontFamily: "var(--font-space-grotesk)",
              fontSize: "clamp(22px, 3vw, 34px)",
              fontWeight: 700,
              lineHeight: 1.05,
              textTransform: "uppercase",
              color: C.black,
              margin: "0 0 14px 0",
              letterSpacing: "-0.02em",
              whiteSpace: "pre-line",
            }}
          >
            {project.title}
          </h3>

          {/* Description */}
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: 13,
              lineHeight: 1.6,
              color: "rgba(0,0,0,0.7)",
              margin: "0 0 14px 0",
            }}
          >
            {project.description}
          </p>

          {/* Technical detail */}
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: 11,
              lineHeight: 1.5,
              color: "rgba(0,0,0,0.45)",
              margin: "0 0 18px 0",
              fontStyle: "italic",
            }}
          >
            {project.technical}
          </p>

          {/* Tech tags */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              marginBottom: 14,
            }}
          >
            {project.tech.map((t) => (
              <span
                key={t}
                style={{
                  fontFamily: "var(--font-sora)",
                  fontSize: 9,
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "4px 8px",
                  background: C.black,
                  color: C.white,
                }}
              >
                {t}
              </span>
            ))}
          </div>

          {/* GitHub link */}
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "var(--font-sora)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: C.pink,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            View Source
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M3 11L11 3M11 3H5M11 3V9"
                stroke={C.pink}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>

          {/* Bottom torn edge accent */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 3,
              background: `linear-gradient(90deg, ${C.wheatPaste}, transparent, ${C.wheatPaste})`,
              opacity: 0.5,
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

/* ─── City Silhouette SVG ─── */
function CitySilhouette() {
  return (
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      style={{ width: "100%", height: 120, display: "block" }}
    >
      <path
        d="M0,120 L0,80 L30,80 L30,60 L45,60 L45,50 L55,50 L55,60 L70,60 L70,40 L85,40 L85,30 L95,30 L95,25 L100,25 L100,30 L110,30 L110,40 L125,40 L125,70 L150,70 L150,55 L165,55 L165,35 L175,35 L175,20 L185,20 L185,15 L190,15 L190,20 L200,20 L200,35 L215,35 L215,55 L230,55 L230,65 L260,65 L260,45 L280,45 L280,30 L290,30 L290,18 L295,18 L295,12 L300,10 L305,12 L305,18 L310,18 L310,30 L320,30 L320,45 L340,45 L340,60 L370,60 L370,50 L385,50 L385,35 L400,35 L400,25 L410,25 L410,20 L415,20 L415,12 L420,8 L425,12 L425,20 L430,20 L430,25 L440,25 L440,35 L455,35 L455,50 L470,50 L470,65 L500,65 L500,75 L530,75 L530,55 L545,55 L545,40 L560,40 L560,28 L570,28 L570,22 L575,22 L575,18 L580,16 L585,18 L585,22 L590,22 L590,28 L600,28 L600,40 L615,40 L615,55 L630,55 L630,70 L660,70 L660,50 L680,50 L680,38 L695,38 L695,25 L705,25 L705,15 L710,15 L710,10 L715,8 L720,10 L720,15 L725,15 L725,25 L735,25 L735,38 L750,38 L750,50 L770,50 L770,65 L800,65 L800,45 L815,45 L815,30 L830,30 L830,20 L840,20 L840,15 L845,12 L850,15 L850,20 L860,20 L860,30 L875,30 L875,45 L890,45 L890,60 L920,60 L920,70 L950,70 L950,55 L970,55 L970,40 L985,40 L985,28 L1000,28 L1000,40 L1015,40 L1015,55 L1035,55 L1035,50 L1050,50 L1050,35 L1065,35 L1065,45 L1080,45 L1080,60 L1100,60 L1100,50 L1115,50 L1115,65 L1140,65 L1140,75 L1160,75 L1160,60 L1180,60 L1180,80 L1200,80 L1200,120 Z"
        fill={C.black}
        opacity={0.15}
      />
      {/* Windows - tiny lit squares */}
      {[
        [40, 65],
        [50, 55],
        [78, 45],
        [90, 35],
        [105, 33],
        [170, 25],
        [180, 30],
        [175, 40],
        [210, 42],
        [270, 50],
        [285, 35],
        [300, 22],
        [315, 35],
        [395, 30],
        [410, 25],
        [420, 15],
        [435, 30],
        [540, 45],
        [565, 33],
        [575, 24],
        [590, 33],
        [670, 55],
        [690, 42],
        [705, 28],
        [715, 18],
        [730, 30],
        [810, 38],
        [835, 23],
        [845, 18],
        [960, 60],
        [978, 45],
        [1000, 35],
        [1055, 40],
        [1108, 55],
      ].map(([cx, cy], i) => (
        <rect
          key={i}
          x={cx}
          y={cy}
          width={4}
          height={5}
          fill={C.yellow}
          opacity={0.3 + (i % 3) * 0.15}
        />
      ))}
    </svg>
  );
}

/* ─── Animated Section Wrapper ─── */
function WallSection({
  children,
  style = {},
  delay = 0,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
export default function BillboardPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.concrete,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <ConcreteTexture />

      {/* ── Concrete wall texture overlay ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(197,194,188,0.4) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(224,221,218,0.3) 0%, transparent 40%),
            radial-gradient(ellipse at 50% 80%, rgba(197,194,188,0.3) 0%, transparent 50%)
          `,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Concrete surface grain */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
          pointerEvents: "none",
          zIndex: 1,
          mixBlendMode: "multiply",
        }}
      />

      {/* Wall crack decorative lines */}
      <svg
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 1,
          opacity: 0.08,
        }}
      >
        <line
          x1="15%"
          y1="0"
          x2="18%"
          y2="100%"
          stroke={C.metalDark}
          strokeWidth="0.5"
        />
        <line
          x1="72%"
          y1="0"
          x2="68%"
          y2="100%"
          stroke={C.metalDark}
          strokeWidth="0.5"
        />
        <line
          x1="0"
          y1="45%"
          x2="100%"
          y2="42%"
          stroke={C.metalDark}
          strokeWidth="0.3"
        />
      </svg>

      {/* All content above fixed elements */}
      <div style={{ position: "relative", zIndex: 2 }}>
        {/* ═══════════════════════════════════════════════════════════
            HERO SECTION
            ═══════════════════════════════════════════════════════════ */}
        <section
          ref={heroRef}
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            padding: "60px 24px",
          }}
        >
          {/* Construction tape top */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={heroInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              transformOrigin: "left",
            }}
          >
            <ConstructionTape />
          </motion.div>

          {/* Hero stencil stamps */}
          <div
            style={{
              position: "absolute",
              top: 60,
              left: "5%",
            }}
          >
            <StencilStamp text="POST NO BILLS" rotation={-8} />
          </div>
          <div
            style={{
              position: "absolute",
              top: 100,
              right: "8%",
            }}
          >
            <StencilStamp text="CITY PERMIT #42816" rotation={3} />
          </div>

          {/* Neon arrow pointing down */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            style={{
              position: "absolute",
              top: 80,
              right: "15%",
            }}
          >
            <NeonArrow label="Scroll" direction="down" />
          </motion.div>

          {/* Main hero text block */}
          <div style={{ textAlign: "center", maxWidth: 1200 }}>
            {/* Small label above */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              style={{
                fontFamily: "var(--font-sora)",
                fontSize: "clamp(10px, 1.2vw, 14px)",
                fontWeight: 700,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: C.pink,
                marginBottom: 20,
              }}
            >
              AI Product Studio
            </motion.div>

            {/* MASSIVE hero text */}
            <motion.h1
              initial={{ opacity: 0, y: 80, scale: 0.95 }}
              animate={
                heroInView
                  ? { opacity: 1, y: 0, scale: 1 }
                  : {}
              }
              transition={{
                duration: 1,
                delay: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              style={{
                fontFamily: "var(--font-space-grotesk)",
                fontSize: "clamp(5rem, 15vw, 15rem)",
                fontWeight: 700,
                lineHeight: 0.85,
                textTransform: "uppercase",
                color: C.black,
                margin: 0,
                letterSpacing: "-0.04em",
                position: "relative",
              }}
            >
              <span style={{ display: "block" }}>GR</span>
              <span
                style={{
                  display: "block",
                  WebkitTextStroke: `3px ${C.black}`,
                  color: "transparent",
                }}
              >
                OX
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "clamp(14px, 1.5vw, 20px)",
                fontWeight: 400,
                color: "rgba(0,0,0,0.5)",
                marginTop: 30,
                maxWidth: 500,
                marginLeft: "auto",
                marginRight: "auto",
                lineHeight: 1.6,
              }}
            >
              Building AI-powered products at the intersection of
              machine learning and design craft.
            </motion.p>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 1.1 }}
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "clamp(24px, 4vw, 60px)",
                marginTop: 50,
              }}
            >
              {stats.map((stat) => (
                <div key={stat.label} style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-space-grotesk)",
                      fontSize: "clamp(32px, 4vw, 56px)",
                      fontWeight: 700,
                      color: C.black,
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-sora)",
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: C.metal,
                      marginTop: 6,
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Construction tape bottom */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={heroInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{
              duration: 1.2,
              delay: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              transformOrigin: "right",
            }}
          >
            <ConstructionTape />
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            PROJECTS SECTION — POSTER WALL
            ═══════════════════════════════════════════════════════════ */}
        <section
          style={{
            padding: "80px 24px 100px",
            maxWidth: 1200,
            margin: "0 auto",
            position: "relative",
          }}
        >
          {/* Section header */}
          <WallSection>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                marginBottom: 20,
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              <div>
                <NeonArrow label="Featured Work" direction="right" />
                <h2
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    fontSize: "clamp(3rem, 8vw, 7rem)",
                    fontWeight: 700,
                    lineHeight: 0.9,
                    textTransform: "uppercase",
                    color: C.black,
                    margin: "16px 0 0 0",
                    letterSpacing: "-0.03em",
                  }}
                >
                  PROJECTS
                </h2>
              </div>
              <StencilStamp
                text="BILL STICKERS WILL BE PROSECUTED"
                rotation={2}
              />
            </div>
          </WallSection>

          {/* Construction tape divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            style={{ transformOrigin: "left", marginBottom: 50 }}
          >
            <ConstructionTape />
          </motion.div>

          {/* Poster grid -- 2 columns, overlapping, rotated */}
          <div className="bb-poster-grid">

            {projects.map((project, i) => (
              <div
                key={project.title}
                style={{
                  marginTop: i % 2 === 1 ? 40 : 0,
                  position: "relative",
                  zIndex: projects.length - i,
                }}
              >
                <BillboardCard project={project} index={i} />

                {/* Occasional stencil stamps between posters */}
                {i === 2 && (
                  <div style={{ position: "absolute", bottom: -25, left: 20 }}>
                    <StencilStamp text="POST NO BILLS" rotation={-4} />
                  </div>
                )}
                {i === 5 && (
                  <div
                    style={{ position: "absolute", bottom: -20, right: 10 }}
                  >
                    <StencilStamp text="CITY PERMIT #42816" rotation={6} />
                  </div>
                )}
                {i === 8 && (
                  <div style={{ position: "absolute", top: -20, left: 40 }}>
                    <StencilStamp
                      text="AUTHORIZED POSTING ONLY"
                      rotation={-2}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Stray stencil stamps on the wall */}
          <div
            style={{
              marginTop: 60,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <StencilStamp
              text="END OF POSTER ZONE"
              rotation={0}
              style={{ opacity: 0.35 }}
            />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            EXPERTISE SECTION
            ═══════════════════════════════════════════════════════════ */}
        <section
          style={{
            padding: "60px 24px 100px",
            position: "relative",
          }}
        >
          {/* Full-width construction tape */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            style={{ transformOrigin: "left", marginBottom: 60 }}
          >
            <ConstructionTape />
          </motion.div>

          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <WallSection>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  marginBottom: 50,
                  flexWrap: "wrap",
                  gap: 16,
                }}
              >
                <div>
                  <NeonArrow label="What I Do" direction="right" />
                  <h2
                    style={{
                      fontFamily: "var(--font-space-grotesk)",
                      fontSize: "clamp(3rem, 8vw, 7rem)",
                      fontWeight: 700,
                      lineHeight: 0.9,
                      textTransform: "uppercase",
                      color: C.black,
                      margin: "16px 0 0 0",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    EXPERTISE
                  </h2>
                </div>
                <StencilStamp text="QUALIFIED PROFESSIONAL" rotation={-3} />
              </div>
            </WallSection>

            {/* Expertise billboard panels */}
            <div className="bb-expertise-grid">
              {expertise.map((item, i) => {
                const rotation = i % 2 === 0 ? -0.8 : 1.2;
                return (
                  <WallSection key={item.title} delay={i * 0.1}>
                    <motion.div
                      whileHover={{ rotate: 0, scale: 1.01 }}
                      style={{
                        position: "relative",
                        transform: `rotate(${rotation}deg)`,
                      }}
                    >
                      {/* Billboard frame */}
                      <div
                        style={{
                          background: `linear-gradient(135deg, ${C.metal}, ${C.metalDark})`,
                          padding: 5,
                          borderRadius: 2,
                          boxShadow: `0 6px 24px rgba(0,0,0,0.2)`,
                          position: "relative",
                        }}
                      >
                        <MountBolt position="tl" />
                        <MountBolt position="tr" />
                        <MountBolt position="bl" />
                        <MountBolt position="br" />
                        <Spotlight />

                        <div
                          style={{
                            background: C.white,
                            padding: "32px 28px",
                            clipPath: tornClipPaths[i % 2],
                            position: "relative",
                          }}
                        >
                          {/* Wheat paste stain */}
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              boxShadow: `inset 0 0 30px rgba(184,168,138,0.2)`,
                              pointerEvents: "none",
                            }}
                          />

                          {/* Number */}
                          <div
                            style={{
                              fontFamily: "var(--font-space-grotesk)",
                              fontSize: 48,
                              fontWeight: 700,
                              color: "rgba(0,0,0,0.04)",
                              position: "absolute",
                              top: 8,
                              right: 16,
                              lineHeight: 1,
                            }}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </div>

                          <div
                            style={{
                              display: "inline-block",
                              background: C.yellow,
                              padding: "3px 10px",
                              marginBottom: 14,
                            }}
                          >
                            <span
                              style={{
                                fontFamily: "var(--font-sora)",
                                fontSize: 9,
                                fontWeight: 700,
                                letterSpacing: "0.15em",
                                textTransform: "uppercase",
                                color: C.black,
                              }}
                            >
                              Specialty {String(i + 1).padStart(2, "0")}
                            </span>
                          </div>

                          <h3
                            style={{
                              fontFamily: "var(--font-space-grotesk)",
                              fontSize: "clamp(18px, 2.5vw, 26px)",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              color: C.black,
                              margin: "0 0 12px 0",
                              letterSpacing: "-0.01em",
                              lineHeight: 1.1,
                            }}
                          >
                            {item.title}
                          </h3>

                          <p
                            style={{
                              fontFamily: "var(--font-inter)",
                              fontSize: 13,
                              lineHeight: 1.65,
                              color: "rgba(0,0,0,0.6)",
                              margin: 0,
                            }}
                          >
                            {item.body}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </WallSection>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            TOOLS SECTION — POSTER STRIPS
            ═══════════════════════════════════════════════════════════ */}
        <section
          style={{
            padding: "60px 24px 100px",
            position: "relative",
          }}
        >
          {/* Construction tape */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            style={{ transformOrigin: "right", marginBottom: 60 }}
          >
            <ConstructionTape />
          </motion.div>

          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <WallSection>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  marginBottom: 50,
                  flexWrap: "wrap",
                  gap: 16,
                }}
              >
                <div>
                  <NeonArrow label="Tech Stack" direction="right" />
                  <h2
                    style={{
                      fontFamily: "var(--font-space-grotesk)",
                      fontSize: "clamp(3rem, 8vw, 7rem)",
                      fontWeight: 700,
                      lineHeight: 0.9,
                      textTransform: "uppercase",
                      color: C.black,
                      margin: "16px 0 0 0",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    TOOLS
                  </h2>
                </div>
                <StencilStamp text="INDUSTRIAL GRADE" rotation={4} />
              </div>
            </WallSection>

            {/* Tool strips - small poster strips pasted to the wall */}
            <div className="bb-tools-grid">
              {tools.map((category, i) => {
                const rotation =
                  i % 3 === 0 ? -1.5 : i % 3 === 1 ? 0.8 : -0.5;
                return (
                  <WallSection key={category.label} delay={i * 0.08}>
                    <motion.div
                      whileHover={{ rotate: 0, y: -4 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        transform: `rotate(${rotation}deg)`,
                        position: "relative",
                      }}
                    >
                      {/* Poster strip */}
                      <div
                        style={{
                          background: C.white,
                          padding: "20px 18px",
                          clipPath: tornClipPaths[i % 2],
                          boxShadow: `0 4px 16px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08)`,
                          position: "relative",
                        }}
                      >
                        {/* Wheat paste stain */}
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            boxShadow: `inset 0 0 20px rgba(184,168,138,0.25)`,
                            pointerEvents: "none",
                          }}
                        />

                        {/* Yellow header strip */}
                        <div
                          style={{
                            background: C.yellow,
                            padding: "4px 10px",
                            marginBottom: 14,
                            display: "inline-block",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "var(--font-sora)",
                              fontSize: 10,
                              fontWeight: 700,
                              letterSpacing: "0.18em",
                              textTransform: "uppercase",
                              color: C.black,
                            }}
                          >
                            {category.label}
                          </span>
                        </div>

                        {/* Tool items */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 6,
                          }}
                        >
                          {category.items.map((item) => (
                            <div
                              key={item}
                              style={{
                                fontFamily: "var(--font-space-grotesk)",
                                fontSize: 13,
                                fontWeight: 600,
                                textTransform: "uppercase",
                                color: C.black,
                                letterSpacing: "0.05em",
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                              }}
                            >
                              <span
                                style={{
                                  width: 4,
                                  height: 4,
                                  background: C.pink,
                                  flexShrink: 0,
                                }}
                              />
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Tape piece on top */}
                      <div
                        style={{
                          position: "absolute",
                          top: -6,
                          left: "50%",
                          transform: `translateX(-50%) rotate(${rotation * -1.5}deg)`,
                          width: 50,
                          height: 16,
                          background: `repeating-linear-gradient(
                            -45deg,
                            ${C.yellow} 0px,
                            ${C.yellow} 4px,
                            transparent 4px,
                            transparent 8px
                          )`,
                          opacity: 0.7,
                        }}
                      />
                    </motion.div>
                  </WallSection>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            FOOTER
            ═══════════════════════════════════════════════════════════ */}
        <footer
          style={{
            position: "relative",
            padding: "0 24px 0",
          }}
        >
          {/* Final construction tape */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            style={{ transformOrigin: "center" }}
          >
            <ConstructionTape />
          </motion.div>

          {/* Footer content */}
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              padding: "80px 0 40px",
              textAlign: "center",
              position: "relative",
            }}
          >
            {/* Stencil stamps */}
            <div
              style={{
                position: "absolute",
                top: 30,
                left: 0,
              }}
            >
              <StencilStamp
                text="BILL STICKERS WILL BE PROSECUTED"
                rotation={-6}
              />
            </div>
            <div
              style={{
                position: "absolute",
                top: 50,
                right: 0,
              }}
            >
              <StencilStamp text="NO UNAUTHORIZED POSTING" rotation={4} />
            </div>

            {/* Large footer text */}
            <WallSection>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    fontSize: "clamp(3rem, 10vw, 9rem)",
                    fontWeight: 700,
                    lineHeight: 0.85,
                    textTransform: "uppercase",
                    color: C.black,
                    margin: "0 0 16px 0",
                    letterSpacing: "-0.04em",
                  }}
                >
                  LET&apos;S
                  <br />
                  <span
                    style={{
                      WebkitTextStroke: `2px ${C.black}`,
                      color: "transparent",
                    }}
                  >
                    WORK
                  </span>
                </h2>

                {/* Yellow highlight block */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  style={{
                    display: "inline-block",
                    background: C.yellow,
                    padding: "12px 36px",
                    marginTop: 16,
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-sora)",
                      fontSize: "clamp(12px, 1.5vw, 16px)",
                      fontWeight: 700,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: C.black,
                    }}
                  >
                    GET IN TOUCH
                  </span>
                </motion.div>

                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: 13,
                    color: "rgba(0,0,0,0.4)",
                    marginTop: 30,
                    lineHeight: 1.6,
                  }}
                >
                  Available for AI product development, multi-model
                  orchestration, and full-stack builds.
                </p>
              </motion.div>
            </WallSection>

            {/* Footer meta info */}
            <div
              style={{
                marginTop: 50,
                display: "flex",
                justifyContent: "center",
                gap: 40,
                flexWrap: "wrap",
              }}
            >
              {[
                { label: "Email", value: "hello@grox.studio" },
                { label: "Location", value: "Remote" },
                { label: "Status", value: "Available" },
              ].map((item) => (
                <div key={item.label}>
                  <div
                    style={{
                      fontFamily: "var(--font-sora)",
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: C.metal,
                      marginBottom: 4,
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-space-grotesk)",
                      fontSize: 14,
                      fontWeight: 600,
                      color: C.black,
                      textTransform: "uppercase",
                    }}
                  >
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Copyright */}
            <div
              style={{
                marginTop: 40,
                fontFamily: "var(--font-sora)",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(0,0,0,0.25)",
              }}
            >
              &copy; {new Date().getFullYear()} GROX &mdash; AI PRODUCT STUDIO
            </div>
          </div>

          {/* City silhouette at bottom */}
          <div
            style={{
              position: "relative",
              marginTop: 20,
              overflow: "hidden",
            }}
          >
            <CitySilhouette />
          </div>
        </footer>

        {/* Theme Switcher */}
        <ThemeSwitcher current="/billboard" variant="light" />
      </div>

      {/* ═══════════════════════════════════════════════════════════
          RESPONSIVE STYLES
          Inline style tag for media queries not possible via style prop
          ═══════════════════════════════════════════════════════════ */}
      <style>{`
        /* ── Base grid layouts ── */
        .bb-poster-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 40px 30px;
          position: relative;
        }
        .bb-expertise-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 30px;
        }
        .bb-tools-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        /* ── Tablet ── */
        @media (max-width: 1024px) {
          .bb-tools-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* ── Mobile ── */
        @media (max-width: 768px) {
          .bb-poster-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          .bb-expertise-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .bb-tools-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
        }

        /* ── Small mobile ── */
        @media (max-width: 480px) {
          .bb-tools-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }

        /* ── Poster hover glow ── */
        .bb-poster-grid > div:hover {
          z-index: 50 !important;
        }

        /* ── Selection color matching theme ── */
        ::selection {
          background: #FFEB3B;
          color: #000000;
        }
      `}</style>
    </div>
  );
}
