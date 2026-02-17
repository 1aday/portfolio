"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "@/app/data/projects";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";

/* ─── palette ─── */
const C = {
  cork: "#8B6F47",
  corkLight: "#A0845C",
  corkDark: "#6B5234",
  polaroid: "#FFFFFF",
  polaroidShadow: "rgba(0,0,0,0.25)",
  string: "#E74C3C",
  pin: "#F1C40F",
  pinShadow: "#C19A09",
  tack: "#4A90D9",
  tackDark: "#356BAA",
  developing: "#D5D0C8",
  marker: "#1A1A1A",
  handwriting: "#333333",
  tape: "rgba(255,255,255,0.35)",
  paperClip: "#AAAAAA",
};

/* ─── random rotations for scattered layout ─── */
const rotations = [
  -2.8, 1.5, -1.2, 3.0, -0.8, 2.2, -3.0, 1.0, -1.8, 2.5,
];
const pinColors = [
  C.pin, C.tack, C.string, C.pin, C.tack, C.pin, C.string, C.tack, C.pin, C.tack,
];

/* ═══════════════════════════════════════════
   SVG COMPONENTS
   ═══════════════════════════════════════════ */

/* ─── Push Pin SVG with 3D shading ─── */
function PushPin({
  color = C.pin,
  size = 28,
  style,
}: {
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}) {
  const dark =
    color === C.pin ? C.pinShadow : color === C.tack ? C.tackDark : "#A83229";
  return (
    <svg
      width={size}
      height={size * 1.3}
      viewBox="0 0 28 36"
      fill="none"
      style={style}
    >
      {/* Pin shadow */}
      <ellipse cx="14" cy="33" rx="6" ry="2.5" fill="rgba(0,0,0,0.18)" />
      {/* Pin needle */}
      <line
        x1="14"
        y1="18"
        x2="14"
        y2="34"
        stroke="#888"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Pin head - 3D dome */}
      <circle cx="14" cy="12" r="10" fill={color} />
      <circle cx="14" cy="12" r="10" fill="url(#pinGrad)" />
      {/* Highlight */}
      <ellipse cx="11" cy="9" rx="4" ry="3" fill="rgba(255,255,255,0.35)" />
      {/* Rim */}
      <circle
        cx="14"
        cy="12"
        r="9.5"
        stroke={dark}
        strokeWidth="0.8"
        fill="none"
      />
      <defs>
        <radialGradient id="pinGrad" cx="0.4" cy="0.35" r="0.65">
          <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.15)" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/* ─── Tape Strip SVG ─── */
function TapeStrip({
  width = 60,
  rotation = -5,
  style,
}: {
  width?: number;
  rotation?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        width,
        height: 18,
        background:
          "linear-gradient(180deg, rgba(255,255,220,0.45) 0%, rgba(255,255,200,0.3) 100%)",
        border: "1px solid rgba(200,190,150,0.25)",
        borderRadius: 1,
        transform: `rotate(${rotation}deg)`,
        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
        ...style,
      }}
    />
  );
}

/* ─── Paper Clip SVG ─── */
function PaperClip({ style }: { style?: React.CSSProperties }) {
  return (
    <svg
      width="16"
      height="40"
      viewBox="0 0 16 40"
      fill="none"
      style={style}
    >
      <path
        d="M4 2 C4 2 12 2 12 8 L12 30 C12 34 8 36 6 36 C4 36 2 34 2 30 L2 12 C2 10 4 8 6 8 C8 8 10 10 10 12 L10 26"
        stroke={C.paperClip}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ─── String Connection SVG (between polaroids) ─── */
function StringLine({
  x1,
  y1,
  x2,
  y2,
  delay = 0,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  delay?: number;
}) {
  const midX = (x1 + x2) / 2;
  const sag = Math.abs(x2 - x1) * 0.15 + 20;
  const midY = Math.max(y1, y2) + sag;
  return (
    <motion.path
      d={`M${x1},${y1} Q${midX},${midY} ${x2},${y2}`}
      stroke={C.string}
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.7 }}
      transition={{ duration: 1.5, delay, ease: "easeInOut" }}
    />
  );
}

/* ═══════════════════════════════════════════
   POLAROID COMPONENTS
   ═══════════════════════════════════════════ */

