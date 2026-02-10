"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
} from "motion/react";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";

/* ─── palette ─── */
const C = {
  bg: "#1A0808",
  safelight: "#D4763A",
  cream: "#F0E6D3",
  yellow: "#C9A227",
  darkCard: "#1E0C0C",
  border: "rgba(240,230,211,0.12)",
  faintAmber: "rgba(212,118,58,0.08)",
};

/* ─── frame labels ─── */
const frameLabels = projects.map(
  (_, i) => `${Math.floor(i / 4) + 1}${String.fromCharCode(65 + (i % 4))}`
);

/* ─── nav items mapped to chemical steps ─── */
const navItems = [
  { label: "DEVELOPER", href: "#projects" },
  { label: "STOP BATH", href: "#expertise" },
  { label: "FIX", href: "#tools" },
  { label: "WASH", href: "#contact" },
];

/* ═══════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════ */

/* ─── Film Sprocket Strip ─── */
function SprocketStrip({ position }: { position: "top" | "bottom" }) {
  return (
    <div
      className="w-full h-6 relative overflow-hidden"
      style={{
        background: C.bg,
        borderTop: position === "bottom" ? `1px solid ${C.border}` : "none",
        borderBottom: position === "top" ? `1px solid ${C.border}` : "none",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `repeating-linear-gradient(90deg, transparent 0px, transparent 16px, ${C.cream}22 16px, ${C.cream}22 24px, transparent 24px, transparent 36px)`,
        }}
      />
      {/* Individual sprocket holes */}
      <div className="absolute inset-0 flex items-center">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="flex-shrink-0"
            style={{
              width: 8,
              height: 12,
              borderRadius: 2,
              background: `${C.cream}18`,
              marginLeft: i === 0 ? 14 : 28,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Developing Photo Card ─── */
function DevelopingCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className="relative group cursor-pointer"
      initial={{ opacity: 0, filter: "brightness(0) sepia(1)" }}
      animate={
        isInView
          ? { opacity: 1, filter: "brightness(1) sepia(0.2)" }
          : { opacity: 0, filter: "brightness(0) sepia(1)" }
      }
      transition={{ duration: 1.8, ease: "easeOut", delay: index * 0.12 }}
      whileHover={{ scale: 1.03, filter: "brightness(1.15) sepia(0.1)" }}
    >
      {/* Outer frame — thin white border like a contact sheet */}
      <div
        className="relative overflow-hidden"
        style={{
          border: `1px solid ${C.cream}55`,
          background: C.darkCard,
        }}
      >
        {/* Frame number */}
        <div
          className="absolute top-2 left-2 z-10 text-[10px] tracking-widest font-mono"
          style={{ color: C.yellow }}
        >
          {frameLabels[index]}
        </div>

        {/* Image area */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-all duration-700"
            style={{
              filter: "grayscale(0.8) sepia(0.3) contrast(1.2)",
            }}
          />
          {/* Amber overlay */}
          <div
            className="absolute inset-0 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-30"
            style={{
              background: `linear-gradient(135deg, ${C.safelight}44, ${C.bg}88)`,
              opacity: 0.5,
            }}
          />
          {/* Loupe glow on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle at center, ${C.safelight}22 0%, transparent 70%)`,
            }}
          />
        </div>

        {/* Info strip below image */}
        <div
          className="px-3 py-3"
          style={{ borderTop: `1px solid ${C.cream}18` }}
        >
          <h3
            className="text-sm font-medium leading-tight font-[family-name:var(--font-inter)]"
            style={{ color: C.cream }}
          >
            {project.title.replace("\n", " ")}
          </h3>
          <p
            className="text-[11px] mt-1.5 leading-relaxed opacity-60 font-[family-name:var(--font-inter)] line-clamp-3"
            style={{ color: C.cream }}
          >
            {project.description}
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            {project.tech.slice(0, 3).map((t) => (
              <span
                key={t}
                className="text-[9px] px-1.5 py-0.5 rounded font-mono uppercase tracking-wider"
                style={{
                  color: C.yellow,
                  background: `${C.yellow}12`,
                  border: `1px solid ${C.yellow}22`,
                }}
              >
                {t}
              </span>
            ))}
          </div>
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
  const chemSteps = ["DEVELOPER", "STOP", "FIX", "WASH"];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15 }}
      className="relative pl-5"
      style={{
        borderLeft: `3px solid ${C.safelight}`,
        background: C.darkCard,
        padding: "24px 24px 24px 28px",
      }}
    >
      <div
        className="text-[10px] font-mono tracking-[0.3em] mb-2"
        style={{ color: C.yellow }}
      >
        STEP {index + 1} — {chemSteps[index] || "PROCESS"}
      </div>
      <h3
        className="text-lg font-[family-name:var(--font-instrument)] italic"
        style={{ color: C.cream }}
      >
        {item.title}
      </h3>
      <p
        className="text-sm mt-2 leading-relaxed opacity-60 font-[family-name:var(--font-inter)]"
        style={{ color: C.cream }}
      >
        {item.body}
      </p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */

export default function DarkroomPage() {
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const vignetteOpacity = useTransform(scrollYProgress, [0, 0.3], [0.85, 0.5]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div
      className="relative min-h-screen font-[family-name:var(--font-inter)]"
      style={{ background: C.bg, color: C.cream }}
    >
      {/* ─── AMBIENT PULSING GLOW ─── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              `radial-gradient(ellipse 80% 60% at 50% 40%, ${C.safelight}08 0%, transparent 70%)`,
              `radial-gradient(ellipse 80% 60% at 50% 40%, ${C.safelight}14 0%, transparent 70%)`,
              `radial-gradient(ellipse 80% 60% at 50% 40%, ${C.safelight}08 0%, transparent 70%)`,
            ],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* ─── PERSISTENT VIGNETTE ─── */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{
          background: `radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, ${C.bg}cc 60%, ${C.bg} 100%)`,
          opacity: vignetteOpacity,
        }}
      />

      {/* ─── LIGHT LEAK STREAKS ─── */}
      <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden">
        <div
          className="absolute -top-[20%] -right-[10%] w-[80%] h-[120%] opacity-[0.03] rotate-[-25deg]"
          style={{
            background: `linear-gradient(180deg, transparent 0%, ${C.safelight} 40%, ${C.yellow} 60%, transparent 100%)`,
          }}
        />
        <div
          className="absolute -bottom-[30%] -left-[10%] w-[60%] h-[100%] opacity-[0.02] rotate-[15deg]"
          style={{
            background: `linear-gradient(180deg, transparent 0%, ${C.safelight} 50%, transparent 100%)`,
          }}
        />
      </div>

      {/* ─── FIXED NAVIGATION ─── */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? `${C.bg}ee` : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? `1px solid ${C.cream}08` : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <a
            href="#"
            className="text-lg font-[family-name:var(--font-instrument)] italic tracking-wide"
            style={{ color: C.safelight }}
          >
            DARKROOM
          </a>
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, i) => (
              <a
                key={item.label}
                href={item.href}
                className="text-[11px] tracking-[0.25em] font-mono transition-colors duration-300 hover:opacity-100 opacity-50"
                style={{ color: C.cream }}
              >
                <span style={{ color: C.yellow, marginRight: 6 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* ═══ HERO ═══ */}
      <section
        ref={heroRef}
        className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6"
      >
        {/* Radial amber glow behind hero content */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 50% 40% at 50% 45%, ${C.safelight}0d 0%, transparent 100%)`,
          }}
        />

        <motion.div
          className="relative text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          {/* Top accent line */}
          <motion.div
            className="mx-auto mb-8 h-px"
            style={{ background: C.safelight, width: 60 }}
            initial={{ width: 0 }}
            animate={{ width: 60 }}
            transition={{ duration: 1, delay: 0.5 }}
          />

          <div
            className="text-[10px] tracking-[0.5em] font-mono mb-6 uppercase"
            style={{ color: C.yellow }}
          >
            Analog Process / Digital Craft
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-[family-name:var(--font-instrument)] italic leading-[1.1] mb-8"
            style={{ color: C.cream }}
          >
            I turn AI models
            <br />
            into products
            <br />
            <span style={{ color: C.safelight }}>people use</span>
          </h1>

          <p
            className="text-sm md:text-base opacity-50 max-w-lg mx-auto leading-relaxed mb-12"
            style={{ color: C.cream }}
          >
            Building production AI applications — from multi-model orchestration
            to pixel-perfect interfaces. Each project developed with care.
          </p>

          {/* Exposure Data (Stats) */}
          <div
            className="inline-block px-8 py-5 rounded-sm"
            style={{
              border: `1px solid ${C.cream}15`,
              background: `${C.darkCard}99`,
            }}
          >
            <div
              className="text-[9px] tracking-[0.4em] font-mono mb-4 text-center"
              style={{ color: C.safelight }}
            >
              ▸ EXPOSURE DATA
            </div>
            <div className="flex items-center gap-10">
              {stats.map((stat, i) => (
                <div key={stat.label} className="text-center">
                  <motion.div
                    className="text-2xl md:text-3xl font-[family-name:var(--font-instrument)] italic"
                    style={{ color: C.safelight }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 + i * 0.15 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div
                    className="text-[9px] tracking-[0.3em] font-mono mt-1 uppercase"
                    style={{ color: `${C.cream}77` }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <div
            className="w-px h-10 mx-auto mb-2"
            style={{ background: `linear-gradient(to bottom, ${C.safelight}, transparent)` }}
          />
          <div
            className="text-[8px] tracking-[0.4em] font-mono"
            style={{ color: `${C.cream}44` }}
          >
            SCROLL
          </div>
        </motion.div>
      </section>

      {/* ═══ PROJECTS — CONTACT SHEET ═══ */}
      <section id="projects" className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section header */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div
              className="text-[10px] tracking-[0.5em] font-mono mb-3"
              style={{ color: C.yellow }}
            >
              ROLL 01 — {projects.length} EXPOSURES
            </div>
            <h2
              className="text-3xl md:text-4xl font-[family-name:var(--font-instrument)] italic"
              style={{ color: C.cream }}
            >
              Contact Sheet
            </h2>
            <div
              className="h-px mt-4"
              style={{
                background: `linear-gradient(to right, ${C.safelight}, transparent)`,
                maxWidth: 200,
              }}
            />
          </motion.div>

          {/* Film sprocket strip top */}
          <SprocketStrip position="top" />

          {/* Contact sheet grid */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px"
            style={{ background: `${C.cream}12` }}
          >
            {projects.map((project, i) => (
              <DevelopingCard key={project.title} project={project} index={i} />
            ))}
          </div>

          {/* Film sprocket strip bottom */}
          <SprocketStrip position="bottom" />

          {/* Film edge markings */}
          <div className="flex justify-between mt-3">
            <span
              className="text-[9px] font-mono tracking-wider opacity-30"
              style={{ color: C.cream }}
            >
              KODAK TRI-X 400 ◻ 5063
            </span>
            <span
              className="text-[9px] font-mono tracking-wider opacity-30"
              style={{ color: C.cream }}
            >
              → → →
            </span>
            <span
              className="text-[9px] font-mono tracking-wider opacity-30"
              style={{ color: C.cream }}
            >
              DX 6 7 8 9 10 11 12
            </span>
          </div>
        </div>
      </section>

      {/* ═══ EXPERTISE — CHEMICAL PROCESS ═══ */}
      <section id="expertise" className="relative z-10 py-20">
        <div className="max-w-4xl mx-auto px-6">
          {/* Section header */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div
              className="text-[10px] tracking-[0.5em] font-mono mb-3"
              style={{ color: C.yellow }}
            >
              PROCESSING CHEMISTRY
            </div>
            <h2
              className="text-3xl md:text-4xl font-[family-name:var(--font-instrument)] italic"
              style={{ color: C.cream }}
            >
              Chemical Process
            </h2>
            <div
              className="h-px mt-4"
              style={{
                background: `linear-gradient(to right, ${C.safelight}, transparent)`,
                maxWidth: 200,
              }}
            />
          </motion.div>

          {/* Process step labels */}
          <div
            className="flex items-center gap-3 mb-8 text-[10px] font-mono tracking-[0.2em] flex-wrap"
            style={{ color: `${C.cream}44` }}
          >
            <span style={{ color: C.safelight }}>DEVELOPER</span>
            <span>→</span>
            <span style={{ color: C.safelight }}>STOP</span>
            <span>→</span>
            <span style={{ color: C.safelight }}>FIX</span>
            <span>→</span>
            <span style={{ color: C.safelight }}>WASH</span>
          </div>

          {/* Expertise cards */}
          <div className="grid gap-4">
            {expertise.map((item, i) => (
              <ExpertiseCard key={item.title} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TOOLS — EQUIPMENT LIST ═══ */}
      <section id="tools" className="relative z-10 py-20">
        <div className="max-w-5xl mx-auto px-6">
          {/* Section header */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div
              className="text-[10px] tracking-[0.5em] font-mono mb-3"
              style={{ color: C.yellow }}
            >
              LAB INVENTORY
            </div>
            <h2
              className="text-3xl md:text-4xl font-[family-name:var(--font-instrument)] italic"
              style={{ color: C.cream }}
            >
              Equipment List
            </h2>
            <div
              className="h-px mt-4"
              style={{
                background: `linear-gradient(to right, ${C.safelight}, transparent)`,
                maxWidth: 200,
              }}
            />
          </motion.div>

          {/* Equipment grid — dense lab-inventory style */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((category, ci) => (
              <motion.div
                key={category.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: ci * 0.1 }}
                className="p-4"
                style={{
                  background: C.darkCard,
                  border: `1px solid ${C.cream}0a`,
                }}
              >
                {/* Category label — chemical formula style */}
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="text-[10px] font-mono tracking-[0.3em] uppercase"
                    style={{ color: C.safelight }}
                  >
                    C-{String(ci + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="text-[10px] font-mono tracking-[0.2em] uppercase opacity-70"
                    style={{ color: C.cream }}
                  >
                    {category.label}
                  </span>
                </div>
                <div
                  className="h-px mb-3"
                  style={{ background: `${C.cream}0d` }}
                />
                <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                  {category.items.map((item) => (
                    <span
                      key={item}
                      className="text-[11px] font-mono opacity-55 hover:opacity-100 transition-opacity cursor-default"
                      style={{ color: C.cream }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer
        id="contact"
        className="relative z-10 py-16 text-center"
        style={{ borderTop: `1px solid ${C.cream}0a` }}
      >
        <div className="max-w-4xl mx-auto px-6">
          {/* Decorative darkroom status */}
          <div
            className="flex items-center justify-center gap-4 text-[10px] font-mono tracking-[0.3em] mb-6"
            style={{ color: `${C.cream}33` }}
          >
            <span className="flex items-center gap-2">
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ background: C.safelight }}
              />
              SAFE LIGHT ON
            </span>
            <span>|</span>
            <span>DOOR LOCKED</span>
            <span>|</span>
            <span>TEMP 68°F</span>
          </div>

          <div
            className="text-xl font-[family-name:var(--font-instrument)] italic mb-4"
            style={{ color: C.cream }}
          >
            Every project, carefully developed.
          </div>

          <p
            className="text-[11px] font-mono tracking-[0.2em] opacity-30 mb-12"
            style={{ color: C.cream }}
          >
            SAFE LIGHT ON &bull; DOOR LOCKED &bull; &copy; 2025 GROX DARKROOM
          </p>

          {/* Theme switcher */}
          <ThemeSwitcher current="/darkroom" />
        </div>
      </footer>
    </div>
  );
}
