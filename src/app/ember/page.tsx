"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { getProjectImage } from "@/lib/theme-images";

/* ═══════════════════════════════════════════════════
   COLORS
   ═══════════════════════════════════════════════════ */
const C = {
  bg: "#0C0A08",
  obsidian: "#1A1614",
  ember: "#F97316",
  emberGlow: "rgba(249,115,22,0.25)",
  lava: "#DC2626",
  lavaGlow: "rgba(220,38,38,0.2)",
  magma: "#FBBF24",
  ash: "#78716C",
  text: "#F5F0EB",
  textMuted: "rgba(245,240,235,0.4)",
  crackGlow: "rgba(249,115,22,0.15)",
  border: "rgba(249,115,22,0.1)",
};

/* ═══════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════ */
const sora = (weight: number = 600) =>
  `var(--font-sora), ui-sans-serif, system-ui, sans-serif`;
const inter = () =>
  `var(--font-inter), ui-sans-serif, system-ui, sans-serif`;

function injectKeyframes() {
  if (typeof window === "undefined") return;
  if (document.getElementById("ember-keyframes")) return;
  const style = document.createElement("style");
  style.id = "ember-keyframes";
  style.textContent = `
    @keyframes ember-rise {
      0% {
        transform: translateY(0) translateX(0) scale(1);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      70% {
        opacity: 0.6;
      }
      100% {
        transform: translateY(-420px) translateX(var(--drift)) scale(0.2);
        opacity: 0;
      }
    }
    @keyframes heat-haze {
      0%, 100% {
        transform: translateY(0px);
        filter: blur(0px);
      }
      25% {
        transform: translateY(-1.5px);
      }
      50% {
        transform: translateY(0.5px);
      }
      75% {
        transform: translateY(-0.8px);
      }
    }
    @keyframes crack-pulse {
      0%, 100% {
        opacity: 0.5;
        filter: drop-shadow(0 0 6px rgba(249,115,22,0.4));
      }
      50% {
        opacity: 1;
        filter: drop-shadow(0 0 12px rgba(249,115,22,0.7));
      }
    }
    @keyframes magma-flow {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }
    @keyframes volcanic-rumble {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-0.5px); }
      75% { transform: translateX(0.5px); }
    }
    @keyframes glow-breathe {
      0%, 100% {
        box-shadow: 0 0 20px rgba(249,115,22,0.1), inset 0 1px 0 rgba(249,115,22,0.05);
      }
      50% {
        box-shadow: 0 0 30px rgba(249,115,22,0.2), inset 0 1px 0 rgba(249,115,22,0.1);
      }
    }
  `;
  document.head.appendChild(style);
}

/* ═══════════════════════════════════════════════════
   LAVA CRACK SVG
   ═══════════════════════════════════════════════════ */
function LavaCracks() {
  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
        animation: "crack-pulse 4s ease-in-out infinite",
      }}
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      {/* Main crack from top-left */}
      <path
        d="M0 200 L120 230 L180 280 L220 260 L310 310 L340 380 L420 400 L460 370 L530 420 L580 500 L640 480 L700 530"
        stroke={C.ember}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
        filter="url(#crack-glow)"
      />
      {/* Branch crack */}
      <path
        d="M310 310 L350 250 L410 220 L430 160 L500 130"
        stroke={C.ember}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
        filter="url(#crack-glow)"
      />
      {/* Secondary crack from right */}
      <path
        d="M1200 400 L1100 430 L1040 470 L980 440 L920 490 L860 530 L800 510 L740 560 L700 530"
        stroke={C.lava}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
        filter="url(#crack-glow)"
      />
      {/* Lower crack */}
      <path
        d="M200 800 L260 720 L320 700 L380 730 L450 680 L520 650 L580 500"
        stroke={C.ember}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.35"
        filter="url(#crack-glow)"
      />
      {/* Thin fissures */}
      <path
        d="M800 0 L780 80 L810 150 L790 220 L830 280"
        stroke={C.magma}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.3"
        filter="url(#crack-glow)"
      />
      <path
        d="M920 490 L950 560 L930 620 L970 700 L940 800"
        stroke={C.ember}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.25"
        filter="url(#crack-glow)"
      />
      <defs>
        <filter id="crack-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════
   EMBER PARTICLES
   ═══════════════════════════════════════════════════ */
