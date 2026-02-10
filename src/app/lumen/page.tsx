"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";

/* ─────────────────── Colors ─────────────────── */
const ABYSS = "#020B18";
const BIO_CYAN = "#00E5CC";
const BIO_MAGENTA = "#E040FB";
const PEARL = "#E0F7FA";

/* ─────────────────── Depth Zones ─────────────────── */
const DEPTH_ZONES = [
  { depth: "0-200m", label: "EPIPELAGIC", color: BIO_CYAN },
  { depth: "200-1000m", label: "MESOPELAGIC", color: "#00B8A9" },
  { depth: "1000-4000m", label: "BATHYPELAGIC", color: BIO_MAGENTA },
  { depth: "4000m+", label: "ABYSSOPELAGIC", color: "#9C27B0" },
];

/* ─────────── Bio-Orb Config ─────────── */
const BIO_ORBS = [
  { size: 320, x: "8%", y: "12%", color: BIO_CYAN, delay: 0, duration: 28 },
  { size: 200, x: "75%", y: "5%", color: BIO_MAGENTA, delay: 4, duration: 35 },
  { size: 150, x: "60%", y: "25%", color: BIO_CYAN, delay: 8, duration: 22 },
  { size: 260, x: "20%", y: "40%", color: BIO_MAGENTA, delay: 2, duration: 32 },
  { size: 180, x: "85%", y: "55%", color: BIO_CYAN, delay: 6, duration: 26 },
  { size: 240, x: "40%", y: "70%", color: BIO_MAGENTA, delay: 10, duration: 38 },
  { size: 140, x: "10%", y: "80%", color: BIO_CYAN, delay: 3, duration: 30 },
  { size: 190, x: "70%", y: "85%", color: BIO_MAGENTA, delay: 7, duration: 24 },
];

/* ─────────── Specimen Classification ─────────── */
const SPECIMEN_CLASSES: Record<string, string> = {
  "Luxury Goods": "PHYLUM: AUTHENTICATION",
  "Media & Entertainment": "PHYLUM: GENERATION",
  "Research & Intelligence": "PHYLUM: INTELLIGENCE",
  "Developer Tools": "PHYLUM: ENGINEERING",
  Enterprise: "PHYLUM: INFRASTRUCTURE",
  "Real Estate": "PHYLUM: VISION",
  "Media & Publishing": "PHYLUM: SYNTHESIS",
  Finance: "PHYLUM: ANALYSIS",
  "Marketing Agency": "PHYLUM: ANALYTICS",
  "Creative Agency": "PHYLUM: CREATION",
};

/* ────────────── Section Wrapper ─────────────── */
function DepthReveal({
  children,
  className = "",
  id,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 60, filter: "blur(8px)" }}
      animate={
        inView
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : {}
      }
      transition={{
        duration: 1,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ────────── Bioluminescent Trail Line ────────── */
function BioTrail({
  startX,
  startY,
  endX,
  endY,
  color = BIO_CYAN,
  delay = 0,
}: {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color?: string;
  delay?: number;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <svg
      ref={ref}
      className="absolute pointer-events-none"
      style={{
        left: Math.min(startX, endX) - 10,
        top: Math.min(startY, endY) - 10,
        width: Math.abs(endX - startX) + 20,
        height: Math.abs(endY - startY) + 20,
        overflow: "visible",
      }}
    >
      <motion.line
        x1={startX < endX ? 10 : Math.abs(endX - startX) + 10}
        y1={startY < endY ? 10 : Math.abs(endY - startY) + 10}
        x2={startX < endX ? Math.abs(endX - startX) + 10 : 10}
        y2={startY < endY ? Math.abs(endY - startY) + 10 : 10}
        stroke={color}
        strokeWidth="1"
        strokeOpacity={inView ? 0.3 : 0}
        filter={`drop-shadow(0 0 4px ${color})`}
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 1.5, delay, ease: "easeInOut" }}
      />
    </svg>
  );
}

