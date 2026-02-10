"use client";
import { useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform, useSpring } from "motion/react";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";

/* ─── Color constants ─── */
const C = {
  bg: "#1E293B",
  card: "#263548",
  gold: "#F59E0B",
  cream: "#FEF3C7",
  text: "#F8FAFC",
  muted: "#94A3B8",
};

const cardColors = [
  "#263548",
  "#2C3D52",
  "#273A4F",
  "#2A3F55",
  "#253749",
  "#2E4158",
  "#293E53",
  "#2B4057",
  "#26384C",
  "#2D4256",
];

/* ─── WordReveal: scroll-driven per-word animation ─── */
function WordReveal({
  word,
  index,
  total,
  scrollYProgress,
}: {
  word: string;
  index: number;
  total: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const start = (index / total) * 0.6;
  const end = start + 0.6 / total;

  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const y = useTransform(scrollYProgress, [start, end], [40, 0]);
  const smoothOpacity = useSpring(opacity, { stiffness: 100, damping: 30 });
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <motion.span
      style={{ opacity: smoothOpacity, y: smoothY, display: "inline-block" }}
      className="mr-[0.3em]"
    >
      {word}
    </motion.span>
  );
}

/* ─── GoldLine: animated horizontal divider ─── */
function GoldLine() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref} className="mx-auto max-w-[1400px] px-4 sm:px-10">
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        style={{
          height: 1,
          background: `linear-gradient(90deg, ${C.gold}, ${C.gold}40)`,
          transformOrigin: "left",
        }}
      />
    </div>
  );
}

/* ─── CountUpStat: number counts from 0 ─── */
function CountUpStat({ stat }: { stat: (typeof stats)[0] }) {
  const ref = useRef<HTMLSpanElement>(null);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-60px" });
  const hasSuffix = stat.value.includes("+");
  const target = parseInt(stat.value.replace(/\D/g, ""), 10);

  useEffect(() => {
    if (!isInView || !ref.current) return;
    let start = 0;
    const duration = 1800;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(eased * target);
      if (ref.current) ref.current.textContent = String(start) + (hasSuffix ? "+" : "");
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, target, hasSuffix]);

  return (
    <div ref={containerRef} className="text-center">
      <span
        ref={ref}
        className="font-[family-name:var(--font-manrope)] font-bold block"
        style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", color: C.gold }}
      >
        0{hasSuffix ? "+" : ""}
      </span>
      <span
        className="font-[family-name:var(--font-inter)] font-light text-[12px] sm:text-[13px] uppercase tracking-[0.2em] mt-2 block"
        style={{ color: C.muted }}
      >
        {stat.label}
      </span>
    </div>
  );
}

