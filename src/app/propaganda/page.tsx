"use client";

import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { getProjectImage } from "@/lib/theme-images";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

/* ─── Colors ─── */
const C = {
  cream: "#F5E6C8",
  red: "#CC2222",
  black: "#1A1A1A",
  white: "#FFFFFF",
};

/* ─── Red Star SVG ─── */
function RedStar({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={C.red}
      className={className}
      style={{ flexShrink: 0 }}
    >
      <polygon points="12,0 14.9,8.5 24,9.2 17,15 19.1,24 12,19.5 4.9,24 7,15 0,9.2 9.1,8.5" />
    </svg>
  );
}

/* ─── Sunburst Rays SVG ─── */
function SunburstRays({
  color = C.red,
  rays = 24,
  size = 900,
  className = "",
}: {
  color?: string;
  rays?: number;
  size?: number;
  className?: string;
}) {
  const lines = [];
  for (let i = 0; i < rays; i++) {
    const angle = (360 / rays) * i;
    lines.push(
      <line
        key={i}
        x1={size / 2}
        y1={size / 2}
        x2={size / 2 + Math.cos((angle * Math.PI) / 180) * size}
        y2={size / 2 + Math.sin((angle * Math.PI) / 180) * size}
        stroke={color}
        strokeWidth={2}
        opacity={0.25}
      />
    );
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      style={{ position: "absolute", pointerEvents: "none" }}
    >
      {lines}
    </svg>
  );
}

/* ─── Diagonal Red Banner ─── */
function RedBanner({
  children,
  angle = -3,
  className = "",
}: {
  children: React.ReactNode;
  angle?: number;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        background: C.red,
        color: C.white,
        padding: "12px 32px",
        transform: `rotate(${angle}deg)`,
        display: "inline-block",
        fontWeight: 800,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        fontSize: "0.85rem",
        lineHeight: 1.4,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Section Wrapper with InView ─── */
function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.section>
  );
}