/* ────────── Depth Meter Sidebar ────────── */
function DepthMeter({ scrollProgress }: { scrollProgress: number }) {
  return (
    <div
      className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-1"
      style={{ height: 200 }}
    >
      {/* Track */}
      <div
        className="relative w-px flex-1"
        style={{ background: `linear-gradient(to bottom, ${BIO_CYAN}40, ${BIO_MAGENTA}40)` }}
      >
        {/* Indicator */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
          style={{
            background: BIO_CYAN,
            boxShadow: `0 0 12px ${BIO_CYAN}, 0 0 24px ${BIO_CYAN}80`,
            top: `${Math.min(scrollProgress * 100, 100)}%`,
          }}
        />
      </div>
      {/* Depth labels */}
      {DEPTH_ZONES.map((zone, i) => (
        <div
          key={zone.depth}
          className="absolute text-[8px] tracking-[0.2em] font-[family-name:var(--font-sora)]"
          style={{
            top: `${(i / (DEPTH_ZONES.length - 1)) * 100}%`,
            left: 16,
            color: zone.color,
            opacity: 0.5,
            transform: "translateY(-50%)",
            whiteSpace: "nowrap",
          }}
        >
          {zone.depth}
        </div>
      ))}
    </div>
  );
}

/* ────────── Pulsing Glow Ring ────────── */
function PulseRing({ color = BIO_CYAN, size = 120, delay = 0 }: { color?: string; size?: number; delay?: number }) {
  return (
    <div className="absolute pointer-events-none" style={{ width: size, height: size }}>
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: `1px solid ${color}`,
          opacity: 0.15,
          animation: `pulseGlow 4s ease-in-out ${delay}s infinite`,
        }}
      />
      <div
        className="absolute inset-2 rounded-full"
        style={{
          border: `1px solid ${color}`,
          opacity: 0.1,
          animation: `pulseGlow 4s ease-in-out ${delay + 0.5}s infinite`,
        }}
      />
    </div>
  );
}

/* ═══════════════════ MAIN PAGE ═══════════════════ */

