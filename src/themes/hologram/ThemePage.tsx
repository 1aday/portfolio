"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, useInView } from "motion/react";
import Image from "next/image";
import { projects, stats, expertise, tools } from "@/app/data/projects";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";
import { getProjectImage } from "@/lib/theme-images";

/* ── Colors ── */
const BG = "#08080E";
const SURFACE = "#101018";
const TEXT = "#E8E4F0";
const MUTED = "#6A6080";
const LAVENDER = "#E8C8FF";
const MAGENTA = "#FF44AA";
const CYAN = "#44FFEE";
const GOLD = "#FFD700";
const VIOLET = "#8844FF";
const SILVER = "#C0C8D8";

const HOLO = [MAGENTA, VIOLET, CYAN, GOLD];
const holoAt = (i: number) => HOLO[i % 4];
const RAINBOW = `linear-gradient(135deg, ${MAGENTA}, ${VIOLET}, ${CYAN}, ${GOLD}, ${MAGENTA})`;
const RARITY = ["LEGENDARY", "MYTHIC", "RARE", "EPIC", "ULTRA RARE"];
const RARITY_C: Record<string, string> = { LEGENDARY: GOLD, MYTHIC: MAGENTA, RARE: CYAN, EPIC: VIOLET, "ULTRA RARE": LAVENDER };
const heading = "font-[family-name:var(--font-orbitron)]";
const mono = "font-[family-name:var(--font-space-grotesk)]";

/* ── Global styles ── */
function Styles() {
  return (
    <style>{`
      @keyframes shimmer { 0% { background-position: 0% 50% } 50% { background-position: 100% 50% } 100% { background-position: 0% 50% } }
      @keyframes rotate-angle { from { --border-angle: 0deg } to { --border-angle: 360deg } }
      @keyframes speckle-drift { 0%,100% { transform: translate(0,0) } 50% { transform: translate(2px,-1px) } }
      @property --border-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      .holo-shimmer { background: ${RAINBOW}; background-size: 300% 300%; -webkit-background-clip: text; background-clip: text; color: transparent; animation: shimmer 8s ease infinite; }
      .holo-wrap { background: conic-gradient(from var(--border-angle,0deg),${MAGENTA},${VIOLET},${CYAN},${GOLD},${MAGENTA}); animation: rotate-angle 4s linear infinite; padding: 1px; border-radius: 12px; }
      .holo-wrap:hover { background: conic-gradient(from var(--border-angle,0deg),${GOLD},${GOLD}88,${CYAN},${GOLD}88,${GOLD}); padding: 2px; }
      .holo-conic { background: conic-gradient(from var(--border-angle,0deg),${MAGENTA}08,${VIOLET}08,${CYAN}08,${GOLD}08,${MAGENTA}08); animation: rotate-angle 20s linear infinite; }
    `}</style>
  );
}

/* ── SVG filter: holographic speckle ── */
function SpeckleSVG() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }}>
      <defs>
        <filter id="holo-speckle" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" seed="2" result="n" />
          <feColorMatrix in="n" type="saturate" values="3" result="s" />
          <feComponentTransfer in="s" result="sh">
            <feFuncR type="linear" slope="1.2" intercept="-0.1" />
            <feFuncG type="linear" slope="0.8" intercept="0.05" />
            <feFuncB type="linear" slope="1.4" intercept="-0.05" />
          </feComponentTransfer>
          <feBlend in="SourceGraphic" in2="sh" mode="overlay" />
        </filter>
      </defs>
    </svg>
  );
}

/* ── Card frame SVG: double-line border + diamond markers ── */
function CardFrame({ color = LAVENDER }: { color?: string }) {
  return (
    <svg viewBox="0 0 400 300" fill="none" preserveAspectRatio="none"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
      <rect x="2" y="2" width="396" height="296" rx="10" stroke={color} strokeWidth="0.5" opacity="0.3" />
      <rect x="6" y="6" width="388" height="288" rx="8" stroke={color} strokeWidth="0.3" opacity="0.2" />
      <polygon points="200,1 203,4 200,7 197,4" fill={color} opacity="0.4" />
      <polygon points="200,293 203,296 200,299 197,296" fill={color} opacity="0.4" />
      <polygon points="1,150 4,147 7,150 4,153" fill={color} opacity="0.4" />
      <polygon points="393,150 396,147 399,150 396,153" fill={color} opacity="0.4" />
    </svg>
  );
}

