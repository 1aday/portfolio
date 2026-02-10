"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";

/* ─── Colors ─── */
const C = {
  bg: "#0B0F0D",
  bgCard: "#0F1512",
  emerald: "#10B981",
  emeraldGlow: "rgba(16,185,129,0.2)",
  emeraldMuted: "rgba(16,185,129,0.5)",
  emeraldLight: "rgba(16,185,129,0.08)",
  text: "#D1FAE5",
  textMuted: "rgba(209,250,229,0.4)",
  border: "rgba(16,185,129,0.12)",
  dark: "#030705",
};

/* ─── Helpers ─── */
const CIPHER_CHARS = "0123456789ABCDEF!@#$%^&*<>{}[]~`|\\/:;";
const HEX_CHARS = "0123456789ABCDEF";

function randomChar() {
  return CIPHER_CHARS[Math.floor(Math.random() * CIPHER_CHARS.length)];
}

function randomHex() {
  return HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
}

function generateHash(): string {
  let h = "0x";
  for (let i = 0; i < 4; i++) h += randomHex();
  h += "...";
  for (let i = 0; i < 4; i++) h += randomHex();
  return h;
}

function generateHexDump(rows: number, cols: number): string[] {
  const lines: string[] = [];
  for (let r = 0; r < rows; r++) {
    let line = "";
    for (let c = 0; c < cols; c++) {
      line += randomHex() + randomHex();
      if (c < cols - 1) line += " ";
    }
    lines.push(line);
  }
  return lines;
}

/* ─── DecryptText Component ─── */
function DecryptText({
  text,
  className = "",
  delay = 0,
  speed = 40,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
  as?: "span" | "p" | "h1" | "h2" | "h3" | "h4" | "div";
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [displayed, setDisplayed] = useState<string>("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (inView && !started) {
      const timer = setTimeout(() => setStarted(true), delay);
      return () => clearTimeout(timer);
    }
  }, [inView, started, delay]);

  useEffect(() => {
    if (!started) {
      const scrambled = text
        .split("")
        .map((ch) => (ch === " " ? " " : randomChar()))
        .join("");
      setDisplayed(scrambled);
      return;
    }

    let revealedCount = 0;
    const interval = setInterval(() => {
      revealedCount++;
      if (revealedCount > text.length) {
        clearInterval(interval);
        setDisplayed(text);
        return;
      }
      const result = text
        .split("")
        .map((ch, i) => {
          if (ch === " ") return " ";
          if (i < revealedCount) return ch;
          return randomChar();
        })
        .join("");
      setDisplayed(result);
    }, speed);

    return () => clearInterval(interval);
  }, [started, text, speed]);

  const Comp = Tag as any;
  return (
    <Comp ref={ref} className={className}>
      {displayed}
    </Comp>
  );
}

/* ─── Binary Rain ─── */
function BinaryRain() {
  const columns = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: `${(i / 18) * 100 + Math.random() * 3}%`,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 10,
      opacity: 0.03 + Math.random() * 0.04,
      bits: Array.from({ length: 30 }, () =>
        Math.random() > 0.5 ? "1" : "0"
      ).join("\n"),
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {columns.map((col) => (
        <div
          key={col.id}
          className="absolute top-0 text-xs leading-tight"
          style={{
            left: col.left,
            color: C.emerald,
            opacity: col.opacity,
            fontFamily: "var(--font-jetbrains), monospace",
            whiteSpace: "pre",
            animation: `binaryFall ${col.duration}s linear ${col.delay}s infinite`,
          }}
        >
          {col.bits}
        </div>
      ))}
      <style jsx>{`
        @keyframes binaryFall {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100vh);
          }
        }
      `}</style>
    </div>
  );
}

/* ─── Hex Dump Background ─── */
function HexDumpBg() {
  const lines = useMemo(() => generateHexDump(40, 12), []);
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
      style={{ opacity: 0.025 }}
    >
      <pre
        className="text-xs leading-relaxed"
        style={{
          fontFamily: "var(--font-jetbrains), monospace",
          color: C.emerald,
        }}
      >
        {lines.join("\n")}
      </pre>
    </div>
  );
}

