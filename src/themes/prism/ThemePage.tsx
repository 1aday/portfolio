"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "@/app/data/projects";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";
import { getProjectImage } from "@/lib/theme-images";

/* ─── Color constants ─── */
const C = {
  bg: "#FFFFFF",
  card: "#F8F9FA",
  dark: "#111111",
  muted: "#6B7280",
  violet: "#8B5CF6",
  border: "rgba(0,0,0,0.06)",
};

/* Spectrum colors for tech tags */
const spectrumColors = [
  "#EF4444", "#F97316", "#EAB308", "#22C55E", "#06B6D4", "#3B82F6", "#8B5CF6",
];

/* ─── Prismatic divider ─── */
function PrismDivider() {
  return (
    <div className="relative h-[2px] overflow-hidden my-1">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, transparent, ${spectrumColors[0]}20, ${spectrumColors[1]}20, ${spectrumColors[2]}20, ${spectrumColors[3]}20, ${spectrumColors[4]}20, ${spectrumColors[5]}20, ${spectrumColors[6]}20, transparent)`,
        }}
      />
    </div>
  );
}

/* ─── Scroll reveal wrapper ─── */
function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Holographic border card ─── */
function HoloCard({
  children,
  className = "",
  index = 0,
}: {
  children: React.ReactNode;
  className?: string;
  index?: number;
}) {
  const hue = (index * 40) % 360;

  return (
    <div
      className={`group relative rounded-2xl overflow-hidden ${className}`}
      style={{
        background: C.card,
      }}
    >
      {/* Animated holographic border */}
      <div
        className="absolute inset-0 rounded-2xl opacity-40 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          padding: "1.5px",
          background: `conic-gradient(from ${hue}deg, #EF4444, #F97316, #EAB308, #22C55E, #06B6D4, #3B82F6, #8B5CF6, #EF4444)`,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
        }}
      />
      {children}
    </div>
  );
}

