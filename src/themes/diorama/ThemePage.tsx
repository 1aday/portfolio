"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "@/app/data/projects";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";

/* ─── Colors ─── */
const C = {
  bg: "#E8DED0",
  layer1: "#B8C9D9",
  layer2: "#A8BFA0",
  layer3: "#DDD0BC",
  layer4: "#F5F1EB",
  accent: "#FF6B35",
  mountain: "#2D4A3E",
  text: "#2D2824",
  shadow: "rgba(0,0,0,0.15)",
  shadowDeep: "rgba(0,0,0,0.25)",
  white: "#FFFFFF",
  paperEdge: "rgba(255,255,255,0.7)",
};

/* ─── Paper texture CSS (kraft paper grain) ─── */
const paperTexture = `
  radial-gradient(ellipse at 20% 50%, rgba(139,119,101,0.04) 0%, transparent 50%),
  radial-gradient(ellipse at 80% 20%, rgba(139,119,101,0.03) 0%, transparent 50%),
  radial-gradient(ellipse at 40% 80%, rgba(139,119,101,0.04) 0%, transparent 50%),
  repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(139,119,101,0.015) 2px,
    rgba(139,119,101,0.015) 4px
  ),
  repeating-linear-gradient(
    90deg,
    transparent,
    transparent 3px,
    rgba(139,119,101,0.01) 3px,
    rgba(139,119,101,0.01) 6px
  )
`;

/* ─── Paper cut edge style ─── */
const paperCutEdge = {
  borderTop: `1.5px solid ${C.paperEdge}`,
  boxShadow: `0 4px 12px ${C.shadow}, 0 1px 0 ${C.paperEdge} inset`,
};

const paperCutEdgeDeep = {
  borderTop: `1.5px solid ${C.paperEdge}`,
  boxShadow: `0 8px 24px ${C.shadowDeep}, 0 2px 0 ${C.paperEdge} inset`,
};

/* ─── SVG Mountain Layers ─── */
function MountainBack() {
  return (
    <svg
      viewBox="0 0 1000 300"
      preserveAspectRatio="none"
      className="w-full h-full"
      style={{ filter: `drop-shadow(0 4px 8px ${C.shadow})` }}
    >
      <path
        d="M0 300 L0 180 Q50 140 100 160 Q150 100 200 130 Q250 80 300 110 Q350 60 400 90 Q450 50 500 70 Q550 40 600 80 Q650 60 700 100 Q750 70 800 120 Q850 90 900 140 Q950 110 1000 150 L1000 300 Z"
        fill={C.layer1}
      />
    </svg>
  );
}

function MountainMid() {
  return (
    <svg
      viewBox="0 0 1000 300"
      preserveAspectRatio="none"
      className="w-full h-full"
      style={{ filter: `drop-shadow(0 6px 12px ${C.shadow})` }}
    >
      <path
        d="M0 300 L0 200 Q80 170 160 190 Q240 130 320 170 Q400 110 480 150 Q560 100 640 140 Q720 120 800 160 Q880 140 960 180 L1000 170 L1000 300 Z"
        fill={C.layer2}
      />
      {/* Tree silhouettes */}
      <g fill={C.mountain} opacity="0.6">
        <polygon points="150,190 155,160 160,190" />
        <polygon points="158,190 163,155 168,190" />
        <polygon points="320,170 326,135 332,170" />
        <polygon points="330,170 336,140 342,170" />
        <polygon points="335,170 340,145 345,170" />
        <polygon points="500,150 506,120 512,150" />
        <polygon points="510,150 516,115 522,150" />
        <polygon points="700,160 706,130 712,160" />
        <polygon points="710,160 716,125 722,160" />
        <polygon points="715,160 720,135 725,160" />
        <polygon points="880,180 886,150 892,180" />
      </g>
    </svg>
  );
}

