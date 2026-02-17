"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "@/app/data/projects";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";

/* ━━━ Palette: Indigo dye, natural linen, resist white ━━━ */
const C = {
  deepIndigo: "#1A2744",
  shibori: "#3A5A8A",
  resistWhite: "#F5F0E8",
  naturalWhite: "#FFF8F0",
  threadGray: "#888888",
  linen: "#E8DCC8",
  accentNavy: "#0A1628",
  midIndigo: "#2A3F66",
  paleIndigo: "#6B82A8",
  dyeLight: "#4A6A9A",
  warmCream: "#FAF4E8",
};

/* ━━━ Scroll-reveal with fabric unfolding feel ━━━ */
function Reveal({
  children,
  className = "",
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
      animate={
        inView
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y: 20, filter: "blur(4px)" }
      }
      transition={{ duration: 1.2, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ━━━ SVG: Kumo Shibori Pattern (spiderweb circles) ━━━ */
function KumoPattern({
  size = 200,
  color = C.shibori,
  opacity = 0.3,
}: {
  size?: number;
  color?: string;
  opacity?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
    >
      {/* Concentric circles with resist gaps */}
      {Array.from({ length: 8 }).map((_, i) => (
        <circle
          key={i}
          cx={100}
          cy={100}
          r={15 + i * 11}
          stroke={color}
          strokeWidth={1.2}
          strokeDasharray={`${4 + i * 2} ${3 + i}`}
          fill="none"
          opacity={0.8 - i * 0.07}
        />
      ))}
      {/* Radial binding lines */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        return (
          <line
            key={`r-${i}`}
            x1={100 + Math.cos(angle) * 15}
            y1={100 + Math.sin(angle) * 15}
            x2={100 + Math.cos(angle) * 92}
            y2={100 + Math.sin(angle) * 92}
            stroke={color}
            strokeWidth={0.5}
            opacity={0.3}
          />
        );
      })}
    </svg>
  );
}

/* ━━━ SVG: Arashi Shibori Pattern (diagonal pole-wrapped) ━━━ */
function ArashiPattern({
  width = 400,
  height = 200,
  color = C.shibori,
  opacity = 0.25,
}: {
  width?: number;
  height?: number;
  color?: string;
  opacity?: number;
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 400 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
    >
      {/* Diagonal resist lines - arashi wrapping */}
      {Array.from({ length: 30 }).map((_, i) => (
        <line
          key={i}
          x1={-20 + i * 15}
          y1={-10}
          x2={-20 + i * 15 - 60}
          y2={210}
          stroke={color}
          strokeWidth={1 + Math.sin(i * 0.5) * 0.5}
          strokeDasharray={`${6 + Math.sin(i * 0.7) * 4} ${3 + Math.cos(i * 0.3) * 2}`}
          opacity={0.6 + Math.sin(i * 0.4) * 0.3}
        />
      ))}
      {/* Horizontal compression lines */}
      {Array.from({ length: 8 }).map((_, i) => (
        <line
          key={`h-${i}`}
          x1={0}
          y1={20 + i * 24}
          x2={400}
          y2={20 + i * 24}
          stroke={color}
          strokeWidth={0.3}
          opacity={0.2}
        />
      ))}
    </svg>
  );
}

/* ━━━ SVG: Itajime Shibori Pattern (geometric fold clamp) ━━━ */
function ItajimePattern({
  size = 200,
  color = C.shibori,
  opacity = 0.3,
}: {
  size?: number;
  color?: string;
  opacity?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
    >
      {/* Triangular fold pattern */}
      <polygon
        points="100,20 180,170 20,170"
        stroke={color}
        strokeWidth={1.5}
        fill="none"
      />
      <polygon
        points="100,40 165,155 35,155"
        stroke={color}
        strokeWidth={1}
        fill={color}
        fillOpacity={0.05}
      />
      <polygon
        points="100,60 150,140 50,140"
        stroke={color}
        strokeWidth={0.8}
        fill={color}
        fillOpacity={0.08}
      />
      <polygon
        points="100,80 135,125 65,125"
        stroke={color}
        strokeWidth={0.6}
        fill={color}
        fillOpacity={0.12}
      />
      {/* Fold lines radiating out */}
      <line x1={100} y1={20} x2={100} y2={170} stroke={color} strokeWidth={0.4} opacity={0.3} />
      <line x1={20} y1={170} x2={180} y2={170} stroke={color} strokeWidth={0.4} opacity={0.3} />
      <line x1={60} y1={95} x2={180} y2={170} stroke={color} strokeWidth={0.3} opacity={0.2} />
      <line x1={140} y1={95} x2={20} y2={170} stroke={color} strokeWidth={0.3} opacity={0.2} />
    </svg>
  );
}

/* ━━━ SVG: Kanoko Shibori Pattern (bound dot resist) ━━━ */
function KanokoPattern({
  size = 200,
  color = C.shibori,
  opacity = 0.25,
}: {
  size?: number;
  color?: string;
  opacity?: number;
}) {
  const dots: { cx: number; cy: number; r: number }[] = [];
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 7; col++) {
      const offsetX = row % 2 === 0 ? 0 : 14;
      dots.push({
        cx: 16 + col * 28 + offsetX,
        cy: 16 + row * 28,
        r: 6 + Math.sin(row * col * 0.5) * 2,
      });
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
    >
      {dots.map((d, i) => (
        <g key={i}>
          {/* Outer binding ring */}
          <circle
            cx={d.cx}
            cy={d.cy}
            r={d.r + 3}
            stroke={color}
            strokeWidth={0.5}
            fill="none"
            opacity={0.4}
          />
          {/* Inner resist dot */}
          <circle
            cx={d.cx}
            cy={d.cy}
            r={d.r}
            stroke={color}
            strokeWidth={0.8}
            fill={color}
            fillOpacity={0.08}
          />
          {/* Tiny center point */}
          <circle
            cx={d.cx}
            cy={d.cy}
            r={1.2}
            fill={color}
            opacity={0.5}
          />
        </g>
      ))}
    </svg>
  );
}