/* ─── Project card ─── */
function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <HoloCard index={index} className="h-full">
        <div className="p-5 sm:p-6 flex flex-col h-full">
          {/* Image */}
          <div className="relative overflow-hidden rounded-xl mb-5" style={{ aspectRatio: "16/10" }}>
            <img
              src={getProjectImage("prism", project.image)}
              alt={project.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div
              className="absolute top-3 left-3 text-[11px] font-[family-name:var(--font-jakarta)] font-bold px-2.5 py-1 rounded-lg"
              style={{
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(8px)",
                color: C.dark,
              }}
            >
              {num}
            </div>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-[10px] uppercase tracking-[0.15em] font-[family-name:var(--font-jakarta)] font-medium"
              style={{ color: C.violet }}
            >
              {project.client}
            </span>
            <span style={{ color: `${C.muted}40` }}>&bull;</span>
            <span
              className="text-[10px] uppercase tracking-[0.15em] font-[family-name:var(--font-inter)]"
              style={{ color: C.muted }}
            >
              {project.year}
            </span>
          </div>

          {/* Title */}
          <h3
            className="font-[family-name:var(--font-jakarta)] font-bold leading-[1.2] whitespace-pre-line mb-3"
            style={{ fontSize: "1.15rem", color: C.dark }}
          >
            {project.title}
          </h3>

          {/* Description */}
          <p
            className="font-[family-name:var(--font-inter)] text-[13px] leading-[1.7] font-light mb-4 flex-1"
            style={{ color: C.muted }}
          >
            {project.description}
          </p>

          {/* Tech tags with spectrum colors */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tech.map((t, ti) => (
              <span
                key={t}
                className="text-[9px] uppercase tracking-[0.12em] font-[family-name:var(--font-jakarta)] font-medium px-2.5 py-1 rounded-full"
                style={{
                  color: spectrumColors[ti % spectrumColors.length],
                  background: `${spectrumColors[ti % spectrumColors.length]}10`,
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
            className="inline-flex items-center gap-2 text-[11px] font-[family-name:var(--font-jakarta)] font-medium transition-colors duration-300"
            style={{ color: C.violet }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.dark)}
            onMouseLeave={(e) => (e.currentTarget.style.color = C.violet)}
          >
            View Project
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </a>
        </div>
      </HoloCard>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   PRISM — HOLOGRAPHIC LIGHT REFRACTION
   ═══════════════════════════════════════════ */
export default function PrismPage() {
  useEffect(() => {
    document.documentElement.style.setProperty("--scroll", "0");
    const handleScroll = () => {
      const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      document.documentElement.style.setProperty("--scroll", String(scrolled));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const allToolItems = tools.flatMap((g) => g.items);

  return (
    <main
      className="min-h-screen overflow-hidden font-[family-name:var(--font-inter)]"
      style={{ background: C.bg, color: C.dark }}
    >
      {/* ─── Navigation ─── */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b"
        style={{
          background: `${C.bg}EE`,
          borderColor: C.border,
        }}
      >
        <div className="mx-auto max-w-[1200px] px-4 sm:px-10 py-5 flex items-center justify-between">
          <span className="font-[family-name:var(--font-jakarta)] text-xl font-bold tracking-tight">
            Grox
            <span style={{ color: C.violet }}>.</span>
          </span>
          <div className="flex items-center gap-6 sm:gap-8">
            {[
              { label: "Work", href: "#work" },
              { label: "About", href: "#about" },
              { label: "GitHub", href: "https://github.com/1aday", external: true },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="text-[11px] uppercase tracking-[0.15em] font-[family-name:var(--font-jakarta)] font-medium transition-colors duration-300"
                style={{ color: C.muted }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.violet)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* ─── Hero ─── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Prismatic triangle */}
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 right-[10%] w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] pointer-events-none opacity-[0.12]"
          style={{
            background: "conic-gradient(from 0deg, #EF4444, #F97316, #EAB308, #22C55E, #06B6D4, #3B82F6, #8B5CF6, #EF4444)",
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
            filter: "blur(40px)",
          }}
        />

        {/* Rainbow light beam */}
        <div
          className="absolute top-0 right-[30%] w-[200px] sm:w-[400px] h-full pointer-events-none opacity-[0.04]"
          style={{
            background: `linear-gradient(90deg, ${spectrumColors.join(", ")})`,
            transform: "skewX(-15deg)",
          }}
        />

        <div className="relative mx-auto max-w-[1200px] px-4 sm:px-10 w-full pt-32 sm:pt-0">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex items-center gap-3 mb-6"
            >
              <div
                className="h-2 w-2 rounded-full"
                style={{
                  background: `conic-gradient(from 0deg, ${spectrumColors.join(", ")})`,
                }}
              />
              <span
                className="text-[11px] uppercase tracking-[0.3em] font-[family-name:var(--font-jakarta)] font-medium"
                style={{ color: C.muted }}
              >
                AI Product Studio
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="font-[family-name:var(--font-jakarta)] font-extrabold leading-[1.05] tracking-tight"
              style={{ fontSize: "clamp(2.8rem, 7vw, 6rem)" }}
            >
              <span style={{ color: C.dark }}>I turn </span>
              <span
                style={{
                  background: `linear-gradient(135deg, ${spectrumColors.join(", ")})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                AI models
              </span>
              <br />
              <span style={{ color: `${C.muted}` }}>into products people use</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-8 text-[15px] leading-[1.9] font-light max-w-xl"
              style={{ color: C.muted }}
            >
              End-to-end product ownership — from computer vision and multi-model
              orchestration to pixel-perfect interfaces. 30+ shipped applications
              across 8 industries.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="mt-12 flex gap-12 sm:gap-16"
            >
              {stats.map((stat, i) => (
                <div key={stat.label}>
                  <div
                    className="font-[family-name:var(--font-jakarta)] font-extrabold text-4xl sm:text-5xl"
                    style={{ color: spectrumColors[(i * 2) % spectrumColors.length] }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-[10px] uppercase tracking-[0.2em] mt-2 font-[family-name:var(--font-jakarta)]"
                    style={{ color: C.muted }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-[2px] h-8 rounded-full"
            style={{
              background: `linear-gradient(to bottom, ${C.violet}, transparent)`,
            }}
          />
        </motion.div>
      </section>

      <div className="mx-auto max-w-[1200px] px-4 sm:px-10">
        <PrismDivider />
      </div>

      {/* ─── Selected Work ─── */}
      <section id="work" className="mx-auto max-w-[1200px] px-4 sm:px-10 py-20 sm:py-28">
        <Reveal>
          <div className="flex items-end justify-between mb-14">
            <div>
              <span
                className="text-[11px] uppercase tracking-[0.3em] block mb-3 font-[family-name:var(--font-jakarta)] font-medium"
                style={{ color: C.violet }}
              >
                Portfolio
              </span>
              <h2
                className="font-[family-name:var(--font-jakarta)] font-bold text-4xl sm:text-5xl tracking-tight"
                style={{ color: C.dark }}
              >
                Selected Work
              </h2>
            </div>
            <span
              className="text-[11px] uppercase tracking-[0.15em] hidden sm:block font-[family-name:var(--font-jakarta)]"
              style={{ color: C.muted }}
            >
              {projects.length} Projects
            </span>
          </div>
        </Reveal>

        {/* 3-column grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-[1200px] px-4 sm:px-10">
        <PrismDivider />
      </div>

      {/* ─── Expertise ─── */}
      <section id="about" className="mx-auto max-w-[1200px] px-4 sm:px-10 py-24 sm:py-36">
        <Reveal>
          <span
            className="text-[11px] uppercase tracking-[0.3em] block mb-3 font-[family-name:var(--font-jakarta)] font-medium"
            style={{ color: C.violet }}
          >
            Expertise
          </span>
          <h2
            className="font-[family-name:var(--font-jakarta)] font-bold text-4xl sm:text-5xl tracking-tight max-w-3xl leading-[1.1]"
            style={{ color: C.dark }}
          >
            Building at the intersection of{" "}
            <span
              style={{
                background: `linear-gradient(135deg, ${spectrumColors.join(", ")})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              design
            </span>{" "}
            and intelligence
          </h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-6 mt-16">
          {expertise.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1}>
              <HoloCard index={i} className="h-full">
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-5">
                    <span
                      className="font-[family-name:var(--font-jakarta)] font-extrabold text-4xl"
                      style={{ color: spectrumColors[i % spectrumColors.length] }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div
                      className="h-[2px] w-8 rounded-full transition-all duration-500 group-hover:w-16"
                      style={{ background: spectrumColors[i % spectrumColors.length] }}
                    />
                  </div>
                  <h3
                    className="text-lg font-[family-name:var(--font-jakarta)] font-bold tracking-tight mb-3"
                    style={{ color: C.dark }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-[14px] leading-[1.8] font-light font-[family-name:var(--font-inter)]"
                    style={{ color: C.muted }}
                  >
                    {item.body}
                  </p>
                </div>
              </HoloCard>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-[1200px] px-4 sm:px-10">
        <PrismDivider />
      </div>

      {/* ─── Tools ─── */}
      <section className="py-24 sm:py-32 overflow-hidden">
        <Reveal className="mx-auto max-w-[1200px] px-4 sm:px-10 mb-12">
          <span
            className="text-[11px] uppercase tracking-[0.3em] block mb-3 font-[family-name:var(--font-jakarta)] font-medium"
            style={{ color: C.violet }}
          >
            Stack
          </span>
          <h2
            className="font-[family-name:var(--font-jakarta)] font-bold text-4xl sm:text-5xl tracking-tight"
            style={{ color: C.dark }}
          >
            Tools &amp; Technologies
          </h2>
        </Reveal>

        {/* Ticker */}
        <div className="relative w-full overflow-hidden">
          <div
            className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: `linear-gradient(to right, ${C.bg}, transparent)` }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: `linear-gradient(to left, ${C.bg}, transparent)` }}
          />
          <div className="flex animate-marquee whitespace-nowrap">
            {[...allToolItems, ...allToolItems].map((item, i) => (
              <span key={i} className="flex items-center">
                <span
                  className="font-[family-name:var(--font-jakarta)] font-bold text-xl sm:text-2xl px-4 sm:px-6"
                  style={{ color: `${C.dark}CC` }}
                >
                  {item}
                </span>
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: spectrumColors[i % spectrumColors.length] }}
                />
              </span>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-[1200px] px-4 sm:px-10 mt-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-10">
            {tools.map((group, gi) => (
              <Reveal key={group.label} delay={gi * 0.05}>
                <h4
                  className="text-[10px] uppercase tracking-[0.2em] mb-4 font-[family-name:var(--font-jakarta)] font-bold"
                  style={{ color: spectrumColors[gi % spectrumColors.length] }}
                >
                  {group.label}
                </h4>
                <div className="flex flex-col gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="text-[14px] font-light cursor-default transition-colors duration-300 font-[family-name:var(--font-inter)]"
                      style={{ color: C.muted }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = C.dark)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1200px] px-4 sm:px-10">
        <PrismDivider />
      </div>

      {/* ─── Footer ─── */}
      <footer className="mx-auto max-w-[1200px] px-4 sm:px-10 py-24 sm:py-36">
        <Reveal>
          <div className="text-center">
            <h2
              className="font-[family-name:var(--font-jakarta)] font-bold tracking-tight leading-[1.1]"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", color: C.dark }}
            >
              Let&apos;s build{" "}
              <span
                style={{
                  background: `linear-gradient(135deg, ${spectrumColors.join(", ")})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                something.
              </span>
            </h2>
            <div className="mt-10 flex justify-center">
              <a
                href="https://github.com/1aday"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] uppercase tracking-[0.2em] font-[family-name:var(--font-jakarta)] font-medium transition-colors duration-300"
                style={{ color: C.muted }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.violet)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
              >
                GitHub &#8599;
              </a>
            </div>
          </div>
        </Reveal>

        <div className="mt-16 mb-8 mx-auto max-w-xl">
          <PrismDivider />
        </div>

        <div className="flex items-center justify-between">
          <span
            className="text-[10px] uppercase tracking-[0.2em] font-[family-name:var(--font-jakarta)]"
            style={{ color: `${C.muted}80` }}
          >
            Grox AI Product Studio
          </span>
          <span
            className="text-[10px] uppercase tracking-[0.2em] font-[family-name:var(--font-jakarta)]"
            style={{ color: `${C.muted}80` }}
          >
            2024 &mdash; Present
          </span>
        </div>
      </footer>

      <ThemeSwitcher current="/prism" variant="light" />
    </main>
  );
}