function EmberParticles({ count = 10 }: { count?: number }) {
  const particles = Array.from({ length: count }, (_, i) => {
    const left = 5 + Math.random() * 90;
    const size = 2 + Math.random() * 4;
    const duration = 3 + Math.random() * 4;
    const delay = Math.random() * 5;
    const drift = -30 + Math.random() * 60;
    const startBottom = Math.random() * 30;
    return (
      <div
        key={i}
        style={{
          position: "absolute",
          bottom: `${startBottom}%`,
          left: `${left}%`,
          width: size,
          height: size,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.magma} 0%, ${C.ember} 40%, transparent 70%)`,
          boxShadow: `0 0 ${size * 2}px ${C.ember}, 0 0 ${size * 4}px ${C.lavaGlow}`,
          animation: `ember-rise ${duration}s ease-out ${delay}s infinite`,
          ["--drift" as string]: `${drift}px`,
          opacity: 0,
          zIndex: 2,
          pointerEvents: "none" as const,
        }}
      />
    );
  });
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 2,
      }}
    >
      {particles}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   VOLCANIC TEXTURE OVERLAY
   ═══════════════════════════════════════════════════ */
function VolcanicTexture() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "256px 256px",
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════
   MAGMA GRADIENT DIVIDER
   ═══════════════════════════════════════════════════ */
function MagmaDivider() {
  return (
    <div
      style={{
        width: "100%",
        height: 3,
        background: `linear-gradient(90deg, transparent 0%, ${C.ember} 20%, ${C.lava} 50%, ${C.ember} 80%, transparent 100%)`,
        backgroundSize: "200% 100%",
        animation: "magma-flow 6s ease-in-out infinite",
        opacity: 0.7,
        margin: "0 auto",
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════
   NAVIGATION
   ═══════════════════════════════════════════════════ */
function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 clamp(1.5rem, 4vw, 3rem)",
        height: 64,
        background: scrolled
          ? `${C.bg}ee`
          : "transparent",
        backdropFilter: scrolled ? "blur(16px) saturate(140%)" : "none",
        borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
        transition: "all 0.4s ease",
      }}
    >
      <a
        href="#hero"
        style={{
          fontFamily: sora(),
          fontSize: 18,
          fontWeight: 700,
          color: C.text,
          textDecoration: "none",
          letterSpacing: "-0.02em",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: C.ember,
            boxShadow: `0 0 10px ${C.ember}, 0 0 20px ${C.emberGlow}`,
          }}
        />
        Portfolio
      </a>
      <div style={{ display: "flex", gap: "clamp(1rem, 3vw, 2.5rem)", alignItems: "center" }}>
        {["Projects", "Expertise", "Tools"].map((label) => (
          <a
            key={label}
            href={`#${label.toLowerCase()}`}
            style={{
              fontFamily: inter(),
              fontSize: 13,
              fontWeight: 500,
              color: C.textMuted,
              textDecoration: "none",
              textTransform: "uppercase" as const,
              letterSpacing: "0.08em",
              transition: "color 0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.ember)}
            onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}
          >
            {label}
          </a>
        ))}
      </div>
    </motion.nav>
  );
}

