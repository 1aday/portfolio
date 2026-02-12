"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { getProjectImage } from "@/lib/theme-images";

/* ================================================================
   VITRINE — Museum Glass Display Case Portfolio
   Colors: Museum White #FAFAFA | Gallery #F5F3EF | Institutional Green #1B4332
           Brass #B8860B | Charcoal #1C1C1C | Label #6B6560
   ================================================================ */

const C = {
  museumWhite: "#FAFAFA",
  gallery: "#F5F3EF",
  green: "#1B4332",
  greenLight: "#2D6A4F",
  greenDim: "rgba(27,67,50,0.08)",
  brass: "#B8860B",
  brassLight: "#D4A84B",
  brassDim: "rgba(184,134,11,0.15)",
  charcoal: "#1C1C1C",
  label: "#6B6560",
  labelLight: "#9B9590",
  glassBg: "rgba(255,255,255,0.85)",
  glassBorder: "rgba(255,255,255,0.6)",
  glassTint: "rgba(255,255,255,0.7)",
  divider: "rgba(27,67,50,0.12)",
  warm: "#F8F5F0",
};

const ease = [0.22, 1, 0.36, 1] as const;

/* ─── Reusable reveal wrapper ─── */
function Reveal({
  children,
  className = "",
  delay = 0,
  y = 24,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Glass panel reveal with scale ─── */
function GlassReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 1.2, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Label slide-up reveal ─── */
function LabelReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease, delay: delay + 0.3 }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Brass corner brackets (vitrine hardware) ─── */
function BrassCorners() {
  const size = 14;
  const stroke = 1.5;
  const color = C.brass;
  return (
    <>
      {/* Top-left */}
      <svg
        className="absolute top-0 left-0 pointer-events-none"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ filter: "drop-shadow(0 0 1px rgba(184,134,11,0.3))" }}
      >
        <path
          d={`M0 ${size} L0 0 L${size} 0`}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
        />
      </svg>
      {/* Top-right */}
      <svg
        className="absolute top-0 right-0 pointer-events-none"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ filter: "drop-shadow(0 0 1px rgba(184,134,11,0.3))" }}
      >
        <path
          d={`M0 0 L${size} 0 L${size} ${size}`}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
        />
      </svg>
      {/* Bottom-left */}
      <svg
        className="absolute bottom-0 left-0 pointer-events-none"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ filter: "drop-shadow(0 0 1px rgba(184,134,11,0.3))" }}
      >
        <path
          d={`M0 0 L0 ${size} L${size} ${size}`}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
        />
      </svg>
      {/* Bottom-right */}
      <svg
        className="absolute bottom-0 right-0 pointer-events-none"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ filter: "drop-shadow(0 0 1px rgba(184,134,11,0.3))" }}
      >
        <path
          d={`M${size} 0 L${size} ${size} L0 ${size}`}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
        />
      </svg>
    </>
  );
}

/* ─── Frosted glass section divider ─── */
function FrostedDivider() {
  return (
    <div
      className="mx-auto my-20 md:my-28"
      style={{
        maxWidth: 1000,
        height: 1,
        background: `linear-gradient(90deg, transparent, ${C.divider}, ${C.brass}40, ${C.divider}, transparent)`,
      }}
    />
  );
}

/* ─── Gallery room number ─── */
function RoomNumber({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <Reveal className="flex items-center gap-4 mb-16 md:mb-20">
      <div
        className="flex items-center gap-3 px-5 py-2.5"
        style={{
          background: C.glassBg,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: `1px solid ${C.glassBorder}`,
          borderRadius: 2,
        }}
      >
        <span
          className="text-[10px] tracking-[0.3em] uppercase font-[family-name:var(--font-jetbrains)]"
          style={{ color: C.brass }}
        >
          {number}
        </span>
        <span
          className="w-px h-3"
          style={{ background: C.divider }}
        />
        <span
          className="text-[10px] tracking-[0.2em] uppercase font-[family-name:var(--font-inter)]"
          style={{ color: C.label }}
        >
          {title}
        </span>
      </div>
      <div
        className="flex-1 h-px"
        style={{
          background: `linear-gradient(90deg, ${C.divider}, transparent)`,
        }}
      />
    </Reveal>
  );
}

/* ─── Accession number ─── */
function accessionNumber(index: number): string {
  return `ACC. 2025.${String(index + 1).padStart(3, "0")}`;
}

