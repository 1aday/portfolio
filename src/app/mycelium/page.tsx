"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { motion, useInView } from "motion/react";
import Link from "next/link";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";

/* ═══════════════════════════════════════════════════════════════════ */
/*  COLORS                                                            */
/* ═══════════════════════════════════════════════════════════════════ */
const C = {
  bg: "#0B0A1A",
  bgCard: "#0F0E24",
  phosphor: "#39FF85",
  indigo: "#1A1147",
  gold: "#C4A84F",
  lavender: "#A78BDB",
  text: "#C8C2D8",
  muted: "#6B6580",
  border: "rgba(57,255,133,0.1)",
  glowSoft: "rgba(57,255,133,0.15)",
  glowMed: "rgba(57,255,133,0.3)",
  glowStrong: "rgba(57,255,133,0.5)",
};

/* ═══════════════════════════════════════════════════════════════════ */
/*  L-SYSTEM BRANCH GENERATOR                                        */
/* ═══════════════════════════════════════════════════════════════════ */
interface BranchPath {
  d: string;
  width: number;
  delay: number;
  opacity: number;
}

function generateBranches(
  width: number,
  height: number,
  count: number,
  seed: number
): BranchPath[] {
  const branches: BranchPath[] = [];
  const rng = (s: number) => {
    s = Math.sin(s * 127.1 + seed) * 43758.5453;
    return s - Math.floor(s);
  };

  for (let i = 0; i < count; i++) {
    const startX = rng(i * 3.1) * width;
    const startY = height * 0.9 + rng(i * 7.3) * height * 0.1;
    const segments = 4 + Math.floor(rng(i * 11.7) * 5);
    let x = startX;
    let y = startY;
    let path = `M ${x.toFixed(1)} ${y.toFixed(1)}`;

    for (let s = 0; s < segments; s++) {
      const dx = (rng(i * 17 + s * 3) - 0.5) * 180;
      const dy = -(30 + rng(i * 23 + s * 7) * 100);
      const cx1 = x + dx * 0.3 + (rng(i * 29 + s) - 0.5) * 60;
      const cy1 = y + dy * 0.3;
      const cx2 = x + dx * 0.7 + (rng(i * 31 + s) - 0.5) * 60;
      const cy2 = y + dy * 0.7;
      x += dx;
      y += dy;
      x = Math.max(20, Math.min(width - 20, x));
      y = Math.max(20, y);
      path += ` C ${cx1.toFixed(1)} ${cy1.toFixed(1)}, ${cx2.toFixed(1)} ${cy2.toFixed(1)}, ${x.toFixed(1)} ${y.toFixed(1)}`;

      // Sub-branches
      if (rng(i * 37 + s * 13) > 0.5 && s > 0) {
        const bx = x + (rng(i * 41 + s) - 0.5) * 120;
        const by = y - 20 - rng(i * 43 + s) * 60;
        const bcx = x + (bx - x) * 0.5 + (rng(i * 47 + s) - 0.5) * 40;
        const bcy = y + (by - y) * 0.5;
        branches.push({
          d: `M ${x.toFixed(1)} ${y.toFixed(1)} Q ${bcx.toFixed(1)} ${bcy.toFixed(1)}, ${bx.toFixed(1)} ${by.toFixed(1)}`,
          width: 0.5 + rng(i * 53 + s) * 0.8,
          delay: (i * 0.15 + s * 0.08 + 0.3),
          opacity: 0.2 + rng(i * 59 + s) * 0.3,
        });
      }
    }

    branches.push({
      d: path,
      width: 1 + rng(i * 61) * 1.2,
      delay: i * 0.15,
      opacity: 0.3 + rng(i * 67) * 0.5,
    });
  }

  return branches;
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  SPORE PARTICLES                                                   */
/* ═══════════════════════════════════════════════════════════════════ */
interface Spore {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  opacity: number;
}

function generateSpores(count: number): Spore[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: 2 + Math.random() * 4,
    duration: 8 + Math.random() * 12,
    delay: Math.random() * 10,
    drift: (Math.random() - 0.5) * 40,
    opacity: 0.15 + Math.random() * 0.4,
  }));
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  SECTION WRAPPER                                                   */
/* ═══════════════════════════════════════════════════════════════════ */
function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  PULSING NODE DOT                                                  */
/* ═══════════════════════════════════════════════════════════════════ */
function NodeDot({
  size = 8,
  className = "",
  color = C.phosphor,
}: {
  size?: number;
  className?: string;
  color?: string;
}) {
  return (
    <span
      className={`myc-pulse-node ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        display: "inline-block",
        boxShadow: `0 0 ${size}px ${color}, 0 0 ${size * 2}px ${C.glowSoft}`,
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  MAIN PAGE                                                         */
/* ═══════════════════════════════════════════════════════════════════ */
export default function MyceliumPage() {
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const branches = useMemo(
    () => generateBranches(1200, 700, 10, 42),
    []
  );
  const spores = useMemo(() => generateSpores(10), []);

  return (
    <>
      {/* Global keyframes */}
      <style>{`
        @keyframes myc-float {
          0% { transform: translateY(100vh) translateX(0px); opacity: 0; }
          10% { opacity: var(--spore-opacity); }
          90% { opacity: var(--spore-opacity); }
          100% { transform: translateY(-10vh) translateX(var(--spore-drift)); opacity: 0; }
        }
        @keyframes myc-pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.5); opacity: 1; }
        }
        @keyframes myc-nutrient-flow {
          0% { transform: translateY(100%); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(-100%); opacity: 0; }
        }
        @keyframes myc-glow-pulse {
          0%, 100% { box-shadow: 0 0 8px ${C.glowSoft}, 0 0 20px rgba(57,255,133,0.05); }
          50% { box-shadow: 0 0 15px ${C.glowMed}, 0 0 35px ${C.glowSoft}; }
        }
        .myc-pulse-node {
          animation: myc-pulse 3s ease-in-out infinite;
        }
        .myc-card-hover:hover {
          box-shadow: 0 0 25px ${C.glowSoft}, 0 0 50px rgba(57,255,133,0.08) !important;
          border-color: rgba(57,255,133,0.25) !important;
        }
        .myc-card-hover {
          transition: box-shadow 0.4s ease, border-color 0.4s ease;
        }
        .myc-expertise-line {
          position: relative;
          overflow: hidden;
        }
        .myc-expertise-line::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(to bottom, transparent, ${C.phosphor}, transparent);
          animation: myc-nutrient-flow 4s ease-in-out infinite;
        }
        .myc-tag:hover {
          background: rgba(57,255,133,0.12) !important;
          border-color: rgba(57,255,133,0.35) !important;
        }
      `}</style>

      <div
        className="min-h-screen relative"
        style={{ background: C.bg, color: C.text }}
      >
        {/* ─── Spore Particles (fixed, continuous) ─── */}
        {mounted && (
          <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
            {spores.map((s) => (
              <div
                key={s.id}
                className="absolute rounded-full"
                style={{
                  left: `${s.x}%`,
                  bottom: "-10px",
                  width: s.size,
                  height: s.size,
                  background: `radial-gradient(circle, ${C.phosphor}, transparent)`,
                  ["--spore-opacity" as string]: s.opacity,
                  ["--spore-drift" as string]: `${s.drift}px`,
                  animation: `myc-float ${s.duration}s ${s.delay}s linear infinite`,
                  opacity: 0,
                }}
              />
            ))}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════ */}
        {/*  HERO SECTION                                           */}
        {/* ════════════════════════════════════════════════════════ */}
        <div
          ref={heroRef}
          className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
          style={{
            background: `radial-gradient(ellipse at 50% 80%, ${C.indigo} 0%, ${C.bg} 70%)`,
          }}
        >
          {/* Branching network SVG */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1200 700"
            preserveAspectRatio="xMidYMid slice"
            fill="none"
          >
            <defs>
              <filter id="myc-glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {mounted &&
              branches.map((b, i) => (
                <motion.path
                  key={i}
                  d={b.d}
                  stroke={C.phosphor}
                  strokeWidth={b.width}
                  strokeLinecap="round"
                  fill="none"
                  opacity={b.opacity}
                  filter="url(#myc-glow)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 2.5 + b.delay * 0.5,
                    delay: b.delay,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              ))}
            {/* Node points at branch tips */}
            {mounted &&
              branches
                .filter((_, i) => i % 3 === 0)
                .map((b, i) => {
                  const parts = b.d.split(/[, ]/);
                  const nums = parts.filter((p) => !isNaN(parseFloat(p)));
                  const endX = parseFloat(nums[nums.length - 2]) || 600;
                  const endY = parseFloat(nums[nums.length - 1]) || 350;
                  return (
                    <motion.circle
                      key={`node-${i}`}
                      cx={endX}
                      cy={endY}
                      r={3}
                      fill={C.phosphor}
                      opacity={0}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: [0, 0.8, 0.5], scale: [0, 1.5, 1] }}
                      transition={{
                        duration: 1.5,
                        delay: b.delay + 2,
                        ease: "easeOut",
                      }}
                      filter="url(#myc-glow)"
                    />
                  );
                })}
          </svg>

          {/* Overlay gradient for text readability */}
          <div
            className="absolute inset-0 z-[2]"
            style={{
              background: `radial-gradient(ellipse at 50% 50%, rgba(11,10,26,0.3) 0%, rgba(11,10,26,0.85) 100%)`,
            }}
          />

          {/* Hero content */}
          <div className="relative z-[3] text-center px-6 max-w-5xl">
            <motion.p
              className="font-[family-name:var(--font-jetbrains)] text-xs tracking-[0.3em] uppercase mb-6"
              style={{ color: C.muted }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
            >
              AI Product Studio
            </motion.p>

            <motion.h1
              className="font-[family-name:var(--font-space-grotesk)] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-8"
              style={{
                color: "#EEEAF4",
                textShadow: `0 0 40px ${C.glowStrong}, 0 0 80px ${C.glowSoft}`,
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              Building
              <br />
              Connected
              <br />
              <span
                style={{
                  color: C.phosphor,
                  textShadow: `0 0 30px ${C.glowStrong}, 0 0 60px ${C.glowMed}, 0 0 100px ${C.glowSoft}`,
                }}
              >
                Intelligence
              </span>
            </motion.h1>

            <motion.p
              className="font-[family-name:var(--font-body)] text-lg sm:text-xl max-w-2xl mx-auto mb-14"
              style={{ color: C.lavender, opacity: 0.7 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              Multi-model AI systems that grow, connect, and adapt.
              Invisible infrastructure for intelligent products.
            </motion.p>

            {/* Stats row */}
            <motion.div
              className="flex items-center justify-center gap-8 sm:gap-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
            >
              {stats.map((s, i) => (
                <div key={i} className="text-center">
                  <div
                    className="font-[family-name:var(--font-space-grotesk)] text-3xl sm:text-4xl font-bold"
                    style={{
                      color: C.phosphor,
                      textShadow: `0 0 20px ${C.glowStrong}`,
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[0.2em] uppercase mt-1"
                    style={{ color: C.muted }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Bottom fade */}
          <div
            className="absolute bottom-0 left-0 right-0 h-32 z-[4]"
            style={{
              background: `linear-gradient(to top, ${C.bg}, transparent)`,
            }}
          />
        </div>

        {/* ════════════════════════════════════════════════════════ */}
        {/*  PROJECTS SECTION                                       */}
        {/* ════════════════════════════════════════════════════════ */}
        <Section
          id="projects"
          className="relative py-24 sm:py-32 px-6"
        >
          <div className="max-w-6xl mx-auto">
            {/* Section header */}
            <div className="flex items-center gap-4 mb-4">
              <NodeDot size={10} />
              <h2
                className="font-[family-name:var(--font-space-grotesk)] text-3xl sm:text-4xl font-bold"
                style={{
                  color: "#EEEAF4",
                  textShadow: `0 0 20px ${C.glowSoft}`,
                }}
              >
                Network Nodes
              </h2>
            </div>
            <p
              className="font-[family-name:var(--font-body)] text-sm mb-16 max-w-lg"
              style={{ color: C.muted }}
            >
              Each project is a node in a growing intelligence network
              &mdash; connected systems that share knowledge and capability.
            </p>

            {/* Connection SVG overlay (decorative lines between cards) */}
            <div className="relative">
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden lg:block"
                style={{ overflow: "visible" }}
              >
                <defs>
                  <filter id="myc-line-glow">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                {/* Horizontal connection lines */}
                {[0, 1, 2, 3, 4].map((row) => (
                  <line
                    key={`h-${row}`}
                    x1="48%"
                    y1={`${row * 20 + 10}%`}
                    x2="52%"
                    y2={`${row * 20 + 10}%`}
                    stroke={C.phosphor}
                    strokeWidth="0.5"
                    opacity="0.15"
                    filter="url(#myc-line-glow)"
                  />
                ))}
                {/* Vertical threads */}
                {[25, 50, 75].map((x, i) => (
                  <line
                    key={`v-${i}`}
                    x1={`${x}%`}
                    y1="0%"
                    x2={`${x}%`}
                    y2="100%"
                    stroke={C.phosphor}
                    strokeWidth="0.3"
                    opacity="0.06"
                    strokeDasharray="4 12"
                  />
                ))}
              </svg>

              {/* Project cards grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-[1]">
                {projects.map((project, i) => (
                  <ProjectCard key={i} project={project} index={i} />
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ════════════════════════════════════════════════════════ */}
        {/*  EXPERTISE SECTION                                      */}
        {/* ════════════════════════════════════════════════════════ */}
        <Section
          id="expertise"
          className="py-24 sm:py-32 px-6"
        >
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <NodeDot size={10} color={C.gold} />
              <h2
                className="font-[family-name:var(--font-space-grotesk)] text-3xl sm:text-4xl font-bold"
                style={{
                  color: "#EEEAF4",
                  textShadow: `0 0 20px rgba(196,168,79,0.3)`,
                }}
              >
                Nutrient Channels
              </h2>
            </div>
            <p
              className="font-[family-name:var(--font-body)] text-sm mb-16 max-w-lg"
              style={{ color: C.muted }}
            >
              Core competencies flowing through every project node,
              distributing intelligence across the network.
            </p>

            <div className="grid grid-cols-1 gap-4">
              {expertise.map((item, i) => (
                <ExpertiseCard key={i} item={item} index={i} />
              ))}
            </div>
          </div>
        </Section>

        {/* ════════════════════════════════════════════════════════ */}
        {/*  TOOLS SECTION                                          */}
        {/* ════════════════════════════════════════════════════════ */}
        <Section
          id="tools"
          className="py-24 sm:py-32 px-6"
        >
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <NodeDot size={10} color={C.lavender} />
              <h2
                className="font-[family-name:var(--font-space-grotesk)] text-3xl sm:text-4xl font-bold"
                style={{
                  color: "#EEEAF4",
                  textShadow: `0 0 20px rgba(167,139,219,0.3)`,
                }}
              >
                Spore Prints
              </h2>
            </div>
            <p
              className="font-[family-name:var(--font-body)] text-sm mb-16 max-w-lg"
              style={{ color: C.muted }}
            >
              The propagation toolkit &mdash; technologies that seed
              new growth across every project environment.
            </p>

            {/* Tools network layout */}
            <div className="relative">
              {/* Connection threads between tool groups */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden md:block"
                style={{ overflow: "visible" }}
              >
                {/* Faint radial lines from center */}
                {tools.map((_, i) => {
                  const angle = (i / tools.length) * Math.PI * 2 - Math.PI / 2;
                  const cx = 50;
                  const cy = 50;
                  const r = 40;
                  const ex = cx + Math.cos(angle) * r;
                  const ey = cy + Math.sin(angle) * r;
                  return (
                    <line
                      key={i}
                      x1={`${cx}%`}
                      y1={`${cy}%`}
                      x2={`${ex}%`}
                      y2={`${ey}%`}
                      stroke={C.phosphor}
                      strokeWidth="0.5"
                      opacity="0.08"
                      strokeDasharray="2 8"
                    />
                  );
                })}
                {/* Center node */}
                <circle
                  cx="50%"
                  cy="50%"
                  r="4"
                  fill={C.phosphor}
                  opacity="0.15"
                />
              </svg>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 relative z-[1]">
                {tools.map((tool, i) => (
                  <ToolNode key={i} tool={tool} index={i} />
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ════════════════════════════════════════════════════════ */}
        {/*  FOOTER                                                 */}
        {/* ════════════════════════════════════════════════════════ */}
        <Section
          id="footer"
          className="relative py-24 sm:py-32 px-6 overflow-hidden"
        >
          {/* Footer network decoration */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06]"
            viewBox="0 0 800 400"
            preserveAspectRatio="xMidYMid slice"
            fill="none"
          >
            {Array.from({ length: 12 }).map((_, i) => {
              const x1 = (i * 73) % 800;
              const y1 = (i * 41) % 400;
              const x2 = ((i + 3) * 97) % 800;
              const y2 = ((i + 5) * 53) % 400;
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={C.phosphor}
                  strokeWidth="0.8"
                />
              );
            })}
            {Array.from({ length: 8 }).map((_, i) => (
              <circle
                key={`fn-${i}`}
                cx={(i * 107) % 800}
                cy={(i * 61) % 400}
                r={2}
                fill={C.phosphor}
                opacity={0.5}
              />
            ))}
          </svg>

          <div className="max-w-4xl mx-auto text-center relative z-[1]">
            <div className="flex justify-center mb-8">
              <NodeDot size={14} />
            </div>

            <h2
              className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
              style={{
                color: "#EEEAF4",
                textShadow: `0 0 30px ${C.glowStrong}, 0 0 60px ${C.glowSoft}`,
              }}
            >
              Extend the Network
            </h2>

            <p
              className="font-[family-name:var(--font-body)] text-lg mb-12 max-w-xl mx-auto"
              style={{ color: C.lavender, opacity: 0.6 }}
            >
              Ready to grow something intelligent together?
              Let&apos;s connect a new node.
            </p>

            {/* Contact links */}
            <div className="flex items-center justify-center gap-6 sm:gap-10 mb-16">
              <Link
                href="https://github.com/1aday"
                target="_blank"
                className="group flex items-center gap-2 font-[family-name:var(--font-jetbrains)] text-sm transition-colors duration-300"
                style={{ color: C.muted }}
              >
                <span
                  className="inline-block w-2 h-2 rounded-full transition-shadow duration-300"
                  style={{
                    background: C.phosphor,
                    boxShadow: `0 0 4px ${C.phosphor}`,
                  }}
                />
                <span className="group-hover:text-[#39FF85] transition-colors duration-300">
                  GitHub
                </span>
              </Link>
              <Link
                href="mailto:hello@grox.studio"
                className="group flex items-center gap-2 font-[family-name:var(--font-jetbrains)] text-sm transition-colors duration-300"
                style={{ color: C.muted }}
              >
                <span
                  className="inline-block w-2 h-2 rounded-full transition-shadow duration-300"
                  style={{
                    background: C.gold,
                    boxShadow: `0 0 4px ${C.gold}`,
                  }}
                />
                <span className="group-hover:text-[#C4A84F] transition-colors duration-300">
                  Email
                </span>
              </Link>
              <Link
                href="https://x.com/groxstudio"
                target="_blank"
                className="group flex items-center gap-2 font-[family-name:var(--font-jetbrains)] text-sm transition-colors duration-300"
                style={{ color: C.muted }}
              >
                <span
                  className="inline-block w-2 h-2 rounded-full transition-shadow duration-300"
                  style={{
                    background: C.lavender,
                    boxShadow: `0 0 4px ${C.lavender}`,
                  }}
                />
                <span className="group-hover:text-[#A78BDB] transition-colors duration-300">
                  X / Twitter
                </span>
              </Link>
            </div>

            {/* Small network animation in footer */}
            <div className="flex items-center justify-center gap-3 mb-8">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <span
                    className="myc-pulse-node"
                    style={{
                      width: 4 + (i % 3),
                      height: 4 + (i % 3),
                      borderRadius: "50%",
                      background: i % 2 === 0 ? C.phosphor : C.lavender,
                      display: "inline-block",
                      opacity: 0.4 + i * 0.1,
                      boxShadow: `0 0 6px ${i % 2 === 0 ? C.phosphor : C.lavender}`,
                      animationDelay: `${i * 0.6}s`,
                    }}
                  />
                  {i < 4 && (
                    <div
                      style={{
                        width: 20 + i * 5,
                        height: 1,
                        background: `linear-gradient(to right, ${C.phosphor}22, ${C.phosphor}08)`,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            <p
              className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[0.2em] uppercase"
              style={{ color: C.muted, opacity: 0.4 }}
            >
              GROX.STUDIO &middot; {new Date().getFullYear()}
            </p>
          </div>
        </Section>

        {/* ─── Theme Switcher ─── */}
        <ThemeSwitcher current="/mycelium" variant="dark" />
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  PROJECT CARD COMPONENT                                            */
/* ═══════════════════════════════════════════════════════════════════ */
function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      className="myc-card-hover relative rounded-lg p-6 sm:p-8"
      style={{
        background: C.bgCard,
        border: `1px solid ${C.border}`,
        boxShadow: `0 0 15px rgba(57,255,133,0.04), inset 0 1px 0 rgba(255,255,255,0.02)`,
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* Node dot top-left */}
      <div className="absolute top-4 left-4">
        <NodeDot size={8} />
      </div>

      {/* Project number */}
      <div className="flex items-start justify-between mb-5">
        <span
          className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[0.15em] uppercase pl-5"
          style={{ color: C.muted }}
        >
          Node {String(index + 1).padStart(2, "0")}
        </span>
        <div className="flex items-center gap-3">
          <span
            className="font-[family-name:var(--font-jetbrains)] text-[10px]"
            style={{ color: C.muted }}
          >
            {project.client}
          </span>
          <span
            className="font-[family-name:var(--font-jetbrains)] text-[10px]"
            style={{ color: C.gold, opacity: 0.6 }}
          >
            {project.year}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3
        className="font-[family-name:var(--font-space-grotesk)] text-xl sm:text-2xl font-bold mb-3 whitespace-pre-line leading-tight"
        style={{
          color: "#EEEAF4",
          textShadow: `0 0 15px ${C.glowSoft}`,
        }}
      >
        {project.title}
      </h3>

      {/* Description */}
      <p
        className="font-[family-name:var(--font-body)] text-sm leading-relaxed mb-3"
        style={{ color: C.text, opacity: 0.7 }}
      >
        {project.description}
      </p>

      {/* Technical detail */}
      <p
        className="font-[family-name:var(--font-body)] text-xs leading-relaxed mb-5"
        style={{ color: C.muted }}
      >
        {project.technical}
      </p>

      {/* Tech tags */}
      <div className="flex flex-wrap gap-2 mb-5">
        {project.tech.map((t, ti) => (
          <span
            key={ti}
            className="myc-tag font-[family-name:var(--font-jetbrains)] text-[10px] px-3 py-1 rounded-full transition-all duration-300"
            style={{
              background: "rgba(57,255,133,0.06)",
              border: `1px solid ${C.border}`,
              color: C.phosphor,
              opacity: 0.8,
            }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* GitHub link */}
      <Link
        href={project.github}
        target="_blank"
        className="group inline-flex items-center gap-2 font-[family-name:var(--font-jetbrains)] text-[11px] transition-colors duration-300"
        style={{ color: C.muted }}
      >
        <span
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{
            background: C.phosphor,
            boxShadow: `0 0 4px ${C.phosphor}`,
          }}
        />
        <span className="group-hover:text-[#39FF85] transition-colors duration-300">
          View Source
        </span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 12 12"
          fill="none"
          className="opacity-40 group-hover:opacity-80 transition-all duration-300 group-hover:translate-x-0.5"
        >
          <path
            d="M2 10L10 2M10 2H4M10 2V8"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>

      {/* Bottom connection line */}
      <div
        className="absolute bottom-0 left-6 right-6 h-px"
        style={{
          background: `linear-gradient(to right, transparent, ${C.phosphor}15, transparent)`,
        }}
      />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  EXPERTISE CARD COMPONENT                                          */
/* ═══════════════════════════════════════════════════════════════════ */
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
      className="myc-expertise-line myc-card-hover relative rounded-lg p-6 sm:p-8 pl-8 sm:pl-10"
      style={{
        background: C.bgCard,
        border: `1px solid ${C.border}`,
        boxShadow: `0 0 10px rgba(57,255,133,0.03)`,
      }}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{
        duration: 0.6,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* Animated green line runs along left border via CSS ::before */}

      <div className="flex items-start gap-5">
        {/* Number + accent dot */}
        <div className="flex flex-col items-center gap-2 pt-1 shrink-0">
          <NodeDot size={6} color={C.gold} />
          <span
            className="font-[family-name:var(--font-jetbrains)] text-[10px]"
            style={{ color: C.muted }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h3
            className="font-[family-name:var(--font-space-grotesk)] text-lg sm:text-xl font-bold mb-2"
            style={{
              color: "#EEEAF4",
              textShadow: `0 0 12px ${C.glowSoft}`,
            }}
          >
            {item.title}
          </h3>
          <p
            className="font-[family-name:var(--font-body)] text-sm leading-relaxed"
            style={{ color: C.text, opacity: 0.65 }}
          >
            {item.body}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  TOOL NODE COMPONENT                                               */
/* ═══════════════════════════════════════════════════════════════════ */
function ToolNode({
  tool,
  index,
}: {
  tool: (typeof tools)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const borderColors = [C.phosphor, C.gold, C.lavender, C.phosphor, C.gold, C.lavender];
  const accent = borderColors[index % borderColors.length];

  return (
    <motion.div
      ref={ref}
      className="myc-card-hover relative rounded-xl p-5 sm:p-6 text-center"
      style={{
        background: C.bgCard,
        border: `1px solid rgba(57,255,133,0.08)`,
        boxShadow: `0 0 12px rgba(57,255,133,0.03)`,
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* Circular ring decoration */}
      <div className="flex justify-center mb-4">
        <div
          className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center"
          style={{
            border: `1.5px solid ${accent}33`,
            boxShadow: `0 0 20px ${accent}15, inset 0 0 15px ${accent}08`,
          }}
        >
          {/* Inner ring */}
          <div
            className="absolute inset-2 rounded-full"
            style={{ border: `1px solid ${accent}18` }}
          />
          {/* Center dot */}
          <div
            className="w-2.5 h-2.5 rounded-full myc-pulse-node"
            style={{
              background: accent,
              boxShadow: `0 0 8px ${accent}, 0 0 16px ${accent}55`,
              animationDelay: `${index * 0.5}s`,
            }}
          />
        </div>
      </div>

      {/* Label */}
      <h4
        className="font-[family-name:var(--font-space-grotesk)] text-sm font-bold mb-3 tracking-wide uppercase"
        style={{
          color: accent,
          textShadow: `0 0 10px ${accent}55`,
        }}
      >
        {tool.label}
      </h4>

      {/* Divider */}
      <div
        className="w-8 h-px mx-auto mb-3"
        style={{ background: `${accent}33` }}
      />

      {/* Items */}
      <div className="space-y-1.5">
        {tool.items.map((item, i) => (
          <p
            key={i}
            className="font-[family-name:var(--font-jetbrains)] text-[11px]"
            style={{ color: C.text, opacity: 0.55 }}
          >
            {item}
          </p>
        ))}
      </div>

      {/* Corner thread connectors */}
      <div
        className="absolute -top-px -right-px w-4 h-4"
        style={{
          borderTop: `1px solid ${accent}20`,
          borderRight: `1px solid ${accent}20`,
          borderTopRightRadius: "0.75rem",
        }}
      />
      <div
        className="absolute -bottom-px -left-px w-4 h-4"
        style={{
          borderBottom: `1px solid ${accent}20`,
          borderLeft: `1px solid ${accent}20`,
          borderBottomLeftRadius: "0.75rem",
        }}
      />
    </motion.div>
  );
}
