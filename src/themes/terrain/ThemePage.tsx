"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "@/app/data/projects";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";
import Image from "next/image";
import { getProjectImage } from "@/lib/theme-images";

/* ─── Color palette ─── */
const C = {
  bg: "#F5F2EC",
  sage: "#5B7F5E",
  sageDark: "#4A6B4D",
  sand: "#C2B280",
  charcoal: "#2D2D2D",
  charcoalMuted: "#5A5A5A",
  contourLight: "rgba(91,127,94,0.08)",
  contourMed: "rgba(91,127,94,0.12)",
  contourStrong: "rgba(91,127,94,0.18)",
  sandLight: "rgba(194,178,128,0.25)",
  cardBg: "#FAFAF6",
  cardBorder: "rgba(91,127,94,0.15)",
};

/* ─── Elevation labels for stats ─── */
const elevationLabels = ["ELEV.", "MDL.", "SEC."];

/* ─── SVG Contour Lines (Hero background) ─── */
function ContourLines() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Contour group 1 — center */}
      <motion.path
        d="M600 400 C650 350, 750 340, 780 400 C810 460, 750 520, 680 530 C610 540, 530 500, 520 440 C510 380, 550 350, 600 400Z"
        stroke={C.sage}
        strokeOpacity="0.10"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 3, ease: "easeOut" }}
      />
      <motion.path
        d="M600 400 C670 320, 800 300, 850 400 C900 500, 800 580, 700 590 C600 600, 480 540, 460 430 C440 320, 530 290, 600 400Z"
        stroke={C.sage}
        strokeOpacity="0.08"
        strokeWidth="1.2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 3.5, ease: "easeOut", delay: 0.3 }}
      />
      <motion.path
        d="M600 400 C700 280, 880 260, 940 400 C1000 540, 860 650, 720 660 C580 670, 420 580, 390 420 C360 260, 500 240, 600 400Z"
        stroke={C.sage}
        strokeOpacity="0.06"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 4, ease: "easeOut", delay: 0.6 }}
      />
      <motion.path
        d="M600 400 C740 240, 960 210, 1040 400 C1120 590, 920 720, 740 740 C560 760, 360 620, 320 410 C280 200, 460 180, 600 400Z"
        stroke={C.sage}
        strokeOpacity="0.05"
        strokeWidth="0.8"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 4.5, ease: "easeOut", delay: 0.9 }}
      />

      {/* Contour group 2 — top-left */}
      <motion.path
        d="M200 180 C250 140, 340 150, 360 200 C380 250, 330 290, 270 290 C210 290, 170 250, 170 210 C170 180, 180 160, 200 180Z"
        stroke={C.sage}
        strokeOpacity="0.07"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 3, ease: "easeOut", delay: 1.2 }}
      />
      <motion.path
        d="M200 180 C270 110, 400 120, 430 200 C460 280, 380 350, 290 360 C200 370, 120 300, 110 220 C100 140, 140 120, 200 180Z"
        stroke={C.sage}
        strokeOpacity="0.05"
        strokeWidth="0.8"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 3.5, ease: "easeOut", delay: 1.5 }}
      />

      {/* Contour group 3 — bottom-right */}
      <motion.path
        d="M950 620 C980 590, 1050 600, 1060 640 C1070 680, 1030 710, 980 710 C930 710, 910 670, 920 640 C930 620, 940 610, 950 620Z"
        stroke={C.sage}
        strokeOpacity="0.09"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.5, ease: "easeOut", delay: 1 }}
      />
      <motion.path
        d="M950 620 C1010 560, 1120 570, 1130 640 C1140 710, 1070 770, 990 780 C910 790, 850 730, 850 650 C850 570, 890 550, 950 620Z"
        stroke={C.sage}
        strokeOpacity="0.06"
        strokeWidth="0.8"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 3, ease: "easeOut", delay: 1.3 }}
      />

      {/* Subtle grid lines for map feel */}
      {[200, 400, 600].map((y) => (
        <line
          key={`h-${y}`}
          x1="0" y1={y} x2="1200" y2={y}
          stroke={C.sage}
          strokeOpacity="0.03"
          strokeWidth="0.5"
          strokeDasharray="8 12"
        />
      ))}
      {[300, 600, 900].map((x) => (
        <line
          key={`v-${x}`}
          x1={x} y1="0" x2={x} y2="800"
          stroke={C.sage}
          strokeOpacity="0.03"
          strokeWidth="0.5"
          strokeDasharray="8 12"
        />
      ))}
    </svg>
  );
}

