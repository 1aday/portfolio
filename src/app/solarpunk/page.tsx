"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";

/* ═══════════════════════════════════════════════════════════════════════════
   SOLARPUNK — Photosynthetic Technology Portfolio Theme
   A bright optimistic future where organic biology and clean technology
   have merged. Living architecture, vine-circuit hybrids, greenhouse labs.
   The antidote to cyberpunk — warm, lush, hopeful.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ─── Palette ─── */
const C = {
  bg: "#F5FFF0",
  accent: "#1A8A4A",
  text: "#1A2A1E",
  sage: "#6A8A72",
  copper: "#C87830",
  sky: "#5CAFE0",
  leaf: "#44CC66",
  cream: "#FFF5E0",
  gold: "#D4A040",
  soil: "#3A2A1A",
};

const glowShadow =
  "0 4px 20px rgba(26,138,74,0.08), 0 0 40px rgba(68,204,102,0.04)";
const glowHover =
  "0 8px 30px rgba(26,138,74,0.14), 0 0 60px rgba(68,204,102,0.08)";

/* ─── Sun-ray conic gradient ─── */
const sunRayBg = `conic-gradient(from 0deg at 50% 0%, rgba(212,160,64,0.03) 0deg, transparent 15deg, transparent 30deg, rgba(212,160,64,0.03) 30deg, transparent 45deg, transparent 60deg, rgba(212,160,64,0.03) 60deg, transparent 75deg, transparent 90deg, rgba(212,160,64,0.03) 90deg, transparent 105deg, transparent 120deg, rgba(212,160,64,0.03) 120deg, transparent 135deg, transparent 150deg, rgba(212,160,64,0.03) 150deg, transparent 165deg, transparent 180deg, rgba(212,160,64,0.03) 180deg, transparent 195deg, transparent 210deg, rgba(212,160,64,0.03) 210deg, transparent 225deg, transparent 240deg, rgba(212,160,64,0.03) 240deg, transparent 255deg, transparent 270deg, rgba(212,160,64,0.03) 270deg, transparent 285deg, transparent 300deg, rgba(212,160,64,0.03) 300deg, transparent 315deg, transparent 330deg, rgba(212,160,64,0.03) 330deg, transparent 345deg, transparent 360deg)`;

/* ─── Solar panel grid pattern ─── */
const solarPanelBg = `repeating-linear-gradient(
  8deg,
  transparent 0px,
  transparent 38px,
  rgba(92,175,224,0.08) 38px,
  rgba(92,175,224,0.08) 40px
),
repeating-linear-gradient(
  98deg,
  transparent 0px,
  transparent 38px,
  rgba(92,175,224,0.08) 38px,
  rgba(92,175,224,0.08) 40px
)`;

const seedStripeColors = [C.accent, C.copper, C.sky];

/* ─── Reusable section wrapper with grow-in animation ─── */
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
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
}

/* ─── Leaf motif SVG ─── */
function LeafMotif({
  size = 24,
  color = C.accent,
  style,
  className = "",
}: {
  size?: number;
  color?: string;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={style}
      className={className}
    >
      <path
        d="M12 2 Q20 8 12 22 Q4 8 12 2Z"
        fill={color}
        opacity={0.15}
      />
      <path
        d="M12 6 L12 18"
        stroke={color}
        strokeWidth="0.8"
        opacity={0.25}
      />
    </svg>
  );
}

/* ─── Push-pin SVG for tool cards ─── */
function PushPin({ color = C.copper }: { color?: string }) {
  return (
    <svg width="16" height="20" viewBox="0 0 16 20" fill="none" className="absolute -top-2 left-1/2 -translate-x-1/2">
      <circle cx="8" cy="6" r="5" fill={color} /><circle cx="8" cy="6" r="3" fill={color} opacity={0.7} />
      <ellipse cx="8" cy="6" rx="5" ry="3" fill="black" opacity={0.06} transform="translate(0,3)" />
      <line x1="8" y1="11" x2="8" y2="18" stroke={color} strokeWidth="1.2" opacity={0.5} /></svg>
  );
}

