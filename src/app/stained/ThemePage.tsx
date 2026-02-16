"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { getProjectImage } from "@/lib/theme-images";

/* ─── Color Palette ─── */
const C = {
  bg: "#1A1A1A",
  lead: "#1A1A1A",
  leadLight: "#2A2A2A",
  ruby: "#9B1B30",
  rubyGlow: "rgba(155,27,48,0.3)",
  sapphire: "#1E3A5F",
  sapphireGlow: "rgba(30,58,95,0.3)",
  emerald: "#1B5E20",
  emeraldGlow: "rgba(27,94,32,0.3)",
  amber: "#F9A825",
  amberGlow: "rgba(249,168,37,0.3)",
  glass: "#F5F5F0",
  glassMuted: "rgba(245,245,240,0.6)",
  glassLight: "rgba(245,245,240,0.08)",
  shadow1: "rgba(0,0,0,0.3)",
  shadow2: "rgba(0,0,0,0.5)",
};

const jewels = [C.ruby, C.sapphire, C.emerald, C.amber];
const jewelGlows = [C.rubyGlow, C.sapphireGlow, C.emeraldGlow, C.amberGlow];

/* ─── Lead Came Border ─── */
function LeadBorder({
  orientation = "horizontal",
  thickness = 4,
  color = C.lead,
}: {
  orientation?: "horizontal" | "vertical";
  thickness?: number;
  color?: string;
}) {
  return (
    <div
      style={{
        width: orientation === "horizontal" ? "100%" : `${thickness}px`,
        height: orientation === "horizontal" ? `${thickness}px` : "100%",
        background: color,
        boxShadow: `0 0 6px ${C.shadow1}`,
        flexShrink: 0,
      }}
    />
  );
}

/* ─── Glass Panel ─── */
function GlassPanel({
  children,
  jewelColor,
  glowColor,
  className = "",
  style = {},
  hoverBrighten = true,
}: {
  children: React.ReactNode;
  jewelColor: string;
  glowColor: string;
  className?: string;
  style?: React.CSSProperties;
  hoverBrighten?: boolean;
}) {
  return (
    <div
      className={className}
      style={{
        background: jewelColor,
        border: `4px solid ${C.lead}`,
        boxShadow: `inset 0 0 30px ${glowColor}, 0 4px 20px ${C.shadow1}`,
        transition: "filter 0.4s ease, box-shadow 0.4s ease",
        cursor: hoverBrighten ? "default" : undefined,
        ...style,
      }}
      onMouseEnter={(e) => {
        if (hoverBrighten) {
          e.currentTarget.style.filter = "brightness(1.15)";
          e.currentTarget.style.boxShadow = `inset 0 0 50px ${glowColor}, 0 6px 30px ${glowColor}`;
        }
      }}
      onMouseLeave={(e) => {
        if (hoverBrighten) {
          e.currentTarget.style.filter = "brightness(1)";
          e.currentTarget.style.boxShadow = `inset 0 0 30px ${glowColor}, 0 4px 20px ${C.shadow1}`;
        }
      }}
    >
      {children}
    </div>
  );
}