/* ─── Compass Rose SVG ─── */
function CompassRose({ size = 80 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer circle */}
      <circle cx="50" cy="50" r="44" stroke={C.sage} strokeOpacity="0.2" strokeWidth="0.8" />
      <circle cx="50" cy="50" r="38" stroke={C.sage} strokeOpacity="0.12" strokeWidth="0.5" />

      {/* Cross lines */}
      <line x1="50" y1="8" x2="50" y2="92" stroke={C.sage} strokeOpacity="0.15" strokeWidth="0.5" />
      <line x1="8" y1="50" x2="92" y2="50" stroke={C.sage} strokeOpacity="0.15" strokeWidth="0.5" />

      {/* Diagonal lines */}
      <line x1="20" y1="20" x2="80" y2="80" stroke={C.sage} strokeOpacity="0.08" strokeWidth="0.5" />
      <line x1="80" y1="20" x2="20" y2="80" stroke={C.sage} strokeOpacity="0.08" strokeWidth="0.5" />

      {/* North pointer (filled triangle) */}
      <polygon points="50,10 46,26 54,26" fill={C.sage} fillOpacity="0.35" />
      {/* South pointer */}
      <polygon points="50,90 46,74 54,74" fill={C.sage} fillOpacity="0.15" />
      {/* East pointer */}
      <polygon points="90,50 74,46 74,54" fill={C.sage} fillOpacity="0.15" />
      {/* West pointer */}
      <polygon points="10,50 26,46 26,54" fill={C.sage} fillOpacity="0.15" />

      {/* Center dot */}
      <circle cx="50" cy="50" r="2" fill={C.sage} fillOpacity="0.3" />

      {/* Cardinal labels */}
      <text x="50" y="7" textAnchor="middle" fontSize="7" fill={C.sage} fillOpacity="0.4" fontFamily="var(--font-space-grotesk)">N</text>
      <text x="50" y="99" textAnchor="middle" fontSize="7" fill={C.sage} fillOpacity="0.4" fontFamily="var(--font-space-grotesk)">S</text>
      <text x="97" y="52.5" textAnchor="middle" fontSize="7" fill={C.sage} fillOpacity="0.4" fontFamily="var(--font-space-grotesk)">E</text>
      <text x="3" y="52.5" textAnchor="middle" fontSize="7" fill={C.sage} fillOpacity="0.4" fontFamily="var(--font-space-grotesk)">W</text>
    </svg>
  );
}

/* ─── Scroll Reveal wrapper ─── */
function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Section divider ─── */
function TerrainDivider() {
  return (
    <div className="flex items-center gap-4 py-2">
      <div className="flex-1 h-[1px]" style={{ background: `${C.sage}18` }} />
      <span
        className="text-[8px] tracking-[0.4em] uppercase font-[family-name:var(--font-space-grotesk)]"
        style={{ color: `${C.sage}60` }}
      >
        ///
      </span>
      <div className="flex-1 h-[1px]" style={{ background: `${C.sage}18` }} />
    </div>
  );
}

/* ─── Waypoint marker ─── */
function WaypointMarker({ number }: { number: number }) {
  const padded = String(number).padStart(2, "0");
  return (
    <div className="flex items-center gap-2">
      <span
        className="text-sm font-[family-name:var(--font-space-grotesk)]"
        style={{ color: C.sage }}
      >
        ▲
      </span>
      <span
        className="text-[11px] font-bold tracking-[0.15em] font-[family-name:var(--font-space-grotesk)]"
        style={{ color: C.sage }}
      >
        {padded}
      </span>
    </div>
  );
}