/* ━━━ SVG: Fabric Fold Lines Divider ━━━ */
function FabricFoldDivider({ color = C.shibori }: { color?: string }) {
  return (
    <svg
      viewBox="0 0 1000 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "auto" }}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <path
          key={i}
          d={`M 0 ${25 + i * 3} C 200 ${20 + i * 3 + Math.sin(i) * 4}, 400 ${30 + i * 3 - Math.sin(i) * 3}, 500 ${25 + i * 3} S 800 ${20 + i * 3 + Math.cos(i) * 5}, 1000 ${25 + i * 3}`}
          stroke={color}
          strokeWidth={0.6}
          opacity={0.2 + i * 0.04}
        />
      ))}
      {/* Central fold crease */}
      <line
        x1={500}
        y1={10}
        x2={500}
        y2={50}
        stroke={color}
        strokeWidth={0.3}
        opacity={0.15}
        strokeDasharray="2 4"
      />
    </svg>
  );
}

/* ━━━ SVG: Thread Binding Detail ━━━ */
function ThreadBinding({
  width = 60,
  height = 20,
  color = C.threadGray,
}: {
  width?: number;
  height?: number;
  color?: string;
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 60 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <path
          key={i}
          d={`M ${5 + i * 7} 2 C ${8 + i * 7} 10, ${2 + i * 7} 10, ${5 + i * 7} 18`}
          stroke={color}
          strokeWidth={0.7}
          opacity={0.5}
        />
      ))}
    </svg>
  );
}

/* ━━━ SVG: Indigo Vat (for footer artisan mark) ━━━ */
function IndigoVat({ size = 48 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Vat body */}
      <path
        d="M 10 16 Q 10 38, 24 40 Q 38 38, 38 16"
        stroke={C.shibori}
        strokeWidth={1.5}
        fill={C.deepIndigo}
        fillOpacity={0.6}
      />
      {/* Vat rim */}
      <ellipse cx={24} cy={16} rx={14} ry={4} stroke={C.shibori} strokeWidth={1.2} fill={C.midIndigo} fillOpacity={0.4} />
      {/* Dye surface ripple */}
      <ellipse cx={24} cy={17} rx={10} ry={2.5} stroke={C.paleIndigo} strokeWidth={0.5} fill="none" opacity={0.6} />
      <ellipse cx={24} cy={18} rx={7} ry={1.5} stroke={C.paleIndigo} strokeWidth={0.4} fill="none" opacity={0.4} />
      {/* Steam wisps */}
      <path d="M 20 12 Q 19 8, 21 5" stroke={C.paleIndigo} strokeWidth={0.5} opacity={0.3} />
      <path d="M 24 11 Q 23 7, 25 4" stroke={C.paleIndigo} strokeWidth={0.5} opacity={0.25} />
      <path d="M 28 12 Q 27 8, 29 5" stroke={C.paleIndigo} strokeWidth={0.5} opacity={0.2} />
    </svg>
  );
}

/* ━━━ SVG: Needle and Thread ━━━ */
function NeedleThread({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Needle */}
      <line x1={8} y1={32} x2={30} y2={6} stroke={C.threadGray} strokeWidth={1.2} strokeLinecap="round" />
      <circle cx={30} cy={6} r={1.5} fill={C.threadGray} opacity={0.8} />
      {/* Eye */}
      <ellipse cx={29} cy={8} rx={1} ry={2} stroke={C.threadGray} strokeWidth={0.5} fill="none" />
      {/* Thread trailing */}
      <path
        d="M 29 10 C 32 14, 26 18, 30 22 C 34 26, 28 30, 32 34"
        stroke={C.shibori}
        strokeWidth={0.8}
        fill="none"
        opacity={0.6}
      />
    </svg>
  );
}

/* ━━━ SVG: Thread Fringe Decoration ━━━ */
function ThreadFringe({ width = 600 }: { width?: number }) {
  return (
    <svg
      viewBox="0 0 600 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", maxWidth: width, height: "auto" }}
    >
      {/* Horizontal woven base */}
      <line x1={0} y1={2} x2={600} y2={2} stroke={C.linen} strokeWidth={1.5} opacity={0.5} />
      <line x1={0} y1={5} x2={600} y2={5} stroke={C.shibori} strokeWidth={0.8} opacity={0.3} />
      {/* Hanging threads */}
      {Array.from({ length: 40 }).map((_, i) => {
        const x = 8 + i * 15;
        const len = 18 + Math.sin(i * 0.8) * 10;
        const sway = Math.sin(i * 0.5) * 3;
        return (
          <path
            key={i}
            d={`M ${x} 6 C ${x + sway} ${6 + len * 0.4}, ${x - sway} ${6 + len * 0.7}, ${x + sway * 0.5} ${6 + len}`}
            stroke={i % 3 === 0 ? C.shibori : C.linen}
            strokeWidth={0.6}
            opacity={0.4 + Math.sin(i * 0.3) * 0.15}
          />
        );
      })}
    </svg>
  );
}

