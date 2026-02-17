"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "@/app/data/projects";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";
import { getProjectImage } from "@/lib/theme-images";

/* ─── palette ─── */
const C = {
  bg: "#111111",
  surface: "#1A1A1A",
  amber: "#F5A623",
  green: "#4ADE80",
  red: "#EF4444",
  text: "#E8E8E8",
  dim: "#6B6B6B",
  border: "rgba(245,166,35,0.12)",
  cardBorder: "rgba(255,255,255,0.06)",
};

/* ─── EXIF generator from project index ─── */
function generateEXIF(index: number) {
  const isos = [100, 200, 400, 800, 1600, 3200];
  const apertures = [1.4, 1.8, 2.0, 2.8, 4.0, 5.6, 8.0];
  const shutters = ["1/30s", "1/60s", "1/125s", "1/250s", "1/500s", "1/1000s", "1/2000s"];
  const focals = [24, 35, 50, 85, 105, 135, 200];
  return {
    iso: isos[index % isos.length],
    aperture: apertures[index % apertures.length],
    shutter: shutters[index % shutters.length],
    focal: focals[index % focals.length],
  };
}

/* ─── focus distance scale values ─── */
const focusDistances = [0.3, 0.5, 0.7, 1.0, 1.5, 2.0, 3.0, 5.0, 10, "INF"];

/* ═══════════════════════════════════════════
   SVG COMPONENTS
   ═══════════════════════════════════════════ */

/* ─── Aperture Blade Ring ─── */
function ApertureBlades({
  size = 500,
  bladeCount = 8,
  className = "",
}: {
  size?: number;
  bladeCount?: number;
  className?: string;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.44;
  const innerR = size * 0.18;

  const blades = useMemo(() => {
    const paths: string[] = [];
    const angleStep = (2 * Math.PI) / bladeCount;

    for (let i = 0; i < bladeCount; i++) {
      const angle = i * angleStep;
      const nextAngle = (i + 1) * angleStep;
      const midAngle = angle + angleStep * 0.5;

      const x1 = cx + outerR * Math.cos(angle);
      const y1 = cy + outerR * Math.sin(angle);
      const x2 = cx + innerR * Math.cos(midAngle);
      const y2 = cy + innerR * Math.sin(midAngle);
      const x3 = cx + outerR * Math.cos(nextAngle);
      const y3 = cy + outerR * Math.sin(nextAngle);
      const x4 = cx + innerR * Math.cos(angle + angleStep * 0.1);
      const y4 = cy + innerR * Math.sin(angle + angleStep * 0.1);

      paths.push(
        `M ${x4} ${y4} L ${x1} ${y1} A ${outerR} ${outerR} 0 0 1 ${x3} ${y3} L ${x2} ${y2} Z`
      );
    }
    return paths;
  }, [cx, cy, outerR, innerR, bladeCount]);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      style={{ overflow: "visible" }}
    >
      {/* Outer ring */}
      <circle
        cx={cx}
        cy={cy}
        r={outerR + 8}
        fill="none"
        stroke={C.amber}
        strokeWidth={0.5}
        opacity={0.3}
      />
      <circle
        cx={cx}
        cy={cy}
        r={outerR + 14}
        fill="none"
        stroke={C.amber}
        strokeWidth={0.3}
        opacity={0.15}
      />

      {/* Aperture blades */}
      {blades.map((d, i) => (
        <path
          key={i}
          d={d}
          fill={C.surface}
          stroke={C.amber}
          strokeWidth={0.6}
          opacity={0.6}
        />
      ))}

      {/* Center circle */}
      <circle
        cx={cx}
        cy={cy}
        r={innerR}
        fill="none"
        stroke={C.amber}
        strokeWidth={0.5}
        opacity={0.4}
      />

      {/* Tick marks around the outer ring */}
      {Array.from({ length: 72 }).map((_, i) => {
        const angle = (i / 72) * 2 * Math.PI;
        const isMajor = i % 9 === 0;
        const r1 = outerR + 18;
        const r2 = outerR + (isMajor ? 28 : 23);
        return (
          <line
            key={i}
            x1={cx + r1 * Math.cos(angle)}
            y1={cy + r1 * Math.sin(angle)}
            x2={cx + r2 * Math.cos(angle)}
            y2={cy + r2 * Math.sin(angle)}
            stroke={C.amber}
            strokeWidth={isMajor ? 0.8 : 0.3}
            opacity={isMajor ? 0.5 : 0.2}
          />
        );
      })}
    </svg>
  );
}