/* ─── Project Card ─── */
function ProjectCard({
  project,
  index,
  delay,
}: {
  project: (typeof projects)[number];
  index: number;
  delay: number;
}) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      className="relative pl-8 md:pl-12"
    >
      {/* Vertical trail connector */}
      <div
        className="absolute left-[11px] md:left-[19px] top-0 bottom-0 w-[1px]"
        style={{
          backgroundImage: `repeating-linear-gradient(to bottom, ${C.sage}30 0, ${C.sage}30 6px, transparent 6px, transparent 14px)`,
        }}
      />

      {/* Waypoint dot on trail */}
      <div
        className="absolute left-[7px] md:left-[15px] top-5 w-[9px] h-[9px] rounded-full border-2"
        style={{ borderColor: C.sage, background: C.bg }}
      />

      {/* Card */}
      <motion.div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        animate={{
          scale: hovered ? 1.01 : 1,
          boxShadow: hovered
            ? `0 8px 32px rgba(91,127,94,0.12), 0 2px 8px rgba(91,127,94,0.08)`
            : `0 1px 4px rgba(0,0,0,0.04)`,
        }}
        transition={{ duration: 0.3 }}
        className="rounded-lg overflow-hidden cursor-pointer"
        style={{
          background: C.cardBg,
          border: `1px solid ${C.cardBorder}`,
        }}
      >
        {/* Card header */}
        <div className="p-5 pb-3 md:p-6 md:pb-4">
          <div className="flex items-start justify-between mb-3">
            <WaypointMarker number={index + 1} />
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] tracking-[0.15em] uppercase font-[family-name:var(--font-space-grotesk)]"
                style={{ color: C.sand }}
              >
                {project.client}
              </span>
              <span className="text-[10px]" style={{ color: C.sand }}>
                •
              </span>
              <span
                className="text-[10px] tracking-[0.15em] font-[family-name:var(--font-space-grotesk)]"
                style={{ color: C.sand }}
              >
                {project.year}
              </span>
            </div>
          </div>

          <h3
            className="text-lg md:text-xl font-bold leading-tight mb-2 font-[family-name:var(--font-space-grotesk)]"
            style={{ color: C.charcoal, whiteSpace: "pre-line" }}
          >
            {project.title}
          </h3>

          <p
            className="text-sm leading-relaxed mb-4 font-[family-name:var(--font-manrope)]"
            style={{ color: C.charcoalMuted }}
          >
            {project.description}
          </p>

          {/* Tech tags as map legend items */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {project.tech.map((t) => (
              <div key={t} className="flex items-center gap-1.5">
                <div
                  className="w-[6px] h-[6px] rounded-full"
                  style={{ background: C.sage, opacity: 0.5 }}
                />
                <span
                  className="text-[11px] tracking-wide font-[family-name:var(--font-manrope)]"
                  style={{ color: C.charcoalMuted }}
                >
                  {t}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Card image */}
        <div className="relative w-full aspect-[16/9] overflow-hidden">
          <div
            className="absolute inset-0 z-10"
            style={{
              background: `linear-gradient(to bottom, ${C.cardBg} 0%, transparent 20%)`,
            }}
          />
          <Image
            src={getProjectImage("terrain", project.image)}
            alt={project.title.replace("\n", " ")}
            fill
            className="object-cover"
            style={{
              filter: "saturate(0.7) sepia(0.12) brightness(0.97)",
            }}
          />
          <div
            className="absolute inset-0 z-10"
            style={{
              background: `linear-gradient(135deg, rgba(91,127,94,0.06) 0%, transparent 60%)`,
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════ */
/*  Main Page                                        */
/* ═══════════════════════════════════════════════════ */

export default function TerrainPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="relative min-h-screen"
      style={{ background: C.bg, color: C.charcoal }}
    >
      {/* ────────────── Fixed Navigation ────────────── */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-14"
        style={{
          background: scrolled ? `${C.bg}F2` : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? `1px solid ${C.sage}15` : "1px solid transparent",
          transition: "background 0.3s, border-bottom 0.3s, backdrop-filter 0.3s",
        }}
      >
        {/* Left: coordinate label */}
        <div
          className="text-[10px] tracking-[0.25em] uppercase font-[family-name:var(--font-space-grotesk)]"
          style={{ color: C.sage }}
        >
          47.3°N 8.5°E
        </div>

        {/* Center: nav links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "PROJECTS", href: "#projects" },
            { label: "EXPERTISE", href: "#expertise" },
            { label: "TOOLS", href: "#tools" },
            { label: "CONTACT", href: "#contact" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[10px] tracking-[0.2em] uppercase font-[family-name:var(--font-space-grotesk)] hover:opacity-100 transition-opacity"
              style={{ color: C.sage, opacity: 0.65 }}
            >
              <span style={{ color: C.sage, marginRight: "4px" }}>▲</span>
              {link.label}
            </a>
          ))}
        </div>

        {/* Right: survey label */}
        <div
          className="text-[10px] tracking-[0.15em] uppercase font-[family-name:var(--font-space-grotesk)]"
          style={{ color: C.sand }}
        >
          GROX SURVEY
        </div>
      </motion.nav>

      {/* ────────────── Hero Section ────────────── */}
      <section className="relative min-h-screen flex flex-col justify-center items-center px-6 overflow-hidden">
        {/* Contour background */}
        <ContourLines />

        {/* Compass rose — top-right */}
        <div className="absolute top-20 right-8 md:top-24 md:right-16 opacity-60">
          <CompassRose size={72} />
        </div>

        {/* Grid reference marks — corners */}
        <div
          className="absolute top-20 left-6 text-[8px] tracking-[0.3em] uppercase font-[family-name:var(--font-space-grotesk)]"
          style={{ color: `${C.sage}40` }}
        >
          NW-01
        </div>
        <div
          className="absolute bottom-8 right-6 text-[8px] tracking-[0.3em] uppercase font-[family-name:var(--font-space-grotesk)]"
          style={{ color: `${C.sage}40` }}
        >
          SE-04
        </div>

        {/* Hero content */}
        <motion.div
          className="relative z-10 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Topographic label */}
          <div
            className="text-[10px] tracking-[0.4em] uppercase mb-6 font-[family-name:var(--font-space-grotesk)]"
            style={{ color: C.sage }}
          >
            TOPOGRAPHIC SURVEY — AI PRODUCTS
          </div>

          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-8 font-[family-name:var(--font-space-grotesk)]"
            style={{ color: C.charcoal }}
          >
            I turn AI models into{" "}
            <span style={{ color: C.sage }}>products</span> people use
          </h1>

          <p
            className="text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-12 font-[family-name:var(--font-manrope)]"
            style={{ color: C.charcoalMuted }}
          >
            Full-stack AI engineer. Mapping the terrain from model to deployment
            — orchestrating multi-model systems, real-time pipelines, and
            production infrastructure.
          </p>

          {/* Elevation data stats */}
          <div className="flex justify-center gap-10 md:gap-16">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                className="text-center"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.8 + i * 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div
                  className="text-[9px] tracking-[0.3em] uppercase mb-1.5 font-[family-name:var(--font-space-grotesk)]"
                  style={{ color: C.sand }}
                >
                  {elevationLabels[i]} {s.value}
                </div>
                <div
                  className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-space-grotesk)]"
                  style={{ color: C.charcoal }}
                >
                  {s.value}
                </div>
                <div
                  className="text-[10px] tracking-[0.2em] uppercase mt-1 font-[family-name:var(--font-space-grotesk)]"
                  style={{ color: C.charcoalMuted }}
                >
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <span
            className="text-[8px] tracking-[0.3em] uppercase font-[family-name:var(--font-space-grotesk)]"
            style={{ color: `${C.sage}60` }}
          >
            DESCEND
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
              <path
                d="M8 2 L8 16 M3 12 L8 17 L13 12"
                stroke={C.sage}
                strokeOpacity="0.4"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* ────────────── Projects / Waypoints Section ────────────── */}
      <section id="projects" className="relative px-6 md:px-10 py-24 md:py-32 max-w-4xl mx-auto">
        <Reveal>
          <div className="mb-4">
            <div
              className="text-[9px] tracking-[0.3em] uppercase mb-2 font-[family-name:var(--font-space-grotesk)]"
              style={{ color: C.sand }}
            >
              SECTOR 47.3°N — FIELD SURVEY
            </div>
            <h2
              className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-space-grotesk)]"
              style={{ color: C.charcoal }}
            >
              WAYPOINTS
            </h2>
          </div>
          <TerrainDivider />
        </Reveal>

        <div className="mt-12 space-y-8">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} delay={i * 0.05} />
          ))}

          {/* Trail end marker */}
          <div className="relative pl-8 md:pl-12">
            <div
              className="absolute left-[7px] md:left-[15px] top-0 w-[9px] h-[9px] rounded-full"
              style={{ background: C.sage, opacity: 0.3 }}
            />
            <div
              className="text-[9px] tracking-[0.3em] uppercase pt-1 font-[family-name:var(--font-space-grotesk)]"
              style={{ color: `${C.sage}80` }}
            >
              END OF SURVEY — {projects.length} WAYPOINTS MAPPED
            </div>
          </div>
        </div>
      </section>

      {/* ────────────── Expertise / Elevation Zones ────────────── */}
      <section
        id="expertise"
        className="relative px-6 md:px-10 py-24 md:py-32 max-w-4xl mx-auto"
      >
        <Reveal>
          <div className="mb-4">
            <div
              className="text-[9px] tracking-[0.3em] uppercase mb-2 font-[family-name:var(--font-space-grotesk)]"
              style={{ color: C.sand }}
            >
              ALTITUDE CLASSIFICATION
            </div>
            <h2
              className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-space-grotesk)]"
              style={{ color: C.charcoal }}
            >
              ELEVATION ZONES
            </h2>
          </div>
          <TerrainDivider />
        </Reveal>

        <div className="mt-12 space-y-5">
          {expertise.map((item, i) => {
            const elevation = (i + 1) * 1200;
            return (
              <Reveal key={item.title} delay={i * 0.08}>
                <div
                  className="relative rounded-lg p-5 md:p-6 overflow-hidden"
                  style={{
                    background: C.cardBg,
                    borderLeft: `3px solid ${C.sage}`,
                    border: `1px solid ${C.cardBorder}`,
                    borderLeftWidth: "3px",
                    borderLeftColor: C.sage,
                  }}
                >
                  {/* Elevation badge */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div
                        className="text-[9px] tracking-[0.25em] uppercase mb-1 font-[family-name:var(--font-space-grotesk)]"
                        style={{ color: C.sand }}
                      >
                        ZONE {String(i + 1).padStart(2, "0")} — {elevation}m
                      </div>
                      <h3
                        className="text-lg font-bold font-[family-name:var(--font-space-grotesk)]"
                        style={{ color: C.charcoal }}
                      >
                        {item.title}
                      </h3>
                    </div>
                    {/* Mini contour badge */}
                    <svg
                      width="36"
                      height="36"
                      viewBox="0 0 40 40"
                      fill="none"
                      style={{ opacity: 0.2, flexShrink: 0 }}
                    >
                      <ellipse cx="20" cy="20" rx={10 + i * 3} ry={8 + i * 2} stroke={C.sage} strokeWidth="1" />
                      <ellipse cx="20" cy="20" rx={6 + i * 2} ry={5 + i * 1} stroke={C.sage} strokeWidth="0.8" />
                      <ellipse cx="20" cy="20" rx={3 + i} ry={2.5 + i * 0.5} stroke={C.sage} strokeWidth="0.6" />
                    </svg>
                  </div>

                  <p
                    className="text-sm leading-relaxed font-[family-name:var(--font-manrope)]"
                    style={{ color: C.charcoalMuted }}
                  >
                    {item.body}
                  </p>

                  {/* Faint contour decoration in background */}
                  <div
                    className="absolute -right-4 -bottom-4 w-32 h-32 rounded-full"
                    style={{
                      border: `1px solid ${C.sage}08`,
                    }}
                  />
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ────────────── Tools / Map Legend ────────────── */}
      <section
        id="tools"
        className="relative px-6 md:px-10 py-24 md:py-32 max-w-4xl mx-auto"
      >
        <Reveal>
          <div className="mb-4">
            <div
              className="text-[9px] tracking-[0.3em] uppercase mb-2 font-[family-name:var(--font-space-grotesk)]"
              style={{ color: C.sand }}
            >
              CARTOGRAPHIC INDEX
            </div>
            <h2
              className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-space-grotesk)]"
              style={{ color: C.charcoal }}
            >
              MAP LEGEND
            </h2>
          </div>
          <TerrainDivider />
        </Reveal>

        <div className="mt-12">
          <div
            className="rounded-lg overflow-hidden"
            style={{
              background: C.cardBg,
              border: `1px solid ${C.cardBorder}`,
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map((category, i) => (
                <Reveal
                  key={category.label}
                  delay={i * 0.06}
                  className="p-5 md:p-6"
                >
                  <div
                    style={{
                      borderBottom:
                        i < tools.length - 1
                          ? `1px solid ${C.cardBorder}`
                          : "none",
                    }}
                    className="sm:border-b-0"
                  >
                    {/* Category header */}
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="w-3 h-3 rounded-sm"
                        style={{
                          background: C.sage,
                          opacity: 0.2 + i * 0.1,
                        }}
                      />
                      <span
                        className="text-[10px] tracking-[0.2em] uppercase font-bold font-[family-name:var(--font-space-grotesk)]"
                        style={{ color: C.sage }}
                      >
                        {category.label}
                      </span>
                    </div>

                    {/* Items */}
                    <div className="space-y-1.5">
                      {category.items.map((item) => (
                        <div key={item} className="flex items-center gap-2">
                          <div
                            className="w-[5px] h-[5px] rounded-full"
                            style={{ background: C.sand, opacity: 0.6 }}
                          />
                          <span
                            className="text-[12px] font-[family-name:var(--font-manrope)]"
                            style={{ color: C.charcoalMuted }}
                          >
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Legend footer */}
            <div
              className="px-5 md:px-6 py-3 flex items-center justify-between"
              style={{
                borderTop: `1px solid ${C.cardBorder}`,
                background: `${C.sage}05`,
              }}
            >
              <span
                className="text-[8px] tracking-[0.3em] uppercase font-[family-name:var(--font-space-grotesk)]"
                style={{ color: `${C.sage}80` }}
              >
                {tools.reduce((acc, t) => acc + t.items.length, 0)} TOOLS CATALOGUED
              </span>
              <span
                className="text-[8px] tracking-[0.3em] uppercase font-[family-name:var(--font-space-grotesk)]"
                style={{ color: `${C.sage}60` }}
              >
                REV. 2025
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────── Contact ────────────── */}
      <section
        id="contact"
        className="relative px-6 md:px-10 py-24 md:py-32 max-w-4xl mx-auto text-center"
      >
        <Reveal>
          <div
            className="text-[9px] tracking-[0.3em] uppercase mb-2 font-[family-name:var(--font-space-grotesk)]"
            style={{ color: C.sand }}
          >
            TRANSMISSION POINT
          </div>
          <h2
            className="text-2xl md:text-3xl font-bold mb-4 font-[family-name:var(--font-space-grotesk)]"
            style={{ color: C.charcoal }}
          >
            ESTABLISH CONTACT
          </h2>
          <TerrainDivider />
        </Reveal>

        <Reveal delay={0.1}>
          <p
            className="text-base leading-relaxed max-w-lg mx-auto mt-8 mb-8 font-[family-name:var(--font-manrope)]"
            style={{ color: C.charcoalMuted }}
          >
            Charting new territory in AI product development. If you have a project
            that needs to go from model to production, let&apos;s map the route together.
          </p>

          <a
            href="mailto:hello@grox.dev"
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-lg text-sm font-semibold tracking-wide uppercase transition-all duration-300 font-[family-name:var(--font-space-grotesk)]"
            style={{
              background: C.sage,
              color: "#FFFFFF",
              boxShadow: `0 2px 12px rgba(91,127,94,0.25)`,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 4px 20px rgba(91,127,94,0.35)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 2px 12px rgba(91,127,94,0.25)";
            }}
          >
            <span style={{ fontSize: "12px" }}>▲</span>
            Send Coordinates
          </a>
        </Reveal>
      </section>

      {/* ────────────── Footer ────────────── */}
      <footer
        className="relative px-6 md:px-10 py-12"
        style={{ borderTop: `1px solid ${C.sage}15` }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left — compass + coordinates */}
            <div className="flex items-center gap-4">
              <CompassRose size={32} />
              <span
                className="text-[10px] tracking-[0.2em] uppercase font-[family-name:var(--font-space-grotesk)]"
                style={{ color: C.charcoalMuted }}
              >
                47.3°N 8.5°E • GROX SURVEY EXPEDITION • 2025
              </span>
            </div>

            {/* Right — map reference */}
            <div
              className="text-[9px] tracking-[0.2em] uppercase font-[family-name:var(--font-space-grotesk)]"
              style={{ color: `${C.sage}60` }}
            >
              DATUM: WGS-84 • CONTOUR INTERVAL: 200m • SHEET 01 OF 01
            </div>
          </div>

          {/* Bottom divider line with elevation marks */}
          <div className="mt-8 mb-6">
            <div className="relative h-[1px]" style={{ background: `${C.sage}12` }}>
              {[0, 25, 50, 75, 100].map((pct) => (
                <div
                  key={pct}
                  className="absolute top-0 w-[1px] h-2 -translate-y-1/2"
                  style={{
                    left: `${pct}%`,
                    background: `${C.sage}25`,
                  }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-1">
              <span
                className="text-[7px] tracking-[0.2em] font-[family-name:var(--font-space-grotesk)]"
                style={{ color: `${C.sage}40` }}
              >
                0m
              </span>
              <span
                className="text-[7px] tracking-[0.2em] font-[family-name:var(--font-space-grotesk)]"
                style={{ color: `${C.sage}40` }}
              >
                4800m
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* ────────────── Theme Switcher ────────────── */}
      <ThemeSwitcher current="/terrain" variant="light" />
    </div>
  );
}