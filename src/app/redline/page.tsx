"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { getProjectImage } from "@/lib/theme-images";

/* ═══════════════════════════════════════════════════════════════════ */
/*  REDLINE THEME — Engineering Design Review / Markup Aesthetic      */
/* ═══════════════════════════════════════════════════════════════════ */

/* ────────────── Color Palette ────────────── */
const BG = "#F0F0F0";
const GRID_MAJOR = "#D8E2EE";
const GRID_MINOR = "#E6ECF3";
const MARKUP_RED = "#E53935";
const MARKUP_RED_DIM = "rgba(229,57,53,0.12)";
const DIM_BLUE = "#1565C0";
const DIM_BLUE_FAINT = "rgba(21,101,192,0.10)";
const CHARCOAL = "#1A1A1A";
const SECONDARY = "#6B7280";
const CARD_BG = "#FFFFFF";
const CARD_BORDER = "#D1D5DB";
const APPROVED_GREEN = "#2E7D32";
const REVISION_RED = "#C62828";

/* ────────────── Section Cut Labels ────────────── */
const sectionCuts = ["A-A", "B-B", "C-C", "D-D", "E-E"];

/* ────────────── Markup Annotations Pool ────────────── */
const markupAnnotations = [
  "increase contrast \u2191",
  "verify spacing",
  "\u2713 approved",
  "\u25B3 needs review",
  "check alignment \u2192",
  "scale verified",
  "color OK \u2713",
  "update copy",
  "\u25B3 revisit layout",
  "font size OK",
];

/* ────────────── Engineering Grid Background (CSS) ────────────── */
const gridBgStyle = {
  backgroundColor: BG,
  backgroundImage: `
    linear-gradient(${GRID_MAJOR} 1px, transparent 1px),
    linear-gradient(90deg, ${GRID_MAJOR} 1px, transparent 1px),
    linear-gradient(${GRID_MINOR} 0.5px, transparent 0.5px),
    linear-gradient(90deg, ${GRID_MINOR} 0.5px, transparent 0.5px)
  `,
  backgroundSize: "80px 80px, 80px 80px, 20px 20px, 20px 20px",
  backgroundPosition: "0 0, 0 0, 0 0, 0 0",
};

