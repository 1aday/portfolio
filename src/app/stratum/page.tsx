"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { getProjectImage } from "@/lib/theme-images";

/* ================================================================
   STRATUM — Geological Cross-Section Portfolio Theme
   A vertical journey through Earth's crust. Each section is a
   distinct rock layer. Projects are fossils embedded in stone.
   ================================================================ */

/* ─── Color Palette ─── */
const COLORS = {
  sky: "#87CEEB",
  skyDeep: "#5BA4CF",
  topsoil: "#5C4033",
  sandstone: "#E8DFD1",
  limestone: "#C9C2B6",
  slate: "#4A5568",
  redClay: "#B44D3F",
  obsidian: "#1A1A2E",
  amber: "#D4A03C",
  crystal: "#7C3AED",
  textLight: "#F5F0E6",
  textDark: "#2D2A26",
  bone: "#FAF6F0",
};

/* ─── Strata layer definitions ─── */
const STRATA = [
  { id: "sky", color: COLORS.sky, label: "Atmosphere", depth: "0m" },
  { id: "topsoil", color: COLORS.topsoil, label: "Topsoil", depth: "-12m" },
  { id: "sandstone", color: COLORS.sandstone, label: "Sandstone", depth: "-85m" },
  { id: "limestone", color: COLORS.limestone, label: "Limestone", depth: "-240m" },
  { id: "slate", color: COLORS.slate, label: "Slate", depth: "-580m" },
  { id: "redclay", color: COLORS.redClay, label: "Red Clay", depth: "-920m" },
  { id: "deep-sand", color: "#D6CCB8", label: "Deep Sandstone", depth: "-1,340m" },
  { id: "dark-slate", color: "#3D4555", label: "Dark Slate", depth: "-1,780m" },
  { id: "obsidian", color: COLORS.obsidian, label: "Obsidian", depth: "-2,400m" },
  { id: "core", color: "#0F0F1E", label: "Inner Core", depth: "-2,847m" },
];

/* ─── Geological era labels mapped to project domains ─── */
const GEO_ERAS = [
  { era: "Holocene", mapped: "AI & Vision", range: "Present" },
  { era: "Pleistocene", mapped: "Media Production", range: "2.6 Ma" },
  { era: "Pliocene", mapped: "Intelligence", range: "5.3 Ma" },
  { era: "Miocene", mapped: "Developer Tools", range: "23 Ma" },
  { era: "Oligocene", mapped: "Enterprise", range: "34 Ma" },
  { era: "Eocene", mapped: "Design & Real Estate", range: "56 Ma" },
  { era: "Paleocene", mapped: "Publishing", range: "66 Ma" },
  { era: "Cretaceous", mapped: "Finance", range: "145 Ma" },
  { era: "Jurassic", mapped: "Analytics", range: "201 Ma" },
  { era: "Triassic", mapped: "Creative", range: "252 Ma" },
];

/* ================================================================
   SVG GENERATORS — Wavy boundaries, crystals, seismic lines
   ================================================================ */

function WavyBoundary({
  color,
  nextColor,
  variant = 0,
  flip = false,
}: {
  color: string;
  nextColor: string;
  variant?: number;
  flip?: boolean;
}) {
  const paths = [
    "M0,40 C160,80 320,10 480,50 C640,90 800,20 960,60 C1120,100 1280,30 1440,70 L1440,120 L0,120 Z",
    "M0,50 C120,20 240,80 360,40 C480,0 600,70 720,30 C840,-10 960,60 1080,25 C1200,-5 1320,55 1440,35 L1440,120 L0,120 Z",
    "M0,30 C200,70 350,15 500,55 C650,95 780,25 920,65 C1060,105 1200,20 1440,50 L1440,120 L0,120 Z",
    "M0,60 C100,30 250,85 400,45 C550,5 700,75 850,35 C1000,-5 1150,65 1300,30 C1370,15 1440,40 1440,40 L1440,120 L0,120 Z",
    "M0,45 C180,90 300,10 450,55 C600,100 750,15 900,60 C1050,105 1200,10 1440,55 L1440,120 L0,120 Z",
  ];

  const pathIndex = variant % paths.length;

  return (
    <div
      className="relative w-full"
      style={{ marginTop: "-1px", height: "80px" }}
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
        style={{ transform: flip ? "scaleY(-1)" : undefined }}
      >
        <path d={paths[pathIndex]} fill={nextColor} />
      </svg>
    </div>
  );
}

