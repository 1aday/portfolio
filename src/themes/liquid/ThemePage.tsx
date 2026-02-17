"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "@/app/data/projects";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";

/* ─── Color Palette ─── */
const C = {
  bg: "#0F0F2D",
  bgLight: "rgba(15,15,45,0.95)",
  violet: "#8B5CF6",
  violetMuted: "rgba(139,92,246,0.5)",
  violetLight: "rgba(139,92,246,0.12)",
  teal: "#14B8A6",
  tealMuted: "rgba(20,184,166,0.5)",
  tealLight: "rgba(20,184,166,0.12)",
  rose: "#F472B6",
  roseMuted: "rgba(244,114,182,0.5)",
  roseLight: "rgba(244,114,182,0.1)",
  text: "#F0F0FF",
  textMuted: "rgba(240,240,255,0.5)",
  cardBg: "rgba(139,92,246,0.06)",
  border: "rgba(139,92,246,0.2)",
  shadow1: "rgba(0,0,0,0.2)",
  shadow2: "rgba(0,0,0,0.4)",
};

/* ─── Animation config ─── */
const ease = [0.23, 1, 0.32, 1] as const;
const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } };

function useReveal(amount = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount });
  return { ref, inView };
}

function Reveal({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      style={style}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ duration: 0.7, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Inject CSS keyframes ─── */
function useInjectKeyframes() {
  useEffect(() => {
    const id = "liquid-blob-keyframes";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      @keyframes blobMorph1 {
        0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
        25% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
        50% { border-radius: 50% 60% 30% 60% / 40% 70% 60% 30%; }
        75% { border-radius: 60% 30% 60% 40% / 70% 40% 50% 60%; }
      }
      @keyframes blobMorph2 {
        0%, 100% { border-radius: 40% 60% 60% 40% / 70% 30% 70% 30%; }
        25% { border-radius: 60% 40% 30% 70% / 40% 60% 40% 60%; }
        50% { border-radius: 30% 70% 50% 50% / 60% 40% 60% 40%; }
        75% { border-radius: 50% 50% 70% 30% / 30% 70% 30% 70%; }
      }
      @keyframes blobMorph3 {
        0%, 100% { border-radius: 70% 30% 50% 50% / 30% 70% 40% 60%; }
        25% { border-radius: 40% 60% 60% 40% / 60% 40% 70% 30%; }
        50% { border-radius: 60% 40% 40% 60% / 50% 50% 30% 70%; }
        75% { border-radius: 30% 70% 70% 30% / 40% 60% 60% 40%; }
      }
      @keyframes meshShift {
        0% { background-position: 0% 0%, 100% 0%, 50% 100%; }
        50% { background-position: 100% 50%, 0% 100%, 50% 0%; }
        100% { background-position: 0% 0%, 100% 0%, 50% 100%; }
      }
      @keyframes floatBubble {
        0%, 100% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-12px) scale(1.06); }
      }
      @keyframes pulseGlow {
        0%, 100% { opacity: 0.5; }
        50% { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };
  }, []);
}

/* ─── Blob Shape ─── */
function BlobShape({
  color1,
  color2,
  animation,
  size,
  top,
  left,
  opacity = 0.35,
  blur = 60,
}: {
  color1: string;
  color2: string;
  animation: string;
  size: number;
  top: string;
  left: string;
  opacity?: number;
  blur?: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${color1}, ${color2})`,
        animation: `${animation} 20s ease-in-out infinite`,
        opacity,
        filter: `blur(${blur}px)`,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

/* ─── Mesh Gradient Background ─── */
function MeshGradient({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        position: "relative",
        background: `
          radial-gradient(ellipse at 20% 50%, rgba(139,92,246,0.15) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 20%, rgba(20,184,166,0.12) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 80%, rgba(244,114,182,0.1) 0%, transparent 50%),
          ${C.bg}
        `,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Wave Separator ─── */
function WaveSeparator({ flip = false, color = C.bg }: { flip?: boolean; color?: string }) {
  return (
    <div
      style={{
        width: "100%",
        overflow: "hidden",
        lineHeight: 0,
        transform: flip ? "scaleY(-1)" : undefined,
        marginTop: flip ? -1 : 0,
        marginBottom: flip ? 0 : -1,
      }}
    >
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: 80, display: "block" }}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="waveGrad" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={C.violet} stopOpacity="0.3" />
            <stop offset="50%" stopColor={C.teal} stopOpacity="0.2" />
            <stop offset="100%" stopColor={C.rose} stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <path
          d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z"
          fill={color}
        />
        <path
          d="M0,70 C240,110 480,20 720,70 C960,110 1200,20 1440,70"
          stroke="url(#waveGrad)"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
    </div>
  );
}

/* ─── Glow Wrapper ─── */
function GlowWrap({
  children,
  color = C.violet,
  radius = 24,
  style,
}: {
  children: React.ReactNode;
  color?: string;
  radius?: number;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      whileHover={{
        boxShadow: `0 0 50px ${color}33, 0 8px 32px ${C.shadow2}`,
        y: -4,
      }}
      transition={{ duration: 0.4, ease }}
      style={{
        borderRadius: radius,
        background: C.cardBg,
        border: `1px solid ${C.border}`,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: `0 0 30px ${color}15, 0 4px 24px ${C.shadow1}`,
        transition: "box-shadow 0.4s, transform 0.4s",
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Small Floating Bubble ─── */
function Bubble({
  size = 12,
  color = C.violet,
  top,
  left,
  delay = 0,
}: {
  size?: number;
  color?: string;
  top: string;
  left: string;
  delay?: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle at 30% 30%, ${color}, transparent)`,
        opacity: 0.5,
        animation: `floatBubble ${3 + delay}s ease-in-out ${delay}s infinite`,
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}

/* ─── Gradient Text helper ─── */
function GradientText({
  children,
  from = C.violet,
  via,
  to = C.teal,
  style,
}: {
  children: React.ReactNode;
  from?: string;
  via?: string;
  to?: string;
  style?: React.CSSProperties;
}) {
  const grad = via
    ? `linear-gradient(135deg, ${from}, ${via}, ${to})`
    : `linear-gradient(135deg, ${from}, ${to})`;
  return (
    <span
      style={{
        background: grad,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

/* ================================================================
   NAVIGATION
   ================================================================ */
function Navigation() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease }}
      style={{
        position: "fixed",
        top: 16,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        gap: 32,
        padding: "12px 32px",
        borderRadius: 60,
        background: "rgba(15,15,45,0.75)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: `1px solid ${C.border}`,
        boxShadow: `0 0 40px rgba(139,92,246,0.1)`,
        fontFamily: "var(--font-inter), sans-serif",
      }}
    >
      <a href="#" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
        <span
          style={{
            fontFamily: "var(--font-sora), sans-serif",
            fontWeight: 800,
            fontSize: 20,
            color: C.text,
            letterSpacing: "-0.02em",
          }}
        >
          GR
        </span>
        <GradientText style={{ fontFamily: "var(--font-sora), sans-serif", fontWeight: 800, fontSize: 20 }}>
          OX
        </GradientText>
      </a>
      {[
        { label: "Projects", href: "#projects" },
        { label: "Expertise", href: "#expertise" },
        { label: "Tools", href: "#tools" },
      ].map((link) => (
        <a
          key={link.href}
          href={link.href}
          style={{
            color: C.textMuted,
            textDecoration: "none",
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: "0.04em",
            transition: "color 0.3s",
            padding: "6px 14px",
            borderRadius: 30,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = C.text;
            e.currentTarget.style.background = C.violetLight;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = C.textMuted;
            e.currentTarget.style.background = "transparent";
          }}
        >
          {link.label}
        </a>
      ))}
    </motion.nav>
  );
}

/* ================================================================
   HERO SECTION
   ================================================================ */
function HeroSection() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        padding: "120px 24px 80px",
      }}
    >
      {/* Animated blob shapes */}
      <BlobShape
        color1="rgba(139,92,246,0.45)"
        color2="rgba(20,184,166,0.25)"
        animation="blobMorph1"
        size={520}
        top="-5%"
        left="-10%"
        opacity={0.3}
        blur={80}
      />
      <BlobShape
        color1="rgba(20,184,166,0.4)"
        color2="rgba(139,92,246,0.2)"
        animation="blobMorph2"
        size={440}
        top="20%"
        left="65%"
        opacity={0.25}
        blur={70}
      />
      <BlobShape
        color1="rgba(244,114,182,0.35)"
        color2="rgba(139,92,246,0.2)"
        animation="blobMorph3"
        size={380}
        top="55%"
        left="15%"
        opacity={0.2}
        blur={60}
      />

      {/* Decorative bubbles */}
      <Bubble size={18} color={C.violet} top="15%" left="8%" delay={0} />
      <Bubble size={10} color={C.teal} top="25%" left="85%" delay={1.2} />
      <Bubble size={14} color={C.rose} top="70%" left="78%" delay={0.8} />
      <Bubble size={8} color={C.violet} top="60%" left="5%" delay={2.0} />
      <Bubble size={22} color={C.teal} top="80%" left="45%" delay={1.5} />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, ease, delay: 0.2 }}
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          maxWidth: 840,
        }}
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.4 }}
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 14,
            fontWeight: 500,
            color: C.teal,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: 24,
          }}
        >
          Design + Engineering
        </motion.p>

        <h1
          style={{
            fontFamily: "var(--font-sora), sans-serif",
            fontSize: "clamp(48px, 8vw, 88px)",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            margin: "0 0 28px",
          }}
        >
          <GradientText from={C.violet} via={C.teal} to={C.rose}>
            Crafting Digital
          </GradientText>
          <br />
          <span style={{ color: C.text }}>Experiences</span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 18,
            lineHeight: 1.7,
            color: C.textMuted,
            maxWidth: 560,
            margin: "0 auto 48px",
          }}
        >
          Building fluid, organic interfaces that breathe life into
          every pixel. Where biomorphic design meets modern engineering.
        </motion.p>

        {/* Stats pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.8 }}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            justifyContent: "center",
          }}
        >
          {stats.map((stat, i) => {
            const accent = [C.violet, C.teal, C.rose, C.violet][i % 4];
            return (
              <div
                key={stat.label}
                style={{
                  padding: "14px 28px",
                  borderRadius: 60,
                  background: `linear-gradient(135deg, ${accent}12, ${accent}06)`,
                  border: `1px solid ${accent}30`,
                  boxShadow: `0 0 30px ${accent}12`,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-sora), sans-serif",
                    fontWeight: 700,
                    fontSize: 22,
                    color: accent,
                  }}
                >
                  {stat.value}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: 13,
                    color: C.textMuted,
                    fontWeight: 500,
                  }}
                >
                  {stat.label}
                </span>
              </div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ================================================================
   PROJECT CARD
   ================================================================ */
function ProjectCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
  const { ref, inView } = useReveal(0.15);
  const accent = [C.violet, C.teal, C.rose][index % 3];

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ duration: 0.7, ease, delay: index * 0.1 }}
    >
      <GlowWrap color={accent} radius={24}>
        <div style={{ padding: 32 }}>
          {/* Header row */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 16,
                background: `linear-gradient(135deg, ${accent}25, ${accent}10)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                border: `1px solid ${accent}30`,
              }}
            >
              {String(index + 1).padStart(2, "0")}
            </div>
            <span
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 11,
                fontWeight: 600,
                color: accent,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "5px 12px",
                borderRadius: 30,
                background: `${accent}12`,
                border: `1px solid ${accent}20`,
              }}
            >
              {project.year}
            </span>
          </div>

          {/* Title */}
          <h3
            style={{
              fontFamily: "var(--font-sora), sans-serif",
              fontSize: 20,
              fontWeight: 700,
              color: C.text,
              marginBottom: 10,
              letterSpacing: "-0.01em",
            }}
          >
            {project.title}
          </h3>

          {/* Description */}
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 14,
              lineHeight: 1.65,
              color: C.textMuted,
              marginBottom: 20,
            }}
          >
            {project.description}
          </p>

          {/* Client & Year */}
          <div
            style={{
              display: "flex",
              gap: 16,
              marginBottom: 20,
              flexWrap: "wrap",
            }}
          >
            {[{ label: "Client", value: project.client }, { label: "Year", value: project.year }].map((m) => (
              <div
                key={m.label}
                style={{
                  padding: "8px 14px",
                  borderRadius: 30,
                  background: `${accent}08`,
                  border: `1px solid ${accent}15`,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-sora), sans-serif",
                    fontWeight: 700,
                    fontSize: 14,
                    color: accent,
                  }}
                >
                  {m.value}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: 11,
                    color: C.textMuted,
                    marginLeft: 6,
                  }}
                >
                  {m.label}
                </span>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {project.tech.map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: 11,
                  fontWeight: 500,
                  color: C.textMuted,
                  padding: "4px 12px",
                  borderRadius: 30,
                  background: C.violetLight,
                  border: `1px solid ${C.border}`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </GlowWrap>
    </motion.div>
  );
}

/* ================================================================
   PROJECTS SECTION
   ================================================================ */
function ProjectsSection() {
  const { ref, inView } = useReveal(0.1);

  return (
    <section
      id="projects"
      style={{ position: "relative", padding: "100px 24px", overflow: "hidden" }}
    >
      {/* Background blobs */}
      <BlobShape
        color1="rgba(139,92,246,0.2)"
        color2="rgba(20,184,166,0.1)"
        animation="blobMorph2"
        size={350}
        top="10%"
        left="-8%"
        opacity={0.15}
        blur={90}
      />
      <BlobShape
        color1="rgba(244,114,182,0.15)"
        color2="rgba(139,92,246,0.1)"
        animation="blobMorph3"
        size={300}
        top="60%"
        left="85%"
        opacity={0.12}
        blur={80}
      />

      <div style={{ maxWidth: 1120, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <motion.div
          ref={ref}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          transition={{ duration: 0.8, ease }}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <span
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 12,
              fontWeight: 600,
              color: C.teal,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              display: "block",
              marginBottom: 16,
            }}
          >
            Selected Work
          </span>
          <h2
            style={{
              fontFamily: "var(--font-sora), sans-serif",
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            <GradientText from={C.violet} to={C.teal}>
              Featured Projects
            </GradientText>
          </h2>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: 28,
          }}
        >
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   EXPERTISE SECTION
   ================================================================ */
function ExpertiseSection() {
  const { ref, inView } = useReveal(0.1);
  const accents = [C.violet, C.teal, C.rose];

  return (
    <section
      id="expertise"
      style={{
        position: "relative",
        padding: "100px 24px",
        overflow: "hidden",
        background: `
          radial-gradient(ellipse at 30% 30%, rgba(139,92,246,0.08) 0%, transparent 60%),
          radial-gradient(ellipse at 70% 70%, rgba(20,184,166,0.06) 0%, transparent 60%),
          transparent
        `,
      }}
    >
      {/* Decorative blob */}
      <BlobShape
        color1="rgba(20,184,166,0.25)"
        color2="rgba(244,114,182,0.15)"
        animation="blobMorph1"
        size={400}
        top="5%"
        left="75%"
        opacity={0.12}
        blur={100}
      />

      <Bubble size={16} color={C.violet} top="12%" left="6%" delay={0.5} />
      <Bubble size={10} color={C.rose} top="75%" left="88%" delay={1.8} />
      <Bubble size={20} color={C.teal} top="85%" left="12%" delay={0.3} />

      <div style={{ maxWidth: 1120, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <motion.div
          ref={ref}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          transition={{ duration: 0.8, ease }}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <span
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 12,
              fontWeight: 600,
              color: C.rose,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              display: "block",
              marginBottom: 16,
            }}
          >
            Flow States
          </span>
          <h2
            style={{
              fontFamily: "var(--font-sora), sans-serif",
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            <GradientText from={C.rose} via={C.violet} to={C.teal}>
              Areas of Expertise
            </GradientText>
          </h2>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 28,
          }}
        >
          {expertise.map((exp, i) => {
            const accent = accents[i % 3];

            return (
              <Reveal
                key={exp.title}
                delay={i * 0.12}
              >
                <GlowWrap color={accent} radius={28}>
                  <div style={{ padding: 32, position: "relative", overflow: "hidden" }}>
                    {/* Decorative blob in card corner */}
                    <div
                      style={{
                        position: "absolute",
                        top: -30,
                        right: -30,
                        width: 100,
                        height: 100,
                        background: `radial-gradient(circle, ${accent}15, transparent 70%)`,
                        borderRadius: "50%",
                        animation: `blobMorph${(i % 3) + 1} 18s ease-in-out infinite`,
                        pointerEvents: "none",
                      }}
                    />

                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 14,
                        background: `linear-gradient(135deg, ${accent}30, ${accent}10)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 18,
                        marginBottom: 20,
                        border: `1px solid ${accent}25`,
                        boxShadow: `0 0 20px ${accent}15`,
                      }}
                    >
                      {["◎", "◈", "△", "◇"][i % 4]}
                    </div>

                    <h3
                      style={{
                        fontFamily: "var(--font-sora), sans-serif",
                        fontSize: 19,
                        fontWeight: 700,
                        color: C.text,
                        marginBottom: 16,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {exp.title}
                    </h3>

                    <p
                      style={{
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: 13,
                        color: C.textMuted,
                        lineHeight: 1.6,
                      }}
                    >
                      {exp.body}
                    </p>
                  </div>
                </GlowWrap>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   TOOLS SECTION
   ================================================================ */
function ToolsSection() {
  const { ref, inView } = useReveal(0.1);
  const accents = [C.teal, C.violet, C.rose];

  return (
    <section
      id="tools"
      style={{
        position: "relative",
        padding: "100px 24px",
        overflow: "hidden",
      }}
    >
      {/* Background blobs */}
      <BlobShape
        color1="rgba(244,114,182,0.2)"
        color2="rgba(20,184,166,0.15)"
        animation="blobMorph3"
        size={360}
        top="15%"
        left="-5%"
        opacity={0.1}
        blur={90}
      />
      <BlobShape
        color1="rgba(139,92,246,0.2)"
        color2="rgba(244,114,182,0.1)"
        animation="blobMorph1"
        size={280}
        top="50%"
        left="80%"
        opacity={0.1}
        blur={80}
      />

      <Bubble size={14} color={C.teal} top="8%" left="90%" delay={0.7} />
      <Bubble size={18} color={C.violet} top="70%" left="5%" delay={1.3} />
      <Bubble size={10} color={C.rose} top="35%" left="92%" delay={2.1} />

      <div style={{ maxWidth: 1120, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <motion.div
          ref={ref}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          transition={{ duration: 0.8, ease }}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <span
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 12,
              fontWeight: 600,
              color: C.violet,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              display: "block",
              marginBottom: 16,
            }}
          >
            Bubble Clusters
          </span>
          <h2
            style={{
              fontFamily: "var(--font-sora), sans-serif",
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            <GradientText from={C.teal} to={C.violet}>
              Tools & Technologies
            </GradientText>
          </h2>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 32,
          }}
        >
          {tools.map((group, gi) => {
            const accent = accents[gi % 3];

            return (
              <Reveal
                key={group.label}
                delay={gi * 0.12}
              >
                <GlowWrap color={accent} radius={32} style={{ padding: 32, position: "relative", overflow: "hidden" }}>
                  {/* Organic background shape */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: -40,
                      left: -40,
                      width: 160,
                      height: 160,
                      background: `radial-gradient(circle, ${accent}10, transparent 70%)`,
                      borderRadius: "50%",
                      animation: `blobMorph${(gi % 3) + 1} 22s ease-in-out infinite`,
                      pointerEvents: "none",
                    }}
                  />

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 24,
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: `linear-gradient(135deg, ${accent}30, ${accent}10)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 16,
                        border: `1px solid ${accent}25`,
                        boxShadow: `0 0 24px ${accent}15`,
                      }}
                    >
                      {group.label.charAt(0)}
                    </div>
                    <h3
                      style={{
                        fontFamily: "var(--font-sora), sans-serif",
                        fontSize: 17,
                        fontWeight: 700,
                        color: C.text,
                        letterSpacing: "-0.01em",
                        margin: 0,
                      }}
                    >
                      {group.label}
                    </h3>
                  </div>

                  {/* Floating bubble cluster of tools */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 10,
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    {group.items.map((tool, ti) => (
                      <motion.div
                        key={tool}
                        whileHover={{
                          scale: 1.08,
                          boxShadow: `0 0 20px ${accent}30`,
                        }}
                        transition={{ duration: 0.25 }}
                        style={{
                          padding: "8px 18px",
                          borderRadius: 50,
                          background: `linear-gradient(135deg, ${accent}12, ${accent}05)`,
                          border: `1px solid ${accent}20`,
                          fontFamily: "var(--font-inter), sans-serif",
                          fontSize: 12,
                          fontWeight: 500,
                          color: C.textMuted,
                          cursor: "default",
                          boxShadow: `0 0 12px ${accent}08`,
                          transition: "box-shadow 0.3s, transform 0.3s",
                        }}
                      >
                        {tool}
                      </motion.div>
                    ))}
                  </div>
                </GlowWrap>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   FOOTER
   ================================================================ */
function Footer() {
  return (
    <footer
      style={{
        position: "relative",
        padding: "80px 24px 40px",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      {/* Floating bubbles decoration */}
      <Bubble size={24} color={C.violet} top="10%" left="10%" delay={0} />
      <Bubble size={16} color={C.teal} top="20%" left="80%" delay={1} />
      <Bubble size={12} color={C.rose} top="50%" left="15%" delay={0.6} />
      <Bubble size={20} color={C.violet} top="35%" left="88%" delay={1.8} />
      <Bubble size={8} color={C.teal} top="65%" left="50%" delay={2.2} />
      <Bubble size={14} color={C.rose} top="75%" left="30%" delay={0.4} />

      {/* Wave at top of footer */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 80,
          background: `linear-gradient(to bottom, transparent, ${C.bg}10)`,
          pointerEvents: "none",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease }}
        style={{ position: "relative", zIndex: 2 }}
      >
        {/* Logo */}
        <div style={{ marginBottom: 20 }}>
          <span
            style={{
              fontFamily: "var(--font-sora), sans-serif",
              fontWeight: 800,
              fontSize: 36,
            }}
          >
            <span style={{ color: C.text }}>GR</span>
            <GradientText from={C.violet} via={C.teal} to={C.rose}>
              OX
            </GradientText>
          </span>
        </div>

        <p
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 14,
            color: C.textMuted,
            maxWidth: 400,
            margin: "0 auto 32px",
            lineHeight: 1.7,
          }}
        >
          Organic interfaces that flow naturally. Biomorphic design meets
          precision engineering.
        </p>

        {/* Divider blob line */}
        <div
          style={{
            width: 120,
            height: 4,
            borderRadius: 4,
            background: `linear-gradient(90deg, ${C.violet}, ${C.teal}, ${C.rose})`,
            margin: "0 auto 32px",
            opacity: 0.5,
          }}
        />

        <div style={{ marginBottom: 28 }}>
          <ThemeSwitcher current="/liquid" variant="dark" />
        </div>

        <p
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 12,
            color: C.textMuted,
            opacity: 0.5,
          }}
        >
          &copy; {new Date().getFullYear()} GROX. All rights reserved.
        </p>
      </motion.div>
    </footer>
  );
}

/* ================================================================
   MAIN PAGE
   ================================================================ */
export default function LiquidPage() {
  useInjectKeyframes();

  return (
    <MeshGradient
      style={{
        minHeight: "100vh",
        color: C.text,
        overflowX: "hidden",
      }}
    >
      <Navigation />
      <HeroSection />
      <WaveSeparator color="rgba(15,15,45,0.5)" />
      <ProjectsSection />
      <WaveSeparator flip color="rgba(15,15,45,0.5)" />
      <ExpertiseSection />
      <WaveSeparator color="rgba(15,15,45,0.5)" />
      <ToolsSection />
      <WaveSeparator flip color="rgba(15,15,45,0.5)" />
      <Footer />
    </MeshGradient>
  );
}