/* ────────────── Scroll-reveal Section Wrapper ────────────── */
function Section({
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
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ────────────── SVG Dimension Line ────────────── */
function DimensionLine({
  label,
  width = "100%",
  color = DIM_BLUE,
  vertical = false,
}: {
  label: string;
  width?: string;
  color?: string;
  vertical?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  if (vertical) {
    return (
      <div
        ref={ref}
        className="flex flex-col items-center"
        style={{ height: width }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10">
          <polygon points="5,0 0,8 10,8" fill={color} />
        </svg>
        <motion.div
          className="w-px flex-1 relative"
          style={{ background: color }}
          initial={{ scaleY: 0 }}
          animate={inView ? { scaleY: 1 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-[family-name:var(--font-jetbrains)] tracking-wider whitespace-nowrap"
            style={{ color }}
          >
            {label}
          </span>
        </motion.div>
        <svg width="10" height="10" viewBox="0 0 10 10">
          <polygon points="5,10 0,2 10,2" fill={color} />
        </svg>
      </div>
    );
  }

  return (
    <div ref={ref} className="flex items-center gap-0" style={{ width }}>
      <svg width="8" height="10" viewBox="0 0 8 10" className="shrink-0">
        <polygon points="0,5 8,0 8,10" fill={color} />
      </svg>
      <motion.div
        className="flex-1 relative"
        style={{ height: 1, background: color, transformOrigin: "left" }}
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <span
          className="absolute left-1/2 -translate-x-1/2 -top-3.5 text-[9px] font-[family-name:var(--font-jetbrains)] tracking-wider whitespace-nowrap px-1.5"
          style={{ color, background: BG }}
        >
          {label}
        </span>
      </motion.div>
      <svg width="8" height="10" viewBox="0 0 8 10" className="shrink-0">
        <polygon points="8,5 0,0 0,10" fill={color} />
      </svg>
    </div>
  );
}

/* ────────────── Callout Bubble ────────────── */
function CalloutBubble({
  number,
  text,
  position = "right",
  className = "",
}: {
  number: number;
  text: string;
  position?: "left" | "right" | "top" | "bottom";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const leaderPath =
    position === "right"
      ? "M 0 16 L -30 16 L -40 0"
      : position === "left"
        ? "M 100 16 L 130 16 L 140 0"
        : position === "top"
          ? "M 50 32 L 50 50 L 40 60"
          : "M 50 0 L 50 -20 L 40 -30";

  return (
    <motion.div
      ref={ref}
      className={`absolute z-10 ${className}`}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
    >
      <div className="relative">
        {/* Leader line */}
        <svg
          className="absolute"
          width="160"
          height="80"
          style={{
            top: position === "bottom" ? -30 : position === "top" ? 32 : 0,
            left: position === "right" ? -44 : position === "left" ? "auto" : -10,
            right: position === "left" ? -44 : undefined,
            pointerEvents: "none",
          }}
        >
          <path
            d={leaderPath}
            fill="none"
            stroke={MARKUP_RED}
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
        </svg>
        {/* Bubble */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border-2 whitespace-nowrap"
          style={{
            borderColor: MARKUP_RED,
            background: "rgba(229,57,53,0.06)",
          }}
        >
          <span
            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
            style={{ background: MARKUP_RED }}
          >
            {number}
          </span>
          <span
            className="text-[11px] font-[family-name:var(--font-jetbrains)] font-medium"
            style={{ color: MARKUP_RED }}
          >
            {text}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ────────────── Revision Cloud SVG ────────────── */
function RevisionCloud({
  width = 200,
  height = 80,
  className = "",
}: {
  width?: number;
  height?: number;
  className?: string;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  // Generate scalloped path
  const scallops = [];
  const segments = Math.max(6, Math.floor((width + height) / 30));
  const perim = 2 * (width + height);
  const segLen = perim / segments;

  for (let i = 0; i < segments; i++) {
    const t1 = (i * segLen) / perim;
    const t2 = ((i + 1) * segLen) / perim;
    const p1 = perimPoint(t1, width, height);
    const p2 = perimPoint(t2, width, height);
    const mx = (p1.x + p2.x) / 2;
    const my = (p1.y + p2.y) / 2;
    const nx = -(p2.y - p1.y);
    const ny = p2.x - p1.x;
    const len = Math.sqrt(nx * nx + ny * ny) || 1;
    const bulge = 8;
    const cx = mx + (nx / len) * bulge;
    const cy = my + (ny / len) * bulge;

    if (i === 0) {
      scallops.push(`M ${p1.x} ${p1.y}`);
    }
    scallops.push(`Q ${cx} ${cy} ${p2.x} ${p2.y}`);
  }

  return (
    <motion.svg
      ref={ref}
      width={width + 20}
      height={height + 20}
      viewBox={`-10 -10 ${width + 20} ${height + 20}`}
      className={`absolute pointer-events-none ${className}`}
      initial={{ opacity: 0, pathLength: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6 }}
    >
      <motion.path
        d={scallops.join(" ")}
        fill="none"
        stroke={MARKUP_RED}
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />
    </motion.svg>
  );
}

function perimPoint(t: number, w: number, h: number) {
  const perim = 2 * (w + h);
  let d = t * perim;
  if (d < w) return { x: d, y: 0 };
  d -= w;
  if (d < h) return { x: w, y: d };
  d -= h;
  if (d < w) return { x: w - d, y: h };
  d -= w;
  return { x: 0, y: h - d };
}

/* ────────────── Cross-Section Marker ────────────── */
function CrossSectionMarker({
  label,
  direction = "right",
}: {
  label: string;
  direction?: "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      className="flex items-center shrink-0"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6 }}
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        className={direction === "left" ? "rotate-180" : ""}
      >
        <circle cx="20" cy="20" r="16" fill="none" stroke={CHARCOAL} strokeWidth="2" />
        <text
          x="20"
          y="24"
          textAnchor="middle"
          fontSize="12"
          fontWeight="bold"
          fill={CHARCOAL}
          fontFamily="var(--font-space-grotesk)"
        >
          {label}
        </text>
        <line x1="36" y1="20" x2="44" y2="20" stroke={CHARCOAL} strokeWidth="2" />
        <polygon points="40,16 48,20 40,24" fill={CHARCOAL} />
      </svg>
    </motion.div>
  );
}

/* ────────────── Section Cut Divider ────────────── */
function SectionCutDivider({ label }: { label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className="w-full flex items-center gap-4 py-12"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6 }}
    >
      <CrossSectionMarker label={label} direction="right" />
      <motion.div
        className="flex-1 relative"
        style={{
          height: 2,
          background: `repeating-linear-gradient(
            90deg,
            ${CHARCOAL} 0px, ${CHARCOAL} 16px,
            transparent 16px, transparent 22px,
            ${CHARCOAL} 22px, ${CHARCOAL} 28px,
            transparent 28px, transparent 34px
          )`,
        }}
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1, ease: "easeOut" }}
      />
      <CrossSectionMarker label={label} direction="left" />
    </motion.div>
  );
}

/* ────────────── Revision Stamp ────────────── */
function RevisionStamp({
  revision = "03",
  date = "2025.11.15",
  status = "APPROVED",
  className = "",
}: {
  revision?: string;
  date?: string;
  status?: "APPROVED" | "IN REVIEW";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const isApproved = status === "APPROVED";

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      initial={{ opacity: 0, scale: 1.5, rotate: -8 }}
      animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
      transition={{
        duration: 0.3,
        ease: [0.34, 1.56, 0.64, 1],
      }}
    >
      <div
        className="px-3 py-2 border-2 font-[family-name:var(--font-jetbrains)] text-center"
        style={{
          borderColor: isApproved ? APPROVED_GREEN : REVISION_RED,
          color: isApproved ? APPROVED_GREEN : REVISION_RED,
          background: isApproved
            ? "rgba(46,125,50,0.06)"
            : "rgba(198,40,40,0.06)",
          transform: "rotate(-2deg)",
        }}
      >
        <div className="text-[10px] tracking-[0.2em] opacity-60">{date}</div>
        <div className="text-sm font-bold tracking-wider">REV {revision}</div>
        <div
          className="text-[10px] tracking-[0.15em] mt-0.5 px-2 py-0.5 border"
          style={{
            borderColor: isApproved ? APPROVED_GREEN : REVISION_RED,
          }}
        >
          {status}
        </div>
      </div>
    </motion.div>
  );
}

/* ────────────── Markup Annotation ────────────── */
function MarkupAnnotation({
  text,
  className = "",
  fromDirection = "left",
}: {
  text: string;
  className?: string;
  fromDirection?: "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      className={`absolute pointer-events-none z-10 ${className}`}
      initial={{ opacity: 0, x: fromDirection === "left" ? -30 : 30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <span
        className="text-[11px] font-[family-name:var(--font-jetbrains)] italic whitespace-nowrap"
        style={{ color: MARKUP_RED }}
      >
        {text}
      </span>
    </motion.div>
  );
}

/* ────────────── Title Block (Engineering Drawing Header) ────────────── */
function TitleBlock({
  title,
  subtitle,
  drawingNo,
  date,
  revision,
  scale,
}: {
  title: string;
  subtitle: string;
  drawingNo: string;
  date: string;
  revision: string;
  scale: string;
}) {
  return (
    <div
      className="border-2 w-full"
      style={{ borderColor: CHARCOAL }}
    >
      <div className="grid grid-cols-[1fr_auto] md:grid-cols-[2fr_1fr_1fr_1fr]">
        {/* Project Name */}
        <div
          className="p-3 md:p-4 border-b md:border-b-0 md:border-r col-span-2 md:col-span-1"
          style={{ borderColor: CHARCOAL }}
        >
          <div
            className="text-[9px] font-[family-name:var(--font-jetbrains)] tracking-[0.2em] mb-1"
            style={{ color: SECONDARY }}
          >
            PROJECT TITLE
          </div>
          <div
            className="text-sm md:text-base font-bold font-[family-name:var(--font-space-grotesk)]"
            style={{ color: CHARCOAL }}
          >
            {title}
          </div>
          <div
            className="text-[11px] mt-0.5"
            style={{ color: SECONDARY }}
          >
            {subtitle}
          </div>
        </div>
        {/* Drawing No */}
        <div
          className="p-3 md:p-4 border-b md:border-b-0 md:border-r"
          style={{ borderColor: CHARCOAL }}
        >
          <div
            className="text-[9px] font-[family-name:var(--font-jetbrains)] tracking-[0.2em] mb-1"
            style={{ color: SECONDARY }}
          >
            DWG NO.
          </div>
          <div
            className="text-sm font-bold font-[family-name:var(--font-jetbrains)]"
            style={{ color: CHARCOAL }}
          >
            {drawingNo}
          </div>
        </div>
        {/* Scale + Rev */}
        <div
          className="p-3 md:p-4 border-r"
          style={{ borderColor: CHARCOAL }}
        >
          <div
            className="text-[9px] font-[family-name:var(--font-jetbrains)] tracking-[0.2em] mb-1"
            style={{ color: SECONDARY }}
          >
            SCALE
          </div>
          <div
            className="text-sm font-bold font-[family-name:var(--font-jetbrains)]"
            style={{ color: CHARCOAL }}
          >
            {scale}
          </div>
        </div>
        {/* Date + Revision */}
        <div className="p-3 md:p-4">
          <div
            className="text-[9px] font-[family-name:var(--font-jetbrains)] tracking-[0.2em] mb-1"
            style={{ color: SECONDARY }}
          >
            DATE / REV
          </div>
          <div
            className="text-xs font-[family-name:var(--font-jetbrains)]"
            style={{ color: CHARCOAL }}
          >
            {date}
          </div>
          <div
            className="text-xs font-bold font-[family-name:var(--font-jetbrains)]"
            style={{ color: CHARCOAL }}
          >
            REV {revision}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────── Project Card — Design Spec Sheet ────────────── */
function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const dwgNum = String(index + 1).padStart(3, "0");
  const annotation = markupAnnotations[index % markupAnnotations.length];
  const isApproved = index % 3 !== 1;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      {/* Dimension line above card */}
      <div className="mb-3 px-2 md:px-8">
        <DimensionLine label={`DWG-${dwgNum} · ${project.year}`} />
      </div>

      {/* Card container */}
      <div
        className="relative border-2 transition-shadow duration-300 hover:shadow-lg overflow-hidden"
        style={{
          borderColor: CARD_BORDER,
          background: CARD_BG,
        }}
      >
        {/* Title Block Header */}
        <div
          className="border-b-2 grid grid-cols-[1fr_auto_auto] md:grid-cols-[2fr_1fr_auto_auto]"
          style={{ borderColor: CARD_BORDER }}
        >
          {/* Title */}
          <div
            className="p-3 md:p-4 border-r col-span-1"
            style={{ borderColor: CARD_BORDER }}
          >
            <div
              className="text-[9px] font-[family-name:var(--font-jetbrains)] tracking-[0.2em] mb-0.5"
              style={{ color: SECONDARY }}
            >
              PROJECT TITLE
            </div>
            <h3
              className="text-base md:text-lg font-bold font-[family-name:var(--font-space-grotesk)] leading-tight"
              style={{ color: CHARCOAL }}
            >
              {project.title.replace("\n", " ")}
            </h3>
          </div>
          {/* Client field - hidden on mobile */}
          <div
            className="p-3 md:p-4 border-r hidden md:block"
            style={{ borderColor: CARD_BORDER }}
          >
            <div
              className="text-[9px] font-[family-name:var(--font-jetbrains)] tracking-[0.2em] mb-0.5"
              style={{ color: SECONDARY }}
            >
              CLIENT
            </div>
            <div
              className="text-xs font-[family-name:var(--font-jetbrains)] font-medium"
              style={{ color: CHARCOAL }}
            >
              {project.client}
            </div>
          </div>
          {/* Drawing No */}
          <div
            className="p-3 md:p-4 border-r"
            style={{ borderColor: CARD_BORDER }}
          >
            <div
              className="text-[9px] font-[family-name:var(--font-jetbrains)] tracking-[0.2em] mb-0.5"
              style={{ color: SECONDARY }}
            >
              DWG NO.
            </div>
            <div
              className="text-sm font-bold font-[family-name:var(--font-jetbrains)]"
              style={{ color: DIM_BLUE }}
            >
              DWG-{dwgNum}
            </div>
          </div>
          {/* Scale */}
          <div className="p-3 md:p-4">
            <div
              className="text-[9px] font-[family-name:var(--font-jetbrains)] tracking-[0.2em] mb-0.5"
              style={{ color: SECONDARY }}
            >
              SCALE
            </div>
            <div
              className="text-xs font-[family-name:var(--font-jetbrains)] font-medium"
              style={{ color: CHARCOAL }}
            >
              1:{index + 1}
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="flex flex-col md:flex-row">
          {/* Image area */}
          <div
            className="relative w-full md:w-[320px] shrink-0 border-b md:border-b-0 md:border-r overflow-hidden"
            style={{ borderColor: CARD_BORDER }}
          >
            <img
              src={getProjectImage("redline", project.image)}
              alt={project.title.replace("\n", " ")}
              className="w-full h-48 md:h-full object-cover"
            />
            {/* Dimension overlay on image */}
            <div
              className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <DimensionLine label="320px" color={MARKUP_RED} />
            </div>
            {/* Callout on image (hover) */}
            <div
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                style={{ background: MARKUP_RED }}
              >
                {index + 1}
              </div>
            </div>
          </div>

          {/* Content area */}
          <div className="flex-1 p-4 md:p-6 relative">
            {/* Description */}
            <p
              className="text-sm leading-relaxed mb-4 font-[family-name:var(--font-inter)]"
              style={{ color: CHARCOAL }}
            >
              {project.description}
            </p>

            {/* Technical block */}
            <div
              className="p-3 mb-4 border-l-2"
              style={{
                borderColor: DIM_BLUE,
                background: DIM_BLUE_FAINT,
              }}
            >
              <div
                className="text-[9px] font-[family-name:var(--font-jetbrains)] tracking-[0.2em] mb-1"
                style={{ color: DIM_BLUE }}
              >
                TECHNICAL NOTES
              </div>
              <p
                className="text-xs leading-relaxed font-[family-name:var(--font-inter)]"
                style={{ color: SECONDARY }}
              >
                {project.technical}
              </p>
            </div>

            {/* Tech stack */}
            <div className="flex flex-wrap gap-1.5">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 text-[10px] font-[family-name:var(--font-jetbrains)] tracking-wider border"
                  style={{
                    borderColor: CARD_BORDER,
                    color: SECONDARY,
                    background: BG,
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
                className="inline-flex items-center gap-1.5 mt-4 text-xs font-[family-name:var(--font-jetbrains)] tracking-wider hover:underline"
                style={{ color: DIM_BLUE }}
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
                SOURCE CODE
              </a>
            )}

            {/* Markup annotation (absolute positioned) */}
            <MarkupAnnotation
              text={annotation}
              className="hidden md:block -right-2 top-2 md:right-4 md:top-3"
              fromDirection="right"
            />

            {/* Revision stamp */}
            <div className="absolute bottom-3 right-3 hidden md:block">
              <RevisionStamp
                revision={String(index + 1).padStart(2, "0")}
                date={`2025.${String((index % 12) + 1).padStart(2, "0")}.15`}
                status={isApproved ? "APPROVED" : "IN REVIEW"}
                className=""
              />
            </div>
          </div>
        </div>

        {/* Bottom dimension line */}
        <div
          className="border-t px-4 py-2 flex items-center justify-between"
          style={{ borderColor: CARD_BORDER, background: BG }}
        >
          <span
            className="text-[9px] font-[family-name:var(--font-jetbrains)] tracking-[0.2em]"
            style={{ color: SECONDARY }}
          >
            SHEET {index + 1} OF {projects.length}
          </span>
          <span
            className="text-[9px] font-[family-name:var(--font-jetbrains)] tracking-[0.2em]"
            style={{ color: SECONDARY }}
          >
            ALL DIMENSIONS IN PIXELS
          </span>
          <span
            className="text-[9px] font-[family-name:var(--font-jetbrains)] tracking-[0.2em]"
            style={{ color: isApproved ? APPROVED_GREEN : REVISION_RED }}
          >
            {isApproved ? "\u2713 APPROVED" : "\u25B3 IN REVIEW"}
          </span>
        </div>
      </div>

      {/* Vertical dimension line on right (desktop only) */}
      <div className="absolute -right-8 top-8 hidden lg:block">
        <DimensionLine label="card-h" vertical width="120px" />
      </div>
    </motion.div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/*  MAIN PAGE COMPONENT                                              */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function RedlinePage() {
  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={gridBgStyle}
    >
      {/* ───── Top Registration Marks ───── */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-between px-4 pointer-events-none">
        <svg width="20" height="20" viewBox="0 0 20 20">
          <line x1="10" y1="0" x2="10" y2="20" stroke={CHARCOAL} strokeWidth="0.5" />
          <line x1="0" y1="10" x2="20" y2="10" stroke={CHARCOAL} strokeWidth="0.5" />
          <circle cx="10" cy="10" r="6" fill="none" stroke={CHARCOAL} strokeWidth="0.5" />
        </svg>
        <svg width="20" height="20" viewBox="0 0 20 20">
          <line x1="10" y1="0" x2="10" y2="20" stroke={CHARCOAL} strokeWidth="0.5" />
          <line x1="0" y1="10" x2="20" y2="10" stroke={CHARCOAL} strokeWidth="0.5" />
          <circle cx="10" cy="10" r="6" fill="none" stroke={CHARCOAL} strokeWidth="0.5" />
        </svg>
      </div>

      {/* ───── Page margin dimension markers (desktop) ───── */}
      <div className="fixed left-2 top-1/2 -translate-y-1/2 hidden lg:block pointer-events-none z-40">
        <DimensionLine label="viewport" vertical width="200px" color={SECONDARY} />
      </div>

      {/* ───── Main Content Container ───── */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-16 relative">

        {/* ═══════════════════════════════════════ */}
        {/*  HERO SECTION                           */}
        {/* ═══════════════════════════════════════ */}
        <Section id="hero" className="mb-16 md:mb-24 relative">
          {/* Master Title Block */}
          <TitleBlock
            title="PORTFOLIO DESIGN REVIEW"
            subtitle="AI-Powered Full-Stack Applications"
            drawingNo="PDR-2025-001"
            date="2025.11.15"
            revision="03"
            scale="NTS"
          />

          {/* Hero content area */}
          <div className="mt-10 md:mt-16 relative">
            {/* Revision stamp in corner */}
            <div className="absolute -top-2 right-0 md:right-4 z-20">
              <RevisionStamp
                revision="03"
                date="2025.11.15"
                status="APPROVED"
              />
            </div>

            {/* Main headline with dimension lines */}
            <div className="relative">
              {/* Dimension line above title */}
              <div className="mb-4 max-w-md">
                <DimensionLine label="title-width" />
              </div>

              <h1
                className="text-4xl md:text-6xl lg:text-7xl font-bold font-[family-name:var(--font-space-grotesk)] leading-[1.05] tracking-tight"
                style={{ color: CHARCOAL }}
              >
                Engineering{" "}
                <span className="relative inline-block">
                  AI Models
                  {/* Red underline annotation */}
                  <svg
                    className="absolute -bottom-1 left-0 w-full"
                    height="6"
                    viewBox="0 0 200 6"
                    preserveAspectRatio="none"
                  >
                    <motion.path
                      d="M0 4 Q50 0, 100 4 Q150 8, 200 4"
                      fill="none"
                      stroke={MARKUP_RED}
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </svg>
                </span>
                <br />
                Into{" "}
                <span className="relative inline-block">
                  Products
                  {/* Dimension line under "Products" */}
                  <div className="absolute -bottom-5 left-0 right-0">
                    <DimensionLine label="8ch" color={DIM_BLUE} />
                  </div>
                </span>
              </h1>

              {/* Callout bubble pointing to "AI Models" */}
              <CalloutBubble
                number={1}
                text="KEY FEATURE"
                position="right"
                className="hidden md:block top-2 -right-4 md:right-8 lg:right-16"
              />

              {/* Markup annotation */}
              <MarkupAnnotation
                text="increase contrast \u2191"
                className="hidden md:block -left-4 md:left-0 top-0 md:-top-6"
                fromDirection="left"
              />
            </div>

            {/* Subtitle */}
            <div className="mt-10 md:mt-14 max-w-2xl relative">
              <p
                className="text-base md:text-lg leading-relaxed font-[family-name:var(--font-inter)]"
                style={{ color: SECONDARY }}
              >
                A design review portfolio showcasing AI-powered applications.
                Each project documented as an engineering specification sheet
                with full technical annotations and revision history.
              </p>

              {/* Revision cloud around subtitle area */}
              <RevisionCloud
                width={480}
                height={70}
                className="hidden lg:block -top-3 -left-4"
              />
            </div>

            {/* Stats row with dimension annotations */}
            <div className="mt-12 md:mt-16 grid grid-cols-3 gap-4 md:gap-8 max-w-lg relative">
              {stats.map((stat, i) => (
                <div key={stat.label} className="relative">
                  <div
                    className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-space-grotesk)]"
                    style={{ color: CHARCOAL }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-xs font-[family-name:var(--font-jetbrains)] tracking-[0.15em] mt-1"
                    style={{ color: SECONDARY }}
                  >
                    {stat.label.toUpperCase()}
                  </div>
                  {/* Small callout number */}
                  <div
                    className="absolute -top-2 -right-2 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
                    style={{ background: DIM_BLUE }}
                  >
                    {i + 1}
                  </div>
                </div>
              ))}

              {/* Dimension line spanning all stats */}
              <div className="col-span-3 mt-4">
                <DimensionLine label="stats-group: 480px" />
              </div>
            </div>
          </div>
        </Section>

        {/* ═══════════════════════════════════════ */}
        {/*  SECTION CUT: A-A                       */}
        {/* ═══════════════════════════════════════ */}
        <SectionCutDivider label={sectionCuts[0]} />

        {/* ═══════════════════════════════════════ */}
        {/*  PROJECTS SECTION                       */}
        {/* ═══════════════════════════════════════ */}
        <Section id="projects" className="relative">
          <div className="flex items-center justify-between mb-8">
            <div className="relative">
              <h2
                className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-space-grotesk)] tracking-tight"
                style={{ color: CHARCOAL }}
              >
                Project Specifications
              </h2>
              <div
                className="text-xs font-[family-name:var(--font-jetbrains)] tracking-[0.2em] mt-1"
                style={{ color: SECONDARY }}
              >
                {projects.length} DRAWINGS &middot; ALL SHEETS
              </div>
              {/* Callout */}
              <CalloutBubble
                number={2}
                text="FULL PORTFOLIO"
                position="right"
                className="hidden md:block -top-1 left-[calc(100%+16px)]"
              />
            </div>
            <RevisionStamp
              revision="03"
              date="2025.11.15"
              status="APPROVED"
              className="hidden md:block"
            />
          </div>

          {/* Dimension line before first card */}
          <div className="mb-6">
            <DimensionLine label="content-width: 1200px" />
          </div>

          {/* All project cards */}
          <div className="flex flex-col gap-12 md:gap-16">
            {projects.map((project, index) => (
              <ProjectCard key={index} project={project} index={index} />
            ))}
          </div>
        </Section>

        {/* ═══════════════════════════════════════ */}
        {/*  SECTION CUT: B-B                       */}
        {/* ═══════════════════════════════════════ */}
        <SectionCutDivider label={sectionCuts[1]} />

        {/* ═══════════════════════════════════════ */}
        {/*  EXPERTISE SECTION                      */}
        {/* ═══════════════════════════════════════ */}
        <Section id="expertise" className="relative">
          <div className="flex items-center gap-4 mb-8">
            <h2
              className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-space-grotesk)] tracking-tight"
              style={{ color: CHARCOAL }}
            >
              Areas of Expertise
            </h2>
            <MarkupAnnotation
              text="\u2713 approved"
              className="relative hidden md:block"
              fromDirection="right"
            />
          </div>

          <div className="mb-6">
            <DimensionLine label="expertise-block: 1200px" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            {expertise.map((item, i) => {
              const isHighlighted = i === 0;
              return (
                <Section key={item.title} delay={i * 0.1}>
                  <div
                    className="relative border-2 p-5 md:p-6 h-full transition-shadow duration-300 hover:shadow-md"
                    style={{
                      borderColor: CARD_BORDER,
                      background: CARD_BG,
                    }}
                  >
                    {/* Title block stripe */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1"
                      style={{
                        background: i % 2 === 0 ? MARKUP_RED : DIM_BLUE,
                      }}
                    />

                    {/* Drawing number */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div
                          className="text-[9px] font-[family-name:var(--font-jetbrains)] tracking-[0.2em] mb-1"
                          style={{ color: SECONDARY }}
                        >
                          SPEC-{String(i + 1).padStart(2, "0")}
                        </div>
                        <h3
                          className="text-lg font-bold font-[family-name:var(--font-space-grotesk)]"
                          style={{ color: CHARCOAL }}
                        >
                          {item.title}
                        </h3>
                      </div>
                      {/* Small revision stamp */}
                      <div
                        className="text-[9px] font-[family-name:var(--font-jetbrains)] px-2 py-1 border"
                        style={{
                          borderColor: APPROVED_GREEN,
                          color: APPROVED_GREEN,
                        }}
                      >
                        REV A
                      </div>
                    </div>

                    <p
                      className="text-sm leading-relaxed font-[family-name:var(--font-inter)]"
                      style={{ color: SECONDARY }}
                    >
                      {item.body}
                    </p>

                    {/* Revision cloud on first item */}
                    {isHighlighted && (
                      <RevisionCloud
                        width={280}
                        height={50}
                        className="hidden md:block -bottom-2 -right-2"
                      />
                    )}

                    {/* Dimension annotation */}
                    <div className="mt-4">
                      <DimensionLine
                        label={`spec-${i + 1}-w`}
                        color={SECONDARY}
                      />
                    </div>
                  </div>
                </Section>
              );
            })}
          </div>

          {/* Callout for expertise section */}
          <CalloutBubble
            number={3}
            text="CORE COMPETENCIES"
            position="left"
            className="hidden lg:block top-12 -left-8"
          />
        </Section>

        {/* ═══════════════════════════════════════ */}
        {/*  SECTION CUT: C-C                       */}
        {/* ═══════════════════════════════════════ */}
        <SectionCutDivider label={sectionCuts[2]} />

        {/* ═══════════════════════════════════════ */}
        {/*  TOOLS SECTION                          */}
        {/* ═══════════════════════════════════════ */}
        <Section id="tools" className="relative">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2
                className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-space-grotesk)] tracking-tight"
                style={{ color: CHARCOAL }}
              >
                Technical Stack
              </h2>
              <div
                className="text-xs font-[family-name:var(--font-jetbrains)] tracking-[0.2em] mt-1"
                style={{ color: SECONDARY }}
              >
                MATERIALS &amp; SPECIFICATIONS
              </div>
            </div>
            <RevisionStamp
              revision="02"
              date="2025.10.01"
              status="IN REVIEW"
              className="hidden md:block"
            />
          </div>

          <div className="mb-6">
            <DimensionLine label="tools-grid: 1200px" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative">
            {tools.map((group, gi) => (
              <Section key={group.label} delay={gi * 0.08}>
                <div
                  className="border-2 p-4 md:p-5 h-full transition-shadow duration-300 hover:shadow-md relative"
                  style={{
                    borderColor: CARD_BORDER,
                    background: CARD_BG,
                  }}
                >
                  {/* Category header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                        style={{ background: DIM_BLUE }}
                      >
                        {gi + 1}
                      </span>
                      <h3
                        className="text-sm font-bold font-[family-name:var(--font-space-grotesk)] tracking-wide"
                        style={{ color: CHARCOAL }}
                      >
                        {group.label}
                      </h3>
                    </div>
                    <span
                      className="text-[9px] font-[family-name:var(--font-jetbrains)] tracking-[0.15em]"
                      style={{ color: SECONDARY }}
                    >
                      {group.items.length} ITEMS
                    </span>
                  </div>

                  {/* Items */}
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="px-2.5 py-1 text-[11px] font-[family-name:var(--font-jetbrains)] tracking-wide border"
                        style={{
                          borderColor: CARD_BORDER,
                          color: CHARCOAL,
                          background: BG,
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  {/* Markup annotation on some cards */}
                  {gi % 3 === 0 && (
                    <MarkupAnnotation
                      text="scale verified"
                      className="hidden md:block -right-2 -bottom-5"
                      fromDirection="right"
                    />
                  )}
                </div>
              </Section>
            ))}
          </div>

          {/* Callout */}
          <div className="mt-6">
            <CalloutBubble
              number={4}
              text="FULL STACK COVERAGE"
              position="top"
              className="relative hidden md:inline-block"
            />
          </div>
        </Section>

        {/* ═══════════════════════════════════════ */}
        {/*  SECTION CUT: D-D                       */}
        {/* ═══════════════════════════════════════ */}
        <SectionCutDivider label={sectionCuts[3]} />

        {/* ═══════════════════════════════════════ */}
        {/*  FOOTER SECTION                         */}
        {/* ═══════════════════════════════════════ */}
        <Section id="footer" className="relative pb-32">
          {/* Footer title block */}
          <div
            className="border-2 p-6 md:p-8 relative"
            style={{
              borderColor: CHARCOAL,
              background: CARD_BG,
            }}
          >
            {/* Top stripe */}
            <div
              className="absolute top-0 left-0 right-0 h-1.5"
              style={{ background: MARKUP_RED }}
            />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div
                  className="text-[9px] font-[family-name:var(--font-jetbrains)] tracking-[0.2em] mb-2"
                  style={{ color: SECONDARY }}
                >
                  DESIGN REVIEW COMPLETE &middot; DOCUMENT CONTROL
                </div>
                <h2
                  className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-space-grotesk)] tracking-tight"
                  style={{ color: CHARCOAL }}
                >
                  End of Document
                </h2>
                <p
                  className="text-sm mt-2 max-w-md font-[family-name:var(--font-inter)]"
                  style={{ color: SECONDARY }}
                >
                  All project specifications reviewed and annotated.
                  For inquiries, request access to the full drawing set.
                </p>
              </div>

              <div className="flex flex-col items-end gap-3">
                <RevisionStamp
                  revision="03"
                  date="2025.11.15"
                  status="APPROVED"
                />
                <div
                  className="text-[10px] font-[family-name:var(--font-jetbrains)] tracking-[0.15em]"
                  style={{ color: SECONDARY }}
                >
                  {projects.length} SHEETS TOTAL
                </div>
              </div>
            </div>

            {/* Bottom title block row */}
            <div
              className="mt-8 pt-4 border-t-2 grid grid-cols-2 md:grid-cols-4 gap-4"
              style={{ borderColor: CARD_BORDER }}
            >
              <div>
                <div
                  className="text-[9px] font-[family-name:var(--font-jetbrains)] tracking-[0.2em] mb-0.5"
                  style={{ color: SECONDARY }}
                >
                  DRAWN BY
                </div>
                <div
                  className="text-xs font-bold font-[family-name:var(--font-jetbrains)]"
                  style={{ color: CHARCOAL }}
                >
                  AM
                </div>
              </div>
              <div>
                <div
                  className="text-[9px] font-[family-name:var(--font-jetbrains)] tracking-[0.2em] mb-0.5"
                  style={{ color: SECONDARY }}
                >
                  CHECKED BY
                </div>
                <div
                  className="text-xs font-bold font-[family-name:var(--font-jetbrains)]"
                  style={{ color: CHARCOAL }}
                >
                  QA TEAM
                </div>
              </div>
              <div>
                <div
                  className="text-[9px] font-[family-name:var(--font-jetbrains)] tracking-[0.2em] mb-0.5"
                  style={{ color: SECONDARY }}
                >
                  DOCUMENT NO.
                </div>
                <div
                  className="text-xs font-bold font-[family-name:var(--font-jetbrains)]"
                  style={{ color: CHARCOAL }}
                >
                  PDR-2025-001
                </div>
              </div>
              <div>
                <div
                  className="text-[9px] font-[family-name:var(--font-jetbrains)] tracking-[0.2em] mb-0.5"
                  style={{ color: SECONDARY }}
                >
                  REVISION
                </div>
                <div
                  className="text-xs font-bold font-[family-name:var(--font-jetbrains)]"
                  style={{ color: APPROVED_GREEN }}
                >
                  REV 03 — FINAL
                </div>
              </div>
            </div>

            {/* Registration marks in corners */}
            <svg
              className="absolute top-2 left-2"
              width="12"
              height="12"
              viewBox="0 0 12 12"
            >
              <line x1="6" y1="0" x2="6" y2="12" stroke={CHARCOAL} strokeWidth="0.5" />
              <line x1="0" y1="6" x2="12" y2="6" stroke={CHARCOAL} strokeWidth="0.5" />
            </svg>
            <svg
              className="absolute top-2 right-2"
              width="12"
              height="12"
              viewBox="0 0 12 12"
            >
              <line x1="6" y1="0" x2="6" y2="12" stroke={CHARCOAL} strokeWidth="0.5" />
              <line x1="0" y1="6" x2="12" y2="6" stroke={CHARCOAL} strokeWidth="0.5" />
            </svg>
            <svg
              className="absolute bottom-2 left-2"
              width="12"
              height="12"
              viewBox="0 0 12 12"
            >
              <line x1="6" y1="0" x2="6" y2="12" stroke={CHARCOAL} strokeWidth="0.5" />
              <line x1="0" y1="6" x2="12" y2="6" stroke={CHARCOAL} strokeWidth="0.5" />
            </svg>
            <svg
              className="absolute bottom-2 right-2"
              width="12"
              height="12"
              viewBox="0 0 12 12"
            >
              <line x1="6" y1="0" x2="6" y2="12" stroke={CHARCOAL} strokeWidth="0.5" />
              <line x1="0" y1="6" x2="12" y2="6" stroke={CHARCOAL} strokeWidth="0.5" />
            </svg>

            {/* Markup annotations on footer */}
            <MarkupAnnotation
              text="final review complete \u2713"
              className="hidden md:block -right-4 top-12 md:right-4 md:-top-6"
              fromDirection="right"
            />
          </div>

          {/* Final dimension line */}
          <div className="mt-8">
            <DimensionLine label="END OF DOCUMENT" />
          </div>

          {/* Bottom registration marks */}
          <div className="flex justify-between mt-8">
            <svg width="16" height="16" viewBox="0 0 16 16">
              <circle cx="8" cy="8" r="6" fill="none" stroke={CHARCOAL} strokeWidth="0.5" />
              <line x1="8" y1="0" x2="8" y2="16" stroke={CHARCOAL} strokeWidth="0.5" />
              <line x1="0" y1="8" x2="16" y2="8" stroke={CHARCOAL} strokeWidth="0.5" />
            </svg>
            <div
              className="text-[9px] font-[family-name:var(--font-jetbrains)] tracking-[0.3em]"
              style={{ color: SECONDARY }}
            >
              CONFIDENTIAL &middot; DO NOT DISTRIBUTE WITHOUT AUTHORIZATION
            </div>
            <svg width="16" height="16" viewBox="0 0 16 16">
              <circle cx="8" cy="8" r="6" fill="none" stroke={CHARCOAL} strokeWidth="0.5" />
              <line x1="8" y1="0" x2="8" y2="16" stroke={CHARCOAL} strokeWidth="0.5" />
              <line x1="0" y1="8" x2="16" y2="8" stroke={CHARCOAL} strokeWidth="0.5" />
            </svg>
          </div>
        </Section>
      </div>

      {/* Theme Switcher */}
      <ThemeSwitcher current="/redline" variant="light" />
    </div>
  );
}