function MountainFront() {
  return (
    <svg
      viewBox="0 0 1000 300"
      preserveAspectRatio="none"
      className="w-full h-full"
      style={{ filter: `drop-shadow(0 8px 16px ${C.shadowDeep})` }}
    >
      <path
        d="M0 300 L0 230 Q100 210 200 225 Q300 200 400 220 Q500 195 600 215 Q700 200 800 225 Q900 210 1000 230 L1000 300 Z"
        fill={C.layer3}
      />
      {/* Grass/bush details */}
      <g fill={C.mountain} opacity="0.3">
        <ellipse cx="100" cy="228" rx="15" ry="8" />
        <ellipse cx="300" cy="218" rx="12" ry="6" />
        <ellipse cx="550" cy="212" rx="18" ry="8" />
        <ellipse cx="750" cy="222" rx="14" ry="7" />
        <ellipse cx="920" cy="226" rx="16" ry="7" />
      </g>
    </svg>
  );
}

/* ─── Sun Cutout ─── */
function SunCutout() {
  return (
    <div
      className="absolute"
      style={{
        width: 80,
        height: 80,
        top: 40,
        right: "15%",
        borderRadius: "50%",
        background: `radial-gradient(circle, #FFD699 0%, ${C.accent} 100%)`,
        boxShadow: `0 0 40px rgba(255,107,53,0.3), 0 4px 8px ${C.shadow}`,
        border: `1.5px solid rgba(255,255,255,0.4)`,
      }}
    />
  );
}

/* ─── Paper Bird Silhouettes ─── */
function PaperBird({
  x,
  y,
  size,
  delay,
  duration,
}: {
  x: string;
  y: string;
  size: number;
  delay: number;
  duration: number;
}) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: y, zIndex: 15 }}
      animate={{
        x: [0, 60, 120, 80, 0],
        y: [0, -15, -5, 10, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg
        width={size}
        height={size * 0.5}
        viewBox="0 0 30 15"
        fill="none"
        style={{ filter: `drop-shadow(1px 2px 2px ${C.shadow})` }}
      >
        <path
          d="M0 8 Q7 0 15 6 Q23 0 30 8"
          stroke={C.mountain}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  );
}

/* ─── Paper Butterfly ─── */
function PaperButterfly({
  x,
  y,
  delay,
}: {
  x: string;
  y: string;
  delay: number;
}) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: y, zIndex: 20 }}
      animate={{
        x: [0, -40, -80, -40, 0],
        y: [0, -20, 0, 15, 0],
        rotate: [0, -10, 5, -5, 0],
      }}
      transition={{
        duration: 35,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg
        width="22"
        height="18"
        viewBox="0 0 22 18"
        fill="none"
        style={{ filter: `drop-shadow(1px 2px 2px ${C.shadow})` }}
      >
        <path
          d="M11 9 Q5 0 1 6 Q5 12 11 9"
          fill={C.accent}
          opacity="0.7"
        />
        <path
          d="M11 9 Q17 0 21 6 Q17 12 11 9"
          fill={C.accent}
          opacity="0.6"
        />
        <line
          x1="11"
          y1="9"
          x2="11"
          y2="2"
          stroke={C.mountain}
          strokeWidth="0.5"
        />
      </svg>
    </motion.div>
  );
}

/* ─── Pop-Up Decorative Element ─── */
function PopUpStar({
  delay,
  x,
  y,
}: {
  delay: number;
  x: string;
  y: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      className="absolute pointer-events-none"
      style={{
        left: x,
        top: y,
        perspective: 400,
        zIndex: 25,
      }}
      initial={{ scale: 0, rotateX: -90 }}
      animate={
        inView
          ? { scale: 1, rotateX: -15 }
          : { scale: 0, rotateX: -90 }
      }
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      <div
        style={{
          width: 24,
          height: 24,
          background: C.accent,
          clipPath:
            "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
          boxShadow: `2px 4px 6px ${C.shadow}`,
        }}
      />
    </motion.div>
  );
}