/* ─── Viewfinder Overlay ─── */
function ViewfinderOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Crosshair vertical */}
      <div
        className="absolute left-1/2 top-[35%] bottom-[35%] w-px -translate-x-1/2"
        style={{ background: `${C.amber}22` }}
      />
      {/* Crosshair horizontal */}
      <div
        className="absolute top-1/2 left-[35%] right-[35%] h-px -translate-y-1/2"
        style={{ background: `${C.amber}22` }}
      />

      {/* Center AF brackets */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16">
        {/* Top-left */}
        <div
          className="absolute top-0 left-0 w-4 h-4"
          style={{
            borderTop: `1px solid ${C.green}88`,
            borderLeft: `1px solid ${C.green}88`,
          }}
        />
        {/* Top-right */}
        <div
          className="absolute top-0 right-0 w-4 h-4"
          style={{
            borderTop: `1px solid ${C.green}88`,
            borderRight: `1px solid ${C.green}88`,
          }}
        />
        {/* Bottom-left */}
        <div
          className="absolute bottom-0 left-0 w-4 h-4"
          style={{
            borderBottom: `1px solid ${C.green}88`,
            borderLeft: `1px solid ${C.green}88`,
          }}
        />
        {/* Bottom-right */}
        <div
          className="absolute bottom-0 right-0 w-4 h-4"
          style={{
            borderBottom: `1px solid ${C.green}88`,
            borderRight: `1px solid ${C.green}88`,
          }}
        />
      </div>

      {/* Rule of thirds — vertical lines */}
      <div
        className="absolute top-0 bottom-0 w-px"
        style={{ left: "33.33%", background: `${C.dim}11` }}
      />
      <div
        className="absolute top-0 bottom-0 w-px"
        style={{ left: "66.66%", background: `${C.dim}11` }}
      />
      {/* Rule of thirds — horizontal lines */}
      <div
        className="absolute left-0 right-0 h-px"
        style={{ top: "33.33%", background: `${C.dim}11` }}
      />
      <div
        className="absolute left-0 right-0 h-px"
        style={{ top: "66.66%", background: `${C.dim}11` }}
      />
    </div>
  );
}