/* ── HoloCard: tilt + specular highlight + animated border ── */
function HoloCard({ children, index }: { children: React.ReactNode; index: number }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [spec, setSpec] = useState({ x: 50, y: 50 });
  const ref = useRef<HTMLDivElement>(null);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
    setTilt({ x: -ny * 3, y: nx * 3 });
    setSpec({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  }, []);

  const onLeave = useCallback(() => { setTilt({ x: 0, y: 0 }); setSpec({ x: 50, y: 50 }); }, []);

  return (
    <div className="holo-wrap" style={{ overflow: "hidden" }}>
      <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
        style={{ background: SURFACE, borderRadius: 11, position: "relative",
          transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: "transform 0.15s ease-out", overflow: "hidden" }}>
        {/* Specular highlight */}
        <div style={{ position: "absolute", inset: 0, borderRadius: 11, pointerEvents: "none", zIndex: 2,
          background: `radial-gradient(circle at ${spec.x}% ${spec.y}%, rgba(255,255,255,0.08), transparent 50%)` }} />
        {/* Speckle overlay */}
        <div style={{ position: "absolute", inset: 0, filter: "url(#holo-speckle)", opacity: 0.03,
          pointerEvents: "none", zIndex: 1, animation: "speckle-drift 6s ease-in-out infinite" }} />
        <CardFrame color={holoAt(index)} />
        {children}
      </div>
    </div>
  );
}

/* ── Shimmer title with per-character stagger ── */
function ShimmerTitle({ text }: { text: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <h1 ref={ref} className={heading} style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
      {text.split("").map((ch, i) => (
        <motion.span key={i} className="holo-shimmer"
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ delay: i * 0.03, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "inline-block", whiteSpace: ch === " " ? "pre" : undefined }}>
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </h1>
  );
}

/* ── Section with inView fade ── */
function Sec({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.section ref={ref} initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.section>
  );
}

/* ── Section heading ── */
function SecTitle({ children, color = LAVENDER }: { children: React.ReactNode; color?: string }) {
  return (
    <div style={{ marginBottom: 48, textAlign: "center" }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 40, height: 1, background: `linear-gradient(90deg, transparent, ${color})` }} />
        <h2 className={heading} style={{ fontSize: "clamp(1rem,2.5vw,1.25rem)", fontWeight: 700,
          letterSpacing: "0.2em", textTransform: "uppercase", color }}>{children}</h2>
        <div style={{ width: 40, height: 1, background: `linear-gradient(90deg, ${color}, transparent)` }} />
      </div>
    </div>
  );
}

/* ── Rainbow bar ── */
const RainbowBar = ({ mt = 0, mb = 0 }: { mt?: number; mb?: number }) => (
  <div style={{ width: "100%", height: 2, borderRadius: 1, marginTop: mt, marginBottom: mb,
    background: RAINBOW, backgroundSize: "300% 300%", animation: "shimmer 8s ease infinite" }} />
);

/* ── Rarity badge ── */
function Badge({ label }: { label: string }) {
  const c = RARITY_C[label] || LAVENDER;
  return (
    <span className={heading} style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", color: c,
      border: `1px solid ${c}44`, padding: "3px 10px", borderRadius: 4, background: `${c}0A`,
      textTransform: "uppercase", whiteSpace: "nowrap" }}>{label}</span>
  );
}

