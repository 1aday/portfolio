"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";

/* ─── Scroll-reveal wrapper ─── */
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
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Horizontal 1px rule ─── */
function Rule() {
  return <div className="w-full h-[1px] bg-[#D4D0C8]" />;
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
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.a
      ref={ref}
      href={project.github}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration: 0.7,
        delay: (index % 2) * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group block bg-[#F0EDE5] p-8 border-b-2 border-transparent transition-[border-color] duration-500 hover:border-[#E63946] cursor-pointer"
    >
      {/* Project image */}
      <div style={{ margin: "-32px -32px 16px -32px", overflow: "hidden", position: "relative" }}>
        <img
          src={project.image}
          alt={project.title.replace(/\n/g, " ")}
          loading="lazy"
          style={{
            display: "block", width: "100%", aspectRatio: "16/9", objectFit: "cover",
            filter: "sepia(0.2) brightness(0.9) contrast(1.05)",
          }}
        />
      </div>
      {/* Number */}
      <span className="font-[family-name:var(--font-instrument)] text-5xl leading-none text-[#D4D0C8] select-none block mb-5">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Title */}
      <h3 className="font-[family-name:var(--font-instrument)] text-[1.5rem] leading-[1.2] text-[#1A1A1A] mb-3">
        {project.title.replace(/\n/g, " ")}
      </h3>

      {/* Description — clamp to 2 lines */}
      <p className="font-[family-name:var(--font-manrope)] text-[14px] leading-[1.65] text-[#6B6B6B] mb-5 line-clamp-2">
        {project.description}
      </p>

      {/* Tech tags */}
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {project.tech.map((t) => (
          <span
            key={t}
            className="font-[family-name:var(--font-manrope)] text-[10px] uppercase tracking-[0.12em] text-[#999]"
          >
            {t}
          </span>
        ))}
      </div>
    </motion.a>
  );
}

/* ─── Page ─── */
export default function PaperPage() {
  return (
    <main
      className="min-h-screen bg-[#FAFAF5] text-[#1A1A1A] overflow-x-hidden"
      style={{ colorScheme: "light" }}
    >
      {/* ── Navigation ── */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAF5]/80 backdrop-blur-md border-b border-[#D4D0C8]"
      >
        <div className="mx-auto max-w-[1200px] px-6 sm:px-10 py-5 flex items-center justify-between">
          <span className="font-[family-name:var(--font-instrument)] text-2xl text-[#1A1A1A]">
            Grox.
          </span>
          <div className="flex items-center gap-6 sm:gap-10">
            <a
              href="#work"
              className="font-[family-name:var(--font-manrope)] text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors duration-300 relative after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-[1px] after:bg-[#E63946] after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100"
            >
              Work
            </a>
            <a
              href="#expertise"
              className="font-[family-name:var(--font-manrope)] text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors duration-300 relative after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-[1px] after:bg-[#E63946] after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100"
            >
              About
            </a>
            <a
              href="https://github.com/1aday"
              target="_blank"
              rel="noopener noreferrer"
              className="font-[family-name:var(--font-manrope)] text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors duration-300 relative after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-[1px] after:bg-[#E63946] after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100"
            >
              GitHub
            </a>
          </div>
        </div>
      </motion.nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-[900px] mx-auto"
        >
          <h1
            className="font-[family-name:var(--font-instrument)] text-[#1A1A1A] leading-[1.05] tracking-[-0.02em]"
            style={{ fontSize: "clamp(3rem, 9vw, 8rem)" }}
          >
            I turn AI models into products people use
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="font-[family-name:var(--font-manrope)] text-[16px] text-[#6B6B6B] leading-[1.7] mt-8 max-w-lg mx-auto"
          >
            End-to-end product ownership — from computer vision and multi-model
            orchestration to pixel-perfect interfaces.
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 flex items-center justify-center gap-0"
          >
            {stats.map((stat, i) => (
              <div key={stat.label} className="flex items-center">
                {i > 0 && (
                  <div className="w-[1px] h-10 bg-[#D4D0C8] mx-8 sm:mx-12" />
                )}
                <div className="text-center">
                  <div className="font-[family-name:var(--font-instrument)] text-3xl sm:text-4xl text-[#1A1A1A]">
                    {stat.value}
                  </div>
                  <div className="font-[family-name:var(--font-manrope)] text-[10px] uppercase tracking-[0.2em] text-[#6B6B6B] mt-1">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <Rule />

      {/* ── Projects ── */}
      <section id="work" className="mx-auto max-w-[1200px] px-6 sm:px-10 py-32 sm:py-44">
        <Reveal>
          <span className="font-[family-name:var(--font-manrope)] text-[10px] uppercase tracking-[0.25em] text-[#999] block mb-3">
            Portfolio
          </span>
          <h2 className="font-[family-name:var(--font-instrument)] text-4xl sm:text-6xl text-[#1A1A1A] tracking-tight">
            Selected Work
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-16">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </section>

      <Rule />

      {/* ── Expertise ── */}
      <section
        id="expertise"
        className="mx-auto max-w-[1200px] px-6 sm:px-10 py-32 sm:py-44"
      >
        <Reveal>
          <span className="font-[family-name:var(--font-manrope)] text-[10px] uppercase tracking-[0.25em] text-[#999] block mb-3">
            Expertise
          </span>
          <h2 className="font-[family-name:var(--font-instrument)] text-4xl sm:text-6xl text-[#1A1A1A] tracking-tight">
            What I Do
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-14 mt-16">
          {expertise.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08}>
              <span className="font-[family-name:var(--font-instrument)] text-3xl text-[#D4D0C8] block mb-3">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-[family-name:var(--font-manrope)] text-[15px] font-semibold text-[#1A1A1A] mb-2 leading-snug">
                {item.title}
              </h3>
              <p className="font-[family-name:var(--font-manrope)] text-[13px] text-[#6B6B6B] leading-[1.7]">
                {item.body}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      <Rule />

      {/* ── Tools ── */}
      <section className="mx-auto max-w-[1200px] px-6 sm:px-10 py-32 sm:py-44">
        <Reveal>
          <span className="font-[family-name:var(--font-manrope)] text-[10px] uppercase tracking-[0.25em] text-[#999] block mb-3">
            Stack
          </span>
          <h2 className="font-[family-name:var(--font-instrument)] text-4xl sm:text-6xl text-[#1A1A1A] tracking-tight">
            Tools & Technologies
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-12 mt-16">
          {tools.map((group, gi) => (
            <Reveal key={group.label} delay={gi * 0.05}>
              <h4 className="font-[family-name:var(--font-manrope)] text-[10px] uppercase tracking-[0.2em] text-[#999] mb-4">
                {group.label}
              </h4>
              <div className="flex flex-col gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="font-[family-name:var(--font-manrope)] text-[14px] text-[#6B6B6B] cursor-default transition-colors duration-300 hover:text-[#1A1A1A]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Rule />

      {/* ── Footer ── */}
      <footer className="mx-auto max-w-[1200px] px-6 sm:px-10 py-16 sm:py-24">
        <Reveal>
          <div className="flex items-center justify-between">
            <span className="font-[family-name:var(--font-manrope)] text-[11px] uppercase tracking-[0.15em] text-[#999]">
              Grox AI Product Studio
            </span>
            <span className="font-[family-name:var(--font-manrope)] text-[11px] uppercase tracking-[0.15em] text-[#999]">
              2024 — Present
            </span>
          </div>
        </Reveal>

      </footer>

      <ThemeSwitcher current="/paper" variant="light" />
    </main>
  );
}
