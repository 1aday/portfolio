"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { projects, stats, expertise, tools } from "@/app/data/projects";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";
import { getProjectImage } from "@/lib/theme-images";

/* ================================================================
   MANUSCRIPT — Illuminated Medieval Codex Portfolio
   Colors: Parchment #F5ECD7 | Gold #B8860B | Rubric #8B1A1A | Ink #2C1810
   ================================================================ */

const C = {
  parchment: "#F5ECD7",
  parchmentDark: "#E8DCBF",
  gold: "#B8860B",
  goldLight: "#D4A84B",
  goldDim: "rgba(184,134,11,0.15)",
  rubric: "#8B1A1A",
  rubricLight: "#A52A2A",
  ink: "#2C1810",
  inkLight: "#5A3E2E",
  inkFaded: "rgba(44,24,16,0.4)",
  rule: "rgba(44,24,16,0.15)",
  marginalia: "#7A6548",
};

/* ─── Gold shimmer keyframe (injected once) ─── */
function ShimmerStyle() {
  return (
    <style>{`
      @keyframes goldShimmer {
        0% { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
      @keyframes quillDraw {
        0% { stroke-dashoffset: 100; }
        100% { stroke-dashoffset: 0; }
      }
      @keyframes fadeInPage {
        0% { opacity: 0; transform: translateX(20px) rotateY(2deg); }
        100% { opacity: 1; transform: translateX(0) rotateY(0); }
      }
      .gold-shimmer {
        background: linear-gradient(
          90deg,
          ${C.gold} 0%,
          ${C.goldLight} 25%,
          #F0D78C 50%,
          ${C.goldLight} 75%,
          ${C.gold} 100%
        );
        background-size: 200% auto;
        animation: goldShimmer 4s linear infinite;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      .gold-shimmer-bg {
        background: linear-gradient(
          90deg,
          ${C.gold} 0%,
          ${C.goldLight} 30%,
          #F0D78C 50%,
          ${C.goldLight} 70%,
          ${C.gold} 100%
        );
        background-size: 200% auto;
        animation: goldShimmer 5s linear infinite;
      }
      .drop-cap-glow:hover {
        text-shadow: 0 0 20px rgba(184,134,11,0.5), 0 0 40px rgba(184,134,11,0.2);
      }
      .manuscript-page {
        background-image:
          radial-gradient(ellipse at 20% 50%, rgba(184,134,11,0.03) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 20%, rgba(139,26,26,0.02) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 80%, rgba(44,24,16,0.02) 0%, transparent 40%);
      }
      .manuscript-texture {
        background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='60' height='60' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
      }
    `}</style>
  );
}