export default function LumenPage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docH > 0 ? window.scrollY / docH : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", onMouse, { passive: true });
    return () => window.removeEventListener("mousemove", onMouse);
  }, []);

  const navLinks = [
    { label: "SPECIMENS", href: "#specimens" },
    { label: "DEPTH ZONES", href: "#depths" },
    { label: "EQUIPMENT", href: "#equipment" },
    { label: "SIGNAL", href: "#signal" },
  ];

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-x-hidden font-[family-name:var(--font-inter)]"
      style={{ background: ABYSS, color: PEARL }}
    >
      {/* ───────── WATER CAUSTIC OVERLAY ───────── */}
      <div
        className="fixed inset-0 pointer-events-none z-[1] opacity-[0.03]"
        style={{
          backgroundImage: `
            repeating-conic-gradient(${BIO_CYAN}20 0% 25%, transparent 0% 50%),
            repeating-conic-gradient(${BIO_CYAN}15 0% 25%, transparent 0% 50%)
          `,
          backgroundSize: "60px 60px, 90px 90px",
          backgroundPosition: "0 0, 30px 30px",
          animation: "causticShift 20s linear infinite",
          mixBlendMode: "screen",
        }}
      />

      {/* ───────── FLOATING BIO-ORBS ───────── */}
      <div className="fixed inset-0 pointer-events-none z-[2]">
        {BIO_ORBS.map((orb, i) => {
          const distX = mousePos.x - (typeof window !== "undefined" ? window.innerWidth * parseFloat(orb.x) / 100 : 0);
          const distY = mousePos.y - (typeof window !== "undefined" ? window.innerHeight * parseFloat(orb.y) / 100 : 0);
          const dist = Math.sqrt(distX * distX + distY * distY);
          const proximity = Math.max(0, 1 - dist / 500);

          return (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: orb.size,
                height: orb.size,
                left: orb.x,
                top: orb.y,
                background: `radial-gradient(circle at 40% 40%, ${orb.color}${Math.round((0.08 + proximity * 0.12) * 255).toString(16).padStart(2, "0")}, ${orb.color}05 50%, transparent 70%)`,
                filter: `blur(${orb.size * 0.3}px)`,
                animation: `bioFloat${i} ${orb.duration}s ease-in-out infinite`,
                animationDelay: `${orb.delay}s`,
                transition: "background 0.3s ease",
              }}
            />
          );
        })}
      </div>

      {/* ───────── BIOLUMINESCENT TRAIL LINES ───────── */}
      <div className="fixed inset-0 pointer-events-none z-[3]">
        <svg className="w-full h-full" preserveAspectRatio="none">
          {/* Horizontal trails */}
          <line
            x1="0" y1="20%" x2="100%" y2="20%"
            stroke={BIO_CYAN}
            strokeWidth="0.5"
            strokeOpacity="0.06"
            strokeDasharray="80 120"
          />
          <line
            x1="0" y1="50%" x2="100%" y2="50%"
            stroke={BIO_MAGENTA}
            strokeWidth="0.5"
            strokeOpacity="0.04"
            strokeDasharray="100 150"
          />
          <line
            x1="0" y1="75%" x2="100%" y2="75%"
            stroke={BIO_CYAN}
            strokeWidth="0.5"
            strokeOpacity="0.05"
            strokeDasharray="60 100"
          />
          {/* Vertical trails */}
          <line
            x1="25%" y1="0" x2="25%" y2="100%"
            stroke={BIO_MAGENTA}
            strokeWidth="0.5"
            strokeOpacity="0.03"
            strokeDasharray="40 80"
          />
          <line
            x1="65%" y1="0" x2="65%" y2="100%"
            stroke={BIO_CYAN}
            strokeWidth="0.5"
            strokeOpacity="0.04"
            strokeDasharray="70 110"
          />
        </svg>
      </div>

      {/* ───────── DEPTH METER ───────── */}
      <DepthMeter scrollProgress={scrollProgress} />

      {/* ───────── FIXED NAV ───────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4"
        style={{
          background: `linear-gradient(to bottom, ${ABYSS}ee, ${ABYSS}00)`,
          backdropFilter: "blur(12px)",
        }}
      >
        <a
          href="#"
          className="text-lg tracking-[0.25em] font-bold font-[family-name:var(--font-sora)]"
          style={{
            color: BIO_CYAN,
            textShadow: `0 0 20px ${BIO_CYAN}60`,
          }}
        >
          GROX
        </a>
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[10px] tracking-[0.3em] font-medium font-[family-name:var(--font-sora)] transition-all duration-300"
              style={{ color: `${PEARL}60` }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = BIO_CYAN;
                (e.currentTarget as HTMLElement).style.textShadow = `0 0 10px ${BIO_CYAN}80`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = `${PEARL}60`;
                (e.currentTarget as HTMLElement).style.textShadow = "none";
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
        {/* Sonar ping indicator */}
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{
              background: BIO_CYAN,
              boxShadow: `0 0 8px ${BIO_CYAN}`,
              animation: "sonarPing 2s ease-in-out infinite",
            }}
          />
          <span
            className="text-[9px] tracking-[0.2em] font-[family-name:var(--font-sora)] hidden sm:inline"
            style={{ color: `${BIO_CYAN}80` }}
          >
            ACTIVE
          </span>
        </div>
      </nav>

      {/* ═══════════ HERO ═══════════ */}
      <header
        className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center"
        style={{ zIndex: 10 }}
      >
        {/* Central bioluminescent glow */}
        <div
          className="absolute"
          style={{
            width: 600,
            height: 600,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, ${BIO_CYAN}08 0%, ${BIO_MAGENTA}04 40%, transparent 70%)`,
            animation: "centralPulse 8s ease-in-out infinite",
          }}
        />

        {/* Concentric sonar rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[200, 350, 500].map((size, i) => (
            <div
              key={size}
              className="absolute rounded-full"
              style={{
                width: size,
                height: size,
                border: `1px solid ${BIO_CYAN}`,
                opacity: 0.04 + i * 0.01,
                animation: `sonarExpand 6s ease-out ${i * 2}s infinite`,
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-4xl"
        >
          {/* Depth classification */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-12" style={{ background: `${BIO_CYAN}40` }} />
            <p
              className="text-[10px] tracking-[0.5em] font-[family-name:var(--font-sora)]"
              style={{ color: `${BIO_CYAN}90` }}
            >
              DEEP SEA RESEARCH STATION
            </p>
            <div className="h-px w-12" style={{ background: `${BIO_CYAN}40` }} />
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08] mb-8 font-[family-name:var(--font-sora)]"
            style={{
              color: PEARL,
              textShadow: `0 0 40px ${BIO_CYAN}40, 0 0 80px ${BIO_CYAN}20, 0 0 120px ${BIO_MAGENTA}10`,
            }}
          >
            I turn AI models
            <br />
            into products
            <br />
            <span
              style={{
                background: `linear-gradient(135deg, ${BIO_CYAN}, ${BIO_MAGENTA})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: `drop-shadow(0 0 30px ${BIO_CYAN}40)`,
              }}
            >
              people use
            </span>
          </h1>

          {/* Stats as sonar readings */}
          <div
            className="inline-flex items-center gap-6 sm:gap-8 px-8 py-4 rounded-full mb-12"
            style={{
              background: `${ABYSS}cc`,
              border: `1px solid ${BIO_CYAN}20`,
              boxShadow: `0 0 30px ${BIO_CYAN}08, inset 0 0 30px ${BIO_CYAN}05`,
            }}
          >
            {stats.map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-2">
                {i > 0 && (
                  <div
                    className="w-px h-6 -ml-3 sm:-ml-4 mr-3 sm:mr-4"
                    style={{ background: `${BIO_CYAN}20` }}
                  />
                )}
                <div className="text-center">
                  <motion.p
                    className="text-xl sm:text-2xl font-bold font-[family-name:var(--font-sora)]"
                    style={{
                      color: BIO_CYAN,
                      textShadow: `0 0 15px ${BIO_CYAN}60`,
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.2, duration: 0.6 }}
                  >
                    {stat.value}
                  </motion.p>
                  <p
                    className="text-[9px] tracking-[0.2em] font-[family-name:var(--font-sora)]"
                    style={{ color: `${PEARL}50` }}
                  >
                    {stat.label.toUpperCase()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Descent prompt */}
          <motion.p
            className="text-[10px] tracking-[0.4em] font-[family-name:var(--font-sora)]"
            style={{ color: `${PEARL}30` }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            DESCEND INTO THE DEEP
          </motion.p>
        </motion.div>

        {/* Scroll indicator -- bioluminescent jellyfish-like pulse */}
        <motion.div
          className="absolute bottom-12"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="relative">
            <div
              className="w-6 h-10 rounded-full"
              style={{
                border: `1.5px solid ${BIO_CYAN}40`,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                paddingTop: 8,
              }}
            >
              <motion.div
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: BIO_CYAN,
                  boxShadow: `0 0 8px ${BIO_CYAN}`,
                }}
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>
        </motion.div>
      </header>

      {/* ═══════════ PROJECTS / SPECIMENS ═══════════ */}
      <DepthReveal
        id="specimens"
        className="relative px-6 md:px-12 lg:px-20 py-28"
      >
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Section header */}
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: BIO_CYAN,
                boxShadow: `0 0 8px ${BIO_CYAN}`,
              }}
            />
            <div className="h-px flex-1 max-w-[80px]" style={{ background: `${BIO_CYAN}30` }} />
            <p
              className="text-[10px] tracking-[0.4em] font-[family-name:var(--font-sora)]"
              style={{ color: `${BIO_CYAN}80` }}
            >
              SPECIMEN CATALOG
            </p>
          </div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 font-[family-name:var(--font-sora)]"
            style={{
              color: PEARL,
              textShadow: `0 0 30px ${BIO_CYAN}20`,
            }}
          >
            Collected Specimens
          </h2>
          <p
            className="text-sm mb-16 max-w-xl"
            style={{ color: `${PEARL}50` }}
          >
            Each project cataloged by phylum, classified and preserved for deep-sea research documentation.
          </p>

          {/* Project grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <motion.a
                key={project.title}
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 50, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.07,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative rounded-xl overflow-hidden cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${ABYSS}f0, #041225f0)`,
                  border: `1px solid ${BIO_CYAN}12`,
                  transition: "all 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
                whileHover={{
                  boxShadow: `0 0 30px ${BIO_CYAN}20, 0 0 60px ${BIO_CYAN}08, inset 0 0 40px ${BIO_CYAN}05`,
                  borderColor: `${BIO_CYAN}40`,
                }}
              >
                {/* Specimen number */}
                <div
                  className="absolute top-0 right-0 z-20 px-3 py-1.5 rounded-bl-lg"
                  style={{
                    background: `${ABYSS}cc`,
                    borderBottom: `1px solid ${BIO_CYAN}15`,
                    borderLeft: `1px solid ${BIO_CYAN}15`,
                  }}
                >
                  <span
                    className="text-[9px] tracking-[0.2em] font-mono"
                    style={{ color: `${BIO_CYAN}70` }}
                  >
                    SP-{String(i + 1).padStart(3, "0")}
                  </span>
                </div>

                {/* Project Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title.replace("\n", " ")}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    style={{
                      filter: "brightness(0.4) saturate(0.5) hue-rotate(160deg)",
                      transition: "filter 0.5s ease, transform 0.7s ease",
                    }}
                  />
                  {/* Bioluminescent overlay */}
                  <div
                    className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-100 opacity-0"
                    style={{
                      background: `radial-gradient(circle at 50% 80%, ${BIO_CYAN}15, transparent 60%)`,
                    }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to bottom, ${ABYSS}10, ${ABYSS}d0)`,
                    }}
                  />
                  {/* Classification badge */}
                  <div className="absolute bottom-3 left-3 z-10">
                    <span
                      className="text-[8px] tracking-[0.25em] px-2 py-1 rounded font-[family-name:var(--font-sora)] uppercase"
                      style={{
                        background: `${ABYSS}b0`,
                        color: BIO_MAGENTA,
                        border: `1px solid ${BIO_MAGENTA}25`,
                        textShadow: `0 0 8px ${BIO_MAGENTA}40`,
                      }}
                    >
                      {SPECIMEN_CLASSES[project.client] || "PHYLUM: UNKNOWN"}
                    </span>
                  </div>
                </div>

                {/* Glowing top edge on hover */}
                <div
                  className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(to right, transparent, ${BIO_CYAN}60, transparent)`,
                    boxShadow: `0 0 10px ${BIO_CYAN}40`,
                  }}
                />

                {/* Card body */}
                <div className="p-5 relative">
                  {/* Client + Year */}
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-[9px] tracking-[0.15em] font-[family-name:var(--font-sora)]"
                      style={{ color: `${PEARL}35` }}
                    >
                      {project.client} / {project.year}
                    </span>
                  </div>

                  <h3
                    className="text-base font-semibold mb-2 font-[family-name:var(--font-sora)] leading-tight"
                    style={{ color: PEARL }}
                  >
                    {project.title.replace("\n", " ")}
                  </h3>

                  <p
                    className="text-xs leading-relaxed mb-4"
                    style={{ color: `${PEARL}50` }}
                  >
                    {project.description}
                  </p>

                  {/* Technical note */}
                  <p
                    className="text-[10px] leading-relaxed mb-4 italic"
                    style={{ color: `${BIO_CYAN}40` }}
                  >
                    {project.technical.length > 100
                      ? project.technical.slice(0, 100) + "..."
                      : project.technical}
                  </p>

                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="text-[9px] tracking-wider px-2 py-0.5 rounded-full font-[family-name:var(--font-sora)]"
                        style={{
                          background: `${BIO_CYAN}08`,
                          border: `1px solid ${BIO_CYAN}18`,
                          color: `${BIO_CYAN}90`,
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Bottom glow line */}
                  <div
                    className="absolute bottom-0 left-4 right-4 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{
                      background: `linear-gradient(to right, transparent, ${BIO_MAGENTA}30, transparent)`,
                    }}
                  />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </DepthReveal>

      {/* ═══════════ EXPERTISE / DEPTH ZONES ═══════════ */}
      <DepthReveal
        id="depths"
        className="relative px-6 md:px-12 lg:px-20 py-28"
      >
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Section header */}
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: BIO_MAGENTA,
                boxShadow: `0 0 8px ${BIO_MAGENTA}`,
              }}
            />
            <div className="h-px flex-1 max-w-[80px]" style={{ background: `${BIO_MAGENTA}30` }} />
            <p
              className="text-[10px] tracking-[0.4em] font-[family-name:var(--font-sora)]"
              style={{ color: `${BIO_MAGENTA}80` }}
            >
              DEPTH CLASSIFICATION
            </p>
          </div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 font-[family-name:var(--font-sora)]"
            style={{
              color: PEARL,
              textShadow: `0 0 30px ${BIO_MAGENTA}20`,
            }}
          >
            Depth Zones
          </h2>
          <p
            className="text-sm mb-16 max-w-xl"
            style={{ color: `${PEARL}50` }}
          >
            Core expertise mapped to oceanic depth layers. The deeper you go, the more specialized the organisms.
          </p>

          {/* Depth Zone Cards */}
          <div className="space-y-6">
            {expertise.map((item, i) => {
              const zone = DEPTH_ZONES[i] || DEPTH_ZONES[DEPTH_ZONES.length - 1];
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40, y: 20 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="relative rounded-xl overflow-hidden group"
                  style={{
                    background: `linear-gradient(135deg, ${ABYSS}e0, #0a1628e0)`,
                    border: `1px solid ${zone.color}15`,
                    transition: "all 0.4s ease",
                  }}
                  whileHover={{
                    boxShadow: `0 0 40px ${zone.color}15, inset 0 0 40px ${zone.color}05`,
                  }}
                >
                  {/* Depth indicator bar */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1"
                    style={{
                      background: `linear-gradient(to bottom, ${zone.color}80, ${zone.color}20)`,
                      boxShadow: `0 0 10px ${zone.color}30`,
                    }}
                  />

                  <div className="p-6 sm:p-8 pl-8 sm:pl-10 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8">
                    {/* Zone metadata */}
                    <div className="flex-shrink-0 sm:w-48">
                      <div
                        className="text-[9px] tracking-[0.3em] mb-1 font-[family-name:var(--font-sora)]"
                        style={{ color: `${zone.color}70` }}
                      >
                        ZONE {String(i + 1).padStart(2, "0")}
                      </div>
                      <div
                        className="text-sm tracking-[0.15em] font-bold font-[family-name:var(--font-sora)] mb-1"
                        style={{
                          color: zone.color,
                          textShadow: `0 0 12px ${zone.color}40`,
                        }}
                      >
                        {zone.label}
                      </div>
                      <div
                        className="text-[10px] tracking-[0.1em] font-mono"
                        style={{ color: `${PEARL}30` }}
                      >
                        {zone.depth}
                      </div>
                      {/* Pressure indicator */}
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {Array.from({ length: 4 }, (_, j) => (
                            <div
                              key={j}
                              className="w-1.5 h-3 rounded-sm"
                              style={{
                                background: j <= i ? zone.color : `${zone.color}15`,
                                boxShadow: j <= i ? `0 0 4px ${zone.color}40` : "none",
                              }}
                            />
                          ))}
                        </div>
                        <span
                          className="text-[8px] tracking-[0.1em] font-mono"
                          style={{ color: `${PEARL}25` }}
                        >
                          PRESSURE
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3
                        className="text-xl font-semibold mb-3 font-[family-name:var(--font-sora)]"
                        style={{ color: PEARL }}
                      >
                        {item.title}
                      </h3>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: `${PEARL}55` }}
                      >
                        {item.body}
                      </p>
                    </div>
                  </div>

                  {/* Subtle animated glow on bottom edge */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(to right, transparent, ${zone.color}40, transparent)`,
                    }}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </DepthReveal>

      {/* ═══════════ TOOLS / RESEARCH EQUIPMENT ═══════════ */}
      <DepthReveal
        id="equipment"
        className="relative px-6 md:px-12 lg:px-20 py-28"
      >
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Section header */}
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: BIO_CYAN,
                boxShadow: `0 0 8px ${BIO_CYAN}`,
              }}
            />
            <div className="h-px flex-1 max-w-[80px]" style={{ background: `${BIO_CYAN}30` }} />
            <p
              className="text-[10px] tracking-[0.4em] font-[family-name:var(--font-sora)]"
              style={{ color: `${BIO_CYAN}80` }}
            >
              EQUIPMENT MANIFEST
            </p>
          </div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 font-[family-name:var(--font-sora)]"
            style={{
              color: PEARL,
              textShadow: `0 0 30px ${BIO_CYAN}20`,
            }}
          >
            Research Equipment
          </h2>
          <p
            className="text-sm mb-16 max-w-xl"
            style={{ color: `${PEARL}50` }}
          >
            Instruments and apparatus outfitted for deep-sea AI exploration and specimen collection.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((category, i) => (
              <motion.div
                key={category.label}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative rounded-xl p-6 group overflow-hidden"
                style={{
                  background: `linear-gradient(180deg, ${ABYSS}d0, #061020d0)`,
                  border: `1px solid ${BIO_CYAN}10`,
                  transition: "all 0.4s ease",
                }}
                whileHover={{
                  boxShadow: `0 0 25px ${BIO_CYAN}12, inset 0 0 30px ${BIO_CYAN}04`,
                  borderColor: `${BIO_CYAN}25`,
                }}
              >
                {/* Equipment category header */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      background: `${BIO_CYAN}10`,
                      border: `1px solid ${BIO_CYAN}20`,
                    }}
                  >
                    <span
                      className="text-[10px] font-bold font-[family-name:var(--font-sora)]"
                      style={{
                        color: BIO_CYAN,
                        textShadow: `0 0 6px ${BIO_CYAN}40`,
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div>
                    <h3
                      className="text-xs tracking-[0.25em] font-bold font-[family-name:var(--font-sora)]"
                      style={{ color: BIO_CYAN }}
                    >
                      {category.label.toUpperCase()}
                    </h3>
                    <p
                      className="text-[8px] tracking-[0.15em] font-mono"
                      style={{ color: `${PEARL}25` }}
                    >
                      {category.items.length} INSTRUMENTS
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div className="flex flex-wrap gap-2">
                  {category.items.map((item, j) => (
                    <motion.span
                      key={item}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + j * 0.05 }}
                      className="text-xs px-3 py-1.5 rounded-lg font-[family-name:var(--font-inter)]"
                      style={{
                        background: `${PEARL}05`,
                        border: `1px solid ${PEARL}08`,
                        color: `${PEARL}60`,
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = `${BIO_CYAN}40`;
                        (e.currentTarget as HTMLElement).style.color = BIO_CYAN;
                        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 12px ${BIO_CYAN}15`;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = `${PEARL}08`;
                        (e.currentTarget as HTMLElement).style.color = `${PEARL}60`;
                        (e.currentTarget as HTMLElement).style.boxShadow = "none";
                      }}
                    >
                      {item}
                    </motion.span>
                  ))}
                </div>

                {/* Corner decoration */}
                <div
                  className="absolute -top-px -right-px w-6 h-6"
                  style={{
                    borderRight: `1px solid ${BIO_CYAN}25`,
                    borderTop: `1px solid ${BIO_CYAN}25`,
                    borderTopRightRadius: 11,
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                  }}
                  ref={(el) => {
                    if (el) {
                      const parent = el.closest(".group");
                      parent?.addEventListener("mouseenter", () => (el.style.opacity = "1"));
                      parent?.addEventListener("mouseleave", () => (el.style.opacity = "0"));
                    }
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </DepthReveal>

      {/* ═══════════ CONTACT / SIGNAL ═══════════ */}
      <DepthReveal
        id="signal"
        className="relative px-6 md:px-12 lg:px-20 py-28"
      >
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          {/* Sonar pulse decoration */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="w-[300px] h-[300px] rounded-full"
              style={{
                background: `radial-gradient(circle, ${BIO_CYAN}06, transparent 70%)`,
                animation: "centralPulse 6s ease-in-out infinite",
              }}
            />
          </div>

          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-16" style={{ background: `${BIO_CYAN}30` }} />
            <p
              className="text-[10px] tracking-[0.4em] font-[family-name:var(--font-sora)]"
              style={{ color: `${BIO_CYAN}70` }}
            >
              HYDROPHONE CHANNEL
            </p>
            <div className="h-px w-16" style={{ background: `${BIO_CYAN}30` }} />
          </div>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 font-[family-name:var(--font-sora)]"
            style={{
              color: PEARL,
              textShadow: `0 0 30px ${BIO_CYAN}20`,
            }}
          >
            Send a Signal
          </h2>

          <p
            className="text-base sm:text-lg leading-relaxed mb-12"
            style={{ color: `${PEARL}50` }}
          >
            Ready to build something with AI that people actually use?
            <br />
            Transmit on the hydrophone and let&apos;s explore the deep together.
          </p>

          <motion.a
            href="mailto:hello@grox.studio"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-full text-sm tracking-[0.2em] font-semibold font-[family-name:var(--font-sora)]"
            style={{
              background: `linear-gradient(135deg, ${BIO_CYAN}, ${BIO_MAGENTA})`,
              color: ABYSS,
              boxShadow: `0 0 30px ${BIO_CYAN}30, 0 0 60px ${BIO_MAGENTA}15`,
              transition: "all 0.3s ease",
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: `0 0 50px ${BIO_CYAN}50, 0 0 100px ${BIO_MAGENTA}25`,
            }}
            whileTap={{ scale: 0.98 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12h8M12 8v8" />
            </svg>
            TRANSMIT SIGNAL
          </motion.a>

          {/* Signal wave animation */}
          <div className="mt-12 flex items-center justify-center gap-1">
            {Array.from({ length: 24 }, (_, i) => (
              <motion.div
                key={i}
                className="w-0.5 rounded-full"
                style={{ background: BIO_CYAN }}
                animate={{
                  height: [4, 12 + Math.sin(i * 0.5) * 8, 4],
                  opacity: [0.2, 0.6, 0.2],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.08,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </div>
      </DepthReveal>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer
        className="relative px-6 py-16 text-center"
        style={{ zIndex: 10 }}
      >
        <div
          className="h-px w-full max-w-md mx-auto mb-10"
          style={{
            background: `linear-gradient(to right, transparent, ${BIO_CYAN}20, ${BIO_MAGENTA}15, transparent)`,
          }}
        />

        {/* Research station info */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: BIO_CYAN,
              boxShadow: `0 0 6px ${BIO_CYAN}`,
              animation: "sonarPing 3s ease-in-out infinite",
            }}
          />
          <p
            className="text-[10px] tracking-[0.3em] font-[family-name:var(--font-sora)]"
            style={{ color: `${PEARL}25` }}
          >
            GROX DEEP SEA RESEARCH STATION
          </p>
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: BIO_MAGENTA,
              boxShadow: `0 0 6px ${BIO_MAGENTA}`,
              animation: "sonarPing 3s ease-in-out 1.5s infinite",
            }}
          />
        </div>

        <p
          className="text-[9px] tracking-[0.2em] font-mono mb-2"
          style={{ color: `${PEARL}15` }}
        >
          LAT 36.1699 N / LON 115.1398 W / DEPTH 4,267m
        </p>
        <p
          className="text-[9px] tracking-[0.2em] font-mono"
          style={{ color: `${PEARL}12` }}
        >
          STATION OPERATIONAL SINCE 2024 / ALL SPECIMENS DOCUMENTED
        </p>

        {/* Theme Switcher */}
        <div className="mt-12">
          <ThemeSwitcher current="/lumen" />
        </div>
      </footer>

      {/* ═══════════ GLOBAL ANIMATIONS ═══════════ */}
      <style jsx global>{`
        /* ── Bio-Orb Float Animations ── */
        @keyframes bioFloat0 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          25% { transform: translate(30px, -20px) scale(1.05); }
          50% { transform: translate(-15px, 25px) scale(0.95); }
          75% { transform: translate(20px, 15px) scale(1.02); }
        }
        @keyframes bioFloat1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          25% { transform: translate(-25px, 30px) scale(0.97); }
          50% { transform: translate(20px, -15px) scale(1.04); }
          75% { transform: translate(-10px, -25px) scale(1); }
        }
        @keyframes bioFloat2 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          25% { transform: translate(15px, 25px) scale(1.03); }
          50% { transform: translate(-30px, -10px) scale(0.98); }
          75% { transform: translate(25px, -20px) scale(1.05); }
        }
        @keyframes bioFloat3 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          25% { transform: translate(-20px, -30px) scale(1.02); }
          50% { transform: translate(25px, 20px) scale(0.96); }
          75% { transform: translate(-15px, 10px) scale(1.04); }
        }
        @keyframes bioFloat4 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          25% { transform: translate(20px, 15px) scale(0.98); }
          50% { transform: translate(-10px, -25px) scale(1.06); }
          75% { transform: translate(-25px, 20px) scale(1); }
        }
        @keyframes bioFloat5 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          25% { transform: translate(-15px, -20px) scale(1.04); }
          50% { transform: translate(30px, 15px) scale(0.97); }
          75% { transform: translate(10px, -30px) scale(1.02); }
        }
        @keyframes bioFloat6 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          25% { transform: translate(25px, -15px) scale(1.01); }
          50% { transform: translate(-20px, 30px) scale(1.05); }
          75% { transform: translate(15px, 10px) scale(0.98); }
        }
        @keyframes bioFloat7 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          25% { transform: translate(-30px, 20px) scale(0.99); }
          50% { transform: translate(15px, -25px) scale(1.03); }
          75% { transform: translate(-20px, -15px) scale(1.01); }
        }

        /* ── Caustic Water Pattern ── */
        @keyframes causticShift {
          0% { background-position: 0 0, 30px 30px; }
          100% { background-position: 60px 60px, 90px 90px; }
        }

        /* ── Central Pulse ── */
        @keyframes centralPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.7; }
        }

        /* ── Sonar Expand ── */
        @keyframes sonarExpand {
          0% { transform: scale(0.8); opacity: 0.08; }
          50% { transform: scale(1.2); opacity: 0.02; }
          100% { transform: scale(0.8); opacity: 0.08; }
        }

        /* ── Sonar Ping ── */
        @keyframes sonarPing {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }

        /* ── Pulse Glow ── */
        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); opacity: 0.15; }
          50% { transform: scale(1.1); opacity: 0.05; }
        }

        /* ── Scrollbar Styling ── */
        html {
          scroll-behavior: smooth;
        }
        ::-webkit-scrollbar {
          width: 5px;
        }
        ::-webkit-scrollbar-track {
          background: ${ABYSS};
        }
        ::-webkit-scrollbar-thumb {
          background: ${BIO_CYAN}25;
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: ${BIO_CYAN}50;
        }

        /* ── Selection ── */
        ::selection {
          background: ${BIO_CYAN}30;
          color: ${PEARL};
        }
      `}</style>
    </div>
  );
}
