"use client";

import { useRef, useMemo } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";

/* ═══════════════════════════════════════════════════════════════════
   RISOGRAPH — ink colors, paper stock, halftone dots, misregistration
   ═══════════════════════════════════════════════════════════════════ */

const INK = {
  paper: "#FFF8F0",
  pink: "#FF0066",
  navy: "#1A1A5E",
  yellow: "#E8D44D",
  overPinkNavy: "#880044",
  overYellowNavy: "#6B6B2E",
  paperDark: "#F5EDE0",
  navyLight: "rgba(26,26,94,0.08)",
  navyMuted: "rgba(26,26,94,0.55)",
  pinkLight: "rgba(255,0,102,0.12)",
  yellowLight: "rgba(232,212,77,0.25)",
};

/* ─── Halftone dot background generators ─── */
function halftone(color: string, size: number) {
  const dot = Math.max(0.5, size / 8);
  return {
    backgroundImage: `radial-gradient(circle, ${color} ${dot}px, transparent ${dot}px)`,
    backgroundSize: `${size}px ${size}px`,
  };
}

/* ─── Section wrapper with scroll reveal ─── */
function Reveal({
  children,
  className = "",
  style = {},
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   Paper Texture (SVG feTurbulence grain)
   ═══════════════════════════════════════════ */
function PaperGrain() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[2]" style={{ opacity: 0.045 }}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <filter id="risoGrain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#risoGrain)" />
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Registration Marks  (crosshair + circle)
   ═══════════════════════════════════════════ */
function RegistrationMark({
  style,
  color = INK.navy,
  size = 24,
}: {
  style?: React.CSSProperties;
  color?: string;
  size?: number;
}) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", opacity: 0.3, ...style }}
      animate={{ rotate: 360 }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
    >
      <circle cx="12" cy="12" r="8" stroke={color} strokeWidth="1" />
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="0.75" />
      <line x1="12" y1="0" x2="12" y2="24" stroke={color} strokeWidth="0.5" />
      <line x1="0" y1="12" x2="24" y2="12" stroke={color} strokeWidth="0.5" />
    </motion.svg>
  );
}

/* ═══════════════════════════════════════════
   Misregistered Text — the signature effect
   ═══════════════════════════════════════════ */
function MisregText({
  children,
  as: Tag = "h1",
  primaryColor = INK.pink,
  shadowColor = INK.navy,
  offsetX = 2.5,
  offsetY = -2,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "span" | "p";
  primaryColor?: string;
  shadowColor?: string;
  offsetX?: number;
  offsetY?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span className={`relative inline-block ${className}`} style={style}>
      {/* Shadow (misregistered) layer */}
      <Tag
        aria-hidden="true"
        className="absolute inset-0 select-none"
        style={{
          color: shadowColor,
          transform: `translate(${offsetX}px, ${offsetY}px)`,
          mixBlendMode: "multiply",
          whiteSpace: "pre-line",
        }}
      >
        {children}
      </Tag>
      {/* Primary layer */}
      <Tag
        style={{
          color: primaryColor,
          position: "relative",
          mixBlendMode: "multiply",
          whiteSpace: "pre-line",
        }}
      >
        {children}
      </Tag>
    </span>
  );
}

/* ═══════════════════════════════════════════
   Section Header with yellow highlighter bar
   ═══════════════════════════════════════════ */
function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative inline-block mb-10 md:mb-14">
      {/* Yellow highlighter bar */}
      <div
        className="absolute left-[-8px] right-[-12px] bottom-[2px] h-[40%] z-0"
        style={{
          background: INK.yellow,
          transform: "rotate(-1deg)",
          mixBlendMode: "multiply",
          opacity: 0.7,
        }}
      />
      <MisregText
        as="h2"
        primaryColor={INK.navy}
        shadowColor={INK.pink}
        offsetX={2}
        offsetY={-1.5}
        className="relative z-[1]"
      >
        {children}
      </MisregText>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Ink Splotch — organic blob decoration
   ═══════════════════════════════════════════ */
function InkSplotch({
  color,
  size = 80,
  style = {},
}: {
  color: string;
  size?: number;
  style?: React.CSSProperties;
}) {
  const radii = useMemo(() => {
    const seed = size + color.charCodeAt(1);
    const r = (i: number) => 30 + ((seed * (i + 1) * 17) % 40);
    return `${r(0)}% ${r(1)}% ${r(2)}% ${r(3)}% / ${r(4)}% ${r(5)}% ${r(6)}% ${r(7)}%`;
  }, [size, color]);

  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        background: color,
        borderRadius: radii,
        opacity: 0.15,
        mixBlendMode: "multiply",
        ...style,
      }}
    />
  );
}

