"use client";

import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { motion, useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";

/* ─── Color Palette ─── */
const C = {
  bg: "#2C1810",
  bgDark: "#1A0F08",
  paper: "#F5E6C8",
  paperDark: "#E8D5B0",
  brass: "#C4963A",
  brassLight: "rgba(196,150,58,0.3)",
  brassMuted: "rgba(196,150,58,0.15)",
  ink: "#1A1A1A",
  copper: "#B87333",
  copperLight: "rgba(184,115,51,0.4)",
  wire: "#1B2F1B",
  wireBright: "#2A4A2A",
  red: "#8B2500",
  textLight: "#F5E6C8",
  textMuted: "rgba(245,230,200,0.5)",
  stripe: "#D4B896",
};

/* ─── Morse Code Map ─── */
const MORSE: Record<string, string> = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.",
  G: "--.", H: "....", I: "..", J: ".---", K: "-.-", L: ".-..",
  M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.",
  S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
  Y: "-.--", Z: "--..", "1": ".----", "2": "..---", "3": "...--",
  "4": "....-", "5": ".....", "6": "-....", "7": "--...", "8": "---..",
  "9": "----.", "0": "-----", " ": "/",
};

function toMorse(text: string): string {
  return text
    .toUpperCase()
    .split("")
    .map((ch) => MORSE[ch] || ch)
    .join(" ");
}

/* ─── Typewriter Text Component ─── */
function TypewriterText({
  text,
  delay = 0,
  speed = 30,
  className = "",
  style = {},
}: {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (inView && !started) {
      const t = setTimeout(() => setStarted(true), delay);
      return () => clearTimeout(t);
    }
  }, [inView, started, delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i > text.length) {
        clearInterval(interval);
        setDone(true);
        return;
      }
      setDisplayed(text.slice(0, i));
    }, speed);
    return () => clearInterval(interval);
  }, [started, text, speed]);

  useEffect(() => {
    if (!started) return;
    const blink = setInterval(() => setShowCursor((c) => !c), 530);
    return () => clearInterval(blink);
  }, [started]);

  return (
    <span ref={ref} className={className} style={style}>
      {started ? displayed : ""}
      {started && !done && (
        <span style={{ opacity: showCursor ? 1 : 0, color: C.brass }}>
          |
        </span>
      )}
    </span>
  );
}

/* ─── Morse Dot/Dash Border SVG ─── */
function MorseBorderSVG({ width = 300 }: { width?: number }) {
  const pattern = ".- -.-. -.-- / -- --- .-. ... .";
  let x = 0;
  const elems: React.ReactNode[] = [];
  for (let i = 0; i < pattern.length && x < width; i++) {
    const ch = pattern[i];
    if (ch === ".") {
      elems.push(
        <circle key={`d-${i}`} cx={x + 3} cy={4} r={2.5} fill={C.brass} />
      );
      x += 10;
    } else if (ch === "-") {
      elems.push(
        <rect key={`h-${i}`} x={x} y={1.5} width={14} height={5} rx={2} fill={C.brass} />
      );
      x += 20;
    } else if (ch === " ") {
      x += 6;
    } else if (ch === "/") {
      x += 14;
    }
  }
  return (
    <svg width={width} height={8} viewBox={`0 0 ${width} 8`} style={{ opacity: 0.6 }}>
      {elems}
    </svg>
  );
}

