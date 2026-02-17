"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { projects, stats, expertise, tools } from "@/app/data/projects";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";

/* ═══════════════════════════════════════════════════
   COLORS — Kiln Firing Palette
   ═══════════════════════════════════════════════════ */
const C = {
  bg: "#1A1210",
  brick: "#8B3A2E",
  brickLight: "#A44D3F",
  fire: "#FF6B35",
  fireGlow: "rgba(255,107,53,0.25)",
  clay: "#C4A882",
  clayLight: "#D4BFA0",
  ash: "#888888",
  kilnInterior: "#FFAA33",
  soot: "#1A1210",
  bone: "#F5F0E8",
  boneMuted: "rgba(245,240,232,0.55)",
  boneGhost: "rgba(245,240,232,0.08)",
  border: "rgba(255,107,53,0.15)",
  borderBrick: "rgba(139,58,46,0.4)",
  flameYellow: "#FFD93D",
  flameRed: "#E63946",
  tempHot: "#FF2D00",
};

/* ═══════════════════════════════════════════════════
   FONT HELPERS
   ═══════════════════════════════════════════════════ */
const spaceGrotesk = () => `var(--font-space-grotesk), ui-monospace, monospace`;
const manrope = () => `var(--font-manrope), ui-sans-serif, system-ui, sans-serif`;
const inter = () => `var(--font-inter), ui-sans-serif, system-ui, sans-serif`;
const jetbrains = () => `var(--font-jetbrains), ui-monospace, monospace`;

/* ═══════════════════════════════════════════════════
   GLAZE COLORS — For project cards
   ═══════════════════════════════════════════════════ */
const glazeColors = [
  "#4A90D9", // Celadon blue
  "#2E8B57", // Copper green
  "#8B4513", // Iron oxide
  "#DAA520", // Ash glaze gold
  "#704214", // Tenmoku brown
  "#C41E3A", // Oxblood red
  "#6B5B95", // Cobalt purple
  "#F0E68C", // Shino yellow
  "#708090", // Wood ash gray
  "#CC5500", // Persimmon orange
];

/* ═══════════════════════════════════════════════════
   SVG COMPONENTS
   ═══════════════════════════════════════════════════ */

/* Pyrometric Cone — triangle that leans/melts based on progress */
function PyroCone({
  x,
  label,
  meltProgress,
  delay = 0,
}: {
  x: number;
  label: string;
  meltProgress: number;
  delay?: number;
}) {
  const skew = meltProgress * 45;
  const scaleY = 1 - meltProgress * 0.35;
  return (
    <g>
      <motion.polygon
        points={`${x},80 ${x - 12},130 ${x + 12},130`}
        fill={C.clay}
        stroke={C.fire}
        strokeWidth="1.5"
        style={{
          transformOrigin: `${x}px 130px`,
          transform: `skewX(${skew}deg) scaleY(${scaleY})`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.3, duration: 0.6 }}
      />
      <text
        x={x}
        y={145}
        textAnchor="middle"
        fill={C.ash}
        fontSize="9"
        fontFamily={spaceGrotesk()}
      >
        {label}
      </text>
    </g>
  );
}