/* ═══════════════════════════════════════════
   Ink Color Legend (printer swatch strip)
   ═══════════════════════════════════════════ */
function InkLegend() {
  const swatches = [
    { color: INK.pink, label: "Hot Pink" },
    { color: INK.navy, label: "Navy" },
    { color: INK.yellow, label: "Fl. Yellow" },
    { color: INK.overPinkNavy, label: "Overprint" },
  ];
  return (
    <div className="flex items-center gap-3 md:gap-4 flex-wrap">
      {swatches.map((s) => (
        <div key={s.label} className="flex items-center gap-1.5">
          <div
            className="w-4 h-4 md:w-5 md:h-5 border"
            style={{
              background: s.color,
              borderColor: INK.navy,
              borderWidth: 1,
            }}
          />
          <span
            className="text-[10px] md:text-xs uppercase tracking-widest font-[family-name:var(--font-space-grotesk)]"
            style={{ color: INK.navy }}
          >
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════
   Halftone Section Background
   ═══════════════════════════════════════════ */
function HalftoneOverlay({
  color = INK.pink,
  size = 8,
  opacity = 0.06,
  style = {},
}: {
  color?: string;
  size?: number;
  opacity?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0"
      style={{
        ...halftone(color, size),
        opacity,
        ...style,
      }}
    />
  );
}

/* ═══════════════════════════════════════════
   Decorative Geometric Shapes (halftone fill)
   ═══════════════════════════════════════════ */
function HalftoneCircle({
  color = INK.pink,
  size = 140,
  dotSize = 6,
  style = {},
}: {
  color?: string;
  size?: number;
  dotSize?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        ...halftone(color, dotSize),
        opacity: 0.35,
        mixBlendMode: "multiply",
        ...style,
      }}
    />
  );
}

function HalftoneTriangle({
  color = INK.yellow,
  size = 120,
  dotSize = 5,
  style = {},
}: {
  color?: string;
  size?: number;
  dotSize?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        position: "absolute",
        width: 0,
        height: 0,
        borderLeft: `${size / 2}px solid transparent`,
        borderRight: `${size / 2}px solid transparent`,
        borderBottom: `${size}px solid ${color}`,
        opacity: 0.3,
        mixBlendMode: "multiply",
        ...style,
      }}
    />
  );
}

function HalftoneRect({
  color = INK.navy,
  width = 100,
  height = 60,
  dotSize = 4,
  style = {},
}: {
  color?: string;
  width?: number;
  height?: number;
  dotSize?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        position: "absolute",
        width,
        height,
        ...halftone(color, dotSize),
        opacity: 0.25,
        mixBlendMode: "multiply",
        ...style,
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ██████  ██ ███████  ██████       ██████   █████   ██████  ███████
   ██   ██ ██ ██      ██    ██      ██   ██ ██   ██ ██       ██
   ██████  ██ ███████ ██    ██      ██████  ███████ ██   ███ █████
   ██   ██ ██      ██ ██    ██      ██      ██   ██ ██    ██ ██
   ██   ██ ██ ███████  ██████       ██      ██   ██  ██████  ███████
   ═══════════════════════════════════════════════════════════════════ */

export default function RisoPage() {
  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{ background: INK.paper, color: INK.navy }}
    >
      {/* Global paper texture grain */}
      <PaperGrain />

      {/* Full-page halftone underlay (very subtle) */}
      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{ ...halftone(INK.pink, 12), opacity: 0.018 }}
      />

      <div className="relative z-[3] mx-auto max-w-[1100px] px-5 md:px-8">
        {/* ═══════════ HERO ═══════════ */}
        <HeroSection />

        {/* ═══════════ STATS BAR ═══════════ */}
        <StatsBar />

        {/* ═══════════ PROJECTS ═══════════ */}
        <ProjectsSection />

        {/* ═══════════ EXPERTISE ═══════════ */}
        <ExpertiseSection />

        {/* ═══════════ TOOLS ═══════════ */}
        <ToolsSection />

        {/* ═══════════ FOOTER ═══════════ */}
        <FooterSection />
      </div>

      <ThemeSwitcher current="/riso" variant="light" />
    </div>
  );
}

