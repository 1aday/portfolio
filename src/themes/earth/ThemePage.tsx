"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "@/app/data/projects";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";
import { getProjectImage } from "@/lib/theme-images";

/* ─── Reveal wrapper ─── */
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
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
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
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const isWide = index % 3 === 0;

  return (
    <motion.a
      ref={ref}
      href={project.github}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 44 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 44 }}
      transition={{
        duration: 0.8,
        delay: 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`group block bg-[#EDE8DA] rounded-2xl p-8 border-l-4 border-[#C37A67] shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-500 cursor-pointer ${
        isWide ? "sm:col-span-2" : ""
      }`}
    >
      {/* Project image */}
      <div style={{ margin: "-32px -32px 16px -32px", overflow: "hidden", borderRadius: "16px 16px 0 0", position: "relative" }}>
        <img
          src={getProjectImage("earth", project.image)}
          alt={project.title.replace(/\n/g, " ")}
          loading="lazy"
          style={{
            display: "block", width: "100%", aspectRatio: "16/9", objectFit: "cover",
            filter: "sepia(0.35) brightness(0.85) contrast(1.1)",
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(195,122,103,0.1)" }} />
      </div>

      {/* Header row */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-[0.15em] text-[#C37A67] font-[family-name:var(--font-josefin)] font-light">
            {project.client}
          </span>
          <span className="text-[#7A7A6E]/40">&mdash;</span>
          <span className="text-xs uppercase tracking-[0.15em] text-[#7A7A6E] font-[family-name:var(--font-josefin)] font-light">
            {project.year}
          </span>
        </div>
        {/* Arrow */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-[#C37A67] opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-400 shrink-0 mt-1"
        >
          <path d="M7 17L17 7M17 7H7M17 7V17" />
        </svg>
      </div>

      {/* Title */}
      <h3 className="font-[family-name:var(--font-dm-serif)] text-2xl sm:text-3xl text-[#3D3D3D] leading-[1.15] whitespace-pre-line mb-4">
        {project.title}
      </h3>

      {/* Description */}
      <p className="font-[family-name:var(--font-josefin)] font-light text-[15px] text-[#7A7A6E] leading-[1.75] mb-3">
        {project.description}
      </p>

      {/* Technical detail — shown on wide cards */}
      {isWide && (
        <p className="font-[family-name:var(--font-josefin)] font-light text-[13px] text-[#7A7A6E]/60 leading-[1.7] mb-4">
          {project.technical}
        </p>
      )}

      {/* Tech tags */}
      <div className="flex flex-wrap gap-2 mt-auto pt-2">
        {project.tech.map((t) => (
          <span
            key={t}
            className="bg-[#88AC88]/15 text-[#88AC88] rounded-full px-3 py-1 text-xs font-[family-name:var(--font-josefin)] font-light"
          >
            {t}
          </span>
        ))}
      </div>
    </motion.a>
  );
}

/* ═══════════════════════════════════════════
   EARTH PAGE
   ═══════════════════════════════════════════ */
export default function EarthPage() {
  return (
    <main
      className="min-h-screen bg-[#F7F3E8] text-[#3D3D3D] overflow-hidden"
      style={{ colorScheme: "light" }}
    >
      {/* ─── Navigation ─── */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50 bg-[#F7F3E8]/80 backdrop-blur-md border-b border-[#3D3D3D]/[0.06]"
      >
        <div className="mx-auto max-w-[1200px] px-6 sm:px-10 py-5 flex items-center justify-between">
          <a href="#" className="font-[family-name:var(--font-dm-serif)] text-2xl sm:text-3xl text-[#3D3D3D]">
            Grox<span className="text-[#C37A67]">.</span>
          </a>
          <div className="flex items-center gap-5 sm:gap-8">
            <a
              href="#work"
              className="font-[family-name:var(--font-josefin)] text-[11px] uppercase tracking-[0.2em] text-[#7A7A6E] hover:text-[#3D3D3D] transition-colors duration-300"
            >
              Work
            </a>
            <a
              href="#expertise"
              className="font-[family-name:var(--font-josefin)] text-[11px] uppercase tracking-[0.2em] text-[#7A7A6E] hover:text-[#3D3D3D] transition-colors duration-300"
            >
              About
            </a>
            <a
              href="https://github.com/1aday"
              target="_blank"
              rel="noopener noreferrer"
              className="font-[family-name:var(--font-josefin)] text-[11px] uppercase tracking-[0.2em] text-[#7A7A6E] hover:text-[#3D3D3D] transition-colors duration-300"
            >
              GitHub
            </a>
          </div>
        </div>
      </motion.nav>

      {/* ─── Hero ─── */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center px-6"
        style={{
          background: "linear-gradient(180deg, #F7F3E8 0%, #F5EDE0 100%)",
        }}
      >
        {/* Subtle warm radial glow */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(195,122,103,0.06) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        <div className="relative mx-auto max-w-[1200px] w-full text-center">
          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div className="h-[3px] w-8 rounded-full bg-[#C37A67]/40" />
            <span className="font-[family-name:var(--font-josefin)] text-[11px] uppercase tracking-[0.3em] text-[#7A7A6E] font-light">
              AI Product Studio
            </span>
            <div className="h-[3px] w-8 rounded-full bg-[#C37A67]/40" />
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.1,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="font-[family-name:var(--font-dm-serif)] leading-[1.1] tracking-[-0.01em]"
            style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)" }}
          >
            I turn{" "}
            <span className="italic text-[#C37A67]">AI models</span>
            <br />
            into{" "}
            <span className="italic text-[#7A7A6E]/50">
              products people use
            </span>
          </motion.h1>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              delay: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-8 max-w-xl mx-auto font-[family-name:var(--font-josefin)] font-light text-[16px] text-[#7A7A6E] leading-[1.85]"
          >
            End-to-end product ownership — from computer vision and multi-model
            orchestration to pixel-perfect interfaces. 30+ shipped applications
            across 8 industries.
          </motion.p>

          {/* Stat cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-14 flex flex-wrap justify-center gap-4 sm:gap-6"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.6 + i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="bg-[#EDE8DA] rounded-2xl px-8 py-5 min-w-[130px]"
              >
                <div className="font-[family-name:var(--font-dm-serif)] text-3xl sm:text-4xl text-[#3D3D3D]">
                  {stat.value}
                </div>
                <div className="font-[family-name:var(--font-josefin)] text-[10px] uppercase tracking-[0.2em] text-[#7A7A6E] mt-1 font-light">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-[1px] h-8 bg-gradient-to-b from-[#C37A67]/50 to-transparent"
          />
        </motion.div>
      </section>

      {/* ─── Wave divider (hero -> projects) ─── */}
      <div className="wave-divider">
        <svg
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          style={{ width: "100%", display: "block" }}
        >
          <path
            d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,20 1440,30 L1440,60 L0,60 Z"
            fill="#EDE8DA"
          />
        </svg>
      </div>

      {/* ─── Projects Section ─── */}
      <section id="work" className="bg-[#EDE8DA]/30 py-20 sm:py-28">
        <div className="mx-auto max-w-[1200px] px-6 sm:px-10">
          <Reveal>
            <div className="mb-16">
              <span className="font-[family-name:var(--font-josefin)] text-[11px] uppercase tracking-[0.3em] text-[#7A7A6E] font-light block mb-4">
                Portfolio
              </span>
              <h2 className="font-[family-name:var(--font-dm-serif)] text-4xl sm:text-6xl text-[#3D3D3D] tracking-tight">
                Selected Work
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {projects.map((project, i) => (
              <ProjectCard key={project.title} project={project} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Expertise Section ─── */}
      <section id="expertise" className="bg-[#F7F3E8] py-24 sm:py-36">
        <div className="mx-auto max-w-[1200px] px-6 sm:px-10">
          <Reveal>
            <span className="font-[family-name:var(--font-josefin)] text-[11px] uppercase tracking-[0.3em] text-[#7A7A6E] font-light block mb-4">
              Expertise
            </span>
            <h2 className="font-[family-name:var(--font-dm-serif)] text-4xl sm:text-6xl text-[#3D3D3D] tracking-tight max-w-3xl">
              Building at the intersection of{" "}
              <span className="italic text-[#C37A67]">design</span> and{" "}
              <span className="italic text-[#88AC88]">intelligence</span>
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-6 mt-16">
            {expertise.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08}>
                <div className="bg-[#EDE8DA] rounded-2xl p-8 border-t-4 border-[#88AC88] shadow-[0_2px_20px_rgba(0,0,0,0.04)] h-full">
                  <span className="font-[family-name:var(--font-dm-serif)] text-3xl text-[#D5AD36] block mb-3">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-[family-name:var(--font-dm-serif)] text-xl sm:text-2xl text-[#3D3D3D] mb-4">
                    {item.title}
                  </h3>
                  <p className="font-[family-name:var(--font-josefin)] font-light text-[14px] text-[#7A7A6E] leading-[1.85]">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Tools Section ─── */}
      <section className="bg-[#EDE8DA]/30 py-24 sm:py-36">
        <div className="mx-auto max-w-[1200px] px-6 sm:px-10">
          <Reveal>
            <span className="font-[family-name:var(--font-josefin)] text-[11px] uppercase tracking-[0.3em] text-[#7A7A6E] font-light block mb-4">
              Stack
            </span>
            <h2 className="font-[family-name:var(--font-dm-serif)] text-4xl sm:text-6xl text-[#3D3D3D] tracking-tight">
              Tools & Technologies
            </h2>
          </Reveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-10 sm:gap-12 mt-16">
            {tools.map((group, gi) => (
              <Reveal key={group.label} delay={gi * 0.05}>
                <h4 className="font-[family-name:var(--font-josefin)] text-[10px] uppercase tracking-[0.25em] text-[#C37A67] mb-5 font-light">
                  {group.label}
                </h4>
                <div className="flex flex-col gap-2.5">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="bg-[#EDE8DA] rounded-full px-4 py-2 text-sm text-[#7A7A6E] font-[family-name:var(--font-josefin)] font-light hover:text-[#C37A67] transition-colors duration-300 cursor-default inline-block text-center"
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

      {/* ─── Footer ─── */}
      <footer className="bg-[#F7F3E8]">
        {/* Inverted wave divider */}
        <div className="wave-divider" style={{ transform: "scaleY(-1)" }}>
          <svg
            viewBox="0 0 1440 60"
            preserveAspectRatio="none"
            style={{ width: "100%", display: "block" }}
          >
            <path
              d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,20 1440,30 L1440,60 L0,60 Z"
              fill="#EDE8DA"
            />
          </svg>
        </div>

        <div className="mx-auto max-w-[1200px] px-6 sm:px-10 py-20 sm:py-28">
          <Reveal>
            <div className="text-center">
              <h2 className="font-[family-name:var(--font-dm-serif)] text-5xl sm:text-7xl text-[#3D3D3D] tracking-tight italic">
                Let&apos;s build something.
              </h2>
              <div className="mt-8 flex justify-center gap-6">
                <a
                  href="https://github.com/1aday"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-[family-name:var(--font-josefin)] text-[11px] uppercase tracking-[0.2em] text-[#C37A67] hover:text-[#3D3D3D] transition-colors duration-300 font-light"
                >
                  GitHub &rarr;
                </a>
              </div>
            </div>
          </Reveal>

          {/* Divider line */}
          <div className="mt-16 mb-8 h-[1px] bg-[#3D3D3D]/[0.08]" />

          <div className="flex items-center justify-between">
            <span className="font-[family-name:var(--font-josefin)] text-[10px] uppercase tracking-[0.2em] text-[#7A7A6E]/50 font-light">
              Grox AI Product Studio
            </span>
            <span className="font-[family-name:var(--font-josefin)] text-[10px] uppercase tracking-[0.2em] text-[#7A7A6E]/50 font-light">
              2024 &mdash; Present
            </span>
          </div>
        </div>
      </footer>

      {/* ─── Theme Switcher ─── */}
      <ThemeSwitcher current="/earth" variant="light" />
    </main>
  );
}