/* Kiln Cross-Section SVG */
function KilnCrossSection() {
  return (
    <svg
      viewBox="0 0 320 200"
      fill="none"
      style={{ width: "100%", maxWidth: 320 }}
    >
      {/* Outer brick wall */}
      <rect
        x="20"
        y="20"
        width="280"
        height="160"
        rx="8"
        fill={C.brick}
        stroke={C.brickLight}
        strokeWidth="2"
      />
      {/* Brick lines */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <line
          key={`hb-${i}`}
          x1="20"
          y1={40 + i * 20}
          x2="300"
          y2={40 + i * 20}
          stroke={C.soot}
          strokeWidth="0.5"
          opacity={0.3}
        />
      ))}
      {[0, 1, 2, 3, 4, 5].map((i) =>
        [0, 1, 2, 3, 4, 5, 6, 7, 8].map((j) => (
          <line
            key={`vb-${i}-${j}`}
            x1={40 + i * 48 + (j % 2 === 0 ? 0 : 24)}
            y1={20 + j * 20}
            x2={40 + i * 48 + (j % 2 === 0 ? 0 : 24)}
            y2={20 + (j + 1) * 20}
            stroke={C.soot}
            strokeWidth="0.5"
            opacity={0.2}
          />
        ))
      )}
      {/* Inner chamber */}
      <rect
        x="50"
        y="45"
        width="220"
        height="110"
        rx="4"
        fill="#2A1A12"
      />
      {/* Kiln glow */}
      <rect
        x="55"
        y="50"
        width="210"
        height="100"
        rx="2"
        fill="url(#kilnGlowGrad)"
        className="kiln-glow-pulse"
      />
      {/* Shelves */}
      <rect x="70" y="85" width="180" height="3" rx="1" fill={C.clay} />
      <rect x="70" y="120" width="180" height="3" rx="1" fill={C.clay} />
      {/* Shelf supports */}
      {[80, 140, 200, 240].map((sx, i) => (
        <g key={`sup-${i}`}>
          <rect x={sx} y={88} width="4" height="32" rx="1" fill={C.clay} opacity={0.7} />
        </g>
      ))}
      {/* Pottery on shelves */}
      <ellipse cx="110" cy="82" rx="12" ry="8" fill={glazeColors[0]} opacity={0.8} />
      <ellipse cx="160" cy="80" rx="10" ry="10" fill={glazeColors[2]} opacity={0.8} />
      <rect x="200" y="72" width="14" height="13" rx="2" fill={glazeColors[4]} opacity={0.8} />
      <ellipse cx="120" cy="117" rx="14" ry="9" fill={glazeColors[5]} opacity={0.8} />
      <ellipse cx="180" cy="118" rx="8" ry="8" fill={glazeColors[7]} opacity={0.8} />
      {/* Flame shapes at bottom */}
      {[90, 120, 150, 180, 210].map((fx, i) => (
        <motion.path
          key={`flame-${i}`}
          d={`M${fx},150 Q${fx - 5},${138 - i * 2} ${fx - 2},${130 - i} Q${fx},${125 - i * 2} ${fx + 2},${130 - i} Q${fx + 5},${138 - i * 2} ${fx},150Z`}
          fill={i % 2 === 0 ? C.fire : C.flameYellow}
          opacity={0.7}
          className="kiln-flame-flicker"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
      {/* Peephole */}
      <circle cx="310" cy="100" r="8" fill="#2A1A12" stroke={C.brickLight} strokeWidth="1.5" />
      <circle cx="310" cy="100" r="5" fill={C.kilnInterior} opacity={0.6} className="kiln-glow-pulse" />
      <defs>
        <radialGradient id="kilnGlowGrad" cx="50%" cy="85%" r="60%">
          <stop offset="0%" stopColor={C.kilnInterior} stopOpacity="0.4" />
          <stop offset="40%" stopColor={C.fire} stopOpacity="0.15" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/* Temperature Ramp Graph SVG */
function TempRampGraph({ className = "" }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  // Firing curve: ramp up, hold, ramp down
  const curvePath =
    "M30,170 L60,160 L100,130 L130,80 L160,50 L190,45 L220,45 L250,60 L280,100 L310,140 L340,165";

  return (
    <svg
      ref={ref}
      viewBox="0 0 370 200"
      fill="none"
      className={className}
      style={{ width: "100%", maxWidth: 370 }}
    >
      {/* Grid lines */}
      {[50, 90, 130, 170].map((y, i) => (
        <g key={`grid-${i}`}>
          <line
            x1="30"
            y1={y}
            x2="340"
            y2={y}
            stroke={C.ash}
            strokeWidth="0.3"
            opacity={0.3}
          />
          <text
            x="22"
            y={y + 3}
            textAnchor="end"
            fill={C.ash}
            fontSize="7"
            fontFamily={jetbrains()}
          >
            {[1200, 900, 600, 300][i]}
          </text>
        </g>
      ))}
      {/* Axis labels */}
      <text
        x="8"
        y="110"
        textAnchor="middle"
        fill={C.ash}
        fontSize="7"
        fontFamily={spaceGrotesk()}
        transform="rotate(-90, 8, 110)"
      >
        TEMP F
      </text>
      <text
        x="185"
        y="195"
        textAnchor="middle"
        fill={C.ash}
        fontSize="7"
        fontFamily={spaceGrotesk()}
      >
        TIME (HRS)
      </text>
      {/* Firing curve - glow */}
      <motion.path
        d={curvePath}
        stroke={C.fireGlow}
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
      />
      {/* Firing curve - main */}
      <motion.path
        d={curvePath}
        stroke={C.fire}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
      />
      {/* Phase labels */}
      <motion.text
        x="80"
        y="175"
        fill={C.clay}
        fontSize="7"
        fontFamily={spaceGrotesk()}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.7 } : { opacity: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        RAMP
      </motion.text>
      <motion.text
        x="195"
        y="37"
        fill={C.fire}
        fontSize="7"
        fontFamily={spaceGrotesk()}
        textAnchor="middle"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        HOLD / SOAK
      </motion.text>
      <motion.text
        x="300"
        y="158"
        fill={C.clay}
        fontSize="7"
        fontFamily={spaceGrotesk()}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.7 } : { opacity: 0 }}
        transition={{ delay: 2.2, duration: 0.5 }}
      >
        COOL
      </motion.text>
      {/* Peak marker */}
      <motion.circle
        cx="205"
        cy="45"
        r="3"
        fill={C.fire}
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : { scale: 0 }}
        transition={{ delay: 1.8, type: "spring" }}
      />
    </svg>
  );
}

/* Flame SVG shape */
function FlameSVG({ size = 24, color = C.fire }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 24 34" fill="none">
      <path
        d="M12,2 Q8,10 6,16 Q4,22 8,28 Q10,32 12,32 Q14,32 16,28 Q20,22 18,16 Q16,10 12,2Z"
        fill={color}
        opacity={0.85}
      />
      <path
        d="M12,10 Q10,16 9,20 Q8,24 10,27 Q11,29 12,29 Q13,29 14,27 Q16,24 15,20 Q14,16 12,10Z"
        fill={C.flameYellow}
        opacity={0.7}
      />
    </svg>
  );
}