/* ─── Vine-circuit hybrid SVG ─── */
const vineBranches = [
  { d: "M120 100 C130 60, 160 50, 180 70", color: C.accent, delay: 0.5 },
  { d: "M200 100 C210 130, 230 150, 260 140", color: C.sage, delay: 0.7 },
  { d: "M440 70 L460 40 L500 40", color: C.copper, delay: 1.2 },
  { d: "M640 60 L660 30 L720 30", color: C.gold, delay: 1.5 },
];
const vineDots = [
  { cx: 200, cy: 100, r: 5, color: C.accent, delay: 1.0 },
  { cx: 320, cy: 100, r: 6, color: C.sage, delay: 1.3 },
  { cx: 400, cy: 100, r: 5, color: C.copper, delay: 1.5 },
  { cx: 180, cy: 70, r: 4, color: C.accent, delay: 1.1 },
  { cx: 260, cy: 140, r: 4, color: C.sage, delay: 1.2 },
  { cx: 500, cy: 40, r: 4, color: C.copper, delay: 1.7 },
  { cx: 440, cy: 70, r: 5, color: C.copper, delay: 1.6 },
  { cx: 640, cy: 60, r: 5, color: C.gold, delay: 1.8 },
  { cx: 720, cy: 30, r: 4, color: C.gold, delay: 2.0 },
];
const vineLeaves = [
  { x: 80, y: 78, rot: -30 },
  { x: 150, y: 118, rot: 20 },
  { x: 250, y: 88, rot: -15 },
];

function VineCircuitSVG() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <svg ref={ref} viewBox="0 0 800 200" className="w-full h-auto max-h-[200px]" fill="none" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="vine-circuit-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={C.accent} /><stop offset="40%" stopColor={C.sage} />
          <stop offset="60%" stopColor={C.copper} /><stop offset="100%" stopColor={C.gold} />
        </linearGradient>
      </defs>
      <motion.path
        d="M0 100 C60 60, 120 140, 200 100 C250 80, 280 90, 320 100 L400 100 L440 70 L500 70 L540 100 L600 100 L640 60 L700 60 L740 100 L800 100"
        stroke="url(#vine-circuit-grad)" strokeWidth="2" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 2.5, ease: "easeInOut" }}
      />
      {vineBranches.map((b, i) => (
        <motion.path key={i} d={b.d} stroke={b.color} strokeWidth="1.5" strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 1.8, delay: b.delay, ease: "easeInOut" }} />
      ))}
      {vineDots.map((d, i) => (
        <motion.circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill={d.color}
          initial={{ scale: 0, opacity: 0 }} animate={inView ? { scale: 1, opacity: 0.7 } : {}}
          transition={{ duration: 0.4, delay: d.delay, ease: "backOut" }}
          style={{ transformOrigin: `${d.cx}px ${d.cy}px` }} />
      ))}
      {vineLeaves.map((l, i) => (
        <motion.g key={i} transform={`translate(${l.x},${l.y}) rotate(${l.rot})`}
          initial={{ scale: 0, opacity: 0 }} animate={inView ? { scale: 1, opacity: 0.5 } : {}}
          transition={{ duration: 0.5, delay: 0.8 + i * 0.2 }}>
          <path d="M0 0 Q4 -6 0 -12 Q-4 -6 0 0Z" fill={C.leaf} />
          <line x1="0" y1="-2" x2="0" y2="-10" stroke={C.accent} strokeWidth="0.5" opacity={0.5} />
        </motion.g>
      ))}
    </svg>
  );
}

/* ─── Vine tendril SVG for cards ─── */
function VineTendril({ side = "left", color = C.sage }: { side?: "left" | "right"; color?: string }) {
  return (
    <svg width="60" height="80" viewBox="0 0 60 80" fill="none" className="absolute bottom-0 opacity-20"
      style={{ [side]: -8, transform: side === "right" ? "scaleX(-1)" : undefined }}>
      <path d="M30 80 C30 60, 20 50, 10 40 C5 34, 8 26, 15 20 C20 16, 18 10, 22 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M15 20 Q18 14 12 12 Q10 18 15 20Z" fill={color} opacity={0.4} />
      <path d="M22 4 Q25 -2 19 -1 Q18 4 22 4Z" fill={color} opacity={0.3} />
    </svg>
  );
}

/* ─── Interconnecting vine-circuit lines between planter modules ─── */
function PlanterConnections() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 400" fill="none" preserveAspectRatio="none">
      <path d="M380 100 C400 80, 420 80, 440 100" stroke={C.sage} strokeWidth="1.5" strokeDasharray="4 4" opacity={0.3} />
      <path d="M380 300 C400 280, 420 280, 440 300" stroke={C.sage} strokeWidth="1.5" strokeDasharray="4 4" opacity={0.3} />
      <path d="M200 180 C180 200, 180 220, 200 240" stroke={C.copper} strokeWidth="1.5" strokeDasharray="4 4" opacity={0.2} />
      <path d="M600 180 C620 200, 620 220, 600 240" stroke={C.copper} strokeWidth="1.5" strokeDasharray="4 4" opacity={0.2} />
      <circle cx="400" cy="80" r="3" fill={C.leaf} opacity={0.3} />
      <circle cx="400" cy="280" r="3" fill={C.leaf} opacity={0.3} />
      <circle cx="180" cy="210" r="3" fill={C.copper} opacity={0.2} />
      <circle cx="620" cy="210" r="3" fill={C.copper} opacity={0.2} />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