/* ═══════════════════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════════════════ */
function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={ref}
      id="hero"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px clamp(1.5rem, 5vw, 4rem) 80px",
        overflow: "hidden",
        background: C.bg,
      }}
    >
      {/* Radial magma glow */}
      <motion.div
        style={{ y: bgY }}
      >
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "120vw",
            height: "80vh",
            borderRadius: "50%",
            background: `radial-gradient(ellipse at center, ${C.emberGlow} 0%, ${C.lavaGlow} 30%, transparent 70%)`,
            filter: "blur(60px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      </motion.div>

      {/* Lava cracks behind text */}
      <LavaCracks />

      {/* Ember particles */}
      <EmberParticles count={12} />

      {/* Content */}
      <motion.div
        style={{ opacity: textOpacity, position: "relative", zIndex: 5, textAlign: "center" as const }}
      >
        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          style={{
            fontFamily: inter(),
            fontSize: 13,
            fontWeight: 500,
            textTransform: "uppercase" as const,
            letterSpacing: "0.2em",
            color: C.ember,
            marginBottom: 24,
          }}
        >
          Forged in the fires of innovation
        </motion.p>

        {/* Title with heat haze */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          style={{
            fontFamily: sora(),
            fontSize: "clamp(3rem, 8vw, 7rem)",
            fontWeight: 800,
            lineHeight: 1.05,
            color: C.text,
            letterSpacing: "-0.03em",
            marginBottom: 24,
            animation: "heat-haze 6s ease-in-out infinite",
          }}
        >
          Creative
          <br />
          <span
            style={{
              background: `linear-gradient(135deg, ${C.ember}, ${C.lava}, ${C.magma})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Developer
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          style={{
            fontFamily: inter(),
            fontSize: "clamp(1rem, 2vw, 1.25rem)",
            color: C.textMuted,
            maxWidth: 540,
            margin: "0 auto 48px",
            lineHeight: 1.7,
          }}
        >
          Crafting digital experiences with the intensity and precision
          of molten steel meeting obsidian stone.
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7 }}
          style={{
            display: "flex",
            gap: "clamp(2rem, 5vw, 4rem)",
            justifyContent: "center",
            flexWrap: "wrap" as const,
          }}
        >
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: "center" as const }}>
              <div
                style={{
                  fontFamily: sora(),
                  fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
                  fontWeight: 700,
                  color: C.ember,
                  textShadow: `0 0 20px ${C.emberGlow}`,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontFamily: inter(),
                  fontSize: 12,
                  color: C.textMuted,
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.1em",
                  marginTop: 4,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom magma glow */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 120,
          background: `linear-gradient(to top, ${C.obsidian}, transparent)`,
          zIndex: 3,
          pointerEvents: "none",
        }}
      />
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   PROJECT CARD
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
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: "easeOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        borderRadius: 16,
        overflow: "hidden",
        cursor: "pointer",
        background: C.obsidian,
        border: `1px solid ${hovered ? C.ember : C.border}`,
        boxShadow: hovered
          ? `0 0 30px ${C.emberGlow}, 0 0 60px ${C.lavaGlow}, inset 0 1px 0 ${C.border}`
          : `0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 ${C.border}`,
        transition: "all 0.5s ease",
        animation: hovered ? "glow-breathe 2s ease-in-out infinite" : "none",
      }}
    >
      {/* Cooling gradient border effect */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 16,
          padding: 1,
          background: hovered
            ? `linear-gradient(135deg, ${C.ember}, ${C.lava}, transparent 60%)`
            : "transparent",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude" as const,
          pointerEvents: "none" as const,
          transition: "all 0.5s ease",
          zIndex: 2,
        }}
      />

      {/* Image */}
      <div
        style={{
          position: "relative",
          height: 220,
          overflow: "hidden",
          background: `linear-gradient(135deg, ${C.obsidian}, ${C.bg})`,
        }}
      >
        <img
          src={getProjectImage("ember", project.image)}
          alt={project.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover" as const,
            transition: "transform 0.6s ease, filter 0.6s ease",
            transform: hovered ? "scale(1.08)" : "scale(1)",
            filter: hovered ? "brightness(1.1)" : "brightness(0.7) saturate(0.7)",
          }}
        />
        {/* Ember overlay on hover */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: hovered
              ? `linear-gradient(to top, ${C.bg}ee, transparent 60%, ${C.emberGlow})`
              : `linear-gradient(to top, ${C.bg}dd, transparent)`,
            transition: "all 0.5s ease",
          }}
        />
        {/* Year badge */}
        <div
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            fontFamily: sora(),
            fontSize: 11,
            fontWeight: 600,
            color: C.text,
            background: `${C.bg}cc`,
            padding: "4px 10px",
            borderRadius: 6,
            border: `1px solid ${C.border}`,
            backdropFilter: "blur(8px)",
          }}
        >
          {project.year}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "20px 24px 24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <h3
            style={{
              fontFamily: sora(),
              fontSize: 18,
              fontWeight: 700,
              color: C.text,
              letterSpacing: "-0.01em",
            }}
          >
            {project.title}
          </h3>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: C.ash,
                transition: "color 0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.ember)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.ash)}
              onClick={(e) => e.stopPropagation()}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
          )}
        </div>

        {project.client && (
          <p
            style={{
              fontFamily: inter(),
              fontSize: 12,
              color: C.ember,
              marginBottom: 8,
              fontWeight: 500,
            }}
          >
            {project.client}
          </p>
        )}

        <p
          style={{
            fontFamily: inter(),
            fontSize: 14,
            color: C.textMuted,
            lineHeight: 1.6,
            marginBottom: 16,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical" as const,
            overflow: "hidden",
          }}
        >
          {project.description}
        </p>

        {/* Tech tags */}
        <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
          {project.tech.slice(0, 4).map((t) => (
            <span
              key={t}
              style={{
                fontFamily: inter(),
                fontSize: 11,
                fontWeight: 500,
                color: C.ash,
                background: `${C.bg}`,
                border: `1px solid ${C.border}`,
                padding: "3px 10px",
                borderRadius: 20,
                letterSpacing: "0.02em",
              }}
            >
              {t}
            </span>
          ))}
          {project.tech.length > 4 && (
            <span
              style={{
                fontFamily: inter(),
                fontSize: 11,
                fontWeight: 500,
                color: C.textMuted,
                padding: "3px 6px",
              }}
            >
              +{project.tech.length - 4}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   PROJECTS SECTION
   ═══════════════════════════════════════════════════ */
function ProjectsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="projects"
      style={{
        position: "relative",
        padding: "100px clamp(1.5rem, 5vw, 4rem)",
        background: C.obsidian,
        zIndex: 1,
      }}
    >
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        style={{ textAlign: "center" as const, marginBottom: 64 }}
      >
        <p
          style={{
            fontFamily: inter(),
            fontSize: 12,
            fontWeight: 600,
            textTransform: "uppercase" as const,
            letterSpacing: "0.2em",
            color: C.ember,
            marginBottom: 12,
          }}
        >
          Selected Work
        </p>
        <h2
          style={{
            fontFamily: sora(),
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
            fontWeight: 800,
            color: C.text,
            letterSpacing: "-0.03em",
          }}
        >
          Obsidian-Forged Projects
        </h2>
      </motion.div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: 28,
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {projects.map((p, i) => (
          <ProjectCard key={p.title} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   EXPERTISE SECTION
   ═══════════════════════════════════════════════════ */
function ExpertiseSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="expertise"
      style={{
        position: "relative",
        padding: "100px clamp(1.5rem, 5vw, 4rem)",
        background: C.bg,
        zIndex: 1,
        overflow: "hidden",
      }}
    >
      {/* Background volcanic glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80vw",
          height: "60vh",
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${C.crackGlow} 0%, transparent 70%)`,
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        style={{
          textAlign: "center" as const,
          marginBottom: 64,
          position: "relative",
          zIndex: 2,
        }}
      >
        <p
          style={{
            fontFamily: inter(),
            fontSize: 12,
            fontWeight: 600,
            textTransform: "uppercase" as const,
            letterSpacing: "0.2em",
            color: C.ember,
            marginBottom: 12,
          }}
        >
          Volcanic Chambers
        </p>
        <h2
          style={{
            fontFamily: sora(),
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
            fontWeight: 800,
            color: C.text,
            letterSpacing: "-0.03em",
          }}
        >
          Areas of Expertise
        </h2>
      </motion.div>

      {/* Expertise panels */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 24,
          maxWidth: 1000,
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        {expertise.map((item, i) => (
          <ExpertisePanel key={item.title} item={item} index={i} inView={inView} />
        ))}
      </div>
    </section>
  );
}

function ExpertisePanel({
  item,
  index,
  inView,
}: {
  item: { title: string; body: string };
  index: number;
  inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        padding: 32,
        borderRadius: 14,
        background: hovered
          ? `linear-gradient(145deg, ${C.obsidian}, ${C.bg})`
          : C.obsidian,
        border: `1px solid ${hovered ? C.ember : C.border}`,
        transition: "all 0.4s ease",
        cursor: "default",
        overflow: "hidden",
      }}
    >
      {/* Lava seam at top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 24,
          right: 24,
          height: 2,
          background: hovered
            ? `linear-gradient(90deg, transparent, ${C.ember}, transparent)`
            : "transparent",
          transition: "all 0.5s ease",
          boxShadow: hovered ? `0 0 12px ${C.emberGlow}` : "none",
        }}
      />

      {/* Index number */}
      <span
        style={{
          fontFamily: sora(),
          fontSize: 48,
          fontWeight: 800,
          color: hovered ? C.emberGlow : `${C.text}08`,
          position: "absolute",
          top: 16,
          right: 20,
          lineHeight: 1,
          transition: "color 0.4s ease",
          pointerEvents: "none",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <h3
        style={{
          fontFamily: sora(),
          fontSize: 20,
          fontWeight: 700,
          color: C.text,
          marginBottom: 12,
          letterSpacing: "-0.01em",
          position: "relative",
        }}
      >
        {item.title}
      </h3>
      <p
        style={{
          fontFamily: inter(),
          fontSize: 14,
          color: C.textMuted,
          lineHeight: 1.7,
          position: "relative",
        }}
      >
        {item.body}
      </p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   TOOLS SECTION
   ═══════════════════════════════════════════════════ */
function ToolsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="tools"
      style={{
        position: "relative",
        padding: "100px clamp(1.5rem, 5vw, 4rem)",
        background: C.obsidian,
        zIndex: 1,
      }}
    >
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        style={{
          textAlign: "center" as const,
          marginBottom: 64,
        }}
      >
        <p
          style={{
            fontFamily: inter(),
            fontSize: 12,
            fontWeight: 600,
            textTransform: "uppercase" as const,
            letterSpacing: "0.2em",
            color: C.ember,
            marginBottom: 12,
          }}
        >
          Mineral Catalog
        </p>
        <h2
          style={{
            fontFamily: sora(),
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
            fontWeight: 800,
            color: C.text,
            letterSpacing: "-0.03em",
          }}
        >
          Tools & Elements
        </h2>
      </motion.div>

      {/* Tool groups */}
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 28,
        }}
      >
        {tools.map((group, gi) => (
          <ToolGroup key={group.label} group={group} index={gi} inView={inView} />
        ))}
      </div>
    </section>
  );
}