function CrystalShape({
  x,
  y,
  size = 30,
  color = COLORS.amber,
  rotation = 0,
}: {
  x: number;
  y: number;
  size?: number;
  color?: string;
  rotation?: number;
}) {
  const half = size / 2;
  const points = `${x},${y - size} ${x + half},${y - half / 2} ${x + half / 3},${y + half} ${x - half / 3},${y + half} ${x - half},${y - half / 2}`;

  return (
    <motion.polygon
      points={points}
      fill={color}
      fillOpacity={0.6}
      stroke={color}
      strokeWidth={0.5}
      strokeOpacity={0.8}
      style={{ transformOrigin: `${x}px ${y}px` }}
      initial={{ opacity: 0, scale: 0.5, rotate: rotation }}
      whileInView={{ opacity: 1, scale: 1, rotate: rotation }}
      whileHover={{ opacity: 1, scale: 1.15, fillOpacity: 0.9 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    />
  );
}

function CrystalCluster({ side = "left" }: { side?: "left" | "right" }) {
  const baseX = side === "left" ? 60 : 340;
  return (
    <svg
      width="400"
      height="120"
      viewBox="0 0 400 120"
      className="pointer-events-auto"
      style={{ overflow: "visible" }}
    >
      <CrystalShape x={baseX} y={50} size={28} color={COLORS.amber} rotation={-15} />
      <CrystalShape x={baseX + 25} y={65} size={22} color={COLORS.crystal} rotation={10} />
      <CrystalShape x={baseX - 20} y={70} size={18} color={COLORS.amber} rotation={-5} />
      <CrystalShape x={baseX + 10} y={40} size={14} color={COLORS.crystal} rotation={20} />
    </svg>
  );
}

function SeismicDivider({ color = COLORS.textDark }: { color?: string }) {
  const pathRef = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (pathRef.current && isInView) {
      const length = pathRef.current.getTotalLength();
      pathRef.current.style.strokeDasharray = `${length}`;
      pathRef.current.style.strokeDashoffset = `${length}`;
      pathRef.current.animate(
        [{ strokeDashoffset: `${length}` }, { strokeDashoffset: "0" }],
        { duration: 2000, fill: "forwards", easing: "ease-out" }
      );
    }
  }, [isInView]);

  return (
    <div ref={containerRef} className="w-full py-6 flex justify-center">
      <svg width="100%" height="40" viewBox="0 0 1100 40" preserveAspectRatio="xMidYMid meet">
        <path
          ref={pathRef}
          d="M0,20 L200,20 L220,5 L230,35 L240,8 L250,32 L260,12 L270,28 L280,15 L290,25 L300,18 L320,20 L500,20 L520,10 L525,30 L530,8 L535,33 L540,12 L545,28 L550,20 L700,20 L720,6 L728,34 L736,10 L744,30 L752,15 L760,25 L768,20 L1100,20"
          stroke={color}
          strokeWidth={1.5}
          fill="none"
          strokeOpacity={0.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/* ─── Rock Texture Pattern (SVG noise) ─── */
function RockTexture({ opacity = 0.04 }: { opacity?: number }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity }}>
      <filter id="rockNoise">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.65"
          numOctaves="4"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#rockNoise)" />
    </svg>
  );
}

/* ================================================================
   CORE SAMPLE SIDEBAR — mini strata strip with scroll indicator
   ================================================================ */