/* ─── Telegraph Key SVG ─── */
function TelegraphKeySVG() {
  return (
    <svg
      viewBox="0 0 300 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", maxWidth: 300, height: "auto" }}
    >
      {/* Base platform */}
      <rect x="30" y="140" width="240" height="16" rx="3" fill={C.copper} />
      <rect x="30" y="140" width="240" height="4" rx="2" fill={C.brass} opacity={0.5} />
      {/* Base wood grain */}
      <line x1="50" y1="148" x2="260" y2="148" stroke={C.bgDark} strokeWidth="0.5" opacity={0.3} />
      <line x1="40" y1="151" x2="270" y2="151" stroke={C.bgDark} strokeWidth="0.5" opacity={0.2} />

      {/* Rear post / fulcrum */}
      <rect x="60" y="100" width="14" height="42" rx="2" fill={C.brass} />
      <rect x="58" y="96" width="18" height="10" rx="3" fill={C.brass} />
      {/* Post shine */}
      <rect x="63" y="104" width="3" height="30" rx="1" fill="#D4A84A" opacity={0.4} />

      {/* Lever arm */}
      <rect x="55" y="88" width="190" height="7" rx="3" fill={C.copper} />
      <rect x="55" y="88" width="190" height="2" rx="1" fill={C.brass} opacity={0.4} />

      {/* Knob */}
      <ellipse cx="230" cy="82" rx="22" ry="10" fill={C.bgDark} />
      <ellipse cx="230" cy="80" rx="22" ry="10" fill="#2A1A10" />
      <ellipse cx="230" cy="78" rx="20" ry="8" fill="#3A2A1A" />
      <ellipse cx="230" cy="77" rx="14" ry="5" fill="#4A3A2A" opacity={0.5} />

      {/* Front contact */}
      <rect x="215" y="120" width="30" height="22" rx="3" fill={C.brass} />
      <rect x="222" y="115" width="16" height="6" rx="2" fill={C.copper} />
      <rect x="218" y="128" width="24" height="3" rx={1} fill="#D4A84A" opacity={0.5} />

      {/* Contact point */}
      <circle cx="230" cy="96" r="4" fill={C.brass}>
        <animate
          attributeName="fill"
          values={`${C.brass};#FFD700;${C.brass}`}
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Spark effect */}
      <circle cx="230" cy="96" r="8" fill="none" stroke="#FFD700" strokeWidth="1" opacity={0.3}>
        <animate
          attributeName="r"
          values="4;12;4"
          dur="1.5s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.4;0;0.4"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Wire from back */}
      <path
        d="M60 130 Q30 130 20 145 Q10 160 15 170"
        stroke={C.wire}
        strokeWidth="3"
        fill="none"
      />
      <path
        d="M80 130 Q110 145 120 155 Q125 162 130 170"
        stroke={C.wire}
        strokeWidth="3"
        fill="none"
      />

      {/* Mounting screws */}
      <circle cx="50" cy="148" r="4" fill="#8B7355" stroke={C.brass} strokeWidth="1" />
      <line x1="48" y1="146" x2="52" y2="150" stroke={C.brass} strokeWidth="0.8" />
      <circle cx="255" cy="148" r="4" fill="#8B7355" stroke={C.brass} strokeWidth="1" />
      <line x1="253" y1="146" x2="257" y2="150" stroke={C.brass} strokeWidth="0.8" />

      {/* Decorative screws on contact block */}
      <circle cx="220" cy="126" r="2" fill="#A0844A" />
      <circle cx="240" cy="126" r="2" fill="#A0844A" />
    </svg>
  );
}

/* ─── Telegraph Pole SVG ─── */
function TelegraphPoleSVG({ height = 120 }: { height?: number }) {
  return (
    <svg
      width="60"
      height={height}
      viewBox={`0 0 60 ${height}`}
      fill="none"
      style={{ opacity: 0.4 }}
    >
      {/* Pole */}
      <rect x="27" y="10" width="6" height={height - 10} fill={C.copper} />
      {/* Cross arm */}
      <rect x="5" y="18" width="50" height="5" rx="2" fill={C.copper} />
      {/* Insulators */}
      <ellipse cx="10" cy="16" rx="4" ry="3" fill={C.brass} />
      <ellipse cx="30" cy="16" rx="4" ry="3" fill={C.brass} />
      <ellipse cx="50" cy="16" rx="4" ry="3" fill={C.brass} />
      {/* Wires going off */}
      <line x1="0" y1="16" x2="10" y2="16" stroke={C.wire} strokeWidth="1.5" />
      <line x1="50" y1="16" x2="60" y2="16" stroke={C.wire} strokeWidth="1.5" />
    </svg>
  );
}

