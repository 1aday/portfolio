"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { getProjectImage } from "@/lib/theme-images";

/* ─── Pavilion Palette ─── */
const P = {
  white: "#FFFFFF",
  red: "#FF4500",
  concrete: "#C0C0C0",
  steel: "#4A6FA5",
  wood: "#8B6F47",
  teal: "#2ECBE9",
  charcoal: "#1A1A1A",
  lightGray: "#F5F5F5",
  offWhite: "#FAFAFA",
  midGray: "#E8E8E8",
  darkGray: "#333333",
};

/* ─── Wing accent colors for expertise ─── */
const wingColors = [P.red, P.steel, P.teal, P.wood];

/* ═══════════════════════════════════════════════
   SVG DECORATIONS — Atomic Starburst, Globe, etc.
   ═══════════════════════════════════════════════ */

/* Atomic starburst: central dot with radiating lines + endpoint dots */
function AtomicStarburst({
  size = 80,
  color = P.red,
  className = "",
  style = {},
}: {
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const rayLen = size * 0.42;
  const rays = 12;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      className={className}
      style={style}
    >
      {/* Central dot */}
      <circle cx={cx} cy={cy} r={size * 0.04} fill={color} />
      {/* Radiating lines + endpoint dots */}
      {Array.from({ length: rays }).map((_, i) => {
        const angle = (i * 360) / rays;
        const rad = (angle * Math.PI) / 180;
        const x2 = cx + rayLen * Math.cos(rad);
        const y2 = cy + rayLen * Math.sin(rad);
        return (
          <g key={i}>
            <line
              x1={cx}
              y1={cy}
              x2={x2}
              y2={y2}
              stroke={color}
              strokeWidth={size * 0.01}
              opacity={i % 2 === 0 ? 0.9 : 0.5}
            />
            <circle
              cx={x2}
              cy={y2}
              r={i % 2 === 0 ? size * 0.025 : size * 0.015}
              fill={color}
              opacity={i % 2 === 0 ? 1 : 0.6}
            />
          </g>
        );
      })}
      {/* Inner orbit ring */}
      <circle
        cx={cx}
        cy={cy}
        r={size * 0.18}
        stroke={color}
        strokeWidth={size * 0.006}
        fill="none"
        opacity={0.3}
      />
    </svg>
  );
}

/* Modernist globe: latitude/longitude lines */
function ModernistGlobe({ size = 60, color = P.charcoal }: { size?: number; color?: string }) {
  const cx = size / 2, cy = size / 2, r = size * 0.42;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <circle cx={cx} cy={cy} r={r} stroke={color} strokeWidth={1.2} />
      {[-0.5, 0, 0.5].map((frac, i) => {
        const y = cy + frac * r, halfW = Math.sqrt(r * r - (frac * r) * (frac * r));
        return <line key={`lat-${i}`} x1={cx - halfW} y1={y} x2={cx + halfW} y2={y} stroke={color} strokeWidth={0.8} opacity={0.5} />;
      })}
      <ellipse cx={cx} cy={cy} rx={r * 0.35} ry={r} stroke={color} strokeWidth={0.8} opacity={0.5} />
      <ellipse cx={cx} cy={cy} rx={r * 0.7} ry={r} stroke={color} strokeWidth={0.8} opacity={0.3} />
      <line x1={cx} y1={cy - r} x2={cx} y2={cy + r} stroke={color} strokeWidth={0.8} opacity={0.5} />
      <circle cx={cx} cy={cy - r - 3} r={1.5} fill={color} />
    </svg>
  );
}

/* Sputnik star: 4-pointed star with orbital ring */
function SputnikStar({ size = 24, color = P.red }: { size?: number; color?: string }) {
  const c = size / 2, outer = size * 0.45, inner = size * 0.12;
  const points = Array.from({ length: 8 }).map((_, i) => {
    const angle = (i * 45 - 90) * (Math.PI / 180), r = i % 2 === 0 ? outer : inner;
    return `${c + r * Math.cos(angle)},${c + r * Math.sin(angle)}`;
  }).join(" ");
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <polygon points={points} fill={color} />
      <circle cx={c} cy={c} r={size * 0.3} stroke={color} strokeWidth={0.6} opacity={0.3} />
    </svg>
  );
}