/* ═══════════════════════════════════════════
   H E R O
   ═══════════════════════════════════════════ */
function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="relative pt-20 md:pt-32 pb-20 md:pb-28 overflow-hidden">
      {/* Registration marks in corners */}
      <RegistrationMark style={{ top: 12, left: 0 }} />
      <RegistrationMark style={{ top: 12, right: 0 }} color={INK.pink} />
      <RegistrationMark style={{ bottom: 12, left: 0 }} color={INK.yellow} />
      <RegistrationMark style={{ bottom: 12, right: 0 }} />

      {/* Decorative geometric shapes */}
      <HalftoneCircle
        color={INK.pink}
        size={200}
        dotSize={6}
        style={{ top: "10%", right: "-30px", zIndex: 0 }}
      />
      <HalftoneTriangle
        color={INK.yellow}
        size={140}
        style={{ bottom: "5%", left: "5%", zIndex: 0 }}
      />
      <HalftoneRect
        color={INK.navy}
        width={120}
        height={80}
        dotSize={5}
        style={{ top: "50%", right: "15%", zIndex: 0, transform: "rotate(8deg)" }}
      />

      {/* Ink splotches */}
      <InkSplotch color={INK.pink} size={100} style={{ top: "20%", left: "60%", opacity: 0.1 }} />
      <InkSplotch
        color={INK.yellow}
        size={70}
        style={{ bottom: "15%", right: "10%", opacity: 0.12 }}
      />

      {/* Hero content */}
      <motion.div
        className="relative z-[1]"
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Overline */}
        <p
          className="text-xs md:text-sm uppercase tracking-[0.35em] mb-6 font-[family-name:var(--font-space-grotesk)] font-bold"
          style={{ color: INK.overPinkNavy }}
        >
          AI Engineer & Creative Technologist
        </p>

        {/* Massive misregistered title */}
        <div className="mb-8">
          <MisregText
            as="h1"
            primaryColor={INK.pink}
            shadowColor={INK.navy}
            offsetX={3}
            offsetY={-2.5}
            className="text-[clamp(3rem,10vw,7rem)] leading-[0.88] font-black uppercase font-[family-name:var(--font-space-grotesk)] tracking-tight"
          >
            {"Building\nthe Future\nwith AI"}
          </MisregText>
        </div>

        {/* Subtitle */}
        <p
          className="max-w-xl text-base md:text-lg leading-relaxed font-[family-name:var(--font-inter)]"
          style={{ color: INK.navyMuted }}
        >
          Full-stack engineer specializing in multi-model AI orchestration,
          computer vision, and creative generation systems. Shipping production AI
          products from concept to deployment.
        </p>

        {/* Decorative divider: row of halftone dots */}
        <div className="mt-10 h-3 max-w-xs" style={{ ...halftone(INK.pink, 6), opacity: 0.5 }} />
      </motion.div>

      {/* Overprint shape: pink circle + navy rect overlapping */}
      <div
        className="absolute hidden md:block"
        style={{ bottom: 30, right: 60, zIndex: 0 }}
      >
        <div
          style={{
            width: 90,
            height: 90,
            borderRadius: "50%",
            background: INK.pink,
            opacity: 0.2,
            mixBlendMode: "multiply",
            position: "absolute",
            left: 0,
            top: 0,
          }}
        />
        <div
          style={{
            width: 70,
            height: 70,
            background: INK.navy,
            opacity: 0.2,
            mixBlendMode: "multiply",
            position: "absolute",
            left: 30,
            top: 25,
          }}
        />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   S T A T S   B A R
   ═══════════════════════════════════════════ */