/* ━━━ SVG: Large Hero Shibori Pattern (combines multiple techniques) ━━━ */
function HeroShiboriPattern() {
  return (
    <motion.svg
      viewBox="0 0 800 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "auto", position: "absolute", top: 0, left: 0, right: 0 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 3, ease: "easeOut" }}
    >
      {/* Large kumo circle - top left */}
      {Array.from({ length: 6 }).map((_, i) => (
        <circle
          key={`kl-${i}`}
          cx={150}
          cy={120}
          r={30 + i * 18}
          stroke={C.shibori}
          strokeWidth={0.8}
          fill="none"
          opacity={0.12 - i * 0.015}
          strokeDasharray={`${5 + i * 2} ${4 + i}`}
        />
      ))}

      {/* Medium kumo circle - right */}
      {Array.from({ length: 5 }).map((_, i) => (
        <circle
          key={`kr-${i}`}
          cx={650}
          cy={200}
          r={20 + i * 14}
          stroke={C.shibori}
          strokeWidth={0.6}
          fill="none"
          opacity={0.1 - i * 0.012}
          strokeDasharray={`${3 + i} ${3 + i}`}
        />
      ))}

      {/* Small kumo cluster - center bottom */}
      {Array.from({ length: 4 }).map((_, i) => (
        <circle
          key={`kc-${i}`}
          cx={400}
          cy={450}
          r={15 + i * 10}
          stroke={C.shibori}
          strokeWidth={0.5}
          fill="none"
          opacity={0.08 - i * 0.01}
        />
      ))}

      {/* Arashi diagonal lines - scattered */}
      {Array.from({ length: 20 }).map((_, i) => (
        <line
          key={`a-${i}`}
          x1={300 + i * 12}
          y1={0}
          x2={260 + i * 12}
          y2={600}
          stroke={C.shibori}
          strokeWidth={0.4}
          opacity={0.05 + Math.sin(i * 0.7) * 0.03}
          strokeDasharray="8 12"
        />
      ))}

      {/* Itajime diamond shapes */}
      <rect
        x={350}
        y={250}
        width={100}
        height={100}
        transform="rotate(45, 400, 300)"
        stroke={C.shibori}
        strokeWidth={0.6}
        fill="none"
        opacity={0.08}
      />
      <rect
        x={365}
        y={265}
        width={70}
        height={70}
        transform="rotate(45, 400, 300)"
        stroke={C.shibori}
        strokeWidth={0.5}
        fill={C.shibori}
        fillOpacity={0.03}
        opacity={0.1}
      />

      {/* Kanoko dots scattered */}
      {Array.from({ length: 15 }).map((_, i) => {
        const cx = 80 + i * 50 + Math.sin(i * 1.3) * 30;
        const cy = 380 + Math.cos(i * 0.9) * 80;
        return (
          <g key={`d-${i}`}>
            <circle cx={cx} cy={cy} r={4} stroke={C.shibori} strokeWidth={0.5} fill="none" opacity={0.1} />
            <circle cx={cx} cy={cy} r={1.5} fill={C.shibori} opacity={0.08} />
          </g>
        );
      })}
    </motion.svg>
  );
}

