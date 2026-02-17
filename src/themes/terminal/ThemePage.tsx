"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "@/app/data/projects";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";
import { getProjectImage } from "@/lib/theme-images";

/* ───────── helpers ───────── */
const GREEN = "#00FF41";
const DIM = "#333333";
const BG = "#0D0D0D";
const GREEN_DIM = "rgba(0,255,65,0.5)";
const GREEN_GLOW = "rgba(0,255,65,0.3)";

function pad(n: number, width: number = 3) {
  return String(n).padStart(width, "0");
}

/* ───────── Section wrapper with scroll reveal ───────── */
function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ═══════════════════════════════════════════════════════ */
/*  TERMINAL PAGE                                         */
/* ═══════════════════════════════════════════════════════ */

export default function TerminalPage() {
  /* ── typing animation state ── */
  const headline = "I turn AI models into products people use";
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex >= headline.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 50);
    return () => clearInterval(interval);
  }, [currentIndex, headline.length]);

  /* ── nav links as terminal commands ── */
  const navLinks = [
    { label: "./projects", href: "#projects" },
    { label: "./expertise", href: "#expertise" },
    { label: "./tools", href: "#tools" },
    { label: "./contact", href: "#footer" },
  ];

  return (
    <div
      style={{
        background: BG,
        color: GREEN,
        minHeight: "100vh",
        borderRadius: "8px",
        boxShadow:
          "0 0 60px rgba(0,255,65,0.05), inset 0 0 60px rgba(0,255,65,0.03)",
      }}
    >
      {/* Scanline overlay */}
      <div className="scanlines" />

      {/* ═══════ NAV ═══════ */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 font-[family-name:var(--font-jetbrains)]"
        style={{
          background: "rgba(13,13,13,0.90)",
          borderBottom: `1px solid ${DIM}`,
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="max-w-[1200px] mx-auto px-6 py-3 flex items-center gap-6 flex-wrap">
          <span
            style={{ color: GREEN }}
            className="text-sm whitespace-nowrap"
          >
            visitor@grox:~$
          </span>

          <div className="flex items-center gap-5 flex-wrap">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs uppercase tracking-wider transition-colors duration-200"
                style={{ color: DIM }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = GREEN)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = DIM)
                }
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* ═══════ HERO ═══════ */}
      <section
        className="min-h-screen flex flex-col justify-center px-6 font-[family-name:var(--font-jetbrains)]"
        style={{ paddingTop: "60px" }}
      >
        <div className="max-w-[1200px] mx-auto w-full">
          {/* prompt line */}
          <div className="mb-2 text-sm" style={{ color: DIM }}>
            visitor@grox:~$ cat mission.txt
          </div>

          {/* typed headline */}
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-10 font-[family-name:var(--font-space-grotesk)] uppercase tracking-tight"
            style={{
              color: GREEN,
              textShadow: `0 0 10px ${GREEN_GLOW}`,
              lineHeight: 1.15,
            }}
          >
            {headline.slice(0, currentIndex)}
            <span
              className="cursor-blink inline-block ml-0.5"
              style={{
                width: "3px",
                height: "1em",
                background: GREEN,
                verticalAlign: "text-bottom",
              }}
            />
          </h1>

          {/* stats block */}
          <div className="text-sm leading-relaxed">
            <div className="mb-1">
              <span style={{ color: GREEN }}>{">"}</span>
              <span style={{ color: GREEN_DIM }}> portfolio.status</span>
            </div>
            {stats.map((s) => (
              <div key={s.label} className="ml-2">
                <span style={{ color: DIM }}>
                  {s.label.toLowerCase().replace(/\s+/g, "_")}:
                </span>{" "}
                <span style={{ color: GREEN }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ PROJECTS ═══════ */}
      <Section
        id="projects"
        className="px-6 py-24 font-[family-name:var(--font-jetbrains)]"
      >
        <div className="max-w-[1200px] mx-auto w-full">
          {/* section header */}
          <div className="mb-2 text-sm" style={{ color: DIM }}>
            visitor@grox:~$ ls -la ./projects
          </div>
          <h2
            className="text-lg uppercase tracking-widest mb-10 font-[family-name:var(--font-space-grotesk)] font-bold"
            style={{
              color: GREEN,
              textShadow: `0 0 10px ${GREEN_GLOW}`,
            }}
          >
            Projects
          </h2>

          <div className="space-y-1">
            {projects.map((project, i) => {
              const title = project.title.replace(/\n/g, " ");
              return (
                <a
                  key={i}
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <div
                    className="py-4 px-4 transition-all duration-200"
                    style={{
                      borderLeft: "2px solid transparent",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderLeftColor = GREEN;
                      e.currentTarget.style.background =
                        "rgba(0,255,65,0.02)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderLeftColor =
                        "transparent";
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {/* line number + title */}
                    <div className="flex items-baseline gap-4">
                      <span
                        className="text-xs flex-shrink-0"
                        style={{ color: DIM }}
                      >
                        {pad(i + 1)}
                      </span>
                      <span
                        className="text-sm font-bold uppercase tracking-wide group-hover:brightness-125 transition-all duration-200"
                        style={{ color: GREEN }}
                      >
                        {title}
                      </span>
                      <span
                        className="text-xs ml-auto hidden sm:inline-block"
                        style={{ color: DIM }}
                      >
                        {project.year}
                      </span>
                    </div>

                    {/* Project thumbnail */}
                    <div style={{ marginTop: 8, marginLeft: 40, width: 120, height: 40, overflow: "hidden", position: "relative" }}>
                      <img
                        src={getProjectImage("terminal", project.image)}
                        alt=""
                        loading="lazy"
                        style={{
                          display: "block", width: "100%", height: "100%", objectFit: "cover",
                          filter: "grayscale(1) brightness(0.3) contrast(1.5)",
                          imageRendering: "pixelated" as React.CSSProperties["imageRendering"],
                        }}
                      />
                      <div style={{ position: "absolute", inset: 0, background: "rgba(0,255,65,0.15)", mixBlendMode: "screen" }} />
                    </div>

                    {/* description tree line */}
                    <div className="flex gap-4 mt-1">
                      <span className="text-xs flex-shrink-0 invisible">
                        {pad(0)}
                      </span>
                      <div>
                        <div className="text-xs" style={{ color: GREEN_DIM }}>
                          <span style={{ color: DIM }}>
                            {"     \u2514\u2500 "}
                          </span>
                          {project.description}
                        </div>

                        {/* tech tags */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span style={{ color: DIM }} className="text-xs">
                            {"     \u2514\u2500 "}
                          </span>
                          {project.tech.map((t) => (
                            <span
                              key={t}
                              className="text-[10px] uppercase tracking-wider px-1.5 py-0.5"
                              style={{
                                color: GREEN_DIM,
                                border: `1px solid ${DIM}`,
                              }}
                            >
                              [{t}]
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ═══════ EXPERTISE — man page ═══════ */}
      <Section
        id="expertise"
        className="px-6 py-24 font-[family-name:var(--font-jetbrains)]"
      >
        <div className="max-w-[1200px] mx-auto w-full">
          <div className="mb-2 text-sm" style={{ color: DIM }}>
            visitor@grox:~$ man grox
          </div>

          <div
            className="p-6 sm:p-8"
            style={{
              border: `1px solid ${DIM}`,
              background: BG,
            }}
          >
            {/* man page header */}
            <div
              className="text-xs mb-8 flex justify-between"
              style={{ color: GREEN_DIM }}
            >
              <span>GROX(1)</span>
              <span className="hidden sm:inline">
                AI Product Studio Manual
              </span>
              <span>GROX(1)</span>
            </div>

            {/* NAME section */}
            <div className="mb-6">
              <h3
                className="text-sm font-bold uppercase tracking-widest mb-2"
                style={{
                  color: GREEN,
                  textShadow: `0 0 10px ${GREEN_GLOW}`,
                }}
              >
                Name
              </h3>
              <div className="ml-6 sm:ml-12 text-xs" style={{ color: GREEN_DIM }}>
                grox - AI product engineer &amp; studio
              </div>
            </div>

            {/* SYNOPSIS — expertise entries */}
            <div className="mb-6">
              <h3
                className="text-sm font-bold uppercase tracking-widest mb-4"
                style={{
                  color: GREEN,
                  textShadow: `0 0 10px ${GREEN_GLOW}`,
                }}
              >
                Synopsis
              </h3>
              <div className="space-y-5">
                {expertise.map((item, i) => (
                  <div key={i} className="ml-6 sm:ml-12">
                    <div
                      className="text-xs font-bold uppercase tracking-wider mb-1"
                      style={{ color: GREEN }}
                    >
                      {item.title}
                    </div>
                    <div
                      className="text-xs leading-relaxed ml-6 sm:ml-12"
                      style={{ color: GREEN_DIM }}
                    >
                      {item.body}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="mb-6">
              <h3
                className="text-sm font-bold uppercase tracking-widest mb-2"
                style={{
                  color: GREEN,
                  textShadow: `0 0 10px ${GREEN_GLOW}`,
                }}
              >
                Description
              </h3>
              <div
                className="ml-6 sm:ml-12 text-xs leading-relaxed"
                style={{ color: GREEN_DIM }}
              >
                Grox is an AI product studio specializing in turning
                foundation models into production-grade applications. From
                computer vision authentication to multi-model orchestration
                pipelines, we ship AI products that real users depend on.
              </div>
            </div>

            {/* SEE ALSO */}
            <div className="mb-4">
              <h3
                className="text-sm font-bold uppercase tracking-widest mb-2"
                style={{
                  color: GREEN,
                  textShadow: `0 0 10px ${GREEN_GLOW}`,
                }}
              >
                See Also
              </h3>
              <div
                className="ml-6 sm:ml-12 text-xs"
                style={{ color: GREEN_DIM }}
              >
                github(1), projects(5), tools(7)
              </div>
            </div>

            {/* man page footer */}
            <div
              className="text-xs mt-8 flex justify-between"
              style={{ color: DIM }}
            >
              <span>Grox AI</span>
              <span>2025-01-01</span>
              <span>GROX(1)</span>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════ TOOLS — npm ls ═══════ */}
      <Section
        id="tools"
        className="px-6 py-24 font-[family-name:var(--font-jetbrains)]"
      >
        <div className="max-w-[1200px] mx-auto w-full">
          <div className="mb-2 text-sm" style={{ color: DIM }}>
            visitor@grox:~$ npm ls --depth=1
          </div>
          <h2
            className="text-lg uppercase tracking-widest mb-10 font-[family-name:var(--font-space-grotesk)] font-bold"
            style={{
              color: GREEN,
              textShadow: `0 0 10px ${GREEN_GLOW}`,
            }}
          >
            Tech Stack
          </h2>

          <div
            className="p-6 sm:p-8 text-xs leading-loose"
            style={{
              border: `1px solid ${DIM}`,
              background: BG,
            }}
          >
            <div style={{ color: GREEN_DIM }} className="mb-2">
              grox@1.0.0 /usr/local/studio
            </div>

            {tools.map((group, gi) => {
              const isLast = gi === tools.length - 1;
              const prefix = isLast ? "\u2514\u2500\u2500" : "\u251C\u2500\u2500";
              const childPrefix = isLast ? "    " : "\u2502   ";

              return (
                <div key={group.label}>
                  {/* group label */}
                  <div>
                    <span style={{ color: DIM }}>{prefix} </span>
                    <span
                      className="font-bold uppercase tracking-wider"
                      style={{ color: GREEN }}
                    >
                      {group.label}
                    </span>
                  </div>

                  {/* items */}
                  {group.items.map((item, ii) => {
                    const itemIsLast = ii === group.items.length - 1;
                    const itemPrefix = itemIsLast
                      ? "\u2514\u2500\u2500"
                      : "\u251C\u2500\u2500";

                    return (
                      <div key={item}>
                        <span style={{ color: DIM }}>
                          {childPrefix}
                          {itemPrefix}{" "}
                        </span>
                        <span style={{ color: GREEN_DIM }}>{item}</span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ═══════ FOOTER ═══════ */}
      <Section
        id="footer"
        className="px-6 py-24 font-[family-name:var(--font-jetbrains)]"
      >
        <div className="max-w-[1200px] mx-auto w-full">
          {/* contact block */}
          <div className="mb-16">
            <div className="mb-2 text-sm" style={{ color: DIM }}>
              visitor@grox:~$ cat contact.txt
            </div>
            <div
              className="p-6 sm:p-8 text-xs leading-loose"
              style={{
                border: `1px solid ${DIM}`,
                background: BG,
              }}
            >
              <div style={{ color: GREEN_DIM }}>
                <span style={{ color: GREEN }}>email</span>
                {"    : "}
                <a
                  href="mailto:hello@grox.ai"
                  className="underline transition-colors duration-200"
                  style={{ color: GREEN_DIM }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = GREEN)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = GREEN_DIM)
                  }
                >
                  hello@grox.ai
                </a>
              </div>
              <div style={{ color: GREEN_DIM }}>
                <span style={{ color: GREEN }}>github</span>
                {"   : "}
                <a
                  href="https://github.com/1aday"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline transition-colors duration-200"
                  style={{ color: GREEN_DIM }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = GREEN)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = GREEN_DIM)
                  }
                >
                  github.com/1aday
                </a>
              </div>
              <div style={{ color: GREEN_DIM }}>
                <span style={{ color: GREEN }}>location</span>
                {" : remote / worldwide"}
              </div>
            </div>
          </div>

          {/* exit */}
          <div className="text-sm mb-2">
            <span style={{ color: GREEN }}>{">"}</span>
            <span style={{ color: GREEN }}> exit</span>
            <span
              className="cursor-blink inline-block ml-1"
              style={{
                width: "3px",
                height: "1em",
                background: GREEN,
                verticalAlign: "text-bottom",
              }}
            />
          </div>
          <div className="text-xs" style={{ color: DIM }}>
            Process exited with code 0
          </div>

          {/* copyright */}
          <div className="mt-12 text-xs" style={{ color: DIM }}>
            <span style={{ color: DIM }}>
              &copy; {new Date().getFullYear()} Grox AI &mdash; All systems
              operational
            </span>
          </div>
        </div>
      </Section>

      {/* Theme Switcher */}
      <ThemeSwitcher current="/terminal" />
    </div>
  );
}
