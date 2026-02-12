"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { getProjectImage } from "@/lib/theme-images";

/* ─── Color Palette ─── */
const C = {
  bg: "#F5F0E8",
  cream: "#FDF8F0",
  clay: "#C4A882",
  clayDark: "#8B7355",
  gold: "#D4A843",
  goldGlow: "rgba(212,168,67,0.3)",
  charcoal: "#2C2420",
  charcoalMuted: "rgba(44,36,32,0.5)",
  charcoalLight: "rgba(44,36,32,0.06)",
  crackle: "rgba(212,168,67,0.15)",
  warmWhite: "#FAF7F2",
};

/* ─── Kintsugi Crack SVG Path ─── */
function KintsugiCrack({
  d,
  width = 300,
  height = 200,
  delay = 0,
  strokeWidth = 2,
  className = "",
}: {
  d: string;
  width?: number;
  height?: number;
  delay?: number;
  strokeWidth?: number;
  className?: string;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      className={className}
      style={{ overflow: "visible" }}
    >
      <defs>
        <filter id={`glow-${delay}`}>
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Gold glow under-layer */}
      <motion.path
        d={d}
        stroke={C.goldGlow}
        strokeWidth={strokeWidth + 3}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 0.6 } : {}}
        transition={{ duration: 1.8, delay: delay + 0.1, ease: "easeInOut" }}
      />
      {/* Main gold line */}
      <motion.path
        d={d}
        stroke={C.gold}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={isInView ? { pathLength: 1 } : {}}
        transition={{ duration: 1.6, delay, ease: "easeInOut" }}
      />
    </svg>
  );
}