/* ━━━ Shibori pattern motifs for project cards ━━━ */
const shiboriMotifs = [
  // 0: Small circles (kumo)
  (color: string) => (
    <svg viewBox="0 0 60 60" fill="none" style={{ width: 60, height: 60 }}>
      {[8, 14, 20, 26].map((r, i) => (
        <circle key={i} cx={30} cy={30} r={r} stroke={color} strokeWidth={0.8} fill="none" opacity={0.4 - i * 0.06} strokeDasharray="3 2" />
      ))}
    </svg>
  ),
  // 1: Diamonds (itajime)
  (color: string) => (
    <svg viewBox="0 0 60 60" fill="none" style={{ width: 60, height: 60 }}>
      <rect x={15} y={15} width={30} height={30} transform="rotate(45,30,30)" stroke={color} strokeWidth={0.8} fill="none" opacity={0.35} />
      <rect x={21} y={21} width={18} height={18} transform="rotate(45,30,30)" stroke={color} strokeWidth={0.6} fill={color} fillOpacity={0.06} opacity={0.3} />
    </svg>
  ),
  // 2: Diagonal lines (arashi)
  (color: string) => (
    <svg viewBox="0 0 60 60" fill="none" style={{ width: 60, height: 60 }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={i} x1={i * 8} y1={0} x2={i * 8 - 15} y2={60} stroke={color} strokeWidth={0.7} opacity={0.3} strokeDasharray="4 3" />
      ))}
    </svg>
  ),
  // 3: Dots grid (kanoko)
  (color: string) => (
    <svg viewBox="0 0 60 60" fill="none" style={{ width: 60, height: 60 }}>
      {Array.from({ length: 4 }).map((_, r) =>
        Array.from({ length: 4 }).map((_, c) => (
          <circle key={`${r}-${c}`} cx={10 + c * 14 + (r % 2) * 7} cy={10 + r * 14} r={3} stroke={color} strokeWidth={0.6} fill={color} fillOpacity={0.06} opacity={0.4} />
        ))
      )}
    </svg>
  ),
  // 4: Stripes horizontal
  (color: string) => (
    <svg viewBox="0 0 60 60" fill="none" style={{ width: 60, height: 60 }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <line key={i} x1={5} y1={8 + i * 9} x2={55} y2={8 + i * 9} stroke={color} strokeWidth={1} opacity={0.3 + (i % 2) * 0.1} strokeDasharray={i % 2 === 0 ? "none" : "4 3"} />
      ))}
    </svg>
  ),
  // 5: Concentric squares
  (color: string) => (
    <svg viewBox="0 0 60 60" fill="none" style={{ width: 60, height: 60 }}>
      {[0, 6, 12, 18].map((offset, i) => (
        <rect key={i} x={offset + 3} y={offset + 3} width={54 - offset * 2} height={54 - offset * 2} stroke={color} strokeWidth={0.6} fill="none" opacity={0.35 - i * 0.05} />
      ))}
    </svg>
  ),
  // 6: Spiral (kumo variant)
  (color: string) => (
    <svg viewBox="0 0 60 60" fill="none" style={{ width: 60, height: 60 }}>
      <path d="M 30 30 C 30 25, 35 25, 35 30 C 35 37, 25 37, 25 28 C 25 20, 40 20, 40 30 C 40 42, 20 42, 20 26 C 20 15, 45 15, 45 30" stroke={color} strokeWidth={0.7} fill="none" opacity={0.35} />
    </svg>
  ),
  // 7: Cross hatch
  (color: string) => (
    <svg viewBox="0 0 60 60" fill="none" style={{ width: 60, height: 60 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <g key={i}>
          <line x1={i * 14 + 2} y1={2} x2={i * 14 + 2} y2={58} stroke={color} strokeWidth={0.5} opacity={0.25} />
          <line x1={2} y1={i * 14 + 2} x2={58} y2={i * 14 + 2} stroke={color} strokeWidth={0.5} opacity={0.25} />
        </g>
      ))}
    </svg>
  ),
  // 8: Hexagon (itajime variant)
  (color: string) => (
    <svg viewBox="0 0 60 60" fill="none" style={{ width: 60, height: 60 }}>
      <polygon points="30,6 52,18 52,42 30,54 8,42 8,18" stroke={color} strokeWidth={0.8} fill="none" opacity={0.35} />
      <polygon points="30,14 44,22 44,38 30,46 16,38 16,22" stroke={color} strokeWidth={0.5} fill={color} fillOpacity={0.05} opacity={0.3} />
    </svg>
  ),
  // 9: Radiating lines
  (color: string) => (
    <svg viewBox="0 0 60 60" fill="none" style={{ width: 60, height: 60 }}>
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        return (
          <line key={i} x1={30} y1={30} x2={30 + Math.cos(a) * 24} y2={30 + Math.sin(a) * 24} stroke={color} strokeWidth={0.6} opacity={0.3} />
        );
      })}
      <circle cx={30} cy={30} r={4} stroke={color} strokeWidth={0.6} fill="none" opacity={0.4} />
    </svg>
  ),
];

/* ━━━ Dye spreading animation component ━━━ */
function DyeSpread({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ clipPath: "inset(100% 0 0 0)" }}
      animate={inView ? { clipPath: "inset(0% 0 0 0)" } : { clipPath: "inset(100% 0 0 0)" }}
      transition={{ duration: 1.4, delay, ease: [0.65, 0, 0.35, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ━━━ Project Card — textile swatch with shibori border ━━━ */
function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);

  const num = String(index + 1).padStart(2, "0");
  const titleClean = project.title.replace("\n", " ");
  const motif = shiboriMotifs[index % shiboriMotifs.length];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 1.2, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.warmCream,
        borderRadius: 4,
        padding: "40px 36px 36px",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
        border: `1px solid ${C.linen}`,
        boxShadow: hovered
          ? `0 8px 32px rgba(26,39,68,0.1), inset 0 0 0 1px ${C.shibori}22`
          : `0 2px 12px rgba(26,39,68,0.04)`,
        transition: "box-shadow 0.6s ease",
      }}
    >
      {/* Shibori pattern border - top edge */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${C.deepIndigo}, ${C.shibori}, ${C.deepIndigo})`,
          opacity: hovered ? 0.8 : 0.4,
          transition: "opacity 0.6s ease",
        }}
      />

      {/* Pattern motif - top right corner */}
      <motion.div
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          opacity: hovered ? 0.6 : 0.3,
          transition: "opacity 0.6s ease",
        }}
        animate={{ rotate: hovered ? 15 : 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {motif(C.shibori)}
      </motion.div>

      {/* Fabric texture background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, ${C.linen}18 3px, ${C.linen}18 4px), repeating-linear-gradient(90deg, transparent, transparent 3px, ${C.linen}18 3px, ${C.linen}18 4px)`,
          pointerEvents: "none",
          opacity: 0.5,
        }}
      />

      {/* Number */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 18,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: 32,
              color: C.shibori,
              opacity: hovered ? 0.7 : 0.35,
              lineHeight: 1,
              transition: "opacity 0.5s ease",
            }}
          >
            {num}
          </span>
          <ThreadBinding width={40} height={12} color={C.shibori} />
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(22px, 3vw, 28px)",
            color: C.deepIndigo,
            fontWeight: 400,
            lineHeight: 1.3,
            marginBottom: 14,
            letterSpacing: "-0.01em",
          }}
        >
          {titleClean}
        </h3>

        {/* Client & Year */}
        <div
          style={{
            display: "flex",
            gap: 16,
            marginBottom: 16,
            fontFamily: "var(--font-inter)",
            fontSize: 11,
            color: C.shibori,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          <span>{project.client}</span>
          <span style={{ opacity: 0.3 }}>/</span>
          <span>{project.year}</span>
        </div>

        {/* Description */}
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: 14,
            lineHeight: 1.75,
            color: C.midIndigo,
            marginBottom: 12,
            maxWidth: 600,
          }}
        >
          {project.description}
        </p>

        {/* Technical */}
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: 13,
            lineHeight: 1.65,
            color: C.threadGray,
            marginBottom: 20,
            maxWidth: 600,
          }}
        >
          {project.technical}
        </p>

        {/* Tech tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {project.tech.map((t) => (
            <span
              key={t}
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: 11,
                color: C.shibori,
                padding: "4px 10px",
                background: `${C.shibori}0A`,
                border: `1px solid ${C.shibori}20`,
                borderRadius: 2,
                letterSpacing: "0.02em",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom thread binding decoration */}
      <div
        style={{
          position: "absolute",
          bottom: 8,
          left: "50%",
          transform: "translateX(-50%)",
          opacity: hovered ? 0.5 : 0.2,
          transition: "opacity 0.6s ease",
        }}
      >
        <ThreadBinding width={80} height={16} color={C.shibori} />
      </div>
    </motion.div>
  );
}

