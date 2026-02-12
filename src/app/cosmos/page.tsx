"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { getProjectImage } from "@/lib/theme-images";

/* ─────────────────── Colors ─────────────────── */
const SPACE_BLACK = "#050510";
const NEBULA_PURPLE = "#6D28D9";
const STELLAR_CYAN = "#22D3EE";
const STARDUST = "#E2E8F0";

/* ─────────────── Star Generation ─────────────── */
function generateStars(
  count: number,
  seed: number,
  fieldW: number,
  fieldH: number,
): string {
  const shadows: string[] = [];
  for (let i = 0; i < count; i++) {
    const x = ((i * 137 + seed * 251 + 47) * 997) % fieldW;
    const y = ((i * 269 + seed * 127 + 83) * 991) % fieldH;
    shadows.push(`${x}px ${y}px`);
  }
  return shadows.join(", ");
}

/* Pre-compute star layers (deterministic) */
const FIELD_W = 2400;
const FIELD_H = 1800;
const starsLayer1 = generateStars(120, 1, FIELD_W, FIELD_H);
const starsLayer2 = generateStars(60, 2, FIELD_W, FIELD_H);
const starsLayer3 = generateStars(25, 3, FIELD_W, FIELD_H);

/* ─────────── Star Magnitude Rating ─────────── */
function MagnitudeStars({ index }: { index: number }) {
  const mag = 5 - (index % 5);
  return (
    <span className="text-sm tracking-widest" style={{ color: STELLAR_CYAN }}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          style={{ opacity: i < mag ? 1 : 0.2 }}
        >
          {"\u2605"}
        </span>
      ))}
    </span>
  );
}

/* ────────────── Section Wrapper ─────────────── */
function FadeSection({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ────────── Constellation Lines (SVG) ────────── */
function ConstellationLines({ count }: { count: number }) {
  /*
   * We render a set of subtle dashed SVG lines connecting adjacent card
   * positions in the grid.  Because card layout is CSS-grid based, we use
   * a responsive overlay approach: horizontal lines between columns,
   * vertical lines between rows.  The SVG is purely decorative.
   */
  const cols = typeof window !== "undefined" && window.innerWidth >= 1024 ? 3 : typeof window !== "undefined" && window.innerWidth >= 640 ? 2 : 1;
  const rows = Math.ceil(count / cols);
  const lines: { x1: string; y1: string; x2: string; y2: string }[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      if (idx >= count) break;
      // horizontal to next
      if (c < cols - 1 && idx + 1 < count) {
        const x1p = `${((c + 1) / cols) * 100}%`;
        const y1p = `${(r + 0.5) / rows * 100}%`;
        const x2p = `${((c + 1) / cols) * 100}%`;
        const y2p = `${(r + 0.5) / rows * 100}%`;
        lines.push({
          x1: `${((c + 0.85) / cols) * 100}%`,
          y1: y1p,
          x2: `${((c + 1.15) / cols) * 100}%`,
          y2: y2p,
        });
      }
      // vertical to below
      if (r < rows - 1 && idx + cols < count) {
        lines.push({
          x1: `${((c + 0.5) / cols) * 100}%`,
          y1: `${((r + 0.85) / rows) * 100}%`,
          x2: `${((c + 0.5) / cols) * 100}%`,
          y2: `${((r + 1.15) / rows) * 100}%`,
        });
      }
    }
  }

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      preserveAspectRatio="none"
    >
      {lines.map((l, i) => (
        <line
          key={i}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke={STELLAR_CYAN}
          strokeWidth="1"
          strokeDasharray="6 8"
          strokeOpacity="0.15"
        />
      ))}
    </svg>
  );
}

/* ═══════════════════ MAIN PAGE ═══════════════════ */

