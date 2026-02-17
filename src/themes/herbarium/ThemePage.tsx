"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { projects, stats, expertise, tools } from "@/app/data/projects";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";
import { getProjectImage } from "@/lib/theme-images";

/* ─── Palette ─── */
const C = {
  cream: "#FAF5EC",
  green: "#2D5A3D",
  ink: "#2A2420",
  pencil: "#8B7E70",
  burgundy: "#7A2638",
  copper: "#B8885C",
  pressed: "#5C8A5E",
  tan: "#E8DCC8",
  rule: "#3D3028",
  paper: "#F5EFDF",
};

const ease = [0.22, 1, 0.36, 1] as const;

/* ─── Reusable reveal wrapper ─── */
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
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

/* ─── SVG: Aged paper texture filter ─── */
function AgedPaperFilter() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
      <filter id="paper-fiber">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.65"
          numOctaves="4"
          stitchTiles="stitch"
          result="noise"
        />
        <feColorMatrix
          type="saturate"
          values="0"
          in="noise"
          result="gray"
        />
        <feBlend in="SourceGraphic" in2="gray" mode="multiply" />
      </filter>
      <rect width="100%" height="100%" filter="url(#paper-fiber)" opacity="0.035" />
    </svg>
  );
}

/* ─── SVG: Copper-plate border with corner flourishes ─── */
function CopperBorder() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 800 500"
      preserveAspectRatio="none"
      aria-hidden
    >
      {/* Outer rule */}
      <motion.rect
        x="20" y="20" width="760" height="460" rx="2"
        fill="none" stroke={C.copper} strokeWidth="1.5"
        pathLength={1}
        initial={{ strokeDasharray: 1, strokeDashoffset: 1 }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 2.4, ease }}
      />
      {/* Inner rule */}
      <motion.rect
        x="28" y="28" width="744" height="444" rx="1"
        fill="none" stroke={C.copper} strokeWidth="0.5" opacity={0.6}
        pathLength={1}
        initial={{ strokeDasharray: 1, strokeDashoffset: 1 }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 2.4, ease, delay: 0.3 }}
      />
      {/* Corner flourishes — top-left */}
      <motion.path
        d="M20,60 Q20,20 60,20 M30,50 C30,30 30,30 50,30 M22,70 C22,40 22,22 70,22"
        fill="none" stroke={C.copper} strokeWidth="1.2" strokeLinecap="round"
        pathLength={1}
        initial={{ strokeDasharray: 1, strokeDashoffset: 1 }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 1.8, ease, delay: 0.6 }}
      />
      {/* Top-right */}
      <motion.path
        d="M780,60 Q780,20 740,20 M770,50 C770,30 770,30 750,30 M778,70 C778,40 778,22 730,22"
        fill="none" stroke={C.copper} strokeWidth="1.2" strokeLinecap="round"
        pathLength={1}
        initial={{ strokeDasharray: 1, strokeDashoffset: 1 }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 1.8, ease, delay: 0.8 }}
      />
      {/* Bottom-left */}
      <motion.path
        d="M20,440 Q20,480 60,480 M30,450 C30,470 30,470 50,470 M22,430 C22,460 22,478 70,478"
        fill="none" stroke={C.copper} strokeWidth="1.2" strokeLinecap="round"
        pathLength={1}
        initial={{ strokeDasharray: 1, strokeDashoffset: 1 }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 1.8, ease, delay: 1.0 }}
      />
      {/* Bottom-right */}
      <motion.path
        d="M780,440 Q780,480 740,480 M770,450 C770,470 770,470 750,470 M778,430 C778,460 778,478 730,478"
        fill="none" stroke={C.copper} strokeWidth="1.2" strokeLinecap="round"
        pathLength={1}
        initial={{ strokeDasharray: 1, strokeDashoffset: 1 }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 1.8, ease, delay: 1.2 }}
      />
    </svg>
  );
}