function StatsBar() {
  return (
    <Reveal>
      <div
        className="relative flex flex-wrap justify-center gap-8 md:gap-16 py-8 md:py-10 border-t-2 border-b-2 mb-20 md:mb-28"
        style={{ borderColor: INK.navy }}
      >
        <HalftoneOverlay color={INK.yellow} size={10} opacity={0.05} />
        {stats.map((s, i) => (
          <div key={s.label} className="relative text-center z-[1]">
            {/* Misregistered stat value */}
            <span className="relative inline-block">
              <span
                aria-hidden="true"
                className="absolute inset-0 text-3xl md:text-5xl font-black font-[family-name:var(--font-space-grotesk)] select-none"
                style={{
                  color: INK.navy,
                  transform: "translate(1.5px, -1px)",
                  mixBlendMode: "multiply",
                }}
              >
                {s.value}
              </span>
              <span
                className="relative text-3xl md:text-5xl font-black font-[family-name:var(--font-space-grotesk)]"
                style={{ color: INK.pink, mixBlendMode: "multiply" }}
              >
                {s.value}
              </span>
            </span>
            <p
              className="text-xs uppercase tracking-[0.25em] mt-2 font-[family-name:var(--font-space-grotesk)] font-bold"
              style={{ color: INK.navyMuted }}
            >
              {s.label}
            </p>
          </div>
        ))}

        {/* Registration marks */}
        <RegistrationMark style={{ top: -12, left: -12 }} size={18} />
        <RegistrationMark style={{ top: -12, right: -12 }} size={18} color={INK.pink} />
      </div>
    </Reveal>
  );
}

/* ═══════════════════════════════════════════
   P R O J E C T S
   ═══════════════════════════════════════════ */
