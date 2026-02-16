"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";

/* ─── palette ─── */
const INK = "#111111";
const NEWSPRINT = "#F5F1E8";
const RED = "#CC0000";
const RULE = "#D4D0C8";

/* ─── helpers ─── */
function newspaperDate() {
  const d = new Date();
  const months = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER",
  ];
  const days = [
    "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY",
    "THURSDAY", "FRIDAY", "SATURDAY",
  ];
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function cleanTitle(t: string) {
  return t.replace(/\n/g, " ");
}

/* ─── scroll-reveal wrapper ─── */
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── thin rules ─── */
function HRule({ className = "" }: { className?: string }) {
  return (
    <div
      className={className}
      style={{ height: 1, background: RULE, width: "100%" }}
    />
  );
}

function DoubleRule({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <div style={{ height: 2, background: INK, width: "100%" }} />
      <div style={{ height: 3 }} />
      <div style={{ height: 1, background: INK, width: "100%" }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   GAZETTE PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function GazettePage() {
  return (
    <div
      className="min-h-screen"
      style={{ background: NEWSPRINT, color: INK }}
    >
      {/* ── noise / paper texture overlay ── */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            MASTHEAD
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <Masthead />

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            STATS BAR
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <StatsBar />

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            PROJECTS — SELECTED WORK
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <ProjectsSection />

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            EXPERTISE — ANALYSIS & COMMENTARY
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <ExpertiseSection />

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            TOOLS — CLASSIFIED ADVERTISEMENTS
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <ToolsSection />

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            FOOTER
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <Footer />

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            THEME SWITCHER
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <ThemeSwitcher current="/gazette" variant="light" />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MASTHEAD
   ═══════════════════════════════════════════════════════════════ */
function Masthead() {
  return (
    <Reveal>
      <header className="pt-10 pb-2 text-center">
        {/* top thin rule */}
        <DoubleRule className="mb-4" />

        {/* volume line */}
        <div
          className="flex items-center justify-between text-[10px] tracking-[0.25em] uppercase font-[family-name:var(--font-inter)]"
          style={{ color: INK }}
        >
          <span>VOL I &bull; NO. 1 &bull; 2025</span>
          <span>{newspaperDate()}</span>
          <span>PRICE: PRICELESS</span>
        </div>

        <HRule className="my-3" />

        {/* title */}
        <h1
          className="font-[family-name:var(--font-dm-serif)] leading-[0.9] tracking-tight"
          style={{ fontSize: "clamp(3rem, 8vw, 6.5rem)", color: INK }}
        >
          THE GROX TIMES
        </h1>

        {/* tagline */}
        <p
          className="mt-2 text-[11px] tracking-[0.35em] uppercase font-[family-name:var(--font-inter)]"
          style={{ color: RED }}
        >
          ALL THE AI THAT&apos;S FIT TO SHIP
        </p>

        <HRule className="mt-3 mb-1" />
        <DoubleRule className="mb-6" />
      </header>
    </Reveal>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STATS BAR
   ═══════════════════════════════════════════════════════════════ */
function StatsBar() {
  return (
    <Reveal delay={0.1}>
      <div
        className="grid grid-cols-3 text-center py-4 mb-6"
        style={{ borderTop: `1px solid ${RULE}`, borderBottom: `1px solid ${RULE}` }}
      >
        {stats.map((s, i) => (
          <div
            key={s.label}
            style={{
              borderLeft: i > 0 ? `1px solid ${RULE}` : "none",
            }}
          >
            <span
              className="font-[family-name:var(--font-dm-serif)] block"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", color: RED }}
            >
              {s.value}
            </span>
            <span className="text-[10px] tracking-[0.2em] uppercase font-[family-name:var(--font-inter)]">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </Reveal>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PROJECTS — "SELECTED WORK"
   ═══════════════════════════════════════════════════════════════ */
function ProjectsSection() {
  return (
    <section className="mb-12">
      <Reveal>
        <SectionHeader title="SELECTED WORK" subtitle="FRONT PAGE" />
      </Reveal>

      {/* 3-column grid with column rules */}
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-0"
        style={{
          borderTop: `1px solid ${RULE}`,
        }}
      >
        {projects.map((project, i) => {
          const isLead = i === 0;
          const colDelay = 0.08 * (i % 3);
          return (
            <Reveal
              key={project.title}
              delay={colDelay}
              className={`${isLead ? "md:col-span-2" : ""}`}
            >
              <ProjectCard project={project} isLead={isLead} index={i} />
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  isLead,
  index,
}: {
  project: (typeof projects)[number];
  isLead: boolean;
  index: number;
}) {
  /* Compute which column the card is in (within the 3-col grid).
     Lead takes cols 0-1, so the first non-lead (index 1) is col 2, etc. */
  const needsLeftBorder = (() => {
    if (index === 0) return false; // lead story, no left border
    if (isLead) return false;
    // For items after the lead, determine column position in the 3-col grid:
    // Lead occupies 2 cols, so index 1 is at col 2 (needs left border).
    // After that, items flow normally: index 2 -> col 0, index 3 -> col 1, index 4 -> col 2, ...
    if (index === 1) return true;
    return (index - 2) % 3 !== 0;
  })();

  return (
    <article
      className="group p-4 sm:p-5 transition-transform duration-200"
      style={{
        borderBottom: `1px solid ${RULE}`,
        borderLeft: needsLeftBorder ? `1px solid ${RULE}` : "none",
      }}
      onMouseEnter={(e) => {
        const deg = index % 2 === 0 ? 0.4 : -0.4;
        (e.currentTarget as HTMLElement).style.transform = `rotate(${deg}deg)`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "rotate(0deg)";
      }}
    >
      {/* dateline */}
      <p
        className="text-[10px] tracking-[0.2em] uppercase mb-1 font-[family-name:var(--font-inter)]"
        style={{ color: RED }}
      >
        {project.client} &mdash; {project.year}
      </p>

      {/* headline */}
      <h3
        className={`font-[family-name:var(--font-dm-serif)] leading-tight mb-2 cursor-default transition-transform duration-200 group-hover:scale-[1.01] origin-left ${
          isLead ? "text-2xl sm:text-3xl md:text-4xl" : "text-lg sm:text-xl"
        }`}
        style={{ color: INK }}
      >
        {cleanTitle(project.title)}
      </h3>

      {/* body */}
      <p
        className={`font-[family-name:var(--font-inter)] leading-relaxed mb-3 ${
          isLead ? "text-[14px]" : "text-[12.5px]"
        }`}
        style={{ color: "#333" }}
      >
        {project.description}
      </p>

      {/* technical detail for lead story */}
      {isLead && project.technical && (
        <p
          className="font-[family-name:var(--font-inter)] text-[12px] leading-relaxed mb-3"
          style={{ color: "#555" }}
        >
          {project.technical}
        </p>
      )}

      {/* tech tags */}
      <p
        className="text-[11px] italic mb-3 font-[family-name:var(--font-inter)]"
        style={{ color: "#666" }}
      >
        {project.tech.join(" / ")}
      </p>

      {/* continued-on link */}
      <a
        href={project.github}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-[10px] tracking-[0.15em] uppercase font-[family-name:var(--font-inter)] transition-colors duration-200"
        style={{ color: RED }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.color = INK)
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.color = RED)
        }
      >
        CONTINUED ON GITHUB &rarr;
      </a>
    </article>
  );
}

/* ═══════════════════════════════════════════════════════════════
   EXPERTISE — "ANALYSIS & COMMENTARY"
   ═══════════════════════════════════════════════════════════════ */
function ExpertiseSection() {
  return (
    <section className="mb-12">
      <Reveal>
        <SectionHeader title="ANALYSIS & COMMENTARY" subtitle="EDITORIAL" />
      </Reveal>

      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-0"
        style={{ borderTop: `1px solid ${RULE}` }}
      >
        {expertise.map((item, i) => {
          const firstLetter = item.body.charAt(0);
          const rest = item.body.slice(1);
          const needsLeftBorder = i % 2 !== 0;

          return (
            <Reveal key={item.title} delay={i * 0.1}>
              <div
                className="p-5 sm:p-6"
                style={{
                  borderBottom: `1px solid ${RULE}`,
                  borderLeft: needsLeftBorder ? `1px solid ${RULE}` : "none",
                }}
              >
                {/* column title */}
                <p
                  className="text-[10px] tracking-[0.25em] uppercase mb-3 font-[family-name:var(--font-inter)]"
                  style={{ color: RED }}
                >
                  {item.title}
                </p>

                {/* body with drop cap */}
                <p
                  className="font-[family-name:var(--font-inter)] text-[13px] sm:text-[14px] leading-relaxed"
                  style={{ color: "#222" }}
                >
                  <span
                    className="font-[family-name:var(--font-dm-serif)] float-left mr-2 leading-[0.8]"
                    style={{
                      fontSize: "3.5rem",
                      color: INK,
                      marginTop: "0.05em",
                    }}
                  >
                    {firstLetter}
                  </span>
                  {rest}
                </p>

                {/* pull quote divider */}
                {i % 2 === 0 && (
                  <div className="mt-4 pt-3" style={{ borderTop: `1px solid ${RULE}` }}>
                    <p
                      className="font-[family-name:var(--font-dm-serif)] text-lg sm:text-xl italic text-center"
                      style={{ color: "#444" }}
                    >
                      &ldquo;{item.title}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TOOLS — "CLASSIFIED ADVERTISEMENTS"
   ═══════════════════════════════════════════════════════════════ */
function ToolsSection() {
  return (
    <section className="mb-12">
      <Reveal>
        <SectionHeader
          title="CLASSIFIED ADVERTISEMENTS"
          subtitle="MARKETPLACE"
        />
      </Reveal>

      <div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0"
        style={{
          borderTop: `1px solid ${INK}`,
          borderLeft: `1px solid ${INK}`,
        }}
      >
        {tools.map((group, i) => (
          <Reveal key={group.label} delay={i * 0.06}>
            <div
              className="p-3 sm:p-4"
              style={{
                borderRight: `1px solid ${INK}`,
                borderBottom: `1px solid ${INK}`,
                minHeight: "120px",
              }}
            >
              {/* group label */}
              <p
                className="text-[9px] tracking-[0.3em] uppercase mb-2 pb-1 font-[family-name:var(--font-inter)] font-bold"
                style={{
                  color: INK,
                  borderBottom: `1px solid ${RULE}`,
                }}
              >
                {group.label}
              </p>

              {/* items */}
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <p
                    key={item}
                    className="text-[11px] font-[family-name:var(--font-inter)] leading-snug"
                    style={{ color: "#333" }}
                  >
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </Reveal>
        ))}

        {/* filler classified ads for visual density */}
        {[
          {
            label: "Services",
            items: ["Full-Stack Dev", "AI Integration", "System Design"],
          },
          {
            label: "Seeking",
            items: [
              "Hard Problems",
              "Ambitious Teams",
              "Novel Challenges",
            ],
          },
        ].map((group, i) => (
          <Reveal key={group.label} delay={(tools.length + i) * 0.06}>
            <div
              className="p-3 sm:p-4"
              style={{
                borderRight: `1px solid ${INK}`,
                borderBottom: `1px solid ${INK}`,
                minHeight: "120px",
              }}
            >
              <p
                className="text-[9px] tracking-[0.3em] uppercase mb-2 pb-1 font-[family-name:var(--font-inter)] font-bold"
                style={{
                  color: INK,
                  borderBottom: `1px solid ${RULE}`,
                }}
              >
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <p
                    key={item}
                    className="text-[11px] font-[family-name:var(--font-inter)] leading-snug"
                    style={{ color: "#333" }}
                  >
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* small-print notice */}
      <Reveal delay={0.2}>
        <p
          className="text-center text-[9px] tracking-[0.15em] uppercase mt-3 font-[family-name:var(--font-inter)]"
          style={{ color: "#999" }}
        >
          RATES UPON REQUEST &bull; NO CLASSIFIED AD SHALL EXCEED 30 WORDS
          &bull; THE GROX TIMES RESERVES THE RIGHT TO REFUSE SUBMISSIONS
        </p>
      </Reveal>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <Reveal>
      <footer className="pb-8">
        <DoubleRule className="mb-4" />

        <div className="text-center">
          <p
            className="text-[10px] tracking-[0.25em] uppercase mb-3 font-[family-name:var(--font-inter)]"
            style={{ color: RED }}
          >
            CORRECTIONS &amp; CLARIFICATIONS
          </p>
          <p
            className="font-[family-name:var(--font-inter)] text-[12px] italic mb-4"
            style={{ color: "#666" }}
          >
            An earlier edition of this portfolio mistakenly credited the developer
            with sleeping eight hours a night. We regret the error.
          </p>

          <HRule className="mb-3 mx-auto max-w-xs" />

          <p
            className="text-[9px] tracking-[0.2em] uppercase font-[family-name:var(--font-inter)]"
            style={{ color: "#999" }}
          >
            &copy; {new Date().getFullYear()} THE GROX TIMES &bull; ALL RIGHTS
            RESERVED &bull; PRINTED ON RECYCLED PIXELS
          </p>
        </div>

        <div className="mt-8" />
      </footer>
    </Reveal>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SHARED: SECTION HEADER
   ═══════════════════════════════════════════════════════════════ */
function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-0">
      <DoubleRule className="mb-3" />
      <div className="flex items-baseline justify-between mb-3">
        <h2
          className="font-[family-name:var(--font-dm-serif)] text-xl sm:text-2xl md:text-3xl"
          style={{ color: INK }}
        >
          {title}
        </h2>
        <span
          className="text-[9px] tracking-[0.3em] uppercase font-[family-name:var(--font-inter)]"
          style={{ color: "#999" }}
        >
          {subtitle}
        </span>
      </div>
    </div>
  );
}