/* Pennant flag SVG */
function Pennant({ color = P.red, width = 32, height = 20 }: { color?: string; width?: number; height?: number }) {
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      <polygon points={`0,0 ${width},${height * 0.35} 0,${height * 0.7}`} fill={color} opacity={0.85} />
      <line x1="0" y1="0" x2="0" y2={height} stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

/* Display case frame: thin borders + pedestal base */
function DisplayCaseFrame({ children, className = "", cantilevered = "none" }: { children: React.ReactNode; className?: string; cantilevered?: "left" | "right" | "none" }) {
  const offset = cantilevered === "left" ? "sm:-translate-x-6" : cantilevered === "right" ? "sm:translate-x-6" : "";
  return (
    <div className={`relative ${offset} ${className}`}>
      <div className="absolute inset-0 pointer-events-none" style={{ border: `1px solid ${P.concrete}50`, boxShadow: `inset 0 0 30px ${P.concrete}08` }} />
      <div className="absolute -bottom-2 left-[10%] right-[10%] h-2 pointer-events-none" style={{ background: `linear-gradient(to bottom, ${P.concrete}30, ${P.concrete}10)`, borderLeft: `1px solid ${P.concrete}25`, borderRight: `1px solid ${P.concrete}25`, borderBottom: `1px solid ${P.concrete}25` }} />
      <div className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none" style={{ background: P.red }} />
      {children}
    </div>
  );
}

/* Mid-century decorative dots row */
function AtomicDots({ count = 5, color = P.red, dotSize = 4, gap = 12 }: { count?: number; color?: string; dotSize?: number; gap?: number }) {
  const width = count * dotSize + (count - 1) * gap;
  return (
    <svg width={width} height={dotSize} viewBox={`0 0 ${width} ${dotSize}`} fill="none">
      {Array.from({ length: count }).map((_, i) => (
        <circle key={i} cx={dotSize / 2 + i * (dotSize + gap)} cy={dotSize / 2} r={dotSize / 2} fill={color} opacity={i === Math.floor(count / 2) ? 1 : 0.4} />
      ))}
    </svg>
  );
}

/* ─── Scroll-triggered reveal wrapper ─── */
function Reveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right";
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const initial =
    direction === "left"
      ? { opacity: 0, x: -50 }
      : direction === "right"
        ? { opacity: 0, x: 50 }
        : { opacity: 0, y: 40 };
  const animate =
    direction === "left"
      ? { opacity: 1, x: 0 }
      : direction === "right"
        ? { opacity: 1, x: 0 }
        : { opacity: 1, y: 0 };

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={isInView ? animate : initial}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Exhibition project card ─── */
function ExhibitCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const num = String(index + 1).padStart(2, "0");
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      <DisplayCaseFrame
        cantilevered={isEven ? "left" : "right"}
        className="group bg-white hover:shadow-lg transition-shadow duration-700"
      >
        <div className="p-6 sm:p-8">
          {/* Exhibit header bar */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <span
                className="font-[family-name:var(--font-space-grotesk)] text-[11px] font-bold uppercase tracking-[0.25em]"
                style={{ color: P.red }}
              >
                Exhibit {num}
              </span>
              <AtomicDots count={3} dotSize={3} gap={6} color={P.concrete} />
            </div>
            <div className="flex items-center gap-2">
              <span
                className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.15em]"
                style={{ color: P.concrete }}
              >
                {project.year}
              </span>
              <SputnikStar size={14} color={P.red} />
            </div>
          </div>

          {/* Project image */}
          <div
            className="relative overflow-hidden mb-6"
            style={{
              aspectRatio: "16/9",
              border: `1px solid ${P.midGray}`,
            }}
          >
            <img
              src={getProjectImage("pavilion", project.image)}
              alt={project.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: `linear-gradient(135deg, ${P.red}10 0%, transparent 50%)`,
              }}
            />
            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none">
              <div
                className="absolute top-0 right-0 w-full h-full"
                style={{
                  background: `linear-gradient(225deg, ${P.red} 0%, ${P.red} 50%, transparent 50%)`,
                }}
              />
            </div>
          </div>

          {/* Client & category */}
          <div className="flex items-center gap-2 mb-3">
            <Pennant color={P.red} width={18} height={12} />
            <span
              className="font-[family-name:var(--font-space-grotesk)] text-[10px] uppercase tracking-[0.2em] font-medium"
              style={{ color: P.wood }}
            >
              {project.client}
            </span>
          </div>

          {/* Title */}
          <h3
            className="font-[family-name:var(--font-space-grotesk)] font-bold leading-[1.15] whitespace-pre-line mb-4"
            style={{
              fontSize: "clamp(1.2rem, 2.4vw, 1.6rem)",
              color: P.charcoal,
            }}
          >
            {project.title}
          </h3>

          {/* Description */}
          <p
            className="font-[family-name:var(--font-inter)] text-[13px] leading-[1.8] mb-4"
            style={{ color: P.darkGray }}
          >
            {project.description}
          </p>

          {/* Technical detail */}
          <p
            className="font-[family-name:var(--font-inter)] text-[12px] leading-[1.7] italic mb-5"
            style={{ color: `${P.concrete}` }}
          >
            {project.technical}
          </p>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {project.tech.map((t) => (
              <span
                key={t}
                className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-[0.1em] px-3 py-1"
                style={{
                  color: P.steel,
                  background: `${P.steel}0C`,
                  border: `1px solid ${P.steel}25`,
                }}
              >
                {t}
              </span>
            ))}
          </div>

          {/* Link */}
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-[family-name:var(--font-space-grotesk)] text-[11px] uppercase tracking-[0.15em] font-medium transition-colors duration-300"
            style={{ color: P.red }}
            onMouseEnter={(e) => (e.currentTarget.style.color = P.charcoal)}
            onMouseLeave={(e) => (e.currentTarget.style.color = P.red)}
          >
            View Exhibit
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </a>
        </div>
      </DisplayCaseFrame>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   PAVILION PAGE — World's Fair Modernism
   ═══════════════════════════════════════════════════ */