/* ─── Ticker Tape Marquee ─── */
function TickerTape() {
  const tapeText = projects
    .map((p) => `⏁ ${p.title.replace("\n", " ").toUpperCase()} ⏁`)
    .join("  ···  ");

  return (
    <div
      style={{
        overflow: "hidden",
        background: C.paper,
        borderTop: `2px solid ${C.brass}`,
        borderBottom: `2px solid ${C.brass}`,
        padding: "6px 0",
        position: "relative",
      }}
    >
      <div className="ticker-tape-scroll" style={{ display: "flex", whiteSpace: "nowrap" }}>
        {[0, 1].map((i) => (
          <span
            key={i}
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: 11,
              letterSpacing: 3,
              color: C.ink,
              fontWeight: 700,
              paddingRight: 40,
              textTransform: "uppercase",
            }}
          >
            {tapeText}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Telegram Card Component ─── */
function TelegramCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const titleClean = project.title.replace("\n", " ").toUpperCase();
  const timestamp = `${project.year}-${String((index % 12) + 1).padStart(2, "0")}-${String(((index * 7) % 28) + 1).padStart(2, "0")} ${String(8 + (index * 3) % 14).padStart(2, "0")}:${String((index * 17) % 60).padStart(2, "0")} UTC`;
  const descSentences = project.description.split(/\.\s*/g).filter(Boolean);
  const descWithStops = descSentences.map((s) => s.replace(/\.$/, "")).join(" STOP ");
  const descFinal = descWithStops + " STOP";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: (index % 3) * 0.15, ease: "easeOut" }}
      style={{
        background: C.paper,
        border: `3px solid ${C.brass}`,
        borderRadius: 2,
        padding: 0,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Telegram striped top border */}
      <div
        style={{
          height: 10,
          background: `repeating-linear-gradient(90deg, ${C.brass} 0px, ${C.brass} 8px, transparent 8px, transparent 16px)`,
        }}
      />

      {/* TELEGRAM header */}
      <div
        style={{
          background: C.brass,
          padding: "8px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-dm-serif)",
            fontSize: 18,
            fontWeight: 700,
            color: C.bgDark,
            letterSpacing: 6,
            textTransform: "uppercase",
          }}
        >
          Telegram
        </span>
        <span
          style={{
            fontFamily: "var(--font-jetbrains)",
            fontSize: 10,
            color: C.bgDark,
            opacity: 0.7,
          }}
        >
          NO. {String(index + 1).padStart(4, "0")}
        </span>
      </div>

      {/* Striped bottom of header */}
      <div
        style={{
          height: 10,
          background: `repeating-linear-gradient(90deg, ${C.brass} 0px, ${C.brass} 8px, transparent 8px, transparent 16px)`,
        }}
      />

      {/* Content */}
      <div style={{ padding: "16px 20px 12px" }}>
        {/* TO / FROM */}
        <div
          style={{
            display: "flex",
            gap: 24,
            marginBottom: 12,
            borderBottom: `1px dashed ${C.stripe}`,
            paddingBottom: 8,
          }}
        >
          <div>
            <span
              style={{
                fontFamily: "var(--font-space-grotesk)",
                fontSize: 9,
                letterSpacing: 2,
                color: C.copper,
                textTransform: "uppercase",
              }}
            >
              TO:
            </span>
            <span
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: 11,
                color: C.ink,
                marginLeft: 6,
                fontWeight: 600,
              }}
            >
              {project.client.toUpperCase()}
            </span>
          </div>
          <div>
            <span
              style={{
                fontFamily: "var(--font-space-grotesk)",
                fontSize: 9,
                letterSpacing: 2,
                color: C.copper,
                textTransform: "uppercase",
              }}
            >
              DATE:
            </span>
            <span
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: 11,
                color: C.ink,
                marginLeft: 6,
              }}
            >
              {timestamp}
            </span>
          </div>
        </div>

        {/* Subject line */}
        <div
          style={{
            fontFamily: "var(--font-dm-serif)",
            fontSize: 16,
            color: C.ink,
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 10,
            lineHeight: 1.3,
            fontWeight: 700,
            borderBottom: `1px solid ${C.stripe}`,
            paddingBottom: 8,
          }}
        >
          RE: {titleClean}
        </div>

        {/* Message body with typewriter effect */}
        <div
          style={{
            fontFamily: "var(--font-jetbrains)",
            fontSize: 11,
            lineHeight: 1.7,
            color: C.ink,
            letterSpacing: 0.5,
            textTransform: "uppercase",
            minHeight: 60,
            marginBottom: 10,
          }}
        >
          <TypewriterText text={descFinal} delay={200 + index * 100} speed={15} />
        </div>

        {/* Technical details */}
        <div
          style={{
            fontFamily: "var(--font-jetbrains)",
            fontSize: 10,
            lineHeight: 1.6,
            color: "rgba(26,26,26,0.6)",
            letterSpacing: 0.3,
            textTransform: "uppercase",
            borderTop: `1px dashed ${C.stripe}`,
            paddingTop: 8,
            marginBottom: 10,
          }}
        >
          TECHNICAL SPEC: {project.technical.toUpperCase()} STOP
        </div>

        {/* Tech tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
          {project.tech.map((t) => (
            <span
              key={t}
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: 9,
                letterSpacing: 2,
                color: C.bgDark,
                background: C.brassLight,
                border: `1px solid ${C.brass}`,
                padding: "2px 8px",
                textTransform: "uppercase",
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Footer with morse */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: `1px solid ${C.stripe}`,
            paddingTop: 8,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: 8,
              color: C.copper,
              letterSpacing: 2,
              opacity: 0.6,
            }}
          >
            {toMorse(titleClean.slice(0, 12))}
          </span>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                fontSize: 10,
                color: C.red,
                textDecoration: "none",
                letterSpacing: 1,
                textTransform: "uppercase",
                fontWeight: 700,
                borderBottom: `1px solid ${C.red}`,
              }}
            >
              VIEW SOURCE →
            </a>
          )}
        </div>
      </div>

      {/* Bottom striped border */}
      <div
        style={{
          height: 10,
          background: `repeating-linear-gradient(90deg, ${C.brass} 0px, ${C.brass} 8px, transparent 8px, transparent 16px)`,
        }}
      />
    </motion.div>
  );
}

