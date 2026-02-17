"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "@/app/data/projects";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";
import { getProjectImage } from "@/lib/theme-images";

/* ─── Color Palette ─── */
const C = {
  bg: "#FAFAF8",
  pencil: "#2D2D2D",
  pencilMuted: "rgba(45,45,45,0.5)",
  pencilLight: "rgba(45,45,45,0.08)",
  marker: "#2563EB",
  markerLight: "rgba(37,99,235,0.1)",
  highlight: "#FDE68A",
  highlightStrong: "#FBBF24",
  red: "#DC2626",
  redLight: "rgba(220,38,38,0.08)",
  white: "#FFFFFF",
  ruled: "rgba(37,99,235,0.08)",
  shadow1: "rgba(45,45,45,0.06)",
  shadow2: "rgba(45,45,45,0.12)",
};

/* ─── Wobbly SVG Path Generator ─── */
function wobblyRect(
  w: number,
  h: number,
  seed: number = 0,
  jitter: number = 3
): string {
  const j = (i: number) => {
    const pseudo = Math.sin(seed * 13.37 + i * 7.91) * jitter;
    return pseudo;
  };
  return [
    `M ${2 + j(0)},${2 + j(1)}`,
    `C ${w * 0.25 + j(2)},${-1 + j(3)} ${w * 0.75 + j(4)},${3 + j(5)} ${w - 2 + j(6)},${2 + j(7)}`,
    `C ${w + 1 + j(8)},${h * 0.25 + j(9)} ${w - 2 + j(10)},${h * 0.75 + j(11)} ${w - 2 + j(12)},${h - 2 + j(13)}`,
    `C ${w * 0.75 + j(14)},${h + 1 + j(15)} ${w * 0.25 + j(16)},${h - 2 + j(17)} ${2 + j(18)},${h - 2 + j(19)}`,
    `C ${-1 + j(20)},${h * 0.75 + j(21)} ${3 + j(22)},${h * 0.25 + j(23)} ${2 + j(24)},${2 + j(25)}`,
  ].join(" ");
}

function wobblyLine(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  seed: number = 0
): string {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const j1 = Math.sin(seed * 9.3) * 4;
  const j2 = Math.cos(seed * 7.1) * 3;
  return `M ${x1},${y1} Q ${mx + j1},${my + j2} ${x2},${y2}`;
}

/* ─── Texture Overlay ─── */
function PaperTexture() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        background: `
          repeating-linear-gradient(
            to bottom,
            transparent 0px,
            transparent 31px,
            ${C.ruled} 31px,
            ${C.ruled} 32px
          )
        `,
        opacity: 0.6,
      }}
    />
  );
}

/* ─── SVG Decorations ─── */
function MarkerUnderline({
  width = 200,
  color = C.marker,
  delay = 0,
}: {
  width?: number;
  color?: string;
  delay?: number;
}) {
  const path = `M 0,8 Q ${width * 0.2},2 ${width * 0.5},7 Q ${width * 0.8},12 ${width},6`;
  return (
    <svg
      width={width}
      height={16}
      viewBox={`0 0 ${width} 16`}
      fill="none"
      style={{ display: "block", overflow: "visible" }}
    >
      <motion.path
        d={path}
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay, ease: "easeOut" }}
      />
    </svg>
  );
}

function CircleAnnotation({
  width = 80,
  height = 40,
  color = C.red,
  seed = 1,
}: {
  width?: number;
  height?: number;
  color?: string;
  seed?: number;
}) {
  const cx = width / 2;
  const cy = height / 2;
  const rx = width / 2 - 4;
  const ry = height / 2 - 4;
  const j = (i: number) => Math.sin(seed * 5.7 + i * 3.3) * 3;
  const path = `M ${cx - rx + j(0)},${cy + j(1)}
    C ${cx - rx + j(2)},${cy - ry + j(3)} ${cx + rx + j(4)},${cy - ry + j(5)} ${cx + rx + j(6)},${cy + j(7)}
    C ${cx + rx + j(8)},${cy + ry + j(9)} ${cx - rx + j(10)},${cy + ry + j(11)} ${cx - rx + j(12)},${cy + j(13)}`;
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
      }}
    >
      <motion.path
        d={path}
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
      />
    </svg>
  );
}

