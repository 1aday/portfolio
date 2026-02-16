"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";

/* ═══════════════════════════════════════════════════════════════════════════
   TERRAZZO — Italian Terrazzo Material Portfolio Theme
   Inspired by Venetian composite flooring: marble, quartz, granite & glass
   chips set in warm resin. Mediterranean luxury, artisanal warmth.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ─── Palette ─── */
const TERRAZZO = {
  bg: "#F2EDE7",
  surface: "#FAF8F5",
  text: "#2D2824",
  muted: "#8A8279",
  dimmed: "#B5AFA7",
  border: "rgba(0,0,0,0.06)",
  shadow: "rgba(45,40,36,0.06)",
  shadowDeep: "rgba(45,40,36,0.12)",
  gradientTop: "#F2EDE7",
  gradientBottom: "#E8E1D8",
};

const chipColors = ["#C75B39", "#8FA582", "#D4918E", "#D4C5A9", "#9E9689"];
const chipAt = (i: number) => chipColors[i % chipColors.length];
const deepBrown = "#6B5B4E";

/* ─── Deterministic chip generation ─── */
interface TerrazzoChip {
  x: number;
  y: number;
  size: number;
  rotation: number;
  color: string;
  shape: number; // 0=circle, 1=oval, 2=triangle
  opacity: number;
}

function generateChips(count: number, seed: number = 0): TerrazzoChip[] {
  return Array.from({ length: count }, (_, i) => {
    const idx = i + seed;
    return {
      x: (idx * 137.508) % 100,
      y: (idx * 73.337 + 17.53) % 100,
      size: 8 + ((idx * 3.71) % 22),
      rotation: (idx * 47.3) % 360,
      color: chipColors[idx % chipColors.length],
      shape: idx % 3,
      opacity: 0.45 + ((idx * 13.7) % 40) / 100,
    };
  });
}

/* ─── SVG Terrazzo Chip Shape ─── */
function ChipShape({
  chip,
  className = "",
}: {
  chip: TerrazzoChip;
  className?: string;
}) {
  const { size, rotation, color, shape, opacity } = chip;

  if (shape === 0) {
    // Circle
    return (
      <circle
        cx={size / 2}
        cy={size / 2}
        r={size / 2.4}
        fill={color}
        opacity={opacity}
        transform={`rotate(${rotation} ${size / 2} ${size / 2})`}
        className={className}
      />
    );
  }
  if (shape === 1) {
    // Oval / rounded rectangle
    return (
      <ellipse
        cx={size / 2}
        cy={size / 2}
        rx={size / 2.2}
        ry={size / 3.5}
        fill={color}
        opacity={opacity}
        transform={`rotate(${rotation} ${size / 2} ${size / 2})`}
        className={className}
      />
    );
  }
  // Triangle (rounded via polygon)
  const h = size * 0.85;
  const points = `${size / 2},${size * 0.1} ${size * 0.9},${h} ${size * 0.1},${h}`;
  return (
    <polygon
      points={points}
      fill={color}
      opacity={opacity}
      transform={`rotate(${rotation} ${size / 2} ${size / 2})`}
      className={className}
    />
  );
}

/* ─── Full Terrazzo Pattern SVG ─── */
function TerrazzoPattern({
  chipCount = 45,
  seed = 0,
  width = "100%",
  height = "100%",
  style = {},
}: {
  chipCount?: number;
  seed?: number;
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
}) {
  const chips = generateChips(chipCount, seed);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: "absolute", inset: 0, ...style }}
      aria-hidden="true"
    >
      {chips.map((chip, i) => (
        <g key={i} transform={`translate(${chip.x}, ${chip.y})`}>
          <ChipShape chip={chip} />
        </g>
      ))}
    </svg>
  );
}

/* ─── Small terrazzo accent (for card corners) ─── */
function TerrazzoAccent({
  count = 5,
  seed = 0,
  size = 60,
}: {
  count?: number;
  seed?: number;
  size?: number;
}) {
  const chips = generateChips(count, seed);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ overflow: "visible" }}
      aria-hidden="true"
    >
      {chips.map((chip, i) => (
        <g key={i} transform={`translate(${chip.x * 0.8 + 10}, ${chip.y * 0.8 + 10})`}>
          <ChipShape chip={{ ...chip, size: chip.size * 1.2, opacity: chip.opacity * 0.7 }} />
        </g>
      ))}
    </svg>
  );
}