/* ─── Rose Window SVG ─── */
function RoseWindow({ size = 300 }: { size?: number }) {
  const r = size / 2;
  const outerR = r - 4;
  const innerR = r * 0.55;
  const coreR = r * 0.22;
  const segments = 8;

  const segmentPaths: React.ReactNode[] = [];
  for (let i = 0; i < segments; i++) {
    const startAngle = (i * 360) / segments - 90;
    const endAngle = ((i + 1) * 360) / segments - 90;
    const midAngle = (startAngle + endAngle) / 2;
    const toRad = (deg: number) => (deg * Math.PI) / 180;

    const ix1 = r + innerR * Math.cos(toRad(startAngle));
    const iy1 = r + innerR * Math.sin(toRad(startAngle));
    const ox1 = r + outerR * Math.cos(toRad(startAngle));
    const oy1 = r + outerR * Math.sin(toRad(startAngle));
    const ox2 = r + outerR * Math.cos(toRad(endAngle));
    const oy2 = r + outerR * Math.sin(toRad(endAngle));
    const ix2 = r + innerR * Math.cos(toRad(endAngle));
    const iy2 = r + innerR * Math.sin(toRad(endAngle));

    const petalR = (outerR - innerR) * 0.75;
    const cpx = r + ((outerR + innerR) / 2) * Math.cos(toRad(midAngle));
    const cpy = r + ((outerR + innerR) / 2) * Math.sin(toRad(midAngle));

    const color = jewels[i % jewels.length];

    segmentPaths.push(
      <path
        key={`seg-${i}`}
        d={`M ${ix1} ${iy1} L ${ox1} ${oy1} A ${outerR} ${outerR} 0 0 1 ${ox2} ${oy2} L ${ix2} ${iy2} A ${innerR} ${innerR} 0 0 0 ${ix1} ${iy1}`}
        fill={color}
        fillOpacity={0.7}
        stroke={C.lead}
        strokeWidth={3}
      />
    );

    /* Decorative tracery arc in each segment */
    segmentPaths.push(
      <circle
        key={`tracer-${i}`}
        cx={cpx}
        cy={cpy}
        r={petalR}
        fill="none"
        stroke={C.glassMuted}
        strokeWidth={1.2}
        strokeOpacity={0.35}
      />
    );
  }

  /* Radial lines */
  const radials: React.ReactNode[] = [];
  for (let i = 0; i < segments; i++) {
    const angle = ((i * 360) / segments - 90) * (Math.PI / 180);
    radials.push(
      <line
        key={`rad-${i}`}
        x1={r + coreR * Math.cos(angle)}
        y1={r + coreR * Math.sin(angle)}
        x2={r + outerR * Math.cos(angle)}
        y2={r + outerR * Math.sin(angle)}
        stroke={C.lead}
        strokeWidth={3}
      />
    );
  }

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      style={{ filter: `drop-shadow(0 0 40px ${C.amberGlow})` }}
    >
      {/* Outer ring */}
      <circle
        cx={r}
        cy={r}
        r={outerR}
        fill="none"
        stroke={C.lead}
        strokeWidth={6}
      />
      {/* Segments */}
      {segmentPaths}
      {/* Inner ring */}
      <circle
        cx={r}
        cy={r}
        r={innerR}
        fill="none"
        stroke={C.lead}
        strokeWidth={4}
      />
      {/* Radial spokes */}
      {radials}
      {/* Core circle */}
      <circle cx={r} cy={r} r={coreR} fill={C.amber} fillOpacity={0.8} stroke={C.lead} strokeWidth={3} />
      {/* Core inner decoration */}
      <circle cx={r} cy={r} r={coreR * 0.5} fill="none" stroke={C.lead} strokeWidth={1.5} />
      {/* Outermost decorative ring */}
      <circle
        cx={r}
        cy={r}
        r={outerR + 2}
        fill="none"
        stroke={C.glassMuted}
        strokeWidth={1}
        strokeOpacity={0.3}
      />
    </motion.svg>
  );
}

/* ─── Mini Rose (for footer) ─── */
function MiniRose({ size = 40 }: { size?: number }) {
  const r = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={r} cy={r} r={r - 2} fill="none" stroke={C.amber} strokeWidth={1.5} />
      <circle cx={r} cy={r} r={r * 0.5} fill="none" stroke={C.amber} strokeWidth={1} />
      {[0, 45, 90, 135].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <line
            key={deg}
            x1={r + (r * 0.5) * Math.cos(rad)}
            y1={r + (r * 0.5) * Math.sin(rad)}
            x2={r + (r - 2) * Math.cos(rad)}
            y2={r + (r - 2) * Math.sin(rad)}
            stroke={C.amber}
            strokeWidth={1}
          />
        );
      })}
      <circle cx={r} cy={r} r={3} fill={C.amber} />
    </svg>
  );
}

