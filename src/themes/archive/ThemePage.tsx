"use client";

import { projects, stats, expertise, tools } from "@/app/data/projects";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";
import { motion, useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════════
   ARCHIVE THEME — Institutional Filing System
   ═══════════════════════════════════════════════════════════════ */

/* ─── Color constants ─── */
const C = {
  bg: "#2C2C2C",
  bgDark: "#222222",
  paper: "#FFF8F0",
  paperDark: "#F5EDE0",
  red: "#C0392B",
  redDark: "#992D22",
  olive: "#5D5C50",
  oliveDark: "#4A493E",
  brass: "#DAA520",
  brassLight: "#E8C44A",
  ink: "#1A1A1A",
  inkFade: "#555555",
  manila: "#F5E6C8",
  manilaDark: "#E8D5B0",
  tab: "#D4C4A0",
  tabBlue: "#7BA3C9",
  tabGreen: "#7CAF7C",
  tabOrange: "#D4956A",
  tabPink: "#C98C9A",
  cream: "#FFFDF5",
  stampFade: "rgba(192, 57, 43, 0.12)",
};

/* ─── Reference & file number generators ─── */
const fileNum = (i: number) => `ARC-${String(2025000 + i * 137).toString()}`;
const refCode = (i: number) => `${String.fromCharCode(65 + (i % 26))}-${String(i + 1).padStart(3, "0")}`;
const classificationLabels = ["CLASSIFIED", "CONFIDENTIAL", "RESTRICTED", "FOR INTERNAL USE", "SENSITIVE"];
const stampTexts = ["FILED", "PROCESSED", "REVIEWED", "CATALOGED", "APPROVED", "RECEIVED", "ARCHIVED", "VERIFIED", "ENTERED", "COMPLETE"];

/* ─── Folder tab color rotation ─── */
const tabColors = [C.tabBlue, C.tabGreen, C.tabOrange, C.tabPink];

/* ═══════════════════════════════════════════════════════════════
   SVG COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

/* ─── Filing Cabinet Illustration ─── */
function FilingCabinetSVG({ className = "" }: { className?: string }) {
  return (
    <svg width="280" height="420" viewBox="0 0 280 420" className={className} style={{ display: "block" }}>
      {/* Cabinet body */}
      <rect x="20" y="10" width="240" height="400" rx="4" fill={C.olive} stroke={C.oliveDark} strokeWidth="2" />
      {/* Side highlight */}
      <rect x="20" y="10" width="12" height="400" rx="2" fill={C.oliveDark} opacity="0.4" />
      {/* Top trim */}
      <rect x="16" y="6" width="248" height="12" rx="3" fill={C.oliveDark} />
      {/* Bottom base */}
      <rect x="16" y="402" width="248" height="14" rx="3" fill={C.oliveDark} />
      {/* Drawer 1 */}
      <rect x="36" y="28" width="208" height="86" rx="2" fill="#6B6A5E" stroke={C.oliveDark} strokeWidth="1.5" />
      <rect x="110" y="62" width="60" height="18" rx="9" fill={C.brass} stroke="#B8941C" strokeWidth="1" />
      <rect x="126" y="68" width="28" height="6" rx="3" fill="#B8941C" />
      {/* Label slot */}
      <rect x="100" y="36" width="80" height="20" rx="2" fill={C.paper} stroke="#CCC" strokeWidth="0.5" />
      <line x1="106" y1="42" x2="174" y2="42" stroke="#DDD" strokeWidth="0.5" />
      <line x1="106" y1="48" x2="160" y2="48" stroke="#DDD" strokeWidth="0.5" />
      {/* Drawer 2 - partially open */}
      <rect x="36" y="122" width="208" height="86" rx="2" fill="#6B6A5E" stroke={C.oliveDark} strokeWidth="1.5" />
      <rect x="30" y="126" width="220" height="78" rx="2" fill="#73726A" stroke={C.oliveDark} strokeWidth="1" />
      <rect x="110" y="156" width="60" height="18" rx="9" fill={C.brass} stroke="#B8941C" strokeWidth="1" />
      <rect x="126" y="162" width="28" height="6" rx="3" fill="#B8941C" />
      {/* Files peeking out */}
      <rect x="50" y="130" width="4" height="50" rx="1" fill={C.manila} transform="rotate(-2, 52, 155)" />
      <rect x="70" y="132" width="4" height="48" rx="1" fill={C.paper} transform="rotate(1, 72, 156)" />
      <rect x="90" y="131" width="4" height="49" rx="1" fill={C.manilaDark} transform="rotate(-1, 92, 155)" />
      <rect x="160" y="130" width="4" height="50" rx="1" fill={C.paper} transform="rotate(2, 162, 155)" />
      {/* Drawer 3 */}
      <rect x="36" y="216" width="208" height="86" rx="2" fill="#6B6A5E" stroke={C.oliveDark} strokeWidth="1.5" />
      <rect x="110" y="250" width="60" height="18" rx="9" fill={C.brass} stroke="#B8941C" strokeWidth="1" />
      <rect x="126" y="256" width="28" height="6" rx="3" fill="#B8941C" />
      <rect x="100" y="224" width="80" height="20" rx="2" fill={C.paper} stroke="#CCC" strokeWidth="0.5" />
      <line x1="106" y1="230" x2="174" y2="230" stroke="#DDD" strokeWidth="0.5" />
      <line x1="106" y1="236" x2="150" y2="236" stroke="#DDD" strokeWidth="0.5" />
      {/* Drawer 4 */}
      <rect x="36" y="310" width="208" height="86" rx="2" fill="#6B6A5E" stroke={C.oliveDark} strokeWidth="1.5" />
      <rect x="110" y="344" width="60" height="18" rx="9" fill={C.brass} stroke="#B8941C" strokeWidth="1" />
      <rect x="126" y="350" width="28" height="6" rx="3" fill="#B8941C" />
      <rect x="100" y="318" width="80" height="20" rx="2" fill={C.paper} stroke="#CCC" strokeWidth="0.5" />
      <line x1="106" y1="324" x2="174" y2="324" stroke="#DDD" strokeWidth="0.5" />
      <line x1="106" y1="330" x2="155" y2="330" stroke="#DDD" strokeWidth="0.5" />
      {/* Feet */}
      <rect x="30" y="412" width="20" height="8" rx="2" fill="#3D3C34" />
      <rect x="230" y="412" width="20" height="8" rx="2" fill="#3D3C34" />
    </svg>
  );
}

/* ─── Rubber Stamp SVG ─── */
function RubberStamp({
  text,
  size = 120,
  rotation = -5,
  color = C.red,
  className = "",
}: {
  text: string;
  size?: number;
  rotation?: number;
  color?: string;
  className?: string;
}) {
  const r = size / 2 - 6;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      style={{ display: "block", transform: `rotate(${rotation}deg)` }}
    >
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="3" opacity="0.85" />
      <circle cx={size / 2} cy={size / 2} r={r - 5} fill="none" stroke={color} strokeWidth="1.5" opacity="0.6" />
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fill={color}
        fontSize={size * 0.15}
        fontFamily="var(--font-space-grotesk)"
        fontWeight="700"
        letterSpacing="2"
        opacity="0.85"
      >
        {text}
      </text>
      {/* Grunge effect lines */}
      <line x1={size * 0.15} y1={size * 0.35} x2={size * 0.85} y2={size * 0.35} stroke={color} strokeWidth="0.5" opacity="0.15" />
      <line x1={size * 0.2} y1={size * 0.65} x2={size * 0.8} y2={size * 0.65} stroke={color} strokeWidth="0.5" opacity="0.15" />
    </svg>
  );
}