/* ─── Geometric Accents (absolute positioned) ─── */
function GeoCircle({
  size,
  color,
  top,
  left,
  right,
  bottom,
  opacity = 1,
}: {
  size: number;
  color: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  opacity?: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        top,
        left,
        right,
        bottom,
        opacity,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

function GeoTriangle({
  size,
  color,
  top,
  left,
  right,
  bottom,
  rotation = 0,
  opacity = 1,
}: {
  size: number;
  color: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  rotation?: number;
  opacity?: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        width: 0,
        height: 0,
        borderLeft: `${size / 2}px solid transparent`,
        borderRight: `${size / 2}px solid transparent`,
        borderBottom: `${size}px solid ${color}`,
        top,
        left,
        right,
        bottom,
        transform: `rotate(${rotation}deg)`,
        opacity,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

function GeoRect({
  w,
  h,
  color,
  top,
  left,
  right,
  bottom,
  rotation = 0,
  opacity = 1,
}: {
  w: number;
  h: number;
  color: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  rotation?: number;
  opacity?: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        width: w,
        height: h,
        background: color,
        top,
        left,
        right,
        bottom,
        transform: `rotate(${rotation}deg)`,
        opacity,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

/* ─── Constructivist Grid Lines ─── */
function ConstructivistGrid() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      {/* Diagonal lines */}
      {[...Array(12)].map((_, i) => (
        <div
          key={`d-${i}`}
          style={{
            position: "absolute",
            width: "200vw",
            height: 1,
            background: C.black,
            opacity: 0.04,
            top: `${i * 9}%`,
            left: "-50%",
            transform: "rotate(-15deg)",
            transformOrigin: "center",
          }}
        />
      ))}
      {/* Horizontal accent lines */}
      {[...Array(6)].map((_, i) => (
        <div
          key={`h-${i}`}
          style={{
            position: "absolute",
            width: "100%",
            height: 1,
            background: C.red,
            opacity: 0.06,
            top: `${15 + i * 16}%`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Floating Slogan ─── */
function FloatingSlogan({
  text,
  top,
  left,
  right,
  angle,
  size = "5rem",
  color = C.red,
  opacity = 0.08,
}: {
  text: string;
  top?: string;
  left?: string;
  right?: string;
  angle: number;
  size?: string;
  color?: string;
  opacity?: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        right,
        transform: `rotate(${angle}deg)`,
        fontSize: size,
        fontWeight: 900,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color,
        opacity,
        pointerEvents: "none",
        whiteSpace: "nowrap",
        zIndex: 0,
        lineHeight: 1,
      }}
      className="font-[family-name:var(--font-space-grotesk)]"
    >
      {text}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PROPAGANDA PAGE
   ═══════════════════════════════════════════════════════════════════ */
export default function PropagandaPage() {
  return (
    <div
      style={{
        background: C.cream,
        color: C.black,
        minHeight: "100vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Responsive styles for propaganda theme */}
      <style>{`
        .prop-card-grid {
          display: grid;
          grid-template-columns: 1fr;
        }
        .prop-card-image {
          display: none;
        }
        @media (min-width: 768px) {
          .prop-card-grid {
            grid-template-columns: 1fr auto;
          }
          .prop-card-image {
            display: flex;
          }
        }
      `}</style>
      <ConstructivistGrid />

      {/* ═══════ HERO ═══════ */}
      <HeroSection />

      {/* ═══════ PROJECTS ═══════ */}
      <ProjectsSection />

      {/* ═══════ EXPERTISE ═══════ */}
      <ExpertiseSection />

      {/* ═══════ TOOLS ═══════ */}
      <ToolsSection />

      {/* ═══════ FOOTER ═══════ */}
      <FooterSection />

      <ThemeSwitcher current="/propaganda" variant="light" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════════════════════════════════ */
function HeroSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Sunburst rays behind everything */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          top: "50%",
          left: "55%",
          transform: "translate(-50%, -50%)",
          zIndex: 1,
        }}
      >
        <SunburstRays color={C.red} rays={36} size={1200} />
      </motion.div>

      {/* Large geometric shapes */}
      <GeoCircle size={340} color={C.red} top="-80px" right="-60px" opacity={0.15} />
      <GeoCircle size={180} color={C.red} top="60%" left="-40px" opacity={0.12} />
      <GeoTriangle size={200} color={C.black} top="15%" right="12%" rotation={20} opacity={0.08} />
      <GeoRect w={600} h={8} color={C.red} top="22%" left="-100px" rotation={-15} opacity={0.5} />
      <GeoRect w={500} h={6} color={C.black} top="75%" right="-80px" rotation={12} opacity={0.3} />
      <GeoRect w={400} h={4} color={C.red} top="85%" left="10%" rotation={-8} opacity={0.4} />

      {/* Floating slogans */}
      <FloatingSlogan text="BUILD" top="8%" left="5%" angle={-12} size="7rem" opacity={0.06} color={C.black} />
      <FloatingSlogan text="SHIP" top="70%" right="-2%" angle={15} size="6rem" opacity={0.07} color={C.red} />
      <FloatingSlogan text="CREATE" top="45%" left="-3%" angle={-20} size="5rem" opacity={0.05} color={C.black} />

      {/* Main hero content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1100,
          margin: "0 auto",
          padding: "120px 24px 80px",
          width: "100%",
        }}
      >
        {/* Top left red banner */}
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={inView ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <RedBanner angle={-2}>AI Engineer & Full-Stack Developer</RedBanner>
        </motion.div>

        {/* Main title — enormous, diagonal */}
        <motion.div
          initial={{ scale: 1.3, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          style={{ marginTop: 40 }}
        >
          <h1
            className="font-[family-name:var(--font-space-grotesk)]"
            style={{
              fontSize: "clamp(3.5rem, 10vw, 8rem)",
              fontWeight: 900,
              lineHeight: 0.9,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              color: C.black,
              transform: "rotate(-3deg)",
              transformOrigin: "left center",
            }}
          >
            BUILD
            <br />
            <span style={{ color: C.red, display: "inline-block", transform: "translateX(40px)" }}>
              THE
            </span>
            <br />
            <span style={{ display: "inline-block", transform: "translateX(20px)" }}>FUTURE</span>
          </h1>
        </motion.div>

        {/* Red star accent */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={inView ? { scale: 1, rotate: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{ marginTop: 24, marginLeft: 8 }}
        >
          <RedStar size={48} />
        </motion.div>

        {/* Stat numbers — giant red */}
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            display: "flex",
            gap: "clamp(24px, 6vw, 80px)",
            marginTop: 48,
            transform: "rotate(-1deg)",
          }}
        >
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: "left" }}>
              <div
                className="font-[family-name:var(--font-space-grotesk)]"
                style={{
                  fontSize: "clamp(3rem, 7vw, 5.5rem)",
                  fontWeight: 900,
                  color: C.red,
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                }}
              >
                {s.value}
              </div>
              <div
                className="font-[family-name:var(--font-inter)]"
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  color: C.black,
                  marginTop: 4,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Diagonal black bar with tagline */}
        <motion.div
          initial={{ x: 200, opacity: 0 }}
          animate={inView ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          style={{
            marginTop: 48,
            background: C.black,
            color: C.white,
            padding: "16px 40px",
            display: "inline-block",
            transform: "rotate(-2deg)",
            maxWidth: 500,
          }}
        >
          <p
            className="font-[family-name:var(--font-inter)]"
            style={{
              fontSize: "0.9rem",
              lineHeight: 1.6,
              margin: 0,
              fontWeight: 500,
            }}
          >
            Crafting AI-powered products with multi-model orchestration, computer vision, and
            full-stack engineering.
          </p>
        </motion.div>
      </div>

      {/* Bottom diagonal red strip */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "-5%",
          width: "120%",
          height: 6,
          background: C.red,
          transform: "rotate(-1deg)",
          zIndex: 3,
        }}
      />
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PROJECTS SECTION
   ═══════════════════════════════════════════════════════════════════ */
function ProjectsSection() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section
      style={{
        position: "relative",
        padding: "100px 0 60px",
        overflow: "hidden",
      }}
    >
      {/* Floating slogans in background */}
      <FloatingSlogan text="AI FOR ALL" top="5%" left="60%" angle={12} size="4.5rem" opacity={0.05} color={C.red} />
      <FloatingSlogan text="FORWARD" top="40%" right="5%" angle={-18} size="5rem" opacity={0.04} color={C.black} />
      <FloatingSlogan text="PROGRESS" top="75%" left="2%" angle={10} size="4rem" opacity={0.05} color={C.red} />

      {/* Section header */}
      <div
        ref={headerRef}
        style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2 }}
      >
        {/* Diagonal red banner header */}
        <motion.div
          initial={{ x: -400, opacity: 0 }}
          animate={headerInView ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: 16 }}
        >
          <div
            style={{
              background: C.red,
              display: "inline-block",
              padding: "14px 48px 14px 32px",
              transform: "rotate(-2deg) skewX(-5deg)",
            }}
          >
            <h2
              className="font-[family-name:var(--font-space-grotesk)]"
              style={{
                color: C.white,
                fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                margin: 0,
                transform: "skewX(5deg)",
              }}
            >
              <span style={{ display: "inline-block", marginRight: 12, marginTop: -4, verticalAlign: "middle" }}><RedStar size={20} /></span> Selected Works
            </h2>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="font-[family-name:var(--font-inter)]"
          style={{
            fontSize: "1rem",
            color: C.black,
            maxWidth: 600,
            marginTop: 24,
            marginBottom: 64,
            lineHeight: 1.7,
            opacity: 0.8,
          }}
        >
          A body of work spanning AI engineering, computer vision, multi-model orchestration, and
          full-stack product development. Each project forged with purpose and precision.
        </motion.p>
      </div>

      {/* Project Cards */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2 }}>
        {projects.map((project, index) => (
          <ProjectCard key={index} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}

/* ─── Single Project Card (Propaganda Poster Style) ─── */
function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const isEven = index % 2 === 0;
  const cardAngle = isEven ? -1.5 : 1.5;
  const offsetX = isEven ? "0%" : "8%";
  const geoShapes = [
    { type: "circle" as const, size: 120 },
    { type: "triangle" as const, size: 90 },
    { type: "circle" as const, size: 100 },
    { type: "triangle" as const, size: 110 },
    { type: "circle" as const, size: 130 },
    { type: "triangle" as const, size: 80 },
    { type: "circle" as const, size: 95 },
    { type: "triangle" as const, size: 105 },
    { type: "circle" as const, size: 110 },
    { type: "triangle" as const, size: 100 },
  ];
  const shape = geoShapes[index % geoShapes.length];

  return (
    <motion.div
      ref={ref}
      initial={{
        x: isEven ? -80 : 80,
        opacity: 0,
        rotate: isEven ? -5 : 5,
      }}
      animate={
        inView
          ? { x: 0, opacity: 1, rotate: 0 }
          : {}
      }
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        marginBottom: 64,
        marginLeft: offsetX,
        position: "relative",
      }}
    >
      <div
        style={{
          background: C.white,
          border: `3px solid ${C.black}`,
          padding: 0,
          transform: `rotate(${cardAngle}deg)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top bar — project number + client */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `3px solid ${C.black}`,
            padding: "12px 24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              className="font-[family-name:var(--font-space-grotesk)]"
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 900,
                color: C.red,
                lineHeight: 1,
              }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <div
                className="font-[family-name:var(--font-inter)]"
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  color: C.black,
                  opacity: 0.5,
                }}
              >
                {project.client}
              </div>
              <div
                className="font-[family-name:var(--font-inter)]"
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  color: C.red,
                  letterSpacing: "0.1em",
                }}
              >
                {project.year}
              </div>
            </div>
          </div>
          <RedStar size={18} />
        </div>

        {/* Main content area */}
        <div
          className="prop-card-grid"
          style={{
            gap: 0,
          }}
        >
          {/* Left: Text content */}
          <div style={{ padding: "28px 24px 24px", position: "relative", zIndex: 1 }}>
            {/* Geometric decoration behind */}
            {shape.type === "circle" ? (
              <div
                style={{
                  position: "absolute",
                  width: shape.size,
                  height: shape.size,
                  borderRadius: "50%",
                  border: `3px solid ${C.red}`,
                  top: -20,
                  right: isEven ? 40 : "auto",
                  left: isEven ? "auto" : 40,
                  opacity: 0.15,
                  zIndex: 0,
                }}
              />
            ) : (
              <div
                style={{
                  position: "absolute",
                  width: 0,
                  height: 0,
                  borderLeft: `${shape.size / 2}px solid transparent`,
                  borderRight: `${shape.size / 2}px solid transparent`,
                  borderBottom: `${shape.size}px solid ${C.black}`,
                  top: -10,
                  right: isEven ? 60 : "auto",
                  left: isEven ? "auto" : 60,
                  opacity: 0.06,
                  zIndex: 0,
                  transform: `rotate(${isEven ? 15 : -15}deg)`,
                }}
              />
            )}

            {/* Title at slight angle */}
            <h3
              className="font-[family-name:var(--font-space-grotesk)]"
              style={{
                fontSize: "clamp(1.4rem, 3vw, 2rem)",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: C.black,
                lineHeight: 1.1,
                margin: 0,
                transform: `rotate(${isEven ? -1 : 1}deg)`,
                position: "relative",
                zIndex: 1,
                whiteSpace: "pre-line",
              }}
            >
              {project.title.replace("\n", "\n")}
            </h3>

            {/* Description */}
            <p
              className="font-[family-name:var(--font-inter)]"
              style={{
                fontSize: "0.85rem",
                lineHeight: 1.65,
                color: C.black,
                opacity: 0.75,
                marginTop: 16,
                marginBottom: 0,
                maxWidth: 480,
                position: "relative",
                zIndex: 1,
              }}
            >
              {project.description}
            </p>

            {/* Technical detail */}
            <p
              className="font-[family-name:var(--font-inter)]"
              style={{
                fontSize: "0.78rem",
                lineHeight: 1.6,
                color: C.black,
                opacity: 0.55,
                marginTop: 12,
                marginBottom: 0,
                maxWidth: 480,
                position: "relative",
                zIndex: 1,
                fontStyle: "italic",
              }}
            >
              {project.technical}
            </p>
          </div>

          {/* Right: Photomontage circle with project image */}
          <div
            className="prop-card-image"
            style={{
              alignItems: "center",
              justifyContent: "center",
              padding: "24px 32px",
              position: "relative",
            }}
          >
            {/* Black geometric backdrop */}
            <div
              style={{
                position: "absolute",
                width: 160,
                height: 160,
                background: C.black,
                transform: `rotate(${isEven ? 12 : -12}deg)`,
                opacity: 0.08,
              }}
            />
            {/* Circular image cutout */}
            <div
              style={{
                width: 140,
                height: 140,
                borderRadius: "50%",
                overflow: "hidden",
                border: `4px solid ${C.red}`,
                position: "relative",
                zIndex: 1,
                flexShrink: 0,
              }}
            >
              <img
                src={getProjectImage("propaganda", project.image)}
                alt={project.title.replace("\n", " ")}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: "contrast(1.1) saturate(0.3)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Bottom: Red banner strip with tech tags */}
        <div
          style={{
            background: C.red,
            padding: "10px 24px",
            display: "flex",
            flexWrap: "wrap",
            gap: "8px 16px",
            alignItems: "center",
          }}
        >
          {project.tech.map((t, i) => (
            <span
              key={i}
              className="font-[family-name:var(--font-space-grotesk)]"
              style={{
                color: C.white,
                fontSize: "0.7rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
              }}
            >
              {t}
            </span>
          ))}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="font-[family-name:var(--font-inter)]"
              style={{
                marginLeft: "auto",
                color: C.white,
                fontSize: "0.65rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              GitHub
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   EXPERTISE SECTION
   ═══════════════════════════════════════════════════════════════════ */
function ExpertiseSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <Section
      id="expertise"
      className=""
    >
      <div
        ref={ref}
        style={{
          position: "relative",
          padding: "80px 0 60px",
          overflow: "hidden",
        }}
      >
        {/* Big diagonal black bar background */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "-10%",
            width: "130%",
            height: "80%",
            background: C.black,
            transform: "rotate(-3deg)",
            zIndex: 0,
          }}
        />

        {/* Geometric accents */}
        <GeoCircle size={200} color={C.red} top="-40px" right="10%" opacity={0.2} />
        <GeoTriangle size={140} color={C.white} bottom="-20px" left="15%" rotation={-25} opacity={0.06} />

        <FloatingSlogan text="EXPERTISE" top="5%" left="50%" angle={15} size="6rem" opacity={0.04} color={C.white} />

        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 24px",
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* Section header */}
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: 48 }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 16,
                transform: "rotate(-2deg)",
              }}
            >
              <RedStar size={32} />
              <h2
                className="font-[family-name:var(--font-space-grotesk)]"
                style={{
                  color: C.white,
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  margin: 0,
                }}
              >
                Core Expertise
              </h2>
            </div>
          </motion.div>

          {/* Expertise grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 24,
            }}
          >
            {expertise.map((item, i) => (
              <motion.div
                key={i}
                initial={{
                  y: 40,
                  opacity: 0,
                  rotate: i % 2 === 0 ? -3 : 3,
                }}
                animate={
                  inView
                    ? { y: 0, opacity: 1, rotate: i % 2 === 0 ? -1 : 1 }
                    : {}
                }
                transition={{ duration: 0.5, delay: 0.15 * i }}
                style={{
                  background: C.cream,
                  border: `3px solid ${C.red}`,
                  padding: 0,
                  overflow: "hidden",
                }}
              >
                {/* Red header bar */}
                <div
                  style={{
                    background: C.red,
                    padding: "10px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <RedStar size={14} />
                  <h3
                    className="font-[family-name:var(--font-space-grotesk)]"
                    style={{
                      color: C.white,
                      fontSize: "0.8rem",
                      fontWeight: 900,
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      margin: 0,
                    }}
                  >
                    {item.title}
                  </h3>
                </div>
                {/* Body */}
                <div style={{ padding: "20px" }}>
                  <p
                    className="font-[family-name:var(--font-inter)]"
                    style={{
                      fontSize: "0.82rem",
                      lineHeight: 1.6,
                      color: C.black,
                      margin: 0,
                      opacity: 0.8,
                    }}
                  >
                    {item.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TOOLS SECTION
   ═══════════════════════════════════════════════════════════════════ */
function ToolsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <Section id="tools">
      <div
        ref={ref}
        style={{
          position: "relative",
          padding: "80px 0 100px",
          overflow: "hidden",
        }}
      >
        {/* Geometric bg shapes */}
        <GeoRect w={300} h={300} color={C.red} top="20%" right="-100px" rotation={15} opacity={0.06} />
        <GeoTriangle size={180} color={C.black} bottom="10%" left="-40px" rotation={30} opacity={0.05} />
        <GeoCircle size={100} color={C.red} top="5%" left="40%" opacity={0.08} />

        <FloatingSlogan text="TOOLS" top="10%" right="5%" angle={-10} size="5rem" opacity={0.05} color={C.red} />
        <FloatingSlogan text="ARSENAL" top="60%" left="3%" angle={8} size="4rem" opacity={0.04} color={C.black} />

        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 24px",
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* Header */}
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: 48, textAlign: "right" }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 16,
                transform: "rotate(2deg)",
              }}
            >
              <h2
                className="font-[family-name:var(--font-space-grotesk)]"
                style={{
                  color: C.black,
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  margin: 0,
                }}
              >
                Technical Arsenal
              </h2>
              <RedStar size={32} />
            </div>
          </motion.div>

          {/* Tools grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 20,
            }}
          >
            {tools.map((group, gi) => (
              <motion.div
                key={gi}
                initial={{
                  x: gi % 2 === 0 ? -60 : 60,
                  opacity: 0,
                  rotate: gi % 2 === 0 ? -2 : 2,
                }}
                animate={
                  inView
                    ? { x: 0, opacity: 1, rotate: 0 }
                    : {}
                }
                transition={{ duration: 0.5, delay: 0.1 * gi }}
                style={{
                  border: `3px solid ${C.black}`,
                  background: C.white,
                  overflow: "hidden",
                }}
              >
                {/* Header */}
                <div
                  style={{
                    background: C.black,
                    padding: "10px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <RedStar size={12} />
                  <span
                    className="font-[family-name:var(--font-space-grotesk)]"
                    style={{
                      color: C.white,
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.18em",
                    }}
                  >
                    {group.label}
                  </span>
                </div>
                {/* Items */}
                <div style={{ padding: "16px 20px" }}>
                  {group.items.map((item, ii) => (
                    <div
                      key={ii}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "6px 0",
                        borderBottom:
                          ii < group.items.length - 1
                            ? `1px solid ${C.black}15`
                            : "none",
                      }}
                    >
                      <div
                        style={{
                          width: 6,
                          height: 6,
                          background: C.red,
                          transform: "rotate(45deg)",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        className="font-[family-name:var(--font-inter)]"
                        style={{
                          fontSize: "0.82rem",
                          fontWeight: 600,
                          color: C.black,
                          letterSpacing: "0.02em",
                        }}
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   FOOTER SECTION
   ═══════════════════════════════════════════════════════════════════ */
function FooterSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Full-width red band */}
      <div
        style={{
          background: C.red,
          padding: "80px 0 40px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Sunburst behind footer */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 0,
            opacity: 0.1,
          }}
        >
          <SunburstRays color={C.white} rays={24} size={800} />
        </motion.div>

        {/* Geometric accents */}
        <GeoCircle size={200} color={C.black} top="-60px" left="-60px" opacity={0.1} />
        <GeoTriangle size={120} color={C.white} bottom="-20px" right="10%" rotation={15} opacity={0.08} />

        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 24px",
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* Large closing statement */}
          <motion.div
            initial={{ scale: 1.2, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            style={{ textAlign: "center" }}
          >
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}><RedStar size={40} /></div>
            <h2
              className="font-[family-name:var(--font-space-grotesk)]"
              style={{
                fontSize: "clamp(2.5rem, 7vw, 5rem)",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "-0.02em",
                color: C.white,
                lineHeight: 0.95,
                margin: 0,
                transform: "rotate(-2deg)",
              }}
            >
              THE FUTURE
              <br />
              IS BUILT
            </h2>
          </motion.div>

          {/* Black bar with contact */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              marginTop: 40,
              textAlign: "center",
            }}
          >
            <div
              style={{
                background: C.black,
                display: "inline-block",
                padding: "14px 40px",
                transform: "rotate(1deg)",
              }}
            >
              <p
                className="font-[family-name:var(--font-inter)]"
                style={{
                  color: C.white,
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  margin: 0,
                  letterSpacing: "0.05em",
                }}
              >
                Available for AI engineering projects and collaborations
              </p>
            </div>
          </motion.div>

          {/* Diagonal slogans */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{
              marginTop: 48,
              display: "flex",
              justifyContent: "center",
              gap: "clamp(24px, 5vw, 64px)",
              flexWrap: "wrap",
            }}
          >
            {["BUILD", "SHIP", "CREATE", "DEPLOY"].map((word, i) => (
              <span
                key={i}
                className="font-[family-name:var(--font-space-grotesk)]"
                style={{
                  fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  color: C.white,
                  opacity: 0.4,
                  transform: `rotate(${(i - 1.5) * 3}deg)`,
                }}
              >
                {word}
              </span>
            ))}
          </motion.div>

          {/* Bottom line */}
          <div
            style={{
              marginTop: 48,
              paddingTop: 24,
              borderTop: `2px solid ${C.white}20`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <span
              className="font-[family-name:var(--font-inter)]"
              style={{
                color: C.white,
                fontSize: "0.7rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                opacity: 0.6,
              }}
            >
              Designed & Built with Purpose
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <RedStar size={12} />
              <span
                className="font-[family-name:var(--font-inter)]"
                style={{
                  color: C.white,
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  opacity: 0.6,
                }}
              >
                2025
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Very bottom black strip */}
      <div
        style={{
          background: C.black,
          height: 6,
          width: "100%",
        }}
      />
    </section>
  );
}
