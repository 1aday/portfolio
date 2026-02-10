"use client";
import { useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";

/* ─── Color constants ─── */
const C = {
  bg: "#0F0720",
  card: "rgba(255,255,255,0.05)",
  cardHover: "rgba(255,255,255,0.08)",
  border: "rgba(255,255,255,0.1)",
  borderHover: "rgba(124,58,237,0.5)",
  accent: "#7C3AED",
  cyan: "#06B6D4",
  text: "#F8FAFC",
  muted: "#94A3B8",
  glass: "rgba(255,255,255,0.04)",
  glassBorder: "rgba(255,255,255,0.08)",
};

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

/* ─── Glass project card ─── */
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
        delay: (index % 3) * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative rounded-2xl p-6 sm:p-8 transition-all duration-500 cursor-default"
      style={{
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        background: C.glass,
        border: `1px solid ${C.glassBorder}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = C.borderHover;
        e.currentTarget.style.boxShadow = `0 0 30px rgba(124,58,237,0.1), inset 0 0 30px rgba(124,58,237,0.03)`;
        e.currentTarget.style.background = C.cardHover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = C.glassBorder;
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.background = C.glass;
      }}
    >
      {/* Project image */}
      <div style={{ margin: "-24px -24px 20px -24px", overflow: "hidden", borderRadius: "16px 16px 0 0", position: "relative" }}>
        <img
          src={project.image}
          alt={project.title.replace(/\n/g, " ")}
          loading="lazy"
          style={{
            display: "block", width: "100%", aspectRatio: "16/9", objectFit: "cover",
            filter: "hue-rotate(240deg) saturate(0.8) brightness(0.5) blur(1px)",
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(124,58,237,0.15)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40%", background: `linear-gradient(to bottom, transparent, ${C.bg})` }} />
      </div>

      {/* Number */}
      <div className="flex items-start justify-between mb-5">
        <span
          className="font-[family-name:var(--font-sora)] font-medium leading-none select-none"
          style={{ fontSize: "clamp(2rem, 3vw, 3rem)", color: C.accent }}
        >
          {num}
        </span>
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] uppercase tracking-[0.15em] font-[family-name:var(--font-inter)]"
            style={{ color: C.muted }}
          >
            {project.client}
          </span>
          <span style={{ color: `${C.muted}50` }}>/</span>
          <span
            className="text-[10px] uppercase tracking-[0.15em] font-[family-name:var(--font-inter)]"
            style={{ color: C.accent }}
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

      {/* Tech tags */}
      <div className="flex flex-wrap gap-2 mb-5">
        {project.tech.map((t) => (
          <span
            key={t}
            className="text-[10px] uppercase tracking-[0.12em] font-[family-name:var(--font-inter)] rounded-full px-3 py-1"
            style={{
              color: C.cyan,
              background: "rgba(6,182,212,0.08)",
              border: "1px solid rgba(6,182,212,0.15)",
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
        className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] font-[family-name:var(--font-inter)] transition-colors duration-300"
        style={{ color: `${C.accent}CC` }}
        onMouseEnter={(e) => (e.currentTarget.style.color = C.accent)}
        onMouseLeave={(e) => (e.currentTarget.style.color = `${C.accent}CC`)}
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
   GLASS PORTFOLIO PAGE
   ================================================================ */
export default function GlassPage() {
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

  return (
    <main
      className="relative min-h-screen overflow-hidden font-[family-name:var(--font-inter)]"
      style={{ background: C.bg, color: C.text }}
    >
      {/* ─── Animated mesh gradient background ─── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            x: [0, 80, -40, 0],
            y: [0, -60, 40, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute"
          style={{
            top: "10%",
            left: "15%",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)",
            filter: "blur(80px)",
            opacity: 0.3,
          }}
        />
        <motion.div
          animate={{
            x: [0, -70, 50, 0],
            y: [0, 50, -70, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute"
          style={{
            top: "40%",
            right: "10%",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(6,182,212,0.25) 0%, transparent 70%)",
            filter: "blur(80px)",
            opacity: 0.3,
          }}
        />
        <motion.div
          animate={{
            x: [0, 60, -30, 0],
            y: [0, -40, 60, 0],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute"
          style={{
            bottom: "10%",
            left: "30%",
            width: "550px",
            height: "550px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(219,39,119,0.2) 0%, transparent 70%)",
            filter: "blur(80px)",
            opacity: 0.25,
          }}
        />
        <motion.div
          animate={{
            x: [0, -50, 40, 0],
            y: [0, 70, -50, 0],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute"
          style={{
            top: "60%",
            left: "60%",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)",
            filter: "blur(80px)",
            opacity: 0.25,
          }}
        />

        {/* Subtle light leak from top-right */}
        <div
          className="absolute top-0 right-0 w-[800px] h-[800px] pointer-events-none"
          style={{
            background: "radial-gradient(circle at top right, rgba(124,58,237,0.05) 0%, transparent 60%)",
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
          background: "rgba(255,255,255,0.05)",
          borderBottom: `1px solid ${C.glassBorder}`,
        }}
      >
        <div className="mx-auto max-w-[1400px] px-4 sm:px-10 py-4 sm:py-5 flex items-center justify-between">
          <span
            className="font-[family-name:var(--font-sora)] text-xl sm:text-2xl font-medium tracking-wide"
            style={{ color: C.text }}
          >
            Grox<span style={{ color: C.accent }}>.</span>
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
                className="relative text-[10px] sm:text-[11px] uppercase tracking-[0.15em] sm:tracking-[0.2em] transition-colors duration-300 font-[family-name:var(--font-inter)] font-light group"
                style={{ color: C.muted }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = C.text)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = C.muted)
                }
              >
                {link.label}
                <span
                  className="absolute -bottom-1 left-0 w-0 h-[1px] transition-all duration-300 group-hover:w-full"
                  style={{ background: C.accent }}
                />
              </a>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* ─── Hero ─── */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: C.accent }}
            />
            <span
              className="text-[11px] uppercase tracking-[0.3em] font-[family-name:var(--font-inter)] font-light"
              style={{ color: C.muted }}
            >
              AI Product Studio
            </span>
          </motion.div>

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
                background: `linear-gradient(135deg, ${C.accent}, ${C.cyan})`,
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

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-[15px] sm:text-[16px] leading-[1.8] font-light font-[family-name:var(--font-inter)] max-w-xl mx-auto"
            style={{ color: C.muted }}
          >
            End-to-end product ownership &mdash; from computer vision and
            multi-model orchestration to pixel-perfect interfaces.
          </motion.p>

          {/* Stats pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex items-center justify-center gap-3 sm:gap-4 flex-wrap"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: 0.9 + i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="rounded-2xl px-5 sm:px-6 py-3 sm:py-4"
                style={{
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  background: C.glass,
                  border: `1px solid ${C.glassBorder}`,
                }}
              >
                <span
                  className="font-[family-name:var(--font-sora)] text-2xl sm:text-3xl font-medium"
                  style={{ color: C.accent }}
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
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-[1px] h-8"
            style={{
              background: `linear-gradient(to bottom, ${C.accent}80, transparent)`,
            }}
          />
        </motion.div>
      </section>

      {/* ─── Selected Work ─── */}
      <section
        id="work"
        className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-10 py-20 sm:py-28"
      >
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
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
                background: `linear-gradient(135deg, ${C.accent}, ${C.cyan})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              design
            </span>
            {" "}and intelligence
          </h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-5 sm:gap-6 mt-16">
          {expertise.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1}>
              <div
                className="relative rounded-2xl p-6 sm:p-8 transition-all duration-500 overflow-hidden"
                style={{
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  background: C.glass,
                  border: `1px solid ${C.glassBorder}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = C.borderHover;
                  e.currentTarget.style.background = C.cardHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = C.glassBorder;
                  e.currentTarget.style.background = C.glass;
                }}
              >
                {/* Purple top accent line */}
                <div
                  className="absolute top-0 left-0 right-0 h-[3px]"
                  style={{
                    background: `linear-gradient(90deg, ${C.accent}, ${C.cyan})`,
                  }}
                />

                <div className="flex items-center gap-4 mb-5 mt-2">
                  <span
                    className="font-[family-name:var(--font-sora)] font-medium text-3xl sm:text-4xl leading-none select-none"
                    style={{ color: C.accent }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div
                    className="h-[1px] flex-1"
                    style={{ background: `${C.accent}25` }}
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

      {/* ─── Tools ─── */}
      <section className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-10 py-24 sm:py-32">
        <Reveal>
          <span
            className="text-[11px] uppercase tracking-[0.3em] block mb-4 font-[family-name:var(--font-inter)] font-light"
            style={{ color: C.muted }}
          >
            Stack
          </span>
          <h2
            className="font-[family-name:var(--font-sora)] font-medium tracking-tight mb-14"
            style={{
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              color: C.text,
            }}
          >
            Tools &amp; Technologies
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 sm:gap-10">
          {tools.map((group, gi) => (
            <Reveal key={group.label} delay={gi * 0.05}>
              <h4
                className="text-[10px] uppercase tracking-[0.2em] mb-4 font-[family-name:var(--font-sora)] font-medium"
                style={{ color: C.accent }}
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
                      background: C.glass,
                      border: `1px solid ${C.glassBorder}`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = C.text;
                      e.currentTarget.style.borderColor = C.borderHover;
                      e.currentTarget.style.background = "rgba(124,58,237,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = C.muted;
                      e.currentTarget.style.borderColor = C.glassBorder;
                      e.currentTarget.style.background = C.glass;
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
        <Reveal>
          <div
            className="rounded-2xl px-6 sm:px-12 py-14 sm:py-20 text-center"
            style={{
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              background: C.glass,
              border: `1px solid ${C.glassBorder}`,
            }}
          >
            <h2
              className="font-[family-name:var(--font-sora)] font-medium tracking-tight leading-[1.15]"
              style={{
                fontSize: "clamp(2rem, 5vw, 4rem)",
                color: C.text,
              }}
            >
              Let&apos;s build{" "}
              <span
                style={{
                  background: `linear-gradient(135deg, ${C.accent}, ${C.cyan})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                something.
              </span>
            </h2>

            <div className="mt-8 flex justify-center gap-8">
              <a
                href="https://github.com/1aday"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 font-[family-name:var(--font-inter)] font-light"
                style={{ color: C.muted }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = C.accent)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = C.muted)
                }
              >
                GitHub &#8599;
              </a>
            </div>

            <div
              className="mt-12 pt-8"
              style={{ borderTop: `1px solid ${C.glassBorder}` }}
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
      <ThemeSwitcher current="/glass" />
    </main>
  );
}