/* ─── Paper Clip SVG ─── */
function PaperClip({ color = "#999", size = 40, className = "" }: { color?: string; size?: number; className?: string }) {
  return (
    <svg width={size} height={size * 2} viewBox="0 0 20 40" className={className} style={{ display: "block" }}>
      <path
        d="M7 2 C3 2, 2 5, 2 8 L2 30 C2 35, 6 38, 10 38 C14 38, 18 35, 18 30 L18 10 C18 6, 15 4, 12 4 C9 4, 7 6, 7 10 L7 28"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ─── Folder Tab Shape ─── */
function FolderTab({
  label,
  color,
  width = 160,
  className = "",
}: {
  label: string;
  color: string;
  width?: number;
  className?: string;
}) {
  return (
    <svg width={width} height="36" viewBox={`0 0 ${width} 36`} className={className} style={{ display: "block" }}>
      <path
        d={`M0 36 L0 10 C0 4, 4 0, 10 0 L${width - 10} 0 C${width - 4} 0, ${width} 4, ${width} 10 L${width} 36`}
        fill={color}
        stroke={color}
        strokeWidth="0"
      />
      <text
        x={width / 2}
        y="20"
        textAnchor="middle"
        dominantBaseline="central"
        fill={C.ink}
        fontSize="11"
        fontFamily="var(--font-space-grotesk)"
        fontWeight="600"
        letterSpacing="1"
      >
        {label.toUpperCase()}
      </text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ANIMATED SECTION COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

/* ─── Index Card for Projects ─── */
function IndexCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const hasStamp = index % 3 === 0;
  const titleLines = project.title.split("\n");

  return (
    <motion.div
      ref={ref}
      initial={{ x: -120, opacity: 0, rotateZ: -1 }}
      animate={inView ? { x: 0, opacity: 1, rotateZ: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: C.manila,
        borderRadius: "2px",
        position: "relative",
        overflow: "visible",
        boxShadow: "2px 3px 8px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(0,0,0,0.05)",
      }}
    >
      {/* Tab at top */}
      <div
        style={{
          position: "absolute",
          top: "-28px",
          left: index % 2 === 0 ? "24px" : "auto",
          right: index % 2 !== 0 ? "24px" : "auto",
        }}
      >
        <FolderTab label={project.client} color={tabColors[index % tabColors.length]} width={140} />
      </div>

      {/* Paper clip on some cards */}
      {index % 4 === 1 && (
        <div style={{ position: "absolute", top: "-8px", right: "40px", transform: "rotate(15deg)", opacity: 0.6 }}>
          <PaperClip color="#888" size={28} />
        </div>
      )}

      <div style={{ padding: "28px 28px 24px" }}>
        {/* Header row: ref number + year */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
          <span
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: "11px",
              color: C.inkFade,
              letterSpacing: "0.5px",
            }}
          >
            FILE NO. {fileNum(index)}
          </span>
          <span
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: "11px",
              color: C.red,
              fontWeight: 700,
              border: `1.5px solid ${C.red}`,
              padding: "2px 8px",
              letterSpacing: "1px",
            }}
          >
            {project.year}
          </span>
        </div>

        {/* Horizontal rule */}
        <div style={{ borderBottom: `1px dashed ${C.manilaDark}`, marginBottom: "14px" }} />

        {/* Title */}
        <h3
          style={{
            fontFamily: "var(--font-space-grotesk)",
            fontSize: "22px",
            fontWeight: 700,
            color: C.ink,
            lineHeight: 1.2,
            marginBottom: "8px",
          }}
        >
          {titleLines.map((line, i) => (
            <span key={i}>
              {line}
              {i < titleLines.length - 1 && <br />}
            </span>
          ))}
        </h3>

        {/* Client label */}
        <div
          style={{
            fontFamily: "var(--font-space-grotesk)",
            fontSize: "11px",
            color: C.inkFade,
            textTransform: "uppercase",
            letterSpacing: "2px",
            marginBottom: "14px",
          }}
        >
          Subject: {project.client}
        </div>

        {/* Description typed on card */}
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "13.5px",
            lineHeight: 1.65,
            color: C.ink,
            marginBottom: "14px",
            opacity: 0.85,
          }}
        >
          {project.description}
        </p>

        {/* Technical notes */}
        <div
          style={{
            background: C.paper,
            border: `1px solid ${C.manilaDark}`,
            borderRadius: "2px",
            padding: "12px 14px",
            marginBottom: "14px",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-space-grotesk)",
              fontSize: "9px",
              textTransform: "uppercase",
              letterSpacing: "2px",
              color: C.red,
              marginBottom: "6px",
              fontWeight: 700,
            }}
          >
            Technical Notes
          </div>
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "12.5px",
              lineHeight: 1.6,
              color: C.inkFade,
            }}
          >
            {project.technical}
          </p>
        </div>

        {/* Tech tags as typed labels */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
          {project.tech.map((t) => (
            <span
              key={t}
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: "10.5px",
                background: C.paper,
                border: `1px solid ${C.manilaDark}`,
                padding: "3px 10px",
                color: C.ink,
                letterSpacing: "0.5px",
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Footer: github link + ref code */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: "11px",
              color: C.red,
              textDecoration: "underline",
              textUnderlineOffset: "3px",
            }}
          >
            VIEW SOURCE {"\u2192"}
          </a>
          <span
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: "10px",
              color: C.inkFade,
              opacity: 0.5,
            }}
          >
            REF: {refCode(index)}
          </span>
        </div>
      </div>

      {/* CONFIDENTIAL / CLASSIFIED stamp overlay */}
      {hasStamp && (
        <motion.div
          initial={{ scale: 2.5, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
          style={{
            position: "absolute",
            top: "50%",
            right: "16px",
            transform: "translateY(-50%)",
            pointerEvents: "none",
          }}
        >
          <RubberStamp
            text={classificationLabels[index % classificationLabels.length]}
            size={100}
            rotation={-8 + (index % 3) * 5}
            color={`rgba(192, 57, 43, 0.25)`}
          />
        </motion.div>
      )}
    </motion.div>
  );
}