export default function SolarpunkPage() {
  return (
    <main
      className="min-h-screen font-[family-name:var(--font-jakarta)]"
      style={{
        background: `${solarPanelBg}, ${sunRayBg}, ${C.bg}`,
        color: C.text,
      }}
    >
      {/* ─── HERO ─── */}
      <Section className="relative px-6 pt-20 pb-16 md:px-12 lg:px-20 max-w-6xl mx-auto overflow-hidden">
        {/* Decorative leaf accents */}
        <LeafMotif
          size={48}
          color={C.leaf}
          style={{ position: "absolute", top: 40, right: 60, opacity: 0.3 }}
        />
        <LeafMotif
          size={32}
          color={C.sage}
          style={{ position: "absolute", top: 80, right: 120, opacity: 0.2 }}
        />

        <motion.p
          className="text-sm tracking-[0.25em] uppercase mb-4 font-[family-name:var(--font-manrope)]"
          style={{ color: C.sage }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          AI Product Engineer
        </motion.p>

        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-[family-name:var(--font-dm-serif)] leading-[0.95] mb-6"
          style={{ color: C.text }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Growing
          <br />
          <span style={{ color: C.accent }}>Intelligent</span>
          <br />
          Products
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl max-w-xl mb-10 leading-relaxed"
          style={{ color: C.sage }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
        >
          Cultivating AI-powered applications where organic design thinking
          meets clean technology. Each project grows toward the light.
        </motion.p>

        {/* Vine-circuit hybrid SVG */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <VineCircuitSVG />
        </motion.div>

        {/* Seed-packet stat cards */}
        <div className="grid grid-cols-3 gap-4 max-w-lg">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="rounded-lg overflow-hidden"
              style={{
                background: "#fff",
                boxShadow: glowShadow,
              }}
              initial={{ rotateX: 90, opacity: 0 }}
              animate={{ rotateX: 0, opacity: 1 }}
              transition={{
                duration: 0.6,
                delay: 0.5 + i * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* Colored stripe */}
              <div
                className="h-1.5"
                style={{ background: seedStripeColors[i % seedStripeColors.length] }}
              />
              <div className="p-4 text-center">
                <div
                  className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-manrope)]"
                  style={{ color: C.text }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-xs tracking-wide uppercase mt-1 font-[family-name:var(--font-manrope)]"
                  style={{ color: C.sage }}
                >
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ─── PROJECTS — Growth Logs ─── */}
      <Section className="px-6 py-20 md:px-12 lg:px-20 max-w-6xl mx-auto" id="projects">
        <div className="mb-12">
          <h2
            className="text-3xl md:text-4xl font-[family-name:var(--font-dm-serif)] mb-3"
            style={{ color: C.text }}
          >
            Growth Logs
          </h2>
          <p className="text-base max-w-md" style={{ color: C.sage }}>
            Each project cultivated from seed to harvest. Living systems that
            learn, adapt, and produce.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, i) => {
            const efficiency = 82 + ((i * 7 + 3) % 16);
            return (
              <ProjectCard key={i} project={project} index={i} efficiency={efficiency} />
            );
          })}
        </div>
      </Section>

      {/* ─── EXPERTISE — Planter Modules ─── */}
      <Section className="px-6 py-20 md:px-12 lg:px-20 max-w-6xl mx-auto" id="expertise">
        <div className="mb-12">
          <h2
            className="text-3xl md:text-4xl font-[family-name:var(--font-dm-serif)] mb-3"
            style={{ color: C.text }}
          >
            Planter Modules
          </h2>
          <p className="text-base max-w-md" style={{ color: C.sage }}>
            Core expertise domains, each rooted deep and growing strong.
          </p>
        </div>

        <div className="relative">
          <PlanterConnections />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {expertise.map((exp, i) => (
              <ExpertiseCard key={i} item={exp} index={i} />
            ))}
          </div>
        </div>
      </Section>

      {/* ─── TOOLS — Greenhouse Pegboard ─── */}
      <Section className="px-6 py-20 md:px-12 lg:px-20 max-w-6xl mx-auto" id="tools">
        <div className="mb-12">
          <h2
            className="text-3xl md:text-4xl font-[family-name:var(--font-dm-serif)] mb-3"
            style={{ color: C.text }}
          >
            Greenhouse Supply
          </h2>
          <p className="text-base max-w-md" style={{ color: C.sage }}>
            The toolkit pegboard. Every tool pinned and ready for cultivation.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {tools.map((tool, i) => (
            <ToolCard key={i} tool={tool} index={i} />
          ))}
        </div>
      </Section>

      {/* ─── FOOTER — Greenhouse Arch ─── */}
      <Section className="px-6 pt-20 pb-0 max-w-4xl mx-auto" id="footer">
        <div
          className="relative overflow-hidden px-8 pt-16 pb-12 text-center"
          style={{
            borderRadius: "50% 50% 0 0",
            border: `2px solid ${C.accent}`,
            borderBottom: "none",
            background: `linear-gradient(180deg, rgba(245,255,240,0.9), rgba(255,245,224,0.6))`,
          }}
        >
          {/* Decorative arch leaves */}
          <LeafMotif
            size={36}
            color={C.accent}
            style={{ position: "absolute", top: 30, left: "20%", opacity: 0.2 }}
          />
          <LeafMotif
            size={28}
            color={C.leaf}
            style={{ position: "absolute", top: 50, right: "22%", opacity: 0.25 }}
          />
          <LeafMotif
            size={20}
            color={C.sage}
            style={{ position: "absolute", top: 20, right: "35%", opacity: 0.15 }}
          />

          <h2
            className="text-3xl md:text-4xl font-[family-name:var(--font-dm-serif)] mb-4"
            style={{ color: C.text }}
          >
            Let&rsquo;s Grow Something
          </h2>
          <p
            className="text-base max-w-md mx-auto mb-8 leading-relaxed"
            style={{ color: C.sage }}
          >
            Ready to cultivate your next AI-powered product?
            Step into the greenhouse and let&rsquo;s start planting.
          </p>
          <a
            href="mailto:hello@example.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium font-[family-name:var(--font-manrope)] transition-all duration-300"
            style={{
              background: C.accent,
              color: "#fff",
              boxShadow: glowShadow,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = glowHover;
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = glowShadow;
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <span>Start a Conversation</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 7h12M8 2l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>

          <p
            className="mt-10 text-xs font-[family-name:var(--font-manrope)]"
            style={{ color: C.sage }}
          >
            Designed with sunlight and optimism
          </p>
        </div>
      </Section>

      <ThemeSwitcher current="/solarpunk" variant="light" />
    </main>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PROJECT CARD — Growth Log
   ═══════════════════════════════════════════════════════════════════════════ */

function ProjectCard({
  project,
  index,
  efficiency,
}: {
  project: (typeof projects)[number];
  index: number;
  efficiency: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08 }}
    >
      <a
        href={project.github}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative overflow-hidden transition-all duration-300 group"
        style={{
          background: C.cream,
          borderRadius: "16px 16px 8px 8px",
          boxShadow: glowShadow,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = glowHover;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = glowShadow;
        }}
      >
        {/* Curved top border */}
        <div
          className="h-1.5 w-full"
          style={{
            background: `linear-gradient(90deg, ${C.accent}, ${C.copper})`,
            borderRadius: "16px 16px 0 0",
          }}
        />

        {/* Vine tendrils */}
        <VineTendril side="left" color={C.sage} />
        <VineTendril side="right" color={C.accent} />

        <div className="p-6 relative">
          {/* Leaf motif accent */}
          <LeafMotif
            size={20}
            color={C.leaf}
            style={{ position: "absolute", top: 8, right: 12, opacity: 0.3 }}
          />

          {/* Image */}
          <div
            className="w-full aspect-[16/10] rounded-lg mb-4 overflow-hidden"
            style={{ background: `${C.sage}22` }}
          >
            <img
              src={project.image}
              alt={project.title.replace("\n", " ")}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              style={{
                filter: "saturate(1.1) sepia(0.05) brightness(1.02)",
              }}
            />
          </div>

          {/* Header row */}
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3
                className="text-lg font-semibold font-[family-name:var(--font-dm-serif)] leading-tight whitespace-pre-line"
                style={{ color: C.text }}
              >
                {project.title}
              </h3>
              <p
                className="text-xs mt-1 font-[family-name:var(--font-manrope)]"
                style={{ color: C.sage }}
              >
                {project.client} &middot; {project.year}
              </p>
            </div>

            {/* Photosynthesis efficiency badge */}
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium font-[family-name:var(--font-manrope)]"
              style={{
                background: `${C.accent}15`,
                color: C.accent,
              }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <circle cx="5" cy="5" r="4" stroke={C.accent} strokeWidth="1" opacity={0.6} />
                <circle cx="5" cy="5" r="2" fill={C.leaf} opacity={0.8} />
              </svg>
              {efficiency}%
            </div>
          </div>

          {/* Description */}
          <p
            className="text-sm leading-relaxed mb-3"
            style={{ color: C.sage }}
          >
            {project.description}
          </p>

          {/* Technical */}
          <p
            className="text-xs leading-relaxed mb-4 italic"
            style={{ color: `${C.sage}BB` }}
          >
            {project.technical}
          </p>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-1.5">
            {project.tech.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded-full text-[11px] font-[family-name:var(--font-manrope)]"
                style={{
                  background: `${C.accent}10`,
                  color: C.accent,
                  border: `1px solid ${C.accent}20`,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </a>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   EXPERTISE CARD — Planter Module
   ═══════════════════════════════════════════════════════════════════════════ */

function ExpertiseCard({
  item,
  index,
}: {
  item: (typeof expertise)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const accentColor = [C.accent, C.copper, C.sky, C.gold][index % 4];

  return (
    <motion.div
      ref={ref}
      className="relative transition-all duration-300"
      style={{
        background: "#fff",
        borderRadius: "8px",
        boxShadow: glowShadow,
        borderBottom: `4px solid ${C.soil}`,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
        (e.currentTarget as HTMLElement).style.boxShadow = glowHover;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLElement).style.boxShadow = glowShadow;
      }}
    >
      <div className="p-6">
        {/* Module number + leaf accent */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-[family-name:var(--font-manrope)]"
            style={{
              background: `${accentColor}15`,
              color: accentColor,
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </div>
          <LeafMotif size={18} color={accentColor} />
        </div>

        <h3
          className="text-lg font-semibold font-[family-name:var(--font-dm-serif)] mb-2"
          style={{ color: C.text }}
        >
          {item.title}
        </h3>
        <p
          className="text-sm leading-relaxed"
          style={{ color: C.sage }}
        >
          {item.body}
        </p>
      </div>

      {/* Soil border bottom accent with root lines */}
      <div className="relative h-1" style={{ background: C.soil, borderRadius: "0 0 4px 4px" }}>
        <div
          className="absolute -top-3 left-4 w-px h-3"
          style={{ background: `${C.soil}40` }}
        />
        <div
          className="absolute -top-2 left-8 w-px h-2"
          style={{ background: `${C.soil}30` }}
        />
        <div
          className="absolute -top-4 right-6 w-px h-4"
          style={{ background: `${C.soil}35` }}
        />
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TOOL CARD — Greenhouse Pegboard Pin
   ═══════════════════════════════════════════════════════════════════════════ */

function ToolCard({
  tool,
  index,
}: {
  tool: (typeof tools)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  // Deterministic slight rotation per card: -2 to 2 degrees
  const rotation = ((index * 137.5) % 4) - 2;
  const pinColor = [C.copper, C.accent, C.gold, C.sky, C.leaf, C.sage][index % 6];

  return (
    <motion.div
      ref={ref}
      className="relative pt-4 transition-all duration-300"
      style={{
        transformOrigin: "top center",
      }}
      initial={{ opacity: 0, rotate: 0, y: 20 }}
      animate={
        inView
          ? { opacity: 1, rotate: rotation, y: 0 }
          : {}
      }
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{
        rotate: rotation * 1.3,
        y: -4,
        transition: {
          duration: 0.4,
          ease: [0.34, 1.56, 0.64, 1],
        },
      }}
    >
      <div
        className="relative rounded-lg p-5"
        style={{
          background: "#fff",
          boxShadow: glowShadow,
          border: `1px solid ${C.accent}15`,
        }}
      >
        {/* Push pin */}
        <PushPin color={pinColor} />

        <h4
          className="text-sm font-semibold mb-3 font-[family-name:var(--font-dm-serif)] pt-1"
          style={{ color: C.text }}
        >
          {tool.label}
        </h4>

        <div className="flex flex-wrap gap-1.5">
          {tool.items.map((item) => (
            <span
              key={item}
              className="px-2 py-0.5 rounded text-[11px] font-[family-name:var(--font-manrope)]"
              style={{
                background: C.cream,
                color: C.soil,
                border: `1px solid ${C.gold}30`,
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
