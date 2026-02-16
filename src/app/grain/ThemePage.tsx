"use client";

import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { motion, useInView } from "motion/react";
import { useRef, useEffect, useState } from "react";

/* ═══════════════════════════════════════════════════════
   GRAIN — Super 8mm Film / Vintage Footage Portfolio
   Kodachrome warmth, projector flicker, sprocket holes,
   light leaks, film burns, countdown leaders.
   ═══════════════════════════════════════════════════════ */

/* ─── Color Constants ─── */
const C = {
  bg: "#1A1510",
  film: "#F5EDE0",
  amber: "#E8A87C",
  orange: "#D4883A",
  magenta: "#C94277",
  leakOrange: "#E87040",
  text: "#F5EDE0",
  dim: "#8A7D6B",
  sprocket: "#2A2520",
  black: "#0D0B09",
};

/* ─── SVG Film Grain Filter ─── */
function FilmGrainOverlay() {
  return (
    <div
      className="grain-overlay"
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "none",
        opacity: 0.1,
        mixBlendMode: "overlay",
      }}
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <filter id="super8grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.2"
            numOctaves="4"
            stitchTiles="stitch"
            seed="42"
          >
            <animate
              attributeName="seed"
              from="0"
              to="100"
              dur="0.8s"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#super8grain)" />
      </svg>
    </div>
  );
}

