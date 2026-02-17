"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { projects, stats, expertise, tools } from "@/app/data/projects";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";
import { getProjectImage } from "@/lib/theme-images";

/* ─────────────────────────── COLORS ─────────────────────────── */
const C = {
  bg: "#F0F4F8",
  ice: "#E0EAFF",
  frost: "#93C5FD",
  frostDeep: "#3B82F6",
  crystal: "#DBEAFE",
  white: "#FFFFFF",
  dark: "#1E293B",
  darkMuted: "rgba(30,41,59,0.45)",
  shimmer: "rgba(147,197,253,0.15)",
  border: "rgba(59,130,246,0.12)",
  glassEdge: "rgba(255,255,255,0.6)",
};

/* ─────────────────────────── HELPERS ─────────────────────────── */
const sectionPad = "px-6 md:px-12 lg:px-20 xl:px-28";
const maxW = "max-w-[1320px] mx-auto";

const glassCard: React.CSSProperties = {
  background: "rgba(255,255,255,0.55)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  borderRadius: 16,
  border: `1px solid ${C.border}`,
  borderTop: `1px solid ${C.glassEdge}`,
  borderLeft: `1px solid ${C.glassEdge}`,
  position: "relative",
  overflow: "hidden",
};

const shimmerOverlay: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)",
  backgroundSize: "200% 100%",
  backgroundPosition: "200% 0",
  transition: "background-position 0.7s ease",
  pointerEvents: "none",
  borderRadius: "inherit",
  zIndex: 2,
};

const shimmerActive: React.CSSProperties = {
  backgroundPosition: "-200% 0",
};

function useHover() {
  const [hovered, setHovered] = useState(false);
  return {
    hovered,
    bind: {
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
    },
  };
}

/* ─────────────────────────── ICE CRYSTAL SVG ─────────────────────────── */
function IceCrystal({
  size = 480,
  style,
  className,
}: {
  size?: number;
  style?: React.CSSProperties;
  className?: string;
}) {
  const r = size / 2;
  const branches = 6;
  const armLen = r * 0.82;
  const subLen = armLen * 0.32;
  const subAngle = 35;

  const paths: string[] = [];
  for (let i = 0; i < branches; i++) {
    const angle = (i * 360) / branches - 90;
    const rad = (angle * Math.PI) / 180;
    const ex = r + Math.cos(rad) * armLen;
    const ey = r + Math.sin(rad) * armLen;
    paths.push(`M ${r} ${r} L ${ex} ${ey}`);

    /* sub-branches at 40% and 70% of arm */
    [0.4, 0.7].forEach((frac) => {
      const mx = r + Math.cos(rad) * armLen * frac;
      const my = r + Math.sin(rad) * armLen * frac;
      const len = subLen * (frac === 0.4 ? 1 : 0.7);
      [-1, 1].forEach((dir) => {
        const sa = angle + dir * subAngle;
        const sr = (sa * Math.PI) / 180;
        const sx = mx + Math.cos(sr) * len;
        const sy = my + Math.sin(sr) * len;
        paths.push(`M ${mx} ${my} L ${sx} ${sy}`);
      });
    });
  }

  /* central hexagon */
  const hexR = r * 0.14;
  const hex = Array.from({ length: 6 }, (_, i) => {
    const a = ((i * 60 - 90) * Math.PI) / 180;
    return `${r + Math.cos(a) * hexR},${r + Math.sin(a) * hexR}`;
  }).join(" ");

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      className={className}
      style={style}
    >
      <polygon
        points={hex}
        stroke={C.frost}
        strokeWidth={1.2}
        fill="rgba(147,197,253,0.06)"
      />
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          stroke={C.frost}
          strokeWidth={1.1}
          strokeLinecap="round"
          opacity={0.65}
        />
      ))}
      {/* small terminal dots */}
      {Array.from({ length: branches }, (_, i) => {
        const angle = ((i * 360) / branches - 90) * (Math.PI / 180);
        return (
          <circle
            key={`dot-${i}`}
            cx={r + Math.cos(angle) * armLen}
            cy={r + Math.sin(angle) * armLen}
            r={2.5}
            fill={C.frost}
            opacity={0.5}
          />
        );
      })}
    </svg>
  );
}