/* ─── Gold Seam Divider ─── */
function GoldSeam({ variant = "wide" }: { variant?: "wide" | "narrow" }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });
  const crackPath =
    variant === "wide"
      ? "M0,12 Q80,4 160,14 T320,10 Q400,6 480,13 T640,9 Q720,15 800,11 T960,12"
      : "M0,8 Q60,3 120,10 T240,7 Q300,12 360,6 T480,9";

  return (
    <div ref={ref} className="relative w-full flex justify-center" style={{ padding: "40px 0" }}>
      <svg
        width="100%"
        height="24"
        viewBox={variant === "wide" ? "0 0 960 24" : "0 0 480 18"}
        preserveAspectRatio="none"
        fill="none"
        style={{ maxWidth: variant === "wide" ? 960 : 480 }}
      >
        <motion.path
          d={crackPath}
          stroke={C.gold}
          strokeWidth={1.5}
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <motion.path
          d={crackPath}
          stroke={C.goldGlow}
          strokeWidth={4}
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 0.4 } : {}}
          transition={{ duration: 2.2, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}

/* ─── Pottery Chop Mark (Stamp) ─── */
function PotteryChop({ size = 40, label = "" }: { size?: number; label?: string }) {
  return (
    <div
      className="inline-flex items-center justify-center"
      style={{
        width: size,
        height: size,
        border: `1.5px solid ${C.clay}`,
        borderRadius: "6px",
        transform: "rotate(-3deg)",
        fontFamily: "var(--font-dm-serif)",
        fontSize: size * 0.35,
        color: C.clayDark,
        opacity: 0.7,
        letterSpacing: "0.05em",
      }}
    >
      {label || "陶"}
    </div>
  );
}

/* ─── Crackle Glaze Texture Overlay ─── */
function CrackleTexture({ opacity = 0.04 }: { opacity?: number }) {
  return (
    <svg
      width="100%"
      height="100%"
      style={{ position: "absolute", inset: 0, opacity, pointerEvents: "none" }}
    >
      <defs>
        <filter id="crackle-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" seed="2" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="discrete" tableValues="0 0 0 0 0 1 0 0 0 1 0 0" />
          </feComponentTransfer>
        </filter>
      </defs>
      <rect width="100%" height="100%" filter="url(#crackle-noise)" fill={C.clayDark} />
    </svg>
  );
}

/* ─── Section Heading ─── */
function SectionHeading({
  title,
  chopLabel,
}: {
  title: string;
  chopLabel?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="flex items-center gap-4 mb-12"
    >
      <PotteryChop size={36} label={chopLabel} />
      <h2
        style={{
          fontFamily: "var(--font-dm-serif)",
          fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
          color: C.charcoal,
          letterSpacing: "-0.01em",
          lineHeight: 1.15,
        }}
      >
        {title}
      </h2>
    </motion.div>
  );
}

/* ─── Stat Counter ─── */
function StatItem({ value, label, delay }: { value: string; label: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="text-center"
    >
      <div
        style={{
          fontFamily: "var(--font-dm-serif)",
          fontSize: "clamp(2rem, 5vw, 3rem)",
          color: C.gold,
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: "0.8rem",
          color: C.charcoalMuted,
          marginTop: 6,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        {label}
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   NAVIGATION
   ══════════════════════════════════════════════ */
function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: scrolled ? "12px 0" : "20px 0",
        background: scrolled ? "rgba(245,240,232,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.crackle}` : "1px solid transparent",
        transition: "all 0.4s ease",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div className="flex items-center gap-3">
          <PotteryChop size={32} label="金" />
          <span
            style={{
              fontFamily: "var(--font-dm-serif)",
              fontSize: "1.15rem",
              color: C.charcoal,
              letterSpacing: "0.02em",
            }}
          >
            Portfolio
          </span>
        </div>

        <div className="flex items-center gap-8">
          {["Work", "Expertise", "Tools"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "0.85rem",
                color: C.charcoalMuted,
                textDecoration: "none",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                transition: "color 0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.gold)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.charcoalMuted)}
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}

/* ══════════════════════════════════════════════
   HERO SECTION
   ══════════════════════════════════════════════ */
function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={containerRef}
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(180deg, ${C.cream} 0%, ${C.bg} 100%)`,
        overflow: "hidden",
      }}
    >
      <CrackleTexture opacity={0.03} />

      {/* Decorative kintsugi cracks */}
      <div style={{ position: "absolute", top: "10%", left: "5%", opacity: 0.5 }}>
        <KintsugiCrack
          d="M0,40 Q30,10 60,45 T120,30 Q150,60 180,25 T240,50"
          width={240}
          height={80}
          delay={0.4}
          strokeWidth={1.5}
        />
      </div>
      <div style={{ position: "absolute", bottom: "15%", right: "8%", opacity: 0.5 }}>
        <KintsugiCrack
          d="M0,20 Q50,50 100,15 T200,40 Q230,10 280,35"
          width={280}
          height={70}
          delay={0.8}
          strokeWidth={1.5}
        />
      </div>
      <div style={{ position: "absolute", top: "45%", right: "3%", opacity: 0.35 }}>
        <KintsugiCrack
          d="M0,60 L15,30 L40,55 L60,10 L80,45"
          width={80}
          height={70}
          delay={1.2}
          strokeWidth={1.2}
        />
      </div>
      <div style={{ position: "absolute", top: "30%", left: "2%", opacity: 0.3 }}>
        <KintsugiCrack
          d="M0,10 L20,50 L35,20 L55,60"
          width={60}
          height={70}
          delay={1.5}
          strokeWidth={1.2}
        />
      </div>

      {/* Central ceramic vessel silhouette */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.crackle} 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      <motion.div style={{ y, opacity }} className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <PotteryChop size={52} label="金継" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "0.8rem",
            textTransform: "uppercase",
            letterSpacing: "0.25em",
            color: C.clay,
            marginBottom: 20,
          }}
        >
          Kintsugi Portfolio
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{
            fontFamily: "var(--font-dm-serif)",
            fontSize: "clamp(2.4rem, 7vw, 4.5rem)",
            color: C.charcoal,
            lineHeight: 1.1,
            maxWidth: 700,
            margin: "0 auto",
            letterSpacing: "-0.02em",
          }}
        >
          Beauty in the
          <br />
          <span style={{ color: C.gold }}>broken</span> &{" "}
          <span style={{ color: C.gold }}>rebuilt</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "clamp(0.95rem, 2vw, 1.15rem)",
            color: C.charcoalMuted,
            maxWidth: 520,
            margin: "24px auto 0",
            lineHeight: 1.7,
          }}
        >
          Like kintsugi, I find beauty in bringing the pieces together
          — crafting digital experiences where every crack is filled with gold.
        </motion.p>

        {/* Hero kintsugi decoration below text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-10 flex justify-center"
        >
          <KintsugiCrack
            d="M0,25 Q40,5 80,28 T160,20 Q200,35 240,15 T320,25"
            width={320}
            height={50}
            delay={1.4}
            strokeWidth={2}
          />
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.3 }}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "clamp(32px, 6vw, 64px)",
            marginTop: 48,
          }}
        >
          {stats.map((s: { value: string; label: string }, i: number) => (
            <StatItem key={s.label} value={s.value} label={s.label} delay={1.4 + i * 0.15} />
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
        style={{
          position: "absolute",
          bottom: 36,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "0.65rem",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            color: C.clay,
          }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: 1.5,
            height: 24,
            background: `linear-gradient(to bottom, ${C.clay}, transparent)`,
            borderRadius: 1,
          }}
        />
      </motion.div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   PROJECT CARD
   ══════════════════════════════════════════════ */
function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);

  /* Generate a unique crack path per card */
  const crackPaths = [
    "M0,0 Q15,8 8,20 L22,35 Q30,28 35,45",
    "M40,0 L35,12 Q42,18 38,30 L45,42",
    "M0,15 Q12,10 20,22 L15,38 Q25,42 30,50",
    "M45,5 L38,18 Q44,25 40,35 L48,48",
  ];
  const cardCrack = crackPaths[index % crackPaths.length];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        borderRadius: 24,
        overflow: "hidden",
        background: C.cream,
        border: `1px solid ${hovered ? C.gold : C.charcoalLight}`,
        boxShadow: hovered
          ? `0 20px 60px rgba(44,36,32,0.1), 0 0 30px ${C.goldGlow}`
          : "0 4px 20px rgba(44,36,32,0.04)",
        transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        cursor: "pointer",
      }}
    >
      {/* Kintsugi crack decoration on card */}
      <svg
        width="50"
        height="50"
        viewBox="0 0 50 50"
        fill="none"
        style={{
          position: "absolute",
          top: -2,
          right: -2,
          zIndex: 2,
          opacity: hovered ? 0.8 : 0.3,
          transition: "opacity 0.4s",
        }}
      >
        <path
          d={cardCrack}
          stroke={C.gold}
          strokeWidth={1.5}
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {/* Image area */}
      <div
        style={{
          position: "relative",
          height: 220,
          background: `linear-gradient(135deg, ${C.charcoalLight} 0%, ${C.bg} 100%)`,
          overflow: "hidden",
        }}
      >
        {project.image && (
          <motion.img
            src={getProjectImage("ceramic", project.image)}
            alt={project.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              scale: hovered ? 1.05 : 1,
              transition: "scale 0.6s cubic-bezier(0.16,1,0.3,1)",
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(to top, ${C.cream} 0%, transparent 40%)`,
          }}
        />

        {/* Year badge */}
        <div
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            background: "rgba(253,248,240,0.9)",
            backdropFilter: "blur(8px)",
            borderRadius: 12,
            padding: "4px 12px",
            fontFamily: "var(--font-inter)",
            fontSize: "0.7rem",
            color: C.clayDark,
            letterSpacing: "0.06em",
          }}
        >
          {project.year}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "20px 24px 24px" }}>
        <div
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "0.7rem",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: C.clay,
            marginBottom: 6,
          }}
        >
          {project.client}
        </div>

        <h3
          style={{
            fontFamily: "var(--font-dm-serif)",
            fontSize: "1.3rem",
            color: C.charcoal,
            lineHeight: 1.25,
            marginBottom: 10,
          }}
        >
          {project.title}
        </h3>

        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "0.85rem",
            color: C.charcoalMuted,
            lineHeight: 1.65,
            marginBottom: 16,
          }}
        >
          {project.description}
        </p>

        {/* Tech tags as ceramic glaze chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech.map((t: string) => (
            <span
              key={t}
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "0.68rem",
                padding: "3px 10px",
                borderRadius: 20,
                background: C.charcoalLight,
                color: C.clayDark,
                letterSpacing: "0.03em",
                border: `1px solid ${C.crackle}`,
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Technical note */}
        {project.technical && (
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.75rem",
              color: C.charcoalMuted,
              lineHeight: 1.6,
              fontStyle: "italic",
              borderLeft: `2px solid ${C.gold}`,
              paddingLeft: 12,
              marginBottom: 16,
            }}
          >
            {project.technical}
          </p>
        )}

        {/* Footer with github link */}
        <div className="flex items-center justify-between">
          <div
            style={{
              width: 32,
              height: 1.5,
              background: `linear-gradient(to right, ${C.gold}, transparent)`,
              borderRadius: 1,
            }}
          />
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "0.72rem",
                color: C.gold,
                textDecoration: "none",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                transition: "opacity 0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              View Source
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   PROJECTS SECTION
   ══════════════════════════════════════════════ */