/* ─── Sprocket Holes ─── */
function SprocketHoles({ side }: { side: "left" | "right" }) {
  const count = 80;
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        [side]: 0,
        width: 32,
        height: "100vh",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        paddingTop: 8,
        background: C.sprocket,
        borderRight: side === "left" ? `1px solid ${C.dim}33` : "none",
        borderLeft: side === "right" ? `1px solid ${C.dim}33` : "none",
        overflow: "hidden",
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 8,
            height: 12,
            borderRadius: 2,
            background: C.bg,
            border: `1px solid ${C.dim}44`,
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Light Leak Overlay ─── */
function LightLeak({
  position,
  color,
  delay = 0,
}: {
  position: "top-right" | "bottom-left" | "center";
  color: string;
  delay?: number;
}) {
  const posStyles: Record<string, React.CSSProperties> = {
    "top-right": {
      top: "-20%",
      right: "-10%",
      width: "60%",
      height: "60%",
    },
    "bottom-left": {
      bottom: "-20%",
      left: "-10%",
      width: "50%",
      height: "50%",
    },
    center: {
      top: "20%",
      left: "30%",
      width: "40%",
      height: "40%",
    },
  };

  return (
    <motion.div
      aria-hidden="true"
      animate={{
        x: [0, 20, -10, 15, 0],
        y: [0, -15, 10, -5, 0],
        opacity: [0.06, 0.1, 0.05, 0.08, 0.06],
      }}
      transition={{
        duration: 40,
        repeat: Infinity,
        ease: "linear",
        delay,
      }}
      style={{
        position: "absolute",
        ...posStyles[position],
        background: `radial-gradient(ellipse at center, ${color}22 0%, transparent 70%)`,
        filter: "blur(60px)",
        pointerEvents: "none",
        zIndex: 2,
      }}
    />
  );
}

/* ─── Film Burn Edge ─── */
function FilmBurn() {
  return (
    <div
      aria-hidden="true"
      style={{
        width: "100%",
        height: 80,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(
            90deg,
            transparent 0%,
            ${C.amber}15 20%,
            ${C.orange}25 35%,
            ${C.leakOrange}30 50%,
            ${C.orange}20 65%,
            ${C.amber}10 80%,
            transparent 100%
          )`,
          filter: "blur(20px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "25%",
          width: "50%",
          height: "40%",
          background: `radial-gradient(ellipse, ${C.film}18 0%, transparent 60%)`,
          filter: "blur(15px)",
        }}
      />
    </div>
  );
}

/* ─── Vignette ─── */
function Vignette() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        background:
          "radial-gradient(ellipse at center, transparent 50%, rgba(13,11,9,0.6) 100%)",
        zIndex: 3,
      }}
    />
  );
}

/* ─── Reel Change Marker ─── */
function ReelChangeMarker() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ duration: 2, repeat: Infinity, repeatDelay: 8 }}
      aria-hidden="true"
      style={{
        position: "absolute",
        top: 24,
        right: 24,
        width: 14,
        height: 14,
        borderRadius: "50%",
        background: C.film,
        zIndex: 5,
      }}
    />
  );
}

/* ─── Countdown Leader ─── */
function CountdownLeader() {
  const [count, setCount] = useState(5);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (count <= 0) {
      const t = setTimeout(() => setVisible(false), 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCount((c) => c - 1), 700);
    return () => clearTimeout(t);
  }, [count]);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: count <= 0 ? 0 : 1 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        background: C.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {count > 0 && (
        <div style={{ position: "relative", width: 240, height: 240 }}>
          {/* Circle */}
          <svg width="240" height="240" viewBox="0 0 240 240">
            <circle
              cx="120"
              cy="120"
              r="100"
              fill="none"
              stroke={C.film}
              strokeWidth="2"
              opacity="0.6"
            />
            {/* Crosshairs */}
            <line
              x1="120"
              y1="10"
              x2="120"
              y2="230"
              stroke={C.film}
              strokeWidth="1"
              opacity="0.3"
            />
            <line
              x1="10"
              y1="120"
              x2="230"
              y2="120"
              stroke={C.film}
              strokeWidth="1"
              opacity="0.3"
            />
            {/* Sweep arc */}
            <motion.circle
              cx="120"
              cy="120"
              r="100"
              fill="none"
              stroke={C.amber}
              strokeWidth="3"
              strokeDasharray="628"
              initial={{ strokeDashoffset: 628 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 0.65, ease: "linear" }}
              key={count}
              opacity="0.5"
            />
          </svg>
          {/* Number */}
          <motion.div
            key={count}
            initial={{ scale: 1.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-instrument)",
              fontStyle: "italic",
              fontSize: 96,
              color: C.film,
              lineHeight: 1,
            }}
          >
            {count}
          </motion.div>
          {/* Frame text */}
          <div
            style={{
              position: "absolute",
              bottom: -30,
              width: "100%",
              textAlign: "center",
              fontFamily: "var(--font-jetbrains)",
              fontSize: 10,
              color: C.dim,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            KODAK SAFETY FILM 5247
          </div>
        </div>
      )}
    </motion.div>
  );
}

/* ─── Section Wrapper with Vignette ─── */
function FilmSection({
  children,
  id,
  className = "",
}: {
  children: React.ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={className}
      style={{ position: "relative", overflow: "hidden" }}
    >
      <Vignette />
      <div style={{ position: "relative", zIndex: 4 }}>{children}</div>
    </section>
  );
}

/* ─── Film Frame Project Card ─── */
function FilmFrameCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const frameNum = String(index + 1).padStart(3, "0");
  const leakSide = index % 2 === 0 ? "left" : "right";
  const title = project.title.replace("\n", " ");

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={
        isInView
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: 40 }
      }
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        position: "relative",
        border: `2px solid ${C.black}`,
        borderRadius: 8,
        background: C.black,
        overflow: "hidden",
        marginBottom: 48,
      }}
    >
      {/* Film edge data — top */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "6px 16px",
          fontFamily: "var(--font-jetbrains)",
          fontSize: 9,
          color: C.dim,
          letterSpacing: 2,
          textTransform: "uppercase",
          borderBottom: `1px solid ${C.sprocket}`,
          background: `linear-gradient(90deg, ${C.sprocket} 0%, ${C.black} 100%)`,
        }}
      >
        <span>KODAK 5247 &bull; SAFETY FILM</span>
        <span>
          FR-{frameNum} &bull; {project.year}
        </span>
      </div>

      {/* Frame content */}
      <div
        className="film-card-inner"
        style={{
          position: "relative",
          padding: "32px 28px",
          background: `linear-gradient(135deg, ${C.bg} 0%, #1E1812 100%)`,
          borderRadius: "0 0 6px 6px",
          overflow: "hidden",
          transition: "background 0.6s ease",
        }}
      >
        {/* Light leak accent */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            [leakSide]: -30,
            top: -30,
            width: 200,
            height: 200,
            background: `radial-gradient(circle, ${
              index % 3 === 0
                ? C.magenta
                : index % 3 === 1
                ? C.leakOrange
                : C.amber
            }15 0%, transparent 70%)`,
            filter: "blur(40px)",
            pointerEvents: "none",
          }}
        />

        {/* Frame number large */}
        <div
          style={{
            position: "absolute",
            top: 16,
            right: 20,
            fontFamily: "var(--font-jetbrains)",
            fontSize: 11,
            color: C.dim,
            opacity: 0.5,
          }}
        >
          FR-{frameNum}
        </div>

        {/* Client & Year */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: 10,
              color: C.amber,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            {project.client}
          </span>
          <span
            style={{
              width: 3,
              height: 3,
              borderRadius: "50%",
              background: C.dim,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: 10,
              color: C.dim,
              letterSpacing: 1,
            }}
          >
            {project.year}
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily: "var(--font-instrument)",
            fontStyle: "italic",
            fontSize: "clamp(26px, 4vw, 36px)",
            color: C.film,
            lineHeight: 1.15,
            marginBottom: 16,
          }}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: 14,
            lineHeight: 1.7,
            color: `${C.film}cc`,
            marginBottom: 16,
            maxWidth: 640,
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
            color: C.dim,
            marginBottom: 20,
            maxWidth: 640,
          }}
        >
          {project.technical}
        </p>

        {/* Tech stack */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            marginBottom: 16,
          }}
        >
          {project.tech.map((t) => (
            <span
              key={t}
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: 10,
                color: C.amber,
                padding: "4px 10px",
                border: `1px solid ${C.amber}33`,
                borderRadius: 3,
                background: `${C.amber}08`,
                letterSpacing: 0.5,
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* GitHub */}
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "var(--font-jetbrains)",
            fontSize: 11,
            color: C.orange,
            textDecoration: "none",
            letterSpacing: 1,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            opacity: 0.8,
            transition: "opacity 0.3s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.opacity = "1")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.opacity = "0.8")
          }
        >
          VIEW SOURCE
          <span style={{ fontSize: 14 }}>&#8599;</span>
        </a>
      </div>

      {/* Film edge data — bottom */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "4px 16px",
          fontFamily: "var(--font-jetbrains)",
          fontSize: 8,
          color: `${C.dim}88`,
          letterSpacing: 2,
          borderTop: `1px solid ${C.sprocket}`,
          background: C.black,
        }}
      >
        <span>
          &#9654; {frameNum}A
        </span>
        <span>
          TUNGSTEN &bull; ISO 200
        </span>
      </div>
    </motion.div>
  );
}