/* ─────────────────────────── FROST PATTERN OVERLAY ─────────────────────────── */
function FrostBranch({
  side = "left",
  top = 0,
}: {
  side?: "left" | "right";
  top?: number;
}) {
  const flip = side === "right";
  return (
    <svg
      width="220"
      height="300"
      viewBox="0 0 220 300"
      fill="none"
      style={{
        position: "absolute",
        top,
        [side]: 0,
        transform: flip ? "scaleX(-1)" : undefined,
        opacity: 0.18,
        pointerEvents: "none",
      }}
    >
      <path
        d="M0 150 Q40 140 80 120 Q100 100 120 60 Q110 80 130 95 Q150 110 140 130 Q160 90 170 50"
        stroke={C.frost}
        strokeWidth={1}
        strokeLinecap="round"
      />
      <path
        d="M0 150 Q35 160 70 180 Q90 200 105 240 Q95 220 115 210 Q135 195 125 175"
        stroke={C.frost}
        strokeWidth={0.8}
        strokeLinecap="round"
      />
      <path
        d="M80 120 Q60 105 50 70"
        stroke={C.frost}
        strokeWidth={0.6}
        strokeLinecap="round"
      />
      <path
        d="M70 180 Q55 195 40 230"
        stroke={C.frost}
        strokeWidth={0.6}
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ─────────────────────────── CRYSTAL FACET ─────────────────────────── */
function CrystalFacet({
  color = C.shimmer,
  style,
}: {
  color?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        position: "absolute",
        width: 120,
        height: 120,
        background: color,
        clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}

/* ─────────────────────────── TEMPERATURE LABEL ─────────────────────────── */
function TempLabel({
  value = "-12",
  style,
}: {
  value?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      style={{
        fontFamily: "var(--font-manrope), sans-serif",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.08em",
        color: C.frost,
        background: "rgba(147,197,253,0.1)",
        border: `1px solid ${C.border}`,
        borderRadius: 6,
        padding: "3px 8px",
        display: "inline-block",
        ...style,
      }}
    >
      {value}°C
    </span>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━ NAVIGATION ━━━━━━━━━━━━━━━━━━━━━━━━━ */
function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const links = ["Projects", "Expertise", "Tools"];

  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "0 24px",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled ? "rgba(240,244,248,0.8)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
        transition: "background 0.35s, border 0.35s, backdrop-filter 0.35s",
      }}
    >
      <a
        href="#top"
        style={{
          fontFamily: "var(--font-manrope), sans-serif",
          fontWeight: 700,
          fontSize: 18,
          color: C.dark,
          textDecoration: "none",
          letterSpacing: "-0.02em",
        }}
      >
        frost<span style={{ color: C.frostDeep }}>.</span>
      </a>

      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        {links.map((l) => (
          <a
            key={l}
            href={`#${l.toLowerCase()}`}
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 13,
              fontWeight: 500,
              color: C.darkMuted,
              textDecoration: "none",
              letterSpacing: "0.03em",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.frostDeep)}
            onMouseLeave={(e) => (e.currentTarget.style.color = C.darkMuted)}
          >
            {l}
          </a>
        ))}
        <TempLabel value="-12" />
      </div>
    </motion.nav>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━ HERO SECTION ━━━━━━━━━━━━━━━━━━━━━━━━━ */
function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const crystalY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const crystalRotate = useTransform(scrollYProgress, [0, 1], [0, 25]);

  return (
    <section
      ref={ref}
      id="top"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: `linear-gradient(170deg, ${C.white} 0%, ${C.ice} 40%, ${C.crystal} 100%)`,
      }}
      className={sectionPad}
    >
      {/* Background frost branches */}
      <FrostBranch side="left" top={80} />
      <FrostBranch side="right" top={200} />
      <FrostBranch side="left" top={500} />

      {/* Decorative crystal facets */}
      <CrystalFacet
        style={{ top: "12%", right: "8%", opacity: 0.3, width: 90, height: 90 }}
      />
      <CrystalFacet
        color="rgba(59,130,246,0.06)"
        style={{ bottom: "18%", left: "5%", opacity: 0.25, width: 70, height: 70 }}
      />

      <div
        className={maxW}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          position: "relative",
          zIndex: 2,
          paddingTop: 80,
          paddingBottom: 80,
        }}
      >
        {/* Slowly rotating ice crystal */}
        <motion.div
          style={{
            y: crystalY,
            rotate: crystalRotate,
            marginBottom: 48,
          }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        >
          <IceCrystal size={360} style={{ opacity: 0.45 }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
        >
          <TempLabel value="-28" style={{ marginBottom: 20, display: "inline-block" }} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          style={{
            fontFamily: "var(--font-manrope), sans-serif",
            fontWeight: 800,
            fontSize: "clamp(2.4rem, 5.5vw, 4.2rem)",
            lineHeight: 1.08,
            color: C.dark,
            letterSpacing: "-0.035em",
            marginBottom: 20,
          }}
        >
          Crystalline precision
          <br />
          <span style={{ color: C.frostDeep }}>in every build</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "clamp(1rem, 1.6vw, 1.15rem)",
            lineHeight: 1.65,
            color: C.darkMuted,
            maxWidth: 540,
            marginBottom: 48,
          }}
        >
          Engineering digital experiences with the clarity of arctic ice &mdash;
          clean architecture, sharp performance, and flawless execution forged
          in sub-zero discipline.
        </motion.p>

        {/* Stats pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75 }}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            justifyContent: "center",
          }}
        >
          {stats.map((s, i) => (
            <div
              key={i}
              style={{
                ...glassCard,
                padding: "14px 28px",
                borderRadius: 40,
                display: "flex",
                alignItems: "baseline",
                gap: 8,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-manrope), sans-serif",
                  fontWeight: 800,
                  fontSize: 22,
                  color: C.frostDeep,
                }}
              >
                {s.value}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: 13,
                  color: C.darkMuted,
                  fontWeight: 500,
                }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom frost edge */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 80,
          background: `linear-gradient(to bottom, transparent, ${C.bg})`,
          pointerEvents: "none",
        }}
      />
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━ PROJECT CARD ━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const { hovered, bind } = useHover();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.1 }}
      {...bind}
      style={{
        ...glassCard,
        cursor: "default",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 16px 48px rgba(59,130,246,0.1)"
          : "0 4px 20px rgba(30,41,59,0.04)",
      }}
    >
      {/* Shimmer overlay */}
      <div
        style={{
          ...shimmerOverlay,
          ...(hovered ? shimmerActive : {}),
        }}
      />

      {/* Image */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16/10",
          overflow: "hidden",
          borderRadius: "16px 16px 0 0",
          background: C.crystal,
        }}
      >
        <img
          src={getProjectImage("frost", project.image)}
          alt={project.title}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.5s ease",
            transform: hovered ? "scale(1.04)" : "scale(1)",
          }}
        />
        {/* Temperature tag */}
        <div style={{ position: "absolute", top: 12, right: 12, zIndex: 3 }}>
          <TempLabel value={`-${(index + 1) * 7}`} />
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "24px 28px 28px", position: "relative", zIndex: 3 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 8,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 12,
              fontWeight: 500,
              color: C.frostDeep,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {project.client}
          </span>
          <span
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 12,
              color: C.darkMuted,
            }}
          >
            {project.year}
          </span>
        </div>

        <h3
          style={{
            fontFamily: "var(--font-manrope), sans-serif",
            fontWeight: 700,
            fontSize: 20,
            color: C.dark,
            marginBottom: 10,
            letterSpacing: "-0.02em",
            lineHeight: 1.25,
          }}
        >
          {project.title}
        </h3>

        <p
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 14,
            lineHeight: 1.6,
            color: C.darkMuted,
            marginBottom: 16,
          }}
        >
          {project.description}
        </p>

        {project.technical && (
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 13,
              lineHeight: 1.55,
              color: "rgba(30,41,59,0.55)",
              marginBottom: 16,
              fontStyle: "italic",
            }}
          >
            {project.technical}
          </p>
        )}

        {/* Tech tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
          {project.tech.map((t) => (
            <span
              key={t}
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 11,
                fontWeight: 500,
                padding: "4px 10px",
                borderRadius: 20,
                background: C.shimmer,
                color: C.frostDeep,
                letterSpacing: "0.02em",
                border: `1px solid ${C.border}`,
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 13,
              fontWeight: 500,
              color: C.frostDeep,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            View Source
          </a>
        )}
      </div>
    </motion.div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━ PROJECTS SECTION ━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ProjectsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="projects"
      style={{ position: "relative", paddingTop: 100, paddingBottom: 100, background: C.bg }}
      className={sectionPad}
    >
      <FrostBranch side="right" top={40} />
      <FrostBranch side="left" top={400} />

      <div className={maxW}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 56 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                width: 36,
                height: 2,
                background: C.frost,
                borderRadius: 1,
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 12,
                fontWeight: 600,
                color: C.frostDeep,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Selected Work
            </span>
            <TempLabel value="-18" />
          </div>
          <h2
            style={{
              fontFamily: "var(--font-manrope), sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
              color: C.dark,
              letterSpacing: "-0.03em",
              lineHeight: 1.12,
            }}
          >
            Frozen in <span style={{ color: C.frostDeep }}>excellence</span>
          </h2>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
            gap: 28,
          }}
        >
          {projects.map((p, i) => (
            <ProjectCard key={p.title} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━ EXPERTISE SECTION ━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ExpertiseSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="expertise"
      style={{
        position: "relative",
        paddingTop: 100,
        paddingBottom: 100,
        background: `linear-gradient(175deg, ${C.bg} 0%, ${C.ice} 50%, ${C.crystal} 100%)`,
        overflow: "hidden",
      }}
      className={sectionPad}
    >
      <FrostBranch side="left" top={60} />
      <FrostBranch side="right" top={300} />

      {/* Decorative facets */}
      <CrystalFacet
        style={{ top: "10%", right: "4%", opacity: 0.2, width: 100, height: 100 }}
      />
      <CrystalFacet
        color="rgba(59,130,246,0.05)"
        style={{ bottom: "8%", left: "2%", opacity: 0.2, width: 80, height: 80 }}
      />

      <div className={maxW}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 56 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                width: 36,
                height: 2,
                background: C.frost,
                borderRadius: 1,
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 12,
                fontWeight: 600,
                color: C.frostDeep,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Expertise
            </span>
            <TempLabel value="-34" />
          </div>
          <h2
            style={{
              fontFamily: "var(--font-manrope), sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
              color: C.dark,
              letterSpacing: "-0.03em",
              lineHeight: 1.12,
            }}
          >
            Crystal <span style={{ color: C.frostDeep }}>facets</span> of skill
          </h2>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 24,
          }}
        >
          {expertise.map((e, i) => (
            <ExpertiseCard key={e.title} item={e} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ExpertiseCard({
  item,
  index,
}: {
  item: (typeof expertise)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const { hovered, bind } = useHover();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      {...bind}
      style={{
        ...glassCard,
        padding: "32px 28px",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 12px 40px rgba(59,130,246,0.08)"
          : "0 2px 12px rgba(30,41,59,0.03)",
      }}
    >
      {/* Shimmer */}
      <div
        style={{
          ...shimmerOverlay,
          ...(hovered ? shimmerActive : {}),
        }}
      />

      {/* Crystal facet icon area */}
      <div
        style={{
          position: "relative",
          zIndex: 3,
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            background: C.shimmer,
            border: `1px solid ${C.border}`,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              stroke={C.frostDeep}
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <TempLabel value={`-${(index + 2) * 9}`} />
      </div>

      <h3
        style={{
          fontFamily: "var(--font-manrope), sans-serif",
          fontWeight: 700,
          fontSize: 18,
          color: C.dark,
          marginBottom: 10,
          letterSpacing: "-0.015em",
          lineHeight: 1.3,
          position: "relative",
          zIndex: 3,
        }}
      >
        {item.title}
      </h3>

      <p
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: 14,
          lineHeight: 1.65,
          color: C.darkMuted,
          position: "relative",
          zIndex: 3,
        }}
      >
        {item.body}
      </p>
    </motion.div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━ TOOLS SECTION ━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ToolsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="tools"
      style={{
        position: "relative",
        paddingTop: 100,
        paddingBottom: 100,
        background: C.bg,
        overflow: "hidden",
      }}
      className={sectionPad}
    >
      <FrostBranch side="right" top={20} />

      <div className={maxW}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 56 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                width: 36,
                height: 2,
                background: C.frost,
                borderRadius: 1,
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 12,
                fontWeight: 600,
                color: C.frostDeep,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Frozen Specimens
            </span>
            <TempLabel value="-40" />
          </div>
          <h2
            style={{
              fontFamily: "var(--font-manrope), sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
              color: C.dark,
              letterSpacing: "-0.03em",
              lineHeight: 1.12,
            }}
          >
            Tools in the <span style={{ color: C.frostDeep }}>permafrost</span>
          </h2>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 24,
          }}
        >
          {tools.map((group, gi) => (
            <ToolGroupCard key={group.label} group={group} index={gi} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ToolGroupCard({
  group,
  index,
}: {
  group: (typeof tools)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const { hovered, bind } = useHover();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      {...bind}
      style={{
        ...glassCard,
        padding: "28px 26px",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 12px 40px rgba(59,130,246,0.08)"
          : "0 2px 12px rgba(30,41,59,0.03)",
      }}
    >
      {/* Shimmer */}
      <div
        style={{
          ...shimmerOverlay,
          ...(hovered ? shimmerActive : {}),
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 18,
          position: "relative",
          zIndex: 3,
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-manrope), sans-serif",
            fontWeight: 700,
            fontSize: 16,
            color: C.dark,
            letterSpacing: "-0.01em",
          }}
        >
          {group.label}
        </h3>
        <TempLabel value={`-${(index + 3) * 6}`} />
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          position: "relative",
          zIndex: 3,
        }}
      >
        {group.items.map((item) => (
          <span
            key={item}
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 12,
              fontWeight: 500,
              padding: "6px 14px",
              borderRadius: 20,
              background: "rgba(255,255,255,0.6)",
              border: `1px solid ${C.border}`,
              color: C.dark,
              letterSpacing: "0.01em",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              transition: "background 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = C.frostDeep;
              e.currentTarget.style.color = C.white;
              e.currentTarget.style.borderColor = C.frostDeep;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.6)";
              e.currentTarget.style.color = C.dark;
              e.currentTarget.style.borderColor = C.border;
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━ FOOTER ━━━━━━━━━━━━━━━━━━━━━━━━━ */
function Footer() {
  return (
    <footer
      style={{
        position: "relative",
        paddingTop: 80,
        paddingBottom: 60,
        background: `linear-gradient(175deg, ${C.bg} 0%, ${C.ice} 60%, ${C.crystal} 100%)`,
        overflow: "hidden",
      }}
      className={sectionPad}
    >
      <FrostBranch side="left" top={0} />
      <FrostBranch side="right" top={80} />

      <CrystalFacet
        style={{ bottom: 20, right: "10%", opacity: 0.15, width: 100, height: 100 }}
      />

      <div className={maxW} style={{ position: "relative", zIndex: 2 }}>
        {/* Top divider */}
        <div
          style={{
            height: 1,
            background: `linear-gradient(to right, transparent, ${C.frost}, transparent)`,
            marginBottom: 48,
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 24,
          }}
        >
          {/* Small crystal */}
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
          >
            <IceCrystal size={60} style={{ opacity: 0.35 }} />
          </motion.div>

          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 14,
              color: C.darkMuted,
              maxWidth: 420,
              lineHeight: 1.6,
            }}
          >
            Engineered with the clarity and precision of arctic crystal. Every
            pixel frozen to perfection.
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <TempLabel value="-50" />
            <span
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 12,
                color: "rgba(30,41,59,0.3)",
              }}
            >
              &copy; {new Date().getFullYear()}
            </span>
          </div>

          {/* Theme Switcher */}
          <div style={{ marginTop: 16 }}>
            <ThemeSwitcher current="/frost" variant="light" />
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━ PAGE EXPORT ━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function FrostPage() {
  return (
    <div
      style={{
        background: C.bg,
        minHeight: "100vh",
        fontFamily: "var(--font-inter), sans-serif",
      }}
    >
      <style>{`
        html { scroll-behavior: smooth; }
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: ${C.bg}; }
        ::selection { background: ${C.frost}; color: ${C.dark}; }
        @media (max-width: 480px) {
          .max-w-\\[1320px\\] { padding-left: 4px; padding-right: 4px; }
        }
      `}</style>
      <Navigation />
      <HeroSection />
      <ProjectsSection />
      <ExpertiseSection />
      <ToolsSection />
      <Footer />
    </div>
  );
}
