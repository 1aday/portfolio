"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";

/* ─── Constants ─── */
const ACCENT = "#FF3366";
const BG_TEXT_WORDS = ["BUILD", "SHIP", "CREATE", "AI", "DESIGN", "CODE", "CRAFT", "GROX"];
const GROX_REPEAT_COUNT = 40;

/* ─── Helper: split text into words ─── */
function splitWords(text: string): string[] {
  return text.replace(/\n/g, " ").split(" ").filter(Boolean);
}

/* ─── Kinetic Word Reveal ─── */
function KineticText({
  text,
  className = "",
  accentWord,
  delay = 0,
  style,
}: {
  text: string;
  className?: string;
  accentWord?: string;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const words = splitWords(text);

  return (
    <span ref={ref} className={className} style={{ display: "inline", ...style }}>
      {words.map((word, i) => {
        const isAccent = accentWord && word.toLowerCase() === accentWord.toLowerCase();
        return (
          <motion.span
            key={`${word}-${i}`}
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{
              duration: 0.4,
              delay: delay + i * 0.03,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            style={{
              display: "inline-block",
              marginRight: "0.3em",
              color: isAccent ? ACCENT : undefined,
            }}
          >
            {word}
          </motion.span>
        );
      })}
    </span>
  );
}

/* ─── Kinetic Character Reveal (for hero) ─── */
function CharReveal({
  text,
  className = "",
  style,
  delay = 0,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const chars = text.split("");

  return (
    <span ref={ref} className={className} style={{ display: "inline-block", ...style }}>
      {chars.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.04,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          style={{ display: "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

/* ─── Blackout Highlight ─── */
function BlackoutHighlight({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <span ref={ref} style={{ display: "inline-block", position: "relative" }}>
      <motion.span
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          position: "absolute",
          inset: "-2px -6px",
          background: "#FFFFFF",
          transformOrigin: "left center",
          zIndex: 0,
        }}
      />
      <span
        style={{
          position: "relative",
          zIndex: 1,
          color: "#000000",
          fontWeight: 700,
          padding: "0 6px",
        }}
      >
        {children}
      </span>
    </span>
  );
}

/* ─── Text Stripe Divider ─── */
function TextStripeDivider({ label }: { label: string }) {
  const repeated = Array(20).fill(`////// ${label} //////`).join("  ");
  return (
    <div
      style={{
        width: "100%",
        overflow: "hidden",
        padding: "12px 0",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div
        style={{
          whiteSpace: "nowrap",
          fontSize: "10px",
          letterSpacing: "0.15em",
          color: "rgba(255,255,255,0.12)",
          textTransform: "uppercase",
        }}
        className="font-[family-name:var(--font-jetbrains)]"
      >
        {repeated}
      </div>
    </div>
  );
}

/* ─── Giant Drifting Background Text ─── */
function DriftingBgText({
  word,
  top,
  left,
  size = "18rem",
  duration = 60,
  direction = 1,
}: {
  word: string;
  top: string;
  left: string;
  size?: string;
  duration?: number;
  direction?: number;
}) {
  return (
    <motion.div
      animate={{ x: [0, 30 * direction, 0], y: [0, -15 * direction, 0] }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
      style={{
        position: "absolute",
        top,
        left,
        fontSize: size,
        fontWeight: 900,
        color: "rgba(255,255,255,0.03)",
        lineHeight: 0.85,
        letterSpacing: "-0.04em",
        pointerEvents: "none",
        userSelect: "none",
        whiteSpace: "nowrap",
        zIndex: 0,
      }}
      className="font-[family-name:var(--font-space-grotesk)]"
    >
      {word}
    </motion.div>
  );
}

/* ─── Vertical Section Label ─── */
function VerticalLabel({
  text,
  side = "left",
}: {
  text: string;
  side?: "left" | "right";
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: "40px",
        [side]: "-40px",
        writingMode: "vertical-rl",
        textOrientation: "mixed",
        fontSize: "9px",
        letterSpacing: "0.25em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.15)",
        fontWeight: 500,
        whiteSpace: "nowrap",
        transform: side === "left" ? "rotate(180deg)" : undefined,
      }}
      className="font-[family-name:var(--font-space-grotesk)] hidden lg:block"
    >
      {text}
    </div>
  );
}

/* ─── Accent Glow Pulse ─── */
function AccentPulse({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      animate={{
        textShadow: [
          `0 0 20px ${ACCENT}66`,
          `0 0 40px ${ACCENT}44`,
          `0 0 20px ${ACCENT}66`,
        ],
      }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      style={{ color: ACCENT }}
    >
      {children}
    </motion.span>
  );
}

/* ─── Section Wrapper with in-view ─── */
function Section({
  children,
  id,
  className = "",
  style,
}: {
  children: React.ReactNode;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <section
      id={id}
      className={className}
      style={{
        position: "relative",
        paddingTop: "150px",
        paddingBottom: "150px",
        ...style,
      }}
    >
      {children}
    </section>
  );
}

/* ─── GROX Text Texture Block ─── */
function GroxTextureBlock() {
  const rows = useMemo(() => {
    return Array.from({ length: GROX_REPEAT_COUNT }, (_, i) =>
      Array.from({ length: 30 }, () => "GROX").join("  ")
    );
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
        pointerEvents: "none",
        userSelect: "none",
        zIndex: 0,
      }}
    >
      <div
        style={{
          fontSize: "10px",
          lineHeight: "14px",
          letterSpacing: "0.3em",
          color: "rgba(255,255,255,0.02)",
          fontWeight: 700,
          whiteSpace: "nowrap",
        }}
        className="font-[family-name:var(--font-space-grotesk)]"
      >
        {rows.map((row, i) => (
          <div key={i}>{row}</div>
        ))}
      </div>
    </div>
  );
}

/* ─── Project Card ─── */
function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const num = String(index + 1).padStart(2, "0");
  const title = project.title.replace(/\n/g, " ");
  const titleWords = splitWords(title);
  const descWords = splitWords(project.description);
  const techString = project.tech.join(" \u2022 ");

  // Pick a different accent word for each card
  const accentCandidates = ["AI", "Vision", "Production", "RAG", "Claude", "Creative", "Audio", "Analytics", "Design", "Platform"];
  const accentWord = accentCandidates[index % accentCandidates.length];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        position: "relative",
        overflow: "hidden",
        paddingTop: "60px",
        paddingBottom: "40px",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      {/* Giant background number */}
      <div
        style={{
          position: "absolute",
          top: "-20px",
          right: "-10px",
          fontSize: "clamp(10rem, 20vw, 18rem)",
          fontWeight: 900,
          lineHeight: 0.85,
          color: "rgba(255,255,255,0.04)",
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 0,
        }}
        className="font-[family-name:var(--font-orbitron)]"
      >
        {num}
      </div>

      {/* Content layer */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Number + Year row */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "16px",
            marginBottom: "8px",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.3)",
              fontWeight: 500,
            }}
            className="font-[family-name:var(--font-orbitron)]"
          >
            {num}
          </span>
          <span
            style={{
              fontSize: "10px",
              letterSpacing: "0.15em",
              color: "rgba(255,255,255,0.2)",
              textTransform: "uppercase",
            }}
            className="font-[family-name:var(--font-space-grotesk)]"
          >
            {project.client}
          </span>
          <span
            style={{
              fontSize: "10px",
              color: "rgba(255,255,255,0.15)",
            }}
            className="font-[family-name:var(--font-inter)]"
          >
            {project.year}
          </span>
        </div>

        {/* Title — kinetic word-by-word */}
        <h3
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            lineHeight: 1.05,
            fontWeight: 400,
            marginBottom: "20px",
            fontStyle: "italic",
            letterSpacing: "-0.02em",
          }}
          className="font-[family-name:var(--font-dm-serif)]"
        >
          {titleWords.map((word, i) => (
            <motion.span
              key={`${word}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{
                duration: 0.5,
                delay: i * 0.06,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              style={{ display: "inline-block", marginRight: "0.25em" }}
            >
              {word}
            </motion.span>
          ))}
        </h3>

        {/* Description */}
        <p
          style={{
            fontSize: "clamp(11px, 1.2vw, 13px)",
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.5)",
            maxWidth: "600px",
            marginBottom: "20px",
          }}
          className="font-[family-name:var(--font-inter)]"
        >
          <KineticText
            text={project.description}
            delay={0.2}
            accentWord={accentWord}
          />
        </p>

        {/* Tech tags as continuous text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            fontSize: "10px",
            letterSpacing: "0.1em",
            color: "rgba(255,255,255,0.25)",
            textTransform: "uppercase",
          }}
          className="font-[family-name:var(--font-space-grotesk)]"
        >
          {techString}
        </motion.p>
      </div>
    </motion.div>
  );
}

/* ─── Expertise Card ─── */
function ExpertiseCard({
  item,
  index,
}: {
  item: (typeof expertise)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const num = String(index + 1).padStart(2, "0");

  // One accent word per card
  const accentWords = ["Orchestration", "Vision", "Video", "Full-Stack"];
  const accentTarget = accentWords[index] || "";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      style={{
        position: "relative",
        padding: "40px 0",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Background number */}
      <div
        style={{
          position: "absolute",
          top: "-10px",
          right: 0,
          fontSize: "8rem",
          fontWeight: 900,
          lineHeight: 0.85,
          color: "rgba(255,255,255,0.03)",
          pointerEvents: "none",
          userSelect: "none",
        }}
        className="font-[family-name:var(--font-orbitron)]"
      >
        {num}
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <span
          style={{
            fontSize: "9px",
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.2)",
            display: "block",
            marginBottom: "12px",
          }}
          className="font-[family-name:var(--font-orbitron)]"
        >
          {num}
        </span>

        <h4
          style={{
            fontSize: "clamp(1.4rem, 3vw, 2rem)",
            lineHeight: 1.1,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
            marginBottom: "16px",
          }}
          className="font-[family-name:var(--font-space-grotesk)]"
        >
          {item.title.split(" ").map((word, i) => {
            const isAccent = word.toLowerCase().startsWith(accentTarget.toLowerCase().slice(0, 4));
            return (
              <span key={i}>
                {isAccent ? (
                  <AccentPulse>{word}</AccentPulse>
                ) : (
                  word
                )}
                {" "}
              </span>
            );
          })}
        </h4>

        <p
          style={{
            fontSize: "12px",
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.4)",
            maxWidth: "500px",
          }}
          className="font-[family-name:var(--font-inter)]"
        >
          <KineticText text={item.body} delay={0.15} />
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Tool Group Card ─── */
function ToolGroupCard({
  group,
  index,
}: {
  group: (typeof tools)[number];
  index: number;
}) {
  const toolRef = useRef<HTMLDivElement>(null);
  const toolInView = useInView(toolRef, { once: true, margin: "-50px" });

  return (
    <motion.div
      key={group.label}
      ref={toolRef}
      initial={{ opacity: 0, y: 20 }}
      animate={toolInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      style={{
        padding: "30px 0",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        borderRight: index % 2 === 0 ? "1px solid rgba(255,255,255,0.06)" : "none",
        paddingRight: index % 2 === 0 ? "30px" : "0",
        paddingLeft: index % 2 === 1 ? "30px" : "0",
      }}
    >
      {/* Category label */}
      <div
        style={{
          fontSize: "9px",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.2)",
          marginBottom: "16px",
          fontWeight: 600,
        }}
        className="font-[family-name:var(--font-orbitron)]"
      >
        {group.label}
      </div>

      {/* Items as continuous text */}
      <div
        style={{
          fontSize: "clamp(1rem, 2.5vw, 1.4rem)",
          lineHeight: 1.5,
          fontWeight: 500,
          letterSpacing: "-0.01em",
        }}
        className="font-[family-name:var(--font-space-grotesk)]"
      >
        {group.items.map((item, ii) => (
          <span key={item}>
            <motion.span
              initial={{ opacity: 0 }}
              animate={toolInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 + ii * 0.05 }}
              style={{
                color:
                  ii === 0
                    ? "rgba(255,255,255,0.9)"
                    : "rgba(255,255,255,0.5)",
              }}
            >
              {item}
            </motion.span>
            {ii < group.items.length - 1 && (
              <span style={{ color: "rgba(255,255,255,0.15)", margin: "0 8px" }}>
                /
              </span>
            )}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────── */
/* ─── MAIN PAGE COMPONENT ─── */
/* ─────────────────────────────────────────────── */

export default function DarktypePage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      style={{
        background: "#000000",
        color: "#FFFFFF",
        minHeight: "100vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* ═══════════════════════════════════════════ */}
      {/* HERO SECTION */}
      {/* ═══════════════════════════════════════════ */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* Giant drifting background words */}
        <DriftingBgText word="BUILD" top="5%" left="-5%" size="clamp(8rem, 18vw, 20rem)" duration={65} direction={1} />
        <DriftingBgText word="SHIP" top="25%" left="40%" size="clamp(7rem, 15vw, 17rem)" duration={70} direction={-1} />
        <DriftingBgText word="CREATE" top="55%" left="10%" size="clamp(8rem, 18vw, 20rem)" duration={75} direction={1} />
        <DriftingBgText word="AI" top="40%" left="65%" size="clamp(10rem, 22vw, 24rem)" duration={80} direction={-1} />
        <DriftingBgText word="DESIGN" top="75%" left="50%" size="clamp(6rem, 14vw, 16rem)" duration={60} direction={1} />

        {/* GROX texture */}
        <GroxTextureBlock />

        {/* Vertical label */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "20px",
            transform: "translateY(-50%) rotate(180deg)",
            writingMode: "vertical-rl",
            fontSize: "9px",
            letterSpacing: "0.3em",
            color: "rgba(255,255,255,0.1)",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
          className="font-[family-name:var(--font-space-grotesk)] hidden md:block"
        >
          GROX / AI PRODUCT STUDIO / 2025
        </div>

        {/* Vertical label right */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: "20px",
            transform: "translateY(-50%)",
            writingMode: "vertical-rl",
            fontSize: "9px",
            letterSpacing: "0.3em",
            color: "rgba(255,255,255,0.1)",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
          className="font-[family-name:var(--font-space-grotesk)] hidden md:block"
        >
          DARKTYPE / KINETIC TYPOGRAPHY
        </div>

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "1000px",
            margin: "0 auto",
            width: "100%",
            padding: "0 24px",
          }}
        >
          {/* Small top label */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            style={{
              fontSize: "9px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.25)",
              marginBottom: "40px",
            }}
            className="font-[family-name:var(--font-space-grotesk)]"
          >
            AI Product Studio
          </motion.div>

          {/* GIANT hero name — overlapping letterforms */}
          <div
            style={{
              position: "relative",
              marginBottom: "20px",
            }}
          >
            <h1
              style={{
                fontSize: "clamp(6rem, 18vw, 18rem)",
                fontWeight: 800,
                lineHeight: 0.82,
                letterSpacing: "-0.06em",
                margin: 0,
                position: "relative",
                zIndex: 2,
              }}
              className="font-[family-name:var(--font-playfair)]"
            >
              <CharReveal text="GR" delay={0.3} />
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                style={{
                  color: ACCENT,
                  display: "inline-block",
                  marginLeft: "-0.03em",
                  marginRight: "-0.03em",
                }}
              >
                O
              </motion.span>
              <CharReveal text="X" delay={0.7} />
            </h1>

            {/* Overlapping ghost text behind */}
            <div
              style={{
                position: "absolute",
                top: "15%",
                left: "5%",
                fontSize: "clamp(5rem, 16vw, 16rem)",
                fontWeight: 400,
                fontStyle: "italic",
                lineHeight: 0.85,
                letterSpacing: "-0.04em",
                color: "rgba(255,255,255,0.04)",
                pointerEvents: "none",
                userSelect: "none",
                zIndex: 1,
                transform: `translateY(${scrollY * 0.02}px)`,
              }}
              className="font-[family-name:var(--font-instrument)]"
            >
              studio
            </div>
          </div>

          {/* Subtitle with blackout highlight */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            style={{
              fontSize: "clamp(12px, 1.5vw, 16px)",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.5)",
              maxWidth: "480px",
              marginBottom: "50px",
            }}
            className="font-[family-name:var(--font-inter)]"
          >
            Building{" "}
            <BlackoutHighlight delay={1.2}>intelligent products</BlackoutHighlight>{" "}
            at the intersection of design craft and machine learning. From concept to production.
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            style={{
              display: "flex",
              gap: "clamp(30px, 5vw, 60px)",
            }}
          >
            {stats.map((stat, i) => (
              <div key={stat.label}>
                <div
                  style={{
                    fontSize: "clamp(2.5rem, 5vw, 4rem)",
                    fontWeight: 800,
                    lineHeight: 1,
                    letterSpacing: "-0.04em",
                    marginBottom: "4px",
                  }}
                  className="font-[family-name:var(--font-orbitron)]"
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.3)",
                  }}
                  className="font-[family-name:var(--font-space-grotesk)]"
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
          transition={{ duration: 1, delay: 2 }}
          style={{
            position: "absolute",
            bottom: "40px",
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
          }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              fontSize: "9px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.15)",
            }}
            className="font-[family-name:var(--font-space-grotesk)]"
          >
            Scroll
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* TEXT STRIPE: SELECTED WORK */}
      {/* ═══════════════════════════════════════════ */}
      <TextStripeDivider label="SELECTED WORK" />

      {/* ═══════════════════════════════════════════ */}
      {/* PROJECTS SECTION */}
      {/* ═══════════════════════════════════════════ */}
      <Section id="projects">
        {/* Giant drifting background */}
        <DriftingBgText word="WORK" top="5%" left="60%" size="clamp(8rem, 16vw, 16rem)" duration={55} direction={-1} />
        <DriftingBgText word="CODE" top="45%" left="-5%" size="clamp(7rem, 14vw, 14rem)" duration={65} direction={1} />
        <DriftingBgText word="CRAFT" top="80%" left="40%" size="clamp(6rem, 12vw, 12rem)" duration={70} direction={-1} />

        <div
          style={{
            position: "relative",
            maxWidth: "1000px",
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          <VerticalLabel text="Selected Projects" side="left" />

          {/* Section header */}
          <div style={{ marginBottom: "80px" }}>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              style={{
                fontSize: "9px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.2)",
                display: "block",
                marginBottom: "16px",
              }}
              className="font-[family-name:var(--font-orbitron)]"
            >
              01 / PROJECTS
            </motion.span>

            <h2
              style={{
                fontSize: "clamp(3rem, 8vw, 7rem)",
                fontWeight: 700,
                lineHeight: 0.9,
                letterSpacing: "-0.04em",
                textTransform: "uppercase",
                margin: 0,
              }}
              className="font-[family-name:var(--font-space-grotesk)]"
            >
              <KineticText text="Selected" />
              <br />
              <span style={{ display: "inline-block" }}>
                <AccentPulse>Work</AccentPulse>
              </span>
            </h2>

            {/* Ghost decorative text behind heading */}
            <div
              style={{
                fontSize: "clamp(3rem, 10vw, 10rem)",
                fontWeight: 400,
                fontStyle: "italic",
                lineHeight: 0.85,
                color: "rgba(255,255,255,0.03)",
                marginTop: "-60px",
                marginLeft: "clamp(60px, 10vw, 120px)",
                pointerEvents: "none",
                userSelect: "none",
              }}
              className="font-[family-name:var(--font-instrument)]"
            >
              projects
            </div>
          </div>

          {/* Project list */}
          <div>
            {projects.map((project, i) => (
              <ProjectCard key={project.title} project={project} index={i} />
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════ */}
      {/* TEXT STRIPE: EXPERTISE */}
      {/* ═══════════════════════════════════════════ */}
      <TextStripeDivider label="EXPERTISE" />

      {/* ═══════════════════════════════════════════ */}
      {/* EXPERTISE SECTION */}
      {/* ═══════════════════════════════════════════ */}
      <Section id="expertise">
        <DriftingBgText word="THINK" top="10%" left="50%" size="clamp(8rem, 16vw, 16rem)" duration={60} direction={1} />
        <DriftingBgText word="SOLVE" top="60%" left="-10%" size="clamp(7rem, 14vw, 14rem)" duration={70} direction={-1} />

        {/* GROX texture layer */}
        <GroxTextureBlock />

        <div
          style={{
            position: "relative",
            maxWidth: "1000px",
            margin: "0 auto",
            padding: "0 24px",
            zIndex: 1,
          }}
        >
          <VerticalLabel text="Core Expertise" side="right" />

          {/* Section header */}
          <div style={{ marginBottom: "60px" }}>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              style={{
                fontSize: "9px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.2)",
                display: "block",
                marginBottom: "16px",
              }}
              className="font-[family-name:var(--font-orbitron)]"
            >
              02 / EXPERTISE
            </motion.span>

            <h2
              style={{
                fontSize: "clamp(3rem, 8vw, 7rem)",
                fontWeight: 700,
                lineHeight: 0.9,
                letterSpacing: "-0.04em",
                textTransform: "uppercase",
                margin: 0,
              }}
              className="font-[family-name:var(--font-space-grotesk)]"
            >
              <KineticText text="What I" />
              <br />
              <span style={{ display: "inline-block" }}>
                <AccentPulse>Build</AccentPulse>
              </span>
            </h2>

            {/* Ghost decorative */}
            <div
              style={{
                fontSize: "clamp(3rem, 10vw, 10rem)",
                fontWeight: 400,
                fontStyle: "italic",
                lineHeight: 0.85,
                color: "rgba(255,255,255,0.03)",
                marginTop: "-55px",
                marginLeft: "clamp(50px, 8vw, 100px)",
                pointerEvents: "none",
                userSelect: "none",
              }}
              className="font-[family-name:var(--font-instrument)]"
            >
              expertise
            </div>
          </div>

          {/* Expertise cards */}
          <div>
            {expertise.map((item, i) => (
              <ExpertiseCard key={item.title} item={item} index={i} />
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════ */}
      {/* TEXT STRIPE: TOOLS */}
      {/* ═══════════════════════════════════════════ */}
      <TextStripeDivider label="TOOLKIT" />

      {/* ═══════════════════════════════════════════ */}
      {/* TOOLS SECTION */}
      {/* ═══════════════════════════════════════════ */}
      <Section id="tools">
        <DriftingBgText word="STACK" top="15%" left="55%" size="clamp(7rem, 14vw, 14rem)" duration={65} direction={-1} />
        <DriftingBgText word="TOOLS" top="55%" left="-5%" size="clamp(8rem, 16vw, 16rem)" duration={75} direction={1} />

        <div
          style={{
            position: "relative",
            maxWidth: "1000px",
            margin: "0 auto",
            padding: "0 24px",
            zIndex: 1,
          }}
        >
          <VerticalLabel text="Technology Stack" side="left" />

          {/* Section header */}
          <div style={{ marginBottom: "80px" }}>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              style={{
                fontSize: "9px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.2)",
                display: "block",
                marginBottom: "16px",
              }}
              className="font-[family-name:var(--font-orbitron)]"
            >
              03 / TOOLKIT
            </motion.span>

            <h2
              style={{
                fontSize: "clamp(3rem, 8vw, 7rem)",
                fontWeight: 700,
                lineHeight: 0.9,
                letterSpacing: "-0.04em",
                textTransform: "uppercase",
                margin: 0,
              }}
              className="font-[family-name:var(--font-space-grotesk)]"
            >
              <KineticText text="The" />
              <br />
              <span style={{ display: "inline-block" }}>
                <AccentPulse>Stack</AccentPulse>
              </span>
            </h2>

            {/* Ghost decorative */}
            <div
              style={{
                fontSize: "clamp(3rem, 10vw, 10rem)",
                fontWeight: 400,
                fontStyle: "italic",
                lineHeight: 0.85,
                color: "rgba(255,255,255,0.03)",
                marginTop: "-55px",
                marginLeft: "clamp(40px, 6vw, 80px)",
                pointerEvents: "none",
                userSelect: "none",
              }}
              className="font-[family-name:var(--font-instrument)]"
            >
              toolkit
            </div>
          </div>

          {/* Tools grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(280px, 100%), 1fr))",
              gap: "0",
            }}
          >
            {tools.map((group, gi) => (
              <ToolGroupCard key={group.label} group={group} index={gi} />
            ))}
          </div>

          {/* Decorative tools list — continuous text block */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            style={{
              marginTop: "80px",
              padding: "30px 0",
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <p
              style={{
                fontSize: "10px",
                lineHeight: 2.2,
                letterSpacing: "0.08em",
                color: "rgba(255,255,255,0.12)",
                textTransform: "uppercase",
                textAlign: "center",
                maxWidth: "700px",
                margin: "0 auto",
              }}
              className="font-[family-name:var(--font-space-grotesk)]"
            >
              {tools
                .flatMap((g) => g.items)
                .join(" \u2022 ")}
            </p>
          </motion.div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════ */}
      {/* TEXT STRIPE: CONTACT */}
      {/* ═══════════════════════════════════════════ */}
      <TextStripeDivider label="CONTACT" />

      {/* ═══════════════════════════════════════════ */}
      {/* FOOTER SECTION */}
      {/* ═══════════════════════════════════════════ */}
      <Section id="footer" style={{ paddingBottom: "200px" }}>
        <DriftingBgText word="HELLO" top="10%" left="30%" size="clamp(8rem, 18vw, 20rem)" duration={60} direction={1} />
        <DriftingBgText word="GROX" top="50%" left="-10%" size="clamp(10rem, 22vw, 24rem)" duration={75} direction={-1} />

        <div
          style={{
            position: "relative",
            maxWidth: "1000px",
            margin: "0 auto",
            padding: "0 24px",
            zIndex: 1,
          }}
        >
          <VerticalLabel text="Get In Touch" side="right" />

          {/* Section header */}
          <div style={{ marginBottom: "60px" }}>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              style={{
                fontSize: "9px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.2)",
                display: "block",
                marginBottom: "16px",
              }}
              className="font-[family-name:var(--font-orbitron)]"
            >
              04 / CONTACT
            </motion.span>

            <h2
              style={{
                fontSize: "clamp(3rem, 8vw, 7rem)",
                fontWeight: 700,
                lineHeight: 0.9,
                letterSpacing: "-0.04em",
                textTransform: "uppercase",
                margin: 0,
              }}
              className="font-[family-name:var(--font-space-grotesk)]"
            >
              <KineticText text="Let's" />
              <br />
              <span style={{ display: "inline-block" }}>
                <AccentPulse>Talk</AccentPulse>
              </span>
            </h2>

            <div
              style={{
                fontSize: "clamp(3rem, 10vw, 10rem)",
                fontWeight: 400,
                fontStyle: "italic",
                lineHeight: 0.85,
                color: "rgba(255,255,255,0.03)",
                marginTop: "-55px",
                marginLeft: "clamp(30px, 5vw, 70px)",
                pointerEvents: "none",
                userSelect: "none",
              }}
              className="font-[family-name:var(--font-instrument)]"
            >
              connect
            </div>
          </div>

          {/* Footer content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p
              style={{
                fontSize: "clamp(13px, 1.5vw, 16px)",
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.5)",
                maxWidth: "500px",
                marginBottom: "50px",
              }}
              className="font-[family-name:var(--font-inter)]"
            >
              Interested in building{" "}
              <BlackoutHighlight delay={0.3}>AI-powered products</BlackoutHighlight>
              ? From prototype to production, I bring ideas to life with thoughtful
              engineering and design craft.
            </p>

            {/* Links row */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "30px",
                alignItems: "center",
                marginBottom: "80px",
              }}
            >
              {[
                { label: "GitHub", href: "https://github.com/1aday" },
                { label: "Email", href: "mailto:hello@grox.studio" },
              ].map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  whileHover={{ color: ACCENT }}
                  style={{
                    fontSize: "12px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.4)",
                    textDecoration: "none",
                    fontWeight: 500,
                    transition: "color 0.3s ease",
                  }}
                  className="font-[family-name:var(--font-space-grotesk)]"
                >
                  {link.label} →
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Giant decorative GROX at bottom */}
          <div style={{ position: "relative", overflow: "visible" }}>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
              style={{
                fontSize: "clamp(6rem, 20vw, 22rem)",
                fontWeight: 800,
                lineHeight: 0.8,
                letterSpacing: "-0.07em",
                color: "rgba(255,255,255,0.03)",
                textAlign: "center",
                pointerEvents: "none",
                userSelect: "none",
                marginBottom: "-20px",
              }}
              className="font-[family-name:var(--font-playfair)]"
            >
              GROX
            </motion.div>

            {/* Overlapping smaller text */}
            <div
              style={{
                position: "absolute",
                bottom: "20%",
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: "clamp(2rem, 6vw, 5rem)",
                fontWeight: 400,
                fontStyle: "italic",
                color: "rgba(255,255,255,0.05)",
                pointerEvents: "none",
                userSelect: "none",
                whiteSpace: "nowrap",
              }}
              className="font-[family-name:var(--font-instrument)]"
            >
              ai product studio
            </div>
          </div>

          {/* Bottom bar */}
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              paddingTop: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <span
              style={{
                fontSize: "9px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.15)",
              }}
              className="font-[family-name:var(--font-space-grotesk)]"
            >
              &copy; {new Date().getFullYear()} Grox
            </span>

            <span
              style={{
                fontSize: "9px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.1)",
              }}
              className="font-[family-name:var(--font-jetbrains)]"
            >
              DARKTYPE v1.0
            </span>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════ */}
      {/* THEME SWITCHER */}
      {/* ═══════════════════════════════════════════ */}
      <ThemeSwitcher current="/darktype" />
    </div>
  );
}