/* ─── Expertise Card ─── */
function ExpertiseCard({
  item,
  index,
}: {
  item: (typeof expertise)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.7, delay: index * 0.1 }}
      style={{
        border: `1px solid ${C.dim}22`,
        borderRadius: 6,
        padding: "28px 24px",
        background: `linear-gradient(135deg, ${C.sprocket}80 0%, ${C.bg} 100%)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Small light leak */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: -20,
          right: -20,
          width: 100,
          height: 100,
          background: `radial-gradient(circle, ${
            index % 2 === 0 ? C.amber : C.magenta
          }10 0%, transparent 70%)`,
          filter: "blur(30px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          fontFamily: "var(--font-jetbrains)",
          fontSize: 9,
          color: C.orange,
          letterSpacing: 3,
          marginBottom: 12,
          textTransform: "uppercase",
        }}
      >
        REEL {String(index + 1).padStart(2, "0")}
      </div>
      <h3
        style={{
          fontFamily: "var(--font-instrument)",
          fontStyle: "italic",
          fontSize: 22,
          color: C.film,
          marginBottom: 12,
          lineHeight: 1.2,
        }}
      >
        {item.title}
      </h3>
      <p
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: 13,
          lineHeight: 1.7,
          color: `${C.film}aa`,
        }}
      >
        {item.body}
      </p>
    </motion.div>
  );
}

/* ─── Animated Section Header ─── */
function SectionHeader({
  label,
  title,
}: {
  label: string;
  title: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6 }}
      style={{ marginBottom: 48 }}
    >
      <div
        style={{
          fontFamily: "var(--font-jetbrains)",
          fontSize: 10,
          color: C.orange,
          letterSpacing: 4,
          textTransform: "uppercase",
          marginBottom: 12,
        }}
      >
        {label}
      </div>
      <h2
        style={{
          fontFamily: "var(--font-instrument)",
          fontStyle: "italic",
          fontSize: "clamp(32px, 5vw, 52px)",
          color: C.film,
          lineHeight: 1.1,
        }}
      >
        {title}
      </h2>
      <div
        style={{
          width: 60,
          height: 1,
          background: `linear-gradient(90deg, ${C.amber}, transparent)`,
          marginTop: 16,
        }}
      />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════ */

export default function GrainPage() {
  const [showCountdown, setShowCountdown] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowCountdown(false), 4200);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* ─── Global Styles ─── */}
      <style>{`
        /* Projector Flicker */
        @keyframes projectorFlicker {
          0%, 100% { opacity: 1; }
          10% { opacity: 0.98; }
          20% { opacity: 1; }
          30% { opacity: 0.97; }
          40% { opacity: 1; }
          55% { opacity: 0.985; }
          65% { opacity: 1; }
          75% { opacity: 0.975; }
          82% { opacity: 1; }
          90% { opacity: 0.99; }
        }

        /* Film gate glow on hover for cards */
        .film-card-inner:hover {
          background: linear-gradient(135deg, #1E1812 0%, #231C14 100%) !important;
        }

        /* Light leak drift animation */
        @keyframes leakDrift {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(20px, -15px); }
          50% { transform: translate(-10px, 10px); }
          75% { transform: translate(15px, -5px); }
        }

        /* Scrollbar styling */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: ${C.bg};
        }
        ::-webkit-scrollbar-thumb {
          background: ${C.dim}44;
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: ${C.dim}88;
        }

        /* Responsive sprocket holes */
        @media (max-width: 768px) {
          .sprocket-left, .sprocket-right {
            display: none !important;
          }
          .film-gate {
            margin-left: 0 !important;
            margin-right: 0 !important;
            padding-left: 20px !important;
            padding-right: 20px !important;
          }
        }

        @media (min-width: 769px) {
          .film-gate {
            margin-left: 32px !important;
            margin-right: 32px !important;
          }
        }
      `}</style>

      {/* ─── Countdown Leader ─── */}
      {showCountdown && <CountdownLeader />}

      {/* ─── Film Grain Overlay (Heavy) ─── */}
      <FilmGrainOverlay />

      {/* ─── Sprocket Holes ─── */}
      <div className="sprocket-left">
        <SprocketHoles side="left" />
      </div>
      <div className="sprocket-right">
        <SprocketHoles side="right" />
      </div>

      {/* ─── Main Page Container ─── */}
      <div
        style={{
          minHeight: "100vh",
          background: C.bg,
          color: C.text,
          animation: "projectorFlicker 4s ease-in-out infinite",
          position: "relative",
        }}
      >
        {/* Global Light Leaks */}
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          {/* Orange leak top-right */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "40%",
              height: "30%",
              background: `linear-gradient(225deg, ${C.leakOrange}12 0%, transparent 60%)`,
              filter: "blur(40px)",
              animation: "leakDrift 40s ease-in-out infinite",
            }}
          />
          {/* Magenta leak bottom-left */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "35%",
              height: "25%",
              background: `linear-gradient(45deg, ${C.magenta}10 0%, transparent 60%)`,
              filter: "blur(40px)",
              animation: "leakDrift 40s ease-in-out infinite reverse",
            }}
          />
        </div>

        {/* ═══════════════════════ HERO ═══════════════════════ */}
        <FilmSection id="hero">
          <div
            className="film-gate"
            style={{
              maxWidth: 1000,
              margin: "0 auto",
              padding: "0 32px",
            }}
          >
            {/* Film edge top */}
            <div
              style={{
                padding: "12px 0",
                borderBottom: `1px solid ${C.dim}22`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontFamily: "var(--font-jetbrains)",
                fontSize: 9,
                color: C.dim,
                letterSpacing: 3,
              }}
            >
              <span>KODAK EASTMAN 5247</span>
              <span>SUPER 8MM &bull; 18FPS</span>
            </div>

            {/* Hero Content */}
            <div
              style={{
                paddingTop: "clamp(80px, 15vh, 160px)",
                paddingBottom: "clamp(60px, 10vh, 120px)",
                position: "relative",
              }}
            >
              <LightLeak
                position="top-right"
                color={C.leakOrange}
                delay={0}
              />
              <LightLeak
                position="bottom-left"
                color={C.magenta}
                delay={10}
              />

              {/* Reel Change Marker */}
              <ReelChangeMarker />

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: showCountdown ? 4.2 : 0.2 }}
              >
                {/* Film data label */}
                <div
                  style={{
                    fontFamily: "var(--font-jetbrains)",
                    fontSize: 10,
                    color: C.orange,
                    letterSpacing: 4,
                    textTransform: "uppercase",
                    marginBottom: 24,
                  }}
                >
                  REEL 01 &mdash; TITLE SEQUENCE
                </div>

                {/* Main Title */}
                <h1
                  style={{
                    fontFamily: "var(--font-instrument)",
                    fontStyle: "italic",
                    fontSize: "clamp(48px, 8vw, 96px)",
                    color: C.film,
                    lineHeight: 1.0,
                    marginBottom: 24,
                    maxWidth: 800,
                  }}
                >
                  Moving Pictures,{" "}
                  <span style={{ color: C.amber }}>Built with AI</span>
                </h1>

                {/* Subtitle */}
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "clamp(16px, 2vw, 20px)",
                    color: `${C.film}bb`,
                    lineHeight: 1.6,
                    maxWidth: 560,
                    marginBottom: 48,
                  }}
                >
                  A collection of AI-powered products &mdash; from computer
                  vision to multi-model orchestration. Each frame tells a story
                  of intelligent design.
                </p>

                {/* Stats Bar */}
                <div
                  style={{
                    display: "flex",
                    gap: "clamp(24px, 5vw, 56px)",
                    flexWrap: "wrap",
                  }}
                >
                  {stats.map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: (showCountdown ? 4.4 : 0.4) + i * 0.15,
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "var(--font-instrument)",
                          fontStyle: "italic",
                          fontSize: "clamp(36px, 5vw, 56px)",
                          color: C.amber,
                          lineHeight: 1,
                          marginBottom: 4,
                        }}
                      >
                        {stat.value}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-jetbrains)",
                          fontSize: 10,
                          color: C.dim,
                          letterSpacing: 2,
                          textTransform: "uppercase",
                        }}
                      >
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </FilmSection>

        {/* ─── Film Burn Transition ─── */}
        <FilmBurn />

        {/* ═══════════════════════ PROJECTS ═══════════════════════ */}
        <FilmSection id="projects">
          <div
            className="film-gate"
            style={{
              maxWidth: 1000,
              margin: "0 auto",
              padding: "0 32px",
              paddingTop: 64,
              paddingBottom: 64,
            }}
          >
            <ReelChangeMarker />
            <SectionHeader
              label="REEL 02 &mdash; FEATURED WORK"
              title="The Dailies"
            />

            {/* Film strip indicator */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 40,
                fontFamily: "var(--font-jetbrains)",
                fontSize: 9,
                color: C.dim,
                letterSpacing: 2,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: C.amber,
                  opacity: 0.6,
                }}
              />
              <span>{projects.length} FRAMES &bull; COMPLETE REEL</span>
            </div>

            {/* Project Cards */}
            {projects.map((project, i) => (
              <FilmFrameCard key={project.title} project={project} index={i} />
            ))}
          </div>
        </FilmSection>

        {/* ─── Film Burn Transition ─── */}
        <FilmBurn />

        {/* ═══════════════════════ EXPERTISE ═══════════════════════ */}
        <FilmSection id="expertise">
          <div
            className="film-gate"
            style={{
              maxWidth: 1000,
              margin: "0 auto",
              padding: "0 32px",
              paddingTop: 64,
              paddingBottom: 64,
            }}
          >
            <ReelChangeMarker />
            <SectionHeader
              label="REEL 03 &mdash; CAPABILITIES"
              title="Behind the Lens"
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 20,
              }}
            >
              {expertise.map((item, i) => (
                <ExpertiseCard key={item.title} item={item} index={i} />
              ))}
            </div>
          </div>
        </FilmSection>

        {/* ─── Film Burn Transition ─── */}
        <FilmBurn />

        {/* ═══════════════════════ TOOLS ═══════════════════════ */}
        <FilmSection id="tools">
          <div
            className="film-gate"
            style={{
              maxWidth: 1000,
              margin: "0 auto",
              padding: "0 32px",
              paddingTop: 64,
              paddingBottom: 64,
            }}
          >
            <ReelChangeMarker />
            <SectionHeader
              label="REEL 04 &mdash; EQUIPMENT"
              title="The Kit"
            />

            <ToolsSection />
          </div>
        </FilmSection>

        {/* ─── Film Burn Transition ─── */}
        <FilmBurn />

        {/* ═══════════════════════ FOOTER ═══════════════════════ */}
        <FooterSection />

        {/* ─── Theme Switcher ─── */}
        <ThemeSwitcher current="/grain" />
      </div>
    </>
  );
}

/* ─── Tools Section ─── */
function ToolsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.7 }}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: 24,
      }}
    >
      {tools.map((category, catIdx) => (
        <div
          key={category.label}
          style={{
            border: `1px solid ${C.dim}18`,
            borderRadius: 6,
            padding: 24,
            background: `${C.sprocket}60`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle corner light leak */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: -40,
              right: -40,
              width: 80,
              height: 80,
              background: `radial-gradient(circle, ${C.amber}0C 0%, transparent 70%)`,
              filter: "blur(20px)",
              pointerEvents: "none",
            }}
          />

          {/* Category label */}
          <div
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: 9,
              color: C.orange,
              letterSpacing: 3,
              textTransform: "uppercase",
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: C.amber,
              }}
            />
            {category.label}
          </div>

          {/* Items */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {category.items.map((item, itemIdx) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -10 }}
                animate={
                  isInView
                    ? { opacity: 1, x: 0 }
                    : { opacity: 0, x: -10 }
                }
                transition={{
                  duration: 0.4,
                  delay: catIdx * 0.1 + itemIdx * 0.05,
                }}
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: 13,
                  color: `${C.film}cc`,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    width: 16,
                    height: 1,
                    background: `${C.dim}44`,
                    flexShrink: 0,
                  }}
                />
                {item}
              </motion.div>
            ))}
          </div>

          {/* Film frame number */}
          <div
            style={{
              position: "absolute",
              bottom: 8,
              right: 12,
              fontFamily: "var(--font-jetbrains)",
              fontSize: 8,
              color: `${C.dim}55`,
              letterSpacing: 1,
            }}
          >
            T-{String(catIdx + 1).padStart(2, "0")}
          </div>
        </div>
      ))}
    </motion.div>
  );
}

/* ─── Footer Section ─── */
function FooterSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <footer
      ref={ref}
      style={{
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Vignette />
      <div
        className="film-gate"
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          padding: "0 32px",
          paddingTop: 80,
          paddingBottom: 120,
          position: "relative",
          zIndex: 4,
        }}
      >
        {/* Reel end marker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: "center" }}
        >
          {/* End leader circles */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 12,
              marginBottom: 40,
            }}
          >
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : { scale: 0 }}
                transition={{ duration: 0.4, delay: i * 0.15 }}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  border: `1px solid ${C.dim}66`,
                  background: i === 2 ? C.amber : "transparent",
                }}
              />
            ))}
          </div>

          {/* End title */}
          <div
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: 10,
              color: C.orange,
              letterSpacing: 4,
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            REEL 05 &mdash; END TITLES
          </div>

          <h2
            style={{
              fontFamily: "var(--font-instrument)",
              fontStyle: "italic",
              fontSize: "clamp(28px, 5vw, 48px)",
              color: C.film,
              lineHeight: 1.1,
              marginBottom: 24,
            }}
          >
            Fin
          </h2>

          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: 15,
              color: `${C.film}99`,
              lineHeight: 1.7,
              maxWidth: 480,
              margin: "0 auto 40px",
            }}
          >
            Every project is a new reel. Let&apos;s create something worth
            watching together.
          </p>

          {/* Contact */}
          <motion.a
            href="mailto:hello@grox.studio"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: "inline-block",
              fontFamily: "var(--font-jetbrains)",
              fontSize: 12,
              color: C.bg,
              background: C.amber,
              padding: "14px 36px",
              borderRadius: 4,
              textDecoration: "none",
              letterSpacing: 2,
              textTransform: "uppercase",
              transition: "background 0.3s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = C.orange)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = C.amber)
            }
          >
            START A NEW REEL
          </motion.a>

          {/* Film leader end marks */}
          <div
            style={{
              marginTop: 64,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: 9,
                color: `${C.dim}66`,
                letterSpacing: 3,
              }}
            >
              PROCESSED BY GROX LABORATORIES
            </div>
            <div
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: 8,
                color: `${C.dim}44`,
                letterSpacing: 2,
              }}
            >
              KODACHROME II &bull; TYPE A &bull; DAYLIGHT
            </div>
            <div
              style={{
                display: "flex",
                gap: 16,
                marginTop: 16,
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 1,
                  background: `${C.dim}33`,
                }}
              />
              <div
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  fontSize: 8,
                  color: `${C.dim}44`,
                  letterSpacing: 2,
                }}
              >
                END OF REEL
              </div>
              <div
                style={{
                  width: 40,
                  height: 1,
                  background: `${C.dim}33`,
                }}
              />
            </div>

            {/* Tail leader stripes */}
            <div
              style={{
                display: "flex",
                gap: 4,
                marginTop: 20,
              }}
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 3,
                    height: 16,
                    background:
                      i % 2 === 0
                        ? `${C.amber}33`
                        : `${C.orange}22`,
                    borderRadius: 1,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
