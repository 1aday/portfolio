"use client";
import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "@/app/data/projects";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";

/* ━━━ Palette: Washi paper, sumi ink, aged stone ━━━ */
const C = {
  bg: "#F7F5F0",
  card: "#FAFAF7",
  ink: "#2D2D2D",
  stone: "#8A8579",
  vermillion: "#CC3333",
  sand: "#E8E2D8",
  wash: "#D6D0C4",
};

/* ━━━ Contemplative scroll-reveal ━━━ */
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
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
      transition={{ duration: 1.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ━━━ SVG: Sand Raking Pattern 1 — concentric curves ━━━ */
function SandRakingConcentric({ style }: { style?: React.CSSProperties }) {
  return (
    <motion.svg
      viewBox="0 0 800 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "auto", ...style }}
      animate={{ x: [0, 1.5, 0, -1.5, 0] }}
      transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <path
          key={i}
          d={`M -20 ${150 + i * 4} Q 200 ${80 + i * 4}, 400 ${150 + i * 4} T 820 ${150 + i * 4}`}
          stroke={C.sand}
          strokeWidth="1"
          opacity={0.6 - i * 0.02}
        />
      ))}
    </motion.svg>
  );
}

/* ━━━ SVG: Sand Raking Pattern 2 — parallel flowing lines ━━━ */
function SandRakingParallel({ style }: { style?: React.CSSProperties }) {
  return (
    <motion.svg
      viewBox="0 0 900 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "auto", ...style }}
      animate={{ x: [0, -2, 0, 2, 0] }}
      transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
    >
      {Array.from({ length: 15 }).map((_, i) => (
        <path
          key={i}
          d={`M -10 ${20 + i * 11} C 150 ${14 + i * 11}, 300 ${26 + i * 11}, 450 ${20 + i * 11} S 750 ${14 + i * 11}, 910 ${20 + i * 11}`}
          stroke={C.sand}
          strokeWidth="0.8"
          opacity={0.5}
        />
      ))}
    </motion.svg>
  );
}

/* ━━━ SVG: Sand Raking Pattern 3 — around a stone (circle) ━━━ */
function SandRakingAroundStone({ style }: { style?: React.CSSProperties }) {
  return (
    <motion.svg
      viewBox="0 0 600 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "auto", ...style }}
      animate={{ x: [0, 1, 0, -1, 0] }}
      transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
    >
      {Array.from({ length: 10 }).map((_, i) => {
        const r = 40 + i * 8;
        return (
          <ellipse
            key={i}
            cx={300}
            cy={150}
            rx={r}
            ry={r * 0.65}
            stroke={C.sand}
            strokeWidth="0.8"
            opacity={0.45 - i * 0.02}
          />
        );
      })}
      {/* Extended lines flowing outward from the stone */}
      {Array.from({ length: 8 }).map((_, i) => (
        <path
          key={`line-${i}`}
          d={`M 0 ${100 + i * 14} C 100 ${100 + i * 14}, 170 ${130 + i * 6}, 180 ${150 + (i - 4) * 3}`}
          stroke={C.sand}
          strokeWidth="0.7"
          opacity={0.4}
        />
      ))}
      {Array.from({ length: 8 }).map((_, i) => (
        <path
          key={`line-r-${i}`}
          d={`M 600 ${100 + i * 14} C 500 ${100 + i * 14}, 430 ${130 + i * 6}, 420 ${150 + (i - 4) * 3}`}
          stroke={C.sand}
          strokeWidth="0.7"
          opacity={0.4}
        />
      ))}
    </motion.svg>
  );
}

