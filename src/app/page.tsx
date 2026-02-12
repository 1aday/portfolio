"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "./data/projects";
import ThemeSwitcher from "./components/ThemeSwitcher";
import { getProjectImage } from "@/lib/theme-images";

function RevealSection({
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
      transition={{
        duration: 0.9,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.a
      ref={ref}
      href={project.github}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.8,
        delay: 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="project-card group relative block py-8 sm:py-16 cursor-pointer pl-4 sm:pl-8"
    >
      {/* Accent left bar — scales in from top on hover */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[2px] origin-top scale-y-0 transition-transform duration-500 group-hover:scale-y-100"
        style={{
          background: "var(--accent-pop)",
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />

      {/* Background warmth on hover */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none"
        style={{ background: "rgba(var(--accent-pop-rgb), 0.02)" }}
      />

      {/* Animated bottom line */}
      <div className="project-line" />

      {/* Static separator */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/[0.06]" />

      <div className="relative grid grid-cols-12 gap-3 sm:gap-8 items-start">
        {/* Number + Thumbnail */}
        <div className="col-span-2 sm:col-span-1 flex flex-col items-start gap-2">
          <span className="text-outline font-[family-name:var(--font-display)] text-4xl sm:text-7xl font-light select-none">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div style={{ width: 64, height: 64, overflow: "hidden", borderRadius: 4, position: "relative", flexShrink: 0 }}>
            <img
              src={getProjectImage("default", project.image)}
              alt=""
              loading="lazy"
              style={{
                display: "block", width: "100%", height: "100%", objectFit: "cover",
                filter: "sepia(0.4) brightness(0.7) contrast(1.1)",
              }}
            />
            <div style={{ position: "absolute", inset: 0, background: "rgba(255,140,66,0.15)" }} />
          </div>
        </div>

        {/* Title + Client */}
        <div className="col-span-10 sm:col-span-3">
          <h3 className="font-[family-name:var(--font-display)] text-2xl sm:text-4xl font-light leading-[1.05] tracking-tight whitespace-pre-line transition-all duration-500 group-hover:translate-x-2">
            {project.title}
          </h3>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-[11px] uppercase tracking-[0.2em] text-white/40">
              {project.client}
            </span>
            <span className="text-white/20">&mdash;</span>
            <span className="text-[11px] uppercase tracking-[0.2em] text-white/30 transition-colors duration-500 group-hover:text-[#FF8C42]">
              {project.year}
            </span>
          </div>
        </div>

        {/* Description + Technical */}
        <div className="col-span-12 sm:col-span-5 sm:col-start-5 mt-4 sm:mt-0">
          <p className="text-[15px] text-white/50 leading-[1.7] font-light">
            {project.description}
          </p>
          <p className="mt-4 text-[13px] text-white/30 leading-[1.7] font-light transition-colors duration-500 group-hover:text-white/45">
            {project.technical}
          </p>
        </div>

        {/* Tech tags — pill style */}
        <div className="col-span-12 sm:col-span-3 sm:col-start-10 mt-4 sm:mt-0 flex flex-wrap sm:flex-col gap-2 sm:items-end">
          {project.tech.map((t) => (
            <span
              key={t}
              className="text-[10px] uppercase tracking-[0.15em] text-white/30 font-light border border-white/[0.06] rounded-full px-2.5 py-1 transition-all duration-500 group-hover:text-white/50 group-hover:border-[rgba(255,140,66,0.2)]"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Arrow indicator on hover — accent colored */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 translate-x-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0 hidden sm:block">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-[#FF8C42]"
        >
          <path d="M7 17L17 7M17 7H7M17 7V17" />
        </svg>
      </div>
    </motion.a>
  );
}

export default function Home() {
  useEffect(() => {
    document.documentElement.style.setProperty("--scroll", "0");
    const handleScroll = () => {
      const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      document.documentElement.style.setProperty("--scroll", String(scrolled));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="grain" />

      <main className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
        {/* Navigation — Frosted glass */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#0a0a0a]/70 border-b border-white/[0.04]"
        >
          <div className="mx-auto max-w-[1400px] px-4 sm:px-10 py-5 sm:py-6 flex items-center justify-between">
            <span className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-medium tracking-wide">
              Grox<span className="text-[#FF8C42]">.</span>
            </span>
            <div className="flex items-center gap-4 sm:gap-8">
              <a
                href="#work"
                className="nav-link text-[10px] sm:text-[11px] uppercase tracking-[0.15em] sm:tracking-[0.25em] text-white/60 hover:text-white transition-colors duration-300"
              >
                Work
              </a>
              <a
                href="#about"
                className="nav-link text-[10px] sm:text-[11px] uppercase tracking-[0.15em] sm:tracking-[0.25em] text-white/60 hover:text-white transition-colors duration-300"
              >
                About
              </a>
              <a
                href="https://github.com/1aday"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link text-[10px] sm:text-[11px] uppercase tracking-[0.15em] sm:tracking-[0.25em] text-white/60 hover:text-white transition-colors duration-300"
              >
                GitHub
              </a>
            </div>
          </div>
        </motion.nav>

        {/* Hero */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Animated gradient orb */}
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              x: [0, 30, -20, 0],
              y: [0, -20, 15, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] rounded-full opacity-[0.07]"
            style={{
              background:
                "radial-gradient(circle, #FF8C42 0%, #FF8C42 20%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />

          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />

          <div className="relative mx-auto max-w-[1400px] px-4 sm:px-10 w-full text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-center gap-3 mb-8"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-[#FF8C42]" />
              <span className="text-[11px] uppercase tracking-[0.3em] text-white/40">
                AI Product Studio
              </span>
              <div className="h-1.5 w-1.5 rounded-full bg-[#FF8C42]" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-[family-name:var(--font-display)] text-[clamp(2.5rem,7vw,7rem)] font-light leading-[1.1] tracking-[-0.02em]"
            >
              I turn{" "}
              <span className="italic text-[#FF8C42]">AI models</span>
              <br />
              into{" "}
              <span className="italic text-white/40">products people use</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 max-w-xl mx-auto text-[16px] text-white/35 leading-[1.8] font-light"
            >
              End-to-end product ownership — from computer vision and
              multi-model orchestration to pixel-perfect interfaces.
              30+ shipped applications across 8 industries.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mt-12 flex justify-center gap-12 sm:gap-20"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.6 + i * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <div className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl font-light">
                    {stat.value}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-white/30 mt-1">
                    {stat.label}
                  </div>
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
              className="w-[1px] h-8 bg-gradient-to-b from-white/30 to-transparent"
            />
          </motion.div>
        </section>

        <div className="rule" />

        {/* Selected Work */}
        <section id="work" className="mx-auto max-w-[1400px] px-4 sm:px-10">
          <RevealSection className="py-20 sm:py-28">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-[0.3em] text-white/30 block mb-4">
                  Portfolio
                </span>
                <h2 className="font-[family-name:var(--font-display)] text-4xl sm:text-6xl font-light tracking-tight">
                  Selected Work
                </h2>
              </div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-white/20 hidden sm:block">
                10 Projects
              </span>
            </div>
          </RevealSection>

          <div>
            {projects.map((project, i) => (
              <ProjectCard key={project.title} project={project} index={i} />
            ))}
          </div>
        </section>

        <div className="rule mt-16" />

        {/* About / Expertise */}
        <section id="about" className="mx-auto max-w-[1400px] px-6 sm:px-10 py-24 sm:py-36">
          <RevealSection>
            <span className="text-[11px] uppercase tracking-[0.3em] text-white/30 block mb-4">
              Expertise
            </span>
            <h2 className="font-[family-name:var(--font-display)] text-4xl sm:text-6xl font-light tracking-tight max-w-3xl">
              Building at the intersection of
              <span className="italic text-[rgba(255,140,66,0.5)]"> design </span>
              and
              <span className="italic text-white/40"> intelligence</span>
            </h2>
          </RevealSection>

          <div className="grid sm:grid-cols-2 gap-x-16 gap-y-16 mt-20">
            {expertise.map((item, i) => (
              <RevealSection key={item.title} delay={i * 0.1}>
                <div className="group">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-outline font-[family-name:var(--font-display)] text-3xl font-light">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="h-[1px] w-8 bg-white/15 group-hover:w-16 group-hover:bg-[rgba(255,140,66,0.4)] transition-all duration-500" />
                  </div>
                  <h3 className="text-lg font-light tracking-tight mb-3">
                    {item.title}
                  </h3>
                  <p className="text-[14px] text-white/35 leading-[1.8] font-light">
                    {item.body}
                  </p>
                </div>
              </RevealSection>
            ))}
          </div>
        </section>

        <div className="rule" />

        {/* Tools */}
        <section className="mx-auto max-w-[1400px] px-6 sm:px-10 py-24 sm:py-36">
          <RevealSection>
            <span className="text-[11px] uppercase tracking-[0.3em] text-white/30 block mb-4">
              Stack
            </span>
            <h2 className="font-[family-name:var(--font-display)] text-4xl sm:text-6xl font-light tracking-tight">
              Tools & Technologies
            </h2>
          </RevealSection>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-12 mt-16">
            {tools.map((group, gi) => (
              <RevealSection key={group.label} delay={gi * 0.05}>
                <h4 className="text-[10px] uppercase tracking-[0.25em] text-white/25 mb-4">
                  {group.label}
                </h4>
                <div className="flex flex-col gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="text-[14px] text-white/50 font-light hover:text-white/80 transition-colors duration-300 cursor-default"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </RevealSection>
            ))}
          </div>
        </section>

        <div className="rule" />

        {/* Footer */}
        <footer className="mx-auto max-w-[1400px] px-6 sm:px-10 py-16 sm:py-24">
          <RevealSection>
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8">
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-5xl sm:text-7xl font-light tracking-tight">
                  Let&apos;s build
                  <br />
                  <span className="italic text-[rgba(255,140,66,0.45)]">something.</span>
                </h2>
              </div>
              <div className="flex flex-col items-start sm:items-end gap-3">
                <a
                  href="https://github.com/1aday"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-link text-[11px] uppercase tracking-[0.25em] text-white/40 hover:text-white transition-colors duration-300"
                >
                  GitHub ↗
                </a>
              </div>
            </div>
          </RevealSection>

          <div className="rule mt-16 mb-8" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/20">
              Grox AI Product Studio
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/20">
              2024 — Present
            </span>
          </div>
        </footer>

        <ThemeSwitcher current="/" />
      </main>
    </>
  );
}
