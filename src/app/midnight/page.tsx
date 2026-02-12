"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { getProjectImage } from "@/lib/theme-images";

/* ─── Color constants ─── */
const C = {
  bg: "#0A0F2E",
  card: "#111840",
  gold: "#D4AF37",
  cream: "#F5F0E8",
  muted: "#A0A8C0",
  rule: "rgba(212,175,55,0.2)",
};

/* ─── Gold horizontal rule ─── */
function GoldRule() {
  return (
    <div
      style={{
        height: 1,
        background: `linear-gradient(90deg, transparent, ${C.rule} 20%, ${C.rule} 80%, transparent)`,
      }}
    />
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
      initial={{ opacity: 0, y: 36 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Alternating project card ─── */
function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const isEven = index % 2 === 1;
  const num = String(index + 1).padStart(2, "0");

  const numberAndTitle = (
    <div className="flex flex-col gap-4">
      <span
        className="font-[family-name:var(--font-playfair)] italic leading-none select-none"
        style={{ fontSize: "clamp(3rem, 5vw, 5rem)", color: C.gold }}
      >
        {num}
      </span>
      <h3
        className="font-[family-name:var(--font-playfair)] italic leading-[1.1] tracking-tight whitespace-pre-line"
        style={{
          fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
          color: C.cream,
        }}
      >
        {project.title}
      </h3>
      <div className="flex items-center gap-3 mt-1">
        <span
          className="text-[11px] uppercase tracking-[0.2em]"
          style={{ color: C.muted }}
        >
          {project.client}
        </span>
        <span style={{ color: `${C.muted}40` }}>&mdash;</span>
        <span
          className="text-[11px] uppercase tracking-[0.2em]"
          style={{ color: C.gold }}
        >
          {project.year}
        </span>
      </div>
    </div>
  );

  const description = (
    <div className="flex flex-col gap-4">
      <p
        className="font-[family-name:var(--font-inter)] text-[14px] leading-[1.8] font-light"
        style={{ color: C.muted }}
      >
        {project.description}
      </p>
      <p
        className="font-[family-name:var(--font-inter)] text-[13px] leading-[1.7] font-light"
        style={{ color: `${C.muted}90` }}
      >
        {project.technical}
      </p>
      <div className="flex flex-wrap gap-2 mt-2">
        {project.tech.map((t) => (
          <span
            key={t}
            className="text-[10px] uppercase tracking-[0.15em] font-[family-name:var(--font-inter)] rounded-full px-3 py-1 transition-colors duration-300"
            style={{
              color: C.gold,
              border: `1px solid ${C.gold}40`,
            }}
          >
            {t}
          </span>
        ))}
      </div>
      <a
        href={project.github}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 mt-2 text-[11px] uppercase tracking-[0.2em] transition-colors duration-300"
        style={{ color: `${C.gold}99` }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.color = C.gold)
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.color = `${C.gold}99`)
        }
      >
        View Project
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M7 17L17 7M17 7H7M17 7V17" />
        </svg>
      </a>
    </div>
  );

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative py-12 sm:py-16 px-4 sm:px-8 rounded-sm transition-all duration-500"
      style={{
        borderLeft: "2px solid transparent",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderLeftColor = `${C.gold}60`;
        e.currentTarget.style.background = `${C.card}80`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderLeftColor = "transparent";
        e.currentTarget.style.background = "transparent";
      }}
    >
      {/* Background project image */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity: 0.06, borderRadius: 2 }}>
        <img
          src={getProjectImage("midnight", project.image)}
          alt=""
          loading="lazy"
          style={{
            display: "block", width: "100%", height: "100%", objectFit: "cover",
            filter: "sepia(0.5) hue-rotate(10deg) brightness(0.5) contrast(1.2)",
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(212,175,55,0.15)" }} />
      </div>

      {/* Desktop: alternating 2-column */}
      <div className="hidden md:grid md:grid-cols-2 md:gap-16 items-start">
        {isEven ? (
          <>
            {description}
            {numberAndTitle}
          </>
        ) : (
          <>
            {numberAndTitle}
            {description}
          </>
        )}
      </div>

      {/* Mobile: always number/title first */}
      <div className="md:hidden flex flex-col gap-6">
        {numberAndTitle}
        {description}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   MIDNIGHT EDITORIAL PAGE
   ═══════════════════════════════════════════ */
export default function MidnightPage() {
  useEffect(() => {
    document.documentElement.style.setProperty("--scroll", "0");
    const handleScroll = () => {
      const scrolled =
        window.scrollY / (document.body.scrollHeight - window.innerHeight);
      document.documentElement.style.setProperty("--scroll", String(scrolled));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Flatten all tool items for the marquee ticker */
  const allToolItems = tools.flatMap((group) =>
    group.items.map((item) => `${item}`)
  );

  return (
    <main
      className="min-h-screen overflow-hidden font-[family-name:var(--font-inter)]"
      style={{ background: C.bg, color: C.cream }}
    >
      {/* ─── Navigation ─── */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b"
        style={{
          background: `${C.bg}CC`,
          borderColor: `${C.gold}15`,
        }}
      >
        <div className="mx-auto max-w-[1400px] px-4 sm:px-10 py-5 sm:py-6 flex items-center justify-between">
          <span className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl tracking-wide">
            Grox<span style={{ color: C.gold }}>.</span>
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
                className="relative text-[10px] sm:text-[11px] uppercase tracking-[0.15em] sm:tracking-[0.25em] transition-colors duration-300 font-[family-name:var(--font-inter)]"
                style={{ color: `${C.muted}99` }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = C.gold)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = `${C.muted}99`)
                }
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* ─── Hero ─── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Gold radial glow */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.08, 0.12, 0.08],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-[30%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] sm:w-[900px] sm:h-[900px] rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${C.gold}18 0%, ${C.gold}08 30%, transparent 70%)`,
            filter: "blur(60px)",
          }}
        />

        <div className="relative mx-auto max-w-[1400px] px-4 sm:px-10 w-full pt-32 sm:pt-0">
          <div className="flex flex-col md:flex-row md:items-center md:gap-16 lg:gap-24">
            {/* LEFT: 60% — massive headline */}
            <div className="md:w-[60%]">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex items-center gap-3 mb-6"
              >
                <div
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: C.gold }}
                />
                <span
                  className="text-[11px] uppercase tracking-[0.3em] font-[family-name:var(--font-inter)]"
                  style={{ color: `${C.muted}80` }}
                >
                  AI Product Studio
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1.2,
                  delay: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="font-[family-name:var(--font-playfair)] italic leading-[1.05] tracking-[-0.02em]"
                style={{
                  fontSize: "clamp(3rem, 8vw, 7rem)",
                  color: C.cream,
                }}
              >
                I turn{" "}
                <span style={{ color: C.gold }}>AI models</span>
                <br />
                into{" "}
                <span style={{ color: `${C.muted}90` }}>
                  products people use
                </span>
              </motion.h1>

              {/* Thin gold rule below hero text */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="mt-8 origin-left"
              >
                <div
                  style={{
                    height: 1,
                    background: `linear-gradient(90deg, ${C.gold}50, ${C.gold}20 60%, transparent)`,
                  }}
                />
              </motion.div>
            </div>

            {/* RIGHT: 40% — description + stats */}
            <div className="md:w-[40%] mt-10 md:mt-0">
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="text-[15px] leading-[1.9] font-light font-[family-name:var(--font-inter)]"
                style={{ color: C.muted }}
              >
                End-to-end product ownership — from computer vision and
                multi-model orchestration to pixel-perfect interfaces.
                30+ shipped applications across 8 industries.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="mt-10 flex gap-10 sm:gap-12"
              >
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: 0.8 + i * 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <div
                      className="font-[family-name:var(--font-playfair)] italic text-4xl sm:text-5xl"
                      style={{ color: C.gold }}
                    >
                      {stat.value}
                    </div>
                    <div
                      className="text-[10px] uppercase tracking-[0.25em] mt-2 font-[family-name:var(--font-inter)]"
                      style={{ color: `${C.muted}80` }}
                    >
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
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
            className="w-[1px] h-8"
            style={{
              background: `linear-gradient(to bottom, ${C.gold}60, transparent)`,
            }}
          />
        </motion.div>
      </section>

      <div className="mx-auto max-w-[1400px] px-4 sm:px-10">
        <GoldRule />
      </div>

      {/* ─── Selected Work ─── */}
      <section
        id="work"
        className="mx-auto max-w-[1400px] px-4 sm:px-10 py-20 sm:py-28"
      >
        <Reveal>
          <div className="flex items-end justify-between mb-16">
            <div>
              <span
                className="text-[11px] uppercase tracking-[0.3em] block mb-4 font-[family-name:var(--font-inter)]"
                style={{ color: `${C.muted}80` }}
              >
                Portfolio
              </span>
              <h2
                className="font-[family-name:var(--font-playfair)] italic text-4xl sm:text-6xl tracking-tight"
                style={{ color: C.cream }}
              >
                Selected Work
              </h2>
            </div>
            <span
              className="text-[11px] uppercase tracking-[0.2em] hidden sm:block font-[family-name:var(--font-inter)]"
              style={{ color: `${C.muted}60` }}
            >
              {projects.length} Projects
            </span>
          </div>
        </Reveal>

        <div className="flex flex-col">
          {projects.map((project, i) => (
            <div key={project.title}>
              <ProjectCard project={project} index={i} />
              {i < projects.length - 1 && (
                <div className="px-4 sm:px-8">
                  <GoldRule />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-4 sm:px-10">
        <GoldRule />
      </div>

      {/* ─── Expertise ─── */}
      <section
        id="about"
        className="mx-auto max-w-[1400px] px-4 sm:px-10 py-24 sm:py-36"
      >
        <Reveal>
          <span
            className="text-[11px] uppercase tracking-[0.3em] block mb-4 font-[family-name:var(--font-inter)]"
            style={{ color: `${C.muted}80` }}
          >
            Expertise
          </span>
          <h2
            className="font-[family-name:var(--font-playfair)] italic text-4xl sm:text-6xl tracking-tight max-w-3xl leading-[1.1]"
            style={{ color: C.cream }}
          >
            Building at the intersection of{" "}
            <span style={{ color: C.gold }}>design</span> and{" "}
            <span style={{ color: `${C.muted}90` }}>intelligence</span>
          </h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-x-16 gap-y-16 mt-20">
          {expertise.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1}>
              <div
                className="group p-6 sm:p-8 rounded-sm transition-all duration-500"
                style={{ background: `${C.card}60` }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = `${C.card}`)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = `${C.card}60`)
                }
              >
                <div className="flex items-center gap-4 mb-5">
                  <span
                    className="font-[family-name:var(--font-playfair)] italic text-4xl sm:text-5xl leading-none"
                    style={{ color: C.gold }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div
                    className="h-[1px] w-8 transition-all duration-500 group-hover:w-16"
                    style={{ background: `${C.gold}40` }}
                  />
                </div>
                <h3
                  className="text-lg font-[family-name:var(--font-playfair)] tracking-tight mb-3"
                  style={{ color: C.cream }}
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

      <div className="mx-auto max-w-[1400px] px-4 sm:px-10">
        <GoldRule />
      </div>

      {/* ─── Tools Marquee ─── */}
      <section className="py-24 sm:py-32 overflow-hidden">
        <Reveal className="mx-auto max-w-[1400px] px-4 sm:px-10 mb-12">
          <span
            className="text-[11px] uppercase tracking-[0.3em] block mb-4 font-[family-name:var(--font-inter)]"
            style={{ color: `${C.muted}80` }}
          >
            Stack
          </span>
          <h2
            className="font-[family-name:var(--font-playfair)] italic text-4xl sm:text-6xl tracking-tight"
            style={{ color: C.cream }}
          >
            Tools &amp; Technologies
          </h2>
        </Reveal>

        {/* Horizontal scrolling ticker */}
        <div className="relative w-full overflow-hidden">
          {/* Fade edges */}
          <div
            className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{
              background: `linear-gradient(to right, ${C.bg}, transparent)`,
            }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{
              background: `linear-gradient(to left, ${C.bg}, transparent)`,
            }}
          />

          <div className="flex animate-marquee whitespace-nowrap">
            {/* First set */}
            {allToolItems.map((item, i) => (
              <span key={`a-${i}`} className="flex items-center">
                <span
                  className="font-[family-name:var(--font-playfair)] italic text-xl sm:text-2xl tracking-wide px-4 sm:px-6"
                  style={{ color: `${C.cream}CC` }}
                >
                  {item}
                </span>
                <span
                  className="text-[8px]"
                  style={{ color: C.gold }}
                >
                  &#9679;
                </span>
              </span>
            ))}
            {/* Duplicate for seamless loop */}
            {allToolItems.map((item, i) => (
              <span key={`b-${i}`} className="flex items-center">
                <span
                  className="font-[family-name:var(--font-playfair)] italic text-xl sm:text-2xl tracking-wide px-4 sm:px-6"
                  style={{ color: `${C.cream}CC` }}
                >
                  {item}
                </span>
                <span
                  className="text-[8px]"
                  style={{ color: C.gold }}
                >
                  &#9679;
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Detailed tool groups below ticker */}
        <div className="mx-auto max-w-[1400px] px-4 sm:px-10 mt-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-10">
            {tools.map((group, gi) => (
              <Reveal key={group.label} delay={gi * 0.05}>
                <h4
                  className="text-[10px] uppercase tracking-[0.25em] mb-4 font-[family-name:var(--font-inter)]"
                  style={{ color: `${C.gold}90` }}
                >
                  {group.label}
                </h4>
                <div className="flex flex-col gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="text-[14px] font-light cursor-default transition-colors duration-300 font-[family-name:var(--font-inter)]"
                      style={{ color: `${C.muted}99` }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = C.cream)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = `${C.muted}99`)
                      }
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

      <div className="mx-auto max-w-[1400px] px-4 sm:px-10">
        <GoldRule />
      </div>

      {/* ─── Footer ─── */}
      <footer className="mx-auto max-w-[1400px] px-4 sm:px-10 py-24 sm:py-36">
        <Reveal>
          <div className="text-center">
            <h2
              className="font-[family-name:var(--font-playfair)] italic tracking-tight leading-[1.1]"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 5rem)",
                color: C.cream,
              }}
            >
              Let&apos;s build{" "}
              <span style={{ color: `${C.gold}CC` }}>something.</span>
            </h2>

            <div className="mt-10 flex justify-center gap-8">
              <a
                href="https://github.com/1aday"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] uppercase tracking-[0.25em] transition-colors duration-300 font-[family-name:var(--font-inter)]"
                style={{ color: `${C.muted}99` }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = C.gold)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = `${C.muted}99`)
                }
              >
                GitHub &#8599;
              </a>
            </div>
          </div>
        </Reveal>

        <div className="mt-16 mb-8 mx-auto max-w-xl">
          <GoldRule />
        </div>

        <div className="flex items-center justify-between">
          <span
            className="text-[10px] uppercase tracking-[0.2em] font-[family-name:var(--font-inter)]"
            style={{ color: `${C.muted}60` }}
          >
            Grox AI Product Studio
          </span>
          <span
            className="text-[10px] uppercase tracking-[0.2em] font-[family-name:var(--font-inter)]"
            style={{ color: `${C.muted}60` }}
          >
            2024 &mdash; Present
          </span>
        </div>
      </footer>

      {/* Theme Switcher */}
      <ThemeSwitcher current="/midnight" />
    </main>
  );
}