function CoreSampleSidebar({ scrollProgress }: { scrollProgress: number }) {
  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center gap-0">
      {/* Label */}
      <div
        className="text-[9px] tracking-[0.2em] uppercase mb-2 font-[family-name:var(--font-jetbrains)]"
        style={{ color: COLORS.textDark, opacity: 0.5 }}
      >
        Core
      </div>

      {/* Core sample strip */}
      <div className="relative w-3 rounded-full overflow-hidden" style={{ height: "240px" }}>
        {STRATA.map((stratum, i) => (
          <div
            key={stratum.id}
            style={{
              backgroundColor: stratum.color,
              height: `${100 / STRATA.length}%`,
            }}
          />
        ))}

        {/* Scroll indicator */}
        <motion.div
          className="absolute left-0 w-full rounded-full"
          style={{
            height: "16px",
            top: `${Math.min(scrollProgress * 100, 95)}%`,
            background: COLORS.amber,
            boxShadow: `0 0 8px ${COLORS.amber}80`,
            border: `1px solid ${COLORS.amber}`,
          }}
          animate={{ top: `${Math.min(scrollProgress * 100, 95)}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />
      </div>

      {/* Depth label */}
      <div
        className="text-[9px] mt-2 font-[family-name:var(--font-jetbrains)] tabular-nums"
        style={{ color: COLORS.textDark, opacity: 0.5 }}
      >
        {Math.round(scrollProgress * 2847)}m
      </div>
    </div>
  );
}

/* ================================================================
   MINERAL LEGEND — map key for rock types
   ================================================================ */

function MineralLegend() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const minerals = [
    { name: "Topsoil", color: COLORS.topsoil },
    { name: "Sandstone", color: COLORS.sandstone },
    { name: "Limestone", color: COLORS.limestone },
    { name: "Slate", color: COLORS.slate },
    { name: "Red Clay", color: COLORS.redClay },
    { name: "Obsidian", color: COLORS.obsidian },
    { name: "Amber", color: COLORS.amber },
    { name: "Crystal", color: COLORS.crystal },
  ];

  return (
    <motion.div
      ref={ref}
      className="inline-flex flex-wrap gap-x-6 gap-y-2 px-6 py-4 rounded-lg"
      style={{
        backgroundColor: `${COLORS.bone}CC`,
        border: `1px solid ${COLORS.limestone}`,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <span
        className="w-full text-[10px] tracking-[0.25em] uppercase font-[family-name:var(--font-jetbrains)] mb-1"
        style={{ color: COLORS.textDark, opacity: 0.5 }}
      >
        Geological Legend
      </span>
      {minerals.map((m) => (
        <div key={m.name} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-sm"
            style={{
              backgroundColor: m.color,
              border: `1px solid ${m.color === COLORS.sandstone || m.color === COLORS.limestone ? COLORS.textDark + "20" : "transparent"}`,
            }}
          />
          <span
            className="text-[11px] font-[family-name:var(--font-inter)]"
            style={{ color: COLORS.textDark }}
          >
            {m.name}
          </span>
        </div>
      ))}
    </motion.div>
  );
}

/* ================================================================
   GEOLOGICAL TIMELINE — vertical era labels
   ================================================================ */

function GeologicalTimeline({ eras }: { eras: typeof GEO_ERAS }) {
  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden xl:flex flex-col items-end gap-0">
      <div
        className="text-[9px] tracking-[0.2em] uppercase mb-3 font-[family-name:var(--font-jetbrains)]"
        style={{ color: COLORS.textDark, opacity: 0.4 }}
      >
        Geological Record
      </div>
      {eras.map((era, i) => (
        <div key={era.era} className="flex items-center gap-2 py-[3px]">
          <span
            className="text-[8px] font-[family-name:var(--font-jetbrains)] text-right"
            style={{ color: COLORS.textDark, opacity: 0.3, width: "50px" }}
          >
            {era.range}
          </span>
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: STRATA[i]?.color || COLORS.slate,
              opacity: 0.6,
            }}
          />
          <span
            className="text-[9px] font-[family-name:var(--font-inter)]"
            style={{ color: COLORS.textDark, opacity: 0.5 }}
          >
            {era.era}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ================================================================
   FOSSIL CARD — Project card styled as embedded fossil
   ================================================================ */

function FossilCard({
  project,
  index,
  stratumColor,
  isDark,
  depth,
  era,
}: {
  project: (typeof projects)[number];
  index: number;
  stratumColor: string;
  isDark: boolean;
  depth: string;
  era: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const textColor = isDark ? COLORS.textLight : COLORS.textDark;
  const mutedColor = isDark ? `${COLORS.textLight}99` : `${COLORS.textDark}88`;
  const borderColor = isDark ? `${COLORS.textLight}15` : `${COLORS.textDark}12`;
  const bgOverlay = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)";

  return (
    <motion.div
      ref={ref}
      className="relative w-full rounded-lg overflow-hidden"
      style={{
        backgroundColor: bgOverlay,
        border: `1px solid ${borderColor}`,
        backdropFilter: "blur(2px)",
      }}
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, delay: 0.1 }}
    >
      {/* Rock texture overlay */}
      <RockTexture opacity={isDark ? 0.06 : 0.04} />

      {/* Fossil header strip */}
      <div
        className="relative px-6 pt-5 pb-3 flex items-start justify-between"
      >
        <div className="flex items-center gap-3">
          {/* Specimen number */}
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-[family-name:var(--font-jetbrains)]"
            style={{
              border: `1.5px solid ${isDark ? COLORS.amber + "60" : COLORS.amber + "80"}`,
              color: COLORS.amber,
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </div>
          <div>
            <div
              className="text-[10px] tracking-[0.2em] uppercase font-[family-name:var(--font-jetbrains)]"
              style={{ color: COLORS.amber }}
            >
              Specimen #{String(index + 1).padStart(3, "0")}
            </div>
            <div
              className="text-[10px] font-[family-name:var(--font-jetbrains)] mt-0.5"
              style={{ color: mutedColor }}
            >
              {era} &middot; Discovered {project.year}
            </div>
          </div>
        </div>

        {/* Depth tag */}
        <div
          className="text-[10px] font-[family-name:var(--font-jetbrains)] px-3 py-1 rounded-full"
          style={{
            color: isDark ? COLORS.textLight : COLORS.textDark,
            backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
            border: `1px solid ${borderColor}`,
          }}
        >
          Depth: {depth}
        </div>
      </div>

      {/* Card body */}
      <div className="relative px-6 pb-6">
        {/* Project image */}
        <div
          className="relative w-full aspect-[16/9] rounded-md overflow-hidden mb-5"
          style={{
            border: `1px solid ${borderColor}`,
          }}
        >
          <img
            src={getProjectImage("stratum", project.image)}
            alt={project.title.replace("\n", " ")}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {/* Fossil patina overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, transparent 60%, ${stratumColor}40 100%)`,
              mixBlendMode: "multiply",
            }}
          />
        </div>

        {/* Title */}
        <h3
          className="text-2xl md:text-3xl font-[family-name:var(--font-space-grotesk)] font-bold leading-tight mb-2"
          style={{
            color: textColor,
            textShadow: isDark
              ? "1px 1px 0 rgba(0,0,0,0.5), 2px 2px 0 rgba(0,0,0,0.25)"
              : "1px 1px 0 rgba(0,0,0,0.08), 2px 2px 0 rgba(0,0,0,0.04)",
          }}
        >
          {project.title.replace("\n", " ")}
        </h3>

        {/* Client label */}
        <div
          className="text-[11px] tracking-[0.15em] uppercase font-[family-name:var(--font-jetbrains)] mb-4"
          style={{ color: mutedColor }}
        >
          {project.client} &middot; {project.year}
        </div>

        {/* Description */}
        <p
          className="text-sm leading-relaxed font-[family-name:var(--font-inter)] mb-4"
          style={{ color: mutedColor }}
        >
          {project.description}
        </p>

        {/* Technical detail */}
        <p
          className="text-xs leading-relaxed font-[family-name:var(--font-inter)] mb-5"
          style={{ color: isDark ? `${COLORS.textLight}66` : `${COLORS.textDark}55` }}
        >
          {project.technical}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech.map((t) => (
            <span
              key={t}
              className="px-3 py-1 text-[11px] rounded-full font-[family-name:var(--font-jetbrains)]"
              style={{
                color: isDark ? COLORS.amber : COLORS.textDark,
                backgroundColor: isDark ? `${COLORS.amber}12` : `${COLORS.textDark}08`,
                border: `1px solid ${isDark ? COLORS.amber + "25" : COLORS.textDark + "12"}`,
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* GitHub link */}
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-[family-name:var(--font-jetbrains)] transition-opacity hover:opacity-70"
            style={{ color: COLORS.amber }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            View Source
          </a>
        )}
      </div>
    </motion.div>
  );
}

/* ================================================================
   STRATUM SECTION WRAPPER — wraps content in a geological layer
   ================================================================ */

function StratumSection({
  color,
  children,
  className = "",
  id,
}: {
  color: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={`relative w-full ${className}`}
      style={{ backgroundColor: color }}
    >
      <RockTexture opacity={0.035} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/* ================================================================
   STAT BLOCK — geological measurement style
   ================================================================ */

function StatBlock({
  value,
  label,
  delay = 0,
}: {
  value: string;
  label: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
    >
      <div
        className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-space-grotesk)]"
        style={{ color: COLORS.amber }}
      >
        {value}
      </div>
      <div
        className="text-[11px] tracking-[0.2em] uppercase mt-1 font-[family-name:var(--font-jetbrains)]"
        style={{ color: `${COLORS.textDark}88` }}
      >
        {label}
      </div>
    </motion.div>
  );
}

/* ================================================================
   MAIN PAGE COMPONENT
   ================================================================ */

export default function StratumPage() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
      setScrollProgress(Math.min(progress, 1));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Project layer assignments — 2 per stratum */
  const projectLayers = useMemo(() => {
    const depths = [
      "-85m", "-120m", "-240m", "-310m", "-580m",
      "-650m", "-920m", "-1,050m", "-1,340m", "-1,520m",
    ];
    const layerColors = [
      COLORS.sandstone, COLORS.sandstone,
      COLORS.limestone, COLORS.limestone,
      COLORS.slate, COLORS.slate,
      COLORS.redClay, COLORS.redClay,
      "#D6CCB8", "#D6CCB8",
    ];
    const darkLayers = [
      false, false, false, false, true, true, true, true, false, false,
    ];

    return projects.map((p, i) => ({
      project: p,
      depth: depths[i] || `-${1500 + i * 100}m`,
      color: layerColors[i] || COLORS.limestone,
      isDark: darkLayers[i] ?? false,
      era: GEO_ERAS[i]?.era || "Archean",
    }));
  }, []);

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: COLORS.sky }}>
      {/* Core sample sidebar */}
      <CoreSampleSidebar scrollProgress={scrollProgress} />

      {/* Geological timeline */}
      <GeologicalTimeline eras={GEO_ERAS} />

      {/* ═════════════════════════════════════════════
          HERO — Sky / Surface Level
          ═════════════════════════════════════════════ */}
      <StratumSection color="transparent" id="hero">
        {/* Sky gradient */}
        <div
          className="relative w-full overflow-hidden"
          style={{
            background: `linear-gradient(180deg, #A8E0F7 0%, ${COLORS.sky} 40%, ${COLORS.skyDeep} 100%)`,
            minHeight: "100vh",
          }}
        >
          {/* Floating cloud-like shapes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 300,
                height: 80,
                background: "rgba(255,255,255,0.3)",
                top: "15%",
                left: "10%",
                filter: "blur(30px)",
              }}
              animate={{ x: [0, 40, 0] }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 200,
                height: 60,
                background: "rgba(255,255,255,0.25)",
                top: "25%",
                right: "15%",
                filter: "blur(25px)",
              }}
              animate={{ x: [0, -30, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Hero content */}
          <div className="relative z-10 max-w-[1100px] mx-auto px-6 flex flex-col justify-center min-h-screen">
            {/* Surface marker */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] tracking-[0.2em] uppercase font-[family-name:var(--font-jetbrains)]"
                style={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  color: COLORS.textDark,
                  border: "1px solid rgba(255,255,255,0.3)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: COLORS.amber }}
                />
                Surface Level &middot; Elevation: 0m
              </div>
            </motion.div>

            {/* Main title — carved into stone look */}
            <motion.h1
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-[family-name:var(--font-space-grotesk)] leading-[0.9] mb-6"
              style={{
                color: COLORS.textDark,
                textShadow: `
                  1px 1px 0 rgba(255,255,255,0.3),
                  2px 2px 0 rgba(0,0,0,0.06),
                  3px 3px 0 rgba(0,0,0,0.04),
                  4px 4px 8px rgba(0,0,0,0.08)
                `,
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Stratum
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl font-[family-name:var(--font-inter)] max-w-xl leading-relaxed mb-8"
              style={{ color: `${COLORS.textDark}CC` }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              A geological cross-section through a decade of creative engineering.
              Each layer reveals a different stratum of work.
            </motion.p>

            {/* Stats row */}
            <motion.div
              className="flex gap-12 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {stats.map((s, i) => (
                <StatBlock key={s.label} value={s.value} label={s.label} delay={0.7 + i * 0.1} />
              ))}
            </motion.div>

            {/* Mineral Legend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <MineralLegend />
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <span
                className="text-[10px] tracking-[0.2em] uppercase font-[family-name:var(--font-jetbrains)]"
                style={{ color: `${COLORS.textDark}66` }}
              >
                Begin Descent
              </span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 4L10 16M10 16L5 11M10 16L15 11"
                  stroke={COLORS.textDark}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeOpacity="0.4"
                />
              </svg>
            </motion.div>
          </div>
        </div>
      </StratumSection>

      {/* Wavy boundary: Sky -> Topsoil */}
      <WavyBoundary color={COLORS.skyDeep} nextColor={COLORS.topsoil} variant={0} />

      {/* ═════════════════════════════════════════════
          TOPSOIL LAYER — Introduction
          ═════════════════════════════════════════════ */}
      <StratumSection color={COLORS.topsoil} id="topsoil">
        <div className="max-w-[1100px] mx-auto px-6 py-20 md:py-28">
          {/* Layer label */}
          <motion.div
            className="flex items-center gap-4 mb-10"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="h-px flex-1 max-w-[60px]"
              style={{ backgroundColor: `${COLORS.textLight}30` }}
            />
            <span
              className="text-[10px] tracking-[0.3em] uppercase font-[family-name:var(--font-jetbrains)]"
              style={{ color: `${COLORS.textLight}80` }}
            >
              Topsoil Layer &middot; Depth: -12m
            </span>
          </motion.div>

          <motion.h2
            className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-space-grotesk)] leading-tight mb-6"
            style={{
              color: COLORS.textLight,
              textShadow: "2px 2px 0 rgba(0,0,0,0.3)",
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Beneath the surface lies
            <br />
            a body of work.
          </motion.h2>

          <motion.p
            className="text-base md:text-lg font-[family-name:var(--font-inter)] max-w-2xl leading-relaxed"
            style={{ color: `${COLORS.textLight}BB` }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Like geological strata, each project represents a distinct period of creative
            and technical evolution. Scroll deeper to uncover specimens from across
            industries, technologies, and eras of innovation.
          </motion.p>

          {/* Crystal decorations */}
          <div className="flex justify-between items-center mt-12 pointer-events-none">
            <CrystalCluster side="left" />
            <CrystalCluster side="right" />
          </div>
        </div>
      </StratumSection>

      {/* Wavy boundary: Topsoil -> Sandstone */}
      <WavyBoundary color={COLORS.topsoil} nextColor={COLORS.sandstone} variant={1} />

      {/* ═════════════════════════════════════════════
          SANDSTONE LAYER — Projects 1-2
          ═════════════════════════════════════════════ */}
      <StratumSection color={COLORS.sandstone} id="sandstone">
        <div className="max-w-[1100px] mx-auto px-6 py-16 md:py-24">
          <StratumLayerHeader
            label="Sandstone Formation"
            depth="-85m"
            isDark={false}
          />

          <SeismicDivider color={COLORS.textDark} />

          <div className="grid grid-cols-1 gap-10 mt-8">
            {projectLayers.slice(0, 2).map((pl, i) => (
              <FossilCard
                key={i}
                project={pl.project}
                index={i}
                stratumColor={pl.color}
                isDark={pl.isDark}
                depth={pl.depth}
                era={pl.era}
              />
            ))}
          </div>
        </div>
      </StratumSection>

      {/* Wavy boundary: Sandstone -> Limestone */}
      <WavyBoundary color={COLORS.sandstone} nextColor={COLORS.limestone} variant={2} />

      {/* ═════════════════════════════════════════════
          LIMESTONE LAYER — Projects 3-4
          ═════════════════════════════════════════════ */}
      <StratumSection color={COLORS.limestone} id="limestone">
        <div className="max-w-[1100px] mx-auto px-6 py-16 md:py-24">
          <StratumLayerHeader
            label="Limestone Deposit"
            depth="-240m"
            isDark={false}
          />

          <SeismicDivider color={COLORS.textDark} />

          <div className="grid grid-cols-1 gap-10 mt-8">
            {projectLayers.slice(2, 4).map((pl, i) => (
              <FossilCard
                key={i + 2}
                project={pl.project}
                index={i + 2}
                stratumColor={pl.color}
                isDark={pl.isDark}
                depth={pl.depth}
                era={pl.era}
              />
            ))}
          </div>
        </div>
      </StratumSection>

      {/* Crystal cluster decoration between layers */}
      <div
        className="relative w-full py-4 flex justify-center pointer-events-none"
        style={{ backgroundColor: COLORS.limestone }}
      >
        <svg width="600" height="80" viewBox="0 0 600 80">
          <CrystalShape x={150} y={40} size={24} color={COLORS.amber} rotation={-10} />
          <CrystalShape x={200} y={50} size={18} color={COLORS.crystal} rotation={15} />
          <CrystalShape x={380} y={35} size={20} color={COLORS.crystal} rotation={-5} />
          <CrystalShape x={430} y={48} size={26} color={COLORS.amber} rotation={8} />
          <CrystalShape x={290} y={42} size={16} color={COLORS.amber} rotation={-12} />
        </svg>
      </div>

      {/* Wavy boundary: Limestone -> Slate */}
      <WavyBoundary color={COLORS.limestone} nextColor={COLORS.slate} variant={3} />

      {/* ═════════════════════════════════════════════
          SLATE LAYER — Projects 5-6
          ═════════════════════════════════════════════ */}
      <StratumSection color={COLORS.slate} id="slate">
        <div className="max-w-[1100px] mx-auto px-6 py-16 md:py-24">
          <StratumLayerHeader
            label="Slate Formation"
            depth="-580m"
            isDark={true}
          />

          <SeismicDivider color={COLORS.textLight} />

          <div className="grid grid-cols-1 gap-10 mt-8">
            {projectLayers.slice(4, 6).map((pl, i) => (
              <FossilCard
                key={i + 4}
                project={pl.project}
                index={i + 4}
                stratumColor={pl.color}
                isDark={pl.isDark}
                depth={pl.depth}
                era={pl.era}
              />
            ))}
          </div>
        </div>
      </StratumSection>

      {/* Wavy boundary: Slate -> Red Clay */}
      <WavyBoundary color={COLORS.slate} nextColor={COLORS.redClay} variant={4} />

      {/* ═════════════════════════════════════════════
          RED CLAY LAYER — Projects 7-8
          ═════════════════════════════════════════════ */}
      <StratumSection color={COLORS.redClay} id="redclay">
        <div className="max-w-[1100px] mx-auto px-6 py-16 md:py-24">
          <StratumLayerHeader
            label="Red Clay Bed"
            depth="-920m"
            isDark={true}
          />

          <SeismicDivider color={COLORS.textLight} />

          <div className="grid grid-cols-1 gap-10 mt-8">
            {projectLayers.slice(6, 8).map((pl, i) => (
              <FossilCard
                key={i + 6}
                project={pl.project}
                index={i + 6}
                stratumColor={pl.color}
                isDark={pl.isDark}
                depth={pl.depth}
                era={pl.era}
              />
            ))}
          </div>
        </div>
      </StratumSection>

      {/* Wavy boundary: Red Clay -> Deep Sandstone */}
      <WavyBoundary color={COLORS.redClay} nextColor="#D6CCB8" variant={0} />

      {/* ═════════════════════════════════════════════
          DEEP SANDSTONE LAYER — Projects 9-10
          ═════════════════════════════════════════════ */}
      <StratumSection color="#D6CCB8" id="deep-sandstone">
        <div className="max-w-[1100px] mx-auto px-6 py-16 md:py-24">
          <StratumLayerHeader
            label="Deep Sandstone"
            depth="-1,340m"
            isDark={false}
          />

          <SeismicDivider color={COLORS.textDark} />

          <div className="grid grid-cols-1 gap-10 mt-8">
            {projectLayers.slice(8, 10).map((pl, i) => (
              <FossilCard
                key={i + 8}
                project={pl.project}
                index={i + 8}
                stratumColor={pl.color}
                isDark={pl.isDark}
                depth={pl.depth}
                era={pl.era}
              />
            ))}
          </div>
        </div>
      </StratumSection>

      {/* Crystal band between projects and expertise */}
      <div
        className="relative w-full py-6 flex justify-center pointer-events-none"
        style={{ backgroundColor: "#D6CCB8" }}
      >
        <svg width="800" height="100" viewBox="0 0 800 100">
          <CrystalShape x={100} y={50} size={32} color={COLORS.amber} rotation={-8} />
          <CrystalShape x={160} y={60} size={22} color={COLORS.crystal} rotation={12} />
          <CrystalShape x={300} y={45} size={28} color={COLORS.crystal} rotation={-15} />
          <CrystalShape x={350} y={55} size={18} color={COLORS.amber} rotation={5} />
          <CrystalShape x={500} y={48} size={26} color={COLORS.amber} rotation={-3} />
          <CrystalShape x={550} y={62} size={20} color={COLORS.crystal} rotation={18} />
          <CrystalShape x={680} y={42} size={24} color={COLORS.amber} rotation={-10} />
          <CrystalShape x={730} y={55} size={16} color={COLORS.crystal} rotation={7} />
        </svg>
      </div>

      {/* Wavy boundary: Deep Sandstone -> Dark Slate */}
      <WavyBoundary color="#D6CCB8" nextColor="#3D4555" variant={1} />

      {/* ═════════════════════════════════════════════
          DARK SLATE LAYER — Expertise
          ═════════════════════════════════════════════ */}
      <StratumSection color="#3D4555" id="expertise">
        <div className="max-w-[1100px] mx-auto px-6 py-20 md:py-28">
          <StratumLayerHeader
            label="Dark Slate Layer"
            depth="-1,780m"
            isDark={true}
          />

          <motion.h2
            className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-space-grotesk)] leading-tight mb-4 mt-6"
            style={{
              color: COLORS.textLight,
              textShadow: "2px 2px 0 rgba(0,0,0,0.4)",
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Core Expertise
          </motion.h2>

          <motion.p
            className="text-sm font-[family-name:var(--font-inter)] max-w-xl leading-relaxed mb-12"
            style={{ color: `${COLORS.textLight}99` }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Mineralized knowledge from years of deep exploration across the
            technology landscape.
          </motion.p>

          <SeismicDivider color={COLORS.textLight} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {expertise.map((exp, i) => (
              <ExpertiseCard key={exp.title} item={exp} index={i} />
            ))}
          </div>
        </div>
      </StratumSection>

      {/* Wavy boundary: Dark Slate -> Obsidian */}
      <WavyBoundary color="#3D4555" nextColor={COLORS.obsidian} variant={2} />

      {/* ═════════════════════════════════════════════
          OBSIDIAN LAYER — Tools
          ═════════════════════════════════════════════ */}
      <StratumSection color={COLORS.obsidian} id="tools">
        <div className="max-w-[1100px] mx-auto px-6 py-20 md:py-28">
          <StratumLayerHeader
            label="Obsidian Vein"
            depth="-2,400m"
            isDark={true}
          />

          <motion.h2
            className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-space-grotesk)] leading-tight mb-4 mt-6"
            style={{
              color: COLORS.textLight,
              textShadow: "2px 2px 0 rgba(0,0,0,0.6)",
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Mineral Composition
          </motion.h2>

          <motion.p
            className="text-sm font-[family-name:var(--font-inter)] max-w-xl leading-relaxed mb-12"
            style={{ color: `${COLORS.textLight}88` }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            The fundamental elements that compose every project in the geological record.
          </motion.p>

          <SeismicDivider color={`${COLORS.textLight}66`} />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {tools.map((toolGroup, i) => (
              <ToolCard key={toolGroup.label} group={toolGroup} index={i} />
            ))}
          </div>

          {/* Crystal accents in deep layer */}
          <div className="flex justify-center mt-16 pointer-events-none">
            <svg width="600" height="80" viewBox="0 0 600 80">
              <CrystalShape x={120} y={40} size={30} color={COLORS.crystal} rotation={-12} />
              <CrystalShape x={180} y={50} size={20} color={COLORS.amber} rotation={8} />
              <CrystalShape x={300} y={35} size={24} color={COLORS.amber} rotation={-5} />
              <CrystalShape x={360} y={48} size={28} color={COLORS.crystal} rotation={15} />
              <CrystalShape x={480} y={40} size={22} color={COLORS.crystal} rotation={-8} />
              <CrystalShape x={530} y={55} size={18} color={COLORS.amber} rotation={10} />
            </svg>
          </div>
        </div>
      </StratumSection>

      {/* Wavy boundary: Obsidian -> Inner Core */}
      <WavyBoundary color={COLORS.obsidian} nextColor="#0F0F1E" variant={3} />

      {/* ═════════════════════════════════════════════
          INNER CORE — Deep Footer
          ═════════════════════════════════════════════ */}
      <StratumSection color="#0F0F1E" id="core">
        <div className="max-w-[1100px] mx-auto px-6 py-24 md:py-32">
          {/* Depth marker */}
          <motion.div
            className="flex justify-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full"
              style={{
                border: `1px solid ${COLORS.amber}30`,
                backgroundColor: `${COLORS.amber}08`,
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: COLORS.amber,
                  boxShadow: `0 0 8px ${COLORS.amber}60`,
                }}
              />
              <span
                className="text-[11px] tracking-[0.3em] uppercase font-[family-name:var(--font-jetbrains)]"
                style={{ color: COLORS.amber }}
              >
                Maximum Depth Reached
              </span>
            </div>
          </motion.div>

          {/* Deep core title */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div
              className="text-6xl md:text-8xl font-bold font-[family-name:var(--font-space-grotesk)]"
              style={{
                color: COLORS.textLight,
                textShadow: `
                  0 0 40px ${COLORS.crystal}20,
                  0 0 80px ${COLORS.crystal}10
                `,
                opacity: 0.9,
              }}
            >
              -2,847m
            </div>
            <div
              className="text-[11px] tracking-[0.3em] uppercase font-[family-name:var(--font-jetbrains)] mt-4"
              style={{ color: `${COLORS.textLight}55` }}
            >
              Inner Core &middot; End of Survey
            </div>
          </motion.div>

          {/* Crystal accent cluster */}
          <div className="flex justify-center mb-12 pointer-events-none">
            <svg width="500" height="120" viewBox="0 0 500 120">
              <CrystalShape x={100} y={60} size={36} color={COLORS.crystal} rotation={-10} />
              <CrystalShape x={150} y={75} size={24} color={COLORS.amber} rotation={15} />
              <CrystalShape x={200} y={50} size={20} color={COLORS.crystal} rotation={-5} />
              <CrystalShape x={250} y={65} size={30} color={COLORS.amber} rotation={8} />
              <CrystalShape x={310} y={55} size={26} color={COLORS.crystal} rotation={-12} />
              <CrystalShape x={360} y={70} size={22} color={COLORS.amber} rotation={5} />
              <CrystalShape x={410} y={58} size={18} color={COLORS.crystal} rotation={20} />
            </svg>
          </div>

          {/* Footer message */}
          <motion.p
            className="text-center text-sm font-[family-name:var(--font-inter)] max-w-lg mx-auto leading-relaxed mb-16"
            style={{ color: `${COLORS.textLight}66` }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            This geological survey represents a cross-section through years
            of creative engineering. Each specimen is a record of exploration,
            experimentation, and evolution.
          </motion.p>

          {/* Seismic signature */}
          <SeismicDivider color={`${COLORS.textLight}30`} />

          {/* Bottom metadata */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12">
            <div
              className="text-[10px] font-[family-name:var(--font-jetbrains)] tracking-wider"
              style={{ color: `${COLORS.textLight}44` }}
            >
              GEOLOGICAL SURVEY &copy; {new Date().getFullYear()}
            </div>
            <div
              className="flex items-center gap-4 text-[10px] font-[family-name:var(--font-jetbrains)]"
              style={{ color: `${COLORS.textLight}44` }}
            >
              <span>STRATA: {STRATA.length}</span>
              <span>&middot;</span>
              <span>SPECIMENS: {projects.length}</span>
              <span>&middot;</span>
              <span>MAX DEPTH: 2,847m</span>
            </div>
          </div>
        </div>
      </StratumSection>

      {/* Theme Switcher */}
      <ThemeSwitcher current="/stratum" variant="light" />
    </div>
  );
}

/* ================================================================
   SUB-COMPONENTS — Layer headers, Expertise, Tools
   ================================================================ */

function StratumLayerHeader({
  label,
  depth,
  isDark,
}: {
  label: string;
  depth: string;
  isDark: boolean;
}) {
  const textColor = isDark ? COLORS.textLight : COLORS.textDark;
  const mutedColor = isDark ? `${COLORS.textLight}60` : `${COLORS.textDark}55`;

  return (
    <motion.div
      className="flex items-center justify-between mb-2"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-3 h-3 rounded-sm"
          style={{
            backgroundColor: isDark ? COLORS.amber : COLORS.topsoil,
            opacity: 0.6,
          }}
        />
        <span
          className="text-[10px] tracking-[0.25em] uppercase font-[family-name:var(--font-jetbrains)]"
          style={{ color: mutedColor }}
        >
          {label}
        </span>
      </div>
      <span
        className="text-[10px] font-[family-name:var(--font-jetbrains)] tabular-nums"
        style={{ color: mutedColor }}
      >
        Depth: {depth}
      </span>
    </motion.div>
  );
}

function ExpertiseCard({
  item,
  index,
}: {
  item: (typeof expertise)[number];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className="relative rounded-lg overflow-hidden p-6"
      style={{
        backgroundColor: "rgba(255,255,255,0.04)",
        border: `1px solid ${COLORS.textLight}12`,
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <RockTexture opacity={0.03} />

      {/* Era number */}
      <div
        className="text-[10px] font-[family-name:var(--font-jetbrains)] mb-4"
        style={{ color: COLORS.amber }}
      >
        STRATUM {String(index + 1).padStart(2, "0")}
      </div>

      <h3
        className="text-xl font-bold font-[family-name:var(--font-space-grotesk)] mb-3"
        style={{
          color: COLORS.textLight,
          textShadow: "1px 1px 0 rgba(0,0,0,0.3)",
        }}
      >
        {item.title}
      </h3>

      <p
        className="text-sm leading-relaxed font-[family-name:var(--font-inter)]"
        style={{ color: `${COLORS.textLight}99` }}
      >
        {item.body}
      </p>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 w-full h-[2px]"
        style={{
          background: `linear-gradient(90deg, ${COLORS.amber}40, transparent)`,
        }}
      />
    </motion.div>
  );
}

function ToolCard({
  group,
  index,
}: {
  group: (typeof tools)[number];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className="relative rounded-lg overflow-hidden p-5"
      style={{
        backgroundColor: "rgba(255,255,255,0.03)",
        border: `1px solid ${COLORS.textLight}10`,
      }}
      initial={{ opacity: 0, y: 25 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <RockTexture opacity={0.025} />

      {/* Mineral type label */}
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-2 h-2 rounded-full"
          style={{
            backgroundColor: index % 2 === 0 ? COLORS.amber : COLORS.crystal,
          }}
        />
        <span
          className="text-[10px] tracking-[0.2em] uppercase font-[family-name:var(--font-jetbrains)]"
          style={{ color: COLORS.amber }}
        >
          {group.label}
        </span>
      </div>

      {/* Tool items */}
      <div className="flex flex-wrap gap-2">
        {group.items.map((item) => (
          <span
            key={item}
            className="px-3 py-1.5 text-[11px] rounded font-[family-name:var(--font-jetbrains)]"
            style={{
              color: COLORS.textLight,
              backgroundColor: `${COLORS.textLight}08`,
              border: `1px solid ${COLORS.textLight}12`,
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