function PopUpCircle({
  delay,
  x,
  y,
  color,
}: {
  delay: number;
  x: string;
  y: string;
  color: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      className="absolute pointer-events-none"
      style={{
        left: x,
        top: y,
        perspective: 400,
        zIndex: 25,
      }}
      initial={{ scale: 0, rotateX: -90 }}
      animate={
        inView
          ? { scale: 1, rotateX: -20 }
          : { scale: 0, rotateX: -90 }
      }
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: color,
          border: `1.5px solid ${C.paperEdge}`,
          boxShadow: `2px 4px 6px ${C.shadow}`,
        }}
      />
    </motion.div>
  );
}

/* ─── Paper Tab (section header) ─── */
function PaperTab({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center mb-8 sm:mb-10">
      <div
        className="relative px-6 sm:px-8 py-2.5 sm:py-3"
        style={{
          background: C.layer4,
          clipPath:
            "polygon(8% 0%, 92% 0%, 100% 100%, 0% 100%)",
          borderTop: `2px solid ${C.paperEdge}`,
          boxShadow: `0 -2px 8px ${C.shadow}`,
        }}
      >
        <h2
          className="text-lg sm:text-xl md:text-2xl font-semibold tracking-wide uppercase font-[family-name:var(--font-jakarta)]"
          style={{ color: C.text }}
        >
          {children}
        </h2>
      </div>
    </div>
  );
}

/* ─── Fold Line ─── */
function FoldLine() {
  return (
    <div className="w-full flex justify-center py-6 sm:py-8">
      <div
        className="w-full max-w-[900px] mx-4"
        style={{
          borderBottom: `1.5px dashed rgba(45,40,36,0.15)`,
        }}
      />
    </div>
  );
}

/* ─── Animated Section Wrapper ─── */
function AnimSection({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
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
  const rotation = ((index % 5) - 2) * 0.6;
  const depthLevel = index % 3;
  const shadowIntensity =
    depthLevel === 0
      ? `0 6px 20px ${C.shadow}`
      : depthLevel === 1
        ? `0 8px 26px ${C.shadowDeep}`
        : `0 10px 32px ${C.shadowDeep}`;

  return (
    <motion.div
      ref={ref}
      className="group cursor-pointer"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
    >
      <motion.div
        className="relative rounded-sm overflow-visible"
        style={{
          background: C.layer4,
          borderTop: `2px solid ${C.paperEdge}`,
          boxShadow: shadowIntensity,
          transform: `rotate(${rotation}deg)`,
          transformOrigin: "center center",
        }}
        whileHover={{
          y: -8,
          boxShadow: `0 16px 40px ${C.shadowDeep}`,
          transition: { duration: 0.3 },
        }}
      >
        {/* Paper edge highlight */}
        <div
          className="absolute inset-x-0 top-0 h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
          }}
        />

        <div className="p-5 sm:p-6 md:p-8">
          {/* Top row: number badge + year/client */}
          <div className="flex items-start justify-between mb-4 sm:mb-5">
            {/* Circular paper badge with number */}
            <div
              className="flex items-center justify-center shrink-0"
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: C.accent,
                color: C.white,
                fontWeight: 700,
                fontSize: 16,
                boxShadow: `0 3px 8px rgba(255,107,53,0.3), 0 1px 0 rgba(255,255,255,0.3) inset`,
                border: `1.5px solid rgba(255,255,255,0.2)`,
                fontFamily: "var(--font-jakarta)",
              }}
            >
              {String(index + 1).padStart(2, "0")}
            </div>
            <div className="text-right">
              <div
                className="text-xs sm:text-sm font-medium font-[family-name:var(--font-jakarta)]"
                style={{ color: C.accent }}
              >
                {project.client}
              </div>
              <div
                className="text-xs font-[family-name:var(--font-inter)]"
                style={{ color: `${C.text}88` }}
              >
                {project.year}
              </div>
            </div>
          </div>

          {/* Title */}
          <h3
            className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight mb-3 sm:mb-4 font-[family-name:var(--font-jakarta)]"
            style={{ color: C.text }}
          >
            {project.title.replace("\n", " ")}
          </h3>

          {/* Description */}
          <p
            className="text-sm sm:text-base leading-relaxed mb-4 sm:mb-5 font-[family-name:var(--font-inter)]"
            style={{ color: `${C.text}CC` }}
          >
            {project.description}
          </p>

          {/* Technical detail */}
          <p
            className="text-xs sm:text-sm leading-relaxed mb-5 sm:mb-6 font-[family-name:var(--font-inter)] italic"
            style={{ color: `${C.text}99` }}
          >
            {project.technical}
          </p>

          {/* Tech tags + GitHub */}
          <div className="flex flex-wrap items-center gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 text-xs font-medium rounded-sm font-[family-name:var(--font-jakarta)]"
                style={{
                  background: `${C.layer1}66`,
                  color: C.text,
                  borderTop: `1px solid ${C.paperEdge}`,
                  boxShadow: `0 1px 3px ${C.shadow}`,
                }}
              >
                {t}
              </span>
            ))}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto text-xs font-medium underline underline-offset-2 font-[family-name:var(--font-inter)] hover:opacity-70 transition-opacity"
                style={{ color: C.accent }}
              >
                View Source
              </a>
            )}
          </div>
        </div>
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
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, rotateX: -10 }}
      animate={
        inView
          ? { opacity: 1, y: 0, rotateX: 0 }
          : { opacity: 0, y: 30, rotateX: -10 }
      }
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className="relative"
      style={{ perspective: 600 }}
    >
      <div
        className="p-5 sm:p-6 rounded-sm"
        style={{
          background: C.layer4,
          ...paperCutEdge,
          transform: `rotate(${(index % 2 === 0 ? -0.5 : 0.5)}deg)`,
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: C.accent }}
          />
          <h3
            className="text-base sm:text-lg font-semibold font-[family-name:var(--font-jakarta)]"
            style={{ color: C.text }}
          >
            {item.title}
          </h3>
        </div>
        <p
          className="text-sm leading-relaxed font-[family-name:var(--font-inter)]"
          style={{ color: `${C.text}AA` }}
        >
          {item.body}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Tool Group Card ─── */