function DoodleStar({
  size = 20,
  color = C.highlightStrong,
  style = {},
}: {
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ display: "inline-block", ...style }}
    >
      <path
        d="M12 2 L14 9 L21 9 L15.5 13.5 L17.5 21 L12 16.5 L6.5 21 L8.5 13.5 L3 9 L10 9 Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={color}
        opacity={0.8}
      />
    </svg>
  );
}

function DoodleArrow({
  direction = "right",
  color = C.pencilMuted,
  size = 40,
}: {
  direction?: "right" | "down" | "left";
  color?: string;
  size?: number;
}) {
  const paths: Record<string, string> = {
    right: "M 4,20 Q 20,8 36,18 M 30,12 L 36,18 L 28,22",
    down: "M 20,4 Q 8,20 18,36 M 12,30 L 18,36 L 22,28",
    left: "M 36,20 Q 20,8 4,18 M 10,12 L 4,18 L 12,22",
  };
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      animate={{ rotate: [0, 2, -2, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <path
        d={paths[direction]}
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </motion.svg>
  );
}

function DoodleExclamation({
  color = C.red,
  style = {},
}: {
  color?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width={12}
      height={24}
      viewBox="0 0 12 24"
      fill="none"
      style={{ display: "inline-block", ...style }}
    >
      <path
        d="M6 2 L6.5 15"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <circle cx={6} cy={20} r={1.8} fill={color} />
    </svg>
  );
}

function HandDrawnCheckmark({ checked = true }: { checked?: boolean }) {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <rect
        x={3}
        y={3}
        width={18}
        height={18}
        rx={2}
        stroke={C.pencil}
        strokeWidth={1.8}
        fill="none"
      />
      {checked && (
        <path
          d="M7 12.5 L10.5 16 L17 8"
          stroke={C.marker}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      )}
    </svg>
  );
}

/* ─── WobblyBorderCard ─── */
function WobblyBorderCard({
  children,
  seed = 0,
  style = {},
  hoverLift = true,
  className = "",
}: {
  children: React.ReactNode;
  seed?: number;
  style?: React.CSSProperties;
  hoverLift?: boolean;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      style={{
        position: "relative",
        padding: "24px",
        ...style,
      }}
      whileHover={
        hoverLift
          ? { y: -4, boxShadow: `0 8px 24px ${C.shadow2}` }
          : undefined
      }
      transition={{ duration: 0.2 }}
    >
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
        viewBox="0 0 300 200"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d={wobblyRect(300, 200, seed, 3)}
          stroke={C.pencil}
          strokeWidth={1.5}
          fill={C.white}
          opacity={0.95}
        />
      </svg>
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </motion.div>
  );
}

/* ─── Divider ─── */
function SketchDivider() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: "48px 0",
      }}
    >
      <DoodleStar size={14} color={C.pencilMuted} />
      <svg width={200} height={12} viewBox="0 0 200 12" fill="none">
        <path
          d={wobblyLine(0, 6, 200, 6, 42)}
          stroke={C.pencilMuted}
          strokeWidth={1.2}
          strokeLinecap="round"
          strokeDasharray="8 4"
        />
      </svg>
      <DoodleStar size={14} color={C.pencilMuted} />
      <svg width={200} height={12} viewBox="0 0 200 12" fill="none">
        <path
          d={wobblyLine(0, 6, 200, 6, 99)}
          stroke={C.pencilMuted}
          strokeWidth={1.2}
          strokeLinecap="round"
          strokeDasharray="8 4"
        />
      </svg>
      <DoodleStar size={14} color={C.pencilMuted} />
    </div>
  );
}