function ProjectsSection() {
  return (
    <section
      id="work"
      style={{
        position: "relative",
        padding: "80px 24px 60px",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      <SectionHeading title="Selected Works" chopLabel="作" />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: 32,
        }}
      >
        {projects.map(
          (
            p: {
              title: string;
              image: string;
              client: string;
              year: string;
              description: string;
              technical: string;
              tech: string[];
              github: string;
            },
            i: number,
          ) => (
            <ProjectCard key={p.title} project={p} index={i} />
          ),
        )}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   EXPERTISE SECTION
   ══════════════════════════════════════════════ */
function ExpertiseSection() {
  return (
    <section
      id="expertise"
      style={{
        position: "relative",
        padding: "60px 24px 80px",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      <SectionHeading title="Expertise" chopLabel="技" />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 24,
        }}
      >
        {expertise.map((e: { title: string; body: string }, i: number) => (
          <ExpertiseCard key={e.title} item={e} index={i} />
        ))}
      </div>
    </section>
  );
}

function ExpertiseCard({
  item,
  index,
}: {
  item: { title: string; body: string };
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        borderRadius: 28,
        padding: "32px 28px",
        background: hovered
          ? `linear-gradient(145deg, ${C.cream} 0%, ${C.warmWhite} 100%)`
          : `linear-gradient(145deg, ${C.warmWhite} 0%, ${C.bg} 100%)`,
        border: `1px solid ${hovered ? C.crackle : C.charcoalLight}`,
        boxShadow: hovered
          ? `0 12px 40px rgba(44,36,32,0.06), inset 0 1px 0 ${C.goldGlow}`
          : "0 2px 12px rgba(44,36,32,0.02)",
        transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
        overflow: "hidden",
      }}
    >
      <CrackleTexture opacity={0.02} />

      {/* Kiln-fired glow on hover */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(to right, transparent, ${C.gold}, transparent)`,
          opacity: hovered ? 0.6 : 0,
          transition: "opacity 0.4s",
          borderRadius: "28px 28px 0 0",
        }}
      />

      {/* Vertical gold seam accent */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: "20%",
          bottom: "20%",
          width: 2,
          background: `linear-gradient(to bottom, transparent, ${C.gold}, transparent)`,
          opacity: hovered ? 0.5 : 0.15,
          transition: "opacity 0.4s",
        }}
      />

      <div className="relative z-10">
        <div
          style={{
            fontFamily: "var(--font-dm-serif)",
            fontSize: "0.7rem",
            color: C.gold,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: 10,
            opacity: 0.8,
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </div>

        <h3
          style={{
            fontFamily: "var(--font-dm-serif)",
            fontSize: "1.25rem",
            color: C.charcoal,
            lineHeight: 1.3,
            marginBottom: 12,
          }}
        >
          {item.title}
        </h3>

        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "0.85rem",
            color: C.charcoalMuted,
            lineHeight: 1.7,
          }}
        >
          {item.body}
        </p>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   TOOLS SECTION
   ══════════════════════════════════════════════ */
function ToolsSection() {
  return (
    <section
      id="tools"
      style={{
        position: "relative",
        padding: "60px 24px 80px",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      <SectionHeading title="Glaze Recipes" chopLabel="釉" />

      <p
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: "0.9rem",
          color: C.charcoalMuted,
          maxWidth: 500,
          lineHeight: 1.7,
          marginBottom: 40,
          marginTop: -20,
        }}
      >
        The tools and technologies I use to shape each project, layered like glazes on pottery.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 24,
        }}
      >
        {tools.map((tool: { label: string; items: string[] }, i: number) => (
          <ToolCard key={tool.label} tool={tool} index={i} />
        ))}
      </div>
    </section>
  );
}

function ToolCard({
  tool,
  index,
}: {
  tool: { label: string; items: string[] };
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 25 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 24,
        padding: "28px 24px",
        background: C.cream,
        border: `1px solid ${hovered ? C.clay : C.charcoalLight}`,
        boxShadow: hovered
          ? `0 8px 32px rgba(44,36,32,0.06)`
          : "0 2px 10px rgba(44,36,32,0.02)",
        transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Corner kintsugi accent */}
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        style={{
          position: "absolute",
          bottom: -4,
          left: -4,
          opacity: hovered ? 0.6 : 0.2,
          transition: "opacity 0.4s",
        }}
      >
        <path
          d="M0,40 Q10,30 8,20 T15,5"
          stroke={C.gold}
          strokeWidth={1.2}
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      <div
        style={{
          fontFamily: "var(--font-dm-serif)",
          fontSize: "1.05rem",
          color: C.charcoal,
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: C.gold,
            opacity: 0.7,
          }}
        />
        {tool.label}
      </div>

      <div className="flex flex-wrap gap-2">
        {tool.items.map((item: string) => (
          <span
            key={item}
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.73rem",
              padding: "4px 12px",
              borderRadius: 16,
              background: C.bg,
              color: C.clayDark,
              border: `1px solid ${C.charcoalLight}`,
              letterSpacing: "0.02em",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = C.gold;
              e.currentTarget.style.background = C.warmWhite;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = C.charcoalLight;
              e.currentTarget.style.background = C.bg;
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   FOOTER
   ══════════════════════════════════════════════ */
function Footer() {
  return (
    <footer
      style={{
        position: "relative",
        padding: "60px 24px 48px",
        background: `linear-gradient(180deg, ${C.bg} 0%, ${C.warmWhite} 100%)`,
        overflow: "hidden",
      }}
    >
      <CrackleTexture opacity={0.025} />

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Decorative kintsugi top border */}
        <KintsugiCrack
          d="M0,15 Q60,5 120,18 T240,12 Q300,20 360,10 T480,16"
          width={480}
          height={30}
          delay={0}
          strokeWidth={1.5}
        />

        {/* Pottery chop mark signature */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-10 mb-8"
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                border: `2px solid ${C.clay}`,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: "rotate(-5deg)",
                position: "relative",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-dm-serif)",
                  fontSize: "1.4rem",
                  color: C.clayDark,
                }}
              >
                金継
              </span>
              {/* Inner border for chop authenticity */}
              <div
                style={{
                  position: "absolute",
                  inset: 3,
                  border: `1px solid ${C.clay}`,
                  borderRadius: 5,
                  opacity: 0.4,
                }}
              />
            </div>

            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "0.75rem",
                color: C.charcoalMuted,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Crafted with care
            </p>
          </div>
        </motion.div>

        <div
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "0.72rem",
            color: C.charcoalMuted,
            textAlign: "center",
            marginBottom: 32,
            lineHeight: 1.8,
          }}
        >
          Every crack tells a story. Every repair adds beauty.
        </div>

        <ThemeSwitcher current="/ceramic" variant="light" />

        <div
          style={{
            marginTop: 32,
            fontFamily: "var(--font-inter)",
            fontSize: "0.65rem",
            color: C.charcoalMuted,
            opacity: 0.6,
          }}
        >
          &copy; {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════════
   PAGE EXPORT
   ══════════════════════════════════════════════ */
export default function CeramicPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        fontFamily: "var(--font-inter)",
        color: C.charcoal,
        overflowX: "hidden",
      }}
    >
      <Navigation />
      <HeroSection />
      <GoldSeam variant="wide" />
      <ProjectsSection />
      <GoldSeam variant="narrow" />
      <ExpertiseSection />
      <GoldSeam variant="wide" />
      <ToolsSection />
      <Footer />
    </div>
  );
}
