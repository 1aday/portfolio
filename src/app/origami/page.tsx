"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";

/* ═══════════════════════════════════════════════════════════════
   ORIGAMI — Japanese Paper Fold Art Portfolio Theme
   ═══════════════════════════════════════════════════════════════ */

/* ─── Palette ─── */
const C = {
  bg: "#FAF8F5",
  fold: "#D4CFC7",
  crimson: "#C62828",
  charcoal: "#1A1A1A",
  white: "#FFFFFF",
  foldLight: "rgba(212,207,199,0.4)",
  foldMedium: "rgba(212,207,199,0.7)",
  charcoalMuted: "rgba(26,26,26,0.5)",
  charcoalLight: "rgba(26,26,26,0.08)",
  crimsonLight: "rgba(198,40,40,0.08)",
  crimsonMuted: "rgba(198,40,40,0.6)",
  shadow1: "rgba(26,26,26,0.04)",
  shadow2: "rgba(26,26,26,0.08)",
  shadow3: "rgba(26,26,26,0.14)",
};

/* ─── Paper Texture Overlay ─── */
function PaperTexture() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1]"
      style={{
        opacity: 0.025,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "256px 256px",
      }}
    />
  );
}

/* ─── Paper Crane SVG ─── */
function PaperCraneSVG({
  size = 280,
  color = C.crimson,
  opacity = 0.12,
  className = "",
  style = {},
}: {
  size?: number;
  color?: string;
  opacity?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      style={{ opacity, ...style }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Body — main diamond */}
      <polygon
        points="100,30 160,100 100,170 40,100"
        fill={color}
        opacity={0.15}
        stroke={color}
        strokeWidth={0.8}
      />
      {/* Body fold crease */}
      <line x1="100" y1="30" x2="100" y2="170" stroke={color} strokeWidth={0.5} opacity={0.4} />
      <line x1="40" y1="100" x2="160" y2="100" stroke={color} strokeWidth={0.5} opacity={0.4} />
      {/* Left wing */}
      <polygon
        points="40,100 100,30 5,65"
        fill={color}
        opacity={0.1}
        stroke={color}
        strokeWidth={0.8}
      />
      {/* Right wing */}
      <polygon
        points="160,100 100,30 195,65"
        fill={color}
        opacity={0.1}
        stroke={color}
        strokeWidth={0.8}
      />
      {/* Wing fold creases */}
      <line x1="40" y1="100" x2="52" y2="48" stroke={color} strokeWidth={0.4} opacity={0.3} />
      <line x1="160" y1="100" x2="148" y2="48" stroke={color} strokeWidth={0.4} opacity={0.3} />
      {/* Tail */}
      <polygon
        points="100,170 75,195 85,155"
        fill={color}
        opacity={0.1}
        stroke={color}
        strokeWidth={0.8}
      />
      {/* Tail inner fold */}
      <line x1="100" y1="170" x2="80" y2="175" stroke={color} strokeWidth={0.3} opacity={0.3} />
      {/* Head / neck */}
      <polygon
        points="100,170 130,195 118,158"
        fill={color}
        opacity={0.12}
        stroke={color}
        strokeWidth={0.8}
      />
      {/* Head tip */}
      <polygon
        points="130,195 142,198 135,188"
        fill={color}
        opacity={0.2}
        stroke={color}
        strokeWidth={0.8}
      />
      {/* Neck fold */}
      <line x1="100" y1="170" x2="124" y2="178" stroke={color} strokeWidth={0.3} opacity={0.3} />
      {/* Wing extension details */}
      <line x1="5" y1="65" x2="70" y2="65" stroke={color} strokeWidth={0.3} opacity={0.2} />
      <line x1="195" y1="65" x2="130" y2="65" stroke={color} strokeWidth={0.3} opacity={0.2} />
      {/* Inner body folds */}
      <line x1="70" y1="65" x2="100" y2="100" stroke={color} strokeWidth={0.3} opacity={0.25} />
      <line x1="130" y1="65" x2="100" y2="100" stroke={color} strokeWidth={0.3} opacity={0.25} />
      <line x1="70" y1="135" x2="100" y2="100" stroke={color} strokeWidth={0.3} opacity={0.2} />
      <line x1="130" y1="135" x2="100" y2="100" stroke={color} strokeWidth={0.3} opacity={0.2} />
    </svg>
  );
}