/* ─── SVG: Fleuron ornament (❧ style) ─── */
function Fleuron({ color = C.copper, size = 40 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" aria-hidden>
      <path
        d="M30,8 C24,8 16,14 16,22 C16,30 22,34 30,38 C38,34 44,30 44,22 C44,14 36,8 30,8Z
           M30,38 C28,42 24,48 20,52 M30,38 C32,42 36,48 40,52
           M30,22 C30,16 26,12 30,8 C34,12 30,16 30,22
           M22,24 C18,24 14,20 16,22 M38,24 C42,24 46,20 44,22
           M26,32 Q24,36 20,40 M34,32 Q36,36 40,40"
        fill="none"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="30" cy="22" r="2.5" fill={color} opacity={0.4} />
    </svg>
  );
}

/* ─── SVG: 5 Botanical branch variants ─── */
function BotanicalBranch({ variant, hovered }: { variant: number; hovered: boolean }) {
  const strokeColor = hovered ? C.burgundy : C.pressed;
  const common = {
    fill: "none" as const,
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    pathLength: 1,
  };

  const branches: Record<number, React.ReactNode> = {
    /* Fern frond */
    0: (
      <g>
        <motion.path
          d="M40,140 C40,120 42,80 44,40 C44,30 46,15 48,8"
          stroke={strokeColor} {...common}
          initial={{ strokeDasharray: 1, strokeDashoffset: 1 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 1.6, ease }}
        />
        {[20, 35, 50, 65, 80, 95, 110, 125].map((y, i) => (
          <motion.path
            key={i}
            d={i % 2 === 0
              ? `M${42 - (140 - y) * 0.02},${y} C${30 - i * 1.5},${y - 4} ${22 - i},${y - 8} ${16 - i * 0.8},${y - 12}`
              : `M${42 + (140 - y) * 0.02},${y} C${54 + i * 1.5},${y - 4} ${62 + i},${y - 8} ${68 + i * 0.8},${y - 12}`
            }
            stroke={strokeColor} {...common} strokeWidth={1}
            initial={{ strokeDasharray: 1, strokeDashoffset: 1 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 1.2, ease, delay: 0.2 + i * 0.08 }}
          />
        ))}
      </g>
    ),
    /* Berry stem */
    1: (
      <g>
        <motion.path
          d="M42,140 C42,110 38,70 40,30 C41,20 44,10 46,5"
          stroke={strokeColor} {...common}
          initial={{ strokeDasharray: 1, strokeDashoffset: 1 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 1.6, ease }}
        />
        {[30, 55, 80, 105].map((y, i) => (
          <g key={i}>
            <motion.path
              d={`M${41 + (i % 2 === 0 ? -1 : 1)},${y} C${i % 2 === 0 ? 28 : 56},${y - 8} ${i % 2 === 0 ? 20 : 64},${y - 14} ${i % 2 === 0 ? 18 : 66},${y - 18}`}
              stroke={strokeColor} {...common} strokeWidth={1}
              initial={{ strokeDasharray: 1, strokeDashoffset: 1 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 1, ease, delay: 0.3 + i * 0.12 }}
            />
            {[0, 1, 2].map((b) => (
              <motion.circle
                key={b}
                cx={(i % 2 === 0 ? 18 : 66) + (b - 1) * (i % 2 === 0 ? -4 : 4)}
                cy={y - 18 - b * 3}
                r="3"
                fill="none"
                stroke={strokeColor}
                strokeWidth={1}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, ease, delay: 0.6 + i * 0.12 + b * 0.05 }}
              />
            ))}
          </g>
        ))}
      </g>
    ),
    /* Twig with leaves */
    2: (
      <g>
        <motion.path
          d="M44,140 C43,110 40,75 42,40 C43,25 45,12 48,5"
          stroke={strokeColor} {...common}
          initial={{ strokeDasharray: 1, strokeDashoffset: 1 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 1.6, ease }}
        />
        {[25, 45, 65, 85, 105, 120].map((y, i) => (
          <motion.path
            key={i}
            d={i % 2 === 0
              ? `M${42},${y} C${32},${y - 2} ${24},${y - 10} ${20},${y - 6} C${24},${y - 2} ${32},${y + 2} ${42},${y}`
              : `M${44},${y} C${54},${y - 2} ${62},${y - 10} ${66},${y - 6} C${62},${y - 2} ${54},${y + 2} ${44},${y}`
            }
            stroke={strokeColor} fill={strokeColor} fillOpacity={0.08}
            strokeWidth={0.8}
            initial={{ strokeDasharray: 1, strokeDashoffset: 1, opacity: 0 }}
            animate={{ strokeDashoffset: 0, opacity: 1 }}
            transition={{ duration: 1, ease, delay: 0.3 + i * 0.1 }}
          />
        ))}
      </g>
    ),
    /* Seed pod */
    3: (
      <g>
        <motion.path
          d="M42,140 C42,115 44,80 43,50 C42,35 44,18 46,5"
          stroke={strokeColor} {...common}
          initial={{ strokeDasharray: 1, strokeDashoffset: 1 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 1.6, ease }}
        />
        {[25, 50, 75, 100].map((y, i) => (
          <g key={i}>
            <motion.path
              d={`M${43},${y} L${i % 2 === 0 ? 26 : 60},${y - 10}`}
              stroke={strokeColor} {...common} strokeWidth={0.8}
              initial={{ strokeDasharray: 1, strokeDashoffset: 1 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.4 + i * 0.12 }}
            />
            <motion.ellipse
              cx={i % 2 === 0 ? 22 : 64}
              cy={y - 14}
              rx="5"
              ry="8"
              transform={`rotate(${i % 2 === 0 ? -20 : 20} ${i % 2 === 0 ? 22 : 64} ${y - 14})`}
              fill="none"
              stroke={strokeColor}
              strokeWidth={1}
              initial={{ strokeDasharray: 1, strokeDashoffset: 1 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 1, ease, delay: 0.6 + i * 0.12 }}
            />
          </g>
        ))}
      </g>
    ),
    /* Flowering stem */
    4: (
      <g>
        <motion.path
          d="M42,140 C40,110 43,75 42,45 C41,30 44,15 46,5"
          stroke={strokeColor} {...common}
          initial={{ strokeDasharray: 1, strokeDashoffset: 1 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 1.6, ease }}
        />
        {[20, 50, 80].map((y, i) => {
          const cx = i % 2 === 0 ? 24 : 62;
          return (
            <g key={i}>
              <motion.path
                d={`M${42 + (i % 2 === 0 ? -1 : 1)},${y + 10} C${cx},${y + 5} ${cx},${y} ${cx},${y - 2}`}
                stroke={strokeColor} {...common} strokeWidth={0.8}
                initial={{ strokeDasharray: 1, strokeDashoffset: 1 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 0.8, ease, delay: 0.4 + i * 0.15 }}
              />
              {[0, 1, 2, 3, 4].map((p) => {
                const a = (p * 72 - 90) * (Math.PI / 180);
                return (
                  <motion.ellipse
                    key={p}
                    cx={cx + Math.cos(a) * 8}
                    cy={y - 2 + Math.sin(a) * 8}
                    rx="4"
                    ry="7"
                    transform={`rotate(${p * 72} ${cx + Math.cos(a) * 8} ${y - 2 + Math.sin(a) * 8})`}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={0.7}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, ease, delay: 0.7 + i * 0.15 + p * 0.06 }}
                  />
                );
              })}
              <motion.circle
                cx={cx} cy={y - 2} r="2.5"
                fill={strokeColor} fillOpacity={0.2}
                stroke={strokeColor} strokeWidth={0.6}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, ease, delay: 1 + i * 0.15 }}
              />
            </g>
          );
        })}
      </g>
    ),
  };

  return (
    <svg viewBox="0 0 84 150" className="w-[84px] h-[150px]" aria-hidden>
      {branches[variant]}
    </svg>
  );
}