function ToolGroupCard({
  group,
  index,
}: {
  group: (typeof tools)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 25 }}
      animate={
        inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }
      }
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: "easeOut",
      }}
      className="rounded-sm p-5 sm:p-6"
      style={{
        background: C.layer4,
        ...paperCutEdge,
        transform: `rotate(${(index % 2 === 0 ? -0.3 : 0.3)}deg)`,
      }}
    >
      <h3
        className="text-sm font-semibold uppercase tracking-wider mb-3 font-[family-name:var(--font-jakarta)]"
        style={{ color: C.accent }}
      >
        {group.label}
      </h3>
      <div className="flex flex-wrap gap-2">
        {group.items.map((item) => (
          <span
            key={item}
            className="px-2.5 py-1 text-xs font-medium rounded-sm font-[family-name:var(--font-inter)]"
            style={{
              background: `${C.layer3}88`,
              color: C.text,
              borderTop: `1px solid ${C.paperEdge}`,
              boxShadow: `0 1px 3px ${C.shadow}`,
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════ */
export default function DioramaPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{
        background: C.bg,
        backgroundImage: paperTexture,
        color: C.text,
      }}
    >
      {/* ─── HERO SECTION ─── */}
      <section className="relative overflow-hidden" style={{ minHeight: "100vh" }}>
        {/* Sky gradient behind mountains */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, #D4E4F0 0%, ${C.layer1} 40%, ${C.bg} 100%)`,
          }}
        />

        {/* Sun cutout */}
        <motion.div
          style={{ y: scrollY * 0.08 }}
          className="absolute inset-0 pointer-events-none"
        >
          <SunCutout />
        </motion.div>

        {/* Paper birds at different depths */}
        <PaperBird x="10%" y="15%" size={28} delay={0} duration={32} />
        <PaperBird x="25%" y="8%" size={20} delay={4} duration={38} />
        <PaperBird x="60%" y="12%" size={24} delay={8} duration={30} />
        <PaperButterfly x="75%" y="20%" delay={2} />
        <PaperButterfly x="40%" y="18%" delay={12} />

        {/* Pop-up decorative elements */}
        <PopUpStar delay={0.8} x="8%" y="35%" />
        <PopUpCircle delay={1.0} x="88%" y="28%" color={C.layer2} />
        <PopUpStar delay={1.2} x="92%" y="45%" />
        <PopUpCircle delay={0.6} x="5%" y="50%" color={C.layer1} />

        {/* Mountain Layer 1 (back) - slowest parallax */}
        <motion.div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: "45%",
            zIndex: 2,
            y: scrollY * 0.15,
          }}
        >
          <MountainBack />
        </motion.div>

        {/* Mountain Layer 2 (mid) */}
        <motion.div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: "45%",
            zIndex: 4,
            y: scrollY * 0.1,
          }}
        >
          <MountainMid />
        </motion.div>

        {/* Mountain Layer 3 (front ground) - least parallax */}
        <motion.div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: "45%",
            zIndex: 6,
            y: scrollY * 0.04,
          }}
        >
          <MountainFront />
        </motion.div>

        {/* Hero Content — sits on front layer */}
        <div
          className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6"
          style={{ minHeight: "100vh", paddingBottom: "25vh" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-[800px] mx-auto"
          >
            {/* Italic accent label */}
            <motion.p
              className="text-sm sm:text-base mb-3 sm:mb-4 font-[family-name:var(--font-instrument)] italic"
              style={{ color: C.accent }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              AI Product Studio
            </motion.p>

            {/* Main heading */}
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-4 sm:mb-6 font-[family-name:var(--font-jakarta)]"
              style={{
                color: C.text,
                textShadow: `0 2px 8px rgba(0,0,0,0.08)`,
              }}
            >
              Crafting
              <br />
              <span style={{ color: C.accent }}>Intelligent</span>
              <br />
              Products
            </h1>

            {/* Subtitle */}
            <motion.p
              className="text-sm sm:text-base md:text-lg leading-relaxed max-w-[520px] mx-auto mb-8 sm:mb-10 font-[family-name:var(--font-inter)]"
              style={{ color: `${C.text}BB` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Multi-model AI systems, computer vision, and full-stack
              products — each layer carefully assembled.
            </motion.p>

            {/* Stats row */}
            <motion.div
              className="flex justify-center gap-6 sm:gap-10"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <div
                    className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-jakarta)]"
                    style={{ color: C.accent }}
                  >
                    {s.value}
                  </div>
                  <div
                    className="text-xs sm:text-sm font-[family-name:var(--font-inter)]"
                    style={{ color: `${C.text}99` }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 z-20"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div
              className="w-6 h-10 rounded-full border-2 flex items-start justify-center pt-2"
              style={{ borderColor: `${C.text}44` }}
            >
              <div
                className="w-1 h-2.5 rounded-full"
                style={{ background: C.accent }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOLD LINE ─── */}
      <FoldLine />

      {/* ─── PROJECTS SECTION ─── */}
      <section className="relative px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-[1000px] mx-auto">
          <AnimSection>
            <PaperTab>Selected Work</PaperTab>
          </AnimSection>

          {/* Decorative pop-ups scattered around projects */}
          <div className="relative">
            <PopUpCircle delay={0.3} x="-3%" y="5%" color={C.layer1} />
            <PopUpStar delay={0.5} x="98%" y="8%" />
            <PopUpCircle delay={0.7} x="100%" y="25%" color={C.layer2} />
            <PopUpStar delay={0.9} x="-2%" y="40%" />
            <PopUpCircle delay={1.1} x="99%" y="55%" color={C.accent} />
            <PopUpStar delay={1.3} x="-1%" y="70%" />

            <div className="flex flex-col gap-6 sm:gap-8 md:gap-10">
              {projects.map((project, i) => (
                <ProjectCard key={project.title} project={project} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOLD LINE ─── */}
      <FoldLine />

      {/* ─── EXPERTISE SECTION ─── */}
      <section className="relative px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-[1000px] mx-auto">
          <AnimSection>
            <PaperTab>Expertise</PaperTab>
          </AnimSection>

          {/* Birds drifting through this section */}
          <div className="relative">
            <PaperBird x="5%" y="10%" size={22} delay={3} duration={35} />
            <PaperBird x="85%" y="30%" size={18} delay={7} duration={40} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {expertise.map((item, i) => (
                <ExpertiseCard key={item.title} item={item} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOLD LINE ─── */}
      <FoldLine />

      {/* ─── TOOLS SECTION ─── */}
      <section className="relative px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-[1000px] mx-auto">
          <AnimSection>
            <PaperTab>Tools & Stack</PaperTab>
          </AnimSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
            {tools.map((group, gi) => (
              <ToolGroupCard key={group.label} group={group} index={gi} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOLD LINE ─── */}
      <FoldLine />

      {/* ─── FOOTER ─── */}
      <footer className="relative px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-[1000px] mx-auto">
          <AnimSection>
            <div className="text-center">
              {/* Footer mountain scene (small) */}
              <div className="relative w-full max-w-[400px] mx-auto h-[100px] mb-8 overflow-hidden">
                <svg
                  viewBox="0 0 400 100"
                  className="w-full h-full"
                  preserveAspectRatio="none"
                >
                  {/* Back mountains */}
                  <path
                    d="M0 100 L0 60 Q50 40 100 55 Q150 30 200 45 Q250 25 300 40 Q350 30 400 50 L400 100 Z"
                    fill={C.layer1}
                    opacity="0.5"
                  />
                  {/* Front hills */}
                  <path
                    d="M0 100 L0 75 Q80 60 160 70 Q240 55 320 68 Q380 62 400 72 L400 100 Z"
                    fill={C.layer2}
                    opacity="0.5"
                  />
                  {/* Ground */}
                  <path
                    d="M0 100 L0 85 Q100 78 200 82 Q300 76 400 84 L400 100 Z"
                    fill={C.layer3}
                    opacity="0.6"
                  />
                  {/* Sun */}
                  <circle cx="200" cy="25" r="12" fill={C.accent} opacity="0.5" />
                </svg>
              </div>

              {/* Name */}
              <h2
                className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 font-[family-name:var(--font-jakarta)]"
                style={{ color: C.text }}
              >
                Grox
              </h2>
              <p
                className="text-sm sm:text-base font-[family-name:var(--font-instrument)] italic mb-6"
                style={{ color: C.accent }}
              >
                AI Product Studio
              </p>
              <p
                className="text-sm leading-relaxed max-w-[400px] mx-auto mb-8 font-[family-name:var(--font-inter)]"
                style={{ color: `${C.text}99` }}
              >
                Building intelligent products layer by layer.
                Each project carefully crafted, like paper art
                assembled with precision and care.
              </p>

              {/* Paper-style decorative divider */}
              <div className="flex justify-center items-center gap-4 mb-8">
                <div
                  className="w-12 h-[1px]"
                  style={{ background: `${C.text}22` }}
                />
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: C.accent }}
                />
                <div
                  className="w-12 h-[1px]"
                  style={{ background: `${C.text}22` }}
                />
              </div>

              <p
                className="text-xs font-[family-name:var(--font-inter)]"
                style={{ color: `${C.text}66` }}
              >
                &copy; {new Date().getFullYear()} Grox. Handcrafted with care.
              </p>
            </div>
          </AnimSection>
        </div>
      </footer>

      {/* ─── THEME SWITCHER ─── */}
      <ThemeSwitcher current="/diorama" variant="light" />
    </div>
  );
}