/* ─── Gothic Arch Decoration ─── */
function GothicArch({
  width = 200,
  height = 300,
  color = C.glassMuted,
}: {
  width?: number;
  height?: number;
  color?: string;
}) {
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ opacity: 0.15 }}>
      <path
        d={`M 0 ${height} L 0 ${height * 0.3} Q ${width * 0.5} ${-height * 0.05} ${width} ${height * 0.3} L ${width} ${height}`}
        fill="none"
        stroke={color}
        strokeWidth={2}
      />
      <path
        d={`M ${width * 0.1} ${height} L ${width * 0.1} ${height * 0.35} Q ${width * 0.5} ${height * 0.02} ${width * 0.9} ${height * 0.35} L ${width * 0.9} ${height}`}
        fill="none"
        stroke={color}
        strokeWidth={1}
      />
    </svg>
  );
}

/* ─── Gothic Tracery Divider ─── */
function TraceryDivider() {
  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center", padding: "40px 0" }}>
      <svg width="600" height="60" viewBox="0 0 600 60" style={{ maxWidth: "90%" }}>
        {/* Center pointed arch */}
        <path
          d="M 250 55 L 250 25 Q 300 0 350 25 L 350 55"
          fill="none"
          stroke={C.amber}
          strokeWidth={1.5}
          strokeOpacity={0.4}
        />
        {/* Left arches */}
        <path
          d="M 100 55 L 100 30 Q 175 5 250 30"
          fill="none"
          stroke={C.glassMuted}
          strokeWidth={1}
          strokeOpacity={0.25}
        />
        <path
          d="M 0 55 L 0 35 Q 50 15 100 35"
          fill="none"
          stroke={C.glassMuted}
          strokeWidth={1}
          strokeOpacity={0.15}
        />
        {/* Right arches */}
        <path
          d="M 500 55 L 500 30 Q 425 5 350 30"
          fill="none"
          stroke={C.glassMuted}
          strokeWidth={1}
          strokeOpacity={0.25}
        />
        <path
          d="M 600 55 L 600 35 Q 550 15 500 35"
          fill="none"
          stroke={C.glassMuted}
          strokeWidth={1}
          strokeOpacity={0.15}
        />
        {/* Horizontal baseline */}
        <line x1="0" y1="55" x2="600" y2="55" stroke={C.leadLight} strokeWidth={2} />
        {/* Decorative dots */}
        <circle cx="300" cy="12" r="3" fill={C.amber} fillOpacity={0.5} />
        <circle cx="175" cy="20" r="2" fill={C.glassMuted} fillOpacity={0.3} />
        <circle cx="425" cy="20" r="2" fill={C.glassMuted} fillOpacity={0.3} />
      </svg>
    </div>
  );
}

/* ─── Section Header ─── */
function SectionHeader({ title, latin }: { title: string; latin: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7 }}
      style={{
        textAlign: "center",
        marginBottom: "48px",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "0.75rem",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: C.amber,
          opacity: 0.7,
        }}
      >
        {latin}
      </span>
      <h2
        style={{
          fontFamily: "var(--font-dm-serif)",
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          color: C.glass,
          marginTop: "8px",
          lineHeight: 1.1,
          textShadow: `0 2px 20px ${C.shadow1}`,
        }}
      >
        {title}
      </h2>
      {/* Decorative underline */}
      <div
        style={{
          width: "80px",
          height: "3px",
          background: `linear-gradient(90deg, ${C.ruby}, ${C.amber}, ${C.sapphire})`,
          margin: "16px auto 0",
          borderRadius: "2px",
        }}
      />
    </motion.div>
  );
}