/* ─── Watercolor wash background ─── */
function WatercolorWash() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      <div
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full"
        style={{
          background: `radial-gradient(ellipse at center, ${C.pressed}12 0%, transparent 70%)`,
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full"
        style={{
          background: `radial-gradient(ellipse at center, ${C.pressed}0D 0%, transparent 70%)`,
        }}
      />
    </div>
  );
}

/* ─── Horizontal rule with fleuron ─── */
function HerbariumRule() {
  return (
    <div className="flex items-center justify-center gap-4 my-12">
      <div className="h-px flex-1 max-w-[200px]" style={{ background: C.copper }} />
      <Fleuron size={28} />
      <div className="h-px flex-1 max-w-[200px]" style={{ background: C.copper }} />
    </div>
  );
}

/* ═══════════════════════════════════════════
   SPECIMEN CARD
   ═══════════════════════════════════════════ */
function SpecimenCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const catalogNum = String(index + 1).padStart(3, "0");
  const variant = index % 5;

  return (
    <motion.a
      ref={ref}
      href={project.github}
      target="_blank"
      rel="noopener noreferrer"
      className="block group relative"
      style={{ background: C.paper, border: `1px solid ${C.tan}` }}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease, delay: 0.1 }}
      whileHover={{
        boxShadow: `0 4px 30px ${C.copper}40, 0 0 0 1px ${C.copper}60`,
      }}
    >
      {/* Top catalog bar */}
      <div
        className="flex items-center justify-between px-6 py-3"
        style={{ borderBottom: `1px solid ${C.tan}` }}
      >
        <span
          className="font-[family-name:var(--font-jetbrains)] text-xs tracking-[0.2em] uppercase"
          style={{ color: C.pencil }}
        >
          Specimen No. {catalogNum}
        </span>
        <span
          className="font-[family-name:var(--font-jetbrains)] text-xs"
          style={{ color: C.pencil }}
        >
          {project.year} &middot; {project.client}
        </span>
      </div>

      <div className="flex gap-6 p-6">
        {/* Botanical illustration column */}
        <div className="flex-shrink-0 flex flex-col items-center pt-2">
          <BotanicalBranch variant={variant} hovered={false} />
          <div
            className="mt-2 w-12 h-px"
            style={{ background: C.copper, opacity: 0.4 }}
          />
        </div>

        {/* Content column */}
        <div className="flex-1 min-w-0">
          {/* Title as italic species-name */}
          <h3
            className="font-[family-name:var(--font-instrument)] text-2xl italic leading-tight mb-1"
            style={{ color: C.ink }}
          >
            {project.title.replace("\n", " ")}
          </h3>

          {/* Horizontal rule */}
          <div className="my-3 h-px" style={{ background: C.copper, opacity: 0.3 }} />

          {/* Description */}
          <p
            className="font-[family-name:var(--font-inter)] text-sm leading-relaxed mb-3"
            style={{ color: C.pencil }}
          >
            {project.description}
          </p>

          {/* Technical notes */}
          <p
            className="font-[family-name:var(--font-jetbrains)] text-xs leading-relaxed mb-4"
            style={{ color: C.pencil, opacity: 0.8 }}
          >
            {project.technical}
          </p>

          {/* Specimen label bar (tape effect) */}
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tag, i) => {
              const rotation = ((i * 7 + index * 3) % 3) - 1; // -1 to 1
              return (
                <span
                  key={tag}
                  className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[0.15em] uppercase
                             px-3 py-1 inline-block transition-transform duration-300 group-hover:rotate-0"
                  style={{
                    background: C.tan,
                    color: C.rule,
                    transform: `rotate(${rotation}deg)`,
                    boxShadow: `1px 1px 3px ${C.pencil}30`,
                  }}
                >
                  {tag}
                </span>
              );
            })}
          </div>
        </div>

        {/* Project image */}
        <div
          className="hidden md:block flex-shrink-0 w-[180px] h-[180px] self-center overflow-hidden"
          style={{ border: `1px solid ${C.tan}` }}
        >
          <img
            src={getProjectImage("herbarium", project.image)}
            alt={project.title.replace("\n", " ")}
            className="w-full h-full object-cover grayscale-[40%] sepia-[30%] opacity-90
                       group-hover:grayscale-0 group-hover:sepia-0 group-hover:opacity-100
                       transition-all duration-700"
          />
        </div>
      </div>
    </motion.a>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */
export default function HerbariumPage() {
  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{ background: C.cream, color: C.ink }}
    >
      {/* Global aged paper filter */}
      <AgedPaperFilter />

      {/* ─── HERO: Folio Title Page ─── */}
      <section className="relative flex items-center justify-center min-h-[92vh] px-6">
        <WatercolorWash />

        <div className="relative w-full max-w-[800px] aspect-[8/5] flex items-center justify-center">
          <CopperBorder />

          <div className="relative z-10 text-center px-12 py-8">
            {/* Subtitle */}
            <Reveal>
              <p
                className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[0.35em] uppercase mb-6"
                style={{ color: C.copper }}
              >
                A Curated Collection of Digital Specimens
              </p>
            </Reveal>

            {/* Main title */}
            <Reveal delay={0.15}>
              <h1
                className="font-[family-name:var(--font-instrument)] text-5xl md:text-7xl italic mb-2"
                style={{ color: C.ink }}
              >
                Herbarium
              </h1>
            </Reveal>

            <Reveal delay={0.25}>
              <p
                className="font-[family-name:var(--font-instrument)] text-lg italic mb-8"
                style={{ color: C.pencil }}
              >
                Catalogus Operum Digitalium
              </p>
            </Reveal>

            {/* Fleuron divider */}
            <Reveal delay={0.35}>
              <div className="flex justify-center mb-8">
                <Fleuron color={C.copper} size={36} />
              </div>
            </Reveal>

            {/* Collection Summary — stats as catalog card */}
            <Reveal delay={0.45}>
              <div
                className="inline-block px-8 py-5"
                style={{
                  border: `1px solid ${C.copper}50`,
                  background: `${C.paper}CC`,
                }}
              >
                <p
                  className="font-[family-name:var(--font-jetbrains)] text-[9px] tracking-[0.3em] uppercase mb-4"
                  style={{ color: C.copper }}
                >
                  Collection Summary
                </p>
                <div className="flex gap-10 justify-center">
                  {stats.map((s) => (
                    <div key={s.label} className="text-center">
                      <div
                        className="font-[family-name:var(--font-instrument)] text-3xl italic"
                        style={{ color: C.green }}
                      >
                        {s.value}
                      </div>
                      <div
                        className="font-[family-name:var(--font-jetbrains)] text-[9px] tracking-[0.2em] uppercase mt-1"
                        style={{ color: C.pencil }}
                      >
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── PROJECTS: Specimen Cards ─── */}
      <section className="relative px-6 py-20 max-w-[860px] mx-auto">
        <WatercolorWash />

        <Reveal>
          <div className="text-center mb-16">
            <p
              className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[0.35em] uppercase mb-3"
              style={{ color: C.copper }}
            >
              Plates I &ndash; {projects.length}
            </p>
            <h2
              className="font-[family-name:var(--font-instrument)] text-3xl md:text-4xl italic"
              style={{ color: C.ink }}
            >
              Mounted Specimens
            </h2>
          </div>
        </Reveal>

        <div className="flex flex-col gap-8">
          {projects.map((project, i) => (
            <SpecimenCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </section>

      <HerbariumRule />

      {/* ─── EXPERTISE: Classification Key ─── */}
      <section className="relative px-6 py-20 max-w-[860px] mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <p
              className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[0.35em] uppercase mb-3"
              style={{ color: C.copper }}
            >
              Taxonomia
            </p>
            <h2
              className="font-[family-name:var(--font-instrument)] text-3xl md:text-4xl italic"
              style={{ color: C.ink }}
            >
              Classification Key
            </h2>
          </div>
        </Reveal>

        <div className="relative">
          {/* Central taxonomy trunk line */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block"
            style={{ background: `${C.copper}40` }}
          />

          <div className="flex flex-col gap-12">
            {expertise.map((item, i) => {
              const isLeft = i % 2 === 0;
              return (
                <Reveal key={item.title} delay={i * 0.1}>
                  <div className={`relative flex items-start gap-8 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}>
                    {/* Content */}
                    <div className={`flex-1 ${isLeft ? "md:text-right" : "md:text-left"}`}>
                      <h3
                        className="font-[family-name:var(--font-instrument)] text-xl italic mb-2"
                        style={{ color: C.green }}
                      >
                        {item.title}
                      </h3>
                      <p
                        className="font-[family-name:var(--font-inter)] text-sm leading-relaxed"
                        style={{ color: C.pencil }}
                      >
                        {item.body}
                      </p>
                    </div>

                    {/* Connector node (visible on md+) */}
                    <div className="hidden md:flex flex-shrink-0 items-center justify-center relative">
                      {/* Horizontal connector line */}
                      <svg
                        width="80"
                        height="40"
                        viewBox="0 0 80 40"
                        className="absolute"
                        style={{ [isLeft ? "right" : "left"]: "-40px" }}
                        aria-hidden
                      >
                        <line
                          x1={isLeft ? 0 : 80}
                          y1="20"
                          x2={isLeft ? 80 : 0}
                          y2="20"
                          stroke={C.copper}
                          strokeWidth="1"
                          strokeDasharray="4 3"
                        />
                      </svg>
                      {/* Node dot */}
                      <div
                        className="w-3 h-3 rounded-full border-2 z-10"
                        style={{
                          borderColor: C.copper,
                          background: C.cream,
                        }}
                      />
                    </div>

                    {/* Spacer for the other side */}
                    <div className="flex-1 hidden md:block" />
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <HerbariumRule />

      {/* ─── TOOLS: Index of Species ─── */}
      <section className="relative px-6 py-20 max-w-[860px] mx-auto">
        <WatercolorWash />

        <Reveal>
          <div className="text-center mb-16">
            <p
              className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[0.35em] uppercase mb-3"
              style={{ color: C.copper }}
            >
              Index Generum
            </p>
            <h2
              className="font-[family-name:var(--font-instrument)] text-3xl md:text-4xl italic"
              style={{ color: C.ink }}
            >
              Index of Species
            </h2>
          </div>
        </Reveal>

        <div
          className="grid grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-8"
          style={{
            borderTop: `1px solid ${C.copper}40`,
            paddingTop: "2rem",
          }}
        >
          {tools.map((group, gi) => (
            <Reveal key={group.label} delay={gi * 0.08}>
              <div>
                {/* Genus heading */}
                <h3
                  className="font-[family-name:var(--font-instrument)] text-lg italic mb-3"
                  style={{ color: C.green }}
                >
                  {group.label}
                </h3>
                <div
                  className="h-px mb-3"
                  style={{ background: `${C.copper}30` }}
                />
                {/* Species list */}
                <ul className="space-y-1.5">
                  {group.items.map((item, ii) => (
                    <li
                      key={item}
                      className="font-[family-name:var(--font-jetbrains)] text-xs flex items-baseline gap-2"
                      style={{ color: C.pencil }}
                    >
                      <span
                        className="text-[8px]"
                        style={{ color: C.copper }}
                      >
                        {String.fromCharCode(97 + ii)})
                      </span>
                      <span className="font-[family-name:var(--font-inter)] text-sm italic">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Bottom rule for the index */}
        <div
          className="mt-10 h-px"
          style={{ background: `${C.copper}40` }}
        />
        <p
          className="font-[family-name:var(--font-jetbrains)] text-[9px] tracking-[0.15em] text-center mt-3"
          style={{ color: C.pencil }}
        >
          {tools.reduce((sum, g) => sum + g.items.length, 0)} species catalogued across{" "}
          {tools.length} genera
        </p>
      </section>

      <HerbariumRule />

      {/* ─── FOOTER: Colophon ─── */}
      <footer className="relative px-6 py-20 text-center">
        <Reveal>
          <div>
            {/* Centered fleuron ornament */}
            <div className="flex justify-center mb-8">
              <Fleuron color={C.copper} size={48} />
            </div>

            <p
              className="font-[family-name:var(--font-instrument)] text-lg italic mb-2"
              style={{ color: C.ink }}
            >
              Finis Catalogi
            </p>

            <p
              className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[0.2em] uppercase mb-6"
              style={{ color: C.pencil }}
            >
              This collection was prepared and mounted in the year MMXXV
            </p>

            {/* Colophon details */}
            <div
              className="inline-block px-8 py-4"
              style={{
                border: `1px solid ${C.copper}30`,
                background: `${C.paper}80`,
              }}
            >
              <p
                className="font-[family-name:var(--font-inter)] text-xs leading-loose"
                style={{ color: C.pencil }}
              >
                Composed in Instrument Serif &amp; Inter. Rendered with Next.js.
                <br />
                Botanical illustrations drawn in SVG. Ornaments set in copper-plate style.
              </p>
            </div>

            {/* Final flourish line */}
            <div className="flex items-center justify-center gap-3 mt-10">
              <div className="h-px w-16" style={{ background: `${C.copper}50` }} />
              <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden>
                <circle cx="4" cy="4" r="2" fill={C.copper} opacity={0.5} />
              </svg>
              <div className="h-px w-16" style={{ background: `${C.copper}50` }} />
            </div>
          </div>
        </Reveal>
      </footer>

      <ThemeSwitcher current="/herbarium" variant="light" />
    </main>
  );
}