function ProjectsSection() {
  return (
    <section className="relative pb-20 md:pb-28">
      <Reveal>
        <SectionHeader>SELECTED WORK</SectionHeader>
      </Reveal>

      <div className="space-y-6 md:space-y-8">
        {projects.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}

/* ─── Project Card ─── */
function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const num = String(index + 1).padStart(2, "0");
  const isWide = index % 3 === 0;
  const accentColor = index % 2 === 0 ? INK.pink : INK.yellow;
  const dotPatternColor = index % 3 === 0 ? INK.pink : index % 3 === 1 ? INK.navy : INK.yellow;
  const dotSize = [4, 6, 8][index % 3];

  return (
    <motion.div
      ref={ref}
      className={`relative ${isWide ? "w-full" : "w-full md:w-[calc(50%-16px)] md:inline-block md:align-top"}`}
      style={!isWide && index % 3 !== 0 ? { marginLeft: index % 2 === 1 ? 0 : undefined } : {}}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
        delay: (index % 3) * 0.08,
      }}
    >
      <div
        className="group relative border-2 p-6 md:p-8 overflow-hidden cursor-default transition-all duration-300"
        style={{
          borderColor: INK.navy,
          background: INK.paper,
        }}
      >
        {/* Halftone pattern background behind card */}
        <div
          className="absolute inset-0 z-0 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-500"
          style={halftone(dotPatternColor, dotSize)}
        />

        {/* Misregistered accent shape — small offset circle */}
        <div className="absolute top-4 right-4 z-0">
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: accentColor,
              opacity: 0.3,
              mixBlendMode: "multiply",
            }}
          />
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: INK.navy,
              opacity: 0.2,
              mixBlendMode: "multiply",
              position: "absolute",
              top: 3,
              left: 3,
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-[1]">
          {/* Row: Number + Year + Client */}
          <div className="flex items-baseline gap-4 mb-4">
            <span
              className="text-3xl md:text-4xl font-black font-[family-name:var(--font-space-grotesk)]"
              style={{ color: INK.pink, lineHeight: 1 }}
            >
              {num}
            </span>
            <span
              className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-[family-name:var(--font-space-grotesk)] font-bold"
              style={{ color: INK.navyMuted }}
            >
              {project.client} / {project.year}
            </span>
          </div>

          {/* Title with yellow highlight on hover */}
          <div className="relative inline-block mb-4">
            {/* Hover: yellow highlight bar slides in from left */}
            <div
              className="absolute left-[-4px] right-[-6px] bottom-[2px] h-[35%] z-0 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-400 ease-out"
              style={{
                background: INK.yellow,
                mixBlendMode: "multiply",
                opacity: 0.6,
              }}
            />
            <h3
              className="relative z-[1] text-xl md:text-2xl font-black uppercase leading-tight font-[family-name:var(--font-space-grotesk)]"
              style={{ color: INK.navy, whiteSpace: "pre-line" }}
            >
              {project.title}
            </h3>
          </div>

          {/* Description */}
          <p
            className="text-sm md:text-[15px] leading-relaxed mb-5 max-w-2xl font-[family-name:var(--font-inter)]"
            style={{ color: INK.navyMuted }}
          >
            {project.description}
          </p>

          {/* Technical detail */}
          <p
            className="text-xs md:text-[13px] leading-relaxed mb-5 max-w-2xl font-[family-name:var(--font-inter)]"
            style={{ color: "rgba(26,26,94,0.4)" }}
          >
            {project.technical}
          </p>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="text-[10px] md:text-[11px] uppercase tracking-wider font-bold px-2.5 py-1 border font-[family-name:var(--font-space-grotesk)]"
                style={{
                  borderColor: INK.navy,
                  color: INK.navy,
                  background: "transparent",
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
              className="inline-block mt-4 text-xs uppercase tracking-[0.2em] font-bold font-[family-name:var(--font-space-grotesk)] underline decoration-1 underline-offset-4 hover:no-underline transition-all"
              style={{ color: INK.overPinkNavy }}
            >
              View Source
            </a>
          )}
        </div>

        {/* Registration mark bottom-left of card */}
        {index % 4 === 0 && (
          <RegistrationMark
            style={{ bottom: 6, left: 6 }}
            size={14}
            color={INK.navyMuted}
          />
        )}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   E X P E R T I S E
   ═══════════════════════════════════════════ */