/* ─── Expertise File Folder ─── */
function ExpertiseFolder({ item, index }: { item: (typeof expertise)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [flipped, setFlipped] = useState(false);
  const color = tabColors[index % tabColors.length];

  return (
    <motion.div
      ref={ref}
      initial={{ y: 40, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      onClick={() => setFlipped(!flipped)}
      style={{
        perspective: "800px",
        cursor: "pointer",
        minHeight: "220px",
      }}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          minHeight: "220px",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Front - Folder */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            background: C.manila,
            borderRadius: "0 0 4px 4px",
            boxShadow: "2px 3px 8px rgba(0,0,0,0.12)",
            overflow: "visible",
          }}
        >
          {/* Tab */}
          <div
            style={{
              position: "absolute",
              top: "-28px",
              left: `${16 + index * 30}px`,
            }}
          >
            <FolderTab label={`FILE ${index + 1}`} color={color} width={100} />
          </div>

          <div style={{ padding: "24px 20px" }}>
            <div
              style={{
                fontFamily: "var(--font-space-grotesk)",
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "2px",
                color: C.red,
                marginBottom: "10px",
                fontWeight: 700,
              }}
            >
              Department {String.fromCharCode(65 + index)}
            </div>
            <h4
              style={{
                fontFamily: "var(--font-space-grotesk)",
                fontSize: "18px",
                fontWeight: 700,
                color: C.ink,
                marginBottom: "12px",
                lineHeight: 1.3,
              }}
            >
              {item.title}
            </h4>
            <div
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: "10px",
                color: C.inkFade,
                opacity: 0.6,
              }}
            >
              CLICK TO OPEN FILE {"\u2192"}
            </div>
            {/* Small stamp */}
            <div style={{ position: "absolute", bottom: "16px", right: "16px", opacity: 0.15 }}>
              <RubberStamp text="ACTIVE" size={60} rotation={-4} />
            </div>
          </div>
        </div>

        {/* Back - File contents */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: C.paper,
            borderRadius: "4px",
            boxShadow: "2px 3px 8px rgba(0,0,0,0.12)",
            border: `1px solid ${C.manilaDark}`,
          }}
        >
          <div style={{ padding: "24px 20px" }}>
            <div
              style={{
                fontFamily: "var(--font-space-grotesk)",
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "2px",
                color,
                marginBottom: "6px",
                fontWeight: 700,
              }}
            >
              {item.title}
            </div>
            <div style={{ borderBottom: `1px solid ${C.manilaDark}`, marginBottom: "12px" }} />
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "13px",
                lineHeight: 1.7,
                color: C.ink,
                opacity: 0.85,
              }}
            >
              {item.body}
            </p>
            <div
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: "10px",
                color: C.inkFade,
                marginTop: "16px",
                opacity: 0.5,
              }}
            >
              CLICK TO CLOSE
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Card Catalog Drawer for Tools ─── */
function CatalogDrawer({ category, catIdx }: { category: (typeof tools)[number]; catIdx: number }) {
  const catRef = useRef<HTMLDivElement>(null);
  const catInView = useInView(catRef, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={catRef}
      initial={{ y: 40, opacity: 0 }}
      animate={catInView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.6, delay: catIdx * 0.1 }}
      style={{
        background: C.olive,
        borderRadius: "4px",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      {/* Drawer handle */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "14px 16px 10px",
          borderBottom: `1px solid ${C.oliveDark}`,
        }}
      >
        {/* Brass label plate */}
        <div
          style={{
            background: `linear-gradient(180deg, ${C.brassLight}, ${C.brass})`,
            borderRadius: "3px",
            padding: "4px 20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-space-grotesk)",
              fontSize: "11px",
              fontWeight: 700,
              color: C.ink,
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            {category.label}
          </span>
        </div>
      </div>

      {/* Brass pull handle */}
      <div style={{ display: "flex", justifyContent: "center", padding: "6px 0" }}>
        <div
          style={{
            width: "36px",
            height: "12px",
            borderRadius: "6px",
            background: `linear-gradient(180deg, ${C.brassLight}, ${C.brass})`,
            boxShadow: "0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.4)",
          }}
        />
      </div>

      {/* Cards inside drawer */}
      <div style={{ padding: "12px 14px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
        {category.items.map((item, itemIdx) => (
          <motion.div
            key={item}
            initial={{ x: -30, opacity: 0 }}
            animate={catInView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: catIdx * 0.1 + itemIdx * 0.08 }}
            style={{
              background: C.cream,
              padding: "8px 12px",
              borderRadius: "1px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "1px 1px 3px rgba(0,0,0,0.1)",
              borderLeft: `3px solid ${tabColors[catIdx % tabColors.length]}`,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "13px",
                color: C.ink,
                fontWeight: 500,
              }}
            >
              {item}
            </span>
            <span
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: "9px",
                color: C.inkFade,
                opacity: 0.5,
              }}
            >
              {refCode(catIdx * 10 + itemIdx)}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Typewriter text effect ─── */
function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const timer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timer);
  }, [inView, delay]);

  useEffect(() => {
    if (!started) return;
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      setDisplayed(text.slice(0, idx));
      if (idx >= text.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [started, text]);

  return (
    <span ref={ref}>
      {displayed}
      {started && displayed.length < text.length && (
        <span className="archive-cursor">|</span>
      )}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN ARCHIVE PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function ArchivePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true });
  const projectsRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const footerInView = useInView(footerRef, { once: true });

  return (
    <>
      <style>{`
        @keyframes archiveBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes archiveStampPress {
          0% { transform: scale(3) rotate(-12deg); opacity: 0; }
          60% { transform: scale(0.95) rotate(-5deg); opacity: 1; }
          80% { transform: scale(1.05) rotate(-4deg); opacity: 1; }
          100% { transform: scale(1) rotate(-5deg); opacity: 1; }
        }
        @keyframes archiveSlideDrawer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0); }
        }
        @keyframes archivePulseRed {
          0%, 100% { box-shadow: 0 0 0 0 rgba(192, 57, 43, 0.3); }
          50% { box-shadow: 0 0 0 8px rgba(192, 57, 43, 0); }
        }
        @keyframes archiveFadeUp {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes archiveTypewriter {
          from { width: 0; }
          to { width: 100%; }
        }
        @keyframes archiveScanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .archive-cursor {
          animation: archiveBlink 0.7s infinite;
          color: ${C.red};
          font-weight: 700;
        }
        .archive-card-catalog::-webkit-scrollbar {
          width: 6px;
        }
        .archive-card-catalog::-webkit-scrollbar-track {
          background: ${C.bgDark};
        }
        .archive-card-catalog::-webkit-scrollbar-thumb {
          background: ${C.olive};
          border-radius: 3px;
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: C.bg,
          color: C.paper,
          fontFamily: "var(--font-inter)",
          position: "relative",
          overflowX: "hidden",
        }}
      >
        {/* ═══ Subtle scanline overlay ═══ */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 50,
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)`,
          }}
        />

        {/* ═══════════════════════════════════════════════════════════
            HERO SECTION
           ═══════════════════════════════════════════════════════════ */}
        <section
          ref={heroRef}
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
            padding: "40px 20px",
          }}
        >
          {/* Background pattern: filing grid */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `
                linear-gradient(rgba(93,92,80,0.08) 1px, transparent 1px),
                linear-gradient(90deg, rgba(93,92,80,0.08) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
          />

          {/* Diagonal corner tape decoration */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "200px",
              height: "200px",
              overflow: "hidden",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "30px",
                right: "-60px",
                background: C.red,
                color: C.paper,
                fontFamily: "var(--font-space-grotesk)",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "3px",
                padding: "6px 80px",
                transform: "rotate(45deg)",
                textAlign: "center",
              }}
            >
              2025
            </div>
          </div>

          <div style={{ maxWidth: "1100px", width: "100%", display: "flex", gap: "60px", alignItems: "center", position: "relative", zIndex: 1 }}>
            {/* Left: Text content */}
            <div style={{ flex: 1 }}>
              {/* File number header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  fontSize: "12px",
                  color: C.brass,
                  letterSpacing: "3px",
                  marginBottom: "20px",
                }}
              >
                FILE NO. ARC-001 {"\u2502"} DEPT. OF DIGITAL WORKS
              </motion.div>

              {/* ARCHIVE title with stamp effect */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={heroInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ position: "relative", marginBottom: "24px" }}
              >
                <h1
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    fontSize: "clamp(64px, 10vw, 120px)",
                    fontWeight: 700,
                    lineHeight: 0.9,
                    color: C.paper,
                    letterSpacing: "-2px",
                    position: "relative",
                  }}
                >
                  ARCHIVE
                </h1>
                {/* Stamp border effect around title */}
                <motion.div
                  initial={{ scale: 3, opacity: 0 }}
                  animate={heroInView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ delay: 0.8, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                  style={{
                    position: "absolute",
                    top: "-12px",
                    left: "-16px",
                    right: "-16px",
                    bottom: "-12px",
                    border: `3px solid ${C.red}`,
                    borderRadius: "4px",
                    opacity: 0.7,
                    pointerEvents: "none",
                  }}
                />
                <motion.div
                  initial={{ scale: 3, opacity: 0 }}
                  animate={heroInView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ delay: 0.9, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                  style={{
                    position: "absolute",
                    top: "-8px",
                    left: "-12px",
                    right: "-12px",
                    bottom: "-8px",
                    border: `1.5px solid ${C.red}`,
                    borderRadius: "2px",
                    opacity: 0.4,
                    pointerEvents: "none",
                  }}
                />
              </motion.div>

              {/* Subtitle with typewriter */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={heroInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  fontSize: "14px",
                  color: C.paper,
                  opacity: 0.6,
                  marginBottom: "36px",
                  lineHeight: 1.7,
                }}
              >
                <TypewriterText text="AI Engineering Portfolio \u2014 Institutional Records Division" delay={1200} />
              </motion.div>

              {/* CLASSIFIED stamp */}
              <motion.div
                initial={{ scale: 3, opacity: 0, rotate: -12 }}
                animate={heroInView ? { scale: 1, opacity: 1, rotate: -5 } : {}}
                transition={{ delay: 1.5, duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                style={{ marginBottom: "40px" }}
              >
                <RubberStamp text="CLASSIFIED" size={140} rotation={-5} color={C.red} />
              </motion.div>

              {/* Stats as file reference numbers */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                style={{ display: "flex", gap: "32px" }}
              >
                {stats.map((stat, i) => (
                  <div key={stat.label}>
                    <div
                      style={{
                        fontFamily: "var(--font-space-grotesk)",
                        fontSize: "32px",
                        fontWeight: 700,
                        color: C.brass,
                        lineHeight: 1,
                      }}
                    >
                      {stat.value}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-jetbrains)",
                        fontSize: "10px",
                        color: C.paper,
                        opacity: 0.5,
                        textTransform: "uppercase",
                        letterSpacing: "2px",
                        marginTop: "6px",
                      }}
                    >
                      {stat.label}
                    </div>
                    {i < stats.length - 1 && (
                      <div
                        style={{
                          position: "absolute",
                          right: 0,
                          top: 0,
                          bottom: 0,
                          width: "1px",
                          background: C.olive,
                        }}
                      />
                    )}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: Filing Cabinet SVG */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block"
              style={{ flexShrink: 0, opacity: 0.6 }}
            >
              <FilingCabinetSVG />
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ delay: 2, duration: 0.5 }}
            style={{
              position: "absolute",
              bottom: "40px",
              left: "50%",
              transform: "translateX(-50%)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: "10px",
                color: C.paper,
                opacity: 0.3,
                letterSpacing: "3px",
                textTransform: "uppercase",
              }}
            >
              Open Files
            </div>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ marginTop: "8px", color: C.red, fontSize: "18px" }}
            >
              {"\u2193"}
            </motion.div>
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            PROJECTS SECTION — Index Cards from Filing Cabinet
           ═══════════════════════════════════════════════════════════ */}
        <section
          ref={projectsRef}
          style={{
            padding: "100px 20px 80px",
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          {/* Section header */}
          <div style={{ marginBottom: "60px" }}>
            <div
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: "11px",
                color: C.brass,
                letterSpacing: "3px",
                marginBottom: "12px",
              }}
            >
              SECTION 01 {"\u2502"} PROJECT FILES
            </div>
            <h2
              style={{
                fontFamily: "var(--font-space-grotesk)",
                fontSize: "clamp(32px, 5vw, 48px)",
                fontWeight: 700,
                color: C.paper,
                lineHeight: 1.1,
              }}
            >
              Filed Works
            </h2>
            <div
              style={{
                width: "60px",
                height: "3px",
                background: C.red,
                marginTop: "16px",
              }}
            />
            <div
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "14px",
                color: C.paper,
                opacity: 0.5,
                marginTop: "12px",
              }}
            >
              Each record represents a completed AI engineering project. Pull from the cabinet to review.
            </div>
          </div>

          {/* Project cards grid */}
          <div style={{ display: "flex", flexDirection: "column", gap: "52px" }}>
            {projects.map((project, i) => (
              <IndexCard key={project.title} project={project} index={i} />
            ))}
          </div>

          {/* End of section stamp */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              textAlign: "center",
              marginTop: "60px",
              fontFamily: "var(--font-jetbrains)",
              fontSize: "11px",
              color: C.olive,
              letterSpacing: "3px",
            }}
          >
            {"\u2500".repeat(20)} END OF PROJECT FILES {"\u2500".repeat(20)}
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            EXPERTISE SECTION — File Folders with Tabs
           ═══════════════════════════════════════════════════════════ */}
        <section
          style={{
            padding: "80px 20px",
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          {/* Section header */}
          <div style={{ marginBottom: "60px" }}>
            <div
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: "11px",
                color: C.brass,
                letterSpacing: "3px",
                marginBottom: "12px",
              }}
            >
              SECTION 02 {"\u2502"} EXPERTISE DOSSIERS
            </div>
            <h2
              style={{
                fontFamily: "var(--font-space-grotesk)",
                fontSize: "clamp(32px, 5vw, 48px)",
                fontWeight: 700,
                color: C.paper,
                lineHeight: 1.1,
              }}
            >
              Areas of Specialization
            </h2>
            <div
              style={{
                width: "60px",
                height: "3px",
                background: C.red,
                marginTop: "16px",
              }}
            />
            <div
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "14px",
                color: C.paper,
                opacity: 0.5,
                marginTop: "12px",
              }}
            >
              Click each folder to review classified expertise documentation.
            </div>
          </div>

          {/* Expertise folders grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "48px 24px",
              paddingTop: "32px",
            }}
          >
            {expertise.map((item, i) => (
              <ExpertiseFolder key={item.title} item={item} index={i} />
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            TOOLS SECTION — Card Catalog Drawers
           ═══════════════════════════════════════════════════════════ */}
        <section
          ref={toolsRef}
          style={{
            padding: "80px 20px 100px",
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          {/* Section header */}
          <div style={{ marginBottom: "60px" }}>
            <div
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: "11px",
                color: C.brass,
                letterSpacing: "3px",
                marginBottom: "12px",
              }}
            >
              SECTION 03 {"\u2502"} TOOL CATALOG
            </div>
            <h2
              style={{
                fontFamily: "var(--font-space-grotesk)",
                fontSize: "clamp(32px, 5vw, 48px)",
                fontWeight: 700,
                color: C.paper,
                lineHeight: 1.1,
              }}
            >
              Card Catalog
            </h2>
            <div
              style={{
                width: "60px",
                height: "3px",
                background: C.red,
                marginTop: "16px",
              }}
            />
          </div>

          {/* Card catalog grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "28px",
            }}
          >
            {tools.map((category, catIdx) => (
              <CatalogDrawer key={category.label} category={category} catIdx={catIdx} />
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            FOOTER — End of File
           ═══════════════════════════════════════════════════════════ */}
        <footer
          ref={footerRef}
          style={{
            padding: "60px 20px 40px",
            borderTop: `2px solid ${C.olive}`,
            position: "relative",
          }}
        >
          <div
            style={{
              maxWidth: "900px",
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            {/* END OF FILE stamp */}
            <motion.div
              initial={{ scale: 3, opacity: 0 }}
              animate={footerInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
              style={{ display: "inline-block", marginBottom: "30px" }}
            >
              <RubberStamp text="END OF FILE" size={160} rotation={-3} color={C.red} />
            </motion.div>

            {/* Archive reference info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={footerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  fontSize: "11px",
                  color: C.paper,
                  opacity: 0.3,
                  letterSpacing: "2px",
                  marginBottom: "8px",
                }}
              >
                ARCHIVE REF: ARC-2025-PORTFOLIO-001
              </div>
              <div
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  fontSize: "10px",
                  color: C.paper,
                  opacity: 0.2,
                  letterSpacing: "1px",
                  marginBottom: "24px",
                }}
              >
                FILED: {new Date().getFullYear()} {"\u2502"} DEPARTMENT OF DIGITAL WORKS {"\u2502"} ALL RIGHTS RESERVED
              </div>

              {/* Decorative line */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "16px",
                  marginBottom: "20px",
                }}
              >
                <div style={{ width: "60px", height: "1px", background: C.olive }} />
                <span
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    fontSize: "16px",
                    color: C.brass,
                    opacity: 0.5,
                  }}
                >
                  {"\u2318"}
                </span>
                <div style={{ width: "60px", height: "1px", background: C.olive }} />
              </div>

              {/* Footer icon */}
              <div
                style={{
                  fontFamily: "var(--font-space-grotesk)",
                  fontSize: "24px",
                  color: C.red,
                  opacity: 0.4,
                  marginBottom: "20px",
                }}
              >
                {"\u2338"}
              </div>

              <div
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  fontSize: "10px",
                  color: C.paper,
                  opacity: 0.15,
                  letterSpacing: "4px",
                  textTransform: "uppercase",
                }}
              >
                This document is the property of the Archive. Unauthorized reproduction is prohibited.
              </div>
            </motion.div>
          </div>

          {/* Corner classifications */}
          <div
            style={{
              position: "absolute",
              bottom: "12px",
              left: "20px",
              fontFamily: "var(--font-jetbrains)",
              fontSize: "9px",
              color: C.paper,
              opacity: 0.1,
              letterSpacing: "1px",
            }}
          >
            PAGE 1 OF 1
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "12px",
              right: "20px",
              fontFamily: "var(--font-jetbrains)",
              fontSize: "9px",
              color: C.paper,
              opacity: 0.1,
              letterSpacing: "1px",
            }}
          >
            PRINT DATE: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" })}
          </div>
        </footer>

        {/* ═══ Theme Switcher ═══ */}
        <ThemeSwitcher current="/archive" variant="dark" />
      </div>
    </>
  );
}