/* ━━━ SVG: Hanko Seal (vermillion stamp) ━━━ */
function HankoSeal({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="4"
        y="4"
        width="40"
        height="40"
        rx="3"
        stroke={C.vermillion}
        strokeWidth="2.5"
        fill={C.vermillion}
        opacity="0.9"
      />
      {/* Inner character strokes — abstract "zen" mark */}
      <line x1="14" y1="16" x2="34" y2="16" stroke="#F7F5F0" strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="12" x2="24" y2="36" stroke="#F7F5F0" strokeWidth="2" strokeLinecap="round" />
      <line x1="14" y1="26" x2="34" y2="26" stroke="#F7F5F0" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16" y1="33" x2="32" y2="33" stroke="#F7F5F0" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* ━━━ SVG: Bamboo Branch ━━━ */
function BambooBranch() {
  return (
    <svg
      viewBox="0 0 120 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: 80, height: "auto", opacity: 0.07 }}
    >
      {/* Main stalk */}
      <path
        d="M 60 500 C 58 400, 62 350, 60 280 C 58 220, 62 160, 58 80 C 56 40, 60 10, 60 0"
        stroke={C.ink}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Nodes */}
      <line x1="55" y1="280" x2="65" y2="280" stroke={C.ink} strokeWidth="2" />
      <line x1="55" y1="180" x2="65" y2="180" stroke={C.ink} strokeWidth="2" />
      <line x1="56" y1="100" x2="64" y2="100" stroke={C.ink} strokeWidth="2" />
      {/* Leaves */}
      <path
        d="M 60 180 C 80 170, 100 155, 110 140 C 95 150, 75 160, 60 180"
        stroke={C.ink}
        strokeWidth="1.2"
        fill={C.ink}
        opacity="0.3"
      />
      <path
        d="M 60 180 C 85 175, 105 185, 115 195 C 100 188, 78 182, 60 180"
        stroke={C.ink}
        strokeWidth="1.2"
        fill={C.ink}
        opacity="0.25"
      />
      <path
        d="M 60 100 C 40 85, 20 75, 5 65 C 22 78, 42 90, 60 100"
        stroke={C.ink}
        strokeWidth="1.2"
        fill={C.ink}
        opacity="0.3"
      />
      <path
        d="M 60 100 C 35 95, 15 105, 0 115 C 18 108, 40 100, 60 100"
        stroke={C.ink}
        strokeWidth="1.2"
        fill={C.ink}
        opacity="0.2"
      />
      <path
        d="M 60 280 C 80 268, 95 250, 105 235 C 90 248, 75 262, 60 280"
        stroke={C.ink}
        strokeWidth="1"
        fill={C.ink}
        opacity="0.2"
      />
    </svg>
  );
}

/* ━━━ SVG: Wave Pattern (footer) ━━━ */
function WavePattern() {
  return (
    <svg
      viewBox="0 0 900 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "auto" }}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <path
          key={i}
          d={`M 0 ${30 + i * 10} Q 75 ${20 + i * 10}, 150 ${30 + i * 10} T 300 ${30 + i * 10} T 450 ${30 + i * 10} T 600 ${30 + i * 10} T 750 ${30 + i * 10} T 900 ${30 + i * 10}`}
          stroke={C.sand}
          strokeWidth="0.8"
          opacity={0.5 - i * 0.06}
        />
      ))}
    </svg>
  );
}

/* ━━━ Ink Wash gradient overlay ━━━ */
function InkWash({
  direction = "to bottom",
  height = 120,
}: {
  direction?: string;
  height?: number;
}) {
  return (
    <div
      style={{
        width: "100%",
        height,
        background: `linear-gradient(${direction}, rgba(45,45,45,0.03), transparent)`,
        pointerEvents: "none",
      }}
    />
  );
}

/* ━━━ Section Divider with sand raking ━━━ */
function SectionDivider({ variant = 1 }: { variant?: number }) {
  if (variant === 1) return <SandRakingConcentric style={{ opacity: 0.6 }} />;
  if (variant === 2) return <SandRakingParallel style={{ opacity: 0.5 }} />;
  return <SandRakingAroundStone style={{ opacity: 0.5 }} />;
}