/* ─── Section Header ─── */
function SectionHeader({
  title,
  subtitle,
  markerWidth = 220,
}: {
  title: string;
  subtitle?: string;
  markerWidth?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      style={{ marginBottom: 48, textAlign: "center" }}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <h2
        style={{
          fontFamily: "var(--font-jakarta), sans-serif",
          fontSize: "clamp(2rem, 4vw, 2.75rem)",
          fontWeight: 800,
          color: C.pencil,
          letterSpacing: "-0.03em",
          lineHeight: 1.2,
          marginBottom: 8,
        }}
      >
        {title}
      </h2>
      {inView && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <MarkerUnderline width={markerWidth} />
        </div>
      )}
      {subtitle && (
        <p
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 16,
            color: C.pencilMuted,
            marginTop: 16,
            maxWidth: 520,
            marginInline: "auto",
            lineHeight: 1.6,
          }}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

/* ─── ScrollReveal Wrapper ─── */
function Reveal({
  children,
  delay = 0,
  style = {},
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      style={style}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Sticky Note ─── */
function StickyNote({
  children,
  rotation = -2,
  style = {},
}: {
  children: React.ReactNode;
  rotation?: number;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      style={{
        background: C.highlight,
        padding: "20px 24px",
        transform: `rotate(${rotation}deg)`,
        boxShadow: `2px 3px 8px ${C.shadow2}`,
        position: "relative",
        ...style,
      }}
      whileHover={{
        rotate: rotation + (rotation > 0 ? -1 : 1),
        y: -4,
        boxShadow: `3px 5px 14px ${C.shadow2}`,
      }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Tape Mark ─── */
function TapeMark({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const posMap: Record<string, React.CSSProperties> = {
    tl: { top: -6, left: 12, transform: "rotate(-15deg)" },
    tr: { top: -6, right: 12, transform: "rotate(12deg)" },
    bl: { bottom: -6, left: 12, transform: "rotate(8deg)" },
    br: { bottom: -6, right: 12, transform: "rotate(-10deg)" },
  };
  return (
    <div
      style={{
        position: "absolute",
        width: 40,
        height: 14,
        background: "rgba(253,230,138,0.7)",
        border: `1px solid rgba(251,191,36,0.3)`,
        zIndex: 2,
        ...posMap[position],
      }}
    />
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   NAVIGATION
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function Navigation() {
  const links = [
    { label: "Projects", href: "#projects" },
    { label: "Expertise", href: "#expertise" },
    { label: "Tools", href: "#tools" },
  ];

  return (
    <motion.nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: `${C.white}ee`,
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${C.pencilLight}`,
      }}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <a
          href="#"
          style={{
            fontFamily: "var(--font-jakarta), sans-serif",
            fontWeight: 800,
            fontSize: 24,
            color: C.pencil,
            textDecoration: "none",
            letterSpacing: "-0.04em",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          GRO
          <span style={{ color: C.marker }}>X</span>
          <DoodleStar size={14} color={C.highlightStrong} style={{ marginLeft: 2, marginBottom: 8 }} />
        </a>

        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 14,
                fontWeight: 500,
                color: C.pencil,
                textDecoration: "none",
                position: "relative",
                padding: "4px 0",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget.querySelector("span") as HTMLElement;
                if (el) el.style.width = "100%";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget.querySelector("span") as HTMLElement;
                if (el) el.style.width = "0%";
              }}
            >
              {link.label}
              <span
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "0%",
                  height: 3,
                  background: C.marker,
                  borderRadius: 2,
                  transition: "width 0.25s ease",
                  opacity: 0.6,
                }}
              />
            </a>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   HERO SECTION
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function HeroSection() {
  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "120px 24px 80px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative doodles */}
      <div
        style={{ position: "absolute", top: 100, left: "8%", opacity: 0.4 }}
      >
        <DoodleArrow direction="right" color={C.pencilMuted} size={50} />
      </div>
      <div
        style={{ position: "absolute", top: 140, right: "10%", opacity: 0.3 }}
      >
        <DoodleStar size={28} color={C.highlightStrong} />
      </div>
      <div
        style={{ position: "absolute", bottom: 180, left: "12%", opacity: 0.25 }}
      >
        <DoodleExclamation />
      </div>
      <div
        style={{ position: "absolute", bottom: 140, right: "15%", opacity: 0.35 }}
      >
        <DoodleArrow direction="down" color={C.pencilMuted} size={36} />
      </div>

      {/* Main title */}
      <motion.div
        style={{ textAlign: "center", maxWidth: 800, position: "relative" }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* "handwritten" annotation above */}
        <motion.p
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 14,
            color: C.pencilMuted,
            marginBottom: 16,
            fontStyle: "italic",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          ~ a portfolio of ~
        </motion.p>

        <h1
          style={{
            fontFamily: "var(--font-jakarta), sans-serif",
            fontSize: "clamp(2.8rem, 7vw, 5rem)",
            fontWeight: 800,
            color: C.pencil,
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
            marginBottom: 8,
          }}
        >
          <span style={{ position: "relative", display: "inline" }}>
            digital craft
            <span
              style={{
                position: "absolute",
                bottom: -4,
                left: -4,
                right: -4,
                overflow: "visible",
              }}
            >
              <MarkerUnderline width={380} delay={0.4} />
            </span>
          </span>
          {" & "}
          <span style={{ position: "relative", display: "inline-block" }}>
            <span style={{ position: "relative", display: "inline" }}>
              AI
              <CircleAnnotation width={70} height={60} seed={3} />
            </span>
          </span>
        </h1>

        <motion.p
          style={{
            fontFamily: "var(--font-jakarta), sans-serif",
            fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
            fontWeight: 600,
            color: C.marker,
            marginTop: 20,
            letterSpacing: "-0.01em",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          AI Product Engineer
        </motion.p>

        <motion.p
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 16,
            color: C.pencilMuted,
            marginTop: 16,
            maxWidth: 500,
            marginInline: "auto",
            lineHeight: 1.7,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Building thoughtful products at the intersection of design,
          engineering, and artificial intelligence. Every pixel tells a story.
        </motion.p>
      </motion.div>

      {/* Stats as sticky notes */}
      <motion.div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 24,
          justifyContent: "center",
          marginTop: 56,
          maxWidth: 700,
        }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        {stats.map((stat, i) => {
          const rotations = [-3, 1.5, -1, 2.5];
          return (
            <StickyNote
              key={stat.label}
              rotation={rotations[i % rotations.length]}
              style={{ minWidth: 130, textAlign: "center" }}
            >
              <div
                style={{
                  fontFamily: "var(--font-jakarta), sans-serif",
                  fontSize: 28,
                  fontWeight: 800,
                  color: C.pencil,
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: 12,
                  color: C.pencilMuted,
                  marginTop: 6,
                  lineHeight: 1.3,
                }}
              >
                {stat.label}
              </div>
            </StickyNote>
          );
        })}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        style={{
          position: "absolute",
          bottom: 32,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 11,
            color: C.pencilMuted,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          scroll
        </span>
        <DoodleArrow direction="down" size={28} color={C.pencilMuted} />
      </motion.div>
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PROJECT CARD
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 40,
        alignItems: "center",
        marginBottom: 64,
      }}
    >
      {/* Image side */}
      <div
        style={{
          order: isEven ? 1 : 2,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "relative",
            borderRadius: 4,
            overflow: "hidden",
            background: C.pencilLight,
            aspectRatio: "16/10",
          }}
        >
          <TapeMark position="tl" />
          <TapeMark position="tr" />
          {project.image && (
            <img
              src={getProjectImage("sketch", project.image)}
              alt={project.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                filter: "saturate(0.9)",
              }}
            />
          )}
        </div>
        {/* Year annotation */}
        <div
          style={{
            position: "absolute",
            top: -12,
            right: isEven ? -16 : undefined,
            left: isEven ? undefined : -16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width={48} height={48} viewBox="0 0 48 48" fill="none">
            <circle
              cx={24}
              cy={24}
              r={20}
              stroke={C.red}
              strokeWidth={1.5}
              fill="none"
              strokeDasharray="4 2"
            />
            <text
              x={24}
              y={27}
              textAnchor="middle"
              fill={C.red}
              fontSize={12}
              fontWeight={700}
              fontFamily="var(--font-inter)"
            >
              {project.year}
            </text>
          </svg>
        </div>
      </div>

      {/* Content side */}
      <div style={{ order: isEven ? 2 : 1 }}>
        <WobblyBorderCard seed={index * 7 + 3} style={{ background: "transparent" }}>
          <h3
            style={{
              fontFamily: "var(--font-jakarta), sans-serif",
              fontSize: 22,
              fontWeight: 700,
              color: C.pencil,
              marginBottom: 8,
              letterSpacing: "-0.02em",
            }}
          >
            {project.title}
          </h3>

          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 14,
              color: C.pencilMuted,
              lineHeight: 1.7,
              marginBottom: 16,
            }}
          >
            {project.description}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {project.tech.map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: 11,
                  fontWeight: 500,
                  color: C.marker,
                  background: C.markerLight,
                  padding: "4px 10px",
                  borderRadius: 2,
                  letterSpacing: "0.02em",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Small doodle arrow */}
          <div style={{ marginTop: 16 }}>
            <DoodleArrow direction="right" color={C.marker} size={32} />
          </div>
        </WobblyBorderCard>
      </div>
    </motion.div>
  );
}

function ProjectsSection() {
  return (
    <section id="projects" style={{ padding: "40px 24px 80px", maxWidth: 1100, margin: "0 auto" }}>
      <SectionHeader
        title="Selected Projects"
        subtitle="A curated collection of work spanning product design, AI systems, and creative engineering."
        markerWidth={260}
      />
      {projects.map((project, i) => (
        <ProjectCard key={project.title} project={project} index={i} />
      ))}
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   EXPERTISE SECTION
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ExpertiseSection() {
  const oldApproaches = [
    "Waterfall planning",
    "Pixel-perfect mockups only",
    "Siloed departments",
    "Manual testing everything",
  ];

  return (
    <section id="expertise" style={{ padding: "40px 24px 80px", maxWidth: 1100, margin: "0 auto" }}>
      <SectionHeader
        title="Areas of Expertise"
        subtitle="Margin notes from years of building things that matter."
        markerWidth={240}
      />

      {/* "Old way vs new way" sticky note */}
      <Reveal style={{ display: "flex", justifyContent: "center", marginBottom: 48 }}>
        <StickyNote rotation={1.5} style={{ maxWidth: 340, padding: "16px 20px" }}>
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 12,
              color: C.pencilMuted,
              marginBottom: 8,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Things I used to do{" "}
            <DoodleExclamation color={C.red} style={{ marginLeft: 4 }} />
          </p>
          {oldApproaches.map((item) => (
            <p
              key={item}
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 13,
                color: C.red,
                textDecoration: "line-through",
                textDecorationColor: C.red,
                textDecorationThickness: 2,
                lineHeight: 1.8,
                opacity: 0.7,
              }}
            >
              {item}
            </p>
          ))}
        </StickyNote>
      </Reveal>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 28,
        }}
      >
        {expertise.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.1}>
            <div
              style={{
                position: "relative",
                background: C.white,
                border: `1px solid ${C.pencilLight}`,
                padding: 28,
                minHeight: 200,
                backgroundImage: `repeating-linear-gradient(
                  to bottom,
                  transparent 0px,
                  transparent 27px,
                  ${C.ruled} 27px,
                  ${C.ruled} 28px
                )`,
                backgroundPosition: "0 8px",
              }}
            >
              {/* Margin line (red, like a notebook) */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: 40,
                  width: 1,
                  background: C.redLight,
                }}
              />

              {/* Doodle icon area */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <span style={{ fontSize: 24, fontWeight: 700, color: C.marker }}>{String(i + 1).padStart(2, "0")}</span>
                {i % 3 === 0 && (
                  <DoodleExclamation
                    color={C.highlightStrong}
                    style={{ marginLeft: "auto" }}
                  />
                )}
                {i % 3 === 1 && (
                  <DoodleStar
                    size={16}
                    color={C.highlightStrong}
                    style={{ marginLeft: "auto" }}
                  />
                )}
              </div>

              <h3
                style={{
                  fontFamily: "var(--font-jakarta), sans-serif",
                  fontSize: 18,
                  fontWeight: 700,
                  color: C.pencil,
                  marginBottom: 8,
                  letterSpacing: "-0.02em",
                }}
              >
                {item.title}
              </h3>

              <p
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: 13,
                  color: C.pencilMuted,
                  lineHeight: 1.7,
                }}
              >
                {item.body}
              </p>

              {/* Wobbly corner decoration */}
              <svg
                width={40}
                height={40}
                viewBox="0 0 40 40"
                fill="none"
                style={{
                  position: "absolute",
                  bottom: 8,
                  right: 8,
                  opacity: 0.15,
                }}
              >
                <path
                  d={wobblyLine(0, 40, 40, 0, i * 3)}
                  stroke={C.pencil}
                  strokeWidth={1}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   TOOLS SECTION — "Supply List"
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ToolsSection() {
  return (
    <section id="tools" style={{ padding: "40px 24px 80px", maxWidth: 1100, margin: "0 auto" }}>
      <SectionHeader
        title="Tools & Supply List"
        subtitle="The instruments in my daily toolkit, each carefully chosen."
        markerWidth={250}
      />

      {/* Hand-drawn "supply list" header */}
      <Reveal style={{ display: "flex", justifyContent: "center", marginBottom: 36 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <DoodleArrow direction="down" color={C.pencilMuted} size={28} />
          <span
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 13,
              color: C.pencilMuted,
              fontStyle: "italic",
            }}
          >
            checked means &quot;use daily&quot;
          </span>
          <DoodleArrow direction="down" color={C.pencilMuted} size={28} />
        </div>
      </Reveal>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16,
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        {tools.map((category, ci) => (
          <Reveal key={category.label} delay={ci * 0.08}>
            <motion.div
              style={{
                padding: "16px 18px",
                background: C.white,
                border: `1px solid ${C.pencilLight}`,
                position: "relative",
                cursor: "default",
              }}
              whileHover={{
                y: -2,
                boxShadow: `2px 3px 10px ${C.shadow1}`,
              }}
              transition={{ duration: 0.15 }}
            >
              {/* Category label */}
              <div
                style={{
                  fontFamily: "var(--font-jakarta), sans-serif",
                  fontSize: 12,
                  fontWeight: 700,
                  color: C.marker,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <DoodleStar size={12} color={C.highlightStrong} />
                {category.label}
              </div>

              {/* Items as checklist */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {category.items.map((item) => (
                  <div
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "4px 0",
                    }}
                  >
                    <HandDrawnCheckmark checked />
                    <span
                      style={{
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: 13,
                        color: C.pencil,
                      }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   FOOTER
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function Footer() {
  return (
    <footer
      style={{
        padding: "64px 24px 40px",
        textAlign: "center",
        borderTop: `1px solid ${C.pencilLight}`,
        position: "relative",
      }}
    >
      {/* Decorative doodles */}
      <div
        style={{
          position: "absolute",
          top: 24,
          left: "20%",
          opacity: 0.2,
        }}
      >
        <DoodleStar size={20} color={C.highlightStrong} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 20,
          right: "22%",
          opacity: 0.2,
        }}
      >
        <DoodleStar size={16} color={C.highlightStrong} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 40,
          right: "35%",
          opacity: 0.15,
        }}
      >
        <DoodleStar size={12} color={C.pencilMuted} />
      </div>

      <Reveal>
        <div
          style={{
            fontFamily: "var(--font-jakarta), sans-serif",
            fontWeight: 800,
            fontSize: 32,
            color: C.pencil,
            letterSpacing: "-0.04em",
            marginBottom: 8,
          }}
        >
          GRO
          <span style={{ color: C.marker }}>X</span>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <MarkerUnderline width={80} color={C.marker} delay={0.2} />
        </div>

        <p
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 14,
            color: C.pencilMuted,
            marginBottom: 8,
            fontStyle: "italic",
          }}
        >
          Sketched with care, built with intention.
        </p>

        <p
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 12,
            color: C.pencilMuted,
            opacity: 0.6,
            marginBottom: 28,
          }}
        >
          &copy; {new Date().getFullYear()} GROX. Every line is deliberate.
        </p>

        {/* Sketchbook page number doodle */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 24,
          }}
        >
          <svg width={60} height={20} viewBox="0 0 60 20" fill="none">
            <path
              d={wobblyLine(0, 10, 60, 10, 77)}
              stroke={C.pencilLight}
              strokeWidth={1}
              strokeLinecap="round"
            />
          </svg>
          <span
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 11,
              color: C.pencilMuted,
              opacity: 0.5,
            }}
          >
            pg. 01
          </span>
          <svg width={60} height={20} viewBox="0 0 60 20" fill="none">
            <path
              d={wobblyLine(0, 10, 60, 10, 88)}
              stroke={C.pencilLight}
              strokeWidth={1}
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div style={{ marginTop: 8 }}>
          <ThemeSwitcher current="/sketch" variant="light" />
        </div>
      </Reveal>
    </footer>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MAIN PAGE COMPONENT
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function SketchPage() {
  return (
    <div
      style={{
        background: C.bg,
        color: C.pencil,
        minHeight: "100vh",
        position: "relative",
        fontFamily: "var(--font-inter), sans-serif",
        overflowX: "hidden",
      }}
    >
      <PaperTexture />

      <div style={{ position: "relative", zIndex: 1 }}>
        <Navigation />
        <HeroSection />
        <SketchDivider />
        <ProjectsSection />
        <SketchDivider />
        <ExpertiseSection />
        <SketchDivider />
        <ToolsSection />
        <Footer />
      </div>
    </div>
  );
}