/* ─── Track lighting effect (radial gradient from above) ─── */
function TrackLighting({ hover }: { hover?: boolean }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none transition-opacity"
      style={{
        background: `radial-gradient(ellipse 80% 40% at 50% -5%, rgba(255,248,230,${hover ? 0.35 : 0.18}) 0%, transparent 70%)`,
        transitionDuration: "1s",
        transitionTimingFunction: "ease",
      }}
    />
  );
}

/* ─── Glass reflection line ─── */
function GlassReflection() {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ borderRadius: 3 }}
    >
      <div
        className="absolute"
        style={{
          top: "-50%",
          left: "-20%",
          width: "140%",
          height: "200%",
          background: "linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.1) 42%, rgba(255,255,255,0.06) 48%, transparent 50%)",
          transform: "rotate(-5deg)",
        }}
      />
    </div>
  );
}

/* ================================================================
   MAIN PAGE
   ================================================================ */

export default function VitrinePage() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(180deg, ${C.museumWhite} 0%, ${C.gallery} 30%, ${C.warm} 70%, ${C.gallery} 100%)`,
        color: C.charcoal,
      }}
    >
      {/* Subtle gallery texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(184,134,11,0.015) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(27,67,50,0.01) 0%, transparent 50%)`,
        }}
      />

      <div className="relative z-10">
        {/* ════════════════════════════════════════════
            HERO — Exhibition Title Wall
            ════════════════════════════════════════════ */}
        <header
          className="relative overflow-hidden"
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: `linear-gradient(180deg, ${C.museumWhite} 0%, ${C.gallery} 100%)`,
          }}
        >
          {/* Ambient track light from above */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 60% 30% at 50% 0%, rgba(255,248,230,0.4) 0%, transparent 60%)`,
            }}
          />

          {/* Thin brass accent line at top */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent 10%, ${C.brass}50 30%, ${C.brass} 50%, ${C.brass}50 70%, transparent 90%)`,
            }}
          />

          <div className="relative z-10 w-full px-6 md:px-12" style={{ maxWidth: 1000 }}>
            {/* Museum identifier */}
            <motion.div
              className="mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease, delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-8 h-8 flex items-center justify-center"
                  style={{
                    border: `1.5px solid ${C.green}`,
                    borderRadius: 1,
                  }}
                >
                  <span
                    className="text-[10px] font-bold font-[family-name:var(--font-jakarta)]"
                    style={{ color: C.green }}
                  >
                    G
                  </span>
                </div>
                <span
                  className="text-[10px] tracking-[0.35em] uppercase font-[family-name:var(--font-inter)]"
                  style={{ color: C.label }}
                >
                  Grox Museum of Digital Arts
                </span>
              </div>
            </motion.div>

            {/* Exhibition title */}
            <motion.h1
              className="font-[family-name:var(--font-jakarta)] leading-[0.92] mb-8"
              style={{
                fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
                fontWeight: 300,
                color: C.charcoal,
                letterSpacing: "-0.03em",
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, ease, delay: 0.4 }}
            >
              Works in
              <br />
              <span style={{ fontWeight: 500 }}>Digital Media</span>
            </motion.h1>

            {/* Exhibition subtitle */}
            <motion.p
              className="font-[family-name:var(--font-inter)] mb-12 max-w-lg"
              style={{
                fontSize: "clamp(0.95rem, 1.2vw, 1.1rem)",
                color: C.label,
                lineHeight: 1.7,
                fontWeight: 400,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease, delay: 0.6 }}
            >
              A curated exhibition of AI-driven applications, full-stack systems,
              and generative platforms. Selected works from the permanent collection,
              2024 &ndash; 2025.
            </motion.p>

            {/* Exhibition metadata */}
            <motion.div
              className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 mb-16"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease, delay: 0.8 }}
            >
              {[
                { label: "Exhibition Dates", value: "Jan 2024 \u2014 Present" },
                { label: "Curator", value: "Grox Design Studio" },
                { label: "Gallery", value: "Rooms 01 \u2013 04" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-1">
                  <span
                    className="text-[9px] tracking-[0.3em] uppercase font-[family-name:var(--font-jetbrains)]"
                    style={{ color: C.labelLight }}
                  >
                    {item.label}
                  </span>
                  <span
                    className="text-[13px] font-[family-name:var(--font-inter)]"
                    style={{ color: C.charcoal }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Stats as institutional metrics */}
            <motion.div
              className="flex items-center gap-8 sm:gap-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, ease, delay: 1.0 }}
            >
              {stats.map((stat, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <span
                    className="text-2xl sm:text-3xl font-[family-name:var(--font-jakarta)]"
                    style={{
                      fontWeight: 300,
                      color: C.green,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {stat.value}
                  </span>
                  <span
                    className="text-[10px] tracking-[0.2em] uppercase font-[family-name:var(--font-inter)]"
                    style={{ color: C.labelLight }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            <span
              className="text-[9px] tracking-[0.3em] uppercase font-[family-name:var(--font-jetbrains)]"
              style={{ color: C.labelLight }}
            >
              Scroll to Enter
            </span>
            <motion.div
              className="w-px h-8"
              style={{ background: C.brass }}
              animate={{ scaleY: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </header>

        {/* Frosted divider after hero */}
        <FrostedDivider />

        {/* ════════════════════════════════════════════
            PROJECTS — Gallery 01
            ════════════════════════════════════════════ */}
        <section className="px-6 md:px-12 mx-auto" style={{ maxWidth: 1000 }}>
          <RoomNumber number="Gallery 01" title="Permanent Collection" />

          <div className="flex flex-col" style={{ gap: 100 }}>
            {projects.map((project, i) => (
              <ProjectVitrine key={i} project={project} index={i} />
            ))}
          </div>
        </section>

        <FrostedDivider />

        {/* ════════════════════════════════════════════
            EXPERTISE — Gallery 02
            ════════════════════════════════════════════ */}
        <section className="px-6 md:px-12 mx-auto" style={{ maxWidth: 1000 }}>
          <RoomNumber number="Gallery 02" title="Areas of Practice" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {expertise.map((exp, i) => (
              <ExpertiseVitrine key={i} item={exp} index={i} />
            ))}
          </div>
        </section>

        <FrostedDivider />

        {/* ════════════════════════════════════════════
            TOOLS — Gallery 03
            ════════════════════════════════════════════ */}
        <section className="px-6 md:px-12 mx-auto" style={{ maxWidth: 1000 }}>
          <RoomNumber number="Gallery 03" title="Materials & Instruments" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, i) => (
              <ToolVitrine key={i} tool={tool} index={i} />
            ))}
          </div>
        </section>

        <FrostedDivider />

        {/* ════════════════════════════════════════════
            FOOTER — Gallery 04 / Visitor Information
            ════════════════════════════════════════════ */}
        <footer className="px-6 md:px-12 mx-auto pb-32" style={{ maxWidth: 1000 }}>
          <RoomNumber number="Gallery 04" title="Visitor Information" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mb-20">
            {/* Hours */}
            <Reveal delay={0}>
              <GlassCard>
                <div className="p-8">
                  <span
                    className="text-[9px] tracking-[0.3em] uppercase font-[family-name:var(--font-jetbrains)] block mb-5"
                    style={{ color: C.brass }}
                  >
                    Museum Hours
                  </span>
                  <div className="space-y-2.5">
                    {[
                      { day: "Monday \u2013 Friday", time: "Available 24/7" },
                      { day: "Saturday \u2013 Sunday", time: "Available 24/7" },
                      { day: "Public Holidays", time: "Available 24/7" },
                    ].map((row) => (
                      <div key={row.day} className="flex justify-between items-baseline">
                        <span
                          className="text-[12px] font-[family-name:var(--font-inter)]"
                          style={{ color: C.label }}
                        >
                          {row.day}
                        </span>
                        <span
                          className="text-[12px] font-[family-name:var(--font-inter)]"
                          style={{ color: C.charcoal }}
                        >
                          {row.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </Reveal>

            {/* Location */}
            <Reveal delay={0.1}>
              <GlassCard>
                <div className="p-8">
                  <span
                    className="text-[9px] tracking-[0.3em] uppercase font-[family-name:var(--font-jetbrains)] block mb-5"
                    style={{ color: C.brass }}
                  >
                    Location
                  </span>
                  <div className="space-y-2.5">
                    <p
                      className="text-[12px] font-[family-name:var(--font-inter)] leading-relaxed"
                      style={{ color: C.label }}
                    >
                      The Internet
                      <br />
                      World Wide Web
                      <br />
                      Digital District
                    </p>
                    <p
                      className="text-[12px] font-[family-name:var(--font-inter)] mt-4"
                      style={{ color: C.charcoal }}
                    >
                      Admission: Free
                    </p>
                  </div>
                </div>
              </GlassCard>
            </Reveal>

            {/* Membership */}
            <Reveal delay={0.2}>
              <GlassCard>
                <div className="p-8">
                  <span
                    className="text-[9px] tracking-[0.3em] uppercase font-[family-name:var(--font-jetbrains)] block mb-5"
                    style={{ color: C.brass }}
                  >
                    Membership
                  </span>
                  <div className="space-y-2.5">
                    <p
                      className="text-[12px] font-[family-name:var(--font-inter)] leading-relaxed"
                      style={{ color: C.label }}
                    >
                      Become a patron of digital arts.
                      Exclusive access to new exhibitions,
                      behind-the-scenes process, and
                      early previews.
                    </p>
                    <a
                      href="mailto:hello@grox.studio"
                      className="inline-block mt-3 text-[11px] tracking-[0.15em] uppercase font-[family-name:var(--font-inter)] transition-colors duration-500"
                      style={{ color: C.green }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = C.brass)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = C.green)
                      }
                    >
                      Inquire &rarr;
                    </a>
                  </div>
                </div>
              </GlassCard>
            </Reveal>
          </div>

          {/* Museum footer bar */}
          <Reveal>
            <div
              className="pt-10 flex flex-col sm:flex-row items-center justify-between gap-4"
              style={{
                borderTop: `1px solid ${C.divider}`,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-6 h-6 flex items-center justify-center"
                  style={{
                    border: `1px solid ${C.green}`,
                    borderRadius: 1,
                  }}
                >
                  <span
                    className="text-[8px] font-bold font-[family-name:var(--font-jakarta)]"
                    style={{ color: C.green }}
                  >
                    G
                  </span>
                </div>
                <span
                  className="text-[10px] tracking-[0.25em] uppercase font-[family-name:var(--font-inter)]"
                  style={{ color: C.label }}
                >
                  Grox Museum of Digital Arts
                </span>
              </div>
              <span
                className="text-[10px] font-[family-name:var(--font-jetbrains)]"
                style={{ color: C.labelLight }}
              >
                &copy; {new Date().getFullYear()} &middot; All rights reserved
              </span>
            </div>
          </Reveal>
        </footer>
      </div>

      <ThemeSwitcher current="/vitrine" variant="light" />
    </div>
  );
}

/* ================================================================
   GLASS CARD — Base glass display component
   ================================================================ */

function GlassCard({
  children,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        background: C.glassBg,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: `1px solid ${C.glassBorder}`,
        borderRadius: 3,
        boxShadow: `0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.5)`,
        ...style,
      }}
    >
      {children}
      <GlassReflection />
      <BrassCorners />
    </div>
  );
}

/* ================================================================
   PROJECT VITRINE — Individual project display case
   ================================================================ */

function ProjectVitrine({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const accNum = accessionNumber(index);
  const titleClean = project.title.replace(/\n/g, " ");

  return (
    <div ref={ref}>
      <GlassReveal delay={0.05}>
        <div
          className="relative group"
          style={{
            background: C.glassBg,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: `1px solid ${C.glassBorder}`,
            borderRadius: 3,
            boxShadow: `0 1px 3px rgba(0,0,0,0.04), 0 12px 48px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.6)`,
            overflow: "hidden",
          }}
        >
          {/* Track lighting */}
          <div className="transition-all duration-1000">
            <TrackLighting />
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
              <TrackLighting hover />
            </div>
          </div>

          {/* Glass reflection line */}
          <GlassReflection />

          {/* Brass corner hardware */}
          <BrassCorners />

          {/* Catalog number (top right) */}
          <div className="absolute top-5 right-5 z-10">
            <span
              className="text-[9px] tracking-[0.2em] font-[family-name:var(--font-jetbrains)]"
              style={{ color: C.brass, opacity: 0.7 }}
            >
              {accNum}
            </span>
          </div>

          {/* Main content area */}
          <div className="relative z-10 p-8 sm:p-10 md:p-12">
            {/* Project image display */}
            <div
              className="relative w-full mb-8 overflow-hidden"
              style={{
                borderRadius: 2,
                aspectRatio: "16/9",
                background: `linear-gradient(135deg, ${C.gallery}, ${C.warm})`,
              }}
            >
              <img
                src={getProjectImage("vitrine", project.image)}
                alt={titleClean}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.02]"
                loading="lazy"
              />
              {/* Image vignette */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  boxShadow: "inset 0 0 80px rgba(0,0,0,0.06)",
                }}
              />
            </div>

            {/* Project title */}
            <h2
              className="font-[family-name:var(--font-jakarta)] mb-4"
              style={{
                fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                fontWeight: 400,
                color: C.charcoal,
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
              }}
            >
              {titleClean}
            </h2>

            {/* Short description */}
            <p
              className="font-[family-name:var(--font-inter)] mb-6 max-w-xl"
              style={{
                fontSize: "0.9rem",
                color: C.label,
                lineHeight: 1.7,
              }}
            >
              {project.description}
            </p>

            {/* Technical details (museum wall text) */}
            <p
              className="font-[family-name:var(--font-inter)] mb-8 max-w-xl"
              style={{
                fontSize: "0.8rem",
                color: C.labelLight,
                lineHeight: 1.7,
                fontStyle: "italic",
              }}
            >
              {project.technical}
            </p>

            {/* Tech stack as materials */}
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 text-[11px] tracking-[0.05em] font-[family-name:var(--font-inter)]"
                  style={{
                    color: C.green,
                    background: C.greenDim,
                    borderRadius: 2,
                    border: `1px solid rgba(27,67,50,0.1)`,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Museum label (below main content) */}
          <LabelReveal>
            <div
              className="relative mx-8 sm:mx-10 md:mx-12 mb-8 sm:mb-10 md:mb-12"
              style={{
                background: `linear-gradient(135deg, ${C.museumWhite}, ${C.gallery})`,
                border: `1px solid ${C.divider}`,
                borderRadius: 2,
                padding: "20px 24px",
              }}
            >
              <BrassCorners />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-6">
                {/* Title */}
                <div>
                  <span
                    className="block text-[8px] tracking-[0.3em] uppercase font-[family-name:var(--font-jetbrains)] mb-1"
                    style={{ color: C.labelLight }}
                  >
                    Title
                  </span>
                  <span
                    className="block text-[12px] font-[family-name:var(--font-jakarta)]"
                    style={{ color: C.charcoal, fontWeight: 500 }}
                  >
                    {titleClean}
                  </span>
                </div>

                {/* Medium / Materials */}
                <div>
                  <span
                    className="block text-[8px] tracking-[0.3em] uppercase font-[family-name:var(--font-jetbrains)] mb-1"
                    style={{ color: C.labelLight }}
                  >
                    Medium
                  </span>
                  <span
                    className="block text-[11px] font-[family-name:var(--font-inter)]"
                    style={{ color: C.label }}
                  >
                    {project.tech.join(", ")}
                  </span>
                </div>

                {/* Date */}
                <div>
                  <span
                    className="block text-[8px] tracking-[0.3em] uppercase font-[family-name:var(--font-jetbrains)] mb-1"
                    style={{ color: C.labelLight }}
                  >
                    Date
                  </span>
                  <span
                    className="block text-[11px] font-[family-name:var(--font-inter)]"
                    style={{ color: C.label }}
                  >
                    {project.year}
                  </span>
                </div>

                {/* Acquisition */}
                <div>
                  <span
                    className="block text-[8px] tracking-[0.3em] uppercase font-[family-name:var(--font-jetbrains)] mb-1"
                    style={{ color: C.labelLight }}
                  >
                    Accession No.
                  </span>
                  <span
                    className="block text-[11px] font-[family-name:var(--font-jetbrains)]"
                    style={{ color: C.brass }}
                  >
                    {accNum}
                  </span>
                </div>
              </div>

              {/* Client / Sector */}
              <div
                className="mt-4 pt-3"
                style={{ borderTop: `1px solid ${C.divider}` }}
              >
                <span
                  className="text-[8px] tracking-[0.3em] uppercase font-[family-name:var(--font-jetbrains)]"
                  style={{ color: C.labelLight }}
                >
                  Sector:{" "}
                </span>
                <span
                  className="text-[11px] font-[family-name:var(--font-inter)]"
                  style={{ color: C.label }}
                >
                  {project.client}
                </span>
                <span
                  className="mx-3 text-[10px]"
                  style={{ color: C.labelLight }}
                >
                  |
                </span>
                <span
                  className="text-[8px] tracking-[0.3em] uppercase font-[family-name:var(--font-jetbrains)]"
                  style={{ color: C.labelLight }}
                >
                  Source:{" "}
                </span>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-[family-name:var(--font-inter)] transition-colors duration-500"
                  style={{ color: C.green }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = C.brass)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = C.green)
                  }
                >
                  View Repository &rarr;
                </a>
              </div>
            </div>
          </LabelReveal>
        </div>
      </GlassReveal>
    </div>
  );
}

/* ================================================================
   EXPERTISE VITRINE — Knowledge area display
   ================================================================ */

function ExpertiseVitrine({
  item,
  index,
}: {
  item: (typeof expertise)[number];
  index: number;
}) {
  return (
    <GlassReveal delay={index * 0.08}>
      <div
        className="relative group h-full"
        style={{
          background: C.glassBg,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: `1px solid ${C.glassBorder}`,
          borderRadius: 3,
          boxShadow: `0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.5)`,
          overflow: "hidden",
        }}
      >
        {/* Track lighting */}
        <TrackLighting />
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
          <TrackLighting hover />
        </div>

        {/* Glass reflection */}
        <GlassReflection />

        {/* Brass corners */}
        <BrassCorners />

        {/* Content */}
        <div className="relative z-10 p-8 md:p-10">
          {/* Catalog reference */}
          <span
            className="text-[9px] tracking-[0.25em] font-[family-name:var(--font-jetbrains)] block mb-6"
            style={{ color: C.brass, opacity: 0.7 }}
          >
            REF. {String(index + 1).padStart(2, "0")}.000
          </span>

          <h3
            className="font-[family-name:var(--font-jakarta)] mb-5"
            style={{
              fontSize: "1.25rem",
              fontWeight: 400,
              color: C.charcoal,
              letterSpacing: "-0.01em",
              lineHeight: 1.25,
            }}
          >
            {item.title}
          </h3>

          <p
            className="font-[family-name:var(--font-inter)]"
            style={{
              fontSize: "0.85rem",
              color: C.label,
              lineHeight: 1.7,
            }}
          >
            {item.body}
          </p>

          {/* Subtle bottom brass line */}
          <div
            className="mt-8 h-px"
            style={{
              background: `linear-gradient(90deg, ${C.brass}40, transparent)`,
            }}
          />
        </div>
      </div>
    </GlassReveal>
  );
}

/* ================================================================
   TOOL VITRINE — Instrument / material display
   ================================================================ */

function ToolVitrine({
  tool,
  index,
}: {
  tool: (typeof tools)[number];
  index: number;
}) {
  return (
    <GlassReveal delay={index * 0.06}>
      <div
        className="relative group h-full"
        style={{
          background: C.glassBg,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: `1px solid ${C.glassBorder}`,
          borderRadius: 3,
          boxShadow: `0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.5)`,
          overflow: "hidden",
        }}
      >
        {/* Track lighting */}
        <TrackLighting />
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
          <TrackLighting hover />
        </div>

        {/* Glass reflection */}
        <GlassReflection />

        {/* Brass corners */}
        <BrassCorners />

        {/* Content */}
        <div className="relative z-10 p-7 md:p-8">
          {/* Category label */}
          <div className="flex items-center justify-between mb-6">
            <span
              className="text-[9px] tracking-[0.3em] uppercase font-[family-name:var(--font-jetbrains)]"
              style={{ color: C.brass }}
            >
              {tool.label}
            </span>
            <span
              className="text-[9px] font-[family-name:var(--font-jetbrains)]"
              style={{ color: C.labelLight }}
            >
              CAT. {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          {/* Tool items */}
          <div className="space-y-3">
            {tool.items.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 group/item"
              >
                {/* Small brass dot indicator */}
                <div
                  className="w-1 h-1 rounded-full flex-shrink-0 transition-all duration-700 group-hover/item:scale-150"
                  style={{ background: C.brass }}
                />
                <span
                  className="text-[13px] font-[family-name:var(--font-inter)] transition-colors duration-500"
                  style={{ color: C.charcoal }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>

          {/* Item count */}
          <div
            className="mt-6 pt-4 flex items-center justify-between"
            style={{ borderTop: `1px solid ${C.divider}` }}
          >
            <span
              className="text-[9px] tracking-[0.2em] font-[family-name:var(--font-jetbrains)]"
              style={{ color: C.labelLight }}
            >
              {tool.items.length} instruments
            </span>
            <span
              className="text-[9px] font-[family-name:var(--font-jetbrains)]"
              style={{ color: C.labelLight }}
            >
              IN USE
            </span>
          </div>
        </div>
      </div>
    </GlassReveal>
  );
}