/* ─── Terrazzo Divider Strip ─── */
function TerrazzoDivider({ seed = 0 }: { seed?: number }) {
  const chips = generateChips(18, seed);

  return (
    <div
      style={{
        width: "100%",
        height: 6,
        position: "relative",
        overflow: "hidden",
        borderRadius: 3,
        background: TERRAZZO.dimmed + "30",
        margin: "0 auto",
      }}
    >
      <svg
        width="100%"
        height="6"
        viewBox="0 0 200 6"
        preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0 }}
        aria-hidden="true"
      >
        {chips.map((chip, i) => (
          <rect
            key={i}
            x={(i * 11.3) % 200}
            y={0}
            width={3 + ((i * 2.7) % 8)}
            height={6}
            rx={1.5}
            fill={chip.color}
            opacity={chip.opacity * 0.8}
          />
        ))}
      </svg>
    </div>
  );
}

/* ─── Scroll Reveal ─── */
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
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ─── Organic Blob Decorator ─── */
function OrganicBlob({
  color,
  top,
  left,
  size = 400,
  delay = 0,
}: {
  color: string;
  top: string;
  left: string;
  size?: number;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{
        scale: [0.9, 1.05, 0.95, 1.02, 0.9],
        opacity: [0.08, 0.12, 0.09, 0.11, 0.08],
      }}
      transition={{
        duration: 35,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{
        position: "absolute",
        top,
        left,
        width: size,
        height: size,
        borderRadius: "40% 60% 50% 70% / 55% 45% 65% 35%",
        background: color,
        filter: "blur(40px)",
        pointerEvents: "none",
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  );
}

/* ─── Stone Chip Bullet ─── */
function ChipBullet({ color, size = 8 }: { color: string; size?: number }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        flexShrink: 0,
        marginTop: 2,
      }}
      aria-hidden="true"
    />
  );
}