/* ─── Expertise Dispatch Card ─── */
function DispatchCard({
  item,
  index,
}: {
  item: (typeof expertise)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      style={{
        background: C.paper,
        border: `2px solid ${C.brass}`,
        padding: 0,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* URGENT stamp */}
      <div
        style={{
          position: "absolute",
          top: 14,
          right: -18,
          transform: "rotate(15deg)",
          fontFamily: "var(--font-dm-serif)",
          fontSize: 16,
          fontWeight: 700,
          color: C.red,
          border: `3px solid ${C.red}`,
          padding: "2px 18px",
          letterSpacing: 4,
          textTransform: "uppercase",
          opacity: 0.65,
          borderRadius: 3,
          pointerEvents: "none",
        }}
      >
        URGENT
      </div>

      {/* Header */}
      <div
        style={{
          background: C.bgDark,
          padding: "8px 16px",
          borderBottom: `2px solid ${C.brass}`,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-space-grotesk)",
            fontSize: 9,
            letterSpacing: 3,
            color: C.brass,
            textTransform: "uppercase",
          }}
        >
          Dispatch No. {String(index + 1).padStart(3, "0")} — Priority
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: "16px 20px" }}>
        <h3
          style={{
            fontFamily: "var(--font-dm-serif)",
            fontSize: 18,
            color: C.ink,
            letterSpacing: 1,
            marginBottom: 8,
            textTransform: "uppercase",
          }}
        >
          {item.title}
        </h3>
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: 12,
            lineHeight: 1.7,
            color: "rgba(26,26,26,0.75)",
          }}
        >
          {item.body}
        </p>

        {/* Morse code footer */}
        <div
          style={{
            marginTop: 12,
            borderTop: `1px dashed ${C.stripe}`,
            paddingTop: 8,
            fontFamily: "var(--font-jetbrains)",
            fontSize: 8,
            color: C.copper,
            letterSpacing: 2,
            opacity: 0.5,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {toMorse(item.title.toUpperCase().slice(0, 20))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Transmission Spark ─── */
function TransmissionSpark() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" style={{ display: "block" }}>
      <circle cx="20" cy="20" r="3" fill={C.brass}>
        <animate attributeName="r" values="2;5;2" dur="1.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="20" cy="20" r="10" fill="none" stroke={C.brass} strokeWidth="1" opacity={0.5}>
        <animate attributeName="r" values="5;15;5" dur="1.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0;0.5" dur="1.2s" repeatCount="indefinite" />
      </circle>
      {/* Spark lines */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 20 + Math.cos(rad) * 6;
        const y1 = 20 + Math.sin(rad) * 6;
        const x2 = 20 + Math.cos(rad) * 12;
        const y2 = 20 + Math.sin(rad) * 12;
        return (
          <line
            key={angle}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={C.brass}
            strokeWidth="1"
            opacity={0.4}
          >
            <animate
              attributeName="opacity"
              values="0.4;0;0.4"
              dur="1.2s"
              begin={`${angle / 360}s`}
              repeatCount="indefinite"
            />
          </line>
        );
      })}
    </svg>
  );
}