/* ─── ExpertiseCard: fly in from alternating sides ─── */
function ExpertiseCard({ item, index }: { item: (typeof expertise)[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const fromLeft = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: fromLeft ? -100 : 100 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: fromLeft ? -100 : 100 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-2xl p-6 sm:p-8 overflow-hidden transition-all duration-500 cursor-default"
      style={{
        background: C.card,
        border: `1px solid rgba(255,255,255,0.06)`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${C.gold}40`;
        e.currentTarget.style.boxShadow = `0 8px 40px rgba(245,158,11,0.08)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Gold top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: C.gold }}
      />
      <div className="flex items-center gap-4 mb-5 mt-2">
        <span
          className="font-[family-name:var(--font-manrope)] font-bold text-3xl sm:text-4xl leading-none select-none"
          style={{ color: C.gold }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <div
          className="h-[1px] flex-1"
          style={{ background: `${C.gold}25` }}
        />
      </div>
      <h3
        className="font-[family-name:var(--font-manrope)] font-bold text-lg sm:text-xl tracking-tight mb-3"
        style={{ color: C.text }}
      >
        {item.title}
      </h3>
      <p
        className="font-[family-name:var(--font-inter)] font-light text-[14px] leading-[1.8]"
        style={{ color: C.muted }}
      >
        {item.body}
      </p>
    </motion.div>
  );
}

/* ─── StickyProjectCard ─── */
function StickyProjectCard({
  project,
  index,
  totalProjects,
  containerProgress,
}: {
  project: (typeof projects)[0];
  index: number;
  totalProjects: number;
  containerProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const cardStart = index / totalProjects;
  const cardEnd = (index + 1) / totalProjects;
  const scale = useTransform(
    containerProgress,
    [cardStart, cardEnd, Math.min(cardEnd + 0.1, 1)],
    [1, 1, 0.95]
  );
  const smoothScale = useSpring(scale, { stiffness: 120, damping: 30 });
  const num = String(index + 1).padStart(2, "0");
  const bgColor = cardColors[index % cardColors.length];

  return (
    <motion.div
      style={{
        position: "sticky",
        top: "10vh",
        zIndex: index + 1,
        scale: smoothScale,
        height: "auto",
      }}
      className="mb-8"
    >
      <div
        className="relative rounded-2xl p-6 sm:p-8 lg:p-10 overflow-hidden transition-shadow duration-500"
        style={{
          background: bgColor,
          border: `1px solid rgba(255,255,255,0.06)`,
          boxShadow: `0 ${4 + index * 2}px ${20 + index * 4}px rgba(0,0,0,0.3)`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = `0 ${8 + index * 2}px ${30 + index * 4}px rgba(0,0,0,0.4), 0 0 0 1px ${C.gold}30`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = `0 ${4 + index * 2}px ${20 + index * 4}px rgba(0,0,0,0.3)`;
        }}
      >
        {/* Project image */}
        <div style={{ margin: "-24px -24px 16px -24px", overflow: "hidden", borderRadius: "16px 16px 0 0", position: "relative" }}>
          <img
            src={project.image}
            alt={project.title.replace(/\n/g, " ")}
            loading="lazy"
            style={{
              display: "block", width: "100%", aspectRatio: "16/9", objectFit: "cover",
              filter: "sepia(0.4) brightness(0.5) contrast(1.2)",
            }}
          />
          <div style={{ position: "absolute", inset: 0, background: "rgba(245,158,11,0.1)" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "50%", background: `linear-gradient(to bottom, transparent, ${bgColor})` }} />
        </div>

        {/* Gold accent line at top */}
        <div
          className="absolute top-0 left-0 right-0 h-[3px]"
          style={{
            background: `linear-gradient(90deg, ${C.gold}, ${C.gold}60, transparent)`,
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6 lg:gap-10 items-start">
          {/* Number + meta column */}
          <div className="flex lg:flex-col items-baseline lg:items-start gap-4 lg:gap-3">
            <span
              className="font-[family-name:var(--font-manrope)] font-bold leading-none select-none"
              style={{ fontSize: "clamp(2.5rem, 4vw, 4rem)", color: C.gold }}
            >
              {num}
            </span>
            <div className="flex items-center gap-2 lg:gap-0 lg:flex-col lg:items-start">
              <span
                className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] font-[family-name:var(--font-inter)] font-light"
                style={{ color: C.muted }}
              >
                {project.client}
              </span>
              <span
                className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] font-[family-name:var(--font-inter)] font-light"
                style={{ color: C.gold }}
              >
                {project.year}
              </span>
            </div>
          </div>

          {/* Content */}
          <div>
            <h3
              className="font-[family-name:var(--font-manrope)] font-bold leading-[1.15] tracking-tight whitespace-pre-line mb-4"
              style={{
                fontSize: "clamp(1.3rem, 2.5vw, 2rem)",
                color: C.text,
              }}
            >
              {project.title}
            </h3>
            <p
              className="font-[family-name:var(--font-inter)] font-light text-[13px] sm:text-[14px] leading-[1.8] mb-3 max-w-2xl"
              style={{ color: C.muted }}
            >
              {project.description}
            </p>
            <p
              className="font-[family-name:var(--font-inter)] font-light text-[12px] sm:text-[13px] leading-[1.7] mb-5 max-w-2xl"
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
                    color: C.gold,
                    background: `${C.gold}12`,
                    border: `1px solid ${C.gold}25`,
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
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] font-[family-name:var(--font-inter)] transition-colors duration-300"
              style={{ color: `${C.gold}CC` }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.gold)}
              onMouseLeave={(e) => (e.currentTarget.style.color = `${C.gold}CC`)}
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
        </div>
      </div>
    </motion.div>
  );
}

/* ================================================================
   KINETIC — MOTION-FIRST STUDIO, CINEMATIC SCROLL EXPERIENCE
   ================================================================ */
export default function KineticPage() {
  /* ── Hero scroll-driven word reveal ── */
  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const words = "I turn AI models into products people use".split(" ");

  /* ── Sticky stacking projects scroll ── */
  const projectsRef = useRef(null);
  const { scrollYProgress: projectsProgress } = useScroll({
    target: projectsRef,
    offset: ["start start", "end end"],
  });

  /* ── Marquee velocity link ── */
  const marqueeRef = useRef<HTMLDivElement>(null);
  const scrollVelocityRef = useRef(0);
  const lastScrollRef = useRef(0);

  useEffect(() => {
    let animId: number;
    const updateVelocity = () => {
      const currentScroll = window.scrollY;
      const velocity = Math.abs(currentScroll - lastScrollRef.current);
      scrollVelocityRef.current = velocity;
      lastScrollRef.current = currentScroll;

      if (marqueeRef.current) {
        const baseSpeed = 40;
        const boost = Math.min(velocity * 0.8, 80);
        const totalDuration = Math.max(baseSpeed - boost, 8);
        marqueeRef.current.style.setProperty("--marquee-duration", `${totalDuration}s`);
      }
      animId = requestAnimationFrame(updateVelocity);
    };
    animId = requestAnimationFrame(updateVelocity);
    return () => cancelAnimationFrame(animId);
  }, []);

  /* ── Inject marquee keyframes ── */
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes kinetic-marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  /* ── Hero parallax background ── */
  const heroImgY = useTransform(heroProgress, [0, 1], [0, -120]);
  const heroImgSmooth = useSpring(heroImgY, { stiffness: 50, damping: 20 });

  return (
    <main
      className="relative min-h-screen font-[family-name:var(--font-inter)]"
      style={{ background: C.bg, color: C.text }}
    >
      {/* ─── Navigation ─── */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          background: `${C.bg}CC`,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="mx-auto max-w-[1400px] px-4 sm:px-10 py-4 sm:py-5 flex items-center justify-between">
          <span
            className="font-[family-name:var(--font-manrope)] text-xl sm:text-2xl font-bold tracking-wide"
            style={{ color: C.text }}
          >
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
                className="relative text-[10px] sm:text-[11px] uppercase tracking-[0.15em] sm:tracking-[0.2em] transition-colors duration-300 font-[family-name:var(--font-inter)] font-light group"
                style={{ color: C.muted }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.gold)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
              >
                {link.label}
                <span
                  className="absolute -bottom-1 left-0 w-0 h-[1px] transition-all duration-300 group-hover:w-full"
                  style={{ background: C.gold }}
                />
              </a>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* ─── Hero Section (tall for scroll-driven reveal) ─── */}
      <section
        ref={heroRef}
        className="relative min-h-[200vh]"
      >
        {/* Fluid chrome texture background */}
        <div
          className="sticky top-0 h-screen overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 z-0"
            style={{ y: heroImgSmooth }}
          >
            <img
              src="/themes/kinetic/fluid-texture.webp"
              alt=""
              className="w-full h-[120%] object-cover"
              style={{ opacity: 0.3 }}
            />
            {/* Dark gradient overlay for text legibility */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to bottom, ${C.bg}90 0%, ${C.bg}40 30%, ${C.bg}60 70%, ${C.bg} 100%)`,
              }}
            />
          </motion.div>

          {/* Hero content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-10">
            <div className="text-center max-w-5xl mx-auto">
              {/* Label */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex items-center justify-center gap-3 mb-8"
              >
                <div
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: C.gold }}
                />
                <span
                  className="text-[11px] uppercase tracking-[0.3em] font-[family-name:var(--font-inter)] font-light"
                  style={{ color: C.muted }}
                >
                  AI Product Studio
                </span>
              </motion.div>

              {/* Word-by-word title */}
              <h1
                className="font-[family-name:var(--font-manrope)] font-bold leading-[1.1] tracking-tight"
                style={{
                  fontSize: "clamp(2.5rem, 7vw, 6rem)",
                  color: C.text,
                }}
              >
                {words.map((word, i) => (
                  <WordReveal
                    key={i}
                    word={word}
                    index={i}
                    total={words.length}
                    scrollYProgress={heroProgress}
                  />
                ))}
              </h1>

              {/* Subtitle */}
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

              {/* Scroll indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
                className="mt-16"
              >
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-[1px] h-8 mx-auto"
                  style={{
                    background: `linear-gradient(to bottom, ${C.gold}80, transparent)`,
                  }}
                />
                <span
                  className="block mt-3 text-[10px] uppercase tracking-[0.3em] font-[family-name:var(--font-inter)] font-light"
                  style={{ color: `${C.muted}60` }}
                >
                  Scroll
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Gold Line Divider ─── */}
      <GoldLine />

      {/* ─── Stats (count up) ─── */}
      <section className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-10 py-24 sm:py-32">
        <div className="flex items-center justify-center gap-12 sm:gap-20 lg:gap-28">
          {stats.map((stat) => (
            <CountUpStat key={stat.label} stat={stat} />
          ))}
        </div>
      </section>

      {/* ─── Gold Line Divider ─── */}
      <GoldLine />

      {/* ─── Sticky Stacking Projects ─── */}
      <section id="work" className="relative z-10">
        {/* Section header */}
        <div className="mx-auto max-w-[1400px] px-4 sm:px-10 pt-24 sm:pt-32 pb-12 sm:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              className="text-[11px] uppercase tracking-[0.3em] block mb-4 font-[family-name:var(--font-inter)] font-light"
              style={{ color: C.muted }}
            >
              Portfolio
            </span>
            <div className="flex items-end justify-between">
              <h2
                className="font-[family-name:var(--font-manrope)] font-bold tracking-tight"
                style={{
                  fontSize: "clamp(2rem, 4vw, 3.5rem)",
                  color: C.text,
                }}
              >
                Selected Work
              </h2>
              <span
                className="text-[11px] uppercase tracking-[0.15em] hidden sm:block font-[family-name:var(--font-inter)] font-light"
                style={{ color: `${C.muted}80` }}
              >
                {projects.length} Projects
              </span>
            </div>
          </motion.div>
        </div>

        {/* Tall scroll container for stacking */}
        <div
          ref={projectsRef}
          className="relative mx-auto max-w-[1400px] px-4 sm:px-10"
          style={{ height: `${projects.length * 100}vh` }}
        >
          {projects.map((project, i) => (
            <StickyProjectCard
              key={project.title}
              project={project}
              index={i}
              totalProjects={projects.length}
              containerProgress={projectsProgress}
            />
          ))}
        </div>
      </section>

      {/* ─── Gold Line Divider ─── */}
      <GoldLine />

      {/* ─── Expertise ─── */}
      <section
        id="about"
        className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-10 py-24 sm:py-36"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <span
            className="text-[11px] uppercase tracking-[0.3em] block mb-4 font-[family-name:var(--font-inter)] font-light"
            style={{ color: C.muted }}
          >
            Expertise
          </span>
          <h2
            className="font-[family-name:var(--font-manrope)] font-bold tracking-tight max-w-3xl leading-[1.15]"
            style={{
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              color: C.text,
            }}
          >
            Building at the intersection of{" "}
            <span style={{ color: C.gold }}>design</span> and intelligence
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
          {expertise.map((item, i) => (
            <ExpertiseCard key={item.title} item={item} index={i} />
          ))}
        </div>
      </section>

      {/* ─── Gold Line Divider ─── */}
      <GoldLine />

      {/* ─── Tools Marquee ─── */}
      <section className="relative z-10 py-24 sm:py-32 overflow-hidden">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-10 mb-14">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              className="text-[11px] uppercase tracking-[0.3em] block mb-4 font-[family-name:var(--font-inter)] font-light"
              style={{ color: C.muted }}
            >
              Stack
            </span>
            <h2
              className="font-[family-name:var(--font-manrope)] font-bold tracking-tight"
              style={{
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                color: C.text,
              }}
            >
              Tools &amp; Technologies
            </h2>
          </motion.div>
        </div>

        {/* Marquee rows */}
        <div ref={marqueeRef} className="flex flex-col gap-6" style={{ ["--marquee-duration" as string]: "40s" }}>
          {/* Row 1: first 3 tool groups */}
          <div className="relative overflow-hidden">
            <div
              className="flex gap-6 whitespace-nowrap"
              style={{
                animation: "kinetic-marquee var(--marquee-duration, 40s) linear infinite",
                width: "max-content",
              }}
            >
              {[...Array(4)].map((_, repeat) => (
                <div key={repeat} className="flex gap-6 items-center shrink-0">
                  {tools.slice(0, 3).map((group) => (
                    <div key={`${group.label}-${repeat}`} className="flex items-center gap-3 shrink-0">
                      <span
                        className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] font-[family-name:var(--font-manrope)] font-bold rounded-full px-4 py-2 shrink-0"
                        style={{
                          background: C.gold,
                          color: C.bg,
                        }}
                      >
                        {group.label}
                      </span>
                      {group.items.map((item) => (
                        <span
                          key={`${item}-${repeat}`}
                          className="text-[12px] sm:text-[13px] font-[family-name:var(--font-inter)] font-light rounded-full px-4 py-2 shrink-0 cursor-default transition-colors duration-300"
                          style={{
                            color: C.muted,
                            border: `1px solid rgba(255,255,255,0.1)`,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = C.gold;
                            e.currentTarget.style.color = C.gold;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                            e.currentTarget.style.color = C.muted;
                          }}
                        >
                          {item}
                        </span>
                      ))}
                      {/* Spacer dot */}
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: `${C.gold}40` }}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: last 3 tool groups, reverse direction */}
          <div className="relative overflow-hidden">
            <div
              className="flex gap-6 whitespace-nowrap"
              style={{
                animation: "kinetic-marquee var(--marquee-duration, 40s) linear infinite reverse",
                width: "max-content",
              }}
            >
              {[...Array(4)].map((_, repeat) => (
                <div key={repeat} className="flex gap-6 items-center shrink-0">
                  {tools.slice(3, 6).map((group) => (
                    <div key={`${group.label}-${repeat}`} className="flex items-center gap-3 shrink-0">
                      <span
                        className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] font-[family-name:var(--font-manrope)] font-bold rounded-full px-4 py-2 shrink-0"
                        style={{
                          background: C.gold,
                          color: C.bg,
                        }}
                      >
                        {group.label}
                      </span>
                      {group.items.map((item) => (
                        <span
                          key={`${item}-${repeat}`}
                          className="text-[12px] sm:text-[13px] font-[family-name:var(--font-inter)] font-light rounded-full px-4 py-2 shrink-0 cursor-default transition-colors duration-300"
                          style={{
                            color: C.muted,
                            border: `1px solid rgba(255,255,255,0.1)`,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = C.gold;
                            e.currentTarget.style.color = C.gold;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                            e.currentTarget.style.color = C.muted;
                          }}
                        >
                          {item}
                        </span>
                      ))}
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: `${C.gold}40` }}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Gold Line Divider ─── */}
      <GoldLine />

      {/* ─── Footer ─── */}
      <footer className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-10 py-24 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          {/* Animated gold line above */}
          <GoldLine />

          <div className="pt-16 sm:pt-20">
            <h2
              className="font-[family-name:var(--font-manrope)] font-bold tracking-tight leading-[1.15]"
              style={{
                fontSize: "clamp(2rem, 5vw, 4rem)",
                color: C.text,
              }}
            >
              Let&apos;s build{" "}
              <span style={{ color: C.gold }}>something.</span>
            </h2>

            <div className="mt-8 flex justify-center gap-8">
              <a
                href="https://github.com/1aday"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 font-[family-name:var(--font-inter)] font-light"
                style={{ color: C.muted }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.gold)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
              >
                GitHub &#8599;
              </a>
            </div>

            <div
              className="mt-12 pt-8"
              style={{ borderTop: `1px solid rgba(255,255,255,0.06)` }}
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
        </motion.div>
      </footer>

      {/* Theme Switcher */}
      <ThemeSwitcher current="/kinetic" />
    </main>
  );
}