/* ━━━ Project Card — a stone placed in the garden ━━━ */
function ProjectStone({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);

  /* Intentional asymmetry — varying border radius per card */
  const radii = [2, 4, 8, 3, 6, 2, 5, 8, 3, 4];
  const borderRadius = radii[index % radii.length];

  /* Alternate left/right offset for asymmetric placement */
  const offsets = [0, 24, -16, 8, -24, 12, -8, 20, -12, 4];
  const marginLeft = offsets[index % offsets.length];

  /* Some cards slightly wider, some narrower */
  const widths = ["100%", "94%", "97%", "100%", "92%", "96%", "100%", "93%", "98%", "95%"];
  const maxW = widths[index % widths.length];

  const num = String(index + 1).padStart(2, "0");
  const titleClean = project.title.replace("\n", " ");

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={{ duration: 1.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.card,
        borderRadius,
        padding: "40px 36px 36px",
        marginLeft,
        maxWidth: maxW,
        boxShadow: hovered
          ? "0 4px 24px rgba(45,45,45,0.06)"
          : "0 1px 8px rgba(45,45,45,0.03)",
        borderBottom: `1px solid ${hovered ? C.wash : C.sand}`,
        transition: "box-shadow 0.8s ease, border-color 0.8s ease",
        cursor: "default",
        position: "relative",
      }}
    >
      {/* Number */}
      <motion.span
        animate={{ x: hovered ? 4 : 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          fontFamily: "var(--font-instrument)",
          fontStyle: "italic",
          fontSize: 28,
          color: C.stone,
          opacity: hovered ? 0.7 : 0.4,
          display: "block",
          marginBottom: 16,
          transition: "opacity 0.6s ease",
          lineHeight: 1,
        }}
      >
        {num}
      </motion.span>

      {/* Title */}
      <h3
        style={{
          fontFamily: "var(--font-dm-serif)",
          fontSize: "clamp(22px, 3vw, 28px)",
          color: C.ink,
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
          fontSize: 12,
          color: C.stone,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        <span>{project.client}</span>
        <span style={{ opacity: 0.4 }}>/</span>
        <span>{project.year}</span>
      </div>

      {/* Description */}
      <p
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: 14,
          lineHeight: 1.7,
          color: C.stone,
          marginBottom: 20,
          maxWidth: 600,
        }}
      >
        {project.description}
      </p>

      {/* Tech — comma-separated, no pills */}
      <p
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: 12,
          color: C.stone,
          opacity: 0.6,
          letterSpacing: "0.02em",
        }}
      >
        {project.tech.join(", ")}
      </p>

      {/* Thin bottom accent line */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 36,
          right: 36,
          height: 1,
          background: C.sand,
          opacity: hovered ? 0.8 : 0.4,
          transition: "opacity 0.6s ease",
        }}
      />
    </motion.div>
  );
}