/* ─── Geometric Origami Section Divider ─── */
function OrigamiDivider({ flip = false }: { flip?: boolean }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });

  return (
    <motion.div
      ref={ref}
      className="flex justify-center items-center gap-3 py-8"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8 }}
    >
      {/* Left fold line */}
      <motion.div
        className="h-[1px]"
        style={{
          width: "60px",
          background: `linear-gradient(${flip ? "270deg" : "90deg"}, transparent, ${C.fold})`,
        }}
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
      />
      {/* Diamond shape */}
      <motion.div
        style={{
          width: "10px",
          height: "10px",
          background: C.crimson,
          transform: "rotate(45deg)",
          opacity: 0.5,
        }}
        initial={{ scale: 0, rotate: 0 }}
        animate={inView ? { scale: 1, rotate: 45 } : {}}
        transition={{ duration: 0.4, delay: 0.4 }}
      />
      {/* Center fold line */}
      <motion.div
        className="h-[1px]"
        style={{ width: "120px", background: C.fold }}
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.3 }}
      />
      {/* Diamond shape */}
      <motion.div
        style={{
          width: "10px",
          height: "10px",
          background: C.crimson,
          transform: "rotate(45deg)",
          opacity: 0.5,
        }}
        initial={{ scale: 0, rotate: 0 }}
        animate={inView ? { scale: 1, rotate: 45 } : {}}
        transition={{ duration: 0.4, delay: 0.4 }}
      />
      {/* Right fold line */}
      <motion.div
        className="h-[1px]"
        style={{
          width: "60px",
          background: `linear-gradient(${flip ? "90deg" : "270deg"}, transparent, ${C.fold})`,
        }}
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
      />
    </motion.div>
  );
}

/* ─── Folded Corner Effect ─── */
function FoldedCorner({
  size = 28,
  position = "top-right",
}: {
  size?: number;
  position?: "top-right" | "bottom-left" | "top-left" | "bottom-right";
}) {
  const positionStyles: Record<string, React.CSSProperties> = {
    "top-right": { top: 0, right: 0 },
    "bottom-left": { bottom: 0, left: 0 },
    "top-left": { top: 0, left: 0 },
    "bottom-right": { bottom: 0, right: 0 },
  };

  const trianglePaths: Record<string, string> = {
    "top-right": `polygon(100% 0, 0 0, 100% 100%)`,
    "bottom-left": `polygon(0 0, 0 100%, 100% 100%)`,
    "top-left": `polygon(0 0, 100% 0, 0 100%)`,
    "bottom-right": `polygon(100% 0, 0 100%, 100% 100%)`,
  };

  const shadowAngle: Record<string, string> = {
    "top-right": "225deg",
    "bottom-left": "45deg",
    "top-left": "315deg",
    "bottom-right": "135deg",
  };

  return (
    <div
      className="absolute z-10 pointer-events-none transition-all duration-500"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        ...positionStyles[position],
      }}
    >
      {/* The fold shadow beneath */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: trianglePaths[position],
          background: `linear-gradient(${shadowAngle[position]}, ${C.shadow3}, transparent)`,
        }}
      />
      {/* The folded paper triangle */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: trianglePaths[position],
          background: `linear-gradient(${shadowAngle[position]}, ${C.fold}, ${C.bg})`,
        }}
      />
    </div>
  );
}