export default function CosmosPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Nav links mapped to sections */
  const navLinks = [
    { label: "OBS LOG", href: "#observations" },
    { label: "ANALYSIS", href: "#analysis" },
    { label: "EQUIPMENT", href: "#equipment" },
    { label: "COMMS", href: "#comms" },
  ];

  return (
    <div
      className="relative min-h-screen overflow-x-hidden font-[family-name:var(--font-inter)]"
      style={{ background: SPACE_BLACK, color: STARDUST }}
    >
      {/* ───────── STAR FIELD LAYERS ───────── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      >
        {/* Layer 1 — tiny dim stars */}
        <div
          className="absolute inset-0"
          style={{
            width: FIELD_W,
            height: FIELD_H,
            boxShadow: starsLayer1,
            color: "rgba(255,255,255,0.4)",
            background: "transparent",
            transform: `translateY(${scrollY * 0.02}px)`,
            willChange: "transform",
          }}
        >
          <div
            style={{
              width: 1,
              height: 1,
              background: "transparent",
              boxShadow: starsLayer1.split(", ").map((s) => `${s} rgba(255,255,255,0.35)`).join(", "),
            }}
          />
        </div>
        {/* Layer 2 — medium stars */}
        <div
          className="absolute inset-0"
          style={{
            width: FIELD_W,
            height: FIELD_H,
            transform: `translateY(${scrollY * 0.05}px)`,
            willChange: "transform",
          }}
        >
          <div
            style={{
              width: 2,
              height: 2,
              borderRadius: "50%",
              background: "transparent",
              boxShadow: starsLayer2.split(", ").map((s) => `${s} rgba(255,255,255,0.6)`).join(", "),
            }}
          />
        </div>
        {/* Layer 3 — bright stars */}
        <div
          className="absolute inset-0"
          style={{
            width: FIELD_W,
            height: FIELD_H,
            transform: `translateY(${scrollY * 0.1}px)`,
            willChange: "transform",
          }}
        >
          <div
            style={{
              width: 3,
              height: 3,
              borderRadius: "50%",
              background: "transparent",
              boxShadow: starsLayer3.split(", ").map((s) => `${s} rgba(255,255,255,0.9)`).join(", "),
            }}
          />
        </div>
      </div>

      {/* ───────── NEBULA CLOUDS ───────── */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        {/* Cloud 1 — upper-right purple */}
        <div
          className="absolute"
          style={{
            top: "5%",
            right: "-10%",
            width: 900,
            height: 700,
            background: `radial-gradient(ellipse at center, rgba(109,40,217,0.12) 0%, transparent 70%)`,
            animation: "nebulaFloat1 35s ease-in-out infinite alternate",
          }}
        />
        {/* Cloud 2 — lower-left cyan */}
        <div
          className="absolute"
          style={{
            bottom: "10%",
            left: "-5%",
            width: 800,
            height: 600,
            background: `radial-gradient(ellipse at center, rgba(34,211,238,0.08) 0%, transparent 70%)`,
            animation: "nebulaFloat2 40s ease-in-out infinite alternate",
          }}
        />
        {/* Cloud 3 — center purple/cyan blend */}
        <div
          className="absolute"
          style={{
            top: "40%",
            left: "30%",
            width: 1000,
            height: 800,
            background: `radial-gradient(ellipse at center, rgba(109,40,217,0.07) 0%, rgba(34,211,238,0.04) 40%, transparent 70%)`,
            animation: "nebulaFloat3 30s ease-in-out infinite alternate",
          }}
        />
      </div>

      {/* ───────── FIXED NAV ───────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4"
        style={{
          background: `linear-gradient(to bottom, ${SPACE_BLACK}ee, ${SPACE_BLACK}00)`,
          backdropFilter: "blur(8px)",
        }}
      >
        <a
          href="#"
          className="text-lg tracking-[0.3em] font-bold font-[family-name:var(--font-orbitron)]"
          style={{ color: STARDUST }}
        >
          GROX
        </a>
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs tracking-[0.25em] font-medium font-[family-name:var(--font-orbitron)] transition-colors duration-300"
              style={{ color: "rgba(226,232,240,0.5)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = STELLAR_CYAN)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(226,232,240,0.5)")
              }
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>

      {/* ═══════════ HERO ═══════════ */}
      <header
        className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center"
        style={{ zIndex: 2 }}
      >
        {/* Telescope Reticle */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {/* Horizontal line */}
          <div
            className="absolute"
            style={{
              width: "100%",
              height: 1,
              top: "50%",
              left: 0,
              background: `linear-gradient(to right, transparent, rgba(34,211,238,0.06) 30%, rgba(34,211,238,0.06) 70%, transparent)`,
            }}
          />
          {/* Vertical line */}
          <div
            className="absolute"
            style={{
              height: "100%",
              width: 1,
              left: "50%",
              top: 0,
              background: `linear-gradient(to bottom, transparent, rgba(34,211,238,0.06) 30%, rgba(34,211,238,0.06) 70%, transparent)`,
            }}
          />
          {/* Center ring */}
          <div
            className="absolute rounded-full"
            style={{
              width: 200,
              height: 200,
              border: "1px solid rgba(34,211,238,0.05)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: 400,
              height: 400,
              border: "1px solid rgba(34,211,238,0.03)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-4xl"
        >
          <p
            className="text-xs tracking-[0.4em] mb-8 font-[family-name:var(--font-orbitron)]"
            style={{ color: STELLAR_CYAN, opacity: 0.7 }}
          >
            DEEP SPACE OBSERVATORY
          </p>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-8 font-[family-name:var(--font-orbitron)]"
            style={{
              color: STARDUST,
              textShadow: `0 0 40px rgba(34,211,238,0.3), 0 0 80px rgba(34,211,238,0.15), 0 0 120px rgba(109,40,217,0.1)`,
            }}
          >
            I turn AI models into products people use
          </h1>
          <div
            className="inline-block px-6 py-3 rounded-full border mb-12"
            style={{
              borderColor: "rgba(34,211,238,0.2)",
              background: "rgba(34,211,238,0.03)",
            }}
          >
            <p
              className="text-xs sm:text-sm tracking-[0.2em] font-[family-name:var(--font-orbitron)]"
              style={{ color: STELLAR_CYAN }}
            >
              OBS: {stats[0].value} TARGETS{" "}
              <span style={{ opacity: 0.4 }}>{"\u2022"}</span>{" "}
              {stats[1].value} INSTRUMENTS{" "}
              <span style={{ opacity: 0.4 }}>{"\u2022"}</span>{" "}
              {stats[2].value} SECTORS
            </p>
          </div>
          <p
            className="text-xs tracking-[0.3em] font-[family-name:var(--font-orbitron)]"
            style={{ color: "rgba(226,232,240,0.3)" }}
          >
            OBSERVATION LOG
          </p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ color: "rgba(34,211,238,0.3)" }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.div>
      </header>

      {/* ═══════════ PROJECTS / OBSERVATION LOG ═══════════ */}
      <FadeSection
        id="observations"
        className="relative px-6 md:px-12 lg:px-20 py-24"
      >
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Section header */}
          <div className="flex items-center gap-4 mb-4">
            <div
              className="h-px flex-1 max-w-[60px]"
              style={{ background: STELLAR_CYAN, opacity: 0.3 }}
            />
            <p
              className="text-xs tracking-[0.4em] font-[family-name:var(--font-orbitron)]"
              style={{ color: STELLAR_CYAN, opacity: 0.6 }}
            >
              CATALOG
            </p>
          </div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-16 font-[family-name:var(--font-orbitron)]"
            style={{
              color: STARDUST,
              textShadow: `0 0 30px rgba(34,211,238,0.15)`,
            }}
          >
            Observation Log
          </h2>

          {/* Grid with constellation overlay */}
          <div className="relative">
            <ConstellationLines count={projects.length} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
              {projects.map((project, i) => (
                <motion.a
                  key={project.title}
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group relative rounded-xl overflow-hidden cursor-pointer"
                  style={{
                    background: "rgba(5,5,16,0.8)",
                    border: "1px solid rgba(34,211,238,0.08)",
                    transition: "box-shadow 0.4s ease, border-color 0.4s ease",
                  }}
                  whileHover={{
                    boxShadow: `0 0 30px rgba(34,211,238,0.15), 0 0 60px rgba(34,211,238,0.05), inset 0 0 30px rgba(34,211,238,0.03)`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "rgba(34,211,238,0.25)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "rgba(34,211,238,0.08)";
                  }}
                >
                  {/* Project Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={getProjectImage("cosmos", project.image)}
                      alt={project.title.replace("\n", " ")}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      style={{
                        filter:
                          "brightness(0.5) saturate(0.6) sepia(0.2) hue-rotate(200deg)",
                      }}
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(to bottom, rgba(5,5,16,0.2), rgba(5,5,16,0.85))`,
                      }}
                    />
                    {/* Designation label */}
                    <div className="absolute top-3 left-3">
                      <span
                        className="text-[10px] tracking-[0.3em] px-2 py-1 rounded font-[family-name:var(--font-orbitron)]"
                        style={{
                          background: "rgba(5,5,16,0.7)",
                          color: STELLAR_CYAN,
                          border: "1px solid rgba(34,211,238,0.15)",
                        }}
                      >
                        OBS-{String(i + 1).padStart(3, "0")}
                      </span>
                    </div>
                    {/* Magnitude */}
                    <div className="absolute top-3 right-3">
                      <MagnitudeStars index={i} />
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="text-[10px] tracking-[0.2em] font-[family-name:var(--font-orbitron)]"
                        style={{ color: "rgba(226,232,240,0.35)" }}
                      >
                        {project.client} {"\u2022"} {project.year}
                      </span>
                    </div>
                    <h3
                      className="text-lg font-semibold mb-2 font-[family-name:var(--font-orbitron)] leading-tight"
                      style={{ color: STARDUST }}
                    >
                      {project.title.replace("\n", " ")}
                    </h3>
                    <p
                      className="text-sm leading-relaxed mb-4"
                      style={{ color: "rgba(226,232,240,0.55)" }}
                    >
                      {project.description}
                    </p>

                    {/* Instrument tags */}
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] tracking-wider px-2 py-0.5 rounded font-[family-name:var(--font-orbitron)]"
                          style={{
                            background: "rgba(109,40,217,0.1)",
                            border: "1px solid rgba(109,40,217,0.2)",
                            color: "rgba(226,232,240,0.6)",
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </FadeSection>

      {/* ═══════════ EXPERTISE / DEEP FIELD ANALYSIS ═══════════ */}
      <FadeSection
        id="analysis"
        className="relative px-6 md:px-12 lg:px-20 py-24"
      >
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="h-px flex-1 max-w-[60px]"
              style={{ background: NEBULA_PURPLE, opacity: 0.5 }}
            />
            <p
              className="text-xs tracking-[0.4em] font-[family-name:var(--font-orbitron)]"
              style={{ color: NEBULA_PURPLE, opacity: 0.8 }}
            >
              SECTOR SCAN
            </p>
          </div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-16 font-[family-name:var(--font-orbitron)]"
            style={{
              color: STARDUST,
              textShadow: `0 0 30px rgba(109,40,217,0.2)`,
            }}
          >
            Deep Field Analysis
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {expertise.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative rounded-xl p-6 group"
                style={{
                  background: "rgba(5,5,16,0.6)",
                  borderLeft: `2px solid ${NEBULA_PURPLE}`,
                  border: "1px solid rgba(109,40,217,0.15)",
                  borderLeftWidth: 3,
                  borderLeftColor: NEBULA_PURPLE,
                  transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px rgba(109,40,217,0.1), inset 0 0 30px rgba(109,40,217,0.03)`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                {/* Sector number */}
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="text-[10px] tracking-[0.3em] px-2 py-1 rounded font-[family-name:var(--font-orbitron)]"
                    style={{
                      background: "rgba(109,40,217,0.12)",
                      color: NEBULA_PURPLE,
                      border: "1px solid rgba(109,40,217,0.2)",
                    }}
                  >
                    SECTOR {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3
                  className="text-xl font-semibold mb-3 font-[family-name:var(--font-orbitron)]"
                  style={{ color: STARDUST }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "rgba(226,232,240,0.55)" }}
                >
                  {item.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeSection>

      {/* ═══════════ TOOLS / MISSION EQUIPMENT ═══════════ */}
      <FadeSection
        id="equipment"
        className="relative px-6 md:px-12 lg:px-20 py-24"
      >
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="h-px flex-1 max-w-[60px]"
              style={{ background: STELLAR_CYAN, opacity: 0.3 }}
            />
            <p
              className="text-xs tracking-[0.4em] font-[family-name:var(--font-orbitron)]"
              style={{ color: STELLAR_CYAN, opacity: 0.6 }}
            >
              MANIFEST
            </p>
          </div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-16 font-[family-name:var(--font-orbitron)]"
            style={{
              color: STARDUST,
              textShadow: `0 0 30px rgba(34,211,238,0.15)`,
            }}
          >
            Mission Equipment
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((category, i) => (
              <motion.div
                key={category.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="rounded-xl p-5"
                style={{
                  background: "rgba(5,5,16,0.5)",
                  border: "1px solid rgba(34,211,238,0.08)",
                }}
              >
                <h3
                  className="text-xs tracking-[0.3em] font-bold mb-4 font-[family-name:var(--font-orbitron)]"
                  style={{ color: STELLAR_CYAN }}
                >
                  {category.label.toUpperCase()}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.items.map((item) => (
                    <span
                      key={item}
                      className="text-xs px-3 py-1.5 rounded-full"
                      style={{
                        background: "rgba(226,232,240,0.04)",
                        border: "1px solid rgba(226,232,240,0.08)",
                        color: "rgba(226,232,240,0.6)",
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeSection>

      {/* ═══════════ CONTACT / COMMS ═══════════ */}
      <FadeSection
        id="comms"
        className="relative px-6 md:px-12 lg:px-20 py-24"
      >
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div
              className="h-px w-12"
              style={{ background: STELLAR_CYAN, opacity: 0.3 }}
            />
            <p
              className="text-xs tracking-[0.4em] font-[family-name:var(--font-orbitron)]"
              style={{ color: STELLAR_CYAN, opacity: 0.6 }}
            >
              OPEN CHANNEL
            </p>
            <div
              className="h-px w-12"
              style={{ background: STELLAR_CYAN, opacity: 0.3 }}
            />
          </div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 font-[family-name:var(--font-orbitron)]"
            style={{
              color: STARDUST,
              textShadow: `0 0 30px rgba(34,211,238,0.15)`,
            }}
          >
            Establish Comms
          </h2>
          <p
            className="text-base sm:text-lg leading-relaxed mb-10"
            style={{ color: "rgba(226,232,240,0.5)" }}
          >
            Ready to build something with AI that people actually use?
            Open a channel and let&apos;s discuss your mission parameters.
          </p>
          <a
            href="mailto:hello@grox.studio"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm tracking-[0.2em] font-semibold font-[family-name:var(--font-orbitron)] transition-all duration-300"
            style={{
              background: `linear-gradient(135deg, ${NEBULA_PURPLE}, ${STELLAR_CYAN})`,
              color: "#fff",
              boxShadow: `0 0 30px rgba(34,211,238,0.2), 0 0 60px rgba(109,40,217,0.15)`,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = `0 0 40px rgba(34,211,238,0.35), 0 0 80px rgba(109,40,217,0.25)`;
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px rgba(34,211,238,0.2), 0 0 60px rgba(109,40,217,0.15)`;
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            TRANSMIT SIGNAL
          </a>
        </div>
      </FadeSection>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer
        className="relative px-6 py-16 text-center"
        style={{ zIndex: 2 }}
      >
        <div
          className="h-px w-full max-w-md mx-auto mb-10"
          style={{
            background: `linear-gradient(to right, transparent, rgba(34,211,238,0.15), transparent)`,
          }}
        />
        <p
          className="text-[10px] sm:text-xs tracking-[0.3em] font-[family-name:var(--font-orbitron)]"
          style={{ color: "rgba(226,232,240,0.25)" }}
        >
          GROX DEEP SPACE OBSERVATORY{" "}
          <span style={{ opacity: 0.4 }}>{"\u2022"}</span> SECTOR 7G{" "}
          <span style={{ opacity: 0.4 }}>{"\u2022"}</span> STARDATE
          2025.001
        </p>

        {/* Theme Switcher */}
        <div className="mt-12">
          <ThemeSwitcher current="/cosmos" />
        </div>
      </footer>

      {/* ═══════════ GLOBAL ANIMATIONS ═══════════ */}
      <style jsx global>{`
        @keyframes nebulaFloat1 {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          100% {
            transform: translate(40px, -30px) scale(1.05);
          }
        }
        @keyframes nebulaFloat2 {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          100% {
            transform: translate(-30px, 20px) scale(1.08);
          }
        }
        @keyframes nebulaFloat3 {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          100% {
            transform: translate(25px, 15px) scale(1.03);
          }
        }

        html {
          scroll-behavior: smooth;
        }

        /* Scrollbar styling for deep space feel */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: ${SPACE_BLACK};
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(34, 211, 238, 0.15);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 211, 238, 0.3);
        }
      `}</style>
    </div>
  );
}