/* ─── Telegraph Wire Decoration ─── */
function TelegraphWireSVG() {
  return (
    <svg
      width="100%"
      height="60"
      viewBox="0 0 1200 60"
      preserveAspectRatio="none"
      style={{ display: "block", opacity: 0.3 }}
    >
      {/* Poles */}
      <rect x="50" y="5" width="4" height="55" fill={C.copper} />
      <rect x="44" y="12" width="16" height="3" rx="1" fill={C.copper} />
      <rect x="300" y="5" width="4" height="55" fill={C.copper} />
      <rect x="294" y="12" width="16" height="3" rx="1" fill={C.copper} />
      <rect x="600" y="5" width="4" height="55" fill={C.copper} />
      <rect x="594" y="12" width="16" height="3" rx="1" fill={C.copper} />
      <rect x="900" y="5" width="4" height="55" fill={C.copper} />
      <rect x="894" y="12" width="16" height="3" rx="1" fill={C.copper} />
      <rect x="1150" y="5" width="4" height="55" fill={C.copper} />
      <rect x="1144" y="12" width="16" height="3" rx="1" fill={C.copper} />

      {/* Wires with catenary sag */}
      <path
        d="M52 13 Q175 28 302 13"
        stroke={C.wireBright}
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M302 13 Q450 30 602 13"
        stroke={C.wireBright}
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M602 13 Q750 30 902 13"
        stroke={C.wireBright}
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M902 13 Q1025 28 1152 13"
        stroke={C.wireBright}
        strokeWidth="2"
        fill="none"
      />

      {/* Second wire */}
      <path
        d="M52 13 Q175 32 302 13"
        stroke={C.wire}
        strokeWidth="1.5"
        fill="none"
        transform="translate(0,6)"
      />
      <path
        d="M302 13 Q450 34 602 13"
        stroke={C.wire}
        strokeWidth="1.5"
        fill="none"
        transform="translate(0,6)"
      />
      <path
        d="M602 13 Q750 34 902 13"
        stroke={C.wire}
        strokeWidth="1.5"
        fill="none"
        transform="translate(0,6)"
      />
      <path
        d="M902 13 Q1025 32 1152 13"
        stroke={C.wire}
        strokeWidth="1.5"
        fill="none"
        transform="translate(0,6)"
      />

      {/* Insulators */}
      {[52, 302, 602, 902, 1152].map((px) => (
        <g key={px}>
          <ellipse cx={px} cy={12} rx={3} ry={2.5} fill={C.brass} />
          <ellipse cx={px} cy={18} rx={3} ry={2.5} fill={C.brass} />
        </g>
      ))}
    </svg>
  );
}

/* ─── Ticker Tape Roll SVG ─── */
function TapeRollSVG({ side }: { side: "left" | "right" }) {
  return (
    <svg width="50" height="80" viewBox="0 0 50 80" style={{ opacity: 0.35 }}>
      <ellipse cx="25" cy="40" rx="20" ry="35" fill="none" stroke={C.brass} strokeWidth="1.5" />
      <ellipse cx="25" cy="40" rx="14" ry="24" fill="none" stroke={C.brass} strokeWidth="1" />
      <ellipse cx="25" cy="40" rx="8" ry="14" fill="none" stroke={C.brass} strokeWidth="0.8" />
      <ellipse cx="25" cy="40" rx="3" ry="5" fill={C.brass} opacity={0.5} />
      {/* Tape coming out */}
      {side === "right" ? (
        <path d="M45 40 Q55 40 55 30 L55 10" stroke={C.paper} strokeWidth="2" fill="none" opacity={0.5} />
      ) : (
        <path d="M5 40 Q-5 40 -5 30 L-5 10" stroke={C.paper} strokeWidth="2" fill="none" opacity={0.5} />
      )}
    </svg>
  );
}

/* ─── Section Divider ─── */
function SectionDivider() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: "40px 0",
      }}
    >
      <div style={{ width: 60, height: 1, background: C.brass, opacity: 0.3 }} />
      <TransmissionSpark />
      <div style={{ width: 60, height: 1, background: C.brass, opacity: 0.3 }} />
    </div>
  );
}

