"use client";
import { useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { getProjectImage } from "@/lib/theme-images";

/* ─── Color constants ─── */
const C = {
  bg: "#0B0E1A",
  card: "rgba(255,255,255,0.04)",
  green: "#4ADE80",
  purple: "#A855F7",
  blue: "#38BDF8",
  text: "#E2E8F0",
  muted: "#94A3B8",
};

const auroraColors = [C.green, C.purple, C.blue];

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
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Aurora project card ─── */
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
      transition={{
        duration: 0.7,
        delay: (index % 2) * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative rounded-2xl p-6 sm:p-8 transition-all duration-500 cursor-default"
      style={{
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        background: C.card,
        border: "1px solid rgba(255,255,255,0.06)",
        animation: "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.animation = "auroraCycle 4s ease-in-out infinite";
        e.currentTarget.style.background = "rgba(255,255,255,0.07)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.animation = "none";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.background = C.card;
      }}
    >
      {/* Project image */}
      <div style={{ margin: "-24px -24px 20px -24px", overflow: "hidden", borderRadius: "16px 16px 0 0", position: "relative" }}>
        <img
          src={getProjectImage("aurora", project.image)}
          alt={project.title.replace(/\n/g, " ")}
          loading="lazy"
          style={{
            display: "block", width: "100%", aspectRatio: "16/9", objectFit: "cover",
            filter: "hue-rotate(100deg) saturate(0.7) brightness(0.5)",
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${C.green}20, ${C.purple}20, ${C.blue}20)` }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40%", background: `linear-gradient(to bottom, transparent, ${C.bg})` }} />
      </div>

      {/* Number + meta row */}
      <div className="flex items-start justify-between mb-5">
        <span
          className="font-[family-name:var(--font-sora)] font-medium leading-none select-none"
          style={{
            fontSize: "clamp(2rem, 3vw, 3rem)",
            background: `linear-gradient(135deg, ${C.green}, ${C.purple}, ${C.blue})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {num}
        </span>
        <div className="flex items-center gap-2 pt-2">
          <span
            className="text-[10px] uppercase tracking-[0.15em] font-[family-name:var(--font-inter)]"
            style={{ color: C.muted }}
          >
            {project.client}
          </span>
          <span style={{ color: `${C.muted}50` }}>/</span>
          <span
            className="text-[10px] uppercase tracking-[0.15em] font-[family-name:var(--font-inter)]"
            style={{ color: C.green }}
          >
            {project.year}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3
        className="font-[family-name:var(--font-sora)] font-medium leading-[1.15] tracking-tight whitespace-pre-line mb-4"
        style={{
          fontSize: "clamp(1.25rem, 2vw, 1.6rem)",
          color: C.text,
        }}
      >
        {project.title}
      </h3>

      {/* Description */}
      <p
        className="font-[family-name:var(--font-inter)] text-[13px] leading-[1.8] font-light mb-3"
        style={{ color: C.muted }}
      >
        {project.description}
      </p>

      {/* Technical */}
      <p
        className="font-[family-name:var(--font-inter)] text-[12px] leading-[1.7] font-light mb-5"
        style={{ color: `${C.muted}90` }}
      >
        {project.technical}
      </p>

      {/* Tech tags — cycling aurora colors */}
      <div className="flex flex-wrap gap-2 mb-5">
        {project.tech.map((t, ti) => {
          const tagColor = auroraColors[ti % 3];
          return (
            <span
              key={t}
              className="text-[10px] uppercase tracking-[0.12em] font-[family-name:var(--font-inter)] rounded-full px-3 py-1"
              style={{
                color: tagColor,
                background: `${tagColor}12`,
                border: `1px solid ${tagColor}30`,
              }}
            >
              {t}
            </span>
          );
        })}
      </div>

      {/* Link */}
      <a
        href={project.github}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] font-[family-name:var(--font-inter)] transition-colors duration-300"
        style={{ color: `${C.green}CC` }}
        onMouseEnter={(e) => (e.currentTarget.style.color = C.green)}
        onMouseLeave={(e) => (e.currentTarget.style.color = `${C.green}CC`)}
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
    </motion.div>
  );
}

/* ================================================================
   AURORA PORTFOLIO PAGE
   ================================================================ */
export default function AuroraPage() {
  /* Inject aurora cycling keyframes */
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes auroraCycle {
        0%, 100% { border-color: #4ADE80; box-shadow: 0 0 20px rgba(74,222,128,0.15); }
        33% { border-color: #A855F7; box-shadow: 0 0 20px rgba(168,85,247,0.15); }
        66% { border-color: #38BDF8; box-shadow: 0 0 20px rgba(56,189,248,0.15); }
      }
      @keyframes auroraPulse {
        0%, 100% { opacity: 0.4; }
        50% { opacity: 0.6; }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-8px); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  /* Cosmic particle dots — random positions for starfield */
  const cosmicDots = `
    radial-gradient(1px 1px at 5% 8%, rgba(255,255,255,0.5) 50%, transparent 100%),
    radial-gradient(1.5px 1.5px at 12% 45%, rgba(74,222,128,0.4) 50%, transparent 100%),
    radial-gradient(1px 1px at 18% 72%, rgba(255,255,255,0.4) 50%, transparent 100%),
    radial-gradient(1.2px 1.2px at 25% 22%, rgba(168,85,247,0.35) 50%, transparent 100%),
    radial-gradient(1px 1px at 32% 88%, rgba(255,255,255,0.45) 50%, transparent 100%),
    radial-gradient(1.5px 1.5px at 40% 15%, rgba(56,189,248,0.4) 50%, transparent 100%),
    radial-gradient(1px 1px at 48% 55%, rgba(255,255,255,0.35) 50%, transparent 100%),
    radial-gradient(1.3px 1.3px at 55% 35%, rgba(74,222,128,0.3) 50%, transparent 100%),
    radial-gradient(1px 1px at 62% 78%, rgba(255,255,255,0.5) 50%, transparent 100%),
    radial-gradient(1.2px 1.2px at 70% 10%, rgba(168,85,247,0.4) 50%, transparent 100%),
    radial-gradient(1px 1px at 75% 62%, rgba(255,255,255,0.4) 50%, transparent 100%),
    radial-gradient(1.5px 1.5px at 82% 42%, rgba(56,189,248,0.35) 50%, transparent 100%),
    radial-gradient(1px 1px at 88% 85%, rgba(255,255,255,0.45) 50%, transparent 100%),
    radial-gradient(1.2px 1.2px at 92% 28%, rgba(74,222,128,0.35) 50%, transparent 100%),
    radial-gradient(1px 1px at 96% 58%, rgba(255,255,255,0.4) 50%, transparent 100%),
    radial-gradient(1.3px 1.3px at 3% 92%, rgba(168,85,247,0.3) 50%, transparent 100%),
    radial-gradient(1px 1px at 38% 3%, rgba(255,255,255,0.5) 50%, transparent 100%),
    radial-gradient(1.5px 1.5px at 58% 95%, rgba(56,189,248,0.35) 50%, transparent 100%)
  `;

  return (
    <main
      className="relative min-h-screen overflow-hidden font-[family-name:var(--font-inter)]"
      style={{ background: C.bg, color: C.text }}
    >
      {/* ─── Fixed cosmic starfield background ─── */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ backgroundImage: cosmicDots }}
      />

      {/* ─── Fixed nebula hero background image ─── */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "url(/themes/aurora/nebula-hero.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          opacity: 0.4,
        }}
      />

      {/* ─── Ambient aurora glow blobs ─── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            x: [0, 60, -30, 0],
            y: [0, -40, 30, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute"
          style={{
            top: "5%",
            left: "20%",
            width: "700px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(74,222,128,0.12) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <motion.div
          animate={{
            x: [0, -50, 40, 0],
            y: [0, 50, -60, 0],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute"
          style={{
            top: "30%",
            right: "10%",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <motion.div
          animate={{
            x: [0, 40, -50, 0],
            y: [0, -30, 50, 0],
          }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          className="absolute"
          style={{
            bottom: "10%",
            left: "40%",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(56,189,248,0.1) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* ─── Navigation ─── */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          background: "rgba(11,14,26,0.75)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="mx-auto max-w-[1400px] px-4 sm:px-10 py-4 sm:py-5 flex items-center justify-between">
          <span
            className="font-[family-name:var(--font-sora)] text-xl sm:text-2xl font-medium tracking-wide"
            style={{ color: C.text }}
          >
            Grox
            <span
              className="inline-block w-1.5 h-1.5 rounded-full ml-0.5 mb-0.5 align-middle"
              style={{ background: C.green }}
            />
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
                className="relative text-[10px] sm:text-[11px] uppercase tracking-[0.15em] sm:tracking-[0.2em] transition-colors duration-300 font-[family-name:var(--font-inter)] font-light"
                style={{ color: C.muted }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = C.green)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = C.muted)
                }
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* ─── Hero ─── */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: C.green }}
            />
            <span
              className="text-[11px] uppercase tracking-[0.3em] font-[family-name:var(--font-inter)] font-light"
              style={{ color: C.muted }}
            >
              AI Product Studio
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              delay: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="font-[family-name:var(--font-sora)] font-medium leading-[1.1] tracking-tight"
            style={{
              fontSize: "clamp(2.5rem, 7vw, 6rem)",
              color: C.text,
            }}
          >
            I turn{" "}
            <span
              style={{
                background: `linear-gradient(135deg, ${C.green}, ${C.purple}, ${C.blue})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              AI models
            </span>
            <br />
            into products
          </motion.h1>

          {/* Sub-description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-6 text-[15px] sm:text-[16px] leading-[1.8] font-light font-[family-name:var(--font-inter)] max-w-xl mx-auto"
            style={{ color: C.muted }}
          >
            End-to-end product ownership &mdash; from computer vision and
            multi-model orchestration to pixel-perfect interfaces.
          </motion.p>

          {/* Floating glass stat pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-12 flex items-center justify-center gap-3 sm:gap-5 flex-wrap"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: 0.9 + i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="rounded-2xl px-5 sm:px-7 py-3 sm:py-4"
                style={{
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  animation: `float ${3 + i * 0.4}s ease-in-out infinite`,
                  animationDelay: `${i * 0.5}s`,
                }}
              >
                <span
                  className="font-[family-name:var(--font-sora)] text-2xl sm:text-3xl font-medium"
                  style={{ color: auroraColors[i % 3] }}
                >
                  {stat.value}
                </span>
                <span
                  className="ml-2 text-[10px] sm:text-[11px] uppercase tracking-[0.15em] font-[family-name:var(--font-inter)] font-light"
                  style={{ color: C.muted }}
                >
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
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
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-[1px] h-8"
            style={{
              background: `linear-gradient(to bottom, ${C.green}80, transparent)`,
            }}
          />
        </motion.div>
      </section>

      {/* ─── Selected Work ─── */}
      <section
        id="work"
        className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-10 py-20 sm:py-28"
      >
        {/* Secondary nebula overlay on projects section */}
        <div
          className="absolute inset-0 z-0 pointer-events-none rounded-3xl overflow-hidden"
          style={{
            backgroundImage: "url(/themes/aurora/nebula-secondary.webp)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.08,
          }}
        />

        <div className="relative z-10">
          <Reveal>
            <div className="flex items-end justify-between mb-14">
              <div>
                <span
                  className="text-[11px] uppercase tracking-[0.3em] block mb-4 font-[family-name:var(--font-inter)] font-light"
                  style={{ color: C.muted }}
                >
                  Portfolio
                </span>
                <h2
                  className="font-[family-name:var(--font-sora)] font-medium tracking-tight"
                  style={{
                    fontSize: "clamp(2rem, 4vw, 3.5rem)",
                    color: C.text,
                  }}
                >
                  Selected Work
                </h2>
              </div>
              <span
                className="text-[11px] uppercase tracking-[0.15em] hidden sm:block font-[family-name:var(--font-inter)] font-light"
                style={{ color: `${C.muted}80` }}
              >
                {projects.length} Projects
              </span>
            </div>
          </Reveal>

          {/* Aurora divider line */}
          <div
            className="mb-14"
            style={{
              height: 1,
              background: `linear-gradient(90deg, ${C.green}40, ${C.purple}40, ${C.blue}40, transparent)`,
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {projects.map((project, i) => (
              <ProjectCard key={project.title} project={project} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Expertise ─── */}
      <section
        id="about"
        className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-10 py-24 sm:py-36"
      >
        <Reveal>
          <span
            className="text-[11px] uppercase tracking-[0.3em] block mb-4 font-[family-name:var(--font-inter)] font-light"
            style={{ color: C.muted }}
          >
            Expertise
          </span>
          <h2
            className="font-[family-name:var(--font-sora)] font-medium tracking-tight max-w-3xl leading-[1.15]"
            style={{
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              color: C.text,
            }}
          >
            Building at the intersection of{" "}
            <span
              style={{
                background: `linear-gradient(135deg, ${C.green}, ${C.purple}, ${C.blue})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              design
            </span>{" "}
            and intelligence
          </h2>
        </Reveal>

        {/* Aurora divider */}
        <div
          className="mt-12 mb-16"
          style={{
            height: 1,
            background: `linear-gradient(90deg, ${C.green}30, ${C.purple}30, ${C.blue}30, transparent)`,
          }}
        />

        <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
          {expertise.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1}>
              <div
                className="relative rounded-2xl p-6 sm:p-8 transition-all duration-500 overflow-hidden cursor-default"
                style={{
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  background: C.card,
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor =
                    "rgba(255,255,255,0.12)";
                  e.currentTarget.style.background =
                    "rgba(255,255,255,0.07)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor =
                    "rgba(255,255,255,0.06)";
                  e.currentTarget.style.background = C.card;
                }}
              >
                {/* Gradient top border line (green -> purple -> blue) */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{
                    background: `linear-gradient(90deg, ${C.green}, ${C.purple}, ${C.blue})`,
                  }}
                />

                <div className="flex items-center gap-4 mb-5 mt-2">
                  <span
                    className="font-[family-name:var(--font-sora)] font-medium text-3xl sm:text-4xl leading-none select-none"
                    style={{
                      background: `linear-gradient(135deg, ${C.green}, ${C.purple}, ${C.blue})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div
                    className="h-[1px] flex-1"
                    style={{
                      background: `linear-gradient(90deg, ${C.green}25, transparent)`,
                    }}
                  />
                </div>

                <h3
                  className="font-[family-name:var(--font-sora)] font-medium text-lg tracking-tight mb-3"
                  style={{ color: C.text }}
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

      {/* ─── Tools & Technologies ─── */}
      <section className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-10 py-24 sm:py-32">
        <Reveal>
          <span
            className="text-[11px] uppercase tracking-[0.3em] block mb-4 font-[family-name:var(--font-inter)] font-light"
            style={{ color: C.muted }}
          >
            Stack
          </span>
          <h2
            className="font-[family-name:var(--font-sora)] font-medium tracking-tight mb-4"
            style={{
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              color: C.text,
            }}
          >
            Tools &amp; Technologies
          </h2>
        </Reveal>

        {/* Aurora divider */}
        <div
          className="mb-14"
          style={{
            height: 1,
            background: `linear-gradient(90deg, ${C.green}30, ${C.purple}30, ${C.blue}30, transparent)`,
          }}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 sm:gap-10">
          {tools.map((group, gi) => (
            <Reveal key={group.label} delay={gi * 0.05}>
              <h4
                className="text-[10px] uppercase tracking-[0.2em] mb-4 font-[family-name:var(--font-sora)] font-medium"
                style={{ color: auroraColors[gi % 3] }}
              >
                {group.label}
              </h4>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="text-[12px] font-light font-[family-name:var(--font-inter)] rounded-xl px-3 py-1.5 transition-all duration-300 cursor-default"
                    style={{
                      color: C.muted,
                      backdropFilter: "blur(8px)",
                      WebkitBackdropFilter: "blur(8px)",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                    onMouseEnter={(e) => {
                      const hoverColor =
                        auroraColors[gi % 3];
                      e.currentTarget.style.color = C.text;
                      e.currentTarget.style.borderColor = `${hoverColor}60`;
                      e.currentTarget.style.background = `${hoverColor}12`;
                      e.currentTarget.style.boxShadow = `0 0 12px ${hoverColor}15`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = C.muted;
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.06)";
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.04)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-10 py-24 sm:py-32">
        {/* Aurora divider */}
        <div
          className="mb-20"
          style={{
            height: 1,
            background: `linear-gradient(90deg, transparent, ${C.green}30, ${C.purple}30, ${C.blue}30, transparent)`,
          }}
        />

        <Reveal>
          <div className="text-center">
            <h2
              className="font-[family-name:var(--font-sora)] font-medium tracking-tight leading-[1.15]"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 5rem)",
                color: C.text,
              }}
            >
              Let&apos;s build{" "}
              <span
                style={{
                  background: `linear-gradient(135deg, ${C.green}, ${C.purple}, ${C.blue})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                something.
              </span>
            </h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="mt-4 text-[15px] leading-[1.8] font-light font-[family-name:var(--font-inter)] max-w-md mx-auto"
              style={{ color: `${C.muted}90` }}
            >
              From vision models to production interfaces &mdash; let&apos;s
              make AI work for real people.
            </motion.p>

            <div className="mt-8 flex justify-center gap-8">
              <a
                href="https://github.com/1aday"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 font-[family-name:var(--font-inter)] font-light"
                style={{ color: C.muted }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = C.green)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = C.muted)
                }
              >
                GitHub &#8599;
              </a>
            </div>

            {/* Bottom rule + credits */}
            <div
              className="mt-16 pt-8 mx-auto max-w-xl"
              style={{
                borderTop: `1px solid rgba(255,255,255,0.06)`,
              }}
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                <span
                  className="text-[10px] uppercase tracking-[0.2em] font-[family-name:var(--font-inter)] font-light"
                  style={{ color: `${C.muted}60` }}
                >
                  Grox AI Product Studio
                </span>
                <span
                  className="text-[10px] uppercase tracking-[0.2em] font-[family-name:var(--font-inter)] font-light"
                  style={{ color: `${C.muted}60` }}
                >
                  2024 &mdash; Present
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </footer>

      {/* Theme Switcher */}
      <ThemeSwitcher current="/aurora" />
    </main>
  );
}
