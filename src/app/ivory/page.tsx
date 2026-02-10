"use client";
import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";

/* ─── Palette ─── */
const C = {
  bg: "#FEFCF3",
  text: "#1C1917",
  muted: "#78716C",
  dim: "#A8A29E",
  accent: "rgba(180,83,9,0.6)",
  rule: "#E7E5E4",
};

/* ─── Slow scroll-reveal ─── */
function Reveal({
  children,
  className = "",
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ─── Thin horizontal rule ─── */
function Rule() {
  return <div style={{ width: "100%", height: 1, background: C.rule }} />;
}

/* ─── Rose-gold accent bar (40px wide, centered) ─── */
function AccentBar() {
  return (
    <div
      style={{
        width: 40,
        height: 1,
        background: C.accent,
        margin: "0 auto",
      }}
    />
  );
}

/* ─── Expandable project row ─── */
function ProjectRow({
  project,
  index,
  isExpanded,
  onToggle,
}: {
  project: (typeof projects)[0];
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [hovered, setHovered] = useState(false);

  const num = String(index + 1).padStart(2, "0");
  const title = project.title.replace(/\n/g, " ");

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 1.2,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* ── Clickable row ── */}
      <button
        onClick={onToggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "grid",
          gridTemplateColumns: "40px 1fr auto auto 28px",
          alignItems: "center",
          gap: "0 16px",
          width: "100%",
          padding: "20px 0",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        {/* Number */}
        <span
          className="font-[family-name:var(--font-body)]"
          style={{
            fontSize: 13,
            fontWeight: 300,
            color: isExpanded ? C.accent : C.dim,
            transition: "color 0.4s ease",
          }}
        >
          {num}
        </span>

        {/* Title */}
        <span
          className="font-[family-name:var(--font-body)]"
          style={{
            fontSize: 15,
            fontWeight: 400,
            color: hovered || isExpanded ? C.text : C.text,
            transition: "color 0.4s ease",
            lineHeight: 1.4,
          }}
        >
          {title}
        </span>

        {/* Client */}
        <span
          className="font-[family-name:var(--font-inter)]"
          style={{
            fontSize: 10,
            fontWeight: 400,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: C.dim,
            display: "none",
          }}
          // Show on desktop only via className
        >
          {project.client}
        </span>

        {/* Client (visible) + Year */}
        <span
          className="font-[family-name:var(--font-inter)] hidden sm:block"
          style={{
            fontSize: 10,
            fontWeight: 400,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: C.dim,
            whiteSpace: "nowrap",
          }}
        >
          {project.client}
          <span style={{ margin: "0 12px", color: C.rule }}>|</span>
          {project.year}
        </span>

        {/* Arrow */}
        <motion.span
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontSize: 14,
            color: isExpanded ? C.accent : C.dim,
            transition: "color 0.4s ease",
            display: "inline-block",
            lineHeight: 1,
          }}
        >
          &rarr;
        </motion.span>
      </button>

      {/* ── Expanded detail ── */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                paddingLeft: 56,
                paddingBottom: 32,
                paddingTop: 4,
              }}
            >
              {/* Description */}
              <p
                className="font-[family-name:var(--font-body)]"
                style={{
                  fontSize: 14,
                  fontWeight: 300,
                  color: C.muted,
                  lineHeight: 1.75,
                  maxWidth: 600,
                  marginBottom: 16,
                }}
              >
                {project.description}
              </p>

              {/* Technical */}
              <p
                className="font-[family-name:var(--font-body)]"
                style={{
                  fontSize: 13,
                  fontWeight: 300,
                  color: C.dim,
                  lineHeight: 1.7,
                  maxWidth: 600,
                  marginBottom: 20,
                }}
              >
                {project.technical}
              </p>

              {/* Tech tags */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px 16px",
                  marginBottom: 16,
                }}
              >
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="font-[family-name:var(--font-inter)]"
                    style={{
                      fontSize: 10,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: C.dim,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Project image (visible only when expanded) */}
              <div style={{ marginTop: 16, width: 200, height: 112, overflow: "hidden", borderRadius: 4, position: "relative", opacity: 0.5 }}>
                <img
                  src={project.image}
                  alt=""
                  loading="lazy"
                  style={{
                    display: "block", width: "100%", height: "100%", objectFit: "cover",
                    filter: "sepia(0.3) brightness(0.8)",
                  }}
                />
              </div>

              {/* GitHub link */}
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="font-[family-name:var(--font-body)]"
                style={{
                  fontSize: 12,
                  fontWeight: 400,
                  color: C.muted,
                  textDecoration: "none",
                  borderBottom: `1px solid ${C.rule}`,
                  paddingBottom: 2,
                  transition: "color 0.3s ease, border-color 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = C.text;
                  e.currentTarget.style.borderColor = C.text;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = C.muted;
                  e.currentTarget.style.borderColor = C.rule;
                }}
              >
                View on GitHub
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom rule */}
      <Rule />
    </motion.div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Page
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function IvoryPage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [navWorkHovered, setNavWorkHovered] = useState(false);
  const [navAboutHovered, setNavAboutHovered] = useState(false);
  const [navGHHovered, setNavGHHovered] = useState(false);

  const handleToggle = (i: number) => {
    setExpandedIndex((prev) => (prev === i ? null : i));
  };

  /* ── Stats sentence ── */
  const statsSentence = `${stats[0].value} projects across ${stats[2].value} industries, powered by ${stats[1].value} AI models.`;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: C.bg,
        color: C.text,
        position: "relative",
        overflowX: "hidden",
        colorScheme: "light",
      }}
    >
      {/* ── Marble texture overlay ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: "url(/themes/ivory/marble-texture.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          opacity: 0.15,
          mixBlendMode: "multiply",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── Navigation ── */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: "transparent",
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            padding: "24px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <a
            href="#"
            className="font-[family-name:var(--font-body)]"
            style={{
              fontSize: 14,
              fontWeight: 400,
              color: C.text,
              textDecoration: "none",
              letterSpacing: "0.02em",
            }}
          >
            Grox
          </a>

          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <a
              href="#work"
              className="font-[family-name:var(--font-inter)]"
              onMouseEnter={() => setNavWorkHovered(true)}
              onMouseLeave={() => setNavWorkHovered(false)}
              style={{
                fontSize: 10,
                fontWeight: 400,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: navWorkHovered ? C.text : C.muted,
                textDecoration: "none",
                transition: "color 0.4s ease",
              }}
            >
              Work
            </a>
            <a
              href="#expertise"
              className="font-[family-name:var(--font-inter)]"
              onMouseEnter={() => setNavAboutHovered(true)}
              onMouseLeave={() => setNavAboutHovered(false)}
              style={{
                fontSize: 10,
                fontWeight: 400,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: navAboutHovered ? C.text : C.muted,
                textDecoration: "none",
                transition: "color 0.4s ease",
              }}
            >
              About
            </a>
            <a
              href="https://github.com/1aday"
              target="_blank"
              rel="noopener noreferrer"
              className="font-[family-name:var(--font-inter)]"
              onMouseEnter={() => setNavGHHovered(true)}
              onMouseLeave={() => setNavGHHovered(false)}
              style={{
                fontSize: 10,
                fontWeight: 400,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: navGHHovered ? C.text : C.muted,
                textDecoration: "none",
                transition: "color 0.4s ease",
              }}
            >
              GitHub
            </a>
          </div>
        </div>
      </motion.nav>

      {/* ── Hero ── */}
      <section
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 24px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: "center" }}
        >
          {/* "Grox" — the ONE Playfair word */}
          <h1
            className="font-[family-name:var(--font-playfair)]"
            style={{
              fontSize: "clamp(5rem, 15vw, 14rem)",
              fontWeight: 400,
              color: C.text,
              lineHeight: 1,
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            Grox
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.2,
              delay: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="font-[family-name:var(--font-body)]"
            style={{
              fontSize: 14,
              fontWeight: 300,
              color: C.muted,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              marginTop: 20,
            }}
          >
            AI Product Studio
          </motion.p>

          {/* Rose-gold accent bar */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{
              duration: 1.2,
              delay: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ marginTop: 32 }}
          >
            <AccentBar />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Stats sentence ── */}
      <section
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 900,
          margin: "0 auto",
          padding: "0 24px 0",
        }}
      >
        <Reveal>
          <p
            className="font-[family-name:var(--font-body)]"
            style={{
              fontSize: 16,
              fontWeight: 300,
              color: C.muted,
              lineHeight: 1.8,
              textAlign: "center",
              maxWidth: 520,
              margin: "0 auto",
            }}
          >
            {statsSentence}
          </p>
        </Reveal>
      </section>

      {/* ── Projects (expandable numbered list) ── */}
      <section
        id="work"
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 900,
          margin: "0 auto",
          padding: "192px 24px",
        }}
      >
        <Reveal>
          <Rule />
          {projects.map((project, i) => (
            <ProjectRow
              key={project.title}
              project={project}
              index={i}
              isExpanded={expandedIndex === i}
              onToggle={() => handleToggle(i)}
            />
          ))}
        </Reveal>
      </section>

      {/* ── Expertise ── */}
      <section
        id="expertise"
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 900,
          margin: "0 auto",
          padding: "0 24px 192px",
        }}
      >
        {expertise.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.08}>
            {i === 0 && <Rule />}
            <div style={{ padding: "40px 0" }}>
              <h3
                className="font-[family-name:var(--font-body)]"
                style={{
                  fontSize: 16,
                  fontWeight: 400,
                  color: C.text,
                  marginBottom: 12,
                  lineHeight: 1.4,
                }}
              >
                {item.title}
              </h3>
              <p
                className="font-[family-name:var(--font-body)]"
                style={{
                  fontSize: 14,
                  fontWeight: 300,
                  color: C.muted,
                  lineHeight: 1.8,
                  maxWidth: 600,
                }}
              >
                {item.body}
              </p>
            </div>
            <Rule />
          </Reveal>
        ))}
      </section>

      {/* ── Tools (inline flowing text) ── */}
      <section
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 900,
          margin: "0 auto",
          padding: "0 24px 192px",
        }}
      >
        <Reveal>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {tools.map((group, gi) => (
              <Reveal key={group.label} delay={gi * 0.05}>
                <p
                  className="font-[family-name:var(--font-body)]"
                  style={{
                    fontSize: 14,
                    fontWeight: 300,
                    color: C.muted,
                    lineHeight: 1.7,
                  }}
                >
                  <span style={{ fontWeight: 400, color: C.text }}>
                    {group.label}
                  </span>
                  {"  "}
                  {group.items.join(", ")}
                </p>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 900,
          margin: "0 auto",
          padding: "0 24px 80px",
          textAlign: "center",
        }}
      >
        <Reveal>
          <AccentBar />
          <p
            className="font-[family-name:var(--font-body)]"
            style={{
              fontSize: "2rem",
              fontWeight: 300,
              color: C.dim,
              marginTop: 32,
              lineHeight: 1,
            }}
          >
            .
          </p>
        </Reveal>
      </footer>

      {/* ── Theme Switcher ── */}
      <ThemeSwitcher current="/ivory" variant="light" />
    </main>
  );
}