/* ─── Cipher Wheel SVG ─── */
function CipherWheel({ size = 400, className = "" }: { size?: number; className?: string }) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const r = size / 2 - 20;
  const innerR = r - 30;

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      animate={{ rotate: 360 }}
      transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
    >
      {/* Outer ring */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={C.emerald}
        strokeWidth={1}
        opacity={0.3}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r - 2}
        fill="none"
        stroke={C.emerald}
        strokeWidth={0.5}
        opacity={0.15}
      />
      {/* Inner ring */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={innerR}
        fill="none"
        stroke={C.emerald}
        strokeWidth={1}
        opacity={0.2}
      />
      {/* Tick marks and letters */}
      {letters.map((letter, i) => {
        const angle = (i / 26) * Math.PI * 2 - Math.PI / 2;
        const textX = size / 2 + Math.cos(angle) * (r - 14);
        const textY = size / 2 + Math.sin(angle) * (r - 14);
        const tickOuterX = size / 2 + Math.cos(angle) * r;
        const tickOuterY = size / 2 + Math.sin(angle) * r;
        const tickInnerX = size / 2 + Math.cos(angle) * (r - 6);
        const tickInnerY = size / 2 + Math.sin(angle) * (r - 6);

        return (
          <g key={letter}>
            <line
              x1={tickOuterX}
              y1={tickOuterY}
              x2={tickInnerX}
              y2={tickInnerY}
              stroke={C.emerald}
              strokeWidth={0.8}
              opacity={0.4}
            />
            <text
              x={textX}
              y={textY}
              textAnchor="middle"
              dominantBaseline="central"
              fill={C.emerald}
              fontSize={10}
              fontFamily="var(--font-jetbrains), monospace"
              opacity={0.6}
            >
              {letter}
            </text>
          </g>
        );
      })}
      {/* Inner number ring */}
      {Array.from({ length: 16 }, (_, i) => {
        const angle = (i / 16) * Math.PI * 2 - Math.PI / 2;
        const textX = size / 2 + Math.cos(angle) * (innerR - 14);
        const textY = size / 2 + Math.sin(angle) * (innerR - 14);
        const hex = i.toString(16).toUpperCase();
        return (
          <text
            key={`hex-${i}`}
            x={textX}
            y={textY}
            textAnchor="middle"
            dominantBaseline="central"
            fill={C.emerald}
            fontSize={9}
            fontFamily="var(--font-jetbrains), monospace"
            opacity={0.35}
          >
            {hex}
          </text>
        );
      })}
      {/* Center dot */}
      <circle cx={size / 2} cy={size / 2} r={3} fill={C.emerald} opacity={0.5} />
      {/* Cross hairs */}
      <line
        x1={size / 2 - 12}
        y1={size / 2}
        x2={size / 2 + 12}
        y2={size / 2}
        stroke={C.emerald}
        strokeWidth={0.5}
        opacity={0.3}
      />
      <line
        x1={size / 2}
        y1={size / 2 - 12}
        x2={size / 2}
        y2={size / 2 + 12}
        stroke={C.emerald}
        strokeWidth={0.5}
        opacity={0.3}
      />
    </motion.svg>
  );
}

/* ─── Hash Badge ─── */
function HashBadge({ className = "" }: { className?: string }) {
  const hash = useMemo(() => generateHash(), []);
  return (
    <span
      className={`inline-block px-2 py-0.5 text-[10px] tracking-widest rounded ${className}`}
      style={{
        fontFamily: "var(--font-jetbrains), monospace",
        background: C.emeraldLight,
        color: C.emeraldMuted,
        border: `1px solid ${C.border}`,
      }}
    >
      {hash}
    </span>
  );
}

/* ─── Encrypted Section Wrapper ─── */
function EncryptedSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════
   Navigation
   ════════════════════════════════════════════════════════ */
