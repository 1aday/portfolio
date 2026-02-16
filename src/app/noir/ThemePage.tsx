"use client";
import { useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { getProjectImage } from "@/lib/theme-images";

/* ─── Color constants ─── */
const C = {
  bg: "#000000",
  text: "#FFFFFF",
  dim: "#666666",
  card: "#0A0A0A",
  border: "#222222",
};

/* ─── Grain overlay ─── */
function Grain() {
  return (
    <div
      className="grain"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "none",
        opacity: 0.06,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "128px 128px",
      }}
    />
  );
}

/* ─── Spotlight radial gradient ─── */
function Spotlight({
  x = "50%",
  y = "50%",
  size = 800,
  opacity = 0.04,
}: {
  x?: string;
  y?: string;
  size?: number;
  opacity?: number;
}) {
  return (
    <div
      className="pointer-events-none absolute"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        transform: "translate(-50%, -50%)",
        background: `radial-gradient(circle, rgba(255,255,255,${opacity}) 0%, rgba(255,255,255,${opacity * 0.4}) 30%, transparent 70%)`,
        filter: "blur(40px)",
      }}
    />
  );
}

/* ─── Scroll reveal wrapper (slow cinematic 1.5s) ─── */
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
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 1.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ─── Film strip project card ─── */
function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 1.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative pl-10 sm:pl-16 py-12 sm:py-16 transition-all duration-700 cursor-default"
      style={{
        background: "transparent",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.background = `radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.02) 0%, transparent 70%)`;
        const tags = el.querySelectorAll<HTMLElement>(".tech-tag");
        tags.forEach((t) => {
          t.style.opacity = "1";
          t.style.transform = "translateY(0)";
        });
        const desc = el.querySelector<HTMLElement>(".project-desc");
        if (desc) desc.style.color = "#999999";
        const title = el.querySelector<HTMLElement>(".project-title");
        if (title) title.style.color = "#FFFFFF";
        const link = el.querySelector<HTMLElement>(".project-link");
        if (link) link.style.opacity = "1";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.background = "transparent";
        const tags = el.querySelectorAll<HTMLElement>(".tech-tag");
        tags.forEach((t) => {
          t.style.opacity = "0";
          t.style.transform = "translateY(8px)";
        });
        const desc = el.querySelector<HTMLElement>(".project-desc");
        if (desc) desc.style.color = C.dim;
        const title = el.querySelector<HTMLElement>(".project-title");
        if (title) title.style.color = "#E0E0E0";
        const link = el.querySelector<HTMLElement>(".project-link");
        if (link) link.style.opacity = "0";
      }}
    >
      {/* Background project image */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity: 0.08 }}>
        <img
          src={getProjectImage("noir", project.image)}
          alt=""
          loading="lazy"
          style={{
            display: "block", width: "100%", height: "100%", objectFit: "cover",
            filter: "grayscale(1) brightness(0.4) contrast(1.6)",
          }}
        />
      </div>

      {/* Number */}
      <span
        className="font-[family-name:var(--font-playfair)] italic leading-none select-none block"
        style={{
          fontSize: "clamp(3.5rem, 6vw, 6rem)",
          color: C.text,
          opacity: 0.9,
        }}
      >
        {num}
      </span>

      {/* Title */}
      <h3
        className="project-title font-[family-name:var(--font-playfair)] italic leading-[1.1] tracking-tight whitespace-pre-line mt-4 transition-colors duration-700"
        style={{
          fontSize: "clamp(1.4rem, 3vw, 2.25rem)",
          color: "#E0E0E0",
        }}
      >
        {project.title}
      </h3>

      {/* Client + Year */}
      <div
        className="flex items-center gap-3 mt-3"
        style={{ fontFamily: "var(--font-display)" }}
      >
        <span
          className="text-[12px] italic tracking-wide"
          style={{ color: C.dim }}
        >
          {project.client}
        </span>
        <span style={{ color: "#333333" }}>&mdash;</span>
        <span
          className="text-[12px] italic tracking-wide"
          style={{ color: "#555555" }}
        >
          {project.year}
        </span>
      </div>

      {/* Description */}
      <p
        className="project-desc mt-5 max-w-xl leading-[1.9] transition-colors duration-700"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(0.875rem, 1.2vw, 1rem)",
          color: C.dim,
          fontStyle: "italic",
        }}
      >
        {project.description}
      </p>

      {/* Technical (dimmer) */}
      <p
        className="mt-3 max-w-xl leading-[1.8]"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(0.8rem, 1.1vw, 0.9rem)",
          color: "#444444",
          fontStyle: "italic",
        }}
      >
        {project.technical}
      </p>

      {/* Tech tags: hidden by default, fade in on hover */}
      <div className="flex flex-wrap gap-2 mt-5">
        {project.tech.map((t, i) => (
          <span
            key={t}
            className="tech-tag text-[10px] uppercase tracking-[0.15em] px-3 py-1 transition-all duration-500"
            style={{
              fontFamily: "var(--font-display)",
              color: "#888888",
              border: `1px solid ${C.border}`,
              opacity: 0,
              transform: "translateY(8px)",
              transitionDelay: `${i * 50}ms`,
            }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* GitHub link: hidden by default */}
      <a
        href={project.github}
        target="_blank"
        rel="noopener noreferrer"
        className="project-link inline-flex items-center gap-2 mt-4 text-[11px] uppercase tracking-[0.2em] transition-opacity duration-700"
        style={{
          fontFamily: "var(--font-display)",
          color: "#888888",
          opacity: 0,
        }}
      >
        View Project
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M7 17L17 7M17 7H7M17 7V17" />
        </svg>
      </a>
    </motion.div>
  );
}

/* ===================================================
   NOIR — CINEMATIC FILM NOIR PORTFOLIO
   =================================================== */
export default function NoirPage() {
  useEffect(() => {
    document.documentElement.style.setProperty("--scroll", "0");
    const handleScroll = () => {
      const scrolled =
        window.scrollY / (document.body.scrollHeight - window.innerHeight);
      document.documentElement.style.setProperty("--scroll", String(scrolled));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main
      className="min-h-screen overflow-hidden relative"
      style={{
        background: C.bg,
        color: C.text,
        fontFamily: "var(--font-display)",
      }}
    >
      <Grain />

      {/* ─── Navigation: invisible, floating white text ─── */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 py-6 sm:py-8 flex items-center justify-between">
          <span
            className="font-[family-name:var(--font-playfair)] italic text-2xl sm:text-3xl tracking-wide"
            style={{ color: C.text }}
          >
            Grox
          </span>
          <div className="flex items-center gap-5 sm:gap-8">
            {[
              { label: "Work", href: "#work" },
              { label: "About", href: "#about" },
              {
                label: "GitHub",
                href: "https://github.com/1aday",
                external: true,
              },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="relative text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.25em] transition-colors duration-500"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "#555555",
                  fontStyle: "italic",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = C.text)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "#555555")
                }
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* ─── Hero: full viewport, pure black, centered dramatic text ─── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Hero spotlight behind text */}
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.03, 0.05, 0.03],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute pointer-events-none"
          style={{
            width: "min(1200px, 90vw)",
            height: "min(1200px, 90vw)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 35%, transparent 65%)",
            filter: "blur(60px)",
          }}
        />

        <div className="relative text-center px-6 max-w-5xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.8,
              delay: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="font-[family-name:var(--font-playfair)] italic leading-[0.95] tracking-[-0.02em]"
            style={{
              fontSize: "clamp(3rem, 9vw, 8rem)",
              color: C.text,
              letterSpacing: "-0.02em",
            }}
          >
            I turn AI models
            <br />
            into products
            <br />
            people use
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.5,
              delay: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-8 sm:mt-10 italic leading-relaxed"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(0.9rem, 1.5vw, 1.15rem)",
              color: C.dim,
            }}
          >
            End-to-end product ownership &mdash; from computer vision and
            multi-model orchestration to pixel-perfect interfaces.
          </motion.p>

          {/* Stats as inline flowing text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1.3 }}
            className="mt-8 font-[family-name:var(--font-playfair)] italic tracking-wide"
            style={{
              fontSize: "clamp(0.9rem, 1.4vw, 1.1rem)",
              color: "#444444",
            }}
          >
            {stats.map((stat, i) => (
              <span key={stat.label}>
                <span style={{ color: "#888888" }}>{stat.value}</span>{" "}
                {stat.label.toLowerCase()}
                {i < stats.length - 1 && (
                  <span style={{ color: "#333333" }}> &mdash; </span>
                )}
              </span>
            ))}
          </motion.p>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-[1px] h-10"
            style={{
              background: `linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)`,
            }}
          />
        </motion.div>
      </section>

      {/* ─── Selected Work: Film strip vertical timeline ─── */}
      <section
        id="work"
        className="relative mx-auto max-w-[1100px] px-6 sm:px-10 py-40 sm:py-56"
      >
        {/* Section heading */}
        <Reveal className="mb-20 sm:mb-28">
          <h2
            className="font-[family-name:var(--font-playfair)] italic tracking-tight leading-[1.05]"
            style={{
              fontSize: "clamp(2rem, 5vw, 4rem)",
              color: C.text,
            }}
          >
            Selected Work
          </h2>
        </Reveal>

        {/* Vertical timeline line */}
        <div
          className="absolute left-6 sm:left-10 top-0 bottom-0 w-[1px]"
          style={{
            background: `linear-gradient(to bottom, transparent, ${C.border} 15%, ${C.border} 85%, transparent)`,
          }}
        />

        {/* Spotlight near top of projects section */}
        <Spotlight x="70%" y="20%" size={1000} opacity={0.03} />
        <Spotlight x="20%" y="60%" size={900} opacity={0.025} />

        {/* Project cards */}
        <div className="flex flex-col">
          {projects.map((project, i) => (
            <div key={project.title}>
              <ProjectCard project={project} index={i} />
              {i < projects.length - 1 && (
                <div
                  className="ml-10 sm:ml-16"
                  style={{
                    height: 1,
                    background: `linear-gradient(90deg, ${C.border}, transparent 80%)`,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ─── Expertise: editorial prose columns with pull-quote numbers ─── */}
      <section
        id="about"
        className="relative mx-auto max-w-[1100px] px-6 sm:px-10 py-40 sm:py-56"
      >
        <Spotlight x="50%" y="30%" size={1100} opacity={0.03} />

        <Reveal className="mb-20 sm:mb-28">
          <h2
            className="font-[family-name:var(--font-playfair)] italic tracking-tight leading-[1.05] max-w-3xl"
            style={{
              fontSize: "clamp(2rem, 5vw, 4rem)",
              color: C.text,
            }}
          >
            Building at the intersection of design and intelligence
          </h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-x-20 gap-y-24">
          {expertise.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.15}>
              <div className="relative">
                {/* Large italic pull-quote number */}
                <span
                  className="font-[family-name:var(--font-playfair)] italic leading-none select-none block"
                  style={{
                    fontSize: "clamp(4rem, 7vw, 6rem)",
                    color: "rgba(255,255,255,0.06)",
                    position: "absolute",
                    top: "-2rem",
                    left: "-0.5rem",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="relative pt-8">
                  <h3
                    className="font-[family-name:var(--font-playfair)] italic text-xl sm:text-2xl tracking-tight mb-4"
                    style={{ color: "#E0E0E0" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="leading-[2] italic"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(0.875rem, 1.2vw, 1rem)",
                      color: C.dim,
                    }}
                  >
                    {item.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─── Tools: single column, minimal, dim ─── */}
      <section className="relative mx-auto max-w-[1100px] px-6 sm:px-10 py-40 sm:py-56">
        <Spotlight x="60%" y="50%" size={800} opacity={0.025} />

        <Reveal className="mb-20 sm:mb-28">
          <h2
            className="font-[family-name:var(--font-playfair)] italic tracking-tight leading-[1.05]"
            style={{
              fontSize: "clamp(2rem, 5vw, 4rem)",
              color: C.text,
            }}
          >
            Tools &amp; Technologies
          </h2>
        </Reveal>

        <div className="flex flex-col gap-14 sm:gap-16 max-w-2xl">
          {tools.map((group, gi) => (
            <Reveal key={group.label} delay={gi * 0.08}>
              <h4
                className="text-[10px] uppercase tracking-[0.35em] mb-4"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "#444444",
                }}
              >
                {group.label}
              </h4>
              <div className="flex flex-col gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="italic cursor-default transition-colors duration-500"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(0.9rem, 1.2vw, 1.05rem)",
                      color: C.dim,
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#CCCCCC")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = C.dim)
                    }
                  >
                    {item}
                  </span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─── Footer: pure restraint, just "Grox" ─── */}
      <footer className="py-40 sm:py-56">
        <Reveal>
          <div className="text-center">
            <span
              className="font-[family-name:var(--font-playfair)] italic tracking-wide"
              style={{
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                color: C.text,
              }}
            >
              Grox
            </span>
          </div>
        </Reveal>
      </footer>

      {/* Theme Switcher */}
      <ThemeSwitcher current="/noir" />
    </main>
  );
}