function ExpertiseSection() {
  return (
    <section className="relative py-20 md:py-28">
      {/* Section halftone backdrop */}
      <div className="absolute inset-0 -mx-5 md:-mx-8">
        <HalftoneOverlay color={INK.navy} size={10} opacity={0.025} />
      </div>

      <Reveal>
        <SectionHeader>EXPERTISE</SectionHeader>
      </Reveal>

      <div className="relative z-[1] grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
        {expertise.map((item, i) => (
          <ExpertiseCard key={item.title} item={item} index={i} />
        ))}
      </div>

      {/* Registration marks */}
      <RegistrationMark style={{ top: 20, right: 0 }} size={20} color={INK.pink} />
      <RegistrationMark style={{ bottom: 20, left: 0 }} size={20} color={INK.yellow} />
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
  const num = String(index + 1).padStart(2, "0");
  const dotColor = [INK.pink, INK.navy, INK.yellow, INK.overPinkNavy][index % 4];
  const dotSize = [4, 6, 8, 5][index % 4];

  return (
    <motion.div
      ref={ref}
      className="group relative border-2 p-6 md:p-7 overflow-hidden"
      style={{ borderColor: INK.navy, background: INK.paper }}
      initial={{ opacity: 0, y: 25 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
    >
      {/* Halftone on hover */}
      <div
        className="absolute inset-0 z-0 opacity-0 group-hover:opacity-[0.06] transition-opacity duration-500"
        style={halftone(dotColor, dotSize)}
      />

      <div className="relative z-[1]">
        {/* Number + Title row */}
        <div className="flex items-baseline gap-3 mb-3">
          <span
            className="text-2xl md:text-3xl font-black font-[family-name:var(--font-space-grotesk)]"
            style={{ color: INK.pink, lineHeight: 1 }}
          >
            {num}
          </span>
          <h3
            className="text-sm md:text-base font-black uppercase tracking-wide font-[family-name:var(--font-space-grotesk)]"
            style={{ color: INK.navy }}
          >
            {item.title}
          </h3>
        </div>

        <p
          className="text-sm leading-relaxed font-[family-name:var(--font-inter)]"
          style={{ color: INK.navyMuted }}
        >
          {item.body}
        </p>
      </div>

      {/* Misregistered corner decoration */}
      <div className="absolute top-3 right-3 pointer-events-none">
        <div
          style={{
            width: 16,
            height: 16,
            background: dotColor,
            opacity: 0.2,
            mixBlendMode: "multiply",
          }}
        />
        <div
          style={{
            width: 16,
            height: 16,
            background: INK.navy,
            opacity: 0.15,
            mixBlendMode: "multiply",
            position: "absolute",
            top: 2,
            left: 2,
          }}
        />
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   T O O L S
   ═══════════════════════════════════════════ */
function ToolsSection() {
  const inkColors = [INK.pink, INK.navy, INK.yellow, INK.overPinkNavy, INK.overYellowNavy, INK.pink];

  return (
    <section className="relative py-20 md:py-28 border-t-2" style={{ borderColor: INK.navy }}>
      <Reveal>
        <SectionHeader>TOOLKIT</SectionHeader>
      </Reveal>

      <div className="relative z-[1] grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
        {tools.map((group, gi) => {
          const barColor = inkColors[gi % inkColors.length];

          return (
            <Reveal key={group.label} delay={gi * 0.07}>
              <div
                className="border-2 overflow-hidden"
                style={{ borderColor: INK.navy, background: INK.paper }}
              >
                {/* Color header bar */}
                <div
                  className="px-4 py-2.5"
                  style={{ background: barColor, mixBlendMode: "multiply" }}
                >
                  <h4
                    className="text-[11px] md:text-xs uppercase tracking-[0.25em] font-black font-[family-name:var(--font-space-grotesk)]"
                    style={{
                      color: barColor === INK.yellow ? INK.navy : INK.paper,
                    }}
                  >
                    {group.label}
                  </h4>
                </div>

                {/* Items */}
                <div className="px-4 py-3 space-y-1.5">
                  {group.items.map((item) => (
                    <p
                      key={item}
                      className="text-xs md:text-sm font-[family-name:var(--font-inter)]"
                      style={{ color: INK.navy }}
                    >
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* Decorative ink splotch */}
      <InkSplotch
        color={INK.pink}
        size={60}
        style={{ bottom: 30, right: 20, opacity: 0.08 }}
      />
      <InkSplotch
        color={INK.yellow}
        size={45}
        style={{ top: 80, left: -10, opacity: 0.1 }}
      />
    </section>
  );
}

/* ═══════════════════════════════════════════
   F O O T E R
   ═══════════════════════════════════════════ */
function FooterSection() {
  return (
    <footer className="relative pt-16 md:pt-24 pb-32 md:pb-36">
      {/* Top border with halftone strip */}
      <div
        className="h-2 w-full mb-12 md:mb-16"
        style={{ ...halftone(INK.pink, 4), opacity: 0.35 }}
      />

      <Reveal>
        <div className="relative">
          {/* Registration marks */}
          <RegistrationMark style={{ top: -20, left: 0 }} size={20} color={INK.pink} />
          <RegistrationMark style={{ top: -20, right: 0 }} size={20} color={INK.navy} />

          {/* Big CTA */}
          <MisregText
            as="h2"
            primaryColor={INK.pink}
            shadowColor={INK.navy}
            offsetX={2}
            offsetY={-1.5}
            className="text-3xl md:text-5xl lg:text-6xl font-black uppercase font-[family-name:var(--font-space-grotesk)] tracking-tight leading-[0.95] mb-8"
          >
            {"Let's Build\nSomething"}
          </MisregText>

          <p
            className="max-w-lg text-sm md:text-base leading-relaxed mb-10 font-[family-name:var(--font-inter)]"
            style={{ color: INK.navyMuted }}
          >
            Looking for an AI engineer who ships production systems? I bring deep
            technical expertise across the full stack &mdash; from model orchestration
            to polished interfaces.
          </p>

          {/* Contact row */}
          <div className="flex flex-wrap gap-4 mb-16">
            {[
              { label: "GitHub", href: "https://github.com/1aday" },
              { label: "Email", href: "mailto:hello@example.com" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-block border-2 px-5 py-2.5 text-xs md:text-sm uppercase tracking-[0.2em] font-black font-[family-name:var(--font-space-grotesk)] transition-all duration-300 hover:translate-x-[1px] hover:translate-y-[-1px]"
                style={{
                  borderColor: INK.navy,
                  color: INK.navy,
                  background: INK.paper,
                }}
              >
                {/* Hover highlight */}
                <span
                  className="absolute inset-0 z-0 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                  style={{ background: INK.yellow, mixBlendMode: "multiply", opacity: 0.5 }}
                />
                <span className="relative z-[1]">{link.label}</span>
              </a>
            ))}
          </div>

          {/* Ink Color Legend */}
          <div className="border-t-2 pt-8" style={{ borderColor: INK.navy }}>
            <p
              className="text-[10px] uppercase tracking-[0.3em] mb-4 font-[family-name:var(--font-space-grotesk)] font-bold"
              style={{ color: INK.navyMuted }}
            >
              Ink Colors Used
            </p>
            <InkLegend />
          </div>

          {/* Printer info strip */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <p
              className="text-[10px] uppercase tracking-[0.2em] font-[family-name:var(--font-space-grotesk)]"
              style={{ color: "rgba(26,26,94,0.3)" }}
            >
              Printed on recycled cream stock / 3-color risograph / Edition of 1
            </p>
            <p
              className="text-[10px] uppercase tracking-[0.2em] font-[family-name:var(--font-space-grotesk)]"
              style={{ color: "rgba(26,26,94,0.3)" }}
            >
              MMXXV
            </p>
          </div>

          {/* Overprint decoration */}
          <div className="absolute bottom-[-20px] right-0 hidden md:block pointer-events-none">
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                background: INK.pink,
                opacity: 0.15,
                mixBlendMode: "multiply",
                position: "absolute",
                right: 0,
                top: 0,
              }}
            />
            <div
              style={{
                width: 50,
                height: 50,
                background: INK.yellow,
                opacity: 0.15,
                mixBlendMode: "multiply",
                position: "absolute",
                right: 15,
                top: 10,
              }}
            />
            <div
              style={{
                width: 40,
                height: 40,
                background: INK.navy,
                opacity: 0.12,
                mixBlendMode: "multiply",
                position: "absolute",
                right: 28,
                top: 20,
              }}
            />
          </div>
        </div>
      </Reveal>
    </footer>
  );
}