function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 transition-all duration-500"
      style={{
        background: scrolled ? `${C.bg}ee` : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
      }}
    >
      <Link href="/" className="flex items-center gap-2 group">
        <div
          className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold transition-all duration-300 group-hover:shadow-lg"
          style={{
            fontFamily: "var(--font-jetbrains), monospace",
            background: C.emeraldLight,
            color: C.emerald,
            border: `1px solid ${C.border}`,
            boxShadow: `0 0 0 0 ${C.emeraldGlow}`,
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.boxShadow = `0 0 20px 2px ${C.emeraldGlow}`;
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.boxShadow = `0 0 0 0 ${C.emeraldGlow}`;
          }}
        >
          {">_"}
        </div>
        <span
          className="text-sm tracking-wider hidden sm:inline"
          style={{
            fontFamily: "var(--font-jetbrains), monospace",
            color: C.text,
          }}
        >
          CIPHER://PORTFOLIO
        </span>
      </Link>
      <div className="flex items-center gap-6">
        {["Projects", "Expertise", "Tools"].map((label) => (
          <a
            key={label}
            href={`#${label.toLowerCase()}`}
            className="text-xs tracking-widest uppercase transition-colors duration-300 hover:text-emerald-400"
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              color: C.textMuted,
            }}
          >
            {label}
          </a>
        ))}
      </div>
    </motion.nav>
  );
}

/* ════════════════════════════════════════════════════════
   Hero Section
   ════════════════════════════════════════════════════════ */