/* ─── Ornate border frame with corner decorations ─── */
function OrnateFrame({
  children,
  className = "",
  variant = "full",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "full" | "simple" | "gold";
}) {
  const borderColor = variant === "gold" ? C.gold : C.ink;
  const borderOpacity = variant === "gold" ? "0.6" : "0.2";

  return (
    <div className={`relative ${className}`}>
      {/* Outer border */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ border: `1px solid rgba(44,24,16,${borderOpacity})` }}
      />
      {/* Inner border */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: "6px",
          border: `1px solid rgba(44,24,16,${Number(borderOpacity) * 0.6})`,
        }}
      />
      {variant === "full" && (
        <>
          {/* Corner ornaments — top-left */}
          <div className="absolute top-[-4px] left-[-4px] w-[18px] h-[18px] pointer-events-none">
            <div className="absolute top-[3px] left-[3px] w-[12px] h-[12px] border-t-2 border-l-2" style={{ borderColor: C.gold }} />
            <div className="absolute top-[0px] left-[0px] w-[6px] h-[6px] rounded-full" style={{ background: C.gold }} />
          </div>
          {/* Corner ornaments — top-right */}
          <div className="absolute top-[-4px] right-[-4px] w-[18px] h-[18px] pointer-events-none">
            <div className="absolute top-[3px] right-[3px] w-[12px] h-[12px] border-t-2 border-r-2" style={{ borderColor: C.gold }} />
            <div className="absolute top-[0px] right-[0px] w-[6px] h-[6px] rounded-full" style={{ background: C.gold }} />
          </div>
          {/* Corner ornaments — bottom-left */}
          <div className="absolute bottom-[-4px] left-[-4px] w-[18px] h-[18px] pointer-events-none">
            <div className="absolute bottom-[3px] left-[3px] w-[12px] h-[12px] border-b-2 border-l-2" style={{ borderColor: C.gold }} />
            <div className="absolute bottom-[0px] left-[0px] w-[6px] h-[6px] rounded-full" style={{ background: C.gold }} />
          </div>
          {/* Corner ornaments — bottom-right */}
          <div className="absolute bottom-[-4px] right-[-4px] w-[18px] h-[18px] pointer-events-none">
            <div className="absolute bottom-[3px] right-[3px] w-[12px] h-[12px] border-b-2 border-r-2" style={{ borderColor: C.gold }} />
            <div className="absolute bottom-[0px] right-[0px] w-[6px] h-[6px] rounded-full" style={{ background: C.gold }} />
          </div>
        </>
      )}
      {variant === "gold" && (
        <>
          {/* Gold diamond corner marks */}
          {[
            "top-[-3px] left-[-3px]",
            "top-[-3px] right-[-3px]",
            "bottom-[-3px] left-[-3px]",
            "bottom-[-3px] right-[-3px]",
          ].map((pos, i) => (
            <div key={i} className={`absolute ${pos} pointer-events-none`}>
              <div
                className="w-[6px] h-[6px] rotate-45"
                style={{ background: C.gold }}
              />
            </div>
          ))}
        </>
      )}
      {children}
    </div>
  );
}

/* ─── Decorative rule divider ─── */
function ManuscriptDivider({ withSymbol = true }: { withSymbol?: boolean }) {
  return (
    <div className="flex items-center justify-center gap-4 py-6">
      <div
        className="h-[1px] flex-1 max-w-[160px]"
        style={{ background: `linear-gradient(90deg, transparent, ${C.rule})` }}
      />
      {withSymbol && (
        <div className="flex items-center gap-2">
          <span style={{ color: C.gold, fontSize: "10px" }}>&#10022;</span>
          <span style={{ color: C.rubric, fontSize: "14px" }}>&#10040;</span>
          <span style={{ color: C.gold, fontSize: "10px" }}>&#10022;</span>
        </div>
      )}
      <div
        className="h-[1px] flex-1 max-w-[160px]"
        style={{ background: `linear-gradient(90deg, ${C.rule}, transparent)` }}
      />
    </div>
  );
}

/* ─── Illuminated drop cap ─── */
function DropCap({ letter }: { letter: string }) {
  return (
    <motion.span
      className="drop-cap-glow float-left mr-3 mt-1 inline-flex items-center justify-center cursor-default select-none"
      style={{
        width: "64px",
        height: "64px",
        background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight}, #F0D78C, ${C.goldLight}, ${C.gold})`,
        backgroundSize: "200% 200%",
        color: C.parchment,
        fontSize: "42px",
        lineHeight: 1,
        fontFamily: "var(--font-playfair)",
        fontWeight: 700,
        borderRadius: "4px",
        boxShadow: `0 2px 8px rgba(184,134,11,0.3), inset 0 1px 2px rgba(255,255,255,0.3)`,
        border: `1px solid ${C.gold}`,
      }}
      whileHover={{
        scale: 1.12,
        backgroundPosition: "100% 100%",
      }}
      transition={{ duration: 0.3 }}
    >
      {letter}
    </motion.span>
  );
}

/* ─── Scroll reveal wrapper (page-turn feel) ─── */
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
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 30 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Folio number component ─── */
function FolioNumber({ number, recto = true }: { number: number; recto?: boolean }) {
  return (
    <span
      className="font-[family-name:var(--font-display)] italic text-sm tracking-wide"
      style={{ color: C.inkFaded }}
    >
      f.&thinsp;{number}{recto ? "r" : "v"}
    </span>
  );
}