/* ━━━ Expertise Textile Swatch ━━━ */
function ExpertiseSwatch({
  item,
  index,
}: {
  item: (typeof expertise)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [hovered, setHovered] = useState(false);

  const techniqueNames = ["Kumo", "Arashi", "Itajime", "Kanoko"];
  const techniques = [
    <KumoPattern key="k" size={120} opacity={0.2} />,
    <ArashiPattern key="a" width={200} height={120} opacity={0.15} />,
    <ItajimePattern key="i" size={120} opacity={0.2} />,
    <KanokoPattern key="ka" size={120} opacity={0.18} />,
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
      transition={{ duration: 1, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.warmCream,
        borderRadius: 4,
        padding: "36px 32px 32px",
        position: "relative",
        overflow: "hidden",
        border: `1px solid ${C.linen}`,
        boxShadow: hovered
          ? `0 6px 24px rgba(26,39,68,0.08)`
          : `0 1px 8px rgba(26,39,68,0.03)`,
        transition: "box-shadow 0.5s ease",
      }}
    >
      {/* Pattern background */}
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          opacity: hovered ? 0.35 : 0.15,
          transition: "opacity 0.5s ease",
          pointerEvents: "none",
        }}
      >
        {techniques[index]}
      </div>

      {/* Technique label */}
      <span
        style={{
          fontFamily: "var(--font-instrument)",
          fontStyle: "italic",
          fontSize: 11,
          color: C.shibori,
          opacity: 0.6,
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          display: "block",
          marginBottom: 14,
        }}
      >
        {techniqueNames[index]} Technique
      </span>

      {/* Top accent stitch */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${C.shibori}60, transparent)`,
        }}
      />

      <h3
        style={{
          fontFamily: "var(--font-playfair)",
          fontSize: "clamp(18px, 2.2vw, 22px)",
          color: C.deepIndigo,
          fontWeight: 400,
          lineHeight: 1.3,
          marginBottom: 14,
          letterSpacing: "-0.01em",
          position: "relative",
          zIndex: 1,
        }}
      >
        {item.title}
      </h3>

      <p
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: 13,
          lineHeight: 1.7,
          color: C.midIndigo,
          position: "relative",
          zIndex: 1,
        }}
      >
        {item.body}
      </p>

      {/* Bottom thread detail */}
      <div style={{ marginTop: 20, position: "relative", zIndex: 1 }}>
        <ThreadBinding width={50} height={14} color={C.shibori} />
      </div>
    </motion.div>
  );
}

/* ━━━ Tool Loom Thread ━━━ */
function ToolLoomGroup({
  group,
  index,
}: {
  group: (typeof tools)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.9, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        padding: "20px 0",
      }}
    >
      {/* Warp thread (horizontal line behind) */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          height: 1,
          background: `linear-gradient(90deg, ${C.shibori}30, ${C.shibori}15, ${C.shibori}30)`,
          transform: "translateY(-50%)",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          position: "relative",
          zIndex: 1,
          flexWrap: "wrap",
        }}
      >
        {/* Label — the shuttle */}
        <div
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: C.shibori,
            fontWeight: 600,
            minWidth: 90,
            padding: "6px 14px",
            background: C.warmCream,
            border: `1px solid ${C.shibori}30`,
            borderRadius: 2,
            textAlign: "center",
            flexShrink: 0,
          }}
        >
          {group.label}
        </div>

        {/* Weft threads (individual items) */}
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {group.items.map((item, i) => (
            <motion.span
              key={item}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 + i * 0.08 }}
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: 12,
                color: C.deepIndigo,
                padding: "5px 12px",
                background: hovered
                  ? `linear-gradient(135deg, ${C.naturalWhite}, ${C.warmCream})`
                  : C.naturalWhite,
                border: `1px solid ${hovered ? C.shibori + "40" : C.linen}`,
                borderRadius: 2,
                transition: "border-color 0.4s ease, background 0.4s ease",
                position: "relative",
              }}
            >
              {item}
              {/* Mini weave intersection dot */}
              {i < group.items.length - 1 && (
                <span
                  style={{
                    position: "absolute",
                    right: -5,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 3,
                    height: 3,
                    borderRadius: "50%",
                    background: C.shibori,
                    opacity: 0.3,
                  }}
                />
              )}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ━━━ Animated Indigo Dip Effect (for hero text) ━━━ */
function IndigoDipText({ text }: { text: string }) {
  const [dipped, setDipped] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDipped(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.span
      style={{
        display: "inline-block",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <motion.span
        style={{
          display: "inline-block",
          background: `linear-gradient(180deg, ${C.resistWhite} 0%, ${C.resistWhite} 20%, ${C.shibori} 50%, ${C.deepIndigo} 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
        initial={{ backgroundPosition: "0 -100%" }}
        animate={dipped ? { backgroundPosition: "0 0%" } : {}}
        transition={{ duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {text}
      </motion.span>
    </motion.span>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/*                      MAIN PAGE                             */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function ShiboriPage() {
  return (
    <div
      style={{
        background: `linear-gradient(180deg, ${C.naturalWhite} 0%, ${C.resistWhite} 30%, ${C.warmCream} 60%, ${C.naturalWhite} 100%)`,
        color: C.deepIndigo,
        minHeight: "100vh",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @keyframes dyeSpread {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes fabricRipple {
          0%, 100% { transform: translateY(0); }
          25% { transform: translateY(-2px); }
          50% { transform: translateY(1px); }
          75% { transform: translateY(-1px); }
        }
        @keyframes threadPull {
          0% { stroke-dashoffset: 100; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes indigoDip {
          0% { background-position: 0 -200%; }
          100% { background-position: 0 0%; }
        }
        @keyframes patternReveal {
          0% { clip-path: circle(0% at 50% 50%); }
          100% { clip-path: circle(100% at 50% 50%); }
        }
        @keyframes waveRipple {
          0%, 100% { transform: translateX(0) scaleY(1); }
          25% { transform: translateX(2px) scaleY(1.02); }
          50% { transform: translateX(-1px) scaleY(0.98); }
          75% { transform: translateX(1px) scaleY(1.01); }
        }
        @keyframes floatGentle {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          33% { transform: translateY(-4px) rotate(0.5deg); }
          66% { transform: translateY(2px) rotate(-0.3deg); }
        }
        @keyframes shimmerIndigo {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .shibori-hero-title {
          font-family: var(--font-playfair);
          font-size: clamp(60px, 10vw, 120px);
          font-weight: 400;
          letter-spacing: 0.25em;
          line-height: 1;
          background: linear-gradient(
            180deg,
            #FFF8F0 0%,
            #F5F0E8 15%,
            #6B82A8 40%,
            #3A5A8A 60%,
            #1A2744 85%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: indigoDip 3s ease-out forwards;
        }

        .shibori-shimmer {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(58, 90, 138, 0.08) 50%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: shimmerIndigo 8s ease-in-out infinite;
        }

        .shibori-fabric-ripple {
          animation: fabricRipple 6s ease-in-out infinite;
        }

        .shibori-float {
          animation: floatGentle 8s ease-in-out infinite;
        }
      `}</style>

      {/* ── Fixed side decorations ── */}
      <div
        style={{
          position: "fixed",
          left: 16,
          top: "50%",
          transform: "translateY(-50%)",
          writingMode: "vertical-rl",
          fontFamily: "var(--font-inter)",
          fontSize: 11,
          letterSpacing: "0.3em",
          color: C.shibori,
          opacity: 0.1,
          zIndex: 10,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        絞り染め &mdash; shibori
      </div>

      <div
        style={{
          position: "fixed",
          right: 16,
          top: "45%",
          transform: "translateY(-50%)",
          writingMode: "vertical-rl",
          fontFamily: "var(--font-inter)",
          fontSize: 10,
          letterSpacing: "0.25em",
          color: C.shibori,
          opacity: 0.07,
          zIndex: 10,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        藍染 &mdash; indigo
      </div>

      {/* ── Fixed needle & thread decoration ── */}
      <div
        style={{
          position: "fixed",
          right: 40,
          top: 80,
          zIndex: 5,
          pointerEvents: "none",
          opacity: 0.15,
        }}
        className="shibori-float"
      >
        <NeedleThread size={50} />
      </div>

      {/* ════════════════════════════════════════════════════════ */}
      {/*                     HERO SECTION                       */}
      {/* ════════════════════════════════════════════════════════ */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          padding: "0 24px",
          overflow: "hidden",
        }}
      >
        {/* Background shibori pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: 0.6,
          }}
        >
          <HeroShiboriPattern />
        </div>

        {/* Indigo gradient vignette from bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "40%",
            background: `linear-gradient(to top, ${C.deepIndigo}08, transparent)`,
            pointerEvents: "none",
          }}
        />

        {/* Hero content */}
        <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <Reveal>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 14,
                marginBottom: 40,
              }}
            >
              <NeedleThread size={28} />
              <span
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  color: C.shibori,
                }}
              >
                AI Product Studio
              </span>
              <IndigoVat size={28} />
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <h1 className="shibori-hero-title">
              SHIBORI
            </h1>
          </Reveal>

          <Reveal delay={0.6}>
            <p
              style={{
                fontFamily: "var(--font-instrument)",
                fontStyle: "italic",
                fontSize: "clamp(14px, 1.8vw, 18px)",
                lineHeight: 1.8,
                color: C.midIndigo,
                maxWidth: 480,
                margin: "32px auto 0",
                fontWeight: 300,
              }}
            >
              Resist, bind, dip, reveal. Each project shaped by the tension
              between constraint and possibility &mdash; like indigo finding
              its way through cloth.
            </p>
          </Reveal>

          <Reveal delay={0.9}>
            <div
              style={{
                marginTop: 56,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              {/* Fabric fold lines as scroll indicator */}
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                  key={i}
                  style={{
                    width: 40 - i * 8,
                    height: 1,
                    background: C.shibori,
                    opacity: 0.3 - i * 0.08,
                  }}
                  animate={{ scaleX: [1, 1.3, 1] }}
                  transition={{
                    duration: 2.5,
                    delay: i * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </Reveal>
        </div>

        {/* Fabric fold texture at bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            pointerEvents: "none",
          }}
        >
          <FabricFoldDivider color={C.shibori} />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════ */}
      {/*                   STATS — DYE VATS                     */}
      {/* ════════════════════════════════════════════════════════ */}
      <section
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "80px 24px 100px",
        }}
      >
        <Reveal>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "clamp(32px, 6vw, 80px)",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {stats.map((stat, i) => {
              const ref = useRef<HTMLDivElement>(null);
              const inView = useInView(ref, { once: true, margin: "-40px" });

              return (
                <motion.div
                  ref={ref}
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                  transition={{ duration: 1, delay: i * 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                  style={{
                    width: 140,
                    height: 140,
                    borderRadius: "50%",
                    border: `1.5px solid ${C.shibori}30`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    background: `radial-gradient(circle at 40% 35%, ${C.naturalWhite}, ${C.warmCream})`,
                  }}
                >
                  {/* Dye ring effect */}
                  <div
                    style={{
                      position: "absolute",
                      inset: -4,
                      borderRadius: "50%",
                      border: `1px dashed ${C.shibori}20`,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-playfair)",
                      fontSize: 36,
                      color: C.deepIndigo,
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {stat.value}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: 10,
                      color: C.shibori,
                      textTransform: "uppercase",
                      letterSpacing: "0.16em",
                      marginTop: 8,
                    }}
                  >
                    {stat.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </Reveal>
      </section>

      {/* Fabric fold divider */}
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "0 24px",
          pointerEvents: "none",
        }}
      >
        <FabricFoldDivider color={C.shibori} />
      </div>

      {/* ════════════════════════════════════════════════════════ */}
      {/*                    PROJECTS                            */}
      {/* ════════════════════════════════════════════════════════ */}
      <section
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "100px 24px 80px",
        }}
      >
        <Reveal>
          <div style={{ marginBottom: 72 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 14,
              }}
            >
              <KumoPattern size={32} opacity={0.4} />
              <span
                style={{
                  fontFamily: "var(--font-instrument)",
                  fontStyle: "italic",
                  fontSize: 13,
                  color: C.shibori,
                  opacity: 0.6,
                  letterSpacing: "0.08em",
                }}
              >
                Textile Archive
              </span>
            </div>
            <h2
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "clamp(28px, 4vw, 42px)",
                fontWeight: 400,
                color: C.deepIndigo,
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
              }}
            >
              Selected Works
            </h2>
            <div
              style={{
                width: 60,
                height: 2,
                background: `linear-gradient(90deg, ${C.shibori}, transparent)`,
                marginTop: 20,
              }}
            />
          </div>
        </Reveal>

        {/* Project cards */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 48,
          }}
        >
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </section>

      {/* Pattern divider */}
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "40px 24px",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 40,
            opacity: 0.25,
          }}
        >
          <KumoPattern size={60} opacity={0.5} />
          <ArashiPattern width={120} height={60} opacity={0.4} />
          <ItajimePattern size={60} opacity={0.5} />
          <KanokoPattern size={60} opacity={0.4} />
        </div>
      </div>

      <FabricFoldDivider color={C.shibori} />

      {/* ════════════════════════════════════════════════════════ */}
      {/*                    EXPERTISE                           */}
      {/* ════════════════════════════════════════════════════════ */}
      <section
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "100px 24px 80px",
        }}
      >
        <Reveal>
          <div style={{ marginBottom: 64 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 14,
              }}
            >
              <NeedleThread size={24} />
              <span
                style={{
                  fontFamily: "var(--font-instrument)",
                  fontStyle: "italic",
                  fontSize: 13,
                  color: C.shibori,
                  opacity: 0.6,
                  letterSpacing: "0.08em",
                }}
              >
                Dyeing Techniques
              </span>
            </div>
            <h2
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "clamp(28px, 4vw, 42px)",
                fontWeight: 400,
                color: C.deepIndigo,
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
              }}
            >
              Areas of Expertise
            </h2>
            <div
              style={{
                width: 60,
                height: 2,
                background: `linear-gradient(90deg, ${C.shibori}, transparent)`,
                marginTop: 20,
              }}
            />
          </div>
        </Reveal>

        {/* 2-column grid of swatches */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: 32,
          }}
        >
          {expertise.map((item, i) => (
            <ExpertiseSwatch key={item.title} item={item} index={i} />
          ))}
        </div>
      </section>

      {/* Thread fringe divider */}
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "20px 24px",
          pointerEvents: "none",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <ThreadFringe width={600} />
      </div>

      {/* ════════════════════════════════════════════════════════ */}
      {/*                       TOOLS — THE LOOM                 */}
      {/* ════════════════════════════════════════════════════════ */}
      <section
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "100px 24px 80px",
        }}
      >
        <Reveal>
          <div style={{ marginBottom: 64 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 14,
              }}
            >
              <ThreadBinding width={40} height={14} color={C.shibori} />
              <span
                style={{
                  fontFamily: "var(--font-instrument)",
                  fontStyle: "italic",
                  fontSize: 13,
                  color: C.shibori,
                  opacity: 0.6,
                  letterSpacing: "0.08em",
                }}
              >
                The Loom
              </span>
            </div>
            <h2
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "clamp(28px, 4vw, 42px)",
                fontWeight: 400,
                color: C.deepIndigo,
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
              }}
            >
              Tools &amp; Technologies
            </h2>
            <div
              style={{
                width: 60,
                height: 2,
                background: `linear-gradient(90deg, ${C.shibori}, transparent)`,
                marginTop: 20,
              }}
            />
          </div>
        </Reveal>

        {/* Loom structure */}
        <div
          style={{
            position: "relative",
            padding: "20px 0",
          }}
        >
          {/* Vertical warp threads (background) */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              justifyContent: "space-between",
              paddingLeft: 120,
              pointerEvents: "none",
            }}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 1,
                  height: "100%",
                  background: `${C.shibori}${i % 3 === 0 ? "15" : "08"}`,
                }}
              />
            ))}
          </div>

          {/* Tool groups as horizontal weft */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {tools.map((group, i) => (
              <ToolLoomGroup key={group.label} group={group} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════ */}
      {/*                       FOOTER                           */}
      {/* ════════════════════════════════════════════════════════ */}

      {/* Indigo gradient transition into footer */}
      <div
        style={{
          height: 120,
          background: `linear-gradient(to bottom, transparent, ${C.deepIndigo}0A)`,
          pointerEvents: "none",
        }}
      />

      <footer
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "60px 24px 120px",
          position: "relative",
        }}
      >
        {/* Thread fringe decoration at top of footer */}
        <div
          style={{
            marginBottom: 56,
            display: "flex",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <ThreadFringe width={500} />
        </div>

        <Reveal>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: 20,
            }}
          >
            {/* Artisan stamp — indigo vat mark */}
            <motion.div
              animate={{ rotate: [0, 2, -2, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <IndigoVat size={52} />
            </motion.div>

            {/* "WOVEN WITH CARE" */}
            <DyeSpread delay={0.2}>
              <p
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.35em",
                  color: C.shibori,
                  opacity: 0.5,
                  marginBottom: 8,
                }}
              >
                Woven With Care
              </p>
            </DyeSpread>

            <p
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "clamp(22px, 3vw, 30px)",
                fontWeight: 400,
                color: C.deepIndigo,
                lineHeight: 1.4,
                maxWidth: 420,
              }}
            >
              Grox Textile Studio
            </p>

            <p
              style={{
                fontFamily: "var(--font-instrument)",
                fontStyle: "italic",
                fontSize: 14,
                color: C.midIndigo,
                opacity: 0.7,
                maxWidth: 360,
                lineHeight: 1.7,
              }}
            >
              Every pattern begins with a single binding &mdash; every product
              with a clear intention.
            </p>

            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: 13,
                color: C.shibori,
                opacity: 0.5,
                letterSpacing: "0.02em",
                marginTop: 4,
              }}
            >
              hello@grox.studio
            </p>

            <div
              style={{
                display: "flex",
                gap: 24,
                marginTop: 12,
              }}
            >
              <a
                href="https://github.com/1aday"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: 12,
                  color: C.shibori,
                  textDecoration: "none",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  opacity: 0.4,
                  transition: "opacity 0.5s ease",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.opacity = "0.9";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.opacity = "0.4";
                }}
              >
                GitHub
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: 12,
                  color: C.shibori,
                  textDecoration: "none",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  opacity: 0.4,
                  transition: "opacity 0.5s ease",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.opacity = "0.9";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.opacity = "0.4";
                }}
              >
                Twitter
              </a>
            </div>

            {/* Divider line */}
            <div
              style={{
                width: "100%",
                maxWidth: 200,
                height: 1,
                background: `linear-gradient(90deg, transparent, ${C.shibori}40, transparent)`,
                margin: "28px auto 0",
              }}
            />

            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: 11,
                color: C.shibori,
                opacity: 0.3,
                letterSpacing: "0.04em",
                marginTop: 8,
              }}
            >
              &copy; {new Date().getFullYear()} Grox &mdash; ⊜
            </p>
          </div>
        </Reveal>

        {/* Bottom pattern decoration */}
        <div
          style={{
            marginTop: 64,
            opacity: 0.15,
            pointerEvents: "none",
            display: "flex",
            justifyContent: "center",
            gap: 20,
          }}
        >
          <KumoPattern size={40} opacity={0.5} />
          <ItajimePattern size={40} opacity={0.5} />
          <KanokoPattern size={40} opacity={0.5} />
        </div>

        {/* Final fabric fold */}
        <div
          style={{
            marginTop: 40,
            pointerEvents: "none",
          }}
        >
          <FabricFoldDivider color={C.shibori} />
        </div>
      </footer>

      <ThemeSwitcher current="/shibori" variant="light" />
    </div>
  );
}