/* ─── Main Page ─── */
export default function TelegraphPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true });
  const [sparkVisible, setSparkVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSparkVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style jsx global>{`
        @keyframes tickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-tape-scroll {
          animation: tickerScroll 60s linear infinite;
        }
        @keyframes sparkPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        @keyframes paperFeed {
          0% { transform: translateY(40px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes morseFlicker {
          0%, 20% { opacity: 1; }
          25%, 30% { opacity: 0.2; }
          35%, 55% { opacity: 1; }
          60%, 65% { opacity: 0.2; }
          70%, 100% { opacity: 1; }
        }
        @keyframes wireHum {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(1px); }
        }
        @keyframes stampSlam {
          0% { transform: rotate(15deg) scale(2); opacity: 0; }
          60% { transform: rotate(15deg) scale(0.95); opacity: 0.7; }
          100% { transform: rotate(15deg) scale(1); opacity: 0.65; }
        }
        @keyframes fadeInUp {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes cursorBlink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @keyframes dashScroll {
          0% { background-position: 0 0; }
          100% { background-position: 40px 0; }
        }
        @keyframes gentleGlow {
          0%, 100% { box-shadow: 0 0 10px rgba(196,150,58,0.1); }
          50% { box-shadow: 0 0 20px rgba(196,150,58,0.25); }
        }
        ::selection {
          background: ${C.brass};
          color: ${C.bgDark};
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: ${C.bgDark};
        }
        ::-webkit-scrollbar-thumb {
          background: ${C.copper};
          border-radius: 4px;
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: C.bg,
          color: C.textLight,
          overflowX: "hidden",
        }}
      >
        {/* ═══════════════════════════════════════════ */}
        {/*  TICKER TAPE MARQUEE                        */}
        {/* ═══════════════════════════════════════════ */}
        <TickerTape />

        {/* ═══════════════════════════════════════════ */}
        {/*  HERO SECTION                               */}
        {/* ═══════════════════════════════════════════ */}
        <section
          ref={heroRef}
          style={{
            position: "relative",
            padding: "80px 20px 60px",
            maxWidth: 1100,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          {/* Morse code border top */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 30, overflow: "hidden" }}>
            <MorseBorderSVG width={500} />
          </div>

          {/* Telegraph poles flanking */}
          <div
            style={{
              position: "absolute",
              left: 20,
              top: 40,
              display: "none",
            }}
            className="hidden lg:block"
          >
            <TelegraphPoleSVG height={200} />
          </div>
          <div
            style={{
              position: "absolute",
              right: 20,
              top: 40,
              display: "none",
            }}
            className="hidden lg:block"
          >
            <TelegraphPoleSVG height={200} />
          </div>

          {/* Western Union style header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div
              style={{
                fontFamily: "var(--font-space-grotesk)",
                fontSize: 11,
                letterSpacing: 6,
                color: C.brass,
                marginBottom: 8,
                textTransform: "uppercase",
              }}
            >
              ·-·· ·· ···- · &nbsp;&nbsp; - ·-· ·- -· ··· -- ·· ··· ··· ·· --- -·
            </div>

            <div
              style={{
                border: `3px double ${C.brass}`,
                padding: "20px 30px",
                display: "inline-block",
                position: "relative",
                marginBottom: 30,
              }}
            >
              {/* Corner ornaments */}
              {[
                { top: -6, left: -6 },
                { top: -6, right: -6 },
                { bottom: -6, left: -6 },
                { bottom: -6, right: -6 },
              ].map((pos, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    width: 10,
                    height: 10,
                    border: `2px solid ${C.brass}`,
                    ...pos,
                  } as React.CSSProperties}
                />
              ))}

              <h1
                style={{
                  fontFamily: "var(--font-dm-serif)",
                  fontSize: "clamp(28px, 5vw, 52px)",
                  fontWeight: 400,
                  color: C.paper,
                  letterSpacing: 8,
                  lineHeight: 1.1,
                  textTransform: "uppercase",
                  margin: 0,
                }}
              >
                Grox Telegraph
                <br />
                <span style={{ fontSize: "0.65em", letterSpacing: 12 }}>Office</span>
              </h1>
            </div>
          </motion.div>

          {/* Telegraph Key Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={heroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{
              maxWidth: 280,
              margin: "0 auto 30px",
              position: "relative",
            }}
          >
            <TelegraphKeySVG />
            {/* Spark on the key */}
            {sparkVisible && (
              <div
                style={{
                  position: "absolute",
                  top: "42%",
                  left: "73%",
                  animation: "sparkPulse 1.5s infinite",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="4" fill="#FFD700" opacity={0.6} />
                  <circle cx="10" cy="10" r="2" fill="#FFFFFF" opacity={0.8} />
                </svg>
              </div>
            )}
          </motion.div>

          {/* Stats as telegram transmission data */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{
              display: "inline-block",
              background: C.bgDark,
              border: `2px solid ${C.brass}`,
              padding: "14px 28px",
              marginBottom: 24,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: 12,
                letterSpacing: 2,
                color: C.paper,
                textTransform: "uppercase",
                lineHeight: 2,
              }}
            >
              {stats.map((s, i) => (
                <span key={i}>
                  {s.label.toUpperCase()}: {s.value}
                  {i < stats.length - 1 ? (
                    <span style={{ color: C.brass, margin: "0 8px" }}>STOP</span>
                  ) : (
                    <span style={{ color: C.brass, marginLeft: 8 }}>STOP</span>
                  )}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.7 }}
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: 14,
              color: C.textMuted,
              maxWidth: 500,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Full-stack AI engineer transmitting signals across the frontier of machine intelligence.
            Every project, a dispatch from the cutting edge.
          </motion.p>

          {/* Morse code border bottom */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 30, overflow: "hidden" }}>
            <MorseBorderSVG width={500} />
          </div>
        </section>

        {/* Wire decoration */}
        <TelegraphWireSVG />

        {/* ═══════════════════════════════════════════ */}
        {/*  PROJECTS SECTION                           */}
        {/* ═══════════════════════════════════════════ */}
        <section
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "20px 20px 40px",
          }}
        >
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: "center", marginBottom: 50 }}
          >
            <div
              style={{
                fontFamily: "var(--font-space-grotesk)",
                fontSize: 10,
                letterSpacing: 4,
                color: C.brass,
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Incoming Transmissions
            </div>
            <h2
              style={{
                fontFamily: "var(--font-dm-serif)",
                fontSize: "clamp(24px, 4vw, 38px)",
                color: C.paper,
                letterSpacing: 4,
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              Telegram Archive
            </h2>
            <div
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: 10,
                color: C.textMuted,
                marginTop: 8,
                letterSpacing: 2,
              }}
            >
              {projects.length} DISPATCHES ON FILE
            </div>
          </motion.div>

          {/* Tape rolls decoration */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
              padding: "0 10px",
            }}
          >
            <TapeRollSVG side="left" />
            <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${C.brass}40, transparent)`, margin: "0 10px" }} />
            <TapeRollSVG side="right" />
          </div>

          {/* Project cards grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 480px), 1fr))",
              gap: 28,
            }}
          >
            {projects.map((project, i) => (
              <TelegramCard key={project.title} project={project} index={i} />
            ))}
          </div>
        </section>

        <SectionDivider />

        {/* ═══════════════════════════════════════════ */}
        {/*  EXPERTISE SECTION                          */}
        {/* ═══════════════════════════════════════════ */}
        <section
          style={{
            maxWidth: 900,
            margin: "0 auto",
            padding: "20px 20px 40px",
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: "center", marginBottom: 40 }}
          >
            <div
              style={{
                fontFamily: "var(--font-space-grotesk)",
                fontSize: 10,
                letterSpacing: 4,
                color: C.brass,
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Priority Dispatches
            </div>
            <h2
              style={{
                fontFamily: "var(--font-dm-serif)",
                fontSize: "clamp(24px, 4vw, 36px)",
                color: C.paper,
                letterSpacing: 4,
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              Field Expertise
            </h2>
          </motion.div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 380px), 1fr))",
              gap: 24,
            }}
          >
            {expertise.map((item, i) => (
              <DispatchCard key={item.title} item={item} index={i} />
            ))}
          </div>
        </section>

        <SectionDivider />

        {/* ═══════════════════════════════════════════ */}
        {/*  TOOLS SECTION — TRANSMISSION LOG           */}
        {/* ═══════════════════════════════════════════ */}
        <section
          style={{
            maxWidth: 900,
            margin: "0 auto",
            padding: "20px 20px 60px",
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: "center", marginBottom: 40 }}
          >
            <div
              style={{
                fontFamily: "var(--font-space-grotesk)",
                fontSize: 10,
                letterSpacing: 4,
                color: C.brass,
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Equipment Registry
            </div>
            <h2
              style={{
                fontFamily: "var(--font-dm-serif)",
                fontSize: "clamp(24px, 4vw, 36px)",
                color: C.paper,
                letterSpacing: 4,
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              Transmission Log
            </h2>
          </motion.div>

          {/* Transmission log table */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{
              background: C.paper,
              border: `3px solid ${C.brass}`,
              overflow: "hidden",
            }}
          >
            {/* Table header */}
            <div
              style={{
                background: C.bgDark,
                padding: "10px 20px",
                display: "grid",
                gridTemplateColumns: "80px 120px 1fr",
                gap: 16,
                borderBottom: `2px solid ${C.brass}`,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-space-grotesk)",
                  fontSize: 10,
                  letterSpacing: 3,
                  color: C.brass,
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                Code
              </span>
              <span
                style={{
                  fontFamily: "var(--font-space-grotesk)",
                  fontSize: 10,
                  letterSpacing: 3,
                  color: C.brass,
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                Station
              </span>
              <span
                style={{
                  fontFamily: "var(--font-space-grotesk)",
                  fontSize: 10,
                  letterSpacing: 3,
                  color: C.brass,
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                Equipment Manifest
              </span>
            </div>

            {/* Table rows */}
            {tools.map((tool, i) => {
              const stationCodes = ["LANG", "FRNT", "BKND", "AIML", "DATA", "INFR"];
              return (
                <div
                  key={tool.label}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "80px 120px 1fr",
                    gap: 16,
                    padding: "12px 20px",
                    borderBottom:
                      i < tools.length - 1
                        ? `1px dashed ${C.stripe}`
                        : "none",
                    background: i % 2 === 0 ? C.paper : C.paperDark,
                    alignItems: "start",
                  }}
                >
                  {/* Station code */}
                  <span
                    style={{
                      fontFamily: "var(--font-jetbrains)",
                      fontSize: 11,
                      fontWeight: 700,
                      color: C.red,
                      letterSpacing: 2,
                    }}
                  >
                    {stationCodes[i] || "MISC"}
                  </span>

                  {/* Station name */}
                  <span
                    style={{
                      fontFamily: "var(--font-dm-serif)",
                      fontSize: 13,
                      color: C.ink,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                    }}
                  >
                    {tool.label}
                  </span>

                  {/* Equipment items */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {tool.items.map((item) => (
                      <span
                        key={item}
                        style={{
                          fontFamily: "var(--font-jetbrains)",
                          fontSize: 10,
                          color: C.bgDark,
                          background: C.brassLight,
                          border: `1px solid ${C.brass}`,
                          padding: "2px 8px",
                          letterSpacing: 1,
                          textTransform: "uppercase",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Table footer */}
            <div
              style={{
                background: C.bgDark,
                padding: "8px 20px",
                borderTop: `2px solid ${C.brass}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  fontSize: 9,
                  letterSpacing: 2,
                  color: C.textMuted,
                  textTransform: "uppercase",
                }}
              >
                {tools.reduce((acc, t) => acc + t.items.length, 0)} items registered
              </span>
              <span
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  fontSize: 9,
                  letterSpacing: 2,
                  color: C.brass,
                }}
              >
                LOG COMPLETE STOP
              </span>
            </div>
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════════ */}
        {/*  FOOTER                                     */}
        {/* ═══════════════════════════════════════════ */}
        <footer
          style={{
            borderTop: `2px solid ${C.brass}`,
            background: C.bgDark,
            padding: "0 20px",
          }}
        >
          {/* Telegraph wire decoration */}
          <TelegraphWireSVG />

          <div
            style={{
              maxWidth: 800,
              margin: "0 auto",
              padding: "40px 0 30px",
              textAlign: "center",
            }}
          >
            {/* END TRANSMISSION in morse */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <div
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  fontSize: 10,
                  letterSpacing: 4,
                  color: C.brass,
                  marginBottom: 6,
                  opacity: 0.7,
                }}
              >
                {toMorse("END TRANSMISSION")}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-dm-serif)",
                  fontSize: 20,
                  letterSpacing: 6,
                  color: C.paper,
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                End Transmission
              </div>
            </motion.div>

            {/* Decorative divider */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                margin: "20px 0",
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 1,
                  background: `linear-gradient(90deg, transparent, ${C.brass})`,
                }}
              />
              <svg width="20" height="20" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="3" fill={C.brass} />
                <circle cx="10" cy="10" r="7" fill="none" stroke={C.brass} strokeWidth="1" opacity={0.4} />
              </svg>
              <div
                style={{
                  width: 80,
                  height: 1,
                  background: `linear-gradient(90deg, ${C.brass}, transparent)`,
                }}
              />
            </div>

            {/* Company name */}
            <div
              style={{
                border: `2px double ${C.brass}`,
                display: "inline-block",
                padding: "10px 24px",
                marginBottom: 20,
                position: "relative",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-dm-serif)",
                  fontSize: 16,
                  letterSpacing: 6,
                  color: C.brass,
                  textTransform: "uppercase",
                }}
              >
                Western Grox Telegraph Co.
              </div>
              <div
                style={{
                  fontFamily: "var(--font-space-grotesk)",
                  fontSize: 9,
                  letterSpacing: 4,
                  color: C.textMuted,
                  textTransform: "uppercase",
                  marginTop: 4,
                }}
              >
                Est. 2024 — AI Engineering Division
              </div>
            </div>

            {/* Morse code footer ornament */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 16,
                marginBottom: 10,
                overflow: "hidden",
              }}
            >
              <MorseBorderSVG width={300} />
            </div>

            {/* Bottom ticker tape */}
            <div
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: 8,
                letterSpacing: 3,
                color: C.textMuted,
                textTransform: "uppercase",
                marginTop: 16,
                opacity: 0.4,
              }}
            >
              ⏁ ALL RIGHTS RESERVED ⏁ SIGNAL STRENGTH: NOMINAL ⏁ FREQUENCY: 2024-2025 ⏁
            </div>
          </div>
        </footer>

        {/* ═══════════════════════════════════════════ */}
        {/*  THEME SWITCHER                             */}
        {/* ═══════════════════════════════════════════ */}
        <ThemeSwitcher current="/telegraph" variant="dark" />
      </div>
    </>
  );
}