/* ─── Paragraph mark ─── */
function ParagraphMark() {
  return (
    <span
      className="inline-block mr-1 font-[family-name:var(--font-display)]"
      style={{ color: C.rubric, fontWeight: 600 }}
    >
      &#182;
    </span>
  );
}

/* ─── Marginalia annotation ─── */
function Marginalia({
  children,
  side = "right",
}: {
  children: React.ReactNode;
  side?: "left" | "right";
}) {
  return (
    <div
      className={`hidden lg:block absolute top-0 ${side === "right" ? "-right-44" : "-left-44"} w-36`}
    >
      <div
        className="font-[family-name:var(--font-display)] italic text-xs leading-relaxed pl-3"
        style={{
          color: C.marginalia,
          borderLeft: side === "right" ? `1px solid ${C.goldDim}` : "none",
          borderRight: side === "left" ? `1px solid ${C.goldDim}` : "none",
          paddingRight: side === "left" ? "12px" : "0",
          paddingLeft: side === "right" ? "12px" : "0",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ================================================================
   MAIN PAGE COMPONENT
   ================================================================ */
export default function ManuscriptPage() {
  const [folioPage, setFolioPage] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  /* Update folio number based on scroll */
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      const totalPages = 24;
      setFolioPage(Math.max(1, Math.ceil(v * totalPages)));
    });
    return unsubscribe;
  }, [scrollYProgress]);

  return (
    <>
      <ShimmerStyle />
      <div
        ref={containerRef}
        className="min-h-screen manuscript-page manuscript-texture"
        style={{ background: C.parchment, color: C.ink }}
      >
        {/* ──── Fixed folio number indicator ──── */}
        <motion.div
          className="fixed top-6 right-6 z-50 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div
            className="px-3 py-1.5 rounded font-[family-name:var(--font-display)] italic text-sm"
            style={{
              background: `${C.parchment}E8`,
              border: `1px solid ${C.goldDim}`,
              color: C.inkFaded,
              backdropFilter: "blur(8px)",
            }}
          >
            <FolioNumber number={folioPage} recto={folioPage % 2 === 1} />
          </div>
        </motion.div>

        {/* ================================================================
            NAV — Colophon-style header
            ================================================================ */}
        <motion.nav
          className="relative z-40"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="max-w-5xl mx-auto px-6 pt-8 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 flex items-center justify-center rounded-sm gold-shimmer-bg"
                style={{ boxShadow: `0 1px 4px rgba(184,134,11,0.3)` }}
              >
                <span className="text-base font-bold" style={{ color: C.parchment, fontFamily: "var(--font-playfair)" }}>
                  G
                </span>
              </div>
              <div>
                <span
                  className="font-[family-name:var(--font-playfair)] text-lg font-semibold tracking-wide"
                  style={{ color: C.ink }}
                >
                  Grox.io
                </span>
                <span
                  className="block font-[family-name:var(--font-display)] italic text-[10px] tracking-widest uppercase"
                  style={{ color: C.marginalia }}
                >
                  Codex Artificialis
                </span>
              </div>
            </div>
            <div className="flex items-center gap-6 font-[family-name:var(--font-display)] italic text-sm" style={{ color: C.inkLight }}>
              <a href="#chapters" className="hover:underline decoration-dotted underline-offset-4" style={{ textDecorationColor: C.gold }}>Chapters</a>
              <a href="#marginalia" className="hover:underline decoration-dotted underline-offset-4" style={{ textDecorationColor: C.gold }}>Marginalia</a>
              <a href="#index" className="hover:underline decoration-dotted underline-offset-4" style={{ textDecorationColor: C.gold }}>Index</a>
            </div>
          </div>
          <div className="max-w-5xl mx-auto px-6">
            <div className="h-[1px]" style={{ background: `linear-gradient(90deg, transparent 0%, ${C.gold}40 20%, ${C.gold}40 80%, transparent 100%)` }} />
          </div>
        </motion.nav>

        {/* ================================================================
            HERO — Manuscript Title Page
            ================================================================ */}
        <section className="max-w-5xl mx-auto px-6 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
          >
            <OrnateFrame variant="full" className="p-8 md:p-16">
              <div className="relative text-center">
                {/* Decorative header line */}
                <div className="flex items-center justify-center gap-3 mb-8">
                  <span style={{ color: C.gold, fontSize: "12px" }}>&#10022;</span>
                  <div className="h-[1px] w-16" style={{ background: C.gold }} />
                  <span className="font-[family-name:var(--font-display)] italic text-xs uppercase tracking-[0.3em]" style={{ color: C.marginalia }}>
                    Anno Domini MMXXV
                  </span>
                  <div className="h-[1px] w-16" style={{ background: C.gold }} />
                  <span style={{ color: C.gold, fontSize: "12px" }}>&#10022;</span>
                </div>

                {/* Main title with illuminated treatment */}
                <motion.h1
                  className="font-[family-name:var(--font-playfair)] text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-6"
                  style={{ color: C.ink }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.6 }}
                >
                  <span className="gold-shimmer">The Book</span>
                  <br />
                  <span style={{ color: C.rubric }}>of Works</span>
                </motion.h1>

                {/* Subtitle in manuscript style */}
                <motion.p
                  className="font-[family-name:var(--font-display)] italic text-lg md:text-xl max-w-lg mx-auto leading-relaxed mb-10"
                  style={{ color: C.inkLight }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                >
                  <ParagraphMark />
                  Herein is set forth a compendium of artifice &amp; intelligence, being a record of works
                  wrought in the digital scriptorium of <span style={{ color: C.rubric }}>Grox.io</span>
                </motion.p>

                <ManuscriptDivider />

                {/* Stats as colophon details */}
                <motion.div
                  className="flex flex-wrap justify-center gap-8 md:gap-14 mt-8"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.8 }}
                >
                  {stats.map((stat, i) => (
                    <div key={i} className="text-center">
                      <div
                        className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-bold gold-shimmer"
                      >
                        {stat.value}
                      </div>
                      <div
                        className="font-[family-name:var(--font-display)] italic text-sm mt-1 tracking-wider uppercase"
                        style={{ color: C.marginalia }}
                      >
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </motion.div>

                {/* Folio mark */}
                <div className="mt-10 text-center">
                  <FolioNumber number={1} />
                </div>
              </div>
            </OrnateFrame>
          </motion.div>
        </section>

        {/* ================================================================
            PROJECTS — Chapters of the Codex
            ================================================================ */}
        <section id="chapters" className="max-w-5xl mx-auto px-6 pb-16">
          <Reveal>
            <div className="text-center mb-16">
              <span
                className="font-[family-name:var(--font-display)] italic text-sm tracking-[0.25em] uppercase block mb-3"
                style={{ color: C.marginalia }}
              >
                Liber Primus
              </span>
              <h2
                className="font-[family-name:var(--font-playfair)] text-3xl md:text-5xl font-bold"
                style={{ color: C.rubric }}
              >
                Chapters of Works
              </h2>
              <ManuscriptDivider />
            </div>
          </Reveal>

          <div className="space-y-20">
            {projects.map((project, i) => {
              const chapterNum = i + 1;
              const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
              const roman = romanNumerals[i] || String(chapterNum);
              const firstLetter = project.title.replace(/\n/g, " ").charAt(0);
              const restOfTitle = project.title.replace(/\n/g, " ").slice(1);
              const descFirstLetter = project.description.charAt(0);
              const descRest = project.description.slice(1);
              const isEven = i % 2 === 0;

              return (
                <Reveal key={i} delay={0.1}>
                  <article className="relative">
                    {/* Chapter header */}
                    <div className="flex items-center gap-4 mb-6">
                      <span
                        className="font-[family-name:var(--font-display)] italic text-sm tracking-[0.2em] uppercase"
                        style={{ color: C.marginalia }}
                      >
                        Capitulum {roman}
                      </span>
                      <div className="h-[1px] flex-1" style={{ background: C.rule }} />
                      <FolioNumber number={i * 2 + 2} recto={isEven} />
                    </div>

                    <OrnateFrame variant={i === 0 ? "full" : "gold"} className="p-6 md:p-10">
                      {/* Marginalia annotation */}
                      <Marginalia side={isEven ? "right" : "right"}>
                        {project.client} &middot; {project.year}
                        <br />
                        <span className="text-[10px]">{project.tech.join(", ")}</span>
                      </Marginalia>

                      <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-start ${!isEven ? "md:direction-rtl" : ""}`}>
                        {/* Project image as manuscript illumination */}
                        <motion.div
                          className={`relative ${!isEven ? "md:order-2" : ""}`}
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.4 }}
                          style={{ direction: "ltr" }}
                        >
                          <div
                            className="relative overflow-hidden"
                            style={{
                              border: `2px solid ${C.gold}40`,
                              padding: "6px",
                              background: `linear-gradient(135deg, ${C.goldDim}, transparent)`,
                            }}
                          >
                            <img
                              src={getProjectImage("manuscript", project.image)}
                              alt={project.title.replace(/\n/g, " ")}
                              className="w-full aspect-[4/3] object-cover"
                              style={{
                                border: `1px solid ${C.rule}`,
                                filter: "sepia(0.15) contrast(1.05)",
                              }}
                            />
                            {/* Gold corner accents on image */}
                            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2" style={{ borderColor: C.gold }} />
                            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2" style={{ borderColor: C.gold }} />
                            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2" style={{ borderColor: C.gold }} />
                            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2" style={{ borderColor: C.gold }} />
                          </div>
                          {/* Image caption like manuscript captions */}
                          <p
                            className="text-center font-[family-name:var(--font-display)] italic text-xs mt-3 tracking-wide"
                            style={{ color: C.marginalia }}
                          >
                            Fig. {roman}. &mdash; {project.client}, {project.year}
                          </p>
                        </motion.div>

                        {/* Chapter text content */}
                        <div style={{ direction: "ltr" }} className={`${!isEven ? "md:order-1" : ""}`}>
                          {/* Title as rubric */}
                          <h3
                            className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-bold leading-tight mb-4"
                            style={{ color: C.rubric }}
                          >
                            <motion.span
                              className="drop-cap-glow inline-flex items-center justify-center mr-1"
                              style={{
                                width: "40px",
                                height: "40px",
                                background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
                                color: C.parchment,
                                fontSize: "28px",
                                lineHeight: 1,
                                fontFamily: "var(--font-playfair)",
                                fontWeight: 700,
                                borderRadius: "3px",
                                boxShadow: `0 1px 4px rgba(184,134,11,0.25)`,
                                display: "inline-flex",
                                verticalAlign: "middle",
                              }}
                              whileHover={{ scale: 1.15 }}
                              transition={{ duration: 0.25 }}
                            >
                              {firstLetter}
                            </motion.span>
                            {restOfTitle}
                          </h3>

                          {/* Description with drop cap */}
                          <div
                            className="font-[family-name:var(--font-display)] italic text-base leading-[1.8] mb-4"
                            style={{ color: C.inkLight }}
                          >
                            <DropCap letter={descFirstLetter} />
                            {descRest}
                          </div>

                          {/* Technical note styled as scholarly annotation */}
                          <div
                            className="mt-4 pt-4 font-[family-name:var(--font-display)] text-sm leading-relaxed"
                            style={{
                              color: C.marginalia,
                              borderTop: `1px solid ${C.rule}`,
                            }}
                          >
                            <span style={{ color: C.rubric, fontWeight: 600 }}>Nota Bene:</span>{" "}
                            <span className="italic">{project.technical}</span>
                          </div>

                          {/* Tech stack as manuscript tags */}
                          <div className="flex flex-wrap gap-2 mt-5">
                            {project.tech.map((t, j) => (
                              <span
                                key={j}
                                className="font-[family-name:var(--font-display)] italic text-xs px-3 py-1 rounded-sm"
                                style={{
                                  background: C.goldDim,
                                  color: C.gold,
                                  border: `1px solid ${C.gold}30`,
                                }}
                              >
                                {t}
                              </span>
                            ))}
                          </div>

                          {/* GitHub link styled as manuscript reference */}
                          {project.github && (
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 mt-5 font-[family-name:var(--font-display)] italic text-sm group"
                              style={{ color: C.rubric }}
                            >
                              <span className="underline decoration-dotted underline-offset-4 group-hover:decoration-solid" style={{ textDecorationColor: C.rubric }}>
                                View Manuscript Source
                              </span>
                              <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </OrnateFrame>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* ================================================================
            EXPERTISE — Marginalia Notes
            ================================================================ */}
        <section id="marginalia" className="max-w-5xl mx-auto px-6 py-16">
          <Reveal>
            <div className="text-center mb-16">
              <span
                className="font-[family-name:var(--font-display)] italic text-sm tracking-[0.25em] uppercase block mb-3"
                style={{ color: C.marginalia }}
              >
                Liber Secundus
              </span>
              <h2
                className="font-[family-name:var(--font-playfair)] text-3xl md:text-5xl font-bold"
                style={{ color: C.rubric }}
              >
                Marginalia &amp; Annotations
              </h2>
              <ManuscriptDivider />
              <p className="font-[family-name:var(--font-display)] italic text-base max-w-lg mx-auto mt-4" style={{ color: C.inkLight }}>
                <ParagraphMark />
                Being scholarly notes upon the arts &amp; sciences practised in this scriptorium
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {expertise.map((item, i) => (
              <Reveal key={i} delay={i * 0.12}>
                <motion.div
                  className="relative h-full"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  <OrnateFrame variant="gold" className="p-6 md:p-8 h-full">
                    <div className="flex items-start gap-4">
                      {/* Large decorative number */}
                      <div
                        className="flex-shrink-0 w-12 h-12 flex items-center justify-center font-[family-name:var(--font-playfair)] text-2xl font-bold"
                        style={{
                          color: C.parchment,
                          background: `linear-gradient(135deg, ${C.rubric}, ${C.rubricLight})`,
                          borderRadius: "3px",
                          boxShadow: "0 2px 6px rgba(139,26,26,0.25)",
                        }}
                      >
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <h3
                          className="font-[family-name:var(--font-playfair)] text-lg font-bold mb-2"
                          style={{ color: C.rubric }}
                        >
                          {item.title}
                        </h3>
                        <p
                          className="font-[family-name:var(--font-display)] italic text-sm leading-[1.8]"
                          style={{ color: C.inkLight }}
                        >
                          {item.body}
                        </p>
                      </div>
                    </div>
                    {/* Decorative bottom rule */}
                    <div className="mt-5 flex items-center gap-2">
                      <div className="h-[1px] flex-1" style={{ background: C.rule }} />
                      <span style={{ color: C.gold, fontSize: "8px" }}>&#10022;</span>
                      <div className="h-[1px] flex-1" style={{ background: C.rule }} />
                    </div>
                    {/* Folio */}
                    <div className="text-right mt-2">
                      <FolioNumber number={14 + i} />
                    </div>
                  </OrnateFrame>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ================================================================
            TOOLS — Index (Back Matter)
            ================================================================ */}
        <section id="index" className="max-w-5xl mx-auto px-6 py-16">
          <Reveal>
            <div className="text-center mb-16">
              <span
                className="font-[family-name:var(--font-display)] italic text-sm tracking-[0.25em] uppercase block mb-3"
                style={{ color: C.marginalia }}
              >
                Index Rerum
              </span>
              <h2
                className="font-[family-name:var(--font-playfair)] text-3xl md:text-5xl font-bold"
                style={{ color: C.rubric }}
              >
                Index of Instruments
              </h2>
              <ManuscriptDivider />
              <p className="font-[family-name:var(--font-display)] italic text-base max-w-lg mx-auto mt-4" style={{ color: C.inkLight }}>
                <ParagraphMark />
                A catalogue of the implements &amp; techniques employed in the making of these works
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <OrnateFrame variant="full" className="p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {tools.map((category, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.6 }}
                  >
                    {/* Category header with rubric styling */}
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className="w-6 h-6 flex items-center justify-center rounded-sm font-[family-name:var(--font-playfair)] text-xs font-bold"
                        style={{
                          background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
                          color: C.parchment,
                        }}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      <h3
                        className="font-[family-name:var(--font-playfair)] text-base font-bold uppercase tracking-wider"
                        style={{ color: C.rubric }}
                      >
                        {category.label}
                      </h3>
                    </div>

                    <div className="h-[1px] mb-3" style={{ background: C.rule }} />

                    {/* Items listed like an index */}
                    <ul className="space-y-2">
                      {category.items.map((item, j) => (
                        <motion.li
                          key={j}
                          className="flex items-center gap-2 font-[family-name:var(--font-display)] italic text-sm group cursor-default"
                          style={{ color: C.inkLight }}
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.2 }}
                        >
                          <span
                            className="w-1.5 h-1.5 rotate-45 flex-shrink-0 transition-colors"
                            style={{ background: C.gold }}
                          />
                          <span className="group-hover:underline decoration-dotted underline-offset-4" style={{ textDecorationColor: C.goldDim }}>
                            {item}
                          </span>
                          {/* Dotted leader line */}
                          <span className="flex-1 border-b border-dotted mx-1" style={{ borderColor: C.rule }} />
                          {/* Fake page reference */}
                          <span className="text-xs flex-shrink-0" style={{ color: C.marginalia }}>
                            p.&thinsp;{((i + 1) * 10 + j * 3 + 7)}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>

              <div className="mt-10 text-center">
                <FolioNumber number={22} />
              </div>
            </OrnateFrame>
          </Reveal>
        </section>

        {/* ================================================================
            FOOTER — Colophon
            ================================================================ */}
        <footer className="max-w-5xl mx-auto px-6 pt-8 pb-16">
          <Reveal>
            <ManuscriptDivider />

            <OrnateFrame variant="simple" className="p-8 md:p-12">
              <div className="text-center">
                <span
                  className="font-[family-name:var(--font-display)] italic text-xs tracking-[0.3em] uppercase block mb-4"
                  style={{ color: C.marginalia }}
                >
                  Colophon
                </span>

                {/* Decorative colophon text */}
                <p
                  className="font-[family-name:var(--font-display)] italic text-base leading-[1.9] max-w-xl mx-auto mb-6"
                  style={{ color: C.inkLight }}
                >
                  <ParagraphMark />
                  This codex was illuminated &amp; composed in the digital scriptorium of{" "}
                  <span className="gold-shimmer font-semibold not-italic">Grox.io</span>, in the year of our
                  computation MMXXV, with artificial intelligence as both subject &amp; instrument.
                </p>

                {/* Printer's mark / logo */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{
                        border: `2px solid ${C.gold}`,
                        background: `radial-gradient(circle, ${C.goldDim} 0%, transparent 70%)`,
                      }}
                    >
                      <span
                        className="font-[family-name:var(--font-playfair)] text-2xl font-bold gold-shimmer"
                      >
                        G
                      </span>
                    </div>
                    {/* Cross marks around the printer's mark */}
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs" style={{ color: C.gold }}>&#10022;</span>
                    <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-xs" style={{ color: C.gold }}>&#10022;</span>
                    <span className="absolute top-1/2 -left-3 -translate-y-1/2 text-xs" style={{ color: C.gold }}>&#10022;</span>
                    <span className="absolute top-1/2 -right-3 -translate-y-1/2 text-xs" style={{ color: C.gold }}>&#10022;</span>
                  </div>
                </div>

                <ManuscriptDivider withSymbol={false} />

                <p
                  className="font-[family-name:var(--font-display)] italic text-xs tracking-wider mt-4"
                  style={{ color: C.marginalia }}
                >
                  Deo gratias &middot; Finis &middot; Laus Deo
                </p>

                <div className="mt-6">
                  <FolioNumber number={24} recto={false} />
                </div>
              </div>
            </OrnateFrame>
          </Reveal>

          {/* Theme Switcher */}
          <div className="mt-12">
            <ThemeSwitcher current="/manuscript" variant="light" />
          </div>
        </footer>
      </div>
    </>
  );
}