/* ── Foil image overlay ── */
function FoilImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "16/10", overflow: "hidden", borderRadius: 8 }}>
      <Image src={src} alt={alt} fill style={{ objectFit: "cover" }} sizes="(max-width:768px) 100vw, 50vw" />
      <div style={{ position: "absolute", inset: 0, mixBlendMode: "overlay",
        background: `linear-gradient(135deg, ${MAGENTA}12 0%, transparent 30%, ${CYAN}10 50%, transparent 70%, ${GOLD}12 100%)` }} />
      <div style={{ position: "absolute", inset: 0,
        background: "linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)" }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  MAIN PAGE                                                             */
/* ═══════════════════════════════════════════════════════════════════════ */
export default function HologramPage() {
  return (
    <main style={{ background: BG, color: TEXT, minHeight: "100vh", position: "relative", overflow: "hidden" }}
      className="font-[family-name:var(--font-manrope)]">
      <Styles />
      <SpeckleSVG />
      {/* Conic rainbow background at 3% opacity */}
      <div className="holo-conic" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }} />

      {/* ── HERO ── */}
      <header style={{ position: "relative", zIndex: 1, padding: "clamp(80px,14vh,160px) 24px clamp(60px,10vh,120px)",
        textAlign: "center", maxWidth: 900, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }} className={heading}
          style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.3em", color: MUTED, marginBottom: 24, textTransform: "uppercase" }}>
          AI Product Studio
        </motion.div>

        <ShimmerTitle text="Holographic" />

        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          style={{ fontSize: "clamp(0.95rem,2vw,1.1rem)", color: MUTED, lineHeight: 1.7, maxWidth: 560, margin: "24px auto 0" }}>
          Full-stack AI engineering with multi-model orchestration. Each project is a rare specimen from the collection.
        </motion.p>

        {/* Stats as rarity-style badges */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 40, flexWrap: "wrap" }}>
          {stats.map((s) => (
            <div key={s.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div className="holo-wrap" style={{ borderRadius: 8, padding: 1 }}>
                <div style={{ background: SURFACE, borderRadius: 7, padding: "12px 28px", textAlign: "center" }}>
                  <span className={`holo-shimmer ${heading}`}
                    style={{ fontSize: "clamp(1.4rem,3vw,1.8rem)", fontWeight: 800, display: "block" }}>{s.value}</span>
                </div>
              </div>
              <span className={heading}
                style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", color: MUTED, textTransform: "uppercase" }}>{s.label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 1.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ maxWidth: 300, margin: "48px auto 0", transformOrigin: "center" }}>
          <RainbowBar />
        </motion.div>
      </header>

      {/* ── PROJECTS ── */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <Sec><SecTitle color={LAVENDER}>Collection</SecTitle></Sec>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(480px,100%),1fr))", gap: 28 }}>
          {projects.map((p, i) => (
            <ProjectCard key={p.title} project={p} index={i} rarity={RARITY[i % 5]} />
          ))}
        </div>
      </div>

      {/* ── EXPERTISE ── */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", padding: "100px 24px 0" }}>
        <Sec><SecTitle color={CYAN}>Abilities</SecTitle></Sec>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px,100%),1fr))", gap: 20 }}>
          {expertise.map((e, i) => <AbilityCard key={e.title} item={e} index={i} />)}
        </div>
      </div>

      {/* ── TOOLS ── */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", padding: "100px 24px 0" }}>
        <Sec><SecTitle color={GOLD}>Tech Deck</SecTitle></Sec>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(160px,100%),1fr))", gap: 16 }}>
          {tools.map((t, i) => <DeckCard key={t.label} tool={t} index={i} />)}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{ position: "relative", zIndex: 1, padding: "120px 24px 80px" }}>
        <Sec>
          <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
            <RainbowBar mb={48} />
            <h2 className={`holo-shimmer ${heading}`}
              style={{ fontSize: "clamp(1.5rem,4vw,2.2rem)", fontWeight: 800, marginBottom: 16, lineHeight: 1.2 }}>
              Add to Collection
            </h2>
            <p style={{ color: MUTED, fontSize: "clamp(0.9rem,1.5vw,1rem)", lineHeight: 1.7, maxWidth: 480, margin: "0 auto 36px" }}>
              Looking for a rare collaborator? Each project minted with precision engineering and iridescent attention to detail.
            </p>
            <a href="mailto:hello@grox.studio" className={heading}
              style={{ display: "inline-block", padding: "14px 40px", fontSize: 13, fontWeight: 700,
                letterSpacing: "0.15em", textTransform: "uppercase", color: BG, background: RAINBOW,
                backgroundSize: "300% 300%", animation: "shimmer 8s ease infinite", borderRadius: 8,
                textDecoration: "none", transition: "transform 0.2s, box-shadow 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 32px ${MAGENTA}40, 0 4px 16px ${CYAN}30`; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
              Get in Touch
            </a>
            <RainbowBar mt={48} />
            <p className={mono} style={{ color: MUTED, fontSize: 12, marginTop: 24, letterSpacing: "0.05em" }}>
              &copy; {new Date().getFullYear()} Grox Studio &mdash; Holographic Edition
            </p>
          </div>
        </Sec>
      </div>

      <ThemeSwitcher current="/hologram" />
    </main>
  );
}