/* ─── Project Card Component ─── */
function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [hovered, setHovered] = useState(false);
  const accentColor = chipAt(index);
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{
        duration: 0.8,
        delay: 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <motion.div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        animate={{
          y: hovered ? -4 : 0,
          boxShadow: hovered
            ? `0 12px 40px ${TERRAZZO.shadowDeep}, 0 2px 8px ${TERRAZZO.shadow}`
            : `0 4px 20px ${TERRAZZO.shadow}, 0 1px 4px ${TERRAZZO.shadow}`,
        }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        style={{
          background: TERRAZZO.surface,
          borderRadius: 16,
          border: `1px solid ${TERRAZZO.border}`,
          padding: "40px 36px",
          position: "relative",
          overflow: "hidden",
          cursor: "pointer",
        }}
      >
        {/* Terrazzo accent in bottom-right corner */}
        <div
          style={{
            position: "absolute",
            bottom: -8,
            right: -8,
            opacity: hovered ? 0.6 : 0.35,
            transition: "opacity 0.4s ease",
          }}
        >
          <TerrazzoAccent count={5} seed={index * 7 + 3} size={70} />
        </div>

        {/* Card header: number + client + year */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ChipBullet color={accentColor} size={10} />
            <span
              style={{
                fontFamily: "var(--font-jakarta)",
                fontWeight: 700,
                fontSize: 14,
                color: accentColor,
                letterSpacing: "0.04em",
              }}
            >
              {num}
            </span>
          </div>
          <span
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: 13,
              color: TERRAZZO.muted,
              letterSpacing: "0.03em",
              textTransform: "uppercase",
            }}
          >
            {project.client}
          </span>
          <span
            style={{
              marginLeft: "auto",
              fontFamily: "var(--font-inter)",
              fontSize: 13,
              color: TERRAZZO.dimmed,
            }}
          >
            {project.year}
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily: "var(--font-jakarta)",
            fontWeight: 700,
            fontSize: "clamp(1.4rem, 3vw, 1.75rem)",
            color: TERRAZZO.text,
            lineHeight: 1.2,
            marginBottom: 14,
            whiteSpace: "pre-line",
          }}
        >
          {project.title.replace("\n", " ")}
        </h3>

        {/* Description */}
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: 15,
            lineHeight: 1.7,
            color: TERRAZZO.muted,
            marginBottom: 12,
            maxWidth: 600,
          }}
        >
          {project.description}
        </p>

        {/* Technical details */}
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: 13,
            lineHeight: 1.65,
            color: TERRAZZO.dimmed,
            marginBottom: 20,
            maxWidth: 580,
          }}
        >
          {project.technical}
        </p>

        {/* Tech tags as chip-colored pills */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          {project.tech.map((t, ti) => {
            const tagColor = chipAt(ti + index);
            return (
              <span
                key={t}
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: 12,
                  fontWeight: 500,
                  color: tagColor,
                  border: `1.5px solid ${tagColor}40`,
                  background: `${tagColor}0A`,
                  borderRadius: 20,
                  padding: "5px 14px",
                  letterSpacing: "0.02em",
                  transition: "all 0.3s ease",
                }}
              >
                {t}
              </span>
            );
          })}
        </div>

        {/* GitHub link */}
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginTop: 18,
              fontFamily: "var(--font-inter)",
              fontSize: 13,
              fontWeight: 500,
              color: accentColor,
              textDecoration: "none",
              transition: "opacity 0.3s",
              opacity: 0.75,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.75")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
            View Source
          </a>
        )}
      </motion.div>
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
  const accentColor = chipAt(index);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{
        y: hovered ? -3 : 0,
        boxShadow: hovered
          ? `0 10px 32px ${TERRAZZO.shadowDeep}`
          : `0 2px 12px ${TERRAZZO.shadow}`,
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{
        background: TERRAZZO.surface,
        borderRadius: 14,
        border: `1px solid ${TERRAZZO.border}`,
        padding: "32px 28px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative chip cluster */}
      <div
        style={{
          position: "absolute",
          top: -6,
          right: -6,
          opacity: 0.25,
        }}
      >
        <TerrazzoAccent count={4} seed={index * 11 + 20} size={50} />
      </div>

      {/* Chip bullet + title */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 14,
        }}
      >
        <ChipBullet color={accentColor} size={10} />
        <h3
          style={{
            fontFamily: "var(--font-jakarta)",
            fontWeight: 700,
            fontSize: 17,
            color: TERRAZZO.text,
            lineHeight: 1.3,
          }}
        >
          {item.title}
        </h3>
      </div>

      <p
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: 14,
          lineHeight: 1.7,
          color: TERRAZZO.muted,
        }}
      >
        {item.body}
      </p>
    </motion.div>
  );
}

/* ─── Stat Stone (rounded container) ─── */
function StatStone({
  stat,
  index,
}: {
  stat: (typeof stats)[number];
  index: number;
}) {
  const accentColor = chipAt(index);

  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{
        background: TERRAZZO.surface,
        borderRadius: 16,
        border: `1px solid ${TERRAZZO.border}`,
        padding: "24px 32px",
        textAlign: "center",
        boxShadow: `0 2px 12px ${TERRAZZO.shadow}`,
        minWidth: 130,
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-jakarta)",
          fontWeight: 800,
          fontSize: 32,
          color: accentColor,
          lineHeight: 1.1,
          marginBottom: 4,
        }}
      >
        {stat.value}
      </div>
      <div
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: 13,
          color: TERRAZZO.muted,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        {stat.label}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