/* ─── Bokeh Circle ─── */
function BokehField() {
  const bokehSpots = useMemo(() => {
    const spots: Array<{
      x: number;
      y: number;
      size: number;
      opacity: number;
      color: string;
      delay: number;
      duration: number;
    }> = [];
    const colors = [C.amber, C.green, C.amber, C.amber, C.amber];
    for (let i = 0; i < 24; i++) {
      spots.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 20 + Math.random() * 60,
        opacity: 0.04 + Math.random() * 0.1,
        color: colors[i % colors.length],
        delay: Math.random() * 10,
        duration: 25 + Math.random() * 15,
      });
    }
    return spots;
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {bokehSpots.map((spot, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${spot.x}%`,
            top: `${spot.y}%`,
            width: spot.size,
            height: spot.size,
            background: spot.color,
            opacity: spot.opacity,
            filter: `blur(${spot.size * 0.4}px)`,
          }}
          animate={{
            x: [0, 30, -20, 10, 0],
            y: [0, -20, 15, -10, 0],
          }}
          transition={{
            duration: spot.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: spot.delay,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Film Sprocket Strip ─── */
function FilmSprocketStrip() {
  return (
    <div className="w-full overflow-hidden" style={{ height: 28 }}>
      <motion.div
        className="flex items-center h-full"
        style={{ width: "200%" }}
        animate={{ x: [0, -100] }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        {Array.from({ length: 120 }).map((_, i) => (
          <div
            key={i}
            className="flex-shrink-0 mx-[10px]"
            style={{
              width: 14,
              height: 10,
              borderRadius: 2,
              border: `1px solid ${C.dim}44`,
              background: `${C.dim}0a`,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Focus Ring (circular, with tick marks) ─── */
function FocusRing({ number, size = 56 }: { number: number; size?: number }) {
  const r = size / 2 - 4;
  const cx = size / 2;
  const cy = size / 2;
  const tickCount = 20;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Outer ring */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={C.amber}
        strokeWidth={1}
        opacity={0.4}
      />
      {/* Inner ring */}
      <circle
        cx={cx}
        cy={cy}
        r={r - 4}
        fill="none"
        stroke={C.amber}
        strokeWidth={0.3}
        opacity={0.2}
      />
      {/* Tick marks */}
      {Array.from({ length: tickCount }).map((_, i) => {
        const angle = (i / tickCount) * 2 * Math.PI - Math.PI / 2;
        const isMajor = i % 5 === 0;
        const r1 = r - (isMajor ? 7 : 5);
        const r2 = r - 1;
        return (
          <line
            key={i}
            x1={cx + r1 * Math.cos(angle)}
            y1={cy + r1 * Math.sin(angle)}
            x2={cx + r2 * Math.cos(angle)}
            y2={cy + r2 * Math.sin(angle)}
            stroke={C.amber}
            strokeWidth={isMajor ? 0.8 : 0.4}
            opacity={isMajor ? 0.6 : 0.25}
          />
        );
      })}
      {/* Number in center */}
      <text
        x={cx}
        y={cy + 1}
        textAnchor="middle"
        dominantBaseline="central"
        fill={C.amber}
        fontSize={14}
        fontFamily="var(--font-jetbrains)"
        fontWeight="500"
      >
        {String(number).padStart(2, "0")}
      </text>
    </svg>
  );
}

/* ─── Exposure Triangle (for stats) ─── */
function ExposureTriangle() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const labels = ["ISO", "APERTURE", "SHUTTER"];
  const values = stats.map((s) => s.value);
  const descriptions = stats.map((s) => s.label);

  // Triangle coordinates (equilateral, centered)
  const w = 280;
  const h = 250;
  const points = [
    { x: w / 2, y: 20 },       // top
    { x: 30, y: h - 20 },      // bottom-left
    { x: w - 30, y: h - 20 },  // bottom-right
  ];

  return (
    <div ref={ref} className="relative" style={{ width: w, height: h }}>
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        className="absolute inset-0"
      >
        {/* Triangle edges */}
        <motion.polygon
          points={points.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke={C.amber}
          strokeWidth={0.5}
          opacity={0.3}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 0.3 } : {}}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        {/* Dashed inner triangle */}
        <polygon
          points={points
            .map((p) => {
              const cx = w / 2;
              const cy = h / 2;
              return `${cx + (p.x - cx) * 0.6},${cy + (p.y - cy) * 0.6}`;
            })
            .join(" ")}
          fill="none"
          stroke={C.amber}
          strokeWidth={0.3}
          strokeDasharray="3 4"
          opacity={0.15}
        />
      </svg>

      {/* Stat nodes at each vertex */}
      {points.map((p, i) => (
        <motion.div
          key={i}
          className="absolute flex flex-col items-center"
          style={{
            left: p.x,
            top: p.y,
            transform: "translate(-50%, -50%)",
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 + i * 0.2 }}
        >
          <span
            className="text-[9px] font-[family-name:var(--font-jetbrains)] tracking-[0.2em] mb-1"
            style={{ color: C.dim }}
          >
            {labels[i]}
          </span>
          <span
            className="text-2xl font-[family-name:var(--font-space-grotesk)] font-bold"
            style={{ color: C.amber }}
          >
            {values[i]}
          </span>
          <span
            className="text-[10px] font-[family-name:var(--font-jetbrains)] tracking-[0.15em] mt-0.5"
            style={{ color: C.dim }}
          >
            {descriptions[i]}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Camera Status Bar ─── */
function CameraStatusBar() {
  const [time, setTime] = useState("00:00:00");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="flex items-center justify-between px-4 py-2 font-[family-name:var(--font-jetbrains)] text-[10px] tracking-wider"
      style={{
        background: `${C.surface}cc`,
        borderBottom: `1px solid ${C.cardBorder}`,
        color: C.dim,
      }}
    >
      <div className="flex items-center gap-4">
        <span style={{ color: C.amber }}>M</span>
        <span>AF-S</span>
        <span>VR ON</span>
      </div>
      <div className="flex items-center gap-4">
        <span>{time}</span>
        <span style={{ color: C.green }}>
          <span className="inline-block w-1.5 h-1.5 rounded-full mr-1" style={{ background: C.green }} />
          FOCUS
        </span>
        <span>[||||||||&middot;&middot;]</span>
        <span>372</span>
      </div>
    </div>
  );
}

/* ─── EXIF Type-In Text ─── */
function ExifTypeIn({ text, delay = 0 }: { text: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!isInView) return;
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) clearInterval(interval);
      }, 25);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [isInView, text, delay]);

  return (
    <span
      ref={ref}
      className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-wider"
      style={{ color: C.amber }}
    >
      {displayed}
      {displayed.length < text.length && isInView && (
        <span className="animate-pulse">_</span>
      )}
    </span>
  );
}

/* ─── Depth of Field Blur Edges ─── */
function DepthOfFieldEdges() {
  return (
    <>
      <div
        className="absolute top-0 left-0 right-0 h-24 pointer-events-none z-20"
        style={{
          background: `linear-gradient(to bottom, ${C.bg}ff, ${C.bg}00)`,
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-20"
        style={{
          background: `linear-gradient(to top, ${C.bg}ff, ${C.bg}00)`,
        }}
      />
    </>
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
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const exif = generateEXIF(index);
  const exifString = `ISO ${exif.iso}  |  f/${exif.aperture}  |  ${exif.shutter}  |  ${exif.focal}mm`;
  const isLive = index < 3; // First 3 projects are "live"

  return (
    <motion.div
      ref={ref}
      className="relative group"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.08, ease: "easeOut" }}
    >
      {/* Contact sheet frame */}
      <div
        className="relative overflow-hidden"
        style={{
          background: C.surface,
          border: `1px solid ${C.cardBorder}`,
        }}
      >
        {/* Top bar — frame number + recording dot */}
        <div
          className="flex items-center justify-between px-4 py-2"
          style={{ borderBottom: `1px solid ${C.cardBorder}` }}
        >
          <div className="flex items-center gap-3">
            <FocusRing number={index + 1} size={40} />
            <span
              className="font-[family-name:var(--font-jetbrains)] text-xs tracking-[0.2em]"
              style={{ color: C.amber }}
            >
              FR-{String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {isLive && (
              <motion.div
                className="flex items-center gap-1.5"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: C.red }}
                />
                <span
                  className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-wider"
                  style={{ color: C.red }}
                >
                  REC
                </span>
              </motion.div>
            )}
            <span
              className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-wider"
              style={{ color: C.dim }}
            >
              {project.year}
            </span>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex flex-col md:flex-row">
          {/* Image area */}
          <div className="relative md:w-2/5 aspect-[4/3] md:aspect-auto overflow-hidden">
            <img
              src={getProjectImage("aperture", project.image)}
              alt={project.title.replace("\n", " ")}
              className="w-full h-full object-cover transition-all duration-500"
              style={{ filter: "contrast(1.05) brightness(0.95)" }}
            />
            {/* Film border overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                boxShadow: `inset 0 0 30px ${C.bg}88, inset 0 0 2px ${C.bg}ff`,
              }}
            />

            {/* Green focus brackets on hover */}
            <div className="absolute inset-3 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              {/* Top-left bracket */}
              <div
                className="absolute top-0 left-0 w-5 h-5"
                style={{
                  borderTop: `2px solid ${C.green}`,
                  borderLeft: `2px solid ${C.green}`,
                }}
              />
              {/* Top-right bracket */}
              <div
                className="absolute top-0 right-0 w-5 h-5"
                style={{
                  borderTop: `2px solid ${C.green}`,
                  borderRight: `2px solid ${C.green}`,
                }}
              />
              {/* Bottom-left bracket */}
              <div
                className="absolute bottom-0 left-0 w-5 h-5"
                style={{
                  borderBottom: `2px solid ${C.green}`,
                  borderLeft: `2px solid ${C.green}`,
                }}
              />
              {/* Bottom-right bracket */}
              <div
                className="absolute bottom-0 right-0 w-5 h-5"
                style={{
                  borderBottom: `2px solid ${C.green}`,
                  borderRight: `2px solid ${C.green}`,
                }}
              />
              {/* Center crosshair */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-px" style={{ background: `${C.green}66` }} />
                <div className="absolute h-4 w-px" style={{ background: `${C.green}66` }} />
              </div>
            </div>

            {/* Focus confirmation */}
            <motion.div
              className="absolute bottom-2 left-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
            >
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: C.green }}
              />
              <span
                className="font-[family-name:var(--font-jetbrains)] text-[9px] tracking-wider"
                style={{ color: C.green }}
              >
                IN FOCUS
              </span>
            </motion.div>
          </div>

          {/* Info area */}
          <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[0.15em] uppercase"
                  style={{ color: C.dim }}
                >
                  {project.client}
                </span>
              </div>
              <h3
                className="text-xl md:text-2xl font-[family-name:var(--font-space-grotesk)] font-medium leading-tight mb-3"
                style={{ color: C.text }}
              >
                {project.title.replace("\n", " ")}
              </h3>
              <p
                className="text-sm leading-relaxed mb-4 font-[family-name:var(--font-inter)]"
                style={{ color: C.dim }}
              >
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] px-2 py-1 font-[family-name:var(--font-jetbrains)] tracking-wider uppercase"
                    style={{
                      color: C.text,
                      background: `${C.amber}0d`,
                      border: `1px solid ${C.amber}18`,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Focus distance scale */}
            <div className="mb-3">
              <div className="flex items-center gap-1 mb-1">
                {focusDistances.map((d, di) => (
                  <div key={di} className="flex flex-col items-center" style={{ flex: 1 }}>
                    <div
                      className="w-px h-2 mb-0.5"
                      style={{
                        background:
                          di === index % focusDistances.length
                            ? C.amber
                            : `${C.dim}44`,
                      }}
                    />
                    <span
                      className="text-[7px] font-[family-name:var(--font-jetbrains)]"
                      style={{
                        color:
                          di === index % focusDistances.length
                            ? C.amber
                            : `${C.dim}66`,
                      }}
                    >
                      {d}
                    </span>
                  </div>
                ))}
              </div>
              <div className="h-px w-full" style={{ background: `${C.dim}22` }} />
            </div>
          </div>
        </div>

        {/* EXIF strip at bottom */}
        <div
          className="px-4 py-2 flex items-center justify-between"
          style={{
            background: `${C.bg}cc`,
            borderTop: `1px solid ${C.cardBorder}`,
          }}
        >
          <ExifTypeIn text={exifString} delay={index * 200} />
          <span
            className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-wider"
            style={{ color: C.dim }}
          >
            RAW + JPEG
          </span>
        </div>
      </div>
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
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const fStops = ["f/1.4", "f/2.0", "f/2.8", "f/4.0"];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      className="relative p-6"
      style={{
        background: C.surface,
        border: `1px solid ${C.cardBorder}`,
      }}
    >
      {/* Top row: aperture value + lens label */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ border: `1px solid ${C.amber}33` }}
          >
            <span
              className="text-[11px] font-[family-name:var(--font-jetbrains)] font-medium"
              style={{ color: C.amber }}
            >
              {fStops[index]}
            </span>
          </div>
          <span
            className="text-[10px] font-[family-name:var(--font-jetbrains)] tracking-[0.2em] uppercase"
            style={{ color: C.dim }}
          >
            LENS {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        {/* Small aperture icon */}
        <svg width="20" height="20" viewBox="0 0 20 20">
          <circle
            cx="10"
            cy="10"
            r="8"
            fill="none"
            stroke={C.amber}
            strokeWidth="0.5"
            opacity="0.3"
          />
          <circle
            cx="10"
            cy="10"
            r="3"
            fill="none"
            stroke={C.amber}
            strokeWidth="0.3"
            opacity="0.2"
          />
        </svg>
      </div>

      <h3
        className="text-lg font-[family-name:var(--font-space-grotesk)] font-medium mb-2"
        style={{ color: C.text }}
      >
        {item.title}
      </h3>
      <p
        className="text-sm leading-relaxed font-[family-name:var(--font-inter)]"
        style={{ color: C.dim }}
      >
        {item.body}
      </p>

      {/* Bottom decorative bar */}
      <div className="mt-4 flex items-center gap-2">
        <div
          className="flex-1 h-px"
          style={{ background: `${C.amber}15` }}
        />
        <span
          className="text-[8px] font-[family-name:var(--font-jetbrains)] tracking-[0.3em]"
          style={{ color: `${C.dim}66` }}
        >
          MTF
        </span>
        <div className="flex gap-px">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="w-1"
              style={{
                height: 4 + Math.random() * 8,
                background: C.amber,
                opacity: 0.15 + (i / 8) * 0.3,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Tool Card ─── */
function ToolCard({
  category,
  index,
}: {
  category: (typeof tools)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="p-4"
      style={{
        background: C.surface,
        border: `1px solid ${C.cardBorder}`,
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span
          className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[0.2em]"
          style={{ color: C.amber }}
        >
          BANK {String(index + 1).padStart(2, "0")}
        </span>
        <div className="flex-1 h-px" style={{ background: `${C.dim}22` }} />
        <span
          className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-wider uppercase"
          style={{ color: C.dim }}
        >
          {category.label}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {category.items.map((item) => (
          <span
            key={item}
            className="text-[11px] px-2 py-1 font-[family-name:var(--font-jetbrains)] tracking-wider transition-colors duration-200 cursor-default hover:border-opacity-100"
            style={{
              color: C.text,
              background: `${C.amber}08`,
              border: `1px solid ${C.amber}15`,
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */

export default function AperturePage() {
  const [, setTick] = useState(0);

  // Force a re-render after mount for hydration-safe random values
  useEffect(() => {
    setTick(1);
  }, []);

  return (
    <div
      className="relative min-h-screen font-[family-name:var(--font-inter)]"
      style={{ background: C.bg, color: C.text }}
    >
      {/* ─── BOKEH BACKGROUND ─── */}
      <BokehField />

      {/* ─── FILM SPROCKET — TOP ─── */}
      <div className="relative z-30">
        <FilmSprocketStrip />
      </div>

      {/* ─── CAMERA STATUS BAR ─── */}
      <div className="sticky top-0 z-50">
        <CameraStatusBar />
      </div>

      {/* ═══ HERO ═══ */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Depth of field edges */}
        <DepthOfFieldEdges />

        {/* Viewfinder overlay */}
        <ViewfinderOverlay />

        {/* Large aperture blade SVG — background */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ApertureBlades size={600} className="opacity-30 hidden md:block" />
          <ApertureBlades size={350} className="opacity-30 md:hidden" />
        </motion.div>

        {/* REC indicator — top right */}
        <motion.div
          className="absolute top-6 right-6 z-20 flex items-center gap-2"
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: C.red }} />
          <span
            className="font-[family-name:var(--font-jetbrains)] text-xs tracking-[0.2em]"
            style={{ color: C.red }}
          >
            REC
          </span>
        </motion.div>

        {/* Mode dial — top left */}
        <div className="absolute top-6 left-6 z-20">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ border: `1px solid ${C.amber}44` }}
            >
              <span
                className="font-[family-name:var(--font-jetbrains)] text-[10px] font-bold"
                style={{ color: C.amber }}
              >
                M
              </span>
            </div>
            <div className="flex flex-col">
              <span
                className="font-[family-name:var(--font-jetbrains)] text-[9px] tracking-[0.2em]"
                style={{ color: C.dim }}
              >
                MODE
              </span>
              <span
                className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-wider"
                style={{ color: C.amber }}
              >
                MANUAL
              </span>
            </div>
          </div>
        </div>

        {/* Hero content */}
        <motion.div
          className="relative z-20 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          {/* Shutter count label */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-12" style={{ background: `${C.amber}44` }} />
            <span
              className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[0.4em] uppercase"
              style={{ color: C.dim }}
            >
              Shutter Count: 30,847
            </span>
            <div className="h-px w-12" style={{ background: `${C.amber}44` }} />
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-[family-name:var(--font-space-grotesk)] font-bold leading-[1.05] mb-6"
            style={{ color: C.text }}
          >
            I turn AI models
            <br />
            into products
            <br />
            <span style={{ color: C.amber }}>people use</span>
          </h1>

          <p
            className="text-sm md:text-base max-w-lg mx-auto leading-relaxed mb-10 font-[family-name:var(--font-inter)]"
            style={{ color: C.dim }}
          >
            Building production AI applications with the precision of a
            carefully calibrated lens. Multi-model orchestration to
            pixel-perfect interfaces.
          </p>

          {/* Exposure Triangle — Stats */}
          <div className="flex justify-center mb-8">
            <ExposureTriangle />
          </div>

          {/* Camera info bar */}
          <div
            className="inline-flex items-center gap-6 px-6 py-3"
            style={{
              background: `${C.surface}cc`,
              border: `1px solid ${C.cardBorder}`,
            }}
          >
            <span
              className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-wider"
              style={{ color: C.dim }}
            >
              50mm f/1.4
            </span>
            <span style={{ color: `${C.dim}44` }}>|</span>
            <span
              className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-wider"
              style={{ color: C.amber }}
            >
              1/250s
            </span>
            <span style={{ color: `${C.dim}44` }}>|</span>
            <span
              className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-wider"
              style={{ color: C.dim }}
            >
              ISO 400
            </span>
            <span style={{ color: `${C.dim}44` }}>|</span>
            <span
              className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-wider flex items-center gap-1"
              style={{ color: C.green }}
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ background: C.green }}
              />
              AF LOCK
            </span>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <div
            className="w-px h-10 mx-auto mb-2"
            style={{
              background: `linear-gradient(to bottom, ${C.amber}, transparent)`,
            }}
          />
          <span
            className="text-[8px] font-[family-name:var(--font-jetbrains)] tracking-[0.4em]"
            style={{ color: `${C.dim}66` }}
          >
            SCROLL
          </span>
        </motion.div>
      </section>

      {/* ═══ PROJECTS ═══ */}
      <section id="projects" className="relative z-10 py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Section header */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <span
                className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[0.4em] uppercase"
                style={{ color: C.amber }}
              >
                Roll 01 / {projects.length} Frames
              </span>
              <div
                className="flex-1 h-px"
                style={{ background: `${C.amber}22` }}
              />
              <span
                className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-wider"
                style={{ color: C.dim }}
              >
                35mm FULL FRAME
              </span>
            </div>
            <h2
              className="text-3xl md:text-4xl font-[family-name:var(--font-space-grotesk)] font-bold"
              style={{ color: C.text }}
            >
              Contact Sheet
            </h2>
          </motion.div>

          {/* Film sprocket top */}
          <FilmSprocketStrip />

          {/* Project cards — single column */}
          <div className="flex flex-col gap-6 mt-6">
            {projects.map((project, i) => (
              <ProjectCard key={project.title} project={project} index={i} />
            ))}
          </div>

          {/* Film sprocket bottom */}
          <div className="mt-6">
            <FilmSprocketStrip />
          </div>

          {/* Film edge markings */}
          <div className="flex justify-between mt-3">
            <span
              className="font-[family-name:var(--font-jetbrains)] text-[9px] tracking-wider"
              style={{ color: `${C.dim}44` }}
            >
              KODAK PORTRA 400 135-36
            </span>
            <span
              className="font-[family-name:var(--font-jetbrains)] text-[9px] tracking-wider"
              style={{ color: `${C.dim}44` }}
            >
              DX 25 26 27 28 29 30 31 32 33 34 35 36
            </span>
          </div>
        </div>
      </section>

      {/* ═══ EXPERTISE ═══ */}
      <section id="expertise" className="relative z-10 py-24">
        <div className="relative">
          <DepthOfFieldEdges />
          <div className="max-w-[1200px] mx-auto px-6">
            {/* Section header */}
            <motion.div
              className="mb-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <span
                  className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[0.4em] uppercase"
                  style={{ color: C.amber }}
                >
                  Lens Collection
                </span>
                <div
                  className="flex-1 h-px"
                  style={{ background: `${C.amber}22` }}
                />
                <span
                  className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-wider"
                  style={{ color: C.dim }}
                >
                  {expertise.length} PRIMES
                </span>
              </div>
              <h2
                className="text-3xl md:text-4xl font-[family-name:var(--font-space-grotesk)] font-bold"
                style={{ color: C.text }}
              >
                Expertise
              </h2>
            </motion.div>

            {/* Expertise grid — 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {expertise.map((item, i) => (
                <ExpertiseCard key={item.title} item={item} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TOOLS ═══ */}
      <section id="tools" className="relative z-10 py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Section header */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <span
                className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[0.4em] uppercase"
                style={{ color: C.amber }}
              >
                Equipment Rack
              </span>
              <div
                className="flex-1 h-px"
                style={{ background: `${C.amber}22` }}
              />
              <span
                className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-wider"
                style={{ color: C.dim }}
              >
                {tools.length} BANKS
              </span>
            </div>
            <h2
              className="text-3xl md:text-4xl font-[family-name:var(--font-space-grotesk)] font-bold"
              style={{ color: C.text }}
            >
              Toolkit
            </h2>
          </motion.div>

          {/* Tools grid — 3 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((category, i) => (
              <ToolCard key={category.label} category={category} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="relative z-10 py-20" style={{ borderTop: `1px solid ${C.cardBorder}` }}>
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          {/* Camera status line */}
          <div
            className="flex items-center justify-center gap-4 text-[10px] font-[family-name:var(--font-jetbrains)] tracking-[0.2em] mb-8 flex-wrap"
            style={{ color: `${C.dim}66` }}
          >
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ background: C.green }}
              />
              SENSOR CLEAN
            </span>
            <span>|</span>
            <span>FIRMWARE 4.20</span>
            <span>|</span>
            <span>SHUTTER: 30,847</span>
            <span>|</span>
            <span style={{ color: C.amber }}>BODY TEMP: OK</span>
          </div>

          {/* Decorative aperture */}
          <div className="flex justify-center mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
              <ApertureBlades size={80} bladeCount={6} />
            </motion.div>
          </div>

          <h3
            className="text-xl font-[family-name:var(--font-space-grotesk)] font-medium mb-3"
            style={{ color: C.text }}
          >
            Every frame, precisely exposed.
          </h3>
          <p
            className="font-[family-name:var(--font-jetbrains)] text-[11px] tracking-[0.2em] mb-4"
            style={{ color: C.dim }}
          >
            f/2.8 &bull; 1/125s &bull; ISO 400 &bull; 50mm
          </p>
          <p
            className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[0.15em] mb-12"
            style={{ color: `${C.dim}55` }}
          >
            &copy; 2025 GROX &middot; APERTURE THEME
          </p>

          {/* Theme Switcher */}
          <ThemeSwitcher current="/aperture" />
        </div>
      </footer>

      {/* ─── FILM SPROCKET — BOTTOM ─── */}
      <div className="relative z-30">
        <FilmSprocketStrip />
      </div>
    </div>
  );
}