/* ─── Developing Polaroid (fade from white → sepia → full color) ─── */
function DevelopingPolaroid({
  children,
  rotation = 0,
  pinColor = C.pin,
  caption,
  delay = 0,
  width = 280,
  className = "",
  style,
}: {
  children: React.ReactNode;
  rotation?: number;
  pinColor?: string;
  caption?: string;
  delay?: number;
  width?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{
        width,
        transform: `rotate(${rotation}deg)`,
        ...style,
      }}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={
        inView
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 30, scale: 0.9 }
      }
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{
        rotate: rotation + (rotation > 0 ? -1 : 1),
        scale: 1.03,
        transition: { duration: 0.3 },
      }}
    >
      {/* Push pin */}
      <div
        className="absolute z-20"
        style={{ top: -14, left: "50%", transform: "translateX(-50%)" }}
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : { y: -20, opacity: 0 }}
          transition={{
            duration: 0.4,
            delay: delay + 0.3,
            type: "spring",
            stiffness: 300,
            damping: 15,
          }}
        >
          <PushPin color={pinColor} />
        </motion.div>
      </div>

      {/* Polaroid frame */}
      <div
        className="relative"
        style={{
          background: C.polaroid,
          padding: "12px 12px 48px 12px",
          boxShadow: `3px 4px 12px ${C.polaroidShadow}, 0 1px 3px rgba(0,0,0,0.12)`,
          borderRadius: 2,
        }}
      >
        {/* Photo area with developing animation */}
        <motion.div
          className="relative overflow-hidden"
          style={{
            aspectRatio: "4/3",
            background: C.developing,
            borderRadius: 1,
          }}
          initial={{ filter: "saturate(0) brightness(1.6)" }}
          animate={
            inView
              ? { filter: "saturate(1) brightness(1)" }
              : { filter: "saturate(0) brightness(1.6)" }
          }
          transition={{ duration: 2.5, delay: delay + 0.5, ease: "easeOut" }}
        >
          {children}
        </motion.div>

        {/* Caption area */}
        {caption && (
          <div
            className="absolute bottom-2 left-0 right-0 text-center"
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontSize: 13,
              color: C.handwriting,
              letterSpacing: "0.02em",
              paddingTop: 6,
            }}
          >
            {caption}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Project Polaroid ─── */
function ProjectPolaroid({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const rot = rotations[index % rotations.length];
  const pin = pinColors[index % pinColors.length];
  const title = project.title.replace("\n", " ");

  return (
    <motion.div
      ref={ref}
      className="relative"
      style={{ maxWidth: 340 }}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{
        duration: 0.7,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <DevelopingPolaroid
        rotation={rot}
        pinColor={pin}
        caption={`${title} — ${project.year}`}
        delay={index * 0.06}
        width={320}
      >
        {/* Photo content: project visualization */}
        <div
          className="w-full h-full flex flex-col justify-between p-4"
          style={{
            background: `linear-gradient(135deg, ${
              index % 2 === 0 ? "#2C3E50" : "#34495E"
            } 0%, ${index % 2 === 0 ? "#3498DB" : "#2980B9"} 100%)`,
            minHeight: 180,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: 9,
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.1em",
            }}
          >
            {project.client} / {project.year}
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontSize: 18,
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1.2,
                marginBottom: 8,
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.5,
                fontFamily: "var(--font-inter), sans-serif",
              }}
            >
              {project.description.slice(0, 100)}...
            </div>
          </div>
          {/* Tech tags */}
          <div className="flex flex-wrap gap-1 mt-2">
            {project.tech.map((t) => (
              <span
                key={t}
                style={{
                  fontSize: 9,
                  padding: "2px 6px",
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: 2,
                  color: "rgba(255,255,255,0.8)",
                  fontFamily: "var(--font-jetbrains), monospace",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </DevelopingPolaroid>

      {/* Description card below polaroid */}
      <motion.div
        className="relative mt-2"
        style={{
          marginLeft: 10,
          marginRight: 10,
          padding: "10px 14px",
          background: "#FFFEF5",
          border: "1px solid rgba(139,111,71,0.2)",
          borderRadius: 2,
          transform: `rotate(${-rot * 0.3}deg)`,
          boxShadow: "1px 2px 6px rgba(0,0,0,0.08)",
        }}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: index * 0.08 + 0.4 }}
      >
        <p
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 12,
            color: "#4A3B2A",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {project.technical}
        </p>
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              marginTop: 6,
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: 10,
              color: C.tack,
              textDecoration: "none",
              borderBottom: `1px dashed ${C.tack}`,
            }}
          >
            view source &rarr;
          </a>
        )}
      </motion.div>

      {/* Random tape strip decoration */}
      {index % 3 === 0 && (
        <div className="absolute" style={{ top: 8, right: -8, zIndex: 15 }}>
          <TapeStrip width={50} rotation={15} />
        </div>
      )}
      {index % 4 === 1 && (
        <div className="absolute" style={{ top: -4, left: 10, zIndex: 15 }}>
          <PaperClip />
        </div>
      )}
    </motion.div>
  );
}