/* ─── Section Header ─── */
function SectionHeader({
  children,
  subtitle,
}: {
  children: React.ReactNode;
  subtitle?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className="relative mb-16"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7 }}
    >
      {/* Crimson accent line */}
      <motion.div
        className="mb-4"
        style={{ width: "40px", height: "2px", background: C.crimson }}
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.3 }}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...({ style: { transformOrigin: "left" } } as any)}
      />
      <h2
        className="text-3xl md:text-4xl tracking-tight font-[family-name:var(--font-jakarta)]"
        style={{ color: C.charcoal, fontWeight: 600 }}
      >
        {children}
      </h2>
      {subtitle && (
        <p
          className="mt-2 text-sm tracking-wide font-[family-name:var(--font-inter)]"
          style={{ color: C.charcoalMuted }}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

/* ─── Paper Settle Animation Wrapper ─── */
function PaperSettle({
  children,
  index = 0,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  index?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ perspective: "1200px", ...style }}
      initial={{
        opacity: 0,
        rotateX: 15,
        y: 40,
      }}
      animate={
        inView
          ? {
              opacity: 1,
              rotateX: 0,
              y: 0,
            }
          : {}
      }
      transition={{
        duration: 0.7,
        delay: (index % 4) * 0.1,
        ease: [0.23, 1, 0.32, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   NAVIGATION
   ═══════════════════════════════════════════════════════════════ */
function Navigation() {
  const links = [
    { label: "Projects", href: "#projects" },
    { label: "Expertise", href: "#expertise" },
    { label: "Tools", href: "#tools" },
  ];

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg"
      style={{
        background: "rgba(250,248,245,0.90)",
        borderBottom: `1px solid ${C.foldLight}`,
      }}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          className="text-xl tracking-[0.08em] font-[family-name:var(--font-jakarta)]"
          style={{ color: C.charcoal, fontWeight: 700 }}
        >
          GROX
          <span
            className="inline-block w-1.5 h-1.5 ml-1 rounded-none"
            style={{
              background: C.crimson,
              transform: "rotate(45deg) translateY(-2px)",
              display: "inline-block",
            }}
          />
        </a>

        {/* Nav links */}
        <div className="flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs tracking-[0.18em] uppercase font-[family-name:var(--font-inter)] transition-colors duration-300"
              style={{ color: C.charcoalMuted }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.crimson)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.charcoalMuted)}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════════════════════════════ */
function HeroSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
      style={{ background: C.bg }}
    >
      {/* Large paper crane decoration — top right */}
      <motion.div
        className="absolute top-16 right-[-40px] md:right-8 lg:right-16 pointer-events-none"
        initial={{ opacity: 0, x: 60, rotate: -10 }}
        animate={inView ? { opacity: 1, x: 0, rotate: 0 } : {}}
        transition={{ duration: 1.2, delay: 0.5, ease: [0.23, 1, 0.32, 1] }}
      >
        <PaperCraneSVG size={320} opacity={0.08} color={C.crimson} />
      </motion.div>

      {/* Smaller crane — bottom left */}
      <motion.div
        className="absolute bottom-24 left-[-20px] md:left-12 pointer-events-none"
        initial={{ opacity: 0, x: -40, rotate: 15 }}
        animate={inView ? { opacity: 1, x: 0, rotate: 8 } : {}}
        transition={{ duration: 1, delay: 0.8, ease: [0.23, 1, 0.32, 1] }}
      >
        <PaperCraneSVG size={160} opacity={0.05} color={C.charcoal} style={{ transform: "scaleX(-1)" }} />
      </motion.div>

      {/* Diagonal fold lines across the hero */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(135deg, transparent 48.5%, ${C.foldLight} 49%, ${C.foldLight} 49.5%, transparent 50%),
            linear-gradient(135deg, transparent 73.5%, ${C.foldLight} 74%, ${C.foldLight} 74.3%, transparent 74.8%)
          `,
        }}
      />

      {/* Content */}
      <div className="relative z-[2] max-w-3xl text-center">
        {/* Subtitle */}
        <motion.p
          className="text-xs tracking-[0.35em] uppercase mb-6 font-[family-name:var(--font-inter)]"
          style={{ color: C.charcoalMuted }}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          AI Product Engineer
        </motion.p>

        {/* Main title */}
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl leading-[1.08] mb-6 font-[family-name:var(--font-jakarta)]"
          style={{ color: C.charcoal, fontWeight: 700 }}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Precision-folded
          <br />
          <span style={{ color: C.crimson }}>digital craft</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          className="text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-12 font-[family-name:var(--font-inter)]"
          style={{ color: C.charcoalMuted }}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          I turn AI models into products people use — each project folded
          with the care and intention of paper meeting purpose.
        </motion.p>

        {/* Stats as folded paper tabs */}
        <motion.div
          className="flex justify-center items-center gap-6 md:gap-10"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="relative group"
              initial={{ opacity: 0, rotateX: 30 }}
              animate={inView ? { opacity: 1, rotateX: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.9 + i * 0.12 }}
              style={{ perspective: "600px" }}
            >
              <div
                className="relative px-6 py-4"
                style={{
                  background: C.white,
                  boxShadow: `0 2px 8px ${C.shadow2}, 0 1px 2px ${C.shadow1}`,
                }}
              >
                {/* Fold crease */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, transparent 45%, ${C.foldLight} 50%, transparent 55%)`,
                  }}
                />
                <FoldedCorner size={16} position="top-right" />
                <div
                  className="text-2xl md:text-3xl font-[family-name:var(--font-jakarta)]"
                  style={{ color: C.charcoal, fontWeight: 700 }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-[10px] tracking-[0.2em] uppercase mt-1 font-[family-name:var(--font-inter)]"
                  style={{ color: C.charcoalMuted }}
                >
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 1.4 }}
      >
        <span
          className="text-[10px] tracking-[0.3em] uppercase font-[family-name:var(--font-inter)]"
          style={{ color: C.charcoalMuted }}
        >
          Unfold
        </span>
        <motion.div
          style={{
            width: "8px",
            height: "8px",
            borderRight: `1px solid ${C.charcoalMuted}`,
            borderBottom: `1px solid ${C.charcoalMuted}`,
            transform: "rotate(45deg)",
          }}
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PROJECT CARD
   ═══════════════════════════════════════════════════════════════ */
function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  // Alternate diagonal fold direction
  const foldAngle = index % 2 === 0 ? "135deg" : "225deg";
  const cornerPos: "top-right" | "bottom-left" = index % 2 === 0 ? "top-right" : "bottom-left";

  return (
    <motion.div
      ref={ref}
      className="relative group"
      style={{ perspective: "1000px" }}
      initial={{ opacity: 0, rotateX: 12, y: 50 }}
      animate={
        inView
          ? { opacity: 1, rotateX: 0, y: 0 }
          : {}
      }
      transition={{
        duration: 0.7,
        delay: (index % 3) * 0.12,
        ease: [0.23, 1, 0.32, 1],
      }}
      whileHover={{
        y: -6,
        transition: { duration: 0.3 },
      }}
    >
      <div
        className="relative overflow-hidden transition-shadow duration-500"
        style={{
          background: C.white,
          boxShadow: `0 2px 12px ${C.shadow2}, 0 1px 3px ${C.shadow1}`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = `0 12px 40px ${C.shadow3}, 0 4px 12px ${C.shadow2}`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = `0 2px 12px ${C.shadow2}, 0 1px 3px ${C.shadow1}`;
        }}
      >
        {/* Diagonal fold line across card */}
        <div
          className="absolute inset-0 pointer-events-none z-[2]"
          style={{
            background: `linear-gradient(${foldAngle}, transparent 46%, ${C.foldLight} 49.5%, ${C.foldMedium} 50%, ${C.foldLight} 50.5%, transparent 54%)`,
          }}
        />

        {/* Folded corner */}
        <div className="transition-all duration-500 group-hover:scale-125">
          <FoldedCorner size={32} position={cornerPos} />
        </div>

        {/* Image area */}
        <div className="relative overflow-hidden" style={{ aspectRatio: "16/10" }}>
          <img
            src={project.image}
            alt={project.title.replace("\n", " ")}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Crimson accent line reveal on hover */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[3px] transition-transform duration-500 origin-left scale-x-0 group-hover:scale-x-100"
            style={{ background: C.crimson }}
          />

          {/* Year badge */}
          <div
            className="absolute top-3 right-3 px-2.5 py-1 text-[10px] tracking-[0.15em] uppercase font-[family-name:var(--font-inter)]"
            style={{
              background: C.charcoal,
              color: C.bg,
            }}
          >
            {project.year}
          </div>

          {/* Client badge */}
          <div
            className="absolute top-3 left-3 px-2.5 py-1 text-[10px] tracking-[0.12em] uppercase font-[family-name:var(--font-inter)]"
            style={{
              background: "rgba(250,248,245,0.92)",
              color: C.charcoalMuted,
              backdropFilter: "blur(4px)",
            }}
          >
            {project.client}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 md:p-6">
          <h3
            className="text-lg leading-tight mb-2 font-[family-name:var(--font-jakarta)]"
            style={{ color: C.charcoal, fontWeight: 600 }}
          >
            {project.title.replace("\n", " ")}
          </h3>

          <p
            className="text-sm leading-relaxed mb-4 font-[family-name:var(--font-inter)]"
            style={{ color: C.charcoalMuted }}
          >
            {project.description}
          </p>

          {/* Technical detail */}
          <p
            className="text-xs leading-relaxed mb-4 font-[family-name:var(--font-inter)]"
            style={{
              color: C.charcoalMuted,
              opacity: 0.7,
              borderLeft: `2px solid ${C.foldMedium}`,
              paddingLeft: "12px",
            }}
          >
            {project.technical}
          </p>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-1.5">
            {project.tech.map((t) => (
              <span
                key={t}
                className="text-[10px] tracking-[0.08em] px-2.5 py-1 font-[family-name:var(--font-inter)] transition-colors duration-300"
                style={{
                  background: C.charcoalLight,
                  color: C.charcoal,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = C.crimsonLight;
                  e.currentTarget.style.color = C.crimson;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = C.charcoalLight;
                  e.currentTarget.style.color = C.charcoal;
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
              className="inline-flex items-center gap-1.5 mt-4 text-xs tracking-[0.1em] uppercase font-[family-name:var(--font-inter)] transition-colors duration-300"
              style={{ color: C.charcoalMuted }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.crimson)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.charcoalMuted)}
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              Source
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PROJECTS SECTION
   ═══════════════════════════════════════════════════════════════ */
function ProjectsSection() {
  return (
    <section id="projects" className="relative py-24 px-6" style={{ background: C.bg }}>
      {/* Background fold crease */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, transparent 24%, ${C.foldLight} 24.5%, transparent 25%)`,
        }}
      />

      <div className="relative z-[2] max-w-6xl mx-auto">
        <SectionHeader subtitle="Each project carefully folded from concept to completion">
          Selected Work
        </SectionHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   EXPERTISE SECTION — Paper Panels with Folded Corners
   ═══════════════════════════════════════════════════════════════ */
function ExpertiseSection() {
  return (
    <section id="expertise" className="relative py-24 px-6" style={{ background: C.bg }}>
      <div className="max-w-5xl mx-auto">
        <SectionHeader subtitle="Disciplines refined through practice">
          Expertise
        </SectionHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {expertise.map((item, i) => {
            const corners: Array<"top-right" | "bottom-left" | "top-left" | "bottom-right"> = [
              "top-right",
              "bottom-left",
              "top-left",
              "bottom-right",
            ];
            const corner = corners[i % corners.length];
            const foldAngles = ["135deg", "315deg", "225deg", "45deg"];

            return (
              <PaperSettle key={item.title} index={i}>
                <motion.div
                  className="relative group p-6 md:p-8 transition-shadow duration-500"
                  style={{
                    background: C.white,
                    boxShadow: `0 2px 8px ${C.shadow1}, 0 1px 3px ${C.shadow1}`,
                  }}
                  whileHover={{
                    y: -4,
                    transition: { duration: 0.3 },
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 8px 30px ${C.shadow3}, 0 3px 10px ${C.shadow2}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = `0 2px 8px ${C.shadow1}, 0 1px 3px ${C.shadow1}`;
                  }}
                >
                  {/* Diagonal fold crease */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `linear-gradient(${foldAngles[i % 4]}, transparent 40%, ${C.foldLight} 50%, transparent 60%)`,
                      opacity: 0.5,
                    }}
                  />

                  {/* Folded corner with hover animation */}
                  <div className="transition-all duration-500 group-hover:scale-150">
                    <FoldedCorner size={36} position={corner} />
                  </div>

                  {/* Number index */}
                  <div
                    className="text-[80px] leading-none font-[family-name:var(--font-jakarta)] absolute top-2 right-4 pointer-events-none select-none"
                    style={{
                      color: C.crimson,
                      opacity: 0.04,
                      fontWeight: 800,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  {/* Crimson accent dot */}
                  <div
                    className="w-2 h-2 mb-4 transition-transform duration-300 group-hover:scale-150"
                    style={{
                      background: C.crimson,
                      transform: "rotate(45deg)",
                    }}
                  />

                  <h3
                    className="text-lg md:text-xl mb-3 font-[family-name:var(--font-jakarta)]"
                    style={{ color: C.charcoal, fontWeight: 600 }}
                  >
                    {item.title}
                  </h3>

                  <p
                    className="text-sm leading-relaxed font-[family-name:var(--font-inter)]"
                    style={{ color: C.charcoalMuted }}
                  >
                    {item.body}
                  </p>

                  {/* Bottom fold shadow hint */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-[1px]"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${C.fold}, transparent)`,
                    }}
                  />
                </motion.div>
              </PaperSettle>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TOOLS SECTION — Pattern Sheet Grid
   ═══════════════════════════════════════════════════════════════ */
function ToolsSection() {
  return (
    <section id="tools" className="relative py-24 px-6" style={{ background: C.bg }}>
      {/* Pattern sheet background — subtle grid lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(${C.foldLight} 1px, transparent 1px),
            linear-gradient(90deg, ${C.foldLight} 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          opacity: 0.5,
        }}
      />

      {/* Diagonal fold marks on the pattern sheet */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(45deg, transparent 49.5%, ${C.foldLight} 49.8%, ${C.foldLight} 50.2%, transparent 50.5%),
            linear-gradient(-45deg, transparent 49.5%, ${C.foldLight} 49.8%, ${C.foldLight} 50.2%, transparent 50.5%)
          `,
          opacity: 0.3,
        }}
      />

      <div className="relative z-[2] max-w-5xl mx-auto">
        <SectionHeader subtitle="The tools that shape the fold">
          Pattern Sheet
        </SectionHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {tools.map((category, i) => (
            <PaperSettle key={category.label} index={i}>
              <motion.div
                className="relative group p-5 md:p-6 transition-all duration-500"
                style={{
                  background: C.white,
                  boxShadow: `0 1px 6px ${C.shadow1}`,
                }}
                whileHover={{
                  y: -3,
                  transition: { duration: 0.25 },
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 8px 24px ${C.shadow2}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = `0 1px 6px ${C.shadow1}`;
                }}
              >
                {/* Subtle fold line */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `linear-gradient(${
                      i % 2 === 0 ? "135deg" : "225deg"
                    }, transparent 42%, ${C.foldLight} 50%, transparent 58%)`,
                    opacity: 0.4,
                  }}
                />

                <FoldedCorner
                  size={20}
                  position={i % 2 === 0 ? "top-right" : "bottom-left"}
                />

                {/* Category label */}
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="w-1.5 h-1.5"
                    style={{
                      background: C.crimson,
                      transform: "rotate(45deg)",
                    }}
                  />
                  <h4
                    className="text-xs tracking-[0.2em] uppercase font-[family-name:var(--font-jakarta)]"
                    style={{ color: C.charcoalMuted, fontWeight: 600 }}
                  >
                    {category.label}
                  </h4>
                </div>

                {/* Tool items */}
                <div className="flex flex-wrap gap-2">
                  {category.items.map((item) => (
                    <span
                      key={item}
                      className="text-[11px] px-3 py-1.5 font-[family-name:var(--font-inter)] transition-all duration-300 cursor-default"
                      style={{
                        color: C.charcoal,
                        background: C.bg,
                        border: `1px solid ${C.foldLight}`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = C.crimsonLight;
                        e.currentTarget.style.borderColor = C.crimsonMuted;
                        e.currentTarget.style.color = C.crimson;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = C.bg;
                        e.currentTarget.style.borderColor = C.foldLight;
                        e.currentTarget.style.color = C.charcoal;
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>

                {/* Bottom accent line */}
                <div
                  className="absolute bottom-0 left-0 w-0 h-[2px] transition-all duration-500 group-hover:w-full"
                  style={{ background: C.crimson }}
                />
              </motion.div>
            </PaperSettle>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════════════ */
function Footer() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <footer ref={ref} className="relative py-20 px-6" style={{ background: C.bg }}>
      {/* Top divider — origami fold */}
      <div
        className="max-w-5xl mx-auto mb-16"
        style={{
          height: "1px",
          background: `linear-gradient(90deg, transparent, ${C.fold}, ${C.crimsonMuted}, ${C.fold}, transparent)`,
        }}
      />

      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center text-center">
          {/* Paper crane icon */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <PaperCraneSVG size={80} opacity={0.15} color={C.crimson} />
          </motion.div>

          {/* Footer text */}
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p
              className="text-lg font-[family-name:var(--font-jakarta)] mb-2"
              style={{ color: C.charcoal, fontWeight: 600 }}
            >
              GROX
            </p>
            <p
              className="text-xs tracking-[0.2em] uppercase font-[family-name:var(--font-inter)]"
              style={{ color: C.charcoalMuted }}
            >
              Crafted with precision &bull; 2025
            </p>
          </motion.div>

          {/* Small origami diamonds */}
          <motion.div
            className="flex items-center gap-3 mt-8"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === 2 ? "8px" : "5px",
                  height: i === 2 ? "8px" : "5px",
                  background: i === 2 ? C.crimson : C.fold,
                  transform: "rotate(45deg)",
                  opacity: i === 2 ? 0.6 : 0.4,
                }}
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Theme Switcher */}
      <div className="mt-16">
        <ThemeSwitcher current="/origami" variant="light" />
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function OrigamiPage() {
  return (
    <main
      className="relative min-h-screen font-[family-name:var(--font-inter)]"
      style={{ background: C.bg, color: C.charcoal }}
    >
      <PaperTexture />
      <Navigation />
      <HeroSection />
      <OrigamiDivider />
      <ProjectsSection />
      <OrigamiDivider flip />
      <ExpertiseSection />
      <OrigamiDivider />
      <ToolsSection />
      <Footer />
    </main>
  );
}