export default function PavilionPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main
      className="min-h-screen overflow-hidden font-[family-name:var(--font-inter)]"
      style={{ background: P.white, color: P.charcoal }}
    >
      <style jsx global>{`
        @keyframes pavilion-starburst-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pavilion-pennant-flutter {
          0%, 100% { transform: rotate(0deg) scaleX(1); }
          25% { transform: rotate(-2deg) scaleX(0.95); }
          50% { transform: rotate(0deg) scaleX(1); }
          75% { transform: rotate(1.5deg) scaleX(0.97); }
        }
        @keyframes pavilion-wipe-in {
          from { clip-path: inset(0 100% 0 0); }
          to { clip-path: inset(0 0% 0 0); }
        }
        @keyframes pavilion-slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pavilion-orbit {
          from { transform: rotate(0deg) translateX(20px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(20px) rotate(-360deg); }
        }
        @keyframes pavilion-pulse-dot {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        @keyframes pavilion-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pavilion-ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes pavilion-marquee-line {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        .pavilion-starburst-spin {
          animation: pavilion-starburst-rotate 30s linear infinite;
        }
        .pavilion-starburst-spin-slow {
          animation: pavilion-starburst-rotate 45s linear infinite;
        }
        .pavilion-pennant {
          animation: pavilion-pennant-flutter 3s ease-in-out infinite;
          transform-origin: left center;
        }
        .pavilion-wipe {
          animation: pavilion-wipe-in 1.2s ease-out forwards;
        }
        .pavilion-float {
          animation: pavilion-float 4s ease-in-out infinite;
        }
        .pavilion-ticker-track {
          animation: pavilion-ticker 25s linear infinite;
        }
        .pavilion-pulse-dot {
          animation: pavilion-pulse-dot 2s ease-in-out infinite;
        }
      `}</style>

      {/* ─── Fixed navigation ─── */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b"
        style={{
          background: `${P.white}EE`,
          borderColor: P.midGray,
        }}
      >
        <div className="mx-auto max-w-[1200px] px-4 sm:px-10 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SputnikStar size={20} color={P.red} />
            <span
              className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold tracking-[0.15em] uppercase"
              style={{ color: P.charcoal }}
            >
              Gr<span style={{ color: P.red }}>o</span>x
            </span>
          </div>
          <div className="flex items-center gap-6 sm:gap-8">
            {[
              { label: "Exhibits", href: "#exhibits" },
              { label: "Pavilions", href: "#pavilions" },
              { label: "Directory", href: "#directory" },
              { label: "GitHub", href: "https://github.com/1aday", external: true },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="font-[family-name:var(--font-space-grotesk)] text-[10px] uppercase tracking-[0.2em] font-medium transition-colors duration-300"
                style={{ color: P.darkGray }}
                onMouseEnter={(e) => (e.currentTarget.style.color = P.red)}
                onMouseLeave={(e) => (e.currentTarget.style.color = P.darkGray)}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* ═══════════════════════════════════════
         HERO — Exhibition Banner
         ═══════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background starburst - slowly rotating */}
        <div
          className="absolute pavilion-starburst-spin pointer-events-none"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            opacity: 0.04,
          }}
        >
          <AtomicStarburst size={900} color={P.charcoal} />
        </div>

        {/* Secondary smaller starburst */}
        <div
          className="absolute pavilion-starburst-spin-slow pointer-events-none"
          style={{
            top: "20%",
            right: "8%",
            opacity: 0.06,
          }}
        >
          <AtomicStarburst size={200} color={P.red} />
        </div>

        {/* Decorative horizontal lines */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[20, 40, 60, 80].map((pct) => (
            <div
              key={pct}
              className="absolute left-0 right-0 h-[1px]"
              style={{
                top: `${pct}%`,
                background: `linear-gradient(90deg, transparent 0%, ${P.midGray}60 20%, ${P.midGray}60 80%, transparent 100%)`,
              }}
            />
          ))}
        </div>

        <div className="relative text-center px-4 pt-24 sm:pt-0 max-w-[1000px] mx-auto">
          {/* Pennant and subtitle */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <div
              className="h-[1px] w-16 sm:w-24"
              style={{ background: `linear-gradient(90deg, transparent, ${P.red})` }}
            />
            <div className="flex items-center gap-3">
              <div className="pavilion-pennant">
                <Pennant color={P.red} width={24} height={14} />
              </div>
              <span
                className="font-[family-name:var(--font-space-grotesk)] text-[11px] uppercase tracking-[0.35em] font-medium"
                style={{ color: P.red }}
              >
                World&apos;s Fair MMXXV
              </span>
              <div className="pavilion-pennant" style={{ transform: "scaleX(-1)" }}>
                <Pennant color={P.red} width={24} height={14} />
              </div>
            </div>
            <div
              className="h-[1px] w-16 sm:w-24"
              style={{ background: `linear-gradient(90deg, ${P.red}, transparent)` }}
            />
          </motion.div>

          {/* Main title */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-[family-name:var(--font-space-grotesk)] font-bold uppercase leading-[0.9] tracking-[-0.02em]"
            style={{
              fontSize: "clamp(3.5rem, 12vw, 10rem)",
              color: P.charcoal,
            }}
          >
            P<span style={{ color: P.red }}>A</span>VIL
            <br />
            <span className="flex items-center justify-center gap-4 sm:gap-6">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="pavilion-starburst-spin inline-block"
              >
                <AtomicStarburst size={40} color={P.red} />
              </motion.span>
              ION
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.0 }}
            className="mt-8 font-[family-name:var(--font-inter)] text-[15px] sm:text-[17px] leading-[1.8] max-w-xl mx-auto font-light"
            style={{ color: P.darkGray }}
          >
            End-to-end AI product ownership &mdash; from computer vision and
            multi-model orchestration to pixel-perfect interfaces.
          </motion.p>

          {/* Decorative divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 1.3 }}
            className="mx-auto mt-10 mb-10 flex items-center justify-center gap-3"
            style={{ transformOrigin: "center" }}
          >
            <div
              className="h-[1px] w-20"
              style={{ background: P.concrete }}
            />
            <SputnikStar size={16} color={P.red} />
            <div
              className="h-[1px] w-20"
              style={{ background: P.concrete }}
            />
          </motion.div>

          {/* Stats as exhibit numbers */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="flex justify-center gap-10 sm:gap-16"
          >
            {stats.map((stat, i) => (
              <div key={stat.label} className="text-center">
                <div
                  className="font-[family-name:var(--font-space-grotesk)] text-[10px] uppercase tracking-[0.3em] font-medium mb-2"
                  style={{ color: P.red }}
                >
                  Exhibit {String.fromCharCode(65 + i)}
                </div>
                <div
                  className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-5xl font-bold"
                  style={{ color: P.charcoal }}
                >
                  {stat.value}
                </div>
                <div
                  className="font-[family-name:var(--font-inter)] text-[11px] uppercase tracking-[0.2em] mt-1"
                  style={{ color: P.concrete }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span
            className="font-[family-name:var(--font-space-grotesk)] text-[9px] uppercase tracking-[0.3em]"
            style={{ color: P.concrete }}
          >
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-[1px] h-8"
            style={{ background: `linear-gradient(to bottom, ${P.red}, transparent)` }}
          />
        </motion.div>
      </section>

      {/* ─── World's Fair banner divider ─── */}
      <div
        className="py-5 overflow-hidden"
        style={{ background: P.charcoal }}
      >
        <div className="flex items-center justify-center gap-6">
          <AtomicDots count={3} dotSize={4} gap={10} color={P.red} />
          <span
            className="font-[family-name:var(--font-space-grotesk)] text-[11px] uppercase tracking-[0.4em] font-bold"
            style={{ color: P.white }}
          >
            The Exhibition
          </span>
          <SputnikStar size={16} color={P.red} />
          <span
            className="font-[family-name:var(--font-space-grotesk)] text-[11px] uppercase tracking-[0.4em] font-bold"
            style={{ color: P.white }}
          >
            Begins
          </span>
          <AtomicDots count={3} dotSize={4} gap={10} color={P.red} />
        </div>
      </div>

      {/* ═══════════════════════════════════════
         PROJECTS — Exhibition Display Cases
         ═══════════════════════════════════════ */}
      <section
        id="exhibits"
        className="py-20 sm:py-32"
        style={{ background: P.offWhite }}
      >
        <div className="mx-auto max-w-[1100px] px-4 sm:px-10">
          {/* Section header with pennant */}
          <Reveal className="text-center mb-16 sm:mb-24">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="pavilion-pennant">
                <Pennant color={P.steel} width={20} height={12} />
              </div>
              <span
                className="font-[family-name:var(--font-space-grotesk)] text-[10px] uppercase tracking-[0.35em] font-medium"
                style={{ color: P.steel }}
              >
                Exhibition Hall
              </span>
            </div>
            <h2
              className="font-[family-name:var(--font-space-grotesk)] font-bold uppercase tracking-[-0.01em] leading-[1.05]"
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                color: P.charcoal,
              }}
            >
              Featured{" "}
              <span style={{ color: P.red }}>Exhibits</span>
            </h2>
            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="h-[1px] w-12" style={{ background: P.concrete }} />
              <AtomicDots count={5} dotSize={3} gap={8} color={P.red} />
              <div className="h-[1px] w-12" style={{ background: P.concrete }} />
            </div>
          </Reveal>

          {/* Project grid — cantilevered alternating layout */}
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-12 sm:gap-y-16">
            {projects.map((project, i) => (
              <ExhibitCard key={project.title} project={project} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Divider bar ─── */}
      <div
        className="py-3"
        style={{
          background: `linear-gradient(90deg, ${P.red}, ${P.steel}, ${P.teal}, ${P.wood})`,
        }}
      />

      {/* ═══════════════════════════════════════
         EXPERTISE — Four Pavilion Wings
         ═══════════════════════════════════════ */}
      <section id="pavilions" className="py-20 sm:py-32" style={{ background: P.white }}>
        <div className="mx-auto max-w-[1100px] px-4 sm:px-10">
          {/* Section header */}
          <Reveal className="text-center mb-16 sm:mb-24">
            <div className="flex items-center justify-center gap-3 mb-6">
              <ModernistGlobe size={28} color={P.charcoal} />
            </div>
            <h2
              className="font-[family-name:var(--font-space-grotesk)] font-bold uppercase tracking-[-0.01em] leading-[1.05]"
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                color: P.charcoal,
              }}
            >
              Pavilion{" "}
              <span style={{ color: P.red }}>Wings</span>
            </h2>
            <p
              className="font-[family-name:var(--font-inter)] text-[14px] leading-[1.8] mt-4 max-w-lg mx-auto"
              style={{ color: P.darkGray }}
            >
              Each wing showcases a distinct discipline of AI product development.
            </p>
          </Reveal>

          {/* Four wings */}
          <div className="grid sm:grid-cols-2 gap-8">
            {expertise.map((item, i) => {
              const accent = wingColors[i];
              return (
                <Reveal
                  key={item.title}
                  delay={i * 0.1}
                  direction={i % 2 === 0 ? "left" : "right"}
                >
                  <div
                    className="relative group p-8 sm:p-10 transition-all duration-500 overflow-hidden"
                    style={{
                      background: P.white,
                      border: `1px solid ${P.midGray}`,
                    }}
                  >
                    {/* Left accent bar */}
                    <div
                      className="absolute top-0 left-0 w-1 h-full transition-all duration-500 group-hover:w-2"
                      style={{ background: accent }}
                    />

                    {/* Hover starburst background */}
                    <div
                      className="absolute -top-10 -right-10 opacity-0 group-hover:opacity-[0.04] transition-opacity duration-700 pavilion-starburst-spin-slow"
                    >
                      <AtomicStarburst size={180} color={accent} />
                    </div>

                    {/* Wing number + pennant */}
                    <div className="flex items-center gap-3 mb-5 relative z-10">
                      <div
                        className="font-[family-name:var(--font-space-grotesk)] text-[40px] font-bold leading-none"
                        style={{ color: accent, opacity: 0.2 }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="pavilion-pennant">
                          <Pennant color={accent} width={16} height={10} />
                        </div>
                        <span
                          className="font-[family-name:var(--font-space-grotesk)] text-[9px] uppercase tracking-[0.25em] font-medium"
                          style={{ color: accent }}
                        >
                          Wing {String.fromCharCode(65 + i)}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3
                      className="font-[family-name:var(--font-space-grotesk)] font-bold text-lg sm:text-xl tracking-tight mb-3 relative z-10"
                      style={{ color: P.charcoal }}
                    >
                      {item.title}
                    </h3>

                    {/* Body */}
                    <p
                      className="font-[family-name:var(--font-inter)] text-[13px] leading-[1.8] relative z-10"
                      style={{ color: P.darkGray }}
                    >
                      {item.body}
                    </p>

                    {/* Bottom decorative dots */}
                    <div className="mt-6 relative z-10">
                      <AtomicDots count={4} dotSize={3} gap={8} color={accent} />
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Decorative World's Fair band ─── */}
      <div
        className="py-6 overflow-hidden"
        style={{ background: P.charcoal }}
      >
        <div className="relative w-full overflow-hidden">
          <div className="flex pavilion-ticker-track whitespace-nowrap">
            {Array.from({ length: 4 }).map((_, rep) => (
              <span key={rep} className="flex items-center gap-6 px-6">
                {tools.flatMap((g) => g.items).map((item, j) => (
                  <span key={`${rep}-${j}`} className="flex items-center gap-6">
                    <span
                      className="font-[family-name:var(--font-space-grotesk)] text-[13px] uppercase tracking-[0.15em] font-medium"
                      style={{ color: `${P.white}BB` }}
                    >
                      {item}
                    </span>
                    <SputnikStar size={10} color={P.red} />
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
         TOOLS — Exhibition Directory / Signage
         ═══════════════════════════════════════ */}
      <section
        id="directory"
        className="py-20 sm:py-32"
        style={{ background: P.offWhite }}
      >
        <div className="mx-auto max-w-[1100px] px-4 sm:px-10">
          {/* Section header */}
          <Reveal className="text-center mb-16 sm:mb-20">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="pavilion-pennant">
                <Pennant color={P.teal} width={20} height={12} />
              </div>
              <span
                className="font-[family-name:var(--font-space-grotesk)] text-[10px] uppercase tracking-[0.35em] font-medium"
                style={{ color: P.teal }}
              >
                Exhibition Guide
              </span>
            </div>
            <h2
              className="font-[family-name:var(--font-space-grotesk)] font-bold uppercase tracking-[-0.01em] leading-[1.05]"
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                color: P.charcoal,
              }}
            >
              Technology{" "}
              <span style={{ color: P.red }}>Directory</span>
            </h2>
          </Reveal>

          {/* Directory signage grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-0">
            {tools.map((group, gi) => {
              const accent = [P.red, P.steel, P.teal, P.wood, P.charcoal, P.red][gi];
              return (
                <Reveal key={group.label} delay={gi * 0.08}>
                  <div
                    className="relative p-6 sm:p-7 h-full"
                    style={{
                      background: P.white,
                      borderRight: gi < 5 ? `1px solid ${P.midGray}` : "none",
                      borderBottom: `1px solid ${P.midGray}`,
                    }}
                  >
                    {/* Top accent stripe */}
                    <div
                      className="absolute top-0 left-0 right-0 h-[3px]"
                      style={{ background: accent }}
                    />

                    {/* Category number */}
                    <div
                      className="font-[family-name:var(--font-space-grotesk)] text-[32px] font-bold leading-none mb-3"
                      style={{ color: `${accent}18` }}
                    >
                      {String(gi + 1).padStart(2, "0")}
                    </div>

                    {/* Label */}
                    <h4
                      className="font-[family-name:var(--font-space-grotesk)] text-[11px] uppercase tracking-[0.25em] font-bold mb-5"
                      style={{ color: accent }}
                    >
                      {group.label}
                    </h4>

                    {/* Items */}
                    <div className="flex flex-col gap-3">
                      {group.items.map((item) => (
                        <div
                          key={item}
                          className="group/item flex items-center gap-2 cursor-default"
                        >
                          <div
                            className="w-1 h-1 rounded-full transition-all duration-300 group-hover/item:w-2 group-hover/item:h-2"
                            style={{ background: accent }}
                          />
                          <span
                            className="font-[family-name:var(--font-inter)] text-[12px] transition-colors duration-300"
                            style={{ color: P.darkGray }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = accent)}
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.color = P.darkGray)
                            }
                          >
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
         FOOTER — World's Fair MMXXV
         ═══════════════════════════════════════ */}
      <footer
        className="relative overflow-hidden"
        style={{ background: P.charcoal }}
      >
        {/* Background starburst */}
        <div
          className="absolute pavilion-starburst-spin-slow pointer-events-none"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            opacity: 0.03,
          }}
        >
          <AtomicStarburst size={600} color={P.white} />
        </div>

        <div className="mx-auto max-w-[1100px] px-4 sm:px-10 py-24 sm:py-36 relative z-10">
          <Reveal>
            <div className="text-center">
              {/* Globe icon */}
              <div className="flex justify-center mb-8">
                <div className="pavilion-float">
                  <ModernistGlobe size={60} color={P.white} />
                </div>
              </div>

              {/* Fair title */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <div
                  className="h-[1px] w-16"
                  style={{ background: `linear-gradient(90deg, transparent, ${P.red})` }}
                />
                <SputnikStar size={18} color={P.red} />
                <div
                  className="h-[1px] w-16"
                  style={{ background: `linear-gradient(90deg, ${P.red}, transparent)` }}
                />
              </div>

              <h2
                className="font-[family-name:var(--font-space-grotesk)] font-bold uppercase tracking-[0.1em] leading-[1.1]"
                style={{
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  color: P.white,
                }}
              >
                World&apos;s Fair
                <br />
                <span style={{ color: P.red }}>MMXXV</span>
              </h2>

              {/* Starburst decoration */}
              <div className="flex justify-center mt-8 mb-6">
                <div className="pavilion-starburst-spin">
                  <AtomicStarburst size={50} color={P.red} />
                </div>
              </div>

              <p
                className="font-[family-name:var(--font-sora)] text-[14px] tracking-[0.05em] mb-4"
                style={{ color: `${P.white}BB` }}
              >
                The Grox Pavilion
              </p>

              <p
                className="font-[family-name:var(--font-inter)] text-[13px] leading-[1.8] max-w-md mx-auto mb-10"
                style={{ color: `${P.white}80` }}
              >
                AI products for the atomic age. From vision to voice,
                from orchestration to interface.
              </p>

              {/* CTA */}
              <a
                href="https://github.com/1aday"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 font-[family-name:var(--font-space-grotesk)] text-[11px] uppercase tracking-[0.2em] font-bold px-8 py-4 transition-all duration-500"
                style={{
                  color: P.white,
                  border: `1px solid ${P.red}`,
                  background: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = P.red;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                Visit on GitHub
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </a>

              {/* Decorative bottom divider */}
              <div className="flex items-center justify-center gap-3 mt-14">
                <div
                  className="h-[1px] w-20"
                  style={{ background: `${P.white}20` }}
                />
                <AtomicDots count={7} dotSize={3} gap={8} color={`${P.red}80`} />
                <div
                  className="h-[1px] w-20"
                  style={{ background: `${P.white}20` }}
                />
              </div>
            </div>
          </Reveal>

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between mt-16 pt-8 border-t" style={{ borderColor: `${P.white}10` }}>
            <div className="flex items-center gap-3 mb-4 sm:mb-0">
              <SputnikStar size={14} color={P.red} />
              <span
                className="font-[family-name:var(--font-space-grotesk)] text-[10px] uppercase tracking-[0.2em]"
                style={{ color: `${P.white}50` }}
              >
                Grox AI Product Studio
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="font-[family-name:var(--font-inter)] text-[10px] tracking-[0.15em]"
                style={{ color: `${P.white}40` }}
              >
                2024 &mdash; Present
              </span>
              <span style={{ color: `${P.white}25` }}>&middot;</span>
              <span
                className="font-[family-name:var(--font-inter)] text-[10px] tracking-[0.15em]"
                style={{ color: `${P.white}40` }}
              >
                The Pavilion Theme
              </span>
            </div>
          </div>
        </div>
      </footer>

      <ThemeSwitcher current="/pavilion" variant="light" />
    </main>
  );
}