/* ─── Stat Polaroid ─── */
function StatPolaroid({
  stat,
  index,
  delay,
}: {
  stat: (typeof stats)[number];
  index: number;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const rot = [-2, 1.5, -1][index % 3];

  return (
    <motion.div
      ref={ref}
      className="relative"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.6, delay }}
    >
      <DevelopingPolaroid rotation={rot} pinColor={C.tack} delay={delay} width={160}>
        <div
          className="w-full h-full flex flex-col items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, #F5F0E8 0%, #EDE5D8 100%)",
            minHeight: 100,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontSize: 36,
              fontWeight: 700,
              color: C.tack,
              lineHeight: 1,
            }}
          >
            {stat.value}
          </div>
          <div
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 12,
              color: C.handwriting,
              marginTop: 4,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            {stat.label}
          </div>
        </div>
      </DevelopingPolaroid>
    </motion.div>
  );
}

/* ─── Expertise Polaroid ─── */
function ExpertisePolaroid({
  item,
  index,
}: {
  item: (typeof expertise)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const rot = [-1.5, 2, -2.5, 1][index % 4];
  const pin = [C.pin, C.tack, C.string, C.pin][index % 4];
  const bgColors = ["#ECE4D8", "#E8DFD1", "#F0E8DC", "#E5DCD0"];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay: index * 0.12 }}
    >
      <DevelopingPolaroid
        rotation={rot}
        pinColor={pin}
        delay={index * 0.1}
        width={280}
      >
        <div
          className="w-full h-full flex flex-col justify-center p-5"
          style={{
            background: bgColors[index % 4],
            minHeight: 180,
          }}
        >
          {/* Icon doodle */}
          <div style={{ fontSize: 28, marginBottom: 8 }}>
            {["🔗", "👁", "🎬", "⚡"][index]}
          </div>
          <div
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontSize: 16,
              fontWeight: 700,
              color: "#2C1810",
              marginBottom: 6,
              lineHeight: 1.3,
            }}
          >
            {item.title}
          </div>
          <div
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 12,
              color: "#5A4535",
              lineHeight: 1.6,
            }}
          >
            {item.body}
          </div>
        </div>
      </DevelopingPolaroid>

      {/* Handwritten label below */}
      <motion.div
        className="text-center mt-3"
        style={{
          fontFamily: "var(--font-playfair), serif",
          fontSize: 14,
          color: C.handwriting,
          fontStyle: "italic",
          transform: `rotate(${-rot * 0.5}deg)`,
        }}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 0.8 } : { opacity: 0 }}
        transition={{ delay: index * 0.12 + 0.5 }}
      >
        {item.title}
      </motion.div>
    </motion.div>
  );
}