function HeroSection() {
  const { scrollYProgress } = useScroll();
  const wheelOpacity = useTransform(scrollYProgress, [0, 0.15], [0.15, 0]);
  const wheelScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.85]);

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: C.bg }}
    >
      <HexDumpBg />

      {/* Cipher wheel decoration */}
      <motion.div
        className="absolute right-[-80px] top-1/2 -translate-y-1/2 hidden lg:block"
        style={{ opacity: wheelOpacity, scale: wheelScale }}
      >
        <CipherWheel size={500} />
      </motion.div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(${C.border} 1px, transparent 1px),
            linear-gradient(90deg, ${C.border} 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          opacity: 0.3,
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Top hash */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-6"
        >
          <HashBadge />
        </motion.div>

        {/* Classification label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mb-4 text-xs tracking-[0.35em] uppercase"
          style={{
            fontFamily: "var(--font-jetbrains), monospace",
            color: C.emeraldMuted,
          }}
        >
          &#123; classification: TOP_SECRET &#125;
        </motion.div>

        {/* Main title — decrypts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <DecryptText
            text="Decoding the future"
            as="h1"
            className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight mb-2"
            speed={35}
            delay={800}
          />
          <DecryptText
            text="of AI"
            as="h1"
            className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight"
            speed={50}
            delay={1800}
          />
        </motion.div>

        <style jsx>{`
          h1 {
            font-family: var(--font-orbitron), sans-serif;
            color: ${C.text};
          }
        `}</style>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-8 text-sm md:text-base max-w-xl mx-auto leading-relaxed"
          style={{
            fontFamily: "var(--font-jetbrains), monospace",
            color: C.textMuted,
          }}
        >
          {"// "}Engineering intelligent systems at the intersection of machine
          learning, cryptographic security, and human-centered design.
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className="p-4 rounded-lg text-center"
              style={{
                background: C.emeraldLight,
                border: `1px solid ${C.border}`,
              }}
            >
              <div
                className="text-2xl font-bold mb-1"
                style={{
                  fontFamily: "var(--font-orbitron), sans-serif",
                  color: C.emerald,
                }}
              >
                {stat.value}
              </div>
              <div
                className="text-[10px] tracking-widest uppercase"
                style={{
                  fontFamily: "var(--font-jetbrains), monospace",
                  color: C.textMuted,
                }}
              >
                {stat.label}
              </div>
              <div
                className="text-[8px] mt-1 tracking-wider"
                style={{
                  fontFamily: "var(--font-jetbrains), monospace",
                  color: C.emeraldMuted,
                  opacity: 0.4,
                }}
              >
                {generateHash()}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span
            className="text-[10px] tracking-[0.3em] uppercase"
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              color: C.textMuted,
            }}
          >
            SCROLL_TO_DECRYPT
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="w-4 h-7 rounded-full flex items-start justify-center pt-1"
            style={{ border: `1px solid ${C.border}` }}
          >
            <div
              className="w-1 h-1.5 rounded-full"
              style={{ background: C.emerald }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   Project Card + Projects Section
   ════════════════════════════════════════════════════════ */
function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);
  const fileId = useMemo(() => generateHash(), []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative rounded-lg overflow-hidden cursor-pointer"
      style={{
        background: C.bgCard,
        border: `1px solid ${hovered ? C.emerald : C.border}`,
        transition: "border-color 0.4s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Classified file header */}
      <div
        className="px-5 py-3 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${C.border}` }}
      >
        <div className="flex items-center gap-3">
          <span
            className="text-[10px] tracking-widest uppercase"
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              color: C.emerald,
            }}
          >
            FILE_{String(index + 1).padStart(3, "0")}
          </span>
          <span
            className="text-[9px] tracking-wider"
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              color: C.textMuted,
            }}
          >
            {fileId}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: C.emerald,
              boxShadow: `0 0 6px ${C.emeraldGlow}`,
            }}
          />
          <span
            className="text-[9px] tracking-widest uppercase"
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              color: C.emeraldMuted,
            }}
          >
            DECRYPTED
          </span>
        </div>
      </div>

      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          style={{ opacity: 0.7 }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, transparent 30%, ${C.bgCard})`,
          }}
        />
        {/* Scanline overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0,0,0,0.05) 2px,
              rgba(0,0,0,0.05) 4px
            )`,
          }}
        />
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <DecryptText
            text={project.title}
            as="h3"
            className="text-base font-bold tracking-wide"
            speed={25}
            delay={200}
          />
          <span
            className="text-[10px] px-2 py-0.5 rounded"
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              color: C.emeraldMuted,
              background: C.emeraldLight,
              border: `1px solid ${C.border}`,
            }}
          >
            {project.year}
          </span>
        </div>

        <style jsx>{`
          h3 {
            font-family: var(--font-orbitron), sans-serif;
            color: ${C.text};
          }
        `}</style>

        {project.client && (
          <p
            className="text-[11px] tracking-wider uppercase mb-3"
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              color: C.emeraldMuted,
            }}
          >
            CLIENT: {project.client}
          </p>
        )}

        <p
          className="text-xs leading-relaxed mb-4"
          style={{
            fontFamily: "var(--font-jetbrains), monospace",
            color: C.textMuted,
          }}
        >
          {project.description}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tech.map((t) => (
            <span
              key={t}
              className="text-[10px] px-2 py-0.5 rounded tracking-wider"
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                color: C.emerald,
                background: C.emeraldLight,
                border: `1px solid ${C.border}`,
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Technical detail */}
        {project.technical && (
          <div
            className="text-[10px] leading-relaxed p-3 rounded"
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              color: C.textMuted,
              background: C.dark,
              border: `1px solid ${C.border}`,
            }}
          >
            <span style={{ color: C.emeraldMuted }}>{"// "}</span>
            {project.technical}
          </div>
        )}

        {/* Footer links */}
        {project.github && (
          <div
            className="mt-4 pt-3 flex items-center justify-between"
            style={{ borderTop: `1px solid ${C.border}` }}
          >
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] tracking-widest uppercase flex items-center gap-2 transition-colors duration-300"
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                color: C.emeraldMuted,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = C.emerald;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = C.emeraldMuted;
              }}
            >
              <span>VIEW_SOURCE</span>
              <span>&rarr;</span>
            </a>
            <HashBadge />
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ProjectsSection() {
  return (
    <section id="projects" className="relative py-28 px-6 md:px-10" style={{ background: C.bg }}>
      <HexDumpBg />
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section header */}
        <EncryptedSection className="mb-16 text-center">
          <div
            className="text-[10px] tracking-[0.4em] uppercase mb-3"
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              color: C.emeraldMuted,
            }}
          >
            &#123; section: CLASSIFIED_FILES &#125;
          </div>
          <DecryptText
            text="PROJECTS"
            as="h2"
            className="text-3xl md:text-4xl font-bold tracking-wider mb-4"
            speed={60}
            delay={200}
          />
          <style jsx>{`
            h2 {
              font-family: var(--font-orbitron), sans-serif;
              color: ${C.text};
            }
          `}</style>
          <div
            className="w-16 h-px mx-auto"
            style={{ background: C.emerald, opacity: 0.4 }}
          />
        </EncryptedSection>

        {/* Project grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   Expertise Section — "Decryption Keys"
   ════════════════════════════════════════════════════════ */
function ExpertiseSection() {
  return (
    <section
      id="expertise"
      className="relative py-28 px-6 md:px-10"
      style={{ background: C.dark }}
    >
      <div className="relative z-10 max-w-5xl mx-auto">
        <EncryptedSection className="mb-16 text-center">
          <div
            className="text-[10px] tracking-[0.4em] uppercase mb-3"
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              color: C.emeraldMuted,
            }}
          >
            &#123; section: DECRYPTION_KEYS &#125;
          </div>
          <DecryptText
            text="EXPERTISE"
            as="h2"
            className="text-3xl md:text-4xl font-bold tracking-wider mb-4"
            speed={60}
            delay={200}
          />
          <style jsx>{`
            h2 {
              font-family: var(--font-orbitron), sans-serif;
              color: ${C.text};
            }
          `}</style>
          <div
            className="w-16 h-px mx-auto"
            style={{ background: C.emerald, opacity: 0.4 }}
          />
        </EncryptedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {expertise.map((item, i) => {
            const keyHash = generateHash();
            return (
              <EncryptedSection key={item.title}>
                <div
                  className="p-6 rounded-lg h-full"
                  style={{
                    background: C.bgCard,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  {/* Key header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded flex items-center justify-center text-sm"
                        style={{
                          fontFamily: "var(--font-jetbrains), monospace",
                          background: C.emeraldLight,
                          color: C.emerald,
                          border: `1px solid ${C.border}`,
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          background: C.emerald,
                          boxShadow: `0 0 8px ${C.emeraldGlow}`,
                        }}
                      />
                    </div>
                    <span
                      className="text-[9px] tracking-wider"
                      style={{
                        fontFamily: "var(--font-jetbrains), monospace",
                        color: C.textMuted,
                      }}
                    >
                      KEY:{keyHash}
                    </span>
                  </div>

                  <DecryptText
                    text={item.title}
                    as="h3"
                    className="text-sm font-bold tracking-wider uppercase mb-3"
                    speed={30}
                    delay={i * 100}
                  />
                  <style jsx>{`
                    h3 {
                      font-family: var(--font-orbitron), sans-serif;
                      color: ${C.emerald};
                    }
                  `}</style>

                  <p
                    className="text-xs leading-relaxed"
                    style={{
                      fontFamily: "var(--font-jetbrains), monospace",
                      color: C.textMuted,
                    }}
                  >
                    {item.body}
                  </p>

                  {/* Decorative bottom bar */}
                  <div
                    className="mt-4 pt-3 flex items-center gap-2"
                    style={{ borderTop: `1px solid ${C.border}` }}
                  >
                    <div
                      className="flex-1 h-px"
                      style={{ background: C.emerald, opacity: 0.15 }}
                    />
                    <span
                      className="text-[8px] tracking-widest uppercase"
                      style={{
                        fontFamily: "var(--font-jetbrains), monospace",
                        color: C.textMuted,
                      }}
                    >
                      VERIFIED
                    </span>
                    <div
                      className="flex-1 h-px"
                      style={{ background: C.emerald, opacity: 0.15 }}
                    />
                  </div>
                </div>
              </EncryptedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   Tools Section — "Cipher Suite"
   ════════════════════════════════════════════════════════ */
function ToolsSection() {
  return (
    <section
      id="tools"
      className="relative py-28 px-6 md:px-10"
      style={{ background: C.bg }}
    >
      <HexDumpBg />
      <div className="relative z-10 max-w-5xl mx-auto">
        <EncryptedSection className="mb-16 text-center">
          <div
            className="text-[10px] tracking-[0.4em] uppercase mb-3"
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              color: C.emeraldMuted,
            }}
          >
            &#123; section: CIPHER_SUITE &#125;
          </div>
          <DecryptText
            text="TOOLS & STACK"
            as="h2"
            className="text-3xl md:text-4xl font-bold tracking-wider mb-4"
            speed={50}
            delay={200}
          />
          <style jsx>{`
            h2 {
              font-family: var(--font-orbitron), sans-serif;
              color: ${C.text};
            }
          `}</style>
          <div
            className="w-16 h-px mx-auto"
            style={{ background: C.emerald, opacity: 0.4 }}
          />
        </EncryptedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((group, gi) => (
            <EncryptedSection key={group.label}>
              <div
                className="p-5 rounded-lg h-full"
                style={{
                  background: C.bgCard,
                  border: `1px solid ${C.border}`,
                }}
              >
                {/* Header with cipher protocol label */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center text-[10px]"
                    style={{
                      fontFamily: "var(--font-jetbrains), monospace",
                      background: C.emeraldLight,
                      color: C.emerald,
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    {String.fromCharCode(65 + gi)}
                  </div>
                  <DecryptText
                    text={group.label}
                    as="h3"
                    className="text-xs font-bold tracking-wider uppercase"
                    speed={30}
                    delay={gi * 80}
                  />
                  <style jsx>{`
                    h3 {
                      font-family: var(--font-orbitron), sans-serif;
                      color: ${C.emerald};
                    }
                  `}</style>
                </div>

                {/* Tool items as key-value entries */}
                <div className="space-y-1.5">
                  {group.items.map((item, ii) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 py-1.5 px-3 rounded text-[11px] transition-all duration-300"
                      style={{
                        fontFamily: "var(--font-jetbrains), monospace",
                        color: C.textMuted,
                        background: "transparent",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                          C.emeraldLight;
                        (e.currentTarget as HTMLElement).style.color = C.text;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                          "transparent";
                        (e.currentTarget as HTMLElement).style.color =
                          C.textMuted;
                      }}
                    >
                      <span style={{ color: C.emerald, opacity: 0.5 }}>
                        [{String(ii).padStart(2, "0")}]
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Footer hash */}
                <div
                  className="mt-4 pt-3 text-center"
                  style={{ borderTop: `1px solid ${C.border}` }}
                >
                  <span
                    className="text-[8px] tracking-wider"
                    style={{
                      fontFamily: "var(--font-jetbrains), monospace",
                      color: C.textMuted,
                      opacity: 0.5,
                    }}
                  >
                    CHECKSUM: {generateHash()}
                  </span>
                </div>
              </div>
            </EncryptedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   Footer
   ════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer
      className="relative py-20 px-6 md:px-10"
      style={{
        background: C.dark,
        borderTop: `1px solid ${C.border}`,
      }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Cipher decoration */}
        <div className="flex justify-center mb-10">
          <CipherWheel size={120} />
        </div>

        {/* End-of-transmission block */}
        <div className="text-center mb-10">
          <div
            className="text-[10px] tracking-[0.4em] uppercase mb-3"
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              color: C.emeraldMuted,
            }}
          >
            &#123; status: END_OF_TRANSMISSION &#125;
          </div>
          <DecryptText
            text="Connection Secured"
            as="p"
            className="text-xl font-bold tracking-wider mb-4"
            speed={40}
            delay={300}
          />
          <style jsx>{`
            p {
              font-family: var(--font-orbitron), sans-serif;
              color: ${C.text};
            }
          `}</style>
          <p
            className="text-xs max-w-md mx-auto leading-relaxed"
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              color: C.textMuted,
            }}
          >
            {"// "}All communications are encrypted end-to-end. Ready to
            establish a secure channel? Let&apos;s talk.
          </p>
        </div>

        {/* Hash divider */}
        <div
          className="flex items-center gap-3 mb-10"
          style={{
            fontFamily: "var(--font-jetbrains), monospace",
          }}
        >
          <div className="flex-1 h-px" style={{ background: C.border }} />
          <span
            className="text-[9px] tracking-wider"
            style={{ color: C.textMuted }}
          >
            {generateHash()}
          </span>
          <div className="flex-1 h-px" style={{ background: C.border }} />
        </div>

        {/* Theme switcher */}
        <div className="flex justify-center">
          <ThemeSwitcher current="/cipher" variant="dark" />
        </div>

        {/* Bottom bar */}
        <div
          className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: `1px solid ${C.border}` }}
        >
          <span
            className="text-[10px] tracking-wider"
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              color: C.textMuted,
            }}
          >
            &copy; {new Date().getFullYear()} // ALL_RIGHTS_RESERVED
          </span>
          <div className="flex items-center gap-4">
            {["GitHub", "LinkedIn", "Twitter"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-[10px] tracking-widest uppercase transition-colors duration-300"
                style={{
                  fontFamily: "var(--font-jetbrains), monospace",
                  color: C.textMuted,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = C.emerald;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = C.textMuted;
                }}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════
   Page Export
   ════════════════════════════════════════════════════════ */
export default function CipherPage() {
  return (
    <main
      className="relative overflow-hidden"
      style={{
        background: C.bg,
        color: C.text,
        fontFamily: "var(--font-jetbrains), monospace",
      }}
    >
      <BinaryRain />
      <Navigation />
      <HeroSection />
      <ProjectsSection />
      <ExpertiseSection />
      <ToolsSection />
      <Footer />
    </main>
  );
}