/* Spiral Coil SVG (potter's coil technique) */
function CoilSpiral({ size = 60 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      <motion.path
        d="M30,30 C30,24 36,22 38,28 C40,34 34,38 28,36 C22,34 20,26 26,22 C32,18 40,20 42,28 C44,36 36,42 26,40 C18,38 16,28 22,20"
        stroke={C.clay}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
    </svg>
  );
}

/* Pottery Shape SVG */
function PotteryShape({ variant, size = 40 }: { variant: number; size?: number }) {
  const shapes = [
    // Bowl
    "M5,20 Q5,35 20,35 Q35,35 35,20 Q30,25 20,25 Q10,25 5,20Z",
    // Vase
    "M14,5 Q10,5 10,10 L8,30 Q8,35 20,35 Q32,35 32,30 L30,10 Q30,5 26,5Z",
    // Cup
    "M8,10 L6,30 Q6,35 20,35 Q34,35 34,30 L32,10Z",
    // Plate
    "M3,25 Q3,32 20,32 Q37,32 37,25 Q37,22 20,22 Q3,22 3,25Z",
    // Teapot
    "M10,12 Q8,12 8,18 L7,28 Q7,32 20,32 Q33,32 33,28 L32,18 Q32,12 30,12Z",
  ];
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path
        d={shapes[variant % shapes.length]}
        fill={glazeColors[variant % glazeColors.length]}
        opacity={0.6}
        stroke={C.clay}
        strokeWidth="0.8"
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════
   SECTION COMPONENTS
   ═══════════════════════════════════════════════════ */

/* Brick texture border */
function BrickBorder({ side = "top" }: { side?: "top" | "bottom" }) {
  return (
    <div
      style={{
        height: 12,
        width: "100%",
        background: `repeating-linear-gradient(
          90deg,
          ${C.brick} 0px,
          ${C.brick} 30px,
          ${C.soot} 30px,
          ${C.soot} 32px
        )`,
        opacity: 0.6,
        borderRadius: side === "top" ? "4px 4px 0 0" : "0 0 4px 4px",
      }}
    />
  );
}

/* Animated section wrapper */
function Section({
  children,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.section
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════ */
export default function KilnPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  /* Pyrometric cone melt progress mapped to scroll */
  const cone1Melt = useTransform(heroScroll, [0, 0.4], [0, 0.3]);
  const cone2Melt = useTransform(heroScroll, [0.1, 0.6], [0, 0.6]);
  const cone3Melt = useTransform(heroScroll, [0.2, 0.8], [0, 1]);

  /* Temperature display */
  const temperature = useTransform(scrollYProgress, [0, 0.3], [72, 2345]);
  const [tempDisplay, setTempDisplay] = useState(72);

  useEffect(() => {
    const unsubscribe = temperature.on("change", (v) =>
      setTempDisplay(Math.round(v))
    );
    return unsubscribe;
  }, [temperature]);

  /* Cone values for rendering */
  const [c1, setC1] = useState(0);
  const [c2, setC2] = useState(0);
  const [c3, setC3] = useState(0);

  useEffect(() => {
    const u1 = cone1Melt.on("change", setC1);
    const u2 = cone2Melt.on("change", setC2);
    const u3 = cone3Melt.on("change", setC3);
    return () => { u1(); u2(); u3(); };
  }, [cone1Melt, cone2Melt, cone3Melt]);

  /* Kiln glow intensity tied to scroll */
  const glowIntensity = useTransform(scrollYProgress, [0, 0.2], [0.3, 0.8]);
  const [glow, setGlow] = useState(0.3);
  useEffect(() => {
    const u = glowIntensity.on("change", setGlow);
    return u;
  }, [glowIntensity]);

  return (
    <>
      <style>{`
        @keyframes kiln-flame-flicker {
          0%, 100% { transform: scaleY(1) scaleX(1); opacity: 0.7; }
          25% { transform: scaleY(1.15) scaleX(0.92); opacity: 0.9; }
          50% { transform: scaleY(0.9) scaleX(1.08); opacity: 0.6; }
          75% { transform: scaleY(1.1) scaleX(0.95); opacity: 0.85; }
        }
        .kiln-flame-flicker {
          animation: kiln-flame-flicker 0.8s ease-in-out infinite;
          transform-origin: center bottom;
        }
        @keyframes kiln-glow-pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.85; }
        }
        .kiln-glow-pulse {
          animation: kiln-glow-pulse 3s ease-in-out infinite;
        }
        @keyframes heat-shimmer {
          0%, 100% { transform: translateY(0) scaleX(1); }
          33% { transform: translateY(-1px) scaleX(1.002); }
          66% { transform: translateY(0.5px) scaleX(0.998); }
        }
        @keyframes temp-digit-glow {
          0%, 100% { text-shadow: 0 0 8px rgba(255,107,53,0.5); }
          50% { text-shadow: 0 0 20px rgba(255,107,53,0.9), 0 0 40px rgba(255,170,51,0.3); }
        }
        @keyframes brick-reveal {
          0% { clip-path: inset(100% 0 0 0); }
          100% { clip-path: inset(0 0 0 0); }
        }
        @keyframes cooling-shift {
          0% { background-color: ${C.fire}; }
          50% { background-color: ${C.brick}; }
          100% { background-color: ${C.soot}; }
        }
        @keyframes peephole-glow {
          0%, 100% { box-shadow: 0 0 15px 5px rgba(255,170,51,0.3); }
          50% { box-shadow: 0 0 30px 10px rgba(255,170,51,0.6); }
        }
        @keyframes float-ash {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          20% { opacity: 0.4; }
          80% { opacity: 0.2; }
          100% { transform: translateY(-200px) rotate(180deg); opacity: 0; }
        }
        .kiln-card-brick {
          background-image: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 28px,
            rgba(139,58,46,0.15) 28px,
            rgba(139,58,46,0.15) 30px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 48px,
            rgba(139,58,46,0.08) 48px,
            rgba(139,58,46,0.08) 50px
          );
        }
      `}</style>

      <div
        ref={containerRef}
        style={{
          minHeight: "100vh",
          background: C.bg,
          color: C.bone,
          fontFamily: inter(),
          overflowX: "hidden",
          position: "relative",
        }}
      >
        {/* ───── Ambient ash particles ───── */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            overflow: "hidden",
          }}
        >
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={`ash-${i}`}
              style={{
                position: "absolute",
                left: `${(i * 37 + 13) % 100}%`,
                bottom: "-10px",
                width: `${2 + (i % 3)}px`,
                height: `${2 + (i % 3)}px`,
                borderRadius: "50%",
                background: C.ash,
                opacity: 0,
                animation: `float-ash ${6 + (i % 4) * 2}s linear infinite`,
                animationDelay: `${i * 0.8}s`,
              }}
            />
          ))}
        </div>

        {/* ═══════════════════════════════════
            HERO SECTION
            ═══════════════════════════════════ */}
        <div ref={heroRef} style={{ position: "relative", minHeight: "100vh" }}>
          {/* Background kiln glow */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(ellipse 60% 50% at 50% 80%, rgba(255,107,53,${glow * 0.15}) 0%, transparent 70%)`,
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              padding: "0 24px",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Temperature reading - fixed style */}
            <motion.div
              style={{
                position: "fixed",
                top: 24,
                right: 28,
                zIndex: 50,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background:
                    tempDisplay > 1800
                      ? C.tempHot
                      : tempDisplay > 1000
                      ? C.fire
                      : tempDisplay > 500
                      ? C.kilnInterior
                      : C.clay,
                  boxShadow: `0 0 8px ${tempDisplay > 1000 ? C.fire : C.clay}`,
                }}
              />
              <span
                style={{
                  fontFamily: jetbrains(),
                  fontSize: 13,
                  color: tempDisplay > 1800 ? C.tempHot : C.fire,
                  animation:
                    tempDisplay > 1800
                      ? "temp-digit-glow 1s ease-in-out infinite"
                      : "none",
                  letterSpacing: "0.05em",
                }}
              >
                {tempDisplay}°F
              </span>
            </motion.div>

            {/* Top tag */}
            <motion.div
              style={{
                paddingTop: 80,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <FlameSVG size={16} />
              <span
                style={{
                  fontFamily: spaceGrotesk(),
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  color: C.fire,
                  textTransform: "uppercase",
                }}
              >
                Cone 10 Reduction Firing
              </span>
            </motion.div>

            {/* KILN Title */}
            <motion.h1
              style={{
                fontFamily: manrope(),
                fontSize: "clamp(80px, 14vw, 180px)",
                fontWeight: 800,
                lineHeight: 0.9,
                marginTop: 32,
                color: C.bone,
                position: "relative",
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <span
                style={{
                  background: `linear-gradient(180deg, ${C.bone} 0%, ${C.clay} 60%, ${C.fire} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: `drop-shadow(0 0 ${20 + glow * 30}px rgba(255,107,53,${glow * 0.4}))`,
                }}
              >
                KILN
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              style={{
                fontFamily: inter(),
                fontSize: 17,
                lineHeight: 1.6,
                color: C.boneMuted,
                maxWidth: 460,
                marginTop: 28,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              Crafting digital experiences through fire and patience.
              Each project shaped, glazed, and fired to vitrification.
            </motion.p>

            {/* Hero layout: Kiln cross-section + Pyrometric cones */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 48,
                marginTop: 48,
                alignItems: "center",
              }}
              className="max-lg:grid-cols-1"
            >
              {/* Kiln SVG */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <KilnCrossSection />
              </motion.div>

              {/* Pyrometric Cones + Stats */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  <p
                    style={{
                      fontFamily: spaceGrotesk(),
                      fontSize: 10,
                      letterSpacing: "0.15em",
                      color: C.ash,
                      textTransform: "uppercase",
                      marginBottom: 12,
                    }}
                  >
                    Pyrometric Cone Status
                  </p>
                  <svg viewBox="0 0 220 160" fill="none" style={{ width: "100%", maxWidth: 220 }}>
                    <PyroCone x={50} label="CONE 06" meltProgress={c1} delay={0} />
                    <PyroCone x={110} label="CONE 6" meltProgress={c2} delay={0.2} />
                    <PyroCone x={170} label="CONE 10" meltProgress={c3} delay={0.4} />
                    {/* Base line */}
                    <line
                      x1="30"
                      y1="130"
                      x2="190"
                      y2="130"
                      stroke={C.clay}
                      strokeWidth="2"
                    />
                  </svg>
                </motion.div>

                {/* Stats as firing schedule */}
                <motion.div
                  style={{
                    display: "flex",
                    gap: 28,
                    marginTop: 32,
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.6 }}
                >
                  {stats.map((s, i) => (
                    <div key={i}>
                      <div
                        style={{
                          fontFamily: jetbrains(),
                          fontSize: 28,
                          fontWeight: 700,
                          color: C.fire,
                          lineHeight: 1,
                        }}
                      >
                        {s.value}
                      </div>
                      <div
                        style={{
                          fontFamily: spaceGrotesk(),
                          fontSize: 10,
                          letterSpacing: "0.12em",
                          color: C.ash,
                          textTransform: "uppercase",
                          marginTop: 6,
                        }}
                      >
                        {s.label}
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* Peephole viewport effect */}
            <motion.div
              style={{
                margin: "64px auto 0",
                width: 80,
                height: 80,
                borderRadius: "50%",
                border: `3px solid ${C.brick}`,
                background: `radial-gradient(circle, rgba(255,170,51,${glow * 0.5}) 0%, rgba(255,107,53,${glow * 0.2}) 50%, transparent 80%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: "peephole-glow 3s ease-in-out infinite",
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
            >
              <span style={{ fontSize: 24, opacity: 0.8 }}>⏶</span>
            </motion.div>
          </div>
        </div>

        {/* ═══════════════════════════════════
            PROJECTS SECTION
            ═══════════════════════════════════ */}
        <Section
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "120px 24px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Section header */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
            <FlameSVG size={14} />
            <span
              style={{
                fontFamily: spaceGrotesk(),
                fontSize: 10,
                letterSpacing: "0.2em",
                color: C.fire,
                textTransform: "uppercase",
              }}
            >
              Kiln Load
            </span>
          </div>
          <h2
            style={{
              fontFamily: manrope(),
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 700,
              color: C.bone,
              marginBottom: 12,
              lineHeight: 1.1,
            }}
          >
            Pieces in the Kiln
          </h2>
          <p
            style={{
              fontFamily: inter(),
              fontSize: 15,
              color: C.boneMuted,
              maxWidth: 500,
              marginBottom: 56,
            }}
          >
            Each project carefully loaded, fired at temperature, and unloaded with care.
          </p>

          {/* Temperature ramp graph */}
          <div
            style={{
              marginBottom: 64,
              padding: "24px 16px",
              background: `rgba(26,18,16,0.6)`,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
            }}
          >
            <p
              style={{
                fontFamily: spaceGrotesk(),
                fontSize: 9,
                letterSpacing: "0.15em",
                color: C.ash,
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Firing Schedule
            </p>
            <TempRampGraph />
          </div>

          {/* Project Cards — arranged on kiln shelves */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {/* Shelf groups: 3-4-3 */}
            {[
              projects.slice(0, 3),
              projects.slice(3, 7),
              projects.slice(7, 10),
            ].map((shelf, shelfIdx) => (
              <div key={`shelf-${shelfIdx}`}>
                {/* Shelf line */}
                {shelfIdx > 0 && (
                  <div
                    style={{
                      height: 4,
                      background: `linear-gradient(90deg, transparent, ${C.clay} 10%, ${C.clay} 90%, transparent)`,
                      margin: "8px 0 40px",
                      borderRadius: 2,
                      position: "relative",
                    }}
                  >
                    {/* Shelf supports */}
                    {[15, 50, 85].map((pos) => (
                      <div
                        key={`supp-${shelfIdx}-${pos}`}
                        style={{
                          position: "absolute",
                          left: `${pos}%`,
                          top: 4,
                          width: 6,
                          height: 24,
                          background: C.clay,
                          borderRadius: "0 0 2px 2px",
                          opacity: 0.5,
                        }}
                      />
                    ))}
                  </div>
                )}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${shelf.length <= 3 ? 3 : 4}, 1fr)`,
                    gap: 20,
                    marginBottom: 40,
                  }}
                  className="max-md:!grid-cols-1 max-lg:!grid-cols-2"
                >
                  {shelf.map((project, pIdx) => {
                    const globalIdx =
                      shelfIdx === 0 ? pIdx : shelfIdx === 1 ? pIdx + 3 : pIdx + 7;
                    return (
                      <ProjectCard
                        key={project.title}
                        project={project}
                        index={globalIdx}
                        delay={pIdx * 0.1}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ═══════════════════════════════════
            EXPERTISE SECTION — Glaze Test Tiles
            ═══════════════════════════════════ */}
        <Section
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "80px 24px 120px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <BrickBorder side="top" />

          <div
            style={{
              padding: "64px 0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <CoilSpiral size={28} />
              <span
                style={{
                  fontFamily: spaceGrotesk(),
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  color: C.fire,
                  textTransform: "uppercase",
                }}
              >
                Glaze Library
              </span>
            </div>
            <h2
              style={{
                fontFamily: manrope(),
                fontSize: "clamp(28px, 4vw, 48px)",
                fontWeight: 700,
                color: C.bone,
                marginBottom: 48,
              }}
            >
              Test Tiles
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 20,
              }}
              className="max-md:!grid-cols-1 max-lg:!grid-cols-2"
            >
              {expertise.map((exp, i) => (
                <ExpertiseTile key={exp.title} item={exp} index={i} />
              ))}
            </div>
          </div>

          <BrickBorder side="bottom" />
        </Section>

        {/* ═══════════════════════════════════
            TOOLS SECTION — Potter's Wheel Layout
            ═══════════════════════════════════ */}
        <Section
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "80px 24px 120px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <FlameSVG size={14} color={C.kilnInterior} />
              <span
                style={{
                  fontFamily: spaceGrotesk(),
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  color: C.fire,
                  textTransform: "uppercase",
                }}
              >
                Potter&apos;s Toolkit
              </span>
            </div>
            <h2
              style={{
                fontFamily: manrope(),
                fontSize: "clamp(28px, 4vw, 48px)",
                fontWeight: 700,
                color: C.bone,
              }}
            >
              Wheel & Tools
            </h2>
          </div>

          {/* Radial / wheel layout */}
          <div
            style={{
              position: "relative",
              maxWidth: 700,
              margin: "0 auto",
              aspectRatio: "1",
            }}
            className="max-md:!aspect-auto"
          >
            {/* Center wheel */}
            <motion.div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${C.clay} 0%, ${C.brick} 80%)`,
                border: `3px solid ${C.clayLight}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2,
              }}
              className="max-md:!relative max-md:!top-auto max-md:!left-auto max-md:!transform-none max-md:!mx-auto max-md:!mb-8"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                <circle cx="30" cy="30" r="20" stroke={C.bone} strokeWidth="1" opacity={0.4} />
                <circle cx="30" cy="30" r="10" stroke={C.bone} strokeWidth="0.8" opacity={0.3} />
                <circle cx="30" cy="30" r="3" fill={C.bone} opacity={0.5} />
                {/* Grooves */}
                {[0, 60, 120, 180, 240, 300].map((angle) => (
                  <line
                    key={angle}
                    x1="30"
                    y1="30"
                    x2={30 + Math.cos((angle * Math.PI) / 180) * 25}
                    y2={30 + Math.sin((angle * Math.PI) / 180) * 25}
                    stroke={C.bone}
                    strokeWidth="0.5"
                    opacity={0.2}
                  />
                ))}
              </svg>
            </motion.div>

            {/* Tool categories arranged radially */}
            {tools.map((tool, i) => {
              const angle = (i * 60 - 90) * (Math.PI / 180);
              const radius = 42; // percentage from center
              const x = 50 + radius * Math.cos(angle);
              const y = 50 + radius * Math.sin(angle);
              return (
                <ToolCategory
                  key={tool.label}
                  tool={tool}
                  index={i}
                  style={{
                    position: "absolute" as const,
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  mobileStyle={{
                    position: "relative" as const,
                    left: "auto",
                    top: "auto",
                    transform: "none",
                  }}
                />
              );
            })}
          </div>

          {/* Mobile fallback grid */}
          <div
            className="hidden max-md:!grid"
            style={{
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 16,
              marginTop: 24,
            }}
          >
            {tools.map((tool, i) => (
              <ToolCategoryMobile key={`mob-${tool.label}`} tool={tool} index={i} />
            ))}
          </div>
        </Section>

        {/* ═══════════════════════════════════
            FOOTER
            ═══════════════════════════════════ */}
        <footer
          style={{
            position: "relative",
            padding: "80px 24px 48px",
            overflow: "hidden",
            zIndex: 1,
          }}
        >
          {/* Cooling kiln gradient */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(180deg, ${C.bg} 0%, rgba(139,58,46,0.15) 30%, rgba(255,107,53,0.05) 60%, ${C.bg} 100%)`,
              pointerEvents: "none",
            }}
          />

          <BrickBorder side="top" />

          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              textAlign: "center",
              position: "relative",
              paddingTop: 64,
            }}
          >
            {/* Cooling flame animation */}
            <motion.div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 6,
                marginBottom: 32,
              }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={`cool-flame-${i}`}
                  initial={{ scale: 1, opacity: 0.8 }}
                  whileInView={{
                    scale: [1, 0.8, 0.5, 0.2],
                    opacity: [0.8, 0.6, 0.3, 0.05],
                  }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 3,
                    delay: i * 0.15,
                    ease: "easeOut",
                  }}
                >
                  <FlameSVG size={16 - i * 2} color={i < 2 ? C.fire : C.brick} />
                </motion.div>
              ))}
            </motion.div>

            <motion.h2
              style={{
                fontFamily: manrope(),
                fontSize: "clamp(24px, 4vw, 48px)",
                fontWeight: 800,
                lineHeight: 1.1,
                marginBottom: 16,
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <span
                style={{
                  background: `linear-gradient(90deg, ${C.fire}, ${C.kilnInterior}, ${C.clay})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                FIRED TO PERFECTION
              </span>
            </motion.h2>

            <motion.p
              style={{
                fontFamily: inter(),
                fontSize: 14,
                color: C.boneMuted,
                maxWidth: 400,
                margin: "0 auto",
              }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Every project emerges from the kiln stronger, more beautiful,
              and ready to endure.
            </motion.p>

            {/* Maker's mark stamp */}
            <motion.div
              style={{
                margin: "48px auto 0",
                width: 72,
                height: 72,
                borderRadius: "50%",
                border: `2px solid ${C.clay}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
              initial={{ opacity: 0, rotate: -20 }}
              whileInView={{ opacity: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, type: "spring" }}
            >
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                {/* Stamp design: stylized flame in circle */}
                <circle cx="20" cy="20" r="16" stroke={C.clay} strokeWidth="1" opacity={0.5} />
                <path
                  d="M20,8 Q16,16 15,20 Q14,26 17,30 Q19,33 20,33 Q21,33 23,30 Q26,26 25,20 Q24,16 20,8Z"
                  fill={C.fire}
                  opacity={0.6}
                />
                <path
                  d="M20,14 Q18,18 17.5,21 Q17,25 19,27 Q20,28 20,28 Q20,28 21,27 Q23,25 22.5,21 Q22,18 20,14Z"
                  fill={C.flameYellow}
                  opacity={0.5}
                />
              </svg>
              {/* Stamp text */}
              <div
                style={{
                  position: "absolute",
                  bottom: -20,
                  fontFamily: spaceGrotesk(),
                  fontSize: 7,
                  letterSpacing: "0.3em",
                  color: C.ash,
                  textTransform: "uppercase",
                }}
              >
                Hand Fired
              </div>
            </motion.div>

            {/* Copyright */}
            <p
              style={{
                fontFamily: spaceGrotesk(),
                fontSize: 11,
                color: C.ash,
                marginTop: 48,
                letterSpacing: "0.08em",
              }}
            >
              KILN PORTFOLIO &copy; {new Date().getFullYear()}
            </p>
          </div>

          <BrickBorder side="bottom" />
        </footer>

        {/* Theme Switcher */}
        <ThemeSwitcher current="/kiln" variant="dark" />
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════
   PROJECT CARD COMPONENT
   ═══════════════════════════════════════════════════ */
function ProjectCard({
  project,
  index,
  delay = 0,
}: {
  project: (typeof projects)[number];
  index: number;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });
  const [hovered, setHovered] = useState(false);
  const glazeColor = glazeColors[index % glazeColors.length];

  return (
    <motion.div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className="kiln-card-brick"
      style={{
        background: `linear-gradient(145deg, rgba(26,18,16,0.9) 0%, rgba(139,58,46,0.12) 100%)`,
        border: `1px solid ${hovered ? C.fire : C.borderBrick}`,
        borderRadius: 10,
        padding: 0,
        overflow: "hidden",
        cursor: "pointer",
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
        boxShadow: hovered
          ? `0 0 24px rgba(255,107,53,0.15), inset 0 0 30px rgba(255,107,53,0.03)`
          : "none",
        position: "relative",
      }}
    >
      {/* Glaze color indicator strip */}
      <div
        style={{
          height: 4,
          background: `linear-gradient(90deg, ${glazeColor}, ${glazeColor}88, transparent)`,
          transition: "opacity 0.3s",
          opacity: hovered ? 1 : 0.6,
        }}
      />

      {/* Card content */}
      <div style={{ padding: "20px 20px 24px" }}>
        {/* Top meta row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <span
            style={{
              fontFamily: spaceGrotesk(),
              fontSize: 9,
              letterSpacing: "0.15em",
              color: C.ash,
              textTransform: "uppercase",
            }}
          >
            {project.client}
          </span>
          <span
            style={{
              fontFamily: jetbrains(),
              fontSize: 10,
              color: C.fire,
              opacity: 0.7,
            }}
          >
            {project.year}
          </span>
        </div>

        {/* Project title */}
        <h3
          style={{
            fontFamily: manrope(),
            fontSize: 18,
            fontWeight: 700,
            color: C.bone,
            lineHeight: 1.3,
            marginBottom: 12,
            whiteSpace: "pre-line",
          }}
        >
          {project.title}
        </h3>

        {/* Description */}
        <p
          style={{
            fontFamily: inter(),
            fontSize: 12.5,
            lineHeight: 1.6,
            color: C.boneMuted,
            marginBottom: 16,
          }}
        >
          {project.description}
        </p>

        {/* Technical detail */}
        <p
          style={{
            fontFamily: inter(),
            fontSize: 11.5,
            lineHeight: 1.5,
            color: `rgba(245,240,232,0.35)`,
            marginBottom: 16,
            borderLeft: `2px solid ${C.border}`,
            paddingLeft: 10,
          }}
        >
          {project.technical}
        </p>

        {/* Tech tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
          {project.tech.map((t) => (
            <span
              key={t}
              style={{
                fontFamily: jetbrains(),
                fontSize: 9.5,
                padding: "3px 8px",
                borderRadius: 4,
                background: `rgba(255,107,53,0.08)`,
                border: `1px solid ${C.border}`,
                color: C.clay,
                letterSpacing: "0.03em",
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Pottery shape decoration + GitHub */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <PotteryShape variant={index} size={28} />
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: spaceGrotesk(),
              fontSize: 10,
              color: C.fire,
              textDecoration: "none",
              letterSpacing: "0.08em",
              opacity: hovered ? 1 : 0.6,
              transition: "opacity 0.3s",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill={C.fire}>
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            VIEW
          </a>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   EXPERTISE TILE COMPONENT — Glaze Test Tiles
   ═══════════════════════════════════════════════════ */
function ExpertiseTile({
  item,
  index,
}: {
  item: (typeof expertise)[number];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });
  const [hovered, setHovered] = useState(false);

  const tileStyles = [
    {
      // Matte finish
      bg: `linear-gradient(135deg, #3A5F4A 0%, #2D4A3A 100%)`,
      texture: "none",
      label: "MATTE",
    },
    {
      // Glossy finish
      bg: `linear-gradient(135deg, #4A6FA5 0%, #355080 100%)`,
      texture: `linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)`,
      label: "GLOSS",
    },
    {
      // Crystalline
      bg: `linear-gradient(135deg, #7B4B94 0%, #5A3570 100%)`,
      texture: `radial-gradient(circle at 30% 40%, rgba(255,255,255,0.15) 0%, transparent 20%),
                radial-gradient(circle at 70% 60%, rgba(255,255,255,0.1) 0%, transparent 15%),
                radial-gradient(circle at 50% 20%, rgba(255,255,255,0.12) 0%, transparent 18%)`,
      label: "CRYSTAL",
    },
    {
      // Raku-style (crackle)
      bg: `linear-gradient(135deg, #2A2A2A 0%, #1A1A1A 100%)`,
      texture: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5 5 L25 15 L15 35 L40 25 L55 45 M10 50 L30 40 L50 55' stroke='%23C4A882' stroke-width='0.5' fill='none' opacity='0.3'/%3E%3C/svg%3E")`,
      label: "RAKU",
    },
  ];

  const ts = tileStyles[index % tileStyles.length];

  return (
    <motion.div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: index * 0.12, duration: 0.5 }}
      style={{
        borderRadius: 10,
        overflow: "hidden",
        border: `1px solid ${hovered ? C.clay : C.borderBrick}`,
        transition: "border-color 0.3s, transform 0.3s",
        transform: hovered ? "translateY(-4px)" : "none",
        cursor: "default",
      }}
    >
      {/* Glaze test tile color square */}
      <div
        style={{
          height: 80,
          background: ts.bg,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Texture overlay */}
        {ts.texture !== "none" && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: ts.texture,
            }}
          />
        )}
        {/* Finish label */}
        <div
          style={{
            position: "absolute",
            bottom: 6,
            right: 8,
            fontFamily: spaceGrotesk(),
            fontSize: 8,
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          {ts.label}
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          padding: "20px 18px 22px",
          background: `linear-gradient(180deg, rgba(26,18,16,0.95) 0%, rgba(26,18,16,0.85) 100%)`,
        }}
      >
        <h3
          style={{
            fontFamily: manrope(),
            fontSize: 16,
            fontWeight: 700,
            color: C.bone,
            marginBottom: 10,
            lineHeight: 1.3,
          }}
        >
          {item.title}
        </h3>
        <p
          style={{
            fontFamily: inter(),
            fontSize: 12.5,
            lineHeight: 1.6,
            color: C.boneMuted,
          }}
        >
          {item.body}
        </p>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   TOOL CATEGORY COMPONENT — Desktop (radial)
   ═══════════════════════════════════════════════════ */
function ToolCategory({
  tool,
  index,
  style: posStyle,
  mobileStyle,
}: {
  tool: (typeof tools)[number];
  index: number;
  style: React.CSSProperties;
  mobileStyle: React.CSSProperties;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay: index * 0.08, duration: 0.4, type: "spring" }}
      style={{
        ...posStyle,
        width: 150,
        zIndex: 3,
      }}
      className="max-md:!hidden"
    >
      <div
        style={{
          background: `rgba(26,18,16,0.9)`,
          border: `1px solid ${C.borderBrick}`,
          borderRadius: 10,
          padding: "14px 14px 16px",
          backdropFilter: "blur(8px)",
        }}
      >
        {/* Category label */}
        <div
          style={{
            fontFamily: spaceGrotesk(),
            fontSize: 10,
            letterSpacing: "0.15em",
            color: C.fire,
            textTransform: "uppercase",
            marginBottom: 10,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: C.fire,
              opacity: 0.7,
            }}
          />
          {tool.label}
        </div>
        {/* Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {tool.items.map((item) => (
            <span
              key={item}
              style={{
                fontFamily: jetbrains(),
                fontSize: 10,
                color: C.clay,
                padding: "2px 0",
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   TOOL CATEGORY MOBILE
   ═══════════════════════════════════════════════════ */
function ToolCategoryMobile({
  tool,
  index,
}: {
  tool: (typeof tools)[number];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 15 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      style={{
        background: `rgba(26,18,16,0.9)`,
        border: `1px solid ${C.borderBrick}`,
        borderRadius: 10,
        padding: "14px 14px 16px",
      }}
    >
      <div
        style={{
          fontFamily: spaceGrotesk(),
          fontSize: 10,
          letterSpacing: "0.15em",
          color: C.fire,
          textTransform: "uppercase",
          marginBottom: 10,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: C.fire,
            opacity: 0.7,
          }}
        />
        {tool.label}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {tool.items.map((item) => (
          <span
            key={item}
            style={{
              fontFamily: jetbrains(),
              fontSize: 10,
              color: C.clay,
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