/* ─── Tools Index Card ─── */
function ToolCard({
  tool,
  index,
}: {
  tool: (typeof tools)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const rot = [1, -1.5, 0.8, -0.5, 1.2, -1][index % 6];
  const pin = [C.pin, C.tack, C.string, C.pin, C.tack, C.string][index % 6];
  const lineColors = ["#D4A574", "#A0845C", "#C4956A", "#B8906A", "#D4A574", "#A0845C"];

  return (
    <motion.div
      ref={ref}
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{
        rotate: rot + (rot > 0 ? -0.5 : 0.5),
        y: -4,
        transition: { duration: 0.2 },
      }}
    >
      {/* Pin at top */}
      <div
        className="absolute z-10"
        style={{ top: -12, left: "50%", transform: "translateX(-50%)" }}
      >
        <motion.div
          initial={{ y: -15, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : { y: -15, opacity: 0 }}
          transition={{
            duration: 0.3,
            delay: index * 0.1 + 0.2,
            type: "spring",
            stiffness: 400,
            damping: 20,
          }}
        >
          <PushPin color={pin} size={22} />
        </motion.div>
      </div>

      {/* Index card */}
      <div
        style={{
          background: "#FFFEF5",
          padding: "20px 18px 16px",
          borderRadius: 2,
          transform: `rotate(${rot}deg)`,
          boxShadow: "2px 3px 8px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)",
          borderTop: `3px solid ${lineColors[index % 6]}`,
          minHeight: 140,
        }}
      >
        {/* Ruled lines background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `repeating-linear-gradient(
              180deg,
              transparent 0px,
              transparent 23px,
              #D4C5A9 23px,
              #D4C5A9 24px
            )`,
            opacity: 0.3,
            borderRadius: 2,
          }}
        />

        {/* Category label */}
        <div
          style={{
            fontFamily: "var(--font-space-grotesk), sans-serif",
            fontSize: 13,
            fontWeight: 700,
            color: "#4A3B2A",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: 10,
            borderBottom: `1px solid rgba(139,111,71,0.2)`,
            paddingBottom: 6,
            position: "relative",
          }}
        >
          {tool.label}
        </div>

        {/* Items */}
        <div className="flex flex-wrap gap-x-2 gap-y-1 relative">
          {tool.items.map((item, i) => (
            <motion.span
              key={item}
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: 11,
                color: "#5A4A3A",
                padding: "2px 0",
              }}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: index * 0.1 + i * 0.05 + 0.3 }}
            >
              {item}
              {i < tool.items.length - 1 && (
                <span style={{ color: C.tack, margin: "0 2px" }}> / </span>
              )}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Cork Board Texture Background ─── */
function CorkBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        background: `
          radial-gradient(ellipse 2px 2px at 20px 20px, rgba(160,132,92,0.4) 0%, transparent 100%),
          radial-gradient(ellipse 1.5px 1.5px at 40px 10px, rgba(107,82,52,0.3) 0%, transparent 100%),
          radial-gradient(ellipse 2px 1px at 15px 35px, rgba(180,150,100,0.25) 0%, transparent 100%),
          radial-gradient(ellipse 1px 2px at 50px 30px, rgba(139,111,71,0.35) 0%, transparent 100%),
          radial-gradient(ellipse 3px 2px at 5px 5px, rgba(120,95,60,0.2) 0%, transparent 100%)
        `,
        backgroundSize: "60px 45px, 70px 50px, 55px 40px, 65px 55px, 50px 35px",
        zIndex: 0,
      }}
    />
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */

