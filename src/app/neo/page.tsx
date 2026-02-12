"use client";
import { useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { getProjectImage } from "@/lib/theme-images";

/* ─── Palette ─── */
const accentColors = ["#3B82F6", "#22C55E", "#FACC15", "#EC4899", "#F97316"];
const bg = "#F5F5F0";
const cardBg = "#FFFFFF";
const border = "#222222";
const text = "#1A1A1A";

/* ─── Reveal wrapper ─── */
function Reveal({
  children,
  delay = 0,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Project Card ─── */
function ProjectCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
  const accent = accentColors[index % 5];
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.a
      href={project.github}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        background: cardBg,
        border: `2px solid ${border}`,
        borderRadius: 12,
        boxShadow: `4px 4px 0 ${accent}`,
        padding: "28px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        cursor: "pointer",
        textDecoration: "none",
        color: text,
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      whileHover={{
        x: -2,
        y: -2,
        boxShadow: `6px 6px 0 ${accent}`,
      }}
    >
      {/* Project image */}
      <div style={{ margin: "-28px -24px 14px -24px", overflow: "hidden", borderRadius: "10px 10px 0 0", position: "relative" }}>
        <img
          src={getProjectImage("neo", project.image)}
          alt={project.title.replace(/\n/g, " ")}
          loading="lazy"
          style={{
            display: "block", width: "100%", aspectRatio: "16/9", objectFit: "cover",
            filter: "saturate(1.2) brightness(0.85) contrast(1.1)",
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: `${accent}33` }} />
      </div>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span
          style={{
            fontFamily: "var(--font-jakarta)",
            fontWeight: 800,
            fontSize: "1.5rem",
            color: accent,
            lineHeight: 1,
          }}
        >
          {num}
        </span>
        <span
          style={{
            fontFamily: "var(--font-manrope)",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "#888",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {project.client} &middot; {project.year}
        </span>
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: "var(--font-jakarta)",
          fontWeight: 800,
          fontSize: "1.25rem",
          lineHeight: 1.25,
          margin: 0,
          whiteSpace: "pre-line",
        }}
      >
        {project.title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontFamily: "var(--font-manrope)",
          fontSize: "0.9rem",
          lineHeight: 1.6,
          color: "#444",
          margin: 0,
        }}
      >
        {project.description}
      </p>

      {/* Technical */}
      <p
        style={{
          fontFamily: "var(--font-manrope)",
          fontSize: "0.8rem",
          lineHeight: 1.55,
          color: "#666",
          margin: 0,
        }}
      >
        {project.technical}
      </p>

      {/* Tech Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
        {project.tech.map((t) => (
          <span
            key={t}
            style={{
              fontFamily: "var(--font-manrope)",
              fontSize: "0.7rem",
              fontWeight: 600,
              padding: "4px 10px",
              borderRadius: 999,
              background: `${accent}26`,
              color: accent === "#FACC15" ? "#92400E" : accent,
              whiteSpace: "nowrap",
            }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* GitHub link indicator */}
      <div
        style={{
          fontFamily: "var(--font-manrope)",
          fontSize: "0.75rem",
          fontWeight: 700,
          color: accent,
          display: "flex",
          alignItems: "center",
          gap: 4,
          marginTop: "auto",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
        View on GitHub &rarr;
      </div>
    </motion.a>
  );
}

/* ─── Main Page ─── */
export default function NeoPage() {
  useEffect(() => {
    document.documentElement.style.colorScheme = "light";
    return () => {
      document.documentElement.style.colorScheme = "";
    };
  }, []);

  const navLinks = [
    { label: "Projects", href: "#projects" },
    { label: "Expertise", href: "#expertise" },
    { label: "Tools", href: "#tools" },
    { label: "Contact", href: "#footer" },
  ];

  return (
    <div
      style={{
        background: bg,
        color: text,
        minHeight: "100vh",
        fontFamily: "var(--font-manrope)",
      }}
    >
      {/* ─── NAV ─── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: cardBg,
          borderBottom: `3px solid ${border}`,
          padding: "0 24px",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 64,
          }}
        >
          {/* Logo */}
          <a
            href="#"
            style={{
              fontFamily: "var(--font-jakarta)",
              fontWeight: 800,
              fontSize: "1.5rem",
              color: text,
              textDecoration: "none",
              letterSpacing: "-0.02em",
            }}
          >
            grox
            <span style={{ color: "#3B82F6", fontSize: "1.6rem", lineHeight: 0 }}>.</span>
          </a>

          {/* Links */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {navLinks.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                style={{
                  fontFamily: "var(--font-manrope)",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  color: text,
                  textDecoration: "none",
                  padding: "6px 14px",
                  borderRadius: 999,
                  transition: "background 0.2s, color 0.2s",
                }}
                onMouseEnter={(e) => {
                  const accent = accentColors[i % 5];
                  e.currentTarget.style.background = accent;
                  e.currentTarget.style.color = accent === "#FACC15" ? "#1A1A1A" : "#FFFFFF";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = text;
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section
        style={{
          paddingTop: 140,
          paddingBottom: 80,
          textAlign: "center",
          maxWidth: 900,
          margin: "0 auto",
          padding: "140px 24px 80px",
        }}
      >
        <Reveal>
          <h1
            style={{
              fontFamily: "var(--font-jakarta)",
              fontWeight: 800,
              fontSize: "clamp(2.5rem, 8vw, 6rem)",
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              margin: "0 0 40px",
            }}
          >
            I turn{" "}
            <span
              style={{
                background: "#FACC15",
                padding: "0 8px",
                borderRadius: 6,
                display: "inline",
                boxDecorationBreak: "clone",
                WebkitBoxDecorationBreak: "clone",
              }}
            >
              AI models
            </span>{" "}
            into products people use
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <p
            style={{
              fontFamily: "var(--font-manrope)",
              fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
              lineHeight: 1.6,
              color: "#555",
              maxWidth: 600,
              margin: "0 auto 48px",
            }}
          >
            AI product studio specializing in multi-model orchestration, computer vision, and
            generative media pipelines.
          </p>
        </Reveal>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          {stats.map((stat, i) => {
            const accent = accentColors[i % 5];
            return (
              <Reveal key={stat.label} delay={0.15 + i * 0.08}>
                <div
                  style={{
                    border: `2px solid ${accent}`,
                    borderRadius: 12,
                    padding: "20px 32px",
                    minWidth: 140,
                    background: cardBg,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-jakarta)",
                      fontWeight: 800,
                      fontSize: "2rem",
                      color: accent === "#FACC15" ? "#92400E" : accent,
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-manrope)",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: "#666",
                      marginTop: 6,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ─── PROJECTS ─── */}
      <section
        id="projects"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "40px 24px 80px",
        }}
      >
        <Reveal>
          <h2
            style={{
              fontFamily: "var(--font-jakarta)",
              fontWeight: 800,
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              marginBottom: 40,
              letterSpacing: "-0.02em",
            }}
          >
            Selected Work
          </h2>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 480px), 1fr))",
            gap: 24,
          }}
        >
          {projects.map((project, i) => (
            <Reveal key={project.title} delay={i * 0.06}>
              <ProjectCard project={project} index={i} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─── EXPERTISE ─── */}
      <section
        id="expertise"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "40px 24px 80px",
        }}
      >
        <Reveal>
          <h2
            style={{
              fontFamily: "var(--font-jakarta)",
              fontWeight: 800,
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              marginBottom: 40,
              letterSpacing: "-0.02em",
            }}
          >
            Expertise
          </h2>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
            gap: 20,
          }}
        >
          {expertise.map((item, i) => {
            const accent = accentColors[i % 5];
            const num = String(i + 1).padStart(2, "0");
            return (
              <Reveal key={item.title} delay={i * 0.08}>
                <motion.div
                  style={{
                    background: cardBg,
                    border: `2px solid ${border}`,
                    borderRadius: 12,
                    boxShadow: `4px 4px 0 ${accent}`,
                    padding: "28px 24px",
                    height: "100%",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  whileHover={{
                    x: -2,
                    y: -2,
                    boxShadow: `6px 6px 0 ${accent}`,
                  }}
                >
                  {/* Number circle */}
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: accent,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 16,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-jakarta)",
                        fontWeight: 800,
                        fontSize: "0.85rem",
                        color: accent === "#FACC15" ? "#1A1A1A" : "#FFFFFF",
                      }}
                    >
                      {num}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontFamily: "var(--font-jakarta)",
                      fontWeight: 800,
                      fontSize: "1.1rem",
                      margin: "0 0 10px",
                      lineHeight: 1.3,
                    }}
                  >
                    {item.title}
                  </h3>

                  <p
                    style={{
                      fontFamily: "var(--font-manrope)",
                      fontSize: "0.85rem",
                      lineHeight: 1.6,
                      color: "#555",
                      margin: 0,
                    }}
                  >
                    {item.body}
                  </p>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ─── TOOLS ─── */}
      <section
        id="tools"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "40px 24px 80px",
        }}
      >
        <Reveal>
          <h2
            style={{
              fontFamily: "var(--font-jakarta)",
              fontWeight: 800,
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              marginBottom: 40,
              letterSpacing: "-0.02em",
            }}
          >
            Toolbox
          </h2>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
            gap: 24,
          }}
        >
          {tools.map((group, gi) => {
            const accent = accentColors[gi % 5];
            return (
              <Reveal key={group.label} delay={gi * 0.06}>
                <div
                  style={{
                    background: cardBg,
                    border: `2px solid ${border}`,
                    borderRadius: 12,
                    boxShadow: `4px 4px 0 ${accent}`,
                    padding: "24px",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "var(--font-jakarta)",
                      fontWeight: 800,
                      fontSize: "0.95rem",
                      margin: "0 0 14px",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      color: accent === "#FACC15" ? "#92400E" : accent,
                    }}
                  >
                    {group.label}
                  </h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {group.items.map((item, ii) => {
                      const chipAccent = accentColors[(gi + ii) % 5];
                      return (
                        <span
                          key={item}
                          style={{
                            fontFamily: "var(--font-manrope)",
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            padding: "6px 14px",
                            borderRadius: 999,
                            background: `${chipAccent}20`,
                            color: chipAccent === "#FACC15" ? "#92400E" : chipAccent,
                            border: `1.5px solid ${chipAccent}40`,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer
        id="footer"
        style={{
          borderTop: `3px solid ${border}`,
          padding: "60px 24px",
          textAlign: "center",
        }}
      >
        <Reveal>
          <h2
            style={{
              fontFamily: "var(--font-jakarta)",
              fontWeight: 800,
              fontSize: "clamp(1.75rem, 5vw, 3rem)",
              margin: "0 0 16px",
              letterSpacing: "-0.02em",
            }}
          >
            Let&apos;s build something{" "}
            <span style={{ color: "#3B82F6" }}>fun</span>.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p
            style={{
              fontFamily: "var(--font-manrope)",
              fontSize: "1rem",
              color: "#666",
              margin: "0 0 24px",
            }}
          >
            Always open to interesting AI product collaborations.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <a
            href="mailto:hello@grox.ai"
            style={{
              fontFamily: "var(--font-jakarta)",
              fontWeight: 700,
              fontSize: "1rem",
              color: cardBg,
              background: "#3B82F6",
              padding: "12px 32px",
              borderRadius: 12,
              border: `2px solid ${border}`,
              boxShadow: `4px 4px 0 ${border}`,
              textDecoration: "none",
              display: "inline-block",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translate(-2px, -2px)";
              e.currentTarget.style.boxShadow = `6px 6px 0 ${border}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translate(0, 0)";
              e.currentTarget.style.boxShadow = `4px 4px 0 ${border}`;
            }}
          >
            Get in touch
          </a>
        </Reveal>

        <Reveal delay={0.2}>
          <p
            style={{
              fontFamily: "var(--font-manrope)",
              fontSize: "0.75rem",
              color: "#999",
              marginTop: 32,
            }}
          >
            &copy; {new Date().getFullYear()} grox.ai &mdash; Built with Next.js &amp; Motion
          </p>
        </Reveal>
      </footer>

      <ThemeSwitcher current="/neo" variant="light" />
    </div>
  );
}
