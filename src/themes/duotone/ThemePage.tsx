"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "@/app/data/projects";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";

/* ─── Color Palette ─── */
const C = {
  bg: "#F0EBE3",
  blue: "#0050FF",
  blueMuted: "rgba(0,80,255,0.6)",
  blueLight: "rgba(0,80,255,0.1)",
  coral: "#FF5C5C",
  coralMuted: "rgba(255,92,92,0.6)",
  coralLight: "rgba(255,92,92,0.1)",
  overprint: "#7B2D8E",
  dark: "#1A1A1A",
  darkMuted: "rgba(26,26,26,0.5)",
  darkLight: "rgba(26,26,26,0.06)",
  paper: "#F0EBE3",
  shadow1: "rgba(26,26,26,0.06)",
  shadow2: "rgba(26,26,26,0.12)",
};

/* ─── Paper Texture Overlay ─── */
function PaperTexture() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "none",
        opacity: 0.35,
        mixBlendMode: "multiply",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
        backgroundSize: "200px 200px",
      }}
    />
  );
}

/* ─── Halftone Dot Overlay ─── */
function HalftoneOverlay({
  color = C.blue,
  size = 8,
  opacity = 0.08,
  style,
}: {
  color?: string;
  size?: number;
  opacity?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        opacity,
        backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1px)`,
        backgroundSize: `${size}px ${size}px`,
        ...style,
      }}
    />
  );
}

/* ─── Misregistered Text ─── */
function Misregistered({
  children,
  as: Tag = "span",
  offsetX = 2,
  offsetY = 2,
  primaryColor = C.blue,
  secondaryColor = C.coral,
  className = "",
  style,
  hoverShift = false,
}: {
  children: React.ReactNode;
  as?: "span" | "h1" | "h2" | "h3" | "p" | "div";
  offsetX?: number;
  offsetY?: number;
  primaryColor?: string;
  secondaryColor?: string;
  className?: string;
  style?: React.CSSProperties;
  hoverShift?: boolean;
}) {
  return (
    <Tag
      className={`misreg-wrap ${hoverShift ? "misreg-hover" : ""} ${className}`}
      style={{
        position: "relative",
        display: "inline-block",
        ...style,
      }}
    >
      {/* Back layer — secondary color, offset */}
      <span
        aria-hidden
        className="misreg-back"
        style={{
          position: "absolute",
          top: `${offsetY}px`,
          left: `${offsetX}px`,
          color: secondaryColor,
          mixBlendMode: "multiply",
          whiteSpace: "nowrap",
          userSelect: "none",
          transition: "transform 0.3s ease",
        }}
      >
        {children}
      </span>
      {/* Front layer — primary color */}
      <span
        style={{
          position: "relative",
          color: primaryColor,
          mixBlendMode: "multiply",
        }}
      >
        {children}
      </span>
    </Tag>
  );
}

/* ─── Registration Mark SVG ─── */
function RegistrationMark({
  size = 32,
  color = C.dark,
  rotate = false,
  style,
}: {
  size?: number;
  color?: string;
  rotate?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      style={{ ...style, display: "block" }}
      animate={rotate ? { rotate: 360 } : undefined}
      transition={rotate ? { duration: 20, repeat: Infinity, ease: "linear" } : undefined}
    >
      <circle cx="16" cy="16" r="10" stroke={color} strokeWidth="1" fill="none" />
      <circle cx="16" cy="16" r="4" stroke={color} strokeWidth="0.75" fill="none" />
      <line x1="16" y1="0" x2="16" y2="32" stroke={color} strokeWidth="0.5" />
      <line x1="0" y1="16" x2="32" y2="16" stroke={color} strokeWidth="0.5" />
    </motion.svg>
  );
}

/* ─── Ink Splatter Dots ─── */
function InkSplatter({
  count = 6,
  color = C.blue,
  area = { width: 200, height: 200 },
  style,
}: {
  count?: number;
  color?: string;
  area?: { width: number; height: number };
  style?: React.CSSProperties;
}) {
  const dots = Array.from({ length: count }, (_, i) => ({
    cx: ((i * 37 + 13) % area.width),
    cy: ((i * 53 + 7) % area.height),
    r: (i % 3) + 1.5,
  }));

  return (
    <svg
      aria-hidden
      width={area.width}
      height={area.height}
      style={{ position: "absolute", pointerEvents: "none", ...style }}
    >
      {dots.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill={color} opacity={0.4} />
      ))}
    </svg>
  );
}

/* ─── Registration Mark Divider ─── */
function RegistrationDivider() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "48px 0",
        justifyContent: "center",
      }}
    >
      <RegistrationMark size={24} color={C.darkMuted} rotate />
      <div
        style={{
          flex: 1,
          maxWidth: 600,
          height: 1,
          background: `repeating-linear-gradient(90deg, ${C.dark} 0px, ${C.dark} 4px, transparent 4px, transparent 8px)`,
          opacity: 0.15,
        }}
      />
      <RegistrationMark size={24} color={C.darkMuted} rotate />
    </div>
  );
}

/* ─── Section Header ─── */
function SectionHeader({
  label,
  title,
  accent = C.blue,
}: {
  label: string;
  title: string;
  accent?: string;
}) {
  return (
    <div style={{ marginBottom: 48 }}>
      <div
        style={{
          fontFamily: "var(--font-manrope), sans-serif",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: accent,
          marginBottom: 12,
        }}
      >
        {label}
      </div>
      <Misregistered
        as="h2"
        primaryColor={accent}
        secondaryColor={accent === C.blue ? C.coral : C.blue}
        offsetX={2}
        offsetY={2}
        hoverShift
        style={{
          fontFamily: "var(--font-space-grotesk), sans-serif",
          fontSize: "clamp(32px, 5vw, 52px)",
          fontWeight: 700,
          lineHeight: 1.1,
          margin: 0,
        }}
      >
        {title}
      </Misregistered>
    </div>
  );
}

/* ─── Scroll Animation Wrapper ─── */
function Reveal({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   Navigation
   ═══════════════════════════════════════════════════ */
function Navigation() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: C.paper,
        borderBottom: `1px solid ${C.darkLight}`,
      }}
    >
      {/* Halftone accent strip */}
      <div
        style={{
          height: 3,
          backgroundImage: `radial-gradient(circle, ${C.blue} 1px, transparent 1px)`,
          backgroundSize: "6px 3px",
        }}
      />
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <a
          href="#"
          style={{
            textDecoration: "none",
            fontFamily: "var(--font-space-grotesk), sans-serif",
            fontWeight: 700,
            fontSize: 22,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Misregistered primaryColor={C.dark} secondaryColor={C.coral} offsetX={1} offsetY={1}>
            GROX
          </Misregistered>
          <span
            style={{
              fontSize: 9,
              fontWeight: 600,
              color: C.blue,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontFamily: "var(--font-manrope), sans-serif",
            }}
          >
            STUDIO
          </span>
        </a>

        {/* Links */}
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {[
            { label: "Projects", href: "#projects" },
            { label: "Expertise", href: "#expertise" },
            { label: "Tools", href: "#tools" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                textDecoration: "none",
                fontFamily: "var(--font-manrope), sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: C.dark,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                position: "relative",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.blue)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.dark)}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}

/* ═══════════════════════════════════════════════════
   Hero Section
   ═══════════════════════════════════════════════════ */
function HeroSection() {
  const words = ["Printed", "circuits", "of", "intelligence"];
  const colorCycle = [C.blue, C.coral, C.blue, C.coral];
  const secondaryCycle = [C.coral, C.blue, C.coral, C.blue];

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "120px 24px 80px",
        overflow: "hidden",
        background: C.bg,
      }}
    >
      {/* Halftone background */}
      <HalftoneOverlay color={C.blue} size={10} opacity={0.04} />

      {/* Registration marks in corners */}
      <div style={{ position: "absolute", top: 80, left: 24 }}>
        <RegistrationMark size={36} color={C.darkMuted} rotate />
      </div>
      <div style={{ position: "absolute", top: 80, right: 24 }}>
        <RegistrationMark size={36} color={C.darkMuted} rotate />
      </div>
      <div style={{ position: "absolute", bottom: 24, left: 24 }}>
        <RegistrationMark size={36} color={C.darkMuted} rotate />
      </div>
      <div style={{ position: "absolute", bottom: 24, right: 24 }}>
        <RegistrationMark size={36} color={C.darkMuted} rotate />
      </div>

      {/* Ink splatters */}
      <InkSplatter count={8} color={C.coral} style={{ top: 120, right: 60 }} area={{ width: 300, height: 300 }} />
      <InkSplatter count={5} color={C.blue} style={{ bottom: 100, left: 40 }} area={{ width: 250, height: 200 }} />

      {/* Edition label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        style={{
          position: "absolute",
          top: 90,
          right: 80,
          fontFamily: "var(--font-manrope), sans-serif",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: C.darkMuted,
          transform: "rotate(90deg)",
          transformOrigin: "right center",
        }}
      >
        Ed. 1/50 &mdash; Limited Print
      </motion.div>

      {/* Main content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          style={{
            fontFamily: "var(--font-manrope), sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: C.blue,
            marginBottom: 24,
          }}
        >
          AI Engineering &bull; Creative Development
        </motion.div>

        {/* Headline with misregistered words */}
        <h1
          style={{
            fontFamily: "var(--font-space-grotesk), sans-serif",
            fontSize: "clamp(48px, 8vw, 96px)",
            fontWeight: 700,
            lineHeight: 1.05,
            margin: "0 0 32px",
            maxWidth: 900,
          }}
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ display: "inline-block", marginRight: "0.25em" }}
            >
              <Misregistered
                primaryColor={colorCycle[i]}
                secondaryColor={secondaryCycle[i]}
                offsetX={i % 2 === 0 ? 3 : -2}
                offsetY={i % 2 === 0 ? 2 : -2}
                hoverShift
              >
                {word}
              </Misregistered>
            </motion.span>
          ))}
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          style={{
            fontFamily: "var(--font-manrope), sans-serif",
            fontSize: "clamp(16px, 2vw, 20px)",
            lineHeight: 1.6,
            color: C.darkMuted,
            maxWidth: 560,
            margin: "0 0 56px",
          }}
        >
          Layering machine intelligence with bold craft. Each project is a limited
          edition print run of ideas, pressed through the screen of possibility.
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 24,
          }}
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              style={{
                position: "relative",
                padding: "20px 28px",
                background: i % 2 === 0 ? C.blueLight : C.coralLight,
                overflow: "hidden",
              }}
            >
              <HalftoneOverlay
                color={i % 2 === 0 ? C.blue : C.coral}
                size={6}
                opacity={0.12}
              />
              <div
                style={{
                  position: "relative",
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontSize: 28,
                  fontWeight: 700,
                  color: i % 2 === 0 ? C.blue : C.coral,
                  lineHeight: 1,
                  marginBottom: 4,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  position: "relative",
                  fontFamily: "var(--font-manrope), sans-serif",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: C.darkMuted,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        style={{
          position: "absolute",
          bottom: 32,
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
            fontFamily: "var(--font-manrope), sans-serif",
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: C.darkMuted,
          }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ width: 1, height: 24, background: C.darkMuted }}
        />
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   Project Card
   ═══════════════════════════════════════════════════ */
function ProjectCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
  const isBlue = index % 2 === 0;
  const accent = isBlue ? C.blue : C.coral;
  const accentMuted = isBlue ? C.blueMuted : C.coralMuted;
  const accentLight = isBlue ? C.blueLight : C.coralLight;
  const editionNum = index + 1;
  const editionTotal = projects.length;

  return (
    <Reveal delay={index * 0.1}>
      <motion.article
        whileHover={{
          y: -4,
          boxShadow: `6px 6px 0px ${accent}`,
        }}
        transition={{ duration: 0.25 }}
        style={{
          position: "relative",
          background: "#FFFFFF",
          border: `1px solid ${C.darkLight}`,
          boxShadow: `3px 3px 0px ${accentMuted}`,
          overflow: "hidden",
          cursor: "pointer",
        }}
      >
        {/* Image area with halftone overlay */}
        <div
          style={{
            position: "relative",
            height: 200,
            background: accentLight,
            overflow: "hidden",
          }}
        >
          <HalftoneOverlay color={accent} size={8} opacity={0.15} />

          {/* Color separation stripes */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `repeating-linear-gradient(
                -45deg,
                transparent,
                transparent 20px,
                ${accent} 20px,
                ${accent} 21px
              )`,
              opacity: 0.06,
            }}
          />

          {/* Project title overlay */}
          <div
            style={{
              position: "absolute",
              bottom: 16,
              left: 16,
              right: 16,
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: accent,
            }}
          >
            {project.client}
          </div>

          {/* Edition number */}
          <div
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              fontFamily: "var(--font-manrope), sans-serif",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.15em",
              color: accent,
              background: "#FFFFFF",
              padding: "4px 10px",
              border: `1px solid ${accent}`,
            }}
          >
            Ed. {editionNum}/{editionTotal}
          </div>
        </div>

        {/* Card body */}
        <div style={{ padding: "20px 20px 24px" }}>
          <h3
            style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontSize: 18,
              fontWeight: 700,
              lineHeight: 1.3,
              color: C.dark,
              margin: "0 0 8px",
            }}
          >
            <Misregistered
              primaryColor={C.dark}
              secondaryColor={accent}
              offsetX={1}
              offsetY={1}
            >
              {project.title}
            </Misregistered>
          </h3>

          <p
            style={{
              fontFamily: "var(--font-manrope), sans-serif",
              fontSize: 13,
              lineHeight: 1.6,
              color: C.darkMuted,
              margin: "0 0 16px",
            }}
          >
            {project.description}
          </p>

          {/* Tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {project.tech.slice(0, 3).map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: "var(--font-manrope), sans-serif",
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: accent,
                  background: accentLight,
                  padding: "3px 8px",
                  border: `1px solid ${accentLight}`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom registration line */}
        <div
          style={{
            height: 2,
            backgroundImage: `radial-gradient(circle, ${accent} 1px, transparent 1px)`,
            backgroundSize: "4px 2px",
          }}
        />
      </motion.article>
    </Reveal>
  );
}

/* ─── Projects Section ─── */
function ProjectsSection() {
  return (
    <section
      id="projects"
      style={{
        position: "relative",
        padding: "80px 24px",
        background: C.bg,
        overflow: "hidden",
      }}
    >
      <HalftoneOverlay color={C.coral} size={12} opacity={0.03} />

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
        {/* Registration marks */}
        <InkSplatter count={4} color={C.blue} style={{ top: -20, right: 0 }} area={{ width: 150, height: 100 }} />

        <SectionHeader label="Print Editions" title="Selected Works" accent={C.blue} />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 32,
          }}
        >
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>

        {/* Colophon */}
        <Reveal delay={0.2}>
          <div
            style={{
              marginTop: 48,
              padding: "16px 24px",
              background: C.darkLight,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontFamily: "var(--font-manrope), sans-serif",
              fontSize: 11,
              color: C.darkMuted,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            <span>Total editions: {projects.length}</span>
            <span>Riso printed on {C.paper} stock</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   Expertise Section
   ═══════════════════════════════════════════════════ */
function ExpertiseSection() {
  return (
    <section
      id="expertise"
      style={{
        position: "relative",
        padding: "80px 24px",
        background: C.bg,
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
        <SectionHeader
          label="Color Separations"
          title="Areas of Expertise"
          accent={C.coral}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: 24,
          }}
        >
          {expertise.map((item, i) => {
            const isBlue = i % 2 === 0;
            const accent = isBlue ? C.blue : C.coral;
            const accentLight = isBlue ? C.blueLight : C.coralLight;

            return (
              <Reveal key={item.title} delay={i * 0.08}>
                <motion.div
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: "relative",
                    display: "flex",
                    background: "#FFFFFF",
                    border: `1px solid ${C.darkLight}`,
                    overflow: "hidden",
                  }}
                >
                  {/* Color separation bar */}
                  <div
                    style={{
                      width: 6,
                      background: accent,
                      flexShrink: 0,
                      position: "relative",
                    }}
                  >
                    <HalftoneOverlay color="#FFFFFF" size={4} opacity={0.3} />
                  </div>

                  {/* Content */}
                  <div style={{ padding: "20px 24px", flex: 1, position: "relative" }}>
                    <HalftoneOverlay color={accent} size={10} opacity={0.03} />

                    {/* Layer number */}
                    <div
                      style={{
                        position: "absolute",
                        top: 12,
                        right: 16,
                        fontFamily: "var(--font-space-grotesk), sans-serif",
                        fontSize: 32,
                        fontWeight: 700,
                        color: accentLight,
                        lineHeight: 1,
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>

                    <h3
                      style={{
                        fontFamily: "var(--font-space-grotesk), sans-serif",
                        fontSize: 17,
                        fontWeight: 700,
                        color: C.dark,
                        margin: "0 0 8px",
                        position: "relative",
                      }}
                    >
                      <Misregistered
                        primaryColor={C.dark}
                        secondaryColor={accent}
                        offsetX={1}
                        offsetY={1}
                      >
                        {item.title}
                      </Misregistered>
                    </h3>

                    <p
                      style={{
                        fontFamily: "var(--font-manrope), sans-serif",
                        fontSize: 13,
                        lineHeight: 1.6,
                        color: C.darkMuted,
                        margin: "0 0 14px",
                        position: "relative",
                      }}
                    >
                      {item.body}
                    </p>

                    {/* Layer index */}
                    <div
                      style={{
                        fontFamily: "var(--font-manrope), sans-serif",
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: accent,
                        background: accentLight,
                        padding: "3px 8px",
                        display: "inline-block",
                      }}
                    >
                      Layer {String(i + 1).padStart(2, "0")}
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            );
          })}
        </div>

        {/* Overprint note */}
        <Reveal delay={0.3}>
          <div
            style={{
              marginTop: 40,
              textAlign: "center",
              fontFamily: "var(--font-manrope), sans-serif",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: C.overprint,
            }}
          >
            Overprint: Where disciplines overlap, new colors emerge
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   Tools Section
   ═══════════════════════════════════════════════════ */
function ToolsSection() {
  return (
    <section
      id="tools"
      style={{
        position: "relative",
        padding: "80px 24px",
        background: C.bg,
        overflow: "hidden",
      }}
    >
      <HalftoneOverlay color={C.blue} size={14} opacity={0.025} />

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
        <InkSplatter count={6} color={C.coral} style={{ top: -10, left: 0 }} area={{ width: 200, height: 120 }} />

        <SectionHeader label="Ink Swatches" title="Tools & Technologies" accent={C.blue} />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 28,
          }}
        >
          {tools.map((category, i) => {
            const isBlue = i % 2 === 0;
            const accent = isBlue ? C.blue : C.coral;
            const accentLight = isBlue ? C.blueLight : C.coralLight;
            const secondAccent = isBlue ? C.coral : C.blue;

            return (
              <Reveal key={category.label} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    background: "#FFFFFF",
                    border: `1px solid ${C.darkLight}`,
                    overflow: "hidden",
                    boxShadow: `2px 2px 0px ${C.shadow2}`,
                  }}
                >
                  {/* Color swatch header */}
                  <div
                    style={{
                      position: "relative",
                      height: 64,
                      background: accent,
                      overflow: "hidden",
                    }}
                  >
                    <HalftoneOverlay color="#FFFFFF" size={6} opacity={0.15} />

                    {/* Swatch label */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 8,
                        left: 16,
                        right: 16,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-space-grotesk), sans-serif",
                          fontSize: 14,
                          fontWeight: 700,
                          color: "#FFFFFF",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                        }}
                      >
                        {category.label}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-manrope), monospace",
                          fontSize: 9,
                          fontWeight: 600,
                          color: "rgba(255,255,255,0.7)",
                          letterSpacing: "0.1em",
                        }}
                      >
                        {isBlue ? "PANTONE 286 C" : "PANTONE 178 C"}
                      </span>
                    </div>

                    {/* Overprint diagonal */}
                    <div
                      aria-hidden
                      style={{
                        position: "absolute",
                        top: -10,
                        right: -10,
                        width: 50,
                        height: 50,
                        background: secondAccent,
                        mixBlendMode: "multiply",
                        transform: "rotate(45deg)",
                        opacity: 0.5,
                      }}
                    />
                  </div>

                  {/* Tool items */}
                  <div style={{ padding: "16px 16px 20px" }}>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 6,
                      }}
                    >
                      {category.items.map((tool) => (
                        <span
                          key={tool}
                          style={{
                            fontFamily: "var(--font-manrope), sans-serif",
                            fontSize: 11,
                            fontWeight: 600,
                            color: C.dark,
                            background: accentLight,
                            padding: "5px 10px",
                            letterSpacing: "0.03em",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = accent;
                            e.currentTarget.style.color = "#FFFFFF";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = accentLight;
                            e.currentTarget.style.color = C.dark;
                          }}
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   Footer
   ═══════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer
      style={{
        position: "relative",
        padding: "64px 24px 40px",
        background: C.bg,
        borderTop: `1px solid ${C.darkLight}`,
        overflow: "hidden",
      }}
    >
      <HalftoneOverlay color={C.blue} size={10} opacity={0.03} />

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          position: "relative",
        }}
      >
        {/* Top row: logo + registration marks */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 40,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <RegistrationMark size={28} color={C.darkMuted} rotate />
            <Misregistered
              as="div"
              primaryColor={C.dark}
              secondaryColor={C.coral}
              offsetX={2}
              offsetY={2}
              hoverShift
              style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontSize: 36,
                fontWeight: 700,
              }}
            >
              GROX
            </Misregistered>
            <RegistrationMark size={28} color={C.darkMuted} rotate />
          </div>

          <ThemeSwitcher current="/duotone" variant="light" />
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: `repeating-linear-gradient(90deg, ${C.dark} 0px, ${C.dark} 4px, transparent 4px, transparent 8px)`,
            opacity: 0.1,
            marginBottom: 24,
          }}
        />

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-manrope), sans-serif",
              fontSize: 11,
              color: C.darkMuted,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Risograph printed with care. No two impressions alike.
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-manrope), sans-serif",
                fontSize: 11,
                color: C.darkMuted,
                letterSpacing: "0.08em",
              }}
            >
              2-Color Process
            </span>
            <div style={{ display: "flex", gap: 4 }}>
              <div style={{ width: 16, height: 16, background: C.blue }} />
              <div style={{ width: 16, height: 16, background: C.coral }} />
              <div style={{ width: 16, height: 16, background: C.overprint }} />
            </div>
          </div>
        </div>

        {/* Printer's mark */}
        <div
          style={{
            marginTop: 32,
            textAlign: "center",
            fontFamily: "var(--font-manrope), sans-serif",
            fontSize: 9,
            color: C.darkMuted,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            opacity: 0.5,
          }}
        >
          Printed on uncoated {C.paper} stock &bull; Blue 0050FF + Coral FF5C5C &bull; Overprint 7B2D8E
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════
   Global Styles (injected via style tag)
   ═══════════════════════════════════════════════════ */
function DuotoneStyles() {
  return (
    <style>{`
      /* Misregistration hover shift */
      .misreg-hover:hover .misreg-back {
        transform: translate(2px, 2px) !important;
      }

      /* Smooth scroll */
      html {
        scroll-behavior: smooth;
      }

      /* Selection color */
      ::selection {
        background: ${C.blueLight};
        color: ${C.blue};
      }

      /* Scrollbar */
      ::-webkit-scrollbar {
        width: 8px;
      }
      ::-webkit-scrollbar-track {
        background: ${C.bg};
      }
      ::-webkit-scrollbar-thumb {
        background: ${C.darkLight};
        border: 2px solid ${C.bg};
      }
      ::-webkit-scrollbar-thumb:hover {
        background: ${C.darkMuted};
      }

      /* Responsive grid adjustments */
      @media (max-width: 640px) {
        #projects > div > div:last-of-type {
          grid-template-columns: 1fr;
        }
        #expertise > div > div:nth-of-type(2) {
          grid-template-columns: 1fr;
        }
        #tools > div > div:last-of-type {
          grid-template-columns: 1fr;
        }
      }
    `}</style>
  );
}

/* ═══════════════════════════════════════════════════
   Page Export
   ═══════════════════════════════════════════════════ */
export default function DuotonePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        color: C.dark,
        fontFamily: "var(--font-manrope), sans-serif",
        position: "relative",
      }}
    >
      <DuotoneStyles />
      <PaperTexture />
      <Navigation />
      <HeroSection />
      <RegistrationDivider />
      <ProjectsSection />
      <RegistrationDivider />
      <ExpertiseSection />
      <RegistrationDivider />
      <ToolsSection />
      <Footer />
    </div>
  );
}