export default function PolaroidTheme() {
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true });
  const projectsRef = useRef<HTMLDivElement>(null);
  const projectsInView = useInView(projectsRef, { once: true, margin: "-100px" });
  const toolsRef = useRef<HTMLDivElement>(null);
  const toolsInView = useInView(toolsRef, { once: true, margin: "-50px" });

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <style>{`
        @keyframes pinDrop {
          0% { transform: translateY(-30px) scale(0.5); opacity: 0; }
          60% { transform: translateY(3px) scale(1.05); opacity: 1; }
          80% { transform: translateY(-2px) scale(0.98); }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }

        @keyframes develop {
          0% { filter: saturate(0) brightness(1.8) contrast(0.6); opacity: 0.3; }
          30% { filter: saturate(0.2) brightness(1.3) contrast(0.8) sepia(0.6); opacity: 0.6; }
          70% { filter: saturate(0.7) brightness(1.05) contrast(0.95) sepia(0.2); opacity: 0.9; }
          100% { filter: saturate(1) brightness(1) contrast(1) sepia(0); opacity: 1; }
        }

        @keyframes sway {
          0%, 100% { transform: rotate(var(--base-rot, 0deg)); }
          50% { transform: rotate(calc(var(--base-rot, 0deg) + 1deg)); }
        }

        @keyframes stringDraw {
          from { stroke-dashoffset: 500; }
          to { stroke-dashoffset: 0; }
        }

        @keyframes floatSoft {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        @keyframes dangleSwing {
          0%, 100% { transform: rotate(-3deg); transform-origin: top center; }
          50% { transform: rotate(3deg); transform-origin: top center; }
        }

        @keyframes corkShimmer {
          0%, 100% { opacity: 0.03; }
          50% { opacity: 0.06; }
        }

        .polaroid-page {
          background: ${C.cork};
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }

        .polaroid-page * {
          box-sizing: border-box;
        }

        .polaroid-page ::selection {
          background: ${C.tack};
          color: white;
        }

        .string-connection {
          stroke-dasharray: 500;
          animation: stringDraw 2s ease-out forwards;
        }

        .dangle-anim {
          animation: dangleSwing 4s ease-in-out infinite;
        }
      `}</style>

      <div className="polaroid-page">
        <CorkBackground />

        {/* Corkboard edge shadow at top */}
        <div
          className="fixed top-0 left-0 right-0 h-3 z-50 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(80,55,30,0.5) 0%, transparent 100%)",
          }}
        />

        {/* ═══════ HERO SECTION ═══════ */}
        <section
          ref={heroRef}
          className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20"
        >
          {/* String connections from hero to stats (SVG) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 1 }}
          >
            {mounted && heroInView && (
              <>
                <StringLine x1={480} y1={400} x2={250} y2={620} delay={1.5} />
                <StringLine x1={520} y1={400} x2={500} y2={620} delay={1.8} />
                <StringLine x1={560} y1={400} x2={750} y2={620} delay={2.1} />
              </>
            )}
          </svg>

          {/* Main Hero Polaroid */}
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, scale: 0.7, rotate: -5 }}
            animate={
              heroInView
                ? { opacity: 1, scale: 1, rotate: -1.5 }
                : { opacity: 0, scale: 0.7, rotate: -5 }
            }
            transition={{
              duration: 1.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {/* Corner push pins */}
            <div className="absolute z-20" style={{ top: -16, left: 20 }}>
              <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={
                  heroInView ? { y: 0, opacity: 1 } : { y: -30, opacity: 0 }
                }
                transition={{
                  delay: 0.6,
                  type: "spring",
                  stiffness: 300,
                  damping: 15,
                }}
              >
                <PushPin color={C.pin} size={32} />
              </motion.div>
            </div>
            <div className="absolute z-20" style={{ top: -16, right: 20 }}>
              <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={
                  heroInView ? { y: 0, opacity: 1 } : { y: -30, opacity: 0 }
                }
                transition={{
                  delay: 0.8,
                  type: "spring",
                  stiffness: 300,
                  damping: 15,
                }}
              >
                <PushPin color={C.tack} size={32} />
              </motion.div>
            </div>

            {/* Tape strips */}
            <div className="absolute z-20" style={{ top: 4, left: -15 }}>
              <TapeStrip width={55} rotation={-12} />
            </div>
            <div className="absolute z-20" style={{ top: 4, right: -10 }}>
              <TapeStrip width={50} rotation={8} />
            </div>

            {/* The polaroid itself */}
            <div
              style={{
                background: C.polaroid,
                padding: "20px 20px 70px 20px",
                boxShadow: `5px 8px 20px ${C.polaroidShadow}, 0 2px 8px rgba(0,0,0,0.15)`,
                borderRadius: 3,
                maxWidth: 420,
              }}
            >
              {/* Developing photo area */}
              <motion.div
                style={{
                  background:
                    "linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)",
                  aspectRatio: "4/3",
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 30,
                  position: "relative",
                  overflow: "hidden",
                }}
                initial={{
                  filter: "saturate(0) brightness(1.8) contrast(0.5)",
                }}
                animate={
                  heroInView
                    ? { filter: "saturate(1) brightness(1) contrast(1)" }
                    : {
                        filter:
                          "saturate(0) brightness(1.8) contrast(0.5)",
                      }
                }
                transition={{ duration: 3, delay: 0.3, ease: "easeOut" }}
              >
                {/* Abstract background shapes */}
                <motion.div
                  className="absolute"
                  style={{
                    width: 300,
                    height: 300,
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle, rgba(74,144,217,0.15) 0%, transparent 70%)",
                    top: -80,
                    right: -80,
                  }}
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 10, 0] }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute"
                  style={{
                    width: 200,
                    height: 200,
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle, rgba(231,76,60,0.1) 0%, transparent 70%)",
                    bottom: -60,
                    left: -60,
                  }}
                  animate={{ scale: [1, 1.15, 1], rotate: [0, -8, 0] }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* GROX title */}
                <motion.h1
                  style={{
                    fontFamily: "var(--font-playfair), serif",
                    fontSize: 72,
                    fontWeight: 900,
                    color: "#FFFFFF",
                    letterSpacing: "0.15em",
                    position: "relative",
                    lineHeight: 1,
                    textShadow: "2px 3px 6px rgba(0,0,0,0.4)",
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    heroInView
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 20 }
                  }
                  transition={{ delay: 1, duration: 1 }}
                >
                  GROX
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: 14,
                    color: "rgba(255,255,255,0.6)",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    marginTop: 12,
                    position: "relative",
                  }}
                  initial={{ opacity: 0 }}
                  animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 1.5, duration: 0.8 }}
                >
                  AI Engineering Studio
                </motion.p>
              </motion.div>

              {/* Handwritten caption on polaroid bottom */}
              <motion.div
                className="text-center mt-4"
                style={{
                  fontFamily: "var(--font-playfair), serif",
                  fontStyle: "italic",
                  fontSize: 16,
                  color: C.marker,
                  position: "absolute",
                  bottom: 18,
                  left: 0,
                  right: 0,
                }}
                initial={{ opacity: 0 }}
                animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 2, duration: 0.8 }}
              >
                Building the future, one model at a time
              </motion.div>
            </div>
          </motion.div>

          {/* Stats as smaller polaroids connected by strings */}
          <div
            className="relative z-10 flex flex-wrap justify-center gap-8 mt-16"
          >
            {stats.map((stat, i) => (
              <StatPolaroid key={stat.label} stat={stat} index={i} delay={1.5 + i * 0.3} />
            ))}
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2"
            style={{ transform: "translateX(-50%)", zIndex: 10 }}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <svg width="24" height="36" viewBox="0 0 24 36" fill="none">
              <rect
                x="1"
                y="1"
                width="22"
                height="34"
                rx="11"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="2"
              />
              <motion.circle
                cx="12"
                cy="10"
                r="3"
                fill="rgba(255,255,255,0.5)"
                animate={{ cy: [10, 22, 10] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </svg>
          </motion.div>
        </section>

        {/* ═══════ PROJECTS SECTION ═══════ */}
        <section
          ref={projectsRef}
          id="projects"
          className="relative px-6 py-20"
        >
          {/* Section divider: cork board edge */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "rgba(107,82,52,0.4)" }}
          />

          {/* Section title pinned note */}
          <motion.div
            className="relative max-w-xs mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={
              projectsInView
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.6 }}
          >
            <div
              className="absolute z-10"
              style={{ top: -14, left: "50%", transform: "translateX(-50%)" }}
            >
              <PushPin color={C.string} size={30} />
            </div>
            <div
              className="text-center py-4 px-8"
              style={{
                background: "#FFFEF5",
                boxShadow: "2px 3px 10px rgba(0,0,0,0.12)",
                borderRadius: 2,
                transform: "rotate(-0.5deg)",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-playfair), serif",
                  fontSize: 28,
                  fontWeight: 900,
                  color: C.marker,
                  margin: 0,
                }}
              >
                Case Files
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: 12,
                  color: "#8B7355",
                  marginTop: 4,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                10 Projects / Investigation Board
              </p>
            </div>
          </motion.div>

          {/* String connections SVG behind the grid */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
          >
            {mounted && projectsInView && (
              <>
                {/* Diagonal string connections between some projects */}
                <motion.line
                  x1="25%"
                  y1="8%"
                  x2="55%"
                  y2="18%"
                  stroke={C.string}
                  strokeWidth="1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  transition={{ delay: 1, duration: 1 }}
                />
                <motion.line
                  x1="75%"
                  y1="12%"
                  x2="45%"
                  y2="28%"
                  stroke={C.string}
                  strokeWidth="1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  transition={{ delay: 1.3, duration: 1 }}
                />
                <motion.line
                  x1="30%"
                  y1="35%"
                  x2="70%"
                  y2="42%"
                  stroke={C.string}
                  strokeWidth="1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.25 }}
                  transition={{ delay: 1.6, duration: 1 }}
                />
                <motion.line
                  x1="20%"
                  y1="55%"
                  x2="50%"
                  y2="60%"
                  stroke={C.string}
                  strokeWidth="1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  transition={{ delay: 1.9, duration: 1 }}
                />
                <motion.line
                  x1="60%"
                  y1="70%"
                  x2="35%"
                  y2="80%"
                  stroke={C.string}
                  strokeWidth="1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.25 }}
                  transition={{ delay: 2.2, duration: 1 }}
                />
              </>
            )}
          </svg>

          {/* Projects grid - scattered corkboard layout */}
          <div
            className="relative z-10 max-w-6xl mx-auto grid gap-10"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            }}
          >
            {projects.map((project, i) => (
              <div
                key={project.title}
                style={{
                  marginTop: i % 3 === 1 ? 40 : i % 3 === 2 ? 20 : 0,
                }}
              >
                <ProjectPolaroid project={project} index={i} />
              </div>
            ))}
          </div>
        </section>

        {/* ═══════ EXPERTISE SECTION ═══════ */}
        <section id="expertise" className="relative px-6 py-20">
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "rgba(107,82,52,0.4)" }}
          />

          {/* Section title */}
          <motion.div
            className="relative max-w-xs mx-auto mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="absolute z-10"
              style={{ top: -14, left: "50%", transform: "translateX(-50%)" }}
            >
              <PushPin color={C.pin} size={30} />
            </div>
            <div
              className="text-center py-4 px-8"
              style={{
                background: "#FFFEF5",
                boxShadow: "2px 3px 10px rgba(0,0,0,0.12)",
                borderRadius: 2,
                transform: "rotate(0.8deg)",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-playfair), serif",
                  fontSize: 28,
                  fontWeight: 900,
                  color: C.marker,
                  margin: 0,
                }}
              >
                Expertise
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: 12,
                  color: "#8B7355",
                  marginTop: 4,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Core Competencies
              </p>
            </div>
          </motion.div>

          {/* String connections between expertise cards */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
          >
            <motion.line
              x1="28%"
              y1="40%"
              x2="72%"
              y2="35%"
              stroke={C.string}
              strokeWidth="1"
              strokeDasharray="6 4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.3 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 1 }}
            />
            <motion.line
              x1="30%"
              y1="60%"
              x2="70%"
              y2="65%"
              stroke={C.string}
              strokeWidth="1"
              strokeDasharray="6 4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.3 }}
              viewport={{ once: true }}
              transition={{ delay: 1.2, duration: 1 }}
            />
          </svg>

          {/* Expertise grid */}
          <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {expertise.map((item, i) => (
              <ExpertisePolaroid key={item.title} item={item} index={i} />
            ))}
          </div>
        </section>

        {/* ═══════ TOOLS SECTION ═══════ */}
        <section ref={toolsRef} id="tools" className="relative px-6 py-20">
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "rgba(107,82,52,0.4)" }}
          />

          {/* Section title */}
          <motion.div
            className="relative max-w-xs mx-auto mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="absolute z-10"
              style={{ top: -14, left: "50%", transform: "translateX(-50%)" }}
            >
              <PushPin color={C.tack} size={30} />
            </div>
            <div
              className="text-center py-4 px-8"
              style={{
                background: "#FFFEF5",
                boxShadow: "2px 3px 10px rgba(0,0,0,0.12)",
                borderRadius: 2,
                transform: "rotate(-0.3deg)",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-playfair), serif",
                  fontSize: 28,
                  fontWeight: 900,
                  color: C.marker,
                  margin: 0,
                }}
              >
                Toolkit
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: 12,
                  color: "#8B7355",
                  marginTop: 4,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Technologies & Stack
              </p>
            </div>
          </motion.div>

          {/* String connections between tool cards */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
          >
            {mounted && toolsInView && (
              <>
                <motion.path
                  d="M20%,30% Q35%,25% 50%,30%"
                  stroke={C.string}
                  strokeWidth="1"
                  fill="none"
                  strokeDasharray="4 3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.25 }}
                  transition={{ delay: 0.5, duration: 1 }}
                />
                <motion.path
                  d="M50%,30% Q65%,25% 80%,30%"
                  stroke={C.string}
                  strokeWidth="1"
                  fill="none"
                  strokeDasharray="4 3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.25 }}
                  transition={{ delay: 0.8, duration: 1 }}
                />
              </>
            )}
          </svg>

          {/* Tools grid */}
          <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool, i) => (
              <ToolCard key={tool.label} tool={tool} index={i} />
            ))}
          </div>
        </section>

        {/* ═══════ FOOTER SECTION ═══════ */}
        <footer id="contact" className="relative px-6 py-24">
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "rgba(107,82,52,0.4)" }}
          />

          <div className="max-w-md mx-auto flex flex-col items-center">
            {/* String from which the final polaroid dangles */}
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              {/* Pin at the top of the string */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.3,
                  type: "spring",
                  stiffness: 300,
                  damping: 15,
                }}
              >
                <PushPin color={C.string} size={26} />
              </motion.div>

              {/* Dangling string */}
              <motion.div
                style={{
                  width: 2,
                  height: 50,
                  background: `linear-gradient(180deg, ${C.string} 0%, ${C.string}88 100%)`,
                  borderRadius: 1,
                  transformOrigin: "top",
                }}
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.5 }}
              />

              {/* Dangling final polaroid */}
              <motion.div
                className="dangle-anim"
                style={{ transformOrigin: "top center" }}
              >
                <div
                  style={{
                    background: C.polaroid,
                    padding: "16px 16px 50px 16px",
                    boxShadow: `4px 6px 16px ${C.polaroidShadow}`,
                    borderRadius: 2,
                    width: 220,
                  }}
                >
                  {/* Photo area */}
                  <motion.div
                    style={{
                      background:
                        "linear-gradient(135deg, #2C3E50 0%, #1A252F 100%)",
                      aspectRatio: "4/3",
                      borderRadius: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      overflow: "hidden",
                    }}
                    initial={{
                      filter: "saturate(0) brightness(1.5)",
                    }}
                    whileInView={{
                      filter: "saturate(1) brightness(1)",
                    }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8, duration: 2.5 }}
                  >
                    {/* Subtle gradient orb */}
                    <div
                      className="absolute"
                      style={{
                        width: 120,
                        height: 120,
                        borderRadius: "50%",
                        background:
                          "radial-gradient(circle, rgba(74,144,217,0.2) 0%, transparent 70%)",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "var(--font-playfair), serif",
                        fontSize: 22,
                        fontWeight: 700,
                        color: "#FFFFFF",
                        position: "relative",
                        letterSpacing: "0.05em",
                      }}
                    >
                      The End
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-jetbrains), monospace",
                        fontSize: 10,
                        color: "rgba(255,255,255,0.4)",
                        marginTop: 6,
                        position: "relative",
                      }}
                    >
                      &copy; {new Date().getFullYear()} GROX
                    </span>
                  </motion.div>

                  {/* Caption */}
                  <div
                    className="text-center"
                    style={{
                      position: "absolute",
                      bottom: 14,
                      left: 0,
                      right: 0,
                      fontFamily: "var(--font-playfair), serif",
                      fontStyle: "italic",
                      fontSize: 13,
                      color: C.handwriting,
                    }}
                  >
                    Thanks for viewing
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Contact links */}
            <motion.div
              className="flex gap-6 mt-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              {["GitHub", "Email", "LinkedIn"].map((label, i) => (
                <motion.a
                  key={label}
                  href="#"
                  className="relative"
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: 13,
                    color: "rgba(255,255,255,0.6)",
                    textDecoration: "none",
                    letterSpacing: "0.05em",
                  }}
                  whileHover={{ color: "#FFFFFF", y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  {label}
                </motion.a>
              ))}
            </motion.div>

            {/* Final note */}
            <motion.p
              className="mt-6"
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: 10,
                color: "rgba(255,255,255,0.3)",
                textAlign: "center",
                letterSpacing: "0.05em",
              }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.5, duration: 0.6 }}
            >
              Crafted with care. Every photo tells a story.
            </motion.p>
          </div>
        </footer>

        {/* ═══════ THEME SWITCHER ═══════ */}
        <ThemeSwitcher current="/polaroid" variant="dark" />

        {/* ═══════ DECORATIVE ELEMENTS ═══════ */}

        {/* Scattered pins on the board (purely decorative) */}
        {mounted && (
          <>
            <motion.div
              className="fixed pointer-events-none"
              style={{ top: "15%", left: "3%", zIndex: 2 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 2, duration: 1 }}
            >
              <PushPin color={C.pin} size={20} />
            </motion.div>
            <motion.div
              className="fixed pointer-events-none"
              style={{ top: "45%", right: "4%", zIndex: 2 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 2.5, duration: 1 }}
            >
              <PushPin color={C.tack} size={18} />
            </motion.div>
            <motion.div
              className="fixed pointer-events-none"
              style={{ top: "70%", left: "5%", zIndex: 2 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 3, duration: 1 }}
            >
              <PushPin color={C.string} size={22} />
            </motion.div>

            {/* Loose string decoration */}
            <motion.div
              className="fixed pointer-events-none"
              style={{
                top: "25%",
                right: "8%",
                width: 80,
                height: 2,
                background: C.string,
                borderRadius: 1,
                transform: "rotate(25deg)",
                zIndex: 1,
              }}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 0.2, scaleX: 1 }}
              transition={{ delay: 3, duration: 1 }}
            />
            <motion.div
              className="fixed pointer-events-none"
              style={{
                top: "60%",
                left: "6%",
                width: 60,
                height: 2,
                background: C.string,
                borderRadius: 1,
                transform: "rotate(-15deg)",
                zIndex: 1,
              }}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 0.15, scaleX: 1 }}
              transition={{ delay: 3.5, duration: 1 }}
            />

            {/* Cork texture overlay shimmer */}
            <motion.div
              className="fixed inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.02) 50%, transparent 60%)",
                backgroundSize: "200% 200%",
                zIndex: 1,
              }}
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
          </>
        )}
      </div>
    </>
  );
}