export default function TerrazzoPage() {
  return (
    <div
      style={{
        background: TERRAZZO.bg,
        color: TERRAZZO.text,
        minHeight: "100vh",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* ─── Global organic blobs ─── */}
      <OrganicBlob color="#C75B39" top="5%" left="-5%" size={500} delay={0} />
      <OrganicBlob color="#8FA582" top="25%" left="80%" size={450} delay={8} />
      <OrganicBlob color="#D4918E" top="55%" left="-10%" size={400} delay={15} />

      {/* ══════════════════════════════════════════════════════════════════
          HERO SECTION
          ══════════════════════════════════════════════════════════════════ */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "120px 24px 80px",
          overflow: "hidden",
        }}
      >
        {/* Hero terrazzo pattern background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.55,
            pointerEvents: "none",
          }}
        >
          <TerrazzoPattern chipCount={50} seed={0} />
        </div>

        {/* Subtle gradient overlay to ensure text readability */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at center, ${TERRAZZO.bg}E6 30%, ${TERRAZZO.bg}99 70%, ${TERRAZZO.bg}55 100%)`,
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 900,
            textAlign: "center",
          }}
        >
          {/* Small label */}
          <Reveal delay={0.1}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 32,
              }}
            >
              <ChipBullet color="#C75B39" size={8} />
              <ChipBullet color="#8FA582" size={6} />
              <ChipBullet color="#D4918E" size={7} />
              <span
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: 13,
                  color: TERRAZZO.muted,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginLeft: 4,
                }}
              >
                AI Product Studio
              </span>
              <ChipBullet color="#D4C5A9" size={7} />
              <ChipBullet color="#9E9689" size={6} />
              <ChipBullet color="#C75B39" size={8} />
            </div>
          </Reveal>

          {/* Main hero title — artisan typography */}
          <Reveal delay={0.2}>
            <h1
              style={{
                fontFamily: "var(--font-jakarta)",
                fontWeight: 800,
                fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
                lineHeight: 1.05,
                color: TERRAZZO.text,
                marginBottom: 28,
                letterSpacing: "-0.02em",
              }}
            >
              Crafting{" "}
              <span
                style={{
                  fontFamily: "var(--font-instrument)",
                  fontStyle: "italic",
                  fontWeight: 400,
                  color: "#C75B39",
                }}
              >
                intelligent
              </span>
              <br />
              products with{" "}
              <span
                style={{
                  fontFamily: "var(--font-instrument)",
                  fontStyle: "italic",
                  fontWeight: 400,
                  color: "#8FA582",
                }}
              >
                care
              </span>
            </h1>
          </Reveal>

          {/* Subtitle */}
          <Reveal delay={0.35}>
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "clamp(1rem, 2vw, 1.15rem)",
                lineHeight: 1.7,
                color: TERRAZZO.muted,
                maxWidth: 560,
                margin: "0 auto 48px",
              }}
            >
              Full-stack AI engineer specializing in multi-model orchestration,
              computer vision, and production-ready intelligent systems.
              Each project shaped with artisanal precision.
            </p>
          </Reveal>

          {/* Stats in stone containers */}
          <Reveal delay={0.5}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 20,
                flexWrap: "wrap",
              }}
            >
              {stats.map((stat, i) => (
                <StatStone key={stat.label} stat={stat} index={i} />
              ))}
            </div>
          </Reveal>
        </div>

        {/* Bottom terrazzo divider strip */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "10%",
            right: "10%",
          }}
        >
          <TerrazzoDivider seed={100} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          PROJECTS SECTION
          ══════════════════════════════════════════════════════════════════ */}
      <section
        style={{
          position: "relative",
          padding: "80px 24px 100px",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* Section header */}
          <Reveal>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 16,
              }}
            >
              <ChipBullet color="#C75B39" />
              <span
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: 13,
                  color: TERRAZZO.muted,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                Selected Work
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h2
              style={{
                fontFamily: "var(--font-jakarta)",
                fontWeight: 800,
                fontSize: "clamp(2rem, 4vw, 3rem)",
                color: TERRAZZO.text,
                lineHeight: 1.1,
                marginBottom: 12,
              }}
            >
              Projects{" "}
              <span
                style={{
                  fontFamily: "var(--font-instrument)",
                  fontStyle: "italic",
                  fontWeight: 400,
                  color: deepBrown,
                }}
              >
                & process
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.15}>
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: 15,
                lineHeight: 1.7,
                color: TERRAZZO.muted,
                maxWidth: 520,
                marginBottom: 56,
              }}
            >
              A curated selection of AI-powered products, each built
              end-to-end from concept to production deployment.
            </p>
          </Reveal>

          {/* Project cards — single column, generous spacing */}
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
        </div>

        {/* Terrazzo divider at section end */}
        <div
          style={{
            maxWidth: 1100,
            margin: "80px auto 0",
          }}
        >
          <TerrazzoDivider seed={200} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          EXPERTISE SECTION
          ══════════════════════════════════════════════════════════════════ */}
      <section
        style={{
          position: "relative",
          padding: "80px 24px 100px",
        }}
      >
        {/* Background blob */}
        <OrganicBlob color="#D4C5A9" top="10%" left="70%" size={350} delay={20} />

        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Reveal>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 16,
              }}
            >
              <ChipBullet color="#8FA582" />
              <span
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: 13,
                  color: TERRAZZO.muted,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                Capabilities
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h2
              style={{
                fontFamily: "var(--font-jakarta)",
                fontWeight: 800,
                fontSize: "clamp(2rem, 4vw, 3rem)",
                color: TERRAZZO.text,
                lineHeight: 1.1,
                marginBottom: 48,
              }}
            >
              Core{" "}
              <span
                style={{
                  fontFamily: "var(--font-instrument)",
                  fontStyle: "italic",
                  fontWeight: 400,
                  color: "#C75B39",
                }}
              >
                expertise
              </span>
            </h2>
          </Reveal>

          {/* 2-column grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 460px), 1fr))",
              gap: 24,
            }}
          >
            {expertise.map((item, i) => (
              <Reveal key={item.title} delay={0.1 + i * 0.08}>
                <ExpertiseCard item={item} index={i} />
              </Reveal>
            ))}
          </div>
        </div>

        {/* Terrazzo divider */}
        <div
          style={{
            maxWidth: 1100,
            margin: "80px auto 0",
          }}
        >
          <TerrazzoDivider seed={300} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          TOOLS SECTION
          ══════════════════════════════════════════════════════════════════ */}
      <section
        style={{
          position: "relative",
          padding: "80px 24px 100px",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 16,
              }}
            >
              <ChipBullet color="#D4918E" />
              <span
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: 13,
                  color: TERRAZZO.muted,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                Technology
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h2
              style={{
                fontFamily: "var(--font-jakarta)",
                fontWeight: 800,
                fontSize: "clamp(2rem, 4vw, 3rem)",
                color: TERRAZZO.text,
                lineHeight: 1.1,
                marginBottom: 48,
              }}
            >
              Tools{" "}
              <span
                style={{
                  fontFamily: "var(--font-instrument)",
                  fontStyle: "italic",
                  fontWeight: 400,
                  color: "#D4918E",
                }}
              >
                & materials
              </span>
            </h2>
          </Reveal>

          {/* 3-column grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
              gap: 24,
            }}
          >
            {tools.map((group, gi) => {
              const accentColor = chipAt(gi);
              return (
                <Reveal key={group.label} delay={0.1 + gi * 0.06}>
                  <ToolCard group={group} index={gi} accentColor={accentColor} />
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Terrazzo divider */}
        <div
          style={{
            maxWidth: 1100,
            margin: "80px auto 0",
          }}
        >
          <TerrazzoDivider seed={400} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          FOOTER — Mediterranean warmth
          ══════════════════════════════════════════════════════════════════ */}
      <footer
        style={{
          position: "relative",
          background: `linear-gradient(180deg, ${TERRAZZO.bg} 0%, ${TERRAZZO.gradientBottom} 100%)`,
          padding: "0 24px 40px",
          overflow: "hidden",
        }}
      >
        {/* Terrazzo strip at top of footer */}
        <div style={{ maxWidth: 1100, margin: "0 auto 60px" }}>
          <TerrazzoDivider seed={500} />
        </div>

        {/* Decorative blob */}
        <OrganicBlob color="#C75B39" top="20%" left="85%" size={300} delay={25} />

        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* CTA message */}
          <Reveal>
            <div
              style={{
                textAlign: "center",
                marginBottom: 48,
              }}
            >
              {/* Scattered chips decoration */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 6,
                  marginBottom: 28,
                }}
              >
                {chipColors.map((c, i) => (
                  <motion.span
                    key={c}
                    whileHover={{ scale: 1.3 }}
                    style={{
                      display: "inline-block",
                      width: 8 + ((i * 3) % 6),
                      height: 8 + ((i * 3) % 6),
                      borderRadius: i % 2 === 0 ? "50%" : "30%",
                      background: c,
                      opacity: 0.6,
                    }}
                  />
                ))}
              </div>

              <h2
                style={{
                  fontFamily: "var(--font-jakarta)",
                  fontWeight: 800,
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  color: TERRAZZO.text,
                  lineHeight: 1.1,
                  marginBottom: 16,
                }}
              >
                Let&apos;s{" "}
                <span
                  style={{
                    fontFamily: "var(--font-instrument)",
                    fontStyle: "italic",
                    fontWeight: 400,
                    color: "#C75B39",
                  }}
                >
                  create
                </span>{" "}
                together
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: TERRAZZO.muted,
                  maxWidth: 480,
                  margin: "0 auto 32px",
                }}
              >
                Every great product begins as raw material.
                Let me help shape your vision into something remarkable.
              </p>
              <a
                href="mailto:hello@grox.studio"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  fontFamily: "var(--font-jakarta)",
                  fontWeight: 600,
                  fontSize: 15,
                  color: TERRAZZO.surface,
                  background: TERRAZZO.text,
                  borderRadius: 12,
                  padding: "14px 32px",
                  textDecoration: "none",
                  transition: "all 0.35s ease",
                  boxShadow: `0 4px 20px ${TERRAZZO.shadowDeep}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = `0 8px 32px ${TERRAZZO.shadowDeep}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = `0 4px 20px ${TERRAZZO.shadowDeep}`;
                }}
              >
                <ChipBullet color="#C75B39" size={8} />
                Get in Touch
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </Reveal>

          {/* Footer bottom bar */}
          <Reveal delay={0.2}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 16,
                paddingTop: 32,
                borderTop: `1px solid ${TERRAZZO.border}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                {/* Small terrazzo logo mark */}
                <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
                  <rect width="28" height="28" rx="7" fill={TERRAZZO.text} />
                  <circle cx="9" cy="10" r="2.5" fill="#C75B39" opacity="0.8" />
                  <ellipse cx="18" cy="9" rx="3" ry="2" fill="#8FA582" opacity="0.7" transform="rotate(30 18 9)" />
                  <circle cx="14" cy="18" r="2" fill="#D4918E" opacity="0.75" />
                  <polygon points="20,16 23,21 17,21" fill="#D4C5A9" opacity="0.65" />
                  <circle cx="8" cy="20" r="1.5" fill="#9E9689" opacity="0.7" />
                </svg>
                <span
                  style={{
                    fontFamily: "var(--font-jakarta)",
                    fontWeight: 700,
                    fontSize: 16,
                    color: TERRAZZO.text,
                  }}
                >
                  Grox
                </span>
              </div>

              <span
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: 13,
                  color: TERRAZZO.dimmed,
                }}
              >
                Handcrafted with care, 2025
              </span>

              {/* Small decorative chip cluster */}
              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                {chipColors.slice(0, 3).map((c, i) => (
                  <span
                    key={c}
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: c,
                      opacity: 0.5,
                    }}
                  />
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </footer>

      {/* ─── Theme Switcher ─── */}
      <ThemeSwitcher current="/terrazzo" variant="light" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TOOL CARD COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */
function ToolCard({
  group,
  index,
  accentColor,
}: {
  group: (typeof tools)[number];
  index: number;
  accentColor: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{
        y: hovered ? -3 : 0,
        boxShadow: hovered
          ? `0 10px 32px ${TERRAZZO.shadowDeep}`
          : `0 2px 12px ${TERRAZZO.shadow}`,
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{
        background: TERRAZZO.surface,
        borderRadius: 14,
        border: `1px solid ${TERRAZZO.border}`,
        padding: "28px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Corner terrazzo accent */}
      <div
        style={{
          position: "absolute",
          bottom: -10,
          right: -10,
          opacity: 0.2,
        }}
      >
        <TerrazzoAccent count={3} seed={index * 13 + 50} size={45} />
      </div>

      {/* Category header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 18,
        }}
      >
        <ChipBullet color={accentColor} size={9} />
        <span
          style={{
            fontFamily: "var(--font-jakarta)",
            fontWeight: 700,
            fontSize: 15,
            color: TERRAZZO.text,
            letterSpacing: "0.02em",
          }}
        >
          {group.label}
        </span>
      </div>

      {/* Tool items with chip bullets */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {group.items.map((item, ii) => {
          const itemColor = chipAt(index + ii);
          return (
            <div
              key={item}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <ChipBullet color={itemColor} size={6} />
              <span
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: 14,
                  color: TERRAZZO.muted,
                }}
              >
                {item}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