/* ─── Scroll Reveal Wrapper ─── */
function Reveal({
  children,
  delay = 0,
  style = {},
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
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   NAVIGATION
   ═══════════════════════════════════════════════════════════ */
function Navigation() {
  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: C.lead,
        borderBottom: `4px solid ${C.amber}`,
        boxShadow: `0 4px 20px ${C.shadow2}`,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <a
          href="#"
          style={{
            fontFamily: "var(--font-dm-serif)",
            fontSize: "1.5rem",
            color: C.glass,
            textDecoration: "none",
            letterSpacing: "0.1em",
          }}
        >
          GROX
        </a>

        {/* Links */}
        <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
          {[
            { label: "Projects", href: "#projects" },
            { label: "Expertise", href: "#expertise" },
            { label: "Tools", href: "#tools" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.85rem",
                color: C.glassMuted,
                textDecoration: "none",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                transition: "color 0.3s ease",
                paddingBottom: "2px",
                borderBottom: "2px solid transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = C.amber;
                e.currentTarget.style.borderBottomColor = C.amber;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = C.glassMuted;
                e.currentTarget.style.borderBottomColor = "transparent";
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════════════════════════ */
function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <section
      ref={ref}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        background: `radial-gradient(ellipse at center, ${C.leadLight} 0%, ${C.bg} 70%)`,
        borderBottom: `4px solid ${C.lead}`,
        padding: "100px 24px 80px",
      }}
    >
      {/* Background light bloom */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "500px",
          height: "500px",
          background: `radial-gradient(circle, ${C.amberGlow} 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Gothic arch decorations */}
      <div style={{ position: "absolute", left: "5%", top: "10%", opacity: 0.08 }}>
        <GothicArch width={120} height={250} color={C.glass} />
      </div>
      <div style={{ position: "absolute", right: "5%", top: "10%", opacity: 0.08, transform: "scaleX(-1)" }}>
        <GothicArch width={120} height={250} color={C.glass} />
      </div>

      {/* Rose Window Centerpiece */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <RoseWindow size={280} />
      </motion.div>

      {/* Latin inscription */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 0.5 } : {}}
        transition={{ duration: 1, delay: 0.5 }}
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "0.75rem",
          letterSpacing: "0.4em",
          color: C.amber,
          textTransform: "uppercase",
          marginTop: "32px",
        }}
      >
        OPUS ET LUX
      </motion.p>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.3 }}
        style={{
          fontFamily: "var(--font-dm-serif)",
          fontSize: "clamp(2.5rem, 7vw, 5rem)",
          color: C.glass,
          textAlign: "center",
          marginTop: "16px",
          lineHeight: 1.05,
          textShadow: `0 4px 30px ${C.shadow1}`,
        }}
      >
        Digital
        <br />
        Craftsman
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.5 }}
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1rem, 2vw, 1.25rem)",
          color: C.glassMuted,
          textAlign: "center",
          marginTop: "16px",
          maxWidth: "500px",
          lineHeight: 1.6,
        }}
      >
        Building luminous digital experiences, forged in code and light
      </motion.p>

      {/* Stats as Glass Medallions */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.7 }}
        style={{
          display: "flex",
          gap: "24px",
          marginTop: "48px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {stats.map((stat, i) => {
          const color = jewels[i % jewels.length];
          const glow = jewelGlows[i % jewelGlows.length];
          return (
            <div
              key={i}
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background: color,
                border: `4px solid ${C.lead}`,
                boxShadow: `inset 0 0 20px ${glow}, 0 4px 15px ${C.shadow1}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                transition: "filter 0.3s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(1.2)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.filter = "brightness(1)"; }}
            >
              <span
                style={{
                  fontFamily: "var(--font-dm-serif)",
                  fontSize: "1.5rem",
                  color: C.glass,
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.6rem",
                  color: C.glassMuted,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginTop: "4px",
                  textAlign: "center",
                  padding: "0 6px",
                }}
              >
                {stat.label}
              </span>
            </div>
          );
        })}
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   PROJECT CARD
   ═══════════════════════════════════════════════════════════ */
function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const color = jewels[index % jewels.length];
  const glow = jewelGlows[index % jewelGlows.length];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <GlassPanel
        jewelColor={color}
        glowColor={glow}
        style={{
          borderRadius: "4px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Image area with tinted overlay */}
        <div
          style={{
            position: "relative",
            height: "200px",
            overflow: "hidden",
            borderBottom: `4px solid ${C.lead}`,
          }}
        >
          {project.image && (
            <img
              src={getProjectImage("stained", project.image)}
              alt={project.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "brightness(0.7) saturate(0.6)",
              }}
            />
          )}
          {/* Color tint overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(135deg, ${color}88, transparent)`,
              mixBlendMode: "multiply",
            }}
          />
          {/* Light bloom */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "200px",
              height: "200px",
              background: `radial-gradient(circle, ${glow}, transparent 70%)`,
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Content */}
        <div style={{ padding: "24px", flex: 1, display: "flex", flexDirection: "column" }}>
          <h3
            style={{
              fontFamily: "var(--font-dm-serif)",
              fontSize: "1.35rem",
              color: C.glass,
              marginBottom: "8px",
              lineHeight: 1.2,
            }}
          >
            {project.title}
          </h3>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.9rem",
              color: C.glassMuted,
              lineHeight: 1.6,
              flex: 1,
            }}
          >
            {project.description}
          </p>

          {/* Tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "16px" }}>
            {project.tech.slice(0, 4).map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.7rem",
                  color: C.glass,
                  background: C.glassLight,
                  border: `1px solid ${C.glassMuted}`,
                  borderRadius: "2px",
                  padding: "3px 8px",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </GlassPanel>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PROJECTS SECTION
   ═══════════════════════════════════════════════════════════ */
function ProjectsSection() {
  return (
    <section
      id="projects"
      style={{
        padding: "100px 24px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <SectionHeader title="Sacred Works" latin="OPUS MAGNUM" />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "4px",
          background: C.lead,
          border: `4px solid ${C.lead}`,
          borderRadius: "4px",
        }}
      >
        {projects.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   EXPERTISE SECTION — Lancet Windows
   ═══════════════════════════════════════════════════════════ */
function ExpertiseSection() {
  return (
    <section
      id="expertise"
      style={{
        padding: "100px 24px",
        background: `linear-gradient(180deg, ${C.bg} 0%, ${C.leadLight} 50%, ${C.bg} 100%)`,
        borderTop: `4px solid ${C.lead}`,
        borderBottom: `4px solid ${C.lead}`,
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <SectionHeader title="Illuminated Disciplines" latin="LUX SCIENTIAE" />

        <div
          style={{
            display: "flex",
            gap: "4px",
            justifyContent: "center",
            flexWrap: "wrap",
            background: C.lead,
            padding: "4px",
            borderRadius: "4px",
            border: `4px solid ${C.lead}`,
          }}
        >
          {expertise.map((item, i) => {
            const color = jewels[i % jewels.length];
            const glow = jewelGlows[i % jewelGlows.length];

            return (
              <Reveal
                key={item.title}
                delay={i * 0.1}
                style={{ flex: "1 1 220px", maxWidth: "280px" }}
              >
                <div
                  style={{
                    background: color,
                    border: `3px solid ${C.lead}`,
                    boxShadow: `inset 0 0 30px ${glow}`,
                    clipPath: "polygon(0 100%, 0 15%, 50% 0%, 100% 15%, 100% 100%)",
                    padding: "60px 20px 30px",
                    minHeight: "380px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    transition: "filter 0.4s ease, box-shadow 0.4s ease",
                    cursor: "default",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.filter = "brightness(1.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.filter = "brightness(1)";
                  }}
                >
                  {/* Light bloom at top of arch */}
                  <div
                    style={{
                      position: "absolute",
                      top: "0",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "120px",
                      height: "120px",
                      background: `radial-gradient(circle, ${glow}, transparent 70%)`,
                      pointerEvents: "none",
                    }}
                  />

                  {/* Category title */}
                  <h3
                    style={{
                      fontFamily: "var(--font-dm-serif)",
                      fontSize: "1.2rem",
                      color: C.glass,
                      marginBottom: "16px",
                      lineHeight: 1.2,
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "0.85rem",
                      color: C.glassMuted,
                      lineHeight: 1.5,
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    {item.body}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   TOOLS SECTION — Tracery Grid
   ═══════════════════════════════════════════════════════════ */
function ToolsSection() {
  return (
    <section
      id="tools"
      style={{
        padding: "100px 24px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <SectionHeader title="Instruments of Light" latin="INSTRUMENTA VERITAS" />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "4px",
          background: C.lead,
          border: `4px solid ${C.lead}`,
          borderRadius: "4px",
        }}
      >
        {tools.map((group, i) => {
          const color = jewels[i % jewels.length];
          const glow = jewelGlows[i % jewelGlows.length];

          return (
            <Reveal key={group.label} delay={i * 0.08}>
              <div
                style={{
                  background: `linear-gradient(135deg, ${color}, ${C.leadLight})`,
                  border: `3px solid ${C.lead}`,
                  boxShadow: `inset 0 0 25px ${glow}`,
                  padding: "28px",
                  minHeight: "200px",
                  transition: "filter 0.4s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = "brightness(1.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = "brightness(1)";
                }}
              >
                {/* Tracery corner decoration */}
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 60 60"
                  style={{ position: "absolute", top: 0, right: 0, opacity: 0.15 }}
                >
                  <path
                    d="M 60 0 L 60 60 Q 30 45 0 60"
                    fill="none"
                    stroke={C.glass}
                    strokeWidth={1.5}
                  />
                  <path
                    d="M 60 0 L 60 40 Q 40 30 20 40"
                    fill="none"
                    stroke={C.glass}
                    strokeWidth={1}
                  />
                </svg>

                {/* Category header */}
                <h3
                  style={{
                    fontFamily: "var(--font-dm-serif)",
                    fontSize: "1.15rem",
                    color: C.glass,
                    marginBottom: "16px",
                    paddingBottom: "12px",
                    borderBottom: `2px solid ${C.glassLight}`,
                  }}
                >
                  {group.label}
                </h3>

                {/* Tool items */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  {group.items.map((tool) => (
                    <span
                      key={tool}
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "0.78rem",
                        color: C.glass,
                        background: C.glassLight,
                        border: `1px solid ${C.glassMuted}`,
                        borderRadius: "2px",
                        padding: "4px 10px",
                        letterSpacing: "0.04em",
                        transition: "background 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = `${glow}`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = C.glassLight;
                      }}
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer
      style={{
        borderTop: `4px solid ${C.amber}`,
        background: C.lead,
        padding: "60px 24px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}
      >
        {/* Logo */}
        <span
          style={{
            fontFamily: "var(--font-dm-serif)",
            fontSize: "2rem",
            color: C.glass,
            letterSpacing: "0.15em",
          }}
        >
          GROX
        </span>

        {/* Mini rose window */}
        <MiniRose size={44} />

        {/* Latin text */}
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "0.8rem",
            color: C.glassMuted,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
          }}
        >
          LUX ET VERITAS
        </p>

        {/* Divider */}
        <div
          style={{
            width: "120px",
            height: "1px",
            background: `linear-gradient(90deg, transparent, ${C.amber}, transparent)`,
          }}
        />

        {/* Copyright */}
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "0.75rem",
            color: `${C.glassMuted}`,
            opacity: 0.5,
          }}
        >
          Crafted with devotion
        </p>

        {/* Theme Switcher */}
        <ThemeSwitcher current="/stained" variant="dark" />
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════ */
export default function StainedPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        color: C.glass,
        fontFamily: "var(--font-display)",
        overflowX: "hidden",
      }}
    >
      <Navigation />
      <HeroSection />
      <TraceryDivider />
      <ProjectsSection />
      <TraceryDivider />
      <ExpertiseSection />
      <TraceryDivider />
      <ToolsSection />
      <TraceryDivider />
      <Footer />
    </div>
  );
}