/* ── PROJECT CARD ── */
function ProjectCard({ project, index, rarity }: {
  project: (typeof projects)[number]; index: number; rarity: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const accent = holoAt(index);

  return (
    <motion.div ref={ref} initial={{ scale: 0.95, rotateY: 8, opacity: 0 }}
      animate={inView ? { scale: 1, rotateY: 0, opacity: 1 } : {}}
      transition={{ duration: 0.6, delay: (index % 2) * 0.12, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 800 }}>
      <HoloCard index={index}>
        <div style={{ padding: 24, position: "relative", zIndex: 3 }}>
          {/* Header: number / rarity / year */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <span className={mono} style={{ fontSize: 11, color: MUTED, fontWeight: 500 }}>
              #{String(index + 1).padStart(3, "0")}
            </span>
            <Badge label={rarity} />
            <span className={mono} style={{ fontSize: 11, color: MUTED }}>{project.year}</span>
          </div>

          <FoilImage src={getProjectImage("hologram", project.image)} alt={project.title} />

          <h3 className={heading} style={{ fontSize: "clamp(1rem,2vw,1.2rem)", fontWeight: 700,
            color: TEXT, marginTop: 20, marginBottom: 4, lineHeight: 1.3, whiteSpace: "pre-line" }}>
            {project.title}
          </h3>
          <span className={mono} style={{ fontSize: 12, color: accent, fontWeight: 500, letterSpacing: "0.05em" }}>
            {project.client}
          </span>
          <p style={{ fontSize: 14, color: SILVER, lineHeight: 1.65, marginTop: 12, marginBottom: 12 }}>
            {project.description}
          </p>
          <p className={mono} style={{ fontSize: 12, color: MUTED, lineHeight: 1.6, marginBottom: 16 }}>
            {project.technical}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
            {project.tech.map((t) => (
              <span key={t} className={mono} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 4,
                background: `${accent}10`, color: accent, border: `1px solid ${accent}20`, fontWeight: 500 }}>{t}</span>
            ))}
          </div>

          <a href={project.github} target="_blank" rel="noopener noreferrer" className={heading}
            style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", color: LAVENDER,
              textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, transition: "color 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = CYAN; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = LAVENDER; }}>
            VIEW SOURCE
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </a>
        </div>
      </HoloCard>
    </motion.div>
  );
}

/* ── ABILITY CARD (expertise) ── */
function AbilityCard({ item, index }: { item: (typeof expertise)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const accent = HOLO[index % 4];

  return (
    <motion.div ref={ref} initial={{ scale: 0.95, rotateY: 8, opacity: 0 }}
      animate={inView ? { scale: 1, rotateY: 0, opacity: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 800 }}>
      <HoloCard index={index}>
        <div style={{ padding: 28, position: "relative", zIndex: 3 }}>
          {/* Level indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: accent,
              boxShadow: `0 0 8px ${accent}80` }} />
            <span className={heading} style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em",
              color: accent, textTransform: "uppercase" }}>LVL {(index + 1) * 25}</span>
            <div style={{ flex: 1 }} />
            <div style={{ width: 60, height: 3, borderRadius: 2, background: `${accent}20`, overflow: "hidden" }}>
              <div style={{ width: `${75 + index * 5}%`, height: "100%", borderRadius: 2,
                background: `linear-gradient(90deg, ${accent}, ${accent}80)` }} />
            </div>
          </div>

          <h3 className={heading} style={{ fontSize: "clamp(0.85rem,1.8vw,1rem)", fontWeight: 700,
            color: TEXT, marginBottom: 12, lineHeight: 1.3 }}>{item.title}</h3>
          <p style={{ fontSize: 13, color: SILVER, lineHeight: 1.7 }}>{item.body}</p>
          <div style={{ width: "100%", height: 1, marginTop: 20, opacity: 0.4,
            background: `linear-gradient(90deg, ${accent}, transparent)` }} />
        </div>
      </HoloCard>
    </motion.div>
  );
}

/* ── DECK CARD (tools) ── */
function DeckCard({ tool, index }: { tool: (typeof tools)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const accent = holoAt(index);

  return (
    <motion.div ref={ref} initial={{ scale: 0.95, rotateY: 8, opacity: 0 }}
      animate={inView ? { scale: 1, rotateY: 0, opacity: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 800 }}>
      <div style={{ background: SURFACE, borderRadius: 10, padding: "20px 18px 16px", position: "relative",
        overflow: "hidden", border: `1px solid ${accent}18`, transition: "border-color 0.3s" }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${accent}40`; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${accent}18`; }}>
        <h4 className={heading} style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em",
          color: accent, textTransform: "uppercase", marginBottom: 14 }}>{tool.label}</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {tool.items.map((it) => (
            <span key={it} className={mono} style={{ fontSize: 13, color: SILVER, lineHeight: 1.4 }}>{it}</span>
          ))}
        </div>
        {/* Rainbow bottom border */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
          background: RAINBOW, backgroundSize: "300% 300%", animation: "shimmer 8s ease infinite",
          animationDelay: `${index * 0.5}s` }} />
      </div>
    </motion.div>
  );
}