function ToolGroup({
  group,
  index,
  inView,
}: {
  group: { label: string; items: string[] };
  index: number;
  inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: 28,
        borderRadius: 14,
        background: C.bg,
        border: `1px solid ${hovered ? C.ember : C.border}`,
        transition: "all 0.4s ease",
        boxShadow: hovered
          ? `0 8px 32px ${C.lavaGlow}, 0 0 0 1px ${C.border}`
          : `0 2px 12px rgba(0,0,0,0.2)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Magma pool glow at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: -20,
          left: "50%",
          transform: "translateX(-50%)",
          width: "80%",
          height: 40,
          borderRadius: "50%",
          background: hovered
            ? `radial-gradient(ellipse, ${C.emberGlow}, transparent)`
            : "transparent",
          filter: "blur(20px)",
          transition: "all 0.5s ease",
          pointerEvents: "none",
        }}
      />

      {/* Label */}
      <h3
        style={{
          fontFamily: sora(),
          fontSize: 14,
          fontWeight: 700,
          color: hovered ? C.ember : C.text,
          textTransform: "uppercase" as const,
          letterSpacing: "0.1em",
          marginBottom: 20,
          transition: "color 0.3s ease",
          position: "relative",
        }}
      >
        {group.label}
        <span
          style={{
            display: "block",
            width: hovered ? "100%" : 24,
            height: 2,
            background: `linear-gradient(90deg, ${C.ember}, ${C.lava})`,
            marginTop: 8,
            borderRadius: 1,
            transition: "width 0.5s ease",
          }}
        />
      </h3>

      {/* Items */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap" as const,
          gap: 8,
          position: "relative",
        }}
      >
        {group.items.map((item, ii) => (
          <MineralChip key={item} label={item} delay={ii * 0.03} />
        ))}
      </div>
    </motion.div>
  );
}

function MineralChip({ label, delay }: { label: string; delay: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: inter(),
        fontSize: 12,
        fontWeight: 500,
        color: hovered ? C.text : C.ash,
        background: hovered ? `${C.obsidian}` : "transparent",
        border: `1px solid ${hovered ? C.ember : C.border}`,
        padding: "5px 14px",
        borderRadius: 8,
        cursor: "default",
        transition: "all 0.3s ease",
        boxShadow: hovered ? `0 0 12px ${C.emberGlow}` : "none",
      }}
    >
      {label}
    </span>
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
        padding: "60px clamp(1.5rem, 5vw, 4rem) 40px",
        background: C.bg,
        zIndex: 1,
      }}
    >
      <MagmaDivider />

      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          paddingTop: 48,
          display: "flex",
          flexDirection: "column" as const,
          alignItems: "center",
          gap: 32,
        }}
      >
        {/* Ember brand mark */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: `linear-gradient(135deg, ${C.ember}, ${C.lava})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 30px ${C.emberGlow}, 0 0 60px ${C.lavaGlow}`,
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C8 6 4 10 4 14a8 8 0 1016 0c0-4-4-8-8-12zm0 18a6 6 0 01-6-6c0-3 2.5-6.5 6-10 3.5 3.5 6 7 6 10a6 6 0 01-6 6z"
              fill={C.text}
              opacity="0.9"
            />
            <path
              d="M12 20a4 4 0 004-4c0-2-2-5-4-7-2 2-4 5-4 7a4 4 0 004 4z"
              fill={C.magma}
              opacity="0.6"
            />
          </svg>
        </div>

        <p
          style={{
            fontFamily: inter(),
            fontSize: 13,
            color: C.textMuted,
            textAlign: "center" as const,
            maxWidth: 400,
            lineHeight: 1.7,
          }}
        >
          Every line of code is tempered in heat, shaped by pressure,
          and polished to obsidian perfection.
        </p>

        {/* Theme Switcher */}
        <ThemeSwitcher current="/ember" variant="dark" />

        <p
          style={{
            fontFamily: inter(),
            fontSize: 11,
            color: `${C.text}22`,
            letterSpacing: "0.05em",
            marginTop: 8,
          }}
        >
          {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════
   PAGE EXPORT
   ═══════════════════════════════════════════════════ */
export default function EmberPage() {
  useEffect(() => {
    injectKeyframes();
  }, []);

  return (
    <main
      style={{
        background: C.bg,
        color: C.text,
        minHeight: "100vh",
        overflowX: "hidden" as const,
        fontFamily: inter(),
      }}
    >
      <VolcanicTexture />
      <Navigation />
      <HeroSection />
      <MagmaDivider />
      <ProjectsSection />
      <MagmaDivider />
      <ExpertiseSection />
      <MagmaDivider />
      <ToolsSection />
      <Footer />
    </main>
  );
}