/* ━━━ Stat as meditation stone ━━━ */
function MeditationStone({
  stat,
  index,
}: {
  stat: (typeof stats)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  /* Asymmetric sizes for each stone */
  const sizes = [140, 125, 135];
  const size = sizes[index % sizes.length];
  const topOffsets = [0, 20, -10];
  const topOffset = topOffsets[index % topOffsets.length];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
      transition={{ duration: 1.5, delay: index * 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: `1px solid ${C.sand}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        top: topOffset,
        background: `radial-gradient(circle at 40% 40%, ${C.card}, ${C.bg})`,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-dm-serif)",
          fontSize: size * 0.28,
          color: C.ink,
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
          color: C.stone,
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          marginTop: 8,
        }}
      >
        {stat.label}
      </span>
    </motion.div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/*                      MAIN PAGE                             */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function ZenPage() {
  return (
    <div
      style={{
        background: C.bg,
        color: C.ink,
        minHeight: "100vh",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* ── Vertical Text: Left margin decoration ── */}
      <div
        style={{
          position: "fixed",
          left: 20,
          top: "50%",
          transform: "translateY(-50%)",
          writingMode: "vertical-rl",
          fontFamily: "var(--font-inter)",
          fontSize: 13,
          letterSpacing: "0.3em",
          color: C.ink,
          opacity: 0.08,
          zIndex: 10,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        静寂 &mdash; serenity
      </div>

      {/* ── Vertical Text: Right margin ── */}
      <div
        style={{
          position: "fixed",
          right: 20,
          top: "40%",
          transform: "translateY(-50%)",
          writingMode: "vertical-rl",
          fontFamily: "var(--font-inter)",
          fontSize: 11,
          letterSpacing: "0.25em",
          color: C.ink,
          opacity: 0.06,
          zIndex: 10,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        一期一会
      </div>

      {/* ── Bamboo Branch — fixed, left side ── */}
      <div
        style={{
          position: "fixed",
          right: 40,
          top: 60,
          zIndex: 5,
          pointerEvents: "none",
        }}
      >
        <BambooBranch />
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
        }}
      >
        {/* Sand raking background in hero */}
        <div
          style={{
            position: "absolute",
            top: "15%",
            left: 0,
            right: 0,
            zIndex: 0,
            opacity: 0.5,
            pointerEvents: "none",
          }}
        >
          <SandRakingConcentric />
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "10%",
            left: 0,
            right: 0,
            zIndex: 0,
            opacity: 0.35,
            pointerEvents: "none",
          }}
        >
          <SandRakingParallel />
        </div>

        {/* Hero content */}
        <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <Reveal>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
                marginBottom: 48,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  color: C.stone,
                }}
              >
                AI Product Studio
              </span>
              <HankoSeal size={32} />
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <h1
              style={{
                fontFamily: "var(--font-dm-serif)",
                fontSize: "clamp(40px, 7vw, 80px)",
                fontWeight: 400,
                lineHeight: 1.1,
                letterSpacing: "-0.025em",
                color: C.ink,
                marginBottom: 32,
              }}
            >
              Grox
            </h1>
          </Reveal>

          <Reveal delay={0.6}>
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "clamp(14px, 1.6vw, 17px)",
                lineHeight: 1.8,
                color: C.stone,
                maxWidth: 460,
                margin: "0 auto 48px",
                fontWeight: 300,
              }}
            >
              Building with intention. AI products crafted at the intersection
              of intelligence and restraint, where every feature earns its
              place.
            </p>
          </Reveal>

          <Reveal delay={0.9}>
            <div
              style={{
                width: 1,
                height: 80,
                background: C.sand,
                margin: "0 auto",
              }}
            />
          </Reveal>
        </div>

        {/* Ink wash at bottom of hero */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            pointerEvents: "none",
          }}
        >
          <InkWash direction="to top" height={160} />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════ */}
      {/*                  STATS — MEDITATION STONES              */}
      {/* ════════════════════════════════════════════════════════ */}
      <section
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "80px 24px 120px",
        }}
      >
        <Reveal>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "clamp(32px, 6vw, 72px)",
              flexWrap: "wrap",
              alignItems: "flex-start",
            }}
          >
            {stats.map((stat, i) => (
              <MeditationStone key={stat.label} stat={stat} index={i} />
            ))}
          </div>
        </Reveal>
      </section>

      {/* Sand raking divider */}
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "0 24px",
          pointerEvents: "none",
        }}
      >
        <SectionDivider variant={1} />
      </div>

      {/* Ink wash transition */}
      <InkWash direction="to bottom" height={100} />

      {/* ════════════════════════════════════════════════════════ */}
      {/*                    PROJECTS — STONES                    */}
      {/* ════════════════════════════════════════════════════════ */}
      <section
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "100px 24px 80px",
        }}
      >
        <Reveal>
          <div style={{ marginBottom: 80 }}>
            <span
              style={{
                fontFamily: "var(--font-instrument)",
                fontStyle: "italic",
                fontSize: 14,
                color: C.stone,
                opacity: 0.5,
                display: "block",
                marginBottom: 12,
                letterSpacing: "0.05em",
              }}
            >
              Works
            </span>
            <h2
              style={{
                fontFamily: "var(--font-dm-serif)",
                fontSize: "clamp(28px, 4vw, 40px)",
                fontWeight: 400,
                color: C.ink,
                letterSpacing: "-0.015em",
                lineHeight: 1.2,
              }}
            >
              Selected Projects
            </h2>
            <div
              style={{
                width: 48,
                height: 1,
                background: C.sand,
                marginTop: 24,
              }}
            />
          </div>
        </Reveal>

        {/* Project stones with large gaps */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 80,
          }}
        >
          {projects.map((project, i) => (
            <ProjectStone key={project.title} project={project} index={i} />
          ))}
        </div>
      </section>

      {/* Sand raking divider */}
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "40px 24px",
          pointerEvents: "none",
        }}
      >
        <SectionDivider variant={3} />
      </div>

      <InkWash direction="to bottom" height={80} />

      {/* ════════════════════════════════════════════════════════ */}
      {/*                      EXPERTISE                         */}
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
            <span
              style={{
                fontFamily: "var(--font-instrument)",
                fontStyle: "italic",
                fontSize: 14,
                color: C.stone,
                opacity: 0.5,
                display: "block",
                marginBottom: 12,
                letterSpacing: "0.05em",
              }}
            >
              Practice
            </span>
            <h2
              style={{
                fontFamily: "var(--font-dm-serif)",
                fontSize: "clamp(28px, 4vw, 40px)",
                fontWeight: 400,
                color: C.ink,
                letterSpacing: "-0.015em",
                lineHeight: 1.2,
              }}
            >
              Areas of Expertise
            </h2>
            <div
              style={{
                width: 48,
                height: 1,
                background: C.sand,
                marginTop: 24,
              }}
            />
          </div>
        </Reveal>

        {/* Single column, ample spacing */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 56,
          }}
        >
          {expertise.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1}>
              <div
                style={{
                  paddingBottom: 48,
                  borderBottom:
                    i < expertise.length - 1
                      ? `1px solid ${C.sand}`
                      : "none",
                }}
              >
                {/* Expertise number */}
                <span
                  style={{
                    fontFamily: "var(--font-instrument)",
                    fontStyle: "italic",
                    fontSize: 20,
                    color: C.stone,
                    opacity: 0.3,
                    display: "block",
                    marginBottom: 12,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <h3
                  style={{
                    fontFamily: "var(--font-dm-serif)",
                    fontSize: "clamp(20px, 2.5vw, 26px)",
                    fontWeight: 400,
                    color: C.ink,
                    marginBottom: 14,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.3,
                  }}
                >
                  {item.title}
                </h3>

                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: 14,
                    lineHeight: 1.75,
                    color: C.stone,
                    maxWidth: 580,
                  }}
                >
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Sand raking divider */}
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "40px 24px",
          pointerEvents: "none",
        }}
      >
        <SectionDivider variant={2} />
      </div>

      <InkWash direction="to bottom" height={60} />

      {/* ════════════════════════════════════════════════════════ */}
      {/*                       TOOLS                            */}
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
            <span
              style={{
                fontFamily: "var(--font-instrument)",
                fontStyle: "italic",
                fontSize: 14,
                color: C.stone,
                opacity: 0.5,
                display: "block",
                marginBottom: 12,
                letterSpacing: "0.05em",
              }}
            >
              Instruments
            </span>
            <h2
              style={{
                fontFamily: "var(--font-dm-serif)",
                fontSize: "clamp(28px, 4vw, 40px)",
                fontWeight: 400,
                color: C.ink,
                letterSpacing: "-0.015em",
                lineHeight: 1.2,
              }}
            >
              Tools &amp; Technologies
            </h2>
            <div
              style={{
                width: 48,
                height: 1,
                background: C.sand,
                marginTop: 24,
              }}
            />
          </div>
        </Reveal>

        {/* 2-column grid (1 on mobile) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "56px 64px",
          }}
        >
          {tools.map((group, i) => (
            <Reveal key={group.label} delay={i * 0.08}>
              <div>
                <h4
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.16em",
                    color: C.stone,
                    marginBottom: 18,
                    fontWeight: 500,
                  }}
                >
                  {group.label}
                </h4>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  {group.items.map((item) => (
                    <span
                      key={item}
                      style={{
                        fontFamily: "var(--font-inter)",
                        fontSize: 14,
                        color: C.ink,
                        opacity: 0.7,
                        lineHeight: 1.5,
                        paddingBottom: 8,
                        borderBottom: `1px solid ${C.sand}`,
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════ */}
      {/*                       FOOTER                           */}
      {/* ════════════════════════════════════════════════════════ */}
      <InkWash direction="to bottom" height={120} />

      <footer
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "60px 24px 120px",
          position: "relative",
        }}
      >
        {/* Wave pattern decoration */}
        <div
          style={{
            marginBottom: 64,
            opacity: 0.6,
            pointerEvents: "none",
          }}
        >
          <WavePattern />
        </div>

        <Reveal>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: 24,
            }}
          >
            {/* Hanko seal in footer */}
            <HankoSeal size={40} />

            <p
              style={{
                fontFamily: "var(--font-dm-serif)",
                fontSize: "clamp(20px, 3vw, 28px)",
                fontWeight: 400,
                color: C.ink,
                lineHeight: 1.4,
                maxWidth: 400,
              }}
            >
              Every great product begins with stillness
            </p>

            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: 13,
                color: C.stone,
                opacity: 0.6,
                letterSpacing: "0.02em",
              }}
            >
              hello@grox.studio
            </p>

            <div
              style={{
                display: "flex",
                gap: 24,
                marginTop: 16,
              }}
            >
              <a
                href="https://github.com/1aday"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: 12,
                  color: C.stone,
                  textDecoration: "none",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  opacity: 0.5,
                  transition: "opacity 0.6s ease",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.opacity = "0.9";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.opacity = "0.5";
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
                  color: C.stone,
                  textDecoration: "none",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  opacity: 0.5,
                  transition: "opacity 0.6s ease",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.opacity = "0.9";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.opacity = "0.5";
                }}
              >
                Twitter
              </a>
            </div>

            {/* Footer thin rule */}
            <div
              style={{
                width: "100%",
                maxWidth: 200,
                height: 1,
                background: C.sand,
                margin: "32px auto 0",
              }}
            />

            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: 11,
                color: C.stone,
                opacity: 0.35,
                letterSpacing: "0.04em",
                marginTop: 8,
              }}
            >
              &copy; {new Date().getFullYear()} Grox
            </p>
          </div>
        </Reveal>

        {/* Sand raking at very bottom */}
        <div
          style={{
            marginTop: 80,
            opacity: 0.3,
            pointerEvents: "none",
          }}
        >
          <SandRakingParallel />
        </div>
      </footer>

      <ThemeSwitcher current="/zen" variant="light" />
    </div>
  );
}
