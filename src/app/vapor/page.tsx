"use client";
import { useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { getProjectImage } from "@/lib/theme-images";

/* ─── Color constants ─── */
const C = {
  bg: "#1A0B2E",
  card: "#2D1B4E",
  pink: "#FF6EC7",
  cyan: "#00F5FF",
  orange: "#FF8C00",
  text: "#F0E6FF",
  muted: "#8B7AA8",
};

/* ─── Neon glow helpers ─── */
const pinkGlow = `0 0 15px rgba(255,110,199,0.3), 0 0 30px rgba(255,110,199,0.1)`;
const cyanGlow = `0 0 15px rgba(0,245,255,0.3), 0 0 30px rgba(0,245,255,0.1)`;
const gradientText: React.CSSProperties = {
  background: `linear-gradient(90deg, ${C.pink}, ${C.cyan})`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

/* ─── CSS keyframes injected once ─── */
const styleId = "vapor-keyframes";
function injectStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(styleId)) return;
  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = `
    @keyframes vapor-pulse-line {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes vapor-grid-scroll {
      0%   { background-position: 0 0; }
      100% { background-position: 0 50px; }
    }
  `;
  document.head.appendChild(style);
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
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
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
  project: (typeof projects)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative rounded-lg p-[1px] transition-all duration-500"
      style={{
        background: `linear-gradient(135deg, ${C.pink}40, ${C.cyan}40)`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = `linear-gradient(135deg, ${C.pink}90, ${C.cyan}90)`;
        e.currentTarget.style.boxShadow = `0 0 25px rgba(255,110,199,0.2), 0 0 50px rgba(0,245,255,0.1)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = `linear-gradient(135deg, ${C.pink}40, ${C.cyan}40)`;
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        className="rounded-lg p-6 sm:p-8 h-full"
        style={{ background: `${C.card}E6` }}
      >
        {/* Project image */}
        <div style={{ margin: "-24px -24px 20px -24px", overflow: "hidden", borderRadius: "8px 8px 0 0", position: "relative" }}>
          <img
            src={getProjectImage("vapor", project.image)}
            alt={project.title.replace(/\n/g, " ")}
            loading="lazy"
            style={{
              display: "block", width: "100%", aspectRatio: "16/9", objectFit: "cover",
              filter: "hue-rotate(260deg) saturate(1.5) brightness(0.6)",
            }}
          />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${C.pink}40, ${C.cyan}40)` }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40%", background: `linear-gradient(to bottom, transparent, ${C.card}E6)` }} />
        </div>

        {/* Top row: number + meta */}
        <div className="flex items-start justify-between mb-5">
          <span
            className="font-[family-name:var(--font-orbitron)] font-bold leading-none select-none"
            style={{
              fontSize: "clamp(2.5rem, 4vw, 4rem)",
              ...gradientText,
            }}
          >
            {num}
          </span>
          <div className="flex items-center gap-3 mt-2">
            <span
              className="text-[10px] uppercase tracking-[0.2em] font-[family-name:var(--font-inter)]"
              style={{ color: C.muted }}
            >
              {project.client}
            </span>
            <span style={{ color: `${C.muted}40` }}>/</span>
            <span
              className="text-[10px] uppercase tracking-[0.2em] font-[family-name:var(--font-orbitron)]"
              style={{ color: C.cyan }}
            >
              {project.year}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3
          className="font-[family-name:var(--font-orbitron)] uppercase leading-[1.2] tracking-wide whitespace-pre-line mb-4"
          style={{
            fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
            color: C.text,
          }}
        >
          {project.title}
        </h3>

        {/* Description */}
        <p
          className="font-[family-name:var(--font-inter)] text-[14px] leading-[1.8] font-light mb-3"
          style={{ color: C.muted }}
        >
          {project.description}
        </p>
        <p
          className="font-[family-name:var(--font-inter)] text-[13px] leading-[1.7] font-light mb-5"
          style={{ color: `${C.muted}90` }}
        >
          {project.technical}
        </p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech.map((t) => (
            <span
              key={t}
              className="text-[10px] uppercase tracking-[0.15em] font-[family-name:var(--font-orbitron)] rounded-full px-3 py-1 transition-all duration-300 cursor-default"
              style={{
                color: C.cyan,
                border: `1px solid ${C.cyan}50`,
                textShadow: `0 0 8px ${C.cyan}30`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = cyanGlow;
                e.currentTarget.style.borderColor = C.cyan;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = `${C.cyan}50`;
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* GitHub link */}
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] transition-all duration-300 font-[family-name:var(--font-orbitron)]"
          style={{ color: C.pink }}
          onMouseEnter={(e) => {
            e.currentTarget.style.textShadow = `0 0 12px ${C.pink}60`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textShadow = "none";
          }}
        >
          View Project
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
    </motion.div>
  );
}

/* ===================================================
   VAPOR PAGE — Synthwave / Retrowave
   =================================================== */
export default function VaporPage() {
  useEffect(() => {
    injectStyles();
  }, []);

  return (
    <main
      className="min-h-screen overflow-hidden font-[family-name:var(--font-inter)]"
      style={{ background: C.bg, color: C.text }}
    >
      {/* ─── Navigation ─── */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b"
        style={{
          background: `${C.bg}CC`,
          borderColor: `${C.pink}20`,
        }}
      >
        <div className="mx-auto max-w-[1400px] px-4 sm:px-10 py-4 sm:py-5 flex items-center justify-between">
          <span
            className="font-[family-name:var(--font-orbitron)] text-xl sm:text-2xl font-bold uppercase tracking-[0.15em]"
            style={{
              color: C.pink,
              textShadow: `0 0 20px ${C.pink}, 0 0 40px ${C.pink}80`,
            }}
          >
            GROX
          </span>
          <div className="flex items-center gap-4 sm:gap-8">
            {[
              { label: "Work", href: "#work" },
              { label: "About", href: "#about" },
              {
                label: "GitHub",
                href: "https://github.com/1aday",
                external: true,
              },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="relative text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.3em] transition-all duration-300 font-[family-name:var(--font-orbitron)]"
                style={{ color: `${C.muted}CC` }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = C.cyan;
                  e.currentTarget.style.textShadow = `0 0 10px ${C.cyan}60`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = `${C.muted}CC`;
                  e.currentTarget.style.textShadow = "none";
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* ─── Hero ─── */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
        {/* Ambient glow — pink */}
        <div
          className="absolute top-[20%] left-[20%] w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${C.pink}12 0%, transparent 70%)`,
            filter: "blur(80px)",
          }}
        />
        {/* Ambient glow — cyan */}
        <div
          className="absolute top-[30%] right-[15%] w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${C.cyan}10 0%, transparent 70%)`,
            filter: "blur(80px)",
          }}
        />

        {/* Content */}
        <div className="relative mx-auto max-w-[1400px] px-4 sm:px-10 w-full pt-32 sm:pt-0 z-10">
          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex items-center gap-3 mb-6"
          >
            <div
              className="h-[2px] w-8"
              style={{
                background: `linear-gradient(90deg, ${C.pink}, ${C.cyan})`,
              }}
            />
            <span
              className="text-[11px] uppercase tracking-[0.35em] font-[family-name:var(--font-orbitron)]"
              style={{ color: C.muted }}
            >
              AI Product Studio
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.2,
              delay: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="font-[family-name:var(--font-orbitron)] uppercase leading-[1.05] tracking-[0.04em]"
            style={{
              fontSize: "clamp(2.5rem, 8vw, 7rem)",
            }}
          >
            <span style={gradientText}>I turn AI models</span>
            <br />
            <span style={{ color: `${C.text}90` }}>
              into products
              <br className="sm:hidden" /> people use
            </span>
          </motion.h1>

          {/* Animated gradient line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 origin-left max-w-2xl"
          >
            <div
              style={{
                height: 2,
                background: `linear-gradient(90deg, ${C.pink}, ${C.cyan}, ${C.orange}, ${C.pink})`,
                backgroundSize: "200% 100%",
                animation: "vapor-pulse-line 3s ease-in-out infinite",
              }}
            />
          </motion.div>

          {/* Stats — neon boxes */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-12 flex flex-wrap gap-6 sm:gap-8"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 1.0 + i * 0.15,
                }}
                className="px-6 py-4 rounded-lg"
                style={{
                  border: `1px solid ${C.pink}40`,
                  boxShadow: pinkGlow,
                  background: `${C.card}80`,
                }}
              >
                <div
                  className="font-[family-name:var(--font-orbitron)] text-3xl sm:text-4xl font-bold"
                  style={gradientText}
                >
                  {stat.value}
                </div>
                <div
                  className="text-[10px] uppercase tracking-[0.25em] mt-1 font-[family-name:var(--font-orbitron)]"
                  style={{ color: C.muted }}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ─── Perspective grid floor ─── */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{ height: "40%", overflow: "hidden" }}
        >
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: "-50%",
              right: "-50%",
              height: "100%",
              background: `
                repeating-linear-gradient(
                  90deg,
                  ${C.pink}15 0px,
                  transparent 1px,
                  transparent 60px
                ),
                repeating-linear-gradient(
                  0deg,
                  ${C.cyan}12 0px,
                  transparent 1px,
                  transparent 40px
                )
              `,
              transform: "perspective(500px) rotateX(60deg)",
              transformOrigin: "center bottom",
              animation: "vapor-grid-scroll 2s linear infinite",
              maskImage:
                "linear-gradient(to bottom, transparent 0%, black 30%, black 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, black 30%, black 100%)",
            }}
          />
          {/* Horizon glow line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background: `linear-gradient(90deg, transparent, ${C.pink}80, ${C.cyan}80, transparent)`,
              boxShadow: `0 0 30px ${C.pink}40, 0 0 60px ${C.cyan}20`,
            }}
          />
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span
              className="text-[9px] uppercase tracking-[0.3em] font-[family-name:var(--font-orbitron)]"
              style={{ color: `${C.muted}80` }}
            >
              Scroll
            </span>
            <div
              className="w-[1px] h-8"
              style={{
                background: `linear-gradient(to bottom, ${C.cyan}80, transparent)`,
              }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Selected Work ─── */}
      <section
        id="work"
        className="relative mx-auto max-w-[1400px] px-4 sm:px-10 py-20 sm:py-28"
      >
        <Reveal>
          <div className="flex items-end justify-between mb-16">
            <div>
              <span
                className="text-[11px] uppercase tracking-[0.35em] block mb-4 font-[family-name:var(--font-orbitron)]"
                style={{ color: C.pink }}
              >
                Portfolio
              </span>
              <h2
                className="font-[family-name:var(--font-orbitron)] uppercase tracking-wide"
                style={{
                  fontSize: "clamp(1.8rem, 5vw, 3.5rem)",
                  ...gradientText,
                }}
              >
                Selected Work
              </h2>
            </div>
            <span
              className="text-[11px] uppercase tracking-[0.2em] hidden sm:block font-[family-name:var(--font-orbitron)]"
              style={{ color: `${C.muted}80` }}
            >
              {projects.length} Projects
            </span>
          </div>
        </Reveal>

        <div className="grid gap-6 sm:gap-8">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-[1400px] px-4 sm:px-10">
        <div
          style={{
            height: 1,
            background: `linear-gradient(90deg, transparent, ${C.pink}30 20%, ${C.cyan}30 80%, transparent)`,
          }}
        />
      </div>

      {/* ─── Expertise ─── */}
      <section
        id="about"
        className="mx-auto max-w-[1400px] px-4 sm:px-10 py-24 sm:py-36"
      >
        <Reveal>
          <span
            className="text-[11px] uppercase tracking-[0.35em] block mb-4 font-[family-name:var(--font-orbitron)]"
            style={{ color: C.pink }}
          >
            Expertise
          </span>
          <h2
            className="font-[family-name:var(--font-orbitron)] uppercase tracking-wide max-w-4xl leading-[1.2]"
            style={{
              fontSize: "clamp(1.5rem, 4vw, 2.8rem)",
              color: C.text,
            }}
          >
            Building at the intersection of{" "}
            <span style={gradientText}>design</span> and{" "}
            <span style={{ color: C.cyan }}>intelligence</span>
          </h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-8 sm:gap-10 mt-16 sm:mt-20">
          {expertise.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1}>
              <div
                className="p-6 sm:p-8 rounded-lg transition-all duration-500"
                style={{
                  background: `${C.card}80`,
                  border: `1px solid ${C.pink}15`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${C.pink}40`;
                  e.currentTarget.style.boxShadow = pinkGlow;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${C.pink}15`;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div className="flex items-center gap-4 mb-5">
                  <span
                    className="font-[family-name:var(--font-orbitron)] text-3xl sm:text-4xl font-bold leading-none"
                    style={{ color: C.pink }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div
                    className="h-[1px] flex-1 max-w-[60px]"
                    style={{
                      background: `linear-gradient(90deg, ${C.pink}60, transparent)`,
                    }}
                  />
                </div>
                <h3
                  className="text-lg font-[family-name:var(--font-orbitron)] uppercase tracking-wide mb-3 pb-2"
                  style={{
                    color: C.text,
                    borderBottom: `2px solid ${C.cyan}40`,
                  }}
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
            </Reveal>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-[1400px] px-4 sm:px-10">
        <div
          style={{
            height: 1,
            background: `linear-gradient(90deg, transparent, ${C.cyan}30 20%, ${C.pink}30 80%, transparent)`,
          }}
        />
      </div>

      {/* ─── Tools ─── */}
      <section className="mx-auto max-w-[1400px] px-4 sm:px-10 py-24 sm:py-36">
        <Reveal>
          <span
            className="text-[11px] uppercase tracking-[0.35em] block mb-4 font-[family-name:var(--font-orbitron)]"
            style={{ color: C.cyan }}
          >
            Stack
          </span>
          <h2
            className="font-[family-name:var(--font-orbitron)] uppercase tracking-wide mb-16"
            style={{
              fontSize: "clamp(1.8rem, 5vw, 3.5rem)",
              ...gradientText,
            }}
          >
            Tools &amp; Technologies
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 sm:gap-10">
          {tools.map((group, gi) => (
            <Reveal key={group.label} delay={gi * 0.06}>
              <h4
                className="text-[10px] uppercase tracking-[0.3em] mb-4 font-[family-name:var(--font-orbitron)]"
                style={{ color: gi % 2 === 0 ? C.pink : C.cyan }}
              >
                {group.label}
              </h4>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item, ii) => {
                  const accent = (gi + ii) % 2 === 0 ? C.pink : C.cyan;
                  return (
                    <span
                      key={item}
                      className="text-[11px] font-[family-name:var(--font-inter)] px-3 py-1.5 rounded-full transition-all duration-300 cursor-default"
                      style={{
                        color: accent,
                        border: `1px solid ${accent}40`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = accent;
                        e.currentTarget.style.boxShadow =
                          accent === C.pink ? pinkGlow : cyanGlow;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = `${accent}40`;
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      {item}
                    </span>
                  );
                })}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-[1400px] px-4 sm:px-10">
        <div
          style={{
            height: 1,
            background: `linear-gradient(90deg, transparent, ${C.pink}30 20%, ${C.cyan}30 80%, transparent)`,
          }}
        />
      </div>

      {/* ─── Footer ─── */}
      <footer className="relative mx-auto max-w-[1400px] px-4 sm:px-10 py-24 sm:py-36 overflow-hidden">
        <Reveal>
          <div className="text-center relative z-10">
            <h2
              className="font-[family-name:var(--font-orbitron)] uppercase tracking-wide leading-[1.2]"
              style={{
                fontSize: "clamp(2rem, 6vw, 4.5rem)",
                ...gradientText,
              }}
            >
              Let&apos;s build something.
            </h2>

            <div className="mt-10 flex justify-center gap-8">
              <a
                href="https://github.com/1aday"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] uppercase tracking-[0.3em] transition-all duration-300 font-[family-name:var(--font-orbitron)]"
                style={{ color: C.cyan }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textShadow = `0 0 12px ${C.cyan}80`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textShadow = "none";
                }}
              >
                GitHub &#8599;
              </a>
            </div>
          </div>
        </Reveal>

        {/* Retro grid fade at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{ height: "50%", overflow: "hidden" }}
        >
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: "-50%",
              right: "-50%",
              height: "100%",
              background: `
                repeating-linear-gradient(
                  90deg,
                  ${C.pink}08 0px,
                  transparent 1px,
                  transparent 80px
                ),
                repeating-linear-gradient(
                  0deg,
                  ${C.cyan}06 0px,
                  transparent 1px,
                  transparent 50px
                )
              `,
              transform: "perspective(400px) rotateX(55deg)",
              transformOrigin: "center bottom",
              maskImage:
                "linear-gradient(to bottom, transparent 0%, black 50%, black 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, black 50%, black 100%)",
            }}
          />
        </div>

        <div
          className="mt-16 mb-8 mx-auto max-w-xl"
          style={{
            height: 1,
            background: `linear-gradient(90deg, transparent, ${C.pink}40, ${C.cyan}40, transparent)`,
          }}
        />

        <div className="flex items-center justify-between relative z-10">
          <span
            className="text-[10px] uppercase tracking-[0.2em] font-[family-name:var(--font-orbitron)]"
            style={{ color: `${C.muted}60` }}
          >
            Grox AI Product Studio
          </span>
          <span
            className="text-[10px] uppercase tracking-[0.2em] font-[family-name:var(--font-orbitron)]"
            style={{ color: `${C.muted}60` }}
          >
            2024 &mdash; Present
          </span>
        </div>
      </footer>

      {/* Theme Switcher */}
      <ThemeSwitcher current="/vapor" />
    </main>
  );
}
